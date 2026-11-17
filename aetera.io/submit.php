<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://aetera.io');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Vary: Origin');

// --- Config ---
define('TO_EMAILS', ['info@aetera.io', '5760456@gmail.com', 'scmk@mail.ru']);
define('FROM_EMAIL',   'noreply@aetera.io');
define('DATA_FILE',    __DIR__ . '/data/submissions.json');
define('RATE_FILE',    __DIR__ . '/data/rate_limits.json');
define('ERROR_LOG',    __DIR__ . '/data/errors.log');
define('CSRF_SECRET',  'ae6068748d3a53e660fe77eb9ab42c4adc5c9c74b3d27071cf357ba10ccd07ca');
define('RATE_IP_MAX',  5);   // per IP per hour
define('RATE_GLOB_MAX', 20); // global per hour

// --- Logging helper ---
function log_error(string $msg): void {
    $line = date('c') . ' ' . $msg . PHP_EOL;
    @file_put_contents(ERROR_LOG, $line, FILE_APPEND | LOCK_EX);
}

// --- CSRF helpers ---
function csrf_valid(string $token): bool {
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2) return false;
    [$ts, $sig] = $parts;
    if (!ctype_digit($ts)) return false;
    if (abs(time() - (int)$ts) > 1800) return false;
    $expected = hash_hmac('sha256', $ts, CSRF_SECRET);
    return hash_equals($expected, $sig);
}

// --- GET: выдать свежий CSRF токен ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    $ts  = (string)time();
    $sig = hash_hmac('sha256', $ts, CSRF_SECRET);
    echo json_encode(['token' => "$ts.$sig"]);
    exit;
}

// --- Только POST дальше ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!csrf_valid($csrfHeader)) {
    http_response_code(403);
    log_error("CSRF rejected ip={$_SERVER['REMOTE_ADDR']} token=" . substr($csrfHeader, 0, 40));
    echo json_encode(['success' => false, 'error' => 'Invalid or expired CSRF token']);
    exit;
}

// --- Rate limiting ---
function check_rate(string $ip): bool {
    $now   = time();
    $hour  = 3600;
    $data  = [];

    if (!is_dir(dirname(RATE_FILE))) {
        mkdir(dirname(RATE_FILE), 0755, true);
    }

    if (file_exists(RATE_FILE)) {
        $raw  = file_get_contents(RATE_FILE);
        $data = json_decode($raw, true) ?? [];
    }

    // Purge entries older than 1 hour
    $data['global'] = array_values(array_filter($data['global'] ?? [], fn($t) => $now - $t < $hour));
    $data['ips'][$ip] = array_values(array_filter($data['ips'][$ip] ?? [], fn($t) => $now - $t < $hour));

    if (count($data['global']) >= RATE_GLOB_MAX) return false;
    if (count($data['ips'][$ip]) >= RATE_IP_MAX) return false;

    $data['global'][]    = $now;
    $data['ips'][$ip][]  = $now;

    file_put_contents(RATE_FILE, json_encode($data), LOCK_EX);
    return true;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!check_rate($ip)) {
    http_response_code(429);
    log_error("Rate limit hit ip=$ip");
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again later.']);
    exit;
}

// --- Read input ---
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    $data = $_POST;
}

// --- Sanitize (strip \r\n to prevent header injection) ---
function safe(string $val): string {
    return preg_replace('/[\r\n\t]/', ' ', htmlspecialchars(trim($val), ENT_QUOTES, 'UTF-8'));
}

$entry = [
    'id'          => uniqid('aetera_', true),
    'timestamp'   => date('c'),
    'ip'          => $ip,
    'fullname'    => safe($data['fullname'] ?? $data['firstName'] ?? ''),
    'email'       => filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL),
    'company'     => safe($data['company'] ?? $data['organization'] ?? ''),
    'linkedin'    => safe($data['linkedin'] ?? ''),
    'notes'       => safe($data['notes'] ?? $data['message'] ?? ''),
];

// --- Validate required fields ---
if (empty($entry['email']) || !filter_var($entry['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

if (empty($entry['fullname'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Full name is required']);
    exit;
}

// --- Save to JSON ---
if (!is_dir(dirname(DATA_FILE))) {
    mkdir(dirname(DATA_FILE), 0755, true);
}

$submissions = [];
if (file_exists(DATA_FILE)) {
    $existing    = file_get_contents(DATA_FILE);
    $submissions = json_decode($existing, true) ?? [];
}

$submissions[] = $entry;
file_put_contents(DATA_FILE, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

// --- Send email ---
$name    = trim($entry['fullname']) ?: 'Unknown';
$subject = '[aetera] Inquiry — ' . $name;

$body  = "New inquiry received via aetera.io\n";
$body .= str_repeat('-', 40) . "\n\n";
$body .= "Name:      " . $name . "\n";
$body .= "Email:     " . $entry['email'] . "\n";
$body .= "Company:   " . $entry['company'] . "\n";
$body .= "LinkedIn:  " . $entry['linkedin'] . "\n";
$body .= "Time:      " . $entry['timestamp'] . "\n";
$body .= "IP:        " . $entry['ip'] . "\n\n";
if (!empty($entry['notes'])) {
    $body .= "Notes / Areas of Interest:\n" . $entry['notes'] . "\n\n";
}
$body .= str_repeat('-', 40) . "\n";
$body .= "ID: " . $entry['id'] . "\n";

$headers  = "From: aetera <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: " . $entry['email'] . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: aetera/1.0\r\n";

foreach (TO_EMAILS as $recipient) {
    $sent = mail($recipient, $subject, $body, $headers);
    if (!$sent) {
        log_error("mail() failed id={$entry['id']} to=$recipient from=$ip");
    }
}

// --- Respond ---
echo json_encode([
    'success' => true,
    'id'      => $entry['id'],
]);

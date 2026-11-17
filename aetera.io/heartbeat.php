<?php
header('Content-Type: application/json');

define('ACTIVE_FILE', __DIR__ . '/data/active.json');
define('ACTIVE_TTL',  90); // seconds — visitor considered active

$ip = trim(explode(',', (
    $_SERVER['HTTP_CF_CONNECTING_IP'] ??
    $_SERVER['HTTP_X_FORWARDED_FOR']  ??
    $_SERVER['REMOTE_ADDR']           ??
    '0.0.0.0'
))[0]);

$country = '';
$cf = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? '';
if ($cf && $cf !== 'XX' && $cf !== 'T1' && strlen($cf) === 2) {
    $country = strtoupper($cf);
}

// UA — quick bot check (don't track bots as "online")
$ua    = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$bots  = ['bot','crawl','spider','curl','wget','python','headless','monitor'];
foreach ($bots as $b) { if (str_contains($ua, $b)) { echo json_encode(['ok'=>false]); exit; } }

$now  = time();
if (!is_dir(dirname(ACTIVE_FILE))) mkdir(dirname(ACTIVE_FILE), 0755, true);

$data = file_exists(ACTIVE_FILE) ? (json_decode(file_get_contents(ACTIVE_FILE), true) ?? []) : [];

// Remove expired entries
foreach ($data as $k => $v) {
    if ($now - ($v['ts'] ?? 0) >= ACTIVE_TTL) unset($data[$k]);
}

// Update this visitor
$data[$ip] = [
    'ip'      => $ip,
    'country' => $country ?: ($data[$ip]['country'] ?? ''),
    'ts'      => $now,
    'first'   => $data[$ip]['first'] ?? $now,
];

file_put_contents(ACTIVE_FILE, json_encode(array_values($data), JSON_PRETTY_PRINT), LOCK_EX);

echo json_encode(['ok' => true, 'active' => count($data)]);

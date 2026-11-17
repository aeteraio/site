<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://aetera.io');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

define('ANALYTICS_FILE', __DIR__ . '/data/analytics.json');
define('RATE_FILE',      __DIR__ . '/data/rate_track.json');
define('RATE_MAX',       5); // max 5 events per IP per hour

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// Real IP (handles CloudFlare proxy)
$ip = trim(explode(',', (
    $_SERVER['HTTP_CF_CONNECTING_IP'] ??
    $_SERVER['HTTP_X_FORWARDED_FOR'] ??
    $_SERVER['REMOTE_ADDR'] ??
    '0.0.0.0'
))[0]);

// Rate limiting
function rate_ok(string $ip): bool {
    $now  = time();
    $data = file_exists(RATE_FILE) ? (json_decode(file_get_contents(RATE_FILE), true) ?? []) : [];
    $data[$ip] = array_values(array_filter($data[$ip] ?? [], fn($t) => $now - $t < 3600));
    if (count($data[$ip]) >= RATE_MAX) return false;
    $data[$ip][] = $now;
    file_put_contents(RATE_FILE, json_encode($data), LOCK_EX);
    return true;
}
if (!rate_ok($ip)) { echo json_encode(['ok' => false, 'reason' => 'rate']); exit; }

// -------------------------------------------------------
// Country detection
// Priority 1: CloudFlare header (instant, free, if behind CF)
// Priority 2: PHP geoip extension
// Priority 3: Local cache + server-side ip-api.com lookup
//             (PHP→API call, NOT browser call — invisible to user)
// -------------------------------------------------------
function detect_country(string $ip): string {
    // 1. CloudFlare
    $cf = $_SERVER['HTTP_CF_IPCOUNTRY'] ?? '';
    if ($cf && $cf !== 'XX' && $cf !== 'T1' && strlen($cf) === 2) {
        return strtoupper($cf);
    }
    // 2. PHP geoip extension
    if (function_exists('geoip_country_code_by_name')) {
        $code = @geoip_country_code_by_name($ip);
        if ($code) return strtoupper($code);
    }
    // 3. Cache file + ip-api.com (server-side PHP call, cached 30 days)
    $cache_file = __DIR__ . '/data/geo_cache.json';
    $cache = file_exists($cache_file) ? (json_decode(file_get_contents($cache_file), true) ?? []) : [];
    if (isset($cache[$ip])) return $cache[$ip];

    // Skip private/local IPs
    if (str_starts_with($ip, '127.') || str_starts_with($ip, '192.168.')
        || str_starts_with($ip, '10.') || $ip === '::1') return '';

    // Server-side HTTP call (not visible to browser, no tracking)
    $ctx = stream_context_create(['http' => ['timeout' => 2]]);
    $res = @file_get_contents("http://ip-api.com/json/{$ip}?fields=countryCode", false, $ctx);
    if ($res) {
        $json = json_decode($res, true);
        $code = strtoupper($json['countryCode'] ?? '');
        if (strlen($code) === 2) {
            $cache[$ip] = $code;
            // Keep cache max 5000 entries
            if (count($cache) > 5000) $cache = array_slice($cache, -4000, null, true);
            @file_put_contents($cache_file, json_encode($cache), LOCK_EX);
            return $code;
        }
    }
    return '';
}

// UA parsing
$ua    = $_SERVER['HTTP_USER_AGENT'] ?? '';
$ua_lc = strtolower($ua);

$bot_kw = [
    'bot','crawl','spider','slurp','fetch','scan','monitor','checker',
    'validator','curl','wget','python','java/','ruby','php/','go-http',
    'axios','scrapy','httpclient','headless','lighthouse','pingdom',
    'datadog','newrelic','uptimerobot','statuscake','site24x7',
];
$is_bot = false;
foreach ($bot_kw as $kw) {
    if (str_contains($ua_lc, $kw)) { $is_bot = true; break; }
}

$device = match(1) {
    (int)(bool)preg_match('/iPad|Tablet/i', $ua)           => 'Tablet',
    (int)(bool)preg_match('/Mobile|Android|iPhone/i', $ua) => 'Mobile',
    default                                                  => 'Desktop',
};
$browser = match(1) {
    (int)(bool)preg_match('/Edg\//i', $ua)     => 'Edge',
    (int)(bool)preg_match('/Chrome\//i', $ua)  => 'Chrome',
    (int)(bool)preg_match('/Firefox\//i', $ua) => 'Firefox',
    (int)(bool)preg_match('/Safari\//i', $ua)  => 'Safari',
    default                                    => 'Other',
};

$body    = file_get_contents('php://input');
$payload = json_decode($body, true) ?? [];

$ref = $_SERVER['HTTP_REFERER'] ?? '';
$ref = $ref ? (parse_url($ref, PHP_URL_HOST) ?: $ref) : 'direct';

// sections_time: { "01 Hero": 12, "02 Thesis": 45, … } — seconds per section
$st_raw        = is_array($payload['sections_time'] ?? null) ? $payload['sections_time'] : [];
$sections_time = [];
foreach ($st_raw as $k => $v) {
    if (is_string($k) && strlen($k) <= 60 && is_numeric($v)) {
        $secs = max(0, min(7200, (int)round((float)$v)));
        $sections_time[$k] = $secs; // keep 0s — means "seen but too briefly"
    }
}

$entry = [
    'ts'            => date('c'),
    'ip'            => $ip,
    'country'       => detect_country($ip),
    'bot'           => $is_bot,
    'ref'           => $ref,
    'device'        => $device,
    'browser'       => $browser,
    'lang'          => in_array($payload['lang'] ?? '', ['en', 'ru']) ? $payload['lang'] : 'en',
    'screen'        => preg_replace('/[^0-9x]/', '', $payload['screen'] ?? ''),
    'time'          => max(0, min(7200, (int)($payload['time'] ?? 0))),
    'sections'      => array_keys($sections_time),
    'sections_time' => $sections_time,
];

if (!is_dir(dirname(ANALYTICS_FILE))) mkdir(dirname(ANALYTICS_FILE), 0755, true);
$all   = file_exists(ANALYTICS_FILE) ? (json_decode(file_get_contents(ANALYTICS_FILE), true) ?? []) : [];
$all[] = $entry;
file_put_contents(ANALYTICS_FILE, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

echo json_encode(['ok' => true]);

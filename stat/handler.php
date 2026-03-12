<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.0 403 Forbidden');
    exit;
}

$log_file = __DIR__ . '/visits.log.php';
if (!file_exists($log_file)) {
    file_put_contents($log_file, "<?php exit; ?>\n");
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$date = date('d.m.Y H:i:s');
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$ref = $_SERVER['HTTP_REFERER'] ?? 'Прямой заход';

// Определение ОС
$os = "Unknown OS";
if (preg_match('/windows|win32/i', $ua)) $os = 'Windows';
else if (preg_match('/android/i', $ua)) $os = 'Android';
else if (preg_match('/iphone|ipad|ipod/i', $ua)) $os = 'iOS';
else if (preg_match('/macintosh|mac os x/i', $ua)) $os = 'macOS';
else if (preg_match('/linux/i', $ua)) $os = 'Linux';

// Определение Браузера
$browser = "Unknown Browser";
if (preg_match('/chrome/i', $ua)) $browser = 'Chrome';
else if (preg_match('/firefox/i', $ua)) $browser = 'Firefox';
else if (preg_match('/safari/i', $ua)) $browser = 'Safari';
else if (preg_match('/opera|opr/i', $ua)) $browser = 'Opera';
else if (preg_match('/edge/i', $ua)) $browser = 'Edge';

// Определение типа устройства
$device = (preg_match('/mobile|android|iphone|ipad/i', $ua)) ? "📱 Mobile" : "💻 Desktop";

// Проверка на робота
$is_bot = (preg_match('/bot|spider|crawler|slurp|curl|fetch/i', $ua)) ? "🤖 БОТ" : "👤 ЧЕЛ";

$input = json_decode(file_get_contents('php://input'), true);
$action = ($input['act'] === 'init') ? "🔵 ВХОД" : "🔴 ВЫХОД";
$path = $input['pth'] ?? '/';

// Формат строки для лога:
// Тип | Статус | Дата | Страница | IP | Реферер | Браузер | ОС | Устройство
$entry = "$is_bot | $action | $date | $path | $ip | $ref | $browser | $os | $device" . PHP_EOL;

file_put_contents($log_file, $entry, FILE_APPEND);
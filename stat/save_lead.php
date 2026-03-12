<?php
// stat/save_lead.php
// Сохраняет заявку из формы в leads_data.log.php

// Заголовки для JSON-ответа
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Разрешаем логирование ошибок PHP
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Получаем сырые данные
$input = file_get_contents('php://input');
error_log('save_lead.php: Raw input: ' . substr($input, 0, 200));

// Декодируем JSON
$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('save_lead.php: JSON error: ' . json_last_error_msg());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Валидация обязательных полей
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    error_log('save_lead.php: Missing required fields');
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields: name, email, message']);
    exit;
}

// Санитизация входных данных
$name = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars(trim($data['email']), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');
$timestamp = $data['timestamp'] ?? date('c');
$user_agent = htmlspecialchars(trim($data['user_agent'] ?? ''), ENT_QUOTES, 'UTF-8');
$page = htmlspecialchars(trim($data['page'] ?? ''), ENT_QUOTES, 'UTF-8');

// Получаем IP
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
}
$ip = trim($ip);

// Формируем строку лога
$log_entry = sprintf(
    "📬 NEW LEAD | %s | Name: %s | Email: %s | Message: %s | IP: %s | Page: %s | UA: %s",
    $timestamp,
    $name,
    $email,
    $message,
    $ip,
    $page,
    $user_agent
);

// Пути к файлам
$log_file = __DIR__ . '/leads_data.log.php';
error_log('save_lead.php: Log file path: ' . $log_file);

// Если файл не существует — создаём с защитой
if (!file_exists($log_file)) {
    $created = file_put_contents($log_file, "<?php exit; ?>\n", LOCK_EX);
    if ($created === false) {
        error_log('save_lead.php: FAILED to create leads_data.log.php');
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Cannot create log file. Check permissions.']);
        exit;
    }
    error_log('save_lead.php: Created new leads_data.log.php');
}

// Проверяем права на запись
if (!is_writable(dirname($log_file))) {
    error_log('save_lead.php: Directory not writable: ' . dirname($log_file));
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Directory not writable: ' . dirname($log_file)]);
    exit;
}

// Записываем заявку (на новой строке!)
$result = file_put_contents($log_file, $log_entry . "\n", FILE_APPEND | LOCK_EX);

if ($result === false) {
    error_log('save_lead.php: FAILED to write to leads_data.log.php');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Cannot write to log file. Check permissions.']);
    exit;
}

error_log('save_lead.php: Successfully saved lead from ' . $ip);

// Успешный ответ
echo json_encode(['success' => true, 'message' => 'Lead saved successfully']);
exit;
?>
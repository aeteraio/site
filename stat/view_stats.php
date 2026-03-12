<?php
// --- НАСТРОЙКИ БЕЗОПАСНОСТИ ---
$secret_password = 'pass111';
$pass = $_GET['pass'] ?? '';
if ($pass !== $secret_password) {
    header('HTTP/1.0 403 Forbidden');
    exit("<h2 style='color:red;text-align:center;margin-top:50px;'>Доступ запрещен.</h2>");
}

$log_file   = __DIR__ . '/visits.log.php';
$leads_file = __DIR__ . '/leads_data.log.php';

// Логика очистки
if (isset($_POST['clear_log'])) {
    file_put_contents($log_file, "<?php exit; ?>\n");
    header("Location: view_stats.php?pass=".urlencode($pass)."&tab=stats"); exit;
}
if (isset($_POST['clear_leads'])) {
    file_put_contents($leads_file, "<?php exit; ?>\n");
    header("Location: view_stats.php?pass=".urlencode($pass)."&tab=leads"); exit;
}

$mode = $_GET['mode'] ?? 'all'; 
$current_tab = $_GET['tab'] ?? 'stats';

// Загрузка логов
$lines = file_exists($log_file) ? array_reverse(file($log_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES)) : [];
$lines = array_filter($lines, function($line) { return strpos($line, '<?php') === false; });

// Сбор метрик для верхних окошек
$stats = ['total' => 0, 'unique_ips' => [], 'bots' => 0, 'human' => 0];
foreach ($lines as $line) {
    $d = explode(' | ', $line);
    if (count($d) < 5) continue;
    $stats['total']++;
    $ip_clean = trim($d[4]);
    $stats['unique_ips'][$ip_clean] = true;
    if (strpos($d[0], '🤖') !== false) $stats['bots']++; else $stats['human']++;
}

// Фильтрация уникальных IP для таблицы (если выбран режим)
if ($mode === 'unique') {
    $temp_ips = [];
    $filtered = [];
    foreach ($lines as $line) {
        $parts = explode(' | ', $line);
        if (isset($parts[4])) {
            $ip_key = trim($parts[4]);
            if (!isset($temp_ips[$ip_key])) {
                $temp_ips[$ip_key] = true;
                $filtered[] = $line;
            }
        }
    }
    $lines = $filtered;
}

// Загрузка заявок
$leads = file_exists($leads_file) ? array_reverse(file($leads_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES)) : [];
$leads = array_filter($leads, function($line) { return strpos($line, '<?php') === false; });
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Админ-панель Aetera</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f7f6; padding: 20px; color: #2d3748; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        
        /* Стили верхних карточек */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .stat-card { background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center; }
        .stat-card b { display: block; font-size: 24px; color: #3182ce; }
        .stat-card span { font-size: 13px; color: #718096; text-transform: uppercase; letter-spacing: 1px; }
        
        /* Табы */
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab-btn { padding: 8px 16px; background: #edf2f7; border-radius: 6px; text-decoration: none; color: #4a5568; font-weight: 500; transition: all 0.2s; }
        .tab-btn.active { background: #3182ce; color: white; }
        .tab-btn:hover { background: #bee3f8; }
        
        /* Управление */
        .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .btn-clear { background: #e53e3e; color: white; border: none; }
        .btn-clear:hover { background: #c53030; }
        .btn-toggle { background: #e2e8f0; color: #4a5568; border: none; }
        .btn-toggle.active { background: #68d391; color: white; }
        .btn-toggle:hover { background: #cbd5e0; }
        
        /* Поиск */
        .search-container { display: flex; gap: 10px; }
        input[type="text"] { padding: 8px 12px; border: 1px solid #d2d6dc; border-radius: 6px; width: 250px; outline: none; transition: border 0.2s; }
        input[type="text"]:focus { border-color: #3182ce; }
        
        /* Таблица */
        table { width: 100%; border-collapse: collapse; font-size: 14px; background: #f8fafc; border-radius: 8px; overflow: hidden; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #edf2f7; font-weight: 600; color: #4a5568; }
        tr:hover { background: #f1f5f9; }
        
        /* IP блок */
        .ip-block { display: flex; align-items: center; gap: 10px; }
        .ip-links { display: flex; gap: 5px; font-size: 12px; }
        .ip-links a { color: #3182ce; text-decoration: none; }
        .ip-links a:hover { text-decoration: underline; }
        
        /* Тех. инфо */
        .tech-info { font-size: 12px; color: #718096; margin-top: 4px; }
        
        /* Адаптив для мобильных */
        @media (max-width: 768px) {
            .stats-grid { grid-template-columns: 1fr; }
            .controls { flex-direction: column; gap: 10px; }
            table { font-size: 12px; }
            th, td { padding: 8px; }
            .ip-block { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
<div class="container">

    <div class="tabs">
        <a href="?pass=<?= htmlspecialchars($pass) ?>&tab=stats" class="tab-btn <?= $current_tab === 'stats' ? 'active' : '' ?>">📊 Статистика</a>
        <a href="?pass=<?= htmlspecialchars($pass) ?>&tab=leads" class="tab-btn <?= $current_tab === 'leads' ? 'active' : '' ?>">📬 Заявки</a>
    </div>

    <?php if ($current_tab === 'stats'): ?>

        <div class="stats-grid">
            <div class="stat-card"><b><?= $stats['total'] ?></b><span>Всего событий</span></div>
            <div class="stat-card"><b><?= count($stats['unique_ips']) ?></b><span>Уникальных IP</span></div>
            <div class="stat-card"><b><?= $stats['human'] ?></b><span>Человеческих визитов</span></div>
            <div class="stat-card"><b><?= $stats['bots'] ?></b><span>Ботов</span></div>
        </div>

        <div class="controls">
            <div class="search-container">
                <input type="text" id="searchInput" onkeyup="filterTable()" placeholder="Поиск по логам...">
                <button class="btn btn-toggle" onclick="toggleBots(this)">🤖 Показать ботов</button>
            </div>
            <div>
                <a href="?pass=<?= htmlspecialchars($pass) ?>&mode=all&tab=stats" class="btn" style="background:#edf2f7; color:#4a5568;">Все</a>
                <a href="?pass=<?= htmlspecialchars($pass) ?>&mode=unique&tab=stats" class="btn" style="background:#edf2f7; color:#4a5568;">Только уникальные IP</a>
                <form method="POST" onsubmit="return confirm('Удалить все логи?');" style="display:inline;">
                    <button type="submit" name="clear_log" class="btn btn-clear">🗑 Очистить логи</button>
                </form>
            </div>
        </div>

        <table id="statsTable">
            <thead>
                <tr>
                    <th style="width:15%">Тип / Статус</th>
                    <th style="width:15%">Дата / Время</th>
                    <th style="width:10%">Страница</th>
                    <th style="width:20%">IP</th>
                    <th>Реферер / Тех. инфо</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($lines as $line): ?>
                <?php $d = explode(' | ', $line); if (count($d) < 5) continue; ?>
                <tr data-bot="<?= strpos($d[0], '🤖') !== false ? '1' : '0' ?>">
                    <td>
                        <span style="font-weight:500; color:<?= strpos($d[1], 'ВХОД') ? '#3182ce' : '#e53e3e' ?>;"><?= htmlspecialchars($d[0] . ' ' . $d[1]) ?></span>
                    </td>
                    <td style="color:#4a5568;"><?= htmlspecialchars($d[2] ?? '—') ?></td>
                    <td style="color:#718096;"><?= htmlspecialchars($d[3] ?? '—') ?></td>
                    <td class="ip-block">
                        <?php $ip_val = htmlspecialchars($d[4] ?? '—'); ?>
                        <b><?= htmlspecialchars($ip_val); ?></b>
                        <div class="ip-links">
                            <a href="https://ip-api.com/#<?php echo $ip_val; ?>" target="_blank">IP-API</a>
                            <a href="https://geodatatool.com/en?ip=<?php echo $ip_val; ?>" target="_blank">Whois</a>
                        </div>
                    </td>
                    <td>
                        <div style="font-weight:500; color:#4a5568;"><?php echo htmlspecialchars($d[5] ?? '—'); ?></div>
                        <div class="tech-info">
                            <b>Браузер:</b> <?php echo htmlspecialchars($d[6] ?? '—'); ?> | 
                            <b>ОС:</b> <?php echo htmlspecialchars($d[7] ?? '—'); ?> | 
                            <b>Тип:</b> <?php echo htmlspecialchars($d[8] ?? '—'); ?>
                        </div>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>

    <?php else: ?>
        <div class="controls">
            <h3 style="margin:0;">Данные из форм</h3>
            <form method="POST" onsubmit="return confirm('Удалить все заявки?');" style="margin-left:auto;">
                <button type="submit" name="clear_leads" class="btn btn-clear">🗑 Очистить заявки</button>
            </form>
        </div>
        <?php if (empty($leads)): ?>
            <div style="text-align:center; padding:100px; color:#a0aec0; background:#f8fafc; border-radius:8px;">Заявок не обнаружено.</div>
        <?php else: ?>
            <div style="background:#f8fafc; padding:15px; border-radius:8px;">
            <?php foreach ($leads as $lead): ?>
                <div style="padding:10px; border-bottom:1px solid #e2e8f0; font-family:monospace; font-size:14px;">
                    <?php echo htmlspecialchars($lead); ?>
                </div>
            <?php endforeach; ?>
            </div>
        <?php endif; ?>
    <?php endif; ?>
</div>

<script>
function filterTable() {
    let input = document.getElementById("searchInput").value.toUpperCase();
    let rows = document.querySelectorAll("#statsTable tbody tr");
    let botsBtn = document.querySelector('button[onclick="toggleBots(this)"]');
    let showBots = botsBtn.classList.contains('active');

    rows.forEach(row => {
        let text = row.innerText.toUpperCase();
        let isBot = row.getAttribute('data-bot') === '1';
        let matchesSearch = text.includes(input);
        
        if (isBot && !showBots) {
            row.style.display = "none";
        } else {
            row.style.display = matchesSearch ? "" : "none";
        }
    });
}

function toggleBots(btn) {
    btn.classList.toggle('active');
    let show = btn.classList.contains('active');
    btn.innerText = show ? "🤖 Скрыть ботов" : "🤖 Показать ботов";
    
    // После переключения состояния ботов вызываем фильтр, чтобы учесть и поиск
    filterTable();
}
</script>
</body>
</html>
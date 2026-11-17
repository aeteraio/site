<?php
session_start();

define('PASS_HASH',       '6ef9bbae8d2c357fa62aecca344a56dfb578214c2a35a35f557a6b9c5ee21692');
define('ANALYTICS_FILE',  dirname(__DIR__) . '/data/analytics.json');
define('SUBMISSIONS_FILE', dirname(__DIR__) . '/data/submissions.json');

// Auth
if (isset($_POST['password'])) {
    if (hash('sha256', $_POST['password']) === PASS_HASH) {
        $_SESSION['auth'] = true;
    } else {
        $error = 'Неверный пароль';
    }
}
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: /admin/');
    exit;
}

$authed = !empty($_SESSION['auth']);

// Filters from GET
$filter_ip     = trim($_GET['ip']     ?? '');
$filter_period = $_GET['period']      ?? 'all';
$filter_device = trim($_GET['device'] ?? '');
$filter_type   = $_GET['type']        ?? 'humans'; // humans | bots | all
$show_all      = isset($_GET['all']);

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
function fmt_time(int $s): string {
    if ($s < 60) return "{$s}с";
    $m = intdiv($s, 60); $sc = $s % 60;
    return $sc ? "{$m}м {$sc}с" : "{$m}м";
}

function period_start(string $period): int {
    return match($period) {
        'today' => strtotime('today'),
        'week'  => strtotime('-7 days'),
        'month' => strtotime('-30 days'),
        default => 0,
    };
}

// Country code → emoji flag (pure Unicode arithmetic, no external libs)
function country_flag(string $code): string {
    if (strlen($code) !== 2) return '';
    $flag = '';
    foreach (str_split(strtoupper($code)) as $c) {
        $flag .= mb_chr(ord($c) - ord('A') + 0x1F1E6, 'UTF-8');
    }
    return $flag;
}

// -------------------------------------------------------
// Active visitors (heartbeat)
// -------------------------------------------------------
function load_active(): array {
    $file = dirname(ANALYTICS_FILE) . '/active.json';
    if (!file_exists($file)) return [];
    $data = json_decode(file_get_contents($file), true) ?? [];
    $ttl  = 90;
    return array_values(array_filter($data, fn($v) => time() - ($v['ts'] ?? 0) < $ttl));
}

// -------------------------------------------------------
// Load & process data
// -------------------------------------------------------
$stats = [];
if ($authed) {
    $raw = file_exists(ANALYTICS_FILE) ? file_get_contents(ANALYTICS_FILE) : '[]';
    $all = json_decode($raw, true) ?? [];

    $humans_all = array_values(array_filter($all, fn($r) => !$r['bot']));
    $bots_all   = array_values(array_filter($all, fn($r) =>  $r['bot']));

    // Apply period filter
    $since = period_start($filter_period);
    $humans = $since > 0
        ? array_values(array_filter($humans_all, fn($r) => strtotime($r['ts']) >= $since))
        : $humans_all;
    $bots = $since > 0
        ? array_values(array_filter($bots_all, fn($r) => strtotime($r['ts']) >= $since))
        : $bots_all;

    // Pool for table display based on type filter
    $pool = match($filter_type) {
        'bots' => $bots,
        'all'  => array_merge($humans, $bots),
        default => $humans,
    };
    usort($pool, fn($a,$b) => strcmp($b['ts'], $a['ts']));

    // Apply IP + device filter on pool
    $filtered = $pool;
    if ($filter_ip !== '') {
        $filtered = array_values(array_filter($filtered, fn($r) => $r['ip'] === $filter_ip));
    }
    if ($filter_device !== '') {
        $filtered = array_values(array_filter($filtered, fn($r) => ($r['device'] ?? '') === $filter_device));
    }

    // Unique IPs (humans only)
    $ips = array_unique(array_column($humans, 'ip'));

    // Avg time (humans, >3s)
    $times    = array_filter(array_column($humans, 'time'), fn($t) => $t > 3);
    $avg_time = count($times) ? round(array_sum($times) / count($times)) : 0;

    // Referrers
    $refs = [];
    foreach ($humans as $r) {
        $ref = $r['ref'] ?: 'direct';
        $refs[$ref] = ($refs[$ref] ?? 0) + 1;
    }
    arsort($refs);

    // Sections — visit count + total/avg time
    $sec_visits = [];
    $sec_total  = []; // total seconds
    foreach ($humans as $r) {
        $st = $r['sections_time'] ?? [];
        // fallback: if no sections_time but has sections array
        if (empty($st) && !empty($r['sections'])) {
            foreach ($r['sections'] as $s) {
                $sec_visits[$s] = ($sec_visits[$s] ?? 0) + 1;
            }
        } else {
            foreach ($st as $s => $secs) {
                $sec_visits[$s] = ($sec_visits[$s] ?? 0) + 1;
                $sec_total[$s]  = ($sec_total[$s]  ?? 0) + $secs;
            }
        }
    }
    arsort($sec_visits);

    // Devices & browsers
    $devices  = array_count_values(array_column($humans, 'device'));
    $browsers = array_count_values(array_column($humans, 'browser'));
    arsort($devices);
    arsort($browsers);

    // Languages
    $langs = array_count_values(array_column($humans, 'lang'));
    arsort($langs);

    // Top IPs (humans)
    $ip_counts = array_count_values(array_column($humans, 'ip'));
    arsort($ip_counts);
    $top_ips = array_slice($ip_counts, 0, 15, true);

    // Top Countries
    $countries = [];
    foreach ($humans as $r) {
        $c = $r['country'] ?? '';
        if ($c) $countries[$c] = ($countries[$c] ?? 0) + 1;
    }
    arsort($countries);

    // Group by IP
    $grouped_filtered = [];
    foreach ($filtered as $r) {
        $ip = $r['ip'];
        if (!isset($grouped_filtered[$ip])) {
            $grouped_filtered[$ip] = [
                'main' => $r,
                'history' => []
            ];
        } else {
            $grouped_filtered[$ip]['history'][] = $r;
        }
    }
    $grouped_filtered_values = array_values($grouped_filtered);

    // Table rows
    $display_limit = $show_all ? count($grouped_filtered_values) : 50;
    $recent_groups = array_slice($grouped_filtered_values, 0, $display_limit);
    
    // For counting logic
    $recent = array_slice($filtered, 0, $display_limit);

    // Submissions
    $subs_raw    = file_exists(SUBMISSIONS_FILE) ? file_get_contents(SUBMISSIONS_FILE) : '[]';
    $subs_all    = json_decode($subs_raw, true) ?? [];
    $subs_recent = array_slice(array_reverse($subs_all), 0, 20);

    $active = load_active();

    $stats = compact(
        'all','humans','bots','ips','avg_time','refs',
        'sec_visits','sec_total',
        'langs','devices','browsers','top_ips','countries',
        'recent','filtered','subs_recent','active','recent_groups'
    );
}

function url_with(array $params): string {
    $current = $_GET;
    foreach ($params as $k => $v) {
        if ($v === null) unset($current[$k]);
        else $current[$k] = $v;
    }
    $q = http_build_query($current);
    return '/admin/' . ($q ? '?' . $q : '');
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>aetera — stats</title>
<meta name="robots" content="noindex, nofollow">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:     #0f0f0f;
    --bg2:    #1a1a1a;
    --bg3:    #222;
    --accent: #B8895A;
    --green:  #6dd488;
    --red:    #e05566;
    --white:  #ebebeb;
    --gray:   #888;
    --border: rgba(235,235,235,0.08);
  }
  body { font-family: 'Arial', sans-serif; background: var(--bg); color: var(--white); font-size: 14px; min-height: 100vh; }

  /* Login */
  .login { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .login-box { background: var(--bg2); border: 1px solid var(--border); padding: 40px; width: 320px; }
  .login-box h1 { font-size: 20px; letter-spacing: 0.1em; margin-bottom: 24px; color: var(--accent); }
  .login-box input { width: 100%; background: var(--bg3); border: 1px solid var(--border); color: var(--white); padding: 10px 14px; font-size: 14px; margin-bottom: 12px; outline: none; }
  .login-box input:focus { border-color: var(--accent); }
  .login-box button { width: 100%; background: var(--accent); color: #000; border: none; padding: 11px; font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: 0.05em; }
  .error { color: var(--red); font-size: 12px; margin-bottom: 10px; }

  /* Header */
  .header { background: var(--bg2); border-bottom: 1px solid var(--border); padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .header h1 { font-size: 15px; letter-spacing: 0.15em; color: var(--accent); }
  .header-right { display: flex; align-items: center; gap: 20px; }
  .header a { color: var(--gray); text-decoration: none; font-size: 12px; }
  .header a:hover { color: var(--white); }

  /* Tabs */
  .tabs { display: flex; gap: 4px; background: var(--bg2); border-bottom: 1px solid var(--border); padding: 0 32px; }
  .tab { padding: 12px 20px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gray); text-decoration: none; border-bottom: 2px solid transparent; cursor: pointer; }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab-panel { display: none; }
  .tab-panel.active { display: block; }

  .wrap { padding: 24px 32px; max-width: 1400px; }

  /* Filter bar */
  .filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
  .filter-bar .lbl { font-size: 11px; color: var(--gray); letter-spacing: 0.08em; text-transform: uppercase; }
  .filter-btn { padding: 6px 14px; font-size: 11px; letter-spacing: 0.06em; background: var(--bg2); border: 1px solid var(--border); color: var(--gray); text-decoration: none; cursor: pointer; white-space: nowrap; }
  .filter-btn:hover { border-color: var(--accent); color: var(--white); }
  .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #000; font-weight: 700; }
  .filter-btn.bot-btn.active { background: var(--red); border-color: var(--red); }
  .filter-active { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: rgba(184,137,90,0.12); border: 1px solid var(--accent); font-size: 12px; }
  .filter-active a { color: var(--accent); text-decoration: none; margin-left: 8px; font-size: 14px; }
  .filter-active a:hover { color: var(--white); }
  .filter-sep { color: var(--border); margin: 0 4px; }

  /* Cards */
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .card { background: var(--bg2); border: 1px solid var(--border); padding: 18px 20px; }
  .card .label { font-size: 10px; color: var(--gray); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .card .value { font-size: 26px; font-weight: 700; color: var(--white); line-height: 1; }
  .card .sub   { font-size: 11px; color: var(--gray); margin-top: 5px; }
  .card.accent-card { border-color: var(--accent); }
  .card.accent-card .value { color: var(--accent); }
  .card.red-card { border-color: var(--red); }
  .card.red-card .value { color: var(--red); }

  /* Grid */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  @media (max-width: 900px) { .grid2,.grid3 { grid-template-columns: 1fr; } }

  .block { background: var(--bg2); border: 1px solid var(--border); padding: 20px; margin-bottom: 14px; }
  .block h2 { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .block h2 span { color: var(--white); font-size: 13px; letter-spacing: 0; }

  /* Bar */
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 12px; }
  .bar-row .name { width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; color: var(--white); }
  .bar-row .name a { color: var(--white); text-decoration: none; }
  .bar-row .name a:hover { color: var(--accent); }
  .bar-row .sub { font-size: 10px; color: var(--gray); margin-left: 4px; }
  .bar-track { flex: 1; background: var(--bg3); height: 5px; border-radius: 2px; }
  .bar-fill  { height: 5px; background: var(--accent); border-radius: 2px; transition: width 0.4s; }
  .bar-row .count { width: 32px; text-align: right; color: var(--gray); font-size: 11px; }

  /* Table */
  .tbl-wrap { overflow-x: auto; }
  .tbl { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 760px; }
  .tbl th { text-align: left; color: var(--gray); padding: 0 10px 10px; font-weight: 400; letter-spacing: 0.05em; font-size: 10px; text-transform: uppercase; white-space: nowrap; }
  .tbl td { padding: 8px 10px; border-top: 1px solid var(--border); color: var(--white); vertical-align: top; }
  .tbl tr:hover td { background: var(--bg3); }
  .tbl .ip-link { color: var(--accent); text-decoration: none; font-family: monospace; }
  .tbl .ip-link:hover { text-decoration: underline; }

  /* Bot rows */
  .row-bot td { background: rgba(224,85,102,0.05); }
  .row-bot:hover td { background: rgba(224,85,102,0.12) !important; }
  .row-bot .ip-link { color: var(--red); }

  /* Tags */
  .tag { display: inline-block; padding: 2px 6px; font-size: 10px; letter-spacing: 0.04em; background: var(--bg3); border: 1px solid var(--border); color: var(--gray); margin: 1px 2px 1px 0; border-radius: 2px; }
  .tag.bot { border-color: var(--red); color: var(--red); }
  .tag.new { border-color: var(--green); color: var(--green); }
  .tag .sec-t { font-size: 9px; color: var(--accent); margin-left: 3px; opacity: 0.8; }

  /* Country flag */
  .cflag { font-size: 13px; line-height: 1; margin-right: 3px; }
  .ccode { font-family: monospace; font-size: 10px; color: var(--gray); }

  .empty { color: var(--gray); font-size: 13px; padding: 16px 0; }

  /* Submissions */
  .sub-card { background: var(--bg3); border: 1px solid var(--border); padding: 16px 20px; margin-bottom: 10px; }
  .sub-card:hover { border-color: var(--accent); }
  .sub-meta { display: flex; gap: 16px; margin-bottom: 8px; flex-wrap: wrap; }
  .sub-meta .item { font-size: 11px; color: var(--gray); }
  .sub-meta .item strong { color: var(--white); }
  .sub-type { display: inline-block; padding: 2px 8px; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 2px; margin-bottom: 8px; background: rgba(184,137,90,0.2); border: 1px solid var(--accent); color: var(--accent); }
  .sub-msg { font-size: 13px; color: var(--white); line-height: 1.5; white-space: pre-wrap; }
  .sub-email a { color: var(--accent); text-decoration: none; }
  .sub-email a:hover { text-decoration: underline; }

  /* Badge */
  .badge { display: inline-block; padding: 1px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; background: var(--accent); color: #000; margin-left: 8px; }

  /* Show-all link */
  .show-all { display: block; text-align: center; margin-top: 14px; padding: 10px; font-size: 12px; color: var(--accent); text-decoration: none; border: 1px dashed var(--border); }
  .show-all:hover { border-color: var(--accent); background: rgba(184,137,90,0.06); }

  /* UA column */
  .ua-tip { font-size: 10px; color: var(--gray); max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Online now */
  .online-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--green); margin-right: 6px; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .online-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--green); }
  .online-list { margin-top: 12px; display: flex; flex-direction: column; gap: 6px; }
  .online-row { display: flex; align-items: center; gap: 10px; font-size: 12px; padding: 6px 10px; background: rgba(109,212,136,0.06); border: 1px solid rgba(109,212,136,0.15); }
  .online-row .o-flag { font-size: 13px; }
  .online-row .o-ip { font-family: monospace; color: var(--white); }
  .online-row .o-since { color: var(--gray); font-size: 10px; margin-left: auto; }
</style>
</head>
<body>

<?php if (!$authed): ?>
<div class="login">
  <div class="login-box">
    <h1>◆ aetera / stats</h1>
    <?php if (!empty($error)): ?><p class="error"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <form method="post">
      <input type="password" name="password" placeholder="Пароль" autofocus>
      <button type="submit">Войти →</button>
    </form>
  </div>
</div>

<?php else: ?>

<div class="header">
  <h1>◆ aetera / stats</h1>
  <div class="header-right">
    <?php $active_now = load_active(); if (count($active_now)): ?>
    <div class="online-badge" id="online-count">
      <span class="online-dot"></span>
      <span><?= count($active_now) ?> сейчас на сайте</span>
    </div>
    <?php else: ?>
    <div class="online-badge" id="online-count" style="color:var(--gray)">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--gray);margin-right:6px;"></span>
      <span>никого онлайн</span>
    </div>
    <?php endif; ?>
    <span style="font-size:11px;color:var(--gray)"><?= date('d.m.Y H:i') ?></span>
    <a href="?logout=1">Выйти</a>
  </div>
</div>

<!-- Tabs -->
<div class="tabs">
  <a class="tab active" href="#" onclick="switchTab('analytics',this);return false">Аналитика</a>
  <a class="tab" href="#" onclick="switchTab('submissions',this);return false">
    Заявки
    <?php if (count($stats['subs_recent'])): ?>
      <span class="badge"><?= count($stats['subs_recent']) ?></span>
    <?php endif; ?>
  </a>
</div>

<div class="wrap">

<?php
  $total_h  = count($stats['humans']);
  $total_b  = count($stats['bots']);
  $uniq_ip  = count($stats['ips']);
  $avg      = $stats['avg_time'];
  $bot_pct  = ($total_h + $total_b) > 0 ? round($total_b / ($total_h + $total_b) * 100) : 0;
?>

<!-- ===== ANALYTICS TAB ===== -->
<div class="tab-panel active" id="tab-analytics">

  <!-- Filter bars -->
  <div class="filter-bar">
    <span class="lbl">Период:</span>
    <?php foreach (['all'=>'Всё время','today'=>'Сегодня','week'=>'7 дней','month'=>'30 дней'] as $p=>$lbl): ?>
    <a href="<?= url_with(['period'=>$p,'ip'=>null,'device'=>null]) ?>" class="filter-btn <?= $filter_period===$p?'active':'' ?>"><?= $lbl ?></a>
    <?php endforeach; ?>

    <span class="filter-sep">|</span>
    <span class="lbl">Тип:</span>
    <a href="<?= url_with(['type'=>'humans']) ?>" class="filter-btn <?= $filter_type==='humans'?'active':'' ?>">👤 Люди</a>
    <a href="<?= url_with(['type'=>'bots']) ?>"   class="filter-btn bot-btn <?= $filter_type==='bots'?'active':'' ?>">🤖 Роботы <span style="font-size:10px;opacity:.7"><?= $total_b ?></span></a>
    <a href="<?= url_with(['type'=>'all']) ?>"    class="filter-btn <?= $filter_type==='all'?'active':'' ?>">Все</a>

    <?php if ($filter_device): ?>
    <span class="filter-sep">|</span>
    <span class="lbl">Устройство:</span>
    <span class="filter-active"><?= htmlspecialchars($filter_device) ?> <a href="<?= url_with(['device'=>null]) ?>">✕</a></span>
    <?php endif; ?>
  </div>

  <!-- IP filter notice -->
  <?php if ($filter_ip): ?>
  <div class="filter-bar">
    <div class="filter-active">
      🔍 Фильтр по IP: <strong style="margin-left:6px;font-family:monospace"><?= htmlspecialchars($filter_ip) ?></strong>
      — найдено визитов: <strong style="margin-left:4px"><?= count($stats['filtered']) ?></strong>
      <a href="<?= url_with(['ip'=>null]) ?>">✕ Сбросить</a>
    </div>
  </div>
  <?php endif; ?>

  <!-- Online now -->
  <?php if (!empty($stats['active'])): ?>
  <div class="block" style="border-color:rgba(109,212,136,0.3);margin-bottom:16px;" id="online-block">
    <h2>
      <span style="display:flex;align-items:center;gap:8px;color:var(--green)">
        <span class="online-dot"></span> Сейчас на сайте
      </span>
      <span style="color:var(--green)"><?= count($stats['active']) ?></span>
    </h2>
    <div class="online-list">
      <?php foreach ($stats['active'] as $v):
        $cc = $v['country'] ?? '';
        $since = round((time() - ($v['first'] ?? time())) / 60);
      ?>
      <div class="online-row">
        <?php if ($cc): ?>
          <span class="o-flag"><?= country_flag($cc) ?></span>
          <span class="ccode"><?= htmlspecialchars($cc) ?></span>
        <?php endif; ?>
        <a href="<?= url_with(['ip'=>$v['ip']]) ?>" class="ip-link o-ip"><?= htmlspecialchars($v['ip']) ?></a>
        <span class="o-since"><?= $since > 0 ? "на сайте {$since}м" : 'только что' ?></span>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
  <?php endif; ?>

  <!-- Cards -->
  <div class="cards">
    <div class="card <?= $total_h>0?'accent-card':'' ?>">
      <div class="label">Люди</div>
      <div class="value"><?= $total_h ?></div>
      <div class="sub">визитов за период</div>
    </div>
    <div class="card">
      <div class="label">Уникальных IP</div>
      <div class="value"><?= $uniq_ip ?></div>
      <div class="sub">среди людей</div>
    </div>
    <div class="card">
      <div class="label">Среднее время</div>
      <div class="value"><?= fmt_time($avg) ?></div>
      <div class="sub">на сайте (&gt;3с)</div>
    </div>
    <div class="card <?= $total_b>0?'red-card':'' ?>">
      <div class="label">Роботы</div>
      <div class="value"><?= $total_b ?></div>
      <div class="sub"><?= $bot_pct ?>% от всех · <a href="<?= url_with(['type'=>'bots']) ?>" style="color:var(--red);text-decoration:none;font-size:10px">смотреть</a></div>
    </div>
    <div class="card">
      <div class="label">Заявки</div>
      <div class="value"><?= count($stats['subs_recent']) ?></div>
      <div class="sub">всего получено</div>
    </div>
  </div>

  <div class="grid3">
    <!-- Referrers -->
    <div class="block">
      <h2>Откуда пришли <span><?= array_sum($stats['refs']) ?></span></h2>
      <?php if (empty($stats['refs'])): ?>
        <p class="empty">Нет данных</p>
      <?php else:
        $max_r = max($stats['refs']);
        foreach (array_slice($stats['refs'], 0, 10, true) as $ref => $cnt): ?>
        <div class="bar-row">
          <span class="name" title="<?= htmlspecialchars($ref) ?>"><?= htmlspecialchars($ref) ?></span>
          <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_r*100) ?>%"></div></div>
          <span class="count"><?= $cnt ?></span>
        </div>
      <?php endforeach; endif; ?>
    </div>

    <!-- Sections with avg time -->
    <div class="block">
      <h2>Секции <span><?= array_sum($stats['sec_visits']) ?></span></h2>
      <?php if (empty($stats['sec_visits'])): ?>
        <p class="empty">Нет данных</p>
      <?php else:
        $max_s = max($stats['sec_visits']);
        foreach ($stats['sec_visits'] as $sec => $cnt):
          $avg_s = isset($stats['sec_total'][$sec]) && $cnt > 0
            ? round($stats['sec_total'][$sec] / $cnt) : 0;
      ?>
        <div class="bar-row">
          <span class="name"><?= htmlspecialchars($sec) ?></span>
          <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_s*100) ?>%"></div></div>
          <span class="count"><?= $cnt ?></span>
          <?php if ($avg_s > 0): ?>
          <span class="sub" style="width:44px;text-align:right"><?= fmt_time($avg_s) ?></span>
          <?php endif; ?>
        </div>
      <?php endforeach; endif; ?>
    </div>

    <!-- Languages -->
    <div class="block">
      <h2>Язык версии</h2>
      <?php if (empty($stats['langs'])): ?>
        <p class="empty">Нет данных</p>
      <?php else:
        $max_l = max($stats['langs']);
        $lang_labels = ['en' => '🇬🇧 English', 'ru' => '🇷🇺 Русский'];
        foreach ($stats['langs'] as $lg => $cnt):
          $total_l = array_sum($stats['langs']);
          $pct = $total_l > 0 ? round($cnt / $total_l * 100) : 0;
        ?>
        <div class="bar-row">
          <span class="name"><?= $lang_labels[$lg] ?? htmlspecialchars(strtoupper($lg)) ?></span>
          <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_l*100) ?>%"></div></div>
          <span class="count"><?= $cnt ?></span>
          <span class="sub" style="width:36px;text-align:right"><?= $pct ?>%</span>
        </div>
      <?php endforeach; endif; ?>
    </div>

    <!-- Devices -->
    <div class="block">
      <h2>Устройства</h2>
      <?php if (empty($stats['devices'])): ?>
        <p class="empty">Нет данных</p>
      <?php else:
        $max_d = max($stats['devices']);
        foreach ($stats['devices'] as $dev => $cnt): ?>
        <div class="bar-row">
          <span class="name"><a href="<?= url_with(['device'=>$dev]) ?>"><?= htmlspecialchars($dev) ?></a></span>
          <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_d*100) ?>%"></div></div>
          <span class="count"><?= $cnt ?></span>
        </div>
      <?php endforeach; endif; ?>
    </div>

    <!-- Browsers -->
    <div class="block">
      <h2>Браузеры</h2>
      <?php if (empty($stats['browsers'])): ?>
        <p class="empty">Нет данных</p>
      <?php else:
        $max_b = max($stats['browsers']);
        foreach ($stats['browsers'] as $br => $cnt): ?>
        <div class="bar-row">
          <span class="name"><?= htmlspecialchars($br) ?></span>
          <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_b*100) ?>%"></div></div>
          <span class="count"><?= $cnt ?></span>
        </div>
      <?php endforeach; endif; ?>
    </div>
  </div>

  <div class="grid2">
    <!-- Top IPs -->
    <div class="block">
      <h2>Топ IP-адресов <span><?= count($stats['top_ips']) ?></span></h2>
      <?php if (empty($stats['top_ips'])): ?>
        <p class="empty">Нет данных</p>
      <?php else:
        $max_ip = max($stats['top_ips']);
        // Build last-seen country per IP
        $ip_country = [];
        foreach (array_reverse($stats['humans']) as $r) {
            $pip = $r['ip'];
            if (!isset($ip_country[$pip]) && !empty($r['country'])) {
                $ip_country[$pip] = $r['country'];
            }
        }
        foreach ($stats['top_ips'] as $ip => $cnt):
          $cc = $ip_country[$ip] ?? '';
      ?>
      <div class="bar-row">
        <span class="name">
          <?php if ($cc): ?>
            <span class="cflag" title="<?= htmlspecialchars($cc) ?>"><?= country_flag($cc) ?></span>
          <?php endif; ?>
          <a href="<?= url_with(['ip'=>$ip]) ?>" class="ip-link"><?= htmlspecialchars($ip) ?></a>
        </span>
        <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_ip*100) ?>%"></div></div>
        <span class="count"><?= $cnt ?></span>
      </div>
    <?php endforeach; endif; ?>
    </div>

    <!-- Top Countries -->
    <div class="block">
      <h2>Страны <span><?= count($stats['countries']) ?></span></h2>
      <?php if (empty($stats['countries'])): ?>
        <p class="empty">
          Нет данных — страна определяется автоматически:<br>
          через заголовок <code style="font-size:10px;color:var(--accent)">CF-IPCountry</code> (CloudFlare)<br>
          или PHP-расширение <code style="font-size:10px;color:var(--accent)">geoip</code>
        </p>
      <?php else:
        $max_c = max($stats['countries']);
        foreach ($stats['countries'] as $cc => $cnt): ?>
        <div class="bar-row">
          <span class="name">
            <span class="cflag"><?= country_flag($cc) ?></span>
            <span class="ccode"><?= htmlspecialchars($cc) ?></span>
          </span>
          <div class="bar-track"><div class="bar-fill" style="width:<?= round($cnt/$max_c*100) ?>%"></div></div>
          <span class="count"><?= $cnt ?></span>
        </div>
      <?php endforeach; endif; ?>
    </div>
  </div>

  <!-- Visits table -->
  <div class="block">
    <h2>
      Визиты
      <?php if ($filter_type === 'bots'): ?>
        <span style="color:var(--red)">🤖 только роботы</span>
      <?php elseif ($filter_type === 'all'): ?>
        <span>все (люди + роботы)</span>
      <?php endif; ?>
      <span>
        <?php if ($filter_ip || $filter_device): ?>
          <?= count($stats['filtered']) ?> визитов (фильтр)
        <?php else: ?>
          показано <?= count($stats['recent_groups']) ?> IP из <?= count($stats['filtered']) ?> визитов
        <?php endif; ?>
      </span>
    </h2>
    <?php if (empty($stats['recent'])): ?>
      <p class="empty">Нет данных</p>
    <?php else: ?>
    <div class="tbl-wrap">
    <table class="tbl">
      <thead>
        <tr>
          <th>Дата/Время</th>
          <th>IP / Страна</th>
          <th>Версия</th>
          <th>Устройство</th>
          <th>Браузер</th>
          <th>Реферер</th>
          <th>Время</th>
          <th>Секции (время)</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($stats['recent_groups'] as $g):
          $r = $g['main'];
          $history = $g['history'];
          $has_history = count($history) > 0;
          $is_bot_row = $r['bot'] ?? false;
          $cc = $r['country'] ?? '';
          $st = $r['sections_time'] ?? [];
          $row_id = 'hist_' . md5($r['ip'] . $r['ts'] . uniqid());
        ?>
        <tr class="<?= $is_bot_row ? 'row-bot' : '' ?>" <?= $has_history ? 'onclick="toggleHistory(\''.$row_id.'\')"' : '' ?> style="<?= $has_history ? 'cursor:pointer;' : '' ?>">
          <td style="white-space:nowrap;color:var(--gray)">
            <?= date('d.m.y H:i', strtotime($r['ts'])) ?>
            <?php if ($has_history): ?>
              <div style="font-size:10px;color:var(--accent);margin-top:4px">Визитов: <?= count($history) + 1 ?> ▾</div>
            <?php endif; ?>
          </td>
          <td>
            <?php if ($is_bot_row): ?>
              <span class="tag bot">BOT</span><br>
            <?php endif; ?>
            <?php if ($cc): ?>
              <span class="cflag" title="<?= htmlspecialchars($cc) ?>"><?= country_flag($cc) ?></span>
              <span class="ccode"><?= htmlspecialchars($cc) ?></span>
            <?php endif; ?>
            <a href="<?= url_with(['ip'=>$r['ip']]) ?>" class="ip-link" title="Фильтр по IP" onclick="event.stopPropagation()">
              <?= htmlspecialchars($r['ip']) ?>
            </a>
          </td>
          <td style="white-space:nowrap;text-align:center">
            <?php $lg = $r['lang'] ?? ''; echo $lg === 'ru' ? '🇷🇺 RU' : ($lg === 'en' ? '🇬🇧 EN' : '—'); ?>
          </td>
          <td>
            <a href="<?= url_with(['device'=>$r['device']]) ?>" style="color:var(--white);text-decoration:none;" title="Фильтр по устройству" onclick="event.stopPropagation()">
              <?= htmlspecialchars($r['device'] ?? '—') ?>
            </a>
          </td>
          <td><?= htmlspecialchars($r['browser'] ?? '—') ?></td>
          <td style="color:var(--gray);font-size:11px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><?= htmlspecialchars($r['ref'] ?: 'direct') ?></td>
          <td style="white-space:nowrap"><?= fmt_time((int)($r['time'] ?? 0)) ?></td>
          <td>
            <?php if (!empty($st)): ?>
              <?php foreach ($st as $sname => $secs): ?>
                <span class="tag"><?= htmlspecialchars($sname) ?><span class="sec-t"><?= fmt_time($secs) ?></span></span>
              <?php endforeach; ?>
            <?php elseif (!empty($r['sections'])): ?>
              <?php foreach ($r['sections'] as $s): ?>
                <span class="tag"><?= htmlspecialchars($s) ?></span>
              <?php endforeach; ?>
            <?php else: ?>
              <span style="color:var(--gray)">—</span>
            <?php endif; ?>
          </td>
        </tr>
        <?php if ($has_history): ?>
        <tr id="<?= $row_id ?>" style="display:none;">
          <td colspan="8" style="padding:0; background:var(--bg3);">
            <div style="padding:10px 20px; border-left:2px solid var(--accent);">
              <div style="font-size:11px; color:var(--gray); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">История визитов IP <?= htmlspecialchars($r['ip']) ?></div>
              <table style="width:100%; border-collapse:collapse; font-size:11px;">
                <?php foreach ($history as $hr): 
                  $hst = $hr['sections_time'] ?? [];
                ?>
                <tr>
                  <td style="padding:6px 10px; color:var(--gray); white-space:nowrap; width:120px; border-bottom:1px solid rgba(255,255,255,0.05);"><?= date('d.m.y H:i', strtotime($hr['ts'])) ?></td>
                  <td style="padding:6px 10px; text-align:center; width:60px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <?php $hlg = $hr['lang'] ?? ''; echo $hlg === 'ru' ? '🇷🇺' : ($hlg === 'en' ? '🇬🇧' : '—'); ?>
                  </td>
                  <td style="padding:6px 10px; color:var(--white); width:150px; border-bottom:1px solid rgba(255,255,255,0.05);"><?= htmlspecialchars($hr['device'] ?? '—') ?> / <?= htmlspecialchars($hr['browser'] ?? '—') ?></td>
                  <td style="padding:6px 10px; color:var(--gray); max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; border-bottom:1px solid rgba(255,255,255,0.05);"><?= htmlspecialchars($hr['ref'] ?: 'direct') ?></td>
                  <td style="padding:6px 10px; white-space:nowrap; width:60px; border-bottom:1px solid rgba(255,255,255,0.05);"><?= fmt_time((int)($hr['time'] ?? 0)) ?></td>
                  <td style="padding:6px 10px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <?php if (!empty($hst)): ?>
                      <?php foreach ($hst as $sname => $secs): ?>
                        <span class="tag" style="background:var(--bg2)"><?= htmlspecialchars($sname) ?><span class="sec-t"><?= fmt_time($secs) ?></span></span>
                      <?php endforeach; ?>
                    <?php elseif (!empty($hr['sections'])): ?>
                      <?php foreach ($hr['sections'] as $s): ?>
                        <span class="tag" style="background:var(--bg2)"><?= htmlspecialchars($s) ?></span>
                      <?php endforeach; ?>
                    <?php else: ?>
                      <span style="color:var(--gray)">—</span>
                    <?php endif; ?>
                  </td>
                </tr>
                <?php endforeach; ?>
              </table>
            </div>
          </td>
        </tr>
        <?php endif; ?>
        <?php endforeach; ?>
      </tbody>
    </table>
    </div>
    <?php if (!$show_all && count($stats['filtered']) > 50): ?>
    <a href="<?= url_with(['all'=>'1']) ?>" class="show-all">↓ Показать все <?= count($stats['filtered']) ?> визитов</a>
    <?php endif; ?>
    <?php endif; ?>
  </div>

</div><!-- /tab-analytics -->

<!-- ===== SUBMISSIONS TAB ===== -->
<div class="tab-panel" id="tab-submissions">

  <div style="margin-bottom:20px">
    <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">
      <div class="card accent-card">
        <div class="label">Всего заявок</div>
        <div class="value"><?= count($stats['subs_recent']) ?></div>
      </div>
    </div>
  </div>

  <?php if (empty($stats['subs_recent'])): ?>
    <p class="empty">Заявок пока нет</p>
  <?php else: ?>
    <?php foreach ($stats['subs_recent'] as $s): ?>
    <div class="sub-card">
      <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <div>
          <strong style="font-size:15px"><?= htmlspecialchars($s['fullname'] ?? trim(($s['firstName']??'').' '.($s['lastName']??'')) ?: 'Unknown') ?></strong>
          <?php if (!empty($s['company'])): ?>
            <div style="font-size:12px;color:var(--accent);margin-top:2px"><?= htmlspecialchars($s['company']) ?></div>
          <?php endif; ?>
        </div>
        <span style="font-size:11px;color:var(--gray)"><?= date('d.m.Y H:i', strtotime($s['timestamp'])) ?></span>
      </div>
      <div class="sub-meta">
        <div class="item sub-email">✉ <a href="mailto:<?= htmlspecialchars($s['email']) ?>"><?= htmlspecialchars($s['email']) ?></a></div>
        <?php if (!empty($s['linkedin'])): ?>
          <div class="item">🔗 <a href="<?= htmlspecialchars($s['linkedin']) ?>" target="_blank" style="color:var(--accent);text-decoration:none">LinkedIn</a></div>
        <?php endif; ?>
        <div class="item">🌐 <span style="font-family:monospace"><?= htmlspecialchars($s['ip'] ?? '—') ?></span></div>
        <?php if (!empty($s['id'])): ?>
        <div class="item">ID: <span style="font-family:monospace;font-size:10px"><?= htmlspecialchars($s['id']) ?></span></div>
        <?php endif; ?>
      </div>
      <?php if (!empty($s['notes'])): ?>
      <div class="sub-msg" style="border-top:1px solid var(--border);padding-top:10px;margin-top:10px"><?= htmlspecialchars($s['notes']) ?></div>
      <?php elseif (!empty($s['message'])): ?>
      <div class="sub-msg" style="border-top:1px solid var(--border);padding-top:10px;margin-top:10px"><?= htmlspecialchars($s['message']) ?></div>
      <?php endif; ?>
    </div>
    <?php endforeach; ?>
  <?php endif; ?>

</div><!-- /tab-submissions -->

</div><!-- /wrap -->

<script>
function switchTab(name, el) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  el.classList.add('active');
}

function toggleHistory(id) {
  var el = document.getElementById(id);
  if (el.style.display === 'none') {
    el.style.display = 'table-row';
  } else {
    el.style.display = 'none';
  }
}

// Auto-refresh "online" count every 30s without full page reload
setInterval(function() {
  fetch(location.href, { headers: { 'X-Online-Only': '1' } })
    .then(r => r.text())
    .then(html => {
      // Extract new online block content via regex
      const m = html.match(/id="online-block"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
      const b = document.getElementById('online-block');
      if (m && b) b.outerHTML = m[0];
      // Update header badge
      const hm = html.match(/id="online-count"[^>]*>[\s\S]*?<\/div>/);
      const hb = document.getElementById('online-count');
      if (hm && hb) hb.outerHTML = hm[0];
    }).catch(() => {});
}, 30000);
</script>

<?php endif; ?>
</body>
</html>

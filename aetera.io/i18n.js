/* =========================================================
   aetera · i18n — translations
   Edit translations here; keys map to [data-i18n] attributes.
   ========================================================= */

window.LANG = 'en';

window.I18N = {
  en: {
    /* ── nav ── */
    'nav.thesis':    'thesis',
    'nav.specs':     'specs',
    'nav.economics': 'economics',
    'nav.market':    'market',
    'nav.roadmap':   'roadmap',
    'nav.cta':       'Contact',

    /* ── hero ── */
    'hero.eyebrow': '<span class="eyebrow-dot"></span>TRANSPORT INFRASTRUCTURE · PRE-SEED · ACTIVE',
    'hero.title1':  'Infrastructure',
    'hero.title2':  'for the <span class="copper-text">next era.</span>',
    'hero.tag1':    'On-demand',
    'hero.tag2':    'Point-to-point',
    'hero.tag3':    'Up to 400 km/h',
    'hero.tag4':    'Fully electric',
    'hero.lede':    'A new physical layer for moving people and goods — designed to operate at <strong>300 km/h</strong> (<span>400 km/h</span> max) without roads, rails or fixed fleets. <strong>$120K / km</strong> target cost (micro-infra, excl. land). <strong>250+ year</strong> lifespan. <span>PCT</span> patent filed. Unit economics attached.',
    /* ── hero meter ── */
    'hero.meter.vel':      'CRUISE VELOCITY',
    'hero.meter.vel.sub':  'cruise · 400 max',
    'hero.meter.cost':     'BUILD COST / KM',
    'hero.meter.cost.sub': 'micro-infra (excl. land) · projected cost-down',
    'hero.meter.life':     'LIFESPAN',
    'hero.meter.life.sub': 'via automated robotic maintenance',
    'hero.meter.tam':      'ADDRESSABLE TAM',
    'hero.meter.tam.sub':  'top 400 corridors · 2040',
    'hero.meter.footnote': '*All metrics reflect the baseline system configuration.',

    'hero.cta1':    'Request access',
    'hero.cta2':    'Read thesis',
    'hero.ctaNote': 'Pitch deck available · technical dossier under NDA',

    /* ── thesis ── */
    'thesis.title':   'A new category. Not a better train.',
    'thesis.sub':     'Transport infrastructure has compounded at ~0.4% / yr for 150 years. Every major system — road, rail, metro, aviation — shares the same physical constraints: fixed corridors, fleets, terminals, and schedules. Aetera is the first architecture engineered to bypass them.',
    'thesis.lede':    'We are designing technology to move <strong>people and cargo</strong> at <span class="hi">300+ km/h</span> between <strong>any two points</strong>, without roads, rails, or fixed fleets — at <span class="hi">1 / 250th</span> the per-km cost of metro and a <span class="hi">6× faster</span> door-to-door time.',
    'thesis.why1':    'Why now',
    'thesis.why1.p':  'A <strong>$6.3T</strong> global infrastructure backlog by 2040. Rising land costs. Rising climate friction. Municipalities are out of runway with legacy systems.',
    'thesis.why2':    'Why us',
    'thesis.why2.p':  'PCT application filed. Engineering model validated. First-principles architecture with <strong>no network dependency</strong> — every deployment is a standalone economic unit.',
    'thesis.why3':    'Why defensible',
    'thesis.why3.p':  'Core IP locked. Known substitutes require 2–3 orders of magnitude more capital. Unit economics break even on day one of operation.',

    /* ── specs ── */
    'specs.title':  'Baseline Network Specs & Performance',
    'specs.sub':    'Design targets derived from validated physics models. Figures below represent the baseline configuration for standard light-payload units.',
    'specs.footnote': '*Calculated for standard light-payload configuration. Variable unit scenarios inside the dossier.',

    /* ── compare ── */
    'compare.title': 'Versus every legacy mode.',
    'compare.sub':   'All figures normalised per operational km, reviewed against public data from Federal Highway Admin (US), UIC (rail), and municipal metro disclosures (Paris, Singapore, Moscow 2022–2024).',

    /* ── economics ── */
    'econ.title':  'Baseline Unit Economics',
    'econ.sub':    'Financial model based on 50-km reference corridor with 620 pax/hr (nominal) capacity. Full assumptions included in the dossier.',

    /* ── market ── */
    'market.title': 'A $4T infrastructure gap.',
    'market.sub':   'Top 400 global city-pair corridors. Infrastructure capex gap by 2040. Aetera addresses the segment where legacy systems are uneconomical.',

    /* ── advantages ── */
    'adv.title':     'What makes it uninvestable to copy.',
    'adv.1.title':   'Rapid deployment',
    'adv.1.p':       'No multi-year construction. First commercial corridor targeted within 36 months of Series A close.',
    'adv.2.title':   'Minimal footprint',
    'adv.2.p':       'Negligible land acquisition. Permitting scope closer to utility easement than infrastructure project.',
    'adv.3.title':   'Unbounded TAM',
    'adv.3.p':       'Every two points on earth are a potential route. No network dependency, no hub constraint, no demand cannibalization.',
    'adv.4.title':   'Uncontested markets',
    'adv.4.p':       'Designed to operate where roads can\'t — national parks, heritage sites, low-density terrain. No direct competition in the primary segments.',

    /* ── compare ── */
    'compare.col.param':    'Parameter',
    'compare.col.road':     'Road',
    'compare.col.railway':  'Railway',
    'compare.col.metro':    'Metro',

    /* ── economics ── */
    'econ.card1.title':   'Build cost / km',
    'econ.card1.sub':     'CAPEX · $ thousand · log scale',
    'econ.card2.title':   'Door-to-door speed',
    'econ.card2.sub':     'pt-to-pt · km/h · effective',
    'econ.card3.title':   'Payback curve',
    'econ.card3.sub':     'cumulative cash · 50 km corridor · $M',
    'econ.card4.title':   'Unit economics · per 50 km node',
    'econ.card4.sub':     'annual, steady state · $M',
    'econ.ledger.rev':    'Revenue (pax + cargo)',
    'econ.ledger.energy': 'Energy',
    'econ.ledger.maint':  'Maintenance',
    'econ.ledger.ops':    'Operations',
    'econ.ledger.sga':    'SG&amp;A (allocated)',
    'econ.ledger.ebitda': 'EBITDA',

    /* ── market ── */
    'tam.1.k':    'TAM · global transport infra',
    'tam.1.desc': 'OECD 2040 projection, all modes',
    'tam.2.k':    'SAM · high-density corridors',
    'tam.2.desc': 'Top 400 intercity pairs, 500–5000 km',
    'tam.3.k':    'SOM · year-10 realistic',
    'tam.3.desc': '22 corridors at 2.3% capture',
    'tam.4.k':    'First pilot target',
    'tam.4.desc': 'Deployable &lt; 18 months post Series A',

    /* ── scenarios ── */
    'scenarios.title': 'Where it lives.',

    /* ── roadmap ── */
    'roadmap.title':     'Four phases. Two rounds. One pilot.',
    'roadmap.sub':       'Capital plan aligned to de-risked milestones. Each phase produces a hard gate before the next opens.',
    'rm.col.phase':      'Phase',
    'rm.col.capital':    'Capital',
    'rm.col.milestones': 'Milestones',
    'rm.col.technical':  'Technical',
    'rm.col.timeline':   'Timeline',
    'rm.badge.done':     'complete',
    'rm.badge.active':   'active',
    'rm.badge.upcoming': 'upcoming',

    /* ── roadmap cells ── */
    'rm.p1.name': '01 Foundation',
    'rm.p2.name': '02 Prototype',
    'rm.p3.name': '03 Scale',
    'rm.p4.name': '04 Deploy',
    'rm.r1.cap':   '<span class="k">Self-funded</span>IP filing + engineering model',
    'rm.r1.miles': '<ul><li>PCT application filed</li><li>Physics validated</li><li>Ops model drafted</li></ul>',
    'rm.r1.tech':  '<span class="k">TRL 2–3</span>Paper design, simulation',
    'rm.r2.cap':   '<span class="k">Pre-seed · $1.5M</span>current round',
    'rm.r2.miles': '<ul><li>Bench prototype</li><li>Regulatory scoping</li><li>Founding team → 5</li></ul>',
    'rm.r2.tech':  '<span class="k">TRL 4</span>Component validation',
    'rm.r3.cap':   '<span class="k">Series A · $18M</span>targeted H1 2027',
    'rm.r3.miles': '<ul><li>Full-scale prototype</li><li>First corridor LOI</li><li>Manufacturing partner</li></ul>',
    'rm.r3.tech':  '<span class="k">TRL 6</span>Full-scale demo',
    'rm.r4.cap':   '<span class="k">Series B · $80M+</span>targeted 2028',
    'rm.r4.miles': '<ul><li>First 50-km pilot live · Q4 2027*</li><li>Revenue &gt; $15M</li><li>2 additional corridors signed</li></ul>',
    'rm.r4.tech':  '<span class="k">TRL 8–9</span>Commercial deployment',
    'rm.note':     '* Pilot timeline contingent on Series A close; compression possible with accelerated funding.',

    /* ── contact signals ── */
    'cs.sla.k':    'Response SLA',
    'cs.sla.v':    '&lt; 48h',
    'cs.nda.k':    'NDA mechanism',
    'cs.nda.v':    'mutual · email · no wet-sign',
    'cs.aud.k':    'Audience',
    'cs.stage.k':  'Stage',
    'cs.stage.v':  'pre-seed · active',
    'cs.round.k':  'Round target',
    'cs.direct.k': 'Direct',

    /* ── contact form ── */
    'form.fullname': 'Full name',
    'form.email':    'Work email',
    'form.company':  'Company / Fund',
    'form.linkedin': 'LinkedIn URL (Optional)',
    'form.notes':    'Notes / Areas of Interest (Optional)',
    'form.notes.ph': 'e.g., Requesting engineering dossier / scheduling a call',
    'form.submit':   'Request Access',

    /* ── footer ── */
    'foot.explore':   'Explore',
    'foot.company':   'Company',
    'foot.connect':   'Connect',
    'foot.thesis':    'Thesis',
    'foot.copy':      '© 2026 Aetera. All rights reserved.',
    'foot.specs':     'Specs',
    'foot.economics': 'Economics',
    'foot.market':    'Market',
    'foot.about':     'About',
    'foot.roadmap':   'Roadmap',
    'foot.contact':   'Contact',

    /* ── faq ── */
    'faq.title': 'What you\'ll ask next.',

    /* ── about ── */
    'about.title':   'PCT filed. Engineering validated. Pre-seed open.',
    'about.quote':   'Aetera was founded on a single observation: every major transport system built in the last 150 years shares the same fundamental constraints. <span class="hi">We found a way around them.</span><br><br>The <strong>technology is covered by a filed PCT application</strong> and disclosed in full under NDA. What we can say publicly: it is designed to operate at scale, cost a fraction of existing infrastructure, and require no roads or rails.',

    /* ── IP card ── */
    'ip.head':        'IP · Intellectual property',
    'ip.subtitle':    'Core architecture filed under PCT framework; disclosure restricted.',
    'ip.type.k':      'Application type',
    'ip.type.v':      'PCT international',
    'ip.status.k':    'Filing status',
    'ip.status.v':    'Filed · pending',
    'ip.breadth.k':   'Claim breadth',
    'ip.breadth.v':   'System + method + mechanism',
    'ip.territory.k': 'Territorial entry',
    'ip.territory.v': 'EU, US, JP, CN, IN, RU targeted',
    'ip.date.k':      'Priority date',
    'ip.date.v':      'Disclosed under NDA',
    'ip.freedom.k':   'Substitute freedom',
    'ip.freedom.v':   'None known in art',

    /* ── contact ── */
    'contact.title': 'Request<br>access.',
    'contact.note':  'Qualified channel. High-level brief is open; full technical models and IP disclosure available under NDA. We respond personally, typically within 48 hours.',
    'contact.sub':   'Qualified investors and strategic partners only. Pitch deck available upon request; detailed engineering models and full unit economics require NDA.',
  },

  ru: {
    /* ── nav ── */
    'nav.thesis':    'тезис',
    'nav.specs':     'технология',
    'nav.economics': 'экономика',
    'nav.market':    'рынок',
    'nav.roadmap':   'план',
    'nav.cta':       'Контакты',

    /* ── hero ── */
    'hero.eyebrow': '<span class="eyebrow-dot"></span>ТРАНСПОРТНАЯ ИНФРАСТРУКТУРА · ПРЕ-СИД · АКТИВНО',
    'hero.title1':  'Инфраструктура',
    'hero.title2':  'для <span class="copper-text">новой эры.</span>',
    'hero.tag1':    'По требованию',
    'hero.tag2':    'Точка — точка',
    'hero.tag3':    'До 400 км/ч',
    'hero.tag4':    'Полностью электро',
    'hero.lede':    'Проектируемая транспортная система нового поколения — <strong>300 км/ч</strong>, без дорог и рельсов, от точки до точки. Целевая стоимость — <strong>$120K / км</strong> (микро-инфраструктура, без земли). Срок службы — <strong>250+ лет</strong>. Патент <span>PCT</span> подан. Юнит-экономика прилагается.',
    /* ── hero meter ── */
    'hero.meter.vel':      'КРЕЙСЕРСКАЯ СКОРОСТЬ',
    'hero.meter.vel.sub':  'крейсерская · макс. 400',
    'hero.meter.cost':     'СТОИМОСТЬ / КМ',
    'hero.meter.cost.sub': 'микро-инфра (без земли) · прогноз снижения',
    'hero.meter.life':     'СРОК СЛУЖБЫ',
    'hero.meter.life.sub': 'за счет автоматизированного обслуживания',
    'hero.meter.tam':      'АДРЕСНЫЙ TAM',
    'hero.meter.tam.sub':  'топ-400 коридоров · 2040',
    'hero.meter.footnote': '*Все метрики отражают базовую конфигурацию системы.',

    'hero.cta1':    'Запросить доступ',
    'hero.cta2':    'Читать тезис',
    'hero.ctaNote': 'Презентация доступна · тех. досье под NDA',

    /* ── thesis ── */
    'thesis.title':   'Новый класс транспорта.',
    'thesis.sub':     'За последние 150 лет транспортная инфраструктура росла лишь на ~0,4% в год. Все основные системы — дороги, ж/д, метро, авиация — ограничены одними и теми же рамками: фиксированные коридоры, терминалы и централизованные парки. aetera обходит эти барьеры, отделяя физический слой от автономных юнитов.',
    'thesis.lede':    'Мы проектируем технологию для перемещения <strong>людей и грузов</strong> со скоростью <span class="hi">300+ км/ч</span> между <strong>любыми двумя точками</strong> — без дорог, рельсов и фиксированных парков техники. Стоимость строительства — <span class="hi">в 250 раз ниже</span> метро на км. Время в пути — <span class="hi">в 6 раз меньше</span> от двери до двери.',
    'thesis.why1':    'Почему сейчас',
    'thesis.why1.p':  'К 2040 году мировой инфраструктурный дефицит достигнет <strong>$6,3T</strong>. Земля дорожает. Климатические ограничения ужесточаются. Устаревшие системы исчерпали потенциал роста.',
    'thesis.why2':    'Почему мы',
    'thesis.why2.p':  'Заявка PCT подана. Инженерная модель подтверждена. Архитектура построена с нуля — <strong>без сетевых зависимостей</strong>. Каждый развёрнутый узел — самостоятельная экономическая единица.',
    'thesis.why3':    'Почему не скопировать',
    'thesis.why3.p':  'Ключевая интеллектуальная собственность защищена. Воспроизведение известных аналогов требует на 2–3 порядка больше капитала. Юнит-экономика положительна с первого дня работы.',

    /* ── specs ── */
    'specs.title':  'Базовая производительность и экономика сети',
    'specs.sub':    'Целевые показатели получены из валидированных физических моделей. Данные ниже относятся к базовой конфигурации для легких юнитов.',
    'specs.footnote': '*Рассчитано для стандартной конфигурации с легкой полезной нагрузкой. Варианты для различных юнитов — внутри досье.',

    /* ── compare ── */
    'compare.title': 'Сравнение со всеми существующими видами транспорта.',
    'compare.sub':   'Все показатели нормализованы на оперативный км. Источники: Federal Highway Admin (США), UIC (жд), данные муниципального метро (Париж, Сингапур, Москва, 2022–2024).',
    'compare.col.param':    'Параметр',
    'compare.col.road':     'Дороги',
    'compare.col.railway':  'ЖД',
    'compare.col.metro':    'Метро',

    /* ── economics ── */
    'econ.title':         'Базовая юнит-экономика',
    'econ.sub':           'Финансовая модель на базе 50-км коридора с номинальной мощностью 620 пас/ч. Все допущения — в основном досье.',
    'econ.card1.title':   'Стоимость строительства / км',
    'econ.card1.sub':     'CAPEX · $ тыс. · логарифмическая шкала',
    'econ.card2.title':   'Скорость от двери до двери',
    'econ.card2.sub':     'точка — точка · км/ч · эффективная',
    'econ.card3.title':   'Кривая окупаемости',
    'econ.card3.sub':     'кумулятивный денежный поток · коридор 50 км · $M',
    'econ.card4.title':   'Юнит-экономика · узел 50 км',
    'econ.card4.sub':     'годовая, стационарный режим · $M',
    'econ.ledger.rev':    'Выручка (пассажиры + груз)',
    'econ.ledger.energy': 'Электроэнергия',
    'econ.ledger.maint':  'Техническое обслуживание',
    'econ.ledger.ops':    'Операционные расходы',
    'econ.ledger.sga':    'SG&A (распределённые)',
    'econ.ledger.ebitda': 'EBITDA',

    /* ── market ── */
    'market.title':  'Инфраструктурный разрыв на $4T.',
    'market.sub':    'Топ-400 глобальных межгородских коридоров. Разрыв в капзатратах к 2040 году. Aetera работает в сегменте, где традиционные системы нерентабельны.',
    'tam.1.k':       'TAM · глобальная транспортная инфра',
    'tam.1.desc':    'Прогноз ОЭСР до 2040, все виды транспорта',
    'tam.2.k':       'SAM · высокоплотные коридоры',
    'tam.2.desc':    'Топ-400 межгородских пар, 500–5000 км',
    'tam.3.k':       'SOM · реалистичная доля к 10-му году',
    'tam.3.desc':    '22 коридора при захвате 2,3%',
    'tam.4.k':       'Цель первого пилота',
    'tam.4.desc':    'Запуск менее чем за 18 мес. после Series A',

    /* ── scenarios ── */
    'scenarios.title': 'Где это работает.',

    /* ── advantages ── */
    'adv.title':     'Почему это невозможно скопировать.',
    'adv.1.title':   'Быстрое развёртывание',
    'adv.1.p':       'Никаких многолетних строек. Первый коммерческий коридор — в течение 36 месяцев после закрытия раунда Series A.',
    'adv.2.title':   'Минимальный земельный след',
    'adv.2.p':       'Минимальные затраты на землю. По масштабу согласований проект ближе к прокладке коммуникаций, чем к строительству инфраструктуры.',
    'adv.3.title':   'Безграничный TAM',
    'adv.3.p':       'Любые две точки на Земле — потенциальный маршрут. Нет сетевых зависимостей, хабов и конкуренции за существующий спрос.',
    'adv.4.title':   'Свободные рынки',
    'adv.4.p':       'Сможет работать там, куда не дотянуться дорогам: национальные парки, охраняемые территории, малонаселённые регионы. Прямых конкурентов в ключевых сегментах нет.',

    /* ── roadmap ── */
    'roadmap.title':      'Четыре фазы. Два раунда. Один пилот.',
    'roadmap.sub':        'Капитал привязан к проверяемым контрольным точкам. Следующая фаза открывается только после закрытия предыдущей.',
    'rm.col.phase':       'Фаза',
    'rm.col.capital':     'Капитал',
    'rm.col.milestones':  'Ключевые события',
    'rm.col.technical':   'Технология',
    'rm.col.timeline':    'Сроки',
    'rm.badge.done':      'завершено',
    'rm.badge.active':    'активно',
    'rm.badge.upcoming':  'впереди',

    /* ── roadmap cells ── */
    'rm.p1.name': '01 Основание',
    'rm.p2.name': '02 Прототип',
    'rm.p3.name': '03 Масштабирование',
    'rm.p4.name': '04 Развёртывание',
    'rm.r1.cap':   '<span class="k">Собственные средства</span>Патентование + инженерная модель',
    'rm.r1.miles': '<ul><li>Заявка PCT подана</li><li>Физика подтверждена</li><li>Операционная модель разработана</li></ul>',
    'rm.r1.tech':  '<span class="k">TRL 2–3</span>Бумажная разработка, симуляция',
    'rm.r2.cap':   '<span class="k">Пре-сид · $1,5M</span>текущий раунд',
    'rm.r2.miles': '<ul><li>Стендовый прототип</li><li>Регуляторный анализ</li><li>Команда основателей → 5</li></ul>',
    'rm.r2.tech':  '<span class="k">TRL 4</span>Валидация компонентов',
    'rm.r3.cap':   '<span class="k">Series A · $18M</span>цель — I пол. 2027',
    'rm.r3.miles': '<ul><li>Полномасштабный прототип</li><li>LOI на первый коридор</li><li>Партнёр по производству</li></ul>',
    'rm.r3.tech':  '<span class="k">TRL 6</span>Полномасштабная демонстрация',
    'rm.r4.cap':   '<span class="k">Series B · $80M+</span>цель — 2028',
    'rm.r4.miles': '<ul><li>Первый пилот 50 км · IV кв. 2027*</li><li>Выручка &gt; $15M</li><li>Подписано ещё 2 коридора</li></ul>',
    'rm.r4.tech':  '<span class="k">TRL 8–9</span>Коммерческое развёртывание',
    'rm.note':     '* Сроки пилота зависят от закрытия Series A; при ускоренном финансировании возможно сжатие.',

    /* ── contact signals ── */
    'cs.sla.k':    'Время ответа',
    'cs.sla.v':    '&lt; 48 ч',
    'cs.nda.k':    'Механизм NDA',
    'cs.nda.v':    'взаимное · email · без живой подписи',
    'cs.aud.k':    'Аудитория',
    'cs.stage.k':  'Стадия',
    'cs.stage.v':  'пре-сид · активно',
    'cs.round.k':  'Цель раунда',
    'cs.direct.k': 'Прямой контакт',

    /* ── contact form ── */
    'form.fullname': 'Имя и фамилия',
    'form.email':    'Рабочий email',
    'form.company':  'Компания / Фонд',
    'form.linkedin': 'LinkedIn URL (Опционально)',
    'form.notes':    'Примечания / Сферы интереса (Опционально)',
    'form.notes.ph': 'например, запрос досье / назначение созвона',
    'form.submit':   'Запросить доступ',

    /* ── footer ── */
    'foot.explore':   'Разделы',
    'foot.company':   'Компания',
    'foot.connect':   'Контакты',
    'foot.thesis':    'Тезисы',
    'foot.specs':     'Технология',
    'foot.economics': 'Экономика',
    'foot.market':    'Рынок',
    'foot.about':     'О нас',
    'foot.roadmap':   'Дорожная карта',
    'foot.contact':   'Контакты',

    /* ── faq ── */
    'faq.title': 'Вопросы и ответы.',

    /* ── about ── */
    'about.title':   'PCT подан. Инжиниринг подтверждён. Пре-сид открыт.',
    'about.quote':   'Aetera основана на одном наблюдении: каждая крупная транспортная система, созданная за последние 150 лет, разделяет одни и те же фундаментальные ограничения. <span class="hi">Мы нашли способ выйти за их пределы.</span><br><br><strong>Технология защищена поданной заявкой PCT</strong> и раскрывается в полном объёме под NDA. Что можно сказать публично: она разработана для работы в промышленном масштабе, потребует значительно меньших вложений, чем существующая инфраструктура, и не будет нуждаться ни в дорогах, ни в рельсах.',

    /* ── IP card ── */
    'ip.head':        'ИС · Интеллектуальная собственность',
    'ip.subtitle':    'Ключевая архитектура защищена заявкой PCT; раскрытие — под NDA.',
    'ip.type.k':      'Тип заявки',
    'ip.type.v':      'PCT международная',
    'ip.status.k':    'Статус',
    'ip.status.v':    'Подана · на рассмотрении',
    'ip.breadth.k':   'Объём формулы',
    'ip.breadth.v':   'Система + способ + механизм',
    'ip.territory.k': 'Территориальный охват',
    'ip.territory.v': 'ЕС, США, Япония, Китай, Индия, Россия',
    'ip.date.k':      'Дата приоритета',
    'ip.date.v':      'Раскрывается под NDA',
    'ip.freedom.k':   'Свобода от аналогов',
    'ip.freedom.v':   'Аналоги неизвестны',

    /* ── contact ── */
    'contact.title': 'Запросить<br>доступ.',
    'contact.note':  'Канал для партнеров. Общая презентация открыта; технические модели и раскрытие ИС — под NDA. Отвечаем лично, как правило, в течение 48 часов.',
    'contact.sub':   'Только для квалифицированных инвесторов. Презентация доступна по запросу; детальные инженерные модели и полная юнит-экономика — под NDA.',
  }
};

/**
 * Apply a language to the page.
 * Walks all [data-i18n] elements and replaces innerHTML with the translation.
 * Also toggles .active on .lang-btn elements.
 */
window.setLang = function setLang(lang) {
  if (!window.I18N[lang]) return;
  window.LANG = lang;
  const dict = window.I18N[lang];

  /* switch font stack via CSS html[lang="ru"] selector */
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  /* placeholder translations */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  /* persist choice */
  try { localStorage.setItem('aetera-lang', lang); } catch(e){}

  /* notify dynamic components (specs, scenarios, faq) */
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
};

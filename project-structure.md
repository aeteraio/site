# Структура проекта aetera.io

Текущая версия: модульная SPA-структура (single-page application) на чистом HTML + CSS + JavaScript  
Дата последнего обновления структуры: ~ февраль 2026

## Корневая структура папок



/
├── index.html                  # точка входа, минимальный скелет сайта
├── css/                        # все стили
│   ├── variables.css           # глобальные переменные (:root)
│   ├── background.css          # фон сайта (градиент, текстура и т.д.)
│   ├── style.css               # базовые стили, glass-apple, hover, анимации
│   ├── menu.css                # бургер-меню и полное меню
│   ├── config-home.css         # позиционирование главной страницы
│   ├── config-projects.css     # позиционирование страницы проектов
│   ├── config-transport.css    # стили страницы AE-Transport
│   ├── config-print.css        # стили страницы AE-Print
│   ├── config-drones.css       # стили страницы AE-Drones (если есть)
│   ├── config-contact.css      # стили страницы контактов  
│   ├── config-transport.css    # только переопределения для AE-Transport
│   ├── config-print.css        # только переопределения для AE-Print
│   ├── config-drones.css       # только переопределения для AE-Drones
│   ├── config-project-detail.css # общие стили для всех страниц-деталей проектов (новый файл)
│   ├── config-transport.css          # только переопределения для AE-Transport
│   ├── config-print.css              # только переопределения для AE-Print
│   ├── config-drones.css             # только переопределения для AE-Drones

│   ├──

├── js/                         # скрипты
│   ├── main.js                 # основной скрипт: навигация, загрузка модулей, меню, dark mode, parallax
│   ├── contact.js              # обработка формы контактов (submit, success/error)
│   └── tracker.js              # (опционально) аналитика / трекинг
├── modules/                    # динамически подгружаемые страницы
│   ├── home.html               # главная страница
│   ├── projects.html           # список проектов (карточки)
│   ├── transport.html          # детальная страница AE-Transport
│   ├── print.html              # детальная страница AE-Print
│   ├── drones.html             # детальная страница AE-Drones (если реализована)
│   └── contact.html            # страница контактов + форма
├── fonts/                      # шрифты (woff2)
│   ├── comfortaa.woff2
│   └── Aeonik/
│       ├── Aeonik-Bold.woff2
│       ├── Aeonik-Light.woff2
│       └── Aeonik-Medium.woff2
└── README.md                   # (рекомендуется) описание проекта


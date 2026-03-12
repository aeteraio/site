/**
 * aetera™ Main JS
 * Управление навигацией, меню, темой и логотипом
 */

// 1. Конфигурация страниц
const pageNames = {
    1: 'home',
    2: 'projects',
    3: 'transport',
    4: 'print',
    5: 'contact',
    6: 'drones'
};

// Страницы со скроллом — копирайт внутри модуля, глобальный скрыт
const scrollPages = new Set([3, 4, 5, 6]);

let currentPage = 1;

// 2. Инициализация
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    // Вызываем навигацию для первой страницы
    navigate(1);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const nav = document.getElementById('nav');
            if (nav && nav.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

/**
 * Основная функция навигации
 * @param {number} pageId - номер страницы
 */
async function navigate(pageId) {
    const wrapper = document.getElementById('viewport-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('loaded');

    // Управление логотипом
    const logo = document.querySelector('.logo');
    
    const moduleName = pageNames[pageId] || 'home';

    try {
        const response = await fetch(`modules/${moduleName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} — модуль не найден`);
        }

        const html = await response.text();

        // Небольшая задержка для плавности перехода
        setTimeout(() => {
            wrapper.innerHTML = html;
            currentPage = pageId;

            // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: 
            // Переключаем классы логотипа ТОЛЬКО после того, как HTML модуля вставлен в DOM.
            // Это гарантирует, что селектор #page-1 .logo в config-home.css сработает.
            if (logo) {
                if (pageId === 1) {
                    logo.classList.remove('mini');
                } else {
                    logo.classList.add('mini');
                }
            }

            // Копирайт: фиксированный на статичных страницах, inline на скролл-страницах
            const copyright = document.querySelector('.copyright');
            if (copyright) {
                copyright.style.display = scrollPages.has(pageId) ? 'none' : '';
            }

            window.scrollTo({ top: 0, behavior: 'instant' });

            requestAnimationFrame(() => {
                wrapper.classList.add('loaded');
            });

        }, 180);

    } catch (error) {
        console.error('Navigation error:', error);

        wrapper.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.4rem;
                opacity: 0.7;
                text-align: center;
            ">
                Не удалось загрузить страницу<br>
                <small style="opacity:0.6; margin-top:12px; display:block;">
                    ${error.message}
                </small>
            </div>
        `;
        wrapper.classList.add('loaded');
    }
}

/**
 * Открытие / закрытие мобильного меню
 */
function toggleMenu() {
    const nav = document.getElementById('nav');
    const btn = document.getElementById('menu-btn');

    if (!nav || !btn) return;

    nav.classList.toggle('active');
    btn.classList.toggle('active-toggle');

    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

/**
 * Переключение светлой / тёмной темы
 */
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

/**
 * Применяем сохранённую тему
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}
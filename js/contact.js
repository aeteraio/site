// js/contact.js — обработка формы контактов

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    console.log('[contact.js] Форма найдена — инициализация');

    const successEl = document.querySelector('.form-success');
    const errorEl   = document.querySelector('.form-error');
    const btnText   = form.querySelector('.btn-text');
    const btnLoading = form.querySelector('.btn-loading');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                successEl.style.display = 'block';
                errorEl.style.display = 'none';
                form.reset();
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (err) {
            console.error('[contact.js] Ошибка:', err);
            errorEl.style.display = 'block';
            successEl.style.display = 'none';
        } finally {
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    });
}

// Запускаем при любой смене контента в viewport
const contactObserver = new MutationObserver(initContactForm);
contactObserver.observe(document.getElementById('viewport-wrapper') || document.body, {
    childList: true,
    subtree: true
});

// На случай, если форма уже была
document.addEventListener('DOMContentLoaded', initContactForm);
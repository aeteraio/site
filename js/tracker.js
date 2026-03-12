(function() {
    const _endpoint = '/stat/handler.php'; 

    const _report = (type) => {
        const payload = JSON.stringify({
            act: type,
            ref: document.referrer || 'Прямой заход',
            pth: window.location.pathname
        });

        if (navigator.sendBeacon) {
            navigator.sendBeacon(_endpoint, payload);
        } else {
            fetch(_endpoint, { method: 'POST', body: payload, keepalive: true })
                .catch(error => console.error('Tracker error:', error));
        }
    };

    window.addEventListener('load', () => {
        _report('init');
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            _report('exit');
        }
    });
})();
/* =========================================================
   Utilidades de interfaz (mobile)
   Toasts, loader global, modales y escape de HTML.
   ========================================================= */
const UI = {
    /* ---------- Escape de HTML (previene XSS) ---------- */
    escape(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /* ---------- Toasts (abajo de la pantalla) ---------- */
    toast(message, type = 'info') {
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.textContent = message;
        document.body.appendChild(el);

        setTimeout(() => {
            el.classList.add('toast-hide');
            setTimeout(() => el.remove(), 300);
        }, 3000);
    },

    success(msg) { this.toast(msg, 'success'); },
    error(msg)   { this.toast(msg, 'error'); },
    info(msg)    { this.toast(msg, 'info'); },

    /* ---------- Loader global (pantalla completa) ---------- */
    showLoader() {
        let el = document.getElementById('global-loader');
        if (!el) {
            el = document.createElement('div');
            el.id = 'global-loader';
            el.className = 'global-loader';
            el.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(el);
        }
        el.style.display = 'flex';
    },

    hideLoader() {
        const el = document.getElementById('global-loader');
        if (el) el.style.display = 'none';
    },

    /* ---------- Modal de confirmación ----------
       Uso:
       const ok = await UI.confirm('¿Eliminar restaurante?');
       if (ok) { ... }
    */
    confirm(message, options = {}) {
        const {
            title = 'Confirmar',
            confirmText = 'Aceptar',
            cancelText = 'Cancelar',
            danger = false
        } = options;

        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';

            overlay.innerHTML = `
                <div class="modal">
                    <h3 class="modal__title">${this.escape(title)}</h3>
                    <p class="modal__message">${this.escape(message)}</p>
                    <div class="modal__actions">
                        <button class="btn btn-outline" data-action="cancel">
                            ${this.escape(cancelText)}
                        </button>
                        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm">
                            ${this.escape(confirmText)}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const cleanup = (value) => {
                overlay.remove();
                resolve(value);
            };

            overlay.querySelector('[data-action="cancel"]')
                .addEventListener('click', () => cleanup(false));

            overlay.querySelector('[data-action="confirm"]')
                .addEventListener('click', () => cleanup(true));

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(false);
            });
        });
    },

    /* ---------- Redirección ---------- */
    redirect(path) {
        window.location.href = path;
    }
};
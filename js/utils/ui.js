/* =========================================================
   Utilidades de interfaz (mobile)
   ========================================================= */
const UI = {
    // Escapa caracteres especiales para evitar ataques XSS al inyectar HTML
    escape(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    // Crea y muestra una notificación flotante (Toast) que desaparece sola a los 2 segundos
    toast(message, type = 'info') {
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.textContent = message;
        document.body.appendChild(el);

        setTimeout(() => {
            el.classList.add('toast-hide');
            setTimeout(() => el.remove(), 300);
        }, 2000);
    },

    // Atajos para mostrar toasts de éxito, error o información
    success(msg) { this.toast(msg, 'success'); },
    error(msg)   { this.toast(msg, 'error'); },
    info(msg)    { this.toast(msg, 'info'); },

    // Crea y muestra un spinner de carga a pantalla completa
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

    // Oculta el spinner de carga global
    hideLoader() {
        const el = document.getElementById('global-loader');
        if (el) el.style.display = 'none';
    },

    // Muestra un modal de confirmación y devuelve una Promesa (true si acepta, false si cancela)
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

            // Elimina el modal del DOM y resuelve la promesa con el valor elegido
            const cleanup = (value) => {
                overlay.remove();
                resolve(value);
            };

            overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => cleanup(false));
            overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => cleanup(true));

            // Cierra el modal si se hace clic fuera de él (en el fondo oscuro)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(false);
            });
        });
    },

    // Redirige al usuario a otra página
    redirect(path) {
        window.location.href = path;
    }
};
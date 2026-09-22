/* =========================================================
   Página de login (mobile)
   ========================================================= */
(function () {
    Guard.requireGuest();

    const form      = document.getElementById('login-form');
    const emailIn   = document.getElementById('email');
    const passIn    = document.getElementById('password');
    const btn       = document.getElementById('login-btn');
    const errorBox  = document.getElementById('form-error');

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.hidden = false;
    }

    function clearError() {
        errorBox.hidden = true;
        errorBox.textContent = '';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError();

        const email    = emailIn.value.trim();
        const password = passIn.value;

        if (!email)    return showError('El email es obligatorio.');
        if (!password) return showError('La contraseña es obligatoria.');
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return showError('El formato del email no es válido.');
        }

        btn.disabled = true;
        btn.textContent = 'Ingresando...';
        UI.showLoader();

        try {
            const data = await AuthApi.login(email, password);
            Session.save(data.token, data.user);
            UI.success('¡Bienvenido!');
            UI.redirect('home.html');

        } catch (err) {
            if (err.errors) {
                const first = Object.values(err.errors)[0];
                showError(first || err.message);
            } else if (err.status === 401) {
                showError('Email o contraseña incorrectos.');
            } else if (err.status === 0) {
                showError('No se pudo conectar con el servidor.');
            } else {
                showError(err.message || 'Error al iniciar sesión.');
            }
        } finally {
            btn.disabled = false;
            btn.textContent = 'Iniciar sesión';
            UI.hideLoader();
        }
    });
})();
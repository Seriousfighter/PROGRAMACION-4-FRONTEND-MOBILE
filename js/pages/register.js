/* =========================================================
   Página de registro (mobile)
   ========================================================= */
(function () {
    Guard.requireGuest();

    const form      = document.getElementById('register-form');
    const nameIn    = document.getElementById('name');
    const emailIn   = document.getElementById('email');
    const passIn    = document.getElementById('password');
    const confirmIn = document.getElementById('password-confirm');
    const btn       = document.getElementById('register-btn');
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

        const name     = nameIn.value.trim();
        const email    = emailIn.value.trim();
        const password = passIn.value;
        const confirm  = confirmIn.value;

        // Validaciones del frontend
        if (!name) {
            return showError('El nombre es obligatorio.');
        }
        if (name.length > 100) {
            return showError('El nombre no puede superar los 100 caracteres.');
        }
        if (!email) {
            return showError('El email es obligatorio.');
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return showError('El formato del email no es válido.');
        }
        if (!password) {
            return showError('La contraseña es obligatoria.');
        }
        if (password.length < 6) {
            return showError('La contraseña debe tener al menos 6 caracteres.');
        }
        if (password.length > 72) {
            return showError('La contraseña es demasiado larga.');
        }
        if (password !== confirm) {
            return showError('Las contraseñas no coinciden.');
        }

        btn.disabled = true;
        btn.textContent = 'Creando cuenta...';
        UI.showLoader();

        try {
            const data = await AuthApi.register(name, email, password);
            Session.save(data.token, data.user);
            UI.success('¡Cuenta creada! Bienvenido.');
            UI.redirect('home.html');

        } catch (err) {
            if (err.errors) {
                const first = Object.values(err.errors)[0];
                showError(first || err.message);
            } else if (err.status === 409) {
                showError('Ese email ya está registrado. Probá iniciar sesión.');
            } else if (err.status === 0) {
                showError('No se pudo conectar con el servidor.');
            } else {
                showError(err.message || 'Error al crear la cuenta.');
            }
        } finally {
            btn.disabled = false;
            btn.textContent = 'Crear cuenta';
            UI.hideLoader();
        }
    });
})();
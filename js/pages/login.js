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

        // 1. Bloqueamos el botón y mostramos la ruedita centrada
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" style="width: 18px; height: 18px; border-width: 2px; margin: 0; border-top-color: #fff; border-color: rgba(255,255,255,0.3);"></span> <span>Ingresando...</span>';

        try {
            const data = await AuthApi.login(email, password);
            Session.save(data.token, data.user);
            
            // Mostramos el éxito brevemente antes de redirigir
            UI.success('¡Bienvenido!');
            
            setTimeout(() => {
                UI.redirect('home.html');
            }, 500); // Medio segundo de delay para que se lea el mensaje de éxito

        } catch (err) {
            // Si hay error, mostramos el mensaje
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
            
            // 2. Restauramos el botón si hubo un error
            btn.disabled = false;
            btn.innerHTML = 'Iniciar sesión';
        }
    });
})();
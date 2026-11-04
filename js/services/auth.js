/* =========================================================
   Servicio de autenticación (mobile)
   - Centraliza las llamadas a la API relacionadas con el login,
     registro y manejo de la sesión del usuario.
   ========================================================= */
   const AuthApi = {
    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param {string} name - Nombre del usuario.
     * @param {string} email - Correo electrónico.
     * @param {string} password - Contraseña.
     */
    register(name, email, password) {
         // El tercer parámetro (false) indica que NO se envíe el token de sesión.
        // Esto es lógico porque el usuario todavía no está logueado.
        return ApiClient.post('/register', { name, email, password }, false);
    },


    /**
     * Inicia sesión con email y contraseña.
     * 
     * @param {string} email - Correo electrónico.
     * @param {string} password - Contraseña.
     */
    login(email, password) {
         // Enviamos las credenciales al endpoint de login.
        // El "false" indica que no se adjunte un token (porque aún no lo tenemos).
        return ApiClient.post('/login', { email, password }, false);
    },


      /**
     * Obtiene los datos del usuario actualmente logueado.
     * Útil para verificar si el token sigue siendo válido o para traer
     * información actualizada del perfil.
     */
    me() {
        // Aquí SÍ se envía el token por defecto, ya que el cliente lo necesita para identificar al usuario.
        return ApiClient.get('/me');
    },
    

     /**
     * Cierra la sesión del usuario.
     * Borra los datos guardados y lo redirige al login.
     */
    logout() {
        // Elimina el token y los datos del usuario del almacenamiento local (localStorage o sessionStorage)
        Session.clear();

        // Redirige al usuario a la página de inicio de sesión
        UI.redirect('index.html');
    }
};
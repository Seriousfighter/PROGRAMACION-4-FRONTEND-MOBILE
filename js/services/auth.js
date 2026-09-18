/* =========================================================
   Servicio de autenticación (mobile)
   ========================================================= */
const AuthApi = {
    register(name, email, password) {
        return ApiClient.post('/register', { name, email, password }, false);
    },

    login(email, password) {
        return ApiClient.post('/login', { email, password }, false);
    },

    me() {
        return ApiClient.get('/me');
    },

    logout() {
        Session.clear();
        UI.redirect('index.html');
    }
};
/* =========================================================
   Configuración centralizada
   Detecta automáticamente si está corriendo en localhost
   o en la red local (para probar desde el celular).
   ========================================================= */
const CONFIG = {
    // URL base de la API REST (sin barra al final)
    // Se calcula según el host desde donde se abra la página.
    API_URL: (() => {
        const host = window.location.hostname;

        // Si estamos en localhost o 127.0.0.1 → usar localhost
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost/messapi/api';
        }

        // Si estamos en otra IP (ej: 192.168.100.13) → usar esa misma IP
        return `http://${host}/messapi/api`;
    })(),

    // Datos de la aplicación
    APP_NAME: 'Mesas Disponibles',

    // Claves del localStorage
    TOKEN_KEY: 'mesas_token',
    USER_KEY:  'mesas_user'
};
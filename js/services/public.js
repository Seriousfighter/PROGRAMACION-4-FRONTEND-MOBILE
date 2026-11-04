/* =========================================================
   Servicio público (API)
   - Agrupa las peticiones que NO requieren estar logueado.
   - Se usa para la vista pública donde cualquiera puede ver los restaurantes.
   ========================================================= */
const PublicApi = {
    
    /**
     * Trae la lista de todos los restaurantes.
     * El "false" indica que NO mande el token de sesión.
     */
    listRestaurants() {
        return ApiClient.get('/public/restaurants', false);
    },

    /**
     * Trae los datos de un restaurante específico usando su ID.
     * El "false" indica que NO mande el token de sesión.
     */
    getRestaurant(id) {
        return ApiClient.get(`/public/restaurants/${id}`, false);
    }
};
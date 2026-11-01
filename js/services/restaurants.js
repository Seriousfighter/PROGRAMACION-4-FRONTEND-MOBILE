/* =========================================================
   Servicio de restaurantes (mobile)
   ========================================================= */
const RestaurantApi = {
    list() {
        return ApiClient.get('/restaurants'); // Trae todos los restaurantes del usuario logueado
    },

    getById(id) {
        return ApiClient.get(`/restaurants/${id}`);// Trae un restaurante específico por su ID
    },

    create(data) {
        return ApiClient.post('/restaurants', data); // Crea un nuevo restaurante
    },

    update(id, data) {
        return ApiClient.put(`/restaurants/${id}`, data);// Actualiza los datos de un restaurante
    },

    delete(id) {
        return ApiClient.del(`/restaurants/${id}`);  // Elimina un restaurante
    },

    listTables(id) {
        return ApiClient.get(`/restaurants/${id}/tables`); // Trae todas las mesas de un restaurante
    },

    createTable(id, data) {
        return ApiClient.post(`/restaurants/${id}/tables`, data); // Crea una mesa nueva en un restaurante
    }
};
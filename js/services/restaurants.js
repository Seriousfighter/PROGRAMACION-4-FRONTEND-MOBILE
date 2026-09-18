/* =========================================================
   Servicio de restaurantes (mobile)
   ========================================================= */
const RestaurantApi = {
    list() {
        return ApiClient.get('/restaurants');
    },

    getById(id) {
        return ApiClient.get(`/restaurants/${id}`);
    },

    create(data) {
        return ApiClient.post('/restaurants', data);
    },

    update(id, data) {
        return ApiClient.put(`/restaurants/${id}`, data);
    },

    delete(id) {
        return ApiClient.del(`/restaurants/${id}`);
    },

    listTables(id) {
        return ApiClient.get(`/restaurants/${id}/tables`);
    },

    createTable(id, data) {
        return ApiClient.post(`/restaurants/${id}/tables`, data);
    }
};
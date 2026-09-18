/* =========================================================
   Servicio de mesas (mobile)
   ========================================================= */
const TableApi = {
    getById(id) {
        return ApiClient.get(`/tables/${id}`);
    },

    update(id, data) {
        return ApiClient.put(`/tables/${id}`, data);
    },

    delete(id) {
        return ApiClient.del(`/tables/${id}`);
    },

    rotateStatus(id) {
        return ApiClient.patch(`/tables/${id}/status`);
    },

    listStatuses() {
        return ApiClient.get('/table-statuses');
    }
};
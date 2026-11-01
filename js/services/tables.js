/* =========================================================
   Servicio de mesas (mobile)
   ========================================================= */
const TableApi = {
    getById(id) {
        return ApiClient.get(`/tables/${id}`);// Trae los datos de una mesa específica
    },

    update(id, data) {
        return ApiClient.put(`/tables/${id}`, data);// Actualiza los datos de una mesa (ej: sillas)
    },

    delete(id) {
        return ApiClient.del(`/tables/${id}`); // Elimina una mesa del sistema
    },

    rotateStatus(id) {
        return ApiClient.patch(`/tables/${id}/status`); // Cambia el estado de la mesa (1->2->3->1)
    },

    listStatuses() {
        return ApiClient.get('/table-statuses');// Trae la lista de estados posibles (Libre, Ocupada, etc.)
    }
};
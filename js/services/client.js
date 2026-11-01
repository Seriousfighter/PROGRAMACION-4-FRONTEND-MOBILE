/* =========================================================
   Cliente HTTP centralizado
   - Se encarga de hacer todas las peticiones a la API.
   - Maneja automáticamente los headers, el token y los errores.
   ========================================================= */
   const ApiClient = {
     /*Función principal que arma y envía la petición HTTP.*/
    async request(path, { method = 'GET', body = null, auth = true } = {}) {
         // 1. Preparamos los headers (cabeceras) de la petición
        const headers = {
            'Accept': 'application/json'
        };

         // Si enviamos datos (body), avisamos que es un JSON
        if (body !== null) {
            headers['Content-Type'] = 'application/json';
        }

        // 2. Si la petición requiere autenticación, adjuntamos el token
        if (auth) {
            const token = Session.getToken();
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        // 3. Armamos las opciones finales de la petición
        const options = { method, headers };
        if (body !== null) options.body = JSON.stringify(body);

        let response;
        try {
            // 4. Hacemos la petición real al backend
            response = await fetch(`${CONFIG.API_URL}${path}`, options);
        } catch (err) {
             // Si falla la red (sin internet o servidor caído)
            throw { status: 0, message: 'No se pudo conectar con el servidor.' };
        }

        // 5. Si el servidor responde 401 (No autorizado), cerramos sesión
        if (response.status === 401 && auth) {
            Session.clear();
            UI.redirect('index.html');
            throw { status: 401, message: 'Sesión expirada' };
        }

        // 6. Si la respuesta está vacía (ej: un DELETE), devolvemos null
        if (response.status === 204) return null;

        // 7. Intentamos leer la respuesta en formato JSON
        let data = null;
        try { data = await response.json(); } catch (_) {}

         // 8. Si la respuesta tiene un error (ej: 400, 404, 500), lo lanzamos
        if (!response.ok) {
            throw {
                status: response.status,
                message: (data && data.message) || 'Error del servidor',
                errors: (data && data.errors) || null
            };
        }

         // 9. Si todo salió bien, devolvemos los datos
        return data;
    },

      // Atajos para no escribir tanto (GET, POST, PUT, PATCH, DELETE)
    get(path, auth = true)        { return this.request(path, { method: 'GET', auth }); },
    post(path, body, auth = true) { return this.request(path, { method: 'POST', body, auth }); },
    put(path, body, auth = true)  { return this.request(path, { method: 'PUT', body, auth }); },
    patch(path, body = null, auth = true) { return this.request(path, { method: 'PATCH', body, auth }); },
    del(path, auth = true)        { return this.request(path, { method: 'DELETE', auth }); }
};
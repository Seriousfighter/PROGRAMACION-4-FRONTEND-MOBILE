/* =========================================================
   Página pública de restaurantes (mobile)
   - Carga la lista de restaurantes desde la API.
   - Muestra el estado de disponibilidad de mesas.
   - Incluye buscador por texto y filtro de "Solo libres".
   ========================================================= */
   (function () {
    // Referencias a los elementos del DOM
    const list = document.getElementById('restaurants-list');
    const loading = document.getElementById('loading');
    const errorBox = document.getElementById('error-box');
    const errorMsg = document.getElementById('error-message');
    const emptyBox = document.getElementById('empty-box');
    const emptyMsg = document.getElementById('empty-message');
    const backToTop = document.getElementById('back-to-top');

     // Elementos del buscador
    const searchToggle = document.getElementById('search-toggle');
    const searchPanel = document.getElementById('search-panel');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    // Array donde guardamos los restaurantes para filtrar sin volver a pedir a la API
    let allRestaurants = [];


    /* Filtros */
    const onlyOpenBtn = document.getElementById('only-open-btn');
    let onlyOpen = false;
   

  /* ---------------------------------------------------------
       Links oficiales de Google Maps por ID de restaurante.
       Si un restaurante no está acá, se genera un link de búsqueda
       automático usando su dirección.
       --------------------------------------------------------- */
    const RESTAURANT_MAPS = {
        1: 'https://maps.app.goo.gl/TacUNTDpGwxc7tv1A',  // Darcy Resto
        2: 'https://maps.app.goo.gl/6Ub6po2NoJiCbKkE7',  // Punto y Coma
        3: 'https://maps.app.goo.gl/JuqYDJV8vww8aGma6',  // Der Fritz
        6: 'https://maps.app.goo.gl/QCBx3hGM6W1ZZvg96'   // Ándale
    };

    /* Devuelve el link de Google Maps para un restaurante.
    *Si tiene un link oficial, lo usa. Si no, arma una búsqueda con su dirección.*/
    function mapsLink(r) {
        if (RESTAURANT_MAPS[r.id] && !RESTAURANT_MAPS[r.id].includes('...')) {
            return RESTAURANT_MAPS[r.id];
        }
         // Codificamos la dirección para que no rompa la URL (ej: tildes o espacios)
        const query = encodeURIComponent((r.address || '') + ', Crespo, Entre Ríos, Argentina');
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

     /* Oculta todas las vistas (loading, error, vacío, lista) y muestra solo la que recibe.*/
    function show(el) {
        [loading, errorBox, emptyBox, list]
            .forEach(e => e.hidden = true);
        el.hidden = false;
    }

     /* Construye el HTML de una tarjeta de restaurante.
     * Calcula el porcentaje de mesas libres y el color de la barra.*/
    function buildCard(r, index) {
        const available = r.available_tables;
        const total = r.total_tables;
        const pct = total > 0 ? (available / total) * 100 : 0;

         // Retraso escalonado para la animación de entrada de cada tarjeta
        const delay = Math.min(index * 40, 400);
        const mapsUrl = mapsLink(r);

        return `
            <article class="restaurant-row" data-id="${r.id}"
                     style="animation-delay: ${delay}ms">
                <div class="restaurant-row__head">
                    <h3 class="restaurant-row__name">
                        <span>${UI.escape(r.name)}</span>
                        <span class="status-dot status-dot--${r.is_open ? 'open' : 'closed'}"
                              title="${r.is_open ? 'Abierto' : 'Cerrado'}"></span>
                    </h3>
                    <div class="restaurant-row__info">
                        ${r.phone ? `<span class="restaurant-row__phone">📞 ${UI.escape(r.phone)}</span>` : ''}
                        <span class="restaurant-row__address">${UI.escape(r.address)}</span>
                    </div>
                </div>

                ${r.description
                ? `<p class="restaurant-row__desc">"${UI.escape(r.description)}"</p>`
                : ''}

                <div class="restaurant-row__footer">
                    <p class="restaurant-row__count">
                        <strong>${available}</strong> de ${total} disponibles
                    </p>
                    <a href="${mapsUrl}" target="_blank" rel="noopener"
                       class="restaurant-row__maps">
                        📍 Ver en Maps
                    </a>
                </div>

                <div class="availability-bar">
                    <div class="availability-bar__fill"
                         style="width: ${pct.toFixed(1)}%"></div>
                </div>
            </article>
        `;
    }

    /* Aplica los filtros de búsqueda de texto y el de "Solo libres".
     * Luego vuelve a dibujar la lista en pantalla.*/
           function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();

        // // Diccionario de palabras clave: si el usuario busca "pizza",
        // también mostramos los restaurantes italianos.
        const SEARCH_KEYWORDS = {
            'pizza': ['italiano', 'pasta', 'pizza'],
            'pasta': ['italiano', 'pasta', 'pizza'],
            'taco': ['mexicana', 'mexicanas', 'tacos', 'ándale'],
            'asado': ['parrilla', 'variado', 'carne', 'asado'],
            'carne': ['parrilla', 'variado', 'carne', 'asado'],
            'parrilla': ['parrilla', 'variado', 'carne', 'asado'],
            'cerveza': ['bar', 'cerveza', 'birra'],
            'bar': ['bar', 'cerveza', 'birra']
        };

        // Filtramos el array de restaurantes
        let filtered = allRestaurants.filter(r => {
            // 1. Filtro "Solo libres": si está activo y el restaurante está cerrado, lo saca.
            if (onlyOpen && !r.is_open) return false;

            // Si no hay texto, mostramos todos
            if (!query) return true;

             // Juntamos todos los textos del restaurante en un solo string para buscar
            const haystack = [r.name, r.address, r.description || '']
                .join(' ').toLowerCase();

             // 2. Búsqueda normal: Si el texto está en el nombre, dirección o descripción.
            // Usamos .includes() para que funcione mientras escribe ("it", "ita", "ital").
            if (haystack.includes(query)) return true;

            // 3. Búsqueda en el diccionario: si escribió el inicio de una palabra clave.
            // Ejemplo: Si escribe "pi", busca si "pizza" empieza con "pi".
            for (const [key, synonyms] of Object.entries(SEARCH_KEYWORDS)) {
                if (key.startsWith(query)) {
                    // Verificamos si el restaurante tiene alguno de esos sinónimos
                    if (synonyms.some(syn => haystack.includes(syn))) {
                        return true;
                    }
                }
            }

            return false;
        });

        // Ordenamos: primero los que tienen más mesas disponibles, luego por nombre alfabético
        filtered.sort((a, b) => b.available_tables - a.available_tables || a.name.localeCompare(b.name));

          // Mostramos un mensaje si no hay resultados o dibujamos las tarjetas
        if (filtered.length === 0) {
            emptyMsg.textContent = query
                ? `No se encontraron resultados para "${query}".`
                : 'No hay restaurantes que coincidan.';
            list.hidden = true;
            emptyBox.hidden = false;
        } else {
            list.innerHTML = filtered.map((r, i) => buildCard(r, i)).join('');
            list.hidden = false;
            emptyBox.hidden = true;
        }
    }

    /*Carga los datos desde la API y los guarda en el estado global.*/
    async function load() {
        show(loading);
        try {
            const response = await PublicApi.listRestaurants();
            const restaurants = response.data || [];
            allRestaurants = restaurants;

            if (restaurants.length === 0) {
                emptyMsg.textContent = 'No hay restaurantes registrados todavía.';
                show(emptyBox);
                return;
            }

            // Dibujamos las tarjetas iniciales
            list.innerHTML = restaurants.map((r, i) => buildCard(r, i)).join('');
            show(list);

        } catch (err) {
            errorMsg.textContent = err.message || 'Error al cargar los restaurantes.';
            show(errorBox);
        }
    }

     /* =========================================================
       Lógica del Buscador Desplegable
       ========================================================= */
    function openSearch() {
        searchPanel.hidden = false;
          // Hacemos foco en el input con un pequeño delay para que la animación termine
        setTimeout(() => searchInput.focus(), 100);
    }

    function closeSearch() {
        searchPanel.hidden = true;
        searchInput.value = ''; // Limpia la búsqueda
        applyFilters(); // Vuelve a mostrar todo
    }

    // Eventos del buscador
    searchToggle.addEventListener('click', () => {
        if (searchPanel.hidden) openSearch();
        else closeSearch();
    });

    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', applyFilters);


  /* =========================================================
       Botón "Volver Arriba"
       ========================================================= */
    const SCROLL_THRESHOLD = 200;// Píxeles de scroll para mostrar el botón

    function updateBackToTop() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    }

    // Usamos passive:true para mejorar el rendimiento del scroll
    window.addEventListener('scroll', updateBackToTop, { passive: true });

    // Evento click del botón para subir suavemente al inicio
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

/* =========================================================
       Filtro "Solo libres"
       ========================================================= */
    if (onlyOpenBtn) {
        onlyOpenBtn.addEventListener('click', () => {
            onlyOpen = !onlyOpen;// Cambia el estado del filtro
            onlyOpenBtn.classList.toggle('is-active', onlyOpen); // Cambia el color del botón
            applyFilters();  // Vuelve a aplicar los filtros
        });
    }

    // Iniciamos la carga de datos
    load();
})();
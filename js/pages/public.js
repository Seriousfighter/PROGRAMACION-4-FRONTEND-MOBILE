/* =========================================================
   Página pública de restaurantes (mobile)
   ========================================================= */
(function () {
    const list = document.getElementById('restaurants-list');
    const loading = document.getElementById('loading');
    const errorBox = document.getElementById('error-box');
    const errorMsg = document.getElementById('error-message');
    const emptyBox = document.getElementById('empty-box');
    const emptyMsg = document.getElementById('empty-message');
    const backToTop = document.getElementById('back-to-top');

    const searchToggle = document.getElementById('search-toggle');
    const searchPanel = document.getElementById('search-panel');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    let allRestaurants = [];

    /* =====================================================
       Links de Google Maps
       ===================================================== */

    const RESTAURANT_MAPS = {
        1: 'https://maps.app.goo.gl/TacUNTDpGwxc7tv1A',
        2: 'https://maps.app.goo.gl/6Ub6po2NoJiCbKkE7',
        3: 'https://maps.app.goo.gl/JuqYDJV8vww8aGma6',
        6: 'https://maps.app.goo.gl/QCBx3hGM6W1ZZvg96'
    };

    function mapsLink(r) {
        if (
            RESTAURANT_MAPS[r.id] &&
            !RESTAURANT_MAPS[r.id].includes('...')
        ) {
            return RESTAURANT_MAPS[r.id];
        }

        const ubicacion = [
            r.address,
            'Crespo',
            'Entre Ríos',
            'Argentina'
        ]
            .filter(Boolean)
            .join(', ');

        const query = encodeURIComponent(ubicacion);

        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    /* =====================================================
       Mostrar estados de la página
       ===================================================== */

    function show(el) {
        [loading, errorBox, emptyBox, list]
            .forEach(element => {
                if (element) {
                    element.hidden = true;
                }
            });

        if (el) {
            el.hidden = false;
        }
    }

    /* =====================================================
       Estado de disponibilidad
       ===================================================== */

    function getAvailabilityStatus(r) {

        const isOpen =
            r.is_open === true ||
            r.is_open === 1 ||
            r.is_open === '1';

        if (!isOpen) {
            return {
                className: 'closed',
                text: 'Cerrado'
            };
        }

        const available = Number(r.available_tables) || 0;
        const total = Number(r.total_tables) || 0;

        if (available === 0) {
            return {
                className: 'full',
                text: 'Sin mesas disponibles'
            };
        }

        const pct =
            total > 0
                ? (available / total) * 100
                : 0;

        if (pct <= 30) {
            return {
                className: 'low',
                text: 'Pocas mesas disponibles'
            };
        }

        return {
            className: 'available',
            text: 'Mesas disponibles'
        };
    }

    /* =====================================================
       Crear tarjeta del restaurante
       ===================================================== */

    function buildCard(r, index) {

        const delay = Math.min(index * 40, 400);
        const mapsUrl = mapsLink(r);
        const status = getAvailabilityStatus(r);

        const isOpen =
            r.is_open === true ||
            r.is_open === 1 ||
            r.is_open === '1';

        return `
            <article
                class="restaurant-card restaurant-card--${status.className}"
                data-id="${r.id}"
                style="animation-delay: ${delay}ms"
            >

                <div class="restaurant-card__header">

                    <h3 class="restaurant-card__name">
                        ${UI.escape(r.name || 'Restaurante')}
                    </h3>

                </div>

                <div class="restaurant-card__details">

                    ${r.address
                ? `
                                <p class="restaurant-card__address">
                                    📍 ${UI.escape(r.address)}
                                </p>
                            `
                : ''
            }

                    ${r.phone
                ? `
                                <p class="restaurant-card__phone">
                                    📞 ${UI.escape(r.phone)}
                                </p>
                            `
                : ''
            }

                </div>

                ${r.description
                ? `
                            <p class="restaurant-card__description">
                                ${UI.escape(r.description)}
                            </p>
                        `
                : ''
            }

                <div class="restaurant-card__status">

                    <span
                        class="restaurant-card__dot
                               restaurant-card__dot--${status.className}">
                    </span>

                    <strong>
                        ${status.text}
                    </strong>

                </div>

                ${isOpen
                ? `
                            <a
                                href="${mapsUrl}"
                                target="_blank"
                                rel="noopener"
                                class="restaurant-card__maps"
                            >
                                📍 Cómo llegar
                            </a>
                        `
                : ''
            }

            </article>
        `;
    }

    /* =====================================================
       Buscador
       ===================================================== */

    function applyFilters() {

        const query =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : '';

        const filtered = allRestaurants.filter(r => {

            if (!query) {
                return true;
            }

            const haystack = [
                r.name || '',
                r.address || '',
                r.description || ''
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });

        if (filtered.length === 0) {

            emptyMsg.textContent = query
                ? `No se encontraron resultados para "${query}".`
                : 'No hay restaurantes registrados todavía.';

            list.hidden = true;
            emptyBox.hidden = false;

            return;
        }

        list.innerHTML =
            filtered
                .map((r, i) => buildCard(r, i))
                .join('');

        list.hidden = false;
        emptyBox.hidden = true;
    }

    /* =====================================================
       Cargar restaurantes
       ===================================================== */

    async function load() {

        show(loading);

        try {

            const response =
                await PublicApi.listRestaurants();

            const restaurants =
                response.data || [];

            allRestaurants = restaurants;

            if (restaurants.length === 0) {

                emptyMsg.textContent =
                    'No hay restaurantes registrados todavía.';

                show(emptyBox);

                return;
            }

            list.innerHTML =
                restaurants
                    .map((r, i) => buildCard(r, i))
                    .join('');

            show(list);

        } catch (err) {

            console.error(
                'Error cargando restaurantes:',
                err
            );

            errorMsg.textContent =
                err.message ||
                'Error al cargar los restaurantes.';

            show(errorBox);
        }
    }

    /* =====================================================
       Abrir / cerrar buscador
       ===================================================== */

    function openSearch() {

        if (!searchPanel) return;

        searchPanel.hidden = false;

        setTimeout(() => {
            searchInput?.focus();
        }, 100);
    }

    function closeSearch() {

        if (!searchPanel) return;

        searchPanel.hidden = true;

        if (searchInput) {
            searchInput.value = '';
        }

        applyFilters();
    }

    searchToggle?.addEventListener(
        'click',
        () => {

            if (searchPanel.hidden) {
                openSearch();
            } else {
                closeSearch();
            }

        }
    );

    searchClose?.addEventListener(
        'click',
        closeSearch
    );

    searchInput?.addEventListener(
        'input',
        applyFilters
    );

    /* =====================================================
       Botón volver arriba
       ===================================================== */

    const SCROLL_THRESHOLD = 200;

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > SCROLL_THRESHOLD) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    }

    window.addEventListener(
        'scroll',
        updateBackToTop,
        { passive: true }
    );

    backToTop?.addEventListener(
        'click',
        () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );

    /* =====================================================
       Iniciar
       ===================================================== */

    load();

})();
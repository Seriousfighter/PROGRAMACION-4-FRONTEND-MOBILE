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

    /* Links de Google Maps por restaurante */
    const RESTAURANT_MAPS = {
        1: 'https://maps.app.goo.gl/TacUNTDpGwxc7tv1A',  // Darcy Resto
        2: 'https://maps.app.goo.gl/6Ub6po2NoJiCbKkE7',  // Punto y Coma
        3: 'https://maps.app.goo.gl/JuqYDJV8vww8aGma6',  // Der Fritz
        6: 'https://maps.app.goo.gl/QCBx3hGM6W1ZZvg96'   // Ándale
    };

    function mapsLink(r) {
        if (RESTAURANT_MAPS[r.id] && !RESTAURANT_MAPS[r.id].includes('...')) {
            return RESTAURANT_MAPS[r.id];
        }
        const query = encodeURIComponent((r.address || '') + ', Crespo, Entre Ríos, Argentina');
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    function show(el) {
        [loading, errorBox, emptyBox, list]
            .forEach(e => e.hidden = true);
        el.hidden = false;
    }

    function buildCard(r, index) {
        const available = r.available_tables;
        const total = r.total_tables;
        const pct = total > 0 ? (available / total) * 100 : 0;
        const delay = Math.min(index * 40, 400);
        const mapsUrl = mapsLink(r);

        return `
            <article class="restaurant-row" data-id="${r.id}"
                     style="animation-delay: ${delay}ms">
                <div class="restaurant-row__head">
                    <h3 class="restaurant-row__name">${UI.escape(r.name)}</h3>
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

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();

        let filtered = allRestaurants.filter(r => {
            if (!query) return true;
            const haystack = [r.name, r.address, r.description || '']
                .join(' ').toLowerCase();
            return haystack.includes(query);
        });

        if (filtered.length === 0) {
            emptyMsg.textContent = query
                ? `No se encontraron resultados para "${query}".`
                : 'No hay restaurantes registrados todavía.';
            list.hidden = true;
            emptyBox.hidden = false;
        } else {
            list.innerHTML = filtered.map((r, i) => buildCard(r, i)).join('');
            list.hidden = false;
            emptyBox.hidden = true;
        }
    }

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

            list.innerHTML = restaurants.map((r, i) => buildCard(r, i)).join('');
            show(list);

        } catch (err) {
            errorMsg.textContent = err.message || 'Error al cargar los restaurantes.';
            show(errorBox);
        }
    }

    function openSearch() {
        searchPanel.hidden = false;
        setTimeout(() => searchInput.focus(), 100);
    }

    function closeSearch() {
        searchPanel.hidden = true;
        searchInput.value = '';
        applyFilters();
    }

    searchToggle.addEventListener('click', () => {
        if (searchPanel.hidden) openSearch();
        else closeSearch();
    });

    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', applyFilters);

    /* Botón "volver arriba" */
    const SCROLL_THRESHOLD = 200;

    function updateBackToTop() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    load();
})();
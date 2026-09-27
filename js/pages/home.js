/* =========================================================
   Panel general de mesas (mobile)
   ========================================================= */

(function () {

    Guard.requireAuth();

    const $ = (id) =>
        document.getElementById(id);


    /* =====================================================
       ESTADOS
       ===================================================== */

    const STATUS = {

        1: {
            key: 'available',
            label: 'Disponible'
        },

        2: {
            key: 'occupied',
            label: 'Ocupada'
        },

        3: {
            key: 'reserved',
            label: 'Reservada'
        }

    };


    /* =====================================================
       NAVBAR
       ===================================================== */

    const navHome = $('nav-home');
    const navEdit = $('nav-edit');
    const navLogout = $('nav-logout');


    /* =====================================================
       PANEL
       ===================================================== */

    const restaurantInfo =
        $('restaurant-info');

    const loading =
        $('loading');

    const emptyState =
        $('empty-state');

    const noTablesState =
        $('no-tables-state');

    const tablesContent =
        $('tables-content');

    const tablesGrid =
        $('tables-grid');

    const createBtn =
        $('create-restaurant-btn');

    const addTablesBtn =
        $('add-tables-btn');


    /* =====================================================
       CONTADORES
       ===================================================== */

    const countAvailable =
        $('count-available');

    const countReserved =
        $('count-reserved');

    const countOccupied =
        $('count-occupied');


    /* =====================================================
       TOGGLE
       ===================================================== */

    const openCheckbox =
        $('open-checkbox');

    const toggleLabel =
        $('toggle-label');


    /* =====================================================
       MODAL EDITAR
       ===================================================== */

    const editModal =
        $('edit-modal');

    const editCancel =
        $('edit-cancel');

    const editCancel2 =
        $('edit-cancel-2');

    const editForm =
        $('edit-form');

    const editSave =
        $('edit-save');

    const formError =
        $('form-error');


    const nameIn =
        $('name');

    const addressIn =
        $('address');

    const phoneIn =
        $('phone');

    const descIn =
        $('description');


    const btnMinus =
        $('btn-minus');

    const btnPlus =
        $('btn-plus');

    const tablesCount =
        $('tables-count');

    const hintEl =
        $('numberbox-hint');

    const tableManagementList =
        $('table-management-list');


    const tabs =
        document.querySelectorAll('.tab');

    const tabPanels =
        document.querySelectorAll(
            '.tab-panel'
        );


    /* =====================================================
       MODAL CREAR
       ===================================================== */

    const createModal =
        $('create-modal');

    const cancelCreate =
        $('cancel-create-btn');

    const submitCreate =
        $('submit-create-btn');

    const createForm =
        $('create-restaurant-form');

    const modalError =
        $('modal-error');


    /* =====================================================
       MODALES
       ===================================================== */

    const confirmModal =
        $('confirm-modal');

    const confirmTitle =
        $('confirm-title');

    const confirmMsg =
        $('confirm-message');

    const confirmOk =
        $('confirm-ok');

    const confirmCancel =
        $('confirm-cancel');


    const blockedModal =
        $('blocked-modal');

    const blockedMsg =
        $('blocked-message');

    const blockedOk =
        $('blocked-ok');


    /* =====================================================
       VARIABLES
       ===================================================== */

    let restaurant = null;

    let tables = [];

    let originalCount = 0;

    const MIN_TABLES = 1;

    const MAX_TABLES = 100;


    /* =====================================================
       NAVBAR
       ===================================================== */

    navHome.addEventListener(
        'click',
        () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    navEdit.addEventListener(
        'click',
        openEditModal
    );


    navLogout.addEventListener(
        'click',
        () => {

            AuthApi.logout();

        }
    );


    /* =====================================================
       ABRIR / CERRAR RESTAURANTE
       ===================================================== */

    openCheckbox.addEventListener(
        'change',
        async () => {

            if (!restaurant) {
                return;
            }

            const newState =
                openCheckbox.checked;

            openCheckbox.disabled =
                true;

            try {

                await RestaurantApi.update(
                    restaurant.id,
                    {
                        name:
                            restaurant.name,

                        address:
                            restaurant.address,

                        phone:
                            restaurant.phone ??
                            null,

                        description:
                            restaurant.description ??
                            null,

                        is_open:
                            newState
                    }
                );


                restaurant.is_open =
                    newState ? 1 : 0;


                toggleLabel.textContent =
                    newState
                        ? 'Abierto'
                        : 'Cerrado';


                UI.success(
                    newState
                        ? 'Restaurante abierto'
                        : 'Restaurante cerrado'
                );

            } catch (err) {

                openCheckbox.checked =
                    !newState;

                UI.error(
                    err.message ||
                    'No se pudo cambiar el estado'
                );

            } finally {

                openCheckbox.disabled =
                    false;

            }

        }
    );


    /* =====================================================
       VISTAS
       ===================================================== */

    function showView(el) {

        [
            loading,
            emptyState,
            noTablesState,
            tablesContent
        ].forEach(e => {

            if (e) {
                e.hidden = true;
            }

        });


        if (el) {
            el.hidden = false;
        }

    }


    /* =====================================================
       CARGAR DATOS
       ===================================================== */

    async function load() {

        showView(loading);

        try {

            const res =
                await RestaurantApi.list();

            const restaurants =
                res.data || [];


            /* No hay restaurante */

            if (
                restaurants.length === 0
            ) {

                restaurantInfo.textContent =
                    'Creá tu primer restaurante.';

                showView(emptyState);

                return;

            }


            restaurant =
                restaurants[0];


            restaurantInfo.textContent = [

                restaurant.name,
                restaurant.address

            ]
                .filter(Boolean)
                .join(' · ');


            /* Toggle */

            openCheckbox.checked =

                restaurant.is_open === 1 ||

                restaurant.is_open === true ||

                restaurant.is_open === '1';


            toggleLabel.textContent =

                openCheckbox.checked
                    ? 'Abierto'
                    : 'Cerrado';


            /* Mesas */

            const tablesRes =

                await RestaurantApi.listTables(
                    restaurant.id
                );


            tables =
                tablesRes.data || [];


            /* Ordenamos por número */

            tables.sort(
                (a, b) =>
                    Number(a.table_number) -
                    Number(b.table_number)
            );


            originalCount =
                tables.length;


            updateCounters();


            if (
                tables.length === 0
            ) {

                showView(
                    noTablesState
                );

                return;

            }


            renderTables();

            showView(
                tablesContent
            );

        } catch (err) {

            console.error(
                'Error cargando panel:',
                err
            );

            UI.error(
                err.message ||
                'Error al cargar el panel'
            );

            showView(
                emptyState
            );

        }

    }


    /* =====================================================
       CONTADORES
       ===================================================== */

    function updateCounters() {

        const available =

            tables.filter(
                t =>
                    Number(t.status_id) === 1
            ).length;


        const occupied =

            tables.filter(
                t =>
                    Number(t.status_id) === 2
            ).length;


        const reserved =

            tables.filter(
                t =>
                    Number(t.status_id) === 3
            ).length;


        if (countAvailable) {

            countAvailable.textContent =
                available;

        }


        if (countReserved) {

            countReserved.textContent =
                reserved;

        }


        if (countOccupied) {

            countOccupied.textContent =
                occupied;

        }

    }


    /* =====================================================
       MOSTRAR MESAS
       ===================================================== */

    function renderTables() {

        updateCounters();


        tablesGrid.innerHTML =
            tables.map(t => {

                const status =

                    STATUS[
                    Number(t.status_id)
                    ] || STATUS[1];


                const chairs =
                    Number(t.chairs) || 0;


                return `

                    <button
                        type="button"
                        class="
                            table-circle
                            table-circle--${status.key}
                        "
                        data-id="${t.id}"
                        data-status="${t.status_id}"
                        title="${status.label}"
                    >

                        <span
                            class="table-circle__number"
                        >
                            ${t.table_number}
                        </span>

                        <span
                            class="table-circle__chairs"
                        >
                            ${chairs > 0

                        ? `${chairs} ${chairs === 1
                            ? 'persona'
                            : 'personas'
                        }`

                        : ''
                    }
                        </span>

                    </button>

                `;

            }).join('');


        tablesGrid
            .querySelectorAll(
                '.table-circle'
            )
            .forEach(el => {

                el.addEventListener(
                    'click',
                    () =>
                        rotateStatus(el)
                );

            });

    }


    /* =====================================================
       CAMBIAR ESTADO
       ===================================================== */

    async function rotateStatus(el) {

        const tableId =
            parseInt(
                el.dataset.id,
                10
            );


        el.disabled =
            true;


        try {

            const res =

                await TableApi.rotateStatus(
                    tableId
                );


            const updated =
                res.data;


            const newStatus =

                STATUS[
                Number(
                    updated.status_id
                )
                ] || STATUS[1];


            el.classList.remove(

                'table-circle--available',

                'table-circle--occupied',

                'table-circle--reserved'

            );


            el.classList.add(
                `table-circle--${newStatus.key}`
            );


            el.dataset.status =
                updated.status_id;


            el.title =
                newStatus.label;


            const idx =

                tables.findIndex(
                    t =>
                        Number(t.id) ===
                        tableId
                );


            if (idx >= 0) {

                tables[idx].status_id =
                    Number(
                        updated.status_id
                    );

            }


            updateCounters();


            /* Si el modal está abierto,
               actualizamos también su lista */

            if (
                editModal &&
                !editModal.hidden
            ) {

                renderTableManagement();

            }


            el.classList.add(
                'is-flashing'
            );


            setTimeout(
                () => {

                    el.classList.remove(
                        'is-flashing'
                    );

                },
                400
            );

        } catch (err) {

            console.error(
                'Error cambiando estado:',
                err
            );


            UI.error(
                err.message ||
                'No se pudo cambiar el estado'
            );

        } finally {

            el.disabled =
                false;

        }

    }


    /* =====================================================
       LISTADO DE MESAS EN EDICIÓN
       ===================================================== */

    function renderTableManagement() {

        if (
            !tableManagementList
        ) {
            return;
        }


        if (
            tables.length === 0
        ) {

            tableManagementList.innerHTML = `

                <p class="table-management__empty">
                    No hay mesas registradas.
                </p>

            `;

            return;

        }


        tableManagementList.innerHTML =

            tables.map(t => {

                const status =

                    STATUS[
                    Number(t.status_id)
                    ] || STATUS[1];


                const chairs =
                    Number(t.chairs) || 0;


                const canDelete =

                    Number(
                        t.status_id
                    ) === 1;


                return `

                    <div
                        class="
                            table-management__row
                            table-management__row--${status.key}
                        "
                    >

                        <div
                            class="table-management__info"
                        >

                            <strong>
                                Mesa ${t.table_number}
                            </strong>

                            <span>
                                ${chairs > 0
                        ? `${chairs} ${chairs === 1
                            ? 'persona'
                            : 'personas'
                        }`
                        : 'Sin capacidad'
                    }
                                ·
                                ${status.label}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="table-management__delete"
                            data-delete-table="${t.id}"
                            ${canDelete
                        ? ''
                        : 'disabled'
                    }
                            title="${canDelete

                        ? 'Eliminar mesa'

                        : `No se puede eliminar una mesa ${status.label.toLowerCase()}`
                    }"
                        >
                            Eliminar
                        </button>

                    </div>

                `;

            }).join('');


        tableManagementList
            .querySelectorAll(
                '[data-delete-table]'
            )
            .forEach(btn => {

                btn.addEventListener(
                    'click',
                    () => {

                        deleteTable(
                            Number(
                                btn.dataset
                                    .deleteTable
                            )
                        );

                    }
                );

            });

    }


    /* =====================================================
       ELIMINAR MESA INDIVIDUAL
       ===================================================== */

    async function deleteTable(
        tableId
    ) {

        const table =

            tables.find(
                t =>
                    Number(t.id) ===
                    tableId
            );


        if (!table) {
            return;
        }


        /* Solo disponible */

        if (
            Number(
                table.status_id
            ) !== 1
        ) {

            const status =

                STATUS[
                Number(
                    table.status_id
                )
                ] || STATUS[1];


            showBlocked(

                `No se puede eliminar la Mesa ${table.table_number} porque está ${status.label.toLowerCase()}.`

            );

            return;

        }


        /* Evitamos quedarse sin mesas */

        if (
            tables.length <= 1
        ) {

            showBlocked(
                'El restaurante debe tener al menos una mesa.'
            );

            return;

        }


        const ok =

            await askConfirm(

                'Eliminar mesa',

                `¿Seguro que querés eliminar la Mesa ${table.table_number}?`

            );


        if (!ok) {
            return;
        }


        try {

            await TableApi.delete(
                table.id
            );


            /* La quitamos localmente */

            tables =
                tables.filter(
                    t =>
                        Number(t.id) !==
                        tableId
                );


            /*
             IMPORTANTE:
             NO renumeramos las demás.

             Ejemplo:
             1, 2, 3, 9, 10

             Si borramos 9:
             1, 2, 3, 10
            */


            originalCount =
                tables.length;


            tablesCount.value =
                originalCount;


            updateHint();

            updateCounters();

            renderTables();

            renderTableManagement();


            UI.success(
                `Mesa ${table.table_number} eliminada.`
            );

        } catch (err) {

            console.error(
                'Error eliminando mesa:',
                err
            );


            UI.error(
                err.message ||
                'No se pudo eliminar la mesa.'
            );

        }

    }


    /* =====================================================
       ABRIR MODAL EDITAR
       ===================================================== */

    function openEditModal() {

        if (!restaurant) {
            return;
        }


        nameIn.value =
            restaurant.name || '';


        addressIn.value =
            restaurant.address || '';


        phoneIn.value =
            restaurant.phone || '';


        descIn.value =
            restaurant.description || '';


        tablesCount.value =
            Math.max(
                MIN_TABLES,
                originalCount
            );


        updateHint();

        renderTableManagement();


        activateTab(
            'info'
        );


        formError.hidden =
            true;


        editModal.hidden =
            false;


        document.body.style.overflow =
            'hidden';

    }


    /* =====================================================
       CERRAR MODAL EDITAR
       ===================================================== */

    function closeEditModal() {

        editModal.hidden =
            true;


        document.body.style.overflow =
            '';

    }


    editCancel.addEventListener(
        'click',
        closeEditModal
    );


    editCancel2.addEventListener(
        'click',
        closeEditModal
    );


    editModal.addEventListener(
        'click',
        (e) => {

            if (
                e.target ===
                editModal
            ) {

                closeEditModal();

            }

        }
    );


    /* =====================================================
       TABS
       ===================================================== */

    function activateTab(name) {

        tabs.forEach(t => {

            t.classList.toggle(

                'is-active',

                t.dataset.tab ===
                name

            );

        });


        tabPanels.forEach(p => {

            p.classList.toggle(

                'is-active',

                p.dataset.panel ===
                name

            );

        });

    }


    tabs.forEach(t => {

        t.addEventListener(
            'click',
            () => {

                activateTab(
                    t.dataset.tab
                );

            }
        );

    });


    /* =====================================================
       CANTIDAD DE MESAS
       ===================================================== */

    function clampCount(n) {

        n =
            parseInt(
                n,
                10
            );


        if (
            isNaN(n)
        ) {

            n =
                originalCount ||
                MIN_TABLES;

        }


        return Math.min(

            MAX_TABLES,

            Math.max(
                MIN_TABLES,
                n
            )

        );

    }


    function updateHint() {

        if (!hintEl) {
            return;
        }


        hintEl.innerHTML =

            `Actualmente tenés <strong>${originalCount}</strong> ${originalCount === 1
                ? 'mesa'
                : 'mesas'
            }.`;

    }


    /*
     El botón menos NO elimina mesas.

     Para eliminar usamos el botón individual.
    */

    btnMinus.addEventListener(
        'click',
        () => {

            const current =
                clampCount(
                    tablesCount.value
                );


            if (
                current <=
                originalCount
            ) {

                tablesCount.value =
                    originalCount;

                UI.error(
                    'Para eliminar una mesa usá el botón Eliminar de la lista.'
                );

                return;

            }


            tablesCount.value =

                Math.max(
                    originalCount,
                    current - 1
                );

        }
    );


    /*
     El + sirve para indicar
     cuántas mesas nuevas queremos.
    */

    btnPlus.addEventListener(
        'click',
        () => {

            const current =
                clampCount(
                    tablesCount.value
                );


            tablesCount.value =

                Math.min(
                    MAX_TABLES,
                    current + 1
                );

        }
    );


    /*
     Si escriben manualmente un número menor
     al actual, volvemos a la cantidad actual.
    */

    tablesCount.addEventListener(
        'blur',
        () => {

            let value =
                clampCount(
                    tablesCount.value
                );


            if (
                value <
                originalCount
            ) {

                value =
                    originalCount;


                UI.error(
                    'Para eliminar mesas usá el botón Eliminar.'
                );

            }


            tablesCount.value =
                value;

        }
    );


    /* =====================================================
       GUARDAR EDICIÓN
       ===================================================== */

    editForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            formError.hidden =
                true;


            const name =
                nameIn.value.trim();


            const address =
                addressIn.value.trim();


            const phone =
                phoneIn.value.trim();


            const description =
                descIn.value.trim();


            const newCount =
                clampCount(
                    tablesCount.value
                );


            /* Validaciones */

            if (!name) {

                formError.textContent =
                    'El nombre es obligatorio.';

                formError.hidden =
                    false;

                activateTab(
                    'info'
                );

                return;

            }


            if (!address) {

                formError.textContent =
                    'La dirección es obligatoria.';

                formError.hidden =
                    false;

                activateTab(
                    'info'
                );

                return;

            }


            /*
             Ya no permitimos borrar
             reduciendo el contador.
            */

            if (
                newCount <
                originalCount
            ) {

                formError.textContent =
                    'Para eliminar mesas usá el botón Eliminar.';

                formError.hidden =
                    false;

                activateTab(
                    'tables'
                );

                return;

            }


            const countDiff =
                newCount -
                originalCount;


            /* Confirmación para agregar */

            if (
                countDiff > 0
            ) {

                const ok =

                    await askConfirm(

                        'Agregar mesas',

                        `Vas a agregar ${countDiff} ${countDiff === 1
                            ? 'mesa nueva'
                            : 'mesas nuevas'
                        }. ¿Confirmar?`

                    );


                if (!ok) {
                    return;
                }

            }


            editSave.disabled =
                true;


            editSave.textContent =
                'Guardando...';


            try {

                /* =========================================
                   ACTUALIZAR RESTAURANTE
                   ========================================= */

                await RestaurantApi.update(

                    restaurant.id,

                    {

                        name,

                        address,

                        phone:
                            phone || null,

                        description:
                            description || null,

                        is_open:
                            restaurant.is_open ??
                            true

                    }

                );


                /* =========================================
                   AGREGAR MESAS
                   ========================================= */

                if (
                    countDiff > 0
                ) {

                    /*
                     Buscamos el número más alto.

                     Ejemplo:

                     Mesas:
                     1, 2, 3, 9, 12

                     Nueva:
                     13
                    */

                    const highestTableNumber =

                        tables.length > 0

                            ? Math.max(
                                ...tables.map(
                                    t =>
                                        Number(
                                            t.table_number
                                        ) || 0
                                )
                            )

                            : 0;


                    for (
                        let i = 0;
                        i < countDiff;
                        i++
                    ) {

                        const nextNumber =

                            highestTableNumber +
                            i +
                            1;


                        await RestaurantApi.createTable(

                            restaurant.id,

                            {

                                table_number:
                                    nextNumber,

                                details:
                                    `Mesa ${nextNumber}`,

                                chairs:
                                    4,

                                status_id:
                                    1

                            }

                        );

                    }

                }


                UI.success(
                    'Cambios guardados.'
                );


                closeEditModal();


                await load();

            } catch (err) {

                console.error(
                    'Error guardando cambios:',
                    err
                );


                if (
                    err.errors
                ) {

                    formError.textContent =

                        Object.values(
                            err.errors
                        )[0] ||

                        err.message;

                } else {

                    formError.textContent =

                        err.message ||

                        'Error al guardar.';

                }


                formError.hidden =
                    false;

            } finally {

                editSave.disabled =
                    false;


                editSave.textContent =
                    'Guardar';

            }

        }
    );


    /* =====================================================
       CREAR RESTAURANTE
       ===================================================== */

    function openCreateModal() {

        createForm.reset();


        modalError.hidden =
            true;


        createModal.hidden =
            false;


        document.body.style.overflow =
            'hidden';

    }


    function closeCreateModal() {

        createModal.hidden =
            true;


        document.body.style.overflow =
            '';

    }


    createBtn.addEventListener(
        'click',
        openCreateModal
    );


    addTablesBtn.addEventListener(
        'click',
        openEditModal
    );


    cancelCreate.addEventListener(
        'click',
        closeCreateModal
    );


    createModal.addEventListener(
        'click',
        (e) => {

            if (
                e.target ===
                createModal
            ) {

                closeCreateModal();

            }

        }
    );


    createForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();


            modalError.hidden =
                true;


            const name =

                document
                    .getElementById(
                        'create-name'
                    )
                    .value
                    .trim();


            const address =

                document
                    .getElementById(
                        'create-address'
                    )
                    .value
                    .trim();


            const phone =

                document
                    .getElementById(
                        'create-phone'
                    )
                    .value
                    .trim();


            const description =

                document
                    .getElementById(
                        'create-description'
                    )
                    .value
                    .trim();


            if (!name) {

                modalError.textContent =
                    'El nombre es obligatorio.';

                modalError.hidden =
                    false;

                return;

            }


            if (!address) {

                modalError.textContent =
                    'La dirección es obligatoria.';

                modalError.hidden =
                    false;

                return;

            }


            submitCreate.disabled =
                true;


            submitCreate.textContent =
                'Creando...';


            try {

                await RestaurantApi.create({

                    name,

                    address,

                    phone:
                        phone || null,

                    description:
                        description || null,

                    is_open:
                        true

                });


                UI.success(
                    '¡Restaurante creado!'
                );


                closeCreateModal();


                await load();

            } catch (err) {

                console.error(
                    'Error creando restaurante:',
                    err
                );


                modalError.textContent =

                    err.message ||

                    'Error al crear.';


                modalError.hidden =
                    false;

            } finally {

                submitCreate.disabled =
                    false;


                submitCreate.textContent =
                    'Crear';

            }

        }
    );


    /* =====================================================
       CONFIRMACIÓN
       ===================================================== */

    function askConfirm(
        title,
        message
    ) {

        return new Promise(
            (resolve) => {

                confirmTitle.textContent =
                    title;


                confirmMsg.textContent =
                    message;


                confirmModal.hidden =
                    false;


                const cleanup =
                    (value) => {

                        confirmModal.hidden =
                            true;


                        confirmOk
                            .removeEventListener(
                                'click',
                                onOk
                            );


                        confirmCancel
                            .removeEventListener(
                                'click',
                                onCancel
                            );


                        resolve(
                            value
                        );

                    };


                const onOk =
                    () =>
                        cleanup(true);


                const onCancel =
                    () =>
                        cleanup(false);


                confirmOk.addEventListener(
                    'click',
                    onOk
                );


                confirmCancel.addEventListener(
                    'click',
                    onCancel
                );

            }
        );

    }


    /* =====================================================
       MODAL BLOQUEADO
       ===================================================== */

    function showBlocked(
        message
    ) {

        blockedMsg.textContent =
            message;


        blockedModal.hidden =
            false;


        blockedOk.addEventListener(
            'click',
            () => {

                blockedModal.hidden =
                    true;

            },
            {
                once: true
            }
        );

    }


    /* =====================================================
       INICIAR
       ===================================================== */

    load();

})();
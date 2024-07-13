$(() => {
    const clickOutsideHandler = e => {        
        if (!searching.is(e.target) && searching.has(e.target).length === 0) {
            hideSearching();
        }
    };

    // * Header visibility
    let lastScroll = 0;

    const headerVisibility = () => {
        let scroll = window.scrollY;

        if (lastScroll < scroll) {
            $('.header').addClass('header--hidden');
        } else {
            $('.header').removeClass('header--hidden');
        }

        lastScroll = scroll;
    };

    $(window).on('scroll', headerVisibility);

    // * search section
    const rightSide = $('#header-rs');
    const search = $('#search');
    const searchInput = $('#search-input');
    let searching;
    let searchContainer;
    let searchLogo;
    let searchBtn;
    let searchResults;

    // Creo la sección de búsqueda
    const createSearching = () => {
        createSearchingContainer();
        createSearchingResults();
        createSearchingWrapper();
    };

    // Envuelvo la barra de busqueda en un container, agregandole el logo y un boton para cancelar la busqueda
    const createSearchingContainer = () => {
        searchContainer = $('<div></div>').attr('class', 'header__search-container');
        searchLogo = $('<img>').attr({
            'src': '../assets/logo.jpg',
            'alt': 'Logo',
            'class': 'header__img'
        });
        searchBtn = $('<a></a>').attr({
            'href': '#',
            'class': 'header__btn',
            'id': 'search-btn'
        }).text('Cancelar');

        searchContainer.prepend(searchLogo);
        searchContainer.append(searchBtn);
    };

    // Creo un div donde van a estar las busquedas mas importantes
    const createSearchingResults = () => {
        searchResults = $('<div></div>').attr('class', 'header__results');
        const resultsTitle = $('<h3></h3>').attr('class', 'header__results-title').text('Busquedas populares');
        const resultsList = $('<ul></ul>').attr('class', 'header__results-list');
        const items = ['Jordan', 'Air', 'Blake', 'Converse'];

        items.forEach(item => {
            const resultsItem = $('<li></li>').attr('class', 'header__results-item');
            const resultsLink = $('<a></a>').attr({
                'href': '#',
                'class': 'header__results-link'
            }).text(item);

            resultsItem.append(resultsLink);
            resultsList.append(resultsItem);
        });

        searchResults.prepend(resultsList);
        searchResults.prepend(resultsTitle);
        searchContainer.after(searchResults);
    };

    // Encierro en un div la barra de busqueda junto con los resultados
    const createSearchingWrapper = () => {
        searching = $('<div></div>').attr('class', 'header__searching');
        searching.prepend(searchResults);
        searching.prepend(searchContainer);
    };

    const showSearching = () => {
        // Agrego los elementos al DOM
        rightSide.prepend(searching);
        searching.prepend(searchContainer);
        searchLogo.after(search);

        // La barra de busqueda aumenta su tamaño
        search.addClass('header__search--searching');
        searchInput.addClass('header__input--searching');

        // Manejo los eventos de la barra de busqueda
        searchInput.off('focus', showSearching);
        searchInput.focus();
        searchBtn.on('click', hideSearching);

        // Oculto la busqueda cuando el usuario da un click por fuera de esta
        $(document).on('click', clickOutsideHandler);

        // Evito que el usuario haga scroll
        $('#body').addClass('no-scroll');
    };

    const hideSearching = () => {
        // Inicio la animacion para ocultar la busqueda
        searching.addClass('header__searching--hide');

        setTimeout(() => {
            // Regreso la barra de busqueda a su posicion y estilos originales
            rightSide.prepend(search);
            search.removeClass('header__search--searching');
            searchInput.removeClass('header__input--searching');

            // Remuevo los elementos del DOM
            searching.remove();

            // Manejo los eventos de la barra de busqueda
            searchInput.on('focus', showSearching);
            searchInput.off('blur', hideSearching);
            searchInput.val('');

            // Elimino el evento de ocultar la busqueda cuando el usuario da un click por fuera de esta
            $(document).off('click', clickOutsideHandler);

            // Permito que el usuario haga scroll
            $('#body').removeClass('no-scroll');

            // Elimino la clase que oculta la busqueda
            searching.removeClass('header__searching--hide');
        }, 480);
    };

    createSearching();
    searchInput.on('focus', showSearching);
});
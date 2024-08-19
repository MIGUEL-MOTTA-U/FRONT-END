$(() => {
    let model = {
        init: () => {
            if (!localStorage.user) {
                localStorage.user = JSON.stringify({});
            }

            if (!localStorage.sessionStarted) {
                localStorage.sessionStarted = JSON.stringify(false);
            }

            if (!localStorage.users) {
                localStorage.users = JSON.stringify([]);
            }
        }
    }

    let controller = {
        init: () => {
            model.init();
        }
    }

    controller.init();

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
            'src': '../assets/logo.png',
            'alt': 'Logo',
            'class': 'header__img'
        });
        searchBtn = $('<a></a>').attr({
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
            $('#search-input').removeClass('header__input--active');
            $('#searchIcon').removeClass('header__icon-seacrh--active');

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

    // * Responsive nav
    let elementsCreated = false;
    let elementsDeleted = true;

    // Menu icon
    let link;
    let icon;

    // Principal content
    let principalContent;
    let closeIcon;

    // Header session
    let headerSession;

    const createOverlay = () => {
        const overlay = $('<div></div>').attr('class', 'overlay');
        $('#body').prepend(overlay);
    }

    const deleteOverlay = () => {
        $('.overlay').remove();
    }

    const createMenuIcon = () => {
        // Creo los elementos
        link = $('<a></a>').attr('class', 'header__icon-link');
        icon = $('<i></i>').attr('class', 'fa-solid fa-bars header__icon');

        // Agrego los eventos
        icon.on('click', openMenu);

        // Agrego los elementos al dom
        link.append(icon);
        $('#headerIcons').append(link);
    }

    const deleteMenuIcon = () => {
        icon.off('click');
        link.remove();
    }

    const createPrincipalContent = () => {
        // Creo los elementos
        principalContent = $('<div></div>').attr('class', 'header__principal-content');
        closeIcon = $('<i></i>').attr('class', 'fa-solid fa-xmark');
        
        // Agrego los eventos
        closeIcon.on('click', closeMenu);

        // Agrego los elementos al dom
        principalContent.append(closeIcon).append($('#headerList')).append($('#headerSession'));
        $('#nav').append(principalContent);
    };

    const deletePrincipalContent = () => {
        closeIcon.off('click');

        $('#nav').append($('#headerList'));
        principalContent.remove();
    }

    const createlinkContainer = (element) => {
        $(element).each(function() {
            // Creo los elementos
            const linkContainer = $('<div></div>').attr('class', 'header__link-container');
            const linkIcon = $('<i></i>').attr('class', 'fa-solid fa-angle-right header__link-icon');
            let link;
            let submenu;

            if (element === '.header__item') {
                link = $(this).find('.header__link');
                submenu = $(this).find('.header__submenu');

                linkContainer.on('click', function() {
                    submenu.addClass('header__submenu--visible');
                });
            } else {
                link = $(this).find('.header__title');
            }

            // Agrego los elementos al dom
            linkContainer.append(link).append(linkIcon);
            $(this).prepend(linkContainer);
        });
    };

    const deleteLinkContainer = () => {
        $('.header__link-container').each(function() {
            const parent = $(this).parent();
            const link = $(this).find('a');

            parent.prepend(link);
            $(this).remove();
        });
    };

    const createSubmenuTop = () => {
        $('.header__submenu').each(function() {
            // Creo los elementos
            const submenuTop = $('<div></div>').attr('class', 'header__submenu-top');
            const submenuReturn = $('<div></div>').attr('class', 'header__return');
            const returnIcon = $('<i></i>').attr('class', 'fa-solid fa-angle-left');
            const submenutext = $('<p></p>').attr('class', 'header__return-text').text('volver');
            const closeIcon = $('<i></i>').attr('class', 'fa-solid fa-xmark');

            // Agrego los eventos
            submenuReturn.on('click', function() {
                $(this).closest('.header__submenu').removeClass('header__submenu--visible');
            });
            closeIcon.on('click', () => {
                const parent = closeIcon.parent().parent();
                closeMenu();
                parent.removeClass('header__submenu--visible');
            });

            // Agrego los elementos al dom
            submenuReturn.append(returnIcon).append(submenutext);
            submenuTop.append(submenuReturn).append(closeIcon);
            $(this).prepend(submenuTop);
        });
    };

    const deleteSubmenuTop = () => {
        $('.header__return').off('click');
        $('.header__submenu-top').remove();
    };

    const createSubmenuTitle = () => {
        $('.header__item').each(function() {
            // Creo los elementos
            const text = $(this).find('.header__link').text();
            const submenuTop = $(this).find('.header__submenu-top');
            const submenuTitle = $('<h3></h3>').attr('class', 'header__submenu-title').text(text);

            // Agrego los elementos al dom
            submenuTop.after(submenuTitle);
        });
    };

    const deleteSubmenuTitle = () => {
        $('.header__submenu-title').remove();
    };

    const createHeaderSession = () => {
        // Creo los elementos
        headerSession = $('<div></div>').attr({
            'class': 'header__session',
            'id': 'headerSession'
        });
        const sessionText = $('<p></p>').attr('class', 'header__text').text('Hazte con Trendify menber para descubrir los mejores productos y estar al tanto de las ultimas novedades');
        const sessionBtns = $('<div></div>').attr('class', 'header__btns');
        const sessionBtn1 = $('<a></a>').attr('class', 'header__session-btn').text('Unete a nosotros');
        const sessionBtn2 = $('<a></a>').attr('class', 'header__session-btn header__session-btn--white').text('Iniciar sesion');

        // Agrego los elementos al dom
        sessionBtns.append(sessionBtn1).append(sessionBtn2);
        headerSession.append(sessionText).append(sessionBtns)
        $('#headerList').after(headerSession);
    };

    const deleteHeaderSession = () => {
        headerSession.remove();
    };

    const responsiveMenu = () => {
        if (window.innerWidth <= 1000) {
            $('#searchIcon').on('click', function() {
                showSearching();
                $('#search-input').addClass('header__input--active');
                $(this).addClass('header__icon-seacrh--active');
            });
        } else {
            $('#searchIcon').off('click');
        }

        if (window.innerWidth <= 800 && !elementsCreated) {     
            createMenuIcon();
            createlinkContainer('.header__item');
            createSubmenuTop();
            createSubmenuTitle();
            createlinkContainer('.header__sublist');
            createHeaderSession();
            createPrincipalContent();

            elementsCreated = true;
            elementsDeleted = false;
        } else if (window.innerWidth > 800 & !elementsDeleted) {
            deleteSubmenuTitle();
            deleteSubmenuTop();
            deleteMenuIcon();
            deleteLinkContainer();
            deleteHeaderSession();
            deletePrincipalContent();

            elementsCreated = false;
            elementsDeleted = true;
        }
    };

    const openMenu = () => {
        $('#nav').addClass('header__nav--visible');
        $('#body').addClass('no-scroll');
        createOverlay();
    };

    const closeMenu = () => {
        $('#nav').removeClass('header__nav--visible');
        $('#body').removeClass('no-scroll');
        deleteOverlay();
    };

    window.addEventListener('resize', responsiveMenu);
    responsiveMenu();
});
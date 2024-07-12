$(() => {
    // Header visibility
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
});
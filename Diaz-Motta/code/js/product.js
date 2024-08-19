$(() => {
    // Expand image
    const secondaryImage = $('.product__secondar-image');

    const hidePrevOverlay = () => {
        const overlays = $('.product__overlay');

        overlays.each(function() {
            $(this).removeClass('active');
        })
    }

    const showOverlay = element => {
        const overlays = element.find('.product__overlay');

        overlays.addClass('active');
    };

    const expandImage = element => {
        hidePrevOverlay();
        showOverlay(element);

        const image = element.find('.product__img');
        const urlImage = image.attr('src');
        const principalImage = $('#principal-image');

        principalImage.attr('src', urlImage);
    };

    secondaryImage.on('mouseenter', function() {
        expandImage($(this));
    });

    secondaryImage.on('click', function() {
        expandImage($(this));
    });
})
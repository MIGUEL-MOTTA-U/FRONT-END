$(() => {
    //  * Catalogo Horizontal
    const catalogo = document.querySelector('.products');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    leftArrow.addEventListener('click', () => {
        catalogo.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    rightArrow.addEventListener('click', () => {
        catalogo.scrollBy({ left: 300, behavior: 'smooth' });
    });
});
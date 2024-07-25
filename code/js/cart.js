let cart = [];
const deliveryCost = 50; // Aqui esta en dolares todo
/*
Ejemplo de productos con sus caracteristicas
*/
let products = [
    {id: 1, name: "Chaqueta negra hombre", price: 99.99, imag: "../assets/chaqueta_1.jpg", refCode: "00000-000",color: "Negro", size:"M" , link: "../html/index.html"},
    {id: 2, name: "Pantalon Beige mujer", price: 79.99, imag: "../assets/pant_1.jpg", refCode: "00000-001",color: "Beige", size:"S" , link: "../html/index.html"},
    {id: 3, name: "Camisa manga larga hombre", price: 89.99, imag: "../assets/camisa_slim.jpeg", refCode: "00000-002",color: "Celeste", size:"L" , link: "../html/index.html"},
    {id: 4, name: "Jordan blancos hombre", price: 139.99, imag: "../assets/tenis_1.webp", refCode: "00000-003",color: "Blanco", size:"38" , link: "../html/index.html"},
    {id: 5, name: "Jordan negros hombre", price: 139.99, imag: "../assets/tenis_2.webp", refCode: "00000-004",color: "Negro", size:"41" , link: "../html/index.html"},
    {id: 6, name: "hoodie con cremallera", price: 119.99, imag: "../assets/hoodie_man.webp", refCode: "00000-005",color: "Verde Oscuro", size:"M" , link: "../html/index.html"},
    {id: 7, name: "Jean Blanco Mujer", price: 69.99, imag: "../assets/jean.webp", refCode: "00000-006",color: "Claro", size:"36" , link: "../html/index.html"},
    {id: 8, name: "Falda con vuelo", price: 39.99, imag: "../assets/falda.webp", refCode: "00000-007",color: "Rojo", size:"S" , link: "../collections.html"},
    {id: 9, name: "Nike Air Force", price: 500.000, imag: "../assets/product/product_img_1.png", refCode: "00000-008",color: "Blanco", size:"38" , link: "../collections.html"},
    {id: 10, name: "Nike Air Force", price: 500.000, imag: "../assets/product/product_color_2.png", refCode: "00000-009",color: "Negro", size:"36" , link: "../collections.html"}
];

function getIdByName(name){
    let product = products.find(p => p.name ===name);
    return product ? product.id : null; 
}

// Agregar un producto al carrito con su id, junto con todos sus atributos
function addToCart(id) {
    let product = products.find(p => p.id === id);
    if (product) {
        let existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imag: product.imag,
                refCode: product.refCode,
                color: product.color,
                size: product.size,
                link: product.link,
                quantity: 1
            });
        }
        updateCart();
        updateCartIcon();
        saveCart();
    }
}
function itemQuantity(id){
    return 1;
}

/*
    Esta funcion inyecta un html con la estructura del producto
    dentro del carrito, los valores corresponden a los establecidos en 
    el arreglo products que aqui es como la base de datos de los productos.
*/
function updateCart() {
    let cartList = document.getElementById('cart-list');
    let subtotal = document.getElementById('subtotal');
    let deliCost = document.getElementById('deliCost');
    
    let total = document.getElementById('total');
    cartList.innerHTML = '';
    
    let sum = 0;
    for(let item of cart) {
        let li = document.createElement('li');
        li.innerHTML = `
            <div class="cart__product">
                <img src=${item.imag} alt=${item.name}>
                <div class="cart__item__left__info">
                    <div class="cart__row__top">
                        <div class="cart__item__text__top">${item.name}</div>
                        <div class="cart__item__text__bottom">Ref: ${item.refCode}</div>
                    </div>
                    <div class="cart__row__bottom">
                        <div class="cart__item__text__top">${item.size}, ${item.color}</div>
                        <div class="cart__item__text__bottom">Cantidad: ${item.quantity}</div>
                    </div>
                </div>
                <div class="cart__item__right__info">
                    <h5>${(item.price * item.quantity).toFixed(2)} COP</h5>
                    <button onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>    
        `;
        cartList.appendChild(li);
        sum += item.price * item.quantity;
    }
    
    subtotal.textContent = sum.toFixed(2);
    let ammountExtra;
    if(cart.length > 0){
        deliCost.textContent = deliveryCost;
        ammountExtra = deliveryCost;
    } else {
        deliCost.textContent = 0;
        ammountExtra = 0;
    }
    total.textContent = (sum+ ammountExtra).toFixed(2);
    saveCart();
}

// Actualizar el icono rojo al lajo del carrito
function updateCartIcon() {
    let cartCount = document.getElementById('cart-count');
    let subtotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = subtotalItems;
}

// Funcion para guardar el carrito en el local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// funcion para cargar el carrito del localStorag
function loadCart() {
    let savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        // Asegurarse de que todos los items tengan una cantidad
        cart.forEach(item => {
            if (!item.hasOwnProperty('quantity')) {
                item.quantity = 1;
            }
        });
    }
}

// Limpia el carrito en parte de la logica, y la parte visual con update
function clearCart() {
    let flag = cart.length>0;
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    updateCartIcon();
    flag ? showMessage('correct', 'Se realizo la compra con éxito.'):showMessage('error', 'El carrito está vacío.');;
}

function showMessage(type, text) {
    const message = $('<div></div>').attr('class', `message message--${type}`);
    const icon = $('<i></i>').attr('class', type === 'correct' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation');
    const textElement = $('<p></p>').attr('class', 'message__text').text(text);

    message.append(icon).append(textElement);
    $('body').prepend(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

function removeFromCart(id) {
    let index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
        updateCartIcon();
        saveCart();
    }
}

// Inicializar pagina
document.addEventListener('DOMContentLoaded', function() {
    let cartIcon = document.getElementById('cart-icon');
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
    });
    loadCart();
    updateCart();
    updateCartIcon();
});

// Al ser false siempre que se recargue la pagina, el carrito esta oculto
let isCartOpen = false;

function toggleCart() {
    const slidingCart = document.getElementById('sliding-cart');
    const body = document.body;
    
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        slidingCart.classList.add('open');
        body.classList.add('cart-open');
    } else {
        slidingCart.classList.remove('open');
        body.classList.remove('cart-open');
    }
    
    updateCart();
    // Para comprobar el estado del carrito
    //console.log("El carrito está: " + (isCartOpen ? "abierto" : "cerrado"));
}

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    // Agregar al carro
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productNameElement = document.querySelector('.details__h1');
            if (productNameElement) {
                const productName = productNameElement.textContent.trim();
                addToCart(getIdByName(productName));
            } else {
                console.error('No se pudo encontrar el nombre del producto');
            }
        });
    }
    // Finalizar compra
    const finishPurchaseBtn = document.getElementById('finishPurchaseBtn');
    if (finishPurchaseBtn) {
        finishPurchaseBtn.addEventListener('click', clearCart);
    }
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault(); // Previene la recarga de la página
            toggleCart();
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            toggleCart();
        });
    }
    loadCart();
    updateCart();
    updateCartIcon();
});
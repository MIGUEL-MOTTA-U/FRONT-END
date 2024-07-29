let ShoppingCart = {
    cart: [],
    deliveryCost: 50,
    isCartOpen: false,
    products: [
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
    ],

    /**
     * Get the Id by the name of the product.
     * 
     * @param {string} name of the product.
     * @returns Int, the number of id if it's found, null otherwise.
     */
    getIdByName: function(name) {
        let product = this.products.find(p => p.name === name);
        return product ? product.id : null;
    },

    /**
     * Adds a product to the cart by the given id.
     * 
     * @param {int} id the id of the product to add.
     */
    addToCart: function(id) {
        let product = this.products.find(p => p.id === id);
        if (product) {
            let existingItem = this.cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({...product, quantity: 1});
            }
            this.updateCart();
            this.updateCartIcon();
            this.saveCart();
        }
    },

    /**
     * Updates the cart values and the html structure.
     */
    updateCart: function() {
        let cartList = document.getElementById('cart-list');
        let subtotal = document.getElementById('subtotal');
        let deliCost = document.getElementById('deliCost');
        let total = document.getElementById('total');
        cartList.innerHTML = '';
        
        let sum = 0;
        for(let item of this.cart) {
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
                        <button onclick="ShoppingCart.removeFromCart(${item.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>    
            `;
            cartList.appendChild(li);
            sum += item.price * item.quantity;
        }
        
        subtotal.textContent = sum.toFixed(2);
        let ammountExtra = this.cart.length > 0 ? this.deliveryCost : 0;
        deliCost.textContent = ammountExtra;
        total.textContent = (sum + ammountExtra).toFixed(2);
        this.saveCart();
    },

    /**
     * Update the cart icon according to
     * the quantity of products in the cart.
     */
    updateCartIcon: function() {
        let cartCount = document.getElementById('cart-count');
        let subtotalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = subtotalItems;
    },

    /**
     * Saves the cart object in the local storage.
     */
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    /**
     * Loads the cart object from the local storage.
     */
    loadCart: function() {
        let savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.cart.forEach(item => {
                if (!item.hasOwnProperty('quantity')) {
                    item.quantity = 1;
                }
            });
        }
    },

    /**
     * Clears the information of the cart to start another from scratch.
     */
    clearCart: function() {
        let flag = this.cart.length > 0;
        this.cart = [];
        localStorage.removeItem('cart');
        this.updateCart();
        this.updateCartIcon();
        flag ? showMessage('correct', 'Se realizó la compra con éxito.') : showMessage('error', 'El carrito está vacío.');
    },

    /**
     * Removes a product of the cart by the given id.
     * 
     * @param {int} id the id of the product
     */
    removeFromCart: function(id) {
        let index = this.cart.findIndex(item => item.id === id);
        if (index !== -1) {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity--;
            } else {
                this.cart.splice(index, 1);
            }
            this.updateCart();
            this.updateCartIcon();
            this.saveCart();
        }
    },

    /**
     * Changes the html visibility of the element sliding-cart
     * to interact with the user when the cart-icon is clicked.
     */
    toggleCart: function() {
        const slidingCart = document.getElementById('sliding-cart');
        const body = document.body;
        
        this.isCartOpen = !this.isCartOpen;
        
        if (this.isCartOpen) {
            slidingCart.classList.add('open');
            body.classList.add('cart-open');
        } else {
            slidingCart.classList.remove('open');
            body.classList.remove('cart-open');
        }
        
        this.updateCart();
    }
};

/**
 * Launches a message when the user clicks the 'Finalizar Compra' 
 * button and shows the respective Message, it deppends of the cart, if it's empty or not.
 * 
 * @param {string} type the type of message, it might be correct or incorrect.
 * @param {string} text the content of the message to show in the screen.
 */
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

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const finishPurchaseBtn = document.getElementById('finishPurchaseBtn');

    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            ShoppingCart.toggleCart();
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            ShoppingCart.toggleCart();
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productNameElement = document.querySelector('.details__h1');
            if (productNameElement) {
                const productName = productNameElement.textContent.trim();
                ShoppingCart.addToCart(ShoppingCart.getIdByName(productName));
            } else {
                console.error('No se pudo encontrar el nombre del producto');
            }
        });
    }

    if (finishPurchaseBtn) {
        finishPurchaseBtn.addEventListener('click', function() {
            ShoppingCart.clearCart();
        });
    }

    ShoppingCart.loadCart();
    ShoppingCart.updateCart();
    ShoppingCart.updateCartIcon();
});
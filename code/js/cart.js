let ShoppingCart = {
    cart: [],
    deliveryCost: 50,
    isCartOpen: false,
    products: [],

    loadProductsFromCSV: function(filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                let results = Papa.parse(data, { header: true });
                this.products = results.data;
                // console.log(this.products); Verificar los productos
            })
            .catch(error => console.error('Error al cargar el archivo CSV:', error));
    },

    getIdByName: function(name) {
        let product = this.products.find(p => p.name === name);
        return product ? product.id : null;
    },

    addToCart: function(id) {
        let product = this.products.find(p => p.id == id);
        if (product) {
            let existingItem = this.cart.find(item => item.id == id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.updateCart();
            this.updateCartIcon();
            this.saveCart();
        }
    },

    updateCart: function() {
        let cartList = document.getElementById('cart-list');
        let subtotal = document.getElementById('subtotal');
        let deliCost = document.getElementById('deliCost');
        let total = document.getElementById('total');
        cartList.innerHTML = '';

        let sum = 0;
        for (let item of this.cart) {
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

    updateCartIcon: function() {
        let cartCount = document.getElementById('cart-count');
        let subtotalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = subtotalItems;
    },

    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

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

    clearCart: function() {
        let flag = this.cart.length > 0;
        this.cart = [];
        localStorage.removeItem('cart');
        this.updateCart();
        this.updateCartIcon();
        flag ? showMessage('correct', 'Se realizó la compra con éxito.') : showMessage('error', 'El carrito está vacío.');
    },

    removeFromCart: function(id) {
        let index = this.cart.findIndex(item => item.id == id);
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
    ShoppingCart.loadProductsFromCSV('../DB/productos.csv');
});
/**
 * This class handles the logic process of creating a cart,
 * store, save and keep the information of the articles added.
 * 
 */
class ShoppingCartModel {
    constructor() {
        this.cart = [];
        this.deliveryCost = 50;
        this.products = [];
    }

    /**
     * This method implements fetch to get the file by the given path and with Papa.parse, it
     * returns the file content as an array where the products information is stored.
     * @param {String} filePath the file path where the articles information is stored.
     * @returns Array of products.
     */
    loadProductsFromCSV(filePath) {
        return fetch(filePath)
            .then(response => response.text())
            .then(data => {
                let results = Papa.parse(data, { header: true });
                this.products = results.data;
            })
            .catch(error => console.error('Error trying to load the CSV file:', error));
    }

    /**
     * Return the id of the product by the given name
     * @param {String} name of the product
     * @returns the product id, null otherwise.
     */
    getIdByName(name) {
        let product = this.products.find(p => p.name === name);
        return product ? product.id : null;
    }

    /**
     * Adds a product to the cart, if it's already at the cart, 
     * updates the quantitiy plus 1.
     * @param {number} id the id of the product.
     */
    addToCart(id) {
        let product = this.products.find(p => p.id == id);
        if (product) {
            let existingItem = this.cart.find(item => item.id == id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.saveCart();
        }
    }

    /**
     * Removes a product from the cart by the given id
     * @param {number} id the id of the product.
     */
    removeFromCart(id) {
        let index = this.cart.findIndex(item => item.id == id);
        if (index !== -1) {
            if (this.cart[index].quantity > 1) {
                this.cart[index].quantity--;
            } else {
                this.cart.splice(index, 1);
            }
            this.saveCart();
        }
    }

    /**
     * Removes the 'cart' from the local storage and the products it contains.
     */
    clearCart() {
        this.cart = [];
        localStorage.removeItem('cart');
    }

    /**
     * Saves the 'cart' in the local storage.
     */
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    /**
     * Loads the cart and updates the products quantity.
     */
    loadCart() {
        let savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.cart.forEach(item => {
                if (!item.hasOwnProperty('quantity')) {
                    item.quantity = 1;
                }
            });
        }
    }

    /**
     * Returns the total of the purchase
     * @returns number The total of the purchase.
     */
    getCartTotal() {
        let sum = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
        return sum + (this.cart.length > 0 ? this.deliveryCost : 0);
    }

    /**
     * Returns the total purchase of a specific product 
     * that might be affected by it's quantity.
     * @returns the total of the product purchase.
     */
    getCartItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

/**
 * This class represents the view elements of the cart
 * and it's components.
 */
class ShoppingCartView {
    constructor() {
        this.cartList = document.getElementById('cart-list');
        this.subtotal = document.getElementById('subtotal');
        this.deliCost = document.getElementById('deliCost');
        this.total = document.getElementById('total');
        this.cartCount = document.getElementById('cart-count');
        this.slidingCart = document.getElementById('sliding-cart');
    }

    /**
     * Update the cart information of the view and every element of the cart.
     * @param {Array} cart the array of products in the cart.
     * @param {number} subtotalAmount The cost without considering the shipping fee 
     * @param {number} deliveryCost  The cost of shipping fee
     * @param {number} totalAmount The cost considering the shipping fee
     */
    updateCart(cart, subtotalAmount, deliveryCost, totalAmount) {
        this.cartList.innerHTML = '';

        for (let item of cart) {
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
                        <button class="remove-from-cart" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>    
            `;
            this.cartList.appendChild(li);
        }

        this.subtotal.textContent = subtotalAmount.toFixed(2);
        this.deliCost.textContent = deliveryCost;
        this.total.textContent = totalAmount.toFixed(2);
    }

    /**
     * Updates the number of products added to the cart.
     * @param {number} count the current number of products.
     */
    updateCartIcon(count) {
        this.cartCount.textContent = count;
    }

    /**
     * This method adds the cart to the page if 'isOpen' is true, hides it otherwise
     * @param {boolean} isOpen if the cart is open or not.
     */
    toggleCart(isOpen) {
        if (isOpen) {
            this.slidingCart.classList.add('open');
            document.body.classList.add('cart-open');
        } else {
            this.slidingCart.classList.remove('open');
            document.body.classList.remove('cart-open');
        }
    }

    /**
     * Show a message at the page by the given type and message.
     * @param {*} type The type of message, might be 'correct' or 'error'.
     * @param {*} text The content of the message.
     */
    showMessage(type, text) {
        const message = $('<div></div>').attr('class', `message message--${type}`);
        const icon = $('<i></i>').attr('class', type === 'correct' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation');
        const textElement = $('<p></p>').attr('class', 'message__text').text(text);

        message.append(icon).append(textElement);
        $('body').prepend(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

/**
 * This class makes the relation between the logic model of the cart and the 
 * cart view from the page.
 */
class ShoppingCartController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.isCartOpen = false;
        this.model.loadCart();
        this.updateCartView();
        this.model.loadProductsFromCSV('../DB/productos.csv');
        this.setupEventListeners();
    }

    /**
     * Implement the respective module functions with the view functions
     * creating the respective event Listeners to the View elements
     */
    setupEventListeners() {
        const cartIcon = document.getElementById('cart-icon');
        const closeCartBtn = document.getElementById('close-cart');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const finishPurchaseBtn = document.getElementById('finishPurchaseBtn');

        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.toggleCart());
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addCurrentProductToCart());
        }

        if (finishPurchaseBtn) {
            finishPurchaseBtn.addEventListener('click', () => this.finishPurchase());
        }
        this.view.cartList.addEventListener('click', (e) => {
            if (e.target.closest('.remove-from-cart')) {
                const id = e.target.closest('.remove-from-cart').dataset.id;
                this.removeFromCart(id);
            }
        });
    }

    /**
     * Updates the view elements of the cart with the information of the logic model.
     */
    updateCartView() {
        const subtotal = this.model.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryCost = this.model.cart.length > 0 ? this.model.deliveryCost : 0;
        const total = subtotal + deliveryCost;

        this.view.updateCart(this.model.cart, subtotal, deliveryCost, total);
        this.view.updateCartIcon(this.model.getCartItemCount());
    }

    /**
     * Handles the status of the cart, if it's open or closed.
     */
    toggleCart() {
        this.isCartOpen = !this.isCartOpen;
        this.view.toggleCart(this.isCartOpen);
        this.updateCartView();
    }

    /**
     * Add the product from the current page to teh cart.
     */
    addCurrentProductToCart() {
        const productNameElement = document.querySelector('.details__h1');
        if (productNameElement) {
            const productName = productNameElement.textContent.trim();
            const productId = this.model.getIdByName(productName);
            if (productId) {
                this.model.addToCart(productId);
                this.updateCartView();
            } else {
                console.error('No se pudo encontrar el ID del producto');
            }
        } else {
            console.error('No se pudo encontrar el nombre del producto');
        }
    }

    /**
     * Removes a product by the given id from the logic model and updates the view.
     * @param {*} id 
     */
    removeFromCart(id) {
        this.model.removeFromCart(id);
        this.updateCartView();
    }

    /**
     * Finish the purshase and shows the view message.
     */
    finishPurchase() {
        const hadItems = this.model.cart.length > 0;
        this.model.clearCart();
        this.updateCartView();
        this.view.showMessage(hadItems ? 'correct' : 'error', 
                                hadItems ? 'Se realizó la compra con éxito.' : 'El carrito está vacío.');
    }
}

/**
 * Initialization.
 */
document.addEventListener('DOMContentLoaded', function() {
    const model = new ShoppingCartModel();
    const view = new ShoppingCartView();
    const controller = new ShoppingCartController(model, view);
});
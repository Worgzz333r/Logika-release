// Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
    // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
    let response = await fetch("products.json")
    // Очікуємо на отримання та розпакування JSON-даних з відповіді
    let products = await response.json()
    // Повертаємо отримані продукти
    return products
};

// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';')
    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim() // Видаляємо зайві пробіли
        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1) // +1 для пропуску "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок 
    return ''
}

let products_list = document.querySelector(".products-list")

function getCard(product) {
    return `
    <div class="product-shadow mb-5">
    <div class="product-panel">
        <div class="stone-image m-2">
            <img class="product-img" src="img/${product.image}" alt="">
        </div>
        <div class="stone-info m-2">
            <p class="fw-bold fs-4">${product.title}</p>
            <p>${product.description}</p>
        </div>
        <div class="product-menu">
        <span class="price">
        <span class="currency-sign">$</span> ${product.price}
        </span>
            <button class="add-to-cart-btn" data-product='${JSON.stringify(product)}'>
            add to
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
            </button>
        </div>
    </div>
    </div>`
}

class ShoppingCart {
    constructor() {
        this.items = {}
        this.loadCartFromCookies()
    }

    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }

    addItem(product) {
        if (product.id in this.items){
            this.items[product.id].quantity += 1
        } else {
            this.items[product.id] = product
            this.items[product.id].quantity = 1
        }
        this.saveCartToCookies()
    }
}

let cart = new ShoppingCart()

function addToCart(event) {
    
    let data = event.currentTarget.getAttribute('data-product')
    if (!data){
        return
    }
    let product = JSON.parse(data)
    cart.addItem(product)

    console.log(cart.items)
}

getProducts().then(function (products) {
    if (products_list) {
        products.forEach(function (product) {
            products_list.innerHTML += getCard(product)
        })
        let addBtns = document.querySelectorAll(".add-to-cart-btn");
        addBtns.forEach(function (btn) {
            btn.addEventListener("click", addToCart)
        })
    }
})


//Додавання товарів кошика на сторінку
function getCartItem(product) {
    return `
     <div class="m-3 cart-product-panel">
 
          <div class="product-cart-image">
            <img src="${product.image}" class="img-fluid">
          </div>
          <div class="product-cart-title details-bg py-2 ps-3">
            <span class="fs-3 fw-semibold">${product.title}</span>
          </div>
          <div class="details-bg py-2 fw-semibold fs-4 text-end">${product.quantity}</div>
          <div class="product-cart-price details-bg py-2 fw-semibold fs-4 pe-3">
          <span class="currency-sign">$</span> ${product.price * product.quantity}</div>
    
        </div>`
}

let cart_list = document.querySelector(".cart-list")
let clear_cart_btn = document.querySelector(".clear-buttons")
let go_to_order_btn = document.querySelector(".go-to-order-btn")

if (cart_list) {
    cart_list.innerHTML = ''

    for (let key in cart.items) {
        cart_list.innerHTML += getCartItem(cart.items[key])
    }

    if (cart_list.innerHTML == '') {
        cart_list.innerHTML = 'Your cart is empty'
    }

    if (Object.keys(cart.items).length > 0) {
        clear_cart_btn.classList.remove('d-none')
        go_to_order_btn.classList.remove('d-none')
    }

    let clear_btn = document.querySelector(".clear-btn")

    clear_btn?.addEventListener("click", function () {
        document.cookie = `cart=''; max-age=0; path/`
        cart_list.innerHTML = 'Your cart is empty'
        clear_cart_btn.classList.add('d-none')
        go_to_order_btn.classList.add('d-none')
    })
}
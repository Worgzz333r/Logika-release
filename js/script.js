// Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
    // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
    let response = await fetch("products.json")
    // Очікуємо на отримання та розпакування JSON-даних з відповіді
    let products = await response.json()
    // Повертаємо отримані продукти
    return products
};

let products_list = document.querySelector(".products-list")


function getCard(product) {
    return `
    <div class="product-panel mb-5">
        <div class="stone-image m-2">
            <img class="product-img" src="img/${product.image}" alt="">
        </div>
        <div class="stone-info m-2">
            <p class="fw-bold fs-4">${product.title}</p>
            <p>${product.description}</p>
        </div>
        <div class="product-menu">
            ${product.price}
            <button class="add-to-cart-btn btn" data-product='${JSON.stringify(product)}'>add to cart</button>
        </div>
    </div>`
}

function addToCart(event) {
    let data = event.target.getAttribute('data-product')
    let product = JSON.parse(data)

    console.log(product)
}

getProducts().then(function (products) {
    products.forEach(function (product) {
        products_list.innerHTML += getCard(product)
    })
    let addBtns = document.querySelectorAll(".add-to-cart-btn")
    addBtns.forEach(function(btn){
        btn.addEventListener("click", addToCart)
    })
})


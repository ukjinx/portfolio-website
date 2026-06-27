const storeGrid =
    document.getElementById(
        "storeGrid"
    );

const modal =
    document.getElementById(
        "productModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const modalImage =
    document.getElementById(
        "modalImage"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const sizeSelect =
    document.getElementById(
        "sizeSelect"
    );

const modalPrice =
    document.getElementById(
        "modalPrice"
    );

const addCartBtn =
    document.getElementById(
        "addCartBtn"
    );

const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );

const cartToggle =
    document.getElementById(
        "cartToggle"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

let products = [];

let selectedProduct = null;

let cart =
    JSON.parse(
        localStorage.getItem(
            "cart"
        )
    ) || [];

async function loadProducts() {

    const response =
        await fetch(
            "data/products.json"
        );

    products =
        await response.json();

    renderProducts();
}

function renderProducts() {

    storeGrid.innerHTML = "";

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "store-card";

        card.innerHTML = `
            <img src="${product.image}">
            <div class="card-content">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="card-price">
                    From £${product.sizes[0].price}
                </div>
            </div>
        `;

        card.addEventListener(
            "click",
            () => openProduct(product)
        );

        storeGrid.appendChild(card);

    });

}

function openProduct(product) {

    selectedProduct = product;

    modal.classList.remove(
        "hidden"
    );

    modalImage.src =
        product.image;

    modalTitle.textContent =
        product.title;

    modalDescription.textContent =
        product.description;

    sizeSelect.innerHTML = "";

    product.sizes.forEach(size => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            size.price;

        option.textContent =
            `${size.name} — £${size.price}`;

        sizeSelect.appendChild(
            option
        );

    });

    updatePrice();

}

function updatePrice() {

    modalPrice.textContent =
        `£${sizeSelect.value}`;

}

sizeSelect.addEventListener(
    "change",
    updatePrice
);

closeModal.addEventListener(
    "click",
    () => {
        modal.classList.add(
            "hidden"
        );
    }
);

addCartBtn.addEventListener(
    "click",
    () => {

        const selectedSize =
            sizeSelect.options[
                sizeSelect.selectedIndex
            ].textContent;

        const price =
            Number(sizeSelect.value);

        cart.push({
            title:
                selectedProduct.title,
            size:
                selectedSize,
            price
        });

        saveCart();

        modal.classList.add(
            "hidden"
        );

    }
);

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();

}

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price;

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "cart-item";

        div.innerHTML = `
            <strong>
                ${item.title}
            </strong>

            <p>
                ${item.size}
            </p>
        `;

        cartItems.appendChild(div);

    });

    cartTotal.textContent =
        `£${total}`;

    cartCount.textContent =
        cart.length;

}

cartToggle.addEventListener(
    "click",
    () => {

        cartDrawer.classList.toggle(
            "open"
        );

    }
);

loadProducts();

renderCart();
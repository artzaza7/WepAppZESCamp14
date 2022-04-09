const db = firebase.firestore()
document.getElementById('username').innerText = "Username : " + localStorage.getItem('USERNAME')


//Cart
let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector('.cart')
let closeCart = document.querySelector('#close-cart')

//Open Cart
cartIcon.onclick = () => {
    cart.classList.add('active')
}

//Close Cart
closeCart.onclick = () => {
    cart.classList.remove('active')
}

//Cart Working
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}
else {
    ready()
}

//Making Function Ready
function ready() {
    //Remove Item From Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove')
    console.log(removeCartButtons);
    for (let index = 0; index < removeCartButtons.length; index++) {
        var button = removeCartButtons[index]
        button.addEventListener('click', removeCartItem)

    }
    //Quantity Changes
    var quaintityInputs = document.getElementsByClassName('cart-quantity')
    for (let index = 0; index < quaintityInputs.length; index++) {
        var input = quaintityInputs[index]
        input.addEventListener('change', quaintityChanged)
    }
    // //Add To Card From shop-content in reader in Real Time Database
}
//Buy Button
function buyButtonClicked() {
    Swal.fire({
        icon: 'success',
        title: 'Successful purchase',
        showConfirmButton: false,
        timer: 1500
    })
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var total = 0
    var allOfTitle = []
    var allOfPrice = []
    var allOfQuantity = []
    for (let index = 0; index < cartBoxes.length; index++) {
        var cartBox = cartBoxes[index]
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0]
        // console.log(titleElement.innerText);
        var priceElement = cartBox.getElementsByClassName('cart-price')[0]
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
        var price = parseFloat(priceElement.innerText.replace(" Bath", ""))
        var quaintity = quantityElement.value
        total = total + price * quaintity
        allOfTitle.push(titleElement.innerText)
        allOfPrice.push(price)
        allOfQuantity.push(quaintity)
    }
    console.log(allOfTitle);
    console.log(allOfQuantity);
    console.log(allOfPrice);

    db.collection('Order').doc().set({
        OrderByUsername: localStorage.getItem('USERNAME'),
        Menu: allOfTitle,
        Price: allOfPrice,
        Quantity: allOfQuantity,
        Bath: total
    })

    var cartContent = document.getElementsByClassName('cart-content')[0]
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild)
    }
    updateTotal()
}

//Remove Item From Cart
function removeCartItem(e) {
    var buttonClicked = e.target
    buttonClicked.parentElement.remove()
    updateTotal()
}

//Quantity Change
function quaintityChanged(e) {
    var input = e.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateTotal()
}

//Add to Cart
function addCartClicked(e) {
    var button = e.target
    var shopProducts = button.parentElement
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText
    var price = shopProducts.getElementsByClassName('price')[0].innerText
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src
    // console.log(title, price, productImg)
    addProductToCart(title, price, productImg)
    updateTotal()
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement('div')
    cartShopBox.classList.add('card-box')
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    var cartIcon = document.getElementById('cart-icon')
    cartIcon.classList.add('active')
    for (let index = 0; index < cartItemsNames.length; index++) {
        if (cartItemsNames[index].innerText == title) {
            alert('You have already add this item to cart')
            return;
        }
    }
    var cartBoxContent = `
                    <div class="cart-box">
                        <img src="${productImg}" alt=""
                            class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart -->
                        <i class='bx bxs-trash cart-remove'></i>
                    </div>`
    cartShopBox.innerHTML = cartBoxContent
    cartItems.append(cartShopBox)
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quaintityChanged)
}

//Update Total
function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var total = 0
    for (let index = 0; index < cartBoxes.length; index++) {
        var cartBox = cartBoxes[index]
        var priceElement = cartBox.getElementsByClassName('cart-price')[0]
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
        var price = parseFloat(priceElement.innerText.replace(" Bath", ""))
        var quaintity = quantityElement.value
        total = total + price * quaintity
    }
    //If price Contain some . Value
    total = Math.round(total * 100) / 100
    document.getElementsByClassName("total-price")[0].innerText = total + " Bath"
    if (total == 0) {
        var cartIcon = document.getElementById('cart-icon')
        cartIcon.classList.remove('active')
    }
}

let containerProduct = document.querySelector('.shop-content')
function readerCard(doc) {
    let divProductBox = document.createElement('div')
    divProductBox.className = "product-box"
    let h2Title = document.createElement('h2')
    h2Title.className = "product-title"
    let spanPrice = document.createElement('span')
    spanPrice.className = "price"
    let spanDes = document.createElement('span')
    spanDes.className = "description"
    let i = document.createElement('i')
    i.className = "bx bx-shopping-bag add-cart"
    let image = document.createElement('img')
    image.className = "product-img"
    image.src = doc.data().ImageURL
    h2Title.textContent = doc.data().ImageName
    spanPrice.textContent = doc.data().Price + " Bath"
    spanDes.textContent = doc.data().Description
    divProductBox.setAttribute('data-name', doc.data().ImageName)
    divProductBox.appendChild(image)
    divProductBox.appendChild(h2Title)
    divProductBox.appendChild(spanDes)
    divProductBox.appendChild(spanPrice)
    divProductBox.appendChild(i)
    containerProduct.appendChild(divProductBox)
    var addCart = document.getElementsByClassName('add-cart')
    for (let index = 0; index < addCart.length; index++) {
        var button = addCart[index]
        button.addEventListener('click', addCartClicked)
    }
    //Buy Button Work
    document.getElementsByClassName('btn-buy')[0].onclick = buyButtonClicked
}
db.collection('Menu').onSnapshot(snapshot => {
    let change = snapshot.docChanges()
    change.forEach(change => {
        // console.log(change)
        if (change.type == 'added') {
            readerCard(change.doc)
        }
        else if (change.type == 'removed') {
            let div = containerProduct.querySelector(`[data-name=${change.doc.id}]`)
            containerProduct.removeChild(div)
        }
    })
})
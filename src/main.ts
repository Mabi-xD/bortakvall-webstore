import {createOrder, fetchProducts} from './api'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

//Get JSON order from localStorage
const jsonOrder = localStorage.getItem('order') ?? '[]'

// Parse JSON order into an array of order information
let productsOrder: any = JSON.parse(jsonOrder) 

let products: any
let totalPrice: number
let totalOrder: any 
let orderResponse: any 
let filterOrder: any

// GET all products from API
const getProducts = async () => {
  products = await fetchProducts()
  products.data.map((prod: { quantity: number }) => (prod.quantity = 0))
  let instock = products.data.filter((stock: { stock_status: string }) => stock.stock_status === "instock")
  document.querySelector('#number-of-products')!.innerHTML = `
  <div class="justify-content-center">
    <p>
    ${instock.length} av ${products.data.length} produkter finns i lager
    </p>
  </div>
  ` 
  renderProducts()
}

// Function to sort product list
const sortProds = ( a: any, b: any ) => {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

// RENDER all products to the dom
const renderProducts = () => {
  let prod = products.data
  prod.sort( sortProds )  
  prod.forEach((prod: { stock_status: string; images: { thumbnail: any }; name: any; price: any; id: any; stock_quantity: any }) => {
  if(prod.stock_status === "instock"){
    document.querySelector('#product-container')!.innerHTML += `
    <div id="product-card" class="col-6 col-md-5 col-lg-3 shadow mb-2 m-2 bg-body rounded p-3">
       <img class="img-fluid" src="https://www.bortakvall.se/${prod.images.thumbnail}">
       <h2>
       ${prod.name}
       <h2>
       <h3>
       ${prod.price} kr 
       </h3>
       <div class="d-flex justify-content-center">
       <button id="addToCartBtn" class="btn" data-product-id="${prod.id}">Lägg i varukorgen</button>
       <button class="btn" data-product-id="${prod.id}" id="info-btn">Info</button>
       </div>
       <p id="instock">${prod.stock_quantity} produkter i lager</p>
    </div>
   `
  } else {
    document.querySelector('#product-container')!.innerHTML += `
    <div id="product-card" class="col-6 col-md-5 col-lg-3 shadow mb-2 m-2 bg-body rounded p-3">
       <img class="img-fluid" src="https://www.bortakvall.se/${prod.images.thumbnail}">
       <h2>
       ${prod.name}
       <h2>
       <h3>
       ${prod.price} kr
       </h3>
       <div class="d-flex justify-content-center">
       <button id="outOfStockBtn" class="btn" disabled data-product-id="${prod.id}">Slut i lager</button>
       <button class="btn" data-product-id="${prod.id}" id="info-btn">Info</button>
       </div>
    </div>`  
    
}
})}

// Add products to shopping cart
const addToCart = () => {
  const parentElement = document.querySelector('#product-container')!;
  parentElement.addEventListener('click', e => {
    e.preventDefault()
    const target = e.target as HTMLElement
    if(target.textContent === "Lägg i varukorgen") {
      const targetNr = Number(target.dataset.productId)
      const findProd = products.data.find((product: { id: number }) => product.id === targetNr)
      const search = productsOrder.find((prod: { id: any }) => prod.id === findProd.id)
      if(search === undefined){
        productsOrder.push(findProd)
        findProd.quantity = 1
      } else if (search.quantity < search.stock_quantity) {
        search.quantity += 1
      }
  }

  renderToCart()
  getTotal()
  })
}

// Filter product quantity
const filterProducts = () => {
  filterOrder = productsOrder.filter((prods: { quantity: number }) => prods.quantity !== 0)
}

// Eventlistener to add product into cart from the information div
document.querySelector('#info-container')!.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  if(target.textContent === "Lägg i varukorgen") {
    const targetNr = Number(target.dataset.productId)
    const findProd = products.data.find((product: { id: number }) => product.id === targetNr)
    const search = productsOrder.find((prod: { id: any }) => prod.id === findProd.id)
    
    if(search === undefined){
      productsOrder.push(findProd)
      findProd.quantity = 1
    } else if (search.quantity < search.stock_quantity) {
      search.quantity += 1
    }

    renderToCart()
    getTotal()
}
})

// Show more information about a product
document.querySelector('#product-container')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  
  if(target.textContent === "Info"){
    document.querySelector('#product-container')!.classList.add('hide')
    document.querySelector('#info-container')?.classList.remove('hide')
    const targetNr = Number(target.dataset.productId)
    const findProd = products.data.find((product: { id: number }) => product.id === targetNr)
    if (findProd && findProd.stock_status === "instock"){
      document.querySelector('#info-container')!.innerHTML = `
        <div id="info-product" class="col-6 col-md-6 col-lg-6">
          <button id="backBtn" class="btn btn-dark btn-small"><i class="fa-solid fa-arrow-left"></i></button>
          <img class="img-fluid" src="https://www.bortakvall.se/${findProd.images.large}">
          <h2>
          ${findProd.name}
          <h2>
          <h3>
          ${findProd.price} kr
          </h3>
          ${findProd.description}
          <button id="addToCartBtn" class="btn" data-product-id="${findProd.id}">Lägg i varukorgen</button>
        </div>
      `
    } else {
      document.querySelector('#info-container')!.innerHTML = `
      <div id="info-product" class="col-6 col-md-6 col-lg-6">
        <button id="backBtn" class="btn btn-dark btn-small"><i class="fa-solid fa-arrow-left"></i></button>
        <img class="img-fluid" src="https://www.bortakvall.se/${findProd.images.large}">
        <h2>
        ${findProd.name}
        <h2>
        <h3>
        ${findProd.price} kr
        </h3>
        ${findProd.description}
        <button id="outOfStockBtn" class="btn" disabled data-product-id="${findProd.id}">Lägg i varukorgen</button>
      </div>
    `
    }
  }
})

// Info button
document.querySelector('#info-container')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement

  if(target.id === "backBtn" || target.tagName === "I"){
  document.querySelector('#info-container')?.classList.add('hide')
  document.querySelector('#product-container')?.classList.remove('hide')
  }
})

// Render order to shopping cart
const renderToCart = () => {
  productsOrder.sort( sortProds )
  filterProducts()
  document.querySelector('#render-cart')!.innerHTML = filterOrder
  .map((productsOrder: { id: any; name: any; price: number; quantity: number }) => ` 
  <div class="product-list" data-product-id="${productsOrder.id}">
  <p><strong>
  ${productsOrder.name}
  </strong> 
  <br>
  Styckpris: ${productsOrder.price} kr
  <br>
  Summa: ${productsOrder.price * productsOrder.quantity} kr
  </p>
  </div>
  <div class="quantity-list">
  <button type="button" class="btn btn-light" data-product-id="${productsOrder.id}">
  -
  </button>
  <p>${productsOrder.quantity}</p>
  <button type="button" class="btn btn-light" data-product-id="${productsOrder.id}">
  +
  </button>
  <button type="button" class ="btn btn-danger btn-sm" data-product-id="${productsOrder.id}"  id="remove-btn">Ta bort</button>
  </div>
  `)
  .join('')

  // Save previous cart
  saveOrder()
}

// Remove product from cart
document.querySelector('#render-cart')?.addEventListener('click', e =>{
  e.preventDefault()
  const target = e.target as HTMLElement
  const targetNr = Number(target.dataset.productId)
  const findProd = productsOrder.find((product: { id: number }) => product.id === targetNr)
  if(target.textContent === "Ta bort") {
    findProd.quantity = 0
  } else if (target.textContent === "\n  -\n  " ) {
    findProd.quantity += -1 
  } else if (target.textContent === "\n  +\n  " && findProd.quantity < findProd.stock_quantity) {
    findProd.quantity += +1
  }

  renderToCart()
  getTotal()
})

// Displaying the total sum of product order
const getTotal = () => {
  totalPrice = 0
  productsOrder.forEach((value: { price: number; quantity: number }) => {
    totalPrice += value.price * value.quantity;
  });
  document.querySelector('#total-sum')!.innerHTML = `
  <hr>
  <strong> 
  <p>
  Total summa: ${totalPrice} kr
  </p>
  </strong> 
  `
}

// Go to order-form event
document.querySelector('#checkout-btn')?.addEventListener('click', e => {
  e.preventDefault()
  document.querySelector('#info-confirmation')?.classList.add('hide')
  document.querySelector('#checkout-container')?.classList.remove('hide')
  document.querySelector('#buyBtn')?.classList.remove('hide')
  
  renderSum()
  renderOrder()
  
  totalPrice = 0
  productsOrder.forEach((value: { price: number; quantity: number }) => {
    totalPrice += value.price * value.quantity;
  });

  document.querySelector('#order-sum')!.innerHTML = `
  <hr>
  <strong> 
  <p id="totala-summan">
  Total summa: ${totalPrice}
  </p>
  </strong> 
  `
})

// Render product sum
const renderSum = () => {
  filterProducts()
  document.querySelector('#order-total')!.innerHTML = filterOrder
    .map((productsOrder: { name: any; price: number; quantity: number }) => ` 
  <p><strong>
  ${productsOrder.name}
  </strong><br>
  Styckpris: ${productsOrder.price} kr <br>
  Summa: ${productsOrder.price * productsOrder.quantity} kr
  </p>
  `)
  .join('')
}

// Go to order confirmation event
document.querySelector('#buyBtn')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  if(target.tagName === "BUTTON"){
    document.querySelector('#checkout-container')?.classList.add('hide')
    document.querySelector('#info-confirmation')?.classList.remove('hide')
    document.querySelector('#confirmation-container')?.classList.remove('hide')
    document.querySelector('#buyBtn')?.classList.add('hide')
  }
})


// Handle order form, POST and error messages
document.getElementById('buyBtn')!.onclick = async () => {
  
  const inputFirstName = (document.getElementById('inputFirstName') as HTMLInputElement).value    // First name
  const inputLastName = (document.getElementById('inputLastName') as HTMLInputElement).value      // Last name
  const inputAdress = (document.getElementById('inputAddress') as HTMLInputElement).value         // Adress
  const inputZip = (document.getElementById('inputZip') as HTMLInputElement).value                // Zipcode
  const inputCity = (document.getElementById('inputCity') as HTMLInputElement).value              // City
  const inputPhone = (document.getElementById('inputPhone') as HTMLInputElement).value            // Phonenumber
  const inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value            // Email

  const orderInfo: any = {
    customer_first_name: inputFirstName,
    customer_last_name: inputLastName,
    customer_address: inputAdress,
    customer_postcode: inputZip,
    customer_city: inputCity,
    customer_phone: inputPhone,
    customer_email: inputEmail,
    order_total: totalPrice,
    order_items: totalOrder
  }
  
  orderResponse = await createOrder(orderInfo)

  if (orderResponse.data.id !== undefined) {
  document.querySelector('#info-confirmation')!.innerHTML = `
  <br>
  <br>
  <h4>
  Tack för din order!
  <br>
  Ditt ordernummer är: ${orderResponse.data.id}
  </h4>
  `
  } else if (orderResponse.data.customer_first_name !== undefined) {
    alert(`${orderResponse.data.customer_first_name}`)
  } else if (orderResponse.data.customer_last_name !== undefined) {
    alert(`${orderResponse.data.customer_last_name}`) 
  } else if (orderResponse.data.customer_address !== undefined) {
    alert(`${orderResponse.data.customer_address}`)
  } else if (orderResponse.data.customer_city !== undefined) {
    alert(`${orderResponse.data.customer_city}`)
  } else if (orderResponse.data.customer_postcode !== undefined) {
    alert(`${orderResponse.data.customer_postcode}`)
  } else if (orderResponse.data.customer_email !== undefined) {
    alert(`${orderResponse.data.customer_email}`)
  }

  // Save previous order
  saveOrder()
}

// Go to order confirmation event
document.querySelector('#buyBtn')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  if(target.tagName === "BUTTON"){
    document.querySelector('#checkout-container')?.classList.add('hide')
    document.querySelector('#confirmation-container')?.classList.remove('hide')
    document.querySelector('#buyBtn')?.classList.add('hide')
  }
})

// Render productOrder so we can send it to the API
const renderOrder = () => {
  filterProducts()
  totalOrder = []
  filterOrder.forEach((prod: { id: any; quantity: number; price: number }) => {
  totalOrder.push(
      {
        product_id: prod.id,
        qty: prod.quantity,
        item_price: prod.price,
        item_total: prod.price * prod.quantity,
      }
  )
    }) 
}

// Save order
const saveOrder = () => {
  // Convert products order to JSON and save JSON to local storage
  localStorage.setItem('order', JSON.stringify(productsOrder))
}

// GET products when entering the website
getProducts()

// ADD product to shopping cart
addToCart()

// RENDER product to shopping cart
renderToCart()
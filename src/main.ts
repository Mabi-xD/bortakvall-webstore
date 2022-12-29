import {fetchProducts} from './api'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

let products: [] = []
let productsOrder: [] = []
let totalSum = 0
let input_total_sum: number[] = [];

/*
* GET all products from API
*/
const getProducts = async () => {
  products = await fetchProducts ()
  // Add quantity to the objects in the array.
  let prodQuant = products.data.map(prod => (prod.quantity = 0))
  // Show number of products to the dom
  document.querySelector('#number-of-products')!.innerHTML = `
  <div class="justify-content-center">
    <p>Antal produkter:
    ${products.data.length}
    </p>
  </div>
  ` 
  renderProducts()
}

/*
* RENDER all products to the dom
*/
const renderProducts = () => {
  let prod = products.data
  document.querySelector('#product-container')!.innerHTML = prod
  .map(prod => `
    <div class="col-6 col-md-5 col-lg-3 shadow mb-2 m-2 bg-body rounded p-3">
      <img class="img-fluid" src="https://www.bortakvall.se/${prod.images.thumbnail}">
      <h2>
      ${prod.name}
      <h2>
      <h3>
      ${prod.price} kr
      </h3>
      <div class="d-flex justify-content-center">
      <button class="btn btn-success m-1" data-product-id="${prod.id}">Lägg i varukorgen</button>
      <button class="btn btn-info m-1" data-product-id="${prod.id}">Info</button>
      </div>
    </div>
  `)
  .join('')
}

/*
* Add products to shopping cart
*/
const addToCart = () => {
  const parentElement = document.querySelector('#product-container')!;
  parentElement.addEventListener('click', e => {
    e.preventDefault()
    const target = e.target as HTMLElement
    if(target.textContent === "Lägg i varukorgen") {
      const targetNr = Number(target.dataset.productId)
      const prod = products.data
      const findProd = prod.find(product => product.id === targetNr)
      const search = productsOrder.find(prod => prod.id === findProd.id)
      
      if(search === undefined){
        productsOrder.push(findProd)
        findProd.quantity = 1
      } else {
        search.quantity += 1
      }
      renderToCart()
      getTotal()
  }
})
}

/*
**  Eventlistener to add product into cart from Info div.
*/
document.querySelector('#info-container')!.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
      if(target.textContent === "Lägg i varukorgen") {
        const targetNr = Number(target.dataset.productId)
        const prod = products.data
        const findProd = prod.find(product => product.id === targetNr)
        productsOrder.push(findProd)
      }
})

/*
* Show more information about a product
*/
document.querySelector('#product-container')?.addEventListener('click', e => {
  e.preventDefault()

  const target = e.target as HTMLElement
  
  if(target.textContent === "Info"){
    document.querySelector('#product-container')!.classList.add('hide')
    document.querySelector('#info-container')?.classList.remove('hide')
    const targetNr = Number(target.dataset.productId)
    const prod = products.data
    const findProd = prod.find(product => product.id === targetNr)
    if (findProd){
      document.querySelector('#info-container')!.innerHTML = `
        <div class="col-6 col-md-4 col-lg-6">
          <button id="backBtn" class="btn btn-dark btn-small">Tillbaka</button>
          <img class="img-fluid" src="https://www.bortakvall.se/${findProd.images.large}">
          <h2>
          ${findProd.name}
          <h2>
          <h3>
          ${findProd.price}kr
          </h3>
          ${findProd.description}
          <button class="btn btn-success" data-product-id="${findProd.id}">Lägg i varukorgen</button>
        </div>
      `
    }
  }
})

/*
** Info Btn
*/
document.querySelector('#info-container')?.addEventListener('click', e => {
  e.preventDefault()

  const target = e.target as HTMLElement

  if(target.textContent === "Tillbaka"){
  document.querySelector('#info-container')?.classList.add('hide')
  document.querySelector('#product-container')?.classList.remove('hide')
  }
})

/*
* Render order to shopping cart
*/
  const renderToCart = () => {
  document.querySelector('#render-cart')!.innerHTML = productsOrder
    .map(productsOrder => ` 
  <div class="product-list">
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
  <button type="button" class="btn btn-light">
  <i class="quantity-minus fa-solid fa-square-minus"></i>
  </button>
  <p>${productsOrder.quantity}</p>
  <button type="button" class="btn btn-light">
  <i class="quantity-plus fa-solid fa-square-plus"></i>
  </button>
  </div>
  `)
    .join('')
}

/*
** Displaying the total sum of product order
*/
const getTotal = () => {
  let totalPrice = 0
  productsOrder.forEach(value => {
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

/*
** Go to order-form event
*/
document.querySelector('#checkout-btn')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  if(target.tagName === "BUTTON"){
    document.querySelector('#number-of-products')?.classList.add('hide')
    document.querySelector('#checkout-container')?.classList.remove('hide')
  }
  renderSum()

  productsOrder.forEach(value => {
    totalSum += value.price * value.quantity;
  });
  document.querySelector('#order-sum')!.innerHTML = `
  <hr>
  <strong> 
  <p id="totala-summan">
  ${totalSum}
  </p>
  </strong> 
  `

  input_total_sum.push(totalSum);
})

/*
* POST order to API
*/
// First name
const input_first_name = (document.getElementById('inputFirstName') as HTMLInputElement).value
// Last name
const input_last_name = (document.getElementById('inputLastName') as HTMLInputElement).value
// Adress
const input_address = (document.getElementById('inputAddress') as HTMLInputElement).value
// Zipcode
const input_zip = (document.getElementById('inputZip') as HTMLInputElement).value
// City
const input_city = (document.getElementById('inputCity') as HTMLInputElement).value
// Phonenumber
const input_phone = (document.getElementById('inputPhone') as HTMLInputElement).value
// Email
const input_email = (document.getElementById('inputEmail') as HTMLInputElement).value

// const form = document.getElementById('form-input');
const orderInfo = {
  customer_first_name: input_first_name,
  customer_last_name: input_last_name,
  customer_address: input_address,
  customer_postcode: input_zip,
  customer_city: input_city,
  customer_phone: input_phone,
  customer_email: input_email,
  order_total: input_total_sum,
  order_items: [
    {
      product_id: "",
      qty: "",
      item_price: "",
      item_total: "",
    }
  ]
}

document.getElementById('buyBtn')!.onclick = async () => {
  const res = await fetch('https://www.bortakvall.se/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderInfo)
  });
}

/*
** Go to order confirmation event
*/
document.querySelector('#buyBtn')?.addEventListener('click', e => {
  e.preventDefault()
  console.log(orderInfo)
  const target = e.target as HTMLElement
  if(target.tagName === "BUTTON"){
    document.querySelector('#checkout-container')?.classList.add('hide')
    document.querySelector('#confirmation-container')?.classList.remove('hide')
    document.querySelector('#buyBtn')?.classList.add('hide')
  }
})

/*
** Render product sum
*/
const renderSum = () => {
  document.querySelector('#order-total')!.innerHTML = productsOrder
    .map(productsOrder => ` 
  <p><strong>
  ${productsOrder.name}
  </strong><br>
  Styckpris: ${productsOrder.price} kr <br>
  Summa: ${productsOrder.price * productsOrder.quantity} kr
  </p>
  `)
    .join('')
}

/*
** Go back from order-form
*/
document.querySelector('#checkout-container')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  if(target.textContent === "Tillbaka"){
    document.querySelector('#checkout-container')?.classList.add('hide')
    document.querySelector('#product-container')?.classList.remove('hide')
    document.querySelector('#cart')?.classList.remove('hide')
  }
})

/*
* GET products when entering the website
*/
getProducts()

/*
* ADD product to shopping cart
*/
addToCart()
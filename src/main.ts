import {createOrder, fetchProducts} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

let products: [] = []
let productsOrder: [] = []
let totalPrice: number
let totalOrder: any [] = []
let orderResponse: [] = []
let filterOrder: any

/*
* GET all products from API
*/
const getProducts = async () => {
  products = await fetchProducts()
  console.log(products)
  let prodQuant = products.data.map(prod => (prod.quantity = 0))
  let prod = products.data
  let instock = prod.filter(stock => stock.stock_status === "instock")
  console.log(instock)
  document.querySelector('#number-of-products')!.innerHTML = `
  <div class="justify-content-center">
    <p>Antal produkter:
    ${products.data.length} och ${instock.length} finns i lager.
    </p>
  </div>
  ` 
  renderProducts()
}

/*
** Function to sort our lists.
*/
const sortProds = ( a, b ) => {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

/*
* RENDER all products to the dom
*/
const renderProducts = () => {
  let prod = products.data
  prod.sort( sortProds )  
  console.log(prod)
  prod.forEach(prod => {
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
       <button class="btn btn-success" data-product-id="${prod.id}">Lägg i varukorgen</button>
       <button class="btn btn-info" data-product-id="${prod.id}" id="info-btn">Info</button>
       </div>
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
       <button class="btn btn-danger" disabled data-product-id="${prod.id}">Lägg i varukorgen</button>
       <button class="btn btn-info" data-product-id="${prod.id}" id="info-btn">Info</button>
       </div>
    </div>`  
}
})}

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
      console.log(findProd)
      if(search === undefined){
        productsOrder.push(findProd)
        findProd.quantity = 1
      } else {
        search.quantity += 1
      }
      console.log('You have added the following product:', productsOrder)
  }
  renderToCart()
  getTotal()
})
}

/*
* Filter product quantity
*/

const filterProducts = () => {
  filterOrder = productsOrder.filter(prods => prods.quantity !== 0)
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
    const search = productsOrder.find(prod => prod.id === findProd.id)
    
    if(search === undefined){
      productsOrder.push(findProd)
      findProd.quantity = 1
    } else {
      search.quantity += 1
    }
    console.log('You have added the following product:', productsOrder)
    renderToCart()
    getTotal()
}
})

/*
* Show more information about a product
*/
document.querySelector('#product-container')?.addEventListener('click', e => {
  e.preventDefault()

  const target = e.target as HTMLElement
  
  if(target.textContent === "Info"){
    console.log(target.id)
    document.querySelector('#product-container')!.classList.add('hide')
    document.querySelector('#info-container')?.classList.remove('hide')
    const targetNr = Number(target.dataset.productId)
    console.log(targetNr)
    const prod = products.data
    console.log(prod)
    const findProd = prod.find(product => product.id === targetNr)
    console.log(findProd)
    if (findProd && findProd.stock_status === "instock"){
      document.querySelector('#info-container')!.innerHTML = `
        <div id="info-product" class="col-6 col-md-6 col-lg-6">
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
    } else {
      document.querySelector('#info-container')!.innerHTML = `
      <div id="info-product" class="col-6 col-md-6 col-lg-6">
        <button id="backBtn" class="btn btn-dark btn-small">Tillbaka</button>
        <img class="img-fluid" src="https://www.bortakvall.se/${findProd.images.large}">
        <h2>
        ${findProd.name}
        <h2>
        <h3>
        ${findProd.price}kr
        </h3>
        ${findProd.description}
        <button class="btn btn-danger" disabled data-product-id="${findProd.id}">Lägg i varukorgen</button>
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
  productsOrder.sort( sortProds )
  filterProducts()
  document.querySelector('#render-cart')!.innerHTML = filterOrder
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
  <button type="button" class ="btn btn-danger btn-sm" data-product-id="${productsOrder.id}"  id="remove-btn">Ta bort</button>
  </div>
  `)
    .join('')
}

/*
** Remove product from cart
*/
document.querySelector('#render-cart')?.addEventListener('click', e =>{
  e.preventDefault()
  console.log(e)
  const target = e.target as HTMLElement
  if(target.textContent === "Ta bort") {
    const targetNr = Number(target.dataset.productId)
    console.log(targetNr)
    const order = productsOrder
    console.log(order)
    const findProd = order.find(product => product.id === targetNr)
    console.log(findProd)
    findProd.quantity = 0
  }
renderToCart()
getTotal()
})

/*
** Displaying the total sum of product order
*/
const getTotal = () => {
  totalPrice = 0
  productsOrder.forEach(value => {
    totalPrice += value.price * value.quantity;
  });
  console.log(totalPrice)
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
  document.querySelector('#info-confirmation')?.classList.add('hide')
  document.querySelector('#number-of-products')?.classList.add('hide')
  document.querySelector('#checkout-container')?.classList.remove('hide')
  document.querySelector('#buyBtn')?.classList.remove('hide')
  
  renderSum()
  renderOrder()
  
  totalPrice = 0
  productsOrder.forEach(value => {
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

/*
** Go back from order-form
*/
// document.querySelector('#checkout-container')?.addEventListener('click', e => {
//   e.preventDefault()
//   const target = e.target as HTMLElement
//   if(target.textContent === "Tillbaka"){
//     document.querySelector('#checkout-container')?.classList.add('hide')
//     document.querySelector('#product-container')?.classList.remove('hide')
//     document.querySelector('#cart')?.classList.remove('hide')
//     document.querySelector('#buyBtn')?.classList.remove('hide')
//   }
// })

/*
** Render product sum
*/
const renderSum = () => {
  filterProducts()
  document.querySelector('#order-total')!.innerHTML = filterOrder
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
** Go to order confirmation event
*/
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


/*
* POST order to API
*/
document.getElementById('buyBtn')!.onclick = async () => {
  
  const inputFirstName = (document.getElementById('inputFirstName') as HTMLInputElement).value    // First name
  const inputLastName = (document.getElementById('inputLastName') as HTMLInputElement).value      // Last name
  const inputAdress = (document.getElementById('inputAddress') as HTMLInputElement).value         // Adress
  const inputZip = (document.getElementById('inputZip') as HTMLInputElement).value                // Zipcode
  const inputCity = (document.getElementById('inputCity') as HTMLInputElement).value              // City
  const inputPhone = (document.getElementById('inputPhone') as HTMLInputElement).value            // Phonenumber
  const inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value            // Email

  const orderInfo = {
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
  console.log(orderResponse)

  if (orderResponse.data.id !== undefined) {
  document.querySelector('#info-confirmation')!.innerHTML = `
  Tack för din order! Ditt ordernummer är: ${orderResponse.data.id}`
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
}

/*
** Go to order confirmation event
*/
document.querySelector('#buyBtn')?.addEventListener('click', e => {
  e.preventDefault()
  const target = e.target as HTMLElement
  if(target.tagName === "BUTTON"){
    document.querySelector('#checkout-container')?.classList.add('hide')
    document.querySelector('#confirmation-container')?.classList.remove('hide')
    document.querySelector('#buyBtn')?.classList.add('hide')
  }
})

/*
** Render productOrder so we can send it to the API
*/
const renderOrder = () => {
  filterProducts()
  totalOrder = []
  filterOrder.forEach(prod => {
  totalOrder.push(
      {
        product_id: prod.id,
        qty: prod.quantity,
        item_price: prod.price,
        item_total: prod.price * prod.quantity,
      }
  )
    })
  console.log(totalOrder)  
}

/*
* GET products when entering the website
*/
getProducts()

/*
* ADD product to shopping cart
*/
addToCart()
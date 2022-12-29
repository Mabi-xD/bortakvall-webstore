import {fetchProducts} from './api'
// import {postOrder} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'
import {IOrder} from './interfaces'

let products: [] = []
let productsOrder: [] = []

// let first_name = (document.getElementById('firstName') as HTMLInputElement).value

const form = document.getElementById('form-input');
const orderInfo = {
  customer_first_name: "",
  customer_last_name: "",
  customer_address: "",
  customer_postcode: "",
  customer_city: "",
  customer_phone: "",
  customer_email: "",
  order_total: "",
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
  const form = new FormData();
  form.append('customer_first_name', orderInfo.customer_first_name);
  form.append('customer_last_name', orderInfo.customer_last_name);
  form.append('customer_adress', orderInfo.customer_address);

  const res = await fetch('https://www.bortakvall.se/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form)
  });
}

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

  let totalPrice = 0
  productsOrder.forEach(value => {
    totalPrice += value.price * value.quantity;
  });
  document.querySelector('#order-sum')!.innerHTML = `
  <hr>
  <strong> 
  <p>
  Total summa: ${totalPrice} kr
  </p>
  </strong> 
  `
})

/*
* Get value from form
*/


// document.querySelector('#form-input')?.addEventListener('click', e => {
//     const form = document.querySelector('#form-input')
//     const firstName = (form.querySelector('#inputFirstName') as HTMLInputElement).value
//     const lastName = (form.querySelector('#inputLastName') as HTMLInputElement).value

//     // Prevent the default form submission behavior
//     e.preventDefault();

//     // Get the value of the input field
//     const inputValue = (form.querySelector('input') as HTMLInputElement).value

//     console.log(firstName)
//     console.log(lastName)
  
//     // Do something with the input value (e.g. send it to the server)
//     // ...
// })

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

document.querySelector('#form-input')?.addEventListener('submit', async e => {
	e.preventDefault()

  const firstName = document.querySelector<HTMLInputElement>('#inputFirstName')?.value
	// Create a new Todo object
	const order: IOrder = {
    customer_first_name: firstName
	}

	// POST todo to server
	await createOrder(order)


})

export const createOrder = async (newOrder: IOrder) => {
	const res = await fetch('https://www.bortakvall.se/api/products', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newOrder),
	})

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`)
	}

	return await res.json() as IOrder
}

/*
* GET products when entering the website
*/
getProducts()

/*
* ADD product to shopping cart
*/
addToCart()
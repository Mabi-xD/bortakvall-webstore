import {fetchProducts} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

let products: [] = []
let productsOrder: [] = []


/*
* GET all products from API
*/

const getProducts = async () => {
  products = await fetchProducts ()
  console.log(products)
  // add quantity to the objects in the array.
  let prodQuant = products.data.map(prod => (prod.quantity = 0))
  /*
  * Show number of products to the dom
  */
  document.querySelector('#number-of-products')!.innerHTML = `
  <div class="justify-content-center">
    <p>Antal produkter:
    ${products.data.length}
    </p>
  </div>
  ` 
  console.log(products.data.length)
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
      console.log('You have added the following product:', productsOrder)
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
        console.log('You have added the following product:', productsOrder)
      }
    })

/*
* Show more information about a product
*/

document.querySelector('#product-container')?.addEventListener('click', e => {
  e.preventDefault()

  const target = e.target as HTMLElement
  console.log(e)
  
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

  console.log(e)

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
  <div class="order-list">
  <p>
  ${productsOrder.name} Pris: ${productsOrder.price}kr/st </br>
  Antal: ${productsOrder.quantity}st = ${productsOrder.price * productsOrder.quantity}kr
  </p>
</div>
  `)
    .join('')
}

// /*
// * REMOVE products from shopping cart (only works for the first p tag)
// */

// const removeProduct = () => {
//   const product = document.querySelector<HTMLParagraphElement>('p');
//   product?.addEventListener('click', (e) => {
//     product.remove()
//     console.log('Removed this product:', e.target)
//   })
// }

/*
** Displaying the total sum of product order
*/
const getTotal = () => {
let totalPrice = 0
productsOrder.forEach(value => {
  totalPrice += value.price * value.quantity;
});
console.log(totalPrice)
document.querySelector('#total-sum')!.innerHTML = `
<p>Din totala summa är: ${totalPrice} kr</p>
`
}


/*
** Go to order-form event
*/
document.querySelector('#checkout-btn')?.addEventListener('click', e => {
  e.preventDefault()

  const target = e.target as HTMLElement

  console.log(e)
  if(target.tagName === "BUTTON"){

    document.querySelector('#product-container')?.classList.add('hide')
    document.querySelector('#cart')?.classList.add('hide')
    document.querySelector('#number-of-products')?.classList.add('hide')
    document.querySelector('#checkout-container')?.classList.remove('hide')
  }
  renderSum()
})

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



const renderSum = () => {
  document.querySelector('#order-total')!.innerHTML = productsOrder
    .map(productsOrder => ` 
  <p>
  ${productsOrder.name} Pris: ${productsOrder.price}kr/st </br>
  Antal: ${productsOrder.quantity}st = ${productsOrder.price * productsOrder.quantity}kr
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

  console.log(e)
  if(target.tagName === "BUTTON"){
    document.querySelector('#checkout-container')?.classList.add('hide')
    document.querySelector('#confirmation-container')?.classList.remove('hide')
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

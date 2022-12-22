import {fetchProducts} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

let products: {} = []
let productsOrder: [] = []

/*
* GET all products from API
*/

const getProducts = async () => {
  products = await fetchProducts ()
  console.log(products)
  renderProducts()
}

/*
* RENDER all products to the dom
*/

const renderProducts = () => {
  let prod = products.data
  document.querySelector('#product-container')!.innerHTML = prod
  .map(prod => `
    <div class="col-6 col-md-4 col-lg-3">
      <img class="img-fluid" src="https://www.bortakvall.se/${prod.images.thumbnail}">
      <h2>
      ${prod.name}
      <h2>
      <h3>
      ${prod.price}kr
      </h3>
      <button class="btn btn-success" data-product-id="${prod.id}">Lägg i varukorgen</button>
      <button class="btn btn-info" data-product-id="${prod.id}">Info</button>
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
      productsOrder.push(findProd)
      console.log('You have added the following product:', productsOrder)
    }
    renderToCart()
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
  <div 
  <div class="order-list">
  <p>
  ${productsOrder.name} </br>
  ${productsOrder.price}kr
  </p>
</div>
  `)
    .join('')
}

/*
* GET products when entering the website
*/

getProducts()

/*
* ADD product to shopping cart
*/

addToCart()

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
      productsOrder.push(`${findProd.name}, ${findProd.price} kr, ${findProd.id}<br>`)
      console.log('You have added the following products:', productsOrder)
    }
  })

}

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
    const targetNr = Number(target.dataset.productId)
    console.log(targetNr)
    const prod = products.data
    console.log(prod)
    const findProd = prod.find(product => product.id === targetNr)
    console.log(findProd)
    if (findProd){
      document.querySelector('#info-container')!.innerHTML = `
        <div class="col-6 col-md-4 col-lg-3">
          <img class="img-fluid img-thumbnail" src="https://www.bortakvall.se/${findProd.images.large}">
          <h2>
          ${findProd.name}
          <h2>
          <h3>
          ${findProd.price}kr
          </h3>
          ${findProd.description}
          <button class="btn btn-success">Lägg i varukorgen</button>
        </div>
      `
    }
  }
})

/*
* Shopping cart
*/

const cartIcon = document.querySelector('#cart-icon')
const cartContainer = document.querySelector('#cart')

/*
* Show shopping cart
*/

cartIcon?.addEventListener('click', e => {
  e.preventDefault()

  cartContainer!.innerHTML = `
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">Varukorg</h5>
        <button id="close-btn" type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div id="order-container" class="offcanvas-body">
      </div>
    </div>
    `
  const closeButton = document.querySelector('#close-btn')
  closeButton?.addEventListener('click', e => {
    if (cartContainer!.style.display === "none") {
      cartContainer!.style.display = "block";
    } else {
      cartContainer!.style.display = "none";
    } 
  })

  renderToCart()

  }
)

/*
* Render order to shopping cart
*/

const renderToCart = () => {
  document.querySelector('#order-container')!.innerHTML = productsOrder
  .map(productsOrder => `
  <div class="order-list">
  <p>
  ${productsOrder}
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

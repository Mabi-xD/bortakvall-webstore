import {fetchProducts} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'




let products: any = []

const getProducts = async () => {
  products = await fetchProducts ()
  console.log(products)
  renderProducts()
}

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
      <button class="btn btn-success">Lägg i varukorgen</button>
    </div>
  `)
  .join('')
}

//cart
const cartIcon = document.querySelector('#cart-icon')
const cartContainer = document.querySelector('#cart')

cartIcon?.addEventListener('click', e => {
  e.preventDefault()

  cartContainer!.innerHTML = `
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">Varukorg</h5>
        <button id="close-btn" type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        Innehåll i varukorg
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

  
  }
)

getProducts()

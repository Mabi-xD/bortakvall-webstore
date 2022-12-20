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
      <img class="img-fluid img-thumbnail" src="https://www.bortakvall.se/${prod.images.thumbnail}">
      <h2>
      ${prod.name}
      <h2>
      <h3>
      ${prod.price}kr
      </h3>
      <button id="addToCart" class="btn btn-success">Lägg i varukorgen</button>
    </div>
  `)
  .join('')

  // Add product to shopping cart
  productsToCart()
}

const productsToCart = () => {
    document.querySelector('#addToCart')?.addEventListener('click', (e) => {
      console.log('you clicked me', e.target)
    }
)}

// const renderProducts = () => {
//   document.querySelector('#product-container')!.innerHTML = products
// }

getProducts()

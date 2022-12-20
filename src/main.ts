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
      </h2>
      <h3>
      ${prod.price}kr
      </h3>
      <button id="addButton" class="btn btn-success btn-add">Lägg i varukorgen</button>
    </div>
  `)
  .join('')

  // Add product to shopping cart
  addToCart()
}

const addToCart = () => {
  const addButtons = document.querySelectorAll('.btn-add');

  addButtons.forEach(button => {
    button.addEventListener('click', e => {
      console.log(e.target);
    });
  });
  // logProducts()
}

// const logProducts = () => {
//   let prod = products.data
//     document.querySelector('#cart')!.innerHTML = prod
//   .map(prod => `
//   <h4>
//   ${prod.name}
//   </h4>
//   `)
//   .join('')
// }

// const productsToCart = () => {
//   let prod = products.data
//   document.querySelector('#cart')!.innerHTML = prod
//   .map(prod => `
//       <h4>
//       ${prod.name}
//       <h4>
//   `)
//   .join('')
// }

// const renderProducts = () => {
//   document.querySelector('#product-container')!.innerHTML = products
// }

getProducts()

import {fetchProducts} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'




let products: {} = []

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
      <button class="btn btn-success" data-product-id="${prod.id}">Lägg i varukorgen</button>
      <button class="btn btn-info" data-product-id="${prod.id}">Info</button>
    </div>
  `)
  .join('')
  // document.querySelector('#product-container')?.classList.remove('hide')

  // Add product to shopping cart
  addToCart()
}

const addToCart = () => {

  const parentElement = document.querySelector('#product-container')!;

  parentElement.addEventListener('click', e => {
    e.preventDefault()
    const target = e.target as HTMLElement

    if(target.textContent === "Lägg i varukorgen") {

      const targetNr = Number(target.dataset.productId)

      const prod = products.data

      const findProd = prod.find(product => product.id === targetNr)

      if (findProd){
        document.querySelector('#cart')!.innerHTML = `
            <h4 class="inCart-${findProd.id}">
            ${findProd.name} ${findProd.price}kr
            <h4>
        `
      }
    }
  })
}

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

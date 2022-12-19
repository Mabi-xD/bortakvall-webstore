import {fetchProducts} from './api'
// import {IProduct} from './interfaces'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'



let products = []


const getProducts = async () => {
  products = await fetchProducts ()
  console.log(products.data)
}

getProducts()

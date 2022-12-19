import {fetchProducts} from './api'
import './style.css'

let products = []


const getProducts = async () => {
  products = await fetchProducts ()
   console.log(products);
}

getProducts()
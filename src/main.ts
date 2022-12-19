import {fetchProducts} from './api'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'



let products = []


const getProducts = async () => {
  products = await fetchProducts ()
   console.log(products);
}

getProducts()
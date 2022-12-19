import {fetchProducts} from './api'
import { IProduct } from "./interfaces"
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'



// Local variable containing all the todos from the server
let products: IProduct[] = []


const getProducts = async () => {
    products = await fetchProducts()
    console.log(`${products}`)
}

getProducts()
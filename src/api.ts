/*
* API FUNCTIONS FOR EXPORTING
*/

// import { IProduct } from "./interfaces"

/*
* FETCH all products from Bortakvall API
*/

export const fetchProducts = async () => {
    const res = await fetch ('https://www.bortakvall.se/api/products')
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    return await res.json()
} 

export const createOrder = async (orderInfo: []) => {
    const res = await fetch('https://www.bortakvall.se/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderInfo)
      })
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    return await res.json()
} 
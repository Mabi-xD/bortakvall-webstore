/*
API FUNCTIONS FOR EXPORTING
*/

// Fetch products from bortakvall api.
export const fetchProducts = async () => {

    const res = await fetch ('https://www.bortakvall.se/api/products')
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    
    return await res.json()

} 

export const getProducts = async () => {
   let products = await fetchProducts ()
    console.log(products);
}
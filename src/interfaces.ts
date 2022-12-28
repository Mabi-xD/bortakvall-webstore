
 // IProduct
 

export interface IProduct {
    status: string,
    data: [
        id: number,
        name: string,
        description: string,
        price: number,
        on_sale: boolean,
        images: {
        thumbnail: string,
        large: string
        },
        stock_status: string,
        stock_quantity: null
    ]

}


export interface IOrder {
    customer_first_name: string,
    customer_last_name: string,
    customer_adress: string,
    customer_postcode: number,
    customer_city: string,
    customer_email: string,
    order_items: [
        {
        product_id: number,
        quantity: number,
        item_price: number,
        item_total: number,
        }
    ]
}
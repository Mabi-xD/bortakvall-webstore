
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

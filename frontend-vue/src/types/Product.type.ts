export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export type createProductPayload = Omit<Product, 'id'>

export type updateProductPayload = Partial<Product>

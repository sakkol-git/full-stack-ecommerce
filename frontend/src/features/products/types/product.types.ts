export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export type CreateProductPayload = Omit<Product, 'id'>

export type UpdateProuctPayload = Partial<CreateProductPayload>;
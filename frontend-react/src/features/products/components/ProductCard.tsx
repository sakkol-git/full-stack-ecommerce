import type { Product } from "../types/product.types";

interface ProductCardProps {
    product: Product;
}

const formatterPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function ProductCard({ product }: ProductCardProps){
    
    return (
        <article>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{formatterPrice.format(product.price)}</p>
        </article>
    )
}
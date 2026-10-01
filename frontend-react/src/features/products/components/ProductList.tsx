
import type { Product } from "../types/product.types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function ProductList({ 
         products,
        isLoading,
        error,
        refetch,} : ProductListProps) {

    if(isLoading) {
        return <p> Loading products...</p>
    }
    if(error){
        return (
            <div>
                <p>{error}</p>
                <button onClick={refetch}>Retry</button>
            </div>
        )
    }
    if(products.length == 0) {
        return <p>No Product available</p>
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    )
}
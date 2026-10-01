import { useProducts } from "../hooks/useProducts";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";

export function ProductManager() {
    const {
    products,
    isLoading,
    isSubmitting,
    error,
    refetch,
    addProduct,
    } = useProducts();

    return(
        <div>
            <ProductForm onSubmit={addProduct} isSubmitting={isSubmitting} />
            <ProductList products={products} isLoading={isLoading} error={error} refetch={refetch}  />
        </div>
    )
}
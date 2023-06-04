import { ProductWithCategories } from '../../types/product.ts';
import ProductItem from './ProductItem.tsx';

type ProductListProps = {
    products: ProductWithCategories[];
    query: string;
};

function ProductList({ products, query }: ProductListProps) {
    return (
        <>
            {products
                .filter((product) =>
                    `${product.name} ${product.description}`
                        .toLowerCase()
                        .includes(query.toLowerCase())
                )
                .map((product) => (
                    <ProductItem product={product} key={product.id} />
                ))}
        </>
    );
}

export default ProductList;

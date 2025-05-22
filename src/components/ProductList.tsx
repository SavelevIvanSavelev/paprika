import ProductCard from "./ProductCard";

type Product = {
  id: string | number;
  name: string;
  image: string;
  per: string;
  stock: number;
  // add other product fields as needed
};

type ProductListProps = {
  products: Product[];
};

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="product-list">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

import { jsx as _jsx } from "react/jsx-runtime";
import ProductCard from "./ProductCard";
export default function ProductList({ products }) {
    return (_jsx("div", { className: "product-list", children: products.map((p) => (_jsx(ProductCard, { product: p }, p.id))) }));
}

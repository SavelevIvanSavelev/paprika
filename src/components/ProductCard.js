import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FaCheck, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
export default function ProductCard({ product }) {
    return (_jsxs("div", { className: "product-card", children: [_jsx("img", { src: product.image, alt: product.name }), _jsxs("div", { className: "product-info", children: [_jsx("div", { className: "badges", children: product.bio && _jsx("span", { className: "badge bio", children: "BIO" }) }), _jsx("div", { className: "name", children: product.name }), _jsx("div", { className: "per", children: product.per }), _jsx("div", { className: "stock", children: product.stock > 0 ? (_jsxs(_Fragment, { children: [_jsx(FaCheck, { className: "icon check" }), " ", product.stock, " st."] })) : (_jsxs(_Fragment, { children: [_jsx(FaTimes, { className: "icon cross" }), " 0 st."] })) }), _jsxs("div", { className: "agf", children: [_jsx(FaMapMarkerAlt, { className: "icon" }), " AGF"] })] })] }));
}

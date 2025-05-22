import { FaCheck, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

interface Product {
  image: string;
  name: string;
  per: string;
  stock: number;
  bio?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <div className="badges">
          {product.bio && <span className="badge bio">BIO</span>}
          {/* Add other badges as needed */}
        </div>
        <div className="name">{product.name}</div>
        <div className="per">{product.per}</div>
        <div className="stock">
          {product.stock > 0 ? (
            <>
              <FaCheck className="icon check" /> {product.stock} st.
            </>
          ) : (
            <>
              <FaTimes className="icon cross" /> 0 st.
            </>
          )}
        </div>
        <div className="agf">
          <FaMapMarkerAlt className="icon" /> AGF
        </div>
      </div>
    </div>
  );
}

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import SimilarProducts from "../components/product/SimillarProducts";
import "./ProductPage.css";

export default function ProductPage({ product, onAddToCart, navigate }) {
  if (!product) return null;

  const handleNavigateToProduct = (p) => {
    navigate("product", p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <nav className="product-page__breadcrumb">
        <button onClick={() => navigate("home")}>Accueil</button>
        <span className="product-page__breadcrumb-sep">›</span>
        <button onClick={() => navigate("catalogue")}>Collection</button>
        <span className="product-page__breadcrumb-sep">›</span>
        <span className="product-page__breadcrumb-current">{product.name}</span>
      </nav>

      {/* Main layout: galerie + infos */}
      <div className="product-page__layout">
        <div className="product-page__gallery">
          <ProductGallery product={product} />
        </div>
        <div className="product-page__info">
          <ProductInfo product={product} onAddToCart={onAddToCart} />
        </div>
      </div>

      {/* Produits similaires */}
      <SimilarProducts
        product={product}
        onAddToCart={onAddToCart}
        onNavigateToProduct={handleNavigateToProduct}
      />
    </div>
  );
}
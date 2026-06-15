// src/components/home/FeaturedProducts.jsx
import { useAuth } from "../../context/AuthContext";
import { useFeaturedProducts } from "../../hooks/useHomePage";
import "./FeaturedProducts.css";
import "./ProductCard.css";

function ProductCard({ product, onAddToCart, navigate, isAuthenticated }) {
  const { id, name, category, price, old_price, badge, primary_image, discount_percent } = product;
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate("login"); return; }
    onAddToCart(product);
  };

  return (
    <article
      className={`product-card product-card--anim-${(id % 4) + 1}`}
      onClick={() => navigate && navigate("product", product)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-card__img">
        {primary_image ? (
          <img src={primary_image} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        ) : (
          <div className="product-card__placeholder">
            <span className="product-card__placeholder-icon">✦</span>
          </div>
        )}
        {badge && (
          <span className={`product-card__badge product-card__badge--${badge}`}>
            {badge === "new" ? "Nouveau" : `-${discount_percent}%`}
          </span>
        )}
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{category?.name || category}</p>
        <h3 className="product-card__name">{name}</h3>
        <div className="product-card__footer">
          <div className="product-card__pricing">
            <span className="product-card__price">{formatPrice(price)}</span>
            {old_price && <span className="product-card__price-old">{formatPrice(old_price)}</span>}
          </div>
          <button
            className="product-card__add-btn"
            onClick={handleAddToCart}
            title={!isAuthenticated ? "Connectez-vous pour acheter" : ""}
          >
            {isAuthenticated ? "+" : "🔒"}
          </button>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="product-card product-card--skeleton">
      <div className="product-card__img product-card__img--skeleton" />
      <div className="product-card__info">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
      </div>
    </div>
  );
}

export default function FeaturedProducts({ onAddToCart, navigate }) {
  const { isAuthenticated } = useAuth();
  const { products, loading, error } = useFeaturedProducts();

  return (
    <section className="featured" id="featured">
      <div className="section-header">
        <span className="section-tag">Sélection Curatée</span>
        <h2 className="section-title">Produits <em>Vedettes</em></h2>
        <div className="section-line" />
      </div>

      <div className="featured__grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <p style={{ color:"var(--text-muted)", gridColumn:"1/-1", textAlign:"center", padding:"40px" }}>{error}</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              navigate={navigate}
              isAuthenticated={isAuthenticated}
            />
          ))
        )}
      </div>

      <div className="featured__more">
        <button className="btn btn--outline" onClick={() => navigate && navigate("catalogue")}>
          Voir toute la collection →
        </button>
      </div>
    </section>
  );
}

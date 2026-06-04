import { featuredProducts } from "../../data/mockData";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts({ onAddToCart, navigate }) {
  return (
    <section className="featured" id="featured">
      <div className="section-header">
        <span className="section-tag">Sélection Curatée</span>
        <h2 className="section-title">Produits <em>Vedettes</em></h2>
        <div className="section-line" />
      </div>

      <div className="featured__grid">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            navigate={navigate}
          />
        ))}
      </div>

      <div className="featured__more">
        <button
          className="btn btn--outline"
          onClick={() => navigate && navigate("catalogue")}
        >
          Voir toute la collection →
        </button>
      </div>
    </section>
  );
}

// src/pages/PromotionsPage.jsx
import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import "./PromotionsPage.css";

export default function PromotionsPage({ onAddToCart, navigate }) {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    getProducts({ badge: "promo", ordering: "-created_at" })
      .then(data => setProducts(data.results || []))
      .catch(() => setError("Erreur lors du chargement des promotions."))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice    = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";
  const totalSavings   = products.reduce((sum, p) => sum + (p.old_price ? p.old_price - p.price : 0), 0);
  const maxDiscount    = products.length > 0 ? Math.max(...products.map(p => p.discount_percent || 0)) : 0;

  return (
    <div className="promos-page">
      <div className="promos-page__hero">
        <span className="promos-page__tag">Offres Limitées</span>
        <h1 className="promos-page__title">Nos <em>Promotions</em></h1>
        <p className="promos-page__desc">
          Des réductions exceptionnelles sur une sélection de pièces premium.
          Profitez-en avant la fin des stocks.
        </p>
        <div className="promos-page__line" />
      </div>

      {!loading && products.length > 0 && (
        <div className="promos-page__stats">
          <div className="promos-page__stat">
            <span className="promos-page__stat-num">{products.length}</span>
            <span className="promos-page__stat-label">Articles en promo</span>
          </div>
          <div className="promos-page__stat-divider" />
          <div className="promos-page__stat">
            <span className="promos-page__stat-num">jusqu'à {maxDiscount}%</span>
            <span className="promos-page__stat-label">De réduction</span>
          </div>
          <div className="promos-page__stat-divider" />
          <div className="promos-page__stat">
            <span className="promos-page__stat-num">{formatPrice(totalSavings)}</span>
            <span className="promos-page__stat-label">D'économies possibles</span>
          </div>
        </div>
      )}

      <div className="promos-page__countdown">
        <span className="promos-page__countdown-icon">⏳</span>
        <span>Les promotions se terminent bientôt — Ne manquez pas ces offres exclusives !</span>
      </div>

      <div className="promos-page__content">
        {loading && (
          <div className="promos-page__loading">
            <div className="catalogue-page__spinner" />
            <p>Chargement des promotions...</p>
          </div>
        )}

        {error && !loading && (
          <div className="promos-page__empty">
            <p>{error}</p>
            <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
              Voir toute la collection
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="promos-page__count">
              <span>{products.length}</span> offre{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
            </p>

            {products.length === 0 ? (
              <div className="promos-page__empty">
                <p>Aucune promotion en cours. Revenez bientôt !</p>
                <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
                  Voir toute la collection
                </button>
              </div>
            ) : (
              <div className="promos-page__grid">
                {products.map((product) => (
                  <CatalogueCard
                    key={product.id}
                    product={product}
                    viewMode="grid"
                    onAddToCart={onAddToCart}
                    navigate={navigate}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

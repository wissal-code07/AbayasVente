import { useMemo } from "react";
import { catalogueProducts } from "../data/catalogueData";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import "./PromotionsPage.css";

export default function PromotionsPage({ onAddToCart, navigate }) {
  const promoProducts = useMemo(
    () => catalogueProducts.filter((p) => p.badge === "promo"),
    []
  );

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const totalSavings = promoProducts.reduce((sum, p) => {
    return sum + (p.oldPrice ? p.oldPrice - p.price : 0);
  }, 0);

  return (
    <div className="promos-page">
      {/* Hero */}
      <div className="promos-page__hero">
        <span className="promos-page__tag">Offres Limitées</span>
        <h1 className="promos-page__title">Nos <em>Promotions</em></h1>
        <p className="promos-page__desc">
          Des réductions exceptionnelles sur une sélection de pièces premium.
          Profitez-en avant la fin des stocks.
        </p>
        <div className="promos-page__line" />
      </div>

      {/* Stats */}
      <div className="promos-page__stats">
        <div className="promos-page__stat">
          <span className="promos-page__stat-num">{promoProducts.length}</span>
          <span className="promos-page__stat-label">Articles en promo</span>
        </div>
        <div className="promos-page__stat-divider" />
        <div className="promos-page__stat">
          <span className="promos-page__stat-num">jusqu'à 30%</span>
          <span className="promos-page__stat-label">De réduction</span>
        </div>
        <div className="promos-page__stat-divider" />
        <div className="promos-page__stat">
          <span className="promos-page__stat-num">{formatPrice(totalSavings)}</span>
          <span className="promos-page__stat-label">D'économies possibles</span>
        </div>
      </div>

      {/* Countdown banner */}
      <div className="promos-page__countdown">
        <span className="promos-page__countdown-icon">⏳</span>
        <span>Les promotions se terminent bientôt — Ne manquez pas ces offres exclusives !</span>
      </div>

      {/* Grille */}
      <div className="promos-page__content">
        <p className="promos-page__count">
          <span>{promoProducts.length}</span> offres disponibles
        </p>

        {promoProducts.length === 0 ? (
          <div className="promos-page__empty">
            <p>Aucune promotion en cours. Revenez bientôt !</p>
            <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
              Voir toute la collection
            </button>
          </div>
        ) : (
          <div className="promos-page__grid">
            {promoProducts.map((product) => (
              <CatalogueCard
                key={product.id}
                product={product}
                viewMode="grid"
                onAddToCart={onAddToCart}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

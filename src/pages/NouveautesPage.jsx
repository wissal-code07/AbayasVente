import { useMemo } from "react";
import { catalogueProducts } from "../data/catalogueData";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import "./NouveautesPage.css";

export default function NouveautesPage({ onAddToCart, navigate }) {
  const newProducts = useMemo(
    () => catalogueProducts.filter((p) => p.badge === "new"),
    []
  );

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  return (
    <div className="nouveautes-page">
      {/* Hero */}
      <div className="nouveautes-page__hero">
        <span className="nouveautes-page__tag">Vient d'arriver</span>
        <h1 className="nouveautes-page__title">Les <em>Nouveautés</em></h1>
        <p className="nouveautes-page__desc">
          Découvrez en avant-première nos dernières créations.
          Des pièces exclusives renouvelées chaque semaine.
        </p>
        <div className="nouveautes-page__line" />
      </div>

      {/* Bandeau info */}
      <div className="nouveautes-page__banner">
        <span>✦ Nouvelle livraison chaque semaine</span>
        <span>✦ Quantités limitées</span>
        <span>✦ Livraison gratuite dès 5 000 DA</span>
      </div>

      {/* Grille */}
      <div className="nouveautes-page__content">
        <p className="nouveautes-page__count">
          <span>{newProducts.length}</span> nouveaux modèles
        </p>

        {newProducts.length === 0 ? (
          <div className="nouveautes-page__empty">
            <p>Aucune nouveauté pour le moment. Revenez bientôt !</p>
            <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
              Voir toute la collection
            </button>
          </div>
        ) : (
          <div className="nouveautes-page__grid">
            {newProducts.map((product) => (
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

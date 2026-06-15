// src/pages/NouveautesPage.jsx
import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import "./NouveautesPage.css";

export default function NouveautesPage({ onAddToCart, navigate }) {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    getProducts({ badge: "new", ordering: "-created_at" })
      .then(data => setProducts(data.results || []))
      .catch(() => setError("Erreur lors du chargement des nouveautés."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="nouveautes-page">
      <div className="nouveautes-page__hero">
        <span className="nouveautes-page__tag">Vient d'arriver</span>
        <h1 className="nouveautes-page__title">Les <em>Nouveautés</em></h1>
        <p className="nouveautes-page__desc">
          Découvrez en avant-première nos dernières créations.
          Des pièces exclusives renouvelées chaque semaine.
        </p>
        <div className="nouveautes-page__line" />
      </div>

      <div className="nouveautes-page__banner">
        <span>✦ Nouvelle livraison chaque semaine</span>
        <span>✦ Quantités limitées</span>
        <span>✦ Livraison gratuite dès 5 000 DA</span>
      </div>

      <div className="nouveautes-page__content">
        {loading && (
          <div className="nouveautes-page__loading">
            <div className="catalogue-page__spinner" />
            <p>Chargement des nouveautés...</p>
          </div>
        )}

        {error && !loading && (
          <div className="nouveautes-page__empty">
            <p>{error}</p>
            <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
              Voir toute la collection
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="nouveautes-page__count">
              <span>{products.length}</span> nouveau{products.length > 1 ? "x" : ""} modèle{products.length > 1 ? "s" : ""}
            </p>

            {products.length === 0 ? (
              <div className="nouveautes-page__empty">
                <p>Aucune nouveauté pour le moment. Revenez bientôt !</p>
                <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
                  Voir toute la collection
                </button>
              </div>
            ) : (
              <div className="nouveautes-page__grid">
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

import { useMemo } from "react";
import { catalogueProducts } from "../../data/catalogueData";
import CatalogueCard from "../catalogue/CatalogueCard";
import "./SimilarProducts.css";

export default function SimilarProducts({ product, onAddToCart, onNavigateToProduct }) {
  // Produits similaires : même catégorie, excluant le produit actuel
  const similar = useMemo(() => {
    return catalogueProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product]);

  if (similar.length === 0) return null;

  return (
    <section className="similar">
      <div className="similar__header">
        <span className="section-tag">Vous aimerez aussi</span>
        <h2 className="section-title">Produits <em>Similaires</em></h2>
        <div className="section-line" />
      </div>

      <div className="similar__grid">
        {similar.map((p) => (
          <div
            key={p.id}
            onClick={() => onNavigateToProduct(p)}
            style={{ cursor: "pointer" }}
          >
            <CatalogueCard
              product={p}
              viewMode="grid"
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
import "./CatalogueEmpty.css";

export default function CatalogueEmpty({ resetFilters }) {
  return (
    <div className="cat-empty">
      <div className="cat-empty__icon">✦</div>
      <h3 className="cat-empty__title">Aucun produit trouvé</h3>
      <p className="cat-empty__desc">
        Aucune abaya ne correspond à vos critères de recherche.<br />
        Essayez de modifier ou réinitialiser vos filtres.
      </p>
      <button className="btn btn--primary cat-empty__btn" onClick={resetFilters}>
        Réinitialiser les filtres
      </button>
    </div>
  );
}
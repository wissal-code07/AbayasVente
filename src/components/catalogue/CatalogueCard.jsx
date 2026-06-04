import AbayaSilhouette from "../ui/AbayaSilhouette";
import "./CatalogueCard.css";

export default function CatalogueCard({ product, viewMode, onAddToCart, navigate }) {
  const { id, name, category, price, oldPrice, badge,
          gradFrom, gradTo, accent, sizes } = product;

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  const handleCardClick = () => {
    if (navigate) navigate("product", product);
  };

  return (
    <article
      className={`cat-card cat-card--${viewMode}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Image */}
      <div
        className="cat-card__img"
        style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
      >
        <AbayaSilhouette
          id={id}
          gradientFrom={gradFrom}
          gradientTo={gradTo}
          accentColor={accent}
        />

        {badge && (
          <span className={`cat-card__badge cat-card__badge--${badge}`}>
            {badge === "new" ? "Nouveau" : `-${discount}%`}
          </span>
        )}

        {/* Overlay hover (mode grille uniquement) */}
        <div className="cat-card__overlay">
          <button
            className="cat-card__quick-btn"
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          >
            Ajouter au panier
          </button>
          <button
            className="cat-card__quick-icon"
            aria-label="Voir le produit"
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
          >
            👁
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="cat-card__info">
        <p className="cat-card__category">{category}</p>
        <h3 className="cat-card__name">{name}</h3>

        {/* Tailles visibles uniquement en mode liste */}
        {viewMode === "list" && (
          <div className="cat-card__sizes">
            {sizes.map((s) => (
              <span className="cat-card__size-tag" key={s}>{s}</span>
            ))}
          </div>
        )}

        <div className="cat-card__footer">
          <div className="cat-card__pricing">
            <span className="cat-card__price">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="cat-card__price-old">{formatPrice(oldPrice)}</span>
            )}
          </div>
          <button
            className="cat-card__add-btn"
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            aria-label={`Ajouter ${name} au panier`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

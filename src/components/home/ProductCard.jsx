import AbayaSilhouette from "../ui/AbayaSilhouette";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart, navigate }) {
  const { id, name, category, price, oldPrice, badge, badgeLabel,
          gradFrom, gradTo, accent } = product;

  const formatPrice = (p) =>
    new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  return (
    <article
      className={`product-card product-card--anim-${id}`}
      onClick={() => navigate && navigate("product", product)}
      style={{ cursor: "pointer" }}
    >
      {/* Image */}
      <div className="product-card__img">
        <AbayaSilhouette
          id={id}
          gradientFrom={gradFrom}
          gradientTo={gradTo}
          accentColor={accent}
        />
        {badge && (
          <span className={`product-card__badge product-card__badge--${badge}`}>
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="product-card__info">
        <p className="product-card__category">{category}</p>
        <h3 className="product-card__name">{name}</h3>

        <div className="product-card__footer">
          <div className="product-card__pricing">
            <span className="product-card__price">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="product-card__price-old">
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>
          {/* stopPropagation pour ne pas déclencher navigate au clic sur + */}
          <button
            className="product-card__add-btn"
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

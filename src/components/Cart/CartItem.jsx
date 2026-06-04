import AbayaSilhouette from "../ui/AbayaSilhouette";
import "./CartItem.css";

export default function CartItem({ item, index, onRemove, onUpdateQuantity }) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  return (
    <div className="cart-item">
      {/* Thumbnail */}
      <div
        className="cart-item__thumb"
        style={{ background: `linear-gradient(135deg, ${item.gradFrom}, ${item.gradTo})` }}
      >
        <AbayaSilhouette
          id={`cart-${index}`}
          gradientFrom={item.gradFrom}
          gradientTo={item.gradTo}
          accentColor={item.accent}
        />
      </div>

      {/* Info */}
      <div className="cart-item__info">
        <div className="cart-item__top">
          <div>
            <p className="cart-item__category">{item.category}</p>
            <h4 className="cart-item__name">{item.name}</h4>
          </div>
          <button
            className="cart-item__remove"
            onClick={() => onRemove(index)}
            aria-label="Supprimer"
          >
            ✕
          </button>
        </div>

        {/* Options choisies */}
        <div className="cart-item__options">
          {item.selectedSize && (
            <span className="cart-item__tag">Taille : {item.selectedSize}</span>
          )}
          {item.selectedColor && (
            <span className="cart-item__tag">Couleur : {item.selectedColor}</span>
          )}
        </div>

        {/* Prix + quantité */}
        <div className="cart-item__bottom">
          <span className="cart-item__price">{formatPrice(item.price * item.quantity)}</span>

          <div className="cart-item__qty">
            <button
              className="cart-item__qty-btn"
              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="cart-item__qty-num">{item.quantity}</span>
            <button
              className="cart-item__qty-btn"
              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
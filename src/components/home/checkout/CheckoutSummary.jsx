import "./CheckoutSummary.css";

const PROMO_CODES = { "ABAYA10": 10, "RAMADAN20": 20, "BIENVENUE15": 15 };

export default function CheckoutSummary({ cart, deliveryOption }) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const subtotal  = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery  = deliveryOption?.price ?? 0;
  const total     = subtotal + delivery;

  return (
    <div className="checkout-summary">
      <h3 className="checkout-summary__title">Récapitulatif</h3>

      {/* Items */}
      <div className="checkout-summary__items">
        {cart.map((item, i) => (
          <div className="checkout-summary__item" key={i}>
            <div
              className="checkout-summary__item-thumb"
              style={{ background: `linear-gradient(135deg, ${item.gradFrom || "#1A1A1A"}, ${item.gradTo || "#0D0D0D"})` }}
            />
            <div className="checkout-summary__item-info">
              <p className="checkout-summary__item-name">{item.name}</p>
              <p className="checkout-summary__item-opts">
                {item.selectedSize && `Taille ${item.selectedSize}`}
                {item.selectedSize && item.selectedColor && " · "}
                {item.selectedColor}
              </p>
              <p className="checkout-summary__item-qty">Qté : {item.quantity}</p>
            </div>
            <span className="checkout-summary__item-price">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="checkout-summary__totals">
        <div className="checkout-summary__row">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="checkout-summary__row">
          <span>Livraison</span>
          <span className={delivery === 0 ? "checkout-summary__free" : ""}>
            {delivery === 0 ? "Gratuite" : formatPrice(delivery)}
          </span>
        </div>
        {deliveryOption && (
          <div className="checkout-summary__delivery-mode">
            {deliveryOption.icon} {deliveryOption.label}
          </div>
        )}
        <div className="checkout-summary__divider" />
        <div className="checkout-summary__row checkout-summary__row--total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Security badges */}
      <div className="checkout-summary__badges">
        <span className="checkout-summary__badge">🔒 Paiement sécurisé</span>
        <span className="checkout-summary__badge">↩ Retours 14 jours</span>
        <span className="checkout-summary__badge">✦ Qualité garantie</span>
      </div>
    </div>
  );
}

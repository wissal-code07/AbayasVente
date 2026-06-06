import { useState } from "react";
import "./CartSummary.css";

const PROMO_CODES = {
  "ABAYA10":    10,
  "RAMADAN20":  20,
  "BIENVENUE15": 15,
};

const DELIVERY_THRESHOLD = 5000;
const DELIVERY_COST      = 600;

export default function CartSummary({ cart, navigate, onClose }) {
  const [promoInput, setPromoInput]     = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError]     = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * (promoApplied.percent / 100)) : 0;
  const delivery = (subtotal - discount) >= DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
  const total    = subtotal - discount + delivery;

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied({ code, percent: PROMO_CODES[code] });
      setPromoError("");
    } else {
      setPromoError("Code promo invalide.");
      setPromoApplied(null);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoInput("");
    setPromoError("");
  };

  const handleCheckout = () => {
    onClose();
    navigate("checkout");
  };

  return (
    <div className="cart-summary">
      {/* Code promo */}
      <div className="cart-summary__promo">
        <p className="cart-summary__promo-title">Code promo</p>
        {promoApplied ? (
          <div className="cart-summary__promo-applied">
            <span className="cart-summary__promo-code">{promoApplied.code}</span>
            <span className="cart-summary__promo-value">-{promoApplied.percent}%</span>
            <button className="cart-summary__promo-remove" onClick={handleRemovePromo}>✕</button>
          </div>
        ) : (
          <div className="cart-summary__promo-input-row">
            <input
              className="cart-summary__promo-input"
              type="text"
              placeholder="Entrez votre code..."
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
            />
            <button className="cart-summary__promo-btn" onClick={handleApplyPromo}>Appliquer</button>
          </div>
        )}
        {promoError && <p className="cart-summary__promo-error">{promoError}</p>}
        <p className="cart-summary__promo-hint">Essayez : ABAYA10 · RAMADAN20 · BIENVENUE15</p>
      </div>

      {/* Totaux */}
      <div className="cart-summary__totals">
        <div className="cart-summary__row">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="cart-summary__row cart-summary__row--discount">
            <span>Réduction ({promoApplied.percent}%)</span>
            <span>− {formatPrice(discount)}</span>
          </div>
        )}
        <div className="cart-summary__row">
          <span>Livraison</span>
          <span className={delivery === 0 ? "cart-summary__free" : ""}>
            {delivery === 0 ? "Gratuite" : formatPrice(delivery)}
          </span>
        </div>
        {delivery > 0 && (
          <p className="cart-summary__delivery-hint">
            Plus que {formatPrice(DELIVERY_THRESHOLD - (subtotal - discount))} pour la livraison gratuite
          </p>
        )}
        <div className="cart-summary__divider" />
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Bouton commander */}
      <button className="cart-summary__checkout-btn" onClick={handleCheckout}>
        Passer la commande →
      </button>
      <p className="cart-summary__secure">🔒 Paiement 100% sécurisé</p>
    </div>
  );
}

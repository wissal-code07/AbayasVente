import { useState } from "react";
import "./CheckoutDelivery.css";

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Livraison Standard",
    delay: "3 à 5 jours ouvrables",
    price: 0,
    priceLabel: "Gratuite",
    icon: "📦",
    desc: "Livraison à domicile par Algérie Poste ou Yalidine",
  },
  {
    id: "express",
    label: "Livraison Express",
    delay: "24 heures",
    price: 600,
    priceLabel: "600 DA",
    icon: "⚡",
    desc: "Livraison prioritaire le lendemain (grandes villes uniquement)",
  },
  {
    id: "relay",
    label: "Point Relais",
    delay: "2 à 3 jours ouvrables",
    price: 300,
    priceLabel: "300 DA",
    icon: "🏪",
    desc: "Retrait dans un bureau Algérie Poste ou point relais partenaire",
  },
];

export default function CheckoutDelivery({ onNext, onBack, savedData }) {
  const [selected, setSelected] = useState(savedData?.deliveryId || "standard");

  const handleNext = () => {
    const option = DELIVERY_OPTIONS.find(o => o.id === selected);
    onNext({ deliveryId: selected, deliveryOption: option });
  };

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  return (
    <div className="checkout-delivery">
      <h2 className="checkout-section__title">
        <span className="checkout-section__num">2</span>
        Mode de livraison
      </h2>

      <div className="checkout-delivery__options">
        {DELIVERY_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`checkout-delivery__option ${selected === opt.id ? "checkout-delivery__option--selected" : ""}`}
          >
            <input
              type="radio"
              name="delivery"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              className="checkout-delivery__radio"
            />

            <div className="checkout-delivery__icon">{opt.icon}</div>

            <div className="checkout-delivery__info">
              <div className="checkout-delivery__info-top">
                <span className="checkout-delivery__label">{opt.label}</span>
                <span className="checkout-delivery__delay">{opt.delay}</span>
              </div>
              <p className="checkout-delivery__desc">{opt.desc}</p>
            </div>

            <div className={`checkout-delivery__price ${opt.price === 0 ? "checkout-delivery__price--free" : ""}`}>
              {opt.priceLabel}
            </div>
          </label>
        ))}
      </div>

      <div className="checkout-delivery__note">
        <span className="checkout-delivery__note-icon">ℹ</span>
        Les délais de livraison sont indicatifs et peuvent varier selon votre wilaya.
      </div>

      <div className="checkout-section__actions">
        <button className="checkout-section__back-btn" onClick={onBack}>
          ← Retour
        </button>
        <button className="checkout-section__next-btn checkout-section__next-btn--right" onClick={handleNext}>
          Continuer vers le paiement →
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import "./CheckoutPayment.css";

const PAYMENT_OPTIONS = [
  {
    id: "cod",
    label: "Paiement à la livraison",
    desc: "Payez en espèces à la réception de votre commande. Aucune information bancaire requise.",
    icon: "💵",
    badge: "Recommandé",
  },
  {
    id: "card",
    label: "Carte bancaire CIB / Dahabia",
    desc: "Paiement sécurisé par carte bancaire algérienne CIB ou Dahabia.",
    icon: "💳",
    badge: null,
  },
  {
    id: "virement",
    label: "Virement bancaire",
    desc: "Effectuez un virement vers notre compte bancaire. La commande sera traitée après confirmation.",
    icon: "🏦",
    badge: null,
  },
];

export default function CheckoutPayment({ onNext, onBack, savedData }) {
  const [selected, setSelected]   = useState(savedData?.paymentId || "cod");
  const [cardForm, setCardForm]   = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors]       = useState({});

  const setCard = (field) => (e) => {
    let val = e.target.value;
    if (field === "number") val = val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (field === "expiry") val = val.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");
    if (field === "cvv")    val = val.replace(/\D/g, "").slice(0, 3);
    setCardForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateCard = () => {
    const e = {};
    if (cardForm.number.replace(/\s/g, "").length < 16) e.number = "Numéro invalide";
    if (!cardForm.name.trim()) e.name = "Requis";
    if (cardForm.expiry.length < 5) e.expiry = "Date invalide";
    if (cardForm.cvv.length < 3) e.cvv = "CVV invalide";
    return e;
  };

  const handleNext = () => {
    if (selected === "card") {
      const errs = validateCard();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    onNext({ paymentId: selected });
  };

  return (
    <div className="checkout-payment">
      <h2 className="checkout-section__title">
        <span className="checkout-section__num">3</span>
        Mode de paiement
      </h2>

      <div className="checkout-payment__options">
        {PAYMENT_OPTIONS.map((opt) => (
          <div key={opt.id}>
            <label
              className={`checkout-payment__option ${selected === opt.id ? "checkout-payment__option--selected" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="checkout-payment__radio"
              />
              <div className="checkout-payment__icon">{opt.icon}</div>
              <div className="checkout-payment__info">
                <div className="checkout-payment__info-top">
                  <span className="checkout-payment__label">{opt.label}</span>
                  {opt.badge && <span className="checkout-payment__badge">{opt.badge}</span>}
                </div>
                <p className="checkout-payment__desc">{opt.desc}</p>
              </div>
            </label>

            {/* Card form — shown only when card is selected */}
            {selected === "card" && opt.id === "card" && (
              <div className="checkout-payment__card-form">
                <div className="checkout-payment__field">
                  <label className="checkout-payment__label-field">Numéro de carte</label>
                  <input
                    className={`checkout-payment__input ${errors.number ? "error" : ""}`}
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardForm.number}
                    onChange={setCard("number")}
                  />
                  {errors.number && <p className="checkout-payment__error">{errors.number}</p>}
                </div>

                <div className="checkout-payment__field">
                  <label className="checkout-payment__label-field">Nom sur la carte</label>
                  <input
                    className={`checkout-payment__input ${errors.name ? "error" : ""}`}
                    type="text"
                    placeholder="FATIMA BENALI"
                    value={cardForm.name}
                    onChange={setCard("name")}
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.name && <p className="checkout-payment__error">{errors.name}</p>}
                </div>

                <div className="checkout-payment__card-row">
                  <div className="checkout-payment__field">
                    <label className="checkout-payment__label-field">Date d'expiration</label>
                    <input
                      className={`checkout-payment__input ${errors.expiry ? "error" : ""}`}
                      type="text"
                      placeholder="MM/AA"
                      value={cardForm.expiry}
                      onChange={setCard("expiry")}
                    />
                    {errors.expiry && <p className="checkout-payment__error">{errors.expiry}</p>}
                  </div>
                  <div className="checkout-payment__field">
                    <label className="checkout-payment__label-field">CVV</label>
                    <input
                      className={`checkout-payment__input ${errors.cvv ? "error" : ""}`}
                      type="text"
                      placeholder="•••"
                      value={cardForm.cvv}
                      onChange={setCard("cvv")}
                    />
                    {errors.cvv && <p className="checkout-payment__error">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="checkout-payment__secure">
                  🔒 Paiement sécurisé — Vos données bancaires sont chiffrées
                </div>
              </div>
            )}

            {/* Virement info */}
            {selected === "virement" && opt.id === "virement" && (
              <div className="checkout-payment__virement-info">
                <p className="checkout-payment__virement-title">Coordonnées bancaires</p>
                <div className="checkout-payment__virement-details">
                  <div className="checkout-payment__virement-row">
                    <span>Banque</span><span>CPA — Crédit Populaire d'Algérie</span>
                  </div>
                  <div className="checkout-payment__virement-row">
                    <span>RIB</span><span>00799999001234567890 45</span>
                  </div>
                  <div className="checkout-payment__virement-row">
                    <span>Bénéficiaire</span><span>Abayas Vente SARL</span>
                  </div>
                  <div className="checkout-payment__virement-row">
                    <span>Référence</span><span>Votre numéro de commande</span>
                  </div>
                </div>
                <p className="checkout-payment__virement-note">
                  ⚠ Votre commande sera confirmée après réception du virement (1 à 3 jours ouvrables).
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="checkout-section__actions">
        <button className="checkout-section__back-btn" onClick={onBack}>← Retour</button>
        <button className="checkout-section__next-btn checkout-section__next-btn--right" onClick={handleNext}>
          Confirmer la commande →
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAddresses } from "../../../services/authService";
import "./CheckoutAddress.css";

const WILAYAS = [
  "Alger (16)", "Oran (31)", "Constantine (25)", "Annaba (23)",
  "Blida (09)", "Tizi Ouzou (15)", "Sétif (19)", "Sidi Bel Abbès (22)",
  "Batna (05)", "Béjaïa (06)", "Tlemcen (13)", "Biskra (07)",
];

export default function CheckoutAddress({ onNext, savedData }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("saved");
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(savedData?.form || {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    wilaya: "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        const addressesArray = Array.isArray(data) ? data : data.results || [];
        setAddresses(addressesArray);
        if (addressesArray.length > 0) {
          setMode("saved");
          const defaultAddr = addressesArray.find(a => a.default);
          setSelectedId(defaultAddr?.id || addressesArray[0]?.id);
        } else {
          setMode("new");
        }
      } catch (err) {
        console.error("Erreur chargement adresses:", err);
        setMode("new");
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, []);

  const setField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim())  e.lastName  = "Requis";
    if (!form.address.trim())   e.address   = "Requis";
    if (!form.city.trim())      e.city      = "Requis";
    if (!form.wilaya)           e.wilaya    = "Sélectionnez une wilaya";
    if (!form.phone.trim())     e.phone     = "Requis";
    return e;
  };

  const handleNext = () => {
    if (mode === "saved") {
      const addr = addresses.find(a => a.id === selectedId);
      if (addr) onNext({ mode: "saved", address: addr });
    } else {
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      // Transmet les données sans appeler l'API (CheckoutPage s'en chargera)
      onNext({ mode: "new", form });
    }
  };

  if (loading) return <div className="checkout-address">Chargement...</div>;

  return (
    <div className="checkout-address">
      <h2 className="checkout-section__title">
        <span className="checkout-section__num">1</span>
        Adresse de livraison
      </h2>

      {addresses.length > 0 && (
        <div className="checkout-address__tabs">
          <button
            className={`checkout-address__tab ${mode === "saved" ? "checkout-address__tab--active" : ""}`}
            onClick={() => setMode("saved")}
          >
            Mes adresses enregistrées
          </button>
          <button
            className={`checkout-address__tab ${mode === "new" ? "checkout-address__tab--active" : ""}`}
            onClick={() => setMode("new")}
          >
            Nouvelle adresse
          </button>
        </div>
      )}

      {mode === "saved" && addresses.length > 0 && (
        <div className="checkout-address__saved">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`checkout-address__card ${selectedId === addr.id ? "checkout-address__card--selected" : ""}`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedId === addr.id}
                onChange={() => setSelectedId(addr.id)}
                className="checkout-address__radio"
              />
              <div className="checkout-address__card-content">
                <div className="checkout-address__card-header">
                  {addr.label && <span className="checkout-address__card-label">{addr.label}</span>}
                  {addr.default && <span className="checkout-address__default">Par défaut</span>}
                </div>
                <p className="checkout-address__card-name">{addr.firstName} {addr.lastName}</p>
                <p className="checkout-address__card-text">{addr.address}</p>
                <p className="checkout-address__card-text">{addr.city}, {addr.wilaya}</p>
                <p className="checkout-address__card-text">{addr.phone}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {mode === "new" && (
        <div className="checkout-address__form">
          <div className="checkout-address__row">
            <div className={`checkout-address__field ${errors.firstName ? "error" : ""}`}>
              <label className="checkout-address__label">Prénom *</label>
              <input className="checkout-address__input" type="text" value={form.firstName} onChange={setField("firstName")} />
              {errors.firstName && <p className="checkout-address__error">{errors.firstName}</p>}
            </div>
            <div className={`checkout-address__field ${errors.lastName ? "error" : ""}`}>
              <label className="checkout-address__label">Nom *</label>
              <input className="checkout-address__input" type="text" value={form.lastName} onChange={setField("lastName")} />
              {errors.lastName && <p className="checkout-address__error">{errors.lastName}</p>}
            </div>
          </div>

          <div className={`checkout-address__field ${errors.address ? "error" : ""}`}>
            <label className="checkout-address__label">Adresse *</label>
            <input className="checkout-address__input" type="text" placeholder="N° Rue, Quartier" value={form.address} onChange={setField("address")} />
            {errors.address && <p className="checkout-address__error">{errors.address}</p>}
          </div>

          <div className="checkout-address__row">
            <div className={`checkout-address__field ${errors.city ? "error" : ""}`}>
              <label className="checkout-address__label">Ville *</label>
              <input className="checkout-address__input" type="text" value={form.city} onChange={setField("city")} />
              {errors.city && <p className="checkout-address__error">{errors.city}</p>}
            </div>
            <div className={`checkout-address__field ${errors.wilaya ? "error" : ""}`}>
              <label className="checkout-address__label">Wilaya *</label>
              <select className="checkout-address__input checkout-address__select" value={form.wilaya} onChange={setField("wilaya")}>
                <option value="">Sélectionner...</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <p className="checkout-address__error">{errors.wilaya}</p>}
            </div>
          </div>

          <div className={`checkout-address__field ${errors.phone ? "error" : ""}`}>
            <label className="checkout-address__label">Téléphone *</label>
            <input className="checkout-address__input" type="tel" placeholder="+213 555 000 000" value={form.phone} onChange={setField("phone")} />
            {errors.phone && <p className="checkout-address__error">{errors.phone}</p>}
          </div>
        </div>
      )}

      <button className="checkout-section__next-btn" onClick={handleNext}>
        Continuer vers la livraison →
      </button>
    </div>
  );
}
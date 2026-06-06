import { useState } from "react";
import { mockAddresses } from "../../data/accountData";
import "./AccountAddresses.css";

const WILAYAS = ["Alger (16)", "Oran (31)", "Constantine (25)", "Annaba (23)", "Blida (09)", "Tizi Ouzou (15)", "Sétif (19)", "Sidi Bel Abbès (22)"];

const emptyForm = { label: "", firstName: "", lastName: "", address: "", city: "", wilaya: "", phone: "" };

export default function AccountAddresses() {
  const [addresses, setAddresses]   = useState(mockAddresses);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [errors, setErrors]         = useState({});

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim())  e.lastName  = "Requis";
    if (!form.address.trim())   e.address   = "Requis";
    if (!form.city.trim())      e.city      = "Requis";
    if (!form.wilaya)           e.wilaya    = "Requis";
    if (!form.phone.trim())     e.phone     = "Requis";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editId !== null) {
      setAddresses((prev) => prev.map((a) => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAddresses((prev) => [...prev, { ...form, id: Date.now(), default: false }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleEdit = (addr) => {
    setForm({ label: addr.label, firstName: addr.firstName, lastName: addr.lastName, address: addr.address, city: addr.city, wilaya: addr.wilaya, phone: addr.phone });
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, default: a.id === id })));
  };

  return (
    <div className="acc-addresses">
      <div className="acc-addresses__header">
        <h2 className="acc-addresses__title">Mes Adresses</h2>
        {!showForm && (
          <button
            className="btn btn--primary acc-addresses__add-btn"
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          >
            + Ajouter une adresse
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form className="acc-addresses__form" onSubmit={handleSubmit} noValidate>
          <h3 className="acc-addresses__form-title">
            {editId ? "Modifier l'adresse" : "Nouvelle adresse"}
          </h3>

          <div className="acc-addresses__form-row">
            <div className="acc-addresses__field">
              <label className="acc-addresses__label">Étiquette (ex: Domicile)</label>
              <input className="acc-addresses__input" type="text" placeholder="Domicile" value={form.label} onChange={set("label")} />
            </div>
          </div>

          <div className="acc-addresses__form-row acc-addresses__form-row--2">
            <div className={`acc-addresses__field ${errors.firstName ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Prénom *</label>
              <input className="acc-addresses__input" type="text" value={form.firstName} onChange={set("firstName")} />
              {errors.firstName && <p className="acc-addresses__error">{errors.firstName}</p>}
            </div>
            <div className={`acc-addresses__field ${errors.lastName ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Nom *</label>
              <input className="acc-addresses__input" type="text" value={form.lastName} onChange={set("lastName")} />
              {errors.lastName && <p className="acc-addresses__error">{errors.lastName}</p>}
            </div>
          </div>

          <div className={`acc-addresses__field ${errors.address ? "acc-addresses__field--error" : ""}`}>
            <label className="acc-addresses__label">Adresse *</label>
            <input className="acc-addresses__input" type="text" placeholder="N° Rue, Quartier" value={form.address} onChange={set("address")} />
            {errors.address && <p className="acc-addresses__error">{errors.address}</p>}
          </div>

          <div className="acc-addresses__form-row acc-addresses__form-row--2">
            <div className={`acc-addresses__field ${errors.city ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Ville *</label>
              <input className="acc-addresses__input" type="text" value={form.city} onChange={set("city")} />
              {errors.city && <p className="acc-addresses__error">{errors.city}</p>}
            </div>
            <div className={`acc-addresses__field ${errors.wilaya ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Wilaya *</label>
              <select className="acc-addresses__input acc-addresses__select" value={form.wilaya} onChange={set("wilaya")}>
                <option value="">Sélectionner...</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <p className="acc-addresses__error">{errors.wilaya}</p>}
            </div>
          </div>

          <div className={`acc-addresses__field ${errors.phone ? "acc-addresses__field--error" : ""}`}>
            <label className="acc-addresses__label">Téléphone *</label>
            <input className="acc-addresses__input" type="tel" placeholder="+213 555 000 000" value={form.phone} onChange={set("phone")} />
            {errors.phone && <p className="acc-addresses__error">{errors.phone}</p>}
          </div>

          <div className="acc-addresses__form-actions">
            <button type="submit" className="btn btn--primary">
              {editId ? "Enregistrer" : "Ajouter l'adresse"}
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); setErrors({}); }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Address cards */}
      <div className="acc-addresses__grid">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`acc-addresses__card ${addr.default ? "acc-addresses__card--default" : ""}`}
          >
            {addr.default && <span className="acc-addresses__default-badge">Par défaut</span>}
            {addr.label && <p className="acc-addresses__card-label">{addr.label}</p>}
            <p className="acc-addresses__card-name">{addr.firstName} {addr.lastName}</p>
            <p className="acc-addresses__card-text">{addr.address}</p>
            <p className="acc-addresses__card-text">{addr.city}, {addr.wilaya}</p>
            <p className="acc-addresses__card-text">{addr.phone}</p>
            <div className="acc-addresses__card-actions">
              <button className="acc-addresses__card-btn" onClick={() => handleEdit(addr)}>Modifier</button>
              {!addr.default && (
                <>
                  <button className="acc-addresses__card-btn" onClick={() => handleSetDefault(addr.id)}>Définir par défaut</button>
                  <button className="acc-addresses__card-btn acc-addresses__card-btn--delete" onClick={() => handleDelete(addr.id)}>Supprimer</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../services/authService";
import "./AccountAddresses.css";

const WILAYAS = [
  "Alger (16)", "Oran (31)", "Constantine (25)", "Annaba (23)",
  "Blida (09)", "Tizi Ouzou (15)", "Sétif (19)", "Sidi Bel Abbès (22)"
];

const emptyForm = { label: "", firstName: "", lastName: "", address: "", city: "", wilaya: "", phone: "" };

export default function AccountAddresses() {
  const { user, setUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      // ✅ Correction : si data est un objet avec 'results', on prend results
      const addressesArray = Array.isArray(data) ? data : data.results || [];
      setAddresses(addressesArray);
    } catch (err) {
      console.error("Erreur chargement adresses:", err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      if (editId !== null) {
        await updateAddress(editId, form);
      } else {
        await createAddress(form);
      }
      await loadAddresses(); // recharger la liste après modification
      setUser({ ...user });  // mettre à jour le contexte
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement de l'adresse.");
    }
  };

  const handleEdit = (addr) => {
    setForm({
      label: addr.label || "",
      firstName: addr.firstName,
      lastName: addr.lastName,
      address: addr.address,
      city: addr.city,
      wilaya: addr.wilaya,
      phone: addr.phone,
    });
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette adresse ?")) {
      try {
        await deleteAddress(id);
        await loadAddresses();
        setUser({ ...user });
      } catch (err) {
        console.error(err);
        alert("Impossible de supprimer.");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      await loadAddresses();
      setUser({ ...user });
    } catch (err) {
      console.error(err);
      alert("Impossible de définir cette adresse par défaut.");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
  };

  if (loading) return <div className="acc-addresses">Chargement...</div>;

  return (
    <div className="acc-addresses">
      <div className="acc-addresses__header">
        <h2 className="acc-addresses__title">Mes Adresses</h2>
        {!showForm && (
          <button className="btn btn--primary acc-addresses__add-btn" onClick={() => setShowForm(true)}>
            + Ajouter une adresse
          </button>
        )}
      </div>

      {showForm && (
        <form className="acc-addresses__form" onSubmit={handleSubmit} noValidate>
          <h3 className="acc-addresses__form-title">{editId ? "Modifier l'adresse" : "Nouvelle adresse"}</h3>
          <div className="acc-addresses__form-row">
            <div className="acc-addresses__field">
              <label className="acc-addresses__label">Étiquette (ex: Domicile)</label>
              <input className="acc-addresses__input" type="text" value={form.label} onChange={setField("label")} />
            </div>
          </div>
          <div className="acc-addresses__form-row acc-addresses__form-row--2">
            <div className={`acc-addresses__field ${errors.firstName ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Prénom *</label>
              <input className="acc-addresses__input" type="text" value={form.firstName} onChange={setField("firstName")} />
              {errors.firstName && <p className="acc-addresses__error">{errors.firstName}</p>}
            </div>
            <div className={`acc-addresses__field ${errors.lastName ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Nom *</label>
              <input className="acc-addresses__input" type="text" value={form.lastName} onChange={setField("lastName")} />
              {errors.lastName && <p className="acc-addresses__error">{errors.lastName}</p>}
            </div>
          </div>
          <div className={`acc-addresses__field ${errors.address ? "acc-addresses__field--error" : ""}`}>
            <label className="acc-addresses__label">Adresse *</label>
            <input className="acc-addresses__input" type="text" placeholder="N° Rue, Quartier" value={form.address} onChange={setField("address")} />
            {errors.address && <p className="acc-addresses__error">{errors.address}</p>}
          </div>
          <div className="acc-addresses__form-row acc-addresses__form-row--2">
            <div className={`acc-addresses__field ${errors.city ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Ville *</label>
              <input className="acc-addresses__input" type="text" value={form.city} onChange={setField("city")} />
              {errors.city && <p className="acc-addresses__error">{errors.city}</p>}
            </div>
            <div className={`acc-addresses__field ${errors.wilaya ? "acc-addresses__field--error" : ""}`}>
              <label className="acc-addresses__label">Wilaya *</label>
              <select className="acc-addresses__input acc-addresses__select" value={form.wilaya} onChange={setField("wilaya")}>
                <option value="">Sélectionner...</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <p className="acc-addresses__error">{errors.wilaya}</p>}
            </div>
          </div>
          <div className={`acc-addresses__field ${errors.phone ? "acc-addresses__field--error" : ""}`}>
            <label className="acc-addresses__label">Téléphone *</label>
            <input className="acc-addresses__input" type="tel" placeholder="+213 555 000 000" value={form.phone} onChange={setField("phone")} />
            {errors.phone && <p className="acc-addresses__error">{errors.phone}</p>}
          </div>
          <div className="acc-addresses__form-actions">
            <button type="submit" className="btn btn--primary">{editId ? "Enregistrer" : "Ajouter l'adresse"}</button>
            <button type="button" className="btn btn--outline" onClick={resetForm}>Annuler</button>
          </div>
        </form>
      )}

      <div className="acc-addresses__grid">
        {addresses.map(addr => (
          <div key={addr.id} className={`acc-addresses__card ${addr.default ? "acc-addresses__card--default" : ""}`}>
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
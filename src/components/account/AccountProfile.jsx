import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../services/authService";
import "./AccountProfile.css";

export default function AccountProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setForm({
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: profile.phone || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      setUser({ ...user, ...updated });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.current) errs.current = "Requis";
    if (passwords.newPwd.length < 8) errs.newPwd = "Minimum 8 caractères";
    if (passwords.newPwd !== passwords.confirm) errs.confirm = "Ne correspond pas";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await changePassword(passwords.current, passwords.newPwd);
      setPasswordSaved(true);
      setPasswords({ current: "", newPwd: "", confirm: "" });
      setErrors({});
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Mot de passe actuel incorrect.");
    }
  };

  if (loading) return <div className="acc-profile">Chargement...</div>;

  return (
    <div className="acc-profile">
      <h2 className="acc-profile__title">Mon Profil</h2>

      {/* Avatar */}
      <div className="acc-profile__avatar-section">
        <div className="acc-profile__avatar">
          {form.firstName?.[0]}{form.lastName?.[0]}
        </div>
        <div>
          <p className="acc-profile__avatar-name">{form.firstName} {form.lastName}</p>
          <p className="acc-profile__avatar-since">
            Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "récemment"}
          </p>
        </div>
      </div>

      {/* Formulaire informations personnelles */}
      <form className="acc-profile__form" onSubmit={handleProfileSave}>
        <h3 className="acc-profile__form-title">Informations personnelles</h3>
        <div className="acc-profile__row">
          <div className="acc-profile__field">
            <label className="acc-profile__label">Prénom</label>
            <input
              className="acc-profile__input"
              type="text"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className="acc-profile__field">
            <label className="acc-profile__label">Nom</label>
            <input
              className="acc-profile__input"
              type="text"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="acc-profile__field">
          <label className="acc-profile__label">Adresse email</label>
          <input className="acc-profile__input" type="email" value={form.email} disabled />
        </div>
        <div className="acc-profile__field">
          <label className="acc-profile__label">Téléphone</label>
          <input
            className="acc-profile__input"
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className={`acc-profile__save-btn ${profileSaved ? "acc-profile__save-btn--saved" : ""}`}
        >
          {profileSaved ? "✓ Enregistré !" : "Enregistrer les modifications"}
        </button>
      </form>

      {/* Formulaire changement mot de passe */}
      <form className="acc-profile__form" onSubmit={handlePasswordSave}>
        <h3 className="acc-profile__form-title">Changer le mot de passe</h3>
        <div className="acc-profile__field">
          <label className="acc-profile__label">Mot de passe actuel</label>
          <div className="acc-profile__input-wrap">
            <input
              className={`acc-profile__input ${errors.current ? "acc-profile__input--error" : ""}`}
              type={showCurrent ? "text" : "password"}
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
            />
            <button type="button" className="acc-profile__eye" onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? "🙈" : "👁"}
            </button>
          </div>
          {errors.current && <p className="acc-profile__error">{errors.current}</p>}
        </div>
        <div className="acc-profile__row">
          <div className="acc-profile__field">
            <label className="acc-profile__label">Nouveau mot de passe</label>
            <div className="acc-profile__input-wrap">
              <input
                className={`acc-profile__input ${errors.newPwd ? "acc-profile__input--error" : ""}`}
                type={showNew ? "text" : "password"}
                value={passwords.newPwd}
                onChange={e => setPasswords({ ...passwords, newPwd: e.target.value })}
                placeholder="Minimum 8 caractères"
              />
              <button type="button" className="acc-profile__eye" onClick={() => setShowNew(!showNew)}>
                {showNew ? "🙈" : "👁"}
              </button>
            </div>
            {errors.newPwd && <p className="acc-profile__error">{errors.newPwd}</p>}
          </div>
          <div className="acc-profile__field">
            <label className="acc-profile__label">Confirmer</label>
            <input
              className={`acc-profile__input ${errors.confirm ? "acc-profile__input--error" : ""}`}
              type="password"
              value={passwords.confirm}
              onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="••••••••"
            />
            {errors.confirm && <p className="acc-profile__error">{errors.confirm}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={`acc-profile__save-btn ${passwordSaved ? "acc-profile__save-btn--saved" : ""}`}
        >
          {passwordSaved ? "✓ Mot de passe mis à jour !" : "Changer le mot de passe"}
        </button>
      </form>
    </div>
  );
}
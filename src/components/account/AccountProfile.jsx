import { useState } from "react";
import { mockUser } from "../../data/accountData";
import "./AccountProfile.css";

export default function AccountProfile() {
  const [form, setForm] = useState({
    firstName: mockUser.firstName,
    lastName:  mockUser.lastName,
    email:     mockUser.email,
    phone:     mockUser.phone,
  });
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [profileSaved, setProfileSaved]   = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [errors, setErrors]               = useState({});

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const setPwd = (field) => (e) => setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.current)           errs.current = "Requis";
    if (passwords.newPwd.length < 8)  errs.newPwd  = "Minimum 8 caractères";
    if (passwords.newPwd !== passwords.confirm) errs.confirm = "Ne correspond pas";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setPasswordSaved(true);
    setPasswords({ current: "", newPwd: "", confirm: "" });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div className="acc-profile">
      <h2 className="acc-profile__title">Mon Profil</h2>

      {/* Avatar */}
      <div className="acc-profile__avatar-section">
        <div className="acc-profile__avatar">{mockUser.avatar}</div>
        <div>
          <p className="acc-profile__avatar-name">{form.firstName} {form.lastName}</p>
          <p className="acc-profile__avatar-since">Membre depuis {mockUser.joinDate}</p>
        </div>
      </div>

      {/* Info form */}
      <form className="acc-profile__form" onSubmit={handleProfileSave} noValidate>
        <h3 className="acc-profile__form-title">Informations personnelles</h3>

        <div className="acc-profile__row">
          <div className="acc-profile__field">
            <label className="acc-profile__label">Prénom</label>
            <input className="acc-profile__input" type="text" value={form.firstName} onChange={set("firstName")} />
          </div>
          <div className="acc-profile__field">
            <label className="acc-profile__label">Nom</label>
            <input className="acc-profile__input" type="text" value={form.lastName} onChange={set("lastName")} />
          </div>
        </div>

        <div className="acc-profile__field">
          <label className="acc-profile__label">Adresse email</label>
          <input className="acc-profile__input" type="email" value={form.email} onChange={set("email")} />
        </div>

        <div className="acc-profile__field">
          <label className="acc-profile__label">Téléphone</label>
          <input className="acc-profile__input" type="tel" value={form.phone} onChange={set("phone")} />
        </div>

        <button type="submit" className={`acc-profile__save-btn ${profileSaved ? "acc-profile__save-btn--saved" : ""}`}>
          {profileSaved ? "✓ Enregistré !" : "Enregistrer les modifications"}
        </button>
      </form>

      {/* Password form */}
      <form className="acc-profile__form" onSubmit={handlePasswordSave} noValidate>
        <h3 className="acc-profile__form-title">Changer le mot de passe</h3>

        <div className="acc-profile__field">
          <label className="acc-profile__label">Mot de passe actuel</label>
          <div className="acc-profile__input-wrap">
            <input
              className={`acc-profile__input ${errors.current ? "acc-profile__input--error" : ""}`}
              type={showCurrent ? "text" : "password"}
              value={passwords.current}
              onChange={setPwd("current")}
              placeholder="••••••••"
            />
            <button type="button" className="acc-profile__eye" onClick={() => setShowCurrent(v => !v)}>
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
                onChange={setPwd("newPwd")}
                placeholder="Minimum 8 caractères"
              />
              <button type="button" className="acc-profile__eye" onClick={() => setShowNew(v => !v)}>
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
              onChange={setPwd("confirm")}
              placeholder="••••••••"
            />
            {errors.confirm && <p className="acc-profile__error">{errors.confirm}</p>}
          </div>
        </div>

        <button type="submit" className={`acc-profile__save-btn ${passwordSaved ? "acc-profile__save-btn--saved" : ""}`}>
          {passwordSaved ? "✓ Mot de passe mis à jour !" : "Changer le mot de passe"}
        </button>
      </form>
    </div>
  );
}

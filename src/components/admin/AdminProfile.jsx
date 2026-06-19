import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, changePassword } from "../../services/authService";

export default function AdminProfile() {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    phone:     user?.phone     || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword:     "",
    newPassword:     "",
    confirmPassword: "",
  });

  const [profileMsg, setProfileMsg]   = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [profileErr, setProfileErr]   = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loadingP, setLoadingP]       = useState(false);
  const [loadingPw, setLoadingPw]     = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoadingP(true); setProfileMsg(""); setProfileErr("");
    try {
      await updateProfile(profileForm);
      setUser({
        ...user,
        firstName: profileForm.firstName,
        lastName:  profileForm.lastName,
        phone:     profileForm.phone,      // ← corrigé
      });
      setProfileMsg("Profil mis à jour avec succès.");
    } catch {
      setProfileErr("Erreur lors de la mise à jour du profil.");
    } finally { setLoadingP(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordMsg(""); setPasswordErr("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErr("Les mots de passe ne correspondent pas."); return;
    }
    setLoadingPw(true);
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordMsg("Mot de passe modifié avec succès.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPasswordErr("Mot de passe actuel incorrect.");
    } finally { setLoadingPw(false); }
  };

  return (
    <div className="admin-profile">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Mon Profil</h2>
      </div>

      {/* ── Infos personnelles ── */}
      <div className="admin-profile__block">
        <div className="admin-block__header">
          <h3 className="admin-block__title">Informations personnelles</h3>
        </div>
        <form onSubmit={handleProfileSave} className="admin-profile__form">
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label className="admin-form__label">Prénom</label>
              <input className="admin-form__input"
                value={profileForm.firstName}
                onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Nom</label>
              <input className="admin-form__input"
                value={profileForm.lastName}
                onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Téléphone</label>
              <input className="admin-form__input"
                value={profileForm.phone}
                onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Email</label>
              <input className="admin-form__input" value={user?.email || ""} disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }} />
            </div>
          </div>
          {profileMsg && <p className="admin-profile__success">{profileMsg}</p>}
          {profileErr && <p className="admin-profile__error">{profileErr}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={loadingP}>
              {loadingP ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Mot de passe ── */}
      <div className="admin-profile__block">
        <div className="admin-block__header">
          <h3 className="admin-block__title">Modifier le mot de passe</h3>
        </div>
        <form onSubmit={handlePasswordSave} className="admin-profile__form">
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label className="admin-form__label">Mot de passe actuel</label>
              <input className="admin-form__input" type="password"
                value={passwordForm.oldPassword}
                onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Nouveau mot de passe</label>
              <input className="admin-form__input" type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Confirmer le mot de passe</label>
              <input className="admin-form__input" type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required />
            </div>
          </div>
          {passwordMsg && <p className="admin-profile__success">{passwordMsg}</p>}
          {passwordErr && <p className="admin-profile__error">{passwordErr}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={loadingPw}>
              {loadingPw ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
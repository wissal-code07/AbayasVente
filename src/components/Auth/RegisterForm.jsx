import { useState } from "react";
import "./AuthForms.css";

export default function RegisterForm({ onSwitchTab, navigate }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "", terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Le prénom est requis.";
    if (!form.lastName.trim())  e.lastName  = "Le nom est requis.";
    if (!form.email)            e.email     = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.password)         e.password  = "Le mot de passe est requis.";
    else if (form.password.length < 8) e.password = "Minimum 8 caractères.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (!form.terms) e.terms = "Vous devez accepter les conditions.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Mock register — sera remplacé par l'appel API Django
    setTimeout(() => {
      setLoading(false);
      navigate("home");
    }, 1400);
  };

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Faible", "Moyen", "Fort", "Très fort"][strength];
  const strengthClass = ["", "weak", "medium", "strong", "very-strong"][strength];

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Google */}
      <button type="button" className="auth-form__google">
        <span className="auth-form__google-icon">G</span>
        Continuer avec Google
      </button>

      <div className="auth-form__divider"><span>ou</span></div>

      {/* Prénom + Nom */}
      <div className="auth-form__row">
        <div className={`auth-form__field ${errors.firstName ? "auth-form__field--error" : ""}`}>
          <label className="auth-form__label">Prénom</label>
          <input className="auth-form__input" type="text" placeholder="Fatima" value={form.firstName} onChange={set("firstName")} />
          {errors.firstName && <p className="auth-form__error">{errors.firstName}</p>}
        </div>
        <div className={`auth-form__field ${errors.lastName ? "auth-form__field--error" : ""}`}>
          <label className="auth-form__label">Nom</label>
          <input className="auth-form__input" type="text" placeholder="Benali" value={form.lastName} onChange={set("lastName")} />
          {errors.lastName && <p className="auth-form__error">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className={`auth-form__field ${errors.email ? "auth-form__field--error" : ""}`}>
        <label className="auth-form__label">Adresse email</label>
        <input className="auth-form__input" type="email" placeholder="votre@email.com" value={form.email} onChange={set("email")} autoComplete="email" />
        {errors.email && <p className="auth-form__error">{errors.email}</p>}
      </div>

      {/* Mot de passe */}
      <div className={`auth-form__field ${errors.password ? "auth-form__field--error" : ""}`}>
        <label className="auth-form__label">Mot de passe</label>
        <div className="auth-form__input-wrap">
          <input
            className="auth-form__input"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 caractères"
            value={form.password}
            onChange={set("password")}
            autoComplete="new-password"
          />
          <button type="button" className="auth-form__eye" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        {form.password && (
          <div className="auth-form__strength">
            <div className="auth-form__strength-bars">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`auth-form__strength-bar ${i <= strength ? `auth-form__strength-bar--${strengthClass}` : ""}`} />
              ))}
            </div>
            <span className={`auth-form__strength-label auth-form__strength-label--${strengthClass}`}>{strengthLabel}</span>
          </div>
        )}
        {errors.password && <p className="auth-form__error">{errors.password}</p>}
      </div>

      {/* Confirmer mot de passe */}
      <div className={`auth-form__field ${errors.confirmPassword ? "auth-form__field--error" : ""}`}>
        <label className="auth-form__label">Confirmer le mot de passe</label>
        <input className="auth-form__input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password" />
        {errors.confirmPassword && <p className="auth-form__error">{errors.confirmPassword}</p>}
      </div>

      {/* Conditions */}
      <div className={errors.terms ? "auth-form__field--error" : ""}>
        <label className="auth-form__checkbox">
          <input type="checkbox" checked={form.terms} onChange={set("terms")} />
          <span className="auth-form__checkbox-custom" />
          <span className="auth-form__checkbox-label">
            J'accepte les{" "}
            <button type="button" className="auth-form__switch-link">conditions d'utilisation</button>
            {" "}et la{" "}
            <button type="button" className="auth-form__switch-link">politique de confidentialité</button>
          </span>
        </label>
        {errors.terms && <p className="auth-form__error">{errors.terms}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={`auth-form__submit ${loading ? "auth-form__submit--loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Création du compte..." : "Créer mon compte"}
      </button>

      <p className="auth-form__switch">
        Déjà un compte ?{" "}
        <button type="button" className="auth-form__switch-link" onClick={() => onSwitchTab("login")}>
          Se connecter
        </button>
      </p>
    </form>
  );
}
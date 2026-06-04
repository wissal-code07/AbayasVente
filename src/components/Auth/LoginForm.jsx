import { useState } from "react";
import "./AuthForms.css";

export default function LoginForm({ onSwitchTab, navigate }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.password) e.password = "Le mot de passe est requis.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Mock login — sera remplacé par l'appel API Django
    setTimeout(() => {
      setLoading(false);
      navigate("home");
    }, 1200);
  };

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {/* Google */}
      <button type="button" className="auth-form__google">
        <span className="auth-form__google-icon">G</span>
        Continuer avec Google
      </button>

      <div className="auth-form__divider"><span>ou</span></div>

      {/* Email */}
      <div className={`auth-form__field ${errors.email ? "auth-form__field--error" : ""}`}>
        <label className="auth-form__label">Adresse email</label>
        <input
          className="auth-form__input"
          type="email"
          placeholder="votre@email.com"
          value={form.email}
          onChange={set("email")}
          autoComplete="email"
        />
        {errors.email && <p className="auth-form__error">{errors.email}</p>}
      </div>

      {/* Mot de passe */}
      <div className={`auth-form__field ${errors.password ? "auth-form__field--error" : ""}`}>
        <div className="auth-form__label-row">
          <label className="auth-form__label">Mot de passe</label>
          <button
            type="button"
            className="auth-form__forgot"
            onClick={() => navigate("forgot-password")}
          >
            Mot de passe oublié ?
          </button>
        </div>
        <div className="auth-form__input-wrap">
          <input
            className="auth-form__input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="auth-form__eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Masquer" : "Afficher"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && <p className="auth-form__error">{errors.password}</p>}
      </div>

      {/* Se souvenir */}
      <label className="auth-form__checkbox">
        <input
          type="checkbox"
          checked={form.remember}
          onChange={set("remember")}
        />
        <span className="auth-form__checkbox-custom" />
        <span className="auth-form__checkbox-label">Se souvenir de moi</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        className={`auth-form__submit ${loading ? "auth-form__submit--loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>

      <p className="auth-form__switch">
        Pas encore de compte ?{" "}
        <button type="button" className="auth-form__switch-link" onClick={() => onSwitchTab("register")}>
          Créer un compte
        </button>
      </p>
    </form>
  );
}
import { useState } from "react";
import { login } from "../../services/authService";
import "./AuthForms.css";

export default function LoginForm({ onSwitchTab, navigate, onLoginSuccess }) {
  const [form, setForm]             = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState("");

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.password) e.password = "Le mot de passe est requis.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      const user = await login(form.email, form.password);
      onLoginSuccess(user);
      navigate(user.isStaff ? "admin" : "account");
    } catch (err) {
      setApiError(err.response?.data?.detail || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <button type="button" className="auth-form__google">
        <span className="auth-form__google-icon">G</span>
        Continuer avec Google
      </button>
      <div className="auth-form__divider"><span>ou</span></div>

      {apiError && <div className="auth-form__api-error">{apiError}</div>}

      <div className={`auth-form__field ${errors.email ? "auth-form__field--error" : ""}`}>
        <label className="auth-form__label">Adresse email</label>
        <input className="auth-form__input" type="email" placeholder="votre@email.com" value={form.email} onChange={set("email")} autoComplete="email" />
        {errors.email && <p className="auth-form__error">{errors.email}</p>}
      </div>

      <div className={`auth-form__field ${errors.password ? "auth-form__field--error" : ""}`}>
        <div className="auth-form__label-row">
          <label className="auth-form__label">Mot de passe</label>
          <button type="button" className="auth-form__forgot" onClick={() => navigate("forgot-password")}>Mot de passe oublié ?</button>
        </div>
        <div className="auth-form__input-wrap">
          <input className="auth-form__input" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={set("password")} autoComplete="current-password" />
          <button type="button" className="auth-form__eye" onClick={() => setShowPassword((v) => !v)}>{showPassword ? "🙈" : "👁"}</button>
        </div>
        {errors.password && <p className="auth-form__error">{errors.password}</p>}
      </div>

      <label className="auth-form__checkbox">
        <input type="checkbox" checked={form.remember} onChange={set("remember")} />
        <span className="auth-form__checkbox-custom" />
        <span className="auth-form__checkbox-label">Se souvenir de moi</span>
      </label>

      <button type="submit" className={`auth-form__submit ${loading ? "auth-form__submit--loading" : ""}`} disabled={loading}>
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>

      <p className="auth-form__switch">
        Pas encore de compte ?{" "}
        <button type="button" className="auth-form__switch-link" onClick={() => onSwitchTab("register")}>Créer un compte</button>
      </p>
    </form>
  );
}

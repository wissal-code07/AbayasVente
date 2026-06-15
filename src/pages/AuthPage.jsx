import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "./AuthPage.css";

export default function AuthPage({ navigate, defaultTab = "login", onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-page__pattern" />
      <div className="auth-page__ornament" />

      <div className="auth-page__card">
        <button className="auth-page__logo" onClick={() => navigate("home")}>
          Abayas<span>Vente</span>
        </button>
        <p className="auth-page__tagline">Votre espace exclusif</p>

        <div className="auth-page__tabs">
          <button className={`auth-page__tab ${activeTab === "login" ? "auth-page__tab--active" : ""}`} onClick={() => setActiveTab("login")}>Connexion</button>
          <button className={`auth-page__tab ${activeTab === "register" ? "auth-page__tab--active" : ""}`} onClick={() => setActiveTab("register")}>Inscription</button>
          <div className={`auth-page__tab-indicator auth-page__tab-indicator--${activeTab}`} />
        </div>

        <div className="auth-page__form-wrap">
          {activeTab === "login" ? (
            <LoginForm onSwitchTab={setActiveTab} navigate={navigate} onLoginSuccess={onLoginSuccess} />
          ) : (
            <RegisterForm onSwitchTab={setActiveTab} navigate={navigate} onLoginSuccess={onLoginSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}

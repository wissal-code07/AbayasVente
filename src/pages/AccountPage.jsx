import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import AccountSidebar from "../components/account/AccountSidebar";
import AccountDashboard from "../components/account/AccountDashboard";
import AccountOrders from "../components/account/AccountOrders";
import AccountAddresses from "../components/account/AccountAddresses";
import AccountProfile from "../components/account/AccountProfile";
import "./AccountPage.css";

export default function AccountPage({ navigate, onLogout }) {
  const { user, setUser } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Rafraîchir les données utilisateur depuis l'API au montage
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        // Mettre à jour le contexte avec les données complètes (y compris adresses)
        setUser({ ...user, ...profile });
      } catch (err) {
        console.error("Erreur chargement profil", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserProfile();
    else setLoading(false);
  }, []);

  // Si pas connecté → rediriger vers login
  if (!user && !loading) {
    navigate("login");
    return null;
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "orders":    return <AccountOrders    navigate={navigate} />;
      case "addresses": return <AccountAddresses />;
      case "profile":   return <AccountProfile   />;
      default:          return <AccountDashboard user={user} setActiveSection={setActiveSection} />;
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("home");
  };

  return (
    <div className="account-page">
      <div className="account-page__hero">
        <span className="account-page__tag">Espace Personnel</span>
        <h1 className="account-page__title">Mon <em>Compte</em></h1>
        <div className="account-page__line" />
      </div>
      <div className="account-page__layout">
        <AccountSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={{ ...user, avatar: `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` }}
          navigate={navigate}
          onLogout={handleLogout}
        />
        <div className="account-page__content">{renderSection()}</div>
      </div>
    </div>
  );
}
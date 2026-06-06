import { useState } from "react";
import AccountSidebar from "../components/account/AccountSidebar";
import AccountDashboard from "../components/account/AccountDashboard";
import AccountOrders from "../components/account/AccountOrders";
import AccountAddresses from "../components/account/AccountAddresses";
import AccountProfile from "../components/account/AccountProfile";
import { mockUser } from "../data/accountData";
import "./AccountPage.css";

export default function AccountPage({ navigate }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "orders":    return <AccountOrders    navigate={navigate} />;
      case "addresses": return <AccountAddresses />;
      case "profile":   return <AccountProfile   />;
      case "dashboard":
      default:          return <AccountDashboard user={mockUser} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-page__hero">
        <span className="account-page__tag">Espace Personnel</span>
        <h1 className="account-page__title">Mon <em>Compte</em></h1>
        <div className="account-page__line" />
      </div>

      {/* Layout */}
      <div className="account-page__layout">
        <AccountSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={mockUser}
          navigate={navigate}
        />
        <div className="account-page__content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

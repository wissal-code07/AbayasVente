import "./AccountSidebar.css";

const MENU_ITEMS = [
  { key: "dashboard",  icon: "◈", label: "Tableau de bord" },
  { key: "orders",     icon: "◻", label: "Mes commandes"   },
  { key: "addresses",  icon: "◇", label: "Mes adresses"    },
  { key: "profile",    icon: "◯", label: "Mon profil"      },
];

export default function AccountSidebar({ activeSection, setActiveSection, user, navigate }) {
  return (
    <aside className="account-sidebar">
      {/* Avatar */}
      <div className="account-sidebar__user">
        <div className="account-sidebar__avatar">{user.avatar}</div>
        <div className="account-sidebar__user-info">
          <p className="account-sidebar__name">{user.firstName} {user.lastName}</p>
          <p className="account-sidebar__email">{user.email}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="account-sidebar__nav">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`account-sidebar__item ${activeSection === item.key ? "account-sidebar__item--active" : ""}`}
            onClick={() => setActiveSection(item.key)}
          >
            <span className="account-sidebar__item-icon">{item.icon}</span>
            <span className="account-sidebar__item-label">{item.label}</span>
            <span className="account-sidebar__item-arrow">›</span>
          </button>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="account-sidebar__footer">
        <button
          className="account-sidebar__logout"
          onClick={() => navigate("home")}
        >
          ← Se déconnecter
        </button>
      </div>
    </aside>
  );
}

import "./AdminSidebar.css";

const MENU = [
  { key: "dashboard", icon: "◈", label: "Dashboard"    },
  { key: "products",  icon: "◻", label: "Produits"     },
  { key: "orders",    icon: "📦", label: "Commandes"   },
  { key: "clients",   icon: "👥", label: "Clients"     },
  { key: "stats",     icon: "📊", label: "Statistiques"},
  { key: "profile",   icon: "👤", label: "Mon Profil"  },
];

export default function AdminSidebar({ active, setActive, navigate }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__brand-logo">AV</div>
        <div>
          <p className="admin-sidebar__brand-name">Abayas Vente</p>
          <p className="admin-sidebar__brand-role">Administration</p>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        {MENU.map((item) => (
          <button
            key={item.key}
            className={`admin-sidebar__item ${active === item.key ? "admin-sidebar__item--active" : ""}`}
            onClick={() => setActive(item.key)}>
            <span className="admin-sidebar__item-icon">{item.icon}</span>
            <span className="admin-sidebar__item-label">{item.label}</span>
            {active === item.key && <span className="admin-sidebar__item-dot" />}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <button className="admin-sidebar__back" onClick={() => navigate("home")}>
          ← Retour au site
        </button>
      </div>
    </aside>
  );
}
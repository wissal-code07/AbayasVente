import { mockOrders, STATUS_LABELS } from "../../data/accountData";
import "./AccountDashboard.css";

export default function AccountDashboard({ user, setActiveSection }) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const totalSpent   = mockOrders.filter(o => o.status === "livré").reduce((s, o) => s + o.total, 0);
  const totalOrders  = mockOrders.length;
  const pendingOrders = mockOrders.filter(o => o.status === "en_cours").length;
  const recentOrders = mockOrders.slice(0, 3);

  const stats = [
    { icon: "◻", label: "Commandes",        value: totalOrders,           sub: "au total" },
    { icon: "⏳", label: "En cours",          value: pendingOrders,         sub: "en livraison" },
    { icon: "✦", label: "Total dépensé",     value: formatPrice(totalSpent), sub: "depuis l'inscription" },
    { icon: "◈", label: "Membre depuis",     value: user.joinDate,          sub: "fidèle cliente" },
  ];

  return (
    <div className="account-dashboard">
      {/* Welcome */}
      <div className="account-dashboard__welcome">
        <h2 className="account-dashboard__title">
          Bonjour, <em>{user.firstName}</em> 👋
        </h2>
        <p className="account-dashboard__subtitle">
          Bienvenue dans votre espace personnel Abayas Vente.
        </p>
      </div>

      {/* Stats */}
      <div className="account-dashboard__stats">
        {stats.map((stat) => (
          <div className="account-dashboard__stat" key={stat.label}>
            <span className="account-dashboard__stat-icon">{stat.icon}</span>
            <span className="account-dashboard__stat-value">{stat.value}</span>
            <span className="account-dashboard__stat-label">{stat.label}</span>
            <span className="account-dashboard__stat-sub">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="account-dashboard__section">
        <div className="account-dashboard__section-header">
          <h3 className="account-dashboard__section-title">Commandes récentes</h3>
          <button
            className="account-dashboard__see-all"
            onClick={() => setActiveSection("orders")}
          >
            Voir tout →
          </button>
        </div>

        <div className="account-dashboard__orders">
          {recentOrders.map((order) => {
            const status = STATUS_LABELS[order.status];
            return (
              <div className="account-dashboard__order" key={order.id}>
                <div className="account-dashboard__order-left">
                  <p className="account-dashboard__order-id">{order.id}</p>
                  <p className="account-dashboard__order-date">{order.date}</p>
                  <p className="account-dashboard__order-items">
                    {order.items.length} article{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="account-dashboard__order-right">
                  <span
                    className="account-dashboard__order-status"
                    style={{ color: status.color, borderColor: status.color }}
                  >
                    {status.label}
                  </span>
                  <span className="account-dashboard__order-total">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/orderService";
import "./AccountDashboard.css";

const STATUS_LABELS = {
  pending:   { label: "En attente",  color: "#C9A84C" },
  confirmed: { label: "Confirmée",   color: "#4488cc" },
  shipped:   { label: "Expédiée",    color: "#4488cc" },
  delivered: { label: "Livrée",      color: "#44aa66" },
  cancelled: { label: "Annulée",     color: "#cc4444" },
};

export default function AccountDashboard({ user, setActiveSection }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="account-dashboard"><p>Chargement...</p></div>;

  const totalSpent   = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const totalOrders  = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;
  const recentOrders = orders.slice(0, 3);

  const stats = [
    { icon: "◻", label: "Commandes",        value: totalOrders,           sub: "au total" },
    { icon: "⏳", label: "En cours",          value: pendingOrders,         sub: "en livraison" },
    { icon: "✦", label: "Total dépensé",     value: formatPrice(totalSpent), sub: "depuis l'inscription" },
    { icon: "◈", label: "Membre depuis",     value: user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "Nouveau", sub: "fidèle cliente" },
  ];

  return (
    <div className="account-dashboard">
      {/* Welcome */}
      <div className="account-dashboard__welcome">
        <h2 className="account-dashboard__title">
          Bonjour, <em>{user?.firstName || user?.first_name}</em> 👋
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
            const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <div className="account-dashboard__order" key={order.id}>
                <div className="account-dashboard__order-left">
                  <p className="account-dashboard__order-id">{order.order_number}</p>
                  <p className="account-dashboard__order-date">{new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
                  <p className="account-dashboard__order-items">
                    {order.items?.length || 0} article{order.items?.length > 1 ? "s" : ""}
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
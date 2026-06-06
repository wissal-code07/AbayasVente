import { adminStats, revenueData, adminOrders, STATUS_COLORS } from "../../data/adminData";
import "./AdminDashboard.css";

export default function AdminDashboard({ setActive }) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";
  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="admin-dashboard">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Dashboard</h2>
        <p className="admin-section__date">Aujourd'hui — Samedi 06 Juin 2025</p>
      </div>

      {/* Stats cards */}
      <div className="admin-dashboard__stats">
        {[
          { label: "Chiffre d'affaires", ...adminStats.revenue, icon: "✦" },
          { label: "Commandes",          ...adminStats.orders,  icon: "◻" },
          { label: "Clients",            ...adminStats.clients, icon: "◯" },
          { label: "Panier moyen",       ...adminStats.avgOrder,icon: "◈" },
        ].map((stat) => (
          <div key={stat.label} className="admin-dashboard__stat">
            <div className="admin-dashboard__stat-top">
              <span className="admin-dashboard__stat-icon">{stat.icon}</span>
              <span className={`admin-dashboard__stat-change ${stat.up ? "up" : "down"}`}>
                {stat.up ? "↑" : "↓"} {stat.change}
              </span>
            </div>
            <p className="admin-dashboard__stat-value">{stat.value}</p>
            <p className="admin-dashboard__stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="admin-dashboard__chart-block">
        <div className="admin-block__header">
          <h3 className="admin-block__title">Revenus — 7 derniers jours</h3>
        </div>
        <div className="admin-dashboard__chart">
          {revenueData.map((d) => (
            <div key={d.day} className="admin-dashboard__bar-wrap">
              <span className="admin-dashboard__bar-val">
                {(d.value / 1000).toFixed(0)}k
              </span>
              <div
                className="admin-dashboard__bar"
                style={{ height: `${(d.value / maxRevenue) * 100}%` }}
              />
              <span className="admin-dashboard__bar-day">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="admin-dashboard__recent">
        <div className="admin-block__header">
          <h3 className="admin-block__title">Commandes récentes</h3>
          <button className="admin-block__see-all" onClick={() => setActive("orders")}>
            Voir tout →
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Date</th>
              <th>Wilaya</th>
              <th>Statut</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {adminOrders.slice(0, 5).map((order) => {
              const s = STATUS_COLORS[order.status];
              return (
                <tr key={order.id}>
                  <td className="admin-table__id">{order.id}</td>
                  <td>{order.client}</td>
                  <td className="admin-table__muted">{order.date}</td>
                  <td className="admin-table__muted">{order.wilaya}</td>
                  <td>
                    <span className="admin-table__badge" style={{ color: s.color, background: s.bg }}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="admin-table__price">{formatPrice(order.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
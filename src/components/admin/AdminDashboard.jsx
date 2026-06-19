import { useState, useEffect } from "react";
import { getAdminStats, getRevenueData, getAdminOrders } from "../../services/adminService";
import "./AdminDashboard.css";

export default function AdminDashboard({ setActive }) {
  const [stats, setStats] = useState({ revenue: null, orders: null, clients: null, avgOrder: null });
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getRevenueData(),
          getAdminOrders({ limit: 5 })
        ]);
        setStats({
          revenue: statsRes.revenue || { value: "0 DA", change: "0%", up: true },
          orders: statsRes.orders || { value: 0, change: "0%", up: true },
          clients: statsRes.clients || { value: 0, change: "0%", up: true },
          avgOrder: statsRes.avgOrder || { value: "0 DA", change: "0%", up: true }
        });
        setRevenueData(revenueRes);
        const recent = Array.isArray(ordersRes) ? ordersRes : ordersRes.results || [];
        setRecentOrders(recent);
      } catch (err) {
        console.error("Erreur chargement dashboard admin", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-dashboard">Chargement...</div>;

  const maxRevenue = Math.max(...revenueData.map(d => d.value), 0);

  return (
    <div className="admin-dashboard">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Dashboard</h2>
        <p className="admin-section__date">{new Date().toLocaleDateString("fr-FR")}</p>
      </div>

      <div className="admin-dashboard__stats">
        {[
          { label: "Chiffre d'affaires", ...stats.revenue, icon: "✦" },
          { label: "Commandes",          ...stats.orders,  icon: "◻" },
          { label: "Clients",            ...stats.clients, icon: "◯" },
          { label: "Panier moyen",       ...stats.avgOrder,icon: "◈" },
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

      {revenueData.length > 0 && (
        <div className="admin-dashboard__chart-block">
          <div className="admin-block__header">
            <h3 className="admin-block__title">Revenus — 7 derniers jours</h3>
          </div>
          <div className="admin-dashboard__chart">
            {revenueData.map((d) => (
              <div key={d.day} className="admin-dashboard__bar-wrap">
                <span className="admin-dashboard__bar-val">{(d.value/1000).toFixed(0)}k</span>
                <div className="admin-dashboard__bar" style={{ height: `${(d.value / maxRevenue) * 100}%` }} />
                <span className="admin-dashboard__bar-day">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-dashboard__recent">
        <div className="admin-block__header">
          <h3 className="admin-block__title">Commandes récentes</h3>
          <button className="admin-block__see-all" type="button" onClick={() => setActive("orders")}>Voir tout →</button>
        </div>
        <div className="admin-table-wrap">
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
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.shipping_name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.shipping_wilaya}</td>
                  <td><span className="status-badge">{order.status}</span></td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
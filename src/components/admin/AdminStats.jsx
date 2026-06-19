// src/components/admin/AdminStats.jsx
import { useState, useEffect } from "react";
import { getAdminStats, getRevenueData, getAdminOrders, getAdminProducts, getAdminClients } from "../../services/adminService";
import "./AdminStats.css";

export default function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, ordersRes, productsRes, clientsRes] = await Promise.all([
          getAdminStats(),
          getRevenueData(),
          getAdminOrders({ limit: 1000 }), // on prend beaucoup pour avoir toutes les commandes
          getAdminProducts({ limit: 1000 }),
          getAdminClients({ limit: 1000 })
        ]);

        setStats(statsRes);
        setRevenueData(revenueRes);
        setOrders(Array.isArray(ordersRes) ? ordersRes : ordersRes.results || []);
        setProducts(Array.isArray(productsRes) ? productsRes : productsRes.results || []);
        setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.results || []);
      } catch (err) {
        console.error("Erreur chargement stats", err);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-stats"><p>Chargement des statistiques...</p></div>;
  if (error) return <div className="admin-stats"><p className="error">{error}</p></div>;

  // ─── Calculs ───
  // Revenus totaux de la semaine (à partir de revenueData)
  const totalRevenue = revenueData.reduce((s, d) => s + d.value, 0);
  const totalOrders = orders.length;
  const totalClients = clients.length;

  // Taux de livraison : commandes livrées / total
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const deliveryRate = totalOrders ? ((delivered / totalOrders) * 100).toFixed(1) + "%" : "0%";

  // Statuts commandes
  const statusCounts = {
    pending:    orders.filter(o => o.status === 'pending').length,
    confirmed:  orders.filter(o => o.status === 'confirmed').length,
    shipped:    orders.filter(o => o.status === 'shipped').length,
    delivered:  delivered,
    cancelled:  orders.filter(o => o.status === 'cancelled').length,
  };
  const statusColors = {
    pending: "#C9A84C",
    confirmed: "#4488cc",
    shipped: "#4488cc",
    delivered: "#44aa66",
    cancelled: "#cc4444"
  };

  // Catégories
  const categories = ["Classique", "Soirée", "Moderne", "Premium"];
  const catData = categories.map(cat => {
    const prods = products.filter(p => p.category === cat);
    const count = prods.length;
    const revenue = prods.reduce((s, p) => s + (p.sold || 0) * p.price, 0);
    return { name: cat, count, revenue };
  });
  const maxCatRevenue = Math.max(...catData.map(c => c.revenue), 0);

  // Top 5 produits par ventes
  const topProducts = [...products]
    .filter(p => p.sold > 0)
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  // Revenu max pour le graphique
  const maxRevenue = Math.max(...revenueData.map(d => d.value), 0);

  return (
    <div className="admin-stats">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Statistiques</h2>
        <p className="admin-section__date">{new Date().toLocaleDateString("fr-FR")}</p>
      </div>

      {/* KPIs */}
      <div className="admin-stats__kpis">
        {[
          { label: "CA Semaine",    value: formatPrice(totalRevenue), icon: "✦", color: "var(--gold)" },
          { label: "Commandes",     value: totalOrders,               icon: "◻", color: "#4488cc"    },
          { label: "Clients",       value: totalClients,              icon: "◯", color: "#44aa66"    },
          { label: "Taux livraison", value: deliveryRate,             icon: "◈", color: "#44aa66"    },
        ].map(k => (
          <div key={k.label} className="admin-stats__kpi">
            <span className="admin-stats__kpi-icon" style={{color: k.color}}>{k.icon}</span>
            <span className="admin-stats__kpi-value" style={{color: k.color}}>{k.value}</span>
            <span className="admin-stats__kpi-label">{k.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-stats__grid">
        {/* Revenue chart */}
        <div className="admin-stats__block admin-stats__block--wide">
          <div className="admin-block__header">
            <h3 className="admin-block__title">Revenus journaliers</h3>
            <span style={{fontSize:"11px",color:"var(--text-muted)"}}>{formatPrice(totalRevenue)} cette semaine</span>
          </div>
          <div className="admin-stats__chart">
            {revenueData.map(d => (
              <div key={d.day} className="admin-stats__bar-wrap">
                <span className="admin-stats__bar-val">{(d.value/1000).toFixed(0)}k</span>
                <div
                  className="admin-stats__bar"
                  style={{height: maxRevenue ? `${(d.value/maxRevenue)*140}px` : 0}}
                />
                <span className="admin-stats__bar-day">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="admin-stats__block">
          <div className="admin-block__header">
            <h3 className="admin-block__title">Statuts commandes</h3>
          </div>
          <div className="admin-stats__donut-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="admin-stats__donut-row">
                <div className="admin-stats__donut-bar-wrap">
                  <span className="admin-stats__donut-label">
                    {status === 'pending' && 'En attente'}
                    {status === 'confirmed' && 'Confirmée'}
                    {status === 'shipped' && 'Expédiée'}
                    {status === 'delivered' && 'Livrée'}
                    {status === 'cancelled' && 'Annulée'}
                  </span>
                  <div className="admin-stats__donut-bar-bg">
                    <div
                      className="admin-stats__donut-bar-fill"
                      style={{
                        width: totalOrders ? `${(count / totalOrders) * 100}%` : 0,
                        background: statusColors[status] || '#666',
                      }}
                    />
                  </div>
                </div>
                <span className="admin-stats__donut-count" style={{color: statusColors[status] || '#666'}}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category revenue */}
        <div className="admin-stats__block">
          <div className="admin-block__header">
            <h3 className="admin-block__title">Revenus par catégorie</h3>
          </div>
          <div className="admin-stats__cats">
            {catData.map(cat => (
              <div key={cat.name} className="admin-stats__cat-row">
                <div className="admin-stats__cat-info">
                  <span className="admin-stats__cat-name">{cat.name}</span>
                  <span className="admin-stats__cat-count">{cat.count} produits</span>
                </div>
                <div className="admin-stats__cat-bar-bg">
                  <div
                    className="admin-stats__cat-bar-fill"
                    style={{
                      width: maxCatRevenue ? `${(cat.revenue / maxCatRevenue) * 100}%` : 0
                    }}
                  />
                </div>
                <span className="admin-stats__cat-revenue">{formatPrice(cat.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="admin-stats__block admin-stats__block--wide">
          <div className="admin-block__header">
            <h3 className="admin-block__title">Top 5 produits vendus</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Vendus</th><th>CA généré</th></tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:"center"}}>Aucun produit vendu</td></tr>
              ) : (
                topProducts.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{color:"var(--gold)",fontFamily:"'Cormorant Garamond',serif",fontSize:"18px"}}>{i+1}</td>
                    <td>{p.name}</td>
                    <td className="admin-table__muted">{p.category}</td>
                    <td className="admin-table__price">{formatPrice(p.price)}</td>
                    <td className="admin-table__muted">{p.sold || 0}</td>
                    <td className="admin-table__price">{formatPrice((p.sold || 0) * p.price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
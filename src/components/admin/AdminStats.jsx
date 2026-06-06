import { adminProducts, adminOrders, adminClients, revenueData } from "../../data/adminData";
import "./AdminStats.css";

export default function AdminStats() {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";
  const maxRevenue  = Math.max(...revenueData.map(d => d.value));

  // Category breakdown
  const categories = ["Classique","Soirée","Moderne","Premium"];
  const catData = categories.map(cat => ({
    name: cat,
    count: adminProducts.filter(p => p.category === cat).length,
    revenue: adminProducts.filter(p => p.category === cat).reduce((s, p) => s + p.price * p.sold, 0),
  }));
  const maxCatRevenue = Math.max(...catData.map(c => c.revenue));

  // Order status breakdown
  const statusCounts = {
    "livré":    adminOrders.filter(o => o.status === "livré").length,
    "expédié":  adminOrders.filter(o => o.status === "expédié").length,
    "en_cours": adminOrders.filter(o => o.status === "en_cours").length,
    "annulé":   adminOrders.filter(o => o.status === "annulé").length,
  };
  const statusColors = { "livré":"#44aa66","expédié":"#4488cc","en_cours":"#C9A84C","annulé":"#cc4444" };

  // Top products by sales
  const topProducts = [...adminProducts].sort((a, b) => b.sold - a.sold).slice(0, 5);

  const totalRevenue = revenueData.reduce((s, d) => s + d.value, 0);
  const totalOrders  = adminOrders.length;
  const totalClients = adminClients.length;

  return (
    <div className="admin-stats">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Statistiques</h2>
        <p className="admin-section__date">Période : Mai 2025</p>
      </div>

      {/* KPIs */}
      <div className="admin-stats__kpis">
        {[
          { label: "CA Semaine",    value: formatPrice(totalRevenue), icon: "✦", color: "var(--gold)" },
          { label: "Commandes",     value: totalOrders,               icon: "◻", color: "#4488cc"    },
          { label: "Clients",       value: totalClients,              icon: "◯", color: "#44aa66"    },
          { label: "Taux livraison", value: "87.5%",                  icon: "◈", color: "#44aa66"    },
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
                <div className="admin-stats__bar" style={{height:`${(d.value/maxRevenue)*140}px`}} />
                <span className="admin-stats__bar-day">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status donut */}
        <div className="admin-stats__block">
          <div className="admin-block__header">
            <h3 className="admin-block__title">Statuts commandes</h3>
          </div>
          <div className="admin-stats__donut-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="admin-stats__donut-row">
                <div className="admin-stats__donut-bar-wrap">
                  <span className="admin-stats__donut-label">{status.replace("_"," ")}</span>
                  <div className="admin-stats__donut-bar-bg">
                    <div
                      className="admin-stats__donut-bar-fill"
                      style={{
                        width: `${(count / totalOrders) * 100}%`,
                        background: statusColors[status],
                      }}
                    />
                  </div>
                </div>
                <span className="admin-stats__donut-count" style={{color: statusColors[status]}}>
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
                    style={{ width: `${(cat.revenue / maxCatRevenue) * 100}%` }}
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
              {topProducts.map((p, i) => (
                <tr key={p.id}>
                  <td style={{color:"var(--gold)",fontFamily:"'Cormorant Garamond',serif",fontSize:"18px"}}>{i+1}</td>
                  <td>{p.name}</td>
                  <td className="admin-table__muted">{p.category}</td>
                  <td className="admin-table__price">{formatPrice(p.price)}</td>
                  <td className="admin-table__muted">{p.sold}</td>
                  <td className="admin-table__price">{formatPrice(p.price * p.sold)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
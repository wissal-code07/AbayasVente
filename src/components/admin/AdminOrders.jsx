import { useState } from "react";
import { adminOrders, STATUS_COLORS } from "../../data/adminData";
import "./AdminOrders.css";

const ALL_STATUSES = ["tous", "en_cours", "expédié", "livré", "annulé"];

export default function AdminOrders() {
  const [orders, setOrders]   = useState(adminOrders);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("tous");
  const [selected, setSelected] = useState(null);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.includes(search) ||
                        o.client.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  if (selected) {
    const s = STATUS_COLORS[selected.status];
    return (
      <div className="admin-orders">
        <button className="admin-back-btn" onClick={() => setSelected(null)}>
          ← Retour aux commandes
        </button>

        <div className="admin-orders__detail">
          <div className="admin-orders__detail-header">
            <div>
              <h2 className="admin-section__title">{selected.id}</h2>
              <p className="admin-table__muted">{selected.date} — {selected.wilaya}</p>
            </div>
            <div className="admin-orders__detail-status">
              <span className="admin-table__badge" style={{ color: s.color, background: s.bg }}>
                {selected.status.replace("_"," ")}
              </span>
            </div>
          </div>

          <div className="admin-orders__detail-grid">
            <div className="admin-orders__detail-block">
              <p className="admin-form__label" style={{marginBottom:"12px"}}>Client</p>
              <p style={{fontSize:"16px",color:"var(--text)"}}>{selected.client}</p>
            </div>
            <div className="admin-orders__detail-block">
              <p className="admin-form__label" style={{marginBottom:"12px"}}>Total</p>
              <p className="admin-table__price">{formatPrice(selected.total)}</p>
            </div>
            <div className="admin-orders__detail-block">
              <p className="admin-form__label" style={{marginBottom:"12px"}}>Articles</p>
              <p style={{fontSize:"14px",color:"var(--text-muted)"}}>{selected.items} article{selected.items>1?"s":""}</p>
            </div>
          </div>

          <div className="admin-orders__status-update">
            <p className="admin-form__label" style={{marginBottom:"12px"}}>Mettre à jour le statut</p>
            <div className="admin-orders__status-btns">
              {["en_cours","expédié","livré","annulé"].map(st => {
                const sc = STATUS_COLORS[st];
                return (
                  <button
                    key={st}
                    className={`admin-orders__status-btn ${selected.status === st ? "admin-orders__status-btn--active" : ""}`}
                    style={selected.status === st ? { color: sc.color, borderColor: sc.color, background: sc.bg } : {}}
                    onClick={() => handleStatusChange(selected.id, st)}
                  >
                    {st.replace("_"," ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Gestion Commandes</h2>
        <p className="admin-section__date">{orders.length} commandes au total</p>
      </div>

      <div className="admin-products__controls">
        <input
          className="admin-search"
          type="text"
          placeholder="🔍  Rechercher par référence ou client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="admin-filter-tabs">
          {ALL_STATUSES.map(f => (
            <button
              key={f}
              className={`admin-filter-tab ${filter === f ? "admin-filter-tab--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "tous" ? "Tous" : f.replace("_"," ")}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Date</th>
              <th>Wilaya</th>
              <th>Articles</th>
              <th>Statut</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const s = STATUS_COLORS[order.status];
              return (
                <tr key={order.id}>
                  <td className="admin-table__id">{order.id}</td>
                  <td>{order.client}</td>
                  <td className="admin-table__muted">{order.date}</td>
                  <td className="admin-table__muted">{order.wilaya}</td>
                  <td className="admin-table__muted">{order.items}</td>
                  <td>
                    <span className="admin-table__badge" style={{ color: s.color, background: s.bg }}>
                      {order.status.replace("_"," ")}
                    </span>
                  </td>
                  <td className="admin-table__price">{formatPrice(order.total)}</td>
                  <td>
                    <button className="admin-table__btn" onClick={() => setSelected(order)}>
                      Détail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
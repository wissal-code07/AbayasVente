import { useState, useEffect } from "react";
import { getAdminOrders, updateOrderStatus } from "../../services/adminService";
import "./AdminOrders.css";

const STATUS_LABELS = {
  pending: { label: "En attente", color: "#C9A84C" },
  confirmed: { label: "Confirmée", color: "#4488cc" },
  shipped: { label: "Expédiée", color: "#4488cc" },
  delivered: { label: "Livrée", color: "#44aa66" },
  cancelled: { label: "Annulée", color: "#cc4444" },
};
const ALL_STATUSES = ["tous", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tous");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status: filter !== "tous" ? filter : undefined,
        page,
        page_size: 10,
      };
      const data = await getAdminOrders(params);
      const ordersArray = Array.isArray(data) ? data : data.results || [];
      setOrders(ordersArray);
      if (data.count) setTotalPages(Math.ceil(data.count / (params.page_size || 10)));
    } catch (err) {
      console.error("Erreur chargement commandes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, filter, page]);

  const handleStatusChange = async (e, id, newStatus) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders();
      if (selected?.id === id) setSelected({ ...selected, status: newStatus });
    } catch {
      alert("Erreur lors du changement de statut");
    }
  };

  if (loading && orders.length === 0) return <div className="admin-orders">Chargement...</div>;

  if (selected) {
    const s = STATUS_LABELS[selected.status] || STATUS_LABELS.pending;
    return (
      <div className="admin-orders">
        <button className="admin-back-btn" type="button" onClick={() => setSelected(null)}>← Retour</button>
        <div className="admin-orders__detail">
          <div className="admin-orders__detail-header">
            <div>
              <h2 className="admin-section__title">{selected.order_number}</h2>
              <p>{new Date(selected.created_at).toLocaleDateString()} — {selected.shipping_wilaya}</p>
            </div>
            <span className="admin-table__badge" style={{ color: s.color, background: `${s.color}22` }}>{s.label}</span>
          </div>
          <div className="admin-orders__detail-grid">
            <div><p className="admin-form__label">Client</p><p>{selected.shipping_name}</p></div>
            <div><p className="admin-form__label">Total</p><p className="admin-table__price">{formatPrice(selected.total)}</p></div>
            <div><p className="admin-form__label">Articles</p><p>{selected.items?.length || 0}</p></div>
          </div>
          <div className="admin-orders__status-update">
            <p className="admin-form__label">Changer le statut</p>
            <div className="admin-orders__status-btns">
              {ALL_STATUSES.filter(s => s !== "tous").map(st => {
                const sc = STATUS_LABELS[st];
                return (
                  <button
                    key={st}
                    type="button"
                    className={`admin-orders__status-btn ${selected.status === st ? "active" : ""}`}
                    style={selected.status === st ? { color: sc.color, borderColor: sc.color, background: `${sc.color}22` } : {}}
                    onClick={(e) => handleStatusChange(e, selected.id, st)}
                  >
                    {sc.label}
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
        <p className="admin-section__date">{orders.length} commandes</p>
      </div>
      <div className="admin-products__controls">
        <input className="admin-search" type="text" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="admin-filter-tabs">
          {ALL_STATUSES.map(f => (
            <button
              key={f}
              type="button"
              className={`admin-filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "tous" ? "Tous" : STATUS_LABELS[f]?.label || f}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Réf</th><th>Client</th><th>Date</th><th>Wilaya</th><th>Articles</th><th>Statut</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const s = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
              return (
                <tr key={order.id}>
                  <td className="admin-table__id">{order.order_number}</td>
                  <td>{order.shipping_name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.shipping_wilaya}</td>
                  <td>{order.items?.length || 0}</td>
                  <td><span className="admin-table__badge" style={{ color: s.color, background: `${s.color}22` }}>{s.label}</span></td>
                  <td className="admin-table__price">{formatPrice(order.total)}</td>
                  <td><button className="admin-table__btn" type="button" onClick={() => setSelected(order)}>Détail</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button type="button" disabled={page === 1} onClick={() => setPage(p => p-1)}>←</button>
          <span>Page {page} / {totalPages}</span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage(p => p+1)}>→</button>
        </div>
      )}
    </div>
  );
}
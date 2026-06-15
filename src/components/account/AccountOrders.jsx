import { useState, useEffect } from "react";
import { getOrders, cancelOrder } from "../../services/orderService";
import "./AccountOrders.css";

const STATUS_LABELS = {
  pending:   { label: "En attente",  color: "#C9A84C" },
  confirmed: { label: "Confirmée",   color: "#4488cc" },
  shipped:   { label: "Expédiée",    color: "#4488cc" },
  delivered: { label: "Livrée",      color: "#44aa66" },
  cancelled: { label: "Annulée",     color: "#cc4444" },
};

export default function AccountOrders({ navigate }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status: "cancelled" }));
    } catch { alert("Impossible d annuler cette commande."); }
  };

  if (loading) return <div className="acc-orders"><p>Chargement...</p></div>;

  if (selected) {
    const s = STATUS_LABELS[selected.status] || STATUS_LABELS.pending;
    return (
      <div className="acc-orders">
        <button className="acc-orders__back" onClick={() => setSelected(null)}>← Retour</button>
        <div className="acc-orders__detail">
          <div className="acc-orders__detail-header">
            <div>
              <h2 className="acc-orders__detail-id">{selected.order_number}</h2>
              <p className="acc-orders__detail-date">{new Date(selected.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <span className="acc-orders__status-badge" style={{ color: s.color, borderColor: s.color }}>{s.label}</span>
          </div>
          <div className="acc-orders__detail-items">
            <h3 className="acc-orders__detail-subtitle">Articles commandés</h3>
            {selected.items?.map((item, i) => (
              <div className="acc-orders__detail-item" key={i}>
                <div className="acc-orders__detail-item-thumb" />
                <div className="acc-orders__detail-item-info">
                  <p className="acc-orders__detail-item-name">{item.product_name}</p>
                  <p className="acc-orders__detail-item-opts">
                    {item.size && `Taille: ${item.size}`}
                    {item.color && ` · ${item.color}`}
                    {` · Qté: ${item.quantity}`}
                  </p>
                </div>
                <span className="acc-orders__detail-item-price">{formatPrice(item.product_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="acc-orders__detail-summary">
            <div className="acc-orders__detail-row"><span>Livraison</span><span>{selected.delivery_price == 0 ? "Gratuite" : formatPrice(selected.delivery_price)}</span></div>
            <div className="acc-orders__detail-divider" />
            <div className="acc-orders__detail-row acc-orders__detail-row--total"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
          </div>
          {["pending","confirmed"].includes(selected.status) && (
            <button className="btn btn--outline acc-orders__reorder" onClick={() => handleCancel(selected.id)}>Annuler la commande</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="acc-orders">
      <div className="acc-orders__header">
        <h2 className="acc-orders__title">Mes Commandes</h2>
        <p className="acc-orders__count">{orders.length} commande{orders.length > 1 ? "s" : ""}</p>
      </div>
      {orders.length === 0 ? (
        <div style={{textAlign:"center", padding:"60px", color:"var(--text-muted)"}}>
          <p>Vous n'avez pas encore de commandes.</p>
          <button className="btn btn--primary" onClick={() => navigate("catalogue")}>Voir la collection</button>
        </div>
      ) : (
        <div className="acc-orders__list">
          {orders.map((order) => {
            const s = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <div className="acc-orders__row" key={order.id} onClick={() => setSelected(order)}>
                <div className="acc-orders__row-main">
                  <div className="acc-orders__row-left">
                    <p className="acc-orders__row-id">{order.order_number}</p>
                    <p className="acc-orders__row-date">{new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="acc-orders__row-center">
                    {order.items?.slice(0,2).map((item, i) => (
                      <p key={i} className="acc-orders__row-item">{item.product_name} <span>x{item.quantity}</span></p>
                    ))}
                  </div>
                  <div className="acc-orders__row-right">
                    <span className="acc-orders__status-badge" style={{ color: s.color, borderColor: s.color }}>{s.label}</span>
                    <span className="acc-orders__row-total">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <span className="acc-orders__row-arrow">→</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
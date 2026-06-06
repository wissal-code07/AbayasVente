import { useState } from "react";
import { mockOrders, STATUS_LABELS } from "../../data/accountData";
import "./AccountOrders.css";

export default function AccountOrders({ navigate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  if (selectedOrder) {
    const status = STATUS_LABELS[selectedOrder.status];
    return (
      <div className="acc-orders">
        <button className="acc-orders__back" onClick={() => setSelectedOrder(null)}>
          ← Retour aux commandes
        </button>

        <div className="acc-orders__detail">
          {/* Header */}
          <div className="acc-orders__detail-header">
            <div>
              <h2 className="acc-orders__detail-id">{selectedOrder.id}</h2>
              <p className="acc-orders__detail-date">Passée le {selectedOrder.date}</p>
            </div>
            <span
              className="acc-orders__status-badge"
              style={{ color: status.color, borderColor: status.color }}
            >
              {status.label}
            </span>
          </div>

          {/* Items */}
          <div className="acc-orders__detail-items">
            <h3 className="acc-orders__detail-subtitle">Articles commandés</h3>
            {selectedOrder.items.map((item, i) => (
              <div className="acc-orders__detail-item" key={i}>
                <div className="acc-orders__detail-item-thumb" />
                <div className="acc-orders__detail-item-info">
                  <p className="acc-orders__detail-item-name">{item.name}</p>
                  <p className="acc-orders__detail-item-opts">
                    Taille : {item.size} &nbsp;·&nbsp; Couleur : {item.color} &nbsp;·&nbsp; Qté : {item.qty}
                  </p>
                </div>
                <span className="acc-orders__detail-item-price">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="acc-orders__detail-summary">
            <div className="acc-orders__detail-row">
              <span>Sous-total</span>
              <span>{formatPrice(selectedOrder.total)}</span>
            </div>
            <div className="acc-orders__detail-row">
              <span>Livraison</span>
              <span className="acc-orders__free">Gratuite</span>
            </div>
            <div className="acc-orders__detail-divider" />
            <div className="acc-orders__detail-row acc-orders__detail-row--total">
              <span>Total</span>
              <span>{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>

          {/* Actions */}
          {selectedOrder.status === "livré" && (
            <button className="btn btn--outline acc-orders__reorder" onClick={() => navigate("catalogue")}>
              Commander à nouveau
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="acc-orders">
      <div className="acc-orders__header">
        <h2 className="acc-orders__title">Mes Commandes</h2>
        <p className="acc-orders__count">{mockOrders.length} commandes</p>
      </div>

      <div className="acc-orders__list">
        {mockOrders.map((order) => {
          const status = STATUS_LABELS[order.status];
          return (
            <div
              className="acc-orders__row"
              key={order.id}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="acc-orders__row-main">
                <div className="acc-orders__row-left">
                  <p className="acc-orders__row-id">{order.id}</p>
                  <p className="acc-orders__row-date">{order.date}</p>
                </div>
                <div className="acc-orders__row-center">
                  {order.items.map((item, i) => (
                    <p key={i} className="acc-orders__row-item">
                      {item.name} <span>× {item.qty}</span>
                    </p>
                  ))}
                </div>
                <div className="acc-orders__row-right">
                  <span
                    className="acc-orders__status-badge"
                    style={{ color: status.color, borderColor: status.color }}
                  >
                    {status.label}
                  </span>
                  <span className="acc-orders__row-total">{formatPrice(order.total)}</span>
                </div>
              </div>
              <span className="acc-orders__row-arrow">›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

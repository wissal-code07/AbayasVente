import "./CheckoutConfirmation.css";

export default function CheckoutConfirmation({ orderData, navigate }) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const orderNumber = orderData.orderNumber || `CMD-${Math.floor(Math.random() * 9000) + 1000}`;
  const total = orderData.cart.reduce((s, i) => s + i.price * i.quantity, 0)
              + (orderData.deliveryOption?.price || 0);

  const paymentLabels = {
    cod:      "Paiement à la livraison",
    card:     "Carte bancaire CIB / Dahabia",
    virement: "Virement bancaire",
  };

  return (
    <div className="checkout-confirmation">
      {/* Success icon */}
      <div className="checkout-confirmation__icon">✓</div>

      <h1 className="checkout-confirmation__title">
        Commande <em>confirmée</em> !
      </h1>
      <p className="checkout-confirmation__subtitle">
        Merci pour votre commande. Vous recevrez bientôt une confirmation par email.
      </p>

      {/* Order number */}
      <div className="checkout-confirmation__order-num">
        <span className="checkout-confirmation__order-label">Numéro de commande</span>
        <span className="checkout-confirmation__order-value">{orderNumber}</span>
      </div>

      {/* Details */}
      <div className="checkout-confirmation__details">
        {/* Address */}
        <div className="checkout-confirmation__detail-block">
          <p className="checkout-confirmation__detail-title">Adresse de livraison</p>
          {orderData.address && (
            <div className="checkout-confirmation__detail-content">
              <p>{orderData.address.firstName} {orderData.address.lastName}</p>
              <p>{orderData.address.address}</p>
              <p>{orderData.address.city}, {orderData.address.wilaya}</p>
              <p>{orderData.address.phone}</p>
            </div>
          )}
        </div>

        {/* Delivery */}
        <div className="checkout-confirmation__detail-block">
          <p className="checkout-confirmation__detail-title">Mode de livraison</p>
          <div className="checkout-confirmation__detail-content">
            <p>{orderData.deliveryOption?.icon} {orderData.deliveryOption?.label}</p>
            <p className="checkout-confirmation__detail-sub">{orderData.deliveryOption?.delay}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="checkout-confirmation__detail-block">
          <p className="checkout-confirmation__detail-title">Mode de paiement</p>
          <div className="checkout-confirmation__detail-content">
            <p>{paymentLabels[orderData.paymentId]}</p>
          </div>
        </div>

        {/* Total */}
        <div className="checkout-confirmation__detail-block">
          <p className="checkout-confirmation__detail-title">Total payé</p>
          <div className="checkout-confirmation__detail-content">
            <p className="checkout-confirmation__total">{formatPrice(total)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="checkout-confirmation__items">
        <p className="checkout-confirmation__items-title">Articles commandés</p>
        {orderData.cart.map((item, i) => (
          <div className="checkout-confirmation__item" key={i}>
            <span className="checkout-confirmation__item-name">{item.name}</span>
            <span className="checkout-confirmation__item-opts">
              {item.selectedSize && `Taille ${item.selectedSize}`}
              {item.selectedColor && ` · ${item.selectedColor}`}
              {` · Qté ${item.quantity}`}
            </span>
            <span className="checkout-confirmation__item-price">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="checkout-confirmation__actions">
        <button className="btn btn--primary" onClick={() => navigate("account")}>
          Suivre ma commande
        </button>
        <button className="btn btn--outline" onClick={() => navigate("catalogue")}>
          Continuer mes achats
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import "./CartSidebar.css";

export default function CartSidebar({ cart, isOpen, onClose, onRemove, onUpdateQuantity, navigate }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "cart-overlay--visible" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`cart-sidebar ${isOpen ? "cart-sidebar--open" : ""}`}>
        {/* Header */}
        <div className="cart-sidebar__header">
          <div className="cart-sidebar__title-wrap">
            <h2 className="cart-sidebar__title">Mon Panier</h2>
            {cart.length > 0 && (
              <span className="cart-sidebar__count">
                {cart.reduce((s, i) => s + i.quantity, 0)} article{cart.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <button className="cart-sidebar__close" onClick={onClose} aria-label="Fermer le panier">
            ✕
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="cart-sidebar__empty">
            <div className="cart-sidebar__empty-icon">🛍</div>
            <p className="cart-sidebar__empty-title">Votre panier est vide</p>
            <p className="cart-sidebar__empty-desc">
              Découvrez notre collection et ajoutez vos pièces préférées.
            </p>
            <button
              className="btn btn--primary cart-sidebar__empty-btn"
              onClick={() => { onClose(); navigate("catalogue"); }}
            >
              Voir la collection
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="cart-sidebar__items">
              {cart.map((item, index) => (
                <CartItem
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  item={item}
                  index={index}
                  onRemove={onRemove}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>

            {/* Continue shopping */}
            <button
              className="cart-sidebar__continue"
              onClick={() => { onClose(); navigate("catalogue"); }}
            >
              ← Continuer mes achats
            </button>

            {/* Summary */}
            <CartSummary cart={cart} navigate={navigate} onClose={onClose} />
          </>
        )}
      </aside>
    </>
  );
}
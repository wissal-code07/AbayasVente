// src/components/product/ProductInfo.jsx
// Remplacez votre fichier existant par celui-ci

import { useState } from "react";
import "./ProductInfo.css";

export default function ProductInfo({ product, onAddToCart }) {
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity,      setQuantity]      = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const discount = product.discount_percent;

  // Utiliser les données API (sizes et colors sont des objets)
  const sizes  = product.sizes  || [];
  const colors = product.colors || [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Veuillez choisir une taille.");
      return;
    }
    onAddToCart({
      ...product,
      selectedSize:  selectedSize,
      selectedColor: selectedColor,
      quantity,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="product-info">
      {/* Catégorie + nom */}
      <p className="product-info__category">{product.category?.name || product.category}</p>
      <h1 className="product-info__name">{product.name}</h1>

      {/* Prix */}
      <div className="product-info__pricing">
        <span className="product-info__price">{formatPrice(product.price)}</span>
        {product.old_price && (
          <>
            <span className="product-info__price-old">{formatPrice(product.old_price)}</span>
            {discount && <span className="product-info__discount">-{discount}%</span>}
          </>
        )}
      </div>

      <div className="product-info__divider" />

      {/* Description */}
      {product.description && (
        <p className="product-info__desc">{product.description}</p>
      )}

      <div className="product-info__divider" />

      {/* ── Couleur ── */}
      {colors.length > 0 && (
        <div className="product-info__section">
          <p className="product-info__section-title">
            Couleur
            {selectedColor && (
              <span className="product-info__selected-value"> — {selectedColor}</span>
            )}
          </p>
          <div className="product-info__colors">
            {colors.map((color) => (
              <button
                key={color.id}
                className={`product-info__color-btn ${selectedColor === color.name ? "product-info__color-btn--active" : ""}`}
                style={{ background: color.hex || "#555" }}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Taille ── */}
      {sizes.length > 0 && (
        <div className="product-info__section">
          <p className="product-info__section-title">
            Taille
            {selectedSize && (
              <span className="product-info__selected-value"> — {selectedSize}</span>
            )}
          </p>
          <div className="product-info__sizes">
            {sizes.map((size) => (
              <button
                key={size.id}
                className={`product-info__size-btn ${selectedSize === size.name ? "product-info__size-btn--active" : ""}`}
                onClick={() => setSelectedSize(size.name)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Quantité ── */}
      <div className="product-info__section">
        <p className="product-info__section-title">Quantité</p>
        <div className="product-info__qty">
          <button
            className="product-info__qty-btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >−</button>
          <span className="product-info__qty-num">{quantity}</span>
          <button
            className="product-info__qty-btn"
            onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
          >+</button>
        </div>
        {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
          <p style={{ fontSize: "11px", color: "#cc8844", marginTop: "8px", letterSpacing: "0.5px" }}>
            ⚠ Plus que {product.stock} en stock
          </p>
        )}
        {product.stock === 0 && (
          <p style={{ fontSize: "11px", color: "#cc4444", marginTop: "8px" }}>
            Rupture de stock
          </p>
        )}
      </div>

      <div className="product-info__divider" />

      {/* ── Actions ── */}
      <div className="product-info__actions">
        <button
          className={`product-info__add-btn ${addedFeedback ? "product-info__add-btn--added" : ""}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {addedFeedback ? "✓ Ajouté au panier" : product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
        </button>
        <button className="product-info__wishlist-btn" aria-label="Ajouter aux favoris">♡</button>
      </div>

      {/* ── Infos livraison ── */}
      <div className="product-info__shipping">
        <div className="product-info__shipping-item">
          <span className="product-info__shipping-icon">🚚</span>
          <span>Livraison gratuite dès 5 000 DA</span>
        </div>
        <div className="product-info__shipping-item">
          <span className="product-info__shipping-icon">↩</span>
          <span>Retours gratuits sous 14 jours</span>
        </div>
        <div className="product-info__shipping-item">
          <span className="product-info__shipping-icon">✦</span>
          <span>Qualité artisanale garantie</span>
        </div>
      </div>
    </div>
  );
}

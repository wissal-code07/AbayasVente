import { useState } from "react";
import { COLORS } from "../../data/catalogueData";
import "./ProductInfo.css";

export default function ProductInfo({ product, onAddToCart }) {
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity,      setQuantity]      = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Veuillez choisir une taille.");
      return;
    }
    onAddToCart({ ...product, selectedSize, selectedColor, quantity });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // Get color hex from COLORS list
  const getHex = (colorName) =>
    COLORS.find((c) => c.name === colorName)?.hex ?? "#555";

  return (
    <div className="product-info">
      {/* Category + name */}
      <p className="product-info__category">{product.category}</p>
      <h1 className="product-info__name">{product.name}</h1>

      {/* Rating mock */}
      <div className="product-info__rating">
        <span className="product-info__stars">★★★★★</span>
        <span className="product-info__reviews">24 avis</span>
      </div>

      {/* Price */}
      <div className="product-info__pricing">
        <span className="product-info__price">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <>
            <span className="product-info__price-old">{formatPrice(product.oldPrice)}</span>
            <span className="product-info__discount">-{discount}%</span>
          </>
        )}
      </div>

      <div className="product-info__divider" />

      {/* Description */}
      <p className="product-info__desc">
        Une création artisanale d'exception, alliant tradition et élégance contemporaine.
        Confectionnée dans un tissu de qualité supérieure, cette abaya offre un tombé parfait
        et un confort incomparable pour toutes les occasions.
      </p>

      <div className="product-info__divider" />

      {/* ── Couleur ── */}
      <div className="product-info__section">
        <p className="product-info__section-title">
          Couleur
          {selectedColor && (
            <span className="product-info__selected-value"> — {selectedColor}</span>
          )}
        </p>
        <div className="product-info__colors">
          {COLORS.map(({ name, hex }) => (
            <button
              key={name}
              className={`product-info__color-btn ${selectedColor === name ? "product-info__color-btn--active" : ""}`}
              style={{ background: hex }}
              onClick={() => setSelectedColor(name)}
              title={name}
              aria-label={name}
            />
          ))}
        </div>
      </div>

      {/* ── Taille ── */}
      <div className="product-info__section">
        <p className="product-info__section-title">
          Taille
          {selectedSize && (
            <span className="product-info__selected-value"> — {selectedSize}</span>
          )}
        </p>
        <div className="product-info__sizes">
          {product.sizes.map((size) => (
            <button
              key={size}
              className={`product-info__size-btn ${selectedSize === size ? "product-info__size-btn--active" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ── Quantité ── */}
      <div className="product-info__section">
        <p className="product-info__section-title">Quantité</p>
        <div className="product-info__qty">
          <button
            className="product-info__qty-btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuer"
          >
            −
          </button>
          <span className="product-info__qty-num">{quantity}</span>
          <button
            className="product-info__qty-btn"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
      </div>

      <div className="product-info__divider" />

      {/* ── Actions ── */}
      <div className="product-info__actions">
        <button
          className={`product-info__add-btn ${addedFeedback ? "product-info__add-btn--added" : ""}`}
          onClick={handleAddToCart}
        >
          {addedFeedback ? "✓ Ajouté au panier" : "Ajouter au panier"}
        </button>
        <button className="product-info__wishlist-btn" aria-label="Ajouter aux favoris">
          ♡
        </button>
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
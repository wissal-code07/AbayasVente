import { useState } from "react";
import "./ProductGallery.css";

export default function ProductGallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images    = product.images || [];
  const hasImages = images.length > 0;

  // ✅ Correction : activeImage (pas imageActive)
  const activeImage = hasImages ? images[activeIndex] : null;

  return (
    <div className="gallery">

      {/* Thumbnails — colonne gauche */}
      <div className="gallery__thumbs">
        {hasImages ? (
          images.map((img, i) => (
            <button
              key={img.id || i}
              // ✅ className (pas classeName), template literal correct
              className={`gallery__thumb ${activeIndex === i ? "gallery__thumb--active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <img
                src={img.image}
                alt={`${product.name} ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))
        ) : (
          // Placeholder thumbnails si pas d'images
          Array.from({ length: 3 }).map((_, i) => (
            <button
              key={i}
              // ✅ className (pas classeName), onClick (pas inClick)
              className={`gallery__thumb ${activeIndex === i ? "gallery__thumb--active" : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="gallery__thumb-placeholder" />
            </button>
          ))
        )}
      </div>

      {/* Image principale */}
      <div className="gallery__main">

        {/* Badge */}
        {product.badge && (
          <span className={`gallery__badge gallery__badge--${product.badge}`}>
            {/* ✅ template literal correct */}
            {product.badge === "new" ? "Nouveau" : `-${product.discount_percent}%`}
          </span>
        )}

        {/* Image ou placeholder */}
        {hasImages && activeImage ? (
          <img
            src={activeImage.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          // ✅ className (pas classeName)
          <div className="gallery__placeholder">
            <span className="gallery__placeholder-icon">✦</span>
            <p className="gallery__placeholder-text">Aucune image disponible</p>
          </div>
        )}

        {/* Flèches navigation */}
        {hasImages && images.length > 1 && (
          <>
            <button
              className="gallery__arrow gallery__arrow--prev"
              onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Image précédente"
            >←</button>
            <button
              className="gallery__arrow gallery__arrow--next"
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              aria-label="Image suivante"
            >→</button>
          </>
        )}

        {/* Points indicateurs */}
        {hasImages && images.length > 1 && (
          <div className="gallery__dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`gallery__dot ${activeIndex === i ? "gallery__dot--active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
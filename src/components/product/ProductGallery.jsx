import { useState } from "react";
import AbayaSilhouette from "../ui/AbayaSilhouette";
import "./ProductGallery.css";

// Génère plusieurs variantes de la même silhouette pour simuler une galerie
function GalleryImage({ product, variant = 0 }) {
  const variants = [
    { gradFrom: product.gradFrom, gradTo: product.gradTo, accent: product.accent },
    { gradFrom: product.gradTo,   gradTo: product.gradFrom, accent: product.accent },
    { gradFrom: "#1A1614",        gradTo: "#0D0C0A",        accent: "rgba(201,168,76,0.5)" },
    { gradFrom: "#141418",        gradTo: "#0A0A0E",        accent: "rgba(180,160,120,0.3)" },
  ];
  const v = variants[variant % variants.length];
  return (
    <div
      className="gallery__image-bg"
      style={{ background: `linear-gradient(160deg, ${v.gradFrom}, ${v.gradTo})` }}
    >
      <AbayaSilhouette
        id={`${product.id}-${variant}`}
        gradientFrom={v.gradFrom}
        gradientTo={v.gradTo}
        accentColor={v.accent}
      />
    </div>
  );
}

export default function ProductGallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const TOTAL_IMAGES = 4;

  return (
    <div className="gallery">
      {/* Thumbnails — colonne gauche */}
      <div className="gallery__thumbs">
        {Array.from({ length: TOTAL_IMAGES }).map((_, i) => (
          <button
            key={i}
            className={`gallery__thumb ${activeIndex === i ? "gallery__thumb--active" : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Photo ${i + 1}`}
          >
            <GalleryImage product={product} variant={i} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="gallery__main">
        {product.badge && (
          <span className={`gallery__badge gallery__badge--${product.badge}`}>
            {product.badge === "new" ? "Nouveau" : product.badgeLabel}
          </span>
        )}
        <GalleryImage product={product} variant={activeIndex} />

        {/* Navigation arrows */}
        <button
          className="gallery__arrow gallery__arrow--prev"
          onClick={() => setActiveIndex((i) => (i - 1 + TOTAL_IMAGES) % TOTAL_IMAGES)}
          aria-label="Image précédente"
        >
          ←
        </button>
        <button
          className="gallery__arrow gallery__arrow--next"
          onClick={() => setActiveIndex((i) => (i + 1) % TOTAL_IMAGES)}
          aria-label="Image suivante"
        >
          →
        </button>

        {/* Dots indicator */}
        <div className="gallery__dots">
          {Array.from({ length: TOTAL_IMAGES }).map((_, i) => (
            <button
              key={i}
              className={`gallery__dot ${activeIndex === i ? "gallery__dot--active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
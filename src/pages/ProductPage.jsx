// src/pages/ProductPage.jsx
// Remplacez votre fichier existant par celui-ci

import { useState, useEffect } from "react";
import { getProduct, getSimilarProducts } from "../services/productService";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import "./ProductPage.css";

// Skeleton pour le chargement
function ProductPageSkeleton() {
  return (
    <div className="product-page">
      <div className="product-page__breadcrumb" style={{padding:"20px 48px"}}>
        <div className="skeleton-line skeleton-line--short" style={{height:"12px",width:"200px"}} />
      </div>
      <div className="product-page__layout">
        <div style={{background:"var(--dark2)",height:"560px",border:"1px solid var(--border)"}} />
        <div style={{display:"flex",flexDirection:"column",gap:"20px",paddingTop:"8px"}}>
          {[80,200,40,120,60,160].map((w,i) => (
            <div key={i} className="skeleton-line" style={{height:"16px",width:`${w}%`,maxWidth:`${w*3}px`}} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Section produits similaires
function SimilarProducts({ product, onAddToCart, navigate }) {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (product?.slug) {
      getSimilarProducts(product.slug)
        .then(data => setSimilar(Array.isArray(data) ? data.slice(0,4) : []))
        .catch(console.error);
    }
  }, [product?.slug]);

  if (similar.length === 0) return null;

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  return (
    <section className="similar">
      <div className="similar__header">
        <span className="section-tag">Vous aimerez aussi</span>
        <h2 className="section-title">Produits <em>Similaires</em></h2>
        <div className="section-line" />
      </div>
      <div className="similar__grid">
        {similar.map((p) => (
          <article
            key={p.id}
            className="cat-card cat-card--grid"
            onClick={() => navigate("product", p)}
            style={{ cursor: "pointer" }}
          >
            <div className="cat-card__img">
              {p.primary_image ? (
                <img src={p.primary_image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", background:"var(--dark3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"32px", color:"var(--gold)", opacity:"0.2" }}>✦</span>
                </div>
              )}
              {p.badge && (
                <span className={`cat-card__badge cat-card__badge--${p.badge}`}>
                  {p.badge === "new" ? "Nouveau" : `-${p.discount_percent}%`}
                </span>
              )}
            </div>
            <div className="cat-card__info">
              <p className="cat-card__category">{p.category?.name}</p>
              <h3 className="cat-card__name">{p.name}</h3>
              <div className="cat-card__footer">
                <span className="cat-card__price">{formatPrice(p.price)}</span>
                <button className="cat-card__add-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}>+</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ProductPage({ product: initialProduct, onAddToCart, navigate }) {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);

  // Si le produit vient du catalogue (données légères), recharger le détail complet
  useEffect(() => {
    if (initialProduct?.slug && !initialProduct.images) {
      setLoading(true);
      getProduct(initialProduct.slug)
        .then(setProduct)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (initialProduct?.slug && initialProduct.images) {
      setProduct(initialProduct);
    }
  }, [initialProduct?.slug]);

  const handleNavigateToProduct = (p) => {
    navigate("product", p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || !product) return <ProductPageSkeleton />;

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <nav className="product-page__breadcrumb">
        <button onClick={() => navigate("home")}>Accueil</button>
        <span className="product-page__breadcrumb-sep">›</span>
        <button onClick={() => navigate("catalogue")}>Collection</button>
        <span className="product-page__breadcrumb-sep">›</span>
        <span className="product-page__breadcrumb-current">{product.name}</span>
      </nav>

      {/* Layout galerie + infos */}
      <div className="product-page__layout">
        <div className="product-page__gallery">
          <ProductGallery product={product} />
        </div>
        <div className="product-page__info">
          <ProductInfo product={product} onAddToCart={onAddToCart} />
        </div>
      </div>

      {/* Produits similaires */}
      <SimilarProducts
        product={product}
        onAddToCart={onAddToCart}
        navigate={handleNavigateToProduct}
      />
    </div>
  );
}

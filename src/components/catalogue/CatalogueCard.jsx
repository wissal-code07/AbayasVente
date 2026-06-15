import "./CatalogueCard.css";

export default function CatalogueCard({ product, viewMode, onAddToCart, navigate, isAuthenticated }) {
  const { id, name, category, price, old_price, badge,
          primary_image, sizes, colors, discount_percent } = product;

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";
  //Clic sur la carte pour voir les détails du produit
  const handleCardClick = () => { if (navigate) navigate("product", product); };

  //Click sur "Ajouter au panier" = verifer si connecté
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      navigate("login");
    } else {
      onAddToCart(product);
    }
  };


  //Click sur l'oeil = toujours accessible même si pas connecté
  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate("product", product);
  };
  return (
    <article className={`cat-card cat-card--${viewMode}`} onClick={handleCardClick} style={{ cursor: "pointer" }}>
      {/* Image */}
      <div 
      className="cat-card__img" 
      style={!primary_image ? {background: "var(--dark3)"} : {}}
      >  
        {primary_image ? (
          <img src={primary_image} alt={name} className="cat-card__img-photo" />
        ) : (
          <div className="cat-card__img-placeholder" />
        )}
        {badge && (
          <span className={`cat-card__badge cat-card__badge--${badge}`}>
            {badge === "new" ? "Nouveau" : `-${discount_percent}%`}
          </span>
        )}
        <div className="cat-card__overlay">
          {/* Ajouter au panier avec verification d'authentification*/}
          <button className="cat-card__quick-btn" onClick={handleAddToCart}
          >
            {isAuthenticated ? "Ajouter au panier" : "Se connecter pour acheter"}
          </button>
          <button className="cat-card__quick-icon" 
          aria-label="Voir les détails"
          onClick={handleViewDetails}>👁</button>
        </div>
      </div>

      {/* Infos */}
      <div className="cat-card__info">
        <p className="cat-card__category">{category?.name || category}</p>
        <h3 className="cat-card__name">{name}</h3>

        {viewMode === "list" && sizes?.length > 0 && (
          <div className="cat-card__sizes">
            {sizes.map((s) => (<span className="cat-card__size-tag" key={s.id || s}>{s.name || s}</span>))}
          </div>
        )}

        <div className="cat-card__footer">
          <div className="cat-card__pricing">
            <span className="cat-card__price">{formatPrice(price)}</span>
            {old_price && <span className="cat-card__price-old">{formatPrice(old_price)}</span>}
          </div>
          <button className="cat-card__add-btn" onClick={handleAddToCart}
          aria-label={`Ajouter ${name} au panier`}
          title={!isAuthenticated ? "connectez-vous pour acheter" : ""}>
            {isAuthenticated ? "+" :"" }
          </button>
        </div>
      </div>
    </article>
  );
}

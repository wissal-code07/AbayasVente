import { usePromoProducts } from "../../hooks/useHomePage";
import "./PromotionsSection.css";

export default function PromotionsSection({ navigate }) {
  const { products, loading } = usePromoProducts();

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  // Données statiques pour les blocs promo si pas de produits API
  const staticPromos = [
    {
      tag:      "Offre Limitée",
      title:    "Soldes de Fin de Saison",
      desc:     "Profitez de réductions exceptionnelles sur toute la collection.",
      percent:  "30%",
      deadline: "⏳ Expire bientôt",
      ctaLabel: "Profiter de l'offre",
      ctaVariant: "primary",
    },
    {
      tag:      "Nouveauté",
      title:    "Collection Ramadan 2025",
      desc:     "Des créations exclusives alliant tradition et modernité.",
      percent:  "20%",
      deadline: "✨ Collection exclusive",
      ctaLabel: "Voir la collection",
      ctaVariant: "outline",
    },
  ];

  return (
    <section className="promos" id="promotions">
      <div className="section-header">
        <span className="section-tag">Offres Spéciales</span>
        <h2 className="section-title">Nos <em>Promotions</em></h2>
        <div className="section-line" />
      </div>

      <div className="promos__grid">
        {/* Si des produits en promo existent → afficher les vrais */}
        {!loading && products.length > 0 ? (
          products.map((product) => (
            <div
              className="promo-card"
              key={product.id}
              onClick={() => navigate && navigate("product", product)}
              style={{ cursor: "pointer" }}
            >
              <div className="promo-card__bg" />
              <span className="promo-card__percent">
                {product.discount_percent ? `-${product.discount_percent}%` : "Promo"}
              </span>
              <span className="promo-card__tag">Promotion</span>
              <h3 className="promo-card__title">{product.name}</h3>
              <p className="promo-card__desc">
                {product.description || "Une pièce exceptionnelle à prix réduit."}
              </p>
              <div className="promo-card__pricing">
                <span className="promo-card__price">{formatPrice(product.price)}</span>
                {product.old_price && (
                  <span className="promo-card__old-price">{formatPrice(product.old_price)}</span>
                )}
              </div>
              <button
                className="btn btn--primary"
                onClick={(e) => { e.stopPropagation(); navigate("product", product); }}
              >
                Voir le produit
              </button>
            </div>
          ))
        ) : (
          // Sinon → afficher les blocs statiques
          staticPromos.map((promo) => (
            <div className="promo-card" key={promo.tag}>
              <div className="promo-card__bg" />
              <span className="promo-card__percent">{promo.percent}</span>
              <span className="promo-card__tag">{promo.tag}</span>
              <h3 className="promo-card__title">{promo.title}</h3>
              <p className="promo-card__desc">{promo.desc}</p>
              <div className="promo-card__deadline">{promo.deadline}</div>
              <button
                className={`btn btn--${promo.ctaVariant}`}
                onClick={() => navigate && navigate("catalogue")}
              >
                {promo.ctaLabel}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

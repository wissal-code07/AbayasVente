import { promotions } from "../../data/mockData";
import "./PromotionsSection.css";

export default function PromotionsSection({ navigate }) {
  return (
    <section className="promos" id="promotions">
      <div className="section-header">
        <span className="section-tag">Offres Spéciales</span>
        <h2 className="section-title">Nos <em>Promotions</em></h2>
        <div className="section-line" />
      </div>

      <div className="promos__grid">
        {promotions.map((promo) => (
          <div className="promo-card" key={promo.id}>
            <div className="promo-card__bg" />
            <span className="promo-card__percent">{promo.percent}</span>
            <span className="promo-card__tag">{promo.tag}</span>
            <h3 className="promo-card__title">{promo.title}</h3>
            <p className="promo-card__desc">{promo.description}</p>
            <div className="promo-card__deadline">{promo.deadline}</div>
            <button
              className={`btn btn--${promo.ctaVariant}`}
              onClick={() => navigate && navigate("catalogue")}
            >
              {promo.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

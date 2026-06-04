import { heroStats } from "../../data/mockData";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      {/* Background layers */}
      <div className="hero__bg" />
      <div className="hero__pattern" />
      <div className="hero__ornament" />

      {/* Main content */}
      <div className="hero__content">
        <div className="hero__tag">Collection Exclusive 2025</div>

        <h1 className="hero__title">
          L'Art de<br />
          l'<em>Élégance</em><br />
          Islamique
        </h1>

        <p className="hero__subtitle">
          Abayas artisanales pour la femme moderne
        </p>

        <div className="hero__cta">
          <a href="#featured" className="btn btn--primary">
            Découvrir la Collection
          </a>
          <a href="#promotions" className="btn btn--outline">
            Voir les Promos
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="hero__stats">
        {heroStats.map((stat) => (
          <div className="hero__stat" key={stat.label}>
            <div className="hero__stat-num">{stat.num}</div>
            <div className="hero__stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <span className="hero__scroll-line" />
        Défiler
      </div>
    </section>
  );
}

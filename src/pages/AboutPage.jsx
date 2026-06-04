import "./AboutPage.css";

const VALUES = [
  { icon: "✦", title: "Artisanat Authentique",   desc: "Chaque abaya est confectionnée à la main par des artisanes talentueuses, perpétuant un savoir-faire transmis de génération en génération." },
  { icon: "◈", title: "Qualité Premium",          desc: "Nous sélectionnons rigoureusement nos tissus — crêpe, satin, mousseline — pour garantir un tombé parfait et un confort exceptionnel." },
  { icon: "❋", title: "Élégance Contemporaine",   desc: "Nos créations marient tradition islamique et modernité, pour une femme qui assume son identité avec fierté et style." },
  { icon: "◇", title: "Service Personnalisé",     desc: "De la sélection à la livraison, notre équipe vous accompagne pour trouver la pièce qui vous correspond parfaitement." },
];

const TIMELINE = [
  { year: "2018", title: "Les débuts",          desc: "Fondée à Alger par Nour Benali, Abayas Vente naît d'une passion pour la mode modeste et le désir de proposer des créations locales de qualité." },
  { year: "2020", title: "Premier atelier",     desc: "Ouverture de notre premier atelier de création, avec une équipe de 5 artisanes. Lancement de notre première collection officielle." },
  { year: "2022", title: "Expansion nationale", desc: "Abayas Vente étend sa livraison à toutes les wilayas d'Algérie. Plus de 2 000 clientes nous font confiance." },
  { year: "2024", title: "Boutique en ligne",   desc: "Lancement de notre boutique en ligne pour toucher encore plus de femmes à travers l'Algérie et la diaspora." },
  { year: "2025", title: "Aujourd'hui",         desc: "Plus de 200 modèles au catalogue, une communauté de 10 000 clientes fidèles et une nouvelle collection Ramadan très attendue." },
];

export default function AboutPage({ navigate }) {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <div className="about-page__hero">
        <div className="about-page__hero-bg" />
        <div className="about-page__hero-pattern" />
        <div className="about-page__hero-content">
          <span className="about-page__tag">Notre Histoire</span>
          <h1 className="about-page__title">
            L'Élégance<br /><em>Islamique</em><br />Revisitée
          </h1>
          <p className="about-page__hero-desc">
            Depuis 2018, Abayas Vente incarne la fusion entre tradition et modernité,
            offrant à la femme algérienne des créations qui la représentent.
          </p>
        </div>
      </div>

      {/* ── Histoire ── */}
      <section className="about-page__section">
        <div className="about-page__section-inner">
          <div className="about-page__story">
            <div className="about-page__story-text">
              <span className="section-tag">Notre Fondatrice</span>
              <h2 className="about-page__section-title">
                Une passion<br /><em>transmise</em>
              </h2>
              <p className="about-page__body">
                Nour Benali grandit entourée de femmes qui portaient l'abaya avec une élégance naturelle.
                Diplômée en stylisme, elle constate un manque criant de créations locales alliant qualité
                artisanale et esthétique contemporaine.
              </p>
              <p className="about-page__body">
                En 2018, avec une machine à coudre et une vision claire, elle fonde Abayas Vente depuis
                son appartement à Alger. Aujourd'hui, la marque habille des milliers de femmes à travers
                toute l'Algérie.
              </p>
              <button className="btn btn--outline about-page__cta" onClick={() => navigate("catalogue")}>
                Découvrir la collection
              </button>
            </div>

            {/* Ornement décoratif */}
            <div className="about-page__story-visual">
              <div className="about-page__visual-frame">
                <div className="about-page__visual-inner">
                  <span className="about-page__visual-quote">
                    "Porter une abaya, c'est choisir l'élégance avec conviction."
                  </span>
                  <span className="about-page__visual-author">— Nour Benali, Fondatrice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="about-page__timeline-section">
        <div className="about-page__section-inner">
          <div className="about-page__section-header">
            <span className="section-tag">Notre Parcours</span>
            <h2 className="about-page__section-title">Les étapes <em>clés</em></h2>
            <div className="section-line" />
          </div>

          <div className="about-page__timeline">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`about-page__timeline-item ${i % 2 === 0 ? "about-page__timeline-item--left" : "about-page__timeline-item--right"}`}>
                <div className="about-page__timeline-content">
                  <span className="about-page__timeline-year">{item.year}</span>
                  <h3 className="about-page__timeline-title">{item.title}</h3>
                  <p className="about-page__timeline-desc">{item.desc}</p>
                </div>
                <div className="about-page__timeline-dot" />
              </div>
            ))}
            <div className="about-page__timeline-line" />
          </div>
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section className="about-page__values-section">
        <div className="about-page__section-inner">
          <div className="about-page__section-header">
            <span className="section-tag">Ce Qui Nous Définit</span>
            <h2 className="about-page__section-title">Nos <em>Valeurs</em></h2>
            <div className="section-line" />
          </div>

          <div className="about-page__values-grid">
            {VALUES.map((val) => (
              <div key={val.title} className="about-page__value-card">
                <span className="about-page__value-icon">{val.icon}</span>
                <h3 className="about-page__value-title">{val.title}</h3>
                <p className="about-page__value-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="about-page__cta-section">
        <h2 className="about-page__cta-title">Rejoignez notre <em>communauté</em></h2>
        <p className="about-page__cta-desc">
          Plus de 10 000 femmes nous font confiance. Découvrez pourquoi.
        </p>
        <div className="about-page__cta-btns">
          <button className="btn btn--primary" onClick={() => navigate("catalogue")}>
            Voir la collection
          </button>
          <button className="btn btn--outline" onClick={() => navigate("register")}>
            Créer un compte
          </button>
        </div>
      </section>

    </div>
  );
}

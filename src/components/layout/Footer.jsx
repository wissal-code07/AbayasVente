import { footerLinks } from "../../data/mockData";
import "./Footer.css";

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer__grid">
        {/* Marque */}
        <div>
          <div className="footer__brand">Abayas Vente</div>
          <p className="footer__desc">
            Votre destination premium pour les abayas artisanales.
            Élégance, qualité et modernité réunies.
          </p>
        </div>

        {/* Colonnes de liens */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <p className="footer__heading">{title}</p>
            <ul className="footer__links">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link === "Accueil")       navigate("home");
                      else if (link === "Collection") navigate("collection");
                      else if (
                               link === "Nouveautés") navigate("nouveautes");
                      else if (
                               link === "Promotions") navigate("promotions");
                      else if (link === "Mes commandes" ||
                               link === "Mes adresses" ||
                               link === "Mon profil")  navigate("account");
                      else if (link === "Connexion")   navigate("login");
                      else if (link === "Inscription") navigate("register");
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © 2026 Abayas Vente — Tous droits réservés
        </p>
        <div className="footer__socials">
          <a href="#" className="footer__social">f</a>
          <a href="#" className="footer__social">in</a>
          <a href="#" className="footer__social">ig</a>
        </div>
      </div>
    </footer>
  );
}

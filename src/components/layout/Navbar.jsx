import { useState, useEffect } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Collection", page: "catalogue" },
  { label: "Nouveautés", page: "catalogue" },
  { label: "Promotions", page: "catalogue" },
  { label: "À propos",   page: "home"      },
];

export default function Navbar({ cartCount = 0, navigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* Logo — retour accueil */}
      <button className="navbar__logo" onClick={() => navigate("home")}>
        Abayas<span>Vente</span>
      </button>

      {/* Liens de navigation */}
      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <button
              className={`navbar__link ${currentPage === link.page ? "navbar__link--active" : ""}`}
              onClick={() => navigate(link.page)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="navbar__actions">
        <button className="navbar__icon" aria-label="Rechercher">🔍</button>
        <button className="navbar__icon" aria-label="Mon compte">👤</button>
        <button className="navbar__cart" onClick={() => navigate("cart")}>
          🛒 Panier
          {cartCount > 0 && (
            <span className="navbar__cart-count">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

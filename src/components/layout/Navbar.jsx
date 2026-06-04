import { useState, useEffect } from "react";
import SearchBar from "../ui/SearchBar";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Collection",  page: "catalogue"   },
  { label: "Nouveautés",  page: "nouveautes"  },
  { label: "Promotions",  page: "promotions"  },
  { label: "À propos",    page: "about"       },
];

export default function Navbar({ cartCount = 0, navigate, currentPage, onCartOpen }) {
  const [scrolled, setScrolled]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <button className="navbar__logo" onClick={() => navigate("home")}>
          Abayas<span>Vente</span>
        </button>

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

        <div className="navbar__actions">
          {/* Bouton recherche — ouvre la SearchBar */}
          <button
            className="navbar__icon"
            aria-label="Rechercher"
            onClick={() => setSearchOpen(true)}
          >
            🔍
          </button>
          <button
            className="navbar__icon"
            aria-label="Mon compte"
            onClick={() => navigate("login")}
          >
            👤
          </button>
          <button className="navbar__cart" onClick={onCartOpen}>
            🛒 Panier
            {cartCount > 0 && (
              <span className="navbar__cart-count">{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Barre de recherche */}
      <SearchBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        navigate={navigate}
      />
    </>
  );
}

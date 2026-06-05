import { useState, useEffect } from "react";
import SearchBar from "../ui/SearchBar";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Collection",  page: "catalogue"  },
  { label: "Nouveautés",  page: "nouveautes" },
  { label: "Promotions",  page: "promotions" },
  { label: "À propos",    page: "about"      },
];

export default function Navbar({ cartCount = 0, navigate, currentPage, onCartOpen }) {
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le drawer quand on navigue
  const handleNavigate = (page) => {
    setDrawerOpen(false);
    navigate(page);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <button className="navbar__logo" onClick={() => handleNavigate("home")}>
          Abayas<span>Vente</span>
        </button>

        {/* Desktop links */}
        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                className={`navbar__link ${currentPage === link.page ? "navbar__link--active" : ""}`}
                onClick={() => handleNavigate(link.page)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="navbar__actions">
          <button className="navbar__icon" aria-label="Rechercher" onClick={() => setSearchOpen(true)}>🔍</button>
          <button className="navbar__icon" aria-label="Mon compte" onClick={() => handleNavigate("login")}>👤</button>
          <button className="navbar__cart" onClick={onCartOpen}>
            🛒 <span className="navbar__cart-label">Panier</span>
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </button>
          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${drawerOpen ? "navbar__hamburger--open" : ""}`}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${drawerOpen ? "navbar__drawer--open" : ""}`}>
        <div className="navbar__drawer-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className={`navbar__drawer-link ${currentPage === link.page ? "navbar__drawer-link--active" : ""}`}
              onClick={() => handleNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="navbar__drawer-actions">
          <button className="navbar__drawer-link" onClick={() => handleNavigate("login")}>👤 Mon compte</button>
          <button className="navbar__drawer-link" onClick={() => { setDrawerOpen(false); setSearchOpen(true); }}>🔍 Rechercher</button>
          <button className="navbar__drawer-cart" onClick={() => { setDrawerOpen(false); onCartOpen(); }}>
            🛒 Panier {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>

      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
    </>
  );
}

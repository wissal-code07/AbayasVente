import { useState, useEffect } from "react";
import SearchBar from "../ui/SearchBar";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Collection",  page: "catalogue"  },
  { label: "Nouveautés",  page: "nouveautes" },
  { label: "Promotions",  page: "promotions" },
  { label: "À propos",    page: "about"      },
];

export default function Navbar({ cartCount = 0, navigate, currentPage, onCartOpen, user, onLogout }) {
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (page) => { setDrawerOpen(false); navigate(page); };

  // ← redirige admin vers dashboard admin, client vers account
  const handleAccountClick = () => {
    if (!user) { handleNavigate("login"); return; }
    if (user.is_staff) { handleNavigate("admin"); return; }
    handleNavigate("account");
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <button className="navbar__logo" onClick={() => handleNavigate("home")}>Abayas<span>Vente</span></button>
        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                className={`navbar__link ${currentPage === link.page ? "navbar__link--active" : ""}`}
                onClick={() => handleNavigate(link.page)}>{link.label}</button>
            </li>
          ))}
        </ul>
        <div className="navbar__actions">
          <button className="navbar__icon" onClick={() => setSearchOpen(true)}>🔍</button>
          <button
            className={`navbar__icon ${(currentPage === "account" || currentPage === "admin") ? "navbar__icon--active" : ""}`}
            onClick={handleAccountClick}
            title={user ? (user.is_staff ? "Administration" : user.firstName) : "Se connecter"}>
            {user?.is_staff ? "⚙️" : "👤"}
          </button>
          {user && <button className="navbar__icon" onClick={onLogout} title="Se déconnecter">🚪</button>}
          <button className="navbar__cart" onClick={onCartOpen}>
            🛒 <span className="navbar__cart-label">Panier</span>
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </button>
          <button
            className={`navbar__hamburger ${drawerOpen ? "navbar__hamburger--open" : ""}`}
            onClick={() => setDrawerOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`navbar__drawer ${drawerOpen ? "navbar__drawer--open" : ""}`}>
        <div className="navbar__drawer-links">
          {NAV_LINKS.map((link) => (
            <button key={link.label}
              className={`navbar__drawer-link ${currentPage === link.page ? "navbar__drawer-link--active" : ""}`}
              onClick={() => handleNavigate(link.page)}>{link.label}</button>
          ))}
        </div>
        <div className="navbar__drawer-actions">
          <button className="navbar__drawer-link" onClick={handleAccountClick}>
            {user?.is_staff ? "⚙️ Administration" : `👤 ${user ? user.firstName : "Se connecter"}`}
          </button>
          {user && (
            <button className="navbar__drawer-link" onClick={() => { setDrawerOpen(false); onLogout(); }}>
              🚪 Se déconnecter
            </button>
          )}
          <button className="navbar__drawer-link" onClick={() => { setDrawerOpen(false); setSearchOpen(true); }}>
            🔍 Rechercher
          </button>
          <button className="navbar__drawer-cart" onClick={() => { setDrawerOpen(false); onCartOpen(); }}>
            🛒 Panier {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>

      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
    </>
  );
}
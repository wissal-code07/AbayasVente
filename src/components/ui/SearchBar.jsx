import { useState, useEffect, useRef } from "react";
import { catalogueProducts } from "../../data/catalogueData";
import { featuredProducts } from "../../data/mockData";
import "./SearchBar.css";

const ALL_PRODUCTS = [
  ...catalogueProducts,
  ...featuredProducts.filter((f) => !catalogueProducts.find((c) => c.id === f.id)),
];

export default function SearchBar({ isOpen, onClose, navigate }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim().length >= 2
    ? ALL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.color && p.color.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const handleSelect = (product) => {
    onClose();
    navigate("product", product);
  };

  const handleSearchAll = () => {
    onClose();
    navigate("catalogue");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`search-overlay ${isOpen ? "search-overlay--visible" : ""}`}
        onClick={onClose}
      />

      {/* Search panel */}
      <div className={`search-bar ${isOpen ? "search-bar--open" : ""}`}>
        <div className="search-bar__inner">
          <span className="search-bar__icon">🔍</span>
          <input
            ref={inputRef}
            className="search-bar__input"
            type="text"
            placeholder="Rechercher une abaya, catégorie, couleur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-bar__clear" onClick={() => setQuery("")} aria-label="Effacer">✕</button>
          )}
          <button className="search-bar__close" onClick={onClose}>Fermer</button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="search-bar__results">
            <p className="search-bar__results-label">
              {results.length} résultat{results.length > 1 ? "s" : ""} pour "{query}"
            </p>
            {results.map((product) => (
              <button
                key={product.id}
                className="search-bar__result"
                onClick={() => handleSelect(product)}
              >
                <div
                  className="search-bar__result-thumb"
                  style={{ background: `linear-gradient(135deg, ${product.gradFrom}, ${product.gradTo})` }}
                />
                <div className="search-bar__result-info">
                  <span className="search-bar__result-name">{product.name}</span>
                  <span className="search-bar__result-cat">{product.category}</span>
                </div>
                <span className="search-bar__result-price">{formatPrice(product.price)}</span>
              </button>
            ))}
            <button className="search-bar__see-all" onClick={handleSearchAll}>
              Voir tous les résultats →
            </button>
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="search-bar__no-results">
            <p>Aucun résultat pour "<strong>{query}</strong>"</p>
            <button className="btn btn--outline" onClick={handleSearchAll}>
              Voir toute la collection
            </button>
          </div>
        )}

        {/* Suggestions rapides */}
        {query.trim().length < 2 && (
          <div className="search-bar__suggestions">
            <p className="search-bar__results-label">Recherches populaires</p>
            <div className="search-bar__tags">
              {["Abaya noire", "Soirée", "Brodée", "Premium", "Nouvelle collection"].map((tag) => (
                <button
                  key={tag}
                  className="search-bar__tag"
                  onClick={() => setQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// src/pages/CataloguePage.jsx
// Remplacez votre fichier existant par celui-ci

import { useState } from "react";
import { useProducts, useProductFilters } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import CatalogueSidebar from "../components/catalogue/CatalogueSidebar";
import CatalogueTopBar from "../components/catalogue/CatalogueTopBar";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import CataloguePagination from "../components/catalogue/CataloguePagination";
import CatalogueEmpty from "../components/catalogue/CatalogueEmpty";
import ActiveFilters from "../components/catalogue/ActiveFilters";
import "./CataloguePage.css";

export default function CataloguePage({ onAddToCart, navigate }) {
  const { isAuthenticated } = useAuth();

  const [viewMode, setViewMode]         = useState("grid");
  const [showFilters, setShowFilters]   = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [sortBy, setSortBy]             = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizes, setSelectedSizes]       = useState([]);
  const [selectedColors, setSelectedColors]     = useState([]);
  const [priceRange, setPriceRange]             = useState([0, 12000]);

  const { categories, colors, sizes } = useProductFilters();

  const apiParams = {
    page:     currentPage,
    ordering: sortBy === "price_asc" ? "price" : sortBy === "price_desc" ? "-price" : "-created_at",
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedSizes.length > 0 && { size: selectedSizes[0] }),
    ...(selectedColors.length > 0 && { color: selectedColors[0] }),
    ...(priceRange[0] > 0 && { min_price: priceRange[0] }),
    ...(priceRange[1] < 12000 && { max_price: priceRange[1] }),
  };

  const { products, loading, error, totalCount, totalPages } = useProducts(apiParams);

  const toggleSize  = (s) => { setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); setCurrentPage(1); };
  const toggleColor = (c) => { setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); setCurrentPage(1); };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    ((priceRange[0] > 0 || priceRange[1] < 12000) ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory(""); setSelectedSizes([]); setSelectedColors([]);
    setPriceRange([0, 12000]); setSortBy("newest"); setCurrentPage(1);
  };

  return (
    <div className="catalogue-page">
      <div className="catalogue-page__hero">
        <span className="catalogue-page__hero-tag">Notre Boutique</span>
        <h1 className="catalogue-page__hero-title">La <em>Collection</em></h1>
        <div className="catalogue-page__hero-line" />
      </div>

      <div className="catalogue-page__layout">
        <button
          className="catalogue-page__filter-toggle"
          onClick={() => setShowFilters(v => !v)}
        >
          {showFilters ? "✕ Masquer les filtres" : `⚙ Filtres${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
        </button>

        {(showFilters || window.innerWidth > 768) && (
          <CatalogueSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={(v) => { setSelectedCategory(v); setCurrentPage(1); }}
            selectedSizes={selectedSizes} toggleSize={toggleSize}
            selectedColors={selectedColors} toggleColor={toggleColor}
            priceRange={priceRange} setPriceRange={(v) => { setPriceRange(v); setCurrentPage(1); }}
            activeFilterCount={activeFilterCount} resetFilters={resetFilters}
            categories={categories} colors={colors} sizes={sizes}
          />
        )}

        <div className="catalogue-page__main">
          <CatalogueTopBar
            totalCount={totalCount}
            sortBy={sortBy}
            setSortBy={(v) => { setSortBy(v); setCurrentPage(1); }}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <ActiveFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={(v) => { setSelectedCategory(v); setCurrentPage(1); }}
            selectedSizes={selectedSizes} toggleSize={toggleSize}
            selectedColors={selectedColors} toggleColor={toggleColor}
            activeFilterCount={activeFilterCount} resetFilters={resetFilters}
          />

          {loading && (
            <div className="catalogue-page__loading">
              <div className="catalogue-page__spinner" />
              <p>Chargement des produits...</p>
            </div>
          )}

          {error && !loading && (
            <div className="catalogue-page__error">
              <p>{error}</p>
              <button className="btn btn--outline" onClick={resetFilters}>Réessayer</button>
            </div>
          )}

          {!loading && !error && (
            products.length === 0 ? (
              <CatalogueEmpty resetFilters={resetFilters} />
            ) : (
              <div className={`catalogue-page__grid catalogue-page__grid--${viewMode}`}>
                {products.map((product) => (
                  <CatalogueCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={onAddToCart}
                    navigate={navigate}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )
          )}

          <CataloguePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

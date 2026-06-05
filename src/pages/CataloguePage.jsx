import { useState } from "react";
import { useCatalogue } from "../hooks/useCatalogue";
import CatalogueSidebar from "../components/catalogue/CatalogueSidebar";
import CatalogueTopBar from "../components/catalogue/CatalogueTopBar";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import CataloguePagination from "../components/catalogue/CataloguePagination";
import CatalogueEmpty from "../components/catalogue/CatalogueEmpty";
import ActiveFilters from "../components/catalogue/ActiveFilters";
import "./CataloguePage.css";

export default function CataloguePage({ onAddToCart, navigate }) {
  const [viewMode, setViewMode]       = useState("grid");
  const [showFilters, setShowFilters] = useState(false); // mobile toggle

  const {
    selectedCategory, setSelectedCategory,
    selectedSizes,    toggleSize,
    selectedColors,   toggleColor,
    priceRange,       setPriceRange,
    sortBy,           setSortBy,
    currentPage,      setCurrentPage,
    paginatedProducts,
    totalPages,
    totalCount,
    activeFilterCount,
    resetFilters,
  } = useCatalogue();

  return (
    <div className="catalogue-page">
      <div className="catalogue-page__hero">
        <span className="catalogue-page__hero-tag">Notre Boutique</span>
        <h1 className="catalogue-page__hero-title">La <em>Collection</em></h1>
        <div className="catalogue-page__hero-line" />
      </div>

      <div className="catalogue-page__layout">
        {/* Mobile filter toggle button */}
        <button
          className="catalogue-page__filter-toggle"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? "✕ Masquer les filtres" : `⚙ Filtres${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
        </button>

        {/* Sidebar — always visible on desktop, toggleable on mobile */}
        {(showFilters || window.innerWidth > 768) && (
          <CatalogueSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            activeFilterCount={activeFilterCount}
            resetFilters={resetFilters}
          />
        )}

        <div className="catalogue-page__main">
          <CatalogueTopBar
            totalCount={totalCount}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <ActiveFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            activeFilterCount={activeFilterCount}
            resetFilters={resetFilters}
          />
          {paginatedProducts.length === 0 ? (
            <CatalogueEmpty resetFilters={resetFilters} />
          ) : (
            <div className={`catalogue-page__grid catalogue-page__grid--${viewMode}`}>
              {paginatedProducts.map((product) => (
                <CatalogueCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={onAddToCart}
                  navigate={navigate}
                />
              ))}
            </div>
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

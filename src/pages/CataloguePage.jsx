import { useState } from "react";
import { useCatalogue } from "../hooks/useCatalogue";
import CatalogueSidebar from "../components/catalogue/CatalogueSidebar";
import CatalogueTopBar from "../components/catalogue/CatalogueTopBar";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import CataloguePagination from "../components/catalogue/CataloguePagination";
import CatalogueEmpty from "../components/catalogue/CatalogueEmpty";
import ActiveFilters from "../components/catalogue/ActiveFilters";
import "./CataloguePage.css";

// Reçoit onAddToCart ET navigate depuis App.jsx
export default function CataloguePage({ onAddToCart, navigate }) {
  const [viewMode, setViewMode] = useState("grid");

  const {
    selectedCategory, setSelectedCategory,
    selectedSizes,    toggleSize,
    selectedColors,   toggleColor,
    priceRange,       setPriceRange,
    sortBy,           setSortBy,
    currentPage,      setCurrentPage,
    paginatedProducts,
    filteredProducts,
    totalPages,
    totalCount,
    activeFilterCount,
    resetFilters,
  } = useCatalogue();

  return (
    <div className="catalogue-page">
      {/* En-tête de page */}
      <div className="catalogue-page__hero">
        <span className="catalogue-page__hero-tag">Notre Boutique</span>
        <h1 className="catalogue-page__hero-title">
          La <em>Collection</em>
        </h1>
        <div className="catalogue-page__hero-line" />
      </div>

      {/* Layout : sidebar + contenu principal */}
      <div className="catalogue-page__layout">
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

import { useState, useMemo } from "react";
import { catalogueProducts, PRICE_RANGE } from "../data/catalogueData";

const PRODUCTS_PER_PAGE = 8;

export function useCatalogue() {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedSizes, setSelectedSizes]       = useState([]);
  const [selectedColors, setSelectedColors]     = useState([]);
  const [priceRange, setPriceRange]             = useState([PRICE_RANGE.min, PRICE_RANGE.max]);
  const [sortBy, setSortBy]                     = useState("newest");
  const [currentPage, setCurrentPage]           = useState(1);

  // Toggle a value in an array filter
  const toggleArrayFilter = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("Toutes");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Count active filters (excluding sort and default price)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "Toutes") count++;
    count += selectedSizes.length;
    count += selectedColors.length;
    if (priceRange[0] !== PRICE_RANGE.min || priceRange[1] !== PRICE_RANGE.max) count++;
    return count;
  }, [selectedCategory, selectedSizes, selectedColors, priceRange]);

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let result = [...catalogueProducts];

    if (selectedCategory !== "Toutes")
      result = result.filter((p) => p.category === selectedCategory);

    if (selectedSizes.length > 0)
      result = result.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)));

    if (selectedColors.length > 0)
      result = result.filter((p) => selectedColors.includes(p.color));

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    // "newest" keeps original order (by id)

    return result;
  }, [selectedCategory, selectedSizes, selectedColors, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return {
    // State
    selectedCategory, setSelectedCategory: (v) => { setSelectedCategory(v); setCurrentPage(1); },
    selectedSizes,    toggleSize:  (v) => toggleArrayFilter(setSelectedSizes, v),
    selectedColors,   toggleColor: (v) => toggleArrayFilter(setSelectedColors, v),
    priceRange,       setPriceRange: (v) => { setPriceRange(v); setCurrentPage(1); },
    sortBy,           setSortBy: (v) => { setSortBy(v); setCurrentPage(1); },
    currentPage,      setCurrentPage,
    // Derived
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalCount: filteredProducts.length,
    activeFilterCount,
    resetFilters,
  };
}
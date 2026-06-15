import "./CatalogueSidebar.css";

const PRICE_RANGE = { min: 0, max: 12000 };

export default function CatalogueSidebar({
  selectedCategory, setSelectedCategory,
  selectedSizes, toggleSize,
  selectedColors, toggleColor,
  priceRange, setPriceRange,
  activeFilterCount, resetFilters,
  categories = [], colors = [], sizes = [],
}) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  return (
    <aside className="cat-sidebar">
      <div className="cat-sidebar__header">
        <span className="cat-sidebar__title">Filtres</span>
        {activeFilterCount > 0 && (
          <button className="cat-sidebar__reset" onClick={resetFilters}>
            Réinitialiser ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Catégorie */}
      <div className="cat-sidebar__group">
        <p className="cat-sidebar__group-title">Catégorie</p>
        <ul className="cat-sidebar__list">
          <li>
            <button className={`cat-sidebar__item ${!selectedCategory ? "cat-sidebar__item--active" : ""}`} onClick={() => setSelectedCategory("")}>
              Toutes
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className={`cat-sidebar__item ${selectedCategory === cat.slug ? "cat-sidebar__item--active" : ""}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Taille */}
      <div className="cat-sidebar__group">
        <p className="cat-sidebar__group-title">Taille</p>
        <div className="cat-sidebar__sizes">
          {sizes.map((size) => (
            <button
              key={size.id}
              className={`cat-sidebar__size ${selectedSizes.includes(size.name) ? "cat-sidebar__size--active" : ""}`}
              onClick={() => toggleSize(size.name)}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Couleur */}
      <div className="cat-sidebar__group">
        <p className="cat-sidebar__group-title">Couleur</p>
        <div className="cat-sidebar__colors">
          {colors.map(({ id, name, hex }) => (
            <button
              key={id}
              className={`cat-sidebar__color ${selectedColors.includes(name) ? "cat-sidebar__color--active" : ""}`}
              onClick={() => toggleColor(name)}
              title={name}
            >
              <span className="cat-sidebar__color-dot" style={{ background: hex }} />
              <span className="cat-sidebar__color-name">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div className="cat-sidebar__group">
        <p className="cat-sidebar__group-title">
          Prix — <span className="cat-sidebar__price-label">{formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}</span>
        </p>
        <div className="cat-sidebar__price-inputs">
          <input type="range" className="cat-sidebar__range" min={PRICE_RANGE.min} max={PRICE_RANGE.max} step={100}
            value={priceRange[0]} onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 100), priceRange[1]])} />
          <input type="range" className="cat-sidebar__range" min={PRICE_RANGE.min} max={PRICE_RANGE.max} step={100}
            value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 100)])} />
        </div>
      </div>
    </aside>
  );
}

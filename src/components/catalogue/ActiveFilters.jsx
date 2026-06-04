import "./ActiveFilters.css";

export default function ActiveFilters({
  selectedCategory, setSelectedCategory,
  selectedSizes,    toggleSize,
  selectedColors,   toggleColor,
  activeFilterCount, resetFilters,
}) {
  if (activeFilterCount === 0) return null;

  return (
    <div className="active-filters">
      <span className="active-filters__label">Filtres actifs :</span>

      {selectedCategory !== "Toutes" && (
        <Chip label={selectedCategory} onRemove={() => setSelectedCategory("Toutes")} />
      )}

      {selectedSizes.map((s) => (
        <Chip key={s} label={`Taille ${s}`} onRemove={() => toggleSize(s)} />
      ))}

      {selectedColors.map((c) => (
        <Chip key={c} label={c} onRemove={() => toggleColor(c)} />
      ))}

      <button className="active-filters__clear" onClick={resetFilters}>
        Tout effacer
      </button>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="active-filters__chip">
      {label}
      <button className="active-filters__chip-remove" onClick={onRemove} aria-label={`Retirer ${label}`}>
        ×
      </button>
    </span>
  );
}
import { SORT_OPTIONS } from "../../data/catalogueData";
import "./CatalogueTopBar.css";

export default function CatalogueTopBar({
  totalCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}) {
  return (
    <div className="topbar">
      {/* Results count */}
      <p className="topbar__count">
        <span className="topbar__count-num">{totalCount}</span> produits trouvés
      </p>

      <div className="topbar__right">
        {/* Sort */}
        <div className="topbar__sort">
          <label className="topbar__sort-label">Trier par</label>
          <select
            className="topbar__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View mode */}
        <div className="topbar__view">
          <button
            className={`topbar__view-btn ${viewMode === "grid" ? "topbar__view-btn--active" : ""}`}
            onClick={() => setViewMode("grid")}
            aria-label="Vue grille"
          >
            ⊞
          </button>
          <button
            className={`topbar__view-btn ${viewMode === "list" ? "topbar__view-btn--active" : ""}`}
            onClick={() => setViewMode("list")}
            aria-label="Vue liste"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
}
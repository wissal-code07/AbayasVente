import { useState } from "react";
import { adminProducts, STATUS_COLORS } from "../../data/adminData";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState(adminProducts);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("tous");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm]         = useState({ name: "", category: "", price: "", stock: "", status: "actif" });

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const handleToggleStatus = (id) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === "actif" ? "inactif" : "actif" } : p
    ));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({ name: product.name, category: product.category, price: product.price, stock: product.stock, status: product.status });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editProduct) {
      setProducts(prev => prev.map(p =>
        p.id === editProduct.id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p
      ));
    }
    setShowForm(false);
    setEditProduct(null);
  };

  return (
    <div className="admin-products">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Gestion Produits</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: "", category: "", price: "", stock: "", status: "actif" }); }}>
          + Ajouter un produit
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSave}>
          <div className="admin-form__header">
            <h3 className="admin-form__title">{editProduct ? "Modifier le produit" : "Nouveau produit"}</h3>
            <button type="button" className="admin-form__close" onClick={() => setShowForm(false)}>✕</button>
          </div>
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label className="admin-form__label">Nom du produit</label>
              <input className="admin-form__input" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Catégorie</label>
              <select className="admin-form__input" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                {["Classique","Soirée","Moderne","Premium"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Prix (DA)</label>
              <input className="admin-form__input" type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Stock</label>
              <input className="admin-form__input" type="number" value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Statut</label>
              <select className="admin-form__input" value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary">Enregistrer</button>
            <button type="button" className="admin-btn admin-btn--outline" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="admin-products__controls">
        <input
          className="admin-search"
          type="text"
          placeholder="🔍  Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="admin-filter-tabs">
          {["tous","actif","inactif"].map(f => (
            <button key={f} className={`admin-filter-tab ${filter === f ? "admin-filter-tab--active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Vendus</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const s = STATUS_COLORS[p.status];
              return (
                <tr key={p.id}>
                  <td>
                    <div className="admin-products__name">
                      <div className="admin-products__thumb" style={{ background: `linear-gradient(135deg, ${p.gradFrom}, ${p.gradTo})` }} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="admin-table__muted">{p.category}</td>
                  <td className="admin-table__price">{formatPrice(p.price)}</td>
                  <td>
                    <span className={`admin-products__stock ${p.stock < 5 ? "admin-products__stock--low" : ""}`}>
                      {p.stock} unités
                    </span>
                  </td>
                  <td className="admin-table__muted">{p.sold}</td>
                  <td>
                    <span className="admin-table__badge" style={{ color: s.color, background: s.bg }}>{p.status}</span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__btn" onClick={() => handleEdit(p)}>Modifier</button>
                      <button className="admin-table__btn admin-table__btn--toggle" onClick={() => handleToggleStatus(p.id)}>
                        {p.status === "actif" ? "Désactiver" : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="admin-products__count">{filtered.length} produit{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</p>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import {
  getAdminProducts, createProduct, updateProduct, toggleProductStatus,
  getProductImages, uploadProductImage, deleteProductImage,
  getCategories, getColors, getSizes
} from "../../services/adminService";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [colors, setColors]             = useState([]);
  const [sizes, setSizes]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("tous");
  const [showForm, setShowForm]         = useState(false);
  const [editProduct, setEditProduct]   = useState(null);
  const [form, setForm]                 = useState({
    name: "", category: "", price: "", stock: "",
    is_active: true, description: "",
    selectedColors: [], selectedSizes: []
  });

  const [images, setImages]             = useState([]);
  const [newFiles, setNewFiles]         = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const fileInputRef                    = useRef(null);

  const fetchProducts = async () => {
    setLoading(true); setError(null);
    try {
      const params = { search: search || undefined, status: filter !== "tous" ? filter : undefined };
      const data   = await getAdminProducts(params);
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch { setError("Impossible de charger les produits"); }
    finally  { setLoading(false); }
  };

  useEffect(() => {
    fetchProducts();
    getCategories().then(d => setCategories(Array.isArray(d) ? d : d.results || [])).catch(() => {});
    getColors().then(d => setColors(Array.isArray(d) ? d : d.results || [])).catch(() => {});
    getSizes().then(d => setSizes(Array.isArray(d) ? d : d.results || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [search, filter]);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const toggleSelection = (field, id) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter(x => x !== id)
        : [...prev[field], id]
    }));
  };

  const openForm = async (product = null) => {
    setEditProduct(product);
    setForm(product ? {
      name:           product.name,
      category:       product.category,
      price:          product.price,
      stock:          product.stock,
      is_active:      product.is_active,
      description:    product.description || "",
      selectedColors: product.colors || [],
      selectedSizes:  product.sizes  || [],
    } : {
      name: "", category: "", price: "", stock: "",
      is_active: true, description: "",
      selectedColors: [], selectedSizes: []
    });
    setNewFiles([]); setPrimaryIndex(0);
    if (product) {
      try { setImages(await getProductImages(product.id)); }
      catch { setImages([]); }
    } else { setImages([]); }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false); setEditProduct(null); setImages([]); setNewFiles([]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name:        form.name,
        category:    form.category,
        price:       form.price,
        stock:       form.stock,
        is_active:   form.is_active,
        description: form.description,
        colors:      form.selectedColors,
        sizes:       form.selectedSizes,
      };
      let savedProduct;
      if (editProduct) {
        savedProduct = await updateProduct(editProduct.id, payload);
      } else {
        savedProduct = await createProduct(payload);
      }
      for (let i = 0; i < newFiles.length; i++) {
        await uploadProductImage(savedProduct.id, newFiles[i], i === primaryIndex);
      }
      fetchProducts();
      closeForm();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleToggle = async (product) => {
    try {
      await toggleProductStatus(product.id, !product.is_active);
      fetchProducts();
    } catch { alert("Erreur lors du changement de statut"); }
  };

  const handleDeleteExistingImage = async (imageId) => {
    try {
      await deleteProductImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch { alert("Erreur lors de la suppression"); }
  };

  if (loading) return <div className="admin-products">Chargement...</div>;
  if (error)   return <div className="admin-products error">{error}</div>;

  return (
    <div className="admin-products">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Gestion Produits</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => openForm()}>+ Ajouter</button>
      </div>

      {showForm && (
        <div className="admin-form">
          <div className="admin-form__header">
            <h3>{editProduct ? "Modifier le produit" : "Nouveau produit"}</h3>
            <button type="button" onClick={closeForm}>✕</button>
          </div>

          <form onSubmit={handleSave}>
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label className="admin-form__label">Nom</label>
                <input className="admin-form__input" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} required />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Catégorie</label>
                <select className="admin-form__input" value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})} required>
                  <option value="">Choisir</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Prix (DA)</label>
                <input className="admin-form__input" type="number" value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})} required />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Stock</label>
                <input className="admin-form__input" type="number" value={form.stock}
                  onChange={e => setForm({...form, stock: e.target.value})} required />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Statut</label>
                <select className="admin-form__input"
                  value={form.is_active ? "actif" : "inactif"}
                  onChange={e => setForm({...form, is_active: e.target.value === "actif"})}>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label">Description</label>
                <input className="admin-form__input" value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})} />
              </div>
            </div>

            {/* ── Couleurs ── */}
            <div className="admin-form__extras">
              <div className="admin-form__extra-block">
                <p className="admin-form__label">Couleurs disponibles</p>
                <div className="admin-form__chips">
                  {colors.map(c => (
                    <button key={c.id} type="button"
                      className={`admin-form__chip admin-form__chip--color ${form.selectedColors.includes(c.id) ? "selected" : ""}`}
                      onClick={() => toggleSelection("selectedColors", c.id)}>
                      <span className="admin-form__chip-dot" style={{ background: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tailles ── */}
              <div className="admin-form__extra-block">
                <p className="admin-form__label">Tailles disponibles</p>
                <div className="admin-form__chips">
                  {sizes.map(s => (
                    <button key={s.id} type="button"
                      className={`admin-form__chip ${form.selectedSizes.includes(s.id) ? "selected" : ""}`}
                      onClick={() => toggleSelection("selectedSizes", s.id)}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Images ── */}
            <div className="admin-form__images-section">
              <p className="admin-form__label">Images du produit</p>
              {images.length > 0 && (
                <div className="admin-form__images-existing">
                  {images.map(img => (
                    <div key={img.id} className={`admin-form__image-item ${img.is_primary ? "primary" : ""}`}>
                      <img src={img.image} alt="" />
                      {img.is_primary && <span className="admin-form__image-badge">Principale</span>}
                      <button type="button" className="admin-form__image-delete"
                        onClick={() => handleDeleteExistingImage(img.id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              {newFiles.length > 0 && (
                <div className="admin-form__images-new">
                  <p className="admin-form__images-hint">Cliquez sur une image pour la définir comme principale</p>
                  <div className="admin-form__images-existing">
                    {newFiles.map((file, i) => (
                      <div key={i}
                        className={`admin-form__image-item ${i === primaryIndex ? "primary" : ""}`}
                        onClick={() => setPrimaryIndex(i)}>
                        <img src={URL.createObjectURL(file)} alt="" />
                        {i === primaryIndex && <span className="admin-form__image-badge">Principale</span>}
                        <button type="button" className="admin-form__image-delete"
                          onClick={ev => { ev.stopPropagation(); setNewFiles(prev => prev.filter((_,j) => j !== i)); }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" className="admin-form__images-add"
                onClick={() => fileInputRef.current.click()}>
                + Ajouter des images
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple
                onChange={e => setNewFiles(prev => [...prev, ...Array.from(e.target.files)])}
                style={{ display: "none" }} />
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="admin-btn admin-btn--primary">Enregistrer</button>
              <button type="button" className="admin-btn admin-btn--outline" onClick={closeForm}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-products__controls">
        <input className="admin-search" type="text" placeholder="🔍 Rechercher..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="admin-filter-tabs">
          {["tous","actif","inactif"].map(f => (
            <button key={f} className={`admin-filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th><th>Catégorie</th><th>Prix</th><th>Stock</th>
              <th>Couleurs</th><th>Tailles</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="8" style={{textAlign:"center"}}>Aucun produit trouvé</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category_name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td><span className={p.stock < 5 ? "low-stock" : ""}>{p.stock} unités</span></td>
                  <td>
                    <div className="admin-table__dots">
                      {(p.colors_names || []).map(c => (
                        <span key={c.id} className="admin-table__color-dot"
                          style={{ background: c.hex }} title={c.name} />
                      ))}
                      {(!p.colors_names || p.colors_names.length === 0) && <span className="admin-table__muted">—</span>}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__sizes">
                      {(p.sizes_names || []).map(s => (
                        <span key={s.id} className="admin-table__size-tag">{s.name}</span>
                      ))}
                      {(!p.sizes_names || p.sizes_names.length === 0) && <span className="admin-table__muted">—</span>}
                    </div>
                  </td>
                  <td><span className={p.is_active ? "active" : "inactive"}>{p.is_active ? "Actif" : "Inactif"}</span></td>
                  <td>
                    <button className="admin-table__btn" onClick={() => openForm(p)}>Modifier</button>
                    <button className="admin-table__btn admin-table__btn--toggle" onClick={() => handleToggle(p)}>
                      {p.is_active ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
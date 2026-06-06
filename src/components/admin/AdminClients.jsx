import { useState } from "react";
import { adminClients, STATUS_COLORS } from "../../data/adminData";
import "./AdminClients.css";

export default function AdminClients() {
  const [clients, setClients] = useState(adminClients);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("tous");

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleToggle = (id) => {
    setClients(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "actif" ? "inactif" : "actif" } : c
    ));
  };

  const totalClients  = clients.length;
  const activeClients = clients.filter(c => c.status === "actif").length;
  const totalRevenue  = clients.reduce((s, c) => s + c.total, 0);

  return (
    <div className="admin-clients">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Gestion Clients</h2>
        <p className="admin-section__date">{totalClients} clients inscrits</p>
      </div>

      {/* Quick stats */}
      <div className="admin-clients__stats">
        <div className="admin-clients__stat">
          <span className="admin-clients__stat-val">{totalClients}</span>
          <span className="admin-clients__stat-label">Total clients</span>
        </div>
        <div className="admin-clients__stat">
          <span className="admin-clients__stat-val" style={{color:"#44aa66"}}>{activeClients}</span>
          <span className="admin-clients__stat-label">Clients actifs</span>
        </div>
        <div className="admin-clients__stat">
          <span className="admin-clients__stat-val">{formatPrice(totalRevenue)}</span>
          <span className="admin-clients__stat-label">CA total clients</span>
        </div>
        <div className="admin-clients__stat">
          <span className="admin-clients__stat-val">{formatPrice(Math.round(totalRevenue / totalClients))}</span>
          <span className="admin-clients__stat-label">Valeur moyenne client</span>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-products__controls">
        <input
          className="admin-search"
          type="text"
          placeholder="🔍  Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="admin-filter-tabs">
          {["tous","actif","inactif"].map(f => (
            <button
              key={f}
              className={`admin-filter-tab ${filter === f ? "admin-filter-tab--active" : ""}`}
              onClick={() => setFilter(f)}
            >
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
              <th>Client</th>
              <th>Email</th>
              <th>Commandes</th>
              <th>Total dépensé</th>
              <th>Inscrit</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => {
              const s = STATUS_COLORS[client.status];
              return (
                <tr key={client.id}>
                  <td>
                    <div className="admin-clients__name">
                      <div className="admin-clients__avatar">
                        {client.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <span>{client.name}</span>
                    </div>
                  </td>
                  <td className="admin-table__muted">{client.email}</td>
                  <td className="admin-table__muted">{client.orders} commande{client.orders > 1 ? "s" : ""}</td>
                  <td className="admin-table__price">{formatPrice(client.total)}</td>
                  <td className="admin-table__muted">{client.joined}</td>
                  <td>
                    <span className="admin-table__badge" style={{ color: s.color, background: s.bg }}>
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__btn admin-table__btn--toggle" onClick={() => handleToggle(client.id)}>
                        {client.status === "actif" ? "Désactiver" : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
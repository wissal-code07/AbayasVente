import { useState, useEffect } from "react";
import { getAdminClients, toggleClientStatus } from "../../services/adminService";
import "./AdminClients.css";

export default function AdminClients() {
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("tous");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        status: filter !== "tous" ? filter : undefined,
      };
      const data         = await getAdminClients(params);
      const clientsArray = Array.isArray(data) ? data : data.results || [];
      setClients(clientsArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, filter]);

  const formatPrice = (p) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

  const handleToggle = async (client) => {
    try {
      await toggleClientStatus(client.id, !client.is_active);
      fetchClients();
    } catch {
      alert("Erreur lors du changement de statut");
    }
  };

  if (loading && clients.length === 0) return <div className="admin-clients">Chargement...</div>;

  const totalClients  = clients.length;
  const activeClients = clients.filter(c => c.is_active).length;
  const totalRevenue  = clients.reduce((s, c) => s + (c.total_spent || 0), 0);

  return (
    <div className="admin-clients">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Gestion Clients</h2>
        <p className="admin-section__date">{totalClients} clients inscrits</p>
      </div>

      <div className="admin-clients__stats">
        <div>
          <span>{totalClients}</span>
          <span>Total clients</span>
        </div>
        <div>
          <span style={{ color: "#44aa66" }}>{activeClients}</span>
          <span>Clients actifs</span>
        </div>
        <div>
          <span>{formatPrice(totalRevenue)}</span>
          <span>CA total</span>
        </div>
        <div>
          <span>{formatPrice(Math.round(totalRevenue / (totalClients || 1)))}</span>
          <span>Valeur moyenne</span>
        </div>
      </div>

      <div className="admin-products__controls">
        <input
          className="admin-search"
          type="text"
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="admin-filter-tabs">
          {["tous", "actif", "inactif"].map(f => (
            <button
              key={f}
              type="button"
              className={`admin-filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td>
                  <div className="admin-clients__name">
                    <span className="admin-clients__avatar">
                      {c.first_name?.[0]}{c.last_name?.[0]}
                    </span>
                    <strong>{c.first_name} {c.last_name}</strong>
                  </div>
                </td>
                <td>{c.email}</td>
                <td>{c.orders_count || 0}</td>
                <td>{formatPrice(c.total_spent || 0)}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={c.is_active ? "active" : "inactive"}>
                    {c.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td>
                  <button className="admin-table__btn" type="button" onClick={() => handleToggle(c)}>
                    {c.is_active ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
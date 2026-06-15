import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";

// ── Produits vedettes (nouveautés en priorité) ──
export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ badge: "new", page: 1 });
        let results = data.results || [];

        // Compléter avec d'autres produits si moins de 4 nouveautés
        if (results.length < 4) {
          const all     = await getProducts({ page: 1 });
          const ids     = results.map(p => p.id);
          const extra   = (all.results || []).filter(p => !ids.includes(p.id));
          results       = [...results, ...extra].slice(0, 4);
        } else {
          results = results.slice(0, 4);
        }
        setProducts(results);
      } catch (err) {
        setError("Erreur chargement produits.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return { products, loading, error };
}

// ── Produits en promotion ──
export function usePromoProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProducts({ badge: "promo", page: 1 })
      .then(data => setProducts((data.results || []).slice(0, 2)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

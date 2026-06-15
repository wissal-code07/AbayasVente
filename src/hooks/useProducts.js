import { useState, useEffect } from "react";
import { getProducts, getCategories, getColors, getSizes } from "../services/productService";

// ── Hook pour la liste des produits avec filtres ──
export function useProducts(filters = {}) {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts(filters);
        setProducts(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 8));
      } catch (err) {
        setError("Erreur lors du chargement des produits.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, totalCount, totalPages };
}

// ── Hook pour les filtres (catégories, couleurs, tailles) ──
export function useProductFilters() {
  const [categories, setCategories] = useState([]);
  const [colors, setColors]         = useState([]);
  const [sizes, setSizes]           = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cats, cols, sizs] = await Promise.all([
          getCategories(),
          getColors(),
          getSizes(),
        ]);
        setCategories(cats);
        setColors(cols);
        setSizes(sizs);
      } catch (err) {
        console.error("Erreur filtres:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  return { categories, colors, sizes, loading };
}

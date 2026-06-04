import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import ProductPage from "./pages/ProductPage";
import "./styles/globals.css";

export default function App() {
  // Navigation state — "home", "catalogue" ou "product"
  const [page, setPage] = useState("home");

  // Produit actuellement affiché sur la page détail
  const [currentProduct, setCurrentProduct] = useState(null);

  // Cart state — partagé entre toutes les pages
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // navigate("product", productObject) pour aller sur le détail
  // navigate("home") ou navigate("catalogue") pour les autres pages
  const navigate = (destination, data = null) => {
    setPage(destination);
    if (destination === "product" && data) {
      setCurrentProduct(data);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "catalogue":
        return (
          <CataloguePage
            onAddToCart={handleAddToCart}
            navigate={navigate}
          />
        );
      case "product":
        return (
          <ProductPage
            product={currentProduct}
            onAddToCart={handleAddToCart}
            navigate={navigate}
          />
        );
      case "home":
      default:
        return (
          <HomePage
            onAddToCart={handleAddToCart}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <>
      <Navbar cartCount={cartCount} navigate={navigate} currentPage={page} />
      <main>{renderPage()}</main>
      <Footer navigate={navigate} />
    </>
  );
}

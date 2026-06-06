import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import ProductPage from "./pages/ProductPage";
import AuthPage from "./pages/AuthPage";
import NouveautesPage from "./pages/NouveautesPage";
import PromotionsPage from "./pages/PromotionsPage";
import AboutPage from "./pages/AboutPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartSidebar from "./components/cart/CartSidebar";
import AdminPage from "./pages/AdminPage";
import "./styles/globals.css";

export default function App() {
  const [page, setPage]                     = useState("home");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [authTab, setAuthTab]               = useState("login");
  const [cart, setCart]                     = useState([]);
  const [cartOpen, setCartOpen]             = useState(false);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize  === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize  === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = (destination, data = null) => {
    if (destination === "login")         { setAuthTab("login");    setPage("auth"); }
    else if (destination === "register") { setAuthTab("register"); setPage("auth"); }
    else {
      setPage(destination);
      if (destination === "product" && data) setCurrentProduct(data);
      // Ferme le panier si on va au checkout
      if (destination === "checkout") setCartOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "catalogue":   return <CataloguePage  onAddToCart={handleAddToCart} navigate={navigate} />;
      case "product":     return <ProductPage     product={currentProduct} onAddToCart={handleAddToCart} navigate={navigate} />;
      case "auth":        return <AuthPage        navigate={navigate} defaultTab={authTab} />;
      case "nouveautes":  return <NouveautesPage  onAddToCart={handleAddToCart} navigate={navigate} />;
      case "promotions":  return <PromotionsPage  onAddToCart={handleAddToCart} navigate={navigate} />;
      case "about":       return <AboutPage       navigate={navigate} />;
      case "account":     return <AccountPage     navigate={navigate} />;
      case "checkout":    return <CheckoutPage    cart={cart} navigate={navigate} />;
      case "admin":       return <AdminPage       navigate={navigate} />;
      case "home":
      default:            return <HomePage        onAddToCart={handleAddToCart} navigate={navigate} />;
    }
  };

  // Checkout et auth ont leur propre layout sans Navbar/Footer
  const isFullPage = page === "checkout" || page === "admin"; // Admin aussi pour le moment, à revoir si on ajoute d'autres pages admin

  if (isFullPage) {
    return renderPage();
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        navigate={navigate}
        currentPage={page}
        onCartOpen={() => setCartOpen(true)}
      />
      <main>{renderPage()}</main>
      <Footer navigate={navigate} />
      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        navigate={navigate}
      />
    </>
  );
}

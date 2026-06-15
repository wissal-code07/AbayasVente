import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import AdminPage from "./pages/AdminPage";
import CartSidebar from "./components/cart/CartSidebar";
import "./styles/globals.css";

function AppContent() {
  const { user, setUser, logout: authLogout } = useAuth();

  const [page, setPage]                     = useState("home");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [authTab, setAuthTab]               = useState("login");
  const [cart, setCart]                     = useState([]);
  const [cartOpen, setCartOpen]             = useState(false);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Vider le panier quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!user) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [user]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id &&
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

  const handleRemoveFromCart = (index) => setCart((prev) => prev.filter((_, i) => i !== index));
  const handleUpdateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  // Fonction pour vider le panier après commande réussie
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = (destination, data = null) => {
    if (destination === "login")         { setAuthTab("login");    setPage("auth"); }
    else if (destination === "register") { setAuthTab("register"); setPage("auth"); }
    else {
      setPage(destination);
      if (destination === "product" && data) setCurrentProduct(data);
      if (destination === "checkout") setCartOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authLogout();
    navigate("home");
  };

  const renderPage = () => {
    switch (page) {
      case "catalogue":  return <CataloguePage  onAddToCart={handleAddToCart} navigate={navigate} />;
      case "product":    return <ProductPage     product={currentProduct} onAddToCart={handleAddToCart} navigate={navigate} />;
      case "auth":       return <AuthPage        navigate={navigate} defaultTab={authTab} onLoginSuccess={handleLoginSuccess} />;
      case "nouveautes": return <NouveautesPage  onAddToCart={handleAddToCart} navigate={navigate} />;
      case "promotions": return <PromotionsPage  onAddToCart={handleAddToCart} navigate={navigate} />;
      case "about":      return <AboutPage       navigate={navigate} />;
      case "account":    return <AccountPage     navigate={navigate} onLogout={handleLogout} />;
      case "checkout":   return <CheckoutPage    cart={cart} navigate={navigate} onOrderSuccess={clearCart} />;
      case "admin":      return <AdminPage       navigate={navigate} />;
      default:           return <HomePage        onAddToCart={handleAddToCart} navigate={navigate} />;
    }
  };

  const isFullPage = page === "checkout" || page === "admin";
  if (isFullPage) return renderPage();

  return (
    <>
      <Navbar
        cartCount={cartCount}
        navigate={navigate}
        currentPage={page}
        onCartOpen={() => setCartOpen(true)}
        user={user}
        onLogout={handleLogout}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
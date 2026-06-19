import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminClients from "../components/admin/AdminClients";
import AdminStats from "../components/admin/AdminStats";
import AdminProfile from "../components/admin/AdminProfile";
import "./AdminPage.css";

export default function AdminPage({ navigate }) {
  const { user, isAuthenticated, isStaff } = useAuth();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated) { navigate("login"); return; }
    if (!isStaff) { navigate("home"); }
  }, [isAuthenticated, isStaff]);

  if (!isAuthenticated || !isStaff) return null;

  const renderSection = () => {
    switch (active) {
      case "products": return <AdminProducts />;
      case "orders":   return <AdminOrders   />;
      case "clients":  return <AdminClients  />;
      case "stats":    return <AdminStats    />;
      case "profile":  return <AdminProfile  />;
      default:         return <AdminDashboard setActive={setActive} />;
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar active={active} setActive={setActive} navigate={navigate} />
      <main className="admin-page__content">{renderSection()}</main>
    </div>
  );
}
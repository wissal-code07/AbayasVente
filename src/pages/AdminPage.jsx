import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminClients from "../components/admin/AdminClients";
import AdminStats from "../components/admin/AdminStats";
import "./AdminPage.css";

export default function AdminPage({ navigate }) {
  const [active, setActive] = useState("dashboard");

  const renderSection = () => {
    switch (active) {
      case "products":  return <AdminProducts />;
      case "orders":    return <AdminOrders   />;
      case "clients":   return <AdminClients  />;
      case "stats":     return <AdminStats    />;
      default:          return <AdminDashboard setActive={setActive} />;
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar active={active} setActive={setActive} navigate={navigate} />
      <main className="admin-page__content">
        {renderSection()}
      </main>
    </div>
  );
}
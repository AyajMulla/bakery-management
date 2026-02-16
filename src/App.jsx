import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "./api/api";

import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ReportsPage from "./pages/ReportsPage";

import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import "./index.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  // ✅ DATE FILTER STATE (THIS WAS MISSING)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =========================
     FETCH PRODUCTS + SALES
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await api.get("/products");
        const salesRes = await api.get("/sales");

        setProducts(productsRes.data);
        setSales(salesRes.data);
      } catch {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []); // ✅ must stay EMPTY

  /* =========================
     ADD PRODUCT
  ========================= */
  const handleAddProduct = async (product) => {
    try {
      const res = await api.post("/products", product);
      setProducts((prev) => [...prev, res.data]);
      toast.success("Product added");
    } catch {
      toast.error("Add failed");
    }
  };

  /* =========================
     SELL PRODUCT
  ========================= */
  const handleSellProduct = async (id, qty) => {
    try {
      const res = await api.post("/sales/sell", {
        productId: id,
        qty
      });

      // update product stock
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? res.data.product : p
        )
      );

      // append new sale
      setSales((prev) => [...prev, res.data.sale]);

      toast.success("Product sold");
    } catch {
      toast.error("Sell failed");
    }
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const handleUpdateProduct = async (product) => {
    try {
      const res = await api.put(
        `/products/${product._id}`,
        product
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? res.data : p
        )
      );

      toast.success("Product updated");
    } catch {
      toast.error("Update failed");
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />

          {/* ================= PRODUCTS ================= */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ProductsPage
                    products={products}
                    sales={sales}
                    onAdd={handleAddProduct}
                    onSell={handleSellProduct}
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* ================= DASHBOARD ================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <DashboardPage
                    products={products}
                    sales={sales}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* ================= REPORTS ================= */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ReportsPage
                    sales={sales}
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                  />
                </>
              </ProtectedRoute>
            }
          />


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

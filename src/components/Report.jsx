import { useMemo, useState, useEffect } from "react";
import { 
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  IndianRupee,
  FileText 
} from "lucide-react";

const PAGE_SIZE = 10;

export default function Report({
  sales = [],
  fromDate,
  toDate,
  setFromDate,
  setToDate
}) {
  // ✅ SAFETY FIX (DO NOT REMOVE)
  const safeSales = Array.isArray(sales) ? sales : [];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* =========================
      FILTER + SEARCH + SORT
  ========================= */
  const filteredSales = useMemo(() => {
    return safeSales
      .filter((sale) => {
        if (!sale) return false;

        const saleDate = new Date(sale.date).toISOString().split("T")[0];

        if (fromDate && saleDate < fromDate) return false;
        if (toDate && saleDate > toDate) return false;

        if (
          search &&
          !sale.productName?.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [safeSales, fromDate, toDate, search]);

  /* =========================
      PAGINATION LOGIC
  ========================= */
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / PAGE_SIZE));

  const paginatedSales = useMemo(() => {
    return filteredSales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredSales, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* =========================
      TOTALS
  ========================= */
  const totalRevenue = useMemo(
    () => filteredSales.reduce((sum, s) => sum + Number(s.total || 0), 0),
    [filteredSales]
  );

  const totalProfit = useMemo(
    () => filteredSales.reduce((sum, s) => sum + Number(s.profit || 0), 0),
    [filteredSales]
  );

  return (
    <div className="container" style={{ animation: "fadeIn 0.6s ease-out" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>
          Sales Analytics
        </h2>
        <p style={{ color: "var(--text-light)" }}>
          Detailed performance report for Taj Enterprises.
        </p>
      </header>

      {/* 📊 SUMMARY KPI CARDS */}
      <div className="dashboard" style={{ marginBottom: "2rem" }}>
        <div className="stat">
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-light)" }}>
            <h3>Total Orders</h3>
            <FileText size={18} />
          </div>
          <span>{filteredSales.length}</span>
          <p style={{ fontSize: "0.75rem", marginTop: "8px", color: "var(--text-light)" }}>
            Successful transactions
          </p>
        </div>

        <div className="stat">
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-light)" }}>
            <h3>Period Revenue</h3>
            <IndianRupee size={18} color="var(--primary)" />
          </div>
          <span>₹{totalRevenue.toLocaleString("en-IN")}</span>
          <p style={{ fontSize: "0.75rem", marginTop: "8px", color: "var(--text-light)" }}>
            Gross sales amount
          </p>
        </div>

        <div
          className="stat"
          style={{
            borderLeft: `4px solid ${
              totalProfit >= 0 ? "var(--success)" : "var(--danger)"
            }`
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-light)" }}>
            <h3>Net Profit</h3>
            <IndianRupee
              size={18}
              color={totalProfit >= 0 ? "var(--success)" : "var(--danger)"}
            />
          </div>
          <span
            style={{
              color: totalProfit >= 0 ? "var(--success)" : "var(--danger)"
            }}
          >
            ₹{totalProfit.toLocaleString("en-IN")}
          </span>
          <p style={{ fontSize: "0.75rem", marginTop: "8px", color: "var(--text-light)" }}>
            {totalProfit >= 0 ? "Profit realized" : "Loss incurred"}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {/* 🔍 FILTER TOOLBAR */}
        <div className="table-header" style={{ display: "flex", gap: "15px", flexWrap: "wrap", padding: "20px" }}>
          <div className="search-container" style={{ flex: "2", minWidth: "250px" }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Filter by product name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flex: "1", minWidth: "250px" }}>
            <div style={{ position: "relative", flex: "1" }}>
              <Calendar size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
              <input
                type="date"
                className="table-input"
                style={{ paddingLeft: "30px", fontSize: "0.85rem" }}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div style={{ position: "relative", flex: "1" }}>
              <Calendar size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
              <input
                type="date"
                className="table-input"
                style={{ paddingLeft: "30px", fontSize: "0.85rem" }}
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* 📋 REPORT TABLE */}
        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Revenue</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-light)" }}>
                    No matching sales records found.
                  </td>
                </tr>
              ) : (
                paginatedSales.map((s) => (
                  <tr key={s._id || s.saleId}>
                    <td data-label="Date" style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>
                      {new Date(s.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                    <td data-label="Product" style={{ fontWeight: "700", color: "var(--primary-dark)" }}>
                      {s.productName}
                    </td>
                    <td data-label="Quantity">{s.quantity}</td>
                    <td data-label="Revenue" style={{ fontWeight: "600" }}>
                      ₹{s.total.toLocaleString("en-IN")}
                    </td>
                    <td
                      data-label="Profit"
                      style={{
                        fontWeight: "800",
                        color: s.profit >= 0 ? "var(--success)" : "var(--danger)"
                      }}
                    >
                      ₹{s.profit.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 📄 PAGINATION */}
        {filteredSales.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
              background: "var(--bg-secondary)"
            }}
          >
            <button
              className="manage-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                background: page === 1 ? "#ccc" : "var(--primary-dark)",
                cursor: page === 1 ? "not-allowed" : "pointer"
              }}
            >
              <ChevronLeft size={18} color="white" />
            </button>

            <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>
              Page <span style={{ color: "var(--accent)" }}>{page}</span> of {totalPages}
            </span>

            <button
              className="manage-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                background: page === totalPages ? "#ccc" : "var(--primary-dark)",
                cursor: page === totalPages ? "not-allowed" : "pointer"
              }}
            >
              <ChevronRight size={18} color="white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
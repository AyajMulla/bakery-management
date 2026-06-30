import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Trash2, AlertOctagon, IndianRupee, ClipboardList, Calendar } from "lucide-react";

export default function WastagePage({ products = [], wastage = [], onLogWastage }) {
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    reason: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productId || !form.quantity || !form.reason) {
      toast.error("Please fill in all fields");
      return;
    }

    onLogWastage(
      form.productId,
      Number(form.quantity),
      form.reason
    );

    setForm({
      productId: "",
      quantity: "",
      reason: ""
    });
  };

  // Calculations
  const totalWastageCost = useMemo(() => {
    return wastage.reduce((sum, w) => sum + Number(w.cost || 0), 0);
  }, [wastage]);

  const totalWastedItems = useMemo(() => {
    return wastage.reduce((sum, w) => sum + Number(w.quantity || 0), 0);
  }, [wastage]);

  return (
    <div className="container" style={{ animation: "fadeIn 0.6s ease-out" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>Wastage Management</h2>
        <p style={{ color: "var(--text-light)" }}>Track and record expired, damaged, or wasted bakery items.</p>
      </header>

      {/* KPI Stats */}
      <div className="dashboard" style={{ marginBottom: "2rem" }}>
        <div className="stat" style={{ borderLeft: "4px solid var(--danger)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-light)" }}>
            <h3>Total Wasted Cost</h3>
            <IndianRupee size={18} color="var(--danger)" />
          </div>
          <span style={{ color: "var(--danger)" }}>₹{totalWastageCost.toLocaleString("en-IN")}</span>
          <p style={{ fontSize: "0.75rem", marginTop: "8px", color: "var(--text-light)" }}>Financial loss write-off</p>
        </div>

        <div className="stat">
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-light)" }}>
            <h3>Total Discarded Units</h3>
            <Trash2 size={18} />
          </div>
          <span>{totalWastedItems}</span>
          <p style={{ fontSize: "0.75rem", marginTop: "8px", color: "var(--text-light)" }}>Total items discarded</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }} className="wastage-layout">
        {/* Log Wastage Card */}
        <div className="card">
          <h3>Log Inventory Wastage</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", marginLeft: "4px" }}>Product</label>
              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                required
                style={{ height: "46px", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--border)", fontSize: "0.9rem" }}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", marginLeft: "4px" }}>Quantity to Discard</label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                style={{ height: "46px", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--border)", fontSize: "0.9rem", margin: 0 }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", marginLeft: "4px" }}>Reason</label>
              <select
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                style={{ height: "46px", padding: "10px", borderRadius: "10px", border: "1.5px solid var(--border)", fontSize: "0.9rem" }}
              >
                <option value="">Select Reason</option>
                <option value="Expired">Expired</option>
                <option value="Spoiled/Molded">Spoiled / Molded</option>
                <option value="Damaged/Dropped">Damaged / Dropped</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="primary" style={{ marginTop: "10px", height: "46px", fontWeight: "bold" }}>
              Record Wastage
            </button>
          </form>
        </div>

        {/* Wastage Logs Table */}
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border-light)" }}>
            <ClipboardList size={22} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Wastage Logs</h3>
          </div>

          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Write-off Cost</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {wastage.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-light)" }}>
                      No wastage logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  wastage.map((w) => (
                    <tr key={w._id}>
                      <td data-label="Date" style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={14} />
                          {new Date(w.date || w.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </div>
                      </td>
                      <td data-label="Product" style={{ fontWeight: "700", color: "var(--primary-dark)" }}>
                        {w.productName}
                      </td>
                      <td data-label="Quantity" style={{ fontWeight: "700" }}>{w.quantity} units</td>
                      <td data-label="Cost" style={{ fontWeight: "800", color: "var(--danger)" }}>
                        ₹{w.cost.toLocaleString("en-IN")}
                      </td>
                      <td data-label="Reason">
                        <span className="reason-tag">{w.reason}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .reason-tag {
          background: #ffebee;
          color: #c62828;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        @media (max-width: 900px) {
          .wastage-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

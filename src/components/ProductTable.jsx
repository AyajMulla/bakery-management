import { useState } from "react";
import toast from "react-hot-toast";
import { 
  Edit3, 
  Trash2, 
  Save, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Layers,
  Search
} from "lucide-react";
import SellProduct from "./SellProduct";

export default function ProductTable({
  products = [],
  sales = [],
  onSell,
  onUpdate,
  onDelete
}) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const startEdit = (product) => {
    setEditId(product._id);
    setEditForm({ ...product });
  };

  const saveEdit = () => {
    onUpdate({
      ...editForm,
      capacity: Number(editForm.capacity),
      quantity: Number(editForm.quantity),
      buyingPrice: Number(editForm.buyingPrice),
      sellingPrice: Number(editForm.sellingPrice)
    });
    toast.success("Product updated successfully!");
    setEditId(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCapacity = (product) => {
    const capacity = Number(product.capacity);
    if (!capacity) return "";
    if (product.category === "Bakery") {
      return capacity >= 1000 ? `${capacity / 1000} kg` : `${capacity} g`;
    }
    if (product.category === "Cold Drink") {
      return capacity >= 1000 ? `${capacity / 1000} L` : `${capacity} ml`;
    }
    return capacity;
  };

  const getProductMetrics = (productId) => {
    const productSales = sales.filter((s) => String(s.productId) === String(productId));
    const revenue = productSales.reduce((sum, s) => sum + Number(s.total || 0), 0);
    const profit = productSales.reduce((sum, s) => sum + Number(s.profit || 0), 0);
    return { revenue, profit };
  };

  return (
    <div className="card" style={{ padding: "0", overflow: "hidden" }}>
      {/* TABLE HEADER WITH SEARCH */}
      <div className="table-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={22} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Inventory Management</h3>
        </div>
        
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search product..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <span className="badge-count">{products.length} Products</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--text-light)" }}>
          <Package size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
          <p>{searchTerm ? "No products match your search." : "No products available in the inventory."}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Capacity</th>
                <th>Stock & Sales</th>
                <th>Financials (₹)</th>
                <th>Analytics</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const { revenue, profit } = getProductMetrics(p._id);
                const isEditing = editId === p._id;
                const isLowStock = p.quantity <= 5;

                return (
                  <tr key={p._id} className={isEditing ? "editing-row" : ""}>
                    <td data-label="Product Info">
                      {isEditing ? (
                        <input
                          className="table-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        <div>
                          <div className="product-name-cell">{p.name}</div>
                          <div className="category-tag">{p.category}</div>
                        </div>
                      )}
                    </td>

                    <td data-label="Capacity">
                      {isEditing ? (
                        <input type="number" className="table-input" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} />
                      ) : formatCapacity(p)}
                    </td>

                    <td data-label="Stock & Sales">
                      {isEditing ? (
                        <input type="number" className="table-input" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} />
                      ) : (
                        <div>
                          <span className={isLowStock ? "stock-critical" : "stock-healthy"}>
                            {p.quantity} Units
                          </span>
                          <div className="sold-subtext">{p.soldQty || 0} Sold</div>
                        </div>
                      )}
                    </td>

                    <td data-label="Financials">
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input type="number" className="table-input sm" value={editForm.buyingPrice} onChange={(e) => setEditForm({ ...editForm, buyingPrice: e.target.value })} />
                          <input type="number" className="table-input sm" value={editForm.sellingPrice} onChange={(e) => setEditForm({ ...editForm, sellingPrice: e.target.value })} />
                        </div>
                      ) : (
                        <div className="price-group">
                          <div>Buy: <span>₹{p.buyingPrice}</span></div>
                          <div className="sell-price">Sell: <span>₹{p.sellingPrice}</span></div>
                        </div>
                      )}
                    </td>

                    <td data-label="Analytics">
                      <div className="rev-text">Rev: ₹{revenue}</div>
                      <div className={`profit-text ${profit < 0 ? 'neg' : 'pos'}`}>
                        {profit < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                        ₹{profit}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="action-stack">
                        {isEditing ? (
                          <div className="edit-btn-group">
                            <button className="success icon-btn" onClick={saveEdit}><Save size={18} /></button>
                            <button className="danger icon-btn" onClick={() => setEditId(null)}><XCircle size={18} /></button>
                          </div>
                        ) : (
                          <>
                            <div className="sell-action-row">
                              <SellProduct product={p} onSell={onSell} />
                            </div>
                            <div className="manage-action-row">
                              <button className="primary manage-btn" onClick={() => startEdit(p)} title="Edit">
                                <Edit3 size={16} />
                              </button>
                              <button className="danger manage-btn" onClick={() => onDelete(p._id)} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .table-header {
          padding: 20px 24px;
          background: var(--bg-secondary);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .search-input {
          width: 100%;
          padding: 10px 15px 10px 40px;
          border-radius: 12px;
          border: 1.5px solid var(--border);
          font-family: inherit;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(109, 76, 65, 0.1);
        }

        .badge-count {
          background: var(--primary-dark);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .inventory-table { width: 100%; border-collapse: collapse; }
        
        /* HEADER VISIBILITY FIX */
        .inventory-table th { 
          text-align: left; 
          padding: 18px 16px; 
          font-size: 0.85rem; 
          background: #4a3728; /* Solid deep brown for contrast */
          color: #ffffff !important; /* Pure white text */
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .inventory-table td { padding: 16px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }

        .product-name-cell { font-weight: 700; color: var(--primary-dark); font-size: 1rem; }
        .category-tag { font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase; margin-top: 2px; }

        .stock-healthy { font-weight: 700; color: var(--primary); }
        .stock-critical { font-weight: 700; color: var(--danger); }
        .sold-subtext { font-size: 0.75rem; color: var(--text-light); margin-top: 2px; }

        .price-group div { font-size: 0.85rem; margin: 2px 0; }
        .price-group span { font-weight: 700; }
        .sell-price { color: var(--accent); }

        .rev-text { font-size: 0.8rem; color: var(--text-light); }
        .profit-text { display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 0.95rem; margin-top: 2px; }
        .profit-text.pos { color: var(--success); }
        .profit-text.neg { color: var(--danger); }

        .action-stack { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }
        .sell-action-row { width: 100%; display: flex; justify-content: flex-end; }
        
        /* IMPROVED SELL TOOL UI */
        .sell-action-row input { 
          width: 100px !important; /* Larger width */
          height: 44px; /* Taller height */
          border: 1.5px solid var(--border); 
          border-radius: 12px 0 0 12px;
          text-align: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--primary-dark);
        }
        
        .sell-action-row button { 
          height: 44px; 
          border-radius: 0 12px 12px 0; 
          padding: 0 20px;
          background: #509e8b !important; /* Teal green matching your Sell button */
          color: white;
          font-weight: 800;
          font-size: 0.95rem;
          box-shadow: none;
        }

        .manage-action-row { display: flex; gap: 8px; }
        .manage-btn { 
          width: 44px; 
          height: 44px; 
          padding: 0 !important; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          border-radius: 12px !important; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .manage-btn.primary { background: #4a3728; }
        .manage-btn.danger { background: #d9534f; }

        .table-input { padding: 10px; border: 1.5px solid var(--border); border-radius: 8px; width: 100%; }

        @media (max-width: 1024px) {
          .table-header { flex-direction: column; align-items: stretch; }
          .search-container { max-width: none; order: 3; }
          .inventory-table thead { display: none; }
          .inventory-table tr { display: block; padding: 20px 15px; border-bottom: 8px solid var(--bg-secondary); }
          .inventory-table td { display: flex; justify-content: space-between; align-items: center; border: none; padding: 10px 0; }
          .inventory-table td::before { content: attr(data-label); font-weight: 800; font-size: 0.85rem; color: var(--text-light); }
          .action-stack { align-items: center; width: 100%; margin-top: 15px; }
          .sell-action-row { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
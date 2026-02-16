import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  BarChart3,
  CheckCircle,
  Activity
} from 'lucide-react';

export default function DashboardPage({ products }) {
  const LOW_STOCK_LIMIT = 5;

  // 1. Core Logic Calculations
  const totalStock = products.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0),
    0
  );

  const lowStockProducts = products.filter(
    p => (Number(p.quantity) || 0) <= LOW_STOCK_LIMIT
  );

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* HEADER SECTION */}
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Dashboard Overview</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Bakery Inventory Summary
        </p>
      </header>

      {/* SUMMARY KPI CARDS */}
      <div className="dashboard">
        <div className="stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)' }}>
            <h3>Total Products</h3>
            <BarChart3 size={18} color="var(--primary)" />
          </div>
          <span>{products.length}</span>
          <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-light)' }}>Unique items in catalog</p>
        </div>

        <div className="stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)' }}>
            <h3>Total Stock</h3>
            <Package size={18} color="var(--primary)" />
          </div>
          <span>{totalStock}</span>
          <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-light)' }}>Total units across all items</p>
        </div>

        <div className="stat" style={{ 
          borderLeft: lowStockProducts.length > 0 ? '4px solid var(--danger)' : '4px solid var(--success)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)' }}>
            <h3>Low Stock Alerts</h3>
            <AlertTriangle size={18} color={lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--success)'} />
          </div>
          <span style={{ color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {lowStockProducts.length}
          </span>
          <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-light)' }}>Items less than stock ({LOW_STOCK_LIMIT})</p>
        </div>
      </div>

      {/* LOW STOCK LIST SECTION */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} /> Low Stock Products
        </h3>

        {lowStockProducts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
            <p style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
              No low-stock products 🎉
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '8px' }}>
              Your bakery inventory levels are currently healthy.
            </p>
          </div>
        ) : (
          <div className="product-card-grid">
            {lowStockProducts.map(p => (
              <div key={p._id} className="product-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ marginBottom: '6px', fontSize: '1.1rem' }}>{p.name}</h4>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>
                      Current Stock: <strong style={{ color: 'var(--danger)', fontSize: '1rem' }}>{p.quantity}</strong>
                    </p>
                  </div>
                  <span className="alert-badge" style={{ 
                    padding: '6px 12px', 
                    background: 'var(--danger)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem',
                    fontWeight: 700 
                  }}>
                    🚨 LOW STOCK
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
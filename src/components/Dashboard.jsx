import { calculateProductMetrics } from "../utils/calculations";

export default function Dashboard({ products = [] }) {
  const LOW_STOCK_LIMIT = 5;

  const lowStockProducts = products.filter(
    (p) => p.quantity <= LOW_STOCK_LIMIT
  );

  const totalStock = products.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  return (
    <div>
      <h2>Dashboard Overview</h2>

      {/* Summary */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <h4>Total Products</h4>
          <span>{products.length}</span>
        </div>

        <div className="summary-card">
          <h4>Total Stock</h4>
          <span>{totalStock}</span>
        </div>

        <div className="summary-card">
          <h4>
            Low Stock Alerts
            {lowStockProducts.length > 0 && (
              <span className="low-stock-badge">
                {lowStockProducts.length}
              </span>
            )}
          </h4>
        </div>
      </div>

      {/* Low Stock Products */}
      <h3 style={{ marginTop: "30px" }}>Low Stock Products</h3>

      <div className="product-card-grid">
        {lowStockProducts.length === 0 ? (
          <p>No low-stock products 🎉</p>
        ) : (
          lowStockProducts.map((product) => {
            const { profit } = calculateProductMetrics(product);

            return (
              <div
                key={product.id}
                className={`product-card ${
                  profit < 0 ? "loss-border" : "profit-border"
                }`}
              >
                <h4>{product.name}</h4>

                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Capacity:</strong> {product.capacity}</p>
                <p><strong>Stock:</strong> {product.quantity}</p>

                {/* ALERT BADGE */}
                <span className="alert-badge">
                  🚨 Low Stock
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

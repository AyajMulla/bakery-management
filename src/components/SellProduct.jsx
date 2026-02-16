import { useState } from "react";

export default function SellProduct({ product, onSell }) {
  const [qty, setQty] = useState(1);

  const handleSell = () => {
    if (!qty || qty <= 0) return;

    // ✅ FIX 1: use _id (MongoDB ID)
    onSell(product._id, qty);

    setQty(1);
  };

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <input
        type="number"
        min="1"
        max={product.quantity}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))} // ✅ FIX 2
        style={{ width: "60px" }}
      />
      <button className="success" onClick={handleSell}>
        Sell
      </button>
    </div>
  );
}

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProduct({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    capacity: "",
    quantity: "",
    buyingPrice: "",
    sellingPrice: "",
    expiryDate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setForm({ ...form, category: value, capacity: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let numericCapacity = form.capacity;

    // 🔥 Convert Cold Drink "500 ml" → 500
    if (form.category === "Cold Drink") {
      numericCapacity = Number(form.capacity.split(" ")[0]);
    }

    // 🔥 Convert Bakery input to number
    if (form.category === "Bakery") {
      numericCapacity = Number(form.capacity);
    }

    if (isNaN(numericCapacity)) {
      toast.error("Invalid capacity");
      return;
    }

    onAdd({
      name: form.name,
      category: form.category,
      capacity: numericCapacity,   // ✅ PURE NUMBER
      quantity: Number(form.quantity),
      buyingPrice: Number(form.buyingPrice),
      sellingPrice: Number(form.sellingPrice),
      soldQty: 0,
      expiryDate: form.expiryDate || undefined
    });

    toast.success("Product added successfully!");

    setForm({
      name: "",
      category: "",
      capacity: "",
      quantity: "",
      buyingPrice: "",
      sellingPrice: "",
      expiryDate: ""
    });
  };

  return (
    <div className="card">
      <h3>Add Product</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Bakery">Bakery</option>
          <option value="Cold Drink">Cold Drink</option>
        </select>

        {form.category === "Cold Drink" && (
          <select
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          >
            <option value="">Select Capacity</option>
            <option value="100 ml">100 ml</option>
            <option value="200 ml">200 ml</option>
            <option value="250 ml">250 ml</option>
            <option value="300 ml">300 ml</option>
            <option value="500 ml">500 ml</option>
            <option value="600 ml">600 ml</option>
            <option value="750 ml">750 ml</option>
            <option value="1000 ml">1000 ml</option>
            <option value="1500 ml">1500 ml</option>
            <option value="1750 ml">1750 ml</option>
            <option value="2000 ml">2000 ml</option>
            <option value="2250 ml">2250 ml</option>
            <option value="2500 ml">2500 ml</option>
            
          </select>
        )}

        {form.category === "Bakery" && (
          <input
            name="capacity"
            placeholder="Capacity (grams)"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="buyingPrice"
          placeholder="Buying Price"
          value={form.buyingPrice}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="sellingPrice"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={handleChange}
          required
        />

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px', textAlign: 'left', margin: '0 0 10px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', marginLeft: '4px' }}>Expiry Date (Optional)</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            style={{ margin: 0, height: '40px' }}
          />
        </div>

        <button className="primary">Add Product</button>
      </form>
    </div>
  );
}

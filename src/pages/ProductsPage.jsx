import AddProduct from "../components/AddProduct";
import ProductTable from "../components/ProductTable";

export default function ProductsPage({
  products,
  sales,
  onAdd,
  onSell,
  onUpdate,
  onDelete
}) {
  return (
    <>
      <AddProduct onAdd={onAdd} />

      <br></br>

      <ProductTable
        products={products}
        sales={sales}
        onSell={onSell}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
}

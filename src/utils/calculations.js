export const calculateProductMetrics = (product) => {
  if (!product) return { cost: 0, revenue: 0, profit: 0 };

  const sold = Number(product.soldQty || 0);
  const buying = Number(product.buyingPrice || 0);
  const selling = Number(product.sellingPrice || 0);

  const cost = buying * sold;
  const revenue = selling * sold;
  const profit = revenue - cost;

  return { cost, revenue, profit };
};

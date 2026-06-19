export function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000) {
    return "₹" + (amount / 1000).toFixed(1) + "k";
  }
  return formatCurrency(amount);
}

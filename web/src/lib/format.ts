const inrFormat = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

export const inr = (value: number) => inrFormat.format(value);
export const compact = (value: number) => compactFormat.format(value);

export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

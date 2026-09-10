export const fmt = (n) =>
  new Intl.NumberFormat("es-PA", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );

export const monthLabel = (key) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  const s = d.toLocaleDateString("es-PA", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const quincenaOfDate = (dateStr) => {
  const day = Number(dateStr.split("-")[2]);
  return day <= 15 ? "Q1" : "Q2";
};

export const monthKeyOfDate = (dateStr) => dateStr.slice(0, 7);

export const shiftMonth = (key, delta) => {
  let [y, m] = key.split("-").map(Number);
  m += delta;
  if (m > 12) { m = 1; y += 1; }
  if (m < 1) { m = 12; y -= 1; }
  return `${y}-${String(m).padStart(2, "0")}`;
};

export const uid = () => Math.random().toString(36).slice(2, 10);

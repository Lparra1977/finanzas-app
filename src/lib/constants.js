/* ---------------------------------------------------------------
   PALETA / TOKENS DE DISEÑO
--------------------------------------------------------------- */
export const C = {
  bg: "#EAECEF",
  paper: "#FFFFFF",
  paperSoft: "#F4F5F7",
  ink: "#16232F",
  inkSoft: "#5C6B79",
  inkFaint: "#8A96A3",
  line: "#DCE1E6",
  lineStrong: "#C3CBD3",
  navy: "#16232F",
  teal: "#2E7D6B",
  tealSoft: "#E4F1EC",
  amber: "#B9822E",
  amberSoft: "#FBF1DD",
  red: "#B23A48",
  redSoft: "#FBE7E9",
};

export const BANK_COLORS = {
  DAVIVIENDA: "#D0342C",
  BANESCO: "#00539B",
  "BANCO GENERAL": "#1E7A46",
  BANISTMO: "#F58220",
  EFECTIVO: "#6B7280",
  OTRO: "#8A96A3",
};

export const BANKS = ["DAVIVIENDA", "BANESCO", "BANCO GENERAL", "BANISTMO", "EFECTIVO", "OTRO"];

export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');";

export const DEFAULT_CATALOG = [
  { id: "c1", name: "Préstamo", category: "Gasto", q1: 0, q2: 0, banco: "DAVIVIENDA", active: true },
  { id: "c2", name: "Hipoteca / Alquiler", category: "Gasto", q1: 0, q2: 0, banco: "BANESCO", active: true },
  { id: "c3", name: "Super", category: "Gasto", q1: 0, q2: 0, banco: "BANCO GENERAL", active: true },
  { id: "c4", name: "Seguro Carro", category: "Gasto", q1: 0, q2: 0, banco: "BANISTMO", active: true },
  { id: "c5", name: "Seguro Vida", category: "Gasto", q1: 0, q2: 0, banco: "BANISTMO", active: true },
  { id: "c6", name: "Cable / Internet", category: "Gasto", q1: 0, q2: 0, banco: "BANCO GENERAL", active: true },
  { id: "c7", name: "Mantenimiento", category: "Gasto", q1: 0, q2: 0, banco: "BANCO GENERAL", active: true },
  { id: "c8", name: "Ahorro 1", category: "Ahorro", q1: 0, q2: 0, banco: "BANISTMO", active: true },
  { id: "c9", name: "Ahorro 2", category: "Ahorro", q1: 0, q2: 0, banco: "BANCO GENERAL", active: true },
  { id: "c10", name: "Gasolina", category: "Gasto", q1: 0, q2: 0, banco: "BANCO GENERAL", active: true },
  { id: "c11", name: "Celular", category: "Gasto", q1: 0, q2: 0, banco: "BANCO GENERAL", active: true },
];

export const DEFAULT_DATA = {
  catalog: DEFAULT_CATALOG,
  settings: { alertWarn: 85, alertDanger: 95 },
  periods: {},
  transactions: [],
  version: 1,
};

export const CATEGORY_SUGGESTIONS = ["Comida", "Transporte", "Entretenimiento", "Salud", "Compras", "Delivery", "Otros"];

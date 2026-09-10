import React, { useState } from "react";
import { PlusCircle, CheckCircle2, Trash2 } from "lucide-react";
import { C, BANKS, CATEGORY_SUGGESTIONS } from "../lib/constants";
import { fmt, quincenaOfDate, monthLabel, uid } from "../lib/utils";
import { Card, BankDot, labelStyle, inputStyle } from "../components/ui";

export default function RegistrarTab({ data, update }) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Comida");
  const [banco, setBanco] = useState("BANCO GENERAL");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [justAdded, setJustAdded] = useState(false);

  const todayMonthKey = date.slice(0, 7);
  const q = quincenaOfDate(date);

  const submit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    const tx = { id: uid(), date, desc: desc.trim(), amount: val, category, banco };
    update((d) => ({ ...d, transactions: [...d.transactions, tx] }));
    setAmount("");
    setDesc("");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const recent = data.transactions.filter((t) => t.date === date).slice().reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: C.ink, marginBottom: 4 }}>
          Registrar gasto
        </div>
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: C.inkFaint, marginBottom: 16 }}>
          Se asigna automáticamente a {q === "Q1" ? "la primera quincena (1–15)" : "la segunda quincena (16–fin)"} de {monthLabel(todayMonthKey)}.
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>Monto</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
              style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600, padding: "12px 14px" }}
            />
          </div>
          <div>
            <label style={labelStyle}>Descripción (opcional)</label>
            <input type="text" placeholder="Ej. almuerzo, gasolina extra…" value={desc} onChange={(e) => setDesc(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <input list="cats" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} />
              <datalist id="cats">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={labelStyle}>Banco</label>
              <select value={banco} onChange={(e) => setBanco(e.target.value)} style={inputStyle}>
                {BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <button
            type="submit"
            style={{
              marginTop: 4,
              background: C.navy,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "13px 16px",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {justAdded ? (
              <>
                <CheckCircle2 size={17} /> Agregado
              </>
            ) : (
              <>
                <PlusCircle size={17} /> Agregar gasto
              </>
            )}
          </button>
        </form>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 10 }}>
          Registrado el {date}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recent.length === 0 && <div style={{ fontSize: 13, color: C.inkFaint, fontFamily: "'IBM Plex Sans', sans-serif" }}>Nada todavía hoy.</div>}
          {recent.map((t) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px dashed ${C.line}` }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, color: C.ink, display: "flex", alignItems: "center" }}>
                <BankDot banco={t.banco} />
                {t.desc || t.category}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5 }}>{fmt(t.amount)}</span>
                <button
                  onClick={() => update((d) => ({ ...d, transactions: d.transactions.filter((x) => x.id !== t.id) }))}
                  style={{ border: "none", background: "none", cursor: "pointer", color: C.inkFaint, display: "flex" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

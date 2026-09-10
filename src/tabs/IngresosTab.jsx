import React from "react";
import { C } from "../lib/constants";
import { fmt, monthLabel, shiftMonth } from "../lib/utils";
import { Card, MonthSwitcher, labelStyle, inputStyle } from "../components/ui";

export default function IngresosTab({ data, update, monthKey, setMonthKey }) {
  const period = data.periods[monthKey] || { q1Income: 0, q2Income: 0 };

  const setIncome = (field, value) => {
    update((d) => ({
      ...d,
      periods: { ...d.periods, [monthKey]: { ...(d.periods[monthKey] || { q1Income: 0, q2Income: 0 }), [field]: parseFloat(value) || 0 } },
    }));
  };

  const copyPrevious = () => {
    const prevKey = shiftMonth(monthKey, -1);
    const prev = data.periods[prevKey];
    if (!prev) return;
    update((d) => ({ ...d, periods: { ...d.periods, [monthKey]: { ...prev } } }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <MonthSwitcher monthKey={monthKey} setMonthKey={setMonthKey} />
        <button
          onClick={copyPrevious}
          style={{ border: `1px solid ${C.line}`, background: C.paper, borderRadius: 8, padding: "7px 12px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: C.inkSoft, cursor: "pointer" }}
        >
          Copiar ingresos del mes anterior
        </button>
      </div>
      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 16 }}>
          Ingresos de {monthLabel(monthKey)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Ingreso quincena 1 (1–15)</label>
            <input
              type="number"
              step="0.01"
              value={period.q1Income || ""}
              onChange={(e) => setIncome("q1Income", e.target.value)}
              style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 600, padding: "10px 12px" }}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={labelStyle}>Ingreso quincena 2 (16–fin)</label>
            <input
              type="number"
              step="0.01"
              value={period.q2Income || ""}
              onChange={(e) => setIncome("q2Income", e.target.value)}
              style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 600, padding: "10px 12px" }}
              placeholder="0.00"
            />
          </div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${C.line}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.inkSoft }}>Ingreso total del mes</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, color: C.ink }}>
            {fmt((period.q1Income || 0) + (period.q2Income || 0))}
          </span>
        </div>
      </Card>
    </div>
  );
}

import React, { useMemo } from "react";
import { C, BANK_COLORS } from "../lib/constants";
import { fmt, monthLabel } from "../lib/utils";
import { usePeriodComputation } from "../lib/usePeriodComputation";
import { Card, StatBlock, LedgerBar, MonthSwitcher, BankDot } from "../components/ui";

export default function ReporteTab({ data, monthKey, setMonthKey }) {
  const calcQ1 = usePeriodComputation(data, monthKey, "Q1");
  const calcQ2 = usePeriodComputation(data, monthKey, "Q2");
  const calcAll = usePeriodComputation(data, monthKey, "ALL");

  const byCategory = useMemo(() => {
    const map = {};
    calcAll.txInScope.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    data.catalog
      .filter((c) => c.active)
      .forEach((c) => {
        const key = c.category === "Ahorro" ? "Ahorro programado" : "Gastos fijos";
        map[key] = (map[key] || 0) + c.q1 + c.q2;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [calcAll, data.catalog]);

  const byBank = useMemo(() => {
    const map = {};
    const add = (b, amt) => {
      map[b] = (map[b] || 0) + amt;
    };
    data.catalog.filter((c) => c.active).forEach((c) => add(c.banco, c.q1 + c.q2));
    calcAll.txInScope.forEach((t) => add(t.banco, t.amount));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [calcAll, data.catalog]);

  const maxCat = Math.max(1, ...byCategory.map(([, v]) => v));
  const maxBank = Math.max(1, ...byBank.map(([, v]) => v));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <MonthSwitcher monthKey={monthKey} setMonthKey={setMonthKey} />

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 14 }}>
          Balance de {monthLabel(monthKey)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16 }}>
          <StatBlock label="Ingreso total" value={fmt(calcAll.income)} />
          <StatBlock label="Gasto fijo" value={fmt(calcAll.fixedGasto)} />
          <StatBlock label="Gasto variable" value={fmt(calcAll.variableGasto)} />
          <StatBlock label="Ahorro programado" value={fmt(calcAll.fixedAhorro)} tone="teal" />
          <StatBlock label="Saldo libre" value={fmt(calcAll.saldoLibre)} tone={calcAll.saldoLibre < 0 ? "red" : undefined} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="report-grid">
        <Card>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 4 }}>Quincena 1</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.inkFaint, marginBottom: 8 }}>
            {fmt(calcQ1.gastoTotal)} de {fmt(calcQ1.income)} ingreso
          </div>
          <LedgerBar pct={calcQ1.pct} warn={data.settings.alertWarn} danger={data.settings.alertDanger} />
        </Card>
        <Card>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 4 }}>Quincena 2</div>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.inkFaint, marginBottom: 8 }}>
            {fmt(calcQ2.gastoTotal)} de {fmt(calcQ2.income)} ingreso
          </div>
          <LedgerBar pct={calcQ2.pct} warn={data.settings.alertWarn} danger={data.settings.alertDanger} />
        </Card>
      </div>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 12 }}>Por categoría</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {byCategory.map(([cat, val]) => (
            <div key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.ink, marginBottom: 3 }}>
                <span>{cat}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(val)}</span>
              </div>
              <div style={{ height: 8, background: C.paperSoft, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(val / maxCat) * 100}%`, background: cat === "Ahorro programado" ? C.teal : C.navy, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 12 }}>Por banco</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {byBank.map(([b, val]) => (
            <div key={b}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.ink, marginBottom: 3 }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <BankDot banco={b} />
                  {b}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(val)}</span>
              </div>
              <div style={{ height: 8, background: C.paperSoft, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(val / maxBank) * 100}%`, background: BANK_COLORS[b] || BANK_COLORS.OTRO, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 12 }}>
          Detalle de gastos variables ({calcAll.txInScope.length})
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                {["Fecha", "Descripción", "Categoría", "Banco", "Monto"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, color: C.inkFaint, textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calcAll.txInScope
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((t) => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td style={{ padding: "6px 8px", fontFamily: "'IBM Plex Mono', monospace", color: C.inkSoft }}>{t.date}</td>
                    <td style={{ padding: "6px 8px" }}>{t.desc || "—"}</td>
                    <td style={{ padding: "6px 8px", color: C.inkSoft }}>{t.category}</td>
                    <td style={{ padding: "6px 8px", color: C.inkSoft }}>{t.banco}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "'IBM Plex Mono', monospace", textAlign: "right" }}>{fmt(t.amount)}</td>
                  </tr>
                ))}
              {calcAll.txInScope.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "12px 8px", color: C.inkFaint, fontStyle: "italic" }}>
                    Sin gastos variables este mes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

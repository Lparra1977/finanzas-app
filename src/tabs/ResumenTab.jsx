import React, { useState } from "react";
import { Settings2, Trash2 } from "lucide-react";
import { C } from "../lib/constants";
import { fmt } from "../lib/utils";
import { usePeriodComputation } from "../lib/usePeriodComputation";
import { Card, StatBlock, LedgerBar, AlertBanner, BankDot, CategoryBadge, MonthSwitcher, QuincenaTabs } from "../components/ui";

export default function ResumenTab({ data, update, monthKey, setMonthKey, quincena, setQuincena }) {
  const calc = usePeriodComputation(data, monthKey, quincena);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <MonthSwitcher monthKey={monthKey} setMonthKey={setMonthKey} />
        <button
          onClick={() => setShowSettings((s) => !s)}
          style={{
            border: `1px solid ${C.line}`,
            background: C.paper,
            borderRadius: 8,
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 12.5,
            color: C.inkSoft,
          }}
        >
          <Settings2 size={14} /> Umbrales de alerta
        </button>
      </div>

      {showSettings && (
        <Card>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.inkSoft }}>
              Alerta amarilla ("ojo, llegando al límite") en %:
              <input
                type="number"
                value={data.settings.alertWarn}
                onChange={(e) => update((d) => ({ ...d, settings: { ...d.settings, alertWarn: Number(e.target.value) } }))}
                style={{ marginLeft: 8, width: 70, padding: "4px 8px", border: `1px solid ${C.line}`, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace" }}
              />
            </label>
            <label style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.inkSoft }}>
              Alerta roja ("ya te pasaste") en %:
              <input
                type="number"
                value={data.settings.alertDanger}
                onChange={(e) => update((d) => ({ ...d, settings: { ...d.settings, alertDanger: Number(e.target.value) } }))}
                style={{ marginLeft: 8, width: 70, padding: "4px 8px", border: `1px solid ${C.line}`, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace" }}
              />
            </label>
          </div>
        </Card>
      )}

      <QuincenaTabs value={quincena} onChange={setQuincena} />

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
          <StatBlock label="Ingreso del periodo" value={fmt(calc.income)} />
          <StatBlock
            label="Gasto total"
            value={fmt(calc.gastoTotal)}
            tone={calc.pct >= data.settings.alertDanger ? "red" : calc.pct >= data.settings.alertWarn ? "amber" : undefined}
          />
          <StatBlock label="Ahorro programado" value={fmt(calc.fixedAhorro)} tone="teal" />
          <StatBlock label="Saldo libre" value={fmt(calc.saldoLibre)} tone={calc.saldoLibre < 0 ? "red" : undefined} />
        </div>
        <LedgerBar pct={calc.pct} warn={data.settings.alertWarn} danger={data.settings.alertDanger} />
        {calc.income > 0 ? (
          <AlertBanner pct={calc.pct} warn={data.settings.alertWarn} danger={data.settings.alertDanger} />
        ) : (
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: C.inkFaint, fontStyle: "italic" }}>
            Registra el ingreso de este periodo en la pestaña "Ingresos" para activar la alerta.
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 10 }}>
          Gastos fijos activos en este periodo
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {calc.activeFixedItems.length === 0 && (
            <div style={{ fontSize: 13, color: C.inkFaint, fontFamily: "'IBM Plex Sans', sans-serif" }}>Ninguno activo.</div>
          )}
          {calc.activeFixedItems.map((c) => {
            const amt = quincena === "ALL" ? c.q1 + c.q2 : quincena === "Q1" ? c.q1 : c.q2;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px dashed ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, color: C.ink }}>
                  <BankDot banco={c.banco} />
                  {c.name}
                  <span style={{ marginLeft: 8 }}>
                    <CategoryBadge category={c.category} />
                  </span>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, color: C.ink }}>{fmt(amt)}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 10 }}>
          Gastos variables del periodo
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {calc.txInScope.length === 0 && (
            <div style={{ fontSize: 13, color: C.inkFaint, fontFamily: "'IBM Plex Sans', sans-serif" }}>Sin gastos registrados todavía.</div>
          )}
          {calc.txInScope
            .slice()
            .reverse()
            .map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px dashed ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, color: C.ink }}>
                  <BankDot banco={t.banco} />
                  <span>{t.desc || t.category}</span>
                  <span style={{ color: C.inkFaint, fontSize: 12 }}>
                    · {t.category} · {t.date}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, color: C.ink }}>{fmt(t.amount)}</div>
                  <button
                    onClick={() => update((d) => ({ ...d, transactions: d.transactions.filter((x) => x.id !== t.id) }))}
                    style={{ border: "none", background: "none", cursor: "pointer", color: C.inkFaint, display: "flex" }}
                    title="Eliminar"
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

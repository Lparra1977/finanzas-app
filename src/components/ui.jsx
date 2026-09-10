import React from "react";
import { CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { C, BANK_COLORS } from "../lib/constants";
import { monthLabel, shiftMonth } from "../lib/utils";

export function BankDot({ banco }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: 999,
        background: BANK_COLORS[banco] || BANK_COLORS.OTRO,
        marginRight: 6,
        flexShrink: 0,
      }}
    />
  );
}

export function CategoryBadge({ category }) {
  const isAhorro = category === "Ahorro";
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 999,
        color: isAhorro ? C.teal : C.inkSoft,
        background: isAhorro ? C.tealSoft : C.paperSoft,
        border: `1px solid ${isAhorro ? C.teal : C.line}`,
        whiteSpace: "nowrap",
      }}
    >
      {isAhorro ? "Ahorro" : "Gasto fijo"}
    </span>
  );
}

export function LedgerBar({ pct, warn, danger }) {
  const clamped = Math.min(pct, 100);
  const color = pct >= danger ? C.red : pct >= warn ? C.amber : C.teal;
  return (
    <div style={{ position: "relative", marginTop: 18, marginBottom: 8 }}>
      <div
        style={{
          height: 14,
          borderRadius: 7,
          background: C.paperSoft,
          border: `1px solid ${C.line}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clamped}%`,
            background: color,
            transition: "width 0.5s ease",
            borderRadius: 7,
          }}
        />
        {[warn, danger].map((t) => (
          <div
            key={t}
            style={{ position: "absolute", top: 0, bottom: 0, left: `${t}%`, width: 2, background: C.navy, opacity: 0.35 }}
          />
        ))}
      </div>
      <div style={{ position: "relative", height: 16 }}>
        {[warn, danger].map((t) => (
          <span
            key={t}
            style={{
              position: "absolute",
              left: `${t}%`,
              transform: "translateX(-50%)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: C.inkFaint,
              top: 2,
            }}
          >
            {t}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function AlertBanner({ pct, warn, danger }) {
  let mode = "ok";
  if (pct >= danger) mode = "danger";
  else if (pct >= warn) mode = "warn";

  const config = {
    ok: { bg: C.tealSoft, fg: C.teal, icon: CheckCircle2, text: "Vas bien. Margen saludable respecto al ingreso." },
    warn: { bg: C.amberSoft, fg: C.amber, icon: AlertTriangle, text: "Ojo, llegando al límite." },
    danger: { bg: C.redSoft, fg: C.red, icon: AlertTriangle, text: "Ya te pasaste." },
  }[mode];
  const Icon = config.icon;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: config.bg,
        color: config.fg,
        borderRadius: 10,
        padding: "12px 14px",
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span>{config.text}</span>
      <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{pct.toFixed(1)}%</span>
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, ...style }}>
      {children}
    </div>
  );
}

export function StatBlock({ label, value, sub, tone }) {
  const color = tone === "teal" ? C.teal : tone === "red" ? C.red : tone === "amber" ? C.amber : C.ink;
  return (
    <div>
      <div
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          color: C.inkFaint,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 600, color, marginTop: 2 }}>{value}</div>
      {sub && (
        <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: C.inkFaint, marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

export function MonthSwitcher({ monthKey, setMonthKey }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={() => setMonthKey(shiftMonth(monthKey, -1))}
        style={{ border: `1px solid ${C.line}`, background: C.paper, borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}
      >
        <ChevronLeft size={16} color={C.ink} />
      </button>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: C.ink, minWidth: 150, textAlign: "center" }}>
        {monthLabel(monthKey)}
      </div>
      <button
        onClick={() => setMonthKey(shiftMonth(monthKey, 1))}
        style={{ border: `1px solid ${C.line}`, background: C.paper, borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}
      >
        <ChevronRight size={16} color={C.ink} />
      </button>
    </div>
  );
}

export function QuincenaTabs({ value, onChange }) {
  const opts = [
    { id: "Q1", label: "Q1 (1–15)" },
    { id: "Q2", label: "Q2 (16–fin)" },
    { id: "ALL", label: "Mes completo" },
  ];
  return (
    <div style={{ display: "flex", gap: 6, background: C.paperSoft, padding: 4, borderRadius: 10, border: `1px solid ${C.line}` }}>
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            flex: 1,
            border: "none",
            borderRadius: 7,
            padding: "7px 8px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600,
            fontSize: 12.5,
            cursor: "pointer",
            background: value === o.id ? C.navy : "transparent",
            color: value === o.id ? "#fff" : C.inkSoft,
            whiteSpace: "nowrap",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const labelStyle = {
  display: "block",
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: 11.5,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.3,
  color: C.inkFaint,
  marginBottom: 5,
};

export const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px",
  border: `1px solid ${C.line}`,
  borderRadius: 8,
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: 14,
  color: C.ink,
  background: "#fff",
};

export const miniInput = {
  padding: "5px 8px",
  border: `1px solid ${C.line}`,
  borderRadius: 6,
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: 12.5,
  color: C.ink,
  background: "#fff",
};

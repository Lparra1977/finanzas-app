import React from "react";
import { Wallet, PlusCircle, ListChecks, DollarSign, BarChart3, PiggyBank, LogOut } from "lucide-react";
import { C } from "../lib/constants";

export const TABS = [
  { id: "resumen", label: "Resumen", icon: Wallet },
  { id: "registrar", label: "Registrar", icon: PlusCircle },
  { id: "catalogo", label: "Catálogo", icon: ListChecks },
  { id: "ingresos", label: "Ingresos", icon: DollarSign },
  { id: "reporte", label: "Reporte", icon: BarChart3 },
];

export function NavDesktop({ active, setActive, onLogout, userEmail }) {
  return (
    <div className="md:flex" style={{ display: "none" }}>
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: C.navy,
          minHeight: "100%",
          padding: "24px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ padding: "0 10px 20px 10px", fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#fff" }}>
          <PiggyBank size={20} style={{ display: "inline", marginRight: 8, marginBottom: -4 }} />
          Finanzas
        </div>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={17} />
              {t.label}
            </button>
          );
        })}
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {userEmail && (
            <div
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                padding: "0 10px 8px 10px",
                wordBreak: "break-all",
              }}
            >
              {userEmail}
            </div>
          )}
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              width: "100%",
            }}
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export function NavMobile({ active, setActive }) {
  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.navy,
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 4px calc(8px + env(safe-area-inset-bottom))",
        zIndex: 50,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
      }}
    >
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              background: "none",
              border: "none",
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            <Icon size={19} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { PiggyBank, LogOut } from "lucide-react";
import { db } from "./lib/firebase";
import { DEFAULT_DATA, C, FONT_IMPORT } from "./lib/constants";
import { todayKey } from "./lib/utils";
import { NavDesktop, NavMobile } from "./components/Nav";
import ResumenTab from "./tabs/ResumenTab";
import RegistrarTab from "./tabs/RegistrarTab";
import CatalogoTab from "./tabs/CatalogoTab";
import IngresosTab from "./tabs/IngresosTab";
import ReporteTab from "./tabs/ReporteTab";

export default function FinanzasApp({ user, onLogout }) {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumen");
  const [monthKey, setMonthKey] = useState(todayKey());
  const [quincena, setQuincena] = useState(() => (new Date().getDate() <= 15 ? "Q1" : "Q2"));
  const saveTimer = useRef(null);

  // Escucha en tiempo real los datos guardados en Firestore para este usuario.
  // Cualquier cambio hecho desde otro dispositivo (celular <-> laptop) llega aquí automáticamente.
  useEffect(() => {
    const ref = doc(db, "users", user.uid, "appData", "main");
    const unsub = onSnapshot(
      ref,
      async (snap) => {
        if (snap.exists()) {
          const remote = snap.data();
          setData({ ...DEFAULT_DATA, ...remote, settings: { ...DEFAULT_DATA.settings, ...(remote.settings || {}) } });
          setLoading(false);
        } else {
          // Primera vez que este usuario entra: sembramos el catálogo por defecto.
          await setDoc(ref, DEFAULT_DATA);
        }
      },
      (err) => {
        console.error("Error escuchando datos:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, [user.uid]);

  // Actualiza el estado local al instante y guarda en Firestore con un pequeño
  // debounce para no escribir en cada pulsación de tecla.
  const update = (updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const ref = doc(db, "users", user.uid, "appData", "main");
        setDoc(ref, next).catch((e) => console.error("Error guardando:", e));
      }, 400);
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'IBM Plex Sans', sans-serif", color: C.inkSoft }}>
        <style>{FONT_IMPORT}</style>
        Cargando tus datos…
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        input:focus, select:focus, button:focus { outline: 2px solid #16232F55; outline-offset: 1px; }
        @media (min-width: 768px) { .md\\:flex { display: flex !important; } .md\\:hidden { display: none !important; } }
        @media (max-width: 767px) { .md\\:flex { display: none !important; } .md\\:hidden { display: flex !important; } .report-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <NavDesktop active={activeTab} setActive={setActiveTab} onLogout={onLogout} userEmail={user.email} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 90px 16px" }}>
          <div className="md:hidden" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: C.ink }}>
              <PiggyBank size={22} color={C.teal} /> Finanzas
            </div>
            <button
              onClick={onLogout}
              style={{ border: "none", background: "none", color: C.inkFaint, display: "flex", alignItems: "center", gap: 4, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, cursor: "pointer" }}
            >
              <LogOut size={14} /> Salir
            </button>
          </div>

          {activeTab === "resumen" && (
            <ResumenTab data={data} update={update} monthKey={monthKey} setMonthKey={setMonthKey} quincena={quincena} setQuincena={setQuincena} />
          )}
          {activeTab === "registrar" && <RegistrarTab data={data} update={update} />}
          {activeTab === "catalogo" && <CatalogoTab data={data} update={update} />}
          {activeTab === "ingresos" && <IngresosTab data={data} update={update} monthKey={monthKey} setMonthKey={setMonthKey} />}
          {activeTab === "reporte" && <ReporteTab data={data} monthKey={monthKey} setMonthKey={setMonthKey} />}
        </div>
      </div>

      <NavMobile active={activeTab} setActive={setActiveTab} />
    </div>
  );
}

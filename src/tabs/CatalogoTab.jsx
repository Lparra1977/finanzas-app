import React, { useState } from "react";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { C, BANKS } from "../lib/constants";
import { fmt, uid } from "../lib/utils";
import { Card, StatBlock, labelStyle, inputStyle, miniInput } from "../components/ui";

export default function CatalogoTab({ data, update }) {
  const [newItem, setNewItem] = useState({ name: "", category: "Gasto", q1: "", q2: "", banco: "BANCO GENERAL" });

  const patchItem = (id, patch) => {
    update((d) => ({ ...d, catalog: d.catalog.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  };
  const removeItem = (id) => update((d) => ({ ...d, catalog: d.catalog.filter((c) => c.id !== id) }));

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    update((d) => ({
      ...d,
      catalog: [
        ...d.catalog,
        {
          id: uid(),
          name: newItem.name.trim(),
          category: newItem.category,
          q1: parseFloat(newItem.q1) || 0,
          q2: parseFloat(newItem.q2) || 0,
          banco: newItem.banco,
          active: true,
        },
      ],
    }));
    setNewItem({ name: "", category: "Gasto", q1: "", q2: "", banco: "BANCO GENERAL" });
  };

  const totalActiveGasto = data.catalog.filter((c) => c.active && c.category === "Gasto").reduce((a, c) => a + c.q1 + c.q2, 0);
  const totalActiveAhorro = data.catalog.filter((c) => c.active && c.category === "Ahorro").reduce((a, c) => a + c.q1 + c.q2, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <StatBlock label="Total gastos fijos activos / mes" value={fmt(totalActiveGasto)} />
          <StatBlock label="Total ahorro activo / mes" value={fmt(totalActiveAhorro)} tone="teal" />
        </div>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.paperSoft, borderBottom: `1px solid ${C.line}` }}>
                {["Activo", "Rubro", "Categoría", "Q1", "Q2", "Total", "Banco", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: C.inkFaint, textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.catalog.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.line}`, opacity: c.active ? 1 : 0.45 }}>
                  <td style={{ padding: "8px 12px" }}>
                    <button onClick={() => patchItem(c.id, { active: !c.active })} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", color: c.active ? C.teal : C.inkFaint }}>
                      {c.active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                    </button>
                  </td>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>{c.name}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <select value={c.category} onChange={(e) => patchItem(c.id, { category: e.target.value })} style={{ ...miniInput, width: 108 }}>
                      <option value="Gasto">Gasto</option>
                      <option value="Ahorro">Ahorro</option>
                    </select>
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    <input type="number" step="0.01" value={c.q1} onChange={(e) => patchItem(c.id, { q1: parseFloat(e.target.value) || 0 })} style={{ ...miniInput, width: 85, fontFamily: "'IBM Plex Mono', monospace" }} />
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    <input type="number" step="0.01" value={c.q2} onChange={(e) => patchItem(c.id, { q2: parseFloat(e.target.value) || 0 })} style={{ ...miniInput, width: 85, fontFamily: "'IBM Plex Mono', monospace" }} />
                  </td>
                  <td style={{ padding: "8px 12px", fontFamily: "'IBM Plex Mono', monospace", color: C.inkSoft, whiteSpace: "nowrap" }}>{fmt(c.q1 + c.q2)}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <select value={c.banco} onChange={(e) => patchItem(c.id, { banco: e.target.value })} style={{ ...miniInput, width: 140 }}>
                      {BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    <button onClick={() => removeItem(c.id)} style={{ border: "none", background: "none", cursor: "pointer", color: C.inkFaint, display: "flex" }}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 12 }}>Agregar rubro nuevo</div>
        <form onSubmit={addItem} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.3fr auto", gap: 8, alignItems: "end" }}>
          <div>
            <label style={labelStyle}>Nombre</label>
            <input style={inputStyle} value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Categoría</label>
            <select style={inputStyle} value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
              <option value="Gasto">Gasto</option>
              <option value="Ahorro">Ahorro</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Q1</label>
            <input type="number" step="0.01" style={inputStyle} value={newItem.q1} onChange={(e) => setNewItem({ ...newItem, q1: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Q2</label>
            <input type="number" step="0.01" style={inputStyle} value={newItem.q2} onChange={(e) => setNewItem({ ...newItem, q2: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Banco</label>
            <select style={inputStyle} value={newItem.banco} onChange={(e) => setNewItem({ ...newItem, banco: e.target.value })}>
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", height: 38 }}>
            Añadir
          </button>
        </form>
      </Card>
    </div>
  );
}

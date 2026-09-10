import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { PiggyBank } from "lucide-react";
import { auth } from "./lib/firebase";
import { C, FONT_IMPORT } from "./lib/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <form
        onSubmit={submit}
        style={{
          background: C.paper,
          border: `1px solid ${C.line}`,
          borderRadius: 14,
          padding: 28,
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxShadow: "0 4px 18px rgba(22,35,47,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: C.ink, marginBottom: 6 }}>
          <PiggyBank size={24} color={C.teal} /> Finanzas
        </div>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          style={{ padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 8, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 8, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}
        />
        {error && <div style={{ color: C.red, fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif" }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: C.navy,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 14px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

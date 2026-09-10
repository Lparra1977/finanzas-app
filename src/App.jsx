import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import { C, FONT_IMPORT } from "./lib/constants";
import Login from "./Login";
import FinanzasApp from "./FinanzasApp";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'IBM Plex Sans', sans-serif", color: C.inkSoft }}>
        <style>{FONT_IMPORT}</style>
        Cargando…
      </div>
    );
  }

  if (!user) return <Login />;

  return <FinanzasApp user={user} onLogout={() => signOut(auth)} />;
}

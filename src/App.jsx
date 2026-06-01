import { useState, useEffect } from "react";

const CATEGORIES = ["Tous", "Transport", "Santé", "Consommation", "Travail", "Administration", "Famille", "Autre"];

const SAMPLE_POSTS = [
  {
    id: 1,
    auteur: "Marie T.",
    lieu: "Paris",
    categorie: "Transport",
    titre: "Vol annulé sans prévenir",
    contenu: "J'ai attendu 6h à l'aéroport avant qu'on nous annonce l'annulation. Aucune aide, aucune explication. J'ai dû me débrouiller seule pour trouver un hôtel.",
    votes: 142,
    voted: false,
    temps: "il y a 2h",
    temoins: 38
  },
  {
    id: 2,
    auteur: "Karim B.",
    lieu: "Lyon",
    categorie: "Santé",
    titre: "3 mois d'attente pour un rendez-vous urgent",
    contenu: "Mon médecin m'a dit que c'était urgent mais le premier rendez-vous disponible chez le spécialiste était dans 3 mois. J'ai dû payer une clinique privée.",
    votes: 217,
    voted: false,
    temps: "il y a 5h",
    temoins: 61
  },
  {
    id: 3,
    auteur: "Sophie L.",
    lieu: "Marseille",
    categorie: "Consommation",
    titre: "SAV qui ne répond jamais",
    contenu: "Produit en panne après 2 semaines. 14 appels au service client, 3 emails sans réponse. Au final j'ai dû menacer de porter plainte pour obtenir un remboursement.",
    votes: 89,
    voted: false,
    temps: "il y a 1j",
    temoins: 24
  },
  {
    id: 4,
    auteur: "Anon.",
    lieu: "Bordeaux",
    categorie: "Travail",
    titre: "Heures sup jamais payées",
    contenu: "Mon employeur me demandait régulièrement de rester après les heures. Promesses verbales, jamais honorées. J'ai tout documenté et saisi les prud'hommes.",
    votes: 304,
    voted: false,
    temps: "il y a 2j",
    temoins: 97
  },
  {
    id: 5,
    auteur: "Léa M.",
    lieu: "Toulouse",
    categorie: "Administration",
    titre: "Dossier perdu 3 fois de suite",
    contenu: "Mon dossier de demande d'aide a été perdu trois fois par la même administration. Chaque fois on me demandait de tout recommencer depuis zéro.",
    votes: 176,
    voted: false,
    temps: "il y a 3j",
    temoins: 45
  }
];

export default function GVQ() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [categorie, setCategorie] = useState("Tous");
  const [vue, setVue] = useState("feed"); // feed | new | detail
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ titre: "", contenu: "", categorie: "Autre", lieu: "", anonyme: false });
  const [submitted, setSubmitted] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimIn(true), 100);
  }, []);

  const filtered = categorie === "Tous" ? posts : posts.filter(p => p.categorie === categorie);
  const sorted = [...filtered].sort((a, b) => b.votes - a.votes);

  const handleVote = (id, e) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, votes: p.voted ? p.votes - 1 : p.votes + 1, voted: !p.voted } : p
    ));
    if (selected?.id === id) {
      setSelected(prev => ({ ...prev, votes: prev.voted ? prev.votes - 1 : prev.votes + 1, voted: !prev.voted }));
    }
  };

  const handleSubmit = () => {
    if (!form.titre || !form.contenu) return;
    const newPost = {
      id: Date.now(),
      auteur: form.anonyme ? "Anon." : "Vous",
      lieu: form.lieu || "France",
      categorie: form.categorie,
      titre: form.titre,
      contenu: form.contenu,
      votes: 0,
      voted: false,
      temps: "à l'instant",
      temoins: 0
    };
    setPosts(prev => [newPost, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setVue("feed"); setForm({ titre: "", contenu: "", categorie: "Autre", lieu: "", anonyme: false }); }, 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#e8e0d4",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at 20% 20%, #1a0a2e 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #0e1a0a 0%, transparent 50%)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,220,100,0.15)",
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, cursor: "pointer" }} onClick={() => setVue("feed")}>
          <span style={{
            fontSize: 28, fontWeight: 900, letterSpacing: "-1px",
            color: "#f0c040",
            fontFamily: "'Georgia', serif",
            textShadow: "0 0 20px rgba(240,192,64,0.4)"
          }}>GVQ</span>
          <span style={{ fontSize: 12, color: "#888", letterSpacing: "2px", textTransform: "uppercase" }}>J'ai vécu</span>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setVue("feed")} style={navBtn(vue === "feed")}>Témoignages</button>
          <button onClick={() => setVue("new")} style={{
            ...navBtn(vue === "new"),
            background: vue === "new" ? "#f0c040" : "rgba(240,192,64,0.12)",
            color: vue === "new" ? "#0a0a0f" : "#f0c040",
            border: "1px solid rgba(240,192,64,0.4)",
            fontWeight: 700
          }}>+ Partager</button>
        </nav>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "32px 16px 80px" }}>

        {/* FEED */}
        {vue === "feed" && (
          <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "none" : "translateY(20px)", transition: "all 0.5s ease" }}>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1 style={{
                fontSize: "clamp(36px, 8vw, 64px)", fontWeight: 900,
                lineHeight: 1.1, marginBottom: 12,
                background: "linear-gradient(135deg, #f0c040 0%, #e87040 50%, #c040a0 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Tu n'es pas seul(e).</h1>
              <p style={{ color: "#888", fontSize: 16, maxWidth: 400, margin: "0 auto" }}>
                Des milliers de Français partagent leurs vécus. Lis, vote, témoigne.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 20 }}>
                {[["1 247", "témoignages"], ["38 k", "personnes touchées"], ["94%", "se sentent moins seuls"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#f0c040" }}>{n}</div>
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24, scrollbarWidth: "none" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategorie(c)} style={{
                  padding: "6px 16px", borderRadius: 20, border: "1px solid",
                  borderColor: categorie === c ? "#f0c040" : "rgba(255,255,255,0.1)",
                  background: categorie === c ? "rgba(240,192,64,0.15)" : "transparent",
                  color: categorie === c ? "#f0c040" : "#666",
                  fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 0.2s"
                }}>{c}</button>
              ))}
            </div>

            {/* Posts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {sorted.map((post, i) => (
                <article key={post.id} onClick={() => { setSelected(post); setVue("detail"); }} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "20px 22px",
                  cursor: "pointer", transition: "all 0.25s",
                  opacity: animIn ? 1 : 0,
                  transform: animIn ? "none" : "translateY(16px)",
                  transitionDelay: `${i * 0.07}s`,
                  position: "relative", overflow: "hidden"
                }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(240,192,64,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, background: "rgba(240,192,64,0.12)", color: "#f0c040", padding: "3px 10px", borderRadius: 10, border: "1px solid rgba(240,192,64,0.2)" }}>{post.categorie}</span>
                      <span style={{ fontSize: 11, color: "#555" }}>{post.lieu} · {post.temps}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#444" }}>{post.auteur}</span>
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#e8e0d4", lineHeight: 1.3 }}>{post.titre}</h2>
                  <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.contenu}</p>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button onClick={(e) => handleVote(post.id, e)} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: post.voted ? "rgba(240,192,64,0.15)" : "transparent",
                      border: `1px solid ${post.voted ? "#f0c040" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 20, padding: "5px 14px",
                      color: post.voted ? "#f0c040" : "#555", fontSize: 13, cursor: "pointer",
                      transition: "all 0.2s"
                    }}>
                      <span>{post.voted ? "▲" : "△"}</span>
                      <span style={{ fontWeight: 700 }}>{post.votes}</span>
                    </button>
                    <span style={{ fontSize: 12, color: "#444" }}>
                      <span style={{ color: "#556" }}>👥</span> {post.temoins} ont vécu ça
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* DETAIL */}
        {vue === "detail" && selected && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <button onClick={() => setVue("feed")} style={{ background: "none", border: "none", color: "#f0c040", cursor: "pointer", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
              ← Retour
            </button>
            <article style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "28px 28px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, background: "rgba(240,192,64,0.12)", color: "#f0c040", padding: "4px 12px", borderRadius: 10, border: "1px solid rgba(240,192,64,0.2)" }}>{selected.categorie}</span>
                <span style={{ fontSize: 12, color: "#555", padding: "4px 0" }}>{selected.lieu} · {selected.temps} · {selected.auteur}</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 18, lineHeight: 1.3, color: "#e8e0d4" }}>{selected.titre}</h1>
              <p style={{ fontSize: 16, color: "#999", lineHeight: 1.8, marginBottom: 28 }}>{selected.contenu}</p>
              <div style={{ display: "flex", gap: 16, alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                <button onClick={(e) => handleVote(selected.id, e)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: selected.voted ? "rgba(240,192,64,0.15)" : "transparent",
                  border: `1px solid ${selected.voted ? "#f0c040" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 24, padding: "8px 20px",
                  color: selected.voted ? "#f0c040" : "#777", fontSize: 15, cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                  <span style={{ fontSize: 18 }}>{selected.voted ? "▲" : "△"}</span>
                  <span style={{ fontWeight: 800 }}>{posts.find(p => p.id === selected.id)?.votes ?? selected.votes}</span>
                  <span style={{ fontSize: 12 }}>J'ai vécu ça aussi</span>
                </button>
                <span style={{ fontSize: 13, color: "#444" }}>👥 {selected.temoins} personnes aussi</span>
              </div>
            </article>

            <div style={{ marginTop: 24, padding: "20px 24px", background: "rgba(240,192,64,0.05)", border: "1px solid rgba(240,192,64,0.15)", borderRadius: 16 }}>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>💡 <strong style={{ color: "#f0c040" }}>Conseil GVQ :</strong> Si vous avez vécu une situation similaire, vous pouvez partager votre témoignage et aider d'autres personnes à se sentir moins seules.</p>
            </div>
          </div>
        )}

        {/* NEW POST */}
        {vue === "new" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <button onClick={() => setVue("feed")} style={{ background: "none", border: "none", color: "#f0c040", cursor: "pointer", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#e8e0d4" }}>Partage ton vécu</h2>
            <p style={{ color: "#555", marginBottom: 32, fontSize: 14 }}>Ton témoignage peut aider des milliers de personnes à se sentir moins seules.</p>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#f0c040", fontSize: 22 }}>Merci pour ton témoignage !</h3>
                <p style={{ color: "#666" }}>Tu aides quelqu'un à se sentir moins seul(e).</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Titre de ton vécu *</label>
                  <input value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                    placeholder="En une phrase, ce que tu as vécu..."
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ton histoire *</label>
                  <textarea value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
                    placeholder="Raconte ce que tu as vécu, ce que tu as ressenti, comment ça s'est terminé..."
                    rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Catégorie</label>
                    <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                      {CATEGORIES.filter(c => c !== "Tous").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Ville (optionnel)</label>
                    <input value={form.lieu} onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))}
                      placeholder="Paris, Lyon..."
                      style={inputStyle} />
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#666", fontSize: 14 }}>
                  <input type="checkbox" checked={form.anonyme} onChange={e => setForm(f => ({ ...f, anonyme: e.target.checked }))}
                    style={{ accentColor: "#f0c040", width: 16, height: 16 }} />
                  Publier anonymement
                </label>
                <button onClick={handleSubmit} style={{
                  background: form.titre && form.contenu ? "linear-gradient(135deg, #f0c040, #e87040)" : "rgba(255,255,255,0.05)",
                  color: form.titre && form.contenu ? "#0a0a0f" : "#444",
                  border: "none", borderRadius: 12, padding: "16px 32px",
                  fontSize: 16, fontWeight: 800, cursor: form.titre && form.contenu ? "pointer" : "not-allowed",
                  transition: "all 0.2s", letterSpacing: "0.5px"
                }}>
                  Publier mon témoignage
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        ::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(240,192,64,0.3); }
        input::placeholder, textarea::placeholder { color: #444; }
        option { background: #1a1a22; }
      `}</style>
    </div>
  );
}

const navBtn = (active) => ({
  background: active ? "rgba(255,255,255,0.08)" : "transparent",
  border: "1px solid rgba(255,255,255,0.1)",
  color: active ? "#e8e0d4" : "#666",
  borderRadius: 8, padding: "6px 14px",
  fontSize: 13, cursor: "pointer", transition: "all 0.2s"
});

const labelStyle = {
  display: "block", fontSize: 12, color: "#666",
  textTransform: "uppercase", letterSpacing: "1px",
  marginBottom: 8, fontFamily: "sans-serif"
};

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "12px 16px",
  color: "#e8e0d4", fontSize: 15,
  fontFamily: "'Georgia', serif",
  outline: "none",
  transition: "border 0.2s"

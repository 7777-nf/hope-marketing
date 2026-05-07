'use client';
import { useState } from "react";

const MODULES = [
  { id: "posts", icon: "📱", label: "Posts & Légendes", desc: "Contenu WhatsApp prêt à envoyer" },
  { id: "promos", icon: "🎯", label: "Offres Promo", desc: "Offres ciblées par segment" },
  { id: "relance", icon: "🔔", label: "Relance Clients", desc: "Réactiver les clients inactifs" },
  { id: "restaurant", icon: "🍽️", label: "Prospection B2B", desc: "Convaincre les restaurants" },
];

const POST_TYPES = ["Annonce service", "Témoignage client", "Nouveau partenaire", "Promotion du jour"];
const PROMO_TYPES = ["Réduction livraison", "Livraison gratuite", "Code promo flash", "Offre weekend"];
const SEGMENTS = ["Tous les clients", "Clients inactifs", "Clients fidèles", "Zone Cocody", "Zone Yopougon"];

function Loader() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 0" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#FFD600",
          animation: `bounce 1s ease-in-out ${i*0.15}s infinite`
        }}/>
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "Tu es HOPE, agent marketing IA de TropRapide Abidjan. Génère du contenu WhatsApp percutant et ivoirien. Commence directement par le contenu.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Erreur.";
}

export default function Hope() {
  const [mod, setMod] = useState("posts");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [postType, setPostType] = useState(POST_TYPES[0]);
  const [postContext, setPostContext] = useState("");
  const [promoType, setPromoType] = useState(PROMO_TYPES[0]);
  const [segment, setSegment] = useState(SEGMENTS[0]);
  const [days, setDays] = useState("7");
  const [restoName, setRestoName] = useState("");
  const [restoZone, setRestoZone] = useState("");
  const [etape, setEtape] = useState("Premier contact");

  async function generate() {
    setLoading(true); setResult(""); setCopied(false);
    let prompt = "";
    if (mod === "posts") prompt = `Génère un message WhatsApp TropRapide. Type: ${postType}. ${postContext ? "Détails: "+postContext : ""}`;
    if (mod === "promos") prompt = `Offre promo WhatsApp TropRapide. Type: ${promoType}. Cible: ${segment}. Inclus code promo et durée.`;
    if (mod === "relance") prompt = `3 messages relance TropRapide client inactif ${days} jours. Chaleureux, offre, humour ivoirien. Sépare par ---`;
    if (mod === "restaurant") prompt = `Message WhatsApp B2B TropRapide pour ${restoName||"restaurant"} à ${restoZone||"Abidjan"}. Étape: ${etape}. Court, CTA clair.`;
    setResult(await callClaude(prompt));
    setLoading(false);
  }

  const s = { bg: "#0A0F1E", card: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.06)", yellow: "#FFD600", text: "#E2E8F0", muted: "#64748B" };

  const chip = (val: string, cur: string, set: (v:string)=>void) => (
    <button key={val} onClick={()=>set(val)} style={{ padding:"5px 12px", borderRadius:20, cursor:"pointer", fontFamily:"inherit", fontSize:11, background: cur===val?"rgba(255,214,0,0.12)":"rgba(255,255,255,0.03)", border:`1px solid ${cur===val?"rgba(255,214,0,0.4)":"rgba(255,255,255,0.08)"}`, color: cur===val?"#FFD600":"#64748B", fontWeight: cur===val?700:400 }}>{val}</button>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0A0F1E,#0D1627)", fontFamily:"monospace", color:s.text }}>
      <div style={{ borderBottom:"1px solid rgba(255,214,0,0.12)", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>🤖</span>
            <span style={{ fontSize:18, fontWeight:800, color:"#FFD600" }}>HOPE</span>
            <span style={{ fontSize:10, color:"#475569", letterSpacing:2 }}>AGENT MARKETING · TROPRAPIDE</span>
          </div>
          <div style={{ fontSize:10, color:"#475569", marginTop:3 }}>IA · WhatsApp Business · Abidjan</div>
        </div>
        <div style={{ fontSize:10, padding:"4px 10px", borderRadius:20, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#10B981" }}>● Actif</div>
      </div>

      <div style={{ padding:24 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
          {MODULES.map(m=>(
            <button key={m.id} onClick={()=>{setMod(m.id);setResult("");}} style={{ padding:14, border:`1px solid ${mod===m.id?"rgba(255,214,0,0.2)":"rgba(255,255,255,0.05)"}`, borderLeft:`3px solid ${mod===m.id?"#FFD600":"transparent"}`, borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:"inherit", background:mod===m.id?"rgba(255,214,0,0.06)":"rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize:20, marginBottom:5 }}>{m.icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color:mod===m.id?"#FFD600":"#94A3B8", marginBottom:2 }}>{m.label}</div>
              <div style={{ fontSize:10, color:"#475569" }}>{m.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:24 }}>
          {mod==="posts" && <div>
            <div style={{ fontSize:10, color:"#64748B", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Type de post</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{POST_TYPES.map(t=>chip(t,postType,setPostType))}</div>
            <div style={{ fontSize:10, color:"#64748B", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Détails (optionnel)</div>
            <textarea value={postContext} onChange={e=>setPostContext(e.target.value)} placeholder="Ex: Nouveau restaurant Le Wafou à Cocody..." rows={3} style={{ width:"100%", padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, color:"#E2E8F0", fontSize:13, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box", marginBottom:14 }}/>
          </div>}

          {mod==="promos" && <div>
            <div style={{ fontSize:10, color:"#64748B", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Type offre</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{PROMO_TYPES.map(t=>chip(t,promoType,setPromoType))}</div>
            <div style={{ fontSize:10, color:"#64748B", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Segment cible</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{SEGMENTS.map(s=>chip(s,segment,setSegment))}</div>
          </div>}

          {mod==="relance" && <div>
            <div style={{ fontSize:10, color:"#64748B", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Inactif depuis</div>
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>{["7","14","30","60"].map(d=>chip(d+" j",days+" j",(v)=>setDays(v.replace(" j",""))))}</div>
          </div>}

          {mod==="restaurant" && <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10, color:"#64748B", marginBottom:6 }}>Restaurant</div>
                <input value={restoName} onChange={e=>setRestoName(e.target.value)} placeholder="Le Wafou" style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, color:"#E2E8F0", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}/>
              </div>
              <div>
                <div style={{ fontSize:10, color:"#64748B", marginBottom:6 }}>Quartier</div>
                <input value={restoZone} onChange={e=>setRestoZone(e.target.value)} placeholder="Cocody" style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, color:"#E2E8F0", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" }}/>
              </div>
            </div>
            <div style={{ fontSize:10, color:"#64748B", marginBottom:6 }}>Étape</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{["Premier contact","Relance J+3","Objection prix","Closing"].map(e=>chip(e,etape,setEtape))}</div>
          </div>}

          <button onClick={generate} disabled={loading} style={{ padding:"10px 24px", background:"linear-gradient(135deg,#FFD600,#F59E0B)", border:"none", borderRadius:8, color:"#0A0F1E", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            {loading ? "HOPE génère..." : "✨ Générer avec HOPE"}
          </button>

          {loading && <Loader/>}

          {result && <div style={{ marginTop:16, background:"rgba(255,214,0,0.04)", border:"1px solid rgba(255,214,0,0.15)", borderRadius:10, padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:10, color:"#FFD600" }}>🤖 HOPE — MESSAGE GÉNÉRÉ</span>
              <button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{ padding:"5px 14px", border:`1px solid ${copied?"rgba(16,185,129,0.3)":"rgba(255,214,0,0.2)"}`, borderRadius:6, background:copied?"rgba(16,185,129,0.1)":"rgba(255,214,0,0.08)", color:copied?"#10B981":"#FFD600", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>{copied?"✅ Copié!":"📋 Copier"}</button>
            </div>
            <pre style={{ margin:0, fontSize:13, lineHeight:1.7, color:"#E2E8F0", whiteSpace:"pre-wrap", fontFamily:"inherit" }}>{result}</pre>
          </div>}
        </div>

        <div style={{ marginTop:16, fontSize:10, color:"#334155", textAlign:"center" }}>HOPE · Agent Marketing IA · TropRapide Abidjan</div>
      </div>
    </div>
  );
}

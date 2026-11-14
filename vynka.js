const sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
const app = document.getElementById("app");
const WARNA = {hijau:"#0f766e", ungu:"#6d28d9", oranye:"#c2410c", biru:"#1d4ed8"};
// Harus sama dengan daftar di tambahan.sql
const RESERVED = ["dashboard","login","register","daftar","masuk","admin","api","assets","static","config","style","vynka","index","404","www","app","settings","about","help","support","privacy","terms"];
const setTheme = t => document.documentElement.dataset.t = t || "hijau";
function fixUrl(u){ u=(u||"").trim(); if(!u) return "#"; if(/^(https?:|mailto:|tel:)/i.test(u)) return u; if(/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#"; return "https://"+u; }
function el(t, p={}, ...c){ const e=document.createElement(t); Object.assign(e,p); c.forEach(x=>e.append(x)); return e; }
function head(p){ return el("div",{className:"c"}, el("div",{className:"av",textContent:(p.display_name||p.username||"?").charAt(0).toUpperCase()}), el("h1",{textContent:p.display_name||p.username}), el("p",{className:"bio",textContent:p.bio||""})); }

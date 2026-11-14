const sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
const app = document.getElementById("app");
const WARNA = {hijau:"#0f766e", ungu:"#6d28d9", oranye:"#c2410c", biru:"#1d4ed8"};
const FONTS = {jakarta:"'Plus Jakarta Sans'", outfit:"'Outfit'", lora:"'Lora'", grotesk:"'Space Grotesk'"};
const FONT_NAMA = {jakarta:"Jakarta", outfit:"Outfit", lora:"Lora", grotesk:"Grotesk"};
const SOSIAL = {instagram:"Instagram", tiktok:"TikTok", youtube:"YouTube", whatsapp:"WhatsApp", x:"X", facebook:"Facebook", github:"GitHub", email:"Email"};
// Harus sama dengan daftar di tambahan.sql
const RESERVED = ["dashboard","login","register","daftar","masuk","admin","api","assets","static","config","style","vynka","index","404","www","app","settings","about","help","support","privacy","terms"];
const hexOf = t => WARNA[t] || (/^#[0-9a-f]{6}$/i.test(t||"") ? t : WARNA.hijau);
const onOf = h => { const n=parseInt(h.slice(1),16), r=n>>16, g=(n>>8)&255, b=n&255; return (r*299+g*587+b*114)/1000>150 ? "#0f172a" : "#fff"; };
const setTheme = t => { const h=hexOf(t), s=document.documentElement.style; s.setProperty("--accent",h); s.setProperty("--on",onOf(h)); };
function fixUrl(u){ u=(u||"").trim(); if(!u) return "#"; if(/^(https?:|mailto:|tel:)/i.test(u)) return u; if(/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#"; return "https://"+u; }
function socUrl(k,v){ v=(v||"").trim(); if(!v) return ""; if(k==="email") return "mailto:"+v; if(k==="whatsapp"&&/^[0-9+ ]+$/.test(v)) return "https://wa.me/"+v.replace(/\D/g,""); return fixUrl(v); }
function el(t, p={}, ...c){ const e=document.createElement(t); Object.assign(e,p); c.forEach(x=>e.append(x)); return e; }
// Dipakai halaman publik (404.html) dan pratinjau di dashboard
function renderPublik(c, p, links, o={}){
  const acc=hexOf(p.theme), nama=p.display_name||p.username||"?";
  c.className="pg"; c.dataset.b=p.btn_style||"bulat";
  c.style.setProperty("--accent",acc); c.style.setProperty("--on",onOf(acc));
  c.style.fontFamily=(FONTS[p.font]||FONTS.jakarta)+",system-ui,sans-serif";
  const av=el("div",{className:"av"}); const huruf=nama.charAt(0).toUpperCase();
  if(/^https:\/\//.test(p.avatar_url||"")){ const im=el("img",{src:p.avatar_url,alt:""}); im.onerror=()=>{ av.textContent=huruf; }; av.append(im); } else av.textContent=huruf;
  const soc=Object.entries(p.socials||{}).filter(([k,v])=>SOSIAL[k]&&(v||"").trim()).map(([k,v])=> o.preview ? el("span",{textContent:SOSIAL[k]}) : el("a",{textContent:SOSIAL[k],href:socUrl(k,v),target:"_blank",rel:"noopener noreferrer"}));
  const ls=links.filter(l=>(l.title||"").trim()).map(l=>{
    if(o.preview) return el("div",{className:"lk",textContent:l.title});
    const a=el("a",{className:"lk",textContent:l.title,href:fixUrl(l.url),target:"_blank",rel:"noopener noreferrer"});
    if(o.track) a.addEventListener("click",()=>o.track(l));
    return a;
  });
  c.replaceChildren(av, el("h1",{className:"c",textContent:nama}), el("p",{className:"bio c",textContent:p.bio||""}), ...(soc.length?[el("div",{className:"soc"},...soc)]:[]), ...ls);
}

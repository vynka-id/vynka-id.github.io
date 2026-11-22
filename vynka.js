const sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
const app = document.getElementById("app");
const WARNA = {hijau:"#0f766e", ungu:"#6d28d9", oranye:"#c2410c", biru:"#1d4ed8"};
const FONTS = {jakarta:"'Plus Jakarta Sans'", outfit:"'Outfit'", lora:"'Lora'", grotesk:"'Space Grotesk'"};
const FONT_NAMA = {jakarta:"Jakarta", outfit:"Outfit", lora:"Lora", grotesk:"Grotesk"};
const TEMA = {klasik:{n:"Klasik",font:"jakarta"}, midnight:{n:"Midnight",font:"grotesk"}, aurora:{n:"Aurora",font:"outfit"}, sunset:{n:"Sunset",font:"outfit"}, mint:{n:"Mint",font:"jakarta"}, brutal:{n:"Neo Brutal",font:"grotesk"}, mono:{n:"Mono",font:"grotesk"}, ocean:{n:"Ocean",font:"jakarta"}, sakura:{n:"Sakura",font:"outfit"}, forest:{n:"Forest",font:"lora"}, noir:{n:"Noir",font:"grotesk",layout:"cover",acc:"#d08f78"}, emas:{n:"Emas",font:"lora",layout:"cover",acc:"#e5b567"}, neon:{n:"Neon",font:"outfit",layout:"cover",acc:"#22d3ee"}, mawar:{n:"Mawar",font:"lora",layout:"cover",acc:"#f472b6"}, kertas:{n:"Kertas",font:"lora",layout:"standar",acc:"#1f1b16"}};
const KODE = {instagram:"IG", tiktok:"TT", youtube:"YT", whatsapp:"WA", x:"X", facebook:"f", github:"GH", email:"@"};
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
  const tm=TEMA[p.tema]?p.tema:"klasik", cover=p.layout==="cover";
  const acc=hexOf(p.theme), nama=p.display_name||p.username||"?", huruf=nama.charAt(0).toUpperCase();
  c.className="pg"; c.dataset.b=p.btn_style||"bulat"; c.dataset.tema=tm; c.dataset.l=cover?"cover":"standar";
  c.style.setProperty("--accent",acc); c.style.setProperty("--on",onOf(acc));
  c.style.fontFamily=(FONTS[p.font]||FONTS.jakarta)+",system-ui,sans-serif";
  const foto=/^https:\/\//.test(p.avatar_url||"")?p.avatar_url:"", url=location.origin+"/"+(p.username||"");
  let kepala;
  if(cover){
    kepala=el("div",{className:"hero"});
    if(foto) kepala.style.backgroundImage="url("+JSON.stringify(foto)+")"; else kepala.append(el("span",{className:"hl",textContent:huruf}));
    const logo=o.preview?el("span",{className:"cb",textContent:"V"}):el("a",{className:"cb",href:"/",textContent:"V",title:"Vynka"});
    const sh=el("button",{className:"cb",textContent:"↗",title:"Bagikan"});
    if(!o.preview) sh.onclick=async()=>{ try{ if(navigator.share) await navigator.share({title:nama,url}); else { await navigator.clipboard.writeText(url); sh.textContent="✓"; setTimeout(()=>sh.textContent="↗",1500); } }catch(e){} };
    kepala.append(el("div",{className:"ctop"},logo,sh));
  } else {
    kepala=el("div",{className:"av"});
    if(foto){ const im=el("img",{src:foto,alt:""}); im.onerror=()=>{ kepala.textContent=huruf; }; kepala.append(im); } else kepala.textContent=huruf;
  }
  const soc=Object.entries(p.socials||{}).filter(([k,v])=>SOSIAL[k]&&(v||"").trim()).map(([k,v])=>{
    const t=cover?KODE[k]:SOSIAL[k], cls=cover?"sc":"";
    return o.preview?el("span",{className:cls,textContent:t}):el("a",{className:cls,textContent:t,title:SOSIAL[k],href:socUrl(k,v),target:"_blank",rel:"noopener noreferrer"});
  });
  const ls=links.filter(l=>(l.title||"").trim()).map(l=>{
    const th=/^https:\/\//.test(l.image_url||"")?el("img",{className:"th",src:l.image_url,alt:""}):null;
    const dt=el("span",{className:"dt",textContent:"⋮",title:"Salin link"});
    const isi=[...(th?[th]:[]),el("span",{textContent:l.title}),dt], cls="lk"+(th?" hasth":"");
    if(o.preview) return el("div",{className:cls},...isi);
    const a=el("a",{className:cls,href:fixUrl(l.url),target:"_blank",rel:"noopener noreferrer"},...isi);
    dt.addEventListener("click",e=>{ e.preventDefault(); e.stopPropagation(); try{ navigator.clipboard.writeText(fixUrl(l.url)); dt.textContent="✓"; setTimeout(()=>dt.textContent="⋮",1200); }catch(x){} });
    if(o.track) a.addEventListener("click",()=>o.track(l));
    return a;
  });
  const foot=o.preview?el("span",{className:"pfoot",textContent:"Buat halaman Vynka-mu"}):el("a",{className:"pfoot",href:"/",textContent:"Buat halaman Vynka-mu"});
  c.replaceChildren(kepala, el("h1",{className:"c nm",textContent:nama}), el("p",{className:"bio c",textContent:p.bio||""}), ...(soc.length?[el("div",{className:"soc"},...soc)]:[]), ...ls, foot);
}

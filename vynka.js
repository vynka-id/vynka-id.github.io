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
const LOGO='<svg viewBox="0 0 48 48" aria-hidden="true"><g transform="translate(19 25) rotate(-22)"><rect x="-3.6" y="-14" width="7.2" height="28" rx="3.6" fill="#fff"/></g><g transform="translate(29 25) rotate(22)"><rect x="-3.6" y="-14" width="7.2" height="28" rx="3.6" fill="none" stroke="#fff" stroke-width="2.6"/></g><path class="sp" d="M41 5 L42 7 L44 8 L42 9 L41 11 L40 9 L38 8 L40 7 Z" fill="#fff"/></svg>';
function logoEl(tag="span",cls=""){ const e=document.createElement(tag); e.className=cls; e.innerHTML=LOGO; return e; }
function fixUrl(u){ u=(u||"").trim(); if(!u) return "#"; if(/^(https?:|mailto:|tel:)/i.test(u)) return u; if(/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#"; return "https://"+u; }
function socUrl(k,v){ v=(v||"").trim(); if(!v) return ""; if(k==="email") return "mailto:"+v; if(k==="whatsapp"&&/^[0-9+ ]+$/.test(v)) return "https://wa.me/"+v.replace(/\D/g,""); return fixUrl(v); }
function el(t, p={}, ...c){ const e=document.createElement(t); Object.assign(e,p); c.forEach(x=>e.append(x)); return e; }
const IKON = {"instagram": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/>", "tiktok": "<path d=\"M14 3v11.2a3.7 3.7 0 1 1-3.7-3.7\"/><path d=\"M14 3c.3 2.6 2.1 4.4 5 4.6\"/>", "youtube": "<rect x=\"2.5\" y=\"5.5\" width=\"19\" height=\"13\" rx=\"4\"/><path d=\"M10 9.5v5l4.5-2.5z\" fill=\"currentColor\"/>", "whatsapp": "<path d=\"M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z\"/><path d=\"M9.3 8.6c-.3 1.2.9 3.2 2.7 4.3 1.8 1 2.9.7 3.3 0l-1.4-1.2-.8.5c-.7-.3-1.4-1-1.7-1.7l.5-.8z\" fill=\"currentColor\" stroke=\"none\"/>", "x": "<path d=\"M4 4l16 16M20 4L4 20\"/>", "facebook": "<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"/>", "github": "<path d=\"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22\"/>", "email": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"M4 7l8 6 8-6\"/>"};
function ikon(k,sz){ return '<svg viewBox="0 0 24 24"'+(sz?' width="'+sz+'" height="'+sz+'"':'')+' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IKON[k]||"")+'</svg>'; }
const isID=()=>{ try{ return localStorage.getItem("vynka_lang")==="id"; }catch(e){ return false; } };
// Dipakai halaman publik (404.html), pratinjau dashboard, dan contoh di landing
function renderPublik(c, p, links, o={}){
  const tm=TEMA[p.tema]?p.tema:"klasik", cover=p.layout==="cover";
  const acc=hexOf(p.theme), nama=p.display_name||p.username||"?", huruf=nama.charAt(0).toUpperCase();
  c.className="pg"; c.dataset.b=p.btn_style||"bulat"; c.dataset.tema=tm; c.dataset.l=cover?"cover":"standar";
  c.style.setProperty("--accent",acc); c.style.setProperty("--on",onOf(acc));
  c.style.fontFamily=(FONTS[p.font]||FONTS.jakarta)+",system-ui,sans-serif";
  const av0=p.avatar_url||"", foto=av0.startsWith("demo:")?((typeof AVATAR!=="undefined"&&AVATAR[av0.slice(5)])||""):(/^https:\/\//.test(av0)?av0:""), url=location.origin+"/"+(p.username||"");
  // logo Vynka (pojok kiri atas) -> landing page
  let logo;
  if(o.preview&&o.home===false) logo=el("span",{className:"vlogo"});
  else { logo=el("a",{className:"vlogo",href:o.preview?location.origin+"/":"/",title:"Vynka"}); if(o.preview){ logo.target="_blank"; logo.rel="noopener"; } }
  logo.append(logoEl("i"),el("b",{textContent:"Vynka"}));
  const sh=el("button",{className:"cb",textContent:"↗",title:isID()?"Bagikan":"Share"});
  if(!o.preview) sh.onclick=async()=>{ try{ if(navigator.share) await navigator.share({title:nama,url}); else { await navigator.clipboard.writeText(url); sh.textContent="✓"; setTimeout(()=>sh.textContent="↗",1500); } }catch(e){} };
  const top=el("div",{className:"ctop"},logo,sh);
  let parts;
  if(cover){
    const hero=el("div",{className:"hero"});
    if(foto) hero.style.backgroundImage="url("+JSON.stringify(foto)+")"; else hero.append(el("span",{className:"hl",textContent:huruf}));
    hero.append(top); parts=[hero];
  } else {
    const av=el("div",{className:"av"});
    if(foto){ const im=el("img",{src:foto,alt:""}); im.onerror=()=>{ av.textContent=huruf; }; av.append(im); } else av.textContent=huruf;
    parts=[top,av];
  }
  const soc=Object.entries(p.socials||{}).filter(([k,v])=>SOSIAL[k]&&(v||"").trim()).map(([k,v])=>{
    const e=o.preview?el("span",{className:"sc",title:SOSIAL[k]}):el("a",{className:"sc",title:SOSIAL[k],href:socUrl(k,v),target:"_blank",rel:"noopener noreferrer"});
    e.setAttribute("aria-label",SOSIAL[k]); e.innerHTML=ikon(k); return e;
  });
  const ls=links.filter(l=>(l.title||"").trim()).map(l=>{
    const th=/^https:\/\//.test(l.image_url||"")?el("img",{className:"th",src:l.image_url,alt:""}):null;
    const dt=el("span",{className:"dt",textContent:"⋮",title:isID()?"Salin link":"Copy link"});
    const isi=[...(th?[th]:[]),el("span",{textContent:l.title}),dt], cls="lk"+(th?" hasth":"");
    if(o.preview) return el("div",{className:cls},...isi);
    const a=el("a",{className:cls,href:fixUrl(l.url),target:"_blank",rel:"noopener noreferrer"},...isi);
    dt.addEventListener("click",e=>{ e.preventDefault(); e.stopPropagation(); try{ navigator.clipboard.writeText(fixUrl(l.url)); dt.textContent="✓"; setTimeout(()=>dt.textContent="⋮",1200); }catch(x){} });
    if(o.track) a.addEventListener("click",()=>o.track(l));
    return a;
  });
  const ftx=(()=>{ try{ return localStorage.getItem("vynka_lang")==="id"; }catch(e){ return false; } })()?"Buat halaman Vynka-mu":"Create your own Vynka page";
  const foot=o.preview?el("span",{className:"pfoot",textContent:ftx}):el("a",{className:"pfoot",href:"/",textContent:ftx});
  c.replaceChildren(...parts, el("h1",{className:"c nm",textContent:nama}), el("p",{className:"bio c",textContent:p.bio||""}), ...(soc.length?[el("div",{className:"soc"},...soc)]:[]), ...ls, foot);
}

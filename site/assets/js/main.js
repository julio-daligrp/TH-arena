/* ===== Configuración (edita aquí) ===== */
const CONFIG={
  whatsapp:"18099090206",   // número de WhatsApp de ventas, con código de país y sin signos
  endpoint:""               // opcional: URL de tu CRM / Formspree / webhook que reciba un POST JSON
};
const descuentos={"1":6000,"2":8000,"3":10000};
const fotos={"3":[{"src": "assets/img/apto-3h-01.webp", "cap": "Comedor, cocina y sala"}, {"src": "assets/img/apto-3h-02.webp", "cap": "Comedor y recibidor"}, {"src": "assets/img/apto-3h-03.webp", "cap": "Habitación principal"}, {"src": "assets/img/apto-3h-04.webp", "cap": "Habitación 2"}, {"src": "assets/img/apto-3h-05.webp", "cap": "Habitación 3"}],"1":[{"src": "assets/img/apto-1h-01.webp", "cap": "Comedor y sala"}, {"src": "assets/img/apto-1h-02.webp", "cap": "Comedor y sala"}, {"src": "assets/img/apto-1h-03.webp", "cap": "Sala"}, {"src": "assets/img/apto-1h-04.webp", "cap": "Habitación"}, {"src": "assets/img/apto-1h-05.webp", "cap": "Habitación"}, {"src": "assets/img/apto-1h-06.webp", "cap": "Cocina"}, {"src": "assets/img/apto-1h-07.webp", "cap": "Baño"}],"2":[{"src": "assets/img/apto-2h-01.webp", "cap": "Sala, comedor y cocina"}, {"src": "assets/img/apto-2h-02.webp", "cap": "Comedor y sala"}, {"src": "assets/img/apto-2h-03.webp", "cap": "Habitación principal"}, {"src": "assets/img/apto-2h-04.webp", "cap": "Segunda habitación"}]};
const data={
  "1":{tipo:"Tipo B",nombre:"1 habitación",m2:"49 m²",precio:88075,banos:"1",mant:"RD$2,530"},
  "2":{tipo:"Tipo A",nombre:"2 habitaciones",m2:"69 m²",precio:119265,banos:"2",mant:"RD$3,560"},
  "3":{tipo:"Tipo C",nombre:"3 habitaciones",m2:"105 m²",precio:148810,banos:"2",mant:"RD$5,416"}
};
const $=id=>document.getElementById(id);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const fmt=n=>"$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});

let gK="1",gI=0,pMode="disc";
function showFoto(i){
  const list=fotos[gK]||[]; if(!list.length)return;
  const img=$("gImg"),cap=$("planCap"); if(!img||!cap)return;
  gI=(i+list.length)%list.length;
  img.src=list[gI].src; img.alt=list[gI].cap; cap.textContent=data[gK].tipo+" · "+list[gI].cap;
  $$("#gThumbs button").forEach((b,j)=>b.classList.toggle("on",j===gI));
}
function setGaleria(k){
  gK=k; const list=fotos[k]||[], has=list.length>0;
  const img=$("gImg"),prev=$("gPrev"),next=$("gNext"),thumbs=$("gThumbs"),cap=$("planCap");
  if(!img||!prev||!next||!thumbs||!cap)return;
  img.hidden=!has; prev.hidden=next.hidden=list.length<2;
  thumbs.innerHTML=list.map((f,j)=>'<button type="button" aria-label="'+f.cap+'"><img alt="" width="56" height="40" loading="lazy" src="'+f.src.replace('.webp','-t.webp')+'"></button>').join("");
  $$("button",thumbs).forEach((b,j)=>b.addEventListener("click",()=>showFoto(j)));
  if(has)showFoto(0); else cap.textContent="Foto real del apartamento "+data[k].tipo+" (pendiente)";
}
function pick(k){
  const d=data[k];
  $$("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
  $$("#habChips button").forEach((b,i)=>b.classList.toggle("on",String(i+1)===k));
  const tipo=$("tipo"),m2=$("m2"),banos=$("banos");
  if(tipo)tipo.textContent=d.tipo;
  if(m2)m2.textContent=d.m2;
  if(banos)banos.textContent=d.banos;
  setGaleria(k);
  setCalcTipo(k);
  renderPrecio(k);
}
function renderPrecio(k){
  const d=data[k],precioTxt=$("precioTxt"),pDisc=$("pDisc");
  if(!precioTxt||!pDisc)return;
  if(!d.precio){
    precioTxt.innerHTML='<span class="ph">$000,000</span><small>Precio por confirmar con ventas</small>';
    pDisc.hidden=true;
    return;
  }
  const desc=descuentos[k]||0, final=d.precio-desc;
  if(pMode==="disc"){
    precioTxt.innerHTML=fmt(final)+' <s>'+fmt(d.precio)+'</s>';
    pDisc.textContent="Ahorras US$"+desc.toLocaleString("en-US");
  }else{
    precioTxt.textContent=fmt(d.precio);
    pDisc.textContent="Descuento de US$"+desc.toLocaleString("en-US");
  }
  pDisc.hidden=false;
}

$$("#tabs button").forEach(b=>b.addEventListener("click",()=>pick(b.dataset.k)));
$$("#habChips button").forEach((b,i)=>b.addEventListener("click",()=>pick(String(i+1))));
$$("#priceMode button").forEach(b=>b.addEventListener("click",()=>{
  pMode=b.dataset.mode;
  $$("#priceMode button").forEach(x=>{
    const on=x.dataset.mode===pMode;
    x.classList.toggle("on",on);
    x.setAttribute("aria-pressed",on?"true":"false");
  });
  renderPrecio(gK);
}));
$$("#usoChips button").forEach(b=>b.addEventListener("click",()=>{
  $$("button",b.parentNode).forEach(x=>x.classList.remove("on"));b.classList.add("on");}));

const leadForm=$("leadForm");
if(leadForm)leadForm.addEventListener("submit",e=>{e.preventDefault();enviar("visita");});
const btnCosto=$("btnCosto");
if(btnCosto)btnCosto.addEventListener("click",()=>enviar("costo"));

/* ===== Calculadora (solo en calculadora.html) ===== */
let cK="1";
function calc(){
  const precioEl=$("cPrecio"),iniEl=$("cIni"),tasaEl=$("cTasa"),plazoEl=$("cPlazo");
  if(!precioEl||!iniEl||!tasaEl||!plazoEl)return;
  const lista=parseFloat(precioEl.value)||0, ini=+iniEl.value/100, tasa=parseFloat(tasaEl.value)||0, yrs=+plazoEl.value;
  $("cIniV").textContent=Math.round(ini*100)+"%"; $("oIniP").textContent=Math.round(ini*100)+"%";
  $("cPlazoV").textContent=yrs+" años"; $("oCuotaSub").textContent="durante "+yrs+" años ("+yrs*12+" cuotas) a "+tasa.toLocaleString("es-DO")+"% anual";
  if(!lista){["oCuota","oLista","oDesc","oFinal","oIni","oPrest"].forEach(id=>$(id).textContent="—");
    $("barI").style.width="0";$("barF").style.width="0";return;}
  const D=Math.min(descuentos[cK]||0,lista), P=lista-D, I=P*ini, L=P-I, n=yrs*12, r=tasa/100/12;
  const cuota= r>0 ? L*r/(1-Math.pow(1+r,-n)) : L/n;
  $("oCuota").textContent=fmt(cuota); $("oLista").textContent=fmt(lista); $("oDesc").textContent="−"+fmt(D);
  $("oFinal").textContent=fmt(P); $("oIni").textContent=fmt(I); $("oPrest").textContent=fmt(L);
  $("barI").style.width=(ini*100)+"%"; $("barF").style.width=((1-ini)*100)+"%";
}
function setCalcTipo(k){
  cK=k;
  $$("#cTipos button").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
  const precioEl=$("cPrecio"),nota=$("cPrecioNota"),d=data[k];
  if(!precioEl)return;
  if(d.precio){precioEl.value=d.precio;if(nota)nota.textContent="Precio de lista. El descuento de US$"+descuentos[k].toLocaleString("en-US")+" se aplica en el resultado.";}
  else{precioEl.value="";if(nota)nota.innerHTML='<span class="ph">Precio por confirmar</span> Escribe el precio que te cotizaron.';}
  calc();
}
$$("#cTipos button").forEach(b=>b.addEventListener("click",()=>pick(b.dataset.k)));
["cPrecio","cIni","cTasa","cPlazo"].forEach(id=>{const el=$(id);if(el)el.addEventListener("input",calc);});
const calcForm=$("calcForm");
if(calcForm)calcForm.addEventListener("submit",e=>e.preventDefault());

/* ===== Galería de precios y visor de planos ===== */
const gPrev=$("gPrev"),gNext=$("gNext");
if(gPrev)gPrev.addEventListener("click",()=>showFoto(gI-1));
if(gNext)gNext.addEventListener("click",()=>showFoto(gI+1));
$$(".pimg img, .gslide img").forEach(im=>im.addEventListener("click",()=>{
  const lb=$("lb"),lbImg=$("lbImg"); if(!lb||!lbImg)return;
  lbImg.src=im.src;lbImg.alt=im.alt;lb.hidden=false;
}));
const lb=$("lb");
if(lb)lb.addEventListener("click",()=>{lb.hidden=true;});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("lb"))$("lb").hidden=true;});

/* ===== Carrusel de la galería ===== */
$$(".gcarousel").forEach(car=>{
  const track=car.querySelector(".gtrack"),viewport=car.querySelector(".gviewport");
  const slides=$$(".gslide",car),dots=car.querySelector(".gdots"),count=car.querySelector(".gcount");
  const prev=car.querySelector(".gprev"),next=car.querySelector(".gnext");
  if(!track||!viewport||!slides.length)return;
  let i=0,visible=visibleCount(),startX=null,suppressUntil=0;
  let autoTimer=null,autoDir=1,hovering=false,focused=false,interacting=false,inView=true;
  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)");
  function visibleCount(){
    if(matchMedia("(max-width:480px)").matches)return 1;
    if(matchMedia("(max-width:700px)").matches)return 2;
    return 3;
  }
  function maxStart(){return Math.max(0,slides.length-visible);}
  function step(){
    const gap=parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap)||0;
    return slides[0].getBoundingClientRect().width+gap;
  }
  slides.forEach((s,n)=>{
    s.setAttribute("role","group");
    s.setAttribute("aria-roledescription","diapositiva");
    s.setAttribute("aria-label",(n+1)+" de "+slides.length);
  });
  function buildDots(){
    if(!dots)return;
    dots.innerHTML="";
    for(let n=0;n<=maxStart();n++){
      const b=document.createElement("button");
      b.type="button";b.className="gdot";
      b.setAttribute("aria-label",visible===1?"Ir a la foto "+(n+1):"Ir a las fotos "+(n+1)+" a "+Math.min(n+visible,slides.length));
      b.addEventListener("click",()=>{go(n);resetAuto();});
      dots.appendChild(b);
    }
  }
  function go(n){
    i=Math.max(0,Math.min(n,maxStart()));
    track.style.transform="translateX("+(-i*step())+"px)";
    slides.forEach((s,k)=>s.setAttribute("aria-hidden",(k>=i&&k<i+visible)?"false":"true"));
    const ds=dots?$$(".gdot",dots):[];
    ds.forEach((d,k)=>{d.classList.toggle("on",k===i);if(k===i)d.setAttribute("aria-current","true");else d.removeAttribute("aria-current");});
    const first=i+1,last=Math.min(i+visible,slides.length);
    if(count)count.textContent=(first===last?first:first+"\u2013"+last)+" / "+slides.length;
    if(prev)prev.disabled=i===0;
    if(next)next.disabled=i>=maxStart();
  }
  function canAuto(){
    return !reduceMotion.matches&&!hovering&&!focused&&!interacting&&inView&&!document.hidden&&!(lb&&!lb.hidden);
  }
  function tick(){
    if(!canAuto())return;
    const max=maxStart();
    if(max<=0)return;
    if(i>=max)autoDir=-1;
    else if(i<=0)autoDir=1;
    go(i+autoDir);
  }
  function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null;}}
  function startAuto(){
    stopAuto();
    if(reduceMotion.matches)return;
    autoTimer=setInterval(tick,5000);
  }
  function resetAuto(){stopAuto();startAuto();}
  buildDots();
  if(prev)prev.addEventListener("click",()=>{go(i-1);resetAuto();});
  if(next)next.addEventListener("click",()=>{go(i+1);resetAuto();});
  car.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft"){e.preventDefault();go(i-1);resetAuto();}
    else if(e.key==="ArrowRight"){e.preventDefault();go(i+1);resetAuto();}
  });
  car.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")hovering=true;});
  car.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse")hovering=false;});
  car.addEventListener("focusin",e=>{focused=e.target.matches(":focus-visible");});
  car.addEventListener("focusout",e=>{if(!car.contains(e.relatedTarget))focused=false;});
  viewport.addEventListener("pointerdown",e=>{startX=e.clientX;interacting=true;});
  viewport.addEventListener("pointermove",e=>{if(startX!==null&&Math.abs(e.clientX-startX)>10)suppressUntil=Date.now()+450;});
  viewport.addEventListener("pointercancel",()=>{startX=null;interacting=false;});
  viewport.addEventListener("pointerup",e=>{
    interacting=false;
    if(startX===null){resetAuto();return;}
    const dx=e.clientX-startX;
    if(Math.abs(dx)>40){dx<0?go(i+1):go(i-1);}
    if(Math.abs(dx)>10)suppressUntil=Date.now()+450;
    startX=null;
    resetAuto();
  });
  viewport.addEventListener("click",e=>{if(Date.now()<suppressUntil){e.stopPropagation();e.preventDefault();}},true);
  if("IntersectionObserver" in window){
    const io=new IntersectionObserver((es,ob)=>{
      if(es.some(en=>en.isIntersecting)){
        slides.forEach(s=>{const im=s.querySelector("img");if(im)im.loading="eager";});
        ob.disconnect();
      }
    },{rootMargin:"400px"});
    io.observe(car);
    new IntersectionObserver(es=>{inView=es.some(en=>en.isIntersecting);},{threshold:.25}).observe(car);
  }
  let rt;
  addEventListener("resize",()=>{
    clearTimeout(rt);
    rt=setTimeout(()=>{
      const v=visibleCount();
      if(v!==visible){visible=v;buildDots();}
      go(i);
    },150);
  });
  go(0);
  startAuto();
});

/* ===== Hero: video de fondo ===== */
(function(){
  const f=document.querySelector(".hvideo iframe");
  if(!f)return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){f.remove();return;}
  let done=false;
  function show(){if(done)return;done=true;f.classList.add("ready");}
  f.addEventListener("load",show);
  setTimeout(show,5000);
})();

/* ===== Menú móvil / tablet ===== */
(function(){
  const toggle=document.querySelector(".navtoggle"),links=document.querySelector(".navlinks");
  if(!toggle||!links)return;
  function setOpen(open){
    toggle.setAttribute("aria-expanded",open?"true":"false");
    toggle.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");
    links.classList.toggle("open",open);
  }
  toggle.addEventListener("click",()=>setOpen(toggle.getAttribute("aria-expanded")!=="true"));
  links.addEventListener("click",e=>{if(e.target.closest("a"))setOpen(false);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false);});
  document.addEventListener("click",e=>{if(!e.target.closest("nav.top"))setOpen(false);});
  const mq=matchMedia("(min-width:861px)");
  const onChange=()=>{if(mq.matches)setOpen(false);};
  if(mq.addEventListener)mq.addEventListener("change",onChange);else if(mq.addListener)mq.addListener(onChange);
})();

/* ===== Campaña de origen (UTM) ===== */
const utm=(function(){
  const keys=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","gclid"],q=new URLSearchParams(location.search),o={};
  try{keys.forEach(k=>{const v=q.get(k);if(v){o[k]=v;sessionStorage.setItem(k,v);}else{const s=sessionStorage.getItem(k);if(s)o[k]=s;}});}catch(e){keys.forEach(k=>{const v=q.get(k);if(v)o[k]=v;});}
  return o;
})();

/* ===== Formulario de contacto ===== */
function enviar(intencion){
  const f=$("leadForm"); if(!f)return;
  const sent=$("sent");
  const nombre=f.nombre.value.trim(), wa=f.whatsapp.value.replace(/[^\d+]/g,"");
  const msg=(t,err)=>{sent.hidden=false;sent.textContent=t;sent.classList.toggle("err",!!err);};
  if(f.web.value)return;                      // trampa para bots
  if(!nombre){msg("Escribe tu nombre para continuar.",true);f.nombre.focus();return;}
  if(wa.replace(/\D/g,"").length<10){msg("Escribe un número de WhatsApp válido, con código de área.",true);f.whatsapp.focus();return;}
  const uso=(document.querySelector("#usoChips .on")||{}).textContent||"";
  const hab=(document.querySelector("#habChips .on")||{}).textContent||"";
  const d={intencion,nombre,whatsapp:wa,uso,habitaciones:hab,presupuesto:f.presupuesto.value,visita:f.visita.value,entrega:f.entrega.value,horario:f.horario.value,pagina:location.origin+location.pathname,...utm};
  const texto=(intencion==="costo"?"Hola, quiero recibir la disponibilidad y el costo completo de TH Arenas.":"Hola, quiero agendar una visita a TH Arenas.")+
    "\nNombre: "+nombre+"\nWhatsApp: "+wa+(uso?"\nUso: "+uso:"")+(hab?"\nHabitaciones: "+hab:"")+
    "\nPresupuesto: "+d.presupuesto+"\nTipo de visita: "+d.visita+"\nEntrega: "+d.entrega+"\nHorario: "+d.horario;
  const abrirWA=()=>{window.open("https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(texto),"_blank","noopener");};
  const btns=f.querySelectorAll("button.btn");btns.forEach(b=>b.disabled=true);
  const fin=ok=>{btns.forEach(b=>b.disabled=false);if(ok){f.reset();$$("#usoChips button").forEach(x=>x.classList.remove("on"));pick("1");}};
  if(CONFIG.endpoint){
    fetch(CONFIG.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)})
      .then(r=>{if(!r.ok)throw 0;msg("¡Gracias, "+nombre.split(" ")[0]+"! Un asesor te contactará muy pronto.");fin(true);})
      .catch(()=>{msg("No pudimos enviar el formulario. Te abrimos WhatsApp para que escribas directo con un asesor.");abrirWA();fin(false);});
  }else{
    msg("¡Gracias, "+nombre.split(" ")[0]+"! Te abrimos WhatsApp para confirmar tu solicitud con un asesor.");abrirWA();fin(false);
  }
}

pick("1");

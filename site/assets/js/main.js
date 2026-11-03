/* ===== Configuración (edita aquí) ===== */
const CONFIG={
  whatsapp:"18099090206",   // número de WhatsApp de ventas, con código de país y sin signos
  endpoint:""               // opcional: URL de tu CRM / Formspree / webhook que reciba un POST JSON
};
const descuentos={"1":6000,"2":8000,"3":10000};
const fotos={"3":[{"src": "assets/img/apto-3h-01.webp", "cap": "Comedor, cocina y sala"}, {"src": "assets/img/apto-3h-02.webp", "cap": "Comedor y recibidor"}, {"src": "assets/img/apto-3h-03.webp", "cap": "Habitación principal"}, {"src": "assets/img/apto-3h-04.webp", "cap": "Habitación 2"}, {"src": "assets/img/apto-3h-05.webp", "cap": "Habitación 3"}],"1":[{"src": "assets/img/apto-1h-01.webp", "cap": "Comedor y sala"}, {"src": "assets/img/apto-1h-02.webp", "cap": "Comedor y sala"}, {"src": "assets/img/apto-1h-03.webp", "cap": "Sala"}, {"src": "assets/img/apto-1h-04.webp", "cap": "Habitación"}, {"src": "assets/img/apto-1h-05.webp", "cap": "Habitación"}, {"src": "assets/img/apto-1h-06.webp", "cap": "Cocina"}, {"src": "assets/img/apto-1h-07.webp", "cap": "Baño"}],"2":[{"src": "assets/img/apto-2h-01.webp", "cap": "Sala, comedor y cocina"}, {"src": "assets/img/apto-2h-02.webp", "cap": "Comedor y sala"}, {"src": "assets/img/apto-2h-03.webp", "cap": "Habitación principal"}, {"src": "assets/img/apto-2h-04.webp", "cap": "Segunda habitación"}]};
let gK="1",gI=0;
function showFoto(i){
  const list=fotos[gK]||[]; if(!list.length)return; gI=(i+list.length)%list.length;
  $("gImg").src=list[gI].src; $("gImg").alt=list[gI].cap; $("planCap").textContent=data[gK].tipo+" · "+list[gI].cap;
  document.querySelectorAll("#gThumbs button").forEach((b,j)=>b.classList.toggle("on",j===gI));
}
function setGaleria(k){
  gK=k; const list=fotos[k]||[]; const has=list.length>0;
  $("gImg").hidden=!has; $("gPrev").hidden=$("gNext").hidden=list.length<2;
  $("gThumbs").innerHTML=list.map((f,j)=>'<button type="button" aria-label="'+f.cap+'"><img alt="" width="56" height="40" loading="lazy" src="'+f.src.replace('.webp','-t.webp')+'"></button>').join("");
  $("gThumbs").querySelectorAll("button").forEach((b,j)=>b.addEventListener("click",()=>showFoto(j)));
  if(has)showFoto(0); else $("planCap").textContent="Foto real del apartamento "+data[k].tipo+" (pendiente)";
}
const data={
  "1":{tipo:"Tipo B",nombre:"1 habitación",m2:"49 m²",precio:88075.55,banos:"1",mant:"RD$2,530"},
  "2":{tipo:"Tipo A",nombre:"2 habitaciones",m2:"69 m²",precio:119265,banos:"2",mant:"RD$3,560"},
  "3":{tipo:"Tipo C",nombre:"3 habitaciones",m2:"105 m²",precio:148810,banos:"2",mant:"RD$5,416"}
};
const $=id=>document.getElementById(id);
const fmt=n=>"$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
function pick(k){
  const d=data[k];
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
  document.querySelectorAll("#habChips button").forEach((b,i)=>b.classList.toggle("on",String(i+1)===k));
  $("tipo").textContent=d.tipo; $("m2").textContent=d.m2; $("banos").textContent=d.banos;
  setGaleria(k);
  setCalcTipo(k);
  if(d.precio){
    $("precioTxt").textContent=fmt(d.precio);
    $("pDisc").textContent="Descuento de US$"+descuentos[k].toLocaleString("en-US");
    $("pMant").textContent=d.mant;
  }else{
    $("precioTxt").innerHTML='<span class="ph">$000,000</span><small>Precio por confirmar con ventas</small>';
  }
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>pick(b.dataset.k)));
document.querySelectorAll("#habChips button").forEach((b,i)=>b.addEventListener("click",()=>pick(String(i+1))));
document.querySelectorAll("#usoChips button").forEach(b=>b.addEventListener("click",()=>{
  b.parentNode.querySelectorAll("button").forEach(x=>x.classList.remove("on"));b.classList.add("on");}));
$("leadForm").addEventListener("submit",e=>{e.preventDefault();enviar("visita");});
$("btnCosto").addEventListener("click",()=>enviar("costo"));
let cK="1";
const cEls=["cPrecio","cIni","cTasa","cPlazo"].map($);
function calc(){
  const lista=parseFloat($("cPrecio").value)||0, ini=+$("cIni").value/100, tasa=parseFloat($("cTasa").value)||0, yrs=+$("cPlazo").value;
  $("cIniV").textContent=Math.round(ini*100)+"%"; $("oIniP").textContent=Math.round(ini*100)+"%";
  $("cPlazoV").textContent=yrs+" años"; $("oCuotaSub").textContent="durante "+yrs+" años ("+yrs*12+" cuotas) a "+tasa.toLocaleString("es-DO")+"% anual";
  if(!lista){["oCuota","oLista","oDesc","oFinal","oIni","oPrest","oIngreso"].forEach(id=>$(id).textContent="—");
    $("barI").style.width="0";$("barF").style.width="0";return;}
  const D=Math.min(descuentos[cK]||0,lista), P=lista-D, I=P*ini, L=P-I, n=yrs*12, r=tasa/100/12;
  const cuota= r>0 ? L*r/(1-Math.pow(1+r,-n)) : L/n;
  $("oCuota").textContent=fmt(cuota); $("oLista").textContent=fmt(lista); $("oDesc").textContent="−"+fmt(D);
  $("oFinal").textContent=fmt(P); $("oIni").textContent=fmt(I); $("oPrest").textContent=fmt(L);
  $("oIngreso").textContent=fmt(cuota/0.30);
  $("barI").style.width=(ini*100)+"%"; $("barF").style.width=((1-ini)*100)+"%";
}
function setCalcTipo(k){
  cK=k;
  document.querySelectorAll("#cTipos button").forEach(b=>b.classList.toggle("on",b.dataset.k===k)); const d=data[k];
  if(d.precio){$("cPrecio").value=d.precio;$("cPrecioNota").textContent="Precio de lista. El descuento de US$"+descuentos[k].toLocaleString("en-US")+" se aplica en el resultado.";}
  else{$("cPrecio").value="";$("cPrecioNota").innerHTML='<span class="ph">Precio por confirmar</span> Escribe el precio que te cotizaron.';}
  calc();
}
document.querySelectorAll("#cTipos button").forEach(b=>b.addEventListener("click",()=>pick(b.dataset.k)));
cEls.forEach(el=>el.addEventListener("input",calc));
$("calcForm").addEventListener("submit",e=>e.preventDefault());

$("gPrev").addEventListener("click",()=>showFoto(gI-1));
$("gNext").addEventListener("click",()=>showFoto(gI+1));
document.querySelectorAll(".pimg img").forEach(im=>im.addEventListener("click",()=>{$("lbImg").src=im.src;$("lbImg").alt=im.alt;$("lb").hidden=false;}));
$("lb").addEventListener("click",()=>{$("lb").hidden=true;});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("lb").hidden=true;});

/* ===== Hero: las fotos 2 y 3 se cargan cuando la página terminó de cargar ===== */
(function(){
  const sl=[...document.querySelectorAll(".hbg .hs")],dt=[...document.querySelectorAll(".hdots .hd")];let h=0,t;
  function load(){sl.forEach(i=>{if(i.dataset.src){i.src=i.dataset.src;delete i.dataset.src;}});}
  if(document.readyState==="complete")load();else addEventListener("load",load);
  function go(n){sl[h].classList.remove("on");dt[h].classList.remove("on");h=(n+sl.length)%sl.length;sl[h].classList.add("on");dt[h].classList.add("on");}
  function start(){clearInterval(t);if(!matchMedia("(prefers-reduced-motion: reduce)").matches)t=setInterval(()=>go(h+1),5000);}
  dt.forEach((d,i)=>d.addEventListener("click",()=>{load();go(i);start();}));start();
})();

/* ===== Campaña de origen (UTM) ===== */
const utm=(function(){
  const keys=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","gclid"],q=new URLSearchParams(location.search),o={};
  try{keys.forEach(k=>{const v=q.get(k);if(v){o[k]=v;sessionStorage.setItem(k,v);}else{const s=sessionStorage.getItem(k);if(s)o[k]=s;}});}catch(e){keys.forEach(k=>{const v=q.get(k);if(v)o[k]=v;});}
  return o;
})();

/* ===== Formulario de contacto ===== */
function enviar(intencion){
  const f=$("leadForm"), sent=$("sent");
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
  const fin=ok=>{btns.forEach(b=>b.disabled=false);if(ok){f.reset();document.querySelectorAll("#usoChips button").forEach(x=>x.classList.remove("on"));pick("1");}};
  if(CONFIG.endpoint){
    fetch(CONFIG.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)})
      .then(r=>{if(!r.ok)throw 0;msg("¡Gracias, "+nombre.split(" ")[0]+"! Un asesor te contactará muy pronto.");fin(true);})
      .catch(()=>{msg("No pudimos enviar el formulario. Te abrimos WhatsApp para que escribas directo con un asesor.");abrirWA();fin(false);});
  }else{
    msg("¡Gracias, "+nombre.split(" ")[0]+"! Te abrimos WhatsApp para confirmar tu solicitud con un asesor.");abrirWA();fin(false);
  }
}

pick("1");

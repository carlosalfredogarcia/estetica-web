const QR=require('qrcode');const fs=require('fs');const { chromium } = require('playwright');
const OUT=process.argv[2];
(async()=>{
const svg=await QR.toString('https://escobilla-alfrega.netlify.app',{type:'svg',margin:0,errorCorrectionLevel:'M',color:{dark:'#000',light:'#fff'}});
const hoja=(nombre)=>`<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
@page{size:4in 6in;margin:0}*{box-sizing:border-box;margin:0;padding:0}
body{width:4in;height:6in;font-family:'DM Sans',sans-serif;color:#000;background:#fff}
.e{width:4in;height:6in;padding:.2in .22in;display:flex;flex-direction:column}
.marca{text-align:center;font-size:9pt;letter-spacing:4pt;font-weight:800}
h1{font-family:'Cormorant Garamond',serif;font-weight:700;text-align:center;font-size:24pt;line-height:1;margin-top:5pt}
.sub{text-align:center;font-size:8pt;letter-spacing:1.5pt;text-transform:uppercase;margin-top:4pt}
.para{margin-top:10pt;border:1.4pt solid #000;border-radius:8pt;padding:7pt 10pt;text-align:center}
.para small{display:block;font-size:7.5pt;letter-spacing:2.5pt;text-transform:uppercase;font-weight:700}
.para b{display:block;font-family:'Cormorant Garamond',serif;font-size:${nombre&&nombre.length>22?15:18}pt;line-height:1.15;margin-top:3pt;min-height:20pt}
.linea{border-bottom:1pt solid #000;height:20pt;margin:0 6pt}
.caja{display:flex;gap:8pt;margin-top:10pt}
.caja div{flex:1;border-top:1.4pt solid #000;padding-top:5pt}
.caja .n{font-size:20pt;font-weight:800;line-height:1}
.caja p{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.6pt;line-height:1.25;margin-top:2pt}
.ok{display:flex;justify-content:space-between;font-size:7.6pt;margin-top:9pt;padding:5pt 0;border-top:.6pt solid #000;border-bottom:.6pt solid #000}
.qr{display:flex;gap:12pt;align-items:center;margin-top:12pt}
.qr .c{flex:none;width:1.55in;height:1.55in}
.qr .c svg{width:100%;height:100%}
.qr h2{font-size:12.5pt;font-weight:800;line-height:1.1}
.qr ul{list-style:none;margin-top:5pt}
.qr li{font-size:8.2pt;line-height:1.5}
.qr li:before{content:"→ ";font-weight:800}
.est{margin-top:auto;background:#000;color:#fff;border-radius:8pt;padding:8pt 11pt;text-align:center}
.est b{display:block;font-size:9.6pt;letter-spacing:.3pt}
.est span{display:block;font-size:7.8pt;margin-top:2pt}
.pie{text-align:center;font-size:7pt;letter-spacing:1.5pt;margin-top:6pt}
</style>
<div class="e">
<p class="marca">✦ ALFREGA ✦</p>
<h1>Escobilla con dispensador</h1>
<p class="sub">Limpieza inteligente · Jabón integrado</p>
<div class="para"><small>Un regalo para</small>${nombre?`<b>${nombre}</b>`:'<div class="linea"></div>'}</div>
<div class="caja"><div><span class="n">1</span><p>Escobilla con<br>dispensador</p></div><div><span class="n">3</span><p>Cepillos de<br>recambio</p></div><div><span class="n">✓</span><p>Cerdas de<br>silicona</p></div></div>
<div class="ok"><span>✓ Indicador de jabón</span><span>✓ Botón aplicador</span><span>✓ Base antideslizante</span></div>
<div class="qr"><div class="c">${svg}</div><div><h2>Escanea con<br>la cámara</h2><ul><li>Instrucciones de uso</li><li>Fotos reales del producto</li><li>Tu regalo para la estética</li></ul></div></div>
<div class="est"><b>¿Tienes una estética o un salón?</b><span>Tu web con reservas y tu agenda en el móvil · Primer mes gratis</span></div>
<p class="pie">CARLOS · 640 309 239</p>
</div>`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:384,height:576},deviceScaleFactor:3});
for(const [n,nombre] of [['etiqueta-escobilla-v5-en-blanco',''],['etiqueta-escobilla-v5-ejemplo','Salón de Belleza Cristina']]){
 fs.writeFileSync(OUT+'/'+n+'.html',hoja(nombre));
 await p.goto('file://'+OUT+'/'+n+'.html');await p.waitForTimeout(1500);
 await p.pdf({path:OUT+'/'+n+'.pdf',width:'4in',height:'6in',printBackground:true});
 await p.screenshot({path:OUT+'/'+n+'.png'});
}
await b.close();})();

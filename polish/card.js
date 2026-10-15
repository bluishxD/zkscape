/* ZKCARD - the Explorer Card: artwork, reveal and idle life. Five tiers, chosen by the game's own rank (which is score-based):
     0 ROOKIE     Iron Tablet       chamfered slab, cold iron, rivets, no glow
     1 EXPLORER   Bronze Compass    ticket-notched plate, bronze + verdigris, compass rose
     2 PATHFINDER Silver Octagon    cut-corner plate, silver + ice-cyan, frost lattice
     3 GUARDIAN   Crimson Bastion   hexagonal gold plate, ruby gems, sunburst, embers
     4 ARCHITECT  Prismatic Relic   stepped ziggurat plate, iridescent foil, aurora, rays, double shimmer
   index.html's end() hands it the existing #cc canvas and only data the game already tracks (PFP, palette, ident(), stats(), worlds done, name).
   It awards nothing and touches no progress. ZKCARD.exportCanvas() is a finished still for the existing DOWNLOAD button. */
window.ZKCARD=(function(){
'use strict';
const WW=1600,HH=900,SX=1430,SY=246,SR=66,DIMC='#8f8878';
const clamp=(x,a,b)=>x<a?a:x>b?b:x,lerp=(a,b,t)=>a+(b-a)*t,sm=t=>(t=clamp(t,0,1))*t*(3-2*t),seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const mk=()=>{const c=document.createElement('canvas');c.width=WW;c.height=HH;return c};
const PAL=[
 {foil:['#26262a','#6d6d73','#a9a9b0','#55555b','#222226'],light:'#a3a3aa',dark:'#3a3a3e',acc:'#c9c9cf',plate:['#141416','#0a0a0c','#111113','#060607'],text:'#e4e4e8',glint:'#d4d4da',dust:'#bdbdc4',spot:'#8a8a90'},
 {foil:['#3b2410','#a8672a','#e3a15f','#8a4f1f','#34200e'],light:'#d99a58',dark:'#5a3615',acc:'#3fd0b0',plate:['#18110c','#0b0807','#130d09','#070403'],text:'#f0e4d0',glint:'#ffd29a',dust:'#e0a770',spot:'#d98a45'},
 {foil:['#3a4350','#aeb8c6','#f4f8fc','#8793a4','#3a4350'],light:'#c5d0de',dark:'#4a5565',acc:'#4ee3f0',plate:['#10151d','#070a10','#0c1119','#04060a'],text:'#eaf2fa',glint:'#e2f8ff',dust:'#cdefff',spot:'#6fc4d8'},
 {foil:['#7a5a22','#e9cd86','#fff0bf','#c79a3c','#7a5a22'],light:'#f0d58e',dark:'#6a4a1a',acc:'#e8384f',plate:['#1b1215','#0c0809','#150d10','#070405'],text:'#f3e6d0',glint:'#ffe3a0',dust:'#ff9a6a',spot:'#e8384f'},
 {foil:['#d9a93e','#fff1c4','#f6a6e8','#7ee8ff','#a58bff'],light:'#fff0c6',dark:'#5c4a8a',acc:'#ffb84a',plate:['#1a1130','#09060f','#140b26','#040208'],text:'#f6efe0',glint:'#ffffff',dust:'#d8c4ff',spot:'#a58bff'}];
let TIER=2,P=PAL[2],cur=null,still=null;
const rgb=c=>{const n=parseInt(String(c).replace('#',''),16);return[n>>16,n>>8&255,n&255]};
const rgba=(c,a)=>{const r=rgb(c);return'rgba('+r[0]+','+r[1]+','+r[2]+','+clamp(a,0,1).toFixed(3)+')'};
const ac=a=>rgba(P.acc,a),lt=a=>rgba(P.light,a);
function foil(g,x0,y0,x1,y1){const c=P.foil,f=g.createLinearGradient(x0,y0,x1,y1);f.addColorStop(0,c[0]);f.addColorStop(.28,c[1]);f.addColorStop(.5,c[2]);f.addColorStop(.72,c[3]);f.addColorStop(1,c[4]);return f}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}

/* ---- the five silhouettes (polygons at inset 10; deeper insets are the same shape scaled about the centre) ---- */
function polyChamfer(c){return[[10+c,10],[1590-c,10],[1590,10+c],[1590,890-c],[1590-c,890],[10+c,890],[10,890-c],[10,10+c]]}
function polyTicket(){const r=34,B=58,pts=[],arc=(cx,cy,a0,a1)=>{for(let i=0;i<=8;i++){const a=lerp(a0,a1,i/8);pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}},bite=(cx,cy,tx,ty,nx,ny)=>{for(let k=0;k<=16;k++){const q=k/16*Math.PI;pts.push([cx-Math.cos(q)*B*tx+Math.sin(q)*B*nx,cy-Math.cos(q)*B*ty+Math.sin(q)*B*ny])}};
 arc(10+r,10+r,Math.PI,1.5*Math.PI);bite(800,10,1,0,0,1);arc(1590-r,10+r,1.5*Math.PI,2*Math.PI);bite(1590,450,0,1,-1,0);arc(1590-r,890-r,0,.5*Math.PI);bite(800,890,-1,0,0,-1);arc(10+r,890-r,.5*Math.PI,Math.PI);bite(10,450,0,-1,1,0);return pts}
function polyHex(){return[[120,10],[1480,10],[1590,450],[1480,890],[120,890],[10,450]]}
function polyStep(){return[[10,100],[40,100],[40,70],[70,70],[70,40],[100,40],[100,10],[1500,10],[1500,40],[1530,40],[1530,70],[1560,70],[1560,100],[1590,100],[1590,800],[1560,800],[1560,830],[1530,830],[1530,860],[1500,860],[1500,890],[100,890],[100,860],[70,860],[70,830],[40,830],[40,800],[10,800]]}
const POLY=[()=>polyChamfer(44),polyTicket,()=>polyChamfer(84),polyHex,polyStep];
let polyCache=null,polyT=-1;
function poly(){if(polyT!==TIER){polyCache=POLY[TIER]();polyT=TIER}return polyCache}
function shape(g,d){const sx=(WW-2*d)/WW,sy=(HH-2*d)/HH;g.beginPath();poly().forEach((p,i)=>{const x=WW/2+(p[0]-WW/2)*sx,y=HH/2+(p[1]-HH/2)*sy;i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath()}
const inPt=(x,y,d)=>{const sx=(WW-2*d)/WW,sy=(HH-2*d)/HH;return[WW/2+(x-WW/2)*sx,HH/2+(y-HH/2)*sy]};
function gem(g,x,y,r,col){g.fillStyle='#060608';g.beginPath();g.arc(x,y,r+3,0,7);g.fill();g.strokeStyle=foil(g,x-r,y-r,x+r,y+r);g.lineWidth=3;g.stroke();const gr=g.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);gr.addColorStop(0,'#fff');gr.addColorStop(.35,col);gr.addColorStop(1,rgba(col,.55));g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
function rivet(g,x,y,r){const gr=g.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);gr.addColorStop(0,'#d8d8de');gr.addColorStop(1,'#3a3a3e');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=1.5;g.stroke()}
function corner(g,x,y,sx,sy,col,lw){g.save();g.translate(x,y);g.scale(sx,sy);g.strokeStyle=col;g.lineWidth=lw;g.lineJoin='miter';g.beginPath();g.moveTo(0,70);g.lineTo(0,18);g.lineTo(18,0);g.lineTo(70,0);g.stroke();g.beginPath();g.moveTo(14,56);g.lineTo(14,30);g.lineTo(30,14);g.lineTo(56,14);g.stroke();g.restore()}
function eye(g,x,y,s,a,col){g.save();g.translate(x,y);g.globalAlpha=a;g.strokeStyle=col;g.fillStyle=col;g.lineWidth=1.6*s;g.beginPath();g.moveTo(-13*s,0);g.quadraticCurveTo(0,-12*s,13*s,0);g.quadraticCurveTo(0,12*s,-13*s,0);g.closePath();g.stroke();g.beginPath();g.arc(0,0,4.6*s,0,7);g.stroke();g.beginPath();g.arc(0,0,1.7*s,0,7);g.fill();g.restore()}
function ngon(g,cx,cy,R,n,rot){g.beginPath();for(let i=0;i<n;i++){const q=rot+i*Math.PI*2/n,x=cx+Math.cos(q)*R,y=cy+Math.sin(q)*R;i?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()}
// the seal: a different emblem per tier, all sharing the sealed arched door
function seal(g,cx,cy,R,a,glow){const T=TIER;g.save();g.globalAlpha=a;
 if(T===4){g.save();g.translate(cx,cy);for(let i=0;i<32;i++){const q=i/32*Math.PI*2,r0=R*1.1,r1=R*(i%2?1.24:1.42);g.strokeStyle=i%3===0?'rgba(126,232,255,.6)':i%3===1?'rgba(246,166,232,.6)':'rgba(255,241,196,.7)';g.lineWidth=2.2;g.beginPath();g.moveTo(Math.cos(q)*r0,Math.sin(q)*r0);g.lineTo(Math.cos(q)*r1,Math.sin(q)*r1);g.stroke()}g.restore()}
 if(T===3){g.save();g.translate(cx,cy);g.fillStyle=ac(.85);for(let i=0;i<12;i++){const q=i/12*Math.PI*2;g.beginPath();g.moveTo(Math.cos(q-.1)*R*1.0,Math.sin(q-.1)*R*1.0);g.lineTo(Math.cos(q)*R*1.4,Math.sin(q)*R*1.4);g.lineTo(Math.cos(q+.1)*R*1.0,Math.sin(q+.1)*R*1.0);g.closePath();g.fill()}g.restore()}
 if(glow>0){const gl=g.createRadialGradient(cx,cy,R*.4,cx,cy,R*1.9);gl.addColorStop(0,ac(.34*glow));gl.addColorStop(1,ac(0));g.fillStyle=gl;g.fillRect(cx-R*2,cy-R*2,R*4,R*4)}
 const disc=g.createRadialGradient(cx-R*.3,cy-R*.35,R*.1,cx,cy,R);disc.addColorStop(0,'#1d1b1b');disc.addColorStop(1,'#060608');g.fillStyle=disc;
 if(T===2){ngon(g,cx,cy,R,8,Math.PI/8)}else if(T===3){ngon(g,cx,cy,R,6,0)}else{g.beginPath();g.arc(cx,cy,R,0,7)}g.fill();
 g.strokeStyle=foil(g,cx-R,cy-R,cx+R,cy+R);g.lineWidth=R*.07;if(T===2)ngon(g,cx,cy,R,8,Math.PI/8);else if(T===3)ngon(g,cx,cy,R,6,0);else{g.beginPath();g.arc(cx,cy,R,0,7)}g.stroke();
 g.lineWidth=R*.025;g.beginPath();g.arc(cx,cy,R*.86,0,7);g.stroke();
 if(T===1){g.strokeStyle=ac(.95);g.lineWidth=R*.04;for(let i=0;i<4;i++){const q=i*Math.PI/2;g.beginPath();g.moveTo(cx+Math.cos(q)*R*.3,cy+Math.sin(q)*R*.3);g.lineTo(cx+Math.cos(q)*R*.78,cy+Math.sin(q)*R*.78);g.stroke()}g.strokeStyle=lt(.7);g.lineWidth=R*.025;for(let i=0;i<4;i++){const q=Math.PI/4+i*Math.PI/2;g.beginPath();g.moveTo(cx+Math.cos(q)*R*.3,cy+Math.sin(q)*R*.3);g.lineTo(cx+Math.cos(q)*R*.6,cy+Math.sin(q)*R*.6);g.stroke()}}
 if(T>=2){g.setLineDash([R*.05,R*.08]);g.strokeStyle=ac(.85);g.lineWidth=R*.03;g.beginPath();g.arc(cx,cy,R*.76,0,7);g.stroke();g.setLineDash([])}
 g.strokeStyle=lt(.85);g.lineWidth=R*.028;if(T>=2){ngon(g,cx,cy,R*.6,6,-Math.PI/2);g.stroke()}if(T>=3){ngon(g,cx,cy,R*.6,3,-Math.PI/2);g.stroke()}
 if(T===4){g.strokeStyle='rgba(126,232,255,.8)';ngon(g,cx,cy,R*.6,3,Math.PI/2);g.stroke();g.strokeStyle='rgba(246,166,35,.0)'}
 if(T>=3){g.fillStyle=ac(1);for(let i=0;i<6;i++){const q=-Math.PI/2+i*Math.PI/3;g.fillRect(cx+Math.cos(q)*R*.6-R*.035,cy+Math.sin(q)*R*.6-R*.035,R*.07,R*.07)}}
 const dw=R*.3,dh=R*.5,x0=cx-dw/2,y0=cy-dh*.42;g.beginPath();g.moveTo(x0,y0+dh);g.lineTo(x0,y0+dw/2);g.arc(cx,y0+dw/2,dw/2,Math.PI,0);g.lineTo(x0+dw,y0+dh);g.closePath();g.fillStyle='#030307';g.fill();g.strokeStyle=T===0?lt(.9):ac(1);g.lineWidth=R*.04;g.stroke();g.strokeStyle=rgba(P.text,.55);g.lineWidth=R*.02;g.beginPath();g.moveTo(cx,y0+dw*.15);g.lineTo(cx,y0+dh);g.stroke();
 g.restore()}

/* ---- layers ---- */
function build(D){
 TIER=clamp(D.lv|0,0,4);P=PAL[TIER];const NAME=D.name||'';
 const {img,S,I,s,lv,W,fmtN,fmtT}=D;
 const L={base:mk(),frame:mk(),port:mk(),text:mk(),seal:mk(),eyeL:mk()},T=TIER;
 // --- base: the plate ---
 {const g=L.base.getContext('2d');g.fillStyle=P.plate[3];g.fillRect(0,0,WW,HH);
  const b=g.createLinearGradient(0,0,WW,HH);b.addColorStop(0,P.plate[0]);b.addColorStop(.45,P.plate[1]);b.addColorStop(1,P.plate[2]);g.fillStyle=b;g.fillRect(0,0,WW,HH);
  const v=g.createRadialGradient(430,440,40,430,440,760);v.addColorStop(0,rgba(P.spot,.14));v.addColorStop(.6,rgba(P.spot,.03));v.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=v;g.fillRect(0,0,WW,HH);
  g.strokeStyle=lt(.04);g.lineWidth=1;for(let i=-HH;i<WW;i+=26){g.beginPath();g.moveTo(i,0);g.lineTo(i+HH,HH);g.stroke();g.beginPath();g.moveTo(i,HH);g.lineTo(i+HH,0);g.stroke()}
  for(let i=0;i<900;i++){g.fillStyle='rgba(255,255,255,'+(hash(i)*.025).toFixed(3)+')';g.fillRect(hash(i*2.1)*WW,hash(i*3.7)*HH,20+hash(i*5.3)*140,1)}
  // each tier's backdrop motif behind the portrait
  g.save();g.translate(430,440);
  if(T===0){g.strokeStyle='rgba(255,255,255,.05)';for(let i=0;i<14;i++){g.beginPath();g.moveTo(-300+hash(i)*600,-300+hash(i*3)*600);g.lineTo(-300+hash(i*5)*600,-300+hash(i*7)*600);g.stroke()}}
  if(T===1){g.strokeStyle=lt(.1);g.lineWidth=2;for(let i=0;i<8;i++){const q=i*Math.PI/4;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(q)*(i%2?230:330),Math.sin(q)*(i%2?230:330));g.stroke()}g.beginPath();g.arc(0,0,200,0,7);g.stroke();g.fillStyle=lt(.07);for(let i=0;i<4;i++){const q=i*Math.PI/2;g.beginPath();g.moveTo(Math.cos(q)*330,Math.sin(q)*330);g.lineTo(Math.cos(q+.12)*190,Math.sin(q+.12)*190);g.lineTo(Math.cos(q-.12)*190,Math.sin(q-.12)*190);g.fill()}}
  if(T===2){g.strokeStyle=ac(.08);g.lineWidth=1.4;for(let r=60;r<330;r+=54){ngon(g,0,0,r,6,Math.PI/6);g.stroke()}for(let i=0;i<6;i++){const q=i*Math.PI/3;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(q)*310,Math.sin(q)*310);g.stroke()}}
  if(T===3){for(let i=0;i<28;i++){const q=i/28*Math.PI*2;g.fillStyle=i%2?rgba('#f0d58e',.05):ac(.06);g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(q-.07)*340,Math.sin(q-.07)*340);g.lineTo(Math.cos(q+.07)*340,Math.sin(q+.07)*340);g.fill()}}
  if(T===4){[['#a58bff',-120,-70,300],['#7ee8ff',110,60,280],['#f6a6e8',-30,120,240],['#ffb84a',60,-110,200]].forEach(a=>{const r=g.createRadialGradient(a[1],a[2],0,a[1],a[2],a[3]);r.addColorStop(0,rgba(a[0],.2));r.addColorStop(1,rgba(a[0],0));g.fillStyle=r;g.fillRect(-340,-340,680,680)});for(let i=0;i<90;i++){g.fillStyle='rgba(255,255,255,'+(.15+hash(i*7)*.5).toFixed(2)+')';const rr_=hash(i*3.3)*330,a=hash(i*1.7)*6.283;g.fillRect(Math.cos(a)*rr_,Math.sin(a)*rr_,hash(i)>.8?2:1,hash(i)>.8?2:1)}}
  g.restore();
  g.strokeStyle=lt(.18);g.lineWidth=2;g.beginPath();g.moveTo(838,110);g.lineTo(838,790);g.stroke();g.fillStyle=ac(.7);[110,450,790].forEach(y=>{g.save();g.translate(838,y);g.rotate(Math.PI/4);g.fillRect(-5,-5,10,10);g.restore()})}
 // --- frame ---
 {const g=L.frame.getContext('2d'),st=(d,sty,lw,dash)=>{shape(g,d);g.strokeStyle=sty;g.lineWidth=lw;if(dash)g.setLineDash(dash);g.stroke();g.setLineDash([])};
  st(10,foil(g,0,0,WW,HH),T===0?9:7);
  st(26,T?lt(.85):lt(.5),2.4);
  if(T>=1)st(40,rgba(P.dark,.9),1.4);
  if(T>=1)st(33,ac(T>=3?.9:.7),T>=3?3:1.8);
  if(T===4){st(20,'rgba(255,255,255,.85)',2,[2,9]);g.save();g.globalCompositeOperation='lighter';[['#a58bff',14],['#7ee8ff',8]].forEach((a,i)=>{shape(g,10+i*2);g.strokeStyle=rgba(a[0],.3);g.lineWidth=a[1];g.stroke()});g.restore();st(46,'rgba(246,166,232,.5)',1.4)}
  if(T===0)st(36,lt(.25),1.2);
  g.save();shape(g,44);g.clip();
  [58,HH-52].forEach(y=>{g.strokeStyle=lt(.3);g.lineWidth=1;g.beginPath();g.moveTo(100,y);g.lineTo(WW-100,y);g.stroke();for(let x=140,i=0;x<=WW-140;x+=(T?40:80),i++){const big=i%5===0;g.fillStyle=big?ac(.85):lt(.38);const r=big?5:3;g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.closePath();g.fill()}});
  [58,WW-58].forEach(x=>{g.strokeStyle=lt(.28);g.lineWidth=1;g.beginPath();g.moveTo(x,140);g.lineTo(x,HH-140);g.stroke();for(let y=170;y<=HH-170;y+=40){g.fillStyle=lt(.32);g.fillRect(x-2,y-2,4,4)}});g.restore();
  // shape-specific ornament
  if(T===0){[[10+44,10+14],[1590-44,10+14],[10+44,890-14],[1590-44,890-14],[800,24],[800,876],[24,450],[1576,450]].forEach(p=>rivet(g,p[0],p[1],9));}
  if(T===1){const CC=P.foil[2];corner(g,52,52,1,1,CC,3);corner(g,WW-52,52,-1,1,CC,3);corner(g,52,HH-52,1,-1,CC,3);corner(g,WW-52,HH-52,-1,-1,CC,3);[[800,86],[800,HH-86],[84,450],[WW-84,450]].forEach(p=>{g.fillStyle=ac(.95);g.save();g.translate(p[0],p[1]);for(let i=0;i<4;i++){g.rotate(Math.PI/2);g.beginPath();g.moveTo(0,-13);g.lineTo(3,-3);g.lineTo(0,0);g.lineTo(-3,-3);g.closePath();g.fill()}g.restore()})}
  if(T===2){poly().forEach((p,i,a)=>{const n=a[(i+1)%a.length],q=inPt((p[0]+n[0])/2,(p[1]+n[1])/2,32);if(Math.hypot(n[0]-p[0],n[1]-p[1])<200){g.fillStyle=ac(.95);g.save();g.translate(q[0],q[1]);g.rotate(Math.PI/4);g.fillRect(-7,-7,14,14);g.restore();g.strokeStyle=P.foil[2];g.lineWidth=2;g.save();g.translate(q[0],q[1]);g.rotate(Math.PI/4);g.strokeRect(-11,-11,22,22);g.restore()}})}
  if(T===3){poly().forEach(p=>{const q=inPt(p[0],p[1],34);gem(g,q[0],q[1],(p[0]<20||p[0]>1580)?17:12,P.acc)});}
  if(T===4){poly().forEach((p,i)=>{if(i%2===0){const q=inPt(p[0],p[1],30);gem(g,q[0],q[1],9,['#a58bff','#7ee8ff','#f6a6e8','#ffb84a'][i%4])}})}
  g.restore;}
 // --- the hidden watcher ---
 {const g=L.eyeL.getContext('2d');eye(g,1160,58,1,1,P.foil[2])}
 // --- portrait medallion ---
 {const g=L.port.getContext('2d'),cx=430,cy=440,R=305;
  const ring=(r)=>{if(T===2)ngon(g,cx,cy,r/Math.cos(Math.PI/8)*.99,8,Math.PI/8);else if(T===3)ngon(g,cx,cy,r*1.02,6,Math.PI/6);else{g.beginPath();g.arc(cx,cy,r,0,7)}};
  const bg=g.createRadialGradient(cx,cy-40,20,cx,cy,R);bg.addColorStop(0,T===4?'#2a1f45':T===3?'#2a1a1c':T===2?'#1b2733':T===1?'#2a1f16':'#222225');bg.addColorStop(.55,P.plate[1]);bg.addColorStop(1,'#050507');g.fillStyle=bg;ring(R-8);g.fill();
  g.save();ring(R-8);g.clip();g.strokeStyle=lt(.07);g.lineWidth=1;for(let i=1;i<9;i++){g.beginPath();g.arc(cx,cy,i*42,0,7);g.stroke()}ngon(g,cx,cy,250,6,-Math.PI/2);g.stroke();g.restore();
  g.strokeStyle=foil(g,cx-R,cy-R,cx+R,cy+R);g.lineWidth=T===0?6:9;ring(R);g.stroke();g.lineWidth=2.4;ring(R-16);g.stroke();g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;ring(R+7);g.stroke();
  g.setLineDash([3,15]);g.strokeStyle=ac(.65);g.lineWidth=3;g.beginPath();g.arc(cx,cy,R-30,0,7);g.stroke();g.setLineDash([]);
  if(T>=2){g.strokeStyle=lt(.35);g.lineWidth=1.4;g.beginPath();g.arc(cx,cy,R-46,0,7);g.stroke()}
  if(T===1){g.strokeStyle=lt(.8);g.lineWidth=2;for(let i=0;i<32;i++){const q=i/32*Math.PI*2,r1=R+(i%4?5:12);g.beginPath();g.moveTo(cx+Math.cos(q)*(R-2),cy+Math.sin(q)*(R-2));g.lineTo(cx+Math.cos(q)*r1,cy+Math.sin(q)*r1);g.stroke()}}
  if(T===4){for(let i=0;i<72;i++){const q=i/72*Math.PI*2,r1=R+(i%6?6:15);g.strokeStyle=i%3===0?'rgba(126,232,255,.8)':i%3===1?'rgba(246,166,232,.75)':'rgba(255,241,196,.85)';g.lineWidth=2;g.beginPath();g.moveTo(cx+Math.cos(q)*(R-2),cy+Math.sin(q)*(R-2));g.lineTo(cx+Math.cos(q)*r1,cy+Math.sin(q)*r1);g.stroke()}}
  const ws=W.slice(0,12);ws.forEach((w,i)=>{const a=-Math.PI/2+i/ws.length*Math.PI*2+Math.PI/ws.length,x=cx+Math.cos(a)*(R+40),y=cy+Math.sin(a)*(R+40),on=!!S.done[w.id];
   g.fillStyle='#08080b';g.strokeStyle=on?P.foil[2]:lt(.28);g.lineWidth=2;g.beginPath();if(T===2||T===3){ngon(g,x,y,18,T===2?4:6,T===2?0:Math.PI/6)}else g.arc(x,y,17,0,7);g.fill();g.stroke();
   if(on){g.fillStyle=P.acc;g.beginPath();if(T===2||T===3){ngon(g,x,y,9,T===2?4:6,T===2?0:Math.PI/6)}else g.arc(x,y,8,0,7);g.fill()}});
  const mh=450,r=Math.min(380/img.width,mh/img.height),iw=img.width*r,ih=img.height*r;g.save();g.beginPath();g.arc(cx,cy,R-12,0,7);g.clip();
  const spot=g.createRadialGradient(cx,cy-60,10,cx,cy-60,360);spot.addColorStop(0,rgba(P.spot,.2));spot.addColorStop(1,rgba(P.spot,0));g.fillStyle=spot;g.fillRect(cx-R,cy-R,R*2,R*2);
  g.imageSmoothingEnabled=false;g.shadowColor='rgba(0,0,0,.85)';g.shadowBlur=36;g.shadowOffsetY=18;g.drawImage(img,cx-iw/2,cy-ih/2+8,iw,ih);g.shadowBlur=0;g.shadowOffsetY=0;g.drawImage(img,cx-iw/2,cy-ih/2+8,iw,ih);g.restore();
  g.save();g.beginPath();g.arc(cx,cy,R-12,0,7);g.clip();const gl=g.createLinearGradient(cx-R,cy-R,cx+R*.2,cy+R*.3);gl.addColorStop(0,'rgba(255,255,255,.12)');gl.addColorStop(.35,'rgba(255,255,255,0)');g.fillStyle=gl;g.fillRect(cx-R,cy-R,R*2,R*2);g.restore()}
 // --- text ---
 {const g=L.text.getContext('2d');g.textAlign='left';g.textBaseline='alphabetic';const ls=v=>{if('letterSpacing' in g)g.letterSpacing=v+'px'};
  g.fillStyle=P.text;g.font="104px 'Abril Fatface',Georgia,serif";g.fillText('ZKSCAPE',900,170);
  g.fillStyle=foil(g,900,184,1300,222);g.font="600 24px ui-monospace,Menlo,Consolas,monospace";ls(9);g.fillText("EXPLORER'S SEAL",904,212);ls(0);
  let ny=300;if(NAME){const nm=NAME.toUpperCase();let fs=60;g.font=fs+"px 'Abril Fatface',Georgia,serif";ls(4);while(g.measureText(nm).width>440&&fs>26){fs-=2;g.font=fs+"px 'Abril Fatface',Georgia,serif"}
   g.fillStyle=foil(g,904,250,1340,300);g.fillText(nm,904,288);const nw=g.measureText(nm).width;ls(0);g.strokeStyle=ac(.8);g.lineWidth=2;g.beginPath();g.moveTo(906,302);g.lineTo(906+Math.min(440,nw*.5+60),302);g.stroke();ny=336}
  g.fillStyle=P.acc;g.font="600 28px ui-monospace,Menlo,Consolas,monospace";g.fillText(I.type,904,ny+(NAME?0:-2));g.fillStyle=P.text;g.font="600 22px ui-monospace,Menlo,Consolas,monospace";g.fillText(I.rank+'  '+'\u2605'.repeat(lv+1),904,ny+32);
  g.strokeStyle=lt(.3);g.lineWidth=1.5;g.beginPath();g.moveTo(904,ny+54);g.lineTo(1500,ny+54);g.stroke();
  g.font=(NAME?"24px":"26px")+" ui-monospace,Menlo,Consolas,monospace";const rows=[['SCORE',fmtN(s.score)],['TIME',fmtT(s.elapsed_seconds)],['ACCURACY',s.accuracy+'%  ('+s.first_try+'/'+s.correct_answers+' first try)'],['WORLDS',s.worlds_completed+'/10   BONUS '+s.bonus_worlds_completed+'/2'],['ARTIFACTS',String(s.artifacts_collected)],['HINTS',String(s.hints_used)],['BEST AT',I.best.toUpperCase()]];
  rows.forEach(([a,b],i)=>{const y=(NAME?424:392)+i*(NAME?39:43);g.fillStyle=DIMC;g.fillText(a,904,y);g.fillStyle=i===0?P.acc:P.text;g.fillText(b,1112,y);g.strokeStyle=lt(.08);g.beginPath();g.moveTo(904,y+13);g.lineTo(1500,y+13);g.stroke()});
  g.fillStyle=DIMC;g.font="17px ui-monospace,Menlo,Consolas,monospace";g.fillText('ID '+S.id,904,712);
  g.textAlign='center';g.fillStyle=foil(g,900,730,1500,780);g.font="600 30px Georgia,'Times New Roman',serif";ls(10);g.fillText('PROOF OF THE JOURNEY',1202,754);ls(0);
  g.fillStyle=DIMC;g.font="italic 21px Georgia,'Times New Roman',serif";g.fillText('One journey completed. Countless possibilities remain.',1202,788);
  g.textAlign='left';g.fillStyle=T===3?P.light:P.acc;g.font="600 38px Caveat,cursive";g.fillText('WELCOME TO THE SHIELDED WORLD.',T>=3?176:122,828);g.fillStyle=DIMC;g.font="15px sans-serif";g.textAlign='right';g.fillText('In-browser collectible \u2014 not an NFT, not on-chain.',1478,828)}
 {const g=L.seal.getContext('2d');seal(g,SX,SY,SR,1,TIER>=3?.5:0)}
 return L}

function compose(g,L,o){
 g.clearRect(0,0,WW,HH);g.save();shape(g,10);g.clip();
 g.globalAlpha=o.base;g.drawImage(L.base,0,0);g.globalAlpha=o.port;g.drawImage(L.port,0,0);
 if(o.portLit<1){g.globalAlpha=(1-o.portLit)*.82*o.port;g.save();g.beginPath();g.arc(430,440,293,0,7);g.clip();g.fillStyle='#050509';g.fillRect(0,0,WW,HH);g.restore()}
 g.globalAlpha=o.text;g.drawImage(L.text,0,0);
 g.globalAlpha=o.frame;g.drawImage(L.frame,0,0);g.globalAlpha=o.frame*.14;g.drawImage(L.eyeL,0,0);
 if(o.seal>0){const sc=lerp(1.25,1,sm(o.seal));g.save();g.translate(SX,SY);g.scale(sc,sc);g.translate(-SX,-SY);g.globalAlpha=sm(o.seal);g.drawImage(L.seal,0,0);g.restore()}
 g.restore();g.globalAlpha=1}

function showCard(D){
 still=null;if(!D||!D.canvas||!D.img||!D.img.width)return false;
 let L;try{L=build(D)}catch(e){console.warn('ZKCARD build',e);return false}
 const c=D.canvas,g=c.getContext('2d'),reduce=!!D.reduce,token={};cur=token;const T=TIER;
 still=mk();compose(still.getContext('2d'),L,{base:1,frame:1,port:1,portLit:1,text:1,seal:1});
 const finalDraw=()=>{g.clearRect(0,0,WW,HH);g.drawImage(still,0,0)};
 c.width=WW;c.height=HH;try{c.style.border='0';c.style.borderRadius='0';c.style.background='none'}catch(e){}
 if(reduce){finalDraw();return true}
 let t0=null,last=0,px=.5,py=.5,ptr=false;const tmp=mk(),tg=tmp.getContext('2d');
 const onMove=e=>{const r=c.getBoundingClientRect();px=clamp((e.clientX-r.left)/r.width,0,1);py=clamp((e.clientY-r.top)/r.height,0,1);ptr=true};
 c.addEventListener('pointermove',onMove);
 const endOn=()=>{const e=document.getElementById('s-end');return e&&e.classList.contains('on')};
 function stop(){c.removeEventListener('pointermove',onMove);if(cur===token)finalDraw()}
 function frame(now){try{frame0(now)}catch(e){console.warn('ZKCARD frame',e);if(cur===token){cur=null;finalDraw()}}}
 function frame0(now){
  if(cur!==token){c.removeEventListener('pointermove',onMove);return}
  if(!endOn()){stop();return}
  if(document.hidden){requestAnimationFrame(frame);return}
  if(t0==null)t0=now;const t=(now-t0)/1000,idle=t>3.7;
  if(idle&&now-last<33){requestAnimationFrame(frame);return}last=now;
  if(!idle){
   const mat=sm(seg(t,0,.9)),forge=seg(t,.5,1.7),port=sm(seg(t,1.5,2.5)),sealT=seg(t,2.4,3.1),txt=sm(seg(t,2.1,3));
   g.globalAlpha=1;g.clearRect(0,0,WW,HH);
   compose(g,L,{base:mat*.9+.1*sm(seg(t,.9,1.5)),frame:0,port:port,portLit:port,text:txt,seal:sealT});
   if(forge>0){g.save();const Pm=2*(WW+HH),len=forge*Pm;g.beginPath();const segs=48;for(let i=0;i<segs;i++){const a=i/segs*Pm;if(a>len)break;const b=Math.min(len,(i+1)/segs*Pm);const pa=perim(a),pb=perim(b);
     const x0=Math.min(pa[0],pb[0])-60,y0=Math.min(pa[1],pb[1])-60,x1=Math.max(pa[0],pb[0])+60,y1=Math.max(pa[1],pb[1])+60;g.rect(x0,y0,x1-x0,y1-y0)}
    g.clip();g.globalAlpha=1;g.drawImage(L.frame,0,0);g.globalAlpha=.14;g.drawImage(L.eyeL,0,0);g.restore();
    const h=perim(len);if(forge<1){const hg=g.createRadialGradient(h[0],h[1],0,h[0],h[1],70);hg.addColorStop(0,rgba(P.glint,.95));hg.addColorStop(.3,ac(.5));hg.addColorStop(1,ac(0));g.fillStyle=hg;g.fillRect(h[0]-70,h[1]-70,140,140)}}
   const pa=1-sm(seg(t,.2,1.1));if(pa>0){g.fillStyle=lt(.8*pa);for(let i=0;i<90;i++){const q=perim(hash(i)*2*(WW+HH)),f=1-sm(seg(t,hash(i*3)*.4,.9)),x=q[0]+(hash(i*5)-.5)*900*f,y=q[1]+(hash(i*7)-.5)*700*f;g.fillRect(x,y,3,3)}}
   const ring=Math.sin(clamp(seg(t,1.5,2.7),0,1)*Math.PI);if(ring>0){g.save();g.globalCompositeOperation='lighter';g.strokeStyle=ac(.55*ring);g.lineWidth=5;g.setLineDash([14,12]);g.beginPath();g.arc(430,440,335+30*(1-ring),0,7);g.stroke();g.restore()}
   const gt=seg(t,3.0,3.7);if(gt>0&&gt<1)glint(g,L,tmp,tg,gt,1);
   g.globalAlpha=1;
  }else{
   const k=t-3.7;g.globalAlpha=1;g.clearRect(0,0,WW,HH);g.drawImage(still,0,0);
   // per-tier life: iron is inert, bronze breathes, silver snows, crimson smoulders, the relic shimmers in colour
   if(T>=1){const pulse=.5+.5*Math.sin(k*1.2);g.save();g.globalCompositeOperation='lighter';const gg=g.createRadialGradient(SX,SY,30,SX,SY,130);gg.addColorStop(0,ac((.04+.06*pulse)*(T/2)));gg.addColorStop(1,ac(0));g.fillStyle=gg;g.fillRect(SX-150,SY-150,300,300);g.restore()}
   const per=T>=3?6:9,cyc=(k%per)/per,ph=cyc<.34?cyc/.34:-1;if(T>=1&&ph>=0)glint(g,L,tmp,tg,ph,T===0?.4:.8);if(T===0){const c0=(k%14)/14;if(c0<.3)glint(g,L,tmp,tg,c0/.3,.35)}
   if(T>=4){const c2=((k+3)%per)/per,p2=c2<.3?c2/.3:-1;if(p2>=0)glint(g,L,tmp,tg,p2,.5)}
   if(T===4){g.save();g.globalCompositeOperation='lighter';const hu=(k*40)%360;const ag=g.createLinearGradient(0,0,WW,HH);ag.addColorStop(0,'hsla('+hu+',90%,65%,.05)');ag.addColorStop(.5,'hsla('+(hu+120)+',90%,65%,.0)');ag.addColorStop(1,'hsla('+(hu+240)+',90%,65%,.05)');g.fillStyle=ag;g.fillRect(0,0,WW,HH);g.restore()}
   if(ptr&&T>=1){g.save();g.globalCompositeOperation='lighter';const lg=g.createRadialGradient(px*WW,py*HH,0,px*WW,py*HH,420);lg.addColorStop(0,rgba(P.glint,.07));lg.addColorStop(1,rgba(P.glint,0));g.fillStyle=lg;g.fillRect(0,0,WW,HH);g.restore()}
   if(T>=1){const n=6+T*6;g.fillStyle=rgba(P.dust,.6);for(let i=0;i<n;i++){const a=hash(i*2.9),m=(k*(T===3?.03:T===2?.008:.012)*(.4+hash(i))+a)%1;const x=60+((a*1480+Math.sin(k*.3+i)*(T===2?30:14))%1480),y=T===3?HH-m*HH:T===2?m*HH:HH-m*HH;g.globalAlpha=.3*Math.abs(Math.sin(k*.6+i));g.fillRect(x,y,T===3?3:2.5,T===3?3:2.5)}g.globalAlpha=1}
  }
  requestAnimationFrame(frame)}
 requestAnimationFrame(frame);
 setTimeout(()=>{if(cur===token&&!endOn())stop()},6000);
 return true}

function perim(d){const Pm=2*(WW+HH);d=((d%Pm)+Pm)%Pm;if(d<WW)return[d,0];d-=WW;if(d<HH)return[WW,d];d-=HH;if(d<WW)return[WW-d,HH];d-=WW;return[0,HH-d]}
function glint(g,L,tmp,tg,p,a){
 tg.globalCompositeOperation='source-over';tg.clearRect(0,0,WW,HH);const x=lerp(-300,WW+300,p),gr=tg.createLinearGradient(x-160,0,x+160,HH*.4);
 if(TIER===4){gr.addColorStop(0,'rgba(126,232,255,0)');gr.addColorStop(.3,'rgba(126,232,255,'+(.8*a).toFixed(2)+')');gr.addColorStop(.5,'rgba(255,255,255,'+(.95*a).toFixed(2)+')');gr.addColorStop(.7,'rgba(246,166,232,'+(.8*a).toFixed(2)+')');gr.addColorStop(1,'rgba(246,166,232,0)')}
 else{gr.addColorStop(0,rgba(P.glint,0));gr.addColorStop(.5,rgba(P.glint,.9*a));gr.addColorStop(1,rgba(P.glint,0))}
 tg.fillStyle=gr;tg.fillRect(0,0,WW,HH);tg.globalCompositeOperation='destination-in';tg.drawImage(L.frame,0,0);
 g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.55;g.drawImage(tmp,0,0);g.restore();
 const near=Math.max(0,1-Math.abs(x+30-1160)/150);if(near>0){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=near*.75*a;g.drawImage(L.eyeL,0,0);g.restore()}
 g.save();g.globalCompositeOperation='lighter';const sg=g.createLinearGradient(x-220,0,x+220,HH*.5);sg.addColorStop(0,rgba(P.glint,0));sg.addColorStop(.5,rgba(P.glint,.05*a));sg.addColorStop(1,rgba(P.glint,0));g.fillStyle=sg;g.fillRect(0,0,WW,HH);g.restore()}
try{document.fonts&&document.fonts.load("104px 'Abril Fatface'").catch(()=>{});document.fonts&&document.fonts.load("600 38px Caveat").catch(()=>{})}catch(e){}
return{show:showCard,exportCanvas:()=>still,cancel:()=>{cur=null}}
})();

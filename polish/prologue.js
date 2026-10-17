/* ZKPRO - the ZKSCAPE prologue: a ~13 second cinematic that plays once the player presses ENTER ZKSCAPE.

   ISOLATION: this file touches no game state. index.html hands it one small `adapter` (see ENTRY in index.html):
     adapter.canvas            the engine's own world canvas (we only READ pixels from it, via drawImage)
     adapter.begin(id, cb)     starts a real world scene through the engine's own startWorld(), calls cb(ok)
     adapter.pure(id,t,...)    draws a world's shared backdrop (the engine's own bg()/fore()) with no world running
     adapter.stop()            stops whatever world is running
     adapter.audio()           {on, level} from the player's saved audio preferences
     adapter.done()            called exactly once when the player should get control (HUB)
   Everything the player sees is real project art: the engine's world scenes, the selected PFP, NPCs/zkSNARK_clean.png.
   Everything the player hears is synthesised here (WebAudio): no files, nothing remote, nothing that can 404.

   TIMELINE (seconds)  0-2 choice | 2-5 three worlds | 5-6.65 guide | 6.65-8.1 proof | 8.1-11.1 journey | 11.1-12.45 threshold | 12.45 impact | 12.7 HUB handed over */
window.ZKPRO=(function(){
'use strict';
const T_FLASH=12.45,T_HAND=12.72,T_END=13.8;
const SHOTS=[
 {k:'choice',a:0,b:2.0},
 {k:'world',id:'shielded',a:2.0,b:3.05,y0:.12,h:.74,cx:[.32,.5],z:.1,dk:.42},
 {k:'world',id:'canvas',a:3.05,b:4.05,y0:.12,h:.74,cx:[.72,.42],z:.1},
 {k:'world',id:'orchard',a:4.05,b:5.05,y0:.2,h:.67,cx:[.36,.6],z:.1},
 {k:'guide',a:5.05,b:6.65},
 {k:'proof',a:6.65,b:8.1},
 {k:'world',id:'proof',a:8.1,b:9.1,y0:.1,h:.76,cx:[.3,.62],z:.12,fast:1},
 {k:'world',id:'keys',a:9.1,b:10.1,y0:.2,h:.67,cx:[.7,.3],z:.12,fast:1},
 {k:'world',id:'zilkroad',a:10.1,b:11.1,y0:.12,h:.74,cx:[.28,.7],z:.12,fast:1},
 {k:'gate',a:11.1,b:T_END}
];
const clamp=(x,a,b)=>x<a?a:x>b?b:x,lerp=(a,b,t)=>a+(b-a)*t,sm=t=>(t=clamp(t,0,1))*t*(3-2*t),seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
function rgb(c){c=String(c||'#fff').trim();let m=/^#([0-9a-f]{6})/i.exec(c);if(m){const n=parseInt(m[1],16);return[n>>16,n>>8&255,n&255]}m=/^#([0-9a-f]{3})$/i.exec(c);if(m){const s=m[1];return[parseInt(s[0]+s[0],16),parseInt(s[1]+s[1],16),parseInt(s[2]+s[2],16)]}m=/(\d+)\D+(\d+)\D+(\d+)/.exec(c);return m?[+m[1],+m[2],+m[3]]:[255,255,255]}
const rgba=(c,a)=>{const r=rgb(c);return'rgba('+r[0]+','+r[1]+','+r[2]+','+clamp(a,0,1).toFixed(3)+')'};
const mix=(a,b,t)=>{const x=rgb(a),y=rgb(b);return'rgb('+Math.round(lerp(x[0],y[0],t))+','+Math.round(lerp(x[1],y[1],t))+','+Math.round(lerp(x[2],y[2],t))+')'};
let live=null;

/* =====================================================================================================
   AUDIO: one ~14 s cue, synthesised. Works on any BaseAudioContext, so it can be rendered offline for tests.
   0-2 rumble + sub, first crystal    2-8 restrained pulse, pad opens    8-12 pulse doubles, riser
   12.3 breath of silence             12.45 impact (sub boom, metal, open Dm chord)    ~14.4 clean tail
   ===================================================================================================== */
function cue(ac,dest,T0){
 const sr=ac.sampleRate,wn=ac.createBuffer(1,sr*2,sr),wd=wn.getChannelData(0);for(let i=0;i<wd.length;i++)wd[i]=Math.random()*2-1;
 const bn=ac.createBuffer(1,sr*4,sr),bd=bn.getChannelData(0);let l=0;for(let i=0;i<bd.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;bd[i]=l*3.5}
 const ir=ac.createBuffer(2,Math.floor(sr*2.8),sr);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++){const k=i/d.length;d[i]=(Math.random()*2-1)*Math.pow(1-k,2.6)*(k<.01?k*100:1)}}
 const rv=ac.createConvolver();rv.buffer=ir;const rvg=ac.createGain();rvg.gain.value=.6;rv.connect(rvg);rvg.connect(dest);
 const dry=ac.createGain();dry.connect(dest);
 const pre=ac.createGain();pre.connect(dry);const send=ac.createGain();send.gain.value=.55;pre.connect(send);send.connect(rv);   // main bus: dry + reverb, ducked before the impact
 const hit=ac.createGain();hit.connect(dry);const hs=ac.createGain();hs.gain.value=.5;hit.connect(hs);hs.connect(rv);                // impact bus: not ducked
 const at=t=>T0+t;
 const env=(g,pts)=>{g.gain.setValueAtTime(pts[0][1],at(pts[0][0]));for(let i=1;i<pts.length;i++)g.gain.linearRampToValueAtTime(pts[i][1],at(pts[i][0]))};
 const osc=(ty,f,t0,t1,d,det)=>{const o=ac.createOscillator();o.type=ty;o.frequency.value=f;if(det)o.detune.value=det;o.connect(d);o.start(at(t0));o.stop(at(t1)+.05);return o};
 const nz=(buf,t0,t1,d)=>{const s=ac.createBufferSource();s.buffer=buf;s.loop=true;s.connect(d);s.start(at(t0));s.stop(at(t1)+.05);return s};
 const G=(v,d)=>{const g=ac.createGain();g.gain.value=v;d&&g.connect(d);return g};
 const F=(ty,f,q,d)=>{const x=ac.createBiquadFilter();x.type=ty;x.frequency.value=f;x.Q.value=q;d&&x.connect(d);return x};
 // main-bus duck: a held breath right before the hit
 pre.gain.setValueAtTime(1,at(12.2));pre.gain.linearRampToValueAtTime(.12,at(12.3));pre.gain.setValueAtTime(.12,at(12.44));pre.gain.linearRampToValueAtTime(.9,at(12.7));
 // 1. low rumble (brown noise) + sub
 {const g=G(0,dry),f=F('lowpass',120,.7,g);env(g,[[0,0],[1.7,.55],[5,.38],[11.8,.62],[12.2,.5],[12.3,0]]);nz(bn,0,12.4,f)}
 {const g=G(0,dry);env(g,[[0,0],[2.2,.34],[11.9,.42],[12.22,.3],[12.3,0]]);osc('sine',36.7,0,12.4,g);const h=G(0,dry);env(h,[[0,0],[3,.1],[11.9,.16],[12.3,0]]);osc('sine',73.4,0,12.4,h)}
 // 2. pads: Dm -> Bb -> Gm, filter opening towards the hit
 function pad(fs,t0,t1,pk,c0,c1,atk,rel){const g=G(0,pre),f=F('lowpass',c0,.8,g);f.frequency.setValueAtTime(c0,at(t0));f.frequency.exponentialRampToValueAtTime(c1,at(t1));env(g,[[t0,0],[t0+atk,pk],[t1,pk],[t1+rel,0]]);fs.forEach(fr=>{osc('sawtooth',fr,t0,t1+rel,f,-7);osc('sawtooth',fr,t0,t1+rel,f,7)})}
 pad([73.42,110,146.83,174.61,220],.5,8.2,.021,180,1500,2.6,.8);
 pad([58.27,116.54,174.61,233.08,293.66],7.8,10.2,.021,500,2400,.6,.5);
 pad([98,146.83,196,233.08,293.66],9.9,12.3,.024,900,4200,.5,.12);
 // 3. crystalline / metallic accents
 function bell(f,t,v,dur){const g=G(0,pre);g.gain.setValueAtTime(.0001,at(t));g.gain.exponentialRampToValueAtTime(v,at(t)+.006);g.gain.exponentialRampToValueAtTime(.0001,at(t)+dur);
  const c=ac.createOscillator();c.frequency.value=f;const m=ac.createOscillator();m.frequency.value=f*3.51;const mg=ac.createGain();mg.gain.setValueAtTime(f*1.7,at(t));mg.gain.exponentialRampToValueAtTime(f*.05,at(t)+dur*.7);m.connect(mg);mg.connect(c.frequency);c.connect(g);
  c.start(at(t));m.start(at(t));c.stop(at(t)+dur+.05);m.stop(at(t)+dur+.05);osc('sine',f*2.76,t,t+dur*.5,G(v*.22,pre))}
 [[.9,1318.5,.05,2.2],[1.5,1760,.04,2],[2.0,1174.7,.07,2],[3.05,1567.98,.07,2],[4.05,1318.5,.07,2],[5.05,880,.08,2.6],[5.55,1760,.04,2.2],[6.0,2349.3,.03,2],
  [6.65,293.66,.1,2.6],[7.0,1174.7,.05,1.2],[7.12,1396.9,.05,1.2],[7.24,1760,.05,1.2],[7.36,2349.3,.06,1.6],[7.5,1174.7,.09,2.8],[7.5,1760,.06,2.8],[8.1,1174.7,.07,1.5],[9.1,1396.9,.07,1.5],[10.1,1760,.07,1.5],[11.1,2349.3,.08,1.8]]
  .forEach(b=>bell(b[1],b[0],b[2],b[3]));
 // 4. restrained pulse (every 0.5 s), then every 0.25 s from the journey; tiny metallic ticks off the beat
 function thump(t,v){const g=G(0,pre),o=ac.createOscillator();o.frequency.setValueAtTime(118,at(t));o.frequency.exponentialRampToValueAtTime(46,at(t)+.13);g.gain.setValueAtTime(.0001,at(t));g.gain.exponentialRampToValueAtTime(v,at(t)+.008);g.gain.exponentialRampToValueAtTime(.0001,at(t)+.3);o.connect(g);o.start(at(t));o.stop(at(t)+.35)}
 function tick(t,v){const g=G(0,pre),f=F('highpass',7000,.7,g);g.gain.setValueAtTime(.0001,at(t));g.gain.exponentialRampToValueAtTime(v,at(t)+.003);g.gain.exponentialRampToValueAtTime(.0001,at(t)+.05);nz(wn,t,t+.07,f)}
 for(let t=2;t<8.05;t+=.5)thump(t,lerp(.09,.2,seg(t,2,8)));
 for(let t=8.1;t<12.1;t+=.25){thump(t,lerp(.22,.34,seg(t,8,12)));if(Math.round((t-8.1)/.25)%2===1)tick(t+.001,.03)}
 // 5. risers into the hit
 {const g=G(0,pre),f=F('bandpass',300,3.2,g);f.frequency.setValueAtTime(300,at(8));f.frequency.exponentialRampToValueAtTime(9000,at(12.2));env(g,[[8,0],[12.2,.2],[12.3,0]]);nz(wn,8,12.3,f)}
 {const g=G(0,pre),f=F('lowpass',3200,.7,g),o=osc('sawtooth',130,10,12.3,f);o.frequency.setValueAtTime(130,at(10));o.frequency.exponentialRampToValueAtTime(1040,at(12.25));env(g,[[10,0],[12.2,.05],[12.3,0]])}
 // 6. the impact: sub boom, noise wash, metal, bells and an open Dm chord, then a clean tail
 {const g=G(0,hit),o=ac.createOscillator();o.frequency.setValueAtTime(72,at(T_FLASH));o.frequency.exponentialRampToValueAtTime(26,at(T_FLASH)+1.6);g.gain.setValueAtTime(.0001,at(T_FLASH));g.gain.exponentialRampToValueAtTime(.8,at(T_FLASH)+.006);g.gain.exponentialRampToValueAtTime(.0001,at(T_FLASH)+2.3);o.connect(g);o.start(at(T_FLASH));o.stop(at(T_FLASH)+2.4)}
 {const g=G(0,hit),f=F('lowpass',9000,.6,g);f.frequency.setValueAtTime(9000,at(T_FLASH));f.frequency.exponentialRampToValueAtTime(260,at(T_FLASH)+1.8);g.gain.setValueAtTime(.0001,at(T_FLASH));g.gain.exponentialRampToValueAtTime(.55,at(T_FLASH)+.01);g.gain.exponentialRampToValueAtTime(.0001,at(T_FLASH)+2);nz(wn,T_FLASH,T_FLASH+2.1,f)}
 [1,2.43,3.89,5.11,6.7].forEach((r,i)=>{const g=G(0,hit);g.gain.setValueAtTime(.0001,at(T_FLASH));g.gain.exponentialRampToValueAtTime(.11/(1+i*.4),at(T_FLASH)+.008);g.gain.exponentialRampToValueAtTime(.0001,at(T_FLASH)+2.2);osc('sine',196*r,T_FLASH,T_FLASH+2.3,g)});
 {const g=G(0,hit),f=F('lowpass',2600,.7,g);env(g,[[T_FLASH,0],[T_FLASH+.03,.1],[T_FLASH+1.0,.07],[T_FLASH+2.1,0]]);[73.42,110,146.83,174.61,220,293.66].forEach(fr=>{osc('sawtooth',fr,T_FLASH,T_FLASH+2.2,f,-6);osc('sawtooth',fr,T_FLASH,T_FLASH+2.2,f,6)})}
 [[1174.7,.08],[1760,.06],[2349.3,.05]].forEach((b,i)=>{const g=G(0,hit);g.gain.setValueAtTime(.0001,at(T_FLASH+.02));g.gain.exponentialRampToValueAtTime(b[1],at(T_FLASH+.03));g.gain.exponentialRampToValueAtTime(.0001,at(T_FLASH)+2.4);osc('sine',b[0],T_FLASH,T_FLASH+2.5,g)});
 return{end:T_FLASH+2.6}
}

/* ===================================================================================================== */
function play(o){
 if(live)return false;                                   // never two at once: no stacked loops, audio, or callbacks
 const host=o.host,ad=o.adapter;if(!host||!ad||!ad.canvas)return false;
 const reduce=!!o.reduce,pal=o.pal||{pr:'#f4b728',se:'#4ee3f0',ac:'#9a6bff'};
 const L=live={t:0,t0:null,pause:0,hid:0,raf:0,handed:false,over:false,w:0,h:0,world:null,wReady:false,wFail:false,wId:'',ac:null,listeners:[],timers:[]};
 const root=document.createElement('div');root.id='zkprologue';root.setAttribute('aria-label','ZKSCAPE intro');root.tabIndex=-1;
 root.style.cssText='position:absolute;inset:0;z-index:200;background:#000;touch-action:none;cursor:default;opacity:1';
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;display:block!important;margin:0!important;border:0!important;border-radius:0!important;transform:none!important;box-shadow:none!important;filter:none!important;background:none!important;animation:none!important';root.appendChild(cv);
  host.appendChild(root);document.documentElement.classList.add('zpro-on');
 const g=cv.getContext('2d');
 const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
 const tA=mk(8,8),tB=mk(8,8),bl=mk(192,108),blx=bl.getContext('2d');
 const img=src=>{const i=new Image();i.decoding='async';i.src=src;return i};
 const pfp=img(o.pfp),npc=img(o.npc);
 const ok=i=>i&&i.complete&&i.naturalWidth>0;
 const on=(t,e,f,c)=>{t.addEventListener(e,f,c);L.listeners.push([t,e,f,c])};
 const later=(f,ms)=>{const id=setTimeout(f,ms);L.timers.push(id);return id};

 // ---------------- audio (best effort; the cinematic is complete without it) ----------------
 try{const a=o.adapter.audio?o.adapter.audio():{on:true,level:.6};
  if(a&&a.on&&a.level>0){const AC=window.AudioContext||window.webkitAudioContext;if(AC){const ac=new AC();L.ac=ac;ac.resume&&ac.resume();
   const out=ac.createGain();out.gain.value=0;const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.25;out.connect(comp);comp.connect(ac.destination);
   const T0=ac.currentTime+.05;out.gain.setValueAtTime(0,T0);out.gain.linearRampToValueAtTime(clamp(a.level*.8,0,1),T0+.5);L.out=out;L.T0=T0;
   cue(ac,out,T0);
   out.gain.setValueAtTime(clamp(a.level*.8,0,1),T0+13.9);out.gain.linearRampToValueAtTime(0,T0+14.6)}}}catch(e){try{L.ac&&L.ac.close()}catch(_){}L.ac=null}

 // ---------------- sizing ----------------
 function size(){const w=Math.max(2,innerWidth|0),h=Math.max(2,innerHeight|0);if(w!==L.w||h!==L.h){cv.width=w;cv.height=h;L.w=w;L.h=h;L.vig=null}}
 size();on(window,'resize',size);

  // ---------------- input lock (the cinematic always plays through; there is no skip) ----------------
  on(window,'keydown',e=>{if(!live)return;if(e.key==='Tab'||e.metaKey||e.ctrlKey||e.altKey||/^F\d+$/.test(e.key))return;e.preventDefault();e.stopPropagation()},true);
  on(window,'keyup',e=>{if(live)e.stopPropagation()},true);
 on(document,'visibilitychange',()=>{if(document.hidden)L.hid=performance.now();else if(L.hid){L.pause+=performance.now()-L.hid;L.hid=0}if(!L.ac)return;try{document.hidden?L.ac.suspend():L.ac.resume()}catch(e){}});
 try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur();root.focus({preventScroll:true})}catch(e){}

 // ---------------- helpers: lighting, particles, post ----------------
 function sizeTmp(c,w,h){if(c.width!==w||c.height!==h){c.width=w;c.height=h}return c.getContext('2d')}
 /* draws an image lit by L (0 = black silhouette .. 1 = full), plus a moving band of full-brightness "rim" light. x = centre, y = bottom */
 function sprite(im,x,y,aw,ph,lit,band,rim,tint,flip){
  const w=Math.max(2,Math.ceil(aw)),h=Math.max(2,Math.ceil(ph)),a=sizeTmp(tA,w,h);
  a.globalCompositeOperation='source-over';a.clearRect(0,0,w,h);a.imageSmoothingEnabled=false;a.drawImage(im,0,0,w,h);
  a.globalCompositeOperation='source-atop';a.fillStyle='rgba(3,5,14,'+clamp(1-lit,0,1).toFixed(3)+')';a.fillRect(0,0,w,h);
  g.save();g.translate(x,y-h);if(flip){g.translate(w/2,0);g.scale(-1,1);g.translate(-w/2,0)}else g.translate(-w/2,0);g.imageSmoothingEnabled=false;g.drawImage(tA,0,0);
  if(rim>0&&band!=null){const b=sizeTmp(tB,w,h);b.globalCompositeOperation='source-over';b.clearRect(0,0,w,h);b.imageSmoothingEnabled=false;b.drawImage(im,0,0,w,h);
   if(tint){b.globalCompositeOperation='source-atop';b.fillStyle=rgba(tint,.35);b.fillRect(0,0,w,h)}
   b.globalCompositeOperation='destination-in';const gr=b.createLinearGradient(w*(band-.3),0,w*(band+.3),h*.5);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.5,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');b.fillStyle=gr;b.fillRect(0,0,w,h);
   g.globalAlpha=rim;g.drawImage(tB,0,0);g.globalAlpha=1}
  g.restore()}
 function glow(x,y,rx,ry,col,a){if(a<=0)return;g.save();g.translate(x,y);g.scale(1,ry/rx);const r=g.createRadialGradient(0,0,0,0,0,rx);r.addColorStop(0,rgba(col,a));r.addColorStop(.45,rgba(col,a*.35));r.addColorStop(1,rgba(col,0));g.fillStyle=r;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore()}
 function dust(t,n,col,al,sp,seed,x0,y0,w,h){const U=L.h/720;g.fillStyle=col;for(let i=0;i<n;i++){const a=hash(i*7.3+seed),b=hash(i*3.1+seed*2),k=hash(i*5.9+seed*3);const x=x0+(((a*w+Math.sin(t*.6+i)*14*U+(reduce?0:t*sp*(.3+k)*U))%w)+w)%w,y=y0+(((b*h-(reduce?0:t*sp*.5*(.3+k)*U))%h)+h)%h;g.globalAlpha=al*(.25+.75*Math.abs(Math.sin(t*(.6+k)+i)));const s=(1.2+k*2.2)*U;g.fillRect(x,y,s,s)}g.globalAlpha=1}
 function beams(t,n,col,al,seed){g.save();g.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const x=L.w*(.12+.76*hash(i+seed))+(reduce?0:Math.sin(t*.35+i*2)*L.w*.03),w=L.w*(.05+.05*hash(i*2+seed)),sl=L.w*(.16+.12*hash(i*3+seed));const gr=g.createLinearGradient(0,0,0,L.h*.95);gr.addColorStop(0,rgba(col,al));gr.addColorStop(1,rgba(col,0));g.fillStyle=gr;g.beginPath();g.moveTo(x,0);g.lineTo(x+w,0);g.lineTo(x+w+sl,L.h*.95);g.lineTo(x-w*.4+sl*.8,L.h*.95);g.fill()}g.restore()}
 function ridge(t,par,col,amp,seed,al){const U=L.h/720,step=Math.max(6,Math.round(10*U));g.fillStyle=col;g.globalAlpha=al;g.beginPath();g.moveTo(0,L.h);const off=reduce?0:t*par;for(let x=0;x<=L.w+step;x+=step){const X=x+off,h=amp*L.h*(.45+.55*Math.abs(Math.sin(X*.011+seed)*Math.cos(X*.0043+seed*1.7)))+hash(Math.floor(X/step)+seed)*amp*L.h*.35;g.lineTo(x,L.h-Math.round(h/step)*step)}g.lineTo(L.w+step,L.h);g.fill();g.globalAlpha=1}
 function vignette(a){if(!L.vig){const r=g.createRadialGradient(L.w/2,L.h*.5,Math.min(L.w,L.h)*.28,L.w/2,L.h*.5,Math.hypot(L.w,L.h)*.62);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,.82)');L.vig=r}g.globalAlpha=a;g.fillStyle=L.vig;g.fillRect(0,0,L.w,L.h);g.globalAlpha=1}
 function bloom(a){blx.imageSmoothingEnabled=true;blx.globalCompositeOperation='copy';blx.drawImage(cv,0,0,192,108);g.save();g.globalCompositeOperation='lighter';g.globalAlpha=a;g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(bl,0,0,L.w,L.h);g.restore()}
 function bars(t){const bh=clamp((L.h-L.w/2.2)/2,L.h*.045,L.h*.1)*sm(t/.7);if(bh>0){g.fillStyle='#000';g.fillRect(0,0,L.w,bh);g.fillRect(0,L.h-bh,L.w,bh)}}
 function dip(t,a,col,len){const k=1-seg(t,a,a+(len||.17));if(k>0){g.fillStyle=reduce?'rgba(0,0,0,'+(k*.9).toFixed(3)+')':rgba(col||'#dfe8ff',k*.85);g.fillRect(0,0,L.w,L.h)}}

 // ---------------- shots ----------------
 function drawWorldSrc(sh,u,t){
  const src=ad.canvas,sw=src.width,sh_=src.height;if(!sw||!sh_){return false}
  const wh=sh_*(sh.h-(reduce?0:sh.z*u)),ww=Math.min(sw,wh*L.w/L.h),cx=clamp(sw*lerp(sh.cx[0],reduce?(sh.cx[0]+sh.cx[1])/2:sh.cx[1],sm(u)),ww/2,sw-ww/2);
  const bandH=sh.h*sh_,cy=clamp(sh_*sh.y0+bandH/2+(bandH-wh)*.1,wh/2,sh_-wh/2);
  g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(src,cx-ww/2,cy-wh/2,ww,wh,0,0,L.w,L.h);return true}
 function shotWorld(sh,t){
  const u=seg(t,sh.a,sh.b);let drew=false;
  if(L.wFail){ad.pure(sh.id,t,(sh.fast?300:140)*u,1,L.w*.5,L.h*.8,L.w,L.h);drew=drawWorldSrc(Object.assign({},sh,{y0:.1,h:.8}),u,t)}
  else if(L.wReady)drew=drawWorldSrc(sh,u,t);
  if(!drew){return}
  g.fillStyle='rgba(3,5,14,'+(sh.dk||.22)+')';g.fillRect(0,0,L.w,L.h);
  const tint=pal.ac;beams(t,2,tint,.06,sh.a);dust(t,36,'#fff',.35,sh.fast?44:14,sh.a*3,0,0,L.w,L.h);
  ridge(t,sh.fast?-120:-40,'#02030a',.07,sh.a*1.7,.9);
  bloom(.3);
  if(sh.fast&&!reduce){ // streaks: motion without distortion
   g.save();g.globalCompositeOperation='lighter';g.fillStyle=rgba(pal.pr,.12);for(let i=0;i<9;i++){const y=L.h*(.14+.72*hash(i+sh.a)),x=((hash(i*3+sh.a)*L.w+t*L.w*(1.1+hash(i)))%(L.w*1.4))-L.w*.2,len=L.w*(.12+.22*hash(i*5));g.fillRect(x,y,len,Math.max(1,L.h*.0025))}g.restore()}
  vignette(.8)}
 function shotChoice(t){
  const u=t/2,Lf=sm(seg(t,.35,1.85)),U=L.h/720;
  const bgr=g.createRadialGradient(L.w/2,L.h*.56,0,L.w/2,L.h*.56,L.h*.95);bgr.addColorStop(0,mix('#02030a',pal.se,.2*Lf));bgr.addColorStop(1,'#010206');g.fillStyle=bgr;g.fillRect(0,0,L.w,L.h);
  beams(t,1,pal.pr,.1*Lf,3);
  glow(L.w/2,L.h*.56,L.h*.55,L.h*.5,pal.pr,.28*Lf);
  const iw=ok(pfp)?pfp.naturalWidth:1,ih=ok(pfp)?pfp.naturalHeight:1,ph=Math.min(L.h*.5,L.w*.7*ih/iw)*(reduce?1:lerp(.93,1.05,sm(u))),aw=ph*iw/ih;
  if(ok(pfp)){sprite(pfp,L.w/2,L.h*.52+ph*.5,aw,ph,.04+.9*Lf,lerp(-.3,1.3,seg(t,.5,1.9)),.85*(1-seg(t,1.7,2)),pal.ac)}
  // floor mist and a slow ring of light opening around them: a threshold
  g.save();g.globalCompositeOperation='lighter';const rr=L.h*.18*(1+.4*u);g.strokeStyle=rgba(pal.ac,.22*Lf);g.lineWidth=2*U;g.setLineDash([26*U,16*U]);g.beginPath();g.ellipse(L.w/2,L.h*.52+ph*.5,rr*2.1,rr*.42,0,0,7);g.stroke();g.restore();
  dust(t,34,pal.ac,.4,12,5,0,0,L.w,L.h);ridge(t,-10,'#010206',.06,2,.95);
  vignette(.9)}
 function shotGuide(t){
  const u=seg(t,5.05,6.65),U=L.h/720,Lf=sm(seg(u,.32,.72))*.78+(u>.3&&u<.72?(hash(Math.floor(t*30))>.82&&!reduce?-.25:0):0);
  const bgr=g.createLinearGradient(0,0,0,L.h);bgr.addColorStop(0,'#03040c');bgr.addColorStop(1,'#07102a');g.fillStyle=bgr;g.fillRect(0,0,L.w,L.h);
  glow(L.w*.5,L.h*.42,L.h*.8,L.h*.62,'#cfe0ff',.1+.38*sm(seg(u,.1,.8)));
  beams(t,2,'#cfe0ff',.09,11);
  const iw=ok(npc)?npc.naturalWidth:1,ih=ok(npc)?npc.naturalHeight:1,ph=Math.min(L.h*.86,L.w*.9*ih/iw)*(reduce?1:lerp(1,1.09,sm(u))),aw=ph*iw/ih;
  if(ok(npc)){
   // the pixels that dissolve off its left side keep drifting away: it is made of something being proven
   g.fillStyle='#dfe8ff';for(let i=0;i<26;i++){const k=hash(i*1.7),p=(t*.35*(.4+k)+k*3)%1,x=L.w*.5-aw*.18-p*aw*.7,y=L.h*(.34+.5*hash(i*4.1))+Math.sin(t*2+i)*6*U;g.globalAlpha=(1-p)*.75*Lf+.05;const s=(3+k*6)*U;g.fillRect(Math.round(x/s)*s,Math.round(y/s)*s,s,s)}g.globalAlpha=1;
   sprite(npc,L.w*.5,L.h*1.03,aw,ph,clamp(Lf,0,1),lerp(1.2,-.2,seg(u,0,.9)),.9,'#9db8ff')}
  dust(t,30,'#cfe0ff',.35,10,8,0,0,L.w,L.h);vignette(.92)}
 function shotProof(t){
  const u=seg(t,6.65,8.1),U=L.h/720,cx=L.w*(L.w<L.h?.5:.6),cy=L.h*.49,R=L.h*.26,pr=sm(seg(u,.3,.62)),ver=sm(seg(u,.55,.7));
  const bgr=g.createRadialGradient(cx,cy,0,cx,cy,L.h);bgr.addColorStop(0,mix('#06061a',pal.ac,.14));bgr.addColorStop(1,'#020208');g.fillStyle=bgr;g.fillRect(0,0,L.w,L.h);
  g.save();g.globalCompositeOperation='lighter';
  // lattice: three counter-rotating rings of vertices, tied together by thin lines
  const rings=[[R*1.08,6,.5],[R*1.42,6,-.35],[R*1.8,3,.22]],pts=rings.map((r,ri)=>Array.from({length:r[1]},(_,i)=>{const a=(reduce?0:t*r[2])+i*Math.PI*2/r[1]+ri;return[cx+Math.cos(a)*r[0],cy+Math.sin(a)*r[0]*.92]}));
  const lc=mix(pal.ac,'#5dd68a',ver);g.lineWidth=1.6*U;
  pts.forEach((p,ri)=>{g.strokeStyle=rgba(lc,.25+.45*ver+.1*ri*0);g.beginPath();p.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.stroke()});
  g.strokeStyle=rgba(lc,.12+.4*ver);g.beginPath();pts[0].forEach((q,i)=>{const n=pts[1][i%pts[1].length];g.moveTo(q[0],q[1]);g.lineTo(n[0],n[1])});pts[1].forEach((q,i)=>{const n=pts[2][i%pts[2].length];g.moveTo(q[0],q[1]);g.lineTo(n[0],n[1])});g.stroke();
  pts.forEach((p,ri)=>p.forEach((q,i)=>{const fl=ver>0?Math.max(0,1-Math.abs(seg(u,.56,.72)*3-(ri+i/p.length))*1.1):0;g.fillStyle=rgba(fl>.05?'#ffffff':lc,.5+.5*fl);const s=(4+8*fl)*U;g.fillRect(q[0]-s/2,q[1]-s/2,s,s)}));
  g.restore();
  // the sealed door
  const dw=R*.62,dh=R*1.45,x0=cx-dw/2,y0=cy-dh/2+R*.1;
  g.save();g.beginPath();g.moveTo(x0,y0+dh);g.lineTo(x0,y0+dw/2);g.arc(cx,y0+dw/2,dw/2,Math.PI,0);g.lineTo(x0+dw,y0+dh);g.closePath();
  const dg=g.createLinearGradient(0,y0,0,y0+dh);dg.addColorStop(0,'#05050f');dg.addColorStop(1,'#000');g.fillStyle=dg;g.fill();
  g.clip();g.fillStyle=pal.ac;for(let i=0;i<7;i++)for(let j=0;j<15;j++){const a=hash(i*13+j*7),tw=.5+.5*Math.sin(t*(1.2+a*2)+i*2+j);g.globalAlpha=.05+.17*tw*(1-ver*.5);g.fillRect(x0+dw*(.09+i*.13),y0+dh*(.05+j*.062),2.4*U,2.4*U)}g.globalAlpha=1;
  // scan: a bright line passes over the door, leaving it sealed and dark
  if(u>.25&&u<.66){const sy=lerp(y0,y0+dh,seg(u,.28,.62));const sg=g.createLinearGradient(0,sy-20*U,0,sy+20*U);sg.addColorStop(0,rgba(pal.pr,0));sg.addColorStop(.5,rgba('#ffffff',.9));sg.addColorStop(1,rgba(pal.pr,0));g.globalCompositeOperation='lighter';g.fillStyle=sg;g.fillRect(x0-6,sy-20*U,dw+12,40*U)}
  g.restore();
  g.save();g.globalCompositeOperation='lighter';g.beginPath();g.moveTo(x0,y0+dh);g.lineTo(x0,y0+dw/2);g.arc(cx,y0+dw/2,dw/2,Math.PI,0);g.lineTo(x0+dw,y0+dh);const fc=mix(pal.pr,'#5dd68a',ver);g.strokeStyle=rgba(fc,.18+.2*ver);g.lineWidth=14*U;g.stroke();g.strokeStyle=rgba(fc,.95);g.lineWidth=2.6*U;g.stroke();
  g.strokeStyle=rgba('#ffffff',.5*pr);g.lineWidth=1*U;g.beginPath();g.moveTo(cx,y0+dw*.1);g.lineTo(cx,y0+dh);g.stroke();   // the seam stays closed
  if(ver>0){const k=seg(u,.6,.95);g.strokeStyle=rgba('#5dd68a',(1-k)*.7);g.lineWidth=3*U;g.beginPath();g.ellipse(cx,cy+R*.1,R*(.5+1.5*k),R*(.5+1.5*k)*.9,0,0,7);g.stroke()}
  g.restore();
  glow(cx,cy+R*.1,R*1.6,R*1.6,fc,.16+.22*ver);
  // the guide, small and dark in the near left, looking at it
  if(ok(npc)){const ph2=L.h*(L.w<L.h?.34:.5),aw2=ph2*npc.naturalWidth/npc.naturalHeight;sprite(npc,L.w*(L.w<L.h?.2:.22),L.h*1.02,aw2,ph2,.03,.55,.8*Math.max(.35,pr),pal.ac)}
  dust(t,34,pal.ac,.4,16,2,0,0,L.w,L.h);ridge(t,-24,'#010206',.05,6,.95);bloom(.3);vignette(.88)}
 function shotGate(t){
  const u=seg(t,11.1,T_FLASH),px=L.w/2,py=L.h*.44,U=L.h/720,z=1+1.5*Math.pow(u,2.3)*(reduce?.15:1),R=L.h*.17;
  // backdrop: the engine's own origin backdrop (the very first world), darkened
  ad.pure('origin',t,(reduce?0:60)*u,1,L.w*.5,L.h*.8,L.w,L.h);
  g.save();g.translate(px,py);g.scale(z,z);g.translate(-px,-py);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  const src=ad.canvas;g.drawImage(src,0,0,src.width,src.height,0,0,L.w,L.h);
  g.fillStyle='rgba(2,3,10,.62)';g.fillRect(-L.w,-L.h,L.w*3,L.h*3);
  // ground plane + path to the portal
  const gy=L.h*.8;const pg=g.createLinearGradient(0,gy-8,0,L.h+60);pg.addColorStop(0,'#05060f');pg.addColorStop(1,'#000');g.fillStyle=pg;g.fillRect(-L.w,gy,L.w*3,L.h);
  g.globalCompositeOperation='lighter';
  const pl=g.createLinearGradient(0,py,0,L.h);pl.addColorStop(0,rgba(pal.pr,.4));pl.addColorStop(1,rgba(pal.pr,0));g.fillStyle=pl;g.beginPath();g.moveTo(px-R*.3,gy);g.lineTo(px+R*.3,gy);g.lineTo(px+R*2.2,L.h+80);g.lineTo(px-R*2.2,L.h+80);g.fill();
  const sh=g.createLinearGradient(0,0,0,gy);sh.addColorStop(0,rgba(pal.ac,0));sh.addColorStop(1,rgba(pal.ac,.3));g.fillStyle=sh;g.beginPath();g.moveTo(px-R*.7,0);g.lineTo(px+R*.7,0);g.lineTo(px+R*.5,gy);g.lineTo(px-R*.5,gy);g.fill();
  glow(px,gy,R*2.4,R*.5,pal.pr,.5);glow(px,py,R*2.6,R*2.6,pal.pr,.32+.1*Math.sin(t*3));
  // portal: the same dashed rings the worlds use, around a core of palette light
  const pr=R*(1+.04*Math.sin(t*4));const core=g.createRadialGradient(px,py,0,px,py,pr);core.addColorStop(0,'rgba(255,255,255,.95)');core.addColorStop(.35,rgba(pal.ac,.8));core.addColorStop(.8,rgba(pal.pr,.55));core.addColorStop(1,rgba(pal.pr,0));g.fillStyle=core;g.beginPath();g.arc(px,py,pr,0,7);g.fill();
  [[1.05,.9,pal.pr,32],[1.35,-.6,pal.ac,22],[1.7,.35,pal.pr,16]].forEach(r=>{g.save();g.translate(px,py);g.rotate(reduce?0:t*r[1]);g.setLineDash([r[3]*U,(r[3]*.6)*U]);g.strokeStyle=rgba(r[2],.8);g.lineWidth=3*U;g.beginPath();g.arc(0,0,R*r[0],0,7);g.stroke();g.restore()});
  g.restore();
  // the thread of light from the journey converges on the gate; embers are drawn inward
  g.save();g.globalCompositeOperation='lighter';g.strokeStyle=rgba(pal.pr,.5*(1-u));g.lineWidth=2*U;g.beginPath();g.moveTo(0,L.h*.62);g.quadraticCurveTo(L.w*.3,L.h*.74,px,py+R*.9*z);g.stroke();
  for(let i=0;i<46;i++){const k=hash(i*2.3),p=((t*(.35+u*1.4)*(.4+k)+k)%1),a=hash(i*5.7)*Math.PI*2,rr=lerp(L.h*(.35+.45*k),R*.2,p*p),x=px+Math.cos(a)*rr*1.5,y=py+Math.sin(a)*rr*.8;g.fillStyle=rgba(k>.5?pal.pr:'#ffffff',(1-p)*.7);const s=(1.6+k*2.6)*U;g.fillRect(x,y,s,s)}g.restore();
  // the explorer walks into the light
  if(ok(pfp)){const e=sm(seg(u,.02,.95)),ph=lerp(L.h*.3,L.h*.075,Math.pow(e,.8)),aw=ph*pfp.naturalWidth/pfp.naturalHeight,y=lerp(L.h*.93,py+R*.62,e),a=1-seg(u,.93,1),sx=px;g.globalAlpha=a;sprite(pfp,sx,y,aw,ph,lerp(.55,.12,e),.5,.9*(1-e),pal.pr);g.globalAlpha=1}
  ridge(t,0,'#010206',.045,9,.95);bloom(.34);vignette(.78*(1-u*.6))}

 function shot(t){for(const s of SHOTS)if(t>=s.a&&t<s.b)return s;return SHOTS[SHOTS.length-1]}
 function ensureWorld(sh){
  if(sh.k!=='world'){if(L.wId&&L.wId!=='-'){try{ad.stop()}catch(e){}L.wId='-';L.wReady=false;L.wFail=false}return}
  if(L.wId!==sh.id){L.wId=sh.id;L.wReady=false;L.wFail=false;const id=sh.id;try{ad.begin(id,okk=>{if(L.wId===id){L.wReady=!!okk;L.wFail=!okk}})}catch(e){L.wFail=true}}}

 // ---------------- main loop ----------------
 function frame(now){
  if(!live)return;L.raf=requestAnimationFrame(frame);
  if(L.t0==null)L.t0=now;if(document.hidden)return;
  L.t=Math.max(L.t,(now-L.t0-L.pause)/1000);const t=L.t;size();   // wall-clock, so a slow device drops frames instead of stretching the cinematic out of sync with its music
  try{
   g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#000';g.fillRect(0,0,L.w,L.h);
   const sh=shot(t);ensureWorld(sh);
   if(sh.k==='choice')shotChoice(t);else if(sh.k==='world')shotWorld(sh,t);else if(sh.k==='guide')shotGuide(t);else if(sh.k==='proof')shotProof(t);else shotGate(t);
   // cuts are dressed with a short flash; the world-start frames hide behind it
   SHOTS.forEach(s=>{if(s.a>0&&t>=s.a&&t<s.a+.2)dip(t,s.a,s.k==='guide'||s.k==='proof'?'#bcd0ff':'#e8eeff',.2)});
   if(t>11.55&&t<T_FLASH+.5){const k=sm(seg(t,12.15,T_FLASH));if(k>0){const r=g.createRadialGradient(L.w/2,L.h*.44,0,L.w/2,L.h*.44,Math.hypot(L.w,L.h)*(.15+.7*k));r.addColorStop(0,'rgba(255,255,255,'+k.toFixed(3)+')');r.addColorStop(.6,rgba(pal.pr,k));r.addColorStop(1,rgba(pal.pr,k*.9));g.fillStyle=r;g.fillRect(0,0,L.w,L.h)}}
   if(t>=T_FLASH){const k=seg(t,T_FLASH,T_END);const r=g.createRadialGradient(L.w/2,L.h*.44,0,L.w/2,L.h*.44,Math.hypot(L.w,L.h)*.75);r.addColorStop(0,'#fff');r.addColorStop(.55,rgba(pal.pr,1));r.addColorStop(1,rgba(mix(pal.pr,'#000',.6),1));g.fillStyle=r;g.fillRect(0,0,L.w,L.h);
    if(!reduce){const s=seg(t,T_FLASH,T_FLASH+.7);g.strokeStyle='rgba(255,255,255,'+(1-s).toFixed(3)+')';g.lineWidth=6*L.h/720;g.beginPath();g.arc(L.w/2,L.h*.44,L.h*(.1+1.1*s),0,7);g.stroke()}}
   if(t<T_FLASH-.2||t>T_FLASH+1)bars(t);
   if(t<.55){g.fillStyle='rgba(0,0,0,'+(1-sm(t/.55)).toFixed(3)+')';g.fillRect(0,0,L.w,L.h)}
   }catch(e){console.warn('ZKPRO frame',e);if(!L.handed)handoff(true)}
  if(!L.handed&&t>=T_HAND)handoff(false);
  if(t>20)finish()}   // hard stop: nothing can keep this alive
 function handoff(skipped){
  if(L.handed)return;L.handed=true;
  const go=()=>{try{ad.stop&&ad.stop()}catch(e){}try{ad.done()}catch(e){console.warn('ZKPRO done',e)}
   // the HUB is now underneath; fade the cinematic away over it
   root.style.transition='opacity '+(skipped?.55:.95)+'s ease-out';root.style.pointerEvents='none';requestAnimationFrame(()=>{root.style.opacity='0'});
   if(L.ac&&L.out){try{const n=L.ac.currentTime;L.out.gain.cancelScheduledValues(n);L.out.gain.setValueAtTime(L.out.gain.value,n);L.out.gain.linearRampToValueAtTime(0,n+(skipped?.35:1.3))}catch(e){}}
   later(finish,skipped?700:1150)};
  // let the engine's pending world-start timers drain before the HUB takes over (they are muted, but keep them from leaking into the HUB)
  const wait=ad.settle?ad.settle():0;wait>0?later(go,wait):go()}
 function finish(){
  if(!live||L.over)return;L.over=true;cancelAnimationFrame(L.raf);L.timers.forEach(clearTimeout);L.listeners.forEach(x=>x[0].removeEventListener(x[1],x[2],x[3]));
  if(L.ac){const ac=L.ac;try{L.out&&L.out.gain.cancelScheduledValues(ac.currentTime)}catch(e){}setTimeout(()=>{try{ac.close()}catch(e){}},50)}
  try{ad.stop&&ad.stop()}catch(e){}try{ad.restore&&ad.restore()}catch(e){}
  document.documentElement.classList.remove('zpro-on');root.remove();live=null;try{o.after&&o.after()}catch(e){}}
 L.raf=requestAnimationFrame(frame);
 return true}

return{play,cue,active:()=>!!live,TL:{T_FLASH,T_HAND,T_END}}
})();
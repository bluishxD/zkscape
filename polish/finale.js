/* ZKFIN - the ZKSCAPE ending: ~30 s, played once, when the Archive's final trial is passed and just before the Explorer Card screen.
   It touches no game state. worlds/10-archive.js hands it an adapter:
     adapter.canvas   the engine's world canvas (read only: it becomes a soft, out-of-focus backdrop so no HUD text ever shows)
     adapter.audio()  {on, level} from the player's saved audio preferences
     adapter.done()   called exactly once when the finale ends or is skipped (the existing Explorer Card screen)
   Art: the player's PFP and NPCs/zkSNARK_clean.png. Sound: synthesised here (no files, nothing remote). Works silently.

   0-4 reward | 4-9 the zkSNARK returns | 9-19 farewell | 19-23.6 the world says goodbye | 23.6-27.4 the Watcher | 28-30 "This may not be the end." */
window.ZKFIN=(function(){
'use strict';
const END=30.4,SKIP_AT=1.2;
const LINES=[   // [text, in, out]
 ['Well done, Explorer.',9.0,11.0],
 ['You found the paths, uncovered the proofs, and made it through.',11.5,14.6],
 ['You have completed ZKSCAPE.',15.1,17.3],
 ['May your next adventure begin soon.',17.6,19.6],
 ['Every proof reveals something\u2026',20.3,22.1],
 ['\u2026but not everything.',22.5,24.0]];
const clamp=(x,a,b)=>x<a?a:x>b?b:x,lerp=(a,b,t)=>a+(b-a)*t,sm=t=>(t=clamp(t,0,1))*t*(3-2*t),seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
function rgb(c){c=String(c||'#fff');let m=/^#([0-9a-f]{6})/i.exec(c);if(m){const n=parseInt(m[1],16);return[n>>16,n>>8&255,n&255]}m=/(\d+)\D+(\d+)\D+(\d+)/.exec(c);return m?[+m[1],+m[2],+m[3]]:[255,255,255]}
const rgba=(c,a)=>{const r=rgb(c);return'rgba('+r[0]+','+r[1]+','+r[2]+','+clamp(a,0,1).toFixed(3)+')'};
let live=null;

/* ---------------- music: warm, a little bittersweet; thins out; one wrong note at the end ---------------- */
function cue(ac,dest,T0){
 const sr=ac.sampleRate,wn=ac.createBuffer(1,sr*2,sr),wd=wn.getChannelData(0);for(let i=0;i<wd.length;i++)wd[i]=Math.random()*2-1;
 const ir=ac.createBuffer(2,Math.floor(sr*3.2),sr);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++){const k=i/d.length;d[i]=(Math.random()*2-1)*Math.pow(1-k,2.4)*(k<.01?k*100:1)}}
 const rv=ac.createConvolver();rv.buffer=ir;const rg=ac.createGain();rg.gain.value=.7;rv.connect(rg);rg.connect(dest);
 const dry=ac.createGain();dry.connect(dest);const bus=ac.createGain();bus.connect(dry);const snd=ac.createGain();snd.gain.value=.6;bus.connect(snd);snd.connect(rv);
 const at=t=>T0+t,G=(v,d)=>{const g=ac.createGain();g.gain.value=v;d&&g.connect(d);return g},F=(ty,f,q,d)=>{const x=ac.createBiquadFilter();x.type=ty;x.frequency.value=f;x.Q.value=q;d&&x.connect(d);return x};
 const env=(g,p)=>{g.gain.setValueAtTime(p[0][1],at(p[0][0]));for(let i=1;i<p.length;i++)g.gain.linearRampToValueAtTime(p[i][1],at(p[i][0]))};
 const osc=(ty,f,a,b,d,det)=>{const o=ac.createOscillator();o.type=ty;o.frequency.value=f;if(det)o.detune.value=det;o.connect(d);o.start(at(a));o.stop(at(b)+.05);return o};
 // the held breath before the zkSNARK speaks, and the near-silence before the Watcher
 bus.gain.setValueAtTime(1,at(8.2));bus.gain.linearRampToValueAtTime(.18,at(8.7));bus.gain.setValueAtTime(.18,at(9.0));bus.gain.linearRampToValueAtTime(1,at(10.2));
 bus.gain.setValueAtTime(1,at(23.0));bus.gain.linearRampToValueAtTime(.22,at(23.8));bus.gain.setValueAtTime(.22,at(26.6));bus.gain.linearRampToValueAtTime(.7,at(28.0));
 // drone
 {const g=G(0,bus);env(g,[[0,0],[3,.26],[9,.2],[16,.26],[19.5,.14],[23,.1],[29,.12],[30.4,0]]);osc('sine',73.42,0,30.5,g);const h=G(0,bus);env(h,[[0,0],[4,.06],[17,.1],[23,.03],[30.4,0]]);osc('sine',146.83,0,30.5,h)}
 function pad(fs,a,b,pk,c0,c1,atk,rel){const g=G(0,bus),f=F('lowpass',c0,.7,g);f.frequency.setValueAtTime(c0,at(a));f.frequency.exponentialRampToValueAtTime(c1,at(b));env(g,[[a,0],[a+atk,pk],[b,pk],[b+rel,0]]);fs.forEach(x=>{osc('sawtooth',x,a,b+rel,f,-6);osc('sawtooth',x,a,b+rel,f,6)})}
 pad([58.27,116.54,174.61,233.08,293.66],.6,8.8,.016,200,1100,2.6,.9);          // Bb: calm, awed
 pad([73.42,146.83,174.61,220,293.66],9.3,14.9,.014,420,1400,1.6,.9);           // Dm: a little bittersweet
 pad([87.31,174.61,220,261.63,329.63,440],14.9,19.3,.02,500,3600,1.2,1.4);      // Fmaj7 swell: "...completed ZKSCAPE."
 pad([73.42,110,146.83,220],19.6,23.4,.011,300,800,.8,1.2);                     // thin Dm
 function bell(f,t,v,d){const g=G(0,bus);g.gain.setValueAtTime(.0001,at(t));g.gain.exponentialRampToValueAtTime(v,at(t)+.006);g.gain.exponentialRampToValueAtTime(.0001,at(t)+d);
  const c=ac.createOscillator();c.frequency.value=f;const m=ac.createOscillator();m.frequency.value=f*3.51;const mg=ac.createGain();mg.gain.setValueAtTime(f*1.2,at(t));mg.gain.exponentialRampToValueAtTime(f*.04,at(t)+d*.6);m.connect(mg);mg.connect(c.frequency);c.connect(g);c.start(at(t));m.start(at(t));c.stop(at(t)+d+.05);m.stop(at(t)+d+.05)}
 // 0-4: the card rises
 [[.8,1174.7,.05],[1.6,1760,.045],[2.4,1396.9,.045],[3.2,2093,.04]].forEach(b=>bell(b[1],b[0],b[2],2.6));
 [[4.4,880,.05],[5.2,1174.7,.04],[6.1,1396.9,.04],[7.0,1760,.035]].forEach(b=>bell(b[1],b[0],b[2],2.8));   // the zkSNARK forms out of proofs
 // 9-19: a few notes under the voice
 [[9.0,587.3,.06],[9.6,880,.04],[11.5,698.5,.05],[12.4,880,.035],[13.4,1046.5,.035],[15.1,880,.06],[15.8,1046.5,.05],[16.5,1318.5,.05],[17.6,1174.7,.06],[18.4,880,.04]].forEach(b=>bell(b[1],b[0],b[2],2.6));
 // 19-24: the card's last glimmer; the zkSNARK dissolves
 bell(2637,20.0,.05,2.8);bell(1760,20.05,.04,2.8);[[22.7,1760],[23.1,1396.9],[23.5,1174.7]].forEach(b=>bell(b[1],b[0],.04,2.4));
 // the Watcher: a long low rise, then one note that is slightly wrong
 {const g=G(0,bus),f=F('lowpass',500,.8,g);env(g,[[24.2,0],[25.9,.07],[26.8,.03],[28.2,0]]);osc('sawtooth',58.27,24.2,28.4,f);osc('sawtooth',61.74,24.2,28.4,f)}
 {const g=G(0,bus);g.gain.setValueAtTime(.0001,at(25.9));g.gain.exponentialRampToValueAtTime(.14,at(25.93));g.gain.exponentialRampToValueAtTime(.0001,at(28.4));osc('sine',58.27,25.9,28.5,g);osc('sine',116.54,25.9,28.5,G(.5,g))}
 bell(2489,25.92,.035,3);bell(3322,25.97,.02,3);
 // "This may not be the end."
 bell(587.3,28.1,.05,2.4);
 return{end:END}}

/* ---------------- the scene ---------------- */
function play(o){
 if(live)return false;const host=o.host,ad=o.adapter;if(!host||!ad||!ad.canvas)return false;
 const reduce=!!o.reduce,pal=o.pal||{pr:'#f4b728',se:'#4ee3f0',ac:'#9a6bff'},GREEN='#5dd68a';
 const L=live={t:0,t0:null,pause:0,hid:0,skip:-1,handed:false,over:false,w:0,h:0,raf:0,ac:null,out:null,listeners:[],timers:[]};
 const root=document.createElement('div');root.id='zkfinale';root.setAttribute('aria-label','ZKSCAPE finale');root.tabIndex=-1;
 root.style.cssText='position:absolute;inset:0;z-index:210;background:#000;touch-action:none;opacity:1';
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;display:block!important;margin:0!important;border:0!important;border-radius:0!important;transform:none!important;box-shadow:none!important;background:none!important';root.appendChild(cv);
 const skip=document.createElement('button');skip.type='button';skip.className='btn g';skip.textContent='SKIP \u25B8';skip.setAttribute('aria-label','Skip the ending');
 skip.style.cssText='position:absolute;right:max(18px,3vw);bottom:max(18px,4vh);margin:0;padding:10px 18px;font-size:14px;letter-spacing:.08em;opacity:0;pointer-events:none;background:#02030acc;transition:opacity .6s;z-index:2;min-height:44px';
 root.appendChild(skip);host.appendChild(root);document.documentElement.classList.add('zpro-on');
 const g=cv.getContext('2d');const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
 const tA=mk(8,8),tB=mk(8,8),soft=mk(96,54),sx=soft.getContext('2d');
 const img=s=>{const i=new Image();i.src=s;return i},pfp=img(o.pfp),npc=img(o.npc),ok=i=>i&&i.complete&&i.naturalWidth>0;
 const on=(t,e,f,c)=>{t.addEventListener(e,f,c);L.listeners.push([t,e,f,c])},later=(f,ms)=>{const id=setTimeout(f,ms);L.timers.push(id)};
 try{const a=ad.audio?ad.audio():{on:true,level:.6};
  if(a&&a.on&&a.level>0){const AC=window.AudioContext||window.webkitAudioContext;if(AC){const ac=new AC();L.ac=ac;ac.resume&&ac.resume();const out=ac.createGain();out.gain.value=0;
   const cp=ac.createDynamicsCompressor();cp.threshold.value=-16;cp.ratio.value=4;out.connect(cp);cp.connect(ac.destination);const T0=ac.currentTime+.05,v=clamp(a.level*.8,0,1);
   out.gain.setValueAtTime(0,T0);out.gain.linearRampToValueAtTime(v,T0+1.2);cue(ac,out,T0);out.gain.setValueAtTime(v,T0+29.4);out.gain.linearRampToValueAtTime(0,T0+30.6);L.out=out}}}catch(e){try{L.ac&&L.ac.close()}catch(_){}L.ac=null}
 function size(){const w=Math.max(2,innerWidth|0),h=Math.max(2,innerHeight|0);if(w!==L.w||h!==L.h){cv.width=w;cv.height=h;L.w=w;L.h=h}}size();on(window,'resize',size);
 function doSkip(){if(L.skip<0&&!L.handed){L.skip=L.t;skip.style.opacity='0';skip.style.pointerEvents='none'}}
 on(skip,'click',e=>{e.stopPropagation();doSkip()});
 on(window,'keydown',e=>{if(!live)return;if(e.target===skip&&(e.key==='Enter'||e.key===' '))return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();doSkip();return}if(e.key==='Tab'||e.metaKey||e.ctrlKey||e.altKey||/^F\d+$/.test(e.key))return;e.preventDefault();e.stopPropagation()},true);
 on(window,'keyup',e=>{if(live&&e.target!==skip)e.stopPropagation()},true);
 on(document,'visibilitychange',()=>{if(document.hidden)L.hid=performance.now();else if(L.hid){L.pause+=performance.now()-L.hid;L.hid=0}if(L.ac)try{document.hidden?L.ac.suspend():L.ac.resume()}catch(e){}});
 try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur();root.focus({preventScroll:true})}catch(e){}

 // ---- drawing helpers ----
 const tmp=(c,w,h)=>{if(c.width!==w||c.height!==h){c.width=w;c.height=h}return c.getContext('2d')};
 function sprite(im,x,y,aw,ph,lit,band,rim,tint,flip,alpha){   // x centre, y bottom; lit 0..1; moving band of rim light
  const w=Math.max(2,Math.ceil(aw)),h=Math.max(2,Math.ceil(ph)),a=tmp(tA,w,h);a.globalCompositeOperation='source-over';a.clearRect(0,0,w,h);a.imageSmoothingEnabled=false;a.drawImage(im,0,0,w,h);
  a.globalCompositeOperation='source-atop';a.fillStyle='rgba(3,5,14,'+clamp(1-lit,0,1).toFixed(3)+')';a.fillRect(0,0,w,h);
  g.save();g.globalAlpha=alpha==null?1:alpha;g.translate(x,y-h);if(flip){g.translate(w/2,0);g.scale(-1,1);g.translate(-w/2,0)}else g.translate(-w/2,0);g.imageSmoothingEnabled=false;g.drawImage(tA,0,0);
  if(rim>0&&band!=null){const b=tmp(tB,w,h);b.globalCompositeOperation='source-over';b.clearRect(0,0,w,h);b.imageSmoothingEnabled=false;b.drawImage(im,0,0,w,h);if(tint){b.globalCompositeOperation='source-atop';b.fillStyle=rgba(tint,.3);b.fillRect(0,0,w,h)}
   b.globalCompositeOperation='destination-in';const gr=b.createLinearGradient(w*(band-.3),0,w*(band+.3),h*.5);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.5,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');b.fillStyle=gr;b.fillRect(0,0,w,h);g.globalAlpha=(alpha==null?1:alpha)*rim;g.drawImage(tB,0,0)}
  g.restore()}
 function glow(x,y,rx,ry,c,a){if(a<=0)return;g.save();g.translate(x,y);g.scale(1,ry/rx);const r=g.createRadialGradient(0,0,0,0,0,rx);r.addColorStop(0,rgba(c,a));r.addColorStop(.5,rgba(c,a*.3));r.addColorStop(1,rgba(c,0));g.fillStyle=r;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore()}
 function motes(t,n,c,al,seed,spd){const U=L.h/720;g.fillStyle=c;for(let i=0;i<n;i++){const a=hash(i*7.3+seed),b=hash(i*3.1+seed*2),k=hash(i*5.9+seed*3);const x=(((a*L.w+Math.sin(t*.5+i)*18*U)%L.w)+L.w)%L.w,y=(((b*L.h-(reduce?0:t*(spd||10)*(.3+k)*U))%L.h)+L.h)%L.h;g.globalAlpha=al*(.2+.8*Math.abs(Math.sin(t*(.5+k)+i)));const s=(1.3+k*2.4)*U;g.fillRect(x,y,s,s)}g.globalAlpha=1}
 function roundRect(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
 function card(cx,cy,ch,turn,gl,sweep){   // the Explorer Card, turning about its vertical axis
  const cw=ch*.64,sc=reduce?1:Math.cos(turn),w=cw*Math.abs(sc)+ch*.012,x=cx-w/2,y=cy-ch/2,U=ch/260;
  g.save();roundRect(x,y,w,ch,10*U);g.fillStyle='#070a18';g.fill();
  const gd=g.createLinearGradient(0,y,0,y+ch);gd.addColorStop(0,rgba(pal.pr,.2));gd.addColorStop(1,rgba(pal.ac,.12));g.fillStyle=gd;g.fill();
  g.lineWidth=3*U;g.strokeStyle=rgba(pal.pr,.55+.4*gl);g.stroke();
  g.clip();const pw=w*.74,ph=Math.min(pw,ch*.5)*(sc<0?1:1);
  if(w>cw*.25){g.globalAlpha=sc<0?.5:1;if(ok(pfp)){g.imageSmoothingEnabled=false;g.drawImage(pfp,cx-pw/2,y+ch*.1,pw,ph*(pfp.naturalHeight/pfp.naturalWidth>1?1:pfp.naturalHeight/pfp.naturalWidth))}
   g.globalAlpha=1;g.fillStyle=rgba(pal.pr,.9);g.fillRect(cx-w*.3,y+ch*.7,w*.6,2*U);g.fillRect(cx-w*.2,y+ch*.76,w*.4,2*U);g.fillStyle=rgba(GREEN,.9);g.fillRect(cx-w*.3,y+ch*.86,w*.12,4*U)}
  if(sweep>0&&sweep<1){const sg=g.createLinearGradient(x+w*(sweep*1.6-.5),y,x+w*(sweep*1.6-.1),y+ch);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.75)');sg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=sg;g.fillRect(x,y,w,ch)}
  g.restore();glow(cx,cy,ch*.9,ch*.9,pal.pr,.22*gl)}
 // the zkSNARK, assembled from proof-like cells; p: 0 = scattered, 1 = whole
 function zk(x,bot,ph,p,flip,lit,band,seed){
  const n=12,aw=ph*npc.naturalWidth/npc.naturalHeight,cw=npc.naturalWidth/n,ch=npc.naturalHeight/n,cs=aw/n,cH=ph/n;g.save();g.imageSmoothingEnabled=false;
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const d=hash(i*9.1+j*3.7+seed),q=sm((p-d*.55)/.45);if(q<=0)continue;
   const ang=hash(i*2.3+j*5.1+seed)*6.283,dist=(1-q)*ph*(.35+d*.6);const tx=x-aw/2+(flip?(n-1-i):i)*cs,ty=bot-ph+j*cH;
   g.globalAlpha=q*(lit<1?.95:1);g.save();if(flip){g.translate(tx+cs,ty+Math.sin(ang)*dist);g.scale(-1,1);g.drawImage(npc,i*cw,j*ch,cw,ch,Math.cos(ang)*-dist*-1,0,cs+.6,cH+.6)}
   else g.drawImage(npc,i*cw,j*ch,cw,ch,tx+Math.cos(ang)*dist,ty+Math.sin(ang)*dist-0,cs+.6,cH+.6);g.restore()}
  g.restore();
  if(lit<1){g.save();g.globalCompositeOperation='source-atop';g.restore()}}
 function text(s,x,y,size,font,col,a,sp){g.save();g.globalAlpha=a;g.font=font.replace('%',Math.round(size));g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;if(sp&&'letterSpacing' in g)g.letterSpacing=sp+'px';g.fillText(s,x,y);g.restore()}
 function wrap(s,max,font,size){g.font=font.replace('%',Math.round(size));const w=s.split(' '),ls=[];let c='';w.forEach(x=>{const t=c?c+' '+x:x;if(g.measureText(t).width>max&&c){ls.push(c);c=x}else c=t});ls.push(c);return ls}

 // ---- one frame ----
 function frame(now){
  if(!live)return;L.raf=requestAnimationFrame(frame);if(L.t0==null)L.t0=now;if(document.hidden)return;
  L.t=Math.max(L.t,(now-L.t0-L.pause)/1000);const t=L.t;size();const W=L.w,H=L.h,U=H/720,port=W<H;
  try{
   g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#02030a';g.fillRect(0,0,W,H);
   // out-of-focus memory of the Archive behind everything: the world canvas squeezed to 96x54 and stretched back (no HUD survives that)
   const src=ad.canvas;if(src&&src.width){sx.imageSmoothingEnabled=true;sx.drawImage(src,0,0,96,54);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
    const dim=lerp(.5,.82,sm(seg(t,0,2)))+(.12*sm(seg(t,19,23.6)));g.globalAlpha=clamp(1-dim,0,1)*(1-sm(seg(t,23,24.6)));g.drawImage(soft,0,0,W,H);g.globalAlpha=1}
   const camZ=reduce?1:1+.06*sm(seg(t,0,9))+.03*sm(seg(t,9,19));g.save();g.translate(W/2,H*.55);g.scale(camZ,camZ);g.translate(-W/2,-H*.55);
   const ground=H*.75,sz=port?Math.min(H*.3,W*.4):H*.4;
   // wave of light through the Archive (scene 1)
   if(t<4.8){const wv=seg(t,1.2,4.6);if(wv>0&&wv<1){g.save();g.globalCompositeOperation='lighter';g.strokeStyle=rgba(GREEN,.38*(1-wv));g.lineWidth=(6-4*wv)*U;g.beginPath();g.ellipse(W/2,ground,W*(.1+.95*wv),H*(.025+.09*wv),0,0,7);g.stroke();g.strokeStyle=rgba(pal.pr,.22*(1-wv));g.beginPath();g.ellipse(W/2,ground,W*(.06+.8*wv),H*(.02+.07*wv),0,0,7);g.stroke();g.restore()}}
   const warm=sm(seg(t,.6,3.6))*(1-.55*sm(seg(t,19,22))),dark=sm(seg(t,23,24.4));
   // floor
   glow(W*(port?.5:.5),ground,W*.5,H*.07,GREEN,.18*warm*(1-dark));
   const pX=port?lerp(.5,.3,sm(seg(t,4,7.2))):lerp(.5,.36,sm(seg(t,4,7.2))),zX=port?.72:.66;
   // PFP: the centre of the scene
   const iw=ok(pfp)?pfp.naturalWidth:1,ih=ok(pfp)?pfp.naturalHeight:1,pph=Math.min(sz,W*.5*ih/iw)*(.96+.04*sm(seg(t,0,4))),paw=pph*iw/ih,pbob=reduce?0:Math.sin(t*1.4)*2*U;
   const cardLit=(1-dark)*(.35+.65*warm);
   if(t<24.6&&ok(pfp)){const ptl=1-sm(seg(t,23,24.4));glow(pX*W,ground-pph*.5,pph*1.1,pph*.9,GREEN,.16*warm*ptl);sprite(pfp,pX*W,ground+pbob,paw,pph,.28+.62*warm,lerp(-.3,1.3,seg(t,.2,2.6)),.7*(1-seg(t,2.4,3)),pal.ac,false,ptl)}
   // Explorer Card: rises, turns, floats; one more glimmer at 20
   if(t<24.6){const rise=sm(seg(t,.8,3.6)),cx=lerp(pX*W,W*(port?.5:.5),sm(seg(t,4,7))),cy=lerp(ground-pph*.55,H*(port?.24:.3),rise)+(reduce?0:Math.sin(t*1.2)*5*U),chh=(port?H*.2:H*.34)*(.5+.5*rise);
    const gl=(.4+.6*rise)*(1-.6*sm(seg(t,19,22)))+(t>19.8&&t<21?Math.sin(seg(t,19.8,21)*Math.PI)*.8:0);
    if(rise>0)card(cx,cy,chh,(reduce?0:(t-.8)*1.1),clamp(gl,0,1.6),t>19.9&&t<21?seg(t,19.9,21):0)}
   // zkSNARK
   if(ok(npc)&&t>4.2&&t<24.6){const aph=sz*.98,formIn=sm(seg(t,4.4,8.2)),formOut=sm(seg(t,22.6,24.4));
    // what direction does it face: toward the player, then out into the dark, then back
    let flip=true;if(t>19.3&&t<20.5)flip=false;
    const turning=(t>19.15&&t<19.45)||(t>20.35&&t<20.65)?.45:1;
    const p=formIn*(1-formOut),zx=zX*W+(reduce?0:(1-formIn)*0);
    glow(zx,ground-aph*.55,aph*1.1,aph*1.1,'#cfe0ff',.32*p*(1-.6*sm(seg(t,19,22))));
    // proof-like particles converging / leaving
    g.save();g.globalCompositeOperation='lighter';for(let i=0;i<46;i++){const k=hash(i*1.9),a=k*6.283,dist=(1-p)*aph*(.5+hash(i*4.7)),x=zx+Math.cos(a)*dist,y=ground-aph*.5+Math.sin(a)*dist*.8;g.fillStyle=rgba(k>.5?'#cfe0ff':GREEN,.85*(p>0&&p<1?Math.sin(p*Math.PI)*.9+.1:.12));const s=(2+k*3)*U;g.fillRect(Math.round(x/s)*s,Math.round(y/s)*s,s,s)}g.restore();
    g.save();g.translate(zx,0);g.scale(turning,1);g.translate(-zx,0);zk(zx,ground+ (reduce?0:Math.sin(t*1.1+1)*3*U),aph,p,flip,1,0,3);g.restore()}
   g.restore();
   motes(t,38,'#cfe8d8',.35*(1-dark),4,9);
   // vignette
   const vg=g.createRadialGradient(W/2,H*.5,Math.min(W,H)*.25,W/2,H*.5,Math.hypot(W,H)*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,'+(.78+.12*dark).toFixed(2)+')');g.fillStyle=vg;g.fillRect(0,0,W,H);
   // subtitles (one line at a time)
   for(const l of LINES){const a=Math.min(sm(seg(t,l[1],l[1]+.45)),1-sm(seg(t,l[2]-.5,l[2])));if(a>0){const fs=Math.max(18,Math.min(32,H*.04)),font="500 %px 'Bricolage Grotesque',system-ui,sans-serif",ls=wrap(l[0],W*.78,font,fs),y0=H*.86-(ls.length-1)*fs*.6;
     text('zkSNARK',W/2,y0-fs*1.5,fs*.52,"600 %px ui-monospace,Menlo,Consolas,monospace",GREEN,a*.9,3);ls.forEach((s,i)=>text(s,W/2,y0+i*fs*1.25,fs,font,'#ece8df',a,0))}}
   // the Watcher
   if(t>24.6&&t<27.9)watcher(t,W,H,U);
   if(t>=28&&t<30.2){const a=Math.min(sm(seg(t,28.1,28.9)),1-sm(seg(t,29.4,30.1))),fs=Math.max(18,Math.min(30,H*.038));text('This may not be the end.',W/2,H*.5,fs,"italic 400 %px 'Bricolage Grotesque',system-ui,sans-serif",'#ece8df',a*.9,1)}
   // cinematic bars
   const bh=clamp((H-W/2.2)/2,H*.04,H*.09)*sm(t/1);g.fillStyle='#000';g.fillRect(0,0,W,bh);g.fillRect(0,H-bh,W,bh);
   // fades
   const fin=1-sm(t/1.4),fout=sm(seg(t,29.7,END-.2));if(fin>0||fout>0){g.fillStyle='rgba(0,0,0,'+Math.max(fin,fout).toFixed(3)+')';g.fillRect(0,0,W,H)}
   if(L.skip>=0){g.fillStyle='rgba(0,0,0,'+sm(seg(t,L.skip,L.skip+.5)).toFixed(3)+')';g.fillRect(0,0,W,H)}
  }catch(e){console.warn('ZKFIN frame',e);if(!L.handed)handoff(true)}
  if(t>SKIP_AT&&t<28&&L.skip<0&&!L.handed&&skip.style.opacity!=='1'){skip.style.opacity='1';skip.style.pointerEvents='auto'}
  else if(t>=28&&skip.style.opacity!=='0'){skip.style.opacity='0';skip.style.pointerEvents='none'}
  if(!L.handed&&((L.skip>=0&&t>=L.skip+.55)||t>=END))handoff(L.skip>=0);
  if(t>45)finish()}
 function watcher(t,W,H,U){
  const cx=W/2,cy=H*.34,R=H*.27,fa=sm(seg(t,24.7,25.6)),line=sm(seg(t,25.55,25.95)),open=sm(seg(t,25.9,26.35))*(1-sm(seg(t,26.95,27.3))),vis=1-sm(seg(t,27.3,27.9)),fl=.85+.15*Math.sin(t*9);
  g.save();g.globalCompositeOperation='lighter';const c=pal.ac,A=.42*vis;
  // a proof diagram that is also an eye: circle, triangle, nested rings, nodes
  g.lineWidth=1.4*U;g.setLineDash([10*U,8*U]);g.strokeStyle=rgba(c,A*fa*.8);g.beginPath();g.arc(cx,cy,R,0,7);g.stroke();g.setLineDash([]);
  g.strokeStyle=rgba(c,A*fa*.55);g.beginPath();for(let i=0;i<3;i++){const a=-Math.PI/2+i*2.0944+(reduce?0:t*.05);const x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;i?g.lineTo(x,y):g.moveTo(x,y)}g.closePath();g.stroke();
  for(let i=0;i<3;i++){const a=-Math.PI/2+i*2.0944+(reduce?0:t*.05);g.fillStyle=rgba(c,A*fa);g.fillRect(cx+Math.cos(a)*R-3*U,cy+Math.sin(a)*R-3*U,6*U,6*U)}
  g.beginPath();g.arc(cx,cy,R*.62,0,7);g.strokeStyle=rgba(c,A*fa*.35);g.stroke();
  // a single narrow line of light, then the lid parts
  const ew=R*.95,eh=R*.36*open+1.2*U;
  if(line>0){const lg=g.createLinearGradient(cx-ew,0,cx+ew,0);lg.addColorStop(0,rgba(c,0));lg.addColorStop(.5,rgba('#ffffff',.8*vis*line));lg.addColorStop(1,rgba(c,0));g.fillStyle=lg;g.fillRect(cx-ew*line,cy-1.2*U,ew*2*line,2.4*U)}
  if(open>0){g.beginPath();g.moveTo(cx-ew,cy);g.quadraticCurveTo(cx,cy-eh*2,cx+ew,cy);g.quadraticCurveTo(cx,cy+eh*2,cx-ew,cy);g.closePath();const eg=g.createRadialGradient(cx,cy,0,cx,cy,ew);eg.addColorStop(0,rgba('#ffffff',.5*vis*fl));eg.addColorStop(.35,rgba(c,.35*vis));eg.addColorStop(1,rgba(c,.05*vis));g.fillStyle=eg;g.fill();g.strokeStyle=rgba('#ffffff',.55*vis*fl);g.lineWidth=2*U;g.stroke();
   // iris rings and the pupil
   g.save();g.clip();[.34,.24].forEach((k,i)=>{g.beginPath();g.arc(cx,cy,R*k*Math.min(1,open*1.4),0,7);g.strokeStyle=rgba(c,.5*vis);g.lineWidth=(2-i*.6)*U;g.stroke()});
   g.globalCompositeOperation='source-over';const pr=R*.13*Math.min(1,open*1.4);g.fillStyle='rgba(2,3,10,'+(.92*vis).toFixed(2)+')';g.beginPath();g.arc(cx,cy,pr,0,7);g.fill();
   // the pupil keeps a tiny reflection of the explorer
   if(ok(pfp)&&open>.6){g.globalAlpha=.55*vis*open;g.imageSmoothingEnabled=false;const s=pr*1.3;g.save();g.beginPath();g.arc(cx,cy,pr*.96,0,7);g.clip();g.drawImage(pfp,cx-s/2,cy-s/2,s,s);g.restore();g.globalAlpha=1}
   g.restore()}
  g.restore()}
 function handoff(skipped){
  if(L.handed)return;L.handed=true;skip.style.opacity='0';skip.style.pointerEvents='none';
  if(L.ac&&L.out){try{const n=L.ac.currentTime;L.out.gain.cancelScheduledValues(n);L.out.gain.setValueAtTime(L.out.gain.value,n);L.out.gain.linearRampToValueAtTime(0,n+.4)}catch(e){}}
  try{ad.done()}catch(e){console.warn('ZKFIN done',e)}
  root.style.transition='opacity .6s ease-out';root.style.pointerEvents='none';requestAnimationFrame(()=>{root.style.opacity='0'});later(finish,760)}
 function finish(){
  if(!live||L.over)return;L.over=true;cancelAnimationFrame(L.raf);L.timers.forEach(clearTimeout);L.listeners.forEach(x=>x[0].removeEventListener(x[1],x[2],x[3]));
  if(L.ac){const ac=L.ac;try{L.out&&L.out.gain.cancelScheduledValues(ac.currentTime)}catch(e){}setTimeout(()=>{try{ac.close()}catch(e){}},50)}
  document.documentElement.classList.remove('zpro-on');root.remove();live=null;try{o.after&&o.after()}catch(e){}}
 L.raf=requestAnimationFrame(frame);return true}
return{play,cue,active:()=>!!live,END}
})();

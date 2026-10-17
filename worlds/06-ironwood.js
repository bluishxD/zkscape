/* ZKSCAPE world 06: IRONWOOD - an iron foundry swallowed by a forest, still faintly speaking. Core verb: ADAPT.
   Two signals that cannot hear each other: an amber PULSE from the old foundry and a cyan TIDE from the forest. The join no longer fits.
   The player never replaces anything: they change WHERE the old line touches the wood (the boom), HOW HARD it beats (the governor), and walk through what gets COUNTED (the turnstile).
   Same engine hooks and movement model as Origin / Proof / Keys / Orchard (bg, avatar, startWorld, stopWorld, own physics, own touch controls). All state is local to V.
   The world is a metaphor: pulses are signal and traffic, never money. Nothing in it creates or destroys value. No other world is touched. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'ironwood',n:'IRONWOOD',title:'THE IRONWOOD',sub:'It still works. So why did it stop?',desc:'A dead-looking foundry sends one pulse into the forest every twelve seconds. Nothing ever answers. Why?',q:'A system can change and still be itself.',
 sort:[['',0]], /* engine flag only (as in the other adventure worlds): no default hotspots, this world runs its own loop */
 deep:'NU6.3 added the Ironwood shielded pool. It is part of the broader Orchard protocol design, but a distinct pool. The original Orchard pool still exists and is restricted: value leaves it through the turnstile, a counted, one-way crossing, into Ironwood.'});
A.ironwood='Ironwood Core';
TH.ironwood={sky:['#07090c','#14201c'],moon:[.7,.22,.07,'#ffb347'],mt:'#0a100d',fog:'#5fe3d6',amb:'mote'};
GIANT.ironwood=function(w,h,gy,t,th,p,c,id,o,f){const lv=V?V.lv:0,cx=w*.78+o*1.4,cy=gy-h*.42;ring(cx,cy,h*.5,.04,f,t);ring(cx,cy,h*.36,-.06,p.pr,t);
 g2.fillStyle='#050807';g2.fillRect(cx-h*.2,cy,h*.4,gy-cy);g2.fillRect(cx-h*.03,cy-h*.35,h*.06,h*.4);g2.beginPath();g2.arc(cx,cy-h*.3,h*.2,0,7);g2.fill();g2.globalAlpha=.08+.15*lv;g2.strokeStyle='#5fe3d6';g2.lineWidth=3;g2.beginPath();g2.arc(cx,cy,h*.3,3.3,6.1);g2.stroke();g2.globalAlpha=1};
LM.ironwood=function(x,y,s,c,t,a,B){B();hg.arc(0,0,s*.4,0,7);hg.stroke();B();hg.moveTo(0,s*.4);hg.lineTo(0,-s*.6);hg.moveTo(-s*.3,-s*.2);hg.lineTo(0,-s*.45);hg.lineTo(s*.3,-s*.2);hg.stroke()};
const OLD=function(w,h,gy,t,p){const cx=w*.5;rc(cx-60,gy-h*.3,120,h*.3,'#2a2f36');rc(cx-8,gy-h*.5,16,h*.2,'#1f3d2b');ring(cx,gy-h*.4,h*.2,.1,p.pr,t)};

// ======================= layout (x in world units, y = height above the ground surface) =======================
const LW=8300,HW=30,PH=112,SPD=300,JMP=830,GRAV=2500;
const BASE={g:0,u:-250,c:400},COLX=3340,CAB=170,PYL=[700,960,1220,1480,1740,2000,2260,2520,2780,3040],LIFTX=1400,WALLX=1500,SEAMX=3400,RAV=[3500,4500],BOOM=4650,CORD=4750,GOVX=[4880,5380],AW_WIN=16,THIN=5300,TURN=6300,GROVE=[6400,7500],DAIS=7850,DOOR=8120,FOUND=250,SP=520;
const CPL=[[2900,260,400],[3200,200,400],[3440,200,400],[3680,220,400],[3940,200,400],[4180,200,400],[4420,100,400],[2960,70,480],[3060,70,560],[2950,70,640],[3070,150,700],[3760,80,460],[3880,80,520],[3990,430,520]];
const GOBJ=[{k:'lift',x:LIFTX,x2:WALLX,top:230},{k:'bridge',x:7050,x2:7350},{k:'lift',x:6700,x2:6800,top:240}];            // powered only while the pulse is inside them
const Z=[0,900,2700,4500,5300,6300,7500],ZN=['THE FOUNDRY YARD','THE SIGNAL WALK','THE SEAM','THE FAR BANK','THE THIN ROOTS','THE GROVE','THE HEART'];
const OUT=['SINK','BOUNCE','STARVE','TAKE','LOOP'],CN=['THE OLD SCAR','THE BURL','THE HOLLOW','THE WEEPING STUMP','THE IRON BAND'],CPT=[[SEAMX-70,70],[SEAMX+70,150],[SEAMX+20,250],[SEAMX-100,30],[SEAMX+60,340]];
const C={ch:'#0d0f12',ir:'#2a2f36',ru:'#8a4b2a',br:'#b9803a',fo:'#1f3d2b',mo:'#2d5a3d',am:'#ffb347',cy:'#5fe3d6',bo:'#e9e2d0'};
const EDU='NU6.3 added the Ironwood shielded pool. It is part of the broader Orchard protocol design, but a distinct pool. The original Orchard pool still exists, restricted: value leaves it through the turnstile, a counted, one-way crossing, into Ironwood. The turnstile caps what can leave at what legitimately went in. NU6.2 had already fixed the flawed Orchard circuit; NU6.3 activated on July 28, 2026.';
let V=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,e:0,eh:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-V.cx)*U,Y=y=>GY-(y-V.cy)*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),cc=(x,y,r,c,a)=>ci(X(x),Y(y),r*U,c,a),isI=()=>run&&cur&&cur.id==='ironwood'&&V&&V.on;
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixc=(a,b,t)=>{t=Math.max(0,Math.min(1,t));const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace',T2=(s,x,y,c,n)=>tx_(s,X(x),Y(y),c,MONO(n)),cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// ---- Hob's sprite (same cleaned-sprite treatment as the other NPCs; a plain silhouette until the file exists)
let HB=null;{const im=new Image();im.onload=()=>{try{const c=typeof removeBg==='function'?removeBg(im):im;c.complete=true;if(!c.width)c.width=im.width;if(!c.height)c.height=im.height;HB=c}catch(e){HB=im}};im.src='NPCs/mechanist_clean.png'}
// ---- tiny local synth for the hum, ticks, tide, click and chords (respects the shared mute if it exposes one); nothing here can throw
const snd=(()=>{let c=null,m=null;const init=()=>{if(c)return;try{c=new(window.AudioContext||window.webkitAudioContext)();m=c.createGain();m.gain.value=.5;m.connect(c.destination)}catch(e){c=null}};
 const tone=(f,d,ty,v,sl,dl)=>{if(!c||(window.AM&&AM.PF&&(AM.PF.so===0||AM.PF.m===0)))return;try{const t=c.currentTime+(dl||0),o=c.createOscillator(),g=c.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,sl),t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.05,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(m);o.start(t);o.stop(t+d+.05);o.onended=()=>g.disconnect()}catch(e){}};
 return {init,tone,hum:()=>tone(70,3,'sine',.12,120),tick:i=>tone(600+i*70,.05,'square',.03),tide:()=>{tone(170,3,'sine',.06,250);tone(172,3,'sine',.04,255,.1)},click:()=>tone(200,.06,'square',.1,90),chord:()=>{tone(440,2,'sine',.07);tone(554,2,'sine',.06,0,.05)},
  sink:()=>tone(320,.9,'sine',.05,90),cough:()=>tone(130,.25,'sawtooth',.06,55),drip:()=>tone(900,.1,'sine',.04,500),ring:()=>tone(720,.7,'sine',.04),snap:()=>{tone(1200,.1,'square',.05,200);for(let i=0;i<4;i++)tone(500+i*90,.05,'square',.03,0,.08+i*.06)},bell:()=>{tone(98,5,'sine',.22);tone(196,4,'sine',.08)},beat:()=>tone(60,.25,'sine',.2,40)}})();

function vInit(){const done=!!S.done.ironwood;V={on:1,px:100,py:0,vx:0,vy:0,gr:1,face:1,cx:0,cy:0,lay:'g',stt:'play',dlg:null,msg:'',mt:0,bad:0,vp:[],ft:[],last:performance.now(),step:0,near:null,done:0,fade:null,rt:0,room:-1,
 t:0,pl:[],nat:6,cool:0,tt:11,c:0,cf:0,swing:0,gov:0,latch:0,seenDie:0,tideHeard:0,mirror:0,mirT:0,take:0,scorch:0,smooth:0,passed:0,count:0,pop:0,spin:0,ans:-1,door:0,heart:0,hbeat:-99,
 idle:0,graft:0,deadb:0,master:0,streak:0,bt:0,lv:0,lvT:0,safeX:100,safeY:0,tr:0,talked:0,dee:0,dark:0,lamps:0,tendril:0,flick:0,rideKey:0,rideTop:0};K.l=K.r=K.j=K.jp=K.e=K.eh=0;
 if(done){Object.assign(V,{take:1,smooth:1,latch:1,gov:1,passed:1,count:2,mirror:1,seenDie:1,ans:99,door:1,lv:4,lvT:4,px:7440,tendril:1,lamps:1,heart:1});V.cx=7100}ctl(1)}
if(!window.__zkIW){window.__zkIW=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isI())return;e.preventDefault();snd.init();if(k==='e'){if(!e.repeat)K.e=1;K.eh=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k==='e')K.eh=0;else if(k)K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=K.eh=0});
 addEventListener('pointerdown',e=>{if(isI()&&e.target===g2.canvas){snd.init();K.e=1}})}
function ctl(on){let c=$z('ictl');if(c&&c.dataset.own!=='ironwood'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='ictl';c.dataset.own='ironwood';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();snd.init();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;K.eh=v;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('\u270B','e','interact (hold on the boom)'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
const spark=(x,y,c,n=8)=>{if(reduce)n=Math.ceil(n/2);for(let i=0;i<n;i++){const a=Math.random()*6.28,s=60+Math.random()*180;V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c,s:5,g:140})}};
const say=(x,s,y)=>V.ft.push({x,y:y==null?240+V.cy:y,s,l:2.6}),note=s=>{V.msg=s;V.mt=Math.max(5,s.length/15)},bad=(x,s)=>{V.bad=.35;AM.sfx('incorrect');say(x,s||'NO')},talk=(L,who,img,acc)=>{V.dlg={L,i:0,c:0,who:who||'HOB',img:img||null,acc:acc||null};AM.sfx('interaction')};
function advance(){const d=V.dlg;if(!d)return;if(d.c<d.L[d.i].length){d.c=999;return}AM.sfx('interaction');if(++d.i>=d.L.length)V.dlg=null;else d.c=0}
function tele(lay,px,py){if(V.fade)return;V.fade={t:0,lay,px,py:py||0};AM.sfx('rise')}

// ======================= the two signals =======================
const headX=p=>p.bounce?Math.max(FOUND,COLX-(p.a-(COLX-FOUND)/SP)*SP):Math.min(p.dead,FOUND+SP*p.a);
const powered=x=>V.pl.some(p=>{const ta=(x-FOUND)/SP;return p.a>=ta&&p.a<=ta+8&&x<=p.dead&&!p.bounce});
const tideI=()=>{const ph=V.tt%17;return ph<6?Math.sin(ph/6*Math.PI):0};
function callPulse(){V.pl.push({a:0,dead:1e9,bounce:0,out:null,hum:0,tk:0,cross:{}});}
function pulseTick(dt){V.cool=Math.max(0,V.cool-dt);V.nat-=dt;if(V.nat<=0){V.nat=12;callPulse()}
 const ti=tideI();V.tt+=dt;if(tideI()>.5&&ti<=.5){snd.tide();if(Math.abs(V.px-SEAMX)<1100||V.lay==='u')V.tideHeard=1}
 V.pl.forEach(p=>{p.a+=dt;const x=headX(p),ta=(V.px-FOUND)/SP;
  if(!p.hum&&p.a>=ta-3&&p.a<ta&&V.px<p.dead&&V.lay==='g'){p.hum=1;snd.hum()}
  while(p.tk<PYL.length&&FOUND+SP*p.a>=PYL[p.tk]&&!p.bounce){if(Math.abs(V.px-PYL[p.tk])<1300)snd.tick(p.tk);p.tk++}
  if(!p.cross.col&&FOUND+SP*p.a>=COLX){p.cross.col=1;const o=OUT[V.c];p.out=o;if(Math.abs(V.px-COLX)<1100)V.seenDie=1;V.fx={t:0,o,x:COLX};
   if(o==='SINK'){p.dead=COLX;snd.sink()}else if(o==='BOUNCE'){p.bounce=1;snd.cough();AM.sfx('impact')}else if(o==='STARVE'){p.dead=COLX;snd.drip()}else if(o==='LOOP'){p.bounce=1;snd.ring()}
   else{if(!V.take){V.take=1;V.lvT=Math.max(V.lvT,1)}snd.chord();AM.sfx('correct');spark(COLX,60,C.cy,16)}}
  if(p.out==='TAKE'&&!p.cross.thin&&FOUND+SP*p.a>=THIN){p.cross.thin=1;const s=V.latch?1:V.gov;if(s>=.95){if(!V.smooth){V.smooth=1;V.latch=1;V.lvT=Math.max(V.lvT,2);AM.sfx('correct')}}else{p.dead=THIN+500;V.scorch=1;V.pop=1.4;V.dark=1.2;snd.snap();V.scorchI=1-s}}
  if(p.out==='TAKE'&&p.cross.thin&&p.dead>1e8&&!p.cross.turn&&FOUND+SP*p.a>=TURN){p.cross.turn=1;V.count++;V.tr=1;snd.click();AM.sfx('correct')}
  if(p.out==='TAKE'&&p.cross.turn&&!p.cross.heart&&FOUND+SP*p.a>=DAIS){p.cross.heart=1;V.hbeat=V.t;V.heart=1;snd.beat()}});
 // A pulse must survive all the way to the Heart (x=DAIS) or V.heart never fires and the ending is unreachable.
 // 14s stopped the head at x=7530; the dais is at 7850. Derived from the geometry now so it cannot drift again.
 V.pl=V.pl.filter(p=>p.a<(p.bounce?12:(DAIS-FOUND)/SP+3))}
function lvl(dt){V.lv+=(V.lvT-V.lv)*(1-Math.exp(-dt*.8))}

// ======================= 3DEEZ: he does the sums on the fence, badly and on purpose, and he likes you for it =======================
// He never tells you what is wrong with the line. He only ever points at the shape of the question, because a
// mystery that has been handed to you is worth more than a mystery that has been explained to you. His friend Hob
// is further up the walk and has been wrong out loud for thirty years, which is 3Deez's favourite thing about him.
// NPCA is zkSNARK's own extract()[0] - the house NPC accent, shared by every character's glow,
// drop shadow and name tag so they all read the same way.
const NPCA='#ffffff',DEEX=620;
let DZ=null,DZ_PAL=['#8ab4ff','#d6e4ff','#ffd35a'];{const im=new Image();im.onload=()=>{try{const c=typeof removeBg==='function'?removeBg(im):im;c.complete=true;if(!c.width)c.width=im.width;if(!c.height)c.height=im.height;DZ=c;try{const p=extract(c)[0];if(Array.isArray(p)&&p[0]&&/^#[0-9a-f]{6}$/i.test(p[0]))DZ_PAL=p}catch(e){}}catch(e){DZ=im}};im.src='NPCs/3Deez_clean.png'}
function deeLines(){
 if(V.ans>=0)return['You are going to answer it. You are going to answer it ON THE BEAT. I am going to remember this for the rest of my life.','Go and tell Hob. Tell him he was right about the machine - and be kind about it. He has had a longer morning than you have.'];
 if(V.take)return['You took it. You actually took a piece of the line off and carried it away.','I have been waiting my whole life for somebody to be rude to the machine.'];
 if(V.tideHeard)return['So you heard it too. Slower. It does not tick, it breathes.','Hob has decided that means it is broken. He has been wrong in exactly the same way for thirty years, and it is the best thing I have ever had to watch.'];
 if(!V.dee){V.dee=1;return['Hiii. Do not mind me, I am doing sums on your fence.','Forty-one seconds since the last one. That is nine short. I have been counting them wrong on purpose, to see whether it notices. It never notices. That is the whole trouble with it.','Amber goes out. Nothing amber comes back. Everybody in this yard has quietly decided that means the machine is broken.','Dropping the act for one second, because this part is real. Everything in this place is about a Zcash upgrade called Ironwood.','In 2026 a flaw was found in the proof circuit of the Orchard shielded pool. The NU6.2 upgrade fixed that circuit.','Then NU6.3, named Ironwood, activated on July 28, 2026. It opened a new shielded pool and restricted the old Orchard pool to exits only.','Further up the walk there is my friend Hob. He will tell you it works. He says it every single morning and he has never once lied, which is the trouble with him.']}
 return['Still counting. Still wrong by nine. Do not tell me - I want to see whether you get there first.','You are going to want to fix it. Everybody does. Try not to tell me which part you think is broken.'];}
function dee(t,p){const x=DEEX,sx=X(x);if(V.lay!=='g'||sx<-120||sx>W_+120)return;const h=PH*U*.95,w=h*(DZ&&DZ.width?DZ.width:520)/(DZ&&DZ.height?DZ.height:520),hop=Math.abs(Math.sin(t*2.6))*5*U;
 if(DZ&&DZ.width){g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(0)+3,w*.34,5*U,0,0,7);g2.fill();
  const cy=Y(0)+h*.55,g=g2.createRadialGradient(sx,cy,0,sx,cy,h*1.2);g.addColorStop(0,NPCA+'33');g.addColorStop(1,NPCA+'00');g2.fillStyle=g;g2.fillRect(sx-h*1.3,cy-h*1.3,h*2.6,h*2.6);
  g2.save();g2.shadowColor=NPCA;g2.shadowBlur=16;g2.imageSmoothingEnabled=false;g2.translate(sx,Y(0)-hop);g2.scale(V.px<x?-1:1,1);g2.drawImage(DZ,-w/2,-h,w,h);g2.restore()}
 else{rr(x-16,100,32,60,'#33406a');rr(x-10,128,20,14,'#161c2e');rr(x-20,40,9,40,'#2a3358');rr(x+11,40,9,40,'#2a3358')}
 T2('3DEEZ',x,h/U+26,NPCA,11)}

// ======================= interactables =======================
const hobPost=()=>V.ans>=20?{x:7440,s:6}:V.take?{x:6240,s:V.smooth?5:4}:V.mirror?{x:4560,s:3}:V.seenDie?{x:3230,s:2}:{x:2250,s:1};
function hobLines(){const s=hobPost().s;
 if(s===1)return V.talked?['Shh. ...There. Twelve seconds. Never late.']:['Shh. ...There. Twelve seconds. Never late.','Thirty years I\'ve sent that out. Not once has anything come back.',"Mind the third pylon. It's hanging on out of habit."];
 if(s===2)return['Roots again. They get into my collar every season. I cut them back. They come back.',"It's not the machine. I check the machine every morning.",'Don\'t go below. Nothing down there but damp and roots.'];
 if(s===3)return['You went down there. ...What colour was the light?','Cyan. Mine\'s amber. I never thought of them as different.',"Those stumps. I cut those. Every spring.",'Two lines that cannot hear each other. In Zcash that is two shielded pools, Orchard and Ironwood, each with its own tree of notes and its own list of nullifiers.',"I'm not touching the boom. If it's my hand that's been wrong, it should be yours that's right."].concat(V.graft?["That's A.V.'s coat. ...They told me not to cut what reaches back. I thought it was a figure of speech."]:[]);
 if(s===4)return['It took it.',"Too hard, though. It's always been a hard beat. Old machine doesn't know it's talking to children.","The governor's still there. We took the belt off. Saved effort.",'Nobody flips a switch to change a network. A change starts as a ZIP, a Zcash Improvement Proposal. Node software such as Zebra implements it, and the network upgrades at an agreed block height.'];
 if(s===5)return['A gate that counts. Whatever crosses gets written down. Nothing from nowhere. Nothing lost.','That is the turnstile. Value can leave the old Orchard pool, but only into Ironwood, one way, and never more than went in. New funds cannot enter Orchard any more.'];
 return['Thirty years I cut back the answer.',"Old machine's still the old machine. It just has someone to talk to now.","I'll keep the saw. Firewood.",'Ironwood runs on a revised circuit. Before launch it had an independent security review, and a machine-checked formal verification that it cannot hide undetectable counterfeiting, under stated cryptographic assumptions.','That verification covers the supply-integrity property only. It does not cover Ironwood\'s privacy guarantees.']}
function IAS(){const a=[],P=(x,l,f)=>a.push({x,l,f});const L=V.lay;
 if(L==='g'){
  P(1000,'LISTEN AT THE CABLE',()=>{snd.tone(80,1.2,'sine',.1);note('A low hum in the brass rod, then a tick for every pylon. The line is old and well kept: bronze over iron over older iron.')});
  P(2120,'READ THE CHALK',()=>note('Hundreds of rows: OUT. RETURN: NONE. Fresh at the bottom, sun-bleached at the top.'));
  P(2190,'EXAMINE THE TREE RING',()=>note('A cross-section. An iron band at the third ring, thirty-odd rings outside it. The tree was a sapling when the line was laid.'));
  P(2260,'LOOK AT THE GAUGE',()=>note('A gauge with its needle stuck, still pointing at the last reading. Two cups on the shelf. One worn coat on a peg, initialled A.V.'));
  // 3Deez is out in the yard between the Bell Engine and the first pylon - well ahead of Hob, so you meet him first
  P(DEEX,V.dee?'TALK TO 3DEEZ AGAIN':'TALK TO 3DEEZ',()=>{talk(deeLines(),'3DEEZ',DZ,NPCA);V.dee=1});
  const hp=hobPost();P(hp.x,'TALK TO HOB',()=>{talk(hobLines(),'HOB',HB,C.br);V.talked=1});
  P(3120,'OPEN THE HATCH',()=>tele('u',3010));P(3250,'CLIMB THE LADDER',()=>tele('c',2930,400));
  P(3330,'LISTEN AT THE TRUNK',()=>{snd.tide();V.tideHeard=1;note('Inside the wood, a slow, different rhythm. Not a tick. A breath.')});
  P(3380,'EXAMINE THE STUMP',()=>note('A cut root, saw marks across it, leaking faint cyan. A fresh shoot grows up beside it.'));
  if(V.px>4400&&V.px<4600)P(4600,'THE BOOM STATION',()=>note('Hold [E] and move left or right to swing the collar. The bell cord is further along.'));
  P(BOOM,'HOLD [E] AND MOVE TO SWING THE BOOM',()=>{});
  P(CORD,'PULL THE BELL CORD',()=>{if(V.cool>0){say(CORD,'IT IS STILL SWINGING');return}V.cool=6;callPulse();V.nat=12;AM.sfx('impact');spark(CORD,140,C.am,8);V.idle=0});
  P(GOVX[0]-30,'EXAMINE THE GOVERNOR',()=>note('An old flywheel in a cage, belt removed long ago because it "wasted effort". Run against the treadway to spin it up.'));
  if(V.passed)P(6420,'CLIMB BACK OVER',()=>tele('g',6240));
  P(DAIS,V.ans>=0?'THE HEART IS BEATING':V.heart?'ANSWER THE HEART':'LISTEN — THE HEART IS QUIET',()=>answer())}
 if(L==='u'){P(2990,'CLIMB UP',()=>tele('g',3120));P(4480,'CLIMB UP',()=>tele('g',4540));P(3330,'EXAMINE THE STUMPS',()=>note('Cut roots, weeping cyan. Saw marks on every one. Fresh shoots beside them, reaching toward the line.'));
  P(3800,'LOOK THROUGH THE PORTHOLE',()=>note('A sealed cistern. Amber beads sit unmoving. A plate: INTAKE CLOSED. Nothing is wrong with it. A closed door is not a broken one.'));
  P(4100,'LISTEN AT THE ROOT',()=>{snd.tide();V.tideHeard=1;note('A slow swell, twice as long as the pulse. It never ticks.')})}
 if(L==='c'){P(2930,'CLIMB DOWN',()=>tele('g',3250));P(4440,'CLIMB DOWN',()=>tele('g',4540));
  P(3560,'LOOK INTO THE HOLLOW',()=>note('A dark cavity in the trunk. Dead inside. Nothing grows here.'));P(3640,'EXAMINE THE IRON BAND',()=>note('An old bronze reinforcement around the wood: a past attempt. A pulse would run around it and come home.'));
  P(3140,'EXAMINE THE ALCOVE',()=>{if(!V.graft){V.graft=1;spark(3140,740,C.cy,26);AM.sfx('collectible')}note('An old iron ring let out around a living branch that has grown through it in bloom. A faded coat on a hook. In pencil: "It held six springs. The ring must be let out as the wood thickens. Don\'t cut what reaches back. \u2014 A.V."')});
  P(4300,'READ THE BENCH LOG',()=>{V.deadb=1;note('"Ring 3 casting: hairline fault along the weld. Noted. Sealed. Held."  "Decision at the bench: do not recast the foundry. Do not tear down the line. Close the old intake. Grow a second chamber from the same pattern. Join them with one counted gate."')});
  P(4100,'EXAMINE THE IRON ROOT',()=>note('A 400-unit iron pipe driven into bare soil, stencilled NEW NETWORK \u2014 IRON. Roots curve away from it. A tag reads: NEVER LIT.'));
  if(V.px>7400)P(DAIS,'ANSWER THE HEART',()=>answer())}
 return a}
function act(){let b=null,d=130;IAS().forEach(o=>{const q=Math.abs(V.px-o.x);if(q<d&&o.l.indexOf('HOLD [E]')<0){d=q;b=o}});if(b){V.idle=0;b.f()}}
function answer(){if(V.ans>=0){if(V.ans>=20){const ph=V.bt;if(ph<.3||ph>11.7){V.streak++;spark(DAIS,200,C.am,6);snd.chord();if(V.streak>=3&&!V.master){V.master=1;snd.bell();AM.sfx('world-complete');say(DAIS,'IN TIME',300)}}else V.streak=0}return}
 // Answering needs the Heart to have beaten within AW_WIN seconds. It used to be 9, but pulses only reach the dais
// every 12s, so a 9s window left the ending permanently unreachable: V.door never rises, and hi stays pinned at
// DOOR-60, walling you 60 units short of the door with no way back. 16 clears a full pulse cycle plus margin, so
// once the Heart has beaten there is always a live window - and the flicker now says what went wrong.
if(!V.heart){V.flick=1;snd.tone(520,.4,'sine',.05);say(DAIS,'A SINGLE CYAN FLICKER... NOTHING IS ANSWERING.',260);return}
if(V.t-V.hbeat>AW_WIN){V.flick=1;snd.tone(520,.4,'sine',.05);say(DAIS,'A SINGLE CYAN FLICKER. THE BEAT HAS FADED — WAIT FOR THE NEXT PULSE.',260);return}
 V.ans=0;V.stt='cine';AM.sfx('core-activate')}

// ======================= physics (same movement model as the other worlds) =======================
const platsFor=()=>{const L=V.lay,a=[];if(L==='c')CPL.forEach(q=>a.push(q));if(L==='g'){a.push([WALLX,60,230]);GOBJ.forEach(o=>{if(o.k==='lift'){const f=powered(o.x2)||V.ans>=0?1:0;o.h=(o.h||0)+((f*o.top)-(o.h||0))*.08;a.push([o.x,o.x2-o.x,o.h]);if(o.x===6700)a.push([o.x2,70,o.top])}else{const f=powered(o.x)||V.ans>=0?1:0;o.e=(o.e||0)+(f-(o.e||0))*.06;if(o.e>.6)a.push([o.x,o.x2-o.x,0])}})}return a};
const floorAt=x=>V.lay==='u'?-250:V.lay==='c'?-900:(x>RAV[0]&&x<RAV[1]?-700:(x>7050&&x<7350&&!(GOBJ[1].e>.6))?-700:0);
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;V.t+=dt;if(tx!==V.ltx&&tx>w*.99){back();return}
 if(V.stt==='play'&&!V.dlg&&!V.fade&&V.lay==='g'){if(!V.dee&&Math.abs(V.px-DEEX)<190){talk(deeLines(),'3DEEZ',DZ,NPCA);V.dee=1}else{const hp_=hobPost();V.hobA=V.hobA||{};if(!V.hobA[hp_.s]&&Math.abs(V.px-hp_.x)<190){V.hobA[hp_.s]=1;talk(hobLines(),'HOB',HB,C.br);V.talked=1}}}   // each speaks once on his own, so the lessons cannot be walked past
 const cine=V.ans>=0&&V.ans<20,live=V.stt==='play'&&!V.dlg&&!V.fade&&!cine,onBoom=live&&V.lay==='g'&&Math.abs(V.px-BOOM)<90&&K.eh,dir=live&&!onBoom?K.r-K.l:0,tv=dir*SPD;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);if(dir)V.face=dir;V.coy=V.gr?.1:(V.coy||0)-dt;V.buf=(V.buf||0)-dt;if(K.jp){V.buf=.12;K.jp=0}
 if(live&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;AM.sfx('interaction')}if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;
 // treadway: a belt that carries you west; running against it spins the governor
 const onTread=V.lay==='g'&&V.gr&&V.px>GOVX[0]&&V.px<GOVX[1]&&live;
 // The belt used to be a flat subtraction (V.vx-=300*dt*6) applied AFTER the movement acceleration, so the accel
 // simply won: vx settled at +270 east and the player blew across the treadway in 0.43s, far too short to build the
 // 4.5s the flywheel needs. It is a clamp now, both ways - a treadmill carries you west whichever way you run,
 // so holding any direction works the wheel without walking off the end.
 if(onTread){if(V.vx>30)V.vx=30;if(V.vx<-30)V.vx=-30;if(K.l||K.r){V.spin=1;V.gov=Math.min(1,V.gov+dt/4.5);V.idle=0;if(V.gov>.95&&!V.tg){V.tg=1;say(GOVX[0],'FULL SPEED',160)}}}else V.spin=0;
 if(!V.latch&&!(onTread&&(K.l||K.r)))V.gov=Math.max(0,V.gov-dt/20);if(V.latch)V.gov=1;
 V.px+=V.vx*dt;
 if(onBoom){V.cf=cl(V.cf+(K.r-K.l)*dt*1.5,0,4);V.c=Math.round(V.cf);V.idle=0}
 let lo=V.lay==='g'?HW:2900,hi=V.lay==='g'?(V.smooth?LW-90:TURN-40):4500;if(V.lay==='g'&&V.passed)lo=TURN+40;if(V.lay==='g'&&V.door<1)hi=Math.min(hi,DOOR-60);
 if(V.lay==='g'&&V.smooth&&!V.passed&&V.px>=TURN+40){V.passed=1;V.count++;V.tr=1;snd.click();AM.sfx('correct');say(TURN,'COUNTED',200);V.lvT=Math.max(V.lvT,3)}
 if(V.lay==='g')for(const [x,wd,t2] of [[WALLX,60,230],[6800,70,240]])if(V.py<t2-2&&V.px+HW>x&&V.px-HW<x+wd){V.px=V.vx>=0?x-HW:x+wd+HW;V.vx=0}
 V.px=cl(V.px,lo,hi);
 const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;let on=0;const f=floorAt(V.px),base=BASE[V.lay];
 if(V.py<=f){if(f<-300||(V.lay==='c'&&V.py<-500)){V.px=V.safeX;V.py=V.safeY;V.vx=V.vy=0;say(V.px,V.lay==='g'?'THE RAVINE IS TOO WIDE. FIND ANOTHER WAY.':'TRY AGAIN',V.safeY+240);AM.sfx('incorrect')}else{V.py=f;on=1}}
 const PLATS=platsFor();
 // A platform only catches a FALLING player, so the lift used to rise up out from under anyone standing on it, and
 // the 230-unit wall at x=1500 cannot be jumped (apex is 137.8) - a hard soft-lock before the Mechanist.
 // Riding: if we were standing on a platform last frame and its top has moved, we move with it exactly.
 // Deliberately not a tolerance grab - the lift jumps 18 units on its first powered frame, and the player only
 // gets carried when they were genuinely on it, never snatched by a platform rising past from below.
 if(V.rideKey){const rp=PLATS.find(q=>q[0]+':'+q[1]===V.rideKey);
  if(rp&&Math.abs(V.py-V.rideTop)<4&&V.px+HW>rp[0]&&V.px-HW<rp[0]+rp[1]&&rp[2]!==V.rideTop){V.py=rp[2];V.rideTop=rp[2];on=1}}
 for(const [x,wd,t] of PLATS)if(V.vy<=0&&y0>=t-2&&V.py<=t&&V.px+HW>x&&V.px-HW<x+wd){V.py=t;on=1;V.rideKey=x+':'+wd;V.rideTop=t}
 if(!on)V.rideKey=0;
 if(on){V.vy=0;if(V.vy===0&&on){V.safeX=V.px;V.safeY=V.py}}V.gr=on;
 if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.3;AM.sfx('step')}
 pulseTick(dt);lvl(dt);V.pop=Math.max(0,V.pop-dt);V.dark=Math.max(0,V.dark-dt);V.tr=Math.max(0,V.tr-dt);V.bt=(V.bt+dt)%12;
 if(V.ans>=0&&V.ans<99){V.ans+=dt;ans(dt)}
 if(V.take)V.tendril=V.smooth?1:V.tendril;V.idle+=dt;if(V.doorGo&&V.door<1)V.door=Math.min(1,V.door+dt/2.5);
 if(V.lay==='g'&&Math.abs(V.px-4520)<60&&V.seenDie&&V.tideHeard){V.mirT+=dt;if(V.mirT>1.5&&!V.mirror){V.mirror=1;note('The amber pulse arrives from the west and dies at the collar. The cyan tide arrives from the east and dies in the same place. They are answering each other. Neither can hear.');AM.sfx('correct')}}
 if(V.fade){V.fade.t+=dt*1.6;if(V.fade.t>=.5&&!V.fade.did){V.fade.did=1;V.lay=V.fade.lay;V.px=V.fade.px;V.py=V.fade.py;V.vx=V.vy=0;V.safeX=V.px;V.safeY=V.py}if(V.fade.t>=1)V.fade=null}
 if(K.e){K.e=0;if(V.dlg)advance();else if(V.stt==='play'&&!V.fade)act()}
 const rm=Z.filter(x=>V.px>=x).length-1;if(rm!==V.room&&V.lay==='g'){V.room=rm;V.rt=3}V.rt-=dt;V.mt-=dt;V.bad=Math.max(0,V.bad-dt);if(V.dlg&&V.dlg.c<V.dlg.L[V.dlg.i].length)V.dlg.c+=dt*46;
 if(V.fx){V.fx.t+=dt;if(V.fx.t>2.4)V.fx=null}
 if(V.door>=1&&V.px>DOOR&&!V.done){V.done=1;V.stt='done';spark(V.px,100,'#ffffff',30);AM.sfx('portal');note(EDU);const me=V;setTimeout(()=>{if(V!==me||!V.on)return;if(S.done.ironwood){fact('\u2713 ALREADY DISCOVERED');setTimeout(()=>{if(V===me)back()},2800)}else complete()},16000)}
 let d=130;V.near=null;if(!V.dlg&&V.stt==='play'&&!V.fade)IAS().forEach(o=>{const q=Math.abs(V.px-o.x);if(q<d){d=q;V.near=o}});
 const vw=w/U;if(!cine||reduce){V.cx+=((V.px-vw*.42+V.face*60)-V.cx)*(1-Math.exp(-5*dt))}V.cx=cl(V.cx,0,LW-vw);
 // The Answer no longer travels. The pan to the Foundry and back (ans 8 -> 22) used to leave the player at the dais
// while the camera travelled, which put ax at 7850 against a 1344 threshold and had the engine throw the run to the
 // hub mid-cinematic - so the door never opened and the level never completed. The pan is simply gone now: they
 // stay where they answered and the camera holds on them.
 
 const tcy=base+Math.max(0,V.py-base-60)*.8;V.cy+=(tcy-V.cy)*(1-Math.exp(-4*dt));
 V.vp=V.vp.filter(q=>(q.l-=dt)>0);V.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});V.ft=V.ft.filter(f2=>(f2.l-=dt)>0);ax=X(V.px);tx=V.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}
// ---- the Answer: the whole world replies (compressed to about 32 s; the camera pull-back becomes a crossfade with reduced motion)
const PLQ=['The old machine still works.','The forest is alive.','The connection is what changed.','IN ZCASH: NU6.3 added the Ironwood shielded pool. The original Orchard pool still exists, restricted. Value leaves it through the turnstile: a counted, one-way crossing.','A system can change and still be itself.','IT DIDN\'T NEED REPLACING. IT NEEDED A NEW CONNECTION.'];
function ans(dt){const a=V.ans;if(a>=3&&!V.b3){V.b3=1;snd.beat();AM.sfx('world-complete');V.lvT=4}if(a>=1&&!V.b1){V.b1=1;snd.tone(110,2.4,'sine',.2,60)}
 if(a>=17&&!V.b17){V.b17=1;snd.bell();AM.sfx('impact');V.tendril=1;V.lamps=1}
 if(a>=22&&!V.b22){V.b22=1;AM.sfx('collectible')}if(a>=32){V.ans=20;V.stt='play';V.door=0;V.doorGo=1;note('Behind the dais the iron ribs part like curtains. A door of living wood opens.')}}
function tick2(dt){}

// ======================= drawing =======================
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
function bubble(s,x,y,col,mw,a){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4,bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12,bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;g2.save();g2.globalAlpha=a==null?1:a;rc(bx,by,bw,bh,'#05060fe8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}
const glow=(x,y,r,c,a)=>{const sx=X(x),sy=Y(y),R=r*U;if(sx<-R||sx>W_+R)return;const g=g2.createRadialGradient(sx,sy,0,sx,sy,R);g.addColorStop(0,c+'ff');g.addColorStop(1,c+'00');g2.globalAlpha=a;g2.fillStyle=g;g2.fillRect(sx-R,sy-R,R*2,R*2);g2.globalAlpha=1};
function treeGear(x,y,r,t,c){const sx=X(x),sy=Y(y);if(sx<-200||sx>W_+200)return;g2.save();g2.translate(sx,sy);g2.rotate(t);g2.strokeStyle=c;g2.lineWidth=4*U;g2.beginPath();g2.arc(0,0,r*U,0,7);g2.stroke();for(let i=0;i<8;i++){g2.rotate(.785);g2.beginPath();g2.moveTo(r*U*.2,0);g2.lineTo(r*U,0);g2.stroke()}g2.restore()}
function lamp(x,y,on){rr(x-3,y,6,12,on?C.br:C.ir);if(on)glow(x,y-6,60,C.am,.35)}
function elder(t){const x=SEAMX;rr(x-90,900,180,900,'#0a120d');rr(x-100,60,200,60,'#0a120d');for(let i=0;i<6;i++)rr(x-80+i*30,880-(i*40),6,700,'#13251a');rr(x-14,820,28,820,C.ir);rr(x-24,820,48,10,C.ru);                     // living trunk with an iron tower grown through it
 [[0,'#3a2a1c'],[1,'#5a3a22'],[2,'#050806'],[3,C.cy],[4,C.br]].forEach(([i,c])=>{const q=CPT[i];if(i===3){rr(q[0]-20,q[1]+16,50,16,'#1a2a1c');rr(q[0]-10,q[1]+4,8,26,C.ir)}cc(q[0],q[1],i===1?22:14,c,i===3?.9:.85);if(i===3){glow(q[0],q[1],70,C.cy,.25+.25*tideI()+.2*V.lv/4)}})}
function collarPos(){const q=CPT[V.c];return [q[0],q[1]]}
function lampsOn(i){return V.lamps||V.lv>=2||(V.pl.some(p=>FOUND+SP*p.a>PYL[i]&&p.a<(PYL[i]-FOUND)/SP+3))}
// ---- VISUAL POLISH (render-only; reads V.lv / V.cx / V.cy only to tint and scroll) ----
const Zp=window.ZKP;
const iWorld=f=>{g2.save();g2.translate(-V.cx*U,GY+V.cy*U);g2.scale(U,U);f();g2.restore()};   // world units, y up is negative (matches Y())

// ---- EXTRA DEPTH (render-only; none of this reads or changes gameplay state) ----
const xmix=(a,b,k)=>{const A=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)),B=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')};
function xFar(cx,gy,t,c0,c1,sp){if(!Zp)return;g2.save();sp=sp||520;const a=Math.floor((cx*.1-200)/sp),b=Math.ceil((cx*.1+W_/U+200)/sp);   // far floating monoliths, tethered to the horizon
 for(let k=a;k<=b;k++){const wx=k*sp+Zp.hash(k*3.7)*220,sx=(wx-cx*.1)*U,h=(60+Zp.hash(k*1.3)*80)*U,w=(12+Zp.hash(k*5.1)*16)*U,y=gy-(300+Zp.hash(k*2.9)*190+Math.sin(t*.4+k)*8)*U;
  g2.globalAlpha=.55;g2.fillStyle=xmix(c0,'#000000',.55);g2.beginPath();g2.moveTo(sx,y-h);g2.lineTo(sx+w,y);g2.lineTo(sx,y+h*.7);g2.lineTo(sx-w,y);g2.fill();
  g2.globalAlpha=.55;g2.strokeStyle=c1;g2.lineWidth=Math.max(1,1.4*U);g2.beginPath();g2.moveTo(sx+w,y);g2.lineTo(sx,y-h);g2.lineTo(sx-w,y);g2.stroke();
  Zp.glow(g2,sx,y,w*3.2,w*3.2,c1,.13+.05*Math.sin(t+k));g2.fillStyle=c1;g2.globalAlpha=.18;const y1=y+h*.7,st=(gy-y1)/9;for(let q=0;q<9;q++)g2.fillRect(sx-U*.7,y1+q*st,1.5*U,4*U)}
 g2.restore()}
function xMid(cx,gy,t,cols,n){if(!Zp)return;const span=W_/U+240;                       // glowing fireflies / embers drifting through the playfield depth
 for(let k=0;k<n;k++){const par=.3+.7*Zp.hash(k*4.4),ux=(((Zp.hash(k*9.1)*span+t*(3+k%4)*(k%2?1:-1)-cx*par)%span)+span)%span-120,sx=ux*U,sy=gy-(18+Zp.hash(k*3.7)*230+Math.sin(t*.8+k)*12)*U,a=.35+.35*Math.abs(Math.sin(t*1.3+k*2));
  Zp.glow(g2,sx,sy,9*U,9*U,cols[k%cols.length],a*.55);g2.globalAlpha=a;g2.fillStyle='#ffffff';g2.fillRect(sx-U,sy-U,2*U,2*U);g2.globalAlpha=1}}
function xFront(cx,t,cols,LWd,grass,blade){if(!Zp)return;const r=n=>Zp.hash(n*12.9898);                                    // foreground: dark grass at the very bottom, bokeh, soft vignette
 if(grass){g2.fillStyle=blade||'#030508';for(let k=0;k<64;k++){const wx=r(k)*(LWd*1.3+W_/U),x=(wx-cx*1.3)*U,h=(4+r(k+99)*15)*U;if(x<-6||x>W_+6)continue;g2.fillRect(x,H_-h,2.6*U,h);if(h>13*U){g2.fillStyle=xmix(cols[k%cols.length],'#000000',.35);g2.fillRect(x,H_-h,1.4*U,1.6*U);g2.fillStyle=blade||'#030508'}}}
 g2.save();g2.globalCompositeOperation='lighter';const sp=W_*1.3;for(let k=0;k<9;k++){const x=(((r(k+5)*sp-cx*1.35*U+t*(3+k%4)*(k%2?1:-1)*U)%sp)+sp)%sp-W_*.15,y=GY*(.15+r(k+17)*.75)+Math.sin(t*.6+k)*10*U;Zp.glow(g2,x,y,26*U,26*U,cols[k%cols.length],.06+.04*Math.sin(t*1.1+k))}g2.restore();
 const vg=g2.createRadialGradient(W_/2,H_*.45,Math.min(W_,H_)*.5,W_/2,H_*.45,Math.max(W_,H_)*.78);vg.addColorStop(0,'#00000000');vg.addColorStop(1,'#00000088');g2.fillStyle=vg;g2.fillRect(0,0,W_,H_)}
function iMid(t){if(!Zp||V.lay!=='g')return;const y0=Y(0),par=.5,sp=300,a=Math.floor((V.cx*par-200)/sp),b=Math.ceil((V.cx*par+W_/U+200)/sp),leaf=xmix('#10201a',C.mo,V.lv/4);g2.save();   // ironwood trunks with gear-bark and canopy, between skyline and playfield
 for(let k=a;k<=b;k++){const wx=k*sp+Zp.hash(k*6.1)*120,sx=(wx-V.cx*par)*U,h=(170+Zp.hash(k*3.3)*140)*U,w=16*U;
  g2.globalAlpha=.7;g2.fillStyle='#0a0e0b';g2.fillRect(sx,y0-h,w,h+4);g2.globalAlpha=.4;g2.fillStyle=C.br;g2.fillRect(sx,y0-h,2*U,h);
  g2.strokeStyle='#0a0e0b';g2.lineWidth=6*U;g2.globalAlpha=.7;g2.beginPath();g2.moveTo(sx+w/2,y0-h*.62);g2.lineTo(sx-34*U,y0-h*.86);g2.moveTo(sx+w/2,y0-h*.7);g2.lineTo(sx+w+34*U,y0-h*.92);g2.stroke();
  g2.globalAlpha=.55;g2.fillStyle=leaf;for(const [dx,dy,r] of [[-34,.86,40],[8,1.02,48],[50,.92,38]]){g2.beginPath();g2.arc(sx+dx*U+w/2,y0-h*dy,r*U,0,7);g2.fill()}
  g2.globalAlpha=.3;g2.strokeStyle=C.ru;g2.lineWidth=1.5*U;g2.beginPath();g2.arc(sx+w/2,y0-h*.4,12*U,0,7);g2.stroke();
  Zp.glow(g2,sx+w/2,y0-26*U,36*U,36*U,C.am,.1+.05*Math.sin(t*1.5+k))}
 g2.restore()}
function iAfter(t,p){if(V.lay==='g')iGround(t,p);else if(V.lay==='c')iCanopy(t)}
function iFar(t){if(!Zp||V.lay!=='g')return;const y0=Y(0);g2.save();   // distant foundry skyline, slower than the camera, with drifting smoke
 for(let k=-1;k<14;k++){const wx=k*620+200+Zp.hash(k*3)*160,sx=(wx-V.cx*.3)*U;if(sx<-120*U||sx>W_+120*U)continue;const kind=Zp.hash(k*7)>.45,h=(kind?190+Zp.hash(k)*130:120+Zp.hash(k)*90)*U,w=(kind?30:150)*U;
  g2.globalAlpha=.9;g2.fillStyle='#0a0d10';g2.fillRect(sx,y0-h,w,h+4);g2.globalAlpha=.5;g2.fillStyle=C.ir;g2.fillRect(sx,y0-h,2*U,h);
  if(kind){g2.globalAlpha=.55;g2.fillStyle=C.ru;g2.fillRect(sx-3*U,y0-h,w+6*U,5*U);g2.fillRect(sx,y0-h+14*U,w,3*U);for(let s=0;s<3;s++)Zp.glow(g2,sx+w/2+Math.sin(t*.5+s+k)*8*U,y0-h-((t*10+s*38+k*17)%110)*U,(16+s*8)*U,(16+s*8)*U,'#8a8f98',.07*(1-s*.25))}
  else{g2.strokeStyle=C.ir;g2.lineWidth=Math.max(1,1.5*U);g2.globalAlpha=.45;g2.beginPath();for(let q=0;q<w/(30*U);q++){const xx=sx+q*30*U;g2.moveTo(xx,y0-h);g2.lineTo(xx+30*U,y0-h*.45);g2.moveTo(xx+30*U,y0-h);g2.lineTo(xx,y0-h*.45)}g2.stroke();g2.fillStyle=C.ir;g2.globalAlpha=.7;g2.fillRect(sx,y0-h,w,4*U)}}   // lattice gantry
 g2.restore()}
function iGround(t,p){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60,lv=V.lv,seg=[[-300,RAV[0]],[RAV[1],7050],[7350,LW+400]];
 iWorld(()=>{seg.forEach(([a,b])=>{const l=Math.max(a,x0),r=Math.min(b,x1);if(r<=l)return;
   g2.strokeStyle='#000';g2.lineWidth=1.2;g2.globalAlpha=.5;g2.beginPath();g2.moveTo(l,24);g2.lineTo(r,24);for(let wx=Math.ceil(l/140)*140;wx<r;wx+=140){g2.moveTo(wx,5);g2.lineTo(wx,60)}g2.stroke();   // steel plate seams
   g2.fillStyle=C.ru;g2.globalAlpha=.7;for(let wx=Math.ceil(l/140)*140;wx<r;wx+=140){g2.fillRect(wx-9,9,2.4,2.4);g2.fillRect(wx+7,9,2.4,2.4)}                                                              // rivets
   g2.globalAlpha=.1;g2.fillStyle=C.ru;for(let wx=Math.ceil(l/53)*53;wx<r;wx+=53)if(Zp.hash(wx*.17)>.55)g2.fillRect(wx,6,5+Zp.hash(wx)*5,18+Zp.hash(wx*2)*40);                                              // rust streaks
   Zp.grit(g2,l,r,14,(H_-GY)/U,30,'#2a2f36',.6,2,3,.3);g2.globalAlpha=.55;g2.fillStyle='#8a7a68';g2.fillRect(l,0,r-l,1.2);                                                                           // grit + lit lip
   g2.strokeStyle=mixc('#3a4a34',C.mo,lv/4);g2.lineWidth=1.5;g2.globalAlpha=.4+.45*lv/4;g2.beginPath();for(let wx=Math.ceil(l/19)*19;wx<r;wx+=19){if(Zp.hash(wx*.31)>.5+lv*.1)continue;const h=3+Zp.hash(wx)*(5+lv*3),sw=Math.sin(t*1.1+wx*.07)*1.8;g2.moveTo(wx,0);g2.quadraticCurveTo(wx+sw*.4,-h*.6,wx+sw,-h)}g2.stroke();g2.globalAlpha=1});   // weeds creep back with lv
  PYL.forEach(x=>{if(x<x0-30||x>x1+30)return;g2.strokeStyle=C.ru;g2.lineWidth=1.4;g2.globalAlpha=.55;g2.beginPath();for(let yy=0;yy+44<=CAB+20;yy+=44){g2.moveTo(x-9,-yy);g2.lineTo(x+9,-(yy+44));g2.moveTo(x+9,-yy);g2.lineTo(x-9,-(yy+44))}g2.stroke();   // pylon cross-bracing
   g2.globalAlpha=1;g2.fillStyle='#1a1d22';g2.fillRect(x-16,-12,32,12);g2.fillStyle=C.ru;g2.globalAlpha=.6;g2.fillRect(x-16,-12,32,1.5);g2.globalAlpha=1;g2.fillStyle='#cfc7b0';g2.fillRect(x-5,-(CAB+20)-6,10,6);g2.fillRect(x-3,-(CAB+20)-9,6,3)});   // base plate + insulator
  Zp.rows(g2,250,-190,250,190,'#12151a',.6,24,62);Zp.edge(g2,250,-190,250,190,C.br,'#000',.25,1.5);g2.fillStyle=C.ru;g2.globalAlpha=.7;for(let k=0;k<10;k++)g2.fillRect(256+k*24.5,-184,2.4,2.4);g2.globalAlpha=1;   // foundry panels + rivets
  Zp.rows(g2,2060,-150,240,150,'#0d1013',.6,14,400);Zp.edge(g2,2060,-150,240,150,C.ru,'#000',.2,1.5);Zp.rows(g2,WALLX,-230,60,230,'#12151a',.6,26,60);Zp.edge(g2,WALLX,-230,60,230,C.br,'#000',.22,1.5);   // lamp shack boards, lift wall
  if(x0<560&&x1>480)for(let s=0;s<4;s++){const u=(t*.35+s/4)%1;Zp.glow(g2,528+Math.sin(u*9+s)*6,-(48+u*120),(10+u*22),(10+u*22),'#cfd4da',.16*(1-u))}})   // steam from the existing pipe
 if(!reduce)Zp.motes(g2,0,0,W_,Y(0),T,18,'#ffb347',{alpha:.28,size:Math.max(1.5,2*U),speed:7,seed:6})}                                                                                                                       // drifting embers
function iCanopy(t){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60;iWorld(()=>{CPL.forEach(([x,w,tp])=>{if(x+w<x0||x>x1)return;g2.globalAlpha=.3;g2.fillStyle='#000';g2.fillRect(x+2,-tp+14,w-4,8);g2.globalAlpha=1;Zp.edge(g2,x,-tp,w,14,C.br,'#000',.28,1.5)})})}
function scene(w,h,gy,t,p){const lv=V.lv;
 iFar(t);iMid(t);if(V.lay==='g')ground(t,p);else if(V.lay==='u')under(t,p);else canopy(t,p);iAfter(t,p);
 if(V.lay==='g')xMid(V.cx,Y(0),t,[C.am,C.cy],14);V.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*2);rr(q.x,q.y,q.s,q.s,q.c)});g2.globalAlpha=1;V.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),C.cy,240*U,Math.min(1,f.l)))}
function ground(t,p){const lv=V.lv,gx=Math.max(0,X(-300)),gr=mixc('#14211a','#2d5a3d',lv/4);
 [[-300,RAV[0]],[RAV[1],7050],[7350,LW+400]].forEach(([a,b])=>{const l=Math.max(0,X(a)),r=Math.min(W_,X(b));if(r>l){rc(l,GY,r-l,H_-GY,mixc('#0f1412','#1a2a1c',lv/4));rc(l,GY,r-l,5*U,gr)}});
 rr(RAV[0],0,RAV[1]-RAV[0],700,'#040605');
 // foundry yard: the Bell Engine, a swept stoop, a fresh oil can
 rr(250,190,250,190,C.ir);rr(250,190,250,10,C.ru);rr(340,260,70,70,C.br);cc(375,290,26,'#6a4a22');rr(300,28,70,10,'#1a1d22');rr(520,24,16,24,C.ru);treeGear(300,70,60,t*.0,'#3a3028');
 // pylons, cable, lamps, the lift wall
 PYL.forEach((x,i)=>{rr(x-9,CAB+20,18,CAB+20,C.ir);rr(x-24,CAB+20,48,8,C.ru);lamp(x,CAB-4,lampsOn(i))});g2.strokeStyle=lv>=2?C.br:C.ru;g2.lineWidth=4*U;g2.beginPath();g2.moveTo(X(FOUND+150),Y(CAB+10));g2.lineTo(X(COLX),Y(CAB+10+0));g2.stroke();
 rr(WALLX,230,60,230,C.ir);rr(WALLX,230,60,8,C.ru);const lf=GOBJ[0];rr(lf.x,(lf.h||0),lf.x2-lf.x,10,powered(lf.x2)?C.br:'#3a3028');T2('LIFT',(lf.x+lf.x2)/2,(lf.h||0)+30,powered(lf.x2)?C.am:'#5a5a5a',11);
 // the lamp shack and Hob's chalk wall
 rr(2060,150,240,150,'#1a1d22');rr(2060,150,240,8,C.ru);for(let r=0;r<5;r++)T2('||||| ||||| |||||',2120,125-r*18,'#9a9488',9);rr(2250,60,10,36,'#5a3a22');
 // the Elder, the bench, the weeping stump
 elder(t);rr(3200,30,70,16,'#3a2a1c');
 // far bank: mirror frame, boom station, cord, governor, treadway
 g2.strokeStyle=C.bo;g2.lineWidth=3*U;g2.strokeRect(X(4480),Y(210),80*U,210*U);rr(4640,200,12,200,C.ir);rr(BOOM-30,200,70,10,C.ru);rr(CORD,90,6,90,'#5a3a22');cc(CORD+3,0+4,6,C.br);
 {const q=collarPos();g2.strokeStyle='#3a3028';g2.lineWidth=3*U;g2.beginPath();g2.moveTo(X(BOOM),Y(190));g2.quadraticCurveTo(X((BOOM+q[0])/2),Y(120+Math.sin(t)*6),X(q[0]+22),Y(q[1]));g2.stroke();cc(q[0]+20,q[1],12,C.br);g2.strokeStyle=C.br;g2.lineWidth=4*U;g2.beginPath();g2.arc(X(q[0]+20),Y(q[1]),12*U,0,7);g2.stroke()}
 treeGear(5000,170,90,V.t*(.2+V.gov*5),V.tendril?mixc(C.ru,C.cy,.5):C.ru);rr(GOVX[0],10,GOVX[1]-GOVX[0],10,'#2a2f36');for(let i=0;i<6;i++)rr(GOVX[0]+((i*22+(V.t*60*(V.spin?1:0)))%(GOVX[1]-GOVX[0])),12,8,5,C.ru);if(V.tendril){g2.strokeStyle=C.cy;g2.lineWidth=3*U;g2.beginPath();g2.moveTo(X(5000),Y(170));g2.quadraticCurveTo(X(5100),Y(50),X(5200),Y(0));g2.stroke()}
 // thin roots, turnstile, grove, bridge, heart door
 const sc=V.pop>0;for(let i=0;i<60;i++){const x=THIN+i*16;g2.strokeStyle=sc?'#ffffff':mixc('#14211a',C.cy,V.smooth?.9:(V.take?.3+tideI()*.4:.1));g2.lineWidth=2*U;g2.beginPath();g2.moveTo(X(x),Y(4));g2.lineTo(X(x+10),Y(-4+Math.sin(i)*4));g2.stroke()}
 const arm=V.tr>0?V.tr*2.1:V.count*2.1;g2.save();g2.translate(X(TURN),Y(70));g2.rotate(arm);g2.strokeStyle=V.smooth?C.br:'#3a3028';g2.lineWidth=5*U;for(let i=0;i<3;i++){g2.rotate(2.094);g2.beginPath();g2.moveTo(0,0);g2.lineTo(44*U,0);g2.stroke()}g2.restore();rr(TURN-60,260,20,260,C.ir);rr(TURN+40,260,20,260,C.ir);rr(TURN-40,260,80,50,'#0b0d10');T2(String(V.count).padStart(3,'0'),TURN,238,V.smooth?C.am:'#5a5a5a',22);
 const br=GOBJ[1];if(br.e>.05){rr(br.x,0,(br.x2-br.x)*br.e,12,C.br)}const l2=GOBJ[2];rr(l2.x,(l2.h||0),l2.x2-l2.x,10,powered(l2.x2)?C.br:'#3a3028');rr(6800,240,70,240,C.ir);
 for(let i=0;i<8;i++){const x=GROVE[0]+80+i*140;rr(x,300+(i*37)%160,40,300+(i*37)%160,mixc('#0a120d','#1f3d2b',lv/4));if(lv>=3)rr(x+17,260+(i*37)%160,4,200,C.cy)}
 rr(7500,420,60,420,C.ir);rr(7500,420,700,10,C.ru);                                                                              // the primary: iron drum
 heartInterior(t);dee(t,p);hob(t,p);
 // tide glow, afterglow hint, effects
 if(tideI()>0){glow(COLX,40,300,C.cy,.2*tideI());glow(4300,30,260,C.cy,.15*tideI())}
 fxDraw(t);pulseDraw(t);hint(t);
 if(V.dark>0){g2.fillStyle='rgba(0,0,0,'+Math.min(.5,V.dark*.4)+')';g2.fillRect(0,0,W_,H_)}}
function fxDraw(t){if(!V.fx)return;const f=V.fx,q=CPT[V.c],a=Math.max(0,1-f.t/2.4);g2.globalAlpha=a;if(f.o==='SINK'){cc(q[0]+20,q[1]-f.t*40,6,C.am);glow(q[0],0,100+f.t*60,C.am,.3*a)}else if(f.o==='BOUNCE'){glow(q[0],q[1],120,'#ffffff',.5*a)}else if(f.o==='STARVE'){cc(q[0]+10,q[1]-f.t*20,4,C.am)}else if(f.o==='LOOP'){cc(q[0]+Math.cos(f.t*8)*30,q[1]+Math.sin(f.t*8)*30,6,C.am)}else if(f.o==='TAKE'){glow(q[0]+20,q[1],140,C.cy,.5*a);glow(q[0]+20,q[1],100,C.am,.3*a)}g2.globalAlpha=1}
function pulseDraw(t){V.pl.forEach(p=>{const x=headX(p);if(x<FOUND||x>LW)return;const y=x<COLX-5?CAB+10:x<THIN?(x<COLX+20?CPT[V.c][1]:6):x<GROVE[0]?4:x<7000?6:20;glow(x,y,70,p.out==='TAKE'&&x>COLX?C.cy:C.am,.55);cc(x,y,6,'#ffffff')})}
function hint(t){if(V.idle<45)return;const a=Math.min(.5,(V.idle-45)/60*.5),tg=!V.seenDie?3230:!V.mirror?4520:!V.take?BOOM:!V.smooth?GOVX[0]:!V.passed?TURN:DAIS;for(let i=0;i<10;i++){const x=V.px+(tg-V.px)*(i/10);g2.globalAlpha=a*(.5+.5*Math.sin(t*2+i));cc(x+Math.sin(t+i)*6,12+i*2,3,C.am)}g2.globalAlpha=1}
function hob(t,p){const hp=hobPost(),x=hp.x,sx=X(x);if(V.lay!=='g'||sx<-100||sx>W_+100)return;const h=PH*U,bob=Math.sin(t*2)*2*U;g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(0)+3,28*U,5*U,0,0,7);g2.fill();
 if(HB&&HB.width){const w=h*HB.width/HB.height;g2.save();g2.imageSmoothingEnabled=false;g2.translate(sx,Y(0)-bob);g2.scale(V.px<x?-1:1,1);g2.drawImage(HB,-w/2,-h,w,h);g2.restore()}else{rr(x-16,100,32,60,'#4a3a28');rr(x-10,128,20,14,'#2a2418');rr(x-18,40,10,40,'#3a2c1c');rr(x+8,40,10,40,'#3a2c1c')}T2('HOB',x,PH+30,C.br,11)}
function heartInterior(t){const x0=7500,L=V.lv,ans=V.ans>=0?V.ans:0,sl=V.ans>=3?cl((V.ans-3)/5,0,1):0,fin=V.ans>=20||V.ans>=99?1:0;
 rr(x0,600,700,600,'#0a0d0c');rr(x0,600,350,600,mixc('#2a2f36','#3a3028',.3));rr(x0+350,600,350,600,mixc('#13251a','#1f3d2b',.3+L/6));                           // left iron, right wood
 for(let i=0;i<7;i++){rr(x0+i*50,590,8,590,C.ru);g2.globalAlpha=.3+.7*sl;rr(x0+380+i*45,590,4,590,C.cy);g2.globalAlpha=1}
 rr(x0+345,600,10,600,sl>0?mixc('#050806','#ffffff',sl):'#050806');if(sl>0)glow(x0+350,300,320,'#ffffff',.3*sl);
 for(let i=0;i<12;i++){const a=i/12*3.14;cc(x0+60+i*55,520,6,i<V.count*3||sl>0?C.am:'#2a2f36')}
 const ph=V.ans>=0&&V.ans<1?Math.sin(V.ans*Math.PI)*.6:0;g2.strokeStyle=C.br;g2.lineWidth=4*U;g2.beginPath();g2.moveTo(X(DAIS),Y(600));g2.lineTo(X(DAIS)+Math.sin(ph)*160*U,Y(380));g2.stroke();cc(DAIS+Math.sin(ph)*160*0,380,0,C.br);
 const b=V.ans>=20?(V.bt<1?1-V.bt:0):0;for(let k=0;k<4;k++)ring(X(DAIS),Y(20),(120+k*50)*U,.06*(1+k),k%2?C.cy:C.am,t,0);
 g2.globalAlpha=.3+.7*Math.max(sl,b);g2.strokeStyle=C.am;g2.lineWidth=3*U;g2.beginPath();g2.ellipse(X(DAIS),Y(20),(150+b*30)*U,30*U,0,0,7);g2.stroke();g2.globalAlpha=1;
 if(V.ans>=22){const r=cl((V.ans-22)/6,0,1),cy=lerp(20,200,r);cc(DAIS,cy,10,'#b9803a');g2.strokeStyle=C.cy;g2.lineWidth=3*U;g2.beginPath();g2.arc(X(DAIS),Y(cy),14*U,0,7);g2.stroke();glow(DAIS,cy,90,C.cy,.5)}
 if(V.door>0||V.doorGo){const d=V.ans>=20?cl(V.door,0,1):V.door;rr(DOOR-80,380-d*320,160,380,'#1f3d2b');g2.strokeStyle=C.cy;g2.lineWidth=3*U;g2.strokeRect(X(DOOR-80),Y(380-d*320),160*U,380*U)}else{rr(DOOR-80,380,160,380,'#13251a')}
 if(V.master){g2.globalAlpha=.7;ring(X(DAIS),Y(300),90*U,.1,C.am,t,0);g2.globalAlpha=1}if(V.ans>=17&&V.ans<24||V.ans>=99){const hx2=X(7440);if(hx2>-100&&hx2<W_+100){rr(7440,70,22,60,'#4a3a28')}}
}
const lerp=(a,b,t)=>a+(b-a)*t;
function under(t,p){const ti=tideI(),lit=V.lv>=1?.4:0;g2.fillStyle='#04070a';g2.fillRect(0,0,W_,H_);rr(2880,0,1660,800,'#080d0b');rr(2880,-250,1660,300,'#0a1410');rr(2880,-250,1660,5,'#13251a');
 for(let i=0;i<14;i++){const x=2960+i*110,hh=40+(i*37)%90;rr(x,-250+hh+40,6,hh+40,mixc('#13251a',C.cy,(ti*.7+lit)*.8));rr(x-5,-250+hh,16,5,mixc('#1a2a1c',C.cy,ti*.5+lit*.5))}
 [3300,3700].forEach(x=>{rr(x-14,-190,28,40,'#2a1c10');for(let k=0;k<4;k++)cc(x+Math.sin(t+k)*3,-210-((t*30+k*14)%50),2,C.cy,.5+ti*.4)});rr(3770,-120,60,70,'#14181c');g2.strokeStyle=C.am;g2.lineWidth=2*U;g2.strokeRect(X(3770),Y(-120),60*U,70*U);for(let k=0;k<3;k++)cc(3790+k*14,-150,4,C.am,.7);T2('INTAKE CLOSED',3800,-60,'#9a9488',9);
 rr(4080,-190,34,40,'#13251a');cc(4097,-150,8,C.cy,.4+ti*.5);T2('\u25BC',2990,-170,C.br,16);T2('\u25BC',4480,-170,C.br,16);
 // the tunnel is dark except where the tide breathes and around you: move with the light
 const dk=cl(.88-ti*.8-lit,.1,.9),sx=X(V.px),sy=Y(V.py+50),R=(150+ti*400)*U,g=g2.createRadialGradient(sx,sy,R*.15,sx,sy,R);g.addColorStop(0,'rgba(2,4,6,0)');g.addColorStop(1,'rgba(2,4,6,'+dk+')');g2.fillStyle=g;g2.fillRect(0,0,W_,H_);if(ti>0){g2.fillStyle='rgba(95,227,214,'+(ti*.06)+')';g2.fillRect(0,0,W_,H_)}}
function canopy(t,p){const lv=V.lv;g2.fillStyle='rgba(8,14,10,.55)';g2.fillRect(0,0,W_,H_);
 for(let i=0;i<10;i++){const x=2880+i*170;rr(x,900,40,500+(i*53)%160,mixc('#0a120d','#1f3d2b',lv/4));g2.globalAlpha=.5;cc(x+20,330+(i*37)%90,90,mixc('#13251a','#2d5a3d',lv/4));if(lv>=3){g2.strokeStyle=C.cy;g2.lineWidth=2*U;g2.beginPath();g2.arc(X(x+20),Y(330+(i*37)%90),70*U,0,2)}g2.globalAlpha=1}
 CPL.forEach(([x,w,tp],i)=>{rr(x,tp,w,14,C.ir);rr(x,tp,w,5,C.ru);if(i<7||i>10)for(let k=0;k<w/40;k++)rr(x+k*40,tp-10,3,10,C.ru)});
 rr(3560,500,50,100,'#050806');rr(3630,470,40,6,C.br);cc(3650,480,10,C.br,.8);                                                      // the hollow and the band
 const h=H_*.5,hxs=X(DAIS)-0,hy=Y(520);if(hxs>-600&&hxs<W_+800){g2.fillStyle='#070a09';g2.fillRect(hxs-350*U,hy,700*U,420*U)}
 if(V.graft||true){g2.globalAlpha=V.graft?1:.6;rr(3100,700,40,30,'#1a2a1c');for(let k=0;k<8;k++)cc(3110+k*9,730+Math.sin(k+t)*4,2.5,C.cy,.8);rr(3135,712,8,26,'#4a3a28');T2('\u25CB',3118,730,C.br,18);g2.globalAlpha=1}
 rr(3990,520,430,10,C.ir);for(let k=0;k<4;k++)rr(4020+k*100,500,6,-300,C.ru);rr(4090,230,26,230,'#3a3028');T2('NEVER LIT',4103,210,C.rd,9);rr(4290,560,70,40,'#1a1210');T2('LOG',4325,570,C.br,10);
 T2('\u25BC',2930,340,C.br,16);T2('\u25BC',4440,340,C.br,16)}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0,ed=V.lv>=2?C.cy:V.take?C.cy:p.pr;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(V.py)+3,aw*.38,5*U,0,0,7);g2.fill();g2.save();g2.shadowColor=V.ans>=20?C.am:V.take?C.cy:p.pr;g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(V.face<0?-(1-idle):1-idle,1+idle);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 if(V.ans>=0&&V.ans<20||V.ans>=20){g2.globalAlpha=.7;g2.strokeStyle=C.am;g2.lineWidth=2;g2.beginPath();g2.arc(sx,sy-ph*.5,ph*.6,0,7);g2.stroke();g2.globalAlpha=1}}
function drawHud(p){g2.textAlign='center';
 if(V.rt>0&&V.stt!=='cine'){g2.save();g2.globalAlpha=Math.min(1,V.rt);g2.fillStyle=C.br;g2.font="400 "+Math.round(Math.max(22,34*U))+"px 'Abril Fatface',serif";g2.fillText(V.lay==='u'?'THE ROOT ROUTE':V.lay==='c'?'THE CANOPY ROUTE':ZN[Math.max(0,V.room)],W_/2,H_*.18);g2.restore()}
 if(V.near&&!V.dlg&&V.stt==='play'&&V.near.l.indexOf('HOLD')<0)bubble((coarse?'TAP \u270B  ':'[E]  ')+V.near.l,X(V.near.x),Y(V.cy+260),C.br,280*U);
 if(V.lay==='g'&&Math.abs(V.px-BOOM)<90&&V.stt==='play')bubble((coarse?'HOLD \u270B + \u25C0 \u25B6':'HOLD [E] + \u25C0 \u25B6')+'  \u2014  '+CN[V.c],X(BOOM),Y(250),C.cy,300*U);
 if(V.lay==='g'&&V.px>GOVX[0]&&V.px<GOVX[1])bubble('RUN AGAINST THE BELT  \u2014  '+Math.round(V.gov*100)+'%',X((GOVX[0]+GOVX[1])/2),Y(120),C.am,260*U);
  // The Answer window used to be invisible and unforgiving. Show it, so pressing E is a decision and not a guess.
  if(V.lay==='g'&&V.heart&&V.ans<0&&V.px>DAIS-900){const live=V.t-V.hbeat<=AW_WIN,left=Math.max(0,AW_WIN-(V.t-V.hbeat));
   bubble(live?'THE HEART IS BEATING  \u2014  ANSWER IT ('+Math.ceil(left)+'s)':'QUIET  \u2014  WAIT FOR THE NEXT PULSE ('+Math.ceil(left)+'s)',X(DAIS),Y(340),live?C.cy:'#8a867c',300*U);}
 if(V.bad>0){g2.fillStyle='rgba(255,122,74,'+(V.bad*.25)+')';g2.fillRect(0,0,W_,H_)}
 if(V.fade){g2.fillStyle='rgba(0,0,0,'+Math.sin(Math.min(1,V.fade.t)*Math.PI)+')';g2.fillRect(0,0,W_,H_)}
 if(V.ans>=22&&V.ans<32){const i=Math.min(PLQ.length-1,Math.floor((V.ans-22)/1.7)),s=PLQ[i];g2.save();g2.globalAlpha=.95;g2.font=MONO(i===3?13:16);g2.textAlign='center';const ln=wrap(s,Math.min(W_-40,760)),bh=ln.length*24+24,by=H_*.32;rc(W_/2-Math.min(W_-40,760)/2-10,by,Math.min(W_-40,760)+20,bh,'#05060fe8');g2.fillStyle=i>=4?C.cy:'#ece8df';ln.forEach((l,k)=>g2.fillText(l,W_/2,by+26+k*24));g2.restore()}
 if(V.dlg){const d=V.dlg,im=d.img,ip=im&&im.width,mw=Math.min(W_-24,640),bx2=(W_-mw)/2,bh=Math.round(Math.max(110,H_*.18)),by2=H_-bh-(coarse?90:24),ix=ip?84:16;rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=C.br;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);
  if(ip){g2.imageSmoothingEnabled=false;g2.drawImage(im,bx2+10,by2+10,64,64)}
  g2.textAlign='left';g2.fillStyle=d.acc||C.br;g2.font=MONO(13);g2.fillText(d.who||'HOB',bx2+ix,by2+28);g2.fillStyle='#ece8df';g2.font=MONO(15);wrap(d.L[d.i].slice(0,Math.floor(d.c)),mw-(ip?100:32)).forEach((l,i)=>g2.fillText(l,bx2+ix,by2+54+i*22));g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?'TAP TO CONTINUE':'[E] / CLICK',bx2+mw-12,by2+bh-10)}
 else if(V.mt>0&&V.msg){g2.font=MONO(14);const mw=Math.min(W_-24,660),ln=wrap(V.msg,mw-28),bh=ln.length*22+22,bx2=(W_-mw)/2,by2=H_-bh-(coarse?90:22);g2.save();g2.globalAlpha=Math.min(1,V.mt*2);rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=C.cy;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx2+14,by2+24+i*22));g2.restore()}}

// ======================= wiring into the shared engine =======================
DEC.ironwood=function(w,h,gy,t,p){if(!isI()){OLD(w,h,gy,t,p);return}scene(w,h,gy,t,p)};
const _bgi=bg;bg=function(w,h,gy,p){if(isI()){frame(w,h,gy);cam=V.cx*U}_bgi(w,h,gy,p)};
const _avi=avatar;avatar=function(w,h,gy,p){if(isI()){drawPlayer(p);xFront(V.cx,T,[C.am,C.cy,C.mo],LW,V.lay==='g','#040504');drawHud(p)}else _avi(w,h,gy,p)};
const _sti=startWorld;startWorld=function(i){const me=W[i].id==='ironwood';if(me)vInit();_sti(i);if(me)$z('wf').innerHTML=''};
const _spi=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spi()};
});

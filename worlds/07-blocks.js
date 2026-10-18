/* ZKSCAPE world 07: BLOCK OBSERVATORY. Same engine hooks + movement model as the other worlds. Only this file is new.
   An observatory that watches history being decided. Blocks arrive as candidates, each pointing back to a parent. Two can compete; the one carrying
   the most work becomes the road, the other becomes a dusty ghost branch ("real, valid-looking, not continued"). Failure is a gentle reorg, never a death.
   Loop: OBSERVE (a block arrives, links back) -> PREDICT (stand on a candidate) -> FORK (one is continued, one is not) -> WHY? -> THE WORK ENGINE (work is slow to do, instant to verify)
   -> second fork (the first to arrive does not win) -> follow the road up -> the whole chain lights. Stylized metaphor, not a real consensus simulation. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'blocks',n:'BLOCKS',title:'THE BLOCK OBSERVATORY',sub:'Who decides what history is?',desc:'An observatory that watches histories being proposed. Some will be remembered. Work out why.',q:'History is what the network keeps following.',sort:[['',0]],
 deep:'A blockchain is a linked history: every block points back to the one before it. Many candidate blocks can exist at once, but the network follows one chain under shared rules. Zcash uses Proof of Work as part of how it decides which blocks count. This world is a gameplay metaphor, not a consensus simulator.'});
A.blocks='Chain Beacon';
TH.blocks={sky:['#03050f','#0f1a45'],moon:[.18,.2,.05,'#cfd8f0'],mt:'#080d26',fog:'#4d7cff',amb:'mote'};
GIANT.blocks=function(w,h,gy,t,th,p,c,id,o,f){ring(w*.5+o,gy-h*.3,h*.26,.12,'#6fa8ff',t);ring(w*.5+o,gy-h*.3,h*.17,-.18,'#cfd8f0',t)};
LM.blocks=function(x,y,s,c,t,a,B){for(let i=0;i<3;i++){B();hg.rect(-s*.8+i*s*.55,-s*.2-i*s*.12,s*.5,s*.4);hg.stroke()}};
// ---------------- level data (1 unit = U px; y = height of the top surface) ----------------
const LW=6700,HW=30,PH=112,SPD=330,JMP=830,GRAV=2500,GATE=4170,CON=3200,FORG=3820,VER=3980,ENGX=3420,EXX=6560,OBS=6020;
const GR=[[0,900,0],[2960,590,-30],[3650,510,-30],[3300,700,-330],[3940,100,-250],[3850,90,-170],[3940,90,-90],[3040,100,70],[3170,100,150],[3300,100,230],[3430,100,310],[3560,260,390],[6020,660,230]];
const IK={void:'#03050f',stone:'#1a2347',steel:'#9aa7c7',blue:'#6fa8ff',cy:'#7ee7ea',white:'#eef3ff',bad:'#e25b4a',ok:'#7ddea0',gold:'#e4b15a',dim:'#6a7084',dust:'#5b5f73'};
let Q=null,U=1,W_=0,H_=0,GY=0,BK=[],F=[];const K={l:0,r:0,j:0,jp:0,e:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-Q.cx)*U,Y=y=>GY-(y-Q.cy)*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
const sfx=n=>{try{AM.sfx(n)}catch(e){}},rgba=(h,a)=>h+Math.round(Math.max(0,Math.min(1,a))*255).toString(16).padStart(2,'0');
// Hialdu, the Watcher. Same load pattern as the other worlds: clean sprite, palette extracted for glow/label.
let HD=null,HD_PAL=['#f2f2ee','#ffeb57','#ca8197'];{const im=new Image();im.onload=()=>{try{const c=typeof removeBg==='function'?removeBg(im):im;c.complete=true;if(!c.width)c.width=im.width;if(!c.height)c.height=im.height;HD=c;try{const p=extract(c)[0];if(Array.isArray(p)&&p[0]&&/^#[0-9a-f]{6}$/i.test(p[0]))HD_PAL=p}catch(e){}}catch(e){HD=im}};im.onerror=()=>{};im.src='NPCs/hialdu_clean.png'}
const isB=()=>run&&cur&&cur.id==='blocks'&&Q&&Q.on;
function bk(x,y,o){const b=Object.assign({x,y,w:160,st:'hid',wk:0,rate:.5,trig:x-700,fork:0,after:null,p:null,sd:0,n:0},o||{});BK.push(b);return b}
function build(){BK=[];F=[];const G=bk(900,0,{st:'conf',wk:1,gen:1,n:0}),B1=bk(1160,0,{trig:520,rate:.16,p:G,n:1}),B2=bk(1420,25,{trig:900,p:B1,n:2}),B3=bk(1680,50,{trig:1160,p:B2,n:3}),B4=bk(1940,50,{trig:1420,p:B3,n:4});
 const A1=bk(2170,120,{fork:1,side:'A',p:B4,n:5}),C1=bk(2170,-20,{fork:1,side:'B',p:B4,n:5});
 F.push({id:1,trig:1760,A:A1,B:C1,par:B4,t:-1,res:0,fa:t=>.05*t,fb:t=>.1*t,bd:0});
 const D1=bk(2430,-20,{after:0,p:C1,n:6,trig:0}),D2=bk(2690,-20,{after:0,p:D1,n:7,trig:2200});
 bk(4290,-10,{trig:3990,p:null,n:8});const E2=bk(4530,30,{trig:4200,n:9}),E3=bk(4770,70,{trig:4440,n:10});
 const A2=bk(5000,150,{fork:2,side:'A',p:E3,n:11}),B5=bk(5000,0,{fork:2,side:'B',p:E3,n:11});
 F.push({id:2,trig:4560,A:A2,B:B5,par:E3,t:-1,res:0,fa:t=>Math.min(.6,.12*t)+Math.max(0,t-5)*.01,fb:t=>t<3?0:.09*(t-3)+(t>7?.12*(t-7):0),bd:3});
 bk(5260,50,{after:1,n:12,trig:0}),bk(5500,110,{after:1,n:13,trig:5020}),bk(5740,170,{after:1,n:14,trig:5260})}
function init(){build();Q={on:1,px:140,py:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,cx:0,cy:0,sq:0,st:'play',last:performance.now(),step:0,vp:[],msg:null,mt:0,aw:.12,t:0,
 eng:{run:0,t:0,done:0},gate:0,forg:0,arch:0,scope:0,reorgs:0,pred:0,final:0,ft:0,exitOpen:0,done:0,said:{},near:null,at:0,area:'',ltx:0,safe:{x:140,y:0},stand:null,fore:0,dlg:null};K.l=K.r=K.j=K.jp=K.e=0;ctl(1)}
function say(h,s,t,c){const col=c||IK.cy;if(Array.isArray(s)){Q.dlg={L:s,i:0};Q.msg={h,s:s[0],c:col}}else{Q.dlg=null;Q.msg={h,s,c:col}}Q.mt=t||5}
function dust(n){for(let i=0;i<n;i++)Q.vp.push({x:Q.px+(Math.random()-.5)*40,y:Q.py,vx:(Math.random()-.5)*140,vy:30+Math.random()*90,l:.45,c:'#9aa7c7',s:5,g:0})}
function spark(x,y,c,n=12){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*220;Q.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c,s:5,g:300})}}
// ---------------- input ----------------
if(!window.__zkOKb){window.__zkOKb=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isB())return;e.preventDefault();if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0})}
function ctl(on){let c=$z('bctl');if(c&&c.dataset.own!=='blocks'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='bctl';c.dataset.own='blocks';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('\uD83D\uDCAC','e','interact'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
// ---------------- physics (Origin movement model) ----------------
const solidB=b=>b.st==='conf'||b.st==='cand'||(b.st==='stale'&&b.sd<1.5);
function plats(){const L=GR.slice();BK.forEach(b=>{if(solidB(b))L.push([b.x,b.w,b.y,b])});return L}
function support(){let s=-999;for(const [x,w,t] of plats())if(Q.px+HW>x&&Q.px-HW<x+w&&Q.py>=t-2&&t>s)s=t;return s}
function upd(dt){const live=Q.st==='play',dir=live?K.r-K.l:0,tv=dir*SPD;
 Q.vx+=Math.sign(tv-Q.vx)*Math.min(Math.abs(tv-Q.vx),(Q.gr?2800:1900)*dt);if(dir)Q.face=dir;
 if(K.jp){K.jp=0;Q.buf=.12}Q.buf-=dt;Q.coy=Q.gr?.1:Q.coy-dt;
 if(live&&Q.buf>0&&Q.coy>0){Q.vy=JMP;Q.gr=0;Q.coy=0;Q.buf=0;Q.sq=-1;dust(8);sfx('interaction')}
 if(live&&!K.j&&Q.vy>0)Q.vy-=GRAV*1.2*dt;
 Q.px+=Q.vx*dt;const hi=Q.gate?LW-HW:GATE-HW-6;if(Q.px>hi){Q.px=hi;Q.vx=0}if(Q.px<HW){Q.px=HW;Q.vx=0}
 const y0=Q.py;Q.vy-=GRAV*dt;Q.py+=Q.vy*dt;let on=0;Q.stand=null;
 for(const [x,w,t,b] of plats())if(Q.vy<=0&&y0>=t-2&&Q.py<=t&&Q.px+HW>x&&Q.px-HW<x+w){Q.py=t;on=1;Q.stand=b||null}
 if(on){if(Q.vy<-420){Q.sq=1;dust(10);sfx('step')}Q.vy=0;if(Q.py>-100&&(!Q.stand||Q.stand.st==='conf')){Q.safe={x:Q.px,y:Q.py}}}Q.gr=on;
 const gulf=Q.px>3280&&Q.px<4010?-480:-130;if(Q.py<gulf){Q.px=Q.safe.x;Q.py=Q.safe.y;Q.vx=Q.vy=0;spark(Q.px,Q.py+40,IK.blue,16);sfx('interaction');if(!Q.said.f){Q.said.f=1;say('THE GULF','The road continues where history does. You are back on the last block that was kept.',5,IK.blue)}}
 if(Q.gr&&Math.abs(Q.vx)>60&&(Q.step-=dt)<=0){Q.step=.26;sfx('step');if(Math.random()<.6)dust(1)}}
// ---------------- the observatory decides ----------------
function reorg(f,b){const p=f.par;Q.px=p.x+80;Q.py=p.y;Q.vx=Q.vy=0;Q.reorgs++;spark(b.x+80,b.y+40,IK.dust,26);spark(Q.px,Q.py+40,IK.blue,18);sfx('incorrect');say('NOT CONTINUED','That branch was real. It was valid-looking. The network just did not continue it. You are back at its parent.',7,IK.gold)}
function resolve(f){f.res=1;const w=f.B,l=f.A;w.st='conf';l.st='stale';l.sd=0;sfx('correct');spark(w.x+80,w.y+30,IK.cy,30);if(!reduce)wow=Math.max(wow,.6);
 if(Q.stand===w){say('KEPT','Your branch became the road. Everything built on it from here is history. IN ZCASH: nodes follow the valid chain with the most accumulated work, not the block that arrived first.',10,IK.ok);if(f.id===2&&f.early){Q.pred=1;sfx('collectible');Q.fore=1}}else if(Q.stand!==l)say('ONE ROAD','One candidate is continued. The other goes dark.',4,IK.cy)}
function stepWorld(dt){Q.t+=dt;
 BK.forEach(b=>{if(b.st==='hid'&&!b.fork&&(b.after===null||F[b.after].res)&&Q.px>b.trig){b.st='cand';b.wk=0;sfx('rise');spark(b.x+80,b.y+300,IK.blue,10)}
  if(b.st==='cand'&&!b.fork){b.wk+=b.rate*dt;if(b.wk>=1){b.wk=1;b.st='conf';sfx(b.n===1?'core-activate':'correct');spark(b.x+80,b.y+30,IK.cy,16);if(b.n===1)say('IT LINKED','Look at the cable: it points back to the block before it. IN ZCASH: each block header contains the hash of the previous block, so changing an old block would break every link after it.',11,IK.cy)}}
  if(b.st==='stale')b.sd+=dt});
 F.forEach(f=>{if(f.t<0&&Q.px>f.trig){f.t=0;f.A.st='cand';sfx('rise');spark(f.A.x+80,f.A.y+300,IK.blue,12);if(f.id===1)Q.said.f1=1;if(!f.bd){f.B.st='cand';spark(f.B.x+80,f.B.y+300,IK.blue,12)}}
  if(f.t>=0&&!f.res){f.t+=dt;if(f.t>=f.bd&&f.B.st==='hid'){f.B.st='cand';sfx('rise');spark(f.B.x+80,f.B.y+300,IK.blue,12)}f.A.wk=Math.min(1,f.fa(f.t));f.B.wk=Math.min(1,f.fb(f.t));
   if(f.id===2&&Q.stand===f.B&&f.t>=3&&f.t<6)f.early=1;if(f.A.wk>=1||f.B.wk>=1)resolve(f)}
  if(f.res&&f.A.st==='stale'&&f.A.sd>1.4&&Q.stand===f.A&&Q.py>=f.A.y-4&&!f.rg){f.rg=1;reorg(f,f.A)}})}
// ---------------- interaction ----------------
function items(){const L=[{k:'npc',x:Q.nx,y:Q.ny},{k:'con',x:CON,y:-30},{k:'forg',x:FORG,y:-30},{k:'ver',x:VER,y:-30},{k:'scope',x:3640,y:390},{k:'pl',i:0,x:3420,y:-330},{k:'pl',i:1,x:3600,y:-330},{k:'pl',i:2,x:3780,y:-330}];
 BK.forEach(b=>{if(b.st==='cand'||b.st==='conf'||b.st==='stale')L.push({k:'blk',b,x:b.x+80,y:b.y})});return L}
const PLQ=['BRANCH 0412 \u2014 Two candidates, one parent. The lighter one lost. Nothing was wrong with it.','BRANCH 0877 \u2014 It arrived first, and brighter. It was continued by no one.','BRANCH 1190 \u2014 The longest road is not the oldest road. It is the road with the most work behind it.'];
function npcLines(){if(Q.final)return['You weren\u2019t watching blocks arrive. You were watching history decide what to remember.','Look at it. Every link, from the first one all the way to the tip.','That is all a chain is. A memory that agreed to point backwards.','Somewhere under this road is a branch nobody followed. It was still real.','One more thing. Wallets wait for a few more blocks on top of a payment before they call it final. Those are confirmations.'];
 if(F[1].res&&Q.pred)return['You didn\u2019t wait for it. You already knew where the work was going.','You read the chain instead of the blocks. That is the whole trick, that.','Most people watch the sky and guess. You watched the weight.','You were right early. Remember that it felt like nothing at all.'];
 if(F[1].res)return['Brighter, first, taller. None of those were the reason.','It was the heaviest one. That is all it ever was.','You can see which road they kept. It is the one under your feet now.','The other one went dark the way they always do. Quietly.'];
 if(F[1].t>=0)return['Don\u2019t watch what arrives. Watch what is carried to it.','One of these is already further along. It does not look it.','Arrival is cheap. Arrival means almost nothing.','The work is the message. Everything else is just a shape.'];
 if(Q.gate)return['It costs a great deal to make. It costs almost nothing to check.','That is the whole trick. Expensive to be real, cheap to prove.','Anyone can stand at that gate and know it is honest.','Most of what we trust is built exactly this way.','Zcash miners solve a puzzle called Equihash. A solution is hard to find and instant to check, and a new block lands about every seventy-five seconds.'];
 if(F[0].res)return['I have watched this for years. I still ask why that one.','The one that lost was valid. I want to be clear about that.','It will sit up there, dusty, for as long as this road stands.','The Engine knows, up the road. Why that one went in is the harder question.'];
 if(F[0].t>=0)return['Both are real. Only one will be continued.','Two candidates. Same parent. Neither of them is a lie yet.','Watch which one keeps taking work. It is not a judgement. It is weight.','Everything built after this goes on top of one of them. Only one.'];
 if(BK[1].st==='conf')return['Watch.','See that cable? The block points back to the one before it. Nothing gets in between.','A block is mostly a promise about the block behind it.','Look at it settle. That is what agreement looks like from here.'];
 return['It happened again.','Every so often, two blocks claim the same parent. Only one gets to be history.','The other one was not wrong. That is the part nobody likes.','I have been counting these since before you got here.']}
function interact(){if(Q.st!=='play')return;const n=Q.near;if(!n)return;sfx('interaction');const k=n.k;
 if(k==='npc')say('HIALDU',npcLines(),7,IK.gold);
 if(k==='blk'){const b=n.b;if(b.gen)say('GENESIS','No parent. Everything after it points back to this.',5,IK.cy);else if(b.st==='conf')say('BLOCK '+b.n,'It points back to block '+(b.n-1)+'. Linked, in order. Nothing can be slipped in between.',5,IK.cy);
  else if(b.st==='stale')say('A BRANCH THAT WAS NOT CONTINUED','Real. Valid-looking. Not continued. It will stay here, dusty, as proof it was possible.',6,IK.gold);
  else say('CANDIDATE','It claims to follow block '+(b.n-1)+'. It looks valid. Whether it becomes history is not up to it.',5,IK.cy)}
 if(k==='con'){const e=Q.eng;if(e.done)say('THE WORK ENGINE','The block already carries its work.',3,IK.dim);else if(e.run)say('THE WORK ENGINE','Still trying. Most attempts fail.',3,IK.dim);else{e.run=1;e.t=0;sfx('core-activate');say('THE WORK ENGINE WAKES','A candidate is lowered into the hopper. Watch what the machine has to do to it.',6,IK.cy)}}
 if(k==='forg'){Q.forg=1;sfx('incorrect');spark(FORG,-10,IK.bad,16);say('AN UNWORKED BLOCK','It looks complete. It never did the work. It is turned away without ceremony.',6,IK.bad)}
 if(k==='ver'){if(!Q.eng.done)say('THE VERIFIER','Nothing to check yet.',3,IK.dim);else if(!Q.gate){Q.gate=1;sfx('correct');spark(VER,0,IK.ok,30);say('VALID','Doing the work took a long time. Checking it took no time at all. The gate opens. IN ZCASH: every full node, such as Zebra, checks each block against the rules for itself.',11,IK.ok)}else say('THE VERIFIER','Valid. It was valid the moment it looked.',3,IK.ok)}
 if(k==='scope'){if(!Q.scope){Q.scope=1;sfx('collectible')}say('THE OBSERVATION LENS','From up here the road is only a line. Far to the east, a platform waits above everything. Below, in the dark, branches that nobody continued.',9,IK.gold)}
 if(k==='pl'){Q.arch|=1<<n.i;sfx('collectible');say('THE ARCHIVE OF ABANDONED BRANCHES',PLQ[n.i],9,IK.gold)}}
function area(){const x=Q.px;return Q.py<-200?'THE ARCHIVE OF ABANDONED BRANCHES':x<900?'THE TERRACE':x<2900?'THE CHAIN ROAD':x<4200?'THE WORK ENGINE':x<6100?'THE RISING ROAD':'THE OBSERVATION PLATFORM'}
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-Q.last)/1000||.016);Q.last=now;
 if(tx!==Q.ltx&&tx>w*.99){back();return}
 upd(dt);stepWorld(dt);Q.sq+=(0-Q.sq)*Math.min(1,dt*12);if(Q.mt>0)Q.mt-=dt;
 const e=Q.eng;if(e.run&&!e.done){e.t+=dt;if(e.t>7.5){e.done=1;sfx('correct');sfx('card-reveal');spark(ENGX,100,'#fff',50);if(!reduce)wow=1;say('PROOF OF WORK','After a great many failed attempts, one succeeded. The block now carries evidence of effort. Anyone can check it. IN ZCASH: the proof-of-work algorithm is Equihash. Miners keep trying until one finds a valid solution and earns that block\'s reward (the subsidy plus fees), and difficulty adjusts to keep blocks coming about every 75 seconds, a pace set by the Blossom upgrade in 2019.',18,IK.cy)}}
 // the Watcher follows the story along the road
 Q.nx=Q.final?6340:Q.px>4300?4100:Q.px>2800?3120:420;Q.ny=Q.nx>6000?230:Q.nx>2900?-30:0;
 if(!Q.said.a&&Q.t>1.2){Q.said.a=1;say('HIALDU','It happened again.',4,IK.gold)}
 // the final: the whole chain lights, genesis to tip
 if(!Q.final&&Q.px>OBS+120&&Q.py>=225){Q.final=1;Q.ft=0;sfx('core-activate');if(!reduce)wow=1}
 if(Q.final){Q.ft+=dt;const n=BK.filter(b=>b.st==='conf').length;if(Q.ft>1.5+n*.35&&!Q.exitOpen){Q.exitOpen=1;sfx('card-reveal');fact('A blockchain is a linked history: every block points back to the one before it. Many candidate blocks can exist, but the network follows one chain under shared rules. Zcash uses Proof of Work as part of how it decides which blocks count. New blocks arrive about every 75 seconds, and each added block on top of a payment is one more confirmation.')}}
 if(Q.exitOpen&&!Q.done&&Q.st==='play'&&Math.abs(Q.px-EXX)<55&&Q.py>=225){Q.done=1;Q.st='done';spark(EXX,330,'#fff',50);if(!reduce)wow=1;sfx('collectible');setTimeout(()=>{if(!Q.on)return;if(S.done.blocks){fact('\u2713 ALREADY DISCOVERED');setTimeout(back,2800)}else complete()},900)}
 const nc=BK.filter(b=>b.st==='conf').length;const tg=.12+.5*Math.min(1,nc/14)+.2*e.done+.18*Q.final;Q.aw+=(tg-Q.aw)*Math.min(1,dt*1.5);
 const vw=w/U,cg=Q.px-vw*.42+Q.face*60;Q.cx+=(cg-Q.cx)*(1-Math.exp(-5*dt));Q.cx=Math.max(0,Math.min(LW-vw,Q.cx));
 const cyT=Q.py>180?Q.py-180:Q.py<-60?Q.py+60:0;Q.cy+=(cyT-Q.cy)*(1-Math.exp(-3*dt));
 let b=null,bd=120;items().forEach(o=>{const d=Math.hypot(Q.px-o.x,(Q.py-o.y)*.5);if(d<bd&&Q.st==='play'){bd=d;b=o}});Q.near=b;
 if(K.e){K.e=0;if(Q.dlg&&Q.mt>0){if(Q.dlg.i<Q.dlg.L.length-1){Q.dlg.i++;Q.msg.s=Q.dlg.L[Q.dlg.i];Q.mt=7;sfx('interaction')}else{Q.dlg=null;Q.mt=0}}else if(Q.mt>0&&!Q.near)Q.mt=0;else interact()}
 if(Q.px>400&&Q.area!==area()){Q.area=area();Q.at=3}Q.at=Math.max(0,Q.at-dt);
 Q.vp=Q.vp.filter(q=>(q.l-=dt)>0);Q.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});
 ax=X(Q.px);tx=Q.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}
// ---------------- drawing ----------------
function gear(x,y,r,t,c,teeth=12,lw=3){g2.save();g2.translate(x,y);g2.rotate(t);g2.strokeStyle=c;g2.lineWidth=lw*U;g2.beginPath();for(let i=0;i<teeth*2;i++){const a=i/(teeth*2)*6.2832,rr_=i%2?r*.86:r;g2.lineTo(Math.cos(a)*rr_,Math.sin(a)*rr_)}g2.closePath();g2.stroke();g2.beginPath();g2.arc(0,0,r*.45,0,7);g2.stroke();g2.restore()}
function cable(ax_,ay,bx,by,c,lw,t,rate){g2.strokeStyle=c;g2.lineWidth=lw*U;g2.beginPath();g2.moveTo(X(ax_),Y(ay));g2.quadraticCurveTo(X((ax_+bx)/2),Y(Math.max(ay,by)+60),X(bx),Y(by));g2.stroke();
 if(rate>0)for(let i=0;i<4;i++){const u=((t*rate*.6+i/4)%1),px=(1-u)*(1-u)*ax_+2*u*(1-u)*(ax_+bx)/2+u*u*bx,py=(1-u)*(1-u)*ay+2*u*(1-u)*(Math.max(ay,by)+60)+u*u*by;ci(X(px),Y(py),3*U,'#fff',.9)}}
function block(b,t){const x=b.x,y=b.y,w=b.w,st=b.st,a=st==='stale'?Math.max(.18,.8-b.sd*.3):st==='cand'?.7+.2*Math.sin(t*5+b.x):1,glow=st==='conf'?Math.min(1,.4+Q.aw):st==='cand'?.3+b.wk*.4:0,fall=st==='cand'&&b.wk<.02?0:0;
 const col=st==='stale'?IK.dust:st==='conf'?IK.cy:IK.blue;
 g2.globalAlpha=a;rr(x,y,w,26,st==='stale'?'#262a3c':'#1a2650');rr(x,y,w,4,col);rr(x+w,y,14,26,st==='stale'?'#1c1f2e':'#101a40');
 g2.fillStyle=st==='stale'?'#2d3146':'#223070';g2.beginPath();g2.moveTo(X(x),Y(y));g2.lineTo(X(x+14),Y(y+12));g2.lineTo(X(x+w+14),Y(y+12));g2.lineTo(X(x+w),Y(y));g2.fill();
 if(glow>0)ci(X(x+w/2),Y(y+12),(70+glow*50)*U,col,glow*.16);
 if(st!=='stale'){for(let i=0;i<4;i++)rr(x+14+i*34,y-4,24,3,rgba(IK.white,.25+glow*.4))}else{for(let i=0;i<6;i++)rr(x+10+i*24,y+2,8,2,'#4a4e63')}
 g2.globalAlpha=1;
 if(st==='cand'&&!b.after){/* work gauge: a ring that fills with what the sky is sending */const cx_=X(x+w/2),cy_=Y(y+90);g2.strokeStyle='#ffffff22';g2.lineWidth=5*U;g2.beginPath();g2.arc(cx_,cy_,22*U,0,7);g2.stroke();g2.strokeStyle=IK.cy;g2.beginPath();g2.arc(cx_,cy_,22*U,-1.57,-1.57+6.283*b.wk);g2.stroke();gear(cx_,cy_,12*U,t*(1+b.wk*4),IK.steel,6,1.5)}}
const Zp=window.ZKP;
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
function bStreams(t){if(!Zp)return;const a=Q.aw,c=Q.cx,y0=Y(0);g2.save();                    // data streams rising behind the towers, brighter as the chain wakes
 for(let k=-1;k<9;k++){const wx=k*430+Zp.hash(k*2.2)*160,sx=(wx-c*.16)*U;if(sx<-20||sx>W_+20)continue;g2.globalAlpha=.07+a*.1;g2.fillStyle=IK.blue;g2.fillRect(sx,0,1.5*U,y0);
  for(let q=0;q<6;q++){const u=((t*(.08+.03*(k%3))+q/6+Zp.hash(k+q))%1);g2.globalAlpha=(.25+a*.5)*Math.sin(u*3.14);g2.fillStyle=q%2?IK.cy:IK.white;g2.fillRect(sx-U,y0*(1-u),3.5*U,5*U)}}
 g2.globalAlpha=1;Zp.glow(g2,W_*.5,y0+40*U,W_*.7,70*U,IK.blue,.1+a*.12);g2.restore()}
function bTerrace(t){if(!Zp)return;const x0=Q.cx-60,x1=Q.cx+W_/U+60;if(x0>900)return;const l=Math.max(0,x0),r=Math.min(900,x1);    // paving, rivets and truss under the genesis terrace
 g2.save();g2.translate(-Q.cx*U,GY+Q.cy*U);g2.scale(U,U);g2.strokeStyle='#000';g2.lineWidth=1;g2.globalAlpha=.45;g2.beginPath();g2.moveTo(l,18);g2.lineTo(r,18);for(let wx=Math.ceil(l/90)*90;wx<r;wx+=90){g2.moveTo(wx,4);g2.lineTo(wx,40)}g2.stroke();
 g2.strokeStyle=IK.blue;g2.globalAlpha=.16;g2.beginPath();for(let wx=Math.ceil(l/60)*60;wx<r;wx+=60){g2.moveTo(wx,40);g2.lineTo(wx+60,120);g2.moveTo(wx+60,40);g2.lineTo(wx,120)}g2.stroke();
 g2.fillStyle=IK.cy;for(let wx=Math.ceil(l/90)*90;wx<r;wx+=90){g2.globalAlpha=.3+.3*Math.abs(Math.sin(t*1.4+wx*.05));g2.fillRect(wx-1.5,11,3,3)}g2.globalAlpha=.4;g2.fillStyle=IK.steel;g2.fillRect(l,0,r-l,1.2);g2.restore()}
function scene(w,h,gy,t,p){const a=Q.aw,c=Q.cx;bStreams(t);
 // far: the Sky Engine, towers, domes
 gear(w*.74-c*U*.03,gy-h*.62+Q.cy*U*.3,h*.34,t*.06,rgba(IK.blue,.12+a*.35),24,5);gear(w*.74-c*U*.03,gy-h*.62+Q.cy*U*.3,h*.2,-t*.1,rgba(IK.steel,.1+a*.3),14,4);gear(w*.3-c*U*.05,gy-h*.8+Q.cy*U*.3,h*.18,t*.08,rgba(IK.blue,.08+a*.25),16,3);
 for(let k=0;k<3;k++){const sp=.1+.2*k,gap=300+k*110,col=['#050816','#080d26','#0c1438'][k];for(let i=-1;i<w/(gap*U)+3;i++){const x=i*gap*U-((c*sp*U)%(gap*U)),hh=(340+k*150+((i*47)%90))*U;rc(x,gy+Q.cy*U*(.2+k*.1)-hh,(gap-70)*U,hh+800,col);rc(x,gy+Q.cy*U*(.2+k*.1)-hh,2.5*U,hh,rgba(IK.blue,.1+a*.4));for(let r=0;r<hh/(54*U);r++)if((i*7+r*3+k)%5===0)rc(x+12*U,gy+Q.cy*U*(.2+k*.1)-hh+r*54*U,6*U,6*U,rgba(IK.cy,.25+a*.5))}}
 // the gulf below the road: deep, cold, far lights
 rc(0,Y(-60),w,h,'#02030a');for(let i=0;i<30;i++){rc(((i*211+t*3)%(w+200))-100,Y(-90-(i*47)%260),2,2,rgba(IK.blue,.2+(i%3)*.1))}rc(0,Y(-60),w,3,rgba(IK.blue,.12+a*.3));
 // work descends from the sky to whichever candidate is being worked on: the thicker the beam, the more work
 F.forEach(f=>{if(f.t<0||f.res)return;[f.A,f.B].forEach(b=>{if(b.st!=='cand')return;const bx=X(b.x+80),by=Y(b.y+120);g2.strokeStyle=rgba(IK.cy,.15+b.wk*.5);g2.lineWidth=(2+b.wk*9)*U;g2.beginPath();g2.moveTo(bx+(b.side==='A'?-60:60)*U,0);g2.lineTo(bx,by);g2.stroke();for(let i=0;i<5;i++){const u=((t*(.5+b.wk*1.4)+i/5)%1);ci(bx+(b.side==='A'?-60:60)*U*(1-u),by*u,3*U,'#fff',.9)}})});
 // THE TERRACE and Genesis
 GR.slice(0,1).forEach(([x,wd,top])=>{rr(x,top,wd,300,'#0a1030');rr(x,top,wd,4,rgba(IK.blue,.5))});for(let i=0;i<6;i++){rr(140+i*130,170+(i%2)*40,70,4,rgba(IK.steel,.2));rr(150+i*130,0,6,170+(i%2)*40,rgba(IK.steel,.1))}
 // links: each block's cable goes back to its parent
 BK.forEach(b=>{if(!b.p||b.st==='hid')return;const stale=b.st==='stale';cable(b.p.x+b.p.w,b.p.y+8,b.x,b.y+8,stale?'#3a3e52':rgba(IK.cy,.4+a*.4),stale?1.5:3,t,stale?0:(b.st==='conf'?.5:.25))});
 BK.forEach(b=>{if(b.st!=='hid')block(b,t)});
 {const g=BK[0];if(g){rr(g.x+g.w/2-4,60,8,60,IK.cy)}}
 // THE WORK ENGINE hall
 const e=Q.eng;rr(2960,-30,1200,6,rgba(IK.blue,.35));
 {const ex=ENGX,ey=150;gear(X(ex),Y(ey),150*U,t*(e.run&&!e.done?.8:.08),rgba(IK.blue,.35+(e.run?.4:0)),18,6);gear(X(ex),Y(ey),96*U,-t*(e.run&&!e.done?1.4:.1),rgba(IK.steel,.4),12,4);gear(X(ex+170),Y(ey+130),60*U,t*(e.run&&!e.done?1.8:.1),rgba(IK.cy,.4),9,3);
  rr(ex-60,ey-150,120,70,'#0b1233');rr(ex-24,-30+110,48,30,e.done?IK.cy:'#1a2650');g2.strokeStyle=rgba(IK.cy,.5);g2.lineWidth=2;g2.strokeRect(X(ex-60),Y(ey-80),120*U,70*U);
  if(e.run&&!e.done){for(let i=0;i<32;i++){const hit=Math.sin(i*12.9898+Math.floor(t*14)*78.233)*43758>0.9999;ci(X(ex-90+(i%8)*26),Y(ey-130+Math.floor(i/8)*16),3*U,hit?IK.white:rgba(IK.bad,.7),.9)}tx_('ATTEMPTS',X(ex),Y(ey-170),IK.dim,MONO(11))}
  if(e.done){ci(X(ex),Y(ey),120*U,'#fff',.1+.06*Math.sin(t*4));tx_('\u2713 WORKED',X(ex),Y(ey-170),IK.ok,MONO(12))}}
 rr(CON-26,60,52,90,'#101a40');rr(CON-20,138,40,28,'#030612');tx_(Q.eng.done?'\u2713':Q.eng.run?'...':'\u25B6',X(CON),Y(112),Q.eng.done?IK.ok:IK.cy,MONO(12));
 rr(FORG-26,-30+10,52,48,'#141a36');g2.strokeStyle=rgba(IK.bad,.5);g2.lineWidth=2;g2.strokeRect(X(FORG-26),Y(28),52*U,48*U);tx_(Q.forg?'\u2715':'?',X(FORG),Y(-8),IK.bad,MONO(14));
 rr(VER-26,60,52,90,'#101a40');rr(VER-20,138,40,28,'#030612');ci(X(VER),Y(118),9*U,Q.gate?IK.ok:Q.eng.done?IK.cy:'#2a3560',1);
 if(!Q.gate){rr(GATE-14,200,28,230,'#101a40');for(let i=0;i<6;i++)rr(GATE-10,200-i*0,4,230,rgba(IK.blue,.5))}
 // the Archive of Abandoned Branches (optional, below)
 rr(3300,-330+170,700,4,rgba(IK.dust,.4));for(let i=0;i<3;i++){const x=3420+i*180;rr(x-40,-330+110,80,60,'#171b2e');rr(x-34,-330+104,68,4,IK.dust);for(let k=0;k<5;k++)rr(x-28+k*12,-330+90,6,2,'#4a4e63');tx_('\u2715',X(x),Y(-330+60),'#4a4e63',MONO(16))}
 // Observatory balcony lens
 rr(3640-18,390+60,36,60,'#141a36');ci(X(3640),Y(390+84),10*U,Q.scope?IK.gold:IK.cy,.9);
 // the Observation Platform + exit door
 {const eo=Q.exitOpen;rr(EXX-45,230+190,90,190,eo?'#fff':'#05070f');rr(EXX-38,230+182,76,182,eo?rgba(IK.cy,.7):'#0b1230');g2.strokeStyle=eo?'#fff':rgba(IK.blue,.5);g2.lineWidth=3;g2.strokeRect(X(EXX-45),Y(230+190),90*U,190*U);if(eo)ci(X(EXX),Y(230+95),130*U,IK.cy,.2);
  if(Q.final){const cn=BK.filter(b=>b.st==='conf');cn.forEach((b,i)=>{const lit=Q.ft>i*.35+.6,u=Math.max(0,Math.min(1,(Q.ft-.6-i*.35)*3));if(lit){ci(X(b.x+80),Y(b.y+10),(80+60*(1-u))*U,'#fff',.35*u+.1);rr(b.x+60,b.y+300,40,300,rgba(IK.cy,.12*u))}});rr(OBS+280,230+520,6,520,rgba(IK.cy,.3));ring(X(OBS+280),Y(230+380),150*U,.1,rgba(IK.cy,.6),t)}}
 // Hialdu, the Watcher
 {const x=X(Q.nx),y=Y(Q.ny),bob=Math.sin(t*2)*3*U;
  if(HD&&HD.width){const h_=PH*U*1.05,w_=h_*HD.width/HD.height;
   g2.fillStyle='#0008';g2.beginPath();g2.ellipse(x,y+3,w_*.2,5*U,0,0,7);g2.fill();
   g2.save();g2.shadowColor=HD_PAL[0];g2.shadowBlur=16;g2.imageSmoothingEnabled=false;g2.translate(x,y-bob);g2.scale(Q.px<Q.nx?-1:1,1);g2.drawImage(HD,-w_/2,-h_,w_,h_);g2.restore();
   tx_('HIALDU',x,y-h_-8,HD_PAL[2]||IK.gold,MONO(11));
  }else{g2.fillStyle='#0a1030';g2.beginPath();g2.moveTo(x-16*U,y);g2.lineTo(x-9*U,y-72*U+bob);g2.lineTo(x+9*U,y-72*U+bob);g2.lineTo(x+16*U,y);g2.fill();g2.strokeStyle=rgba(IK.gold,.7);g2.lineWidth=2;g2.stroke();ci(x,y-62*U+bob,6*U,IK.white,1);g2.strokeStyle=IK.gold;g2.beginPath();g2.moveTo(x+6*U,y-52*U+bob);g2.lineTo(x+26*U,y-62*U+bob);g2.stroke()}}
 for(let i=0;i<46;i++){const x=((i*173+t*6*(i%4+1))%(w+200))-100,y=gy*(((i*61)%100)/100)+Math.sin(t+i)*9;rc(x,y,2,2,'#cfd8f0'+(i%3?'22':'44'))}}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(Q.px),sy=Y(Q.py),idle=Q.gr&&Math.abs(Q.vx)<20?Math.sin(T*3)*.012:0,wS=1+.22*Q.sq-idle,hS=1-.22*Q.sq+idle,sp=support();
 if(sp>-900){g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(sp)+3,aw*.38,5*U,0,0,7);g2.fill()}
 g2.save();g2.translate(sx,sy);g2.scale(Q.face*wS,hS);g2.imageSmoothingEnabled=false;g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();if(Q.fore)ci(sx,sy-ph*.5,ph*.8,IK.gold,.07)}
function drawFront(p){Q.vp.forEach(q=>{g2.globalAlpha=Math.max(0,q.l);rc(X(q.x),Y(q.y),q.s*U,q.s*U,q.c)});g2.globalAlpha=1}
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
function drawHud(p){g2.textAlign='center';if(Q.at>0&&Q.area){g2.globalAlpha=Math.min(1,Q.at);tx_(Q.area,W_/2,34,'#ece8df',MONO(15));g2.globalAlpha=1}
 // the chain, as a strip: kept blocks light up, branches that were not continued stay dusty
 {const list=BK.filter(b=>b.st==='conf'||b.st==='stale');let x=12;g2.textAlign='left';list.forEach(b=>{rc(x,12,14,14,b.st==='conf'?IK.cy:'#3a3e52');x+=18});}
 if(Q.near&&Q.mt<=0){const o=Q.near,lab={npc:'[E] listen',blk:'[E] inspect',con:'[E] wake the engine',forg:'[E] look',ver:'[E] verify',scope:'[E] look east',pl:'[E] read'}[o.k];tx_(coarse?'\u25C9':lab,X(o.x),Y(o.y+(o.k==='blk'?150:140)),'#e8f6ff',MONO(12))}
 if(Q.msg&&Q.mt>0){const m=Q.msg;g2.font=MONO(14);const ln=wrap(m.s,W_-32),B=dlgBox(W_,H_,coarse,ln,{max:660});g2.save();g2.globalAlpha=Math.min(1,Q.mt*2);rc(B.bx,B.by,B.mw,B.bh,'#05060ff2');g2.strokeStyle=m.c;g2.lineWidth=2;g2.strokeRect(B.bx,B.by,B.mw,B.bh);
  g2.textAlign='left';g2.fillStyle=m.c;g2.font="700 "+Math.round(Math.max(18,22*U))+"px 'Abril Fatface',serif";g2.fillText(m.h,B.bx+16,B.by+30);g2.fillStyle='#ece8df';g2.font=MONO(14);B.win.forEach((l,i)=>g2.fillText(l,B.bx+16,B.by+54+i*B.lh));
  if(Q.dlg){const more=Q.dlg.i<Q.dlg.L.length-1;g2.textAlign='right';g2.fillStyle=m.c;g2.font=MONO(11);g2.fillText(coarse?(B.more?'\u25BC MORE':'\u25C9'):(more?'[E] more \u203A':'\u2713'),B.bx+B.mw-16,B.by+30);g2.textAlign='left';g2.fillStyle=IK.dim;g2.fillText((Q.dlg.i+1)+'/'+Q.dlg.L.length,B.bx+B.mw-16,B.by+B.bh-8)}
  g2.restore()}}
// ---------------- wiring into the shared engine ----------------
DEC.blocks=function(w,h,gy,t,p){if(!isB())return;xFar(Q.cx,Y(0),t,xmix('#1a2347',p.pr,.25),xmix(IK.blue,p.ac,.3),600);scene(w,h,gy,t,p);bTerrace(t);xMid(Q.cx,Y(0),t,[IK.cy,IK.blue,p.pr],14)};
const _bgo=bg;bg=function(w,h,gy,p){if(isB()){frame(w,h,gy);cam=Q.cx*U;_bgo(w,h,gy+Q.cy*U*.3,p)}else _bgo(w,h,gy,p)};
const _avo=avatar;avatar=function(w,h,gy,p){if(isB()){drawPlayer(p);drawFront(p);xFront(Q.cx,T,[IK.blue,IK.cy,p.pr],LW,0);drawHud(p)}else _avo(w,h,gy,p)};
const _sto=startWorld;startWorld=function(i){const me=W[i].id==='blocks';if(me)init();_sto(i);if(me)$z('wf').innerHTML=''};
const _spo=stopWorld;stopWorld=function(){if(Q)Q.on=0;ctl(0);_spo()};
});

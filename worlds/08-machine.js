/* ZKSCAPE world 08: THE MACHINE. The final adventure world. Same engine hooks + movement model as the other worlds
   (bg / avatar / startWorld / stopWorld wrappers, own physics, own touch controls). Only this file is new. All state is local to V.
   One machine, one object. A CELL (a shielded note) is carried through the whole thing. Nothing here is a station you "activate":
   every part only works because something the player did to the Cell in another part.
   Loop: ARRIVE (everything works, nothing is connected) -> a pulse from GENESIS wakes the RESERVOIR (state) -> taking a Cell wakes the GAZE (anything open in its
   beam is READ) -> Q raises the SHIELD (hidden from the Gaze; private marks resolve; privacy fields admit only the hidden) -> the PROVER proves a public
   CONDITION about the Cell without the Cell ever leaving the booth -> the PROOF is carried to the GATE, which wants AUTHORITY (the glass key only LOOKS; the spend key
   lives underground) and checks the NULLIFIER WALL (state) -> the transition mints a BLOCK that becomes a platform over the chasm (chain) -> after block 2 the machine
   ADAPTS (new rule, restricted old pool, a one-way counted TURNSTILE, more observers) -> block 3 completes the bridge -> the HEART in the Core -> the whole machine lights
   -> walk out -> look back -> complete().
   Optional: the FIRST DESIGNS (five failed machines, each missing exactly one layer) behind a privacy field, which gives the BLUEPRINT.
   Mastery: a chain in which no Cell was ever read (every block sealed), then audit it with the glass key at the Core: private AND auditable.
   Stylized metaphor, not a real protocol simulation. No other world is touched. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'machine',n:'MACHINE',title:'THE MACHINE',sub:'What does it need from you?',desc:'A vast machine beneath the ZKSCAPE. Every part of it works. None of it is connected. Work out what it needs.',q:'Nothing was missing. The pieces were never connected.',
 sort:[['',0]], /* engine flag only (as in the other adventure worlds): no default hotspots, this world runs its own loop */
 deep:'Zcash is not one trick. Privacy protects information. Zero-knowledge proofs establish facts without exposing secrets. Authorization controls who can act. State records what has happened. The blockchain preserves shared history. And the protocol can adapt without losing its purpose. This world is a gameplay metaphor, not a protocol specification.'});
A.machine='Machine Core';
TH.machine={sky:['#02030a','#0d1424'],moon:[.84,.15,.045,'#7f93b8'],mt:'#05070f',fog:'#3d5a8a',amb:'mote'};
GIANT.machine=function(w,h,gy,t,th,p,c,id,o,f){const a=V?V.aw:.1,cx=w*.7+o*1.4,cy=gy-h*.48;ring(cx,cy,h*.62,.025,f,t);ring(cx,cy,h*.44,-.04,p.pr,t);ring(cx,cy,h*.27,.06,p.ac,t);
 g2.globalAlpha=.05+.3*a;g2.strokeStyle=p.se;g2.lineWidth=3;g2.beginPath();g2.arc(cx,cy,h*.35,0,7);g2.stroke();g2.globalAlpha=1};
LM.machine=function(x,y,s,c,t,a,B){B();for(let i=0;i<16;i++){const q=i/16*6.2832+t*.3,r=i%2?s*.62:s*.8;hg.lineTo(Math.cos(q)*r,Math.sin(q)*r)}hg.closePath();hg.stroke();B();hg.arc(0,0,s*.3,0,7);hg.stroke();B();hg.moveTo(-s*.14,0);hg.lineTo(s*.14,0);hg.moveTo(0,-s*.14);hg.lineTo(0,s*.14);hg.stroke()};

// ======================= layout (x in world units, y = height of the top surface above the surface floor) =======================
const LW=11800,HW=30,PH=112,SPD=330,JMP=830,GRAV=2500,FL=-380;
const GA=[[0,6050],[7250,LW]];                         // surface ground segments; the chasm is between them
const SUB=[4000,6400];                                  // the Substrate: a hollow under the Gate
const JFX=560,PLINTH=1010,SOCK=1210,RESX=[2090,2210,2330,2450,2570,2690],NEWX=[3130,3210,3290,3370],BASIN=2800,TURN=2910,BOARD=3640,PED=3930,OUTS=4130;
const PSOCK=5230,LEVER=5400,GATE=5320,HATCH=5010,WALLX=5820,CHX=[6170,6530,6890],CHW=240,CORE0=7250,VIEWS=8230,HEART=8560,EXITX=9200,OUTX=10560,LOOKX=10720;
const MEM0=4660,MEM1=5500,EXH=[4570,4450,4330,4210,4100],IRONX=6000,PLAQ=5740;   // substrate: west privacy field, east privacy field, exhibits
const PLAT0=[[880,260,70],[2380,110,60],[2490,110,125],[2600,540,190],[8330,420,80]];   // one-way platforms on the surface (x,w,top)
const PLAT1=[[5900,250,FL+70]];
const OBS=[{ex:2050,ey:520,c0:2150,amp:480,per:6.2,ph:0,hw:150,ep:0},{ex:3050,ey:520,c0:3050,amp:420,per:7.4,ph:1.7,hw:150,ep:0},{ex:2650,ey:580,c0:2900,amp:270,per:4.4,ph:.4,hw:140,ep:1},{ex:6650,ey:620,c0:6650,amp:560,per:8,ph:2.2,hw:150,ep:1}];
const ZONES=[[0,'THE APPROACH'],[1560,'THE RESERVOIR'],[3380,'THE PROVING ROOM'],[4850,'THE GATE OF TRANSITIONS'],[6060,'THE SPINE'],[7260,'THE CORE'],[9210,'THE OUTSIDE']];
const IKC={stone:'#12162a',st2:'#1b2038',steel:'#2c3552',dim:'#3b4668',light:'#cfd8f0',gold:'#e4b15a',amber:'#ffb347',red:'#ff6a5a',ok:'#7ddea0',ink:'#05060f'};
let V=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,e:0,q:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-V.cx)*U,Y=y=>GY-(y-V.cy)*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),cc=(x,y,r,c,a)=>ci(X(x),Y(y),r*U,c,a),isM=()=>run&&cur&&cur.id==='machine'&&V&&V.on;
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixc=(a,b,t)=>{t=Math.max(0,Math.min(1,t));const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const rgba=(h,a)=>h+Math.round(Math.max(0,Math.min(1,a))*255).toString(16).padStart(2,'0'),cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),sm=(a,b,v)=>{const t=cl((v-a)/(b-a));return t*t*(3-2*t)};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace',MONOF=n=>'600 '+n+'px ui-monospace,Menlo,Consolas,monospace',T2=(s,x,y,c,n)=>tx_(s,X(x),Y(y),c,MONO(n));
const sfx=n=>{try{AM.sfx(n)}catch(e){}};
const onS=(x,pad)=>{const s=X(x);return s>-(pad||200)*U&&s<W_+(pad||200)*U};
const pl=(pts,c,a)=>{g2.globalAlpha=a==null?1:a;g2.fillStyle=c;g2.beginPath();pts.forEach((q,i)=>i?g2.lineTo(X(q[0]),Y(q[1])):g2.moveTo(X(q[0]),Y(q[1])));g2.closePath();g2.fill();g2.globalAlpha=1};
const ln=(a,b,c2,d,col,w,al)=>{g2.globalAlpha=al==null?1:al;g2.strokeStyle=col;g2.lineWidth=Math.max(1,w*U);g2.beginPath();g2.moveTo(X(a),Y(b));g2.lineTo(X(c2),Y(d));g2.stroke();g2.globalAlpha=1};
const gl=(x,y,r,col,a)=>{const sx=X(x),sy=Y(y),R=r*U;if(sx<-R||sx>W_+R||R<1)return;const g=g2.createRadialGradient(sx,sy,0,sx,sy,R);g.addColorStop(0,col);g.addColorStop(1,col+'00');g2.globalAlpha=a==null?1:a;g2.fillStyle=g;g2.fillRect(sx-R,sy-R,R*2,R*2);g2.globalAlpha=1};
const stroke=(x,y,w,h,c,lw,a)=>{g2.globalAlpha=a==null?1:a;g2.strokeStyle=c;g2.lineWidth=Math.max(1,(lw||2)*U);g2.strokeRect(X(x),Y(y),w*U,h*U);g2.globalAlpha=1};
const arc=(x,y,r,a0,a1,c,lw,al)=>{g2.globalAlpha=al==null?1:al;g2.strokeStyle=c;g2.lineWidth=Math.max(1,(lw||2)*U);g2.beginPath();g2.arc(X(x),Y(y),r*U,a0,a1);g2.stroke();g2.globalAlpha=1};
function wrap(s,mw){const l2=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){l2.push(l);l=w}else l=t});l2.push(l);return l2}
// ---- the recurring cast: the same sprites the other worlds use (silhouettes if a file is missing)
function loadNpc(src,pal){const o={img:null,pal:pal};const im=new Image();im.onload=()=>{try{const c=removeBg(im);c.complete=true;if(!c.width)c.width=im.width;if(!c.height)c.height=im.height;o.img=c;try{o.pal=extract(c)[0]}catch(e){}}catch(e){o.img=im}};im.onerror=()=>{};im.src=src;return o}
const NP={jeff:Object.assign(loadNpc('NPCs/jeff_clean.png',['#8fb0c9','#c8dce8','#a8c060']),{n:'Jeff',col:'#8fb0c9'}),ws:Object.assign(loadNpc('NPCs/winterspring_clean.png',['#caa6ff','#691fef','#ffeb57']),{n:'Winter Spring',col:'#caa6ff'}),
 hob:Object.assign(loadNpc('NPCs/mechanist_clean.png',['#ffb347','#b9803a','#5fe3d6']),{n:'Hob',col:'#ffb347'}),tender:{img:null,pal:['#e8a640'],n:'The Tender',col:'#e8a640'},watch:{img:null,pal:['#e4b15a'],n:'The Watcher',col:'#e4b15a'}};
const PROGRESS_KEYS=['gen','gaze','proofs','blocks','epoch','blue','fin'];
// ======================= state =======================
const rule=(v,ep)=>(ep==null?V.epoch:ep)>=1?v<=4:v>=5, ruleTxt=ep=>(ep==null?V.epoch:ep)>=1?'VALUE \u2264 4':'VALUE \u2265 5';
const LK=['priv','proof','auth','state','chain','adapt'];
function mInit(){
 V={on:1,px:150,py:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,sq:0,lay:0,cx:0,cy:0,zoom:1,zt:1,st:'play',last:performance.now(),step:0,t:0,lock:0,fade:null,vp:[],fl:[],msg:null,mt:0,dlg:null,near:null,area:'',at:0,ltx:0,safe:{x:150,y:0},
  shield:0,shT:0,keys:{glass:0,iron:0},hand:null,gen:0,pul:null,gaze:0,gazeT:0,read:0,readN:0,inBeam:0,
  cells:[{id:'A',v:3,pool:0,at:'res',slot:1,exposed:0,clean:1,spent:0,known:0},{id:'B',v:7,pool:0,at:'res',slot:2,exposed:0,clean:1,spent:0,known:0},{id:'C',v:9,pool:0,at:'res',slot:3,exposed:0,clean:1,spent:0,known:0}],sn:0,
  ped:null,pv:null,out:null,gateP:null,nul:0,blocks:[],epoch:0,count:0,fails:0,seen:{},proofs:0,transitions:0,
  shaft:0,plate:0,ex:[0,0,0,0,0],blue:0,audit:0,elegant:0,exOpen:0,cine:null,ad:null,fin:0,ft:0,fx:{},alive:0,exitOpen:0,look:null,done:0,flash:0,shk:0,wait:0,
  L:{priv:.12,proof:.12,auth:.12,state:.12,chain:.2,adapt:.06},Lt:{priv:.12,proof:.12,auth:.12,state:.12,chain:.2,adapt:.06},aw:.12,talk:{},said:{},hint:0,idle:0,act:0,beacon:0,sky:0,
  fnl:0,tgl:0,waves:[]};
 K.l=K.r=K.j=K.jp=K.e=K.q=0;ctl(1)}
// ======================= input =======================
if(!window.__zkMK){window.__zkMK=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyQ:'q',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isM())return;e.preventDefault();if(k==='q'||k==='e'){if(!e.repeat)K[k]=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='q'&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0});
 addEventListener('pointerdown',e=>{if(isM()&&e.target===g2.canvas)K.e=1})}
function ctl(on){let c=$z('mctl');if(c&&c.dataset.own!=='machine'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='mctl';c.dataset.own='machine';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='q'||k==='e'){if(v)K[k]=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('Q','q','shield'),mb('\uD83D\uDCAC','e','interact'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
// ======================= small helpers =======================
function say(h,s,t,c){V.msg={h,s,c:c||'#7ee7ea'};V.mt=t||6}
const note=(s,c)=>say('',s,Math.max(4.5,s.length/16),c);
function spark(x,y,c,n=12){if(reduce)n=Math.ceil(n/2);for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*220;V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c,s:5,g:260})}}
function dust(n){for(let i=0;i<n;i++)V.vp.push({x:V.px+(Math.random()-.5)*40,y:V.py+(V.lay?FL-FL:0),vx:(Math.random()-.5)*140,vy:30+Math.random()*90,l:.45,c:'#9aa7c7',s:5,g:0})}
const ftx=(x,s,y,c)=>V.fl.push({x,y:y==null?260:y,s,l:2.6,c:c||'#ece8df'});
const P3=()=>pal();
const col={priv:()=>P3().se,proof:()=>P3().ac,state:()=>P3().pr,auth:()=>IKC.gold,chain:()=>mixc(P3().se,'#ffffff',.55),adapt:()=>IKC.amber};
const dimc={priv:'#26405a',proof:'#3a3556',auth:'#4a4030',state:'#2c3a52',chain:'#2a4a58',adapt:'#4a3a28'};
const LC=k=>mixc(dimc[k],col[k](),V.L[k]);
const lit=(k,v)=>{if(v>V.Lt[k])V.Lt[k]=v};
// ---- the Cell: a shielded note. Only the shield lets you read its value.
const cellById=id=>V.cells.find(c=>c.id===id);
const slotX=(pool,i)=>pool?NEWX[i]:RESX[i],nSlots=pool=>pool?NEWX.length:RESX.length;
const slotCell=(pool,i)=>V.cells.find(c=>c.at==='res'&&c.pool===pool&&c.slot===i);
const freeSlot=pool=>{for(let i=0;i<nSlots(pool);i++)if(!slotCell(pool,i))return i;return -1};
function newCell(base,v,pool,clean){const i=freeSlot(pool),c={id:base[0]+(++V.sn),v,pool,at:'res',slot:Math.max(0,i),exposed:0,clean,spent:0,known:0};V.cells.push(c);return c}
function expose(c,why){if(c.exposed)return;c.exposed=1;c.clean=0;V.fails++;V.readN++;V.flash=.7;V.shk=.35;sfx('incorrect');spark(V.px,V.py+80,IKC.red,22);
 if(!V.said.read){V.said.read=1;say('READ','A Cell carried in the open is read by whatever is watching. Once it has been read it is not a secret any more, and no one can unread it.',9,IKC.red)}
 else say('READ',why==='verifier'?'The Verifier looked straight at the secret. It did not want to.':'It saw the Cell again. Open in the beam is open to everyone.',5,IKC.red)}
// ---- NPCs: five people who each noticed one part of the machine, and disagree about what it is
const npcAt=id=>{const g=V.fin>0&&V.exitOpen,o={jeff:[9880,0],ws:[10010,0],hob:[10140,0],tender:[10270,0],watch:[10400,0]};if(g)return o[id];
 switch(id){case 'jeff':return V.gaze?[1690,0]:[JFX,0];case 'ws':return[BOARD-190,0];case 'hob':return V.epoch>=1?[TURN+110,0]:[LEVER+190,0];
  case 'tender':return V.nul>=1?[WALLX-130,0]:[1840,0];case 'watch':return[6000,0]}return[0,0]};
function lines(id){const s=V.talk[id]||0,fin=V.fin>0&&V.exitOpen,bl=V.blocks.length;
 if(id==='jeff'){if(fin)return['Turns out the shield was a part, not the point.','I called it a shield. Winter Spring called it a verifier. We were each holding one leg of the same animal.'];
  if(V.epoch>=1&&!V.said.jeffA){V.said.jeffA=1;return['More eyes. Of course. It keeps up with you.','Same Q, every time. Nothing about that changed.']}
  if(V.shT>0)return s?['Still chill.','The shield does not hide you. It decides who gets to look.']:['There it is. Looks good on you.','It does not make you invisible. It just makes you hard to argue with.'];
  if(V.gaze)return['See the eyes? They sweep. Whatever is open in the beam gets read.','Same Q, every time.'];
  return s?['Big place. Hum is nice. Everything is on, nothing is connected.','Winter Spring says it is a verifier. Hob says it is a mechanism. I say it is a shield. We stopped arguing.']:['Oh, hey. Picture-face. You made it down here.','Quiet, huh? Everything is running. Nothing is talking to anything else.','Do not hurry. Some of it looks back.']}
 if(id==='ws'){if(fin)return['I called it a verifier. I was looking at one corner of it.','VALID was never the point. VALID was one organ.','A zk-SNARK is the proof, a commitment is the sealed note, a nullifier is the mark of a spend, and a key is the authority.'];
  if(V.seen.double||V.seen.restr)return['Valid, and refused. A proof is about a statement. It is not about now.','The booth cannot know what the Wall knows.'];
  if(V.epoch>=1)return['The rule changed. The proof did not mind. It only ever answers what it is asked.'];
  if(V.proofs>0)return['It said VALID. Notice what travelled, and what stayed behind in the booth.'];
  return s?['The board says what must be true, in public. The booth says nothing at all, in private. Which one do you want to understand?']:['A visitor. I was beginning to wonder who built the thing that built the thing.','It is a verifier. The rest is furniture. Read the board, then look at the booth.']}
 if(id==='hob'){if(fin)return['I would have rebuilt it. Glad I did not.','Do not tell Jeff I said that.'];
  if(V.epoch>=1)return['I did not replace one bolt. It grew a second door and kept the first. Rude. Efficient.','Old pool leaves through the turnstile. Counted, one way. A Cell does not go back.'];
  if(V.keys.iron)return['Heavy, is it not? That is what authority weighs.','The glass will show you the gate. Only the iron turns it.'];
  return['That lever has wanted to turn for three hundred years. It only turns for one thing.','I looked at it very hard. It let me look. That was all it let me do.']}
 if(id==='tender'){if(fin)return['It was never keeping fruit. It was keeping score.'];
  if(V.seen.double)return['It caught you. And it still does not know which one you are.','Count the marks. Do not match them.'];
  if(V.nul>=1)return['A new Cell hangs where there was none. The old one still glows in the booth.','It looks like all the others. The Wall only knows that one was used. Never which.'];
  if(V.readN>0)return['That one went red. I cannot un-count it.','The basin will make it look sealed again. It will not make it unread.'];
  return['Three Cells, and not one has ever fallen.','I cannot tell you which are used. Nobody can. That is the whole point.']}
 if(id==='watch'){if(fin)return['You were not watching blocks arrive. You were watching history decide what to remember.'];
  if(bl>=3)return['The road is whole. Everything that holds it up was accepted.'];
  if(bl>=1)return['That one will be remembered. Look back along the rail. It points at its parent.'];
  return['It happened again.','Every light on that rail was accepted. Not merely arrived.']}
 return['...']}
function talk(id){V.dlg={who:id,L:lines(id),i:0,c:0};V.talk[id]=(V.talk[id]||0)+1;sfx('interaction')}
function advance(){const d=V.dlg;if(!d)return;if(d.c<d.L[d.i].length){d.c=999;return}sfx('interaction');if(++d.i>=d.L.length)V.dlg=null;else d.c=0}
function tele(lay,px,py,fn){if(V.fade)return;V.fade={t:0,d:1,lay,px,py:py||0,fn};sfx('rise')}
// ======================= interactions =======================
const EXT=[['VERSION 0: THE GLASS LEDGER','Every Cell sat in a glass case with a name on it. Anyone could check anything. Nobody would use it for anything they cared about. It had no privacy.'],
 ['VERSION 1: THE SEALED VAULTS','Every Cell was locked where no one could look. Every door said TRUST ME. Nothing could be checked. It had no proof.'],
 ['VERSION 2: THE OPEN GATE','The Gate had no lock. Anyone who could see it could move anything. The hall behind it is empty. It had no authority.'],
 ['VERSION 3: THE TWO LAMPS','Two ledgers, each with a lamp that said MINE. Both were valid. Nothing could say which history to keep. It had no chain.'],
 ['VERSION 4: THE STATUE','It worked perfectly, for exactly the world it was built for. When the world changed, it stood still. It could not adapt.']];
const cellTxt=c=>V.shield?c.id+' holds '+c.v:c.id+' holds something';
function takeCell(c){if(!V.gen){note('The Reservoir is dark. Nothing answers. A cable on the floor runs back toward the plinth.');return}
 V.hand={k:'cell',c};c.at='hand';sfx('collectible');spark(slotX(c.pool,c.slot),60,col.state(),14);lit('state',.55);
 if(!V.gaze){V.gaze=1;V.gazeT=0;sfx('core-activate');lit('priv',.4);say('SOMETHING ELSE WOKE','Taking the Cell woke something else. High in the hall, eyes are opening. They were waiting for something to be carried.',8,IKC.amber)}
 else note('The Cell comes away warm. Its light leaks a little. Anyone watching can see where it goes.')}
function placeCell(c,pool,i){c.at='res';c.pool=pool;c.slot=i;V.hand=null;sfx('interaction');note('It settles back among the others. Everything in the tree looks the same from outside.')}
function toggleShield(){V.shield=V.shield?0:1;sfx('interaction');if(V.shield){spark(V.px,V.py+60,'#ffffff',14);lit('priv',.55);if(!reduce)wow=Math.max(wow,.2);if(!V.said.sh){V.said.sh=1;note('The shield holds. It does not make you invisible. It makes you unreadable. Some things become legible only from behind it.',col.priv())}}}
function pull(){const p=V.gateP;if(!p){note('The lever is dead without a statement to act on.');return}const c=cellById(p.cell);
 if(!V.keys.iron){V.refA++;V.fails++;sfx('incorrect');V.shk=.3;say('SEEN, NOT AUTHORIZED',V.keys.glass?'The proof is VALID. The glass key fits the window. It does not fit the lever. Seeing the gate is not the same as being allowed to move it.':'The proof is VALID. The lever will not move. Whatever turns it is not something you are holding.',9,IKC.gold);return}
 if(V.blocks.length>=3){note('The chain has reached the far wall. Nothing more is needed here.');return}
 if(c.spent){V.seen.double=1;c.known=1;V.fails++;sfx('incorrect');V.shk=.3;say('ALREADY MARKED','The proof is valid. The Wall already holds a mark for this Cell. The machine accepted the proof and refused the transition. The booth could not know what the Wall knew.',10,IKC.red);return}
 if(V.epoch>=1&&c.pool===0){V.seen.restr=1;V.fails++;sfx('incorrect');V.shk=.3;say('RESTRICTED POOL','The proof is valid, the authority is real, and the Cell is from the old pool. The old pool may only be left, never spent from. Cells leave it through the turnstile.',10,IKC.amber);return}
 mint(c)}
function mint(c){V.gateP=null;c.spent=1;V.nul++;V.transitions++;const b={i:V.blocks.length,mode:c.clean?'sealed':'open',st:'form',t:0};V.blocks.push(b);
 newCell(c.id,c.v,V.epoch>=1?1:0,c.clean);lit('state',.8);lit('auth',1);lit('proof',.8);lit('chain',.4+.2*V.blocks.length);sfx('core-activate');
 V.cine={x:CHX[b.i]+120,t:0,d:4.4};V.lock=4.4;V.flash=0;spark(LEVER,100,IKC.gold,30);
 say('TRANSITION ACCEPTED','Proof valid. Authority real. The Cell was not spent before. A mark joins the Wall, a new Cell joins the tree, and the chain is asked to remember it. IN ZCASH: that is a shielded spend: a valid proof, real spending authority, and a nullifier the network has not seen before.',15,IKC.ok)}
function startAdapt(){V.ad={t:0};V.lock=Math.max(V.lock,7.2);V.cine={x:TURN+120,t:0,d:7.2}}
function audit(){if(V.fin)return;if(!V.keys.glass){note('A socket shaped like a small key of glass. It is empty.');return}
 if(V.audit>0){note('The glass has already read the chain.');return}
 if(V.blocks.length<3){note('The glass has too little chain to read. Finish the road first.');return}
 const open=V.blocks.filter(b=>b.mode==='open').length;
 if(open){V.audit=-1;sfx('incorrect');say('THE GLASS READS THE CHAIN',open+(open>1?' blocks are':' block is')+' open. Whatever was inside was read before it was sealed. The glass can only audit what stayed private.',10,IKC.gold);return}
 V.audit=1;V.elegant=1;sfx('world-complete');sfx('card-reveal');if(!reduce)wow=1;LK.forEach(k=>lit(k,.8));spark(VIEWS,160,IKC.gold,40);
 say('PRIVATE, AND AUDITABLE','Every block is sealed to the world and open to the glass. You chose what to show, and to whom, without ever handing over the iron. That is the machine at its most elegant. IN ZCASH: that is selective disclosure. A viewing key lets you show an auditor your history without giving up the power to spend.',18,IKC.gold)}
function heart(){if(V.fin)return;const h=V.hand,c=h&&h.k==='cell'?h.c:null;
 if(!c){note('The Heart waits for a Cell that has been through everything.');return}
 if(c.exposed){say('AN OPEN CELL','The Heart will not take a Cell that has been read. That would end the very thing it exists to keep. The basin by the entrance can seal it again.',9,IKC.red);return}
 if(c.spent){V.seen.double=1;say('ALREADY MARKED','This Cell was spent. The Wall knows that one was used. The live one hangs in the pool.',8,IKC.red);return}
 if(c.pool===0){say('THE OLD POOL','The Heart takes only what crossed the turnstile and came out the other side.',8,IKC.amber);return}
 startFinale(c)}
function startFinale(c){c.at='gone';V.hand=null;V.fin=1;V.ft=0;V.lock=999;V.zt=.8;V.fx={};sfx('core-activate');spark(HEART,260,'#ffffff',60);if(!reduce)wow=1.4;V.mt=0}
function IAS(){const a=[],P=(lay,x,y,l,f,pri)=>a.push({lay,x,y,l,f,pri}),h=V.hand,hc=h&&h.k==='cell'?h.c:null,hp=h&&h.k==='proof';
 if(V.lay===0){
  P(0,260,0,'READ THE ARCH',()=>note('Origin stone, older than anything else here. A single glyph is cut into the keystone. Under it, a date that has been scratched out and carved again.'));
  P(0,PLINTH,70,V.keys.glass?'EXAMINE THE PLINTH':'TAKE THE GLASS KEY',()=>{if(V.keys.glass){note('An empty cradle in the shape of a key. The block overhead is the first one. Everything else points back to it.');return}
   V.keys.glass=1;sfx('collectible');spark(PLINTH,110,'#ffffff',16);say('A KEY OF GLASS','It lets you look. Hold it up to something and it will say what that something says. It cannot turn anything.',7,'#cfd8f0')});
  P(0,SOCK,0,V.gen?'THE SOCKET HUMS':V.pul?'...':'TOUCH THE GENESIS SOCKET',()=>{if(V.gen){note('The pulse is still travelling. The conduit remembers it.');return}if(V.pul)return;V.pul={t:0};sfx('core-activate');lit('chain',.4);note('A pulse leaves the first block, down the conduit, along the floor. Follow it.')});
  const sl=(pool)=>{for(let i=0;i<nSlots(pool);i++){const x=slotX(pool,i),c=slotCell(pool,i);
    if(c){if(!h)P(0,x,0,'TAKE THE CELL',()=>takeCell(c));else P(0,x,0,'LOOK AT THE CELL',()=>note(cellTxt(c)+(c.known?'. A ring says it was used.':'')))}
    else if(hc&&hc.pool===pool)P(0,x,0,'PLACE THE CELL',()=>placeCell(hc,pool,i))}};
  sl(0);if(V.epoch>=1)sl(1);
  [BASIN,3480,7500].forEach(bx=>P(0,bx,0,'THE REKEY BASIN',()=>{if(hc&&hc.exposed){hc.exposed=0;sfx('correct');spark(bx,60,col.priv(),20);say('SEALED AGAIN','The basin takes the stain out of the Cell. It cannot take the reading back out of the world. A block made from it will carry that.',8,col.priv())}else note('A basin of slow light. Something open could be sealed again here.')}));
  P(0,TURN,0,'EXAMINE THE TURNSTILE',()=>note(V.fx.turn?'Counted: '+V.count+'. Cells pass left to right, and the arms turn once for each. A Cell does not go back.':'Three folded arms in an iron frame. Dormant. Nothing has ever needed counting here.'));
  P(0,BOARD,0,'READ THE CONDITION',()=>note('THE RULE, PUBLIC: '+ruleTxt()+'. Anyone may read this. It says what must be true. It does not say what is.',col.proof()));
  P(0,PED,0,V.ped?(V.pv&&!V.pv.done?'THE BOOTH IS SEALED':hc?'PLACE THE CELL ON THE WITNESS':'TAKE THE CELL BACK'):hc?'PLACE THE CELL ON THE WITNESS':'THE WITNESS PEDESTAL',()=>{
   if(V.ped){if(V.pv&&!V.pv.done){note('The booth is working. Nothing inside it can be seen.');return}
    if(hc){const o=V.ped,i=freeSlot(o.pool);if(i<0){note('The tree has no room for the old Cell.');return}o.at='res';o.slot=i;V.ped=null;V.pv=null;note('The booth hands the old Cell back to the tree. It looks like every other Cell there.');}
    else{if(h){note('Your hands are full.');return}V.hand={k:'cell',c:V.ped};V.ped.at='hand';V.ped=null;V.pv=null;sfx('interaction');return}}
   if(!hc){note('A pedestal inside a closed booth. Whatever sits here is out of sight of everything.');return}
   if(V.out){note('The proof slot is still full. Take the proof first.');return}
   V.ped=hc;hc.at='ped';V.hand=null;V.pv={t:0,c:hc};sfx('core-activate')});
  P(0,OUTS,0,V.out?'TAKE THE PROOF':'THE PROOF SLOT',()=>{if(!V.out){note('A slot in the wall. Empty. Whatever comes out of the booth comes out here.');return}if(h){note('Your hands are full.');return}
   V.hand={k:'proof',p:V.out};V.out=null;sfx('collectible');note('A shard of light, cool to hold. It says the rule holds. Anyone may look at it.')});
  P(0,PSOCK,0,hp?'SOCKET THE PROOF':hc?'OFFER THE CELL':V.gateP?'TAKE THE PROOF BACK':'THE PROOF SOCKET',()=>{
   if(hp){V.gateP=h.p;V.hand=null;sfx('correct');note('The lamp says VALID. The lever is still just a lever.',col.proof());return}
   if(hc){V.seen.secret=1;if(!V.shield)expose(hc,'verifier');else{sfx('incorrect');note('The Verifier cannot read it behind the shield, and refuses anyway. It only takes proofs. The secret does not travel.')}return}
   if(V.gateP){V.hand={k:'proof',p:V.gateP};V.gateP=null;sfx('interaction');return}note('A socket with a lamp above it. It checks statements. It has never been shown a secret.')});
  P(0,LEVER,0,V.gateP?'PULL THE LEVER':'THE LEVER',()=>pull());
  P(0,GATE,0,'READ THE PLATE',()=>{if(!V.keys.glass){note('A plate behind glass. There is writing. You cannot read it from here.');return}
   if(!V.plate){V.plate=1;V.shaft=1;lit('auth',.4);sfx('rise');say('THE GATE, READ THROUGH GLASS','A STATEMENT MUST BE VALID. THE ONE WHO ACTS MUST HOLD THE SPEND KEY. THE CELL MUST NOT HAVE BEEN MARKED. Under the floor, a bolt withdraws: the Keyworks.',10,IKC.gold)}
   else note('Valid statement. Spend key. Unmarked Cell. Three things, and the glass can only read them.',IKC.gold)});
  P(0,HATCH,0,V.shaft?'DESCEND TO THE KEYWORKS':'EXAMINE THE HATCH',()=>{if(V.shaft)tele(1,HATCH,FL);else{sfx('incorrect');note('A hatch in the floor, bolted from below. A thin line of light shows around it.')}});
  P(0,WALLX,0,'READ THE WALL',()=>note(V.keys.glass?V.nul+' marks, and the glass shows no names under any of them. It remembers that. It never remembers which.':'A wall of small marks. '+V.nul+' of them. None of them says anything about what it was.'));
  P(0,VIEWS,0,'THE VIEW SOCKET',()=>audit());
  P(0,HEART,80,hc?'GIVE THE CELL TO THE HEART':'THE HEART',()=>heart());
  P(0,EXITX-60,0,V.exitOpen?'THE WAY OUT':'THE SEALED DOOR',()=>note(V.exitOpen?'Open. Outside is light.':'A door in the east wall of the Core. No handle. It opens for something the machine has not yet done.'));
  ['jeff','ws','hob','tender','watch'].forEach(id=>{const p=npcAt(id);P(0,p[0],0,'TALK TO '+NP[id].n.toUpperCase(),()=>talk(id),1)})}
 else{
  P(1,HATCH,FL,'CLIMB THE LADDER',()=>tele(0,HATCH,0));
  EXH.forEach((x,i)=>P(1,x,FL,V.ex[i]?'READ AGAIN':'EXAMINE THE EXHIBIT',()=>{say(EXT[i][0],EXT[i][1],10,IKC.gold);sfx('interaction');if(!V.ex[i]){V.ex[i]=1;if(V.ex.every(q=>q)&&!V.blue){V.blue=1;sfx('world-complete');spark(EXH[4],FL+120,IKC.gold,40);V.said.blue=1;
    say('THE BLUEPRINT','Five machines, each missing exactly one layer, and each one failed for exactly that reason. You can see how the pieces depend on each other now. The Blueprint is yours. IN ZCASH: notes and nullifiers are the state, blocks are the history, zk-SNARK proofs are the evidence, and spending and viewing keys are the authority.',19,IKC.gold)}}}));
  P(1,PLAQ,FL,'READ THE PLAQUE',()=>note(V.keys.glass?'The glass is cut from the iron. The iron cannot be cut from the glass.':'Scratched into the stone. Without a key of glass you cannot make it out.',IKC.gold));
  if(!V.keys.iron)P(1,IRONX,FL+70,'TAKE THE SPEND KEY',()=>{V.keys.iron=1;lit('auth',.7);sfx('collectible');spark(IRONX,FL+110,IKC.gold,24);say('THE SPEND KEY','Iron. Heavy. It does not show you anything. It turns things.',8,IKC.gold)});
  else P(1,IRONX,FL+70,'THE EMPTY CRADLE',()=>note('The cradle is empty. It looks as though it was always meant to be.'))}
 return a}
function act(){let b=null,d=125;IAS().forEach(o=>{const q=Math.abs(V.px-o.x)*(o.pri?.45:1);if(o.lay===V.lay&&Math.abs(V.py-o.y)<115&&q<d){d=q;b=o}});V.near=b;return b}
// ======================= the world turns =======================
const obsOn=o=>V.gaze&&(o.ep===0||V.epoch>=1),spotX=(o,t)=>o.c0+o.amp*Math.sin(t*6.2832/o.per+o.ph);
const WST={priv:2400,proof:3930,auth:5300,state:5800,chain:6650,adapt:8800},FCAM=[[0,8560],[1,2600],[2.8,3930],[4.4,5300],[6,5800],[7.6,6650],[9.2,8700],[10.8,6300]];
const FTL=[['priv',1.4,'portal'],['proof',3,'card-reveal'],['auth',4.6,'correct'],['state',6.2,'collectible'],['chain',7.8,'rise'],['adapt',9.4,'core-activate']];
function floorTop(y0){const hw=HW*.6;let f=-99999;const chk=q=>{if(V.px+hw>q[0]&&V.px-hw<q[0]+q[1]&&y0>=q[2]-2&&q[2]>f)f=q[2]};
 if(V.lay===1){f=FL;PLAT1.forEach(chk);return f}GA.forEach(g=>chk([g[0],g[1]-g[0],0]));PLAT0.forEach(chk);V.blocks.forEach(b=>{if(b.st==='conf')chk([CHX[b.i],CHW,0])});return f}
function stepWorld(dt,w){
 V.t+=dt;V.flash=Math.max(0,V.flash-dt);V.shk=Math.max(0,V.shk-dt);
 const live=V.st==='play'&&!V.dlg&&!V.fade&&V.lock<=0;V.lock=Math.max(0,V.lock-dt);
 if(live&&K.q){toggleShield()}K.q=0;
 if(V.shield)V.shT+=dt;
 const dir=live?K.r-K.l:0,tv=dir*SPD*(V.shield?.74:1),prev=V.px;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);if(dir)V.face=dir;
 V.coy=V.gr?.1:V.coy-dt;V.buf-=dt;if(K.jp){V.buf=.12;K.jp=0}
 if(live&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;V.sq=-1;dust(8);sfx('interaction')}
 if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;
 V.px+=V.vx*dt;
 let lo=HW,hi=V.exitOpen?LW-90:EXITX-HW-10;if(V.lay===1){lo=SUB[0]+HW+10;hi=SUB[1]-HW-10}
 // privacy fields (underground): they admit only what is hidden
 if(V.lay===1&&!V.shield){const hit=(x)=>{V.vx=0;if(!(V.said.mem>V.t-3)){V.said.mem=V.t;say('A PRIVACY FIELD','It will not take what it can read. It admits only what is hidden. ['+(coarse?'Q':'Q')+']',6,col.priv())}};
  if(prev<=MEM1-HW&&V.px>MEM1-HW){V.px=MEM1-HW;hit()}if(prev>=MEM0+HW&&V.px<MEM0+HW){V.px=MEM0+HW;hit()}}
 // the turnstile: counted, one way, only for Cells
 const hc=V.hand&&V.hand.k==='cell'?V.hand.c:null;
 if(V.lay===0&&V.fx.turn&&hc){if(hc.pool===0&&prev<TURN&&V.px>=TURN){hc.pool=1;V.count++;sfx('correct');spark(TURN,80,IKC.amber,20);say('COUNTED','One crossed. The arms turned once and never read what it was. The Cell is the same Cell. It is a member of the new pool now, and it will not be going back.',9,IKC.amber)}
  else if(hc.pool===1&&V.px<TURN){V.px=TURN;V.vx=0;if(!(V.said.tb>V.t-3)){V.said.tb=V.t;note('The arms will not turn backwards for a Cell. Counted, and one way.',IKC.amber)}}}
 V.px=cl(V.px,lo,hi);
 const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;const ft=floorTop(y0);let on=0;
 if(V.vy<=0&&V.py<=ft&&y0>=ft-2){V.py=ft;V.vy=0;on=1}else if(V.vy<=0&&V.py<=ft&&ft>-9e4&&V.lay===1){V.py=ft;V.vy=0;on=1}
 if(on&&!V.gr&&V.vy>-1){} if(on){if(V.sq===0&&V.vy<-420){}}
 V.gr=on;
 if(on&&V.lay===0&&(V.px<GA[0][1]-110||V.px>GA[1][0]+110||V.blocks.some(b=>b.st==='conf'&&Math.abs(V.px-(CHX[b.i]+CHW/2))<90)))V.safe={x:V.px,y:V.py};
 if(V.lay===0&&V.py<-430){V.px=V.safe.x;V.py=V.safe.y;V.vx=V.vy=0;spark(V.px,V.py+40,IKC.light,16);sfx('interaction');if(!V.said.fall){V.said.fall=1;say('THE SPINE','The road continues where history does. You are back on the last thing that was kept.',6,'#7ee7ea')}}
 if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.26;sfx('step')}
 V.sq+=(0-V.sq)*Math.min(1,dt*12);
 // layer fade
 if(V.fade){const q=V.fade;q.t+=dt/.35*q.d;if(q.d>0&&q.t>=1){q.t=1;q.d=-1;V.lay=q.lay;V.px=q.px;V.py=q.py;V.vx=V.vy=0;V.gr=1;V.safe={x:q.px,y:q.py};V.cx=V.px-(w/U)*.42;V.cy=q.lay?FL:0;if(q.fn)q.fn()}else if(q.d<0&&q.t<=0)V.fade=null}
 // the first experiment: a pulse from the first block
 if(V.pul&&!V.gen){V.pul.t+=dt;if(V.pul.t>2.6){V.gen=1;lit('state',.45);lit('chain',.5);sfx('card-reveal');spark(RESX[0]-60,40,col.state(),24);say('IT REACHED THE RESERVOIR','The Reservoir lit up. It was waiting for the chain. Something that holds state depends on something that holds history.',8,col.state())}}
 // the Gaze
 let seen=0;if(V.lay===0&&V.py<110)OBS.forEach(o=>{if(obsOn(o)&&Math.abs(V.px-spotX(o,V.t))<o.hw)seen=1});V.inBeam=seen;
 if(seen&&!V.shield&&hc&&!hc.exposed&&V.lock<=0&&V.fin===0&&!V.fade){V.read+=dt;if(V.read>.35){V.read=0;expose(hc,'gaze')}}else V.read=Math.max(0,V.read-dt*2);
 // the Prover (the Cell stays in the booth; only a proof comes out)
 if(V.pv&&!V.pv.done){V.pv.t+=dt;if(V.pv.t>2.6){V.pv.done=1;const c=V.pv.c;
  if(c.exposed){V.pv.res='ex';V.fails++;sfx('incorrect');say('EXPOSED','The Prover will not prove what is not secret. Anyone who watched you carry it already knows what is inside. The basin can seal it again, but a reading stays read.',10,IKC.red)}
  else if(!rule(c.v)){V.pv.res='no';sfx('incorrect');say('NO WITNESS FITS','The rule is public and the Cell is private. This Cell cannot satisfy '+ruleTxt()+'. The booth will not tell you what it held. Try another.',9,IKC.amber)}
  else{V.pv.res='ok';V.out={cell:c.id};V.proofs++;lit('proof',1);lit('priv',.6);sfx('correct');sfx('card-reveal');spark(OUTS,100,col.proof(),24);say('PROOF MADE','The Cell never left the booth. A proof that the rule holds came out of the slot. It says the rule holds. It does not say the value. IN ZCASH: the network receives the proof together with the public data the protocol requires, such as commitments and nullifiers. The private details stay with you.',14,col.proof())}}}
 // the chain forms; the adaptation follows block two
 V.blocks.forEach(b=>{if(b.st==='form'){b.t+=dt/3.4;if(b.t>=1){b.t=1;b.st='conf';sfx('correct');sfx('card-reveal');spark(CHX[b.i]+120,40,IKC.light,26);lit('chain',.4+.2*(b.i+1));if(b.i===1&&!V.epoch&&!V.ad)startAdapt()}}});
 if(V.ad){const a=V.ad;a.t+=dt;if(a.t>1.6&&!V.epoch){V.epoch=1;sfx('core-activate');V.said.rule=1}
  if(a.t>3&&!V.fx.turn){V.fx.turn=1;sfx('rise');lit('adapt',1);spark(TURN,100,IKC.amber,30)}
  if(a.t>4.4&&!V.fx.pool){V.fx.pool=1;sfx('card-reveal');lit('state',.9)}
  if(a.t>6.4&&!a.say){a.say=1;say('THE MACHINE ADAPTED','The rule rewrote itself. The old pool can only be left, through a counted, one-way turnstile. More eyes opened. It did not break and it did not get replaced. It changed so it could keep doing the same job. IN ZCASH: that is a network upgrade. Zcash has done it before, with Sapling in 2018 and NU5 with Orchard in 2022, and most recently Ironwood with NU6.3 in 2026.',19,IKC.amber)}
  if(a.t>7.2)V.ad=null}
 if(V.fx.turn)V.fx.tt=(V.fx.tt||0)+dt;V.waves=V.waves.filter(q=>(q.t+=dt)<2.2);
 // lights propagate
 LK.forEach(k=>V.L[k]+=(V.Lt[k]-V.L[k])*(1-Math.exp(-1.4*dt)));V.aw=LK.reduce((s,k)=>s+V.L[k],0)/6;
 // the finale
 if(V.fin===1){V.ft+=dt;const f=V.ft;
  FTL.forEach(([k,t0,s])=>{if(f>t0&&!V.fx['f'+k]){V.fx['f'+k]=1;V.Lt[k]=1;sfx(s);V.waves.push({x:WST[k],t:0,k});spark(WST[k],150,col[k](),30);V.fnl=(V.fnl||0)+1;if(!reduce)wow=Math.max(wow,.5)}});
  if(f>10&&!V.fx.el){V.fx.el=1;if(V.elegant){sfx('world-complete');V.fx.ring=1}}
  if(f>.9&&!V.fx.z1){V.fx.z1=1;V.zt=.5}if(f>10.6&&!V.fx.z3){V.fx.z3=1;V.zt=.2;V.beacon=1;sfx('world-complete');if(!reduce)wow=1.2}
  V.alive=cl((f-9.4)/6);
  if(f>16&&!V.fx.out){V.fx.out=1;V.fin=2;V.zt=1;V.beacon=0;V.lock=0;V.exitOpen=1;sfx('collectible');say('THE MACHINE IS ALIVE','The east door of the Core is open. Walk out.',9,'#ffffff')}}
 if(V.fin===2)V.alive=Math.min(1,V.alive+dt*.5);
 V.sky+=(V.alive-V.sky)*Math.min(1,dt*2);
 // the walk out, the look back
 if(V.fin===2&&!V.look&&V.px>LOOKX&&V.lay===0){V.look={t:0};V.lock=999;V.zt=.2;V.beacon=1;V.mt=0;V.dlg=null;V.vx=0;sfx('card-reveal');
  S.machine={elegant:V.elegant,blocks:V.blocks.map(b=>b.mode),blue:V.blue,fails:V.fails,shield:Math.round(V.shT),route:V.shT>90?'priv':V.fails>=4?'proof':'state',at:Date.now()};try{save()}catch(e){}
  fact('You have just experienced how the pieces cooperate. Privacy protects information. Zero-knowledge proofs establish facts without exposing secrets. Authorization controls who can act. State records what has happened. The blockchain preserves shared history. And the protocol adapts, so all of it can keep working together. Zcash has upgraded this way before: Sapling in 2018, NU5 in 2022 and NU6.3 in 2026.'+(V.elegant?' You made it private and auditable at once.':''))}
 if(V.look){V.look.t+=dt;if(V.look.t>17&&!V.done){V.done=1;V.st='done';sfx('collectible');if(S.done.machine){const me=V;fact('\u2713 ALREADY DISCOVERED');setTimeout(()=>{if(V===me&&V.on)back()},2800)}else complete()}}
 // zoom, nudges, area label
 V.zoom+=(V.zt-V.zoom)*(1-Math.exp(-1.5*dt));
 if(!V.said.a&&V.t>1.8){V.said.a=1;say('THE MACHINE','Everything here is running. Nothing is talking to anything else.',7,'#9fb4d6')}
 let az=ZONES[0][1];ZONES.forEach(z=>{if(V.px>=z[0])az=z[1]});if(V.lay===1)az=V.px<MEM0?'THE FIRST DESIGNS':V.px>MEM1?'THE KEYWORKS':'THE SUBSTRATE';
 if(V.t>3&&V.area!==az){V.area=az;V.at=3}V.at=Math.max(0,V.at-dt);
 if(V.mt>0)V.mt-=dt;V.vp=V.vp.filter(q=>(q.l-=dt)>0);V.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});V.fl=V.fl.filter(f=>(f.l-=dt)>0);
 if(V.dlg&&V.dlg.c<V.dlg.L[V.dlg.i].length)V.dlg.c+=dt*46;
 // nearest, and E
 V.near=null;if(live)act();
 if(K.e){K.e=0;if(V.dlg)advance();else if(live){if(V.mt>0&&!V.near)V.mt=0;else if(V.near)V.near.f()}}
 if(live&&!V.near&&V.t>20){V.idle+=dt}else V.idle=0}
// ======================= frame =======================
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5))*V.zoom;const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;
 if(tx!==V.ltx&&tx>w*.99){back();return}
 stepWorld(dt,w);
 const vw=w/U;let tcx=V.px-vw*.42+V.face*60,tcy=V.lay?FL:(V.py>180?V.py-180:0),ks=5;
 if(V.cine){V.cine.t+=dt;tcx=V.cine.x-vw*.5;ks=2.2;if(V.cine.t>V.cine.d)V.cine=null}
 if(V.fin===1){let kx=FCAM[0][1];FCAM.forEach(q=>{if(V.ft>=q[0])kx=q[1]});tcx=kx-vw*.5;ks=2.6}if(V.look){tcx=6300-vw*.5;tcy=0;ks=1.5}
 V.cx+=(tcx-V.cx)*(1-Math.exp(-ks*dt));V.cx=cl(V.cx,0,Math.max(0,LW-vw));V.cy+=(tcy-V.cy)*(1-Math.exp(-4*dt));
 ax=tx=V.ltx=Math.min(X(V.px),w*.9);if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}
function skyTune(){const th=TH.machine,p=pal(),a=V.sky,aw=V.aw;th.sky=[mixc(mixc('#02030a','#0a1220',aw),mixc(p.pr,'#10162e',.45),a),mixc(mixc('#0d1424','#18304a',aw),mixc(p.se,'#ffffff',.3),a)];th.fog=mixc('#3d5a8a',p.se,Math.max(aw*.6,a));th.mt=mixc('#05070f',mixc(p.pr,'#000000',.7),a);th.moon[3]=mixc('#7f93b8',p.ac,a)}
// ======================= drawing =======================
const pc=()=>pal();
function cellCol(c){return c.exposed?IKC.red:c.pool?mixc(pc().se,'#ffffff',.35):pc().pr}
function cellArt(x,y,c,t,hand){const col_=cellCol(c),r=hand?15:19;gl(x,y,r*3,col_,.5);cc(x,y,r,col_,c.spent&&c.known?.45:.95);cc(x-r*.3,y+r*.3,r*.3,'#ffffff',.25);
 if(c.exposed){for(let i=0;i<8;i++){const q=i/8*6.28+t*3;ln(x+Math.cos(q)*r*1.6,y+Math.sin(q)*r*1.6,x+Math.cos(q)*r*2.4,y+Math.sin(q)*r*2.4,IKC.red,2,.8)}}
 if(c.known)arc(x,y,r*1.5,0,6.28,'#ffffff',2,.7);
 if(V.shield&&V.lay===0){T2(c.id,x,y+r*2.2,'#ffffff',12);for(let i=0;i<c.v;i++)cc(x-(c.v-1)*5+i*10,y-r*1.7,3,col.priv(),.95)}else T2('?',x,y-r*.1-3,'#05060f',14)}
function cube(x,y,s,c,a,st){rr(x-s,y+s,s*2,s*2,rgba(c,.18*a));stroke(x-s,y+s,s*2,s*2,c,2,a);ln(x-s,y+s,x-s*.4,y+s*1.6,c,2,a);ln(x+s,y+s,x+s*1.6,y+s*1.6,c,2,a);ln(x-s*.4,y+s*1.6,x+s*1.6,y+s*1.6,c,2,a);if(st)for(let i=0;i<3;i++)cc(x-s*.5+i*s*.5,y,2.5,c,a)}
function gear(x,y,r,t,c,n,a){g2.save();g2.translate(X(x),Y(y));g2.rotate(t);g2.strokeStyle=c;g2.globalAlpha=a==null?1:a;g2.lineWidth=Math.max(1,3*U);g2.beginPath();for(let i=0;i<n*2;i++){const q=i/(n*2)*6.2832,r2=i%2?r*.84:r;g2.lineTo(Math.cos(q)*r2*U,Math.sin(q)*r2*U)}g2.closePath();g2.stroke();g2.beginPath();g2.arc(0,0,r*.4*U,0,7);g2.stroke();g2.restore()}
function farArt(w,h,gy,t,p){const a=V.aw,c=V.cx;
 for(let k=0;k<3;k++){const sp=.08+.16*k,gap=360+k*130,col_=mixc(['#04060d','#070b16','#0a1020'][k],mixc(p.se,'#0a1428',.7),V.sky*.3),base=Y(0);for(let i=-1;i<w/(gap*U)+3;i++){const x=i*gap*U-((c*sp*U)%(gap*U)),hh=(300+k*140+((i*53)%110))*U;rc(x,base-hh,(gap-90)*U,hh+900,col_);
  rc(x,base-hh,2.5*U,hh,rgba(p.se,.05+a*.35+V.sky*.3));for(let r=0;r<hh/(60*U);r++)if((i*7+r*3+k)%5===0)rc(x+12*U,base-hh+r*60*U,6*U,6*U,rgba(k%2?p.ac:p.pr,.15+a*.6))}}
 for(let i=0;i<14;i++){const x=((i*337-c*.12*U)%(w+400)+(w+400))%(w+400)-200,y=Y(300+(i*91)%420);g2.fillStyle=rgba(p.se,.05+.1*a);g2.fillRect(x,y,3*U,3*U)}}
function groundArt(t,p){const y0=Y(0),a=V.aw;
 GA.forEach(([a0,a1])=>{const x0=X(a0),x1=X(a1);if(x1<0||x0>W_)return;rc(x0,y0,x1-x0,Math.max(0,H_-y0)+4,'#0c0e19');rc(x0,y0,x1-x0,6*U,'#1a2038');rc(x0,y0,x1-x0,2*U,rgba(p.se,.25+a*.5+V.sky*.2))});
 // the chasm
 {const x0=X(GA[0][1]),x1=X(GA[1][0]);if(x1>0&&x0<W_){rc(x0,y0,x1-x0,H_,'#02030a');for(let i=0;i<26;i++)rc(x0+((i*127+t*5)%Math.max(1,x1-x0)),Y(-60-(i*43)%320),2,2,rgba(p.se,.25));rc(x0,y0+4,x1-x0,2,rgba(p.se,.12+a*.3))}}
 // the substrate, cut away
 if(onS((SUB[0]+SUB[1])/2,2200)){rr(SUB[0],-36,SUB[1]-SUB[0],-FL+8,'#04070d');rr(SUB[0],FL+6,SUB[1]-SUB[0],14,'#0c1220');rr(SUB[0],FL+6,SUB[1]-SUB[0],3,rgba(IKC.gold,.25+.2*V.L.auth));
  for(let i=0;i<14;i++)rr(SUB[0]+80+i*165,-36-6,6,-(FL+8)-18+40,'#0a101c')}}
function conduits(t,p){const a=V.L;
 // genesis -> reservoir
 ln(SOCK,6,RESX[0]-40,6,mixc(dimc.state,col.state(),V.gen?1:0),5,.9);if(V.pul&&!V.gen){const q=V.pul.t/2.6;ln(SOCK,6,SOCK+(RESX[0]-40-SOCK)*q,6,'#ffffff',6,.9);gl(SOCK+(RESX[0]-40-SOCK)*q,10,40,'#ffffff',.8)}
 if(V.gen)for(let i=0;i<4;i++)cc(SOCK+((t*180+i*220)%(RESX[0]-40-SOCK)),6,3,'#ffffff',.6);
 // spine rail overhead, lit as far as the chain reaches
 const end=7300,ex=V.blocks.length?CHX[Math.min(2,V.blocks.length-1)]+CHW/2:PLINTH+130;ln(PLINTH+130,640,end,640,dimc.chain,4,.8);ln(PLINTH+130,640,ex,640,LC('chain'),5,.4+.6*a.chain);
 for(let i=0;i<5;i++)cc(PLINTH+130+((t*140+i*900)%Math.max(1,ex-PLINTH-130)),640,3,'#ffffff',.5*a.chain);
 // other couplings appear as the parts are actually joined
 if(V.proofs>0)ln(OUTS+20,60,PSOCK-40,60,LC('proof'),4,.9);if(V.keys.iron)ln(HATCH,6,GATE,6,LC('auth'),4,.8);if(V.nul>0)ln(LEVER+40,40,WALLX-60,40,LC('state'),4,.9);
 if(V.nul>0)ln(PSOCK,640,PSOCK,520,LC('chain'),3,.7)}
function observerArt(t,p){OBS.forEach(o=>{if(o.ep&&!V.epoch)return;if(!onS(o.ex,400)&&!onS(spotX(o,t),400))return;const on=obsOn(o),sx=on?spotX(o,t):o.ex,hot=on&&V.inBeam&&Math.abs(V.px-sx)<o.hw;
  if(on){const col_=hot&&!V.shield?IKC.red:(V.shield?col.priv():IKC.amber);pl([[o.ex-14,o.ey-6],[o.ex+14,o.ey-6],[sx+o.hw,0],[sx-o.hw,0]],col_,.1+(hot?.12:0));ln(o.ex,o.ey-6,sx-o.hw,0,col_,2,.35);ln(o.ex,o.ey-6,sx+o.hw,0,col_,2,.35);rr(sx-o.hw,3,o.hw*2,3,col_)}
  rr(o.ex-4,o.ey+30,8,700,'#0a0f1c');cc(o.ex,o.ey,26,'#0a0f1c');arc(o.ex,o.ey,26,0,6.28,on?IKC.amber:IKC.steel,3);if(on){cc(o.ex+Math.max(-8,Math.min(8,(V.px-o.ex)/60)),o.ey,9,hot&&!V.shield?IKC.red:IKC.amber)}else ln(o.ex-18,o.ey,o.ex+18,o.ey,IKC.steel,3)})}
function slabs(){PLAT0.forEach(([x,wd,top])=>{if(!onS(x+wd/2,wd))return;rr(x,top,wd,top>0?top:10,'#10162a');rr(x,top,wd,4,rgba(LC('state'),1));if(top>100)for(let i=0;i<wd/90;i++)rr(x+20+i*90,top-4,6,top-8,'#0b1020')});
 PLAT1.forEach(([x,wd,top])=>{rr(x,top,wd,top-FL,'#10162a');rr(x,top,wd,4,rgba(IKC.gold,.6))})}
function approach(t,p){const a=V.aw;if(onS(260,500)){rr(150,300,60,300,'#0f1426');rr(310,300,60,300,'#0f1426');rr(130,330,260,50,'#141b33');stroke(130,330,260,50,rgba(p.pr,.3+a*.5),2);T2('\u24E9',260,380,rgba(p.pr,.5+a*.5),30);for(let i=0;i<6;i++)rr(158,70+i*40,44,2,rgba(p.pr,.15+a*.3))}
 // genesis block, the first light on the rail
 cube(PLINTH+130,610,34,LC('chain'),.9,1);gl(PLINTH+130,610,160,LC('chain'),.3+.4*V.L.chain+.2*Math.sin(t*2));
 if(!V.keys.glass){gl(PLINTH,115,70,'#ffffff',.4+.2*Math.sin(t*3));ln(PLINTH-14,80,PLINTH,150,'#cfd8f0',3,.9);ln(PLINTH,150,PLINTH+14,80,'#cfd8f0',3,.9)}
 rr(SOCK-22,70,44,70,'#101a40');cc(SOCK,40,14,V.gen?LC('state'):'#1a2650');stroke(SOCK-22,70,44,70,V.gen?LC('state'):IKC.steel,2)}
function reservoir(t,p){if(!onS(2400,800))return;const a=V.L.state;
 rr(2020,300,760,7,'#171e38');rr(2020,300,760,2,rgba(LC('state'),.5+.5*a));for(let i=0;i<9;i++)ln(2040+i*90,300,2040+i*90+30,340,LC('state'),2,.3+a*.5);
 for(let k=0;k<2;k++){const pool=k;if(pool&&!V.fx.pool)continue;for(let i=0;i<nSlots(pool);i++){const x=slotX(pool,i);ln(x,300,x,150,pool?col.priv():LC('state'),2,.5);const c=slotCell(pool,i);if(c)cellArt(x,130,c,t,0);else cc(x,130,8,'#000',.5)}}
 for(let i=0;i<5;i++)rr(2040+i*160,0,18,300,'#0b1020')}
function turnstile(t,p){if(!onS(TURN,300))return;rr(TURN-70,0,12,230,'#141b33');rr(TURN+58,0,12,230,'#141b33');rr(TURN-70,230,140,10,'#141b33');
 const on=V.fx.turn,sp=on?(V.fx.tt||0):0,fold=on?Math.min(1,(V.fx.tt||0)/1.6):0;for(let k=0;k<3;k++){const q=(on?t*.6:0)+k*2.094+(1-fold)*1.2;ln(TURN,110,TURN+Math.cos(q)*70*fold,110+Math.sin(q)*70*fold,on?IKC.amber:IKC.steel,6,on?.95:.5)}
 cc(TURN,110,14,'#10162a');arc(TURN,110,14,0,6.28,on?IKC.amber:IKC.steel,3);if(on){T2('COUNTED '+V.count,TURN,270,IKC.amber,13);for(let i=0;i<5;i++)cc(TURN-40+i*20,252,3,i<V.count?IKC.amber:'#333',1)}
 if(!V.fx.pool&&onS(3250,300)){const op=V.ad?sm(4,5.4,V.ad.t):0;rr(3080,330,360,340*(1-op),'#0a0f1c');stroke(3080,330,360,340*(1-op),IKC.steel,2,.7)}
 else if(V.fx.pool){const wk=sm(0,1.2,V.fx.tt-4.4>0?V.fx.tt-4.4:0)||1;rr(3080,330,360,8,rgba(IKC.amber,.2*wk));ring(X(3250),Y(180),70*U,.1,IKC.amber,t)}}
function proving(t,p){if(!onS(3900,700))return;const a=V.L.proof,glitch=V.ad&&V.ad.t>.8&&V.ad.t<1.7;
 rr(BOARD-110,360,220,200,'#0b1022');stroke(BOARD-110,360,220,200,LC('proof'),3);T2('THE RULE (PUBLIC)',BOARD,535,IKC.light,11);
 g2.globalAlpha=glitch?(Math.sin(t*50)>0?1:.3):1;T2(ruleTxt(),BOARD+(glitch?(Math.random()-.5)*8:0),440,LC('proof'),24);g2.globalAlpha=1;for(let i=0;i<5;i++)rr(BOARD-90+i*38,380,26,6,rgba(LC('proof'),.3+a*.5));
 // the booth: closed, so nothing inside is visible
 rr(PED-95,250,190,250,'#0a0f1e');stroke(PED-95,250,190,250,LC('proof'),3);rr(PED-70,0,140,6,'#171e38');
 const busy=V.pv&&!V.pv.done;if(busy)for(let k=0;k<3;k++){ring(X(PED),Y(150),(40+k*22)*U,.4+k*.3,LC('proof'),t)}else if(V.ped){cc(PED,150,10,rgba(cellCol(V.ped),.5),.6)}
 if(V.pv&&V.pv.done){T2(V.pv.res==='ok'?'VALID':'NO',PED,230,V.pv.res==='ok'?IKC.ok:IKC.red,16)}T2('THE BOOTH',PED,520,IKC.light,11);rr(PED-95,0,190,6,'#10162a');
 rr(OUTS-24,60,48,70,'#0b1022');stroke(OUTS-24,60,48,70,LC('proof'),2);if(V.out){cube(OUTS,95,14,col.proof(),1,0);gl(OUTS,95,70,col.proof(),.5)}}
function gateArt(t,p){if(!onS(5300,800))return;const a=V.L.auth;
 rr(PSOCK-140,0,30,420,'#0f1426');rr(LEVER+110,0,30,420,'#0f1426');rr(PSOCK-140,420,420,44,'#141b33');stroke(PSOCK-140,420,420,44,LC('auth'),3);T2('THE GATE OF TRANSITIONS',GATE+30,455,IKC.light,12);
 rr(PSOCK-26,60,52,90,'#101a40');stroke(PSOCK-26,60,52,90,LC('proof'),2);cc(PSOCK,170,12,V.gateP?IKC.ok:'#1a2650');if(V.gateP){cube(PSOCK,100,12,col.proof(),1,0);T2('VALID',PSOCK,200,IKC.ok,12)}
 rr(GATE-40,160,80,60,'#0b1022');stroke(GATE-40,160,80,60,LC('auth'),2);T2(V.plate?'AUTHORITY':'\u2588\u2588\u2588\u2588',GATE,185,V.plate?IKC.gold:IKC.dim,11);
 rr(LEVER-8,0,16,120,'#141b33');const lv=V.gateP?.5:0;ln(LEVER,120,LEVER+30*lv,170-20*lv,LC('auth'),8,1);cc(LEVER+30*lv,170-20*lv,10,V.keys.iron?IKC.gold:IKC.steel);
 // hatch
 rr(HATCH-50,3,100,4,V.shaft?'#000':'#2a3456');if(V.shaft)for(let i=0;i<3;i++)rr(HATCH-40+i*30,-2,20,3,rgba(IKC.gold,.5));else ln(HATCH-50,4,HATCH+50,4,IKC.gold,2,.4);
 // the nullifier wall: marks, never names
 rr(WALLX-60,0,120,330,'#0d1222');stroke(WALLX-60,0,120,330,LC('state'),2);for(let i=0;i<24;i++){const on=i<V.nul*3;rr(WALLX-48+(i%6)*18,290-Math.floor(i/6)*30,10,22,on?rgba(pc().pr,.9):'#151b30')}T2('THE WALL',WALLX,350,IKC.light,11)}
function chasm(t,p){if(!onS(6650,900))return;const a=V.L.chain;
 for(let i=0;i<3;i++){const x=CHX[i],b=V.blocks[i];
  if(!b){stroke(x,0,CHW,26,IKC.dim,2,.35);continue}
  const f=b.st==='form',al=f?.35+.5*b.t:1,mc=b.mode==='sealed'?mixc(pc().se,'#ffffff',.3):'#7ee7ea';
  rr(x,0,CHW,26,rgba('#1a2650',al));rr(x,0,CHW,5,rgba(mc,al));rr(x+CHW,0,14,26,rgba('#101a40',al));
  if(b.mode==='sealed'){g2.globalAlpha=al;rr(x+CHW/2-10,18,20,14,'#05060f');arc(x+CHW/2,36,8,3.14,0,mc,3);g2.globalAlpha=1;gl(x+CHW/2,10,120,mc,.25*al)}
  ln(x+CHW/2,26,x+CHW/2,640,mixc('#2a4a58',mc,al),f?2:3,.5*al);cube(x+CHW/2,640,26,mc,al,1);
  if(f){arc(x+CHW/2,150,30,-1.57,-1.57+6.28*b.t,'#ffffff',5,.9);gear(x+CHW/2,150,16,t*(1+b.t*4),IKC.steel,6,.9);T2('ACCEPTED?',x+CHW/2,200,IKC.light,11)}
  if(i>0&&V.blocks[i-1])ln(CHX[i-1]+CHW,640,x,640,LC('chain'),4,.8)}
 if(!V.blocks.length)T2('THE ROAD CONTINUES WHERE HISTORY DOES',6650,60,rgba(IKC.light,.5),12);
 if(V.epoch>=1||onS(6650,0))observerArt2(t)}
function observerArt2(t){}
function core(t,p){if(!onS(8200,1300))return;const a=V.aw,fa=V.fin?1:0,L=V.L;
 // the deep machine: every earlier world, as one structure
 rr(CORE0,0,EXITX-CORE0,0,'#000');for(let i=0;i<8;i++){const x=CORE0+120+i*240;rr(x,0,40,560,'#0b1020');rr(x,560,40,6,rgba(LC(LK[i%6]),.4+.5*L[LK[i%6]]))}
 // origin stone floor tiles
 for(let i=0;i<10;i++)rr(CORE0+i*200,0,196,6,i%2?'#141b33':'#10162a');
 // shielded lattice (hexagons) on the walls
 for(let i=0;i<14;i++)for(let j=0;j<4;j++){const x=CORE0+90+i*130+(j%2)*65,y=330+j*54;g2.globalAlpha=.1+.5*L.priv;g2.strokeStyle=LC('priv');g2.lineWidth=Math.max(1,2*U);g2.beginPath();for(let k=0;k<6;k++){const q=k/6*6.28;g2.lineTo(X(x+Math.cos(q)*30),Y(y+Math.sin(q)*30))}g2.closePath();g2.stroke()}g2.globalAlpha=1;
 // proof rings
 for(let k=0;k<3;k++)ring(X(8000+k*500),Y(640),(70+k*10)*U,.3-k*.2,LC('proof'),t);
 // library shelves of keys
 for(let i=0;i<6;i++){rr(7340+i*30,0,22,180,'#0e1427');if(i%2)cc(7351+i*30,100,5,LC('auth'),.8)}
 // orchard roots hanging from the ceiling
 for(let i=0;i<9;i++){const x=7450+i*190;ln(x,700,x+Math.sin(i)*40,540-(i%3)*60,LC('state'),3,.3+.6*L.state)}
 // ironwood gears
 gear(8900,430,120,t*.2*(.3+L.adapt),LC('adapt'),14,.5+.5*L.adapt);gear(8750,520,60,-t*.4*(.3+L.adapt),LC('adapt'),9,.5+.5*L.adapt);
 // blocks on rails
 for(let i=0;i<5;i++){const x=7500+((t*40*(.3+L.chain)+i*320)%1500);cube(x,610,18,LC('chain'),.4+.5*L.chain,0)}
 // the view socket, and the heart
 rr(VIEWS-16,70,32,60,'#101a40');stroke(VIEWS-16,70,32,60,IKC.gold,2,V.audit>0?1:.6);ln(VIEWS-5,100,VIEWS+5,100,IKC.gold,3,.6);ln(VIEWS,95,VIEWS,112,IKC.gold,3,.6);if(V.audit>0)gl(VIEWS,100,80,IKC.gold,.7);T2('VIEW',VIEWS,150,IKC.gold,11);
 const hp=.3+.5*a+.5*fa;gl(HEART,240,320,mixc(pc().pr,pc().se,.5),.2+.3*hp);gear(HEART,240,150,t*.15*(.2+hp),LC('state'),20,.6+.4*hp);gear(HEART,240,96,-t*.3*(.2+hp),LC('proof'),12,.8);gear(HEART,240,52,t*.5,LC('priv'),8,.9);
 cc(HEART,240,16+4*Math.sin(t*3),V.fin?'#ffffff':mixc('#2a3560',pc().pr,V.aw),1);rr(HEART-40,0,80,80,'#101a40');
 if(V.fx.ring||V.elegant&&V.fin){ring(X(HEART),Y(240),210*U,.1,'#ffffff',t);ring(X(HEART),Y(240),235*U,-.07,IKC.gold,t)}
 // the east door
 const o=V.exitOpen?1:V.fin?sm(14,16,V.ft):0;rr(EXITX-30,0,60,420*(1-o)+2,'#0a0f1e');if(!o)stroke(EXITX-30,0,60,420,IKC.steel,3,.7);if(o>0)gl(EXITX+80,200,420,'#ffffff',.2+.5*o)}
function outside(t,p){if(V.sky<.02&&!V.exitOpen)return;const s=V.sky,x0=EXITX;if(!onS(10400,1900))return;
 pl([[x0,0],[LW,0],[LW,-200],[x0,-200]],mixc('#0c0e19',mixc(p.pr,'#000000',.55),s));rr(x0,0,LW-x0,5,rgba('#ffffff',.3*s+.2));
 for(let i=0;i<30;i++){const x=x0+60+i*90;rr(x,0,50,3,rgba(p.se,.2+.5*s*((i%3)/2+.3)))}
 // the road of kept blocks continues over the horizon
 for(let i=0;i<9;i++){const x=9500+i*330;cube(x,200+i*28+Math.sin(t+i)*6,16+i,mixc(p.se,'#ffffff',.3),.4+.5*s,1);if(i)ln(x-330+20,200+(i-1)*28,x-20,200+i*28,mixc(p.se,'#ffffff',.3),2,.6*s)}
 // luminous trees, a library of arches, a rail: everything the player carried out of the machine
 for(let i=0;i<5;i++){const x=9380+i*420;ln(x,0,x,150+(i%2)*30,'#1a1208',10,s);cc(x,190+(i%2)*30,60,mixc(p.ac,'#103a22',.5),.55*s);cc(x,190+(i%2)*30,18,'#ffffff',.18*s);gl(x,190,150,p.ac,.25*s)}
 if(V.blue)for(let i=0;i<4;i++){const x=10050+i*190;rr(x,0,10,230,rgba(IKC.gold,.5*s));rr(x+110,0,10,230,rgba(IKC.gold,.5*s));rr(x,230,120,8,rgba(IKC.gold,.5*s))}
 if(V.elegant)for(let k=0;k<3;k++)ring(X(10800),Y(420),(120+k*40)*U,.05+k*.03,'#ffffff',t);
 gl(10300,360,700,p.pr,.18*s);gl(11000,300,600,p.se,.15*s)}
function substrate(t,p){if(V.lay!==1&&!onS(5200,2400))return;
 // ladder
 rr(HATCH-14,FL,6,-FL-30,IKC.steel);rr(HATCH+8,FL,6,-FL-30,IKC.steel);for(let i=0;i<8;i++)rr(HATCH-14,FL+30+i*40,28,3,IKC.steel);
 // membranes: privacy fields that admit only what is hidden
 [MEM0,MEM1].forEach(x=>{const al=(V.shield?.2:.55)+.15*Math.sin(t*3);rr(x-8,FL+260,16,260,rgba(col.priv(),al));for(let i=0;i<8;i++)ln(x-8,FL+10+i*32,x+8,FL+26+i*32,col.priv(),2,al+.2);if(V.shield)ln(x,FL,x,FL+260,'#ffffff',2,.5)});
 // first designs
 EXH.forEach((x,i)=>{const on=V.ex[i];rr(x-40,FL+90,80,90,'#0d1424');stroke(x-40,FL+90,80,90,on?IKC.gold:IKC.dim,2,on?.9:.6);
  const gx=x,gy2=FL+135;if(i===0){for(let k=0;k<3;k++){rr(gx-30+k*22,gy2-26,16,52,rgba('#9fd8ff',.3));stroke(gx-30+k*22,gy2-26,16,52,'#cfd8f0',1)}}
  if(i===1)for(let k=0;k<3;k++){rr(gx-30+k*22,gy2-26,16,52,'#1a2038');T2('?',gx-22+k*22,gy2,IKC.dim,11)}
  if(i===2){rr(gx-30,gy2-30,6,60,'#2a3456');rr(gx+24,gy2-30,6,60,'#2a3456');ln(gx-24,gy2-30,gx+24,gy2-30,'#2a3456',4,1)}
  if(i===3){cc(gx-16,gy2,12,IKC.amber,.8);cc(gx+16,gy2,12,pc().pr,.8);T2('MINE',gx-16,gy2-26,IKC.dim,9);T2('MINE',gx+16,gy2-26,IKC.dim,9)}
  if(i===4){pl([[gx-12,gy2-30],[gx+12,gy2-30],[gx+16,gy2+30],[gx-16,gy2+30]],'#2c3552');cc(gx,gy2-40,10,'#2c3552')}
  T2('v'+i,x,FL+195,on?IKC.gold:IKC.dim,11)});
 rr(PLAQ-30,FL,60,50,'#0d1424');stroke(PLAQ-30,FL,60,50,IKC.gold,2,.6);
 if(!V.keys.iron){gl(IRONX,FL+110,90,IKC.gold,.5+.2*Math.sin(t*3));ln(IRONX,FL+80,IRONX,FL+150,IKC.gold,5,1);cc(IRONX,FL+158,10,IKC.gold,1);ln(IRONX,FL+85,IRONX+16,FL+85,IKC.gold,4,1)}}
function blueprint(t){if(!V.blue)return;const L=[[PLINTH+130,RESX[0],'POWERS'],[2400,2400,'WAKES THE GAZE'],[2700,PED,'WITNESS'],[OUTS,PSOCK,'PROOF'],[HATCH,LEVER,'AUTHORITY'],[LEVER,WALLX,'MARKS'],[LEVER,CHX[0],'MINTS'],[CHX[1],TURN,'ADAPTS'],[CHX[2],HEART,'OPENS']];
 g2.save();g2.setLineDash([10*U,8*U]);L.forEach(([a,b,l],i)=>{const y=700+i*14;g2.strokeStyle=IKC.gold;g2.globalAlpha=.4;g2.lineWidth=Math.max(1,2*U);g2.beginPath();g2.moveTo(X(a),Y(660));g2.quadraticCurveTo(X((a+b)/2),Y(y+120),X(b),Y(660));g2.stroke();g2.globalAlpha=1;T2(l,(a+b)/2,y+30,IKC.gold,10)});g2.restore()}
function beacons(w,h,t,p){if(V.beacon<=0&&!V.fin)return;const k=V.look||(V.fin===1&&V.fx.z3)?1:0;if(!k)return;const N=['ORIGIN','SHIELD','PROOF','KEYS','ORCHARD','IRONWOOD','BLOCKS'],cx=X(HEART),cy=Y(260);g2.save();
 N.forEach((n,i)=>{const x=w*(.1+.13*i),y=h*(.1+.05*Math.sin(i*1.3+t*.4)),c=[p.pr,p.se,p.ac][i%3];g2.globalAlpha=.55;g2.strokeStyle=c;g2.lineWidth=2;g2.setLineDash([6,8]);g2.beginPath();g2.moveTo(x,y+14);g2.lineTo(X(Math.max(1500,Math.min(8300,2400+i*850))),Y(700));g2.stroke();g2.setLineDash([]);
  g2.globalAlpha=1;g2.shadowColor=c;g2.shadowBlur=22;g2.fillStyle=c;g2.beginPath();g2.arc(x,y,9,0,7);g2.fill();g2.shadowBlur=0;g2.font=MONOF(11);g2.textAlign='center';g2.fillStyle='#ece8df';g2.fillText(n,x,y-18)});g2.restore()}
function npcs(t,p){['jeff','ws','hob','tender','watch'].forEach(id=>{const n=NP[id],[x,]=npcAt(id);if(!onS(x,150))return;const sx=X(x),sy=Y(0),bob=Math.sin(t*2+x)*3*U,h_=PH*U*1.05;
  g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,sy+3,h_*.22,5*U,0,0,7);g2.fill();
  if(n.img&&n.img.width){const w_=h_*n.img.width/n.img.height;g2.save();g2.shadowColor=n.pal[0];g2.shadowBlur=16;g2.imageSmoothingEnabled=false;g2.translate(sx,sy-bob);g2.scale(V.px<x?-1:1,1);g2.drawImage(n.img,-w_/2,-h_,w_,h_);g2.restore()}
  else{g2.fillStyle='#0a1030';g2.beginPath();g2.moveTo(sx-18*U,sy);g2.lineTo(sx-10*U,sy-78*U+bob);g2.lineTo(sx+10*U,sy-78*U+bob);g2.lineTo(sx+18*U,sy);g2.fill();g2.strokeStyle=rgba(n.col,.8);g2.lineWidth=2;g2.stroke();cc(x,70+bob/U*-1+8,7,'#ffffff',1);ln(x+6,50,x+26,64,n.col,3,1)}
  if(id==='jeff'&&V.gaze&&(V.fin===0)){g2.globalAlpha=.4;g2.strokeStyle=col.priv();g2.lineWidth=2.5;g2.beginPath();g2.arc(sx,sy-h_*.5,h_*.62,0,7);g2.stroke();g2.globalAlpha=1}
  tx_(n.n,sx,sy-h_-8,n.col,MONO(11))})}
function waveArt(){V.waves.forEach(q=>{const a=1-q.t/2.2,c=col[q.k]();for(let i=0;i<3;i++)arc(q.x,150,Math.max(1,(q.t-i*.18)*560),0,6.283,c,8-i*2,Math.max(0,a*(.8-i*.2)));gl(q.x,150,300*(1-q.t/2.2)+60,c,.7*a)})}
// ---- VISUAL POLISH (render-only; deliberately light: this world is a reference for the others) ----
const Zp=window.ZKP;
const mWorld=f=>{g2.save();g2.translate(-V.cx*U,GY+V.cy*U);g2.scale(U,U);f();g2.restore()};   // world units, y up is negative (matches Y())
function mGround(t,p){if(!Zp)return;const y0=Y(0);if(y0<-30||y0>H_+30)return;const x0=V.cx-60,x1=V.cx+W_/U+60;
 mWorld(()=>{GA.forEach(([a0,a1])=>{const l=Math.max(a0,x0),r=Math.min(a1,x1);if(r<=l)return;g2.strokeStyle='#000';g2.lineWidth=1.2;g2.globalAlpha=.5;g2.beginPath();g2.moveTo(l,26);g2.lineTo(r,26);   // plate seams
  for(let wx=Math.ceil(l/150)*150;wx<r;wx+=150){g2.moveTo(wx,6);g2.lineTo(wx,64)}g2.stroke();g2.fillStyle=p.se;g2.globalAlpha=.4;for(let wx=Math.ceil(l/150)*150;wx<r;wx+=150){g2.fillRect(wx-9,10,2.4,2.4);g2.fillRect(wx+7,10,2.4,2.4)}   // rivets
  g2.globalAlpha=1;Zp.grit(g2,l,r,16,(H_-GY)/U,32,'#1a2038',.7,6,3,.28)})})}
function mSlabs(t,p){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60;mWorld(()=>{
 PLAT0.forEach(([x,wd,top])=>{if(x+wd<x0||x>x1)return;const h=top>0?top:10;if(h>40)Zp.rows(g2,x,-top,wd,h,'#0b1020',.5,26,60);g2.globalAlpha=.3;g2.fillStyle='#000';g2.fillRect(x+2,-top+4,wd-4,3);g2.globalAlpha=1;Zp.edge(g2,x,-top,wd,Math.min(h,14),IKC.light,'#000',.2,1.5);
  if(top>100){g2.fillStyle='#0b1020';g2.fillRect(x-6,-top-5,wd+12,5);g2.globalAlpha=.4;g2.fillStyle=IKC.light;g2.fillRect(x-6,-top-5,wd+12,1.2);g2.globalAlpha=1}});   // cap lip on the tall slabs
 PLAT1.forEach(([x,wd,top])=>{if(x+wd<x0||x>x1)return;Zp.rows(g2,x,-top,wd,top-FL,'#0b1020',.5,26,60);Zp.edge(g2,x,-top,wd,top-FL,IKC.gold,'#000',.18,1.5)})})}
function mApproach(t,p){if(!Zp||!onS(260,500))return;const a=V.aw;mWorld(()=>{Zp.rows(g2,150,-300,60,300,'#0a0e1e',.6,28,60);Zp.rows(g2,310,-300,60,300,'#0a0e1e',.6,28,60);Zp.rows(g2,130,-330,260,50,'#0a0e1e',.6,16,40);
 Zp.edge(g2,150,-300,60,300,p.pr,'#000',.15+a*.2,1.5);Zp.edge(g2,310,-300,60,300,p.pr,'#000',.15+a*.2,1.5)})}
function mMotes(t,p){if(!Zp||V.lay!==0)return;Zp.motes(g2,0,0,W_,Math.max(40,Y(0)),t,22,p.se,{alpha:.24,size:Math.max(1.5,2*U),speed:6,seed:13})}
function scene(w,h,gy,t,p){
 farArt(w,h,gy,t,p);groundArt(t,p);mGround(t,p);slabs();mSlabs(t,p);conduits(t,p);approach(t,p);mApproach(t,p);reservoir(t,p);turnstile(t,p);proving(t,p);gateArt(t,p);chasm(t,p);core(t,p);substrate(t,p);outside(t,p);observerArt(t,p);npcs(t,p);blueprint(t);waveArt();mMotes(t,p);
 if(V.lay===1)rc(0,0,W_,Math.max(0,Y(-36)),'#04070d')}
// ======================= player, HUD =======================
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0,wS=1+.22*V.sq-idle,hS=1-.22*V.sq+idle;
 if(V.fade&&V.fade.d>0)g2.globalAlpha=1-V.fade.t*.9;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(V.lay?FL:0)+3,aw*.38,5*U,0,0,7);g2.fill();
 g2.save();g2.translate(sx,sy);g2.scale(V.face*wS,hS);g2.imageSmoothingEnabled=false;g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 if(V.inBeam&&!V.shield&&V.hand&&V.hand.k==='cell'){g2.globalAlpha=.35;g2.strokeStyle=IKC.red;g2.lineWidth=3;g2.beginPath();g2.arc(sx,sy-ph*.5,ph*.6,0,7);g2.stroke();g2.globalAlpha=1}
 if(V.shield){g2.save();g2.globalAlpha=.5;g2.strokeStyle=p.se;g2.lineWidth=2.5;g2.beginPath();g2.arc(sx,sy-ph*.5,ph*.62+Math.sin(T*3)*2*U,0,7);g2.stroke();g2.globalAlpha=.16;g2.fillStyle=p.se;g2.fill();g2.restore()}
 const h=V.hand;if(h){const hx_=sx+V.face*ph*.32,hy_=sy-ph*1.08+Math.sin(T*3)*3*U;if(h.k==='cell'){const c=h.c,col_=cellCol(c);g2.shadowColor=col_;g2.shadowBlur=18;ci(hx_,hy_,12*U,col_,1);g2.shadowBlur=0;ci(hx_-3*U,hy_-3*U,4*U,'#fff',.3);if(V.shield){g2.font=MONO(11);tx_(String(c.v),hx_,hy_+4*U,'#05060f',MONO(12))}}
  else{g2.shadowColor=p.ac;g2.shadowBlur=14;g2.fillStyle=p.ac;g2.save();g2.translate(hx_,hy_);g2.rotate(.785);g2.fillRect(-8*U,-8*U,16*U,16*U);g2.restore();g2.shadowBlur=0}}
 g2.globalAlpha=1;if(V.keys.glass&&false){}}
function drawFront(p){V.vp.forEach(q=>{g2.globalAlpha=Math.max(0,q.l);rc(X(q.x),Y(q.y),q.s*U,q.s*U,q.c)});g2.globalAlpha=1;
 V.fl.forEach(f=>{g2.globalAlpha=Math.min(1,f.l);T2(f.s,f.x,f.y+(2.6-f.l)*30,f.c,12)});g2.globalAlpha=1;beacons(W_,H_,T,p);
 if(V.flash>0){g2.globalAlpha=Math.min(.35,V.flash*.5);rc(0,0,W_,H_,V.fin?'#ffffff':IKC.red);g2.globalAlpha=1}
 if(V.fade){g2.globalAlpha=V.fade.t;rc(0,0,W_,H_,'#02030a');g2.globalAlpha=1}
 if(V.look){const t=V.look.t,a=sm(.5,3,t);if(pim&&pim.complete&&pim.width){const ph=H_*.34,aw2=ph*pim.width/pim.height;g2.save();g2.globalAlpha=a;g2.shadowColor=p.pr;g2.shadowBlur=30;g2.imageSmoothingEnabled=false;g2.translate(W_*.9,H_*.9);g2.scale(-1,1);g2.drawImage(pim,-aw2/2,-ph,aw2,ph);g2.restore();g2.globalAlpha=1}}}
function drawHud(p){g2.textAlign='center';
 if(V.at>0&&V.area&&!V.look&&V.fin!==1){g2.globalAlpha=Math.min(1,V.at);tx_(V.area,W_/2,34,'#ece8df',MONOF(15));g2.globalAlpha=1}
 if(V.fin===1&&V.fx.z3){const a=sm(10.6,12,V.ft);g2.globalAlpha=a;g2.shadowColor=p.pr;g2.shadowBlur=30;g2.font="400 "+Math.round(Math.max(26,Math.min(W_*.05,64)))+"px 'Abril Fatface',serif";g2.fillStyle='#fff';g2.fillText('THE ZKSCAPE MACHINE IS ALIVE.',W_/2,H_*.34);g2.shadowBlur=0;g2.globalAlpha=1}
 // the chain as a strip, the two keys, the shield
 let x=12;g2.textAlign='left';for(let i=0;i<3;i++){const b=V.blocks[i];rc(x,12,14,14,b?(b.st==='conf'?(b.mode==='sealed'?'#ffffff':'#7ee7ea'):'#456'):'#1a2038');x+=18}
 x=12;if(V.keys.glass){g2.strokeStyle='#cfd8f0';g2.lineWidth=2;g2.strokeRect(x,32,12,12);x+=18}if(V.keys.iron){rc(x,32,12,12,IKC.gold);x+=18}
 if(V.shield||(V.readN>0&&!V.said.sh)){const al=V.shield?1:.6+.4*Math.sin(T*5);g2.globalAlpha=al;g2.strokeStyle=p.se;g2.lineWidth=2;g2.beginPath();g2.arc(coarse?70:84,coarse?64:H_-34,15,0,7);g2.stroke();g2.fillStyle=p.se;g2.font=MONOF(13);g2.textAlign='center';g2.fillText('Q',coarse?70:84,coarse?69:H_-29);g2.globalAlpha=1}
 if(V.near&&V.mt<=0&&!V.dlg&&!V.lock){const o=V.near;tx_(coarse?'\u25C9 '+o.l:'[E] '+o.l,X(o.x),Y(o.y+(o.pri?150:140)),'#e8f6ff',MONO(12))}
 if(V.msg&&V.mt>0&&!V.look&&!V.dlg){const m=V.msg,mw=Math.min(W_-24,680),bx=(W_-mw)/2;g2.font=MONOF(14);const l2=wrap(m.s,mw-32),hd=m.h?30:0,bh=22+hd+l2.length*22,by=H_-bh-(coarse?150:22);g2.save();g2.globalAlpha=Math.min(1,V.mt*2);rc(bx,by,mw,bh,'#05060ff2');g2.strokeStyle=m.c;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);g2.textAlign='left';
  if(m.h){g2.fillStyle=m.c;g2.font="700 "+Math.round(Math.max(18,22*Math.min(1.4,U/Math.max(.01,V.zoom))))+"px 'Abril Fatface',serif";g2.fillText(m.h,bx+16,by+30)}g2.fillStyle='#ece8df';g2.font=MONOF(14);l2.forEach((l,i)=>g2.fillText(l,bx+16,by+hd+26+i*22));g2.restore()}
 if(V.dlg){const d=V.dlg,n=NP[d.who],hasP=!!(n.img&&n.img.width);g2.font=MONOF(15);const ln=wrap(d.L[d.i].slice(0,Math.floor(d.c)),W_-100);const B=dlgBox(W_,H_,coarse,ln,{img:true,max:660});rc(B.bx,B.by,B.mw,B.bh,'#05060ff2');g2.strokeStyle=n.pal[0]||n.col;g2.lineWidth=2;g2.strokeRect(B.bx,B.by,B.mw,B.bh);
  if(hasP){g2.imageSmoothingEnabled=false;g2.drawImage(n.img,B.bx+10,B.by+10,64,64)}else{g2.fillStyle=n.col;g2.beginPath();g2.arc(B.bx+42,B.by+42,22,0,7);g2.fill()}
  g2.textAlign='left';g2.fillStyle=n.col;g2.font=MONOF(13);g2.fillText(n.n,B.bx+B.ix,B.by+26);g2.fillStyle='#ece8df';g2.font=MONOF(15);B.win.forEach((l,i)=>g2.fillText(l,B.bx+B.ix,B.by+B.head+i*B.lh));
  g2.fillStyle='#8a867c';g2.font=MONOF(11);g2.textAlign='right';g2.fillText(coarse?(B.more?'TAP \u25BC MORE':'TAP'):'[E]',B.bx+B.mw-12,B.by+B.bh-8)}}
// ======================= the Explorer Card: a sigil of how this machine was brought to life =======================
function stampCard(){try{if(!S.machine||!$z('s-end').classList.contains('on'))return;const c=$z('cc'),g=c.getContext('2d'),m=S.machine,P=S.pal,cx=1490,cy=122,rr_=58;
 g.save();g.fillStyle='#05060f';g.beginPath();g.arc(cx,cy,rr_+12,0,7);g.fill();const acc=m.route==='priv'?P[1]||P[0]:m.route==='proof'?P[2]||P[0]:P[0];
 const n=3+(m.blue?1:0)+(m.elegant?1:0);for(let k=0;k<n;k++){g.strokeStyle=k%3===0?P[0]:k%3===1?(P[1]||P[0]):(P[2]||P[0]);g.lineWidth=2+(m.elegant?1.5:0);g.setLineDash(k%2?[6,5]:[]);g.beginPath();g.arc(cx,cy,rr_-k*9,0,7);g.stroke()}
 g.setLineDash([]);(m.blocks||[]).forEach((b,i)=>{const a=-1.57+i*2.094;g.fillStyle=b==='sealed'?'#ffffff':acc;g.beginPath();g.arc(cx+Math.cos(a)*(rr_+6),cy+Math.sin(a)*(rr_+6),b==='sealed'?7:5,0,7);g.fill()});
 g.fillStyle=acc;g.beginPath();g.arc(cx,cy,7,0,7);g.fill();g.font='600 13px ui-monospace,monospace';g.textAlign='center';g.fillStyle='#ece8df';g.fillText(m.elegant?'SEALED CHAIN':'MACHINE ALIVE',cx,cy+rr_+34);g.restore()}catch(e){}}
// ======================= wiring into the shared engine =======================
DEC.machine=function(w,h,gy,t,p){if(!isM())return;scene(w,h,gy,t,p)};
const _bgm=bg;bg=function(w,h,gy,p){if(isM()){frame(w,h,gy);cam=V.cx*U;skyTune();_bgm(w,h,gy+V.cy*U*.3,p)}else _bgm(w,h,gy,p)};
const _avm=avatar;avatar=function(w,h,gy,p){if(isM()){drawPlayer(p);drawFront(p);drawHud(p)}else _avm(w,h,gy,p)};
const _stm=startWorld;startWorld=function(i){const me=W[i].id==='machine';if(me){mInit();if(window.__ZKTEST)window.__zkM={get V(){return V},IAS,act,mint,heart,audit,K,say,tele,cellById,takeCell,pull,toggleShield,stepWorld}}_stm(i);if(me)$z('wf').innerHTML=''};
const _spm=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spm()};
const _enm=end;end=function(){_enm();[500,1200,2500].forEach(d=>setTimeout(stampCard,d))};
});

/* ZKSCAPE world 11: THE NOIR GATE - inside the wallet.

   THE QUESTION: what does a wallet control, what does it know, and what can it reveal?

   THE MECHANIC: authority. The player holds one kind of authority at a time (press Q to change what is
   in hand): nothing, the spending key, an address, an incoming viewing key, a full viewing key. The whole
   city answers to what you are holding. Objects that look the same behave differently depending on it,
   and that difference is the lesson. The Key Vault's derivation press only works downhill: from a
   spending key you can derive a viewing key and an address, never the other way.

   LEVEL: eight connected rooms on one corridor. Arrival -> Key Vault (what each authority can and cannot
   do) -> Receiving Gallery (receiving needs nothing from you) -> Transaction Workshop (construct, authorize,
   broadcast are three separate stations) -> Transparent/Shielded Passage (read the same traffic through
   different lenses) -> Viewing Chamber (selective disclosure, with real trade-offs) -> Recovery Room
   (a fictional phrase restores a wallet; the wrong order restores a different one) -> the Gate.
   The Gate does not open because everything was collected: it opens because the toll was constructed AND
   authorized AND the right amount of information was disclosed about it.

   EVERYTHING IS SIMULATED. Addresses and the recovery phrase are fictional and nonfunctional, balances are
   game state, no key material of any kind exists in this file.

   ENGINE: same hooks as every adventure world (bg / avatar / startWorld / stopWorld), plus a scoped fore()
   so the shared fog wedges cannot tint this world. Persistence is S.noir through the engine's save().
   The registration block below is the original, unchanged. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'noir',n:'NOIR',bonus:1,title:'THE NOIR GATE',sub:'A private wallet city',q:'Self-custody: your keys, your control.',video:'videos/noirwallet.mp4',link:'noir',linkLabel:'VISIT NOIR',desc:'Explore a self-custodial Zcash wallet built for private Zcash payments and dApp interactions.',steps:[
 'Noir is a self-custodial Zcash wallet for private Zcash payments and dApp interactions.','It is installed as a Chrome extension.','You create or restore a wallet and back up your recovery phrase. Never share it.','The wallet synchronizes; then you can receive ZEC and shield transparent funds.','Optional world: you never need to install or fund a wallet to finish ZKSCAPE.'],deep:'See the official Noir docs for current setup steps.'});
A.noir='Noir Key';
A.noir='Noir Key';
// Noir keeps its own palette (ink, steel, one warm lamp). The shared fog is dark so the engine's foreground
// wedges, which paint th.fog, can never become the pale wash an earlier fog colour produced.
TH.noir={sky:['#03050b','#0b121f'],moon:[.85,.12,.06,'#9fb8d8'],mt:'#05080f',fog:'#08101c',amb:'dust'};
DEC.noir=function(){};GIANT.noir=function(){};
LM.noir=function(x,y,s,c,t,a,B){for(let k=0;k<5;k++)hg.fillRect(-s+k*s*.45,-s*(.6+(k%3)*.4),s*.35,s*(.6+(k%3)*.4)+s*.4);};

// ======================= layout =======================
const LW=7400,HW=30,PH=112,SPD=310,JMP=830,GRAV=2500;
const ROOMS=[[0,'ARRIVAL CHAMBER'],[950,'KEY VAULT'],[2250,'RECEIVING GALLERY'],[3150,'TRANSACTION WORKSHOP'],
 [4250,'THE PASSAGE'],[5250,'VIEWING CHAMBER'],[6050,'RECOVERY ROOM'],[6750,'THE NOIR GATE']];
const XS={ilseA:330,core:640,press:1150,mail:1500,glass:1760,lift:2030,shut1:2200,
 pl:[2450,2650,2850],desk:3330,seal:3620,out:3910,board:3620,
 post:4980,shut2:5200,ilseF:5440,cons:5700,panel:5960,altar:6300,ilseH:6700,gate:7050};
const C={bone:'#e8dcc0',amber:'#ffb347',teal:'#5fd0c8',ice:'#8fb8ff',ink:'#05070e',ink2:'#0b101c',ink3:'#141b2c',
 steel:'#222c44',steel2:'#34425f',steel3:'#52638a',txt:'#e9eef8',mu:'#8794b0',bad:'#ff8a7a',ok:'#7cf0b6'};
// what is in hand. Colour is the identity of each authority everywhere in the city.
const AU={none:{n:'EMPTY HAND',c:'#9aa3b8'},spend:{n:'SPENDING KEY',c:C.amber},addr:{n:'ADDRESS',c:C.bone},
 ivk:{n:'INCOMING VIEW',c:C.teal},fvk:{n:'FULL VIEW',c:C.ice}};
const FEE=.0001,TOLL=1;
// fictional recovery card (six words, in order) and the stones on the altar. Not a real seed phrase.
const CARD=['ember','orchid','vessel','hollow','signal','marrow'],STONES=['hollow','lantern','ember','signal','copper','orchid','marrow','vessel'];
const DEST=[{id:'mira',n:'MIRA',pool:'S',a:'zs-demo-mira-0001'},{id:'kiosk',n:'THE KIOSK',pool:'T',a:'t1-demo-kiosk-0002'}];
const PLN=[{n:'t-ADDRESS',pool:'T',a:'t1-demo-gallery-0007',d:'A transparent address.'},
           {n:'zs-ADDRESS',pool:'S',a:'zs-demo-gallery-0008',d:'A shielded address.'},
           {n:'u-ADDRESS',pool:'S',a:'u1-demo-gallery-0009',d:'A unified address: it bundles receivers and the payer\u2019s wallet picks one it supports. Here, a shielded one.'}];

let V=null,U=1,W_=0,H_=0,GY=0;
const K={l:0,r:0,j:0,jp:0,e:0};
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const X=x=>(x-V.cx)*U,Y=y=>GY-y*U,isN=()=>run&&cur&&cur.id==='noir'&&V&&V.on;
const L=(x,f)=>(x-V.cx*f)*U;
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
const P=(x,y,w,h,c,a)=>{if(a!=null)g2.globalAlpha=a;g2.fillStyle=c;g2.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));if(a!=null)g2.globalAlpha=1};
const rr=(x,y,w,h,c,a)=>P(X(x),Y(y+h),w*U,h*U,c,a);   // y is the BOTTOM edge of the rectangle, in world height
const mxc=(a,b,t)=>{t=clamp(t,0,1);const q=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A_=q(a),B_=q(b);
 return '#'+A_.map((v,i)=>Math.round(v+(B_[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const TS=(s,x,y,c,n,al)=>{g2.save();g2.textAlign=al||'center';g2.font=MONO(n);g2.lineWidth=4;g2.strokeStyle='#05070ecc';g2.lineJoin='round';g2.strokeText(s,x,y);g2.fillStyle=c;g2.fillText(s,x,y);g2.restore()};

// ======================= persistence (S.noir, written through the engine's save()) =======================
const SVn=()=>{S.noir=S.noir||{v:1};const n=S.noir;n.f=n.f||{};n.bal=n.bal||0;n.hist=n.hist||[];n.disc=n.disc||{};if(n.plinth==null)n.plinth=-1;return n};
const F=()=>SVn().f;
const keep=()=>{try{save()}catch(e){}};
const has=k=>k==='none'||(k==='spend'?!!F().root:!!F()['d_'+k]);

// ======================= input =======================
if(!window.__zkNO){window.__zkNO=1;
 const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',
  KeyE:'e',Enter:'e',KeyF:'e',KeyQ:'q',KeyR:'rc',Escape:'esc'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isN())return;
  if(V.ui){e.preventDefault();const u=V.ui;
   if(k==='u'||k==='l'){u.sel=(u.sel+u.o.length-1)%u.o.length;AM.sfx('click')}
   else if(k==='d'||k==='r'){u.sel=(u.sel+1)%u.o.length;AM.sfx('click')}
   else if(k==='e'||k==='j'){if(!e.repeat)choose(u.sel)}
   else if((k==='esc'||k==='q')&&u.cancel!==false){V.ui=null;AM.sfx('click');if(u.x)u.x()}
   return}
  e.preventDefault();
  if(k==='e'){if(!e.repeat)K.e=1;return}
  if(k==='q'){if(!e.repeat)cyc();return}
  if(k==='rc'){if(!e.repeat)cardView();return}
  if(k==='esc')return;
  if(k==='j'||k==='u'){if(!K.j)K.jp=1;K.j=1;return}
  if(k==='d')return;
  K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k==='j'||k==='u')K.j=0;else if(k==='l'||k==='r')K[k]=0});   // K.e is a one-shot consumed by the frame; clearing it here would drop a quick tap
 addEventListener('blur',()=>{K.l=K.r=K.j=0});}
// taps: options in the open panel are tappable; nothing else reacts to the canvas, so a stray click can never leave the world
addEventListener('pointerdown',e=>{if(!isN()||!V.ui||e.target!==g2.canvas)return;
 const r=g2.canvas.getBoundingClientRect(),px=(e.clientX-r.left)*g2.canvas.width/r.width,py=(e.clientY-r.top)*g2.canvas.height/r.height;
 for(const q of(V.uiR||[]))if(px>=q.x&&px<=q.x+q.w&&py>=q.y&&py<=q.y+q.h){V.ui.sel=q.i;choose(q.i);return}});
function ctl(on){let c=$z('noctl');if(c&&c.dataset.own!=='noir'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='noctl';c.dataset.own='noir';
 c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);
  b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(!V)return;
   if(V.ui){if(v){const u=V.ui;if(k==='u'||k==='l')u.sel=(u.sel+u.o.length-1)%u.o.length;else if(k==='d'||k==='r')u.sel=(u.sel+1)%u.o.length;else if(k==='e')choose(u.sel);else if(k==='x'&&u.cancel!==false){V.ui=null}}return}
   if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}if(k==='q'){if(v)cyc();return}K[k]=v};
  b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const A1=document.createElement('div'),B1=document.createElement('div');
 A1.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));
 B1.append(mb('Q','q','change what is in hand'),mb('\uD83D\uDCAC','e','use'),mb('\u2934','j','jump'));
 c.append(A1,B1);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}

// ======================= panels: one small modal system for dialogue, choices and readouts =======================
// ui({t:title,b:text or ()=>text,o:[{l:label,f:fn}],cancel:false}). Choosing closes the panel first, so f may open the next one.
function ui(o){V.ui=o;if(o){o.sel=o.sel||0;AM.sfx('click')}}
function choose(i){const u=V.ui;if(!u)return;const op=u.o[i];if(!op)return;V.ui=null;AM.sfx('interaction');if(op.f)op.f()}
const OK=(f,l)=>[{l:l||'OK',f}];
function dlg(lines,after,who){let i=0;const step=()=>{ui({t:who||'ILSE MARROW',b:lines[i],c:C.bone,cancel:false,
 o:[{l:i<lines.length-1?'\u2026':'[ close ]',f:()=>{if(i<lines.length-1){i++;step()}else if(after)after()}}]})};step()}
const note=s=>{V.msg=s;V.mt=Math.max(5,s.length/15)};
const say=(x,s,y)=>V.ft.push({x,y:y||240,s,l:2.4});
const spark=(x,y,c,n=10)=>{for(let i=0;i<n&&V.vp.length<200;i++){const a=Math.random()*6.28,s=50+Math.random()*150;
 V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c,s:4,g:150})}};
const fmt=n=>(Math.round(n*10000)/10000).toFixed(n%1?4:1).replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'.0');
const avail=()=>SVn().bal-(V.tx&&V.tx.stage>=3&&V.tx.stage<4?V.tx.amt+FEE:0);

// ======================= authority =======================
function cyc(){if(V.ui||V.stt!=='play')return;const ord=['none','spend','addr','ivk','fvk'].filter(has);
 V.eq=ord[(ord.indexOf(V.eq)+1)%ord.length];AM.sfx('card-reveal');
 if(!F().q1){F().q1=1;keep()}}
const canSee=(dir)=>V.eq==='spend'||V.eq==='fvk'||(V.eq==='ivk'&&dir==='in');
function cardView(){if(!F().card){note('You were not given anything to keep safe yet.');return}
 ui({t:'RECOVERY CARD · FICTIONAL, NONFUNCTIONAL',c:C.bone,b:'Six words, in this order:\n\n'+CARD.map((w,i)=>(i+1)+'. '+w).join('     ')+'\n\nThis is a game prop. A real recovery phrase is never shown to a website, photographed, or typed into anything you do not fully trust.',o:OK(null,'[ put it away ]')})}

// ======================= the Arrival Chamber =======================
function ilseA(){const f=F();
 if(!f.met){dlg(['You are early. Nobody comes inside a wallet until something has already gone wrong.',
  'I am Ilse. I keep the ledger of what arrived. Not what left. That was the arrangement and I have never been told why.',
  'The Core has been cold a long time. It leans toward you; you must be carrying the root. Take this card too: six words, fictional, and not to be photographed.',
  'Walk the corridor. Pick things up, put them down, and try holding something else when a thing will not answer. Nothing here is in a hurry.'],
  ()=>{f.met=1;f.card=1;keep();AM.sfx('collectible');note('You were given a recovery card (R to read it). Wake the Core: the dormant mechanism to the right.')});return}
 const hints=[[!f.root,'The Core is to your right. It wants the root. You have it.'],[!f.lift,'The vault is the next room. Keys that look alike do different things. Try holding each one.'],
  [!F().got,'Mira will pay a receiver, once. Light one in the gallery.'],[!f.sent,'A payment is made in pieces, and each piece is a different place.'],
  [!f.pass,'Read the passage through different lenses. The same traffic says different things.'],[!f.disc,'Three people want to see inside. I only watch.'],
  [!f.rec,'Somebody left a lamp dark in the recovery room.']];
 const h=hints.find(x=>x[0]);dlg([h?h[1]:'The gate is at the far end. It takes a payment and a reason to believe you made it.'],null)}
function coreAct(){const f=F();
 if(!f.met){note('A cold mechanism, rings within rings. Someone is standing nearby, watching you look at it.');AM.sfx('interaction');return}
 if(f.root){note('The Core is awake. The corridor lights are following you, one room ahead.');AM.sfx('interaction');return}
 f.root=1;V.eq='spend';keep();AM.sfx('core-activate');V.wake=1.4;spark(XS.core,150,C.amber,28);
 note('The Core wakes. You now hold the SPENDING KEY: the root. It can do everything below it. Q changes what is in hand. IN ZCASH: a recovery phrase restores spending authority through the wallet\'s derivation scheme, and wallets can differ in how they do it. Anyone who has the phrase controls the funds, so never share it.')}

// ======================= the Key Vault =======================
const DER={spend:['fvk','ivk','addr'],fvk:['ivk','addr'],ivk:['addr'],addr:[]};
const DN={fvk:'FULL VIEWING KEY',ivk:'INCOMING VIEWING KEY',addr:'ADDRESS'};
function pressAct(){const f=F();
 if(!f.root){note('A press with a slot, and three chutes. It wants something to press.');AM.sfx('interaction');return}
 const src=V.eq;
 if(src==='none'){note('Empty hand. Hold a key (Q) and put it in the press.');return}
 const o=['fvk','ivk','addr'].map(k=>({l:'DERIVE  '+DN[k]+(has(k)?'  (already have)':''),f:()=>derive(src,k)}));
 o.push({l:'CANCEL',f:null});
 ui({t:'THE DERIVATION PRESS',c:AU[src].c,b:'In the slot: '+AU[src].n+'.\nWhat do you want to press out of it?',o})}
function derive(src,k){const f=F();
 if(!DER[src].includes(k)){AM.sfx('incorrect');V.bad=.4;
  note(src==='addr'?'An address is only a place. There is nothing in it to derive from.'
   :'The press refuses. A '+AU[src].n+' cannot make a '+DN[k]+'. It only works downhill: from a lock you can cut a keyhole, never the reverse.');return}
 if(has(k)){note('You already hold that.');return}
 f['d_'+k]=1;keep();AM.sfx('collectible');spark(XS.press,120,AU[k].c,16);
 if(!f.pressed){f.pressed=1;note('The '+DN[k]+' drops out of its chute. Notice what the press did not ask for: nothing was spent, and the spending key is still in your pocket.')}
 else note('You now hold a '+DN[k]+'. Q changes what is in hand.')}
function mailAct(){const f=F();f.mail=1;keep();AM.sfx('interaction');spark(XS.mail,100,C.bone,8);
 note(V.eq==='addr'?'You hold up the ADDRESS and a coin drops in. Notice what the mailbox needed from you: nothing. Anyone who knows where it is can pay you. Paying you gave them no power over what you hold.'
  :'A coin drops in. The slot does not check who is holding what. Anyone who has the address can pay it: receiving needs nothing from you.')}
function glassAct(){const f=F(),e=V.eq;AM.sfx('interaction');
 const rows=[['IN ','+2.0','from M.'],['OUT','-0.7','to the Kiosk'],['IN ','+1.2','from E.'],['OUT','-1.5','to Mira'],['IN ','+0.4','from M.']];
 const show=rows.map(r=>{const d=r[0].trim()==='IN'?'in':'out';return canSee(d)?r.join('  '):'\u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591  \u2591\u2591\u2591\u2591\u2591\u2591\u2591'}).join('\n');
 const msg=e==='none'?'The glass is frosted. You hold nothing, so it shows you nothing.':e==='addr'?'Frosted. An address says where to send. It knows nothing about what happened there.'
  :e==='ivk'?'Only the INCOMING half is lit. You can see what arrived. What left is behind glass you cannot see through.'
  :'Everything is lit, in and out. A viewing key sees. It cannot move any of it.';
 if(e==='ivk'||e==='fvk'||e==='spend'){f.glass=1;f['glass_'+e]=1;keep()}
 ui({t:'THE DISPLAY CASE · FICTIONAL LEDGER',c:AU[e].c,b:show+'\n\n'+msg,o:OK()})}
function liftAct(){const f=F(),e=V.eq;
 if(e==='spend'){if(f.lift){note('The lift is already raised. Spending authority moved it once.');return}
  f.lift=1;keep();AM.sfx('rise');V.liftT=0;spark(XS.lift,60,C.amber,18);note('Authorized. The brake releases and the lift climbs. The vault shutter beyond it grinds open.');return}
 AM.sfx('incorrect');V.bad=.4;
 note(e==='none'?'The lift ignores you. You hold nothing.':e==='addr'?'The brake does not move. It does not know what an address is.'
  :'The brake refuses. A viewing key shows the load; it does not have the authority to move it. Seeing is not moving.')}

// ======================= the Receiving Gallery =======================
function plinthAct(i){const f=F(),n=SVn(),p=PLN[i];
 if(n.plinth>=0){if(n.plinth===i){ui({t:p.n,c:C.bone,b:p.a+'\n'+p.d+'\nThis receiver is lit. Mira has already paid it.',o:OK()});return}
  note('The gallery keeps one receiver lit at a time, and Mira only pays once.');return}
 ui({t:p.n+' · FICTIONAL',c:C.bone,b:p.a+'\n'+p.d+'\n\nLight this receiver and let Mira pay it?',
  o:[{l:'LIGHT IT',f:()=>{n.plinth=i;V.pay=0;V.payT=0;keep();AM.sfx('rise');note('Mira steps out of the dark with a payment for the receiver you lit. IN ZCASH: a unified address bundles several receiver types, shielded and transparent, into one string, and the sender\'s wallet picks the best one it supports. Shielded payments can also carry an encrypted memo of up to 512 bytes.')}},{l:'NOT YET',f:null}]})}

// ======================= the Transaction Workshop: three stations =======================
const stageName=['NO DRAFT','CONSTRUCTED: unsigned','AUTHORIZED: signed, not sent','BROADCAST: waiting for the network','CONFIRMED'];
function deskAct(){const n=SVn();
 if(V.tx&&V.tx.stage>=1&&V.tx.stage<4){note('A draft is already on the desk ('+stageName[V.tx.stage]+'). Carry it on to the next station.');return}
 if(avail()<=FEE){AM.sfx('incorrect');V.bad=.4;note('Nothing to spend yet. The ledger shows '+fmt(n.bal)+'. Funds have to arrive first: light a receiver in the gallery.');return}
 const o=DEST.map(d=>({l:'TO  '+d.n+'   '+d.a,f:()=>amountPick(d)}));o.push({l:'CANCEL',f:null});
 ui({t:'THE DRAFTING DESK',c:C.amber,b:'Available: '+fmt(avail())+' (fictional ZEC).\nChoose where it goes. Nothing is signed or sent here: this desk only builds the transaction.',o})}
function amountPick(d){const a=avail(),vals=[.5,1,2,a-FEE].filter((v,i,s)=>v>0&&s.indexOf(v)===i);
 const o=vals.map((v,i)=>({l:(i===vals.length-1&&v===a-FEE?'ALL  ':'')+fmt(v)+' ZEC',f:()=>review(d,v)}));
 o.push({l:'TOO MUCH  ('+fmt(a+1)+' ZEC)',f:()=>review(d,a+1)});o.push({l:'BACK',f:deskAct});
 ui({t:'HOW MUCH?',c:C.amber,b:'To '+d.n+'. Available '+fmt(a)+'. Network fee '+FEE+'.',o})}
function review(d,amt){
 if(amt+FEE>avail()+1e-9){AM.sfx('incorrect');V.bad=.4;ui({t:'INSUFFICIENT FUNDS',c:C.bad,b:'You asked for '+fmt(amt)+' plus a '+FEE+' fee. You have '+fmt(avail())+'. The desk will not draft what you cannot pay.',o:[{l:'CHOOSE AGAIN',f:()=>amountPick(d)}]});return}
 ui({t:'REVIEW',c:C.amber,b:'To:      '+d.n+'  ('+(d.pool==='S'?'shielded':'transparent')+')\nAmount:  '+fmt(amt)+'\nFee:     '+FEE+'\nTotal:   '+fmt(amt+FEE)+'\nLeft:    '+fmt(avail()-amt-FEE)+'\n\nConstructing is not authorizing. This only prepares the data.',
  o:[{l:'CONSTRUCT',f:()=>{V.tx={dest:d,amt,stage:1};AM.sfx('collectible');say(XS.desk,'CONSTRUCTED',200);note('Constructed, and unsigned. It is a plan. Nobody can act on it yet. The seal press is the next station.')}},{l:'CANCEL',f:null}]})}
function sealAct(){const t=V.tx,e=V.eq;
 if(!t){note('Nothing to sign. Build a transaction at the desk first.');AM.sfx('interaction');return}
 if(t.stage>=2){note('Already authorized. Take it to the outbox.');return}
 if(e!=='spend'){AM.sfx('incorrect');V.bad=.4;
  note(e==='none'?'The press wants authority. You are holding nothing.':e==='addr'?'An address can receive. It cannot sign.':'A viewing key can read this draft but it cannot sign it. Only the spending key can authorize.');return}
 t.stage=2;AM.sfx('core-activate');spark(XS.seal,90,C.amber,20);say(XS.seal,'AUTHORIZED',200);note('Authorized. The draft is signed. Nothing has left yet: signing is not sending. IN ZCASH: only the spending key can authorize a spend. A viewing key can never sign.')}
function outAct(){const t=V.tx;
 if(!t){note('The outbox is empty.');return}
 if(t.stage<2){AM.sfx('incorrect');V.bad=.4;note('The outbox will not take an unsigned draft. The network would ignore it.');return}
 if(t.stage===3){note('Already broadcast. Watch the board.');return}
 if(t.stage===4){note('Confirmed. The board shows it.');return}
 t.stage=3;t.conf=0;t.ct=0;AM.sfx('rise');note('Broadcast. It is out there and not final: it has to wait to be included in a block.')}
function txStep(dt){const t=V.tx;if(!t||t.stage!==3)return;t.ct+=dt;
 if(t.ct>1.8){t.ct=0;t.conf++;AM.sfx('click');
  if(t.conf>=3){t.stage=4;const n=SVn();n.bal=Math.round((n.bal-t.amt-FEE)*10000)/10000;
   n.hist.push({to:t.dest.id,pool:t.dest.pool,amt:t.amt});if(n.hist.length>6)n.hist.shift();
   if(t.dest.id==='gate')V.gateTx=1;else F().sent=1;keep();mkOrbs();AM.sfx('correct');spark(XS.board,200,C.ok,18);
   note('Confirmed. The ledger now shows the new balance: '+fmt(n.bal)+'. IN ZCASH: each new block built on top of your transaction is one more confirmation, so it becomes harder to reverse.');
   if(t.dest.id==='gate')afterToll()}}}
function boardAct(){const t=V.tx;note(t?'The board: '+stageName[t.stage]+' to '+t.dest.n+', '+fmt(t.amt)+'.':'The board is blank. Three stations: construct, authorize, broadcast. Each is a different place on purpose.')}

// ======================= the Passage: the same traffic, three lenses =======================
// orb: lane T/S, mine in|out|null. Transparent traffic is public. Shielded traffic is public only as a fact.
function mkOrbs(){const n=SVn(),o=[];
 if(n.plinth>=0)o.push({id:'rx',lane:PLN[n.plinth].pool,mine:'in',amt:3,from:'Mira',to:'your receiver',sp:70,off:0});
 n.hist.forEach((h,i)=>o.push({id:'tx'+i,lane:h.pool,mine:'out',amt:h.amt,from:'you',to:h.id==='gate'?'the Gate':h.id==='mira'?'Mira':'the Kiosk',sp:60,off:260+i*180}));
 o.push({id:'b1',lane:'T',amt:.4,from:'t1\u2026d4',to:'t1\u2026a9',sp:80,off:520},{id:'b2',lane:'T',amt:7.5,from:'t1\u2026ff',to:'t1\u2026c2',sp:55,off:140},
  {id:'b3',lane:'S',amt:2.2,from:'\u2026',to:'\u2026',sp:65,off:360},{id:'b4',lane:'S',amt:.9,from:'\u2026',to:'\u2026',sp:90,off:620},
  {id:'sh',lane:'Sh',amt:5,from:'t1\u2026b7',to:'the shielded pool',sp:50,off:780});
 o.forEach(q=>q.x=4300+(q.off%820));V.orbs=o}

function lens(o){const e=V.eq,fee='fee '+FEE;
 if(o.lane==='T')return {h:'TRANSPARENT',c:C.bone,l:[o.from+'  \u2192  '+o.to,'amount '+fmt(o.amt),fee,'Anyone can read this: it is public to every observer.']};
 if(o.lane==='Sh')return {h:'SHIELDING',c:C.bone,l:['value enters the shielded pool: '+fmt(o.amt),'from '+o.from,'public: the amount going IN, and the sending address','public: NOT what happens to it afterwards']};
 const pub=['a shielded transfer happened',fee,'time and size are visible','sender, receiver and amount are not'];
 if(!o.mine){return {h:'SHIELDED',c:C.mu,l:e==='none'||e==='addr'?pub:pub.concat(['Your key does not open this one. It belongs to another wallet.'])}}
 if(canSee(o.mine))return {h:'SHIELDED  \u00B7  YOURS',c:AU[e].c,l:[o.from+'  \u2192  '+o.to,'amount '+fmt(o.amt),fee,'You can read this because of what you hold: '+AU[e].n+'.']};
 return {h:'SHIELDED',c:C.mu,l:pub.concat([e==='ivk'?'It is yours, but you hold INCOMING view only: this one went OUT.':'It is yours, but nothing in your hand can read it.'])}}
function postAct(){const n=SVn(),f=F();
 if(f.pass){note('The post is satisfied. The shutter is open.');return}
 if(n.plinth<0){note('The post asks about a payment to your receiver. Nothing has been received yet. The gallery is back the way you came.');AM.sfx('interaction');return}
 const pool=PLN[n.plinth].pool;
 ui({t:'THE READING POST · 1 of 2',c:C.teal,b:'Report on the payment Mira made to your receiver.\nHow much was it? (You can read the traffic above. What you hold changes what it shows.)',
  o:[1,2,3,4].map(v=>({l:fmt(v)+' ZEC',f:()=>{if(v!==3){AM.sfx('incorrect');V.bad=.4;ui({t:'NOT QUITE',c:C.bad,b:'That is not what the ledger shows. Stand under the traffic, change what is in hand, and read it again.',o:OK()});return}q2(pool)}})).concat([{l:'LEAVE',f:null}])})}
function q2(pool){const n=SVn(),f=F();
 ui({t:'THE READING POST · 2 of 2',c:C.teal,b:'Good. Now a stranger with no keys, watching the chain. About that same payment, they can read:',
  o:[{l:'Nothing at all',w:0},{l:'That a payment occurred, when, and its fee. Not who, not how much',w:'S'},{l:'The sender, the receiver and the amount',w:'T'}].map(x=>({l:x.l,f:()=>{
   if(x.w===pool){f.pass=1;keep();AM.sfx('world-complete');V.shutT=0;
    note(pool==='S'?'Correct. You lit a shielded receiver: strangers see that something happened, not what. The shutter opens.':'Correct, and it cost you something: you lit a transparent receiver, so every stranger can read it. The shutter opens.')}
   else{AM.sfx('incorrect');V.bad=.4;ui({t:'LOOK AGAIN',c:C.bad,b:'Check which kind of receiver you lit, then watch the same payment with nothing in hand.',o:OK()})}}}))})}

// ======================= the Viewing Chamber: who sees what =======================
const REQ={acct:{n:'THE ACCOUNTANT',w:'Teodora needs every payment you RECEIVED last year, for a report.'},
 land:{n:'THE LANDLORD',w:'Mr Pell says March rent never arrived. You sent it. He wants to see that you did.'},
 quill:{n:'MR QUILL',w:'A stranger. He will pay you 2.0 to \u201Cverify you are serious\u201D. He wants to see everything.'}};
const OPT=[['none','SHARE NOTHING'],['ivk','SHARE AN INCOMING VIEWING KEY'],['fvk','SHARE A FULL VIEWING KEY'],['one','SHOW THE DETAILS OF ONE PAYMENT']];
function outcome(r,o){
 const perm='A viewing key cannot be taken back. It shows past and future activity of that account, for as long as the account is used.';
 const T={acct:{none:['No report. She bills you for the delay.',0],
   ivk:['She can read every payment you receive, memos included, and nothing you send. She does the report. '+perm+' She is honest. That was still a choice you made once, permanently.',1],
   fvk:['She sees what she needed, and the half she did not: everything you sent, to whom, when. '+perm,2],
   one:['One payment will not make a year. She needs forty.',0]},
  land:{none:['The dispute stays a dispute.',0],
   ivk:['That shows what you RECEIVED. He needed what you SENT. Wrong half, and now he reads everything that arrives for good. '+perm,1],
   fvk:['It proves it, and opens every landlord, doctor and friend you ever paid, permanently. '+perm,2],
   one:['You show him one payment: the amount, the date, the address it went to. One character off from his. A typo. He is gracious. You exposed only what you chose. He still has to trust you: he cannot check a shielded payment himself.',0]},
  quill:{none:['He shrugs and leaves. The 2.0 leaves with him. Nothing about you changed.',0],
   ivk:['He pays 1.0 and reads everything you will ever receive. '+perm,1,1],
   fvk:['He pays 2.0, and reads everything, in and out, for good. '+perm,2,2],
   one:['He gets one line and pays nothing. He keeps asking.',0]}};
 return T[r][o]}
function consAct(){const f=F(),d=SVn().disc,left=Object.keys(REQ).filter(k=>!d[k]);
 if(!left.length){ui({t:'THE CONSOLE',c:C.ice,b:'All three have answers. Nothing you said can be unsaid; some of it can never be taken back.',o:OK()});return}
 ui({t:'THE DISCLOSURE CONSOLE',c:C.ice,b:'Three people are waiting at the glass. Whoever you answer, you answer once.',o:left.map(k=>({l:REQ[k].n,f:()=>reqAsk(k)})).concat([{l:'LATER',f:null}])})}
function reqAsk(k){
 ui({t:REQ[k].n,c:C.ice,b:REQ[k].w+'\n\nWhat do you give?',o:OPT.map(op=>({l:op[1],f:()=>{
  const r=outcome(k,op[0]),d=SVn().disc;d[k]=op[0];if(r[2]){SVn().bal+=r[2]}
  if(Object.keys(REQ).every(x=>d[x]))F().disc=1;keep();AM.sfx(r[1]?'incorrect':'correct');
  ui({t:REQ[k].n,c:C.ice,b:r[0]+(r[2]?'\n\n(+'+fmt(r[2])+' fictional ZEC)':''),o:OK(()=>{if(F().disc)ilseAfterDisc()})})}})).concat([{l:'STEP BACK',f:consAct}])})}
function ilseAfterDisc(){const d=SVn().disc,n=Object.values(d).filter(x=>x==='ivk'||x==='fvk').length;
 dlg([n===0?'You shared nothing permanent. I have seen people live their whole lives that way. It is not the only way.'
  :n===1?'One of them can still read you. Perhaps it was worth it. I only note it.':'Some of them will read you for as long as you use this account. I only keep the ledger. I do not judge the entries.',
  'A viewing key lets someone read. It never lets them spend. Both of those are true, and neither is the whole picture.','So share the smallest key that does the job. Once a viewing key is out, you cannot take it back.'])}
function panelAct(){const f=F(),e=V.eq;AM.sfx('interaction');
 if(e==='fvk'||e==='spend'){if(!f.secret){f.secret=1;keep();AM.sfx('core-activate');spark(XS.panel,150,C.ice,24)}
  ui({t:'THE SEALED PANEL · OUTGOING',c:C.ice,b:'Lit by your full view:\n\nOUT  \u2212 7.0   to  \u201Cthe Orchard Fund\u201D   (sent by I. Marrow)\n\nIlse sent this long ago. She holds an incoming view only: she has never been able to see where it went. It arrived. It is still arriving.',
   o:OK(()=>{if(!V.seenSecret){V.seenSecret=1;dlg(['\u2026You have been reading the panel.','I always wondered if it arrived.','Thank you. I did not know how to ask.'],()=>{note('Ilse never asked. She waited for someone to look.')})}})});return}
 ui({t:'A SEALED PANEL',c:C.mu,b:e==='ivk'?'Half of it is lit and the rest is frosted. The lit half says IN. The frosted half is the part about what went OUT, and your key cannot open it.':'Frosted glass over a plate of entries. It would take more than you are holding.',o:OK()})}

// ======================= the Recovery Room =======================
function altarAct(){const f=F();
 if(f.rec){ui({t:'THE LAMP',c:C.amber,b:'It burns. The phrase restored it, and everything the wallet was able to find again: the keys, the addresses, the history that could be read.',o:OK()});return}
 if(!f.card){note('A dark lamp, and six empty sockets. You were not given anything to restore it with.');return}
 V.stones=[];stonePick()}
function stonePick(){const s=V.stones,i=s.length;
 if(i===6){const ok=s.every((w,k)=>w===CARD[k]);
  if(ok){F().rec=1;keep();V.lampT=0;AM.sfx('world-complete');spark(XS.altar,150,C.amber,26);
   ui({t:'THE LAMP LIGHTS',c:C.amber,b:'Your balance is back: '+fmt(SVn().bal)+'. Your addresses are back. The phrase did all of it, and that is exactly why anyone who has it can do the same.',
    o:[{l:'ONE LAST THING',f:keepCard}]})}
  else{AM.sfx('incorrect');V.bad=.4;V.stones=null;V.wrong=1;V.lampT=0;
   ui({t:'A LAMP LIGHTS \u2014 NOT YOURS',c:C.bad,b:'It lights. The words were valid, so it restored something. A different wallet, empty, not yours. A phrase in the wrong order is not an error. It is a different key. Check your card (R).',o:OK()})}return}
 ui({t:'SOCKET '+(i+1)+' OF 6',c:C.amber,b:'Placed: '+(s.join(' \u00B7 ')||'nothing')+'\nThe order matters, and so does every word. (R reads your card.)',
  o:STONES.filter(w=>!s.includes(w)).map(w=>({l:w,f:()=>{s.push(w);AM.sfx('click');stonePick()}})).concat([{l:'STOP',f:()=>{V.stones=null}}])})}
function keepCard(){const f=F();
 ui({t:'WHERE DO YOU KEEP THE CARD?',c:C.amber,b:'It restores everything. Whoever reads it can do what you just did.',
  o:[['table','LEAVE IT ON THE ALTAR'],['board','PIN IT TO THE GALLERY NOTICEBOARD'],['drawer','SEAL IT IN THE IRON DRAWER']].map(x=>({l:x[1],f:()=>{f.kept=x[0];keep();
   note(x[0]==='drawer'?'Paper, offline, in a drawer. Nobody passing through the room can read it. It is boring, and that is the point.':
    x[0]==='board'?'Anyone walking through the gallery can read it now, and restore your wallet. Nothing happens. Nothing has to.':'Anyone in this room could pick it up. Nobody does. That is luck, not safety.')}}))})}

// ======================= the Gate: construct + authorize + disclose =======================
function gateAct(){const f=F();
 if(f.gate){note('The gate stands open. Beyond it: the way out.');return}
 if(V.gateTx&&V.tx&&V.tx.dest.id==='gate'&&V.tx.stage===4){discloseGate();return}
 if(V.tx&&V.tx.dest.id==='gate'&&V.tx.stage>=1&&V.tx.stage<4){gateStage();return}
 ui({t:'THE NOIR GATE',c:C.bone,b:'Four sockets, dark. A plate reads:\n\nTHE GATE TAKES NO COIN IT HAS NOT BEEN TOLD ABOUT.\nPAY THE TOLL OF '+fmt(TOLL)+'. THEN SHOW THAT YOU DID, AND NO MORE.',
  o:[{l:'BUILD THE TOLL',f:()=>{if(avail()<TOLL+FEE){AM.sfx('incorrect');V.bad=.4;ui({t:'INSUFFICIENT FUNDS',c:C.bad,b:'The toll is '+fmt(TOLL)+' plus a '+FEE+' fee. You have '+fmt(avail())+'. Your ledger may be lower than you remember.',o:OK()});return}
   V.tx={dest:{id:'gate',n:'THE GATE',pool:'S',a:'zs-demo-gate-0099'},amt:TOLL,stage:1};AM.sfx('collectible');note('The toll is drafted and unsigned. Stage by stage: authorize it, then broadcast it.');gateStage()}},{l:'LEAVE',f:null}]})}
function gateStage(){const t=V.tx;
 const o=[];
 if(t.stage===1)o.push({l:'AUTHORIZE (needs a spending key)',f:()=>{if(V.eq!=='spend'){AM.sfx('incorrect');V.bad=.4;note(V.eq==='none'?'Empty hand. The seal wants authority.':'You hold '+AU[V.eq].n+'. It cannot sign. Q changes what is in hand.');return}
  t.stage=2;AM.sfx('core-activate');spark(XS.gate,150,C.amber,20);note('Authorized. Signed, not sent.');gateStage()}});
 if(t.stage===2)o.push({l:'BROADCAST',f:()=>{t.stage=3;t.conf=0;t.ct=0;AM.sfx('rise');note('Broadcast. Wait for the network.')}});
 if(t.stage===3)o.push({l:'WAITING FOR THE NETWORK \u2026',f:null});
 o.push({l:'LEAVE',f:null});
 ui({t:'THE TOLL',c:C.amber,b:stageName[t.stage]+'\n'+fmt(t.amt)+' to the Gate',o})}
function afterToll(){}
function discloseGate(){
 ui({t:'THE CLERK AT THE GATE',c:C.ice,b:'\u201CThe toll arrived. I can see that. I was not told who sent it. Show me that it LEFT you, and show me no more than you must.\u201D',
  o:OPT.map(op=>({l:op[1],f:()=>gateChoice(op[0])})).concat([{l:'NOT YET',f:null}])})}
function gateChoice(k){
 const msg={none:'\u201CThen I have a payment from nobody. The gate stays closed.\u201D',
  ivk:'\u201CThis shows what arrives. I already see what arrives. It does not show that anything left you. Closed.\u201D'};
 if(msg[k]){AM.sfx('incorrect');V.bad=.4;ui({t:'THE CLERK',c:C.bad,b:msg[k],o:[{l:'THINK AGAIN',f:discloseGate}]});return}
 F().gate=1;F().gk=k;keep();V.gateT=0;AM.sfx('world-complete');spark(XS.gate,160,C.bone,40);
 const d=SVn().disc,q=d.quill==='fvk'||d.quill==='ivk',kept=F().kept;
 const close=[k==='one'?'You showed one payment and it matched what the gate already saw. It opens narrow.':'It opens wide. The clerk can now see everything, in and out, for as long as you use this wallet. It did not need to.',
  q?'Somewhere behind you, a figure in a long coat does not move. He still reads you.':'Nobody is reading over your shoulder.',
  kept==='drawer'?'The card is in an iron drawer on paper. It is still safe.':kept?'The card is still where you left it.':''].filter(Boolean).join(' ');
 setTimeout(()=>dlg(['It was never about the coins.',F().secret?'And thank you for looking at the panel. It arrived. I can stop wondering.':'The wallet was never a container. It is a set of decisions about what you can move, what you can see, and who else can.',
  'Go on. It is open.'],()=>{note(close);setTimeout(()=>{if(V&&V.on&&!S.done.noir)finishWorld()},2600)}),1400)}

// ======================= interactables =======================
function spots(){const f=F(),n=SVn(),a=[];
 a.push({x:XS.ilseA,l:'TALK TO ILSE',f:ilseA},{x:XS.core,l:f.root?'THE CORE':f.met?'WAKE THE CORE':'THE CORE',f:coreAct},
  {x:XS.press,l:'DERIVATION PRESS',f:pressAct},{x:XS.mail,l:'MAILBOX',f:mailAct},{x:XS.glass,l:'DISPLAY CASE',f:glassAct},{x:XS.lift,l:'CARGO LIFT',f:liftAct});
 PLN.forEach((p,i)=>a.push({x:XS.pl[i],l:p.n,f:()=>plinthAct(i)}));
 a.push({x:XS.desk,l:'DRAFTING DESK',f:deskAct},{x:XS.seal,l:'SEAL PRESS',f:sealAct,r:80},{x:XS.out,l:'OUTBOX',f:outAct},
  {x:XS.board,l:'LEDGER BOARD',f:boardAct,r:60},{x:XS.post,l:'READING POST',f:postAct},{x:XS.ilseF,l:'TALK TO ILSE',f:()=>{
   if(!F().disc)dlg(['Three people want to see inside you. Each has a reason. Decide who sees what.','I only watch. Mostly because it is all I am permitted.'],null);else ilseAfterDisc()}},
  {x:XS.cons,l:'DISCLOSURE CONSOLE',f:consAct},{x:XS.panel,l:'SEALED PANEL',f:panelAct},{x:XS.altar,l:'RESTORATION ALTAR',f:altarAct},
  {x:XS.ilseH,l:'TALK TO ILSE',f:()=>dlg([F().gate?'It is open. Go on.':'The gate takes no coin it has not been told about.','Pay it. Then show it exactly what it needs.'],null)},{x:XS.gate,l:'THE GATE',f:gateAct,r:140});
 return a}
const nearSpot=()=>{let b=null,bd=1e9;for(const s of spots()){const d=Math.abs(V.px-s.x);if(d<(s.r||95)&&d<bd){bd=d;b=s}}return b};
// shutters: a physical wall until the thing that opens it has been understood
const SHUT=()=>[[XS.shut1,F().lift],[XS.shut2,F().pass],[XS.gate-90,F().gate]];
function nInit(){const f=F();
 V={on:1,px:150,py:0,vx:0,vy:0,gr:1,face:1,cx:0,msg:'',mt:0,vp:[],ft:[],stt:'play',last:performance.now(),step:0,near:null,buf:0,coy:0,
  ui:null,eq:'none',tx:null,orbs:[],t:0,wake:f.root?9:0,shutT:f.pass?9:0,liftT:f.lift?9:0,gateT:f.gate?9:0,lampT:f.rec?9:0,payT:99,pay:1,bad:0,uiR:[]};
 K.l=K.r=K.j=K.jp=K.e=0;ctl(1);mkOrbs();window.__nv=()=>V;
 note(f.met?'The corridor lights are on. Q changes what is in hand.':'A gateway, a cold mechanism, and someone watching you from the left. Walk. E to use things, Q to change what is in hand.')}

// ======================= frame =======================
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));
 const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;V.t+=dt;
 if(!fin)tx=ax;                // pin the engine's click-to-walk target so a stray click can never drag the walker; unpinned only while leaving via RETURN TO HUB
 const live=V.stt==='play'&&!V.ui,dir=live?K.r-K.l:0,tv=dir*SPD;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);
 if(dir)V.face=dir;
 V.coy=V.gr?.1:(V.coy||0)-dt;V.buf=(V.buf||0)-dt;
 if(K.jp){V.buf=.12;K.jp=0}
 if(live&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0}
 if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;
 V.px+=V.vx*dt;V.vy-=GRAV*dt;V.py+=V.vy*dt;if(V.py<=0){V.py=0;V.vy=0;V.gr=1}else V.gr=0;
 V.px=clamp(V.px,HW,LW-HW);
 for(const s of SHUT())if(!s[1]&&V.px>s[0]-34){V.px=s[0]-34;V.vx=0;if(!V.blk||V.blk<V.t-3){V.blk=V.t;note('A shutter blocks the way. Something in this room is meant to open it.')}}
 if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.3;AM.sfx('step')}
 const vw=w/U;V.cx+=((V.px-vw*.42+V.face*60)-V.cx)*(1-Math.exp(-5*dt));V.cx=clamp(V.cx,0,Math.max(0,LW-vw));
 txStep(dt);
 for(const o of V.orbs){const near=Math.abs(V.px-o.x)<130&&V.px>4200&&V.px<5150;o.x+=o.sp*dt*(near?.22:1);if(o.x>5120)o.x-=820}
 if(V.pay===0){V.payT+=dt;if(V.payT>2.4){V.pay=1;const n=SVn();n.bal+=3;F().got=1;keep();AM.sfx('collectible');mkOrbs();
  note('It arrived: '+fmt(n.bal)+' in the ledger. You signed nothing, and nothing you hold was needed. Receiving does not ask your authority.');spark(XS.pl[n.plinth],140,C.bone,18)}}
 V.near=null;if(live){const s=nearSpot();if(s)V.near=s}
 if(K.e){K.e=0;if(live){if(V.near)V.near.f();else{AM.sfx('click')}}}
 V.wake=Math.min(V.wake+dt,9);V.shutT+=dt;V.liftT+=dt;V.gateT+=dt;V.lampT+=dt;
 V.vp.forEach(q=>{q.vy-=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt*1.2});V.vp=V.vp.filter(q=>q.l>0);
 V.ft.forEach(f=>f.l-=dt);V.ft=V.ft.filter(f=>f.l>0);V.mt-=dt;V.bad=Math.max(0,V.bad-dt)}

// ======================= scene =======================
// Layers: far arches (.2) / ceiling conduits with traffic packets (.5) / the corridor and its rooms (1.0).
// Light is deliberate: dark everywhere, a warm pool wherever something can be used.
const rgba=(h,a)=>{const q=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return 'rgba('+q+','+a+')'};
function pool(x,y,r,col,a){const gx=X(x),gy=Y(y),g=g2.createRadialGradient(gx,gy,0,gx,gy,r*U);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));
 g2.fillStyle=g;g2.fillRect(gx-r*U,gy-r*U,r*2*U,r*2*U)}
function lamp(x,y,col){const fl=.88+.12*Math.sin(V.t*4+x);rr(x-1,y,2,420-y,C.steel);rr(x-12,y-14,24,14,C.steel2);rr(x-8,y-6,16,6,mxc(col,'#fff',.4),fl);
 pool(x,y-90,230,col,.22*fl)}
function arches(t){for(let k=Math.floor(V.cx*.2/330)-1;k<Math.floor((V.cx*.2+W_/U)/330)+2;k++){
  const sx=L(k*330,.2),w=240*U,h=420*U,by=Y(0)+0;
  g2.fillStyle=C.ink2;g2.beginPath();g2.moveTo(sx,by);g2.lineTo(sx,by-h+w/2);g2.arc(sx+w/2,by-h+w/2,w/2,Math.PI,0);g2.lineTo(sx+w,by);g2.closePath();g2.fill();
  g2.strokeStyle=C.steel;g2.lineWidth=Math.max(2,3*U);g2.stroke();
  g2.fillStyle='#02030a';g2.beginPath();g2.moveTo(sx+24*U,by);g2.lineTo(sx+24*U,by-h+w/2+10*U);g2.arc(sx+w/2,by-h+w/2+10*U,w/2-24*U,Math.PI,0);g2.lineTo(sx+w-24*U,by);g2.closePath();g2.fill();
  P(sx+w/2-2*U,by-h+w/2,4*U,h-w/2,C.steel,.35)}}
function conduits(t){// transaction pathways on the ceiling: faint rails with light packets moving through them
 for(let r=0;r<3;r++){const y=Y(560+r*28);P(0,y,W_,Math.max(3,4*U),C.ink3);P(0,y,W_,1,C.steel2,.8)
  for(let i=0;i<7;i++){const sp=40+r*25+i*6,x=((i*417+t*sp)%(W_+200))-100;P(x,y-1,16*U,4*U,r===0?C.teal:r===1?C.amber:C.ice,.35+.25*Math.sin(t+i+r))}}}
function floor(t){const y0=Y(0);P(0,y0,W_,H_-y0+2,'#070a14');
 let y=y0,hh=Math.max(7,14*U),i=0;while(y<H_){const k=clamp((y-y0)/Math.max(1,H_-y0),0,1);P(0,y,W_,hh,mxc('#0e1424','#04060c',k),1);P(0,y,W_,1,C.steel,.4*(1-k));
  const wd=(180+i*30)*U,off=(V.cx*U*(1+i*.04)+i*61*U)%wd;for(let x=-off;x<W_;x+=wd)P(x,y,1,hh,'#03050a',.9);y+=hh;hh*=1.18;i++}
 P(0,y0,W_,Math.max(3,3*U),C.steel2)}
function core(){const x=XS.core,aw=F().root,k=aw?Math.min(1,V.wake):0,gx=X(x),gy=Y(130);
 rr(x-46,0,92,34,C.steel);rr(x-30,34,60,22,C.steel2);
 for(let i=0;i<3;i++){const r=(62-i*17)*U;g2.strokeStyle=aw?mxc(C.steel3,C.amber,k):C.steel;g2.lineWidth=Math.max(2,(5-i)*U);g2.beginPath();g2.arc(gx,gy,r,V.t*(.3+i*.2)*(aw?1:.05),V.t*(.3+i*.2)*(aw?1:.05)+4.2);g2.stroke()}
 if(aw){const g=g2.createRadialGradient(gx,gy,0,gx,gy,90*U);g.addColorStop(0,rgba(C.amber,.55*k));g.addColorStop(1,rgba(C.amber,0));g2.fillStyle=g;g2.fillRect(gx-90*U,gy-90*U,180*U,180*U)}
 P(gx-4*U,gy-4*U,8*U,8*U,aw?'#fff2d0':C.steel2)}
function press(){const x=XS.press;rr(x-60,0,120,150,C.steel);rr(x-60,150,120,10,C.steel2);rr(x-30,128,60,8,C.ink);
 [['fvk',-38],['ivk',0],['addr',38]].forEach(c=>{rr(x+c[1]-12,22,24,36,C.ink);if(has(c[0]))rr(x+c[1]-8,26,16,12,AU[c[0]].c,.8+.2*Math.sin(V.t*3))});
 TS('PRESS',X(x),Y(176),C.mu,10)}
function mailbox(){const x=XS.mail;rr(x-34,40,68,90,C.steel2);rr(x-34,130,68,8,C.steel3);rr(x-4,40,8,40,C.steel);rr(x-22,98,44,6,C.ink);rr(x+34,100,6,26,F().mail?C.bone:C.steel3);rr(x-6,0,12,40,C.steel)}
function glass(){const x=XS.glass,e=V.eq,vis=e==='ivk'||e==='fvk'||e==='spend';rr(x-54,30,108,150,C.steel);rr(x-46,38,92,134,vis?mxc('#0a1830',AU[e].c,.18):'#1a2236');
 if(vis)for(let i=0;i<5;i++){const d=i%2?'out':'in';if(canSee(d))rr(x-38,150-i*26,76,12,AU[e].c,.55);else rr(x-38,150-i*26,76,12,'#222c44',.9)}
 else for(let i=0;i<12;i++)rr(x-44+(i%4)*22,40+((i/4)|0)*40,18,36,'#ffffff',.04);
 rr(x-60,0,120,30,C.steel2)}
function lift(){const x=XS.lift,k=F().lift?Math.min(1,V.liftT/1.6):0,py=24+k*150;
 rr(x-50,0,100,14,C.steel2);rr(x-52,0,6,330,C.steel);rr(x+46,0,6,330,C.steel);rr(x-1,py+10,2,330-py,C.steel3,.8);
 rr(x-46,py,92,12,C.steel3);rr(x-46,py+12,92,5,C.amber,F().lift?.6:.12);rr(x-28,py+17,56,26,C.steel,.0)
 TS('LIFT',X(x),Y(350),C.mu,10)}
function shutter(x,open,t0){const k=open?ease2(Math.min(1,t0/1.6)):0;const h=330*(1-k);
 for(let i=0;i<11;i++){rr(x-24,330-h+ (i*30)*(1-k),48,26,C.steel,1)}
 rr(x-30,0,6,340,C.steel2);rr(x+24,0,6,340,C.steel2);if(!open)rr(x-24,0,48,330,C.ink,.3)}
const ease2=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
function plinths(){const n=SVn();PLN.forEach((p,i)=>{const x=XS.pl[i],on=n.plinth===i;
  rr(x-34,0,68,80,C.steel);rr(x-40,80,80,10,C.steel2);rr(x-26,90,52,52,mxc('#0a1424',p.pool==='T'?C.bone:C.ice,on?.35:.08),on?1:.8);
  if(on){pool(x,130,120,p.pool==='T'?C.bone:C.ice,.35)}
  TS(p.n,X(x),Y(168),on?C.txt:C.mu,10);TS(p.pool==='T'?'transparent':'shielded',X(x),Y(0)+16*U,p.pool==='T'?C.bone:C.ice,9)});
 if(V.pay===0){const k=V.payT/2.4,x=XS.pl[n.plinth]-300+k*270;person(x,'#27324a',C.bone,.9,0);TS('MIRA',X(x),Y(150),C.mu,9)}}
function person(x,coat,face,sc,hat,y0){const s=sc||1,gx=X(x),gy=Y(y0||0);
 g2.fillStyle=coat;g2.beginPath();g2.moveTo(gx-22*U*s,gy);g2.lineTo(gx-14*U*s,gy-86*U*s);g2.lineTo(gx+14*U*s,gy-86*U*s);g2.lineTo(gx+22*U*s,gy);g2.closePath();g2.fill();
 g2.fillStyle=face;g2.beginPath();g2.arc(gx,gy-98*U*s,10*U*s,0,7);g2.fill();
 if(hat!==false){g2.fillStyle='#04060c';g2.fillRect(gx-17*U*s,gy-104*U*s,34*U*s,4*U*s);g2.fillRect(gx-10*U*s,gy-118*U*s,20*U*s,15*U*s)}}
function ilse(x,t){person(x,'#1a2236','#d9c9a8',1.05,true);const gx=X(x)+22*U,gy=Y(70);
 g2.strokeStyle=C.teal;g2.lineWidth=Math.max(2,2*U);g2.beginPath();g2.arc(gx,gy,9*U,0,7);g2.stroke();P(gx+8*U,gy+6*U,12*U,2*U,C.steel3);
 const g=g2.createRadialGradient(gx,gy,0,gx,gy,34*U);g.addColorStop(0,rgba(C.teal,.25+.1*Math.sin(t*2)));g.addColorStop(1,rgba(C.teal,0));g2.fillStyle=g;g2.fillRect(gx-34*U,gy-34*U,68*U,68*U);
 TS('ILSE',X(x),Y(142),C.bone,10)}
function workshop(t){const tx_=V.tx;
 const x1=XS.desk;rr(x1-60,0,120,70,C.steel);rr(x1-66,70,132,8,C.steel3);rr(x1-30,78,60,2,C.bone,.8);rr(x1-30,84,44,2,C.mu,.6);TS('DRAFT',X(x1),Y(104),C.mu,10);
 const x2=XS.seal;rr(x2-40,0,80,110,C.steel);rr(x2-28,110,56,40,C.steel2);rr(x2-8,150,16,36,C.steel3);rr(x2-30,28,60,10,C.ink);
 if(tx_&&tx_.stage===1&&V.eq==='spend')pool(x2,140,100,C.amber,.35);TS('SEAL',X(x2),Y(206),C.mu,10);
 const x3=XS.out;rr(x3-40,0,80,70,C.steel);rr(x3-10,70,20,340,C.steel2);rr(x3-24,56,48,14,C.ink);TS('OUTBOX',X(x3),Y(0)+18*U,C.mu,9);
 if(tx_&&tx_.stage===3){const k=(t*.5)%1;rr(x3-4,70+k*330,8,12,C.amber)}
 // ledger board above the seal press: the four stages as four lamps
 const bx=XS.board;rr(bx-130,230,260,80,C.ink3);rr(bx-130,230,260,3,C.steel3);
 [['DRAFTED',1],['SIGNED',2],['SENT',3],['CONFIRMED',4]].forEach((s,i)=>{const on=tx_&&tx_.stage>=s[1];rr(bx-116+i*62,266,14,14,on?(i===3?C.ok:C.amber):C.steel);TS(s[0],X(bx-109+i*62),Y(246),on?C.txt:C.mu,8)});
 TS(tx_?tx_.dest.n+'  '+fmt(tx_.amt):'LEDGER '+fmt(SVn().bal),X(bx),Y(296),C.txt,11)}
function passage(t){const lanes={T:300,Sh:240,S:180};
 for(const k in lanes){const y=lanes[k];rr(4260,y,860,5,k==='T'?C.steel3:C.steel);rr(4260,y-2,860,2,'#000',.5);
  TS(k==='T'?'TRANSPARENT':k==='S'?'SHIELDED':'SHIELDING',X(4300),Y(y+16),k==='T'?C.bone:C.mu,9,'left')}
 const best={};
 for(const o of V.orbs){const x=o.x,y=lanes[o.lane],gx=X(x),gy=Y(y+4);
  const you=o.mine&&canSee(o.mine),col=o.lane==='T'?C.bone:you?AU[V.eq].c:C.steel3;
  if(gx>-50&&gx<W_+50){const g=g2.createRadialGradient(gx,gy,0,gx,gy,22*U);g.addColorStop(0,rgba(col,.55));g.addColorStop(1,rgba(col,0));g2.fillStyle=g;g2.fillRect(gx-22*U,gy-22*U,44*U,44*U);P(gx-5*U,gy-5*U,10*U,10*U,col)}
  const d=Math.abs(x-V.px);if(d<110&&(!best[o.lane]||d<best[o.lane].d))best[o.lane]={d,o}}
 // the readout lists the nearest orb in each lane, so overlapping lanes never hide each other
 V.rd=V.px>4200&&V.px<5150?['T','Sh','S'].filter(k=>best[k]).map(k=>({id:best[k].o.id,r:lens(best[k].o)})):[];
 rr(XS.post-30,0,60,86,C.steel);rr(XS.post-40,86,80,10,C.steel3);rr(XS.post-16,96,32,28,mxc('#0a1830',C.teal,.25));TS('READING POST',X(XS.post),Y(150),C.mu,9)}
function viewing(t){const x=XS.cons;
 g2.strokeStyle=C.steel3;g2.lineWidth=Math.max(3,5*U);g2.beginPath();g2.arc(X(x),Y(270),90*U,0,7);g2.stroke();
 g2.strokeStyle=rgba(C.ice,.35+.15*Math.sin(t*2));g2.lineWidth=Math.max(2,3*U);g2.beginPath();g2.arc(X(x),Y(270),72*U,0,7);g2.stroke();
 rr(x-110,0,220,64,C.steel);rr(x-116,64,232,8,C.steel3);rr(x-60,72,120,2,C.ice,.6);
 [[x-70,'#202a40',.9],[x,'#26233a',1],[x+70,'#1d2a2a',1.05]].forEach((q,i)=>{const d=SVn().disc[['acct','land','quill'][i]];person(q[0],q[1],'#a99a7a',q[2],i!==0,-0);
  if(d){TS(d==='none'?'\u2014':d==='one'?'1':d.toUpperCase(),X(q[0]),Y(150),C.mu,9)}});
 const px=XS.panel;rr(px-60,0,120,200,C.steel);rr(px-52,12,104,176,F().secret?mxc('#0a1830',C.ice,.25):'#1b2438');
 if(F().secret)for(let i=0;i<4;i++)rr(px-44,150-i*30,88,8,C.ice,.5);else for(let i=0;i<10;i++)rr(px-50+(i%3)*34,16+((i/3)|0)*44,30,40,'#fff',.04)}
function recovery(t){const x=XS.altar,f=F();rr(x-130,0,260,60,C.steel);rr(x-140,60,280,10,C.steel3);
 for(let i=0;i<6;i++){const w=V.stones&&V.stones[i]||(f.rec?CARD[i]:'');rr(x-110+i*40,72,34,20,C.ink);if(w){rr(x-108+i*40,74,30,16,C.steel3);TS(w.slice(0,5),X(x-93+i*40),Y(81),C.txt,8)}}
 const lit=f.rec?1:V.wrong&&V.lampT<3?.6:0,lc=V.wrong&&V.lampT<3?C.mu:C.amber;
 rr(x-8,100,16,50,C.steel2);g2.fillStyle=lit?rgba(lc,.9):C.steel;g2.beginPath();g2.arc(X(x),Y(170),22*U,0,7);g2.fill();
 if(lit)pool(x,170,260,lc,.34*lit);P(X(x)-3*U,Y(170)-3*U,6*U,6*U,lit?'#fff2d0':C.steel3);
 rr(x+170,0,60,90,C.steel);rr(x+176,50,48,36,C.steel2);rr(x+190,56,20,4,C.ink);TS('DRAWER',X(x+200),Y(110),C.mu,8)}
function gateArt(t){const x=XS.gate,k=F().gate?ease2(Math.min(1,V.gateT/2.4)):0,gx=X(x),gy=Y(190),R=190*U;
 g2.fillStyle=mxc('#02030a','#fff7e0',k*.9);g2.beginPath();g2.arc(gx,gy,R,0,7);g2.fill();
 if(k>0){const g=g2.createRadialGradient(gx,gy,0,gx,gy,R*3);g.addColorStop(0,rgba('#fff7e0',.7*k));g.addColorStop(1,rgba('#fff7e0',0));g2.fillStyle=g;g2.fillRect(gx-R*3,gy-R*3,R*6,R*6)}
 g2.save();g2.beginPath();g2.arc(gx,gy,R,0,7);g2.clip();
 P(gx-R-k*R,gy-R,R,R*2,C.steel);P(gx+k*R,gy-R,R,R*2,C.steel2);P(gx-3-k*R,gy-R,6,R*2,C.ink);
 for(let i=0;i<6;i++){P(gx-R-k*R,gy-R+i*R/3,R,3,C.ink,.5);P(gx+k*R,gy-R+i*R/3,R,3,C.ink,.5)}g2.restore();
 g2.strokeStyle=C.steel3;g2.lineWidth=Math.max(4,7*U);g2.beginPath();g2.arc(gx,gy,R,0,7);g2.stroke();
 const f=F(),lamps=[f.root,f.lift,f.pass,f.rec||f.gate];
 for(let i=0;i<4;i++){const a=-1.2+i*.8,lx=gx+Math.cos(a-1.6)*R*1.12,ly=gy+Math.sin(a-1.6)*R*1.12;P(lx-5*U,ly-5*U,10*U,10*U,lamps[i]?C.amber:C.steel,lamps[i]?1:.8)}
 rr(x-230,0,460,12,C.steel2);
 if(!f.gate){rr(x-300,0,12,40,C.steel3);TS('THE CLERK',X(x-250),Y(130),C.mu,9);person(x-250,'#1c2540','#b4a889',.9,true)}
 if(f.gate&&(SVn().disc.quill==='ivk'||SVn().disc.quill==='fvk')){person(x-420,'#101420','#6a6455',1,true);TS('MR QUILL',X(x-420),Y(140),C.mu,9)}}
function roomText(t){let r=ROOMS[0];for(const q of ROOMS)if(V.px>=q[0]-40)r=q;V.room=r[1]}
function scene(t){
 const g=g2.createLinearGradient(0,0,0,H_);g.addColorStop(0,'#020409');g.addColorStop(.6,'#0a101c');g.addColorStop(1,'#04060c');g2.fillStyle=g;g2.fillRect(0,0,W_,H_);
 arches(t);conduits(t);floor(t);
 [XS.ilseA,XS.core,XS.press,XS.mail,XS.glass,XS.lift,XS.pl[0],XS.pl[1],XS.pl[2],XS.desk,XS.seal,XS.out,XS.post,XS.cons,XS.panel,XS.altar,XS.gate]
  .forEach((x,i)=>{if(Math.abs(X(x))<W_*.9+300)lamp(x,372+(i%3)*10,i===1?C.amber:i<3?C.bone:C.amber)});
 core();press();mailbox();glass();lift();plinths();workshop(t);passage(t);viewing(t);recovery(t);
 shutter(XS.shut1,F().lift,V.liftT-1.2);shutter(XS.shut2,F().pass,V.shutT);gateArt(t);
 ilse(XS.ilseA,t);ilse(XS.ilseF,t);ilse(XS.ilseH,t);
 roomText(t);
 V.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*1.5);P(X(q.x),Y(q.y),q.s*U,q.s*U,q.c);g2.globalAlpha=1});
 for(let i=0;i<30;i++){const x=((i*173+t*(8+i%5*3))%(W_+80))-40,y=(i*97+t*(5+i%4*2))%H_;P(x,y,2,2,'#9fb8d8',.12+.1*Math.sin(t+i))}
 V.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),C.amber,260*U,Math.min(1,f.l)))}
function wrap(s,mw){const o=[];s.split('\n').forEach(par=>{let l='';par.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){o.push(l);l=w}else l=t});o.push(l)});return o}
function bubble(s,x,y,col,mw,a){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4,bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12;
 const bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;g2.save();g2.globalAlpha=a==null?1:a;P(bx,by,bw,bh,'#05070ee8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);
 g2.fillStyle=C.txt;g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}

// ======================= player, panels, HUD =======================
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;
 const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0;
 g2.fillStyle='#0009';g2.beginPath();g2.ellipse(sx,sy+3,aw*.36,5*U,0,0,7);g2.fill();
 g2.save();g2.shadowColor=AU[V.eq].c;g2.shadowBlur=V.eq==='none'?6:18;g2.imageSmoothingEnabled=false;
 g2.translate(sx,sy);g2.scale(V.face<0?-(1-idle):1-idle,1+idle);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 // what is in hand, shown at the hand and over the head
 if(V.eq!=='none'){const c=AU[V.eq].c,hx=sx+V.face*26*U,hy=sy-46*U;P(hx-6*U,hy-6*U,12*U,12*U,c);P(hx-2*U,hy-2*U,4*U,4*U,'#fff');
  const hy2=sy-ph-16*U;P(sx-42*U,hy2-14*U,84*U,14*U,'#05070ed0');P(sx-42*U,hy2-14*U,6*U,14*U,c);TS(AU[V.eq].n,sx+6*U,hy2-3*U,c,9)}}
function uiDraw(){const u=V.ui;if(!u)return;const body=typeof u.b==='function'?u.b():u.b;
 const mw=Math.min(W_-40,720),pad=18;g2.font=MONO(13);const fs=Math.round(Math.max(12,13*U)),lh=fs*1.45,ln=wrap(body,mw-pad*2);
 const oh=Math.round(Math.max(30,32*U)),bh=pad*2+lh*ln.length+(u.t?lh+6:0)+u.o.length*oh+8,bx=(W_-mw)/2,by=Math.max(70,(H_-bh)/2-10);
 g2.save();P(bx,by,mw,bh,'#05070ef4');g2.strokeStyle=u.c||C.bone;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);P(bx,by,mw,3,u.c||C.bone);
 g2.textAlign='left';let y=by+pad;
 if(u.t){g2.fillStyle=u.c||C.bone;g2.font=MONO(12);g2.fillText(u.t,bx+pad,y+fs);y+=lh+6}
 g2.font=MONO(13);g2.fillStyle=C.txt;ln.forEach(l=>{g2.fillText(l,bx+pad,y+fs);y+=lh});y+=8;
 V.uiR=[];u.o.forEach((op,i)=>{const sel=i===u.sel;P(bx+pad-6,y,mw-pad*2+12,oh-4,sel?'#1d2740':'#0b101c');if(sel)P(bx+pad-6,y,4,oh-4,u.c||C.bone);
  g2.fillStyle=sel?C.txt:C.mu;g2.font=MONO(13);g2.fillText((sel?'\u25B6 ':'   ')+op.l,bx+pad+4,y+oh*.62);V.uiR.push({x:bx+pad-6,y,w:mw-pad*2+12,h:oh-4,i});y+=oh});
 g2.restore()}
function drawHud(p){g2.textAlign='left';
 const px0=18,py0=coarse?122:18,w2=310;P(px0,py0,w2,86,'#05070ed8');g2.strokeStyle=C.steel3;g2.lineWidth=2;g2.strokeRect(px0,py0,w2,86);
 g2.font=MONO(11);g2.fillStyle=C.mu;g2.fillText(V.room||'',px0+10,py0+17);
 ['none','spend','addr','ivk','fvk'].forEach((k,i)=>{const x=px0+14+i*58,y=py0+26,on=has(k),sel=V.eq===k;
  P(x,y,40,26,sel?mxc('#05070e',AU[k].c,.28):'#0b101c');g2.strokeStyle=on?AU[k].c:C.steel;g2.lineWidth=sel?3:1.5;g2.strokeRect(x,y,40,26);
  if(on){P(x+16,y+8,8,8,AU[k].c)}else{g2.fillStyle=C.steel;g2.fillText('?',x+17,y+18)}});
 g2.font=MONO(11);g2.fillStyle=AU[V.eq].c;g2.fillText('IN HAND: '+AU[V.eq].n+'  [Q]',px0+10,py0+72);
 g2.textAlign='right';g2.fillStyle=C.txt;g2.fillText('LEDGER '+fmt(SVn().bal)+' ZEC (SIM)',px0+w2-8,py0+17);g2.textAlign='center';
 if(V.near&&!V.ui)bubble((coarse?'TAP \u270B  ':'[E]  ')+V.near.l,X(V.near.x),Y(V.near.y||290),C.ok,320*U);
 if(V.rd&&V.rd.length&&!V.ui){const mw=Math.min(W_-40,560);g2.font=MONO(12);const lh=Math.round(Math.max(15,16*U));
  const cap=capPanel(H_,coarse,lh,18);let blocks=V.rd.map(q=>({r:q.r,ln:q.r.l.reduce((a,s)=>a.concat(wrap(s,mw-28)),[])}));
  let dropped=0,n=blocks.reduce((s,b)=>s+b.ln.length+1,0);
  while(blocks.length>1&&n>cap.fit){n-=blocks[0].ln.length+1;blocks.shift();dropped++}   // keep the newest entries
  if(blocks[0]&&blocks[0].ln.length>cap.fit-1){dropped+=blocks[0].ln.length-(cap.fit-1);blocks[0]={...blocks[0],ln:blocks[0].ln.slice(-(cap.fit-1))}}
  n=blocks.reduce((s,b)=>s+b.ln.length+1,0);
  const bh=lh*n+18+blocks.length*6,bx=W_/2-mw/2,by=Math.min(Math.max(64,H_*.17),cap.anchor-bh);
  P(bx,by,mw,bh,'#05070ee8');g2.strokeStyle=C.steel3;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);g2.textAlign='left';let yy=by+lh;
  if(dropped>0){g2.fillStyle=C.mu;g2.font=MONO(11);g2.fillText('\u25B2 '+dropped+' EARLIER LINES',bx+12,yy);yy+=lh;g2.font=MONO(12)}
  blocks.forEach(b=>{g2.fillStyle=b.r.c;g2.fillText(b.r.h+'   \u00B7   LENS: '+AU[V.eq].n,bx+12,yy);yy+=lh;g2.fillStyle=C.txt;b.ln.forEach(s=>{g2.fillText(s,bx+12,yy);yy+=lh});yy+=6});g2.textAlign='center'}
 if(V.bad>0){g2.fillStyle='rgba(255,106,100,'+V.bad*.18+')';g2.fillRect(0,0,W_,H_)}
 if(!coarse&&!V.ui){g2.font=MONO(11);g2.fillStyle=C.mu;g2.fillText('A / D WALK \u00B7 SPACE JUMP \u00B7 E USE \u00B7 Q CHANGE WHAT IS IN HAND \u00B7 R CARD',W_/2,H_-14)}
 if(V.mt>0&&V.msg&&!V.ui){g2.font=MONO(13);const mw=Math.min(W_-24,700),ln=wrap(V.msg,mw-28),bh=ln.length*22+22,bx=(W_-mw)/2,by=H_-bh-(coarse?150:38);
  g2.save();g2.globalAlpha=Math.min(1,V.mt*2);P(bx,by,mw,bh,'#05070ef2');g2.strokeStyle=C.ok;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);g2.fillStyle=C.txt;g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+14,by+24+i*22));g2.restore()}
 uiDraw();g2.textAlign='center'}

// ======================= wiring =======================
const _fn=fore;fore=function(w,h,gy,p){if(!isN())return _fn(w,h,gy,p);
 amb(w,h,T,TH.noir,p);const v=g2.createRadialGradient(w/2,h*.46,Math.min(w,h)*.3,w/2,h*.46,Math.max(w,h)*.78);
 v.addColorStop(0,'rgba(2,3,8,0)');v.addColorStop(1,'rgba(2,3,8,.72)');g2.fillStyle=v;g2.fillRect(0,0,w,h)};
const _bgn=bg;bg=function(w,h,gy,p){if(isN()){frame(w,h,gy);cam=V.cx*U;scene(T)}else _bgn(w,h,gy,p)};
const _avn=avatar;avatar=function(w,h,gy,p){if(isN()){drawPlayer(p);drawHud(p)}else _avn(w,h,gy,p)};
// Noir declares engine steps, so startWorld builds a guided 5-orb tour. This world is free-roam, so that tour is switched off
// after startWorld builds it; the ending is granted by the Gate through the engine's own finishWorld().
const _stn=startWorld;startWorld=function(i){const me=W[i].id==='noir';if(me)nInit();_stn(i);
 if(me){hs=[];vis=[];fin=0;pan=0;ax=-60;tx=ax;$z('wf').innerHTML=''}};
const _spn=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spn()};
});

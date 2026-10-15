/* ZKSCAPE world 03: PROOF TEMPLE (adventure repolish). Same engine hooks + movement model as Origin / Shielded Valley
   (bg/avatar/startWorld/stopWorld wrappers, own physics, own touch controls). No other file is touched.
   Loop: SECRET (sealed chamber, never shown) -> CONDITION (public rules, read the INVALIDs) -> WITNESS (sigil, shown only as a redaction)
   -> PROOF (five rounds of the temple's challenge, the secret never leaves) -> VERIFIER says VALID -> the temple opens anyway.
   Stylized metaphor, not real cryptography. Replaces worlds/03-proof.js (same world id 'proof'; load only one of them). */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'proof',n:'PROOF',title:'THE PROOF TEMPLE',sub:'What is this place trying to verify?',desc:'A sealed chamber. A temple that keeps saying INVALID. Work out what it is really asking.',q:'The secret does not travel.',sort:[['',0]],
 deep:'zk-SNARK means Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. This temple is a gameplay metaphor, not a real proof system: a verifier can become convinced that a statement is true without ever learning the secret that makes it true.'});
A.proof='ZK Sigil';
TH.proof={sky:['#05040f','#1a1240'],moon:[.72,.16,.07,'#c9c6d8'],mt:'#0c0b1a',fog:'#5a4bd0',amb:'mote'};
GIANT.proof=function(w,h,gy,t,th,p,c,id,o,f){ring(w*.5+o,gy-h*.32,h*.28,.15,'#7ee7ea',t);ring(w*.5+o,gy-h*.32,h*.18,-.2,'#e4b15a',t)};
LM.proof=function(x,y,s,c,t,a,B){for(let k=0;k<2;k++){hg.save();hg.rotate(t*(k?-.7:.5));B();hg.ellipse(0,0,s*(1-k*.25),s*(.42+k*.2),k*.4,0,7);hg.stroke();hg.restore()}B();hg.rect(-s*.22,-s*.22,s*.44,s*.44);hg.stroke()};
// ---------------- level data (1 unit = U px; y = height above ground) ----------------
const LW=4700,HW=30,PH=112,SPD=330,JMP=830,GRAV=2500,GA=2300,GB=3300,GM=2800,EX=4540,PX=[1450,1600,1750],CON=1930,VAULT=2090,REQ=2200,NOTE=1930,NX0=640;
const FLT=[[1230,110,80],[1380,110,160],[1530,110,240],[1680,110,320],[1830,230,390]];       // optional ascent over the pillars to the builders' ledge
const IK={void:'#05040f',wall:'#12122a',brick:'#1b1a38',stone:'#2c2a50',cyan:'#7ee7ea',gold:'#e4b15a',white:'#eceaf6',bad:'#e25b4a',ok:'#7ddea0',vio:'#7a5cff'};
// ---- WINTER SPRING (he) - the Visitor. He is not running this temple, he is watching it. ----
const VS=new Image();
VS.onload=()=>{try{const c=removeBg(VS);c.complete=true;if(!c.width)c.width=VS.width;if(!c.height)c.height=VS.height;VS_IMG=c;try{VS_PAL=extract(c)[0]}catch(e){VS_PAL=['#691fef','#caa6ff','#ffeb57']}}catch(e){VS_IMG=VS;VS_PAL=['#691fef','#caa6ff','#ffeb57']}};
VS.src='NPCs/winterspring_clean.png';let VS_IMG=VS,VS_PAL=['#691fef','#caa6ff','#ffeb57'];
// he moves, but he NEVER stands inside the chamber. inside, the vignette and the redaction bars swallow both him
// and his dialogue, so whatever he had to say went unread. every post sits outside GA, where the text is legible.
const VSX=()=>Q.valid?EX-330:Q.asked?GA-320:Q.sig?REQ+110:Q.vault?CON-130:NX0+110;
const VS_LINES=()=>{const L=[];
 if(!Q.vault)L.push(['Oh, a visitor. I was wondering who built the thing that built the thing.',6]);
 if(!Q.vault)L.push(['Three rules on that wall, one set of switches. Read them twice before you touch anything. Reading is free.',6.5]);
  if(!Q.vault)L.push(['This whole temple is a metaphor for a zero-knowledge proof. A prover wants to convince a verifier that a statement is true, without handing over the secret.',8],['In Zcash the statement is: this transaction follows the rules. The secret is who paid whom, and how much.',7]);
 if(Q.vault&&Q.phase<2)L.push(['It opened for you. Do not get pleased. It was asked a question and you happened to answer it.',6]);
  if(Q.vault&&Q.phase<2)L.push(['The rules on the wall are public. The secret is not. A proof shows the secret satisfies the rules, without revealing the secret itself.',7.5]);
 if(Q.sig&&!Q.asked)L.push(['Carry that to the pedestal. It will refuse you. It always refuses the first time.',6]);
  if(Q.sig&&!Q.asked)L.push(['That sigil is your witness: the private input only the prover knows. The verifier is never shown it.',7]);
 if(Q.asked&&Q.rounds===0)L.push(['Five rounds. It is not testing your reflexes. It is testing whether you understood what it asked.',6.5]);
  if(Q.asked&&Q.rounds===0)L.push(['One honest detail. Real zk-SNARKs are non-interactive: the prover sends a single proof, with no back and forth. The rounds are only our metaphor.',8.5]);
 if(Q.rounds>0&&!Q.valid)L.push(['It calls you from the hall. Set the rule before you walk in - you cannot reach a switch from inside there.',6.5]);
 if(Q.valid)L.push(['VALID. And the chamber is still shut.',5],['You finally stopped looking inside. Everyone who came before you was very patient about failing to learn that.',7],
   ['zk-SNARK: Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. Zero-knowledge: the proof reveals nothing about the secret beyond the fact it proves.',9],
   ['That is a simplification, not a guarantee about everything. Public transaction data, wallet software and how you use it can still reveal things.',8.5],
   ['Succinct: the proof is small and quick to check.',5],
   ['Non-interactive: one message, no back and forth. Argument of knowledge: the prover really knows the secret. Zcash shielded transactions carry exactly this kind of proof.',9],
   ['Zcash has used two proving systems. Sapling used Groth16, which needed a trusted setup ceremony. Orchard, from the NU5 upgrade in 2022, uses Halo 2, which needs none.',9.5]);
 return L};
const vsStage=()=>Q.valid?6:Q.exitOpen?5:Q.rounds>0||Q.asked?4:Q.sig?3:Q.vault?2:1;
const SYM=['○','△','▢'];
let Q=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,e:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-Q.cx)*U,Y=y=>GY-y*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
const sfx=n=>{if(Q&&Q.hush>0)return;try{AM.sfx(n)}catch(e){}},lerp=(a,b,t)=>a+(b-a)*t,smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t)};
const rgba=(h,a)=>h+Math.round(Math.max(0,Math.min(1,a))*255).toString(16).padStart(2,'0');
function pInit(){Q={on:1,px:140,py:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,cx:0,sq:0,st:'play',last:performance.now(),step:0,vp:[],msg:null,mt:0,lock:0,hush:0,aw:.12,tf:0,
 pil:[0,0,0],lamp:[0,0,0],lit:[0,0,0],phase:0,vault:0,sig:0,asked:0,askT:0,rounds:0,call:0,need:0,called:-1,calledT:0,entry:0,inside:0,vin:0,vt:-1,valid:0,pan:0,exitOpen:0,done:0,sec:0,alt:0,tries:0,area:'',at:0,said:{},near:null,out:0,res:0,ltx:0,dlg:null,vsT:0,vsMode:'solid',vsStage:0,vsGone:false,vsNear:false};K.l=K.r=K.j=K.jp=K.e=0;ctl(1)}
function say(h,s,t,c){Q.msg={h,s,c:c||IK.cyan};Q.mt=t||5}
function dust(n,c){for(let i=0;i<n;i++)Q.vp.push({x:Q.px+(Math.random()-.5)*40,y:Q.py,vx:(Math.random()-.5)*140,vy:30+Math.random()*90,l:.45,c:c||'#9a98c0',s:5,g:0})}
function spark(x,y,c,n=12){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*220;Q.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c,s:5,g:300})}}
// ---------------- input ----------------
if(!window.__zkOKp){window.__zkOKp=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isP())return;e.preventDefault();if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0})}
const isP=()=>run&&cur&&cur.id==='proof'&&Q&&Q.on;
function ctl(on){let c=$z('pctl');if(c&&c.dataset.own!=='proof'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='pctl';c.dataset.own='proof';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('◀','l','left'),mb('▶','r','right'));R.append(mb('◉','e','interact'),mb('⤴','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
// ---------------- physics (Origin movement model) ----------------
function support(){let b=0;for(const [x,w,t] of FLT)if(Q.px+HW>x&&Q.px-HW<x+w&&Q.py>=t-2&&t>b)b=t;return b}
function upd(dt){const live=Q.st==='play'&&!Q.lock,dir=live?K.r-K.l:0,tv=dir*SPD;
 Q.vx+=Math.sign(tv-Q.vx)*Math.min(Math.abs(tv-Q.vx),(Q.gr?2800:1900)*dt);if(dir)Q.face=dir;
 if(K.jp){K.jp=0;Q.buf=.12}Q.buf-=dt;Q.coy=Q.gr?.1:Q.coy-dt;
 if(live&&Q.buf>0&&Q.coy>0){Q.vy=JMP;Q.gr=0;Q.coy=0;Q.buf=0;Q.sq=-1;dust(8);sfx('interaction')}
 if(live&&!K.j&&Q.vy>0)Q.vy-=GRAV*1.2*dt;
 Q.px+=Q.vx*dt;const hi=Q.asked?LW-HW:GA-HW-6;if(Q.px>hi){Q.px=hi;Q.vx=0}if(Q.px<HW){Q.px=HW;Q.vx=0}
 const y0=Q.py;Q.vy-=GRAV*dt;Q.py+=Q.vy*dt;let on=0;
 if(Q.py<=0){Q.py=0;on=1}for(const [x,w,t] of FLT)if(Q.vy<=0&&y0>=t-2&&Q.py<=t&&Q.px+HW>x&&Q.px-HW<x+w){Q.py=t;on=1}
 if(on){if(Q.vy<-420){Q.sq=1;dust(10);sfx('step')}Q.vy=0}Q.gr=on;
 if(Q.gr&&Math.abs(Q.vx)>60&&(Q.step-=dt)<=0){Q.step=.26;sfx('step');if(Math.random()<.6)dust(1)}}
// ---------------- the mystery ----------------
const violated=()=>{const [c,t,s]=Q.pil;return[c&&!t?1:0,t&&s?1:0,c||t||s?0:1]};
// ===== A: the wall has THREE rules, not one. Same three pillars, three different meanings. =====
//  R0 THE CHAIN   - if the first holds the second must hold, if the second the third. (the original)
//  R1 THE SINGLE  - one pillar is enough. But only one of them can stand alone.
//  R2 THE WHOLE   - all three, always, no shortcuts.
const RULES=[{t:'THE CHAIN',d:'first obliges second, second obliges third'},
 {t:'THE SINGLE',d:'one witness is enough - but only the third can stand alone'},
 {t:'THE WHOLE',d:'all three or nothing. no cleverness accepted'}];
const ruleOK=r=>{const [c,t,s]=Q.pil;
 if(r===0)return!violated().some(Boolean);
 if(r===1)return(!c&&!t&&s)?1:0;
 return(c&&t&&s)?1:0};
const ruleWord=r=>r===0?'THE CHAIN':r===1?'THE SINGLE':'THE WHOLE';
function interactables(){const L=[];PX.forEach((x,i)=>L.push({k:'pil',i,x,y:0}));
 // the console retires once it has asked its two questions. THE WHOLE is still enforced - at the pedestal, and in the rounds.
 if(Q.phase<2)L.push({k:'con',x:CON,y:0});
 if(Q.vault&&!Q.sig)L.push({k:'vault',x:VAULT,y:0});L.push({k:'req',x:REQ,y:0});if(Q.py>300)L.push({k:'note',x:NOTE,y:390});return L}
function interact(){if(Q.st!=='play'||Q.lock)return;const n=Q.near;if(!n)return;sfx('interaction');
 if(n.k==='pil'){Q.pil[n.i]^=1;Q.lamp=[0,0,0];spark(n.x,150,Q.pil[n.i]?IK.cyan:'#777',14);Q.tries=Q.tries}
 if(n.k==='con'){const r=Q.phase<2?Q.phase:2;                                   // console obeys whichever rule it is currently being asked for
  if(ruleOK(r)){Q.lamp=[0,0,0];sfx('correct');spark(n.x,150,IK.ok,26);
   if(Q.phase===0){Q.phase=1;Q.vault=1;Q.lit[0]=1;Q.sec++;say('THE CHAIN HOLDS','A drawer opens somewhere behind you. The temple did not ask how you knew.',6,IK.ok)}
   else if(Q.phase===1){Q.phase=2;Q.lit[1]=1;Q.sec++;const only=Q.pil[2]&&!Q.pil[0]&&!Q.pil[1];
    if(only&&!Q.alt){Q.alt=1}
    say('THE SINGLE HOLDS',only?'One pillar stood alone and the temple accepted it. The vault will now give up its sigil - but only while it still holds.':'It holds. Hold it again when you take what is inside, or the vault will close.',6,IK.ok)}
   else say('THE WHOLE HOLDS','All three at once. Fine. The pedestal still wants to see it.',3.5,IK.ok)}
  else{Q.lamp=[0,0,0];Q.lamp[r]=1;Q.tries++;sfx('incorrect');
   say('INVALID','"'+ruleWord(r)+'" is not satisfied. '+RULES[r].d+'.',4.5,IK.bad)}}
 if(n.k==='vault'){
  if(Q.phase<2){say('SEALED','The vault is not asking yet. Go back to the console.',4,IK.dim||'#6a7084');return}
  if(!ruleOK(1)){sfx('incorrect');say('INVALID','The sigil will not leave unless THE SINGLE still holds. One pillar - and it has to be the right one.',5,IK.bad);return}
  Q.sig=1;sfx('collectible');spark(VAULT,100,IK.gold,34);say('WITNESS SIGIL','It will be shown to nobody. Not the temple. Not even you.',6,IK.gold)}
 if(n.k==='req'){if(!Q.sig)say('SEALED','Nothing to present. The chamber is only a shape you cannot see into.',4.5,IK.dim||'#6a7084');
  else if(!ruleOK(2)){sfx('incorrect');say('INVALID','You are holding the sigil in a temple that is not asking the right question. One pillar was enough to take it. All three is what it wants now.',5.5,IK.bad)}
  else if(!Q.asked){sfx('incorrect');say('INVALID','THE SECRET WAS NEVER REQUESTED.',4.5,IK.bad);Q.askT=1.6}
  else{sfx('incorrect');say('INVALID','"You are still trying to open it." It checks a condition, not a view.',4.5,IK.bad)}}
 if(n.k==='note'){if(!Q.noteSeen){Q.noteSeen=1;Q.sec++;sfx('collectible')}say('THE BUILDERS’ LEDGE','Scratched under a skylight: "We kept opening the chamber. It showed a different shape every time we looked. It never helped." A diagram of five rounds, unfinished.',9,IK.gold)}}
const ROUNDS=[{r:0,s:1},{r:1,s:2},{r:2,s:1},{r:0,s:2},{r:1,s:1}];
function rounds(dt){const ins=Q.px>GA&&Q.px<GB;
 // the temple names the round while you are STILL in the hall - inside the chamber you cannot reach a pillar,
 // so being told the rule after you walk in would be asking you to set something you can no longer change.
 const ri=Math.min(Q.rounds,ROUNDS.length-1);
 if(Q.called<0)Q.calledT=Math.max(0,Q.calledT-dt);            // let a rejection be read before it calls again
 // ...and only while you are OUTSIDE it. the chamber spans 2300-3300 and the pillars sit at 1450-1750, so the sole route
 // between them runs straight through the room. calling from inside meant every walk home scored as an attempt.
 if(!Q.valid&&Q.asked&&!ins&&Q.calledT<=0&&Q.px>VAULT+90&&Q.px<GA&&Q.called!==ri){Q.called=ri;const nd=ROUNDS[ri];Q.call=nd.s;Q.need=nd.r;sfx('core-activate');
  say('THE TEMPLE CALLS '+'AB'[nd.s-1],'Hold '+ruleWord(nd.r)+'. Set it, then walk in and come out on side '+'AB'[nd.s-1]+'.',5.5,IK.gold)}
 if(ins&&!Q.inside){Q.inside=1;Q.entry=Q.px<GM?1:2}
 else if(!ins&&Q.inside){Q.inside=0;if(Q.valid||!Q.call)return;
  // every real attempt enters from the hall side, because that is the only place the call can be heard from.
  // entering from B means you are on your way home to the pillars - the temple does not score the walk back.
  if(Q.entry!==1)return;
  const side=Q.px<=GA?1:2;
  const held=ruleOK(Q.need);
  if(side===Q.call&&held){Q.rounds++;Q.lit[Q.need]=1;sfx('correct');spark(Q.px,90,IK.cyan,22);Q.call=0;Q.called=-1;
   if(Q.rounds>=ROUNDS.length)startValid();else say('ROUND '+Q.rounds+' / '+ROUNDS.length+' V',ruleWord(Q.need)+' held, correct side. It is asking for something different now.',3.5,IK.ok)}
  else if(side!==Q.call){Q.rounds=0;sfx('incorrect');say('INVALID','Wrong side. The temple told you which one. Start the rounds again.',5,IK.bad)}
  else{Q.rounds=0;sfx('incorrect');say('INVALID',ruleWord(Q.need)+' was not holding when you stepped out. It checked the condition, not the route.',5,IK.bad)}Q.call=0;Q.called=-1;Q.calledT=3.5}}
function startValid(){Q.valid=1;Q.vt=0;Q.lock=1;Q.call=0;Q.called=-1;say('THE VERIFIER GATHERS','The chamber stays closed.',3,IK.cyan);sfx('core-activate')}
function validTick(dt){if(Q.vt<0)return;Q.vt+=dt;const t=Q.vt;
 if(t>3.4&&!Q.vflash){Q.vflash=1;sfx('correct');sfx('card-reveal');spark(GM,560,'#fff',60);if(!reduce)wow=Math.max(wow,1)}
 if(t>9.2)Q.lock=0;                                                    // held until the camera has come home
 if(t>3.4)Q.tf=Math.min(1,(t-3.4)/2.6);
 if(t>6&&!Q.hushed){Q.hushed=1;Q.hush=1.8}
 if(t>6.2&&!Q.sc2){Q.sc2=1;say('SCRIBE','You finally stopped looking inside.',5,IK.gold)}
 if(t>8.4&&!Q.exitOpen){Q.exitOpen=1;sfx('core-activate');showFact('A zero-knowledge proof lets you prove that something is true without revealing the secret that makes it true.',6)}}
// the shared fact() panel is a permanent fixture - it is the end-of-world reveal everywhere else in zkSCAPE.
// here it lands mid-world and would sit under the player's feet for the rest of the run, so it gets a timer.
function showFact(txt,hold){try{fact(txt)}catch(e){return}
 const el=$z('wf');if(!el)return;let left=(hold||5)*1000;
 const tick=()=>{if(!el.firstChild)return;left-=100;if(left>0){setTimeout(tick,100);return}
  el.style.transition='opacity .6s';el.style.opacity='0';setTimeout(()=>{el.style.transition='';el.style.opacity='';el.innerHTML=''},650)};
 setTimeout(tick,100)}
function reach(){if(Q.exitOpen&&!Q.done&&Q.st==='play'&&Math.abs(Q.px-EX)<55){Q.done=1;Q.st='done';spark(EX,150,'#fff',50);if(!reduce)wow=1;sfx('collectible');setTimeout(()=>{if(!Q.on)return;if(S.done.proof){fact('✓ ALREADY DISCOVERED');setTimeout(back,2800)}else complete()},900)}}
function scribeX(){return !Q.sig?NX0:!Q.asked?2090:3450}
function scribeTalk(){const sx=scribeX();Q.sx=sx;if(!Q.said.a&&Math.abs(Q.px-NX0)<300){Q.said.a=1;say('SCRIBE','It isn\u2019t asking for the secret.',5,IK.gold)}
 if(Q.sig&&!Q.said.b&&Math.abs(Q.px-2090)<260&&!Q.asked){Q.said.b=1;say('SCRIBE','Everyone who came here tried to open it. Look at the floor.',5,IK.gold)}}
// ---- Winter Spring: press E near him. Lines are chosen by what he has watched happen. ----
function vsTalk(){if(Q.dlg||Q.vsGone||Q.vsMode==='gone')return;const L=VS_LINES();if(!L.length)return;Q.dlg={L,i:0,c:0};sfx('interaction')}
function vsAdvance(){const d=Q.dlg;if(!d)return;if(d.c<d.L[d.i][0].length){d.c=999;return}sfx('interaction');
 if(++d.i>=d.L.length){Q.dlg=null;if(Q.vsMode==='solid'){Q.vsT=0.001;Q.vsMode='out'}Q.vsStage=vsStage()}   // dissolved for THIS stage
 else d.c=0}
function vsUpdate(dt){const st=vsStage();
 if(Q.dlg&&Q.dlg.c<Q.dlg.L[Q.dlg.i][0].length)Q.dlg.c+=dt*46;
  if(Q.dlg&&Q.mt>0&&Q.mt<3)Q.mt=3;   // a message that arrives while he is speaking waits until he is done
 // explicit phase, not inferred from the value - inferring it made him dissolve and reassemble on alternate frames
 if(Q.vsMode==='out'){Q.vsT=Math.min(1.2,Q.vsT+dt);if(Q.vsT>=1.2){Q.vsT=1.2;Q.vsMode='gone'}}
 else if(Q.vsMode==='in'){Q.vsT-=dt*1.05;if(Q.vsT<=0){Q.vsT=0;Q.vsMode='solid'}}
 if(Q.vsMode==='gone'&&st>Q.vsStage)Q.vsMode='in';                     // the temple moved on: he reassembles
 if(Q.vsMode==='solid')Q.vsStage=st;
 Q.vsGone=Q.vsMode==='gone';
 Q.vsNear=!Q.dlg&&!Q.vsGone&&Math.abs(Q.px-VSX())<150&&Math.abs(Q.py)<180;
  if(Q.vsNear&&Q.vsMode==='solid'){Q.vsAuto=Q.vsAuto||{};if(!Q.vsAuto[st]){Q.vsAuto[st]=1;vsTalk()}}   // he speaks once on his own at each post, so his lines cannot be walked past
 if(K.e&&Q.dlg){K.e=0;vsAdvance();return}
 if(K.e&&Q.vsNear){K.e=0;vsTalk();return}}      // otherwise E falls through to the temple's own interactions
function drawVS(p,t){if(!VS_IMG||!VS_IMG.width)return;const wx=VSX(),sx=X(wx),sy=Y(0);
 if(sx<-140||sx>W_+140)return;const h=PH*U*1.16,w=h*VS_IMG.width/VS_IMG.height,bob=Math.sin(t*2.2)*4*U,fl=Q.px<wx?-1:1;
 const k=Math.max(0,Math.min(1,Q.vsT/1.2));                                     // 0 solid, 1 gone
 if(k>=1)return;
 g2.save();g2.globalAlpha=1-k;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,sy+3,w*.4*(1-k*.6),5*U*(1-k*.6),0,0,7);g2.fill();
 if(k>0){const sl=6+Math.floor(k*10);g2.imageSmoothingEnabled=false;           // same glitch as Origin
  for(let i=0;i<sl;i++){const shy=-h+i*h/sl,hh=h/sl,jx=(Math.random()-.5)*70*U*k,sa=(Math.random()-.5)*34*U*k;
   g2.save();g2.translate(sx+jx,sy-bob+shy+hh/2+sa);g2.scale(fl*(1+k*.6*(i%2?1:-1))*(1-k*.4),1);
   g2.drawImage(VS_IMG,0,i*VS_IMG.height/sl,VS_IMG.width,VS_IMG.height/sl,-w/2,-hh/2,w,hh);g2.restore()}
  for(let i=0;i<10;i++)ci(sx+(Math.random()-.5)*w*1.6,sy-h+Math.random()*h,3*U,VS_PAL[i%3]||'#caa6ff',(1-k)*.55)}
 else{const g=g2.createRadialGradient(sx,sy+60,0,sx,sy+60,h*1.15);g.addColorStop(0,VS_PAL[0]+'55');g.addColorStop(1,VS_PAL[0]+'00');g2.fillStyle=g;g2.fillRect(sx-h*1.3,sy+60-h*1.3,h*2.6,h*2.6);
  g2.shadowColor=VS_PAL[0];g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,sy-bob);g2.scale(fl,1);g2.drawImage(VS_IMG,-w/2,-h,w,h)}
 g2.restore();
 if(Q.vsNear){tx_('Winter Spring',sx,sy-h-16,VS_PAL[0],MONO(12));tx_(coarse?'◉ TALK':'[E] TALK',sx,sy-h-34,'#e8f6ff',MONO(12))}}
function drawVsDlg(){if(!Q.dlg)return;const d=Q.dlg,mw=Math.min(W_-24,620),bx=(W_-mw)/2,bh=Math.round(Math.max(120,H_*.2)),by=H_-bh-(coarse?90:24);
 rc(bx,by,mw,bh,'#05060ff2');g2.strokeStyle='#4ee3f0';g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);
 if(VS_IMG&&VS_IMG.width){g2.imageSmoothingEnabled=false;g2.drawImage(VS_IMG,bx+10,by+10,64,64)}
 g2.textAlign='left';g2.fillStyle=VS_PAL[0];g2.font=MONO(13);g2.fillText('Winter Spring',bx+84,by+28);
 g2.fillStyle='#ece8df';g2.font=MONO(15);wrap(d.L[d.i][0].slice(0,Math.floor(d.c)),mw-100).forEach((l,i)=>g2.fillText(l,bx+84,by+54+i*22));
 g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?'TAP TO CONTINUE':'[E] / CLICK',bx+mw-12,by+bh-10)}
function area(){const x=Q.px;return x<1200?'THRESHOLD':x<2200?'OBSERVATION HALL':x<GB?'THE SEALED CHAMBER':x<EX-100?'THE PROOF ENGINE':'THE EXIT'}
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-Q.last)/1000||.016);Q.last=now;
 if(tx!==Q.ltx&&tx>w*.99){back();return}
 upd(dt);rounds(dt);validTick(dt);reach();scribeTalk();vsUpdate(dt);Q.sq+=(0-Q.sq)*Math.min(1,dt*12);
 if(Q.askT>0&&(Q.askT-=dt)<=0){Q.asked=1;sfx('core-activate');say('THE GATES UNSEAL','The ring above the chamber begins to turn. It has been waiting for someone to stop asking.',6,IK.cyan);Q.said.c=1}
 if(Q.hush>0)Q.hush-=dt;if(Q.mt>0)Q.mt-=dt;
 const tgt=.12+.22*Q.vault+.3*Q.asked+.36*Q.tf;Q.aw+=(tgt-Q.aw)*Math.min(1,dt*1.5);
 Q.vin+=((Q.inside?1:0)-Q.vin)*Math.min(1,dt*5);
 const vw=w/U;
 // during the verifier sequence the camera leaves you and goes with the proof: up to the chamber outline, across to
 // the engine where it is accepted, then back. you are locked for the duration, so the shot cannot be walked out of.
 let tg=Q.px-vw*.42+Q.face*60;
 if(Q.vt>=0&&Q.vt<9.8&&Q.st==='play'){const v=Q.vt;let fx;
  if(v<1.5)fx=lerp(Q.px,GM,smooth(0,1.5,v));                            // up to the chamber outline
  else if(v<2.7)fx=GM;
  else if(v<5.6)fx=lerp(GM,3900,smooth(2.6,4.8,v));                    // across to the engine, where it unlocks
  else fx=lerp(3900,Q.px,smooth(5.6,9.4,v));                            // and back to you before the door opens
  tg=Math.max(fx-vw*.5,Q.px-vw*1.15);Q.pan=1}else Q.pan=0;
 Q.cx+=(tg-Q.cx)*(1-Math.exp(-(Q.pan?2.4:5)*dt));Q.cx=Math.max(0,Math.min(LW-vw,Q.cx));
 let b=null,bd=120;interactables().forEach(o=>{const d=Math.hypot(Q.px-o.x,(Q.py-o.y)*.5);if(d<bd&&Q.st==='play'){bd=d;b=o}});Q.near=Q.lock?null:b;
 if(K.e){K.e=0;if(Q.mt>0&&!Q.near)Q.mt=0;else interact()}
 if(Q.px>400&&Q.area!==area()){Q.area=area();Q.at=3}Q.at=Math.max(0,Q.at-dt);
 Q.vp=Q.vp.filter(q=>(q.l-=dt)>0);Q.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});
 ax=X(Q.px);tx=Q.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}
// ---------------- drawing ----------------
function glyph(k,x,y,s,c,lw){g2.save();g2.translate(x,y);g2.strokeStyle=c;g2.lineWidth=lw||3;g2.beginPath();
 if(k===0)g2.arc(0,0,s,0,7);else if(k===1){g2.moveTo(0,-s);g2.lineTo(s,s*.8);g2.lineTo(-s,s*.8);g2.closePath()}else g2.rect(-s,-s,s*2,s*2);g2.stroke();g2.restore()}
function redact(x,y,w,h,t){rr(x,y,w,h,'#020208');for(let i=0;i<3;i++){const o=(Math.sin(t*.9+i*2)*.5+.5)*(w-30);rr(x+o,y-6-i*(h/3.3),34,h/4,'#0b0a1c')}}
// ---- VISUAL POLISH (render-only) ----
const Zp=window.ZKP;
const pWorld=f=>{g2.save();g2.translate(-Q.cx*U,GY);g2.scale(U,U);f();g2.restore()};   // world units, y down from the ground line
function pFloor(w,h,gy,t,p,a){if(!Zp)return;const c=Q.cx,fh=h-gy,ys=[.26,.55,.84].map(k=>gy+fh*k);   // floor slabs, light spill from the conduit
 g2.strokeStyle=rgba(IK.cyan,.07+a*.12);g2.lineWidth=1;g2.beginPath();ys.forEach(y=>{g2.moveTo(0,y);g2.lineTo(w,y)});
 ys.forEach((y,r)=>{const y0=r?ys[r-1]:gy+3,sp=170+r*50;for(let k=Math.floor((c-sp)/sp);k*sp-c<w/U+sp;k++){const sx=(k*sp+(r%2?sp/2:0)-c)*U;g2.moveTo(sx,y0);g2.lineTo(sx,y)}});g2.stroke();
 g2.globalAlpha=.05+a*.13;g2.fillStyle=IK.cyan;g2.fillRect(0,gy+3,w,9*U);g2.globalAlpha=.03+a*.07;g2.fillRect(0,gy+3+9*U,w,16*U);g2.globalAlpha=1}
function pConduit(t,a){if(!Zp)return;for(let i=0;i<40;i++){const x=((i*140+t*(60+a*160))%LW),sx=X(x+13);if(sx<-80||sx>W_+80)continue;Zp.glow(g2,sx,Y(-8)+2,40*U,10*U,IK.cyan,.18+a*.4)}}
function pWalls(){if(!Zp)return;pWorld(()=>{for(let i=0;i<4;i++){const x=260+i*230;Zp.rows(g2,x,-330,150,210,'#0a0a1e',.55,30,50);Zp.edge(g2,x,-330,150,210,IK.stone,'#000',.35,1.5)}
 Zp.edge(g2,900,-140,110,70,IK.stone,'#000',.4,1.5);Zp.rows(g2,900,-140,110,70,'#0a0a1e',.5,18,38)})}
function pHall(t,a){if(!Zp)return;pWorld(()=>{Zp.rows(g2,1280,-430,560,300,'#0a0a1e',.5,34,70);g2.fillStyle=IK.gold;g2.globalAlpha=.3;g2.fillRect(1280,-436,560,3);g2.fillRect(1280,-136,560,3);g2.globalAlpha=1;   // hall wall coursing + cornice lines
  PX.forEach((x,i)=>{const on=Q.pil[i];Zp.rows(g2,x-22,-170,44,170,'#0b0a1c',.65,28,44);g2.globalAlpha=.5;g2.fillStyle=on?IK.cyan:IK.stone;g2.fillRect(x-22,-170,2,170);g2.globalAlpha=.55;g2.fillStyle='#000';g2.fillRect(x+20,-170,2,170);g2.globalAlpha=1;
   g2.fillStyle=IK.brick;g2.fillRect(x-27,-9,54,9);g2.fillStyle=IK.stone;g2.fillRect(x-27,-9,54,2);g2.fillRect(x-26,-176,52,6);if(on){g2.globalAlpha=.4;g2.fillStyle=IK.cyan;g2.fillRect(x-26,-176,52,2);g2.globalAlpha=1}});   // pillar coursing, plinth, capital
  Zp.rows(g2,CON-34,-90,68,90,'#0b0a1c',.6,22,34);Zp.edge(g2,CON-34,-90,68,90,IK.stone,'#000',.4,1.5);Zp.edge(g2,VAULT-30,-40,60,40,IK.gold,'#000',.28,1.5)})}
function pLedges(t){if(!Zp)return;pWorld(()=>{FLT.forEach(([x,wd,top])=>{g2.globalAlpha=.3;g2.fillStyle='#000';g2.fillRect(x+2,-top+10,wd-4,7);g2.globalAlpha=1;g2.fillStyle='#12112a';g2.fillRect(x+4,-top+10,7,9);g2.fillRect(x+wd-11,-top+10,7,9);Zp.edge(g2,x,-top,wd,10,IK.gold,'#000',.3,1.5)})})}   // corbels + edge light under the optional ledges
function pFront(p){if(!Zp)return;Zp.motes(g2,0,0,W_,GY,T,22,IK.cyan,{alpha:.1+.32*Q.aw,size:Math.max(1.5,2*U),speed:5,seed:11,dir:-1})}   // data motes: brighter as the temple wakes
function scene(w,h,gy,t,p){const a=Q.aw,tf=Q.tf,c=Q.cx;
 // far rings + columns (parallax)
 ring(w*.7-c*U*.04,gy-h*.5,h*.46,.05,rgba(IK.vio,.2+a*.4),t);ring(w*.7-c*U*.04,gy-h*.5,h*.3,-.07,rgba(IK.cyan,.12+a*.4),t);
 for(let k=0;k<3;k++){const sp=.12+.2*k,cw=70+k*40,gap=360+k*120,col=['#0a0918','#0e0d24','#14132e'][k];for(let i=-1;i<LW/gap+2;i++){const x=i*gap-((c*sp)%gap)+c*0;const sx=x*U+(k*37),hh=(260+k*120+((i*53)%90))*U;rc(sx-(c*(1-sp))*U*0,gy-hh,cw*U,hh,col);rc(sx,gy-hh,3*U,hh,rgba(IK.cyan,.1+a*.5*(k+1)/3))}}
 rc(0,gy,w,h-gy,'#08071a');rc(0,gy,w,3,rgba(IK.cyan,.25+a*.6));pFloor(w,h,gy,t,p,a);
 for(let x=Math.floor(c/120)*120;x<c+w/U+120;x+=120)rr(x,0,2,200,'#0d0c24');
 // conduits along the floor: they carry light as the temple wakes
 const cl=rgba(IK.cyan,.15+a*.7);rr(0,-8,LW,3,cl);for(let i=0;i<40;i++){const x=((i*140+t*(60+a*160))%LW);rr(x,-8,26,3,rgba('#ffffff',.2+a*.6))}pConduit(t,a);
 // THRESHOLD: scratched walls, a dead workstation, failed tallies
 for(let i=0;i<4;i++){const x=260+i*230;rr(x,330,150,210,'#0f0e26');g2.strokeStyle=rgba(IK.stoneLt||'#8e94a6',.25);g2.lineWidth=1.5;for(let k=0;k<7;k++){g2.beginPath();g2.moveTo(X(x+12+k*18),Y(300-(k*37)%110));g2.lineTo(X(x+30+k*18),Y(240-(k*29)%90));g2.stroke()}rr(x+60,120,2,0,'#000')}
 pWalls();rr(900,70,110,70,'#171636');rr(900,70,110,4,IK.stone);rr(920,130,40,50,'#0a0a1a');g2.strokeStyle=rgba(IK.bad,.5);g2.lineWidth=2;g2.strokeRect(X(922),Y(128),36*U,44*U);rr(1000,34,40,34,'#201f44');if(Math.sin(t*3)>.6)spark_(X(940),Y(120),IK.cyan);
 // OBSERVATION HALL: the rules, the pillars, the console, the vault
 rr(1280,430,560,300,'#0d0c24');g2.strokeStyle=rgba(IK.gold,.5);g2.lineWidth=2;g2.strokeRect(X(1280),Y(430),560*U,300*U);
 const rl=[[0,1],[1,2],[3]];[0,1,2].forEach(i=>{const yy=380-i*92,bad=Q.lamp[i];rr(1300,yy+36,520,3,'#1b1a38');const col=bad?IK.bad:IK.gold;
  if(i===0){glyph(0,X(1400),Y(yy-4),14*U,col);arrow(X(1440),Y(yy-4),X(1520),col);glyph(1,X(1560),Y(yy-4),14*U,col)}
  if(i===1){glyph(1,X(1400),Y(yy-4),14*U,col);glyph(2,X(1560),Y(yy-4),14*U,col);g2.strokeStyle=bad?IK.bad:'#e25b4a88';g2.lineWidth=3;g2.beginPath();g2.moveTo(X(1460),Y(yy+12));g2.lineTo(X(1500),Y(yy-20));g2.moveTo(X(1500),Y(yy+12));g2.lineTo(X(1460),Y(yy-20));g2.stroke()}
  if(i===2){[0,1,2].forEach(k=>glyph(k,X(1400+k*60),Y(yy-4),12*U,col,2));g2.strokeStyle=col;g2.lineWidth=3;g2.beginPath();g2.moveTo(X(1370),Y(yy+14));g2.lineTo(X(1550),Y(yy-22));g2.stroke()}
  const done=Q.lit[i];ci(X(1760),Y(yy-4),9*U,bad?IK.bad:done?IK.ok:'#2a2a50',1);
  if(bad)ci(X(1760),Y(yy-4),22*U,IK.bad,.25+Math.sin(t*8)*.1);
  if(done){g2.strokeStyle=IK.ok;g2.lineWidth=2;g2.beginPath();g2.arc(X(1760),Y(yy-4),13*U,0,7);g2.stroke()}
  else if(!bad){tx_('· · ·',X(1760),Y(yy+30),'#3a3a60',MONO(10))}});
 for(let i=0;i<3;i++){const x=1190+i*20,y=-4-i*0;g2.strokeStyle='#e25b4a55';g2.lineWidth=2;g2.beginPath();for(let k=0;k<5;k++){g2.moveTo(X(1230+i*34+k*7),Y(14));g2.lineTo(X(1236+i*34+k*7),Y(2))}g2.stroke()}   // old failed tallies
 PX.forEach((x,i)=>{const on=Q.pil[i];rr(x-22,170,44,170,IK.brick);rr(x-22,170,44,5,on?IK.cyan:IK.stone);glyph(i,X(x),Y(205),13*U,on?IK.cyan:'#4a4a70',on?4:2);if(on){ci(X(x),Y(205),34*U,IK.cyan,.18);rr(x-3,170,6,Math.max(0,170-0),rgba(IK.cyan,.35))}
  g2.strokeStyle=rgba(on?IK.cyan:'#3a3a60',on?.7:.3);g2.lineWidth=2;g2.beginPath();g2.moveTo(X(x),Y(340));g2.lineTo(X(GM-40+i*40),Y(560));g2.stroke()});
 rr(CON-34,90,68,90,IK.brick);rr(CON-26,170,52,34,'#050510');tx_(Q.valid?'':Q.vault?'✓':Q.lamp.some(Boolean)?'INVALID':'···',X(CON),Y(150),Q.lamp.some(Boolean)?IK.bad:IK.ok,MONO(11));
 rr(VAULT-30,40,60,40,IK.stone);if(Q.vault){rr(VAULT-24,150,48,110,rgba(IK.gold,.12));if(!Q.sig){g2.save();g2.translate(X(VAULT),Y(105+Math.sin(t*2)*6));g2.rotate(t);g2.strokeStyle=IK.gold;g2.lineWidth=3;g2.strokeRect(-10*U,-10*U,20*U,20*U);g2.restore();ci(X(VAULT),Y(105),40*U,IK.gold,.2)}}else rr(VAULT-24,150,48,110,'#0a0a18');
 pHall(t,a);
 // THE CHAMBER (secret) with the verifier ring above it; gates A and B
 rr(GA,520,GB-GA,520,'#0a091c');g2.strokeStyle=rgba(IK.vio,.5+a*.4);g2.lineWidth=3;g2.strokeRect(X(GA),Y(520),(GB-GA)*U,520*U);
 for(let k=1;k<4;k++){g2.strokeStyle=rgba(IK.vio,.12+a*.2);g2.strokeRect(X(GA+k*50),Y(520-k*50),(GB-GA-k*100)*U,(520-k*100)*U)}
 rr(GM-120,440,240,170,'#030308');g2.strokeStyle=rgba(IK.cyan,.4);g2.lineWidth=2;g2.strokeRect(X(GM-120),Y(440),240*U,170*U);   // window: you can tell something is in there
 {g2.save();g2.beginPath();g2.rect(X(GM-120),Y(440),240*U,170*U);g2.clip();g2.translate(X(GM),Y(355));g2.rotate(t*.6);g2.fillStyle='#1d1a40';g2.beginPath();for(let i=0;i<5;i++){const an=i*1.2566,r=(40+14*Math.sin(t*1.7+i))*U;g2.lineTo(Math.cos(an)*r,Math.sin(an)*r)}g2.fill();g2.restore();redact(GM-120,440,240,170,t)}
 [GA,GB].forEach((x,i)=>{const open=Q.asked;rr(x-46,200,92,200,open?'#020208':IK.stone);if(!open){for(let k=0;k<5;k++)rr(x-40+k*18,200,5,200,'#0a0a1c')}else rr(x-36,190,72,190,rgba(IK.cyan,.1+.1*Math.sin(t*2)));tx_('AB'[i],X(x),Y(430),open?IK.gold:'#5a5a80',"700 "+Math.round(40*U)+"px 'Abril Fatface',serif");
  if(Q.call===i+1){ci(X(x),Y(300),90*U,IK.gold,.18+.1*Math.sin(t*6));glyph(0,X(x),Y(480),26*U,IK.gold,5)}});
 g2.save();g2.translate(X(GM),Y(660));for(let k=0;k<3;k++){g2.save();g2.rotate(t*(Q.asked?(k%2?-.9:1.1):.1)*(k+1)*.5);g2.strokeStyle=rgba(k===1?IK.gold:IK.cyan,.35+a*.6);g2.lineWidth=(4-k)*U;g2.beginPath();g2.ellipse(0,0,(150-k*30)*U,(54-k*10)*U,k*.4,0,7);g2.stroke();g2.restore()}g2.restore();
 rr(REQ-30,95,60,95,IK.brick);rr(REQ-22,175,44,30,'#050510');glyph(2,X(REQ),Y(150),11*U,Q.sig?IK.gold:'#4a4a70',2);
 // THE PROOF ENGINE (waits behind the chamber)
 const ex=3900,ey=380,en=Q.valid?1:.12+.2*Q.asked;
 for(let k=0;k<4;k++){g2.save();g2.translate(X(ex),Y(ey));g2.rotate(t*(.15+k*.12+(Q.vt>0?Q.vt*.12:0))*(k%2?-1:1));g2.setLineDash([28,16]);g2.strokeStyle=rgba(k%2?IK.gold:IK.cyan,.2+en*.7*(Q.tf*.5+.5));g2.lineWidth=(5-k)*U;g2.beginPath();g2.arc(0,0,(300-k*62)*U,0,7);g2.stroke();g2.restore()}
 rr(ex-50,ey+50,100,100,'#07061a');g2.strokeStyle=rgba(IK.cyan,.4+Q.tf*.6);g2.lineWidth=2;g2.strokeRect(X(ex-50),Y(ey+50),100*U,100*U);if(Q.tf>0)ci(X(ex),Y(ey),(70+Q.tf*60)*U,'#fff',.15*Math.sin(Q.tf*3)+.1);
 // the proof travelling: from the chamber's OUTLINE to the verifier ring, to the engine. the secret never moves.
 if(Q.vt>=0){const v=Q.vt,k1=Math.max(0,Math.min(1,(v-1.4)/1.2)),k2=Math.max(0,Math.min(1,(v-2.6)/1.0));
  if(v>1.2&&v<3.6){const x1=GM+(ex-GM)*k1*.0+Math.cos(v*4)*0,px_=lerp(GM,GM,k1),py_=lerp(520,660,k1);ci(X(px_),Y(py_),(14+Math.sin(v*18)*3)*U,'#fff',1);ci(X(px_),Y(py_),38*U,IK.cyan,.3)}
  if(v>2.4&&v<3.7){const px_=lerp(GM,ex,k2),py_=lerp(660,ey,k2);ci(X(px_),Y(py_),16*U,IK.gold,1);ci(X(px_),Y(py_),42*U,IK.gold,.3)}
  if(v>3.4&&v<4.4)rc(0,0,w,h,rgba('#ffffff',.55*(1-(v-3.4))))}
 // exit door: physical, opens only after the temple has changed
 const eo=Q.exitOpen;rr(EX-60,250,120,250,eo?'#fff':'#05050f');rr(EX-52,240,104,240,eo?rgba(IK.cyan,.7):'#0b0b20');g2.strokeStyle=eo?'#fff':rgba(IK.vio,.5);g2.lineWidth=3;g2.strokeRect(X(EX-60),Y(250),120*U,250*U);if(eo)ci(X(EX),Y(130),150*U,IK.cyan,.18+.08*Math.sin(t*3));
 // optional ledge props
 FLT.forEach(([x,wd,top],i)=>{rr(x,top,wd,10,IK.brick);rr(x,top,wd,3,rgba(IK.gold,.5))});rr(NOTE-20,430,40,40,'#12112a');glyph(1,X(NOTE),Y(410),9*U,rgba(IK.gold,Q.noteSeen?.4:.9),2);
 pLedges(t);
 // the Scribe watches; it never explains
 {const sx=scribeX(),x=X(sx),y=Y(0),bob=Math.sin(t*2)*4*U;g2.fillStyle='#0b0a1c';g2.beginPath();g2.moveTo(x-18*U,y);g2.lineTo(x-10*U,y-70*U+bob);g2.lineTo(x+10*U,y-70*U+bob);g2.lineTo(x+18*U,y);g2.fill();g2.strokeStyle=rgba(IK.gold,.6);g2.lineWidth=2;g2.stroke();ci(x,y-60*U+bob,5*U,IK.gold,.9)}
 // dust
 for(let i=0;i<46;i++){const x=((i*173+t*8*(i%4+1))%(w+200))-100,y=gy*(((i*61)%100)/100)+Math.sin(t+i)*10;rc(x,y,2,2,'#ffffff'+(i%3?'22':'44'))}
 // temple transformation: warm light floods the stone
 if(tf>0){g2.globalAlpha=tf*.22;rc(0,0,w,gy,IK.cyan);g2.globalAlpha=1}}
function spark_(x,y,c){ci(x,y,3,c,.9)}
function arrow(x0,y,x1,c){g2.strokeStyle=c;g2.lineWidth=3;g2.beginPath();g2.moveTo(x0,y);g2.lineTo(x1,y);g2.moveTo(x1-9,y-8);g2.lineTo(x1,y);g2.lineTo(x1-9,y+8);g2.stroke()}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(Q.px),sy=Y(Q.py),idle=Q.gr&&Math.abs(Q.vx)<20?Math.sin(T*3)*.012:0,wS=1+.22*Q.sq-idle,hS=1-.22*Q.sq+idle,sup=support();
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(sup)+3,aw*.38,5*U,0,0,7);g2.fill();
 if(Q.sig){ci(sx,sy-ph*.5,ph*.9,IK.gold,.08)}
 g2.save();g2.translate(sx,sy);g2.scale(Q.face*wS,hS);g2.imageSmoothingEnabled=false;g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore()}
function drawFront(p){pFront(p);[300,1120,3250,4300].forEach(x=>rr(x,330,36,330,'#06050f'));
 Q.vp.forEach(q=>{g2.globalAlpha=Math.max(0,q.l);rc(X(q.x),Y(q.y),q.s*U,q.s*U,q.c)});g2.globalAlpha=1;
 // INSIDE THE CHAMBER: you cannot see out, and nobody can see in. the temple calls a side.
 if(Q.vin>.01){const v=Q.vin,px=X(Q.px),py=Y(Q.py+60);g2.save();const gd=g2.createRadialGradient(px,py,40*U,px,py,260*U);gd.addColorStop(0,'rgba(2,2,8,'+(.45*v)+')');gd.addColorStop(1,'rgba(2,2,8,'+(.96*v)+')');g2.fillStyle=gd;g2.fillRect(0,0,W_,H_);
  g2.globalAlpha=v*.5;redact_(W_/2-150*U,H_*.28,300*U,150*U,T);g2.globalAlpha=1;
  if(Q.call){const L=Q.call===1;tx_(('AB')[Q.call-1],W_/2,H_*.34,IK.gold,"700 "+Math.round(120*U)+"px 'Abril Fatface',serif");g2.strokeStyle=IK.gold;g2.lineWidth=4;arrow(W_/2+(L?-50:50)*U,H_*.34+30*U,W_/2+(L?-170:170)*U,IK.gold)}g2.restore()}
 if(Q.px>GA-200&&Q.px<GB+200&&!Q.valid&&(Q.rounds>0||Q.inside)){for(let i=0;i<5;i++)ci(W_/2-60*U+i*30*U,H_-(coarse?150:60),8*U,i<Q.rounds?IK.cyan:'#2a2a50',1)}}
function redact_(x,y,w,h,t){g2.fillStyle='#000';g2.fillRect(x,y,w,h);for(let i=0;i<3;i++){g2.fillStyle='#14132c';g2.fillRect(x+(Math.sin(t+i*2)*.5+.5)*(w-50),y+i*h/3.2,50,h/5)}}
function drawHud(p){g2.textAlign='center';
 if(Q.at>0&&Q.area){g2.globalAlpha=Math.min(1,Q.at);tx_(Q.area,W_/2,34,'#ece8df',MONO(15));g2.globalAlpha=1}
 if(Q.sig){g2.textAlign='left';g2.fillStyle='#07061aee';g2.fillRect(12,10,150,28);g2.strokeStyle=IK.gold;g2.lineWidth=1.5;g2.strokeRect(12,10,150,28);g2.fillStyle=IK.gold;g2.font=MONO(11);g2.fillText('SIGIL  ██████',22,29)}
 if(Q.near&&!Q.msg||Q.near&&Q.mt<=0){const o=Q.near,lab=({pil:'[E] toggle',con:'[E] verify condition',vault:'[E] take',req:'[E] try the chamber',note:'[E] read'})[o.k];tx_(coarse?'◉':lab,X(o.x),Y(o.y+(o.k==='pil'?360:230)),'#e8f6ff',MONO(12))}
 if(Q.msg&&Q.mt>0&&!Q.dlg){const m=Q.msg,mw=Math.min(W_-24,640),bx=(W_-mw)/2;g2.font=MONO(14);const ln=wrap(m.s,mw-32),bh=54+ln.length*22,by=H_-bh-(coarse?100:22);g2.save();g2.globalAlpha=Math.min(1,Q.mt*2);rc(bx,by,mw,bh,'#05060ff2');g2.strokeStyle=m.c;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);
  g2.textAlign='left';g2.fillStyle=m.c;g2.font="700 "+Math.round(Math.max(18,22*U))+"px 'Abril Fatface',serif";g2.fillText(m.h,bx+16,by+32);g2.fillStyle='#ece8df';g2.font=MONO(14);ln.forEach((l,i)=>g2.fillText(l,bx+16,by+56+i*22));g2.restore()}
 if(Q.vt>=0&&Q.vt<3.6){const k=Q.vt;g2.globalAlpha=Math.min(1,k);tx_('SECRET  ████  →  PROOF  →  VERIFIER  →  '+(k>3.4?'VALID ✓':'...'),W_/2,H_*.22,k>3.4?IK.ok:IK.cyan,MONO(16));g2.globalAlpha=1}
 if(Q.vt>=3.4){g2.globalAlpha=Math.min(1,Q.vt-3.4)*(Q.vt<8?1:Math.max(0,1-(Q.vt-8)));tx_('VALID ✓',W_/2,H_*.46,IK.ok,"700 "+Math.round(96*U)+"px 'Abril Fatface',serif");g2.globalAlpha=1}}
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
// ---------------- wiring into the shared engine ----------------
DEC.proof=function(w,h,gy,t,p){if(!isP()){return}scene(w,h,gy,t,p)};
const _bgo=bg;bg=function(w,h,gy,p){if(isP()){frame(w,h,gy);cam=Q.cx*U}_bgo(w,h,gy,p)};
const _avo=avatar;avatar=function(w,h,gy,p){if(isP()){drawPlayer(p);drawVS(p,T);drawVsDlg();drawFront(p);drawHud(p)}else _avo(w,h,gy,p)};
const _sto=startWorld;startWorld=function(i){const me=W[i].id==='proof';if(me)pInit();_sto(i);if(me)$z('wf').innerHTML=''};
const _spo=stopWorld;stopWorld=function(){if(Q)Q.on=0;ctl(0);_spo()};
});

/* ZKSCAPE world 01: ORIGIN - an explorable ruin: talk to the zkSNARK, find 5 hidden discoveries, unlock the Origin Shard.
   Built on the same engine hooks and movement model as Shielded Valley (bg/avatar/startWorld/stopWorld wrappers, own physics, own touch controls).
   Shielded Valley and every other world are untouched. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'origin',n:'ORIGIN',title:'THE ORIGIN',sub:'Why does Zcash exist?',desc:'Explore the ruins, talk to the zkSNARK, and find 5 hidden pieces of the story to unlock the Origin Shard.',q:'Public money does not have to mean public history.',
 sort:[['',0]], /* engine flag only (same integration as Shielded Valley): no default walk-to-orb hotspots - this world runs its own exploration loop */
 deep:'Zcash is a proof-of-work blockchain; privacy is an option users choose per transaction.'});
A.origin='Origin Shard';
const OLD=function(w,h,gy,t,p){for(let i=0;i<6;i++){const x=w*(.1+i*.16),q=h*(.1+.06*(i%3)),o=Math.sin(t+i)*6;rc(x,gy-q-o,26,q,'#1a1c2e');rc(x+4,gy-q-o,4,q,p.se)}
 const s=h*.22,bx=w*.5,by=gy-h*.3+Math.sin(t)*8;g2.shadowColor=p.pr;g2.shadowBlur=40;rc(bx-s/2,by-s/2,s,s,'#12142a');g2.strokeStyle=p.pr;g2.lineWidth=3;g2.strokeRect(bx-s/2,by-s/2,s,s);g2.shadowBlur=0;tx_('2016',bx,by+s*.14,p.pr,`${s*.4}px 'Abril Fatface'`);
 for(let i=0;i<8;i++)rc(w*(.05+i*.13)+Math.cos(t+i)*10,h*(.2+.1*(i%3))+Math.sin(t*.8+i)*14,14,14,p.ac)};
TH.origin={sky:['#140a04','#3a1a08'],moon:[.78,.2,.09,'#ffb347','eclipse'],mt:'#120905',fog:'#ff9a3c',amb:'ember'};
GIANT.origin=function(w,h,gy,t,th,p,c,id,o,f){ring(w*.16+o,gy-h*.05,h*.6,.1,f,t);ring(w*.16+o,gy-h*.05,h*.42,-.15,p.pr,t);g2.strokeStyle=f+'66';g2.lineWidth=2;g2.font="150px 'Abril Fatface'";g2.textAlign='center';g2.strokeText('2016',w*.5+o,h*.24);for(let i=0;i<30;i++)ci(w*(.2+i*.02)+o,h*(.04+.02*Math.sin(i)),2,'#fff',.7)};
LM.origin=function(x,y,s,c,t,a,B){B();hg.arc(0,0,s,Math.PI,0);hg.lineTo(s,s);hg.moveTo(-s,0);hg.lineTo(-s,s);hg.stroke();B();hg.arc(0,-s*.3,s*.25,0,7);hg.fill();};

// ======================= level data (1 unit = U px; y = height above ground, negative = underground) =======================
const LW=6200,HW=30,HH=100,PH=112,SPD=330,JMP=830,GRAV=2500,PIT=[2480,2860],PF=-180,CH=[3700,4500],GX=5600,SX=5840,TALK=170,NX=420;
const SOL=[[1180,70,110],[3060,90,100]];                                                         // low ruin blocks (solid, jumpable)
const FLT=[[1380,120,80],[1520,110,150],[1660,110,225],[1800,180,300],[2000,100,420],            // tower of broken steps -> monument (and a secret ledge)
 [PIT[0],110,-90],[PIT[1]-110,110,-90],                                                           // steps out of the underground chamber
 [3750,120,80],[3930,110,150],[4110,110,230],[4290,110,150],[4440,60,80],                         // crossing the broken ground
 [4960,90,70],[5060,90,130],[5170,220,190]];                                                      // hidden stair to the high shrine
const D=[{x:905,y:55,k:'ledger',h:'PUBLIC HISTORY',s:'On a transparent blockchain, transaction activity can be publicly visible. That can reveal information about how money moves.'},
 {x:1890,y:362,k:'2016',h:'ZCASH \u2014 2016',s:'Zcash launched in October 2016, introducing a new approach to digital money with privacy built into the protocol.'},
 {x:2670,y:PF+55,k:'Z',h:'ZEC',s:'ZEC is the native cryptocurrency of the Zcash network. It is the currency used for transactions within the network.'},
 {x:4165,y:292,k:'21M',h:'21 MILLION',s:'Zcash has a maximum supply of 21 million ZEC, like Bitcoin.'},
 {x:5290,y:252,k:'choice',h:'PRIVACY BY CHOICE',s:'Zcash supports both transparent and shielded transactions. Shielded transactions use zero-knowledge cryptography to protect transaction information while still allowing the network to verify it.'}];
const EGG={x:2050,y:482,s:'"The best secrets are shielded." \u2014 scratched into the stone by someone very old.'};
const PROG=['Something changed when digital money became public. Find the first clue.','Good. But knowing the problem is only the beginning.','Two pieces. Each one changes how you read the last.',"Now you're seeing why privacy matters.",'One final piece remains.','You found the story. Now you understand the origin. The sealed passage is open.'];
const DELIV=[['PUBLIC HISTORY...','That is where the question begins: when money is public, so is its history.','On an open ledger like Bitcoin\'s, an address is not a name. But once an address is linked to a person, every payment it ever made can be followed.','Zcash was built to change that: keep the public ledger, without the public history.'],['ZCASH \u2014 2016...','An answer began taking shape. Privacy, built into the protocol.','Zcash launched on October 28, 2016. It started from Bitcoin\'s design and added zero-knowledge cryptography, based on research called Zerocash.','Like Bitcoin, it is run by miners: Zcash is a proof-of-work blockchain.'],['ZEC...','The network needed a currency of its own.','ZEC is the unit you hold and send. One ZEC divides into 100,000,000 zatoshis, the way a bitcoin divides into satoshis.','New ZEC enters circulation only through the block subsidy: the newly issued coins in each block. Nobody can print more by decree.','Miners earn that subsidy plus the transaction fees in the blocks they find. Those are two different things, and only the subsidy is new money.'],['21 MILLION...','Even private money still has rules.','The 21 million cap is written into the protocol, and the block subsidy that creates new coins halves roughly every four years. It has halved twice so far, in 2020 and 2024.','Not all of the subsidy goes to miners. In the first four years a founders\' reward took a share of it. From the 2020 halving, a share went to development funding instead, under protocol rules that have changed over time.','Shielded or not, every block must follow the rules, or the network rejects it.'],['PRIVACY BY CHOICE...','Zcash has two kinds of addresses. A transparent one, starting with t, is public like Bitcoin. A shielded one hides the sender, the receiver and the amount.','Shielded is a choice made per transaction. Nothing is private automatically, so choose on purpose.','Now you understand. The sealed passage is open. Go and claim the Shard.']];
const HINT=['Some stones hide what they guard.','Not everything worth finding is on the ground.','The earth keeps secrets too.','Cross the broken ground, if you dare.','Something still stands above the ruins, far to the east.'];
const NPC=new Image();
NPC.onload=()=>{try{const c=removeBg(NPC);c.complete=true;if(!c.width)c.width=NPC.width;if(!c.height)c.height=NPC.height;NPC_IMG=c;try{NPC_PAL=extract(c)[0]}catch(e){NPC_PAL=['#cfd8ff','#9db8ff','#ffffff']}}catch(e){NPC_IMG=NPC;NPC_PAL=['#cfd8ff','#9db8ff','#ffffff']}};
NPC.src='NPCs/zkSNARK_clean.png';let NPC_IMG=NPC,NPC_PAL=['#cfd8ff','#9db8ff','#ffffff'];
let O=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,e:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-O.cx)*U,Y=y=>GY-y*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),isO=()=>run&&cur&&cur.id==='origin'&&O&&O.on;
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixc=(a,b,t)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
function oInit(){O={on:1,px:140,py:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,cx:0,sq:0,got:[0,0,0,0,0],n:0,next:0,carry:-1,bridge:0,dt:0,out:0,w2:0,egg:0,msg:null,mt:0,dlg:null,met:0,talks:0,vp:[],ft:[],gate:0,sh:0,st:'play',last:performance.now(),step:0,hf:0,safe:3640,warn:0,near:0,disappear:0,intro:0,spawning:0,pz:null,solved:[0,0,0,0,0],hit:[],pzT:0,buzz:0,
 finOn:0,finIn:0,finT:0,finStage:0,finLine:0,finDone:0};K.l=K.r=K.j=K.jp=K.e=0;ctl(1)}
// ---- finale: zkSNARK returns at the gate, warns the player, then glitches away for good ----
const FINX=SX-190;
const FINL=[['Be careful out there.','Some of them will want to trick you.'],
 ['Some of them will want to help you.','You have to work out which is which. That is the whole point of this place.'],
 ['Remember it like this.','Transparent shows everything. Shielded hides the details. Either way, the network checks the rules.'],['You got this, my friend.','Go and finish what I started.']];
function drawFinNpc(p,t){if(!O.finOn||O.finDone)return;const sx=X(FINX);if(sx<-200||sx>W_+200||!NPC_IMG||!NPC_IMG.width)return;
 const grow=O.finStage===2?1+Math.min(1,O.finT/2)*1.5:1;                       // he gets bigger before he goes
 const gh=PH*U*1.16*grow,gw=gh*NPC_IMG.width/NPC_IMG.height,bob=Math.sin(t*2.2)*4*U,fl=O.px<FINX?-1:1;
 const k=O.finStage===2?Math.min(1,O.finT/2):0;                                // 0 = solid, 1 = gone
 g2.save();g2.globalAlpha=1-k;
 const g=g2.createRadialGradient(sx,Y(60*grow),0,sx,Y(60*grow),gh*1.3);g.addColorStop(0,NPC_PAL[0]+'88');g.addColorStop(1,NPC_PAL[0]+'00');g2.fillStyle=g;g2.fillRect(sx-gh*1.4,Y(60*grow)-gh*1.4,gh*2.8,gh*2.6);
 if(k>0){const slices=6+Math.floor(k*12);g2.imageSmoothingEnabled=false;                       // same glitch, amplified
  for(let i=0;i<slices;i++){const sy=-gh+i*gh/slices,hh=gh/slices,jx=(Math.random()-.5)*90*U*k,sa=(Math.random()-.5)*40*U*k;
   g2.save();g2.translate(sx+jx,Y(0)-bob+sy+hh/2+sa);g2.scale(fl*(1+k*.7*(i%2?1:-1))*(1-k*.35),1+k*.12);g2.drawImage(NPC_IMG,0,i*NPC_IMG.height/slices,NPC_IMG.width,NPC_IMG.height/slices,-gw/2,-hh/2,gw,hh);g2.restore()}
  for(let i=0;i<16;i++){g2.globalAlpha=(1-k)*.7;ci(sx+(Math.random()-.5)*gw*2,Y(0)-gh+Math.random()*gh,3*U,NPC_PAL[i%3]||'#9a6bff')}}
 else{g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(0)+3,gw*.4,5*U,0,0,7);g2.fill();
  g2.save();g2.shadowColor=NPC_PAL[0];g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,Y(0)-bob);g2.scale(fl,1);g2.drawImage(NPC_IMG,-gw/2,-gh,gw,gh);g2.restore()}
 g2.restore();g2.globalAlpha=1;
 if(O.finStage<2)tx_('zkSNARK',sx,Y(gh+34),NPC_PAL[0],MONO(12))}
function updateFin(dt){if(!O.finOn||O.finDone)return;O.finT+=dt;
 if(O.finIn>0){O.finIn-=dt;if(O.finIn<=0)AM.sfx('core-activate');return}
 if(O.finStage===0){O.finT=0;O.finStage=1;O.finLine=0;O.msg={t:'ret',h:'zkSNARK',s:FINL[0][0]+' '+FINL[0][1]};O.mt=7;AM.sfx('interaction');return}
 if(O.finStage===1){if(O.mt<=0){O.finLine++;if(O.finLine<FINL.length){O.msg={t:'ret',h:'zkSNARK',s:FINL[O.finLine][0]+' '+FINL[O.finLine][1]};O.mt=7;AM.sfx('interaction')}
  else{O.finStage=2;O.finT=0;if(!reduce)wow=Math.max(wow,.9);AM.sfx('incorrect')}}return}
 if(O.finStage===2&&O.finT>2.4){O.finStage=3;O.finDone=1;O.finOn=0;AM.sfx('card-reveal')}}
if(!window.__zkOK){window.__zkOK=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{if(!isO())return;if(e.code==='Escape'&&O.pz){pzClose();e.preventDefault();return}const k=km(e.code);if(!k)return;e.preventDefault();if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0})}
addEventListener('pointerdown',e=>{if(!isO()||e.target!==g2.canvas||O.st==='dying')return;
 if(O.pz){const r=g2.canvas.getBoundingClientRect();pzClick((e.clientX-r.left)/r.width*W_,(e.clientY-r.top)/r.height*H_);return}
 if(O.dlg){advance();return}const r=g2.canvas.getBoundingClientRect(),sx=X(NX)+r.left,dx=e.clientX-sx;if(Math.abs(dx)<90*U&&Math.abs(O.px-NX)<TALK)talk();else if(O.mt>0)O.mt=0});
function ctl(on){let c=$z('octl');if(c&&c.dataset.own!=='origin'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='octl';c.dataset.own='origin';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('\uD83D\uDCAC','e','talk'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
const spark=(x,y,c,n=10)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*220;O.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.8,c,s:5,g:300})}};
const dust=n=>{for(let i=0;i<n;i++)O.vp.push({x:O.px+(Math.random()-.5)*40,y:O.py,vx:(Math.random()-.5)*140,vy:30+Math.random()*90,l:.45,c:'#cfd6e4',s:5,g:0})};
const say=(x,s)=>O.ft.push({x,y:255,s,l:3.2});

// ======================= dialogue (zkSNARK) =======================
function talk(){if(O.dlg||O.st!=='play')return;let L;O.talks++;
 if(O.carry>=0){const i=O.carry;O.got[i]=2;O.n++;O.next=i+1;O.carry=-1;O.hf=1.2;spark(NX,90,'#fff',30);AM.sfx('correct');if(!reduce)wow=Math.max(wow,.4);O.msg={t:'ret',h:D[i].h,s:'Delivered to the guide.'};O.mt=4;L=DELIV[i].slice();if(i===3){O.bridge=1;say(CH[0]+380,'A bridge of light forms across the broken ground.')}
  if(O.n<5)L.push(HINT[O.next]);else{O.disappear=0.001;setTimeout(()=>{if(O.on){say(GX,'A sealed passage groans open...');AM.sfx('core-activate')}},900)}}
 else if(O.sh)L=['The Origin Shard is yours.'];
 else if(!O.met&&O.n===0){O.met=1;O.intro=1;L=['Before you can understand ZEC, you need the story behind it. Five pieces are hidden in these ruins - find them and bring each back to me.','I built ZKSCAPE to show you what Zcash actually is, without a single lecture.','World one walks you through the Origin. Two Shielded Valley. Three the Proof Vault and its checker...','Later wait the Proof Observatory, the Silent Vault, a Noir gate, the Zilkroad. Each world earns a Shard. Collect them all and the Ledger opens.','Look behind things. Look up. Look down. And stay close a moment - I have one more thing to show you before I go.']}
 else{O.met=1;L=[PROG[O.n]];if(O.next<5&&O.talks%2===0)L.push(HINT[O.next])}
 O.dlg={L,i:0,c:0};AM.sfx('interaction')}
function advance(){const d=O.dlg;if(!d)return;if(d.c<d.L[d.i].length){d.c=999;return}AM.sfx('interaction');if(++d.i>=d.L.length){O.dlg=null;if(O.intro){O.intro=0;O.disappear=0.001}}else d.c=0}

// ======================= physics (same model as Shielded Valley, plus underground floor + chasm) =======================
const floorAt=x=>x>CH[0]&&x<CH[1]?(O&&O.bridge?0:-700):x>PIT[0]&&x<PIT[1]?PF:0;
function updatePlayer(dt){if(O.st==='dying')return;const live=O.st==='play'&&!O.dlg&&!O.pz,dir=live?K.r-K.l:0,tv=dir*SPD;
 O.vx+=Math.sign(tv-O.vx)*Math.min(Math.abs(tv-O.vx),(O.gr?2800:1900)*dt);if(dir)O.face=dir;
 O.coy=O.gr?.1:O.coy-dt;O.buf-=dt;if(K.jp){O.buf=.12;K.jp=0}
 if(live&&O.buf>0&&O.coy>0){O.vy=JMP;O.gr=0;O.coy=0;O.buf=0;O.sq=-1;dust(8);AM.sfx('interaction')}
 if(live&&!K.j&&O.vy>0)O.vy-=GRAV*1.2*dt;
 O.px+=O.vx*dt;wallsX();const y0=O.py;O.vy-=GRAV*dt;O.py+=O.vy*dt;landY(y0);
 if(O.gr&&Math.abs(O.vx)>60&&(O.step-=dt)<=0){O.step=.26;AM.sfx('step');if(Math.random()<.6)dust(1)}}
function wallsX(){for(const [x,w,t] of SOL)if(O.py<t-2&&O.px+HW>x&&O.px-HW<x+w){O.px=O.vx>=0?x-HW:x+w+HW;O.vx=0}
 if(O.py<-2&&O.px>PIT[0]-60&&O.px<PIT[1]+60)O.px=Math.max(PIT[0]+HW,Math.min(PIT[1]-HW,O.px));      // inside the chamber the walls hold you
 const lim=O.gate>=1?SX+160:GX-80;O.px=Math.max(HW,Math.min(lim,O.px))}                            // the sealed passage is a wall until 5/5
function landY(y0){let on=0;const f=floorAt(O.px);if(O.py<=f){if(f<-300){originDeath();return}O.py=f;on=1}
 for(const [x,w,t] of SOL.concat(FLT))if(O.vy<=0&&y0>=t-2&&O.py<=t&&O.px+HW>x&&O.px-HW<x+w){O.py=t;on=1}
 if(on){if(O.vy<-420){O.sq=1;dust(10);AM.sfx('step')}O.vy=0}O.gr=on;if(on&&O.py>=0&&O.px<CH[0]-60)O.safe=Math.max(140,O.px)}
function originDeath(){if(O.st==='dying')return;
 /* FUTURE LIVES SYSTEM goes here (e.g. S.lives--, lock + cooldown when 0). For now: no penalty, just return to the HUB. */
 O.st='dying';O.dt=0;O.vx=O.vy=0;O.carry=-1;spark(O.px,Math.max(O.py,-200)+40,'#fff',30);AM.sfx('incorrect')}
const support=()=>{let s=floorAt(O.px);for(const [x,w,t] of SOL.concat(FLT))if(O.px+HW>x&&O.px-HW<x+w&&t<=O.py+2&&t>s)s=t;return s};
function updateCamera(dt){const vw=W_/U,tg=O.px-vw*.42+O.face*60;O.cx+=(tg-O.cx)*(1-Math.exp(-5*dt));O.cx=Math.max(0,Math.min(LW-vw,O.cx))}

// ======================= discoveries, gate, shard =======================
function collect(){O.nd=-1;const i=O.next,d=D[i];
 if(d&&O.got[i]===0&&O.carry<0&&O.st==='play'&&Math.hypot(O.px-d.x,O.py+HH*.5-d.y)<62){
  if(!O.met){if(O.w2<=0){O.w2=3;say(d.x,'Something stirs here... speak to the guide first.')}}
  else O.nd=i}                                                                        // stand close: [E] inspects the shard
 if(!O.egg&&O.st==='play'&&Math.hypot(O.px-EGG.x,O.py+HH*.5-EGG.y)<62){O.egg=1;spark(EGG.x,EGG.y,'#ffd35a',24);O.msg={t:'egg',h:'SECRET FOUND',s:EGG.s};O.mt=7;AM.sfx('correct')}}
function updateGate(dt){if(O.n===5&&O.gate<1)O.gate=Math.min(1,O.gate+dt/2.2);O.hf=Math.max(0,O.hf-dt);O.mt-=dt;O.w2-=dt;
 if(O.n<5&&O.st==='play'&&Math.abs(O.px-(GX-80))<12&&(O.warn-=dt)<=0){O.warn=2.5;say(GX,'Sealed by five symbols ('+O.n+'/5).')}
 if(O.gate>=1&&!O.sh&&O.st==='play'&&!O.finOn&&Math.abs(O.px-(FINX+40))<150){O.finOn=1;O.finIn=1.1;AM.sfx('collectible')}
 if(O.gate>=1&&!O.sh&&O.st==='play'&&O.finDone&&Math.abs(O.px-SX)<55){O.sh=1;O.st='done';spark(SX,150,'#fff',50);if(!reduce)wow=1;AM.sfx('collectible');setTimeout(()=>{if(!O.on)return;if(S.done.origin){fact('\u2713 ALREADY DISCOVERED');setTimeout(back,2800)}else complete()},900)}
 O.near=Math.abs(O.px-NX)<TALK&&!O.dlg;if(K.e&&!O.pz){K.e=0;if(O.st==='dying'){}else if(O.dlg)advance();else if(O.near)talk();else if(O.nd>=0&&!O.solved[O.nd]){if(!O.met)say(D[O.nd].x,'Something stirs here... speak to the guide first.');else pzOpen(O.nd)}else if(O.mt>0)O.mt=0}
 if(O.dlg&&O.dlg.c<O.dlg.L[O.dlg.i].length)O.dlg.c+=dt*46}
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-O.last)/1000||.016);O.last=now;
 if(tx!==O.ltx&&tx>w*.99){back();return}
 if(O.pz&&O.buzz>0)O.buzz-=dt*2
 updatePlayer(dt);collect();updateGate(dt);updateFin(dt);updateCamera(dt);O.sq+=(0-O.sq)*Math.min(1,dt*12);
 if(O.spawning){O.disappear-=dt*1.4;if(O.disappear<=0){O.disappear=0;O.spawning=0}}
 else if(O.disappear>0)O.disappear+=dt;
 O.vp=O.vp.filter(q=>(q.l-=dt)>0);O.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});O.ft=O.ft.filter(f=>(f.l-=dt)>0);
 if(O.st==='dying'){O.dt+=dt;if(O.dt>1.1&&!O.out){O.out=1;back()}}
 ax=X(O.px);tx=O.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}

// ======================= shard puzzles (5 types, one per discovery) =======================
const PZT=['arrow','seal','wire','light','balance'];
const ARRC=['↑','→','↓','←'],WCOL=['#e25b4a','#7ddea0','#6a9dff'];
function pzOpen(i){O.pz={t:PZT[i],i,s:0,bad:0,t0:performance.now()};
 const r=()=>({x:0,y:0,w:0,h:0});
 if(PZT[i]==='arrow')O.pz.a=[1,2,0,3];                                     // 0=up 1=right 2=down 3=left
 if(PZT[i]==='seal')O.pz.f=[2,0,3,1];                                     // fragment rotations (solved = 0,1,2,3)
 if(PZT[i]==='wire'){O.pz.sel=-1;O.pz.lock=[0,0,0];O.pz.map=[2,0,1]}      // input i -> output slot
 if(PZT[i]==='light'){O.pz.g=[0,0,1, 0,1,1, 1,1,1]}                      // all-on with the top-left cross toggled off: one click solves
 if(PZT[i]==='balance'){O.pz.c=[0,0,0,0];O.pz.side=[1,1,1,0]}             // coins, which pan
 AM.sfx('interaction')}
function pzClose(){O.pz=null;O.hit=[]}
function pzSolved(){const i=O.pz.i;O.solved[i]=1;pzClose();O.got[i]=1;O.carry=i;const d=D[i];
 spark(d.x,d.y,'#fff',28);O.msg={t:'found',h:d.h,s:d.s+' Bring this back to the Origin guide.'};O.mt=11;if(!reduce)wow=Math.max(wow,.5);AM.sfx('collectible');
 O.spawning=1;O.disappear=1.1;say(NX,'Ah - another piece finds its way to light. I wanted you to know I am here.')}
function pzClick(mx,my){if(!O.pz)return;const p=O.pz,h=O.hit||[],pw=Math.min(W_-40,560),ph=Math.min(H_-80,380),R=O.pzR={x:(W_-pw)/2,y:(H_-ph)/2,w:pw,h:ph};
 if(mx<R.x||mx>R.x+R.w||my<R.y||my>R.y+R.h){pzClose();return}
 const inside=(x,y,w,hh)=>mx>=x&&mx<=x+w&&my>=y&&my<=y+hh;
 if(p.t==='arrow'){h.forEach(b=>{if(inside(b.x,b.y,b.w,b.h)){p.a[b.i]=(p.a[b.i]+1)%4;AM.sfx('interaction');if(p.a.every(v=>v===1))pzSolved()}})}
 else if(p.t==='seal'){h.forEach(b=>{if(inside(b.x,b.y,b.w,b.h)){p.f[b.i]=(p.f[b.i]+1)%4;AM.sfx('interaction');if(p.f.every((v,i)=>v===i))pzSolved()}})}
 else if(p.t==='wire'){h.forEach(b=>{if(!inside(b.x,b.y,b.w,b.h))return;
   if(b.side===0){p.sel=p.sel===b.i?-1:b.i;AM.sfx('interaction');return}
   if(p.sel>=0&&!p.lock[p.sel]){
    if(p.map[p.sel]===b.i){p.lock[p.sel]=1;p.sel=-1;AM.sfx('correct');if(p.lock.every(v=>v===1))pzSolved()}
    else{p.bad=1;O.buzz=1;AM.sfx('incorrect');p.sel=-1}}})}
 else if(p.t==='light'){h.forEach(b=>{if(inside(b.x,b.y,b.w,b.h)){const g=p.g,i=b.i,c=i%3,r=(i/3)|0;
  const N=[[r,c],[r,c-1],[r,c+1],[r-1,c],[r+1,c]].filter(q=>q[0]>=0&&q[0]<3&&q[1]>=0&&q[1]<3);
  N.forEach(q=>{const k=q[0]*3+q[1];g[k]=g[k]?0:1});AM.sfx('interaction');if(g.every(v=>v))pzSolved()}})}
 else if(p.t==='balance'){h.forEach(b=>{if(inside(b.x,b.y,b.w,b.h)){p.side[b.i]^=1;AM.sfx('interaction');const W=[2,3,5,0],l=p.side.reduce((a,v,i)=>a+(v?W[i]:0),0),r=p.side.reduce((a,v,i)=>a+(v?0:W[i]),0);if(l===r&&l>0)pzSolved()}})}}
function pzDraw(){if(!O.pz)return;const p=O.pz,pw=Math.min(W_-40,560),ph=Math.min(H_-80,380),R=O.pzR={x:(W_-pw)/2,y:(H_-ph)/2,w:pw,h:ph},ACC='#4ee3f0';g2.save();
 rc(0,0,W_,H_,'rgba(2,2,8,.78)');rc(R.x,R.y,R.w,R.h,'#0a0c20');g2.strokeStyle=O.buzz>0?'#e25b4a':ACC;g2.lineWidth=2;g2.strokeRect(R.x,R.y,R.w,R.h);
 g2.fillStyle='#ece8df';g2.font=MONO(14);g2.textAlign='center';
 const TITLE={arrow:'ROUTE THE FLOW',seal:'RESTORE THE SIGIL',wire:'MATCH THE CIRCUIT',light:'LIGHT THE GRID',balance:'BALANCE THE LEDGER'};
 g2.fillText(TITLE[p.t],R.x+R.w/2,R.y+30);g2.fillStyle='#8a867c';g2.font=MONO(11);g2.fillText(coarse?'TAP TO PLAY  ·  TAP OUTSIDE TO CLOSE':'CLICK TO PLAY  ·  ESC / OUTSIDE TO CLOSE',R.x+R.w/2,R.y+R.h-14);
 const hit=[];g2.textAlign='center';
 if(p.t==='arrow'){for(let i=0;i<4;i++){const x=R.x+70+i*110,y=R.y+110;hit.push({i,x:x-40,y:y-40,w:80,h:80});g2.font="700 "+Math.round(34*U)+"px sans-serif";g2.fillStyle='#ece8df';g2.fillText(ARRC[p.a[i]],x,y+12);
  g2.strokeStyle='#2a2f66';g2.lineWidth=2;g2.strokeRect(x-40,y-40,80,80);if(p.a[i]===1){g2.strokeStyle='#5dd68a';g2.strokeRect(x-46,y-46,92,92)}}}
 if(p.t==='seal'){for(let i=0;i<4;i++){const x=R.x+80+i*130,y=R.y+110;hit.push({i,x:x-45,y:y-45,w:90,h:90});
  g2.save();g2.translate(x,y);g2.rotate(p.f[i]*Math.PI/2);g2.fillStyle='#1a1440';g2.fillRect(-40,-40,80,80);g2.strokeStyle=p.f[i]===i?'#5dd68a':'#4a4f8a';g2.lineWidth=3;g2.strokeRect(-40,-40,80,80);
  g2.fillStyle='#caa6ff';for(let k=0;k<3;k++)g2.fillRect(-40,-30+k*26,20,10);g2.restore()}}
 if(p.t==='wire'){for(let i=0;i<3;i++){const y=R.y+70+i*70,x0=R.x+60,x1=R.x+R.w-60;
  g2.strokeStyle=WCOL[i];g2.lineWidth=4;g2.beginPath();g2.moveTo(x0,y);g2.bezierCurveTo(x0+90,y,x1-90,y,x1,y);g2.stroke();
  hit.push({i,side:0,x:x0-16,y:y-16,w:32,h:32});g2.fillStyle=p.sel===i?'#fff':WCOL[i];g2.beginPath();g2.arc(x0,y,p.sel===i?11:8,0,7);g2.fill();
  hit.push({i,side:1,x:x1-16,y:y-16,w:32,h:32});g2.beginPath();g2.arc(x1,y,10,0,7);g2.fillStyle=(p.lock[0]&&p.lock[1]&&p.lock[2])?'#5dd68a':'#3a3f6a';g2.fill();g2.strokeStyle='#8a867c';g2.lineWidth=2;g2.beginPath();g2.arc(x1,y,14,0,7);g2.stroke()}}
 if(p.t==='light'){for(let i=0;i<9;i++){const c=i%3,r=(i/3)|0,x=R.x+90+c*100,y=R.y+70+r*100;hit.push({i,x:x-40,y:y-40,w:80,h:80});
  g2.fillStyle=p.g[i]?'#ffd35a':'#161a38';g2.fillRect(x-40,y-40,80,80);g2.strokeStyle=p.g[i]?'#ffd35a':'#2a2f66';g2.lineWidth=2;g2.strokeRect(x-40,y-40,80,80)}}
 if(p.t==='balance'){const W=[2,3,5,0];for(let i=0;i<4;i++){const x=R.x+90+i*100,y=R.y+190-((p.side[i]?0:70));hit.push({i,x:x-34,y:y-34,w:68,h:68});
  g2.fillStyle=W[i]?'#caa6ff':'#3a3f6a';g2.beginPath();g2.arc(x,y,26,0,7);g2.fill();g2.fillStyle='#0a0c20';g2.font=MONO(11);g2.fillText(W[i]||'?',x,y+4)}
  g2.strokeStyle='#8a867c';g2.lineWidth=2;g2.beginPath();g2.moveTo(R.x+50,R.y+150);g2.lineTo(R.x+R.w-50,R.y+150);g2.stroke()}
 O.hit=hit;g2.restore()}
// ======================= drawing =======================
function icon(k,x,y,s,c){g2.strokeStyle=c;g2.lineWidth=Math.max(2,s*.16);g2.beginPath();
 if(k==='eye'){g2.ellipse(x,y,s,s*.55,0,0,7);g2.stroke();ci(x,y,s*.28,c);return}
 g2.moveTo(x-s*.7,y-s*.8);g2.lineTo(x+s*.7,y-s*.8);g2.lineTo(x+s*.7,y+s*.1);g2.quadraticCurveTo(x+s*.7,y+s*.9,x,y+s*1.1);g2.quadraticCurveTo(x-s*.7,y+s*.9,x-s*.7,y+s*.1);g2.closePath();g2.stroke()}
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
function bubble(s,x,y,col,mw,al){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4,bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12,bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;
 g2.save();g2.globalAlpha=al==null?1:al;rc(bx,by,bw,bh,'#05060fe8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}
function drawProps(p,t){const skip=x=>(x>PIT[0]-50&&x<PIT[1]+50)||(x>CH[0]-50&&x<CH[1]+50);g2.textAlign='center';
 for(let i=0,x=110;x<LW;i++,x+=150+(i*53)%120){if(skip(x)||(x>800&&x<1000))continue;const sx=X(x);if(sx<-200||sx>W_+200)continue;const ht=100+((i*47)%150),arch=i%5===2;
  rr(x,ht,34,ht,'#231a12');rr(x-6,ht,46,12,'#2d2218');g2.globalAlpha=.5+.4*Math.sin(t*1.5+i);rr(x+7,ht-20,5,ht-40,p.se);g2.globalAlpha=1;
  if(arch){rr(x+130,190,30,190,'#231a12');rr(x-8,214,176,26,'#2d2218');rr(x,190,30,190,'#231a12')}
  if(i%2===0){g2.globalAlpha=.3+.3*Math.sin(t*2+i);tx_(['\u25B2','\u25C7','Z','\u25A3','\u232C'][i%5],sx+60*U,Y(120+(i*61)%200),p.se,MONO(18));g2.globalAlpha=1}}}
function drawGround(p,t){const soil='#1e150e',gr=mixc('#6b5a3a',p.ac,.2);
 [[-300,PIT[0]],[PIT[1],CH[0]],[CH[1],LW+400]].forEach(([a,b])=>{const l=Math.max(0,X(a)),r=Math.min(W_,X(b));if(r<=l)return;rc(l,GY,r-l,H_-GY,soil);rc(l,GY,r-l,6*U,gr)});
 rr(PIT[0],0,PIT[1]-PIT[0],700,'#08060a');rr(PIT[0],PF,PIT[1]-PIT[0],700,soil);rr(PIT[0],PF,PIT[1]-PIT[0],6,gr);                    // underground chamber
 for(let i=0;i<5;i++){rr(PIT[0]+20+i*55,-PF-40-((i*37)%60)+0,3,60,p.se)}for(const x of [PIT[0]+10,PIT[1]-10]){const sx=X(x),sy=Y(-60),g=g2.createRadialGradient(sx,sy,0,sx,sy,120*U);g.addColorStop(0,p.pr+'88');g.addColorStop(1,p.pr+'00');g2.fillStyle=g;g2.fillRect(sx-130*U,sy-130*U,260*U,260*U)}
 rr(CH[0],0,CH[1]-CH[0],900,'#030208');if(O.bridge){g2.globalAlpha=.7+.3*Math.sin(t*3);rr(CH[0],0,CH[1]-CH[0],12,'#1e150e');rr(CH[0],0,CH[1]-CH[0],4,p.pr);g2.globalAlpha=1}const sx=X(CH[0]),w=(CH[1]-CH[0])*U,g=g2.createLinearGradient(0,GY,0,H_);g.addColorStop(0,'#0000');g.addColorStop(1,p.pr+'66');g2.fillStyle=g;g2.fillRect(sx,GY,w,H_-GY)}
function drawPlats(p,t){const gr=mixc('#6b5a3a',p.ac,.2);SOL.forEach(([x,w,tp])=>{rr(x,tp,w,tp,'#1e150e');rr(x,tp,w,7,gr)});
 FLT.forEach(([x,w,tp],i)=>{rr(x,tp,w,22,'#2a2018');rr(x,tp,w,6,gr);g2.globalAlpha=.5+.3*Math.sin(t*2+i);for(let k=0;k<w/34;k++)rr(x+10+k*34,tp-4,8,4,p.se);g2.globalAlpha=1})}
function drawMonuments(p,t){const gold='#ffd35a';
 rr(800,205,190,205,'#17120e');g2.strokeStyle=p.se;g2.lineWidth=2;g2.strokeRect(X(800),Y(205),190*U,205*U);for(let r=0;r<8;r++){g2.globalAlpha=.4+.4*Math.sin(t*2+r);rr(815,190-r*22,50+((r*37)%100),6,p.ac);g2.globalAlpha=1}icon('eye',X(895),Y(228),14*U,p.ac);   // exposed ledger wall
 rr(1840,520,100,222,'#1a1612');g2.strokeStyle=gold;g2.lineWidth=2;g2.strokeRect(X(1840),Y(520),100*U,222*U);tx_('2016',X(1890),Y(470),gold,"700 "+Math.round(30*U)+"px 'Abril Fatface'");                       // birth stele
 const sx=X(PIT[0]+140);tx_('\u25BC',sx,Y(-20),p.se,MONO(16));
 rr(5190,330,24,120,'#231a12');rr(5360,330,24,120,'#231a12');icon('eye',X(5202),Y(350),13*U,'#e8f6ff');icon('shield',X(5372),Y(350),13*U,p.pr)}                                                        // choice shrine
function drawItem(d,i,t,p){const sx=X(d.x),sy=Y(d.y);if(sx<-140||sx>W_+140)return;const done=O.got[i]>0,act=i===O.next&&!done&&O.met&&O.carry<0,k=d.k,col=[p.ac,'#ffd35a',p.pr,p.se,p.pr][i],X0=d.x;
 g2.save();g2.globalAlpha=done?.45:act?1:.6;
 if(act){const g=g2.createRadialGradient(sx,sy,0,sx,sy,70*U);g.addColorStop(0,col+'55');g.addColorStop(1,col+'00');g2.fillStyle=g;g2.fillRect(sx-80*U,sy-80*U,160*U,160*U)}
 g2.strokeStyle=act?col:'#4a3f30';g2.lineWidth=2;
 if(k==='ledger'){rr(X0-28,d.y+40,56,76,'#2b241c');g2.strokeRect(X(X0-28),Y(d.y+40),56*U,76*U);for(let r=0;r<5;r++)rr(X0-20,d.y+30-r*12,40-(r%3)*9,3,act?col:'#5a4d3a')}                     // weathered ledger tablet
 else if(k==='2016'){rr(X0-28,d.y+36,56,70,'#2a2214');g2.strokeStyle='#ffd35a';g2.strokeRect(X(X0-28),Y(d.y+36),56*U,70*U);tx_('2016',sx,Y(d.y-4),'#ffd35a',MONO(13));rr(X0-20,d.y+10,40,2,'#ffd35a')} // birth stone set into the stele
 else if(k==='Z'){rr(X0-50,PF+16,100,16,'#1e150e');rr(X0-50,PF+16,100,3,'#6b5a3a');g2.strokeStyle=col;g2.lineWidth=3;g2.beginPath();g2.arc(sx,Y(PF+22),20*U,Math.PI,0);g2.stroke();tx_('Z',sx,Y(PF+34),col,MONO(16));   // relic half-buried in the chamber floor
  if(act)for(let r=0;r<4;r++){g2.globalAlpha=.2+.25*Math.sin(t*3+r);rr(X0-20+r*13,PF+120,3,90,col)}}
 else if(k==='21M'){rr(X0-38,d.y+54,76,120,'#1b1b28');g2.strokeRect(X(X0-38),Y(d.y+54),76*U,120*U);rr(X0-34,d.y+28,68,28,'#06070e');tx_('21,000,000',sx,Y(d.y+8),act?col:'#6a6a88',MONO(11));ring(sx,Y(d.y+80),22*U,.3,col,t)}   // elevated counter monument
 else{g2.lineWidth=3;g2.strokeStyle=col;g2.beginPath();g2.arc(sx,Y(190),80*U,Math.PI,0);g2.stroke();g2.globalAlpha=(done?.45:act?1:.6)*.12;g2.fillStyle=col;g2.fill();g2.globalAlpha=done?.45:act?1:.6;     // protective dome: choice + protection
  g2.fillStyle='#e8f6ff';g2.beginPath();g2.arc(sx,sy,14*U,Math.PI/2,Math.PI*1.5);g2.fill();g2.fillStyle=col;g2.beginPath();g2.arc(sx,sy,14*U,-Math.PI/2,Math.PI/2);g2.fill()}
 g2.restore()}
function drawEgg(p,t){if(O.egg)return;const sx=X(EGG.x),sy=Y(EGG.y);if(sx<-60||sx>W_+60)return;g2.globalAlpha=.3+.25*Math.sin(t*2);tx_('\u2736',sx,sy,'#ffd35a',MONO(15));g2.globalAlpha=1}
function drawNpc(p,t){const sx=X(NX);if(sx<-120||sx>W_+120||!NPC_IMG||!NPC_IMG.width)return;if(O.disappear>1.1)return;const h=PH*U*1.16,w=h*NPC_IMG.width/NPC_IMG.height,bob=Math.sin(t*2.2)*4*U,fl=O.px<NX?-1:1;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(0)+3,w*.4,5*U,0,0,7);g2.fill();const g=g2.createRadialGradient(sx,Y(60),0,sx,Y(60),h*1.1);g.addColorStop(0,NPC_PAL[0]+'66');g.addColorStop(1,NPC_PAL[0]+'00');g2.fillStyle=g;g2.fillRect(sx-h*1.2,Y(60)-h*1.2,h*2.4,h*2.4);
 if(O.disappear>0){const k=Math.min(1,O.disappear/1.1),slices=6+Math.floor(k*10);g2.save();g2.globalAlpha=1-k;g2.imageSmoothingEnabled=false;
  for(let i=0;i<slices;i++){const sy=-h+i*h/slices,hh=h/slices,jx=(Math.random()-.5)*60*U*k*(k<.7?1:2),sat=(Math.random()-.5)*30*U*k;;g2.save();g2.translate(sx+jx,Y(0)-bob+sy+hh/2+sat);g2.scale(fl*(1+k*.6*(i%2?1:-1))*(1-k*.4),1);g2.drawImage(NPC_IMG,0,i*NPC_IMG.height/slices,NPC_IMG.width,NPC_IMG.height/slices,-w/2,-hh/2,w,hh);g2.restore()}
  for(let i=0;i<12;i++){g2.globalAlpha=(1-k)*.6;ci(sx+(Math.random()-.5)*w*2,Y(0)-h+Math.random()*h,3*U,NPC_PAL[i%3]||'#9a6bff')}
  g2.restore();g2.globalAlpha=1;return}
 g2.save();g2.shadowColor=NPC_PAL[0];g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,Y(0)-bob);g2.scale(fl,1);g2.drawImage(NPC_IMG,-w/2,-h,w,h);g2.restore();
 tx_('zkSNARK',sx,Y(PH+34),NPC_PAL[0],MONO(12));if(O.near&&!O.dlg)tx_(coarse?'TAP \uD83D\uDCAC TO TALK':'[E] OR CLICK TO TALK',sx,Y(PH+54),'#fff',MONO(12))}
function drawGate(p,t){const sx=X(GX),open=O.gate;if(sx<-300||sx>W_+500)return;
 if(open>0){const g=g2.createRadialGradient(X(SX),Y(120),0,X(SX),Y(120),300*U);g.addColorStop(0,p.pr+'99');g.addColorStop(1,p.pr+'00');g2.fillStyle=g;g2.fillRect(X(SX)-320*U,Y(440),640*U,600*U)}
 rr(GX-150,420,50,420,'#1d150e');rr(GX+100,420,50,420,'#1d150e');rr(GX-160,440,320,50,'#241a12');rr(GX-100,360-0,200,360+0,'#0a0706');
 rr(GX-100,360+open*340,200,360,'#2a2018');g2.strokeStyle=p.pr;g2.lineWidth=2;g2.strokeRect(X(GX-100),Y(360+open*340),200*U,360*U);
 for(let i=0;i<5;i++){const x=X(GX-80+i*40),y=Y(380+open*340),on=O.got[i]===2;g2.shadowColor=p.pr;g2.shadowBlur=on?16:0;g2.fillStyle=on?p.pr:'#3a2c1f';g2.beginPath();g2.moveTo(x,y-12*U);g2.lineTo(x+10*U,y);g2.lineTo(x,y+12*U);g2.lineTo(x-10*U,y);g2.fill();g2.shadowBlur=0}
 if(!O.sh){const x=X(SX),y=Y(70+Math.sin(t*2.5)*8),s=24*U;g2.save();g2.shadowColor=p.pr;g2.shadowBlur=open>0?30:0;g2.globalAlpha=open>0?1:.15;g2.fillStyle=p.pr;g2.beginPath();g2.moveTo(x,y-s*1.3);g2.lineTo(x+s*.8,y);g2.lineTo(x,y+s*1.3);g2.lineTo(x-s*.8,y);g2.closePath();g2.fill();g2.restore()}}
// ---- VISUAL POLISH (render-only; every function below only draws, none reads or changes gameplay state) ----
const Zp=window.ZKP,oSeg=[[-300,PIT[0]],[PIT[1],CH[0]],[CH[1],LW+400]];
const oWorld=f=>{g2.save();g2.translate(-O.cx*U,GY);g2.scale(U,U);f();g2.restore()};   // draw in world units, y down from the ground line
function oBack(p,t){if(!Zp)return;const par=.55,sp=430,a=Math.floor((O.cx*par-200)/sp),b=Math.ceil((O.cx*par+W_/U+200)/sp);g2.save();
 for(let k=a;k<=b;k++){const wx=k*sp+Zp.hash(k*3.1)*120,sx=(wx-O.cx*par)*U,h=(150+Zp.hash(k*1.7)*130)*U,gap=(120+Zp.hash(k*5.3)*70)*U,pw=26*U,top=GY-h,top2=top+Zp.hash(k)*50*U;   // distant ruined arcades
  g2.globalAlpha=.85;g2.fillStyle='#120b07';g2.fillRect(sx,top,pw,h+4);g2.fillRect(sx+gap,top2,pw,GY-top2+4);g2.strokeStyle='#120b07';g2.lineWidth=14*U;g2.beginPath();g2.arc(sx+pw/2+gap/2,top+10*U,gap/2,Math.PI,Math.PI*(1.35+.5*Zp.hash(k*9)));g2.stroke();
  g2.globalAlpha=.4;g2.fillStyle=mixc('#5a3a1c',p.ac,.25);g2.fillRect(sx,top,2*U,h);g2.fillRect(sx+gap,top2,2*U,GY-top2)}
 g2.restore()}
function oProps(p,t){if(!Zp)return;const skip=x=>(x>PIT[0]-50&&x<PIT[1]+50)||(x>CH[0]-50&&x<CH[1]+50),rim=mixc('#8a7048',p.ac,.3);
 for(let i=0,x=110;x<LW;i++,x+=150+(i*53)%120){if(skip(x)||(x>800&&x<1000))continue;const sx=X(x);if(sx<-200||sx>W_+200)continue;const ht=100+((i*47)%150),T0=Y(ht);
  g2.globalAlpha=.55;g2.fillStyle=rim;g2.fillRect(sx,T0,2.5*U,ht*U);g2.fillStyle='#0b0704';g2.fillRect(sx+30*U,T0,4*U,ht*U);                       // lit / shaded edges
  g2.globalAlpha=.2;g2.fillStyle='#000';g2.fillRect(sx+11*U,T0+14*U,1.5*U,(ht-28)*U);g2.fillRect(sx+22*U,T0+14*U,1.5*U,(ht-28)*U);              // fluting
  Zp.rows(g2,sx,T0,34*U,ht*U,'#0d0805',.45,38*U,40*U);                                                                                               // drum seams
  g2.globalAlpha=.6;g2.fillStyle=rim;g2.fillRect(X(x-6),T0,46*U,1.8*U);g2.globalAlpha=.4;g2.fillStyle='#000';g2.fillRect(X(x-6),Y(ht-12),46*U,3*U);g2.globalAlpha=1; // cap light + shadow
  if(i%3===0){g2.strokeStyle='#0b0704';g2.lineWidth=1.5*U;g2.globalAlpha=.7;g2.beginPath();g2.moveTo(sx+14*U,T0+4*U);g2.lineTo(sx+19*U,T0+20*U);g2.lineTo(sx+13*U,T0+34*U);g2.lineTo(sx+18*U,T0+52*U);g2.stroke();g2.globalAlpha=1}   // crack
  rr(x-14,7,16,7,'#1a120b');rr(x+34,5,12,5,'#1a120b');rr(x-4,3,9,3,'#2b2015')}}                                                                 // rubble at the base
function oGround(p,t){if(!Zp)return;const gr=mixc('#6b5a3a',p.ac,.2),x0=O.cx-60,x1=O.cx+W_/U+60;
 oWorld(()=>{oSeg.forEach(([a,b])=>{const l=Math.max(a,x0),r=Math.min(b,x1);if(r<=l)return;
   [[24,.5],[58,.42],[104,.36]].forEach(([d,al])=>{g2.globalAlpha=al;g2.fillStyle='#140d08';g2.fillRect(l,d,r-l,1.8);g2.globalAlpha=al*.3;g2.fillStyle='#8a6b3f';g2.fillRect(l,d+1.8,r-l,1)});   // soil strata
   Zp.grit(g2,l,r,10,(H_-GY)/U,26,'#33231a',.7,3,3,.34);Zp.grit(g2,l,r,10,(H_-GY)/U,31,'#4a3623',.5,9,2,.25);                                                      // stones and grit in the soil
   g2.globalAlpha=.6;g2.fillStyle=mixc(gr,'#fff',.25);g2.fillRect(l,0,r-l,1.4);g2.globalAlpha=.5;g2.fillStyle='#0e0905';g2.fillRect(l,6,r-l,2.2);                 // lit lip + shadow under it
   g2.strokeStyle=gr;g2.lineWidth=1.4;g2.globalAlpha=.8;g2.beginPath();for(let wx=Math.ceil(l/17)*17;wx<r;wx+=17){const h=4+Zp.hash(wx*.31)*8,sw=Math.sin(t*1.4+wx*.09)*2.2;g2.moveTo(wx,0);g2.quadraticCurveTo(wx+sw*.4,-h*.6,wx+sw,-h)}g2.stroke();g2.globalAlpha=1});  // dry grass
   Zp.rows(g2,PIT[0],0,PIT[1]-PIT[0],-PF,'#1b130c',.55,30,56)})}                                                                                                 // masonry on the chamber wall
function oPlats(p,t){if(!Zp)return;const vx0=O.cx-80,vx1=O.cx+W_/U+80;
 oWorld(()=>{SOL.forEach(([x,w,tp])=>{if(x+w<vx0||x>vx1)return;Zp.rows(g2,x,-tp+8,w,tp-8,'#0d0805',.55,26,36);Zp.edge(g2,x,-tp,w,tp,'#9a7a4a','#000',.28,1.5)});
  FLT.forEach(([x,w,tp],i)=>{if(x+w<vx0||x>vx1)return;g2.globalAlpha=.3;g2.fillStyle='#000';g2.fillRect(x+2,-tp+22,w-4,9);g2.globalAlpha=1;g2.fillStyle='#2a2018';for(let k=0;k<w/16;k++)g2.fillRect(x+4+k*16,-tp+22,7,2+Zp.hash(x+k)*7);   // underside shadow + crumbled teeth
   Zp.edge(g2,x,-tp,w,22,'#9a7a4a','#000',.28,1.5)})})}
function oMon(p,t){if(!Zp)return;oWorld(()=>{
 Zp.rows(g2,800,-205,190,205,'#0a0705',.6,26,48);g2.strokeStyle=p.se;g2.lineWidth=1.6;g2.globalAlpha=.55;g2.beginPath();for(const [cx,cy,sx,sy] of [[806,-199,1,1],[984,-199,-1,1],[806,-9,1,-1],[984,-9,-1,-1]]){g2.moveTo(cx,cy+sy*14);g2.lineTo(cx,cy);g2.lineTo(cx+sx*14,cy)}g2.stroke();g2.globalAlpha=1;   // ledger wall: coursing + corner brackets
 g2.strokeStyle='#ffd35a';g2.globalAlpha=.35;g2.lineWidth=1.2;g2.strokeRect(1848,-512,84,206);g2.fillStyle='#ffd35a';g2.globalAlpha=.3;for(let y=-496;y<-310;y+=18){g2.fillRect(1844,y,4,1.5);g2.fillRect(1932,y,4,1.5)}g2.globalAlpha=.55;[[1844,-516],[1932,-516],[1844,-310],[1932,-310]].forEach(([x,y])=>g2.fillRect(x-1,y-1,5,5));g2.globalAlpha=1;   // birth stele: inset border, ticks, studs
 Zp.rows(g2,5190,-330,24,120,'#0b0705',.55,20,24);Zp.rows(g2,5360,-330,24,120,'#0b0705',.55,20,24)})}                                                          // shrine pillars
function oGate(p,t){if(!Zp)return;const sx=X(GX);if(sx<-300||sx>W_+500)return;oWorld(()=>{Zp.rows(g2,GX-150,-420,50,420,'#0b0705',.6,28,25);Zp.rows(g2,GX+100,-420,50,420,'#0b0705',.6,28,25);Zp.rows(g2,GX-160,-440,320,50,'#0b0705',.6,16,40);
  g2.fillStyle=p.pr;for(let k=0;k<7;k++){g2.globalAlpha=.35+.3*Math.sin(t*2+k);g2.fillRect(GX-140+k*46,-432,4,4)}g2.globalAlpha=1})}                                  // lintel rivets
function oFront(p){if(!Zp)return;Zp.motes(g2,0,0,W_,GY,T,28,'#ffd29a',{alpha:.3,size:Math.max(1.5,2*U),speed:9,seed:3})}                                                  // warm drifting dust
function scene(w,h,gy,t,p){oBack(p,t);drawProps(p,t);oProps(p,t);drawGround(p,t);oGround(p,t);drawPlats(p,t);oPlats(p,t);drawMonuments(p,t);oMon(p,t);drawGate(p,t);oGate(p,t);D.forEach((d,i)=>drawItem(d,i,t,p));drawEgg(p,t);drawNpc(p,t);
 O.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*2);rr(q.x,q.y,q.s,q.s,q.c)});g2.globalAlpha=1;O.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),p.pr,230*U,Math.min(1,f.l)))}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(O.px),sy=Y(O.py),idle=O.gr&&Math.abs(O.vx)<20?Math.sin(T*3)*.012:0,wS=1+.22*O.sq-idle,hS=1-.22*O.sq+idle,sup=support();
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(sup)+3,aw*.38*(1-Math.min(.5,(O.py-sup)/300)),5*U,0,0,7);g2.fill();
 const g=g2.createRadialGradient(sx,sy-ph/2,0,sx,sy-ph/2,ph*1.2);g.addColorStop(0,p.pr+'55');g.addColorStop(1,p.pr+'00');g2.fillStyle=g;g2.fillRect(sx-ph*1.3,sy-ph*1.7,ph*2.6,ph*2.4);
 g2.save();g2.shadowColor=p.pr;g2.shadowBlur=22;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(O.face<0?-wS:wS,hS);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 if(O.carry>=0){const a=T*2.2,cx=sx+Math.cos(a)*ph*.6,cy=sy-ph*1.05+Math.sin(a*1.3)*6*U,col=['#ffd35a',p.pr,p.se][O.carry%3],s=11*U;const g=g2.createRadialGradient(cx,cy,0,cx,cy,s*3);g.addColorStop(0,col+'88');g.addColorStop(1,col+'00');g2.fillStyle=g;g2.fillRect(cx-s*3,cy-s*3,s*6,s*6);g2.save();g2.shadowColor=col;g2.shadowBlur=14;g2.fillStyle=col;g2.beginPath();g2.moveTo(cx,cy-s);g2.lineTo(cx+s*.8,cy);g2.lineTo(cx,cy+s);g2.lineTo(cx-s*.8,cy);g2.fill();g2.restore()}}
function drawFront(p){rr(866,185,38,190,'#0e0a07');rr(926,185,36,190,'#0e0a07');rr(4930,250,70,230,'#0e0a07');g2.globalAlpha=.25;rr(4930,250,200,230,'#0e0a07');g2.globalAlpha=1;oFront(p)}   // foreground ruins: they hide what is behind them
function drawHud(p){g2.textAlign='center';const s='ORIGIN DISCOVERIES: '+O.n+'/5',fs=Math.round(Math.max(13,14*U));g2.font=MONO(14);const wd=g2.measureText(s).width+36,bx=W_/2-wd/2,by=8;
 rc(bx,by,wd,fs*2.3,'#05060fcc');g2.strokeStyle=O.hf>0?'#fff':p.pr;g2.lineWidth=O.hf>0?3:1.5;g2.strokeRect(bx,by,wd,fs*2.3);g2.fillStyle='#ece8df';g2.fillText(s,W_/2,by+fs*1.05);
 for(let i=0;i<5;i++){g2.fillStyle=O.got[i]===2?p.pr:O.got[i]===1?'#ffd35a':'#3a3d55';const x=W_/2-40+i*20,y=by+fs*1.75;g2.beginPath();g2.moveTo(x,y-6);g2.lineTo(x+5,y);g2.lineTo(x,y+6);g2.lineTo(x-5,y);g2.fill()}
 if(O.carry>=0){const c='CARRYING  \u25C8 '+D[O.carry].h;g2.font=MONO(12);const cw=g2.measureText(c).width+28,cy=by+fs*2.3+6;rc(W_/2-cw/2,cy,cw,fs*1.6,'#05060fcc');g2.strokeStyle='#ffd35a';g2.lineWidth=1.5;g2.strokeRect(W_/2-cw/2,cy,cw,fs*1.6);g2.fillStyle='#ffd35a';g2.fillText(c,W_/2,cy+fs*1.1)}
 if(O.dlg){const d=O.dlg,mw=Math.min(W_-24,640),bx2=(W_-mw)/2,bh=Math.round(Math.max(120,H_*.2)),by2=H_-bh-(coarse?90:24);rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle='#4ee3f0';g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);
  if(NPC.complete&&NPC.width){g2.imageSmoothingEnabled=false;g2.drawImage(NPC,bx2+10,by2+10,64,64)}
  g2.textAlign='left';g2.fillStyle=NPC_PAL[0];g2.font=MONO(13);g2.fillText('zkSNARK',bx2+84,by2+28);g2.fillStyle='#ece8df';g2.font=MONO(15);wrap(d.L[d.i].slice(0,Math.floor(d.c)),mw-100).forEach((l,i)=>g2.fillText(l,bx2+84,by2+54+i*22));
  g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?'TAP TO CONTINUE':'[E] / CLICK',bx2+mw-12,by2+bh-10)}
 else if(O.msg&&O.mt>0){const m=O.msg,mw=Math.min(W_-24,600),bx2=(W_-mw)/2;g2.font=MONO(14);const ln=wrap(m.s,mw-32),bh=62*Math.max(.9,U)+ln.length*22+10,by2=H_-bh-(coarse?90:20);g2.save();g2.globalAlpha=Math.min(1,O.mt*2);rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=m.t==='egg'?'#ffd35a':p.pr;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);
  g2.textAlign='left';g2.fillStyle=m.t==='egg'?'#ffd35a':p.pr;g2.font=MONO(12);g2.fillText(m.t==='found'?'DISCOVERY FOUND':m.t==='ret'?'ORIGIN DISCOVERY RETURNED':'OPTIONAL SECRET',bx2+16,by2+22);g2.fillStyle='#fff';g2.font="700 "+Math.round(Math.max(20,26*U))+"px 'Abril Fatface',serif";g2.fillText(m.h,bx2+16,by2+52*Math.max(.9,U));
  g2.fillStyle='#ece8df';g2.font=MONO(14);ln.forEach((l,i)=>g2.fillText(l,bx2+16,by2+78*Math.max(.9,U)+i*22));g2.restore()}
 if(O.st==='play'&&!O.dlg&&!O.pz&&O.cx<200&&O.n===0&&!O.met){tx_(coarse?'\u25C0 \u25B6 WALK  \u2934 JUMP':'\u2190 \u2192 WALK   SPACE JUMP',X(140),Y(190),'#e8f6ff',MONO(12))}
 if(!O.pz&&O.nd>=0&&!O.solved[O.nd]&&O.met&&O.carry<0&&!O.dlg&&O.st==='play')tx_(coarse?'\u25C9 INSPECT':'[E] INSPECT',X(D[O.nd].x),Y(D[O.nd].y+130),'#e8f6ff',MONO(13))}

// ======================= wiring into the shared engine =======================
DEC.origin=function(w,h,gy,t,p){if(!isO()){OLD(w,h,gy,t,p);return}scene(w,h,gy,t,p)};
const _bgo=bg;bg=function(w,h,gy,p){if(isO()){frame(w,h,gy);cam=O.cx*U}_bgo(w,h,gy,p)};
const _avo=avatar;avatar=function(w,h,gy,p){if(isO()){drawPlayer(p);drawFinNpc(p,T);drawFront(p);drawHud(p);pzDraw();if(O.st==='dying'){const a=Math.min(1,O.dt/.7);rc(0,0,W_,H_,'rgba(0,0,0,'+a+')');if(a>.5){g2.fillStyle='#ece8df';g2.textAlign='center';g2.font=MONO(16);g2.fillText('RETURNING TO HUB...',W_/2,H_/2)}}}else _avo(w,h,gy,p)};
const _sto=startWorld;startWorld=function(i){const me=W[i].id==='origin';if(me)oInit();_sto(i);if(me)$z('wf').innerHTML=''};
const _spo=stopWorld;stopWorld=function(){if(O)O.on=0;ctl(0);_spo()};
});

/* ZKSCAPE world 10: THE ARCHIVE - the final boss level.
   Same movement model as Origin (A/D or arrows, Space/W/Up jump, E/Enter/F interact, touch buttons, own physics, own camera,
   bg/avatar/startWorld/stopWorld wrappers). Only this file changed; the engine, hub and every other world are untouched.

   Run of the level:  Hall of Seals (a victory lap past the nine seals you earned)  ->  zkSNARK welcomes you  ->  the gate opens
                      ->  Core Chamber (the boss)  ->  [E] at the altar wakes the Core  ->  the engine's final knowledge gate (15 questions).

   This file also owns the Archive question bank (BANK is replaced here) and the 15-question selection (pickSet is replaced here). */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
const NQ=15;   // questions in the final trial
W.push({id:'archive',n:'ARCHIVE',title:'THE ARCHIVE',sub:'The final trial',
 desc:'The last world. Walk the Hall of Seals, meet the zkSNARK once more, then face the Archive Core: '+NQ+' questions about everything you learned here.',
 q:'Everything you learned in here, tested.',quiz:true});
A.archive='Archive Seal';
TH.archive={sky:['#05030c','#1c0a22'],moon:[.5,.2,.11,'#ff4d6d','eclipse'],mt:'#09050f',fog:'#a06bff',amb:'spark'};
GIANT.archive=function(w,h,gy,t,th,p,c,id,o,f){g2.strokeStyle=f;g2.globalAlpha=.55;g2.lineWidth=6;g2.beginPath();g2.arc(w*.5+o,gy,h*.7,Math.PI,0);g2.stroke();
 g2.save();g2.setLineDash([2,16]);g2.lineDashOffset=-t*9;g2.lineWidth=3;g2.globalAlpha=.4;g2.beginPath();g2.arc(w*.5+o,gy,h*.62,Math.PI,0);g2.stroke();g2.restore();g2.globalAlpha=1};
LM.archive=function(x,y,s,c,t,a,B){B();hg.arc(0,0,s*1.1,0,7);hg.stroke();B();hg.arc(0,0,s*.5,0,7);hg.stroke();hg.fillRect(-2,-s*1.1,4,s*2.2);};

// ======================= the zkSNARK =======================
const NPC=new Image();let NPC_PAL=['#cfd8ff','#9db8ff','#ffffff'];
NPC.onload=()=>{try{NPC_PAL=extract(NPC)[0]}catch(e){}};NPC.src='NPCs/zkSNARK_clean.png';
const LINES_FIRST=[
 'There you are. I wondered if anyone would make it this far.',
 'We met at the very start, in the ruins of the Origin. You did not know what a shielded transaction was. Look at you now.',
 'Nine worlds. Nine seals. You walked through every lesson I could build, and you kept them. Well done. Truly.',
 'One thing is left. The Archive Core waits beyond that gate. It will ask you '+NQ+' questions, and only about what you learned inside ZKSCAPE.',
 'A wrong answer is not the end. You can try again, but only first tries earn full points, and hints cost you.',
 'If you forget everything else, remember this: transparent shows everything, shielded hides the details, and either way the network checks the rules.',
 'Go on. The gate is opening. You got this, my friend.'];
const LINES_BACK=['Back again. The Core remembers you.','Take your moment. When you are ready, it is waiting beyond the gate.'];
const LINES_DONE=['You have already passed the Core. The Archive Seal is yours.','Walk up to it again if you want to see your Explorer Card.'];
const LINES_AGAIN=['The Core is waiting beyond the gate. You are ready.'];

// ======================= level layout (1 unit = U px; y = height above the floor) =======================
const LW=5900,HW=30,HH=100,PH=112,SPD=330,JMP=830,GRAV=2500;
const PYX=i=>560+i*250;                       // the nine seal pylons: 560 ... 2560
const NX=3300,GATEX=3720,CX=4960,TALK=190;    // zkSNARK, the sealed gate, the Core's altar
const FLT=[[880,150,90],[1190,150,170],[1500,200,250],[1850,150,170],[2160,150,90],            // an optional arc over the Hall (one-way platforms)
 [4420,140,90],[4600,120,170],[5320,120,170],[5480,140,90]];                                   // ledges in the Core Chamber
const SEC={x:1600,y:300,s:'\u201CPrivacy is normal.\u201D \u2014 scratched under the top ledge, in a hand you almost recognise.'};
const RED='#ff4d6d',GOLD='#ffd35a',GREEN='#5dd68a';

const K={l:0,r:0,j:0,jp:0,e:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
let O=null,U=1,W_=0,H_=0,GY=0;
const isA=()=>run&&cur&&cur.id==='archive'&&O&&O.on;
const quizOpen=()=>$z('zp').classList.contains('on');
const X=x=>(x-O.cx)*U,Y=y=>GY-y*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c);
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const GS={};const gspr=col=>GS[col]||(GS[col]=(()=>{const k=document.createElement('canvas');k.width=k.height=96;const c=k.getContext('2d'),g=c.createRadialGradient(48,48,0,48,48,48);g.addColorStop(0,col);g.addColorStop(1,col+'00');c.fillStyle=g;c.fillRect(0,0,96,96);return k})());
const glow=(x,y,rx,ry,col,a)=>{g2.globalAlpha=Math.max(0,Math.min(1,a));g2.drawImage(gspr(col),x-rx,y-ry,rx*2,ry*2);g2.globalAlpha=1};

function aInit(){O={on:1,px:150,py:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,cx:0,sq:0,vp:[],last:performance.now(),ltx:0,st:'play',
 dlg:null,msg:null,mt:0,seen:Array(9).fill(0),fl:Array(9).fill(0),egg:0,nOn:0,nT:0,nTalked:0,nDone:0,nearN:0,nearC:0,g:0,tr:0,entered:0,er:0,chamber:0,ctl:-1};
 K.l=K.r=K.j=K.jp=K.e=0;ctl(1);O.msg={k:'THE FINAL WORLD',h:'THE HALL OF SEALS',s:'Nine worlds. Nine seals. Walk the hall.'};O.mt=6}

// ======================= input (same keys and touch buttons as Origin) =======================
if(!window.__zkAOK){window.__zkAOK=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{if(!isA()||quizOpen())return;const k=km(e.code);if(!k)return;e.preventDefault();if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0})}
addEventListener('pointerdown',e=>{if(!isA()||e.target!==g2.canvas||quizOpen())return;
 if(O.dlg){advance();return}const r=g2.canvas.getBoundingClientRect();
 if(O.nearN&&Math.abs(e.clientX-(X(NX)+r.left))<110*U)talk();else if(O.nearC&&Math.abs(e.clientX-(X(CX)+r.left))<170*U)startTrial();else if(O.mt>0)O.mt=0});
function ctl(on){let c=$z('actl');if(c&&c.dataset.own!=='archive'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='actl';c.dataset.own='archive';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('\uD83D\uDCAC','e','talk'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
const spark=(x,y,c,n=10)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*220;O.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.8,c,s:5,g:300})}};
const dust=n=>{for(let i=0;i<n;i++)O.vp.push({x:O.px+(Math.random()-.5)*40,y:O.py,vx:(Math.random()-.5)*140,vy:30+Math.random()*90,l:.45,c:'#cfd6e4',s:5,g:0})};

// ======================= physics (the model every other world uses) =======================
function updatePlayer(dt){const live=O.st==='play'&&!O.dlg&&!quizOpen(),dir=live?K.r-K.l:0,tv=dir*SPD;
 O.vx+=Math.sign(tv-O.vx)*Math.min(Math.abs(tv-O.vx),(O.gr?2800:1900)*dt);if(dir)O.face=dir;
 O.coy=O.gr?.1:O.coy-dt;O.buf-=dt;if(K.jp){O.buf=.12;K.jp=0}
 if(live&&O.buf>0&&O.coy>0){O.vy=JMP;O.gr=0;O.coy=0;O.buf=0;O.sq=-1;dust(8);AM.sfx('interaction')}
 if(live&&!K.j&&O.vy>0)O.vy-=GRAV*1.2*dt;
 O.px+=O.vx*dt;wallsX();const y0=O.py;O.vy-=GRAV*dt;O.py+=O.vy*dt;landY(y0);
 if(O.gr&&Math.abs(O.vx)>60&&(O.step=(O.step||0)-dt)<=0){O.step=.26;AM.sfx('step');if(Math.random()<.6)dust(1)}}
function wallsX(){const lim=O.g>=1?LW-320:GATEX-90;O.px=Math.max(HW,Math.min(lim,O.px))}   // the gate is a wall until the zkSNARK has spoken
function landY(y0){let on=0;if(O.py<=0){O.py=0;on=1}
 for(const [x,w,t] of FLT)if(O.vy<=0&&y0>=t-2&&O.py<=t&&O.px+HW>x&&O.px-HW<x+w){O.py=t;on=1}
 if(on){if(O.vy<-420){O.sq=1;dust(10);AM.sfx('step')}O.vy=0}O.gr=on}
const support=()=>{let s=0;for(const [x,w,t] of FLT)if(O.px+HW>x&&O.px-HW<x+w&&t<=O.py+2&&t>s)s=t;return s};
function updateCamera(dt){const vw=W_/U,tg=O.px-vw*.42+O.face*60;O.cx+=(tg-O.cx)*(1-Math.exp(-5*dt));O.cx=Math.max(0,Math.min(LW-vw,O.cx))}

// ======================= story logic =======================
function talk(){if(O.dlg||O.st!=='play')return;let L;
 if(!O.nDone)L=S.done.archive?LINES_DONE:S.arcMet?LINES_BACK:LINES_FIRST;else L=LINES_AGAIN;
 O.dlg={L,i:0,c:0};AM.sfx('interaction')}
function advance(){const d=O.dlg;if(!d)return;if(d.c<d.L[d.i].length){d.c=999;return}AM.sfx('interaction');
 if(++d.i>=d.L.length){O.dlg=null;if(!O.nDone){O.nDone=1;S.arcMet=1;save();AM.sfx('core-activate');if(!reduce)wow=Math.max(wow,1.1);
  O.msg={k:'THE ARCHIVE',h:'THE GATE OPENS',s:'The Core Chamber lies beyond. Walk to the altar and press '+(coarse?'the talk button':'[E]')+'.'};O.mt=7}}
 else d.c=0}
function npcUpdate(dt){const d=Math.abs(O.px-NX);
 if(!O.nOn&&d<820){O.nOn=1;O.nT=0}
 if(O.nOn&&O.nT<1)O.nT=Math.min(1,O.nT+dt/1.6);
 O.nearN=O.nT>=1&&d<TALK&&!O.dlg?1:0;
 if(O.nOn&&O.nT>=1&&!O.nTalked&&d<260&&O.st==='play'&&!O.dlg){O.nTalked=1;talk()}}   // he speaks on his own the first time, so he cannot be walked past
function sealsUpdate(dt){for(let i=0;i<9;i++){O.fl[i]=Math.max(0,O.fl[i]-dt);
  if(!O.seen[i]&&Math.abs(O.px-PYX(i))<130&&O.st==='play'){O.seen[i]=1;const w=W[i],d=!!S.done[w.id];
   if(d){O.fl[i]=1.2;spark(PYX(i),210,'#fff',18);AM.sfx('collectible');O.msg={k:'SEAL '+(i+1)+' OF 9  \u00B7  '+String(A[w.id]||'').toUpperCase(),h:w.title,s:w.q||''};O.mt=5.2}
   else{O.msg={k:'SEAL '+(i+1)+' OF 9',h:w.title,s:'This seal is dark. Finish this world first.'};O.mt=4}}}
 if(!O.egg&&O.st==='play'&&Math.hypot(O.px-SEC.x,O.py+HH*.5-SEC.y)<62){O.egg=1;spark(SEC.x,SEC.y,GOLD,26);O.msg={k:'SECRET FOUND',h:'A QUIET NOTE',s:SEC.s,t:'egg'};O.mt=7;AM.sfx('correct')}
 if(!O.chamber&&O.px>GATEX+160){O.chamber=1;O.msg={k:'THE CORE CHAMBER',h:S.done.archive?'THE CORE IS CALM':'THE CORE IS WATCHING',s:S.done.archive?'You already passed it. The altar still answers.':'Walk to the altar at the far end and press '+(coarse?'the talk button':'[E]')+' to wake it.'};O.mt=6}
 O.mt-=dt}
function startTrial(){if(O.st!=='play'||O.g<1)return;O.st='trial';O.fin0=!S.done.archive;O.tr=0;O.entered=0;O.er=0;AM.sfx('core-activate');if(!reduce)wow=Math.max(wow,1.5)}
function trialUpdate(dt){if(O.st!=='trial')return;O.tr+=dt;
 if(!reduce&&Math.floor(O.tr*1.4)!==Math.floor((O.tr-dt)*1.4))wow=Math.max(wow,.8);
 if(O.tr>3.1&&!O.entered){O.entered=1;O.er=0;enter(curI)}                              // opens the engine's knowledge gate (the 15 questions)
 if(O.entered&&!quizOpen()){O.er+=dt;if(O.er>1.2){O.st='play';O.entered=0;O.tr=0;O.er=0}}else O.er=0}
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-O.last)/1000||.016);O.last=now;
 if(tx!==O.ltx&&tx>w*.99){back();return}
 hs=[];                                                                                // no default walk-to-star hotspot: this world runs its own loop
 if(quizOpen())K.l=K.r=K.j=0;
 updatePlayer(dt);npcUpdate(dt);sealsUpdate(dt);trialUpdate(dt);updateCamera(dt);
 if(O.nDone&&O.g<1)O.g=Math.min(1,O.g+dt/2.4);
 O.nearC=O.g>=1&&Math.abs(O.px-CX)<150&&O.st==='play'?1:0;
 if(O.dlg&&O.dlg.c<O.dlg.L[O.dlg.i].length)O.dlg.c+=dt*46;
 if(K.e){K.e=0;if(O.dlg)advance();else if(O.st==='play'&&!quizOpen()){if(O.nearN)talk();else if(O.nearC)startTrial()}}
 O.sq+=(0-O.sq)*Math.min(1,dt*12);
 O.vp=O.vp.filter(q=>(q.l-=dt)>0);O.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});
 const want=!quizOpen()&&coarse?1:0;if(O.ctl!==want){O.ctl=want;const c=$z('actl');if(c)c.style.display=want?'flex':'none'}
 ax=X(O.px);tx=O.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}

// ======================= drawing: the boss level =======================
function arches(w,h,gy,t,p){const tile=520*U,off=-((O.cx*U*.22)%tile),top=gy-h*.78;g2.save();
 for(let k=-1;k*tile<w+tile;k++){const x0=off+k*tile;
  g2.globalAlpha=.9;g2.fillStyle='#0a0614';g2.fillRect(x0-30*U,top+h*.2,60*U,gy-top-h*.2);
  g2.globalAlpha=.3;g2.fillStyle=p.pr;g2.fillRect(x0-30*U,top+h*.2,2*U,gy-top-h*.2);
  g2.globalAlpha=.22;g2.strokeStyle=p.pr;g2.lineWidth=2*U;g2.beginPath();g2.ellipse(x0+tile/2,top+h*.2,tile/2,h*.16,0,Math.PI,0);g2.stroke();
  g2.globalAlpha=.1+.1*Math.abs(Math.sin(t*.7+k));g2.fillStyle=p.se;g2.fillRect(x0+tile/2-6*U,top+h*.12,12*U,h*.2)}
 g2.restore()}
function lightning(w,h,gy,t,p){const ph=Math.floor(t*.5),f=(t*.5)%1;if(f>=.16||hash(ph)<.5)return;const a=1-f/.16;
 let x=w*(.12+.76*hash(ph*3.3)),y=0;g2.save();g2.globalAlpha=.05*a;g2.fillStyle='#fff';g2.fillRect(-60,-60,w+120,h+120);
 g2.globalAlpha=a;g2.strokeStyle='#efe6ff';g2.shadowColor=p.pr;g2.shadowBlur=18;g2.lineWidth=2.2*U;g2.beginPath();g2.moveTo(x,y);
 for(let k=1;k<=9;k++){x+=(hash(ph*7+k)-.5)*90*U;y=gy*.9*k/9;g2.lineTo(x,y)}g2.stroke();g2.restore()}
function floorFx(w,h,gy,t,p){g2.save();g2.strokeStyle=p.pr;g2.globalAlpha=.09;g2.lineWidth=1;g2.beginPath();
 for(let x=Math.floor(O.cx/170)*170;X(x)<w+200;x+=170){const sx=X(x);g2.moveTo(sx,gy);g2.lineTo(sx+(sx-w/2)*.7,h)}g2.stroke();
 g2.globalAlpha=.35;g2.fillStyle=p.pr;g2.fillRect(0,gy+14*U,w,2*U);g2.restore();
 for(let k=0;k<7;k++){const px=(t*230+k*900)%LW,sx=X(px);if(sx<-60||sx>w+60)continue;glow(sx,gy+15*U,46*U,9*U,p.pr,.75)}   // light running along the floor toward the Core
 const cs=X(CX);if(cs>-600&&cs<w+600){g2.save();g2.strokeStyle=S.done.archive?GREEN:RED;g2.lineWidth=1.5*U;g2.globalAlpha=.16+.12*Math.sin(t*2);g2.beginPath();
  for(let k=-7;k<=7;k++){g2.moveTo(cs+k*40*U,gy+5*U);g2.lineTo(cs+k*150*U,h)}g2.stroke();g2.restore()}}
function pylons(w,h,gy,t,p){const cols=[p.pr,p.se,p.ac];
 for(let i=0;i<9;i++){const x=PYX(i),sx=X(x);if(sx<-140||sx>w+140)continue;const d=!!S.done[W[i].id],c=cols[i%3],fl=O.fl[i];
  if(d)glow(sx,Y(210),130*U,240*U,c,.2+.1*Math.sin(t*2+i)+fl*.4);
  rr(x-46,26,92,26,'#0d0a18');rr(x-36,52,72,16,'#120f22');
  g2.beginPath();g2.moveTo(X(x-28),Y(68));g2.lineTo(X(x-20),Y(300));g2.lineTo(sx,Y(352));g2.lineTo(X(x+20),Y(300));g2.lineTo(X(x+28),Y(68));g2.closePath();
  g2.fillStyle='#0b0f22';g2.fill();g2.strokeStyle=d?c:'#2a3050';g2.lineWidth=2*U;g2.globalAlpha=d?.95:.7;g2.stroke();g2.globalAlpha=1;
  const dy=Y(190),s=15*U;g2.save();g2.translate(sx,dy);g2.rotate(.785);g2.fillStyle=d?c:'#1a2038';if(d){g2.shadowColor=c;g2.shadowBlur=16}g2.fillRect(-s*.7,-s*.7,s*1.4,s*1.4);g2.restore();
  if(d){g2.globalAlpha=.1+.06*Math.sin(t*2+i);g2.fillStyle=c;g2.fillRect(sx-2*U,0,4*U,Y(352));g2.globalAlpha=1}
  if(fl>0){g2.strokeStyle=c;g2.globalAlpha=fl/1.2;g2.lineWidth=3*U;g2.beginPath();g2.arc(sx,dy,(1.2-fl)*150*U,0,7);g2.stroke();g2.globalAlpha=1}
  g2.globalAlpha=.85;tx_(W[i].n,sx,Y(378),d?'#ece8df':'#4a4f6c',MONO(11));g2.globalAlpha=1}}
function platforms(w,h,gy,t,p){for(const [x,pw,top] of FLT){const sx=X(x);if(sx<-300||sx>w+300)continue;
 glow(X(x+pw/2),Y(top-6),pw*.7*U,14*U,p.pr,.3);rr(x,top,pw,12,'#171230');g2.globalAlpha=.7;rc(sx,Y(top),pw*U,2*U,p.pr);g2.globalAlpha=1;
 g2.globalAlpha=.4;rr(x+8,top-12,pw-16,4,'#0a0814');g2.globalAlpha=1}}
function dais(w,h,gy,t,p){const sx=X(NX);if(sx<-300||sx>w+300)return;
 g2.fillStyle='#0e0b1c';g2.beginPath();g2.ellipse(sx,gy+3*U,125*U,14*U,0,0,7);g2.fill();
 g2.save();g2.setLineDash([14*U,10*U]);g2.lineDashOffset=-t*20;g2.strokeStyle=NPC_PAL[0];g2.globalAlpha=.35+.25*O.nT;g2.lineWidth=2*U;g2.beginPath();g2.ellipse(sx,gy+3*U,105*U,11*U,0,0,7);g2.stroke();g2.restore();
 if(O.nT>0){const g=g2.createLinearGradient(0,0,0,gy);g.addColorStop(0,NPC_PAL[0]+'00');g.addColorStop(1,NPC_PAL[0]+'33');g2.save();g2.globalAlpha=O.nT;g2.fillStyle=g;g2.fillRect(sx-70*U,0,140*U,gy);g2.restore()}}
function gate(w,h,gy,t,p){const g=O.g,sx=X(GATEX);if(sx<-340||sx>w+340)return;const spU=g*110;
 if(g<1){g2.save();g2.globalAlpha=(1-g)*(.5+.15*Math.sin(t*6));const gr=g2.createLinearGradient(0,Y(600),0,gy);gr.addColorStop(0,RED+'00');gr.addColorStop(.5,RED+'88');gr.addColorStop(1,RED+'22');g2.fillStyle=gr;g2.fillRect(sx-70*U,Y(600),140*U,gy-Y(600));
  g2.strokeStyle='#ffd0da';g2.lineWidth=1.5;g2.globalAlpha=(1-g)*.5;g2.beginPath();for(let k=-3;k<=3;k++){const xx=sx+k*20*U+Math.sin(t*3+k)*3*U;g2.moveTo(xx,Y(600));g2.lineTo(xx,gy)}g2.stroke();g2.restore()}
 [-1,1].forEach(s=>{const cx=GATEX+s*(86+spU);rr(cx-36,640,72,640,'#0a0714');g2.globalAlpha=.5;rc(X(cx-36),Y(640),2*U,640*U,p.pr);g2.globalAlpha=1;
  g2.globalAlpha=.9-g*.5;rr(cx-6,540,12,300,RED);g2.globalAlpha=1;
  g2.beginPath();g2.moveTo(X(cx-36),Y(640));g2.lineTo(X(cx),Y(720));g2.lineTo(X(cx+36),Y(640));g2.closePath();g2.fillStyle='#0a0714';g2.fill()});
 g2.save();g2.translate(sx,Y(640));g2.rotate(t*.3*(1+g*3));g2.setLineDash([16*U,10*U]);g2.strokeStyle=RED;g2.globalAlpha=.8-g*.5;g2.lineWidth=3*U;g2.beginPath();g2.arc(0,0,64*U,0,7);g2.stroke();g2.restore();
 g2.globalAlpha=.9;tx_(g>=1?'THE CORE CHAMBER':'SEALED',sx,Y(760),g>=1?GREEN:RED,MONO(13));g2.globalAlpha=1}
function chamber(w,h,gy,t,p){const sx=X(CX);if(sx<-700||sx>w+700)return;
 const calm=!!S.done.archive,col=calm?GREEN:RED,tr=O.st==='trial'?Math.min(1,O.tr/2.5):0,sp=1+tr*3,near=clamp(1-(Math.abs(O.px-CX)-250)/900,0,1),cy=Y(430);
 // flanking monoliths with lit slits
 [-1,1].forEach(s=>{const mx=CX+s*430;rr(mx-70,760,140,760,'#09060f');g2.globalAlpha=.4;rc(X(mx-70),Y(760),2*U,760*U,p.pr);g2.globalAlpha=1;
  g2.beginPath();g2.moveTo(X(mx-70),Y(760));g2.lineTo(X(mx),Y(900));g2.lineTo(X(mx+70),Y(760));g2.closePath();g2.fillStyle='#09060f';g2.fill();
  for(let k=0;k<3;k++){g2.globalAlpha=.45+.35*Math.sin(t*2+k+s);rr(mx-5+(k-1)*34,620-k*60,10,300,col)}g2.globalAlpha=1});
 glow(sx,cy,720*U,540*U,col,.15+.1*near+.3*tr);glow(sx,cy,430*U,430*U,p.pr,.16+.1*near);
 // rings
 g2.save();g2.translate(sx,cy);
 [[330,.12,[26,18],p.pr,4],[250,-.2,[3,12],p.se,3],[175,.35,[60,22],col,5]].forEach(([r,s,d,c,lw])=>{g2.save();g2.rotate(t*s*sp);g2.setLineDash(d.map(v=>v*U));g2.strokeStyle=c;g2.globalAlpha=.5+.25*near;g2.lineWidth=lw*U;g2.beginPath();g2.arc(0,0,r*U,0,7);g2.stroke();g2.restore()});
 g2.setLineDash([]);
 // the nine seals orbit the Core; each one is lit by a world you finished
 for(let i=0;i<9;i++){const a=t*.35*sp+i*Math.PI*2/9,x=Math.cos(a)*215*U,y=Math.sin(a)*215*U,d=!!S.done[W[i].id],c=[p.pr,p.se,p.ac][i%3];
  if(d){g2.globalAlpha=.16;g2.strokeStyle=c;g2.lineWidth=1.5*U;g2.beginPath();g2.moveTo(0,0);g2.lineTo(x,y);g2.stroke();g2.globalAlpha=1;glow(x,y,34*U,34*U,c,.55)}
  g2.save();g2.translate(x,y);g2.rotate(.785+t*.5);g2.fillStyle=d?c:'#18203a';const s=d?10*U:7*U;g2.fillRect(-s,-s,s*2,s*2);g2.restore()}
 // the Core: hexagon, eye, arcs of lightning
 g2.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3+t*.1*sp;g2[k?'lineTo':'moveTo'](Math.cos(a)*84*U,Math.sin(a)*84*U)}g2.closePath();
 g2.fillStyle='#0a0610';g2.fill();g2.shadowColor=col;g2.shadowBlur=26;g2.strokeStyle=col;g2.lineWidth=4*U;g2.stroke();g2.shadowBlur=0;
 const open=clamp(.12+near*.85+tr,.12,1),er=44*U;
 g2.save();g2.beginPath();g2.ellipse(0,0,er,er*open,0,0,7);g2.clip();const eg=g2.createRadialGradient(0,0,0,0,0,er);eg.addColorStop(0,'#fff');eg.addColorStop(.35,col);eg.addColorStop(1,col+'66');g2.fillStyle=eg;g2.fillRect(-er,-er,er*2,er*2);
 if(open>.22){const pxo=clamp((O.px-CX)/700,-1,1)*17*U,pyo=-4*U;g2.fillStyle='#000';g2.beginPath();g2.arc(pxo,pyo,14*U*(1-.3*tr),0,7);g2.fill();g2.fillStyle='#fff';g2.globalAlpha=.8;g2.fillRect(pxo-5*U,pyo-8*U,4*U,4*U);g2.globalAlpha=1}g2.restore();
 g2.strokeStyle=col;g2.lineWidth=2*U;g2.beginPath();g2.ellipse(0,0,er,Math.max(2*U,er*open),0,0,7);g2.stroke();
 if(!calm&&(near>.2||tr>0)){const f=Math.floor(t*10);g2.save();g2.strokeStyle='#fff';g2.shadowColor=col;g2.shadowBlur=14;g2.lineWidth=2*U;
  for(let k=0;k<3;k++){if(hash(f+k*9.1)<.45)continue;const a=hash(f*3+k)*6.28;let x=Math.cos(a)*90*U,y=Math.sin(a)*90*U;g2.globalAlpha=.7;g2.beginPath();g2.moveTo(x,y);for(let j=1;j<=5;j++){const r=(90+j*32)*U;x=Math.cos(a)*r+(hash(f+j*7+k)-.5)*30*U;y=Math.sin(a)*r+(hash(f+j*5+k)-.5)*30*U;g2.lineTo(x,y)}g2.stroke()}g2.restore()}
 g2.restore();
 // the altar
 g2.fillStyle='#0b0814';g2.beginPath();g2.ellipse(sx,gy+4*U,130*U,16*U,0,0,7);g2.fill();
 g2.save();g2.strokeStyle=col;g2.shadowColor=col;g2.shadowBlur=14;g2.globalAlpha=.7+.2*Math.sin(t*3);g2.lineWidth=2*U;g2.beginPath();g2.ellipse(sx,gy+4*U,108*U,12*U,0,0,7);g2.stroke();g2.restore();
 glow(sx,gy+2*U,150*U,30*U,col,.35+.25*near);
 g2.save();g2.translate(sx,Y(34));g2.rotate(.785);g2.fillStyle=col;g2.shadowColor=col;g2.shadowBlur=20;g2.fillRect(-9*U,-9*U,18*U,18*U);g2.restore();
 if(O.nearC)tx_(coarse?'\u25C9 WAKE THE CORE':'[E] WAKE THE CORE',sx,Y(120),'#fff',MONO(15));
 // floating shards
 for(let i=0;i<16;i++){const x=X(CX-440+hash(i*1.7)*880)+Math.sin(t*.6+i)*10*U,y=Y(90+hash(i*3.1)*560)+Math.cos(t*.5+i)*8*U,s=(4+hash(i*5.3)*8)*U;
  g2.save();g2.translate(x,y);g2.rotate(t*(.3+hash(i)*.7));g2.globalAlpha=.55;g2.fillStyle=i%3?col:p.pr;g2.fillRect(-s/2,-s/2,s,s);g2.restore()}}
function scene(w,h,gy,t,p){arches(w,h,gy,t,p);lightning(w,h,gy,t,p);floorFx(w,h,gy,t,p);pylons(w,h,gy,t,p);platforms(w,h,gy,t,p);dais(w,h,gy,t,p);gate(w,h,gy,t,p);chamber(w,h,gy,t,p);
 if(!O.egg){const sx=X(SEC.x),sy=Y(SEC.y);if(sx>-60&&sx<w+60){g2.globalAlpha=.25+.25*Math.sin(t*3);ci(sx,sy,6*U,GOLD);g2.globalAlpha=1}}}

// ---- characters and screen-space UI ----
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(O.px),sy=Y(O.py),idle=O.gr&&Math.abs(O.vx)<20?Math.sin(T*3)*.012:0,wS=1+.22*O.sq-idle,hS=1-.22*O.sq+idle,sup=support();
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(sup)+3,aw*.38*(1-Math.min(.5,(O.py-sup)/300)),5*U,0,0,7);g2.fill();
 const g=g2.createRadialGradient(sx,sy-ph/2,0,sx,sy-ph/2,ph*1.2);g.addColorStop(0,p.pr+'55');g.addColorStop(1,p.pr+'00');g2.fillStyle=g;g2.fillRect(sx-ph*1.3,sy-ph*1.7,ph*2.6,ph*2.4);
 g2.save();g2.shadowColor=p.pr;g2.shadowBlur=22;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(O.face<0?-wS:wS,hS);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore()}
function drawNpc(p,t){if(!O.nOn||!NPC.complete||!NPC.width)return;const sx=X(NX);if(sx<-200||sx>W_+200)return;
 const k=1-O.nT,gh=PH*U*1.16,gw=gh*NPC.width/NPC.height,bob=Math.sin(t*2.2)*4*U,fl=O.px<NX?-1:1;g2.save();g2.globalAlpha=1-k*.5;
 const g=g2.createRadialGradient(sx,Y(60),0,sx,Y(60),gh*1.3);g.addColorStop(0,NPC_PAL[0]+'88');g.addColorStop(1,NPC_PAL[0]+'00');g2.fillStyle=g;g2.fillRect(sx-gh*1.4,Y(60)-gh*1.4,gh*2.8,gh*2.6);
 if(k>0){const sl=6+Math.floor(k*12);g2.imageSmoothingEnabled=false;                    // he reassembles out of the same glitch he left Origin with
  for(let i=0;i<sl;i++){const sy=-gh+i*gh/sl,hh=gh/sl,jx=(Math.random()-.5)*90*U*k,sa=(Math.random()-.5)*40*U*k;
   g2.save();g2.translate(sx+jx,Y(0)-bob+sy+hh/2+sa);g2.scale(fl*(1+k*.7*(i%2?1:-1))*(1-k*.35),1+k*.12);g2.drawImage(NPC,0,i*NPC.height/sl,NPC.width,NPC.height/sl,-gw/2,-hh/2,gw,hh);g2.restore()}}
 else{g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(0)+3,gw*.4,5*U,0,0,7);g2.fill();g2.save();g2.shadowColor=NPC_PAL[0];g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,Y(0)-bob);g2.scale(fl,1);g2.drawImage(NPC,-gw/2,-gh,gw,gh);g2.restore()}
 g2.restore();g2.globalAlpha=1;if(O.nT>=1){tx_('zkSNARK',sx,Y(PH*1.16+34),NPC_PAL[0],MONO(12));if(O.nearN&&!O.dlg&&!O.mt>0)tx_(coarse?'\u25C9 TALK':'[E] TALK',sx,Y(PH*1.16+54),'#e8f6ff',MONO(12))}}
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
function vignette(w,h){const g=g2.createRadialGradient(w/2,h*.55,h*.35,w/2,h*.55,Math.max(w,h)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(2,0,8,.55)');g2.fillStyle=g;g2.fillRect(-60,-60,w+120,h+120)}
function drawHud(p){g2.textAlign='center';const done=W.slice(0,9).filter(q=>S.done[q.id]).length,s='THE ARCHIVE  \u00B7  SEALS '+done+'/9',fs=Math.round(Math.max(13,14*U));g2.font=MONO(14);const wd=g2.measureText(s).width+36,bx=W_/2-wd/2,by=8;
 rc(bx,by,wd,fs*2.3,'#05060fcc');g2.strokeStyle=p.pr;g2.lineWidth=1.5;g2.strokeRect(bx,by,wd,fs*2.3);g2.fillStyle='#ece8df';g2.fillText(s,W_/2,by+fs*1.05);
 for(let i=0;i<9;i++){g2.fillStyle=S.done[W[i].id]?[p.pr,p.se,p.ac][i%3]:'#3a3d55';const x=W_/2-80+i*20,y=by+fs*1.75;g2.beginPath();g2.moveTo(x,y-6);g2.lineTo(x+5,y);g2.lineTo(x,y+6);g2.lineTo(x-5,y);g2.fill()}
 const obj=O.st==='trial'?'':!O.nOn?'WALK THE HALL OF SEALS':!O.nDone?'FIND THE zkSNARK':O.g<1?'THE GATE IS OPENING':'REACH THE ALTAR AND WAKE THE CORE';
 if(obj){g2.font=MONO(12);const ow=g2.measureText(obj).width+28,oy=by+fs*2.3+6;rc(W_/2-ow/2,oy,ow,fs*1.6,'#05060fcc');g2.strokeStyle=O.g>=1?GREEN:'#ffd35a';g2.lineWidth=1.5;g2.strokeRect(W_/2-ow/2,oy,ow,fs*1.6);g2.fillStyle=O.g>=1?GREEN:'#ffd35a';g2.fillText(obj,W_/2,oy+fs*1.1)}
 if(O.dlg){const d=O.dlg,npc=NPC.complete&&NPC.width;g2.font=MONO(15);const ln=wrap(d.L[d.i].slice(0,Math.floor(d.c)),W_-(npc?100:16));const B=dlgBox(W_,H_,coarse,ln,{img:npc});rc(B.bx,B.by,B.mw,B.bh,'#05060ff2');g2.strokeStyle='#4ee3f0';g2.lineWidth=2;g2.strokeRect(B.bx,B.by,B.mw,B.bh);
  if(npc){g2.imageSmoothingEnabled=false;g2.drawImage(NPC,B.bx+10,B.by+10,64,64*NPC.height/NPC.width)}
  g2.textAlign='left';g2.fillStyle=NPC_PAL[0];g2.font=MONO(13);g2.fillText('zkSNARK',B.bx+B.ix,B.by+26);g2.fillStyle='#ece8df';g2.font=MONO(15);B.win.forEach((l,i)=>g2.fillText(l,B.bx+B.ix,B.by+B.head+i*B.lh));
  g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?(B.more?'TAP \u25BC MORE':'TAP TO CONTINUE'):'[E] / CLICK',B.bx+B.mw-12,B.by+B.bh-8)}
 else if(O.msg&&O.mt>0&&O.st==='play'){const m=O.msg,mw=Math.min(W_-24,600),bx2=(W_-mw)/2;g2.font=MONO(14);const ln=wrap(m.s,mw-32),bh=62*Math.max(.9,U)+ln.length*22+10,by2=H_-bh-(coarse?90:20);
  g2.save();g2.globalAlpha=Math.min(1,O.mt*2);rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=m.t==='egg'?'#ffd35a':p.pr;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);
  g2.textAlign='left';g2.fillStyle=m.t==='egg'?'#ffd35a':p.pr;g2.font=MONO(12);g2.fillText(m.k,bx2+16,by2+22);g2.fillStyle='#fff';g2.font='700 '+Math.round(Math.max(20,26*U))+"px 'Abril Fatface',serif";g2.fillText(m.h,bx2+16,by2+52*Math.max(.9,U));
  g2.fillStyle='#ece8df';g2.font=MONO(14);ln.forEach((l,i)=>g2.fillText(l,bx2+16,by2+78*Math.max(.9,U)+i*22));g2.restore()}
 if(O.st==='play'&&!O.dlg&&O.cx<200&&!O.nOn&&O.mt<=0)tx_(coarse?'\u25C0 \u25B6 WALK  \u2934 JUMP':'\u2190 \u2192 WALK   SPACE JUMP',X(150),Y(190),'#e8f6ff',MONO(12))}
function drawTrial(p){if(O.st!=='trial')return;const e=clamp(O.tr/.8,0,1),bar=H_*.11*e;rc(0,0,W_,bar,'#000');rc(0,H_-bar,W_,bar,'#000');
 const a=clamp((O.tr-.5)/.6,0,1)*(O.entered?clamp(1-(O.tr-3.1)/1.5,.35,1):1);g2.save();g2.globalAlpha=a;g2.textAlign='center';g2.fillStyle=S.done.archive?GREEN:RED;g2.font=MONO(16);g2.fillText('F I N A L   T R I A L',W_/2,H_*.4);
 g2.fillStyle='#fff';g2.shadowColor=S.done.archive?GREEN:RED;g2.shadowBlur=30;g2.font='700 '+Math.round(Math.max(34,64*U))+"px 'Abril Fatface',serif";g2.fillText('THE ARCHIVE CORE',W_/2,H_*.5);g2.shadowBlur=0;
 g2.fillStyle='#ece8df';g2.font=MONO(14);g2.fillText(NQ+' QUESTIONS  \u00B7  ONLY WHAT YOU LEARNED IN ZKSCAPE',W_/2,H_*.58);g2.restore()}

// ======================= wiring into the shared engine (same hooks as Origin) =======================
DEC.archive=function(w,h,gy,t,p){if(!isA())return;scene(w,h,gy,t,p)};
const _bgo=bg;bg=function(w,h,gy,p){if(isA()){frame(w,h,gy);cam=O.cx*U}_bgo(w,h,gy,p)};
const _avo=avatar;avatar=function(w,h,gy,p){if(isA()){drawNpc(p,T);drawPlayer(p);O.vp.forEach(q=>{g2.globalAlpha=Math.max(0,Math.min(1,q.l*2));rc(X(q.x),Y(q.y),q.s*U,q.s*U,q.c)});g2.globalAlpha=1;vignette(w,h);drawHud(p);drawTrial(p)}else _avo(w,h,gy,p)};
const _sto=startWorld;startWorld=function(i){const me=W[i].id==='archive';if(me)aInit();_sto(i);if(me){hs=[];vis=[];$z('wf').innerHTML=''}};
const _spo=stopWorld;stopWorld=function(){if(O)O.on=0;ctl(0);_spo()};
// The ending (polish/finale.js). It plays only when THIS trial is the one that earns the Archive Seal (O.fin0, set when the trial starts),
// after the seal + Explorer Card are already saved, and then hands over to the engine's own Explorer Card screen. S.fin makes it once-ever.
const _eno=end;end=function(){
 if(O&&O.fin0&&cur&&cur.id==='archive'&&S.done.archive&&!S.fin&&!DR&&window.ZKFIN&&!ZKFIN.active()){O.fin0=0;S.fin=1;save();
  try{AM.stopMusic()}catch(e){}
  if(ZKFIN.play({host:Z,pfp:S.pfp,npc:'NPCs/zkSNARK_clean.png',pal:pal(),reduce,adapter:{canvas:wc,audio(){const P=AM.PF;return{on:!!(P.mo||P.so),level:P.m*(P.mo?P.mu:P.sf)}},done:()=>_eno()}}))return}
 _eno()};

// ======================= QUESTION BANK (only what the nine worlds and the two bonus worlds teach) =======================
// M = multiple choice (first option is the correct one; the engine shuffles), TF = true/false, OR = put in order, MA = match pairs.
// d: 1 easy, 2 medium, 3 hard.  w: the world the fact comes from.  Wording follows the corrected lessons (see notes), not the older shorthand.
let _n=0;const mkq=(t,c,d,w,q,a,e)=>({id:'a'+String(++_n).padStart(3,'0'),type:t,c,d,w,q,a,e});
const M=(c,d,w,q,o,e)=>mkq('mc',c,d,w,q,o,e),TF=(c,d,w,q,b,e)=>mkq('tf',c,d,w,q,b,e),OR=(c,d,w,q,o,e)=>mkq('order',c,d,w,q,o,e),MA=(c,d,w,q,o,e)=>mkq('match',c,d,w,q,o,e);
const NEW=[
// ---- 01 Origin ----
M('Origins',1,'origin',"On an open ledger like Bitcoin's, what happens once an address is linked to a real person?",['Every payment that address ever made can be followed','Their coins are frozen','Their address becomes shielded','Nothing, addresses are always anonymous'],'An address is not a name, but once it is linked to a person, its whole payment history can be followed.'),
TF('Origins',1,'origin',"On a transparent ledger like Bitcoin's, an address is the same thing as a name.",false,'An address is not a name. The risk starts when an address is linked to a person.'),
M('Origins',1,'origin','When did Zcash launch?',['October 28, 2016','October 28, 2009','May 31, 2022','October 28, 2018'],'Zcash launched on October 28, 2016.'),
M('Origins',1,'origin',"Zcash started from Bitcoin's design and added what?",['Zero-knowledge cryptography','Proof of stake','A central issuer','Smart-contract tokens'],'The research behind it is called Zerocash.'),
TF('Origins',1,'origin','Zcash is a proof-of-work blockchain run by miners.',true,'Like Bitcoin, Zcash is run by miners.'),
M('Origins',1,'origin','What is ZEC?',['The unit you hold and send on Zcash','A shielded pool','A type of proof','The name of a wallet'],'ZEC is the unit of Zcash.'),
M('Origins',2,'origin','How many zatoshis make up 1 ZEC?',['100,000,000','1,000,000','21,000,000','10,000'],'One ZEC divides into 100,000,000 zatoshis, like a bitcoin into satoshis.'),
M('Origins',1,'origin','What is the maximum supply of ZEC?',['21 million','100 million','18 million','There is no limit'],'The 21 million cap is written into the protocol.'),
TF('Origins',1,'origin','The 21 million supply cap is written into the protocol.',true,'Nobody can change it by decree.'),
M('Origins',2,'origin','How does new ZEC come into existence?',['Through the block subsidy each new block creates, under protocol rules','A company issues it whenever it is needed','Users vote to print more','It is created whenever someone shields coins'],'Nobody can print more by decree. New coins appear only through the block subsidy defined in the protocol.'),
M('Origins',2,'origin','About how often does the block subsidy halve?',['Roughly every four years','Every year','Every 75 seconds','It never halves'],'It halves roughly every four years.'),
M('Origins',2,'origin','In which years has the subsidy halved so far?',['2020 and 2024','2016 and 2020','2018 and 2022','2022 and 2026'],'It halved in 2020 and again in 2024.'),
M('Origins',2,'origin',"What happened to the founders' reward at the 2020 halving?",['It ended and became a development fund','It doubled','It was burned','It went to miners only'],"The founders' reward paid out for the first four years. It ended at the 2020 halving and became a development fund."),
TF('Origins',2,'origin',"A founders' reward was paid out of each block for the first four years.",true,'It ended at the 2020 halving.'),
TF('Origins',2,'origin','A block made only of shielded transactions can skip the usual rules.',false,'Shielded or not, every block must follow the rules, or the network rejects it.'),
M('Origins',1,'origin','A transparent Zcash address starts with which letter?',['t','z','u','x'],'Transparent addresses start with t and are public, like Bitcoin.'),
M('Origins',2,'origin','What does a shielded address protect?',['The sender, the receiver and the amount','Only the amount','Only the sender','Nothing, it is public like Bitcoin'],'Shielded addresses hide sender, receiver and amount.'),
TF('Origins',2,'origin','On Zcash, every transaction is private automatically.',false,'Privacy is a choice per transaction. Nothing is private automatically.'),
M('Origins',2,'origin','Maya pays Leo from a transparent address to another transparent address. What can the public see?',['Sender, receiver and amount','Only the amount','Only the sender','Nothing at all'],'Transparent transactions are public.'),
M('Origins',2,'origin','What was Zcash built to change about a public ledger?',['Keep the public ledger without the public history','Remove the ledger entirely','Make all history public','Give miners control over privacy'],'Zcash keeps the public ledger, without the public history.'),
OR('Origins',2,'origin','Put these Zcash milestones in order, earliest first',['Zcash launches','First halving','Second halving','Ironwood (NU6.3) activates'],'2016, 2020, 2024, 2026.'),
MA('Origins',2,'origin','Match each term to its meaning',[['Transparent address','Public, like Bitcoin'],['Shielded address','Hides sender, receiver and amount'],['ZEC','The unit you hold and send'],['Zatoshi','One 100-millionth of a ZEC']],'Four basics from the Origin.'),
// ---- 02 Shielded Valley ----
TF('Privacy',1,'shielded','In a transparent transaction, the sender, receiver and amount are public on the blockchain.',true,'That is what transparent means.'),
TF('Privacy',1,'shielded','A shielded transaction hides the sender, the receiver and the amount.',true,'Funds live in shielded pools.'),
M('Privacy',2,'shielded','Where do shielded funds live?',['In shielded pools','In a public list of t addresses','Inside the block header','On the miner\'s computer'],'Shielded funds live in shielded pools.'),
TF('Privacy',2,'shielded','Because shielded transactions are hidden, the network cannot check them.',false,'The network still checks every transaction.'),
M('Privacy',2,'shielded','What lets the network confirm the rules were followed without seeing who paid whom?',['A zero-knowledge proof','A public address list','A miner\'s promise','A transparent copy of the payment'],'A zero-knowledge proof.'),
M('Privacy',2,'shielded','Which 2018 upgrade made shielded transactions fast enough for everyday use?',['Sapling','NU5','Ironwood','Blossom'],'Sapling, in 2018.'),
M('Privacy',2,'shielded','What happens to an amount when you move it from shielded back to transparent?',['That amount becomes public','It stays hidden','It is deleted','It becomes unspendable'],'Privacy depends on how you use it.'),
M('Privacy',3,'shielded','Sam keeps ZEC shielded, then sends it all to a transparent address to pay a shop. What does this show?',['Privacy depends on how you use it','Shielded funds can never become public','The network stops checking the payment','Transparent addresses are always private'],'Moving value back to transparent makes that amount public.'),
TF('Privacy',3,'shielded','Once ZEC is in a shielded pool, everything you do with it later stays private, however you move it.',false,'Moving funds back to transparent makes that amount public.'),
MA('Privacy',2,'shielded','Match each term to what it means',[['Transparent transaction','Sender, receiver and amount are public'],['Shielded transaction','Hides sender, receiver and amount'],['Shielded pool','Where shielded funds live'],['Sapling (2018)','Made shielded payments practical']],'From the Valley.'),
// ---- 03 Proof Temple ----
M('Proofs',1,'proof','In a zero-knowledge proof, who convinces whom?',['A prover convinces a verifier','A verifier convinces a miner','A miner convinces a prover','A wallet convinces an address'],'The prover convinces the verifier a statement is true without revealing the secret.'),
M('Proofs',2,'proof','In Zcash, what is the statement being proven?',['This transaction follows the rules','This sender has the most ZEC','This block is the newest','This address is public'],'The statement is that the transaction follows the rules.'),
M('Proofs',2,'proof','In Zcash, what is the secret behind the proof?',['Who paid whom and how much','The rules of the network','The block height','Whether a proof exists'],'The rules are public; who paid whom and how much is the secret.'),
M('Proofs',2,'proof','What is the witness?',['The private input only the prover knows','The public rule','The verifier\'s signature','The block hash'],'The witness is the private input.'),
TF('Proofs',2,'proof','The rules are public, but the secret stays private.',true,'Rules public, secret private.'),
TF('Proofs',2,'proof','Real zk-SNARKs need five rounds of back-and-forth between prover and verifier.',false,'The five rounds in the Temple are a metaphor. Real zk-SNARKs are non-interactive: one proof, no back and forth.'),
M('Proofs',1,'proof','zk-SNARK stands for...',['Zero-Knowledge Succinct Non-Interactive Argument of Knowledge','Zero-Key Secure Network Account Record Keeper','Zcash Secret Number And Real Key','Zero-Knowledge Shielded Network Address Record'],'Each word matters.'),
M('Proofs',2,'proof','In zk-SNARK, what does succinct mean?',['The proof is small and quick to check','The proof is secret','The proof is slow but exact','The proof needs many rounds'],'Small and quick to check.'),
M('Proofs',2,'proof','What does non-interactive mean?',['One proof message is enough, with no back and forth','No computer is involved','No keys are needed','No verifier exists'],'One message.'),
M('Proofs',2,'proof','What is zero-knowledge aiming for?',['The proof is designed to reveal nothing about the secret beyond the fact that the statement is true','The proof contains no information at all','The verifier must not know the rules','Nobody can ever check the proof'],'It is a design goal for the proof, not a promise about everything around it.'),
M('Proofs',2,'proof','What does argument of knowledge mean?',['The prover really knows the secret','The verifier argues with the prover','The proof is a long essay','The secret is public'],'The prover really knows it.'),
M('Proofs',3,'proof','Sapling used Groth16. What did that system need?',['A trusted setup ceremony','No setup at all','A miner vote every block','A public copy of every secret'],'Groth16 needed a trusted setup ceremony.'),
M('Proofs',2,'proof','Which proving system does Orchard use?',['Halo 2','Groth16','Equihash','SHA-1'],'Orchard uses Halo 2 (NU5, 2022).'),
TF('Proofs',3,'proof',"Orchard's Halo 2 needs a trusted setup ceremony.",false,'Halo 2 needs no trusted setup.'),
MA('Proofs',3,'proof','Match each role to what it does',[['Prover','Convinces without revealing the secret'],['Verifier','Checks the proof'],['Witness','Private input only the prover knows'],['Public rule','What every proof is checked against']],'The Temple, in four words.'),
M('Proofs',3,'proof','A verifier receives a proof that a transaction follows the rules. What does it do?',['Checks the proof against the public rule','Asks the sender to reveal the secret','Replays the payment in public','Trusts the prover without checking'],'The verifier checks the proof.'),
// ---- 04 Key Library ----
M('Keys',1,'keys','What can a viewing key do?',['Show transaction details without being able to spend','Spend funds','Mine blocks','Change the recovery phrase'],'Viewing is not the same as spending.'),
M('Keys',1,'keys','What is a spending key?',["The root of a wallet's authority, kept private",'A key that only views','A public address','A key shared with auditors'],'Keep it private.'),
TF('Keys',1,'keys','A viewing key can spend funds.',false,'A viewing key shows details and cannot spend.'),
M('Keys',2,'keys','Which key is derived from which?',['A viewing key is derived from a spending key','A spending key is derived from a viewing key','Both come from the address','Neither is derived from anything'],'Never the other way round.'),
TF('Keys',2,'keys','You can work out a spending key if you hold the matching viewing key.',false,'A viewing key comes from a spending key, never the other way round.'),
M('Keys',2,'keys','What power does an address give the sender over your funds?',['None, an address only receives','Full control','The power to view your history','The power to freeze them'],'An address only receives.'),
M('Keys',2,'keys','What can a recovery phrase restore?',["Your spending authority, through your wallet's own derivation scheme",'Deleted blocks','Only your address book','Other wallets, identically'],'Wallets derive keys from the phrase by their own scheme.'),
M('Keys',2,'keys','An auditor needs to check your payment history. What do you give them?',['A viewing key','Your spending key','Your recovery phrase','Your wallet password'],'Auditors get viewing keys, never spending keys.'),
TF('Keys',2,'keys','Auditors should receive spending keys so they can verify payments.',false,'Auditors get viewing keys, never spending keys.'),
TF('Keys',3,'keys','A viewing key can be taken back after you have shared it.',false,'A shared viewing key cannot be taken back.'),
M('Keys',3,'keys','Why share the smallest viewing key that does the job?',['A shared viewing key cannot be taken back','Larger keys cost more ZEC','Miners reject large keys','Small keys can spend'],'You cannot undo a share.'),
M('Keys',3,'keys','Some viewing keys see only incoming activity; others also see outgoing. An auditor only needs to confirm what you received. What do you share?',['The key that sees only incoming activity','The key that sees incoming and outgoing','Your spending key','Your recovery phrase'],'Share the smallest one the job needs.'),
M('Keys',2,'keys','What does a unified address do?',['Bundles several receiver types into one string','Replaces the spending key','Hides the viewing key','Mines blocks'],'One string, several receiver types.'),
M('Keys',2,'keys','Which upgrade introduced unified addresses?',['NU5 (2022)','Sapling (2018)','Ironwood (2026)','Blossom (2019)'],'NU5, 2022.'),
MA('Keys',2,'keys','Match each key or address to its job',[['Spending key','Authorizes spending, kept private'],['Viewing key','Shows details, cannot spend'],['Address','Only receives'],['Unified address','Bundles several receiver types']],'The Key Library in four lines.'),
M('Keys',3,'keys','A friend offers to "help check your balance" and asks for your recovery phrase. What is the best move?',['Refuse, and share at most a limited viewing key if they need to see details','Share it, since it is only for viewing','Share your spending key instead','Post it publicly to prove trust'],'The phrase restores spending authority. A viewing key shows without spending.'),
// ---- 05 Orchard ----
M('Notes',1,'orchard','What is a shielded note?',['A piece of value tied to its owner','A message to the miner','A public receipt','A kind of address'],'The network never sees what is inside.'),
TF('Notes',2,'orchard','The network can see the value inside a shielded note.',false,'The network never sees what is inside a shielded note.'),
M('Notes',2,'orchard','What does a note commitment do?',['Hides value and owner, and is added to a public tree','Reveals the owner to miners','Cancels a spent note','Creates new ZEC'],'It hides value and owner and goes into a public tree.'),
M('Notes',2,'orchard','What is published when a shielded note is spent?',['A nullifier','The note\'s value','The owner\'s name','The recovery phrase'],'A nullifier.'),
M('Notes',3,'orchard','What does a published nullifier tell the network?',['A unique mark joined a public list, without saying which note was spent','Which note was spent and by whom','How much was spent','Nothing, it is never checked'],'A spent note leaves a mark, not a trail.'),
M('Notes',3,'orchard','What happens if the same nullifier appears a second time?',['The network rejects the second spend','The second spend is accepted','Both spends are refunded','The note is split in two'],'No double spend.'),
TF('Notes',3,'orchard','A nullifier reveals exactly which note was spent.',false,'It does not say which note was spent.'),
M('Notes',1,'orchard','Which upgrade brought the Orchard pool?',['NU5 (2022)','Sapling (2018)','Blossom (2019)','NU6.3 (2026)'],'NU5, 2022.'),
M('Notes',2,'orchard','Orchard uses Halo 2 on which pair of curves?',['Pallas and Vesta','Sapling and Sprout','Equihash and Groth','Orchard and Ironwood'],'Pallas and Vesta.'),
M('Notes',3,'orchard','What is the hash used for Orchard note commitments called?',['Sinsemilla','Equihash','Groth16','Blossom'],'Sinsemilla.'),
M('Notes',3,'orchard','Which mechanism stops a shielded note from being spent twice?',['The public list of nullifiers','A miner\'s memory','The viewing key','The recovery phrase'],'Nullifiers.'),
OR('Notes',3,'orchard','Put the life of a shielded note in order',['A note is created','Its commitment is added to the public tree','The note is spent','A nullifier is published'],'Created, committed, spent, nullified.'),
MA('Notes',3,'orchard','Match each Orchard term to its job',[['Note commitment','Hides value and owner, goes into a public tree'],['Nullifier','Unique mark published when a note is spent'],['Halo 2','Orchard\'s proving system'],['Sinsemilla','Hash used for commitments']],'Orchard in four lines.'),
// ---- 06 Ironwood ----
M('Upgrades',2,'ironwood','What did NU6.2 fix?',['A flaw in the Orchard proof circuit found in 2026','The block time','The founders\' reward','The address format'],'NU6.2 fixed the circuit.'),
M('Upgrades',2,'ironwood','What did NU6.3, Ironwood, do?',['Opened a new shielded pool and restricted Orchard to exits only','Removed shielded transactions','Raised the supply cap','Replaced proof of work'],'A new pool, and Orchard is exits only.'),
M('Upgrades',2,'ironwood','When did NU6.3 activate?',['July 28, 2026','May 31, 2022','October 28, 2016','December 2019'],'July 28, 2026.'),
TF('Upgrades',2,'ironwood','After Ironwood, new funds can still be added to the Orchard pool.',false,'New funds cannot enter Orchard.'),
M('Upgrades',3,'ironwood','What is the turnstile?',['A rule letting value leave Orchard only into Ironwood, one way, never more than went in','A wallet feature that hides memos','A miner reward rule','A way to move funds back into Orchard'],'One way, never more than went in.'),
TF('Upgrades',3,'ironwood','Under the turnstile, value can move from Ironwood back into Orchard.',false,'The turnstile is one way.'),
M('Upgrades',3,'ironwood','Orchard and Ironwood are separate pools. What does each have?',['Its own note tree and nullifier list','A shared nullifier list','No notes at all','The same note tree'],'Separate trees, separate lists.'),
M('Upgrades',2,'ironwood','How does a network change like Ironwood begin?',['As a ZIP (Zcash Improvement Proposal)','As a miner vote on social media','As a wallet update','As a block reward'],'Every change starts as a ZIP.'),
M('Upgrades',2,'ironwood','When does a network upgrade take effect?',['At an agreed block height','At an agreed time on every computer','When half the wallets update','When a miner chooses'],'At an agreed block height.'),
M('Upgrades',3,'ironwood','Dana still holds ZEC in the old Orchard pool after Ironwood. What can she do?',['Move it out into Ironwood through the turnstile','Add more ZEC to Orchard','Spend it only after sending it to a transparent address','Nothing, it is frozen forever'],'Orchard is exits only, and exits go into Ironwood.'),
OR('Upgrades',2,'ironwood','Put how a network change happens in order',['A ZIP is proposed','Node software such as Zebra implements it','An agreed block height is reached','The network upgrades'],'Proposal, software, height, upgrade.'),
MA('Upgrades',2,'ironwood','Match each item to what it did',[['NU6.2','Fixed the Orchard circuit flaw'],['NU6.3 (Ironwood)','Opened a new pool, Orchard exits only'],['Turnstile','One-way, capped exit from Orchard'],['ZIP','A Zcash Improvement Proposal']],'The Ironwood story.'),
// ---- 07 Block Observatory ----
M('Protocol',1,'blocks','What does each block header hold that links it to history?',['The hash of the previous block','The sender\'s address','A copy of every shielded note','The miner\'s password'],'The previous block\'s hash.'),
TF('Protocol',2,'blocks','Changing an old block leaves all later links in the chain valid.',false,'It breaks every later link.'),
M('Protocol',2,'blocks','Why does changing an old block break the chain?',['Every later block\'s link to it no longer matches','Miners delete it','Wallets reject the address','The supply cap resets'],'Each header contains the previous block\'s hash.'),
M('Protocol',1,'blocks','Which algorithm does Zcash\'s proof of work use?',['Equihash','Halo 2','Sinsemilla','Groth16'],'Equihash.'),
M('Protocol',2,'blocks','What does a miner earn for finding a valid solution?',['The block reward','A viewing key','A nullifier','A ZIP'],'The block reward.'),
M('Protocol',2,'blocks','About how long is Zcash\'s block time?',['About 75 seconds','About 10 minutes','About 1 second','About 1 day'],'About 75 seconds.'),
M('Protocol',2,'blocks','Which 2019 upgrade set that block time?',['Blossom','Sapling','NU5','Ironwood'],'Blossom, 2019.'),
M('Protocol',3,'blocks','What adjusts to hold the block pace steady?',['Difficulty','The supply cap','The nullifier list','The recovery phrase'],'Difficulty adjusts.'),
M('Protocol',2,'blocks','What does every full node, such as Zebra, do with each block?',['Checks it against the rules itself','Trusts the miner','Only checks transparent blocks','Skips shielded blocks'],'Every full node checks for itself.'),
M('Protocol',3,'blocks','Two valid chains compete. Which one do nodes follow?',['The valid chain with the most accumulated work','The block that arrived first','The chain with the most transactions','The chain most wallets pick'],'The most accumulated work.'),
TF('Protocol',3,'blocks','Nodes always follow whichever block they saw first.',false,'They follow the valid chain with the most accumulated work.'),
M('Protocol',2,'blocks','What is a confirmation?',['Each block on top of a payment','A message from your wallet','A signature from the receiver','A second proof'],'Each block on top is one more confirmation.'),
MA('Protocol',3,'blocks','Match each term to its role',[['Equihash','Zcash\'s proof-of-work algorithm'],['Block header','Holds the previous block\'s hash'],['Difficulty','Adjusts to hold the block pace'],['Full node','Checks every block itself']],'The Observatory in four lines.'),
OR('Protocol',2,'blocks','Put a payment\'s journey in order',['It is broadcast','A miner includes it in a block','Another block lands on top','Confirmations keep growing'],'Broadcast, mined, buried, confirmed.'),
// ---- 08 The Machine ----
MA('Protocol',2,'machine','Match each part of the Machine to what it is',[['State','Notes and nullifiers'],['History','Blocks'],['Evidence','zk-SNARK proofs'],['Authority','Spending and viewing keys']],'State, history, evidence, authority.'),
M('Protocol',2,'machine','In the Machine, what makes up the state?',['Notes and nullifiers','Blocks','Proofs','Keys'],'Notes and nullifiers.'),
M('Protocol',2,'machine','In the Machine, which part is the evidence?',['zk-SNARK proofs','Blocks','Nullifiers','Viewing keys'],'Proofs are the evidence.'),
M('Protocol',2,'machine','In the Machine, which part is the history?',['Blocks','Notes','Proofs','Keys'],'Blocks are the history.'),
OR('Upgrades',3,'machine','Put these upgrades in order',['Sapling (2018)','NU5 with Orchard (2022)','NU6.2 fixes the Orchard circuit (2026)','Ironwood NU6.3 (2026)'],'2018, 2022, then the two 2026 upgrades.'),
M('Protocol',3,'machine','What does a valid shielded spend need?',['A valid proof, spending authority, and a nullifier not seen before','A viewing key, a new address and a miner\'s approval','A transparent copy, a proof and a ZIP','Only a recovery phrase'],'Proof, authority, fresh nullifier.'),
M('Protocol',3,'machine','Instead of being shown your private details, what does the network check?',['A proof that the rules were followed','A copy of your recovery phrase','A transparent twin of the payment','Your viewing key'],'Some data is public by protocol, but the private details stay with you and a proof stands in for them.'),
M('Protocol',3,'machine','What is selective disclosure?',['Giving an auditor a viewing key so they see your history but cannot spend','Hiding all your history from everyone forever','Publishing your spending key','Making every transaction transparent'],'View without the power to spend.'),
TF('Protocol',3,'machine','A shielded spend can reuse a nullifier that is already on the list.',false,'A nullifier must not have been seen before.'),
TF('Protocol',2,'machine','Viewing authority alone is enough to authorize a spend.',false,'Spending needs spending authority.'),
M('Protocol',3,'machine','Which part of the Machine does an auditor\'s viewing key belong to?',['Authority','State','History','Evidence'],'Keys are authority.'),
// ---- 09 Canvas and the ecosystem ----
M('Ecosystem',1,'canvas','The Snarks are named after what?',['zk-SNARKs','Zcash miners','Shielded pools','Block headers'],'After zk-SNARKs.'),
TF('Ecosystem',2,'canvas','Zcash has a single owner.',false,'Zcash has no single owner.'),
M('Ecosystem',2,'canvas','Who builds Zcash software and upgrades?',['Independent teams, such as the Zcash Foundation, Shielded Labs and ZODL','One company that owns the network','Only miners','Only exchanges'],'Independent teams.'),
// ---- 11 Noir Gate ----
M('Keys',2,'noir',"Where does a wallet's spending key come from?",["Its recovery phrase, through the wallet's derivation scheme",'Its address','A miner','The block header'],'The phrase, by the wallet\'s own scheme.'),
TF('Keys',2,'noir','Anyone who holds your recovery phrase can restore the spending authority it derives.',true,'Keep the phrase secret.'),
M('Keys',2,'noir','When someone pays your unified address, who picks the receiver type?',["The sender's wallet picks the best one it supports",'The miner picks','You pick after the payment','A ZIP picks'],'The sender\'s wallet picks.'),
M('Keys',2,'noir','How large can an encrypted shielded memo be?',['Up to 512 bytes','Up to 32 bytes','Up to 1 gigabyte','Memos are not possible'],'Up to 512 bytes.'),
TF('Keys',2,'noir','Shielded payments can carry an encrypted memo.',true,'Up to 512 bytes.'),
TF('Keys',3,'noir','A viewing key can sign a spend if the amount is small.',false,'A viewing key can never sign.'),
M('Keys',2,'noir','Which key can authorize a spend?',['Only the spending key','Any viewing key','The address','The memo'],'Only the spending key.'),
M('Keys',1,'noir','Each block on top of your transaction is one more what?',['Confirmation','Nullifier','Memo','ZIP'],'One more confirmation.'),
// ---- 12 Zilkroad ----
M('Ecosystem',1,'zilkroad','What are the portraits in the Zilkroad?',['zkSNARKs, a collection made for the Zcash community','Miners','Shielded pools','Wallet apps'],'zkSNARKs.'),
TF('Ecosystem',2,'zilkroad','Nobody owns Zcash; independent organizations build software, wallets and marketplaces.',true,'Independent organizations.'),
M('Ecosystem',2,'zilkroad','A payment has just been broadcast. Is it final?',['No, each block on top adds a confirmation','Yes, broadcasting makes it final','Only if it is shielded','Only after a ZIP'],'Not final when broadcast.'),
TF('Ecosystem',1,'zilkroad','Exploring the Zilkroad is free; purchasing is never required.',true,'Exploring is free.'),
// ---- across the whole game ----
M('Privacy',3,'all','Which sentence is the best recap of Zcash?',['Transparent shows everything, shielded hides the details, and the network checks the rules either way','Shielded hides everything and nothing is ever checked','Transparent is encrypted and shielded is public','Privacy is automatic and cannot be chosen'],'The Origin recap.'),
M('Privacy',3,'all','A transaction is shielded. Which of these is still true?',['The network still checks that it follows the rules','Miners cannot include it in a block','It needs no proof','It cannot be spent'],'The network checks the rules either way.'),
TF('Proofs',3,'all','Because a zero-knowledge proof is used, nodes no longer need to check the rules.',false,'The proof is how they check them.'),
M('Keys',3,'all','Which of these can a viewing key NOT do?',['Authorize a spend','Show transaction details','Be shared with an auditor','Be derived from a spending key'],'It can never authorize a spend.'),
M('Protocol',3,'all','A block of shielded transactions contains one that breaks the rules. What happens?',['The network rejects the block','The block is accepted because it is private','Only the amount becomes public','Miners fix it later'],'Every block must follow the rules.'),
OR('Privacy',3,'all','Put a private payment in order',['Funds sit in a shielded pool','A proof that the rules are followed is created','The network checks the proof and the nullifier','Blocks on top add confirmations'],'Pool, proof, check, confirmations.'),
MA('Upgrades',3,'all','Match each upgrade to what it brought',[['Sapling (2018)','Shielded payments fast enough for everyday use'],['NU5 (2022)','Orchard, Halo 2 and unified addresses'],['NU6.2 (2026)','Fixed the Orchard circuit flaw'],['NU6.3 (2026)','The Ironwood pool, Orchard exits only']],'The whole timeline.'),
M('Notes',3,'all','Which pairing is correct?',['Nullifier: marks a note as spent without saying which','Commitment: marks a note as spent','Viewing key: authorizes spending','Memo: proves the rules were followed'],'Nullifiers mark spends.'),
M('Proofs',3,'all','Which pair is right for a Zcash proof?',['Rule: the transaction follows the protocol. Secret: who paid whom and how much','Rule: who paid whom. Secret: the protocol','Rule: the witness. Secret: the verifier','Rule: the recovery phrase. Secret: the block'],'Public rule, private secret.')
];
BANK.length=0;NEW.forEach(q=>BANK.push(q));

// ======================= the final trial: 15 questions, rising difficulty, spread across the worlds =======================
//   2 easy, 5 medium, 8 hard. A world is rarely asked twice; the slots below ask for a mix of true/false, order and match as well.
const PLAN=[1,1,2,2,2,2,2,3,3,3,3,3,3,3,3],PREF=[0,'tf',0,'order',0,'match',0,0,'tf',0,'order',0,'match',0,0];
pickSet=function(){const used=new Set(),wn={},cn={},tn={},out=[];
 PLAN.forEach((d,s)=>{let pool=BANK.filter(q=>q.d===d&&!used.has(q.id));const pr=PREF[s]&&pool.filter(q=>q.type===PREF[s]);if(pr&&pr.length)pool=pr;if(!pool.length)pool=BANK.filter(q=>!used.has(q.id));
  const q=pool.map(x=>[(wn[x.w]||0)*3+(cn[x.c]||0)*1.5+(tn[x.type]||0)+Math.random(),x]).sort((a,b)=>a[0]-b[0])[0][1];
  used.add(q.id);wn[q.w]=(wn[q.w]||0)+1;cn[q.c]=(cn[q.c]||0)+1;tn[q.type]=(tn[q.type]||0)+1;out.push(q)});
 return out};
});

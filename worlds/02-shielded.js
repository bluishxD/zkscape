/* ZKSCAPE world 02: Shielded Valley - a small side-scrolling platformer (scene, physics, clues, gate). Other worlds are untouched. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'shielded',n:'SHIELD',title:'SHIELDED VALLEY',sub:'Transparent or shielded?',desc:'Run and jump through the valley, find 3 clues, then choose the path that protects transaction information.',q:'Zcash gives users the option of shielded transactions.',sort:[
 ['Publicly visible transaction history',0],['Private financial activity',1],['Choosing the privacy-preserving path',1],['Amounts and addresses readable by anyone on-chain',0]],
 deep:'Shielded transactions protect financial information from public view while the network can still verify they are valid. Not every transaction is automatically private.'});
A.shielded='Shield Fragment';
// ======================= SHIELDED VALLEY: side-scrolling platformer =======================
// Hooks into the shared engine (cur, run, ax/tx, cam, pim, wow, AVs, TH, complete(), back(), fact()) and
// leaves every other world untouched. Level units: 1 unit = U screen pixels; y = height above the ground.
const LW=6400,ZX=2500,GX=6040,PORT=[5380,5640],PH=112,HW=30,HH=100,SPD=340,JMP=830,GRAV=2500;
const SOL=[[620,140,60],[1120,200,90],[1320,160,150],[3010,220,80],[3230,170,140]];                        // cliffs: x, width, top (solid)
const FLT=[[1500,170,215],[1740,130,170],[2780,150,110],[3470,150,200],[3700,150,270],[3930,150,190],[4150,140,110]]; // floating: one-way
// Three claims. None of them is a liar. They do not agree.
// Each one is sealed: you can reach it, but you can only READ it behind the shield.
const CLUES=[{x:1585,y:285,k:'eye',h:'THE OPEN HAND',g:'████████ ██ ████ ███████ ███ ██',
 s:'Show everything. A claim nobody can check is just a rumour. If money is public, anyone can hold the ledger to it.',e:'IN ZCASH: a transparent transaction publishes the sender, the receiver and the amount on the blockchain for anyone to read.'},
 {x:2855,y:170,k:'shield',h:'THE CLOSED HAND',g:'████ ██ ███ █████ ███████ ██ ████ ███',
 s:'Show nothing. The moment your history is public it stops being yours. A ledger everyone can read is a ledger everyone owns.',e:'IN ZCASH: a shielded transaction hides the sender, the receiver and the amount. Shielded funds live in shielded pools, and the network still checks every transaction.'},
 {x:3775,y:345,k:'proof',h:'THE THIRD HAND',g:'███ ██████ ██ ███████ ███ █████ ██ ███',
 s:'Neither. Send the proof and keep the secret. Nobody should learn who paid whom just to be convinced the rules were followed.'}];
const GAP=[4520,4830],BN=8,WARD={a:1500,b:2200,x0:2000};   // broken valley (needs the bridge) + Proof Warden patrol
const JF={x:470,y:0};                                       // Jeff waits on flat ground before the first cliff
const TREES=[];for(let x=80,i=0;x<5300;x+=150+((i*73)%110),i++){if(SOL.some(s=>x>s[0]-50&&x<s[0]+s[1]+50)||(x>ZX-120&&x<ZX+120)||(x>2560&&x<2720)||(x>800&&x<980)||(x>240&&x<380)||(x>4480&&x<4880))continue;TREES.push([x,.8+((i*37)%5)/10])}
let V=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,q:0,e:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-V.cx)*U,Y=y=>GY-y*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),isV=()=>run&&cur&&cur.id==='shielded'&&V&&V.on;
// ---- Jeff: chill, uncomplicated. Chill greeting, then he explains the shield. ----
const NPC=new Image();
NPC.onload=()=>{try{const c=removeBg(NPC);c.complete=true;if(!c.width)c.width=NPC.width;if(!c.height)c.height=NPC.height;NPC_IMG=c;try{NPC_PAL=extract(c)[0]}catch(e){NPC_PAL=['#8fb0c9','#c8dce8','#a8c060']}}catch(e){NPC_IMG=NPC;NPC_PAL=['#8fb0c9','#c8dce8','#a8c060']}};
NPC.src='NPCs/jeff_clean.png';let NPC_IMG=NPC,NPC_PAL=['#8fb0c9','#c8dce8','#a8c060'];
const JEFF=[['Oh, hey. You are the one with the picture-face. Nice.',4],
 ['Nothing weird here. This part of the valley is calm. Walk right in.',4.5],
 ['The Watchers start further along. They do not hate you. They just check things.',5],
 ['Did you notice the shield? Press Q. Same Q, every time.',4.5],
 ['You cannot shoot anything with it and you cannot see through it. It just makes you much harder to argue with.',6],
 ['A Watcher catches you without it, that is the end of the run. With it up, it just shoves you off and loses interest.',6],
 ['So keep it on when it counts. Otherwise it is just a coin you can stand behind.',5],
  ['Here is what the valley is really about. In Zcash every transaction is either transparent or shielded, and you choose.',6.5],
  ['Transparent shows everything, like Bitcoin. Shielded hides who paid whom and how much, and the network still checks it is valid.',7],
  ['One catch: move money from shielded back to transparent and that amount becomes public. Privacy depends on how you use it.',7]];
// ---- door attestation: each door demands its own pattern be reproduced before it opens.
// The pattern is only legible while the shield is up - the same rule as the marks in the valley.
const DOORPZ={0:{t:'SHOW EVERYTHING',p:[1,0,1,0,1,0,1,0,1],why:'order matters, and everyone can check it'},
 mid:{t:'PROVE IT',p:[1,1,0,0,1,1,0,1,0],why:'the proof travels, the secret does not'},
 1:{t:'SHOW NOTHING',p:[0,1,1,1,0,1,1,1,0],why:'nobody gets to look at you, and nobody can check you either'}};
function openAtt(kind){V.att={kind:kind,g:[0,0,0,0,0,0,0,0,0],bad:0,ok:0,t:0};AM.sfx('interaction')}
function attFlip(i){const a=V.att;if(!a||a.ok)return;a.g[i]=a.g[i]?0:1;AM.sfx('interaction');
 const t=DOORPZ[a.kind].p;a.ok=a.g.every((v,k)=>v===t[k])?1:0;
 if(a.ok){AM.sfx('correct');V.att=null;doCommit(a.kind)}else AM.sfx('interaction')}
function drawAtt(){
 if(!V.att)return;const a=V.att,d=DOORPZ[a.kind],pw=Math.min(W_-40,440),ph=Math.min(H_-80,330),R={x:(W_-pw)/2,y:(H_-ph)/2,w:pw,h:ph};
 if(a.bad>0)a.bad-=1/60;
 g2.save();rc(0,0,W_,H_,'rgba(2,2,8,.72)');rc(R.x,R.y,R.w,R.h,'#0a0c20');g2.strokeStyle=p_att;g2.lineWidth=2;g2.strokeRect(R.x,R.y,R.w,R.h);
 g2.textAlign='center';g2.fillStyle='#ece8df';g2.font=MONO(13);g2.fillText('ATTEST: '+d.t,R.x+R.w/2,R.y+26);
 g2.fillStyle='#8a867c';g2.font=MONO(10);g2.fillText('"'+d.why+'"',R.x+R.w/2,R.y+44);
 g2.fillStyle=V.shield?'#5dd68a':'#6a7084';g2.font=MONO(11);g2.fillText(V.shield?'SHIELD UP - PATTERN VISIBLE':'SHIELD DOWN - PATTERN HIDDEN',R.x+R.w/2,R.y+66);
 const cell=74,ox=R.x+R.w/2-cell*1.5,oy=R.y+90;
 for(let i=0;i<9;i++){const c=i%3,r=(i/3)|0,x=ox+c*cell,y=oy+r*cell,on=a.g[i],want=d.p[i];
  g2.fillStyle=on?'#4ee3f0':'#141a34';g2.fillRect(x+8,y+8,cell-16,cell-16);g2.strokeStyle=on?'#9ffcff':'#2a2f66';g2.lineWidth=2;g2.strokeRect(x+8,y+8,cell-16,cell-16);
  if(V.shield){const gl=.5+.3*Math.sin(T*3+i);g2.globalAlpha=on?.5:gl;g2.strokeStyle=on?'#ffffff':'#5dd68a';g2.lineWidth=3;g2.strokeRect(x+18,y+18,cell-36,cell-36);
   if(want){g2.globalAlpha=on?.35:gl;g2.fillStyle='#5dd68a';g2.beginPath();g2.arc(x+cell/2,y+cell/2,7,0,7);g2.fill()}g2.globalAlpha=1}}
 if(a.bad>0){g2.globalAlpha=Math.min(1,a.bad);g2.fillStyle='#e25b4a';g2.font=MONO(15);g2.fillText('INVALID',R.x+R.w/2,R.y+ph-46);g2.globalAlpha=1}
 g2.fillStyle='#8a867c';g2.font=MONO(10);g2.fillText(coarse?'TAP TILES':'CLICK TILES  ·  ESC TO STEP BACK',R.x+R.w/2,R.y+ph-14);g2.restore()}
const p_att='#9ffcff';
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixc=(a,b,t)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
function vInit(){V={on:1,px:140,py:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,cx:0,z:0,side:0,got:[0,0,0],n:0,st:'play',gt:0,cd:0,sq:0,msg:null,mt:0,next:0,fly:[],vp:[],ft:[],shk:[0,0],auto:0,hid:0,step:0,bs:0,wr:0,flash:0,rip:0,hl:0,red:0,exp:0,quiet:0,hint:0,dead:null,bn:null,pf:null,br:{t:0,go:0},en:{x:WARD.x0,y:90,st:'patrol',t:0,fd:-1,lock:0,cool:0,ph:0,arm:0},last:performance.now(),shield:0,dlg:null,jeffStage:0,jeffNear:0,rd:[0,0,0],hintT:0};K.l=K.r=K.j=K.jp=K.q=K.e=0;ctl(1)}
// ---------- input: keyboard + on-screen buttons on touch devices ----------
if(!window.__zkVK){window.__zkVK=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyQ:'q',KeyE:'e',Enter:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isV())return;e.preventDefault();if(k==='q'){if(!e.repeat)K.q=1;return}if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='q'&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0})}
function ctl(on){let c=$z('vctl');if(c&&c.dataset.own!=='shielded'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='vctl';c.dataset.own='shielded';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='q'&&v)K.q=1;if(k==='e'&&v)K.e=1;K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('Q','q','shield'),mb('\uD83D\uDCAC','e','talk'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
// ---------- particles / floating text ----------
const spark=(x,y,c,n=10)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*220;V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.8,c,s:5,g:300})}};
const dust=n=>{for(let i=0;i<n;i++)V.vp.push({x:V.px+(Math.random()-.5)*40,y:V.py,vx:(Math.random()-.5)*140,vy:30+Math.random()*90,l:.45,c:'#cfd6e4',s:5,g:0})};
const say=(x,s)=>V.ft.push({x,y:255,s,l:3.2});
// ---------- physics ----------
function updatePlayer(dt){const live=V.st==='play'||V.st==='open',dir=live?K.r-K.l:V.auto,tv=dir*SPD;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);if(dir)V.face=dir;
 V.coy=V.gr?.1:V.coy-dt;V.buf-=dt;if(K.jp){V.buf=.12;K.jp=0}
 if(live&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;V.sq=-1;dust(8);AM.sfx('interaction')}
 if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;                                   // release early = short hop
 V.px+=V.vx*dt;checkPlatforms('x');const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;checkPlatforms('y',y0);
 if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.26;AM.sfx('step');if(Math.random()<.6)dust(1)}}
function checkPlatforms(axis,y0){
 if(axis==='x'){for(const [x,w,t] of SOL)if(V.py<t-2&&V.px+HW>x&&V.px-HW<x+w){V.px=V.vx>=0?x-HW:x+w+HW;V.vx=0}
  if(V.py<-2)V.px=Math.max(GAP[0]+HW,Math.min(GAP[1]-HW,V.px));
  const lim=V.st==='play'||V.st==='opening'||V.st==='proof'?GX-150:LW-.07*W_/U;V.px=Math.max(HW,Math.min(lim,V.px));return}
 let on=0;if(V.py<=0&&!(V.px-HW>=GAP[0]&&V.px+HW<=GAP[1])){V.py=0;on=1}
 for(const [x,w,t] of SOL.concat(FLT,brs()))if(V.vy<=0&&y0>=t-2&&V.py<=t&&V.px+HW>x&&V.px-HW<x+w){V.py=t;on=1}
 if(on){if(V.vy<-420){V.sq=1;dust(10);AM.sfx('step')}V.vy=0}V.gr=on}
const support=()=>{let s=0;for(const [x,w,t] of SOL.concat(FLT,brs()))if(V.px+HW>x&&V.px-HW<x+w&&t<=V.py+2&&t>s)s=t;return s};
function updateCamera(dt){const vw=W_/U,tg=V.px-vw*.42+V.face*60;V.cx+=(tg-V.cx)*(1-Math.exp(-5*dt));V.cx=Math.max(0,Math.min(LW-vw,V.cx))}
// Touching a claim only ARMS it. Reading it needs the shield up - the writing is unreadable in plain sight.
function collectClues(){
 for(let i=0;i<CLUES.length;i++){const c=CLUES[i];
  if(V.got[i]||V.st!=='play'||Math.hypot(V.px-c.x,V.py+HH*.5-c.y)>50)continue;
  V.got[i]=1;spark(c.x,c.y,'#fff',20);AM.sfx('card-reveal');V.msg={i:i+1,h:c.h,s:c.g+'   (raise the shield to read it)'};V.mt=5}}
function readClue(dt){
 for(let i=0;i<CLUES.length;i++){const c=CLUES[i];
  if(!V.got[i]||V.rd[i])continue;                                        // readable in any state, not just 'play'
  if(Math.hypot(V.px-c.x,V.py+HH*.5-c.y)>170)continue;
  if(V.dlg||V.dead)return;
  if(!V.shield){V.hintT=(V.hintT||0)+dt;if(V.hintT<1.4)return;V.hintT=0;V.msg={i:i+1,h:'ILLEGIBLE',s:'The mark is there but it will not resolve. Hold the shield up [Q] and it should.'};V.mt=3.4;return}
  V.rd[i]=1;V.n++;V.hintT=0;spark(c.x,c.y,'#4ee3f0',30);V.fly.push({x:X(c.x),y:Y(c.y),i,t:0});
  V.msg={i:i+1,h:c.h,s:c.s+(c.e?'  '+c.e:'')};V.mt=c.e?16:8;if(!reduce)wow=Math.max(wow,.7);AM.sfx('collectible');clueEvent(i);return}}
function commitDoor(k){if(V.att)return;openAtt(k);return}
function doCommit(k){
 if(V.n<3){V.cd=1.4;say((PORT[0]+PORT[1])/2,'Read all three marks first ('+V.n+'/3).');return}
 if(V.cd>0)return;V.cd=1.4;AM.sfx('interaction');
 if(k==='mid'){V.st='opening';V.gt=0;V.bs=0;V.quiet=1;V.en.st='dissolve';V.en.lock=1;V.bn={s:'THE PROOF TRAVELS. THE SECRET STAYS.',c:'#9ffcff',l:3};spark((PORT[0]+PORT[1])/2,120,'#fff',50);spark((PORT[0]+PORT[1])/2,120,'#4ee3f0',30);if(!reduce)wow=Math.max(wow,1.2);AM.sfx('core-activate');return}
 if(k===1){V.st='opening';V.gt=0;V.bs=0;V.quiet=1;V.en.st='dissolve';V.en.lock=1;V.bn={s:'SHIELDED PATH ACCEPTED',c:'#9ffcff',l:2.8};spark(PORT[1],110,'#fff',40);if(!reduce)wow=Math.max(wow,.9);AM.sfx('core-activate')}
 else{V.shk[0]=.7;V.vx=-420;V.vy=420;V.exp=2.2;V.flash=.8;V.wr++;V.bn={s:'TRANSACTION INFORMATION EXPOSED',c:'#ff8a5a',l:2};say(PORT[0],V.wr>1?'Hint: in the shielded half, no one can check you at all. Is that freedom or is that being invisible?':'You chose the open hand. Everyone can see exactly what you did.');AM.sfx('incorrect')}}
function checkGate(dt){V.cd-=dt;V.shk=V.shk.map(s=>Math.max(0,s-dt));
 if(V.st==='opening'){V.gt+=dt;if(!V.bs&&V.gt>.7){V.bs=1;spark(GX,200,'#fff',60);spark(GX,200,'#4ee3f0',30);V.flash=1;if(!reduce)wow=Math.max(wow,1.4);AM.sfx('core-activate')}   // beat of silence, then the gate fires
  if(V.gt>.7&&Math.random()<.7)spark(GX,40+Math.random()*320,'#fff',2);if(V.gt>2.3){V.st='open';V.bn={s:'GATE OPEN',c:'#fff',l:2}}}
 if(V.st==='open'&&V.px>=GX-40){V.st='done';V.auto=1;vFinish()}
 if(V.st==='done'&&V.px>=GX)V.auto=0;if(V.st!=='play'||V.cd>0)return;}
 // walking into a door does nothing any more - the choice must be made on purpose
 function vFinish(){if(S.done.shielded){fact('✓ ALREADY DISCOVERED');setTimeout(back,2800)}else complete()}
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;
 if(tx!==V.ltx&&tx>w*.99){back();return}                                                  // engine "leave" button
 updateJeff(dt);doorKey(dt);
if(V.dead)updateDeath(dt);else{if(V.st==='proof')updateProof(dt);updatePlayer(dt);collectClues();readClue(dt);checkGate(dt);if(V.st!=='proof')updateWarden(dt);updateBridge(dt);checkHazards()}
 updateCamera(dt);
 V.z=Math.max(0,Math.min(1,(V.px-(ZX-170))/340));const sd=V.px>ZX?1:0;if(sd!==V.side){V.side=sd;spark(ZX,150,sd?'#4ee3f0':'#fff',30);for(let i=0;i<40;i++)V.vp.push({x:ZX+(Math.random()-.5)*20,y:20+Math.random()*320,vx:(sd?1:-1)*(60+Math.random()*180),vy:(Math.random()-.5)*60,l:.9,c:i%2?'#4ee3f0':'#fff',s:5,g:0});
  V.flash=1;V.rip=.001;AM.sfx(sd?'portal':'interaction');say(ZX,sd?'SHIELD ON: transaction info is hidden.':'EXPOSED: everything is visible here.');if(!reduce)wow=Math.max(wow,.9)}
 V.sq+=(0-V.sq)*Math.min(1,dt*12);V.mt-=dt;V.flash=Math.max(0,V.flash-dt*2.2);if(V.rip>0){V.rip+=dt*1.2;if(V.rip>1.3)V.rip=0}V.hl=Math.max(0,V.hl-dt);if(V.red>0&&V.red<1)V.red=Math.min(1,V.red+dt*.8);V.exp=Math.max(0,V.exp-dt);V.hint-=dt;if(V.bn&&(V.bn.l-=dt)<=0)V.bn=null;if(V.mt<=0&&V.next){V.next=0;V.msg={i:0,h:'GATE UNLOCKED',s:'Run to the end of the valley and choose the path that protects transaction information.'};V.mt=5}
 V.vp=V.vp.filter(q=>(q.l-=dt)>0);V.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});V.ft=V.ft.filter(f=>(f.l-=dt)>0);V.fly=V.fly.filter(f=>(f.t+=dt/.8)<1);
 if(V.st==='done'&&!V.hid){V.hid=1;ctl(0)}
 ax=X(V.px);tx=V.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}       // keep the engine's own walker idle
// ---------- drawing ----------
function icon(k,x,y,s,c){g2.strokeStyle=c;g2.lineWidth=Math.max(2,s*.16);g2.beginPath();
 if(k==='eye'){g2.ellipse(x,y,s,s*.55,0,0,7);g2.stroke();ci(x,y,s*.28,c);return}
 if(k==='shield'){g2.moveTo(x-s*.7,y-s*.8);g2.lineTo(x+s*.7,y-s*.8);g2.lineTo(x+s*.7,y+s*.1);g2.quadraticCurveTo(x+s*.7,y+s*.9,x,y+s*1.1);g2.quadraticCurveTo(x-s*.7,y+s*.9,x-s*.7,y+s*.1);g2.closePath();g2.stroke();return}
 g2.moveTo(x,y-s);g2.lineTo(x+s,y);g2.lineTo(x,y+s);g2.lineTo(x-s,y);g2.closePath();g2.stroke();ci(x,y,s*.25,c)}
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
function bubble(s,x,y,col,mw,al){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4,bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12,bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;
 g2.save();g2.globalAlpha=al==null?1:al;rc(bx,by,bw,bh,'#05060fe8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}
// ---- VISUAL POLISH (render-only) ----
const Zp=window.ZKP;
const sWorld=f=>{g2.save();g2.translate(-V.cx*U,GY);g2.scale(U,U);f();g2.restore()};   // world units, y down from the ground line

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
function sRim(p,t){if(!Zp)return;const z=V.z,vw=W_/U;   // rim light on the stepped hills + low mist, tinted by the current zone
 [[.22,300,0,'#3b6a78','#0a1830'],[.42,190,2,'#2f5a60','#0e2638']].forEach(([par,base,ph,a,b],L)=>{const col=mixc(mixc(a,b,z),p.se,.15),hi=mixc(col,z>.5?p.pr:'#ffffff',.4);g2.globalAlpha=.5-.1*L;g2.fillStyle=hi;
  for(let sx=-48;sx<vw+48;sx+=24){const wx=sx+V.cx*par,hg_=Math.round((base+60*Math.sin(wx*.0042+ph)+36*Math.sin(wx*.0113+ph*2))/12)*12;g2.fillRect(sx*U,GY-hg_*U,25*U,2*U)}g2.globalAlpha=1});
 const mc=mixc('#cfe8e0',p.pr,z);for(let k=0;k<5;k++){g2.globalAlpha=(.045-.006*k)*(1+.3*Math.sin(t*.4+k));g2.fillStyle=mc;g2.fillRect(0,GY-(34+k*16)*U,W_,16*U)}g2.globalAlpha=1}
function sTowers(p,t){if(!Zp)return;const z=V.z;
 for(let bx=940,i=0;bx<2440;bx+=260,i++){const sx=X(bx);if(sx<-300||sx>W_+300)continue;const bw=120+(i%3)*30,bh=190+(i%4)*45,w=bw*U,top=Y(bh);   // glass towers: mullions, roof mast, plinth light
  g2.globalAlpha=(.18)*(1-z*.7);g2.strokeStyle='#e8f6ff';g2.lineWidth=1;g2.beginPath();for(let k=1;k<bw/30;k++){g2.moveTo(sx+k*30*U,top);g2.lineTo(sx+k*30*U,top+bh*U)}g2.stroke();
  g2.globalAlpha=.7*(1-z*.6);g2.strokeStyle='#ffffffcc';g2.lineWidth=2*U;g2.beginPath();g2.moveTo(sx+w/2,top);g2.lineTo(sx+w/2,top-26*U);g2.stroke();g2.fillStyle=Math.sin(t*2+i)>0?'#ff6a3d':'#4a2a22';g2.fillRect(sx+w/2-2*U,top-30*U,4*U,4*U);
  g2.globalAlpha=.5*(1-z*.6);g2.fillStyle='#ffffff';g2.fillRect(sx-3*U,Y(0)-4*U,w+6*U,4*U);g2.globalAlpha=1}
 for(let bx=2780,i=0;bx<5000;bx+=300,i++){const sx=X(bx);if(sx<-300||sx>W_+300)continue;g2.strokeStyle=p.pr;g2.lineWidth=1.5;g2.globalAlpha=.16+.08*Math.sin(t*2+i+1);g2.beginPath();g2.arc(sx,Y(0),122*U,Math.PI,0);g2.stroke();g2.globalAlpha=.18;g2.beginPath();g2.arc(sx,Y(0),150*U+6*U,Math.PI*1.04,Math.PI*1.96);g2.setLineDash([3*U,9*U]);g2.lineDashOffset=-t*8;g2.stroke();g2.setLineDash([]);Zp.glow(g2,sx,Y(0),170*U,26*U,p.pr,.2);g2.globalAlpha=1}}   // dome rings + base glow
function sGround(p,t){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60,gz=Math.min(x1,ZX);
 sWorld(()=>{if(x0<ZX){const l=x0,r=gz;[[22,.5],[56,.4],[100,.34]].forEach(([d,al])=>{g2.globalAlpha=al;g2.fillStyle='#0d1219';g2.fillRect(l,d,r-l,1.8)});Zp.grit(g2,l,r,10,(H_-GY)/U,26,'#2e3a45',.7,5,3,.32);
   g2.strokeStyle=mixc('#8ad08a',p.ac,.15);g2.lineWidth=1.4;g2.globalAlpha=.85;g2.beginPath();for(let wx=Math.ceil(l/15)*15;wx<r;wx+=15){const h=4+Zp.hash(wx*.37)*9,sw=Math.sin(t*1.3+wx*.08)*2.4;g2.moveTo(wx,0);g2.quadraticCurveTo(wx+sw*.4,-h*.6,wx+sw,-h)}g2.stroke();
   for(let wx=Math.ceil(l/60)*60;wx<r;wx+=60){if(Zp.hash(wx*.13)>.55){g2.globalAlpha=.9;g2.fillStyle=Zp.hash(wx)>.5?'#fff3a0':p.ac;const h=7+Zp.hash(wx*.7)*6;g2.fillRect(wx+Math.sin(t*1.3+wx*.08)*2.4*.8,-h-1,2.4,2.4)}}g2.globalAlpha=1}
  if(x1>ZX){const l=Math.max(x0,ZX),r=x1;[[24,.5],[62,.4]].forEach(([d,al])=>{g2.globalAlpha=al;g2.fillStyle='#04060f';g2.fillRect(l,d,r-l,1.8)});Zp.grit(g2,l,r,10,(H_-GY)/U,28,p.pr,.18,8,2,.3);   // shielded ground: dark, with faint circuit traces
   g2.strokeStyle=p.pr;g2.lineWidth=1.2;g2.globalAlpha=.3;g2.beginPath();g2.moveTo(l,13);g2.lineTo(r,13);for(let wx=Math.ceil(l/44)*44;wx<r;wx+=44){g2.moveTo(wx,13);g2.lineTo(wx,13+8+Zp.hash(wx)*18)}g2.stroke();g2.fillStyle=p.pr;for(let wx=Math.ceil(l/44)*44;wx<r;wx+=44){g2.globalAlpha=.25+.3*Math.abs(Math.sin(t*1.6+wx*.05));g2.fillRect(wx-1.5,12,3,3)}g2.globalAlpha=1}
  g2.globalAlpha=.55;g2.fillStyle='#ffffff';g2.fillRect(x0,0,Math.min(x1,ZX)-x0,1.2);g2.globalAlpha=1;
  SOL.forEach(([x,w,tp])=>{if(x+w<x0||x>x1)return;Zp.edge(g2,x,-tp,w,tp,'#ffffff','#000',.2,1.5)});FLT.forEach(([x,w,tp])=>{if(x+w<x0||x>x1)return;Zp.edge(g2,x,-tp,w,18,'#ffffff','#000',.22,1.5)})})}
function sMotes(p){if(!Zp)return;const z=V.z,sz=Math.max(1.5,2*U);if(z<.95)Zp.motes(g2,0,0,W_,GY,T,24,'#f4ffd8',{alpha:.38*(1-z),size:sz,speed:8,seed:2});if(z>.05)Zp.motes(g2,0,0,W_,GY,T,24,p.pr,{alpha:.45*z,size:sz,speed:6,seed:7,dir:-1})}
function drawTree(x,s,p){const sx=X(x);if(sx<-90*U||sx>W_+90*U)return;const sh=x>ZX,c=mixc(sh?'#1d4b55':'#4f8f6b',p.se,.12),c2=mixc(c,sh?p.pr:'#d8ffe0',.25);
 rr(x-4*s,36*s,8*s,36*s,'#2b1d14');for(let i=0;i<3;i++)for(let r=0;r<5;r++){const w=(66-i*12)*(1-r*.17)*s;rr(x-w/2,(34+i*26+(r+1)*7)*s,w,7*s,r%2?c:c2)}}
function drawBackground(p,t){const z=V.z,vw=W_/U;
 [[.22,300,0,'#3b6a78','#0a1830'],[.42,190,2,'#2f5a60','#0e2638']].forEach(([par,base,ph,a,b])=>{const col=mixc(mixc(a,b,z),p.se,.15);
  for(let sx=-48;sx<vw+48;sx+=24){const wx=sx+V.cx*par,hg_=Math.round((base+60*Math.sin(wx*.0042+ph)+36*Math.sin(wx*.0113+ph*2))/12)*12;rc(sx*U,GY-hg_*U,25*U,hg_*U+4,col)}});
 sRim(p,t);TREES.forEach(([x,s])=>drawTree(x,s,p));drawZoneProps(p,t);sTowers(p,t)}
function drawZoneProps(p,t){g2.textAlign='left';
 for(let bx=940,i=0;bx<2440;bx+=260,i++){const sx=X(bx);if(sx<-300||sx>W_+300)continue;const bw=120+(i%3)*30,bh=190+(i%4)*45;   // glass towers: every ledger row is readable
  g2.strokeStyle='#ffffffaa';g2.lineWidth=2;g2.strokeRect(sx,Y(bh),bw*U,bh*U);g2.globalAlpha=.07;rr(bx,bh,bw,bh,'#fff');g2.globalAlpha=.55;for(let r=0;r<bh/38;r++)rr(bx+10,bh-14-r*38,bw-20,5,'#e8f6ff');g2.globalAlpha=1}
 for(let bx=2780,i=0;bx<5000;bx+=300,i++){const sx=X(bx);if(sx<-300||sx>W_+300)continue;g2.strokeStyle=p.pr;g2.lineWidth=3;g2.globalAlpha=.22+.1*Math.sin(t*2+i);g2.beginPath();g2.arc(sx,Y(0),150*U,Math.PI,0);g2.stroke();g2.globalAlpha=.05;g2.fillStyle=p.pr;g2.fill();g2.globalAlpha=1}
 g2.font=MONO(11);for(let i=0;i<8;i++){const sh=i>=4,x=(sh?2700+(i-4)*500:980+i*340)+Math.sin(t+i)*20,y=70+(i*53)%230,sx=X(x);if(sx<-200||sx>W_+200)continue;   // data tags: readable here, redacted there
  const s=sh?'████ → ███':'zs1…'+(i*811%1000)+' → '+(i*37%90)+' ZEC',w=g2.measureText(s).width+12;g2.globalAlpha=.8*(sh?.4+.6*V.z:1-V.z*.85);rc(sx,Y(y),w,18*U+4,sh?'#0a0f26':'#0b0e22');g2.fillStyle=sh?p.pr:'#fff';g2.fillText(s,sx+6,Y(y)+13*U);g2.globalAlpha=1}
 [1000,1700,2250].forEach((x,i)=>{const sx=X(x),sy=Y(330);if(sx<-200||sx>W_+200)return;const ew=Math.max(3,22*(1-V.z*.9));rr(x-26,340-(22-ew)/2,52,ew,'#fff');rr(x-10,340-(22-ew)/2,20,ew,V.hl>0?'#ff6a3d':'#0b0e22');                                                // watching eyes
  if(Math.abs(V.px-x)<520&&V.z<.6){g2.globalAlpha=.1*(1-V.z)*(1+3*Math.min(1,V.hl));g2.fillStyle='#fff';g2.beginPath();g2.moveTo(sx,Y(330));g2.lineTo(X(V.px)-20*U,Y(V.py));g2.lineTo(X(V.px)+20*U,Y(V.py+HH));g2.fill();g2.globalAlpha=1}})}
function drawPlatforms(p,t){const soil=x=>x>ZX?'#0d1226':'#1c2530',gr=x=>mixc(x>ZX?p.pr:'#8ad08a',p.ac,.15),zx=X(ZX);
 rc(0,GY,Math.min(W_,zx),H_-GY,soil(0));rc(0,GY,Math.min(W_,zx),6*U,gr(0));if(zx<W_){rc(Math.max(0,zx),GY,W_,H_-GY,soil(ZX+1));rc(Math.max(0,zx),GY,W_,6*U,gr(ZX+1))}
 SOL.forEach(([x,w,tp])=>{rr(x,tp,w,tp,soil(x));for(let r=1;r<tp/24;r++)rr(x,tp-r*24,w,2,'#ffffff10');rr(x,tp,w,7,gr(x));rr(x,tp,6,tp,'#ffffff12')});
 FLT.forEach(([x,w,tp])=>{rr(x,tp,w,18,soil(x));rr(x,tp,w,6,gr(x));for(let i=0;i<w/30;i++)rr(x+8+i*30,tp-18,8,10+((i*7)%3)*6,soil(x))})}
function drawNpc(x,kind,txt,p){const sx=X(x);if(sx<-120||sx>W_+120)return;const c=kind==='g'?p.pr:'#e8f6ff';rr(x-5,110,10,110,'#3a2a1c');rr(x-36,200,72,56,'#0b0e22');g2.strokeStyle=c;g2.lineWidth=2;g2.strokeRect(X(x-36),Y(200),72*U,56*U);icon(kind==='g'?'shield':'eye',sx,Y(172),16*U,c);
 if(Math.abs(V.px-x)<260)bubble(txt,sx,Y(262),c,230*U)}
function drawMembrane(p,t){const sx=X(ZX),R=170*U;if(sx<-R*2||sx>W_+R*2)return;g2.save();g2.beginPath();g2.moveTo(sx-R,Y(0));g2.lineTo(sx-R,Y(300));g2.arc(sx,Y(300),R,Math.PI,0);g2.lineTo(sx+R,Y(0));
 g2.globalAlpha=.1+.08*Math.sin(t*2);g2.fillStyle=p.pr;g2.fill();g2.globalAlpha=1;g2.shadowColor=p.pr;g2.shadowBlur=30;g2.strokeStyle=p.pr;g2.lineWidth=7*U;g2.stroke();g2.restore();
 for(let i=0;i<9;i++){g2.globalAlpha=.12+.12*Math.sin(t*3+i);rc(sx-R+(i+.5)*R*2/9,Y(300),3*U,300*U,p.pr)}g2.globalAlpha=1;if(V.rip>0){g2.globalAlpha=Math.max(0,1-V.rip/1.3)*.7;g2.strokeStyle=p.pr;g2.lineWidth=4*U;g2.beginPath();g2.arc(sx,Y(150),V.rip*320*U,0,7);g2.stroke();g2.globalAlpha=1}tx_('SHIELD GATE',sx,Y(500),p.pr,MONO(14))}
function drawPortals(p,t){const ok=V.n>=3,fs=MONO(13),all=V.rd.every(v=>v);const HIT=[];
 // the two doors are the two loud claims. The middle one only appears once you have heard all three.
 if(all){const mx=X((PORT[0]+PORT[1])/2);if(mx>-160&&mx<W_+160){const c='#9ffcff';
  g2.save();g2.shadowColor=c;g2.shadowBlur=26;g2.strokeStyle=c;g2.lineWidth=5*U;g2.strokeRect(mx-52*U,Y(230),104*U,230*U);
  g2.globalAlpha=.16+.08*Math.sin(t*3);g2.fillStyle=c;g2.fillRect(mx-52*U,Y(230),104*U,230*U);g2.globalAlpha=1;
  icon('proof',mx,Y(140),24*U,c);tx_('PROVE IT',mx,Y(252),c,fs);
  tx_(ok?'[E] COMMIT':'READ ALL THREE FIRST',mx,Y(300),ok?'#9ffcff':'#6a7084',MONO(12));g2.restore();
  if(ok)HIT.push({k:'mid',x:mx-52*U,y:Y(230),w:104*U,h:230*U})}}
 PORT.forEach((x,i)=>{const sx=X(x);if(sx<-150||sx>W_+150)return;const sh=V.shk[i],col=i?p.pr:'#e8f6ff',c=ok?col:'#4a4f68',op=V.st!=='play'&&i===1;g2.save();g2.translate(Math.sin(t*60)*sh*14*U,0);
  g2.shadowColor=c;g2.shadowBlur=ok?24:0;g2.strokeStyle=c;g2.lineWidth=5*U;g2.strokeRect(sx-48*U,Y(210),96*U,210*U);g2.shadowBlur=0;
  g2.globalAlpha=(ok?.18+.1*Math.sin(t*3+i):.06)+(op?.3:0)+(sh>0?.25:0);rr(x-48,210,96,210,sh>0?'#ff5a5a':col);g2.globalAlpha=1;icon(i?'shield':'eye',sx,Y(120),22*U,c);tx_(i?'SHOW NOTHING':'SHOW EVERYTHING',sx,Y(228),c,fs);
  if(ok)tx_('[E] COMMIT',sx,Y(300),c,MONO(12));g2.restore();
  if(ok)HIT.push({k:i,x:sx-48*U,y:Y(210),w:96*U,h:210*U})});
 V.doorHit=HIT;
 tx_(all?'THREE ANSWERS. WHICH ONE IS THIS VALLEY ASKING FOR?':'WHICH WAY DO YOU TRUST?',X((PORT[0]+PORT[1])/2),Y(320),'#fff',MONO(13))}
// The choice is deliberate: stand near a door and press E (or click it / tap it). No walking into it.
function doorKey(dt){
 if(!V.doorHit||!V.doorHit.length)return;
 const mx=X(V.px);                                        // same screen space the doors are drawn in
 let near=null;
 for(const d of V.doorHit)if(mx>=d.x&&mx<=d.x+d.w){near=d;break}
 V.doorNear=near;
 if(V.att){if(K.e){K.e=0;return}}
 if(K.e){K.e=0;if(V.att)return;if(near)commitDoor(near.k)}}
addEventListener('keydown',e=>{if(!isV())return;if(e.code==='Escape'&&V.att){V.att=null;e.preventDefault()}},true);
addEventListener('pointerdown',e=>{if(!isV()||!V.att)return;if(e.target!==g2.canvas)return;
 const r=g2.canvas.getBoundingClientRect(),mx=(e.clientX-r.left)/r.width*W_,my=(e.clientY-r.top)/r.height*H_;
 const pw=Math.min(W_-40,440),ph=Math.min(H_-80,330),R={x:(W_-pw)/2,y:(H_-ph)/2,w:pw,h:ph};
 const cell=74,ox=R.x+R.w/2-cell*1.5,oy=R.y+90;
 for(let i=0;i<9;i++){const c=i%3,r=(i/3)|0,x=ox+c*cell,y=oy+r*cell;
  if(mx>=x+8&&mx<=x+cell-8&&my>=y+8&&my<=y+cell-8){attFlip(i);return}}},true);
addEventListener('pointerdown',e=>{if(!isV()||V.dead||V.st!=='play')return;if(e.target!==g2.canvas)return;
 if(!V.doorHit||!V.doorHit.length)return;
 const r=g2.canvas.getBoundingClientRect(),mx=(e.clientX-r.left)/r.width*g2.canvas.width,my=(e.clientY-r.top)/r.height*g2.canvas.height;
 for(const d of V.doorHit)if(mx>=d.x&&mx<=d.x+d.w&&my>=d.y&&my<=d.y+d.h){commitDoor(d.k);return}},true);
function drawGate(p,t){const sx=X(GX);if(sx<-300||sx>W_+300)return;const o=V.st==='play'?0:Math.max(0,Math.min(1,(V.gt-.7)/1.4));
 if(o>0){const g=g2.createRadialGradient(sx,Y(170),0,sx,Y(170),380*U);g.addColorStop(0,'#ffffffcc');g.addColorStop(.4,p.pr+'66');g.addColorStop(1,p.pr+'00');g2.fillStyle=g;g2.globalAlpha=o;g2.fillRect(sx-400*U,Y(560),800*U,600*U);g2.globalAlpha=.9*o;rr(GX-100,360,200,360,'#eaffff');g2.globalAlpha=1}
 [[-100-o*95,'#0d1020'],[o*95,'#0d1020']].forEach(([d,c])=>{rr(GX+d,360,100,360,c);g2.strokeStyle=p.pr;g2.lineWidth=3;g2.strokeRect(X(GX+d),Y(360),100*U,360*U)});
 if(o<1){g2.globalAlpha=1-o;icon('shield',sx,Y(180),30*U,p.pr);g2.globalAlpha=1}
 rr(GX-150,420,50,420,'#161a30');rr(GX+100,420,50,420,'#161a30');rr(GX-160,440,320,50,'#1d2240');g2.shadowColor=p.pr;g2.shadowBlur=20;g2.strokeStyle=p.pr;g2.lineWidth=3;g2.strokeRect(X(GX-160),Y(440),320*U,50*U);g2.shadowBlur=0;icon('shield',sx,Y(412),14*U,p.pr)}
function drawClue(c,i,t,p){if(V.got[i])return;const sx=X(c.x),sy=Y(c.y+Math.sin(t*3+i)*7),s=20*U,col=[p.ac,p.pr,p.se][i],g=g2.createRadialGradient(sx,sy,0,sx,sy,s*2.6);g.addColorStop(0,col+'88');g.addColorStop(1,col+'00');g2.fillStyle=g;g2.fillRect(sx-s*3,sy-s*3,s*6,s*6);
 g2.shadowColor=col;g2.shadowBlur=18;icon(c.k,sx,sy,s,'#fff');g2.shadowBlur=0;ci(sx+Math.cos(t*2+i)*s*1.6,sy+Math.sin(t*2+i)*s*1.6,3,col)}
function drawAtmosphere(){const z=V.z;if(z<1){g2.globalAlpha=.16*(1-z);const g=g2.createLinearGradient(0,0,0,GY);g.addColorStop(0,'#fff6c8');g.addColorStop(1,'#ffffff00');g2.fillStyle=g;g2.fillRect(-60,-60,W_+120,GY+60);g2.globalAlpha=1}
 if(z>0){g2.globalAlpha=.36*z;rc(-60,-60,W_+120,H_+120,'#0a0630');g2.globalAlpha=1}
 if(V.flash>0){g2.globalAlpha=V.flash*.35;rc(-60,-60,W_+120,H_+120,V.side?'#bffcff':'#ffffff');g2.globalAlpha=1}
 if(V.exp>0){g2.globalAlpha=Math.min(.25,V.exp*.15);rc(-60,-60,W_+120,H_+120,'#ff6a3d');g2.globalAlpha=1}}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width)||(V.dead&&V.dead.t>.25))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0,wS=1+.22*V.sq-idle,hS=1-.22*V.sq+idle,sup=support();
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(sup)+3,aw*.38*(1-Math.min(.5,(V.py-sup)/300)),5*U,0,0,7);g2.fill();
 const g=g2.createRadialGradient(sx,sy-ph/2,0,sx,sy-ph/2,ph*1.2);g.addColorStop(0,p.pr+'55');g.addColorStop(1,p.pr+'00');g2.fillStyle=g;g2.fillRect(sx-ph*1.3,sy-ph*1.7,ph*2.6,ph*2.4);
 g2.save();g2.shadowColor=p.pr;g2.shadowBlur=22;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(V.face<0?-wS:wS,hS);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 if(V.z>.3){g2.globalAlpha=Math.min(1,V.z);g2.strokeStyle=p.pr;g2.lineWidth=(3+4*Math.max(V.red,V.quiet))*U;g2.shadowColor=p.pr;g2.shadowBlur=14+14*Math.max(V.red,V.quiet);g2.beginPath();g2.arc(sx,sy-ph/2,ph*.78,0,7);g2.stroke();g2.shadowBlur=0;g2.globalAlpha=.07*V.z;g2.fillStyle=p.pr;g2.fill();g2.globalAlpha=1}   // protected
 g2.font=MONO(11);[[1-V.z,'zs1…a7 → 5 ZEC','#fff'],[V.z,'████ → ███',p.pr]].forEach(([a,s,c])=>{if(a<.05)return;const w=g2.measureText(s).width+12;g2.globalAlpha=a*.9;rc(sx-w/2,sy-ph-26*U,w,18*U+4,'#05060fdd');g2.fillStyle=c;g2.textAlign='center';g2.fillText(s,sx,sy-ph-26*U+13*U);g2.globalAlpha=1})}
function drawHud(p){const cs=[p.ac,p.pr,p.se];rc(14,14,128,46,'#05060fcc');g2.strokeStyle=p.pr;g2.lineWidth=2;g2.strokeRect(14,14,128,46);
 CLUES.forEach((c,i)=>{const flying=V.fly.some(f=>f.i===i),x=34+i*38;
  if(V.rd[i]&&!flying)icon(c.k,x,37,9,cs[i]);                       // read: lit
  else if(V.got[i]&&!flying){g2.globalAlpha=.5+.3*Math.sin(T*3+i);icon(c.k,x,37,8,'#8a867c');g2.globalAlpha=1}   // found but not read yet: dim outline
  else icon(c.k,x,37,9,'#3a3d55')});
 V.fly.forEach(f=>{const e=f.t*f.t*(3-2*f.t);icon(CLUES[f.i].k,f.x+(34+f.i*38-f.x)*e,f.y+(37-f.y)*e,(20-11*e)*U+2,'#fff')});
 g2.textAlign='right';g2.font=MONO(12);g2.fillStyle=V.z<.5?'#fff':p.pr;g2.fillText(V.z<.5?'TRANSPARENT ZONE · EXPOSED':'SHIELDED ZONE · PROTECTED',W_-16,34);
 if(V.msg&&V.mt>0)bubble((V.msg.i?'CLUE '+V.msg.i+'/3 · ':'')+V.msg.h+' — '+V.msg.s,W_/2,H_*.27,p.pr,Math.min(520,W_*.8),Math.min(1,V.mt));drawOverlays(p)}
// ======== v3: PROOF WARDEN hunter · ZK proof set piece · shield bridge · failure · final-choice drama ========
// Everything below keeps its state in V (V.en warden, V.pf proof, V.br bridge, V.dead failure).
const brs=()=>{const a=[],k=Math.min(BN,Math.floor(V.br.t*BN)),w=(GAP[1]-GAP[0])/BN;for(let i=0;i<k;i++)a.push([GAP[0]+i*w,w,0]);return a};   // solid bridge tiles (one-way, at ground level)
const groundAt=x=>{let g=0;for(const [sx,w,t] of SOL)if(x>sx&&x<sx+w&&t>g)g=t;return g};
// ---- PROOF WARDEN: patrol -> notice -> chase -> lose | stun | dissolve. Privacy (V.z) weakens its lock. ----
// ---------- shield (Q) + Jeff ----------
function toggleShield(){if(V.st!=='play'||V.dlg)return;V.shield=V.shield?0:1;AM.sfx('interaction');
 if(V.shield){spark(V.px,V.py+60,'#fff',14);if(!reduce)wow=Math.max(wow,.25)}}
const JEFF_AFTER=[['Still here. Still chill.',3.5],
 ['Press Q any time. I am not going anywhere.',4],
 ['Three marks, three answers, and none of them lying. Odd, that.',5],
 ['The middle door only shows up once you have read all three. Watch what it says on top.',6],
 ['Each door wants a pattern before it opens. Same deal as the marks. Shield up or you are guessing.',6],
  ['Quick recap. Transparent: everyone sees. Shielded: nobody sees, but the network verifies. That is the whole trick.',6.5],
  ['Shielded transactions got fast and light with the Sapling upgrade in 2018. Before that they were slow and heavy.',6.5]];
function jeffTalk(){if(V.dead||V.dlg)return;const st=V.jeffStage||0;V.dlg={L:st>=JEFF.length?JEFF_AFTER:JEFF,i:0,c:0};if(st<JEFF.length)V.jeffStage=st+1;AM.sfx('interaction')}
function jeffAdvance(){const d=V.dlg;if(!d)return;if(d.c<d.L[d.i][0].length){d.c=999;return}AM.sfx('interaction');if(++d.i>=d.L.length)V.dlg=null;else d.c=0}
function updateJeff(dt){
 if(V.dlg&&V.dlg.c<V.dlg.L[V.dlg.i][0].length)V.dlg.c+=dt*46;
 V.jeffNear=Math.abs(V.px-JF.x)<160&&Math.abs(V.py)<180&&V.st==='play'&&!V.dead&&!V.dlg;
 if(V.jeffNear&&!V.jeffMet){V.jeffMet=1;jeffTalk()}   // first approach: Jeff greets you on his own, so the lesson cannot be walked past
 if(K.e){if(V.dlg){K.e=0;jeffAdvance()}else if(V.jeffNear){K.e=0;jeffTalk()}}   // E only goes to Jeff when he is actually in range
 if(K.q){K.q=0;toggleShield()}}
function drawShield(p){if(!V.shield)return;const sx=X(V.px),sy=Y(V.py+HH*.5),r=36*U;
 g2.save();g2.globalAlpha=.55;g2.strokeStyle=p.se;g2.lineWidth=2.5;g2.beginPath();g2.arc(sx,sy,r+Math.sin(T*3)*2*U,0,7);g2.stroke();
 g2.globalAlpha=.2;g2.fillStyle=p.se;g2.fill();g2.restore()}
function drawJeff(p,t){const sx=X(JF.x);if(sx<-120||sx>W_+120||!NPC_IMG||!NPC_IMG.width)return;
 const sy=Y(JF.y),h=PH*U*1.1,w=h*NPC_IMG.width/NPC_IMG.height,bob=Math.sin(t*2.2)*4*U;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,sy+3,w*.4,5*U,0,0,7);g2.fill();
 const g=g2.createRadialGradient(sx,sy+60,0,sx,sy+60,h*1.2);g.addColorStop(0,NPC_PAL[0]+'55');g.addColorStop(1,NPC_PAL[0]+'00');g2.fillStyle=g;g2.fillRect(sx-h*1.3,sy+60-h*1.3,h*2.6,h*2.6);
 g2.save();g2.shadowColor=NPC_PAL[0];g2.shadowBlur=16;g2.imageSmoothingEnabled=false;g2.translate(sx,sy-bob);g2.scale(V.px<JF.x?-1:1,1);g2.drawImage(NPC_IMG,-w/2,-h,w,h);g2.restore();
 tx_('Jeff',sx,sy-h-16,NPC_PAL[0],MONO(12));
 if(V.jeffNear&&!V.dlg)tx_(coarse?'💬 TALK':'[E] TALK',sx,sy-h-34,'#e8f6ff',MONO(12))}
// dialogue box: same look and typing rhythm as Origin
function drawDlg(){
 if(!V.dlg)return;const d=V.dlg,mw=Math.min(W_-24,640),bx=(W_-mw)/2,bh=Math.round(Math.max(120,H_*.2)),by=H_-bh-(coarse?90:24);
 rc(bx,by,mw,bh,'#05060ff2');g2.strokeStyle='#4ee3f0';g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);
 if(NPC_IMG&&NPC_IMG.width){g2.imageSmoothingEnabled=false;g2.drawImage(NPC_IMG,bx+10,by+10,64,64)}
 g2.textAlign='left';g2.fillStyle=NPC_PAL[0];g2.font=MONO(13);g2.fillText('Jeff',bx+84,by+28);
 g2.fillStyle='#ece8df';g2.font=MONO(15);wrap(d.L[d.i][0].slice(0,Math.floor(d.c)),mw-100).forEach((l,i)=>g2.fillText(l,bx+84,by+54+i*22));
 g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?'TAP TO CONTINUE':'[E] / CLICK',bx+mw-12,by+bh-10)}
function updateWarden(dt){const e=V.en,dx=V.px-e.x,adx=Math.abs(dx);e.t+=dt;e.cool-=dt;e.ph+=dt*(e.st==='chase'?6:e.st==='notice'?0:2.2);
 if(e.st==='dissolve'){e.lock=Math.max(0,e.lock-dt);if(Math.random()<.5)V.vp.push({x:e.x+(Math.random()-.5)*40,y:e.y+(Math.random()-.5)*40,vx:0,vy:30,l:.6,c:'#ffb347',s:4,g:0});return}
 e.lock+=((e.st==='chase'||e.st==='notice'?1-V.z:0)-e.lock)*Math.min(1,dt*3);                      // tracking strength: strong when exposed, fading as you cross into the shield
 let v=0;
 if(e.st==='patrol'){v=70*e.fd;if(e.x>WARD.b)e.fd=-1;if(e.x<WARD.a)e.fd=1;
  if(e.cool<=0&&adx<400&&Math.abs(V.py+50-e.y)<260&&V.z<.4&&V.st==='play'){e.st='notice';e.t=0;e.lock=0;e.arm=0;V.flash=.25;AM.sfx('interaction')}}
 else if(e.st==='notice'){if(e.t>1){e.st='chase';e.t=0;e.arm=1;AM.sfx('impact')}}              // eye flash + fragments snap into line before it moves
 else if(e.st==='chase'){v=Math.sign(dx)*195*(1-.85*V.z);if(adx<8)v=0;e.fd=dx>=0?1:-1;
  if(adx>850||(V.z>.75&&e.lock<.08)){e.st='lose';e.t=0;e.cool=3.5;AM.sfx('rise')}}                // too far / lock lost: gives up
 else if(e.st==='lose'){if(e.t>2.2){e.st='patrol';e.t=0;e.fd=e.x<(WARD.a+WARD.b)/2?1:-1}}
 else if(e.st==='stun'){if(e.t>1.6){e.st='patrol';e.cool=2;e.t=0}}
 e.x=Math.max(WARD.a-250,Math.min(ZX-170,e.x+v*dt));                                           // it cannot cross the shield membrane
 const g=groundAt(e.x),hy=g+52+(e.st==='chase'&&V.gr?Math.max(0,Math.min(110,V.py+30-g)):0)+Math.sin(e.ph)*5;   // flies over cliffs, rises toward you
 e.y=e.st==='stun'?Math.max(g+20,e.y-120*dt):e.y+(hy-e.y)*Math.min(1,dt*4);
 if((v||e.st==='stun')&&Math.random()<(e.st==='chase'?.6:.2))V.vp.push({x:e.x-e.fd*20,y:e.y+(Math.random()-.5)*24,vx:-e.fd*20,vy:0,l:.5,c:'#ffb347',s:4,g:0});   // block trail
 if(e.arm&&e.st==='chase'&&V.st==='play'&&V.z<.5&&Math.abs(V.px-e.x)<32&&V.py+HH>e.y-26&&V.py<e.y+34){
  if(V.vy<0&&V.py>e.y-4){V.vy=700;V.gr=0;e.st='stun';e.t=0;spark(e.x,e.y,'#ffb347',20);AM.sfx('impact')}   // jump on its head to stun it
  else if(V.shield){V.red=1;spark(V.px,V.py+60,'#4ee3f0',18);V.shk=[1,0];AM.sfx('incorrect')}                // shield up: shoved back, not killed
  else shieldedDeath('SIGNAL LOST')}}
function drawWarden(p,t){const e=V.en,sx=X(e.x),sy=Y(e.y),u=U;if(sx<-120||sx>W_+120)return;const ch=e.st==='chase',nt=e.st==='notice',a=e.st==='dissolve'?e.lock:1,col=ch?'#ff6a3d':'#ffb347';if(a<=0)return;
 g2.save();g2.globalAlpha=a;const gl=g2.createRadialGradient(sx,sy,0,sx,sy,70*u);gl.addColorStop(0,col+(ch?'88':'44'));gl.addColorStop(1,col+'00');g2.fillStyle=gl;g2.fillRect(sx-70*u,sy-70*u,140*u,140*u);
 for(let k=0;k<5;k++){const q=nt?k*1.2566:e.ph*(ch?2.4:.8)+k*1.2566,r=(nt?38:42+4*Math.sin(t*3+k))*u;g2.save();g2.translate(sx+Math.cos(q)*r,sy+Math.sin(q)*r*.7);g2.rotate(q*2);g2.fillStyle=k%2?col:'#e8f6ff';g2.fillRect(-4*u,-4*u,8*u,8*u);g2.restore()}   // proof fragments
 g2.fillStyle='#120f24';g2.strokeStyle=col;g2.lineWidth=3*u;g2.beginPath();[[0,-30],[22,-14],[22,10],[0,30],[-22,10],[-22,-14]].forEach(([x,y],i)=>g2[i?'lineTo':'moveTo'](sx+x*u,sy+y*u));g2.closePath();g2.fill();g2.stroke();   // angular shield head
 g2.strokeStyle=col+'88';g2.lineWidth=1.5*u;g2.beginPath();g2.moveTo(sx-14*u,sy-8*u);g2.lineTo(sx-14*u,sy+8*u);g2.moveTo(sx+14*u,sy-8*u);g2.lineTo(sx+14*u,sy+8*u);g2.moveTo(sx-8*u,sy+18*u);g2.lineTo(sx+8*u,sy+18*u);g2.stroke();
 g2.globalAlpha=a*((e.st==='lose'||(V.z>.4&&ch))&&Math.sin(t*40)>.2?.25:1);ci(sx,sy,(8+(nt?7*(1-e.t):2*Math.sin(t*5)))*u,nt?'#ffffff':col);ci(sx+Math.max(-3,Math.min(3,(V.px-e.x)/60))*u,sy,3*u,'#120f24');g2.restore();   // verification eye (unstable when the lock fails)
 if(e.lock>.02&&e.st!=='dissolve'){g2.save();g2.strokeStyle=col;g2.globalAlpha=e.lock*.5*(Math.sin(t*30)>1-e.lock*2?1:.2);g2.setLineDash([6*u,6*u]);g2.lineWidth=2*u;g2.beginPath();g2.moveTo(sx,sy);g2.lineTo(X(V.px),Y(V.py+50));g2.stroke();g2.restore()}   // visual tether to the player
 if(ch||nt||e.st==='lose'){const n=Math.round(e.lock*10),L=e.lock<.05?['TARGET UNKNOWN']:['TARGET LOCK','█'.repeat(n)+'░'.repeat(10-n)];L.forEach((s,i)=>tx_(s,sx,sy-(50+(L.length-1-i)*14)*u,col,MONO(11)))}}
// ---- FAILURE: isolated so a lives/checkpoint system can replace it later ----
function shieldedDeath(msg){if(V.dead)return;V.dead={t:0,msg:msg||'SIGNAL LOST'};V.st='dead';V.vx=V.vy=0;ctl(0);
 for(let i=0;i<40;i++){const a=Math.random()*6.28,s=60+Math.random()*260;V.vp.push({x:V.px,y:V.py+50,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1.1,c:i%2?'#e8f6ff':'#6a7cff',s:6,g:0})}
 AM.sfx('incorrect');if(!reduce)wow=Math.max(wow,.8)}
function checkHazards(){if(V.st!=='dead'&&V.py<-140)shieldedDeath('TRANSACTION INTERRUPTED');
 if(V.st==='play'&&V.br.t<.5&&Math.abs(V.px-GAP[0])<260&&V.hint<=0){V.hint=4;say(GAP[0]-60,V.pf&&V.pf.done?'The bridge is forming. Hold on.':'The valley is broken. Find the ZK proof.')}}
function updateDeath(dt){const d=V.dead;d.t+=dt;if(d.t>2.2&&!d.go){d.go=1;back()}}      // fade, then the engine's own back() returns to the hub
// ---- clue reactions ----
function clueEvent(i){if(i===0){V.hl=3;V.flash=.4}                                           // exposed: trails light up, eyes react, wires connect
 if(i===1){V.red=.001;V.en.lock=Math.min(V.en.lock,.3);V.flash=.6;AM.sfx('core-activate')}     // shielded: the public trail redacts itself, shield strengthens
 if(i===2){V.st='proof';V.pf={t:0,x:CLUES[2].x,y:CLUES[2].y};AM.sfx('rise')}}                  // ZK proof: set piece
function updateProof(dt){const f=V.pf;f.t+=dt;
 if(f.t>1.3&&!f.b){f.b=1;AM.sfx('card-reveal')}
 if(f.t>2.4&&!f.c){f.c=1;AM.sfx('correct');V.flash=1;if(!reduce)wow=Math.max(wow,1.2);spark(f.x,f.y,'#9ffcff',50)}
 if(f.t>3.3){V.st='play';f.done=1;V.br.go=1;V.msg={i:0,h:'SHIELD BRIDGE',s:'The proof checked out without revealing the secret, and a bridge forms across the broken valley. IN ZCASH: a zero-knowledge proof lets the network confirm the rules were followed without seeing who paid whom. Sapling, in 2018, made shielded transactions fast enough for everyday use.'};V.mt=15}}
function updateBridge(dt){const b=V.br;if(b.go===1&&X(GAP[0])<W_*.92){b.go=2;AM.sfx('portal');V.flash=.4}
 if(b.go===2&&b.t<1){const k0=Math.floor(b.t*BN);b.t=Math.min(1,b.t+dt/1.8);const k1=Math.floor(b.t*BN);if(k1>k0){spark(GAP[0]+(k1-.5)*(GAP[1]-GAP[0])/BN,8,'#9ffcff',6);AM.sfx('interaction')}}
 if(b.t>=1&&!b.d){b.d=1;if(!reduce)wow=Math.max(wow,.7)}if(b.t>=1&&Math.random()<.25)V.vp.push({x:GAP[0]+Math.random()*(GAP[1]-GAP[0]),y:8,vx:70,vy:25,l:.7,c:'#9ffcff',s:3,g:0})}
// ---- drawing: trails, shield geometry, bridge, proof set piece, final eyes, overlays ----
function drawTrails(p,t){const z=V.z,A1='zs1…8a4 → 5.42 ZEC → zs1…21f',R1='██████ → ████ → ██████';
 [1050,1650,2250].forEach(x=>{const sx=X(x);if(sx<-300||sx>W_+300)return;g2.globalAlpha=(.3+.6*Math.min(1,V.hl))*(1-z);tx_(A1,sx,Y(118),'#fff',MONO(11));rr(x-125,112,250,2,'#fff');g2.globalAlpha=1});   // exposed trail
 if(V.hl>0){g2.save();g2.strokeStyle='#ffd35a';g2.lineWidth=2;g2.setLineDash([8*U,6*U]);g2.globalAlpha=Math.min(1,V.hl)*.6;[1000,1700,2250].forEach(x=>[330,118].forEach(y=>{g2.beginPath();g2.moveTo(X(x),Y(y));g2.lineTo(X(CLUES[0].x),Y(CLUES[0].y));g2.stroke()}));g2.restore()}
 const sx=X(2950);if(sx>-300&&sx<W_+300){const j=V.red>0&&V.red<1?(Math.random()-.5)*4:0;g2.globalAlpha=.85*(1-V.red);tx_(A1,sx+j,Y(255),'#e8f6ff',MONO(11));g2.globalAlpha=.85*V.red;tx_(R1,sx,Y(255),p.pr,MONO(11));g2.globalAlpha=1}}   // shielded trail redacts after clue 2
function drawShieldGeo(p,t){if(V.z<.05)return;for(let i=0;i<7;i++){const sx=X(2640+i*240);if(sx<-80||sx>W_+80)continue;g2.save();g2.translate(sx,Y(150+60*Math.sin(i*1.7)));g2.rotate(t*.2+i);g2.globalAlpha=.1+.16*V.z;g2.strokeStyle=p.pr;g2.lineWidth=2;g2.beginPath();for(let k=0;k<6;k++)g2[k?'lineTo':'moveTo'](Math.cos(k*1.047)*40*U,Math.sin(k*1.047)*40*U);g2.closePath();g2.stroke();g2.restore()}}
function drawBridge(p,t){const g0=X(GAP[0]),gw=(GAP[1]-GAP[0])*U;if(g0+gw<-60||g0>W_+60)return;rc(g0,GY,gw,H_-GY,'#04050c');
 g2.fillStyle='#fff';g2.font=MONO(11);g2.textAlign='center';g2.globalAlpha=.2;for(let i=0;i<5;i++)g2.fillText(i%2?'1':'0',g0+(i+.5)*gw/5,GY+((t*40+i*37)%100)*U+14);g2.globalAlpha=1;   // data rain in the void
 const L=GAP[0]-14,R=GAP[1]+14,on=V.br.go>=1,k=V.br.t*BN,w=(GAP[1]-GAP[0])/BN;
 [L,R].forEach(x=>{rr(x-7,230,14,230,'#161a30');g2.globalAlpha=on?.6+.4*Math.sin(t*4):.25;rr(x-7,230,14,5,p.pr);g2.globalAlpha=1});
 if(on&&V.br.t<1){g2.strokeStyle=p.pr;g2.lineWidth=3*U;g2.shadowColor=p.pr;g2.shadowBlur=14;g2.globalAlpha=.5+.3*Math.sin(t*20);g2.beginPath();g2.moveTo(X(L),Y(230));g2.quadraticCurveTo(X((L+R)/2),Y(330+20*Math.sin(t*8)),X(R),Y(230));g2.stroke();g2.shadowBlur=0;g2.globalAlpha=1}   // energy arc
 for(let i=0;i<BN;i++){const f=Math.max(0,Math.min(1,k-i)),x=GAP[0]+i*w;if(f<=0){if(!on&&V.pf&&V.pf.done){g2.globalAlpha=.12;rr(x+2,2,w-4,8,p.pr);g2.globalAlpha=1}continue}
  g2.globalAlpha=f;const y=2+(1-f)*30;rr(x+2,y,w-4,10,'#10162e');rr(x+2,y,w-4,3,p.pr);g2.globalAlpha=1}                                   // tiles lock in one by one
 if(V.br.t>=1){g2.globalAlpha=.4+.3*Math.sin(t*3);rr(GAP[0],3,GAP[1]-GAP[0],2,'#9ffcff');g2.globalAlpha=1}}
function drawProofSet(p,t){if(V.st!=='proof'||!V.pf)return;const f=V.pf,tt=f.t,sx=X(f.x),sy=Y(f.y),u=U;
 g2.globalAlpha=Math.min(.5,tt*1.2)*Math.max(0,Math.min(1,(3.3-tt)/.4));rc(-60,-60,W_+120,H_+120,'#03040c');g2.globalAlpha=1;       // the world dims while the proof runs
 g2.save();g2.lineWidth=3*u;[0,1,2].forEach(k=>{g2.strokeStyle=k%2?'#9ffcff':p.pr;g2.globalAlpha=Math.min(1,tt*1.5);g2.setLineDash([14*u,10*u]);g2.lineDashOffset=-t*40*(k%2?-1:1);g2.beginPath();g2.arc(sx,sy,(60+k*34)*u*Math.min(1,tt*1.5),0,7);g2.stroke()});g2.restore();
 const sn=Math.max(0,Math.min(1,tt-1));for(let k=0;k<8;k++){const a=k*.785+t*.5,r=(220-150*sn*sn*(3-2*sn))*u;rc(sx+Math.cos(a)*r-5*u,sy+Math.sin(a)*r-5*u,10*u,10*u,'#e8f6ff')}   // blocks snap into place
 rc(sx-60*u,sy-18*u,120*u,36*u,'#0a0f26');g2.strokeStyle=p.pr;g2.lineWidth=2;g2.strokeRect(sx-60*u,sy-18*u,120*u,36*u);tx_('████████',sx,sy+6*u,p.pr,MONO(16));icon('shield',sx,sy-34*u,10*u,p.pr);   // the secret stays redacted throughout
 const y0=H_*.2;g2.globalAlpha=Math.min(1,tt*2);tx_('SECRET  ████████',W_/2,y0,'#fff',MONO(18));
 if(tt>1.1){g2.globalAlpha=Math.min(1,(tt-1.1)*3);tx_('↓  PROOF  ↓',W_/2,y0+34*u,p.pr,MONO(18))}
 if(tt>2.3){g2.globalAlpha=Math.min(1,(tt-2.3)*3);tx_('VALID ✓',W_/2,y0+72*u,'#9ffcff',MONO(24));tx_('verified without revealing the secret',W_/2,y0+98*u,'#cfd6e4',MONO(12))}g2.globalAlpha=1}
function vEye(x,y,o,col){const h=Math.max(2,16*o);rr(x-18,y+h/2,36,h,'#e8f6ff');if(o>.25)rr(x-6,y+Math.min(h,12)/2,12,Math.min(h,12),col)}
function drawFinalEyes(p,t){const ex=V.exp>0,qt=V.quiet,o=ex?1:qt?0:.35;if(X(PORT[0])<-400||X(PORT[1])>W_+400)return;
 [5280,5420,5560,5700,5840].forEach(x=>vEye(x,400,qt?Math.max(0,o-V.gt*.5):o,ex?'#ff6a3d':'#0b0e22'));
 if(ex){g2.save();g2.strokeStyle='#ff6a3d';g2.globalAlpha=Math.min(1,V.exp)*.35*(Math.sin(t*30)>0?1:.5);[5280,5420,5560,5700,5840].forEach(x=>{g2.beginPath();g2.moveTo(X(x),Y(400));g2.lineTo(X(V.px),Y(V.py+50));g2.stroke()});g2.restore();g2.globalAlpha=Math.min(1,V.exp);tx_('zs1…a7c4 → 5.42 ZEC → zs1…9e02',X(5510),Y(345),'#fff',MONO(11));g2.globalAlpha=1}   // exposed: eyes wake, data is readable
 if(qt&&V.gt<2.3){g2.globalAlpha=Math.sin(t*25)>0?.9:.35;tx_('TARGET UNKNOWN',X(5560),Y(370),'#ffb347',MONO(12));g2.globalAlpha=1}}                     // shielded: the observers lose their lock
function drawOverlays(p){if(V.bn){g2.globalAlpha=Math.min(1,V.bn.l*1.5);tx_(V.bn.s,W_/2,H_*.38,V.bn.c,MONO(22));g2.globalAlpha=1}
 if(V.dead){const d=V.dead;g2.globalAlpha=Math.min(1,d.t/1.8)*.88;rc(-60,-60,W_+120,H_+120,'#05060f');g2.globalAlpha=Math.min(1,d.t*2);tx_(d.msg,W_/2+(d.t<.6?(Math.random()-.5)*6:0),H_*.45,'#ff8a5a',MONO(26));tx_('returning to the hub…',W_/2,H_*.45+30,'#8890b0',MONO(12));g2.globalAlpha=1}}
// ---------- wiring into the shared engine ----------
DEC.shielded=function(w,h,gy,t,p){if(!isV())return;xFar(V.cx,Y(0),t,xmix('#8ad08a',p.pr,V.z),xmix('#fff3c4',p.ac,V.z));drawBackground(p,t);drawTrails(p,t);drawShieldGeo(p,t);drawPlatforms(p,t);sGround(p,t);drawBridge(p,t);drawNpc(300,'s','',p);drawNpc(900,'w','Transparent transactions show details publicly. Anyone can look!',p);drawNpc(2640,'g','Shielded transactions protect sensitive details from public view.',p);
 drawMembrane(p,t);drawPortals(p,t);drawGate(p,t);CLUES.forEach((c,i)=>drawClue(c,i,t,p));drawFinalEyes(p,t);drawWarden(p,t);
 V.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*2);rr(q.x,q.y,q.s,q.s,q.c)});g2.globalAlpha=1;V.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),'#fff',230*U,Math.min(1,f.l)));sMotes(p);xMid(V.cx,Y(0),t,[xmix('#fff3a0',p.ac,V.z),xmix('#d8ffe0',p.pr,V.z)],16);drawAtmosphere();drawProofSet(p,t);
 if(V.st==='opening'){for(let k=0;k<2;k++){const q=(V.gt*.9+k*.5)%1;g2.globalAlpha=(1-q)*.6;g2.strokeStyle=p.pr;g2.lineWidth=4*U;g2.beginPath();g2.arc(X(V.px),Y(V.py+50),(50+q*260)*U,0,7);g2.stroke()}g2.globalAlpha=1}   // shield pulse
 const sx=X(300);if(sx>-100&&sx<W_+100){g2.font=MONO(11);tx_(coarse?'◀ ▶ RUN':'← → RUN',sx,Y(238),'#e8f6ff',MONO(11));tx_(coarse?'⤒ JUMP':'SPACE JUMP',sx,Y(220),'#e8f6ff',MONO(11))}};
const _bgv=bg;bg=function(w,h,gy,p){if(isV()){frame(w,h,gy);cam=V.cx*U;const z=V.z,th=TH.shielded;th.sky=[mixc('#34566f','#040916',z),mixc('#a7cfe0','#0a2438',z)];th.fog=mixc('#fff1b8','#4ee3f0',z);th.moon[3]=mixc('#fff3c4','#9fe8ff',z)}_bgv(w,h,gy,p)};
const _avv=avatar;avatar=function(w,h,gy,p){if(isV()){drawPlayer(p);drawShield(p);drawJeff(p,T);xFront(V.cx,T,[xmix('#8ad08a',p.pr,V.z),p.ac,p.se],LW,1,xmix('#06100c','#030813',V.z));drawDlg();drawHud(p);drawAtt()}else _avv(w,h,gy,p)};
const _svw=startWorld;startWorld=function(i){const me=W[i].id==='shielded';if(me)vInit();_svw(i);if(me)$z('wf').innerHTML=''};
const _spw=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spw()};

TH.shielded={sky:['#040916','#0a2438'],moon:[.5,.14,.06,'#9fe8ff'],mt:'#06101c',fog:'#4ee3f0',amb:'mote'};
GIANT.shielded=function(w,h,gy,t,th,p,c,id,o,f){ring(w*.5+o,gy-h*.3,h*.7,.05,f,t)};
LM.shielded=function(x,y,s,c,t,a,B){B();hg.moveTo(-s*.8,-s);hg.lineTo(s*.8,-s);hg.lineTo(s*.8,0);hg.quadraticCurveTo(s*.8,s,0,s*1.3);hg.quadraticCurveTo(-s*.8,s,-s*.8,0);hg.closePath();hg.stroke();hg.globalAlpha=a*.25;hg.fill();};
});

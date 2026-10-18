/* ZKSCAPE world 05: THE ORCHARD - an ancient cryptographic orchard that keeps score without keeping names. Core verb: GROW.
   Loop: SEED (the Elder drops one) -> PLANT (only at the edge of the Row) -> GROW (open fruit leaks its light) -> SEAL (the Hollow's resin: a commitment)
         -> OFFER (the Well: a ring is born, a nullifier) -> the twin still hangs -> OFFER IT AGAIN -> the Well REFUSES -> the orchard wakes.
   The orchard never removes and never learns WHICH. It remembers THAT.
   Same engine hooks and movement model as Origin / Proof / Keys (bg, avatar, startWorld, stopWorld wrappers, own physics, own touch controls).
   All state is local to V. No other world is touched. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'orchard',n:'ORCHARD',title:'THE ORCHARD',sub:'What grows cannot be unplanted.',desc:'An orchard full of fruit that never falls. A well full of rings that touch nothing. Why does it keep growing?',q:'A spent note leaves a mark, not a trail.',
 sort:[['',0]], /* engine flag only (as in the other adventure worlds): no default hotspots, this world runs its own loop */
 deep:'In Zcash, an Orchard note is hidden behind a commitment that is only ever added to a tree, never edited. Spending reveals a nullifier: a unique mark that lets the network catch a second spend of the same note, without saying which note it was. The orchard remembers THAT it was spent, never WHICH.'});
A.orchard='Orchard Ring';
TH.orchard={sky:['#04120d','#0b2a1f'],moon:[.62,.2,.08,'#e8a640'],mt:'#061510',fog:'#5fe0b8',amb:'mote'};
GIANT.orchard=function(w,h,gy,t,th,p,c,id,o,f){
 // the Great Tree, far away: a dark silhouette ringed in dormant light. It brightens as the orchard wakes.
 const wk=V?V.wake:0,lv=V?V.lv:0,cx=w*.74+o*1.4,cy=gy-h*.5;
 ring(cx,cy,h*.5,.04,f,t);ring(cx,cy,h*.36,-.07,p.pr,t);
 g2.fillStyle='#030d09';g2.fillRect(cx-h*.05,cy,h*.1,gy-cy);
 [[-.22,.08,.2],[0,-.05,.27],[.22,.08,.2],[-.1,.2,.17],[.12,.2,.17]].forEach(q=>{g2.beginPath();g2.arc(cx+q[0]*h,cy+q[1]*h*.5-h*.12,q[2]*h,0,7);g2.fill()});
 g2.globalAlpha=.06+.3*wk+.05*lv;g2.strokeStyle='#ffd36a';g2.lineWidth=3;g2.beginPath();g2.arc(cx,cy-h*.1,h*.27,3.3,6.1);g2.stroke();g2.globalAlpha=1};
LM.orchard=function(x,y,s,c,t,a,B){B();hg.arc(0,0,s*.45,0,7);hg.stroke();B();hg.moveTo(0,s*.45);hg.lineTo(0,-s*.2);hg.stroke();B();hg.arc(s*.17,-s*.3,s*.17,0,7);hg.stroke();B();hg.arc(-s*.15,-s*.1,s*.13,0,7);hg.stroke()};
const OLD=function(w,h,gy,t,p){const cx=w*.5;rc(cx-30,gy-h*.4,60,h*.4,'#0b2a1f');ci(cx,gy-h*.45,h*.16,'#12402c');ring(cx,gy-h*.35,h*.28,.1,p.pr,t)};

// ======================= layout (x in world units, y = height above the surface) =======================
const LW=7900,HW=30,PH=112,SPD=300,JMP=830,GRAV=2500,FL=-380;
const PXo=i=>2400+(i-1)*120,SCAR=5,TREES=[1,2,3,4,6,7,8,9],ELD=2000,REACH=5880,GT=7230,STB=[1100,2000],CHB=[4000,5700],WELL=5100,HOLX=4770,SEEDX=1950,NLOW=41;
const PLAT=[[3950,140,90],[4130,140,180],[4310,160,270],[4480,140,340],[4670,260,340],[4960,140,250],[5130,140,160],[5300,140,70]];
const SKYP=[[4850,90,450],[4980,90,560],[5110,90,660],[5240,320,700]];
const Z=[0,900,1750,2250,3900,REACH,6500],ZN=['THE FALLOW EDGE','THE STATION','THE ELDER','THE ROW','THE CANOPY WALK','THE WITHERED REACH','THE GREAT TREE'];
const C={am:'#e8a640',gd:'#ffd36a',cy:'#5fe0b8',gr:'#2f7a45',dg:'#0b2a1f',ea:'#17110a',br:'#3a2614',pc:'#e8dcc0',rd:'#ff7a4a',gy:'#4a5650',st:'#2a2e28'};
const EDU='In Zcash, a note is hidden behind a commitment that is only ever added to a tree. Spending reveals a nullifier: a unique mark that catches a second spend without saying which note it was. IT REMEMBERS THAT, NEVER WHICH. The Orchard pool arrived with the NU5 upgrade in 2022. It uses the Halo 2 proving system on the Pallas and Vesta curves, and its commitments use a hash called Sinsemilla.';
let V=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,e:0,eh:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-V.cx)*U,Y=y=>GY-(y-V.cy)*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),cc=(x,y,r,c,a)=>ci(X(x),Y(y),r*U,c,a),isO=()=>run&&cur&&cur.id==='orchard'&&V&&V.on;
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixc=(a,b,t)=>{t=Math.max(0,Math.min(1,t));const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace',T2=(s,x,y,c,n)=>tx_(s,X(x),Y(y),c,MONO(n));
const awP=(a,b)=>V.aw<0?0:Math.max(0,Math.min(1,(V.aw-a)/(b-a)));
// The awakening used to be a 20s camera ride that carried the player with the pulse, and E skipped it. It is now an
// 8s camera-only tour: the player dissolves out on the same slice glitch Origin uses for its NPC and materialises at
// the end. AW_S maps our shorter clock onto the old pulseX timeline so the tour still crosses the whole Row, and the
// skip is gone - nothing you press during the beat can end it early.
const AW_END=8,AW_S=2.5,AW_GONE=1.1;
const pl=(pts,c,a)=>{g2.globalAlpha=a==null?1:a;g2.fillStyle=c;g2.beginPath();pts.forEach((q,i)=>i?g2.lineTo(X(q[0]),Y(q[1])):g2.moveTo(X(q[0]),Y(q[1])));g2.closePath();g2.fill();g2.globalAlpha=1};
const ln=(a,b,c2,d,col,w,al)=>{g2.globalAlpha=al==null?1:al;g2.strokeStyle=col;g2.lineWidth=Math.max(1,w*U);g2.beginPath();g2.moveTo(X(a),Y(b));g2.lineTo(X(c2),Y(d));g2.stroke();g2.globalAlpha=1};
const gl=(x,y,r,col,a)=>{const sx=X(x),sy=Y(y),R=r*U;if(sx<-R||sx>W_+R)return;const g=g2.createRadialGradient(sx,sy,0,sx,sy,R);g.addColorStop(0,col);g.addColorStop(1,col+'00');g2.globalAlpha=a==null?1:a;g2.fillStyle=g;g2.fillRect(sx-R,sy-R,R*2,R*2);g2.globalAlpha=1};
const onS=(x,pad)=>{const s=X(x);return s>-(pad||200)*U&&s<W_+(pad||200)*U};
const F0=()=>({pl:0,plot:0,x:0,g:0,picked:0,sealed:0,twin:0,ring:0});
const plotFruit=p=>V.f.find(f=>f.pl&&f.plot===p);
const nextFree=()=>[10,11,12].find(p=>!plotFruit(p))||-1;
const isTree=p=>TREES.includes(p)&&!V.cut[p];
const crownT=()=>{let n=0;V.f.forEach(f=>{n+=(f.pl?1:0)+(f.sealed?1:0)});const L=.12+.1*n+.14*V.ringN+(V.awake?.4:0)-V.dip+.4*V.wake;return Math.max(0,Math.min(1,L))};
const crownC=()=>{const L=crownT();return L<.5?mixc('#6b4416',C.am,L*2):mixc(C.am,'#fff0b0',(L-.5)*2)};

function oInit(){
 V={on:1,px:100,py:0,vx:0,vy:0,gr:1,face:1,cx:0,cy:0,lay:0,fade:null,stt:'play',last:performance.now(),step:0,near:null,done:0,buf:0,coy:0,ltx:0,
  rt:0,room:-1,msg:'',mt:0,bad:0,vp:[],ft:[],dlg:null,lock:0,gm:0,
  seedDrop:0,seedT:0,pouch:[0,0],seedTaken:0,f:[F0(),F0()],hand:null,ped:null,resin:0,sealing:0,sealT:0,
  ring:[0,0],ringN:0,order:[],off:null,ref:null,refused:0,aw:-1,awake:0,pw:0,wake:0,lv:.16,cl:.3,crown:0,dip:0,
  study:0,hatch:0,jar:0,sky:0,shape:0,shapeSeen:0,threadN:0,mastery:0,cut:{},cutDone:0,hasShears:0,tOffer:0,tcut:0,gone:0,
  tx:1560,tl:0,tt:0,tf:0,tFin:0,tn:{},heard:0,vista:0,walkMsg:0,pulse:null,twinTaken:0,lantern:0,end:0};
 K.l=K.r=K.j=K.jp=K.e=K.eh=0;
 if(S.done&&S.done.orchard){ // already discovered: the orchard is awake, the twin still hangs
  const f=V.f[0];Object.assign(f,{pl:1,plot:10,x:PXo(10),g:1,picked:1,sealed:1,twin:1,ring:1});V.seedTaken=1;V.ring[0]=1;V.ringN=1;V.order=[0];V.refused=1;V.awake=1;V.aw=99;V.pw=1e9;V.wake=1;V.lv=1;V.cl=1;V.hatch=1;V.tFin=1;V.tx=GT-170;V.tl=0;V.px=PXo(10)+120;
  // The engine bails out with back() when ax and tx are both past the right edge: if(ax>w*.96&&tx>w*.96)return back().
  // This branch teleports the player to plot 10 but left cx at 0, so frame 0 read ax=3366 against a 1344 threshold
  // and threw the run straight back to the hub after about a second - a completed Orchard could never be replayed.
  // Seeding cx to px puts ax at 0 on the first frame and lets the camera pan in over the next few frames instead.
  V.cx=V.px}
 ctl(1)}
if(!window.__zkOR){window.__zkOR=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isO())return;e.preventDefault();if(k==='e'){K.eh=1;if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(!k)return;if(k==='e'){K.eh=0;return}K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0;K.eh=0});
 addEventListener('pointerup',()=>{K.eh=0})}
addEventListener('pointerdown',e=>{if(isO()&&e.target===g2.canvas){K.e=1;K.eh=1}});
function ctl(on){let c=$z('orctl');if(c&&c.dataset.own!=='orchard'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='orctl';c.dataset.own='orchard';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){K.eh=v;if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('\uD83D\uDCAC','e','interact'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
const spark=(x,y,c,n=10)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=60+Math.random()*180;V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.9,c,s:5,g:140})}};
const say=(x,s,y)=>V.ft.push({x,y:y==null?240+V.cy:y,s,l:2.6}),note=s=>{V.msg=s;V.mt=Math.max(5,s.length/15)},bad=(x,s)=>{V.bad=.4;AM.sfx('incorrect');say(x,s||'NO')};
const talk=(L,who,img,acc)=>{V.dlg={L,i:0,c:0,who:who||'THE TENDER',img:img||null,acc:acc||null};AM.sfx('interaction')};
function advance(){const d=V.dlg;if(!d)return;if(d.c<d.L[d.i].length){d.c=999;return}AM.sfx('interaction');if(++d.i>=d.L.length)V.dlg=null;else d.c=0}
function tele(lay,px,py,fn){if(V.fade)return;V.fade={t:0,d:1,lay,px,py:py||0,fn};AM.sfx('rise')}

// ======================= the Tender: he believes the orchard should tell him which fruit are used =======================
function tLines(){const n=V.tn,cnt=k=>(n[k]=(n[k]||0)+1)-1,rings=NLOW+V.ringN,anyP=V.f.some(f=>f.pl),sealedH=V.hand&&V.hand.k==='sealed';
 if(V.refused){if(!V.tFin){V.tFin=1;return['It caught you.','And it still does not know which one you are.','In Zcash that mark is a nullifier. Every spend publishes one, and the network refuses any it has already seen.','Count them. Do not match them.']}return V.awake?['Go on. The old tree is awake.','I will stay. Somebody should count.']:['Look at them all turn.']}
 if(V.cutDone&&!V.tcut){V.tcut=1;return['Master did exactly that.','He cut one he thought was used. The whole Row paid for it.','I thought you would know better.']}
 if(V.ringN){return cnt('r')?['If the Well worked, the fruit would be gone. It is not gone.','Take it down. Try again. See what it does.']:['Still there. Still hanging.','I told you. The Well takes nothing and tells nothing.',rings+' rings, and not one of them knows its fruit.']}
 if(V.hand&&V.hand.k==='open'||V.ped!==null)return cnt('o')?['Open, it is yours and everyone\u2019s.','The hollow in the big trunk. Up the roots.']:['I can read yours from here. Everyone can. Is that what you want?','Once the resin sets, it sets. I would hold something back, if I were you.'];
 if(sealedH)return['You promised something. I can see that you did.','I cannot see what. Neither can the Well, I think.','That promise is a commitment. It is appended to a tree on the canonical chain and not edited, and nobody can open it but you.'];
 if(anyP){if(cnt('p')===0)return['It grows at the end. It always did.','Master never accepted that.'];
  if(!V.cutDone&&!V.tOffer){V.tOffer=1;return['I have shears, if you want them. Cut the old ones. The used ones.','I never could tell which were used.']}
  return['Wait for it. It only ripens in the open.']}
 if(V.seedTaken)return['The old tree gave you one. It never gave me one.','Do not put it where the old tree went.'];
 return cnt('f')?['I count the fruit every morning. The count never changes.','Not one has ever fallen.']:['You walk like someone the roots have not decided about.','Do not touch the old tree. It does not like being counted.']}
function tenderIA(){const sh=V.tOffer&&!V.hasShears&&!V.cutDone&&!V.refused;return{pri:1,x:V.tx,y:V.tl===2?FL:0,lay:V.tl,l:sh?'TAKE THE SHEARS':'TALK TO THE TENDER',f:()=>{
 if(sh&&V.tShOk){V.hasShears=1;AM.sfx('collectible');note('The shears are heavy. Green sap has dried on the blade. Cut an old one, or do not.');return}
 talk(tLines());if(V.tOffer)V.tShOk=1}}}
function tTarget(){const f0=V.f.find(f=>f.ring&&f.twin);
 if(V.refused)return V.lay===2?[5260,2]:[GT-170,0];
 if(V.ringN&&f0)return[f0.x-60,0];
 if(V.hand||V.ped!==null)return[4040,0];
 const pf=V.f.find(f=>f.pl);if(pf)return[pf.x-60,0];
 if(V.seedTaken)return[2800,0];
 return[1560,0]}

// ======================= GARY: he has never gone further in than the edge, and he is honest about why =======================
// He is frightened of this place, not of you, and he loves it - which is the whole problem, because a thing you
// love and are afraid of is the thing you stand at the boundary of for the rest of your life.
// He never explains a seed or the Row. He points at the light under the roots and then he points further on.
// NPCA is zkSNARK's own extract()[0] - the house NPC accent, shared by every character's glow,
// drop shadow and name tag so they all read the same way.
const NPCA='#ffffff',GRY=470;
let GA=null,GA_PAL=['#9ecf7a','#d8eeb8','#f0a850'];{const im=new Image();im.onload=()=>{try{const c=typeof removeBg==='function'?removeBg(im):im;c.complete=true;if(!c.width)c.width=im.width;if(!c.height)c.height=im.height;GA=c;try{const p=extract(c)[0];if(Array.isArray(p)&&p[0]&&/^#[0-9a-f]{6}$/i.test(p[0]))GA_PAL=p}catch(e){}}catch(e){GA=im}};im.src='NPCs/Gary_clean.png'}
function garyLines(){
 if(V.awake)return['Listen. Listen to it. Is that the Row?','That used to be nothing. That used to be the quietest thing I have ever stood next to.','Go on. The Tender will be under the old tree, and he will tell you what he told me, which is that he does not know either.','He says the Orchard pool arrived with the NU5 upgrade in 2022. Every note in it is hidden, and every spend leaves only a mark.'];
 if(V.cutDone)return['You cut one. You cut one of them and the whole crown went over in a colour.','I did not say anything. I want you to know that I did not say anything.'];
 if(V.seedTaken)return['You have got a seed. That is - that is a real thing. That is the first real thing anybody has carried out of here.','Put it in the ground. At the edge. Not in the Row. The Row is not for putting things in.'];
 if(!V.gm){V.gm=1;return["...oh. Oh - you are warm. You are a warm one. Sorry. Sorry, I startle at things. I am Gary.","Past the station there is an old one. The Tender. He walks the Row every morning and he knows which fruit are used and which ones are not.","He will show you. He walks slow - walk slow with him, and let him finish what he has started saying."]}
 return['Still here. Good. I say something awful, and then you stay, and then I am not the only one who said it.','It is very quiet. It is the quietest place I have ever been.','I did not used to mind it. I do not think I mind it now. I think I only mind that I noticed.'];}
function garyArt(t){if(V.lay!==0)return;const x=GRY,sx=X(x);if(!onS(x,140))return;const sy=Y(0),h=PH*U*.9,w=h*(GA&&GA.width?GA.width:520)/(GA&&GA.height?GA.height:520),jit=Math.sin(t*6.3)*1.6*U+Math.sin(t*2.1)*1.2*U,lean=(V.px>x?1:-1)*4;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,sy+3,w*.32,4.5*U,0,0,7);g2.fill();
 const cy=sy+h*.5,g=g2.createRadialGradient(sx,cy,0,sx,cy,h*1.2);g.addColorStop(0,NPCA+'2e');g.addColorStop(1,NPCA+'00');g2.fillStyle=g;g2.fillRect(sx-h*1.3,cy-h*1.3,h*2.6,h*2.6);
 if(GA&&GA.width){g2.save();g2.imageSmoothingEnabled=false;g2.translate(sx+lean,sy-jit);g2.scale(V.px<x?-1:1,1);g2.drawImage(GA,-w/2,-h,w,h);g2.restore()}
 T2('GARY',x,h/U+24,NPCA,11)}

// ======================= interactables: every one answers with something, nothing is a dead end =======================
function plantAt(p){const si=V.pouch[0]?0:V.pouch[1]?1:-1,x=PXo(p);
 if(si<0){note('You have no seed.');return}
 if(isTree(p)){bad(x,'TAKEN');note('Roots already hold this place. The seed will not take. It rolls back to your hand.');return}
 if(p===SCAR||V.cut[p]){bad(x,'IT WILL NOT TAKE');if(!V.study){V.study=1;AM.sfx('core-activate');spark(x+50,40,C.cy,22);note('The seed rolls back to your hand. Nothing grows in a place where something was cut out. The stump\u2019s hollow begins to glow.')}else note('The seed will not take. Nothing grows where something was cut out.');return}
 const fr=nextFree();if(p!==fr){bad(x,'NOT HERE');note('The soil turns the seed away. This orchard only grows at its edge.');return}
 const f=V.f[si];Object.assign(f,{pl:1,plot:p,x,g:0,picked:0,sealed:0,twin:0,ring:0});V.pouch[si]=0;V.pulse={x,t:0};spark(x,20,C.cy,20);AM.sfx('core-activate');
 note('The seed takes. Light runs through the roots, down the Row, all the way to the Elder. Its crown changes colour. IN ZCASH: a shielded note is a piece of value tied to its owner. The network never sees what is inside it.');V.sky=V.f.filter(q=>q.pl).length>=2}
function IAS(){const a=[],P=(lay,x,y,l,f)=>a.push({lay,x,y,l,f}),L0=0,hnd=V.hand,hk=hnd&&hnd.k;
 // ---------- the surface
 P(0,300,0,'EXAMINE THE ARCH',()=>note('Rings carved in the stone, hundreds of them. Every ring is a little different. None of them points at anything.'));
 P(0,640,0,'LISTEN TO THE ROOTS',()=>{V.heard=1;note('Under the soil, cyan light runs through the roots. All of it the same way. Toward something.')});
 P(0,1010,0,'READ THE SLATE',()=>note('Tally hand: \u201cRow 5 pruned. Used. Row 5 died. Crown fell three shades. WHY?\u201d'));
 P(0,1130,0,'EXAMINE THE BASKETS',()=>note('Baskets everywhere. All empty. Nothing in this orchard has ever been picked.'));
 P(0,GRY,0,V.gm?'TALK TO GARY AGAIN':'TALK TO GARY',()=>talk(garyLines(),'GARY',GA,NPCA));
 P(0,1250,0,'EXAMINE THE SHEARS',()=>note('Broken shears on the rack. Green sap has dried on the blade.'));
 P(0,1385,0,V.hatch?'DROP THROUGH THE HATCH':'TRY THE HATCH',()=>{if(!V.hatch){bad(1385,'BOLTED');note('A hatch in the ground. Bolted. From below.');return}tele(1,1180,FL)});
 if(V.seedDrop===2&&!V.seedTaken)P(0,SEEDX,0,'TAKE THE SEED',()=>{V.seedTaken=1;V.pouch[0]=1;AM.sfx('collectible');spark(SEEDX,30,C.cy,16);note('A seed. Warm, and faintly the colour of you. Nobody told you to take it.')});
 P(0,ELD+95,0,'EXAMINE THE ELDER',()=>note(V.ringN?'The tally ticks have not changed. The crown has.':'Tally ticks, thousands of them, and carved rings. No names anywhere.'));
 for(let p=1;p<=12;p++){const x=PXo(p),f=plotFruit(p);let l,fn;
  if(f){const i=V.f.indexOf(f);
   if(f.g<1){l='PULL UP THE SEEDLING';fn=()=>{f.pl=0;V.pouch[i]=1;V.sky=V.f.filter(q=>q.pl).length>=2;AM.sfx('interaction');note('It folds back into a seed. Growth can be waited on. It can also be undone, here.')}}
   else if(!f.picked&&!f.sealed){l='TAKE THE FRUIT';fn=()=>{if(hnd){note('Your hands are full.');return}V.hand={k:'open',i};f.picked=1;AM.sfx('collectible');note('The fruit comes away warm, and open. Its light leaks from it. Anyone nearby can read it.')}}
   else if(f.twin){l=f.ring?'TAKE A COPY OF THE SEAL':'EXAMINE THE SEAL';fn=()=>{if(!f.ring){note('A perfect copy of your seal. It hangs here for the whole orchard to see. It stays.');return}
     if(hnd){note('Your hands are full.');return}V.hand={k:'twin',i};V.twinTaken=1;AM.sfx('collectible');note('A copy comes away in your hand, identical. The branch does not even notice.')}}
   else{l='THE BRANCH WAITS';fn=()=>note('The fruit is gone from here. Something will hang in its place.')}}
  else if(TREES.includes(p)&&!V.cut[p]){l=V.hasShears&&!V.cutDone?'CUT THE FRUIT':V.pouch[0]||V.pouch[1]?'PLANT THE SEED':'EXAMINE THE TREE';
   fn=()=>{if(V.hasShears&&!V.cutDone){V.cut[p]=1;V.cutDone=1;V.hasShears=0;V.dip=.18;V.pulse=null;spark(x,200,C.rd,26);AM.sfx('incorrect');V.bad=.5;note('The fruit drops. The branch darkens. A new scar, and the crown loses a shade. The blade snaps. You made that happen.');return}
    if(V.pouch[0]||V.pouch[1])plantAt(p);else note('A tree older than the Row\u2019s memory. Fruit hangs from it, and none has ever fallen.')}}
  else if(p===SCAR||V.cut[p]){l=V.pouch[0]||V.pouch[1]?'PLANT THE SEED':'EXAMINE THE SCAR';fn=()=>{if(V.pouch[0]||V.pouch[1])plantAt(p);else note('A dead stump with the ghost of a tree around it. Something was cut out of here.')}}
  else{l=V.pouch[0]||V.pouch[1]?'PLANT THE SEED':'EXAMINE THE SOIL';fn=()=>{if(V.pouch[0]||V.pouch[1])plantAt(p);else note('Rich, dark soil. Nothing grows here. Yet.')}}
  P(0,x,0,l,fn)}
 if(V.study)P(0,PXo(SCAR)+55,0,'DESCEND THE STUMP-HOLLOW',()=>tele(1,1930,FL));
 // ---------- the canopy walk and the hollow
 const pf=V.ped!==null;
 P(0,HOLX,340,pf?(V.sealing?'HOLD [E]':'HOLD [E] TO SEAL'):hk==='open'?'PLACE THE FRUIT ON THE ROOT':'EXAMINE THE ROOT-PEDESTAL',()=>{
  if(pf){if(!V.sealing){V.sealing=1;V.sealT=0;AM.sfx('interaction');note('The resin waits at the edge. Hold your hand over the fruit, and it closes.')}return}
  if(hk==='open'){V.ped=hnd.i;V.hand=null;V.resin=0;AM.sfx('interaction');note('The resin beads down the walls, slowly. It will not stop on its own. You can still step back.');return}
  note('A root pedestal. Amber resin has dripped and hardened here many times, around things that are not here any more.')});
 if(pf)P(0,HOLX-95,340,'TAKE IT BACK',()=>{V.hand={k:'open',i:V.ped};V.ped=null;V.sealing=0;V.sealT=0;V.resin=0;note('You take it back. It is still open. Nothing has changed.')});
 P(0,HOLX+130,340,'RIDE THE ROOT-SLIDE',()=>tele(2,4600,FL));
 P(0,5200,160,'LOOK OUT OVER THE REACH',()=>{V.vista=1;note('Far to the east a giant tree sleeps, dark, veined with gold. Between us, a gulf of grey and silent trees.')});
 P(0,REACH-60,0,'THE WITHERED REACH',()=>{if(V.awake){note('Alive.');return}bad(REACH-60,'DARK');note(hk==='sealed'?'A held promise is not a spent one. The roots here stay dark.':'Grey and silent. No light reaches these roots. Something has to wake them first.')});
 if(V.sky)P(0,5400,700,V.shapeSeen?'LOOK DOWN AGAIN':'LOOK DOWN',()=>{V.shape=1;V.shapeSeen=1;AM.sfx('card-reveal')});
 // ---------- the study (optional)
 P(1,1140,FL,V.hatch?'CLIMB THE HATCH':'UNBOLT THE HATCH',()=>{if(!V.hatch){V.hatch=1;AM.sfx('correct');note('The bolt slides. A hatch above you now opens, from the Station side.');return}tele(0,1385,0)});
 P(1,1260,FL,'READ THE LEDGER PAGE',()=>note('\u201cHow do I find the used ones without opening them? Opening them is the one thing we must never do.\u201d'));
 P(1,1380,FL,'STUDY THE CHALK DRAWING',()=>note('The orchard in cross-section. The Row is drawn as a tree, in amber ink. The Well is drawn as a flat disc, in cyan. The two inks never touch.'));
 P(1,1500,FL,V.ringN?'TRY TO TIE A RING TO ITS FRUIT':'EXAMINE THE THREAD WALL',()=>{
  if(!V.ringN){note('Strings run from ring-shaped tags to little wax fruit. Every string crosses every other.');return}
  V.threadN++;V.thread={t:0};AM.sfx('correct');
  if(V.ringN>=2&&V.order[0]===1&&!V.mastery){V.mastery=1;V.lantern=1;AM.sfx('world-complete');spark(1500,FL+160,C.gd,34);note('You offered them in the opposite order to the planting. The thread slides to every fruit at once, and goes slack. The order of the rings tells you nothing. The orchard keeps score without keeping order, and without keeping names. A lantern lights in the Study.');return}
  note(V.ringN>=2?'The thread slides to every fruit at once, and goes slack. Nothing about the rings follows the planting. If you had offered them in the other order, would you have been able to tell?':'You hold your ring to the wall. The thread slides to every fruit at once, and goes slack. No fruit is the one it came from.')});
 P(1,1640,FL,'EXAMINE THE NAIL',()=>note('A single severed thread hangs from a nail. The master gave up here.'));
 P(1,1780,FL,V.jar?'THE JAR IS EMPTY':'OPEN THE JAR',()=>{if(V.jar){note('Empty glass. A faint ring of light where the seed sat.');return}V.jar=1;V.pouch[1]=1;AM.sfx('collectible');spark(1780,FL+90,C.cy,16);note('The Last Seed. The master never planted it. Whatever it grows into, it can only grow at the edge.')});
 P(1,1880,FL,'READ THE LAST NOTE',()=>note('\u201cIf a mark could name its fruit, any passer-by could read us.\u201d'));
 P(1,1960,FL,'CLIMB THE LADDER',()=>tele(0,PXo(SCAR)+55,0));
 // ---------- the root chamber and the well
 P(2,4050,FL,'CLIMB THE ROOT-STAIR',()=>tele(0,3880,0));
 P(2,4380,FL,'EXAMINE THE WALL',()=>note('Rings in the bark, hundreds, all different. Not one of them points at a fruit.'));
 P(2,4760,FL,'WATCH THE ORBIT',()=>note((NLOW+V.ringN)+' rings turn above the Well without touching a thing.'));
 P(2,WELL,FL,'OFFER AT THE WELL',()=>offerAt());
 return a}
function offerAt(){const h=V.hand;
 if(V.off||V.ref)return;
 if(!h){note('Roots reach up from the dark for something to hold. You have nothing.');return}
 if(h.k==='open'){bad(WELL,'NOT SEALED');note('The roots cannot hold what they cannot see sealed. Open, it would be readable by anyone. The Well pushes it back.');return}
 const f=V.f[h.i];
 if(h.k==='sealed'&&!f.ring){V.off={t:0,i:h.i};V.hand=null;V.lock=3.6;AM.sfx('core-activate');return}
 V.ref={t:0,i:h.i,seq:0};V.lock=3.2;AM.sfx('rise')}
function act(){let b=null,d=120;IA().forEach(o=>{const q=Math.abs(V.px-o.x)*(o.pri?.45:1);if(o.lay===V.lay&&Math.abs(V.py-o.y)<110&&q<d){d=q;b=o}});if(b)b.f()}
function IA(){const a=IAS();if(V.tl===V.lay)a.push(tenderIA());return a}

// ======================= physics (same movement model as Origin/Proof/Keys) =======================
function floorTop(y0){if(V.lay>0)return FL;let f=0;const hw=HW*.6,chk=q=>{if(V.px+hw>q[0]&&V.px-hw<q[0]+q[1]&&y0>=q[2]-2&&q[2]>f)f=q[2]};PLAT.forEach(chk);if(V.sky)SKYP.forEach(chk);return f}
const pulseX=a=>a<1.5?WELL:a<3.5?WELL+(PXo(1)-WELL)*((a-1.5)/2):a<7.7?PXo(1)+(PXo(12)-PXo(1))*((a-3.5)/4.2):a<14?PXo(12)+(GT-PXo(12))*((a-7.7)/6.3):GT;
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;
 if(tx!==V.ltx&&tx>w*.99){back();return}
 V.lock=Math.max(0,V.lock-dt);
 const cine=V.aw>=0&&V.aw<AW_END,live=V.stt==='play'&&!V.dlg&&!V.fade&&V.lock<=0&&!cine,dir=live&&!V.sealing?K.r-K.l:0,tv=dir*SPD;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);if(dir)V.face=dir;
 V.coy=V.gr?.1:(V.coy||0)-dt;V.buf=(V.buf||0)-dt;if(K.jp){V.buf=.12;K.jp=0}
 if(live&&!V.sealing&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;AM.sfx('interaction')}
 if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;
 if(!V.sealing)V.px+=V.vx*dt;else V.vx=0;
 let lo=HW,hi=LW-90;if(V.lay===1){lo=STB[0]+HW;hi=STB[1]-HW}else if(V.lay===2){lo=CHB[0]+HW;hi=CHB[1]-HW}else if(!V.awake)hi=Math.min(hi,REACH-20);
 if(V.lay===0&&!V.awake&&V.px>=hi&&dir>0&&!V.walkMsg){V.walkMsg=2.5;say(V.px,'THE ROOTS ARE DARK HERE')}V.walkMsg=Math.max(0,V.walkMsg-dt);
 V.px=Math.max(lo,Math.min(hi,V.px));
 const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;const fl=floorTop(y0);if(V.vy<=0&&V.py<=fl){V.py=fl;V.vy=0;V.gr=1}else V.gr=0;
 if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.3;AM.sfx('step')}
 // fade between layers
 if(V.fade){const q=V.fade;q.t+=dt/.35*q.d;if(q.d>0&&q.t>=1){q.t=1;q.d=-1;V.lay=q.lay;V.px=q.px;V.py=q.py;V.vx=V.vy=0;V.gr=1;V.cx=V.px-(w/U)*.42;V.cy=q.lay>0?FL:0;V.sealing=0;if(q.fn)q.fn()}else if(q.d<0&&q.t<=0)V.fade=null}
 // the Elder drops a seed when you come near
 if(V.seedDrop===0&&V.px>1620){V.seedDrop=1;V.seedT=0;AM.sfx('rise')}
 if(V.seedDrop===1){V.seedT+=dt;if(V.seedT>1.6){V.seedDrop=2;AM.sfx('interaction');spark(SEEDX,10,C.cy,10)}}
 // growth: waiting matters
 V.f.forEach(f=>{if(f.pl&&f.g<1){f.g=Math.min(1,f.g+dt/18);if(f.g>=1){spark(f.x,200,C.gd,18);AM.sfx('collectible');note('The fruit ripens, open. A thread of its light leaks away on the air.')}}});
 if(V.pulse){V.pulse.t+=dt;if(V.pulse.t>3)V.pulse=null}
 // the resin: it creeps, and it only commits on a held hand
 if(V.ped!==null){if(V.sealing){if(K.eh){V.sealT+=dt;V.resin=Math.min(1,.6+.4*V.sealT/1.6);if(V.sealT>=1.6){const i=V.ped,f=V.f[i];f.sealed=1;f.twin=1;V.ped=null;V.sealing=0;V.resin=0;V.hand={k:'sealed',i};V.dip=Math.max(0,V.dip);spark(HOLX,400,C.am,36);AM.sfx('core-activate');V.lock=.6;
   note('The resin closes with a deep click. The glow inside goes out. A perfect copy of your seal now hangs on your tree, for the whole orchard to see. Nobody can open it but you. IN ZCASH: that sealed copy is a note commitment. It hides the value and the owner. Commitments are appended to a public tree as transactions are confirmed on the canonical chain, and the tree is not edited. A chain reorganization can undo the most recent additions.')}}else{if(V.sealT>.3)say(HOLX,'YOU LET GO',440);V.sealing=0;V.sealT=0;V.resin=.6}}else V.resin=Math.min(.6,V.resin+dt/10)}
 // the offering at the well: roots check the whole grove at once, then a ring is born
 if(V.off){const q=V.off;q.t+=dt;if(!q.b&&q.t>1.8){q.b=1;V.ring[q.i]=1;V.f[q.i].ring=1;V.ringN++;V.order.push(q.i);spark(WELL,FL+170,C.cy,40);AM.sfx('collectible');V.cl=.5}
  if(q.t>3.4){V.off=null;note('A ring rises and joins the orbit. It touches no tree. The chamber stays dim. Something is unfinished. Far above, a lantern swings: \u201cYou spent one. Which? ... No. Do not tell me.\u201d IN ZCASH: spending a note publishes its nullifier, a unique mark added to a public list. It does not say which note was spent.')}}
 // the refusal: the ring that is already there swings down to meet the husk
 if(V.ref){const q=V.ref;q.t+=dt;if(!q.b&&q.t>.9){q.b=1;V.bad=.35;AM.sfx('incorrect');AM.sfx('impact');spark(WELL,FL+120,C.cy,30)}
  if(q.t>2.8){V.ref=null;if(!V.refused){V.refused=1;V.aw=0;V.stt='cine';V.gone=0.001;V.lock=AW_END;AM.sfx('core-activate');note('The ring was already here. It recognised the use. It does not look at any tree. IN ZCASH: if the same nullifier appears twice, the network rejects the second spend. That is how a shielded note can only be spent once.')}else note('Refused again. The same ring. The same silence about whose it is.')}}
 // the awakening
 if(V.gone)V.gone=V.gone>0?Math.min(AW_GONE,V.gone+dt):Math.min(0,V.gone+dt);
 if(V.aw>=0&&!V.awake){V.aw+=dt;V.pw=Math.max(V.pw,V.aw>=AW_END?1e9:pulseX(V.aw*AW_S)*(V.aw>1.4?1:0));
  V.wake=awP(1.2,6.8);V.dip=Math.max(0,V.dip-dt*.1);
  if(V.aw>=AW_END){V.awake=1;V.stt='play';V.pw=1e9;V.wake=1;V.dip=0;V.lock=AW_GONE;V.gone=-0.001;
   // the pulse ends at the Great Tree. it runs to aw<20 so px is already there and this is just a safety net -
   // no big jump here, because a one-frame jump spikes ax and the engine reads it as leaving.
   if(V.lay===0&&V.px<GT-300){V.px=GT-120;V.vx=0}V.cy=Math.min(V.cy,200);spark(V.px,FL+100,C.gd,40);AM.sfx('world-complete');say(V.px,'THE ORCHARD IS AWAKE');note('The orchard is awake. Climb out, and walk to the Great Tree.')}}
 else if(V.awake){V.wake=1;V.aw=Math.max(V.aw,AW_END)}
 // lighting
 const nP=V.f.filter(f=>f.pl).length,nS=V.f.filter(f=>f.sealed).length,tg=V.awake||V.aw>=3?1:Math.min(.7,.16+.1*nP+.1*nS+.14*V.ringN);V.lv+=(Math.max(tg,V.wake)-V.lv)*(1-Math.exp(-1.5*dt));V.cl+=((V.awake||V.aw>=3?1:V.ringN?.5:.3)-V.cl)*(1-Math.exp(-1.5*dt));
 // the Tender
 {const [gx,gl_]=tTarget(),want=gx+Math.sin(T*.4)*40;if(V.tl!==gl_){V.tl=gl_;V.tx=gx}else if(Math.abs(V.tx-gx)>1500&&Math.abs(V.tx-V.px)>900)V.tx=gx;
  const dd=want-V.tx;V.tx+=Math.sign(dd)*Math.min(Math.abs(dd),110*dt);V.tf=Math.sign(dd)||V.tf}
 if(V.lay===0&&V.sky&&V.py>=690&&V.px>5260&&!V.shapeSeen&&V.stt==='play'){V.shape=1;V.shapeSeen=1;AM.sfx('card-reveal')}
 // quiet hints
 if(V.f.some(f=>f.pl&&f.g>=1&&!f.sealed)&&!V.leakSaid&&Math.abs(V.tx-V.px)<700){V.leakSaid=1;say(V.tx,'I CAN READ THAT FROM HERE',140)}
 // the final walk
 if(K.e){K.e=0;if(V.dlg)advance();else if(V.endWait){V.endWait=0;V.endGo&&V.endGo()}else if(V.stt==='play'&&!V.fade&&V.lock<=0&&!V.shape)act();else if(V.shape&&V.shapeT>2)V.shape=0}
 if(V.shape){V.shapeT=(V.shapeT||0)+dt}else V.shapeT=0;
 const rm=V.lay===1?-2:V.lay===2?-3:V.py>600?-4:Z.filter(x=>V.px>=x).length-1;if(rm!==V.room){V.room=rm;V.rt=3}V.rt-=dt;V.mt-=dt;if(V.endWait&&V.mt<1.2)V.mt=1.2;V.bad=Math.max(0,V.bad-dt);
 if(V.dlg&&V.dlg.c<V.dlg.L[V.dlg.i].length)V.dlg.c+=dt*46;
 if(V.awake&&V.lay===0&&V.px>GT-40&&!V.done){V.done=1;V.stt='done';V.vx=0;spark(V.px,100,'#ffffff',44);AM.sfx('collectible');
  const seq=['The orchard was never growing things. It was keeping score without keeping names.',EDU];const me=V;
  // Two beats, each advanced by the player instead of a fixed 8s / 21s timer, and skipped entirely on a
  // revisit (a player who already finished used to sit through the whole thing again every entry).
  let beat=0;
  const endGo=()=>{if(V!==me||!V.on)return;clearTimeout(V.endT);V.endT=0;
   if(beat<seq.length-1){beat++;note(seq[beat]);V.mt=Math.max(V.mt,4);V.endWait=1;V.endT=setTimeout(endGo,60000);return}
   if(S.done.orchard){fact('\u2713 ALREADY DISCOVERED');V.endT=setTimeout(()=>{if(V===me)back()},2800)}
   else complete()};
  V.endGo=endGo;
  if(S.done.orchard){fact('\u2713 ALREADY DISCOVERED');V.endT=setTimeout(()=>{if(V===me)back()},2800)}
  else{note(seq[0]);V.mt=Math.max(V.mt,4);V.endWait=1;V.endT=setTimeout(endGo,60000)}}
 let d=120;V.near=null;if(!V.dlg&&V.stt==='play'&&!V.fade&&!V.shape&&V.lock<=0)IA().forEach(o=>{const q=Math.abs(V.px-o.x)*(o.pri?.45:1);if(o.lay===V.lay&&Math.abs(V.py-o.y)<110&&q<d){d=q;V.near=o}});
 // camera: follows you, and the awakening takes it on a tour of the orchard
 const vw=w/U;let tcx=V.px-vw*.42+V.face*60,tcy=V.lay>0?FL:Math.max(0,V.py-130),ks=5;
 // The awakening tour: the pulse carries the PLAYER, not just the camera. The engine's auto-back reads ax = px-cx,
 // so parking the player at the Well while the camera toured the Row threw them off the right edge for seven
 // seconds and bounced the run to the hub. tcx = cxp-vw*.5, so px=cxp puts the player dead centre. We also come
 // up out of the root chamber, since the pulse runs on the surface and the camera is already up there.
 if(V.aw>=0.6&&V.aw<AW_END&&!V.awake){const a=V.aw;let cxp=pulseX(a*AW_S);if(a>=5.6){cxp=GT-120;tcy=Math.max(tcy,200+80*awP(5.6,6.4))}else tcy=0;
  tcx=cxp-vw*.5;ks=3;if(Math.abs(V.cx-tcx)>vw*.5)V.cx=tcx;
  // the ride must run the WHOLE tour. stopping at 19 let the !awake clamp drag px back to the Reach for the last
  // second, and catching up in one frame spiked ax off-screen - a 4-frame bounce, same symptom, smaller.
  V.px=cxp;V.vx=0;if(V.lay!==0){V.lay=0;V.py=0;V.vy=0;V.gr=1}}
 V.cx+=(tcx-V.cx)*(1-Math.exp(-ks*dt));V.cx=Math.max(0,Math.min(LW-vw,V.cx));V.cy+=(tcy-V.cy)*(1-Math.exp(-4*dt));
 V.vp=V.vp.filter(q=>(q.l-=dt)>0);V.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});V.ft=V.ft.filter(f=>(f.l-=dt)>0);if(V.thread)V.thread.t+=dt;
 ax=X(V.px);tx=V.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}

// ======================= drawing =======================
function wrap(s,mw){const ln_=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln_.push(l);l=w}else l=t});ln_.push(l);return ln_}
function bubble(s,x,y,col,mw,a){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),lns=wrap(s,mw),lh=fs*1.4,bw=Math.max(...lns.map(l=>g2.measureText(l).width))+18,bh=lns.length*lh+12,bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;g2.save();g2.globalAlpha=a==null?1:a;rc(bx,by,bw,bh,'#05060fe8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';lns.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}
const pat=n=>[3+(n*7)%9,3+(n*5)%7,8+(n*11)%14,3+(n*3)%5];
function ringD(x,y,r,tilt,col,al,seed,lw){g2.save();g2.translate(X(x),Y(y));g2.scale(1,tilt);g2.globalAlpha=al;g2.strokeStyle=col;g2.lineWidth=Math.max(1,lw*U/Math.max(.5,tilt));g2.setLineDash(pat(seed).map(v=>v*U));g2.beginPath();g2.arc(0,0,r*U,0,7);g2.stroke();g2.restore()}
function husk(x,y,s,k,a){ // k: 0 dim sealed, 1 open (leaking light), 2 your seal / carried husk
 const sc=k===1?mixc('#c98a2a',C.gd,.4+.3*Math.sin(T*3)):k===2?'#9a5f1c':mixc('#6b4416','#9a5f1c',(Math.sin(x*.37)+1)/2);
 pl([[x-s*.18,y+s*.8],[x+s*.18,y+s*.8],[x+s*.04,y+s*1.6],[x-s*.04,y+s*1.6]],'#3a2614',a);cc(x,y,s,sc,a);cc(x-s*.3,y+s*.3,s*.28,'#ffffff',(a==null?1:a)*.12);
 if(k===1){cc(x,y,s*.55,C.gd,.8);ringD(x,y,s*1.7,1,C.gd,.5,3,1.5)}else if(k===2){cc(x,y,s*.32,pal().ac,.9)}}
function tree(x,hgt,k,dead,litv,fr){const tw=24+hgt*.06,sw=Math.sin(T*.6+k)*3,tc=dead?'#2a312d':mixc('#1a1208','#2a1c0e',litv),cn=dead?mixc('#3a423e','#2f7a45',litv):mixc('#103a22',C.gr,.2+.6*litv);
 pl([[x-tw*1.7,0],[x-tw*.6,hgt*.25],[x+tw*.6,hgt*.25],[x+tw*1.7,0]],tc);pl([[x-tw*.6,hgt*.2],[x-tw*.38,hgt],[x+tw*.38,hgt],[x+tw*.6,hgt*.2]],tc);
 if(!dead||litv>.3)for(let j=0;j<5;j++)cc(x+(j-2)*hgt*.15+sw,hgt+(j%2)*18+hgt*.05,hgt*.19+(j%3)*6,cn,.95);else for(let j=0;j<3;j++)ln(x,hgt*.8,x+(j-1)*hgt*.35,hgt*1.05,tc,5);
 if(litv>.2||!dead)ringD(x,hgt*.4,tw*.45,1,C.cy,.15+.5*litv*(dead?1:.5),k+3,2);
 (fr||[]).forEach((q,i)=>husk(x+q[0],hgt*q[1],6+i%2,0,.95))}
const crownGlow=()=>.2+.5*crownT();

function groundArt(t){const y0=Y(0);rc(0,y0,W_,Math.max(0,H_-y0)+4,'#150f09');
 for(let k=0;k<9;k++){const yy=Y(-30-k*55);if(yy>0&&yy<H_)rc(0,yy,W_,1.5*U,k%2?'#1d150c':'#0f0a06')}
 rc(0,y0,W_,7*U,'#1b3d26');rc(0,y0,W_,2*U,'#2f7a45');
 // voids: the study and the root chamber are hollows under the orchard
 [[STB,'#05100b'],[CHB,'#040e0a']].forEach(([b,c])=>{if(!onS((b[0]+b[1])/2,900))return;rr(b[0],-36,b[1]-b[0],-FL+8,c);rr(b[0],FL+5,b[1]-b[0],14,'#0d1812');rr(b[0],FL+5,b[1]-b[0],3,'#1f4a2e')});
}
function sapArt(t){const lv=V.lv,k=V.pulse,x0=Math.max(0,V.cx-100),x1=Math.min(LW,V.cx+W_/U+100);g2.save();g2.lineCap='round';
 [[-70,10,34,.5],[-115,14,22,.3]].forEach(([yb,amp,sp,al],ri)=>{g2.setLineDash([14*U,22*U]);g2.lineDashOffset=-t*sp*U;g2.strokeStyle=C.cy;g2.lineWidth=(3-ri)*U;g2.globalAlpha=Math.min(1,(.1+.55*lv)*(ri?.7:1)+al*.1);g2.beginPath();let first=1;for(let x=x0;x<=x1;x+=40){const y=yb+Math.sin(x*.012+ri)*amp;if(first){g2.moveTo(X(x),Y(y));first=0}else g2.lineTo(X(x),Y(y))}g2.stroke()});
 g2.setLineDash([]);g2.globalAlpha=1;
 // roots up to every tree in the row; the planted ones glow
 for(let p=1;p<=12;p++){const x=PXo(p);if(!onS(x,100))continue;const f=plotFruit(p);if(!(f||isTree(p)))continue;ln(x,0,x+30,-70+Math.sin(x*.012)*10,C.cy,2,(.15+.5*lv)*(f?1:.6))}
 if(k){const fx=k.x+(ELD-k.x)*Math.min(1,k.t/1.4);gl(fx,-60,60,C.cy,.9);gl(ELD,-40,100,C.cy,Math.min(1,k.t)*.8)}
 g2.restore()}
function elderArt(t){if(!onS(ELD,700))return;const cl=crownC(),lv=V.lv;
 pl([[ELD-150,0],[ELD-60,150],[ELD-62,440],[ELD+62,440],[ELD+60,150],[ELD+150,0]],'#1b130a');pl([[ELD-150,0],[ELD-40,100],[ELD-100,40]],'#241a0e');pl([[ELD+150,0],[ELD+40,100],[ELD+100,40]],'#241a0e');
 for(let i=0;i<9;i++)ln(ELD-45,60+i*38,ELD-45+20+(i%3)*12,60+i*38,C.cy,2,.12+.35*lv);for(let i=0;i<7;i++)ln(ELD+20,70+i*46,ELD+36+(i%2)*12,70+i*46,C.cy,2,.12+.35*lv);
 ringD(ELD+5,300,34,1,C.cy,.2+.5*lv,7,2);ringD(ELD-10,200,24,1,C.cy,.2+.4*lv,12,2);
 const cy0=470;[[-200,0,150],[-100,70,170],[0,110,190],[110,60,170],[210,-5,150],[0,20,200]].forEach((q,i)=>{const c2=mixc('#06190f',cl,.15+.1*i%3*.1);pl([[ELD+q[0]-q[2],cy0+q[1]],[ELD+q[0]-q[2]*.35,cy0+q[1]+q[2]*.7],[ELD+q[0]+q[2]*.4,cy0+q[1]+q[2]*.75],[ELD+q[0]+q[2],cy0+q[1]],[ELD+q[0],cy0+q[1]-q[2]*.4]],mixc(c2,'#0b2a1f',.45),.96)});
 for(let i=0;i<12;i++){const a=i*.9+t*.2;ln(ELD,520,ELD+Math.cos(a)*260,520+Math.sin(a)*90+30,cl,2,.12+.25*crownT())}
 for(let i=0;i<5;i++)husk(ELD-170+i*85,380+(i%2)*40,9,0,.9);
 if(V.seedDrop===1){const q=Math.min(1,V.seedT/1.6);cc(ELD-50+(SEEDX-(ELD-50))*q,500-(500-12)*q*q,6,C.cy);gl(ELD-50+(SEEDX-(ELD-50))*q,500-(500-12)*q*q,30,C.cy,.6)}
 else if(V.seedDrop===2&&!V.seedTaken){cc(SEEDX,10,7,C.cy);gl(SEEDX,10,45,C.cy,.5+.3*Math.sin(t*3))}}
function stationArt(t){if(!onS(1150,500))return;
 rr(960,150,14,150,C.br);rr(1330,150,14,150,C.br);pl([[935,152],[1365,152],[1335,205],[965,190]],'#2a1d10');rr(950,1,420,14,'#1b130a');
 rr(1000,145,70,60,'#23190e');for(let i=0;i<9;i++)ln(1008+(i%3)*20,190-Math.floor(i/3)*16,1018+(i%3)*20,190-Math.floor(i/3)*16,C.pc,2,.6);
 [1110,1150].forEach((x,i)=>{pl([[x-20,0],[x+20,0],[x+26,34],[x-26,34]],'#3a2a14');rr(x-24,36,48,3,'#1b130a')});
 rr(1235,115,60,6,C.st);ln(1250,115,1250,70,'#6a5a3a',3);ln(1250,115,1262,60,'#6a5a3a',3);ln(1280,115,1272,72,'#6a5a3a',3);
 rr(1350,0,70,7,'#2a1d10');rr(1355,7,60,3,'#15100a');cc(1385,9,3,C.gy);
 cc(1050,200,5,C.am);gl(1050,200,90,C.am,.35)}
function edgeArt(t){if(!onS(400,500))return;
 pl([[235,0],[235,330],[285,330],[290,0]],C.st);pl([[375,0],[378,290],[430,290],[430,0]],C.st);pl([[225,330],[300,350],[330,330],[330,310],[225,310]],'#33372f');
 for(let i=0;i<6;i++){ringD(260,60+i*48,14,1,C.cy,.15+.35*V.lv,i+1,2);ringD(404,50+i*44,13,1,C.cy,.15+.35*V.lv,i+9,2)}
 for(let i=0;i<7;i++)ln(240+i*30,330,235+i*34+Math.sin(t+i)*4,200-i*8%40,'#1f4a2e',4,.9);
 for(let k=0;k<5;k++)pl([[620+k*60,0],[625+k*60,40],[640+k*60,0]],'#1f4a2e')}
function rowArt(t){if(!onS(3100,1100))return;
 rr(2250,-3,1650,10,'#0d3a33');g2.setLineDash([10*U,18*U]);g2.lineDashOffset=-t*30*U;g2.strokeStyle=C.cy;g2.globalAlpha=.2+.4*V.lv;g2.lineWidth=2*U;g2.beginPath();g2.moveTo(X(2250),Y(1));g2.lineTo(X(3900),Y(1));g2.stroke();g2.setLineDash([]);g2.globalAlpha=1;
 for(let p=1;p<=12;p++){const x=PXo(p);if(!onS(x,200))continue;const f=plotFruit(p),lit=V.pw>=x,L=Math.max(V.lv,lit?1:0),i=V.f.indexOf(f);
  rr(x+40,18,10,18,C.st);
  if(f){const g=f.g;if(g<.1){cc(x,6,7,C.cy);gl(x,6,40,C.cy,.5)}else{tree(x,40+210*g,p+11,0,Math.max(L,.5),null)
    const hh=40+210*g;if(g>=1&&!f.picked&&!f.sealed){husk(x+24,hh*.74,8,1,1)}
    if(f.twin){husk(x+24,hh*.74,8,2,1);gl(x+24,hh*.74,50,C.am,.3+.2*Math.sin(t*2))}}}
  else if(isTree(p)){const h2=200+((p*53)%110);tree(x,h2,p,0,L,[[22,.7],[-24,.58],[8,.86]].slice(0,2+p%2))}
  else{ // the scar / empty soil
   const scar=p===SCAR||V.cut[p];
   if(scar){pl([[x-26,0],[x-18,46],[x+10,60],[x+24,30],[x+30,0]],'#2a231c');pl([[x-10,60],[x+4,84],[x+10,60]],'#2a231c');
    ringD(x,150,70,1,C.cy,.15+.35*(lit?1:.2),5,2);ln(x,60,x,300,C.cy,2,.12+.4*(lit?1:0));
    if(p===SCAR&&V.study){gl(x+55,22,60,C.cy,.5+.3*Math.sin(t*2));pl([[x+35,0],[x+75,0],[x+70,38],[x+40,38]],'#05100b')}}
   else{pl([[x-30,0],[x-10,10],[x+10,10],[x+30,0]],'#241a0e');if(p===nextFree()&&(V.pouch[0]||V.pouch[1])){gl(x,6,36,C.cy,.15+.15*Math.sin(t*2))}}}}
 }
function canopyArt(t){if(!onS(4700,900))return;
 // the great hollow trunk the walk climbs around
 pl([[4600,0],[4640,330],[4640,560],[4960,560],[4960,330],[5020,0]],'#120c07');pl([[4600,0],[4560,60],[4640,120]],'#1b130a');pl([[5020,0],[5070,60],[4960,120]],'#1b130a');
 rr(4650,420,300,170,'#05100b');rr(4650,590,300,10,'#1b130a');
 for(let i=0;i<7;i++){const x=4670+i*42,dh=40+((i*37)%90);ln(x,590,x,590-dh,C.am,3,.5);cc(x,590-dh,4,C.am,.8)}
 // platforms: roots and branches
 PLAT.forEach((q,i)=>{const [x,w,tp]=q;pl([[x-8,tp-24],[x+w+8,tp-24],[x+w,tp],[x,tp]],'#1b130a');rr(x,tp,w,6,'#1f4a2e');rr(x+4,tp-4,w-8,3,'#3a2614');ln(x+w*.3,tp-24,x+w*.3,0,'#120c07',10,.6)});
 // the pedestal, and the resin
 const ped=V.ped!==null;rr(HOLX-18,372,36,32,'#2a1d10');pl([[HOLX-26,340],[HOLX+26,340],[HOLX+14,376],[HOLX-14,376]],'#2a1d10');
 if(ped){const r=V.resin;husk(HOLX,402,13,1,1);cc(HOLX,402,(16+10*r)*(1),C.am,.35*r);gl(HOLX,400,80,C.am,.25+.4*r)}
 if(V.sky)SKYP.forEach(q=>{const [x,w,tp]=q;pl([[x,tp-18],[x+w,tp-18],[x+w-6,tp],[x+6,tp]],'#12331f');rr(x,tp,w,5,'#2f7a45');for(let k=0;k<5;k++)ln(x+k*w/5,tp,x+k*w/5+6,tp-28,C.gr,3,.9);ln(x,tp-18,x-4,tp-70,C.cy,2,.15+.2*Math.sin(t+x))});
 if(V.sky&&onS(5400,300)){rr(5240,700,320,6,'#1f4a2e');gl(5400,740,140,C.cy,.2)}}
function reachArt(t){if(!onS(6200,1100))return;
 // ravine and the root-bridge that regrows
 rr(6050,2,300,400,'#030a07');const bw=Math.max(0,Math.min(1,(V.pw-6050)/300));
 for(let k=0;k<9;k++){const x=5920+k*95;if(x>6020&&x<6380)continue;const lit=V.pw>=x,h2=190+((k*47)%80);tree(x,h2,k+30,1,lit?1:0,null)}
 if(bw>0){pl([[6050,0],[6050+300*bw,0],[6050+300*bw,-12],[6050,-18]],mixc('#3a2614','#4a3418',bw));for(let k=0;k<Math.floor(bw*10);k++)ln(6050+k*30,0,6050+k*30,-26,C.cy,2,.5)}
 else{ln(6050,0,6100,-30,'#3a2614',6);ln(6350,0,6300,-30,'#3a2614',6)}}
function greatArt(t){if(!onS(GT,800))return;const op=awP(5.6,7.6),gw=awP(4.4,6.8);
 pl([[GT-340,0],[GT-220,200],[GT-210,640],[GT+210,640],[GT+220,200],[GT+340,0]],'#0e0a06');
 for(let i=0;i<12;i++){ln(GT-180+i*30,40+i*14%120,GT-176+i*30,600,C.cy,2,.06+.4*gw)}
 for(let i=0;i<7;i++)ringD(GT,150+i*70,60-(i%3)*10,1,C.gd,.1+.5*gw,i*3,2);
 // the canopy: two halves that open like an iris
 const sx=op*300;[[-1,'#07180f'],[1,'#08200f']].forEach(([s,c])=>{for(let j=0;j<5;j++)cc(GT+s*(90+j*95+sx),700+(j%2)*50-j*6,150+(j%3)*20,mixc(c,'#1f5a35',gw*.6),.97)});
 if(op>0){gl(GT,860,520*op+80,C.gd,.5*op);for(let k=0;k<5;k++){const a=-.5+k*.25;pl([[GT-40,700],[GT+40,700],[GT+40+Math.sin(a)*520,0],[GT-40+Math.sin(a)*520,0]],C.gd,.07*op)}}
 // the hollow: the way out
 rr(GT-48,230,96,230,'#04100a');rr(GT-48,230,96,6,'#1f4a2e');gl(GT,120,190*(.3+gw),C.gd,.2+.6*gw);
 for(let k=0;k<5;k++)pl([[GT-48+k*14,k*10],[GT+48-k*14,k*10],[GT+48-k*14,k*10+10],[GT-48+k*14,k*10+10]],mixc('#2a1d10',C.gd,gw*.7));
 if(V.awake)T2('\u25C8',GT,170,C.gd,26)}
function trunksArt(t){const L=V.lv;for(let k=0;k<12;k++){const wx=k*760+110,sx=(wx-V.cx*.55)*U,w2=(90+(k%3)*50)*U;if(sx<-w2*2||sx>W_+w2)continue;
 rc(sx-w2/2,0,w2,Y(0),mixc('#06150e','#0d2a1c',L*.3+(k%2)*.1));pl([[(wx-V.cx*.55)-w2/U*.7,0],[(wx-V.cx*.55)-w2/U*.3,90],[(wx-V.cx*.55)+w2/U*.3,90],[(wx-V.cx*.55)+w2/U*.7,0]].map(q=>[q[0]+V.cx,q[1]]),'#0a1f15',.9);
 }
 const g=g2.createLinearGradient(0,0,0,H_*.35);g.addColorStop(0,'rgba(2,10,6,.78)');g.addColorStop(1,'rgba(2,10,6,0)');g2.fillStyle=g;g2.fillRect(0,0,W_,H_*.35)}
function studyArt(t){if(!onS(1550,900))return;
 for(let k=0;k<5;k++){rr(1110+k*8,FL+250,6,200,'#1b130a')}
 rr(1230,FL+110,70,8,C.br);rr(1245,FL+118,6,110,'#2a1d10');rr(1240,FL+118,50,6,C.pc);T2('LEDGER',1265,FL+150,'#8a867c',8);
 rr(1340,FL+240,80,130,'#0d2a1c');rr(1340,FL+240,80,4,C.st);for(let i=0;i<5;i++)pl([[1350,FL+330-i*16],[1362,FL+340-i*16],[1374,FL+330-i*16]],C.am,.5);ln(1360,FL+230,1400,FL+230,C.cy,3,.8);cc(1380,FL+280,22,'#0b2a1f');
 // thread wall
 rr(1440,FL+270,150,160,'#150f09');for(let i=0;i<6;i++){cc(1456+i*25,FL+250,6,'#6a5a3a');cc(1456+i*25,FL+120,6,C.cy,.6)}
 const th=V.thread;for(let i=0;i<6;i++)for(let j=0;j<6;j++)ln(1456+i*25,FL+250,1456+j*25,FL+120,C.pc,1,.18+(th&&th.t<2?.2:0));
 if(th&&th.t<2.5){const m=Math.min(1,th.t);for(let j=0;j<6;j++)ln(1456,FL+250,1456+j*25*m,FL+120,C.cy,2,(1-th.t/2.5)*.9)}
 rr(1634,FL+200,4,60,C.br);ln(1636,FL+198,1636,FL+160,C.pc,1,.8);
 pl([[1762,FL+60],[1798,FL+60],[1802,FL+120],[1758,FL+120]],'#1a2a22',.7);if(!V.jar){cc(1780,FL+84,6,C.cy);gl(1780,FL+84,50,C.cy,.5+.2*Math.sin(t*2))}
 rr(1870,FL+250,34,60,'#2a1d10');cc(1887,FL+230,8,V.lantern?C.gd:'#3a2a14');if(V.lantern)gl(1887,FL+230,200,C.gd,.5);
 ln(1960,FL+10,1960,-30,C.br,5);for(let i=0;i<6;i++)ln(1948,FL+30+i*55,1972,FL+30+i*55,C.br,3);ln(1140,FL+10,1140,-30,C.br,5);for(let i=0;i<6;i++)ln(1128,FL+30+i*55,1152,FL+30+i*55,C.br,3);
 rr(1120,-26,40,12,V.hatch?'#0d1812':'#2a1d10');gl(1550,FL+160,500,C.am,.07+(V.lantern?.12:0))}
function chamberArt(t){if(!onS(5000,1000))return;const cl=V.cl;
 // cathedral of roots
 for(let k=0;k<9;k++){const x=4040+k*190;const lean=(k%2?-1:1)*30;pl([[x-26,FL],[x+lean-14,-30],[x+lean+14,-30],[x+26,FL]],'#10281a');ln(x+lean,-34,x+190*.5+lean/2,-110,'#10281a',16,.9)}
 // the well
 pl([[WELL-190,FL],[WELL-150,FL+40],[WELL+150,FL+40],[WELL+190,FL]],'#1a2a22');rr(WELL-150,FL+40,300,6,'#2f4a3a');
 g2.fillStyle='#02080a';g2.beginPath();g2.ellipse(X(WELL),Y(FL+36),140*U,30*U,0,0,7);g2.fill();
 for(let i=0;i<18;i++){const a=i/18*6.28;cc(WELL+Math.cos(a)*170,FL+34+Math.sin(a)*14,5,C.cy,.2+.4*cl)}
 // stair up
 for(let k=0;k<7;k++){pl([[4000+k*40,FL+k*52],[4040+k*40,FL+k*52],[4040+k*40,FL+k*52+14],[4000+k*40,FL+k*52+14]],'#241a0e')}
 ln(4000,FL+380,4000,-36,'#241a0e',6,.7)}
function ringsArt(t){if(!onS(WELL,800))return;const cl=V.cl;
 gl(WELL,FL+120,380,C.cy,.15+.35*cl);
 for(let k=0;k<NLOW+V.ringN;k++){const mine=k>=NLOW,ri=mine?V.order[k-NLOW]:-1;if(mine&&V.ref&&V.ref.i===ri&&V.ref.t<2.6)continue;
  const a=mine?200+ri*80:90+((k*41)%190),ht=mine?150+ri*40:60+((k*53)%230),sp=mine?.12:.1+(k%7)*.03*(k%2?1:-1),ph=k*1.7,an=t*sp+ph;
  const x=WELL+Math.cos(an)*a,y=FL+ht+Math.sin(an)*a*.18,r=mine?24:12+((k*13)%22);
  ringD(x,y,r,.4+(k%5)*.1,mine?pal().ac:C.cy,mine?.95:.2+.5*cl,mine?101+ri*101:k,mine?3:1.6);if(mine)gl(x,y,60,pal().ac,.25)}
 // first offering: roots check the grove all at once, a veil settles, a ring is born
 if(V.off){const q=V.off,tt=q.t;
  if(tt<1.9){const hy=FL+110+10*Math.sin(tt*4);husk(WELL,hy,13,2,1);g2.globalAlpha=Math.min(1,tt);ringD(WELL,hy,34,1,C.cy,.9,101+q.i*101,3);
   for(let i=0;i<14;i++){const x=4100+i*110;ln(x,FL+20,x+Math.sin(i)*30,-20,C.cy,2,Math.min(1,tt*.7)*.7);if(tt>.8)ln(x+Math.sin(i)*30,-20,x+Math.sin(i)*30,200,C.cy,2,Math.min(1,(tt-.8))*.5)}}
  else{const u=Math.min(1,(tt-1.9)/1.5);ringD(WELL,FL+110+u*60,34,.6,pal().ac,1-u*.2,101+q.i*101,3);if(u<.8)cc(WELL,FL+110,12*(1-u),'#9a5f1c',1-u)}}
 // the refusal: the ring that is already here swings down and meets the husk. same pattern. same bell.
 if(V.ref){const q=V.ref,tt=q.t,i=q.i,k=NLOW+V.order.indexOf(i),a=200+i*80,ht=150+i*40,an=t*.12+k*1.7,ox=WELL+Math.cos(an)*a,oy=FL+ht+Math.sin(an)*a*.18,hy=FL+110;
  const m=tt<.9?tt/.9:tt<1.4?1:Math.max(0,1-(tt-1.4)/1.2),px_=ox+(WELL-ox)*m,py_=oy+(hy-oy)*m;
  husk(WELL,hy,13,2,tt>1.4?.5:1);ringD(WELL,hy,34,1,C.cy,.9,101+i*101,3);ringD(px_,py_,24+10*m,.4+.6*m,pal().ac,1,101+i*101,3);gl(px_,py_,70,pal().ac,.4);
  if(tt>.9&&tt<1.7){gl(WELL,hy,200,'#ffffff',(1.7-tt)*.7)}
  }
}
function tenderArt(t){if(V.tl!==V.lay)return;const x=V.tx,y=V.tl===2?FL:0,f=V.tf||1;if(!onS(x,120))return;
 pl([[x-24,y],[x-16,y+78],[x+16,y+78],[x+24,y]],'#1a2a1c');pl([[x-14,y+70],[x,y+104],[x+14,y+70]],'#243a26');cc(x,y+86,9,'#0a1209');
 for(let i=0;i<5;i++)cc(x-16+i*8,y+14+(i%2)*10,4,C.gr,.7);
 const lx=x+f*26,ly=y+52+Math.sin(t*2)*3;ln(x+f*14,y+64,lx,ly+10,'#3a2614',2);cc(lx,ly,6,C.am);gl(lx,ly,60+20*V.lv,C.am,.5);
 if(V.hasShears)ln(x-f*14,y+40,x-f*22,y+56,C.pc,3);
 T2('THE TENDER',x,y+128,C.gd,10)}
function motesArt(t){// open fruit leaks its light toward whoever is looking: anyone can read it
 const src=[];V.f.forEach(f=>{if(f.pl&&f.g>=1&&!f.picked&&!f.sealed)src.push([f.x+24,(40+210)*.74,0])});
 if(V.hand&&V.hand.k==='open'&&!V.gone)src.push([V.px,V.py+PH*.8,0]);if(V.ped!==null&&!V.sealing)src.push([HOLX,402,0]);
 src.forEach((s,si)=>{if(V.tl!==V.lay&&V.lay>0)return;const tx2=V.tx+(V.tf||1)*26,ty2=52+10;for(let i=0;i<7;i++){const u=(t*.22+i/7+si*.13)%1,x=s[0]+(tx2-s[0])*u,y=s[1]+(ty2-s[1])*u+Math.sin(u*6.28+i)*26*(1-u);if(onS(x,60))cc(x,y,2.5,C.gd,.8*(1-u*.6))}})}
function lightArt(t,w,h){ // darkness over the solids, lifted as the orchard comes back
 g2.fillStyle='rgba(2,10,7,'+((1-V.lv)*.5)+')';g2.fillRect(0,0,w,h);
 const wk=V.wake;if(wk>0){const g=g2.createLinearGradient(0,0,0,Y(0));g.addColorStop(0,'rgba(15,90,74,'+wk*.18+')');g.addColorStop(1,'rgba(240,168,80,'+wk*.28+')');g2.fillStyle=g;g2.fillRect(0,0,w,h)}
 // dim the chamber until it is time
 if(V.lay===2||onS(WELL,900)){g2.fillStyle='rgba(2,8,6,'+((1-V.cl)*.4)+')';const a=X(CHB[0]),b=X(CHB[1]),y0=Y(-30),y1=Y(FL-60);g2.fillRect(a,y0,b-a,y1-y0)}}
function crownArt(t){gl(ELD,520,520+200*crownT(),crownC(),crownGlow()*.5);if(V.dip>0)gl(ELD,520,200,C.rd,V.dip*.6)}
// ---- VISUAL POLISH (render-only; reads V.lv / V.cx only to tint and scroll) ----
const Zp=window.ZKP;
const oWorld=f=>{g2.save();g2.translate(-V.cx*U,GY+V.cy*U);g2.scale(U,U);f();g2.restore()};   // world units, y up is negative (matches Y())
function oTrunks(t){if(!Zp)return;const L=V.lv,y0=Y(0);g2.save();
 for(let k=0;k<12;k++){const wx=k*760+110,sx=(wx-V.cx*.55)*U,w2=(90+(k%3)*50)*U;if(sx<-w2*2||sx>W_+w2)continue;const x0=sx-w2/2,h=Math.max(0,y0);
  g2.strokeStyle='#020a06';g2.lineWidth=Math.max(1,1.6*U);g2.globalAlpha=.4;g2.beginPath();                                                                   // bark fissures
  for(let q=0;q<5;q++){const lx=x0+(q+.5)*w2/5,top=h*(.08+Zp.hash(k*5+q)*.25);g2.moveTo(lx,top);for(let s=1;s<=5;s++)g2.lineTo(lx+Math.sin(k*3+q*2+s)*w2*.035,top+(h-top)*s/5)}g2.stroke();
  g2.globalAlpha=.1+.22*L;g2.fillStyle=C.cy;g2.fillRect(x0,0,2*U,h);g2.globalAlpha=.4;g2.fillStyle='#000';g2.fillRect(x0+w2-3*U,0,3*U,h);                         // rim light grows with the grove
  g2.globalAlpha=.55;g2.fillStyle='#1f4a2e';for(let m=0;m<2;m++){g2.beginPath();g2.ellipse(x0+w2*(.3+.4*m),y0-(50+Zp.hash(k+m)*120)*U,w2*.14,6*U,0,0,7);g2.fill()}g2.globalAlpha=1}   // moss
 g2.restore()}
function oGroundX(t){if(!Zp)return;const y0=Y(0);if(y0<-20||y0>H_+20)return;const x0=V.cx-60,x1=V.cx+W_/U+60,L=V.lv;
 oWorld(()=>{const dMax=Math.min(220,Math.max(40,(H_-y0)/U));Zp.grit(g2,x0,x1,14,dMax,36,'#2a1d10',.7,3,3,.3);Zp.grit(g2,x0,x1,14,dMax,53,'#3a2a16',.5,8,2,.25);
  g2.strokeStyle='#2a1c0e';g2.lineWidth=1.8;g2.globalAlpha=.8;g2.beginPath();for(let wx=Math.ceil(x0/53)*53;wx<x1;wx+=53){if(Zp.hash(wx*.11)<.5)continue;const d=20+Zp.hash(wx)*40;g2.moveTo(wx,6);g2.quadraticCurveTo(wx+8,6+d*.5,wx+Zp.hash(wx*3)*18-6,6+d)}g2.stroke();   // roots hanging under the lip
  g2.strokeStyle=mixc('#2f7a45',C.cy,L*.4);g2.lineWidth=1.5;g2.globalAlpha=.9;g2.beginPath();for(let wx=Math.ceil(x0/22)*22;wx<x1;wx+=22){const h=5+Zp.hash(wx*.29)*10,sw=Math.sin(t*1.2+wx*.07)*2.2;g2.moveTo(wx,0);g2.quadraticCurveTo(wx+sw*.4,-h*.6,wx+sw,-h)}g2.stroke();   // grass
  g2.fillStyle='#4a6a2a';g2.globalAlpha=.8;for(let wx=Math.ceil(x0/47)*47;wx<x1;wx+=47)if(Zp.hash(wx*.23)>.6)g2.fillRect(wx,-2.5,6,2.5);                              // fallen leaves
  g2.fillStyle=C.cy;for(let wx=Math.ceil(x0/71)*71;wx<x1;wx+=71){if(Zp.hash(wx*.07)<.45)continue;g2.globalAlpha=(.15+.7*L)*Math.abs(Math.sin(t*1.3+wx));g2.fillRect(wx,-(10+Zp.hash(wx)*16+Math.sin(t+wx)*3),2.5,2.5)}g2.globalAlpha=1})}   // spores: brighter as the grove recovers
function oEdge(t){if(!Zp||!onS(400,500))return;oWorld(()=>{Zp.rows(g2,235,-330,55,330,'#14170f',.6,26,28);Zp.rows(g2,375,-290,55,290,'#14170f',.6,26,28);Zp.edge(g2,235,-330,55,330,C.gy,'#000',.3,1.5);Zp.edge(g2,375,-290,55,290,C.gy,'#000',.3,1.5)})}
function oCanopy(t){if(!Zp||!onS(4800,600))return;oWorld(()=>{g2.strokeStyle='#05100b';g2.lineWidth=1.8;g2.globalAlpha=.4;g2.beginPath();for(let x=4660;x<4950;x+=20){const a=20+Zp.hash(x)*40,b=250+Zp.hash(x*1.3)*70;g2.moveTo(x,-a);g2.lineTo(x+Math.sin(x)*5,-(a+b)/2);g2.lineTo(x,-b)}g2.stroke();
  g2.globalAlpha=.4;g2.strokeStyle=C.gr;g2.lineWidth=2;g2.beginPath();g2.moveTo(4603,-2);g2.lineTo(4642,-330);g2.stroke();g2.strokeStyle='#000';g2.beginPath();g2.moveTo(5017,-2);g2.lineTo(4958,-330);g2.stroke();g2.globalAlpha=1})}   // bark on the great trunk
function oFlies(t){if(!Zp||Y(0)<60)return;Zp.motes(g2,0,0,W_,Y(0),t,26,C.cy,{alpha:.12+.4*V.lv,size:Math.max(1.5,2*U),speed:5,seed:9})}
function scene(w,h,gy,t,p){const v=V;
 if(v.wake>0){const g=g2.createLinearGradient(0,0,0,Y(0));g.addColorStop(0,'#0f5a4a');g.addColorStop(1,'#f0a850');g2.globalAlpha=v.wake*.45;g2.fillStyle=g;g2.fillRect(0,0,w,h);g2.globalAlpha=1}
 trunksArt(t);oTrunks(t);groundArt(t);oGroundX(t);studyArt(t);chamberArt(t);edgeArt(t);oEdge(t);stationArt(t);elderArt(t);rowArt(t);canopyArt(t);oCanopy(t);reachArt(t);greatArt(t);
 lightArt(t,w,h);sapArt(t);crownArt(t);ringsArt(t);motesArt(t);oFlies(t);garyArt(t);tenderArt(t);
 v.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*2);rr(q.x,q.y,q.s,q.s,q.c)});g2.globalAlpha=1;
 v.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),C.cy,240*U,Math.min(1,f.l)))}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0;
 // The awakening dissolve, on the same slice glitch Origin uses for its NPC. V.gone>0 leaves, V.gone<0 returns.
 // Fully gone means NOTHING is drawn - not the sprite, not its shadow, and not the seed it is carrying, which used
 // to stay on screen through the whole tour because the husk drew outside this guard.
 const gk=V.gone?Math.min(1,Math.abs(V.gone)/AW_GONE):0;
 if(gk>=1)return;
 const al=V.gone>0?1-gk:V.gone<0?gk:1;
 g2.globalAlpha=al;g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(V.lay>0?FL:Math.max(0,V.py<2?0:V.py))+3,aw*.38,5*U,0,0,7);g2.fill();g2.globalAlpha=1;
 g2.save();g2.shadowColor=V.ringN?C.gd:C.cy;g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(V.face<0?-(1-idle):1-idle,1+idle);
 // the player is positionally parked under the camera during the tour, so ax never spikes and the engine's
 // auto-back never fires - we are only not drawing them.
 if(V.gone){const sl=6+Math.floor(gk*10);
  for(let i=0;i<sl;i++){const y0=-ph+ph*i/sl,h2=ph/sl+1,j=(i%2?1:-1)*gk*16*U*(.35+((i*37)%7)/7);
   g2.globalAlpha=al;g2.drawImage(pim,-aw/2+j,y0,aw,h2)}
  g2.globalAlpha=1}
 else g2.drawImage(pim,-aw/2,-ph,aw,ph);
 g2.restore();
 if(V.hand&&!V.gone){const k=V.hand.k;husk(V.px+V.face*40,V.py+PH*.55,k==='open'?11:11,k==='open'?1:2,1);if(k==='twin')ringD(V.px+V.face*40,V.py+PH*.55,22,1,C.cy,.8,101,2)}
 if(V.sealing&&!V.gone){const q=Math.min(1,V.sealT/1.6);g2.strokeStyle=C.am;g2.lineWidth=3;g2.beginPath();g2.arc(sx,sy-ph*.5,ph*.7,-1.57,-1.57+6.28*q);g2.stroke()}}
function drawHud(p){g2.textAlign='center';const fs=Math.round(Math.max(13,14*U)),w2=150,bx=W_/2-w2/2;rc(bx,8,w2,fs*2,'#05060fcc');g2.strokeStyle=C.cy;g2.lineWidth=1.5;g2.strokeRect(bx,8,w2,fs*2);
 // seed pouch, hand, rings
 const sd=V.pouch[0]+V.pouch[1];cc2(bx+24,8+fs,sd?C.cy:'#2a3a3a',5*U+2);
 if(V.hand&&!V.gone)cc2(bx+75,8+fs,V.hand.k==='open'?C.gd:V.hand.k==='twin'?C.cy:C.am,5*U+2);else cc2(bx+75,8+fs,'#2a3a3a',5*U+2);
 g2.fillStyle=V.ringN?pal().ac:'#6a7a7a';g2.font=MONO(13);g2.fillText('\u25CB '+(NLOW+V.ringN),bx+118,8+fs+5);
 if(V.rt>0&&V.stt!=='cine'){g2.save();g2.globalAlpha=Math.min(1,V.rt);g2.fillStyle=C.gd;g2.font="400 "+Math.round(Math.max(22,34*U))+"px 'Abril Fatface',serif";g2.fillText(V.room===-2?'THE STUDY':V.room===-3?'THE ROOT CHAMBER':V.room===-4?'THE SKY GROVE':ZN[Math.max(0,V.room)],W_/2,H_*.2);g2.restore()}
 if(V.near)bubble((coarse?'TAP \u270B  ':'[E]  ')+V.near.l,X(V.near.x),Y(V.near.y+260),C.gd,280*U);
 if(V.bad>0){g2.fillStyle='rgba(255,122,74,'+(V.bad*.3)+')';g2.fillRect(0,0,W_,H_)}
 if(V.aw>=0&&V.aw<AW_END&&!V.awake){const b=Math.min(1,V.aw/0.6,(AW_END-V.aw)/0.6)*H_*.09;g2.fillStyle='#000';g2.fillRect(0,0,W_,b);g2.fillRect(0,H_-b,W_,b)}
 if(V.fade){g2.fillStyle='rgba(0,0,0,'+Math.max(0,Math.min(1,V.fade.t))+')';g2.fillRect(0,0,W_,H_)}
 if(V.shape)shapeArt();
 if(V.dlg){const d=V.dlg,im=d.img,ip=im&&im.width;g2.font=MONO(15);const ln=wrap(d.L[d.i].slice(0,Math.floor(d.c)),W_-(ip?100:32));const B=dlgBox(W_,H_,coarse,ln,{img:ip});rc(B.bx,B.by,B.mw,B.bh,'#05060ff2');g2.strokeStyle=C.am;g2.lineWidth=2;g2.strokeRect(B.bx,B.by,B.mw,B.bh);
  if(ip){g2.imageSmoothingEnabled=false;g2.drawImage(im,B.bx+10,B.by+10,64,64)}
  g2.textAlign='left';g2.fillStyle=d.acc||C.am;g2.font=MONO(13);g2.fillText(d.who||'THE TENDER',B.bx+B.ix,B.by+26);g2.fillStyle='#ece8df';g2.font=MONO(15);B.win.forEach((l,i)=>g2.fillText(l,B.bx+B.ix,B.by+B.head+i*B.lh));g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?(B.more?'TAP \u25BC MORE':'TAP TO CONTINUE'):'[E] / CLICK',B.bx+B.mw-12,B.by+B.bh-8)}
 else if(V.mt>0&&V.msg){g2.font=MONO(14);const mw=Math.min(W_-24,640),lns=wrap(V.msg,mw-28),bh=lns.length*22+22,bx2=(W_-mw)/2,by2=H_-bh-(coarse?150:22);g2.save();g2.globalAlpha=Math.min(1,V.mt*2);rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=C.cy;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';lns.forEach((l,i)=>g2.fillText(l,bx2+14,by2+24+i*22));g2.restore()}}
const cc2=(x,y,c,r)=>{g2.fillStyle=c;g2.beginPath();g2.arc(x,y,r,0,7);g2.fill()};
function shapeArt(){ // the secret: the whole shape of the orchard, seen from above
 const a=Math.min(1,V.shapeT*1.2);g2.save();g2.globalAlpha=a;g2.fillStyle='rgba(2,10,7,.93)';g2.fillRect(0,0,W_,H_);
 const cx1=W_*.28,cx2=W_*.72,cyy=H_*.5,s=Math.min(W_,H_)*.2;g2.lineWidth=2;
 // left: many fruit, one crown (a tree of trees)
 g2.strokeStyle=C.am;g2.fillStyle=C.am;const nodes=[[0,-1]],lv=[[0,-1]];let prev=[[0,-1]];
 for(let d=1;d<=4;d++){const n=Math.pow(2,d),cur_=[];for(let i=0;i<n;i++){const px_=(i/(n-1)-.5)*1.9,py_=-1+d*.5;cur_.push([px_,py_]);const par=prev[Math.floor(i/2)];g2.beginPath();g2.moveTo(cx1+par[0]*s,cyy+par[1]*s);g2.lineTo(cx1+px_*s,cyy+py_*s);g2.stroke();g2.beginPath();g2.arc(cx1+px_*s,cyy+py_*s,d===4?4:3,0,7);g2.fill()}prev=cur_}
 g2.beginPath();g2.arc(cx1,cyy-s,9,0,7);g2.fill();
 // right: many rings, no roots (a flat spiral of loose rings)
 g2.strokeStyle=C.cy;for(let i=0;i<40;i++){const an=i*.62,r=8+i*(s/18),x=cx2+Math.cos(an)*r,y=cyy+Math.sin(an)*r*.9;g2.beginPath();g2.arc(x,y,5+(i%4),0,7);g2.stroke()}
 g2.textAlign='center';g2.fillStyle=C.gd;g2.font="400 "+Math.round(Math.max(26,40*U))+"px 'Abril Fatface',serif";g2.fillText('THE WHOLE SHAPE',W_/2,H_*.14);
 g2.font=MONO(16);g2.fillStyle=C.am;g2.fillText('MANY FRUIT. ONE CROWN.',cx1,H_*.86);g2.fillStyle=C.cy;g2.fillText('MANY RINGS. NO ROOTS.',cx2,H_*.86);
 g2.fillStyle='#8a867c';g2.font=MONO(11);g2.fillText(V.shapeT>2?(coarse?'TAP TO CLOSE':'[E] TO CLOSE'):'',W_/2,H_*.94);g2.restore()}

// ======================= wiring into the shared engine =======================
DEC.orchard=function(w,h,gy,t,p){if(!isO()){OLD(w,h,gy,t,p);return}scene(w,h,gy,t,p)};
const _bgo=bg;bg=function(w,h,gy,p){if(isO()){frame(w,h,gy);cam=V.cx*U;_bgo(w,h,gy+V.cy*U*.3,p)}else _bgo(w,h,gy,p)};
const _avo=avatar;avatar=function(w,h,gy,p){if(isO()){drawPlayer(p);drawHud(p)}else _avo(w,h,gy,p)};
const _sto=startWorld;startWorld=function(i){const me=W[i].id==='orchard';if(me)oInit();_sto(i);if(me)$z('wf').innerHTML=''};
const _spo=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spo()};
});

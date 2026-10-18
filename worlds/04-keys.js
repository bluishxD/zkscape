/* ZKSCAPE world 04: THE KEY LIBRARY - an impossible archive. Core verb: REASON.
   Three look-alike keys: the Lens (sees), the Seal (acts), the Drop (receives). A Lens is cut FROM a Seal, never the other way round, and sees only what its Seal controls.
   Same engine hooks as Origin / Proof (bg, avatar, startWorld, stopWorld); all state is local to V. No other world is touched. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
W.push({id:'keys',n:'KEYS',title:'THE KEY LIBRARY',sub:'Seeing is not the same as being allowed.',desc:'An impossible archive records every act. You can read all of it. The vault door is open a crack, so why will it not let you in?',q:'Viewing is not the same as spending.',
 sort:[['',0]], /* engine flag only (as in the other adventure worlds): no default hotspots, this world runs its own loop */
 deep:'In Zcash, a spending key authorizes spending and should stay private. A viewing key lets someone see transaction details without being able to spend, which is useful for audits. Viewing capability is derived from spending authority, not the other way round.'});
A.keys='Keeper Seal';
TH.keys={sky:['#050a22','#101e4e'],moon:[.5,.28,.12,'#d8a84a'],mt:'#070c24',fog:'#6fd8ff',amb:'mote'};
GIANT.keys=function(w,h,gy,t,th,p,c,id,o,f){ring(w*.5+o,gy-h*.35,h*.5,.1,f,t);ring(w*.5+o,gy-h*.35,h*.34,-.15,p.pr,t);for(let i=0;i<14;i++){const a=t*.1+i/14*6.28;tx_('\u25C8',w*.5+Math.cos(a)*h*.62+o,gy-h*.35+Math.sin(a)*h*.4,f,'26px serif')}};
LM.keys=function(x,y,s,c,t,a,B){B();hg.arc(0,0,s*.45,0,7);hg.stroke();B();hg.moveTo(s*.45,0);hg.lineTo(s*1.2,0);hg.moveTo(s*.9,0);hg.lineTo(s*.9,s*.3);hg.stroke()};
const OLD=function(w,h,gy,t,p){const cx=w*.5;for(let i=0;i<5;i++)rc(w*(.12+i*.19),gy-h*.3,60,h*.3,'#101a40');ring(cx,gy-h*.4,h*.25,.1,p.pr,t)};

// ======================= layout (x in world units, y = height above floor) =======================
const LW=7500,HW=30,PH=112,SPD=300,JMP=830,GRAV=2500,PIT=[1100,1480],PF=-118,GAP=[[4720,4980],[5200,5460]],GATE=4450,LIFT=6350,VX=6750,AUX=6860,EYE=6960,LED=7000,HAP=7080,DOOR=7330,DEAD=7286;
const Z=[0,1100,1480,2650,3250,4450,5800,6500],ZN=['ARRIVAL HALL','THE ANNEX','THE READING FLOOR','THE COPY ROOM','THE DISPUTED WING','THE MEZZANINE','THE OBSERVATION BRIDGE','THE VAULT'];
const ZC=['#0d1536','#0a0f2b','#101a40','#2a1c10','#1e1410','#0b1736','#07102a','#1a1408'],FLT=[[PIT[0],110,-85],[PIT[1]-110,110,-85]];
const C={gd:'#d8a84a',pc:'#e8dcc0',cy:'#6fd8ff',br:'#6b4a1e',rd:'#ff7a4a',nv:'#0a1030'};
const EDU='In Zcash, a spending key authorizes spending, so it stays private. A viewing key lets someone see details without spending, useful for audits. SEEING IS NOT SPENDING. An address only receives, and a unified address bundles several receiver types into one string. Unified addresses arrived with the NU5 upgrade in 2022.';
let V=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,e:0},coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const X=x=>(x-V.cx)*U,Y=y=>GY-y*U,rr=(x,y,w,h,c)=>rc(X(x),Y(y),w*U,h*U,c),isK=()=>run&&cur&&cur.id==='keys'&&V&&V.on;
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),mixc=(a,b,t)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace',T2=(s,x,y,c,n)=>tx_(s,X(x),Y(y),c,MONO(n));
// ======================= TOKEN SHARK: the one who came to the library to be glad about it =======================
// He is not here to explain a key. He is here because somebody finally walked in and looked at the shelves
// before the desk. Everything he says is books, volume counts and margins - and he is wrong about the
// library in the cheerful way a happy person is wrong about a thing they have never had tested.
// NPCA is zkSNARK's own extract()[0] - the house NPC accent. Every NPC glow, drop shadow and name tag
// uses this instead of its own sprite colour, so all the characters read the same way.
const NPCA='#ffffff',TSX=1850;
let TS=null,TS_PAL=['#7fe0cc','#d6f7ec','#ffd35a'];{const im=new Image();im.onload=()=>{try{const c=typeof removeBg==='function'?removeBg(im):im;c.complete=true;if(!c.width)c.width=im.width;if(!c.height)c.height=im.height;TS=c;try{const p=extract(c)[0];if(Array.isArray(p)&&p[0]&&/^#[0-9a-f]{6}$/i.test(p[0]))TS_PAL=p}catch(e){}}catch(e){TS=im}};im.src='NPCs/tokenshark_clean.png'}
function tsLines(){
 if(V.vault||V.seen)return['THE LANDING IS LIT. I can see it from the reading floor, and I have wanted to see that room full for eleven years.','Go on. Somebody has to stay up here and keep count.','I am always here. That is mostly the problem.'];
 if(V.au===2)return['You gave him a copy. You gave him a COPY.','He still will not open a book. He checks the shelf marks. I checked them wrong once, on purpose, and he noticed in four minutes.','You are the first person to bring that man something he had to take.'];
 if(V.lent)return['Oh. Oh, no.','He signed it while he was holding your Seal. That is the entire trick - one hand, one mark, and a room nobody has read in a decade is empty for good.','It is a very small mark. It is much too small for what he just did.'];
 if(V.lens===2)return['Gold and cyan in one key. Both at once. Nobody has cut that in here before.','Keep hold of the one that spends. The one that only looks is the one you can afford to lose.'];
 if(V.lens)return['Oh - you have one. Careful, careful, that is not ours to hold.','A Lens looks. It cannot move a page, cannot spend, cannot even turn a corner. The politest instrument ever cut.','He has one too. He has had it since the day they appointed him.'];
 if(!V.tsm){V.tsm=1;return['OH. OH - someone! Someone who walks in and looks UP before they look at the desk.','Forty-one thousand volumes. I know because I counted them twice. Once for pleasure, and once because I did not believe the first count.','Everyone else goes straight for the desk. You went for the shelves. I am going to be thinking about that all afternoon.']}
 return['Still here! Good. I was worried the shelves had eaten you.','It is very quiet when nobody reads. I had got used to it. I had also got rather good at it, which is worse.'];}
function drawShark(t){const sx=X(TSX);if(sx<-140||sx>W_+140)return;const sy=Y(0),h=PH*U*.95,w=h*(TS&&TS.width?TS.width:520)/(TS&&TS.height?TS.height:520),hop=Math.abs(Math.sin(t*2.1))*6*U;
 g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,sy+3,w*.36,5*U,0,0,7);g2.fill();
 const cy=sy+h*.55,g=g2.createRadialGradient(sx,cy,0,sx,cy,h*1.2);g.addColorStop(0,NPCA+'38');g.addColorStop(1,NPCA+'00');g2.fillStyle=g;g2.fillRect(sx-h*1.3,cy-h*1.3,h*2.6,h*2.6);
 if(TS&&TS.width){g2.save();g2.shadowColor=NPCA;g2.shadowBlur=16;g2.imageSmoothingEnabled=false;g2.translate(sx,sy-hop);g2.scale(V.px<TSX?-1:1,1);g2.drawImage(TS,-w/2,-h,w,h);g2.restore()}
 T2('TOKEN SHARK',TSX,h/U+26,NPCA,11)}
function kInit(){V={on:1,px:100,py:0,vx:0,vy:0,gr:1,face:1,cx:0,room:-1,rt:0,lens:0,seal:0,drop:0,copy:0,au:1,lent:0,secret:0,letter:0,shutter:0,gate:0,gateA:0,st:[0,0],stA:[0,0],seen:0,mir:0,vault:0,act:0,eye:0,doorA:0,asc:-1,lantern:0,dome:0,whistle:0,reunion:0,vaultTalked:0,recog:0,met:0,tsm:0,dlg:null,msg:'',mt:0,bad:0,vp:[],ft:[],stt:'play',last:performance.now(),step:0,near:null,done:0,buf:0,coy:0,ltx:0};K.l=K.r=K.j=K.jp=K.e=0;ctl(1)}
if(!window.__zkKK){window.__zkKK=1;const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isK())return;e.preventDefault();if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'&&!K.j)K.jp=1;K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='e')K[k]=0});addEventListener('blur',()=>{K.l=K.r=K.j=0})}
addEventListener('pointerdown',e=>{if(isK()&&e.target===g2.canvas)K.e=1});
function ctl(on){let c=$z('kctl');if(c&&c.dataset.own!=='keys'){c.remove();c=null}if(!c){c=document.createElement('div');c.id='kctl';c.dataset.own='keys';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:68px;height:68px;border-radius:50%;margin:0 6px;font:600 26px sans-serif;color:#fff;background:#080a18aa;border:2px solid var(--a)';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='e'){if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),R=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));R.append(mb('\uD83D\uDCAC','e','interact'),mb('\u2934','j','jump'));c.append(L,R);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}
const spark=(x,y,c,n=10)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=80+Math.random()*200;V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.8,c,s:5,g:200})}};
const say=(x,s)=>V.ft.push({x,y:240,s,l:2.4}),note=s=>{V.msg=s;V.mt=Math.max(5,s.length/16)},bad=(x,s)=>{V.bad=.4;AM.sfx('incorrect');say(x,s||'REFUSED')};
const talkAu=(L,who,img,acc)=>{V.dlg={L,i:0,c:0,who:who||'THE AUDITOR',img:img||null,acc:acc||null};AM.sfx('interaction')};
function advance(){const d=V.dlg;if(!d)return;if(d.c<d.L[d.i].length){d.c=999;return}AM.sfx('interaction');if(++d.i>=d.L.length)V.dlg=null;else d.c=0}
function auLines(){
 // the reunion at the vault gets its own lines. he has been holding the new Lens for a while now, so the
 // "cut me a copy" state is long past - up here he is looking at the vault he audited for eleven years.
 if(V.vault){if(V.reunion)return V.lent
   ?['Eleven years. I stamped it empty myself.','I am sorry about the mark. It was still my hand on the stamp.','You do not have to forgive the arithmetic. Just do not let it stop you.']
   :['Eleven years. It was never empty.','I was looking through someone else\'s glass.','Two apertures. Mine takes the Lens, yours takes the Seal. Only together does an entry become yours.','Some viewing keys only see what arrives. Others see what leaves too. Share the smallest one the job needs.'];
  V.reunion=1;
  return['Up close it is worse than I wrote down.','Every shelf is full. I have audited that room every day for eleven years.','Put your Lens in the eye. I will read what you write.','Some viewing keys only see what arrives. Others see what leaves too. Share the smallest one the job needs.']}
 if(V.au===2)return V.lent?['Eleven years. It was never empty.','I am sorry about the stamp.','A viewing key shows everything an account does, and cannot move a coin. That is why auditors get Lenses, never Seals.']:['Eleven years. It was never empty.',"I was looking through someone else's glass.",'A viewing key shows everything an account does, and cannot move a coin. That is why auditors get Lenses, never Seals.'];
 if(!V.met){V.met=1;return['You can see it too. Every act the vault ever took. And I still cannot move a single page.','They cut me my Lens when I was appointed. I never asked whose Seal it was cut from.','The Copier copies anything I bring it. Except one thing. I never understood why.']}
 if(V.lens===2)return['That glass is a different color.','Cut me a copy. Only the glass. Keep what cut it.'];
 if(V.seal)return['You are holding something. The room leans toward you.','I audit that vault every day. Eleven years. There is nothing in it.'];
 return['I check the ledger again. It never changes.','The Copier copies everything I bring it. Except one thing.']}

// ======================= interactables: every one answers with something, nothing is a dead end =======================
// IAS() is consulted every frame for the prompt and again on E, so it is memoised on the state it reads.
// Rebuilding ~25 closures per frame is pure garbage; the signature changes only when something does.
let _iaSig='',_iaList=[];
function IAS(){const L=V.lens,S_=V.seal;
 const sig=[L,S_,V.drop,V.letter,V.vault,V.secret,V.au,V.lent,V.mir,V.copy,V.shutter,V.gate,V.st[0],V.st[1],V.seen,V.act,V.eye,V.vaultTalked,V.lantern>=9,V.tsm].join('|');
 if(sig===_iaSig)return _iaList;
 _iaSig=sig;
 const a=[],P=(x,l,f)=>a.push({x,l,f});
 P(450,S_&&!V.secret?'TURN THE SEAL ON THE STAMP':'EXAMINE THE DESK',()=>{if(S_&&!V.secret){V.secret=1;spark(450,90,C.gd,24);AM.sfx('core-activate');note('A drawer slides open. The Keeper\'s last note: "I did not lose my Seal. I lent it. Everything that followed was my act, not theirs."')}else note('An entry, half written. The stamp beside it is dry.')});
 P(650,'EXAMINE THE BINS',()=>note('SEEN overflows. DONE is empty.'));
 P(900,L?'READ THE LEDGER':'TAKE THE KEY',()=>{if(!L){V.lens=1;spark(900,120,C.cy,18);AM.sfx('collectible');note('A brass key. In the eye slot the ledger scrolls through the air: every act, up to the last one, which flickers unfinished. IN ZCASH: this brass key is a viewing key. It shows transaction details, and it cannot spend.')}else note(L===2?'A different ledger. Your mark is on every line.':'ACT 0001 ... ACT 0412. The last entry flickers, unfinished.')});
 P(1210,V.drop?'DROP THE RING KEY IN THE SLOT':'EXAMINE THE SLOT',()=>{if(V.drop&&!V.letter){V.letter=1;spark(1210,-100,C.cy,16);AM.sfx('collectible');note('A letter drops into your hand: "You could always receive. Acting is the part that needs care."')}else if(V.letter)note('The slot is empty now.');else note('A narrow slot, shaped like an open mouth. Nothing you hold fits.')});
 P(1340,"READ ELARA'S DESK",()=>{if(!L)note('Letters pile in the slots. You cannot make out a word.');else note('Elara: "I can see every letter that arrives. I cannot answer one." Her gold cradle is empty.')});
 [1750,1950,2150].forEach((x,i)=>P(x,L?'READ THE RECORD':'EXAMINE THE READER',()=>{if(!L){bad(x,'NOTHING HAPPENS');return}AM.sfx('interaction');note(['ACT 0001 \u2014 LIBRARY FOUNDED \u2014 mark \u25C8\u25C8','ACT 0212 \u2014 A LENS IS CUT. IT MAY LOOK. IT MAY NOT TOUCH.','ACT 0388 \u2014 SEAL LENT TO A VISITOR \u2014 mark \u25C8\u25C8'][i])}));
 // Token Shark lives in the aisle between two records - he is the only reason anyone reads this floor
 P(TSX,V.tsm?'TALK TO TOKEN SHARK AGAIN':'TALK TO TOKEN SHARK',()=>talkAu(tsLines(),'TOKEN SHARK',TS,NPCA));
 P(2420,'TALK TO THE AUDITOR',()=>talkAu(auLines()));
 // these two sit well clear of the Auditor so nearest-wins never hides them behind him
 P(2540,V.au===2?'HE HOLDS YOUR NEW KEY':'GIVE HIM A COPY',()=>{if(V.au===2)return;if(!V.copy){note('You have no copy to give.');return}V.au=V.copy;V.copy=0;spark(2540,100,C.cy,14);AM.sfx('correct');talkAu(V.au===2?auLines():['This is the same glass I already have.','Thank you. It changes nothing.'])});
 if(S_&&!V.lent)P(2300,'HAND OVER THE GOLD KEY',()=>{V.lent=1;AM.sfx('incorrect');spark(2300,100,'#ffffff',16);talkAu(['I understand. I will be careful.','VAULT: EMPTY. AUDIT COMPLETE.','I am sorry. I do not think anyone can stamp that back.'])});
 P(2740,'COPY THE BRASS KEY',()=>{if(!L){bad(2740,'NOTHING TO COPY');return}V.copy=L;spark(2740,100,C.cy,12);AM.sfx('correct');say(2740,'COPIED');note('A perfect copy. It works exactly like the original. IN ZCASH: you can hand a viewing key to an auditor, but once shared it cannot be taken back.')});
 P(2850,S_?'COPY THE GOLD KEY':'EXAMINE THE COPIER',()=>{if(!S_){note('A copier with two slots. It will copy anything you bring it, except one thing.');return}bad(2850,'REFUSED');note('The copier groans and spits the gold key back. Some things are kept, not copied.')});
 P(3040,'USE THE HAND CRADLE',()=>{if(!S_){note('A hand-shaped cradle. Empty. It seems to want something.');return}if(L===2){note('The Seal rests in the cradle, then returns to your hand. You already hold the cut.');return}V.lens=2;spark(3040,120,C.gd,26);AM.sfx('core-activate');note('The table cuts a new key, gold and cyan. The Seal returns to your hand. The table will not keep it. IN ZCASH: a viewing key is derived from a spending key, never the other way round.')});
 P(3150,'USE THE RING CRADLE',()=>{if(!L){bad(3150,'NOTHING TO CUT');return}V.drop=1;spark(3150,100,'#ffffff',14);AM.sfx('correct');note('A clear ring key is cut from the Lens. It cannot see and it cannot act. It can only receive. IN ZCASH: an address only receives. Anyone who has it can pay you, and it gives them no power over your funds.')});
 P(3290,V.shutter?'THE SHUTTER IS OPEN':'READ THE SHUTTER',()=>{if(V.shutter)return;if(!L){bad(3290,'REFUSED');note('An eye-shaped plate. Nothing you hold answers it.');return}V.shutter=1;spark(3290,150,C.cy,16);AM.sfx('correct');note('The shutter reads you and slides up. Some doors only need to be read.')});
 [3500,3650,3800].forEach((x,i)=>P(x,L?'READ THE CASE':'EXAMINE THE CASE',()=>{if(!L){note('Glass. A faint mark glows inside.');return}note(['ACT 0389 \u2014 AUTHORIZED \u2014 mark \u25C8\u25C8. A scorch crosses the line.','Diary: "I never wrote this." ACT 0390 \u2014 AUTHORIZED \u2014 mark \u25C8\u25C8','ACT 0391 \u2014 AUTHORIZED \u2014 mark \u25C8\u25C8. The same mark, a different hand?'][i])}));
 P(3950,'TRY TO VOID AN ENTRY',()=>{note(S_?'The Seal can add an entry. It cannot erase one.':L?'Nothing happens. A Lens only reads.':'A void lever. Nothing you hold fits.');bad(3950,'NOT POSSIBLE')});
 P(4250,V.mir?'THE PLATE SHOWS YOU':'LOOK INTO THE PLATE',()=>{if(V.mir){note('A gold key at your side. Yours since the threshold.');return}V.mir=1;V.seal=1;spark(4250,120,C.gd,30);AM.sfx('core-activate');note('Your reflection holds a gold key you never saw. A gold ring lights on your frame. The library recognized you the moment you walked in. IN ZCASH: your spending key is the root of a wallet. It authorizes spending, so it stays private, and a wallet can restore it from your recovery phrase.')});
 P(GATE-70,V.gate?'THE GATE IS OPEN':'TRY THE GATE',()=>{if(V.gate)return;if(S_){V.gate=1;spark(GATE-70,160,C.cy,26);AM.sfx('core-activate');note('You turn the Seal on the hand dial. The amber turns cyan and the iris opens.')}else if(L)note('The glass shows the Mezzanine. The light stays amber. You may look.');else bad(GATE-70,'REFUSED')});
 [4620,5100].forEach((x,i)=>P(x,V.st[i]?'THE STACKS ARE ALIGNED':'TURN THE CRANK',()=>{if(V.st[i])return;if(!S_){note('A crank shaped like a hand. Nothing you hold turns it.');bad(x,'NO');return}V.st[i]=1;spark(x,100,C.cy,14);AM.sfx('correct')}));
 P(6100,'LOOK THROUGH THE WINDOW',()=>{if(L===2){V.seen=1;AM.sfx('collectible');note('The vault is full: shelves of records, and something of yours floating in glass.')}else note('Dark. Empty shelves, or nothing at all.')});
 P(LIFT,'CALL THE LIFT',()=>{if(V.asc>=0)return;if(!V.seen){note(L?'The vault is dark. There is nothing there to open.':'The lift does not answer.');return}if(V.au!==2){note('A second pair of eyes is needed at the top.');return}V.asc=0;AM.sfx('core-activate')});
 // the Auditor is here too. the vault is where he finally sees what he was auditing, so he has to be talkable.
 if(V.vault)P(AUX,V.vaultTalked?'THE AUDITOR, WAITING':'TALK TO THE AUDITOR',()=>{V.vaultTalked=1;talkAu(auLines())});
 if(V.vault)P(EYE,V.eye?'THE EYE APERTURE IS LIT':'PUT HIS LENS IN THE EYE',()=>{
  if(V.eye)return;
  if(V.act){note('His side is already lit. The Ledger is waiting on yours.');return}
  if(V.au!==2){note('An eye-shaped aperture. It wants a Lens, and the only one here belongs to a clerk who is not standing here yet.');return}
  V.eye=1;spark(EYE,150,C.cy,20);AM.sfx('interaction');
  note('You set his cut Lens into the eye. He leans in. The iris brightens. Now the hand aperture.')});
 // the hand aperture only counts once the Landing has woken and his Lens is reading as you write
 if(V.vault&&V.lantern>=9)P(HAP,V.act?'ENTRY WRITTEN':'TURN THE SEAL IN THE HAND APERTURE',()=>{if(V.act)return;
  if(!V.eye){bad(HAP,'REFUSED');note('The dial turns half a notch and stops. Nothing is reading this yet. It would only be a mark again.');return}
  V.act=1;spark(HAP,150,C.gd,40);AM.sfx('core-activate');note('ACT '+(V.lent?'0414':'0413')+' \u2014 AUTHORIZED \u2014 your mark. He reads it aloud through your glass, and the vault door begins to open.')});
 // the Return Door refuses in words, so the far wall of the vault is never a silent dead stop
 if(V.vault&&!V.act)P(DEAD+30,'THE RETURN DOOR',()=>{bad(DEAD+30,'REFUSED');note('Shut. Not locked \u2014 unfinished. The Ledger wants a mark, and only the hand aperture can leave one.')});
 _iaList=a;return a}
function act(){let b=null,d=120;IAS().forEach(o=>{const q=Math.abs(V.px-o.x);if(q<d){d=q;b=o}});if(b)b.f()}

// ======================= physics (same movement model as Origin/Proof) =======================
const gapAt=x=>{for(let i=0;i<2;i++)if(x>GAP[i][0]&&x<GAP[i][1]&&V.stA[i]<1)return 1;return 0};
const floorAt=x=>x>PIT[0]&&x<PIT[1]?PF:gapAt(x)?-700:0;
function landY(y0){let on=0;const f=floorAt(V.px);if(V.py<=f){if(f<-300){V.px=Math.max(HW,Math.min(V.px,GAP.map(g=>g[0]).filter(g=>g<V.px+300).pop()||V.px)-70);V.py=0;V.vx=V.vy=0;V.gr=1;say(V.px,'THE STACKS ARE NOT ALIGNED YET');AM.sfx('incorrect');return}V.py=f;on=1}
 for(const [x,w,t] of FLT)if(V.vy<=0&&y0>=t-2&&V.py<=t&&V.px+HW>x&&V.px-HW<x+w){V.py=t;on=1}
 if(on){V.vy=0}V.gr=on}
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;
 if(tx!==V.ltx&&tx>w*.99){back();return}
 const live=V.stt==='play'&&!V.dlg,dir=live?V.stt==='play'?K.r-K.l:0:0,tv=dir*SPD;V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);if(dir)V.face=dir;
 V.coy=V.gr?.1:(V.coy||0)-dt;V.buf=(V.buf||0)-dt;if(K.jp){V.buf=.12;K.jp=0}if(live&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;AM.sfx('interaction')}
 if(live&&!K.j&&V.vy>0)V.vy-=GRAV*1.2*dt;V.px+=V.vx*dt;
  // clamp only while actually below the ledges, so the pit floor can be walked but the ledges stay usable
  if(V.py<-90&&V.px>PIT[0]-60&&V.px<PIT[1]+60)V.px=Math.max(PIT[0]+HW,Math.min(PIT[1]-HW,V.px));
 // The pit is a basement, not a trap: its floor is within one jump of the ledges, so anyone who drops in can climb
 // back out and still reach the Annex. DEAD stops short of the Return Door until the entry has been written.
 let lim=LW-90;if(!V.shutter)lim=Math.min(lim,3270);if(!V.gate)lim=Math.min(lim,GATE-60);if(!V.vault)lim=Math.min(lim,6450);
 if(V.doorA<1)lim=Math.min(lim,DEAD);
 V.px=Math.max(V.vault?6700:HW,Math.min(lim,V.px));
 const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;landY(y0);if(V.gr&&Math.abs(V.vx)>60&&(V.step-=dt)<=0){V.step=.3;AM.sfx('step')}
 for(let i=0;i<2;i++)if(V.st[i]&&V.stA[i]<1)V.stA[i]=Math.min(1,V.stA[i]+dt/1.2);if(V.gate&&V.gateA<1)V.gateA=Math.min(1,V.gateA+dt/1.4);if(V.act)V.doorA=Math.min(1,V.doorA+dt/2.5);
 if(V.px>170&&!V.recog){V.recog=1;say(170,'RECOGNIZED');AM.sfx('correct')}
 if(V.asc>=0){V.asc+=dt;V.stt='lift';V.vx=0;
  if(V.asc>2.6){V.asc=-1;V.stt='play';V.vault=1;V.px=VX;V.cx=VX-320;V.py=0;V.au=2;
   // the Vault Landing comes up: the room rises into view and the lanterns light one at a time
   V.lantern=0.001;note('The vault. The Ledger. Two apertures: one for the eye, one for the hand.')}}
 // the Landing beats: the lanterns light one at a time, the room warms, then his whistle. ~9s, not skippable.
 if(V.vault&&V.lantern>0&&!V.act){
  const was=Math.floor(V.lantern);
  if(V.lantern<9)V.lantern+=dt;
  if(Math.floor(V.lantern)!==was&&Math.floor(V.lantern)<=8)AM.sfx('interaction');
  V.dome=Math.min(1,(V.lantern-1)/6);
  if(V.lantern>5.4&&!V.whistle){V.whistle=1;AM.sfx('core-activate');note('A whistle, very small. He is looking at eleven years of shelves.')}
  else if(V.lantern>2.6&&was<3)note('Lenses hang from the ceiling like lanterns. One catches, then the next.');
 }
 if(K.e){K.e=0;if(V.dlg)advance();else if(V.stt==='play')act()}
 const rm=Z.filter(x=>V.px>=x).length-1;if(rm!==V.room){V.room=rm;V.rt=3}V.rt-=dt;V.mt-=dt;V.bad=Math.max(0,V.bad-dt);
 if(V.dlg&&V.dlg.c<V.dlg.L[V.dlg.i].length)V.dlg.c+=dt*46;
 if(V.doorA>=1&&V.px>DOOR&&!V.done){V.done=1;V.stt='done';spark(V.px,100,'#ffffff',40);AM.sfx('collectible');note(EDU);const me=V;setTimeout(()=>{if(V!==me||!V.on)return;if(S.done.keys){fact('\u2713 ALREADY DISCOVERED');setTimeout(()=>{if(V===me)back()},2800)}else complete()},12000)}
 let d=120;V.near=null;if(!V.dlg&&V.stt==='play')IAS().forEach(o=>{const q=Math.abs(V.px-o.x);if(q<d){d=q;V.near=o}});
 const vw=w/U;V.cx+=((V.px-vw*.42+V.face*60)-V.cx)*(1-Math.exp(-5*dt));V.cx=Math.max(0,Math.min(LW-vw,V.cx));
 V.vp=V.vp.filter(q=>(q.l-=dt)>0);V.vp.forEach(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy-=q.g*dt});V.ft=V.ft.filter(f=>(f.l-=dt)>0);
 ax=X(V.px);tx=V.ltx=ax;if(AVs!=='COMPLETING'&&AVs!=='RETURNING')AVs='IDLE'}

// ======================= drawing =======================
function wrap(s,mw){const ln=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;if(g2.measureText(t).width>mw&&l){ln.push(l);l=w}else l=t});ln.push(l);return ln}
function bubble(s,x,y,col,mw,a){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4,bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12,bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;g2.save();g2.globalAlpha=a==null?1:a;rc(bx,by,bw,bh,'#05060fe8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}
const bead=(x,y,r,c,k)=>{g2.save();g2.shadowColor=c;g2.shadowBlur=10;g2.strokeStyle=c;g2.lineWidth=Math.max(2,r*.3);g2.beginPath();g2.arc(x,y,r,0,7);g2.stroke();g2.beginPath();g2.moveTo(x+r,y);g2.lineTo(x+r*2.6,y);if(k===0){g2.moveTo(x+r*2,y);g2.lineTo(x+r*2,y+r*.8)}g2.stroke();g2.restore()};
function zone(i,t){const x0=Z[i],x1=i<7?Z[i+1]:LW;rr(x0,600,x1-x0,600,ZC[i]);kWall(i,t);
 for(let k=0;x0+40+k*150<x1-30;k++){const x=x0+40+k*150,h=320+((k*53+i*17)%220),sx=X(x);if(sx>W_||sx+80*U<0)continue;rr(x,h,76,h,mixc(ZC[i],'#000000',.35));for(let b=0;b<h/46;b++){rr(x+5,h-b*46-4,66,3,C.br);for(let q=0;q<5;q++)rr(x+8+q*12,h-b*46-8,8,30,mixc(C.br,C.gd,((b*7+k*3+q*5)%10)/10))}}}
function drawAuditor(x,t){const sx=X(x);if(sx<-100||sx>W_+100)return;rr(x-22,70,44,70,'#6a5a3a');rr(x-16,100,32,30,'#2a2418');ci(sx,Y(112),5*U,C.cy);rr(x-18,40,8,40,'#4a3e28');rr(x+10,40,8,40,'#4a3e28');T2('AUDITOR',x,170,C.gd,11)}
// ---- VISUAL POLISH (render-only) ----
const Zp=window.ZKP;
const kWorld=f=>{g2.save();g2.translate(-V.cx*U,GY);g2.scale(U,U);f();g2.restore()};   // world units, y down from the ground line

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
function kWall(i,t){if(!Zp)return;const x0=Z[i],x1=i<7?Z[i+1]:LW,s0=Math.max(0,X(x0)),s1=Math.min(W_,X(x1));if(s1<=s0)return;     // the room behind the shelves: arched bays with far books, wainscot, ceiling beams, chandeliers
 const wall=ZC[i],dk=xmix(wall,'#000000',.5),cs=[C.gd,C.cy,'#a8553a','#e8dcc0','#3a4a8a'];g2.save();g2.beginPath();g2.rect(s0,0,s1-s0,H_);g2.clip();
 const par=.6,sp=250,a=Math.floor((V.cx*par-200)/sp),b=Math.ceil((V.cx*par+W_/U+200)/sp);
 for(let k=a;k<=b;k++){const sx=(k*sp+30-V.cx*par)*U,bw=170*U,arch=()=>{g2.beginPath();g2.moveTo(sx,Y(64));g2.lineTo(sx,Y(400));g2.arc(sx+bw/2,Y(400),bw/2,Math.PI,0);g2.lineTo(sx+bw,Y(64));g2.closePath()};
  arch();g2.globalAlpha=.9;g2.fillStyle=dk;g2.fill();const gg=g2.createLinearGradient(0,Y(480),0,Y(64));gg.addColorStop(0,C.gd+'00');gg.addColorStop(1,C.gd+'30');g2.globalAlpha=1;g2.fillStyle=gg;g2.fill();
  for(let r=0;r<6;r++){const yb=Y(86+r*54);g2.globalAlpha=.9;g2.fillStyle='#05070f';g2.fillRect(sx+6*U,yb,bw-12*U,2.4*U);for(let q=8;q<158;q+=5){const hh=Zp.hash(k*31+r*7+q*.7),bh=(20+hh*16)*U;g2.globalAlpha=.4;g2.fillStyle=cs[(hh*97|0)%5];g2.fillRect(sx+q*U,yb-bh,3.6*U,bh)}}
  arch();g2.globalAlpha=.4;g2.strokeStyle=C.gd;g2.lineWidth=2*U;g2.stroke();g2.globalAlpha=.55;g2.fillStyle=C.gd;g2.fillRect(sx+bw/2-4*U,Y(400+bw/2/U)-2*U,8*U,8*U);
  if(k%2===0){g2.save();g2.globalCompositeOperation='lighter';g2.globalAlpha=.04+.015*Math.sin(t*.6+k);g2.fillStyle=C.gd;g2.beginPath();g2.moveTo(sx+bw*.2,Y(470));g2.lineTo(sx+bw*.8,Y(470));g2.lineTo(sx+bw*1.5,Y(0));g2.lineTo(sx-bw*.2,Y(0));g2.fill();g2.restore()}}
 g2.globalAlpha=1;const cy=Y(592);if(cy>0){g2.fillStyle=xmix(wall,'#000000',.72);g2.fillRect(s0,0,s1-s0,cy)}      // ceiling, crown moulding, beams
 if(i<7||cy>0){g2.fillStyle=xmix(wall,C.gd,.2);g2.fillRect(s0,Y(612),s1-s0,20*U);g2.globalAlpha=.55;g2.fillStyle=C.gd;g2.fillRect(s0,Y(592),s1-s0,1.6*U);g2.globalAlpha=1;
  for(let bx=Math.ceil(x0/260)*260;bx<x1;bx+=260){const bs=X(bx);g2.fillStyle=dk;g2.fillRect(bs,Y(592),20*U,30*U);g2.globalAlpha=.5;g2.fillStyle=C.gd;g2.fillRect(bs,Y(562),20*U,1.5*U);g2.globalAlpha=1}}
 g2.fillStyle=dk;g2.globalAlpha=.85;g2.fillRect(s0,Y(64),s1-s0,64*U);g2.globalAlpha=.5;g2.fillStyle=C.gd;g2.fillRect(s0,Y(64),s1-s0,2*U);g2.fillStyle='#000';g2.globalAlpha=.35;for(let wx=Math.ceil(x0/70)*70;wx<x1;wx+=70)g2.fillRect(X(wx),Y(56),2*U,48*U);g2.globalAlpha=1;   // wainscot panels
 for(let wx=Math.ceil(x0/440)*440+220;wx<x1;wx+=440){const sx=X(wx),fl=.8+.2*Math.sin(t*7+wx);g2.fillStyle='#2a2416';g2.fillRect(sx-U,Y(592),2*U,58*U);g2.strokeStyle=C.gd;g2.lineWidth=2*U;g2.globalAlpha=.8;g2.beginPath();g2.ellipse(sx,Y(534),24*U,5*U,0,0,7);g2.stroke();
  for(let q=0;q<5;q++){const cx2=sx-20*U+q*10*U;g2.globalAlpha=1;g2.fillStyle='#e8dcc0';g2.fillRect(cx2-U,Y(534)-9*U,2*U,9*U);g2.fillStyle='#ffd9a0';g2.fillRect(cx2-U,Y(534)-14*U*fl,2*U,5*U*fl)}Zp.glow(g2,sx,Y(540),80*U,70*U,C.gd,.22+.06*fl)}
 g2.restore()}
function kFloor(t){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60,seg=[[-300,PIT[0]],[PIT[1],GAP[0][0]],[GAP[0][1],GAP[1][0]],[GAP[1][1],LW+400]];    // runner carpets and brass floor lamps (visual only)
 kWorld(()=>{[[200,1050],[1500,2600],[3300,4400],[5900,7450]].forEach(([ra,rb])=>seg.forEach(([a,b])=>{const l=Math.max(a,ra,x0),r=Math.min(b,rb,x1);if(r<=l)return;g2.globalAlpha=.9;g2.fillStyle='#4a1a26';g2.fillRect(l,0,r-l,5);g2.fillStyle=C.gd;g2.globalAlpha=.65;g2.fillRect(l,0,r-l,1);g2.fillRect(l,4,r-l,1);g2.globalAlpha=.5;for(let wx=Math.ceil(l/24)*24;wx<r;wx+=24)g2.fillRect(wx,2,6,1.4);g2.globalAlpha=1}));
  [260,1050,1530,2640,3270,4300,5900].forEach(x=>{if(x<x0-40||x>x1+40)return;const f=.85+.15*Math.sin(t*3+x);g2.fillStyle='#2a2416';g2.fillRect(x-1.5,-74,3,74);g2.fillRect(x-9,-4,18,4);g2.fillStyle=C.gd;g2.globalAlpha=.85;g2.beginPath();g2.moveTo(x-12,-72);g2.lineTo(x-7,-92);g2.lineTo(x+7,-92);g2.lineTo(x+12,-72);g2.fill();g2.globalAlpha=1;Zp.glow(g2,x,-80,70,60,C.gd,.28*f);Zp.glow(g2,x,0,70,9,C.gd,.22*f)})})}
function kBooks(x,h,i){const cs=[C.gd,C.cy,'#a8553a','#e8dcc0','#3a4a8a','#6b8a5a'];for(let b=0;b<h/46;b++){const base=-(h-b*46-38);g2.globalAlpha=.9;g2.fillStyle='#1a1208';g2.fillRect(x+4,base,68,3);let q=6;while(q<68){const hs=Zp.hash(x*.13+b*7.1+q*1.7+i),bw=3+hs*3,bh=17+Zp.hash(hs*91+q)*13;g2.globalAlpha=.8;g2.fillStyle=xmix(cs[(hs*97|0)%6],'#000000',.25);g2.fillRect(x+q,base-bh,bw,bh);g2.globalAlpha=.3;g2.fillStyle='#ffffff';g2.fillRect(x+q,base-bh,1,bh);q+=bw+.6}}g2.globalAlpha=1}
function kVault(vx,vy,vr,lit,t){if(!Zp)return;g2.save();g2.translate(vx,vy);g2.strokeStyle=lit?C.gd:'#2a3a6a';g2.lineWidth=2*U;g2.globalAlpha=.7;g2.beginPath();   // bolted rim, turning dial, spokes
 for(let k=0;k<32;k++){const a=k/32*6.283,r0=vr*1.07,r1=vr*(k%4?1.12:1.18);g2.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);g2.lineTo(Math.cos(a)*r1,Math.sin(a)*r1)}g2.stroke();
 g2.rotate(t*.05);g2.setLineDash([vr*.2,vr*.14]);g2.lineWidth=1.5*U;g2.globalAlpha=.4;g2.beginPath();g2.arc(0,0,vr*.82,0,7);g2.stroke();g2.setLineDash([]);
 g2.globalAlpha=.3;g2.lineWidth=2*U;g2.beginPath();for(let k=0;k<3;k++){const a=k*2.094;g2.moveTo(Math.cos(a)*vr*.2,Math.sin(a)*vr*.2);g2.lineTo(Math.cos(a)*vr*.7,Math.sin(a)*vr*.7)}g2.stroke();g2.restore();
 Zp.glow(g2,vx,vy,vr*1.7,vr*1.7,lit?C.gd:'#2a3a6a',lit?.25:.08)}
function kZone(i,t){if(!Zp)return;const x0=Z[i],x1=i<7?Z[i+1]:LW;kWorld(()=>{for(let k=0;x0+40+k*150<x1-30;k++){const x=x0+40+k*150,h=320+((k*53+i*17)%220),sx=X(x);if(sx>W_||sx+80*U<0)continue;
  g2.fillStyle=mixc(ZC[i],'#000000',.55);g2.fillRect(x-4,-h-7,84,7);g2.fillRect(x-3,-9,82,9);g2.globalAlpha=.4;g2.fillStyle=C.gd;g2.fillRect(x-4,-h-7,84,1.5);g2.fillRect(x-3,-9,82,1.5);g2.globalAlpha=.3;g2.fillRect(x,-h,2,h);g2.fillStyle='#000';g2.globalAlpha=.45;g2.fillRect(x+74,-h,2,h);g2.globalAlpha=1;   // cornice, plinth, lit/shaded uprights
  g2.fillStyle=C.gd;g2.globalAlpha=.55;g2.fillRect(x+31,-h+10,14,5);g2.globalAlpha=1;kBooks(x,h,i)}})}                                                                    // brass label plate
const KB=[[380,95,140,95,0],[600,70,60,70,1],[680,70,60,70,1],[860,110,80,110,1],[1750-35,110,70,110,1],[1950-35,110,70,110,1],[2150-35,110,70,110,1],[2270,80,60,70,0],[2510,80,60,70,1],[2700,100,90,110,0],[2810,100,90,110,0],[2990,90,220,90,0],[3500-45,150,90,110,0],[3650-45,150,90,110,0],[3800-45,150,90,110,0]];
function kGround(t){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60,seg=[[-300,PIT[0]],[PIT[1],GAP[0][0]],[GAP[0][1],GAP[1][0]],[GAP[1][1],LW+400]];
 kWorld(()=>{seg.forEach(([a,b])=>{const l=Math.max(a,x0),r=Math.min(b,x1);if(r<=l)return;g2.strokeStyle='#000';g2.lineWidth=1;g2.globalAlpha=.4;g2.beginPath();   // plank seams (world-anchored), polished sheen
  for(const [d,sp,off] of [[22,90,0],[64,130,45]]){g2.moveTo(l,d);g2.lineTo(r,d);const e=d===22?64:H_/U+10;for(let wx=Math.ceil((l-off)/sp)*sp+off;wx<r;wx+=sp){g2.moveTo(wx,d);g2.lineTo(wx,Math.min(e,d+40))}}g2.stroke();
  g2.globalAlpha=.07;g2.fillStyle=C.gd;g2.fillRect(l,6,r-l,10);g2.globalAlpha=.5;g2.fillStyle=C.pc;g2.fillRect(l,5,r-l,1.2);g2.globalAlpha=1;Zp.grit(g2,l,r,26,(H_-GY)/U,34,'#2a3a6a',.5,4,2,.3)})
  KB.forEach(([x,h,w,hh,c])=>{if(x+w<x0||x>x1)return;Zp.edge(g2,x,-h,w,hh,c?C.cy:C.gd,'#000',.28,1.5)})})}                                                                       // chiselled edges on the existing props
function kGaps(){if(!Zp)return;const x0=V.cx-60,x1=V.cx+W_/U+60;kWorld(()=>{[...GAP,[PIT[0],PIT[1]]].forEach(g=>{if(g[1]<x0||g[0]>x1)return;g2.fillStyle=C.gd;g2.globalAlpha=.3;g2.fillRect(g[0]-1,0,2.5,420);g2.fillRect(g[1]-1.5,0,2.5,420);g2.globalAlpha=.5;g2.fillStyle='#000';g2.fillRect(g[0]+1.5,0,10,420);g2.fillRect(g[1]-11.5,0,10,420);g2.globalAlpha=1});   // lit lips + shadow down the gap walls
  FLT.forEach(([x,w,tp])=>{if(x+w<x0||x>x1)return;g2.globalAlpha=.3;g2.fillStyle='#000';g2.fillRect(x+2,-tp+20,w-4,8);g2.globalAlpha=1;g2.fillStyle='#14204a';g2.fillRect(x+5,-tp+20,7,9);g2.fillRect(x+w-12,-tp+20,7,9);Zp.edge(g2,x,-tp,w,20,C.gd,'#000',.28,1.5)})})}   // ledge corbels
function kDust(t){if(!Zp)return;Zp.motes(g2,0,0,W_,GY,t,26,'#ffd9a0',{alpha:.3,size:Math.max(1.5,2*U),speed:6,seed:5})}
function scene(w,h,gy,t,p){const v=V,L=v.lens;
 // the vault hanging in the shaft: dark (or lit once seen through the right Lens)
 const lit=v.seen||v.vault,vr=h*.16,vx=w*.62-v.cx*U*.2,vy=h*.2;g2.fillStyle='#04060f';g2.beginPath();g2.arc(vx,vy,vr,0,7);g2.fill();if(lit){const g=g2.createRadialGradient(vx,vy,0,vx,vy,vr);g.addColorStop(0,C.gd+'cc');g.addColorStop(1,C.gd+'11');g2.fillStyle=g;g2.beginPath();g2.arc(vx,vy,vr*.95,0,7);g2.fill()}
 g2.strokeStyle=lit?C.gd:'#2a3a6a';g2.lineWidth=4*U;g2.beginPath();g2.arc(vx,vy,vr,0,7);g2.stroke();g2.strokeStyle=C.cy;g2.lineWidth=3*U;g2.beginPath();g2.moveTo(vx+vr*.95,vy-vr*.3);g2.lineTo(vx+vr*1.15,vy-vr*.2);g2.stroke();
 kVault(vx,vy,vr,lit,t);if(L){g2.globalAlpha=.25+.15*Math.sin(t*2);g2.strokeStyle=C.cy;g2.lineWidth=2;g2.beginPath();g2.moveTo(vx,vy+vr);g2.lineTo(X(900),Y(190));g2.stroke();g2.globalAlpha=1}
 for(let i=0;i<8;i++){const sx=X(Z[i]);if(sx>W_||X(i<7?Z[i+1]:LW)<0)continue;zone(i,t);kZone(i,t)}
 // ground (pit and unaligned gaps are cut out)
 const seg=[[-300,PIT[0]],[PIT[1],GAP[0][0]],[GAP[0][1],GAP[1][0]],[GAP[1][1],LW+400]];seg.forEach(([a,b])=>{const l=Math.max(0,X(a)),r=Math.min(W_,X(b));if(r>l){rc(l,GY,r-l,H_-GY,'#101a3a');rc(l,GY,r-l,5*U,C.gd)}});
 kGround(t);kFloor(t);GAP.forEach((g,i)=>{rr(g[0],0,g[1]-g[0],700,'#03050e');const e=v.stA[i];if(e>0){rr(g[0],0,(g[1]-g[0])*e,16,'#2a3a6a');rr(g[0],0,(g[1]-g[0])*e,5,C.cy)}});
 rr(PIT[0],0,PIT[1]-PIT[0],700,'#05060f');rr(PIT[0],PF,PIT[1]-PIT[0],700,'#101a3a');rr(PIT[0],PF,PIT[1]-PIT[0],5,C.gd);FLT.forEach(([x,w,tp])=>{rr(x,tp,w,20,'#1d2a55');rr(x,tp,w,5,C.gd)});
 kGaps();
 // ---- arrival hall
 rr(380,95,140,95,'#2a2010');rr(400,150,100,6,v.secret?C.gd:'#3a3020');T2(v.secret?'\u2713':'\u2022',450,128,C.gd,18);
 rr(600,70,60,70,'#1d2a55');rr(680,70,60,70,'#14204a');T2('SEEN',630,150,C.pc,10);T2('DONE',710,150,'#6a7aa8',10);
 rr(860,110,80,110,'#1d2a55');if(!L)bead(X(900),Y(150),8*U,C.cy,0);g2.globalAlpha=.4;rr(870,200,60,6,C.cy);g2.globalAlpha=1;
 // ---- annex (pit)
 for(let k=0;k<6;k++){rr(PIT[0]+30+k*55,PF+80,40,50,'#1d2a55');rr(PIT[0]+34+k*55,PF+76,32,5,C.pc)}rr(1330,PF+60,70,60,'#2a2010');if(!v.drop||v.letter)T2('\u25CB',1210,PF+60,'#6a7aa8',16);else T2('\u25CB',1210,PF+60,C.cy,18);
 // ---- reading floor
 [1750,1950,2150].forEach(x=>{rr(x-35,110,70,110,'#1d2a55');ci(X(x),Y(165),12*U,L?C.cy:'#2a3a6a')});drawShark(t);drawAuditor(2420,t);
  // the two trays either side of the Auditor, so the offer prompts have something to stand on
  rr(2270,80,60,70,'#2a2010');T2('\u25C9',2300,120,C.gd,18);if(v.seal&&!v.lent)T2('\u2713',2300,168,C.gd,14);
  rr(2510,80,60,70,'#1d2a55');T2('\u25A3',2540,120,C.cy,18);if(v.au===2)T2('\u2713',2540,168,C.cy,14);
 // ---- copy room
 rr(2700,100,90,110,'#2a2010');T2('\u25A3',2745,150,C.cy,22);rr(2810,100,90,110,'#2a2010');T2('\u25A3',2855,150,C.gd,22);
 rr(2990,90,220,90,'#3a2a14');T2('\u25C9',3040,140,C.gd,24);T2('\u25CB',3150,140,C.pc,24);if(v.lens===2)T2('\u2713',3040,190,C.cy,18);
 // ---- disputed wing
 rr(3280,300,40,300,v.shutter?'#00000000':'#2a2010');g2.strokeStyle=C.cy;g2.lineWidth=2;if(!v.shutter)T2('\u25CE',3300,150,C.cy,22);
 [3500,3650,3800].forEach((x,i)=>{rr(x-45,150,90,110,'#1a1210');g2.strokeStyle=C.rd;g2.lineWidth=2;g2.strokeRect(X(x-45),Y(150),90*U,110*U);T2('\u25C8\u25C8',x,100,C.gd,14);g2.globalAlpha=.4;rr(x-40,150-i*20,30,4,'#000000');g2.globalAlpha=1});
 rr(3920,120,60,70,'#1a1210');T2('\u2715',3950,70,C.rd,18);rr(4210,170,80,150,'#0a1030');g2.strokeStyle=C.gd;g2.lineWidth=3;g2.strokeRect(X(4210),Y(170),80*U,150*U);if(v.mir)bead(X(4250),Y(110),9*U,C.gd,1);
 // ---- gate + mezzanine
 const go=v.gateA;rr(GATE-90,430-go*340,180,430,'#14204a');g2.strokeStyle=v.gate?C.cy:C.gd;g2.lineWidth=3;g2.strokeRect(X(GATE-90),Y(430-go*340),180*U,430*U);T2(v.gate?'\u25C8':'\u25C7',GATE,300-go*300,v.gate?C.cy:C.gd,28);
 [4620,5100].forEach((x,i)=>{rr(x-18,70,36,70,'#1d2a55');T2('\u270B',x,130,v.st[i]?C.cy:C.gd,18)});
 // ---- observation + lift
 rr(6070,300,60,190,'#0a1030');g2.strokeStyle=C.cy;g2.lineWidth=2;g2.strokeRect(X(6070),Y(300),60*U,190*U);if(v.seen)for(let k=0;k<3;k++)ci(X(6100)+(k-1)*14*U,Y(210+Math.sin(t*2+k)*6),5*U,[C.gd,C.cy,'#ffffff'][k]);else T2('\u25A0',6100,200,'#0a1030',14);
 rr(LIFT-50,120,100,140,'#1d2a55');T2('\u25B2',LIFT,150,v.seen&&v.au===2?C.cy:'#6a7aa8',22);
 // ---- the vault interior
 if(v.vault||v.px>6450){rr(6650,600,850,600,'#150f06');for(let k=0;k<9;k++){const a=k*.7;ci(X(6800+k*80),Y(480+Math.sin(t+k)*10),8*U,v.act?C.cy:'#2a3a6a')}
  rr(LED-80,110,160,70,'#2a2010');rr(LED-70,180,140,8,C.gd);T2('ACT 0412 \u2014 SEAL LENT',LED,150,C.pc,10);T2(v.act?'ACT '+(v.lent?'0414':'0413')+' \u2014 YOUR MARK':'ACT \u2014 ____',LED,128,v.act?C.cy:'#6a7aa8',10);
  if(v.lent)T2('ACT 0413 \u2014 VERIFIED (not by you)',LED,208,C.rd,9);
  // the eye aperture: dead dark until his Lens goes in, then the brightest thing in the room
  if(v.eye){const gg=g2.createRadialGradient(X(EYE),Y(170),0,X(EYE),Y(170),90*U);gg.addColorStop(0,C.cy+'99');gg.addColorStop(1,C.cy+'00');g2.fillStyle=gg;g2.fillRect(X(EYE)-90*U,Y(170)-90*U,180*U,180*U)}
  ci(X(EYE),Y(170),16*U,v.eye?C.cy:'#2a3a6a');if(v.eye)ci(X(EYE),Y(170),30*U,C.cy,.25+.12*Math.sin(t*2));
  bead(X(HAP),Y(130),9*U,v.act?C.cy:C.gd,1);drawAuditor(AUX,t);
  // lenses hung like lanterns, lighting one at a time as the Landing comes up
  for(let k=0;k<8;k++){const lx=6700+k*105,on=v.lantern>k+1,ly=560-Math.sin(t*.6+k)*4;
   ci(X(lx),Y(ly),7*U,on?C.gd:'#2a2416');if(on)ci(X(lx),Y(ly),20*U,C.gd,.18);rr(lx-2,566,4,34,'#2a2416')}
  if(v.dome>0)ci(X(7100),Y(700),760*U,C.gd,v.dome*.1);   // the library's light comes up to the dome
  if(v.whistle&&!v.act)T2('\u266A',AUX,215,C.cy,13);
  const o=v.doorA;rr(DOOR-80,420-o*340,160,420,'#2a2010');g2.strokeStyle=v.act?C.cy:C.gd;g2.lineWidth=3;g2.strokeRect(X(DOOR-80),Y(420-o*340),160*U,420*U);if(o>=1&&v.letter&&!v.lent)T2('\u2605',DOOR,380,C.gd,22)}
 kDust(t);xMid(V.cx,Y(0),t,[C.gd,C.cy],12);v.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*2);rr(q.x,q.y,q.s,q.s,q.c)});g2.globalAlpha=1;v.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),C.cy,240*U,Math.min(1,f.l)))}
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0;g2.fillStyle='#0008';g2.beginPath();g2.ellipse(sx,Y(Math.max(0,V.py<-2?PF:0))+3,aw*.38,5*U,0,0,7);g2.fill();
 g2.save();g2.shadowColor=V.seal?C.gd:C.cy;g2.shadowBlur=18;g2.imageSmoothingEnabled=false;g2.translate(sx,sy);g2.scale(V.face<0?-(1-idle):1-idle,1+idle);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 if(V.seal){g2.strokeStyle=C.gd;g2.lineWidth=2;g2.globalAlpha=.6+.3*Math.sin(T*3);g2.beginPath();g2.arc(sx,sy-ph*.5,ph*.62,0,7);g2.stroke();g2.globalAlpha=1}}
function drawHud(p){g2.textAlign='center';const fs=Math.round(Math.max(13,14*U)),w2=110,bx=W_/2-w2/2;rc(bx,8,w2,fs*2,'#05060fcc');g2.strokeStyle=C.cy;g2.lineWidth=1.5;g2.strokeRect(bx,8,w2,fs*2);
 [[V.lens?(V.lens===2?'#ffd35a':C.cy):'#2a3a6a',0],[V.seal?C.gd:'#2a3a6a',1],[V.drop?'#ffffff':'#2a3a6a',2]].forEach(([c,k],i)=>bead(bx+16+i*34,8+fs,5*U+2,c,k));
 if(V.rt>0&&V.stt==='play'){g2.save();g2.globalAlpha=Math.min(1,V.rt);g2.fillStyle=C.gd;g2.font="400 "+Math.round(Math.max(22,34*U))+"px 'Abril Fatface',serif";g2.fillText(ZN[Math.max(0,V.room)],W_/2,H_*.2);g2.restore()}
 if(V.near)bubble((coarse?'TAP \u270B  ':'[E]  ')+V.near.l,X(V.near.x),Y(260),C.gd,280*U);
 if(V.bad>0){g2.fillStyle='rgba(255,122,74,'+(V.bad*.3)+')';g2.fillRect(0,0,W_,H_)}
 if(V.asc>=0){g2.fillStyle='rgba(0,0,0,'+Math.min(1,Math.sin(Math.min(1,V.asc/2.6)*Math.PI))+')';g2.fillRect(0,0,W_,H_)}
 if(V.dlg){const d=V.dlg,im=d.img,ip=im&&im.width,mw=Math.min(W_-24,640),bx2=(W_-mw)/2,bh=Math.round(Math.max(110,H_*.18)),by2=H_-bh-(coarse?90:24),ix=ip?84:16;rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=C.gd;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);
  if(ip){g2.imageSmoothingEnabled=false;g2.drawImage(im,bx2+10,by2+10,64,64)}
  g2.textAlign='left';g2.fillStyle=d.acc||C.gd;g2.font=MONO(13);g2.fillText(d.who||'THE AUDITOR',bx2+ix,by2+28);g2.fillStyle='#ece8df';g2.font=MONO(15);wrap(d.L[d.i].slice(0,Math.floor(d.c)),mw-(ip?100:32)).forEach((l,i)=>g2.fillText(l,bx2+ix,by2+54+i*22));g2.fillStyle='#8a867c';g2.font=MONO(11);g2.textAlign='right';g2.fillText(coarse?'TAP TO CONTINUE':'[E] / CLICK',bx2+mw-12,by2+bh-10)}
 else if(V.mt>0&&V.msg){g2.font=MONO(14);const mw=Math.min(W_-24,640),ln=wrap(V.msg,mw-28),bh=ln.length*22+22,bx2=(W_-mw)/2,by2=H_-bh-(coarse?90:22);g2.save();g2.globalAlpha=Math.min(1,V.mt*2);rc(bx2,by2,mw,bh,'#05060ff2');g2.strokeStyle=C.cy;g2.lineWidth=2;g2.strokeRect(bx2,by2,mw,bh);g2.fillStyle='#ece8df';g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx2+14,by2+24+i*22));g2.restore()}}

// ======================= wiring into the shared engine =======================
DEC.keys=function(w,h,gy,t,p){if(!isK()){OLD(w,h,gy,t,p);return}scene(w,h,gy,t,p)};
const _bgk=bg;bg=function(w,h,gy,p){if(isK()){frame(w,h,gy);cam=V.cx*U}_bgk(w,h,gy,p)};
const _avk=avatar;avatar=function(w,h,gy,p){if(isK()){drawPlayer(p);xFront(V.cx,T,[C.gd,C.cy],LW,0);drawHud(p)}else _avk(w,h,gy,p)};
const _stk=startWorld;startWorld=function(i){const me=W[i].id==='keys';if(me)kInit();_stk(i);if(me)$z('wf').innerHTML=''};
const _spk=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spk()};
});

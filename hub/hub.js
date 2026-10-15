/* ZKSCAPE HUB v2 - "THE CONCOURSE": a playable pixel-art plaza that replaces the old ring of buttons.
   - Registered through the same window.ZKW plugin mechanism as the worlds, so it runs inside the engine closure
     (S, W, open, pick, nd, bonus, AM, DR, hc/hg ... are the live engine objects). It does NOT register a world.
   - The engine calls HUBX.enter(wasAlreadyOnHub) from hub() and HUBX.frame() from hubLoop(). If this file is missing
     or throws, the engine falls back to the legacy ring HUB untouched.
   - Movement model mirrors the Origin world: A/D or arrows walk, Space/W/Up jump, E/Enter/F interact, click-to-walk,
     on-screen buttons on touch devices. Portals are the existing W[] worlds; entering one reuses the existing
     pick() -> confirm -> travel() -> startWorld() flow, so nothing about world entry/exit changed.
   - Scene is drawn on a LOW-RES canvas (#zh, 1 canvas px = PX screen px, CSS pixelated) so everything is real pixel art;
     all text/labels are drawn on a crisp overlay canvas (#zho) with the shared bitmap font from ZNAME. */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
const HS=$z('s-hub');
const HO=document.createElement('canvas');HO.id='zho';hc.insertAdjacentElement('afterend',HO);const ho=HO.getContext('2d');
HS.insertAdjacentHTML('beforeend','<div id="zhm" role="status" aria-live="polite"></div><div id="hctl"></div>');
const hudEl=HS.querySelector('.hud');
hudEl.querySelector('b').insertAdjacentHTML('afterend','<span class="hs">THE HUB</span>');
hudEl.insertAdjacentHTML('beforeend','<button id="zprof" type="button" aria-label="Change explorer name"></button>');

// ---------------------------------------------------------------- level layout (units = art pixels; 1 art px = PX screen px)
const SPD=96,ACC=720,GRAV=640,JV=205,PHT=26,STEP=8;           // ~1.26 sprite-heights of jump, like Origin
const START=205,X0=260,DX=170;                                  // spawn, portal 01, spacing
const STAIRX=1960,SW=12,SH=6,SN=5,TERR=SH*SN,TERRX=STAIRX+SN*SW; // 5 low steps up to the optional terrace
const SOONX=2500,LW=2640;
const portalX=i=>i<10?X0+DX*i:2130+(i-10)*180;
const baseH=x=>x<STAIRX?0:x>=TERRX?TERR:(Math.floor((x-STAIRX)/SW)+1)*SH;
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const ICE='#cfd8ff',ICE2='#8f9bff',GOLD='#ffcc66',GREEN='#5dd68a',SLATE='#6a6f88';

// ---------------------------------------------------------------- helpers
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(B[i]-v)*t))).toString(16).padStart(2,'0')).join('')};
const isHex=c=>/^#[0-9a-f]{6}$/i.test(c);
const pal=()=>{const p=S.pal||[];return[isHex(p[0])?p[0]:'#f4b728',isHex(p[1])?p[1]:'#4ee3f0',isHex(p[2])?p[2]:'#6a3d9a']};
const mb32=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h);return c};
const R=(x,y,w,h,c)=>{hg.fillStyle=c;hg.fillRect(Math.round(x),Math.round(y),w,h)};
function disc(cx,cy,r,col,a){hg.globalAlpha=a;hg.fillStyle=col;for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy)+.5);hg.fillRect(cx-w,cy+dy,w*2,1)}hg.globalAlpha=1}
function glow(cx,cy,r,col,a){hg.globalCompositeOperation='lighter';for(let k=1;k<=4;k++)disc(Math.round(cx),Math.round(cy),Math.round(r*k/4),col,a*.55);hg.globalCompositeOperation='source-over'}
const gtext=(s,x,y,col,k)=>ZNAME.text(hg,s,Math.round(x),Math.round(y),k||1,col);

// ---------------------------------------------------------------- state
const HX={x:null,y:0,vx:0,vy:0,gr:1,face:1,coy:0,buf:0,cam:0,tx:null,pend:null,busy:0,returnTo:null,near:-1,mt:0,msgSrc:'',moved:0,jumped:0,hintT:0,ps:[],pulse:{},soonP:0,img:null,imgSrc:'',foot:0,air:0,init:0,vw:0,vh:0,last:performance.now()};
const K={l:0,r:0,jp:0,e:0};
let PX=4,VW=320,VH=180,GYS=137,FL=43,tm=0,IT=[],btn=[],PAL=['#f4b728','#4ee3f0','#6a3d9a'];
let skyC,farC,midC,bakedKey='',beacons=[];
const EM={};

// ---------------------------------------------------------------- emblem baking: world emblems (LM) are vector; bake to hard-edged pixel sprites
function bakeEmblems(){hc.width=32;hc.height=32;
 W.forEach((w,i)=>[SLATE,PAL[i%3],GREEN,GOLD].forEach(col=>{
  hg.setTransform(1,0,0,1,0,0);hg.clearRect(0,0,32,32);hg.save();hg.translate(16,16);hg.globalAlpha=1;hg.strokeStyle=col;hg.fillStyle=col;hg.lineWidth=2;hg.shadowBlur=0;
  try{(LM[w.id]||LM.zilkroad)(16,16,10,col,0,1,()=>hg.beginPath())}catch(e){}
  hg.restore();const id=hg.getImageData(0,0,32,32),d=id.data;for(let k=3;k<d.length;k+=4)d[k]=d[k]>60?255:0;
  const c=mk(32,32);c.getContext('2d').putImageData(id,0,0);EM[w.id+col]=c}))}

// ---------------------------------------------------------------- metrics + baked backdrop layers
function metrics(){PX=Math.max(2,Math.min(6,Math.round(Math.min(innerHeight/180,innerWidth/300))));VW=Math.ceil(innerWidth/PX);VH=Math.ceil(innerHeight/PX);FL=Math.max(34,Math.min(50,Math.round(VH*.24)));GYS=VH-FL;
 hc.width=VW;hc.height=VH;hc.style.imageRendering='pixelated';hc.style.width=VW*PX+'px';hc.style.height=VH*PX+'px';HO.width=innerWidth;HO.height=innerHeight;HX.vw=innerWidth;HX.vh=innerHeight;bakedKey='';
 btn.forEach(b=>{b.style.width=46*PX+'px';b.style.height=76*PX+'px'})}
function bake(){const lv=nd(),key=[VW,VH,PAL.join(),lv].join('|');if(key===bakedKey)return;bakedKey=key;const[P0,P1,P2]=PAL,Pn=[P0,P1,P2],lvf=lv/10;
 // sky: banded gradient with 2-row ordered dither between bands + stars
 skyC=mk(VW,VH);let g=skyC.getContext('2d');const top='#02030a',mid=mix('#0a1030',P1,.14),hor=mix('#151b46',P0,.3),N=26,H=GYS+10;
 const col=q=>{const t=q/(N-1);return t<.62?mix(top,mid,t/.62):mix(mid,hor,(t-.62)/.38)};
 for(let q=0;q<N;q++){const y0=Math.floor(q*H/N),y1=Math.floor((q+1)*H/N);g.fillStyle=col(q);g.fillRect(0,y0,VW,y1-y0+(q===N-1?VH:0));
  if(q<N-1){g.fillStyle=col(q+1);for(let x=0;x<VW;x+=2)g.fillRect(x,y1-1,1,1);for(let x=1;x<VW;x+=2)g.fillRect(x,y1-2,1,1)}}
 let r=mb32(7);for(let i=0;i<80;i++){const x=Math.floor(r()*VW),y=Math.floor(r()*GYS*.78),b=r();g.fillStyle=b>.86?'#fff':b>.55?'#9aa6ff':'#4a5488';g.fillRect(x,y,1,1);if(b>.95){g.globalAlpha=.4;g.fillStyle='#fff';g.fillRect(x-1,y,3,1);g.fillRect(x,y-1,1,3);g.globalAlpha=1}}
 // far skyline (parallax .12)
 const FW=Math.ceil(LW*.12)+VW+10;farC=mk(FW,VH);g=farC.getContext('2d');r=mb32(11);beacons=[];let x=-4;const base=mix('#080b1f',P1,.1);
 while(x<FW){const w=8+Math.floor(r()*14),h=20+Math.floor(r()*46),y=GYS-h;g.fillStyle=base;g.fillRect(x,y,w,h+8);g.fillStyle=mix(Pn[Math.floor(r()*3)],base,.62);g.fillRect(x,y,w,1);
  if(r()<.4){g.fillStyle=base;g.fillRect(x+2,y-3,w-4,3)}if(h>50)beacons.push({x:x+(w>>1),y:y-4,c:Pn[beacons.length%3]});
  for(let wy=y+4;wy<GYS-3;wy+=5)for(let wx=x+2;wx<x+w-2;wx+=4){if(r()<.1+.5*lvf){g.fillStyle=mix(Pn[(wx+wy)%3],'#fff',.12);g.globalAlpha=.85;g.fillRect(wx,wy,2,2);g.globalAlpha=1}}
  x+=w+(r()<.35?2+Math.floor(r()*6):0)}
 for(let k=0;k<5;k++){g.globalAlpha=.1+k*.05;g.fillStyle=hor;g.fillRect(0,GYS-34+k*7,FW,8)}g.globalAlpha=1;
 // mid arcade (parallax .38): dark colonnade that frames the plaza
 const MW=Math.ceil(LW*.38)+VW+10;midC=mk(MW,VH);g=midC.getContext('2d');r=mb32(23);const wall=mix('#060818',P1,.05),edge=mix('#121737',P0,.18),AW=72;
 for(let ax=0,b=0;ax<MW;ax+=AW,b++){const gap=b%7===4,wt=GYS-86+Math.floor(r()*14);
  if(!gap){g.fillStyle=wall;g.fillRect(ax,wt,AW,GYS+8-wt);g.fillStyle=edge;g.fillRect(ax,wt,AW,1);g.fillStyle=mix(edge,wall,.5);g.fillRect(ax,wt+1,AW,2);
   const cy=GYS-64,rr=29,cx=ax+AW/2;for(let dy=-rr;dy<=0;dy++){const w=Math.floor(Math.sqrt(rr*rr-dy*dy)+.5);g.clearRect(cx-w,cy+dy,w*2,1)}g.clearRect(cx-rr,cy,rr*2,GYS+20-cy);
   // arch rim highlight
   g.fillStyle=mix(edge,wall,.35);for(let a=0;a<=32;a++){const an=Math.PI+a/32*Math.PI;g.fillRect(Math.round(cx+Math.cos(an)*(rr+1)),Math.round(cy+Math.sin(an)*(rr+1)),1,1)}
   const kc=Pn[b%3];g.fillStyle=mix(kc,wall,.35);g.fillRect(cx-1,cy-rr-5,3,4);
   if(b%3===1){g.fillStyle=mix(kc,wall,.55);g.fillRect(ax+AW-5,wt+4,4,22);g.fillRect(ax+AW-5,wt+26,2,3);g.fillRect(ax+AW-3,wt+26,2,3);g.fillStyle=mix(kc,'#fff',.25);g.fillRect(ax+AW-5,wt+4,4,1)}}}
 g.globalCompositeOperation='source-atop';for(let k=0;k<6;k++){g.globalAlpha=.03;g.fillStyle=hor;g.fillRect(0,GYS-40+k*8,MW,9)}g.globalAlpha=1;g.globalCompositeOperation='source-over'}

// ---------------------------------------------------------------- level objects
function buildItems(){IT=[];W.forEach((w,i)=>IT.push({k:'w',i,x:portalX(i),y:i>=10?TERR:0,z:34}));IT.push({k:'soon',x:SOONX,y:TERR,z:40})}
const nextIdx=()=>{for(let i=0;i<10;i++)if(open(i)&&!S.done[W[i].id])return i;return -1};
const stOf=i=>{const w=W[i],dn=!!S.done[w.id],op=open(i),bn=!!w.bonus;return{dn,op,bn,col:dn?GREEN:!op?SLATE:bn?GOLD:PAL[i%3]}};

// ---------------------------------------------------------------- messages (DOM plaque, same look as world fact boxes; textContent only)
function msg(big,rest,ms,src){const m=$z('zhm');m.textContent='';const d=document.createElement('div');d.className='plq';const a=document.createElement('div');a.className='bigt';a.textContent=big;d.appendChild(a);if(rest){const r=document.createElement('div');r.className='rest';r.textContent=rest;d.appendChild(r)}m.appendChild(d);m.classList.add('on');HX.msgSrc=src||'';clearTimeout(HX.mt);HX.mt=setTimeout(()=>{m.classList.remove('on');HX.msgSrc=''},ms||3600)}
const hideMsg=src=>{if(!src||HX.msgSrc===src){clearTimeout(HX.mt);$z('zhm').classList.remove('on');HX.msgSrc=''}};

// ---------------------------------------------------------------- interaction
const blocked=()=>HX.busy||(typeof DR!=='undefined'&&DR)||['zc','znm','zlbn','zp','zv'].some(id=>{const e=$z(id);return e&&e.classList.contains('on')});
function act(it){if(!it||blocked())return;
 if(it.k==='soon'){HX.soonP=1;AM.sfx('interaction');msg('A new world is on the horizon.','Not open yet. Keep exploring.',4200,'soon');return}
 const i=it.i;
 if(!open(i)){AM.sfx('incorrect');const w=W[i];msg('SEALED',w.bonus?'Discover THE ORIGIN to unlock the optional worlds.':'Discover '+W[i-1].title+' first.',3400,'seal');return}
 HX.busy=1;K.l=K.r=0;HX.tx=null;HX.pend=null;hideMsg();pick(i,btn[i])}
function onNear(){const it=IT[HX.near];if(it&&it.k==='soon')msg('Something new is taking shape...','',5600,'soon');else{hideMsg('soon');hideMsg('seal')}}
function walkTo(i){if(blocked())return;HX.tx=portalX(i);HX.pend=i}

// ---------------------------------------------------------------- physics (same feel as Origin: coyote time, jump buffer, momentum)
function update(dt,inp){
 let dir=inp?((K.r?1:0)-(K.l?1:0)):0;
 if(dir){HX.tx=null;HX.pend=null;HX.moved=1}
 else if(inp&&HX.tx!=null){const d=HX.tx-HX.x;if(Math.abs(d)>3)dir=Math.sign(d);else{HX.tx=null;if(HX.pend!=null){const p=HX.pend;HX.pend=null;act(IT[p])}}}
 if(dir)HX.face=dir;
 HX.vx+=Math.max(-ACC*dt,Math.min(ACC*dt,dir*SPD-HX.vx));
 HX.coy=HX.gr?.1:HX.coy-dt;HX.buf-=dt;if(inp&&K.jp){HX.buf=.12;HX.jumped=1}K.jp=0;
 if(HX.buf>0&&HX.coy>0){HX.vy=JV;HX.gr=0;HX.coy=0;HX.buf=0;dust(4);AM.sfx('hover')}
 let nx=Math.max(70,Math.min(LW-40,HX.x+HX.vx*dt));if(baseH(nx)-HX.y>STEP){nx=HX.x;HX.vx=0}HX.x=nx;
 const s=baseH(HX.x);
 if(HX.gr){if(HX.y-s>STEP){HX.gr=0;HX.vy=0}else HX.y=s}
 if(!HX.gr){HX.vy-=GRAV*dt;HX.y+=HX.vy*dt;HX.air+=dt;if(HX.y<=s&&HX.vy<=0){HX.y=s;HX.vy=0;HX.gr=1;if(HX.air>.25)dust(5);HX.air=0}}
 if(HX.gr&&Math.abs(HX.vx)>20){HX.foot+=dt;if(HX.foot>.3){HX.foot=0;AM.sfx('step');if(Math.random()<.6)dust(1)}}
 if(inp&&K.e){K.e=0;if(HX.near>=0)act(IT[HX.near])}K.e=0;
 let nb=-1,bd=1e9;IT.forEach((it,k)=>{const d=Math.abs(HX.x-it.x);if(d<it.z&&Math.abs(HX.y-it.y)<24&&d<bd){bd=d;nb=k}});
 if(nb!==HX.near){HX.near=nb;onNear()}
 const tgt=Math.max(0,Math.min(LW-VW,HX.x-VW/2+HX.face*14));HX.cam+=(tgt-HX.cam)*Math.min(1,dt*6);
 HX.soonP=Math.max(0,HX.soonP-dt*.8);Object.keys(HX.pulse).forEach(k=>{HX.pulse[k]=Math.max(0,HX.pulse[k]-dt*.7)});
 HX.ps=HX.ps.filter(p=>p.l>0);HX.ps.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.l-=dt})}
function dust(n){for(let i=0;i<n;i++)HX.ps.push({x:HX.x+(Math.random()-.5)*8,y:GYS-HX.y,vx:(Math.random()-.5)*26,vy:-6-Math.random()*14,g:30,l:.45,c:'#cfd6e4'})}
function spark(x,y,c,n){for(let i=0;i<n;i++){const a=Math.random()*6.283,s=20+Math.random()*50;HX.ps.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-20,g:60,l:.8,c})}}

// ---------------------------------------------------------------- drawing: world pieces
function floorStrip(x0,x1,y,hMax,dark){const w=x1-x0;if(w<=0)return;const cr=Math.round(HX.cam),base=mix('#0e1226','#05060f',dark||0),seam=mix('#070918','#02030a',dark||0),lip=mix(mix('#2e3868',PAL[0],.26),'#000',dark||0);
 R(x0,y,w,hMax,base);R(x0,y,w,1,lip);R(x0,y+1,w,1,mix(lip,base,.65));
 [[2,8,26],[10,10,34],[20,13,44],[33,40,62]].forEach(([o,h,sp],ri)=>{const yy=y+o;if(yy>=y+hMax)return;const hh=Math.min(h,y+hMax-yy);R(x0,yy,w,1,seam);const off=ri%2?sp/2:0;
  for(let k=Math.floor((cr+x0-off)/sp);k*sp+off-cr<x1;k++){const sx=k*sp+off-cr;if(sx>=x0&&sx<x1)R(sx,yy,1,hh,seam);if((k*7+ri*13)%5===0&&sx+1<x1)R(Math.max(x0,sx+1),yy+1,Math.min(sp-1,x1-Math.max(x0,sx+1)),hh-1,mix(base,'#1b2144',.5-(dark||0)*.4))}})}
function faceBlock(x0,x1,y0,y1){const w=x1-x0;if(w<=0)return;const cr=Math.round(HX.cam),f='#0b0e20',l=mix('#232a52',PAL[0],.2);R(x0,y0,w,y1-y0,f);R(x0,y0,w,1,l);R(x0,y0+1,w,1,mix(l,f,.6));
 for(let y=y0+6,r=0;y<y1;y+=6,r++){R(x0,y,w,1,'#06080f');for(let k=Math.floor((cr+x0-(r%2?8:0))/16);k*16+(r%2?8:0)-cr<x1;k++){const sx=k*16+(r%2?8:0)-cr;if(sx>=x0&&sx<x1)R(sx,y+1,1,5,'#06080f')}}
 R(x0,y1-2,w,2,'#05060f')}
function floor(cr){floorStrip(0,VW,GYS,VH-GYS,0);
 // terrace stage + stairs
 const tx0=TERRX-cr,sx0=STAIRX-cr;
 if(tx0<VW){const a=Math.max(0,tx0);R(a,GYS+14,VW-a,6,'#00000066');floorStrip(a,VW,GYS-TERR,36,0);faceBlock(a,VW,GYS-TERR+36,GYS+16)}
 if(sx0<VW&&sx0+SN*SW>0)for(let k=0;k<SN;k++){const x=sx0+k*SW,top=GYS-(k+1)*SH;if(x+SW<0||x>VW)continue;R(x,top,SW,GYS+16-top,'#0b0e20');R(x,top,SW,1,mix('#2e3868',PAL[0],.3));R(x,top+1,SW,1,'#181d3e');R(x,top+SH,SW,1,'#06080f');R(x,top,1,GYS+16-top,'#171b38')}
 R(Math.max(0,sx0),GYS+14,Math.min(VW,SN*SW),2,'#00000066');
 // inlaid light path: bright up to the next objective, dim beyond
 const n=nextIdx(),lit=n>=0?portalX(n):portalX(9)+40;const pc=mix(PAL[0],'#fff',.2);
 for(let x=START-60;x<LW-60;x+=2){const sx=x-cr;if(sx<0||sx>=VW)continue;if(x>=STAIRX&&x<TERRX)continue;const y=(x>=TERRX?GYS-TERR:GYS)+6;if(((x+(x<lit?Math.floor(tm*24):0))>>2)%2)continue;R(sx,y,2,1,x<=lit?mix(pc,'#05060f',.15+.25*(.5+.5*Math.sin(tm*3-x*.05))):'#1c2244')}}

function lamp(wx,by,seed){const cr=Math.round(HX.cam),x=Math.round(wx-cr);if(x<-12||x>VW+12)return;const f=.75+.25*Math.sin(tm*7+seed*3)*Math.sin(tm*3.1+seed),c=mix(PAL[0],'#ffd35a',.5);
 R(x,by-38,2,38,'#121631');R(x-1,by-38,1,38,'#1c2248');R(x-3,by-3,8,3,'#1c2248');R(x-2,by-6,6,3,'#121631');
 R(x-4,by-44,10,6,'#121631');R(x-3,by-43,8,4,mix('#05060f',c,.35+.35*f));R(x-1,by-42,4,2,mix(c,'#fff',.6));R(x-5,by-45,12,1,'#2a3157');
 glow(x+1,by-41,Math.round(16*f),c,.03);hg.globalCompositeOperation='lighter';hg.globalAlpha=.07*f;hg.fillStyle=c;for(let k=0;k<4;k++)hg.fillRect(x-18+k*3,by+k+1,38-k*6,1);hg.globalAlpha=1;hg.globalCompositeOperation='source-over'}
function planter(wx,by,seed){const cr=Math.round(HX.cam),x=Math.round(wx-cr);if(x<-14||x>VW+14)return;R(x-8,by-7,16,7,'#161b36');R(x-8,by-7,16,1,'#2a3157');R(x-9,by-8,18,1,'#232a52');R(x-7,by-2,14,2,'#0d1128');
 for(let k=0;k<3;k++){const c=PAL[(k+seed)%3],h=8+k*3,xo=-4+k*4,p=.6+.4*Math.sin(tm*2+k+seed);R(x+xo,by-8-h,2,h,mix(c,'#05060f',.45-p*.25));R(x+xo,by-8-h,1,h,mix(c,'#fff',.35*p));R(x+xo,by-9-h,2,1,mix(c,'#fff',.6))}
 glow(x,by-14,12,PAL[seed%3],.025)}
function brazier(wx,by){const cr=Math.round(HX.cam),x=Math.round(wx-cr);if(x<-12||x>VW+12)return;R(x-1,by-14,3,14,'#121631');R(x-5,by-3,11,3,'#1c2248');R(x-5,by-20,11,6,'#1c2248');R(x-4,by-21,9,2,'#2a3157');
 for(let k=0;k<5;k++){const h=3+Math.floor(3+3*Math.sin(tm*9+k*1.7)),c=k<2?'#ff7a3c':k<4?'#ffb347':'#ffe9a0';R(x-4+k*2,by-21-h,2,h,c)}glow(x,by-26,22,'#ff9a3c',.035)}

function gate(cr){const x=Math.round(60-cr);if(x>VW+10||x<-120)return;const st='#141933',stl=mix('#2c3566',PAL[0],.2),std='#0b0e20';
 for(const px of[x,x+88]){R(px,GYS-84,12,84,st);R(px,GYS-84,1,84,stl);R(px+11,GYS-84,1,84,std);for(let y=GYS-78;y<GYS-4;y+=8)R(px,y,12,1,std);R(px-2,GYS-88,16,5,mix(st,stl,.4));R(px-3,GYS-3,18,3,stl)}
 R(x-4,GYS-100,108,18,st);R(x-4,GYS-100,108,1,stl);R(x-4,GYS-83,108,1,std);R(x-2,GYS-98,104,2,mix(st,'#000',.3));
 gtext('ZKSCAPE',x+52-ZNAME.width('ZKSCAPE',1)/2,GYS-96,mix(PAL[0],'#fff',.55),1);R(x+12,GYS-88,76,1,mix(PAL[0],'#000',.4));
 R(x+14,GYS-86,3,3,PAL[1]);R(x+83,GYS-86,3,3,PAL[2]);glow(x+52,GYS-92,40,PAL[0],.02)}

// ---------------------------------------------------------------- portals
function portal(i,cr){const w=W[i],bx=Math.round(portalX(i)-cr),by=GYS-(i>=10?TERR:0);if(bx<-60||bx>VW+60)return;const st=stOf(i),col=st.col,pl=HX.pulse[i]||0;
 const stone=st.op?'#171c3a':'#10142a',stoneL=st.op?mix('#2f3a70',PAL[0],.2):'#1e2340',stoneD='#0a0d20',AR=22,AI=15,PHh=44,CY=by-6-PHh;
 const pul=st.dn?.55:st.op?.5+.5*Math.sin(tm*3+i):0;
 if(st.op||st.dn){glow(bx,by-34,40,col,(.025+.02*pul)+pl*.05);hg.globalCompositeOperation='lighter';hg.globalAlpha=.1+.06*pul+pl*.2;hg.fillStyle=col;for(let k=0;k<10;k++){const ww=Math.round(52-k*4.2);hg.fillRect(bx-(ww>>1),by+1+k,ww,1);hg.globalAlpha*=.8}hg.globalAlpha=1;hg.globalCompositeOperation='source-over'}
 // glass
 for(let y=CY-AI;y<by-6;y++){const dy=y-CY,half=dy<0?Math.floor(Math.sqrt(AI*AI-dy*dy)+.5):AI;if(half<=0)continue;
  if(!st.op){R(bx-half,y,half*2,1,'#060813');if((y-CY+AI)%9<2)R(bx-half,y,half*2,1,'#1a1f38')}
  else{const v=.5+.5*Math.sin(tm*(st.dn?1.2:2.4)+(y-CY)*.32+i),amt=st.dn?.34:.55;R(bx-half,y,half*2,1,mix('#05060f',col,(.16+.34*v)*amt+pl*.5));}}
 if(st.op){hg.globalAlpha=.4+.2*pul;for(let k=0;k<5;k++){const xx=bx-12+k*6+Math.round(Math.sin(tm*1.3+k*1.7)*1.5),y0=CY-AI+6+(k%2)*4;if(Math.abs(xx-bx)<AI-2)R(xx,y0,1,by-6-y0,mix(col,'#fff',.35))}hg.globalAlpha=1;
  for(let k=0;k<9;k++){const xx=bx-13+((k*37)%27),yy=by-8-((tm*(10+k%4*3)+k*23)%(PHh+AI-8));if(yy>CY-AI+2&&Math.abs(xx-bx)<AI-1)R(xx,yy,1,1,mix(col,'#fff',.6))}}
 // emblem / padlock
 if(st.op){hg.globalAlpha=st.dn?.95:.9;hg.drawImage(EM[w.id+col],bx-16,by-52);hg.globalAlpha=1}
 else{gtext('@',bx-5,by-42,SLATE,2)}
 // stone frame
 R(bx-27,by-3,54,3,stoneL);R(bx-25,by-6,50,3,stone);R(bx-27,by-3,54,1,mix(stoneL,'#fff',.08));
 for(const sg of[-1,1]){const px=sg<0?bx-22:bx+15;R(px,CY,7,PHh,stone);R(sg<0?px:px+6,CY,1,PHh,sg<0?stoneL:stoneD);for(let g=CY+6;g<by-8;g+=8)R(px,g,7,1,stoneD);
  R(px-1,CY+PHh-4,9,4,stoneL);R(px-1,CY-1,9,2,stoneL);if(st.op){R(px+3,CY+14,1,3,mix(col,'#fff',.2+.3*pul));R(px+3,CY+30,1,3,mix(col,'#fff',.2+.3*pul))}
  if(st.bn){R(px+2,CY-4,3,3,GOLD);R(px+3,CY-5,1,1,'#fff')}}
 for(let dy=-AR;dy<=0;dy++){const wo=Math.floor(Math.sqrt(AR*AR-dy*dy)+.5),wi=-dy<=AI?Math.floor(Math.sqrt(AI*AI-dy*dy)+.5):-1;
  if(wi<0)R(bx-wo,CY+dy,wo*2,1,stone);else{R(bx-wo,CY+dy,wo-wi,1,stone);R(bx+wi,CY+dy,wo-wi,1,stone)}R(bx-wo,CY+dy,1,1,stoneL);R(bx+wo-1,CY+dy,1,1,stoneD);
  if(st.op&&wi>=0){R(bx-wi,CY+dy,1,1,mix(stoneL,col,.55+.3*pul));R(bx+wi-1,CY+dy,1,1,mix(stoneL,col,.55+.3*pul))}}
 for(let a=-75;a<=75;a+=25){const an=a*Math.PI/180;for(let rr=AI+1;rr<AR;rr++)R(bx+Math.round(Math.sin(an)*rr),CY-Math.round(Math.cos(an)*rr),1,1,stoneD)}
 R(bx-3,CY-AR,6,8,stoneL);R(bx-2,CY-AR+1,4,5,stone);R(bx-1,CY-AR+2,2,2,st.op?mix(col,'#fff',.3+.4*pul):'#242a4a');
 if(st.bn){hg.fillStyle=GOLD;for(let a=0;a<=36;a+=2){const an=Math.PI+a/36*Math.PI;if(a%4===0)hg.fillRect(Math.round(bx+Math.cos(an)*(AR+4)),Math.round(CY+Math.sin(an)*(AR+4)),1,1)}}
 if(st.dn)for(let k=0;k<3;k++){const a=tm*1.2+k*2.09;R(Math.round(bx+Math.cos(a)*(AR+6)),Math.round(CY-AR*.2+Math.sin(a)*(AR+4)*.7),2,2,mix(GREEN,'#fff',.4))}}

function soonPillar(cr){const bx=Math.round(SOONX-cr),by=GYS-TERR;if(bx<-70||bx>VW+70)return;const p=.5+.5*Math.sin(tm*1.6),e=HX.soonP;
 // dais with faint runes
 R(bx-30,by-3,60,3,'#232a52');R(bx-24,by-6,48,3,'#181d3c');R(bx-30,by-3,60,1,mix('#232a52',ICE,.25));
 for(let k=-4;k<=4;k++)if(k)R(bx+k*5,by-5,2,1,mix('#181d3c',ICE2,.35+.4*((Math.sin(tm*2+k)+1)/2)));
 glow(bx,by-46,52,ICE2,.018+.012*p+e*.04);
 // beam of dithered light
 hg.globalAlpha=.07+.04*p+e*.1;hg.fillStyle=ICE;for(let y=Math.max(0,by-120);y<by-72;y++){if((y&1)===0)hg.fillRect(bx-7+((y>>1)&1),y,14-((y>>1)&1)*2,1)}hg.globalAlpha=1;
 // monolith: tapering slab, chamfered top, dithered face
 const H=64;for(let yy=0;yy<H;yy++){const hw=15-Math.floor(yy*5/H),y=by-6-yy,cut=yy>H-12?(yy-(H-12))*1.3:0;let x0=bx-hw,x1=bx+hw;x1-=Math.floor(cut);if(x1<=x0)continue;
  R(x0,y,x1-x0,1,'#171b38');if(yy%2===0)for(let x=x0+(yy>>1)%2;x<x1;x+=2)R(x,y,1,1,'#12162f');R(x0,y,1,1,'#3a4278');R(x1-1,y,1,1,'#0a0d20')}
 // light leaking through the crack
 const cx=bx+2;let cxx=cx;for(let yy=8;yy<56;yy++){if(yy%7===0)cxx+=(yy%14===0?1:-1);const a=.55+.45*Math.sin(tm*3+yy*.2);R(cxx,by-6-yy,1,1,mix('#fff',ICE,.3));hg.globalCompositeOperation='lighter';hg.globalAlpha=(.14+.12*p)*a;hg.fillStyle=ICE2;hg.fillRect(cxx-1,by-6-yy,3,1);hg.globalAlpha=1;hg.globalCompositeOperation='source-over'}
 // a doorway that is slowly "taking shape": etched outline appears pixel by pixel and fades
 const prog=(tm*.09)%1,pts=[];for(let yy=0;yy<30;yy++){pts.push([bx-6,by-8-yy]);pts.push([bx+6,by-8-yy])}for(let a=0;a<=20;a++){const an=Math.PI+a/20*Math.PI;pts.push([bx+Math.cos(an)*6,by-38+Math.sin(an)*6])}
 const nn=Math.floor(pts.length*Math.min(1,prog*1.25)),fade=prog>.8?(1-prog)/.2:1;hg.globalAlpha=.9*fade*(.6+.4*p+e*.4);hg.fillStyle=ICE;for(let k=0;k<nn;k++){if(k%2===0||prog>.6)hg.fillRect(Math.round(pts[k][0]),Math.round(pts[k][1]),1,1)}hg.globalAlpha=1;
 // drifting shards
 for(let k=0;k<5;k++){const a=tm*.45+k*1.257,rx=26+k%2*7,sx=bx+Math.cos(a)*rx,sy=by-40+Math.sin(a*1.7+k)*20-k*3,z=Math.sin(a)>0;if(Math.sin(a)<0)continue;const c=mix(ICE,ICE2,k/5);
  R(sx,sy-3,1,2,c);R(sx-1,sy-1,3,2,c);R(sx,sy+1,1,2,mix(c,'#000',.3));hg.globalAlpha=.4;R(sx-Math.cos(a)*3,sy+1,1,1,c);R(sx-Math.cos(a)*6,sy+2,1,1,c);hg.globalAlpha=1}}

// ---------------------------------------------------------------- player
function playerImg(){if(HX.imgSrc!==S.pfp){HX.imgSrc=S.pfp;HX.img=new Image();HX.img.src=S.pfp||''}return HX.img}
function drawPlayer(cr){const sx=Math.round(HX.x-cr),ground=GYS-baseH(HX.x),by=GYS-Math.round(HX.y),im=playerImg();const air=Math.max(0,Math.min(1,(HX.y-baseH(HX.x))/30));
 R(sx-7+air*2,ground,15-air*4,1,'#00000077');R(sx-5+air*2,ground+1,11-air*4,1,'#00000055');
 glow(sx,by-13,16,PAL[0],.025);
 const walking=HX.gr&&Math.abs(HX.vx)>12,bob=walking?(Math.floor(tm*11)%2):(HX.gr&&Math.floor(tm*1.5)%2?1:0),top=by-PHT-bob;HX.top=top;
 if(im&&im.complete&&im.naturalWidth){const aw=Math.max(8,Math.round(PHT*im.naturalWidth/im.naturalHeight));hg.save();hg.imageSmoothingEnabled=false;
  if(HX.face<0){hg.translate(sx,0);hg.scale(-1,1);hg.drawImage(im,-(aw>>1),top,aw,PHT)}else hg.drawImage(im,sx-(aw>>1),top,aw,PHT);hg.restore()}
 else{R(sx-6,top+4,12,PHT-4,PAL[0])}}

// ---------------------------------------------------------------- frame
function core(cr){const lv=nd()/10,pw=.25+.75*lv,cx=Math.round(VW*.5-cr*.045),cy=Math.round(GYS*.2),r=Math.round(GYS*.085),p=.5+.5*Math.sin(tm*1.4);
 glow(cx,cy,r*3.4,PAL[0],.02+.02*pw);glow(cx,cy,r*1.8,PAL[0],.03+.03*pw);
 for(let k=0;k<3+Math.round(lv*3);k++){const rx=Math.round(r*(1.5+k*.55)),ry=Math.round(rx*(.3+.06*k)),n=60+k*14,c=PAL[k%3],rot=tm*(k%2?.25:-.18),til=(k-1)*.35,ct=Math.cos(til),stt=Math.sin(til);
  for(let q=0;q<n;q++){if(q%3===0)continue;const a=q/n*6.283+rot,ex=Math.cos(a)*rx,ey=Math.sin(a)*ry,X=cx+ex*ct-ey*stt,Y=cy+ex*stt+ey*ct;hg.globalAlpha=(.25+pw*.55)*(Math.sin(a)>0?1:.45);R(X,Y,1,1,c)}}hg.globalAlpha=1;
 disc(cx,cy,r,mix(PAL[0],'#000',.55),.95);disc(cx,cy,Math.round(r*.78*(1+.04*p)),mix(PAL[0],'#fff',.45),.4+pw*.6);disc(cx,cy,Math.round(r*.4),mix(PAL[0],'#fff',.8),.5+pw*.5)}
function chain(cr){const lv=nd()/10,N=13,span=LW*.15+VW-60;let px=null,py=null;for(let k=0;k<N;k++){const x=Math.round(30+k*span/(N-1)-cr*.15),y=Math.round(GYS*.18+Math.sin(k*.9+tm*.4)*7+(k%2)*5),lit=k/N<lv+.1,c=PAL[k%3];
  if(px!==null&&x>-20&&px<VW+20){hg.globalAlpha=lit?.5:.3;const dx=x-px,dy=y-py;for(let q=0;q<=10;q++)R(px+dx*q/10,py+dy*q/10,1,1,lit?c:'#2a2f52');hg.globalAlpha=1}
  px=x;py=y;if(x<-8||x>VW+8)continue;R(x-3,y-3,7,7,lit?mix(c,'#000',.55):'#141831');R(x-3,y-3,7,1,lit?c:'#2a2f52');R(x-3,y-3,1,7,lit?mix(c,'#fff',.2):'#232846');if(lit){R(x-1,y-1,3,3,mix(c,'#fff',.55));glow(x,y,10,c,.03)}}}
function fg(cr){ // foreground: dark crystal grass along the bottom edge + drifting mist + soft vignette (never covers the playfield)
 const r=mb32(5);for(let k=0;k<60;k++){const wx=r()*(LW*1.3+VW),x=Math.round(wx-cr*1.3),h=3+Math.floor(r()*8);if(x<-3||x>VW+3)continue;R(x,VH-h,2,h,'#03040a');if(h>7)R(x,VH-h,1,1,mix(PAL[k%3],'#000',.3))}
 for(let k=0;k<3;k++){const y=GYS-2-k*4+Math.round(Math.sin(tm*.5+k)*1);hg.globalAlpha=.07;hg.fillStyle='#b8c4ff';const off=Math.floor(tm*(4+k*3)+k*9)%8;for(let x=-off;x<VW;x+=8)hg.fillRect(x+(k%2)*4,y,5,1);hg.globalAlpha=1}
 const rm=mb32(9);for(let k=0;k<26;k++){const wx=rm()*LW*1.1,wy=GYS*(.35+rm()*.6),x=Math.round(((wx-cr*1.1+tm*(3+k%4)*(k%2?1:-1))%(VW+20)+VW+20)%(VW+20))-10,y=Math.round(wy+Math.sin(tm*.8+k)*3);hg.globalAlpha=.25+.35*Math.abs(Math.sin(tm*1.3+k));R(x,y,1,1,PAL[k%3]);hg.globalAlpha=1}
 hg.fillStyle='#02030a';for(let k=0;k<8;k++){hg.globalAlpha=.5-k*.06;hg.fillRect(0,k,VW,1);hg.fillRect(0,0,Math.max(0,10-k),VH);hg.fillRect(VW-Math.max(0,10-k),0,Math.max(0,10-k),VH)}hg.globalAlpha=1}

function render(){const cr=Math.round(HX.cam);hg.setTransform(1,0,0,1,0,0);hg.globalCompositeOperation='source-over';hg.globalAlpha=1;hg.shadowBlur=0;hg.imageSmoothingEnabled=false;
 hg.drawImage(skyC,0,0);if(!reduce)for(let k=0;k<10;k++){const s=mb32(k*77+3);const x=Math.floor(s()*VW),y=Math.floor(s()*GYS*.6);hg.globalAlpha=.2+.8*Math.abs(Math.sin(tm*1.7+k*2.1));R(x,y,1,1,'#fff');hg.globalAlpha=1}
 core(cr);chain(cr);hg.drawImage(farC,-Math.round(cr*.12),0);
 beacons.forEach((b,k)=>{const x=b.x-Math.round(cr*.12);if(x<0||x>VW)return;if(Math.sin(tm*2+k*1.9)>.3)R(x,b.y,1,2,b.c)});
 hg.drawImage(midC,-Math.round(cr*.38),0);
 gate(cr);floor(cr);
 for(let k=-1;k<9;k++){const wx=X0+DX*k+DX/2;(k%2?planter:lamp)(wx,GYS,k+2)}lamp(1875,GYS,11);lamp(2240,GYS-TERR,12);lamp(2400,GYS-TERR,13);lamp(2600,GYS-TERR,14);planter(2065,GYS-TERR,3);
 brazier(150,GYS);brazier(250,GYS);
 for(let i=W.length-1;i>=0;i--)portal(i,cr);soonPillar(cr);
 drawPlayer(cr);
 HX.ps.forEach(p=>{hg.globalAlpha=Math.min(1,p.l*2);R(p.x-cr,p.y,1,1,p.c)});hg.globalAlpha=1;
 fg(cr)}

// ---------------------------------------------------------------- overlay (crisp text): plaques, markers, name tag, prompt, minimap, hints
function plaque(cx,bottomY,l1,c1,l2,c2,k,dash){const k2=Math.max(1,k-1),w1=ZNAME.width(l1,k),w2=l2?ZNAME.width(l2,k2):0,w=Math.max(w1,w2)+k*6,h=7*k+(l2?7*k2+k*2:0)+k*5,x=Math.round(cx-w/2),y=Math.round(bottomY-h);
 ho.fillStyle='rgba(4,5,14,.86)';ho.fillRect(x+k,y,w-2*k,h);ho.fillRect(x,y+k,w,h-2*k);ho.fillStyle=c1;ho.globalAlpha=.85;const b=Math.max(1,Math.round(k/2));
 if(dash){for(let q=x+k;q<x+w-k;q+=k*3){ho.fillRect(q,y,k*2,b);ho.fillRect(q,y+h-b,k*2,b)}}else{ho.fillRect(x+k,y,w-2*k,b);ho.fillRect(x+k,y+h-b,w-2*k,b)}ho.fillRect(x,y+k,b,h-2*k);ho.fillRect(x+w-b,y+k,b,h-2*k);ho.globalAlpha=1;
 ZNAME.text(ho,l1,Math.round(cx-w1/2),y+k*3,k,c1);if(l2)ZNAME.text(ho,l2,Math.round(cx-w2/2),y+k*3+7*k+k*2,k2,c2)}
function keycap(x,y,k,label){const w=6*k+k*2+(label.length-1)*6*k,h=7*k+k*2;ho.fillStyle='#e9ecff';ho.fillRect(x+k,y,w-2*k,h);ho.fillRect(x,y+k,w,h-2*k);ho.fillStyle='#8a90b8';ho.fillRect(x+k,y+h-k,w-2*k,k);ZNAME.text(ho,label,x+k+k/2|0,y+k,k,'#05060f');return w}
function overlay(){const cr=Math.round(HX.cam),k=Math.max(2,Math.min(4,Math.round(PX*.6))),W_=HO.width,H_=HO.height;ho.setTransform(1,0,0,1,0,0);ho.clearRect(0,0,W_,H_);ho.imageSmoothingEnabled=false;
 const nx=nextIdx();
 for(let i=0;i<W.length;i++){const bx=(portalX(i)-cr)*PX;if(bx<-120||bx>W_+120)continue;const by=GYS-(i>=10?TERR:0),st=stOf(i),w=W[i],topY=(by-76)*PX;
  const l1=String(i+1).padStart(2,'0')+' '+w.n,l2=st.dn?'% DISCOVERED':!st.op?'@ SEALED':st.bn?'OPTIONAL':'ENTER';
  plaque(bx,topY-k*2,l1,st.op?'#fff':'#7d829f',l2,st.dn?GREEN:!st.op?'#6a6f88':st.bn?GOLD:PAL[i%3],k,st.bn);
  if(i===nx){const y=topY-k*2-(7*k+7*Math.max(1,k-1)+k*7)-k*3+Math.round(Math.sin(tm*5)*k*1.5);ho.save();ho.fillStyle=PAL[0];ZNAME.text(ho,'~',Math.round(bx-ZNAME.width('~',k)/2),y-7*k,k,PAL[0]);ho.restore()}}
 {const bx=(SOONX-cr)*PX;if(bx>-160&&bx<W_+160){const by=GYS-TERR;plaque(bx,(by-80)*PX,'COMING SOON',ICE,'?',ICE2,k,true)}}
 // name tag over the player (same shared routine used in every world)
 const px=(HX.x-cr)*PX;ZNAME.tag(ho,px,(HX.top||GYS)*PX,ZNAME.kScale(),1,W_);
 // contextual prompt on the floor strip, away from the name tag
 const it=IT[HX.near];if(it&&!blocked()&&!$z('zhm').classList.contains('on')){let t,c='#fff';
  if(it.k==='soon')t=['?','LISTEN'];else{const st=stOf(it.i);t=!st.op?['@','SEALED']:[coarse?'*':'E',(st.dn?'REVISIT ':'ENTER ')+W[it.i].n];c=!st.op?'#8a90b8':'#fff'}
  const py=Math.round((GYS+Math.min(22,FL*.45))*PX),tw=ZNAME.width(t[1],k),cw=6*k+k*2+(t[0].length-1)*6*k,tot=cw+k*3+tw+k*6,x0=Math.round(W_/2-tot/2);
  ho.fillStyle='rgba(4,5,14,.86)';ho.fillRect(x0+k,py-k*2,tot-2*k,7*k+k*5);ho.fillRect(x0,py-k,tot,7*k+k*3);
  if(t[0]==='@'||t[0]==='?')ZNAME.text(ho,t[0],x0+k*3,py+k/2|0,k,c);else keycap(x0+k*3,py-k/2|0,k,t[0]);
  ZNAME.text(ho,t[1],x0+k*3+cw+k*3,py+k/2|0,k,c)}
 // progress strip
 {const sw=Math.min(300,W_*.42),x0=Math.round(W_/2-sw/2),y=H_-18,rel=x=>x0+(x-START)/(2640-START)*sw;ho.fillStyle='rgba(4,5,14,.6)';ho.fillRect(x0-8,y-7,sw+16,14);ho.fillStyle='#232846';ho.fillRect(x0,y,sw,2);
  for(let i=0;i<W.length;i++){const st=stOf(i);ho.fillStyle=st.dn?GREEN:st.op?(i===nx?PAL[0]:PAL[i%3]):'#3a3f5c';const s=i===nx?7:5;ho.fillRect(Math.round(rel(portalX(i))-s/2),y+1-s/2,s,s)}
  ho.fillStyle=ICE;ho.globalAlpha=.7;const sx=Math.round(rel(SOONX));ho.fillRect(sx-1,y-3,2,8);ho.globalAlpha=1;ho.fillStyle='#fff';ho.fillRect(Math.round(rel(HX.x))-1,y-6,3,4)}
 // first-time control hints
 if(HX.hintT<22&&!(HX.moved&&HX.jumped)&&!coarse){const a=Math.max(0,Math.min(1,(22-HX.hintT)/3)),y=Math.round(H_*.2);ho.globalAlpha=a;
  const items=[['<','>','MOVE'],['SPACE','','JUMP'],['E','','ENTER']];let tot=0;const wd=items.map(([a1,a2,l])=>{const w1=6*k+k*2+(a1.length-1)*6*k+(a2?6*k+k*2+k*2:0)+k*3+ZNAME.width(l,k);tot+=w1;return w1});tot+=k*8*(items.length-1);
  let x=Math.round(W_/2-tot/2);ho.fillStyle='rgba(4,5,14,.7)';ho.fillRect(x-k*3,y-k*2,tot+k*6,7*k+k*6);
  items.forEach(([a1,a2,l],n)=>{let xx=x;xx+=keycap(xx,y,k,a1)+k*2;if(a2)xx+=keycap(xx,y,k,a2)+k*2;ZNAME.text(ho,l,xx+k,y+k,k,'#cfd4f5');x+=wd[n]+k*8});ho.globalAlpha=1}}

// ---------------------------------------------------------------- HUD (DOM) + buttons
function hudUpdate(){const n=ZNAME.get();const pf=$z('zprof');pf.textContent='';const a=document.createElement('i');a.textContent='\u25C6';const b=document.createElement('span');b.textContent=n;const c=document.createElement('u');c.textContent='EDIT';pf.append(a,b,c);
 const wl=$z('wel');wl.textContent='WELCOME, '+n+'. ZKSCAPE AWAITS.';
 const nx=nextIdx(),hd=$z('hd');if(hd){const old=hd.querySelector('.nx');old&&old.remove();const d=document.createElement('div');d.className='nx';d.style.cssText='color:var(--a)';d.textContent=nx>=0?'NEXT \u2192 '+String(nx+1).padStart(2,'0')+' '+W[nx].n:(nd()>=10?'ALL CORE WORLDS DISCOVERED':'');if(d.textContent)hd.insertBefore(d,hd.querySelector('details'))}}
function buildButtons(){const ring=$z('ring');ring.innerHTML='';btn=[];W.forEach((w,i)=>{const b=document.createElement('button');b.type='button';const st=stOf(i);b.className='po '+(st.dn?'done':st.op?'open':'')+(w.bonus?' bonus':'');
  b.setAttribute('aria-label',String(i+1).padStart(2,'0')+' '+w.title+(st.dn?' (discovered)':st.op?'':' (sealed)'));b.tabIndex=0;b.onmousedown=e=>e.preventDefault();b.onclick=()=>walkTo(i);ring.appendChild(b);btn.push(b)});}
function placeButtons(cr){btn.forEach((b,i)=>{const x=(portalX(i)-cr)*PX,y=(GYS-(i>=10?TERR:0)-38)*PX;b.style.left=x+'px';b.style.top=y+'px';b.style.display=(x<-80||x>HO.width+80)?'none':'block'})}

// ---------------------------------------------------------------- input
const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',ArrowUp:'j',KeyW:'j',KeyE:'e',Enter:'e',KeyF:'e'})[c];
addEventListener('keydown',e=>{if(!HS.classList.contains('on')||e.metaKey||e.ctrlKey||e.altKey)return;const t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;const k=km(e.code);if(!k)return;
 if(t&&/^(BUTTON|SUMMARY)$/.test(t.tagName)&&(e.code==='Space'||e.code==='Enter'))return;   // keep native button activation
 if(blocked())return;e.preventDefault();if(k==='e'){if(!e.repeat)K.e=1;return}if(k==='j'){if(!K.j&&!e.repeat)K.jp=1;K.j=1;return}K[k]=1});
addEventListener('keyup',e=>{const k=km(e.code);if(k&&k!=='e'){if(k==='j')K.j=0;else K[k]=0}});addEventListener('blur',()=>{K.l=K.r=K.j=0});
HS.addEventListener('pointerdown',e=>{if(!HS.classList.contains('on')||blocked())return;if(e.target.closest&&e.target.closest('button,input,summary,details,a,label'))return;HX.tx=Math.max(40,Math.min(LW-40,Math.round(HX.cam)+e.clientX/PX));HX.pend=null});
(function touch(){const c=$z('hctl');if(!coarse)return;c.style.display='flex';const mb=(t,k,l)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.setAttribute('aria-label',l);
  const set=v=>e=>{e.preventDefault();if(blocked())return;if(k==='j'){if(v&&!K.j)K.jp=1;K.j=v;return}if(k==='e'){if(v)K.e=1;return}K[k]=v};b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L=document.createElement('div'),Rr=document.createElement('div');L.append(mb('\u25C0','l','left'),mb('\u25B6','r','right'));Rr.append(mb('\uD83D\uDCAC','e','interact'),mb('\u2934','j','jump'));c.append(L,Rr)})();
$z('zprof').onclick=()=>{if(!blocked())ZNAME.ask('edit')};
ZNAME.onChange(()=>{hudUpdate()});

// ---------------------------------------------------------------- engine entry points
function enter(was){PAL=pal();tm=tm||0;buildItems();playerImg();
 if(!was){const r=HX.returnTo;HX.returnTo=null;
  if(r!=null){HX.x=portalX(r);HX.y=baseH(HX.x);HX.face=1;HX.pulse[r]=1;spark(HX.x,GYS-HX.y-30,PAL[r%3],24)}
  else if(HX.x==null){HX.x=START;HX.y=0;HX.face=1}
  HX.vx=HX.vy=0;HX.gr=1;HX.tx=null;HX.pend=null;K.l=K.r=K.j=K.jp=K.e=0;HX.cam=Math.max(0,Math.min(LW-VW,HX.x-VW/2+HX.face*14));HX.hintT=0;
  const m=$z('zhm');m.classList.remove('on');HX.near=-1;$z('wel').classList.remove('out');clearTimeout(HX.wt);HX.wt=setTimeout(()=>$z('wel').classList.add('out'),7000)}
 HX.busy=0;bakeEmblems();metrics();bake();buildButtons();hudUpdate();placeButtons(Math.round(HX.cam));ZNAME.maybeAsk()}
function frame(){const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-HX.last)/1000));HX.last=now;tm+=dt;
 if(!HX.init){HX.init=1}
 if(HX.vw!==innerWidth||HX.vh!==innerHeight){metrics();bake();placeButtons(Math.round(HX.cam))}else bake();
 update(dt,!blocked());HX.hintT+=dt;render();overlay();placeButtons(Math.round(HX.cam))}
HUBX={enter,frame,state:HX,cfg:{LW,START,X0,DX,SOONX,portalX,TERR},debug:{teleport:(x,y)=>{HX.x=x;HX.y=y||baseH(x);HX.vx=HX.vy=0;HX.cam=Math.max(0,Math.min(LW-VW,x-VW/2))},ts:()=>({x:HX.x,y:HX.y,gr:HX.gr,near:HX.near,busy:HX.busy,vw:VW,vh:VH,px:PX})}};
if(/[?&]hubdebug=1/.test(location.search))window.__zkHub=HUBX.debug;   // test-only handle (inactive without the query flag)
// remember which portal we left so the player re-appears in front of it
const _st=startWorld;startWorld=function(i){HX.returnTo=i;_st(i)};
});

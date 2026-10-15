/* ZKP: tiny, stateless, render-only helpers used by the visual polish pass.
   Nothing here touches gameplay, input, physics or save data. Every function draws on the 2D context it is given.
   Worlds guard their use with `if(window.ZKP)`, so removing this file simply removes the extra detail. */
window.ZKP=(function(){
 const cache={};
 const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
 const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);return c};
 // soft radial glow sprite, built once per colour (cheap to blit; replaces per-frame gradients and shadowBlur)
 const spr=col=>cache[col]||(cache[col]=(()=>{const k=mk(96,96),c=k.getContext('2d'),g=c.createRadialGradient(48,48,0,48,48,48);g.addColorStop(0,col);g.addColorStop(1,col+'00');c.fillStyle=g;c.fillRect(0,0,96,96);return k})());
 const glow=(c,x,y,rx,ry,col,a)=>{c.globalAlpha=a;c.drawImage(spr(col),x-rx,y-ry,rx*2,ry*2);c.globalAlpha=1};
 // drifting dust: n deterministic specks wrapping inside a box; slow, twinkling, drawn as tiny squares
 function motes(c,x0,y0,w,h,t,n,col,o){o=o||{};const sp=o.speed||7,sz=o.size||2,seed=o.seed||1,al=o.alpha||.35,dir=o.dir||1;c.fillStyle=col;
  for(let i=0;i<n;i++){const a=hash(i*7.31+seed),b=hash(i*3.17+seed*2),k=hash(i*5.91+seed*3);const x=x0+(((a*w+t*sp*dir*(.4+k)+Math.sin(t*.7+i)*8)%w)+w)%w,y=y0+(((b*h-t*sp*.3*(.3+k))%h)+h)%h;
   c.globalAlpha=al*(.35+.65*Math.abs(Math.sin(t*(.7+k)+i)));c.fillRect(x,y,sz,sz)}c.globalAlpha=1}
 // 1.5px light top/left and dark bottom/right edge: gives flat rectangles a chiselled, finished edge
 const edge=(c,x,y,w,h,hi,lo,a,th)=>{th=th||1.5;c.globalAlpha=a;c.fillStyle=hi;c.fillRect(x,y,w,th);c.fillRect(x,y,th,h);c.fillStyle=lo;c.fillRect(x,y+h-th,w,th);c.fillRect(x+w-th,y,th,h);c.globalAlpha=1};
 // stone / brick coursing lines inside a rectangle, one batched stroke (rh = course height, cw = block width)
 function rows(c,x,y,w,h,col,a,rh,cw){if(w<4||h<4)return;c.strokeStyle=col;c.globalAlpha=a;c.lineWidth=1;c.beginPath();let r=0;
  for(let yy=y+rh;yy<y+h-1;yy+=rh,r++){c.moveTo(x,yy);c.lineTo(x+w,yy);for(let xx=x+(r%2?cw/2:0)+cw;xx<x+w-1;xx+=cw){c.moveTo(xx,yy);c.lineTo(xx,Math.min(yy+rh,y+h))}}c.stroke();c.globalAlpha=1}
 // sparse specks (grit, stars on a wall, stones in soil); `step` px grid, hash decides presence
 function grit(c,x0,x1,y0,y1,step,col,a,seed,sz,dens){c.fillStyle=col;c.globalAlpha=a;sz=sz||1.5;dens=dens||.5;
  for(let gx=Math.floor(x0/step);gx*step<x1;gx++)for(let gy=Math.floor(y0/step);gy*step<y1;gy++){const h=hash(gx*13.7+gy*7.1+seed);if(h<dens)c.fillRect(gx*step+hash(h*91)*step,gy*step+hash(h*57)*step,sz,sz)}c.globalAlpha=1}
 return{hash,mk,spr,glow,motes,edge,rows,grit}})();

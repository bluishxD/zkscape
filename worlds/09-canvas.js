/* ZKSCAPE world 09: THE CANVAS - the Snarks Atelier.
   The four canvases are exact 1:1 replicas of real Snarks: #9045 (54 ZEC, highest sale), #9284 (20 ZEC),
   #5235 (16.9 ZEC), all sold 19.09.2026, and the Poopie that belongs to the game's creator, with the story
   behind it. Sprite data is extracted cell-by-cell from the source PNGs (26x26; the Poopie's hat lettering
   is finer than the grid, so it is a high-res overlay).
   Core verb: PAINT. A moonlit studio where someone has been painting cryptographic creatures for a very
   long time. Five pigment wells stand at the entrance. You carry pigment through the room and put it
   on a canvas; the canvas answers by revealing a grail Snark. Four canvases hold four Snarks. When all
   four are awake, the fifth - a frame nobody ever finished - lights up and asks you to PAINT YOUR OWN
   zkSNARK. Using it hands you to the existing wallpaper generator.

   Loop: explore -> collect pigment -> carry it -> paint a canvas -> watch the Snark appear -> repeat
   -> make your own.

   Engine integration is the same as every other adventure world: registration through W.push, then
   wrappers around bg / avatar / startWorld / stopWorld / fore. All state is local to V. No other
   world is touched, and the generator is not modified. The final canvas uses the engine's own
   ZKSCAPE.enter(8) and then presses the "CREATE MY ARTIFACT" button that panel already contains, so the
   hand-off is exactly the one a player would make by clicking it.

   VERTICAL CONVENTION (identical to Keys / Orchard / Ironwood):
     x = world units along the studio.  y = height ABOVE the floor.  Y(v) = GY - (v - V.cy)*U.

   CONTROLS (unchanged):  A / left, D / right = walk.  SPACE = jump.  W / up = jump (or climb).
               S / down = drop through a shelf.  E = use (collect, paint, examine, enter). */
window.ZKW=window.ZKW||[];
ZKW.push(function(){
// World registration. canvas:true routes enter() to the artifact panel instead of the quiz, and the
// generator's download button is what marks the world discovered - both are existing engine
// behaviour and both are kept exactly as they were.
W.push({id:'canvas',n:'CANVAS',title:'THE CANVAS',sub:'Collect colour. Reveal the Snarks. Create your own.',
  q:'Now turn your PFP into something of your own.',canvas:true});
W[8].video='videos/zilkroad.mp4';   // pre-existing: this file is NOT on disk, so the guide button is dead
W[8].sub='Collect colour. Reveal the Snarks. Create your own.';
W[8].deep='A viewing key proves a payment happened without revealing what was paid. ZKSCAPE asks the same of you: make something, and let everyone see that you made it without ever seeing your key. This studio is that idea you can touch. The pigment is yours, the frame is public, and the receipt proves nothing about what is inside it.';
A.canvas='Creator Artifact';
// The shared fore() paints th.fog as three wedges AFTER the world has drawn. With a pale fog that was the
// pale-magenta wash this world used to suffer from. The fog is a dark ink-blue now, AND fore() is
// replaced for Canvas only at the bottom of this file.
TH.canvas={sky:['#070914','#121a33'],moon:[.78,.16,.055,'#d9e7ff'],mt:'#0a0d1c',fog:'#0d1126',amb:'dust'};
DEC.canvas=function(){};
GIANT.canvas=function(){};
LM.canvas=function(x,y,s,c,t,a,B){B();hg.strokeRect(-s,-s*.8,s*2,s*1.6);hg.globalAlpha=a*.3;hg.fillRect(-s*.8,-s*.6,s*1.6,s*1.2);};

// ======================= layout (x = world units, y = height above the floor) =======================
const LW=5300,HW=30,PH=112,SPD=300,JMP=830,GRAV=2500;
const PLAT=[[1800,200,110],[2600,200,110],[3400,200,110]];   // low one-way shelves (apex of a jump is 138)
const LAD=[],LADW=52;                                         // no ladders in the atelier; the code path stays inert
// Five wells: colour index, x. The sixth is the late rose well that rises beside the final canvas.
const WELLS=[[330,0],[520,1],[710,2],[900,3],[1090,4]],LATEW=[4390,4];
// The four canvases, each wants one pigment (p) and holds one Snark (s).
const CAN=[{x:1500,p:1,s:0},{x:2300,p:0,s:1},{x:3100,p:2,s:2},{x:3900,p:3,s:3}],FIN={x:4720,p:4};
const FB=62,CCY=176;                 // frame bottom, and the height of the canvas centre
// Optional things to find. y is the height you must STAND at to use it.
const PROPS=[
 {x:1260,y:0,at:150,h:200,k:'sketch',l:'A SKETCH',
  t:'A charcoal study pinned to the wall: a hooded head whose left side comes apart into pixels. Every Snark in this room has that trail. It is how you know whose work it is.'},
 {x:1900,y:110,at:150,h:240,k:'jars',l:'THE SAMPLE SHELF',
  t:'Jars of every pigment in the room, each with a stripe of colour on the lid. They are labelled with words, not names: mystery, proof, growth, discovery, expression.'},
 {x:2700,y:110,at:150,h:240,k:'blueprint',l:'A BLUEPRINT',
  t:'A drawing of a machine whose parts all work and none of which are connected. Someone ruled it carefully, then wrote: ask what it needs. It is the machine under the ZKSCAPE.'},
 {x:3500,y:110,at:150,h:240,k:'orchard',l:'A PRESSED LEAF',
  t:'A single leaf, pressed flat, with a fruit drawn on it in amber. Under it: kept from the orchard. Nothing that grows there can be unplanted.'}];

// ======================= palette: the room is ink and linen, the colour is yours =======================
const C={void:'#05060e',ink:'#0b0e1f',ink2:'#121731',ink3:'#1b2144',wall:'#0e1228',wall2:'#171c3a',
         wood:'#2a2018',wood2:'#40301f',wood3:'#5a4529',stone:'#232a4a',stone2:'#323b66',stone3:'#46528a',
         linen:'#ecdfc3',linenD:'#cdbd9c',gold:'#ffc94a',goldD:'#b8801c',moon:'#d9e7ff',pc:'#f2ecff',mu:'#8e96c4',ok:'#7cf0b6'};
// Pigments. Name, pure colour, shade, light. Their meaning is theme, not cryptography.
const PIG=[{n:'VIOLET',c:'#9b6bff',d:'#5a2fc2',l:'#d9c4ff'},{n:'CYAN',c:'#3fe0ff',d:'#0f8fb5',l:'#c9f8ff'},
 {n:'JADE',c:'#3fe39a',d:'#0f7a52',l:'#c9ffe6'},{n:'GOLD',c:'#ffc94a',d:'#b8801c',l:'#fff0b8'},{n:'ROSE',c:'#ff6fa8',d:'#b5306a',l:'#ffd0e3'}];

let V=null,U=1,W_=0,H_=0,GY=0;const K={l:0,r:0,j:0,jp:0,jb:0,u:0,d:0,e:0,eh:0};
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<800;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const X=x=>(x-V.cx)*U,Y=y=>GY-(y-V.cy)*U,isC=()=>run&&cur&&cur.id==='canvas'&&V&&V.on;
const L=(x,f)=>(x-V.cx*f)*U;                      // a parallax layer: it follows the camera by the fraction f
const CS=()=>Math.max(3,Math.round(U*7));          // one pixel of canvas art, in screen pixels (an integer, so it stays crisp)
const rr=(x,y,w,h,c)=>rc(Math.round(X(x)),Math.round(Y(y)),Math.round(w*U),Math.round(h*U),c);
const cc=(x,y,r,c,a)=>{g2.globalAlpha=a==null?1:a;g2.fillStyle=c;g2.beginPath();g2.arc(X(x),Y(y),r*U,0,7);g2.fill();g2.globalAlpha=1};
const onS=(x,pad)=>{const s=X(x);return s>-(pad||300)*U&&s<W_+(pad||300)*U};
const MONO=n=>'600 '+Math.round(Math.max(11,n*U))+'px ui-monospace,Menlo,Consolas,monospace';
const SERIF=n=>'400 '+Math.round(Math.max(15,n*U))+"px 'Abril Fatface',Georgia,serif";
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mxc=(a,b,t)=>{t=clamp(t,0,1);const A_=hx(a),B2=hx(b);
 return '#'+A_.map((v,i)=>Math.round(v+(B2[i]-v)*t).toString(16).padStart(2,'0')).join('')};
// A filled rectangle in raw SCREEN pixels, always snapped: every pixel-art piece goes through this.
const P=(x,y,w,h,c,a)=>{if(a!=null)g2.globalAlpha=a;g2.fillStyle=c;g2.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));if(a!=null)g2.globalAlpha=1};
const TS=(s,x,y,c,n,font)=>{g2.save();g2.textAlign='center';g2.font=font||MONO(n);g2.lineWidth=4;g2.strokeStyle='#05060ecc';g2.lineJoin='round';
 g2.strokeText(s,x,y);g2.fillStyle=c;g2.fillText(s,x,y);g2.restore()};

// ======================= the grail Snarks =======================
// Four original pixel-art creatures and the unfinished fifth frame, drawn on the same 26x26 grid as the
// gallery Snarks (hooded head, dissolving left side, shoulders). Authored as character grids so they
// are real art, not noise: each one has its own silhouette, palette and reveal.
const SPRD={"rows":[["..........................","..........................","..........................","..........................","..........................","..........................",".....ab..cabddddddd.......",".......abbbdddeeeedd......","...ab.aaabbddfgeehhe......",".....abbbbddgehehhhhd.....","........acddeefeeehed.....","...a.cbbbbddeehefghhg.....","......abbbddhehhhhheh.....","........aaddegiiehiih.....","....b..aabddegiiefiie.....",".....abbjbddehehhhheh.....","..ab....acddhgegefhee.....",".........adddeehefeed.....","......aabbbddfehehee......",".........ckbdddfhhdd......","....ab..akkkkkddddd.......","......aabbkkkkkkkkkb......",".......bbbblmnnnnmlbb.....","...abbbbbbbbbboobbbbb.....",".....abbbllpoqoqooolbb....","....cbbbbbbbbblmbbbbbb...."],["..........................","..........................","..........................","..........................","...........abcccccc.......",".........baacccccddc......",".....ef.aaacccccccdd......",".......ghbacccccccccc.....","...gf.eebbacccccccccc.....",".....ehhijklklmmlmlmln....",".......jjolnklmlkmnnml....","...g.phhiiqqrrrrrsstu.....","......ghhhvwxyzAzByzAy....","........egCDwyEEFAEEFz....","....f..eghCDwzEEFyEEFw....",".....ghhiGiDwxzyAzyBzx....","..gf....egffHCCHHHHHf.....",".........ghIICIHHIHCi.....","......gghiihhfvHHCHJ......",".........gfhhfhIIJIf......","....gf..gfffffhJJJJ.......","......gghhfffffffffh......",".......ffhfJfhJJhhvCh.....","...ghhhfhhiCIIJCJiiIh.....",".....gfffhJiiiiICCIihh....","....ghhffhCIICJIJiiJhh...."],["..........................","..........................","..........................","..........................","..........................","..........................",".....ab..cabddddddd.......",".......abbbdddeeeedd......","...ab.aaabbddfgeehhe......",".....abbbbddgehehhhhd.....","........acddeefeeehed.....","...a.cbbbbddeehefghhg.....","......abbbddhehhhhheh.....","........aaddegiiehiih.....","....b..aabddegjiefjie.....",".....abbkbddehehhhheh.....","..ab....acddhgegefhee.....",".........adddeehefeed.....","......aabbbddfehehee......",".........clbdddfhhdd......","....ab..alllllddddd.......","......aabblllllllllb......",".......bbbbmnoooonmbb.....","...abbbbbbbbbbppbbbbb.....",".....abbbmmqprprpppmbb....","....cbbbbbbbbbmnbbbbbb...."],["..........................","..........................","..........................","..........................","...........aabbbbbb.......",".........aaabbbbbccb......",".....de.aaabbbbbbbcc......",".......dfaabbbbbbbbbb.....","...de.ddaaabbbbbbbbbb.....",".....dfff.abbbbbbbbbbk....","..........aakkkkkakkkk....","...d.dffffeefffffffff.....","......dfffllmddddmddd.....","........ddllmmakmmkad.....","....e..ddfllmmgkmmgkd.....",".....dfffnllmmmmmmmmd.....","..de....ddllmmmmmmmmd.....",".........dlllmdmmmmml.....","......ddfffllmmmmmmd......",".........deflllmmdff......","....de..deeeeffllff.......","......ddffeeeeeeeeef......",".......ddffffeeeeffff.....","...dffffddddddddddddd.....",".....dddfffddddddddfff....","....medddddfffffffffff...."],["..........................",".y..........VV..........y.","..yyyyyyyyyyyyyyyyyyyyyy..","..yYYYYYYYYYYYYYYYYYYYYy..","..yYYYYYYYYYYYYYYYYYYYYy..","..yYYkkkkkkkkkkkkkkkkYYy..","..yYYkwwwwwwwwwwwwwwkYYy..","..yYYkwwwwWWRRWWwwwwkYYy..","..yYYkwwwWRRRRRRWwwwkYYy..","..yYYkwwWRRPPPPRRWwwkYYy..","..yYYkwWRRPppppPRRWwkYYy..","..yYYkwWRPppypppPRWwkYYy..",".VyYYkwRRPppyyppPRRwkYYyV.",".VyYYkwRRPppyyppPRRwkYYyV.","..yYYkwWRPpppyppPRWwkYYy..","..yYYkwWRRPppppPRRWwkYYy..","..yYYkwwWRRPPPPRRWwwkYYy..","..yYYkwwwWRRRRRRWwwwkYYy..","..yYYkwwwwWWRRWWwwwwkYYy..","..yYYkwwwwwwwwwwwwwwkYYy..","..yYYkkkkkkkkkkkkkkkkYYy..","..yYYYYYYYYYYYYYYYYYYYYy..","..yYYYYYYYYYYYYYYYYYYYYy..","..yyyyyyyyyyyyyyyyyyyyyy..",".y..........VV..........y.",".........................."]],"pal":{"1":{"a":"#74ffff","b":"#a1ffff","c":"#75ffff","d":"#00d4e7","e":"#52e9f2","f":"#51e9f2","g":"#51e9f3","h":"#52e9f3","i":"#ffeb57","j":"#a0ffff","k":"#a9ffff","l":"#00a6bb","m":"#00a6ba","n":"#008ca2","o":"#00bfd5","p":"#00bfd4","q":"#00c0d5"},"2":{"a":"#5e2d83","b":"#5e2c83","c":"#733394","d":"#8f4fac","e":"#675a4c","f":"#1f1f1f","g":"#635447","h":"#272727","i":"#323232","j":"#452e69","k":"#523277","l":"#523276","m":"#513277","n":"#513276","o":"#452d69","p":"#625447","q":"#303030","r":"#aa9e88","s":"#9b8b7a","t":"#656159","u":"#252525","v":"#6a665d","w":"#7e5110","x":"#996818","y":"#d2a63b","z":"#bc8b25","A":"#e5c76c","B":"#f4e8c0","C":"#8b7c6d","D":"#5c370b","E":"#f2f2ee","F":"#0a0a0c","G":"#5bf4ff","H":"#b2a68f","I":"#a39280","J":"#6a655d"},"3":{"a":"#74ffff","b":"#a1ffff","c":"#75ffff","d":"#00d4e7","e":"#52e9f2","f":"#51e9f2","g":"#51e9f3","h":"#52e9f3","i":"#16181d","j":"#eef0e7","k":"#a0ffff","l":"#a9ffff","m":"#00a6bb","n":"#00a6ba","o":"#008ca2","p":"#00bfd5","q":"#00bfd4","r":"#00c0d5"},"4":{"a":"#0c0c0e","b":"#1d1d1f","c":"#37353a","d":"#835232","e":"#4a2f1e","f":"#6c4229","g":"#ebebeb","h":"#666666","i":"#2d2d2f","j":"#9a9a9a","k":"#141416","l":"#5e3820","m":"#7b4a2b","n":"#fdaf01"},"5":{".":null,"y":"#ffc94a","Y":"#a2661a","k":"#17101f","w":"#fff6e4","W":"#ffe6f0","P":"#ffc2dc","p":"#ff8fbf","R":"#ff5f9e","V":"#c9a4ff"}},"meta":[{"late":[[14,13],[15,13],[18,13],[19,13],[14,14],[15,14],[18,14],[19,14]],"gl":[[14,13],[15,13],[18,13],[19,13],[14,14],[15,14],[18,14],[19,14]]},{"late":[[14,13],[15,13],[16,13],[18,13],[19,13],[20,13],[14,14],[15,14],[16,14],[18,14],[19,14],[20,14]],"gl":[[15,12],[17,12],[20,12],[17,13],[9,15],[16,15],[19,15]]},{"late":[[14,13],[15,13],[18,13],[19,13],[14,14],[15,14],[18,14],[19,14]],"gl":[[14,14],[18,14]]},{"fr":[[11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4],[18,4],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[15,7],[16,7],[17,7],[18,7],[19,7],[20,7],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8],[20,8],[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[10,10],[11,10],[12,10],[13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],[21,10]],"gl":[[9,15]]}],"txt":{"runs":[[94,53,2,"#79797b"],[96,53,8,"#6f6f71"],[94,54,1,"#ffffff"],[95,54,1,"#f1f1ef"],[96,54,8,"#f1f1f1"],[144,54,3,"#f1f1ef"],[94,55,1,"#ffffff"],[95,55,1,"#f1f1ef"],[96,55,8,"#f0f0ee"],[104,55,1,"#dddddd"],[105,55,1,"#eeeeee"],[144,55,3,"#eeeeec"],[94,56,1,"#ffffff"],[95,56,1,"#f0f0ee"],[96,56,8,"#f1f1ef"],[104,56,2,"#eeeeec"],[144,56,3,"#f3f3f1"],[94,57,1,"#ffffff"],[95,57,1,"#f0f0ee"],[96,57,2,"#efefed"],[102,57,1,"#fefefe"],[103,57,1,"#eeeeec"],[104,57,2,"#efefed"],[94,58,1,"#fffeff"],[95,58,1,"#f0efed"],[96,58,2,"#efefed"],[102,58,1,"#fcfcfc"],[103,58,1,"#ededeb"],[104,58,2,"#efefed"],[109,58,1,"#454547"],[110,58,2,"#68686a"],[112,58,4,"#676767"],[121,58,1,"#414141"],[122,58,1,"#575757"],[123,58,5,"#666465"],[132,58,4,"#646464"],[136,58,4,"#626262"],[151,58,1,"#636363"],[152,58,6,"#626262"],[94,59,1,"#fefefe"],[95,59,1,"#f1f0ee"],[96,59,2,"#efefed"],[102,59,1,"#fdfdfd"],[103,59,1,"#eeeeec"],[104,59,2,"#f0f0f0"],[109,59,1,"#828282"],[110,59,2,"#ededeb"],[112,59,4,"#f0f0ee"],[121,59,1,"#878789"],[122,59,6,"#f0eeef"],[132,59,4,"#f0f0f0"],[136,59,4,"#f0f0ee"],[144,59,3,"#ececec"],[151,59,1,"#ececec"],[152,59,5,"#efefef"],[157,59,1,"#d6d6d6"],[94,60,1,"#ffffff"],[95,60,1,"#f0efed"],[96,60,2,"#eeeeec"],[102,60,2,"#fbfbfb"],[104,60,2,"#efefef"],[108,60,1,"#b6b6b8"],[109,60,1,"#d5d5d5"],[110,60,2,"#eeeeec"],[112,60,4,"#f1f1ef"],[116,60,2,"#bebebe"],[120,60,1,"#b0b0b0"],[121,60,1,"#d1d1d1"],[122,60,6,"#f0efed"],[128,60,2,"#c1c1c3"],[132,60,4,"#eeedeb"],[136,60,4,"#f1f1ef"],[140,60,2,"#b9b9b9"],[144,60,3,"#f1f1ef"],[149,60,2,"#bbbbbb"],[151,60,1,"#f5f3f4"],[152,60,6,"#f1eff0"],[158,60,1,"#c7c7c7"],[94,61,1,"#fefeff"],[95,61,1,"#f1f0ee"],[96,61,2,"#efefed"],[98,61,4,"#000000"],[102,61,2,"#f9f9f9"],[104,61,2,"#eeeeee"],[108,61,3,"#efefef"],[111,61,1,"#ffffff"],[112,61,3,"#ffffff"],[115,61,3,"#ededed"],[120,61,3,"#eeeeec"],[123,61,4,"#ffffff"],[127,61,1,"#ebebe9"],[128,61,2,"#efefed"],[132,61,3,"#f0efed"],[135,61,1,"#fdfdfd"],[136,61,3,"#ffffff"],[139,61,3,"#efefef"],[144,61,3,"#f0f0ee"],[149,61,3,"#f5f5f3"],[152,61,7,"#f4f4f4"],[94,62,1,"#ffffff"],[95,62,1,"#f0f0ee"],[96,62,8,"#efefed"],[104,62,2,"#ededed"],[108,62,3,"#f0f0f0"],[114,62,1,"#808082"],[115,62,3,"#efefed"],[120,62,3,"#eeeced"],[126,62,1,"#444444"],[127,62,1,"#ededeb"],[128,62,2,"#eeeeec"],[132,62,3,"#f2f1ef"],[138,62,1,"#000000"],[139,62,3,"#eeeeee"],[144,62,3,"#eeeeee"],[149,62,3,"#f6f6f4"],[152,62,1,"#ffffff"],[156,62,3,"#f0f0f0"],[159,62,1,"#000000"],[94,63,1,"#ffffff"],[95,63,1,"#efefed"],[96,63,8,"#efefed"],[108,63,3,"#efefef"],[114,63,1,"#7f7f81"],[115,63,3,"#f1f1f1"],[120,63,3,"#ededeb"],[126,63,1,"#424242"],[127,63,1,"#eeeeec"],[128,63,2,"#efefed"],[132,63,3,"#f0efed"],[138,63,1,"#000000"],[139,63,3,"#efeff1"],[144,63,3,"#f0f0f0"],[149,63,3,"#f6f6f4"],[152,63,1,"#f9f9f9"],[153,63,3,"#757577"],[156,63,3,"#f4f4f4"],[159,63,1,"#000000"],[94,64,1,"#ffffff"],[95,64,1,"#efefed"],[96,64,8,"#efefed"],[108,64,3,"#f1f1f1"],[114,64,1,"#848484"],[115,64,3,"#f1f1f1"],[120,64,3,"#eeeeec"],[126,64,1,"#414143"],[127,64,1,"#f0f0f0"],[128,64,2,"#f2f2f0"],[132,64,3,"#efefed"],[138,64,1,"#000000"],[139,64,3,"#efefed"],[144,64,3,"#f0f0f0"],[149,64,3,"#f8f8f8"],[152,64,7,"#efefed"],[94,65,1,"#ffffff"],[95,65,1,"#efefed"],[96,65,2,"#efefed"],[108,65,3,"#f1f1f1"],[114,65,1,"#868686"],[115,65,3,"#f0f0f0"],[120,65,3,"#efefed"],[126,65,1,"#464648"],[127,65,1,"#f1f1ef"],[128,65,2,"#f1f1ef"],[132,65,3,"#f1f0ee"],[138,65,1,"#000000"],[139,65,3,"#efefed"],[144,65,3,"#f0f0f0"],[149,65,3,"#f8f8f8"],[152,65,7,"#f2f2f2"],[159,65,1,"#000000"],[94,66,1,"#ffffff"],[95,66,1,"#f0f0ee"],[96,66,2,"#f0f0ee"],[108,66,3,"#efefef"],[114,66,1,"#808080"],[115,66,3,"#f1f1ef"],[120,66,3,"#f0f0ee"],[126,66,1,"#434345"],[127,66,1,"#f0f0ee"],[128,66,2,"#efefed"],[132,66,3,"#f1f1ef"],[138,66,1,"#000000"],[139,66,3,"#eeeeec"],[144,66,3,"#efefed"],[149,66,3,"#f6f6f4"],[152,66,1,"#ffffff"],[94,67,1,"#fefefe"],[95,67,1,"#eeeeec"],[96,67,2,"#efefed"],[108,67,3,"#f0f0ee"],[114,67,1,"#808080"],[115,67,3,"#f1f1ef"],[120,67,3,"#f0f0f0"],[126,67,1,"#424242"],[127,67,1,"#f0efed"],[128,67,2,"#f0efed"],[132,67,4,"#efefed"],[136,67,6,"#ededeb"],[144,67,3,"#f1f0ee"],[149,67,3,"#f8f8f8"],[152,67,1,"#ffffff"],[94,68,1,"#ffffff"],[95,68,1,"#f0efed"],[96,68,2,"#f0efed"],[108,68,4,"#eeeef0"],[112,68,6,"#eeeeee"],[120,68,8,"#f4f2f3"],[128,68,2,"#efefef"],[132,68,4,"#efefed"],[136,68,4,"#ededed"],[144,68,3,"#efefef"],[149,68,3,"#f9f9f9"],[152,68,6,"#ededed"],[158,68,1,"#ffffff"],[94,69,1,"#fffeff"],[95,69,1,"#f0efed"],[96,69,2,"#f0efed"],[109,69,1,"#959595"],[110,69,2,"#ededeb"],[112,69,4,"#efefef"],[121,69,1,"#959595"],[122,69,6,"#f1f1f1"],[132,69,4,"#f0f0f0"],[136,69,4,"#f3f3f3"],[144,69,3,"#f1f1f1"],[151,69,1,"#f1f1f1"],[152,69,6,"#efefef"],[158,69,1,"#ffffff"],[94,70,1,"#ffffff"],[95,70,1,"#f0efed"],[96,70,2,"#f1f0ee"],[109,70,1,"#8b8b8b"],[110,70,2,"#eeeeec"],[112,70,4,"#f2f2f2"],[121,70,1,"#919191"],[122,70,6,"#f0f0f0"],[132,70,3,"#f0f0f0"],[144,70,3,"#f2f2f2"],[151,70,1,"#f1f1f1"],[152,70,7,"#f1f1f1"],[132,71,3,"#efefed"],[132,72,3,"#efefed"],[132,73,3,"#f0f0ee"],[132,74,3,"#eeeeee"],[85,88,3,"#121116"],[88,88,8,"#121214"],[96,88,8,"#121214"],[104,88,8,"#121214"],[112,88,8,"#111113"],[120,88,8,"#131315"],[128,88,8,"#131315"],[136,88,8,"#131315"],[144,88,8,"#131315"],[152,88,8,"#131315"],[160,88,8,"#121214"],[85,89,3,"#121015"],[88,89,8,"#131315"],[96,89,8,"#111113"],[104,89,8,"#121214"],[112,89,8,"#111214"],[120,89,8,"#121214"],[128,89,8,"#121214"],[136,89,8,"#131315"],[144,89,8,"#121214"],[152,89,8,"#121315"],[160,89,8,"#131315"],[85,90,3,"#151112"],[88,90,8,"#131112"],[96,90,8,"#161213"],[104,90,8,"#131112"],[112,90,8,"#141213"],[120,90,8,"#131112"],[128,90,8,"#131112"],[136,90,8,"#131112"],[144,90,8,"#161213"],[152,90,8,"#161213"],[160,90,8,"#141213"],[72,120,2,"#f0b01a"],[77,120,1,"#f3b21a"],[79,120,1,"#edb11f"],[72,128,8,"#7c4912"],[48,152,8,"#1b0a00"],[56,152,8,"#1e0a01"],[64,152,3,"#1c0902"],[70,152,1,"#1b0a03"],[32,160,8,"#53372b"],[40,160,4,"#2e1d16"],[45,160,3,"#2d1f16"],[64,160,8,"#503929"],[48,168,8,"#563a2c"],[56,168,8,"#52382b"],[152,168,8,"#473124"],[48,176,8,"#6d5344"],[64,176,8,"#623a20"],[80,176,8,"#492914"],[88,176,8,"#4a2713"],[96,176,8,"#4c2915"],[136,176,8,"#4d2a14"],[144,176,8,"#4c2915"],[160,176,8,"#0f0100"],[24,184,8,"#000000"],[32,184,8,"#000000"],[40,184,8,"#000000"],[48,184,8,"#000000"],[56,184,1,"#865535"],[72,184,8,"#653b22"],[80,184,8,"#673d24"],[88,184,8,"#663a21"],[96,184,3,"#683c21"],[101,184,3,"#6a3e21"],[104,184,8,"#462512"],[112,184,8,"#472710"],[120,184,8,"#452612"],[128,184,8,"#492912"],[137,184,7,"#673d24"],[144,184,8,"#694024"],[152,184,8,"#663c23"],[160,184,8,"#663d21"],[24,192,8,"#876450"],[32,192,8,"#694c3c"],[40,192,8,"#683c1f"],[48,192,8,"#683f23"],[56,192,2,"#6a3e25"],[59,192,5,"#693d24"],[64,192,8,"#8a593b"],[72,192,5,"#87583a"],[78,192,2,"#87583a"],[80,192,5,"#865739"],[153,192,1,"#85563a"],[156,192,2,"#855338"],[159,192,1,"#865537"],[160,192,3,"#875638"],[168,192,8,"#0a0000"],[32,200,8,"#000000"],[40,200,8,"#7f5032"],[64,200,7,"#663e25"],[72,200,3,"#6a4125"],[76,200,4,"#6a4125"],[80,200,8,"#693f26"],[88,200,1,"#865535"],[90,200,1,"#85563a"],[104,200,2,"#855638"],[112,200,8,"#855736"],[121,200,1,"#855638"],[123,200,1,"#855736"],[136,200,4,"#855638"],[141,200,1,"#855638"],[144,200,1,"#865537"],[191,201,1,"#71716f"],[190,203,1,"#383637"],[190,205,1,"#535353"]],"K":8}};
const SPR=[
 // The four canvases are 1:1 replicas of four real Snarks, in order of what they sold for.
 // tag = the short plaque line, pages = what the player learns when they inspect it.
 {n:'zkSNARK #9045',tag:'#9045 · 54 ZEC',pig:1,sty:0,dur:3.0,
  pages:['zkSNARK #9045. The highest sale so far: 54 ZEC, on 19.09.2026.',
         'A pale-blue shell with two yellow eyes. Nothing else on it. Nobody has paid more for a Snark.'],
  ground:['#000000','#000000'],frame:['#14323d','#3f8ea4','#a1ffff']},
 {n:'zkSNARK #9284',tag:'#9284 · 20 ZEC',pig:0,sty:1,dur:2.6,
  pages:['zkSNARK #9284. The second highest sale: 20 ZEC, also on 19.09.2026.',
         'A purple hat and a pair of gold goggles over a dark, ragged body. A long way from the blue ones, and the second most expensive.'],
  ground:['#000000','#000000'],frame:['#2a1442','#5e2d83','#c79ae6']},
 {n:'zkSNARK #5235',tag:'#5235 · 16.9 ZEC',pig:2,sty:2,dur:3.2,
  pages:['zkSNARK #5235. The third highest sale: 16.9 ZEC, also on 19.09.2026.',
         'Pale blue, dark eyes with a white glint, looking off to the side. No hat, no goggles. Still the third most expensive Snark sold.'],
  ground:['#000000','#000000'],frame:['#143036','#2f8798','#a9ffff']},
 {n:'THE POOPIE',tag:'THE POOPIE',pig:3,sty:3,dur:3.4,
  pages:['The Poopie. This one is not here for its price. It is the lore thats behind it',
         'People listed poopies and called them ugly, and the floor fell from 0.7 to 0.3 with about 30 listed.',
         'When someone said the project would die because of poopies, NFTPurp made one his PFP and kept winding them up.'],
  ground:['#000000','#000000'],frame:['#2b1a0e','#6b4423','#c28a52']},
 {n:'PAINT YOUR OWN zkSNARK',pig:4,sty:4,dur:1,ground:['#17101f','#17101f'],frame:['#a2661a','#ffc94a','#fff0b8']}];
(function build(){
 const rnd=(s=>()=>(s=(s*1664525+1013904223)>>>0)/4294967296),K8=SPRD.txt.K;
 SPR.forEach((SP,i)=>{
  const rows=SPRD.rows[i],pal=SPRD.pal[String(i+1)],r=rnd(7+i*131),mt=SPRD.meta[i]||{};
  const inl=(a,x,y)=>a&&a.some(q=>q[0]===x&&q[1]===y);
  SP.cells=[];SP.grid=rows;
  for(let y=0;y<26;y++)for(let x=0;x<26;x++){const ch=rows[y][x],col=pal[ch];if(!col||ch==='.')continue;
   // late = the cells that light last (the eyes); fr = the cells that arrive first (the Poopie's hat); gl = cells that glint when idle
   SP.cells.push({x,y,ch,col,r:r(),sx:(r()-.5)*26,sy:(r()-.5)*26,fr:inl(mt.fr,x,y)?1:0,late:inl(mt.late,x,y)?1:0,gl:inl(mt.gl,x,y)?1:0,tx:null})}
  // The Poopie's hat lettering is finer than the 26x26 grid, so it is kept as a high-resolution overlay, split per cell
  if(i===3){const at={};SP.cells.forEach(c2=>at[c2.x+','+c2.y]=c2);
   SPRD.txt.runs.forEach(([X,Y,len,col])=>{for(let u=X;u<X+len;){const cx=Math.floor(u/K8),end=Math.min(X+len,(cx+1)*K8),c2=at[cx+','+Math.floor(Y/K8)];
    let c3=c2;if(!c3){c3={x:cx,y:Math.floor(Y/K8),ch:'.',col:null,r:r(),sx:(r()-.5)*26,sy:(r()-.5)*26,fr:0,late:0,gl:0,tx:null};at[cx+','+Math.floor(Y/K8)]=c3;SP.cells.push(c3)}
    (c3.tx=c3.tx||[]).push([u,Y,end-u,col]);u=end}})}
  SP.ln=[];
  for(let y=0;y<26;y++){SP.ln.push([]);for(let x=0;x<26;x++){const d=Math.hypot(x-12.5,y-13)/17;
   SP.ln[y].push(mxc(C.linen,C.linenD,((y&1)?.22:0)+((x*7+y*3)%11===0?.18:0)+clamp(d*.12,0,.2)))}}
  SP.gr=[];for(let y=0;y<26;y++){SP.gr.push([]);for(let x=0;x<26;x++)SP.gr[y].push(SP.ground[0])}
  // pencil sketch: only the outline of the future creature, so the canvas hints at what it holds
  SP.sk=[];const occ=(x,y)=>x>=0&&y>=0&&x<26&&y<26&&rows[y][x]!=='.';
  if(i<4)for(let y=0;y<26;y++)for(let x=8;x<26;x++)if(occ(x,y)&&!(occ(x-1,y)&&occ(x+1,y)&&occ(x,y-1)&&occ(x,y+1)))SP.sk.push([x,y]);
  // the finished canvas, drawn once at 8 pixels per cell so the lettering keeps its detail
  const cv=document.createElement('canvas');cv.width=cv.height=26*K8;const q=cv.getContext('2d');
  if(i<4){q.fillStyle=SP.ground[0];q.fillRect(0,0,26*K8,26*K8)}
  SP.cells.forEach(cl=>{if(cl.col){q.fillStyle=cl.col;q.fillRect(cl.x*K8,cl.y*K8,K8,K8)}
   if(cl.tx)cl.tx.forEach(a=>{q.fillStyle=a[3];q.fillRect(a[0],a[1],a[2],1)})});
  SP.done=cv;SP.glints=SP.cells.filter(c2=>c2.gl)});
})();

// ======================= input: A/D walk, W/S climb or drop, Space jump, E interact =======================
if(!window.__zkCV){window.__zkCV=1;
 const km=c=>({ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'j',KeyW:'u',ArrowUp:'u',KeyS:'d',ArrowDown:'d',
   KeyE:'e',Enter:'e',KeyF:'e'})[c];
 addEventListener('keydown',e=>{const k=km(e.code);if(!k||!isC())return;e.preventDefault();
  if(k==='e'){K.eh=1;if(!e.repeat)K.e=1;return}
  // W is a climb on a ladder and a jump everywhere else, so it arms the same jump buffer Space does
  if(k==='j'&&!K.j)K.jp=1;
  if(k==='u'&&!K.u)K.jb=1;
  K[k]=1});
 addEventListener('keyup',e=>{const k=km(e.code);if(!k)return;if(k==='e'){K.eh=0;return}K[k]=0});
 addEventListener('blur',()=>{K.l=K.r=K.j=K.u=K.d=0;K.eh=0;K.jp=0;K.jb=0});
 addEventListener('pointerup',()=>{K.eh=0});
 // Space and the arrows must not scroll the page while this world is live
 addEventListener('keydown',e=>{if(isC()&&(e.code==='Space'||e.code.indexOf('Arrow')===0))e.preventDefault()},true);}
addEventListener('pointerdown',e=>{if(isC()&&e.target===g2.canvas)K.e=1});

function ctl(on){let c=$z('cctl');if(!c){c=document.createElement('div');c.id='cctl';c.style.cssText='position:absolute;left:0;right:0;bottom:3vh;display:none;justify-content:space-between;padding:0 4vw;z-index:7;pointer-events:none';
 const mb=(t,k,l)=>{const b=document.createElement('button');b.textContent=t;b.setAttribute('aria-label',l);b.style.cssText='pointer-events:auto;touch-action:none;width:64px;height:64px;border-radius:50%;margin:0 5px;font-size:24px;background:#0b0e1fcc;color:#d9e7ff;border:2px solid #46528a';
  const set=v=>e=>{e.preventDefault();if(k==='j'&&v&&!K.j)K.jp=1;if(k==='u'&&v&&!K.u)K.jb=1;
   if(k==='e'){K.eh=v;if(v)K.e=1;return}K[k]=v};
  b.onpointerdown=set(1);b.onpointerup=b.onpointerleave=b.onpointercancel=set(0);return b};
 const L2=document.createElement('div'),R2=document.createElement('div');
 L2.append(mb('◀','l','left'),mb('▶','r','right'));
 R2.append(mb('✋','e','use'),mb('⤴','j','jump'));
 c.append(L2,R2);$z('s-world').appendChild(c)}
 c.style.display=on&&coarse?'flex':'none'}

// ======================= state =======================
// Progress is written to S.canv (v:2) after every painting, so a painted canvas never resets.
function persist(){const st=ZKSCAPE.state();
 st.canv={v:2,painted:V.cv.map(c=>c.st===2?1:0),awake:V.awake?1:0,rune:V.rune?1:0};
 try{localStorage.setItem('zkscape.v1',JSON.stringify(st))}catch(e){}}
function cInit(){const sv=ZKSCAPE.state().canv,ok=sv&&sv.v===2;
 V={on:1,px:150,py:0,vx:0,vy:0,gr:1,face:1,cx:0,cy:0,stt:'play',t:0,msg:'',mt:0,bad:0,vp:[],ft:[],last:performance.now(),near:null,
    buf:0,coy:0,lad:-1,carry:-1,carT:0,
    cv:CAN.map((c,i)=>({st:ok&&sv.painted&&sv.painted[i]?2:0,t:0,shake:0,insp:0,f:{}})),
    awake:0,awT:0,lateT:0,rune:ok&&sv.rune?1:0,still:0,pt:0,gone:0,orb:{x:150,y:70},trl:[],trT:0,seen:{},finI:0};
 if(V.cv.every(c=>c.st===2)){V.awake=1;V.awT=9;V.lateT=1}
 K.l=K.r=K.j=K.u=K.d=K.jp=K.jb=K.e=K.eh=0;ctl(1);
 note(done()===0?'A studio nobody finished. The wells ahead hold colour. The canvases further on are waiting.':V.awake?'The four Snarks are awake. The last canvas is waiting for you.':'Welcome back. What you painted is still here.');
 window.__cv=()=>V;}                                 // test hook: the state object, nothing else
const done=()=>V.cv.filter(c=>c.st===2).length;
const spark=(x,y,c,n=10,sp=1)=>{if(reduce)n=Math.min(n,4);for(let i=0;i<n&&V.vp.length<260;i++){const a=Math.random()*6.28,s=(50+Math.random()*170)*sp;
 V.vp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s+30,l:.7+Math.random()*.6,c:Array.isArray(c)?c[i%c.length]:c,s:4+((Math.random()*3)|0)*2,g:160})}};
const say=(x,s,y)=>V.ft.push({x,y:y==null?CCY+190:y,s,l:2.8});
const note=s=>{V.msg=s;V.mt=Math.max(5.5,s.length/15)};
const bad=(x,s)=>{V.bad=.35;AM.sfx('incorrect');say(x,s||'NO')};
const later=(ms,f)=>setTimeout(()=>{if(V&&V.on&&isC())f()},ms);

// ======================= the mechanic: carry pigment to a canvas =======================
function wellList(){const a=WELLS.map((w,i)=>({x:w[0],p:w[1],i}));if(V.awake)a.push({x:LATEW[0],p:LATEW[1],i:9,late:1});return a}
function wellAt(){const a=wellList();for(let k=0;k<a.length;k++)if(Math.abs(V.px-a[k].x)<90&&Math.abs(V.py)<60)return a[k];return null}
function canAt(){for(let i=0;i<CAN.length;i++)if(Math.abs(V.px-CAN[i].x)<135&&V.py<90)return i;return -1}
function finAt(){return Math.abs(V.px-FIN.x)<165&&V.py<90}
function propAt(){for(let i=0;i<PROPS.length;i++){const p=PROPS[i];if(Math.abs(V.px-p.x)<p.at&&Math.abs(V.py-p.y)<34)return i}return -1}
function ladderAt(){return -1}
function act(){
 const w2=wellAt();if(w2){wellAct(w2);return}
 const c2=canAt();if(c2>=0){canAct(c2);return}
 if(finAt()){finAct();return}
 const p2=propAt();if(p2>=0){propAct(p2);return}
 AM.sfx('click');}
function wellAct(w){const pg=PIG[w.p];
 if(V.carry<0){V.carry=w.p;V.carT=0;V.orb.x=w.x;V.orb.y=84;AM.sfx('collectible');
  spark(w.x,84,[pg.c,pg.l],16);
  note('You gather '+pg.n+' into your hand. It follows you. Find the canvas that is waiting for it.');return}
 if(V.carry===w.p){V.carry=-1;AM.sfx('interaction');spark(w.x,84,pg.c,8);note('You let the '+pg.n+' settle back into the well.');return}
 const old=PIG[V.carry];V.carry=w.p;V.carT=0;V.orb.x=w.x;V.orb.y=84;AM.sfx('collectible');spark(w.x,84,[pg.c,pg.l],14);
 note('You pour the '+old.n+' back and take '+pg.n+' instead. Nothing is wasted in here.')}
function canAct(i){const c=V.cv[i],cn=CAN[i],SP=SPR[cn.s],pg=PIG[cn.p];
 if(c.st===1){return}
 if(c.st===2&&V.carry>=0){AM.sfx('click');say(cn.x,'ALREADY REVEALED');
  note(SP.n+' is already revealed. Your '+PIG[V.carry].n+' is safe; take it to a canvas that is still bare.');return}
 if(c.st===2){                               // inspect a finished painting
  // a rune that has lit up speaks first, and does not use up a story page
  if(cn.s===3&&V.rune&&!V.seen.rune){V.seen.rune=1;AM.sfx('card-reveal');
   note('A warm gold mark glows in the frame, the colour of the earring. The floor said ugly. He said earthtones, and meant it.');spark(cn.x,CCY,[pg.c,pg.l],8);return}
  const pgs=SP.pages,k=c.insp%pgs.length;c.insp++;AM.sfx('card-reveal');
  note(pgs[k]+(pgs.length>1?'   ['+(k+1)+'/'+pgs.length+' · E for more]':''));
  spark(cn.x,CCY,[pg.c,pg.l],8);return}
 if(V.carry<0){AM.sfx('interaction');say(cn.x,'WAITING FOR '+pg.n);
  note('The canvas is bare. A pencil outline waits in it, and a colour mark on its plaque: '+pg.n+'. The wells are back at the entrance.');return}
 if(V.carry!==cn.p){c.shake=.5;bad(cn.x,'NOT THAT ONE');
  note('This canvas does not take '+PIG[V.carry].n+'. Its plaque shows '+pg.n+'. You still have your pigment; nothing was lost.');return}
 // the right pigment: paint
 V.carry=-1;c.st=1;c.t=0;c.f={};AM.sfx('rise');spark(cn.x,CCY,[pg.c,pg.l],26,1.1);
 note('The pigment spreads through the weave.');}
function finAct(){
 if(!V.awake){AM.sfx('interaction');
  note('This frame was never finished. Wake the four other canvases first. Something here is listening.');return}
 if(V.carry!==FIN.p){AM.sfx('interaction');
  note(V.carry<0?'It does not want a Snark. It wants something of yours. Take ROSE from the well beside it.'
   :'This canvas is not waiting for '+PIG[V.carry].n+'. It wants ROSE, the colour of what you make yourself.');return}
 V.carry=-1;V.stt='portal';V.pt=0;AM.sfx('portal');AM.sfx('core-activate');spark(FIN.x,CCY,[PIG[4].c,PIG[4].l,'#ffffff'],40,1.3);
 note('The ROSE sinks into the frame and the surface opens.');}
function propAct(i){const p=PROPS[i];AM.sfx('interaction');note(p.l+'. '+p.t);
 if(p.k==='orchard'&&!V.seen.orchard)V.seen.orchard=1;}

// the fourth painting wakes the last canvas
function finishPaint(i){const cn=CAN[i],pg=PIG[cn.p],SP=SPR[cn.s];
 spark(cn.x,CCY,[pg.c,pg.l,'#ffffff'],34,1.2);say(cn.x,SP.tag);V.cv[i].insp=1;persist();
 note(SP.pages[0]+(SP.pages.length>1?'   [E at the canvas for more]':''));
 if(done()===CAN.length&&!V.awake){V.awake=1;V.awT=0;V.lateT=0;AM.sfx('world-complete');later(900,()=>AM.sfx('collectible'));
  later(2600,()=>{note('At the far end of the studio the last frame has lit. A rose well rose beside it. Nobody ever finished that one. IN ZCASH: these creatures are called Snarks after zk-SNARKs, the proofs behind shielded transactions. Zcash has no single owner: independent teams such as the Zcash Foundation, Shielded Labs and ZODL build its software and upgrades.');say(FIN.x,'THE LAST CANVAS',CCY+210)});persist()}}
// staged one-off effects while a canvas is being painted (flags so each fires once)
function fx(i,c){const cn=CAN[i],SP=SPR[cn.s],t=c.t,pg=PIG[cn.p],f=c.f,at=(k,n,fn)=>{if(t>=k&&!f[n]){f[n]=1;fn()}};
 if(SP.sty===0){at(.30,'a',()=>{AM.sfx('interaction');spark(cn.x,CCY,pg.l,10,.7)});at(.84,'b',()=>{AM.sfx('card-reveal');spark(cn.x+8,CCY-6,['#c4f7ff','#ffffff'],14,.6)})}
 if(SP.sty===1){[.28,.45,.62,.8].forEach((k,j)=>at(k,'l'+j,()=>{AM.sfx('click');spark(cn.x,CCY-30+j*12,['#ffc94a','#e8fbff'],5,.6)}));at(.9,'z',()=>AM.sfx('correct'))}
 if(SP.sty===2){at(.14,'a',()=>AM.sfx('rise'));at(.78,'b',()=>{AM.sfx('collectible');spark(cn.x,CCY+30,['#ffb347','#a7f0c4'],18,.8)})}
 if(SP.sty===3){at(.30,'a',()=>AM.sfx('rise'));at(.36,'b',()=>{AM.sfx('core-activate');spark(cn.x,CCY,['#ffc94a','#8f4dff','#c9a4ff'],44,1.5)})}}

// ======================= physics (same movement model as Keys / Orchard / Ironwood) =======================
function frame(w,h,gy){W_=w;H_=h;GY=gy;U=Math.min(h/800,Math.max(w/820,.5));
 const now=performance.now(),dt=Math.min(.033,(now-V.last)/1000||.016);V.last=now;V.t+=dt;
 // The engine's hub walker drives ax toward tx and ejects the world if both pass the right edge.
 // Pin tx to ax so a stray click can never drag that walker or trip its single '?' hotspot.
 if(!fin)tx=ax;
 const live=V.stt==='play';
 const walk=live?(K.r-K.l):0;
 let tv=walk*SPD;
 V.vx+=Math.sign(tv-V.vx)*Math.min(Math.abs(tv-V.vx),(V.gr?2800:1900)*dt);
 if(walk)V.face=walk;
 V.px+=V.vx*dt;
 V.coy=V.gr?.1:(V.coy||0)-dt;V.buf=(V.buf||0)-dt;
 if(K.jp){V.buf=.12;K.jp=0}
 if(K.jb){V.buf=.12;K.jb=0}
 if(live&&(K.j||K.u)&&V.buf>0&&V.coy>0){V.vy=JMP;V.gr=0;V.coy=0;V.buf=0;AM.sfx('interaction')}
 if(live&&!K.j&&!K.u&&V.vy>0)V.vy-=GRAV*1.2*dt;          // early release gives the short hop
 // S drops through a one-way shelf, but only when standing on one and not walking
 if(live&&K.d&&!walk&&V.gr){const p=PLAT.find(q=>V.px>q[0]-6&&V.px<q[0]+q[1]+6&&Math.abs(V.py-q[2])<4);
  if(p){V.py=p[2]-10;V.gr=0;V.vy=-40;AM.sfx('rise')}}
 const y0=V.py;V.vy-=GRAV*dt;V.py+=V.vy*dt;
 let top2=0;
 if(V.vy<=0){PLAT.forEach(q=>{if(V.px>q[0]-8&&V.px<q[0]+q[1]+8&&y0>=q[2]-2&&q[2]>top2)top2=q[2]});
  if(V.py<=top2){V.py=top2;V.vy=0;V.gr=1}}else V.gr=0;
 if(V.px<HW){V.px=HW;V.vx=0}if(V.px>LW-HW){V.px=LW-HW;V.vx=0}
 V.cx=clamp(V.px-(w/U)*.42,0,Math.max(0,LW-w/U));
 V.cy=clamp(V.py-90,-30,300);
 if(K.e){K.e=0;if(live)act()}
 V.mt-=dt;V.bad=Math.max(0,V.bad-dt);V.carT+=dt;
 // canvases: advance any painting in progress, fire its staged effects, finish it
 V.cv.forEach((c,i)=>{if(c.shake>0)c.shake-=dt;
  if(c.st===1){c.t=Math.min(1,c.t+dt/(SPR[CAN[i].s].dur*(reduce?.4:1)));fx(i,c);if(c.t>=1){c.st=2;finishPaint(i)}}});
 if(V.awake){V.awT+=dt;V.lateT=Math.min(1,V.lateT+dt*.8)}
 // the carried pigment: a spring toward a point beside the shoulder, with a short trail behind it
 if(V.carry>=0){const tx2=V.px-V.face*34,ty2=V.py+PH*.58+Math.sin(V.carT*3)*5;
  V.orb.x+=(tx2-V.orb.x)*Math.min(1,dt*8);V.orb.y+=(ty2-V.orb.y)*Math.min(1,dt*8);
  V.trT-=dt;if(V.trT<=0){V.trT=.035;V.trl.push({x:V.orb.x,y:V.orb.y,l:1});if(V.trl.length>9)V.trl.shift()}}
 V.trl.forEach(q=>q.l-=dt*2.2);V.trl=V.trl.filter(q=>q.l>0);
 // standing still beside a finished canvas is how the quiet things in this room get noticed
 V.still=(Math.abs(V.vx)<5&&V.gr&&live)?V.still+dt:0;
 if(!V.rune&&V.still>3.2&&V.cv[3].st===2&&Math.abs(V.px-CAN[3].x)<170){V.rune=1;persist();AM.sfx('card-reveal');say(CAN[3].x,'SOMETHING IN THE FRAME',CCY+200)}
 V.vp.forEach(q=>{q.vy-=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt*1.2});
 V.vp=V.vp.filter(q=>q.l>0&&q.y>-60);
 V.ft.forEach(f=>f.l-=dt);V.ft=V.ft.filter(f=>f.l>0);
 // the final canvas: ROSE sinks in, the surface opens, then the existing generator takes over
 if(V.stt==='portal'){V.pt+=dt;
  if(V.pt>1.5&&!V.gone){V.gone=1;
   try{ZKSCAPE.enter(8);const b=document.getElementById('mk');if(!b)throw new Error('no artifact button');b.click()}
   catch(e){V.stt='play';V.gone=0;V.pt=0;note('The portal flickers and closes. Use the panel to continue.');console.warn(e)}}}
 // contextual prompt
 V.near=null;
 if(live){const w2=wellAt(),c2=canAt(),p2=propAt();
  if(w2){const pg=PIG[w2.p];V.near={x:w2.x,y:150,l:V.carry<0?'COLLECT '+pg.n:V.carry===w2.p?'PUT IT BACK':'SWAP FOR '+pg.n}}
  else if(c2>=0){const c=V.cv[c2],SP=SPR[CAN[c2].s];
   if(c.st===0)V.near={x:CAN[c2].x,y:FB+260,l:V.carry<0?'EXAMINE THE CANVAS':'PAINT THE CANVAS'};
   else if(c.st===2)V.near={x:CAN[c2].x,y:FB+260,l:'INSPECT '+SP.n}}
  else if(finAt())V.near={x:FIN.x,y:FB+420,l:!V.awake?'THE LAST CANVAS':V.carry===FIN.p?'PAINT YOUR OWN zkSNARK':'THE LAST CANVAS · BRING ROSE'};
  else if(p2>=0)V.near={x:PROPS[p2].x,y:PROPS[p2].y+40,l:'EXAMINE '+PROPS[p2].l};}}

// ======================= drawing helpers =======================
function wrap(s,mw){const o=[];let l='';s.split(' ').forEach(w=>{const t=l?l+' '+w:w;
 if(g2.measureText(t).width>mw&&l){o.push(l);l=w}else l=t});o.push(l);return o}
function bubble(s,x,y,col,mw,a){g2.font=MONO(12);const fs=Math.round(Math.max(11,12*U)),ln=wrap(s,mw),lh=fs*1.4;
 const bw=Math.max(...ln.map(l=>g2.measureText(l).width))+18,bh=ln.length*lh+12,bx=Math.max(8,Math.min(W_-bw-8,x-bw/2)),by=y-bh;
 g2.save();g2.globalAlpha=a==null?1:a;P(bx,by,bw,bh,'#0a0d1de8');g2.strokeStyle=col;g2.lineWidth=2;g2.strokeRect(bx,by,bw,bh);
 g2.fillStyle=C.pc;g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+9,by+6+lh*(i+.8)));g2.restore()}
const hsh=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
// a pixel-stepped arch: body from y=bot up, with a semicircular top. col(k) gets 0 at the bottom and 1 at the apex.
function archShape(cx,botY,wd,hBody,R,col){const p=Math.max(3,Math.round(U*5)),tot=hBody+R;
 for(let y=0;y<tot;y+=p/U){let half=wd/2;if(y>hBody){const dy=y-hBody;half=Math.sqrt(Math.max(0,R*R-dy*dy))*(wd/2/R)}
  P(cx-half*U,botY-(y+p/U)*U,half*2*U,p+1,col(y/tot))}}

// ======================= THE STUDIO =======================
// Layers, back to front: wall + windows (.12-.2) / shelves, sketches, runes (.3) / the pigment mills (.45) /
// lanterns (.6) / the play line (1.0): floor, wells, easels, canvases / foreground columns (1.35).
function backdrop(t){
 const bands=18;
 for(let i=0;i<bands;i++){const k=i/(bands-1);P(0,H_*i/bands,W_,H_/bands+2,mxc('#04050c','#1a2149',k*k*.95))}
 // plaster bays: a pilaster every 520 units with a darker recessed panel between
 for(let k=Math.floor(V.cx*.2/520)-1;k<Math.floor((V.cx*.2+W_/U)/520)+2;k++){
  const sx=L(k*520,.2);
  P(sx+26*U,Y(520),468*U,520*U-(Y(0)-Y(0)),C.void,.18);
  P(sx,Y(560),22*U,560*U,C.wall2);P(sx+4*U,Y(560),4*U,560*U,'#262d5c');P(sx,Y(560),22*U,5*U,C.void);
  P(sx-4*U,Y(18),30*U,18*U,C.void,.55)}
 // the dado rail, the one long horizontal that runs the whole room
 P(0,Y(196),W_,7*U,'#232a5a');P(0,Y(196)+5*U,W_,3*U,C.void,.6);P(0,Y(196),W_,2*U,'#39428a',.7);
 // arched windows onto the night, with a moon in every third one
 for(let k=Math.floor(V.cx*.12/700)-1;k<Math.floor((V.cx*.12+W_/U)/700)+2;k++){
  const cx=L(k*700+330,.12),by=Y(215),ww=150;
  // moonlight falling to the floor (drawn first, behind the architecture)
  const sh=g2.createLinearGradient(0,by,0,Y(0));sh.addColorStop(0,'rgba(190,212,255,.075)');sh.addColorStop(1,'rgba(190,212,255,0)');
  g2.fillStyle=sh;g2.beginPath();g2.moveTo(cx-ww*.5*U,by);g2.lineTo(cx+ww*.5*U,by);g2.lineTo(cx+ww*.5*U+190*U,Y(0));g2.lineTo(cx-ww*.5*U+90*U,Y(0));g2.closePath();g2.fill();
  archShape(cx,by+10*U,ww+22,300,(ww+22)/2,()=>'#05060e');
  archShape(cx,by,ww,300,ww/2,f=>mxc('#27437a','#0a1634',Math.pow(f,.8)));
  const p=Math.max(3,Math.round(U*5));
  for(let q=0;q<9;q++){const sxx=cx+(hsh(k,q)-.5)*ww*.8*U,syy=by-(60+hsh(q,k+3)*330)*U;P(sxx,syy,p*.6,p*.6,'#e6efff',.5+.4*Math.sin(t*1.5+q+k))}
  if(((k%3)+3)%3===0){const mx=cx+30*U,my=by-250*U;P(mx-p*2,my-p,p*4,p*3,'#d9e7ff');P(mx-p,my-p*2,p*2,p*5,'#d9e7ff');P(mx-p*3+p,my-p,p*2,p*3,'#0f1d44')}
  P(cx-3*U,by-300*U-ww/2*U,6*U,(300+ww/2)*U,'#05060e');P(cx-ww/2*U,by-130*U,ww*U,6*U,'#05060e');P(cx-ww/2*U,by-230*U,ww*U,6*U,'#05060e');
  P(cx-(ww/2+14)*U,by+10*U,(ww+28)*U,12*U,'#2a3366')}
 // pinned sketches and a row of tiny glyphs along the rail: the room is full of unfinished thoughts
 for(let k=Math.floor(V.cx*.3/190)-1;k<Math.floor((V.cx*.3+W_/U)/190)+2;k++){
  const r=hsh(k,9);if(r<.45)continue;
  const sx=L(k*190+40*hsh(k,2),.3),sy=Y(230+hsh(k,4)*120),w2=40+hsh(k,5)*26,h2=54+hsh(k,6)*28;
  P(sx,sy,w2*U,h2*U,'#b8ad92',.42);P(sx,sy,w2*U,3*U,'#fff',.1);
  const p=Math.max(2,Math.round(U*3));
  for(let q=0;q<4;q++)P(sx+6*U+hsh(k,q)*14*U,sy+10*U+q*11*U,(10+hsh(q,k)*18)*U,p,'#3a3550',.55);
  P(sx+w2*U*.45,sy-2*U,4*U,6*U,'#ff6fa8',.7)}
 for(let k=Math.floor(V.cx*.3/72)-1;k<Math.floor((V.cx*.3+W_/U)/72)+2;k++){
  const sx=L(k*72,.3),sy=Y(176),p=Math.max(3,Math.round(U*4)),a=.18+.2*Math.sin(t*.9+k*1.3),g=Math.floor(hsh(k,1)*5);
  g2.globalAlpha=Math.max(0,a);g2.fillStyle=PIG[g].c;
  for(let q=0;q<5;q++)if(hsh(k,q+7)>.45)g2.fillRect(Math.round(sx+(q%3)*p),Math.round(sy+Math.floor(q/3)*p),p-1,p-1);
  g2.globalAlpha=1}
 // shelves along the wall, loaded with jars: the visible supply of the studio
 for(let k=Math.floor(V.cx*.3/620)-1;k<Math.floor((V.cx*.3+W_/U)/620)+2;k++){
  const sx=L(k*620+20,.3);
  for(let r=0;r<2;r++){const sy=Y(270+r*108);
   P(sx,sy,440*U,8*U,C.wood2);P(sx,sy,440*U,2*U,C.wood3);P(sx+20*U,sy+8*U,6*U,18*U,C.wood);P(sx+410*U,sy+8*U,6*U,18*U,C.wood);
   for(let q=0;q<11;q++){const hh=hsh(k*5+r,q);if(hh<.25)continue;
    const jx=sx+(14+q*38)*U,jh=(20+hh*26)*U,col=PIG[Math.floor(hsh(q,k+r*7)*5)];
    P(jx,sy-jh,22*U,jh,'#1a1f3f');P(jx+2*U,sy-jh+4*U,18*U,jh-8*U,mxc('#0b0e1f',col.d,.7));P(jx+2*U,sy-jh+4*U,18*U,5*U,col.c,.8);P(jx+4*U,sy-jh+4*U,3*U,jh-10*U,'#fff',.12)}}}
}
function mill(x,t){
 const sx=L(x,.45),by=Y(0),p=Math.max(3,Math.round(U*5));
 // base block
 P(sx-110*U,by-92*U,220*U,92*U,C.stone);P(sx-110*U,by-92*U,220*U,6*U,C.stone3);P(sx-110*U,by-8*U,220*U,8*U,C.void,.5);
 P(sx+86*U,by-92*U,24*U,92*U,C.void,.35);
 // the vat: glass with slowly shifting pigment
 const kk=(t*.12)%5,c0=PIG[Math.floor(kk)%5],c1=PIG[(Math.floor(kk)+1)%5],vc=mxc(c0.c,c1.c,kk%1);
 P(sx+20*U,by-262*U,66*U,170*U,'#0a0f26');P(sx+24*U,by-258*U,58*U,162*U,'#101735');
 const lv=(.62+.08*Math.sin(t*.7))*162;
 P(sx+24*U,by-96*U-lv*U,58*U,lv*U,mxc('#0b0e1f',vc,.55));P(sx+24*U,by-96*U-lv*U,58*U,5*U,vc,.9);P(sx+30*U,by-250*U,6*U,150*U,'#fff',.1);
 P(sx+14*U,by-268*U,78*U,10*U,C.stone3);P(sx+14*U,by-98*U,78*U,10*U,C.stone3);
 const gg=g2.createRadialGradient(sx+53*U,by-170*U,0,sx+53*U,by-170*U,150*U);gg.addColorStop(0,vc+'30');gg.addColorStop(1,vc+'00');
 g2.fillStyle=gg;g2.fillRect(sx-100*U,by-320*U,300*U,300*U);
 // the gear: it turns slowly, which is the whole point
 g2.save();g2.translate(sx-52*U,by-176*U);g2.rotate(t*.22);
 const R=52*U;g2.fillStyle='#2c3466';g2.beginPath();g2.arc(0,0,R,0,7);g2.fill();
 g2.fillStyle=C.stone3;for(let q=0;q<12;q++){g2.save();g2.rotate(q/12*6.2832);g2.fillRect(-7*U,-R-9*U,14*U,16*U);g2.restore()}
 g2.fillStyle=C.ink;g2.beginPath();g2.arc(0,0,R*.62,0,7);g2.fill();
 g2.fillStyle='#46528a';for(let q=0;q<4;q++){g2.save();g2.rotate(q/4*6.2832);g2.fillRect(-4*U,-R*.62,8*U,R*.62);g2.restore()}
 g2.fillStyle=C.gold;g2.beginPath();g2.arc(0,0,9*U,0,7);g2.fill();g2.restore();
 // pipe from the gear to the vat and a nozzle that drips into a bowl
 P(sx-6*U,by-186*U,28*U,8*U,'#46528a');P(sx+86*U,by-110*U,14*U,6*U,'#46528a');P(sx+95*U,by-110*U,6*U,28*U,'#46528a');
 const dr=(t*.7)%1;P(sx+95*U,by-86*U+dr*44*U,6*U,8*U,vc,1-dr*.5);P(sx+80*U,by-40*U,36*U,10*U,C.stone3);P(sx+84*U,by-44*U,28*U,5*U,vc,.8)
}
function lanterns(t){
 for(let k=Math.floor(V.cx*.6/640)-1;k<Math.floor((V.cx*.6+W_/U)/640)+2;k++){
  const sx=L(k*640+200,.6),ly=Y(500+hsh(k,3)*60),fl=.85+.15*Math.sin(t*5+k*3)+.05*Math.sin(t*13+k);
  P(sx+11*U,0,2*U,ly,'#1a1f3f');
  const gg=g2.createRadialGradient(sx+12*U,ly+16*U,0,sx+12*U,ly+16*U,230*U);gg.addColorStop(0,'rgba(255,190,100,'+(.2*fl)+')');gg.addColorStop(1,'rgba(255,190,100,0)');
  g2.fillStyle=gg;g2.fillRect(sx-230*U,ly-210*U,480*U,460*U);
  P(sx,ly,24*U,6*U,C.goldD);P(sx+2*U,ly+6*U,20*U,26*U,'#3a2a14');P(sx+5*U,ly+9*U,14*U,20*U,mxc('#ffb347','#fff2c8',fl*.6),.95);P(sx,ly+32*U,24*U,5*U,C.goldD)}
}
function floorDraw(t){
 const y0=Math.round(Y(0));P(0,y0,W_,H_-y0+3,'#14132c');
 let y=y0,hh=Math.max(7,16*U),i=0;
 while(y<H_){const k=clamp((y-y0)/Math.max(1,H_-y0),0,1);
  P(0,y,W_,hh,mxc('#1d1c3c','#090814',k*.85));P(0,y,W_,Math.max(2,2*U),'#2d3070',.45*(1-k));
  const wd=(220+i*26)*U,off=(V.cx*U*(1+i*.05)+i*77*U)%wd;
  for(let x=-off;x<W_;x+=wd)P(x,y,Math.max(2,2*U),hh,'#07060f',.8);
  y+=hh;hh*=1.17;i++}
 P(0,y0,W_,Math.max(4,4*U),'#5560a8',.9);P(0,y0+Math.max(4,4*U),W_,Math.max(3,3*U),'#2a2f66');
 // pigment spilled on the floor in front of every awake canvas
 CAN.forEach((cn,i)=>{if(V.cv[i].st!==2||!onS(cn.x,400))return;const pg=PIG[cn.p],gx=X(cn.x);
  const gr=g2.createRadialGradient(gx,y0+14*U,0,gx,y0+14*U,230*U);gr.addColorStop(0,pg.c+'55');gr.addColorStop(1,pg.c+'00');
  g2.save();g2.translate(0,0);g2.fillStyle=gr;g2.beginPath();g2.ellipse(gx,y0+16*U,230*U,34*U,0,0,7);g2.fill();g2.restore()})
}
// a pigment well on a stone pedestal. Pigment surface is always visible: the player can read the world
// before pressing anything. Each well has its own colour, its own motes, its own ripple.
function well(w,t,k){
 const x=w.x,pg=PIG[w.p],rise=w.late?ease(V.lateT):1;if(rise<=0||!onS(x,200))return;
 const dy=(1-rise)*70;
 const ga=g2.createRadialGradient(X(x),Y(84-dy),0,X(x),Y(84-dy),150*U);ga.addColorStop(0,pg.c+'44');ga.addColorStop(1,pg.c+'00');
 g2.save();g2.globalAlpha=rise;g2.fillStyle=ga;g2.fillRect(X(x)-150*U,Y(84-dy)-150*U,300*U,300*U);
 rr(x-50,14-dy,100,12,C.void);rr(x-46,26-dy,92,6,C.stone);         // foot
 rr(x-30,32-dy,60,24,C.stone);rr(x-30,32-dy,10,24,C.void);rr(x+22,32-dy,8,24,C.stone2);       // stem, lit on the right
 rr(x-46,56-dy,92,10,C.stone3);rr(x-46,66-dy,92,4,C.stone2);rr(x-46,56-dy,92,2,'#7a86c8');       // bowl rim
 rr(x-40,70-dy,80,6,C.void);                                                   // the dark of the bowl
 const rip=Math.sin(t*2+k)*4;
 rr(x-36,72-dy,72,6,mxc(pg.d,pg.c,.5));rr(x-30,76-dy,60,4,pg.c);rr(x-18+rip,78-dy,28,2,pg.l);
 rr(x-6+Math.sin(t*1.3+k)*14,80-dy,10,2,'#fff');
 g2.restore();
 for(let q=0;q<5;q++){const f=(t*.35+q/5+k*.13)%1;rr(x-30+q*15+Math.sin(t+q)*3,82-dy+f*70,4,4,pg.l);g2.globalAlpha=1}
 TS(pg.n,X(x),Y(0)+Math.max(14,18*U),C.mu,10)}
// the six things an easel is: legs, a tray the canvas sits on, and a plaque
function easel(x){const sx=Math.round(X(x)),bot=Math.round(Y(0)),fb=Math.round(Y(FB));
 for(const s of[-1,1]){P(sx+s*86*U-4*U,fb,8*U,bot-fb,C.wood2);P(sx+s*86*U-4*U,fb,3*U,bot-fb,C.wood3);
  for(let q=0;q<12;q++)P(sx+s*(86+q*3.5)*U-3*U,bot-q*(FB/12)*U-(FB/12)*U,6*U,(FB/12+1)*U,C.wood)}
 P(sx-100*U,fb,200*U,9*U,C.wood2);P(sx-100*U,fb,200*U,3*U,C.wood3);P(sx-100*U,fb+9*U,200*U,2*U,C.void,.5);
 P(sx-86*U,bot-30*U,172*U,7*U,C.wood2);
 P(sx-110*U,bot-3*U,220*U,5*U,C.void,.5)}
function frameBox(sx,top,s,cols,i){
 P(sx,top,32*s,32*s,cols[0]);P(sx+s,top+s,30*s,30*s,cols[1]);P(sx+2*s,top+2*s,28*s,28*s,cols[2]);
 P(sx+s,top+s,30*s,Math.max(1,s*.35),'#fff',.25);P(sx,top+32*s-s*.5,32*s,s*.5,C.void,.4);P(sx+32*s-s*.5,top,s*.5,32*s,C.void,.3);
 P(sx+3*s,top+3*s,26*s,2*s,C.void,.35);P(sx+3*s,top+3*s,2*s,26*s,C.void,.3)}      // the rebate: the frame casts into the canvas
// the bare canvas: warm primed linen, a pencil outline of what is in it, a hint of its colour
function bareSurface(i,ox,oy,s,t){const SP=SPR[CAN[i].s],pg=PIG[CAN[i].p];
 for(let y=0;y<26;y++)for(let x=0;x<26;x++)P(ox+x*s,oy+y*s,s,s,SP.ln[y][x]);
 g2.globalAlpha=.55;g2.fillStyle='#5b5240';SP.sk.forEach(q=>g2.fillRect(Math.round(ox+q[0]*s),Math.round(oy+q[1]*s),Math.max(1,s-1),Math.max(1,s-1)));g2.globalAlpha=1;
 // a smear of its colour in the corner, so a player can read what it wants without any text
 const wob=Math.sin(t*2+i)*1;
 for(let y=0;y<3;y++)for(let x=0;x<3;x++)if(!(x===0&&y===0))P(ox+(2+x)*s,oy+(22+y)*s,s,s,(x+y)%2?pg.c:pg.d,.9)}
function paintAnim(i,ox,oy,s,t){const cn=CAN[i],SP=SPR[cn.s],pg=PIG[cn.p],k=V.cv[i].t;
 const wr=ease(clamp(k/.36,0,1))*24,mk=ease(clamp((k-.2)/.38,0,1));
 for(let y=0;y<26;y++)for(let x=0;x<26;x++){const d=Math.hypot(x-12.5,y-16);
  P(ox+x*s,oy+y*s,s,s,d<=wr?mxc(((x*7+y*13)%9===0)?pg.l:pg.c,SP.gr[y][x],mk):SP.ln[y][x])}
 SP.cells.forEach(cl=>{const q=revealCell(SP,cl,k);if(!q)return;
  g2.globalAlpha=q.a;if(cl.col)P(ox+(cl.x+q.dx)*s,oy+(cl.y+q.dy)*s,s,s,q.f?'#ffffff':cl.col);
  if(cl.tx)cl.tx.forEach(r=>{const x0=Math.round(ox+(r[0]/8+q.dx)*s),x1=Math.round(ox+((r[0]+r[2])/8+q.dx)*s),y0=Math.round(oy+(r[1]/8+q.dy)*s),y1=Math.round(oy+((r[1]+1)/8+q.dy)*s);
   P(x0,y0,Math.max(1,x1-x0),Math.max(1,y1-y0),q.f?'#ffffff':r[3])});
  g2.globalAlpha=1})}
function revealCell(SP,cl,t){
 switch(SP.sty){
 case 0:{ // WITNESS: scattered marks drift in and converge, the hidden light comes last
  if(cl.late){const a=clamp((t-.84)/.1,0,1);return a?{dx:0,dy:0,a,f:0}:null}
  const a=clamp((t-(.18+cl.r*.4))/.1,0,1);if(!a)return null;
  const q=1-ease(clamp((t-.3)/.45,0,1));return {dx:cl.sx*q,dy:cl.sy*q,a,f:0}}
 case 1:{ // PROOFSMITH: fragments lock together, bottom first, each with a flash as it seats
  const key=.12+((25-cl.y)/25*.5+Math.abs(cl.x-15)/15*.22+cl.r*.08),ta=key*.9;if(t<ta-.16)return null;
  const q=1-ease(clamp((t-(ta-.16))/.16,0,1)),an=cl.r*6.283;return {dx:Math.cos(an)*14*q,dy:Math.sin(an)*14*q,a:1,f:(t>=ta&&t<ta+.05)?1:0}}
 case 2:{ // ORACLE: a seed at the neck puts out branches; fruit ripens last
  const d=Math.hypot(cl.x-15,cl.y-21)/21,g=ease(clamp((t-.14)/.66,0,1))*1.15;
  if(cl.late){return t<.78?null:{dx:0,dy:0,a:clamp((t-.78)/.1,0,1),f:0}}
  if(d>g)return null;return {dx:0,dy:0,a:clamp((g-d)/.08,0,1),f:0}}
 default:{ // VEILED GRAIL: the frame first, then the creature in a controlled burst from the centre
  if(cl.fr){const a=clamp(t/.28*1.15-cl.y/25,0,1);return a>0?{dx:0,dy:0,a:1,f:0}:null}
  const d=Math.hypot(cl.x-13,cl.y-13)/20,g=ease(clamp((t-.36)/.42,0,1))*1.1;if(d>g)return null;
  return {dx:0,dy:0,a:1,f:(g-d<.05)?1:0}}}}
function canvasDraw(i,t){const cn=CAN[i],SP=SPR[cn.s],pg=PIG[cn.p],c=V.cv[i];if(!onS(cn.x,300))return;
 const s=CS(),sh=c.shake>0?Math.sin(c.shake*60)*c.shake*16*U:0,sx=Math.round(X(cn.x)-16*s+sh),top=Math.round(Y(FB))-32*s;
 // the pool of light a finished painting throws
 if(c.st!==0){const k=c.st===2?1:ease(c.t),gr=g2.createRadialGradient(sx+16*s,top+16*s,0,sx+16*s,top+16*s,300*U);
  gr.addColorStop(0,pg.c+(c.st===2?'38':'2a'));gr.addColorStop(1,pg.c+'00');g2.fillStyle=gr;g2.globalAlpha=k;g2.fillRect(sx-300*U+16*s,top-300*U+16*s,600*U,600*U);g2.globalAlpha=1}
 easel(cn.x);frameBox(sx,top,s,SP.frame,i);
 // corner ornaments, one style per canvas: round, square, leaf, finial
 const oc=SP.frame[2];for(const q of[[0,0],[30,0],[0,30],[30,30]]){P(sx+q[0]*s,top+q[1]*s,2*s,2*s,oc);P(sx+q[0]*s+(i===3?0:s*.4),top+q[1]*s+(i===3?0:s*.4),(i===3?2:1.2)*s,(i===3?2:1.2)*s,i===0?'#fff':i===1?SP.frame[0]:i===2?'#6bd69a':C.goldD,.5)}
 const ox=sx+3*s,oy=top+3*s;
 if(c.st===0)bareSurface(i,ox,oy,s,t);
 else if(c.st===1)paintAnim(i,ox,oy,s,t);
 else{g2.imageSmoothingEnabled=false;g2.drawImage(SP.done,ox,oy,26*s,26*s);
  // each Snark has one small living detail
  g2.fillStyle='#fff';SP.glints.forEach((cl,q)=>{const a=Math.max(0,Math.sin(t*2.2+q*1.7+i))*.55;if(a<.02)return;g2.globalAlpha=a;g2.fillRect(Math.round(ox+cl.x*s),Math.round(oy+cl.y*s),s,s)});g2.globalAlpha=1;
  // the rune that only a patient visitor sees in the Veiled Grail's frame
  if(i===3&&V.rune){const a=.55+.4*Math.sin(t*3),rx=sx+s*.3,ry=top+27.5*s;g2.globalAlpha=a;g2.fillStyle='#fff0b8';
   [[1,0],[0,1],[1,1],[2,1],[1,2]].forEach(q=>g2.fillRect(Math.round(rx+q[0]*s*.9),Math.round(ry+q[1]*s*.9),Math.max(2,s*.8),Math.max(2,s*.8)));g2.globalAlpha=1}}
 // the plaque: its colour before, its name after
 const py=Math.round(Y(46)),pw=Math.round(176*U),px_=Math.round(X(cn.x)-pw/2+sh);
 P(px_,py,pw,Math.round(24*U),'#0a0d1d');P(px_,py,pw,2,SP.frame[1]);P(px_,py+Math.round(24*U)-2,pw,2,SP.frame[0]);
 if(c.st===2)TS(SP.tag,X(cn.x)+sh,py+Math.round(16*U),SP.frame[2],10);
 else{P(px_+8*U,py+6*U,12*U,12*U,pg.c);P(px_+8*U,py+6*U,12*U,3*U,pg.l);TS(['I','II','III','IV'][i]+' · '+pg.n,X(cn.x)+10*U,py+Math.round(16*U),C.mu,10)}}
// the last canvas: nobody finished it. It is an ornate frame around a blank, luminous surface.
function finalDraw(t){if(!onS(FIN.x,400))return;
 const s=Math.round(CS()*1.3),W26=26*s,cx=Math.round(X(FIN.x)),top=Math.round(Y(58))-W26,sx=cx-W26/2,aw=V.awake?1:0;
 // the dais
 rr(FIN.x-210,0,420,14,C.stone2);rr(FIN.x-210,12,420,3,'#7a86c8');rr(FIN.x-176,14,352,14,C.stone);rr(FIN.x-142,28,284,14,C.stone3);rr(FIN.x-142,40,284,3,'#a1acee');
 rr(FIN.x-210,0,14,14,C.void,.4);
 if(aw){for(let q=0;q<9;q++){const a=.35+.35*Math.sin(t*2+q*.7);rr(FIN.x-200+q*46,6,16,3,PIG[4].c);g2.globalAlpha=1}}
 // glow behind the frame
 const k=aw?(.6+.12*Math.sin(t*2)):.12,gr=g2.createRadialGradient(cx,top+W26/2,0,cx,top+W26/2,W26*1.2);
 gr.addColorStop(0,'rgba(255,111,168,'+(.4*k)+')');gr.addColorStop(1,'rgba(255,111,168,0)');g2.fillStyle=gr;g2.fillRect(cx-W26*1.3,top-W26*.3,W26*2.6,W26*1.8);
 g2.imageSmoothingEnabled=false;g2.drawImage(SPR[4].done,sx,top,W26,W26);
 // surface: asleep until the four are painted
 if(!aw)P(sx+5*s,top+5*s,16*s,16*s,'#05060e',.62);
 else{ // portal ring pulses; a few motes spiral into it
  const cx2=sx+13*s,cy2=top+13*s;
  for(let y=0;y<26;y++)for(let x=0;x<26;x++){const ch=SPR[4].grid[y][x];if(ch!=='R')continue;
   const an=Math.atan2(y-12.5,x-12.5),a=Math.max(0,Math.sin(an*3-t*3))*.7;if(a>.05){g2.globalAlpha=a;P(sx+x*s,top+y*s,s,s,'#fff');g2.globalAlpha=1}}
  for(let q=0;q<16;q++){const f=(t*.32+q/16)%1,an=q*2.4+t*.7,r=(1-f)*W26*.62;
   g2.globalAlpha=Math.sin(f*3.14);P(cx2+Math.cos(an)*r-s*.5,cy2+Math.sin(an)*r*.9-s*.5,s,s,q%3?PIG[4].c:'#fff');g2.globalAlpha=1}}
 // the exact invitation, on a banner ABOVE the frame so nobody standing at the canvas ever hides it
 g2.font=SERIF(23);const tw=g2.measureText('PAINT YOUR OWN zkSNARK').width,pw=Math.max(tw,W26*.9)+36*U,bh=Math.round(54*U),py=top-bh-Math.round(12*U);
 P(cx-pw/2,py,pw,bh,'#0a0612f0');P(cx-pw/2,py,pw,3,aw?PIG[4].c:'#3a3354');P(cx-pw/2,py+bh-3,pw,3,aw?C.goldD:'#2a2540');
 P(cx-pw/2,py,3,bh,aw?PIG[4].c:'#3a3354');P(cx+pw/2-3,py,3,bh,aw?PIG[4].c:'#3a3354');
 P(cx-2*U,py+bh,4*U,Math.round(12*U),C.goldD);                       // it hangs from the frame
 g2.save();g2.textAlign='center';if(aw){g2.shadowColor=PIG[4].c;g2.shadowBlur=14}
 g2.fillStyle=aw?'#ffe9f2':'#8d86a8';g2.font=SERIF(23);g2.fillText('PAINT YOUR OWN zkSNARK',cx,py+Math.round(27*U));g2.restore();
 TS(aw?'THE LAST CANVAS · BRING ROSE':'PAINT THE OTHER FOUR TO WAKE IT',cx,py+Math.round(45*U),aw?PIG[4].l:C.mu,10)}
function propDraw(p,t){if(!onS(p.x,200))return;const sx=X(p.x),by=Y(p.y);
 if(p.k==='sketch'){ // a charcoal study of the Proofsmith's head
  P(sx-34*U,by-p.h*U,68*U,88*U,'#c9bea2',.8);P(sx-34*U,by-p.h*U,68*U,3*U,'#fff',.2);
  const q=Math.max(3,Math.round(4*U));g2.fillStyle='#3a3550';g2.globalAlpha=.8;
  [[0,0],[-1,1],[1,1],[-2,2],[2,2],[-2,3],[2,3],[-1,4],[1,4],[0,5],[0,-1]].forEach(a=>g2.fillRect(Math.round(sx+a[0]*q*1.6-q/2),Math.round(by-(p.h-62)*U+a[1]*q*1.2),q,q));g2.globalAlpha=1;
  P(sx-4*U,by-(p.h+4)*U,8*U,8*U,PIG[1].c);
  for(let k=0;k<3;k++)P(sx-24*U+k*16*U,by-(p.h-76)*U,10*U,4*U,C.gold,.65)}
 else if(p.k==='jars'){for(let k=0;k<5;k++){const jx=sx-86*U+k*34*U,pg=PIG[k];
   P(jx,by-34*U,24*U,34*U,'#1a1f3f');P(jx+2*U,by-30*U,20*U,26*U,pg.d);P(jx+2*U,by-30*U,20*U,8*U,pg.c);P(jx+4*U,by-30*U,4*U,24*U,'#fff',.2);P(jx+4*U,by-38*U,16*U,5*U,C.wood2)}
  const a=.5+.5*Math.sin(t*2);P(sx-4*U,by-62*U,8*U,8*U,'#fff',a*.6)}
 else if(p.k==='blueprint'){P(sx-40*U,by-p.h*U+60*U,80*U,100*U,'#173a5c',.92);P(sx-40*U,by-p.h*U+60*U,80*U,3*U,'#5fa8e0',.5);
  g2.strokeStyle='#8fd0ff';g2.globalAlpha=.7;g2.lineWidth=Math.max(1,2*U);
  g2.beginPath();g2.arc(sx-12*U,by-p.h*U+110*U,17*U,0,7);g2.moveTo(sx+5*U,by-p.h*U+110*U);g2.lineTo(sx+30*U,by-p.h*U+110*U);g2.moveTo(sx+30*U,by-p.h*U+80*U);g2.lineTo(sx+30*U,by-p.h*U+140*U);g2.stroke();g2.globalAlpha=1}
 else if(p.k==='orchard'){const a=Math.sin(t*1.4)*2*U;P(sx-18*U,by-48*U,36*U,44*U,'#e9dcc0',.9);P(sx-2*U,by-46*U,4*U,40*U,'#6bd69a');P(sx-14*U,by-34*U,28*U,3*U,'#6bd69a',.6);P(sx-6*U,by-22*U+a,12*U,12*U,'#ffb347')}}

// pixel-snapped player, the carried pigment, and a clear label so state is never ambiguous
function drawPlayer(p){if(!(pim&&pim.complete&&pim.width))return;
 const ph=PH*U,aw=ph*pim.width/pim.height,sx=X(V.px),sy=Y(V.py),idle=V.gr&&Math.abs(V.vx)<20?Math.sin(T*3)*.012:0;
 g2.fillStyle='#0009';g2.beginPath();g2.ellipse(sx,sy+3,aw*.36,4.5*U,0,0,7);g2.fill();
 g2.save();g2.shadowColor=p.pr;g2.shadowBlur=14;g2.imageSmoothingEnabled=false;
 g2.translate(sx,sy);g2.scale(V.face<0?-(1-idle):1-idle,1+idle);g2.drawImage(pim,-aw/2,-ph,aw,ph);g2.restore();
 if(V.carry>=0){const pg=PIG[V.carry],ox=X(V.orb.x),oy=Y(V.orb.y),s=Math.max(4,Math.round(4.6*U));
  V.trl.forEach((q,k)=>{g2.globalAlpha=q.l*.55;P(X(q.x)-s*.5,Y(q.y)-s*.5,s*(.6+q.l*.6),s*(.6+q.l*.6),pg.c);g2.globalAlpha=1});
  const gr=g2.createRadialGradient(ox,oy,0,ox,oy,34*U);gr.addColorStop(0,pg.c+'99');gr.addColorStop(1,pg.c+'00');g2.fillStyle=gr;g2.fillRect(ox-34*U,oy-34*U,68*U,68*U);
  // the orb: a small pixel droplet
  P(ox-s*2,oy-s,s*4,s*3,pg.d);P(ox-s,oy-s*2,s*2,s*5,pg.d);P(ox-s*1.5,oy-s*1.5,s*3,s*3,pg.c);P(ox-s,oy-s,s,s,pg.l);
  // above the head: the name of what you carry, with its colour
  const hy=Y(V.py+PH)-Math.round(16*U);P(sx-26*U,hy-14*U,52*U,14*U,'#0a0d1dd0');P(sx-26*U,hy-14*U,6*U,14*U,pg.c);TS(pg.n,sx+4*U,hy-3*U,pg.l,9)}
 if(V.lad>=0){}}
function studio(t){
 backdrop(t);
 for(const mx of[1180,3140,5000])mill(mx,t);
 floorDraw(t);
 PLAT.forEach(q=>{rr(q[0],q[2],q[1],14,C.wood2);rr(q[0],q[2]+10,q[1],4,C.wood3);rr(q[0],q[2],q[1],3,C.void,.5);
  for(let i=14;i<q[1];i+=50)rr(q[0]+i,q[2]-22,4,22,C.void,.6)});
 PROPS.forEach(p=>propDraw(p,t));
 // wells' trough
 if(onS(700,500)){rr(250,0,880,10,C.wood2);rr(250,8,880,3,C.void,.5);rr(250,0,880,2,C.wood3)}
 wellList().forEach((w,k)=>well(w,t,k));
 CAN.forEach((c,i)=>canvasDraw(i,t));
 finalDraw(t);
 lanterns(t);
 // pigment dust in the air. Colour and density rise with what you have painted.
 const n=V.cv.filter(c=>c.st===2).length;
 for(let i=0;i<46;i++){const sp=.18+(i%5)*.11,x=(i*151+t*sp*26)%(LW+400)-200,y=30+((i*83+t*sp*20)%560);
  if(X(x)<-40||X(x)>W_+40)continue;
  const pc=n?PIG[CAN[i%CAN.length].p]:null;
  const col=(pc&&V.cv[i%4].st===2)?pc.l:'#b9c6ff';
  P(X(x),Y(y),i%3?2:3,i%3?2:3,col,(.14+.4*(.5+.5*Math.sin(t*1.7+i)))*(i%4?.8:1))}
 // foreground: two out-of-focus dark columns frame the shot without ever covering anything you use
 if(!reduce){P(L(-70,1),0,92*U,H_,C.void,.7);P(L(LW-22,1),0,92*U,H_,C.void,.7)}   // the two ends of the room; they never cross the screen
 V.vp.forEach(q=>{g2.globalAlpha=Math.min(1,q.l*1.6);P(X(q.x),Y(q.y),q.s*U,q.s*U,q.c);g2.globalAlpha=1});
 V.ft.forEach(f=>bubble(f.s,X(f.x),Y(f.y),PIG[4].c,240*U,Math.min(1,f.l)))}

function drawHud(p){g2.textAlign='center';
 if(V.near&&V.stt==='play')bubble((coarse?'TAP ✋  ':'[E]  ')+V.near.l,X(V.near.x),Y(V.near.y),C.ok,320*U);
 if(V.bad>0){g2.fillStyle='rgba(255,106,138,'+(V.bad*.22)+')';g2.fillRect(0,0,W_,H_)}
 // progress: four diamonds for the four Snarks, a fifth for your own, and the pigment you hold
 g2.save();const px0=18,py0=coarse?122:18;P(px0,py0,196,58,'#0a0d1dd8');g2.strokeStyle='#46528a';g2.lineWidth=2;g2.strokeRect(px0,py0,196,58);
 for(let i=0;i<5;i++){const x=px0+24+i*36,y=py0+10,c=i<4?V.cv[i].st===2:V.stt==='portal',pg=PIG[i<4?CAN[i].p:4];
  g2.save();g2.translate(x,y+8);g2.rotate(.785);g2.fillStyle=c?pg.c:'#171c3a';g2.fillRect(-8,-8,16,16);g2.strokeStyle=c?pg.l:(i===4&&V.awake?pg.c:'#46528a');g2.lineWidth=2;g2.strokeRect(-8,-8,16,16);g2.restore()}
 g2.font=MONO(10);g2.fillStyle=C.mu;g2.textAlign='left';
 g2.fillText(V.carry>=0?'CARRYING '+PIG[V.carry].n:V.awake?'THE LAST CANVAS IS AWAKE':'SNARKS REVEALED '+done()+'/4',px0+10,py0+50);g2.restore();
 g2.font=MONO(11);g2.fillStyle=C.mu;g2.textAlign='center';
 if(!coarse&&V.stt==='play')g2.fillText('A / D WALK · SPACE JUMP · S DROP · E USE',W_/2,H_-14);
 if(V.mt>0&&V.msg){g2.font=MONO(13);const mw=Math.min(W_-24,680),ln=wrap(V.msg,mw-28),bh=ln.length*22+22;
  const bx=(W_-mw)/2,by=H_-bh-(coarse?90:40);
  g2.save();g2.globalAlpha=Math.min(1,V.mt*2);P(bx,by,mw,bh,'#0a0d1df2');g2.strokeStyle=C.ok;g2.lineWidth=2;g2.strokeRect(bx,by,mw,bh);
  g2.fillStyle=C.pc;g2.textAlign='left';ln.forEach((l,i)=>g2.fillText(l,bx+14,by+24+i*22));g2.restore()}
 // the portal: rose light floods the screen, then the generator opens
 if(V.stt==='portal'){const k=clamp(V.pt/1.4,0,1),cx=X(FIN.x),cy=Y(CCY+30),R=Math.max(W_,H_)*1.3*ease(k);
  const gr=g2.createRadialGradient(cx,cy,0,cx,cy,Math.max(10,R));gr.addColorStop(0,'rgba(255,255,255,'+k+')');gr.addColorStop(.5,'rgba(255,143,191,'+(k*.9)+')');gr.addColorStop(1,'rgba(255,111,168,0)');
  g2.fillStyle=gr;g2.fillRect(0,0,W_,H_);
  }}

// ======================= wiring into the shared engine =======================
// ---- FOREGROUND OVERRIDE ------------------------------------------------------------
// The engine's fore() paints three full-height wedges in th.fog AFTER the world has drawn, then adds
// engine particles and a bottom vignette. For Canvas that was the pale-magenta wash. fore() is a plain
// function declaration in the engine closure, so a world can replace it for itself only, exactly like
// bg/avatar. This keeps what fore() is for (floating particles, a dark seat under the floor) and replaces
// the wedges with a soft ink-blue vignette. Every other world keeps the original fore().
const _forc=fore;fore=function(w,h,gy,p){
 if(!isC())return _forc(w,h,gy,p);
 amb(w,h,T,TH.canvas,p);
 g2.fillStyle='#000';g2.globalAlpha=.4;
 for(let k=0;k<3;k++){g2.beginPath();g2.ellipse(w*(.1+k*.45)-cam*.25,h*1.03,150+k*40,h*.07,0,0,7);g2.fill()}
 g2.globalAlpha=1;
 const v=g2.createRadialGradient(w/2,h*.46,Math.min(w,h)*.34,w/2,h*.46,Math.max(w,h)*.8);
 v.addColorStop(0,'rgba(5,6,14,0)');v.addColorStop(1,'rgba(5,6,14,.6)');
 g2.fillStyle=v;g2.fillRect(0,0,w,h);};
const _bgc=bg;bg=function(w,h,gy,p){if(isC()){frame(w,h,gy);cam=V.cx*U;studio(T)}else _bgc(w,h,gy,p)};
const _avc=avatar;avatar=function(w,h,gy,p){if(isC()){drawPlayer(p);drawHud(p)}else _avc(w,h,gy,p)};
const _stc=startWorld;startWorld=function(i){const me=W[i].id==='canvas';if(me)cInit();_stc(i);
 if(me){hs=[];vis=[];tx=ax;$z('wf').innerHTML=''}};
const _spc=stopWorld;stopWorld=function(){if(V)V.on=0;ctl(0);_spc()};
});

/* ZKMUS - procedural background music for ZKSCAPE.
   Loaded next to zkp.js, BEFORE the worlds. Inert unless index.html's AudioManager hands it
   an AudioContext + the music bus, which it only does when no .mp3 exists for a world
   (music() falls back to drone()). index.html keeps its original drone() as a fallback.

   Why this exists: the site ships nothing to the server, so real tracks would add ~26MB.
   Generated music costs zero bytes, never loops with a seam, and stays licence-free.
   Every world is one generator + one table entry, so the whole soundtrack is coherent by
   construction rather than by luck.

   Contract: ZKMUS.play(ctx, name, bus) -> {g,n} shaped so index.html's stopCur() can fade
   and tear it down with the same handle shape it already uses for drone(). */
window.ZKMUS=(function(){
'use strict';

const MINPENT=[0,3,5,7,10],DORIAN=[0,2,3,5,7,9,10],PHRYGIAN=[0,1,3,5,7,8,10];
const mhz=m=>440*Math.pow(2,(m-69)/12);            // midi -> Hz

/* Procedural reverb: exponentially decaying stereo noise, one-pole damped so the tail
   darkens as it dies (damp 0 = bright room, 1 = dead stone hall). ~12 lines, and the single
   biggest difference between "synth beeps" and "synth music in a space". */
function impulse(ctx,sec,decay,damp){
  const n=Math.max(1,Math.floor(ctx.sampleRate*sec)),buf=ctx.createBuffer(2,n,ctx.sampleRate);
  for(let c=0;c<2;c++){
    const d=buf.getChannelData(c);let lp=0,k=1-damp*.5;
    for(let i=0;i<n;i++){const v=(Math.random()*2-1)*Math.pow(1-i/n,decay);lp+=(v-lp)*k;d[i]=lp}
  }
  return buf;
}
function send(ctx,bus,sec,decay,damp,amount){
  const c=ctx.createConvolver();c.buffer=impulse(ctx,sec,decay,damp);
  const g=ctx.createGain();g.gain.value=amount;c.connect(g);g.connect(bus);
  return{node:c,gain:g};
}

/* ---------------------------------------------------------------- voices
   Each returns {n:[nodes]} for teardown. Voices that ring past their note write their
   length into n so stopCur() can silence them cleanly instead of letting them orphan. */

/* Sustained detuned stack through one lowpass. Two oscillators per chord tone, spread a
   few cents either side, so it breathes instead of sitting still. */
function pad(ctx,dest,freqs,cutoff,q){
  const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=cutoff;
  /* Q is the main source of buzz: a resonant lowpass whistles. Scale every world's value down
     by the same factor, so the table keeps its relative character without the harsh edge. */
  f.Q.value=Math.min(1.8,q*.35);
  const g=ctx.createGain();g.gain.value=0;
  const n=[f,g];
  freqs.forEach((fr,i)=>{
    for(let d=0;d<2;d++){
      const o=ctx.createOscillator();
      o.type=i%2?'sine':'triangle';   // no sawtooth: it was the loudest buzz in every world
      o.frequency.value=fr;o.detune.value=(d?1:-1)*(4+i*2.5);
      const og=ctx.createGain();og.gain.value=.34/(i+1.4);
      o.connect(og);og.connect(f);o.start();n.push(o,og);
    }
  });
  f.connect(g);g.connect(dest);
  return{n,filter:f,gain:g};
}

/* Sine sub an octave below the root. Gives the track weight on small speakers. */
function sub(ctx,dest,freq){
  const o=ctx.createOscillator();o.type='sine';o.frequency.value=freq;
  const g=ctx.createGain();g.gain.value=0;o.connect(g);g.connect(dest);o.start();
  return{n:[o,g],osc:o,gain:g};
}

/* Inharmonic FM bell: a modulator at a slightly stretched 2.01x makes the partials
   clank rather than sing. That metallic edge is what reads as "mechanism". */
function bell(ctx,dest,freq,vel,dur){
  const t=ctx.currentTime;
  const c=ctx.createOscillator();c.type='sine';c.frequency.value=freq;
  const m=ctx.createOscillator();m.type='sine';m.frequency.value=freq*2.01;
  const mg=ctx.createGain();mg.gain.value=freq*1.1;m.connect(mg);mg.connect(c.frequency);
  const g=ctx.createGain();
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(.0002,vel),t+.01);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  c.connect(g);g.connect(dest);c.start(t);m.start(t);c.stop(t+dur+.05);m.stop(t+dur+.05);
  return{n:[c,m,mg,g]};
}

/* Machinery tick: filtered noise burst with a fast downward sweep. */
function hit(ctx,dest,vel,dur,f0,f1,q){
  const t=ctx.currentTime,n=Math.floor(ctx.sampleRate*dur);
  const buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);
  const s=ctx.createBufferSource();s.buffer=buf;
  const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=q;
  bp.frequency.setValueAtTime(f0,t);bp.frequency.exponentialRampToValueAtTime(f1,t+dur);
  const g=ctx.createGain();g.gain.value=vel;
  s.connect(bp);bp.connect(g);g.connect(dest);s.start(t);
  return{n:[s,bp,g]};
}

/* ---------------------------------------------------------------- per-world table
   index.html already ships a per-world tone row (M) used by the old drone. Where a root is
   given here it matches M[name][0], so the generated voice and the fallback drone agree.

   Every entry answers the same four questions: what key/colour, how bright, how much space,
   and what moves. `hit` is a low event, `click` a high quiet one; set either to null to
   silence it. Bells pick degrees from `scale`, so changing the scale reshapes the melody
   without touching the chord. */
const DEF={
  cutoff:1000,q:3,cutoffSwing:.3,lfo:.05,padGain:.28,subGain:.34,build:24,
  verb:{sec:4,decay:2.4,damp:.45,send:.42},
  bell:{base:72,scale:MINPENT,oct:[0,12],every:[3,6],vel:.11,dur:3,send:.45},
  hit:null,click:null
};
const W=o=>{const m=Object.assign({},DEF,o);m.verb=Object.assign({},DEF.verb,o.verb);m.bell=Object.assign({},DEF.bell,o.bell);return m};

const MOOD={
  /* THE HUB - the plaza you return to. Open, bright, unhurried, no pulse: an exhale between
     worlds rather than another place. Root A keeps the 110Hz the hub has always had. */
  zk:W({sub:55,chord:[110,138.6,164.8,220,246.9],cutoff:1700,q:2,cutoffSwing:.18,lfo:.038,
    padGain:.26,subGain:.24,build:22,
    verb:{sec:5,decay:2.2,damp:.22,send:.5},
    bell:{base:76,scale:[0,2,4,7,9],oct:[0,0,12],every:[4.5,8],vel:.085,dur:4.2,send:.55}}),

  /* ORIGIN - ruins at dawn. Warm Dorian, open and hopeful; the one world that resolves. */
  origin:W({sub:49,chord:[98,146.8,196,293.7],cutoff:1100,q:2.2,cutoffSwing:.22,lfo:.04,
    padGain:.26,subGain:.26,build:20,
    verb:{sec:3.6,decay:2.2,damp:.3,send:.44},
    bell:{base:74,scale:DORIAN,oct:[0,12],every:[3,5.5],vel:.095,dur:3,send:.44},
    hit:{every:11,vel:.04,dur:.5,f0:1100,f1:260,q:1.5,send:.3}}),

  /* SHIELDED VALLEY - running room and open air. Bright, wide, a major pentatonic that
     drifts rather than locks down. The openest track in the game. */
  shielded:W({sub:65.4,chord:[130.8,196,261.6,329.6,392],cutoff:2000,q:1.8,cutoffSwing:.3,lfo:.06,
    padGain:.24,subGain:.2,build:18,
    verb:{sec:5.2,decay:2,damp:.28,send:.54},
    bell:{base:79,scale:[0,2,4,7,9],oct:[0,12,12],every:[2.4,4.4],vel:.085,dur:2.8,send:.5},
    click:{every:.9,vel:.009,dur:.07,f0:2000,f1:1600,q:2.6,send:.2}}),

  /* PROOF TEMPLE - a sealed chamber that only ever says INVALID. Tritone suspension, dark
     and tight, no room for the sound to escape. Deliberately never settles. */
  proof:W({sub:61.7,chord:[123.5,164.8,174.6,246.9,349.2],cutoff:760,q:4.4,cutoffSwing:.12,lfo:.03,
    padGain:.3,subGain:.4,build:30,
    verb:{sec:2.4,decay:2.6,damp:.6,send:.34},
    bell:{base:60,scale:[0,1,6],oct:[0,12],every:[6.5,11],vel:.08,dur:5,send:.4},
    hit:{every:9.5,vel:.09,dur:.7,f0:420,f1:70,q:2.2,send:.3}}),

  /* KEY LIBRARY - an impossible archive where every act is recorded. Clockwork: a thin pad
     over a precise, regular tick. Correct and cold. */
  keys:W({sub:43.7,chord:[87.3,130.8,174.6,207.7,261.6],cutoff:950,q:3.6,cutoffSwing:.14,lfo:.045,
    padGain:.22,subGain:.3,build:24,
    verb:{sec:3,decay:2.6,damp:.5,send:.38},
    bell:{base:67,scale:MINPENT,oct:[12],every:[7,12],vel:.075,dur:2.4,send:.42},
    hit:{every:3,vel:.05,dur:.16,f0:2200,f1:900,q:3,send:.3},
    click:{every:.28,vel:.014,dur:.04,f0:2400,f1:1900,q:3,send:.22}}),

  /* ORCHARD - fruit that never falls, a well of rings that touch nothing. Warm major
     pentatonic, soft high bells like spores drifting. It grows rather than ticks. */
  orchard:W({sub:73.4,chord:[146.8,220,293.7,370,440],cutoff:1800,q:2,cutoffSwing:.26,lfo:.055,
    padGain:.24,subGain:.26,build:26,
    verb:{sec:3.8,decay:2,damp:.32,send:.46},
    bell:{base:81,scale:[0,2,4,7,9],oct:[0,12,12],every:[1.9,3.8],vel:.085,dur:2.6,send:.46},
    click:{every:1.4,vel:.007,dur:.09,f0:1700,f1:1300,q:2.4,send:.18}}),

  /* IRONWOOD - a foundry that pulses and is never answered. Tritone chord (C / G / F#),
     heavy lowpass, sparse bells in a long dark hall. Hollow rather than menacing. */
  ironwood:W({sub:32.7,chord:[65.4,92.3,98.1,130.8,196],cutoff:430,q:3.4,cutoffSwing:.34,lfo:.052,
    padGain:.30,subGain:.42,build:26,
    verb:{sec:4.2,decay:2.4,damp:.62,send:.42},
    bell:{base:72,scale:MINPENT,oct:[0,0,12],every:[2.8,6.2],vel:.13,dur:3.6,send:.5},
    hit:{every:6,vel:.085,dur:.55,f0:1500,f1:110,q:1.1,send:.45},
    click:{every:.42,vel:.012,dur:.05,f0:1800,f1:1500,q:3,send:.15}}),

  /* BLOCK OBSERVATORY - watching histories being proposed. Cold, enormous and slow; high
     sparse arpeggios drifting over a vast tail, like a telescope tracking something distant. */
  blocks:W({sub:55,chord:[110,164.8,220,261.6,329.6],cutoff:1500,q:2.2,cutoffSwing:.34,lfo:.028,
    padGain:.26,subGain:.28,build:32,
    verb:{sec:6.2,decay:1.9,damp:.3,send:.56},
    bell:{base:84,scale:[0,2,4,7,9],oct:[0,12],every:[2,3.6],vel:.07,dur:4.4,send:.54},
    hit:{every:12,vel:.035,dur:1.1,f0:700,f1:120,q:1.2,send:.4}}),

  /* MACHINE - every part works, none of them are connected. Heavy and relentless: a strong
     regular pulse under a resonant minor chord that keeps leaning forward. */
  machine:W({sub:41.2,chord:[82.4,123.5,164.8,196,246.9],cutoff:860,q:4.8,cutoffSwing:.2,lfo:.07,
    padGain:.26,subGain:.44,build:22,
    verb:{sec:3.2,decay:2.4,damp:.5,send:.4},
    bell:{base:64,scale:[0,2,3,7,10],oct:[0,12],every:[3,5],vel:.1,dur:2.4,send:.44},
    hit:{every:1.5,vel:.075,dur:.4,f0:1100,f1:150,q:1.6,send:.4},
    click:{every:.33,vel:.011,dur:.05,f0:1900,f1:1000,q:3,send:.24}}),

  /* CANVAS - the studio where you make something of your own. Highest register in the game,
     bright and busy and a little playful; the only track that sounds like it's having fun. */
  canvas:W({sub:82.4,chord:[164.8,246.9,329.6,415.3,493.9],cutoff:2400,q:1.8,cutoffSwing:.3,lfo:.09,
    padGain:.22,subGain:.18,build:16,
    verb:{sec:2.6,decay:2,damp:.2,send:.4},
    bell:{base:83,scale:[0,2,4,7,9],oct:[0,12,12,12],every:[1.1,2.1],vel:.08,dur:2,send:.4},
    click:{every:.34,vel:.012,dur:.06,f0:2300,f1:1600,q:2.6,send:.24}}),

  /* ARCHIVE - the hall of seals and the final trial. Solemn, ceremonial, weight: the
     longest reverb and the longest bell decay in the game. Earns its ending. */
  archive:W({sub:49,chord:[98,146.8,196,233.1,293.7],cutoff:1150,q:3.2,cutoffSwing:.16,lfo:.032,
    padGain:.3,subGain:.4,build:34,
    verb:{sec:6.5,decay:2.1,damp:.42,send:.58},
    bell:{base:55,scale:[0,2,3,7,10],oct:[0,12],every:[4,7.5],vel:.11,dur:5.4,send:.56},
    hit:{every:9,vel:.06,dur:1.3,f0:600,f1:90,q:1.3,send:.42}}),

  /* NOIR - a private wallet city, cold mechanism, someone always watching. Very low, very
     dry and very sparse: private by design, not by accident. */
  noir:W({sub:36.7,chord:[73.4,146.8,174.6,220,293.7],cutoff:520,q:3.8,cutoffSwing:.1,lfo:.036,
    padGain:.26,subGain:.46,build:28,
    verb:{sec:1.9,decay:2.8,damp:.66,send:.3},
    bell:{base:69,scale:MINPENT,oct:[12],every:[7.5,13],vel:.065,dur:3.4,send:.38},
    hit:{every:6.5,vel:.05,dur:.3,f0:1800,f1:300,q:2.4,send:.24}}),

  /* ZILKROAD - a market where everything has a face. The busiest track: many quick bells over
     a bright major chord, light chatter clicks underneath. Social, and slightly mercenary. */
  zilkroad:W({sub:98,chord:[196,293.7,392,493.9,587.3],cutoff:2200,q:2,cutoffSwing:.28,lfo:.1,
    padGain:.22,subGain:.24,build:16,
    verb:{sec:2.8,decay:2,damp:.26,send:.42},
    bell:{base:79,scale:[0,2,4,7,9],oct:[0,0,12,12],every:[.7,1.5],vel:.075,dur:1.8,send:.42},
    hit:{every:2,vel:.05,dur:.22,f0:1900,f1:500,q:2,send:.34},
    click:{every:.22,vel:.014,dur:.04,f0:2500,f1:1800,q:3,send:.28}})
};

function build(ctx,name,bus){
  const M=MOOD[name]||MOOD.ironwood;
  const t0=ctx.currentTime+.05;
  const out=ctx.createGain();out.gain.value=1;out.connect(bus);

  const v=send(ctx,out,M.verb.sec,M.verb.decay,M.verb.damp,1);
  const dry=ctx.createGain();dry.gain.value=1-.45;dry.connect(out);

  const master=ctx.createGain();master.gain.value=0;master.connect(out);
  const nodes=[out,dry,v.node,v.gain,master];

  const P=pad(ctx,dry,M.chord,M.cutoff,M.q);nodes.push(...P.n);
  const S=sub(ctx,dry,M.sub);nodes.push(...S.n);
  const wn=ctx.createGain();wn.gain.value=M.bell.send;wn.connect(v.node);

  // slow filter sweep - the single cheapest way to stop a held chord sounding static
  const lfo=ctx.createOscillator();lfo.type='sine';lfo.frequency.value=M.lfo;
  const lg=ctx.createGain();lg.gain.value=M.cutoff*M.cutoffSwing;
  lfo.connect(lg);lg.connect(P.filter.frequency);lfo.start(t0);nodes.push(lfo,lg);

  // slow fade-in: the track assembles itself over ~build seconds instead of slamming on
  master.gain.setValueAtTime(0,t0);master.gain.setTargetAtTime(1,t0,M.build/3.2);
  P.gain.gain.setTargetAtTime(M.padGain,t0,M.build/3.2);
  S.gain.gain.setTargetAtTime(M.subGain,t0,M.build/2.6);

  let alive=true,timers=[],nextBell=t0+2,nextHit=t0+(M.hit?M.hit.every:1e9),nextClick=t0+.3;

  /* Lookahead scheduler: a coarse timer wakes often and queues anything landing inside the
     next window. setInterval alone is too jittery for musical timing. */
  const LOOK=.35;
  const tick=()=>{
    if(!alive)return;
    const now=ctx.currentTime,horizon=now+LOOK;
    while(nextBell<horizon){
      const b=M.bell,deg=b.scale[(Math.random()*b.scale.length)|0];
      const oct=b.oct[(Math.random()*b.oct.length)|0];
      nodes.push(...bell(ctx,wn,mhz(b.base+deg+oct),b.vel,b.dur).n);
      nextBell+=b.every[0]+Math.random()*(b.every[1]-b.every[0]);
    }
    if(M.hit&&nextHit<horizon){
      nodes.push(...hit(ctx,wn,M.hit.vel,M.hit.dur,M.hit.f0,M.hit.f1,M.hit.q).n);
      nextHit+=M.hit.every*(.94+Math.random()*.12);
    }
    if(M.click&&nextClick<horizon){
      nodes.push(...hit(ctx,dry,M.click.vel,M.click.dur,M.click.f0,M.click.f1,M.click.q).n);
      nextClick+=M.click.every*(.6+Math.random()*.8);
    }
  };
  const iv=setInterval(tick,60);tick();
  timers.push(iv);

  /* stopCur() calls .stop()/.disconnect() on every entry in n, so teardown rides the
     existing path: clear the scheduler, then silence and unhook the graph. */
  nodes.push({stop(){alive=false;timers.forEach(clearInterval)}});
  return{g:master,n:nodes};
}

return{play:build,moods:Object.keys(MOOD),version:'0.1'};
})();
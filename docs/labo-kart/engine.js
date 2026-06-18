/* ════════════════════════════════════════════════════════════════════════
   LABO KART — MOTEUR DE JEU
   Canvas 2D pur, 640×360, pixel-art, caméra TOP-DOWN ROTATIVE (le monde tourne
   autour du kart, type Mario Kart SNES). Même socle technique que Temple des
   Savoirs : requestAnimationFrame, son Web Audio procédural, localStorage.
   ════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
const C=document.querySelector('#game'),X=C.getContext('2d'),W=1280,H=720;
X.imageSmoothingEnabled=true;   // haute rés : sol/dégradés lisses ; sprites en rects restent nets
const DATA=window.LABO_KART_DATA, ITEMS=DATA.items, ZT=DATA.zoneTypes, DRIVERS=DATA.drivers;
const TAU=Math.PI*2;
// pilote choisi (index dans DRIVERS) persistant
let selectedDriver=Math.min(Math.max(+(localStorage.getItem('labo-kart-driver')||0)||0,0),DRIVERS.length-1);

/* ── État global ── */
let settings={shake:true,sound:true,music:true,touch:true,diff:'NORMAL',
  ...JSON.parse(localStorage.getItem('labo-kart-settings')||'{}')};
let state='menu', raf=0, last=0, paused=false;
let track=null, segs=[], trackLen=0;     // segments cumulés de la polyligne
let karts=[], player=null, boxes=[], zones=[], obstacles=[], movers=[], decor=[], drops=[], beams=[], fx=[], floaters=[];
let cam={x:0,y:0,a:0,shake:0,zoom:1};
let keys={}, touch={left:false,right:false,accel:false,brake:false,item:false};
let raceTime=0, countdown=0, finished=false, finishOrder=[], started=false;
let audioCtx=null;

/* ── Helpers ── */
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
function angLerp(a,b,t){let d=((b-a+Math.PI)%TAU)-Math.PI;return a+d*t;}
function fmtTime(s){let m=Math.floor(s/60),ss=Math.floor(s%60);return m+':'+(ss<10?'0':'')+ss;}

/* ════════ AUDIO (procédural, façon Temple) ════════ */
function ensureAudio(){if(!audioCtx){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}}
function tone(f0,f1,dur,type,vol){
  if(!audioCtx||!settings.sound)return;
  let t0=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(f0,t0);
  if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t0+dur);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol||.12,t0+.01);
  g.gain.exponentialRampToValueAtTime(.0008,t0+dur);
  o.connect(g);g.connect(audioCtx.destination);o.start(t0);o.stop(t0+dur+.03);
}
function noise(dur,vol){
  if(!audioCtx||!settings.sound)return;
  let t0=audioCtx.currentTime,n=Math.floor(audioCtx.sampleRate*dur),
    buf=audioCtx.createBuffer(1,n,audioCtx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  let s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=buf;
  g.gain.value=vol||.12;s.connect(g);g.connect(audioCtx.destination);s.start();
}
const sfx={
  box:()=>{tone(620,1040,.12,'square',.12);},
  item:()=>{tone(880,1320,.1,'triangle',.1);},
  boost:()=>{tone(300,900,.25,'sawtooth',.12);},
  hit:()=>{noise(.18,.16);tone(160,60,.18,'square',.1);},
  beep:()=>{tone(700,700,.1,'square',.12);},
  go:()=>{tone(1046,1318,.35,'square',.14);},
  lap:()=>{tone(660,990,.16,'triangle',.12);},
  win:()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,f,.18,'square',.13),i*120));},
  lose:()=>{[440,392,330,262].forEach((f,i)=>setTimeout(()=>tone(f,f,.2,'sawtooth',.12),i*140));}
};
/* moteur : oscillateur continu dont la fréquence suit la vitesse */
let engOsc=null,engGain=null;
function startEngine(){
  if(!audioCtx||!settings.sound||engOsc)return;
  engOsc=audioCtx.createOscillator();engGain=audioCtx.createGain();
  engOsc.type='sawtooth';engOsc.frequency.value=80;engGain.gain.value=0.0;
  let lp=audioCtx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=600;
  engOsc.connect(lp);lp.connect(engGain);engGain.connect(audioCtx.destination);engOsc.start();
}
function stopEngine(){if(engOsc){try{engOsc.stop();}catch(e){}engOsc=null;engGain=null;}}
function updateEngine(spd){
  if(!engOsc||!engGain)return;
  engOsc.frequency.value=70+spd*46;
  engGain.gain.value=settings.sound?clamp(.015+spd*.03,0,.06):0;
}

/* ════════ GÉOMÉTRIE DE PISTE ════════
   Construit segs[] : pour chaque arête de la polyligne, position de départ,
   direction, longueur et distance cumulée → permet de projeter n'importe quel
   point sur la piste (progression) et de générer la grille de départ. */
/* Lissage spline Catmull-Rom (boucle fermée) : transforme des waypoints de
   contrôle clairsemés en une polyligne dense aux courbes douces. */
function smoothPath(ctrl,step){
  let n=ctrl.length, out=[];
  const P=i=>ctrl[((i%n)+n)%n];
  for(let i=0;i<n;i++){
    let p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
    let seg=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);
    let div=Math.max(4,Math.round(seg/(step||34)));
    for(let j=0;j<div;j++){
      let u=j/div, u2=u*u, u3=u2*u;
      let x=0.5*((2*p1[0])+(-p0[0]+p2[0])*u+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*u2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*u3);
      let y=0.5*((2*p1[1])+(-p0[1]+p2[1])*u+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*u2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*u3);
      out.push([x,y]);
    }
  }
  return out;
}
let racePath=[];   // polyligne dense effectivement utilisée (lissée ou brute)
let _grid=null;    // grille spatiale : cellule -> indices de segments proches
const GRID_CELL=160;
function buildTrackGeom(t){
  segs=[];trackLen=0;_grid=null;_bounds=null;
  racePath = t.smooth ? smoothPath(t.path,34) : t.path.slice();
  let p=racePath;
  for(let i=0;i<p.length;i++){
    let a=p[i], b=p[(i+1)%p.length];
    let dx=b[0]-a[0], dy=b[1]-a[1], len=Math.hypot(dx,dy)||1;
    segs.push({ax:a[0],ay:a[1],bx:b[0],by:b[1],dx:dx/len,dy:dy/len,len,acc:trackLen});
    trackLen+=len;
  }
  buildGrid();
}
/* Grille : chaque cellule liste les segments dont l'enveloppe (+marge) la touche.
   Permet à drawGroundMode7 de ne tester qu'une poignée de segments par point. */
function buildGrid(){
  _grid={};
  let pad=(track?track.width:150)*0.5+GRID_CELL;
  segs.forEach((s,idx)=>{
    let minx=Math.min(s.ax,s.bx)-pad,maxx=Math.max(s.ax,s.bx)+pad;
    let miny=Math.min(s.ay,s.by)-pad,maxy=Math.max(s.ay,s.by)+pad;
    for(let gx=Math.floor(minx/GRID_CELL);gx<=Math.floor(maxx/GRID_CELL);gx++)
      for(let gy=Math.floor(miny/GRID_CELL);gy<=Math.floor(maxy/GRID_CELL);gy++){
        let k=gx+','+gy;(_grid[k]||(_grid[k]=[])).push(idx);
      }
  });
}
/* distance latérale à la piste + prog, en ne testant que les segments de la
   cellule courante. Renvoie {off,prog} ; off=Infinity si hors piste connue. */
function roadAt(px,py){
  if(!_grid) return {off:1e9,prog:0};
  let k=Math.floor(px/GRID_CELL)+','+Math.floor(py/GRID_CELL);
  let list=_grid[k]; if(!list) return {off:1e9,prog:0};
  let best=1e9,prog=0;
  for(let j=0;j<list.length;j++){
    let s=segs[list[j]], vx=px-s.ax, vy=py-s.ay;
    let tt=clamp((vx*s.dx+vy*s.dy)/s.len,0,1);
    let cx=s.ax+s.dx*s.len*tt, cy=s.ay+s.dy*s.len*tt;
    let d=Math.hypot(px-cx,py-cy);
    if(d<best){best=d;prog=s.acc+s.len*tt;}
  }
  return {off:best,prog};
}
/* Projette (px,py) sur la piste → {prog: distance le long du tracé [0..trackLen],
   cx,cy: point le plus proche sur l'axe, off: distance latérale, dir: angle piste}. */
function projectToTrack(px,py){
  let best=1e9,res={prog:0,cx:px,cy:py,off:0,dir:0,seg:0};
  for(let i=0;i<segs.length;i++){
    let s=segs[i], vx=px-s.ax, vy=py-s.ay;
    let tt=clamp((vx*s.dx+vy*s.dy)/s.len,0,1);
    let cx=s.ax+s.dx*s.len*tt, cy=s.ay+s.dy*s.len*tt;
    let d=Math.hypot(px-cx,py-cy);
    if(d<best){best=d;res={prog:s.acc+s.len*tt,cx,cy,off:d,dir:Math.atan2(s.dy,s.dx),seg:i};}
  }
  return res;
}
/* point sur l'axe à une distance donnée (pour les guides IA) */
function pointAtProg(prog){
  prog=((prog%trackLen)+trackLen)%trackLen;
  for(let i=0;i<segs.length;i++){
    let s=segs[i];
    if(prog<=s.acc+s.len||i===segs.length-1){
      let tt=(prog-s.acc)/s.len; tt=clamp(tt,0,1);
      return {x:s.ax+s.dx*s.len*tt, y:s.ay+s.dy*s.len*tt, dir:Math.atan2(s.dy,s.dx)};
    }
  }
  return {x:segs[0].ax,y:segs[0].ay,dir:0};
}
function onRoad(px,py){return projectToTrack(px,py).off<=track.width*0.5+4;}

/* ════════ KART (physique arcade + drift) ════════ */
function makeKart(isPlayer,idx){
  let st=pointAtProg(0); // sur la ligne de départ
  // grille de départ : décalage le long de l'axe + latéral alterné
  let back=track.startGap*(idx+1)*0.55, side=((idx%2)?1:-1)*(track.width*0.22);
  let bp=pointAtProg(trackLen-back), nx=Math.cos(bp.dir+Math.PI/2), ny=Math.sin(bp.dir+Math.PI/2);
  // pilote : le joueur prend selectedDriver ; les IA piochent les autres en boucle.
  let driver = isPlayer ? DRIVERS[selectedDriver]
                        : DRIVERS[(selectedDriver+idx)%DRIVERS.length];
  return {
    isPlayer, idx, driver,
    x:bp.x+nx*side, y:bp.y+ny*side,
    a:bp.dir,                 // angle (rad)
    spd:0, vmax:4.0,          // vitesse
    drift:0, driftCharge:0, driftDir:0, hop:0,
    boost:0, boostMul:1, shield:0, magnet:0, grip:0, slip:0,
    item:null, useFlash:0,
    prog:0, lap:0, lastProg:0, rank:1, place:0,
    color:driver.kartColor,
    name:isPlayer?'TOI':driver.n,
    hit:0, finishTime:0, finished:false,
    aiTarget:0, aiSkill:0.82+idx*0.02, aiItemCd:rand(180,360), aiZ:rand(0,TAU)
  };
}

/* ──────────────────────────────────────────────────────────────────────
   BUSTE DU PILOTE (calqué sur drawHeroBody de Temple, simplifié pour un
   personnage ASSIS dans le kart : torse + bras + tête + cheveux + coiffe +
   visage). Dessine en repère local px (origine = bas du buste), y vers le HAUT
   négatif. `scale` est appliqué par l'appelant via X.scale. `facing` : 1 = on
   voit l'avant du pilote (vu de face), -1 = on voit l'arrière (casque/dos).
   ────────────────────────────────────────────────────────────────────── */
function shadeHex(c,f){ // éclaircit (f>0) / assombrit (f<0) un hex
  let r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);
  let k=f<0?(1+f):1, a=f>0?f:0;
  r=Math.round(r*k+255*a);g=Math.round(g*k+255*a);b=Math.round(b*k+255*a);
  r=clamp(r,0,255);g=clamp(g,0,255);b=clamp(b,0,255);
  return 'rgb('+r+','+g+','+b+')';
}
function drawDriverBust(d,facing,ctx){
  let g=ctx||X;
  let R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  let front=facing>0;
  let skin=d.skin, shirt=d.shirt, hatC=d.hat;
  let hairC=shadeHex(hatC,-0.1);
  // torse (épaules) — contour sombre + tissu + reflet
  R(-11,-6,22,16,'#1a1414');
  R(-9,-5,18,15,shirt);
  R(-9,-5,18,3,shadeHex(shirt,0.18));     // reflet épaule
  R(-9,7,18,3,shadeHex(shirt,-0.22));     // ombre bas
  // bras (sur le volant) — visibles de face
  R(-12,-2,4,9,skin);R(8,-2,4,9,skin);
  R(-12,5,4,3,shadeHex(shirt,-0.2));R(8,5,4,3,shadeHex(shirt,-0.2)); // manchettes
  // cou + tête
  R(-3,-9,6,4,shadeHex(skin,-0.12));
  R(-7,-22,14,14,skin);                    // crâne/visage
  R(-7,-22,14,2,shadeHex(skin,0.12));      // reflet front
  // cheveux (couvre l'arrière + frange selon coiffe)
  let covering={fedora:1,cap:1,helmet:1,straw:1,bandana:1,band:1,goggles:0}[d.hatType];
  if(!front){ R(-7,-22,14,11,hairC); }      // vu de dos : arrière du crâne
  else {
    if(covering){R(-7,-22,2,6,hairC);R(5,-22,2,6,hairC);}  // pattes
    else if(d.hair==='long'){R(-8,-23,16,5,hairC);R(-9,-19,3,12,hairC);R(7,-19,3,12,hairC);}
    else if(d.hair==='pony'){R(-8,-23,16,4,hairC);R(7,-21,3,9,hairC);}
    else if(d.hair==='bun'){R(-8,-23,16,4,hairC);R(-2,-26,4,4,hairC);}
    else if(d.hair==='curly'){R(-8,-24,16,5,hairC);R(-9,-20,3,5,hairC);R(7,-20,3,5,hairC);}
    else if(d.hair==='mohawk'){R(-2,-27,4,8,hairC);}
    else {R(-8,-23,16,4,hairC);R(-8,-20,2,5,hairC);R(6,-20,2,5,hairC);} // short
  }
  // coiffe / accessoire (couleur = hat)
  let h=-22, hatL=shadeHex(hatC,0.18);
  if(d.hatType==='fedora'){R(-8,h-3,16,3,hatC);R(-12,h,24,3,hatC);R(-8,h-3,16,1,hatL);}
  else if(d.hatType==='cap'){R(-8,h-3,16,4,hatC);if(front)R(-13,h+1,8,2,shadeHex(hatC,-0.25));R(-8,h-3,16,1,hatL);}
  else if(d.hatType==='helmet'){R(-9,h-3,18,6,hatC);R(-9,h-3,18,2,hatL);if(front){R(-7,h+2,14,3,'#9adfff');}}
  else if(d.hatType==='straw'){R(-8,h-2,16,3,hatC);R(-13,h+1,26,2,hatC);R(-8,h-2,16,1,shadeHex(hatC,-0.18));}
  else if(d.hatType==='bandana'){R(-8,h-2,16,4,hatC);if(front)R(5,h+2,3,6,shadeHex(hatC,-0.25));}
  else if(d.hatType==='band'){R(-8,h+1,16,3,hatC);}
  else if(d.hatType==='goggles'){R(-9,h-1,18,3,shadeHex(hatC,-0.2));if(front){R(-7,h+2,5,4,'#9adfff');R(2,h+2,5,4,'#9adfff');}}
  // visage (de face seulement)
  if(front){
    let ec='#171515', eyeY=-15;
    if(d.face==='cool'){R(-6,eyeY,5,3,ec);R(1,eyeY,5,3,ec);R(-1,eyeY+1,2,1,ec);}
    else if(d.face==='happy'){R(-5,eyeY,2,2,ec);R(3,eyeY,2,2,ec);R(-3,eyeY+4,6,1,'#9e5540');}
    else if(d.face==='angry'){R(-5,eyeY,2,2,ec);R(3,eyeY,2,2,ec);R(-6,eyeY-2,3,1,ec);R(3,eyeY-2,3,1,ec);}
    else if(d.face==='wink'){R(-5,eyeY,2,1,ec);R(3,eyeY,2,2,ec);R(-3,eyeY+3,6,1,'#9e5540');}
    else {R(-5,eyeY,2,2,ec);R(3,eyeY,2,2,ec);R(-3,eyeY+4,4,1,'#9e5540');}
  }
}

/* Avance physique d'un kart. throttle/steer dans [-1..1]. */
function physics(k,throttle,steer,dt){
  let baseMax=k.vmax*(k.boost>0?2:1)*k.boostMul;
  // zone scientifique sous le kart
  let zmult=1, slip=false;
  for(let z of zones){
    if(dist(k.x,k.y,z.x,z.y)<z.r){
      let zt=ZT[z.type]; if(!zt)continue;
      zmult*=zt.mult;
      if(zt.slip)slip=true;
      if(zt.killBoost&&k.boost>0){k.boost=0;k.boostMul=1;if(k.isPlayer)spawnFx(k.x,k.y,'zap');}
      if(zt.recharge&&k.isPlayer&&!k.item&&Math.random()<0.02)giveItem(k);
    }
  }
  // hors piste = forte pénalité (mais on reste contrôlable)
  let off=projectToTrack(k.x,k.y).off, offRoad=off>track.width*0.5+6;
  let targetMax=baseMax*zmult*(offRoad?0.45:1);
  // accélération / décélération
  if(throttle>0)k.spd=lerp(k.spd,targetMax,0.045*dt*throttle);
  else if(throttle<0)k.spd=lerp(k.spd,-targetMax*0.4,0.06*dt);
  else k.spd*=Math.pow(0.985,dt);
  k.spd=clamp(k.spd,-2,targetMax+0.01);
  // direction : sensibilité réduite à basse vitesse, drift élargit le rayon
  let grp=(k.grip>0?1.25:1)*(slip&&k.grip<=0?0.45:1);
  let turn=steer*0.052*dt*clamp(Math.abs(k.spd)/1.5,0.2,1)*grp;
  if(k.drift>0)turn*=1.55;
  k.a+=turn*(k.spd<0?-1:1);
  // déplacement
  let mvx=Math.cos(k.a)*k.spd*dt, mvy=Math.sin(k.a)*k.spd*dt;
  // glissement latéral en drift (donne le feeling de dérapage)
  if(k.drift>0){let s=Math.sin(k.a+k.driftDir*0.5);mvx+=Math.cos(k.a+Math.PI/2)*k.driftDir*k.spd*0.18*dt;mvy+=Math.sin(k.a+Math.PI/2)*k.driftDir*k.spd*0.18*dt;}
  k.x+=mvx;k.y+=mvy;
  // timers
  if(k.boost>0){k.boost-=dt;if(k.boost<=0)k.boostMul=1;}
  if(k.shield>0)k.shield-=dt;
  if(k.magnet>0)k.magnet-=dt;
  if(k.grip>0)k.grip-=dt;
  if(k.hit>0)k.hit-=dt;
  if(k.useFlash>0)k.useFlash-=dt;
  if(k.hop>0)k.hop=Math.max(0,k.hop-dt*1.2);   // décroissance du saut visuel de drift
}

/* ════════ DRIFT (mini-boost à la Mario Kart) ════════
   On charge le drift en tournant tout en accélérant + touche MAJ. Relâcher
   donne un boost proportionnel à la charge. */
function updateDrift(k,steer,throttle,driftBtn,dt){
  if(driftBtn&&throttle>0&&Math.abs(steer)>0.2&&Math.abs(k.spd)>1.6){
    if(k.drift<=0){k.drift=1;k.driftDir=steer>0?1:-1;k.driftCharge=0;k.hop=8;}
    k.driftCharge+=dt*(0.6+Math.abs(steer)*0.6);
  }else if(k.drift>0){
    // relâche : applique le boost selon la charge
    let c=k.driftCharge;
    if(c>34){k.boost=Math.min(60,18+c*0.4);k.boostMul=1.0;sfx.boost();spawnFx(k.x,k.y,'boost');}
    k.drift=0;k.driftCharge=0;
  }
}

/* ════════ ITEMS / BONUS ════════ */
function giveItem(k){
  if(k.item)return;
  let pool=track.itemPool||DATA.itemPool;
  k.item=pool[Math.floor(Math.random()*pool.length)];
  if(k.isPlayer){sfx.item();updateItemHud(true);}
}
function useItem(k){
  if(!k.item)return;
  let it=ITEMS[k.item], id=k.item; k.item=null;
  k.useFlash=14;
  if(k.isPlayer)updateItemHud(false);
  if(it.kind==='boost'){k.boost=it.dur;k.boostMul=it.power;sfx.boost();spawnFx(k.x,k.y,'boost');}
  else if(it.kind==='shield'){k.shield=it.dur;sfx.item();}
  else if(it.kind==='grip'){k.grip=it.dur;sfx.item();}
  else if(it.kind==='magnet'){k.magnet=it.dur;sfx.item();}
  else if(it.kind==='drop'){drops.push({x:k.x-Math.cos(k.a)*40,y:k.y-Math.sin(k.a)*40,trap:it.trap,life:600});sfx.item();}
  else if(it.kind==='beam'){ // ralentit le kart juste devant
    let tgt=kartAhead(k); if(tgt){tgt.spd*=0.4;tgt.hit=24;tgt.boost=0;tgt.boostMul=1;spawnFx(tgt.x,tgt.y,'zap');} sfx.hit();
  }
  else if(it.kind==='warp'){ // mini-portail : saute en avant sur la piste
    let np=pointAtProg(k.prog+260); k.x=np.x;k.y=np.y;k.a=np.dir; sfx.boost();spawnFx(np.x,np.y,'warp');
  }
}
function kartAhead(k){
  let best=null,bd=1e9;
  for(let o of karts){if(o===k)continue;let d=o.prog-k.prog;if(d<0)d+=trackLen;if(d<340&&d<bd){bd=d;best=o;}}
  return best;
}

/* ════════ IA ════════
   L'IA vise un point en avant sur l'axe, ajuste sa cible vers les box bonus
   proches, ralentit en touchant un piège et utilise ses items pour doubler. */
function updateAI(k,dt){
  let look=120+k.spd*30;
  let aim=pointAtProg(k.prog+look);
  // serpentin léger pour viser des box voisines / sembler vivant
  k.aiZ+=0.03*dt;
  let nx=Math.cos(aim.dir+Math.PI/2), ny=Math.sin(aim.dir+Math.PI/2);
  let wob=Math.sin(k.aiZ)*track.width*0.18*(1-k.aiSkill);
  let tx=aim.x+nx*wob, ty=aim.y+ny*wob;
  // cible une box bonus proche si pas d'item
  if(!k.item){
    for(let b of boxes){if(b.t>0)continue;let d=dist(k.x,k.y,b.x,b.y);if(d<150&&onRoad(b.x,b.y)){tx=b.x;ty=b.y;break;}}
  }
  let desired=Math.atan2(ty-k.y,tx-k.x);
  let diff=((desired-k.a+Math.PI)%TAU)-Math.PI;
  let steer=clamp(diff/0.5,-1,1);
  let throttle=1;
  // freine un peu dans les virages serrés
  if(Math.abs(diff)>0.9)throttle=0.55;
  let diffMul=settings.diff==='FACILE'?0.92:settings.diff==='DIFFICILE'?1.06:1;
  k.vmax=4.0*k.aiSkill*diffMul;
  physics(k,throttle,steer,dt);
  // drift auto dans les virages prononcés
  updateDrift(k,steer,throttle,Math.abs(diff)>0.7&&k.spd>2,dt);
  // utilise un item de temps en temps
  k.aiItemCd-=dt;
  if(k.item&&k.aiItemCd<=0){useItem(k);k.aiItemCd=rand(220,420);}
  else if(!k.item&&Math.random()<0.004)k.aiItemCd=Math.min(k.aiItemCd,40);
}

/* ════════ COLLISIONS ════════ */
function collide(dt){
  // kart ↔ kart
  for(let i=0;i<karts.length;i++)for(let j=i+1;j<karts.length;j++){
    let a=karts[i],b=karts[j],d=dist(a.x,a.y,b.x,b.y);
    if(d<30&&d>0.01){
      let ox=(a.x-b.x)/d,oy=(a.y-b.y)/d,push=(30-d)/2;
      a.x+=ox*push;a.y+=oy*push;b.x-=ox*push;b.y-=oy*push;
      let avg=(a.spd+b.spd)/2;a.spd=a.spd*0.6+avg*0.2;b.spd=b.spd*0.6+avg*0.2;
      if((a.isPlayer||b.isPlayer)&&a.hit<=0&&b.hit<=0){sfx.hit();(a.isPlayer?a:b).hit=10;cam.shake=settings.shake?5:0;}
    }
  }
  // kart ↔ box bonus
  for(let k of karts)for(let b of boxes){
    if(b.t>0)continue;
    if(dist(k.x,k.y,b.x,b.y)<26){b.t=240;giveItem(k);if(k.isPlayer)sfx.box();spawnFx(b.x,b.y,'box');}
  }
  // kart ↔ obstacle fixe
  for(let k of karts)for(let o of obstacles){
    let r=(o.r||20);
    if(dist(k.x,k.y,o.x,o.y)<r+14){
      if(k.shield>0)continue;
      if(o.type==='puddle'){k.spd*=Math.pow(0.92,dt);}      // flaque = ralentit doux
      else{ if(k.hit<=0){k.spd*=0.45;k.hit=18;if(k.isPlayer){sfx.hit();cam.shake=settings.shake?6:0;}} }
    }
  }
  // kart ↔ mobile
  for(let k of karts)for(let m of movers){
    if(dist(k.x,k.y,m.x,m.y)<24&&k.shield<=0&&k.hit<=0){k.spd*=0.4;k.hit=20;if(k.isPlayer){sfx.hit();cam.shake=settings.shake?6:0;}}
  }
  // kart ↔ flaque posée
  for(let k of karts)for(let d of drops){
    if(dist(k.x,k.y,d.x,d.y)<24&&k.shield<=0&&k.hit<=0){k.spd*=0.4;k.hit=18;if(k.isPlayer){sfx.hit();cam.shake=settings.shake?5:0;}}
  }
}

/* ════════ PROGRESSION / TOURS / CLASSEMENT ════════ */
function updateProgress(k){
  let pr=projectToTrack(k.x,k.y).prog;
  // détecte le passage de la ligne (wrap autour de 0)
  let d=pr-k.lastProg;
  if(d<-trackLen*0.5){ // a franchi la ligne dans le bon sens
    k.lap++;
    k._scFlag={}; // réinitialise les raccourcis pour le nouveau tour
    if(k.isPlayer){
      if(k.lap<track.laps){sfx.lap();bigMsg('TOUR '+(k.lap+1),true);}
    }
    if(k.lap>=track.laps&&!k.finished){
      k.finished=true;k.finishTime=raceTime;finishOrder.push(k);
      if(k.isPlayer)endRace();
    }
  }else if(d>trackLen*0.5){ // a reculé sur la ligne → annule
    k.lap=Math.max(0,k.lap-1);
  }
  k.lastProg=pr;
  k.prog=k.lap*trackLen+pr;
}
function computeRanks(){
  let order=karts.slice().sort((a,b)=>{
    if(a.finished&&b.finished)return a.finishTime-b.finishTime;
    if(a.finished)return -1; if(b.finished)return 1;
    return b.prog-a.prog;
  });
  order.forEach((k,i)=>k.place=i+1);
  return order;
}

/* ════════ FX & FLOTTEURS ════════ */
function spawnFx(x,y,kind){
  let cols={box:'#ffe35b',boost:'#ff8b2a',zap:'#ff5a5a',warp:'#b06bff',spark:'#ffd24a'};
  for(let i=0;i<10;i++)fx.push({x,y,vx:rand(-2,2),vy:rand(-2,2),life:rand(16,28),col:cols[kind]||'#fff'});
}
function bigMsg(txt,small){
  let el=document.querySelector('#bigMsg');el.textContent=txt;
  el.className='bigMsg'+(small?' sm':'');void el.offsetWidth;el.classList.remove('hidden');
  el.style.animation='none';void el.offsetWidth;el.style.animation='';
  clearTimeout(bigMsg._t);bigMsg._t=setTimeout(()=>el.classList.add('hidden'),1100);
}

/* ════════════════════════════════════════════════════════════════════════
   RENDU MODE 7 / PSEUDO-3D (façon Mario Kart SNES / MK7)
   La caméra est BASSE et placée DERRIÈRE le kart ; le sol fuit vers un horizon.
   Chaque point monde (wx,wy) est : 1) ramené dans le repère caméra (rotation
   autour du point de visée), 2) projeté en perspective (division par la
   profondeur). La physique reste en coordonnées monde 2D ; seul le rendu change.
   ════════════════════════════════════════════════════════════════════════ */
// focal ×2 (canvas 1280×720) ; height ~inchangé pour garder le même champ de vision
// (depth = height*focal/dy ; dy double avec H, donc height*focal doit ~doubler) ;
// back en unités monde.
const CAM = { back:160, height:120, focal:520, lift:1.0 };  // réglages caméra
let horizonY = H*0.40;   // ligne d'horizon à l'écran

/* projette un point monde -> écran. Retourne null si derrière la caméra. */
function project(wx,wy){
  // position de l'œil : reculée de CAM.back derrière le point de visée cam(x,y)
  let ca=Math.cos(cam.a), sa=Math.sin(cam.a);
  let ex=cam.x-ca*CAM.back, ey=cam.y-sa*CAM.back;
  let dx=wx-ex, dy=wy-ey;
  // repère caméra : forward = +depth (sens de visée), right = latéral
  let depth = dx*ca + dy*sa;          // distance devant l'œil
  if(depth<=12) return null;          // derrière / trop près
  let right = -dx*sa + dy*ca;
  let inv = CAM.focal/depth;
  let sx = W/2 + right*inv;
  let sy = horizonY + (CAM.height*inv);   // le sol est SOUS l'horizon
  return { x:sx, y:sy, s:inv, depth };
}

function render(){
  let shx=(settings.shake&&cam.shake>0)?rand(-cam.shake,cam.shake):0;
  let shy=(settings.shake&&cam.shake>0)?rand(-cam.shake,cam.shake):0;
  X.save();X.translate(shx,shy);
  drawSky();
  drawGroundMode7();
  // éléments du monde projetés et triés par profondeur (peintre : loin -> près)
  let items=[];
  collectSprites(items);
  items.sort((a,b)=>b.depth-a.depth);
  items.forEach(it=>it.draw(it));
  X.restore();
  drawSpeedLines();
  drawVignette();
}
/* lignes de fuite radiales depuis le centre : intensité selon vitesse/boost.
   Renforce la sensation de vitesse façon Mode 7. */
function drawSpeedLines(){
  if(!player)return;
  let v=Math.abs(player.spd)/player.vmax;          // 0..~1+
  let boost=player.boost>0?1:0;
  let intensity=clamp((v-0.55)/0.45,0,1)*0.5 + boost*0.5;
  if(intensity<=0.02)return;
  let cx=W/2, cy=horizonY+(H-horizonY)*0.55;        // foyer un peu sous l'horizon
  X.save();
  X.strokeStyle='rgba(255,255,255,'+(0.10+intensity*0.22)+')';
  X.lineWidth=2;
  let n=boost?22:14;
  for(let i=0;i<n;i++){
    let ang=(i/n)*TAU + raceTime*1.5;
    let r0=H*0.30, r1=H*0.85;
    X.beginPath();
    X.moveTo(cx+Math.cos(ang)*r0, cy+Math.sin(ang)*r0);
    X.lineTo(cx+Math.cos(ang)*r1, cy+Math.sin(ang)*r1);
    X.stroke();
  }
  // teinte chaude pendant le boost
  if(boost){
    let g=X.createRadialGradient(cx,cy,H*0.2,cx,cy,H*0.7);
    g.addColorStop(0,'rgba(255,180,60,0)');
    g.addColorStop(1,'rgba(255,140,30,'+(0.12*intensity)+')');
    X.fillStyle=g;X.fillRect(0,0,W,H);
  }
  X.restore();
}
/* Ciel : dégradé doux + soleil diffus + nuages qui dérivent LENTEMENT et de
   façon INDÉPENDANTE de la vitesse (uniquement le temps + un léger parallaxe
   sur l'angle caméra pour la cohérence quand on tourne). Silhouette de collines
   ondulées au loin pour donner du relief, sans arbres. */
function drawSky(){
  // ── ciel bleu dégradé ──
  let g=X.createLinearGradient(0,0,0,horizonY+8);
  g.addColorStop(0,'#4aa6e0');g.addColorStop(0.55,'#86c9ee');g.addColorStop(1,'#d4ecfb');
  X.fillStyle=g;X.fillRect(0,0,W,horizonY+4);
  // soleil diffus haut-droite
  let sun=X.createRadialGradient(W*0.76,horizonY*0.30,10,W*0.76,horizonY*0.30,200);
  sun.addColorStop(0,'rgba(255,250,220,.75)');sun.addColorStop(1,'rgba(255,250,220,0)');
  X.fillStyle=sun;X.fillRect(W*0.76-200,horizonY*0.30-200,400,400);
  // léger panoramique quand on tourne (faible, pour ne pas "voler")
  let pan=(cam.a*180/Math.PI)*4;
  // ── collines ondulées lointaines (silhouette douce, donne du relief) ──
  drawHills(pan*0.4, horizonY, 78, '#8fb7d8', 0.55);   // crête lointaine bleutée (brume)
  drawHills(pan*0.7, horizonY, 52, '#79b06a', 1);      // crête proche verte
  // ── nuages doux (dérive temporelle indépendante de la vitesse) ──
  let drift=(raceTime*8) + pan*0.2;
  for(let i=0;i<5;i++){
    let baseX=((i*340 - drift) % (W+340) + (W+340)) % (W+340) - 170;
    let cy=horizonY*0.26 + (i*53)%70;
    drawCloud(baseX, cy, 0.8+((i*7)%4)*0.12);
  }
  // liseré d'horizon
  X.fillStyle='rgba(40,80,60,.35)';X.fillRect(0,horizonY-1,W,3);
}
/* silhouette de collines ondulées (somme de sinusoïdes) remplie sous l'horizon. */
function drawHills(off, baseY, amp, col, alpha){
  X.save();X.globalAlpha=alpha;X.fillStyle=col;
  X.beginPath();X.moveTo(0,baseY+4);
  for(let x=0;x<=W;x+=16){
    let p=(x+off)*0.0045;
    let y=baseY - (Math.sin(p)*0.6 + Math.sin(p*2.3+1.7)*0.3 + Math.sin(p*0.7)*0.5)*amp*0.5 - amp*0.25;
    X.lineTo(x,y);
  }
  X.lineTo(W,baseY+4);X.closePath();X.fill();X.restore();
}
/* nuage doux (boursouflures arrondies, sans gros pixels). */
function drawCloud(x,y,s){
  X.save();X.globalAlpha=0.9;X.fillStyle='#ffffff';
  let puffs=[[0,0,30],[26,4,22],[-24,5,20],[12,-12,20],[-10,-9,17]];
  for(let p of puffs){X.beginPath();X.ellipse(x+p[0]*s,y+p[1]*s,p[2]*s,p[2]*s*0.7,0,0,TAU);X.fill();}
  // base légèrement ombrée
  X.globalAlpha=0.25;X.fillStyle='#bcd4e6';
  X.beginPath();X.ellipse(x,y+8*s,38*s,9*s,0,0,TAU);X.fill();
  X.restore();
}
function drawVignette(){
  let g=X.createRadialGradient(W/2,H*0.6,H*0.36,W/2,H*0.6,H*0.95);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(1,'rgba(8,14,22,.4)');
  X.fillStyle=g;X.fillRect(0,0,W,H);
}
/* ──────────────────────────────────────────────────────────────────────
   SOL MODE 7 par balayage de scanlines. Pour chaque ligne d'écran sous
   l'horizon on calcule la profondeur, puis on remonte vers le monde pour
   échantillonner carrelage / pelouse / route avec damier, kerbs, marquages.
   ────────────────────────────────────────────────────────────────────── */
function drawGroundMode7(){
  let ca=Math.cos(cam.a), sa=Math.sin(cam.a);
  let ex=cam.x-ca*CAM.back, ey=cam.y-sa*CAM.back;
  // palette type Mario Circuit : pelouse verte unie, asphalte gris, kerbs rouge/blanc.
  let grassA=track.grass?track.grass[0]:'#5fb84a', grassB=track.grass?track.grass[1]:'#54ad40';
  let kerbA=track.kerb?track.kerb[0]:'#e23b32', kerbB=track.kerb?track.kerb[1]:'#f4f4f4';
  let road=track.road||'#8a8f99', roadHi=track.roadHi||'#9aa0aa';
  // raster fin = bien moins pixellisé (et lissé par imageSmoothing)
  const STEP=2, COLW=4, HW=track.width*0.5, FOG=4600;
  // bandes de pelouse plus larges et douces (pas de damier serré) : rayures qui défilent
  for(let sy=Math.floor(horizonY)+1; sy<H; sy+=STEP){
    let dy=sy-horizonY; if(dy<1) dy=1;
    let depth=CAM.height*CAM.focal/dy;
    if(depth>FOG){continue;}
    let cx=ex+ca*depth, cy=ey+sa*depth;
    let wpx=depth/CAM.focal;
    let rx=-sa, ry=ca;
    let fogT=clamp(depth/FOG,0,1);
    let fog=1-fogT*fogT;
    let shade=0.62+0.38*fog;
    for(let px=0; px<W; px+=COLW){
      let off=(px+COLW/2-W/2)*wpx;
      let mx=cx+rx*off, my=cy+ry*off;
      let pr=roadAt(mx,my), d=pr.off;
      let edge=HW-d;                    // >0 dans la route, distance au bord
      let col;
      if(d<=HW){
        // ── ROUTE ──
        if(edge<34){
          // KERB damier rouge/blanc large et net, tout le long de la piste
          let along=Math.floor(pr.prog/26)&1;
          col=along?kerbA:kerbB;
        }else{
          // asphalte avec léger bombé central + ligne médiane blanche pointillée
          let ad=Math.abs(d);
          if(ad<5 && (Math.floor(pr.prog/40)%2===0)) col='#f4f4f4';   // ligne médiane
          else col = ad<HW*0.45 ? roadHi : road;                      // centre un peu plus clair
        }
      }else{
        // ── PELOUSE : deux verts en larges bandes douces (le long de la piste) ──
        let band=Math.floor(pr.prog/64)&1;
        col=band?grassA:grassB;
        // fine bande d'ombre juste au pied du kerb (donne du volume au bord)
        if(d-HW<10) col=shadeColor(grassB,0.78);
      }
      X.fillStyle=shadeColor(col,shade);
      X.fillRect(px,sy,COLW+1,STEP+1);
    }
  }
  // brume d'horizon : dégradé doux qui fond le sol lointain dans le ciel
  let hz=X.createLinearGradient(0,horizonY,0,horizonY+70);
  hz.addColorStop(0,'rgba(212,236,251,0.55)');   // raccord avec le bas du ciel
  hz.addColorStop(1,'rgba(212,236,251,0)');
  X.fillStyle=hz;X.fillRect(0,horizonY,W,70);
}
/* assombrit une couleur hex/rgba par un facteur (0..1). */
const _shadeCache={};
function shadeColor(c,f){
  let key=c+'|'+(f*20|0);
  if(_shadeCache[key])return _shadeCache[key];
  let r,g,b,a=1;
  if(c[0]==='#'){r=parseInt(c.slice(1,3),16);g=parseInt(c.slice(3,5),16);b=parseInt(c.slice(5,7),16);}
  else{let m=c.match(/[\d.]+/g);r=+m[0];g=+m[1];b=+m[2];a=m[3]!==undefined?+m[3]:1;}
  r=Math.min(255,Math.round(r*f));g=Math.min(255,Math.round(g*f));b=Math.min(255,Math.round(b*f));
  let out='rgba('+r+','+g+','+b+','+a+')';_shadeCache[key]=out;return out;
}
function closeForSmooth(p){return p;}
function pathTrace(p){X.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)X.lineTo(p[i][0],p[i][1]);X.closePath();}
function pathTraceOpen(p){X.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)X.lineTo(p[i][0],p[i][1]);}
/* ──────────────────────────────────────────────────────────────────────
   COLLECTE DES SPRITES MODE 7
   Chaque élément du monde est projeté via project() ; on empile un billboard
   { depth, draw } puis on trie loin→près (peintre) dans render().
   - décals au sol (zones, flaques, ligne d'arrivée) : quad projeté collé au sol
   - billboards verticaux (box, cônes, fioles, décor, karts) : redressés à
     l'écran, échelle = proj.s (perspective). On dessine vers le HAUT depuis le
     point de contact au sol.
   ────────────────────────────────────────────────────────────────────── */

/* Décal au sol : losange projeté (4 coins monde -> écran) rempli d'une couleur. */
function groundDecal(wx,wy,rx,ry,col,alpha){
  let p0=project(wx-rx,wy-ry),p1=project(wx+rx,wy-ry),p2=project(wx+rx,wy+ry),p3=project(wx-rx,wy+ry);
  if(!p0||!p1||!p2||!p3)return;
  X.globalAlpha=alpha==null?1:alpha;X.fillStyle=col;
  X.beginPath();X.moveTo(p0.x,p0.y);X.lineTo(p1.x,p1.y);X.lineTo(p2.x,p2.y);X.lineTo(p3.x,p3.y);X.closePath();X.fill();
  X.globalAlpha=1;
}

function collectSprites(items){
  // ── ligne d'arrivée (damier collé au sol, projeté en perspective) ──
  let s=segs[0];
  if(s){
    let pr=project(s.ax,s.ay);
    if(pr) items.push({depth:pr.depth,draw:()=>{
      let dx=s.dx, dy=s.dy;          // direction piste (unitaire)
      let nx=-dy, ny=dx;             // normale (sens latéral, largeur)
      let w=track.width, n=8, c=w/n, rows=4, cell=14;
      for(let r=0;r<rows;r++)for(let i=0;i<n;i++){
        let along=(r-rows/2+0.5)*cell;   // le long de la piste
        let lat=(i-n/2+0.5)*c;           // en travers
        let cxw=s.ax+dx*along+nx*lat;
        let cyw=s.ay+dy*along+ny*lat;
        let q=project(cxw,cyw); if(!q)continue;
        X.fillStyle=((i+r)&1)?'#f4f6fa':'#15171c';
        let sz=Math.max(2,c*q.s);
        X.fillRect(q.x-sz/2,q.y-sz/2,sz+1,sz+1);
      }
    }});
  }
  // ── zones scientifiques (disque coloré au sol + pictos) ──
  zones.forEach(z=>{
    let pr=project(z.x,z.y); if(!pr)return;
    let zt=ZT[z.type]; if(!zt)return;
    items.push({depth:pr.depth+4,draw:()=>{   // +4 : sous les objets posés dessus
      groundDecal(z.x,z.y,z.r,z.r,zt.color,0.5);
      // anneau de contour
      let top=project(z.x,z.y-z.r),bot=project(z.x,z.y+z.r);
      if(top&&bot){X.strokeStyle='rgba(13,20,28,.7)';X.lineWidth=Math.max(1,2*pr.s);
        X.beginPath();X.ellipse(pr.x,(top.y+bot.y)/2,Math.abs(project(z.x+z.r,z.y).x-pr.x),Math.abs(bot.y-top.y)/2,0,0,TAU);X.stroke();}
      // pictos animés selon l'effet
      X.globalAlpha=0.8;X.fillStyle='#0d141c';
      let a=raceTime*2;
      if(zt.fx==='spark'||zt.fx==='zap'){for(let i=0;i<5;i++){let q=project(z.x+Math.cos(i+a)*z.r*0.5,z.y+Math.sin(i*1.7+a)*z.r*0.5);if(q){let sz=Math.max(1,3*q.s);X.fillRect(q.x-sz/2,q.y-sz/2,sz,sz);}}}
      if(zt.fx==='fizz'){for(let i=0;i<6;i++){let q=project(z.x+Math.cos(i*1.3+a)*z.r*0.6,z.y+Math.sin(i*2.1+a)*z.r*0.6);if(q){let sz=Math.max(1,3*q.s);X.fillRect(q.x-sz/2,q.y-sz/2,sz,sz);}}}
      if(zt.fx==='shine'){for(let i=0;i<4;i++){let q=project(z.x+Math.cos(i+a*0.6)*z.r*0.4,z.y+Math.sin(i+a*0.6)*z.r*0.4);if(q){X.fillStyle='rgba(255,240,180,.7)';let sz=Math.max(1,4*q.s);X.fillRect(q.x-sz/2,q.y-sz/2,sz,sz);}}}
      X.globalAlpha=1;
    }});
  });
  // ── flaques posées (drops dynamiques) ──
  drops.forEach(d=>{
    let pr=project(d.x,d.y); if(!pr)return;
    items.push({depth:pr.depth+3,draw:()=>{
      groundDecal(d.x,d.y,20,14,'rgba(123,201,74,.6)');
      groundDecal(d.x-5,d.y-3,7,5,'rgba(180,240,140,.6)');
    }});
  });
  // ── box bonus "?" (billboard flottant) ──
  boxes.forEach(b=>{
    if(b.t>0)return;
    let pr=project(b.x,b.y); if(!pr)return;
    items.push({depth:pr.depth,draw:()=>{
      let t=raceTime+b.x*0.01, bob=Math.sin(t*3)*4;
      groundShadow(pr,14,5);
      billboard(pr, 30, 30, bob+18, (s)=>{ // s = échelle px monde->écran déjà appliquée
        let q=15;
        X.fillStyle='#0c1118';X.fillRect(-q-1,-q-1,2*q+2,2*q+2);
        X.fillStyle='#ffd24a';X.fillRect(-q,-q,2*q,2*q);
        X.fillStyle='#ffe9a0';X.fillRect(-q,-q,2*q,5);
        X.fillStyle='#e08a1a';X.fillRect(-q,q-5,2*q,5);
        X.fillStyle='#b3531a';X.fillRect(-5,-8,10,3);X.fillRect(2,-8,3,7);X.fillRect(-2,-2,5,3);X.fillRect(-1,4,3,3);
        X.fillStyle='#fff3c4';X.fillRect(-q+2,-q+2,3,3);
      });
    }});
  });
  // ── obstacles (cônes, fioles, bidons : billboards ; flaques : décals) ──
  obstacles.forEach(o=>{
    let pr=project(o.x,o.y); if(!pr)return;
    if(o.type==='puddle'){
      items.push({depth:pr.depth+3,draw:()=>{groundDecal(o.x,o.y,o.r||20,(o.r||20)*0.6,'rgba(120,200,90,.55)');groundDecal(o.x-6,o.y-4,(o.r||20)*0.3,(o.r||20)*0.18,'rgba(200,240,160,.5)');}});
      return;
    }
    items.push({depth:pr.depth,draw:()=>{
      groundShadow(pr,12,4);
      if(o.type==='cone'){
        billboard(pr,26,34,0,()=>{
          X.fillStyle='#e8650f';X.beginPath();X.moveTo(0,-18);X.lineTo(11,14);X.lineTo(-11,14);X.fill();
          X.fillStyle='#ff8b3d';X.beginPath();X.moveTo(0,-18);X.lineTo(4,-6);X.lineTo(-4,-6);X.fill();
          X.fillStyle='#fff';X.fillRect(-8,0,16,4);
          X.fillStyle='#15171c';X.fillRect(-12,14,24,4);
        });
      } else if(o.type==='beaker'){
        billboard(pr,20,36,0,()=>{
          X.fillStyle='#cdeef2';X.fillRect(-8,-22,16,24);X.fillStyle='#7ec96f';X.fillRect(-8,-8,16,10);
          X.fillStyle='#a0e36b';X.fillRect(-8,-8,16,3);X.fillStyle='#eaf8ff';X.fillRect(-6,-22,4,22);X.fillStyle='#dff7ee';X.fillRect(-7,-26,14,5);
        });
      } else if(o.type==='oildrum'){
        billboard(pr,30,40,0,()=>{
          X.fillStyle='#c0532a';X.fillRect(-14,-34,28,34);X.fillStyle='#d86c3e';X.fillRect(-14,-34,28,4);
          X.fillStyle='#ffd24a';X.fillRect(-14,-20,28,7);X.fillStyle='#101820';X.fillRect(-7,-19,3,5);X.fillRect(0,-19,3,5);
          X.fillStyle='rgba(255,255,255,.2)';X.fillRect(-11,-30,4,26);
        });
      }
    }});
  });
  // ── chariots mobiles (billboards) ──
  movers.forEach(m=>{
    let pr=project(m.x,m.y); if(!pr)return;
    items.push({depth:pr.depth,draw:()=>{
      groundShadow(pr,18,5);
      billboard(pr,36,30,0,()=>{
        X.fillStyle='#9aa4b0';X.fillRect(-17,-26,34,26);X.fillStyle='#b4bec8';X.fillRect(-17,-26,34,5);
        X.fillStyle='#ffd24a';X.fillRect(-15,-16,30,5);X.fillStyle='#e7453b';X.fillRect(-15,-9,30,3);
        X.fillStyle='#101820';X.fillRect(-14,-3,9,6);X.fillRect(5,-3,9,6);
      });
    }});
  });
  // ── décor volumétrique ──
  decor.forEach(d=>{
    let pr=project(d.x,d.y); if(!pr)return;
    items.push({depth:pr.depth,draw:()=>drawDecorSprite(d,pr)});
  });
  // ── particules fx (billboards minuscules) ──
  fx.forEach(p=>{
    let pr=project(p.x,p.y); if(!pr)return;
    items.push({depth:pr.depth-2,draw:()=>{X.globalAlpha=clamp(p.life/24,0,1);X.fillStyle=p.col;let sz=Math.max(1,3*pr.s);X.fillRect(pr.x-sz/2,pr.y-sz/2,sz,sz);X.globalAlpha=1;}});
  });
  // ── karts ──
  karts.forEach(k=>{
    let pr=project(k.x,k.y); if(!pr)return;
    items.push({depth:pr.depth,draw:()=>drawKartSprite(k,pr)});
  });
}

/* ombre au sol projetée sous un billboard. */
function groundShadow(pr,w,h){
  X.fillStyle='rgba(0,0,0,.25)';X.beginPath();
  X.ellipse(pr.x,pr.y,Math.max(2,w*pr.s),Math.max(1,h*pr.s),0,0,TAU);X.fill();
}
/* dessine un billboard redressé : translate au point sol projeté, échelle = pr.s,
   décalage vertical 'lift' (px monde) vers le haut. cb dessine en repère local px. */
function billboard(pr,w,h,lift,cb){
  X.save();
  X.translate(pr.x, pr.y - lift*pr.s);
  X.scale(pr.s,pr.s);
  cb(pr.s);
  X.restore();
}
/* bloc pixel-art 3 niveaux (repère local, y vers le haut conventionnel) */
function blk(x,y,w,h,base,hi,sh){
  X.fillStyle=sh||'rgba(0,0,0,.25)';X.fillRect(x,y,w,h);
  X.fillStyle=base;X.fillRect(x,y,w,h-3);
  if(hi){X.fillStyle=hi;X.fillRect(x,y,w,3);}
}

/* DÉCOR en billboard volumétrique : la base touche le sol (y=0), on monte (y<0). */
function drawDecorSprite(d,pr){
  groundShadow(pr,(d.w||40)*0.5+8,10);
  billboard(pr,d.w||40,d.h||40,0,()=>{
    let w=d.w||40,h=d.h||40;
    if(d.type==='bench'){
      blk(-w/2,-h,w,h,'#6a7e98','#8aa0bc');
      X.fillStyle='#3a4a60';X.fillRect(-w/2,-7,w,7);
      X.fillStyle='#8be9ef';X.fillRect(-w/2+8,-h+4,9,9);
      X.fillStyle='#ffd24a';X.fillRect(-w/2+24,-h+5,7,8);
      X.fillStyle='#ff6b6b';X.fillRect(w/2-20,-h+5,7,8);
    }
    else if(d.type==='shelf'){
      blk(-w/2,-h,w,h,'#7a5430','#9c6e3e');
      for(let i=0;i<4;i++){X.fillStyle=['#ff6b6b','#7ec96f','#4fa3e6','#ffd24a'][i];X.fillRect(-w/2+8+i*34,-h+8,18,16);X.fillStyle='rgba(255,255,255,.4)';X.fillRect(-w/2+8+i*34,-h+8,18,4);}
    }
    else if(d.type==='fumehood'){
      blk(-38,-80,76,80,'#5a6678','#76849a');
      X.fillStyle='#101820';X.fillRect(-32,-74,64,44);
      X.fillStyle='#2bb6c8';X.fillRect(-30,-72,60,40);X.fillStyle='rgba(255,255,255,.25)';X.fillRect(-30,-72,60,8);
      X.fillStyle='#ffd24a';X.fillRect(-30,-16,60,5);
    }
    else if(d.type==='lockers'){
      for(let i=0;i<3;i++){blk(-33+i*22,-76,20,76,i&1?'#3f6e8c':'#4a7e9c','#5f9fc0');X.fillStyle='#101820';X.fillRect(-26+i*22,-58,6,6);}
    }
    else if(d.type==='cabinet'){
      blk(-28,-72,56,72,'#c0532a','#d86c3e');
      X.fillStyle='#101820';X.fillRect(-2,-44,4,18);
      X.fillStyle='#ffd24a';X.fillRect(-22,-66,16,8);X.fillRect(6,-66,16,8);
    }
    else if(d.type==='microscope'){
      blk(-16,-18,32,18,'#3a4452','#525c6c');
      X.fillStyle='#6a7888';X.fillRect(-6,-52,12,36);
      X.fillStyle='#101820';X.fillRect(-10,-60,20,12);
      X.fillStyle='#8be9ef';X.fillRect(-3,-48,6,10);
    }
    else if(d.type==='centrifuge'){
      blk(-22,-44,44,44,'#dfe6ec','#ffffff');
      X.fillStyle='#2bb6c8';X.fillRect(-16,-38,32,18);
      X.fillStyle='#101820';X.fillRect(-16,-16,32,6);
      X.fillStyle='#ff6b6b';X.fillRect(-14,-36,5,5);
    }
    else if(d.type==='whiteboard'){
      blk(-48,-56,96,56,'#eef3ff','#ffffff');
      X.strokeStyle='#3a4452';X.lineWidth=3;X.strokeRect(-48,-56,96,56);
      X.fillStyle='#4fa3e6';X.fillRect(-40,-46,40,4);X.fillStyle='#ff6b6b';X.fillRect(-40,-36,28,4);X.fillStyle='#7ec96f';X.fillRect(-40,-26,34,4);
    }
    else if(d.type==='screen'){
      blk(-32,-48,64,48,'#101820','#2a3340');
      X.fillStyle='#1b9fd8';X.fillRect(-27,-43,54,38);
      X.fillStyle='#8be9ef';X.fillRect(-23,-37,30,4);X.fillRect(-23,-29,22,4);X.fillRect(-23,-21,26,4);
      X.fillStyle='rgba(255,255,255,.2)';X.fillRect(-27,-43,54,8);
    }
    else if(d.type==='pipes'){
      X.fillStyle='#6a747f';X.fillRect(-44,-16,88,12);
      X.fillStyle='#8a949f';X.fillRect(-44,-16,88,5);
      X.fillStyle='#b04030';X.fillRect(-8,-28,14,32);X.fillStyle='#d8604a';X.fillRect(-8,-28,14,4);
      X.fillStyle='#3a4452';X.fillRect(-30,-18,5,16);X.fillRect(22,-18,5,16);
    }
    else if(d.type==='barrel'){
      blk(-16,-40,32,40,'#3f7e4a','#52a05f');
      X.fillStyle='#101820';X.fillRect(-16,-26,32,4);X.fillRect(-16,-14,32,4);
      X.fillStyle='#ffd24a';X.fillRect(-9,-35,18,12);X.fillStyle='#101820';X.fillRect(-2,-33,4,8);
    }
    else if(d.type==='plant'){
      X.fillStyle='#7a5430';X.fillRect(-9,-15,18,15);X.fillStyle='#9c6e3e';X.fillRect(-9,-15,18,4);
      X.fillStyle='#2f7e3a';X.beginPath();X.arc(0,-22,17,0,TAU);X.fill();
      X.fillStyle='#52b567';X.beginPath();X.arc(-6,-28,10,0,TAU);X.fill();
      X.fillStyle='#7ed87f';X.beginPath();X.arc(5,-26,7,0,TAU);X.fill();
    }
    else if(d.type==='crate'){
      blk(-16,-32,32,32,'#9c6e3e','#b8854c');
      X.strokeStyle='#5a3c20';X.lineWidth=3;X.strokeRect(-16,-32,32,29);
      X.beginPath();X.moveTo(-16,-32);X.lineTo(16,-3);X.moveTo(16,-32);X.lineTo(-16,-3);X.stroke();
    }
  });
}

/* KART en billboard pseudo-3D 3/4 : on choisit la "vue" selon l'angle relatif
   entre le cap du kart et la caméra (arrière / 3-4 arrière / profil / avant). */
function drawKartSprite(k,pr){
  // ombre douce dégradée (au lieu d'une ellipse plate)
  let sw=Math.max(2,17*pr.s), sh=Math.max(1,8*pr.s);
  let sg=X.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,sw);
  sg.addColorStop(0,'rgba(0,0,0,.34)');sg.addColorStop(1,'rgba(0,0,0,0)');
  X.fillStyle=sg;X.beginPath();X.ellipse(pr.x,pr.y,sw,sh,0,0,TAU);X.fill();
  // angle relatif kart vs caméra : 0 = on voit l'arrière, PI = on voit l'avant
  let rel=k.a-cam.a;
  let face=Math.cos(rel);          // >0 : kart s'éloigne (on voit l'arrière)
  let side=Math.sin(rel);          // signe = penché gauche/droite
  let flip=side<0?-1:1;
  let absSide=Math.abs(side);
  let body=(k.hit>0&&Math.floor(k.hit)%2)?'#ffffff':k.color;
  let bodyHi=shadeHex(k.color,0.30), bodyLo=shadeHex(k.color,-0.30), bodyDk=shadeHex(k.color,-0.5);
  let OL='#101218';                // contour noir SNES
  // saut visuel de drift : courbe en cloche (monte puis redescend)
  let hopLift=k.hop>0?Math.sin((1-k.hop/8)*Math.PI)*7:0;
  billboard(pr,34,34,hopLift,()=>{
    X.save();X.scale(flip,1);       // miroir horizontal pour gérer gauche/droite
    let bw=16-absSide*6;            // demi-largeur carrosserie (réduit de profil)
    // ── effets sous le kart ──
    if(k.boost>0&&face>-0.1){for(let i=0;i<2;i++){X.fillStyle=Math.random()<0.5?'#ffd24a':'#ff6b2a';X.fillRect(-7+i*9,3,5,rand(8,16));}X.fillStyle='#fff3c4';X.fillRect(-5,3,3,5);X.fillRect(3,3,3,5);}
    if(k.drift>0&&k.driftCharge>34){let c=k.driftCharge>70?'#ff6bff':k.driftCharge>52?'#ff9a22':'#ffd24a';for(let i=0;i<4;i++){X.fillStyle=c;X.fillRect(rand(-13,13),rand(0,7),3,3);}}
    // ── roues (pneu rond + jante claire + moyeu) ──
    let drawWheel=(wx)=>{
      X.fillStyle='#0a0d12';X.fillRect(wx-4,-8,9,13);          // pneu (contour)
      X.fillStyle='#1a1f28';X.fillRect(wx-3,-7,7,11);          // gomme
      X.fillStyle='#c2cad6';X.fillRect(wx-2,-4,5,5);           // jante claire
      X.fillStyle='#7a8696';X.fillRect(wx-1,-3,3,3);           // moyeu
      X.fillStyle='rgba(255,255,255,.5)';X.fillRect(wx-3,-7,2,3);// reflet
    };
    drawWheel(-bw-3);drawWheel(bw+3);
    // ── silhouette/contour noir du châssis (crispness) ──
    X.fillStyle=OL;X.fillRect(-bw-3,-23,2*bw+6,27);
    // ── carrosserie (4 niveaux) ──
    X.fillStyle=body;X.fillRect(-bw,-21,2*bw,23);
    X.fillStyle=bodyHi;X.fillRect(-bw,-21,2*bw,5);                 // capot brillant
    X.fillStyle=bodyLo;X.fillRect(-bw,-2,2*bw,4);                  // bas
    X.fillStyle=bodyDk;X.fillRect(-bw,2,2*bw,2);                   // ombre sous-bassement
    X.fillStyle=bodyHi;X.fillRect(-bw,-21,3,23);                   // arête latérale gauche
    X.fillStyle=bodyLo;X.fillRect(bw-3,-21,3,23);                  // arête latérale droite (ombre)
    // ── détails avant/arrière ──
    if(face>0){ // arrière visible : aileron + feux + échappement + plaque numéro
      X.fillStyle=OL;X.fillRect(-bw-3,-5,2*bw+6,5);                // aileron (contour)
      X.fillStyle=bodyLo;X.fillRect(-bw-2,-7,2*bw+4,3);            // base aileron
      X.fillStyle='#ff3b3b';X.fillRect(-bw+2,-11,5,5);X.fillRect(bw-7,-11,5,5); // feux
      X.fillStyle='#ffb0b0';X.fillRect(-bw+3,-11,2,2);X.fillRect(bw-6,-11,2,2); // reflet feux
      X.fillStyle='#2a2f38';X.fillRect(-3,2,2,5);X.fillRect(1,2,2,5); // pots d'échappement
      // plaque numéro
      X.fillStyle='#f4f6fa';X.fillRect(-5,-17,10,8);X.fillStyle=OL;X.font='8px monospace';X.textAlign='center';X.textBaseline='middle';
      X.fillText(String((k.idx||0)+1),0,-12);X.textAlign='start';X.textBaseline='alphabetic';
    }else{ // avant visible : museau + phares + calandre + pare-brise
      X.fillStyle=OL;X.fillRect(-bw+1,-23,2*bw-2,3);
      X.fillStyle='#eaf6ff';X.fillRect(-bw+2,-20,5,5);X.fillRect(bw-7,-20,5,5); // phares
      X.fillStyle='#ffffff';X.fillRect(-bw+3,-20,2,2);X.fillRect(bw-6,-20,2,2); // éclat phares
      X.fillStyle=bodyDk;X.fillRect(-bw+2,-13,2*bw-4,3);           // calandre
    }
    X.restore();
    // ── pilote assis (buste), au-dessus du châssis ; décalé en 3/4 ──
    X.save();X.scale(flip,1);X.translate(side*flip*2,0);
    X.translate(0,-12);                 // remonte le buste dans l'habitacle
    X.save();X.scale(0.62,0.62);        // buste plus petit que l'échelle native
    drawDriverBust(k.driver, face<0?1:-1);
    X.restore();X.restore();
    // ── pare-brise réfléchissant (vu de l'avant, devant le pilote) ──
    if(face<=0){X.save();X.scale(flip,1);X.fillStyle='rgba(180,230,255,.35)';X.fillRect(-7,-22,14,5);X.fillStyle='rgba(255,255,255,.5)';X.fillRect(-7,-22,5,2);X.restore();}
    // ── bouclier ──
    if(k.shield>0){X.strokeStyle='rgba(120,210,255,'+(0.4+Math.sin(raceTime*8)*0.3)+')';X.lineWidth=2.5;X.beginPath();X.arc(0,-12,26,0,TAU);X.stroke();
      X.strokeStyle='rgba(200,240,255,'+(0.2+Math.sin(raceTime*8+1)*0.15)+')';X.lineWidth=1;X.beginPath();X.arc(0,-12,22,0,TAU);X.stroke();}
  });
}

/* ════════ MINI-CARTE ════════ */
let _bounds=null;
function trackBounds(){
  if(_bounds)return _bounds;
  let src=racePath.length?racePath:track.path;
  let xs=src.map(p=>p[0]),ys=src.map(p=>p[1]);
  let minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  _bounds={minx,miny,w:maxx-minx,h:maxy-miny};return _bounds;
}

/* ════════ FOND ANIMÉ DU MENU (karts qui défilent dans le labo) ════════ */
let _menuT=0, _menuKarts=null, _menuBubbles=null;
function initMenuScene(){
  _menuKarts=[];
  // karts répartis sur plusieurs profondeurs (depth = échelle/vitesse)
  let lanes=[{y:0.62,sc:1.55,sp:0.16},{y:0.55,sc:1.05,sp:0.12},{y:0.50,sc:0.72,sp:0.09},{y:0.47,sc:0.5,sp:0.07}];
  for(let i=0;i<5;i++){
    let lane=lanes[i%lanes.length];
    _menuKarts.push({d:DRIVERS[i%DRIVERS.length], lane, x:Math.random(), spOff:rand(-0.02,0.02)});
  }
  _menuBubbles=[];
  for(let i=0;i<26;i++)_menuBubbles.push({x:Math.random(),y:Math.random(),r:rand(2,6),v:rand(0.04,0.12),c:Math.random()<0.5?'#7fdfff':'#bfe9ff'});
}
function renderMenuBg(dt){
  if(!_menuKarts)initMenuScene();
  _menuT+=dt/60;
  // ── ciel/labo dégradé ──
  let g=X.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#16243a');g.addColorStop(0.5,'#1d3147');g.addColorStop(1,'#0d141f');
  X.fillStyle=g;X.fillRect(0,0,W,H);
  let floorY=H*0.66;
  // ── mur du fond : étagères / paillasses ──
  X.fillStyle='#22384f';X.fillRect(0,0,W,floorY);
  // fenêtres / panneaux lumineux qui défilent lentement (parallaxe lointain)
  let off=(_menuT*22)%240;
  for(let x=-240+off;x<W+240;x+=240){
    X.fillStyle='#2c4a66';X.fillRect(x,H*0.16,150,H*0.30);
    X.fillStyle='#3b6488';X.fillRect(x+8,H*0.16+8,134,18);
    X.fillStyle='rgba(150,210,255,0.10)';X.fillRect(x+8,H*0.16+30,134,H*0.30-40);
    // tubes néon
    X.fillStyle='#bfe9ff';X.fillRect(x+30,H*0.10,90,5);
  }
  // étagères avec fioles colorées (parallaxe moyen)
  let off2=(_menuT*40)%180;
  for(let x=-180+off2;x<W+180;x+=180){
    X.fillStyle='#1a2c3e';X.fillRect(x,floorY-70,150,12);
    let cols=['#ff6b4a','#5cc6ff','#9fe87a','#ffd24a','#c25bd0'];
    for(let f=0;f<5;f++){X.fillStyle=cols[(f+Math.floor(x))%5];X.fillRect(x+10+f*28,floorY-92,14,22);X.fillStyle='rgba(255,255,255,0.25)';X.fillRect(x+11+f*28,floorY-90,4,18);}
  }
  // liseré lumineux sol/mur
  X.fillStyle='rgba(160,230,255,0.35)';X.fillRect(0,floorY-3,W,3);
  // ── sol du labo (carrelage en PERSPECTIVE) ──
  let fg=X.createLinearGradient(0,floorY,0,H);
  fg.addColorStop(0,'#33536f');fg.addColorStop(1,'#0c1a26');
  X.fillStyle=fg;X.fillRect(0,floorY,W,H-floorY);
  // lignes longitudinales convergentes (point de fuite au centre haut du sol)
  let vx=W/2, vy=floorY-30;
  X.strokeStyle='rgba(120,170,210,0.16)';X.lineWidth=2;
  for(let i=-6;i<=6;i++){X.beginPath();X.moveTo(vx+i*30,floorY);X.lineTo(vx+i*260,H);X.stroke();}
  // lignes transversales qui défilent (donne la sensation d'avancer)
  let tline=(_menuT*0.6)%1;
  for(let i=0;i<8;i++){let f=((i/8)+tline)%1; let yy=floorY+(f*f)*(H-floorY); X.globalAlpha=0.10+f*0.12;X.beginPath();X.moveTo(0,yy);X.lineTo(W,yy);X.stroke();}
  X.globalAlpha=1;
  // ── bulles / particules ──
  for(let b of _menuBubbles){
    b.y-=b.v*dt/60; if(b.y<-0.05){b.y=1.05;b.x=Math.random();}
    X.fillStyle=b.c;X.globalAlpha=0.32;
    X.beginPath();X.arc(b.x*W,b.y*H,b.r,0,TAU);X.fill();
  }
  X.globalAlpha=1;
  // ── karts qui défilent (trié du plus loin au plus proche) ──
  let sorted=_menuKarts.slice().sort((a,b)=>a.lane.sc-b.lane.sc);
  for(let mk of sorted){
    mk.x+=(mk.lane.sp+mk.spOff)*dt/60;
    if(mk.x>1.25){mk.x=-0.25;mk.d=DRIVERS[Math.floor(Math.random()*DRIVERS.length)];}
    let px=mk.x*W, py=floorY+ (mk.lane.y-0.5)*H*0.5 + 40;
    let sc=mk.lane.sc;
    // traînées de vitesse derrière le kart
    X.globalAlpha=0.18;
    for(let s=1;s<=3;s++){X.fillStyle=mk.d.kartColor;X.fillRect(px-26*sc-s*14*sc,py-6*sc,10*sc,12*sc);}
    X.globalAlpha=1;
    drawMenuKart(px,py,sc,mk.d,_menuT);
    // étincelles occasionnelles au sol
    if(Math.random()<0.05*sc){X.fillStyle=Math.random()<0.5?'#ffd24a':'#bfe9ff';X.fillRect(px-rand(10,30)*sc,py+rand(2,8)*sc,3*sc,3*sc);}
  }
  // ── vignette d'ambiance ──
  let vg=X.createRadialGradient(W/2,H*0.5,H*0.35,W/2,H*0.5,H*0.85);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,10,18,0.5)');
  X.fillStyle=vg;X.fillRect(0,0,W,H);
}
function drawMenuKart(px,py,sc,d,t){
  X.save();X.translate(px,py);X.scale(sc,sc);
  let bob=Math.sin(t*6+px*0.01)*1.5;X.translate(0,bob);
  // ombre douce
  X.fillStyle='rgba(0,0,0,0.28)';X.beginPath();X.ellipse(0,6,20,6,0,0,TAU);X.fill();
  let body=d.kartColor, bodyHi=shadeHex(d.kartColor,0.30), bodyLo=shadeHex(d.kartColor,-0.30), bodyDk=shadeHex(d.kartColor,-0.5);
  let bw=15;
  // roues (pneu rond + jante claire + reflet)
  let drawWheel=(wx)=>{
    X.fillStyle='#0a0d12';X.fillRect(wx-4,-8,9,13);
    X.fillStyle='#1a1f28';X.fillRect(wx-3,-7,7,11);
    X.fillStyle='#c2cad6';X.fillRect(wx-2,-4,5,5);
    X.fillStyle='#7a8696';X.fillRect(wx-1,-3,3,3);
    X.fillStyle='rgba(255,255,255,.5)';X.fillRect(wx-3,-7,2,3);
  };
  drawWheel(-bw-3);drawWheel(bw+3);
  // châssis vu de l'arrière (le kart roule vers la droite, vu en 3/4 dos)
  X.fillStyle='#101218';X.fillRect(-bw-3,-23,2*bw+6,27);
  X.fillStyle=body;X.fillRect(-bw,-21,2*bw,23);
  X.fillStyle=bodyHi;X.fillRect(-bw,-21,2*bw,5);
  X.fillStyle=bodyLo;X.fillRect(-bw,-2,2*bw,4);
  X.fillStyle=bodyDk;X.fillRect(-bw,2,2*bw,2);
  X.fillStyle=bodyHi;X.fillRect(-bw,-21,3,23);
  X.fillStyle='#101218';X.fillRect(-bw-3,-5,2*bw+6,5);          // aileron (contour)
  X.fillStyle=bodyLo;X.fillRect(-bw-2,-7,2*bw+4,3);             // base aileron
  X.fillStyle='#ff3b3b';X.fillRect(-bw+2,-11,5,5);X.fillRect(bw-7,-11,5,5); // feux
  X.fillStyle='#ffb0b0';X.fillRect(-bw+3,-11,2,2);X.fillRect(bw-6,-11,2,2);
  // petite flamme d'échappement animée
  if((Math.floor(t*10)&1)){X.fillStyle='#ffd24a';X.fillRect(-3,2,2,4);X.fillStyle='#ff6b2a';X.fillRect(1,2,2,5);}
  // pilote assis (vu de dos)
  X.save();X.translate(0,-12);X.scale(0.62,0.62);drawDriverBust(d,-1);X.restore();
  X.restore();
}

/* ════════ BOUCLE DE JEU ════════ */
function loop(t){
  raf=requestAnimationFrame(loop);
  let dt=Math.min(2.5,(t-last)/16.67)||1;last=t;
  if(state==='play'&&!paused)update(dt);
  if(state==='play')render();
  else renderMenuBg(dt);
}
function update(dt){
  raceTime+=dt/60;
  // décompte 3..2..1..GO
  if(countdown>0){
    let prev=Math.ceil(countdown);
    countdown-=dt/60; let now=Math.ceil(countdown);
    if(now!==prev&&now>0){bigMsg(''+now);sfx.beep();}
    if(countdown<=0&&!started){started=true;bigMsg('GO !');sfx.go();}
  }
  // entrées joueur
  let steer=0,throttle=0,driftBtn=false;
  if(started){
    if(keys['ArrowLeft']||keys['KeyA']||keys['KeyQ']||touch.left)steer-=1;
    if(keys['ArrowRight']||keys['KeyD']||touch.right)steer+=1;
    if(keys['ArrowUp']||keys['KeyW']||keys['KeyZ']||touch.accel)throttle=1;
    else if(keys['ArrowDown']||keys['KeyS']||touch.brake)throttle=-1;
    else throttle=settings.autoAccel?0:0;
    driftBtn=keys['ShiftLeft']||keys['ShiftRight']||touch.drift;
    // accélération auto douce si rien n'est pressé après le GO (confort)
    if(throttle===0&&!keys['ArrowDown']&&!touch.brake)throttle=0.55;
  }
  physics(player,throttle,steer,dt);
  updateDrift(player,steer,throttle,driftBtn,dt);
  // IA
  for(let k of karts)if(!k.isPlayer&&started)updateAI(k,dt);
  collide(dt);
  // progression
  for(let k of karts)updateProgress(k);
  // raccourcis : détecte le passage près d'un point intérieur du tracé alternatif
  (track.shortcuts||[]).forEach((sc,si)=>{
    let mid=sc.path[Math.floor(sc.path.length/2)];
    for(let k of karts){
      if(dist(k.x,k.y,mid[0],mid[1])<46){
        k._scFlag=k._scFlag||{};
        if(!k._scFlag[si]){k._scFlag[si]=true;k.shortcutsUsed=(k.shortcutsUsed||0)+1;}
      }
    }
  });
  computeRanks();
  // box bonus respawn
  boxes.forEach(b=>{if(b.t>0)b.t-=dt;});
  // zones animation
  zones.forEach(z=>z.aT=(z.aT||0)+0.05*dt);
  // movers
  movers.forEach(m=>{m.p=(m.p||0)+m.speed*0.01*dt;let s=(Math.sin(m.p)+1)/2;m.x=lerp(m.ax,m.bx,s);m.y=lerp(m.ay,m.by,s);});
  // drops life
  drops=drops.filter(d=>(d.life-=dt)>0);
  // fx
  fx=fx.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=0.9;p.vy*=0.9;return (p.life-=dt)>0;});
  if(cam.shake>0)cam.shake=Math.max(0,cam.shake-0.5*dt);
  // caméra Mode 7 : point de visée = position du joueur, l'œil est reculé de
  // CAM.back dans project(). On lisse position + angle pour un suivi fluide.
  cam.x=lerp(cam.x,player.x,0.16*dt);
  cam.y=lerp(cam.y,player.y,0.16*dt);
  cam.a=angLerp(cam.a,player.a,0.11*dt);
  // léger zoom avant en boost (rapproche l'horizon en abaissant la caméra)
  CAM.height=lerp(CAM.height,player.boost>0?106:120,0.06*dt);
  // RELIEF VISUEL : l'horizon ondule selon la progression du joueur, donnant
  // l'impression que le sol franchit des bosses/creux (la piste reste plane
  // physiquement, seul le rendu tangue). Somme de sinusoïdes douces + lissage.
  let pr=player.prog||0;
  let targetHorizon = H*0.40 + (Math.sin(pr*0.0016)*0.6 + Math.sin(pr*0.0041+2.1)*0.4) * 26;
  horizonY = lerp(horizonY, targetHorizon, 0.08*dt);
  // moteur audio
  updateEngine(player.spd);
  // HUD
  updateHud();
}

/* ════════ HUD ════════ */
function updateHud(){
  document.querySelector('#posHud').textContent=player.place;
  document.querySelector('#posTot').textContent='/'+karts.length;
  document.querySelector('#lapHud').textContent=Math.min(player.lap+1,track.laps)+'/'+track.laps;
  document.querySelector('#timeHud').textContent=fmtTime(raceTime);
  document.querySelector('#speedoBar').style.width=clamp(Math.abs(player.spd)/(player.vmax*2)*100,0,100)+'%';
  // classement
  let order=karts.slice().sort((a,b)=>a.place-b.place);
  document.querySelector('#rankHud').innerHTML=order.map(k=>
    '<div class="'+(k.isPlayer?'me':'')+'">'+k.place+'. '+k.name+'</div>').join('');
}
function updateItemHud(has){
  let box=document.querySelector('#itemBox'),inner=document.querySelector('#itemInner');
  if(has&&player.item){box.classList.remove('spin');let it=ITEMS[player.item];
    inner.style.background=it.color;inner.style.boxShadow='inset 0 0 0 3px #0d141c';
  }else{inner.style.background='transparent';inner.style.boxShadow='none';}
}

/* ════════ ÉCRANS ════════ */
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('hidden',s.id!==id));
  document.querySelector('#hud').classList.toggle('hidden',id!=='play');
  document.querySelector('#pauseToggle').classList.toggle('hidden',id!=='play');
  document.querySelector('#touchControls').classList.toggle('hidden',!(id==='play'&&settings.touch));
  if(id!=='play')document.querySelector('#pauseMenu').classList.add('hidden');
  state=id;
  if(id==='play'){startEngine();}else{stopEngine();}
}
function showMenu(){show('menu');}
function showChars(){buildCharGrid();show('charSelect');}
function showTracks(){buildTrackGrid();show('trackSelect');}

function buildCharGrid(){
  let grid=document.querySelector('#charGrid');grid.innerHTML='';
  DRIVERS.forEach((d,i)=>{
    let node=document.createElement('button');
    node.className='charNode'+(i===selectedDriver?' sel':'');
    node.style.setProperty('--c',d.kartColor);
    node.style.animationDelay=(i*0.04)+'s';
    node.innerHTML='<canvas width="72" height="80"></canvas><div class="charName">'+d.n+'</div>';
    grid.appendChild(node);
    drawCharPreview(node.querySelector('canvas'),d);
    node.addEventListener('click',()=>{
      selectedDriver=i; localStorage.setItem('labo-kart-driver',i);
      grid.querySelectorAll('.charNode').forEach((n,j)=>n.classList.toggle('sel',j===i));
      ensureAudio(); showTracks();
    });
  });
}
function drawCharPreview(cv,d){
  let cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
  cx.clearRect(0,0,72,80);
  cx.save();
  cx.translate(36,66); cx.scale(2,2);
  drawDriverBust(d,1,cx);
  cx.restore();
}

function buildTrackGrid(){
  let grid=document.querySelector('#trackGrid');grid.innerHTML='';
  DATA.tracks.forEach((t,i)=>{
    let locked=t.locked, stars=+(localStorage.getItem('labo-kart-stars-'+t.id)||0),
        best=localStorage.getItem('labo-kart-best-'+t.id);
    let node=document.createElement('button');
    node.className='trackNode'+(locked?' locked':'');
    node.style.setProperty('--c',t.accent||'#3a607c');
    node.style.animationDelay=(i*0.05)+'s';
    let starHtml='';for(let s=0;s<3;s++)starHtml+='<span style="width:11px;height:11px;display:inline-block;background:'+(s<stars?'#ffe35b':'#3a4656')+';clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"></span>';
    node.innerHTML='<span class="trackNum">'+t.n+'</span>'+
      '<canvas width="64" height="40"></canvas>'+
      '<div class="trackName">'+t.name+'</div>'+
      '<div class="trackDesc">'+t.desc+'</div>'+
      (locked?'<div class="trackLock">'+(t.soon?'BIENTOT':'\uD83D\uDD12')+'</div>':'<div class="trackStars">'+starHtml+'</div>'+(best?'<div class="trackBest">'+fmtTime(+best)+'</div>':''));
    grid.appendChild(node);
    drawTrackThumb(node.querySelector('canvas'),t);
    if(!locked)node.addEventListener('click',()=>startRace(t));
    else node.addEventListener('click',()=>bigMsgScreen(node));
  });
}
function bigMsgScreen(node){node.style.animation='none';void node.offsetWidth;node.style.animation='nodePop .4s';}
function drawTrackThumb(cv,t){
  let cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
  cx.fillStyle=t.bg||'#101820';cx.fillRect(0,0,64,40);
  if(t.path){
    let pp=t.smooth?smoothPath(t.path,40):t.path;
    let xs=pp.map(p=>p[0]),ys=pp.map(p=>p[1]);
    let mnx=Math.min(...xs),mxx=Math.max(...xs),mny=Math.min(...ys),mxy=Math.max(...ys);
    let sc=Math.min(54/(mxx-mnx),30/(mxy-mny)),ox=5-mnx*sc+(54-(mxx-mnx)*sc)/2,oy=5-mny*sc+(30-(mxy-mny)*sc)/2;
    cx.lineJoin='round';cx.lineCap='round';
    cx.strokeStyle='#e7453b';cx.lineWidth=5;cx.beginPath();
    pp.forEach((p,i)=>{let X2=ox+p[0]*sc,Y2=oy+p[1]*sc;i?cx.lineTo(X2,Y2):cx.moveTo(X2,Y2);});
    cx.closePath();cx.stroke();
    cx.strokeStyle='#c8cdd6';cx.lineWidth=2.5;cx.stroke();
    // ligne d'arrivée
    cx.fillStyle='#fff';cx.fillRect(ox+pp[0][0]*sc-2,oy+pp[0][1]*sc-2,4,4);
  }else{cx.fillStyle=t.accent||'#888';cx.fillRect(8,16,48,8);cx.fillStyle='#fff';cx.font='6px monospace';}
}

/* ════════ INIT COURSE ════════ */
let currentTrack=null;
function startRace(t){
  currentTrack=t; track=t; _bounds=null;
  buildTrackGeom(t);
  // copies fraîches des éléments
  boxes=t.boxes.map(b=>({x:b[0],y:b[1],t:0}));
  zones=t.zones.map(z=>({...z}));
  obstacles=t.obstacles.map(o=>({...o}));
  movers=t.movers.map(m=>({...m,p:0,x:m.ax,y:m.ay}));
  decor=t.decor.map(d=>({...d}));
  drops=[];fx=[];beams=[];finishOrder=[];
  // karts
  karts=[];
  player=makeKart(true,0);karts.push(player);
  for(let i=0;i<t.opponents;i++){let k=makeKart(false,i+1);k.name='IA '+(i+1);karts.push(k);}
  // caméra initiale
  cam={x:player.x,y:player.y,a:player.a,shake:0,zoom:1};
  raceTime=0;countdown=3.5;started=false;finished=false;paused=false;
  updateItemHud(false);
  ensureAudio();
  show('play');
  bigMsg('3');sfx.beep();
}

/* ════════ FIN DE COURSE ════════ */
function endRace(){
  finished=true;
  // assure que tout le monde a une place finale
  computeRanks();
  let place=player.place, time=raceTime, hits=player.hitCount||0;
  // étoiles : 1 = fini, 2 = top3 ou sous targetTime, 3 = 1er + bon temps + peu de casse
  let stars=1;
  if(place<=3||time<=track.targetTime)stars=2;
  if(place===1&&time<=track.targetTime)stars=3;
  // sauvegarde
  let prev=+(localStorage.getItem('labo-kart-stars-'+track.id)||0);
  let isNew=stars>prev;
  if(stars>prev)localStorage.setItem('labo-kart-stars-'+track.id,stars);
  let pb=localStorage.getItem('labo-kart-best-'+track.id);
  let newBest=!pb||time<+pb; if(newBest)localStorage.setItem('labo-kart-best-'+track.id,time.toFixed(1));
  // débloque le circuit suivant si ≥1 étoile
  if(stars>=1){let idx=DATA.tracks.findIndex(x=>x.id===track.id);/* déverrouillage géré par soon flag, ici on note juste */}
  stopEngine();
  place===1?sfx.win():sfx.lose();
  buildResult(place,time,stars,isNew,newBest);
  setTimeout(()=>show('result'),700);
}
function buildResult(place,time,stars,isNew,newBest){
  let won=place===1;
  let starImgs='';for(let s=0;s<3;s++)starImgs+='<span class="rstar" style="background:'+(s<stars?'#ffe35b':'#3a4656')+';clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"></span>';
  let titles=['','1er ! VICTOIRE','2e PLACE','3e PLACE'];
  let title=place<=3?titles[place]:place+'e PLACE';
  let html='<div class="resCard '+(won?'won':'lost')+'">'+
    '<div class="resTitle">'+title+'</div>'+
    '<div class="resStars">'+starImgs+'</div>'+
    (isNew?'<div class="newbadge">NOUVEAU RECORD D ETOILES !</div>':'')+
    '<div class="resTiles">'+
      '<div class="resTile p"><b>'+place+'<small>/'+karts.length+'</small></b><small>POSITION</small></div>'+
      '<div class="resTile t"><b>'+fmtTime(time)+'</b><small>TEMPS'+(newBest?' (RECORD)':'')+'</small></div>'+
      '<div class="resTile c"><b>'+(player.hitCount||0)+'</b><small>COLLISIONS</small></div>'+
    '</div>'+
    '<div class="resTiles">'+
      '<div class="resTile"><b>'+(player.itemsUsed||0)+'</b><small>BONUS UTILISES</small></div>'+
      '<div class="resTile"><b>'+(player.shortcutsUsed||0)+'</b><small>RACCOURCIS</small></div>'+
      '<div class="resTile"><b>'+(player.lap)+'</b><small>TOURS</small></div>'+
    '</div>'+
    '<div class="resProg">'+(won?'Parfait, champion du labo !':place<=3?'Sur le podium, bien joué !':'Continue à t entraîner !')+'</div>'+
  '</div>';
  document.querySelector('#resultBox').innerHTML=html;
}

/* ════════ PAUSE ════════ */
function togglePause(){if(state!=='play')return;paused=!paused;document.querySelector('#pauseMenu').classList.toggle('hidden',!paused);if(paused)stopEngine();else startEngine();}

/* ════════ RÉGLAGES ════════ */
function refreshSettings(){
  let on='OUI',off='NON';
  document.querySelector('#setShake').textContent=settings.shake?on:off;
  document.querySelector('#setSound').textContent=settings.sound?on:off;
  document.querySelector('#setMusic').textContent=settings.music?on:off;
  document.querySelector('#setTouch').textContent=settings.touch?on:off;
  document.querySelector('#setDiff').textContent=settings.diff;
}
function saveSettings(){localStorage.setItem('labo-kart-settings',JSON.stringify(settings));}

/* ════════ ENTRÉES ════════ */
window.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  if(e.code==='Space'||e.code==='KeyX'){if(state==='play'&&started&&!paused){let had=player.item;useItem(player);if(had){player.itemsUsed=(player.itemsUsed||0)+1;}}}
  if(e.code==='Escape'&&state==='play')togglePause();
  ensureAudio();
});
window.addEventListener('keyup',e=>{keys[e.code]=false;});

// compteur collisions joueur (hook depuis collide via player.hit)
let _lastHit=0;
setInterval(()=>{if(player&&player.hit>0&&_lastHit<=0){player.hitCount=(player.hitCount||0)+1;}_lastHit=player?player.hit:0;},120);

function bindTouch(){
  let map=[['leftBtn','left'],['rightBtn','right'],['accelBtn','accel'],['brakeBtn','brake']];
  map.forEach(([id,prop])=>{let el=document.querySelector('#'+id);if(!el)return;
    let on=e=>{e.preventDefault();touch[prop]=true;ensureAudio();},off=e=>{e.preventDefault();touch[prop]=false;};
    el.addEventListener('touchstart',on);el.addEventListener('touchend',off);el.addEventListener('touchcancel',off);
    el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);
  });
  let ib=document.querySelector('#itemBtnT');
  if(ib){let fire=e=>{e.preventDefault();if(state==='play'&&started&&!paused){let had=player.item;useItem(player);if(had)player.itemsUsed=(player.itemsUsed||0)+1;}};
    ib.addEventListener('touchstart',fire);ib.addEventListener('mousedown',fire);}
}

/* ════════ CÂBLAGE UI ════════ */
function wire(){
  document.querySelector('#mPlay').addEventListener('click',()=>{ensureAudio();showChars();});
  document.querySelector('#mHow').addEventListener('click',()=>show('how'));
  document.querySelector('#mSettings').addEventListener('click',()=>{refreshSettings();show('settings');});
  document.querySelector('#howOk').addEventListener('click',showMenu);
  document.querySelector('#csBack').addEventListener('click',showMenu);
  document.querySelector('#tsBack').addEventListener('click',showChars);
  document.querySelector('#setBack').addEventListener('click',showMenu);
  document.querySelector('#rTracks').addEventListener('click',showTracks);
  document.querySelector('#rReplay').addEventListener('click',()=>startRace(currentTrack));
  // pause
  document.querySelector('#pauseToggle').addEventListener('click',togglePause);
  document.querySelector('#pResume').addEventListener('click',togglePause);
  document.querySelector('#pRestart').addEventListener('click',()=>{togglePause();startRace(currentTrack);});
  document.querySelector('#pTracks').addEventListener('click',()=>{paused=false;document.querySelector('#pauseMenu').classList.add('hidden');showTracks();});
  document.querySelector('#pSettings').addEventListener('click',()=>{refreshSettings();paused=false;document.querySelector('#pauseMenu').classList.add('hidden');show('settings');});
  document.querySelector('#pQuit').addEventListener('click',()=>{paused=false;document.querySelector('#pauseMenu').classList.add('hidden');showMenu();});
  // réglages toggles
  document.querySelector('#setShake').addEventListener('click',()=>{settings.shake=!settings.shake;saveSettings();refreshSettings();});
  document.querySelector('#setSound').addEventListener('click',()=>{settings.sound=!settings.sound;saveSettings();refreshSettings();});
  document.querySelector('#setMusic').addEventListener('click',()=>{settings.music=!settings.music;saveSettings();refreshSettings();});
  document.querySelector('#setTouch').addEventListener('click',()=>{settings.touch=!settings.touch;saveSettings();refreshSettings();document.querySelector('#touchControls').classList.toggle('hidden',!(state==='play'&&settings.touch));});
  document.querySelector('#setDiff').addEventListener('click',()=>{settings.diff=settings.diff==='FACILE'?'NORMAL':settings.diff==='NORMAL'?'DIFFICILE':'FACILE';saveSettings();refreshSettings();});
  bindTouch();
}

/* ════════ DÉMARRAGE ════════ */
wire();
refreshSettings();
show('menu');
raf=requestAnimationFrame(loop);

/* hook debug temporaire : ?auto=1 lance directement une course (capture visuelle). */
if(location.search.indexOf('auto=1')>=0){
  setTimeout(()=>{startRace(DATA.tracks[0]);countdown=0;started=true;
    let m=location.search.match(/prog=(\d+)/);
    if(m){let p=+m[1];player.prog=p;let np=pointAtProg(p);if(np){player.x=np.x;player.y=np.y;player.a=np.dir;cam.x=np.x;cam.y=np.y;cam.a=np.dir;}}
    player.spd=3;
  },300);
}

})();

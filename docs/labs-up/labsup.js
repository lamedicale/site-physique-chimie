// Labs'Up — logique du jeu (vanilla JS, même esprit que Temple des Savoirs)

// ---------- Navigation entre écrans ----------
function show(id){
  document.querySelectorAll('.screen').forEach(s=>{
    let active=s.id===id;
    s.classList.toggle('hidden',!active);
    if(active){ s.classList.remove('screenAnim'); void s.offsetWidth; s.classList.add('screenAnim'); }
  });
  if(state&&state!==id) sfx('whoosh');
  state=id;
  if(id!=='game') stopClock();
  window.scrollTo(0,0);
}
function showMenu(){show('menu')}
function showHow(){show('how')}

// ---------- État ----------
let state='menu';
let curClass='5e', curThemeId=null, curThemeName='', curThemeIndex=0, curDiff='moyen';
let queue=[], qIndex=0, answered=false;
let score=0, combo=0, maxCombo=0, good=0, total=0;
let startTime=0, results=[];
let clock=0, clockMax=10, clockRAF=0, clockLast=0;
const ROUND_LABELS={1:'DÉFINITION',2:'MOT-CLÉ',3:'IMAGE'};

const ui={
  themeList:document.querySelector('#themeList'),
  themeTitle:document.querySelector('#themeTitle'),
  modeSub:document.querySelector('#modeSub'),
  gameTheme:document.querySelector('#gameTheme'),
  gameRound:document.querySelector('#gameRound'),
  cardCount:document.querySelector('#cardCount'),
  gameScore:document.querySelector('#gameScore'),
  gameCombo:document.querySelector('#gameCombo'),
  roundTag:document.querySelector('#roundTag'),
  gameStage:document.querySelector('.gameStage'),
  clue:document.querySelector('#clue'),
  iconBox:document.querySelector('#iconBox'),
  answers:document.querySelector('#answers'),
  explainBox:document.querySelector('#explainBox'),
  continueBtn:document.querySelector('#continueBtn'),
  skipBtn:document.querySelector('#skipBtn'),
  quizClock:document.querySelector('#quizClock'),
  quizClockBar:document.querySelector('#quizClockBar'),
  quizPanel:document.querySelector('#quizPanel'),
  hourglass:document.querySelector('#hourglass'),
  endText:document.querySelector('#endText'),
};

// ---------- Sablier pixel-art ----------
// Tout en rectangles « pixels » (pas de courbes) pour un rendu rétro.
// Le sable du haut (#hgTop) diminue, celui du bas (#hgBot) grandit, synchro chrono.
const HG_TOP_Y=14, HG_TOP_H=24;   // bulbe haut : sable de y=14 à y=38
const HG_BOT_Y=66, HG_BOT_MAXH=24; // bulbe bas : base à y=66, grandit vers le haut
function hourglassSVG(){
  return '<svg viewBox="0 0 64 84" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">'+
    // ombre pixel sous le cadre
    '<rect x="8" y="78" width="48" height="4" fill="#120c24"/>'+
    // cadres bois (haut / bas) en blocs
    '<rect x="6" y="4" width="52" height="8" fill="#120c24"/>'+
    '<rect x="8" y="6" width="48" height="4" fill="#ff9f1c"/>'+
    '<rect x="6" y="72" width="52" height="8" fill="#120c24"/>'+
    '<rect x="8" y="74" width="48" height="4" fill="#ff9f1c"/>'+
    // montants latéraux
    '<rect x="8" y="12" width="4" height="60" fill="#120c24"/>'+
    '<rect x="52" y="12" width="4" height="60" fill="#120c24"/>'+
    // verre (escalier en pixels : deux entonnoirs)
    '<path d="M14 12 H50 V20 H44 V28 H38 V36 H34 V44 H38 V52 H44 V60 H50 V72 H14 V60 H20 V52 H26 V44 H30 V36 H26 V28 H20 V20 H14 Z" '+
      'fill="#dCeefc" stroke="#120c24" stroke-width="2"/>'+
    // clips pour contenir le sable dans le verre
    '<clipPath id="hgClipTop"><path d="M16 13 H48 V20 H42 V28 H36 V36 H32 V38 H30 V36 H26 V28 H20 V20 H16 Z"/></clipPath>'+
    '<clipPath id="hgClipBot"><path d="M30 46 H32 V52 H38 V60 H44 V70 H16 V60 H22 V52 H28 V46 Z"/></clipPath>'+
    // sable haut
    '<rect id="hgTop" class="hgSand" x="14" y="'+HG_TOP_Y+'" width="36" height="'+HG_TOP_H+'" fill="#ffd23f" clip-path="url(#hgClipTop)"/>'+
    // sable bas
    '<rect id="hgBot" class="hgSand" x="14" y="'+HG_BOT_Y+'" width="36" height="0" fill="#ffd23f" clip-path="url(#hgClipBot)"/>'+
    // grains qui tombent (visibles en mode chrono)
    '<rect class="hgFall" x="31" y="40" width="2" height="3" fill="#ffb703"/>'+
    '<rect class="hgFall" x="31" y="46" width="2" height="2" fill="#ffb703"/>'+
    '</svg>';
}
function setHourglass(pct){ // pct = part de temps restant (1 -> plein en haut, 0 -> vide)
  pct=Math.max(0,Math.min(1,pct));
  let top=ui.hourglass.querySelector('#hgTop');
  let bot=ui.hourglass.querySelector('#hgBot');
  if(!top||!bot) return;
  let topH=HG_TOP_H*pct, botH=HG_BOT_MAXH*(1-pct);
  // le sable du haut « descend » (sa surface baisse, sa base reste au goulot)
  top.setAttribute('y',(HG_TOP_Y+(HG_TOP_H-topH)).toFixed(1));
  top.setAttribute('height',topH.toFixed(1));
  // le sable du bas monte depuis la base
  bot.setAttribute('y',(HG_BOT_Y-botH).toFixed(1));
  bot.setAttribute('height',botH.toFixed(1));
  let col=pct>.5?'#ffd23f':pct>.25?'#ff9f1c':'#ff5a5f';
  top.setAttribute('fill',col);bot.setAttribute('fill',col);
}
function flipHourglass(){
  ui.hourglass.classList.remove('flip');void ui.hourglass.offsetWidth;
  ui.hourglass.classList.add('flip');
  setHourglass(1);
  sfx('flip');
}

// ---------- Progression (carte / bracket débloquable) ----------
// On retient le nombre de chapitres débloqués par classe (localStorage).
function progKey(){return 'labsup_prog_'+curClass;}
function getUnlocked(){
  let v=parseInt(localStorage.getItem(progKey())||'1',10);
  return isNaN(v)||v<1?1:v;
}
function setUnlocked(n){
  let cur=getUnlocked();
  if(n>cur) localStorage.setItem(progKey(),String(n));
}

// ---------- Choix classe / parcours / difficulté ----------
function goClass(){show('classSelect')}
function chooseClass(c){curClass=c;buildThemeList();show('themeSelect')}

function buildThemeList(){
  let data=LABSUP_DATA[curClass];
  let unlocked=getUnlocked();
  ui.themeTitle.textContent='PARCOURS — '+(curClass==='5e'?'5ᵉ':'4ᵉ');
  ui.themeList.innerHTML='';
  data.themes.forEach((t,i)=>{
    let open=i<unlocked, done=i<unlocked-1;
    let node=document.createElement('div');
    node.className='mapNode'+(open?'':' locked')+(done?' done':'')+(i===unlocked-1?' current':'');
    let b=document.createElement('button');
    b.className='mapBtn';
    b.disabled=!open;
    let badge=done?'<span class="mapTick">★</span>':open?'<span class="mapTick cur">▶</span>':'<span class="mapTick">◆</span>';
    b.innerHTML='<span class="mapNum">'+(i+1)+'</span><span class="mapName">'+t.n+'</span>'+
      '<span class="mapInfo">'+t.cards.length+' notions</span>'+badge;
    if(open) b.onclick=()=>{curThemeId=t.id;curThemeName=t.n;curThemeIndex=i;goMode()};
    node.appendChild(b);
    ui.themeList.appendChild(node);
    if(i<data.themes.length-1){
      let link=document.createElement('div');
      link.className='mapLink'+(i<unlocked-1?' lit':'');
      ui.themeList.appendChild(link);
    }
  });
}

function goTheme(){buildThemeList();show('themeSelect')}
function goMode(){ui.modeSub.textContent=(curClass==='5e'?'5ᵉ':'4ᵉ')+' — '+curThemeName;show('modeSelect')}
function chooseMode(m){curDiff=m;startGame()}

// ---------- Réglages de difficulté ----------
// aide = poids des manches (def / mot-clé / image) ; chrono ; nombre de cartes.
const DIFF={
  facile:   {label:'FACILE',    rounds:[1,1,1,2,2,3],         clock:0,  count:6},
  moyen:    {label:'MOYEN',     rounds:[1,1,2,2,3,3],         clock:12, count:9},
  difficile:{label:'DIFFICILE', rounds:[1,2,3,3,3,3],         clock:7,  count:99},
};

// ---------- Construction de la file de cartes ----------
function collectCards(){
  let data=LABSUP_DATA[curClass];
  let t=data.themes.find(x=>x.id===curThemeId);
  return t.cards.map(c=>({...c,theme:t.n}));
}

function pickRound(cfg,card){
  let r=cfg.rounds[Math.floor(Math.random()*cfg.rounds.length)];
  // La manche 3 (image) n'a de sens que pour une carte réellement illustrable.
  // Sinon, on rabat sur la manche 2 (mot-clé).
  if(r===3 && !(card&&card.img)) r=2;
  return r;
}

function buildQueue(){
  let cfg=DIFF[curDiff]||DIFF.moyen;
  let cards=collectCards();
  shuffle(cards);
  let n=Math.min(cfg.count,cards.length);
  queue=cards.slice(0,n).map(c=>({card:c,round:pickRound(cfg,c)}));
}

// ---------- Démarrage d'une partie ----------
function startGame(){
  buildQueue();
  qIndex=0;score=0;combo=0;maxCombo=0;good=0;total=0;results=[];
  startTime=Date.now();
  ui.hourglass.innerHTML=hourglassSVG();
  setHourglass(1);
  show('game');
  renderCard();
}

function renderCard(){
  answered=false;
  stopClock();
  let item=queue[qIndex];
  let c=item.card, round=item.round;
  total++;

  ui.gameTheme.textContent=item.card.theme||curThemeName;
  ui.gameRound.textContent='MANCHE '+round;
  ui.roundTag.textContent=ROUND_LABELS[round];
  ui.roundTag.style.animation='none';void ui.roundTag.offsetWidth;ui.roundTag.style.animation='';
  ui.cardCount.textContent=(qIndex+1)+' / '+queue.length;
  ui.gameScore.textContent=score;
  ui.gameCombo.textContent=combo;
  ui.explainBox.classList.add('hidden');
  ui.continueBtn.classList.add('hidden');
  ui.skipBtn.classList.remove('hidden');

  // Animation : la scène se retourne (carte qu'on pose) + retournement du sablier
  ui.gameStage.classList.remove('swapOut','swapIn');void ui.gameStage.offsetWidth;
  ui.gameStage.classList.add('swapIn');
  flipHourglass();
  sfx('deal');

  // Indice selon la manche
  ui.iconBox.classList.remove('show');
  ui.iconBox.classList.add('hidden');
  ui.iconBox.innerHTML='';
  ui.clue.classList.remove('hidden');
  if(round===1){ ui.clue.textContent=c.def; }
  else if(round===2){ ui.clue.textContent='« '+c.key+' »'; }
  else { // manche 3 : image SVG
    let svg=(typeof svgIcon==='function')?svgIcon(c.icon):null;
    if(svg){
      ui.iconBox.innerHTML=svg;
      ui.iconBox.classList.remove('hidden');
      ui.iconBox.classList.add('show');
      ui.clue.classList.add('hidden');
    } else {
      ui.clue.textContent='« '+c.key+' »'; // fallback si pas d'icône
    }
  }

  // 4 réponses mélangées
  let opts=[c.answer,...c.distractors];
  shuffle(opts);
  ui.answers.innerHTML='';
  opts.forEach(opt=>{
    let b=document.createElement('button');
    b.textContent=opt;
    b.onclick=()=>answer(b,opt,c);
    ui.answers.appendChild(b);
  });

  // Chrono selon la difficulté
  let cfg=DIFF[curDiff]||DIFF.moyen;
  if(cfg.clock>0){
    clockMax=cfg.clock;
    ui.quizClock.classList.remove('hidden');
    startClock(c);
  } else {
    ui.quizClock.classList.add('hidden');
  }
}

// ---------- Réponse ----------
function answer(btn,opt,card){
  if(answered) return;
  answered=true;
  stopClock();
  let ok=(opt===card.answer);
  let cfg=DIFF[curDiff]||DIFF.moyen;
  let speedBonus=0;
  if(cfg.clock>0) speedBonus=Math.round(clock/clockMax*40);

  // Marquer les boutons
  [...ui.answers.children].forEach(b=>{
    b.disabled=true;
    if(b.textContent===card.answer) b.classList.add('correct');
    else if(b===btn) b.classList.add('wrong');
  });

  if(ok){
    combo++;maxCombo=Math.max(maxCombo,combo);good++;
    let mult=1+Math.min(combo-1,4)*0.25;
    score+=Math.round(100*mult)+speedBonus;
    sfx('good');
    flashQuiz('flashGood');
    if(combo>=3) comboPop(combo);
  } else {
    combo=0;
    score=Math.max(0,score-30);
    sfx('bad');
    flashQuiz('flashBad');
  }
  ui.gameScore.textContent=score;
  ui.gameCombo.textContent=combo;
  bump(ui.gameScore); if(ok) bump(ui.gameCombo);
  results.push({clue:card.def,answer:card.answer,ok});

  // Correction
  ui.explainBox.innerHTML='<b class="'+(ok?'exGood':'exBad')+'">'+
    (ok?'Bonne réponse !':'Raté.')+'</b><span>'+card.answer+' — '+card.def+'</span>';
  ui.explainBox.classList.remove('hidden');

  ui.skipBtn.classList.add('hidden');
  ui.continueBtn.classList.remove('hidden');
}

function skipCard(){
  if(answered) return;
  combo=0;ui.gameCombo.textContent=0;
  let card=queue[qIndex].card;
  results.push({clue:card.def,answer:card.answer,ok:false});
  nextCard();
}

function nextCard(){
  qIndex++;
  if(qIndex>=queue.length){ finish(); return; }
  // sortie de la carte courante puis entrée de la suivante
  ui.gameStage.classList.remove('swapIn');void ui.gameStage.offsetWidth;
  ui.gameStage.classList.add('swapOut');
  setTimeout(renderCard,150);
}

// ---------- Chrono (mode Chrono) ----------
let lastTick=-1;
function startClock(card){
  clock=clockMax;clockLast=performance.now();lastTick=-1;
  ui.quizClockBar.style.width='100%';
  ui.quizClockBar.style.background='#06d6a0';
  ui.quizClock.classList.remove('urgent');
  ui.hourglass.classList.add('running'); // grains qui s'écoulent
  let loop=(t)=>{
    let dt=(t-clockLast)/1000;clockLast=t;
    clock-=dt;
    if(clock<=0){clock=0;setHourglass(0);timeUp(card);return;}
    let pct=clock/clockMax;
    ui.quizClockBar.style.width=(pct*100)+'%';
    ui.quizClockBar.style.background=pct>.5?'#06d6a0':pct>.25?'#ffd23f':'#ff5a5f';
    setHourglass(pct);
    // urgence dans les 3 dernières secondes : tic-tac + secousses
    let urgent=clock<=3;
    ui.quizClock.classList.toggle('urgent',urgent);
    ui.hourglass.classList.toggle('urgent',urgent);
    if(urgent){
      let sec=Math.ceil(clock);
      if(sec!==lastTick){lastTick=sec;sfx('tick');}
    }
    clockRAF=requestAnimationFrame(loop);
  };
  clockRAF=requestAnimationFrame(loop);
}
function stopClock(){
  if(clockRAF){cancelAnimationFrame(clockRAF);clockRAF=0}
  ui.quizClock.classList.remove('urgent');
  if(ui.hourglass){ui.hourglass.classList.remove('urgent');ui.hourglass.classList.remove('running');}
}
function timeUp(card){
  if(answered) return;
  answered=true;
  [...ui.answers.children].forEach(b=>{b.disabled=true;if(b.textContent===card.answer)b.classList.add('correct')});
  combo=0;ui.gameCombo.textContent=0;sfx('bad');
  results.push({clue:card.def,answer:card.answer,ok:false});
  ui.explainBox.innerHTML='<b class="exBad">Temps écoulé !</b><span>'+card.answer+' — '+card.def+'</span>';
  ui.explainBox.classList.remove('hidden');
  ui.skipBtn.classList.add('hidden');
  ui.continueBtn.classList.remove('hidden');
}

// ---------- Fin de partie ----------
function badgeFor(pct){
  if(pct>=95) return {name:'Maître du labo'};
  if(pct>=75) return {name:'Expert du labo'};
  if(pct>=50) return {name:'Technicien du labo'};
  return {name:'Apprenti du labo'};
}
function finish(){
  stopClock();
  let secs=Math.round((Date.now()-startTime)/1000);
  let mm=String(Math.floor(secs/60)).padStart(2,'0'), ss=String(secs%60).padStart(2,'0');
  let answeredCount=results.length||1;
  let pct=Math.round(good/answeredCount*100);
  let badge=badgeFor(pct);
  let passed=pct>=50;
  sfx(passed?'win':'lose');
  if(passed) confettiBurst();

  // Déblocage du chapitre suivant si réussite
  let unlockMsg='';
  let nbThemes=LABSUP_DATA[curClass].themes.length;
  if(passed && curThemeIndex===getUnlocked()-1 && curThemeIndex<nbThemes-1){
    setUnlocked(curThemeIndex+2);
    unlockMsg='<div class="unlockMsg">CHAPITRE SUIVANT DÉBLOQUÉ !</div>';
    setTimeout(()=>sfx('unlock'),700);
  } else if(passed && curThemeIndex>=nbThemes-1 && curThemeIndex===getUnlocked()-1){
    unlockMsg='<div class="unlockMsg">PARCOURS TERMINÉ !</div>';
  } else if(!passed){
    unlockMsg='<div class="failMsg">Atteins 50% pour débloquer la suite.</div>';
  }

  let review=results.map(r=>'<div class="'+(r.ok?'rok':'rko')+'">'+(r.ok?'[OK]':'[X]')+' '+r.answer+'</div>').join('');
  ui.endText.innerHTML=
    '<strong>'+score+' pts</strong>'+
    '<div class="labsBadge">'+badge.name+'</div>'+
    unlockMsg+
    '<div class="endStats">'+
      'Bonnes réponses : <b>'+good+' / '+answeredCount+'</b> ('+pct+'%)<br>'+
      'Meilleure série : <b>'+maxCombo+'</b><br>'+
      'Temps : <b>'+mm+':'+ss+'</b>'+
    '</div>'+
    '<div class="labsReview"><b>Correction rapide</b>'+review+'</div>';
  show('end');
}
function replay(){startGame()}

// ---------- Utilitaires ----------
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

// ---------- Sons (WebAudio, sans fichier) ----------
let audioCtx=null;
function tone(f1,f2,start,dur,type,vol){
  let o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type;o.frequency.setValueAtTime(f1,start);o.frequency.linearRampToValueAtTime(f2,start+dur);
  g.gain.setValueAtTime(vol,start);g.gain.exponentialRampToValueAtTime(0.0001,start+dur);
  o.connect(g);g.connect(audioCtx.destination);o.start(start);o.stop(start+dur);
}
// bruit court (sable / carte) via buffer de bruit blanc filtré
function noise(start,dur,vol,freq){
  let len=Math.floor(audioCtx.sampleRate*dur);
  let buf=audioCtx.createBuffer(1,len,audioCtx.sampleRate);
  let d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
  let src=audioCtx.createBufferSource();src.buffer=buf;
  let f=audioCtx.createBiquadFilter();f.type='bandpass';f.frequency.value=freq||2200;f.Q.value=.8;
  let g=audioCtx.createGain();g.gain.setValueAtTime(vol,start);
  g.gain.exponentialRampToValueAtTime(0.0001,start+dur);
  src.connect(f);f.connect(g);g.connect(audioCtx.destination);
  src.start(start);src.stop(start+dur);
}
function ensureAudio(){
  if(!audioCtx){
    try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}
  }
  if(audioCtx.state==='suspended') audioCtx.resume();
  return audioCtx;
}
function sfx(name){
  try{
    if(!ensureAudio()) return;
    let n=audioCtx.currentTime;
    if(name==='good'){
      // mélodie ascendante + escalade selon la série en cours
      let base=523+Math.min(combo,6)*40;
      tone(base,base*1.25,n,.09,'triangle',.05);
      tone(base*1.25,base*1.5,n+.08,.12,'triangle',.05);
      tone(base*1.5,base*2,n+.18,.16,'triangle',.045);
    }
    else if(name==='bad'){tone(330,180,n,.20,'sawtooth',.05);tone(220,120,n+.06,.26,'square',.045);}
    else if(name==='win'){[523,659,784,1046,1318,1568].forEach((f,i)=>tone(f,f,n+i*.10,.4,'triangle',.05));}
    else if(name==='lose'){[440,392,330,262].forEach((f,i)=>tone(f,f,n+i*.14,.3,'sawtooth',.045));} // descente triste
    else if(name==='deal'){noise(n,.16,.06,3200);}            // carte qui glisse
    else if(name==='flip'){noise(n,.30,.05,1500);tone(180,90,n,.30,'sine',.025);} // sablier qui se retourne + sable
    else if(name==='tick'){tone(1400,1400,n,.05,'square',.045);} // tic-tac d'urgence
    else if(name==='click'){tone(660,880,n,.06,'square',.04);} // clic d'interface
    else if(name==='unlock'){[523,784,1046].forEach((f,i)=>tone(f,f*1.2,n+i*.09,.18,'triangle',.05));} // déblocage
    else if(name==='whoosh'){noise(n,.35,.05,900);} // transition d'écran
    else if(name==='hover'){tone(880,990,n,.04,'sine',.02);} // survol léger
  }catch(e){}
}

// Débloque le son dès le 1er geste de l'utilisateur (navigateurs mobiles & desktop).
function unlockAudio(){
  ensureAudio();
  ['pointerdown','keydown','touchstart'].forEach(ev=>
    window.removeEventListener(ev,unlockAudio));
}
['pointerdown','keydown','touchstart'].forEach(ev=>
  window.addEventListener(ev,unlockAudio,{once:false,passive:true}));

// ---------- Effets visuels en jeu ----------
function flashQuiz(cls){
  if(!ui.quizPanel) return;
  ui.quizPanel.classList.remove('flashGood','flashBad');
  void ui.quizPanel.offsetWidth;
  ui.quizPanel.classList.add(cls);
}
// petit « pop » d'un chiffre HUD quand il change
function bump(el){
  if(!el) return;
  el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');
}
// Petite bulle "COMBO xN" qui jaillit du HUD
function comboPop(n){
  let host=ui.quizPanel||document.querySelector('#shell');
  let pop=document.createElement('div');
  pop.className='comboPop';
  pop.textContent='COMBO ×'+n+' !';
  host.appendChild(pop);
  setTimeout(()=>pop.remove(),900);
}

// ---------- Confettis de fin ----------
function confettiBurst(){
  let host=document.querySelector('#shell');
  let box=document.createElement('div');box.className='confetti';
  let cols=['#ff5a5f','#ff9f1c','#ffd23f','#06d6a0','#3a86ff','#9b5de5','#ff6fb5'];
  for(let i=0;i<70;i++){
    let p=document.createElement('i');
    p.style.left=Math.random()*100+'%';
    p.style.background=cols[i%cols.length];
    p.style.animationDuration=(2+Math.random()*2)+'s';
    p.style.animationDelay=(Math.random()*.6)+'s';
    box.appendChild(p);
  }
  host.appendChild(box);
  setTimeout(()=>box.remove(),4200);
}

// Petit clic d'interface sur tous les boutons (sauf les réponses, qui ont leur propre son).
document.addEventListener('click',e=>{
  let b=e.target.closest('button');
  if(b && !b.closest('#answers')) sfx('click');
},true);

// Survol léger des boutons (sur appareils avec souris uniquement, pour éviter le spam tactile).
if(window.matchMedia&&window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mouseover',e=>{
    let b=e.target.closest('button');
    if(b && !b.disabled) sfx('hover');
  });
}

// Démarrage
show('menu');

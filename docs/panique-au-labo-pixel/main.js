const C=document.querySelector('#game'),CTX=C.getContext('2d'),W=640,H=360,T=32,GW=20,GH=12,DASH_CD=.5;
CTX.imageSmoothingEnabled=false;
const MACHINE_TIMES={water:1.15,co2:1.65,ph:1.9,mix:2.5,filter:2.75,label:1.1,distill:3.25,combust:2.85,cool:2.2,centrifuge:3,density:1.8,report:1.25};
const ui={hud:document.querySelector('#hud'),orders:document.querySelector('#orders'),score:document.querySelector('#score'),timer:document.querySelector('#timer'),goal:document.querySelector('#goal'),levelName:document.querySelector('#levelHudName'),prompt:document.querySelector('#prompt'),dashBar:document.querySelector('#dashBar'),dash:document.querySelector('#dashBar i'),dashLabel:document.querySelector('#dashBar span'),touch:document.querySelector('#touch')};
let settings={shake:true,sound:true,touch:true,...JSON.parse(localStorage.getItem('pal-pixel-settings')||'{}')};
let state='menu',selected=0,level=LAB_DATA.levels[0],map=[],machines=[],props=[],orders=[],energyItems=[],feedbacks=[],particles=[],fallFx=[],foamZones=[],geysers=[],steamJets=[],movingIslands=[],lavaBridges=[],rollingCarts=[],player=null,score=0,served=0,time=0,spawnTimer=0,energySpawn=0,energyBrake=0,energyRush=0,beltBoost=0,bridgeBoost=0,bridgePanic=0,respawnTimer=0,respawnTarget=null,paused=false,last=performance.now(),raf=0,keys={},flash=0,shake=0,shakeX=0,shakeY=0,camX=0,camY=0,cameraFade=0,beamAngle=0,incidentTimer=12,hazardPause=0,foamSlowdown=true,audioCtx=null,combo=0,comboTimer=0,furnaceOpened=false,orderSeq=0,energySeq=0,soundscapeTimer=0,soundscapeBeat=0,urgencyStarted=false,triggeredEvents=[],stats={mistakes:0,falls:0,dashes:0,props:0,bestCombo:0,energyStreak:0,bestEnergyStreak:0};

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('hidden',s.id!==id));ui.hud.classList.toggle('hidden',id!=='play'&&id!=='pause');ui.touch.classList.toggle('hidden',id!=='play'||!settings.touch);state=id}
function showMenu(){paused=false;show('menu')}function showHow(){show('how')}
function showSettings(){updateSettings();show('settings')}
function toggleSetting(k){settings[k]=!settings[k];localStorage.setItem('pal-pixel-settings',JSON.stringify(settings));updateSettings()}
function updateSettings(){document.querySelector('#shakeSetting').textContent=settings.shake?'OUI':'NON';document.querySelector('#soundSetting').textContent=settings.sound?'OUI':'NON';document.querySelector('#touchSetting').textContent=settings.touch?'OUI':'NON'}
function starsHtml(n){return Array.from({length:3},(_,i)=>'<span class="pstar '+(i<n?'':'off')+'"></span>').join('')}
function starKey(i){let l=LAB_DATA.levels[i];return'pal-pixel-stars-id-'+(l&&l.id!==undefined?l.id:i)}
function legacyStarKey(i){return'pal-pixel-stars-'+i}
function bestStars(i){return Math.max(+(localStorage.getItem(starKey(i))||0),+(localStorage.getItem(legacyStarKey(i))||0))}
function teacherUnlocked(){return localStorage.getItem('pal-pixel-teacher')==='1'}
function isUnlocked(i){return teacherUnlocked()||i===0||bestStars(i-1)>0}
function asciiText(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-')}
function goalName(){return level&&level.mode==='energySort'?'ENERGIES':level&&level.theme==='foam'?'MELANGES':level&&level.theme==='fire'?'ANALYSES':'RAPPORTS'}
function secondaryText(l=level){return l&&l.secondary?'BONUS : '+l.secondary.label:''}
function eventText(l=level){return l&&l.events&&l.events.length?l.events.map(e=>Math.max(0,Math.floor((l.duration||0)-e.at))+'s : '+asciiText(e.message||e.type)).join(' · '):'AUCUNE ALERTE'}
function mechanicBadge(l=level){
 return ({atlas:'PAILLASSES',foam:'MOUSSE',fire:'NAVETTES',energy:'TRI',geyser:'GEYSERS',lava:'PONTS',belt:'TAPIS',cyclotron:'LASER'})[l.theme]||'MISSION'
}
function bonusBadge(l=level){
 return'VITE · PROPRE · SANS CHUTE'
}
function panicBadge(l=level){
 let e=l.events&&l.events[0];if(!e)return'CALME';
 if(e.type==='rushOrder')return'NOUVELLE FICHE';
 if(e.type==='foam')return'FUITE';
 if(e.type==='fire')return'FEU';
 if(e.type==='beltRush')return'TAPIS +';
 if(e.type==='geyserBurst')return'GEYSERS +';
 if(e.type==='bridgeDrop')return'PONTS INSTABLES';
 if(e.type==='blackout')return'COUPURE';
 return'ALERTE'
}
function secondaryDone(){
 let s=level.secondary;if(!s)return false;
 if(s.type==='noMistake')return stats.mistakes===0;
 if(s.type==='noFall')return stats.falls===0;
 if(s.type==='props')return stats.props>=s.target;
 if(s.type==='dash')return stats.dashes>=s.target;
 if(s.type==='combo')return stats.bestCombo>=s.target;
 if(s.type==='energyStreak')return stats.bestEnergyStreak>=s.target;
 return false
}
function secondaryProgress(){
 let s=level.secondary;if(!s)return'';
 if(s.type==='noMistake')return stats.mistakes===0?'BONUS INTACT : AUCUNE ERREUR':'BONUS PERDU : ERREUR';
 if(s.type==='noFall')return stats.falls===0?'BONUS INTACT : AUCUNE CHUTE':'BONUS PERDU : CHUTE';
 let n=s.type==='props'?stats.props:s.type==='dash'?stats.dashes:s.type==='combo'?stats.bestCombo:s.type==='energyStreak'?stats.bestEnergyStreak:(secondaryDone()?1:0);
 return s.label+' '+Math.min(n,s.target)+'/'+s.target
}
function upcomingEventStatus(){
 if(!level.events||!level.events.length)return'';
 let elapsed=level.duration-time,next=level.events.find((e,i)=>!triggeredEvents.includes(i)&&e.at>elapsed);
 if(!next)return'';
 let left=Math.ceil(next.at-elapsed);
 return left<=14?'ALERTE '+left+'s · '+(next.message||next.type):''
}
function popup(x,y,text,color='#ff5b48'){feedbacks.push({x,y,text,color,life:1.05,max:1.05});}
function teacherUnlock(){let code=prompt('Code professeur');if(code==='1234'){localStorage.setItem('pal-pixel-teacher','1');sfx('success');showLevels()}else{sfx('error')}}
function showLevels(){
 paused=false;let root=document.querySelector('#levels');root.innerHTML='<canvas id="campaignCanvas" width="500" height="280"></canvas><span class="mapLabel mapLabelA">ARCHIPEL ATLAS</span><span class="mapLabel mapLabelB">ATELIER ENERGIE</span><span class="mapLabel mapLabelC">ORBITE INTERDITE</span><span class="mapLabel mapLabelD">MER THERMALE</span><button class="teacherCode" onclick="teacherUnlock()">CODE PROF</button>';
 let spots=[[10,72],[26,58],[43,75],[55,50],[69,66],[81,44],[72,20],[91,16]];
 LAB_DATA.levels.forEach((l,i)=>{let best=bestStars(i),open=isUnlocked(i),b=document.createElement('button');b.className='level mapNode theme-'+l.theme+(open?'':' locked');b.disabled=!open;b.style.setProperty('--c',l.color);b.style.setProperty('--mx',(spots[i]||[50,50])[0]+'%');b.style.setProperty('--my',(spots[i]||[50,50])[1]+'%');b.innerHTML='<span class="nodePulse"></span><span class="missionNo">'+String(i+1).padStart(2,'0')+'</span><i class="missionIcon">'+l.icon+'</i><span class="nodeInfo"><strong>'+asciiText(l.name)+'</strong><small>'+(open?asciiText(l.difficulty||'MISSION'):'LOCK')+'</small><span class="missionStars">'+starsHtml(best)+'</span></span><span class="lockPlate">LOCK</span>';b.onclick=()=>open?brief(i):sfx('error');root.appendChild(b)});
 show('levelScreen')
}
function brief(i){
 if(!isUnlocked(i))return sfx('error');selected=i;let l=LAB_DATA.levels[i];level=l;
 document.querySelector('#briefIcon').textContent=l.icon;document.querySelector('#briefTitle').textContent=asciiText(l.name);
 document.querySelector('#briefText').textContent='';
 document.querySelector('#briefSignature').textContent=mechanicBadge(l);
 document.querySelector('#briefBonus').textContent=bonusBadge(l);
 document.querySelector('#briefEvent').textContent=panicBadge(l);
 document.querySelector('#briefRules').textContent=l.goal+' '+goalName();
 show('briefScreen')
}
function startSelected(){if(isUnlocked(selected))startLevel(selected);else showLevels()}
function restartLevel(){startLevel(selected)}
function resumeGame(){paused=false;show('play')}
function togglePause(){if(state!=='play'&&state!=='pause')return;paused=!paused;show(paused?'pause':'play')}

function tone(freq=220,dur=.08,type='square',vol=.035){if(!settings.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch(e){}}
function noise(dur=.08,vol=.025,cut=1000){
 if(!settings.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();let n=Math.ceil(audioCtx.sampleRate*dur),buf=audioCtx.createBuffer(1,n,audioCtx.sampleRate),a=buf.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);let src=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();src.buffer=buf;f.type='lowpass';f.frequency.value=cut;g.gain.value=vol;src.connect(f);f.connect(g);g.connect(audioCtx.destination);src.start()}catch(e){}
}
function sfx(name){
 if(name==='pickup'){tone(520,.045);setTimeout(()=>tone(720,.055),35)}
 else if(name==='place'){tone(270,.045,'square',.028);noise(.045,.015,500)}
 else if(name==='machine'){tone(360,.06,'square',.025);setTimeout(()=>tone(440,.08,'square',.02),55)}
 else if(name==='ready'){tone(680,.07);setTimeout(()=>tone(920,.1),60)}
 else if(name==='dash'){noise(.09,.035,1500);tone(760,.07,'sawtooth',.022)}
 else if(name==='success'){tone(660,.07);setTimeout(()=>tone(880,.08),65);setTimeout(()=>tone(1120,.12),130)}
 else if(name==='error'){tone(150,.16,'sawtooth',.04);setTimeout(()=>tone(105,.2,'sawtooth',.03),90)}
 else if(name==='spray'){noise(.34,.04,2600);tone(190,.25,'triangle',.018)}
 else if(name==='fire'){tone(120,.22,'sawtooth',.028);noise(.18,.025,650)}
}
function updateSoundscape(dt){
 if(!settings.sound)return;
 if(time<=60&&!urgencyStarted){
  urgencyStarted=true;cameraFade=Math.max(cameraFade,.12);impact(.16);
  [523,659,784,1047].forEach((n,i)=>setTimeout(()=>tone(n,.13,'square',.025),i*105));
 }
 soundscapeTimer-=dt;
 if(soundscapeTimer>0)return;
 let urgent=time<=60,beat=soundscapeBeat++,step=urgent?.52:1;
 if(level.theme==='atlas'){
  let notes=[392,494,587,659];tone(notes[beat%notes.length],.13,'triangle',.009);if(urgent&&beat%2===0)tone(notes[(beat+2)%4]*2,.055,'square',.006);
  soundscapeTimer=.62*step;
 }else if(level.theme==='foam'){
  let notes=[330,440,523,659];tone(notes[beat%notes.length],.22,'sine',.008);if(beat%3===0)noise(.06,.006,2600);
  soundscapeTimer=.78*step;
 }else if(level.theme==='fire'){
  tone([82,110,147,110][beat%4],.18,'sawtooth',.009);noise(.035,urgent?.011:.007,420);if(urgent&&beat%2)tone(294,.045,'square',.006);
  soundscapeTimer=.54*step;
 }else if(level.theme==='geyser'){
  tone([294,392,494,587][beat%4],.16,'triangle',.008);if(beat%2===0)noise(.075,.006,2200);
  soundscapeTimer=.7*step;
 }else if(level.theme==='lava'){
  tone([65,82,98,82][beat%4],.25,'sawtooth',.011);if(beat%2===0)noise(.09,.008,300);if(urgent)tone(196,.05,'square',.005);
  soundscapeTimer=.68*step;
 }else if(level.theme==='belt'){
  tone([196,247,294,247][beat%4],.07,'square',.008);noise(.035,.007,650);if(urgent&&beat%2===0)tone(392,.045,'square',.006);
  soundscapeTimer=.46*step;
 }else if(level.theme==='energy'){
  tone([262,330,392,523][beat%4],.08,'square',.009);if(beat%2===0)tone(131,.05,'triangle',.006);if(urgent)tone([659,784][beat%2],.045,'square',.007);
  soundscapeTimer=.42*step;
 }else{
  let notes=[220,277,330,415,554];tone(notes[beat%notes.length],.14,beat%2?'sine':'square',.007);if(urgent)tone(notes[(beat+2)%notes.length]*2,.04,'square',.005);
  soundscapeTimer=.48*step;
 }
}
function burst(x,y,color='#ffe35b',n=12,p=1){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,s=(.4+Math.random()*1.4)*p;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.8,life:.3+Math.random()*.5,size:1+Math.random()*3,color})}}
function impact(n=.3){shake=Math.max(shake,n*18);flash=Math.max(flash,n)}
function rectMap(x,y,w,h,v=0){for(let yy=Math.max(0,y);yy<Math.min(GH,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(GW,x+w);xx++)map[yy][xx]=v}
function startLevel(i){
 selected=i;level=LAB_DATA.levels[i];map=Array.from({length:GH},()=>Array(GW).fill(2));level.floors.forEach(r=>rectMap(...r,0));(level.holes||[]).forEach(r=>rectMap(...r,2));
 let built=level.machines.map(m=>m.slice()),used=new Set(built.map(m=>m[1]+','+m[2]));(level.benches||[]).forEach(r=>{for(let y=r[1];y<r[1]+r[3];y++)for(let x=r[0];x<r[0]+r[2];x++)if(map[y]&&map[y][x]===0&&!used.has(x+','+y)){built.push(['counter',x,y]);used.add(x+','+y)}});machines=built.map((m,k)=>({type:m[0],x:m[1]+.5,y:m[2]+.5,baseX:m[1]+.5,baseY:m[2]+.5,id:k,item:null,busy:0,duration:0,ready:0,fire:0,off:false}));
 movingIslands=(level.movingIslands||[]).map((q,id)=>({...q,id,ox:0,oy:0,prevOx:0,prevOy:0}));
 rollingCarts=(level.rollingCarts||[]).map((c,id)=>({...c,id,w:c.w||.9,h:c.h||.62,baseX:c.x,baseY:c.y,bump:0}));
 movingIslands.forEach(q=>{
  for(let y=Math.floor(q.y);y<Math.ceil(q.y+q.h);y++)for(let x=Math.floor(q.x);x<Math.ceil(q.x+q.w);x++)if(map[y])map[y][x]=2;
  machines.forEach(m=>{if(m.baseX>q.x&&m.baseX<q.x+q.w&&m.baseY>q.y&&m.baseY<q.y+q.h)m.islandId=q.id})
 });
 let sp=findSpawn();player={x:sp.x,y:sp.y,vx:0,vy:0,dir:0,carry:null,dash:0,dashCd:0,dashHeld:false,spray:0,celebrate:0,inv:1,lavaGrace:.2,rideId:null};
 foamZones=level.theme==='foam'?[
  {x:7.2,y:4.7,r:.72,max:2.15,grow:.009,phase:0},
  {x:13.2,y:4.8,r:.62,max:1.85,grow:.008,phase:1.7},
  {x:10.4,y:8.1,r:.52,max:1.65,grow:.007,phase:3.2}
 ]:[];
 geysers=level.theme==='geyser'?(level.geysers||[{x:5,y:5,phase:0},{x:7,y:5,phase:1.2},{x:12,y:5,phase:2.4},{x:14,y:5,phase:3.6}]):[];
 steamJets=level.theme==='fire'?[{x:4.5,y:4.5,phase:0},{x:15.5,y:4.5,phase:2.2},{x:4.5,y:8.5,phase:4.1},{x:15.5,y:8.5,phase:1.1}]:[];
 lavaBridges=level.theme==='lava'?(level.lavaBridges||[{x:5,y:2,w:3,h:1,phase:0},{x:11,y:2,w:3,h:1,phase:2},{x:5,y:8,w:3,h:1,phase:2},{x:11,y:8,w:3,h:1,phase:0}]):[];
 furnaceOpened=false;props=makeProps();orders=[];energyItems=[];feedbacks=[];particles=[];fallFx=[];score=0;served=0;combo=0;comboTimer=0;time=level.duration;spawnTimer=5;energySpawn=.65;energyBrake=0;energyRush=0;beltBoost=0;bridgeBoost=0;bridgePanic=0;respawnTimer=0;respawnTarget=null;incidentTimer=level.theme==='foam'?28:level.theme==='fire'?22:14;hazardPause=0;beamAngle=0;flash=0;shake=0;camX=camY=0;cameraFade=1;soundscapeTimer=.25;soundscapeBeat=0;urgencyStarted=false;triggeredEvents=[];stats={mistakes:0,falls:0,dashes:0,props:0,bestCombo:0,energyStreak:0,bestEnergyStreak:0};paused=false;keys={};if(level.mode==='energySort'){spawnEnergy();energySpawn=1.1}else{spawnOrder();spawnOrder()}show('play');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)
}
function makeProps(){
 let set={
  atlas:[['puddle',4.2,5.3],['crate',15.8,6.4],['switch',10.5,4.5]],
  foam:[['valve',2.7,6.3]],
  fire:[],
  geyser:[['crate',9.5,7.8],['valve',4.2,4.8],['valve',15.8,6.4]],
  energy:[['crate',17.2,6.7],['puddle',10.4,5.7],['switch',3.8,8.2]],
  lava:[['crate',4.1,9.4],['switch',10.5,5.5],['crystal',16.7,5.7]],
  belt:[['crate',2.7,4.1],['crate',17.1,8.2],['puddle',10.3,7.3]],
  cyclotron:[['crystal',4.3,5.1],['crystal',15.8,6.5],['switch',10.5,8.5]]
 }[level.theme]||[];
 return set.map((p,i)=>({type:p[0],x:p[1],y:p[2],id:i,active:true,cool:0}))
}
function findSpawn(){
 let dock=machines.find(m=>isDepositType(m.type)||m.type==='delivery'),cells=[];
 for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++){
  let px=x+.5,py=y+.5;if(map[y][x]!==0||machines.some(m=>machineBlocksPoint(m,px,py)))continue;
  let dockDistance=dock?distanceToMachine(dock,px,py):8;if(dock&&dockDistance<4.5)continue;
  let danger=machines.filter(m=>['combust','waste'].includes(m.type)).reduce((n,m)=>Math.min(n,distanceToMachine(m,px,py)),9);
  cells.push({x:px,y:py,score:dockDistance*4+Math.min(danger,4)-Math.hypot(px-GW/2,py-GH/2)*.15})
 }
 cells.sort((a,b)=>b.score-a.score);return cells[0]||{x:2.5,y:2.5}
}
function tile(x,y){let xx=Math.floor(x),yy=Math.floor(y);return map[yy]?map[yy][xx]:2}
function islandContains(q,x,y,ox=q.ox,oy=q.oy,pad=0){
 return x>=q.x+ox+pad&&x<=q.x+ox+q.w-pad&&y>=q.y+oy+pad&&y<=q.y+oy+q.h-pad
}
function supportingIsland(x,y){
 return movingIslands.find(q=>islandContains(q,x,y))
}
function activeBridgeAt(x,y){return level.theme==='lava'&&lavaBridges.some(b=>bridgeOn(b)&&x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h)}
function supported(x,y){return tile(x,y)===0||!!supportingIsland(x,y)||activeBridgeAt(x,y)}
function fallKindAt(x,y){
 if(supported(x,y)&&!inactiveBridge(x,y))return null;
 if(level.theme==='lava'||level.theme==='fire'||inactiveBridge(x,y))return'lava';
 if(level.theme==='cyclotron'||level.theme==='belt')return'void';
 return'water'
}
function machineBounds(m){
 if(m.type==='delivery')return{hx:1.32,hy:.48};
 if(m.type==='renewDepot'||m.type==='nonrenewDepot')return{hx:1.05,hy:.52};
 if(m.type==='energySource')return{hx:1.1,hy:.5};
 if(m.type==='mix')return{hx:1.08,hy:.48};
 if(m.type==='filter')return{hx:1.02,hy:.48};
 if(m.type==='rack')return{hx:.98,hy:.48};
 if(['ext','waste'].includes(m.type))return{hx:.7,hy:.46};
 if(m.type==='counter')return{hx:.5,hy:.46};
 return{hx:.88,hy:.48}
}
function machineBlocksPoint(m,x,y){
 let b=machineBounds(m);return Math.abs(x-m.x)<b.hx&&Math.abs(y-m.y)<b.hy
}
function distanceToMachine(m,x,y){
 let b=machineBounds(m),dx=Math.max(0,Math.abs(x-m.x)-b.hx),dy=Math.max(0,Math.abs(y-m.y)-b.hy);return Math.hypot(dx,dy)
}
function isDepositType(type){return type==='renewDepot'||type==='nonrenewDepot'}
function geyserOn(g){return ((performance.now()*.001+g.phase)%5)<1.55}
function steamPhase(g){return (performance.now()*.001+g.phase)%6.5}
function steamOn(g){return steamPhase(g)<.85}
function steamWarn(g){return steamPhase(g)>5.1}
function bridgeOn(b){if(bridgeBoost>0)return true;let cycle=bridgePanic>0?4.2:6,on=bridgePanic>0?2.25:4.3;return ((performance.now()*.001+b.phase)%cycle)<on}
function bridgeWarn(b){if(bridgeBoost>0)return false;let cycle=bridgePanic>0?4.2:6,on=bridgePanic>0?2.25:4.3,p=(performance.now()*.001+b.phase)%cycle;return p>on-.9&&p<on}
function inactiveBridge(x,y){return lavaBridges.some(b=>!bridgeOn(b)&&x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h)}
function beltAt(x,y){
 let belts=level&&level.belts?level.belts:[];
 return belts.find(b=>x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h)||null
}
function beltPower(b){return (b.speed||4.6)*(beltBoost>0?1.65:1)}
function beltDirection(y){return Math.floor(y)%4===1?1:-1}
function cartBlocksPoint(c,x,y){
 return Math.abs(x-c.x)<(c.w||.9)*.5&&Math.abs(y-c.y)<(c.h||.62)*.5
}
function guardedDock(x,y){return level.theme==='fire'&&(level.docks||[]).some(d=>x>d.x&&x<d.x+d.w&&y>d.y&&y<d.y+d.h)}
function shuttleWave(q){
 let cycle=2.5/q.speed,p=((performance.now()*.001+q.phase)%cycle)/cycle;
 if(p<.24)return-1;
 if(p<.5){let n=(p-.24)/.26;return-1+2*(n*n*(3-2*n))}
 if(p<.74)return 1;
 let n=(p-.74)/.26;return 1-2*(n*n*(3-2*n))
}
function blocks(x,y){
 if(!supported(x,y)&&guardedDock(x,y))return true;
 if(machines.some(m=>machineBlocksPoint(m,x,y)))return true;
 if(props.some(p=>p.type==='crate'&&Math.hypot(p.x-x,p.y-y)<.62))return true;
 if(rollingCarts.some(c=>cartBlocksPoint(c,x,y)))return true;
 if(level.theme==='geyser'&&geysers.some(g=>geyserOn(g)&&Math.hypot(g.x+.5-x,g.y+.5-y)<.55))return true;
 return false
}
function inFoam(x,y){return foamSlowdown&&level.theme==='foam'&&foamZones.some(z=>Math.hypot(x-z.x,y-z.y)<z.r)}
function inPuddle(x,y){return props.some(p=>p.type==='puddle'&&Math.hypot(p.x-x,p.y-y)<.7)}
function triggerDash(){if(state!=='play'||respawnTimer>0||player.dashCd>0||player.dash>0)return;stats.dashes++;player.dash=.31;player.dashCd=DASH_CD;player.dashFx=0;let l=Math.hypot(player.vx,player.vy);if(l<.3){player.vx=Math.cos(player.dir)*15.5;player.vy=Math.sin(player.dir)*15.5}else{player.vx=player.vx/l*15.5;player.vy=player.vy/l*15.5}impact(.16);sfx('dash');burst(player.x*T,player.y*T,'#d9ffff',20,1.7)}
function move(dt){
 player.dashCd=Math.max(0,player.dashCd-dt);player.dash=Math.max(0,player.dash-dt);player.inv=Math.max(0,player.inv-dt);if(player.dash>0){player.dashFx=(player.dashFx||0)-dt;if(player.dashFx<=0){player.dashFx=.035;burst(player.x*T,player.y*T,'#b9eff0',3,.5)}}
 let dx=(keys.d||keys.arrowright?1:0)-(keys.q||keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.z||keys.w||keys.arrowup?1:0),l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
 if(dx||dy)player.dir=Math.atan2(dy,dx);let slow=inFoam(player.x,player.y),slip=inPuddle(player.x,player.y),speed=slow?2.75:slip?6.85:5.75,steer=player.dash>0?2.8:slip?4.5:24;
 player.vx+=(dx*speed-player.vx)*Math.min(1,dt*steer);player.vy+=(dy*speed-player.vy)*Math.min(1,dt*steer);
 let belt=beltAt(player.x,player.y);
 if(level.theme==='belt'&&belt){let p=beltPower(belt);if((belt.axis||'x')==='y')player.vy+=dt*p*belt.dir;else player.vx+=dt*p*belt.dir}
 let nx=player.x+player.vx*dt,ny=player.y+player.vy*dt;
 if(!blocks(nx+.32*Math.sign(player.vx),player.y))player.x=nx;else{if(player.dash>0){pushCrate(nx+.32*Math.sign(player.vx),player.y,Math.sign(player.vx),0);impact(.16);tone(160,.05);burst(player.x*T,player.y*T,'#fff0b5',8,.8)}player.vx*=-.22}
 if(!blocks(player.x,ny+.32*Math.sign(player.vy)))player.y=ny;else{if(player.dash>0){pushCrate(player.x,ny+.32*Math.sign(player.vy),0,Math.sign(player.vy));impact(.16);tone(160,.05);burst(player.x*T,player.y*T,'#fff0b5',8,.8)}player.vy*=-.22}
 if(player.rideId!==null&&!supportingIsland(player.x,player.y))player.rideId=null;
 let fallKind=fallKindAt(player.x,player.y);
 player.lavaGrace=fallKind?Math.max(player.dash>0?.34:0,(player.lavaGrace||0)-dt):.22;
 if(fallKind&&player.lavaGrace<=0)fall(fallKind);
 camX+=(Math.max(-13,Math.min(13,player.vx*1.45))-camX)*Math.min(1,dt*8);camY+=(Math.max(-8,Math.min(8,player.vy*1.05))-camY)*Math.min(1,dt*8);
}
function pushCrate(x,y,dx,dy){let p=props.find(p=>p.type==='crate'&&Math.hypot(p.x-x,p.y-y)<.78);if(!p)return;let nx=p.x+dx,ny=p.y+dy;if(tile(nx,ny)===0&&!machines.some(m=>Math.hypot(m.x-nx,m.y-ny)<.8)&&!props.some(q=>q!==p&&q.type==='crate'&&Math.hypot(q.x-nx,q.y-ny)<.8)){p.x=nx;p.y=ny;burst(p.x*T,p.y*T,'#e5bd73',8,.7);tone(210,.05)}}
function updateConveyors(dt){
 if(level.theme!=='belt')return;
 props.filter(p=>p.type==='crate').forEach(p=>{
  let b=beltAt(p.x,p.y);if(!b)return;
  let axis=b.axis||'x',push=beltPower(b)*.16*dt*b.dir,nx=p.x+(axis==='x'?push:0),ny=p.y+(axis==='y'?push:0);
  if(tile(nx,ny)!==0||machines.some(m=>machineBlocksPoint(m,nx,ny))||props.some(q=>q!==p&&q.type==='crate'&&Math.hypot(q.x-nx,q.y-ny)<.62))return;
  p.x=nx;p.y=ny;p.beltBob=(p.beltBob||0)+dt*12;
 })
}
function updateRollingCarts(dt){
 if(!rollingCarts.length)return;
 rollingCarts.forEach(c=>{
  let axis=c.axis||'x',prevX=c.x,prevY=c.y,v=(c.speed||1)*(beltBoost>0?1.45:1)*dt*(c.dir||1);
  if(axis==='x'){c.x+=v;if(c.x<c.min){c.x=c.min;c.dir=1;c.bump=.22}else if(c.x>c.max){c.x=c.max;c.dir=-1;c.bump=.22}}
  else{c.y+=v;if(c.y<c.min){c.y=c.min;c.dir=1;c.bump=.22}else if(c.y>c.max){c.y=c.max;c.dir=-1;c.bump=.22}}
  c.vx=c.x-prevX;c.vy=c.y-prevY;c.bump=Math.max(0,(c.bump||0)-dt);
  if(player&&!player.hidden&&cartBlocksPoint(c,player.x,player.y)){
   let dx=axis==='x'?Math.sign(c.vx||c.dir):0,dy=axis==='y'?Math.sign(c.vy||c.dir):0;
   player.x+=dx*.18;player.y+=dy*.18;player.vx+=dx*3.2;player.vy+=dy*3.2;c.bump=.22;
   impact(.12);tone(180,.04,'square',.015);
  }
 })
}
function fall(kind=fallKindAt(player.x,player.y)||'void'){
 if(respawnTimer>0)return;
 let fx=player.x*T,fy=player.y*T;
 stats.falls++;score=Math.max(0,score-40);impact(kind==='void'?.62:.55);cameraFade=Math.max(cameraFade,.3);
 if(kind==='water'){noise(.22,.04,1800);tone(180,.1,'sine',.02)}
 else if(kind==='lava'){tone(92,.3,'sawtooth',.038);noise(.24,.035,520)}
 else{tone(70,.28,'sawtooth',.03);noise(.18,.025,360)}
 fallFx.push({x:player.x,y:player.y,kind,life:.78,max:.78});
 burst(fx,fy,kind==='water'?'#bdf6ff':kind==='lava'?'#ff8a30':'#bda7ff',kind==='void'?20:30,kind==='void'?1.5:2.1);burst(fx,fy,kind==='lava'?'#ffe284':kind==='water'?'#eaffff':'#332947',12,1.35);
 if(player.carry&&!player.carry.tool)player.carry=null;player.rideId=null;
 respawnTarget=findSpawn();respawnTimer=kind==='lava'?3.6:3.2;player.hidden=true;player.vx=player.vy=0;player.dash=0;player.inv=respawnTimer+.5
}
function updateRespawn(dt){
 if(respawnTimer<=0)return false;
 respawnTimer=Math.max(0,respawnTimer-dt);player.vx=player.vy=0;player.dash=0;
 if(respawnTimer<=0){let s=respawnTarget||findSpawn();player.x=s.x;player.y=s.y;player.hidden=false;player.rideId=null;player.lavaGrace=.22;player.inv=1;respawnTarget=null;cameraFade=Math.max(cameraFade,.18);burst(player.x*T,player.y*T,'#ffe19a',12,.75);tone(520,.07)}
 return true
}
function hurt(){if(player.inv>0)return;score=Math.max(0,score-25);player.inv=1;impact(.3);tone(150,.16,'sawtooth');player.vx*=-2;player.vy*=-2}
function nearest(){
 let n=null,best=99,fx=Math.cos(player.dir),fy=Math.sin(player.dir);
 machines.forEach(m=>{let q=distanceToMachine(m,player.x,player.y);if(q>.9)return;let dx=m.x-player.x,dy=m.y-player.y,l=Math.hypot(dx,dy)||1,dot=(dx/l)*fx+(dy/l)*fy,score=q+(q>.12&&dot<.2?.72-dot*.25:0);if(score<best){best=score;n=m}});
 return n
}
function nearestProp(){let n=null,d=1.2;props.forEach(p=>{if(p.type==='puddle'||p.type==='crate'||!p.active)return;let q=Math.hypot(p.x-player.x,p.y-player.y);if(q<d){d=q;n=p}});return n}
function sample(color='#6fc9e7',orderId=null){return{steps:[],report:false,label:false,ruined:false,color,baseColor:color,orderId}}
function exactSteps(a,b){return a.length===b.length&&a.every((x,i)=>x===b[i])}
function activeOrders(){return orders.filter(o=>!o.status)}
function recipeForSample(s){return s.orderId!==null?activeOrders().find(o=>o.id===s.orderId&&(!o.start||o.start===s.baseColor)&&s.steps.every((step,i)=>step===o.need[i])):activeOrders().find(o=>(!o.start||o.start===s.baseColor)&&s.steps.every((step,i)=>step===o.need[i]))}
function sampleStillValid(s){return !!recipeForSample(s)}
function nextStepForSample(s){let o=recipeForSample(s);return o?(s.steps.length<o.need.length?o.need[s.steps.length]:'delivery'):null}
function matchingOrder(s){return s.orderId!==null?activeOrders().find(o=>o.id===s.orderId&&(!o.start||o.start===s.baseColor)&&exactSteps(s.steps,o.need)):activeOrders().find(o=>(!o.start||o.start===s.baseColor)&&exactSteps(s.steps,o.need))}
function orderSample(o){
 let samples=[player&&player.carry,...machines.map(m=>m.item)].filter(s=>s&&!s.tool&&s.orderId===o.id&&(!o.start||o.start===s.baseColor)&&s.steps.every((step,i)=>step===o.need[i]));
 return samples.sort((a,b)=>b.steps.length-a.steps.length)[0]||null
}
function markOrderError(sample){
 let matching=sample&&activeOrders().find(o=>o.id===sample.orderId)||sample&&activeOrders().find(o=>(!o.start||o.start===sample.baseColor));
 if(matching)matching.error=.62
}
function recommendedType(){if(!player||!player.carry)return null;if(player.carry.tool)return machines.some(m=>m.fire)?'fire':null;return nextStepForSample(player.carry)}
function energyTarget(c){return c&&c.energy?(c.category==='renewable'?'renewDepot':'nonrenewDepot'):null}
function randomEnergyItem(){
 let src=LAB_DATA.energyItems[Math.floor(Math.random()*LAB_DATA.energyItems.length)];
 return{...src,energy:true,id:++energySeq,x:level.energy.spawnX,y:level.energy.beltY,v:level.energy.speed*(energyRush>0?1.16:1),bob:Math.random()*6}
}
function spawnEnergy(){if(level.mode!=='energySort')return;energyItems.push(randomEnergyItem());sfx('place')}
function updateEnergy(dt){
 energyBrake=Math.max(0,energyBrake-dt);energyRush=Math.max(0,energyRush-dt);energySpawn-=dt;
 if(energySpawn<=0){if(energyItems.length<7)spawnEnergy();let e=level.energy,pace=energyBrake>0?1.35:1;energySpawn=(e.spawnMin+Math.random()*(e.spawnMax-e.spawnMin))*pace}
 let mult=energyBrake>0?.45:1;
 energyItems.forEach(e=>{e.x+=e.v*mult*dt;e.bob+=dt*5.5;if(e.x>level.energy.exitX){e.dead=true;stats.mistakes++;stats.energyStreak=0;score=Math.max(0,score-20);combo=0;comboTimer=0;sfx('error');popup(e.x,e.y,'PERDU','#ff5b48')}});
 energyItems=energyItems.filter(e=>!e.dead)
}
function nearestEnergy(){
 if(!player||player.carry)return null;let best=null,d=.82;
 energyItems.forEach(e=>{let q=Math.hypot(e.x-player.x,e.y-player.y);if(q<d){d=q;best=e}});
 return best
}
function foamBurst(x,y,power=1){
 if(level.theme!=='foam')return;foamZones.push({x,y,r:.25,max:1.1+power*.7,grow:.08+power*.02,phase:Math.random()*6});impact(.32);tone(105,.22,'sawtooth');burst(x*T,y*T,'#e9fff0',28,1.5)
}
function eventToast(text,color='#ffe36d'){
 if(!text)return;popup(player?player.x:10,player?player.y-1:6,text,color);cameraFade=Math.max(cameraFade,.12);impact(.18)
}
function forceMachineOff(types,seconds=5){
 let pool=machines.filter(m=>!['rack','ext','waste','delivery','counter','renewDepot','nonrenewDepot','energySource'].includes(m.type));
 if(types)pool=pool.filter(m=>types.includes(m.type));
 pool.slice(0,Math.max(1,Math.ceil(pool.length*.45))).forEach(m=>{m.forcedOff=Math.max(m.forcedOff||0,seconds);burst(m.x*T,m.y*T,'#b5d1ff',10,.8)})
}
function scriptedFire(target){
 let pool=machines.filter(m=>m.type===target&&!m.fire);
 if(!pool.length)pool=machines.filter(m=>!['rack','ext','waste','delivery','counter','renewDepot','nonrenewDepot','energySource'].includes(m.type)&&!m.fire);
 let m=pool.find(m=>m.item||m.busy>0||m.ready>0)||pool[0];
 if(!m)return;m.fire=.01;popup(m.x,m.y,'SURCHAUFFE','#ffb13d');burst(m.x*T,m.y*T,'#ff8a31',20,1.25);sfx('fire')
}
function runScriptedEvents(dt){
 let elapsed=level.duration-time;
 (level.events||[]).forEach((e,i)=>{
  if(triggeredEvents.includes(i)||elapsed<e.at)return;
  triggeredEvents.push(i);eventToast(e.message||'ALERTE');
  if(e.type==='foam')foamBurst(e.x||10,e.y||7,e.power||1);
  else if(e.type==='fire')scriptedFire(e.target);
  else if(e.type==='geyserBurst'){hazardPause=0;geysers.forEach(g=>{g.phase=-performance.now()*.001+.15});noise(.22,.025,2600);burst(10*T,6*T,'#ccffff',34,1.8)}
  else if(e.type==='beltRush'&&level.energy){energyRush=12;energySpawn=Math.min(energySpawn,.35);popup(10,5,'TAPIS +','#ffe36d')}
  else if(e.type==='beltRush'){beltBoost=10;popup(10,6,'TAPIS +','#ffe36d')}
  else if(e.type==='rushOrder'&&level.mode!=='energySort'){spawnOrder();spawnTimer=11;popup(10,5,'NOUVELLE FICHE','#ffe36d');tone(920,.12,'square',.025)}
  else if(e.type==='bridgeDrop'){bridgePanic=11;bridgeBoost=0;popup(10,5,'PONTS RAPIDES','#ffb13d');noise(.18,.022,500)}
  else if(e.type==='blackout'){forceMachineOff(['centrifuge','density','cool','ph','mix'],6.5);tone(82,.3,'sawtooth',.035)}
 })
}
function interact(){
 if(state!=='play'||paused||respawnTimer>0)return;let m=nearest(),p=nearestProp(),e=nearestEnergy();if(e&&!player.carry){player.carry={...e};e.dead=true;energyItems=energyItems.filter(q=>q!==e);sfx('pickup');return}if(!m&&p){p.active=false;p.cool=8;stats.props++;hazardPause=Math.max(hazardPause,5);if(level.theme==='foam'&&p.type==='valve'){foamZones.forEach(z=>z.r=Math.max(.2,z.r-.55));cameraFade=Math.max(cameraFade,.06);popup(p.x,p.y,'MOUSSE -','#c8ffd1')}else if(level.mode==='energySort'&&p.type==='switch'){energyBrake=6.5;popup(p.x,p.y,'TAPIS LENT','#ffe36d')}else if(p.type==='switch'){popup(p.x,p.y,'DANGER OFF','#ffe36d')}else if(p.type==='crystal'){bridgeBoost=7;bridgePanic=0;popup(p.x,p.y,'PONTS STABLES','#d984ff')}score+=15;tone(740,.1);burst(p.x*T,p.y*T,p.type==='crystal'?'#d984ff':'#9ff0eb',20,1.2);impact(.12);return}if(!m)return;let c=player.carry;
 if(m.fire){if(c&&c.tool){player.dir=Math.atan2(m.y-player.y,m.x-player.x);player.spray=.55;m.fire=0;m.ready=0;score+=20;cameraFade=Math.max(cameraFade,.09);sfx('spray');burst(m.x*T,m.y*T,'#dffaff',24,1.4);impact(.15)}return}
 if(m.off)return;
 if(m.type==='rack'&&!c){let active=[player.carry,...machines.map(m=>m.item)].filter(Boolean).map(s=>s.orderId),wanted=activeOrders().find(o=>!active.includes(o.id))||activeOrders()[0];player.carry=sample(wanted&&wanted.start?wanted.start:'#6fc9e7',wanted?wanted.id:null);sfx('pickup');return}
 if(m.type==='ext'&&!c){player.carry={tool:true};sfx('pickup');return}
 if(m.type==='waste'&&c){player.carry=null;score=Math.max(0,score-5);tone(180,.08);burst(m.x*T,m.y*T,'#b8e7d2',10,.8);return}
 if(m.type==='counter'){if(c&&!m.item){m.item=c;player.carry=null;sfx('place')}else if(!c&&m.item){player.carry=m.item;m.item=null;sfx('pickup')}return}
 if(isDepositType(m.type)){
  if(c&&c.energy){let ok=energyTarget(c)===m.type;player.carry=null;if(ok){served++;stats.energyStreak++;stats.bestEnergyStreak=Math.max(stats.bestEnergyStreak,stats.energyStreak);combo=comboTimer>0?combo+1:1;stats.bestCombo=Math.max(stats.bestCombo,combo);comboTimer=7;score+=90+combo*15;time=Math.min(level.duration,time+1.5);cameraFade=Math.max(cameraFade,.05);sfx('success');burst(m.x*T,m.y*T,m.type==='renewDepot'?'#71e285':'#e0b36b',24,1.4);popup(m.x,m.y,'OK','#71e285');impact(.18);if(served>=level.goal)finish(true)}else{stats.mistakes++;stats.energyStreak=0;combo=0;comboTimer=0;score=Math.max(0,score-60);sfx('error');burst(m.x*T,m.y*T,'#d95445',18,1.1);popup(m.x,m.y,'MAUVAIS','#ff5b48');impact(.22)}}
  return
 }
 if(m.type==='delivery'){
  if(c&&!c.tool){let o=matchingOrder(c);if(o){o.status='complete';o.statusTime=.72;player.carry=null;player.celebrate=.7;served++;combo=comboTimer>0?combo+1:1;stats.bestCombo=Math.max(stats.bestCombo,combo);comboTimer=9;score+=100+Math.ceil(o.time)*2+combo*20;time=Math.min(level.duration,time+3);spawnTimer=Math.min(spawnTimer,1.2);foamZones.forEach(z=>z.r=Math.max(.18,z.r-.34));cameraFade=Math.max(cameraFade,.07);sfx('success');burst(m.x*T,m.y*T,'#75ee8e',28,2);popup(m.x,m.y,'VALIDE','#75ee8e');impact(.3);if(served>=level.goal)finish(true)}else{stats.mistakes++;markOrderError(c);player.carry=null;combo=0;comboTimer=0;score=Math.max(0,score-50);sfx('error');popup(m.x,m.y,'RATE','#ff5b48');foamBurst(m.x,m.y,1.2)}}return
 }
 if(m.busy>0)return;
 if(!c&&m.item){player.carry=m.item;m.item=null;m.ready=0;sfx('pickup');return}
 if(c&&c.tool)return;
 if(c&&!m.item){
  player.carry=null;m.item=c;m.duration=MACHINE_TIMES[m.type]||1.5;m.busy=m.duration;m.ready=0;m.soundTick=.18;m.processPulse=0;m.failFx=0;sfx('machine')
 }
}
function throwCarry(){
 if(state!=='play'||paused||respawnTimer>0||!player.carry)return;let tx=player.x+Math.cos(player.dir)*1.55,ty=player.y+Math.sin(player.dir)*1.55,n=machines.filter(m=>m.type==='counter'&&!m.item).sort((a,b)=>Math.hypot(a.x-tx,a.y-ty)-Math.hypot(b.x-tx,b.y-ty))[0];if(!n||Math.hypot(n.x-tx,n.y-ty)>1.1)return sfx('error');n.item=player.carry;player.carry=null;sfx('place');burst(n.x*T,n.y*T,'#fff2b0',8,.65)
}
function updateMachines(dt){
 machines.forEach(m=>{
  m.failFx=Math.max(0,(m.failFx||0)-dt);
  if(m.busy>0&&!m.fire&&!m.off){m.busy-=dt;m.processPulse=(m.processPulse||0)+dt;m.soundTick=(m.soundTick||0)-dt;if(m.soundTick<=0){let cadence={mix:.16,filter:.36,distill:.3,combust:.2,cool:.28,centrifuge:.13,co2:.22,ph:.34,water:.27}[m.type]||.3,freq={mix:310,filter:470,distill:530,combust:180,cool:650,centrifuge:410,co2:260,ph:560,water:720}[m.type]||390;m.soundTick=cadence;tone(freq,.025,m.type==='combust'?'sawtooth':'square',.009)}if(m.busy<=0){m.busy=0;if(m.type==='report')m.item.report=true;if(m.type==='label')m.item.label=true;m.item.steps.push(m.type);m.item.color=LAB_DATA.machines[m.type].color;if(!sampleStillValid(m.item)){m.item.ruined=true;m.failFx=.95;markOrderError(m.item);sfx('error');stats.mistakes++;popup(m.x,m.y,'MELANGE RATE','#ff8a5b');burst(m.x*T,m.y*T,'#9a684f',22,1.15);cameraFade=Math.max(cameraFade,.08)}else{sfx('ready');popup(m.x,m.y,'PRET','#ffe35b');burst(m.x*T,m.y*T,'#ffe35b',10,1)}m.ready=.01}}
  if(m.ready>0&&m.item&&!m.fire){m.ready+=dt;let limit=level.theme==='fire'?20:18;if(m.ready>limit){m.fire=.01;impact(.3);sfx('fire')}}
  if(m.fire>0){m.fire+=dt;m.fireTick=(m.fireTick||0)-dt;if(m.fireTick<=0){m.fireTick=.65+Math.random()*.35;noise(.08,.009,520)}if(Math.hypot(player.x-m.x,player.y-m.y)<.85)hurt()}
 })
}
function updateMovingIslands(){
 if(level.theme!=='fire')return;
 movingIslands.forEach(q=>{
  q.prevOx=q.ox;q.prevOy=q.oy;
  let wave=shuttleWave(q)*q.amp;
 q.ox=q.axis==='x'?wave:0;q.oy=q.axis==='y'?wave:0;
  let dx=q.ox-q.prevOx,dy=q.oy-q.prevOy;
  let standing=player&&((player.rideId===q.id&&islandContains(q,player.x,player.y,q.prevOx,q.prevOy,-.08))||(tile(player.x,player.y)!==0&&islandContains(q,player.x,player.y,q.prevOx,q.prevOy)));
  if(standing){player.x+=dx;player.y+=dy}
  machines.filter(m=>m.islandId===q.id).forEach(m=>{m.x=m.baseX+q.ox;m.y=m.baseY+q.oy})
 })
}
function assistBoarding(){
 if(level.theme!=='fire'||tile(player.x,player.y)!==0)return;
 let ix=(keys.d||keys.arrowright?1:0)-(keys.q||keys.a||keys.arrowleft?1:0),iy=(keys.s||keys.arrowdown?1:0)-(keys.z||keys.w||keys.arrowup?1:0);
 if(!ix&&!iy){let fx=Math.cos(player.dir),fy=Math.sin(player.dir);if(Math.abs(fx)>.72)ix=Math.sign(fx);else if(Math.abs(fy)>.72)iy=Math.sign(fy)}
 movingIslands.forEach(q=>{
  let l=q.x+q.ox,r=l+q.w,t=q.y+q.oy,b=t+q.h;
  if(q.axis==='x'&&player.y>t-.7&&player.y<b+.7){
   if(ix<0&&l<player.x&&player.x-r<.55){player.x=Math.min(r-.08,player.x);player.y=Math.max(t+.12,Math.min(b-.12,player.y));player.rideId=q.id}
   if(ix>0&&r>player.x&&l-player.x<.55){player.x=Math.max(l+.08,player.x);player.y=Math.max(t+.12,Math.min(b-.12,player.y));player.rideId=q.id}
  }
  if(q.axis==='y'&&player.x>l-.7&&player.x<r+.7){
   if(iy<0&&t<player.y&&player.y-b<.55){player.y=Math.min(b-.08,player.y);player.x=Math.max(l+.12,Math.min(r-.12,player.x));player.rideId=q.id}
   if(iy>0&&b>player.y&&t-player.y<.55){player.y=Math.max(t+.08,player.y);player.x=Math.max(l+.12,Math.min(r-.12,player.x));player.rideId=q.id}
  }
 })
}
function assistDisembark(){
 if(level.theme!=='fire'||player.rideId===null)return;
 let q=movingIslands.find(q=>q.id===player.rideId);if(!q)return;
 let l=q.x+q.ox,r=l+q.w,t=q.y+q.oy,b=t+q.h,fx=Math.cos(player.dir),fy=Math.sin(player.dir),nx=player.x,ny=player.y;
 if(q.axis==='x'&&fx<-.55)nx=l-.13;
 else if(q.axis==='x'&&fx>.55)nx=r+.13;
 else if(q.axis==='y'&&fy<-.55)ny=t-.13;
 else if(q.axis==='y'&&fy>.55)ny=b+.13;
 if(tile(nx,ny)===0){player.x=nx;player.y=ny;player.rideId=null;player.lavaGrace=.22;burst(player.x*T,player.y*T,'#ffe19a',5,.35)}
}
function updateHazards(dt){
 hazardPause=Math.max(0,hazardPause-dt);props.forEach(p=>{p.cool=Math.max(0,p.cool-dt);if(!p.active&&p.cool<=0)p.active=true});
 if(level.theme==='foam')foamZones.forEach(z=>z.r=Math.min(z.max,z.r+z.grow*dt*1.35));
 if(hazardPause>0){machines.forEach(m=>m.off=false);return}
 if(level.theme==='geyser')geysers.forEach(g=>{let on=geyserOn(g);if(on&&!g.wasOn){noise(.16,.012,2400);tone(210,.12,'sine',.007)}g.wasOn=on;if(on&&Math.hypot(player.x-g.x-.5,player.y-g.y-.5)<.78){let a=Math.atan2(player.y-g.y-.5,player.x-g.x-.5);player.vx+=Math.cos(a)*7;player.vy+=Math.sin(a)*7;hurt()}});
 if(level.theme==='fire'){
  steamJets.forEach(g=>{if(steamOn(g)&&Math.hypot(player.x-g.x,player.y-g.y)<.72)hurt()});
  if(!furnaceOpened&&time<level.duration*.5){furnaceOpened=true;cameraFade=.32;impact(.55);sfx('fire');burst(10*T,5*T,'#ff9a38',40,2)}
 }
 if(level.theme==='cyclotron'){beamAngle+=dt*.72;let cx=10,cy=6,px=player.x-cx,py=player.y-cy,a=Math.atan2(py,px),diff=Math.abs(Math.atan2(Math.sin(a-beamAngle),Math.cos(a-beamAngle)));if(diff<.08||Math.abs(diff-Math.PI)<.08)hurt();machines.forEach(m=>{let ma=Math.atan2(m.y-cy,m.x-cx),q=Math.abs(Math.atan2(Math.sin(ma-beamAngle),Math.cos(ma-beamAngle)));m.off=q<.16||Math.abs(q-Math.PI)<.16})}else machines.forEach(m=>m.off=false);
 machines.forEach(m=>{if(m.forcedOff>0){m.forcedOff=Math.max(0,m.forcedOff-dt);m.off=true}});
 if(level.theme==='lava')lavaBridges.forEach(b=>{let on=bridgeOn(b);if(b.wasOn!==undefined&&on!==b.wasOn){tone(on?145:78,on?.08:.18,on?'square':'sawtooth',.01);noise(on?.04:.13,.008,on?850:280)}b.wasOn=on});
 if(level.randomIncidents){incidentTimer-=dt;if(incidentTimer<=0){incidentTimer=level.theme==='foam'?32:15;if(level.theme==='foam'&&!machines.some(m=>m.fire)){let q=machines.filter(m=>!['rack','ext','waste','delivery','counter'].includes(m.type)&&!m.fire),hot=q.filter(m=>m.busy>0||m.ready>0);if(hot.length)q=hot;if(q.length){q[Math.floor(Math.random()*q.length)].fire=.01;cameraFade=Math.max(cameraFade,.08);impact(.16);sfx('fire')}}}}
}
function recipeTimeLimit(r){
 let process=r.need.reduce((sum,type)=>sum+(MACHINE_TIMES[type]||1.5),0),travel=r.need.length*10+24,hazard={fire:18,geyser:14,lava:20,belt:14,cyclotron:20,foam:12}[level.theme]||8,soloQueue=28;
 return Math.ceil(process+travel+hazard+soloQueue)
}
function spawnOrder(){let pool=level.recipes.map(i=>LAB_DATA.recipes[i]),fresh=pool.filter(r=>!activeOrders().some(o=>o.name===r.name));if(fresh.length)pool=fresh;let r=pool[Math.floor(Math.random()*pool.length)],limit=recipeTimeLimit(r);orders.push({id:++orderSeq,name:r.name,start:r.start,need:r.need.slice(),time:limit,max:limit,error:0,status:null,statusTime:0})}
function update(dt){
 if(paused)return;time-=dt;if(time<=0)return finish(false);updateSoundscape(dt);
 runScriptedEvents(dt);
 if(level.mode==='energySort')updateEnergy(dt);
 else{spawnTimer-=dt;if(spawnTimer<=0&&activeOrders().length<2){spawnOrder();spawnTimer=8.5}
 orders.forEach(o=>{o.error=Math.max(0,(o.error||0)-dt);if(o.status)o.statusTime-=dt;else o.time-=dt;if(!o.status&&o.time<=0){o.status='expired';o.statusTime=.68;score=Math.max(0,score-25);sfx('error');if(level.theme==='foam')foamBurst(10.5,8.5,.6)}});orders=orders.filter(o=>!o.status||o.statusTime>0)}
 comboTimer=Math.max(0,comboTimer-dt);if(comboTimer<=0)combo=0;beltBoost=Math.max(0,beltBoost-dt);bridgeBoost=Math.max(0,bridgeBoost-dt);bridgePanic=Math.max(0,bridgePanic-dt);let respawning=updateRespawn(dt);if(!respawning){updateMovingIslands();assistDisembark();assistBoarding();updateConveyors(dt);updateRollingCarts(dt);move(dt)}player.spray=Math.max(0,player.spray-dt);player.celebrate=Math.max(0,player.celebrate-dt);updateMachines(dt);updateHazards(dt);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.life-=dt});particles=particles.filter(p=>p.life>0);fallFx.forEach(f=>f.life-=dt);fallFx=fallFx.filter(f=>f.life>0);feedbacks.forEach(f=>f.life-=dt);feedbacks=feedbacks.filter(f=>f.life>0);flash=Math.max(0,flash-dt*2.6);cameraFade=Math.max(0,cameraFade-dt*1.15);shake=Math.max(0,shake-dt*42);shakeX=(Math.random()-.5)*shake;shakeY=(Math.random()-.5)*shake;
 let n=respawnTimer>0?null:nearest(),p=respawnTimer>0?null:nearestProp(),guide=respawnTimer>0?null:player&&player.carry&&player.carry.energy?energyTarget(player.carry):recommendedType(),nearCard=respawnTimer>0?null:nearestEnergy();ui.prompt.textContent=respawnTimer>0?'COOLDOWN CHUTE · RETOUR DANS '+Math.ceil(respawnTimer)+'s':asciiText(n?'[E] '+LAB_DATA.machines[n.type].name+(n.fire?' · ETEINDRE !':n.off?' · COUPURE':n.busy>0?' · EN COURS':n.item?' · REPRENDRE':guide&&n.type!==guide?' · AUTRE POSTE':' · UTILISER'):nearCard?'[E] RAMASSER '+nearCard.name:p?'[E] '+(p.type==='valve'?'TOURNER LA VANNE':p.type==='switch'?'COUPER LE DANGER':'ACTIVER LE CRISTAL'):guide?(guide==='fire'?'CHERCHE LA MACHINE EN FEU':'PROCHAINE ETAPE : '+LAB_DATA.machines[guide].name):'APPROCHE-TOI D UN POSTE')
}
function finish(win){
 cancelAnimationFrame(raf);
 let nextWasUnlocked=selected<LAB_DATA.levels.length-1&&isUnlocked(selected+1),perfect=stats.mistakes===0&&stats.falls===0,stars=win?(perfect&&score>=850?3:score>=520&&stats.falls<=2?2:1):0,best=bestStars(selected);
 if(stars>best)localStorage.setItem(starKey(selected),stars);
 document.querySelector('#resultTitle').textContent=win?'MISSION REUSSIE':'TEMPS ECOULE';
 document.querySelector('#stars').innerHTML=starsHtml(stars);
 document.querySelector('#resultScore').textContent=score+' POINTS';
 let unlock=win&&selected<LAB_DATA.levels.length-1&&!nextWasUnlocked?' · NIVEAU SUIVANT DEBLOQUE':'',detail=' · ERREURS '+stats.mistakes+' · CHUTES '+stats.falls+' · COMBO x'+Math.max(1,stats.bestCombo);
 document.querySelector('#resultStats').textContent=served+' '+goalName().toLowerCase()+' · '+Math.max(0,Math.ceil(time))+' sec'+detail+unlock;
 show('result')
}
function renderHud(){
 ui.score.textContent=score;ui.timer.textContent=Math.max(0,Math.floor(time/60)).toString().padStart(2,'0')+':'+Math.max(0,Math.floor(time%60)).toString().padStart(2,'0');ui.timer.parentElement.classList.toggle('lastMinute',time<=60);ui.goal.textContent=served+' / '+level.goal+' '+goalName();ui.levelName.textContent='NIVEAU '+(selected+1)+' : '+asciiText(level.name)+' - '+asciiText(level.difficulty||'MISSION');ui.levelName.parentElement.style.display=level.theme==='foam'?'none':'';let dashReady=player.dashCd<=0;ui.dash.style.width=(Math.min(1,1-player.dashCd/DASH_CD)*100)+'%';ui.dashLabel.textContent=dashReady?'DASH PRET':'DASH '+Math.ceil(player.dashCd*10)/10+'s';ui.dashBar.classList.toggle('cooldown',!dashReady);let alert=upcomingEventStatus(),rush=combo>1,status=respawnTimer>0?'COOLDOWN RESPAWN '+Math.ceil(respawnTimer)+'s':rush?'COMBO x'+combo+' · +'+(level.mode==='energySort'?'1':'3')+' SEC':alert,comboEl=document.querySelector('#combo');comboEl.textContent=asciiText(status);comboEl.classList.toggle('show',!!status);comboEl.classList.toggle('alert',!!alert&&!rush||respawnTimer>0);comboEl.classList.toggle('rush',rush);
 if(level.mode==='energySort'){
  let carried=player&&player.carry&&player.carry.energy?player.carry:null,target=carried?energyTarget(carried):null,signature='energy:'+served+':'+(carried?carried.id:'none')+':'+energyItems.length+':'+Math.ceil(energyBrake)+':'+Math.ceil(energyRush);
  if(ui.orders.dataset.signature!==signature){ui.orders.innerHTML='<div class="energyGuide"><span class="energyBadge renew">R</span><b>RENOUVELABLE</b><i>SOL · EOL · HYD · BIO</i></div><div class="energyCardNow '+(carried?'show':'')+'"><small>EN MAIN</small><strong>'+(carried?asciiText(carried.name):'ATTRAPE UNE CARTE')+'</strong><em>'+(energyBrake>0?'TAPIS RALENTI '+Math.ceil(energyBrake):energyRush>0?'TAPIS RAPIDE '+Math.ceil(energyRush):target==='renewDepot'?'VERS LE VERT':target==='nonrenewDepot'?'VERS LE BRUN':'SUR LE TAPIS')+'</em></div><div class="energyGuide nonrenew"><span class="energyBadge non">N</span><b>NON RENOUVELABLE</b><i>CHA · PET · GAZ · URA</i></div>';ui.orders.dataset.signature=signature}
  return
 }
 let display=orders.map((o,i)=>{
  let start=o.start||'#6fc9e7',s=orderSample(o),hasTube=!!s||o.status==='complete',progress=o.status==='complete'?o.need.length:(s?s.steps.length:0),urgent=!o.status&&o.time<12;
  let steps='<span class="recipeStep tubeRecipe '+(hasTube?'done':'next')+'"><i class="recipeTube" style="--liquid:'+start+'"></i><b></b>'+(!hasTube?'<em></em>':'')+'</span>';
  o.need.forEach((type,n)=>{let done=n<progress,next=hasTube&&!o.status&&n===progress;steps+='<span class="flowArrow '+(done?'done':'')+'">›</span><span class="recipeStep type-'+type+' '+(done?'done ':'')+(next?'next':'')+'" style="--c:'+LAB_DATA.machines[type].color+'" title="'+LAB_DATA.machines[type].name+'"><i class="recipeIcon"></i><b></b>'+(next?'<em></em>':'')+'</span>'});
  let key=[o.id,i,hasTube,progress,urgent,o.error>0,o.status||'active'].join(':');
  return{key,html:'<div class="order '+(urgent?'urgent ':'')+(o.error>0?'error ':'')+(o.status||'')+'" data-order-id="'+o.id+'" style="--ticket-w:'+(96+o.need.length*42)+'px;--ticket-mobile-w:'+(80+o.need.length*33)+'px"><span class="orderNo">'+(i+1)+'</span><div class="orderTop"><span class="ticketPin"></span><strong>'+asciiText(o.name)+'</strong><span class="finalTube"><i style="background:'+start+'"></i></span></div><div class="recipeFlow">'+steps+'</div><div class="orderBar"><i></i></div><div class="ticketStamp">'+(o.status==='complete'?'OK':o.status==='expired'?'RATE':'×')+'</div></div>'}
 });
 let signature=display.map(d=>d.key).join('|');if(ui.orders.dataset.signature!==signature){ui.orders.innerHTML=display.map(d=>d.html).join('');ui.orders.dataset.signature=signature}
 ui.orders.classList.toggle('crowded',orders.length>=3);
 orders.forEach(o=>{let bar=ui.orders.querySelector('[data-order-id="'+o.id+'"] .orderBar i');if(bar)bar.style.width=(Math.max(0,o.time)/o.max*100)+'%'})
}
function loop(t){let dt=Math.min(.033,(t-last)/1000||0);last=t;if(state==='play')update(dt);render();if(state==='play'||state==='pause')renderHud();raf=requestAnimationFrame(loop)}

addEventListener('keydown',e=>{let k=e.key.toLowerCase();keys[k]=true;if((k==='e'||k===' ')&&state==='play')interact();if(k==='x'&&state==='play')throwCarry();if(k==='shift')triggerDash();if(k==='escape')togglePause();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');function joyMove(e){let r=joy.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,l=Math.hypot(x,y)||1,m=Math.min(32,l);x=x/l*m;y=y/l*m;stick.style.transform='translate('+x+'px,'+y+'px)';keys.arrowleft=x<-7;keys.arrowright=x>7;keys.arrowup=y<-7;keys.arrowdown=y>7}function joyEnd(){stick.style.transform='';keys.arrowleft=keys.arrowright=keys.arrowup=keys.arrowdown=false}joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);joyMove(e)});joy.addEventListener('pointermove',e=>{if(e.buttons)joyMove(e)});joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);document.querySelector('#actTouch').addEventListener('pointerdown',e=>{e.preventDefault();interact()});document.querySelector('#throwTouch').addEventListener('pointerdown',e=>{e.preventDefault();throwCarry()});document.querySelector('#dashTouch').addEventListener('pointerdown',e=>{e.preventDefault();triggerDash()});

updateSettings();render();raf=requestAnimationFrame(loop);

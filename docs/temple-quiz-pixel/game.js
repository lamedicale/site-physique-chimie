const C=document.querySelector('#game'),X=C.getContext('2d'),W=640,H=360,T=24,MW=42,MH=30;
X.imageSmoothingEnabled=false;
const THEMES=[
 // Chaque biome porte désormais : weather (météo + effets de lumière), flora (fleurs/herbes au sol),
 // density (densité de végétation), tint (voile coloré d'ambiance) → identité visuelle unique.
 {n:'FORET',ground:['#9dbb43','#a8c54b'],edge:'#98b33e',water:['#238bc4','#66d3e9'],tree:'broad',animals:['capybara','frog','parrot','boar'],trap:'spikes',artifact:'idol',weather:'sun',flora:'forest',density:1,tint:'rgba(80,140,40,.07)'},
 {n:'PLAGE',ground:['#e3ca76','#efd78a'],edge:'#c6aa5d',water:['#168fc8','#8be9ef'],tree:'palm',animals:['crab','turtle','parrot','boar'],trap:'crabtrap',artifact:'shell',weather:'flare',flora:'beach',density:.6,tint:'rgba(255,210,120,.08)'},
 {n:'TAIGA',ground:['#a7c2b0','#bbd2c0'],edge:'#89a99b',water:['#4c9fb8','#b8ebef'],tree:'pine',animals:['hare','fox','owl','wolf'],trap:'ice',artifact:'crystal',weather:'snow',flora:'taiga',density:.9,tint:'rgba(150,180,210,.10)'},
 {n:'DESERT',ground:['#d8ae59','#e6c16f'],edge:'#c18d45',water:['#4e91a5','#9dd8da'],tree:'cactus',animals:['camel','lizard','vulture','scorpion'],trap:'cactus',artifact:'scarab',weather:'heat',flora:'desert',density:.5,tint:'rgba(160,110,30,.08)'},
 {n:'VOLCAN',ground:['#5a4038','#6b4a3e'],edge:'#3f2c26',water:['#e0571f','#ffb13d'],tree:'rock',animals:['boar','scorpion','lizard','wolf'],trap:'lava',artifact:'flask',weather:'ash',flora:'volcan',density:.7,tint:'rgba(120,30,0,.14)'},
 // GROTTE (caverne souterraine) : pierre sombre humide, stalactites/stalagmites, gours turquoise, cristaux, gouttes d'eau.
 {n:'GROTTE',ground:['#494049','#544a54'],edge:'#322b33',water:['#1f8fa8','#6fe0ea'],tree:'stalagmite',animals:['fox','owl','frog','hare'],trap:'spikes',artifact:'crystal',weather:'drip',flora:'cave',density:.7,tint:'rgba(20,15,30,.18)'},
 // JUNGLE (tropicale, dense, pluvieuse) : verts profonds humides, rivière sinueuse, lianes, faune tropicale.
 {n:'JUNGLE',ground:['#3f7e3a','#48903f'],edge:'#356b30',water:['#2f9bb0','#5fd6e0'],tree:'jungle',animals:['monkey','toucan','jaguar','frog'],trap:'spikes',artifact:'idol',shape:'jungle',weather:'rain',flora:'jungle',density:1.7,tint:'rgba(20,70,30,.16)'},
 // DUNES (désert rouge sablonneux) : sable rouge ondulé, canyons en éventail, chaleur, faune désertique.
 {n:'DUNES',ground:['#cf7a3e','#dd8a46'],edge:'#a85e2c',water:['#5aa0a8','#a6e0dc'],tree:'cactus',animals:['fennec','rattlesnake','vulture','scorpion'],trap:'cactus',artifact:'scarab',shape:'dunes',weather:'heat',flora:'dunes',density:.5,tint:'rgba(180,90,20,.12)',wind:.85},
 // SEQUOIAS (forêt de séquoias géants) : troncs rouges colossaux, sous-bois sombre, brume dorée.
 {n:'SEQUOIAS',ground:['#5a7a3a','#658542'],edge:'#4a6630',water:['#2f7fa0','#6fc6d6'],tree:'sequoia',animals:['boar','fox','owl','capybara'],trap:'spikes',artifact:'idol',weather:'sunbeam',flora:'sequoia',density:1.3,tint:'rgba(90,60,30,.12)'},
 // MARECAGE (marais brumeux) : eau stagnante boueuse, saules pleureurs, brouillard, faune amphibie.
 {n:'MARECAGE',ground:['#5a6a44','#647650'],edge:'#46563a',water:['#3a5a48','#5e8a6e'],tree:'willow',animals:['frog','turtle','owl','boar'],trap:'spikes',artifact:'idol',weather:'fog',flora:'swamp',density:1.1,tint:'rgba(50,70,55,.16)'},
 // SAVANE (plaine herbeuse sèche) : hautes herbes dorées, acacias, chaleur douce, grande faune.
 {n:'SAVANE',ground:['#b8a85a','#c9b968'],edge:'#9a8a48',water:['#3f93a8','#86d2d6'],tree:'acacia',animals:['boar','vulture','lizard','capybara'],trap:'spikes',artifact:'idol',weather:'heat',flora:'savane',density:.7,tint:'rgba(170,140,50,.10)'},
 // ISLANDE (désert volcanique nordique) : roche basaltique noire, mousse verte, geysers froids, brume.
 {n:'ISLANDE',ground:['#3e4448','#4a5256'],edge:'#2e3438',water:['#3a6e8c','#7ec2da'],tree:'basalt',animals:['fox','owl','hare','wolf'],trap:'geyser',artifact:'crystal',weather:'mist',flora:'island',density:.6,tint:'rgba(70,90,100,.14)',wind:1},
 // YELLOWSTONE (parc géothermique) : terrasses minérales ocres, sources chaudes turquoise, geysers, vapeur.
 {n:'YELLOWSTONE',ground:['#c89a54','#d8ad62'],edge:'#a87e3e',water:['#23b0c4','#7ff0e8'],tree:'pine',animals:['boar','wolf','vulture','fox'],trap:'geyser',artifact:'flask',weather:'steam',flora:'geothermal',density:.7,tint:'rgba(190,140,40,.10)'},
 // GLACIER : étendue de glace bleutée, séracs, crevasses profondes, blizzard.
 {n:'GLACIER',ground:['#cfe2ea','#dcebf2'],edge:'#9fbccb',water:['#3f8fb8','#9fe0ef'],tree:'iceblock',animals:['hare','fox','owl','wolf'],trap:'ice',artifact:'crystal',weather:'blizzard',flora:'glacier',density:.7,tint:'rgba(150,190,220,.16)',shape:'glacier',wind:1.25},
 // MONTAGNE : hauts sommets rocheux enneigés, sapins, fort relief (collines + crevasses).
 {n:'MONTAGNE',ground:['#7e8a6e','#8c9879'],edge:'#5a6450',water:['#4c8fb0','#a8dceb'],tree:'fir',animals:['hare','wolf','owl','fox'],trap:'ice',artifact:'crystal',weather:'snow',flora:'mountain',density:1,tint:'rgba(110,130,140,.12)',shape:'mountain',wind:1}
];
// ── APRON HORS-CARTE : le terrain « continue » au-delà du bord jouable (mur invisible) ───────
// v = tuile de remplissage rendue via drawTile (coords hors grille = OK : drawTile ne lit que
// currentTheme + x/y, jamais map[]). treeChance = densité d'arbres-silhouettes de lisière.
// steam = panaches de vapeur (yellowstone/islande). Plus aucune « mer bleue » universelle :
// neige pour la taïga, sable pour le désert, roche pour yellowstone, océan seulement pour les îles.
const APRON={
 FORET:{v:5,treeChance:.16}, PLAGE:{v:6}, TAIGA:{v:4,treeChance:.11},
 DESERT:{v:4,treeChance:.05}, VOLCAN:{v:6}, GROTTE:{v:3,treeChance:.04},
 JUNGLE:{v:0,treeChance:.42}, DUNES:{v:4,treeChance:.04},
 SEQUOIAS:{v:5,treeChance:.14}, MARECAGE:{v:2,treeChance:.10},
 SAVANE:{v:4,treeChance:.05}, ISLANDE:{v:3,steam:1},
 YELLOWSTONE:{v:3,steam:1}, GLACIER:{v:4,treeChance:.08},
 MONTAGNE:{v:3,treeChance:.10}
};
const APRON_MARGIN=8; // tuiles de lisière rendues autour de la carte (≥ marge de caméra)
// Biomes 5ᵉ : UN biome distinct par chapitre (même variété que les 4ᵉ, plus de répétitions).
const BIOMES=['JUNGLE ANCIENNE','ARCHIPEL PERDU','TAIGA GELÉE','DUNES DU SCARABÉE','FORÊT DES GÉANTS','MONTS DE BASALTE','VALLÉE VOLCANIQUE','DÉSERT ROUGE','MARAIS DES OMBRES','SAVANE DU LION','CIMES GLACÉES'];
// Biomes 4ᵉ : UN biome naturel distinct par chapitre (que de la nature, pas de labo/cristal).
const BIOMES_4E=['TAÏGA ÉTOILÉE','CÔTE VENTEUSE','DÉSERT ISLANDAIS','FORÊT DE SÉQUOIAS','MARÉCAGE BRUMEUX','CANYON DU VENT','SAVANE DORÉE','SOURCES DE YELLOWSTONE','JUNGLE ORAGEUSE','PICS ENNEIGÉS','GLACIER ÉTERNEL'];
// Index de thème (dans THEMES) par chapitre, par niveau.
// THEMES: 0 FORET,1 PLAGE,2 TAIGA,3 DESERT,4 VOLCAN,5 GROTTE,6 JUNGLE,7 DUNES,8 SEQUOIAS,9 MARECAGE,10 SAVANE,11 ISLANDE,12 YELLOWSTONE,13 GLACIER,14 MONTAGNE
// 5ᵉ — un biome DISTINCT par chapitre (fini les répétitions jungle/plage/taïga).
//                  jungle plage taïga dunes séquoia basalte volcan désert marais savane montagne
const THEME_MAP_5E=[6,    1,    2,    7,    8,      11,     4,     3,     9,     10,    14];
//                  Univers air  transfo atomes dens  mvt inter  ener   tens montagne glacier
//                  taïga   côte islande séquoia marais canyon savane yellowst jungle pics    glacier
const THEME_MAP_4E=[2,     1,   11,     8,     9,    7,    10,   12,      6,     14,    13];
function curBank(){return gradeLevel==='4e'?window.QUESTION_DATA_4E:window.QUESTION_DATA}
function curBiomes(){return gradeLevel==='4e'?BIOMES_4E:BIOMES}
function curThemeMap(){return gradeLevel==='4e'?THEME_MAP_4E:THEME_MAP_5E}
// style = silhouette de rendu réutilisée (0=archéo/fedora+fouet, 1=exploratrice/tresses, 2=scientifique/lunettes, 3=aventurière).
const CHARACTERS=[
 {n:'ARCHÉOLOGUE',d:'SACOCHE · FEDORA · FOUET',shirt:'#c18b43',hat:'#88562a',skin:'#e0a56b',style:0},
 {n:'EXPLORATRICE',d:'BOUSSOLE · TRESSES · FOULARD',shirt:'#4d8f8a',hat:'#71452e',skin:'#c98755',style:1},
 {n:'SCIENTIFIQUE',d:'LUNETTES · BLOUSE · CARNET',shirt:'#e9e4d2',hat:'#3d6685',skin:'#a96d48',style:2},
 {n:'AVENTURIÈRE',d:'BANDANA · VESTE · GANTS',shirt:'#7a4bb0',hat:'#241a33',skin:'#d99466',style:3},
 {n:'EXPLORATEUR',d:'BARBE · FEUTRE · SAC',shirt:'#8a6a3a',hat:'#5a3e23',skin:'#c98a5e',style:0},
 {n:'PILOTE',d:'BLOUSON · ÉCHARPE',shirt:'#b04a3a',hat:'#3a2c20',skin:'#e0a56b',style:1},
 {n:'BIOLOGISTE',d:'BLOUSE · LOUPE',shirt:'#e4e9da',hat:'#2f6e54',skin:'#8d5a3c',style:2},
 {n:'GUIDE',d:'PONCHO · CHAPEAU',shirt:'#3f7d57',hat:'#6a4a2a',skin:'#b9805a',style:0},
 {n:'INVENTRICE',d:'SALOPETTE · GOGGLES',shirt:'#c98a2f',hat:'#7a4a90',skin:'#e8b98c',style:3},
 {n:'PLONGEUSE',d:'COMBINAISON · MASQUE',shirt:'#2f7da0',hat:'#1f3a55',skin:'#d4a373',style:2}
];
// renvoie le style de silhouette (0-3) à utiliser pour le rendu d'un index de perso donné.
function charStyle(i){let c=CHARACTERS[i];return c&&typeof c.style==='number'?c.style:Math.min(3,i)}
const ui={hud:document.querySelector('#hud'),touch:document.querySelector('#touchControls'),chapters:document.querySelector('#chapters'),characterCards:document.querySelector('#characterCards'),question:document.querySelector('#question'),answers:document.querySelector('#answers'),diagram:document.querySelector('#diagram'),quizTag:document.querySelector('#quizTag'),quizClock:document.querySelector('#quizClock'),quizClockBar:document.querySelector('#quizClockBar'),explainBox:document.querySelector('#explainBox'),continueBtn:document.querySelector('#continueBtn'),chapterHud:document.querySelector('#chapterHud'),artHud:document.querySelector('#artHud'),exitHud:document.querySelector('#exitHud'),goalLabel:document.querySelector('#goalLabel'),resultText:document.querySelector('#resultText')};
let settingsData={shake:true,motion:true,sound:true,music:true,touchCompact:true,difficulty:'NORMAL',textScale:'NORMAL',symbols:true,...JSON.parse(localStorage.getItem('temple-settings')||'{}')},selectedCharacter=+(localStorage.getItem('temple-character')||0);
let map=[],elev=[],player,spawn={x:1,y:1},snakes=[],animals=[],quicksands=[],artifacts=[],traps=[],holes=[],decors=[],particles=[],exit,currentTheme=THEMES[0],biomeName=BIOMES[0],boss={active:false,hp:3,max:3},quizMode='artifact',cam={x:0,y:0,shake:0,pulse:0,tx:null,ty:null},keys={},state='menu',selectedChapter=0,score=0,lives=3,maxLives=3,time=180,collected=0,last=0,whip=0,inv=0,raf=0,pendingArtifact=null,audioCtx=null,askedIndices=[],currentQuestion=null,attempts=[],combo=0,maxCombo=0,errors=0,flash=0,quizAdvanced=false,quizTimer=0,floaters=[],powerups=[],shield=0,bolts=[],bossEnt=null,bossPhase='idle',bossTimer=0,ambient=[],popFx=[],paused=false,sinkIn=null,settingsFrom='menu',gradeLevel=(localStorage.getItem('temple-grade')||'5e'),minions=[],zones=[],isRuins=false,ruinsSize='final',ruinsNodeId='',bossColossus=false,templeTrial=false,trialCtx=null,doors=[],keysArr=[],plates=[],treasure=null,keysHeld=0,pendingDoor=null,quizClock=0,quizClockMax=15,quizClockOn=false,artifactPowers=[],comboAura=0,trapReveal=0,rooms=[],curRoom=null,tripwires=[],pendingPits=[],movers=[],boulder=null,blocks=[],fade=0,fadeDir=0,fadeTo=null,transitioning=false,roomMsg=0,cobwebs=[],props=[],levers=[],portals=[],iceZones=[],mirrors=[],beams=[],crushers=[],simons=[],closingWalls=[],doorThroats=[],structures=[],groundDecor=[],villagers=[],wells=[],ruinSites=[],pendingVillager=null,villagerStreak=0,windT=0,windDir=0,windX=0,windY=0,windGust=0,windStreaks=[],ruinsBossDone=false,geysers=[],tod='day',birds=[],birdTimer=0,menuBiome=null;
const MENU_SCREENS=['menu','levelSelect','chapterScreen','characters','skills','how','result','dashboard'];
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('hidden',s.id!==id));ui.hud.classList.toggle('hidden',id!=='play');ui.touch.classList.toggle('hidden',id!=='play');let pt=document.querySelector('#pauseToggle');if(pt)pt.classList.toggle('hidden',id!=='play');if(id!=='play'){let ov=document.querySelector('#pauseMenu');if(ov&&settingsFrom!=='pause')ov.classList.add('hidden')}
 // Musique : thème d'accueil sur les ecrans de menu, sinon on laisse le jeu gérer sa propre musique.
 if(MENU_SCREENS.indexOf(id)>=0){if(!menuMusic||!music.on){menuMusic=true;startMusic()}}
 else{menuMusic=false;if(id!=='play'&&id!=='quiz'&&id!=='settings')stopMusic()}
 state=id}
function showMenu(){show('menu')}function showHow(){show('how')}
function showLevels(){show('levelSelect')}
function chooseGrade(g){gradeLevel=g;localStorage.setItem('temple-grade',g);showChapters()}
function getLog(){try{return JSON.parse(localStorage.getItem('temple-log')||'[]')}catch(e){return[]}}
function showDashboard(){let code=localStorage.getItem('temple-profcode')||'prof';let inp=prompt('Code enseignant :');if(inp===null)return;
 // MOT DE PASSE MAÎTRE « 1234 » : débloque TOUS les niveaux (5e + 4e), puis ouvre le tableau de bord.
 if(inp==='1234'){unlockAllLevels();alert('Tous les niveaux ont été débloqués.');buildDashboard();show('dashboard');return}
 if(inp!==code){alert('Code incorrect.');return}buildDashboard();show('dashboard')}
// Débloque chaque chapitre des deux niveaux (5e/4e) en posant ≥1 étoile partout (le déverrouillage
// étant linéaire : starKey(i-1)≥1 ouvre i). Préserve les scores d'étoiles déjà supérieurs.
function unlockAllLevels(){
 [['5e','',window.QUESTION_DATA],['4e','4e-',window.QUESTION_DATA_4E]].forEach(([g,pre,bank])=>{
  if(!bank||!bank.chapters)return;
  for(let i=0;i<bank.chapters.length;i++){let k='temple-stars-'+pre+i;if(+(localStorage.getItem(k)||0)<1)localStorage.setItem(k,'1')}
 });
}
function buildDashboard(){let log=getLog(),wrap=document.querySelector('#dashWrap');
 if(!log.length){wrap.innerHTML='<div class="dashEmpty">Aucune partie enregistrée pour le moment.<br>Les résultats des élèves apparaîtront ici après leurs parties.</div>';return}
 // agrégats par chapitre
 let byCh={};log.forEach(r=>{let key=(r.grade||'5e')+'-'+r.ch,c=byCh[key]||(byCh[key]={name:r.chName,grade:r.grade||'5e',ch:r.ch,n:0,scoreSum:0,wins:0,errSum:0,qTotal:0,qOk:0,missed:{}});
  c.n++;c.scoreSum+=r.score;if(r.win)c.wins++;c.errSum+=r.errors||0;
  (r.attempts||[]).forEach(a=>{c.qTotal++;if(a.ok)c.qOk++;else c.missed[a.text]=(c.missed[a.text]||0)+1});});
 let totalParties=log.length,html='<div class="dashSummary">'+totalParties+' partie'+(totalParties>1?'s':'')+' enregistrée'+(totalParties>1?'s':'')+'</div>';
 Object.keys(byCh).sort((a,b)=>byCh[a].grade===byCh[b].grade?byCh[a].ch-byCh[b].ch:byCh[a].grade<byCh[b].grade?-1:1).forEach(ci=>{let c=byCh[ci];
  let moy=Math.round(c.scoreSum/c.n),reussite=c.qTotal?Math.round(100*c.qOk/c.qTotal):0,tauxWin=Math.round(100*c.wins/c.n);
  let missedArr=Object.keys(c.missed).map(t=>({t,n:c.missed[t]})).sort((a,b)=>b.n-a.n).slice(0,3);
  let missedHtml=missedArr.length?('<div class="dashMissed"><b>Questions les plus ratées :</b>'+missedArr.map(m=>'<div>✗ '+m.t+' <span>('+m.n+'×)</span></div>').join('')+'</div>'):'';
  html+='<div class="dashCard"><div class="dashChName">CH. '+(c.ch+1)+' · '+c.name+'</div>'
    +'<div class="dashStats">Parties : '+c.n+' · Score moyen : '+moy+' · Réussite quiz : '+reussite+'% · Victoires : '+tauxWin+'%</div>'
    +missedHtml+'</div>';});
 wrap.innerHTML=html}
function exportCSV(){let log=getLog();if(!log.length){alert('Aucune donnée à exporter.');return}
 let rows=[['date','niveau','chapitre','chapitre_nom','victoire','score','etoiles','erreurs','combo_max','questions','bonnes_reponses']];
 log.forEach(r=>{let q=(r.attempts||[]).length,ok=(r.attempts||[]).filter(a=>a.ok).length;
  rows.push([r.date,(r.grade||'5e'),(r.ch+1),r.chName,r.win?'oui':'non',r.score,r.stars,r.errors||0,r.comboMax||0,q,ok]);});
 let csv='\ufeff'+rows.map(row=>row.map(v=>{v=String(v);return /[",;\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(';')).join('\r\n');
 let blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='temple-resultats-'+new Date().toISOString().slice(0,10)+'.csv';document.body.appendChild(a);a.click();
 setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url)},100)}
function resetLog(){if(!confirm('Effacer toutes les données enregistrées ? Cette action est irréversible.'))return;localStorage.removeItem('temple-log');buildDashboard()}
function pixelStars(n){return Array.from({length:3},(_,i)=>`<span class="pstar ${i<n?'':'off'}"></span>`).join('')}function pixelHearts(n){return Array.from({length:n},()=>'<span class="pheart"></span>').join('')}
function gradePrefix(){return gradeLevel==='4e'?'4e-':''}
function starKey(i){return 'temple-stars-'+gradePrefix()+i}
function bestKey(i){return 'temple-best-'+gradePrefix()+i}
// Déverrouillage LINÉAIRE : le chapitre 0 est ouvert ; le i est ouvert si i-1 a ≥1 étoile.
function chapterUnlocked(i){if(i<=0)return true;return +(localStorage.getItem(starKey(i-1))||0)>0}
// Emblème PIXEL-ART par biome (AUCUN emoji) : petit canevas dessiné en code, identifiant le nœud.
function biomeIconCanvas(n,px=22){let cv=document.createElement('canvas');cv.width=cv.height=22;let g=cv.getContext('2d');g.imageSmoothingEnabled=false;
 cv.className='nodeIconCv';cv.style.width=px+'px';cv.style.height=px+'px';
 let r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 drawBiomeEmblem(r,n);return cv}
// Motif pixel-art d'un biome dans une grille 22×22 (helper r = rect).
function drawBiomeEmblem(r,n){switch(n){
 case'FORET':case'SEQUOIAS':r(10,14,3,6,'#5a3a1e');r(6,10,11,5,'#2f6b34');r(8,6,7,5,'#3f8a44');r(9,3,5,4,'#56a85a');break;
 case'JUNGLE':r(10,14,3,6,'#4a2e16');r(4,11,15,4,'#1d5a26');r(7,7,9,5,'#2f8a3a');r(9,4,5,4,'#7af0a0');break;
 case'PLAGE':r(3,17,16,3,'#e6cf8a');r(10,8,3,9,'#7a4a26');r(5,5,9,4,'#3d9c55');r(11,5,8,3,'#56b86a');break;
 case'TAIGA':r(9,15,4,5,'#4a3a2a');r(5,11,12,5,'#cfe0dc');r(8,7,6,5,'#3a6b5a');r(9,4,4,4,'#eaf4f0');break;
 case'GLACIER':case'ISLANDE':r(4,12,14,6,'#9fc8da');r(6,7,10,6,'#cfeaf4');r(8,4,6,4,'#eafcff');r(5,13,3,3,'#6fa8c0');break;
 case'MONTAGNE':r(3,16,16,4,'#5a6450');r(5,7,7,10,'#6e7a64');r(11,9,7,8,'#525c46');r(7,5,3,4,'#eef4f6');break;
 case'DESERT':r(2,17,18,3,'#d8b45c');r(9,8,3,9,'#3d8c55');r(6,11,3,3,'#3d8c55');r(13,10,3,3,'#3d8c55');break;
 case'DUNES':r(2,15,18,5,'#e0a85a');r(4,12,8,4,'#c88a3c');r(11,13,8,4,'#b5683c');break;
 case'VOLCAN':r(4,16,14,4,'#5a2a18');r(6,9,10,8,'#7a3526');r(8,9,6,4,'#ff7a1f');r(9,5,4,5,'#ffb13d');break;
 case'GROTTE':r(2,2,18,18,'#322b33');r(7,2,3,7,'#6a5e6a');r(13,2,2,5,'#6a5e6a');r(8,18,3,2,'#7a6e7a');r(13,18,3,2,'#7a6e7a');r(9,12,5,3,'#1f8fa8');break;
 case'MARECAGE':r(3,15,16,5,'#3a4a2a');r(6,10,4,6,'#4a6a34');r(12,11,4,5,'#5a7a3e');r(9,7,3,4,'#9fd06a');break;
 case'SAVANE':r(2,16,18,4,'#b58a3c');r(9,9,3,8,'#7a4a26');r(4,6,15,4,'#8a6a2e');r(5,5,13,2,'#a8852e');break;
 case'YELLOWSTONE':r(4,15,14,5,'#7a4a18');r(7,10,8,6,'#5fb8c8');r(9,7,4,4,'#cfeaf4');r(8,5,2,3,'#eafcff');break;
 default:r(4,8,14,9,'#3f7e34');r(7,5,8,4,'#56a85a');r(10,16,3,4,'#5a3a22');}
}
// (compat) ancien appel emoji → renvoie chaîne vide (plus aucun emoji affiché).
function biomeIcon(){return''}
// ── CARTE DU MONDE PIXEL-ART (canvas → dataURL) ───────────────────────────────────────────────
// Génère une VRAIE carte vue de dessus, NON répétée : un continent unique entouré d'océan, avec
// des ZONES DE BIOMES pixel (herbe, forêt, sable côtier, désert, roche/montagne, neige) disposées
// par bandes, des reliefs (arbres, montagnes, dunes) au pixel et un littoral net. Bords NETS,
// aucun gradient flou → DA cohérente avec le jeu. Appliquée en background (sans repeat) sur .levelGrid.
let _mapTexCache={};
function mapWorldTexture(seed){
 seed=(seed|0)||1337;
 if(_mapTexCache[seed])return _mapTexCache[seed];
 let GW=96,GH=72,px=4;                            // grille logique 96×72 cellules, pixel de 4
 let cv=document.createElement('canvas');cv.width=GW*px;cv.height=GH*px;
 let g=cv.getContext('2d');g.imageSmoothingEnabled=false;
 let R=(cx,cy,cw,ch,c)=>{g.fillStyle=c;g.fillRect(Math.round(cx*px),Math.round(cy*px),Math.round(cw*px),Math.round(ch*px))};
 // PRNG déterministe (carte stable d'un affichage à l'autre)
 let s=seed;let rnd=()=>{s=(s*1664525+1013904223)&0x7fffffff;return s/0x7fffffff};
 // ── OCÉAN (fond) : deux bleus + écume éparse ──
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)R(x,y,1,1,((x>>2)+(y>>2))&1?'#2f74a0':'#2a6a92');
 for(let i=0;i<70;i++){let x=(rnd()*GW)|0,y=(rnd()*GH)|0;R(x,y,1,1,'#4f97c4');R((x+1)%GW,(y+1)%GH,1,1,'#4f97c4')}
 // ── CONTINENT : masse organique centrée. On définit un rayon variable par angle (côtes douces). ──
 let cxc=GW/2,cyc=GH/2,baseR=Math.min(GW,GH)*0.42;
 let lobes=[];for(let k=0;k<7;k++)lobes.push({a:rnd()*Math.PI*2,amp:0.12+rnd()*0.18,f:2+((rnd()*4)|0)});
 let land=(x,y)=>{let dx=x-cxc,dy=(y-cyc)*1.12,d=Math.hypot(dx,dy),ang=Math.atan2(dy,dx);
  let r=baseR;lobes.forEach(l=>{r+=baseR*l.amp*Math.cos(l.f*ang+l.a)});
  return d<r;};
 // bandes de biomes par latitude (haut→bas) : neige, roche, forêt, plaine, désert, plage
 let biomeAt=(x,y)=>{
  let t=y/GH;                                     // 0 (haut) → 1 (bas)
  // littoral : si proche du bord du continent → plage
  let near=!land(x+2,y)||!land(x-2,y)||!land(x,y+2)||!land(x,y-2);
  if(near)return'beach';
  let n=(Math.sin(x*0.27)+Math.cos(y*0.31)+rnd()*0.6-0.3)*0.06; t+=n;
  if(t<0.16)return'snow';
  if(t<0.34)return'rock';
  if(t<0.56)return'forest';
  if(t<0.78)return'plain';
  return'desert';};
 let COL={snow:['#dfe9ef','#c2d2dc'],rock:['#8a8378','#6f6a60'],forest:['#3f7e34','#356d2c'],
  plain:['#5aa64a','#4f963f'],desert:['#d8b66a','#c9a657'],beach:['#e4cf94','#d8c082']};
 // peinture du continent
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){
  if(!land(x,y))continue;
  let b=biomeAt(x,y),pal=COL[b];
  R(x,y,1,1,((x+y)&1)?pal[0]:pal[1]);
 }
 // liseré de côte sombre (1 px) pour détacher du fond
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){
  if(land(x,y))continue;
  if(land(x+1,y)||land(x-1,y)||land(x,y+1)||land(x,y-1))R(x,y,1,1,'#1d4f70');
 }
 // ── RELIEFS pixel selon le biome (arbres, montagnes, dunes, congères) ──
 for(let i=0;i<260;i++){
  let x=(rnd()*GW)|0,y=(rnd()*GH)|0;if(!land(x,y))continue;
  let b=biomeAt(x,y);
  if(b==='forest'&&rnd()<0.5){R(x,y-1,1,1,'#234d1c');R(x,y,1,1,'#2c5e24');}        // sapins
  else if(b==='rock'&&rnd()<0.4){R(x,y,1,1,'#9b948a');R(x,y-1,1,1,'#b6afa3');R(x+1,y,1,1,'#5d584f');} // pics
  else if(b==='snow'&&rnd()<0.3){R(x,y,1,1,'#ffffff');}                            // congères
  else if(b==='desert'&&rnd()<0.35){R(x,y,2,1,'#c69a48');}                         // dunes
  else if(b==='plain'&&rnd()<0.25){R(x,y,1,1,'#6fbe5a');}                          // herbe claire
 }
 // une rivière sinueuse qui descend le continent (eau intérieure)
 let rx=cxc+(rnd()*10-5);
 for(let y=(cyc-baseR*0.6)|0;y<(cyc+baseR*0.7);y++){
  rx+=Math.round(rnd()*2-1);
  if(land(rx,y)){R(rx,y,1,1,'#3f8fc0');R(rx+1,y,1,1,'#357fb0');}
 }
 _mapTexCache[seed]=cv.toDataURL();
 return _mapTexCache[seed];
}
// Cadenas PIXEL-ART (nœud verrouillé) — aucun emoji.
function lockCanvas(px=20){let cv=document.createElement('canvas');cv.width=cv.height=22;let g=cv.getContext('2d');g.imageSmoothingEnabled=false;cv.className='nodeIconCv';cv.style.width=px+'px';cv.style.height=px+'px';
 let r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 r(7,4,8,2,'#b8b8c0');r(6,6,2,5,'#b8b8c0');r(14,6,2,5,'#b8b8c0');// anse
 r(5,10,12,9,'#caa94a');r(6,11,10,7,'#e0c668');r(10,13,2,3,'#6a4a18');r(9,15,4,2,'#6a4a18');// corps + trou
 return cv}
// Ankh PIXEL-ART (entrée des Ruines) — aucun emoji.
function ankhCanvas(px=22,col='#ffe35b'){let cv=document.createElement('canvas');cv.width=cv.height=22;let g=cv.getContext('2d');g.imageSmoothingEnabled=false;cv.className='nodeIconCv';cv.style.width=px+'px';cv.style.height=px+'px';
 let r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 r(8,3,6,5,col);r(9,4,4,3,'#6a4a18');// boucle
 r(9,8,4,11,col);r(5,11,12,3,col);// tige + barre
 return cv}
// CHÂTEAU FORT PIXEL-ART (nœud Ruines finales, façon Mario 3) — donjon central + tours crénelées.
function castleCanvas(px=26,locked=false){let cv=document.createElement('canvas');cv.width=cv.height=26;let g=cv.getContext('2d');g.imageSmoothingEnabled=false;cv.className='nodeIconCv';cv.style.width=px+'px';cv.style.height=px+'px';
 let r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 let stone=locked?'#6a665e':'#9b8f7a',dark=locked?'#46423c':'#6f6453',lite=locked?'#857f74':'#c2b69c',door=locked?'#2a2620':'#3a2a18',roof=locked?'#5a4640':'#9e3b2e';
 // base + sol
 r(2,22,22,3,dark);
 // tours latérales
 r(3,9,5,14,stone);r(18,9,5,14,stone);
 // créneaux tours
 r(3,7,2,2,stone);r(6,7,2,2,stone);r(18,7,2,2,stone);r(21,7,2,2,stone);
 // donjon central + créneaux
 r(9,12,8,11,stone);r(9,10,2,2,stone);r(12,10,2,2,stone);r(15,10,2,2,stone);
 // toit pointu du donjon
 r(10,5,6,3,roof);r(11,3,4,2,roof);r(12,2,2,1,roof);
 // porte voûtée
 r(11,16,4,7,door);r(12,15,2,1,door);
 // fenêtres meurtrières
 r(5,12,1,3,door);r(20,12,1,3,door);r(10,13,1,2,door);r(15,13,1,2,door);
 // lumière/ombrage
 r(3,9,5,1,lite);r(18,9,5,1,lite);r(9,12,8,1,lite);
 if(locked){g.globalAlpha=.5;r(0,0,26,26,'#1a1610');g.globalAlpha=1}
 return cv}
// PORTAIL DE DONJON PIXEL-ART (nœud crypte intermédiaire) — arche de pierre + porte clouée.
function cryptGateCanvas(px=20,locked=false){let cv=document.createElement('canvas');cv.width=cv.height=22;let g=cv.getContext('2d');g.imageSmoothingEnabled=false;cv.className='nodeIconCv';cv.style.width=px+'px';cv.style.height=px+'px';
 let r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 let stone=locked?'#5a5560':'#7d7488',dark=locked?'#3a3640':'#4a4452',door=locked?'#241f2c':'#3a2e44',stud='#b9a6d6';
 // arche
 r(3,4,16,16,stone);r(5,2,12,2,stone);
 // intérieur porte
 r(6,7,10,13,door);r(7,5,8,2,door);
 // clous
 r(8,9,1,1,stud);r(13,9,1,1,stud);r(8,14,1,1,stud);r(13,14,1,1,stud);
 // pierre d'angle + ombrage
 r(3,4,16,1,'#9a90a8');r(3,4,1,16,dark);r(18,4,1,16,dark);
 if(locked){g.globalAlpha=.5;r(0,0,22,22,'#160f1a');g.globalAlpha=1}
 return cv}
// Couleur d'ambiance du nœud selon le biome (teinte du terrain).
function biomeNodeColor(n){return{FORET:'#3f6b34',PLAGE:'#caa85a',TAIGA:'#6f8f86',DESERT:'#b58a3e',VOLCAN:'#7a3526',GROTTE:'#494049',JUNGLE:'#2f6b34',DUNES:'#a8572a',SEQUOIAS:'#5a4a2e',MARECAGE:'#4a5a3a',SAVANE:'#9a8a3e',ISLANDE:'#4a5256',YELLOWSTONE:'#a87e3e',GLACIER:'#6f9cb8',MONTAGNE:'#6a7560'}[n]||'#43603f'}
// Étoiles cumulées du niveau courant (pour déverrouiller les Ruines)
function levelStars(){let bank=curBank(),s=0;for(let i=0;i<bank.chapters.length;i++)s+=+(localStorage.getItem(starKey(i))||0);return s}
function ruinsUnlocked(){let bank=curBank();return levelStars()>=Math.ceil(bank.chapters.length*1.2)||+(localStorage.getItem(starKey(bank.chapters.length-1))||0)>0}
// Carte d'aventure : continent vu de dessus. Les nœuds (chapitres) sont des cités/lieux répartis
// CHEMIN EN SERPENTIN PAR RANGÉES (boustrophédon) : la route remplit des lignes horizontales en
// zig-zag — rangée 1 de gauche à droite, rangée 2 de droite à gauche, etc. Ça donne un espacement
// GÉNÉREUX entre nœuds (plus d'entassement) et une lecture « niveau par niveau » très claire,
// même avec 11 chapitres + cryptes + nœud final. Les index fractionnaires (cryptes à i+0.5) sont
// interpolés le long de la même route → la crypte se pose pile sur le chemin entre deux chapitres.
const MAP_PER_ROW=4;                // nœuds par rangée avant de repartir dans l'autre sens
// GRILLE PROPRE GARANTIE : chaque nœud occupe une cellule d'une grille serpentine (boustrophédon).
// Espacement calculé pour qu'AUCUN nœud ne puisse en chevaucher un autre (cellules >> taille nœud)
// et que TOUS restent dans la zone. Aucune ondulation aléatoire → plus de chevauchement ni de nœud
// hors-cadre. La route relie les cellules dans l'ordre → serpentin lisible « niveau par niveau ».
function nodeSlot(i,n){             // position (en %) du nœud entier d'index i parmi n nœuds
 let cols=Math.min(MAP_PER_ROW,n);
 let rows=Math.max(1,Math.ceil(n/cols));
 let row=Math.floor(i/cols),col=i%cols;
 let ltr=row%2===0;                 // rangées paires : gauche→droite ; impaires : droite→gauche
 // colonne 0→1 (inversée si rangée impaire pour le zig-zag serpentin)
 let cx=cols>1?col/(cols-1):0.5;if(!ltr)cx=1-cx;
 // marges latérales sûres (le nœud le plus large = ruines ~5.5% de demi-largeur → marge 11%)
 let x=11+cx*78;
 // rangée 0→1 du haut vers le bas, marges verticales sûres (demi-hauteur nœud ~12% → marge 14%)
 let ry=rows>1?row/(rows-1):0.5;
 let y=14+ry*72;
 return{x,y};
}
function nodePos(i,n){
 // index entier → slot direct ; index fractionnaire (crypte) → interpolation entre deux slots
 // EN SUIVANT l'ordre du serpentin (donc le long de la route, virages compris).
 let i0=Math.floor(i),f=i-i0;
 let a=nodeSlot(i0,n);if(f===0)return{x:clampMap(a.x),y:clampMap(a.y,true)};
 let b=nodeSlot(i0+1,n);
 return{x:clampMap(a.x+(b.x-a.x)*f),y:clampMap(a.y+(b.y-a.y)*f,true)};
}
function clampMap(v,vert){return vert?Math.max(16,Math.min(84,v)):Math.max(9,Math.min(91,v))}
// ANTI-CHEVAUCHEMENT (séparation par boîtes englobantes, BORNÉE pour ne JAMAIS sortir de la zone).
// Chaque nœud porte une demi-largeur (hx) et demi-hauteur (hy) en % du conteneur. À chaque passe,
// si deux boîtes se recouvrent sur LES DEUX axes, on les écarte sur l'axe de moindre recouvrement
// (moins déformant). On RE-CLAMPE chaque nœud dans une zone sûre TENANT COMPTE de sa demi-taille
// → un nœud ne peut jamais dépasser les bords (sa boîte reste entièrement visible).
function relaxMapNodes(nodes,iter){
 // bornes de SÉCURITÉ par nœud : son centre doit rester à >= demi-taille du bord (+petite marge).
 let M=1.5; // marge intérieure (%)
 let clampNode=nd=>{nd.x=Math.max(nd.hx+M,Math.min(100-nd.hx-M,nd.x));
                    nd.y=Math.max(nd.hy+M,Math.min(100-nd.hy-M,nd.y))};
 nodes.forEach(clampNode);
 for(let it=0;it<(iter||120);it++){let moved=false;
  for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){
   let A=nodes[a],B=nodes[b];
   let dx=B.x-A.x,dy=B.y-A.y;
   let ox=(A.hx+B.hx)-Math.abs(dx); // recouvrement horizontal (>0 si chevauchement)
   let oy=(A.hy+B.hy)-Math.abs(dy); // recouvrement vertical
   if(ox>0&&oy>0){
    // on sépare sur l'axe de moindre recouvrement (déplacement minimal)
    if(ox<oy){let s=(ox/2+.3)*(dx<0?-1:1);A.x-=s;B.x+=s}
    else{let s=(oy/2+.3)*(dy<0?-1:1);A.y-=s;B.y+=s}
    moved=true;
   }
  }
  nodes.forEach(clampNode); // borne TOUJOURS dans la zone après chaque passe
  if(!moved)break;
 }
 return nodes;
}
// Construit un tracé SVG LISSE (courbes de Catmull-Rom → Bézier) passant par tous les nœuds →
// route continue et organique au lieu de segments droits cassés.
function smoothPath(pts){
 if(pts.length<2)return 'M '+pts[0].x+' '+pts[0].y;
 let d='M '+pts[0].x+' '+pts[0].y;
 for(let i=0;i<pts.length-1;i++){
  let p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
  let c1x=p1.x+(p2.x-p0.x)/6,c1y=p1.y+(p2.y-p0.y)/6;
  let c2x=p2.x-(p3.x-p1.x)/6,c2y=p2.y-(p3.y-p1.y)/6;
  d+=` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
 }
 return d;
}
function showChapters(){let bank=curBank(),biomes=curBiomes(),themes=curThemeMap(),n=bank.chapters.length;ui.chapters.innerHTML='';ui.chapters.className='levelGrid';
 // FOND : VRAIE CARTE DU MONDE pixel-art (continent + biomes) générée en JS → DA cohérente,
 // pixels nets. Une seule image (pas de damier répété), étirée pour couvrir le conteneur.
 ui.chapters.style.backgroundColor='#2a6a92';
 ui.chapters.style.backgroundImage='url("'+mapWorldTexture(gradeLevel==='4e'?4242:1337)+'")';
 ui.chapters.style.backgroundSize='100% 100%';
 ui.chapters.style.backgroundRepeat='no-repeat';
 ui.chapters.style.imageRendering='pixelated';
 let tt=document.querySelector('#chapterTitle');if(tt)tt.textContent='AVENTURE '+(gradeLevel==='4e'?'4E':'5E');
 let totalStars=0;
 // ── DISPOSITION ROBUSTE : GRILLE EN FLUX (CSS grid) ──────────────────────────────────────────
 // Plus de positionnement absolu en % ni de canvas/SVG de fond (qui, en file://, pouvait ne pas
 // se dimensionner et masquer les nœuds). Les cartes sont simplement empilées dans une grille :
 // le navigateur garantit que TOUS les niveaux + cryptes + ruines s'affichent, toujours.
 // Ordre de lecture : ch.1 … ch.k, [crypte après chaque 3e], …, RUINES (carte finale).
 let current=-1;for(let i=0;i<n;i++){if(chapterUnlocked(i)&&+(localStorage.getItem(starKey(i))||0)===0){current=i;break}}
 let order=0; // délai d'apparition en cascade
 for(let i=0;i<n;i++){
  let c=bank.chapters[i];
  let stars=+(localStorage.getItem(starKey(i))||0);totalStars+=stars;
  let b=document.createElement('button');
  try{
   let done=stars>0,unlocked=chapterUnlocked(i),best=+(localStorage.getItem(bestKey(i))||0),bn=biomes[i]||('CHAP '+(i+1)),tname=(THEMES[themes[i]%THEMES.length]||{}).n||'FORET';
   b.className='mapNode'+(done?' done':'')+(unlocked?'':' locked')+(i===current?' current':'');b.style.setProperty('--biome',biomeNodeColor(tname));
   b.style.animationDelay=(order++*0.05)+'s';// apparition en cascade (vie)
   if(unlocked){
    // emblème PIXEL-ART du biome (canvas) + numéro + étoiles + nom (aucun emoji)
    let ic=document.createElement('div');ic.className='nodeIcon';ic.appendChild(biomeIconCanvas(tname));b.appendChild(ic);
    let num=document.createElement('span');num.className='nodeNum';num.textContent=i+1;b.appendChild(num);
    let st=document.createElement('span');st.className='nodeStars';st.innerHTML=pixelStars(stars);b.appendChild(st);
    let nm=document.createElement('span');nm.className='nodeName';nm.textContent=noAcc(bn);b.appendChild(nm);
    if(best){let bs=document.createElement('span');bs.className='nodeBest';bs.textContent=best;b.appendChild(bs)}
    b.title='Ch. '+(i+1)+' — '+(c?c.n:'')+(best?` · record ${best}`:'');b.onclick=()=>startGame(i);}
   else{let ic=document.createElement('div');ic.className='nodeIcon';ic.appendChild(lockCanvas());b.appendChild(ic);
    let num=document.createElement('span');num.className='nodeNum';num.textContent=i+1;b.appendChild(num);
    let nm=document.createElement('span');nm.className='nodeName';nm.textContent='?';b.appendChild(nm);
    b.title='Termine le chapitre '+i+' pour débloquer';b.onclick=()=>{b.classList.add('shakeNode');setTimeout(()=>b.classList.remove('shakeNode'),400)}}
  }catch(err){
   // secours : médaillon minimal mais TOUJOURS présent et cliquable
   b.className='mapNode';
   let num=document.createElement('span');num.className='nodeNum';num.textContent=i+1;b.appendChild(num);
   b.onclick=()=>startGame(i);
  }
  ui.chapters.appendChild(b);
  // ── CRYPTE INTERMÉDIAIRE : un mini-donjon après chaque 3e chapitre (ch. 3, 6, 9…). ──
  if((i+1)%3===0&&i<n-1){
   try{
    let prevDone=stars>0;
    let nodeId='crypt'+i,cleared=localStorage.getItem('temple-ruins-'+gradePrefix()+nodeId+'-cleared')==='1';
    let cn=document.createElement('button');cn.className='mapNode cryptNode'+(prevDone?'':' locked')+(cleared?' done':'');
    cn.style.setProperty('--biome','#3a2e44');cn.style.animationDelay=(order++*0.05)+'s';
    let cic=document.createElement('div');cic.className='nodeIcon';cic.appendChild(cryptGateCanvas(20,!prevDone));cn.appendChild(cic);
    let cnm=document.createElement('span');cnm.className='nodeName';cnm.textContent=prevDone?'CRYPTE':'?';cn.appendChild(cnm);
    if(prevDone){cn.title='Crypte oubliée — mini-donjon (perk permanent à la clé)';cn.onclick=()=>startRuins('small',nodeId)}
    else{cn.title='Termine le chapitre '+(i+1)+' pour ouvrir la crypte';cn.onclick=()=>{cn.classList.add('shakeNode');setTimeout(()=>cn.classList.remove('shakeNode'),400)}}
    ui.chapters.appendChild(cn);
   }catch(err){/* une crypte qui échoue ne doit jamais bloquer le reste de la carte */}
  }
 }
 // nœud final : Ruines du Temps
 let unlocked=ruinsUnlocked();let rn=document.createElement('button');rn.className='mapNode ruinsNode'+(unlocked?' unlocked':' locked');
 rn.style.animationDelay=(order++*0.05)+'s';
 let ric=document.createElement('div');ric.className='nodeIcon';ric.appendChild(castleCanvas(30,!unlocked));rn.appendChild(ric);
 let rnm=document.createElement('span');rnm.className='nodeName';rnm.textContent='RUINES';rn.appendChild(rnm);
 rn.title=unlocked?'Ruines du Temps':'Gagne des étoiles pour débloquer';
 rn.onclick=()=>{if(ruinsUnlocked())startRuins('final','');else{rn.classList.add('shakeNode');setTimeout(()=>rn.classList.remove('shakeNode'),400)}};ui.chapters.appendChild(rn);
 let maxStars=n*3,total=+(localStorage.getItem('temple-total')||0),badges=Object.keys(JSON.parse(localStorage.getItem('temple-badges')||'{}')).length;
 let pk=getPerks(),pkList=[pk.heart&&'CŒUR',pk.dash&&'DASH+',pk.whip&&'FOUET+'].filter(Boolean);
 let pkHtml=pkList.length?` &nbsp; <span class="gold">POUVOIRS : ${pkList.join(' · ')}</span>`:'';
 let rubisTot=getRubis();
 document.querySelector('#careerStats').innerHTML=`<span class="pstar"></span> <span class="gold">${totalStars}/${maxStars}</span> &nbsp; <span class="pcoin"></span> ${total} PTS &nbsp; <span class="rubisGem"></span> <span class="gold">${rubisTot}</span> RUBIS &nbsp; <span class="gold">${badges}</span> SUCCES`;
 show('chapterScreen');
 // SENTIER reliant les nœuds dans l'ordre de lecture (overlay SVG calé sur la grille après layout)
 _ensureMapTrailResize();
 requestAnimationFrame(drawLevelPath);
}
// Trace le SENTIER pixel (SVG) qui relie tous les médaillons dans l'ordre. Mesuré APRÈS layout
// (rAF) → robuste quel que soit le nombre de colonnes de la grille. Segments parcourus dorés,
// verrouillés grisés/pointillés. Fallback file:// : si mesures à 0, on ne dessine rien.
function drawLevelPath(){
 let cont=ui.chapters;if(!cont)return;
 let old=cont.querySelector('#mapTrail');if(old)old.remove();
 let nodes=[...cont.querySelectorAll('.mapNode')];if(nodes.length<2)return;
 let cb=cont.getBoundingClientRect();if(cb.width<2||cb.height<2)return;
 // centres relatifs au conteneur (en tenant compte du scroll interne)
 let pts=nodes.map(nd=>{let r=nd.getBoundingClientRect();
  return{x:r.left-cb.left+cont.scrollLeft+r.width/2,y:r.top-cb.top+cont.scrollTop+r.height/2,
   done:nd.classList.contains('done'),locked:nd.classList.contains('locked')};});
 if(pts.some(p=>!isFinite(p.x)||!isFinite(p.y)))return;
 let W=cont.scrollWidth,H=cont.scrollHeight;
 let svgns='http://www.w3.org/2000/svg';
 let svg=document.createElementNS(svgns,'svg');svg.setAttribute('id','mapTrail');
 svg.setAttribute('width',W);svg.setAttribute('height',H);
 svg.setAttribute('viewBox','0 0 '+W+' '+H);
 svg.style.cssText='position:absolute;left:0;top:0;width:'+W+'px;height:'+H+'px;pointer-events:none;z-index:1';
 // un segment par paire de nœuds → couleur selon l'état (atteint vs verrouillé)
 let mk=(d,col,w,dash)=>{let p=document.createElementNS(svgns,'path');p.setAttribute('d',d);
  p.setAttribute('fill','none');p.setAttribute('stroke',col);p.setAttribute('stroke-width',w);
  p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');
  if(dash)p.setAttribute('stroke-dasharray',dash);p.setAttribute('shape-rendering','crispEdges');return p};
 for(let i=0;i<pts.length-1;i++){
  let a=pts[i],b=pts[i+1];
  // courbe de Catmull-Rom locale (4 points de contrôle) → raccord lisse et continu
  let p0={x:pts[i-1]?pts[i-1].x:a.x,y:pts[i-1]?pts[i-1].y:a.y},p1=a,p2=b,p3={x:pts[i+2]?pts[i+2].x:b.x,y:pts[i+2]?pts[i+2].y:b.y};
  let c1x=p1.x+(p2.x-p0.x)/6,c1y=p1.y+(p2.y-p0.y)/6,c2x=p2.x-(p3.x-p1.x)/6,c2y=p2.y-(p3.y-p1.y)/6;
  let d='M '+p1.x.toFixed(1)+' '+p1.y.toFixed(1)+' C '+c1x.toFixed(1)+' '+c1y.toFixed(1)+' '+c2x.toFixed(1)+' '+c2y.toFixed(1)+' '+p2.x.toFixed(1)+' '+p2.y.toFixed(1);
  let reached=a.done&&!b.locked;     // segment franchi (le précédent est fait, le suivant accessible)
  // liseré sombre dessous
  svg.appendChild(mk(d,'#101b12',9));
  // trait principal : doré plein si parcouru, sinon beige pointillé (à venir / verrouillé)
  svg.appendChild(mk(d,reached?'#f4d779':(b.locked?'#9a9384':'#e7cf93'),5,reached?'':'9 7'));
 }
 cont.appendChild(svg);
}
// recalage du sentier sur redimensionnement, uniquement si l'écran de carte est visible.
let _mapTrailResize=false;
function _ensureMapTrailResize(){if(_mapTrailResize)return;_mapTrailResize=true;
 window.addEventListener('resize',()=>{let sc=document.querySelector('#chapterScreen');
  if(sc&&!sc.classList.contains('hidden'))requestAnimationFrame(drawLevelPath);});}
// ── Fond de carte : CONTINENT VU DE DESSUS. Océan tout autour, une masse continentale unique
// découpée en CONTRÉES (une par biome, attribuées par Voronoï au nœud le plus proche), littoral
// adouci, reliefs, fleuves, route reliant les lieux, rose des vents. Plus de « parchemin moche ».
function drawAdventureMapBg(cv,pts,themes,n){let g=cv.getContext('2d');g.imageSmoothingEnabled=false;let W=cv.width,H=cv.height;
 const rc=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x|0,y|0,w,h)};
 const S=4; // taille de tuile pixel
 // points en pixels (incluant le nœud final Ruines = centre du continent)
 let P=pts.map(p=>({x:p.x/100*W,y:p.y/100*H}));
 let tn=i=>THEMES[themes[Math.min(i,themes.length-1)]%THEMES.length].n;
 // bruit doux déterministe MULTI-OCTAVE pour onduler le littoral et les régions (plus organique)
 let noise=(x,y)=>Math.sin(x*.018+y*.011)*1+Math.sin(x*.005-y*.02)*.8+Math.cos(x*.03+y*.007)*.5
  +Math.sin(x*.06+y*.045)*.32+Math.cos(x*.085-y*.05)*.22;
 // centre de masse du continent
 let mcx=0,mcy=0;P.forEach(p=>{mcx+=p.x;mcy+=p.y});mcx/=P.length;mcy/=P.length;
 // rayon « d'influence » continentale : un point est TERRE s'il est proche d'au moins un nœud
 // (union de disques) → forme organique épousant le semis de lieux.
 let landR=Math.max(W,H)*.16;
 // PRÉ-CALCUL d'une grille (terre? + index de contrée) → un seul balayage coûteux, réutilisé partout.
 let GW=Math.ceil(W/S),GH=Math.ceil(H/S);
 let landGrid=new Uint8Array(GW*GH),regGrid=new Int16Array(GW*GH);
 for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){let x=gx*S,y=gy*S,nb=noise(x,y),land=0,bi=0,bd=1e9;
  for(let i=0;i<n;i++){let dxp=x-P[i].x,dyp=y-P[i].y,d=Math.sqrt(dxp*dxp+dyp*dyp);if(d<bd){bd=d;bi=i}if(d<landR+nb*14)land=1}
  if(!land&&Math.hypot(x-mcx,y-mcy)<landR*1.5+nb*16)land=1;
  landGrid[gy*GW+gx]=land;regGrid[gy*GW+gx]=bi;}
 let isLand=(x,y)=>{let gx=Math.floor(x/S),gy=Math.floor(y/S);if(gx<0||gy<0||gx>=GW||gy>=GH)return false;return landGrid[gy*GW+gx]===1};
 let nearest=(x,y)=>{let gx=Math.max(0,Math.min(GW-1,Math.floor(x/S))),gy=Math.max(0,Math.min(GH-1,Math.floor(y/S)));return regGrid[gy*GW+gx]};
 // 1) OCÉAN de fond : dégradé PROGRESSIF profond→côtier en plusieurs bandes + houle pixel
 let oceanBands=['#23527a','#2a5f8a','#316b98','#3a7cab','#468cba','#52a0cc'];
 for(let y=0;y<H;y+=S)for(let x=0;x<W;x+=S){
  let dc=Math.hypot(x-mcx,y-mcy)/(Math.max(W,H)*.62);
  let bi=Math.max(0,Math.min(oceanBands.length-1,Math.floor((1-Math.min(1,dc))*oceanBands.length)));
  // léger moiré de profondeur
  let wob=(Math.sin(x*.04+y*.05)+Math.cos(x*.03-y*.04))>1.3?1:0;
  rc(x,y,S,S,oceanBands[Math.max(0,bi-wob)]);
 }
 // houle/écume au large
 for(let k=0;k<170;k++){let x=(k*53+((k*k)%7)*40)%W,y=(k*97+((k*5)%9)*30)%H;if(!isLand(x,y)){rc(x,y,7,1,'#7fb6db');rc(x+2,y+3,5,1,'#9fcde8')}}
 // ÉCUME CÔTIÈRE : anneau d'écume progressif autour du continent (transition douce mer→terre)
 for(let y=0;y<H;y+=S)for(let x=0;x<W;x+=S){
  if(isLand(x,y))continue;
  let nearLand=isLand(x-S,y)||isLand(x+S,y)||isLand(x,y-S)||isLand(x,y+S);
  let near2=isLand(x-2*S,y)||isLand(x+2*S,y)||isLand(x,y-2*S)||isLand(x,y+2*S);
  if(nearLand)rc(x,y,S,S,'#bfe2f2');
  else if(near2&&((x+y)/S)%2===0)rc(x,y,S,S,'#86c2dd');
 }
 // 2) TERRE : balaye la grille, peint chaque tuile-terre de la couleur de sa contrée (Voronoï).
 //    Détecte la côte (voisine d'océan) → liseré sable + ombrage de littoral.
 let zoneName={FORET:'BOIS',PLAGE:'RIVAGE',TAIGA:'TAIGA',DESERT:'DÉSERT',VOLCAN:'VOLCANS',GROTTE:'CAVERNE',JUNGLE:'JUNGLE',DUNES:'DUNES',SEQUOIAS:'SÉQUOIAS',MARECAGE:'MARAIS',SAVANE:'SAVANE',ISLANDE:'ISLANDE',YELLOWSTONE:'GEYSERS',GLACIER:'GLACIER',MONTAGNE:'MONTS'};
 // couleur d'une contrée (mémo) + mélange doux entre deux contrées voisines.
 let colCache={},colOf=i=>colCache[i]||(colCache[i]=biomeNodeColor(tn(i)));
 let mix=(a,b,t)=>{let pa=a.replace('#',''),pb=b.replace('#','');let f=(s,o)=>parseInt(s.slice(o,o+2),16);
  let r=Math.round(f(pa,0)*(1-t)+f(pb,0)*t),gg=Math.round(f(pa,2)*(1-t)+f(pb,2)*t),bb=Math.round(f(pa,4)*(1-t)+f(pb,4)*t);
  return'#'+[r,gg,bb].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('')};
 // teinte de relief : assombrit dans les creux, éclaircit sur les bosses (donne du modelé au terrain)
 for(let y=0;y<H;y+=S)for(let x=0;x<W;x+=S){
  if(!isLand(x,y))continue;
  let coast=!isLand(x-S,y)||!isLand(x+S,y)||!isLand(x,y-S)||!isLand(x,y+S);
  let reg=nearest(x,y),col=colOf(reg);
  if(coast){rc(x,y,S,S,'#e6d49c');continue} // sable clair en bord d'eau
  // PLAGE PROGRESSIVE : 2e anneau sable doré, 3e anneau herbe-sable mêlés → fondu vers l'intérieur.
  let near2=!isLand(x-2*S,y)||!isLand(x+2*S,y)||!isLand(x,y-2*S)||!isLand(x,y+2*S);
  if(near2){rc(x,y,S,S,'#d2b46e');continue}
  let near3=!isLand(x-3*S,y)||!isLand(x+3*S,y)||!isLand(x,y-3*S)||!isLand(x,y+3*S);
  if(near3){rc(x,y,S,S,((x+y)/S)%2===0?shade(col,-6):'#c2a86a');continue}
  // FONDU ENTRE CONTRÉES : si une région voisine diffère, on dégrade vers sa couleur (zone de transition douce, plus de frontière dure)
  let rR=nearest(x+2*S,y),rD=nearest(x,y+2*S),rL=nearest(x-2*S,y),rU=nearest(x,y-2*S);
  let other=rR!==reg?rR:rD!==reg?rD:rL!==reg?rL:rU!==reg?rU:reg;
  if(other!==reg){
   // largeur de fondu = quelques tuiles ; dithering pour un dégradé pixel sans bande nette
   let oc=colOf(other),blend=mix(col,oc,.5);
   let d=((x*7+y*11)%5);col=d<2?col:d<4?blend:oc;
  }
  // RELIEF : ondulation de luminosité multi-fréquence (collines/vallées) + grain fin → terrain vivant, pas un aplat
  let shadeN=Math.sin(x*.05+y*.035)*8+Math.cos(x*.022-y*.06)*6+Math.sin(x*.11+y*.09)*4;
  let grain=((x*13+y*7)%17);grain=grain<3?-6:grain>14?6:0;
  rc(x,y,S,S,shade(col,Math.round(shadeN+grain)));
 }
 // 3) micro-bocage : taches de végétation/champs déterministes pour casser l'uniformité (sans frontière dure)
 for(let y=2*S;y<H-2*S;y+=S)for(let x=2*S;x<W-2*S;x+=S){if(!isLand(x,y))continue;
  let coast=!isLand(x-S,y)||!isLand(x+S,y)||!isLand(x,y-S)||!isLand(x,y+S);if(coast)continue;
  let h=((x*131+y*57)>>>0)%53;if(h<2){let col=colOf(nearest(x,y));rc(x,y,S,S,shade(col,-16));rc(x+S,y,S,S,shade(col,-10))}
  else if(h===7){let col=colOf(nearest(x,y));rc(x,y,S,S,shade(col,16))}}
 // 4) FLEUVES : depuis 1-2 reliefs intérieurs jusqu'à la mer (ligne sinueuse bleue).
 for(let f=0;f<2;f++){let x=mcx+(f?40:-40),y=mcy-30,guard=0;
  while(guard++<120){if(x<2||y<2||x>W-2||y>H-2||!isLand(x,y))break;rc(x,y,S,1,'#5aa6d8');rc(x+1,y+1,2,1,'#8fd0ee');
   y+=S;x+=Math.round(Math.sin(y*.05+f*2)*S)}}
 // 5) RELIEFS/DÉCO par contrée + NOM gravé (style atlas).
 for(let i=0;i<n;i++){let cx=P[i].x,cy=P[i].y,t=tn(i),deco=biomeMapDeco(t);
  for(let d2=0;d2<5;d2++){let ox=cx-30+((i*17+d2*29)%60),oy=cy-26+((i*13+d2*23)%30);if(isLand(ox,oy))deco(g,rc,ox,oy)}
  let zn=zoneName[t]||'TERRES',ty=cy+34;g.font='9px "Press Start 2P",monospace';g.textAlign='center';
  g.fillStyle='rgba(20,30,18,.45)';g.fillText(zn,cx+1,ty+1);g.fillStyle='#fff7e0';g.fillText(zn,cx,ty)}
 g.textAlign='left';
 // 6) cadre sombre net (pas de « brûlé » de parchemin)
 g.globalAlpha=.4;for(let x=0;x<W;x+=S){rc(x,0,S,S,'#0d1a26');rc(x,H-S,S,S,'#0d1a26')}for(let y=0;y<H;y+=S){rc(0,y,S,S,'#0d1a26');rc(W-S,y,S,S,'#0d1a26')}g.globalAlpha=1;
 // 7) rose des vents PIXEL (coin haut-droit), sur cartouche océan
 let rx=W-50,ry=52;rc(rx-34,ry-34,68,68,'rgba(13,26,38,.45)');
 rc(rx-1,ry-30,2,60,'#e8dcc0');rc(rx-30,ry-1,60,2,'#e8dcc0');
 g.fillStyle='#cdbf9a';g.beginPath();g.moveTo(rx,ry-16);g.lineTo(rx+5,ry);g.lineTo(rx,ry+16);g.lineTo(rx-5,ry);g.closePath();g.fill();
 rc(rx-2,ry-30,4,12,'#d23b2a');g.fillStyle='#f0e6cf';g.font='8px "Press Start 2P",monospace';g.textAlign='center';
 g.fillText('N',rx,ry-22);g.fillText('S',rx,ry+30);g.fillText('E',rx+26,ry+3);g.fillText('O',rx-26,ry+3);g.textAlign='left'}
function shade(hex,d){let m=hex.replace('#','');let r=Math.max(0,Math.min(255,parseInt(m.slice(0,2),16)+d)),gg=Math.max(0,Math.min(255,parseInt(m.slice(2,4),16)+d)),b=Math.max(0,Math.min(255,parseInt(m.slice(4,6),16)+d));return'#'+[r,gg,b].map(v=>v.toString(16).padStart(2,'0')).join('')}
// retourne une fonction de dessin de petit relief selon le biome
function biomeMapDeco(tn){
 if(['MONTAGNE','TAIGA','GLACIER','ISLANDE'].includes(tn))return(g,rc,x,y)=>{rc(x,y,8,2,'#6a7560');rc(x+1,y-3,6,3,'#7e8a6e');rc(x+2,y-6,4,3,'#9aa68a');rc(x+3,y-8,2,2,'#fff')};// montagne+neige
 if(['DESERT','DUNES','SAVANE','YELLOWSTONE'].includes(tn))return(g,rc,x,y)=>{rc(x+2,y-7,2,7,'#3d8c55');rc(x,y-4,2,2,'#3d8c55');rc(x+4,y-3,2,2,'#3d8c55')};// cactus/acacia
 if(['PLAGE'].includes(tn))return(g,rc,x,y)=>{rc(x+2,y-7,2,7,'#7a4a26');rc(x,y-9,7,3,'#3d8c55')};// palmier
 if(['VOLCAN'].includes(tn))return(g,rc,x,y)=>{rc(x,y,8,3,'#5a2a18');rc(x+2,y-3,4,3,'#9e2a08');rc(x+3,y-5,2,3,'#ff7a1f')};// volcan
 if(['GROTTE'].includes(tn))return(g,rc,x,y)=>{rc(x+1,y-2,6,2,'#494049');rc(x+2,y-6,3,4,'#6a5e6a');rc(x+3,y-8,1,2,'#8a7e8a')};// stalagmite
 return(g,rc,x,y)=>{rc(x+2,y-6,3,7,'#5a3a22');rc(x,y-10,8,6,'#3f7e34');rc(x+1,y-12,6,3,'#4a8a3e')};// arbre feuillu
}
// ====== RUINES DU TEMPS (Étape C) — niveau d'exploration multi-salles ======
// Les RUINES sont un ancien temple de PIERRE, identique en 5e ET en 4e (le 4e ne doit plus
// hériter du thème GLACIER, jugé moche : il prend le même décor rocheux que la ruine 5e).
function ruinsTheme(){return THEMES.find(t=>t.n==='MONTAGNE')||THEMES[THEMES.length-1]}
// ── Donjon « Indiana Jones » : grille de salles-modèles 3×2, assemblées avec variation.
// Chaque salle reçoit un template de contenu (gouffre, dalles, clé, pics, rocher…).
// Murs entre salles = pierre pleine ; passages = ouvertures 2 tuiles (parfois une porte).
// GRILLE DE DONJON VARIABLE : les dimensions ne sont plus fixes. Chaque expédition tire une
// disposition différente (3×2 → 4×3) selon la profondeur du chapitre → plus aucun donjon
// identique. Réglées dans genRuins() via pickRuinsGrid().
let ROOM_COLS=3,ROOM_ROWS=2;
// Choisit la taille de la grille selon la progression : plus le chapitre est avancé, plus le
// donjon est grand (et donc long/varié). Tirage aléatoire borné pour garder de la surprise.
function pickRuinsGrid(forceSize){
 // Ruines INTERMÉDIAIRES (tous les 3 niveaux) = petit donjon ; Ruines FINALES = vaste donjon
 // réunissant toutes les familles d'épreuves. Sinon : taille proportionnelle à la profondeur.
 // ÉPREUVE DU TEMPLE (niveaux classiques) : 3 salles en ligne → entrée · 1 énigme · gardien.
 if(forceSize==='trial'){ROOM_COLS=3;ROOM_ROWS=1;return}
 if(forceSize==='small'){let pk=[[3,2],[4,2]][rng(2)];ROOM_COLS=pk[0];ROOM_ROWS=pk[1];return}
 if(forceSize==='final'){ROOM_COLS=4;ROOM_ROWS=3;return}
 let depth=Math.max(0,Math.min(1,(selectedChapter||0)/Math.max(1,curThemeMap().length-1)));
 // pool de formes de grille (cols×rows) du plus petit au plus grand
 let pool=[[3,2],[4,2],[3,3],[4,3]];
 // fenêtre d'index pondérée par la profondeur (début → petites grilles, fin → grandes)
 let lo=Math.floor(depth*1.4),hi=Math.min(pool.length-1,lo+1+rng(2));
 lo=Math.max(0,Math.min(pool.length-1,lo));hi=Math.max(lo,Math.min(pool.length-1,hi));
 let pick=pool[lo+rng(hi-lo+1)];
 ROOM_COLS=pick[0];ROOM_ROWS=pick[1];
}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=rng(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function roomAt(gx,gy){return rooms.find(r=>r.gx===gx&&r.gy===gy)}
// salle contenant une position tuile
function roomOf(tx,ty){return rooms.find(r=>Math.floor(tx)>=r.x&&Math.floor(tx)<r.x+r.w&&Math.floor(ty)>=r.y&&Math.floor(ty)<r.y+r.h)}
// ÉPREUVE RÉSOLUE ? — condition de réussite par type de salle (sert au GATE STRICT).
// plates : toutes les dalles de la salle activées · riddle : énigme finie ·
// skill (spikes/gauntlet/chase/bridge/pits/boulder) : le joueur a atteint la sortie vivant
// (détecté en franchissant la moitié de la salle vers la porte de sortie) · key : flag manuel.
function roomSolved(r){if(!r)return false;if(r.solved)return true;
 if(r.kind==='plates'){let ps=plates.filter(p=>p.room===r.id);return ps.length>0&&ps.every(p=>p.on)}
 if(r.kind==='riddle')return !!r.riddleDone;
 // puzzles à tâche (leviers/portails/miroirs/simon) : résolus quand r.puzzleDone est vrai.
 if(['levers','portal','mirror','simon'].includes(r.kind))return !!r.puzzleDone;
 if(['spikes','gauntlet','chase','bridge','pits','boulder','ice','crusher','voidmaze'].includes(r.kind)){
  // PREUVE DE TRAVERSÉE : il faut avoir touché le poste de contrôle (r.crossed) au cœur
  // du danger ET atteindre le seuil de sortie. Impossible d'esquiver l'épreuve.
  if(r.crossed&&r.exitDoorXY&&Math.hypot(player.x-r.exitDoorXY.x-.5,player.y-r.exitDoorXY.y-.5)<1.6)return true;
  return false}
 return false}
function markRoomSolved(id){let r=rooms.find(o=>o.id===id);if(r)r.solved=true}
// cherche une case de sol libre dans une salle (évite vide/murs/dalles/clé/blocs)
function freeRoomCellOk(r,x,y){return map[y]&&map[y][x]===0&&!solid(x+.5,y+.5)&&!plates.some(p=>p.x===x&&p.y===y)&&!keysArr.some(k=>k.x===x&&k.y===y)&&!blocks.some(b=>b.x===x&&b.y===y)}
// Cherche une case de sol libre dans une salle (évite vide/murs/dalles/clé/blocs).
// JAMAIS null : après 60 tirages aléatoires, balaye toute la salle de façon déterministe ;
// en dernier recours renvoie le centre (sol garanti par clearRoomCore) → aucun élément d'épreuve
// ne peut être « omis » faute de case, ce qui rendait certaines épreuves insolubles.
function freeRoomCell(r){
 for(let z=0;z<60;z++){let x=r.x+1+rng(r.w-2),y=r.y+1+rng(r.h-2);if(freeRoomCellOk(r,x,y))return{x,y}}
 for(let y=r.y+1;y<r.y+r.h-1;y++)for(let x=r.x+1;x<r.x+r.w-1;x++){if(freeRoomCellOk(r,x,y))return{x,y}}
 return{x:r.cx,y:r.cy};
}
function genRuins(){
 pickRuinsGrid(ruinsSize); // taille du donjon : 'small' (intermédiaire), 'final' (vaste), ou variable
 map=Array.from({length:MH},()=>Array(MW).fill(3)); // tout en pierre pleine
 elev=Array.from({length:MH},()=>Array(MW).fill(0)); // donjons plats (pas de relief)
 doors=[];keysArr=[];plates=[];treasure=null;ruinsBossDone=false;tripwires=[];pendingPits=[];movers=[];boulder=null;blocks=[];rooms=[];cobwebs=[];props=[];
 // ── Nouvelles mécaniques (Chantier 3) : état des puzzles/parkours additionnels ──
 levers=[];portals=[];iceZones=[];mirrors=[];beams=[];crushers=[];simons=[];
 // ── MURS DE PICS QUI SE REFERMENT (épreuves dalles/leviers sous pression) ──
 closingWalls=[];
 // ── GATE STRICT : liste des « goulots » de porte à re-sceller après les templates ──
 doorThroats=[];
 // ── Salles à TAILLES TRÈS VARIABLES + placement DÉCALÉ (vibe temple Indiana Jones,
 // pas une grille de boîtes alignées). La grille gx/gy ne sert plus que de GRAPHE logique
 // (arbre couvrant + gate strict) ; visuellement chaque salle a une taille et une position
 // fortement jitterées dans sa cellule → grandes salles cérémonielles, antichambres, recoins.
 let cw=Math.floor(MW/ROOM_COLS),chh=Math.floor(MH/ROOM_ROWS);
 for(let gy=0;gy<ROOM_ROWS;gy++)for(let gx=0;gx<ROOM_COLS;gx++){
  let cellX=gx*cw,cellY=gy*chh;
  // 30% des salles sont « grandes » (cérémonielles), sinon taille moyenne/petite très variable.
  let big=rng(10)<3;
  let wMin=big?cw-3:7,wMax=cw-2,hMin=big?chh-3:6,hMax=chh-2;
  let w=wMin+rng(Math.max(1,wMax-wMin+1)),h=hMin+rng(Math.max(1,hMax-hMin+1));
  w=Math.min(w,cw-2);h=Math.min(h,chh-2);
  // Plafonds de taille : aucune salle ne doit dépasser ~la fenêtre (sinon désorientation).
  // Particulièrement utile pour l'ÉPREUVE (grille 3×1 → cellules très hautes).
  let maxW=Math.min(cw-2,16),maxH=Math.min(chh-2,13);
  w=Math.min(w,maxW);h=Math.min(h,maxH);
  // jitter de position DANS la cellule (la salle n'est pas centrée → asymétrie organique)
  let slackX=Math.max(1,cw-w-1),slackY=Math.max(1,chh-h-1);
  let x=cellX+1+rng(slackX),y=cellY+1+rng(slackY);
  x=Math.max(1,Math.min(MW-w-1,x));y=Math.max(1,Math.min(MH-h-1,y));
  let cx=x+Math.floor(w/2),cy=y+Math.floor(h/2);
  rooms.push({id:gy*ROOM_COLS+gx,gx,gy,x,y,w,h,cx,cy,big,kind:'empty',doors:[],visited:false,mirror:rng(2)===0});
 }
 // ── Disposition NON LINÉAIRE : arbre couvrant aléatoire (DFS) sur la grille de salles ──
 // Produit un tracé branché (chemin principal + impasses latérales), pas un serpentin fixe.
 let edges=buildRoomTree(); // [{a,b}] arêtes de l'arbre reliant salles voisines
 let startRoom=roomAt(0,rng(ROOM_ROWS)); // entrée sur la colonne gauche (place variable)
 // la salle trésor = la salle la plus « loin » de l'entrée dans l'arbre (vraie profondeur)
 let dist=bfsRoomDist(startRoom,edges);
 let treasureRoom=rooms.slice().sort((a,b)=>(dist[b.id]||0)-(dist[a.id]||0))[0];
 // chemin principal start→trésor (pour y placer les épreuves dans l'ordre de difficulté)
 let mainPath=roomPath(startRoom,treasureRoom,edges);
 // épreuves : 'keys','pits','plates' garantis + des épreuves VARIÉES tirées d'un large pool
 // (15 mécaniques distinctes : parkour, puzzles, mémoire). Réparties sur le chemin principal.
 // GRAND POOL d'épreuves classées par "famille" pour alterner les types (parkour → puzzle →
 // mémoire → clé) le long du chemin et éviter deux épreuves identiques d'affilée.
 let famParkour=shuffle(['spikes','boulder','gauntlet','bridge','chase','pits','ice','crusher','voidmaze','lava']);
 let famPuzzle=shuffle(['plates','levers','portal','mirror']);
 let famMemory=shuffle(['simon','riddle']);
 let famKey=shuffle(['keys']);
 startRoom.kind='start';treasureRoom.kind='treasure';
 // assigne les épreuves aux salles intermédiaires du chemin principal en alternant les familles
 // (cycle parkour→puzzle→parkour→mémoire→clé) → progression rythmée, jamais deux fois pareil.
 let midRooms=mainPath.slice(1,-1);
 let famCycle=[famParkour,famPuzzle,famParkour,famMemory,famKey,famPuzzle];
 if(templeTrial){
  // ÉPREUVE DU TEMPLE : l'unique salle intermédiaire est forcément une ÉNIGME (pool puzzle/mémoire).
  let pool=shuffle(['levers','plates','mirror','simon','riddle']);
  midRooms.forEach((r,k)=>{r.kind=pool[k%pool.length]});
  rooms.forEach(r=>{if(r.kind==='empty')r.kind=pool[rng(pool.length)]});
 }else{
  let famIdx={};let prev=null;
  midRooms.forEach((r,k)=>{
   let fam=famCycle[k%famCycle.length];famIdx[k%famCycle.length]=famIdx[k%famCycle.length]||0;
   let kind=fam[famIdx[k%famCycle.length]++ % fam.length];
   if(kind===prev){kind=fam[(famIdx[k%famCycle.length]++)%fam.length]}// jamais deux fois de suite
   r.kind=kind;prev=kind;
  });
  // garantit qu'au moins une salle 'keys' existe si une porte à clé est nécessaire plus loin
  if(midRooms.length&&!midRooms.some(r=>r.kind==='keys'))midRooms[Math.floor(midRooms.length/2)].kind='keys';
  // salles HORS chemin principal = défis optionnels variés (labyrinthe, énigme, antichambre,
  // + nouvelles mécaniques de puzzle/parkour) — REMPLIES (fin des « salles vides »).
  let sideKinds=shuffle(['maze','riddle','antichamber','ice','levers','portal','mirror','simon','crusher']);let si=0;
  rooms.forEach(r=>{if(r.kind==='empty'){r.kind=sideKinds[si%sideKinds.length];si++}});
 }
 // ── FORME ADAPTÉE À L'ÉPREUVE : une fois le type connu, on redimensionne chaque salle pour
 // que sa forme SERVE l'épreuve (rocher/lames/pics/presses → couloir long et étroit ; dalles/
 // leviers/simon → halle large ; reste → forme libre). Demande explicite du joueur.
 rooms.forEach(r=>reshapeRoomForKind(r,cw,chh));
 // ── ARÈNE DU GARDIEN : la salle trésor doit être GRANDE pour que le combat de boss se
 // déroule sans risque de tomber hors de la carte. On l'agrandit au maximum de sa cellule
 // (au moins 14×11 tuiles) et on la recentre, en restant dans les limites de la carte.
 {let tr=treasureRoom,cellX=tr.gx*cw,cellY=tr.gy*chh;
  tr.w=Math.max(14,Math.min(cw-2,18));tr.h=Math.max(11,Math.min(chh-2,14));
  tr.w=Math.min(tr.w,MW-3);tr.h=Math.min(tr.h,MH-3);
  tr.x=cellX+1+Math.max(0,Math.floor((cw-2-tr.w)/2));
  tr.y=cellY+1+Math.max(0,Math.floor((chh-2-tr.h)/2));
  tr.x=Math.max(1,Math.min(MW-tr.w-1,tr.x));tr.y=Math.max(1,Math.min(MH-tr.h-1,tr.y));
  tr.cx=tr.x+Math.floor(tr.w/2);tr.cy=tr.y+Math.floor(tr.h/2);
  tr.shape='free';tr.big=true;}
 // ── GATE STRICT : chaque transition du CHEMIN PRINCIPAL est verrouillée et liée à
 // l'épreuve de la salle qu'on QUITTE. Impossible d'avancer vers le trésor sans réussir.
 // On mémorise, pour chaque arête start→trésor, la salle « source » (celle dont l'épreuve
 // déverrouille la porte) → kind de verrou déduit de l'épreuve de cette salle.
 let pathLock={}; // clé "ida-idb" → {room, lock}
 for(let i=0;i<mainPath.length-1;i++){let src=mainPath[i],dst=mainPath[i+1];
  let lock=lockForKind(src.kind);pathLock[edgeKey(src,dst)]={room:src,lock}}
 rooms.forEach(r=>{r.solved=false});startRoom.solved=true;treasureRoom.solved=true;
 // creuse l'intérieur de chaque salle — FORME ORGANIQUE (coins biseautés, renfoncements,
 // colonnes éboulées) pour casser l'aspect « boîte rectangulaire » et donner du cachet.
 rooms.forEach(r=>carveRoomOrganic(r));
 // GARANTIE NOYAU : carveRoomOrganic peut murer le centre d'une petite salle (biseaux/dentelures).
 // On re-creuse un noyau de sol franc autour de r.cx,r.cy → centre TOUJOURS praticable, et zone
 // sûre pour poser les éléments d'épreuve (simon/leviers/portails) et le spawn/sortie.
 rooms.forEach(r=>clearRoomCore(r));
 // ouvre TOUTES les arêtes de l'arbre (connexité garantie par construction).
 // Les arêtes du chemin principal reçoivent une porte verrouillée liée à l'épreuve.
 edges.forEach((e,i)=>{let lk=pathLock[edgeKey(e.a,e.b)]||pathLock[edgeKey(e.b,e.a)];linkRooms(e.a,e.b,i,lk)});
 spawn={x:startRoom.cx,y:startRoom.cy};
 // peint les templates (après les ouvertures pour ne pas les écraser)
 rooms.forEach(r=>buildRoom(r));
 // décor de sol partout (gravats, ossements, racines…) → plus aucune salle « nue »
 rooms.forEach(r=>scatterDebris(r));
 // GATE STRICT : re-scelle les goulots de porte APRÈS les templates (un build a pu creuser
 // une tuile latérale) → le joueur ne peut JAMAIS contourner une porte verrouillée.
 sealThroats();
 // GATE STRICT (2) : re-MURE le périmètre de chaque salle SAUF aux seuils de porte enregistrés.
 // Indispensable sur les grandes ruines (grille 4×3) où des couloirs serpentins ou des salles
 // voisines pouvaient ouvrir une brèche non verrouillée dans un mur → on contournait l'énigme.
 // Après cette passe, l'UNIQUE entrée/sortie d'une salle est sa (ses) porte(s).
 sealRoomPerimeters();
 // POSTES DE CONTRÔLE : cale le crossGate de chaque épreuve d'agilité sur une tuile praticable
 // au cœur du danger (jamais sur le vide/mur) → preuve de traversée toujours atteignable.
 placeCrossGates();
 // TORCHES MURALES : éclairent vraiment chaque salle (« vrai donjon »). Posées sur les
 // murs de pierre bordant l'intérieur, espacées, jamais sur un seuil de porte.
 rooms.forEach(r=>placeWallTorches(r));
 // DÉCOR MURAL D'IMMERSION : hiéroglyphes gravés + lianes pendantes sur les murs intérieurs.
 rooms.forEach(r=>placeWallDecor(r));
 // RUINES FINALES : trous dans le plafond effondré → rais de lumière du jour (Indiana Jones).
 if(ruinsSize==='final')rooms.forEach(r=>placeLightHoles(r));
 // toiles d'araignées dans les coins
 rooms.forEach(r=>{let corners=[[r.x,r.y,1],[r.x+r.w-1,r.y,-1],[r.x,r.y+r.h-1,1],[r.x+r.w-1,r.y+r.h-1,-1]];shuffle(corners).slice(0,2+rng(2)).forEach(([cx,cy,f])=>cobwebs.push({x:cx,y:cy,f,sz:.7+Math.random()*.4}))});
 // trésor + porte du gardien dans la salle trésor
 treasure={x:treasureRoom.cx,y:treasureRoom.cy-1,taken:false,pulse:0};
 exit={x:treasureRoom.cx,y:treasureRoom.cy+1,open:false};
 // dégage une croix 3×3 autour du centre + trésor + sortie (sol garanti, jamais muré par le décor).
 for(let dy=-1;dy<=2;dy++)for(let dx=-1;dx<=1;dx++)fillTile(treasureRoom.cx+dx,treasureRoom.cy+dy,0);
 // ARÈNE DU GARDIEN : sol PLEIN sur tout l'intérieur (aucun vide/gouffre) → impossible de tomber
 // hors de la carte pendant le combat de boss. On efface tout trou (tuile 6) en sol franc.
 {let tr=treasureRoom;for(let yy=tr.y;yy<tr.y+tr.h;yy++)for(let xx=tr.x;xx<tr.x+tr.w;xx++){if(map[yy]&&map[yy][xx]===6)map[yy][xx]=0}}
 // FILET DE SÉCURITÉ : vérifie que toutes les salles sont atteignables depuis l'entrée
 // (anti-blocage si un template a malencontreusement muré un seuil) → re-creuse au besoin.
 ensureRuinsConnected(startRoom,edges);
 // GARANTIE SORTIE : la tuile de sortie DOIT être atteignable à pied depuis le spawn.
 // Si une passe de décor/template l'a isolée, on re-creuse un chemin centre-salle→sortie→seuil.
 ensureExitReachable(startRoom,edges);
 // BONUS DE SOIN : cœurs disséminés dans les ruines pour récupérer de la vie. Placés au centre
 // de salles annexes/intermédiaires (ni départ ni trésor), sur une tuile praticable et dégagée.
 powerups=[];
 let healRooms=shuffle(rooms.filter(r=>r.kind!=='start'&&r.kind!=='treasure'));
 let nHeals=Math.min(healRooms.length,2+rng(2)); // 2 à 3 cœurs par donjon
 for(let i=0;i<nHeals;i++){let r=healRooms[i];let hx=r.cx,hy=r.cy;
  // évite de poser le cœur sur un mur : cherche une tuile au sol proche du centre
  if(map[hy]&&map[hy][hx]===3){let found=false;
   for(let dy=-1;dy<=1&&!found;dy++)for(let dx=-1;dx<=1&&!found;dx++){if(map[hy+dy]&&map[hy+dy][hx+dx]!==3){hx+=dx;hy+=dy;found=true}}}
  powerups.push({x:hx,y:hy,taken:false,kind:'heal',pulse:Math.random()*6});
 }
 return{startRoom,treasureRoom};
}
// Arbre couvrant aléatoire (DFS) sur la grille ROOM_COLS×ROOM_ROWS de salles.
// Garantit que les 6 salles sont reliées sans cycle → progression branchée et variée.
function buildRoomTree(){
 let visited={},edges=[],startG=roomAt(0,rng(ROOM_ROWS));
 let stack=[startG];visited[startG.id]=true;
 while(stack.length){let r=stack[stack.length-1];
  let nbrs=[[r.gx+1,r.gy],[r.gx-1,r.gy],[r.gx,r.gy+1],[r.gx,r.gy-1]]
   .map(([gx,gy])=>roomAt(gx,gy)).filter(n=>n&&!visited[n.id]);
  if(nbrs.length){let n=nbrs[rng(nbrs.length)];visited[n.id]=true;edges.push({a:r,b:n});stack.push(n)}
  else stack.pop();
 }
 // GATE STRICT : pas de boucles. L'arbre couvrant pur garantit que le CHEMIN PRINCIPAL
 // start→trésor est l'UNIQUE route (aucune dérivation pour contourner une porte verrouillée).
 // Les salles annexes restent des feuilles accessibles (exploration optionnelle).
 return edges;
}
// Distances (BFS) entre salles le long des arêtes de l'arbre.
function bfsRoomDist(src,edges){let d={};d[src.id]=0;let q=[src];
 let adj=id=>edges.filter(e=>e.a.id===id||e.b.id===id).map(e=>e.a.id===id?e.b:e.a);
 while(q.length){let r=q.shift();adj(r.id).forEach(n=>{if(d[n.id]==null){d[n.id]=d[r.id]+1;q.push(n)}})}return d}
// Chemin (liste de salles) entre deux salles via l'arbre (BFS + remontée de parents).
function roomPath(src,dst,edges){let par={},q=[src],seen={};seen[src.id]=true;
 let adj=id=>edges.filter(e=>e.a.id===id||e.b.id===id).map(e=>e.a.id===id?e.b:e.a);
 while(q.length){let r=q.shift();if(r===dst)break;adj(r.id).forEach(n=>{if(!seen[n.id]){seen[n.id]=true;par[n.id]=r;q.push(n)}})}
 let path=[dst],c=dst;while(c!==src&&par[c.id]){c=par[c.id];path.unshift(c)}return path}
// Anti-blocage SANS casser le gate : si le CENTRE d'une salle est physiquement inatteignable
// (un template a muré son propre intérieur), on re-creuse un fin chemin d'1 tuile DEPUIS le
// seuil de porte de la salle (pas un corridor parallèle entre centres) → la porte reste l'unique
// voie verrouillée. Le BFS franchit les portes (ouvertes ou fermées) car le verrou est logique,
// pas physique : ce qu'on garantit ici, c'est juste que l'INTÉRIEUR de chaque salle est creusé.
function ensureRuinsConnected(start,edges){
 // BFS « salle par salle » : une salle est OK si son centre est relié à au moins un de ses
 // propres seuils de porte par du sol. Sinon on creuse un couloir d'1 tuile centre→seuil.
 rooms.forEach(r=>{
  if(!r.doors||!r.doors.length)return;
  // tuiles de sol atteignables depuis le centre, BORNÉES à la salle (+1 de marge)
  let reach={},q=[[r.cx,r.cy]];reach[r.cx+','+r.cy]=1;
  let inRoom=(x,y)=>x>=r.x-1&&x<r.x+r.w+1&&y>=r.y-1&&y<r.y+r.h+1;
  let walk=(x,y)=>map[y]&&(map[y][x]===0||map[y][x]===6||map[y][x]===2||map[y][x]===7);
  while(q.length){let[x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{let nx=x+dx,ny=y+dy;if(inRoom(nx,ny)&&!reach[nx+','+ny]&&walk(nx,ny)){reach[nx+','+ny]=1;q.push([nx,ny])}})}
  // chaque seuil de porte de la salle DOIT être relié au centre ; sinon, creuse 1 tuile.
  r.doors.forEach(d=>{if(reach[d.x+','+d.y])return;
   let x=r.cx,y=r.cy;
   while(x!==d.x){fillTile(x,y,0);x+=Math.sign(d.x-x)}
   while(y!==d.y){fillTile(x,y,0);y+=Math.sign(d.y-y)}
   fillTile(d.x,d.y,0);
  });
 });
 // re-scelle pour garantir que ce re-creusage n'a pas élargi un goulot de porte.
 sealThroats();
}
// Garantit que la tuile SORTIE est joignable depuis le spawn. BFS sur le sol marchable
// (le verrou des portes est LOGIQUE, pas physique : le BFS franchit les seuils de porte).
// Si la sortie n'est pas atteinte, on re-creuse un fin chemin depuis le centre de la salle
// trésor jusqu'au seuil de porte le plus proche, puis on garantit la croix sortie/trésor.
function ensureExitReachable(start,edges){
 if(!exit)return;
 // BFS qui FRANCHIT les portes (verrou logique, pas physique). Si la sortie est joignable,
 // tout est bon — on ne touche à RIEN (cas normal : on préserve énigmes, portes, périmètres).
 let bfs=()=>{let reach={},q=[[start.cx,start.cy]];reach[start.cx+','+start.cy]=1;
  let walk=(x,y)=>{if(x<0||y<0||x>=MW||y>=MH)return false;let d=doors.find(o=>o.x===x&&o.y===y);if(d)return true;return map[y]&&(map[y][x]===0||map[y][x]===2||map[y][x]===7)};
  while(q.length){let[x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{let nx=x+dx,ny=y+dy;if(!reach[nx+','+ny]&&walk(nx,ny)){reach[nx+','+ny]=1;q.push([nx,ny])}})}
  return reach};
 if(bfs()[exit.x+','+exit.y])return;
 // re-creuse la croix de la salle trésor (au cas où un décor l'a re-murée).
 let tr=rooms.find(r=>r.kind==='treasure')||rooms[rooms.length-1];
 for(let dy=-1;dy<=2;dy++)for(let dx=-1;dx<=1;dx++)fillTile(tr.cx+dx,tr.cy+dy,0);
 // RÉPARATION RESPECTANT LE GATE : on ne perce PAS un raccourci à travers les murs/énigmes.
 // On reconnecte les salles le long de l'ARBRE COUVRANT (start→trésor), de centre à centre EN
 // PASSANT PAR LEUR SEUIL DE PORTE PARTAGÉ. Ainsi l'unique voie reste la porte → énigmes intactes.
 let startRoomNode=rooms.find(r=>r.kind==='start')||start;
 let path=(edges&&startRoomNode&&tr)?roomPath(startRoomNode,tr,edges):null;
 // relie deux points par un couloir en L d'1 tuile de large (jamais d'élargissement de mur).
 let carveL=(x0,y0,x1,y1)=>{let x=x0,y=y0;
  while(x!==x1){fillTile(x,y,0);x+=Math.sign(x1-x)}
  while(y!==y1){fillTile(x,y,0);y+=Math.sign(y1-y)}fillTile(x1,y1,0)};
 let carveToDoor=(r,d)=>carveL(r.cx,r.cy,d.x,d.y);
 if(path&&path.length>=2){
  // pour chaque paire de salles consécutives : centreA→seuilA, seuilA→seuilB, seuilB→centreB.
  // → reconnecte le COULOIR entre les deux salles (cas du bloc tombé dedans) sans jamais
  //   percer un périmètre arbitraire ni court-circuiter une énigme.
  for(let i=0;i<path.length-1;i++){let a=path[i],b=path[i+1];
   let dA=(a.doors||[]).find(d=>roomContainsThroat(b,d))||(a.doors||[])[0];
   let dB=(b.doors||[]).find(d=>roomContainsThroat(a,d))||(b.doors||[])[0];
   if(dA)carveToDoor(a,dA);
   if(dB)carveToDoor(b,dB);
   if(dA&&dB)carveL(dA.x,dA.y,dB.x,dB.y); // rétablit le couloir entre les deux seuils
  }
 }else{
  // secours ultime (pas d'arbre fourni) : relie centre trésor → son 1er seuil.
  if(tr.doors&&tr.doors.length)carveToDoor(tr,tr.doors[0]);
 }
 // re-scelle UNIQUEMENT les goulots (passage de porte de largeur 1) — n'élargit aucun mur.
 sealThroats();
}
// vrai si la tuile-seuil d touche le périmètre de la salle r (donc d est une porte partagée avec r).
function roomContainsThroat(r,d){if(!r||!d)return false;
 return d.x>=r.x-1&&d.x<=r.x+r.w&&d.y>=r.y-1&&d.y<=r.y+r.h}
// Creuse un segment de couloir rectiligne (horizontal ou vertical) de largeur br entre
// deux points alignés. Tolère br=1 (passage étroit « secret ») ou 2 (couloir normal).
function carveTunnelSeg(x0,y0,x1,y1,br){
 if(y0===y1){let a=Math.min(x0,x1),b=Math.max(x0,x1);for(let x=a;x<=b;x++)for(let w=0;w<br;w++)fillTile(x,y0+w,0)}
 else{let a=Math.min(y0,y1),b=Math.max(y0,y1);for(let y=a;y<=b;y++)for(let w=0;w<br;w++)fillTile(x0+w,y,0)}
}
// Relie deux salles par un COULOIR SERPENTIN (plusieurs coudes), pas une ligne droite
// centre-à-centre. Donne le côté labyrinthique/exploration d'un vrai temple. Largeur
// variable (couloirs larges OU passages étroits). La porte se pose au seuil de la salle source.
function linkRooms(a,b,i,lk){
 let horiz=a.gy===b.gy;
 // largeur du couloir : majoritairement 2, parfois 1 (passage resserré → tension Indiana Jones)
 let br=rng(5)===0?1:2;
 if(horiz){
  let left=a.x<b.x?a:b,right=a.x<b.x?b:a;
  // y d'accroche côté gauche et côté droit (indépendants → le couloir zigzague en Z)
  let yL=left.y+1+rng(Math.max(1,left.h-2)),yR=right.y+1+rng(Math.max(1,right.h-2));
  let xL=left.x+left.w-1,xR=right.x;
  // point de coude intermédiaire dans le mur entre les deux salles
  let xMid=Math.max(xL+1,Math.min(xR-1,Math.round((xL+xR)/2)+(rng(3)-1)));
  carveTunnelSeg(xL,yL,xMid,yL,br);          // sortie horizontale depuis 'left'
  carveTunnelSeg(xMid,Math.min(yL,yR),xMid,Math.max(yL,yR),br); // coude vertical
  carveTunnelSeg(xMid,yR,xR,yR,br);          // entrée horizontale vers 'right'
  // GATE STRICT : les DEUX seuils (sortie de 'left' ET entrée de 'right') sont des GOULOTS
  // d'1 tuile, enregistrés pour être re-scellés après les templates → contournement impossible.
  registerThroat(xL,yL,'h');registerThroat(xR,yR,'h');
  a.doors.push({side:'h',x:xL,y:yL});b.doors.push({side:'h',x:xR,y:yR});
  maybeDoor(xL,yL,i,lk);
 }else{
  let top=a.y<b.y?a:b,bot=a.y<b.y?b:a;
  let xT=top.x+1+rng(Math.max(1,top.w-2)),xB=bot.x+1+rng(Math.max(1,bot.w-2));
  let yT=top.y+top.h-1,yB=bot.y;
  let yMid=Math.max(yT+1,Math.min(yB-1,Math.round((yT+yB)/2)+(rng(3)-1)));
  carveTunnelSeg(xT,yT,xT,yMid,br);          // sortie verticale depuis 'top'
  carveTunnelSeg(Math.min(xT,xB),yMid,Math.max(xT,xB),yMid,br); // coude horizontal
  carveTunnelSeg(xB,yMid,xB,yB,br);          // entrée verticale vers 'bot'
  registerThroat(xT,yT,'v');registerThroat(xB,yB,'v');
  a.doors.push({side:'v',x:xT,y:yT});b.doors.push({side:'v',x:xB,y:yB});
  maybeDoor(xT,yT,i,lk);
 }
}
// Enregistre un goulot de seuil (1 tuile de passage + 2 tuiles-murs latérales). Appliqué
// immédiatement ET re-scellé après les templates (sealThroats) pour que rien ne le casse.
function registerThroat(x,y,side){doorThroats.push({x,y,side});applyThroat({x,y,side})}
function applyThroat(th){let{x,y,side}=th;fillTile(x,y,0);
 if(side==='h'){fillTile(x,y-1,3);fillTile(x,y+1,3)}else{fillTile(x-1,y,3);fillTile(x+1,y,3)}}
// Re-scelle TOUS les goulots : garantit qu'après buildRoom/scatterDebris aucun passage
// parallèle n'existe au niveau des portes (le joueur DOIT passer par la tuile-porte).
function sealThroats(){doorThroats.forEach(applyThroat)}
// GATE STRICT (2) : re-MURE l'anneau de périmètre de CHAQUE salle, sauf aux tuiles de
// seuil légitimes (goulots enregistrés + portes des salles). Sur les grandes ruines (4×3),
// des couloirs serpentins ou des salles voisines pouvaient creuser une brèche de sol dans
// un mur de bordure → on contournait l'épreuve par le côté. Après cette passe, l'UNIQUE
// ouverture d'une salle est sa/ses porte(s) → impossible de skip l'énigme par les bords.
function sealRoomPerimeters(){
 // Tuiles d'ouverture autorisées : passage des goulots + tuiles-portes de chaque salle.
 let allow=new Set();
 doorThroats.forEach(t=>allow.add(t.x+','+t.y));
 rooms.forEach(r=>r.doors.forEach(d=>allow.add(d.x+','+d.y)));
 doors.forEach(d=>allow.add(d.x+','+d.y));
 rooms.forEach(r=>{
  let x0=r.x,y0=r.y,x1=r.x+r.w-1,y1=r.y+r.h-1;
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){
   // seulement l'anneau de bordure (les murs de la salle)
   if(x!==x0&&x!==x1&&y!==y0&&y!==y1)continue;
   if(allow.has(x+','+y))continue;            // seuil de porte → on garde l'ouverture
   if(map[y]&&map[y][x]!==3)fillTile(x,y,3);   // toute brèche de sol → re-murée
  }
 });
 // Les goulots peuvent avoir été recouverts par le re-murage des coins → on les ré-applique.
 doorThroats.forEach(applyThroat);
}
// Cale le crossGate (poste de contrôle de traversée) de chaque épreuve d'agilité sur la tuile
// praticable la plus proche du milieu entrée→sortie. Recherche en spirale autour du point visé.
const SKILL_KINDS=['spikes','gauntlet','chase','bridge','pits','boulder','ice','crusher','voidmaze','lava'];
function placeCrossGates(){rooms.forEach(r=>{
 if(!r.crossGate||!SKILL_KINDS.includes(r.kind))return;
 let walk=(x,y)=>map[y]&&(map[y][x]===0||map[y][x]===2);// sol ou glace = praticable
 let g=r.crossGate;if(walk(g.x,g.y))return;
 for(let rad=1;rad<=4;rad++){let best=null;
  for(let dy=-rad;dy<=rad&&!best;dy++)for(let dx=-rad;dx<=rad&&!best;dx++){
   if(Math.max(Math.abs(dx),Math.abs(dy))!==rad)continue;
   let nx=g.x+dx,ny=g.y+dy;if(walk(nx,ny)&&nx>=r.x&&nx<r.x+r.w&&ny>=r.y&&ny<r.y+r.h)best={x:nx,y:ny}}
  if(best){r.crossGate=best;return}}
 // dernier recours : le centre de la salle (toujours dégagé)
 r.crossGate={x:r.cx,y:r.cy};
})}
// Clé stable d'arête (id ordonnés) pour repérer les transitions du chemin principal.
function edgeKey(a,b){return a.id+'-'+b.id}
// ── FORME DE SALLE SELON L'ÉPREUVE ────────────────────────────────────────
// Renvoie la forme attendue : 'corridor' (long et étroit), 'hall' (large et carré),
// 'free' (forme jitterée libre). Les épreuves "course/timing linéaire" exigent un couloir.
function shapeForKind(kind){
 if(['chase','boulder','gauntlet','spikes','crusher','bridge','lava'].includes(kind))return 'corridor';
 if(['plates','levers','simon','riddle','portal','mirror','voidmaze'].includes(kind))return 'hall';
 return 'free';
}
// Redimensionne une salle pour coller à la forme de son épreuve, en restant DANS sa cellule
// de grille (cw×chh). Recalcule x/y/w/h/cx/cy + mémorise l'axe du couloir (corrAxis).
function reshapeRoomForKind(r,cw,chh){
 let shape=shapeForKind(r.kind);r.shape=shape;
 let cellX=r.gx*cw,cellY=r.gy*chh;
 if(shape==='corridor'){
  // couloir : on suit l'axe le plus long de la cellule pour un vrai boyau (Indiana Jones).
  let horiz=cw>=chh;r.corrAxis=horiz?'h':'v';
  if(horiz){r.w=Math.min(cw-2,Math.max(10,cw-2));r.h=5;}
  else{r.h=Math.min(chh-2,Math.max(10,chh-2));r.w=5;}
 }else if(shape==='hall'){
  // halle : grande salle carrée pour respirer (dalles/leviers/puzzles + murs qui se referment).
  let s=Math.min(cw-2,chh-2,11);r.w=Math.max(8,s);r.h=Math.max(8,Math.min(chh-2,s));
 }
 // re-clamp position dans la cellule + carte
 r.w=Math.min(r.w,cw-2);r.h=Math.min(r.h,chh-2);
 let slackX=Math.max(1,cw-r.w-1),slackY=Math.max(1,chh-r.h-1);
 r.x=cellX+1+rng(slackX);r.y=cellY+1+rng(slackY);
 r.x=Math.max(1,Math.min(MW-r.w-1,r.x));r.y=Math.max(1,Math.min(MH-r.h-1,r.y));
 r.cx=r.x+Math.floor(r.w/2);r.cy=r.y+Math.floor(r.h/2);
}
// Type de verrou de la porte de SORTIE d'une salle, déduit de son épreuve.
// quiz : porte à question · key : nécessite une clé · plate/riddle/skill : ouverture auto
// quand la condition de la salle est remplie (dalles, énigme, ou défi d'agilité franchi).
function lockForKind(kind){return{
  keys:'key',plates:'plate',riddle:'riddle',
  spikes:'skill',gauntlet:'skill',chase:'skill',bridge:'skill',pits:'skill',boulder:'skill',
  // parkour additionnel = 'skill' (atteindre la sortie vivant) ; puzzles = 'task' (résolus = ouvre)
  ice:'skill',crusher:'skill',voidmaze:'skill',lava:'skill',
  levers:'task',portal:'task',mirror:'task',simon:'task',
  maze:'quiz',antichamber:'quiz',start:'quiz',treasure:'quiz'
 }[kind]||'quiz'}
// Pose la porte du chemin principal : TOUJOURS verrouillée et liée à l'épreuve (lk).
// Les passages hors chemin principal restent ouverts (exploration libre).
function maybeDoor(x,y,i,lk){
 if(lk){doors.push({x,y,kind:lk.lock,open:false,room:lk.room.id});lk.room.exitDoorXY={x,y};
  // POSTE DE CONTRÔLE : au milieu du chemin entrée→sortie (≈ cœur du danger). Le joueur DOIT
  // le toucher pour armer la réussite de l'épreuve (preuve de traversée, anti-esquive).
  let rr=lk.room,gx=Math.round((rr.cx+x)/2),gy=Math.round((rr.cy+y)/2);
  rr.crossGate={x:gx,y:gy};rr.crossed=false}
}
// ── Templates de salles (le « vrai design ») ───────────────────────────────
function buildRoom(r){let fn={start:buildStart,pits:buildPits,plates:buildPlates,keys:buildKeys,spikes:buildSpikes,boulder:buildBoulder,chase:buildChase,bridge:buildBridge,gauntlet:buildGauntlet,antichamber:buildAnti,maze:carveRoomMaze,riddle:buildRiddle,treasure:buildTreasureRoom,
 ice:buildIce,crusher:buildCrusher,levers:buildLevers,portal:buildPortal,mirror:buildMirror,simon:buildSimon,voidmaze:buildVoidMaze,lava:buildLava}[r.kind];if(fn)fn(r)}
// helper : X miroir dans la salle (variation gauche/droite)
function rmx(r,lx){return r.mirror?(r.x+r.w-1-(lx-r.x)):lx}
// helper : pose une rangée de torches sur les murs (déco)
function fillTile(x,y,t){if(x>0&&y>0&&x<MW-1&&y<MH-1)map[y][x]=t}
function buildStart(r){/* salle d'entrée : décor solennel (statues, braseros, dalles gravées) */
 decorateRoom(r,'entry');
}
// Décor de salle : pose des props purement visuels (non bloquants sauf piliers) selon l'ambiance.
// 'entry' = statues + braseros ; 'rest' = colonnes brisées + urnes + braseros.
function decorateRoom(r,style){
 // un prop solide ne doit jamais murer un seuil de porte (laisse 1 tuile de marge).
 let nearDoor=(x,y)=>r.doors.some(d=>Math.abs(d.x-x)<=1&&Math.abs(d.y-y)<=2)||Math.abs(x-r.cx)<=1&&(y<=r.y+1||y>=r.y+r.h-2);
 // braseros dans les coins intérieurs (lumière vacillante)
 let inset=[[r.x+1,r.y+1],[r.x+r.w-2,r.y+1],[r.x+1,r.y+r.h-2],[r.x+r.w-2,r.y+r.h-2]];
 inset.forEach(([x,y])=>{if(map[y]&&map[y][x]===0)props.push({type:'brazier',x,y,lit:true})});
 if(style==='entry'){
  // deux statues gardiennes encadrant le centre (piliers solides → vrais obstacles à contourner)
  let sx1=r.cx-2,sx2=r.cx+2,sy=r.y+1;
  [sx1,sx2].forEach(sx=>{if(map[sy]&&map[sy][sx]===0&&!nearDoor(sx,sy)){map[sy][sx]=3;props.push({type:'statue',x:sx,y:sy})}});
  // dalle gravée centrale (indice/lore, non bloquant)
  props.push({type:'glyph',x:r.cx,y:r.cy});
 }else{ // 'rest'
  // colonnes brisées éparses (SOLIDES) : décor d'ambiance, mais on ne les pose JAMAIS dans une
  // salle-énigme (levers/portail/miroir/simon/énigme) où un mur parasite peut rendre le puzzle
  // insoluble (bloquer un levier, couper le rayon du miroir…). On garde alors urnes + glyphe seuls.
  let puzzleRoom=['levers','portal','mirror','simon','riddle'].includes(r.kind);
  if(!puzzleRoom){
   let cols=[[r.x+2,r.cy-1],[r.x+r.w-3,r.cy+1]];
   cols.forEach(([x,y])=>{if(map[y]&&map[y][x]===0&&!nearDoor(x,y)){map[y][x]=3;props.push({type:'pillar',x,y})}});
  }
  // urnes décoratives (non bloquantes), écartées du centre dans les salles-énigme pour ne pas gêner.
  props.push({type:'urn',x:r.cx-1,y:r.cy+1});props.push({type:'urn',x:r.cx+1,y:r.cy+1});
  if(!puzzleRoom)props.push({type:'glyph',x:r.cx,y:r.cy-1});
 }
}
// AGENCEMENT EN RANGÉE : renvoie n positions {x,y} DISTINCTES, espacées de `gap` tuiles,
// centrées sur la salle, sur la ligne y (par défaut r.cy+1). Garantit que :
//  • toutes les cases tiennent dans l'intérieur (r.x+1 … r.x+w-2) sans clamp qui les empilerait ;
//  • si la rangée ne tient pas, on RÉDUIT n pour préserver l'espacement (jamais de chevauchement) ;
//  • chaque case est du sol franc (on la dégage au besoin) → élément toujours posable et visible.
// Utilisé par dalles (plates) et leviers (levers) pour un espacement régulier et lisible.
function rowSlots(r,n,gap,y,margin){
 gap=gap||2;y=(y==null?r.cy+1:y);margin=margin||0; // `margin` = tuiles à laisser libres de chaque bord
 if(!map[y]||y<=r.y||y>=r.y+r.h-1)y=r.cy; // ligne sûre dans l'intérieur
 let loX=r.x+1+margin,hiX=r.x+r.w-2-margin; // bornes praticables en retrait des bords
 if(hiX<loX){loX=r.x+1;hiX=r.x+r.w-2}      // salle trop étroite → annule la marge
 let inner=hiX-loX+1;                        // largeur utile
 let maxN=Math.max(1,Math.floor((inner-1)/gap)+1); // combien d'éléments espacés de `gap` tiennent
 n=Math.max(1,Math.min(n,maxN));
 let span=(n-1)*gap;                        // largeur totale occupée par la rangée
 let x0=r.cx-Math.floor(span/2);            // début centré
 x0=Math.max(loX,Math.min(hiX-span,x0));    // garde toute la rangée dans la zone utile (hors bords)
 let slots=[];
 for(let i=0;i<n;i++){let x=x0+i*gap;fillTile(x,y,0);slots.push({x,y})}
 return slots;
}
// PITS : gouffre de vide (6) traversé par des îlots de sol, franchi au dash.
function buildPits(r){let gy0=r.y+1,gy1=r.y+r.h-2,gx0=r.x+1,gx1=r.x+r.w-2;
 for(let y=gy0;y<=gy1;y++)for(let x=gx0;x<=gx1;x++)fillTile(x,y,6);
 // points d'ancrage = les seuils des portes de la salle (sol garanti autour)
 let anchors=r.doors.map(d=>{let ax=Math.max(gx0,Math.min(gx1,d.x)),ay=Math.max(gy0,Math.min(gy1,d.y));return{x:ax,y:ay}});
 if(anchors.length<2){anchors=[{x:gx0+1,y:r.cy},{x:gx1-1,y:r.cy}]}
 // plateforme de sol autour de chaque seuil
 anchors.forEach(a=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)fillTile(a.x+dx,a.y+dy,0)});
 // chaîne d'îlots entre la 1re et la 2e ancre : pas de ~3 tuiles (dash), îlot 1×1
 let A=anchors[0],B=anchors[1],steps=Math.max(2,Math.round(Math.hypot(B.x-A.x,B.y-A.y)/3));
 for(let i=1;i<steps;i++){let t=i/steps,ix=Math.round(A.x+(B.x-A.x)*t),iy=Math.round(A.y+(B.y-A.y)*t);fillTile(ix,iy,0);fillTile(ix,iy+1,0)}
 // ancres supplémentaires (si 3+ portes) reliées au centre du parcours
 for(let k=2;k<anchors.length;k++){let C=anchors[k],M=anchors[0],st=Math.max(2,Math.round(Math.hypot(C.x-M.x,C.y-M.y)/3));for(let i=1;i<st;i++){let t=i/st,ix=Math.round(M.x+(C.x-M.x)*t),iy=Math.round(M.y+(C.y-M.y)*t);fillTile(ix,iy,0)}}
}
// LAVE : couloir de magma à franchir au DASH. Bassin de lave (tuile 7) avec des îlots de
// pierre espacés (~3 tuiles → impose le dash). Tomber dans la lave brûle et renvoie au dernier îlot.
function buildLava(r){let gy0=r.y+1,gy1=r.y+r.h-2,gx0=r.x+1,gx1=r.x+r.w-2;
 for(let y=gy0;y<=gy1;y++)for(let x=gx0;x<=gx1;x++)fillTile(x,y,7);
 // ancres = seuils des portes (plateformes de pierre garanties autour)
 let anchors=r.doors.map(d=>{let ax=Math.max(gx0,Math.min(gx1,d.x)),ay=Math.max(gy0,Math.min(gy1,d.y));return{x:ax,y:ay}});
 if(anchors.length<2){anchors=[{x:gx0+1,y:r.cy},{x:gx1-1,y:r.cy}]}
 anchors.forEach(a=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)fillTile(a.x+dx,a.y+dy,0)});
 // chaîne d'îlots 1×2 entre deux ancres : pas de ~3 tuiles → saut au dash obligatoire.
 let A=anchors[0],B=anchors[1],steps=Math.max(2,Math.round(Math.hypot(B.x-A.x,B.y-A.y)/3));
 for(let i=1;i<steps;i++){let t=i/steps,ix=Math.round(A.x+(B.x-A.x)*t),iy=Math.round(A.y+(B.y-A.y)*t);fillTile(ix,iy,0);fillTile(ix,iy+1,0)}
 for(let k=2;k<anchors.length;k++){let C=anchors[k],M=anchors[0],st=Math.max(2,Math.round(Math.hypot(C.x-M.x,C.y-M.y)/3));for(let i=1;i<st;i++){let t=i/st,ix=Math.round(M.x+(C.x-M.x)*t),iy=Math.round(M.y+(C.y-M.y)*t);fillTile(ix,iy,0);fillTile(ix,iy+1,0)}}
 // CONSEIL visuel : glyphe « danger » au-dessus de l'entrée
 props.push({type:'glyph',x:r.cx,y:r.y+1});
}
// PLATES : dalles à presser SOUS PRESSION — deux murs de pics avancent depuis les bords vers
// le centre. Il faut activer toutes les dalles (qui stoppent/repoussent les murs) ET sortir vite.
function buildPlates(r){
 // dalles espacées régulièrement, cases DISTINCTES garanties (rowSlots réduit n si besoin).
 // marge=2 : les dalles restent dans la bande centrale, JAMAIS sous les murs de pics qui se referment
 // (sinon une dalle « disparaît » sous la texture du mur et devient impressable).
 let slots=rowSlots(r,5,2,r.cy+1,2);
 slots.forEach(s=>plates.push({x:s.x,y:s.y,on:false,room:r.id}));
 // murs de pics gauche & droit (sur toute la hauteur de la salle), avancent vers le centre.
 addClosingWalls(r);
 props.push({type:'glyph',x:r.cx,y:r.y+1});
}
// Pose deux murs de pics aux extrémités d'une salle-halle, programmés pour se rapprocher
// du joueur tant que l'épreuve n'est pas résolue (élément stressant : sortir vite !).
function addClosingWalls(r){
 // axe de fermeture : les murs longent les bords courts et avancent sur l'axe long.
 // ÉQUITÉ : ils s'arrêtent à 2 tuiles du centre (BANDE CENTRALE de 4 tuiles toujours dégagée) →
 // les dalles/leviers (posés dans cette bande, marge=2) ne sont JAMAIS recouverts par la texture
 // du mur ; jamais d'écrasement inévitable ; ils reculent dès l'énigme résolue.
 // la bande centrale dégagée doit couvrir TOUTE la rangée d'éléments (≈ ±3 autour du centre) :
 // les murs s'arrêtent à 3 tuiles du centre → dalles/leviers jamais recouverts.
 let horiz=r.w>=r.h;
 if(horiz){
  closingWalls.push({room:r.id,axis:'h',side:-1,pos:r.x+1,min:r.x+1,max:r.cx-3,sp:0,y0:r.y+1,y1:r.y+r.h-2});
  closingWalls.push({room:r.id,axis:'h',side:1,pos:r.x+r.w-2,min:r.cx+3,max:r.x+r.w-2,sp:0,y0:r.y+1,y1:r.y+r.h-2});
 }else{
  closingWalls.push({room:r.id,axis:'v',side:-1,pos:r.y+1,min:r.y+1,max:r.cy-3,sp:0,x0:r.x+1,x1:r.x+r.w-2});
  closingWalls.push({room:r.id,axis:'v',side:1,pos:r.y+r.h-2,min:r.cy+3,max:r.y+r.h-2,sp:0,x0:r.x+1,x1:r.x+r.w-2});
 }
}
// KEYS : autant de clés que de portes à clé, gardées par une lame pendulaire.
function buildKeys(r){let nKeys=Math.max(1,doors.filter(d=>d.kind==='key').length);
 for(let i=0;i<nKeys;i++){let kx=r.cx-(nKeys-1)+i*2,ky=r.cy;
  // SÉCURITÉ : la clé doit reposer sur du sol franc (jamais sur un mur/décor) → sinon
  // injoignable et porte à clé impossible à ouvrir. Décale vers une case libre au besoin.
  if(!map[ky]||map[ky][kx]!==0){let c=freeRoomCell(r);kx=c.x;ky=c.y}
  keysArr.push({x:kx,y:ky,taken:false});}
 movers.push({kind:'blade',x:r.cx,y0:r.y+1,y1:r.y+r.h-2,x0:r.cx,phase:Math.random()*6.28,speed:2.2,horiz:false,amp:(r.h-4)/2});}
// SPIKES : couloir de pics rétractables synchronisés. Chaque herse occupe TOUTE la hauteur
// du couloir (3 rangées, même phase) → on ne peut pas la contourner, seulement attendre le rythme.
function buildSpikes(r){let cy=r.cy;
 // VRAI COULOIR 3-haut (comme gauntlet/chase) : le reste de la salle est plein pour canaliser
 // → le joueur arrive dans un boyau clair, pas dans une nappe de pics. Portes reconnectées.
 for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(y<cy-1||y>cy+1)fillTile(x,y,3);
 for(let x=r.x;x<r.x+r.w;x++){fillTile(x,cy-1,0);fillTile(x,cy,0);fillTile(x,cy+1,0)}
 r.doors.forEach(d=>{let dx=Math.max(r.x,Math.min(r.x+r.w-1,d.x));let y0=Math.min(d.y,cy),y1=Math.max(d.y,cy+1);
  for(let y=y0;y<=y1;y++){fillTile(dx,y,0);fillTile(dx+1,y,0)}});
 // herses : 3 rangées (cy-1..cy+1) MÊME phase par colonne → herse pleine hauteur du couloir.
 // ZONE D'ENTRÉE SÛRE : on laisse 2 tuiles libres après chaque porte avant la 1re herse → le joueur
 // n'arrive jamais collé à un pic. Espacement de 3 (case d'attente large) + vitesse réduite (lisible).
 let y0=cy-1,y1=cy+1,step=3;
 let first=r.x+3,last=r.x+r.w-4; // marge d'entrée/sortie de 3 tuiles aux deux bords
 let col=0;for(let sx=first;sx<=last;sx+=step,col++){let ph=col*Math.PI; // colonnes alternées (π) → fenêtre toujours ouverte
  for(let y=y0;y<=y1;y++)movers.push({kind:'spike',x:sx,y,phase:ph,speed:1.5})}}
// BOULDER : rocher déclenché par un tripwire, roule vers la sortie.
// (Plus de blocs poussables : ils pouvaient se coincer contre un mur/décor et rendre
//  l'épreuve insoluble — AUCUN bloc à hitbox n'est posé dans les zones d'épreuve.)
function buildBoulder(r){
 // ROCHER ROULANT (variante simple de la poursuite) : vrai couloir 3-haut, rocher VISIBLE au repos
 // posé au bout, déclenché par un tripwire situé APRÈS la zone d'entrée → il roule vers la sortie
 // et le joueur doit le distancer/l'esquiver. Portes reconnectées au couloir.
 let cy=r.cy;
 for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(y<cy-1||y>cy+1)fillTile(x,y,3);
 for(let x=r.x;x<r.x+r.w;x++){fillTile(x,cy-1,0);fillTile(x,cy,0);fillTile(x,cy+1,0)}
 r.doors.forEach(d=>{let dx=Math.max(r.x,Math.min(r.x+r.w-1,d.x)),dy=Math.max(r.y,Math.min(r.y+r.h-1,d.y));
  let y0=Math.min(dy,cy),y1=Math.max(dy,cy+1);for(let y=y0;y<=y1;y++){fillTile(dx,y,0);fillTile(dx+1,y,0)}});
 // sens : depuis la porte d'entrée (gauche par défaut) vers la sortie ; le rocher part du bord d'entrée.
 let leftDoor=r.doors.find(d=>d.x<r.cx),dir=leftDoor?1:-1;
 let startX=dir>0?r.x+1:r.x+r.w-2;
 // tripwire placé à ~3 tuiles de l'entrée (le joueur voit d'abord le rocher au repos, puis l'arme).
 let twx=dir>0?r.x+4:r.x+r.w-5;
 tripwires.push({x:twx,y:cy-1,horiz:false,len:3,triggered:false,boulder:true,room:r.id});
 // rocher horizontal VISIBLE dès l'entrée (drawBoulder l'affiche même inactif dans la salle courante).
 boulder={x:startX+.5,y:cy+.5,vx:0,vy:0,active:false,room:r.id,spin:0,axis:'h',dir,startX:startX+.5};
 for(let x=r.x+2;x<r.x+r.w-1;x+=3){props.push({type:'torch',x,y:cy-2})}
 props.push({type:'glyph',x:dir>0?r.x+1:r.x+r.w-2,y:cy-1});
}
// CHASE : couloir « Indiana Jones ». Un rocher dévale tout le couloir derrière le joueur ;
// il faut DASH pour le distancer puis se réfugier dans une alcôve creusée dans le mur
// (le « petit trou ») le temps qu'il passe et s'écrase au bout.
function buildChase(r){
 let cy=r.cy; // ligne centrale du couloir
 // couloir dégagé sur toute la largeur (le reste de la salle reste mur/plein pour canaliser)
 for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(y<cy-1||y>cy+1)fillTile(x,y,3);
 for(let x=r.x;x<r.x+r.w;x++){fillTile(x,cy-1,0);fillTile(x,cy,0);fillTile(x,cy+1,0)}
 // reconnecte chaque porte de la salle au couloir central (sinon les portes verticales seraient murées).
 r.doors.forEach(d=>{let dx=Math.max(r.x,Math.min(r.x+r.w-1,d.x)),dy=Math.max(r.y,Math.min(r.y+r.h-1,d.y));
  let y0=Math.min(dy,cy),y1=Math.max(dy,cy+1);for(let y=y0;y<=y1;y++){fillTile(dx,y,0);fillTile(dx+1,y,0)}});
 // sens de la course : le rocher démarre côté entrée (porte de gauche s'il y en a une), file vers la droite.
 let leftDoor=r.doors.find(d=>d.x<r.cx),dir=leftDoor?1:-1;
 // le rocher démarre TOUT au bord d'entrée, derrière le joueur (vraie poursuite, pas devant lui).
 let startX=dir>0?r.x+1:r.x+r.w-2;
 // ALCÔVES (« trous ») : une tous les ~4 tuiles, alternées haut/bas, profondes de 1, sur toute la longueur
 // du couloir → on doit vraiment choisir quand plonger s'abriter (intensité sur la durée).
 let aStart=r.x+4,aEnd=r.x+r.w-4;
 for(let ax=aStart,k=0;ax<=aEnd;ax+=4,k++){let up=k%2===0;
  if(up){fillTile(ax,cy-2,0);fillTile(ax,cy-1,0);props.push({type:'alcove',x:ax,y:cy-2})}
  else{fillTile(ax,cy+2,0);fillTile(ax,cy+1,0);props.push({type:'alcove',x:ax,y:cy+2})}}
 // tripwire vertical juste après l'entrée → déclenche le rocher (qui part de DERRIÈRE le joueur).
 let twx=dir>0?r.x+3:r.x+r.w-4;
 tripwires.push({x:twx,y:cy-1,horiz:false,len:3,triggered:false,boulder:true,room:r.id});
 // rocher horizontal : grand, rapide, mortel s'il te rattrape dans le couloir.
 boulder={x:startX+.5,y:cy+.5,vx:0,vy:0,active:false,room:r.id,spin:0,axis:'h',dir,chase:true,startX:startX+.5};
 // torches le long du couloir (ambiance + lisibilité)
 for(let x=r.x+2;x<r.x+r.w-1;x+=3){props.push({type:'torch',x,y:cy-2});props.push({type:'torch',x,y:cy+2})}
}
// BRIDGE : pont de pierre étroit au-dessus d'un gouffre. Un tripwire à l'entrée fait
// s'effondrer le tablier DERRIÈRE le joueur en cascade → il faut traverser sans s'arrêter.
function buildBridge(r){let gy0=r.y+1,gy1=r.y+r.h-2,gx0=r.x+1,gx1=r.x+r.w-2;
 // tout l'intérieur devient un GOUFFRE (vide mortel, type 6) bien lisible…
 for(let y=gy0;y<=gy1;y++)for(let x=gx0;x<=gx1;x++)fillTile(x,y,6);
 // … traversé par UNE passerelle horizontale de 2 tuiles de large, au centre.
 let by=r.cy;for(let x=gx0;x<=gx1;x++){fillTile(x,by,0);fillTile(x,by+1,0)}
 // plateformes de sol autour des seuils pour relier les portes au pont (entrées sûres).
 r.doors.forEach(d=>{let dx=Math.max(gx0,Math.min(gx1,d.x)),dy=Math.max(gy0,Math.min(gy1,d.y));
  for(let yy=Math.min(dy,by);yy<=Math.max(dy,by+1);yy++){fillTile(dx,yy,0);fillTile(dx+1,yy,0)}});
 // sens : depuis la porte la plus à gauche vers la droite.
 let leftDoor=r.doors.find(d=>d.x<r.cx),dir=leftDoor?1:-1;
 // TABLIER VISIBLE DÈS L'ARRIVÉE : une planche de bois cloutée sur CHAQUE tuile de la passerelle
 // (2 tuiles de haut, toute la largeur). Le pont est donc « présent » à l'écran avant tout tripwire ;
 // il ne disparaît qu'au fur et à mesure de l'effondrement (la planche se cache quand sa tuile cède).
 for(let x=gx0;x<=gx1;x++){props.push({type:'plank',x,y:by,edge:true});props.push({type:'plank',x,y:by+1})}
 // tripwire placée APRÈS la zone d'entrée (≈1/4 de la travée, jamais sur la tuile de seuil) → le joueur
 // voit le tablier ENTIER et avance dessus avant que l'effondrement (derrière lui) ne se déclenche.
 let span=gx1-gx0;let off=Math.max(3,Math.floor(span*.25));
 let twx=dir>0?gx0+off:gx1-off;twx=Math.max(gx0+3,Math.min(gx1-3,twx));
 tripwires.push({x:twx,y:by,horiz:false,len:2,triggered:false,bridge:true,dir,by,gx0,gx1,room:r.id});
 // torches sur les bords pour éclairer le gouffre + glyphe d'avertissement côté entrée.
 for(let x=gx0+1;x<gx1;x+=3){if(map[by-1]&&map[by-1][x]===3)props.push({type:'torch',x,y:by-1})}
 props.push({type:'glyph',x:dir>0?gx0:gx1,y:by-0});
}
// VOIDMAZE : un dédale de dalles d'1 tuile suspendues AU-DESSUS DU VIDE intégral. Toute case
// hors du sentier est un gouffre (type 6, mortel). Il faut suivre le chemin sinueux d'une porte
// à l'autre sans tomber. Quelques impasses (fausses dalles) ajoutent de la lecture/risque.
function buildVoidMaze(r){let gy0=r.y+1,gy1=r.y+r.h-2,gx0=r.x+1,gx1=r.x+r.w-2;
 // 1) tout l'intérieur devient vide
 for(let y=gy0;y<=gy1;y++)for(let x=gx0;x<=gx1;x++)fillTile(x,y,6);
 // 2) plateformes de sol franc autour de CHAQUE seuil de porte (zone d'appui sûre)
 let pads=r.doors.map(d=>{let ax=Math.max(gx0,Math.min(gx1,d.x)),ay=Math.max(gy0,Math.min(gy1,d.y));
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)fillTile(ax+a,ay+b,0);return{x:ax,y:ay}});
 if(pads.length<2)pads=[{x:gx0+1,y:r.cy},{x:gx1-1,y:r.cy}];
 // 3) sentier sinueux reliant chaque porte au centre via une marche aléatoire bornée (1 tuile de large)
 let carve=(x,y)=>{if(x>=gx0&&x<=gx1&&y>=gy0&&y<=gy1)fillTile(x,y,0)};
 let center={x:r.cx,y:r.cy};for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)carve(center.x+a,center.y+b);
 pads.forEach(p=>{
  let x=p.x,y=p.y,guard=0;
  while((x!==center.x||y!==center.y)&&guard++<200){
   // biais vers le centre + zigzag aléatoire → chemin tortueux mais convergent
   let bx=Math.sign(center.x-x),by=Math.sign(center.y-y);
   if(rng(3)===0){ // pas latéral aléatoire (serpente)
    if(rng(2))x+=(rng(2)?1:-1);else y+=(rng(2)?1:-1);
   }else if(Math.abs(center.x-x)>Math.abs(center.y-y))x+=bx;else y+=by;
   x=Math.max(gx0,Math.min(gx1,x));y=Math.max(gy0,Math.min(gy1,y));carve(x,y);
  }
 });
 // 4) impasses-leurres : courts embranchements qui se terminent dans le vide (lecture/risque)
 for(let k=0;k<3;k++){let sx=gx0+1+rng(Math.max(1,gx1-gx0-1)),sy=gy0+1+rng(Math.max(1,gy1-gy0-1));
  if(map[sy]&&map[sy][sx]===0){let dx=rng(2)?1:-1,len=1+rng(2);for(let i=1;i<=len;i++)carve(sx+dx*i,sy)}}
 // 5) torches sur les bords + glyphe d'avertissement
 for(let x=gx0+1;x<gx1;x+=4){if(map[r.y]&&map[r.y][x]===3)props.push({type:'torch',x,y:r.y})}
 props.push({type:'glyph',x:r.cx,y:gy0});
}
// GAUNTLET : couloir gardé par une rangée de lames pendulaires aux phases décalées.
// Il faut lire le rythme et avancer entre deux balayages. Vrai « gant » de temple.
function buildGauntlet(r){
 let cy=r.cy;
 // couloir central de 3 de haut, le reste plein pour canaliser.
 for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(y<cy-1||y>cy+1)fillTile(x,y,3);
 for(let x=r.x;x<r.x+r.w;x++){fillTile(x,cy-1,0);fillTile(x,cy,0);fillTile(x,cy+1,0)}
 // reconnecte les portes au couloir.
 r.doors.forEach(d=>{let dx=Math.max(r.x,Math.min(r.x+r.w-1,d.x));let y0=Math.min(d.y,cy),y1=Math.max(d.y,cy+1);
  for(let y=y0;y<=y1;y++){fillTile(dx,y,0);fillTile(dx+1,y,0)}});
 // rangée de lames verticales oscillantes, espacées, phases en escalier → fenêtres de passage.
 let nb=Math.max(3,Math.floor((r.w-4)/2));
 for(let i=0;i<nb;i++){let bx=r.x+2+i*2;if(bx>=r.x+r.w-1)break;
  movers.push({kind:'blade',x0:bx,y0:cy-1,y1:cy+1,phase:i*1.05,speed:2.6,horiz:false,amp:1});}
 // torches d'ambiance.
 for(let x=r.x+2;x<r.x+r.w-1;x+=4){props.push({type:'torch',x,y:cy-2})}
}
function buildAnti(r){/* palier calme avant le trésor : décor de repos (rempli via decorateRoom) */
 decorateRoom(r,'rest');
}
function buildTreasureRoom(r){/* trésor + porte gardien posés dans genRuins */
 // décor royal autour du trésor (braseros + piliers brisés, jamais sur les seuils).
 decorateRoom(r,'rest');
}
// ════ 6 NOUVELLES MÉCANIQUES (Chantier 3) ═════════════════════════════════
// 10) ICE — sol verglacé : le joueur GLISSE (inertie). Parkour : atteindre la sortie sans
// tomber dans les rigoles de vide qui bordent le couloir glacé. (skill : exitDoorXY)
function buildIce(r){let gy0=r.y+1,gy1=r.y+r.h-2,gx0=r.x+1,gx1=r.x+r.w-2;
 // dalle de glace centrale (tuile 2 = glace) entourée de rigoles de vide
 for(let y=gy0;y<=gy1;y++)for(let x=gx0;x<=gx1;x++)fillTile(x,y,(y===r.y+1||y===gy1)?6:2);
 iceZones.push({x:gx0,y:gy0,w:gx1-gx0+1,h:gy1-gy0+1,room:r.id});
 // plateformes de sol franc autour des seuils (sortie/entrée non glissantes)
 r.doors.forEach(d=>{let dx=Math.max(gx0,Math.min(gx1,d.x)),dy=Math.max(gy0,Math.min(gy1,d.y));for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)fillTile(dx+a,dy+b,0)});
 // quelques piliers de glace (obstacles) à contourner en glissant
 for(let i=0;i<3;i++){let px=gx0+2+rng(Math.max(1,gx1-gx0-3)),py=gy0+1+rng(Math.max(1,gy1-gy0-2));if(map[py]&&map[py][px]===2&&!r.doors.some(d=>Math.abs(d.x-px)<2&&Math.abs(d.y-py)<2)){map[py][px]=3;props.push({type:'icepillar',x:px,y:py})}}
 for(let x=gx0+1;x<gx1;x+=4)props.push({type:'torch',x,y:r.y});
 props.push({type:'glyph',x:r.cx,y:gy0});
}
// 11) CRUSHER — couloir de presses qui descendent par à-coups (phases décalées). Parkour de
// timing : passer entre deux écrasements. (skill : exitDoorXY)
function buildCrusher(r){let cy=r.cy;
 for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(y<cy-1||y>cy+1)fillTile(x,y,3);
 for(let x=r.x;x<r.x+r.w;x++){fillTile(x,cy-1,0);fillTile(x,cy,0);fillTile(x,cy+1,0)}
 r.doors.forEach(d=>{let dx=Math.max(r.x,Math.min(r.x+r.w-1,d.x));let y0=Math.min(d.y,cy),y1=Math.max(d.y,cy+1);for(let y=y0;y<=y1;y++){fillTile(dx,y,0);fillTile(dx+1,y,0)}});
 let nb=Math.max(3,Math.floor((r.w-4)/3));
 for(let i=0;i<nb;i++){let bx=r.x+2+i*3;if(bx>=r.x+r.w-1)break;crushers.push({x:bx,top:cy-1,phase:i*1.1,speed:2.3,down:0,room:r.id})}
 for(let x=r.x+2;x<r.x+r.w-1;x+=4)props.push({type:'torch',x,y:cy-2});
 props.push({type:'glyph',x:r.doors[0]?r.doors[0].x:r.x+1,y:cy+2<r.y+r.h?cy:cy});
}
// 12) LEVERS — puzzle : actionner les leviers dans le BON ordre (séquence). Mauvais = reset.
function buildLevers(r){decorateRoom(r,'rest');
 // leviers espacés régulièrement, cases DISTINCTES garanties (rowSlots réduit n si besoin).
 // marge=2 : les leviers restent dans la bande centrale, JAMAIS sous les murs de pics qui se referment
 // (corrige « 2 leviers dans la texture du spike » → ils étaient posés sur la colonne de départ du mur).
 let slots=rowSlots(r,5,2,r.cy+1,2);let n=slots.length;
 let order=shuffle(Array.from({length:n},(_,i)=>i));
 slots.forEach((s,i)=>levers.push({x:s.x,y:s.y,room:r.id,seq:order[i],on:false}));
 r.leverStep=0;r.leverN=n;
 // PRESSION : murs de pics qui se referment tant que la séquence n'est pas résolue.
 addClosingWalls(r);
 props.push({type:'glyph',x:r.cx,y:r.cy-1});
}
// 13) PORTAL — paires de portails qui téléportent : trouver la bonne combinaison pour
// atteindre la dalle-cible (puzzle de navigation). Marcher sur la dalle = résolu.
function buildPortal(r){decorateRoom(r,'rest');
 let pairs=2,col=['#9af0ff','#ff9af0','#f0ff9a'];
 // freeRoomCell ne renvoie plus jamais null mais peut retomber sur la même case : on collecte
 // des cases DISTINCTES (clé "x,y") pour que portails + dalle-cible n'occupent pas la même tuile.
 let used={},pick=()=>{for(let t=0;t<40;t++){let c=freeRoomCell(r);let k=c.x+','+c.y;if(!used[k]){used[k]=1;return c}}return null};
 for(let p=0;p<pairs;p++){
  let a=pick(),b=pick();if(!a||!b)continue;
  portals.push({x:a.x,y:a.y,px:b.x,py:b.y,room:r.id,col:col[p%col.length],cd:0});
  portals.push({x:b.x,y:b.y,px:a.x,py:a.y,room:r.id,col:col[p%col.length],cd:0});
 }
 // dalle-cible (objectif) dans un recoin, entourée de vide → atteignable seulement via portail
 let goal=pick()||{x:r.cx,y:r.cy};
 plates.push({x:goal.x,y:goal.y,on:false,room:r.id,portalGoal:true});
 props.push({type:'glyph',x:r.cx,y:r.cy-1});
}
// 14) MIRROR — orienter des miroirs pour router le rayon de lumière vers le capteur (puzzle).
// Interagir près d'un miroir le fait pivoter de 90°. Rayon atteint le capteur = résolu.
function buildMirror(r){decorateRoom(r,'rest');
 // ── SALLE DES MIROIRS — trajet TOUJOURS résoluble (chemin en « L » ou « Z »).
 // L'émetteur tire vers la DROITE sur la ligne du haut ; le capteur est sur une AUTRE ligne
 // (en bas) → un rayon droit ne peut pas tricher. On place des miroirs à des coins de virage
 // bien ESPACÉS, chacun en mauvaise orientation au départ (le joueur doit les tourner).
 let topY=r.y+2,botY=r.y+r.h-3;if(botY<=topY+1){botY=topY+2}
 r.emit={x:r.x+1,y:topY,dir:0};                  // émet vers la droite, ligne du haut
 r.sensor={x:r.x+r.w-2,y:botY};                   // capteur, ligne du bas
 props.push({type:'emitter',x:r.emit.x,y:r.emit.y});
 props.push({type:'sensor',x:r.sensor.x,y:r.sensor.y,lit:false});
 // Colonne de virage : à mi-largeur, ≥2 tuiles des deux murs latéraux et des portes.
 let turnX=Math.max(r.x+3,Math.min(r.x+r.w-3,r.cx));
 // traceBeam : o===1 ('\') fait 0(→)→1(↓) et 1(↓)→0(→). On veut → puis ↓ puis →.
 // Miroir A (coin haut) : rayon → arrive, doit partir ↓ → bonne orientation '\'(o=1).
 // Miroir B (coin bas)  : rayon ↓ arrive, doit partir → → bonne orientation '\'(o=1).
 let okA=1,okB=1;
 // On part toujours d'une MAUVAISE orientation pour que le puzzle demande une action.
 let mA={x:turnX,y:topY,room:r.id,o:1-okA,solveO:okA};
 let mB={x:turnX,y:botY,room:r.id,o:1-okB,solveO:okB};
 // Sécurité : ne jamais poser un miroir sur une porte ; décaler la colonne si besoin.
 [mA,mB].forEach(m=>{if(r.doors.some(d=>Math.abs(d.x-m.x)<2&&Math.abs(d.y-m.y)<2))m.x=Math.max(r.x+3,m.x-1)});
 // Les deux miroirs doivent rester sur la MÊME colonne pour que le chemin en L fonctionne.
 mB.x=mA.x;
 // Cases des miroirs : sol franc (jamais un mur parasite qui couperait le rayon).
 [mA,mB,r.emit,r.sensor].forEach(p=>{if(map[p.y]&&map[p.y][p.x]===3)map[p.y][p.x]=0});
 // TRAJET DU RAYON DÉGAGÉ : carveRoomOrganic peut murer une tuile sur le parcours en L
 // (ligne haut émetteur→virage, colonne virage haut→bas, ligne bas virage→capteur) → le rayon
 // serait stoppé par ce mur parasite et le puzzle deviendrait insoluble. On dégage tout le trajet.
 for(let x=r.emit.x;x<=mA.x;x++)fillTile(x,topY,0);
 for(let y=topY;y<=botY;y++)fillTile(mA.x,y,0);
 for(let x=mB.x;x<=r.sensor.x;x++)fillTile(x,botY,0);
 mirrors.push(mA,mB);
 // Indice gravé au centre.
 props.push({type:'glyph',x:r.cx,y:r.cy});
}
// 15) SIMON — mémoire : reproduire la séquence de vasques qui s'illuminent (longueur croissante).
function buildSimon(r){decorateRoom(r,'rest');
 // 4 vasques en croix autour du centre, ESPACÉES (≥2 tuiles) et sur sol franc garanti.
 // On ne pose QUE les positions qui tiennent dans l'intérieur, et on DÉGAGE leur case (fillTile)
 // → vasques toujours visibles, accessibles et distinctes (Simon toujours jouable).
 let pads=[];let pos=[[r.cx-2,r.cy],[r.cx+2,r.cy],[r.cx,r.cy-1],[r.cx,r.cy+1]];
 pos.forEach(([px,py],i)=>{
  if(px<=r.x||px>=r.x+r.w-1||py<=r.y||py>=r.y+r.h-1)return; // hors intérieur → ignorée
  fillTile(px,py,0); // garantit le sol sous la vasque
  props.push({type:'simonpad',x:px,y:py,id:i,lit:0,room:r.id});pads.push({x:px,y:py,id:i});
 });
 simons.push({room:r.id,pads,seq:[rng(pads.length)],step:0,showT:0,showIdx:0,phase:'show',len:1});
 props.push({type:'glyph',x:r.cx,y:r.y+1});
}
// ════════════════════════════════════════════════════════════════════════
//  ENRICHISSEMENT DES SALLES — labyrinthes, énigmes, décor (anti « salle vide »)
// ════════════════════════════════════════════════════════════════════════
// Liste des cases « réservées » d'une salle (seuils de portes + 1 tuile de marge,
// dalles, clés, blocs, trésor, sortie) : on n'y pose jamais de mur ni de gros décor.
function reservedCells(r){let set={};
 let add=(x,y)=>{set[x+','+y]=1};
 r.doors.forEach(d=>{for(let dx=-1;dx<=1;dx++)for(let dy=-2;dy<=2;dy++)add(d.x+dx,d.y+dy)});
 plates.forEach(p=>{add(p.x,p.y)});keysArr.forEach(k=>add(k.x,k.y));blocks.forEach(b=>{add(b.x,b.y);add(b.x+1,b.y);add(b.x-1,b.y);add(b.x,b.y+1);add(b.x,b.y-1)});
 if(treasure)for(let dx=-1;dx<=1;dx++)for(let dy=-2;dy<=2;dy++)add(treasure.x+dx,treasure.y+dy);
 if(exit)add(exit.x,exit.y);
 // colonne centrale verticale toujours dégagée (épine dorsale de circulation)
 for(let y=r.y;y<r.y+r.h;y++){add(r.cx,y)}
 return set;
}
// Vérifie qu'après un ajout de mur, tous les seuils de portes restent reliés au centre.
function roomConnected(r){
 let seen={},stack=[[r.cx,r.cy]];seen[r.cx+','+r.cy]=1;
 let inRoom=(x,y)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
 while(stack.length){let [x,y]=stack.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{let nx=x+dx,ny=y+dy,k=nx+','+ny;
  if(!seen[k]&&inRoom(nx,ny)&&map[ny]&&map[ny][nx]!==3){seen[k]=1;stack.push([nx,ny])}})}
 return r.doors.every(d=>{let dx=Math.max(r.x,Math.min(r.x+r.w-1,d.x)),dy=Math.max(r.y,Math.min(r.y+r.h-1,d.y));
  // un seuil compte comme relié si lui ou une case adjacente est atteinte
  return seen[dx+','+dy]||seen[(dx+1)+','+dy]||seen[(dx-1)+','+dy]||seen[dx+','+(dy+1)]||seen[dx+','+(dy-1)]});
}
// Pose un mur (type 3) seulement s'il ne casse pas la connexité (sinon annule).
function tryWall(r,x,y){if(map[y]&&map[y][x]===0){map[y][x]=3;if(!roomConnected(r)){map[y][x]=0;return false}return true}return false}
// LABYRINTHE : remplit l'intérieur d'un motif de murs en quinconce avec couloirs,
// en garantissant que toutes les portes restent reliées (tryWall valide chaque mur).
function carveRoomMaze(r){let res=reservedCells(r);
 // motif en quinconce : murs sur les positions paires, décalées d'une rangée sur deux.
 for(let y=r.y+2;y<r.y+r.h-2;y++)for(let x=r.x+2;x<r.x+r.w-2;x++){
  if(res[x+','+y])continue;
  // densité ~ damier espacé : crée des cellules et des couloirs sinueux
  let pat=((x-r.x)%2===0)&&((y-r.y)%2===0);
  // segments de mur reliant les piliers (1 chance sur 2) pour fermer des cellules
  let seg=pat||(((x-r.x)%2===0)&&rng(2)===0&&(y-r.y)%2===1);
  if(seg)tryWall(r,x,y);
 }
 // une petite récompense au cœur du labyrinthe (clé bonus ou points via glyphe)
 props.push({type:'glyph',x:r.cx,y:r.y+1});
 // braseros aux entrées pour la lisibilité
 r.doors.forEach(d=>{let bx=Math.max(r.x+1,Math.min(r.x+r.w-2,d.x)),by=Math.max(r.y+1,Math.min(r.y+r.h-2,d.y+(d.y<r.cy?1:-1)));if(map[by]&&map[by][bx]===0)props.push({type:'torch',x:bx,y:by})});
}
// ÉNIGME DES TORCHES : 3 vasques à allumer dans le BON ordre (indiqué par une dalle gravée).
// Marcher sur une vasque l'allume ; bon ordre → glyphe brille + bonus. Décor riche.
function buildRiddle(r){decorateRoom(r,'rest');
 // 3 vasques espacées régulièrement, cases DISTINCTES sur sol garanti (rowSlots).
 // L'ordre est calé sur le NOMBRE RÉEL de vasques posées → séquence toujours complète/résoluble.
 let slots=rowSlots(r,3,2,r.cy+1);
 let order=shuffle(Array.from({length:slots.length},(_,i)=>i));
 slots.forEach((s,i)=>props.push({type:'rune',x:s.x,y:s.y,idx:i,lit:false,seq:order.indexOf(i)}));
 props.push({type:'glyph',x:r.cx,y:r.cy-2});
 r.riddleOrder=order;r.riddleStep=0;
}
// Décor de sol non bloquant : gravats, ossements, fissures, racines, champignons.
// Déterministe via un hash de position → stable d'une frame à l'autre, pas de scintillement.
function scatterDebris(r){let res=reservedCells(r);
 // densité plus généreuse + variété : gravats, os, dalles fissurées, flaques, racines (anti « salle vide »).
 for(let y=r.y+1;y<r.y+r.h-1;y++)for(let x=r.x+1;x<r.x+r.w-1;x++){
  if(res[x+','+y]||!map[y]||map[y][x]!==0)continue;
  let h=((x*73856093)^(y*19349663))>>>0;
  let m=h%5;
  if(m===0)props.push({type:'debris',x,y,v:h%4});            // gravats (4 variantes)
  else if(m===1&&(h>>3)%3===0)props.push({type:'floorcrack',x,y,v:(h>>5)%3}); // dalles fissurées
  else if(m===2&&(h>>4)%5===0)props.push({type:'bones',x,y,v:(h>>6)%3});      // ossements
  else if(m===3&&(h>>2)%9===0)props.push({type:'puddle',x,y});               // flaque sombre
 }
}
// Pose des torches murales sur les bords intérieurs de la salle (cases de sol collées à un
// mur de pierre), bien espacées, jamais devant un seuil de porte → éclairage régulier.
function placeWallTorches(r){let res=reservedCells(r);
 let isWall=(x,y)=>map[y]&&map[y][x]===3;
 let isFloor=(x,y)=>map[y]&&map[y][x]===0&&!res[x+','+y]&&!props.some(p=>p.x===x&&p.y===y);
 let cand=[];
 // murs gauche/droit : sol intérieur avec mur juste à côté
 for(let y=r.y+1;y<r.y+r.h-1;y++){
  if(isFloor(r.x+1,y)&&isWall(r.x,y))cand.push({x:r.x+1,y,side:0});
  if(isFloor(r.x+r.w-2,y)&&isWall(r.x+r.w-1,y))cand.push({x:r.x+r.w-2,y,side:1});
 }
 // murs haut/bas
 for(let x=r.x+1;x<r.x+r.w-1;x++){
  if(isFloor(x,r.y+1)&&isWall(x,r.y))cand.push({x,y:r.y+1,side:x<r.cx?0:1});
  if(isFloor(x,r.y+r.h-2)&&isWall(x,r.y+r.h-1))cand.push({x,y:r.y+r.h-2,side:x<r.cx?0:1});
 }
 // espacement : ~1 torche toutes les ~3 cases le long des bords → murs bien éclairés (vrai donjon).
 shuffle(cand);let placed=[];
 cand.forEach(c=>{if(placed.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<3))return;placed.push(c);props.push({type:'walltorch',x:c.x,y:c.y,side:c.side})});
 // garantit un minimum (3) pour les petites salles
 if(placed.length<3&&cand.length){cand.slice(0,3-placed.length).forEach(c=>props.push({type:'walltorch',x:c.x,y:c.y,side:c.side}))}
}
// DÉCOR MURAL : pose des hiéroglyphes gravés (sur cases de sol collées à un mur) et des lianes
// pendantes (depuis le mur du haut). Déterministe (hash) → stable. Évite seuils/torches.
function placeWallDecor(r){
 let isWall=(x,y)=>map[y]&&map[y][x]===3;
 let taken=(x,y)=>props.some(p=>p.x===x&&p.y===y);
 let res=reservedCells(r);
 let free=(x,y)=>map[y]&&map[y][x]===0&&!res[x+','+y]&&!taken(x,y);
 // 1) LIANES : pendent du mur du haut vers l'intérieur (cases de sol sous un mur supérieur).
 for(let x=r.x+1;x<r.x+r.w-1;x++){
  if(free(x,r.y+1)&&isWall(x,r.y)){let h=((x*2654435761)^(r.y*40503))>>>0;
   if(h%4===0)props.push({type:'vine',x,y:r.y+1,len:2+(h%3),sw:(h%5)})}
 }
 // 2) HIÉROGLYPHES : gravés sur les murs latéraux (case de sol contre un mur gauche/droit).
 let glyphCand=[];
 for(let y=r.y+2;y<r.y+r.h-2;y++){
  if(free(r.x+1,y)&&isWall(r.x,y))glyphCand.push({x:r.x+1,y,side:0});
  if(free(r.x+r.w-2,y)&&isWall(r.x+r.w-1,y))glyphCand.push({x:r.x+r.w-2,y,side:1});
 }
 shuffle(glyphCand);let gp=[];
 glyphCand.forEach(c=>{if(gp.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<3))return;gp.push(c);
  let h=((c.x*73856093)^(c.y*19349663))>>>0;props.push({type:'hiero',x:c.x,y:c.y,side:c.side,g:h%6})});
}
// TROUS DE PLAFOND (RUINES FINALES) : le toit du temple s'est effondré par endroits → des RAIS de
// lumière du jour, poussiéreux, plongent en biais sur le sol (ambiance Indiana Jones). On pose 1-2
// puits de lumière par salle, au cœur du sol (jamais sur un seuil/torche/prop), bien espacés.
function placeLightHoles(r){
 let res=reservedCells(r);
 let free=(x,y)=>map[y]&&map[y][x]===0&&!res[x+','+y]&&!props.some(p=>p.x===x&&p.y===y);
 let cand=[];
 for(let y=r.y+2;y<r.y+r.h-2;y++)for(let x=r.x+2;x<r.x+r.w-2;x++)if(free(x,y))cand.push({x,y});
 if(!cand.length)return;
 // RARE : un seul rai par salle, et seulement dans ~1 salle sur 2 (la salle au trésor en a toujours un).
 if(r.kind!=='treasure'&&rng(2)!==0)return;
 shuffle(cand);
 let c=cand[0];let h=((c.x*73856093)^(c.y*19349663))>>>0;
 props.push({type:'lightshaft',x:c.x,y:c.y,w:1+(h%2),seed:h%97});
}
function startRuins(size,nodeId){
 ruinsSize=size||'final';ruinsNodeId=nodeId||'';templeTrial=false;
 isRuins=true;currentTheme=ruinsTheme();biomeName=ruinsSize==='final'?'RUINES DU TEMPS':'CRYPTE OUBLIÉE';selectedChapter=curThemeMap().length-1;menuBiome=currentTheme;
 // COLOSSE DE PIERRE : boss unique des ruines, plus coriace (crypte=4 PV, finale=6 PV, multi-phases).
 let chp=ruinsSize==='final'?6:4;boss={active:false,hp:chp,max:chp};artifacts=[];traps=[];holes=[];quicksands=[];snakes=[];animals=[];powerups=[];bolts=[];minions=[];zones=[];bossEnt=null;bossPhase='idle';bossTimer=0;
 keysHeld=0;pendingDoor=null;fade=0;fadeDir=0;fadeTo=null;transitioning=false;roomMsg=0;
 let g=genRuins();curRoom=g.startRoom;
 player={x:spawn.x+.5,y:spawn.y+.5,vx:0,vy:0,dir:1,iceTime:0,sliding:0,swim:1,swimT:0,drown:0,dash:0,dashCd:0,wasDash:false};
 // temps proportionnel à la taille du donjon (grille variable) : ~38 s par salle, plancher 240 s.
 paused=false;sinkIn=null;score=0;applyPerks();hp=maxHp;lives=3;maxLives=3;treasureBonus=false;time=Math.max(240,Math.round(rooms.length*38));collected=0;inv=1;askedIndices=[];attempts=[];combo=0;maxCombo=0;errors=0;flash=0;floaters=[];shield=0;currentQuestion=null;ambient=[];popFx=[];artifactPowers=[];comboAura=0;trapReveal=0;quizClockOn=false;initAmbient();startMusic();
 focusRoomCam(curRoom,true);roomMsg=2.2;
 // araignées : gardiennes des salles (hors salle de départ), elles poursuivent à courte portée
 rooms.filter(r=>r.kind!=='start'&&r.kind!=='treasure').forEach(r=>{if(rng(3)>0){let c=freeRoomCell(r);if(c)animals.push({x:c.x+.5,y:c.y+.5,type:'spider',vx:0,vy:0,phase:Math.random()*6,turn:Math.random()*3})}});
 ui.chapterHud.textContent=noAcc(biomeName);ui.goalLabel.textContent='TRESOR';show('play');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)
}
// ÉPREUVE DU TEMPLE (niveaux classiques) : quand le joueur a réuni les 4 artefacts et touche le
// temple, il est TÉLÉPORTÉ dans un mini-donjon de 2 salles — 1 SALLE D'ÉNIGME (porte verrouillée
// par l'épreuve) puis 1 SALLE DE GARDIEN (boss au silhouette du biome, 3 PV classiques). La
// victoire conserve les étoiles/score du CHAPITRE courant (pas un donjon de ruines).
function enterTempleTrial(){
 if(templeTrial||isRuins)return;
 // mémorise le contexte du chapitre (thème, biome, chapitre) pour le restaurer à la fin si besoin.
 trialCtx={theme:currentTheme,biome:biomeName,chapter:selectedChapter,score:score,lives:lives};
 templeTrial=true;ruinsSize='trial';ruinsNodeId='';
 isRuins=true; // rendu « donjon » (torches, portes, salles) mais on garde le thème du biome.
 boss={active:false,hp:3,max:3};
 artifacts=[];traps=[];holes=[];quicksands=[];snakes=[];animals=[];powerups=[];bolts=[];minions=[];zones=[];bossEnt=null;bossPhase='idle';bossTimer=0;
 keysHeld=0;pendingDoor=null;fade=0;fadeDir=0;fadeTo=null;transitioning=false;roomMsg=0;
 let g=genRuins();curRoom=g.startRoom;
 player={x:spawn.x+.5,y:spawn.y+.5,vx:0,vy:0,dir:1,iceTime:0,sliding:0,swim:1,swimT:0,drown:0,dash:0,dashCd:0,wasDash:false};
 paused=false;sinkIn=null;inv=1;flash=0;floaters=[];shield=0;currentQuestion=null;ambient=[];popFx=[];comboAura=0;trapReveal=0;quizClockOn=false;
 // on garde score/vies/temps du chapitre en cours (l'épreuve fait partie du niveau).
 time=Math.max(120,Math.round(time));initAmbient();
 focusRoomCam(curRoom,true);roomMsg=2.2;
 // pas d'araignées : l'épreuve doit rester centrée sur l'énigme puis le gardien.
 ui.chapterHud.textContent=noAcc(biomeName)+' - EPREUVE';ui.goalLabel.textContent='EPREUVE';
 addFloater(player.x*T,player.y*T-18,'ÉPREUVE DU TEMPLE','#ffe35b');sound(180,.3,'square',.05);impact(.4);
 show('play');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)
}
// Cale la caméra sur une salle (centrée, clampée). instant = pas de lissage.
function focusRoomCam(r,instant){if(!r)return;let tx=(r.cx+.5)*T-W/2,ty=(r.cy+.5)*T-H/2;cam.tx=tx;cam.ty=ty;if(instant){cam.x=tx;cam.y=ty;clampCam()}}
// Libellé d'objectif selon le type de salle courante.
function roomGoal(r){return{start:'TROUVE LA SORTIE',pits:'FRANCHIS LE GOUFFRE (DASH ⇧)',plates:'ACTIVE LES DALLES',keys:'RÉCUPÈRE LA CLÉ',spikes:'ESQUIVE PICS & LAMES',boulder:boulder&&roomOf(player.x|0,player.y|0)===r?'FUIS LE ROCHER !':'POUSSE LES BLOCS',chase:'DASH ⇧ PUIS ABRITE-TOI DANS UN TROU !',bridge:'TRAVERSE AVANT QUE LE PONT NE CÈDE !',gauntlet:'PASSE ENTRE LES LAMES',maze:'TROUVE TON CHEMIN DANS LE DÉDALE',riddle:'ALLUME LES VASQUES DANS LE BON ORDRE',antichamber:'LE TRÉSOR EST PROCHE',treasure:treasure&&treasure.taken?'GARDIEN !':'EMPARE-TOI DU TRÉSOR',
 ice:'GLISSE JUSQU\u2019À LA SORTIE',crusher:'PASSE ENTRE LES PRESSES',levers:'TIRE LES LEVIERS DANS LE BON ORDRE',portal:'ATTEINS LA DALLE PAR LES PORTAILS',mirror:'ORIENTE LES MIROIRS (E) VERS LE CAPTEUR',simon:'MÉMORISE PUIS REPRODUIS LA SUITE',voidmaze:'NE TOMBE PAS DANS LE VIDE !'}[r?r.kind:'start']||''}
// ── Transition fondu au noir entre salles ─────────────────────────────────
function roomTransition(next){if(transitioning||!next)return;transitioning=true;fadeDir=1;fadeTo=next;player.vx=player.vy=0;
 // en quittant la salle du rocher, on neutralise un rocher encore en mouvement (pas de dégât fantôme ailleurs).
 if(boulder&&boulder.active&&boulder.room!==next.id)boulder.active=false}
// ENTRÉE SÛRE dans une salle : place le joueur sur une tuile au sol dégagée près du bord d'entrée,
// jamais sur une tripwire, un pic, ni dans le rayon immédiat d'un mur de pics. Évite « spawn sur piège ».
function placeSafeEntry(r){
 let unsafe=(tx,ty)=>{
  if(!(map[ty]&&map[ty][tx]===0))return true; // doit être du sol franc (pas vide/mur)
  // tripwire à proximité
  if(tripwires.some(tw=>tw.room===r.id&&!tw.triggered&&(tw.horiz?(ty===tw.y&&tx>=tw.x-1&&tx<=tw.x+tw.len):(tx===tw.x&&ty>=tw.y-1&&ty<=tw.y+tw.len))))return true;
  // pic (mover) sur cette tuile
  if(movers.some(m=>m.kind==='spike'&&m.x===tx&&m.y===ty))return true;
  return false;
 };
 // point d'ancrage = le joueur vient de franchir un seuil ; on cherche la tuile sûre la plus proche
 // de sa position actuelle en se rapprochant du centre de la salle.
 let ang=Math.atan2(r.cy-player.y,r.cx-player.x);
 let bx=player.x+Math.cos(ang)*1.4,by=player.y+Math.sin(ang)*1.4;
 let cands=[[bx,by]];
 for(let rad=1;rad<=4;rad++)for(let a=0;a<8;a++){let an=a*Math.PI/4;cands.push([bx+Math.cos(an)*rad,by+Math.sin(an)*rad])}
 cands.push([r.cx+.5,r.cy+.5]);
 for(let[cx,cy]of cands){let tx=Math.floor(cx),ty=Math.floor(cy);if(!unsafe(tx,ty)){player.x=tx+.5;player.y=ty+.5;player.vx=player.vy=0;return}}
 // dernier recours : centre de salle
 player.x=r.cx+.5;player.y=r.cy+.5;player.vx=player.vy=0;nudgeOutOfSolid();
}
// ── Mise à jour spécifique aux Ruines ─────────────────────────────────────
function updateRuins(dt){
 // gestion du fondu de transition
 if(transitioning){
  fade=Math.max(0,Math.min(1,fade+fadeDir*dt*3.2));
  if(fadeDir>0&&fade>=1){curRoom=fadeTo;curRoom.visited=true;focusRoomCam(curRoom,true);
   // ENTRÉE SÛRE : on place le joueur sur une tuile dégagée près du seuil franchi, JAMAIS sur un piège.
   placeSafeEntry(curRoom);
   inv=Math.max(inv,1.1); // brève invincibilité à l'entrée → on ne meurt pas d'un piège « collé » au seuil
   roomMsg=1.8;fadeDir=-1;sound(330,.12,'square',.04);}
  if(fadeDir<0&&fade<=0){transitioning=false;fadeDir=0;fadeTo=null}
  return; // fige tout pendant le fondu
 }
 roomMsg=Math.max(0,roomMsg-dt);
 // détection de franchissement vers une salle voisine du chemin
 let here=roomOf(player.x,player.y);if(here&&here!==curRoom&&here.visited!==undefined)roomTransition(here);
 // tripwires → effondrement / rocher
 tripwires.forEach(tw=>{if(tw.triggered)return;let on=tw.horiz?(Math.abs(player.y-(tw.y+.5))<.4&&player.x>tw.x&&player.x<tw.x+tw.len):(Math.abs(player.x-(tw.x+.5))<.4&&player.y>tw.y&&player.y<tw.y+tw.len);
  if(on){tw.triggered=true;sound(180,.16,'sawtooth',.05);impact(.3);if(tw.boulder&&boulder){boulder.active=true;
    if(boulder.axis==='h'){boulder.vx=boulder.dir*(boulder.chase?4.2:5.2);impact(.5);sound(70,.5,'sawtooth',.06);addFloater(player.x*T,player.y*T-14,'COURS !','#ff8a5e')}
    else{boulder.vy=-3.6;addFloater(player.x*T,player.y*T-14,'ÇA ROULE !','#ff8a5e')}}
   else if(tw.bridge){collapseBridge(tw);impact(.4);sound(90,.4,'sawtooth',.06);addFloater(player.x*T,player.y*T-14,'LE PONT CÈDE !','#ff8a5e')}
   else triggerCollapse(tw)}});
 // dalles qui s'effondrent (planifiées)
 for(let i=pendingPits.length-1;i>=0;i--){let p=pendingPits[i];p.t+=dt;if(p.t>=p.delay&&!p.done){p.done=true;map[p.y][p.x]=6;burst((p.x+.5)*T,(p.y+.5)*T,'#7a6a4a',12,1.5);sound(120,.18,'sawtooth',.05)}}
 // pics & lames (movers)
 movers.forEach(m=>{m.phase+=dt*m.speed;
  if(m.kind==='spike'){m.out=Math.sin(m.phase)>.3;if(m.out&&Math.hypot(player.x-(m.x+.5),player.y-(m.y+.5))<.55)hurt('Pics')}
  else if(m.kind==='blade'){if(m.horiz){m.px=m.x0+Math.sin(m.phase)*m.amp;if(Math.hypot(player.x-(m.px+.5),player.y-(m.y+.5))<.6)hurt('Lame')}
   else{m.py=(m.y0+m.y1)/2+Math.sin(m.phase)*m.amp;if(Math.hypot(player.x-(m.x0+.5),player.y-(m.py+.5))<.6)hurt('Lame')}}});
 // rocher : roule, tape les murs, blesse le joueur
 if(boulder&&boulder.active){boulder.spin+=dt*8*(boulder.axis==='h'?Math.sign(boulder.vx||boulder.dir):1);
  if(boulder.axis==='h'){
   // course horizontale : le rocher accélère (montée en pression), s'arrête en butant un mur.
   // En POURSUITE (chase) : accélère plus fort et plafond plus haut → vraie pression sur la durée.
   let acc=boulder.chase?2.4:1.4,cap=boulder.chase?9.5:8;
   boulder.vx+=boulder.dir*dt*acc;if(Math.abs(boulder.vx)>cap)boulder.vx=boulder.dir*cap;
   let nx=boulder.x+boulder.vx*dt,tx=Math.floor(nx+boulder.dir*.6);
   if(map[Math.floor(boulder.y)]&&map[Math.floor(boulder.y)][tx]!==3)boulder.x=nx;
   else{boulder.active=false;impact(.6);sound(60,.4,'sawtooth',.06);burst(boulder.x*T,boulder.y*T,'#7a6a4a',24,2.2)}
  }else{let ny=boulder.y+boulder.vy*dt;if(!solid(boulder.x,ny-.5)&&map[Math.floor(ny-.6)]&&map[Math.floor(ny-.6)][Math.floor(boulder.x)]!==3)boulder.y=ny;else{boulder.vy*=-.4;if(Math.abs(boulder.vy)<.6)boulder.active=false}}
  // collision joueur : le gros rocher de course (rayon ↑) repousse fort et blesse.
  let rad=boulder.chase?1.05:.85;if(Math.hypot(player.x-boulder.x,player.y-boulder.y)<rad){let a=Math.atan2(player.y-boulder.y,player.x-boulder.x);player.vx+=Math.cos(a)*9;player.vy+=Math.sin(a)*9;hurt('Rocher',true)}}
 // ramassage des clés
 keysArr.forEach(k=>{if(!k.taken&&Math.hypot(player.x-k.x-.5,player.y-k.y-.5)<.5){k.taken=true;keysHeld++;sfx('key');addFloater(k.x*T,k.y*T-8,'CLÉ !','#ffe35b');score+=50}});
 // dalles : marcher dessus (ou bloc dessus) les active
 plates.forEach(p=>{let by=p.target?blocks.some(b=>b.x===p.x&&b.y===p.y):false;let on=by||Math.hypot(player.x-p.x-.5,player.y-p.y-.5)<.5;if(p.target)p.on=by;else if(!p.on&&on){p.on=true;sound(440,.1,'square',.04);addFloater(p.x*T,p.y*T-8,'DALLE','#9af0ff')}});
 // ÉNIGME DES VASQUES : allumer les runes de la salle courante dans le bon ordre (p.seq).
 let cr=roomOf(player.x,player.y);
 // POSTE DE CONTRÔLE des épreuves d'agilité : le joueur doit toucher le crossGate (au cœur du
 // danger) pour prouver qu'il a traversé. Sans ça, atteindre la sortie ne valide pas l'épreuve.
 if(cr&&cr.crossGate&&!cr.crossed&&Math.hypot(player.x-cr.crossGate.x-.5,player.y-cr.crossGate.y-.5)<.9){
  cr.crossed=true;sound(560,.12,'square',.05);addFloater(cr.crossGate.x*T,cr.crossGate.y*T-8,'✓','#8fe6a0')}
 let runes=cr?props.filter(p=>p.type==='rune'&&p.x>=cr.x&&p.x<cr.x+cr.w&&p.y>=cr.y&&p.y<cr.y+cr.h):[];
 if(runes.length){
  runes.forEach(rn=>{if(rn.lit)return;if(Math.hypot(player.x-rn.x-.5,player.y-rn.y-.5)<.5){
   if(rn.seq===cr.riddleStep){rn.lit=true;cr.riddleStep++;sound(520+rn.seq*120,.12,'square',.05);addFloater(rn.x*T,rn.y*T-8,'✦','#ffd24a');
    if(cr.riddleStep>=runes.length&&!cr.riddleDone){cr.riddleDone=true;score+=200;keysHeld++;burst((cr.cx+.5)*T,(cr.cy+.5)*T,'#ffe35b',24,2);addFloater(cr.cx*T,(cr.cy-2)*T,'ÉNIGME RÉSOLUE +CLÉ','#8fe6a0');sound(660,.2,'square',.06)}}
   else{ // mauvais ordre → on éteint tout et on recommence
    sound(140,.18,'sawtooth',.05);addFloater(rn.x*T,rn.y*T-8,'NON…','#ff6b5e');runes.forEach(o=>o.lit=false);cr.riddleStep=0}}})}
 updateTempleMechanics(dt,cr);
 // GATE STRICT : ouverture AUTO des portes dont l'épreuve de la salle source est résolue
 // (dalles activées, énigme finie, défi d'agilité franchi). Les portes 'quiz'/'key' restent
 // manuelles (interaction de proximité ci-dessous).
 doors.forEach(d=>{if(d.open||d.room==null)return;let sr=rooms.find(r=>r.id===d.room);if(!sr)return;
  if((d.kind==='plate'||d.kind==='riddle'||d.kind==='skill'||d.kind==='task')&&roomSolved(sr)){d.open=true;sr.solved=true;sfx('door');addFloater(d.x*T,d.y*T-8,'OUVERTE','#8fe6a0');burst(d.x*T,d.y*T,'#ffe35b',16,1.6)}});
 // portes : interaction de proximité (quiz = question, key = consomme une clé)
 let near=doors.find(d=>!d.open&&Math.hypot(player.x-d.x-.5,player.y-d.y-.5)<1.15);
 if(near){
  if(near.kind==='key'){if(keysHeld>0){keysHeld--;near.open=true;markRoomSolved(near.room);sfx('door');addFloater(near.x*T,near.y*T-8,'OUVERTE','#8fe6a0');burst(near.x*T,near.y*T,'#ffe35b',16,1.6)}
   else if(!near.coolMsg||performance.now()>near.coolMsg){near.coolMsg=performance.now()+1400;addFloater(near.x*T,near.y*T-8,'CLÉ REQUISE','#ffd24a')}}
  else if(near.kind==='quiz'&&(!near.cool||performance.now()>near.cool)){pendingDoor=near;askQuestion('door')}
 }
 // chute dans le vide en Ruines : renvoie au centre de la salle courante (pas de noyade longue)
 if(isDeep(player.x,player.y)){player.x=(curRoom?curRoom.cx:spawn.x)+.5;player.y=(curRoom?curRoom.cy:spawn.y)+.5;player.vx=player.vy=0;hurt('Gouffre',false);return}
 // LAVE : on ne reste pas dedans — renvoyé à la dernière plateforme sûre + brûlure.
 if(tileAt(player.x,player.y)===7){let s=player.lavaSafe||{x:(curRoom?curRoom.cx:spawn.x)+.5,y:(curRoom?curRoom.cy:spawn.y)+.5};player.x=s.x;player.y=s.y;player.vx=player.vy=0;burst(player.x*T,player.y*T,'#ff7a1f',14,2);hurt('Lave',false);return}
 // mémorise la dernière tuile de sol franc foulée (point de renvoi en cas de chute dans la lave)
 if(tileAt(player.x,player.y)===0&&!isDeep(player.x,player.y))player.lavaSafe={x:Math.floor(player.x)+.5,y:Math.floor(player.y)+.5};
 // SALLE DU TRÉSOR : le gardien protège le coffre. On affronte D'ABORD le boss, PUIS on
 // récupère le trésor. Atteindre le coffre déclenche le gardien tant qu'il n'est pas vaincu.
 if(treasure&&!treasure.taken){
  let dT=Math.hypot(player.x-treasure.x-.5,player.y-treasure.y-.5);
  if(!ruinsBossDone){
   // s'approcher du coffre (ou de la sortie de la salle) réveille le gardien
   let dE=exit?Math.hypot(player.x-exit.x-.5,player.y-exit.y-.5):9;
   if(dT<1.2||dE<.6)startBoss();
  }else if(dT<.6){
   // gardien vaincu : le trésor est enfin saisissable → fin de niveau
   treasure.taken=true;treasureBonus=true;collected=4;score+=400;
   addFloater(treasure.x*T,treasure.y*T-10,'TRÉSOR !','#ffe35b');burst(treasure.x*T,treasure.y*T,'#ffe35b',30,2.5);sfx('secret');
   finish(true);
  }
 }
 // caméra : centrée sur la salle si elle tient à l'écran, sinon SUIT le joueur (clampée aux bords de la salle).
 updateRoomCam(dt);
}
// Caméra de donjon : si la salle courante dépasse la fenêtre, on suit le joueur (borné par la salle)
// plutôt que de rester figé sur le centre (sinon le joueur sort du champ dans les grandes salles).
function updateRoomCam(dt){
 let r=curRoom;
 // COULOIR : le joueur a quitté la salle courante (roomOf renvoie une autre salle/rien) → il
 // traverse un couloir. On SUIT alors le joueur pour qu'il voie toujours où il va (sinon la
 // caméra reste figée sur l'ancienne salle et on avance « dans le noir » hors champ).
 let inRoom=r&&player.x>=r.x&&player.x<r.x+r.w&&player.y>=r.y&&player.y<r.y+r.h;
 if(!r||!inRoom){let tx=player.x*T-W/2,ty=player.y*T-H/2;cam.tx=tx;cam.ty=ty;cam.x+=(tx-cam.x)*Math.min(1,dt*8);cam.y+=(ty-cam.y)*Math.min(1,dt*8);clampCam();return}
 let viewW=W/T,viewH=H/T;
 let tx,ty;
 if(r.w<=viewW)tx=(r.cx+.5)*T-W/2; // salle plus étroite que l'écran → centrée en X
 else{let cxp=player.x*T-W/2;let minX=r.x*T-T,maxX=(r.x+r.w)*T-W+T;tx=Math.max(minX,Math.min(maxX,cxp))}
 if(r.h<=viewH)ty=(r.cy+.5)*T-H/2; // salle plus basse que l'écran → centrée en Y
 else{let cyp=player.y*T-H/2;let minY=r.y*T-T,maxY=(r.y+r.h)*T-H+T;ty=Math.max(minY,Math.min(maxY,cyp))}
 cam.tx=tx;cam.ty=ty;
 cam.x+=(tx-cam.x)*Math.min(1,dt*8);cam.y+=(ty-cam.y)*Math.min(1,dt*8);clampCam();
}
// ── MURS DE PICS QUI SE REFERMENT ─────────────────────────────────────────
// Chaque mur avance vers le centre de SA salle tant qu'elle n'est pas résolue et que le joueur
// s'y trouve (pression). Une fois résolue → recul rapide. Le joueur touché par la ligne de pics
// (sa colonne/rangée a atteint la position du joueur) subit un dégât.
function updateClosingWalls(dt,cr){
 if(!closingWalls.length)return;
 closingWalls.forEach(w=>{
  let r=rooms.find(o=>o.id===w.room);if(!r)return;
  let here=cr&&cr.id===w.room; // joueur dans cette salle ?
  let solved=roomSolved(r);
  if(solved){
   // recul : retourne vers son bord d'origine (min pour gauche/haut, max pour droite/bas).
   w.sp=0;let home=w.side<0?w.min:w.max;
   w.pos+=(home-w.pos)*Math.min(1,dt*3);
   if(w.side<0)w.pos=Math.max(w.min,w.pos);else w.pos=Math.min(w.max,w.pos);
  }else if(here){
   // avance progressive (accélère légèrement) vers le centre.
   w.sp=Math.min(1.6,w.sp+dt*.35);
   w.pos+= -w.side * w.sp * dt * 2.2;
   w.pos=Math.max(w.min,Math.min(w.max,w.pos));
   // dégât : si la ligne de pics atteint la position du joueur sur l'axe d'avance.
   if(w.axis==='h'){if(Math.abs(player.x-(w.pos+.5))<.6&&player.y>=w.y0&&player.y<=w.y1+1)hurt('Pics');}
   else{if(Math.abs(player.y-(w.pos+.5))<.6&&player.x>=w.x0&&player.x<=w.x1+1)hurt('Pics');}
  }
 });
}
// ── Mise à jour des 6 nouvelles mécaniques de temple (ice/crusher/levers/portal/mirror/simon)
function updateTempleMechanics(dt,cr){
 // 10) ICE : la glissade est gérée dans move() (variable 'ice' via iceZones) — rien à faire ici.
 // 11) CRUSHER : presses qui descendent par à-coups, écrasent dans le couloir.
 crushers.forEach(c=>{c.phase+=dt*c.speed;c.down=Math.max(0,Math.sin(c.phase))*2;
  // la presse occupe la colonne c.x de top-1 à top+down ; collision = dégât
  let cyTop=c.top, cyBot=c.top+Math.round(c.down);
  if(Math.abs(player.x-(c.x+.5))<.55&&player.y>=cyTop&&player.y<=cyBot+1)hurt('Presse');});
 // MURS DE PICS QUI SE REFERMENT : avancent vers le centre tant que la salle (cr) n'est pas
 // résolue ET que le joueur s'y trouve. Résolu → ils se rétractent. Contact = dégât.
 updateClosingWalls(dt,cr);
 // 12) LEVERS : actionner près d'un levier → tente la séquence ; mauvais ordre = reset.
 if(cr&&cr.kind==='levers'&&!cr.puzzleDone){
  levers.filter(l=>l.room===cr.id).forEach(l=>{
   if(l.on)return;if(Math.hypot(player.x-l.x-.5,player.y-l.y-.5)<.6){
    if(l.seq===cr.leverStep){l.on=true;cr.leverStep++;sound(420+l.seq*90,.12,'square',.05);addFloater(l.x*T,l.y*T-8,'CLAC','#9af0ff');
     if(cr.leverStep>=cr.leverN){cr.puzzleDone=true;score+=180;burst((cr.cx+.5)*T,(cr.cy+.5)*T,'#ffe35b',22,2);addFloater(cr.cx*T,(cr.cy-2)*T,'LEVIERS ✓','#8fe6a0');sound(660,.2,'square',.06)}}
    else{sound(140,.18,'sawtooth',.05);addFloater(l.x*T,l.y*T-8,'NON…','#ff6b5e');levers.filter(o=>o.room===cr.id).forEach(o=>o.on=false);cr.leverStep=0}}});
 }
 // 13) PORTAL : marcher sur un portail téléporte (cooldown anti-rebond) ; dalle-cible = résolu.
 portals.forEach(p=>{if(p.cd>0){p.cd-=dt;return}
  if(Math.hypot(player.x-p.x-.5,player.y-p.y-.5)<.5){player.x=p.px+.5;player.y=p.py+.5;player.vx=player.vy=0;
   portals.forEach(o=>{if(Math.abs(o.x-p.px)<.1&&Math.abs(o.y-p.py)<.1)o.cd=.6});p.cd=.6;
   sound(740,.14,'sine',.05);burst((p.px+.5)*T,(p.py+.5)*T,p.col,14,1.6)}});
 if(cr&&cr.kind==='portal'&&!cr.puzzleDone){let g=plates.find(p=>p.portalGoal&&p.room===cr.id);
  if(g&&Math.hypot(player.x-g.x-.5,player.y-g.y-.5)<.5){g.on=true;cr.puzzleDone=true;score+=180;burst((g.x+.5)*T,(g.y+.5)*T,'#ffe35b',22,2);addFloater(g.x*T,(g.y-2)*T,'PORTAILS ✓','#8fe6a0');sound(660,.2,'square',.06)}}
 // 14) MIRROR : interagir près d'un miroir (E / ESPACE) le fait pivoter ; on recalcule le rayon.
 if(cr&&cr.kind==='mirror'&&!cr.puzzleDone){
  // rayon d'interaction large (1.3) : les miroirs sont sur les lignes haute/basse, on se tient à côté.
  if(keys[' ']||keys.e){let m=mirrors.filter(o=>o.room===cr.id).filter(o=>!o.cd||performance.now()>o.cd)
    .sort((a,b)=>Math.hypot(player.x-a.x-.5,player.y-a.y-.5)-Math.hypot(player.x-b.x-.5,player.y-b.y-.5))[0];
   if(m&&Math.hypot(player.x-m.x-.5,player.y-m.y-.5)<1.3){m.o=(m.o+1)%2;m.cd=performance.now()+260;sound(520,.1,'square',.05);addFloater(m.x*T,m.y*T-8,'TOURNE','#9af0ff')}}
  if(traceBeam(cr)){cr.puzzleDone=true;let s=props.find(p=>p.type==='sensor'&&p.x===cr.sensor.x&&p.y===cr.sensor.y);if(s)s.lit=true;score+=200;burst((cr.sensor.x+.5)*T,(cr.sensor.y+.5)*T,'#ffe35b',22,2);addFloater(cr.cx*T,(cr.cy-2)*T,'RAYON ✓','#8fe6a0');sound(660,.2,'square',.06)}
 }
 // 15) SIMON : montre la séquence, puis attend la reproduction (longueur croissante).
 simons.forEach(s=>{if(s.room==null)return;let r=rooms.find(o=>o.id===s.room);if(!r||r.puzzleDone)return;
  if(s.phase==='show'){s.showT+=dt;props.filter(p=>p.type==='simonpad'&&inRoomProp(p,r)).forEach(p=>p.lit=Math.max(0,p.lit-dt*2));
   if(s.showT>=.6){let pad=s.pads[s.seq[s.showIdx]];let pp=props.find(p=>p.type==='simonpad'&&p.x===pad.x&&p.y===pad.y);if(pp){pp.lit=1;sound(440+s.seq[s.showIdx]*120,.18,'square',.05)}s.showT=0;s.showIdx++;if(s.showIdx>=s.seq.length){s.phase='input';s.step=0;s.showIdx=0}}}
  else if(s.phase==='input'){
   s.pads.forEach(pad=>{if(pad.cd>0){pad.cd-=dt;return}if(Math.hypot(player.x-pad.x-.5,player.y-pad.y-.5)<.5){pad.cd=.4;let pp=props.find(p=>p.type==='simonpad'&&p.x===pad.x&&p.y===pad.y);
    if(pad.id===s.pads[s.seq[s.step]].id){if(pp){pp.lit=1}sound(440+pad.id*120,.14,'square',.05);s.step++;
     if(s.step>=s.seq.length){if(s.seq.length>=4){r.puzzleDone=true;score+=220;burst((r.cx+.5)*T,(r.cy+.5)*T,'#ffe35b',24,2.2);addFloater(r.cx*T,(r.cy-2)*T,'MÉMOIRE ✓','#8fe6a0');sound(680,.2,'square',.06)}
      else{s.seq.push(rng(s.pads.length));s.phase='show';s.showIdx=0;s.step=0;addFloater(r.cx*T,(r.cy-2)*T,'SUITE…','#9af0ff')}}}
    else{sound(130,.2,'sawtooth',.06);addFloater(pad.x*T,pad.y*T-8,'RATÉ','#ff6b5e');s.seq=[rng(s.pads.length)];s.phase='show';s.showIdx=0;s.step=0}}})}
 });
}
// Un prop appartient-il à la salle r ?
function inRoomProp(p,r){return p.x>=r.x&&p.x<r.x+r.w&&p.y>=r.y&&p.y<r.y+r.h}
// MIRROR : trace le rayon depuis l'émetteur ; les miroirs (o:0='/',1='\') le défléchissent.
// Renvoie true si le rayon atteint le capteur de la salle. dirs: 0=→,1=↓,2=←,3=↑.
function traceBeam(r){let DX=[1,0,-1,0],DY=[0,1,0,-1];
 let x=r.emit.x,y=r.emit.y,dir=r.emit.dir,steps=0;
 r.beamPath=[];
 while(steps++<200){x+=DX[dir];y+=DY[dir];if(x<r.x||x>=r.x+r.w||y<r.y||y>=r.y+r.h)return false;
  r.beamPath.push([x,y]);
  if(x===r.sensor.x&&y===r.sensor.y)return true;
  if(map[y]&&map[y][x]===3)return false; // mur stoppe le rayon
  let m=mirrors.find(o=>o.room===r.id&&o.x===x&&o.y===y);
  if(m){ // '/'(o=0): →↑, ↓←, ←↓, ↑→   '\'(o=1): →↓, ↑←, ←↑, ↓→
   if(m.o===0)dir=[3,2,1,0][dir];else dir=[1,0,3,2][dir];}
 }
 return false}
// Effondrement du PONT : le tablier (2 tuiles de haut) tombe en cascade depuis l'entrée
// vers la sortie. Délais courts → il faut courir/dasher pour rester devant la rupture.
function collapseBridge(tw){let by=tw.by,from=tw.dir>0?tw.gx0:tw.gx1,to=tw.dir>0?tw.gx1:tw.gx0,step=tw.dir>0?1:-1,k=0;
 // l'effondrement part du bord d'entrée et progresse vers la sortie ; léger sursis initial (.35) +
 // cadence régulière (.15/tuile) → le joueur qui court reste devant la vague (lecture « le pont cède »).
 for(let x=from;x!==to+step;x+=step){let delay=.35+k*.15;
  if(map[by]&&map[by][x]===0)pendingPits.push({x,y:by,t:0,delay,done:false});
  if(map[by+1]&&map[by+1][x]===0)pendingPits.push({x,y:by+1,t:0,delay,done:false});
  k++;}
}
// Planifie l'effondrement des dalles liées à un tripwire (délais échelonnés).
function triggerCollapse(tw){let span=tw.horiz?tw.len:tw.len;for(let i=0;i<span;i++){let x=tw.horiz?tw.x+i:tw.x,y=tw.horiz?tw.y+1:tw.y+i;if(map[y]&&map[y][x]===0)pendingPits.push({x,y,t:0,delay:.25+i*.12,done:false})}}
// Pousse un bloc d'une tuile si la case derrière est libre.
function pushBlock(b,dx,dy){let nx=b.x+dx,ny=b.y+dy;if(map[ny]&&map[ny][nx]===0&&!blocks.some(o=>o!==b&&o.x===nx&&o.y===ny)){b.x=nx;b.y=ny;sound(200,.08,'square',.04);burst((nx+.5)*T,(ny+.9)*T,'#8a7a5a',6,1);return true}return false}
// ── Rendu des objets de Ruines ────────────────────────────────────────────
function drawDoor(d){let x=d.x*T,y=d.y*T;if(d.open){rect(x+1,y+1,4,T-2,'#3a2f22');rect(x+T-5,y+1,4,T-2,'#3a2f22');return}
 // couleur de battant selon le type de verrou (lisibilité du « comment ouvrir »)
 let panel={key:'#8a6a32',quiz:'#7a5a6a',plate:'#3a6a72',riddle:'#6a4a82',skill:'#7a3a3a'}[d.kind]||'#7a5a6a';
 rect(x,y,T,T,'#6a5a3a');rect(x+2,y+2,T-4,T-4,panel);for(let i=0;i<3;i++)rect(x+4,y+4+i*6,T-8,2,'#4a3a22');
 // pictogramme d'épreuve au centre
 if(d.kind==='key')rect(x+T/2-3,y+T/2-3,6,6,'#ffe35b');
 else if(d.kind==='plate'){rect(x+T/2-5,y+T/2-2,10,5,'#9af0ff');rect(x+T/2-3,y+T/2,6,2,'#fff')}
 else if(d.kind==='riddle'){let g=Math.sin(performance.now()*.006)*.5+.5;X.globalAlpha=.5+g*.5;rect(x+T/2-1,y+T/2-5,2,10,'#caa6ff');rect(x+T/2-5,y+T/2-1,10,2,'#caa6ff');X.globalAlpha=1}
 else if(d.kind==='skill')pxText('!',x+T/2,y+T/2+4,'#ff9a8a','center',10);
 else pxText('?',x+T/2,y+T/2+4,'#ffe35b','center',10)}
function drawKey(k){if(k.taken)return;let x=k.x*T,y=k.y*T,b=Math.round(Math.sin(performance.now()*.006)*2);rect(x+8,y+6+b,4,10,'#ffe35b');rect(x+6,y+4+b,8,5,'#ffe35b');rect(x+8,y+6+b,4,2,'#171512');rect(x+8,y+14+b,5,2,'#ffe35b');rect(x+8,y+17+b,3,2,'#ffe35b')}
function drawPlate(p){let x=p.x*T,y=p.y*T;rect(x+2,y+2,T-4,T-4,p.on?'#5fd0e0':'#4a4030');rect(x+5,y+5,T-10,T-10,p.on?'#9af0ff':'#5a5038');if(p.on)rect(x+T/2-2,y+T/2-2,4,4,'#fff');if(p.target&&!p.on){X.strokeStyle='#caa6ff';X.lineWidth=1;X.strokeRect(x+4,y+4,T-8,T-8)}}
function drawTreasure(tr){if(tr.taken)return;let x=tr.x*T,y=tr.y*T,b=Math.round(Math.sin(performance.now()*.005)*3);rect(x+2,y+18,20,4,'rgba(20,30,10,.4)');rect(x+3,y+8+b,18,12,'#a8761f');rect(x+3,y+6+b,18,4,'#c8962f');rect(x+3,y+13+b,18,2,'#6a4a12');rect(x+10,y+11+b,4,5,'#ffe35b');for(let i=0;i<3;i++){let g=Math.sin(performance.now()*.008+i);if(g>.3)rect(x+5+i*6,y+2+b,2,2,'#fff7a1')}}
// Fil-piège : ligne fine claire qui tremble une fois déclenchée.
function drawTripwire(tw){if(tw.triggered)return;let t=performance.now()*.004;X.strokeStyle='rgba(255,210,90,.8)';X.lineWidth=1;X.beginPath();
 if(tw.horiz){let y=(tw.y+.5)*T+Math.sin(t)*1;X.moveTo(tw.x*T,y);X.lineTo((tw.x+tw.len)*T,y)}else{let x=(tw.x+.5)*T+Math.sin(t)*1;X.moveTo(x,tw.y*T);X.lineTo(x,(tw.y+tw.len)*T)}X.stroke();X.lineWidth=4}
// Props décoratifs de Ruines (statues, braseros, colonnes, urnes, glyphes, alcôves).
// POSTES DE CONTRÔLE des épreuves : glyphe au sol au cœur du danger. Pulse doré tant qu'il faut
// le franchir, vert validé une fois traversé → repère clair de l'objectif de la salle.
function drawCrossGates(){let t=performance.now();rooms.forEach(r=>{
 if(!r.crossGate||r.solved||!SKILL_KINDS.includes(r.kind))return;
 let g=r.crossGate,x=g.x*T,y=g.y*T,done=r.crossed,pulse=Math.sin(t*.006)*.5+.5;
 let col=done?'#8fe6a0':'#ffe35b';
 X.save();X.globalAlpha=(done?.28:.20+pulse*.22);rect(x-2,y-2,T+4,T+4,col);X.restore();
 X.strokeStyle=col;X.lineWidth=2;X.strokeRect(x+3,y+3,T-6,T-6);
 if(done){rect(x+7,y+12,3,4,col);rect(x+9,y+14,3,3,col);rect(x+11,y+8,3,8,col)}// ✓
 else{X.globalAlpha=.6+pulse*.4;rect(x+T/2-1,y+5,2,T-10,col);rect(x+5,y+T/2-1,T-10,2,col);X.globalAlpha=1}
})}
// ════ RENDU DES STRUCTURES OVERWORLD (décor au sol, repères, villageois, puits, ruines) ════
// Petit décor au sol non bloquant : pose un mini-motif selon la nature (fleur, caillou, os…).
function drawGroundDecor(g){let x=g.x*T+(g.ox||0)+6,y=g.y*T+(g.oy||0)+8,k=g.kind;
 if(k==='path'){X.globalAlpha=.5;rect(g.x*T+3,g.y*T+3,T-6,T-6,'#8a734e');X.globalAlpha=.3;rect(g.x*T+6,g.y*T+6,T-12,T-12,'#9c855c');X.globalAlpha=1;return}
 X.globalAlpha=.92;
 if(k==='flower'){let c=['#ff7ab0','#ffd24a','#9af0ff','#ffffff'][g.s%4];rect(x+2,y,2,4,'#3a6a2e');rect(x,y-2,2,2,c);rect(x+4,y-2,2,2,c);rect(x+2,y-4,2,2,c);rect(x+2,y-2,2,2,'#ffe35b')}
 else if(k==='mushroom'){rect(x+2,y,2,4,'#e8dcc0');rect(x,y-2,6,3,'#c8503a');rect(x+1,y-1,1,1,'#fff')}
 else if(k==='fern'||k==='reed'){rect(x+2,y-5,1,6,'#3a7a3e');rect(x,y-3,2,1,'#4a8a4e');rect(x+3,y-4,2,1,'#4a8a4e');rect(x+1,y-1,2,1,'#4a8a4e')}
 else if(k==='pebble'||k==='obsidian'||k==='mineral'){let c=k==='obsidian'?'#2a2436':k==='mineral'?'#b0a060':'#8a8276';rect(x,y,4,3,c);rect(x+1,y-1,2,1,c)}
 else if(k==='bone'||k==='acaciaseed'){rect(x,y,5,1,'#d8cfb8');rect(x,y-1,1,3,'#cdc3ad');rect(x+4,y-1,1,3,'#cdc3ad')}
 else if(k==='shellbit'||k==='starfish'){let c=k==='starfish'?'#ff9a5e':'#f0d8c0';rect(x+1,y-2,3,3,c);rect(x,y-1,1,1,c);rect(x+4,y-1,1,1,c)}
 else if(k==='seaweed'||k==='lily'||k==='vinebit'){rect(x+1,y-4,2,5,'#2e8a5e');rect(x,y-2,1,2,'#3a9a6e');rect(x+3,y-3,1,2,'#3a9a6e')}
 else if(k==='snowtuft'||k==='iceshard'){let c=k==='iceshard'?'#bfe6f0':'#eef6fa';rect(x,y,5,2,c);rect(x+1,y-2,2,2,c)}
 else if(k==='pinecone'){rect(x+1,y-2,3,4,'#7a5a36');rect(x,y-1,1,1,'#5a4226');rect(x+4,y-1,1,1,'#5a4226')}
 else if(k==='cactusbit'){rect(x+1,y-3,2,4,'#3e7a4e');rect(x,y-1,1,2,'#3e7a4e');rect(x+3,y-2,1,2,'#3e7a4e')}
 else if(k==='crack'){X.strokeStyle='rgba(20,16,10,.4)';X.lineWidth=1;X.beginPath();X.moveTo(x,y);X.lineTo(x+3,y-3);X.lineTo(x+6,y);X.stroke();X.lineWidth=4}
 else if(k==='ember'){let f=Math.sin(performance.now()*.01+g.s)*.5+.5;rect(x+1,y-1,3,3,f>.5?'#ff7a2e':'#8a4030');X.globalAlpha=.3;rect(x,y-2,5,5,'#ff9a3e')}
 else if(k==='ash'||k==='steamvent'){X.globalAlpha=.4;rect(x,y-2,5,4,k==='steamvent'?'#cfe0e0':'#5a544e')}
 else if(k==='grasstuft'||k==='mossbit'||k==='lichen'){let c=k==='lichen'?'#9aae6a':k==='mossbit'?'#4a7a3e':'#7aae4e';rect(x,y-3,1,4,c);rect(x+2,y-4,1,5,c);rect(x+4,y-3,1,4,c)}
 else if(k==='edelweiss'){rect(x+1,y-2,3,3,'#ffffff');rect(x+2,y-1,1,1,'#ffe35b')}
 else if(k==='tile'||k==='wire'||k==='bolt'||k==='vial'){let c=k==='vial'?'#9af0ff':k==='bolt'?'#c8c8d2':'#5a6a7a';rect(x,y-1,4,3,c)}
 else if(k==='ripple'){X.globalAlpha=.35;X.strokeStyle='#d8be7e';X.lineWidth=1;X.beginPath();X.arc(x+2,y,3,0,Math.PI);X.stroke();X.lineWidth=4}
 else{rect(x,y,3,2,'#8a8276')}
 X.globalAlpha=1}
// Repère de paysage (structure non interactive) : grand élément silhouette propre au biome.
function drawStructure(s){let x=s.x*T,y=s.y*T,k=s.kind,t=performance.now()*.001;
 let pillar=(c1,c2)=>{rect(x+6,y-14,12,T+14,c1);rect(x+6,y-14,3,T+14,c2);for(let i=0;i<5;i++)rect(x+6,y-12+i*7,12,1,'rgba(0,0,0,.18)')};
 if(k==='obelisk'||k==='runestone'||k==='menhir'){rect(x+7,y-22,10,T+22,'#8a7d68');rect(x+7,y-22,3,T+22,'#9d9078');rect(x+9,y-18,6,2,'#5a4f40');rect(x+9,y-10,6,2,'#5a4f40');if(k==='runestone'){let g=Math.sin(t*2+s.seed)*.5+.5;X.globalAlpha=.4+g*.4;rect(x+10,y-16,4,10,'#9af0ff');X.globalAlpha=1}}
 else if(k==='totem'||k==='idolhead'){rect(x+6,y-20,12,T+20,'#7a5a36');rect(x+8,y-18,8,6,'#9a6a3a');rect(x+9,y-17,2,2,'#1a1a1a');rect(x+13,y-17,2,2,'#1a1a1a');rect(x+8,y-10,8,5,'#8a5e30');rect(x+9,y-8,2,2,'#1a1a1a');rect(x+13,y-8,2,2,'#1a1a1a');rect(x+5,y-21,14,3,'#5a8a4e')}
 else if(k==='ruinpillar'||k==='basaltcol'||k==='peakcairn'||k==='geocairn'||k==='cairn'||k==='geyserc'){let c=k==='basaltcol'?['#3a3640','#4e4a56']:['#8a7d68','#9d9078'];pillar(c[0],c[1]);if(k!=='ruinpillar')rect(x+5,y+T-4,14,4,c[0])}
 else if(k==='gianttrunk'||k==='vinetower'||k==='deadtree'||k==='frozentree'||k==='acacia'){let c=k==='frozentree'?'#bfe6f0':k==='deadtree'?'#5a4a3a':'#6a4a2e';rect(x+8,y-20,8,T+20,c);rect(x+8,y-20,3,T+20,k==='frozentree'?'#e4f4fa':'#7a5a36');if(k==='acacia'){rect(x-2,y-24,28,8,'#5a7a3e');rect(x,y-26,24,4,'#6a8a4e')}else if(k!=='deadtree'){rect(x+2,y-26,20,10,k==='frozentree'?'#dff0f6':'#3a6a2e')}else{rect(x+2,y-22,6,2,'#4a3a2a');rect(x+16,y-18,6,2,'#4a3a2a')}}
 else if(k==='shipwreck'||k==='log'){rect(x,y-6,T,10,'#6a4a2e');rect(x,y-6,T,3,'#7a5a36');for(let i=0;i<4;i++)rect(x+2+i*5,y-6,1,10,'#4a3a2a');if(k==='shipwreck')rect(x+10,y-18,3,13,'#5a4226')}
 else if(k==='ziggurat'||k==='buriedstatue'||k==='hut'||k==='igloo'||k==='tent'||k==='termite'){
  if(k==='igloo'){rect(x+2,y-8,T-4,12,'#e4f4fa');rect(x+2,y-8,T-4,3,'#ffffff');rect(x+9,y,6,4,'#aaccd8')}
  else if(k==='tent'){X.fillStyle='#b06a3a';X.beginPath();X.moveTo(x+T/2,y-14);X.lineTo(x,y+4);X.lineTo(x+T,y+4);X.fill();rect(x+T/2-1,y-14,2,18,'#5a4226')}
  else if(k==='termite'||k==='hut'){rect(x+5,y-14,14,18,k==='hut'?'#8a6a3a':'#a07850');rect(x+5,y-14,14,3,k==='hut'?'#9a7a4a':'#b08860');if(k==='hut')rect(x+10,y-4,4,8,'#3a2a1a')}
  else{rect(x+3,y-4,T-6,8,'#a89060');rect(x+6,y-10,T-12,6,'#b8a070');rect(x+9,y-15,T-18,5,'#c8b080')}}
 else if(k==='console'||k==='tank'||k==='pylon'||k==='crate'||k==='mudpot'){
  if(k==='pylon'){rect(x+9,y-22,6,T+22,'#5a6a7a');let g=Math.sin(t*3+s.seed)*.5+.5;X.globalAlpha=.4+g*.4;rect(x+8,y-24,8,4,'#9af0ff');X.globalAlpha=1}
  else if(k==='tank'){rect(x+5,y-16,14,20,'#3a5a6a');rect(x+7,y-14,10,16,'#4a7a8a');X.globalAlpha=.5;rect(x+7,y-14,10,16,'#9af0ff');X.globalAlpha=1}
  else if(k==='crate'){rect(x+5,y-6,14,12,'#7a5a36');rect(x+5,y-6,14,2,'#8a6a46');rect(x+11,y-6,2,12,'#5a4226')}
  else if(k==='mudpot'){let g=Math.sin(t*2+s.seed)*.5+.5;rect(x+3,y-2,T-6,8,'#5a4a3a');X.globalAlpha=.5+g*.3;rect(x+6,y-3,T-12,4,'#8a6a4a');X.globalAlpha=1}
  else{rect(x+4,y-12,T-8,16,'#3a4a5a');rect(x+6,y-10,T-12,6,'#9af0ff');rect(x+6,y-2,T-12,4,'#5a6a7a')}}
 else if(k==='crystal'){let g=Math.sin(t*2+s.seed)*.5+.5;rect(x+9,y-16,6,20,'#9af0ff');rect(x+7,y-10,3,8,'#bff4ff');rect(x+15,y-12,3,10,'#7ad0e0');X.globalAlpha=.3+g*.3;rect(x+5,y-18,14,22,'#9af0ff');X.globalAlpha=1}
 else if(k==='skull'||k==='bones'){rect(x+6,y-6,12,10,'#e8dcc0');rect(x+8,y-3,2,3,'#2a241c');rect(x+13,y-3,2,3,'#2a241c');rect(x+9,y+2,5,2,'#cdc3ad')}
 else if(k==='shrine'||k==='mossrock'||k==='lavarock'||k==='palmgrove'||k==='shell'){let c=k==='lavarock'?['#3a2630','#6a3020']:k==='palmgrove'?['#3a6a2e','#4a8a3e']:['#7a8d68','#8da078'];rect(x+4,y-2,T-8,8,c[0]);rect(x+6,y-8,T-12,6,c[1]);if(k==='shrine'){let g=Math.sin(t*2)*.5+.5;X.globalAlpha=.3+g*.3;rect(x+9,y-12,6,6,'#ffd24a');X.globalAlpha=1}}
 else{rect(x+6,y-14,12,T+14,'#8a7d68');rect(x+6,y-14,3,T+14,'#9d9078')}
}
// Puits : margelle de pierre + eau sombre. Pulse léger quand utilisable.
function drawWell(w){if(w.used){let x=w.x*T,y=w.y*T;rect(x+4,y+4,T-8,T-8,'#5a5046');rect(x+7,y+7,T-14,T-14,'#2a2620');return}
 let x=w.x*T,y=w.y*T,p=Math.sin(performance.now()*.004+w.pulse)*.5+.5;
 rect(x+3,y+3,T-6,T-6,'#7a6e5a');rect(x+5,y+5,T-10,T-10,'#3a4a5a');rect(x+7,y+7,T-14,T-14,'#2a3a4a');
 X.globalAlpha=.3+p*.3;rect(x+7,y+7,T-14,T-14,'#6ed2ff');X.globalAlpha=1;
 rect(x+2,y-6,2,9,'#6a5a40');rect(x+T-4,y-6,2,9,'#6a5a40');rect(x+1,y-8,T-2,3,'#5a4a36');
 X.globalAlpha=.5+p*.5;pxText('E',x+T/2,y-10,'#ffe35b','center',7);X.globalAlpha=1}
// Site de ruine : socle de coffre central (les colonnes sont des murs déjà posés).
function drawRuinSite(rs){let x=rs.x*T,y=rs.y*T,p=Math.sin(performance.now()*.005+rs.pulse)*.5+.5;
 if(rs.looted){rect(x+6,y+10,T-12,8,'#5a4a32');rect(x+8,y+12,T-16,4,'#3a2e1c');return}
 rect(x+5,y+8,T-10,12,'#6a4a2e');rect(x+5,y+8,T-10,3,'#8a5e30');rect(x+5,y+8,T-10,2,'#9a6a3a');
 for(let i=0;i<3;i++)rect(x+8+i*4,y+11,2,7,'#5a4226');
 X.globalAlpha=.4+p*.4;rect(x+3,y+2,T-6,T-6,'#ffe35b');X.globalAlpha=1;
 X.globalAlpha=.6+p*.4;pxText('E',x+T/2,y-2,'#ffe35b','center',7);X.globalAlpha=1}
// Villageois : petit personnage robe + tête, bob animé. Couleur de robe varie (v.kind).
function drawVillager(v){let x=v.x*T,y=v.y*T,t=performance.now(),b=Math.round(Math.sin(t*.003+v.bob)*1.2),sw=Math.sin(t*.004+v.bob);
 // 3 archétypes de villageois avec un vrai chara-design (sage, marchande, herboriste).
 let K=v.kind%3;
 let pal=[
  {robe:'#7a4ab0',robe2:'#9a6ad0',trim:'#f0d878',hair:'#d8d2c8',skin:'#e8c4a0',hat:1},   // Sage violet à barbe blanche + chapeau pointu
  {robe:'#b8443a',robe2:'#d86a52',trim:'#e8c060',hair:'#3a2a1c',skin:'#e0b890',hat:0},    // Marchande tunique rouge + foulard
  {robe:'#2e7a52',robe2:'#46a070',trim:'#cfe8a0',hair:'#5a3a22',skin:'#e8c8a0',hat:2}     // Herboriste vert + capuche feuille
 ][K];
 if(v.done){X.globalAlpha=.55}
 let oy=b; // ombre au sol
 X.globalAlpha*= (v.done?.55:1); X.fillStyle='rgba(0,0,0,.22)';X.beginPath();X.ellipse(x,y+9,7,2.5,0,0,6.28);X.fill();X.globalAlpha=v.done?.55:1;
 // jambes
 rect(x-4,y+4+oy,3,5,'#4a3a28');rect(x+1,y+4+oy,3,5,'#4a3a28');
 rect(x-5,y+8+oy,4,2,'#2e2418');rect(x+1,y+8+oy,4,2,'#2e2418');// chaussures
 // robe/tunique (trapèze : large en bas)
 rect(x-6,y-1+oy,12,7,pal.robe);rect(x-7,y+3+oy,14,3,pal.robe);
 rect(x-6,y-1+oy,3,9,pal.robe2);// liseré clair côté gauche
 rect(x-1,y-1+oy,2,9,pal.trim);// ceinture verticale ornée
 rect(x-7,y+5+oy,14,1,pal.trim);// ourlet doré
 // bras (un légèrement animé, comme s'il saluait/parlait)
 let armY=y+oy+Math.round(sw*1.2);
 rect(x-8,y+oy,3,5,pal.robe2);// bras gauche le long du corps
 rect(x+5,armY,3,5,pal.robe2);// bras droit qui bouge
 rect(x+5,armY+4,3,2,pal.skin);// main droite
 // torse/épaules
 rect(x-6,y-2+oy,12,2,pal.robe2);
 // cou + tête
 rect(x-2,y-4+oy,4,2,pal.skin);
 rect(x-4,y-12+oy,8,8,pal.skin);// tête
 rect(x-4,y-12+oy,8,2,'#00000018');// ombrage front
 // yeux + expression amicale
 rect(x-3,y-9+oy,2,2,'#2a241c');rect(x+1,y-9+oy,2,2,'#2a241c');
 rect(x-2,y-6+oy,4,1,'#b07858');// petit sourire
 // coiffe selon l'archétype
 if(pal.hat===1){// chapeau pointu de sage
  rect(x-5,y-13+oy,10,2,pal.robe);rect(x-4,y-16+oy,8,3,pal.robe);rect(x-2,y-19+oy,4,3,pal.robe2);rect(x-1,y-21+oy,2,2,pal.trim);
  rect(x-4,y-5+oy,8,4,pal.hair);// barbe blanche
 }else if(pal.hat===2){// capuche herboriste
  rect(x-5,y-13+oy,10,3,pal.robe2);rect(x-5,y-13+oy,2,6,pal.robe2);rect(x+3,y-13+oy,2,6,pal.robe2);
  rect(x-1,y-15+oy,2,2,pal.trim);// petite feuille sur la capuche
 }else{// cheveux + foulard marchande
  rect(x-5,y-13+oy,10,3,pal.hair);rect(x-5,y-11+oy,2,4,pal.hair);rect(x+3,y-11+oy,2,4,pal.hair);
  rect(x-4,y-13+oy,8,1,pal.trim);// bandeau
 }
 X.globalAlpha=1}
// Petit RUBIS VERT flottant au-dessus de la tête : signale un villageois à interroger.
function drawVillagerPrompt(v){let x=v.x*T,y=v.y*T,t=performance.now();
 if(v.done){// rubis terni + ✓ vert : déjà interrogé
  rect(x-2,y-26,4,4,'#5a8a64');rect(x-2,y-22,1,4,'#5a8a64');rect(x+1,y-22,1,4,'#5a8a64');return}
 let near=player&&Math.hypot(player.x-v.x,player.y-v.y)<1.3,bob=Math.round(Math.sin(t*.005)*2.2),gy=y-30+bob;
 // halo doux
 X.save();X.globalAlpha=.25+Math.sin(t*.006)*.1;X.fillStyle='#7bf0a0';X.beginPath();X.arc(x,gy+3,9,0,6.28);X.fill();X.restore();
 // RUBIS VERT taillé (losange à facettes)
 rect(x-1,gy-3,2,1,'#bff5cf');         // pointe haute
 rect(x-3,gy-2,6,1,'#3ad07a');         // épaule
 rect(x-4,gy-1,8,2,'#2bb866');         // table large
 rect(x-3,gy+1,6,1,'#1f9a52');         // bas large
 rect(x-2,gy+2,4,1,'#16823f');         // base
 rect(x-1,gy+3,2,1,'#0d6630');         // culasse pointe
 // facettes claires (lumière) + éclat scintillant
 rect(x-3,gy-1,2,1,'#9ff0bf');rect(x-1,gy-2,2,1,'#d6ffe6');
 let twk=Math.sin(t*.012)>.6;if(twk){rect(x+1,gy-2,1,1,'#ffffff');rect(x-3,gy+1,1,1,'#ffffff')}
 // liseré sombre droit pour le volume
 rect(x+2,gy,2,2,'#0d6630');
 if(near){let pb=Math.round(Math.sin(t*.01)*1.5);pxText('[E]',x,y-36+pb,'#bff5cf','center',6)}}
function drawProp(p){let x=p.x*T,y=p.y*T,t=performance.now();
 if(p.type==='lightshaft'){
  // FLAQUE DE LUMIÈRE AU SOL en VRAIS PIXELS (pas d'ellipse) : carré lumineux projeté par le trou
  // du plafond, tramé pour un fondu pixel-art. Le rai poussiéreux est dessiné en surcouche (drawLightShafts).
  let ts=t*.001,fl=.82+Math.sin(ts*.7+p.seed)*.1;
  let bx=Math.round(x+T/2-7),by=Math.round(y+T/2-4),px=2; // grille de blocs 2px
  X.save();X.globalCompositeOperation='lighter';
  for(let iy=0;iy<7;iy++)for(let ix=0;ix<7;ix++){
   let dx=ix-3,dy=iy-3,d=Math.abs(dx)+Math.abs(dy); // motif losange (diamant) pixel
   if(d>4)continue;
   let core=d<=1,mid=d<=2;
   X.globalAlpha=(core?.5:mid?.32:.16)*fl;
   X.fillStyle=core?'#fff4d2':mid?'#ffe6a0':'#ffd06a';
   X.fillRect(bx+ix*px,by+iy*px,px,px);
  }
  X.globalAlpha=1;X.restore();
  return}
 if(p.type==='brazier'){let f=Math.sin(t*.012+p.x)*.5+.5;rect(x+8,y+12,8,10,'#4a3a26');rect(x+6,y+10,12,4,'#5a4632');rect(x+9,y+4-f*2,6,8,'#ff7a2e');rect(x+10,y+1-f*3,4,6,'#ffc24a');rect(x+11,y-1-f*3,2,4,'#fff2a8');X.globalAlpha=.18+f*.12;rect(x+2,y-4,20,20,'#ff9a3e');X.globalAlpha=1;return}
 if(p.type==='statue'){rect(x+5,y+2,14,T-2,'#6f6354');rect(x+6,y+4,12,8,'#7d7060');rect(x+8,y+1,8,7,'#8a7d6a');rect(x+9,y+3,2,2,'#2a241c');rect(x+13,y+3,2,2,'#2a241c');rect(x+5,y+12,14,3,'#574d40');rect(x+4,y+T-3,16,3,'#4a4136');return}
 if(p.type==='pillar'){rect(x+5,y,14,T,'#8a7d68');rect(x+5,y,3,T,'#9d9078');rect(x+16,y,3,T,'#6f6354');for(let i=0;i<4;i++)rect(x+5,y+3+i*6,14,1,'#5a4f40');rect(x+3,y+T-4,18,4,'#7d7060');return}
 if(p.type==='urn'){rect(x+7,y+8,10,12,'#9a6a3a');rect(x+6,y+10,12,8,'#a8763f');rect(x+8,y+5,8,4,'#8a5e30');rect(x+9,y+3,6,3,'#9a6a3a');rect(x+9,y+11,6,4,'#6e4824');return}
 if(p.type==='glyph'){let g=Math.sin(t*.004)*.5+.5;rect(x+3,y+3,T-6,T-6,'#3a3226');X.globalAlpha=.4+g*.4;rect(x+7,y+6,2,12,'#ffd24a');rect(x+12,y+6,4,2,'#ffd24a');rect(x+12,y+11,4,2,'#ffd24a');rect(x+12,y+16,4,2,'#ffd24a');X.globalAlpha=1;return}
 if(p.type==='plank'){// PLANCHE du PONT : tablier de bois clouté posé SUR le sol-tuile, au-dessus du gouffre.
  // Ne s'affiche QUE tant que la tuile sous la planche est encore du sol (0) → quand le pont
  // s'effondre (la tuile devient vide=6), la planche disparaît avec lui (lecture « le pont cède »).
  if(!(map[p.y]&&map[p.y][p.x]===0))return;
  rect(x,y+2,T,T-4,'#6b4a2a');           // tablier (planche pleine, bord à bord → pont continu)
  rect(x,y+2,T,2,'#85613a');             // liseré clair en haut (relief)
  rect(x,y+T-4,T,2,'#4a3320');           // ombre en bas
  let grain=p.x%2?'#5a3e23':'#74512f';
  rect(x+2,y+6,T-4,2,grain);rect(x+2,y+T-9,T-4,2,grain); // veines du bois
  // clous aux extrémités (donne le « assemblage » du pont)
  rect(x+2,y+4,2,2,'#3a2a18');rect(x+T-4,y+4,2,2,'#3a2a18');
  rect(x+2,y+T-7,2,2,'#3a2a18');rect(x+T-4,y+T-7,2,2,'#3a2a18');
  // corde/garde-fou fin sur le bord supérieur du tablier (côté haut du couloir)
  if(p.edge)rect(x,y,T,2,'#8a6a3a');
  return}
 if(p.type==='vine'){// LIANE pendante du plafond/mur : tige qui ondule + feuilles
  let len=(p.len||2),sw=Math.sin(t*.002+p.x*1.3)*1.6;
  for(let i=0;i<len*T;i+=3){let ox=Math.sin(t*.002+i*.05+p.x)*((i/(len*T))*sw+ .4);
   rect(x+10+ox,y+i,2,3,i<6?'#3f6b32':'#2f5526')}
  // feuilles le long de la liane
  for(let k=1;k<=len;k++){let ly=y+k*T-6,ox=Math.sin(t*.002+ly*.05+p.x)*1.2;
   rect(x+8+ox,ly,3,2,'#4a7e38');rect(x+12+ox,ly+3,3,2,'#3f6b32')}
  // vrille terminale
  let ey=y+len*T-2,ox=Math.sin(t*.002+ey*.05+p.x)*sw;rect(x+10+ox,ey,2,2,'#5a9444');return}
 if(p.type==='hiero'){// HIÉROGLYPHES gravés sur le mur (motif selon p.g), légèrement lumineux
  let s=p.side||0,bx=s?x+T-7:x+3,g=Math.sin(t*.003+p.x+p.y)*.5+.5;
  rect(bx-1,y+3,6,T-6,'#332b20'); // plaque gravée encastrée
  X.globalAlpha=.55+g*.25;let c='#caa24e';
  let G=p.g||0;
  if(G===0){rect(bx+1,y+5,2,4,c);rect(bx,y+9,4,1,c);rect(bx+1,y+12,2,5,c)} // ankh
  else if(G===1){rect(bx,y+5,4,1,c);rect(bx+1,y+6,2,3,c);rect(bx,y+9,4,1,c);rect(bx,y+13,4,4,c)} // oiseau stylisé
  else if(G===2){rect(bx,y+6,4,2,c);rect(bx+1,y+8,1,8,c);rect(bx,y+15,4,2,c)} // pilier djed
  else if(G===3){rect(bx+1,y+5,1,12,c);rect(bx,y+7,3,1,c);rect(bx,y+11,3,1,c);rect(bx,y+15,3,1,c)} // colonne de signes
  else if(G===4){X.globalAlpha=.5+g*.3;rect(bx,y+6,4,4,c);rect(bx+1,y+10,1,4,c);rect(bx,y+14,4,2,c)} // œil oudjat
  else{rect(bx+1,y+5,1,4,c);rect(bx,y+9,4,4,c);rect(bx+1,y+13,1,4,c)} // scarabée
  X.globalAlpha=1;return}
 if(p.type==='torch'){let f=Math.sin(t*.015+p.x*1.3)*.5+.5;rect(x+10,y+8,4,12,'#4a3a26');rect(x+9,y+3-f*2,6,8,'#ff7a2e');rect(x+10,y+1-f*2,4,5,'#ffc24a');X.globalAlpha=.14+f*.1;rect(x+4,y-2,16,16,'#ff9a3e');X.globalAlpha=1;return}
 if(p.type==='walltorch'){let f=Math.sin(t*.013+p.x*1.7)*.5+.5,f2=Math.sin(t*.031+p.y)*.5+.5;let s=p.side||0;// 0=mur gauche(flamme à droite),1=mur droit
  // support en fer scellé au mur + coupe
  let bx=s?x+14:x+4;rect(bx,y+9,6,3,'#3a2f24');rect(s?x+16:x+6,y+11,2,8,'#2a2218');rect(bx-1,y+7,8,3,'#52443234'.slice(0,7));
  // coupe métallique
  rect(s?x+11:x+9,y+5,4,5,'#4a3c2a');rect(s?x+11:x+9,y+4,4,2,'#5e4e36');
  // flamme animée (haute, lumineuse)
  let fx=s?x+10:x+10;rect(fx,y+0-f*2,4,7,'#ff7a2e');rect(fx,y-2-f*3,4,6,'#ffb43e');rect(fx+1,y-4-f2*3,2,5,'#ffe89a');rect(fx,y+2,4,3,'#ff5a1e');
  // braises tombantes
  if(f>.7){rect(fx+1,y+6+((t*.02)%6),1,1,'#ff9a3e')}
  // halo doux local (le vrai éclairage est géré dans drawRuinsDarkness)
  X.globalAlpha=.16+f*.12;rect(x+1,y-5,T-2,T,'#ffae4a');X.globalAlpha=1;return}
 if(p.type==='alcove'){X.globalAlpha=.5;rect(x+4,y+4,T-8,T-8,'#1a1610');X.globalAlpha=1;X.strokeStyle='#6a5a3a';X.lineWidth=1;X.strokeRect(x+3,y+3,T-6,T-6);X.lineWidth=4;pxText('↧',x+T/2,y+T/2+4,'rgba(255,210,90,.7)','center',8);return}
 if(p.type==='rune'){let f=Math.sin(t*.012+p.x)*.5+.5;rect(x+5,y+14,14,7,'#4a3a26');rect(x+6,y+16,12,5,'#5a4632');rect(x+8,y+12,8,4,'#3a2e1c');
  if(p.lit){rect(x+9,y+5-f*2,6,9,'#ff8a2e');rect(x+10,y+2-f*3,4,7,'#ffd24a');rect(x+11,y-f*3,2,5,'#fff2a8');X.globalAlpha=.2+f*.15;rect(x+2,y-4,20,22,'#ffae4a');X.globalAlpha=1}
  else{rect(x+9,y+9,6,5,'#2a241c');X.strokeStyle='rgba(255,210,90,.5)';X.lineWidth=1;X.strokeRect(x+7,y+7,10,9);X.lineWidth=4}
  // numéro de la rune (aide visuelle d'ordre)
  pxText(String((p.idx||0)+1),x+T/2,y+T-2,p.lit?'#fff2a8':'rgba(220,200,160,.6)','center',7);return}
 if(p.type==='debris'){let v=p.v||0;
  if(v===0){rect(x+5,y+13,6,4,'#5a4f3c');rect(x+12,y+15,5,3,'#4a4030');rect(x+8,y+10,3,3,'#6a5e48')} // gravats
  else if(v===1){rect(x+6,y+14,9,2,'#cdc3ad');rect(x+7,y+11,2,5,'#bbb097');rect(x+11,y+11,2,5,'#bbb097');rect(x+5,y+10,3,2,'#d8cfb8')} // ossements
  else if(v===2){X.strokeStyle='rgba(20,16,10,.5)';X.lineWidth=1;X.beginPath();X.moveTo(x+4,y+16);X.lineTo(x+10,y+9);X.lineTo(x+15,y+15);X.lineTo(x+20,y+8);X.stroke();X.lineWidth=4} // fissure
  else{rect(x+9,y+12,2,7,'#3a5a2e');rect(x+8,y+9,4,3,'#4a6a36');rect(x+13,y+14,2,5,'#3a5a2e');rect(x+12,y+12,3,2,'#4a6a36')} // racines/mousse
  return}
 if(p.type==='floorcrack'){// dalle fissurée gravée au sol (sombre, non bloquant)
  let v=p.v||0;X.strokeStyle='rgba(8,6,4,.55)';X.lineWidth=1;X.beginPath();
  if(v===0){X.moveTo(x+3,y+18);X.lineTo(x+9,y+12);X.lineTo(x+13,y+17);X.lineTo(x+20,y+10)}
  else if(v===1){X.moveTo(x+5,y+5);X.lineTo(x+11,y+13);X.lineTo(x+9,y+20);X.moveTo(x+11,y+13);X.lineTo(x+19,y+15)}
  else{X.moveTo(x+4,y+11);X.lineTo(x+20,y+13);X.moveTo(x+12,y+5);X.lineTo(x+11,y+19)}
  X.stroke();X.lineWidth=4;rect(x+9,y+11,2,2,'rgba(0,0,0,.4)');return}
 if(p.type==='bones'){// petit tas d'ossements (crâne + os croisés)
  let v=p.v||0;rect(x+8,y+12,7,5,'#d8cfb8');rect(x+9,y+13,2,2,'#3a2e1c');rect(x+12,y+13,2,2,'#3a2e1c');rect(x+10,y+16,3,2,'#cdc3ad');
  if(v>0){X.save();X.translate(x+11,y+9);X.rotate(.5);rect(-7,-1,14,2,'#bbb097');rect(-7,-2,2,4,'#cdc3ad');rect(5,-2,2,4,'#cdc3ad');X.restore()}
  if(v>1){rect(x+3,y+17,6,2,'#bbb097')}return}
 if(p.type==='puddle'){// flaque d'eau stagnante sombre (reflet faible animé)
  let a=.5+Math.sin(t*.002+p.x)*.12;X.globalAlpha=.55;rect(x+4,y+13,T-8,5,'#10202a');X.globalAlpha=a*.4;rect(x+6,y+14,T-13,2,'#2a4a5a');X.globalAlpha=1;return}
 if(p.type==='icepillar'){rect(x+5,y+2,14,T-2,'#bfe6f0');rect(x+6,y+4,5,T-6,'#e4f4fa');rect(x+13,y+5,4,T-8,'#9fcfe0');rect(x+7,y+3,3,4,'#ffffff');return}
 if(p.type==='emitter'){let g=Math.sin(t*.01)*.5+.5;rect(x+4,y+6,T-8,T-12,'#5a4632');rect(x+T-9,y+9,5,6,'#ffd24a');X.globalAlpha=.3+g*.3;rect(x+T-7,y+10,3,4,'#fff2a8');X.globalAlpha=1;return}
 if(p.type==='sensor'){let on=p.lit;rect(x+5,y+6,T-10,T-12,'#3a3226');rect(x+8,y+9,T-16,6,on?'#9af0ff':'#3a4a4a');if(on){X.globalAlpha=.4;rect(x+3,y+3,T-6,T-6,'#9af0ff');X.globalAlpha=1}return}
 if(p.type==='simonpad'){let l=p.lit||0;let base=['#c85a5a','#5ac85a','#5a7ac8','#c8c85a'][p.id%4];rect(x+3,y+3,T-6,T-6,'#2a241c');rect(x+5,y+5,T-10,T-10,base);if(l>0){X.globalAlpha=l;rect(x+4,y+4,T-8,T-8,'#ffffff');X.globalAlpha=1}return}}
// Dalle qui va s'effondrer : tremble pendant le délai.
function drawCollapsing(p){if(p.done)return;let sh=Math.sin(performance.now()*.05)*2,x=p.x*T+sh,y=p.y*T;rect(x+2,y+2,T-4,T-4,'#5a4a32');for(let i=0;i<2;i++)rect(x+5+i*8,y+6,2,T-12,'#3a2e1c')}
// Pic rétractable : monte/descend selon la phase.
function drawSpike(m){let x=m.x*T,y=m.y*T,h=m.out?T-6:4;rect(x+3,y+T-4,T-6,3,'#2a2018');for(let i=0;i<3;i++){let px=x+5+i*6;rect(px,y+T-4-h,4,h,m.out?'#c8c0b0':'#6a625a');rect(px+1,y+T-4-h,2,Math.max(2,h-2),'#e8e2d4')}}
// Lame pendulaire / coulissante.
function drawBlade(m){let cx,cy;if(m.horiz){cx=(m.px!=null?m.px:m.x0)+.5;cy=m.y+.5}else{cx=m.x0+.5;cy=(m.py!=null?m.py:(m.y0+m.y1)/2)+.5}let x=cx*T,y=cy*T;rect(x-2,y-11,4,22,'#9aa2ac');rect(x-9,y-3,18,6,'#cdd4dc');rect(x-9,y-1,18,2,'#eef2f6');rect(x-1,y-1,2,2,'#5a626c')}
// Rocher (sphère de pierre qui tourne).
function drawBoulder(b){let x=b.x*T,y=b.y*T,r=b.chase?15:11;rect(x-r,y+r-2,r*2,4,'rgba(10,14,8,.4)');X.fillStyle='#6a5e4a';X.beginPath();X.arc(x,y,r,0,Math.PI*2);X.fill();X.fillStyle='#82745c';X.beginPath();X.arc(x-2,y-2,r-3,0,Math.PI*2);X.fill();
 let s=b.spin;for(let i=0;i<(b.chase?5:3);i++){let a=s+i*2.1;rect(x+Math.cos(a)*(r*.5)-1,y+Math.sin(a)*(r*.5)-1,3,3,'#4a4030')}
 // poussière soulevée à l'arrière du rocher lancé (sens inverse de la course).
 if(b.active&&b.chase&&Math.random()<.6){let d=-(b.dir||1);particles.push({x:x+d*r,y:y+r-3,vx:d*(.3+Math.random()),vy:-Math.random()*.6,life:.4,color:'#9a8a6a',size:2+rng(2)})}}
// Bloc poussable de pierre.
function drawBlock(b){let x=b.x*T,y=b.y*T;rect(x+1,y+1,T-2,T-2,'#7a6a4e');rect(x+3,y+3,T-6,T-6,'#8e7c5c');rect(x+3,y+3,T-6,2,'#a89878');for(let i=0;i<2;i++)rect(x+4,y+8+i*6,T-8,1,'#5a4c34')}
// PORTAIL : anneau tourbillonnant coloré (téléporteur).
function drawPortal(p){let x=p.x*T+T/2,y=p.y*T+T/2,t=performance.now()*.004;X.save();X.globalAlpha=p.cd>0?.4:.85;
 for(let i=0;i<3;i++){let r=4+i*3,a=t+i;X.strokeStyle=p.col;X.lineWidth=2;X.beginPath();X.arc(x,y,r,a,a+Math.PI*1.4);X.stroke()}
 X.globalAlpha=.3;X.fillStyle=p.col;X.beginPath();X.arc(x,y,3,0,Math.PI*2);X.fill();X.restore();X.lineWidth=4}
// RAYON du puzzle de miroirs (trajet calculé par traceBeam, stocké dans r.beamPath).
function drawBeam(){let r=curRoom;if(!r||r.kind!=='mirror'||!r.beamPath)return;X.save();X.globalAlpha=.7;X.strokeStyle='#ffe35b';X.lineWidth=2;X.beginPath();
 let ex=r.emit.x*T+T/2,ey=r.emit.y*T+T/2;X.moveTo(ex,ey);r.beamPath.forEach(([bx,by])=>X.lineTo(bx*T+T/2,by*T+T/2));X.stroke();X.restore();X.lineWidth=4}
// MIROIR orientable (lame diagonale '/' ou '\').
function drawMirror(m){let x=m.x*T,y=m.y*T;rect(x+4,y+4,T-8,T-8,'#2a3038');X.save();X.strokeStyle='#cfe6f0';X.lineWidth=3;X.beginPath();
 if(m.o===0){X.moveTo(x+5,y+T-5);X.lineTo(x+T-5,y+5)}else{X.moveTo(x+5,y+5);X.lineTo(x+T-5,y+T-5)}X.stroke();X.restore();X.lineWidth=4}
// LEVIER : poignée inclinée selon l'état (on/off).
function drawLever(l){let x=l.x*T,y=l.y*T;rect(x+8,y+13,8,7,'#4a3a26');rect(x+9,y+15,6,5,'#5a4632');let hx=l.on?x+15:x+9;rect(hx,y+5,3,10,'#8a8a92');rect(hx-1,y+4,5,4,l.on?'#9af0ff':'#c85a5a')}
// PRESSE (crusher) : pilier qui descend par à-coups.
function drawCrusher(c){let x=c.x*T,topY=c.top*T,h=(1+Math.round(c.down))*T;rect(x+2,topY-T,T-4,T,'#5a4f40');rect(x+1,topY-T+2,T-2,h,'#7a6e58');rect(x+3,topY-T+2,T-6,3,'#8e8068');rect(x+1,topY-T+h-3,T-2,3,'#3a3226');for(let i=0;i<3;i++)rect(x+4+i*5,topY-T+6,2,h-9,'#5a4f40')}
// MUR DE PICS QUI SE REFERME : bloc de pierre hérissé de pointes, avançant sur son axe.
function drawClosingWall(w){let t=performance.now();
 if(w.axis==='h'){
  let px=Math.round(w.pos)*T,y0=w.y0*T,hh=(w.y1-w.y0+1)*T;
  rect(px,y0,T,hh,'#4a4036');rect(px+(w.side<0?T-4:0),y0,4,hh,'#2c241c'); // base + face sombre
  rect(px+2,y0+2,T-4,hh-4,'#5e5042');
  // pointes côté centre (vers -w.side)
  let tipX=w.side<0?px+T:px;
  for(let y=y0+4;y<y0+hh-2;y+=8){let s=w.side<0?1:-1;let q=2+Math.sin(t*.01+y)*1;
   rect(tipX,y,s*5,2,'#cfd6dd');rect(tipX+s*5,y+1,s*3,1,'#eef3f7')}
 }else{
  let py=Math.round(w.pos)*T,x0=w.x0*T,ww=(w.x1-w.x0+1)*T;
  rect(x0,py,ww,T,'#4a4036');rect(x0,py+(w.side<0?T-4:0),ww,4,'#2c241c');
  rect(x0+2,py+2,ww-4,T-4,'#5e5042');
  let tipY=w.side<0?py+T:py;
  for(let x=x0+4;x<x0+ww-2;x+=8){let s=w.side<0?1:-1;
   rect(x,tipY,2,s*5,'#cfd6dd');rect(x+1,tipY+s*5,1,s*3,'#eef3f7')}
 }}
// Toile d'araignée dans un coin (rayons + arcs, semi-transparente).
function drawCobweb(w){let ox=w.x*T+(w.f>0?0:T),oy=w.y*T,R=T*w.sz,f=w.f;X.save();X.globalAlpha=.5;X.strokeStyle='#d8e0e6';X.lineWidth=1;
 for(let i=0;i<=4;i++){let a=(i/4)*(Math.PI/2);X.beginPath();X.moveTo(ox,oy);X.lineTo(ox+Math.cos(a)*R*f,oy+Math.sin(a)*R);X.stroke()}
 for(let r=.35;r<=1;r+=.32){X.beginPath();for(let i=0;i<=4;i++){let a=(i/4)*(Math.PI/2),px=ox+Math.cos(a)*R*r*f,py=oy+Math.sin(a)*R*r;i?X.lineTo(px,py):X.moveTo(px,py)}X.stroke()}
 X.restore();X.lineWidth=4}
// Aperçu live du perso (grand canvas) = base choisie + surcharges du profil. Animé : MARCHE + ROTATION.
let charPrevRAF=0,charPrevT=0,charPrevDir=0,charPrevWalk=false; // dir 0=face,1=droite,2=dos,3=gauche
function renderCharPreview(){let cv=document.querySelector('#charPreviewBig');if(!cv)return;let look=activeLook(getProfile().base);drawCharacterPreview(cv,getProfile().base,look,0,charPrevDir,0)}
// Tourne l'aperçu (boutons de rotation) ; relance l'anim de marche.
function rotatePreview(delta){charPrevDir=((charPrevDir+delta)%4+4)%4;sound(440,.05,'square',.04);}
// Bascule marche/pose statique au clic sur l'aperçu.
function togglePreviewWalk(){charPrevWalk=!charPrevWalk;sound(charPrevWalk?560:340,.05,'square',.04)}
// Boucle d'aperçu animé : marche (4 frames) si activée, sinon respiration douce.
function startCharPreviewAnim(){
 cancelAnimationFrame(charPrevRAF);
 let loop=()=>{
  if(state!=='characters'){charPrevRAF=0;return}
  let cv=document.querySelector('#charPreviewBig');
  if(cv){charPrevT+=.016;let look=activeLook(getProfile().base);
   if(charPrevWalk){
    // marche FLUIDE : phase continue (cadence régulière), bras/jambes en opposition + rebond
    drawCharacterPreview(cv,getProfile().base,look,0,charPrevDir,0,{walking:true,phase:charPrevT*7.5});
   }else{
    // pose statique : légère respiration (idle animé)
    drawCharacterPreview(cv,getProfile().base,look,0,charPrevDir,0,{walking:false,idle:charPrevT*2.2});
   }}
  charPrevRAF=requestAnimationFrame(loop);
 };
 charPrevRAF=requestAnimationFrame(loop);
}
// Petite pastille de couleur cliquable (tenue/peau).
function makeSwatch(color,selected,onClick){let s=document.createElement('button');s.className='swatch'+(selected?' sel':'');s.style.background=color;s.type='button';s.onclick=onClick;return s}
// Change le perso de base via les flèches (cycle sur les 10).
function cycleCharacter(dir){
 let n=CHARACTERS.length;selectedCharacter=((selectedCharacter+dir)%n+n)%n;
 localStorage.setItem('temple-character',selectedCharacter);
 let p=getProfile();p.base=selectedCharacter;saveProfile(p);
 sound(420,.06,'square',.04);showCharacters();
}
// Tirage 100% aléatoire : base + couleurs tenue/peau + coiffe (parmi celles débloquées).
function randomizeCharacter(){
 let p=getProfile();
 selectedCharacter=rng(CHARACTERS.length);p.base=selectedCharacter;localStorage.setItem('temple-character',selectedCharacter);
 p.shirt=rng(SHIRT_PALETTE.length);
 p.skin=rng(SKIN_PALETTE.length);
 let owned=HAT_OPTIONS.filter(o=>isUnlocked(o.id));p.hat=owned[rng(owned.length)].id;
 // vêtements + couleurs + cheveux + visage (parmi débloqués)
 p.top=TOP_OPTIONS.filter(o=>isUnlocked(o.id))[0]?TOP_OPTIONS.filter(o=>isUnlocked(o.id))[rng(TOP_OPTIONS.filter(o=>isUnlocked(o.id)).length)].id:'tshirt';
 p.pants=PANTS_OPTIONS[rng(PANTS_OPTIONS.length)].id;
 p.shoes=SHOE_OPTIONS[rng(SHOE_OPTIONS.length)].id;
 p.topColor=rng(CLOTH_PALETTE.length);p.pantsColor=rng(CLOTH_PALETTE.length);p.shoeColor=rng(CLOTH_PALETTE.length);p.hatColor=-1;
 p.hair=HAIR_OPTIONS[rng(HAIR_OPTIONS.length)].id;p.hairColor=rng(HAIR_PALETTE.length);
 p.face=FACE_OPTIONS[rng(FACE_OPTIONS.length)].id;
 saveProfile(p);sound(660,.08,'square',.05);sound(880,.08,'square',.03);showCharacters();
}
function showCharacters(){
 let prof=getProfile();
 if(prof.base!==selectedCharacter){prof.base=selectedCharacter;saveProfile(prof)}
 let cur=CHARACTERS[prof.base]||CHARACTERS[0];
 // ── Nom + description du perso de base ──
 let nm=document.querySelector('#charBaseName');if(nm)nm.textContent=noAcc(cur.n);
 let ds=document.querySelector('#charBaseDesc');if(ds)ds.textContent=noAcc(cur.d);
 // ── Vignettes des 10 persos : aperçu cliquable (bien plus lisible que les pastilles) ──
 let dots=document.querySelector('#charDots');
 if(dots){dots.innerHTML='';CHARACTERS.forEach((c,i)=>{
   let d=document.createElement('button');d.type='button';d.className='charThumb'+(i===prof.base?' on':'');d.title=noAcc(c.n);
   let cv=document.createElement('canvas');cv.width=36;cv.height=44;cv.style.width='36px';cv.style.height='44px';cv.style.imageRendering='pixelated';
   let g=cv.getContext('2d');g.imageSmoothingEnabled=false;
   let look=baseLook(i);// aperçu du perso de base (sa tenue d'origine), pas le profil en cours
   let scl=.78,cx=18,cy=24;
   let put=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(cx+x*scl),Math.round(cy+y*scl),Math.ceil(w*scl),Math.ceil(h*scl))};
   drawHeroBody(0,0,look,charStyle(i),{put:put,back:false,side:false,right:false,walking:false,running:false,whip:false});
   d.appendChild(cv);
   d.onclick=()=>{selectedCharacter=i;localStorage.setItem('temple-character',i);let p=getProfile();p.base=i;saveProfile(p);showCharacters()};
   dots.appendChild(d)})}
 // ── Flèches L/R + Aléatoire ──
 let prev=document.querySelector('#charPrev');if(prev)prev.onclick=()=>cycleCharacter(-1);
 let next=document.querySelector('#charNext');if(next)next.onclick=()=>cycleCharacter(1);
 let rnd=document.querySelector('#charRandom');if(rnd)rnd.onclick=randomizeCharacter;
 // ── Nom ──
 let nameIn=document.querySelector('#charName');
 if(nameIn){nameIn.value=prof.name||'';nameIn.oninput=()=>{let p=getProfile();p.name=nameIn.value.slice(0,12);saveProfile(p)}}
 // ── Panneau de personnalisation PAGINÉ (flèches ◀▶ par catégorie) ──
 renderCustomPage();
 // ── Rotation + marche de l'aperçu ──
 let rl=document.querySelector('#charRotL');if(rl)rl.onclick=()=>rotatePreview(-1);
 let rr=document.querySelector('#charRotR');if(rr)rr.onclick=()=>rotatePreview(1);
 let pw=document.querySelector('#charPreviewBig');if(pw){pw.style.cursor='pointer';pw.onclick=togglePreviewWalk}
 renderCharPreview();
 show('characters');
 startCharPreviewAnim();
}
// Construit une rangée de cosmétiques cliquables (coiffe/haut/pantalon/chaussures). field = clé du profil.
// Gère la sélection, l'achat premium (rubis), l'aperçu de couleur, et re-render à chaque clic.
function buildCosmeticRow(sel,list,current,field){
 let row=(typeof sel==='string')?document.querySelector(sel):sel;if(!row)return;row.innerHTML='';
 list.forEach(opt=>{
  let owned=isUnlocked(opt.id),isSel=current===opt.id;
  let h=document.createElement('button');h.type='button';h.className='hatOpt'+(isSel?' sel':'')+(owned?'':' premium');
  // pastille de couleur représentative : maillot CDM → couleur principale ; "null" → gris neutre
  h.style.background=(opt.type==='none')?'#2a3a2a':(opt.c||'#7a6a52');
  // bande CDM (aperçu rapide du maillot)
  if(opt.cdm){h.style.background='linear-gradient(90deg,'+opt.cdm.a+' 0 22%,'+opt.c+' 22% 78%,'+opt.cdm.a+' 78% 100%)'}
  let lbl=document.createElement('small');lbl.textContent=noAcc(opt.label);h.appendChild(lbl);
  if(!owned){let pc=document.createElement('span');pc.className='hatCost';pc.innerHTML='<span class="rubisGem"></span>'+opt.cost;h.appendChild(pc)}
  h.onclick=()=>{
   let p=getProfile();
   if(isUnlocked(opt.id)){p[field]=opt.id;saveProfile(p);showCharacters()}
   else{if(unlockCosmetic(opt.id)){p[field]=opt.id;saveProfile(p);sound(720,.12,'square',.05);sound(990,.12,'square',.03);showCharacters()}
    else{h.classList.add('shakeNode');setTimeout(()=>h.classList.remove('shakeNode'),400);sound(160,.12,'square',.05)}}
  };
  row.appendChild(h);
 });
}
// ── PERSONNALISATION PAGINÉE ────────────────────────────────────────────────────────────────────
// Catégories affichées une à la fois dans #customPage ; navigation par flèches ◀▶ (custPrev/custNext).
let CUSTOM_PAGES=['HAUT','PANTALON','CHAUSSURES','COIFFE','COIFFURE','VISAGE','PEAU'];
let customPageIdx=0;
function cycleCustomPage(dir){customPageIdx=(customPageIdx+dir+CUSTOM_PAGES.length)%CUSTOM_PAGES.length;renderCustomPage()}
// Construit une rangée d'étiquette + contenu dans le conteneur de page.
function custGroup(page,label){let g=document.createElement('div');g.className='customGroup';
 let l=document.createElement('div');l.className='customLabel';l.textContent=label;g.appendChild(l);
 let r=document.createElement('div');r.className='swatchRow';g.appendChild(r);page.appendChild(g);return r}
// Rangée de couleurs (palette) avec un 1er bouton "auto" (=couleur d'origine). field = clé profil (index).
function buildColorRow(row,palette,curIdx,field,autoColor){
 row.appendChild(makeSwatch(autoColor,curIdx<0,()=>{let p=getProfile();p[field]=-1;saveProfile(p);renderCustomPage()}));
 palette.forEach((col,idx)=>row.appendChild(makeSwatch(col,curIdx===idx,()=>{let p=getProfile();p[field]=idx;saveProfile(p);renderCustomPage()})));
}
// Rangée d'options de forme sans achat premium (cheveux/visage) — sélection simple.
function buildShapeRow(row,list,current,field){
 list.forEach(opt=>{let h=document.createElement('button');h.type='button';h.className='hatOpt'+(current===opt.id?' sel':'');
  h.style.background='#3a4a3a';let lbl=document.createElement('small');lbl.textContent=noAcc(opt.label);h.appendChild(lbl);
  h.onclick=()=>{let p=getProfile();p[field]=opt.id;saveProfile(p);renderCustomPage()};row.appendChild(h)});
}
function renderCustomPage(){
 let prof=getProfile(),cur=CHARACTERS[prof.base]||CHARACTERS[0];
 let page=document.querySelector('#customPage');if(!page)return;page.innerHTML='';
 let title=document.querySelector('#custTitle');if(title)title.textContent=CUSTOM_PAGES[customPageIdx];
 // points de pagination
 let dots=document.querySelector('#custDots');
 if(dots){dots.innerHTML='';CUSTOM_PAGES.forEach((_,i)=>{let d=document.createElement('span');d.className='custDot'+(i===customPageIdx?' on':'');dots.appendChild(d)})}
 let key=CUSTOM_PAGES[customPageIdx];
 if(key==='HAUT'){
  buildCosmeticRow(custGroup(page,'HAUT'),TOP_OPTIONS,prof.top,'top');
  // couleur du haut : ignorée pour les maillots CDM (couleurs imposées)
  let topOpt=findCosmetic(TOP_OPTIONS,prof.top);
  if(topOpt.type!=='jersey')buildColorRow(custGroup(page,'COULEUR DU HAUT'),CLOTH_PALETTE,prof.topColor,'topColor',topOpt.c||cur.shirt);
 }else if(key==='PANTALON'){
  buildCosmeticRow(custGroup(page,'PANTALON'),PANTS_OPTIONS,prof.pants,'pants');
  let po=findCosmetic(PANTS_OPTIONS,prof.pants);
  buildColorRow(custGroup(page,'COULEUR DU PANTALON'),CLOTH_PALETTE,prof.pantsColor,'pantsColor',po.c);
 }else if(key==='CHAUSSURES'){
  buildCosmeticRow(custGroup(page,'CHAUSSURES'),SHOE_OPTIONS,prof.shoes,'shoes');
  let so=findCosmetic(SHOE_OPTIONS,prof.shoes);
  buildColorRow(custGroup(page,'COULEUR DES CHAUSSURES'),CLOTH_PALETTE,prof.shoeColor,'shoeColor',so.c);
 }else if(key==='COIFFE'){
  buildCosmeticRow(custGroup(page,'COIFFE / ACCESSOIRE'),HAT_OPTIONS,prof.hat,'hat');
  let ho=HAT_OPTIONS.find(o=>o.id===prof.hat);
  if(ho&&ho.type!=='none'&&ho.type!=='base')buildColorRow(custGroup(page,'COULEUR DE LA COIFFE'),CLOTH_PALETTE,prof.hatColor,'hatColor',ho.c);
 }else if(key==='COIFFURE'){
  buildShapeRow(custGroup(page,'CHEVEUX'),HAIR_OPTIONS,prof.hair,'hair');
  let row=custGroup(page,'COULEUR DES CHEVEUX');
  HAIR_PALETTE.forEach((col,idx)=>row.appendChild(makeSwatch(col,prof.hairColor===idx,()=>{let p=getProfile();p.hairColor=idx;saveProfile(p);renderCustomPage()})));
 }else if(key==='VISAGE'){
  buildShapeRow(custGroup(page,'EXPRESSION'),FACE_OPTIONS,prof.face,'face');
 }else if(key==='PEAU'){
  let row=custGroup(page,'COULEUR DE PEAU');
  row.appendChild(makeSwatch(cur.skin,prof.skin<0,()=>{let p=getProfile();p.skin=-1;saveProfile(p);renderCustomPage()}));
  SKIN_PALETTE.forEach((col,idx)=>row.appendChild(makeSwatch(col,prof.skin===idx,()=>{let p=getProfile();p.skin=idx;saveProfile(p);renderCustomPage()})));
  // teinte de tenue d'identité (palette historique) — reste accessible ici
  let r2=custGroup(page,'TEINTE DE TENUE');
  r2.appendChild(makeSwatch(cur.shirt,prof.shirt<0,()=>{let p=getProfile();p.shirt=-1;saveProfile(p);renderCustomPage()}));
  SHIRT_PALETTE.forEach((col,idx)=>r2.appendChild(makeSwatch(col,prof.shirt===idx,()=>{let p=getProfile();p.shirt=idx;saveProfile(p);renderCustomPage()})));
 }
 // flèches de navigation
 let pv=document.querySelector('#custPrev');if(pv)pv.onclick=()=>cycleCustomPage(-1);
 let nx=document.querySelector('#custNext');if(nx)nx.onclick=()=>cycleCustomPage(1);
 renderCharPreview();
}
// Assombrit/éclaircit une couleur hex (#rrggbb) de f∈[-1..1] : ombrage des vêtements sans table.
function shade(hex,f){if(typeof hex!=='string'||hex[0]!=='#'||hex.length<7)return hex;let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);let m=v=>{v=Math.round(f<0?v*(1+f):v+(255-v)*f);return Math.max(0,Math.min(255,v))};let h=v=>m(v).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b)}
// ── SPRITE HÉROS UNIFIÉ (aperçu + en jeu) ───────────────────────────────────────────────────────
// Dessine le héros centré sur (ox,oy) [au niveau des pieds] avec une fonction put(x,y,w,h,c) plotant
// un rectangle en coordonnées absolues. opts={dir(0=face,1=droite,2=dos,3=gauche),frame(0-3 marche),
// look(activeLook), scale, lift(décalage vertical respiration en px monde)}. Les vêtements (haut/
// pantalon/chaussures) sont des FORMES distinctes ; les maillots CDM ont leurs propres couleurs.
function drawHeroSprite(put,ox,oy,opts){
 let o=opts||{},look=o.look||{},dir=o.dir||0,frame=o.frame||0,s=o.scale||1,lift=o.lift||0;
 let skin=look.skin||'#e0a56b',skinD=shade(skin,-.22);
 let topC=look.topColor||look.shirt||'#b04a3a',topD=shade(topC,-.22),topL=shade(topC,.18);
 let topType=look.top||'tshirt',cdm=look.topCdm;
 let pantsC=look.pantsColor||'#3b302c',pantsD=shade(pantsC,-.25);
 let shoeC=look.shoeColor||'#3a2c1e',shoeD=shade(shoeC,-.25),shoeType=look.shoes||'boots';
 let hatC=look.hat||'#5a3e23',hatD=shade(hatC,-.25),hatType=look.hatType||'fedora';
 let back=dir===2,side=dir===1||dir===3,right=dir===1;
 // p() : plot dans le repère sprite (x à droite, y vers le bas, origine = pieds), unité = px ×scale.
 let p=(x,y,w,h,c)=>{put(ox+x*s,oy+(y+lift)*s,Math.max(1,w*s),Math.max(1,h*s),c)};
 // ── ANIMATION : phase CONTINUE (radians) si fournie, sinon dérivée du frame discret (aperçu). ──
 // walking = en mouvement, run = course (cycle plus ample et rapide), idle = respiration douce.
 let walking=o.walking!==undefined?o.walking:(frame!==0),run=!!o.run;
 let ph=(o.phase!=null)?o.phase:(frame*Math.PI/2);     // phase du cycle de marche
 let amp=run?1.5:1;                                     // amplitude (course = plus ample)
 // cycle de jambes : sinus → une jambe avance pendant que l'autre recule (opposition de phase)
 let swingL=walking?Math.sin(ph)*3.1*amp:0;            // pas jambe gauche (avant/arrière)
 let swingR=walking?Math.sin(ph+Math.PI)*3.1*amp:0;    // pas jambe droite (opposé)
 let liftL=walking?Math.max(0,Math.sin(ph))*2.4*amp:0; // lever du pied gauche (hauteur)
 let liftR=walking?Math.max(0,Math.sin(ph+Math.PI))*2.4*amp:0;
 let armSwL=walking?Math.sin(ph+Math.PI)*2.6*amp:0;    // bras opposés aux jambes
 let armSwR=walking?Math.sin(ph)*2.6*amp:0;
 // rebond vertical (deux rebonds par cycle) + respiration douce à l'arrêt (idle)
 let bob=walking?-(Math.abs(Math.sin(ph))*(run?2.2:1.4)):(Math.sin((o.idle||0))*0.8-0.4);
 let lean=run?(right?1:side&&!right?-1:0)*1.5:0;        // inclinaison en course (sens du déplacement)
 // ── OMBRE AU SOL (se resserre quand le perso saute/rebondit) ──
 let shW=24-(walking?Math.abs(Math.sin(ph))*4:0);
 put(ox-shW/2*s,oy-1*s,shW*s,4*s,'rgba(8,16,10,.32)');
 // ── JAMBES + CHAUSSURES ──
 let legY=-15,legH=12;
 let drawLeg=(lx,sw,lift2,boot)=>{
  let yy=legY+bob-lift2;                                // la jambe levée monte
  p(lx+sw*.4,yy,5,legH,pantsC);p(lx+sw*.4,yy,5,2,shade(pantsC,.12)); // cuisse/jambe (décalée par le pas)
  p(lx+sw*.4,yy+legH-1,5,1,pantsD);
  // chaussure (suit le pas, se soulève avec lift2)
  let sy=legY+legH+bob-1-lift2,sx=lx+sw;
  if(shoeType==='boots'){p(sx-1,sy,7,4,shoeC);p(sx-1,sy+3,7,1,shoeD)}
  else if(shoeType==='sneakers'){p(sx-1,sy,7,3,shoeC);p(sx-1,sy+2,7,1,shoeD);p(sx-1,sy+1,7,1,shade(shoeC,.25))}
  else{p(sx,sy,5,2,shoeC);p(sx-1,sy+1,7,1,shoeD)} // sandales : plates
 };
 // décalage des jambes selon la marche (une avance, l'autre recule), avec lever de pied
 drawLeg(-5+lean,swingL,liftL);
 drawLeg(1+lean,swingR,liftR);
 // jupe : recouvre le haut des jambes
 if(look.pants==='skirt'){p(-7,legY-1+bob,15,7,pantsC);p(-7,legY+5+bob,15,1,pantsD)}
 // short : raccourcit visuellement (couvre seulement le haut)
 if(look.pants==='shorts'){p(-6,legY-1+bob,12,5,pantsC)}
 // cargo : poches
 if(look.pants==='cargo'){p(-7,legY+3+bob,3,4,pantsD);p(5,legY+3+bob,3,4,pantsD)}
 // ── TORSE (forme du HAUT) — décalé par l'inclinaison de course (lean) ──
 let tY=-30,tH=16,tW=18,tX=-9+lean;
 // contour sombre
 p(tX-1,tY-1+bob,tW+2,tH+2,shade(topC,-.4));
 if(topType==='jacket'){
  p(tX,tY+bob,tW,tH,topC);p(tX,tY+bob,tW,3,topL);
  p(-1,tY+1+bob,2,tH-1,topD); // fermeture éclair centrale
  p(tX,tY+bob,3,tH,topD);p(tX+tW-3,tY+bob,3,tH,topD); // revers
 }else if(topType==='tunic'){
  p(tX,tY+bob,tW,tH+4,topC);p(tX,tY+bob,tW,2,topL); // plus longue
  p(-5,tY+2+bob,10,2,shade(topC,.2)); // encolure
 }else if(topType==='hoodie'){
  p(tX,tY+bob,tW,tH,topC);p(tX,tY+bob,tW,3,topL);
  if(!back)p(-4,tY+tH-3+bob,8,4,topD); // poche kangourou
  p(-5,tY-1+bob,10,3,shade(topC,.15)); // capuche/col
 }else if(topType==='coat'){
  p(tX,tY+bob,tW,tH+5,topC);p(-1,tY+bob,2,tH+5,shade(topC,-.12));
  p(tX+2,tY+3+bob,2,2,'#46768e');p(tX+tW-4,tY+3+bob,2,2,'#46768e'); // boutons
 }else if(topType==='jersey'){
  // MAILLOT CDM : couleur principale + accents (cdm.a) + bande (cdm.b) + numéro
  p(tX,tY+bob,tW,tH,topC);p(tX,tY+bob,tW,3,shade(topC,.18));
  if(cdm){
   p(tX,tY+bob,3,tH,cdm.a);p(tX+tW-3,tY+bob,3,tH,cdm.a); // bandes latérales
   p(-6,tY+bob,12,2,cdm.b);                              // col
   if(!back){p(-1,tY+5+bob,3,5,cdm.b);}                  // "numéro" stylisé
  }
 }else{ // tshirt
  p(tX,tY+bob,tW,tH,topC);p(tX,tY+bob,tW,3,topL);
  p(-5,tY+bob,10,2,topD); // encolure
 }
 // ── BRAS (peau + manche courte de la couleur du haut) — balancement opposé aux jambes ──
 let armH=11;
 let drawArm=(ax,sw,front)=>{
  p(ax,tY+1+sw+bob,4,4,topC);          // manche (suit le balancement ; ax déjà incliné via tX)
  p(ax,tY+5+sw+bob,4,armH-4,skin);     // avant-bras peau
  p(ax,tY+armH+sw+bob,4,1,skinD);
 };
 drawArm(tX-4,armSwL,!right);
 drawArm(tX+tW,armSwR,right);
 // ── TÊTE — suit l'inclinaison de course ──
 let hY=-44,hH=12,hW=14,hX=-7+lean;
 if(back){p(hX,hY+bob,hW,hH,shade(skin,-.1));p(hX,hY+bob,hW,4,hatC)} // dos : nuque + cheveux
 else{p(hX,hY+bob,hW,hH,skin);p(hX,hY+hH-1+bob,hW,1,skinD)}
 // oreilles de profil
 if(side){p(right?hX:hX+hW-1,hY+5+bob,1,3,skinD)}
 // ── COIFFE / ACCESSOIRE (forme) ──
 let cap=(brim)=>{p(hX-1,hY-2+bob,hW+2,4,hatC);if(brim)p((right||!side)?hX+hW-2:hX-3,hY+0+bob,5,2,hatC)};
 if(hatType==='base'||hatType==='fedora'){p(hX-2,hY-3+bob,hW+4,3,hatC);p(hX-4,hY+0+bob,hW+8,2,hatC);p(hX-1,hY-1+bob,hW+2,1,shade(hatC,.18))}
 else if(hatType==='cap'){p(hX-1,hY-3+bob,hW+2,4,hatC);if(!back)p(hX+(right?hW-2:-3),hY+0+bob,5,2,hatD)}
 else if(hatType==='band'){p(hX-1,hY+1+bob,hW+2,3,hatC)}
 else if(hatType==='bandana'){p(hX-1,hY-1+bob,hW+2,4,hatC);if(!side)p(hX+hW-3,hY+3+bob,3,5,hatD)}
 else if(hatType==='beanie'){p(hX-1,hY-3+bob,hW+2,5,hatC);p(hX-1,hY+1+bob,hW+2,2,shade(hatC,.15))}
 else if(hatType==='straw'){p(hX-3,hY-2+bob,hW+6,3,hatC);p(hX-5,hY+1+bob,hW+10,2,hatC);p(hX-1,hY-2+bob,hW+2,1,shade(hatC,-.18))}
 else if(hatType==='helmet'||hatType==='pith'){p(hX-2,hY-3+bob,hW+4,5,hatC);p(hX-4,hY+1+bob,hW+8,2,hatC);p(hX-1,hY-2+bob,hW+2,1,shade(hatC,.2))}
 else if(hatType==='goggles'){p(hX-2,hY-3+bob,hW+4,3,hatD);if(!back){p(hX+1,hY+1+bob,4,3,'#9adfff');p(hX+hW-5,hY+1+bob,4,3,'#9adfff')}}
 else if(hatType==='crown'){p(hX,hY-3+bob,hW,3,hatC);p(hX+1,hY-5+bob,2,2,hatC);p(hX+hW/2-1,hY-6+bob,2,3,hatC);p(hX+hW-3,hY-5+bob,2,2,hatC)}
 else if(hatType==='cyber'){p(hX-2,hY-2+bob,hW+4,3,'#1a2230');if(!back)p(hX,hY+1+bob,hW,3,hatC)}
 else if(hatType==='none'){p(hX,hY+bob,hW,3,shade(skin,-.18))} // cheveux courts
 // ── VISAGE ──
 if(!back){
  let ex=side?(right?4:-4):0;
  p(ex+hX+3,hY+5+bob,2,2,'#171515');
  if(!side)p(hX+hW-5,hY+5+bob,2,2,'#171515');
  if(hatType!=='cyber')p(side?(right?2:-2)+hX+5:hX+5,hY+8+bob,4,1,'#9e5540'); // bouche
 }
}
// Aperçu du perso sur un canvas dédié : utilise EXACTEMENT le rendu in-game (drawHeroBody) pour
// que l'aperçu et le héros en jeu soient IDENTIQUES (mêmes silhouettes/accessoires des 10 persos,
// même customisation, même animation). dir 8-way → drapeaux back/side/right.
function drawCharacterPreview(canvas,i,look,bob,dir,frame,anim){
 let d=canvas.getContext('2d');d.imageSmoothingEnabled=false;d.clearRect(0,0,96,112);
 let lk=look||activeLook(i);
 let cstyle=charStyle(i);
 dir=dir||0;
 // dir 0=face, 1=droite, 2=dos, 3=gauche
 let back=dir===2,side=dir===1||dir===3,right=dir===1;
 anim=anim||{};
 // centre du torse à (48, ~58) avec un scale ~1.9 pour remplir 96×112. put écrit sur le canvas.
 let scl=1.9,cx=48,cy=58;
 let put=(x,y,w,h,c)=>{d.fillStyle=c;d.fillRect(Math.round(cx+(x-0)*scl),Math.round(cy+(y-0)*scl),Math.ceil(w*scl),Math.ceil(h*scl))};
 // marche : phase = cadence du cycle. repos : phase pilote la respiration (now*.003 dans drawHeroBody).
 let phase=anim.walking?(anim.phase!=null?anim.phase/.013:undefined):(anim.idle!=null?anim.idle/.003:undefined);
 drawHeroBody(0,0,lk,cstyle,{put:put,back:back,side:side,right:right,
  walking:!!anim.walking,running:false,phase:phase,whip:false});
}
// Icône pixel-art par branche de compétence (rendu canvas, façon biomeIconCanvas).
function skillIconCanvas(kind,px=30){let cv=document.createElement('canvas');cv.width=cv.height=30;let g=cv.getContext('2d');g.imageSmoothingEnabled=false;
 cv.style.width=px+'px';cv.style.height=px+'px';cv.style.imageRendering='pixelated';
 let r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
 if(kind==='vie'){// cœur rouge
  let H='#e0463f',Hl='#ff8b85';r(6,8,5,4,H);r(19,8,5,4,H);r(4,11,23,5,H);r(6,16,19,4,H);r(9,20,13,3,H);r(12,23,7,3,H);r(6,9,3,3,Hl);r(11,12,4,2,Hl)}
 else if(kind==='souffle'){// goutte/bulle bleue
  let B='#3a90d8',Bl='#aee0ff';r(13,4,4,3,B);r(11,7,8,4,B);r(8,11,14,6,B);r(6,17,18,5,B);r(9,22,12,3,B);r(10,12,4,4,Bl)}
 else if(kind==='vitesse'){// éclair jaune
  let Y='#f0c032',Yl='#fff09b';r(15,3,7,7,Y);r(11,10,9,5,Y);r(16,15,8,5,Y);r(8,20,12,6,Y);r(13,26,6,2,Y);r(15,4,3,4,Yl)}
 else if(kind==='fouet'){// fouet ondulé brun
  let W='#8a5a2c',Wl='#caa05a';r(4,5,4,4,'#5a3a1c');r(7,8,4,3,W);r(10,10,4,3,W);r(13,13,4,3,W);r(16,16,4,3,W);r(19,19,4,3,W);r(22,22,4,4,Wl)}
 else if(kind==='oneshot'){// épée/croix létale
  let S='#cfd6df',Sl='#fff',Hd='#8a5a2c';r(13,3,4,15,S);r(13,4,2,12,Sl);r(8,17,14,3,Hd);r(13,20,4,7,Hd);r(11,25,8,3,'#5a3a1c')}
 else{// dash : double chevron cyan
  let C='#4fc8e0',Cl='#bdf2ff';r(5,7,4,4,C);r(9,11,4,4,C);r(13,15,4,4,C);r(9,19,4,4,C);r(5,23,4,4,C);r(14,7,4,4,Cl);r(18,11,4,4,Cl);r(22,15,4,4,Cl);r(18,19,4,4,Cl);r(14,23,4,4,Cl)}
 return cv;
}
// ÉCRAN COMPÉTENCES : rend chaque branche + ses paliers. Clic sur le palier achetable → achat.
function showSkills(){
 renderSkillTree();
 show('skills');
}
// ARBRE EN GRILLE COUDÉE : la RACINE (HÉROS) est au CENTRE. Les 6 branches partent du centre
// puis suivent un CHEMIN COUDÉ propre à chacune (ex : droite-bas-droite, gauche-haut-haut…) sur
// une grille fixe → aucune box ne se superpose, tout tient dans le cadre carré. Petites box,
// texte court (libellé COURT par palier). Traits SVG en angles droits qui s'illuminent à l'achat.
function renderSkillTree(){
 let tree=document.querySelector('#skillTree');if(!tree)return;
 let bal=document.querySelector('#skillRubis');if(bal)bal.innerHTML='<span class="rubisGem"></span> '+getRubis()+' RUBIS';
 let skills=getSkills();
 tree.innerHTML='';
 // Grille en pixels (carrée). Origine = centre. Pas de grille = GX/GY.
 let SIZE=900,cx=SIZE/2,cy=SIZE/2,GX=150,GY=120;
 // Pour chaque branche : liste de POINTS (en pas de grille, relatifs au centre) que le chemin
 // traverse. Le 1er point = tête de branche, les suivants = paliers (1,2,3). Chemins coudés,
 // disposés pour remplir les 4 quadrants sans collision.
 let G=(gx,gy)=>({x:cx+gx*GX,y:cy+gy*GY});
 let PATHS={
  // VITALITÉ : monte tout droit (haut)
  vie:    [G(0,-1),G(0,-2),G(-1,-2.6),G(1,-2.6)],
  // SOUFFLE : droite puis bas (coude)
  souffle:[G(1,-1),G(2,-1),G(2,0),G(2,1)],
  // VITESSE : droite-bas-droite vers le coin bas-droite
  vitesse:[G(1,1),G(1,2),G(2,2),G(2.9,2.3)],
  // FOUET : bas tout droit
  fouet:  [G(0,1),G(0,2),G(-1,2.6),G(1,2.6)],
  // FRAPPE LÉTALE : gauche-bas (2 paliers)
  oneshot:[G(-1,1),G(-2,1),G(-2,2)],
  // DASH : gauche puis haut (coude) vers le coin haut-gauche
  dash:   [G(-1,-1),G(-2,-1),G(-2,-2),G(-2.9,-2.3)]
 };
 let stage=document.createElement('div');stage.className='treeStage star';
 stage.style.aspectRatio='1/1';
 let svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('class','treeSvg');svg.setAttribute('viewBox','0 0 '+SIZE+' '+SIZE);svg.setAttribute('preserveAspectRatio','none');
 stage.appendChild(svg);
 // Trait coudé : on relie 2 points par un L (horizontal puis vertical) pour un rendu « circuit ».
 let mkElbow=(a,b,lit,w)=>{
  let d='M'+a.x+' '+a.y+' L'+b.x+' '+a.y+' L'+b.x+' '+b.y;
  let base=document.createElementNS('http://www.w3.org/2000/svg','path');
  base.setAttribute('d',d);base.setAttribute('class','treeBranch');base.setAttribute('stroke-width',w+3);base.setAttribute('fill','none');
  svg.appendChild(base);
  let p=document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d',d);p.setAttribute('class','treeBranch'+(lit?' lit':' dim'));p.setAttribute('stroke-width',w);p.setAttribute('fill','none');
  svg.appendChild(p);
 };
 let mkNodeEl=(cls,html)=>{let n=document.createElement('div');n.className='treeNode '+cls;n.innerHTML=html;stage.appendChild(n);return n};
 let place=(el,pt)=>{el.style.left=(pt.x/SIZE*100)+'%';el.style.top=(pt.y/SIZE*100)+'%'};
 SKILL_KEYS.forEach(k=>{
  let def=SKILL_TREE[k],lvl=skills[k]||0,pts=PATHS[k];
  let hp=pts[0];                          // tête de branche
  // trait racine (centre) → tête (coude)
  mkElbow({x:cx,y:cy},hp,lvl>0,7);
  let head=mkNodeEl('treeHead'+(lvl>0?' lit':''),'');
  head.appendChild(skillIconCanvas(def.icon,26));
  let cap=document.createElement('div');cap.className='treeHeadLbl';cap.textContent=noAcc(def.label);head.appendChild(cap);
  place(head,hp);
  // paliers : suivent les points suivants du chemin (coudés)
  let prev=hp;
  def.tiers.forEach((t,ti)=>{
   let pt=pts[ti+1];if(!pt)return;
   let acquired=ti<lvl,buyable=ti===lvl;
   mkElbow(prev,pt,acquired,4);
   let cls=acquired?'acquired':buyable?'buyable':'locked';
   // texte COURT : libellé compact + coût (pas de phrase longue)
   let short=skillShort(k,ti);
   let node=mkNodeEl(cls,'<div class="nTier">'+(ti+1)+'</div><div class="nLbl">'+noAcc(short)+'</div>'+(acquired?'<div class="nCost">OK</div>':'<div class="nCost"><span class="rubisGem"></span>'+t.cost+'</div>'));
   node.title=noAcc(t.desc);             // phrase complète en infobulle
   place(node,pt);
   if(buyable){
    node.onclick=()=>{
     if(getRubis()<t.cost){node.classList.add('shakeNode');setTimeout(()=>node.classList.remove('shakeNode'),400);sound(160,.12,'square',.05);return}
     spendRubis(t.cost);setSkillLevel(k,ti+1);applyPerks();
     sound(720,.12,'square',.05);sound(990,.12,'square',.03);
     renderSkillTree();
    };
   }
   prev=pt;
  });
 });
 // RACINE au CENTRE, dessinée en dernier (au-dessus des traits)
 let root=mkNodeEl('treeRoot','<div class="rootGem"></div><div class="rootLbl">'+noAcc('HÉROS')+'</div>');
 place(root,{x:cx,y:cy});
 tree.appendChild(stage);
}
// Libellé COURT par palier (badge compact, pas de phrase) ; le détail reste en infobulle (title).
function skillShort(k,ti){
 let m={
  vie:['+15%','+30%','+50%'],
  souffle:['+40%','+80%','+140%'],
  vitesse:['+6%','+12%','+18%'],
  fouet:['x1.15','x1.30','x1.50'],
  oneshot:['K.O.','K.O.+'],
  dash:['DASH+','DASH++','DASH MAX']
 };
 return (m[k]&&m[k][ti])||('P'+(ti+1));
}
function showSettings(){settingsFrom='menu';updateSettingsButtons();show('settings')}function closeSettings(){if(settingsFrom==='pause'){settingsFrom='menu';show('play');paused=true;let ov=document.querySelector('#pauseMenu');if(ov)ov.classList.remove('hidden')}else showMenu()}function toggleSetting(k){if(k==='difficulty')settingsData[k]=settingsData[k]==='NORMAL'?'EXPERT':'NORMAL';else if(k==='textScale'){let order=['PETIT','NORMAL','GRAND'];settingsData[k]=order[(order.indexOf(settingsData[k])+1)%3]}else settingsData[k]=!settingsData[k];localStorage.setItem('temple-settings',JSON.stringify(settingsData));if(k==='music'){if(settingsData.music){if(state==='play')startMusic()}else stopMusic()}updateSettingsButtons();applyAccessibility()}function updateSettingsButtons(){document.querySelector('#shakeBtn').textContent=settingsData.shake?'OUI':'NON';document.querySelector('#motionBtn').textContent=settingsData.motion?'OUI':'NON';document.querySelector('#soundBtn').textContent=settingsData.sound?'OUI':'NON';let mu=document.querySelector('#musicBtn');if(mu)mu.textContent=settingsData.music?'OUI':'NON';document.querySelector('#touchBtn').textContent=settingsData.touchCompact?'COMPACT':'GRAND';document.querySelector('#difficultyBtn').textContent=settingsData.difficulty;let ts=document.querySelector('#textScaleBtn');if(ts)ts.textContent=settingsData.textScale;let sy=document.querySelector('#symbolsBtn');if(sy)sy.textContent=settingsData.symbols?'OUI':'NON';ui.touch.style.transform=settingsData.touchCompact?'scale(.9)':'';ui.touch.style.transformOrigin='bottom center'}
function applyAccessibility(){let b=document.body;b.classList.remove('text-petit','text-normal','text-grand');b.classList.add('text-'+(settingsData.textScale||'NORMAL').toLowerCase());b.classList.toggle('symbols-on',!!settingsData.symbols)}
function sound(freq=220,dur=.08,type='square',vol=.035){if(!settingsData.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch(e){}}
// Ton avec ADSR + glissando de hauteur (f0→f1) : brique des SFX riches.
function tone(f0,f1,t0,dur,type,vol,atk){if(!audioCtx||!settingsData.sound)return;let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t0+dur);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+(atk||.005));g.gain.exponentialRampToValueAtTime(.0008,t0+dur);o.connect(g);g.connect(audioCtx.destination);o.start(t0);o.stop(t0+dur+.03)}
// Bruit court (souffle/impact) via buffer aléatoire filtré.
function noise(t0,dur,vol,freq){if(!audioCtx||!settingsData.sound)return;let n=Math.floor(audioCtx.sampleRate*dur),buf=audioCtx.createBuffer(1,n,audioCtx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);let src=audioCtx.createBufferSource();src.buffer=buf;let bp=audioCtx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=freq||1200;let g=audioCtx.createGain();g.gain.value=vol;src.connect(bp);bp.connect(g);g.connect(audioCtx.destination);src.start(t0);src.stop(t0+dur)}
// SFX composés par nom d'événement (accords/sweeps/ADSR). Remplace les bips secs.
function sfx(name){if(!settingsData.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();let n=audioCtx.currentTime;switch(name){
 case 'good':       tone(523,659,n,.10,'triangle',.05);tone(659,784,n+.09,.14,'triangle',.05);tone(784,1046,n+.20,.18,'triangle',.045);break; // arpège ascendant joyeux
 case 'bad':        tone(330,220,n,.18,'sawtooth',.05);tone(247,160,n+.05,.24,'square',.04);break;                                   // descente dissonante
 case 'collect':    tone(880,1318,n,.12,'triangle',.05,.004);tone(1318,1760,n+.07,.12,'sine',.04);break;                            // ding cristallin
 case 'powerup':    [523,659,784,1046].forEach((f,i)=>tone(f,f*1.01,n+i*.06,.18,'triangle',.045,.004));break;                       // fanfare montante
 case 'door':       tone(196,147,n,.5,'sawtooth',.05);noise(n,.5,.03,300);break;                                                    // pierre lourde qui coulisse
 case 'key':        tone(1046,1568,n,.08,'square',.045);tone(1568,2093,n+.06,.10,'triangle',.04);break;                             // tintement de clé
 case 'hurt':       tone(330,90,n,.22,'sawtooth',.06);noise(n,.18,.05,500);break;                                                   // coup encaissé
 case 'jumpwhip':   tone(180,620,n,.12,'square',.04,.003);noise(n+.02,.06,.03,2400);break;                                          // claquement du fouet
 case 'step':       noise(n,.04,.012,800);break;                                                                                    // pas étouffé
 case 'splash':     noise(n,.22,.04,700);tone(500,260,n,.2,'sine',.025);break;                                                      // éclaboussure
 case 'win':        [523,659,784,1046,1318].forEach((f,i)=>tone(f,f,n+i*.10,.4,'triangle',.05,.006));tone(784,784,n+.5,.6,'sine',.03);break; // jingle de victoire
 case 'lose':       [392,330,262,196].forEach((f,i)=>tone(f,f*.98,n+i*.16,.4,'sawtooth',.05,.01));break;                            // jingle de défaite
 case 'boss':       tone(110,82,n,.6,'sawtooth',.06);tone(165,123,n,.6,'square',.04);noise(n,.5,.04,200);break;                     // rugissement du gardien
 case 'secret':     [659,784,988,1318,988,1318].forEach((f,i)=>tone(f,f,n+i*.09,.16,'triangle',.045,.004));break;                   // petite révélation (à la Zelda)
 default: sound();}}catch(e){}}
// ---- Moteur de musique chiptune par biome (Web Audio, sans fichier) ----
let music={on:false,next:0,step:0,theme:null,master:null,bus:null,echo:null};
// Gammes (Hz) et motifs par biome. mel = index de note (0=do grave), -1 = silence.
const MUSIC_THEMES={
 FORET:{tempo:.30,wave:'triangle',vol:.045,scale:[261.6,293.7,329.6,392,440,523.3,587.3,659.3],mel:[0,2,4,2,5,4,2,0,4,5,7,5,4,2,4,-1],bass:[0,-1,4,-1,2,-1,4,-1],bvol:.04},
 PLAGE:{tempo:.32,wave:'sine',vol:.05,scale:[293.7,349.2,392,440,523.3,587.3,698.5],mel:[0,1,2,3,4,3,2,1,2,3,4,5,4,3,2,-1],bass:[0,-1,2,-1,3,-1,2,-1],bvol:.045},
 TAIGA:{tempo:.40,wave:'sine',vol:.04,scale:[246.9,277.2,329.6,370,415.3,493.9,554.4],mel:[0,2,4,-1,3,2,0,-1,4,5,4,2,0,-1,2,-1],bass:[0,-1,-1,-1,3,-1,-1,-1],bvol:.04},
 DESERT:{tempo:.28,wave:'sawtooth',vol:.035,scale:[277.2,311.1,349.2,392,415.3,466.2,523.3],mel:[0,1,0,3,2,1,0,4,3,2,1,0,2,1,0,-1],bass:[0,-1,0,-1,4,-1,0,-1],bvol:.035},
 VOLCAN:{tempo:.26,wave:'sawtooth',vol:.04,scale:[174.6,196,207.7,233.1,261.6,311.1,349.2],mel:[0,3,1,4,0,3,5,4,0,3,1,0,4,3,1,-1],bass:[0,0,-1,3,0,0,-1,4],bvol:.05},
 GROTTE:{tempo:.34,wave:'sine',vol:.03,scale:[261.6,293.7,311.1,349.2,392,415.3,466.2],mel:[0,2,4,2,1,3,5,3,2,4,1,0,2,4,3,-1],bass:[0,-1,-1,2,-1,-1,4,-1],bvol:.04,pad:[0,3,4]},
 // JUNGLE : tropical humide, percussif, motif syncopé.
 JUNGLE:{tempo:.27,wave:'triangle',vol:.045,scale:[261.6,293.7,329.6,349.2,392,440,523.3,587.3],mel:[0,3,2,5,4,2,5,7,4,2,3,0,2,4,2,-1],bass:[0,0,-1,3,-1,4,-1,3],bvol:.045,pad:[0,4,7]},
 // DUNES : désert rouge, gamme orientale (seconde augmentée), lancinant.
 DUNES:{tempo:.30,wave:'sawtooth',vol:.035,scale:[261.6,277.2,329.6,349.2,392,415.3,493.9],mel:[0,1,3,2,1,0,4,3,2,1,0,1,3,1,0,-1],bass:[0,-1,-1,4,0,-1,-1,3],bvol:.04,pad:[0,3]},
 // SEQUOIAS : forêt majestueuse, lente et solennelle, intervalles larges.
 SEQUOIAS:{tempo:.42,wave:'triangle',vol:.04,scale:[196,233.1,261.6,293.7,349.2,392,466.2],mel:[0,2,4,-1,5,4,2,-1,0,3,5,3,2,0,-1,-1],bass:[0,-1,-1,-1,2,-1,-1,-1],bvol:.045,pad:[0,4,5]},
 // MARECAGE : marais brumeux, mineur trouble, notes étouffées.
 MARECAGE:{tempo:.38,wave:'sine',vol:.04,scale:[220,246.9,261.6,293.7,311.1,349.2,415.3],mel:[0,2,1,4,3,1,0,-1,2,4,3,1,2,0,-1,-1],bass:[0,-1,-1,3,-1,-1,2,-1],bvol:.04,pad:[0,2,5]},
 // SAVANE : plaine ensoleillée, pentatonique chaleureuse, rythme entraînant.
 SAVANE:{tempo:.28,wave:'triangle',vol:.045,scale:[261.6,293.7,329.6,392,440,523.3,587.3],mel:[0,2,4,2,5,4,2,4,5,4,2,0,4,2,0,-1],bass:[0,-1,4,-1,2,-1,4,-1],bvol:.045,pad:[0,2,4]},
 // ISLANDE : désert volcanique froid, éthéré, intervalles ouverts.
 ISLANDE:{tempo:.44,wave:'sine',vol:.038,scale:[233.1,261.6,311.1,349.2,392,466.2,523.3],mel:[0,3,5,-1,4,2,0,-1,3,5,4,2,0,-1,-1,-1],bass:[0,-1,-1,-1,4,-1,-1,-1],bvol:.038,pad:[0,4,6]},
 // YELLOWSTONE : géothermique, bouillonnant, motif curieux montant.
 YELLOWSTONE:{tempo:.29,wave:'square',vol:.032,scale:[293.7,329.6,392,440,493.9,587.3,659.3],mel:[0,1,2,3,4,5,4,3,2,3,1,2,0,2,4,-1],bass:[0,-1,2,-1,4,-1,2,-1],bvol:.035,pad:[0,2,4]},
 // GLACIER : étendue glaciale, cristallin, aigu et clairsemé.
 GLACIER:{tempo:.40,wave:'sine',vol:.04,scale:[329.6,370,415.3,440,493.9,587.3,659.3,784],mel:[0,4,2,5,-1,4,7,5,2,4,0,-1,5,2,-1,-1],bass:[0,-1,-1,4,-1,-1,2,-1],bvol:.035,pad:[0,4,7]},
 // MONTAGNE : sommets, héroïque et ample, montée vers l'aigu.
 MONTAGNE:{tempo:.34,wave:'triangle',vol:.042,scale:[261.6,293.7,329.6,392,440,523.3,587.3,659.3],mel:[0,2,4,5,7,5,4,2,0,4,5,7,5,2,0,-1],bass:[0,-1,4,-1,5,-1,4,-1],bvol:.045,pad:[0,4,5]},
 // RUINES DU TEMPS : donjon mystérieux, mineur tendu, lent et menaçant.
 RUINS:{tempo:.36,wave:'sawtooth',vol:.034,scale:[174.6,196,207.7,233.1,261.6,277.2,311.1],mel:[0,-1,2,-1,1,-1,4,-1,3,-1,2,1,0,-1,-1,-1],bass:[0,0,-1,-1,3,3,-1,-1],bvol:.05,pad:[0,2,4]},
 // BOSS : combat du Gardien, agressif, rapide, dissonant et martelé.
 BOSS:{tempo:.18,wave:'sawtooth',vol:.04,scale:[164.8,174.6,207.7,220,261.6,277.2,311.1],mel:[0,0,3,0,4,0,3,1,0,0,5,4,3,1,0,-1],bass:[0,0,0,0,4,4,3,3],bvol:.06,pad:[0,3]},
 // MENU : thème d'accueil joyeux et aérien facon « Wind Waker » (majeur lumineux, valse marine,
 // mélodie qui respire avec arpèges de harpe et nappe douce). Gamme de Sol majeur.
 MENU:{tempo:.30,wave:'triangle',vol:.045,scale:[196,220,246.9,261.6,293.7,329.6,392,440,493.9],
  mel:[0,2,4,7,6,4,2,4,3,5,4,2,0,-1,2,-1, 4,6,7,8,7,6,4,2,3,4,2,0,-1,2,-1,-1],
  bass:[0,-1,4,-1,5,-1,4,-1,3,-1,4,-1,0,-1,4,-1],bvol:.045,pad:[0,4,6]},
 // ── VARIANTES « WIND WAKER HD » : plusieurs morceaux possibles par contexte (rotation aléatoire). ──
 // MENU bis : « Grand Voyage » — fanfare maritime ample, montée héroïque (Ré majeur).
 MENU2:{tempo:.28,wave:'triangle',vol:.046,scale:[293.7,329.6,370,392,440,493.9,554.4,587.3,659.3],
  mel:[0,3,4,5,4,3,1,3, 5,4,3,1,0,-1,1,-1, 4,5,7,8,7,5,4,3, 1,3,4,3,0,-1,-1,-1],
  bass:[0,-1,4,-1,5,-1,3,-1,1,-1,4,-1,0,-1,4,-1],bvol:.046,pad:[0,4,6]},
 // MENU ter : « Berceuse de l'Île » — douce valse à 3 temps, calme et nostalgique (Do majeur).
 MENU3:{tempo:.34,wave:'sine',vol:.042,scale:[261.6,293.7,329.6,349.2,392,440,493.9,523.3],
  mel:[0,4,2,-1,4,7,5,-1,3,5,4,-1,2,4,0,-1, 5,4,2,-1,4,3,1,-1,2,3,4,-1,0,-1,-1,-1],
  bass:[0,-1,-1,4,-1,-1,5,-1,3,-1,-1,4,-1,-1,0,-1],bvol:.04,pad:[0,2,4]},
 // NIVEAUX bis : « Champ d'Outset » — exploration enjouée, pétillante (Sol majeur lydien).
 FIELD2:{tempo:.27,wave:'triangle',vol:.044,scale:[261.6,293.7,329.6,370,392,440,493.9,523.3],
  mel:[0,2,4,5,4,2,0,4, 5,7,5,4,2,4,5,-1, 7,5,4,2,4,5,4,2, 0,2,4,2,0,-1,-1,-1],
  bass:[0,-1,4,-1,2,-1,5,-1,4,-1,2,-1,0,-1,4,-1],bvol:.044,pad:[0,4,7]},
 // NIVEAUX ter : « Brise marine » — légère, paisible, balancée (Fa majeur).
 FIELD3:{tempo:.30,wave:'sine',vol:.042,scale:[349.2,392,440,466.2,523.3,587.3,659.3,698.5],
  mel:[0,2,1,3,2,0,-1,2, 4,3,2,0,1,-1,2,-1, 3,4,5,4,2,3,1,-1, 0,2,1,0,-1,-1,-1,-1],
  bass:[0,-1,2,-1,4,-1,2,-1,3,-1,1,-1,0,-1,2,-1],bvol:.04,pad:[0,2,4]},
 // RUINES bis : « Tour des Dieux » — solennel, mystérieux, intervalles graves (Ré mineur).
 RUINS2:{tempo:.40,wave:'sine',vol:.034,scale:[146.8,164.8,174.6,196,220,233.1,261.6],
  mel:[0,-1,3,-1,2,4,-1,3, 1,-1,2,-1,0,-1,-1,-1, 4,-1,3,-1,5,-1,4,3, 2,-1,1,-1,0,-1,-1,-1],
  bass:[0,0,-1,-1,3,-1,-1,-1],bvol:.05,pad:[0,2,4]},
 // RUINES ter : « Sanctuaire englouti » — onirique, cristallin, suspendu (La mineur).
 RUINS3:{tempo:.44,wave:'sine',vol:.032,scale:[220,246.9,261.6,293.7,329.6,392,440,523.3],
  mel:[0,4,-1,2,5,-1,4,-1, 3,-1,2,4,-1,0,-1,-1, 5,-1,4,2,-1,4,-1,3, 1,-1,0,-1,-1,-1,-1,-1],
  bass:[0,-1,-1,4,-1,-1,2,-1],bvol:.045,pad:[0,4,7]},
 // BOSS bis : « Helmaroc » — martial, rapide, dramatique (mineur tendu, batterie de basse).
 BOSS2:{tempo:.17,wave:'sawtooth',vol:.042,scale:[155.6,174.6,196,207.7,233.1,261.6,293.7],
  mel:[0,0,4,0,3,0,5,4, 0,0,3,0,4,0,6,5, 0,0,4,3,5,4,3,1, 0,0,2,0,1,0,-1,-1],
  bass:[0,0,0,0,3,3,4,4],bvol:.062,pad:[0,3,4]},
 // BOSS ter : « Ganondorf » — sombre, implacable, chromatique menaçant (Mi mineur grave).
 BOSS3:{tempo:.19,wave:'sawtooth',vol:.04,scale:[164.8,174.6,196,207.7,246.9,261.6,311.1],
  mel:[0,1,0,3,0,1,0,4, 0,1,0,5,4,3,1,0, 0,1,0,3,0,4,0,6, 5,4,3,1,0,-1,-1,-1],
  bass:[0,0,3,3,0,0,4,4],bvol:.06,pad:[0,2,4]}
};
// Groupes de variantes par CONTEXTE : tirage aléatoire à chaque entrée d'écran (rotation des morceaux).
const MUSIC_GROUPS={
 MENU:['MENU','MENU2','MENU3'],
 RUINS:['RUINS','RUINS2','RUINS3'],
 BOSS:['BOSS','BOSS2','BOSS3'],
 // Pour les biomes « plein air », on ajoute aussi des morceaux d'exploration Wind Waker.
 FIELD:['FIELD2','FIELD3']
};
// Clé de variante choisie pour le contexte courant (mémorisée pour ne pas re-tirer à chaque frame).
let musicVariant={ctx:'',key:''};
function pickVariant(ctx,fallbackKey){
 // si on est déjà sur ce contexte, on garde le morceau choisi ; sinon on en tire un nouveau.
 if(musicVariant.ctx===ctx&&MUSIC_THEMES[musicVariant.key])return MUSIC_THEMES[musicVariant.key];
 let group=MUSIC_GROUPS[ctx];
 let key=group?group[rng(group.length)]:fallbackKey;
 if(!MUSIC_THEMES[key])key=fallbackKey;
 musicVariant={ctx,key};
 return MUSIC_THEMES[key];
}
let menuMusic=false; // vrai quand on doit jouer le thème d'accueil
// Sélectionne le thème : RUINES/BOSS ont priorité, sinon le biome courant.
// Choisit le thème selon le contexte, AVEC variantes (plusieurs morceaux possibles par contexte).
// Priorité : MENU > BOSS > RUINES > biome courant. Chaque contexte tire un morceau au hasard dans
// son groupe et le conserve tant qu'on reste dans ce contexte (rotation à chaque nouvelle entrée).
function pickMusicTheme(){
 if(menuMusic)return pickVariant('MENU','MENU');
 if(boss&&boss.active)return pickVariant('BOSS','BOSS');
 if(isRuins)return pickVariant('RUINS','RUINS');
 // Biome : on alterne entre le thème propre au biome et un morceau d'exploration « Wind Waker ».
 let biomeKey=currentTheme?currentTheme.n:'FORET';
 let ctx='BIOME:'+biomeKey;
 if(musicVariant.ctx===ctx&&MUSIC_THEMES[musicVariant.key])return MUSIC_THEMES[musicVariant.key];
 // pool = thème du biome (s'il existe) + variantes d'exploration
 let pool=[];if(MUSIC_THEMES[biomeKey])pool.push(biomeKey);pool=pool.concat(MUSIC_GROUPS.FIELD);
 let key=pool[rng(pool.length)]||'FORET';if(!MUSIC_THEMES[key])key='FORET';
 musicVariant={ctx,key};
 return MUSIC_THEMES[key];
}
function startMusic(){if(!settingsData.music)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();
 // bus maître + petite réverb par delay (donne l'espace "ocarina/caverne" façon Zelda).
 // Réverb plus discrète (feedback réduit) pour éviter l'empilement boueux des voix orchestrales.
 if(!music.bus){music.bus=audioCtx.createGain();music.bus.gain.value=.9;let dl=audioCtx.createDelay(.5);dl.delayTime.value=.28;let fb=audioCtx.createGain();fb.gain.value=.18;let wet=audioCtx.createGain();wet.gain.value=.22;
  // compresseur doux : empêche la saturation quand plusieurs voix se superposent.
  let comp=audioCtx.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=12;comp.ratio.value=4;comp.attack.value=.005;comp.release.value=.18;
  music.bus.connect(comp);comp.connect(audioCtx.destination);music.bus.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(comp);music.echo=wet}
 // ANTI-SUPERPOSITION : si une musique tournait déjà, on coupe brièvement le bus (mute rapide)
 // pour laisser les notes déjà programmées s'éteindre avant de relancer le nouveau morceau.
 let now=audioCtx.currentTime,g=music.bus.gain;g.cancelScheduledValues(now);
 if(music.on){g.setValueAtTime(g.value,now);g.linearRampToValueAtTime(.0001,now+.04);g.setValueAtTime(.0001,now+.34);g.linearRampToValueAtTime(.9,now+.5)}
 else{g.setValueAtTime(.9,now)}
 let begin=music.on?now+.36:now+.05; // si redémarrage, attendre l'extinction de l'ancien morceau
 musicVariant={ctx:'',key:''}; // force un nouveau tirage de morceau à chaque (re)démarrage
 music.theme=pickMusicTheme();music.on=true;music.step=0;music.next=begin}catch(e){}}
function stopMusic(){music.on=false;if(audioCtx&&music.bus){try{let now=audioCtx.currentTime,g=music.bus.gain;g.cancelScheduledValues(now);g.setValueAtTime(g.value,now);g.linearRampToValueAtTime(.0001,now+.18)}catch(e){}}}
// Note avec enveloppe ADSR douce + léger detune (épaissit le son). dst optionnel = nœud de sortie.
function playNote(freq,t,dur,wave,vol,opt){if(!audioCtx||freq<=0)return;opt=opt||{};let out=opt.dst||music.bus||audioCtx.destination;
 let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=wave;o.frequency.value=freq;if(opt.detune)o.detune.value=opt.detune;
 let atk=opt.atk!=null?opt.atk:.012,rel=opt.rel!=null?opt.rel:dur;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+atk);g.gain.exponentialRampToValueAtTime(.001,t+rel);
 o.connect(g);g.connect(out);o.start(t);o.stop(t+rel+.04);
 // doublage léger à l'octave/quinte pour la rondeur "harpe" (optionnel)
 if(opt.double){let o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.type=wave;o2.frequency.value=freq*opt.double;g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(vol*.4,t+atk);g2.gain.exponentialRampToValueAtTime(.001,t+rel*.8);o2.connect(g2);g2.connect(out);o2.start(t);o2.stop(t+rel+.04)}}
// ════════════════════════════════════════════════════════════════════════════════════════
// SYNTHÉTISEUR DE TIMBRES « ORCHESTRE WIND WAKER » (tout en Web Audio, aucun fichier audio).
// Chaque instrument = un empilement d'oscillateurs (partiels) + enveloppe + vibrato propre, pour
// imiter fl\u00fbte irlandaise, cordes pizzicato, harpe, marimba, accord\u00e9on, cor. dst optionnel.
// ════════════════════════════════════════════════════════════════════════════════════════
function playVoice(freq,t,dur,inst,vol,opt){
 if(!audioCtx||freq<=0||vol<=0)return;opt=opt||{};let out=opt.dst||music.bus||audioCtx.destination;
 // fabrique un partiel (oscillateur sinus/triangle) avec son propre gain
 let mk=(f,wave)=>{let o=audioCtx.createOscillator();o.type=wave||'sine';o.frequency.setValueAtTime(f,t);return o};
 let nodes=[],master=audioCtx.createGain();master.connect(out);
 // glissando d'attaque optionnel (port de voix) : la hauteur monte/descend vers freq
 let applyGlide=o=>{if(opt.glide){o.frequency.setValueAtTime(freq*opt.glide,t);o.frequency.exponentialRampToValueAtTime(freq,t+Math.min(dur*.4,.08))}};
 // vibrato : LFO doux sur la hauteur (typique fl\u00fbte/accord\u00e9on/cor)
 let addVib=(o,depthCents,rate,delay)=>{if(!depthCents)return;let lfo=audioCtx.createOscillator(),lg=audioCtx.createGain();lfo.frequency.value=rate||5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(depthCents,t+(delay||.12));lfo.connect(lg);lg.connect(o.detune);lfo.start(t);lfo.stop(t+dur+.05);nodes.push(lfo)};
 let A,D,S,R,peak=vol; // enveloppe par défaut
 if(inst==='flute'){            // fl\u00fbte/tin whistle : sinus pur + souffle l\u00e9ger, vibrato chantant
  let o=mk(freq,'sine'),o2=mk(freq*2,'sine'),g2=audioCtx.createGain();applyGlide(o);
  g2.gain.value=.12;o2.connect(g2);g2.connect(master);o.connect(master);addVib(o,7,5.2,.14);addVib(o2,7,5.2,.14);
  nodes.push(o,o2);A=.04;D=.05;S=.85;R=Math.max(.08,dur*.5);
 }else if(inst==='pizz'){       // cordes pizzicato : attaque ultra courte, d\u00e9croissance rapide, partiels
  let o=mk(freq,'triangle'),o2=mk(freq*2,'triangle'),g2=audioCtx.createGain();g2.gain.value=.22;o2.connect(g2);g2.connect(master);o.connect(master);
  nodes.push(o,o2);A=.004;D=.09;S=.0;R=Math.min(dur,.16);peak=vol*1.1;
 }else if(inst==='harp'){       // harpe : pinc\u00e9 brillant, longue traîne, octave douce
  let o=mk(freq,'triangle'),o3=mk(freq*3,'sine'),g3=audioCtx.createGain();g3.gain.value=.08;o3.connect(g3);g3.connect(master);o.connect(master);
  nodes.push(o,o3);A=.003;D=.25;S=.0;R=Math.max(.3,dur);peak=vol;
 }else if(inst==='marimba'){    // marimba/cloche bois : sinus + harmonique aigu, court et rond
  let o=mk(freq,'sine'),o4=mk(freq*4,'sine'),g4=audioCtx.createGain();g4.gain.value=.06;o4.connect(g4);g4.connect(master);o.connect(master);
  nodes.push(o,o4);A=.003;D=.18;S=.0;R=Math.min(dur,.3);
 }else if(inst==='accordion'){  // accord\u00e9on : deux voix l\u00e9g\u00e8rement d\u00e9saccord\u00e9es (battement), soutenu
  let o=mk(freq,'sawtooth'),o2=mk(freq,'sawtooth');o2.detune.setValueAtTime(8,t);
  let lp=audioCtx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;o.connect(lp);o2.connect(lp);lp.connect(master);
  applyGlide(o);addVib(o,5,4.4,.2);nodes.push(o,o2);A=.05;D=.06;S=.9;R=Math.max(.1,dur*.6);
 }else if(inst==='horn'){       // cor : triangle filtr\u00e9 chaud, attaque douce, soutenu noble
  let o=mk(freq,'triangle'),o2=mk(freq*2,'sine'),g2=audioCtx.createGain();g2.gain.value=.18;o2.connect(g2);g2.connect(master);
  let lp=audioCtx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;o.connect(lp);lp.connect(master);
  applyGlide(o);addVib(o,4,4.8,.25);nodes.push(o,o2);A=.07;D=.08;S=.88;R=Math.max(.12,dur*.7);
 }else{                         // d\u00e9faut : voix douce sinus
  let o=mk(freq,'triangle');o.connect(master);nodes.push(o);A=.02;D=.05;S=.8;R=Math.max(.08,dur*.5);
 }
 // enveloppe ADSR appliqu\u00e9e au master de la voix
 let g=master.gain,sus=peak*S;
 g.setValueAtTime(0,t);
 g.linearRampToValueAtTime(peak,t+A);
 g.linearRampToValueAtTime(Math.max(.0008,sus),t+A+D);
 let end=t+Math.max(A+D+.02,R);
 g.setValueAtTime(Math.max(.0008,sus||peak*.5),t+R*.6);
 g.exponentialRampToValueAtTime(.0006,end);
 nodes.forEach(o=>{o.start(t);o.stop(end+.05)});
}
// ── Instrumentation « orchestre Wind Waker » par contexte : quel timbre joue le lead/la basse, etc.
// On choisit l'attribution d'instruments selon le type de morceau (boss = cor+cordes, ruines = harpe
// éthérée, plein air = flûte chantante, menu = flûte+harpe+accordéon). Ornements activés hors boss.
function musicVoicing(th){
 let key=musicVariant.key||'';
 if(boss&&boss.active||/^BOSS/.test(key))return{lead:'horn',bass:'pizz',arp:'pizz',pad:'horn',orn:false,swing:.06};
 if(isRuins||/^RUINS/.test(key))return{lead:'flute',bass:'harp',arp:'harp',pad:'flute',orn:true,swing:.16};
 if(menuMusic||/^MENU/.test(key))return{lead:'flute',bass:'pizz',arp:'harp',pad:'accordion',orn:true,swing:.17};
 return{lead:'flute',bass:'pizz',arp:'harp',pad:'accordion',orn:true,swing:.16}; // plein air / biomes
}
function updateMusic(){if(!music.on||!settingsData.music||!audioCtx)return;
 // bascule de thème à chaud (entrée Ruines / Boss) sans couper la lecture
 let want=pickMusicTheme();if(want!==music.theme){music.theme=want;music.step=0}
 let th=music.theme;if(!th)return;let now=audioCtx.currentTime;
 // ROTATION : après ~3 cycles complets du morceau, on en tire un autre dans le même contexte
 // (sauf pendant le boss : on garde le même thème de combat pour ne pas casser la tension).
 if(!(boss&&boss.active)){let cyc=Math.floor(music.step/th.mel.length);if(cyc>=3){musicVariant={ctx:'',key:''};let nv=pickMusicTheme();if(nv){music.theme=th=nv;music.step=0}}}
 let V=musicVoicing(th);
 let guard=0; // garde-fou anti-gel : jamais plus de 64 notes programmées par frame
 while(music.next<now+.2&&guard++<64){let sp=th.tempo,bar=Math.floor(music.step/th.mel.length),i=music.step%th.mel.length;
  // SWING 6/8 maritime : les temps faibles (croches impaires) sont légèrement retardés.
  let swung=(i%2===1)?sp*V.swing:0,t=music.next+swung;
  // ── MÉLODIE (lead chantant : flûte/cor). Notes tenues, phrasé respirant. ──
  let mn=th.mel[i];
  if(mn>=0){
   let f=th.scale[mn],dur=sp*1.7,nx=th.mel[(i+1)%th.mel.length];
   // ORNEMENTS façon Wind Waker : grace note (appoggiature) brève avant les temps forts,
   // et léger glissando montant quand la mélodie saute vers l'aigu.
   let glide=0;
   if(V.orn&&nx>mn+1&&i%4===0)glide=.94;            // petit port de voix vers le haut
   if(V.orn&&i%4===2&&mn+1<th.scale.length){          // grace note rapide avant la note cible
    playVoice(th.scale[mn+1],t-sp*.12,sp*.16,V.lead,th.vol*.6,{});
   }
   playVoice(f,t,dur,V.lead,th.vol*1.15,glide?{glide:glide}:{});
  }
  // ── BASSE : pizzicato/harpe ronde qui marque le 6/8 (1 & 4). ──
  let bi=music.step%th.bass.length,bn=th.bass[bi];
  if(bn>=0)playVoice(th.scale[bn]/2,music.next,sp*1.4,V.bass,th.bvol*1.2,{});
  // ── PAD tenu (accordéon/cor) renouvelé à chaque mesure : nappe harmonique. ──
  if(th.pad&&i===0){let padDur=Math.min(3.2,sp*th.mel.length*.95);th.pad.forEach((pn,k)=>{let f=th.scale[pn]/(k===0?2:1);playVoice(f,music.next,padDur,V.pad,th.bvol*.45,{});});}
  // ── ARPÈGE harpe : égrène l'accord sur les temps faibles (pétillant, aérien). ──
  if(th.pad&&i%2===1){let pn=th.pad[(Math.floor(music.step/2)+bar)%th.pad.length],f=th.scale[pn]*2;playVoice(f,t,sp*.85,V.arp,th.vol*.34,{});}
  music.next+=sp;music.step++}}
function burst(x,y,color='#f5d36a',n=8,power=1){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,s=(.5+Math.random()*1.7)*power;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.5,life:.35+Math.random()*.35,color,size:1+rng(3)})}}
function addFloater(x,y,text,color='#ffe35b'){floaters.push({x,y,text,color,life:1})}
function collectPowerup(p){let px=(p.x+.5)*T,py=(p.y+.5)*T;sfx('powerup');burst(px,py,'#fff',16,1.6);addPop(px,py,'#fff');
 if(p.kind==='shield'){shield=10;addFloater(px,py-10,'BOUCLIER','#6ed2ff')}
 else if(p.kind==='time'){time+=15;addFloater(px,py-10,'+15 s','#8fe6a0')}
 else if(p.kind==='heal'){if(hp<maxHp){hp=Math.min(maxHp,hp+HP_HEAL);addFloater(px,py-10,'+'+HP_HEAL+' PV','#ff7da0')}else{score+=120;addFloater(px,py-10,'+120','#ffe35b')}sound(660,.18,'square',.05);burst(px,py-4,'#ff9ab4',16,1.6)}
 else{score+=150;addFloater(px,py-10,'+150','#ffe35b')}}
function grantArtifactPower(a){let px=a?(a.x+.5)*T:player.x*T,py=a?(a.y+.5)*T:player.y*T;
 // Pouvoir distinct par artefact ramassé (1er, 2e, 3e, 4e)
 let idx=(collected-1)%4;artifactPowers.push(idx);
 if(idx===0){shield=12;addFloater(px,py-22,'POUVOIR : BOUCLIER','#6ed2ff')}
 else if(idx===1){time+=20;addFloater(px,py-22,'POUVOIR : +20 s','#8fe6a0')}
 else if(idx===2){trapReveal=8;addFloater(px,py-22,'POUVOIR : RADAR','#ffd24a')}
 else{if(player)player.swiftT=8;addFloater(px,py-22,'POUVOIR : CÉLÉRITÉ','#caa6ff')}
 sound(740,.14,'square',.05);burst(px,py,'#ffe35b',14,1.6)}
// Power-up RARE garanti (récompense villageois/ruine) : effets renforcés vs les bonus normaux.
function grantRandomPower(px,py){let r=rng(4);
 if(r===0){shield=18;addFloater(px,py-22,'BOUCLIER PROLONGÉ','#6ed2ff')}
 else if(r===1){if(player)player.swiftT=14;addFloater(px,py-22,'CÉLÉRITÉ +','#caa6ff')}
 else if(r===2){trapReveal=14;addFloater(px,py-22,'RADAR ÉTENDU','#ffd24a')}
 else{inv=Math.max(inv,4);addFloater(px,py-22,'INVINCIBILITÉ','#ffe35b')}
 sound(820,.18,'square',.06);burst(px,py,'#ffe35b',22,2.2);impact(.3)}
// ── PERKS PERSISTANTS (gagnés dans les ruines) : cœur en plus, dash boosté, aura de fouet élargie.
function getPerks(){try{return JSON.parse(localStorage.getItem('temple-perks')||'{}')||{}}catch(e){return{}}}

// ═════════════════════════════════════════════════════════════════════════════════════════════
// FONDATIONS DATA (Phase 0) — rubis (monnaie), arbre de compétences, profil perso, difficulté.
// Tout est persisté en localStorage. Lecture défensive (try/catch) pour ne jamais casser le jeu.
// ═════════════════════════════════════════════════════════════════════════════════════════════

// ── RUBIS (monnaie) ──────────────────────────────────────────────────────────────────────────
const RUBIS_PAR_ETOILE=10,RUBIS_TRESOR=25,RUBIS_CRYPTE=40,RUBIS_RUINES=120;
let treasureBonus=false; // posé quand un trésor caché est ramassé dans la partie en cours
function getRubis(){try{return Math.max(0,parseInt(localStorage.getItem('temple-rubis')||'0',10)||0)}catch(e){return 0}}
function setRubis(n){try{localStorage.setItem('temple-rubis',String(Math.max(0,Math.floor(n))))}catch(e){}}
function addRubis(n){let v=getRubis()+Math.floor(n);setRubis(v);return v}
function spendRubis(n){let v=getRubis();if(v<n)return false;setRubis(v-n);return true}

// ── ARBRE DE COMPÉTENCES (skills) ────────────────────────────────────────────────────────────
// 6 branches, chacune avec des paliers de coût croissant en rubis.
const SKILL_TREE={
 vie:    {label:'VITALITÉ', icon:'vie',     desc:'Augmente les PV maximum.',
   tiers:[{cost:30,bonus:.15,desc:'+15 % PV max'},{cost:60,bonus:.30,desc:'+30 % PV max'},{cost:120,bonus:.50,desc:'+50 % PV max'}]},
 souffle:{label:'SOUFFLE',  icon:'souffle', desc:'Respire plus longtemps sous l’eau.',
   tiers:[{cost:25,bonus:.4,desc:'+40 % souffle'},{cost:55,bonus:.8,desc:'+80 % souffle'},{cost:110,bonus:1.4,desc:'+140 % souffle'}]},
 vitesse:{label:'VITESSE',  icon:'vitesse', desc:'Déplacement plus rapide.',
   tiers:[{cost:30,bonus:.06,desc:'+6 % vitesse'},{cost:65,bonus:.12,desc:'+12 % vitesse'},{cost:130,bonus:.18,desc:'+18 % vitesse'}]},
 fouet:  {label:'FOUET',    icon:'fouet',   desc:'Portée du fouet accrue.',
   tiers:[{cost:30,bonus:1.15,desc:'Portée ×1.15'},{cost:65,bonus:1.30,desc:'Portée ×1.30'},{cost:130,bonus:1.50,desc:'Portée ×1.50'}]},
 oneshot:{label:'FRAPPE LÉTALE', icon:'oneshot', desc:'Élimine les ennemis d’un coup.',
   tiers:[{cost:80,lvl:1,desc:'K.O. instantané des bêtes étourdies'},{cost:180,lvl:2,desc:'K.O. instantané de tous les hostiles'}]},
 dash:   {label:'DASH',     icon:'dash',    desc:'Esquive plus puissante, récup. plus courte.',
   tiers:[{cost:35,mag:11.6,cd:1.15,desc:'Dash +'},{cost:75,mag:12.8,cd:1.0,desc:'Dash ++'},{cost:140,mag:14,cd:.8,desc:'Dash MAX'}]}
};
const SKILL_KEYS=['vie','souffle','vitesse','fouet','oneshot','dash'];
function getSkills(){try{let s=JSON.parse(localStorage.getItem('temple-skills')||'{}')||{};SKILL_KEYS.forEach(k=>{if(typeof s[k]!=='number'||s[k]<0)s[k]=0});return s}catch(e){return{vie:0,souffle:0,vitesse:0,fouet:0,oneshot:0,dash:0}}}
function setSkillLevel(k,lvl){let s=getSkills();s[k]=Math.max(0,Math.min((SKILL_TREE[k]?SKILL_TREE[k].tiers.length:0),lvl));try{localStorage.setItem('temple-skills',JSON.stringify(s))}catch(e){}return s}

// ── PROFIL PERSO (personnalisation) ──────────────────────────────────────────────────────────
// Palette de TENUE : large choix de couleurs (100% personnalisable par l'élève).
const SHIRT_PALETTE=['#b1503c','#d8643f','#c9882f','#e0b23a','#5fa044','#3f7d57','#2f9a8a','#3a6ea5','#3553a8','#7d4fb0','#a64bc0','#b03a72','#d05a8a','#2b2f3a','#5a6470','#cfd4dc','#caa23a','#7a4a2a'];
// Palette de PEAU : du plus clair au plus foncé.
const SKIN_PALETTE=['#fbe0c4','#f1d2b6','#e8b98c','#d4a373','#c98a5e','#b9805a','#a06a45','#8d5a3c','#74492f','#5a3722'];
// Coiffes/accessoires : c=couleur ; type=forme ; premium déblocable aux rubis (sinon coût 0).
const HAT_OPTIONS=[
 {id:'none',label:'Aucun',type:'none',c:'#000',premium:false,cost:0},
 {id:'fedora',label:'Feutre',type:'fedora',c:'#5a3e23',premium:false,cost:0},
 {id:'cap',label:'Casquette',type:'cap',c:'#3f7d57',premium:false,cost:0},
 {id:'band',label:'Bandeau',type:'band',c:'#b1503c',premium:false,cost:0},
 {id:'beanie',label:'Bonnet',type:'beanie',c:'#3553a8',premium:false,cost:0},
 {id:'straw',label:'Chapeau paille',type:'straw',c:'#d8b257',premium:false,cost:0},
 {id:'bandana',label:'Foulard',type:'bandana',c:'#c43d4a',premium:false,cost:0},
 {id:'helmet',label:'Casque colon',type:'helmet',c:'#d8cba0',premium:true,cost:80},
 {id:'goggles',label:'Goggles',type:'goggles',c:'#8a6a3a',premium:true,cost:90},
 {id:'pith',label:'Casque liège',type:'pith',c:'#c8b27a',premium:true,cost:110},
 {id:'crown',label:'Diadème',type:'crown',c:'#ffd24a',premium:true,cost:200},
 {id:'cyber',label:'Visière néon',type:'cyber',c:'#39d6ff',premium:true,cost:160},
 {id:'wizard',label:'Chapeau mage',type:'wizard',c:'#5a3fa0',premium:true,cost:130},
 {id:'top',label:'Haut-de-forme',type:'top',c:'#22242a',premium:true,cost:140},
 {id:'flower',label:'Couronne fleurs',type:'flower',c:'#e85a8a',premium:true,cost:120},
 {id:'horns',label:'Cornes',type:'horns',c:'#d8cdbf',premium:true,cost:150},
 {id:'halo',label:'Aureole',type:'halo',c:'#ffe9a0',premium:true,cost:170}
];
// HAUTS (forme du torse) : type pilote la silhouette ; c=couleur principale ; cdm={a:secondaire,b:bande,c2:numéro}
// pour les maillots de Coupe du Monde. premium déblocable aux rubis.
const TOP_OPTIONS=[
 {id:'tshirt',label:'T-shirt',type:'tshirt',c:null,premium:false,cost:0},      // c:null = couleur de tenue choisie
 {id:'jacket',label:'Veste',type:'jacket',c:null,premium:false,cost:0},
 {id:'tunic',label:'Tunique',type:'tunic',c:null,premium:false,cost:0},
 {id:'hoodie',label:'Sweat',type:'hoodie',c:null,premium:false,cost:0},
 {id:'coat',label:'Blouse',type:'coat',c:'#e7ecdf',premium:false,cost:0},
 {id:'cdm_fra',label:'Maillot FRA',type:'jersey',c:'#1e3a8a',cdm:{a:'#ffffff',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_arg',label:'Maillot ARG',type:'jersey',c:'#75aadb',cdm:{a:'#ffffff',b:'#1e3a8a'},premium:true,cost:90},
 {id:'cdm_bra',label:'Maillot BRA',type:'jersey',c:'#f5d20a',cdm:{a:'#0a8a3c',b:'#1e3a8a'},premium:true,cost:90},
 {id:'cdm_ger',label:'Maillot GER',type:'jersey',c:'#ffffff',cdm:{a:'#111111',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_esp',label:'Maillot ESP',type:'jersey',c:'#c8102e',cdm:{a:'#f5d20a',b:'#111111'},premium:true,cost:90},
 {id:'cdm_sen',label:'Maillot SEN',type:'jersey',c:'#ffffff',cdm:{a:'#0a8a3c',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_mar',label:'Maillot MAR',type:'jersey',c:'#c1272d',cdm:{a:'#0a6e3c',b:'#ffffff'},premium:true,cost:90},
 {id:'cdm_alg',label:'Maillot ALG',type:'jersey',c:'#ffffff',cdm:{a:'#0a8a4a',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_tun',label:'Maillot TUN',type:'jersey',c:'#e70013',cdm:{a:'#ffffff',b:'#111111'},premium:true,cost:90},
 {id:'cdm_mli',label:'Maillot MLI',type:'jersey',c:'#0a8a3c',cdm:{a:'#f5d20a',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_cod',label:'Maillot COD',type:'jersey',c:'#1d6fb8',cdm:{a:'#f5d20a',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_vie',label:'Maillot VIE',type:'jersey',c:'#da251d',cdm:{a:'#f5d20a',b:'#ffffff'},premium:true,cost:90},
 {id:'cdm_chn',label:'Maillot CHN',type:'jersey',c:'#de2910',cdm:{a:'#f5d20a',b:'#ffd24a'},premium:true,cost:90},
 {id:'cdm_kor',label:'Maillot KOR',type:'jersey',c:'#c8102e',cdm:{a:'#003478',b:'#ffffff'},premium:true,cost:90},
 {id:'cdm_jpn',label:'Maillot JPN',type:'jersey',c:'#1e3a8a',cdm:{a:'#ffffff',b:'#bc002d'},premium:true,cost:90},
 {id:'cdm_egy',label:'Maillot EGY',type:'jersey',c:'#c8102e',cdm:{a:'#ffffff',b:'#111111'},premium:true,cost:90},
 {id:'cdm_che',label:'Maillot TCH',type:'jersey',c:'#0a8a3c',cdm:{a:'#ffffff',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_rus',label:'Maillot RUS',type:'jersey',c:'#ffffff',cdm:{a:'#0039a6',b:'#d4163c'},premium:true,cost:90},
 {id:'cdm_pol',label:'Maillot POL',type:'jersey',c:'#ffffff',cdm:{a:'#dc143c',b:'#111111'},premium:true,cost:90},
 {id:'cdm_ita',label:'Maillot ITA',type:'jersey',c:'#1e6fb8',cdm:{a:'#ffffff',b:'#0a3a7a'},premium:true,cost:90}
];
// PANTALONS (forme du bas) : c=couleur ; type pilote la coupe.
const PANTS_OPTIONS=[
 {id:'trousers',label:'Pantalon',type:'trousers',c:'#3b302c',premium:false,cost:0},
 {id:'shorts',label:'Short',type:'shorts',c:'#2f3b55',premium:false,cost:0},
 {id:'cargo',label:'Cargo',type:'cargo',c:'#5a5230',premium:false,cost:0},
 {id:'skirt',label:'Jupe',type:'skirt',c:'#7a3b6a',premium:false,cost:0}
];
// CHAUSSURES : c=couleur ; type pilote la forme.
const SHOE_OPTIONS=[
 {id:'boots',label:'Bottes',type:'boots',c:'#3a2c1e',premium:false,cost:0},
 {id:'sneakers',label:'Baskets',type:'sneakers',c:'#e8e8ec',premium:false,cost:0},
 {id:'sandals',label:'Sandales',type:'sandals',c:'#9a6a3a',premium:false,cost:0}
];
// Palette de couleur PAR VÊTEMENT (haut/pantalon/chaussures/coiffe) — réutilisable, riche.
const CLOTH_PALETTE=['#b1503c','#d8643f','#c9882f','#e0b23a','#f5d20a','#5fa044','#3f7d57','#2f9a8a','#3a6ea5','#3553a8','#7d4fb0','#a64bc0','#b03a72','#d05a8a','#e8e8ec','#9aa3ad','#5a6470','#2b2f3a','#3b302c','#101b12'];
// Palette de couleur de CHEVEUX (du clair au foncé + teintes fun).
const HAIR_PALETTE=['#2b1c12','#4a3019','#6a4423','#8a5a2c','#a9743a','#caa24a','#e0c060','#d8d2c4','#b04a3a','#7d4fb0','#3a6ea5','#3f7d57'];
// COIFFURES (cheveux) : type=forme ; none = chauve/rasé. Couleur via profil hairColor.
const HAIR_OPTIONS=[
 {id:'short',label:'Court',type:'short',premium:false,cost:0},
 {id:'buzz',label:'Rase',type:'buzz',premium:false,cost:0},
 {id:'long',label:'Long',type:'long',premium:false,cost:0},
 {id:'pony',label:'Queue',type:'pony',premium:false,cost:0},
 {id:'bun',label:'Chignon',type:'bun',premium:false,cost:0},
 {id:'curly',label:'Boucle',type:'curly',premium:false,cost:0},
 {id:'mohawk',label:'Crete',type:'mohawk',premium:false,cost:0},
 {id:'bald',label:'Chauve',type:'bald',premium:false,cost:0}
];
// EXPRESSIONS DE VISAGE : type pilote yeux + bouche dans drawHeroBody.
const FACE_OPTIONS=[
 {id:'neutral',label:'Neutre',type:'neutral'},
 {id:'happy',label:'Sourire',type:'happy'},
 {id:'wink',label:'Clin',type:'wink'},
 {id:'angry',label:'Fache',type:'angry'},
 {id:'surprise',label:'Surpris',type:'surprise'},
 {id:'cool',label:'Lunettes',type:'cool'}
];
// Cherche un cosmétique par id dans la bonne liste (helper unique pour tenue/coiffe/pantalon/chaussures).
function findCosmetic(list,id){return list.find(o=>o.id===id)||list[0]}
function getProfile(){
 // couleurs par vêtement : -1 = couleur d'origine du vêtement. hair/face = id ; hairColor = index palette cheveux.
 let d={base:0,shirt:-1,skin:-1,hat:'fedora',name:'',top:'tshirt',pants:'trousers',shoes:'boots',
  topColor:-1,pantsColor:-1,shoeColor:-1,hatColor:-1,hair:'short',hairColor:1,face:'neutral'};
 try{let p=JSON.parse(localStorage.getItem('temple-profile')||'{}')||{};
  if(typeof p.base==='number')d.base=p.base;
  if(typeof p.shirt==='number')d.shirt=p.shirt;
  if(typeof p.skin==='number')d.skin=p.skin;
  if(typeof p.hat==='string')d.hat=p.hat;
  if(typeof p.name==='string')d.name=p.name.slice(0,12);
  if(typeof p.top==='string')d.top=p.top;
  if(typeof p.pants==='string')d.pants=p.pants;
  if(typeof p.shoes==='string')d.shoes=p.shoes;
  if(typeof p.topColor==='number')d.topColor=p.topColor;
  if(typeof p.pantsColor==='number')d.pantsColor=p.pantsColor;
  if(typeof p.shoeColor==='number')d.shoeColor=p.shoeColor;
  if(typeof p.hatColor==='number')d.hatColor=p.hatColor;
  if(typeof p.hair==='string')d.hair=p.hair;
  if(typeof p.hairColor==='number')d.hairColor=p.hairColor;
  if(typeof p.face==='string')d.face=p.face;
 }catch(e){}
 return d;
}
function saveProfile(p){try{localStorage.setItem('temple-profile',JSON.stringify(p))}catch(e){}}
// Apparence EFFECTIVE du héros : couleurs de base du perso sélectionné, surchargées par le profil
// (palette de tenue/peau choisie) + coiffe/accessoire. Utilisée par drawPlayer & l'aperçu.
function activeLook(baseIndex){
 let bi=(typeof baseIndex==='number')?baseIndex:selectedCharacter;
 let base=CHARACTERS[bi]||CHARACTERS[0];
 let p=getProfile();
 let shirt=(p.shirt>=0&&SHIRT_PALETTE[p.shirt])?SHIRT_PALETTE[p.shirt]:base.shirt;
 let skin=(p.skin>=0&&SKIN_PALETTE[p.skin])?SKIN_PALETTE[p.skin]:base.skin;
 let hatOpt=HAT_OPTIONS.find(o=>o.id===p.hat);
 // couleur de coiffe/accessoire : surcharge palette si choisie, sinon couleur d'origine de l'accessoire.
 let hatBase=(hatOpt&&hatOpt.type!=='none'&&isUnlocked(p.hat))?hatOpt.c:base.hat;
 let hat=(p.hatColor>=0&&CLOTH_PALETTE[p.hatColor])?CLOTH_PALETTE[p.hatColor]:hatBase;
 let hatType=(hatOpt&&isUnlocked(p.hat))?hatOpt.type:'base';
 // Vêtements par FORME (haut/pantalon/chaussures). Couleur surchargée par CLOTH_PALETTE si choisie ;
 // sinon : haut "null" reprend la tenue, sinon couleur d'origine. Les maillots CDM gardent leurs couleurs.
 let topOpt=findCosmetic(TOP_OPTIONS,p.top);if(!isUnlocked(p.top))topOpt=TOP_OPTIONS[0];
 let pantsOpt=findCosmetic(PANTS_OPTIONS,p.pants);if(!isUnlocked(p.pants))pantsOpt=PANTS_OPTIONS[0];
 let shoeOpt=findCosmetic(SHOE_OPTIONS,p.shoes);if(!isUnlocked(p.shoes))shoeOpt=SHOE_OPTIONS[0];
 let pick=(idx,def)=>(idx>=0&&CLOTH_PALETTE[idx])?CLOTH_PALETTE[idx]:def;
 let topColor=pick(p.topColor,topOpt.c||shirt);
 let pantsColor=pick(p.pantsColor,pantsOpt.c);
 let shoeColor=pick(p.shoeColor,shoeOpt.c);
 // cheveux + visage
 let hairOpt=HAIR_OPTIONS.find(o=>o.id===p.hair)||HAIR_OPTIONS[0];
 let hairColor=HAIR_PALETTE[p.hairColor]||HAIR_PALETTE[1];
 let faceOpt=FACE_OPTIONS.find(o=>o.id===p.face)||FACE_OPTIONS[0];
 return{shirt,skin,hat,hatType,base:bi,
  top:topOpt.type,topColor,topCdm:topOpt.cdm||null,
  pants:pantsOpt.type,pantsColor,
  shoes:shoeOpt.type,shoeColor,
  hair:hairOpt.type,hairColor,face:faceOpt.type};
}
// Look "d'usine" d'un perso de base (sa propre tenue/peau/coiffe, vêtements par défaut) —
// utilisé pour les vignettes de sélection, indépendamment de la personnalisation en cours.
function baseLook(bi){
 let base=CHARACTERS[bi]||CHARACTERS[0];
 return{shirt:base.shirt,skin:base.skin,hat:base.hat,hatType:'base',base:bi,
  top:TOP_OPTIONS[0].type,topColor:base.shirt,topCdm:null,
  pants:PANTS_OPTIONS[0].type,pantsColor:PANTS_OPTIONS[0].c,
  shoes:SHOE_OPTIONS[0].type,shoeColor:SHOE_OPTIONS[0].c,
  hair:'short',hairColor:HAIR_PALETTE[1],face:'neutral'};
}
// Déblocages premium (cosmétiques payants achetés). Recherche dans toutes les listes.
function getUnlocks(){try{return JSON.parse(localStorage.getItem('temple-unlocks')||'{}')||{}}catch(e){return{}}}
function findAnyCosmetic(id){return HAT_OPTIONS.find(o=>o.id===id)||TOP_OPTIONS.find(o=>o.id===id)||PANTS_OPTIONS.find(o=>o.id===id)||SHOE_OPTIONS.find(o=>o.id===id)}
function isUnlocked(id){if(!id)return true;let h=findAnyCosmetic(id);if(!h)return false;if(!h.premium)return true;return !!getUnlocks()[id]}
function unlockCosmetic(id){let h=findAnyCosmetic(id);if(!h||!h.premium)return true;if(getUnlocks()[id])return true;if(!spendRubis(h.cost))return false;let u=getUnlocks();u[id]=1;try{localStorage.setItem('temple-unlocks',JSON.stringify(u))}catch(e){}return true}
function unlockHat(id){return unlockCosmetic(id)}

// ── DIFFICULTÉ (Phase 7) ─────────────────────────────────────────────────────────────────────
// Multiplicateurs appliqués au gameplay : pièges, chrono, mobs hostiles, boss.
const DIFFICULTIES={
 FACILE:  {label:'FACILE',  trap:.6, time:1.4, mob:.7, boss:.7, c:'#3f7d57'},
 MOYEN:   {label:'MOYEN',   trap:1,  time:1,   mob:1,  boss:1,  c:'#3a6ea5'},
 DIFFICILE:{label:'DIFFICILE',trap:1.4,time:.8, mob:1.3,boss:1.3,c:'#c9882f'},
 EXTREME: {label:'EXTRÊME', trap:1.9, time:.62,mob:1.7,boss:1.7,c:'#b1503c'}
};
const DIFF_KEYS=['FACILE','MOYEN','DIFFICILE','EXTREME'];
function getDifficulty(){try{let d=localStorage.getItem('temple-difficulty')||'MOYEN';return DIFFICULTIES[d]?d:'MOYEN'}catch(e){return'MOYEN'}}
function setDifficulty(d){if(DIFFICULTIES[d]){try{localStorage.setItem('temple-difficulty',d)}catch(e){}}}
function diff(){return DIFFICULTIES[getDifficulty()]||DIFFICULTIES.MOYEN}

// ── MIGRATION (idempotente) : ancien temple-perks → skills équivalents + pécule rubis. ─────────
function migrateSkills(){
 try{
  if(localStorage.getItem('temple-skills-migrated'))return;
  let p=getPerks();let s=getSkills();let credit=0;
  if(p.heart&&s.vie<1){s.vie=1;credit+=30}
  if(p.dash&&s.dash<1){s.dash=1;credit+=35}
  if(p.whip&&s.fouet<1){s.fouet=1;credit+=30}
  localStorage.setItem('temple-skills',JSON.stringify(s));
  if(credit>0)addRubis(credit);
  localStorage.setItem('temple-skills-migrated','1');
 }catch(e){}
}
migrateSkills();

let perkDashMag=10.5,perkDashCd=1.3,perkWhipRange=1;
let perkSpeedMul=1,perkOneShot=0,bonusVie=0,bonusSouffle=0;
// PV continus (remplacent les cœurs). maxHp recalculé dans applyPerks ; swimMax pour le souffle.
let hp=100,maxHp=100,swimMax=5;
const HP_HIT=25;       // dégâts d'un coup (piège/ennemi)
const HP_QUIZ=20;      // dégâts d'une mauvaise réponse au quiz
const HP_HEAL=30;      // soin d'un consommable
function applyPerks(){let s=getSkills();
 // VITALITÉ : bonus de PV max (Phase 1 utilise bonusVie pour maxHp).
 bonusVie=s.vie>0?SKILL_TREE.vie.tiers[s.vie-1].bonus:0;
 maxHp=Math.round(100*(1+bonusVie));
 // SOUFFLE : durée d'apnée accrue.
 bonusSouffle=s.souffle>0?SKILL_TREE.souffle.tiers[s.souffle-1].bonus:0;
 swimMax=5*(1+bonusSouffle);
 // VITESSE : multiplicateur de déplacement.
 perkSpeedMul=1+(s.vitesse>0?SKILL_TREE.vitesse.tiers[s.vitesse-1].bonus:0);
 // FOUET : portée.
 perkWhipRange=s.fouet>0?SKILL_TREE.fouet.tiers[s.fouet-1].bonus:1;
 // DASH : impulsion + récupération.
 if(s.dash>0){let t=SKILL_TREE.dash.tiers[s.dash-1];perkDashMag=t.mag;perkDashCd=t.cd}
 else{perkDashMag=10.5;perkDashCd=1.3}
 // FRAPPE LÉTALE : 0=normal, 1=K.O. bêtes étourdies, 2=tous hostiles.
 perkOneShot=s.oneshot>0?SKILL_TREE.oneshot.tiers[s.oneshot-1].lvl:0;
}
function impact(power=.16){cam.pulse=Math.max(cam.pulse,power);if(settingsData.shake)cam.shake=Math.max(cam.shake,power*35)}
function rng(n){return Math.floor(Math.random()*n)}function odd(n){return Math.floor(n/2)*2+1}
// ===== Génération de carte : un archétype de forme par biome =====
// Forme de carte : par défaut liée au thème, MAIS variée selon le chapitre pour que deux niveaux
// du même biome ne se ressemblent pas (ex. les 3 jungles 5ᵉ ont des tracés différents).
// ── PALETTE DE TUILES PAR BIOME ───────────────────────────────────────────────────────────
// Les générateurs sont STRUCTURELS et agnostiques : ils manipulent des rôles (ground/wall/
// liquid/deadly/rim/veg/treeWall) et non des nombres en dur. biomeTiles() résout ces rôles
// selon le biome → une MÊME structure (lac central, rivière…) « lit » glace en taïga, lave en
// volcan, eau turquoise à Yellowstone. C'est ce qui multiplie la variété perçue.
function biomeTiles(){
 let n=currentTheme.n;
 let p={ground:0,wall:3,treeWall:1,liquid:2,deadly:6,rim:4,veg:5};
 if(n==='VOLCAN'){p.liquid=6;p.deadly=6}                          // pas d'eau sûre : lave partout
 if(['TAIGA','GLACIER','MONTAGNE'].includes(n))p.ground=4;        // sol = neige
 if(['DESERT','DUNES','SAVANE'].includes(n))p.ground=4;           // sol = sable
 return p;
}
// ── REGISTRE DE GÉNÉRATEURS STRUCTURELS ───────────────────────────────────────────────────
// 17 structures distinctes. Combinées au remapping de tuiles + au tirage pondéré aléatoire,
// elles produisent BEAUCOUP plus de 4 agencements ressentis par biome.
const GENERATORS={
 mazeOrganic:genMazeOrganic,clearingsChain:genClearingsChain,centralLake:genCentralLake,
 serpentineRiver:genSerpentineRiver,fanCanyon:genFanCanyon,concentricRings:genConcentricRings,
 spiral:genSpiral,archipelago:genArchipelagoN,crevasseFields:genCrevasseFields,
 combesPasses:genCombesPasses,geyserBasins:genGeyserBasins,mangrove:genMangrove,
 ruinsInSand:genRuinsInSand,hexBasalt:genHexBasalt,gridRooms:genGridRooms,
 cavernsN:genCavernsN,dunesFan:genDunesFan
};
// Bordure rocheuse (murs 3) pour ces structures ; sinon eau/lave (6).
const ROCKY_ARCHES=new Set(['fanCanyon','dunesFan','cavernsN','gridRooms','combesPasses',
 'hexBasalt','spiral','concentricRings','ruinsInSand']);
// Palettes pondérées : chaque biome pioche dans 5-6 structures compatibles.
const GEN_PALETTES={
 FORET:[['mazeOrganic',3],['clearingsChain',3],['centralLake',2],['serpentineRiver',2],['concentricRings',1]],
 PLAGE:[['archipelago',3],['centralLake',2],['mangrove',2],['serpentineRiver',2],['clearingsChain',1]],
 TAIGA:[['centralLake',3],['crevasseFields',2],['combesPasses',2],['clearingsChain',2],['mazeOrganic',1]],
 DESERT:[['fanCanyon',3],['ruinsInSand',3],['dunesFan',2],['spiral',2],['concentricRings',1]],
 VOLCAN:[['cavernsN',3],['crevasseFields',2],['geyserBasins',2],['concentricRings',2],['hexBasalt',1]],
 GROTTE:[['cavernsN',4],['mazeOrganic',2],['gridRooms',2],['spiral',1],['concentricRings',1]],
 JUNGLE:[['serpentineRiver',3],['mangrove',3],['mazeOrganic',2],['clearingsChain',2],['centralLake',1]],
 DUNES:[['dunesFan',3],['fanCanyon',3],['ruinsInSand',2],['spiral',2],['concentricRings',1]],
 SEQUOIAS:[['clearingsChain',3],['mazeOrganic',3],['centralLake',2],['serpentineRiver',1],['combesPasses',1]],
 MARECAGE:[['mangrove',3],['serpentineRiver',3],['archipelago',2],['centralLake',2],['mazeOrganic',1]],
 SAVANE:[['clearingsChain',3],['serpentineRiver',2],['ruinsInSand',2],['centralLake',2],['fanCanyon',1]],
 ISLANDE:[['hexBasalt',3],['fanCanyon',2],['geyserBasins',2],['combesPasses',2],['concentricRings',2],['spiral',1]],
 YELLOWSTONE:[['geyserBasins',3],['centralLake',2],['gridRooms',2],['concentricRings',2],['serpentineRiver',1]],
 GLACIER:[['centralLake',3],['crevasseFields',3],['archipelago',2],['combesPasses',2],['clearingsChain',1]],
 MONTAGNE:[['combesPasses',3],['crevasseFields',2],['clearingsChain',2],['cavernsN',2],['spiral',1],['fanCanyon',1]]
};
function mazeArchetype(){
 let pal=GEN_PALETTES[currentTheme.n]||[['mazeOrganic',1]];
 // base déterministe par chapitre + jitter de rejouabilité (mazeArchetype._roll)
 let seed=((selectedChapter||0)*2654435761+(mazeArchetype._roll||0))>>>0;
 let total=pal.reduce((s,e)=>s+e[1],0),r=(seed%1000)/1000*total,acc=0;
 for(let e of pal){acc+=e[1];if(r<acc)return e[0]}
 return pal[0][0];
}
// helper : pose une ellipse bruitée d'un type de tuile, filtrée par les types existants
function mazeBlob(type,cx,cy,rx,ry,only){for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){let wobble=Math.sin(x*1.31+y*.73)*.18+Math.cos(y*1.77-x*.61)*.13;if(((x-cx)/rx)**2+((y-cy)/ry)**2+wobble<1&&(!only||only.includes(map[y][x])))map[y][x]=type}}
// helper : creuse un couloir rectiligne (largeur w) de sol (type 0) entre deux points
function carveCorridor(x0,y0,x1,y1,w){w=w||1;let hw=(w-1)/2;let hx0=Math.min(x0,x1),hx1=Math.max(x0,x1),vy0=Math.min(y0,y1),vy1=Math.max(y0,y1);for(let x=hx0;x<=hx1;x++)for(let o=-Math.floor(hw);o<=Math.ceil(hw);o++){let yy=y0+o;if(yy>0&&yy<MH-1&&x>0&&x<MW-1)map[yy][x]=0}for(let y=vy0;y<=vy1;y++)for(let o=-Math.floor(hw);o<=Math.ceil(hw);o++){let xx=x1+o;if(y>0&&y<MH-1&&xx>0&&xx<MW-1)map[y][xx]=0}}
// helper : remplit un rectangle de salle (intérieur type 0)
function carveRoom(x,y,w,h,floor){floor=floor==null?0:floor;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(xx>0&&yy>0&&xx<MW-1&&yy<MH-1)map[yy][xx]=floor}
// Creuse une salle de Ruines à la SILHOUETTE ORGANIQUE (pas un rectangle net) :
//  • coins biseautés en escalier (chanfreins) → contour anguleux de temple ancien ;
//  • renfoncements/alcôves aléatoires le long des murs ;
//  • le cœur reste toujours dégagé (connexité assurée ensuite par ensureRuinsConnected).
function carveRoomOrganic(r){
 carveRoom(r.x,r.y,r.w,r.h,0);
 let bevel=1+rng(2); // profondeur du chanfrein de coin
 // chanfreins des 4 coins (remur en marche d'escalier)
 for(let i=0;i<bevel;i++)for(let j=0;j<bevel-i;j++){
  map[r.y+i][r.x+j]=3;map[r.y+i][r.x+r.w-1-j]=3;
  map[r.y+r.h-1-i][r.x+j]=3;map[r.y+r.h-1-i][r.x+r.w-1-j]=3;
 }
 // renfoncements le long des bords longs (1 sur 4 colonnes/lignes) → mur dentelé
 for(let xx=r.x+2;xx<r.x+r.w-2;xx++){if(rng(4)===0){map[r.y][xx]=3;if(rng(2)===0)map[r.y+1][xx]=3}if(rng(4)===0){map[r.y+r.h-1][xx]=3;if(rng(2)===0)map[r.y+r.h-2][xx]=3}}
 for(let yy=r.y+2;yy<r.y+r.h-2;yy++){if(rng(4)===0){map[yy][r.x]=3;if(rng(2)===0)map[yy][r.x+1]=3}if(rng(4)===0){map[yy][r.x+r.w-1]=3;if(rng(2)===0)map[yy][r.x+r.w-2]=3}}
}
// NOYAU DE SOL GARANTI : recreuse un bloc de sol franc centré sur r.cx,r.cy (taille adaptée à
// la salle). Annule tout mur posé par carveRoomOrganic au cœur de la salle → centre et alentours
// TOUJOURS praticables. Indispensable pour : spawn, sortie, dalles/leviers/simon/portails posés
// au centre, et fallback de freeRoomCell. Reste borné À L'INTÉRIEUR de la salle (marge de 1 mur).
function clearRoomCore(r){
 let cw=Math.max(1,Math.min(Math.floor((r.w-2)/2),3)); // demi-largeur du noyau (≤3)
 let chh=Math.max(1,Math.min(Math.floor((r.h-2)/2),2)); // demi-hauteur du noyau (≤2)
 for(let dy=-chh;dy<=chh;dy++)for(let dx=-cw;dx<=cw;dx++){
  let x=r.cx+dx,y=r.cy+dy;
  if(x>r.x&&x<r.x+r.w-1&&y>r.y&&y<r.y+r.h-1)map[y][x]=0;
 }
}
function generateMaze(){
 map=Array.from({length:MH},()=>Array(MW).fill(2));
 generateMaze._lowRelief=false;
 let arch=mazeArchetype(),P=biomeTiles();
 (GENERATORS[arch]||genMazeOrganic)(P);
 generateMaze._arch=arch;
 openUp(P);      // érode les murs/arbres isolés → niveaux globalement plus ouverts
 carveConnect();
 finalizeBorder(arch);
 addOasis(arch);
 addAltitude(arch);
}
// OASIS : sur les biomes chauds, pose une mare d'eau claire (type 2) bordée d'herbe (5) et de palmiers/déco,
// comme point de repère rafraîchissant. Évite les biomes qui gèrent déjà leur eau (DUNES a la sienne).
function addOasis(arch){
 let hot={DESERT:1,SAVANE:1,YELLOWSTONE:1,VOLCAN:0}[currentTheme.n];
 if(!hot)return;
 let n=currentTheme.n==='SAVANE'?2:1; // savane : quelques points d'eau
 for(let k=0;k<n;k++){
  // cherche un centre praticable pour ne pas noyer un mur isolé
  let ox=8+rng(MW-16),oy=6+rng(MH-12);
  // bassin d'eau claire (la mare d'oasis n'est pas mortelle : type 2 = eau peu profonde nageable)
  mazeBlob(2,ox,oy,1+rng(2),1+rng(1),[0,4,5,3]);
  // ceinture d'herbe verte luxuriante autour
  mazeBlob(5,ox,oy,2+rng(2),1+rng(2),[0,4,3]);
 }
}
// LAYERING D'ALTITUDE : superpose un relief par-dessus la carte de tuiles plate.
//  elev[y][x] = 0 (plat), 1 (colline/plateau surélevé : ralentit, ombre portée, sommet éclairé),
//               2 (crevasse : faille mortelle qui coupe le terrain).
// On ne touche PAS à map[] (la praticabilité de base reste lisible) ; le relief est une couche
// visuelle + une légère mécanique, sauf les crevasses qui deviennent mortelles via crevasseAt().
function addAltitude(arch){
 elev=Array.from({length:MH},()=>Array(MW).fill(0));
 // RELIEF SELON LE BIOME (demande joueur) : seuls les biomes de MONTAGNE ont du relief.
 // Tous les autres = plaines OUVERTES, quasi plates (les montagnes restent en arrière-plan/lointain).
 // RELIEF TRÈS RÉDUIT (demande joueur) : les niveaux étaient bien trop montagneux.
 // Seule la MONTAGNE garde un soupçon de relief ; tous les autres biomes sont désormais (quasi) plats.
 let hilly={MONTAGNE:.35,GLACIER:.2,TAIGA:.12,ISLANDE:.08}[currentTheme.n];
 if(hilly==null)hilly=0; // savane/désert/dunes/plage/forêt/jungle/marécage/yellowstone/volcan/labo/séquoias = plat
 // Générateurs déjà fracturés par des chenaux mortels (crevasses/cavernes) : on évite d'ajouter
 // un relief par-dessus, qui rendrait la carte trop hachée/injouable.
 if(generateMaze._lowRelief)hilly=Math.min(hilly,.1);
 let walk=(v)=>v===0||v===4||v===5; // on ne surélève que du sol franchissable
 // 1) COLLINES : au plus UNE petite butte compacte, et seulement sur les biomes montagneux.
 //    Reliefs volontairement TRÈS RARES pour garder des niveaux ouverts et lisibles.
 let nHills=Math.min(1,Math.round((1+rng(2))*hilly));
 for(let i=0;i<nHills;i++){
  let cx=5+rng(MW-10),cy=4+rng(MH-8),rx=1+rng(1),ry=1;
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
   let wob=Math.sin(x*1.2+y*.8)*.16+Math.cos(y*1.6-x*.5)*.12;
   if(((x-cx)/rx)**2+((y-cy)/ry)**2+wob<1&&walk(map[y][x]))elev[y][x]=1;
  }
 }
 // 2) CREVASSES : supprimées presque partout. Au plus UNE faille étroite, uniquement en MONTAGNE,
 //    et rarement, pour ne jamais hacher le terrain.
 let nCrev=(generateMaze._lowRelief||currentTheme.n!=='MONTAGNE')?0:(rng(3)===0?1:0);
 for(let c=0;c<nCrev;c++){
  let vert=rng(2)===0;
  if(vert){let x=6+rng(MW-12);for(let y=3;y<MH-3;y++){x+=rng(3)-1;x=Math.max(4,Math.min(MW-5,x));if(walk(map[y][x])){elev[y][x]=2;if(rng(2)===0&&walk(map[y][x+1]))elev[y][x+1]=2}}}
  else{let y=5+rng(MH-10);for(let x=3;x<MW-3;x++){y+=rng(3)-1;y=Math.max(4,Math.min(MH-5,y));if(walk(map[y][x])){elev[y][x]=2;if(rng(2)===0&&map[y+1]&&walk(map[y+1][x]))elev[y+1][x]=2}}}
 }
 // 3) Sécurité connexité : on ne laisse jamais une crevasse isoler le spawn/un artefact.
 //    Si une crevasse coupe tout, carveConnect a déjà garanti map[] connexe ; on perce des
 //    « ponts » réguliers dans les longues crevasses pour garantir un passage.
 ensureAltitudeWalkable();
}
// Garantit qu'aucune crevasse ne forme une barrière infranchissable : tous les 4-5 tuiles,
// on remet un pont (elev 0) au milieu d'une crevasse pour laisser passer.
function ensureAltitudeWalkable(){
 for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++){
  if(elev[y][x]!==2)continue;
  // pont horizontal périodique
  if((x+y)%5===0)elev[y][x]=0;
 }
}
// Une crevasse est mortelle (comme un trou) si on tombe dedans et qu'on ne dash pas par-dessus.
function crevasseAt(x,y){let tx=Math.floor(x),ty=Math.floor(y);return elev[ty]&&elev[ty][tx]===2}
function hillAt(x,y){let tx=Math.floor(x),ty=Math.floor(y);return elev[ty]&&elev[ty][tx]===1}
// Bordure mortelle (empêche de sortir, caméra centrée).
// Forme « organique » : l'épaisseur de la côte ondule au lieu d'un cadre droit (casse l'effet « carré »).
// Type de bordure selon l'archétype : eau profonde (6) par défaut, murs de pierre (3) en milieu rocheux.
function finalizeBorder(arch){
 let rocky=ROCKY_ARCHES.has(arch);
 let edgeTile=rocky?3:6;
 // épaisseur de bord bruitée le long de chaque côté (2 à 4 tuiles)
 let noise=(a,b)=>2+Math.round((Math.sin(a*.9+b*.5)+Math.sin(a*.37-b*1.1))*.9+1.4);
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  let thN=noise(x,0),thS=noise(x,7),thW=noise(y,3),thE=noise(y,11);
  let inEdge = y<thN || y>=MH-thS || x<thW || x>=MW-thE;
  // garde toujours au moins 2 tuiles de bord garanties (sécurité anti-sortie)
  let hard=Math.min(x,y,MW-1-x,MH-1-y)<2;
  if(inEdge||hard)map[y][x]=edgeTile;
  else if(Math.min(x,y,MW-1-x,MH-1-y)<3&&map[y][x]===2&&Math.random()<.4)map[y][x]=edgeTile;
 }
}
// Garantit la connexité : flood depuis le centre, puis relie chaque îlot praticable isolé au noyau.
function carveConnect(){
 // tuiles praticables = tout sauf murs (1 arbre, 3 pierre) et 6 (mortel)
 let walk=(v)=>v===0||v===2||v===4||v===5;
 let seedX=Math.floor(MW/2),seedY=Math.floor(MH/2);
 // trouve une graine praticable proche du centre
 outer:for(let r=0;r<14;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){let x=seedX+dx,y=seedY+dy;if(x>1&&y>1&&x<MW-2&&y<MH-2&&walk(map[y][x])){seedX=x;seedY=y;break outer}}
 for(let pass=0;pass<3;pass++){
  let seen=Array.from({length:MH},()=>Array(MW).fill(false));
  let q=[[seedX,seedY]];seen[seedY][seedX]=true;
  while(q.length){let[cx,cy]=q.pop();for(let[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){let nx=cx+dx,ny=cy+dy;if(nx>0&&ny>0&&nx<MW-1&&ny<MH-1&&!seen[ny][nx]&&walk(map[ny][nx])){seen[ny][nx]=true;q.push([nx,ny])}}}
  // toute cellule praticable non atteinte : creuse un couloir vers la graine
  let isolated=null;for(let y=2;y<MH-2&&!isolated;y++)for(let x=2;x<MW-2;x++)if(walk(map[y][x])&&!seen[y][x]){isolated=[x,y];break}
  if(!isolated)break;
  carveCorridor(isolated[0],isolated[1],seedX,seedY,2);
 }
}
// OUVERTURE GLOBALE : érode les murs (pierre 3 / arbre 1) trop isolés ou en fines cloisons
// pour des niveaux plus aérés et lisibles. On préserve les gros massifs (≥5 voisins murs)
// pour garder du relief, mais on supprime les murs solitaires/diagonaux qui hachent l'espace.
// Appelé AVANT carveConnect → la connexité reste garantie ensuite.
function openUp(P){
 let isWall=(v)=>v===1||v===3;
 let snapshot=map.map(r=>r.slice());
 let ground=P.ground;
 for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++){
  if(!isWall(snapshot[y][x]))continue;
  // compte les voisins murs (8-voisinage) dans la copie figée
  let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;if(isWall(snapshot[y+dy][x+dx]))n++}
  // mur isolé (≤2 voisins) ou fine cloison (≤3 voisins) : on ouvre une chance sur deux
  if(n<=3&&rng(2)===0)map[y][x]=ground;
 }
}
// ── ACCESSIBILITÉ RÉELLE (Chantier "niveaux ouverts") ─────────────────────────────────────
// BFS depuis le spawn en utilisant la COLLISION RÉELLE du jeu : une tuile est « atteignable »
// si on peut s'y tenir (pas dans un mur via solid(), pas dans une crevasse mortelle) ET qu'on
// peut y arriver de proche en proche. Sert à GARANTIR que artefacts / PNJ / puits / sortie ne
// soient jamais encerclés par des murs ou des arbres (rayon de collision compris).
function standable(tx,ty){
 if(tx<1||ty<1||tx>=MW-1||ty>=MH-1)return false;
 let t=map[ty]&&map[ty][tx];
 if(t===3||t===1||t===6)return false;          // mur pierre / arbre / mortel
 if(elev[ty]&&elev[ty][tx]===2)return false;    // crevasse
 if(solid(tx+.5,ty+.5))return false;            // collision réelle (rayon arbre voisin)
 return true;
}
function reachableFromSpawn(){
 let seen=Array.from({length:MH},()=>Array(MW).fill(false));
 let sx=Math.floor(spawn.x),sy=Math.floor(spawn.y);
 if(!standable(sx,sy)){ // spawn calé : cherche une case tenable autour
  outer:for(let r=1;r<8;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(standable(sx+dx,sy+dy)){sx+=dx;sy+=dy;break outer}
 }
 let q=[[sx,sy]];seen[sy][sx]=true;
 while(q.length){let[cx,cy]=q.pop();for(let[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){let nx=cx+dx,ny=cy+dy;if(nx>0&&ny>0&&nx<MW-1&&ny<MH-1&&!seen[ny][nx]&&standable(nx,ny)){seen[ny][nx]=true;q.push([nx,ny])}}}
 reachableFromSpawn._seed={x:sx,y:sy};
 return seen;
}
// Renvoie une case atteignable depuis le spawn la plus proche de (tx,ty) — pour reloger un objet encerclé.
function nearestReachable(seen,tx,ty){
 for(let r=0;r<Math.max(MW,MH);r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
  if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
  let x=tx+dx,y=ty+dy;if(x>0&&y>0&&x<MW-1&&y<MH-1&&seen[y]&&seen[y][x])return{x,y};
 }
 return reachableFromSpawn._seed||{x:Math.floor(spawn.x),y:Math.floor(spawn.y)};
}
// FILET DE SÉCURITÉ : relocalise tout artefact / PNJ / puits / sortie injoignable sur la case
// atteignable la plus proche. Garantit « toujours accessible au joueur » (demande du joueur).
function ensureReachable(){
 let seen=reachableFromSpawn();
 let fix=(o,useCenter)=>{if(!o)return;let tx=Math.floor(useCenter?o.x:o.x),ty=Math.floor(useCenter?o.y:o.y);
  if(seen[ty]&&seen[ty][tx])return;let c=nearestReachable(seen,tx,ty);
  if(useCenter){o.x=c.x+.5;o.y=c.y+.5}else{o.x=c.x;o.y=c.y}};
 artifacts.forEach(a=>fix(a,false));
 villagers.forEach(v=>fix(v,true));
 wells.forEach(w=>fix(w,false));
 ruinSites.forEach(r=>fix(r,false));
 fix(exit,false);
}
// pont de terrain (rim P.rim, type sable/neige) large de 2 entre deux îles, au-dessus du liquide profond/mortel
function carveBridge(x0,y0,x1,y1,br){br=br==null?4:br;let hx0=Math.min(x0,x1),hx1=Math.max(x0,x1),vy0=Math.min(y0,y1),vy1=Math.max(y0,y1);for(let x=hx0;x<=hx1;x++)for(let o=0;o<=1;o++){let yy=y0+o;if(yy>1&&yy<MH-2&&x>1&&x<MW-2&&(map[yy][x]===6||map[yy][x]===2))map[yy][x]=br}for(let y=vy0;y<=vy1;y++)for(let o=0;o<=1;o++){let xx=x1+o;if(y>1&&y<MH-2&&xx>1&&xx<MW-2&&(map[y][xx]===6||map[y][xx]===2))map[y][xx]=br}}
// ═══ 17 GÉNÉRATEURS STRUCTURELS ═══════════════════════════════════════════════════════════
// Chacun reçoit la palette P=biomeTiles() et manipule des RÔLES (P.ground/P.wall/P.liquid/
// P.deadly/P.rim/P.veg/P.treeWall) — jamais de nombres en dur. La même structure « lit » donc
// neige en taïga, lave en volcan, eau à Yellowstone : c'est le multiplicateur de variété.
function fill(t){for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)map[y][x]=t}
// 1) LABYRINTHE ORGANIQUE — bosquets de murs + couloirs sinueux + clairières (ex-genMaze).
function genMazeOrganic(P){
 fill(P.ground);
 let wall=P.treeWall!=null&&P.ground===0?P.treeWall:P.wall;
 for(let i=0;i<9;i++)mazeBlob(wall,4+rng(MW-8),4+rng(MH-8),1+rng(2),1+rng(2),[P.ground,P.veg]);
 let cy=Math.floor(MH/2);for(let x=3;x<MW-3;x++){cy+=rng(3)-1;cy=Math.max(4,Math.min(MH-5,cy));for(let o=-1;o<=1;o++)if(map[cy+o])map[cy+o][x]=P.ground}
 let cx=Math.floor(MW/2);for(let y=3;y<MH-3;y++){cx+=rng(3)-1;cx=Math.max(4,Math.min(MW-5,cx));for(let o=-1;o<=1;o++)if(map[y][cx+o]!=null)map[y][cx+o]=P.ground}
 for(let i=0;i<6;i++)mazeBlob(P.ground,5+rng(MW-10),5+rng(MH-10),3+rng(3),2+rng(2),[wall]);
 for(let i=0;i<5;i++)mazeBlob(P.veg,6+rng(MW-12),5+rng(MH-10),2+rng(2),1+rng(2),[P.ground]);
 for(let i=0;i<3;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),1+rng(2),1+rng(2),[P.ground]);
 rimAround(P);
}
// 2) CHAÎNE DE CLAIRIÈRES — grandes salles ouvertes reliées par sentiers, fond végétal/mural.
function genClearingsChain(P){
 let bg=P.ground===0?P.treeWall:P.wall;fill(bg);
 let n=5+rng(2),gl=[];
 for(let i=0;i<n;i++){let cx=6+rng(MW-12),cy=5+rng(MH-10),rx=2+rng(2),ry=2+rng(1);gl.push([cx,cy]);mazeBlob(P.ground,cx,cy,rx,ry,[bg]);mazeBlob(P.veg,cx,cy,rx-1,ry-1,[P.ground])}
 // ordonne par x pour un sentier qui traverse, puis relie en chaîne + une boucle
 gl.sort((a,b)=>a[0]-b[0]);
 for(let i=1;i<gl.length;i++)carveCorridor(gl[i-1][0],gl[i-1][1],gl[i][0],gl[i][1],2);
 carveCorridor(gl[0][0],gl[0][1],gl[gl.length-1][0],gl[gl.length-1][1],1);
 for(let i=0;i<2;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 3) LAC CENTRAL — grande étendue de liquide central, berges praticables, presqu'îles (ex-genFrozen).
function genCentralLake(P){
 fill(P.ground);
 mazeBlob(P.liquid,MW*.5,MH*.5,MW*.32,MH*.28,[P.ground]);
 for(let i=0;i<2;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),3+rng(3),2+rng(2),[P.ground]);
 // presqu'îles : langues de sol qui mordent dans le lac
 for(let i=0;i<4;i++)mazeBlob(P.ground,8+rng(MW-16),6+rng(MH-12),2+rng(2),1+rng(2),[P.liquid]);
 let wall=P.ground===0?P.treeWall:P.wall;
 for(let i=0;i<6;i++)mazeBlob(wall,5+rng(MW-10),4+rng(MH-8),1+rng(2),1+rng(2),[P.ground]);
 for(let i=0;i<3;i++)mazeBlob(P.veg,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 4) RIVIÈRE SERPENTINE — cours d'eau qui traverse, affluent, rives et passerelles (ex-genJungle).
function genSerpentineRiver(P){
 fill(P.ground);
 let wall=P.ground===0?P.treeWall:P.wall;
 let dense=Math.round(10*(currentTheme.density||1));
 for(let i=0;i<dense;i++)mazeBlob(wall,4+rng(MW-8),4+rng(MH-8),1+rng(3),1+rng(2),[P.ground,P.veg]);
 for(let i=0;i<6;i++)mazeBlob(P.veg,4+rng(MW-8),4+rng(MH-8),2+rng(2),1+rng(2),[P.ground]);
 // rivière horizontale ondulante (largeur 2-3)
 let ry=4+rng(MH-8);for(let x=2;x<MW-2;x++){ry+=rng(3)-1;ry=Math.max(4,Math.min(MH-5,ry));let w=2+rng(2);for(let o=0;o<w;o++){let yy=ry+o;if(map[yy])map[yy][x]=P.liquid}}
 // affluent vertical
 let rx=6+rng(MW-12);for(let y=2;y<MH-2;y++){rx+=rng(3)-1;rx=Math.max(4,Math.min(MW-5,rx));for(let o=0;o<2;o++){let xx=rx+o;if(map[y]&&map[y][xx]!=null&&map[y][xx]!==P.liquid)map[y][xx]=P.liquid}}
 // clairières reliées (zones de respiration)
 let gl=[];for(let i=0;i<4;i++){let cx=6+rng(MW-12),cy=5+rng(MH-10);gl.push([cx,cy]);mazeBlob(P.ground,cx,cy,2+rng(2),2,[wall,P.veg])}
 for(let i=1;i<gl.length;i++)carveCorridor(gl[i-1][0],gl[i-1][1],gl[i][0],gl[i][1],2);
 // rives en végétation
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)if(map[y][x]===P.ground&&[map[y-1][x],map[y+1][x],map[y][x-1],map[y][x+1]].includes(P.liquid))map[y][x]=P.veg;
 rimAround(P);
}
// 5) CANYON (vue de dessus) — large PLATEAU de roche fracturé par des GOUFFRES MORTELS (vide)
// organisés en mesas/zones, RELIÉS par des PONTS de pierre étroits (rim) qui enjambent le vide.
// Certains ponts ont une BRÈCHE (1 tuile de vide) qu'il faut franchir au DASH. carveConnect()
// garantit ensuite qu'au moins un chemin relie toutes les zones (accessibilité assurée).
function genFanCanyon(P){
 fill(P.ground); // plateau plein de sol franc (le « dessus » du canyon)
 // 1) ZONES (mesas) : on tire 4-5 centres ; tout ce qui est LOIN d'une mesa devient gouffre.
 let mesas=[];let nM=4+rng(2);
 for(let i=0;i<nM;i++)mesas.push([4+rng(MW-8),4+rng(MH-8),3.4+Math.random()*1.6]);
 for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++){
  let near=mesas.some(m=>{let dx=(x-m[0])/m[2],dy=(y-m[1])/(m[2]*.8);return dx*dx+dy*dy<1});
  if(!near)map[y][x]=P.deadly; // hors mesa → chasme mortel
 }
 // 2) PONTS entre mesas successives (chaîne) + un pont de bouclage → réseau connecté.
 let order=mesas.map((m,i)=>i);
 for(let i=1;i<order.length;i++)canyonBridge(P,mesas[order[i-1]],mesas[order[i]]);
 canyonBridge(P,mesas[0],mesas[order.length-1]);
 // 3) quelques rochers (murs) sur les mesas + un peu de végétation au bord des gouffres.
 for(let i=0;i<5;i++)mazeBlob(P.wall,5+rng(MW-10),4+rng(MH-8),1,1,[P.ground]);
 for(let i=0;i<4;i++)mazeBlob(P.veg,6+rng(MW-12),5+rng(MH-10),1+rng(2),1,[P.ground]);
 rimAround(P); // liseré de roche claire au bord des gouffres (lisibilité du vide)
}
// Trace un PONT de pierre (rim) de 2 de large entre deux mesas, au-dessus du vide, avec parfois
// une brèche d'1 tuile (saut/dash). Le pont remplace le vide (6) par du rim (4 = praticable).
function canyonBridge(P,a,b){
 let x0=Math.round(a[0]),y0=Math.round(a[1]),x1=Math.round(b[0]),y1=Math.round(b[1]);
 let gapAt=2+rng(6); // index de tuile où laisser un trou (si le pont est assez long)
 let lay=(x,y,k)=>{for(let o=0;o<=1;o++){
  let hx=Math.max(2,Math.min(MW-3,x)),hy=Math.max(2,Math.min(MH-3,y+o));
  if(map[hy]&&map[hy][hx]===P.deadly&&!(k===gapAt&&o===0))map[hy][hx]=P.rim;}};
 // segment horizontal puis vertical (en L), pose 2 de large
 let k=0,sx=x0<x1?1:-1; for(let x=x0;x!==x1;x+=sx){lay(x,y0,k++)}
 let sy=y0<y1?1:-1; for(let y=y0;y!==y1+sy;y+=sy){lay(x1,y,k++)}
}
// 6) ANNEAUX CONCENTRIQUES — arènes circulaires emboîtées avec passages décalés.
function genConcentricRings(P){
 fill(P.wall);
 let cx=MW/2,cy=MH/2;
 mazeBlob(P.ground,cx,cy,4,3,[P.wall]); // cœur ouvert
 let rings=[[8,6],[12,9],[16,12]];
 rings.forEach((r,ri)=>{
  let[rx,ry]=r;
  for(let a=0;a<Math.PI*2;a+=.05){let x=Math.round(cx+Math.cos(a)*rx),y=Math.round(cy+Math.sin(a)*ry);if(x>2&&y>2&&x<MW-3&&y<MH-3){map[y][x]=P.ground;if(map[y+1]&&y+1<MH-3)map[y+1][x]=P.ground}}
  // une brèche par anneau (passage entre couronnes), angle décalé
  let ga=ri*1.7+Math.random();for(let k=-2;k<=2;k++){let x=Math.round(cx+Math.cos(ga)*(rx+k)*1),y=Math.round(cy+Math.sin(ga)*(ry+k));carveCorridor(Math.round(cx),Math.round(cy),x,y,2)}
 });
 for(let i=0;i<3;i++)mazeBlob(P.veg,6+rng(MW-12),5+rng(MH-10),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 7) SPIRALE — un unique long couloir en spirale du bord vers le centre.
function genSpiral(P){
 fill(P.wall);
 let cx=MW/2,cy=MH/2,a=0,r=Math.min(MW,MH)*.44,x=cx+r,y=cy;
 carveRoom(Math.floor(cx)-3,Math.floor(cy)-2,6,4,P.ground); // chambre centrale
 while(r>3){a+=.18;r-=.18;let nx=cx+Math.cos(a)*r,ny=cy+Math.sin(a)*r;carveCorridor(Math.round(x),Math.round(y),Math.round(nx),Math.round(ny),2);x=nx;y=ny}
 for(let i=0;i<3;i++)mazeBlob(P.veg,6+rng(MW-12),5+rng(MH-10),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 8) ARCHIPEL — îles séparées par du liquide profond/mortel, reliées par passerelles (ex-genArchipelago).
function genArchipelagoN(P){
 fill(P.deadly);
 let isles=[];for(let i=0;i<6;i++){let cx=6+rng(MW-12),cy=5+rng(MH-10);isles.push([cx,cy]);mazeBlob(P.rim,cx,cy,3+rng(3),2+rng(2),[P.deadly]);mazeBlob(P.ground,cx,cy,2+rng(2),1+rng(2),[P.rim])}
 for(let i=1;i<isles.length;i++)carveBridge(isles[i-1][0],isles[i-1][1],isles[i][0],isles[i][1],P.rim);
 carveBridge(isles[0][0],isles[0][1],isles[isles.length-1][0],isles[isles.length-1][1],P.rim);
 for(let i=0;i<4;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.rim]);
 if(P.ground===0)for(let i=0;i<4;i++)mazeBlob(P.treeWall,6+rng(MW-12),5+rng(MH-10),1+rng(2),1,[P.rim]);
 rimAround(P);
}
// 9) CHAMPS DE CREVASSES — plateforme fracturée par des chenaux mortels parallèles (ex-genGlacier).
function genCrevasseFields(P){
 fill(P.ground);
 // chenaux mortels (verticaux) qui fracturent
 for(let r=0;r<3;r++){let cx=6+r*10+rng(4);for(let y=3;y<MH-3;y++){let xx=Math.max(2,Math.min(MW-3,cx));map[y][xx]=P.deadly;if(rng(2)===0&&map[y][xx+1]!=null)map[y][xx+1]=P.deadly;cx+=rng(3)-1;cx=Math.max(5,Math.min(MW-6,cx))}}
 // ponts (passerelles) réguliers pour traverser
 for(let y=4;y<MH-4;y+=5)carveCorridor(3,y,MW-4,y,2);
 for(let i=0;i<5;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),2+rng(2),1+rng(2),[P.ground]);
 let wall=P.ground===0?P.treeWall:P.wall;
 for(let i=0;i<6;i++)mazeBlob(wall,5+rng(MW-10),4+rng(MH-8),1+rng(2),1,[P.ground]);
 generateMaze._lowRelief=true;
 rimAround(P);
}
// 10) COMBES & COLS — plateaux de sol reliés par sentiers étroits sur fond rocheux (ex-genMountain).
function genCombesPasses(P){
 fill(P.wall);
 let combes=[];for(let i=0;i<6;i++){let cx=6+rng(MW-12),cy=5+rng(MH-10);combes.push([cx,cy]);mazeBlob(P.ground,cx,cy,3+rng(2),2+rng(2),[P.wall])}
 for(let i=1;i<combes.length;i++)carveCorridor(combes[i-1][0],combes[i-1][1],combes[i][0],combes[i][1],2);
 carveCorridor(combes[0][0],combes[0][1],combes[combes.length-1][0],combes[combes.length-1][1],1);
 for(let i=0;i<4;i++)mazeBlob(P.veg,6+rng(MW-12),5+rng(MH-10),2,1+rng(2),[P.ground]);
 let wall=P.ground===0?P.treeWall:P.wall;
 for(let i=0;i<5;i++)mazeBlob(wall,5+rng(MW-10),4+rng(MH-8),1+rng(2),1,[P.ground]);
 for(let i=0;i<2;i++)mazeBlob(P.liquid,8+rng(MW-16),6+rng(MH-12),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 11) BASSINS DE GEYSERS — terrasses de sol parsemées de bassins liquides circulaires (Yellowstone).
function genGeyserBasins(P){
 fill(P.ground);
 let nB=6+rng(3);
 for(let i=0;i<nB;i++){let cx=6+rng(MW-12),cy=5+rng(MH-10),rr=1+rng(2);
  mazeBlob(P.liquid,cx,cy,rr,rr,[P.ground]);            // bassin
  mazeBlob(P.veg,cx,cy,rr+1,rr+1,[P.ground]);           // dépôt minéral/herbe autour (anneau)
  // re-creuse le centre liquide (la couronne veg ne doit pas le recouvrir)
  mazeBlob(P.liquid,cx,cy,rr,rr,[P.veg,P.ground]);
 }
 let wall=P.ground===0?P.treeWall:P.wall;
 for(let i=0;i<5;i++)mazeBlob(wall,5+rng(MW-10),4+rng(MH-8),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 12) MANGROVE — labyrinthe humide : eau peu profonde traversée de langues de terre et racines (murs).
function genMangrove(P){
 fill(P.liquid);
 // langues de terre (sol) qui sillonnent l'eau
 for(let i=0;i<10;i++)mazeBlob(P.ground,5+rng(MW-10),4+rng(MH-8),2+rng(2),1+rng(2),[P.liquid]);
 let cy=Math.floor(MH/2);for(let x=3;x<MW-3;x++){cy+=rng(3)-1;cy=Math.max(4,Math.min(MH-5,cy));for(let o=-1;o<=1;o++)if(map[cy+o])map[cy+o][x]=P.ground}
 let cx=Math.floor(MW/2);for(let y=3;y<MH-3;y++){cx+=rng(3)-1;cx=Math.max(4,Math.min(MW-5,cx));for(let o=-1;o<=1;o++)if(map[y][cx+o]!=null)map[y][cx+o]=P.ground}
 // racines/palétuviers (murs arbres) dispersés
 let wall=P.ground===0?P.treeWall:P.wall;
 for(let i=0;i<12;i++)mazeBlob(wall,5+rng(MW-10),4+rng(MH-8),1,1,[P.ground]);
 for(let i=0;i<5;i++)mazeBlob(P.veg,6+rng(MW-12),5+rng(MH-10),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 13) RUINES DANS LE SABLE — vestiges rectilignes (chambres murées) émergeant d'un désert ouvert.
function genRuinsInSand(P){
 fill(P.ground);
 // quelques chambres murées en pierre, à demi enfouies, reliées par des brèches
 let rooms=[];let cols=3,rows=2;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  if(rng(5)===0)continue; // certaines parcelles restent du désert ouvert
  let rx=4+c*12+rng(2),ry=4+r*11+rng(2),rw=6+rng(3),rh=5+rng(2);
  // murs périphériques
  for(let yy=ry;yy<ry+rh;yy++)for(let xx=rx;xx<rx+rw;xx++)if(xx>1&&yy>1&&xx<MW-2&&yy<MH-2){if(yy===ry||yy===ry+rh-1||xx===rx||xx===rx+rw-1)map[yy][xx]=P.wall;else map[yy][xx]=P.ground}
  rooms.push([rx+Math.floor(rw/2),ry+Math.floor(rh/2)]);
  // une porte (brèche) sur un mur
  let bx=rx+1+rng(rw-2);if(map[ry])map[ry][bx]=P.ground;if(map[ry+rh-1])map[ry+rh-1][bx]=P.ground;
 }
 for(let i=1;i<rooms.length;i++)carveCorridor(rooms[i-1][0],rooms[i-1][1],rooms[i][0],rooms[i][1],2);
 for(let i=0;i<3;i++)mazeBlob(P.veg,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 14) ORGUES BASALTIQUES — réseau hexagonal/alvéolaire de piliers de roche (Islande).
function genHexBasalt(P){
 fill(P.ground);
 // pose des piliers en quinconce (motif alvéolaire) → couloirs entre colonnes
 for(let gy=4;gy<MH-3;gy+=3)for(let gx=4;gx<MW-3;gx+=4){
  let off=(Math.floor(gy/3)%2)?2:0;let x=gx+off,y=gy;
  if(x>2&&y>2&&x<MW-3&&y<MH-3){map[y][x]=P.wall;if(rng(2)===0&&map[y+1])map[y+1][x]=P.wall}
 }
 // creuse 2-3 places ouvertes
 for(let i=0;i<3;i++)mazeBlob(P.ground,6+rng(MW-12),5+rng(MH-10),2+rng(2),2,[P.wall]);
 for(let i=0;i<3;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 for(let i=0;i<3;i++)mazeBlob(P.veg,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 15) SALLES EN GRILLE — chambres rectangulaires reliées par couloirs (ex-genGrid, labo/structuré).
function genGridRooms(P){
 fill(P.wall);
 let cols=3,rows=2,cellW=Math.floor(MW/cols),cellH=Math.floor(MH/rows),centers=[];
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){let rx=c*cellW+3,ry=r*cellH+3,rw=cellW-6,rh=cellH-6;carveRoom(rx,ry,rw,rh,P.ground);centers.push([rx+Math.floor(rw/2),ry+Math.floor(rh/2)])}
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){let idx=r*cols+c;if(c<cols-1)carveCorridor(centers[idx][0],centers[idx][1],centers[idx+1][0],centers[idx+1][1],2);if(r<rows-1)carveCorridor(centers[idx][0],centers[idx][1],centers[idx+cols][0],centers[idx+cols][1],2)}
 for(let i=0;i<3;i++)mazeBlob(P.liquid,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 for(let i=0;i<4;i++)mazeBlob(P.veg,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 rimAround(P);
}
// 16) CAVERNES — salles rocheuses reliées par goulets, traversées de chenaux mortels (ex-genCaverns).
function genCavernsN(P){
 fill(P.wall);
 for(let r=0;r<2;r++){let lx=8+rng(MW-16);for(let y=3;y<MH-3;y++){let xx=Math.max(2,Math.min(MW-3,lx));map[y][xx]=P.deadly;if(map[y][xx+1]!=null&&rng(2)===0)map[y][xx+1]=P.deadly;lx+=rng(3)-1;lx=Math.max(4,Math.min(MW-5,lx))}}
 let caves=[],anchors=[[MW*.27,MH*.30],[MW*.73,MH*.30],[MW*.27,MH*.70],[MW*.73,MH*.70],[MW*.5,MH*.5]];
 anchors.forEach(a=>{let cx=Math.max(5,Math.min(MW-6,Math.round(a[0]+rng(5)-2))),cy=Math.max(5,Math.min(MH-6,Math.round(a[1]+rng(5)-2)));caves.push([cx,cy]);mazeBlob(P.ground,cx,cy,3+rng(2),2+rng(2),[P.wall,P.deadly])});
 for(let i=1;i<caves.length;i++)carveCorridor(caves[i-1][0],caves[i-1][1],caves[i][0],caves[i][1],2);
 carveCorridor(caves[0][0],caves[0][1],caves[3][0],caves[3][1],2);
 for(let i=0;i<4;i++)mazeBlob(P.veg,7+rng(MW-14),6+rng(MH-12),1+rng(2),1,[P.ground]);
 generateMaze._lowRelief=true;
 rimAround(P);
}
// 17) DUNES EN ÉVENTAIL — place centrale + couloirs rayonnants + bandes de dunes (ex-genDunes).
function genDunesFan(P){
 fill(P.wall);
 let hx=Math.floor(MW/2),hy=Math.floor(MH/2);
 mazeBlob(P.ground,hx,hy,3+rng(2),2+rng(2),[P.wall]);
 let spokes=6+rng(3);for(let s=0;s<spokes;s++){let a=s/spokes*Math.PI*2+Math.random()*.4,len=10+rng(8),cx=hx,cy=hy;
  for(let i=0;i<len;i++){cx+=Math.cos(a)+(Math.random()-.5)*.7;cy+=Math.sin(a)+(Math.random()-.5)*.7;let ix=Math.round(cx),iy=Math.round(cy);if(ix>2&&iy>2&&ix<MW-3&&iy<MH-3){map[iy][ix]=P.ground;if(Math.random()<.6&&map[iy+1])map[iy+1][ix]=P.ground}}}
 for(let i=0;i<5;i++)mazeBlob(P.ground,5+rng(MW-10),4+rng(MH-8),3+rng(3),1+rng(2),[P.wall]);
 let ox=8+rng(MW-16),oy=6+rng(MH-12);mazeBlob(P.liquid,ox,oy,1+rng(2),1,[P.ground,P.wall]);mazeBlob(P.veg,ox,oy,2+rng(2),1+rng(2),[P.ground]);
 rimAround(P);
}
// Liseré de transition : pose le rim (sable/neige) à l'interface sol↔liquide pour des bords doux,
// et convertit le sol bordant un liquide profond en rim (évite les « bords secs » sur l'eau).
function rimAround(P){
 if(P.rim===P.ground)return;
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
  if(map[y][x]!==P.ground)continue;
  let near=[map[y-1][x],map[y+1][x],map[y][x-1],map[y][x+1]];
  if(near.includes(P.liquid)||near.includes(P.deadly)){if(rng(3)!==0)map[y][x]=P.rim}
 }
}
// Cases praticables uniquement (type 3 = pierre = mur solide, donc exclu).
function quadrantCell(q){let minX=q%2?Math.floor(MW*.55):2,maxX=q%2?MW-3:Math.floor(MW*.45),minY=q>1?Math.floor(MH*.55):2,maxY=q>1?MH-3:Math.floor(MH*.45);for(let z=0;z<1800;z++){let x=minX+rng(Math.max(1,maxX-minX)),y=minY+rng(Math.max(1,maxY-minY));if([0,4,5].includes(map[y][x])&&!solid(x+.5,y+.5)&&!(elev[y]&&elev[y][x]===2)&&!occupied(x,y,2.5))return{x,y}}return freeCell(5,2.5)}
function freeCell(away=0,gap=1.6,types=[0,4,5]){for(let z=0;z<1200;z++){let x=1+rng(MW-2),y=1+rng(MH-2);if(types.includes(map[y][x])&&!solid(x+.5,y+.5)&&!(elev[y]&&elev[y][x]===2)&&(!player||Math.hypot(x-player.x,y-player.y)>away)&&!occupied(x,y,gap))return{x,y}}
 // Fallback robuste : balaye toute la carte pour une case praticable (jamais un mur).
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)if([0,4,5].includes(map[y][x])&&!solid(x+.5,y+.5))return{x,y};
 return{x:Math.floor(MW/2),y:Math.floor(MH/2)}}
function occupied(x,y,gap=1.3){let all=[...artifacts,...holes,...traps,...quicksands,...snakes,...animals,...geysers];if(player)all.push(player);if(exit)all.push(exit);return all.some(a=>!a.taken&&Math.hypot((a.x||0)-x,(a.y||0)-y)<gap)}
// ════ ENRICHISSEMENT DES BIOMES (structures + décor au sol) ═══════════════════
// Points d'intérêt par biome : grands repères de paysage qui donnent un caractère propre à
// chaque niveau (totem, épave, ruine, cristal…). Posés sur le sol, jamais sur un obstacle.
const BIOME_STRUCT={
 FORET:['totem','menhir','log','shrine'],PLAGE:['palmgrove','shipwreck','shell','log'],
 TAIGA:['cairn','frozentree','igloo','shrine'],DESERT:['obelisk','ruinpillar','skull','tent'],
 VOLCAN:['basaltcol','lavarock','skull','obelisk'],GROTTE:['crystal','basaltcol','mossrock','cairn'],
 JUNGLE:['idolhead','vinetower','ziggurat','totem'],DUNES:['obelisk','buriedstatue','tent','skull'],
 SEQUOIAS:['gianttrunk','mossrock','shrine','log'],MARECAGE:['deadtree','hut','mossrock','totem'],
 SAVANE:['acacia','termite','bones','skull'],ISLANDE:['basaltcol','geocairn','runestone','cairn'],
 YELLOWSTONE:['mudpot','mudpot','obelisk'],GLACIER:['crystal','frozentree','cairn','runestone'],
 MONTAGNE:['peakcairn','menhir','ruinpillar','shrine']
};
// Grandes structures MASSIVES = vrais obstacles (collision). Les petits décors plats au sol
// (épave, tronc couché, os, coquillage, caisse, mare de boue, sanctuaire bas) restent traversables.
const STRUCT_SOLID=new Set(['obelisk','runestone','menhir','totem','idolhead','ruinpillar','basaltcol','peakcairn','geocairn','cairn','geyserc','gianttrunk','vinetower','deadtree','frozentree','acacia','ziggurat','buriedstatue','hut','igloo','tent','termite','crystal']);
function scatterBiomeStructures(dens){
 let kinds=BIOME_STRUCT[currentTheme.n]||['menhir','shrine'];
 let n=Math.round(4+dens*5);
 // tuiles déjà occupées par un point d'intérêt → une structure SOLIDE ne doit pas s'y poser.
 let occupied=(tx,ty)=>artifacts.some(a=>a.x===tx&&a.y===ty)||(exit&&exit.x===tx&&exit.y===ty)
  ||villagers.some(v=>Math.floor(v.x)===tx&&Math.floor(v.y)===ty)||wells.some(w=>w.x===tx&&w.y===ty)||ruinSites.some(r=>r.x===tx&&r.y===ty);
 for(let i=0;i<n;i++){let c=freeCell(6,2.6,[0,4,5]);if(!c)continue;
  let kind=kinds[rng(kinds.length)],sol=STRUCT_SOLID.has(kind);
  if(sol&&occupied(c.x,c.y))continue; // évite de murer un artefact/PNJ/puits/sortie
  structures.push({x:c.x,y:c.y,kind,seed:rng(1000),pulse:Math.random()*6,solid:sol})}
}
// Décor au sol : petits éléments NON bloquants qui tapissent le terrain (fleurs, cailloux,
// coquillages, ossements, lichen…) → plus aucune zone « vide ». Purement visuel.
const BIOME_DECOR={
 FORET:['flower','mushroom','fern','pebble'],PLAGE:['shellbit','starfish','pebble','seaweed'],
 TAIGA:['snowtuft','pinecone','pebble','iceshard'],DESERT:['cactusbit','bone','pebble','crack'],
 VOLCAN:['ember','obsidian','crack','ash'],GROTTE:['mossbit','pebble','crack','mushroom'],
 JUNGLE:['flower','fern','vinebit','mushroom'],DUNES:['ripple','bone','pebble','cactusbit'],
 SEQUOIAS:['fern','mushroom','mossbit','pinecone'],MARECAGE:['lily','mossbit','reed','bone'],
 SAVANE:['grasstuft','bone','pebble','acaciaseed'],ISLANDE:['mossbit','pebble','iceshard','lichen'],
 YELLOWSTONE:['mineral','crack','mineral','pebble'],GLACIER:['iceshard','snowtuft','crack','pebble'],
 MONTAGNE:['pebble','lichen','snowtuft','edelweiss']
};
function scatterGroundDecor(dens){
 let kinds=BIOME_DECOR[currentTheme.n]||['pebble','flower'];
 let n=Math.round(50+dens*70);
 for(let i=0;i<n;i++){let x=1+rng(MW-2),y=1+rng(MH-2);
  if(![0,4,5].includes(map[y][x]))continue;
  groundDecor.push({x,y,kind:kinds[rng(kinds.length)],s:rng(1000),ox:rng(12)-6,oy:rng(10)-4})}
}
// ── STRUCTURES INTERACTIVES : villageois (quiz, combo 3 = power-up), puits (soin/bonus),
//    ruines explorables (coffre/bonus). Placées sur sol franc, espacées du joueur.
function scatterInteractive(dens){
 // Villageois : 2-3 PNJ disséminés. Combo de 3 bonnes réponses d'affilée → power-up rare garanti.
 let nV=2+rng(2);
 for(let i=0;i<nV;i++){let c=freeCell(7,3,[0,4,5]);if(!c)continue;
  villagers.push({x:c.x+.5,y:c.y+.5,asked:false,done:false,bob:Math.random()*6,kind:rng(3)})}
 // Puits : 1-2. Interaction = soin (si blessé) sinon petit bonus de score, une seule fois.
 let nW=1+rng(2);
 for(let i=0;i<nW;i++){let c=freeCell(6,3,[0,4,5]);if(!c)continue;
  wells.push({x:c.x,y:c.y,used:false,pulse:Math.random()*6})}
 // Ruines explorables : 1-2 petits sites de pierre avec un coffre (bonus garanti).
 let nR=1+rng(2);
 for(let i=0;i<nR;i++){let c=freeCell(8,3.2,[0,4,5]);if(!c)continue;
  buildRuinSite(c.x,c.y)}
}
// Petit site de ruine : anneau de colonnes (murs type 3) autour d'un coffre central.
function buildRuinSite(cx,cy){
 let ring=[[-1,-1],[1,-1],[-1,1],[1,1]];
 ring.forEach(([dx,dy])=>{let x=cx+dx,y=cy+dy;if(map[y]&&[0,4,5].includes(map[y][x])){map[y][x]=3}});
 ruinSites.push({x:cx,y:cy,looted:false,pulse:Math.random()*6,seed:rng(1000)});
}
// ── CHEMINS : relie les points d'intérêt (spawn, artefacts, villageois, puits, sortie) par des
//    sentiers de terre lisibles. On ne fait que « marquer » le sol (groundDecor 'path'), non bloquant.
function carvePaths(){
 let pts=[{x:Math.floor(spawn.x),y:Math.floor(spawn.y)}];
 artifacts.forEach(a=>pts.push({x:a.x,y:a.y}));
 villagers.forEach(v=>pts.push({x:Math.floor(v.x),y:Math.floor(v.y)}));
 wells.forEach(w=>pts.push({x:w.x,y:w.y}));
 if(exit)pts.push({x:exit.x,y:exit.y});
 // relie chaque point au plus proche déjà relié (arbre couvrant glouton → réseau de sentiers).
 let linked=[pts[0]],rest=pts.slice(1);
 while(rest.length){let bi=0,bj=0,bd=1e9;
  for(let i=0;i<linked.length;i++)for(let j=0;j<rest.length;j++){let d=Math.hypot(linked[i].x-rest[j].x,linked[i].y-rest[j].y);if(d<bd){bd=d;bi=i;bj=j}}
  pavePath(linked[bi],rest[bj]);linked.push(rest[bj]);rest.splice(bj,1)}
}
function pavePath(a,b){let x=a.x,y=a.y,guard=0;
 while((x!==b.x||y!==b.y)&&guard++<200){
  if(map[y]&&[0,4,5].includes(map[y][x])&&!groundDecor.some(g=>g.x===x&&g.y===y&&g.kind==='path'))groundDecor.push({x,y,kind:'path',s:0,ox:0,oy:0});
  // avance en escalier vers la cible, en évitant de traverser les murs si possible
  if(x!==b.x&&(y===b.y||rng(2)===0)){let nx=x+Math.sign(b.x-x);if(map[y]&&map[y][nx]!==3)x=nx;else y+=Math.sign(b.y-y)||1}
  else{let ny=y+Math.sign(b.y-y);if(map[ny]&&map[ny][x]!==3)y=ny;else x+=Math.sign(b.x-x)||1}
 }
}
function startGame(ch){
 selectedChapter=ch;isRuins=false;templeTrial=false;bossColossus=false;doors=[];keysArr=[];plates=[];treasure=null;keysHeld=0;currentTheme=THEMES[curThemeMap()[ch]%THEMES.length];biomeName=curBiomes()[ch];menuBiome=currentTheme;boss={active:false,hp:3,max:3};artifacts=[];traps=[];holes=[];quicksands=[];snakes=[];animals=[];powerups=[];bolts=[];minions=[];zones=[];geysers=[];structures=[];groundDecor=[];villagers=[];wells=[];ruinSites=[];pendingVillager=null;villagerStreak=0;windT=0;windDir=0;windX=0;windY=0;windGust=0;windStreaks=[];bossEnt=null;bossPhase='idle';bossTimer=0;exit=null;player=null;
 // MÉTÉO : moment de la journée tiré au sort (nuit plus rare pour la lisibilité). Réinitialise les oiseaux.
 tod=['day','day','day','dawn','sunset','sunset','night'][rng(7)];birds=[];birdTimer=1.5;
 mazeArchetype._roll=rng(100000);generateMaze();spawn=freeCell(0,2,[0]);player={x:spawn.x+.5,y:spawn.y+.5,vx:0,vy:0,dir:1,iceTime:0,sliding:0,swim:1,swimT:0,drown:0,dash:0,dashCd:0,wasDash:false};paused=false;sinkIn=null;score=0;applyPerks();hp=maxHp;lives=3;maxLives=3;treasureBonus=false;time=180;collected=0;inv=1;askedIndices=[];attempts=[];combo=0;maxCombo=0;errors=0;flash=0;floaters=[];shield=0;currentQuestion=null;ambient=[];popFx=[];artifactPowers=[];comboAura=0;trapReveal=0;quizClockOn=false;initAmbient();startMusic();
 // Espace praticable : borne la densité d'obstacles sur les cartes étroites (canyon/grid).
 let walkCells=0;for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)if([0,4,5].includes(map[y][x]))walkCells++;
 let dens=Math.min(1,walkCells/420),nT=Math.round(7+dens*6),nH=Math.round(4+dens*4),nQ=Math.round(2+dens*4);
 for(let i=0;i<4;i++)artifacts.push({...quadrantCell(i),taken:false,pulse:Math.random()*6,kind:currentTheme.artifact});
 let geyHot=currentTheme.n==='YELLOWSTONE';
 // GRANDS GEYSERS (Yellowstone chaud / Islande froid) : quelques colonnes massives au lieu
 // de dizaines de petits pièges. Éruption cyclique : projette ET tue le joueur trop proche.
 let bigGeyserBiome=!isRuins&&(currentTheme.n==='YELLOWSTONE'||currentTheme.n==='ISLANDE');
 if(bigGeyserBiome){
  let nG=4+rng(2); // 4-5 GRANDS geysers, bien espacés (moins nombreux mais massifs)
  for(let i=0;i<nG;i++){
   let c=freeCell(8,3,[0]); // très grand dégagement autour (geyser massif)
   geysers.push({x:c.x,y:c.y,
    phase:Math.random()*9, // décalage de cycle pour qu'ils ne jaillissent pas en même temps
    period:7+Math.random()*4, // un cycle complet (repos → grondement → éruption)
    erupt:2.8, // durée de l'éruption (un peu plus longue, jet plus impressionnant)
    hot:geyHot, hurtRad:2.6, launchRad:2.4, // rayon brûlant + rayon de projection (élargis)
    h:0, // hauteur courante de la colonne (0..1), pour l'animation
    rumble:0, blew:false});
  }
 }
 // Piège secondaire par biome → un peu de variété (le piège principal reste majoritaire).
 let trap2={FORET:'spikes',PLAGE:'spikes',TAIGA:'ice',DESERT:'spikes',VOLCAN:'spikes',GROTTE:'spikes',JUNGLE:'cactus',DUNES:'spikes',SEQUOIAS:'cactus',MARECAGE:'spikes',SAVANE:'cactus',ISLANDE:'spikes',YELLOWSTONE:'lava',GLACIER:'ice',MONTAGNE:'spikes'}[currentTheme.n]||currentTheme.trap;
 // En biome à grands geysers, on retire le piège « geyser » de base (remplacé par les grands).
 let baseTrap=bigGeyserBiome?'lava':(currentTheme.trap==='geyser'?'spikes':currentTheme.trap);
 for(let i=0;i<nT;i++){let tk=(i%3===2)?trap2:baseTrap;traps.push({...freeCell(4,1.8,[0]),phase:Math.random()*(tk==='geyser'?4:3),kind:tk,hot:tk==='geyser'?geyHot:undefined})}
 for(let i=0;i<nH;i++)holes.push(freeCell(5,1.8,[0,5]));
 for(let i=0;i<nQ;i++)quicksands.push({...freeCell(5,2,[4,5]),phase:Math.random()*6});
 let puTypes=['shield','time','star'];for(let i=0;i<3;i++)powerups.push({...freeCell(6,2.4,[0,4,5]),taken:false,kind:puTypes[i%3],pulse:Math.random()*6});
 // Serpents : forêts/plages/jungle + tout biome listant un serpent (rattlesnake).
 if(['FORET','PLAGE','JUNGLE'].includes(currentTheme.n)||currentTheme.animals.includes('rattlesnake')){let nS=Math.round(2+dens*3);for(let i=0;i<nS;i++)snakes.push({...freeCell(7,2),vx:0,vy:0,stun:0,phase:Math.random()*6,turn:Math.random()*5})}
 let animalList=dens<.55?currentTheme.animals:[...currentTheme.animals,...currentTheme.animals];animalList.forEach(type=>animals.push({...freeCell(5,1.8),type,vx:0,vy:0,phase:Math.random()*6,turn:Math.random()*3}));
 // MEUTE DE PRÉDATEURS : 2-3 hôtiles supplémentaires (le ou les prédateurs du biome) qui rôdent
 // et chassent activement le joueur → vrai danger animal dans chaque niveau.
 let preds=currentTheme.animals.filter(a=>['boar','wolf','scorpion','jaguar','rattlesnake'].includes(a));
 if(preds.length){let nP=2+rng(2);for(let i=0;i<nP;i++){let type=preds[rng(preds.length)],c=freeCell(9,2);
  animals.push({...c,type,vx:0,vy:0,phase:Math.random()*6,turn:Math.random()*3,hunter:true})}}
 [...snakes,...animals].forEach(a=>{a.x+=.5;a.y+=.5});
 exit={...freeCell(18),open:false};
 // ENRICHISSEMENT DU BIOME : structures interactives (villageois/puits/ruines), chemins,
 // grands repères de paysage + tapis de décor au sol.
 scatterInteractive(dens);scatterBiomeStructures(dens);scatterGroundDecor(dens);
 ensureReachable(); // garantit que rien (artefact/PNJ/puits/sortie) n'est encerclé/injoignable
 carvePaths();
 ui.chapterHud.textContent=noAcc(biomeName)+' - CH. '+(ch+1);ui.goalLabel.textContent='TEMPLE';show('play');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)
}
function solid(x,y){let tx=Math.floor(x),ty=Math.floor(y);if(tx<0||ty<0||tx>=MW||ty>=MH)return true;
 // Murs de pierre (type 3) : bloquants partout (corrige le « on marche sur les murs »).
 if(map[ty]&&map[ty][tx]===3)return true;
 let treeRadius=currentTheme.tree==='cactus'?.62:.78;for(let yy=ty-1;yy<=ty+1;yy++)for(let xx=tx-1;xx<=tx+1;xx++)if(map[yy]&&map[yy][xx]===1&&Math.hypot(x-(xx+.5),y-(yy+.45))<treeRadius)return true;
 if(isRuins){if(doors.length)for(let i=0;i<doors.length;i++){let d=doors[i];if(!d.open&&tx===d.x&&ty===d.y)return true}
  if(blocks.length)for(let i=0;i<blocks.length;i++){let b=blocks[i];if(tx===b.x&&ty===b.y)return true}}
 // GRANDES STRUCTURES DÉCO = obstacles (collision sur leur tuile) → cohérence visuelle.
 else if(structures.length)for(let i=0;i<structures.length;i++){let st=structures[i];if(st.solid&&tx===st.x&&ty===st.y)return true}
 return false}
function tileAt(x,y){let tx=Math.floor(x),ty=Math.floor(y);return map[ty]?map[ty][tx]:6}
function isWater(x,y){return tileAt(x,y)===2&&currentTheme.n!=='TAIGA'}
function isIce(x,y){return['TAIGA','GLACIER','MONTAGNE'].includes(currentTheme.n)&&tileAt(x,y)===2}
function isDeep(x,y){return tileAt(x,y)===6}
// CANYON (vue de dessus) : le biome courant est-il un canyon ? (vide = gouffre où l'on tombe,
// et non de l'eau où l'on se noie). On se base sur l'archétype de génération.
function isCanyonBiome(){return !isRuins&&(generateMaze._arch==='fanCanyon'||generateMaze._arch==='dunesFan')&&currentTheme&&currentTheme.n!=='VOLCAN'}
// VENT — direction lentement variable + rafales périodiques. Force appliquée au joueur dans move().
function updateWind(dt){
 let w=(!isRuins&&currentTheme&&currentTheme.wind)||0;
 if(w<=0){windX=0;windY=0;windGust=0;windStreaks.length=0;return}
 windT+=dt;
 // direction de base lente (dérive sur ~25 s) + oscillation douce
 windDir=Math.sin(windT*.13)*1.1+Math.cos(windT*.31)*.4;
 // rafales : montée/descente d'intensité (cycle ~6 s) → "comme du vrai vent"
 let base=.6+.4*Math.sin(windT*.5),gust=Math.max(0,Math.sin(windT*1.05-1));
 windGust=gust;
 let force=w*(base+gust*1.3)*1.5; // poussée douce (≈ 1-3 u/s², vitesse base joueur 4.4)
 windX=Math.cos(windDir)*force;windY=Math.sin(windDir)*force*.5; // moins de poussée verticale
 // gérer les traînées de vent (particules visuelles horizontales)
 let target=Math.round(10+w*14);
 while(windStreaks.length<target)windStreaks.push({x:Math.random()*W,y:Math.random()*H,len:8+Math.random()*22,sp:.5+Math.random(),a:.1+Math.random()*.22});
 windStreaks.forEach(s=>{let v=(40+s.sp*70)*(.7+windGust);s.x+=Math.cos(windDir)*v*dt;s.y+=Math.sin(windDir)*v*.5*dt;
  if(s.x<-30){s.x=W+20;s.y=Math.random()*H}else if(s.x>W+30){s.x=-20;s.y=Math.random()*H}
  if(s.y<-20)s.y=H+10;else if(s.y>H+20)s.y=-10})}
function move(dt){
 // Pendant un fondu de transition en Ruines : le héros est figé.
 if(transitioning){player.vx=player.vy=0;return}
 // Si on est enlisé dans un sable mouvant : gérer séparément (spam pour sortir)
 if(sinkIn){return updateSink(dt)}
 player.dashCd=Math.max(0,player.dashCd-dt);player.dash=Math.max(0,player.dash-dt);
 let dx=(keys.d||keys.arrowright?1:0)-(keys.q||keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.z||keys.w||keys.arrowup?1:0),l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
 // En Ruines, une dalle de glace (mécanique 'ice', tuile 2) rend le sol glissant quel que soit le thème.
 let ruinsIce=isRuins&&tileAt(player.x,player.y)===2&&iceZones.some(iz=>player.x>=iz.x&&player.x<iz.x+iz.w&&player.y>=iz.y&&player.y<iz.y+iz.h);
 let ice=isIce(player.x,player.y)||ruinsIce,water=isRuins?false:isWater(player.x,player.y),slow=(!isRuins&&map[Math.floor(player.y)]&&[4,5].includes(map[Math.floor(player.y)][Math.floor(player.x)]))||hillAt(player.x,player.y);
 // Dash (Shift) : impulsion dans la direction du regard/déplacement, avec cooldown
 let wantDash=(keys.shift)&&!player.wasDash&&player.dashCd<=0&&player.dash<=0&&!water;
 if(wantDash){let a=(dx||dy)?Math.atan2(dy,dx):(player.dir*Math.PI/4-Math.PI/2);let mag=perkDashMag;player.vx+=Math.cos(a)*mag;player.vy+=Math.sin(a)*mag;player.dash=.22;player.dashCd=perkDashCd;sound(520,.1,'square',.04);burst(player.x*T,player.y*T,'#bdeaff',10,1.3)}
 player.wasDash=!!keys.shift;
 // Vitesse de base selon terrain
 let sp=ice?7:water?2.6:slow?2.8:4.4,steer=ice?2.2:water?6:14;if(player.swiftT>0)sp*=1.4;sp*=perkSpeedMul;
 if(player.dash>0)steer=3;
 player.vx+=(dx*sp-player.vx)*Math.min(1,dt*steer);player.vy+=(dy*sp-player.vy)*Math.min(1,dt*steer);
 // VENT : pousse légèrement le joueur en surface (biomes ventés). Pas pendant un dash/nage/ruines.
 if(!isRuins&&!water&&player.dash<=0&&(windX||windY)){player.vx+=windX*dt;player.vy+=windY*dt}
 if(dx||dy)player.dir=(Math.round((Math.atan2(dx,-dy)/(Math.PI/4))+8)%8);
 // Glace : glissade SANS dégâts. Dès qu'on bouge un peu sur la glace, on prend la POSE DE PATINAGE
 // (seuil bas 2.5 + montée rapide) ; sinon on retombe vite sur le rendu de marche normal.
 player.sliding=ice&&Math.hypot(player.vx,player.vy)>2.5?Math.min(1,player.sliding+dt*6):Math.max(0,player.sliding-dt*5);
 player.iceTime=0;
 // CANYON (vue de dessus) : le vide (6) est un GOUFFRE — on y TOMBE (sauf en plein dash au-dessus
 // d'une brèche). Chute = dégâts + on est remis sur la dernière tuile sûre (pas de noyade).
 if(isDeep(player.x,player.y)&&isCanyonBiome()){
  if(player.dash>0)return; // un dash franchit la brèche du pont
  let s=player.lastSafe||spawn;player.x=s.x;player.y=s.y;player.vx=player.vy=0;
  cam.shake=Math.max(cam.shake,5);if(inv<=0&&shield<=0)hurt('Chute dans le gouffre');return}
 // mémorise la dernière tuile praticable « pleine » (pour relocaliser après une chute)
 if(!isDeep(player.x,player.y)&&!isWater(player.x,player.y))player.lastSafe={x:Math.floor(player.x)+.5,y:Math.floor(player.y)+.5};
 // Eau profonde (sombre) : noyade immédiate
 if(isDeep(player.x,player.y)){startDrown();return}
 // Nage en eau claire : on tient 5 s en surface, puis on commence à couler (spam ESPACE pour remonter)
 if(water){player.swimT=(player.swimT||0)+dt;player.swim=Math.max(0,1-player.swimT/swimMax);if(player.swimT>=swimMax){startDrown();return}}
 else{player.swimT=Math.max(0,(player.swimT||0)-dt*2.5);player.swim=Math.min(1,player.swim+dt*.5)}
 // Ruines : pousser un bloc de pierre quand on s'appuie dessus dans une direction cardinale
 if(isRuins&&blocks.length&&(dx||dy)){let pdx=Math.abs(dx)>Math.abs(dy)?Math.sign(dx):0,pdy=pdx?0:Math.sign(dy);let bx=Math.floor(player.x+pdx*.6),by=Math.floor(player.y+pdy*.6);let b=blocks.find(o=>o.x===bx&&o.y===by);if(b)pushBlock(b,pdx,pdy)}
 let nx=player.x+player.vx*dt,ny=player.y+player.vy*dt;if(!solid(nx+.34*Math.sign(player.vx),player.y))player.x=nx;else player.vx*=-.3;if(!solid(player.x,ny+.34*Math.sign(player.vy)))player.y=ny;else player.vy*=-.3;
 // Feedback de déplacement : sillage dans l'eau, poussière sur le sable/neige
 let spd=Math.hypot(player.vx,player.vy);player.fxT=(player.fxT||0)-dt;if(settingsData.motion&&spd>1.4&&player.fxT<=0){player.fxT=water?.12:.2;let px=player.x*T,py=player.y*T+8;if(water){particles.push({x:px-4,y:py,vx:-player.vx*.4,vy:-.3,life:.45,color:currentTheme.n==='VOLCAN'?'#ffd27a':'#cfeefc',size:2});particles.push({x:px+4,y:py,vx:player.vx*.4+.3,vy:-.3,life:.45,color:currentTheme.n==='VOLCAN'?'#ff9b3d':'#aee0f5',size:2})}else if(slow||currentTheme.n==='DESERT'){let dc=currentTheme.n==='TAIGA'?'#eef6f4':currentTheme.n==='LABO'?'#7fa0c0':'#d8bd80';particles.push({x:px,y:py+2,vx:-player.vx*.2,vy:-.2,life:.35,color:dc,size:2})}}
 // Sécurité anti-blocage : si le héros est coincé dans une hitbox (ex. téléporté dans les arbres), on le repousse vers la case libre la plus proche
 if(solid(player.x,player.y))nudgeOutOfSolid();
 // Entrée dans un sable mouvant : déclenche l'enlisement
 let qs=quicksands.find(q=>Math.hypot(player.x-q.x-.5,player.y-q.y-.5)<.45);if(qs)startSink(qs);
}
// Repousse le joueur hors d'un obstacle solide (spirale croissante autour de sa position)
function nudgeOutOfSolid(){if(!solid(player.x,player.y))return;let best=null,bd=1e9;for(let r=.4;r<=4.2;r+=.4){for(let k=0;k<16;k++){let a=k/16*Math.PI*2,tx=player.x+Math.cos(a)*r,ty=player.y+Math.sin(a)*r;if(tx>1&&ty>1&&tx<MW-1&&ty<MH-1&&!solid(tx,ty)){let d=r;if(d<bd){bd=d;best={x:tx,y:ty}}}}if(best)break}if(best){player.x=best.x;player.y=best.y}else{player.x=spawn.x+.5;player.y=spawn.y+.5}player.vx*=.2;player.vy*=.2}
function startSink(q){if(sinkIn||inv>0)return;sinkIn={q,depth:0,esc:0};player.x=q.x+.5;player.y=q.y+.5;player.vx=player.vy=0;addFloater(player.x*T,player.y*T-14,'SPAM ESPACE !','#e8c46a');sound(160,.18,'sawtooth',.05)}
function escapeSink(){if(sinkIn){sinkIn.esc+=.34;sinkIn.depth=Math.max(0,sinkIn.depth-.16);sound(300+sinkIn.esc*60,.05,'square',.035);burst(player.x*T,player.y*T+6,'#c2a45c',6,1)}}
function updateSink(dt){let s=sinkIn;s.depth+=dt*(.55+s.q.phase%1*.1);s.esc=Math.max(0,s.esc-dt*.9);
 if(s.esc>=1){let q=s.q;sinkIn=null;player.vx=-(player.x-q.x-.5)*4;player.vy=-3;addFloater(player.x*T,player.y*T-14,'LIBRE !','#8fe6a0');sound(640,.12,'square',.05);inv=.6;return}
 if(s.depth>=1){sinkIn=null;player.sliding=0;hurt('Enlisé',true);player.swim=1}}
function startDrown(){if(player.drown>0)return;player.drown=.01;player.drownEsc=0;player.vx=player.vy=0;sound(320,.18,'sine',.05);sound(180,.4,'sine',.045);burst(player.x*T,player.y*T+4,'#bfeef7',14,1.5);addFloater(player.x*T,player.y*T-16,'SPAM ESPACE !','#bfeef7')}
// Spam ESPACE pour remonter à la surface
function escapeDrown(){if(player.drown<=0)return;player.drownEsc=(player.drownEsc||0)+.28;player.drown=Math.max(.01,player.drown-.16);
 // coup de nage : poussée dans la direction de déplacement (ou vers le haut par défaut) → on avance vers l'issue.
 let dx=(keys.d||keys.arrowright?1:0)-(keys.q||keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.z||keys.w||keys.arrowup?1:0);
 if(!dx&&!dy)dy=-1;let l=Math.hypot(dx,dy)||1;player.vx+=dx/l*2.6;player.vy+=dy/l*2.6;
 sound(420+player.drownEsc*70,.05,'square',.04);for(let i=0;i<3;i++)particles.push({x:player.x*T+(Math.random()-.5)*10,y:player.y*T+4,vx:(Math.random()-.5),vy:-1.5-Math.random(),life:.4,color:'#dff6fb',size:2})}
function updateDrown(dt){player.drown+=dt*.7;player.drownEsc=Math.max(0,(player.drownEsc||0)-dt*.85);
 // ON PEUT NAGER pendant la noyade : déplacement lent vers une issue (eau peu profonde / terre).
 // Chaque pression d'ESPACE (escapeDrown) donne aussi une poussée dans la direction visée.
 let dx=(keys.d||keys.arrowright?1:0)-(keys.q||keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.z||keys.w||keys.arrowup?1:0),l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
 let sp=2.2;player.vx+=(dx*sp-player.vx)*Math.min(1,dt*5);player.vy+=(dy*sp-player.vy)*Math.min(1,dt*5);
 if(dx||dy)player.dir=(Math.round((Math.atan2(dx,-dy)/(Math.PI/4))+8)%8);
 let nx=player.x+player.vx*dt,ny=player.y+player.vy*dt;
 if(!solid(nx+.34*Math.sign(player.vx),player.y))player.x=nx;else player.vx*=-.3;
 if(!solid(player.x,ny+.34*Math.sign(player.vy)))player.y=ny;else player.vy*=-.3;
 // SAUVÉ si on atteint un sol sec ou de l'eau peu profonde (plus de gouffre/eau profonde sous les pieds).
 if(!isDeep(player.x,player.y)){player.drown=0;player.drownPop=false;player.drownEsc=0;player.swimT=isWater(player.x,player.y)?3:0;player.swim=Math.max(.4,player.swim);addFloater(player.x*T,player.y*T-16,'À LA SURFACE !','#8fe6a0');sound(660,.12,'square',.05);inv=.6;return}
 // Remonté à la surface en luttant (spam ESPACE) : on s'en sort, petit répit.
 if(player.drownEsc>=1){player.drown=0;player.drownEsc=0;player.swimT=2.4;player.swim=Math.max(.3,player.swim);player.vy=-2;addFloater(player.x*T,player.y*T-16,'OUF !','#8fe6a0');sound(660,.12,'square',.05);inv=.6;return}
 // grosse bulle finale juste avant de sombrer
 if(player.drown>.9&&!player.drownPop){player.drownPop=true;sound(120,.5,'sine',.05);for(let i=0;i<8;i++){let a=Math.random()*6.28;particles.push({x:player.x*T+Math.cos(a)*4,y:player.y*T+2,vx:Math.cos(a)*1.2,vy:-1.5-Math.random(),life:.5,color:'#dff6fb',size:2})}}
 if(player.drown>=1.4){player.drown=0;player.drownPop=false;player.drownEsc=0;player.swim=1;player.swimT=0;hurt('Noyade',true)}}
function hurt(msg,hard=false){if(inv>0)return;if(shield>0){shield=0;inv=1.2;sound(300,.12,'square',.05);addFloater(player.x*T,player.y*T-10,'BOUCLIER !','#6ed2ff');burst(player.x*T,player.y*T,'#6ed2ff',16,1.6);return}
 // PV continus : un coup retire HP_HIT (ajusté par la difficulté des mobs). Noyade/enlisement = coup dur.
 let dmg=hard?Math.round(HP_HIT*1.4):Math.round(HP_HIT*diff().mob);
 hp=Math.max(0,hp-dmg);inv=1.4;combo=0;score=Math.max(0,score-75);flash=.35;impact(.3);sfx('hurt');burst(player.x*T,player.y*T,'#ff6b5e',14,1.4);
 addFloater(player.x*T,player.y*T-12,'-'+dmg,'#ff8a7a');
 if(hard){player.x=spawn.x+.5;player.y=spawn.y+.5;player.vx=player.vy=0;player.swimT=0}
 if(hp<=0)finish(false)}
function update(dt){
 time-=dt;inv=Math.max(0,inv-dt);whip=Math.max(0,whip-dt);shield=Math.max(0,shield-dt);flash=Math.max(0,flash-dt*2);cam.shake=Math.max(0,cam.shake-dt*60);cam.pulse=Math.max(0,cam.pulse-dt*1.5);
 trapReveal=Math.max(0,trapReveal-dt);if(player)player.swiftT=Math.max(0,(player.swiftT||0)-dt);comboAura=combo>=3?Math.min(1,comboAura+dt*3):Math.max(0,comboAura-dt*3);
 particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=dt});particles=particles.filter(p=>p.life>0);
 floaters.forEach(f=>{f.y-=dt*22;f.life-=dt});floaters=floaters.filter(f=>f.life>0);
 updateAmbient(dt);updateWind(dt);updateBirds(dt);
 if(time<=0)return finish(false);
 if(boss.active){updateBoss(dt);return}
 quicksands.forEach(q=>q.phase+=dt);
 // Noyade en cours : on fige le héros le temps de l'animation
 if(player.drown>0){updateDrown(dt);return}
 move(dt);
 // Pendant l'enlisement, on ignore les autres dangers
 if(sinkIn)return;
 powerups.forEach(p=>{if(p.taken)return;if(Math.hypot(player.x-p.x-.5,player.y-p.y-.5)<.6){p.taken=true;collectPowerup(p)}});
 let comboGuard=combo>=3;
 traps.forEach(t=>{if(t.kind==='spark'||t.kind==='geyser')t.phase+=dt;let near=Math.hypot(player.x-t.x-.5,player.y-t.y-.5)<.45;if(comboGuard&&t.kind!=='lava'){return}if(t.kind==='lava'){if(near)hurt('Lave')}else if(t.kind==='spark'){if(Math.floor(t.phase*2.2)%3===0&&near)hurt('Décharge')}else if(t.kind==='geyser'){if(t.phase%4>2.7&&near)hurt(t.hot!==false?'Geyser brûlant':'Geyser')}else if(t.phase%2.8>1.65&&near)hurt('Pics')});
 updateGeysers(dt,comboGuard);
 holes.forEach(h=>{if(Math.hypot(player.x-h.x-.5,player.y-h.y-.5)<.38){if(comboGuard)return;hurt('Trou',true)}});
 // Chute dans une crevasse : mortelle, SAUF si on la franchit en dash (saut au-dessus du vide).
 if(crevasseAt(player.x,player.y)&&player.dash<=0&&!comboGuard)hurt('Crevasse',true);
 snakes.forEach(s=>{
  // Mis à mort (fouet) : glisse au sol puis disparaît (deadT décompte l'anim).
  if(s.dead){s.deadT-=dt;s.vx*=.85;s.vy*=.85;s.x+=s.vx*dt;s.y+=s.vy*dt;return}
  s.stun=Math.max(0,s.stun-dt);s.phase+=dt;s.turn-=dt;if(s.stun<=0){let dx=player.x-s.x,dy=player.y-s.y,d=Math.max(.01,Math.hypot(dx,dy));s.alert=d<3.8;if(d<3.8){s.vx+=(dx/d*1.65-s.vx)*dt*4;s.vy+=(dy/d*1.65-s.vy)*dt*4}else if(s.turn<=0){let a=Math.random()*Math.PI*2;s.vx=Math.cos(a)*(.55+Math.random()*.45);s.vy=Math.sin(a)*(.55+Math.random()*.45);s.turn=1+Math.random()*3}moveAnimal(s,dt);if(d<.62){if(inv<=0&&shield<=0){player.vx=-dx/d*6;player.vy=-dy/d*6}hurt('Serpent')}}});
 snakes=snakes.filter(s=>!s.dead||s.deadT>0);// retire les serpents tués après leur anim
 animals.forEach(a=>{a.phase+=dt;a.turn-=dt;
  // K.O. : l'animal glisse au sol puis disparaît (deadT décompte l'anim de mort).
  if(a.dead){a.deadT-=dt;a.vx*=.85;a.vy*=.85;a.x+=a.vx*dt;a.y+=a.vy*dt;return}
  // ÉTOURDI (fouet) : ne poursuit pas, glisse sur l'élan, tremble.
  if(a.stun>0){a.stun-=dt;a.vx*=.9;a.vy*=.9;moveAnimal(a,dt);a.alert=false;return}
  let dx=player.x-a.x,dy=player.y-a.y,d=Math.max(.01,Math.hypot(dx,dy)),hostile=['boar','wolf','scorpion','spider','jaguar','rattlesnake'].includes(a.type);
  // Prédateurs traqueurs (hunter) : repèrent de plus loin et chargent plus vite.
  let range=a.hunter?4.6:2.8,chase=a.hunter?2.3:1.45,accel=a.hunter?4.2:3;a.alert=hostile&&d<range;if(hostile&&d<range){a.vx+=(dx/d*chase-a.vx)*dt*accel;a.vy+=(dy/d*chase-a.vy)*dt*accel;if(d<.62){if(inv<=0&&shield<=0){player.vx=-dx/d*6;player.vy=-dy/d*6}hurt(a.type==='wolf'?'Loup':a.type==='scorpion'?'Scorpion':a.type==='spider'?'Araignée':a.type==='jaguar'?'Jaguar':a.type==='rattlesnake'?'Crotale':'Sanglier')}}else if(!hostile&&d<1.5){a.vx-=dx/d*dt*4;a.vy-=dy/d*dt*4}else if(a.turn<=0){let ang=Math.random()*Math.PI*2,s=['parrot','owl','vulture','toucan'].includes(a.type)?1.25:.45+Math.random()*.35;a.vx=Math.cos(ang)*s;a.vy=Math.sin(ang)*s;a.turn=1+Math.random()*4}moveAnimal(a,dt)});
 animals=animals.filter(a=>!a.dead||a.deadT>0);// retire les animaux mis K.O. après leur anim de chute
 if(isRuins){updateRuins(dt)}
 else{let a=artifacts.find(a=>!a.taken&&Math.hypot(player.x-a.x-.5,player.y-a.y-.5)<.48);if(a){pendingArtifact=a;askQuestion()}
  exit.open=collected>=4;if(exit.open&&Math.hypot(player.x-exit.x-.5,player.y-exit.y-.5)<.55)enterTempleTrial();
  cam.x+=(player.x*T-W/2-cam.x)*dt*7;cam.y+=(player.y*T-H/2-cam.y)*dt*7;clampCam();}
}
function clampCam(){let m=isRuins?2*T:6*T;cam.x=Math.max(-m,Math.min(MW*T-W+m,cam.x));cam.y=Math.max(-m,Math.min(MH*T-H+m,cam.y))}
function moveAnimal(a,dt){let nx=a.x+a.vx*dt,ny=a.y+a.vy*dt,statics=[...artifacts.filter(o=>!o.taken),...holes,...traps,...quicksands,exit].filter(Boolean),movers=[...animals,...snakes];if(!solid(nx,ny)&&!statics.some(o=>Math.hypot(o.x+.5-nx,o.y+.5-ny)<.7)&&!movers.some(o=>o!==a&&Math.hypot(o.x-nx,o.y-ny)<.65)){a.x=nx;a.y=ny}else{a.vx*=-1;a.vy*=-1;a.turn=0}}
function facingVector(){let a=player.dir*Math.PI/4;return{dx:Math.sin(a),dy:-Math.cos(a)}}function useWhip(){if(state!=='play'||whip>0)return;whip=.48;sfx('jumpwhip');let{dx,dy}=facingVector();let wR=3.2*perkWhipRange,wR2=3*perkWhipRange;snakes.forEach(s=>{if(s.dead)return;let sx=s.x-player.x,sy=s.y-player.y,d=Math.hypot(sx,sy);if(d<wR&&(sx*dx+sy*dy)/Math.max(.1,d)>.15){
  // Le serpent peut être TUÉ, pas seulement étourdi : 1er coup = étourdi/repoussé ; coup sur un serpent
  // déjà étourdi = mis à mort. Le skill « frappe létale » (perkOneShot≥1) tue d'un seul coup.
  let kill=perkOneShot>=2||(perkOneShot>=1&&s.stun>0)||s.stun>0;
  if(kill){s.dead=true;s.deadT=.5;s.vx=dx*4;s.vy=dy*4;score+=60;burst(s.x*T,s.y*T,'#caffd0',16,1.8);burst(s.x*T,s.y*T,'#3a6b2e',9,1.2);addFloater(s.x*T,s.y*T-12,'TUÉ !','#bff39a');sound(150,.16,'sawtooth',.05);sound(80,.2,'square',.04)}
  else{s.stun=3;s.vx=dx*4;s.vy=dy*4;score+=20;burst(s.x*T,s.y*T,'#ffe35b',8,1.2);addFloater(s.x*T,s.y*T-12,'ÉTOURDI','#ffe35b')}
 }});let hostileT=['boar','wolf','scorpion','spider','jaguar','rattlesnake'];
 animals.forEach(a=>{if(a.dead)return;let sx=a.x-player.x,sy=a.y-player.y,d=Math.hypot(sx,sy);if(d>=wR2)return;
  let inArc=(sx*dx+sy*dy)/Math.max(.1,d)>0;// dans le cône du fouet
  let kx=sx/Math.max(.1,d),ky=sy/Math.max(.1,d);
  if(hostileT.includes(a.type)&&inArc){
   // FRAPPE LÉTALE (skill) : niv.2 = tout hostile meurt d'un coup ; niv.1 = bête étourdie OU déjà visée meurt.
   let oneShotKill=perkOneShot>=2||(perkOneShot>=1&&(a.stun>0))||(isRuins&&a.type==='spider');
   // DONJON : les araignées (gardiennes) meurent d'un seul coup de fouet.
   if(oneShotKill){a.dead=true;a.deadT=.5;score+=60;burst(a.x*T,a.y*T,'#caffd0',18,1.9);burst(a.x*T,a.y*T,'#3a6b2e',10,1.3);addFloater(a.x*T,a.y*T-12,'TUÉ !','#bff39a');sfx('jumpwhip');sound(150,.16,'sawtooth',.05);sound(80,.2,'square',.04)}
   // animal hostile : 1er coup = étourdi + repoussé ; coup sur un animal déjà étourdi = mis K.O.
   else if(a.stun>0){a.dead=true;a.deadT=.5;score+=60;burst(a.x*T,a.y*T,'#ff6b5e',16,1.7);addFloater(a.x*T,a.y*T-12,'K.O. !','#ffd24a');sound(180,.18,'sawtooth',.05);sound(90,.22,'square',.04)}
   else{a.stun=2.2;a.vx=kx*5.5;a.vy=ky*5.5;a.turn=2.2;score+=25;burst(a.x*T,a.y*T,'#ffe35b',10,1.3);addFloater(a.x*T,a.y*T-12,'\u00c9TOURDI','#ffe35b');sound(320,.1,'square',.045)}
  }else{a.vx=kx*2.5;a.vy=ky*2.5;a.turn=1.5}})}
function interact(){if(state!=='play'||paused)return;
 // MIROIRS (ruines) : E / bouton ACTION fait pivoter le miroir le plus proche (marche au tactile).
 if(isRuins&&curRoom&&curRoom.kind==='mirror'&&!curRoom.puzzleDone){
  let m=mirrors.filter(o=>o.room===curRoom.id).filter(o=>!o.cd||performance.now()>o.cd)
   .sort((a,b)=>Math.hypot(player.x-a.x-.5,player.y-a.y-.5)-Math.hypot(player.x-b.x-.5,player.y-b.y-.5))[0];
  if(m&&Math.hypot(player.x-m.x-.5,player.y-m.y-.5)<1.3){m.o=(m.o+1)%2;m.cd=performance.now()+260;sound(520,.1,'square',.05);addFloater(m.x*T,m.y*T-8,'TOURNE','#9af0ff');return}}
 // VILLAGEOIS : pose une question. 3 bonnes d'affilée → power-up rare garanti.
 let v=villagers.find(v=>!v.done&&Math.hypot(player.x-v.x,player.y-v.y)<1.3);
 if(v){pendingVillager=v;v.asked=true;askQuestion('villager');return}
 // PUITS : soigne (si blessé) sinon petit bonus de score, une seule fois.
 let w=wells.find(w=>!w.used&&Math.hypot(player.x-w.x-.5,player.y-w.y-.5)<1.3);
 if(w){useWell(w);return}
 // RUINE EXPLORABLE : ouvre le coffre central → bonus garanti.
 let rs=ruinSites.find(r=>!r.looted&&Math.hypot(player.x-r.x-.5,player.y-r.y-.5)<1.4);
 if(rs){lootRuin(rs);return}
 let a=artifacts.find(a=>!a.taken&&Math.hypot(player.x-a.x-.5,player.y-a.y-.5)<1.3);if(a){pendingArtifact=a;askQuestion();return}if(exit&&exit.open&&Math.hypot(player.x-exit.x-.5,player.y-exit.y-.5)<1.5)enterTempleTrial()}
function useWell(w){w.used=true;
 if(hp<maxHp){hp=Math.min(maxHp,hp+HP_HEAL);addFloater(w.x*T,w.y*T-12,'+'+HP_HEAL+' PV','#8fe6a0');sound(660,.2,'square',.05);burst((w.x+.5)*T,(w.y+.5)*T,'#9af0ff',18,1.6)}
 else{score+=120;time=Math.min(180,time+10);addFloater(w.x*T,w.y*T-12,'+120 · +10s','#6ed2ff');sound(720,.18,'square',.05);burst((w.x+.5)*T,(w.y+.5)*T,'#9af0ff',16,1.4)}
}
function lootRuin(rs){rs.looted=true;score+=200;
 // Trésor caché : crédite des rubis immédiatement.
 addRubis(RUBIS_TRESOR);
 // 1 chance sur 2 : power-up rare ; sinon gros bonus de score + temps.
 if(rng(2)===0){grantRandomPower((rs.x+.5)*T,(rs.y+.5)*T);addFloater(rs.x*T,rs.y*T-14,'RELIQUE ! +'+RUBIS_TRESOR+'◆','#ffe35b')}
 else{score+=200;time=Math.min(180,time+15);addFloater(rs.x*T,rs.y*T-14,'TRÉSOR +'+RUBIS_TRESOR+'◆ · +15s','#ffe35b')}
 burst((rs.x+.5)*T,(rs.y+.5)*T,'#ffe35b',28,2.4);sound(520,.25,'square',.06);impact(.3)}
function togglePause(){paused?resumeGame():pauseGame()}
function pauseGame(){if(state!=='play')return;paused=true;keys={};let ov=document.querySelector('#pauseMenu');if(ov)ov.classList.remove('hidden')}
function resumeGame(){paused=false;let ov=document.querySelector('#pauseMenu');if(ov)ov.classList.add('hidden')}
function pauseSettings(){updateSettingsButtons();show('settings');settingsFrom='pause'}
function quitToMenu(){paused=false;cancelAnimationFrame(raf);let ov=document.querySelector('#pauseMenu');if(ov)ov.classList.add('hidden');boss.active=false;showMenu()}
function startBoss(){if(boss.active)return;boss.active=true;sfx('boss');quizMode='boss';ui.goalLabel.textContent='GARDIEN';ui.exitHud.innerHTML=pixelHearts(3);
 bossEnt={x:exit.x+.5,y:exit.y-1.5,baseY:exit.y-1.5,hurt:0,phase:0,dead:0,tp:0,lunge:0};player.x=exit.x+.5;player.y=exit.y+3.5;player.vx=player.vy=0;bolts=[];minions=[];zones=[];
 // Boss des ruines = COLOSSE DE PIERRE ancestral (silhouette unique, multi-phases, plus coriace).
 // L'épreuve du temple (niveau classique) garde le GARDIEN du biome (silhouette + 3 PV).
 bossColossus=isRuins&&!templeTrial;
 let names={projectile:'GARDIEN FOUDROYANT',teleport:'GARDIEN SPECTRAL',zones:'GARDIEN DE LAVE',minions:'GARDIEN INVOQUEUR',orbit:'GARDIEN ORBITAL',quake:'COLOSSE SISMIQUE'};
 // nom thématique propre au temple courant (chaque biome a SON gardien)
 let themeName=bossColossus?(ruinsSize==='final'?'ARCHÉLITHE, GARDIEN ÉTERNEL':'VIGIL, COLOSSE DES RUINES'):{FORET:'SYLVAIN, ESPRIT DES BOIS',SEQUOIAS:'GRANDRACINE, ANCIEN DES CIMES',JUNGLE:'XOL, FUREUR DE LA JUNGLE',SAVANE:'NKOSI, ROI FAUVE',PLAGE:'NÉRÉE, GARDIEN DES MARÉES',MARECAGE:'VASE, HORREUR DES EAUX',TAIGA:'BORÉAL, SOUFFLE GLACÉ',GLACIER:'KRYOS, COLOSSE DE GIVRE',ISLANDE:'FROSTI, SENTINELLE POLAIRE',DESERT:'RÂ-SETH, JUGE DES SABLES',DUNES:'KHEPRI, SCARABÉE COLOSSAL',VOLCAN:'IGNIS, CŒUR DE MAGMA',YELLOWSTONE:'GEYSIR, FUREUR BRÛLANTE',GROTTE:'STALACTOR, GARDIEN DES PROFONDEURS',MONTAGNE:'PÉTRA, COLOSSE DE PIERRE'}[currentTheme.n];
 ui.exitHud.innerHTML=pixelHearts(boss.max);
 bossPhase='intro';bossTimer=1.4;addFloater(bossEnt.x*T,bossEnt.y*T-20,themeName||names[bossKind()]||'LE GARDIEN','#ff6b5e');sound(90,.4,'sawtooth',.06);impact(.5)}
// ════════════════════════════════════════════════════════════════════════
//  BOSS MULTI-PHASES — chaque biome a une SÉQUENCE de 3 phases (mécanique +
//  apparence qui changent à chaque PV perdu). 6 mécaniques de base réordonnées
//  par biome → aucun combat identique. Phase courante = (boss.max - boss.hp).
// ════════════════════════════════════════════════════════════════════════
// Séquence des mécaniques par biome (index 0 = pleine vie → dernière phase = PV bas).
const BOSS_PHASES={
 FORET:['projectile','orbit','quake'],     JUNGLE:['orbit','minions','projectile'],
 PLAGE:['projectile','zones','quake'],      TAIGA:['teleport','projectile','orbit'],
 DESERT:['teleport','quake','zones'],       DUNES:['quake','zones','teleport'],
 VOLCAN:['zones','projectile','quake'],     GROTTE:['quake','minions','zones'],
 SEQUOIAS:['orbit','quake','projectile'],   MARECAGE:['zones','minions','orbit'],
 SAVANE:['teleport','projectile','quake'],  ISLANDE:['zones','quake','teleport'],
 YELLOWSTONE:['zones','projectile','minions'],GLACIER:['teleport','orbit','zones'],
 MONTAGNE:['quake','teleport','projectile']
};
// COLOSSE DE PIERRE (boss des ruines) : séquence longue (jusqu'à 6 phases) tronquée
// selon les PV (crypte=4 → 4 dernières, finale=6 → toutes). Attaques denses & variées.
const COLOSSUS_PHASES=['quake','projectile','minions','orbit','zones','teleport'];
// Nom de chaque phase pour le bandeau de transition (selon la mécanique active).
const PHASE_NAMES={projectile:'DÉCHAÎNEMENT',orbit:'ANNEAU RUNIQUE',teleport:'TRAQUE SPECTRALE',zones:'TERRE BRÛLÉE',minions:'INVOCATION',quake:'COLÈRE SISMIQUE'};
// Mécanique de la phase courante : on avance dans la séquence à mesure que les PV chutent.
function bossKind(){let seq;if(bossColossus){seq=COLOSSUS_PHASES.slice(COLOSSUS_PHASES.length-boss.max)}else{seq=BOSS_PHASES[currentTheme.n]||['projectile','orbit','quake']}let i=Math.min(seq.length-1,Math.max(0,boss.max-boss.hp));return seq[i]}
function startBossDodge(){show('play');bossPhase='dodge';bossTimer=3.6+Math.random()*1.2;bolts=[];minions=[];zones=[];bossEnt.tp=0;bossEnt.lunge=0;bossEnt.orbA=0;bossEnt.slam=0;
 // Transition de phase : flash + bandeau quand la mécanique change (chaque PV perdu).
 let k=bossKind();if(bossEnt.lastKind&&bossEnt.lastKind!==k){flash=.45;impact(.5);burst(bossEnt.x*T,bossEnt.y*T,'#fff',26,2.4);addFloater(bossEnt.x*T,bossEnt.y*T-26,'PHASE '+(boss.max-boss.hp+1)+' : '+(PHASE_NAMES[k]||''),'#ffe35b');sound(140,.3,'square',.06)}
 bossEnt.lastKind=k;
 if(k==='minions'){let n=2+(boss.max-boss.hp);for(let i=0;i<n;i++)minions.push(spawnMinion())}}
function spawnMinion(){let a=Math.random()*6.28,d=4+Math.random()*2;return{x:bossEnt.x+Math.cos(a)*d,y:bossEnt.y+Math.sin(a)*d,phase:Math.random()*6,stun:0}}
function fireBolts(){if(!bossEnt)return;let n=3+Math.floor((boss.max-boss.hp))+(bossColossus?2:0);for(let i=0;i<n;i++){let ang=Math.atan2(player.y-bossEnt.y,player.x-bossEnt.x)+(Math.random()-.5)*1.2,sp=(2.4+Math.random()*1.2)*(bossColossus?1.18:1);bolts.push({x:bossEnt.x,y:bossEnt.y+.4,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,color:bossColossus?'#c6bda6':'#ff6b3d',life:4})}sound(220,.1,'square',.04)}
function spawnZone(){let tx=Math.max(2,Math.min(MW-3,Math.round(player.x+(Math.random()-.5)*3))),ty=Math.max(2,Math.min(MH-3,Math.round(player.y+(Math.random()-.5)*3)));zones.push({x:tx,y:ty,warn:1.1,active:0,hit:false})}
// --- Variante projectiles (FORÊT/PLAGE) ---
function updateBossProjectile(dt){if(Math.floor((bossTimer+dt)*1.4)!==Math.floor(bossTimer*1.4))fireBolts();
 bolts.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(Math.hypot(player.x-b.x,player.y-b.y)<.5){b.life=0;if(inv<=0&&shield<=0){player.vx=b.vx*1.5;player.vy=b.vy*1.5}hurt('Projectile')}});
 bolts=bolts.filter(b=>b.life>0&&b.x>0&&b.x<MW&&b.y>0&&b.y<MH&&!solid(b.x,b.y))}
// --- Variante téléportation + charge (TAIGA/DÉSERT) ---
function updateBossTeleport(dt){bossEnt.tp=(bossEnt.tp||0)-dt;
 if(bossEnt.tp<=0){bossEnt.tp=1.4+Math.random()*.6;let nx=bossEnt.x,ny=bossEnt.baseY;for(let tries=0;tries<10;tries++){let a=Math.random()*6.28,d=3+Math.random()*2,cx=Math.max(2,Math.min(MW-2,player.x+Math.cos(a)*d)),cy=Math.max(2,Math.min(MH-2,player.y+Math.sin(a)*d));if(!solid(cx,cy)){nx=cx;ny=cy;break}}bossEnt.x=nx;bossEnt.baseY=ny;bossEnt.lunge=.5;burst(bossEnt.x*T,bossEnt.y*T,'#bdd6ff',14,2);sound(160,.12,'sine',.05)}
 if(bossEnt.lunge>0){bossEnt.lunge-=dt;let dx=player.x-bossEnt.x,dy=player.y-bossEnt.y,m=Math.hypot(dx,dy)||1;bossEnt.x+=dx/m*dt*6;bossEnt.baseY+=dy/m*dt*6}
 if(Math.hypot(player.x-bossEnt.x,player.y-bossEnt.y)<.85){if(inv<=0&&shield<=0){let dx=player.x-bossEnt.x,dy=player.y-bossEnt.y,m=Math.hypot(dx,dy)||1;player.vx=dx/m*7;player.vy=dy/m*7}hurt('Charge du gardien')}}
// --- Variante zones/pièges (VOLCAN) ---
function updateBossZones(dt){if(zones.length<3&&Math.random()<dt*2.2)spawnZone();
 zones.forEach(z=>{if(z.warn>0){z.warn-=dt;if(z.warn<=0){z.active=.9;sound(70,.2,'sawtooth',.05)}}
  else if(z.active>0){z.active-=dt;if(!z.hit&&Math.hypot(player.x-(z.x+.5),player.y-(z.y+.5))<.95){z.hit=true;hurt('Éruption')}}});
 zones=zones.filter(z=>z.warn>0||z.active>0)}
// --- Variante sbires (phase 'minions') ---
function updateBossMinions(dt){if(minions.length<4&&Math.random()<dt*.6)minions.push(spawnMinion());
 minions.forEach(m=>{m.phase+=dt;if(m.stun>0){m.stun-=dt;return}let dx=player.x-m.x,dy=player.y-m.y,d=Math.hypot(dx,dy)||1;m.x+=dx/d*dt*2.3;m.y+=dy/d*dt*2.3;
  if(d<.75){if(inv<=0&&shield<=0){player.vx=dx/d*5;player.vy=dy/d*5}hurt('Sbire')}
  if(whip>0&&Math.hypot((player.x+player.dir*.8)-m.x,player.y-m.y)<1){m.stun=1.6;burst(m.x*T,m.y*T,'#9af0ff',10,1.6)}})}
// --- Variante ORBITALE (JUNGLE) : anneau de projectiles tournant qui se resserre.
// Le joueur doit se faufiler entre deux billes en visant un interstice.
function updateBossOrbit(dt){bossEnt.orbA=(bossEnt.orbA||0)+dt*1.6;
 if(!bolts.length||bolts.every(b=>b.orbit&&b.r<1.2)){
  // (re)lance un anneau : n billes réparties, avec un trou (gap) à traverser
  let n=8+Math.floor((boss.max-boss.hp))*2,gap=rng(n);
  for(let i=0;i<n;i++){if(i===gap||i===(gap+1)%n)continue;let a=i/n*Math.PI*2;bolts.push({orbit:true,a,r:5.5,vr:1.1,color:'#7af0a0',life:9})}
  sound(300,.12,'square',.04)}
 bolts.forEach(b=>{if(!b.orbit)return;b.r-=b.vr*dt;b.a+=dt*1.3;b.x=bossEnt.x+Math.cos(b.a+bossEnt.orbA)*b.r;b.y=bossEnt.y+Math.sin(b.a+bossEnt.orbA)*b.r;b.life-=dt;
  if(Math.hypot(player.x-b.x,player.y-b.y)<.5){b.life=0;if(inv<=0&&shield<=0){let m=Math.hypot(b.x-bossEnt.x,b.y-bossEnt.y)||1;player.vx=(player.x-bossEnt.x)/m*5;player.vy=(player.y-bossEnt.y)/m*5}hurt('Bille runique')}});
 bolts=bolts.filter(b=>b.life>0&&b.r>.4)}
// --- Variante SISMIQUE (DUNES) : le colosse frappe le sol → ondes de choc concentriques
// (anneaux télégraphiés) qu'il faut esquiver, + chutes de blocs ciblées (zones).
function updateBossQuake(dt){bossEnt.slam=(bossEnt.slam||0)-dt;
 if(bossEnt.slam<=0){bossEnt.slam=(bossColossus?1.6:2.2)+Math.random()*.8;zones.push({ring:true,x:bossEnt.x,y:bossEnt.baseY,warn:bossColossus?.55:.7,active:0,rad:0,maxr:bossColossus?9:7,hit:false});impact(.4);sound(80,.25,'sawtooth',.05);addFloater(bossEnt.x*T,bossEnt.y*T-18,'SÉISME !','#e0a85a')}
 if(zones.length<(bossColossus?4:3)&&Math.random()<dt*(bossColossus?2.2:1.6))spawnZone();
 zones.forEach(z=>{
  if(z.ring){if(z.warn>0){z.warn-=dt;if(z.warn<=0)z.active=1.1}
   else if(z.active>0){z.active-=dt;z.rad+=dt*9;let d=Math.hypot(player.x-z.x,player.y-z.y);if(!z.hit&&Math.abs(d-z.rad)<.7){z.hit=true;let m=d||1;if(inv<=0&&shield<=0){player.vx=(player.x-z.x)/m*7;player.vy=(player.y-z.y)/m*7}hurt('Onde de choc')}}}
  else{if(z.warn>0){z.warn-=dt;if(z.warn<=0){z.active=.9;sound(70,.2,'sawtooth',.05)}}
   else if(z.active>0){z.active-=dt;if(!z.hit&&Math.hypot(player.x-(z.x+.5),player.y-(z.y+.5))<.95){z.hit=true;hurt('Chute de pierre')}}}});
 zones=zones.filter(z=>z.warn>0||z.active>0||(z.ring&&z.rad<z.maxr))}
function updateBoss(dt){
 bossEnt.phase+=dt;bossEnt.hurt=Math.max(0,bossEnt.hurt-dt);bossEnt.y=bossEnt.baseY+Math.sin(bossEnt.phase*2)*.18;
 if(bossEnt.dead>0){bossEnt.dead+=dt;if(bossEnt.dead>1.4){
   // Ruines (hors épreuve du temple) : le gardien tombe → le trésor devient saisissable.
   // On rend la main au joueur pour qu'il aille ramasser le coffre (= fin du niveau).
   if(isRuins&&!templeTrial&&treasure){ruinsBossDone=true;boss.active=false;quizMode='artifact';bossPhase='idle';bossEnt=null;
    if(exit)exit.open=true;ui.goalLabel.textContent='TRÉSOR';
    if(player&&treasure){player.x=treasure.x+.5;player.y=treasure.y+2.4;player.vx=player.vy=0}
    addFloater(treasure.x*T,treasure.y*T-14,'GARDIEN VAINCU !','#ffe35b');show('play');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);return}
   finish(true)}
  cam.x+=(bossEnt.x*T-W/2-cam.x)*dt*5;cam.y+=(bossEnt.y*T-H/2-cam.y)*dt*5;return}
 move(dt);
 cam.x+=((player.x+ (bossEnt.x-player.x)*.3)*T-W/2-cam.x)*dt*6;cam.y+=((player.y+(bossEnt.y-player.y)*.3)*T-H/2-cam.y)*dt*6;clampCam();
 if(bossPhase==='intro'){bossTimer-=dt;if(bossTimer<=0){bossPhase='quiz';askQuestion('boss')}return}
 if(bossPhase==='dodge'){bossTimer-=dt;let k=bossKind();
  if(k==='projectile')updateBossProjectile(dt);
  else if(k==='teleport')updateBossTeleport(dt);
  else if(k==='zones')updateBossZones(dt);
  else if(k==='minions')updateBossMinions(dt);
  else if(k==='orbit')updateBossOrbit(dt);
  else if(k==='quake')updateBossQuake(dt);
  if(bossTimer<=0){bolts=[];minions=[];zones=[];if(hp>0){bossPhase='quiz';askQuestion('boss')}}}
}
function questionPool(){
 // Dans les Ruines, on puise dans TOUTES les questions du niveau (donjon = révision globale)
 // → évite la répétition d'un seul petit chapitre sur les nombreuses portes du donjon.
 if(isRuins){let all=[];curBank().chapters.forEach(c=>{(c.q||[]).forEach(q=>all.push(q))});return all}
 return curBank().chapters[selectedChapter].q}
function pickQuestion(){let pool=questionPool();
 // En mode EXPERT, privilégier les questions de niveau >=2 si disponibles
 let elig=pool.map((q,i)=>i);if(settingsData.difficulty==='EXPERT'){let hard=elig.filter(i=>(pool[i].level||1)>=2);if(hard.length>=3)elig=hard}
 // Anti-répétition : on garde en mémoire un grand nombre de questions déjà posées
 // (presque tout le pool pour les petits chapitres, ~60% pour le grand pool des Ruines).
 let memCap=Math.max(0,Math.floor(elig.length*(isRuins?.6:.85)));
 let fresh=elig.filter(i=>!askedIndices.includes(i));
 if(!fresh.length){askedIndices=[];fresh=elig.slice()}
 // Tirage mélangé : Fisher-Yates sur les indices frais puis on prend le premier.
 for(let i=fresh.length-1;i>0;i--){let j=rng(i+1);[fresh[i],fresh[j]]=[fresh[j],fresh[i]]}
 let idx=fresh[0];askedIndices.push(idx);
 if(askedIndices.length>memCap)askedIndices=askedIndices.slice(askedIndices.length-memCap);
 return pool[idx]}
function askQuestion(mode='artifact'){quizMode=mode;let visual=mode!=='boss'&&gradeLevel==='5e'&&typeof VISUAL_QUESTIONS!=='undefined'&&Math.random()<.3,q=visual?VISUAL_QUESTIONS[selectedChapter]:pickQuestion(),text=visual?q.q:q.q,opts=visual?q.a:q.opts,correct=visual?q.c:q.a,explain=visual?'':(q.explain||'');
 let order=opts.map((o,i)=>i);for(let i=order.length-1;i>0;i--){let j=rng(i+1);[order[i],order[j]]=[order[j],order[i]]}let shuffled=order.map(i=>opts[i]),newCorrect=order.indexOf(correct);
 currentQuestion={text,correct:newCorrect,explain,opts:shuffled};
 ui.explainBox.classList.add('hidden');ui.explainBox.innerHTML='';ui.continueBtn.classList.add('hidden');
 ui.quizTag.textContent=mode==='boss'?'DUEL CONTRE LE GARDIEN · '+boss.hp+' PV':'ARTEFACT TROUVÉ';ui.question.textContent=text;ui.diagram.classList.toggle('show',visual);if(visual)drawDiagram(q.d,mode==='boss');ui.answers.innerHTML='';shuffled.forEach((o,i)=>{let b=document.createElement('button');b.textContent=(i+1)+'. '+o;b.onclick=()=>answerQuestion(i===newCorrect,b,newCorrect);ui.answers.appendChild(b)});
 quizAdvanced=false;clearTimeout(quizTimer);
 quizClockMax=mode==='boss'?18:mode==='door'?14:15;quizClock=quizClockMax;quizClockOn=true;if(ui.quizClock){ui.quizClock.classList.remove('hidden');if(ui.quizClockBar){ui.quizClockBar.style.width='100%';ui.quizClockBar.style.background='#8fe6a0'}}
 show('quiz');let first=ui.answers.children[0];if(first&&first.focus)setTimeout(()=>first.focus(),30)}
function tickQuizClock(dt){if(!quizClockOn)return;quizClock=Math.max(0,quizClock-dt);if(ui.quizClockBar){let f=quizClock/quizClockMax;ui.quizClockBar.style.width=(f*100)+'%';ui.quizClockBar.style.background=f>.5?'#8fe6a0':f>.25?'#ffd24a':'#ff6b5e'}if(quizClock<=0){quizClockOn=false;timeoutQuiz()}}
function timeoutQuiz(){if(quizAdvanced)return;let kids=[...ui.answers.children],correct=currentQuestion?currentQuestion.correct:0,cb=kids[correct]||kids[0];if(!cb||cb.disabled)return;ui.quizTag&&(ui.quizTag.textContent='TEMPS ÉCOULÉ !');let wrong=kids.find((k,i)=>i!==correct)||cb;answerQuestion(false,wrong,correct)}
function drawDiagram(type,bossMode=false){let D=ui.diagram.getContext('2d');D.imageSmoothingEnabled=false;
 // Le canevas fait désormais 400×210 (zone d'image AGRANDIE). Les schémas sont dessinés dans un
 // repère logique 320×120 ; on l'agrandit (×1.25) et on le centre → schémas plus grands, JAMAIS coupés.
 // On ré-initialise la transformation à chaque appel (pas de restore nécessaire malgré les return).
 D.setTransform(1,0,0,1,0,0);D.fillStyle='#dce9cf';D.fillRect(0,0,400,210);
 let sc=1.25,aw=320*sc,ah=120*sc;D.setTransform(sc,0,0,sc,(400-aw)/2,(210-ah)/2);
 let r=(x,y,w,h,c)=>{D.fillStyle=c;D.fillRect(x,y,w,h)},
 dot=(x,y,c='#315b58',s=8)=>{r(x,y,s,s,c);r(x+2,y+2,Math.max(2,s-5),Math.max(2,s-5),'#e8f4d8')},
 lab=(t,x,y,c='#263b2d')=>{D.font='12px "Press Start 2P"';D.textAlign='center';D.fillStyle='#fff';D.fillText(t,x+1,y+1);D.fillStyle=c;D.fillText(t,x,y)},
 lineW=(x1,y1,x2,y2,c='#263b2d',w=4)=>{D.strokeStyle=c;D.lineWidth=w;D.beginPath();D.moveTo(x1,y1);D.lineTo(x2,y2);D.stroke()},
 arrow=(x,y,a,c='#263b2d')=>{D.fillStyle=c;D.beginPath();D.moveTo(x,y);D.lineTo(x-Math.cos(a-.5)*11,y-Math.sin(a-.5)*11);D.lineTo(x-Math.cos(a+.5)*11,y-Math.sin(a+.5)*11);D.closePath();D.fill()};
 D.strokeStyle='#263b2d';D.lineWidth=4;
 if(bossMode){drawBossDiagram(r);return}
 if(type.startsWith('particles')){
  // Solide : particules serrées en réseau ordonné. Gaz : peu de particules, très espacées.
  D.strokeStyle='#7d8a6b';D.lineWidth=3;D.strokeRect(96,18,128,84);
  if(type==='particles-gas'){let pos=[[112,30],[180,26],[140,58],[205,70],[110,84],[170,92],[150,38]];pos.forEach(p=>dot(p[0],p[1],'#4f8fbe',9))}
  else{for(let yy=0;yy<5;yy++)for(let xx=0;xx<6;xx++)dot(104+xx*20,26+yy*15,'#4f8fbe',12)}
 }
 else if(type==='circuit'){
  // Circuit fermé : pile + fil + lampe qui brille (boucle complète)
  lineW(70,30,250,30);lineW(250,30,250,90);lineW(250,90,70,90);lineW(70,90,70,30);
  r(58,46,24,28,'#3a3a3a');r(62,50,16,8,'#d6a23e');r(62,62,16,8,'#c44');lab('pile',70,112,'#4a4a4a');
  D.fillStyle='#f3dd55';D.beginPath();D.arc(250,60,16,0,Math.PI*2);D.fill();D.strokeStyle='#caa92e';D.lineWidth=3;D.stroke();r(245,55,3,3,'#fff');for(let i=0;i<6;i++){let a=i/6*Math.PI*2;lineW(250+Math.cos(a)*18,60+Math.sin(a)*18,250+Math.cos(a)*25,60+Math.sin(a)*25,'#f3dd55',2)}lab('lampe',250,112,'#4a4a4a')
 }
 else if(type==='motion-circle'){
  // Mouvement circulaire : trajectoire + mobile + flèche tangente
  D.strokeStyle='#9aa78a';D.lineWidth=3;D.setLineDash([6,5]);D.beginPath();D.arc(160,58,40,0,Math.PI*2);D.stroke();D.setLineDash([]);
  dot(196,52,'#e25c42',12);arrow(196,30,-Math.PI/2,'#e25c42');lab('trajectoire',160,114,'#4a4a4a')
 }
 else if(type==='orbit'){
  // La Lune orbite autour de la Terre
  D.strokeStyle='#9aa78a';D.lineWidth=2;D.setLineDash([5,5]);D.beginPath();D.arc(150,58,52,0,Math.PI*2);D.stroke();D.setLineDash([]);
  D.fillStyle='#4f8fbe';D.beginPath();D.arc(150,58,18,0,Math.PI*2);D.fill();r(140,52,6,4,'#5aa86a');r(154,60,7,4,'#5aa86a');lab('Terre',150,100,'#28506b');
  D.fillStyle='#c6ced3';D.beginPath();D.arc(202,40,9,0,Math.PI*2);D.fill();lab('?',230,46,'#4a4a4a')
 }
 else if(type==='waves'){
  // Deux ondes : A basse fréquence (espacée), B haute fréquence (serrée) -> B
  lab('A',14,40,'#4f8fbe');D.strokeStyle='#4f8fbe';D.lineWidth=4;D.beginPath();for(let x=34;x<=300;x++){let yy=34+Math.sin((x-34)/26*Math.PI*2)*12;x===34?D.moveTo(x,yy):D.lineTo(x,yy)}D.stroke();
  lab('B',14,92,'#e25c42');D.strokeStyle='#e25c42';D.lineWidth=4;D.beginPath();for(let x=34;x<=300;x++){let yy=86+Math.sin((x-34)/11*Math.PI*2)*12;x===34?D.moveTo(x,yy):D.lineTo(x,yy)}D.stroke()
 }
 else if(type==='light'){
  // Rayon incident + rayon réfléchi sur un miroir
  r(40,92,240,8,'#75898a');for(let i=0;i<14;i++)lineW(46+i*17,100,40+i*17,108,'#5a6b6c',2);
  lineW(60,30,160,92,'#e25c42',4);arrow(155,87,Math.atan2(92-30,160-60),'#e25c42');
  lineW(160,92,260,30,'#f0a030',4);arrow(255,33,Math.atan2(30-92,260-160),'#f0a030');
  D.setLineDash([4,4]);lineW(160,30,160,92,'#888',2);D.setLineDash([]);lab('miroir',160,116,'#4a4a4a')
 }
 else if(type==='filter'){
  // Filtration : mélange versé, entonnoir + papier filtre, liquide clair en bas
  r(120,16,60,8,'#9a8f6f');r(125,24,50,6,'#caa');// résidu/mélange
  D.fillStyle='#cfc6a8';D.beginPath();D.moveTo(118,30);D.lineTo(202,30);D.lineTo(160,72);D.closePath();D.fill();D.strokeStyle='#8d8463';D.lineWidth=2;D.stroke();
  r(156,72,8,18,'#cfc6a8');// tige entonnoir
  r(135,92,50,24,'#cfe7ef');r(135,92,50,5,'#9fd0de');lab('liquide clair',160,110,'#28506b')
 }
 else if(type==='molecule'){
  // Une molécule = atomes liés
  lineW(140,58,180,58,'#555',5);dot(126,48,'#e25c42',22);dot(170,48,'#4f8fbe',22);lab('molécule',160,104,'#4a4a4a')
 }
 else if(type==='volume'){
  // 3 éprouvettes graduées A/B/C, le bon niveau lu au bas du ménisque
  let names=['A','B','C'],fills=[40,55,48];for(let i=0;i<3;i++){let x=42+i*92;r(x,24,46,72,'#eef3ee');r(x,24,46,72,'rgba(0,0,0,0)');D.strokeStyle='#7d8a6b';D.lineWidth=3;D.strokeRect(x,24,46,72);
   for(let g=0;g<6;g++)r(x,34+g*11,8,2,'#9aa78a');
   r(x+3,24+(72-fills[i]),40,fills[i]-3,'#6cc0d6');r(x+3,24+(72-fills[i]),40,3,'#bfeaf2');
   lab(names[i],x+23,114,'#4a4a4a')}
 }
 else{r(45,50,45,25,'#d6a23e');r(135,43,30,32,'#777');r(225,45,28,28,'#f3dd55');for(let x=90;x<225;x+=12)r(x,59,8,3,'#e25c42')}}
function drawBossDiagram(r){let colors={FORET:['#37683d','#89bd55'],JUNGLE:['#1d4a26','#7af0a0'],PLAGE:['#237c93','#e9bd69'],TAIGA:['#65869a','#e9f5f1'],DESERT:['#9a5f35','#d8b45c'],DUNES:['#7a3d22','#e0a85a'],VOLCAN:['#5a1c0a','#ff8a3d'],GROTTE:['#332b33','#7fe0ea']}[currentTheme.n]||['#444','#aaa'];r(0,85,320,35,colors[0]);r(118,24,84,70,colors[0]);r(130,12,60,28,colors[1]);r(140,35,12,12,'#111');r(168,35,12,12,'#111');r(149,58,22,8,'#111');for(let i=0;i<boss.hp;i++)r(125+i*28,102,20,8,'#e74d42')}
// Palette du gardien par biome (sombre, moyen, clair/accent lumineux).
const BOSS_PAL={FORET:['#2f5d39','#4f9148','#8fd06a'],JUNGLE:['#1d4a26','#2f7a3a','#7af0a0'],PLAGE:['#1f6a82','#34a0b5','#ffe0a0'],TAIGA:['#4a6b7d','#7aa6b8','#dff2f5'],DESERT:['#8a5424','#c08436','#f0cd7a'],DUNES:['#7a3d22','#b5683c','#e0a85a'],VOLCAN:['#5a1c0a','#9e2a08','#ff8a3d'],GROTTE:['#2a232a','#4a3f4a','#7fe0ea'],SEQUOIAS:['#5a3a1e','#8a5a2e','#d9a05a'],MARECAGE:['#2a3a24','#4a5e34','#9fd06a'],SAVANE:['#7a5a24','#b58a3c','#ecd07a'],ISLANDE:['#3a4450','#5a6a7a','#bfe0e8'],YELLOWSTONE:['#7a4a18','#c08a2c','#ffd86a'],GLACIER:['#3a5a7a','#5a8ab0','#dff2ff'],MONTAGNE:['#4a4a52','#6a6a76','#c8c8d2']};
// Archétype de SILHOUETTE par biome (8 formes distinctes, jamais le même humanoïde).
const BOSS_SHAPE={FORET:'spirit',SEQUOIAS:'spirit',JUNGLE:'feline',SAVANE:'feline',PLAGE:'tide',MARECAGE:'tide',TAIGA:'icegolem',GLACIER:'icegolem',ISLANDE:'icegolem',DESERT:'sphinx',DUNES:'scarab',VOLCAN:'lava',YELLOWSTONE:'lava',GROTTE:'golem',MONTAGNE:'golem'};
function drawBoss(){let cx=bossEnt.x*T,cy=bossEnt.y*T,t=bossEnt.phase,
 pal=bossColossus?['#4a463e','#7a7264','#c6bda6']:(BOSS_PAL[currentTheme.n]||['#444','#777','#aaa']),
 dead=bossEnt.dead>0,prog=dead?Math.min(1,bossEnt.dead/1.4):0,shake=bossEnt.hurt>0?Math.round(Math.sin(t*60)*3):0;
 // ── ANIMATION D'ÉTAT : intro (rugissement), combat (penché vers le joueur + télégraphe), mort (effondrement)
 X.save();
 if(dead){
  // EFFONDREMENT : le gardien s'enfonce et bascule, débris qui jaillissent
  let sink=prog*26,tilt=prog*.5;X.translate(cx,cy+sink);X.rotate(tilt*Math.sin(prog*30)*.3);X.translate(-cx,-cy);
  for(let i=0;i<10;i++){let a=i/10*Math.PI*2,sp=prog*(40+i*6);rect(cx+Math.cos(a)*sp-6,cy+Math.sin(a)*sp-6-prog*30,12,12,pal[1]);}
  X.globalAlpha=Math.max(0,1-prog*.85);
 }else if(bossPhase==='intro'){
  // RUGISSEMENT : le boss se cabre (grandit) puis retombe pendant l'intro
  let g=Math.sin(Math.min(1,(1.4-bossTimer)/.7)*Math.PI),s=1+g*.18;X.translate(cx,cy+18);X.scale(s,s);X.translate(-cx,-(cy+18));
  if(g>.3){X.globalAlpha=g*.5;for(let i=0;i<6;i++){let a=-Math.PI/2+(i-2.5)*.34,rr=46+g*22;rect(cx+Math.cos(a)*rr-3,cy-20+Math.sin(a)*rr-3,6,6,'#ffcaa0')}X.globalAlpha=1}
 }else if(bossPhase==='dodge'){
  // COMBAT : penche/se rue vers le joueur, télégraphe d'attaque (lueur de charge)
  let dxp=(player.x-bossEnt.x),lean=Math.max(-1,Math.min(1,dxp))*4;
  let beat=(bossEnt.slam!==undefined&&bossEnt.slam<.4&&bossEnt.slam>0)||(bossEnt.tp!==undefined&&bossEnt.tp<.3&&bossEnt.tp>0);
  let lunge=Math.sin(t*5)*2;X.translate(lean+(beat?Math.round(Math.sin(t*50)*3):0),lunge);
  if(beat){X.globalAlpha=.4+Math.sin(t*40)*.2;for(let i=3;i>=1;i--)rect(cx-28-i*5,cy-34-i*4,56+i*10,74+i*8,'#ff5a3c');X.globalAlpha=1}
 }
 // Aura pulsante derrière le gardien (commune à toutes les silhouettes)
 let aura=.18+Math.sin(t*3)*.1;X.globalAlpha=aura;for(let i=3;i>=1;i--){rect(cx-26-i*4,cy-32-i*3,52+i*8,70+i*6,pal[2])}X.globalAlpha=1;
 rect(cx-30,cy+34,60,8,'rgba(10,18,12,.4)'); // ombre portée
 // Dispatcher : chaque biome a SA silhouette pixel-art. hurt clignote en rouge.
 let body=bossEnt.hurt>0&&Math.floor(t*30)%2?'#ff8b80':pal[1];
 let shape=bossColossus?'colossus':(BOSS_SHAPE[currentTheme.n]||'golem');
 ({spirit:bossSpirit,feline:bossFeline,tide:bossTide,icegolem:bossIceGolem,sphinx:bossSphinx,scarab:bossScarab,lava:bossLava,machine:bossMachine,golem:bossGolem,colossus:bossColossusDraw}[shape]||bossGolem)(cx,cy,t,pal,body,shake);
 X.globalAlpha=1;X.restore();
 // Barre de vie segmentée (1 segment par phase) au-dessus du gardien.
 let bw=70,bx=cx-bw/2,by=cy-78;rect(bx-2,by-2,bw+4,8,'#101b12');for(let i=0;i<boss.max;i++){rect(bx+i*(bw/boss.max)+1,by,bw/boss.max-2,4,i<boss.hp?'#ff4d42':'#3a2420')}}
// ── Silhouettes uniques (pixel-art en code) ───────────────────────────────
// GOLEM de pierre (MONTAGNE + fallback) : l'humanoïde massif d'origine.
function bossGolem(cx,cy,t,pal,body,shake){
 rect(cx-28+shake,cy-31,56,66,'#0c140e');rect(cx-26+shake,cy-30,52,64,pal[0]);rect(cx-22+shake,cy-26,44,56,body);rect(cx-20+shake,cy-24,8,50,'rgba(255,255,255,.07)');
 rect(cx-30+shake,cy-16,8,30,pal[0]);rect(cx+22+shake,cy-16,8,30,pal[0]);
 let arm=Math.sin(t*2)*4;rect(cx-40+shake,cy-12+arm,12,26,pal[0]);rect(cx+28+shake,cy-12-arm,12,26,pal[0]);rect(cx-41+shake,cy+12+arm,13,9,pal[1]);rect(cx+28+shake,cy+12-arm,13,9,pal[1]);
 rect(cx-34+shake,cy-26,16,12,pal[0]);rect(cx+18+shake,cy-26,16,12,pal[0]);for(let i=0;i<3;i++){rect(cx-33+shake+i*5,cy-30,3,5,pal[2]);rect(cx+19+shake+i*5,cy-30,3,5,pal[2])}
 let gem=.55+Math.sin(t*5)*.35;X.globalAlpha=gem;rect(cx-6+shake,cy-6,12,12,pal[2]);X.globalAlpha=1;rect(cx-3+shake,cy-3,6,6,'#fff');
 rect(cx-20+shake,cy-50,40,24,'#0c140e');rect(cx-18+shake,cy-48,36,22,pal[0]);rect(cx-14+shake,cy-44,28,16,pal[2]);
 let glow=.6+Math.sin(t*4)*.3;X.globalAlpha=glow;rect(cx-11+shake,cy-42,8,7,'#fff');rect(cx+3+shake,cy-42,8,7,'#fff');X.globalAlpha=1;
 rect(cx-9+shake,cy-41,5,5,'#ff3b2f');rect(cx+4+shake,cy-41,5,5,'#ff3b2f');
 rect(cx-14+shake,cy-58,5,12,pal[2]);rect(cx+9+shake,cy-58,5,12,pal[2]);rect(cx-3+shake,cy-62,6,16,pal[2]);
}
// COLOSSE DE PIERRE ancestral (boss UNIQUE des ruines) : golem géant de blocs empilés,
// fissures lumineuses qui s'embrasent à chaque phase, yeux runiques. Distinct des 15 biomes.
function bossColossusDraw(cx,cy,t,pal,body,shake){
 // intensité des fissures = avancée du combat (plus le boss perd de PV, plus ça rougeoie)
 let rage=boss.max>0?(boss.max-boss.hp)/boss.max:0,sx=cx+shake;
 let crack='#ff7a2a',core=rage>.5?'#ffd23b':'#ff8a3d';
 // jambes-piliers massives
 rect(sx-22,cy+18,16,22,'#0c0f12');rect(sx-20,cy+20,12,20,pal[0]);rect(sx-18,cy+22,8,16,body);
 rect(sx+6,cy+18,16,22,'#0c0f12');rect(sx+8,cy+20,12,20,pal[0]);rect(sx+10,cy+22,8,16,body);
 // torse colossal (gros bloc taillé)
 rect(sx-30,cy-30,60,52,'#0c0f12');rect(sx-28,cy-28,56,48,pal[0]);rect(sx-24,cy-24,48,40,body);
 rect(sx-22,cy-22,10,36,'rgba(255,255,255,.08)'); // arête éclairée
 // joints de pierre (rainures)
 for(let i=1;i<4;i++)rect(sx-24,cy-24+i*10,48,2,'#0c0f12');
 for(let i=1;i<3;i++)rect(sx-24+i*16,cy-24,2,40,'#0c0f12');
 // bras-marteaux (oscillent, plus vite si enragé)
 let arm=Math.sin(t*(2+rage*2))*5;
 rect(sx-44,cy-22+arm,14,30,'#0c0f12');rect(sx-42,cy-20+arm,10,26,pal[0]);rect(sx-44,cy+6+arm,16,14,pal[1]);rect(sx-42,cy+8+arm,12,10,body);
 rect(sx+30,cy-22-arm,14,30,'#0c0f12');rect(sx+32,cy-20-arm,10,26,pal[0]);rect(sx+28,cy+6-arm,16,14,pal[1]);rect(sx+30,cy+8-arm,12,10,body);
 // fissures lumineuses sur le torse (s'embrasent avec la rage)
 let glow=.45+Math.sin(t*5)*.25+rage*.3;X.globalAlpha=Math.min(1,glow);
 rect(sx-4,cy-20,3,38,crack);rect(sx-16,cy-6,12,3,crack);rect(sx+2,cy-12,12,3,core);rect(sx-2,cy+4,3,14,core);
 X.globalAlpha=1;
 // tête : bloc trapézoïdal posé sur le torse
 rect(sx-18,cy-50,36,22,'#0c0f12');rect(sx-16,cy-48,32,20,pal[0]);rect(sx-12,cy-44,24,14,body);
 // yeux runiques
 let eye=.6+Math.sin(t*4)*.3+rage*.2;X.globalAlpha=Math.min(1,eye);
 rect(sx-10,cy-43,7,6,'#fff');rect(sx+3,cy-43,7,6,'#fff');X.globalAlpha=1;
 rect(sx-9,cy-42,5,4,core);rect(sx+4,cy-42,5,4,core);
 // couronne de pierre (3 pointes)
 rect(sx-14,cy-58,5,12,pal[1]);rect(sx-2,cy-62,5,16,pal[1]);rect(sx+9,cy-58,5,12,pal[1]);
 // débris flottants autour (runes qui orbitent)
 X.globalAlpha=.7;for(let i=0;i<4;i++){let a=t*1.2+i*1.57,rr=40+Math.sin(t*2+i)*4;rect(sx+Math.cos(a)*rr-3,cy-14+Math.sin(a)*rr*.5-3,6,6,pal[2])}X.globalAlpha=1;
}
// ESPRIT SYLVESTRE (FORÊT/SÉQUOIAS) : silhouette flottante effilée, traîne vaporeuse,
// yeux luisants, ramures de bois mort. Pas de jambes (flotte).
function bossSpirit(cx,cy,t,pal,body,shake){let fl=Math.sin(t*1.5)*4;
 // traîne spectrale (corps qui s'effiloche vers le bas)
 for(let i=0;i<5;i++){X.globalAlpha=.5-i*.08;rect(cx-10+Math.sin(t*2+i)*4,cy+10+i*8,20-i*3,8,pal[0])}X.globalAlpha=1;
 // tronc/capuche
 rect(cx-16+shake,cy-30+fl,32,46,'#0c140e');rect(cx-14+shake,cy-28+fl,28,42,pal[0]);rect(cx-10+shake,cy-22+fl,20,30,body);
 // bras-branches noueux
 let sw=Math.sin(t*1.8)*6;rect(cx-26+shake,cy-18+fl+sw,12,5,pal[0]);rect(cx-30+shake,cy-20+fl+sw,6,12,pal[0]);rect(cx+14+shake,cy-18+fl-sw,12,5,pal[0]);rect(cx+24+shake,cy-20+fl-sw,6,12,pal[0]);
 // tête encapuchonnée + yeux luisants
 rect(cx-12+shake,cy-44+fl,24,18,'#0c140e');rect(cx-10+shake,cy-42+fl,20,16,pal[0]);
 let glow=.6+Math.sin(t*4)*.35;X.globalAlpha=glow;rect(cx-7+shake,cy-38+fl,5,6,pal[2]);rect(cx+2+shake,cy-38+fl,5,6,pal[2]);X.globalAlpha=1;
 // ramures (bois de cerf)
 rect(cx-12+shake,cy-54+fl,4,12,pal[2]);rect(cx-16+shake,cy-50+fl,4,5,pal[2]);rect(cx+8+shake,cy-54+fl,4,12,pal[2]);rect(cx+12+shake,cy-50+fl,4,5,pal[2]);
}
// FÉLIN/TOTEM (JUNGLE/SAVANE) : grand fauve trapu, posture basse, crocs, motifs.
function bossFeline(cx,cy,t,pal,body,shake){let prowl=Math.sin(t*3)*2;
 // corps allongé bas
 rect(cx-30+shake,cy-6,60,28,'#0c140e');rect(cx-28+shake,cy-4,56,24,pal[0]);rect(cx-24+shake,cy,48,16,body);
 // rayures
 for(let i=0;i<4;i++)rect(cx-18+i*11+shake,cy-2,3,14,pal[0]);
 // pattes
 rect(cx-26+shake,cy+16,10,12,pal[0]);rect(cx+16+shake,cy+16,10,12,pal[0]);rect(cx-6+shake,cy+18,9,10,pal[0]);
 // queue fouettante
 rect(cx+26+shake,cy-2+prowl,12,5,pal[0]);rect(cx+36+shake,cy-8+prowl*2,6,8,pal[2]);
 // tête massive + oreilles
 rect(cx-34+shake,cy-22,26,24,'#0c140e');rect(cx-32+shake,cy-20,22,22,pal[0]);rect(cx-30+shake,cy-12,18,12,pal[2]);
 rect(cx-33+shake,cy-26,6,7,pal[0]);rect(cx-15+shake,cy-26,6,7,pal[0]);
 let glow=.6+Math.sin(t*5)*.35;X.globalAlpha=glow;rect(cx-29+shake,cy-15,5,4,'#ffd24a');rect(cx-19+shake,cy-15,5,4,'#ffd24a');X.globalAlpha=1;
 // crocs
 rect(cx-28+shake,cy-4,3,4,'#fff');rect(cx-20+shake,cy-4,3,4,'#fff');
}
// CRÉATURE DES MARÉES (PLAGE/MARÉCAGE) : masse bulbeuse + tentacules ondulants, coquillage.
function bossTide(cx,cy,t,pal,body,shake){
 // tentacules
 for(let k=0;k<5;k++){let a=(k-2)*.5,wob=Math.sin(t*2.5+k)*6;for(let s=0;s<5;s++){let tx=cx+Math.sin(a)*(s*7)+wob*s/4,ty=cy+10+s*7;rect(tx-3+shake,ty,6,7,s%2?pal[0]:pal[1])}}
 // cloche/tête bulbeuse
 rect(cx-22+shake,cy-26,44,40,'#0c140e');rect(cx-20+shake,cy-24,40,36,pal[0]);rect(cx-15+shake,cy-20,30,26,body);
 // reflets aqueux
 X.globalAlpha=.3;rect(cx-12+shake,cy-18,8,20,'#fff');X.globalAlpha=1;
 // yeux phosphorescents
 let glow=.6+Math.sin(t*4)*.35;X.globalAlpha=glow;rect(cx-10+shake,cy-12,7,7,pal[2]);rect(cx+3+shake,cy-12,7,7,pal[2]);X.globalAlpha=1;
 rect(cx-8+shake,cy-10,3,3,'#0a1a22');rect(cx+5+shake,cy-10,3,3,'#0a1a22');
 // crête de coquillage
 for(let i=0;i<4;i++)rect(cx-15+i*9+shake,cy-30,5,8,pal[2]);
}
// GOLEM DE GLACE (TAIGA/GLACIER/ISLANDE) : blocs cristallins anguleux, cœur gelé, éclats.
function bossIceGolem(cx,cy,t,pal,body,shake){
 rect(cx-26+shake,cy-30,52,62,'#0c1820');rect(cx-24+shake,cy-28,48,58,pal[0]);
 // facettes cristallines
 rect(cx-20+shake,cy-24,18,50,body);rect(cx+2+shake,cy-24,18,50,pal[1]);rect(cx-20+shake,cy-24,6,50,'rgba(255,255,255,.18)');
 // bras de glace
 let arm=Math.sin(t*2)*4;rect(cx-38+shake,cy-14+arm,14,30,pal[0]);rect(cx+24+shake,cy-14-arm,14,30,pal[0]);
 rect(cx-40+shake,cy+12+arm,8,10,pal[2]);rect(cx+32+shake,cy+12-arm,8,10,pal[2]);
 // cœur gelé lumineux
 let gem=.55+Math.sin(t*5)*.35;X.globalAlpha=gem;rect(cx-7+shake,cy-6,14,14,pal[2]);X.globalAlpha=1;rect(cx-3+shake,cy-2,6,6,'#fff');
 // tête anguleuse
 rect(cx-16+shake,cy-48,32,22,'#0c1820');rect(cx-14+shake,cy-46,28,20,pal[1]);
 let glow=.6+Math.sin(t*4)*.3;X.globalAlpha=glow;rect(cx-10+shake,cy-40,7,5,'#bfeaff');rect(cx+3+shake,cy-40,7,5,'#bfeaff');X.globalAlpha=1;
 // pics de glace (couronne)
 rect(cx-14+shake,cy-58,5,12,pal[2]);rect(cx-3+shake,cy-64,5,18,pal[2]);rect(cx+9+shake,cy-58,5,12,pal[2]);
}
// SPHINX (DÉSERT) : corps de lion couché + tête coiffée du némès, regard de braise.
function bossSphinx(cx,cy,t,pal,body,shake){
 // corps couché allongé
 rect(cx-34+shake,cy-2,64,30,'#0c140e');rect(cx-32+shake,cy,60,26,pal[0]);rect(cx-28+shake,cy+4,52,16,body);
 // pattes avant tendues
 rect(cx-30+shake,cy+18,40,10,pal[0]);rect(cx-30+shake,cy+18,8,12,pal[1]);rect(cx-2+shake,cy+18,8,12,pal[1]);
 // tête + némès (coiffe rayée)
 rect(cx-18+shake,cy-30,36,30,'#0c140e');rect(cx-16+shake,cy-28,32,28,pal[2]);
 for(let i=0;i<5;i++)rect(cx-16+i*7+shake,cy-28,3,28,pal[0]);
 // visage
 rect(cx-10+shake,cy-18,20,16,body);
 let glow=.6+Math.sin(t*4)*.3;X.globalAlpha=glow;rect(cx-7+shake,cy-14,5,5,'#ff9a3d');rect(cx+3+shake,cy-14,5,5,'#ff9a3d');X.globalAlpha=1;
 rect(cx-3+shake,cy-8,6,3,'#1a0d0a');
 // uraeus (cobra frontal)
 rect(cx-2+shake,cy-34,5,8,pal[2]);
}
// SCARABÉE COLOSSAL (DUNES) : carapace bombée, élytres, mandibules, pattes articulées.
function bossScarab(cx,cy,t,pal,body,shake){let leg=Math.sin(t*4)*3;
 // pattes articulées (3 paires)
 for(let i=0;i<3;i++){let ly=cy+i*9-4;rect(cx-32+shake,ly+leg,12,4,pal[0]);rect(cx+20+shake,ly-leg,12,4,pal[0])}
 // carapace bombée
 rect(cx-26+shake,cy-22,52,46,'#0c140e');rect(cx-24+shake,cy-20,48,42,pal[0]);
 // ligne médiane des élytres
 rect(cx-2+shake,cy-18,4,38,'#0c140e');
 rect(cx-20+shake,cy-16,16,32,body);rect(cx+4+shake,cy-16,16,32,body);
 // reflet iridescent
 X.globalAlpha=.3;rect(cx-16+shake,cy-14,6,28,'#fff');X.globalAlpha=1;
 // tête + mandibules
 rect(cx-12+shake,cy-34,24,16,pal[0]);
 let glow=.6+Math.sin(t*4)*.3;X.globalAlpha=glow;rect(cx-8+shake,cy-30,5,4,pal[2]);rect(cx+3+shake,cy-30,5,4,pal[2]);X.globalAlpha=1;
 let mand=Math.sin(t*6)*2;rect(cx-14+shake-mand,cy-22,6,5,pal[2]);rect(cx+8+shake+mand,cy-22,6,5,pal[2]);
 // corne frontale (bousier)
 rect(cx-2+shake,cy-42,4,10,pal[2]);
}
// COLOSSE DE LAVE (VOLCAN/YELLOWSTONE) : roche fissurée incandescente, fissures pulsantes.
function bossLava(cx,cy,t,pal,body,shake){let pulse=.5+Math.sin(t*3)*.5;
 rect(cx-28+shake,cy-30,56,64,'#1a0a06');rect(cx-26+shake,cy-28,52,60,pal[0]);rect(cx-22+shake,cy-24,44,52,body);
 // fissures incandescentes (réseau)
 X.globalAlpha=.5+pulse*.5;[[ -16,-20,4,30],[6,-16,4,26],[-10,2,18,4],[-2,-24,3,18]].forEach(([dx,dy,w,h])=>rect(cx+dx+shake,cy+dy,w,h,'#ffb03d'));X.globalAlpha=1;
 // épaules massives
 rect(cx-34+shake,cy-26,14,16,pal[0]);rect(cx+20+shake,cy-26,14,16,pal[0]);
 // bras
 let arm=Math.sin(t*2)*4;rect(cx-40+shake,cy-10+arm,14,28,pal[0]);rect(cx+26+shake,cy-10-arm,14,28,pal[0]);
 // cœur de magma
 let gem=.5+pulse*.5;X.globalAlpha=gem;rect(cx-8+shake,cy-6,16,16,'#ff7a1f');X.globalAlpha=1;rect(cx-3+shake,cy-1,6,6,'#ffe35b');
 // tête fissurée
 rect(cx-16+shake,cy-48,32,22,'#1a0a06');rect(cx-14+shake,cy-46,28,20,pal[0]);
 let glow=.6+Math.sin(t*5)*.3;X.globalAlpha=glow;rect(cx-10+shake,cy-40,7,6,'#ffd24a');rect(cx+3+shake,cy-40,7,6,'#ffd24a');X.globalAlpha=1;
 // panache de fumée/braises
 for(let i=0;i<3;i++){X.globalAlpha=.3-i*.08;rect(cx-4+Math.sin(t*2+i)*6+shake,cy-58-i*8,8,8,'#5a4a44')}X.globalAlpha=1;
}
// MACHINE GARDIENNE (LABO) : châssis métallique, œil-capteur central, antennes, voyants.
function bossMachine(cx,cy,t,pal,body,shake){let scan=Math.sin(t*3);
 // châssis
 rect(cx-26+shake,cy-28,52,60,'#0c1822');rect(cx-24+shake,cy-26,48,56,pal[0]);rect(cx-20+shake,cy-22,40,48,pal[1]);
 // panneaux + rivets
 for(let i=0;i<3;i++)for(let j=0;j<3;j++)rect(cx-16+i*13+shake,cy-18+j*15,2,2,'#0c1822');
 // bras mécaniques (pinces)
 let arm=Math.sin(t*2)*4;rect(cx-38+shake,cy-12+arm,12,8,pal[0]);rect(cx-44+shake,cy-14+arm,8,12,pal[2]);rect(cx+26+shake,cy-12-arm,12,8,pal[0]);rect(cx+36+shake,cy-14-arm,8,12,pal[2]);
 // socle à chenilles
 rect(cx-26+shake,cy+24,52,10,'#0c1822');for(let i=0;i<6;i++)rect(cx-24+i*9+shake,cy+26,6,6,pal[0]);
 // œil-capteur central qui balaie
 let glow=.55+Math.sin(t*6)*.4;X.globalAlpha=glow;rect(cx-9+shake,cy-8,18,10,'#0a1a22');rect(cx-7+Math.round(scan*8)+shake,cy-6,5,6,pal[2]);X.globalAlpha=1;
 // tête-dôme + antennes
 rect(cx-12+shake,cy-44,24,18,pal[0]);rect(cx-9+shake,cy-40,18,12,'#0a1a22');
 X.globalAlpha=glow;rect(cx-6+shake,cy-38,12,5,pal[2]);X.globalAlpha=1;
 rect(cx-12+shake,cy-52,3,9,pal[2]);rect(cx+9+shake,cy-52,3,9,pal[2]);
 let blink=Math.floor(t*4)%2;rect(cx-13+shake,cy-54,5,4,blink?'#ff4d42':'#5a2420');rect(cx+8+shake,cy-54,5,4,blink?'#5a2420':'#ff4d42');
}
function answerQuestion(ok,b,correct){let speedFrac=quizClockOn?Math.max(0,quizClock/quizClockMax):0;quizClockOn=false;if(ui.quizClock)ui.quizClock.classList.add('hidden');
 [...ui.answers.children].forEach((x,i)=>{x.disabled=true;if(i===correct)x.classList.add('correct')});
 if(currentQuestion)attempts.push({text:currentQuestion.text,ok,explain:currentQuestion.explain||'',correct:currentQuestion.opts?currentQuestion.opts[correct]:''});
 if(!ok){b.classList.add('wrong');hp=Math.max(0,hp-HP_QUIZ);errors++;combo=0;score=Math.max(0,score-50);inv=1.5;sfx('bad');if(quizMode==='door'&&pendingDoor)pendingDoor.cool=performance.now()+1600;
  if(quizMode==='villager'){villagerStreak=0;/* mauvaise réponse → la série de villageois retombe à zéro */}}
 else{combo++;maxCombo=Math.max(maxCombo,combo);let mult=1+Math.min(combo-1,4)*.25;if(quizMode==='boss')sfx('boss');else sfx('good');
  let speedBonus=Math.round((quizMode==='boss'?200:120)*speedFrac);
  if(quizMode==='boss'){score+=Math.round(400*mult)+speedBonus;boss.hp--;if(bossEnt){bossEnt.hurt=.6}impact(.4);flash=.3;burst((bossEnt?bossEnt.x:player.x)*T,(bossEnt?bossEnt.y:player.y)*T,'#ffe35b',24,2)}
  else if(quizMode==='door'){let pts=Math.round(150*mult)+speedBonus;score+=pts;if(pendingDoor){pendingDoor.open=true;markRoomSolved(pendingDoor.room);sfx('door');addFloater(pendingDoor.x*T,pendingDoor.y*T-8,'OUVERTE','#8fe6a0');burst(pendingDoor.x*T,pendingDoor.y*T,'#ffe35b',16,1.6)}}
  else if(quizMode==='villager'){let pts=Math.round(120*mult)+speedBonus;score+=pts;villagerStreak++;
   let vx=pendingVillager?pendingVillager.x*T:player.x*T,vy=pendingVillager?pendingVillager.y*T:player.y*T;
   addFloater(vx,vy-14,'+'+pts+' · SÉRIE '+villagerStreak,'#8fe6a0');burst(vx,vy,'#ffe35b',14,1.5);
   if(villagerStreak>=3){villagerStreak=0;grantRandomPower(vx,vy);addFloater(vx,vy-30,'3 D\'AFFILÉE ! POUVOIR','#ffe35b');score+=300}}
  else{let pts=Math.round(250*mult)+speedBonus;score+=pts;collected++;if(pendingArtifact){pendingArtifact.taken=true;addFloater(pendingArtifact.x*T+12,pendingArtifact.y*T,'+'+pts);addPop((pendingArtifact.x+.5)*T,(pendingArtifact.y+.5)*T,'#ffe35b');grantArtifactPower(pendingArtifact)}burst((pendingArtifact?pendingArtifact.x:player.x)*T,(pendingArtifact?pendingArtifact.y:player.y)*T,'#ffe35b',18,1.5)}
  if(speedBonus>0&&speedFrac>.55){let bx=(quizMode==='boss'?(bossEnt?bossEnt.x:player.x):(pendingArtifact?pendingArtifact.x:player.x))*T;addFloater(bx,(quizMode==='boss'?(bossEnt?bossEnt.y:player.y):(pendingArtifact?pendingArtifact.y:player.y))*T-18,'RAPIDE +'+speedBonus,'#6ed2ff')}}
 if(quizMode==='door')pendingDoor=null;
 if(quizMode==='villager'&&pendingVillager){pendingVillager.done=true;pendingVillager=null}
 pendingArtifact=null;
 // Afficher la bonne réponse en clair + l'explication
 let cq=currentQuestion,goodTxt=cq&&cq.opts?cq.opts[correct]:'';
 let head=ok?'<b class="exGood">✓ BONNE RÉPONSE</b>':('<b class="exBad">✗ La bonne réponse était : '+goodTxt+'</b>');
 ui.explainBox.innerHTML=head+(cq&&cq.explain?'<span>'+cq.explain+'</span>':'');
 ui.explainBox.classList.remove('hidden');
 // Bouton CONTINUER : avance manuellement ; auto-avance plus lente si erreur (lecture)
 ui.continueBtn.classList.remove('hidden');ui.continueBtn.focus&&ui.continueBtn.focus();
 ui.continueBtn.onclick=()=>{if(quizAdvanced)return;advanceAfterQuiz()};
 quizAdvanced=false;
 clearTimeout(quizTimer);quizTimer=setTimeout(()=>{if(!quizAdvanced)advanceAfterQuiz()},ok?2000:4200)}
function advanceAfterQuiz(){quizAdvanced=true;clearTimeout(quizTimer);ui.continueBtn.classList.add('hidden');
 if(hp<=0)return finish(false);
 if(quizMode==='boss'){if(boss.hp<=0){show('play');bossPhase='dead';bolts=[];minions=[];zones=[];if(bossEnt){bossEnt.dead=.01;burst(bossEnt.x*T,bossEnt.y*T,'#ffe35b',40,3);impact(.7);flash=.5;sound(80,.6,'sawtooth',.06)}}else startBossDodge()}else show('play')}
// VICTOIRE : avant l'écran de résultat, on joue une courte animation de célébration en jeu
// (le héros saute, confettis/étincelles, bannière VICTOIRE). La défaite va directement au résultat.
function finish(win){if(win&&state!=='victory'){startVictoryAnim();return}showResult(win)}
let victoryAnim=null;
function startVictoryAnim(){state='victory';sfx('win');cancelAnimationFrame(raf);
 victoryAnim={t:0,parts:[],cx:player?player.x*T:W/2,cy:player?player.y*T:H/2};
 for(let i=0;i<60;i++){let a=Math.random()*Math.PI*2,sp=40+Math.random()*120;victoryAnim.parts.push({x:victoryAnim.cx,y:victoryAnim.cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-90,g:140+Math.random()*120,life:1.2+Math.random()*1.4,c:['#ffe35b','#ff8b3c','#6fe06f','#5fd0ff','#ff6b9d','#fff'][rng(6)],s:2+rng(3)})}
 impact(.6);sound(520,.12,'square',.05);setTimeout(()=>sound(660,.12,'square',.05),120);setTimeout(()=>sound(820,.2,'square',.05),260);
 last=performance.now();raf=requestAnimationFrame(victoryLoop)}
function victoryLoop(t){let dt=Math.min(.033,(t-last)/1000||0);last=t;victoryAnim.t+=dt;
 victoryAnim.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.vx*=.99;p.life-=dt});
 victoryAnim.parts=victoryAnim.parts.filter(p=>p.life>0);
 if(victoryAnim.t<.9&&Math.random()<dt*30){let a=Math.random()*Math.PI*2,sp=30+Math.random()*100;victoryAnim.parts.push({x:victoryAnim.cx+(Math.random()-.5)*60,y:victoryAnim.cy-20,vx:Math.cos(a)*sp,vy:-Math.random()*120,g:160,life:1+Math.random(),c:['#ffe35b','#ff8b3c','#6fe06f','#5fd0ff','#fff'][rng(5)],s:2+rng(2)})}
 draw();drawVictoryAnim();
 if(victoryAnim.t>2.1){victoryAnim=null;showResult(true);return}
 raf=requestAnimationFrame(victoryLoop)}
function drawVictoryAnim(){let v=victoryAnim,t=v.t;
 // assombrissement progressif léger pour faire ressortir la fête
 X.fillStyle='rgba(8,12,20,'+Math.min(.35,t*.25)+')';X.fillRect(0,0,W,H);
 // confettis
 v.parts.forEach(p=>{X.globalAlpha=Math.min(1,p.life);rect(p.x-cam.x,p.y-cam.y,p.s,p.s,p.c)});X.globalAlpha=1;
 // héros qui saute de joie (rebond) au centre de l'écran de fête
 let hx=v.cx-cam.x,jump=Math.abs(Math.sin(t*6))*14,hy=v.cy-cam.y-jump;
 if(player){let ch=activeLook();rect(hx-7,hy-2,14,16,ch.shirt);rect(hx-6,hy-15,12,13,ch.hat);rect(hx-3,hy-11,6,6,ch.skin);
  // bras levés en V
  rect(hx-11,hy-12-Math.round(jump*.3),4,9,ch.shirt);rect(hx+7,hy-12-Math.round(jump*.3),4,9,ch.shirt)}
 // bannière VICTOIRE qui descend du haut puis pulse
 let by=Math.min(58,t*180-20),sc=1+Math.sin(t*5)*.05;
 X.save();X.translate(W/2,by);X.scale(sc,sc);
 pxText('VICTOIRE !',0,-8,'#101b12','center',22);pxText('VICTOIRE !',-2,-10,'#ffe35b','center',22);
 if(t>.7)pxText(['★','★ ★','★ ★ ★'][Math.min(2,(maxHp>0?(hp/maxHp>=.8?2:hp/maxHp>=.4?1:0):0))],0,16,'#ffd24a','center',12);
 X.restore()}
function showResult(win){cancelAnimationFrame(raf);state='result';if(!win)sfx('lose');let bonus=win?Math.ceil(time)*5:0;
 // ÉTOILES selon les PV restants : ≥80 %=3★, ≥40 %=2★, sinon 1★.
 let hpFrac=maxHp>0?hp/maxHp:0,stars=win?(hpFrac>=.8?3:hpFrac>=.4?2:1):0;score+=bonus;
 // RUBIS gagnés cette partie (affichés sur l'écran de résultat).
 let rubisGain=0;
 // ÉPREUVE DU TEMPLE = fin d'un niveau CLASSIQUE → on enregistre les étoiles/score du chapitre.
 if(win&&(!isRuins||templeTrial)){localStorage.setItem(starKey(selectedChapter),Math.max(stars,+(localStorage.getItem(starKey(selectedChapter))||0)));
  localStorage.setItem(bestKey(selectedChapter),Math.max(score,+(localStorage.getItem(bestKey(selectedChapter))||0)));
  // RUBIS de fin de niveau : 10 par étoile.
  rubisGain+=stars*RUBIS_PAR_ETOILE;}
 if(win&&isRuins&&!templeTrial){localStorage.setItem('temple-ruins-'+gradePrefix()+'cleared','1');
  // clé par nœud (ruines intermédiaires) → coche la crypte précise sur la carte
  if(ruinsNodeId)localStorage.setItem('temple-ruins-'+gradePrefix()+ruinsNodeId+'-cleared','1');
  // RUBIS : crypte intermédiaire = 40, Ruines finales = 120.
  rubisGain+=(ruinsSize==='small'?RUBIS_CRYPTE:RUBIS_RUINES);}
 // Trésor caché récupéré dans le niveau (drapeau treasureBonus posé au ramassage).
 if(win&&treasureBonus){rubisGain+=RUBIS_TRESOR;treasureBonus=false}
 if(rubisGain>0)addRubis(rubisGain);
 let total=(+(localStorage.getItem('temple-total')||0))+score;localStorage.setItem('temple-total',total);
 let badges=JSON.parse(localStorage.getItem('temple-badges')||'{}'),newBadges=[];
 const grant=(k,label)=>{if(!badges[k]){badges[k]=1;newBadges.push(label)}};
 if(win){grant('victoire','PREMIÈRE VICTOIRE');if(errors===0)grant('sansfaute','SANS FAUTE');if(stars>=3)grant('troisetoiles','3 ÉTOILES');if(Math.ceil(time)>=90)grant('rapide','EXPLORATEUR RAPIDE');if(maxCombo>=4)grant('combo','COMBO MAÎTRE')}
 localStorage.setItem('temple-badges',JSON.stringify(badges));
 let review=attempts.length?`<div class="review"><b>NOTIONS RÉVISÉES</b>${attempts.map(a=>`<div class="rev ${a.ok?'ok':'ko'}">${a.ok?'✓':'✗'} ${a.text}${!a.ok&&a.explain?`<em class="revExp">${a.correct?'→ '+a.correct+'. ':''}${a.explain}</em>`:''}</div>`).join('')}</div>`:'';
 let dungeonRes=isRuins&&!templeTrial; // les ruines/cryptes ont un écran de résultat dédié
 let pname=(getProfile().name||'').trim();
 let title=dungeonRes?(win?'RUINES CONQUISES !':'RUINES TROP DANGEUREUSES'):(win?(pname?'BRAVO '+pname.toUpperCase()+' !':'GARDIEN VAINCU !'):'EXPÉDITION TERMINÉE');
 // ── ÉCRAN DE RÉSULTAT REDESIGNÉ : bannière, étoiles, tuiles de stats, récompenses, révisions ──
 let progMain=dungeonRes?(treasure&&treasure.taken?'TRÉSOR RÉCUPÉRÉ':'TRÉSOR PERDU'):`${collected>=4?4:collected}/4 ARTEFACTS`;
 // tuiles de statistiques (icône pixel + valeur)
 let tile=(cls,val,lab)=>`<div class="resTile ${cls}"><b>${val}</b><small>${lab}</small></div>`;
 let statTiles=`<div class="resTiles">`
  +tile('sc','<span class="pcoin"></span>'+score,'SCORE')
  +tile('cb','x'+maxCombo,'COMBO MAX')
  +tile('er',errors,errors?'ERREURS':'SANS FAUTE')
  +tile('tm',Math.ceil(time)+'s','TEMPS RESTANT')
  +`</div>`;
 // récompenses (rubis + nouveaux badges)
 let rewards='';
 if(win&&rubisGain>0)rewards+=`<div class="resReward rubis">+${rubisGain} <span class="rubisGem"></span> RUBIS</div>`;
 if(newBadges.length)rewards+=newBadges.map(b=>`<div class="resReward badge">★ ${b}</div>`).join('');
 let rewardsHtml=rewards?`<div class="resRewards">${rewards}</div>`:'';
 ui.resultText.innerHTML=noAcc(
  `<div class="resCard ${win?'won':'lost'}">`
  +`<div class="resBanner">${win?'<span class="resWreath l"></span>':''}<span class="resTitle">${title}</span>${win?'<span class="resWreath r"></span>':''}</div>`
  +`<div class="resStars">${pixelStars(stars)}</div>`
  +`<div class="resProg">${progMain} · ${dungeonRes?'':'RÉCAP DE L\'EXPÉDITION'}</div>`
  +statTiles
  +rewardsHtml
  +review
  +`<div class="resTotals">TOTAL CARRIÈRE : ${total} PTS · ${getRubis()} <span class="rubisGem"></span></div>`
  +`</div>`);
 logResult(win,stars);
 // l'épreuve du temple appartient à un niveau CLASSIQUE → on quitte le mode donjon pour que
 // « Rejouer » relance le chapitre (startGame) et non un donjon de ruines.
 if(templeTrial){isRuins=false;}templeTrial=false;trialCtx=null;
 show('result')}
function logResult(win,stars){try{let log=JSON.parse(localStorage.getItem('temple-log')||'[]');
  log.push({date:new Date().toISOString(),grade:gradeLevel,ch:selectedChapter,chName:'['+(gradeLevel==='4e'?'4ᵉ':'5ᵉ')+'] '+(isRuins&&!templeTrial?'Ruines du Temps':curBank().chapters[selectedChapter].n),win:!!win,score:score,stars:stars,errors:errors,comboMax:maxCombo,
   attempts:attempts.map(a=>({text:a.text,ok:!!a.ok}))});
  if(log.length>200)log=log.slice(log.length-200);
  localStorage.setItem('temple-log',JSON.stringify(log));
 }catch(e){}}
function replayLevel(){if(isRuins)startRuins();else startGame(selectedChapter)}
// Depuis le menu PAUSE : recommencer le niveau courant (annule la boucle en cours avant de relancer).
function pauseRestart(){paused=false;cancelAnimationFrame(raf);let ov=document.querySelector('#pauseMenu');if(ov)ov.classList.add('hidden');boss.active=false;if(isRuins)startRuins(ruinsSize,ruinsNodeId);else startGame(selectedChapter)}
// Depuis le menu PAUSE : retourner à la carte de sélection des niveaux (chapitres) du grade courant.
function pauseLevels(){paused=false;cancelAnimationFrame(raf);let ov=document.querySelector('#pauseMenu');if(ov)ov.classList.add('hidden');boss.active=false;map=[];showChapters()}
function loop(t){let dt=Math.min(.033,(t-last)/1000||0);last=t;
 // try/catch GLOBAL : une exception isolée (audio/rendu) ne doit JAMAIS geler la boucle de jeu.
 try{if(state==='play'&&!paused)update(dt);else if(state==='quiz'&&!paused)tickQuizClock(dt)}catch(e){if(window.console)console.error('update',e)}
 try{updateMusic()}catch(e){if(window.console)console.error('music',e)}
 try{draw()}catch(e){if(window.console)console.error('draw',e)}
 raf=requestAnimationFrame(loop)}
// Ordonnanceur musique pour les ECRANS DE MENU : la boucle de jeu (loop) ne tourne qu'en partie,
// donc on planifie ici les notes du theme d'accueil tant qu'on est dans un menu.
setInterval(()=>{if(menuMusic&&music.on&&state!=='play'&&state!=='quiz')updateMusic()},60);
function rect(x,y,w,h,c){X.fillStyle=c;X.fillRect(Math.round(x),Math.round(y),w,h)}
// La police Press Start 2P n'a pas de glyphes accentués (rendu fallback plus petit) :
// on remplace les accents par leurs équivalents non accentués pour tout le texte pixel.
const _ACCENTS={'à':'a','â':'a','ä':'a','á':'a','è':'e','é':'e','ê':'e','ë':'e','î':'i','ï':'i','í':'i','ô':'o','ö':'o','ó':'o','ù':'u','û':'u','ü':'u','ú':'u','ç':'c','œ':'oe','æ':'ae','À':'A','Â':'A','Ä':'A','Á':'A','È':'E','É':'E','Ê':'E','Ë':'E','Î':'I','Ï':'I','Í':'I','Ô':'O','Ö':'O','Ó':'O','Ù':'U','Û':'U','Ü':'U','Ú':'U','Ç':'C','Œ':'OE','Æ':'AE','’':'\'','‘':'\'','…':'...','·':'-','–':'-','—':'-'};
function noAcc(s){return String(s).replace(/[^\x00-\x7F]/g,ch=>_ACCENTS[ch]!==undefined?_ACCENTS[ch]:ch)}
function pxText(s,x,y,c='#fff',align='left',size=8){s=noAcc(s);X.font=`${size}px "Press Start 2P"`;X.textAlign=align;X.fillStyle='#101b12';X.fillText(s,x+1,y+1);X.fillStyle=c;X.fillText(s,x,y)}
function draw(){
 if(!map.length){if(state==='levelSelect'||state==='chapterScreen')drawMapBackdrop();else drawBackdrop();return}
 // Fond hors-monde : couleur de voile biome (filet de sécurité ; l'apron couvre tout l'écran).
 rect(0,0,W,H,isRuins?'#161a1d':apronVoidColor());
 // RUINES : grande caverne sombre derrière le donjon (cache les bordures de map, casse la pierre uniforme).
 if(isRuins)drawRuinsVoid();
 X.save();X.translate(-Math.floor(cam.x),-Math.floor(cam.y));
 if(isRuins)drawRuinsCavernWall(); // paroi rocheuse de caverne tout autour du donjon (au-delà des murs)
 if(!isRuins)drawApron(); // lisière de terrain biome (le monde « continue » au-delà du mur invisible)
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)drawTile(x,y,map[y][x]);
 if(!isRuins&&elev.length)drawAltitude();
 if(!isRuins){groundDecor.forEach(drawGroundDecor);wells.forEach(drawWell);ruinSites.forEach(drawRuinSite)}
 quicksands.forEach(drawQuicksand);holes.forEach(drawHole);traps.forEach(drawTrap);geysers.forEach(g=>drawGeyser(g,'base'));artifacts.forEach(a=>{if(!a.taken)drawArtifact(a)});powerups.forEach(p=>{if(!p.taken)drawPowerup(p)});zones.forEach(drawZone);
 if(isRuins){props.forEach(drawProp);cobwebs.forEach(drawCobweb);portals.forEach(drawPortal);drawBeam();mirrors.forEach(drawMirror);levers.forEach(drawLever);plates.forEach(drawPlate);tripwires.forEach(drawTripwire);pendingPits.forEach(drawCollapsing);blocks.forEach(drawBlock);crushers.forEach(drawCrusher);closingWalls.forEach(drawClosingWall);drawCrossGates();doors.forEach(drawDoor);keysArr.forEach(drawKey);movers.forEach(m=>m.kind==='spike'?drawSpike(m):drawBlade(m));if(boulder&&(curRoom&&boulder.room===curRoom.id))drawBoulder(boulder);if(treasure)drawTreasure(treasure)}
 if(trapReveal>0){let bl=(Math.sin(performance.now()*.012)*.5+.5)*.6+.4,a=Math.min(1,trapReveal);X.save();X.globalAlpha=bl*a;[...traps,...holes,...quicksands].forEach(o=>{let cx=(o.x+.5)*T,cy=(o.y+.5)*T;X.strokeStyle='#ff5b5b';X.lineWidth=2;X.strokeRect(o.x*T+2,o.y*T+2,T-4,T-4);rect(cx-1,o.y*T-4,2,3,'#ff5b5b')});X.restore()}
 if(exit)drawExit(exit);drawFireflies();
 if(boss.active&&bossEnt)drawBoss();
 minions.forEach(drawMinion);
 bolts.forEach(drawBolt);
 // ----- RENDU TRI PAR PROFONDEUR (layering) -----
 // Arbres, joueur, animaux et serpents partagent une même liste triée par « pieds » (y bas).
 // Ainsi le joueur passe DERRIÈRE un feuillage situé devant lui, et DEVANT ceux situés derrière.
 let drawables=[];
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map[y][x]===1)drawables.push({d:y+0.95,kind:'tree',x,y});
 animals.forEach(a=>drawables.push({d:a.y,kind:'animal',e:a}));
 snakes.forEach(a=>drawables.push({d:a.y,kind:'snake',e:a}));
 if(!isRuins){structures.forEach(s=>drawables.push({d:s.y+1,kind:'struct',e:s}));
  villagers.forEach(v=>drawables.push({d:v.y,kind:'villager',e:v}))}
 drawables.push({d:player.y,kind:'player'});
 drawables.sort((p,q)=>p.d-q.d);
 drawables.forEach(o=>{if(o.kind==='tree')drawTree(o.x,o.y);else if(o.kind==='animal')drawAnimalFx(o.e);else if(o.kind==='snake')drawSnake(o.e);else if(o.kind==='struct')drawStructure(o.e);else if(o.kind==='villager')drawVillager(o.e);else drawPlayer()});
 geysers.forEach(g=>drawGeyser(g,'col')); // colonne d'éruption par-dessus le joueur
 animals.forEach(drawAlert);snakes.forEach(drawAlert);
 if(!isRuins)villagers.forEach(drawVillagerPrompt);
 particles.forEach(p=>{X.globalAlpha=Math.max(0,Math.min(1,p.life*3));rect(p.x,p.y,p.size,p.size,p.color)});X.globalAlpha=1;
 drawPops();drawAmbient();
 floaters.forEach(f=>{X.globalAlpha=Math.max(0,Math.min(1,f.life));pxText(f.text,f.x,f.y,f.color,'center',10)});X.globalAlpha=1;
 X.restore();
 biomeTint();
 drawWeather();
 drawBirds(); // oiseaux qui traversent le ciel (au-dessus du décor)
 drawLightShafts(); // rais de lumière poussiéreux des ruines finales (Indiana Jones)
 drawHudOverlay();
 if(flash>0){X.fillStyle='rgba(255,255,255,'+flash*.6+')';X.fillRect(0,0,W,H)}
 if(isRuins&&fade>0){X.fillStyle='rgba(0,0,0,'+fade+')';X.fillRect(0,0,W,H);if(fade>.55&&curRoom)pxText(roomGoal(fadeTo||curRoom),W/2,H/2,'#ffe35b','center',10)}
}
// Pénombre de temple : obscurité ambiante percée par la torche du joueur et les flammes.
// Donne une vraie atmosphère « exploration souterraine à la lampe » (Indiana Jones).
function drawRuinsDarkness(){if(!settingsData.motion){return}
 let t=performance.now()*.001;
 // couche d'obscurité TRÈS LÉGÈRE : on garde une ambiance de temple à la torche mais
 // le donjon reste parfaitement LISIBLE (les torches murales éclairent vraiment les salles).
 // Pendant le combat du gardien, on éclaircit encore pour garder l'esquive nette.
 // voile NEUTRE (gris-pierre légèrement chaud, sans dominante verte/bleue) → donjon propre et lisible.
 // OBSCURITÉ PROFONDE (façon Minecraft sous-terrain) : la salle est presque noire, SEULES les
 // torches (murales + celle du joueur) découpent des halos de lumière. Combat gardien éclairci.
 let dark=boss.active?'rgba(8,6,5,.5)':'rgba(6,5,8,.86)';
 X.save();
 // 1) on peint le voile sombre
 X.fillStyle=dark;X.fillRect(0,0,W,H);
 // 2) on « creuse » des halos de lumière aux sources (destination-out efface le voile)
 X.globalCompositeOperation='destination-out';
 let lights=[];
 // torche du joueur : halo VIVANT qui vacille fortement (flamme animée façon Minecraft).
 let pflick=.86+Math.sin(t*11)*.07+Math.sin(t*27)*.04+Math.sin(t*4.3)*.03;
 // le halo se décale vers la main qui tient la torche (selon la direction du regard).
 let tdx=player.dir===3?-.35:player.dir===1?.35:0;
 lights.push({x:(player.x+.5+tdx)*T-cam.x,y:(player.y+.25)*T-cam.y,r:(boss.active?170:120)*pflick,soft:.5,warm:true});
 // halo autour du gardien pendant le combat (toujours visible).
 if(boss.active&&bossEnt)lights.push({x:(bossEnt.x+.5)*T-cam.x,y:(bossEnt.y+.5)*T-cam.y,r:150,soft:.5});
 // flammes du décor : torches murales (grandes), brasiers, torches au sol, runes allumées.
 props.forEach(p=>{
  let isWall=p.type==='walltorch';
  let isFlame=isWall||p.type==='brazier'||p.type==='torch'||(p.type==='rune'&&p.lit);
  if(!isFlame)return;
  let sx=(p.x+.5)*T-cam.x,sy=(p.y+(isWall?.5:.4))*T-cam.y;
  if(sx<-120||sx>W+120||sy<-120||sy>H+120)return;
  let fl=.88+Math.sin(t*7+p.x*1.7)*.08+Math.sin(t*19+p.y)*.04;
  let rad=(isWall?128:p.type==='brazier'?100:p.type==='rune'?96:78)*fl;
  lights.push({x:sx,y:sy,r:rad,soft:isWall?.5:.55});
 });
 lights.forEach(L=>{let g=X.createRadialGradient(L.x,L.y,L.r*.12,L.x,L.y,L.r);
  g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(L.soft,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');
  X.fillStyle=g;X.beginPath();X.arc(L.x,L.y,L.r,0,Math.PI*2);X.fill()});
 X.restore();
 // 3) teinte chaude par-dessus les zones éclairées (ambiance ambrée RICHE des torches)
 X.save();X.globalCompositeOperation='lighter';
 lights.forEach(L=>{let g=X.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r*.9);
  let a=L.warm?.26:.2,core=L.warm?'rgba(255,176,82,':'rgba(255,150,60,';
  g.addColorStop(0,core+a+')');g.addColorStop(.45,core+(a*.5)+')');g.addColorStop(1,core+'0)');
  X.fillStyle=g;X.beginPath();X.arc(L.x,L.y,L.r*.9,0,Math.PI*2);X.fill()});
 X.restore();X.globalAlpha=1;X.globalCompositeOperation='source-over';
 // 4) braises montantes près des torches murales (atmosphère vivante)
 X.save();X.globalCompositeOperation='lighter';
 props.forEach(p=>{if(p.type!=='walltorch')return;let sx=(p.x+.5)*T-cam.x,sy=(p.y+.2)*T-cam.y;
  if(sx<-20||sx>W+20||sy<-20||sy>H+20)return;
  for(let i=0;i<3;i++){let ph=t*1.4+p.x*2.3+i*2.1,ry=(ph%2)/2,ex=sx+Math.sin(ph*3+i)*4,ey=sy-ry*22;
   X.globalAlpha=(1-ry)*.5;rect(ex,ey,2,2,i%2?'#ffcf6a':'#ff8a3a')}});
 X.restore();X.globalAlpha=1;X.globalCompositeOperation='source-over';
}
// RAIS DE LUMIÈRE DU JOUR (RUINES FINALES) : pour chaque trou du plafond (prop 'lightshaft'),
// un faisceau poussiéreux plonge en BIAIS depuis le haut de l'écran jusqu'au sol, avec des
// particules de poussière qui dansent dedans. Repère ÉCRAN (dessiné après le X.restore()).
function drawLightShafts(){
 if(!isRuins||ruinsSize!=='final'||!settingsData.motion)return;
 let t=performance.now()*.001;
 let shafts=props.filter(p=>p.type==='lightshaft');if(!shafts.length)return;
 X.save();X.globalCompositeOperation='lighter';X.imageSmoothingEnabled=false;
 let STEP=4; // hauteur d'une bande pixel (le rai est tramé en escaliers, pas un dégradé lisse)
 shafts.forEach(p=>{
  let gx=(p.x+.5)*T-cam.x,gy=(p.y+1)*T-cam.y;            // point d'impact au sol (écran)
  if(gx<-90||gx>W+90)return;                             // hors-champ horizontal
  let slant=20+(p.seed%7);                               // inclinaison du rai (biais doux)
  let topX=gx-slant,topY=-STEP;                          // entrée du rai en haut de l'écran
  let wTop=(p.w||1)*3+3,wBot=(p.w||1)*5+7;               // largeur (étroit en haut, large en bas)
  let fl=.82+Math.sin(t*.7+p.seed)*.1;                   // léger pouls d'intensité
  let H2=gy-topY;if(H2<=0)return;
  // BANDES HORIZONTALES en vrais pixels : largeur et position interpolées, alignées sur la grille STEP.
  for(let yy=topY;yy<gy;yy+=STEP){
   let ph=(yy-topY)/H2;                                  // 0 en haut → 1 au sol
   let cxp=Math.round(topX+(gx-topX)*ph);                // centre de la bande (biais)
   let hw=Math.round((wTop+(wBot-wTop)*ph)/2);           // demi-largeur
   let fade=1-ph*.15;                                    // s'estompe un peu vers le bas (vers la flaque)
   // halo externe (large, faible)
   X.globalAlpha=.10*fl*fade;X.fillStyle='#ffe6a0';
   X.fillRect(cxp-hw,Math.round(yy),hw*2,STEP);
   // cœur du rai (étroit, plus vif) — décalé légèrement pour un grain pixel
   let hwC=Math.max(1,Math.round(hw*.45));
   X.globalAlpha=.18*fl*fade;X.fillStyle='#fff4d2';
   X.fillRect(cxp-hwC,Math.round(yy),hwC*2,STEP);
  }
  // POUSSIÈRE : quelques grains carrés qui dérivent dans le faisceau (peu nombreux, nets).
  for(let i=0;i<5;i++){
   let ph=(t*.1+i*.5+p.seed*.07)%1;
   let cxp=topX+(gx-topX)*ph+Math.round(Math.sin(t*.7+i*2.3)*3);
   let yy=topY+H2*ph;
   let a=Math.sin(ph*Math.PI)*.55*fl;
   X.globalAlpha=Math.max(0,a);X.fillStyle='#fff8e2';
   X.fillRect(Math.round(cxp),Math.round(yy),2,2);
  }
  X.globalAlpha=1;
 });
 X.restore();X.globalCompositeOperation='source-over';
}
// Voile coloré léger par biome (atmosphère) + vignette douce.
function biomeTint(){let n=currentTheme?currentTheme.n:'';
 // EN RUINES : on IGNORE la teinte végétale/colorée du biome (c'est elle qui rendait le donjon
 // « vert / sale »). Le donjon de pierre garde sa propre ambiance neutre via drawRuinsDarkness().
 if(!isRuins){let tint={VOLCAN:'rgba(120,30,0,.14)',GROTTE:'rgba(20,15,30,.18)',TAIGA:'rgba(150,180,210,.10)',DESERT:'rgba(160,110,30,.08)'}[n]||(currentTheme&&currentTheme.tint);if(tint){X.fillStyle=tint;X.fillRect(0,0,W,H)}
  todOverlay();}
 // vignette (très douce en Ruines pour ne pas réassombrir les bords des salles éclairées)
 let g=X.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,isRuins?'rgba(0,0,0,.12)':(n==='GROTTE'?'rgba(0,0,0,.42)':n==='TAIGA'?'rgba(0,10,20,.28)':'rgba(0,0,0,.26)'));X.fillStyle=g;X.fillRect(0,0,W,H)}
// ── MOMENT DE LA JOURNÉE (couche colorée par-dessus le décor) ──
// AUBE = teinte rosée + halo bas-est ; COUCHER = orange chaud + halo bas-ouest ;
// NUIT = voile bleu nuit + lune + étoiles. Jour = neutre. (Désactivé en grottes/ruines.)
function todOverlay(){
 if(isRuins||currentTheme.n==='GROTTE')return;
 let now=performance.now();
 // Ambiances colorées du ciel uniquement — AUCUN astre visible (ni soleil ni lune).
 if(tod==='dawn'){
  let grd=X.createLinearGradient(0,0,0,H);grd.addColorStop(0,'rgba(120,90,150,.30)');grd.addColorStop(.55,'rgba(255,180,150,.12)');grd.addColorStop(1,'rgba(255,150,110,.20)');
  X.fillStyle=grd;X.fillRect(0,0,W,H);
 }else if(tod==='sunset'){
  let grd=X.createLinearGradient(0,0,0,H);grd.addColorStop(0,'rgba(60,40,90,.28)');grd.addColorStop(.5,'rgba(255,140,60,.16)');grd.addColorStop(1,'rgba(230,90,40,.22)');
  X.fillStyle=grd;X.fillRect(0,0,W,H);
 }else if(tod==='night'){
  X.fillStyle='rgba(14,22,52,.46)';X.fillRect(0,0,W,H);
  // étoiles scintillantes uniquement (pas de lune) — positions stables via hash, scintillement via le temps
  for(let i=0;i<26;i++){let sx=((i*97+13)%W),sy=((i*53+7)%(H*.55))|0,tw=(Math.sin(now*.003+i*1.7)*.5+.5);if(tw>.4)rect(sx,sy,1,1,'rgba(235,242,255,'+(tw*.9).toFixed(2)+')')}
 }
}
// ── OISEAUX : passent parfois en vol plané à travers le ciel pour donner de la vie ──
function updateBirds(dt){
 // Oiseaux d'ambiance retirés de tous les niveaux (demande utilisateur). Tableau toujours vide.
 if(birds.length)birds.length=0;
}
function drawBirds(){
 // Vraie silhouette d'oiseau pixel-art (corps + tête + queue) avec battement d'ailes sur 2 phases.
 // f = phase de battement : 0 (ailes hautes) → 1 (ailes basses). On dessine des ailes coudées,
 // pas un simple « M » plat, et un petit corps orienté dans le sens du vol.
 birds.forEach(b=>{
  let f=Math.sin(b.flap),flip=b.vx<0?-1:1,col=b.col,lit=shade(col,30);
  let r=(dx,dy,w,h,c)=>{X.fillStyle=c;X.fillRect(Math.round(b.x+dx*flip),Math.round(b.y+dy),w,h)};
  let up=f>0;                                  // ailes vers le haut ou vers le bas
  if(up){
   // ── ailes RELEVÉES (en V) ──
   r(-8,-4,3,2,col);r(-6,-2,3,2,col);          // aile arrière montante (coudée)
   r(4,-4,3,2,col); r(2,-2,3,2,col);           // aile avant montante
   r(-1,-1,4,3,col);                           // corps
   r(2,-2,3,2,col);                            // tête/épaule avant
   r(4,-2,2,1,lit);                            // pointe de tête (clair = relief)
   r(-3,0,2,2,col);                            // queue
  }else{
   // ── ailes ABAISSÉES (battement bas) ──
   r(-9,1,3,2,col);r(-7,0,3,2,col);            // aile arrière descendante
   r(5,1,3,2,col); r(3,0,3,2,col);             // aile avant descendante
   r(-1,-1,4,3,col);                           // corps
   r(2,-2,3,2,col);                            // tête
   r(4,-2,2,1,lit);
   r(-3,0,2,2,col);                            // queue
  }
 });
}
// ── MÉTÉO & LUMIÈRE (couche écran, par-dessus le voile) ──────────────────────
// Effets immersifs propres à chaque biome : rayons de soleil, brume, éclairs de pluie, chaleur…
function drawWeather(){if(!settingsData.motion)return;let w=currentTheme&&currentTheme.weather,t=performance.now()*.001;if(!w||isRuins&&w!=='ash'&&w!=='spark')return;
 // VENT : traînées horizontales filant dans la direction du vent + léger souffle plus visible en rafale.
 if(!isRuins&&currentTheme.wind&&windStreaks.length){let dx=Math.cos(windDir),dy=Math.sin(windDir)*.5,col=currentTheme.n==='GLACIER'?'#eaf4fb':currentTheme.n==='DUNES'?'#e7c98a':'#dfe9f0';X.save();X.lineCap='round';windStreaks.forEach(s=>{let a=s.a*(.6+windGust*.7);X.strokeStyle=col;X.globalAlpha=a;X.lineWidth=1;X.beginPath();X.moveTo(s.x,s.y);X.lineTo(s.x-dx*s.len,s.y-dy*s.len);X.stroke()});X.restore();X.globalAlpha=1;
  // bannière "VENT" lors d'une forte rafale → feedback clair que ça pousse
  if(windGust>.55){X.save();X.globalAlpha=(windGust-.55)*.8;pxText('>> VENT >>',W/2-44,14,'#fff','left',8);X.restore();X.globalAlpha=1}}
 if(w==='drip'){
  // GROTTE : gouttes d'eau tombant du plafond (lentes), + voile sombre humide.
  X.save();X.fillStyle='rgba(190,225,235,.5)';
  for(let i=0;i<14;i++){let bx=(i*53+17)%W,cyc=(t*.6+i*.37)%1,dy=cyc*H;X.fillRect(bx,dy,1,4+cyc*3);
   if(cyc>.92){X.globalAlpha=.4;X.fillRect(bx-2,H-6,5,1);X.globalAlpha=1}}
  X.restore();return}
 if(w==='flare'){
  // ARCHIPEL : lumière chaude diffuse (AUCUN soleil/orbe visible) + miroitement de mer animé.
  let breathe=.5+.5*Math.sin(t*.6);
  X.save();X.globalCompositeOperation='lighter';
  // simple voile chaud très doux depuis le coin haut, sans bord ni disque identifiable
  let warm=X.createLinearGradient(W,0,W*.2,H);warm.addColorStop(0,'rgba(255,238,195,'+(.10+breathe*.05)+')');warm.addColorStop(1,'rgba(255,230,170,0)');X.fillStyle=warm;X.fillRect(0,0,W,H);
  // Miroitement de la mer : bandes horizontales scintillantes (reflet de lumière sur l'eau).
  for(let i=0;i<5;i++){let gy=H*.55+i*16,sh=Math.sin(t*2.2+i*1.4),al=.05+.05*Math.abs(sh);X.globalAlpha=al;X.fillStyle='rgba(255,248,220,1)';let gw=80+sh*40,gxs=W*.6+sh*30;X.fillRect(gxs,gy,gw,2)}
  X.restore();X.globalAlpha=1;return}
 if(w==='sun'||w==='sunbeam'){
  // Lumière diurne diffuse (AUCUN soleil visible) : léger voile chaud depuis le haut, sans disque ni rayons.
  let strong=w==='sunbeam';
  X.save();X.globalCompositeOperation='lighter';
  let warm=X.createLinearGradient(0,0,0,H);warm.addColorStop(0,'rgba(255,244,200,'+(strong?.12:.08)+')');warm.addColorStop(.6,'rgba(255,235,180,'+(strong?.05:.03)+')');warm.addColorStop(1,'rgba(255,235,180,0)');X.fillStyle=warm;X.fillRect(0,0,W,H);
  X.restore();X.globalAlpha=1;return}
 if(w==='rain'){
  // Ciel d'orage : voile sombre en dégradé doux (plus dense en haut), pas d'aplat brutal.
  let sky=X.createLinearGradient(0,0,0,H);sky.addColorStop(0,'rgba(18,30,44,.40)');sky.addColorStop(.6,'rgba(20,34,48,.20)');sky.addColorStop(1,'rgba(16,30,40,.28)');X.fillStyle=sky;X.fillRect(0,0,W,H);
  // Éclair occasionnel et subtil : flash bref qui décroît vite.
  let strike=Math.sin(t*0.6)*Math.sin(t*2.9);if(strike>.985){X.fillStyle='rgba(200,220,255,'+((strike-.985)*9)+')';X.fillRect(0,0,W,H)}
  // Averse : gouttes fines obliques, chacune un mini-dégradé (tête sombre -> queue claire) = effet vitesse net mais doux.
  X.save();let slant=5;
  for(let i=0;i<118;i++){
   let seed=i*97.13,col=(seed*53%(W+60))-30,
       fall=((t*560+seed*31)%(H+50))-25,
       len=9+(i%4)*3,a=.16+(i%5)*.045;
   let g=X.createLinearGradient(col,fall,col-slant,fall+len);
   g.addColorStop(0,'rgba(200,222,245,0)');g.addColorStop(1,'rgba(205,226,248,'+a+')');
   X.strokeStyle=g;X.lineWidth=1;X.beginPath();X.moveTo(col,fall);X.lineTo(col-slant,fall+len);X.stroke();
  }
  X.restore();
  // Fines éclaboussures discrètes au sol (petits arcs qui rebondissent et s'estompent).
  X.save();
  for(let i=0;i<16;i++){let seed=i*167.3,sxp=(seed*71%W),ph=(t*2.4+i*.6)%1,r=2+ph*5;X.globalAlpha=.26*(1-ph);X.strokeStyle='rgba(205,225,250,.7)';X.lineWidth=1;X.beginPath();X.arc(sxp,H-10-(i%4)*20,r,Math.PI,0);X.stroke()}
  X.restore();X.globalAlpha=1;return}
 if(w==='snow'){
  // Atmosphère froide : très léger voile bleuté en haut et en bas (vignette douce).
  let fg=X.createLinearGradient(0,0,0,H);fg.addColorStop(0,'rgba(214,230,244,.12)');fg.addColorStop(.5,'rgba(214,230,244,0)');fg.addColorStop(1,'rgba(196,218,238,.14)');X.fillStyle=fg;X.fillRect(0,0,W,H);
  // Flocons : 3 couches de parallaxe, ronds doux, dérive sinusoïdale, scintillement léger.
  X.save();
  let layers=[[54,20,1.3,.42],[38,38,2,.62],[24,62,2.8,.9]];
  for(let L=0;L<layers.length;L++){let[nb,spd,sz,al]=layers[L];
   for(let i=0;i<nb;i++){let seed=i*83.7+L*311,
     fall=((t*spd*10+seed*13)%(H+20))-10,
     drift=Math.sin(t*.7+seed)*(8+L*4),
     sx=((seed*47)%(W+30))-15+drift,
     tw=al*(.7+.3*Math.sin(t*2+seed));
    X.globalAlpha=tw;X.fillStyle='#fff';X.beginPath();X.arc(sx,fall,sz/2,0,Math.PI*2);X.fill();
    if(L===2){X.globalAlpha=tw*.3;X.beginPath();X.arc(sx,fall,sz,0,Math.PI*2);X.fill()}}}
  X.restore();X.globalAlpha=1;return}
 if(w==='blizzard'){
  // Tempête de neige : voile blanc dense pulsant (whiteout) + neige rapide quasi horizontale poussée par le vent.
  let gust=.16+.10*Math.abs(Math.sin(t*.5)+Math.sin(t*1.3)*.5);
  X.fillStyle='rgba(226,238,248,'+gust+')';X.fillRect(0,0,W,H);
  // Rafales : traits de neige obliques très rapides (vent fort).
  X.save();let wind=14+Math.sin(t*.6)*6;
  for(let i=0;i<150;i++){
   let seed=i*61.7,sy=(seed*37%(H+40))-20,
       sx=((t*900+seed*53)%(W+120))-60,
       len=8+(i%4)*4,a=.30+(i%5)*.06;
   X.strokeStyle='rgba(255,255,255,'+a+')';X.lineWidth=1;X.beginPath();X.moveTo(sx,sy);X.lineTo(sx-wind,sy+3);X.stroke();
  }
  // Gros flocons proches qui filent.
  for(let i=0;i<40;i++){let seed=i*131.3,sy=(seed*29%(H+30))-15,sx=((t*620+seed*71)%(W+80))-40;X.globalAlpha=.8;X.fillStyle='#fff';X.fillRect(sx,sy,2,2)}
  X.restore();X.globalAlpha=1;
  // Voile dense bas d'écran (congère soulevée).
  let fg=X.createLinearGradient(0,H-80,0,H);fg.addColorStop(0,'rgba(230,240,250,0)');fg.addColorStop(1,'rgba(230,240,250,.30)');X.fillStyle=fg;X.fillRect(0,H-80,W,80);return}
 if(w==='mist'){
  // Islande : brume froide en nappes qui dérivent horizontalement, lumière laiteuse et bleutée.
  X.save();
  for(let L=0;L<3;L++){let band=H*(.2+L*.26),amp=18+L*8,off=(t*(8+L*5))%(W+200)-100;
   for(let i=0;i<3;i++){let bx=off+i*((W+200)/3),by=band+Math.sin(t*.4+L+i)*amp;
    let g=X.createRadialGradient(bx,by,10,bx,by,120);g.addColorStop(0,'rgba(206,222,232,'+(.12-L*.025)+')');g.addColorStop(1,'rgba(206,222,232,0)');X.fillStyle=g;X.beginPath();X.arc(bx,by,120,0,Math.PI*2);X.fill()}}
  X.restore();
  // Voile froid bas d'écran (brume au sol).
  let fg=X.createLinearGradient(0,H-90,0,H);fg.addColorStop(0,'rgba(200,216,228,0)');fg.addColorStop(1,'rgba(200,216,228,.22)');X.fillStyle=fg;X.fillRect(0,H-90,W,90);return}
 if(w==='fog'){
  // Marécage : brume basse verdâtre et stagnante, plus dense près du sol.
  X.save();
  for(let L=0;L<2;L++){let band=H*(.5+L*.22),off=(t*(5+L*4))%(W+240)-120;
   for(let i=0;i<3;i++){let bx=off+i*((W+240)/3),by=band+Math.sin(t*.3+L+i)*10;
    let g=X.createRadialGradient(bx,by,12,bx,by,130);g.addColorStop(0,'rgba(150,176,150,'+(.13-L*.03)+')');g.addColorStop(1,'rgba(150,176,150,0)');X.fillStyle=g;X.beginPath();X.arc(bx,by,130,0,Math.PI*2);X.fill()}}
  X.restore();
  let fg=X.createLinearGradient(0,H-110,0,H);fg.addColorStop(0,'rgba(120,150,120,0)');fg.addColorStop(1,'rgba(110,145,115,.26)');X.fillStyle=fg;X.fillRect(0,H-110,W,110);return}
 if(w==='steam'){
  // Yellowstone : panaches de vapeur chaude qui montent depuis le bas + teinte ocre-soufre.
  X.save();
  for(let i=0;i<7;i++){let bx=(i*131.3%W),rise=((t*22+i*90)%(H+80)),by=H-rise,sz=24+ (i%3)*14,al=.10*(by/H+.1);
   let g=X.createRadialGradient(bx,by,4,bx,by,sz*2);g.addColorStop(0,'rgba(238,232,210,'+al+')');g.addColorStop(1,'rgba(238,232,210,0)');X.fillStyle=g;X.beginPath();X.arc(bx+Math.sin(t+i)*8,by,sz*2,0,Math.PI*2);X.fill()}
  X.restore();
  let hg=X.createRadialGradient(W/2,H+40,20,W/2,H+40,300);hg.addColorStop(0,'rgba(255,225,150,.10)');hg.addColorStop(1,'rgba(255,225,150,0)');X.fillStyle=hg;X.fillRect(0,0,W,H);return}
 if(w==='heat'){
  // ondulation de chaleur (bandes horizontales translucides qui vibrent) + halo de soleil dur
  X.save();X.globalCompositeOperation='lighter';
  for(let i=0;i<5;i++){let y=H*.3+i*22+Math.sin(t*2+i)*4;X.globalAlpha=.04;X.fillStyle='#fff0c0';X.fillRect(0,y,W,6)}
  X.restore();X.globalAlpha=1;
  let hg=X.createRadialGradient(W/2,20,10,W/2,20,260);hg.addColorStop(0,'rgba(255,225,150,.2)');hg.addColorStop(1,'rgba(255,225,150,0)');X.fillStyle=hg;X.fillRect(0,0,W,H);return}
 if(w==='ash'){
  // ambiance volcanique : lueur rouge pulsante par le bas
  let pulse=.12+Math.abs(Math.sin(t*.8))*.08,fg=X.createLinearGradient(0,H-120,0,H);fg.addColorStop(0,'rgba(180,40,0,0)');fg.addColorStop(1,'rgba(200,50,0,'+pulse+')');X.fillStyle=fg;X.fillRect(0,H-120,W,120);return}
 if(w==='spark'){
  // labo : scintillement électrique froid + grille de lumière subtile
  if(Math.sin(t*7)*Math.cos(t*2.1)>.9){X.fillStyle='rgba(120,230,255,.12)';X.fillRect(0,0,W,H)}
  let fg=X.createRadialGradient(W/2,H/2,40,W/2,H/2,300);fg.addColorStop(0,'rgba(90,230,255,.06)');fg.addColorStop(1,'rgba(20,40,70,.12)');X.fillStyle=fg;X.fillRect(0,0,W,H);return}}
function drawPowerup(p){let x=p.x*T,y=p.y*T,b=Math.round(Math.sin(performance.now()*.006+p.pulse)*3),g=.4+Math.sin(performance.now()*.008+p.pulse)*.2;rect(x+4,y+20,16,3,'rgba(20,30,10,.35)');X.globalAlpha=g;rect(x+2,y+2+b,20,20,'#fff');X.globalAlpha=1;
 if(p.kind==='shield'){rect(x+6,y+4+b,12,15,'#2f7fb0');rect(x+8,y+6+b,8,11,'#6ed2ff');rect(x+10,y+9+b,4,5,'#e8fbff')}
 else if(p.kind==='heal'){let hy=y+5+b;rect(x+5,hy,4,4,'#e23a55');rect(x+13,hy,4,4,'#e23a55');rect(x+4,hy+3,16,4,'#e23a55');rect(x+6,hy+7,12,3,'#e23a55');rect(x+8,hy+10,8,3,'#e23a55');rect(x+10,hy+13,4,2,'#e23a55');rect(x+6,hy+1,3,3,'#ff8da0')}
 else if(p.kind==='time'){rect(x+5,y+5+b,14,14,'#3a7d4a');rect(x+7,y+7+b,10,10,'#8fe6a0');rect(x+11,y+8+b,2,5,'#1c3a26');rect(x+11,y+12+b,4,2,'#1c3a26')}
 else{rect(x+11,y+3+b,2,18,'#ffe35b');rect(x+3,y+11+b,18,2,'#ffe35b');rect(x+6,y+6+b,12,12,'#ffe35b');rect(x+9,y+9+b,6,6,'#fff7a1')}}
function drawBolt(bo){let x=bo.x*T,y=bo.y*T;rect(x-4,y-4,9,9,'rgba(0,0,0,.25)');rect(x-3,y-3,7,7,bo.color||'#ff6b3d');rect(x-1,y-1,3,3,'#fff2c0')}
function drawZone(z){let t=performance.now()*.001;
 // Onde de choc sismique : anneau concentrique télégraphié puis expansif.
 if(z.ring){let cx=(z.x+.5)*T,cy=(z.y+.5)*T;X.save();
  if(z.warn>0){X.globalAlpha=.3+Math.sin(t*14)*.2;X.strokeStyle='#e0a85a';X.lineWidth=3;X.beginPath();X.arc(cx,cy,T*1.2,0,Math.PI*2);X.stroke()}
  else{let rr=z.rad*T;X.globalAlpha=Math.max(0,.7*(1-z.rad/z.maxr));X.strokeStyle='#f0c060';X.lineWidth=6;X.beginPath();X.arc(cx,cy,rr,0,Math.PI*2);X.stroke();X.globalAlpha*=.5;X.strokeStyle='#fff2c0';X.lineWidth=2;X.beginPath();X.arc(cx,cy,rr,0,Math.PI*2);X.stroke()}
  X.restore();X.globalAlpha=1;X.lineWidth=4;return}
 let x=z.x*T,y=z.y*T;if(z.warn>0){let bl=Math.floor(t*8)%2;X.globalAlpha=.4+Math.sin(t*10)*.2;rect(x+1,y+1,T-2,T-2,bl?'#ff7a1f':'#ffd24a');X.globalAlpha=1;rect(x+T/2-2,y+4,4,T-8,'#7a2a06');rect(x+4,y+T/2-2,T-8,4,'#7a2a06')}
 else{rect(x,y,T,T,'#7a1c05');rect(x+2,y+2,T-4,T-4,'#e0571f');for(let i=0;i<3;i++){let h=4+Math.round(Math.sin(t*9+i*2)*4);rect(x+5+i*6,y+T-6-h,3,h,'#ffb13d');rect(x+5+i*6,y+T-7-h,3,2,'#ffe07a')}}}
function drawMinion(m){let x=m.x*T,y=m.y*T,t=m.phase,b=Math.round(Math.sin(t*6)*2),stun=m.stun>0;rect(x+4,y+18,14,3,'rgba(10,18,30,.4)');
 let body=stun?'#7d8a99':'#3a7d8c',glow=stun?'#aab6c2':'#5fd0e0';rect(x+5,y+6+b,14,12,body);rect(x+7,y+4+b,10,5,glow);rect(x+8,y+8+b,3,3,'#fff');rect(x+13,y+8+b,3,3,'#fff');rect(x+9,y+9+b,1,1,'#13202c');rect(x+14,y+9+b,1,1,'#13202c');rect(x+6,y+16+b,3,4,body);rect(x+15,y+16+b,3,4,body);if(stun){rect(x+9,y+1+b,2,2,'#ffe35b');rect(x+13,y+2+b,2,2,'#ffe35b')}}
function drawWater(x,y,w,h){let t=performance.now()*.012;rect(x,y,w,h,currentTheme.water[0]);for(let row=0;row<h;row+=14){let off=Math.floor((t*(row%28?1:-1)+row*3)%28);for(let xx=-28+off;xx<w;xx+=28){rect(x+xx,y+row+4,13,2,currentTheme.water[1]);rect(x+xx+4,y+row+3,8,1,'#d6f5ed');rect(x+xx+14,y+row+6,8,1,'#276c91')}}}
function drawDeepWater(x,y,w,h){let t=performance.now()*.008;rect(x,y,w,h,'#0d3a52');for(let row=0;row<h;row+=16){let off=Math.floor((t*(row%32?1:-1)+row*2)%32);for(let xx=-32+off;xx<w;xx+=32){rect(x+xx,y+row+6,16,2,'#13546f');rect(x+xx+6,y+row+5,9,1,'#2b7a96')}}}
// ── APRON : terrain de biome qui prolonge la carte au-delà du mur invisible ───────────────
// Rendu en coordonnées-monde (sous le translate caméra de draw()). drawTile fonctionne hors
// grille car il ne lit que currentTheme + x/y. Seule la fenêtre visible est dessinée.
function apronVoidColor(){let a=APRON[currentTheme.n]||{v:6};
 if(a.v===6)return currentTheme.n==='VOLCAN'?'#5a1405':'#0d3a52';
 if(a.v===2)return currentTheme.water?currentTheme.water[0]:'#3a5a48';
 return currentTheme.edge||(currentTheme.ground&&currentTheme.ground[0])||'#2a2a2a'}
// RUINES — VOILE DE CAVERNE (espace écran, fixe) : dégradé sombre + poussière flottante + vignettage.
// Couvre tout l'écran AVANT la caméra → les bordures de map ne montrent jamais de couleur plate.
function drawRuinsVoid(){
 let t=performance.now()*.001;
 // dégradé vertical profond (plafond plus sombre, sol plus chaud)
 let gr=X.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0c0f12');gr.addColorStop(.55,'#161a1d');gr.addColorStop(1,'#20211c');
 X.fillStyle=gr;X.fillRect(0,0,W,H);
 // poussière/spores flottant lentement (parallaxe légère liée à la caméra)
 X.save();X.globalAlpha=.5;
 for(let i=0;i<26;i++){let px=((i*97+cam.x*.15)%(W+40))-20,py=((i*53+t*8+Math.sin(t*.6+i)*6)%(H+40))-20;let s=1+(i%3===0?1:0);X.fillStyle=i%4?'#3a4038':'#4a5046';X.fillRect(px,py,s,s)}
 X.restore();
 // vignettage radial (assombrit les bords → concentre l'attention sur le donjon)
 let vg=X.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');
 X.fillStyle=vg;X.fillRect(0,0,W,H);
}
// RUINES — PAROI DE CAVERNE (espace monde) : roche texturée tout autour du donjon, dans la marge
// visible par la caméra au-delà des murs. Évite la « bordure nette » de la map.
function drawRuinsCavernWall(){
 let band=4*T; // épaisseur de roche dessinée autour du rectangle de map
 let x0=-band,y0=-band,x1=MW*T+band,y1=MH*T+band;
 // base de roche sombre couvrant toute la zone (le donjon repassera par-dessus)
 rect(x0,y0,x1-x0,y1-y0,'#23241e');
 // texture de cailloux/facettes pseudo-aléatoire (pas d'aléa par frame → stable)
 let step=T;
 for(let gy=Math.floor(y0/step)*step;gy<y1;gy+=step)for(let gx=Math.floor(x0/step)*step;gx<x1;gx+=step){
  // ne texture QUE la marge extérieure (la map elle-même est redessinée ensuite)
  if(gx>=-T&&gx<MW*T&&gy>=-T&&gy<MH*T)continue;
  let h=((gx*73856093)^(gy*19349663))>>>0;
  let shade=['#262720','#2c2d24','#202119','#30312a'][h%4];
  rect(gx,gy,step,step,shade);
  if(h%3===0)rect(gx+4,gy+5,7,5,'#181913');           // creux sombre
  if(h%5===1)rect(gx+12,gy+10,5,6,'#383a30');          // facette claire
  if(h%4===2)rect(gx+6,gy+14,8,2,'#1c1d16');           // fissure
 }
}
function drawApron(){let a=APRON[currentTheme.n]||{v:6},M=APRON_MARGIN;
 let x0=Math.max(-M,Math.floor(cam.x/T)-1),x1=Math.min(MW+M,Math.ceil((cam.x+W)/T)+1);
 let y0=Math.max(-M,Math.floor(cam.y/T)-1),y1=Math.min(MH+M,Math.ceil((cam.y+H)/T)+1);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  if(x>=0&&y>=0&&x<MW&&y<MH)continue; // saute la carte jouable (déjà dessinée)
  drawTile(x,y,a.v);
  if(a.treeChance){let h=((x*73856093)^(y*19349663))>>>0;if((h%1000)/1000<a.treeChance){X.save();X.globalAlpha=.82;drawTree(x,y);X.restore()}}
 }
 if(a.steam)drawApronSteam(x0,y0,x1,y1);
 // léger assombrissement de profondeur sur la lisière (suggère le hors-champ) près du bord interne
}
function drawApronSteam(x0,y0,x1,y1){let t=performance.now()*.0006;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  if(x>=0&&y>=0&&x<MW&&y<MH)continue;
  let h=((x*40503)^(y*12289))>>>0;if(h%7)continue;
  let px=x*T+12,py=y*T+12,rise=((t*40+h)%30);
  X.globalAlpha=.16;rect(px-3,py-rise,6,8,'#e8eef0');rect(px-2,py-rise-6,4,6,'#f4f8fa');X.globalAlpha=1;
 }}
// Palette du décor d'accueil dérivée du dernier biome joué (menuBiome).
// Sans partie jouée → scène jungle-temple iconique. Avec → couleurs du biome.
function backdropPalette(){
 let b=menuBiome;
 if(!b)return{sky:['#3a2752','#6a3a63','#a85a55','#d98a4e','#f0b75c'],haze:'#f3cf7a',far:'#6f5270',near:'#8f6e84',snow:true,
  step1:'#8c7a4e',step2:'#9b885a',stepTop:'#b6a472',stepBot:'#6f6040',joint:'#76663f',moss:true,
  fg:'#13260f',leafA:'#1c3a14',leafB:'#244c1a',leafStem:'#16300f',vine:'#2c5a2b',vineLeaf:'#3f7e34',dust:['#ffe9a0','#ffd06a']};
 let g=b.ground||['#9b885a','#8c7a4e'],e=b.edge||'#76663f',w=b.water||['#3a6e8c','#7ec2da'];
 let cold=/TAIGA|GLACIER|MONTAGNE|ISLANDE|GROTTE/.test(b.n||'');
 let hot=/DESERT|DUNES|VOLCAN|SAVANE|PLAGE|YELLOWSTONE/.test(b.n||'');
 // ciel : chaud (couchant) pour biomes chauds, froid (bleuté) pour biomes froids, doux sinon
 let sky=hot?['#43243f','#7a3550','#bd5a44','#e0904a','#f3c061']
   :cold?['#2c3a52','#44597a','#6b86a8','#9fc0d6','#cfe6ef']
   :['#3a2752','#6a3a63','#9c5a55','#cf8a52','#ecbf6a'];
 return{sky,haze:shade(sky[4],-6),far:shade(g[0],-40),near:shade(g[0],-20),snow:cold,
  step1:shade(g[0],-8),step2:g[1]||g[0],stepTop:shade(g[0],24),stepBot:shade(e,-12),joint:shade(e,-6),moss:!hot,
  fg:shade(g[0],-46),leafA:shade(g[0],-30),leafB:shade(g[0],-18),leafStem:shade(g[0],-40),
  vine:shade(g[0],-22),vineLeaf:shade(g[1]||g[0],6),dust:[shade(w[1]||'#ffe9a0',10),shade(g[1]||'#ffd06a',8)]};
}
function drawBackdrop(){let t=performance.now()*.001;let P=backdropPalette();
 // ----- CIEL : teinte du dernier biome joué (ou aube jungle par défaut) -----
 const sky=P.sky;
 for(let i=0;i<sky.length;i++)rect(0,i*22,W,23,sky[i]);
 rect(0,sky.length*22,W,150,P.haze);
 // soleil bas + halo
 let sx=470,sy=120;for(let r=64;r>0;r-=8){X.globalAlpha=.08;rect(sx-r,sy-r,r*2,r*2,'#fff2c0')}X.globalAlpha=1;
 rect(sx-30,sy-30,60,60,'#ffe9a0');rect(sx-24,sy-24,48,48,'#fff6d2');rect(sx-14,sy-14,28,28,'#fffbe8');
 // rayons de lumière obliques
 for(let i=0;i<6;i++){let a=.05+.04*Math.abs(Math.sin(t*.5+i));X.globalAlpha=a;let bx=sx-160+i*70;X.fillStyle='#fff2c0';X.beginPath();X.moveTo(sx,sy);X.lineTo(bx,H);X.lineTo(bx+40,H);X.closePath();X.fill()}X.globalAlpha=1;
 // ----- NUAGES pixel en parallaxe -----
 for(let c=0;c<5;c++){let cx=((c*150+t*(6+c*2))%(W+120))-100,cy=30+c*16+(c%2)*8;X.globalAlpha=.5;rect(cx,cy,46,10,'#f7dca0');rect(cx+10,cy-6,30,9,'#ffe7b4');rect(cx+24,cy+4,40,9,'#f3cf8a')}X.globalAlpha=1;
 // ----- MONTAGNES LOINTAINES (silhouettes triangulaires en brume, deux plans) -----
 let peak=(cx,baseY,w,h,col,snow)=>{X.fillStyle=col;X.beginPath();X.moveTo(cx-w/2,baseY);X.lineTo(cx,baseY-h);X.lineTo(cx+w/2,baseY);X.closePath();X.fill();
  if(snow){X.fillStyle='rgba(245,235,240,.7)';X.beginPath();X.moveTo(cx,baseY-h);X.lineTo(cx-h*.22,baseY-h*.62);X.lineTo(cx-h*.1,baseY-h*.7);X.lineTo(cx,baseY-h*.5);X.lineTo(cx+h*.1,baseY-h*.7);X.lineTo(cx+h*.22,baseY-h*.62);X.closePath();X.fill()}};
 // plan lointain (sombre, brumeux)
 for(let m=0;m<6;m++)peak(m*120-10,176,150,78+(m%3)*22,P.far,false);
 // plan proche (plus clair, sommets enneigés si biome froid)
 for(let m=0;m<7;m++)peak(m*100-40,182,120,58+((m+1)%3)*26,P.near,P.snow);
 rect(0,176,W,8,shade(P.near,8));X.globalAlpha=.25;rect(0,150,W,40,P.haze);X.globalAlpha=1;
 // ----- GRANDE PYRAMIDE / ZIGGOURAT CENTRALE -----
 let baseY=300,cx=W/2;
 for(let s=0;s<9;s++){let w=300-s*30,h=18,y=baseY-s*h,x=cx-w/2;
   rect(x,y,w,h,s%2?P.step1:P.step2);rect(x,y,w,4,P.stepTop);rect(x,y+h-4,w,4,P.stepBot);
   // joints de pierre
   for(let bx=x+6;bx<x+w-6;bx+=26)rect(bx,y+5,2,h-9,P.joint);
   // mousse / lichen sur les marches (uniquement biomes non arides)
   if(P.moss&&s%3===0){rect(x+8,y+h-5,18,4,'#5f7a3a');rect(x+w-30,y+h-5,16,4,'#557036')}
 }
 // escalier central
 for(let s=0;s<8;s++){let y=baseY-s*18,sw=52;rect(cx-sw/2,y,sw,18,s%2?shade(P.step1,-4):shade(P.step2,4));rect(cx-sw/2,y,sw,3,P.stepTop)}
 // entrée sombre du temple au sommet + linteau
 let dy=baseY-9*18+6;rect(cx-26,dy-46,52,46,'#3a2f22');rect(cx-20,dy-40,40,40,'#0c0a08');rect(cx-30,dy-50,60,8,'#b6a472');
 // glyphes lumineux autour de la porte
 for(let i=0;i<4;i++){let ga=Math.sin(t*2+i)>.2?'#ffd864':'#7a5a2e';rect(cx-30+i*16,dy-58,6,6,ga)}
 // deux torches qui vacillent de part et d'autre de la porte
 [[cx-40,dy-22],[cx+34,dy-22]].forEach((p,i)=>{rect(p[0],p[1],5,22,'#4a3826');let fl=2+Math.round(Math.abs(Math.sin(t*9+i*2))*4);
   X.globalAlpha=.6;rect(p[0]-5,p[1]-14,16,16,'#ff7a1f');X.globalAlpha=1;
   rect(p[0]-2,p[1]-10-fl,9,12+fl,'#ff8c2a');rect(p[0],p[1]-8-fl,5,9+fl,'#ffd24a');rect(p[0]+1,p[1]-5-fl,3,5,'#fff3b0')});
 // ----- VÉGÉTATION DEVANT LA BASE (lianes & buissons) -----
 for(let i=0;i<W;i+=28){let s=Math.round(Math.sin(t*1.5+i*.3)*2);rect(i+6,baseY-4,8,18,'#3a2a1c');rect(i+s,baseY-12,30,18,P.vine);rect(i+5+s,baseY-18,22,16,P.vineLeaf);rect(i+11+s,baseY-20,8,5,shade(P.vineLeaf,12))}
 // ----- PREMIER PLAN : silhouettes de feuillage teintées au biome -----
 X.globalAlpha=1;rect(0,H-26,W,26,P.fg);
 for(let i=0;i<10;i++){let lx=i*70-20,sw=Math.round(Math.sin(t*1.2+i)*4),ly=H-30+(i%2)*6;
   X.fillStyle=i%2?P.leafA:P.leafB;X.beginPath();X.moveTo(lx+sw,H);X.lineTo(lx+34+sw,ly-30);X.lineTo(lx+68+sw,H);X.closePath();X.fill();
   rect(lx+33+sw,ly-30,2,30,P.leafStem)}
 // lianes pendantes depuis le haut
 for(let i=0;i<6;i++){let vx=40+i*108,sw=Math.round(Math.sin(t*1.6+i)*3),len=60+((i*53)%70);rect(vx+sw,0,3,len,P.vine);rect(vx-2+sw,len-6,7,7,P.vineLeaf)}
 // ----- OISEAUX qui traversent -----
 for(let i=0;i<3;i++){let bx=((t*40+i*220)%(W+60))-30,by=60+i*22+Math.sin(t*2+i)*6,wf=Math.sin(t*8+i)>0?0:3;rect(bx,by+wf,5,2,'#2a1f18');rect(bx+5,by,4,2,'#2a1f18');rect(bx+9,by+wf,5,2,'#2a1f18')}
 // ----- POUSSIÈRE DORÉE flottante (profondeur) -----
 for(let i=0;i<22;i++){let x=(20+i*49+t*12*((i%3)-1))%W,y=(H-((t*8+i*53)%(H+20)))-10,a=.25+Math.abs(Math.sin(t*2+i))*.55;X.globalAlpha=a;rect(((x%W)+W)%W,y,2,2,i%2?P.dust[0]:P.dust[1])}X.globalAlpha=1;
 // vignette douce
 X.globalAlpha=.18;rect(0,0,W,40,'#1a0f1e');rect(0,H-40,W,40,'#0c1408');X.globalAlpha=1}
// ====================================================================
// FOND DE SÉLECTION DE NIVEAU : carte d'expédition vue du ciel (océan,
// archipel d'îles-biomes, route en pointillés, rose des vents, navires,
// nuages dérivants). 100 % pixel, distinct du décor pyramide du menu.
// ====================================================================
function drawMapBackdrop(){let t=performance.now()*.001;
 // ----- OCÉAN : dégradé bleu profond + bandes -----
 let sea=['#0e2f4a','#114060','#15506f','#1b6280','#236f8c'];
 for(let i=0;i<sea.length;i++)rect(0,i*(H/sea.length),W,H/sea.length+1,sea[i]);
 // houle : lignes de vagues animées (pointillés clairs qui défilent)
 X.globalAlpha=.16;for(let y=24;y<H;y+=26){let off=(t*14+y*3)% 36;for(let x=-36+off;x<W;x+=36){rect(x,y,14,2,'#bfe6f2');rect(x+18,y+9,9,2,'#9fd2e6')}}X.globalAlpha=1;
 // reflets scintillants
 for(let i=0;i<26;i++){let x=(i*53+Math.sin(t*.7+i)*30)%W,y=(i*37+i*i*11)%H,a=.1+Math.abs(Math.sin(t*1.6+i))*.4;X.globalAlpha=a;rect(((x%W)+W)%W,y,2,2,'#dff4fb')}X.globalAlpha=1;
 // ----- ARCHIPEL : îles-biomes posées sur l'océan -----
 // chaque île : {x,y,r couleur sable/herbe + repère} -> évoque les biomes du jeu
 let isles=[
  {x:96,y:104,r:42,sand:'#d8b87a',land:'#5f8c48',top:'#7eb05a',mark:'pyramid'},
  {x:250,y:70,r:34,sand:'#e6d29a',land:'#caa85e',top:'#e0c878',mark:'dune'},
  {x:430,y:96,r:46,sand:'#cdb98a',land:'#3f7e5a',top:'#5fae74',mark:'tree'},
  {x:560,y:150,r:36,sand:'#cfe0e6',land:'#8fb6c8',top:'#cfe9f2',mark:'ice'},
  {x:150,y:240,r:40,sand:'#d8b87a',land:'#7a6a4a',top:'#9b885a',mark:'volcano'},
  {x:340,y:268,r:44,sand:'#d8c68a',land:'#6a8c40',top:'#8ab052',mark:'tree'},
  {x:500,y:286,r:38,sand:'#cdb98a',land:'#8a5a3a',top:'#b07a4a',mark:'temple'}
 ];
 // ombres portées des îles sur l'eau
 isles.forEach(o=>{X.globalAlpha=.22;X.fillStyle='#06203a';X.beginPath();X.ellipse(o.x+6,o.y+8,o.r,o.r*.72,0,0,7);X.fill();X.globalAlpha=1});
 // mousse de littoral (anneau de sable + ressac animé)
 isles.forEach(o=>{
  X.fillStyle='rgba(220,240,250,.5)';X.beginPath();X.ellipse(o.x,o.y,o.r+4+Math.sin(t*1.5+o.x*.05)*1.5,(o.r+4)*.72,0,0,7);X.fill();
  X.fillStyle=o.sand;X.beginPath();X.ellipse(o.x,o.y,o.r,o.r*.72,0,0,7);X.fill();
  X.fillStyle=o.land;X.beginPath();X.ellipse(o.x,o.y,o.r*.8,o.r*.58,0,0,7);X.fill();
  X.fillStyle=o.top;X.beginPath();X.ellipse(o.x,o.y-o.r*.08,o.r*.55,o.r*.4,0,0,7);X.fill();
 });
 // repères de biome au centre de chaque île
 isles.forEach(o=>{let cx=o.x,cy=o.y;
  if(o.mark==='pyramid'){X.fillStyle='#b6a472';X.beginPath();X.moveTo(cx-12,cy+8);X.lineTo(cx,cy-12);X.lineTo(cx+12,cy+8);X.closePath();X.fill();rect(cx-2,cy-2,4,4,'#0c0a08')}
  else if(o.mark==='dune'){rect(cx-12,cy+2,24,5,'#e9d49a');rect(cx-6,cy-3,16,5,'#f2e0aa')}
  else if(o.mark==='tree'){rect(cx-2,cy,4,9,'#5a3a1e');X.fillStyle='#2f6e36';X.beginPath();X.arc(cx,cy-4,9,0,7);X.fill()}
  else if(o.mark==='ice'){X.fillStyle='#eaf6ff';X.beginPath();X.moveTo(cx,cy-12);X.lineTo(cx+9,cy+6);X.lineTo(cx-9,cy+6);X.closePath();X.fill();rect(cx-2,cy-2,4,7,'#bfe2f2')}
  else if(o.mark==='volcano'){X.fillStyle='#5a4636';X.beginPath();X.moveTo(cx-13,cy+8);X.lineTo(cx,cy-12);X.lineTo(cx+13,cy+8);X.closePath();X.fill();rect(cx-4,cy-12,8,4,'#ff7a1f');let pf=Math.sin(t*3+cx)>0;if(pf)rect(cx-3,cy-18,6,6,'#ffb24a')}
  else if(o.mark==='temple'){rect(cx-13,cy-2,26,10,'#cdbf92');rect(cx-13,cy-8,26,4,'#e0d2a2');for(let i=0;i<4;i++)rect(cx-11+i*7,cy-2,3,10,'#8a7c52');rect(cx-3,cy+1,6,7,'#0c0a08')}
 });
 // ----- ROUTE D'EXPÉDITION : pointillés reliant les îles dans l'ordre -----
 X.save();X.lineWidth=2;X.strokeStyle='rgba(255,240,200,.0)';
 let dash=(ax,ay,bx,by)=>{let n=Math.hypot(bx-ax,by-ay)/9|0;for(let i=0;i<=n;i++){let p=i/n,x=ax+(bx-ax)*p,y=ay+(by-ay)*p;let ph=(t*1.4-i*.12)%1;X.globalAlpha=.45+.35*Math.abs(Math.sin((p*6+t)*3));rect(x-1,y-1,3,3,i%2?'#ffe9a0':'#ffd06a')}};
 for(let i=0;i<isles.length-1;i++)dash(isles[i].x,isles[i].y,isles[i+1].x,isles[i+1].y);
 X.globalAlpha=1;X.restore();
 // croix « X marks the spot » sur la dernière île (le temple final)
 let last=isles[isles.length-1];let xb=Math.abs(Math.sin(t*3))>.4?'#ff5a3c':'#d4163c';
 X.save();X.translate(last.x+last.r*.6,last.y-last.r*.6);X.rotate(Math.PI/4);rect(-9,-2,18,4,xb);rect(-2,-9,4,18,xb);X.restore();
 // ----- NUAGES dérivants (parallaxe, ombres douces sur la mer) -----
 for(let c=0;c<4;c++){let cw=70+c*14,cx=((c*190+t*(8+c*3))%(W+160))-120,cy=40+c*70+(c%2)*18;
  X.globalAlpha=.12;X.fillStyle='#04243c';X.beginPath();X.ellipse(cx+8,cy+34,cw*.6,12,0,0,7);X.fill();X.globalAlpha=1;
  X.globalAlpha=.82;rect(cx,cy,cw,12,'#eef6fb');rect(cx+12,cy-7,cw*.6,10,'#ffffff');rect(cx+cw*.4,cy+5,cw*.5,10,'#dfeaf2');X.globalAlpha=1}
 // ----- NAVIRE qui vogue le long de la route -----
 let shipP=(t*.06)%1,sa=isles[1],sb=isles[2],sxp=sa.x+(sb.x-sa.x)*shipP,syp=sa.y+(sb.y-sa.y)*shipP+Math.sin(t*2)*2;
 X.fillStyle='#5a3a1e';X.beginPath();X.moveTo(sxp-12,syp);X.lineTo(sxp+12,syp);X.lineTo(sxp+8,syp+7);X.lineTo(sxp-8,syp+7);X.closePath();X.fill();
 rect(sxp-1,syp-16,2,16,'#3a2618');X.fillStyle='#f2ead2';X.beginPath();X.moveTo(sxp+1,syp-15);X.lineTo(sxp+11,syp-4);X.lineTo(sxp+1,syp-4);X.closePath();X.fill();
 // petit sillage
 X.globalAlpha=.4;rect(sxp-18,syp+5,6,2,'#cfeefb');rect(sxp-24,syp+6,5,2,'#aee0f2');X.globalAlpha=1;
 // ----- ROSE DES VENTS (coin bas-droite) -----
 let rx=W-46,ry=H-46,rr=22;
 X.globalAlpha=.9;X.fillStyle='#1a3a52';X.beginPath();X.arc(rx,ry,rr+4,0,7);X.fill();
 X.strokeStyle='#ffe9a0';X.lineWidth=2;X.beginPath();X.arc(rx,ry,rr,0,7);X.stroke();X.globalAlpha=1;
 let star=(ang,len,w,col)=>{X.save();X.translate(rx,ry);X.rotate(ang);X.fillStyle=col;X.beginPath();X.moveTo(0,-len);X.lineTo(w,0);X.lineTo(0,len*.2);X.lineTo(-w,0);X.closePath();X.fill();X.restore()};
 for(let i=0;i<4;i++){star(i*Math.PI/2,rr,5,'#ffd06a');star(i*Math.PI/2+Math.PI/4,rr*.6,3,'#c98a3a')}
 rect(rx-2,ry-2,4,4,'#fff3b0');pxText('N',rx,ry-rr-2,'#ffe9a0','center',7);
 // ----- vignette + brume de bord -----
 X.globalAlpha=.2;rect(0,0,W,34,'#04223a');rect(0,H-34,W,34,'#04182c');X.globalAlpha=1;
 X.globalAlpha=.12;rect(0,0,30,H,'#04223a');rect(W-30,0,30,H,'#04223a');X.globalAlpha=1}
// Flore au sol propre à chaque biome (fleurs, herbes, champignons, cailloux…).
// Déterministe via le hash de tuile : pas de scintillement, ~1 tuile sur 3 décorée.
function drawFlora(px,py,hash,x,y){if(isRuins)return;let f=currentTheme.flora,t=performance.now()*.002;
 let sway=Math.round(Math.sin(t+x*.6+y*.4)*1); // léger balancement des fleurs/herbes
 let h2=(x*13+y*29)%7; // second hash pour varier l'espèce
 if(f==='forest'){
  if(hash%3===0){ // touffe d'herbe haute
   rect(px+5+sway,py+12,1,8,'#5a8a2e');rect(px+8+sway,py+10,1,10,'#6fa53a');rect(px+11+sway,py+13,1,7,'#5a8a2e');}
  if(hash%5===1){let c=['#ff6f8a','#ffd24a','#c97aff'][h2%3];rect(px+14+sway,py+12,2,5,'#4f8a2a');rect(px+13+sway,py+9,4,4,c);rect(px+14+sway,py+10,2,2,'#fff7d0');} // fleur
  if(hash%7===2){rect(px+16,py+15,3,3,'#b0561f');rect(px+16,py+14,3,1,'#d9b06a')} // champignon
 }else if(f==='jungle'){
  if(hash%3===0){rect(px+4+sway,py+10,2,10,'#2c6e28');rect(px+7+sway,py+8,2,12,'#39882f');rect(px+10+sway,py+11,2,9,'#2c6e28')} // fougère
  if(hash%5===1){let c=['#ff4d6d','#ffb13d','#ff7af0'][h2%3];rect(px+14+sway,py+13,2,5,'#1f4a1c');rect(px+12+sway,py+9,6,5,c);rect(px+14+sway,py+10,2,2,'#fff')} // fleur tropicale
  if(hash%6===3)rect(px+16,py+16,4,2,'#5fa544') // pousse
  if(hash%4===2){ // flaque de boue avec reflet de pluie qui scintille
   let mw=8+h2%6,mh=4+h2%3,mx=px+3+(h2%6),my=py+13+(h2%4);
   rect(mx,my,mw,mh,'#3a2c1c');rect(mx+1,my+1,mw-2,mh-2,'#4d3a23');
   let sh=Math.abs(Math.sin(t*2.2+x+y))>.6;if(sh)rect(mx+2,my+1,3,1,'#6b5a3a')} // miroitement
 }else if(f==='taiga'){
  if(hash%4===0){rect(px+6,py+13,5,3,'#cfe6ea');rect(px+7,py+12,3,2,'#fff')} // congère
  if(hash%6===2){rect(px+14,py+11,1,7,'#7d9a6a');rect(px+13,py+12,3,1,'#8fb074')} // herbe gelée
  if(hash%7===4)rect(px+5,py+8,2,2,'#d6ecef') // cristal de givre
 }else if(f==='desert'||f==='dunes'){
  let dry=f==='dunes'?'#a85e2c':'#b08a3e';
  if(hash%4===0){rect(px+6,py+14,1,5,dry);rect(px+8,py+13,1,6,dry);rect(px+10,py+15,1,4,dry)} // herbe sèche
  if(hash%7===2){rect(px+15,py+15,3,2,f==='dunes'?'#8c4828':'#9a7a44');rect(px+15,py+14,2,1,f==='dunes'?'#b5683c':'#bda060')} // caillou
  if(hash%9===5){rect(px+13,py+11,2,6,'#4ca262');rect(px+12,py+9,4,3,'#5fb56f')} // petite succulente
  if(hash%5===3){ // deadbush : buisson sec et épineux, branches éclatées
   let bc=f==='dunes'?'#7a4a26':'#8a6a30',bx=px+10,by=py+16;
   rect(bx,by-2,1,5,bc); // tronc
   rect(bx-4+sway,by-6,1,6,bc);rect(bx-3+sway,by-8,1,5,bc); // branche gauche
   rect(bx+3-sway,by-7,1,7,bc);rect(bx+5-sway,by-5,1,5,bc); // branche droite
   rect(bx-2,by-9,1,4,bc);rect(bx+1,by-10,1,5,bc); // branches hautes
   rect(bx-6+sway,by-4,2,1,bc);rect(bx+6-sway,by-3,2,1,bc)} // ramures
 }else if(f==='volcan'){
  if(hash%4===0){rect(px+6,py+15,4,3,'#2a1c16');rect(px+7,py+14,2,1,'#ff7a1f')} // braise
  if(hash%7===3)rect(px+15,py+13,3,4,'#3a2a24') // roche noire
 }else if(f==='lab'){
  if(hash%4===0){rect(px+7,py+13,2,6,'#2bd0e0');rect(px+6,py+12,4,1,'#9af0ff')} // câble lumineux
  if(hash%7===2){rect(px+14,py+14,4,4,'#2a3548');rect(px+15,py+15,2,2,'#5fd0e0')} // panneau
 }else if(f==='beach'){
  if(hash%5===0){rect(px+6,py+14,4,3,'#f2c69c');rect(px+7,py+13,2,1,'#fff0ce')} // coquillage
  if(hash%6===3){rect(px+14,py+12,1,7,'#7a9a3a');rect(px+16,py+11,1,8,'#8fb04a')} // herbe de dune
 }else if(f==='sequoia'){
  if(hash%3===0){rect(px+5+sway,py+11,2,9,'#3a5a26');rect(px+8+sway,py+9,2,11,'#46662e');rect(px+11+sway,py+12,2,8,'#3a5a26')} // fougère de sous-bois
  if(hash%5===1){rect(px+13,py+15,5,3,'#7a4a28');rect(px+14,py+14,3,1,'#9a6a40')} // souche/écorce tombée
  if(hash%7===2){let c=['#e8d0a0','#d8a0c0'][h2%2];rect(px+15+sway,py+12,3,3,c);rect(px+16+sway,py+13,1,1,'#fff')} // fleur pâle
 }else if(f==='swamp'){
  if(hash%3===0){let pw=7+h2%6;rect(px+3,py+14,pw,5,'#2e4a38');rect(px+4,py+15,pw-2,3,'#3e6a4e');let sh=Math.abs(Math.sin(t*1.6+x+y))>.6;if(sh)rect(px+5,py+15,3,1,'#6a9a78')} // mare boueuse
  if(hash%5===1){rect(px+13+sway,py+9,1,11,'#3a5a30');rect(px+15+sway,py+8,1,12,'#456a38');rect(px+13+sway,py+7,3,2,'#6a8a3a')} // roseaux
  if(hash%7===4){rect(px+8,py+13,4,2,'#4a6a3a');rect(px+9,py+12,2,1,'#6a8a4a')} // nénuphar/mousse
 }else if(f==='savane'){
  if(hash%3===0){rect(px+5+sway,py+8,1,12,'#b8a050');rect(px+8+sway,py+6,1,14,'#c9b35e');rect(px+11+sway,py+9,1,11,'#b8a050');rect(px+14+sway,py+7,1,13,'#c9b35e')} // hautes herbes dorées
  if(hash%6===2){rect(px+15,py+15,4,2,'#9a7a44');rect(px+15,py+14,2,1,'#bda060')} // termitière/caillou
  if(hash%8===5){rect(px+6,py+15,3,3,'#8a6a3a')} // touffe sèche
 }else if(f==='island'){
  if(hash%3===0){rect(px+4,py+13,8,5,'#3e6a3a');rect(px+5,py+14,6,3,'#4f8a46');rect(px+12,py+15,4,3,'#3e6a3a')} // mousse verte épaisse
  if(hash%5===2){rect(px+14,py+13,4,4,'#2e3438');rect(px+15,py+12,2,2,'#454d52')} // roche basaltique
  if(hash%7===4){rect(px+7,py+11,2,2,'#cfe6ea');rect(px+8,py+12,1,3,'#aac8cc')} // lichen givré
 }else if(f==='geothermal'){
  if(hash%3===0){let pw=8+h2%5;rect(px+3,py+13,pw,6,'#2bb0c4');rect(px+4,py+14,pw-2,4,'#7ff0e8');let sh=Math.abs(Math.sin(t*2+x))>.5;if(sh)rect(px+5,py+14,3,1,'#d8fffb')} // source chaude turquoise
  if(hash%5===2){rect(px+14,py+13,5,5,'#d8b070');rect(px+14,py+13,5,1,'#f0d8a0');rect(px+15,py+18,3,1,'#b89050')} // terrasse minérale ocre
  if(hash%7===4){rect(px+7,py+12,3,3,'#e8a060');rect(px+8,py+11,1,1,'#ffd0a0')} // dépôt soufré
 }else if(f==='glacier'){
  if(hash%3===0){rect(px+4,py+13,7,4,'#bfe0ef');rect(px+5,py+13,5,2,'#eafcff');rect(px+10,py+15,3,2,'#9fc8da')} // plaque de glace bleutée
  if(hash%5===2){rect(px+13,py+12,4,5,'#d6eef6');rect(px+14,py+11,2,2,'#fff');rect(px+13,py+16,4,1,'#8fb4c4')} // bloc de neige tassée
  if(hash%7===4){rect(px+7,py+11,2,4,'#cfe6ea');rect(px+8,py+10,1,2,'#fff')} // pic de glace
 }else if(f==='mountain'){
  if(hash%3===0){rect(px+4,py+14,8,4,'#e6f0f4');rect(px+5,py+14,6,2,'#fff');rect(px+11,py+16,3,2,'#c4d6dc')} // congère de neige
  if(hash%5===2){rect(px+13,py+13,5,5,'#6e7a64');rect(px+13,py+13,5,2,'#8c9879');rect(px+14,py+18,3,1,'#525c48')} // rocher gris
  if(hash%6===1){rect(px+7,py+14,3,3,'#7a8a5a');rect(px+8,py+13,1,2,'#9aac6e')} // lichen alpin
  if(hash%9===5){rect(px+15,py+11,2,3,'#a8b8c0')} // éclat de quartz
 }else if(f==='cave'){
  if(hash%3===0){rect(px+4,py+15,7,3,'#3a5a44');rect(px+5,py+15,5,2,'#4a7050');rect(px+11,py+16,3,2,'#324c3c')} // coussin de mousse souterraine
  if(hash%5===2){rect(px+13,py+13,4,5,'#544a54');rect(px+13,py+13,4,2,'#6a5e6a');rect(px+14,py+18,3,1,'#3a323a')} // caillou de calcaire
  if(hash%7===4){rect(px+7,py+12,2,2,'#7fe0ea');rect(px+8,py+11,1,1,'#aef4fa')} // cristal scintillant
  if(hash%6===1){rect(px+15,py+10,2,4,'#6a5e6a');rect(px+15,py+9,1,1,'#8a7e8a')} // petite stalagmite naine
 }}
function drawTile(x,y,v){let px=x*T,py=y*T,t=performance.now()*.001,hash=(x*31+y*17)%19;
 // RUINES — dallage VARIÉ : 4 familles de dalles (pierre, mousse, sable, mosaïque) tirées au hash,
 // + détails dispersés (fissures, gravats, flaque, inlay) → casse la texture de pierre uniforme.
 if(isRuins&&v===0){
  let alt=(x+y)%2,fam=hash%8;                 // famille de dalle (stable par tuile)
  let base,inner,top='#827954',bot='#3f3a2c';
  if(fam<=2){base=alt?'#5a5240':'#635a46';inner=alt?'#6b6250':'#736a54'}        // pierre classique
  else if(fam<=4){base=alt?'#4f5a3c':'#586448';inner=alt?'#637044':'#6e7c50';top='#7d8a52';bot='#34402a'} // dalle moussue
  else if(fam<=5){base=alt?'#6e6244':'#766a4c';inner=alt?'#82765a':'#8a7e60';top='#9a8e64';bot='#4a4030'}  // dalle sableuse claire
  else{base=alt?'#52493a':'#5b5142';inner=alt?'#625848':'#6b6150';top='#7a6f50';bot='#3a342a'}            // pierre sombre
  rect(px,py,T,T,base);rect(px+1,py+1,T-2,T-2,inner);
  rect(px+1,py+1,T-2,2,top);rect(px+1,py+T-3,T-2,2,bot);
  // joint en croix discret (façon grandes dalles)
  if(hash%3===0)rect(px+T-2,py+1,1,T-2,bot);if(hash%3===1)rect(px+1,py+T-2,T-2,1,bot);
  // DÉTAILS dispersés (un seul par tuile selon le hash → léger et lisible)
  if(fam>=3&&fam<=4){ // touffes de mousse
   rect(px+4+hash%9,py+5+hash%7,3,2,'#5f7a3e');if(hash%2)rect(px+12,py+13,3,2,'#536a36')}
  else if(fam===5){ // sable amoncelé + petits cailloux
   rect(px+6+hash%8,py+12,6,3,'#a89868');rect(px+5,py+10,2,1,'#8a7a4c')}
  else if(hash%4===0)rect(px+4+hash%10,py+6+hash%8,5,1,'#4a4334'); // fissure courte
  if(hash===7){rect(px+5,py+6,12,9,'#10202a');rect(px+6,py+7,10,7,'#28424f');rect(px+7,py+8,8,2,'#3a5a68')} // flaque
  if(hash===13){let c='#caa24e';rect(px+8,py+5,1,T-10,c);rect(px+5,py+9,T-10,1,c);rect(px+7,py+8,3,3,c)}     // inlay doré (rare)
  if(hash===4){rect(px+5,py+13,4,3,'#5a4f3c');rect(px+13,py+14,5,2,'#4a4030')}                                // petits gravats
  return}
 if(v===0){
  // Sol JUNGLE : terre humide sombre, mousse, feuilles tombées (lecture « sous-bois épais »)
  if(currentTheme.n==='JUNGLE'){rect(px,py,T,T,(x+y)%2?'#2f5e2a':'#356b30');rect(px,py+19,T,5,'#27521f');rect(px+3+hash%12,py+4+hash%10,3,2,'#4a8a3e');if(hash%3===0)rect(px+6+hash%9,py+13,2,2,'#1f4a1c');if(hash%4===0)rect(px+10,py+6,2,2,hash%2?'#7aa84a':'#a8772e');drawFlora(px,py,hash,x,y);return}
  // Sol MARECAGE : tourbière — boue verdâtre sombre, buttes de sphaigne, flaques tanniques, roseaux (lecture « marais détrempé »)
  if(currentTheme.n==='MARECAGE'){
   rect(px,py,T,T,(x+y)%2?'#3f4a30':'#47543a');
   if(hash%2===0){let mx=px+3+hash%11,my=py+6+hash%8;rect(mx,my,6,4,'#5a7a44');rect(mx+1,my-1,4,2,'#6e9050');rect(mx,my+4,6,1,'#3a5230')}
   if(hash%3===1){let drift=Math.round(Math.sin(t*.6+x)*1);rect(px+10,py+12,8,6,'#2c3a30');rect(px+11,py+13,6,2,'#3a5a48');rect(px+12+drift,py+13,2,1,'rgba(150,170,140,.4)')}
   if(hash%4===0){let rx=px+5+hash%12;rect(rx,py+4,1,12,'#7a8a4e');rect(rx+3,py+6,1,10,'#6a7a44');rect(rx,py+3,2,2,'#a89a54')}
   if(hash%6===2)rect(px+8,py+8,1,1,'#8aa074');
   drawFlora(px,py,hash,x,y);return}
  // Sol SEQUOIAS : tapis forestier rouge-brun d'aiguilles + fougères + lumière tamisée (lecture « pied de géants »)
  if(currentTheme.n==='SEQUOIAS'){
   rect(px,py,T,T,(x+y)%2?'#6e4a2e':'#7a5234');
   rect(px,py+18,T,6,'#5a3a22'); // litière d'aiguilles plus dense au sol
   // aiguilles/écorce tombée
   if(hash%2===0)rect(px+3+hash%12,py+5+hash%9,3,1,'#8a5a36');
   rect(px+6+hash%9,py+12,2,1,'#9a6a40');
   // fougères vertes (touffes)
   if(hash%3===0){let fx=px+4+hash%12;rect(fx,py+10,1,7,'#3a6a32');rect(fx-2,py+12,2,1,'#4a7e3e');rect(fx+2,py+11,2,1,'#4a7e3e');rect(fx-2,py+15,2,1,'#3a6a32');rect(fx+2,py+14,2,1,'#3a6a32')}
   // tache de lumière tamisée (rayon traversant la canopée)
   if(hash%5===0)rect(px+8,py+4,5,4,'rgba(245,235,180,.18)');
   drawFlora(px,py,hash,x,y);return}
  if(currentTheme.n==='YELLOWSTONE'){
   let band=(x+Math.floor(y/1))%5,ter=['#caa05a','#d8a94e','#e8b85c','#c98a3e','#bd9a6e'][band];
   rect(px,py,T,T,ter);
   // bandes minérales horizontales (dépôts de travertin) avec liseré clair
   for(let i=0;i<3;i++){let sy=py+3+i*7+(hash%2);rect(px+1,sy,T-2,2,band%2?'#e6c878':'#b87a34');rect(px+1,sy+2,T-1,1,'#fff2cc')}
   // croûte minérale craquelée (lignes fines)
   if(hash%3===0)rect(px+4+hash%8,py+10,7,1,'#9c6a2c');
   if(hash%4===1)rect(px+9,py+2,1,T-4,'#9c6a2c');
   // dépôts soufrés (taches jaune vif) + algues thermophiles (orange-rouge)
   if(hash%5===0)rect(px+5+hash%9,py+5,2,2,'#f4dd55');
   if(hash%6===2)rect(px+12,py+15,3,2,'#d4622a');
   // vapeur dérivante (wisps semi-transparents qui montent)
   if(hash%3===1){let drift=Math.round(Math.sin(t*.9+x)*2);rect(px+8+drift,py+2,3,2,'rgba(245,240,230,.4)');rect(px+9+drift,py-2,2,3,'rgba(245,240,230,.25)')}
   // anneau minéral vif là où le sol borde une source chaude (orange soufré → vert thermophile)
   let wU=map[y-1]&&map[y-1][x]===2,wD=map[y+1]&&map[y+1][x]===2,wL=map[y]&&map[y][x-1]===2,wR=map[y]&&map[y][x+1]===2;
   if(wU){rect(px,py,T,3,'#e9842c');rect(px,py+3,T,2,'#6fb04a')}
   if(wD){rect(px,py+T-3,T,3,'#e9842c');rect(px,py+T-5,T,2,'#6fb04a')}
   if(wL){rect(px,py,3,T,'#e9842c');rect(px+3,py,2,T,'#6fb04a')}
   if(wR){rect(px+T-3,py,3,T,'#e9842c');rect(px+T-5,py,2,T,'#6fb04a')}
   drawFlora(px,py,hash,x,y);return}
  // Sol SAVANE : terre sèche jaune-doré, touffes d'herbes hautes, fissures de sécheresse (lecture « savane africaine »)
  if(currentTheme.n==='SAVANE'){
   rect(px,py,T,T,(x+y)%2?'#b89a42':'#c4a64c');
   rect(px,py+19,T,5,'#9a7e34');
   // touffes d'herbe sèche dressées
   if(hash%2===0){let gx=px+4+hash%12;rect(gx,py+8,1,9,'#cdb45a');rect(gx+2,py+10,1,7,'#bca049');rect(gx-1,py+11,1,6,'#d8c264');rect(gx+1,py+7,1,2,'#e0cf78')}
   // fissures de sol craquelé
   if(hash%3===0)rect(px+6+hash%8,py+14,6,1,'#8a6e2e');
   if(hash%5===1)rect(px+10,py+4,1,8,'#8a6e2e');
   drawFlora(px,py,hash,x,y);return}
  // Sol GROTTE : roche sombre humide, gravats, mousse, paillettes minérales, suintement près des gours
  if(currentTheme.n==='GROTTE'){
   rect(px,py,T,T,(x+y)%2?'#3d343d':'#443a44');
   // dallage rocheux irrégulier (facettes claires/sombres)
   if(hash%2===0)rect(px+2+hash%6,py+3+hash%5,7,5,'#4f444f');
   if(hash%3===1)rect(px+10,py+12,8,6,'#352e35');
   // gravats au sol
   if(hash%4===0){let gx=px+5+hash%10,gy=py+14+hash%5;rect(gx,gy,3,2,'#5a4e5a');rect(gx+1,gy-1,1,1,'#6a5e6a')}
   // mousse souterraine (touche de vert froid)
   if(hash%5===2)rect(px+3+hash%9,py+6,3,2,'#3a5a44');
   // paillette minérale qui scintille faiblement
   if(hash%7===0)rect(px+8+hash%7,py+5,1,1,Math.floor(t*1.5+hash)%2?'#7fe0ea':'#3a8a96');
   // suintement clair là où le sol borde un gour (eau type 2)
   let wU=map[y-1]&&map[y-1][x]===2,wD=map[y+1]&&map[y+1][x]===2,wL=map[y]&&map[y][x-1]===2,wR=map[y]&&map[y][x+1]===2;
   if(wU)rect(px,py,T,2,'#5a6e6a');if(wD)rect(px,py+T-2,T,2,'#5a6e6a');if(wL)rect(px,py,2,T,'#5a6e6a');if(wR)rect(px+T-2,py,2,T,'#5a6e6a');
   drawFlora(px,py,hash,x,y);return}
  let g=currentTheme.n==='TAIGA'?['#d8e7df','#edf3ed']:currentTheme.ground;rect(px,py,T,T,g[(x+y)%2]);rect(px,py+19,T,5,currentTheme.n==='TAIGA'?'#c5d9d2':currentTheme.edge);rect(px+3+hash%13,py+4+hash%11,2,2,currentTheme.n==='TAIGA'?'#fff':'#f0d97b');if(currentTheme.n!=='TAIGA')rect(px+8+hash%7,py+15,1,4,currentTheme.n==='DESERT'?'#ae7e3d':'#6f902e');if(hash%5===0){rect(px+5,py+8,2,2,currentTheme.n==='TAIGA'?'#b8d4d0':'#f7d85b');rect(px+4,py+9,4,1,currentTheme.n==='DESERT'?'#9a6a36':currentTheme.n==='TAIGA'?'#d9eeee':'#e85b50')}drawFlora(px,py,hash,x,y);return}
 if(v===2){if(['TAIGA','GLACIER','MONTAGNE'].includes(currentTheme.n)){let ic=currentTheme.n==='GLACIER'?['#9fc8da','#cfeaf4','#eafcff','#6fa8c0','#a8d2e0']:['#9dcbd3','#bfe0e1','#eaffff','#77aebc','#8fc0c8'];rect(px,py,T,T,ic[0]);rect(px+2,py+2,20,20,ic[1]);rect(px+4,py+4,15,3,ic[2]);rect(px+12,py+9,2,10,ic[3]);rect(px+6,py+16,8,2,ic[4]);if(currentTheme.n==='GLACIER'&&hash%3===0)rect(px+3,py+10,T-6,1,'#7fb0c8');return}
  // Source chaude YELLOWSTONE : anneaux minéraux concentriques (bord orange/ocre → vert → bleu turquoise au centre), surface fumante
  if(currentTheme.n==='YELLOWSTONE'){
   rect(px,py,T,T,'#1f8fa8'); // eau turquoise profonde
   rect(px+1,py+1,T-2,T-2,'#2bb3c4');
   rect(px+3,py+3,T-6,T-6,'#3fd0d8');
   rect(px+6,py+6,T-12,T-12,'#7ff0ea'); // centre lumineux
   // reflets/ondulation lente
   let wave=Math.floor((t*8+x*3+y*2)%T);rect(px+2,py+wave%6+2,T-4,1,'rgba(255,255,255,.35)');
   // vapeur montante au-dessus de la source
   if(hash%2===0){let drift=Math.round(Math.sin(t*.7+y)*2);rect(px+7+drift,py-2,3,3,'rgba(235,250,250,.35)');rect(px+8+drift,py-5,2,3,'rgba(235,250,250,.2)')}
   return}
  // Gour de GROTTE : bassin souterrain calme, turquoise sombre, liseré minéral pâle, ondes de gouttes
  if(currentTheme.n==='GROTTE'){
   rect(px,py,T,T,'#10333a'); // eau sombre profonde
   rect(px+1,py+1,T-2,T-2,'#185a66');
   rect(px+3,py+3,T-6,T-6,'#1f8fa8');
   rect(px+6,py+7,T-12,T-12,'#3fc6d2'); // reflet clair central (lueur cristalline)
   // liseré minéral pâle sur le pourtour (calcite)
   rect(px,py,T,1,'#5a6e6a');rect(px,py+T-1,T,1,'#4a5e5a');
   // onde concentrique d'une goutte qui tombe (rythmée)
   if((hash+Math.floor(t*1.2))%4===0){let r=3+Math.floor((t*4+hash)%5);X.strokeStyle='rgba(180,230,235,.4)';X.strokeRect(px+12-r,py+12-r,r*2,r*2)}
   return}
  // Eau de MARECAGE : eau tannique stagnante (brun-vert sombre), lentilles d'eau (duckweed), nénuphars, vase
  if(currentTheme.n==='MARECAGE'){
   rect(px,py,T,T,'#28382c'); // eau sombre tannique
   rect(px+1,py+1,T-2,T-2,'#324a3a');
   // film de lentilles d'eau (duckweed) en surface
   for(let i=0;i<5;i++){let dx=px+2+((hash+i*5)%18),dy=py+3+((hash*3+i*7)%17);rect(dx,dy,2,2,(i+hash)%2?'#5a8a4e':'#6e9a52')}
   // nénuphar occasionnel
   if(hash%4===0){rect(px+8,py+10,7,5,'#3a6a3a');rect(px+9,py+11,5,3,'#4f7e44');if(hash%8===0)rect(px+11,py+9,2,2,'#e8e0a0')}
   // reflet trouble + bulle de méthane
   let wave=Math.floor((t*6+x*3)%T);rect(px+wave%8+2,py+18,4,1,'rgba(120,150,120,.3)');
   if(hash%6===1)rect(px+14,py+6,1,1,'#9ab48a');
   return}let wave=Math.floor((t*18+x*7+y*3)%24);rect(px,py,T,T,currentTheme.water[0]);rect(px,py,4,T,'#327c9b');rect(px,py,T,3,currentTheme.water[1]);rect(px-12+wave,py+7,13,2,currentTheme.water[1]);rect(px+18-wave,py+15,12,2,'#d6f5ed');rect(px+3,py+21,17,2,'#276c91');return}
 if(v===3){
  // Falaise de grès rouge en DUNES (strates) ; pierre claire ailleurs.
  if(currentTheme.n==='DUNES'){
   // Falaise du GRAND CANYON : strates géologiques empilées, chaque couche d'une teinte distincte (rouge, ocre, beige, brun), liserés clairs + ombres latérales.
   let topOpen=!(map[y-1]&&map[y-1][x]===3),leftOpen=!(map[y]&&map[y][x-1]===3),rightOpen=!(map[y]&&map[y][x+1]===3);
   let strata=['#c4622e','#a8482a','#cf8a4a','#8c4828','#d8a060','#7a3d22'];
   rect(px,py,T,T,strata[5]);
   // 6 bandes stratifiées continues à travers la grille (la teinte dépend de la rangée → couches alignées entre tuiles)
   for(let i=0;i<6;i++){let sy=py+i*4,band=(y*6+i)%6;rect(px,sy,T,4,strata[band]);rect(px,sy,T,1,'#e6b878');rect(px,sy+3,T,1,'#5e2c16')}
   // volume de la paroi : lumière à gauche, ombre à droite
   rect(px,py,3,T,'rgba(255,220,160,.16)');
   rect(px+T-4,py,4,T,'rgba(40,15,8,.30)');
   // fissure verticale occasionnelle
   if(hash%4===0)rect(px+8+hash%6,py,1,T,'#4a2010');
   // mince corniche d'éboulis sur le rebord exposé en haut
   if(topOpen){rect(px+2,py-2,4,2,'#8c4828');rect(px+13,py-1,5,2,'#a8482a')}
   if(leftOpen)rect(px,py+3,2,T-6,'rgba(40,15,8,.28)');
   if(rightOpen)rect(px+T-2,py+3,2,T-6,'rgba(40,15,8,.4)');
   return}
  // Falaise rocheuse en couches en MONTAGNE : strates de roche multi-teintes, mousse/herbe sur les rebords exposés, neige au sommet.
  if(currentTheme.n==='MONTAGNE'){
   let topOpen=!(map[y-1]&&map[y-1][x]===3),leftOpen=!(map[y]&&map[y][x-1]===3),rightOpen=!(map[y]&&map[y][x+1]===3);
   // base sombre + bloc de roche principal nuancé
   rect(px,py,T,T,'#3f4738');
   let rockA=(x*2+y)%3, base=['#5a6450','#646e54','#525c46'][rockA];
   rect(px+1,py,T-1,T,base);
   // strates horizontales (couches géologiques) avec liserés clairs/sombres
   for(let i=0;i<4;i++){let sy=py+2+i*6+(hash%2),lo=(x+i)%2;rect(px+1,sy,T-2,2,lo?'#6e7a64':'#586250');rect(px+1,sy+2,T-2,1,'#454d3c')}
   // blocs/facettes de roche (volume) — clairs à gauche (lumière), sombres à droite
   rect(px+2,py+3,7,8,'#76836a');rect(px+13,py+9,8,9,'#474f3e');rect(px+9,py+14,6,6,'#5e6852');
   // fissures sombres
   if(hash%3===0)rect(px+10,py+2,1,T-4,'#363d2f');if(hash%4===1)rect(px+5,py+8,8,1,'#363d2f');
   // éboulis/cailloux au pied
   rect(px+3,py+T-3,4,2,'#4a5440');rect(px+15,py+T-2,5,2,'#414a38');
   // HERBE/MOUSSE sur les rebords exposés (au sol/à l'air) → casse l'effet « mur plat »
   // En RUINES (intérieur) : pas d'herbe/neige extérieure, mais un liseré de mousse discret le long du rebord.
   if(topOpen){
    if(isRuins){rect(px+1,py,T-2,2,'#4a5840');for(let i=0;i<3;i++)if((i+hash)%2)rect(px+3+i*7,py,3,1,'#5e7a3e')}
    else{rect(px+1,py,T-2,3,'#5e7a3e');for(let i=0;i<4;i++)rect(px+2+i*6+(hash%3),py-2,2,3,(i+hash)%2?'#6c8a44':'#4f6a34');rect(px+1,py+3,T-2,1,'#3f5a2c');
     // chapeau de neige si haut sommet (alterné)
     if((x+y)%3===0){rect(px+2,py-3,T-4,3,'#eef4f6');rect(px+5,py-4,6,2,'#fff')}}}
   if(leftOpen&&!isRuins)rect(px,py+4,2,T-6,'#506a34');
   if(rightOpen&&!isRuins)rect(px+T-2,py+6,2,T-8,'#46602e');
   // RUINES : détails « maçonnerie de donjon » rares (brisent la roche uniforme sans surcharger)
   if(isRuins){
    if(hash===2){rect(px+4,py+5,T-8,1,'#2e3328');rect(px+4,py+11,T-8,1,'#2e3328');rect(px+11,py+5,1,12,'#2e3328')} // joints de briques taillées
    else if(hash===9){rect(px+6,py+6,9,8,'#43503c');rect(px+5,py+5,7,4,'#56693e');rect(px+12,py+10,4,4,'#4a5e36')} // grosse plaque de mousse
    else if(hash===15){rect(px+8,py+7,8,7,'#cdc3ad');rect(px+9,py+9,2,2,'#1a1610');rect(px+13,py+9,2,2,'#1a1610');rect(px+10,py+12,4,1,'#1a1610')} // crâne encastré (creepy ruine)
   }
   return}
  if(currentTheme.n==='GLACIER'){
   let topOpen=!(map[y-1]&&map[y-1][x]===3);
   rect(px,py,T,T,'#5d93ad');
   rect(px+1,py,T-1,T,(x+y)%2?'#9fc8da':'#8cbcd2');
   // séracs : blocs de glace à facettes claires/sombres + stries
   rect(px+2,py+2,8,9,'#bfe0ef');rect(px+13,py+4,8,11,'#6fa8c0');rect(px+8,py+13,7,8,'#a8d2e0');
   for(let i=0;i<3;i++){let sy=py+3+i*7;rect(px+1,sy,T-2,1,'#cfeaf4');rect(px+1,sy+3,T-2,1,'#5a8aa4')}
   if(hash%3===0)rect(px+11,py+2,1,T-4,'#4d7e98');// crevasse
   if(topOpen){rect(px+1,py-3,T-2,4,'#eafcff');rect(px+4,py-4,5,2,'#fff');for(let i=0;i<3;i++)rect(px+3+i*7,py-2,3,2,'#dcf2fb')}
   return}
  // Roche par défaut (SAVANE, FORET…) : outcrop en couches + herbe sur les rebords exposés (anti « mur plat »).
  {let topOpen=!(map[y-1]&&map[y-1][x]===3),leftOpen=!(map[y]&&map[y][x-1]===3),rightOpen=!(map[y]&&map[y][x+1]===3);
   let grass=currentTheme.n==='SAVANE'?'#8a8a3e':currentTheme.n==='FORET'?'#5e8a3a':'#6d7c48';
   rect(px,py,T,T,'#6e6a4a');
   rect(px+1,py,T-1,T,(x+y)%2?'#a7a078':'#999268');
   // strates + facettes de roche
   for(let i=0;i<3;i++){let sy=py+3+i*7;rect(px+1,sy,T-2,1,'#c1ba8c');rect(px+1,sy+3,T-2,1,'#6a6448')}
   rect(px+2,py+3,7,8,'#b4ad82');rect(px+14,py+10,7,9,'#716d52');rect(px+9,py+14,6,6,'#867f5c');
   if(hash%3===0)rect(px+10,py+2,1,T-4,'#54513a');
   rect(px+3,py+T-3,5,2,'#5d5a40');
   if(topOpen){rect(px+1,py,T-2,3,grass);for(let i=0;i<4;i++)rect(px+2+i*6+(hash%3),py-2,2,3,(i+hash)%2?grass:'#4f6a30');rect(px+1,py+3,T-2,1,'#4a5436')}
   if(leftOpen)rect(px,py+5,2,T-8,grass);
   if(rightOpen)rect(px+T-2,py+7,2,T-10,grass);
   return}}
 if(v===4&&isCanyonBiome()){
  // PONT DE CANYON : vieille passerelle de pierre/bois usée enjambant le gouffre.
  // Orientation devinée par les voisins-pont (4) : horizontale ou verticale.
  let isB=(xx,yy)=>{let r=map[yy];return r&&r[xx]===4};
  let horiz=isB(x-1,y)||isB(x+1,y);
  // ombre portée du pont sur le vide (donne du relief au-dessus du gouffre)
  rect(px+1,py+2,T-2,T-2,'rgba(8,4,2,.45)');
  if(horiz){
   rect(px,py+5,T,14,'#7a5a36');                       // tablier
   rect(px,py+5,T,3,'#9a7448');rect(px,py+16,T,3,'#4e3a22'); // arêtes claire/sombre
   for(let i=0;i<3;i++)rect(px+2+i*8,py+6,1,12,'#5a4228'); // planches/joints
   rect(px,py+5,T,1,'#3a2a18');rect(px,py+18,T,1,'#2c2014');
   // cordes/rambardes effilochées de part et d'autre
   rect(px,py+3,T,1,'#caa46a');rect(px,py+20,T,1,'#caa46a');
   if(hash%3===0){rect(px+4,py+1,1,3,'#8a6a40');rect(px+12,py+1,1,3,'#8a6a40')}
   // PLANCHE FENDUE/USÉE : éclats et fente sombre (look « cassé » mais le pont tient encore)
   if(hash%5===0){rect(px+9,py+7,4,10,'#2a1a0e');rect(px+10,py+8,2,8,'#180e06');rect(px+8,py+7,1,10,'#3a2614');rect(px+13,py+7,1,10,'#3a2614')}
  }else{
   rect(px+5,py,14,T,'#7a5a36');
   rect(px+5,py,3,T,'#9a7448');rect(px+16,py,3,T,'#4e3a22');
   for(let i=0;i<3;i++)rect(px+6,py+2+i*8,12,1,'#5a4228');
   rect(px+5,py,1,T,'#3a2a18');rect(px+18,py,1,T,'#2c2014');
   rect(px+3,py,1,T,'#caa46a');rect(px+20,py,1,T,'#caa46a');
   if(hash%3===0){rect(px+1,py+4,3,1,'#8a6a40');rect(px+1,py+12,3,1,'#8a6a40')}
   if(hash%5===0){rect(px+7,py+9,10,4,'#2a1a0e');rect(px+8,py+10,8,2,'#180e06');rect(px+7,py+8,10,1,'#3a2614');rect(px+7,py+13,10,1,'#3a2614')}
  }
  return}
 if(v===4){if(['TAIGA','GLACIER','MONTAGNE'].includes(currentTheme.n)){let sn=currentTheme.n==='MONTAGNE'?['#eef4f6','#fff','#cdd9dc','#b4c4c8']:currentTheme.n==='GLACIER'?['#dcebf2','#fff','#bfe0ef','#9fc8da']:['#e8f0eb','#fff','#c4d9d4','#a3c3c2'];rect(px,py,T,T,sn[0]);rect(px+hash%18,py+5,5,2,sn[1]);rect(px+4,py+17,8,2,sn[2]);rect(px+17,py+12,2,2,sn[3]);return}
  // Sable DUNES : rouge orangé avec ondulations de dune (rides parallèles ondulées)
  if(currentTheme.n==='DUNES'){rect(px,py,T,T,(x+y)%2?'#c2723a':'#cf7a3e');for(let i=0;i<3;i++){let ry=4+i*7+Math.round(Math.sin(x*.8+i)*1.5);rect(px+1,py+ry,T-2,2,'#b8642f');rect(px+1,py+ry-1,T-2,1,'#dd8a46')}return}
  rect(px,py,T,T,(x+y)%2?'#d8bd68':'#e3ca76');rect(px+hash%18,py+5,5,2,'#f1dc96');rect(px+4,py+17,8,2,'#b99b50');rect(px+17,py+12,2,2,'#9b8146');return}
 if(v===5){rect(px,py,T,T,'#718f45');rect(px+2,py+3,20,18,'#829e4d');rect(px+hash%16,py+hash%13,6,3,'#587a3d');rect(px+5,py+18,2,5,'#456b38');rect(px+4,py+17,5,2,'#6ca341');return}
 if(v===6&&isCanyonBiome()){
  // GOUFFRE DE CANYON (vue de dessus) : un SEUL grand vide continu (pas une grille de petits trous).
  // On lit les 4 voisins : un voisin NON-vide = une PAROI ensoleillée qui plonge ; plus on est loin
  // d'un bord, plus le fond est SOMBRE (effet de profondeur → « n'y va pas »).
  let isVoid=(xx,yy)=>{let r=map[yy];return r&&(r[xx]===6)};
  let nU=!isVoid(x,y-1),nD=!isVoid(x,y+1),nL=!isVoid(x-1,y),nR=!isVoid(x+1,y);
  let edge=nU||nD||nL||nR;                 // tuile de bord (paroi visible) ?
  // distance approximative au bord (profondeur) : 0 si bord, sinon on sonde en anneaux
  let depth=0;if(!edge){for(let d=2;d<=5;d++){if(!isVoid(x-d,y)||!isVoid(x+d,y)||!isVoid(x,y-d)||!isVoid(x,y+d)){depth=d;break}depth=6}}
  // fond : du brun sombre (près du bord) au quasi-noir (grande profondeur)
  let floorC=edge?'#241509':depth<=2?'#1a0e06':depth<=3?'#120a05':depth<=4?'#0c0704':'#070402';
  rect(px,py,T,T,floorC);
  // léger grain de fond pour ne pas être plat
  if(hash%4===0)rect(px+6+(hash%8),py+8+(hash%6),3,2,shade(floorC,8));
  if(edge){
   // PAROIS : sur chaque côté bordé par de la terre ferme, une falaise éclairée qui descend dans l'ombre.
   if(nU){rect(px,py,T,7,'#6a4326');rect(px,py,T,3,'#8a5a32');rect(px,py+7,T,3,'#3e2614');for(let i=0;i<3;i++)rect(px+3+i*8+(hash%3),py+7,2,4,'#52331c')}
   if(nD){rect(px,py+T-7,T,7,'#5a3a22');rect(px,py+T-3,T,3,'#2e1c10');rect(px,py+T-7,T,2,'#7a5030')}
   if(nL){rect(px,py,5,T,'#623d22');rect(px,py,2,T,'#86562f');rect(px+5,py,3,T,'#3a2312')}
   if(nR){rect(px+T-5,py,5,T,'#5a3820');rect(px+T-3,py,3,T,'#2c1a0e');rect(px+T-5,py,2,T,'#744c2c')}
   // éboulis sur la lèvre supérieure (rochers qui dépassent dans le vide)
   if(nU&&hash%2===0){rect(px+4,py-1,5,3,'#7a5230');rect(px+13,py,4,2,'#62421f')}
  }
  return}
 if(v===7){// LAVE animée (épreuve de parkour des ruines) : bain de magma incandescent, bulles, croûte sombre
  rect(px,py,T,T,'#7a1c05');rect(px+1,py+1,T-2,T-2,'#b8330a');
  // nappe lumineuse ondulante (deux couches déphasées)
  let f1=Math.sin(t*3+x*1.3+y*.7),f2=Math.sin(t*2.1+x*.6-y*1.1);
  rect(px+2,py+6+Math.round(f1*2),T-4,4,'#ff6a14');rect(px+3,py+13+Math.round(f2*2),T-6,3,'#ffab2e');
  // bulles de magma qui « éclatent » (phase par tuile via hash)
  let bphase=(t*1.6+hash*0.5)%2;
  if(bphase<1.2){let br=1+Math.round(bphase*2),bx=px+5+(hash%12),by=py+8+((hash*7)%8);rect(bx,by,br,br,'#ffe07a');rect(bx,by-1,br,1,'#fff3c4')}
  // croûte sombre flottante (taches noires figées) + lueur de bord
  if(hash%3===0)rect(px+3+(hash%10),py+4,4,3,'#5a1404');
  if(hash%5===1)rect(px+12,py+15,5,3,'#5a1404');
  rect(px,py,T,1,'rgba(255,180,60,.35)');
  return}
 if(v===6){let wave=Math.floor((t*12+x*5+y*2)%24);if(currentTheme.n==='VOLCAN'){rect(px,py,T,T,'#5a1405');rect(px+2,py+2,20,20,'#9e2a08');rect(px-10+wave,py+8,12,2,'#ff7a1f');rect(px+16-wave,py+15,10,2,'#ffb13d');if(hash%4===0)rect(px+6,py+5,3,2,'#ffe07a');return}rect(px,py,T,T,'#0d3a52');rect(px+2,py+2,20,20,'#12506b');rect(px-10+wave,py+8,12,2,'#1f6a86');rect(px+16-wave,py+15,10,2,'#2b7a96');if(hash%4===0)rect(px+6,py+5,3,1,'#3f93af');return}
 let base=currentTheme.n==='TAIGA'?'#d8e7df':currentTheme.n==='DESERT'?'#e6c16f':currentTheme.n==='PLAGE'?'#efd78a':currentTheme.ground[(x+y)%2];rect(px,py,T,T,base);if(currentTheme.n==='TAIGA')rect(px+3,py+6,8,2,'#fff');else if(currentTheme.n==='DESERT')rect(px+4,py+5,4,3,'#c18d45');else rect(px+4,py+5,4,3,'#789d32')}
function drawTree(x,y){let px=x*T,py=y*T,t=performance.now()*.001,hash=(x*31+y*17)%19,sway=Math.round(Math.sin(t*1.5+x*.8+y*.55)*2),kind=hash%3;rect(px+5,py+20,17,4,'rgba(24,45,20,.35)');
 if(currentTheme.tree==='rock'){rect(px+4,py+8,16,14,'#3a2a24');rect(px+6,py+6,12,15,'#5a4038');rect(px+8,py+4,8,6,'#6b4a3e');rect(px+9,py+12,3,3,'#ff7a1f');rect(px+14,py+15,2,2,'#ffb13d');rect(px+7,py+18,10,3,'#2a1c16');return}
 if(currentTheme.tree==='stalagmite'){
  // stalagmite : colonne de pierre montant du sol (large base → pointe), veinée, à pointe cristalline.
  // + stalactite descendant du plafond hors-cadre, alignée au-dessus (lecture « caverne »).
  rect(px+6,py+10,12,14,'#494049');rect(px+8,py+6,8,18,'#544a54');rect(px+10,py+2,4,22,'#5e545e');
  rect(px+11,py,2,24,'#6a5e6a'); // arête claire centrale
  rect(px+9,py+16,1,8,'#352e35');rect(px+15,py+14,1,10,'#352e35'); // sillons sombres
  rect(px+10,py-2,4,3,'#7fe0ea');rect(px+11,py-4,2,3,'#aef4fa'); // pointe cristalline
  // stalactite du plafond (pendante)
  rect(px+9,py-34,5,10,'#494049');rect(px+10,py-30,3,8,'#544a54');rect(px+11,py-24,1,5,'#6a5e6a');
  if(hash%2===0)rect(px+11,py-19,1,2,'#7fe0ea');
  return}
 if(currentTheme.tree==='cactus'){rect(px+9,py-5,7,29,'#3d8c55');rect(px+11,py-3,2,25,'#72bd6c');rect(px+3,py+5,8,6,'#3d8c55');rect(px+3,py,5,10,'#4ca262');rect(px+15,py+2,7,6,'#3d8c55');rect(px+18,py-3,4,10,'#4ca262');return}
 if(currentTheme.tree==='jungle'){
  // grand arbre tropical : tronc sombre élancé + canopée touffue à étages + liane pendante
  rect(px+10,py+4,5,20,'#4a2f20');rect(px+11,py+6,2,16,'#6e482e');
  // canopée multi-couches, verts profonds humides
  drawJungleCrown(px+12+sway,py-9-kind*2,kind);
  // liane qui pend (varie selon hash)
  if(hash%2===0){let lh=8+hash;rect(px+5+sway,py-2,2,lh,'#2c5a2b');rect(px+4+sway,py-2+lh,4,4,'#3f7e34')}
  // fruit/fleur coloré occasionnel
  if(hash%5===0)rect(px+16+sway,py-4,3,3,hash%2?'#e85035':'#f1cb3e');
  return}
 if(currentTheme.tree==='sequoia'){
  // séquoia géant : tronc rouge-brun colossal montant très haut hors cadre + base évasée (contreforts) + écorce profondément striée + couronne minuscule tout en haut (échelle « géant »).
  // base évasée (pattes/contreforts au sol)
  rect(px+3,py+16,18,8,'#5a2a1a');rect(px+2,py+20,20,4,'#4a2214');
  rect(px+5,py+18,3,6,'#7a3a26');rect(px+16,py+18,3,6,'#7a3a26');
  // tronc colossal qui monte loin au-dessus du cadre
  rect(px+6,py-34,12,52,'#7a3a26');
  rect(px+7,py-34,4,52,'#9a5238'); // face éclairée
  rect(px+15,py-34,2,52,'#5a2a1a'); // ombre
  // écorce profondément striée (sillons verticaux + nœuds)
  for(let i=0;i<3;i++)rect(px+9+i*3,py-32,1,50,'#5a2a1a');
  for(let i=0;i<7;i++)rect(px+6,py-30+i*7,12,1,'#4a2214');
  if(hash%2===0)rect(px+8,py-10,3,4,'#4a2214');
  rect(px+4,py+20,16,4,'#2e160e');
  // couronne haut perchée et compacte (le sommet est si haut qu'on n'en voit qu'une touffe) → impression de hauteur démesurée
  let cx=px+12+Math.round(sway*.5),cy=py-38;
  rect(cx-9,cy-2,18,7,'#1f4a24');rect(cx-11,cy+3,22,7,'#264f28');rect(cx-7,cy+9,14,5,'#1f4a24');
  rect(cx-6,cy,12,6,'#34713a');rect(cx-4,cy-4,8,5,'#3f8546');return}
 if(currentTheme.tree==='willow'){
  // saule pleureur de marais : tronc penché + rideau de branches tombantes verdâtres.
  rect(px+9,py+2,5,22,'#4a3a26');rect(px+10,py+4,2,18,'#5e4a30');
  let cx=px+12+sway,cy=py-4;
  rect(cx-13,cy-6,26,10,'#3a5a34');rect(cx-15,cy,30,7,'#456a3c');rect(cx-9,cy-9,18,7,'#4f7a44');
  // rideau de lianes pendantes
  for(let i=-3;i<=3;i++){let lx=cx+i*4+sway,lh=10+((i+3)*2)%9;rect(lx,cy+4,1,lh,'#3f6a3a');rect(lx,cy+4+lh,2,2,'#5a8a4e')}
  return}
 if(currentTheme.tree==='acacia'){
  // acacia de savane : tronc fin + grande canopée plate en parasol (silhouette africaine).
  rect(px+10,py+2,4,22,'#6a4a30');rect(px+11,py+4,1,18,'#8a6a44');
  let cx=px+12+sway,cy=py-2;
  rect(cx-16,cy-2,32,5,'#5a7a34');rect(cx-18,cy,36,3,'#4f6e2e');rect(cx-13,cy-5,26,4,'#6a8a40');
  rect(cx-8,cy-7,16,3,'#7a9a4a');return}
 if(currentTheme.tree==='basalt'){
  // colonne de basalte islandaise : prisme de roche noire hexagonal + mousse verte au sommet.
  rect(px+6,py-6,12,30,'#33393d');rect(px+7,py-6,3,30,'#454d52');rect(px+15,py-6,2,30,'#262b2e');
  for(let i=0;i<4;i++)rect(px+6,py-2+i*7,12,1,'#22272a');
  rect(px+6,py-8,12,4,'#4e7a3e');rect(px+8,py-10,8,3,'#5e8a48');rect(px+5,py+20,14,4,'#1c2022');return}
 if(currentTheme.tree==='iceblock'){
  // Sérac : bloc de glace bleutée translucide, facettes claires, base ombrée.
  rect(px+4,py-2,16,26,'#8fc4d8');rect(px+6,py,12,22,'#bfe6f0');rect(px+5,py-2,5,26,'#d6f3f8');rect(px+15,py+2,4,20,'#6fa8c0');
  rect(px+8,py+3,3,14,'#eafcff');rect(px+12,py+6,2,10,'#eafcff');
  rect(px+4,py+22,16,3,'#5a8aa0');rect(px+3,py-3,18,2,'#eafcff');return}
 if(currentTheme.tree==='fir'){
  // Sapin de montagne enneigé : tronc sombre, étages de feuillage vert foncé coiffés de neige.
  rect(px+10,py+14,4,10,'#4a3320');rect(px+11,py+15,2,9,'#5e4630');
  let cx=px+12+Math.round(sway*.5);
  rect(cx-9,py+8,18,7,'#234d2c');rect(cx-7,py+2,14,7,'#2a5a33');rect(cx-4,py-4,8,7,'#316539');
  rect(cx-1,py-8,3,5,'#316539');
  // neige sur les étages
  rect(cx-8,py+8,16,2,'#eef7fb');rect(cx-6,py+2,12,2,'#eef7fb');rect(cx-3,py-4,7,2,'#fff');rect(cx-1,py-8,3,2,'#fff');return}
 rect(px+9,py+8,7,16,'#643d31');rect(px+11,py+9,2,14,'#a46a43');if(currentTheme.tree==='palm')drawPalm(px+12+sway,py-5);else if(currentTheme.tree==='pine')drawPine(px+12+sway,py-8);else drawCrown(px+12+sway,py-5-kind*2,kind)}
// Canopée tropicale dense : couches de feuillage très sombres à très claires, plus large que drawCrown.
function drawJungleCrown(cx,cy,kind){let d='#13401f',m='#1f6630',l=kind===1?'#2f8a3e':'#369543',h='#5fc05a';
 rect(cx-14,cy-12,28,5,d);rect(cx-19,cy-7,38,8,d);rect(cx-22,cy+1,44,12,d);rect(cx-18,cy+12,36,6,d);rect(cx-11,cy+17,22,4,d);
 rect(cx-16,cy-5,32,16,m);rect(cx-20,cy+2,12,9,m);rect(cx+8,cy-2,12,11,m);
 rect(cx-10,cy-10,20,9,l);rect(cx-15,cy-3,11,8,l);rect(cx+5,cy-6,11,8,l);
 rect(cx-7,cy-9,10,5,h);rect(cx+3,cy+2,7,5,h);rect(cx-13,cy+6,6,4,h)}
function drawPalm(cx,cy){for(let i=-2;i<=2;i++){rect(cx+i*3-2,cy+Math.abs(i)*2,5,5,'#28693d');rect(cx+i*6-3,cy+Math.abs(i)*4,8,4,'#4ca74d')}rect(cx-3,cy-3,7,7,'#6c9d43');rect(cx-1,cy-1,3,3,'#d49b42')}
function drawPine(cx,cy){rect(cx-5,cy-13,10,5,'#d9eee8');rect(cx-9,cy-9,18,7,'#2c6650');rect(cx-13,cy-3,26,8,'#34775a');rect(cx-17,cy+4,34,9,'#3f8961');rect(cx-13,cy+9,26,7,'#b8d8cd')}
function drawCrown(cx,cy,kind){let dark=kind===1?'#286338':'#2d6b39',mid=kind===2?'#4c9948':'#408744',light=kind===1?'#68b951':'#76c457';rect(cx-12,cy-13,24,4,dark);rect(cx-17,cy-9,34,6,dark);rect(cx-20,cy-3,40,13,dark);rect(cx-17,cy+10,34,6,dark);rect(cx-11,cy+16,22,4,dark);rect(cx-14,cy-7,29,18,mid);rect(cx-18,cy-1,14,10,mid);rect(cx+4,cy-4,13,13,mid);rect(cx-8,cy-11,16,9,light);rect(cx-13,cy-5,9,7,light);rect(cx+2,cy-7,8,6,'#91d464');rect(cx+10,cy+4,6,5,'#34783d');rect(cx-8,cy+11,8,5,'#245833')}
function drawQuicksand(q){let x=q.x*T,y=q.y*T,t=q.phase;rect(x+2,y+4,20,17,'#a98a4e');rect(x+4,y+6,16,13,'#c2a45c');for(let i=0;i<3;i++){let r=3+i*3,w=Math.round((Math.sin(t*2+i)+1)*3);rect(x+12-r,y+8+i*4,r*2,2,'#806d43');rect(x+12-w,y+9+i*4,w*2,1,'#e1c978')}}
function drawHole(h){let x=h.x*T,y=h.y*T;rect(x+2,y+7,20,13,'#6c713f');rect(x+3,y+5,18,14,'#293323');rect(x+6,y+8,13,10,'#080d0a');rect(x+4,y+5,12,3,'#9da35a');rect(x+17,y+8,4,8,'#141b13')}
// Rendu du relief (couche elev) : collines surélevées (falaise + sommet éclairé) et crevasses (failles mortelles).
function drawAltitude(){
 let dark=currentTheme.edge||'#3a4a30';
 // 1) COLLINES/MONTS — relief surélevé PARFAITEMENT FRANCHISSABLE (ralentit seulement).
 //    Rendu en « buttes » : pan plus clair, falaise ombrée au sud/est, crête éclairée + touche
 //    du biome (neige en altitude, herbe ailleurs) → vraies collines/monts, jamais des murs.
 let mont=currentTheme.n==='MONTAGNE'||currentTheme.n==='GLACIER',
     crest=mont?'rgba(238,244,246,.5)':'rgba(150,196,96,.42)',
     face=mont?'rgba(150,168,150,.30)':'rgba(210,220,150,.24)';
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  if(!elev[y]||elev[y][x]!==1)continue;
  let px=x*T,py=y*T,hash=(x*31+y*17)%7;
  let southOpen=!(elev[y+1]&&elev[y+1][x]===1),eastOpen=!(elev[y]&&elev[y][x+1]===1);
  let northOpen=!(elev[y-1]&&elev[y-1][x]===1),westOpen=!(elev[y]&&elev[y][x-1]===1);
  // pan surélevé (couche claire qui donne le ton « butte »)
  rect(px,py,T,T,face);
  // micro-relief de surface (cailloux/touffes) pour casser le plat
  if(hash%3===0)rect(px+5+hash,py+8,3,2,mont?'rgba(120,140,120,.4)':'rgba(110,150,70,.4)');
  if(hash%4===1)rect(px+13,py+14,2,2,mont?'rgba(200,210,200,.4)':'rgba(150,190,100,.4)');
  // Falaise (ombre portée) sur les bords ouverts vers le bas/droite = volume de la butte.
  if(southOpen){rect(px,py+T-4,T,6,'rgba(0,0,0,.32)');rect(px,py+T-1,T,4,dark)}
  if(eastOpen){rect(px+T-4,py,6,T,'rgba(0,0,0,.26)');rect(px+T-1,py,3,T,dark)}
  // Crête éclairée (liseré clair + touffes/neige) sur les bords nord/ouest (sommet exposé).
  if(northOpen){rect(px,py,T,3,crest);for(let i=0;i<4;i++)rect(px+2+i*6+(hash%3),py-2,2,3,crest)}
  if(westOpen)rect(px,py,3,T,crest);
  rect(px+2,py+2,T-4,T-6,'rgba(255,250,220,.08)');
 }
 // 2) CREVASSES — failles sombres et dentelées, lueur froide au fond.
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  if(!elev[y]||elev[y][x]!==2)continue;
  let px=x*T,py=y*T,hash=(x*31+y*17)%7;
  rect(px,py,T,T,'#1a1714');
  rect(px+2,py+2,T-4,T-4,'#0a0807');
  // Lèvres de la faille (bord clair de pierre).
  rect(px,py,T,2,'#574a3a');rect(px,py+T-2,T,2,'#3a2f24');
  // Veine de profondeur (lueur froide bleutée au fond, légère variation).
  let g=Math.abs(Math.sin(performance.now()*.001+x+y));
  rect(px+4+hash,py+6,3,T-12,'rgba(60,90,120,'+(.12+g*.1)+')');
  if(hash%3===0)rect(px+T-7,py+4,2,T-8,'rgba(50,80,110,.14)');
 }
}
function drawTrap(t){let x=t.x*T,y=t.y*T,on=t.phase%2.8>1.65;
 if(t.kind==='lava'){rect(x+2,y+5,20,16,'#6b1c08');rect(x+4,y+7,16,12,on?'#ff7a1f':'#e0571f');for(let i=0;i<3;i++){let h=on?5:2;rect(x+6+i*5,y+8,3,h,'#ffb13d');rect(x+6+i*5,y+7,3,1,'#ffe07a')}rect(x+5,y+17,14,2,'#9e2a08');return}
 if(t.kind==='spark'){rect(x+9,y+3,4,16,'#3a4a63');rect(x+7,y+2,8,3,'#2bd0e0');if(on){rect(x+5,y+6,3,3,'#9af0ff');rect(x+15,y+9,3,3,'#9af0ff');rect(x+8,y+12,2,5,'#e8fbff');rect(x+12,y+11,2,6,'#e8fbff')}else{rect(x+10,y+10,2,4,'#2bd0e0')}rect(x+4,y+19,16,2,'#2a3548');return}
 if(t.kind==='cactus'){rect(x+7,y+3,10,19,'#438b51');rect(x+3,y+9,7,6,'#438b51');rect(x+15,y+6,7,6,'#55a65c');for(let i=0;i<5;i++)rect(x+8+i%2*7,y+5+i*3,2,1,'#eee0a8');return}if(t.kind==='ice'){rect(x+2,y+5,20,16,'#79b5c4');rect(x+5,y+7,14,11,on?'#d9f5f2':'#9dd9dc');rect(x+8,y+8,3,9,'#fff');rect(x+13,y+11,5,2,'#4f91a9');return}if(t.kind==='crabtrap'){rect(x+3,y+7,18,13,'#a95a35');rect(x+7,y+5,10,11,'#e36b3f');rect(x+4,y+4,6,4,'#df7b48');rect(x+14,y+4,6,4,'#df7b48');rect(x+9,y+7,2,2,'#111');rect(x+14,y+7,2,2,'#111');return}
 if(t.kind==='geyser'){
  // Cycle d'éruption : la phase monte ; erupt=true quelques instants, sinon vent fumant au repos.
  let cyc=t.phase%4,erupt=cyc>2.7,build=cyc>2.2&&cyc<=2.7,hot=t.hot!==false;
  // Margelle minérale autour de l'évent (terrasse de silice ocre ou pierre bleutée).
  let rim=hot?'#caa15a':'#5d6b72',rim2=hot?'#a87e3e':'#46535a';
  rect(x+3,y+15,18,8,rim2);rect(x+5,y+16,14,6,rim);rect(x+8,y+17,8,4,hot?'#7a5a2c':'#33414a');
  // Bassin d'eau chaude/bouillonnante au centre.
  let pool=hot?'#39c3cf':'#4f9ec0';rect(x+8,y+17,8,3,pool);if(((performance.now()*.004+t.x)%1)>.55)rect(x+10,y+17,2,1,'#bff6f6');
  if(erupt){
   // Colonne d'eau/vapeur qui jaillit vers le haut, plus haute au pic du cycle.
   let h=Math.min(1,(cyc-2.7)/.4),col=hot?['#7fe6ec','#c8f6f4','#eafffd']:['#bfe0ef','#def0fb','#fff'];
   let H1=Math.round(26*h+8);
   rect(x+9,y+16-H1,5,H1,col[0]);rect(x+10,y+16-H1,3,H1,col[1]);rect(x+11,y+15-H1,1,H1,col[2]);
   // Gouttelettes/embruns latéraux.
   for(let i=0;i<5;i++){let dx=Math.sin(i*1.7+t.x)*9*h,dy=-H1+i*5;rect(x+11+dx,y+14+dy,2,2,col[1])}
   // Nuage de vapeur au sommet.
   rect(x+5,y+14-H1,14,5,hot?'rgba(220,248,246,.55)':'rgba(230,240,250,.5)');
  }else if(build){
   // Pré-éruption : bouillonne fort, petites bulles.
   rect(x+9,y+13,5,4,pool);for(let i=0;i<3;i++)rect(x+9+i*2,y+11-(i%2),2,2,hot?'#bff6f6':'#dbeefb');
  }else{
   // Repos : panache de vapeur qui dérive doucement.
   let dr=Math.sin(performance.now()*.0015+t.x)*4;
   rect(x+9+dr*.3,y+9,4,5,hot?'rgba(210,240,240,.34)':'rgba(220,235,248,.3)');
   rect(x+8+dr*.5,y+4,5,5,hot?'rgba(210,240,240,.24)':'rgba(220,235,248,.22)');
   rect(x+10+dr,y+0,4,4,hot?'rgba(210,240,240,.14)':'rgba(220,235,248,.13)');
  }
  return}
 rect(x+2,y+3,20,19,'#514b35');rect(x+4,y+5,16,15,'#887b4b');rect(x+6,y+7,12,11,'#625c40');for(let i=0;i<4;i++){let ph=(i%2)*2;rect(x+5+i*4,y+(on?5+ph:14),3,on?13-ph:4,'#dfe2d2');rect(x+6+i*4,y+(on?3+ph:12),1,2,'#fff')}}
// ── GRANDS GEYSERS (Yellowstone/Islande) ──
// Cycle : repos → grondement (avertissement) → ÉRUPTION (colonne d'eau mortelle qui projette le joueur).
function updateGeysers(dt,comboGuard){
 if(!geysers.length)return;
 geysers.forEach(g=>{
  g.phase+=dt;if(g.phase>=g.period){g.phase-=g.period;g.blew=false}
  let inErupt=g.phase>=g.period-g.erupt;
  let inRumble=!inErupt&&g.phase>=g.period-g.erupt-1.1; // 1.1 s d'avertissement
  g.rumble=inRumble?1:0;
  // hauteur de colonne : monte vite au début de l'éruption, retombe à la fin
  if(inErupt){let e=(g.phase-(g.period-g.erupt))/g.erupt;g.h=Math.sin(Math.min(1,e*1.15)*Math.PI*.85);if(!g.blew){g.blew=true;sound(g.hot?90:140,.5,'sawtooth',.05);impact(.3)}}
  else g.h=0;
  // bouillonnement sonore discret au grondement
  if(inRumble&&Math.random()<dt*4)sound(g.hot?180:240,.06,'square',.02);
  // collision : pendant l'éruption, le joueur trop proche est PROJETÉ puis blessé
  if(inErupt&&g.h>.25&&player&&inv<=0&&shield<=0){
   let dx=player.x-(g.x+.5),dy=player.y-(g.y+.5),d=Math.hypot(dx,dy)||.01;
   if(d<g.launchRad){
    // projection radiale forte + un peu vers le haut (effet « soufflé »)
    let f=8.5*(1-d/g.launchRad)+4;player.vx=dx/d*f;player.vy=dy/d*f-2;
    cam.shake=Math.max(cam.shake,6);
    if(!comboGuard)hurt(g.hot?'Geyser brûlant':'Geyser glacé');
   }
  }
 });
}
// Rendu d'un grand geyser. layer='base' : terrasse + repos/grondement ; layer='col' : colonne d'éruption
// (dessinée APRÈS le joueur pour qu'il paraisse soufflé dans la gerbe).
function drawGeyser(g,layer){
 let x=g.x*T,y=g.y*T,cx=x+T/2,hot=g.hot,now=performance.now();
 if(layer==='col'){
  if(g.h>0){
   // GRANDE colonne d'éruption : bien plus haute et large qu'avant (jet spectaculaire).
   let H=Math.round(150*g.h+30),col=hot?['#5fe6e0','#bff6f6','#eafffd']:['#9fd4ee','#dff4ff','#fff'];
   let ww=Math.round(16+g.h*12),wob=Math.sin(now*.02)*3;
   rect(cx-ww/2,y+14-H,ww,H,col[0]);
   rect(cx-ww/2+3+wob,y+14-H,Math.max(3,ww-6),H,col[1]);
   rect(cx-2+wob*.5,y+12-H,4,H,col[2]);
   // gouttelettes projetées sur les côtés (plus nombreuses, plus larges)
   for(let i=0;i<18;i++){let t2=(now*.012+i*.7)%1,sx=cx+Math.sin(i*1.3)*(22+i*1.4)*g.h,sy=y+12-H+t2*H;rect(sx,sy,3,3,col[1+(i%2)])}
   // gros panache de vapeur en haut du jet
   let sw=Math.round(40+g.h*40);
   X.fillStyle=hot?'rgba(220,250,248,.5)':'rgba(228,242,252,.46)';X.fillRect(cx-sw/2,y+8-H,sw,16);
   X.fillStyle=hot?'rgba(220,250,248,.3)':'rgba(228,242,252,.28)';X.fillRect(cx-sw/2-6,y-4-H,sw+12,14);
   X.fillStyle=hot?'rgba(220,250,248,.18)':'rgba(228,242,252,.16)';X.fillRect(cx-sw/2-10,y-16-H,sw+20,12);
  }
  return;
 }
 // 1) TERRASSE MINÉRALE concentrique (bord ocre/orange → vert pâle → turquoise) — Grand Prismatic.
 if(hot){
  rect(x-14,y+10,T+28,22,'#7a4a18');           // boue/silice extérieure brun-roux
  rect(x-10,y+12,T+20,18,'#b5641c');           // anneau orange vif
  rect(x-6,y+13,T+12,16,'#d59330');            // anneau ambre
  rect(x-2,y+14,T+4,14,'#7bbf6e');             // anneau vert (bactéries)
  rect(x+1,y+15,T-2,12,'#23b6c4');             // anneau turquoise
  rect(x+4,y+16,T-8,10,'#5fe6e0');             // eau chaude centrale
  rect(x+6,y+17,T-12,8,'#bff6f6');             // cœur clair bouillonnant
 }else{
  rect(x-12,y+10,T+24,22,'#3a444a');rect(x-8,y+12,T+16,18,'#4e5a62');
  rect(x-3,y+14,T+6,14,'#5f8fa6');rect(x+2,y+15,T-4,12,'#7ec2da');rect(x+5,y+16,T-10,9,'#cfeefb');
 }
 // bullage central permanent
 if((now*.004+g.x)%1>.5){rect(cx-2,y+17,2,2,hot?'#eafffd':'#fff');rect(cx+2,y+19,1,1,hot?'#bff6f6':'#dff4ff')}
 // 2) GRONDEMENT : grosses bulles + tremblement de la margelle (avertissement visuel).
 if(g.rumble>0){let j=Math.round(Math.sin(now*.05)*1.5);for(let i=0;i<5;i++){let bx=cx-8+i*4,by=y+15-((now*.01+i)%2)*4;rect(bx+j,by,3,3,hot?'#dffffc':'#eaf6ff')}
  pxText('!',cx,y-2,'#ff5a3c','center',9)}
 // 3) REPOS : fin panache de vapeur qui dérive (la colonne d'éruption est dessinée en couche 'col').
 if(g.h<=0){
  let dr=Math.sin(now*.0015+g.x)*4;
  X.fillStyle=hot?'rgba(210,240,240,.3)':'rgba(220,235,248,.26)';
  X.fillRect(cx-3+dr*.3,y+4,7,7);X.fillRect(cx-2+dr*.6,y-4,6,6);X.fillRect(cx-1+dr,y-11,4,4);
 }
}
function drawArtifact(a){let x=a.x*T,y=a.y*T,b=Math.round(Math.sin(performance.now()*.006+a.pulse)*3);rect(x+4,y+20,18,3,'rgba(20,30,10,.35)');
 if(a.kind==='flask'){rect(x+10,y+3+b,4,5,'#cfe6e0');rect(x+7,y+8+b,10,12,'#bcd9d2');rect(x+8,y+11+b,8,8,'#ff7a1f');rect(x+8,y+15+b,8,4,'#e0571f');rect(x+11,y+9+b,2,2,'#fff');rect(x+9,y+5+b,6,2,'#9fb8b2');return}
 if(a.kind==='cell'){rect(x+6,y+5+b,12,15,'#2a3548');rect(x+8,y+7+b,8,11,'#2bd0e0');rect(x+11,y+2+b,2,4,'#d5b34c');rect(x+9,y+9+b,2,7,'#fff');rect(x+13,y+11+b,2,5,'#fff');rect(x+8,y+16+b,8,2,'#9af0ff');return}
 if(a.kind==='shell'){rect(x+5,y+8+b,16,12,'#f2c69c');rect(x+8,y+5+b,10,14,'#fff0ce');for(let i=0;i<4;i++)rect(x+8+i*3,y+8+b,1,9,'#d89d7f');return}if(a.kind==='crystal'){rect(x+8,y+4+b,9,17,'#60cfe3');rect(x+11,y+2+b,5,19,'#baf5ef');rect(x+6,y+11+b,5,10,'#438ebe');return}if(a.kind==='scarab'){rect(x+6,y+8+b,14,11,'#1d6f74');rect(x+9,y+5+b,8,15,'#42b6a4');rect(x+3,y+10+b,7,3,'#d5b34c');rect(x+16,y+10+b,7,3,'#d5b34c');return}rect(x+6,y+9+b,14,12,'#673718');rect(x+7,y+7+b,12,13,'#d79524');rect(x+9,y+4+b,8,7,'#ffd83d');rect(x+11,y+5+b,4,3,'#fff7a1');rect(x+8,y+14+b,10,2,'#8f5a1d')}
function drawExit(e){let x=e.x*T,y=e.y*T,c=e.open?'#e78b24':'#77705a',stone={FORET:'#596c48',PLAGE:'#b78550',TAIGA:'#a8c8c9',DESERT:'#c58d48',JUNGLE:'#3f6b3a',DUNES:'#a85e2c',SEQUOIAS:'#5a6638',MARECAGE:'#4f5e44',SAVANE:'#9a8a48',ISLANDE:'#48525a',YELLOWSTONE:'#a87e3e',GLACIER:'#9fbccb',MONTAGNE:'#6e7a64'}[currentTheme.n]||currentTheme.edge||'#77705a';rect(x-5,y+17,34,7,'#4a3e2d');rect(x-4,y-3,32,24,stone);rect(x+1,y-9,22,9,stone);if(currentTheme.n==='TAIGA'){rect(x-2,y-6,28,3,'#fff');rect(x+17,y-13,5,8,'#bce8ea')}if(currentTheme.n==='DESERT'){rect(x-1,y+1,5,12,'#e0ba69');rect(x+20,y+1,5,12,'#e0ba69')}if(currentTheme.n==='PLAGE'){rect(x-4,y-7,5,7,'#4f9b51');rect(x+23,y-7,5,7,'#4f9b51')}rect(x+3,y+2,18,20,c);rect(x+6,y+5,12,17,e.open?'#fff07a':'#171512');rect(x+10,y+10,4,4,e.open?'#fff':'#9b8955')}
function drawFireflies(){let t=performance.now()*.001;for(let i=0;i<12;i++){let x=22+(i*83)%450,y=18+(i*47)%350,b=Math.sin(t*3+i);if(b>.35){rect(x,y,2,2,'#fff47c');rect(x+1,y+1,1,1,'#d7e54b')}}}
function ambientStyle(){
 // Dans les ruines : fines poussières dorées en suspension qui dérivent lentement (atmosphère de crypte).
 if(isRuins)return{color:['#d8c79a','#c4b486','#e8dcb8','#9a8a60'],drift:.35,fall:.12,size:[1,2],n:46,glow:true};
 return{FORET:{color:['#7fae3e','#5d8c2c','#c0d76a'],drift:.5,fall:.18,size:[2,4],n:34},PLAGE:{color:['#dff5fb','#bfeaf2','#ffffff'],drift:.9,fall:.05,size:[1,2],n:30},TAIGA:{color:['#ffffff','#eaf6f7','#cfe6ea'],drift:.25,fall:.5,size:[2,3],n:40},DESERT:{color:['#e8d49a','#d8be7e','#f0e0b0'],drift:1.4,fall:.06,size:[1,2],n:30},VOLCAN:{color:['#ff7a2a','#ffb13d','#ff4d1a','#8a4030'],drift:.5,fall:.5,size:[1,3],n:38,up:true,glow:true},GROTTE:{color:['#7fe0ea','#bfe6ec','#5aa0aa','#dfeef0'],drift:.2,fall:.9,size:[1,2],n:30,glow:true},
 // JUNGLE : pluie battante (gouttes verticales rapides) ; DUNES : poussière chaude qui monte.
 JUNGLE:{color:['#bfe6f0','#9fd0e0','#dff5fb'],drift:.15,fall:2.6,size:[1,2],n:60,rain:true},
 DUNES:{color:['#e8c79a','#d8b67e','#f0dcb0'],drift:1.8,fall:.05,size:[1,2],n:34,up:true}}[currentTheme.n]||{color:['#fff'],drift:.4,fall:.3,size:[2,3],n:24}}
function initAmbient(){let s=ambientStyle();ambient=[];for(let i=0;i<s.n;i++)ambient.push(spawnAmbient(s,true))}
function spawnAmbient(s,seed){let dir=s.up?-1:1,y=s.up?(seed?cam.y+Math.random()*H:cam.y+H+8+Math.random()*40):(seed?cam.y+Math.random()*H:cam.y-8-Math.random()*40);return{x:cam.x+Math.random()*W,y,vx:(Math.random()-.5)*s.drift,vy:s.fall*(.6+Math.random()*.9)*dir,sw:Math.random()*Math.PI*2,size:s.size[0]+rng(s.size[1]-s.size[0]+1),color:s.color[rng(s.color.length)],glow:!!s.glow,rain:!!s.rain,twk:Math.random()*Math.PI*2}}
function updateAmbient(dt){if(!settingsData.motion)return;let s=ambientStyle();ambient.forEach(p=>{p.sw+=dt*2;p.twk+=dt*8;p.x+=(p.vx+Math.sin(p.sw)*.3)*T*dt;p.y+=p.vy*T*dt;
  let off=(p.y<cam.y-12||p.y>cam.y+H+12||p.x<cam.x-20||p.x>cam.x+W+20);
  if(off){Object.assign(p,spawnAmbient(s,false))}});
 popFx.forEach(f=>{f.t+=dt});popFx=popFx.filter(f=>f.t<f.dur)}
function drawAmbient(){ambient.forEach(p=>{
  // Pluie : traits verticaux allongés (gouttes filantes) plutôt que carrés.
  if(p.rain){X.globalAlpha=.5;rect(p.x,p.y,1,5+p.size*2,p.color);return}
  let a=p.glow?.55+Math.sin(p.twk)*.35:.55;X.globalAlpha=Math.max(.12,a);rect(p.x,p.y,p.size,p.size,p.color);if(p.glow&&p.size>=2){X.globalAlpha=Math.max(.06,a*.4);rect(p.x-1,p.y-1,p.size+2,p.size+2,p.color)}});X.globalAlpha=1}
function addPop(x,y,color){popFx.push({x,y,color,t:0,dur:.4})}
function drawAlert(e){if(!e.alert)return;let x=e.x*T,y=e.y*T,b=Math.round(Math.sin(performance.now()*.012)*2);rect(x-2,y-26+b,4,7,'#ffd24a');rect(x-2,y-17+b,4,3,'#ffd24a');rect(x-2,y-27+b,4,1,'#fff2c0')}
function drawPops(){popFx.forEach(f=>{let k=f.t/f.dur,r=4+k*16;X.globalAlpha=Math.max(0,1-k);X.strokeStyle=f.color;X.lineWidth=3;X.strokeRect(f.x-r,f.y-r,r*2,r*2)});X.globalAlpha=1;X.lineWidth=4}
// Barre de vie (PV) + barre de souffle, en haut à gauche. Style pixel cohérent avec la DA.
// ── Icônes pixel-art (10×10) dessinées au bout de chaque barre ──
function iconHeart(ox,oy){ // cœur rouge
 let p=[[2,1],[3,1],[6,1],[7,1],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],
  [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],
  [3,5],[4,5],[5,5],[6,5],[4,6],[5,6]];
 p.forEach(c=>rect(ox+c[0],oy+c[1],1,1,'#ff4d4d'));
 rect(ox+2,oy+1,1,1,'#ff9a9a');rect(ox+3,oy+2,1,1,'#ffbcbc');
}
function iconBubbles(ox,oy){ // bulles d'air bleues
 rect(ox+2,oy+2,3,3,'#6ed2ff');rect(ox+2,oy+2,1,1,'#dff4ff');
 rect(ox+6,oy+1,2,2,'#9ae0ff');rect(ox+6,oy+5,3,3,'#6ed2ff');rect(ox+6,oy+5,1,1,'#dff4ff');
}
function iconShift(ox,oy){ // touche SHIFT : flèche vers le haut + barre
 rect(ox+4,oy+1,2,1,'#eaf6ff');rect(ox+3,oy+2,4,1,'#eaf6ff');rect(ox+2,oy+3,6,1,'#eaf6ff');
 rect(ox+1,oy+4,8,1,'#eaf6ff');rect(ox+3,oy+5,4,3,'#bdeaff');rect(ox+2,oy+8,6,1,'#9fd4ee');
}
function iconCoin(ox,oy){ // pièce d'or
 rect(ox+2,oy+1,5,1,'#caa12e');rect(ox+1,oy+2,7,5,'#f2c84b');rect(ox+2,oy+7,5,1,'#caa12e');
 rect(ox+1,oy+2,1,5,'#ffe98a');rect(ox+3,oy+3,3,3,'#caa12e');rect(ox+4,oy+3,1,3,'#fff3bd');
}
function iconClock(ox,oy,urgent){ // horloge de sable / cadran
 let c=urgent?'#ff6b5e':'#cfe0ef';
 rect(ox+1,oy+1,7,1,'#8aa0b2');rect(ox+1,oy+7,7,1,'#8aa0b2');
 rect(ox+2,oy+2,5,5,c);rect(ox+3,oy+3,3,3,urgent?'#7a1a14':'#26323d');
 rect(ox+4,oy+3,1,2,c);rect(ox+4,oy+4,2,1,c);
}
// Jauge : icône pixel COLLÉE à la barre segmentée. Pas de texte (le visuel suffit).
function statGauge(px,py,pw,frac,fill,iconFn){
 frac=Math.max(0,Math.min(1,frac));
 // icône centrée verticalement sur la barre (barre = 6px de haut à py, icône = 10px) → py-2
 iconFn(px,py-2);
 let bx=px+11,bw=pw-11;            // barre collée juste après l'icône (icône ~10px de large)
 rect(bx-1,py-1,bw+2,8,'#0c140d');
 rect(bx,py,Math.round(bw*frac),6,fill);
 rect(bx,py,Math.round(bw*frac),2,'rgba(255,255,255,.32)');
 for(let i=1;i<4;i++)rect(bx+Math.round(bw*i/4),py-1,1,8,'rgba(12,20,13,.7)');
}
// Panneau « fiche RPG » UNIFIÉ : nom + score, VIE/SOUFFLE/DASH, puis chrono.
function drawVitalBars(){
 let px=12,py=12,pw=148,ph=18+3*13+13+8;
 // cadre RPG (double bordure façon HUD du jeu)
 rect(px-4,py-4,pw+8,ph,'#101b12');
 rect(px-2,py-2,pw+4,ph-4,'rgba(35,55,39,.94)');
 rect(px-2,py-2,pw+4,3,'rgba(255,255,255,.10)');
 // EN-TÊTE : nom de l'aventurier (gauche) + score avec pièce (droite)
 let nm=(getProfile().name||'AVENTURIER').toUpperCase();
 pxText(nm.slice(0,11),px+2,py+5,'#ffe35b','left',6);
 let coinX=px+pw-2;iconCoin(coinX-10,py-2);
 pxText(score.toString(),coinX-12,py+5,'#fff3bd','right',6);
 rect(px-2,py+9,pw+4,1,'rgba(16,27,18,.6)');
 let y=py+18;
 // VIE — barre ROUGE + cœur (aucun texte)
 let hpFrac=maxHp>0?hp/maxHp:0;
 statGauge(px+2,y,pw-6,hpFrac,'#e8332e',iconHeart);y+=13;
 // SOUFFLE — bulles d'air
 let sFrac=player?player.swim:1,sc=sFrac<.3?'#ff6b5e':'#6ed2ff';
 statGauge(px+2,y,pw-6,sFrac,sc,iconBubbles);y+=13;
 // DASH — touche shift (la barre se remplit quand le dash recharge)
 let dReady=player&&player.dashCd<=0,dFrac=player?(1-Math.max(0,player.dashCd)/perkDashCd):1;
 statGauge(px+2,y,pw-6,dFrac,dReady?'#bdeaff':'#5a7e92',iconShift);y+=13;
 // CHRONO — horloge + temps restant (rouge sous 30 s, clignote sous 10 s)
 let secs=Math.max(0,time),urgent=secs<=30,crit=secs<=10;
 let tcol=crit?(Math.floor(performance.now()/300)%2?'#ff3b30':'#ffd24a'):(urgent?'#ff8a5e':'#cfe0ef');
 iconClock(px+2,y-1,urgent);
 let tmm=Math.floor(secs/60).toString().padStart(2,'0'),tss=Math.floor(secs%60).toString().padStart(2,'0');
 pxText(tmm+':'+tss,px+15,y+6,tcol,'left',7);
 pxText('ARTEFACTS '+collected+'/4',px+pw-4,y+6,'#ffe35b','right',6);
}
function drawHudOverlay(){if(state!=='play'||!map.length||!player)return;
 if(isRuins){
  // HUD Ruines : clés en main + portes restantes + dalles + objectif de salle
  let doorsLeft=doors.filter(d=>!d.open).length,platesOn=plates.filter(p=>p.on).length;
  pxText('CLÉS '+keysHeld,14,H-46,'#ffe35b','left',8);
  pxText('PORTES '+doorsLeft,14,H-32,'#ffd24a','left',8);
  if(plates.length)pxText('DALLES '+platesOn+'/'+plates.length,14,H-18,'#9af0ff','left',8);
  // bandeau d'objectif de la salle courante
  let goal=roomGoal(curRoom);if(goal)pxText(goal,W/2,28,'#ffe35b','center',8);
  pxText(treasure&&treasure.taken?'GARDIEN !':'TRÉSOR : '+collected+'/4',W/2,44,treasure&&treasure.taken?'#ff8a5e':'#cdd6c4','center',7);
  // FLÈCHE-GUIDE Ruines : pointe vers la sortie à suivre pour ne JAMAIS être perdu.
  // Cible = la porte la plus proche encore pertinente (ouverte → on la franchit ; verrouillée →
  // c'est l'objectif), sinon le trésor. Affichée seulement si la cible est hors champ.
  if(!boss.active){
   let target=null,col='#ffd24a',label='';
   // porte praticable de la salle courante (priorité aux portes ouvertes = chemin déjà débloqué)
   let roomDoors=doors.filter(d=>curRoom&&d.room===curRoom.id);
   let openD=roomDoors.filter(d=>d.open),lockedD=roomDoors.filter(d=>!d.open);
   if(openD.length){let best=null,bd=1e9;openD.forEach(d=>{let dd=Math.hypot(d.x-player.x,d.y-player.y);if(dd<bd){bd=dd;best=d}});target=best;col='#8fe6a0';label='SUIS LE CHEMIN'}
   else if(lockedD.length){let best=null,bd=1e9;lockedD.forEach(d=>{let dd=Math.hypot(d.x-player.x,d.y-player.y);if(dd<bd){bd=dd;best=d}});target=best;col='#ffd24a';label='PORTE'}
   else if(treasure&&!treasure.taken){target={x:treasure.x,y:treasure.y};col='#ffe35b';label='TRÉSOR'}
   if(target){let tx=(target.x+.5)*T,ty=(target.y+.5)*T,px=player.x*T,py=player.y*T,dx=tx-px,dy=ty-py,d=Math.hypot(dx,dy);
    if(d>T*4){let a=Math.atan2(dy,dx),ax=W/2+Math.cos(a)*120,ay=H/2-30+Math.sin(a)*70;
     X.save();X.globalAlpha=.85;X.translate(ax,ay);X.rotate(a);rect(-6,-3,9,6,col);X.beginPath();X.moveTo(3,-7);X.lineTo(12,0);X.lineTo(3,7);X.closePath();X.fillStyle=col;X.fill();X.restore();X.globalAlpha=1;
     pxText(label,W/2,60,col,'center',7)}}
  }
  // panneau RPG (vie + souffle + dash) en haut-gauche
  drawVitalBars();
  return;
 }
 // Barre de progression des artefacts (4 segments) en bas au centre
 let segW=26,gap=6,totalW=4*segW+3*gap,bx=Math.round(W/2-totalW/2),by=H-20;
 rect(bx-4,by-4,totalW+8,16,'rgba(16,27,18,.6)');
 for(let i=0;i<4;i++){let on=i<collected;rect(bx+i*(segW+gap),by,segW,8,on?'#ffe35b':'#3a4a32');if(on)rect(bx+i*(segW+gap)+2,by+2,segW-4,2,'#fff7a1')}
 // Flèche-guide : indique D'ABORD l'urne (artefact) la plus proche encore à trouver,
 // puis bascule vers le TEMPLE (sortie) une fois les 4 artefacts récupérés.
 let remaining=artifacts.filter(a=>!a.taken),target=null,label='',col='#ffd24a';
 if(remaining.length){
  // urne non prise la plus proche du joueur
  let best=null,bd=1e9;remaining.forEach(a=>{let d=Math.hypot(a.x-player.x,a.y-player.y);if(d<bd){bd=d;best=a}});
  target=best;label='URNE';col='#ffd24a';
 }else if(exit){target=exit;label=exit.open?'TEMPLE OUVERT':'TEMPLE';col=exit.open?'#8fe6a0':'#ffd24a'}
 if(target){let tx=(target.x+.5)*T,ty=(target.y+.5)*T,px=player.x*T,py=player.y*T,dx=tx-px,dy=ty-py,d=Math.hypot(dx,dy);
  if(d>T*3){let a=Math.atan2(dy,dx),mx=Math.cos(a),my=Math.sin(a),ax=W/2+mx*120,ay=H/2-46+my*70;
   X.save();X.translate(ax,ay);X.rotate(a);rect(-6,-3,9,6,col);X.beginPath();X.moveTo(3,-7);X.lineTo(12,0);X.lineTo(3,7);X.closePath();X.fillStyle=col;X.fill();X.restore();
   pxText(label,W/2,38,col,'center',7)}}
 // Icônes power-ups actifs (bouclier / temps)
 let ix=14,iy=H-44;if(shield>0){rect(ix,iy,16,16,'#2f7fb0');rect(ix+3,iy+3,10,10,'#6ed2ff');rect(ix+6,iy+6,4,4,'#e8fbff');pxText(Math.ceil(shield)+'',ix+8,iy+27,'#bdeaff','center',6);ix+=24}
 if(trapReveal>0){rect(ix,iy,16,16,'#7a3a3a');rect(ix+2,iy+2,12,12,'#1a0d0d');X.strokeStyle='#ff7a7a';X.lineWidth=2;X.beginPath();X.arc(ix+8,iy+8,5,0,Math.PI*2);X.stroke();rect(ix+7,iy+7,2,2,'#ffcaca');pxText(Math.ceil(trapReveal)+'',ix+8,iy+27,'#ff9a9a','center',6);ix+=24}
 if(player&&player.swiftT>0){rect(ix,iy,16,16,'#5a3a8a');rect(ix+6,iy+2,4,7,'#caa6ff');rect(ix+4,iy+8,8,2,'#caa6ff');rect(ix+6,iy+9,4,5,'#e3d2ff');pxText(Math.ceil(player.swiftT)+'',ix+8,iy+27,'#caa6ff','center',6);ix+=24}
 // Panneau RPG (vie + souffle + dash) en haut-gauche.
 drawVitalBars();
 // Enlisement : barre de progression d'échappée + alerte
 if(sinkIn){let gx=W/2-60,gy=H/2+30;rect(gx-3,gy-3,126,16,'rgba(16,27,18,.7)');rect(gx,gy,Math.round(120*sinkIn.esc),10,'#8fe6a0');rect(gx,gy,120,10,'rgba(255,255,255,0)');X.strokeStyle='#e8c46a';X.lineWidth=2;X.strokeRect(gx-3,gy-3,126,16);X.lineWidth=4;pxText('SPAM ESPACE !',W/2,gy-8,'#ffe35b','center',8)}
 if(player.drown>0){X.fillStyle='rgba(20,60,90,'+Math.min(.5,player.drown*.5)+')';X.fillRect(0,0,W,H);pxText('NOYADE…',W/2,H/2,'#cfeefb','center',10)}
}
// Wrapper d'effets : K.O. (bascule + fondu) et étoiles d'étourdissement, sans toucher au rendu interne.
function drawAnimalFx(a){let x=a.x*T,y=a.y*T;
 if(a.dead){let k=Math.max(0,a.deadT/.5);X.save();X.globalAlpha=k;X.translate(x,y);X.rotate((1-k)*1.4*((a.vx<0?-1:1)||1));X.translate(-x,-y);drawAnimal(a);X.restore();X.globalAlpha=1;return}
 drawAnimal(a);
 if(a.stun>0){// petites étoiles jaunes tournant au-dessus de la tête
  let t=performance.now()*.012;for(let i=0;i<3;i++){let ang=t*1.8+i*2.1,sx=x+Math.cos(ang)*7,sy=y-15+Math.sin(ang)*2.5;rect(sx-1,sy,2,2,'#ffe35b');rect(sx,sy-1,1,1,'#fff');rect(sx,sy+2,1,1,'#fff')}}}
function drawAnimal(a){let alert=a.alert&&!a.stun&&!a.dead,t=performance.now()*(alert?.022:.012)+a.phase,x=a.x*T,y=a.y*T,b=Math.round(Math.sin(t)*(alert?3:2)),flip=a.vx<0?-1:1;
 // ÉTOURDI : tremblement horizontal (le wrapper gère save/restore + étoiles).
 let sh=a.stun>0?Math.round(Math.sin(performance.now()*.05)*1.5):0;x+=sh;
 // EN ALERTE (prédateur qui charge) : se rue vers sa cible (petit bond) + crocs rouges, bave/halo de menace.
 if(alert){let v=Math.hypot(a.vx,a.vy)||1;x+=Math.round(a.vx/v*Math.abs(Math.sin(t*1.4))*3);y-=Math.round(Math.abs(Math.sin(t*2))*2);
  if(Math.floor(t*3)%2){rect(x+8*flip-2,y-2+b,2,2,'#ff3b2f')}}
 rect(x-11,y+7,22,4,'rgba(20,30,10,.24)');if(a.type==='spider'){let leg=Math.round(Math.sin(t*3)*2);rect(x-6,y-3+b,12,8,'#2a2230');rect(x-4,y-7+b,8,6,'#3a3040');rect(x-3,y-6+b,2,2,'#ff5b5b');rect(x+1,y-6+b,2,2,'#ff5b5b');for(let i=0;i<3;i++){rect(x-6-leg-i,y-2+b+i*3,4,1,'#1a141f');rect(x+2+leg+i,y-2+b+i*3,4,1,'#1a141f')}return}if(['crab','scorpion'].includes(a.type)){rect(x-8,y-2+b,16,10,a.type==='crab'?'#e36b3f':'#8a6338');rect(x-13,y-5+b,6,5,'#b65335');rect(x+7,y-5+b,6,5,'#b65335');for(let i=0;i<3;i++){rect(x-12+i*5,y+7+b,5,2,'#543a2d');rect(x+7+i*3,y+7+b,5,2,'#543a2d')}return}
 // Singe (jungle) : corps brun, face claire, queue enroulée, se balance.
 if(a.type==='monkey'){let sw=Math.round(Math.sin(t*1.6)*2);rect(x-7,y-4+b,14,13,'#6f4a31');rect(x+4*flip-5,y-11+b,10,9,'#5c3c27');rect(x+4*flip-3,y-9+b,6,5,'#c79b6e');rect(x+5*flip-2,y-8+b,2,2,'#1a120b');rect(x+8*flip-2,y-8+b,2,2,'#1a120b');rect(x-10,y+1+b,4,3,'#5c3c27');rect(x-13+sw,y-1+b,4,7,'#5c3c27');rect(x-6,y+8+b,3,5,'#5c3c27');rect(x+3,y+8+b,3,5,'#5c3c27');return}
 // Toucan (jungle) : corps noir, ventre blanc, gros bec orange.
 if(a.type==='toucan'){let wing=Math.round(Math.sin(t*2.4)*4);rect(x-5,y-9+b,10,16,'#1d1a22');rect(x-3,y-2+b,7,7,'#f2f2ee');rect(x-8-wing,y-6+b,7+wing,5,'#1d1a22');rect(x-2,y-12+b,6,6,'#1d1a22');rect(x+2,y-11+b,11,4,'#f08a1e');rect(x+2,y-7+b,9,3,'#d3641a');rect(x-1,y-11+b,2,2,'#fff');rect(x-1,y-10+b,1,1,'#111');return}
 // Jaguar (jungle, prédateur) : fauve à rosettes, posture basse.
 if(a.type==='jaguar'){rect(x-12,y-3+b,22,11,'#d9a23f');rect(x+6*flip-5,y-8+b,11,10,'#d9a23f');rect(x+9*flip-3,y-11+b,3,5,'#caa05b');rect(x+3*flip-3,y-11+b,3,5,'#caa05b');rect(x+10*flip-2,y-5+b,2,2,'#1a120b');rect(x-15*flip,y-1+b,7,4,'#d9a23f');for(let i=0;i<4;i++)rect(x-9+i*5,y-1+b,2,2,'#3a2412');rect(x-7,y+8+b,3,4,'#b8862f');rect(x+4,y+8+b,3,4,'#b8862f');return}
 // Fennec (désert) : petit renard pâle à très grandes oreilles.
 if(a.type==='fennec'){rect(x-8,y-3+b,15,11,'#e8d2a6');rect(x+5*flip-4,y-8+b,9,9,'#e8d2a6');rect(x+8*flip-2,y-15+b,3,8,'#dcc290');rect(x+2*flip-2,y-15+b,3,8,'#dcc290');rect(x+8*flip-1,y-13+b,1,5,'#c79b6e');rect(x+2*flip-1,y-13+b,1,5,'#c79b6e');rect(x+9*flip-2,y-5+b,2,2,'#1a120b');rect(x-11*flip,y-2+b,7,4,'#f2e2c0');rect(x-6,y+7+b,3,4,'#d8bc8a');rect(x+3,y+7+b,3,4,'#d8bc8a');return}
 // Crotale (désert) : serpent enroulé avec hochet au bout de la queue.
 if(a.type==='rattlesnake'){for(let i=0;i<3;i++){let rr=9-i*2;rect(x-rr,y-rr+b+3,rr*2,rr*2-3,i%2?'#c7a24a':'#b5923f')}rect(x-9,y+b,18,7,'#b5923f');rect(x-7,y+1+b,14,4,'#d9b860');rect(x+6,y-4+b,8,7,'#c7a24a');rect(x+11,y-2+b,1,1,'#1a120b');if(Math.sin(t*.8)>.4){rect(x+14,y+b,5,1,'#ef5b42')}rect(x-12,y-3+b,3,3,'#8a6f2e');rect(x-14,y-4+b,2,2,'#a8884a');return}if(['turtle','lizard'].includes(a.type)){rect(x-11,y-4+b,18,13,a.type==='turtle'?'#658f47':'#b18c42');rect(x-7,y-7+b,12,13,a.type==='turtle'?'#8ab05b':'#d2ae58');rect(x+7,y-2+b,7,6,'#557f43');rect(x-15,y+b,6,3,'#557f43');return}if(['hare','fox','wolf'].includes(a.type)){let c=a.type==='hare'?'#d9e5df':a.type==='fox'?'#ce6a38':'#68747a';rect(x-10,y-5+b,18,14,c);rect(x+5*flip-5,y-10+b,11,11,c);rect(x+8*flip-3,y-15+b,3,7,c);rect(x+2*flip-3,y-15+b,3,7,c);rect(x+10*flip-2,y-6+b,2,2,'#111');rect(x-13*flip,y-5+b,8,5,c);return}if(['owl','vulture'].includes(a.type)){let wing=Math.round(Math.sin(t*2)*5),c=a.type==='owl'?'#8b7358':'#5f4d3c';rect(x-5,y-10+b,11,17,c);rect(x-3,y-15+b,8,9,a.type==='owl'?'#c4a777':'#b55c43');rect(x-10-wing,y-7+b,8+wing,6,c);rect(x+5,y-7+b,7+wing,6,c);rect(x-2,y-12+b,2,2,'#111');rect(x+3,y-12+b,2,2,'#111');return}if(a.type==='camel'){rect(x-12,y-7+b,20,16,'#c79858');rect(x-7,y-13+b,9,9,'#d3aa68');rect(x+6,y-13+b,7,15,'#c79858');rect(x+9,y-16+b,8,8,'#d3aa68');rect(x+13,y-14+b,2,2,'#111');return}if(a.type==='capybara'){rect(x-10,y-5+b,18,14,'#9b693f');rect(x+5*flip-4,y-9+b,10,10,'#b87b48');rect(x+8*flip-2,y-10+b,3,4,'#6f452e');rect(x+9*flip-1,y-5+b,2,2,'#171411');rect(x-7,y+7+b,4,6,'#69452f');rect(x+3,y+7+b,4,6,'#69452f')}else if(a.type==='frog'){let jump=Math.max(0,Math.sin(t*1.4))*5;rect(x-9,y+3-jump,18,8,'#4b8d3e');rect(x-7,y-2-jump,14,9,'#68b34c');rect(x-6,y-4-jump,4,4,'#b5df68');rect(x+2,y-4-jump,4,4,'#b5df68')}else if(a.type==='parrot'){let wing=Math.round(Math.sin(t*2)*5);rect(x-4,y-10+b,9,15,'#e85035');rect(x-2,y-14+b,8,8,'#f1cb3e');rect(x-8-wing,y-7+b,7+wing,5,'#319a72');rect(x+5,y-7+b,6+wing,5,'#267ab0')}else{rect(x-12,y-6+b,21,16,'#3a261b');rect(x-11,y-5+b,19,14,'#6f4937');rect(x-9,y-4+b,15,4,'#84543c');rect(x+5*flip-6,y-9+b,13,12,'#83533c');rect(x+5*flip-5,y-8+b,11,10,'#6f4937');rect(x+9*flip-2,y-5+b,2,2,'#ffce5a');rect(x+11*flip-3,y-1+b,5,4,'#b68b69');rect(x+12*flip-3,y+1+b,4,2,'#fff0d8');rect(x+11*flip-4,y+3+b,2,3,'#e8dcc0');rect(x-9,y+8+b,3,4,'#3a261b');rect(x+3,y+8+b,3,4,'#3a261b')}}
function drawSnake(s){let x=s.x*T,y=s.y*T,t=performance.now()*.014+s.phase;
 // TUÉ : le serpent se fige, fond et bascule (anim de mort).
 if(s.dead){let k=Math.max(0,s.deadT/.5);X.save();X.globalAlpha=k;X.translate(x,y);X.rotate((1-k)*1.2);X.translate(-x,-y);t=s.phase;}
 if(!s.dead&&s.stun>0&&Math.floor(s.stun*8)%2)return;rect(x-12,y+7,25,4,'rgba(20,30,10,.28)');for(let i=0;i<6;i++){let yy=y+Math.round(Math.sin(t+i*.8)*4);rect(x-13+i*4,yy-3,7,7,i%2?'#68a82f':'#8bc53d');rect(x-11+i*4,yy-2,3,2,'#b6dd58')}let hy=y+Math.round(Math.sin(t+5)*3);rect(x+8,hy-5,10,10,'#8dcc3b');rect(x+11,hy-3,3,2,'#d9e451');rect(x+15,hy-2,1,1,'#111');if(Math.sin(t*.7)>.55){rect(x+18,hy,6,1,'#ef5b42');rect(x+23,hy-1,2,1,'#ef5b42');rect(x+23,hy+1,2,1,'#ef5b42')}if(s.dead){X.restore();X.globalAlpha=1}}
function drawPlayer(){
 let x=player.x*T,y=player.y*T,speed=Math.hypot(player.vx,player.vy),moving=speed>.25,running=speed>4.6,
 frame=moving?Math.floor(performance.now()/(running?72:105))%4:0,bob=moving?(frame%2?(running?3:2):0):0,
 step=(running?[-5,0,5,0]:[-3,0,3,0])[frame],arm=whip>0?4:Math.round(step*.35),ch=activeLook(getProfile().base),
 back=player.dir===0||player.dir===1||player.dir===7,side=player.dir===2||player.dir===6,right=player.dir===1||player.dir===2||player.dir===3;
 let ch2=ch,cstyle=charStyle(selectedCharacter); // silhouette de rendu (0-3) réutilisée par les 10 persos
 // DASH : traînée d'images-fantômes derrière le héros (effet de vitesse) + petites étincelles.
 if(player.dash>0){let k=player.dash/.22,vn=Math.hypot(player.vx,player.vy)||1,bx=player.vx/vn,by=player.vy/vn;
  X.save();for(let i=1;i<=3;i++){X.globalAlpha=.22*k*(1-i*.22);let gx=x-bx*i*6,gy=y-by*i*6;rect(gx-6,gy-18,12,20,ch.shirt)}X.restore();X.globalAlpha=1;
  // petites étincelles bleutées dans le sillage
  for(let i=0;i<2;i++){let gx=x-bx*(8+i*5)+(Math.random()-.5)*6,gy=y-by*(8+i*5)+(Math.random()-.5)*6;rect(gx,gy,2,2,'#bdeaff')}}
 // Aura de combo : halo doré pulsant quand le combo est élevé (effet visible de maîtrise)
 if(comboAura>0){let tn=performance.now()*.006,lvl=Math.min(combo-2,4),rr=15+lvl*1.5;X.save();X.globalAlpha=comboAura*(.45+Math.sin(tn*2)*.15);X.strokeStyle=combo>=5?'#ffb13b':'#ffe35b';X.lineWidth=2;X.beginPath();X.arc(x,y,rr+Math.sin(tn*3)*1.5,0,Math.PI*2);X.stroke();for(let i=0;i<6+lvl;i++){let a=tn+i*Math.PI*2/(6+lvl);rect(x+Math.cos(a)*rr-1,y+Math.sin(a)*rr-1,2,2,combo>=5?'#ffd98a':'#fff2a8')}X.restore()}
 // Célérité : traînée violette derrière le héros
 if(player.swiftT>0){let m=Math.hypot(player.vx,player.vy)||1;X.save();X.globalAlpha=.5;for(let i=1;i<=3;i++)rect(x-player.vx/m*i*4-1,y-player.vy/m*i*4,3,3,'#caa6ff');X.restore()}
 // Enlisement : le héros s'enfonce dans le sable (tronqué vers le bas) + remous
 if(sinkIn){let d=sinkIn.depth,off=Math.round(d*14),sh=Math.round(Math.sin(performance.now()*.04)*1);rect(x-13,y+5,26,7,'#a98a4e');X.save();X.beginPath();X.rect(x-12,y-18,24,20-off);X.clip();rect(x-9+sh,y-16,18,16,ch2.hat);rect(x-7+sh,y-3,14,14,ch2.shirt);rect(x-2+sh,y-13,5,5,ch2.skin);X.restore();for(let i=0;i<6;i++){let a=i/6*Math.PI*2+performance.now()*.006;rect(x+Math.cos(a)*(8+d*3)-1,y+6+Math.sin(a)*3,3,2,'#cbb06a')}rect(x-13,y+9,26,4,'#8f7440');return}
 // Noyade : le héros plonge sous la surface (flaque bleue), gigote puis sombre
 if(player.drown>0){let tnow=performance.now()*.001,s=Math.min(1,player.drown/1.2),sink=Math.round(s*s*22),wob=Math.round(Math.sin(tnow*9)*2),wc1=currentTheme.water[1]||'#66d3e9',wc0=currentTheme.water[0]||'#238bc4';
  // flaque d'eau autour
  for(let i=0;i<3;i++){let r=10+i*4+Math.sin(tnow*4+i)*1;X.globalAlpha=.45-i*.1;X.fillStyle=i?wc0:wc1;X.beginPath();X.ellipse(x,y+8,r,r*.42,0,0,Math.PI*2);X.fill()}X.globalAlpha=1;
  // le héros coule : seul le haut du corps dépasse au début, puis disparaît
  X.save();X.beginPath();X.rect(x-13,y-26,26,30+8);X.clip();
  let body=1-s*.7;X.globalAlpha=body;
  rect(x-8+wob,y-6+sink,16,14,ch2.shirt);
  rect(x-12+wob,y-8+sink,5,12,ch2.skin);rect(x+7+wob,y-8+sink,5,12,ch2.skin);// bras qui s'agitent
  rect(x-7+wob,y-17+sink,14,12,ch2.hat);rect(x-2+wob,y-14+sink,5,5,ch2.skin);
  X.restore();X.globalAlpha=1;
  // ligne de flottaison qui ondule
  for(let xx=-12;xx<12;xx+=4){let yy=y+6+Math.round(Math.sin(tnow*8+xx*.5)*1.5);rect(x+xx,yy,4,2,wc1)}
  // bulles qui remontent
  for(let i=0;i<5;i++){let b=(player.drown*1.4+i*.22)%1;X.globalAlpha=Math.max(0,1-b);rect(x-7+i*3+Math.round(Math.sin(b*9+i)*2),y+4-b*22,2+(i%2),2+(i%2),'#dff6fb');rect(x-7+i*3,y+4-b*22,1,1,'#fff')}X.globalAlpha=1;return}
 if(inv>0&&Math.floor(inv*12)%2)return;
 // Nage en surface : seule la tête dépasse, plongée dans une flaque d'eau bleue
 if(isWater(player.x,player.y)&&player.drown<=0){let tnow=performance.now()*.001,wob=Math.round(Math.sin(tnow*7+player.x)*1.5),wc1=currentTheme.water[1]||'#66d3e9',wc0=currentTheme.water[0]||'#238bc4';
  // flaque d'eau (sous la tête)
  for(let i=0;i<3;i++){let r=11+i*4+Math.sin(tnow*4+i)*1;X.globalAlpha=.5-i*.12;X.fillStyle=i?wc0:wc1;X.beginPath();X.ellipse(x,y+9,r,r*.4,0,0,Math.PI*2);X.fill()}X.globalAlpha=1;
  // sillage de brasses (devant/derrière selon la vitesse)
  let m=Math.hypot(player.vx,player.vy)||1;X.globalAlpha=.55;for(let i=1;i<=3;i++)rect(x-player.vx/m*i*5-2,y+9-player.vy/m*i*5,3,2,'#dff6fb');X.globalAlpha=1;
  // la tête qui émerge (chapeau + visage), légère oscillation
  let hy=y-4+wob;rect(x-7,hy,14,9,back?ch2.hat:ch2.skin);
  if(cstyle===1){rect(x-8,hy-1,16,4,'#30221e');rect(x+(right?5:-8),hy+2,4,7,'#30221e')}
  else if(cstyle===2){rect(x-7,hy,14,3,'#3d6685');rect(x-6,hy+3,5,3,'#bce8ed');rect(x+2,hy+3,5,3,'#bce8ed')}
  else{rect(x-8,hy-1,16,3,ch2.hat);rect(x-11,hy,3,4,ch2.hat);rect(x+8,hy,3,4,ch2.hat)}
  if(!back){let eyeX=side?(right?4:-4):0;rect(x+eyeX-1,hy+3,2,2,'#171515');if(!side)rect(x+3,hy+3,2,2,'#171515')}
  // ondulations concentriques
  X.globalAlpha=.4;for(let i=0;i<2;i++){let r=8+((tnow*.6+i*.5)%1)*10;X.strokeStyle=wc1;X.lineWidth=1;X.beginPath();X.ellipse(x,y+9,r,r*.4,0,0,Math.PI*2);X.stroke()}X.globalAlpha=1;X.lineWidth=4;
  // petites bulles si on est sur le point de plonger (souffle bas)
  if(player.swim<.4){for(let i=0;i<3;i++){let b=(tnow*1.5+i*.33)%1;X.globalAlpha=Math.max(0,1-b)*.8;rect(x-5+i*4,y+4-b*14,2,2,'#dff6fb')}X.globalAlpha=1}
  if(whip>0)drawPixelWhip(x,hy+4);return}
 if(shield>0){let p=Math.sin(performance.now()*.008)*2;X.strokeStyle='rgba(110,210,255,'+(.5+Math.sin(performance.now()*.01)*.2)+')';X.lineWidth=2;X.beginPath();X.arc(x,y,17+p,0,Math.PI*2);X.stroke();for(let i=0;i<6;i++){let a=performance.now()*.003+i*Math.PI/3;rect(x+Math.cos(a)*16-1,y+Math.sin(a)*16-1,2,2,'#bdeaff')}}
 // ── GLISSADE SUR LA GLACE : le héros reste DEBOUT mais PENCHÉ dans le sens de la glisse,
 // genoux fléchis, pieds joints qui patinent, bras d'équilibre tendu derrière. Lisible, dynamique
 // (plus de pose couchée « goofy »). Trace de patinage nette + gerbe de glace + lignes de vitesse.
 if(player.sliding>.2){
  let vx=player.vx,vy=player.vy,m=Math.hypot(vx,vy)||1,ux=vx/m;
  let fa=ux>=0?1:-1;                                    // sens de la glisse (droite/gauche)
  let sk=player.sliding;
  let lean=Math.round(fa*4*sk);                         // inclinaison du corps vers l'avant
  let pantsC=ch.pantsColor||'#3b302c',shoeC=ch.shoeColor||'#18191a',topC=ch.topColor||ch.shirt;
  let tn=performance.now();
  // ── traînée de patinage au sol (derrière) + lignes de vitesse ──
  X.globalAlpha=Math.min(.6,sk*.6);
  for(let i=1;i<=6;i++){let tx=x-fa*(7+i*6),tw=Math.max(3,10-i);rect(tx,y+12,tw,2,i<3?'#eef9fc':'#cfe6ee')}
  X.globalAlpha=1;
  // gerbe de glace projetée derrière les pieds (animée)
  for(let i=0;i<6;i++){let ph=((tn*.006)+i*1.13)%1,sp=6+ph*16;let cxp=x-fa*sp,cyp=y+12-ph*10;X.globalAlpha=Math.max(0,1-ph)*sk;rect(cxp-1,cyp,2,2,i%2?'#ffffff':'#bfe4ef')}
  X.globalAlpha=1;
  // ombre au sol (étirée dans le sens de la glisse)
  X.globalAlpha=.3;rect(x-12+fa*4,y+12,22,4,'#142028');X.globalAlpha=1;
  // ── JAMBES : pieds joints qui patinent, genoux fléchis (plus bas que la normale) ──
  rect(x-7+lean,y+4,6,8,pantsC);rect(x+1+lean,y+5,6,7,pantsC); // cuisses fléchies (l'avant plus bas)
  // patins/chaussures glissant
  if(ch.shoes==='sandals'){rect(x-8+lean,y+12,7,3,shoeC);rect(x+1+lean,y+12,8,3,shoeC)}
  else{rect(x-8+lean,y+11,8,4,shoeC);rect(x+lean,y+11,9,4,shoeC);rect(x-8+lean,y+11,8,1,shade(shoeC,.3))}
  // ── TRONC penché vers l'avant ──
  rect(x-9+lean,y-9,18,15,'#382a25');                   // contour
  rect(x-7+lean,y-8,14,13,topC);                        // haut
  // détail haut (maillot CDM / veste) repris simplement
  if(ch.top==='jersey'&&ch.topCdm){let cd=ch.topCdm;rect(x-7+lean,y-8,3,13,cd.a);rect(x+4+lean,y-8,3,13,cd.a);rect(x-5+lean,y-8,9,2,cd.b)}
  else rect(x-1+lean,y-7,2,12,shade(topC,-.2));
  rect(x-7+lean,y+2,14,3,cstyle===2?'#7b9ba2':'#684325'); // ceinture
  // ── BRAS : avant tendu vers la glisse (équilibre), arrière relevé ──
  rect(x+fa*5+lean,y-6,7,4,ch.skin);                    // bras avant tendu
  rect(x+fa*10+lean,y-7,4,4,ch.skin);                   // main avant
  rect(x-fa*7+lean,y-9,5,4,ch.skin);                    // bras arrière relevé (équilibre)
  // ── TÊTE penchée dans le sens de la glisse ──
  let hx=x+lean+fa*2;
  rect(hx-6,y-19,13,11,back?ch.hat:ch.skin);            // tête
  // coiffe selon style
  if(cstyle===1){rect(hx-7,y-20,15,4,'#30221e');rect(hx+fa*6,y-18,5,3,'#30221e')} // casquette + visière
  else if(cstyle===2){rect(hx-6,y-20,13,3,'#3d6685');rect(hx-5,y-17,4,3,'#bce8ed')} // bonnet/lunettes
  else{rect(hx-7,y-20,15,3,ch.hat);rect(hx+fa*6,y-19,4,3,ch.hat)}
  // œil orienté dans le sens de la glisse
  if(!back)rect(hx+fa*3,y-15,2,2,'#171515');
  if(whip>0)drawPixelWhip(hx,y-12);
  if(isRuins&&whip<=0)drawHeldTorch(hx,y-12,fa>0);
  return;
 }
 // ── CORPS STANDARD : rendu d'origine des 10 PERSOS (silhouettes/accessoires par cstyle 0-3),
 // avec customisation par-dessus (couleurs/coiffe/tenue) ET animation CONTINUE (phase sinusoïdale).
 drawHeroBody(x,y,ch,cstyle,{walking:moving,running:running,back:back,side:side,right:right,whip:whip>0});
 if(whip>0)drawPixelWhip(x,y);
 // TORCHE TENUE EN MAIN (Ruines) : manche + flamme animée multi-fréquence dans la main avant.
 if(isRuins&&whip<=0)drawHeldTorch(x,y+(moving?2:0),right);
}
// ── RENDU DU CORPS DU HÉROS (réutilisé in-game ET dans l'aperçu PERSONNAGE pour parité parfaite).
// (x,y)=centre du torse. ch=look résolu (couleurs/tenue), cstyle=silhouette (0-3). a=état d'animation.
// Animation CONTINUE : phase sinusoïdale → balancement des jambes en opposition, lever de pied,
// balancement des bras opposé aux jambes, oscillation verticale (bob), respiration au repos.
function drawHeroBody(x,y,ch,cstyle,a){
 let back=a.back,side=a.side,right=a.right,moving=a.walking,running=a.running;
 let R=a.put||rect; // backend de dessin (in-game = rect global sur X, aperçu = put sur canvas dédié)
 let now=(a.phase!=null)?a.phase:performance.now();
 // cadence du cycle : course plus rapide. amp = amplitude des mouvements.
 let cad=running?.020:.013, ph=moving?now*cad:0, amp=running?1.45:1;
 // jambe avant/arrière en OPPOSITION (sinus déphasé de π) → pas alternés fluides.
 let swF=moving?Math.round(Math.sin(ph)*(running?5:3)*amp):0;   // jambe « avant » (droite)
 let swB=moving?Math.round(Math.sin(ph+Math.PI)*(running?5:3)*amp):0; // jambe « arrière » (gauche)
 let liftF=moving?Math.max(0,Math.round(Math.sin(ph)*2*amp)):0;       // lever du pied avant
 let liftB=moving?Math.max(0,Math.round(Math.sin(ph+Math.PI)*2*amp)):0;// lever du pied arrière
 // BOB : 2 rebonds par cycle de marche (montée au passage de chaque pied). Respiration au repos.
 let bob=moving?-Math.round(Math.abs(Math.sin(ph))*(running?3:2)):Math.round(Math.sin(now*.003)*1-.5);
 // BRAS opposés aux jambes (le bras avance quand la jambe opposée avance).
 let arm=a.whip?4:(moving?Math.round(Math.sin(ph)*2.4*amp):0);
 let step=swF; // alias rétro-compat : « step » = décalage jambe avant
 // Vêtements par FORME : pantalon (jambes), chaussures, haut (torse) + maillots CDM.
 let pantsC=ch.pantsColor||'#3b302c',shoeC=ch.shoeColor||'#18191a',topC=ch.topColor||ch.shirt;
 // defTop = le joueur n'a PAS changé de haut → on peut afficher les détails de TORSE propres au
 // perso (col/cravate/sangle de blouse/baudrier). Sinon le haut choisi prime → on masque ces
 // détails-torse pour éviter qu'ils se superposent au vêtement personnalisé (« habits qui se superposent »).
 let defTop=(ch.top==='tshirt');
 // couleurs des bordures de torse : si haut perso, on dérive du haut (cohérent) ; sinon couleur d'identité.
 let beltC=defTop?(cstyle===2?'#7b9ba2':'#684325'):shade(topC,-.3);
 let trimC=defTop?(cstyle===2?'#c3d7d5':'#d4aa55'):shade(topC,-.18);
 let cuffC=defTop?(cstyle===2?'#d9e8df':'#5a3b28'):shade(topC,-.22);
 let shortLeg=(ch.pants==='shorts');
 let legH=shortLeg?6:10,legY=shortLeg?9:5;
 R(x-11,y+11,23,5,'rgba(20,30,10,.32)');
 // jambe avant (droite) : décalée + levée ; jambe arrière (gauche) : opposée.
 R(x-8+swB,y+legY+bob-liftB,6,legH,pantsC);R(x+2+swF,y+legY+bob-liftF,6,legH,pantsC);
 if(shortLeg){R(x-8+swB,y+5+bob-liftB,6,4,shade(pantsC,-.15));R(x+2+swF,y+5+bob-liftF,6,4,shade(pantsC,-.15))}
 // chaussures (forme) — suivent la jambe correspondante
 if(ch.shoes==='sneakers'){R(x-9+swB,y+12+bob-liftB,8,4,shoeC);R(x-9+swB,y+12+bob-liftB,8,1,shade(shoeC,.3));R(x+1+swF,y+12+bob-liftF,8,4,shoeC);R(x+1+swF,y+12+bob-liftF,8,1,shade(shoeC,.3))}
 else if(ch.shoes==='sandals'){R(x-8+swB,y+13+bob-liftB,6,3,shoeC);R(x+2+swF,y+13+bob-liftF,6,3,shoeC)}
 else{R(x-9+swB,y+12+bob-liftB,8,4,shoeC);R(x+1+swF,y+12+bob-liftF,8,4,shoeC)}
 // jupe : recouvre le haut des jambes
 if(ch.pants==='skirt'){R(x-9,y+4+bob,18,7,pantsC);R(x-9,y+10+bob,18,1,shade(pantsC,-.2))}
 R(x-10,y-8+bob,20,18,'#382a25');R(x-8,y-7+bob,16,16,topC);
 // détails du HAUT selon la forme
 if(ch.top==='jersey'&&ch.topCdm){let cd=ch.topCdm;R(x-8,y-7+bob,3,16,cd.a);R(x+5,y-7+bob,3,16,cd.a);R(x-6,y-7+bob,12,2,cd.b);if(!back)R(x-2,y-2+bob,4,6,cd.b)}
 else if(ch.top==='jacket'){R(x-1,y-7+bob,2,16,shade(topC,-.25));R(x-8,y-7+bob,3,16,shade(topC,-.18));R(x+5,y-7+bob,3,16,shade(topC,-.18))}
 else if(ch.top==='hoodie'){R(x-6,y-9+bob,12,3,shade(topC,.12));if(!back)R(x-4,y+4+bob,8,4,shade(topC,-.2))}
 else if(ch.top==='tunic'){R(x-8,y+9+bob,16,3,topC);R(x-5,y-7+bob,10,2,shade(topC,.2))}
 else if(ch.top==='coat'){R(x-8,y-7+bob,16,3,shade(topC,.1));R(x-7,y-3+bob,2,2,'#46768e');R(x-7,y+1+bob,2,2,'#46768e')}
 R(x-8,y+5+bob,16,4,beltC);                              // ceinture
 if(defTop)R(x-1,y-6+bob,3,15,trimC);                    // liseré/bouton central (seulement haut d'origine)
 R(x-12-arm,y-5+bob,5,13,ch.skin);R(x+7+arm,y-5+bob,5,13,ch.skin);
 R(x-13-arm,y+5+bob,6,4,cuffC);                          // manchette (couleur du haut si perso)
 R(x+7+arm,y+5+bob,6,4,cuffC);
 R(x-7,y-16+bob,14,11,ch.skin); // tête (peau) — les cheveux/coiffe se dessinent par-dessus
 // ── CHEVEUX (forme = ch.hair, couleur = ch.hairColor) ──
 let hairC=ch.hairColor||'#3a2418',hairD=shade(hairC,-.22),hairL=shade(hairC,.16);
 let hairType=ch.hair||'short';
 let hy=y-16+bob; // haut de la tête
 // un chapeau « plein » couvre la calotte : on n'affiche alors que la frange/les côtés des cheveux.
 let coveringHat={fedora:1,cap:1,beanie:1,straw:1,helmet:1,pith:1,wizard:1,top:1,bandana:1,band:1,base:0,none:0}[ch.hatType]?true:false;
 // vu de dos, l'arrière du crâne est couvert de cheveux (sauf chauve)
 if(back&&hairType!=='bald'&&!coveringHat)R(x-7,hy,14,9,hairC);
 if(hairType!=='bald'){
  if(coveringHat){
   // sous un chapeau : juste les pattes/nuque qui dépassent
   if(!back){R(x-7,hy+3,2,5,hairC);R(x+5,hy+3,2,5,hairC)} else R(x-7,hy+1,14,5,hairC);
  }else if(hairType==='buzz'){
   R(x-7,hy-1,14,3,hairC);R(x-7,hy-1,14,1,hairL);
  }else if(hairType==='short'){
   R(x-8,hy-2,16,4,hairC);R(x-8,hy+1,2,4,hairC);R(x+6,hy+1,2,4,hairC);R(x-8,hy-2,16,1,hairL);
  }else if(hairType==='long'){
   R(x-8,hy-2,16,4,hairC);R(x-9,hy+1,3,11,hairC);R(x+6,hy+1,3,11,hairC);R(x-8,hy-2,16,1,hairL);
   if(back)R(x-7,hy+1,14,12,hairC);
  }else if(hairType==='pony'){
   R(x-8,hy-2,16,4,hairC);R(x-8,hy+1,2,4,hairC);R(x+6,hy+1,2,4,hairC);
   R(x+(right?-9:6),hy,3,9,hairC);R(x+(right?-9:6),hy+8,3,2,hairD); // queue de cheval
  }else if(hairType==='bun'){
   R(x-8,hy-2,16,4,hairC);R(x-8,hy+1,2,3,hairC);R(x+6,hy+1,2,3,hairC);
   R(x-2,hy-5,4,4,hairC);R(x-2,hy-5,4,1,hairL); // chignon au sommet
  }else if(hairType==='curly'){
   R(x-8,hy-3,4,4,hairC);R(x-4,hy-4,8,4,hairC);R(x+4,hy-3,4,4,hairC);
   R(x-9,hy+1,3,4,hairC);R(x+6,hy+1,3,4,hairC);R(x-4,hy-4,8,1,hairL);
  }else if(hairType==='mohawk'){
   R(x-1,hy-5,3,7,hairC);R(x-1,hy-5,3,1,hairL);R(x-7,hy+1,2,4,hairD);R(x+5,hy+1,2,4,hairD);
  }
 }
 // ── COIFFE / ACCESSOIRE (forme = ch.hatType, couleur = ch.hat) ──
 let hatC=ch.hat||'#5a3e23',hatD=shade(hatC,-.25),hatL=shade(hatC,.18),htype=ch.hatType||'base';
 if(htype==='base'){ /* identité du perso */
  if(cstyle===1){R(x-8,hy-1,16,5,'#30221e');R(x+(right?5:-8),hy+3,4,12,'#30221e');if(back)R(x-3,hy+8,7,8,'#30221e')}
 }
 else if(htype==='fedora'){R(x-8,hy-3,16,3,hatC);R(x-12,hy,24,3,hatC);R(x-8,hy-3,16,1,hatL)}
 else if(htype==='cap'){R(x-8,hy-3,16,4,hatC);if(!back)R(x+(right?6:-12),hy+1,6,2,hatD);R(x-8,hy-3,16,1,hatL)}
 else if(htype==='band'){R(x-8,hy+1,16,3,hatC)}
 else if(htype==='bandana'){R(x-8,hy-2,16,4,hatC);if(!side)R(x+5,hy+3,3,6,hatD)}
 else if(htype==='beanie'){R(x-8,hy-4,16,6,hatC);R(x-8,hy+1,16,2,hatL);R(x-2,hy-6,4,2,hatL)}
 else if(htype==='straw'){R(x-8,hy-2,16,3,hatC);R(x-13,hy+1,26,2,hatC);R(x-8,hy-2,16,1,shade(hatC,-.18))}
 else if(htype==='helmet'||htype==='pith'){R(x-9,hy-3,18,5,hatC);R(x-12,hy+1,24,2,hatC);R(x-9,hy-3,18,1,hatL)}
 else if(htype==='goggles'){R(x-9,hy-2,18,3,hatD);if(!back){R(x-6,hy+1,5,3,'#9adfff');R(x+1,hy+1,5,3,'#9adfff')}}
 else if(htype==='crown'){R(x-7,hy-3,14,3,hatC);R(x-6,hy-5,2,2,hatC);R(x-1,hy-6,2,3,hatC);R(x+4,hy-5,2,2,hatC);R(x-7,hy-3,14,1,hatL)}
 else if(htype==='cyber'){R(x-9,hy-2,18,3,'#1a2230');if(!back)R(x-7,hy+1,14,3,hatC)}
 else if(htype==='wizard'){R(x-8,hy-2,16,3,hatC);R(x-5,hy-7,10,5,hatC);R(x-2,hy-12,5,5,hatC);R(x-1,hy-13,3,2,'#ffe35b');R(x-8,hy-2,16,1,hatL)}
 else if(htype==='top'){R(x-9,hy,18,2,hatC);R(x-6,hy-7,12,7,hatC);R(x-6,hy-3,12,1,shade(hatC,.3))}
 else if(htype==='flower'){R(x-8,hy-2,16,2,'#3f7d57');R(x-7,hy-3,3,3,hatC);R(x-1,hy-4,3,3,'#ffe35b');R(x+4,hy-3,3,3,hatC)}
 else if(htype==='horns'){R(x-8,hy-4,3,4,hatC);R(x-9,hy-6,2,3,hatC);R(x+5,hy-4,3,4,hatC);R(x+7,hy-6,2,3,hatC)}
 else if(htype==='halo'){R(x-6,hy-6,12,2,hatC);R(x-6,hy-6,2,2,shade(hatC,-.1));R(x+4,hy-6,2,2,shade(hatC,-.1))}
 if(cstyle===0){
  // ARCHÉOLOGUE : baudrier sur le torse = VÊTEMENT (masqué si haut perso) ; sacoche latérale = accessoire (gardé).
  if(defTop&&!back){R(x-5,y-8+bob,10,3,'#74452f');R(x-3,y-6+bob,6,3,'#5e3929')} // baudrier (torse)
  R(x+(right?-11:7),y-5+bob,5,13,'#493728');R(x+(right?-12:8),y+4+bob,7,5,'#b88739'); // sacoche (côté)
 }else if(cstyle===2){
  // SCIENTIFIQUE : col + cravate de blouse = VÊTEMENT (masqués si haut perso).
  if(defTop){R(x-7,y-4+bob,14,3,'#d8e8df');R(x-1,y-3+bob,2,10,'#48758c')}                      // col + cravate (torse)
 }else if(cstyle===3){
  // sangles dorées sur le torse = VÊTEMENT (masquées si haut perso).
  if(defTop){R(x-8,y-4+bob,3,9,'#e1b35b');R(x+5,y-4+bob,3,9,'#e1b35b')}
 }
 // ── VISAGE (expression = ch.face) ──
 if(!back){
  let face=ch.face||'neutral',eyeX=side?(right?4:-4):0,ec='#171515';
  let lE=x+eyeX-1,rE=x+3,eyeY=y-12+bob; // œil gauche/droit (de profil : un seul)
  if(face==='cool'){
   // lunettes de soleil
   R(lE-1,eyeY,3,3,ec);if(!side)R(rE-1,eyeY,3,3,ec);if(!side)R(lE+1,eyeY+1,2,1,ec);
  }else if(face==='surprise'){
   R(lE,eyeY-1,2,3,ec);if(!side)R(rE,eyeY-1,2,3,ec);
   if(!side)R(x-1,y-9+bob,3,2,'#7a3328'); // bouche en O
  }else if(face==='angry'){
   R(lE,eyeY,2,2,ec);if(!side)R(rE,eyeY,2,2,ec);
   R(lE-1,eyeY-2,3,1,ec);if(!side)R(rE,eyeY-2,3,1,ec); // sourcils froncés
   if(cstyle!==2)R(x+(side?(right?3:-5):-2),y-8+bob,4,1,'#7a3328');
  }else if(face==='wink'){
   if(side){R(lE,eyeY,2,1,ec)}else{R(lE,eyeY,2,1,ec);R(rE,eyeY,2,2,ec)} // un œil fermé
   if(cstyle!==2)R(x+(side?(right?3:-5):-2),y-9+bob,4,1,'#9e5540');
  }else if(face==='happy'){
   R(lE,eyeY,2,2,ec);if(!side)R(rE,eyeY,2,2,ec);
   if(cstyle!==2){R(x+(side?(right?2:-5):-3),y-8+bob,6,1,'#9e5540');R(x+(side?(right?2:-5):-3),y-9+bob,1,1,'#9e5540');R(x+(side?(right?7:0):2),y-9+bob,1,1,'#9e5540')} // sourire
  }else{ // neutral
   R(lE,eyeY,2,2,ec);if(!side)R(rE,eyeY,2,2,ec);
   if(cstyle!==2)R(x+(side?(right?3:-5):-2),y-9+bob,4,1,'#9e5540');
  }
  // lunettes du scientifique (par-dessus, accessoire d'identité) sauf si lunettes de soleil
  if(cstyle===2&&face!=='cool'){R(x-6,y-13+bob,5,4,'#bce8ed');R(x+2,y-13+bob,5,4,'#bce8ed');R(x-1,y-12+bob,3,1,'#315267')}
 }
 // poussière de course (sous les pieds, au passage du pied avant)
 if(running&&Math.sin(ph)>.5)R(x-(right?13:-10),y+11+bob,3,3,'#e7c379');
}
// Torche dans la main du héros : manche de bois + flamme vacillante (3 couches) + étincelles.
function drawHeldTorch(x,y,right){let t=performance.now()*.001;
 let hx=x+(right?12:-12),hy=y-2; // position de la main avant
 rect(hx-1,hy,2,9,'#5a3a1e');rect(hx-1,hy,2,2,'#3a2412'); // manche
 // flamme : noyau blanc-jaune + corps orange + halo rouge, oscillation horizontale animée
 let f=Math.sin(t*13)*1+Math.sin(t*7)*1.4,base=hy-2;
 rect(hx-3+f*.3,base-3,6,4,'rgba(255,90,20,.85)');
 rect(hx-2+f*.5,base-6,4,5,'#ff9c2e');
 rect(hx-1+f*.7,base-8,2,4,'#ffe27a');
 rect(hx+f*.7,base-9,1,2,'#fff6cf');
 // étincelles qui montent
 for(let i=0;i<3;i++){let p=(t*1.6+i*.4)%1;X.globalAlpha=Math.max(0,1-p);rect(hx-1+Math.sin(t*4+i)*2,base-4-p*10,1,1,'#ffce6b')}
 X.globalAlpha=1;
}
function drawPixelWhip(x,y){let prog=(.48-whip)/.48,f=Math.min(3,Math.floor((.48-whip)/.12)),{dx,dy}=facingVector(),sx=-dy,sy=dx,
 frames=[[[8,5],[14,9],[19,12],[23,13]],[[9,4],[17,8],[25,8],[32,4],[37,-3]],[[9,2],[18,2],[28,0],[38,-5],[46,-12]],[[8,0],[17,-4],[25,-10],[31,-18],[34,-26]]];
 let seg=frames[f],tip=seg[seg.length-1];
 // 1) Arc de mouvement (swoosh) : traînée claire balayant la trajectoire du fouet, qui s'estompe.
 if(f>=1){X.save();X.globalAlpha=.5*(1-prog);X.strokeStyle='#fff3c4';X.lineWidth=2;X.beginPath();
  seg.forEach((p,i)=>{let px=x+dx*p[0]+sx*p[1],py=y+dy*p[0]+sy*p[1];i?X.lineTo(px,py):X.moveTo(px,py)});X.stroke();X.restore();X.lineWidth=4}
 // 2) Corps du fouet : lanière qui s'amincit vers le bout.
 seg.forEach((p,i)=>{let px=x+dx*p[0]+sx*p[1],py=y+dy*p[0]+sy*p[1],last=i===seg.length-1,w=last?5:Math.max(2,4-Math.floor(i*.6));
  rect(px-w/2,py-w/2,w,w,last?'#f2cf76':'#70451f');if(!last)rect(px-1,py-1,2,2,'#c98e45')});
 // 3) CRACK : éclair lumineux au bout du fouet à pleine extension (le « claquement »).
 if(f>=2){let tx=x+dx*tip[0]+sx*tip[1],ty=y+dy*tip[0]+sy*tip[1],fl=f===3?1:.6;
  X.save();X.globalAlpha=fl;rect(tx-1,ty-6,2,12,'#fff7d8');rect(tx-6,ty-1,12,2,'#fff7d8');
  rect(tx-3,ty-3,6,6,'rgba(255,247,196,.5)');X.restore()}}
addEventListener('keydown',e=>{if(state==='quiz'){quizKey(e);return}
 if((e.key==='Escape'||e.key.toLowerCase()==='p')&&(state==='play')){e.preventDefault();togglePause();return}
 keys[e.key.toLowerCase()]=true;if(e.shiftKey)keys.shift=true;
 if(e.key===' '){if(player&&player.drown>0)escapeDrown();else if(sinkIn)escapeSink();else useWhip()}
 if(e.key.toLowerCase()==='e')interact();
 if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault()});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;if(e.key==='Shift'||!e.shiftKey)keys.shift=false});
function quizKey(e){let btns=[...ui.answers.children].filter(b=>!b.disabled);
 // Si l'explication est affichée, Entrée/Espace = CONTINUER
 if(!ui.continueBtn.classList.contains('hidden')){if(e.key==='Enter'||e.key===' '){e.preventDefault();ui.continueBtn.click()}return}
 if(!btns.length)return;
 let cur=btns.findIndex(b=>b===document.activeElement);
 if(['1','2','3','4'].includes(e.key)){let i=+e.key-1;if(i<btns.length){e.preventDefault();btns[i].click()}return}
 if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();let n=btns[(cur+1+btns.length)%btns.length];n.focus()}
 else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();let n=btns[(cur-1+btns.length)%btns.length];n.focus()}
 else if(e.key==='Enter'||e.key===' '){if(cur>=0){e.preventDefault();btns[cur].click()}}}
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');function joyMove(e){let r=joy.getBoundingClientRect(),p=e.touches?e.touches[0]:e,x=p.clientX-r.left-r.width/2,y=p.clientY-r.top-r.height/2,l=Math.hypot(x,y)||1,m=Math.min(35,l);x=x/l*m;y=y/l*m;stick.style.transform=`translate(${x}px,${y}px)`;keys.arrowleft=x<-8;keys.arrowright=x>8;keys.arrowup=y<-8;keys.arrowdown=y>8}function joyEnd(){stick.style.transform='';keys.arrowleft=keys.arrowright=keys.arrowup=keys.arrowdown=false}joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);joyMove(e)});joy.addEventListener('pointermove',e=>{if(e.buttons)joyMove(e)});joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);document.querySelector('#whipBtn').addEventListener('pointerdown',e=>{e.preventDefault();if(player&&player.drown>0)escapeDrown();else if(sinkIn)escapeSink();else useWhip()});document.querySelector('#actBtn').addEventListener('pointerdown',e=>{e.preventDefault();if(sinkIn)escapeSink();else interact()});
// Bouton DASH tactile : déclenche l'impulsion comme la touche Maj (front montant détecté par player.wasDash).
document.querySelector('#dashBtn').addEventListener('pointerdown',e=>{e.preventDefault();keys.shift=true;setTimeout(()=>{keys.shift=false},60)});
// Bouton SORTIR tactile (flèche ↑) : visible seulement quand on s'enlise/se noie ; chaque appui = un coup d'extraction.
const escapeBtn=document.querySelector('#escapeBtn');escapeBtn.addEventListener('pointerdown',e=>{e.preventDefault();if(player&&player.drown>0)escapeDrown();else if(sinkIn)escapeSink()});
setInterval(()=>{escapeBtn.classList.toggle('hidden',!(state==='play'&&((player&&player.drown>0)||sinkIn)))},80);
const comboEl=document.querySelector('#comboHud');setInterval(()=>{if(state==='play'||state==='quiz'){ui.artHud.textContent=collected+'/4';ui.exitHud.innerHTML=boss.active?pixelHearts(boss.hp):(collected>=4?'OUVERT':'VERROUILLÉ');comboEl.classList.toggle('show',combo>=2);if(combo>=2)comboEl.textContent='COMBO x'+combo}else if(state!=='victory')draw()},100);
applyAccessibility();
// Retour sonore sur les boutons de menus (hors réponses du quiz, qui ont leur propre son).
function uiClick(){sound(660,.05,'square',.03);sound(990,.05,'square',.018)}
document.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.closest('#answers'))return;if(b.classList.contains('continueBtn'))return;uiClick()},true);
draw();

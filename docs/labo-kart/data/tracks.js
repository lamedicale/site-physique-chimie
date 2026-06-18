/* ════════════════════════════════════════════════════════════════════════
   LABO KART — DONNÉES DES CIRCUITS
   Un circuit est défini par une POLYLIGNE FERMÉE de waypoints (centre de la
   piste, en pixels monde). Le moteur en déduit : la route (bande de largeur
   `width` autour de la ligne), la ligne d'arrivée (waypoint 0), le sens de
   course, le suivi IA et le calcul de progression de tour.
   Les éléments (box bonus, pièges, zones scientifiques, déco) sont placés en
   coordonnées monde ; ils enrichissent la course sans jamais l'interrompre.
   ════════════════════════════════════════════════════════════════════════ */

/* Palette des objets bonus tirables sur une box (façon Mario Kart). */
const KART_ITEMS = {
  turbo:   { name:'TURBO ELECTRIQUE', color:'#ffe35b', kind:'boost',  power:2.0, dur:90 },
  battery: { name:'BATTERIE PLEINE',  color:'#7ec96f', kind:'boost',  power:1.6, dur:150 },
  shield:  { name:'BOUCLIER',         color:'#4fa3e6', kind:'shield', dur:300 },
  magnet:  { name:'AIMANT',           color:'#c25bd0', kind:'magnet', dur:200 },
  acid:    { name:'FLAQUE ACIDE',     color:'#9be36b', kind:'drop',   trap:'acid' },
  bubble:  { name:'BULLE',            color:'#8be9ef', kind:'shield', dur:240 },
  slow:    { name:'RAYON LENT',       color:'#ff6b6b', kind:'beam' },
  fan:     { name:'VENTILATEUR',      color:'#bfe0ff', kind:'boost',  power:1.5, dur:110 },
  solar:   { name:'BOOST SOLAIRE',    color:'#ffb13d', kind:'boost',  power:1.8, dur:120 },
  grip:    { name:'ANTI-DERAPAGE',    color:'#a0d8b0', kind:'grip',   dur:300 },
  short:   { name:'COURT-CIRCUIT',    color:'#ff4d4d', kind:'beam' },
  portal:  { name:'MINI-PORTAIL',     color:'#b06bff', kind:'warp' }
};
/* Pool de pioche par défaut (équilibré pour débuter). */
const ITEM_POOL = ['turbo','battery','shield','magnet','acid','bubble','slow','fan','solar','grip','short','portal'];

/* Types de zones scientifiques au sol — intégration discrète de la physique-chimie.
   mult = multiplicateur de vitesse appliqué tant qu'on roule dessus.
   fx   = effet spécial géré par le moteur. */
const ZONE_TYPES = {
  conductor: { name:'ZONE CONDUCTRICE', mult:1.18, color:'#ffd24a', fx:'spark' },
  solar:     { name:'ZONE SOLAIRE',     mult:1.10, color:'#ffcf66', fx:'shine', recharge:true },
  shadow:    { name:'ZONE D OMBRE',     mult:1.0,  color:'#3a4760', fx:'dim',   killSolar:true },
  acid:      { name:'FLAQUE ACIDE',     mult:0.62, color:'#7bc94a', fx:'fizz' },
  base:      { name:'FLAQUE BASIQUE',   mult:1.0,  color:'#6bb6ff', fx:'slip',  slip:true },
  shortc:    { name:'COURT-CIRCUIT',    mult:0.7,  color:'#ff5a5a', fx:'zap',   killBoost:true },
  insulator: { name:'ZONE ISOLANTE',    mult:1.0,  color:'#caa16b', fx:'none',  insulate:true }
};

/* Pilotes jouables — calqués sur les personnages de « Temple des Savoirs »
   (mêmes noms / palettes shirt-hat-skin / style de silhouette). Purement
   cosmétiques : les stats des karts sont identiques pour tous. `kartColor` =
   couleur de carrosserie associée. `hair`/`hat`/`face` pilotent le buste dessiné. */
const LABO_DRIVERS = [
  {n:'ARCHEO',    shirt:'#c18b43', hat:'#88562a', skin:'#e0a56b', hair:'short', hatType:'fedora', face:'cool',     kartColor:'#eb5a0b'},
  {n:'EXPLORA',   shirt:'#4d8f8a', hat:'#71452e', skin:'#c98755', hair:'pony',  hatType:'bandana',face:'happy',    kartColor:'#2bb6c8'},
  {n:'SCIENCE',   shirt:'#e9e4d2', hat:'#3d6685', skin:'#a96d48', hair:'short', hatType:'goggles',face:'neutral',  kartColor:'#4fa3e6'},
  {n:'AVENTUR',   shirt:'#7a4bb0', hat:'#241a33', skin:'#d99466', hair:'long',  hatType:'band',   face:'angry',    kartColor:'#b06bff'},
  {n:'EXPLOR',    shirt:'#8a6a3a', hat:'#5a3e23', skin:'#c98a5e', hair:'curly', hatType:'fedora', face:'neutral',  kartColor:'#9c6e3e'},
  {n:'PILOTE',    shirt:'#b04a3a', hat:'#3a2c20', skin:'#e0a56b', hair:'short', hatType:'helmet', face:'cool',     kartColor:'#e7453b'},
  {n:'BIOLO',     shirt:'#e4e9da', hat:'#2f6e54', skin:'#8d5a3c', hair:'bun',   hatType:'goggles',face:'happy',    kartColor:'#7ec96f'},
  {n:'GUIDE',     shirt:'#3f7d57', hat:'#6a4a2a', skin:'#b9805a', hair:'short', hatType:'straw',  face:'happy',    kartColor:'#3f7d57'},
  {n:'INVENT',    shirt:'#c98a2f', hat:'#7a4a90', skin:'#e8b98c', hair:'mohawk',hatType:'goggles',face:'wink',     kartColor:'#ffd24a'},
  {n:'PLONGE',    shirt:'#2f7da0', hat:'#1f3a55', skin:'#d4a373', hair:'short', hatType:'cap',    face:'cool',     kartColor:'#c25bd0'}
];

/* ── CIRCUIT 1 : LABO STARTER ──────────────────────────────────────────────
   Vrai circuit de kart dessiné dans un laboratoire. Les `path` sont des
   waypoints de CONTRÔLE clairsemés ; le moteur les lisse en spline (Catmull-Rom)
   pour obtenir des courbes douces, des épingles et des chicanes réalistes.
   Monde ~4600×2700 px ; largeur de route 240 px (grand circuit fluide).
   Profil du tour (sens horaire) :
     longue ligne droite départ → grand virage rapide → double courbe →
     épingle marquée → section en S → large boucle de retour. */
const TRACK_STARTER = {
  id:'starter', n:1, name:'LABO STARTER',
  desc:'Premiers tours de roue au labo : box bonus, batteries et 1 raccourci.',
  theme:'lab', accent:'#52b567',
  /* palette Mario Circuit : pelouse verte unie, asphalte gris clair, kerbs
     rouge/blanc larges. Sol lisible, sans carrelage. */
  bg:'#8fd0f0', bg2:'#bfe6f7',          // halo ciel clair derrière l'horizon
  grass:['#5fb84a','#54ad40'],          // pelouse verte (2 nuances pour les bandes)
  road:'#8a8f99', roadHi:'#9aa0aa',     // asphalte gris clair (type circuit)
  kerb:['#e23b32','#f4f4f4'],           // bordures rouge/blanc Mario Kart
  laps:3, width:220, targetTime:135, opponents:5,
  startGap:80,            // espacement des karts sur la grille de départ
  smooth:true,            // active le lissage spline du tracé
  /* TRACÉ TECHNIQUE (sens horaire). Plus de virages serrés, une chicane, une
     épingle nette et une section en S rapide. La spline passe par chaque point. */
  path:[
    [1000,2360],           // ligne d'arrivée (longue ligne droite de départ)
    [1000,1860],           // plein gaz
    [1020,1420],           // léger appui avant le premier virage
    [1120,1060],           // virage 1 : courbe rapide à gauche
    [1380,820],
    [1760,720],            // ligne courte
    [2120,760],            // chicane : appui droite…
    [2300,980],            // …puis gauche (zone glissante)
    [2200,1240],
    [2380,1500],           // relance vers l'épingle
    [2760,1560],
    [3160,1460],           // entrée épingle
    [3460,1180],
    [3640,860],            // sommet épingle
    [3500,560],            // demi-tour serré (épingle)
    [3160,520],
    [2960,760],            // sortie d'épingle
    [3080,1120],
    [3480,1320],           // section en S : premier appui
    [3820,1600],
    [3760,1980],           // S : second appui
    [3460,2280],
    [3000,2420],           // large courbe de retour
    [2440,2480],
    [1840,2460],
    [1380,2440]
  ],
  /* raccourci risqué : coupe l'épingle en traversant une flaque acide. */
  shortcuts:[
    { from:11, to:16, path:[[3160,1460],[3320,1240],[3380,940],[3160,760],[2960,760]], hazardZone:{type:'acid', t:0.5} }
  ],
  /* box bonus : positions monde (réapparaissent après ramassage) */
  boxes:[
    [950,2000],[1050,2000], [1080,1080],[1180,1000],
    [1740,640],[1840,640], [2180,1180],[2300,1280],
    [3540,860],[3640,780], [3700,1840],[3620,1960],
    [2980,2440],[2400,2500], [1500,2440]
  ],
  /* zones scientifiques au sol : x,y centre, r rayon, type */
  zones:[
    { x:1000, y:2120, r:220, type:'conductor' },   // ligne droite départ = accélère
    { x:1180, y:980,  r:190, type:'solar' },         // virage 1 ensoleillé = recharge
    { x:2240, y:1120, r:180, type:'base' },          // chicane = glissant
    { x:3300,  y:760, r:200, type:'conductor' },     // épingle = relance
    { x:3780, y:1820, r:190, type:'solar' },
    { x:2440, y:2480, r:220, type:'shortc' }         // court-circuit dans la courbe de retour
  ],
  /* pièges/obstacles ponctuels : type + position. */
  obstacles:[
    { type:'cone', x:3520,y:600 },{ type:'cone', x:3560,y:660 },{ type:'cone', x:3480,y:680 },
    { type:'puddle', x:2240,y:1120, r:110 },
    { type:'beaker', x:1240,y:880 },{ type:'beaker', x:3580,y:920 },
    { type:'oildrum', x:3440,y:2300 },{ type:'oildrum', x:2820,y:2400 }
  ],
  /* obstacles mobiles : chariots qui traversent la piste. */
  movers:[
    { type:'cart', ax:2180,ay:900, bx:2480,by:1180, speed:0.6 },
    { type:'cart', ax:3520,ay:1560, bx:3820,by:1820, speed:0.8 }
  ],
  /* décor de fond DENSE (non collide) — remplit l'intérieur et les abords pour
     donner vie au labo. type + position monde. */
  decor:[
    /* paillasses & étagères périmètre */
    { type:'bench', x:420,y:1400,w:180,h:70 },{ type:'bench', x:420,y:2000,w:180,h:70 },
    { type:'bench', x:520,y:640,w:180,h:70 },
    { type:'shelf', x:2300,y:300,w:220,h:84 },{ type:'shelf', x:4500,y:1400,w:220,h:84 },
    { type:'shelf', x:4540,y:2000,w:220,h:84 },
    { type:'fumehood', x:820,y:340 },{ type:'fumehood', x:4360,y:760 },
    { type:'lockers', x:240,y:1080 },{ type:'lockers', x:4640,y:1720 },
    /* écrans & tableaux */
    { type:'screen', x:1480,y:300 },{ type:'screen', x:3260,y:300 },
    { type:'whiteboard', x:2200,y:260 },
    /* îlot central (intérieur de la boucle) */
    { type:'bench', x:2700,y:1820,w:220,h:78 },{ type:'microscope', x:2400,y:1960 },
    { type:'centrifuge', x:3000,y:1960 },{ type:'pipes', x:2700,y:1180 },
    { type:'microscope', x:2200,y:1640 },{ type:'centrifuge', x:3200,y:1640 },
    { type:'bench', x:2550,y:1500,w:200,h:72 },{ type:'whiteboard', x:2800,y:1320 },
    /* végétation & caisses */
    { type:'plant', x:620,y:2560 },{ type:'plant', x:4360,y:2560 },{ type:'plant', x:180,y:1800 },
    { type:'plant', x:4660,y:1100 },{ type:'plant', x:1800,y:200 },
    { type:'crate', x:480,y:2560 },{ type:'crate', x:540,y:2620 },{ type:'crate', x:4200,y:320 },
    { type:'pipes', x:4680,y:1180 },{ type:'pipes', x:1500,y:2680 },{ type:'pipes', x:3400,y:2680 },
    { type:'barrel', x:1100,y:2680 },{ type:'barrel', x:3600,y:360 },{ type:'barrel', x:4500,y:2620 },
    { type:'cabinet', x:4640,y:1080 },{ type:'cabinet', x:220,y:1560 },{ type:'cabinet', x:280,y:700 }
  ],
  itemPool: ITEM_POOL
};

/* ── CIRCUITS À VENIR (métadonnées pour la grille de sélection) ──────────── */
const TRACKS = [
  TRACK_STARTER,
  { id:'electric', n:2, name:'CIRCUIT ELECTRIQUE', desc:'Circuit imprimé : câbles, piles, arcs et courts-circuits.', theme:'electric', accent:'#ffd24a', bg:'#161a2c', locked:true, soon:true },
  { id:'solar',    n:3, name:'PISTE SOLAIRE',      desc:'Panneaux, serres, zones d ombre et raccourcis solaires.',   theme:'solar',    accent:'#ffb13d', bg:'#2a2410', locked:true, soon:true },
  { id:'wind',     n:4, name:'TEMPETE EOLIENNE',   desc:'Ventilateurs géants, turbines et couloirs de vent.',        theme:'wind',     accent:'#bfe0ff', bg:'#1a2630', locked:true, soon:true },
  { id:'ph',       n:5, name:'LABO PH',            desc:'Fioles, cuves, vapeurs, flaques acides et basiques.',       theme:'ph',       accent:'#e14e65', bg:'#241826', locked:true, soon:true },
  { id:'laser',    n:6, name:'LASER LAB',          desc:'Lasers, miroirs, prismes et portes lumineuses.',            theme:'laser',    accent:'#ff5bd0', bg:'#120a2e', locked:true, soon:true },
  { id:'space',    n:7, name:'STATION SPATIALE',   desc:'Astéroïdes, sas, satellites et gravité réduite.',           theme:'space',    accent:'#8be9ef', bg:'#0a0f1e', locked:true, soon:true }
];

window.LABO_KART_DATA = { tracks:TRACKS, items:KART_ITEMS, itemPool:ITEM_POOL, zoneTypes:ZONE_TYPES, drivers:LABO_DRIVERS };

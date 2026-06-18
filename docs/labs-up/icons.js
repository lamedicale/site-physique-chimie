// Labs'Up — Bibliotheque d'icones PIXEL-ART (schemas scientifiques justes).
// svgIcon(name) renvoie une chaine SVG (viewBox 0 0 96 96) ou null si inconnue.
// Parti pris : vrai pixel-art (rendering:crispEdges), grille de 6px,
// schemas conformes aux manuels (becher a fond plat, circuits symbolises,
// molecules realistes, etc.). Aucune courbe : que des rectangles "pixels".

(function(){
  // Palette pixel sobre (cohérente avec l'UI rétro labo)
  const C={
    nuit:'#0d1b2a', bord:'#0a0f1e', encre:'#13233b',
    verre:'#cfe8ff', verreO:'#7fb4e6', eau:'#36a6e0', eauF:'#1d7fbf',
    blanc:'#f4f7fb', gris:'#aab7c8', grisF:'#6b7a8d', metal:'#c2ccd9',
    bois:'#b9763f', boisF:'#8a5526',
    rouge:'#e63946', rougeF:'#b71c2b', orange:'#ff9f1c', orangeF:'#d97e00',
    jaune:'#ffd23f', vert:'#2ec27e', vertF:'#1e8f5a',
    bleu:'#3a86ff', bleuF:'#245fd0', cyan:'#48cae4', violet:'#9b5de5',
    rose:'#ff70a6', noir:'#1b2330', cuivre:'#d98c4a', fonte:'#5c6b7a'
  };

  // Helper : un "pixel" = bloc carre. Grille 16x16 -> echelle 6.
  const U=6;
  function p(x,y,w,h,col){ // coordonnees en cases
    return '<rect x="'+(x*U)+'" y="'+(y*U)+'" width="'+(w*U)+'" height="'+(h*U)+'" fill="'+col+'"/>';
  }
  function px(x,y,col){return p(x,y,1,1,col);} // un seul pixel

  const ICONS={

    // ============ VERRERIE & MATERIEL ============
    // Eprouvette graduee : tube fin, gradue, fond arrondi -> ici fond plat ferme + graduations
    eprouvette(){return ''+
      p(6,1,4,1,C.gris)+               // collerette
      p(6,2,4,12,C.verre)+             // corps
      p(6,2,1,12,C.verreO)+p(9,2,1,12,C.verreO)+ // bords verre
      p(6,9,4,5,C.eau)+p(6,13,4,1,C.eauF)+ // liquide
      p(6,14,4,1,C.gris)+              // fond
      px(7,4,C.grisF)+px(7,6,C.grisF)+px(7,8,C.grisF)+ // graduations
      p(6,1,4,14,'none');
    },
    // Becher : large, FOND PLAT, bec verseur
    becher(){return ''+
      p(4,2,1,1,C.verre)+              // bec verseur
      p(4,3,8,10,C.verre)+
      p(4,3,1,10,C.verreO)+p(11,3,1,10,C.verreO)+ // parois
      p(4,8,8,5,C.eau)+p(4,12,8,1,C.eauF)+        // liquide
      p(4,13,8,1,C.gris)+             // fond plat
      px(10,5,C.grisF)+px(10,7,C.grisF); // graduations
    },
    // Erlenmeyer : col etroit, base conique large, fond plat
    erlenmeyer(){return ''+
      p(7,2,2,3,C.verre)+            // col
      p(6,5,4,1,C.verre)+
      p(5,6,6,1,C.verre)+
      p(4,7,8,6,C.verre)+           // corps conique
      p(4,7,1,6,C.verreO)+p(11,7,1,6,C.verreO)+
      p(4,10,8,3,C.eauF)+          // liquide
      p(4,13,8,1,C.gris);          // fond plat
    },
    // Tube a essai : fin, fond ARRONDI (ferme en bas)
    tube(){return ''+
      p(6,1,4,1,C.gris)+
      p(6,2,4,11,C.verre)+
      p(6,2,1,11,C.verreO)+p(9,2,1,11,C.verreO)+
      p(6,8,4,5,C.vert)+           // contenu
      p(7,13,2,1,C.vert)+          // fond arrondi (pixel)
      p(6,13,1,1,C.verreO)+p(9,13,1,1,C.verreO);
    },
    // Entonnoir : cone large -> tube etroit
    entonnoir(){return ''+
      p(3,3,10,1,C.metal)+
      p(4,4,8,1,C.metal)+
      p(5,5,6,1,C.metal)+
      p(6,6,4,1,C.metal)+
      p(7,7,2,6,C.metal)+         // tige
      p(3,3,10,1,C.gris);
    },
    // Pipette : poire + tige fine + goutte
    pipette(){return ''+
      p(6,1,4,3,C.rose)+          // poire
      p(7,4,2,8,C.verre)+         // tige
      p(7,7,2,5,C.eau)+
      px(7,12,C.eau)+px(8,13,C.eau); // goutte qui tombe
    },
    // Balance type Roberval : fleau + 2 plateaux + colonne
    balance(){return ''+
      p(7,3,2,5,C.metal)+        // colonne
      p(3,3,10,1,C.metal)+       // fleau
      p(2,4,3,1,C.gris)+p(11,4,3,1,C.gris)+ // suspentes
      p(1,6,5,1,C.jaune)+p(10,6,5,1,C.jaune)+ // plateaux
      p(4,12,8,2,C.fonte);       // socle
    },
    // Thermometre : reservoir rouge + colonne + graduations
    thermometre(){return ''+
      p(6,1,4,10,C.verre)+
      p(6,1,1,10,C.verreO)+p(9,1,1,10,C.verreO)+
      p(7,4,2,7,C.rouge)+        // colonne
      p(5,10,6,4,C.rouge)+       // reservoir
      px(7,11,C.rougeF)+
      px(10,3,C.grisF)+px(10,5,C.grisF)+px(10,7,C.grisF); // graduations
    },
    // Chronometre : cadran + bouton + aiguille
    chrono(){return ''+
      p(7,1,2,2,C.metal)+        // bouton poussoir
      p(5,3,6,1,C.gris)+
      p(4,4,8,8,C.blanc)+        // cadran
      p(4,4,8,1,C.gris)+p(4,11,8,1,C.gris)+p(4,4,1,8,C.gris)+p(11,4,1,8,C.gris)+
      p(8,6,1,3,C.rouge)+        // aiguille verticale
      p(8,8,3,1,C.rouge)+        // aiguille horizontale
      px(8,8,C.bord);
    },
    // Regle graduee
    regle(){return ''+
      p(1,6,14,3,C.jaune)+
      p(1,6,14,1,C.orangeF)+
      px(3,7,C.bord)+px(5,7,C.bord)+px(7,7,C.bord)+px(9,7,C.bord)+px(11,7,C.bord)+px(13,7,C.bord);
    },
    // Spatule
    spatule(){return ''+
      p(7,2,2,7,C.metal)+        // manche
      p(5,9,6,3,C.gris)+         // cuilleron
      p(5,11,6,1,C.grisF);
    },
    // Loupe : verre + manche
    loupe(){return ''+
      p(3,2,7,1,C.bord)+p(3,9,7,1,C.bord)+p(3,2,1,8,C.bord)+p(9,2,1,8,C.bord)+ // cadre
      p(4,3,5,6,C.cyan)+         // verre
      px(5,4,C.blanc)+           // reflet
      p(9,9,1,1,C.grisF)+p(10,10,1,1,C.grisF)+p(11,11,3,3,C.fonte); // manche
    },

    // ============ MASSE / VOLUME ============
    // Masse marquee (poids de balance) avec anneau
    poids(){return ''+
      p(7,2,2,2,'none')+
      p(6,2,1,2,C.fonte)+p(9,2,1,2,C.fonte)+p(7,1,2,1,C.fonte)+ // anneau
      p(4,4,8,9,C.fonte)+        // corps trapeze (approx pixel)
      p(5,4,6,1,C.grisF)+
      p(6,8,4,1,C.jaune);        // marque
    },
    // Cube (volume / m3) en perspective pixel
    cube(){return ''+
      p(5,3,6,2,C.orange)+       // dessus
      p(4,5,8,7,C.orangeF)+      // face
      p(4,5,1,7,C.orange)+
      p(11,4,1,8,C.boisF)+
      p(5,3,6,1,C.jaune);
    },
    // Litre : bouteille graduee
    litre(){return ''+
      p(7,1,2,2,C.gris)+         // bouchon
      p(6,3,4,11,C.verre)+
      p(6,3,1,11,C.verreO)+p(9,3,1,11,C.verreO)+
      p(6,7,4,7,C.eau)+p(6,13,4,1,C.eauF)+
      px(7,5,C.grisF)+px(7,9,C.grisF)+
      p(6,2,4,1,'none');
    },

    // ============ ETATS DE LA MATIERE (modele particulaire) ============
    // Solide : particules rangees serrees et ordonnees
    solide(){let s='';const col=C.bleu;
      for(let r=0;r<3;r++)for(let c=0;c<3;c++){s+=p(4+c*3,4+r*3,2,2,col);}
      return p(3,3,10,10,C.encre)+s; // boite + reseau
    },
    // Liquide : particules proches mais desordonnees, au fond du recipient
    liquide(){return ''+
      p(4,3,8,10,C.encre)+
      p(4,8,8,5,C.eauF)+        // niveau liquide
      p(5,9,2,2,C.cyan)+p(8,10,2,2,C.cyan)+p(9,8,2,2,C.cyan)+p(6,11,2,1,C.cyan);
    },
    // Gaz : particules eparses partout, dispersees
    gaz(){return ''+
      p(3,3,10,10,C.encre)+
      p(4,4,2,2,C.cyan)+p(9,5,2,2,C.cyan)+p(6,8,2,2,C.cyan)+p(10,10,2,2,C.cyan)+p(4,10,2,2,C.cyan);
    },
    // Glacon (solide concret)
    glacon(){return ''+
      p(4,4,8,8,C.cyan)+
      p(4,4,8,1,C.blanc)+p(4,4,1,8,C.blanc)+ // reflets
      p(11,5,1,7,C.eauF)+p(5,11,7,1,C.eauF)+
      px(6,6,C.blanc)+px(9,8,C.blanc);
    },
    // Goutte d'eau (liquide concret)
    goutte(){return ''+
      px(8,2,C.eau)+p(7,3,2,1,C.eau)+p(6,4,4,1,C.eau)+
      p(5,5,6,4,C.eau)+p(6,9,4,1,C.eauF)+
      p(5,5,6,1,C.cyan)+px(6,6,C.blanc); // reflet
    },
    // Nuage de vapeur (gaz concret)
    nuage(){return ''+
      p(5,6,2,2,C.blanc)+p(7,5,3,2,C.blanc)+p(10,6,2,2,C.blanc)+
      p(4,8,9,2,C.gris)+p(5,8,7,1,C.blanc);
    },
    // Vapeur qui monte (volutes en pixels)
    vapeur(){return ''+
      p(5,3,1,2,C.gris)+px(6,5,C.gris)+px(5,6,C.gris)+px(6,7,C.gris)+px(5,8,C.gris)+
      p(9,3,1,2,C.gris)+px(10,5,C.gris)+px(9,6,C.gris)+px(10,7,C.gris)+px(9,8,C.gris)+
      p(4,12,8,2,C.eauF); // surface chaude
    },

    // ============ MELANGES / SEPARATIONS ============
    // Filtration : entonnoir + filtre + becher recepteur + gouttes
    filtration(){return ''+
      p(4,2,8,1,C.metal)+p(5,3,6,1,C.metal)+p(6,4,4,1,C.metal)+ // entonnoir
      p(7,5,2,3,C.gris)+        // tige
      px(7,8,C.eau)+           // goutte
      p(5,9,6,4,C.verre)+p(5,11,6,2,C.eau)+ // becher
      p(5,12,6,1,C.eauF);
    },
    // Decantation : 2 phases distinctes (solide deposse au fond)
    decantation(){return ''+
      p(5,2,6,11,C.verre)+
      p(5,2,1,11,C.verreO)+p(10,2,1,11,C.verreO)+
      p(5,5,6,6,C.eauF)+        // liquide clair
      p(5,11,6,2,C.boisF);      // depot solide
    },
    // Distillation : ballon chauffe + colonne + condenseur incline
    distillation(){return ''+
      p(3,9,4,4,C.verre)+p(3,11,4,2,C.eau)+ // ballon
      p(4,7,2,2,C.verre)+      // col
      p(6,6,6,1,C.verre)+p(7,7,5,1,C.verre)+ // tube vers le haut/cote
      p(11,7,1,5,C.verreO)+    // descente condenseur
      px(11,12,C.eau)+         // distillat
      p(3,13,4,1,C.orange);    // flamme/chaleur
    },
    // Aimant en U (separation limaille de fer)
    aimant(){return ''+
      p(4,3,2,8,C.rouge)+p(10,3,2,8,C.bleu)+   // branches
      p(4,11,8,2,C.fonte)+                      // base U... non : U ouvert vers le haut
      p(4,3,2,1,C.blanc)+p(10,3,2,1,C.blanc)+   // poles
      p(4,11,8,1,C.fonte);
    },
    // Sable (tas granuleux)
    sable(){return ''+
      p(4,10,8,3,C.bois)+p(5,9,6,1,C.bois)+p(6,8,4,1,C.bois)+
      px(6,11,C.boisF)+px(9,11,C.boisF)+px(7,12,C.boisF)+px(10,12,C.boisF);
    },
    // Sel (cristaux dans un tas)
    sel(){return ''+
      p(5,8,6,5,C.blanc)+p(6,7,4,1,C.blanc)+
      px(6,9,C.gris)+px(9,9,C.gris)+px(7,11,C.gris)+px(10,10,C.gris)+
      p(5,12,6,1,C.gris);
    },

    // ============ ELECTRICITE (symboles normalises) ============
    // Pile (symbole) : 2 traits long/court + bornes
    pile(){return ''+
      p(2,7,5,2,C.bord)+p(11,7,3,2,C.bord)+   // fils
      p(7,4,1,8,C.bord)+                        // grande borne (+)
      p(9,6,2,4,C.bord)+                        // petite borne (-)... rectangle epais
      p(8,4,1,8,'none')+
      px(6,5,C.jaune); // + indicatif
    },
    // Lampe (symbole) : cercle + croix
    lampe(){return ''+
      p(5,4,6,1,C.jaune)+p(5,9,6,1,C.jaune)+p(5,4,1,6,C.jaune)+p(10,4,1,6,C.jaune)+ // cercle pixel
      px(6,5,C.orange)+px(9,5,C.orange)+px(6,8,C.orange)+px(9,8,C.orange)+ // croix interne
      px(7,6,C.orange)+px(8,7,C.orange)+
      p(2,11,12,1,C.bord)+p(5,10,1,1,C.bord)+p(10,10,1,1,C.bord); // fils
    },
    // Interrupteur ouvert (symbole)
    interrupteur(){return ''+
      p(2,9,4,1,C.bord)+p(10,9,4,1,C.bord)+   // fils
      p(5,9,1,1,C.fonte)+p(10,9,1,1,C.fonte)+ // bornes
      p(6,5,1,1,C.orange)+px(7,6,C.orange)+px(8,7,C.orange)+px(9,8,C.orange); // lame levee
    },
    // Moteur (symbole) : cercle + M
    moteur(){return ''+
      p(4,4,8,1,C.bleu)+p(4,11,8,1,C.bleu)+p(4,4,1,8,C.bleu)+p(11,4,1,8,C.bleu)+
      p(6,6,1,4,C.blanc)+p(9,6,1,4,C.blanc)+px(7,7,C.blanc)+px(8,8,C.blanc)+ // lettre M
      p(2,13,12,1,C.bord);
    },
    // Prise murale
    prise(){return ''+
      p(4,3,8,9,C.blanc)+
      p(4,3,8,1,C.gris)+p(4,11,8,1,C.gris)+p(4,3,1,9,C.gris)+p(11,3,1,9,C.gris)+
      p(6,6,1,2,C.bord)+p(9,6,1,2,C.bord)+ // trous
      p(7,9,2,1,C.fonte);
    },
    // Fil conducteur (cuivre)
    fil(){return ''+
      p(2,7,12,2,C.cuivre)+
      p(2,7,12,1,C.orange)+
      p(2,7,2,2,C.metal)+p(12,7,2,2,C.metal); // gaine aux bouts
    },
    // Eclair (court-circuit / energie elec)
    eclair(){return ''+
      px(9,2,C.jaune)+p(8,3,2,1,C.jaune)+p(7,4,2,1,C.jaune)+p(6,5,3,1,C.jaune)+
      p(7,6,3,1,C.jaune)+p(6,7,3,1,C.jaune)+p(5,8,3,1,C.jaune)+
      p(7,8,1,5,C.orange)+p(6,9,2,1,C.orange);
    },
    // Batterie (rectangle avec borne + symbole)
    batterie(){return ''+
      p(3,5,10,6,C.vert)+
      p(13,7,1,2,C.bord)+      // borne
      p(3,5,10,1,C.vertF)+
      p(6,6,1,4,C.blanc)+p(5,7,3,1,C.blanc)+ // +
      p(9,7,2,1,C.blanc);     // -
    },
    // Voltmetre / Amperemetre (appareil a cadran)
    appareil(){return ''+
      p(3,4,10,8,C.encre)+
      p(4,5,8,3,C.cyan)+       // ecran
      p(7,6,1,2,C.bord)+p(6,7,3,1,C.bord)+ // aiguille
      p(5,10,1,1,C.gris)+p(10,10,1,1,C.gris); // bornes
    },

    // ============ ENERGIES ============
    soleil(){return ''+
      p(6,6,4,4,C.jaune)+p(6,6,4,1,C.orange)+ // disque
      p(7,2,2,2,C.orange)+p(7,12,2,2,C.orange)+ // rayons N/S
      p(2,7,2,2,C.orange)+p(12,7,2,2,C.orange)+ // E/O
      px(4,4,C.orange)+px(11,4,C.orange)+px(4,11,C.orange)+px(11,11,C.orange);
    },
    flamme(){return ''+
      px(8,2,C.jaune)+p(7,3,2,1,C.jaune)+p(6,4,4,2,C.orange)+
      p(5,6,6,4,C.orange)+p(6,10,4,2,C.rouge)+
      p(7,5,2,4,C.jaune)+px(8,7,C.blanc); // coeur clair
    },
    eolienne(){return ''+
      p(7,7,2,7,C.gris)+         // mat
      p(7,3,1,4,C.blanc)+        // pale haut
      p(8,7,4,1,C.blanc)+        // pale droite
      p(4,8,4,1,C.blanc)+        // pale gauche
      px(7,6,C.fonte);           // moyeu
    },
    note(){return ''+
      p(6,2,5,1,C.violet)+       // hampe haut
      p(10,2,1,7,C.violet)+      // hampe
      p(6,3,1,6,C.violet)+
      p(4,8,3,2,C.violet)+p(8,7,3,2,C.violet); // tetes
    },
    fleche(){return ''+      // mouvement / vitesse / vecteur
      p(2,7,9,2,C.vert)+
      p(9,5,2,2,C.vert)+p(11,6,1,2,C.vert)+p(9,9,2,2,C.vert)+p(11,8,1,2,C.vert)+
      p(12,7,1,2,C.vertF);
    },

    // ============ SENS ============
    oreille(){return ''+
      p(5,3,5,2,C.bois)+p(4,5,2,7,C.bois)+p(9,5,2,4,C.bois)+
      p(6,11,2,2,C.bois)+
      p(6,5,3,2,C.boisF)+px(7,8,C.boisF);
    },
    oeil(){return ''+
      p(4,6,8,1,C.blanc)+p(3,7,10,2,C.blanc)+p(4,9,8,1,C.blanc)+ // blanc oeil
      p(6,6,4,4,C.bleu)+p(7,7,2,2,C.bord)+px(7,7,C.blanc); // iris+pupille
    },

    // ============ CHIMIE 4e (molecules realistes) ============
    // Atome (modele noyau + electrons sur orbite)
    atome(){return ''+
      p(7,7,2,2,C.rouge)+        // noyau
      p(4,4,8,1,C.cyan)+p(4,11,8,1,C.cyan)+p(4,4,1,8,C.cyan)+p(11,4,1,8,C.cyan)+ // orbite
      px(7,3,C.blanc)+px(12,8,C.blanc); // electrons
    },
    // Molecule generique (atomes lies)
    molecule(){return ''+
      p(4,5,3,3,C.bleu)+p(10,5,2,2,C.rouge)+p(9,9,2,2,C.rose)+
      p(7,6,3,1,C.gris)+p(8,8,1,1,C.gris); // liaisons
    },
    // H2O : O central rouge + 2 H blancs (forme coudee)
    h2o(){return ''+
      p(6,6,4,4,C.rouge)+        // O
      px(8,7,C.blanc)+          // reflet O
      p(3,4,2,2,C.blanc)+p(11,4,2,2,C.blanc)+ // 2 H en haut (coude)
      p(5,5,1,1,C.gris)+p(10,5,1,1,C.gris); // liaisons O-H
    },
    // CO2 : O=C=O lineaire (rouge-noir-rouge)
    co2(){return ''+
      p(2,6,3,3,C.rouge)+        // O
      p(6,6,4,3,C.noir)+         // C
      p(11,6,3,3,C.rouge)+       // O
      p(5,7,1,1,C.gris)+p(10,7,1,1,C.gris); // doubles liaisons (simplifie)
    },
    // O2 : 2 atomes rouges lies
    o2(){return ''+
      p(3,6,4,4,C.rouge)+p(9,6,4,4,C.rouge)+
      p(7,7,2,2,C.gris); // liaison double
    },
    // Flacon de reactif (etiquette)
    flacon(){return ''+
      p(7,2,2,2,C.gris)+        // bouchon
      p(5,4,6,9,C.verre)+
      p(5,4,1,9,C.verreO)+p(10,4,1,9,C.verreO)+
      p(5,8,6,5,C.vertF)+      // contenu
      p(6,5,4,2,C.blanc);      // etiquette
    },
    // Papier pH (bandelette + echelle de couleurs)
    ph(){return ''+
      p(6,2,4,12,C.blanc)+     // bandelette
      p(6,3,4,2,C.rouge)+p(6,5,4,2,C.orange)+p(6,7,4,2,C.vert)+
      p(6,9,4,2,C.bleu)+p(6,11,4,2,C.violet);
    },
    // Eau de chaux (tube qui se trouble)
    eaudechaux(){return ''+
      p(6,1,4,1,C.gris)+
      p(6,2,4,12,C.verre)+
      p(6,8,4,5,C.gris)+      // trouble (laiteux)
      px(7,10,C.blanc)+px(9,11,C.blanc);
    },
    // Feu de bois (buches + flamme)
    feu(){return ''+
      p(4,11,8,2,C.boisF)+p(5,10,2,1,C.bois)+p(9,10,2,1,C.bois)+ // buches
      p(7,5,2,1,C.jaune)+p(6,6,4,3,C.orange)+p(7,9,2,1,C.rouge);
    },

    // ============ MOUVEMENT / VITESSE ============
    cible(){return ''+      // referentiel / point de repere
      p(5,4,6,1,C.rouge)+p(5,9,6,1,C.rouge)+p(5,4,1,6,C.rouge)+p(10,4,1,6,C.rouge)+
      p(7,6,2,2,C.rouge)+   // centre
      px(8,7,C.blanc);
    },
    voiture(){return ''+
      p(4,7,8,3,C.rouge)+p(5,5,5,2,C.rougeF)+ // carrosserie+cabine
      p(6,5,3,2,C.cyan)+    // vitre
      p(4,7,8,1,C.blanc)+
      p(5,10,2,2,C.noir)+p(9,10,2,2,C.noir); // roues
    },
    montre(){return ''+
      p(5,4,6,1,C.metal)+p(5,11,6,1,C.metal)+p(5,4,1,8,C.metal)+p(10,4,1,8,C.metal)+
      p(6,5,4,6,C.blanc)+
      p(7,6,1,3,C.bord)+p(8,8,2,1,C.bord)+ // aiguilles
      p(6,2,4,1,C.gris)+p(6,12,4,1,C.gris); // bracelet
    },
    ballon(){return ''+      // chute / mouvement accelere
      p(6,3,4,4,C.blanc)+p(6,3,4,1,C.gris)+
      px(7,4,C.noir)+px(8,5,C.noir)+ // motif
      px(8,8,C.gris)+px(9,10,C.gris)+px(10,12,C.gris); // trainee de chute
    },
  };

  window.svgIcon=function(name){
    let fn=ICONS[name];
    if(!fn) return null;
    return '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" '+
      'shape-rendering="crispEdges" style="width:100%;height:100%;image-rendering:pixelated">'+
      fn()+'</svg>';
  };
  window.LABSUP_ICON_NAMES=Object.keys(ICONS);
})();

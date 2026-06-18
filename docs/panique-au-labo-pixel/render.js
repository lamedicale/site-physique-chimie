const PX=32,PY=28,OY=13;
function rr(x,y,w,h,c){CTX.fillStyle=c;CTX.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function poly(a,c){CTX.fillStyle=c;CTX.beginPath();CTX.moveTo(a[0][0],a[0][1]);for(let i=1;i<a.length;i++)CTX.lineTo(a[i][0],a[i][1]);CTX.closePath();CTX.fill()}
function txt(s,x,y,c='#fff',z=7,a='center'){CTX.font=z+'px "Press Start 2P"';CTX.textAlign=a;CTX.fillStyle='#182522';CTX.fillText(s,x+2,y+2);CTX.fillStyle=c;CTX.fillText(s,x,y)}
function X(x){return x*PX}function sceneOY(){return level?37:OY}function Y(y){return sceneOY()+y*PY}
function palette(){
 if(level.theme==='foam')return{out:'#294c3c',floor:'#b9b7a4',alt:'#c9c6b0',line:'#858b7e',wall:'#405e4d',top:'#a9784f',detail:'#dfc17d',danger:'#b9f2c9'};
 if(level.theme==='fire')return{out:'#311c1b',floor:'#a65e3f',alt:'#b96c47',line:'#79412f',wall:'#4b3028',top:'#ca7e48',detail:'#f0bd69',danger:'#ff782e'};
 if(level.theme==='geyser')return{out:'#235565',floor:'#779b98',alt:'#84aaa4',line:'#4e7473',wall:'#4a5653',top:'#9eaa83',detail:'#d7d19a',danger:'#80e3e7'};
 if(level.theme==='lava')return{out:'#9c261b',floor:'#69514a',alt:'#745c52',line:'#493630',wall:'#33292a',top:'#805444',detail:'#c18a60',danger:'#ffad32'};
 if(level.theme==='belt')return{out:'#304954',floor:'#9ca49a',alt:'#abb1a5',line:'#717970',wall:'#4b5551',top:'#879a91',detail:'#d7d6b4',danger:'#ffd34c'};
 if(level.theme==='energy')return{out:'#244d45',floor:'#9f9b79',alt:'#b0a982',line:'#6d705f',wall:'#3d584e',top:'#b28750',detail:'#e5c86a',danger:'#f2cc4b'};
 if(level.theme==='cyclotron')return{out:'#1b1735',floor:'#716a8e',alt:'#7e759b',line:'#4e476b',wall:'#302b4b',top:'#65557d',detail:'#b69ad0',danger:'#dc80ff'};
 return{out:'#24545d',floor:'#9ca9a0',alt:'#aab5aa',line:'#737f78',wall:'#485c58',top:'#728f83',detail:'#d0d4af',danger:'#56d7df'};
}
function drawBackdrop(){
 let t=performance.now()*.001;rr(0,0,W,H,'#163f3b');
 // Grande serre colorée, volontairement lisible derrière les menus.
 rr(0,0,W,150,'#61b9c3');for(let y=0;y<150;y+=30)rr(0,y,W,4,'#244b49');for(let x=0;x<W;x+=64){rr(x,0,6,150,'#244b49');poly([[x+8,7],[x+58,7],[x+8,54]],'rgba(255,247,183,.22)')}
 rr(0,145,W,13,'#efc967');rr(0,158,W,202,'#8fa27a');
 for(let y=158;y<H;y+=26)for(let x=0;x<W;x+=32){let c=(x/32+y/26)%2?'#a8b38c':'#98a77f';rr(x,y,32,26,c);rr(x,y,32,2,'#cbd0a4');rr(x,y,2,26,'#72866b')}
 // Chaîne de machines animées en fond.
 rr(32,179,576,12,'#263f38');rr(38,173,564,11,'#d8ad62');
 let cols=['#ef813e','#4ab8d3','#67b86b','#e05d78','#75c897','#d6a765','#8b66c7'];
 for(let i=0;i<7;i++){let x=58+i*82,b=Math.round(Math.sin(t*2+i)*2);rr(x-27,186,58,42,'#263f38');rr(x-23,190,50,28,'#465f55');rr(x-18,194,40,17,cols[i]);rr(x-13,198,30,6,'rgba(255,255,255,.35)');rr(x-18,219,40,7,'#30463f');if(i===1)rr(x-6,185-b,12,9,'#dff9f2');if(i===2)for(let q=0;q<3;q++)rr(x-8+q*7,182-(Math.floor(t*8+q*4)%12),3,3,'#dcf3b1');if(i===4)drawTube(x,205-b,'#70d195')}
 // Paillasses latérales et scientifique qui traverse le hall.
 for(let side=0;side<2;side++){let x=25+side*455;rr(x,274,135,22,'#263f38');rr(x+5,268,125,13,'#b77d4d');for(let i=0;i<4;i++)drawTube(x+29+i*23,268+Math.round(Math.sin(t*2+i)*2),cols[i+side*2])}
 let sx=((t*30)%820)-90,sy=319+Math.round(Math.sin(t*8)*2);rr(sx-11,sy+6,22,5,'rgba(19,29,27,.3)');rr(sx-9,sy-16,18,21,'#f2eddb');rr(sx-8,sy-29,16,14,'#dda578');rr(sx-11,sy-32,22,5,'#eff4eb');rr(sx-7,sy-25,14,5,'#34494a');rr(sx-8,sy+4,6,10,'#26363a');rr(sx+2,sy+4,6,10,'#26363a');drawTube(sx+15,sy-5,'#e36e9b');
 for(let i=0;i<11;i++){let x=10+i*63,s=Math.round(Math.sin(t*1.4+i)*3);rr(x,340,7,20,'#28513b');rr(x-8+s,329,18,15,'#3e8452');rr(x+3-s,323,21,19,'#69b66d')}
 CTX.globalAlpha=.13+Math.sin(t*.7)*.025;poly([[40,0],[105,0],[265,360],[170,360]],'#fff0a5');poly([[452,0],[520,0],[620,360],[525,360]],'#f5ffc4');CTX.globalAlpha=1;
 for(let i=0;i<22;i++){let x=(i*47+t*(i%2?7:-5)+W)%W,y=(i*67+t*(i%3?5:-3)+H)%H;rr(x,y,2,2,i%2?'#fff1a6':'#c9f2d5')}
}
function drawTube(x,y,c){rr(x-5,y-23,10,24,'#e8f5ef');rr(x-3,y-11,6,10,c);rr(x-7,y-27,14,5,'#bb8759');rr(x-3,y-20,2,6,'rgba(255,255,255,.6)')}
function drawWorld(){
 let p=palette(),t=performance.now()*.001;rr(0,0,W,H,p.out);
 if(level.theme==='foam'){drawGreenhouseWorld(t);return}
 if(level.theme==='fire'){drawCombustionWorld(t);return}
 if(level.theme==='atlas'){drawAtlasWorld(t);drawSceneFrame();return}
 if(level.theme==='geyser'){drawGeyserWorld(t);drawSceneFrame();return}
 if(level.theme==='lava'){drawLavaWorld(t);drawSceneFrame();return}
 if(level.theme==='belt'){drawBeltWorld(t);drawSceneFrame();return}
 if(level.theme==='energy'){drawEnergyWorld(t);drawSceneFrame();return}
 if(level.theme==='cyclotron'){drawCyclotronWorld(t);drawSceneFrame();return}
 else{for(let y=0;y<H;y+=20)for(let x=0;x<W;x+=24){rr(x,y,24,20,(x/24+y/20)%2?p.out:shade(p.out,7));rr(x+5,y+5,5,2,shade(p.out,18))}}
 drawSceneFrame();
}
function drawAtlasWorld(t){
 rr(0,0,W,H,'#183b42');rr(0,0,W,138,'#397483');for(let x=22;x<620;x+=74){rr(x,18,58,83,'#18343a');rr(x+5,23,48,67,'#72b7bf');poly([[x+8,27],[x+25,27],[x+8,70]],'rgba(255,244,180,.28)');rr(x+26,22,4,70,'#d2b96f')}
 rr(0,122,W,15,'#e1bd66');rr(0,137,W,223,'#315a60');for(let y=145;y<H;y+=30)for(let x=(y%60);x<W;x+=60){rr(x,y,45,19,'#294f55');rr(x+5,y+4,35,3,'#47737a')}
 for(let i=0;i<14;i++){let x=(i*53+Math.floor(t*8))%680-20,y=30+(i*41)%295;rr(x,y,3,3,i%2?'#b6f0e7':'#ffe071')}
}
function drawGeyserWorld(t){
 rr(0,0,W,H,'#153f51');rr(0,0,W,132,'#78c7cc');for(let x=0;x<W;x+=46){rr(x,18,40,92,'#8ad2d0');rr(x+5,22,30,76,'#bde8df');poly([[x+4,101],[x+20,67],[x+39,101]],'#5f8986')}
 rr(0,115,W,18,'#d8ece2');rr(0,133,W,227,'#276879');for(let y=145;y<H;y+=25)for(let x=0;x<W;x+=48){let o=Math.round(Math.sin(t*2+x+y)*5);rr(x+o,y,32,5,'#4b9ba5');rr(x+8-o,y+8,25,3,'#77c9c9')}
 for(let i=0;i<10;i++){let x=30+i*64,h=10+(i%3)*9;rr(x,120-h,30,h,'#557f76');rr(x+5,114-h,20,6,'#d9f1e2')}
}
function drawLavaWorld(t){
 rr(0,0,W,H,'#241819');rr(0,0,W,127,'#432526');for(let x=0;x<W;x+=58){poly([[x,120],[x+16,35+(x%3)*12],[x+35,120]],x%116?'#57302c':'#6f392c');drawCrystal((x+28)/PX,2.7,x%116?'#f06b36':'#ffb13d')}
 rr(0,125,W,235,'#8f241a');for(let y=135;y<H;y+=19)for(let x=-30;x<W+30;x+=54){let q=(x+Math.floor(t*25)+y)%54;rr(q,y+5,39,7,'#d8431e');rr(q+9,y+8,24,4,'#ff8428');rr(q+17,y+10,10,2,'#ffd04b')}
 for(let i=0;i<18;i++){let x=(i*71+t*17)%680-20,y=340-((t*30+i*23)%320);rr(x,y,3+(i%2)*2,3+(i%2)*2,i%3?'#ff7b29':'#ffd359')}
}
function drawBeltWorld(t){
 rr(0,0,W,H,'#172e37');rr(0,0,W,125,'#607d86');for(let x=0;x<W;x+=92){rr(x+8,18,70,79,'#203a43');rr(x+13,23,60,58,'#8eb0b5');rr(x+17,27,52,50,'#244e5a');for(let q=0;q<4;q++)rr(x+20+q*13,31,7,42,'#70a7ae')}
 rr(0,112,W,18,'#e0b94c');rr(0,130,W,230,'#344c52');for(let y=145;y<H;y+=45){rr(0,y,W,13,'#1c343c');for(let x=(Math.floor(t*35)%40)-40;x<W;x+=40)poly([[x,y+2],[x+16,y+6],[x,y+11]],'#e9c548')}
 for(let x=24;x<620;x+=96){rr(x,305,54,17,'#263a3f');rr(x+5,299,44,11,'#52676d');rr(x+13,295,26,6,'#e0b94c')}
}
function drawEnergyWorld(t){
 rr(0,0,W,H,'#173b35');rr(0,0,W,124,'#6fa99c');
 for(let x=0;x<W;x+=72){rr(x+8,18,55,68,'#223d38');rr(x+14,24,43,45,'#8ec4b8');for(let q=0;q<3;q++)rr(x+18+q*12,28,8,35,q%2?'#d6efcf':'#7bb7b2');rr(x+16,75,39,7,'#e3c76f')}
 rr(0,112,W,18,'#d7bd5f');rr(0,130,W,230,'#4b654f');
 for(let i=0;i<9;i++){let x=30+i*68,s=Math.round(Math.sin(t*1.1+i)*3);rr(x,105,34,17,'#243d35');rr(x+4,108,26,10,i%2?'#364f7f':'#365f8f');rr(x+4+s,108,4,10,'#8fc5e6')}
 for(let i=0;i<5;i++){let x=72+i*118,y=44,a=t*1.7+i;rr(x-3,y-4,6,54,'#32453e');for(let q=0;q<3;q++){let r=a+q*2.09;poly([[x,y+5],[x+Math.cos(r)*22,y+5+Math.sin(r)*16],[x+Math.cos(r+.22)*8,y+5+Math.sin(r+.22)*6]],'#eef3d9')}} 
}
function drawCyclotronWorld(t){
 rr(0,0,W,H,'#12102a');for(let i=0;i<65;i++){let x=(i*89)%640,y=(i*53)%360;rr(x,y,i%5?2:3,i%5?2:3,i%3?'#74649b':'#d88cff')}
 let cx=320,cy=185;for(let r=75;r<310;r+=58){CTX.strokeStyle=r%2?'#473a70':'#68518c';CTX.lineWidth=8;CTX.beginPath();CTX.ellipse(cx,cy,r,r*.55,0,0,Math.PI*2);CTX.stroke()}
 for(let i=0;i<8;i++){let a=t*.38+i*Math.PI/4,x=cx+Math.cos(a)*270,y=cy+Math.sin(a)*145;rr(x-11,y-6,22,12,'#342950');rr(x-6,y-3,12,6,i%2?'#d184f0':'#73d9e7')}
}
function drawCombustionWorld(t){
 rr(0,0,W,H,'#281b1b');rr(0,0,W,142,'#4a2825');
 for(let y=8;y<142;y+=22)for(let x=(y/22%2)*18-18;x<W;x+=36){rr(x,y,34,18,'#743b30');rr(x,y,34,3,'#9c5140');rr(x+32,y,3,18,'#3b2523')}
 rr(20,18,600,13,'#242222');rr(20,31,600,7,'#d38b42');
 for(let x=42;x<610;x+=94){rr(x,48,64,70,'#252627');rr(x+6,54,52,57,'#5c352d');rr(x+11,60,42,41,'#1d2020');rr(x+15,65,34,31,'#d6572d');rr(x+20,72,24,19,Math.floor(t*5)%2?'#ff9a35':'#f2722c');rr(x+27,62,10,5,'#f0b14c')}
 rr(0,135,W,13,'#d18a40');rr(0,148,W,212,'#751d18');
 for(let y=148;y<H;y+=16){
  let shift=Math.sin(t*1.4+y*.06)*18;
  for(let x=-70;x<W+70;x+=74){
   let flow=x+shift+((t*22+y*.4)%74);
   rr(flow,y+4,52,8,'#b8321d');rr(flow+8,y+6,38,6,'#eb4d20');rr(flow+18,y+8,21,4,'#ff9b2e');rr(flow+25,y+9,9,2,'#ffe069')
  }
 }
 for(let i=0;i<18;i++){let bx=(i*67+Math.sin(t*.8+i)*31+640)%640,by=162+(i*37)%190,r=2+(i%4);rr(bx-r,by-r+Math.sin(t*3+i)*3,r*2,r*2,i%3?'#ffbd43':'#ef6529');if(i%4===0)rr(bx-1,by-r-4,3,3,'#ffe38a')}
 for(let x=25;x<620;x+=76){rr(x,112,10,28,'#262829');rr(x+8,116,50,8,'#343638');rr(x+49,116,8,20,'#262829');rr(x+16,114,8,5,'#d89343')}
 for(let i=0;i<18;i++){let x=(i*57+t*(i%2?5:-3)+W)%W,y=(i*43-t*(i%3?9:5)+H)%H;rr(x,y,2,2,i%3?'#e99b45':'#ffe07b')}
}
function drawGreenhouseWorld(t){
 rr(0,0,W,H,'#19392d');rr(0,0,W,126,'#95c9aa');rr(0,0,W,22,'#f3d88e');
 for(let i=0;i<20;i++){let x=(i*41+Math.floor(t*3))%660-10,h=18+(i%4)*8;rr(x,106-h,28,h,'#326e4b');rr(x+8,98-h,23,h,'#4c965f');rr(x+17,105-h,20,h,'#72b76b')}
 rr(24,20,592,111,'#253f36');rr(30,25,580,101,'#78b2a0');
 for(let x=32,i=0;x<610;x+=48,i++){let c=['#86c8bf','#e7c981','#b7a0d0','#91cbb4'][i%4];rr(x,28,44,93,c);rr(x+4,32,36,85,shade(c,12));poly([[x+5,33],[x+22,33],[x+5,91]],'rgba(255,255,255,.32)');rr(x+20,28,4,93,'#345a4c')}
 rr(28,20,584,8,'#d6ad58');rr(28,120,584,11,'#315145');for(let x=28;x<612;x+=48)rr(x,22,5,104,'#315145');
 rr(23,130,594,13,'#263c34');rr(28,131,584,7,'#d3ad61');
 for(let i=0;i<9;i++){let x=42+i*68,s=Math.round(Math.sin(t*1.2+i)*2);rr(x,113,5,28,'#356d49');rr(x-8+s,121,15,11,'#4d9659');rr(x+1-s,112,18,12,'#6aae68')}
 // coins organiques: la serre forme un grand ovale végétal plutôt qu'une boîte
 for(let i=0;i<5;i++){let y=137+i*43,cut=Math.abs(2-i)*18;rr(0,y,25+cut,45,'#18372b');rr(615-cut,y,25+cut,45,'#18372b')}
 rr(21,137,12,200,'#233b32');rr(607,137,12,200,'#233b32');for(let y=145;y<334;y+=34){rr(23,y,8,5,'#d0a95e');rr(609,y,8,5,'#d0a95e')}
}
function drawSceneFrame(){
 let p=palette();
 rr(22,32,596,10,'rgba(20,29,27,.36)');rr(25,34,590,7,p.wall);rr(28,35,584,3,p.detail);
 rr(22,42,10,284,'rgba(20,29,27,.32)');rr(608,42,10,284,'rgba(20,29,27,.32)');
 if(level.theme==='foam'){
  rr(28,8,584,34,'#203f34');for(let x=34,i=0;x<610;x+=48,i++){let glass=['#78cbd0','#efd18a','#bda7db','#8ed6c4'][i%4];rr(x,12,44,26,'#263f37');poly([[x+4,15],[x+21,15],[x+21,35],[x+4,35]],glass);poly([[x+24,15],[x+40,15],[x+40,35],[x+24,35]],shade(glass,18));poly([[x+5,16],[x+12,16],[x+5,30]],'rgba(255,255,255,.42)');rr(x+20,13,4,24,'#e3c375')}
  for(let x=45;x<610;x+=62){rr(x,36,40,13,'#315a49');rr(x+4,38,32,8,'#88c888');rr(x+14,29,7,10,'#609966')}
 }
 else if(level.theme==='fire'){for(let x=45;x<610;x+=70){rr(x,18,45,14,'#4e2d27');rr(x+5,21,35,5,'#cc7440');rr(x+15,12,9,10,'#f09a49')}}
 else if(level.theme==='geyser'){for(let x=40;x<610;x+=75){rr(x,20,48,10,'#416d70');rr(x+4,22,40,4,'#a8c8b4');drawValve((x+24)/PX,.65)}}
 else if(level.theme==='lava'){for(let x=35;x<620;x+=58)drawCrystal((x+15)/PX,.8,x%116?'#ef6533':'#ffb13d')}
 else if(level.theme==='belt'){rr(25,18,590,13,'#263d44');for(let x=32;x<610;x+=30){rr(x,20,18,7,'#718287');rr(x+4,22,10,3,'#e1bd4d')}}
 else if(level.theme==='cyclotron'){for(let x=45;x<610;x+=72){rr(x,16,42,17,'#392d5d');rr(x+4,19,34,10,'#715799');rr(x+14,21,14,6,'#d682f0')}}
}
function shade(hex,n){let v=parseInt(hex.slice(1),16),r=Math.max(0,Math.min(255,(v>>16)+n)),g=Math.max(0,Math.min(255,((v>>8)&255)+n)),b=Math.max(0,Math.min(255,(v&255)+n));return`rgb(${r},${g},${b})`}
function drawConveyorTile(px,py,b,t){
 let axis=b.axis||'x',dir=b.dir||1,boost=beltBoost>0,o=((t*(boost?58:38)*dir)%28+28)%28;
 rr(px+1,py+3,PX-2,PY-6,'#222e32');
 rr(px+2,py+5,PX-4,PY-10,'#47575a');
 if(axis==='x'){
  rr(px+2,py+8,PX-4,12,'#1b272b');rr(px+2,py+8,PX-4,2,'#8b9897');rr(px+2,py+18,PX-4,2,'#10191c');
  for(let q=-34;q<PX+34;q+=28){let x=px+q+o;poly(dir>0?[[x,py+14],[x+10,py+9],[x+10,py+12],[x+21,py+12],[x+21,py+16],[x+10,py+16],[x+10,py+19]]:[[x+21,py+14],[x+11,py+9],[x+11,py+12],[x,py+12],[x,py+16],[x+11,py+16],[x+11,py+19]],boost?'#ffdf62':'#f0ca45')}
  for(let q=4;q<PX;q+=18){rr(px+q,py+4,7,4,'#9aa4a0');rr(px+q,py+20,7,4,'#11191b')}
 }else{
  rr(px+9,py+4,14,PY-8,'#1b272b');rr(px+9,py+4,2,PY-8,'#8b9897');rr(px+21,py+4,2,PY-8,'#10191c');
  for(let q=-34;q<PY+34;q+=24){let y=py+q+o;poly(dir>0?[[px+16,y+21],[px+10,y+11],[px+13,y+11],[px+13,y],[px+19,y],[px+19,y+11],[px+22,y+11]]:[[px+16,y],[px+10,y+10],[px+13,y+10],[px+13,y+21],[px+19,y+21],[px+19,y+10],[px+22,y+10]],boost?'#ffdf62':'#f0ca45')}
  for(let q=3;q<PY;q+=16){rr(px+4,py+q,5,7,'#9aa4a0');rr(px+23,py+q,5,7,'#11191b')}
 }
 if(boost){rr(px+3,py+3,PX-6,3,'#ff8a3d');rr(px+3,py+PY-6,PX-6,3,'#ff8a3d')}
}
function drawEnergyConveyorTile(px,py,t){
 let rush=energyRush>0,brake=energyBrake>0,dir=1,o=((t*(rush?54:brake?14:31)*dir)%30+30)%30,c=rush?'#ff9a3f':brake?'#77e2c8':'#f1d34f';
 rr(px+1,py+4,PX-2,20,'#263836');rr(px+3,py+6,PX-6,16,'#344c4b');rr(px+3,py+8,PX-6,12,'#172526');
 rr(px+3,py+6,PX-6,2,'#d4bd6b');rr(px+3,py+20,PX-6,2,'#101817');
 for(let q=-30;q<PX+30;q+=24){let x=px+q+o;poly([[x,py+14],[x+8,py+9],[x+8,py+12],[x+19,py+12],[x+19,py+16],[x+8,py+16],[x+8,py+19]],c)}
 for(let q=4;q<PX;q+=16){rr(px+q,py+4,7,4,'#718c88');rr(px+q,py+22,7,3,'#111918')}
 if(brake)for(let q=5;q<PX;q+=11)rr(px+q,py+8,4,12,'rgba(119,226,200,.38)');
 if(rush){rr(px+2,py+4,PX-4,3,'#ff6b36');rr(px+2,py+21,PX-4,3,'#ff6b36')}
}
function floorTile(x,y){
 let p=palette(),px=X(x),py=Y(y),c=(x+y)%2?p.floor:p.alt;
 if(level.theme==='fire')c=x<9?((x+y)%2?'#8b493b':'#9b5542'):x>10?((x+y)%2?'#667b82':'#748990'):((x+y)%2?'#5f4b43':'#6a554b');
 rr(px,py,PX,PY,c);
 rr(px,py,PX,2,shade(c,12));rr(px,py,2,PY,shade(c,8));rr(px+PX-2,py,PX?2:2,PY,p.line);rr(px,py+PY-2,PX,2,p.line);
 if((x*7+y*13)%8===0){rr(px+8,py+7,4,3,shade(c,18));rr(px+13,py+9,3,2,shade(c,-8))}
 if(level.theme==='atlas'&&(x+y)%5===0){rr(px+7,py+8,18,3,'#69d4da');rr(px+12,py+13,8,2,'#f3d36d')}
 if(level.theme==='geyser'&&(x*3+y)%5===0){rr(px+5,py+6,22,3,'#d8f3e8');rr(px+10,py+12,13,2,'#78c6c5')}
 if(level.theme==='lava'&&(x+y)%4===0){rr(px+7,py+6,4,13,'#d16d42');rr(px+11,py+15,12,3,'#f09a4a')}
 if(level.theme==='cyclotron'&&(x+y)%3===0){rr(px+6,py+12,20,2,'#c17ae4');rr(px+14,py+6,3,14,'#78cfe3')}
 let belt=level.theme==='belt'?beltAt(x+.5,y+.5):null;if(belt)drawConveyorTile(px,py,belt,performance.now()*.001);
 if(level.theme==='energy'&&Math.abs(y-(level.energy?Math.floor(level.energy.beltY):4))<=0)drawEnergyConveyorTile(px,py,performance.now()*.001);
 drawEdge(x,y);
}
function drawEdge(x,y){
 let p=palette(),px=X(x),py=Y(y),u=map[y-1]?map[y-1][x]:2,d=map[y+1]?map[y+1][x]:2,l=map[y]?map[y][x-1]:2,r=map[y]?map[y][x+1]:2;
 if(u!==0){rr(px,py,PX,6,p.wall);rr(px+2,py+1,PX-4,3,p.detail);for(let q=4;q<PX;q+=9)rr(px+q,py+1,3,3,shade(p.detail,-35))}
 if(d!==0){rr(px,py+PY-5,PX,8,p.wall);rr(px+2,py+PY-5,PX-4,3,p.top);for(let q=4;q<PX;q+=10)rr(px+q,py+PY,5,2,shade(p.wall,-18))}
 if(l!==0){rr(px,py,6,PY,p.wall);rr(px+1,py+3,3,PY-7,p.detail)}
 if(r!==0){rr(px+PX-6,py,6,PY,p.wall);rr(px+PX-4,py+3,3,PY-7,p.top)}
}
function drawFloor(){
 if(level.theme==='foam'){drawGreenhouseFloor();return}
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(map[y][x]!==0)drawPit(x,y);
 drawPlatformShadows();
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(map[y][x]===0)floorTile(x,y);
 drawFloorDecals();
 drawFloorDetails();
}
function drawGreenhouseFloor(){
 rr(24,101,592,228,'#263e34');rr(31,106,578,216,'#9d9c8b');
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(map[y][x]!==0)drawPit(x,y);
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(map[y][x]===0)floorTile(x,y);
 drawFloorDecals();
 for(let x=2;x<19;x++){let px=X(x),py=Y(4);if(x%3===0){rr(px+5,py+8,22,3,'rgba(255,255,255,.2)');rr(px+11,py+13,10,2,'rgba(91,116,91,.25)')}}
 for(let x=3;x<18;x+=5){let px=X(x),py=Y(8);rr(px-8,py+8,48,4,'#d2ba6a');rr(px-8,py+12,48,3,'#554d3d')}
 drawGreenhouseDecor();drawAmbientLife();
}
function drawFloorDecals(){
 let t=performance.now()*.001,p=palette();
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(map[y][x]===0){
  let px=X(x),py=Y(y),seed=(x*41+y*73)%97;
  if(seed%13===0){rr(px+7,py+18,5,3,shade(p.line,12));rr(px+13,py+16,3,2,shade(p.floor,-22))}
  if(seed%17===0)rr(px+22,py+8,4,4,shade(p.alt,-18));
 }
 if(level.theme==='foam'){
  for(let i=0;i<18;i++){let x=2+(i*5)%16,y=3+(i*7)%7,px=X(x)+5+(i%4)*6,py=Y(y)+7+(i%3)*5;rr(px,py,5,3,'#538b5e');rr(px+2,py-3,3,3,'#79c77a');if(i%3===0)rr(px+6,py-1,3,2,'#d7c16d')}
  for(let i=0;i<10;i++){let x=X(3+i*1.55)+Math.sin(t+i)*3,y=Y(8.8)+Math.sin(t*1.7+i)*2;rr(x,y,12,3,'rgba(224,255,233,.48)');rr(x+3,y-4,5,5,'rgba(245,255,248,.8)')}
 }else if(level.theme==='atlas'){
  for(let x=3;x<18;x+=4){rr(X(x)+5,Y(5)+5,54,4,'#e0c35f');rr(X(x)+8,Y(5)+6,11,2,'#26342f');rr(X(x)+29,Y(5)+6,11,2,'#26342f')}
  for(let i=0;i<6;i++){let x=X(4+i*2.6),y=Y(8.7)+Math.sin(t*2+i)*2;rr(x,y,18,4,'#314c48');rr(x+3,y+1,12,2,i%2?'#62d2dd':'#e7c95c')}
 }else if(level.theme==='fire'){
  for(let i=0;i<20;i++){let x=X(2+(i*7)%17)+6,y=Y(2+(i*5)%8)+8,hot=Math.floor(t*5+i)%2;rr(x,y,14,3,hot?'#ff9a38':'#5b3028');if(i%3===0)rr(x+4,y-4,5,3,'#ffd15a')}
 }else if(level.theme==='geyser'){
  for(let i=0;i<16;i++){let x=X(2+(i*6)%16)+5,y=Y(3+(i*4)%7)+7;rr(x,y,19,4,'rgba(188,236,228,.58)');rr(x+3+Math.sin(t+i)*3,y-3,4,4,'#e5fffb')}
 }else if(level.theme==='lava'){
  for(let i=0;i<20;i++){let x=X(2+(i*5)%17)+5,y=Y(2+(i*7)%8)+7;rr(x,y,18,4,'#442f2c');rr(x+2,y+1,14,2,Math.floor(t*6+i)%3?'#8d4935':'#ff7a30')}
 }else if(level.theme==='belt'){
  for(let i=0;i<12;i++){let x=X(2+(i*4)%17)+7,y=Y(2+(i*5)%8)+10;rr(x,y,16,3,'#4b5551');rr(x+3,y-2,4,7,'#d9c26f');rr(x+10,y-2,4,7,'#d9c26f')}
 }else if(level.theme==='energy'){
  for(let i=0;i<13;i++){let x=X(2+(i*5)%16)+6,y=Y(3+(i*4)%7)+8,c=i%2?'#e5c86a':'#5fc778';rr(x,y,21,3,'#26342f');rr(x+3,y+1,15,1,c);if(Math.floor(t*4+i)%2)rr(x+18,y-2,4,4,c)}
 }else if(level.theme==='cyclotron'){
  let cx=X(10),cy=Y(6)+12;
  CTX.save();CTX.globalAlpha=.28;
  for(let r=34;r<128;r+=28){CTX.strokeStyle=r%2?'#d184f0':'#78d9e8';CTX.lineWidth=2;CTX.beginPath();CTX.ellipse(cx,cy,r,r*.64,0,0,Math.PI*2);CTX.stroke()}
  CTX.restore();
 }
}
function drawPlatformShadows(){
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(map[y][x]===0){
  let d=map[y+1]?map[y+1][x]:2,r=map[y]?map[y][x+1]:2,px=X(x),py=Y(y);
  if(d!==0)rr(px+5,py+PY+3,PX,9,'rgba(17,24,23,.38)');
  if(r!==0)rr(px+PX+2,py+6,8,PY,'rgba(17,24,23,.26)');
 }}
function drawFloorDetails(){
 if(level.theme==='atlas'){
  drawGrate(8,4,4,2);drawGrate(8,7,4,2);
  for(let x=2;x<19;x+=2){rr(X(x)+9,Y(1)+7,14,5,'#d7b965');rr(X(x)+12,Y(1)+8,8,3,'#4c675f')}
 }else if(level.theme==='fire'){
  for(let x=2;x<9;x+=2){rr(X(x)+6,Y(2)+5,20,6,'#64372c');rr(X(x)+9,Y(2)+7,14,2,'#f19645')}
  for(let x=12;x<19;x+=2){rr(X(x)+6,Y(2)+5,20,6,'#405b63');rr(X(x)+9,Y(2)+7,14,2,'#9fe5e8')}
  for(let y of [5,7])for(let x of [7,8,11,12]){rr(X(x)+3,Y(y)+3,26,4,'#252627');rr(X(x)+6,Y(y)+4,8,2,'#ffbf43');rr(X(x)+18,Y(y)+4,8,2,'#ff5d35')}
  drawGrate(2,4,2,1);drawGrate(17,4,2,1);drawGrate(2,8,2,1);drawGrate(17,8,2,1);
 }else if(level.theme==='foam'){
  for(let i=0;i<12;i++){let x=2+(i*7)%16,y=2+(i*5)%8;rr(X(x)+7,Y(y)+8,7,5,'#4f8761');rr(X(x)+10,Y(y)+5,3,4,'#83c98e')}
  drawGreenhouseDecor();
 }
 drawThemeProps();
}
function drawGreenhouseDecor(){
 let t=performance.now()*.001;
 rr(34,132,25,74,'#304b3e');rr(38,136,17,66,'#516a59');for(let y=143;y<195;y+=17)rr(40,y,13,4,'#d7c277');txt('SÛR',47,190,'#eef1c8',4);
 rr(581,132,25,74,'#304b3e');for(let y=141;y<196;y+=18){rr(584,y,19,4,'#d7c277');drawTube(590,y+17,['#62c6db','#e16f85','#70c477'][(y/18)%3|0]);drawTube(600,y+17,['#e6c25e','#70c477','#bd83df'][(y/18+1)%3|0])}
 for(let i=0;i<7;i++){let x=55+i*89,s=Math.round(Math.sin(t*1.3+i)*2);rr(x,105,5,22,'#3f7452');rr(x-8+s,113,14,9,'#5ca464');rr(x+1-s,106,17,10,'#73bb71')}
 for(let i=0;i<7;i++){let x=45+i*92,s=Math.round(Math.sin(t*1.1+i)*3);rr(x,310,48,16,'#6f4a35');rr(x+3,307,42,7,'#a97247');rr(x+8+s,296,16,14,'#4d9659');rr(x+20-s,291,20,19,'#6fb66d');rr(x+32+s,301,13,10,'#3d8151')}
 rr(63,248,30,18,'#354b43');rr(68,252,20,8,'#8fc4ba');rr(70,255,16,2,'#e7cd76');
 rr(548,248,34,18,'#354b43');rr(553,252,24,4,'#e0c16f');rr(553,259,17,3,'#8fc4ba');
 // tuyaux, sécurité, lampes et ventilation restent sur le pourtour
 rr(31,218,7,82,'#263e37');rr(34,221,3,76,'#c58d55');rr(34,239,17,5,'#c58d55');rr(47,239,5,35,'#263e37');rr(48,268,18,6,'#d7ba6c');
 rr(555,112,45,34,'#304b42');rr(559,116,37,26,'#e8e2bd');rr(563,120,11,11,'#5da768');rr(567,117,3,17,'#eef2d8');rr(560,124,17,3,'#eef2d8');rr(579,119,13,3,'#65766b');rr(579,126,10,3,'#65766b');rr(579,133,12,3,'#65766b');
 for(let i=0;i<3;i++){let x=190+i*130;rr(x,102,4,19,'#344d43');rr(x-12,118,28,5,'#263e37');rr(x-8,123,20,5,'#f0c869');rr(x-5,128,14,3,'rgba(255,239,164,.45)')}
 let fx=584,fy=226,a=t*2.4;rr(fx-18,fy-18,36,36,'#263e37');rr(fx-14,fy-14,28,28,'#69877a');rr(fx-3,fy-3,6,6,'#e0c36d');for(let i=0;i<4;i++){let q=a+i*Math.PI/2;poly([[fx+Math.cos(q)*4,fy+Math.sin(q)*4],[fx+Math.cos(q-.45)*13,fy+Math.sin(q-.45)*13],[fx+Math.cos(q+.45)*13,fy+Math.sin(q+.45)*13]],'#b9c9b8')}
}
function drawThemeProps(){
 if(level.theme==='atlas'){
  drawPipe(17.5,5.3,'#d0b66b');
 }else if(level.theme==='foam'){
 }else if(level.theme==='fire'){
  drawPipe(2.6,5.3,'#e18a45');drawPipe(17.1,6.2,'#78cbd0');drawPipe(3.2,7.45,'#d66c3d');drawPipe(16.7,7.45,'#71c6d2');drawCoal(6.5,5.3);
  let t=performance.now()*.001,cx=X(10),cy=Y(6)+10;rr(cx-37,cy-32,74,59,'#252627');rr(cx-31,cy-27,62,49,'#5c352d');rr(cx-24,cy-20,48,36,'#1c2020');rr(cx-18,cy-15,36,26,Math.floor(t*5)%2?'#e9582d':'#ff8c32');rr(cx-9,cy-34,18,12,'#282a2b');for(let i=0;i<5;i++){let sx=cx-12+i*6+Math.sin(t*2+i)*3,sy=cy-42-((t*15+i*11)%34);rr(sx,sy,8,8,'rgba(214,220,211,.24)')}
  for(let side of [1,19]){let x=X(side),hot=side===1;rr(x-8,Y(6)-18,16,70,'#26282a');rr(x-4,Y(6)-14,8,62,hot?'#b86137':'#477984');for(let y=Y(6)-8;y<Y(6)+45;y+=14){rr(x-9,y,18,5,'#d39b53');rr(x-3,y+1,6,3,hot?'#ffcc55':'#a9eced')}}
  for(let i=0;i<4;i++){let x=X(4+i*4),drop=Y(5)+((t*18+i*23)%58);rr(x-2,Y(4)-20,5,42,'#343536');rr(x-6,Y(4)+18,13,5,'#d19149');rr(x-3,drop,7,13,i%2?'#ff7a29':'#ffb13d')}
 }else if(level.theme==='geyser'){
  drawPipe(2.8,5.4,'#64bac3');drawPipe(16.7,5.6,'#78cbd0');
 }else if(level.theme==='lava'){
  drawCrystal(2.5,5.1,'#ff9b37');drawPipe(15.7,9.2,'#bd6b42');
 }else if(level.theme==='belt'){
  drawPipe(6.5,5.7,'#d7b24e');drawPipe(14.7,5.7,'#d7b24e');
 }else if(level.theme==='energy'){
  drawPipe(4.7,6.2,'#d7b24e');drawPipe(15.3,6.2,'#5f5147');drawBatteryRack(10,3.2);drawSolarPanel(4.7,8.2);drawWindMini(16.5,7.8);
 }else if(level.theme==='cyclotron'){
  drawPipe(7.2,6.1,'#aa83d0');drawPipe(12.8,5.2,'#aa83d0');
 }
 drawAmbientLife();
}
function drawAmbientLife(){
 let t=performance.now()*.001;
 if(level.theme==='atlas'){
  for(let i=0;i<6;i++){let x=X(3+i*3)+Math.floor(Math.sin(t*1.4+i)*2),y=Y(4+(i%2)*4);rr(x,y,7,4,i%2?'#60d6db':'#f2cd5d');rr(x+2,y+1,2,2,'#effff2')}
  let bx=X(10)+Math.round(Math.sin(t*.8)*95);rr(bx-9,Y(6)+8,18,10,'#d7c268');rr(bx-5,Y(6)+5,10,4,'#eef5df');rr(bx-7,Y(6)+18,4,3,'#26342f');rr(bx+3,Y(6)+18,4,3,'#26342f');
 }else if(level.theme==='foam'){
  for(let i=0;i<14;i++){let x=X(2+(i*7)%16)+8+(i%3)*5,y=Y(9)-((Math.floor(t*18+i*17))%150);rr(x,y,5+(i%2)*2,5+(i%2)*2,'rgba(230,255,235,.75)');rr(x+2,y+1,2,2,'#fff')}
 }else if(level.theme==='fire'){
  for(let i=0;i<18;i++){let x=X(1+(i*11)%18)+((i*9)%24),y=Y(9)-((Math.floor(t*28+i*19))%190);rr(x,y,3,3,i%3?'#ff8a32':'#ffe05a')}
  for(let i=0;i<4;i++){let x=X(4+i*4),y=Y(5)-Math.floor((t*15+i*13)%30);rr(x,y,10,4,'rgba(225,215,190,.28)')}
 }else if(level.theme==='geyser'){
  for(let i=0;i<16;i++){let x=X(1+(i*13)%18)+((Math.floor(t*15)+i*7)%22),y=Y(3+(i%6));rr(x,y,7,2,'#9ee2e0')}
 }else if(level.theme==='lava'){
  for(let i=0;i<16;i++){let x=(i*47+Math.floor(t*12))%640,y=340-((Math.floor(t*24+i*29))%330);rr(x,y,3+(i%2)*2,3+(i%2)*2,i%3?'#ff7630':'#ffd34c')}
 }else if(level.theme==='belt'){
  for(let i=0;i<8;i++){let x=((Math.floor(t*35)+i*92)%720)-40,y=Y(4+(i%2)*4)+5;rr(x,y,25,13,'#9b6947');rr(x+3,y+3,19,3,'#d4a45d');rr(x+6,y+13,4,3,'#26342f');rr(x+17,y+13,4,3,'#26342f')}
 }else if(level.theme==='energy'){
  for(let i=0;i<10;i++){let x=X(2+(i*3)%17)+Math.round(Math.sin(t+i)*2),y=Y(2+(i%4)*2)+5;rr(x,y,14,8,i%2?'#26342f':'#d4a34f');rr(x+3,y+2,8,3,i%2?'#f0d86b':'#26342f')}
  for(let i=0;i<6;i++){let x=X(3+i*3.1),y=Y(10.6)+Math.round(Math.sin(t*1.2+i)*2);rr(x,y,5,13,'#2c513c');rr(x-8,y-5,18,9,i%2?'#55aa64':'#75bd6d')}
 }else if(level.theme==='cyclotron'){
  let cx=X(10),cy=Y(6)+12;for(let i=0;i<12;i++){let a=t*1.8+i*Math.PI/6,r=40+(i%3)*18;rr(cx+Math.cos(a)*r-2,cy+Math.sin(a)*r*.65-2,5,5,i%2?'#e18cff':'#82e0ff')}
 }
}
function drawPuddle(x,y,c){let px=X(x),py=Y(y);rr(px-15,py-5,31,11,shade(c,-25));rr(px-11,py-8,23,15,c);rr(px-4,py-6,10,3,shade(c,35));rr(px+9,py+1,5,3,shade(c,20))}
function drawCrate(x,y,c){let px=X(x),py=Y(y);rr(px-12,py-14,24,22,'#392e28');rr(px-10,py-12,20,18,c);rr(px-8,py-10,16,3,shade(c,30));rr(px-8,py+3,16,3,shade(c,-35));rr(px-2,py-10,4,16,shade(c,-25))}
function drawRollingCart(c){
 let px=X(c.x),py=Y(c.y)+5,t=performance.now()*.001,b=Math.round(Math.sin(t*10+c.id)*2)+(c.bump>0?Math.round(Math.sin(t*36)*3):0),dir=(c.dir||1),axis=c.axis||'x';
 rr(px-19,py+6,38,6,'rgba(13,20,22,.42)');
 rr(px-18,py-14+b,36,21,'#202d31');rr(px-15,py-11+b,30,14,'#52676d');rr(px-12,py-8+b,24,8,c.cargo||'#d7b24e');
 rr(px-18,py-17+b,36,5,'#263833');rr(px-13,py-20+b,26,5,'#8ca0a2');
 if(axis==='x'){poly(dir>0?[[px+12,py-3+b],[px+20,py+1+b],[px+12,py+5+b]]:[[px-12,py-3+b],[px-20,py+1+b],[px-12,py+5+b]],'#ffe36d')}
 else{poly(dir>0?[[px-5,py+4+b],[px,py+12+b],[px+5,py+4+b]]:[[px-5,py-13+b],[px,py-21+b],[px+5,py-13+b]],'#ffe36d')}
 for(let i=-10;i<=10;i+=20){let spin=Math.floor(t*12+i+c.id)%2;rr(px+i-4,py+5+b,8,7,'#172126');rr(px+i-2,py+7+b,4,3,spin?'#d8c16b':'#6f8588')}
}
function drawPipe(x,y,c){let px=X(x),py=Y(y);rr(px-14,py-5,28,10,'#303a37');rr(px-12,py-3,24,6,c);rr(px-8,py-6,5,12,'#e0d2a1');rr(px+4,py-6,5,12,'#e0d2a1')}
function drawPlant(x,y){let px=X(x),py=Y(y);rr(px-8,py+1,16,9,'#8d633e');rr(px-6,py-1,12,6,'#b1804d');rr(px-3,py-17,6,18,'#3a7552');rr(px-12,py-14,10,8,'#61a867');rr(px+2,py-18,11,9,'#77bd72')}
function drawVat(x,y,c){let px=X(x),py=Y(y);rr(px-13,py-11,26,20,'#30403b');rr(px-10,py-9,20,16,c);rr(px-12,py-12,24,6,'#d8d19b');rr(px-6,py-9,12,4,'#e3f7df')}
function drawCoal(x,y){let px=X(x),py=Y(y);for(let i=0;i<5;i++){let qx=px-12+(i*9)%24,qy=py-8+(i%2)*7;rr(qx,qy,9,7,'#2f302d');rr(qx+2,qy+1,4,2,'#5c4d42')}}
function drawValve(x,y){let px=X(x),py=Y(y);rr(px-3,py-4,6,13,'#415b5c');rr(px-11,py-8,22,5,'#d3bd70');rr(px-3,py-14,6,14,'#d3bd70');rr(px-7,py-10,14,6,'#62898a')}
function drawSolarPanel(x,y){let px=X(x),py=Y(y);rr(px-24,py-12,48,22,'#26342f');for(let i=0;i<4;i++)for(let j=0;j<2;j++)rr(px-20+i*10,py-8+j*8,8,6,'#36619a');rr(px-3,py+10,6,14,'#26342f')}
function drawWindMini(x,y){let px=X(x),py=Y(y),t=performance.now()*.001;rr(px-3,py-17,6,30,'#26342f');for(let i=0;i<3;i++){let a=t*3+i*2.09;poly([[px,py-19],[px+Math.cos(a)*19,py-19+Math.sin(a)*12],[px+Math.cos(a+.28)*7,py-19+Math.sin(a+.28)*5]],'#eaf0d8')}}
function drawBatteryRack(x,y){let px=X(x),py=Y(y);rr(px-34,py-18,68,24,'#26342f');for(let i=0;i<5;i++){let c=['#65c16e','#efd454','#5fc8df','#7c6fd4','#e3664e'][i];rr(px-28+i*12,py-12,9,14,c);rr(px-26+i*12,py-15,5,4,'#e6f1dd')}}
function drawCrystal(x,y,c){let px=X(x),py=Y(y);poly([[px-12,py+8],[px-8,py-11],[px-2,py-17],[px+2,py+8]],shade(c,-30));poly([[px-2,py+8],[px+2,py-20],[px+9,py-10],[px+13,py+8]],c);rr(px+4,py-12,3,11,shade(c,35))}
function drawGrate(x,y,w,h){
 let px=X(x)+3,py=Y(y)+4,ww=w*PX-6,hh=h*PY-8;rr(px,py,ww,hh,'#344b50');rr(px+3,py+3,ww-6,hh-6,'#1e3439');
 for(let q=5;q<ww-4;q+=9)rr(px+q,py+4,4,hh-8,'#536c70');for(let q=5;q<hh-4;q+=10)rr(px+4,py+q,ww-8,2,'#809193');
}
function drawBenchLinks(){
 let p=palette(),groups={};
 machines.forEach(m=>{if(m.type==='counter')return;let k=Math.round(m.y*10);(groups[k]||(groups[k]=[])).push(m)});
 Object.values(groups).forEach(row=>{row.sort((a,b)=>a.x-b.x);for(let i=0;i<row.length-1;i++){let a=row[i],b=row[i+1],gap=b.x-a.x;if(gap>1.2&&gap<=3.6){let x=X(a.x)+17,y=Y(a.y)-4,w=X(b.x)-X(a.x)-34;rr(x,y,w,7,'#26342f');rr(x+2,y+1,w-4,3,p.top);for(let q=8;q<w-5;q+=13)rr(x+q,y+4,5,3,shade(p.top,-30))}}});
}
function drawPit(x,y){
 let p=palette(),px=X(x),py=Y(y),t=performance.now()*.001,kind=pitKind(x,y);
 if(kind==='lava'){drawLavaPit(px,py,x,y,t)}
 else if(kind==='water'){drawWaterPit(px,py,x,y,t)}
 else if(kind==='void'){drawVoidPit(px,py,x,y,t)}
 else if(level.theme==='fire'){
  let t=performance.now()*.001,wave=Math.sin(t*2.2+x*.8+y*.55),o=((t*15+x*11-y*5)%34+34)%34;
  rr(px,py,PX,PY,wave>0?'#8f241a':'#a52d1c');
  rr(px+o-22,py+5+wave*2,29,7,'#df451e');rr(px+o-13,py+8+wave*2,18,4,'#ff9028');
  rr(px+((o*1.7)%32)-16,py+17-wave*2,24,5,'#f25b20');rr(px+((o*2.4)%31)-10,py+19-wave*2,10,3,'#ffd056')
 }
 else if(level.theme==='geyser'){rr(px,py,PX,PY,'#276879');rr(px+3,py+7,22,3,'#55a7af');rr(px+10,py+16,19,3,'#75c6c7')}
 else if(map[y]&&((map[y-1]&&map[y-1][x]===0)||(map[y+1]&&map[y+1][x]===0))){rr(px,py,PX,PY,shade(p.out,-20));for(let q=2;q<PX;q+=7)rr(px+q,py+3,3,PY-6,shade(p.out,18))}
}
function pitKind(x,y){
 if(level.theme==='lava'||level.theme==='fire')return'lava';
 if(level.theme==='cyclotron'||level.theme==='belt')return'void';
 return'water'
}
function drawWaterPit(px,py,x,y,t){
 let a=Math.sin(t*3+x*.7+y*.4),o=((t*22+x*9+y*5)%38+38)%38;
 rr(px,py,PX,PY,a>0?'#21728b':'#1a607b');
 rr(px,py,PX,3,'#77d8e2');rr(px,py+PY-3,PX,3,'#0f425d');
 for(let q=-26;q<PX+8;q+=20){rr(px+q+o,py+7+a*2,15,3,'#5fc6d7');rr(px+q+8+o*.45,py+17-a*2,12,2,'#a7edf0')}
 if((x+y+Math.floor(t*3))%4===0)rr(px+12,py+11,5,5,'rgba(225,255,255,.55)');
}
function drawLavaPit(px,py,x,y,t){
 let a=Math.sin(t*4+x*.8+y*.6),o=((t*28+x*7-y*11)%44+44)%44;
 rr(px,py,PX,PY,a>0?'#bd291a':'#932015');
 rr(px+o-30,py+5+a*2,34,8,'#df451e');rr(px+o-18,py+9+a*2,20,4,'#ff8a28');
 rr(px+((o*1.7)%38)-22,py+18-a*2,26,5,'#ff5d20');rr(px+((o*2.5)%35)-14,py+20-a*2,12,3,'#ffd056');
 if((x*3+y+Math.floor(t*6))%5===0)rr(px+14,py+8,4,12,'#ffc04c');
}
function drawVoidPit(px,py,x,y,t){
 let a=(Math.sin(t*2.6+x+y)+1)*.5,o=Math.floor(t*8+x*3+y*5)%12;
 rr(px,py,PX,PY,'#080b12');
 rr(px+2,py+2,PX-4,PY-4,'#151329');
 rr(px+6+o,py+6,7,3,a>.5?'#6d55b8':'#32275d');
 rr(px+20-o,py+17,6,3,a>.35?'#8de6ff':'#332947');
 rr(px+4,py+PY-5,PX-8,3,'#05070c');
}
function counterBase(x,y,c){
 rr(x-12,y-11,35,26,'rgba(18,26,24,.34)');rr(x-16,y-23,32,27,'#26342f');rr(x-14,y-21,28,17,c);poly([[x-14,y-21],[x-9,y-26],[x+18,y-26],[x+14,y-21]],shade(c,40));poly([[x+14,y-21],[x+18,y-26],[x+18,y-3],[x+14,y+4]],shade(c,-48));rr(x-14,y-5,28,9,shade(c,-35));rr(x-11,y-2,6,5,'#26342f');rr(x+5,y-2,6,5,'#26342f');rr(x-11,y-18,22,3,shade(c,35));
}
function greenhouseStationBase(x,y,c,type){
 let w=type==='rack'?62:type==='mix'?68:type==='filter'?64:type==='ext'||type==='waste'?44:55,h=type==='mix'?39:type==='filter'?37:34;
 rr(x-w/2,y-11,w+3,18,'rgba(18,26,24,.34)');rr(x-w/2,y-h+5,w,h,'#26342f');rr(x-w/2+3,y-h+8,w-6,h-11,'#465d57');rr(x-w/2+6,y-h+11,w-12,h-19,shade(c,-18));rr(x-w/2+8,y-h+14,w-16,4,shade(c,38));rr(x-w/2+4,y-5,w-8,9,'#33443f');rr(x-w/2+9,y-2,7,5,'#172824');rr(x+w/2-16,y-2,7,5,'#172824')
}
function industrialStationBase(x,y,c,type){
 let w=type==='rack'?62:type==='combust'?68:type==='distill'?64:type==='ext'||type==='waste'?44:56,h=type==='combust'?42:37;
 rr(x-w/2,y-9,w+4,17,'rgba(20,14,14,.42)');rr(x-w/2,y-h+5,w,h,'#252627');rr(x-w/2+3,y-h+8,w-6,h-11,'#55443d');rr(x-w/2+6,y-h+11,w-12,h-19,shade(c,-22));rr(x-w/2+7,y-h+13,w-14,4,shade(c,34));rr(x-w/2+4,y-5,w-8,9,'#342c29');rr(x-w/2+8,y-2,8,5,'#171719');rr(x+w/2-16,y-2,8,5,'#171719');rr(x-w/2+2,y-h+17,4,8,'#d28a42')
}
function themedStationBase(x,y,c,type){
 let p=palette(),w=type==='rack'?62:type==='distill'||type==='filter'?64:type==='delivery'?76:type==='ext'||type==='waste'?44:56,h=type==='distill'?42:37;
 rr(x-w/2+3,y-9,w,17,'rgba(13,20,25,.38)');rr(x-w/2,y-h+5,w,h,'#202d31');rr(x-w/2+3,y-h+8,w-6,h-11,p.wall);rr(x-w/2+6,y-h+11,w-12,h-19,shade(c,-20));rr(x-w/2+7,y-h+13,w-14,4,shade(c,38));rr(x-w/2+4,y-5,w-8,9,shade(p.wall,-20));rr(x-w/2+8,y-2,8,5,'#111b1d');rr(x+w/2-16,y-2,8,5,'#111b1d');
 if(level.theme==='geyser'){rr(x-w/2+2,y-h+18,4,10,'#bceae2');rr(x+w/2-6,y-h+18,4,10,'#6ec5c9')}
 if(level.theme==='lava'){rr(x-w/2+2,y-h+17,4,12,'#ff8a32');rr(x+w/2-6,y-h+17,4,12,'#ffbd43')}
 if(level.theme==='belt'){for(let q=-w/2+6;q<w/2-5;q+=11)rr(x+q,y-6,7,3,'#e1bd4d')}
 if(level.theme==='cyclotron'){rr(x-w/2+4,y-h+7,w-8,3,'#bd82db');rr(x-2,y-h+3,5,7,'#7de0e5')}
}
function drawLoadedTube(m,x,y,t,b){
 let pos={
  water:[-5,-26],co2:[7,-27],ph:[8,-27],filter:[0,-28],mix:[0,-27],label:[0,-24],
  distill:[-10,-28],combust:[0,-25],cool:[0,-27],centrifuge:[0,-26],density:[7,-25],report:[-7,-25]
 }[m.type]||[0,-30],px=x+pos[0],py=y+pos[1]+b;
 if(m.busy>0){
  let q=1-m.busy/m.duration;
  if(m.type==='water')py+=Math.round(q*5);
  if(m.type==='co2')py+=Math.round(Math.sin(t*15)*2);
  if(m.type==='filter')py+=Math.round(q*8);
  if(m.type==='mix'||m.type==='centrifuge'){let a=t*(m.type==='mix'?8:15);px+=Math.round(Math.cos(a)*5);py+=Math.round(Math.sin(a)*3)}
  if(m.type==='combust')py-=Math.round(Math.sin(q*Math.PI)*4);
  if(m.type==='cool')py+=Math.round(Math.sin(t*9)*2);
  if(m.type==='label'||m.type==='report')px+=Math.round(q*5);
 }
 drawTubeHolder(px,py+13,true);drawSample(m.item,px,py,.84);
}
function drawMachineProcessFx(m,x,y,t){
 if(m.busy<=0)return;let q=1-m.busy/m.duration,p=Math.floor(t*12),c=LAB_DATA.machines[m.type].color;
 if(m.type==='water'){rr(x-5,y-47,7,22,'#d7f7f4');rr(x-2,y-44,2,18,'#62d2e8');for(let i=0;i<5;i++){let yy=y-23+((p*2+i*7)%18);rr(x-11+i*5,yy,4,4,i%2?'#bff4f5':'#68d6e5')}rr(x-13,y-18,26,4,'#70d4e6')}
 else if(m.type==='co2'){rr(x-18,y-18,36,4,Math.floor(t*9)%2?'#a8ef7b':'#4d8e55');for(let i=0;i<10;i++){let a=i*1.7+t*5,r=5+(i%4)*3;rr(x+8+Math.cos(a)*r-2,y-24-Math.abs(Math.sin(a))*19-2,4,4,i%2?'#d8ffd1':'#87dd83')}}
 else if(m.type==='ph'){let sy=y-36+Math.floor(q*18);rr(x-12,sy,24,4,'#fff2a6');rr(x-10,sy+4,20,3,['#e45c73','#edca55','#77d789','#5599d0'][Math.floor(t*9)%4]);rr(x-16,y-20,32,4,['#e45c73','#edca55','#77d789','#5599d0'][Math.floor(t*6)%4])}
 else if(m.type==='filter'){for(let i=0;i<6;i++){let yy=y-31+((p+i*5)%22);rr(x-12+i*5,yy,3,5,i%2?'#a9ecdf':'#67c8cf')}rr(x-15,y-16,30,4,'#f1d69a');rr(x-9,y-12,18*q,3,'#66c8cf')}
 else if(m.type==='mix'){for(let i=0;i<10;i++){let a=t*11+i*.62,r=4+i*.95;rr(x+Math.cos(a)*r-2,y-27+Math.sin(a)*r*.58-2,4,4,i%2?'#eff8a7':c)}rr(x-11,y-34+Math.sin(t*8)*2,22,3,'#eaffd1')}
 else if(m.type==='label'){let w=Math.max(3,Math.round(q*25));rr(x-w/2,y-18,w,8,'#fff2bc');for(let i=0;i<w-3;i+=4)rr(x-w/2+2+i,y-16,2,4,'#26342f');rr(x-17,y-23,34,3,Math.floor(t*12)%2?'#ffe064':'#a4b0a7')}
 else if(m.type==='distill'){for(let i=0;i<7;i++){let a=t*2+i*.8;rr(x-14+Math.sin(a)*5,y-50-((p+i*6)%23),5,7,'rgba(230,255,248,.78)')}rr(x+11,y-20+((p*2)%12),3,5,'#79e0dd');rr(x-13,y-18,7,Math.max(2,13*q),'#5fc8df')}
 else if(m.type==='combust'){for(let i=0;i<5;i++)drawFire(x-14+i*7,y-18-Math.abs(Math.sin(t*9+i))*7);rr(x-18,y-43,36,5,Math.floor(t*10)%2?'#ffce4d':'#e95431');for(let i=0;i<4;i++)rr(x-14+i*9,y-51-((p+i*5)%15),5,5,'rgba(72,60,50,.52)')}
 else if(m.type==='cool'){for(let i=0;i<11;i++){let a=t*5+i*.7,r=8+(i%4)*5;rr(x+Math.cos(a)*r-2,y-28+Math.sin(a)*r*.58-2,4,4,i%3?'#eaffff':'#8beeff')}rr(x-15,y-18,30,3,'#caffff')}
 else if(m.type==='centrifuge'){for(let i=0;i<8;i++){let a=t*22+i*Math.PI/4;rr(x+Math.cos(a)*13-2,y-26+Math.sin(a)*8-2,4,4,i%2?'#ffe56b':'#79e5d6')}rr(x-14+Math.sin(t*35)*2,y-38,28,3,'#b9fff4')}
 else if(m.type==='density'){let tilt=Math.round(Math.sin(t*8)*4);rr(x-17,y-39+tilt,14,3,'#ffe37a');rr(x+3,y-39-tilt,14,3,'#ffe37a');rr(x-1,y-42,3,19,'#26342f');rr(x-20,y-24,40,3,'#26342f')}
 else if(m.type==='report'){let hit=Math.floor(t*7)%2?0:4;rr(x+5,y-43+hit,12,9,'#925b39');rr(x+8,y-49+hit,6,8,'#d9b26b');if(hit)rr(x-10,y-18,20,4,'#8754d1');for(let i=0;i<3;i++)rr(x-12+i*9,y-29+((p+i*3)%8),5,2,'#26342f')}
 rr(x-17,y-48,34,4,'#26342f');rr(x-15,y-46,30*q,2,'#ffe064');
}
function drawReadyFx(x,y,t,m){
 let c=m.item&&m.item.ruined?'#ff8a5b':'#75ee8e',pulse=Math.floor(t*8)%2;
 rr(x-20,y-51,40,5,'#26342f');rr(x-17,y-49,34,2,pulse?'#fff0a6':c);
 for(let i=0;i<4;i++){let a=t*4+i*1.57;rr(x+Math.cos(a)*22-2,y-29+Math.sin(a)*9-2,4,4,pulse?'#fff0a6':c)}
}
function drawMachine(m){
 let d=LAB_DATA.machines[m.type],x=X(m.x),y=Y(m.y)+18,t=performance.now()*.001,b=m.busy>0?Math.round(Math.sin(performance.now()*.025)*2):0;
 if(m.type==='delivery'){drawDelivery(x,y,t,m);return}
 if(m.type==='energySource'){drawEnergySource(x,y,t,m);return}
 if(m.type==='renewDepot'||m.type==='nonrenewDepot'){drawEnergyDepot(x,y,t,m);return}
 if(level.theme==='foam'&&m.type!=='counter')greenhouseStationBase(x,y,d.color,m.type);else if(level.theme==='fire'&&m.type!=='counter')industrialStationBase(x,y,d.color,m.type);else if(m.type!=='counter')themedStationBase(x,y,d.color,m.type);else counterBase(x,y,palette().top);
 drawMachineStatusLights(m,x,y,t);
 if(m.type==='rack'){rr(x-12,y-30,24,15,'#40544c');for(let i=0;i<3;i++)drawTube(x-8+i*8,y-16,['#50c5dc','#f0c952','#6fd09a'][i])}
 else if(m.type==='water'){rr(x-12,y-31,24,15,'#e5f3ed');rr(x-8,y-27,16,11,'#44b9d6');rr(x-5+(Math.floor(t*8)%11),y-25,3,3,'#d8f6f5');rr(x+6,y-35,5,12,'#e5f3ed');rr(x+9,y-35,8,4,'#e5f3ed')}
 else if(m.type==='co2'){rr(x-15,y-36,30,22,'#26342f');rr(x-12,y-33,16,15,'#416b54');txt('CO₂',x-4,y-24,'#a8ef7b',5);rr(x+6,y-37,8,21,'#d9eee5');rr(x+8,y-34,4,12,'#65bd70');rr(x+7,y-40,6,4,'#e5c16f');for(let i=0;i<3;i++)rr(x-8+i*5,y-17-(Math.floor(t*10+i*5)%13),3,3,'#c9f2bf')}
 else if(m.type==='ph'){rr(x-15,y-37,30,24,'#26342f');rr(x-12,y-34,24,17,'#e2556a');rr(x-8,y-31,16,10,m.off?'#643844':Math.floor(t*2)%2?'#bdf4ac':'#8edb91');txt('7.0',x,y-23,'#26342f',5);rr(x+11,y-42,4,25,'#e9eee4');rr(x+12,y-45,2,5,'#efca62')}
 else if(m.type==='filter'){rr(x-15,y-38,30,5,'#26342f');rr(x-13,y-36,26,4,'#e8c47b');poly([[x-13,y-32],[x+13,y-32],[x+5,y-15],[x-5,y-15]],'#f0d9a4');poly([[x-8,y-30],[x+8,y-30],[x+3,y-19],[x-3,y-19]],'#66c8cf');rr(x-3,y-15,6,7,'#e7f2e8');rr(x-1,y-9+(Math.floor(t*9)%6),3,3,'#8ee4e5')}
 else if(m.type==='mix'){rr(x-16,y-37,32,23,'#26342f');rr(x-13,y-34,26,17,'#dcefe5');rr(x-9,y-31,18,12,'#77c99a');for(let i=0;i<4;i++)rr(x-7+((Math.floor(t*12+i*5))%15),y-29+(i%2)*5,3,3,'#d9f3a7');rr(x-3,y-41,6,9,'#e7c66e');rr(x-8,y-43,16,4,'#50645c')}
 else if(m.type==='label'){rr(x-16,y-35,32,21,'#26342f');rr(x-13,y-32,26,15,'#ddd8cb');rr(x-9,y-28,18,7,'#f5f0dc');for(let i=0;i<5;i++)rr(x-7+i*3,y-27,1,5,'#26342f');if(Math.floor(t*3)%2)rr(x-8,y-16,16,7,'#fff1ad')}
 else if(m.type==='waste'){rr(x-16,y-35,32,21,'#26342f');rr(x-13,y-32,13,15,'#7e9790');rr(x+2,y-32,11,15,'#b94343');rr(x+4,y-29,7,8,'#742c2e');txt('!',x+7,y-22,'#ffe9b3',6);rr(x-10,y-29,7,3,'#bde3dc')}
 else if(m.type==='distill'){rr(x-16,y-41,11,27,'#26342f');rr(x-13,y-39,6,23,'#dff6ef');rr(x-12,y-26,4,9,'#50b8d1');rr(x-7,y-37,22,4,'#e7f6ef');rr(x+11,y-37,5,24,'#26342f');rr(x+12,y-34,3,17,'#6acda5');rr(x-5,y-40,5,5,'#efca62');rr(x-8,y-26-(Math.floor(t*8)%9),2,2,'#d9fbf5')}
 else if(m.type==='combust'){rr(x-16,y-35,32,21,'#3b322f');rr(x-12,y-31,24,14,'#a44431');rr(x-8,y-27,16,8,'#281e1d');drawFire(x,y-22-b);rr(x-14,y-38,28,4,'#df8b42')}
 else if(m.type==='cool'){rr(x-16,y-38,32,24,'#26342f');rr(x-13,y-35,26,18,'#d9eff0');rr(x-10,y-32,20,12,'#59bad0');for(let i=0;i<4;i++){let a=t*3+i*Math.PI/2;rr(x+Math.cos(a)*7-2,y-26+Math.sin(a)*5-2,4,4,'#e8ffff')}rr(x-13,y-41,26,5,'#88e2e6');rr(x+10,y-34,4,14,'#f0fbf2')}
 else if(m.type==='centrifuge'){rr(x-16,y-36,32,22,'#26342f');rr(x-13,y-33,26,16,'#e4f1eb');rr(x-10,y-31,20,13,'#2d9990');let a=performance.now()*.02;for(let i=0;i<4;i++)rr(x+Math.cos(a+i*1.57)*7-2,y-25+Math.sin(a+i*1.57)*5-2,4,4,'#ffe064');rr(x-7,y-39,14,4,'#79d6cf')}
 else if(m.type==='density'){rr(x-13,y-33,11,17,'#e6deed');rr(x+2,y-33,11,17,'#e2f3ed');rr(x+6,y-25+(Math.floor(t*5)%3),4,8,'#67c2d8');rr(x-11,y-36,7,5,'#f0c85b')}
 else if(m.type==='report'){rr(x-13,y-34,26,19,'#34443e');rr(x-10,y-31,20,12,'#eff2e8');rr(x-7,y-28,14,2,'#8b67cb');rr(x-7,y-24,10,2,'#8b67cb');if(Math.floor(t*3)%2)rr(x+8,y-35,7,7,'#fff0b8')}
 else if(m.type==='ext'){rr(x-6,y-35,13,20,'#dc484e');rr(x-2,y-39,9,5,'#26342f');rr(x+6,y-36,9,3,'#e3f0eb')}
 else if(m.type==='counter'){
  drawPlacementPad(x,y-20,!!m.item);
  if(m.item&&!m.item.tool&&!m.item.energy)drawTubeHolder(x,y-20,true)
 }
 if(m.item){if(m.item.tool)drawExt(x,y-22+b);else if(m.item.energy)drawEnergyItem(m.item,x,y-32+b,.86);else if(m.type==='counter')drawSample(m.item,x,y-34+b,.8);else drawLoadedTube(m,x,y,t,b);if(m.item.ruined){rr(x-16,y-49,32,13,'#39231f');txt('RATE',x,y-40,'#ff8a5b',5);for(let i=0;i<3;i++)rr(x-7+i*7,y-54-Math.floor((t*12+i*3)%8),4,4,'#6c5b4e')}}drawMachineProcessFx(m,x,y,t);if(m.ready&&!m.fire){drawReadyFx(x,y,t,m);rr(x+12,y-35,5,5,Math.floor(performance.now()*.01)%2?'#fff':'#ffe064')}if(m.fire)drawFire(x,y-37);if(m.off){rr(x-15,y-35,30,25,'rgba(20,20,30,.72)');txt('OFF',x,y-20,'#ff8077',6)}
 if((m.failFx||0)>0){let a=Math.floor(t*16)%2,wide=22+Math.round((m.failFx||0)*12);rr(x-wide,y-55,wide*2,7,a?'#ff8a5b':'#d84c3d');rr(x-18,y-44,36,4,a?'#ffd06b':'#ff6b4a');for(let i=0;i<5;i++)rr(x-17+i*8,y-27-Math.floor((t*18+i*5)%20),5,5,i%2?'#5e4138':'#ff8a5b')}
 if(player&&nearest()===m){let q=Math.floor(t*8)%2?2:0;rr(x-22-q,y+10,9,3,'#fff0a0');rr(x+14+q,y+10,9,3,'#fff0a0');rr(x-22-q,y-15,3,9,'#fff0a0');rr(x+20+q,y-15,3,9,'#fff0a0')}
 drawGuidance(m,x,y,t);
}
function drawMachineStatusLights(m,x,y,t){
 if(m.type==='counter')return;
 let c=m.fire?'#ff5b36':m.off?'#756e85':m.busy>0?'#ffe064':m.ready>0?'#75ee8e':'#7bd7e8';
 rr(x-22,y-11,5,5,'#172824');rr(x-21,y-10,3,3,c);
 rr(x+17,y-11,5,5,'#172824');rr(x+18,y-10,3,3,Math.floor(t*3)%2?c:'#2d423d');
 if(m.busy>0){let q=1-m.busy/m.duration;rr(x-18,y+2,36,5,'#172824');rr(x-16,y+4,32*q,2,c)}
 if(m.fire){for(let i=0;i<3;i++)rr(x-25+i*24,y-46-Math.floor((t*16+i*5)%12),5,5,'#4f403a')}
}
function drawGuidance(m,x,y,t){
 let guide=player&&player.carry&&player.carry.energy?energyTarget(player.carry):recommendedType(),target=guide==='fire'?m.fire:m.type===guide;
 if(!target)return;
 let bob=Math.round(Math.sin(t*10)*4),c=guide==='fire'?'#ff6546':'#ffe36d';
 rr(x-14,y-60+bob,28,12,'#26342f');rr(x-11,y-57+bob,22,6,c);poly([[x-7,y-48+bob],[x+7,y-48+bob],[x,y-40+bob]],'#26342f');poly([[x-4,y-48+bob],[x+4,y-48+bob],[x,y-43+bob]],c);
 rr(x-24,y+10,48,3,c);rr(x-24,y-38,3,11,c);rr(x+21,y-38,3,11,c)
}
function drawEnergySource(x,y,t,m){
 rr(x-44,y-19,89,28,'rgba(18,26,24,.4)');rr(x-42,y-25,84,29,'#26342f');rr(x-38,y-21,76,19,'#3f5755');
 for(let q=-31;q<36;q+=16){let o=Math.floor(t*18)%16;poly([[x+q+o,y-12],[x+q+o+7,y-17],[x+q+o+14,y-12],[x+q+o+7,y-7]],'#f0cd4e')}
 rr(x-34,y-37,68,11,'#26342f');rr(x-29,y-34,58,5,'#d49a37');rr(x-27,y-43,18,12,'#6b5946');rr(x+9,y-43,18,12,'#4c7d61');
 if(player&&nearest()===m){rr(x-48,y+11,96,3,'#ffe36d')}
}
function drawEnergyDepot(x,y,t,m){
 let renew=m.type==='renewDepot',c=renew?'#58bd69':'#746250',dark=renew?'#2f7240':'#3d332b';
 rr(x-34,y-12,72,17,'rgba(18,26,24,.42)');rr(x-31,y-30,62,34,'#26342f');rr(x-27,y-26,54,25,dark);rr(x-22,y-20,44,15,c);
 if(renew){rr(x-8,y-27,16,22,'#e7f1d5');rr(x-16,y-13,14,8,'#76d37d');rr(x+2,y-17,15,10,'#8dde78');rr(x-2,y-22,5,18,'#376f42')}
 else{for(let i=0;i<5;i++){let bx=x-20+i*9,by=y-14+(i%2)*3;rr(bx,by,9,7,'#2c2927');rr(bx+2,by+1,4,2,'#5d5047')}rr(x+16,y-25,5,18,'#4a4037');rr(x+14,y-29,9,5,'#d6b166')}
 rr(x-31,y-38,62,9,'#f2e7c5');txt(renew?'R':'N',x,y-31,renew?'#2f8e42':'#5f4b3d',8);
 if(player&&nearest()===m){rr(x-38,y+10,76,3,'#ffe36d')}
 drawGuidance(m,x,y,t);
}
function drawEnergyItem(e,x,y,k=1){
 rr(x-11*k,y-13*k,22*k,25*k,'#26342f');rr(x-8*k,y-10*k,16*k,18*k,e.color);rr(x-6*k,y-8*k,12*k,4*k,shade(e.color,25));rr(x-8*k,y+8*k,16*k,4*k,e.dark);
 txt(e.icon,x,y+2*k,'#fff6d3',Math.max(4,Math.round(7*k)));
}
function drawTubeHolder(x,y,occupied=false){
 rr(x-13,y-3,26,7,'#26342f');rr(x-11,y-1,22,4,'#bd8a55');for(let i=-7;i<=7;i+=7){rr(x+i-3,y-5,6,5,'#26342f');rr(x+i-1,y-4,2,3,occupied&&i===0?'#e8f3e9':'#6c5a45')}
}
function drawPlacementPad(x,y,occupied){
 if(occupied)return;
 rr(x-10,y-5,20,9,'#26342f');rr(x-8,y-3,16,5,'#d5b26b');rr(x-5,y-1,10,2,'#f0d58a')
}
function drawDelivery(x,y,t,m){
 if(level.theme==='fire'){rr(x-48,y-19,96,25,'#252627');rr(x-44,y-15,88,17,'#5a6b68');for(let q=-38;q<42;q+=16)rr(x+q,y-17,8,5,'#d18a40')}
 rr(x-39,y-11,82,17,'rgba(18,26,24,.4)');poly([[x-39,y-26],[x+31,y-26],[x+43,y-16],[x-27,y-16]],'#e8e1bd');rr(x-41,y-16,84,20,'#26342f');rr(x-36,y-12,74,12,'#4d765d');
 for(let q=-31;q<35;q+=11)rr(x+q,y-10,6,8,'#9db69a');poly([[x-9,y-13],[x+9,y-13],[x+17,y-6],[x+9,y+1],[x-9,y+1],[x-1,y-6]],Math.floor(t*3)%2?'#f8f0b3':'#81e28e');
 rr(x-31,y-36,64,10,'#26342f');for(let q=-25;q<28;q+=11)rr(x+q,y-33,7,4,Math.floor(t*4+q)%2?'#70d681':'#dce6ca');rr(x+35,y-35,8,22,'#d94d4f');rr(x+38,y-40,6,7,'#f7efe0');
 if(m.item)drawSample(m.item,x,y-32,.8)
 drawGuidance(m,x,y,t);
}
function drawSample(s,x,y,k=1){let c=s.ruined?'#68513d':s.color||'#70c9dc';rr(x-5*k,y-15*k,10*k,15*k,'#e9f6ef');rr(x-3*k,y-7*k,6*k,7*k,c);rr(x-6*k,y-18*k,12*k,4*k,'#bd895b');if(s.report){rr(x+4*k,y-15*k,7*k,9*k,'#fff0b8');rr(x+5*k,y-13*k,5*k,2*k,'#8b67cb')}if(s.label){rr(x-7*k,y-11*k,4*k,7*k,'#fff1ad');rr(x-6*k,y-9*k,2*k,1*k,'#26342f')}}
function drawPlayer(){
 let x=X(player.x),groundY=Y(player.y)+17,dashLift=player.dash>0?Math.round(Math.sin(Math.min(1,player.dash/.29)*Math.PI)*7):0,party=player.celebrate>0?Math.abs(Math.sin(player.celebrate*19))*8:0,jump=party+dashLift,y=groundY-jump,v=Math.hypot(player.vx,player.vy),running=v>6,f=v>.3?Math.floor(performance.now()/(running?48:82))%4:0,b=f%2?2:0,step=[-3,0,3,0][f],side=Math.cos(player.dir),front=Math.sin(player.dir),lean=player.dash>0?Math.round(Math.cos(player.dir)*3):0;
 rr(x-13-jump*.18,groundY+7,26+jump*.36,5,'rgba(19,15,14,'+(0.35-jump*.012)+')');
 if(player.dash>0){let dx=Math.cos(player.dir),dy=Math.sin(player.dir);for(let i=1;i<7;i++){let a=1-i*.12;rr(x-dx*i*9-7,y-dy*i*7+2,14-i,5,'rgba(190,245,245,'+a+')');if(i%2)rr(x-dx*i*12-3,y-dy*i*9-7,5,5,'rgba(255,246,168,'+(a*.55)+')')}}
 rr(x-9+step+lean,y+1+b,7,11,'#26363a');rr(x+2-step+lean,y+1+b,7,11,'#26363a');rr(x-10+step+lean,y+10+b,8,4,'#162224');rr(x+2-step+lean,y+10+b,8,4,'#162224');
 rr(x-11+lean,y-15+b,22,19,'#f1ecdc');rr(x-3+lean,y-12+b,6,16,'#e95c58');rr(x-14-side*2+lean,y-10+b,5,13,'#f1ecdc');rr(x+9-side*2+lean,y-10+b,5,13,'#f1ecdc');rr(x-15-side*2+lean,y+1+b,6,5,'#50b9cc');rr(x+10-side*2+lean,y+1+b,6,5,'#50b9cc');
 rr(x-10+lean,y-29+b,20,15,'#dda578');rr(x-13+lean,y-32+b,26,6,'#eff4eb');rr(x-9+lean,y-37+b,18,8,'#e3ece7');
 if(front>-.4){rr(x-9+side*2+lean,y-25+b,18,6,'#34494a');rr(x-6+side*2+lean,y-23+b,4,3,'#b9e8ed');rr(x+2+side*2+lean,y-23+b,4,3,'#b9e8ed');rr(x-3+side*2+lean,y-17+b,6,2,'#855242')}else{rr(x-7+lean,y-27+b,14,7,'#986a50')}
 rr(x-13+lean,y-31+b,4,4,'#704b38');rr(x+9+lean,y-31+b,4,4,'#704b38');
 if(running){rr(x-16+lean,y-17+b,4,3,'#d9ffff');rr(x+12+lean,y-17+b,4,3,'#d9ffff')}
 if(player.celebrate>0){rr(x-19,y-25,6,14,'#f1ecdc');rr(x+13,y-25,6,14,'#f1ecdc');rr(x-20,y-29,7,6,'#dda578');rr(x+13,y-29,7,6,'#dda578')}
 if(player.carry){let hx=x+Math.cos(player.dir)*16,hy=y-5+b+Math.sin(player.dir)*9;rr(hx-11,hy-2,6,5,'#dda578');rr(hx+5,hy-2,6,5,'#dda578');player.carry.tool?drawExt(hx,hy):player.carry.energy?drawEnergyItem(player.carry,hx,hy,.85):drawSample(player.carry,hx,hy,1)}
 if(player.spray>0){let dx=Math.cos(player.dir),dy=Math.sin(player.dir);rr(x+dx*14-5,y-9+dy*6,10,8,'#dc484e');rr(x+dx*18-2,y-14+dy*6,6,5,'#26342f');for(let i=1;i<9;i++){let spread=Math.sin(performance.now()*.04+i*8)*i*1.8,px=x+dx*(16+i*8)-dy*spread,py=y-7+dy*(10+i*5)+dx*spread*.45;rr(px-4,py-3,8+i,6,'rgba(236,255,250,'+(1-i*.09)+')');if(i%2)rr(px+2,py-6,4,4,'#fff')}}
}
function drawExt(x,y){rr(x-5,y-15,10,16,'#dc484e');rr(x-2,y-19,8,5,'#26342f');rr(x+5,y-16,8,3,'#e5f2ec')}
function drawFire(x,y){let f=Math.floor(performance.now()*.018)%3;rr(x-11,y-5,22,7,'#d43c25');rr(x-8,y-13+f,16,12,'#ff7a29');rr(x-4,y-20-f,8,14,'#ffe052');rr(x-2,y-15,4,10,'#fff0a0')}
function drawHazards(){
 let t=performance.now()*.001;
 if(level.theme==='foam')foamZones.forEach((z,zi)=>{
  let minX=Math.floor(z.x-z.r),maxX=Math.ceil(z.x+z.r),minY=Math.floor(z.y-z.r),maxY=Math.ceil(z.y+z.r);
  for(let yy=minY;yy<=maxY;yy++)for(let xx=minX;xx<=maxX;xx++)if(tile(xx+.5,yy+.5)===0&&Math.hypot(xx+.5-z.x,yy+.5-z.y)<z.r){
   let seed=Math.abs(xx*17+yy*29+zi*11),px=X(xx+.5)+(seed%9)-4,py=Y(yy+.5)+6+((seed>>2)%5)-2,off=Math.round(Math.sin(t*2+xx*3+yy+z.phase)*2),wide=24+(seed%9);
   rr(px-wide/2,py-3,wide,8,'rgba(169,211,181,.72)');rr(px-11,py-8+off,10+(seed%5),10,'#effff1');rr(px-1,py-12-off,11+((seed>>1)%5),14,'#dcf7e2');rr(px+7,py-6+off,8+((seed>>2)%4),9,'#c4e9ce');rr(px-5,py-5,4,4,'#8fc7a0');rr(px+4,py-9,3,3,'#fff');if(seed%3===0)rr(px-15,py-10-off,8,8,'#f7fff7')
  }
 });
 if(level.theme==='geyser')geysers.forEach(g=>{let x=X(g.x+.5),y=Y(g.y+.5)+8,on=geyserOn(g);rr(x-12,y-5,24,9,'#315d64');rr(x-8,y-3,16,5,'#173940');if(on)for(let i=0;i<5;i++)rr(x-8+(i%3)*6,y-20-i*7+Math.sin(t*8+i)*3,6,25,'#c7f1ef');else if(((t+g.phase)%5)>3.7){rr(x-15,y-9,30,3,'#ffe064');rr(x-2,y-15,4,4,'#ffe064')}});
 if(level.theme==='fire')steamJets.forEach(g=>{let x=X(g.x),y=Y(g.y)+8;if(steamOn(g)){for(let i=0;i<6;i++)rr(x-9+(i%3)*7,y-15-i*8+Math.sin(t*12+i)*4,7,29,'rgba(224,248,242,.82)')}else{rr(x-12,y-5,24,8,'#293033');rr(x-8,y-3,16,4,'#71868a');if(steamWarn(g)){rr(x-16,y-10,32,3,'#ffe05d');rr(x-2,y-18,4,5,'#ffe05d')}}});
 if(level.theme==='fire')(level.docks||[]).forEach((d,i)=>{let x=X(d.x),y=Y(d.y),w=X(d.w),h=PY*d.h,c=i%2?'#91e4e8':'#ffbf52';rr(x,y,9,3,c);rr(x,y,3,9,c);rr(x+w-9,y,9,3,c);rr(x+w-3,y,3,9,c);rr(x,y+h-3,9,3,c);rr(x,y+h-9,3,9,c);rr(x+w-9,y+h-3,9,3,c);rr(x+w-3,y+h-9,3,9,c)});
 if(level.theme==='fire')movingIslands.forEach((q,qi)=>{
  let x=X(q.x+q.ox),y=Y(q.y+q.oy),w=X(q.w),h=PY*q.h;
  rr(x+3,y+5,w-3,h-3,'rgba(25,10,8,.56)');rr(x,y,w,h,'#202326');rr(x+3,y+3,w-6,h-6,'#9f7253');rr(x+6,y+6,w-12,h-12,'#bd875b');
  rr(x,y,w,3,'#d79a55');rr(x,y+h-3,w,3,'#563b31');rr(x,y,3,h,'#d79a55');rr(x+w-3,y,3,h,'#563b31');
  for(let j=8;j<w-5;j+=14){rr(x+j,y+5,3,h-10,'#8c6048');rr(x+j+1,y+6,1,h-12,'#dda15e')}
  let dir=Math.cos(t*q.speed+q.phase)>0?1:-1,c=qi%2?'#8de5ed':'#ffbf4e';
  if(q.axis==='x')poly([[x+w/2-dir*5,y+h/2-4],[x+w/2+dir*5,y+h/2],[x+w/2-dir*5,y+h/2+4]],c);
  else poly([[x+w/2-4,y+h/2-dir*5],[x+w/2,y+h/2+dir*5],[x+w/2+4,y+h/2-dir*5]],c);
  rr(x+w/2-5,y+h-7,10,3,Math.floor(t*5+qi)%2?c:'#4b3d34')
 });
 if(level.theme==='lava')lavaBridges.forEach(b=>{if(bridgeOn(b))for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){let warn=bridgeWarn(b)&&Math.floor(performance.now()*.012)%2,panic=bridgePanic>0;rr(X(x)+1,Y(y)+3,30,23,warn?'#d05235':panic?'#b45b48':'#9f6a48');rr(X(x)+3,Y(y)+7,26,4,warn?'#ffd04d':panic?'#ff9a45':'#d89b5d');rr(X(x)+4,Y(y)+18,24,3,'#5c4033');rr(X(x)+3,Y(y)+3,4,4,'#302725');rr(X(x)+24,Y(y)+3,4,4,'#302725')}else{let cx=X(b.x+b.w/2),cy=Y(b.y)+10;for(let i=0;i<5;i++){let a=performance.now()*.002+i*1.3;rr(cx+Math.cos(a)*18-2,cy+Math.sin(a)*7-2,4,4,bridgePanic>0?'#ff6634':'#ffb43b')}}});
 if(level.theme==='cyclotron'){let cx=X(10),cy=Y(6)+12;for(let i=0;i<2;i++){let a=beamAngle+i*Math.PI;for(let q=0;q<12;q++)rr(cx+Math.cos(a)*q*28-4,cy+Math.sin(a)*q*24-4,8,8,'#de7dff')}rr(cx-26,cy-22,52,44,'rgba(150,80,220,.28)')}
 particles.forEach(p=>rr(p.x,sceneOY()+p.y*PY/PX,p.size,p.size,p.color));
}
function drawRouteGuide(){
 if(!player||player.hidden||!player.carry)return;
 let guide=player.carry.energy?energyTarget(player.carry):recommendedType();
 if(!guide||guide==='fire')return;
 let target=machines.filter(m=>m.type===guide).sort((a,b)=>distanceToMachine(a,player.x,player.y)-distanceToMachine(b,player.x,player.y))[0];
 if(!target)return;
 let sx=X(player.x),sy=Y(player.y)+8,tx=X(target.x),ty=Y(target.y)-18,d=Math.hypot(tx-sx,ty-sy),n=Math.max(5,Math.floor(d/22));
 CTX.save();CTX.globalAlpha=.82;
 for(let i=1;i<n;i++){
  let q=i/n,x=sx+(tx-sx)*q,y=sy+(ty-sy)*q+Math.sin(performance.now()*.006+i)*3,blink=(Math.floor(performance.now()*.008+i)%2);
  rr(x-4,y-4,8,8,blink?'#ffe36d':'#fff0a4');rr(x-2,y-2,4,4,'#6b4b22')
 }
 rr(tx-13,ty-14,26,10,'#ffe36d');txt('ICI',tx,ty-6,'#28342d',5);
 CTX.restore()
}
function drawFeedbacks(){
 if(!feedbacks.length)return;
 CTX.save();
 feedbacks.forEach(f=>{
  let a=Math.max(0,Math.min(1,f.life/f.max)),x=X(f.x),y=Y(f.y)-24-(1-a)*20,w=Math.max(42,f.text.length*7+14);
  CTX.globalAlpha=a;rr(x-w/2,y-13,w,17,'#1d2b28');rr(x-w/2+2,y-11,w-4,13,'#31463f');txt(f.text,x,y,f.color,6)
 });
 CTX.restore();CTX.globalAlpha=1
}
function drawFallFx(){
 if(!fallFx||!fallFx.length)return;
 CTX.save();
 fallFx.forEach(f=>{
  let a=Math.max(0,Math.min(1,f.life/f.max)),x=X(f.x),y=Y(f.y)+8,r=(1-a)*24;
  CTX.globalAlpha=a;
  if(f.kind==='water'){
   rr(x-16-r*.35,y-5,32+r*.7,5,'#d9ffff');
   rr(x-11-r*.2,y-11-r*.15,22+r*.4,4,'#80dce8');
   for(let i=0;i<6;i++){let q=i/6*Math.PI*2+r*.04;rr(x+Math.cos(q)*(10+r)-2,y-5+Math.sin(q)*(4+r*.22)-2,4,4,'#efffff')}
  }else if(f.kind==='lava'){
   rr(x-18-r*.25,y-7,36+r*.5,8,'#ff6a28');
   rr(x-10-r*.1,y-15-r*.2,20+r*.2,6,'#ffd050');
   for(let i=0;i<7;i++){let q=i*.9+r*.03;rr(x+Math.cos(q)*(9+r*.45)-2,y-10-r*.35+Math.sin(q)*6,4,8,i%2?'#ff8a30':'#ffe05a')}
  }else{
   rr(x-17-r*.2,y-10-r*.1,34+r*.4,10,'rgba(7,8,16,.9)');
   rr(x-8-r*.12,y-18-r*.28,16+r*.24,7,'#6d55b8');
   for(let i=0;i<5;i++){let q=i*.95+r*.05;rr(x+Math.cos(q)*(9+r*.32)-2,y-14+Math.sin(q)*(6+r*.15)-2,4,4,i%2?'#8de6ff':'#bda7ff')}
  }
 });
 CTX.restore();CTX.globalAlpha=1;
}
function drawGame(){
 let p=palette(),urg=time<35?Math.round(Math.sin(performance.now()*.026)*3):0;drawWorld();CTX.save();CTX.translate(Math.round(shakeX-camX),Math.round(shakeY+urg-camY));drawFloor();drawBenchLinks();drawBiomeLighting();props.filter(p=>p.type==='puddle').forEach(p=>drawPuddle(p.x,p.y,level.theme==='foam'?'#bff2cf':'#63b9c5'));drawHazards();drawFallFx();let actors=machines.map(m=>({y:m.y,fn:()=>drawMachine(m)}));energyItems.forEach(e=>actors.push({y:e.y,fn:()=>drawEnergyItem(e,X(e.x),Y(e.y)+10+Math.round(Math.sin(e.bob)*2),1)}));rollingCarts.forEach(c=>actors.push({y:c.y+.35,fn:()=>drawRollingCart(c)}));props.filter(p=>p.type!=='puddle').forEach(p=>actors.push({y:p.y,fn:()=>drawInteractiveProp(p)}));if(!player.hidden)actors.push({y:player.y+.3,fn:drawPlayer});actors.sort((a,b)=>a.y-b.y).forEach(a=>a.fn());drawFeedbacks();drawForegroundDetails();drawCinematicFrame();CTX.restore();
 let g=CTX.createRadialGradient(320,180,110,320,180,400);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,20,18,.38)');CTX.fillStyle=g;CTX.fillRect(0,0,W,H);if(time<35)rr(0,0,W,H,'rgba(210,40,25,'+((Math.sin(performance.now()*.01)+1)*.025)+')');if(flash>0)rr(0,0,W,H,'rgba(255,90,70,'+flash*.45+')');if(cameraFade>0)rr(0,0,W,H,'rgba(18,29,25,'+Math.min(.92,cameraFade)+')');
}
function drawCinematicFrame(){
 let p=palette();
 rr(21,324,598,4,'rgba(10,18,16,.42)');
 rr(21,36,598,3,'rgba(255,238,158,.16)');
 for(let x=26;x<615;x+=38)rr(x,326,18,2,shade(p.detail,-15));
 if(time<60){let a=(Math.sin(performance.now()*.012)+1)*.5;rr(23,41,6,282,'rgba(255,104,58,'+(.08+a*.05)+')');rr(611,41,6,282,'rgba(255,104,58,'+(.08+a*.05)+')')}
}
function drawInteractiveProp(p){
 if(!p.active){rr(X(p.x)-6,Y(p.y)-2,12,3,'rgba(255,240,170,.45)');return}
 if(p.type==='crate')drawCrate(p.x,p.y,'#cf9558');
 else if(p.type==='valve')drawValve(p.x,p.y);
 else if(p.type==='switch'){let x=X(p.x),y=Y(p.y);rr(x-12,y-17,24,17,'#26342f');rr(x-9,y-14,18,11,'#d8b85e');rr(x-3,y-22,6,14,'#e75b4d');rr(x-7,y-24,14,5,'#f2df91')}
 else if(p.type==='crystal')drawCrystal(p.x,p.y,'#c77cec')
}
function drawBiomeLighting(){
 let t=performance.now()*.001;
 if(level.theme==='foam'){
  rr(29,43,582,42,'rgba(40,91,76,.72)');for(let x=33,i=0;x<610;x+=48,i++){let c=['rgba(115,205,206,.36)','rgba(238,207,133,.28)','rgba(188,155,218,.27)'][i%3];rr(x,46,44,36,c);rr(x+20,46,4,36,'rgba(228,204,132,.72)');poly([[x+5,49],[x+18,49],[x+5,70]],'rgba(255,255,255,.25)')}
  CTX.globalAlpha=.14+Math.sin(t*.8)*.035;poly([[58,30],[124,30],[287,329],[188,329]],'#fff1a9');poly([[270,30],[335,30],[435,329],[340,329]],'#eaffca');poly([[470,30],[530,30],[610,292],[535,292]],'#fff0b2');CTX.globalAlpha=1;
  CTX.globalAlpha=.18+Math.sin(t*.55)*.04;for(let i=0;i<6;i++){let x=55+i*104+Math.sin(t*.35+i)*8;poly([[x,72],[x+23,72],[x+88,316],[x+38,316]],i%2?'#efffc7':'#fff0aa')}CTX.globalAlpha=1;
  for(let x=34;x<610;x+=48){rr(x,44,3,276,'rgba(219,255,237,.22)');rr(x+22,44,2,276,'rgba(63,103,87,.22)')}
  for(let i=0;i<14;i++){let x=38+(i*43)%560,y=48+(i*67)%250;rr(x,y,3,5,'rgba(236,255,246,.55)');rr(x+1,y-3,1,2,'rgba(255,255,255,.7)')}
 }else if(level.theme==='fire'){
  CTX.globalAlpha=.08+Math.sin(t*4)*.02;poly([[160,30],[245,30],[355,340],[265,340]],'#ff9a42');poly([[410,30],[470,30],[550,340],[480,340]],'#ff6b31');CTX.globalAlpha=1;
  CTX.globalAlpha=.07;for(let i=0;i<7;i++){let y=150+i*29+Math.sin(t*2+i)*4;rr(0,y,W,3,i%2?'#ffba55':'#ff6a32')}CTX.globalAlpha=1;
 }else if(level.theme==='geyser'){
  CTX.globalAlpha=.08;for(let i=0;i<7;i++){let x=((t*22+i*105)%760)-80;poly([[x,35],[x+22,35],[x+120,330],[x+80,330]],'#c8ffff')}CTX.globalAlpha=1;
 }else if(level.theme==='cyclotron'){
  let a=.06+Math.sin(t*3)*.03;CTX.globalAlpha=a;rr(0,0,W,H,'#cf83ff');CTX.globalAlpha=1;
 }
}
function drawForegroundDetails(){
 let t=performance.now()*.001;
 if(level.theme==='foam'){for(let i=0;i<10;i++){let x=8+i*69,s=Math.round(Math.sin(t*1.2+i)*3);rr(x,318,7,32,'#3c6d4d');rr(x-10+s,309,18,14,'#4c9258');rr(x+2+s,304,20,17,'#70b76c');rr(x+13-s,315,14,12,'#5ba25f');rr(x+4,327,25,8,'#8c623f')}for(let i=0;i<7;i++){let x=24+i*96,s=Math.round(Math.sin(t+i)*2);rr(x+s,38,5,34,'#315f43');rr(x-6+s,57,14,8,'#4d9b5b');rr(x+2-s,48,16,9,'#65b568');rr(x-4+s,69,13,8,'#4d9b5b')}}
 else if(level.theme==='fire'){
  rr(0,330,W,30,'#211b1b');for(let x=18;x<640;x+=72){rr(x,315,11,45,'#252627');rr(x+8,320,50,8,'#373839');rr(x+46,320,10,40,'#252627');rr(x+18,317,8,5,'#d38b42')}
  for(let i=0;i<5;i++){let x=42+i*142,s=Math.round(Math.sin(t*1.3+i)*2);for(let y=38;y<92+i%2*20;y+=9){rr(x+s,y,5,7,'#282829');rr(x+1+s,y+1,3,5,'#b77945')}rr(x-5+s,88+i%2*20,15,7,'#252627');rr(x-2+s,90+i%2*20,9,3,'#e49246')}
  for(let x of [8,610]){rr(x,168,22,58,'#252627');rr(x+4,172,14,50,'#6f3b31');rr(x+7,177,8,30,'#e55a2e');rr(x+5,211,12,6,'#f1a149')}
 }else if(level.theme==='energy'){
  for(let x=8;x<620;x+=90){rr(x,324,54,20,'#26342f');rr(x+5,317,44,13,'#b28750');for(let i=0;i<3;i++)rr(x+10+i*12,310+(i%2)*3,8,10,i%2?'#f0d86b':'#426d92')}
  let a=t*2.3;for(let x of [28,596]){rr(x-4,151,8,74,'#26342f');for(let i=0;i<3;i++){let r=a+i*2.09;poly([[x,149],[x+Math.cos(r)*22,149+Math.sin(r)*14],[x+Math.cos(r+.25)*8,149+Math.sin(r+.25)*5]],'#eff0d9')}}
 }
}
function drawCampaignMap(){
 let c=document.querySelector('#campaignCanvas');if(!c)return;let g=c.getContext('2d'),t=performance.now()*.001,w=c.width,h=c.height;
 g.imageSmoothingEnabled=false;let box=(x,y,ww,hh,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(ww),Math.round(hh))};
 let shape=(pts,col,stroke='#173b45')=>{g.fillStyle=col;g.strokeStyle=stroke;g.lineWidth=4;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fill();g.stroke()};
 box(0,0,w,h,'#287ca7');for(let y=5;y<h;y+=12)for(let x=((y/12)%2)*11-12;x<w;x+=34){let o=Math.floor(t*8)%17;box(x+o,y,13,2,'#4fa4c0');box(x+o+8,y+4,8,2,'#93cbd2')}
 // Chunky biome islands, laid out like a proper overworld route.
 shape([[8,190],[21,169],[59,166],[80,181],[88,221],[67,244],[25,241],[8,222]],'#76ad58');shape([[14,194],[76,186],[76,221],[20,232]],'#9bc766');
 shape([[82,144],[105,124],[149,126],[173,145],[170,184],[142,197],[103,190],[84,171]],'#4f9a56');shape([[91,150],[163,145],[157,177],[103,184]],'#75b966');
 shape([[175,189],[191,170],[229,166],[257,183],[266,220],[242,244],[198,241],[178,221]],'#6d4034');shape([[192,190],[243,185],[253,219],[202,228]],'#ad5032');
 shape([[238,124],[259,107],[301,112],[320,135],[315,173],[286,191],[248,181],[233,153]],'#847445');shape([[250,133],[309,127],[306,162],[254,172]],'#d1b557');
 shape([[263,88],[283,70],[326,73],[345,92],[342,136],[318,153],[279,146],[260,124]],'#d8e5dd');shape([[270,98],[333,91],[332,129],[279,139]],'#79aaa8');
 shape([[352,151],[372,132],[418,133],[442,153],[440,197],[416,219],[373,211],[352,189]],'#5d3932');shape([[364,159],[430,151],[428,192],[374,202]],'#a34d32');
 shape([[325,33],[343,17],[389,17],[413,35],[410,75],[389,91],[345,87],[326,70]],'#a68d65');shape([[337,42],[400,35],[397,70],[345,77]],'#d2b759');
 shape([[425,19],[446,8],[482,13],[496,31],[492,67],[469,82],[438,71],[422,51]],'#443b70');shape([[434,29],[486,24],[484,60],[442,65]],'#6c5696');
 // Dotted route, like a real overworld path.
 let route=pts=>{for(let p=0;p<pts.length-1;p++){let a=pts[p],b=pts[p+1],d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.floor(d/9);for(let i=0;i<=n;i++){let q=i/n,x=a[0]+(b[0]-a[0])*q,y=a[1]+(b[1]-a[1])*q;box(x-3,y-3,7,7,(i+p)%2?'#f6db72':'#fff0a4');box(x-2,y-2,3,3,'#9b6a36')}}};
 route([[50,202],[135,162],[225,210],[278,148],[305,120],[400,179],[365,56],[455,45]]);
 // Pixel scenery: trees, greenhouse glass, volcano, geysers, rails and reactor.
 for(let i=0;i<13;i++){let x=20+(i*19)%62,y=177+(i*13)%54;box(x,y,5,12,'#38693e');box(x-5,y-6,15,10,i%2?'#4b944d':'#65ad55')}
 for(let i=0;i<12;i++){let x=91+(i*23)%72,y=135+(i*17)%48;box(x,y,4,12,'#315f3c');box(x-5,y-5,14,9,'#50a85a')}
 box(114,143,42,24,'#1f4a43');for(let x=118;x<153;x+=9){box(x,147,7,15,'#8dd0ba');box(x+2,149,2,11,'#e7e09a')}
 shape([[205,223],[224,181],[245,223]],'#522727');shape([[214,217],[224,186],[234,217]],Math.floor(t*4)%2?'#ff7a2d':'#e94c25');box(219,179,11,6,'#ffce51');
 for(let i=0;i<4;i++){let x=251+i*13,y=137+(i%2)*8;box(x,y,22,10,'#263b3d');box(x+3,y+3,16,4,'#4d70a3');box(x+3+Math.floor(Math.sin(t+i)*2),y+3,3,4,'#d9e899')}box(286,161,18,16,'#263b3d');box(291,154,8,11,'#f0d670');
 for(let i=0;i<4;i++){let x=280+i*15,y=118+(i%2)*7,up=(Math.floor(t*10+i*7)%22);box(x-4,y,9,5,'#315f67');box(x-2,y-up,5,up,'#c7f2ed');box(x-4,y-up,9,4,'#f4ffff')}
 for(let i=0;i<8;i++){let x=363+i*9;box(x,170,7,3,'#ff8a31');box(x+2,174,5,2,'#ffd14e')}shape([[390,202],[401,165],[412,202]],'#ff6b29');
 box(338,52,57,5,'#493d35');for(let x=342;x<393;x+=10)box(x,54,6,3,'#e0b94c');let trainX=337+((t*13)%48);box(trainX,43,20,10,'#263b3d');box(trainX+3,40,10,5,'#d5a847');box(trainX+3,52,4,3,'#17272a');box(trainX+14,52,4,3,'#17272a');
 let cx=460,cy=45;for(let r=10;r<29;r+=8){g.strokeStyle=r%2?'#d184f0':'#72d8e6';g.lineWidth=3;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.stroke()}box(cx-4,cy-4,8,8,'#fff1a1');
 // Animated clouds and a tiny research boat.
 for(let i=0;i<4;i++){let x=((t*(5+i)+i*137)%570)-40,y=25+i*51;box(x,y,24,6,'rgba(235,250,238,.78)');box(x+7,y-5,13,6,'rgba(235,250,238,.78)')}
 let bx=(t*17)%540-20,by=104+Math.sin(t*2)*3;box(bx,by,25,7,'#704738');box(bx+5,by-8,10,8,'#f0d170');box(bx+14,by-13,3,13,'#263b3d');
}
function render(){if(state==='play'||state==='pause'||state==='tutorial')drawGame();else{drawBackdrop();if(state==='levelScreen')drawCampaignMap()}}

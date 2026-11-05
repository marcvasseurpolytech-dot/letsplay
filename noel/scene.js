/* Christmas Village: pixel-art night scene drawn on a 320x180 canvas (scaled up with crisp pixels).
   The game passes its state through XM_SCENE.setState(); everything here is drawing and particles. */
(function(){
'use strict';
var W=320,H=180,S=3,cv,c,bgCache={},EM=[],HIT=[],T=0,lastT=0;
var C=window.XM_CAT;
var G={own:{},cu:{},unl:{},dmg:{},gr:null,gift:null,fly:null,time:'night'};
var seedv=7;
function rand(){seedv=(seedv*16807)%2147483647;return (seedv-1)/2147483646}
function rr(a,b){return a+Math.random()*(b-a)}

/* ---------- drawing helpers ---------- */
function R(x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function P(x,y,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),1,1)}
function disc(x,y,r,col){c.fillStyle=col;for(var dy=-r;dy<=r;dy++){var w=Math.floor(Math.sqrt(r*r-dy*dy)+.5);c.fillRect(Math.round(x-w),Math.round(y+dy),2*w+1,1)}}
function hexRGB(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
var shCache={};
function shade(col,f){var k=col+f;if(shCache[k])return shCache[k];var a=hexRGB(col),o=a.map(function(v){return Math.max(0,Math.min(255,Math.round(f>=0?v+(255-v)*f:v*(1+f))))});
  return shCache[k]='#'+o.map(function(v){return (v<16?'0':'')+v.toString(16)}).join('')}
function hsl(h,s,l){return 'hsl('+Math.round(h)+','+s+'%,'+l+'%)'}
var PAL={k:'#1b1630',w:'#f7fbff',g:'#d3ddf0',G:'#9fb0cf',r:'#d63a3a',R:'#8f2020',o:'#f08a2b',y:'#ffd45a',Y:'#c99a1d',n:'#8a5a34',N:'#5a3a20',b:'#4d7fd1',B:'#2c4f94',e:'#3f9a55',E:'#276e3b',p:'#ffc9a8',P:'#e09a7c',m:'#ff8fd0',c:'#7fd6e8',l:'#9ad65a',L:'#6aa83a',s:'#8b93a6',S:'#505669',x:'#e8e2d0',X:'#bdb59c',h:'#a06c3c',d:'#6b4a2c',a:'#c9a46a'};
/* sprite: rows of chars, anchored at bottom centre (x,y = feet). pal overrides allowed. */
function spr(rows,x,y,flip,pal,swap){
  var h=rows.length,w=0,i,j;for(i=0;i<h;i++)if(rows[i].length>w)w=rows[i].length;
  var x0=Math.round(x-w/2),y0=Math.round(y-h);
  for(i=0;i<h;i++){var row=rows[i];for(j=0;j<row.length;j++){var ch=row.charAt(j);if(ch==='.'||ch===' ')continue;
    var col=(pal&&pal[ch])||PAL[ch];if(swap&&swap[ch])col=swap[ch];if(!col)continue;
    c.fillStyle=col;c.fillRect(flip?x0+(w-1-j):x0+j,y0+i,1,1)}}
  return {x:x0,y:y0,w:w,h:h};
}
function emit(x,y,w,h,col,a,glow,gs){EM.push([x,y,w,h,col,a==null?1:a,glow||0,gs==null?1:gs])}
function hit(id,x,y,w,h){HIT.push({id:id,x:x,y:y,w:w,h:h})}
function has(id){return !!G.own[id]}
function cu(k,d){var v=G.cu[k];return v==null||v===''?d:v}
function spdF(){var s=cu('spd','normal');return s==='slow'?.5:s==='fast'?2:1}
function find(list,v){for(var i=0;i<list.length;i++)if(list[i].v===v)return list[i];return list[0]}

/* ---------- palettes by time of day ---------- */
var PALS={
 night:{sky:['#060a22','#0a1233','#101b47','#172a5c','#20396f','#2f5088'],mtn:['#1c2f5e','#142450'],snow:['#c3d3ee','#a7bbe0','#8aa1cf','#6f87b8'],ov:.30,ovc:'6,10,40',spark:'#ffffff'},
 dusk:{sky:['#2b1d52','#4a2a67','#7e3879','#b94e78','#e5724f','#f5a45a'],mtn:['#5a3a74','#3e2a62'],snow:['#f1d9e6','#dcb9d3','#bd98c1','#9a7aa9'],ov:.12,ovc:'26,10,48',spark:'#fff2d9'},
 dawn:{sky:['#1c2a5e','#3a5792','#7b8dc0','#d0a0b2','#f4b78a','#fbdb9c'],mtn:['#5d73a8','#465c92'],snow:['#fbf1e8','#e8d6d8','#cbb8c8','#a998b6'],ov:.05,ovc:'30,20,60',spark:'#fff6e8'}
};
function pal(){return PALS[G.time]||PALS.night}
var HOR=112;

/* ---------- cached static background: sky, mountains, drifts, path ---------- */
var PEAKS=[[[14,40],[72,54],[126,36],[188,60],[246,46],[302,58],[340,40]],[[-4,26],[46,32],[102,24],[158,36],[214,28],[268,34],[322,26]]];
function mtnY(x,k){var pk=PEAKS[k?1:0],best=k?10:16,sl=k?.85:1.05;for(var i=0;i<pk.length;i++){var v=pk[i][1]-Math.abs(x-pk[i][0])*sl;if(v>best)best=v}
  return HOR+8-best-hash(Math.round(x*3)+k*77)*.7-hash(Math.floor(x/4)+k*31)*1.6}
function driftY(x,k){return k===0?(HOR-2+Math.sin(x*.04)*2.5):k===1?(126+Math.sin(x*.027+1)*3+Math.sin(x*.08)*1.2):(152+Math.sin(x*.021+2)*3+Math.sin(x*.07)*1.4)}
function pathCx(y){var t=(y-138)/42;return 222-60*t+Math.sin(t*3)*8}
function pathW(y){return 13+((y-138)/42)*30}
function hash(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
function rgbaOf(col,a){var r=hexRGB(col);return 'rgba('+r[0]+','+r[1]+','+r[2]+','+a+')'}
function buildBg(time){
  var off=document.createElement('canvas');off.width=W*S;off.height=H*S;var o=off.getContext('2d'),p=PALS[time],i,x,y,k;
  o.scale(S,S);var keep=c;c=o;
  var hz=p.sky[p.sky.length-1],dimS=time==='night'?1:time==='dusk'?.4:.12;
  /* sky: smooth gradient, horizon glow, milky way, thousands of tiny stars */
  var g=o.createLinearGradient(0,0,0,HOR+8);
  p.sky.forEach(function(col,j){g.addColorStop(j/(p.sky.length-1),col)});
  o.fillStyle=g;o.fillRect(0,0,W,HOR+10);
  var hg=o.createRadialGradient(W*.6,HOR+6,0,W*.6,HOR+6,170);hg.addColorStop(0,rgbaOf(hz,.5));hg.addColorStop(1,rgbaOf(hz,0));
  o.fillStyle=hg;o.fillRect(0,0,W,HOR+10);
  if(time==='night'){
    for(i=0;i<5;i++){var mg=o.createRadialGradient(40+i*62,86-i*15,0,40+i*62,86-i*15,58);mg.addColorStop(0,'rgba(150,175,255,.085)');mg.addColorStop(1,'rgba(150,175,255,0)');o.fillStyle=mg;o.fillRect(0,0,W,HOR)}
  }
  seedv=3;
  for(i=0;i<420;i++){
    var sx=rand()*W,sy=Math.pow(rand(),1.5)*(HOR-14),band=Math.abs(sy-(92-sx*.24))<16;
    var sr=.1+rand()*.22+(rand()<.04?.22:0),sa=(.2+rand()*.65)*dimS*(band?1.15:.85);
    if(!band&&rand()<.35)continue;
    o.globalAlpha=Math.min(1,sa);o.fillStyle=rand()<.15?'#cfe0ff':rand()<.1?'#ffe9c4':'#ffffff';o.fillRect(sx,sy,sr*2,sr*2)}
  o.globalAlpha=1;
  /* mountains: painted ridges, facets, snow caps, haze */
  for(k=0;k<2;k++){
    var base=p.mtn[k],y0=HOR-72,y1=HOR+8;
    var fillG=o.createLinearGradient(0,y0,0,y1);fillG.addColorStop(0,shade(base,k?.16:.24));fillG.addColorStop(.6,base);fillG.addColorStop(1,shade(base,-.1));
    var shG=o.createLinearGradient(0,y0,0,y1);shG.addColorStop(0,'rgba(3,6,30,.42)');shG.addColorStop(1,'rgba(3,6,30,.08)');
    var liG=o.createLinearGradient(0,y0,0,y1);liG.addColorStop(0,'rgba(255,255,255,.16)');liG.addColorStop(1,'rgba(255,255,255,0)');
    var thr=k?84:78,step=1/S;
    for(i=0;i<W*S;i++){
      x=i*step;var my=mtnY(x,k),sl=(mtnY(x+1.2,k)-mtnY(x-1.2,k)),hh=y1-my;
      o.fillStyle=fillG;o.fillRect(x,my,step,hh);
      if(sl>.6){o.fillStyle=shG;o.fillRect(x,my,step,hh)}else if(sl<-.6){o.fillStyle=liG;o.fillRect(x,my,step,hh)}
      /* gullies */
      if(hash(Math.floor(x*1.3)+k*50)>.78){o.fillStyle='rgba(3,6,30,.16)';o.fillRect(x,my+3,step,Math.min(hh-3,16+hash(Math.floor(x*1.3))*14))}
      if(my<thr){
        var cd=Math.min(11,(thr-my)*.5+.8)*(.8+.35*Math.sin(x*.9+k*2)*Math.sin(x*.37));
        o.fillStyle=sl>.6?p.snow[2]:p.snow[0];o.fillRect(x,my,step,cd);
        o.fillStyle=sl>.6?p.snow[1]:'#ffffff';o.fillRect(x,my,step,.9);
      }
    }
    var hgz=o.createLinearGradient(0,HOR-30,0,HOR+10);hgz.addColorStop(0,rgbaOf(hz,0));hgz.addColorStop(1,rgbaOf(hz,k?.55:.8));
    o.fillStyle=hgz;o.fillRect(0,HOR-30,W,40);
  }
  /* far cabins with warm windows and a soft glow */
  [[8,0],[24,1],[40,0],[60,1],[246,0],[266,1],[288,0],[310,1]].forEach(function(f){
    var fx=f[0],fy=HOR+1-f[1]*1.6;
    var gl=o.createRadialGradient(fx+2.5,fy-1.5,0,fx+2.5,fy-1.5,7);gl.addColorStop(0,'rgba(255,190,90,.45)');gl.addColorStop(1,'rgba(255,190,90,0)');o.fillStyle=gl;o.fillRect(fx-5,fy-9,15,15);
    o.fillStyle='#1a1630';o.fillRect(fx,fy-3,5,3);o.beginPath();o.moveTo(fx-.8,fy-3);o.lineTo(fx+2.5,fy-5.6);o.lineTo(fx+5.8,fy-3);o.closePath();o.fillStyle='#2b2a46';o.fill();
    o.fillStyle='#d9e4f5';o.beginPath();o.moveTo(fx-.4,fy-3.1);o.lineTo(fx+2.5,fy-5.4);o.lineTo(fx+5.4,fy-3.1);o.lineTo(fx+4.6,fy-3.1);o.lineTo(fx+2.5,fy-4.7);o.lineTo(fx+.4,fy-3.1);o.fill();
    o.fillStyle='#ffc65a';o.fillRect(fx+.9,fy-2.2,1,1);o.fillRect(fx+3.1,fy-2.2,1,1)});
  /* snow: layered smooth drifts with soft shadows between them */
  var gg=o.createLinearGradient(0,HOR,0,H);gg.addColorStop(0,p.snow[0]);gg.addColorStop(1,p.snow[2]);o.fillStyle=gg;o.fillRect(0,HOR+1,W,H-HOR);
  function layerY(x,kk){return kk<3?driftY(x,kk):(168+Math.sin(x*.03+4)*3+Math.sin(x*.09)*1.2)}
  for(k=0;k<4;k++){
    var cols=[p.snow[0],p.snow[1],p.snow[2],p.snow[3]],top=layerY(160,k)-8;
    var lg=o.createLinearGradient(0,top,0,top+(k===3?16:42));lg.addColorStop(0,cols[k]);lg.addColorStop(1,shade(cols[k],-.1));
    /* shadow cast onto the layer behind */
    if(k>0){o.beginPath();for(x=0;x<=W;x+=1){y=layerY(x,k);x?o.lineTo(x,y-1):o.moveTo(x,y-1)}o.lineWidth=6;o.strokeStyle='rgba(28,48,115,.05)';o.stroke();o.lineWidth=3.5;o.stroke();o.lineWidth=1.6;o.stroke()}
    o.beginPath();for(x=0;x<=W;x+=.5){y=layerY(x,k);x?o.lineTo(x,y):o.moveTo(x,y)}o.lineTo(W,H);o.lineTo(0,H);o.closePath();o.fillStyle=lg;o.fill();
    o.beginPath();for(x=0;x<=W;x+=.5){y=layerY(x,k);x?o.lineTo(x,y):o.moveTo(x,y)}o.lineWidth=.45;o.strokeStyle=rgbaOf('#ffffff',k?.22:.12);o.stroke();
  }
  /* path */
  o.beginPath();for(y=134;y<=H;y+=1){var cx2=pathCx(y),hw=pathW(y)/2;y===134?o.moveTo(cx2-hw,y):o.lineTo(cx2-hw,y)}for(y=H;y>=134;y-=1){var cx3=pathCx(y),hw3=pathW(y)/2;o.lineTo(cx3+hw3,y)}o.closePath();
  var pg=o.createLinearGradient(0,134,0,H);pg.addColorStop(0,rgbaOf(p.snow[0],.0));pg.addColorStop(.25,rgbaOf(p.snow[0],.8));pg.addColorStop(1,rgbaOf(p.snow[0],.95));o.fillStyle=pg;o.fill();
  o.lineWidth=.5;o.strokeStyle='rgba(30,50,120,.16)';o.stroke();
  [-.22,.22].forEach(function(off2){o.beginPath();for(y=138;y<=H;y+=1){var cx4=pathCx(y)+off2*pathW(y);y===138?o.moveTo(cx4,y):o.lineTo(cx4,y)}o.lineWidth=.45;o.strokeStyle='rgba(40,60,130,.2)';o.stroke()});
  /* soft pool of moonlight on the snow */
  var pool=o.createRadialGradient(214,150,0,214,150,120);pool.addColorStop(0,rgbaOf(p.spark,.16));pool.addColorStop(1,rgbaOf(p.spark,0));o.fillStyle=pool;o.fillRect(0,HOR,W,H-HOR);
  /* wind ripples */
  seedv=29;o.lineCap='round';
  for(i=0;i<110;i++){var rx=rand()*W,ry=HOR+8+rand()*(H-HOR-10),rl=3+rand()*8,lit=rand()<.5;
    o.beginPath();o.moveTo(rx,ry);o.quadraticCurveTo(rx+rl/2,ry-.9,rx+rl,ry);o.lineWidth=.4;o.strokeStyle=lit?'rgba(255,255,255,.2)':'rgba(40,60,135,.16)';o.stroke()}
  /* sparkles and glints in the snow */
  seedv=11;
  for(i=0;i<420;i++){var kx=rand()*W,ky=HOR+4+rand()*(H-HOR-4),kr=.12+rand()*.2;o.globalAlpha=.25+rand()*.6;o.fillStyle=p.spark;o.fillRect(kx,ky,kr*2,kr*2)}
  o.globalAlpha=.85;
  for(i=0;i<26;i++){var gx=rand()*W,gy=HOR+8+rand()*(H-HOR-10);o.fillStyle=p.spark;o.fillRect(gx-1.1,gy-.15,2.2,.3);o.fillRect(gx-.15,gy-1.1,.3,2.2);o.fillRect(gx-.3,gy-.3,.6,.6)}
  o.globalAlpha=1;
  /* painted bushes, rocks and footprints */
  function bush(bx,by,w){
    o.fillStyle='rgba(28,48,115,.22)';o.beginPath();o.ellipse(bx+w/2+1,by+1.2,w/2+2,1.6,0,0,6.283);o.fill();
    var bgd=o.createLinearGradient(0,by-5,0,by+1);bgd.addColorStop(0,'#2d6e49');bgd.addColorStop(1,'#16382a');o.fillStyle=bgd;
    o.beginPath();o.ellipse(bx+w/2,by-1.2,w/2,3,0,0,6.283);o.fill();
    o.fillStyle=p.snow[0];o.beginPath();o.ellipse(bx+w/2,by-3.4,w/2-.8,1.4,0,Math.PI,6.283);o.fill();
    o.fillStyle='#e0463f';[[.25,-.8],[.55,-1.6],[.78,-.6],[.4,-2.2]].forEach(function(q){o.fillRect(bx+q[0]*w,by+q[1],.7,.7)})}
  function rock(rx2,ry2){
    o.fillStyle='rgba(28,48,115,.22)';o.beginPath();o.ellipse(rx2+3.5,ry2+.6,5,1.4,0,0,6.283);o.fill();
    var rg=o.createLinearGradient(0,ry2-5,0,ry2);rg.addColorStop(0,'#6a7799');rg.addColorStop(1,'#3d4560');o.fillStyle=rg;
    o.beginPath();o.moveTo(rx2,ry2);o.lineTo(rx2+.8,ry2-3);o.lineTo(rx2+3,ry2-4.6);o.lineTo(rx2+5.4,ry2-3.2);o.lineTo(rx2+6.4,ry2);o.closePath();o.fill();
    o.fillStyle=p.snow[0];o.beginPath();o.moveTo(rx2+.6,ry2-3);o.lineTo(rx2+3,ry2-4.9);o.lineTo(rx2+5.6,ry2-3.2);o.lineTo(rx2+4,ry2-3.6);o.lineTo(rx2+2.4,ry2-3);o.closePath();o.fill()}
  bush(1,151,10);bush(309,151,10);bush(58,176,9);rock(279,177);rock(113,173);bush(245,171,9);
  seedv=7;o.fillStyle='rgba(40,60,130,.28)';
  for(i=0;i<16;i++){var fy=140+i*2.9,fx=pathCx(fy)+(i%2?-3.2:3.2)*(1+(fy-138)/60);o.beginPath();o.ellipse(fx,fy,.9+(fy-138)/60,.5+(fy-138)/110,0,0,6.283);o.fill()}
  c=keep;return off;
}
function bg(){var t=G.time;if(!bgCache[t])bgCache[t]=buildBg(t);return bgCache[t]}

/* ---------- stars, moon, aurora, star, shooting stars ---------- */
var STARS=[];(function(){seedv=3;for(var i=0;i<95;i++)STARS.push([Math.floor(rand()*W),Math.floor(rand()*92),rand()*6.28,rand()<.12?2:1])})();
function drawStars(){
  var dim=G.time==='night'?1:G.time==='dusk'?.35:.12,tw=cu('twk','on')==='on';
  for(var i=0;i<STARS.length;i++){var s=STARS[i],a=(tw?.55+.45*Math.sin(T*1.7+s[2]):.9)*dim;if(s[1]>mtnY(s[0],0)-3)continue;
    emit(s[0],s[1],.5,.5,'#ffffff',a);if(s[3]===2&&a>.55){emit(s[0]-1,s[1]+.1,2.5,.3,'#ffffff',a*.5);emit(s[0]+.1,s[1]-1,.3,2.5,'#ffffff',a*.5)}}
}
function drawMoon(){
  if(!has('s_moon'))return;var x=262,y=28,a=G.time==='night'?1:G.time==='dusk'?.75:.5;
  c.save();c.globalAlpha=a;disc(x,y,9,'#fff4cc');disc(x+2,y-1,7,'#fffbe8');disc(x-3,y+2,2,'#e6d9a8');disc(x+3,y+4,1,'#e6d9a8');disc(x-1,y-4,1,'#e6d9a8');c.restore();
  emit(x-9,y-9,0,0,'#fff4cc',.14,26);
}
function drawAurora(){
  if(!has('s_aur')||G.time==='dawn')return;
  var col=find(C.AUR,cu('aur','green')).c,rgb=hexRGB(col),a0=G.time==='night'?.55:.3;
  c.save();c.globalCompositeOperation='lighter';
  for(var x=0;x<W;x+=1.5){var y0=22+Math.sin(x*.03+T*.35)*12+Math.sin(x*.07+T*.5)*5,hh=40+Math.sin(x*.05-T*.4)*12,al=a0*(.5+.5*Math.sin(x*.045+T*.6));
    var gr=c.createLinearGradient(0,y0,0,y0+hh);gr.addColorStop(0,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+(al*.55).toFixed(3)+')');gr.addColorStop(.35,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+(al*.3).toFixed(3)+')');gr.addColorStop(1,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0)');
    c.fillStyle=gr;c.fillRect(x,y0,1.5,hh)}
  c.restore();
}
var shoot=null,nextShoot=4;
function drawShooting(dt){
  if(!has('s_shoot')){shoot=null;return}
  nextShoot-=dt;if(!shoot&&nextShoot<=0){shoot={x:rr(160,300),y:rr(6,30),t:0};nextShoot=rr(6,13)}
  if(shoot){shoot.t+=dt;var u=shoot.t/1.1;if(u>=1){shoot=null;return}
    var x=shoot.x-u*90,y=shoot.y+u*46;for(var i=0;i<12;i++){var a=(1-i/12)*(1-u*.4);emit(x+i*2.2,y-i*1.2,2,1,'#ffffff',a)}emit(x-1,y-1,3,3,'#ffffff',.7,10)}
}
function drawChristmasStar(){
  if(!has('s_star')||G.dmg.star)return;
  var x=222,y=26,p=.75+.25*Math.sin(T*2),L=Math.round(7+2*Math.sin(T*2));
  emit(x-L,y,2*L+1,1,'#fff6c8',p);emit(x,y-L,1,2*L+1,'#fff6c8',p);emit(x-2,y-2,5,5,'#fff6c8',p,0);
  emit(x-3,y-3,1,1,'#fff6c8',p*.8);emit(x+3,y-3,1,1,'#fff6c8',p*.8);emit(x-3,y+3,1,1,'#fff6c8',p*.8);emit(x+3,y+3,1,1,'#fff6c8',p*.8);
  emit(x,y,0,0,'#ffe9a0',.35,30);
}
var flyby=null,nextFly=14;
function drawFlyby(dt){
  if(!has('s_fly')||G.fly)return;
  nextFly-=dt;if(!flyby&&nextFly<=0){flyby={t:0};nextFly=rr(40,70)}
  if(flyby){flyby.t+=dt;var u=flyby.t/9;if(u>=1){flyby=null;return}
    var x=-20+u*360,y=36-Math.sin(u*Math.PI)*14;
    for(var i=1;i<=18;i++)emit(x-6-i*3.2,y+2+Math.sin(i*.8+T*6)*1.2,2,1,'#ffe9a0',(1-i/18)*.8);
    emit(x-6,y,12,3,'#ff6a5e',1);emit(x-5,y+3,10,1,'#ffd45a',1);emit(x+6,y-2,3,2,'#8a5a34',1);
    for(var k=0;k<3;k++){emit(x+10+k*4,y-1+Math.sin(T*8+k)*.6,3,1,'#c68a5a',1);emit(x+11+k*4,y-3,1,2,'#8a5a34',1)}
    emit(x+22,y-1,1,1,'#ff4f4f',1,6);
  }
}

/* ---------- snow, fireflies, mist, smoke, fireworks (particles) ---------- */
var flakes=[],flakeN=0;
function snowLevel(){var l=parseInt(cu('snowl','1'),10)||0;if(l>=3&&!has('s_snow3'))l=has('s_snow2')?2:1;if(l>=2&&!has('s_snow2')&&!has('s_snow3'))l=1;return l}
function updateSnow(dt){
  var lv=snowLevel(),n=lv===0?0:lv===1?70:lv===2?150:270;
  while(flakes.length<n)flakes.push({x:rr(0,W),y:rr(-20,H),s:rr(0,6.28),z:Math.random()<.3?2:1});
  if(flakes.length>n)flakes.length=n;
  var wind=lv===3?26:lv===2?8:3;
  for(var i=0;i<flakes.length;i++){var f=flakes[i],sp=(f.z===2?26:16)*(lv===3?1.4:1);f.y+=sp*dt;f.x+=(Math.sin(T*.9+f.s)*5+wind)*dt;
    if(f.y>H+2){f.y=-3;f.x=rr(-20,W)}if(f.x>W+3)f.x=-3}
}
function drawSnow(){c.fillStyle='#ffffff';for(var i=0;i<flakes.length;i++){var f=flakes[i],r=f.z===2?.55:.33;c.globalAlpha=f.z===2?.95:.6;c.beginPath();c.arc(f.x,f.y,r,0,6.283);c.fill()}c.globalAlpha=1}
var flies=[];
function drawFlies(dt){
  if(!has('s_fire')){flies.length=0;return}
  while(flies.length<16)flies.push({x:rr(0,W),y:rr(118,176),a:rr(0,6.28),v:rr(.4,1)});
  for(var i=0;i<flies.length;i++){var f=flies[i];f.a+=dt*f.v;f.x+=Math.cos(f.a*1.3)*8*dt;f.y+=Math.sin(f.a)*5*dt;
    if(f.x<0)f.x=W;if(f.x>W)f.x=0;f.y=Math.max(112,Math.min(178,f.y));
    var al=.35+.65*(.5+.5*Math.sin(T*2.4+i*1.9));emit(f.x,f.y,1,1,'#ffe27a',al,8)}
}
function drawMist(){
  if(!has('s_mist'))return;
  c.save();for(var k=0;k<3;k++){var y=128+k*18;for(var x=-20;x<W+20;x+=6){var a=.07+.05*Math.sin(x*.05+T*.25+k*2);c.fillStyle='rgba(200,215,245,'+a.toFixed(3)+')';c.fillRect(x+((T*(4+k*2))%12),y+Math.sin(x*.07+k)*2,10,3)}}c.restore();
}
var smoke=[],smokeT=0;
function smokeColor(){return find(C.SMOKE_COLS,cu('scol','gray')).c}
function emitSmoke(x,y,col,shape,big){smoke.push({x:x,y:y,age:0,vx:rr(2,5),seed:rr(0,6.28),col:col,shape:shape,big:big||1})}
function updateSmoke(dt){for(var i=smoke.length-1;i>=0;i--){var s=smoke[i];s.age+=dt;s.y-=9*dt;s.x+=(s.vx+Math.sin(s.age*2+s.seed)*3)*dt;if(s.age>3.2)smoke.splice(i,1)}}
function drawSmokeParts(){
  for(var i=0;i<smoke.length;i++){var s=smoke[i],u=s.age/3.2,sz=Math.round((2+u*4)*s.big),a=(1-u)*.8;c.globalAlpha=a;
    if(s.shape==='heart'){var x=Math.round(s.x),y=Math.round(s.y);c.fillStyle=s.col;c.fillRect(x,y,2,2);c.fillRect(x+3,y,2,2);c.fillRect(x,y+1,5,2);c.fillRect(x+1,y+3,3,1);c.fillRect(x+2,y+4,1,1)}
    else if(s.shape==='star'){var x2=Math.round(s.x),y2=Math.round(s.y);c.fillStyle=s.col;c.fillRect(x2+2,y2,1,5);c.fillRect(x2,y2+2,5,1);c.fillRect(x2+1,y2+1,3,3)}
    else{c.fillStyle=s.col;c.fillRect(Math.round(s.x),Math.round(s.y),sz,sz)}}
  c.globalAlpha=1;
}
var fw=[],nextFw=3;
function burst(x,y,col){var n=26;for(var i=0;i<n;i++){var a=i/n*6.283+rr(-.1,.1),sp=rr(18,40);fw.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,t:0,life:rr(.9,1.5),col:col})}}
var FWC=['#ff6a5e','#ffd45a','#7fc8ff','#8dff9a','#ff8fd0','#c79bff','#ffffff'];
function updateFw(dt){
  if(has('s_fw')&&G.fwOn!==false){nextFw-=dt;if(nextFw<=0){burst(rr(40,290),rr(18,60),FWC[Math.floor(rr(0,FWC.length))]);nextFw=rr(3,6)}}
  for(var i=fw.length-1;i>=0;i--){var p=fw[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=26*dt;p.vx*=.985;if(p.t>p.life)fw.splice(i,1)}
}
function drawFw(){for(var i=0;i<fw.length;i++){var p=fw[i],a=1-p.t/p.life;emit(p.x,p.y,2,2,p.col,a,a>.5?7:0)}}

/* ---------- lights (string of bulbs with effect and colour) ---------- */
var MULTI=['#ff4f4f','#ffd45a','#5dff8a','#5aa9ff'];
function bulbColor(colKey,i){
  if(colKey==='multi')return MULTI[i%4];
  if(colKey==='rainbow')return hsl((i*34+T*70)%360,100,62);
  if(colKey==='redgreen')return i%2?'#5dff8a':'#ff4f4f';
  return find(C.LIGHT_COLS,colKey).c;
}
function bulbLevel(effKey,i,n){
  var s=spdF();
  if(effKey==='twinkle')return .35+.65*(.5+.5*Math.sin(T*2.6*s+i*2.399));
  if(effKey==='blink')return (Math.floor(T*1.3*s)%2===0)?1:.12;
  if(effKey==='chase')return ((Math.floor(T*6*s)-i)%4+4)%4===0?1:.3;
  if(effKey==='pulse')return .3+.7*(.5+.5*Math.sin(T*2.2*s));
  return 1;
}
/* pts: list of [x,y] bulb positions; draws a dark wire dot now and queues the glow */
function bulbs(pts,colKey,effKey,off){
  for(var i=0;i<pts.length;i++){var p=pts[i],x=Math.round(p[0]),y=Math.round(p[1]);P(x,y,'#2c2a3a');
    if(off)continue;var lv=bulbLevel(effKey,i,pts.length),col=bulbColor(colKey,i);emit(x,y,1,1,col,.45+.55*lv,lv>.6?4:0,.32);if(lv>.7)emit(x,y+1,1,1,col,.35*lv)}
}
function sag(x0,y0,x1,y1,dip,step){var pts=[],n=Math.max(2,Math.round(Math.abs(x1-x0)/step));for(var i=0;i<=n;i++){var u=i/n;pts.push([x0+(x1-x0)*u,y0+(y1-y0)*u+Math.sin(u*Math.PI)*dip])}return pts}
function wire(pts){c.fillStyle='#1c1b2a';for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],n=Math.max(1,Math.round(Math.abs(b[0]-a[0])));for(var j=0;j<=n;j++){c.fillRect(Math.round(a[0]+(b[0]-a[0])*j/n),Math.round(a[1]+(b[1]-a[1])*j/n),1,1)}}}

/* ---------- windows ---------- */
function winLight(x,y,w,h,gid,i){
  var colKey=cu('wcol','warm'),eff=cu('weff','candle'),col=find(C.WIN_COLS,colKey).c,off=G.dmg.windows||eff==='off',s=spdF();
  R(x-1,y-1,w+2,h+2,'#2e2118');R(x,y,w,h,'#1a2040');
  if(off)return;
  var a=1;
  if(eff==='candle')a=.78+.22*Math.sin(T*9*s+i*2)*Math.sin(T*5.3*s+i);
  else if(eff==='tv'){a=.55+.45*(Math.sin(T*3*s+i)>0?1:.55);col=(Math.sin(T*2.1*s+i*1.3)>.2)?'#8fd0ff':'#e8e4ff'}
  else if(eff==='blink')a=(Math.floor(T*1.2*s+i)%2===0)?1:.15;
  emit(x,y,w,h,col,a,0);emit(x,y+Math.floor(h/2),w,1,'#2e2118',.9);emit(x+Math.floor(w/2),y,1,h,'#2e2118',.9);
  emit(x+w/2-1,y+h,0,0,col,.2*a,16+Math.round(w/2));
}
function winPlain(x,y,w,h,col,a,i){R(x-1,y-1,w+2,h+2,'#2e2118');R(x,y,w,h,'#1a2040');if(G.dmg.windows)return;emit(x,y,w,h,col,(a==null?1:a)*(.82+.18*Math.sin(T*3+(i||0))),0);emit(x,y+Math.floor(h/2),w,1,'#2e2118',.85);emit(x+Math.floor(w/2),y,1,h,'#2e2118',.85)}

/* ---------- roofs ---------- */
function roof(cx,eaveY,halfW,rh,col,snow){
  var apex=eaveY-rh,lo=shade(col,-.22),hi=shade(col,.12);
  for(var y=apex;y<eaveY;y++){var hw=Math.round(halfW*(y-apex+1)/rh);R(cx-hw,y,hw*2+1,1,col);R(cx-hw,y,Math.max(1,Math.round(hw*.5)),1,hi);R(cx,y,hw,1,lo);R(cx-hw,y,2,1,shade(col,-.35));R(cx+hw-1,y,2,1,shade(col,-.4))}
  if(snow){for(y=apex;y<eaveY-1;y++){var hw2=Math.round(halfW*(y-apex+1)/rh)-2;if(hw2<0)continue;var drop=(y>eaveY-4)?0:1;
      R(cx-hw2,y,hw2*2+1,1,'#f4f8ff');if(y>apex+1)R(cx+Math.round(hw2*.2),y,Math.round(hw2*.8)+1,1,'#dbe6f7')}
    for(var x=-halfW;x<=halfW;x+=3){var d=((x*5+halfW)%4)+1;R(cx+x,eaveY-1,2,d,'#f4f8ff')}}
}
function chimney(x,baseY,h,w,smokeOn){
  R(x,baseY-h,w,h,'#8a4a3a');for(var y=baseY-h+2;y<baseY;y+=3)R(x,y,w,1,'#6b372c');R(x+w-2,baseY-h,2,h,'#74402f');
  R(x-1,baseY-h-2,w+2,3,'#f4f8ff');R(x,baseY-h-3,w,1,'#ffffff');
  if(smokeOn&&cu('smoke','on')==='on'&&!G.dmg.smoke){smokeT+=0;}
}
var smokeSrc=[];
function smokeAt(x,y,big){smokeSrc.push([x,y,big||1])}

/* ---------- main house ---------- */
var HX=222,HB=138;
function houseTier(){return has('h5')?5:has('h4')?4:has('h3')?3:has('h2')?2:has('h1')?1:0}
function planks(x,y,w,h,col){R(x,y,w,h,col);for(var j=y+2;j<y+h;j+=3)R(x,j,w,1,shade(col,-.18));R(x,y,1,h,shade(col,.1));R(x+w-1,y,1,h,shade(col,-.3))}
function drawHouse(){
  var t=houseTier();if(!t)return;
  var wall=find(C.WALLS,cu('wall','wood')).c,rc=find(C.ROOFS,cu('roof','red')).c,snow=cu('rsnow','on')==='on',lit=!G.dmg.windows;
  var x,y,i;
  /* ground shadow */
  var sw=[40,54,70,86,118][t-1];R(HX-sw/2-4,HB,sw+8,3,shade(pal().snow[2],-.12));
  if(t===1){
    var w=40,h=22;planks(HX-w/2,HB-h,w,h,wall);chimney(HX+8,HB-h-6,16,7,true);smokeAt(HX+11,HB-h-22);
    roof(HX,HB-h,w/2+4,15,rc,snow);
    R(HX-4+8,HB-14,8,14,'#4a2e1c');R(HX+8-4+1,HB-13,6,13,'#6b4428');P(HX+8,HB-6,'#ffd45a');
    winLight(HX-14,HB-16,9,8,'house',0);hit('house',HX-24,HB-40,48,40);
    if(cu('wreath','on')==='on')wreath(HX+8,HB-12);
    roofLightsPts([[HX-24,HB-h+3],[HX,HB-h-12],[HX+24,HB-h+3]]);
  }else if(t===2){
    var w2=54,h2=26;planks(HX-w2/2,HB-h2,w2,h2,wall);chimney(HX+14,HB-h2-8,20,8,true);smokeAt(HX+18,HB-h2-28);
    roof(HX,HB-h2,w2/2+5,17,rc,snow);
    R(HX-4,HB-17,8,17,'#4a2e1c');R(HX-3,HB-16,6,16,'#6b4428');P(HX+2,HB-8,'#ffd45a');
    winLight(HX-20,HB-18,9,9,'house',0);winLight(HX+11,HB-18,9,9,'house',1);hit('house',HX-30,HB-46,60,46);
    if(cu('wreath','on')==='on')wreath(HX,HB-14);
    roofLightsPts([[HX-31,HB-h2+3],[HX,HB-h2-14],[HX+31,HB-h2+3]]);
  }else if(t===3){
    var w3=70,h3=32;planks(HX-w3/2,HB-h3,w3,h3,wall);
    for(x=-w3/2;x<=w3/2-2;x+=14)R(HX+x,HB-h3,2,h3,'#3a2414');R(HX-w3/2,HB-h3,w3,2,'#3a2414');R(HX-w3/2,HB-12,w3,2,'#3a2414');
    chimney(HX+20,HB-h3-8,22,9,true);smokeAt(HX+24,HB-h3-30);
    roof(HX,HB-h3,w3/2+6,19,rc,snow);
    /* dormer */
    planks(HX-8,HB-h3-12,16,12,wall);roof(HX,HB-h3-12,11,8,rc,snow);winLight(HX-4,HB-h3-10,8,7,'house',3);
    R(HX-5,HB-20,10,20,'#4a2e1c');R(HX-4,HB-19,8,19,'#6b4428');P(HX+2,HB-10,'#ffd45a');
    winLight(HX-27,HB-22,10,10,'house',0);winLight(HX+17,HB-22,10,10,'house',1);
    R(HX-9,HB-23,2,3,'#3a2414');R(HX+7,HB-23,2,3,'#3a2414');
    emit(HX-1,HB-23,2,2,find(C.WIN_COLS,cu('wcol','warm')).c,lit?.9:0,12);
    hit('house',HX-38,HB-54,76,54);
    if(cu('wreath','on')==='on')wreath(HX,HB-16);
    roofLightsPts([[HX-39,HB-h3+3],[HX-20,HB-h3-9],[HX,HB-h3-19],[HX+20,HB-h3-9],[HX+39,HB-h3+3]]);
  }else if(t===4){
    var w4=88,h4=46;planks(HX-w4/2,HB-h4,w4,h4,wall);R(HX-w4/2,HB-h4/2,w4,2,'#3a2414');
    for(x=-w4/2;x<=w4/2-2;x+=16)R(HX+x,HB-h4,2,h4,'#3a2414');
    chimney(HX-28,HB-h4-8,20,9,true);smokeAt(HX-24,HB-h4-28);chimney(HX+24,HB-h4-8,20,9,true);smokeAt(HX+28,HB-h4-28);
    roof(HX,HB-h4,w4/2+7,22,rc,snow);
    winLight(HX-30,HB-38,10,12,'house',0);winLight(HX-5,HB-38,10,12,'house',1);winLight(HX+20,HB-38,10,12,'house',2);
    winLight(HX-34,HB-20,10,12,'house',3);winLight(HX+24,HB-20,10,12,'house',4);
    R(HX-6,HB-22,12,22,'#4a2e1c');R(HX-5,HB-21,10,21,'#6b4428');P(HX+3,HB-11,'#ffd45a');
    R(HX-12,HB-25,24,2,'#3a2414');R(HX-12,HB-25,2,3,'#3a2414');R(HX+10,HB-25,2,3,'#3a2414');
    hit('house',HX-46,HB-70,92,70);
    if(cu('wreath','on')==='on')wreath(HX,HB-16);
    roofLightsPts([[HX-47,HB-h4+3],[HX-28,HB-h4-9],[HX-10,HB-h4-17],[HX+10,HB-h4-17],[HX+28,HB-h4-9],[HX+47,HB-h4+3]]);
    emit(HX-8,HB-26,0,0,'#ffb347',.18,22);
  }else{
    var kw=100,kh=40;
    planks(HX-kw/2,HB-kh,kw,kh,'#9aa3b8');for(y=HB-kh+4;y<HB;y+=6)for(x=-kw/2+((y/6)%2?0:5);x<kw/2;x+=10)R(HX+x,y,1,6,'#7d8699');
    for(y=HB-kh+6;y<HB;y+=6)R(HX-kw/2,y,kw,1,'#7d8699');
    for(var side=-1;side<=1;side+=2){var tx=HX+side*44;
      planks(tx-9,HB-58,18,58,'#a6aec2');for(y=HB-58+6;y<HB;y+=6)R(tx-9,y,18,1,'#7d8699');
      roof(tx,HB-58,12,20,rc,snow);R(tx-1,HB-82,1,8,'#3a2414');R(tx,HB-82,6,4,'#ffd45a');
      winLight(tx-3,HB-46,6,9,'house',side+3);winLight(tx-3,HB-30,6,9,'house',side+5)}
    var cw=34,ch=70;planks(HX-cw/2,HB-ch,cw,ch,'#b2bacd');for(y=HB-ch+6;y<HB;y+=6)R(HX-cw/2,y,cw,1,'#8a93a8');
    roof(HX,HB-ch,cw/2+3,26,rc,snow);R(HX,HB-ch-34,1,10,'#3a2414');R(HX+1,HB-ch-34,8,5,'#d63a3a');R(HX+1,HB-ch-34,8,1,'#ffd45a');
    winLight(HX-5,HB-ch+8,10,14,'house',0);winLight(HX-5,HB-ch+28,10,14,'house',1);
    winLight(HX-31,HB-26,9,11,'house',2);winLight(HX+22,HB-26,9,11,'house',3);
    R(HX-9,HB-28,18,28,'#6b4a1c');R(HX-8,HB-27,16,27,'#d9a728');R(HX,HB-27,1,27,'#8a6d12');for(i=0;i<3;i++){R(HX-6,HB-24+i*8,5,1,'#8a6d12');R(HX+1,HB-24+i*8,5,1,'#8a6d12')}
    hit('house',HX-56,HB-90,112,90);
    chimney(HX-24,HB-kh-10,12,8,true);smokeAt(HX-20,HB-kh-20);
    roofLightsPts([[HX-52,HB-kh+2],[HX-26,HB-kh+2],[HX+26,HB-kh+2],[HX+52,HB-kh+2]],true);
    emit(HX,HB-ch-34,0,0,'#ffe9a0',.18,26);
  }
}
function wreath(x,y){disc(x,y,3,'#2f7a44');disc(x,y,1,'#4a3a2c');P(x-2,y-1,'#d63a3a');P(x+2,y+1,'#d63a3a');P(x,y+3,'#d63a3a');P(x,y+4,'#d63a3a')}
function roofLightsPts(path,isCastle){
  if(cu('hl_on','on')!=='on')return;
  var pts=[];for(var i=0;i<path.length-1;i++){var a=path[i],b=path[i+1],n=Math.max(2,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/5));for(var j=0;j<n;j++)pts.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n+2])}
  var last=path[path.length-1];pts.push([last[0],last[1]+2]);
  bulbs(pts,cu('hl_col','warm'),cu('hl_eff','twinkle'),G.dmg.lights);
}

/* ---------- village (back row) ---------- */
var BASE=116;
function bshadow(x,w){R(x-w/2-1,BASE,w+2,2,shade(pal().snow[1],-.1))}
function mini(x,w,h,wallc,roofc,wins){
  bshadow(x,w);planks(x-w/2,BASE-h,w,h,wallc);roof(x,BASE-h,w/2+3,Math.round(w*.32),roofc,true);
  R(x-2,BASE-8,4,8,'#3a2414');
  var per=Math.floor(wins);for(var i=0;i<per;i++){var wx=x-w/2+3+i*((w-6)/Math.max(1,per-1)||0);if(per===1)wx=x-w/2+3;winPlain(Math.round(wx),BASE-h+5,4,5,'#ffb84a',1,i+x)}
}
function drawVillage(){
  var x;
  if(has('v_cot')){x=16;mini(x,24,14,'#c9a46a','#b73a32',1);chimney(x+5,BASE-24,10,4,true);smokeAt(x+7,BASE-35,.8);hit('v_cot',x-14,BASE-30,28,30)}
  if(has('v_toy')){x=46;mini(x,26,16,'#4d6fa5','#d63a3a',2);R(x-9,BASE-8,6,5,'#8a5a34');disc(x-6,BASE-7,1,'#d9b36a');R(x+4,BASE-9,5,6,'#ffd45a');P(x+6,BASE-6,'#d63a3a');hit('v_toy',x-15,BASE-32,30,32)}
  if(has('v_bak')){x=78;mini(x,26,16,'#d8c49a','#7a4a2c',2);chimney(x+6,BASE-26,12,4,true);smokeAt(x+8,BASE-40,.8);R(x-6,BASE-5,12,2,'#e0b070');R(x-4,BASE-7,8,2,'#c88a3a');hit('v_bak',x-15,BASE-34,30,34)}
  if(has('v_post')){x=110;mini(x,26,15,'#a8382e','#3f5f9a',2);R(x-14,BASE-6,3,6,'#d63a3a');R(x-14,BASE-8,3,2,'#d63a3a');P(x-13,BASE-7,'#fff');R(x+9,BASE-16,1,6,'#3a2414');R(x+10,BASE-16,4,3,'#ffd45a');hit('v_post',x-15,BASE-32,30,32)}
  if(has('v_church')){x=140;bshadow(x,22);planks(x-11,BASE-20,22,20,'#d8d4c8');roof(x,BASE-20,14,14,'#4b5468',true);
    planks(x-4,BASE-44,8,26,'#e2ded0');roof(x,BASE-44,6,12,'#4b5468',true);R(x,BASE-62,1,8,'#c9a227');R(x-2,BASE-60,5,1,'#c9a227');
    R(x-2,BASE-38,4,6,'#1a2040');emit(x-2,BASE-38,4,6,'#ffb84a',.9);R(x-2,BASE-8,4,8,'#3a2414');
    winPlain(x-9,BASE-14,3,6,'#ffb84a',1,2);winPlain(x+6,BASE-14,3,6,'#ffb84a',1,3);hit('v_church',x-12,BASE-62,24,62)}
  if(has('v_clock')){x=165;bshadow(x,14);planks(x-6,BASE-36,12,36,'#a8382e');roof(x,BASE-36,8,12,'#2f4f3a',true);
    disc(x,BASE-28,4,'#f7fbff');disc(x,BASE-28,3,'#fffbe8');var d=new Date(),mm=d.getMinutes(),hh=(d.getHours()%12)+mm/60;
    var ma=mm/60*6.283-1.5708,ha=hh/12*6.283-1.5708;c.fillStyle='#1b1630';for(var k=1;k<=3;k++)c.fillRect(Math.round(x+Math.cos(ma)*k),Math.round(BASE-28+Math.sin(ma)*k),1,1);for(k=1;k<=2;k++)c.fillRect(Math.round(x+Math.cos(ha)*k),Math.round(BASE-28+Math.sin(ha)*k),1,1);
    emit(x,BASE-28,0,0,'#fff3c0',.2,8);winPlain(x-2,BASE-16,4,6,'#ffb84a',1,5);hit('v_clock',x-8,BASE-48,16,48)}
  if(has('v_work')){x=298;bshadow(x,40);planks(x-20,BASE-24,40,24,'#8a5a34');roof(x,BASE-24,24,16,'#3f5f9a',true);
    chimney(x+10,BASE-38,14,6,true);smokeAt(x+13,BASE-54,1.1);
    winPlain(x-15,BASE-18,6,7,'#ffd45a',1,1);winPlain(x-5,BASE-18,6,7,'#ffd45a',1,2);winPlain(x+7,BASE-18,6,7,'#ffd45a',1,3);
    R(x+14,BASE-12,5,12,'#3a2414');
    var gx=x-8,gy=BASE-30,ang=T*1.1;disc(gx,gy,4,'#8b93a6');disc(gx,gy,1,'#505669');for(var q=0;q<6;q++){var a2=ang+q*1.047;P(gx+Math.cos(a2)*5,gy+Math.sin(a2)*5,'#8b93a6');P(gx+Math.cos(a2)*4,gy+Math.sin(a2)*4,'#8b93a6')}
    hit('v_work',x-24,BASE-52,48,52)}
}

/* ---------- trees ---------- */
function pine(x,base,h,w,snow,dark){
  var tiers=Math.max(3,Math.round(h/9)),th=h/tiers,i,y,hw,col=dark||'#1f5a3a';
  R(x-1,base-4,3,4,'#4a2e1c');
  for(i=0;i<tiers;i++){var top=base-h+i*th*.82,ww=(w/2)*(0.45+0.55*(i+1)/tiers);
    for(y=0;y<th+3;y++){hw=Math.round(ww*(y+1)/(th+3));var yy=Math.round(top+y);R(x-hw,yy,hw*2+1,1,col);R(x-hw,yy,Math.max(1,Math.round(hw*.45)),1,shade(col,.14));R(x+hw-Math.max(1,Math.round(hw*.4)),yy,Math.max(1,Math.round(hw*.4)),1,shade(col,-.25));
      if(snow&&y<th*.55&&y>0){R(x-hw+1,yy,Math.max(1,Math.round(hw*.8)),1,'#eef4ff')}}}
}
function drawFarForest(){
  var dense=has('t_forest'),x,seed=5;
  var col='#17402f';
  for(x=-4;x<W+6;x+=dense?7:19){var h=dense?(22+((x*7)%9)):(14+((x*5)%7));if(!dense&&((x/19)|0)%2)continue;pine(x,HOR+1+((x*3)%3),h,h*.6+4,true,((x/7)|0)%2?'#17402f':'#1b4a35')}
  if(dense){for(x=2;x<W+6;x+=11){var h2=26+((x*11)%10);pine(x,HOR+7,h2,h2*.58+4,true,'#1f5a3a')}}
}
function drawTrees(){
  var x;
  if(has('t_s1')){pine(24,146,34,24,true);hit('t_s1',10,112,28,36)}
  if(has('t_s2')){pine(282,142,38,26,true);hit('t_s2',268,104,28,40)}
}
function bigTree(){
  if(!has('t_big'))return;
  var x=66,b=148,h=64,w=44,i,y,hw;
  R(x-3,b-7,6,8,'#4a2e1c');R(x-12,b,24,2,shade(pal().snow[2],-.12));
  var tiers=5,th=h/tiers,col='#1f6a40';
  for(i=0;i<tiers;i++){var top=b-h+i*th*.8,ww=(w/2)*(0.35+0.65*(i+1)/tiers);
    for(y=0;y<th+4;y++){hw=Math.round(ww*(y+1)/(th+4));var yy=Math.round(top+y);R(x-hw,yy,hw*2+1,1,col);R(x-hw,yy,Math.max(1,Math.round(hw*.4)),1,'#2e8250');R(x+hw-Math.max(1,Math.round(hw*.35)),yy,Math.max(1,Math.round(hw*.35)),1,'#154a2c')}}
  /* snow on branches */
  for(i=0;i<tiers;i++){var t2=b-h+i*th*.8+th+3;var w2=Math.round((w/2)*(0.35+0.65*(i+1)/tiers));R(x-w2+1,t2-2,w2*2-1,1,'#eef4ff');R(x-w2+3,t2-3,3,1,'#ffffff');R(x+w2-6,t2-3,3,1,'#ffffff')}
  /* ornaments */
  var oc=cu('tr_orn','red'),orn=[[-6,-18],[5,-26],[-10,-34],[9,-40],[-3,-48],[4,-12],[-14,-10],[13,-22],[0,-30],[-6,-44]];
  for(i=0;i<orn.length;i++){var col2=oc==='multi'?MULTI[i%4]:find(C.ORNS,oc).c;if(oc==='silver')col2='#dfe8f5';
    var ox=x+orn[i][0],oy=b+orn[i][1];R(ox,oy,3,3,col2);P(ox,oy,'#ffffffcc')}
  /* tree lights spiral */
  var pts=[];for(i=0;i<22;i++){var u=i/21,yy2=b-8-u*(h-14),sp=(1-u)*(w/2)*.85*Math.cos(u*17);pts.push([x+sp,yy2])}
  bulbs(pts,cu('tr_col','multi'),cu('tr_eff','twinkle'),G.dmg.lights);
  /* top */
  if(!G.dmg.tree){var tp=cu('tr_top','star'),ty=b-h-1;
    if(tp==='star'){R(x-1,ty-4,3,9,'#ffd45a');R(x-4,ty,9,3,'#ffd45a');R(x-2,ty-2,5,5,'#fff0a0');emit(x,ty,0,0,'#ffe27a',.4+.2*Math.sin(T*3),14)}
    else if(tp==='angel'){R(x-1,ty,3,5,'#ffffff');R(x-5,ty+1,4,3,'#ffffff');R(x+2,ty+1,4,3,'#ffffff');disc(x,ty-2,2,'#ffd9b8');R(x-2,ty-5,5,1,'#ffd45a');emit(x,ty,0,0,'#fff6c8',.22,10)}
    else{R(x-5,ty-1,4,4,'#d63a3a');R(x+2,ty-1,4,4,'#d63a3a');R(x-1,ty,3,3,'#9a1f1f');R(x-1,ty+3,2,4,'#d63a3a');R(x+1,ty+3,2,4,'#d63a3a')}}
  /* gifts */
  if(cu('tr_gifts','on')==='on'&&!G.dmg.gifts){giftBox(x-22,b+2,9,7,'#d63a3a','#ffd45a');giftBox(x-12,b+3,7,6,'#4d7fd1','#ffffff');giftBox(x+10,b+3,9,6,'#3f9a55','#ff8fd0');giftBox(x+20,b+2,7,8,'#c79bff','#ffd45a')}
  hit('tree',x-24,b-h-8,48,h+10);
}
function giftBox(x,b,w,h,col,rib){R(x,b-h,w,h,col);R(x,b-h,w,1,shade(col,.2));R(x+Math.floor(w/2),b-h,1,h,rib);R(x,b-Math.floor(h/2),w,1,rib);R(x+Math.floor(w/2)-1,b-h-1,3,1,rib);P(x+Math.floor(w/2)-2,b-h-2,rib);P(x+Math.floor(w/2)+2,b-h-2,rib)}

/* ---------- decor ---------- */
function drawFence(){
  if(!has('d_fence'))return;
  var x0=112,x1=160,y=150,x;
  R(x0,y-6,x1-x0,1,'#6b4428');R(x0,y-3,x1-x0,1,'#6b4428');
  for(x=x0;x<=x1;x+=8){R(x,y-9,2,10,'#8a5a34');R(x,y-9,2,1,'#f4f8ff');R(x+2,y-8,1,9,'#5a3a20')}
  R(x0,y-7,x1-x0,1,'#f4f8ffcc');
  if(cu('fl_on','on')==='on'){var pts=[];for(x=x0+1;x<=x1;x+=4)pts.push([x,y-5+Math.sin((x-x0)/(x1-x0)*Math.PI*6)*1.2]);bulbs(pts,cu('fl_col','white'),cu('fl_eff','steady'),G.dmg.lights)}
  hit('fence',x0,y-12,x1-x0,14);
}
function lamp(x,b){
  R(x-1,b-18,2,18,'#2e2f3c');R(x-3,b-1,6,2,'#2e2f3c');R(x-3,b-23,7,6,'#2e2f3c');R(x-2,b-22,5,4,'#1a2040');R(x-4,b-24,9,2,'#2e2f3c');R(x-3,b-25,7,1,'#f4f8ff');
  var col=find(C.LAMP,cu('lp_col','warm')).c;emit(x-2,b-22,5,4,col,.95,0);emit(x,b-20,0,0,col,.3,26);emit(x-6,b-2,13,2,col,.18);
}
function drawLamps(){if(!has('d_lamp'))return;lamp(204,150);lamp(172,166);lamp(192,178);hit('lamp',160,126,50,54)}
function drawStringLights(){
  if(!has('d_lights'))return;
  var ps=[[0,64,92,52],[92,52,150,56]];
  var a=sag(4,70,70,90,10,6).concat(sag(70,90,140,118,8,6).slice(1));
  var b=sag(300,72,240,92,9,6);
  var pts=[];
  var l1=sag(6,66,46,84,9,6);wire(l1);var l2=sag(46,84,96,100,8,6);wire(l2);
  var r1=sag(316,70,270,90,8,6);wire(r1);var r2=sag(270,90,246,100,5,6);wire(r2);
  var t=l1.concat(l2.slice(1)).concat(r1).concat(r2);
  bulbs(t,cu('sl_col','multi'),cu('sl_eff','twinkle'),G.dmg.lights);
  hit('string',0,60,100,48);hit('string',240,64,80,40);
}
function drawSign(){
  if(!has('d_sign'))return;var x=216,b=179;R(x-1,b-18,3,18,'#6b4428');planks(x-15,b-26,30,10,'#a06c3c');R(x-15,b-26,30,1,'#f4f8ff');
  /* tiny pixel text "NOEL" */
  var g=[[1,1,1,0,1,1,1,0,1,1,1,0,1,0,0],[1,0,1,0,1,0,1,0,1,0,0,0,1,0,0],[1,0,1,0,1,0,1,0,1,1,0,0,1,0,0],[1,0,1,0,1,0,1,0,1,0,0,0,1,0,0],[1,0,1,0,1,1,1,0,1,1,1,0,1,1,1]];
  for(var r=0;r<5;r++)for(var q=0;q<15;q++)if(g[r][q])P(x-7+q,b-24+r,'#fff3d6');
  hit('sign',x-16,b-28,32,30);
}
function drawMail(){if(!has('d_mail'))return;var x=238,b=152;R(x-1,b-12,2,12,'#5a3a20');R(x-5,b-18,11,7,'#d63a3a');R(x-5,b-18,11,1,'#ff6a5e');R(x+4,b-22,1,5,'#ffd45a');R(x+4,b-22,3,2,'#ffd45a');R(x-5,b-19,11,1,'#f4f8ff');hit('mail',x-6,b-24,14,26)}
function drawBench(){if(!has('d_bench'))return;var x=101,b=153;R(x-9,b-5,18,2,'#8a5a34');R(x-9,b-9,18,2,'#8a5a34');R(x-9,b-11,18,1,'#f4f8ff');R(x-8,b-3,2,3,'#5a3a20');R(x+6,b-3,2,3,'#5a3a20');R(x-9,b-9,1,6,'#5a3a20');R(x+8,b-9,1,6,'#5a3a20');R(x-8,b-6,16,1,'#f4f8ff');hit('bench',x-10,b-12,20,14)}
function drawGifts(){if(!has('d_gifts')||G.dmg.gifts)return;var x=262,b=153;giftBox(x-12,b,10,8,'#d63a3a','#ffd45a');giftBox(x,b,9,10,'#4d7fd1','#fff');giftBox(x-5,b-8,8,7,'#3f9a55','#ff8fd0');giftBox(x+10,b,7,6,'#c79bff','#ffd45a');hit('gifts',x-13,b-16,32,18)}
function drawCandy(){
  if(!has('d_candy'))return;
  for(var y=140;y<H;y+=6){var cx=pathCx(y),hw=pathW(y)/2;[-1,1].forEach(function(s){var x=Math.round(cx+s*(hw+2));R(x,y-4,1,5,'#ffffff');P(x,y-3,'#d63a3a');P(x,y-1,'#d63a3a');P(x,y+1,'#d63a3a');P(x+(s>0?1:-1),y-5,'#ffffff');P(x+(s>0?1:-1),y-4,'#d63a3a')})}
  hit('candy',150,140,90,40);
}
var fireSpark=[];
function drawFire(dt){
  if(!has('d_fire'))return;var x=152,b=172,col=find(C.FIRE,cu('fc_col','orange')).c,out=G.dmg.fire;
  R(x-8,b-1,16,2,shade(pal().snow[3],-.2));[[-7,-1],[-4,0],[0,0],[4,0],[7,-1]].forEach(function(p){disc(x+p[0],b-1+p[1],2,'#6b6f7a')});
  R(x-7,b-3,14,2,'#5a3a20');R(x-5,b-5,3,2,'#6b4428');R(x+2,b-5,3,2,'#6b4428');
  if(out){smokeAt(x,b-8,.7);hit('fire',x-10,b-14,20,16);return}
  var f=Math.sin(T*14)*.8,fh=9+Math.round(f*2);
  for(var i=0;i<fh;i++){var wv=Math.max(1,Math.round((4-i*.4)+Math.sin(T*10+i)*.6));emit(x-wv,b-5-i,wv*2+1,1,i<3?'#fff2b0':col,.95-i*.04,0)}
  emit(x-4,b-6,9,2,'#ffe9a0',.8);emit(x,b-8,0,0,col,.32,30);
  if(Math.random()<dt*7)fireSpark.push({x:x+rr(-3,3),y:b-10,vx:rr(-6,6),vy:rr(-22,-12),t:0});
  for(i=fireSpark.length-1;i>=0;i--){var s=fireSpark[i];s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.t>.9){fireSpark.splice(i,1);continue}emit(s.x,s.y,1,1,col,1-s.t/.9)}
  hit('fire',x-10,b-14,20,16);
}
function drawPond(){
  if(!has('d_pond'))return;var cx=54,cy=168,i,y;
  for(y=-6;y<=6;y++){var hw=Math.round(30*Math.sqrt(1-(y*y)/49));R(cx-hw-1,cy+y,hw*2+3,1,'#8fa6cf');R(cx-hw,cy+y,hw*2+1,1,y<0?'#a9d6f0':'#8cc4ea')}
  for(i=0;i<5;i++)R(cx-18+i*8,cy-3+((i*5)%5),4,1,'#e6f6ff');R(cx-10,cy+2,12,1,'#d4ecfa');
  emit(cx-6,cy-4,8,1,'#c9ecff',.4+.2*Math.sin(T*2));
  hit('pond',cx-31,cy-8,62,16);
}
function drawIgloo(){
  if(!has('d_igloo'))return;var x=298,b=160,r=15,y,hw;
  for(y=-r;y<=0;y++){hw=Math.round(Math.sqrt(r*r-y*y)*1.05);R(x-hw,b+y,hw*2+1,1,'#e8f0fb');R(x-hw,b+y,2,1,'#fff');R(x+hw-3,b+y,3,1,'#bccbe6')}
  for(y=-r+3;y<0;y+=4){hw=Math.round(Math.sqrt(r*r-y*y)*1.05);R(x-hw,b+y,hw*2+1,1,'#b9c8e4')}
  for(var j=-12;j<=12;j+=6)R(x+j,b-r+((Math.abs(j)*1)|0)+3,1,3,'#b9c8e4');
  R(x-5,b-9,10,9,'#1a2040');disc(x,b-9,5,'#1a2040');R(x-5,b-9,10,9,'#1a2040');emit(x-4,b-9,8,9,'#ffb84a',.7+.1*Math.sin(T*6),0);emit(x,b-5,0,0,'#ffb84a',.3,20);
  hit('igloo',x-18,b-18,36,20);
}

/* ---------- characters ---------- */
function snowman(x,b,sc,hat,key,fallen){
  var s=sc||1,r1=Math.round(6*s),r2=Math.round(4.5*s),r3=Math.round(3.5*s);
  var scarf=find(C.SCARFS,cu(key+'_sc','red')).c,hatk=cu(key+'_hat','top');
  R(x-r1,b,r1*2,2,shade(pal().snow[2],-.15));
  if(fallen){disc(x-4,b-r1+1,r1,'#f7fbff');disc(x+6,b-r2,r2,'#f7fbff');disc(x+16,b-r3+1,r3,'#f7fbff');P(x+17,b-r3,'#1b1630');P(x+19,b-r3,'#1b1630');R(x+21,b-r3+1,3,1,'#f08a2b');R(x+10,b-r2-1,2,6,scarf);return}
  disc(x,b-r1,r1,'#f7fbff');disc(x+1,b-r1+1,r1-1,'#e3ecf9');disc(x,b-r1*2-r2+2,r2,'#f7fbff');disc(x+1,b-r1*2-r2+3,r2-1,'#e3ecf9');
  var hy=b-r1*2-r2*2-r3+4;disc(x,hy,r3,'#fbfdff');disc(x+1,hy+1,r3-1,'#e8f0fb');
  P(x-1,hy-1,'#1b1630');P(x+2,hy-1,'#1b1630');R(x,hy+1,3,1,'#f08a2b');P(x-2,hy+2,'#1b1630');P(x+1,hy+3,'#1b1630');P(x+3,hy+2,'#1b1630');
  R(x-r3,hy+r3-1,r3*2+2,2,scarf);R(x+r3-1,hy+r3,2,4,scarf);
  P(x,b-r1*2-r2+2,'#1b1630');P(x,b-r1*2-r2+5,'#1b1630');P(x,b-r1-1,'#1b1630');
  R(x-r2-5,b-r1*2-r2,6,1,'#5a3a20');P(x-r2-6,b-r1*2-r2-1,'#5a3a20');R(x+r2,b-r1*2-r2-1,6,1,'#5a3a20');P(x+r2+5,b-r1*2-r2-2,'#5a3a20');
  if(hatk==='top'){R(x-r3-1,hy-r3,r3*2+3,1,'#1b1630');R(x-r3+1,hy-r3-5,r3*2-1,5,'#2a2540');R(x-r3+1,hy-r3-2,r3*2-1,1,'#d63a3a')}
  else if(hatk==='santa'){R(x-r3,hy-r3,r3*2+1,2,'#d63a3a');R(x-r3+1,hy-r3-2,r3*2-1,2,'#d63a3a');R(x-r3+2,hy-r3-4,r3*2-3,2,'#d63a3a');R(x-r3-1,hy-r3+1,r3*2+3,1,'#fff');P(x+r3,hy-r3-4,'#fff');P(x+r3+1,hy-r3-3,'#fff')}
  else if(hatk==='beanie'){R(x-r3,hy-r3,r3*2+1,3,'#4d7fd1');R(x-r3+1,hy-r3-2,r3*2-1,2,'#4d7fd1');R(x-r3,hy-r3+2,r3*2+1,1,'#f7fbff');P(x,hy-r3-3,'#fff');P(x-1,hy-r3-3,'#fff')}
}
function drawSnowmen(){
  [['c_sn1','sn1',120,158,1.1],['c_sn2','sn2',134,164,.95],['c_sn3','sn3',14,164,.8]].forEach(function(s){
    if(!has(s[0]))return;var fallen=s[1]==='sn1'&&G.dmg.snowman;snowman(s[2],s[3],s[4],0,s[1],fallen);
    hit(s[1],s[2]-12,s[3]-34,28,36)})
}

var ELF=[
"....w....",
"...eee...",
"..eeeee..",
".eeeeeee.",
".wwwwwww.",
"..ppppp..",
"..pkppk..",
"..ppPpp..",
"...rrr...",
"..eeeee..",
".peeyeep.",
"..eeeee.."];
var ELF_L1=["..e...e..","..k...k..",".kk...kk."],ELF_L2=["...e.e...","...k.k...","..kk.kk.."];
function elf(x,b,flip,step,gift){
  var legs=step?ELF_L1:ELF_L2;spr(ELF.concat(legs),x,b,flip,null,null);
  if(gift){giftBox(x+(flip?-11:6),b-8,6,5,'#d63a3a','#ffd45a')}
}
var SANTA=[
"....rrrr....",
"...rrrrrr...",
"..rrrrrrrr..",
"..wwwwwwww..",
".wwppppppww.",
".wwpkppkpww.",
".wwppPPppww.",
".wwwwwwwwww.",
"..wwwwwwww..",
"..rrrwwrrr..",
".rrrrwwrrrr.",
"prrrrwwrrrrp",
"prrrrwwrrrrp",
".kkkkyykkkk.",
".rrrrwwrrrr.",
".rrrrrrrrrr.",
".wwwwwwwwww.",
"..kkk..kkk..",
"..kkk..kkk..",
".kkkk..kkkk."];
function santa(x,b,wave){
  spr(SANTA,x,b,false);
  if(wave){var w=Math.floor(T*3)%2;R(x+5,b-14-(w?3:0),1,3,'#d63a3a');P(x+5,b-15-(w?3:0),'#ffc9a8');P(x+6,b-15-(w?3:0),'#ffc9a8');R(x+5,b-12,1,1,'#d63a3a')}
  hit('santa',x-8,b-22,18,24);
}
var CHOIR=[
"..eee..",".eeeee.",".epppe.","..pkp..","..ppp..",".rrrrr.","rrrwrrr",".rrrrr.",".rrrrr.",".kk.kk."];
function drawChoir(){
  if(!has('c_choir'))return;var bx=124,b=179,i;
  var cols=[{r:'#d63a3a',s:'#3f9a55'},{r:'#4d7fd1',s:'#ffd45a'},{r:'#3f9a55',s:'#d63a3a'}];
  for(i=0;i<3;i++){var p={e:i===1?'#8e5bd6':'#2b3a8a',r:cols[i].r,w:cols[i].s};spr(CHOIR,bx+(i-1)*9,b+((i===1)?-1:0),false,p)}
  for(i=0;i<3;i++){var u=((T*.7+i*.33)%1);emit(bx-10+i*9+u*8,b-18-u*26,2,2,'#ffe9a0',1-u);emit(bx-10+i*9+u*8+1,b-21-u*26,1,3,'#ffe9a0',1-u)}
  hit('choir',bx-16,b-14,34,16);
}
var KIDS=["..rr...","..rrr..","..ppp..","..pkp..",".bbbbb.","bbbbbbb","..b.b..","..k.k.."];
function drawKids(){
  if(!has('c_kids'))return;var u=(Math.sin(T*.35)*.5+.5),x=62+u*30,b=179;
  R(x-8,b-2,17,2,'#8a5a34');R(x-9,b-4,2,2,'#8a5a34');spr(KIDS,x-2,b-2,false,{r:'#d63a3a',b:'#d63a3a'});spr(KIDS,x+5,b-2,false,{r:'#3f9a55',b:'#4d7fd1'});
  hit('kids',x-10,b-14,22,16);
}
var PENG=["..kkk..",".kkkkk.",".kwkwk.","..koo..",".kwwwk.","kkwwwkk","kkwwwkk",".kwwwk.","..kkk..",".oo.oo."];
function drawPeng(){
  if(!has('a_peng'))return;var u=Math.sin(T*.5)*.5+.5,x=36+u*34,b=171;
  spr(PENG,x,b,u>.5);spr(PENG,x+12,b+2,u<.5);hit('peng',x-5,b-10,24,13)
}
var RABBIT=["w..w",".w.w","wwww","wkww","wwww","wwwww","wwwwww","w.w..w"];
function drawRabbit(){
  if(!has('a_rab'))return;var hop=Math.max(0,Math.sin(T*2.2))*3,x=160+Math.sin(T*.25)*22,b=180-hop;
  spr(["w..w","w..w","wwww","wkww","wwwww","wwwwww"],x,b,Math.cos(T*.25)<0);hit('rabbit',x-6,b-10,12,12);
}
var FOX=["...w.w..","..wwwww.","w.wkwkwo",".wwwwwww","wwwwwwww","wwwwwwww","w.w..w.w","k.k..k.k"];
function drawFox(){
  if(!has('a_fox'))return;var x=200+Math.sin(T*.18)*14,b=180;
  spr(["....w.w..",".....www..","wwww.wkwo.",".wwwwwwww.","..wwwwww..","..w.w.w.w.","..k.k.k.k."],x,b,Math.cos(T*.18)<0,{k:'#2a2540',o:'#2a2540',w:'#f1f5fb'});hit('fox',x-8,b-10,18,12);
}
var OWL=[".w...w.","wwwwwww","wkokwkw","wwwwwww","wwwGwww",".wwwww.","..y.y.."];
function drawOwl(){if(!has('a_owl'))return;var x=46,b=106+Math.round(Math.sin(T*.8)*0);spr(OWL,x,b,false,{o:'#ffd45a',k:'#1b1630',w:'#f1f5fb',G:'#c8d2e8',y:'#c99a1d'});if(Math.floor(T*.7)%5===0)R(x-3,b-5,1,1,'#f1f5fb');hit('owl',x-6,b-9,14,10)}
var BEAR=[
"....ww..ww..",
"...wwwwwwww.",
"...wwwwwwwww",
"...wwkwwwwkw",
"...wwwwkkwwwk",
"....wwwwkww.",
".wwwwwwwwww.",
"wwwwwwwwwwwww",
"wwwwwwwwwwwww",
"wwwwwwwwwwwww",
"wwwwwwwwwwwww",
"ww.ww....ww.ww",
"kk.kk....kk.kk"];
function drawBear(){if(!has('a_bear'))return;var x=14,b=178+Math.round(Math.sin(T*1.2)*.4);spr(BEAR,x,b,false,{w:'#f4f8ff',k:'#2a2540'});hit('bear',x-8,b-14,18,16)}
/* reindeer & sleigh */
var DEER=[
"......n.n..",
".....nnnnn.",
"......nnkn.",
".......nnnr",
"nnnnnnnn...",
"nnnnnnnnn..",
"nnnnnnnnn..",
"nnnnnnnnn..",
"n.n.....n.n",
"n.n.....n.n",
"d.d.....d.d"];
function reindeer(x,b,flip,noseCol,leg){
  var rows=DEER.slice();spr(rows,x,b,flip,{n:'#a06c3c',d:'#5a3a20',k:'#1b1630',r:noseCol});
  emit(x+(flip?-5:5),b-9,2,2,noseCol,.95,9);
  var bx=x+(flip?-8:8);R(bx,b-8,1,2,'#d9b36a');
}
function sleighSprite(x,b,col,flip){
  var dk=shade(col,-.3),hi=shade(col,.2),d=flip?-1:1;
  function Rx(ox,oy,w,h,cc){R(flip?x-ox-w:x+ox,b-oy-h,w,h,cc)}
  Rx(-14,0,30,2,'#c9a227');Rx(-14,1,3,3,'#c9a227');Rx(13,0,3,6,'#c9a227');Rx(14,5,2,1,'#c9a227');
  Rx(-12,2,26,8,col);Rx(-12,2,26,2,dk);Rx(-12,8,26,2,hi);Rx(-14,5,3,7,col);Rx(-14,5,3,2,hi);Rx(11,4,4,10,col);Rx(11,12,4,2,hi);
  Rx(-8,10,12,3,'#d63a3a');giftBox(flip?x+(-3):x-2,b-10,6,5,'#4d7fd1','#ffd45a');giftBox(flip?x-9:x+5,b-10,5,4,'#3f9a55','#ffffff');
  Rx(-4,13,9,1,'#fff');
}
function sleighColor(){return find(C.SLEIGH,cu('sl_color','red')).c}
function drawTeam(){
  var nose=find(C.NOSE,cu('rd_nose','red')).c;
  if(G.fly)return;
  var has_s=has('c_sleigh'),sx=304,sb=176;
  var deer=['c_rd1','c_rd2','c_rd3','c_rd4'].filter(has);
  deer.forEach(function(id,i){var x=284-i*16,b=177-((i%2)*2);reindeer(x,b,true,nose);hit('sleigh',x-8,b-12,18,14)});
  if(has_s){
    sleighSprite(sx,sb,sleighColor(),true);hit('sleigh',sx-17,sb-16,34,18);
    if(deer.length){var lx=sx-14,ly=sb-6;c.fillStyle='#8a5a34';for(var xx=Math.round(284-(deer.length-1)*16+8);xx<lx;xx+=2)c.fillRect(xx,ly+((xx>>1)&1),1,1)}
  }
}
function drawFly(dt){
  if(!G.fly)return;var u=(performance.now()-G.fly.t0)/9000;if(u>=1){return}
  var e=u*u*(3-2*u),x0=296,y0=160,x=x0-(e)*40-Math.max(0,u-.15)*220*1.1,y=y0-e*190;
  /* climb in an arc towards the upper left then away */
  x=x0-30-e*240;y=y0-Math.pow(e,.8)*200;
  var nose=find(C.NOSE,cu('rd_nose','red')).c,deer=['c_rd1','c_rd2','c_rd3','c_rd4'].filter(has).length;
  sleighSprite(x,y,sleighColor(),true);
  for(var i=0;i<deer;i++)reindeer(x-30-i*17,y+4-((i%2)*2),true,nose);
  for(i=1;i<30;i++){emit(x+16+i*3,y+2+Math.sin(i*.7+T*8)*1.4,2,1,'#ffe9a0',(1-i/30)*.8)}
  if(has('c_santa'))R(x-6,y-14,4,4,'#d63a3a');
}

/* Grumbo the goblin */
var GRUMBO=[
"...l.....l...",
"..lll...lll..",
".llllllllll..",
".lLlllllllLl.",
"..lkllllkLl..",
"..lrkllkrl...",
"...llooll....",
"..lkkkkkl....",
"..lwklklwl...",
"..LLLLLLLL...",
".LLLLLLLLLL..",
".lLLLLLLLLl..",
"..LLLLLLLL...",
"..LL....LL...",
".kkk....kkk.."];
function grumbo(x,b,pose,face){
  var o={l:'#8ac060',L:'#5e8f3d',k:'#2a2540',r:'#ff6a5e',o:'#d9a35a',w:'#ffffff'};
  var hop=pose==='walk'?Math.abs(Math.sin(T*10))*2:0;
  var bb=Math.round(b-hop);
  spr(GRUMBO,x,bb,face<0,o);
  if(pose==='act'){var a=Math.floor(T*8)%2;R(x-8,bb-14-a*2,2,5,'#8ac060');R(x+7,bb-14-(1-a)*2,2,5,'#8ac060')}
  var cs=G.cs||[];
  if(cs.indexOf('hat')>=0){R(x-4,bb-18,9,3,'#d63a3a');R(x-3,bb-20,7,2,'#d63a3a');R(x-1,bb-22,4,2,'#d63a3a');R(x-5,bb-16,11,1,'#ffffff');P(x+4,bb-22,'#fff');P(x+5,bb-21,'#fff')}
  if(cs.indexOf('scarf')>=0){R(x-5,bb-8,11,2,'#d63a3a');R(x-5,bb-8,2,2,'#ffffff');R(x-1,bb-8,2,2,'#ffffff');R(x+3,bb-8,2,2,'#ffffff');R(x+3,bb-6,2,4,'#d63a3a')}
  if(cs.indexOf('bell')>=0){disc(x,bb-5,1,'#ffd45a');P(x,bb-5,'#fff6c8')}
  if(cs.indexOf('antlers')>=0){R(x-6,bb-20,1,5,'#8a5a34');R(x-8,bb-21,3,1,'#8a5a34');R(x-7,bb-23,1,3,'#8a5a34');R(x+6,bb-20,1,5,'#8a5a34');R(x+6,bb-21,3,1,'#8a5a34');R(x+7,bb-23,1,3,'#8a5a34')}
}
function drawGrumbo(){
  var g=G.gr;if(!g)return;var n=performance.now()-g.t0,e=g.a,a=g.b,x=g.c;
  var sx=g.sx,tx=g.tx,y=g.ty;
  if(n<0)return;
  if(n<e){var u=n/e;grumbo(sx+(tx-sx)*u,y,'walk',tx<sx?1:-1)}
  else if(n<e+a){grumbo(tx,y,'act',tx<sx?1:-1);if(Math.floor(n/140)%2===0)emit(tx-1,y-24,2,6,'#ff6a5e',1,0),emit(tx-1,y-17,2,2,'#ff6a5e',1,0)}
  else if(n<e+a+x){var u2=(n-e-a)/x;grumbo(tx+(g.ex-tx)*u2,y,'walk',g.ex<tx?1:-1)}
}

/* ---------- gift with parachute ---------- */
function drawGift(){
  var g=G.gift;if(!g)return;var x=Math.round(g.x),y=Math.round(g.y);
  /* parachute */
  for(var i=0;i<=9;i++){var dx=i-4.5,hh=Math.round(Math.sqrt(Math.max(0,1-(dx*dx)/20.25))*9);R(x-9+i*2,y-22-hh,2,hh,i%2?'#ffffff':'#d63a3a')}
  R(x-9,y-14,19,1,'#d63a3a');
  c.fillStyle='#e8e2d0';c.fillRect(x-9,y-14,1,12);c.fillRect(x+9,y-14,1,12);c.fillRect(x-4,y-14,1,12);c.fillRect(x+4,y-14,1,12);
  giftBox(x-5,y+5,11,9,'#4d7fd1','#ffd45a');
  emit(x,y,0,0,'#ffe27a',.35+.25*Math.sin(T*8),22);
  hit('gift',x-18,y-34,38,52);
}
/* sparkles used when something is repaired / bought */
var sparks=[];
function sparkle(x,y,col,n){for(var i=0;i<(n||14);i++){var a=rr(0,6.28),s=rr(10,34);sparks.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,t:0,life:rr(.5,1),col:col||'#ffe27a'})}}
function updateSparks(dt){for(var i=sparks.length-1;i>=0;i--){var p=sparks[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=40*dt;if(p.t>p.life)sparks.splice(i,1)}}
function drawSparks(){for(var i=0;i<sparks.length;i++){var p=sparks[i];emit(p.x,p.y,2,2,p.col,1-p.t/p.life,5)}}

/* ---------- elves patrol ---------- */
function drawElves(){
  if(has('c_elf1')){var u=(T*.06)%2,pos=u<1?u:2-u,x=130+pos*60,b=177,fl=u>=1;elf(x,b,fl,Math.floor(T*5)%2,true);hit('elf',x-6,b-16,13,18)}
  if(has('c_elf2')){var u2=(T*.05+.6)%2,p2=u2<1?u2:2-u2,x2=236+p2*40,b2=170,f2=u2<1;elf(x2,b2,f2,Math.floor(T*5)%2,false);hit('elf',x2-6,b2-16,13,18)}
}

/* ---------- main frame ---------- */
function world(dt){
  var p=pal();
  c.drawImage(bg(),0,0,W,H);
  drawAurora();
  /* mountains already in bg; forest + village */
  drawFarForest();
  drawVillage();
  if(has('d_pond'))drawPond();
  /* back-to-front, sorted roughly by base y */
  drawTrees();
  drawHouse();
  if(has('d_igloo'))drawIgloo();
  bigTree();
  drawOwl();
  drawCandy();
  drawFence();
  drawSign();
  drawMail();
  drawGifts();
  drawFire(dt);
  drawSnowmen();
  drawBench();
  drawLamps();
  drawChoir();
  drawKids();
  drawFox();drawBear();
  drawPeng();drawRabbit();
  drawElves();
  if(has('c_santa')&&!G.fly)santa(186,154,true);
  drawTeam();
  drawStringLights();
  drawFly(dt);
  drawMist();
  /* smoke */
  var sc=smokeColor(),shape=cu('sshape','puff');
  smokeT+=dt;if(smokeT>.55){smokeT=0;if(cu('smoke','on')==='on'&&!G.dmg.smoke)smokeSrc.forEach(function(s){emitSmoke(s[0],s[1],sc,shape,s[2])});else if(G.dmg.fire)smokeSrc.forEach(function(s){if(s[1]>140)emitSmoke(s[0],s[1],'#8b93a6','puff',s[2])})}
  smokeSrc.length=0;
  updateSmoke(dt);drawSmokeParts();
  drawGrumbo();
  drawGift();
}
function post(){
  var p=pal(),i;
  /* night ambience */
  c.fillStyle='rgba('+p.ovc+','+p.ov+')';c.fillRect(0,0,W,H);
  var vg=c.createRadialGradient(W/2,H*.55,H*.45,W/2,H*.55,W*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(2,4,24,'+(p.ov*1.1+.08).toFixed(2)+')');c.fillStyle=vg;c.fillRect(0,0,W,H);
  drawMoon();
  for(i=0;i<EM.length;i++){var e=EM[i];c.globalAlpha=e[5];
    if(e[2]>0&&e[3]>0){c.fillStyle=e[4];c.fillRect(Math.round(e[0]*S)/S,Math.round(e[1]*S)/S,Math.round(e[2]*S)/S,Math.round(e[3]*S)/S)}
    if(e[6]>0){c.save();c.globalCompositeOperation='lighter';var gx=e[0]+e[2]/2,gy=e[1]+e[3]/2,gr=e[6];var gd=c.createRadialGradient(gx,gy,0,gx,gy,gr);var rgb=e[4].charAt(0)==='#'?hexRGB(e[4]):[255,200,120];
      gd.addColorStop(0,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+(.55*e[7]).toFixed(2)+')');gd.addColorStop(1,'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0)');c.globalAlpha=e[5]*.8;c.fillStyle=gd;c.fillRect(gx-gr,gy-gr,gr*2,gr*2);c.restore()}}
  c.globalAlpha=1;
  drawSnow();
}
var frameN=0;
function render(now){
  var t=now/1000,dt=Math.min(.1,lastT?t-lastT:.016);lastT=t;T=t;
  EM.length=0;HIT.length=0;
  updateSnow(dt);updateFw(dt);updateSparks(dt);
  c.setTransform(S,0,0,S,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  world(dt);
  drawStars();drawShooting(dt);drawChristmasStar();drawFlyby(dt);drawFlies(dt);drawFw();drawSparks();
  post();
}
function loop(now){render(now);requestAnimationFrame(loop)}

/* ---------- photo ---------- */
function photo(name){
  var k=S,bar=16*k,out=document.createElement('canvas');out.width=W*k;out.height=H*k+bar;var o=out.getContext('2d');
  o.drawImage(cv,0,0,W*k,H*k);
  o.fillStyle='#0d1b3a';o.fillRect(0,H*k,W*k,bar);o.fillStyle='#ffd45a';o.font='bold '+(7*k)+'px monospace';o.textAlign='center';
  o.fillText('MERRY CHRISTMAS'+(name?' | '+name:''),W*k/2,H*k+10*k);
  return out;
}

window.XM_SCENE={
  init:function(canvas){cv=canvas;cv.width=W*S;cv.height=H*S;c=cv.getContext('2d');c.imageSmoothingEnabled=false;requestAnimationFrame(loop)},
  setState:function(s){G=s},
  hitTest:function(lx,ly){for(var i=HIT.length-1;i>=0;i--){var h=HIT[i];if(lx>=h.x&&lx<=h.x+h.w&&ly>=h.y&&ly<=h.y+h.h)return h.id}return null},
  burst:burst,celebrate:function(){for(var i=0;i<7;i++)(function(i){setTimeout(function(){burst(rr(50,280),rr(16,56),FWC[i%FWC.length])},i*320)})(i)},
  sparkle:sparkle,photo:photo,W:W,H:H,
  doorPos:function(){return [HX,HB]}
};
})();

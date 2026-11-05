/* Christmas Village TOEIC: game logic, shop, decorating, advent calendar, profiles and saving.
   Same profiles and API as Arrow Escape and Word Bridge (progress stored in the "xm" field). */
(function(){
'use strict';

var B=window.WB_BANK, XB=window.XM_BANK.ALL, C=window.XM_CAT, SC=window.XM_SCENE;
var NORMAL=B.NORMAL, HARD=B.HARD, CATS=B.CATS, MODE_LABEL=B.MODE_LABEL;
var MAXL=5;

/* Grumbo's attacks. Each one shows an irregular verb. need() says whether the village has something to spoil. */
var ATT=[
 {k:'lights',v:['steal','stole','stolen'],t:'Grumbo stole the Christmas lights.',fix:'The lights are back on.',tx:176,ty:150,need:function(){return own('d_lights')||own('d_fence')||own('t_big')||own('h1')}},
 {k:'windows',v:['blow','blew','blown'],t:'Grumbo blew out the windows.',fix:'The windows glow again.',tx:224,ty:152,need:function(){return own('h1')||own('v_cot')}},
 {k:'smoke',v:['freeze','froze','frozen'],t:'Grumbo froze the chimneys.',fix:'The chimneys smoke again.',tx:224,ty:152,need:function(){return own('h1')||own('v_bak')||own('v_work')}},
 {k:'snowman',v:['throw','threw','thrown'],t:'Grumbo threw Frosty to the ground.',fix:'Frosty is standing again.',tx:134,ty:160,need:function(){return own('c_sn1')}},
 {k:'gifts',v:['hide','hid','hidden'],t:'Grumbo hid the gifts.',fix:'The gifts are back.',tx:84,ty:154,need:function(){return own('d_gifts')||own('t_big')}},
 {k:'tree',v:['tear','tore','torn'],t:'Grumbo tore off the tree top.',fix:'The tree top is back.',tx:88,ty:152,need:function(){return own('t_big')}},
 {k:'fire',v:['put','put','put'],t:'Grumbo put out the campfire.',fix:'The campfire burns again.',tx:164,ty:174,need:function(){return own('d_fire')}},
 {k:'star',v:['take','took','taken'],t:'Grumbo took the Christmas star.',fix:'The star shines again.',tx:222,ty:150,need:function(){return own('s_star')}}
];
var SNOWBALL={k:'snow',v:['throw','threw','thrown'],t:'Grumbo threw snowballs at the village.',fix:'',tx:150,ty:162};

/* ---------- TOOLS ---------- */
function $(s){return document.querySelector(s)}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function rnd(n){return Math.floor(Math.random()*n)}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
var ITEM={};C.ITEMS.forEach(function(i){ITEM[i.id]=i});

/* ---------- GAME STATE ---------- */
function emptyStats(){return {byCat:{},answered:0,correct:0,levelsCleared:0,maxLevel:1,gifts:0,giftsOk:0,maxStreak:0,chests:0,takeoffs:0,cust:0}}
var S={cats:{},day:1,score:0,lives:MAXL,N:10,placed:0,q:null,gq:null,view:'main',busy:false,ended:true,active:false,
  deck:[],hdeck:[],xdeck:[],missed:[],best:0,qCount:0,okCount:0,sinceGift:0,nextGift:3,gift:null,
  coins:0,own:{},unl:{},cu:{},inv:{shield:0,half:0,freeze:0},pk:[],cs:[],adv:[],qi:0,stg:1,
  stats:emptyStats(),levelDone:true,nextDay:0,gen:0,streak:0,dmg:{},dmgOrder:[],paused:false,gr:null,fly:null,time:'night',
  sheet:null,shopTab:'house',openG:'',advMsg:'',chestMsg:'',att:null,saveOK:false,fwOn:true};
SC.setState(S);
function own(id){return !!S.own[id]}
function hasPk(id){return S.pk.indexOf(id)>=0}
function levelN(d){return Math.min(16,10+(d-1))}
function deerCount(){return ['c_rd1','c_rd2','c_rd3','c_rd4'].filter(own).length}
function sync(){S.time=S.cu.time||'night'}
try{S.best=parseInt(localStorage.getItem('xmBest')||'0',10)||0}catch(e){}
var soundOn=false;try{soundOn=localStorage.getItem('xmSound')==='1'}catch(e){}

/* ---------- sound (tiny bell tones, off by default) ---------- */
var AC=null;
function tone(f,d,t0,vol){
  try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;
    var t=AC.currentTime+(t0||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.12,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}
}
function ding(ok){if(!soundOn)return;if(ok){tone(880,.5,0);tone(1320,.6,.09)}else{tone(180,.35,0,.16);tone(140,.4,.12,.16)}}

/* ---------- QUESTIONS ---------- */
function drawFrom(k,src){
  if(!S[k].length){var f=src.filter(function(q){return S.cats[q.t]});if(!f.length)f=src;S[k]=shuffle(f)}
  return S[k].pop();
}
function drawItem(hard){return hard?drawFrom('hdeck',HARD):drawFrom('deck',NORMAL)}
function scramble(word){
  var letters=word.split(''),out=letters,tries=0;
  do{out=shuffle(letters);tries++}while(out.join('')===word&&tries<30);
  return out.map(function(ch,i){return {ch:ch,id:i}});
}
function limitOf(it){return (it.t==='e'?30000:it.t==='w'?40000:20000)+(hasPk('time')?4000:0)}
function makeQ(item){
  var lim=limitOf(item);
  if(item.t==='w')return {item:item,type:'w',tiles:scramble(item.w),built:[],answered:false,limit:lim,left:lim};
  if(item.t==='e')return {item:item,type:'mc',opts:item.o.map(function(t,i){return {t:t,ok:i===item.k}}),answered:false,limit:lim,left:lim};
  var opts=shuffle(item.o.map(function(t,i){return {t:t,ok:i===0}}));
  return {item:item,type:'mc',opts:opts,answered:false,limit:lim,left:lim};
}
function nextItem(){
  if(Math.random()<.38&&XB.some(function(q){return S.cats[q.t]}))return drawFrom('xdeck',XB);
  return drawItem(S.day>=3&&Math.random()<.25);
}
function sentenceHTML(item,fill,cls){
  var s=esc(item.s);
  if(item.t==='v')s=s.replace(/\(([a-z]+)\)\s*$/,'<span class="verb">($1)</span>');
  s=s.replace(/\*([^*]+)\*/g,'<b>$1</b>');
  return s.replace('___','<span class="gap'+(cls?' '+cls:'')+'">'+(fill?esc(fill):'&nbsp;')+'</span>');
}
function segHTML(q){
  var item=q.item;
  return item.segs.map(function(sg,i){
    var c='';
    if(q.answered){if(i===item.k)c=' good';else if(i===q.picked)c=' bad'}
    return '<span class="seg'+c+'"><b class="sl">'+'ABCD'.charAt(i)+'</b>'+esc(sg)+'</span>';
  }).join(' ');
}
function fixedSentence(item){
  return item.segs.map(function(sg,i){return i===item.k?item.fix:sg}).filter(function(x){return x!==''}).join(' ');
}
function fullSentence(item){
  if(item.t==='e')return esc(fixedSentence(item));
  if(item.t==='w')return '<b>'+esc(item.w)+'</b> : '+esc(item.fr);
  if(item.s.indexOf('___')<0)return esc(item.s.replace(/\*/g,''))+' <b>'+esc(item.o[0])+'</b>';
  return esc(item.s.replace('___',item.o[0]).replace(/\s*\([a-z]+\)\s*$/,'').replace(/\*/g,''));
}
function feedbackHTML(q,ok){
  var it=q.item,h=(ok?'<span class="ok">Correct.</span> ':(q.timedOut?'<span class="ko">Time is up.</span> ':'<span class="ko">Wrong.</span> '));
  if(it.t==='e'){
    var seg=it.segs[it.k];
    return h+'The error is in <b>('+'ABCD'.charAt(it.k)+')</b>: <s>'+esc(seg)+'</s> '+(it.fix?'&rarr; <b>'+esc(it.fix)+'</b>':'(delete it)')+
      '<br><em>'+esc(it.why)+'</em><br><em>'+esc(fixedSentence(it))+'</em><br>'+esc(it.fr);
  }
  if(it.t==='w')return h+(ok?'':'The word is ')+fullSentence(it);
  return h+'<em>'+fullSentence(it)+'</em>'+(it.t==='t'?'':'<br>'+esc(it.fr));
}

/* ---------- PANEL (questions) ---------- */
function idle(msg,btn){
  var h='<div class="idle">'+msg+'</div>';
  if(btn)h+='<div class="nextrow" style="justify-content:center"><button class="btn solid" id="idleGo">'+btn+'</button></div>';
  $('#panel').innerHTML=h;var g=$('#idleGo');if(g)g.addEventListener('click',function(){startDay()});
}
function idleStart(){
  if(!P.user){idle('Log in from the title screen to play.');return}
  var d=S.levelDone?(S.nextDay||S.day):S.day;
  idle('Welcome to your village. Answer questions to earn coins and bring Christmas to life.','Start day '+d);
}
function curQ(){return S.view==='gift'?S.gq:S.q}
function tagText(q){var base=MODE_LABEL[q.item.t];return S.view==='gift'?'Gift question | '+base:base}
function boostsHTML(q){
  if(q.answered)return '';
  var i=S.inv,h='';
  if(i.half>0&&q.type==='mc'&&!q.hid)h+='<button class="bst" data-bo="half">50/50 <b>x'+i.half+'</b></button>';
  if(i.freeze>0)h+='<button class="bst" data-bo="freeze">+10s <b>x'+i.freeze+'</b></button>';
  if(i.shield>0)h+='<span class="bst on">Shield <b>x'+i.shield+'</b></span>';
  return h?'<div class="boosts">'+h+'</div>':'';
}
function useBoost(id){
  var q=curQ();if(!q||q.answered||S.inv[id]<1)return;
  if(id==='half'){
    if(q.type!=='mc'||q.hid)return;
    var w=[];q.opts.forEach(function(o,k){if(!o.ok)w.push(k)});w=shuffle(w).slice(0,2);q.hid=w;
  }else if(id==='freeze'){q.left+=10000;q.limit=Math.max(q.limit,q.left)}
  S.inv[id]--;scheduleSave();showPanel();
}
function showPanel(){
  if(S.sheet)return;
  var q=curQ();
  if(!q){if(S.ended)idleStart();else idle('Get ready.');return}
  var it=q.item,h=(q.answered?'':'<div class="timer"><b id="tbar" style="width:'+Math.max(0,Math.round(100*q.left/q.limit))+'%"'+(q.left<5000?' class="low"':'')+'></b></div>')+'<div class="tag">'+tagText(q)+'</div>'+boostsHTML(q);
  if(q.type==='mc'){
    if(it.t==='e')h+='<div class="sentence">Which part is <b>wrong</b>?<br>'+segHTML(q)+'</div><div class="opts letters">';
    else h+='<div class="sentence">'+sentenceHTML(it,q.answered?it.o[0]:null,q.answered?(q.ok?'ok':'ko'):'')+'</div><div class="opts">';
    q.opts.forEach(function(o,i){
      var c='opt';
      if(q.hid&&q.hid.indexOf(i)>=0)c+=' gone';
      if(q.answered){if(o.ok)c+=' good';else if(i===q.picked)c+=' bad'}
      h+='<button class="'+c+'" data-i="'+i+'"'+(q.answered||(q.hid&&q.hid.indexOf(i)>=0)?' disabled':'')+'>'+esc(o.t)+'</button>';
    });
    h+='</div>';
  }else{
    var n=it.w.length,sl='',tl='';
    for(var i=0;i<n;i++)sl+='<span class="slot'+(q.answered?(q.ok?' ok':' ko'):'')+'">'+(q.built[i]!==undefined?esc(q.tiles[q.built[i]].ch):'')+'</span>';
    q.tiles.forEach(function(t,i){tl+='<button class="tile" data-i="'+i+'"'+(q.built.indexOf(i)>=0||q.answered?' disabled':'')+'>'+esc(t.ch)+'</button>'});
    h+='<div class="sentence">Clue (French): <b>'+esc(it.fr)+'</b> <span class="verb">('+n+' letters)</span></div>'+
       '<div class="slots">'+sl+'</div><div class="tiles">'+tl+'</div>'+
       '<div class="row2"><button class="btn" id="undo"'+(q.answered||!q.built.length?' disabled':'')+'>Undo</button>'+
       '<button class="btn solid" id="check"'+(q.answered||q.built.length!==n?' disabled':'')+'>Check</button></div>';
  }
  h+='<div class="fb" id="fb">'+(q.answered?q.fb:'')+'</div>';
  if(q.answered&&!S.busy){
    if(S.view==='gift')h+='<div class="nextrow"><button class="btn solid" id="backB">Back to the village</button></div>';
    else if(!S.ended)h+='<div class="nextrow"><button class="btn solid" id="nextB">Next question</button></div>';
  }else if(S.view==='gift'&&!q.answered){
    h+='<div class="nextrow"><button class="btn" id="cancelB">Skip the gift</button></div>';
  }
  $('#panel').innerHTML=h;
  if(q.type==='mc'){
    Array.prototype.forEach.call(document.querySelectorAll('.opt'),function(b){
      b.addEventListener('click',function(){answerMC(parseInt(b.getAttribute('data-i'),10))});
    });
  }else{
    Array.prototype.forEach.call(document.querySelectorAll('.tile'),function(b){
      b.addEventListener('click',function(){
        if(q.answered||q.built.length>=it.w.length)return;
        q.built.push(parseInt(b.getAttribute('data-i'),10));showPanel();
      });
    });
    var u=$('#undo');if(u)u.addEventListener('click',function(){if(!q.answered){q.built.pop();showPanel()}});
    var c=$('#check');if(c)c.addEventListener('click',checkWord);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-bo]'),function(b){b.addEventListener('click',function(){useBoost(b.getAttribute('data-bo'))})});
  var nb=$('#nextB');if(nb)nb.addEventListener('click',nextQuestion);
  var bb=$('#backB');if(bb)bb.addEventListener('click',backToVillage);
  var cb=$('#cancelB');if(cb)cb.addEventListener('click',backToVillage);
}
function nextQuestion(){
  if(S.ended||S.busy)return;
  S.view='main';S.q=makeQ(nextItem());showPanel();
}
function backToVillage(){
  S.view='main';S.gq=null;
  if(S.q&&!S.ended)showPanel();else if(S.ended)idleStart();else nextQuestion();
}
function answerMC(i){
  var q=curQ();
  if(!q||q.answered||S.ended||(S.busy&&S.view==='main')||S.paused)return;
  q.answered=true;q.picked=i;q.ok=q.opts[i].ok;
  q.fb=feedbackHTML(q,q.ok);
  resolve(q);
}
function checkWord(){
  var q=curQ();
  if(!q||q.answered||S.ended||(S.busy&&S.view==='main')||S.paused||q.built.length!==q.item.w.length)return;
  q.answered=true;
  q.ok=q.built.map(function(i){return q.tiles[i].ch}).join('')===q.item.w;
  q.fb=feedbackHTML(q,q.ok);
  resolve(q);
}
function timeUp(q){
  if(!q||q.answered)return;
  q.answered=true;q.ok=false;q.timedOut=true;q.picked=-1;
  q.fb=feedbackHTML(q,false);
  resolve(q);
}
var lastTick=performance.now();
setInterval(function(){
  var now=performance.now(),dt=Math.min(now-lastTick,500);lastTick=now;
  var q=curQ();
  if(!q||q.answered||S.ended||S.paused||(S.busy&&S.view==='main')||document.visibilityState!=='visible')return;
  q.left-=dt;q.spent=(q.spent||0)+dt;
  var b=$('#tbar');
  if(b){b.style.width=Math.max(0,100*q.left/q.limit).toFixed(1)+'%';b.classList.toggle('low',q.left<5000)}
  if(q.left<=0)timeUp(q);
},200);
function countStat(q){
  var it=q.item,ct=it.t,cs=S.stats.byCat[ct]||(S.stats.byCat[ct]={n:0,ok:0});
  cs.n++;if(q.ok)cs.ok++;S.stats.answered++;if(q.ok)S.stats.correct++;
  if(!q.ok&&S.missed.indexOf(it)<0)S.missed.push(it);
}
function resolve(q){
  countStat(q);
  if(S.view==='gift'){giftResult(q);return}
  if(!q.ok){
    if(S.inv.shield>0){S.att={shield:true};q.fb+='<br><span class="ok">Snow shield!</span> Grumbo slipped on the ice. No heart lost.'}
    else{var a=pickAttack();S.att=a;q.fb+='<br><span class="ko">'+esc(a.t)+'</span><br><span class="ver">'+a.v[0]+' &rarr; '+a.v[1]+' &rarr; '+a.v[2]+'</span>'}
  }
  mainResult(q.ok,q.ok&&(q.spent||0)<=(hasPk('quick')?8000:5000));
}

/* ---------- HUD, toast ---------- */
function stageNow(){var n=Object.keys(S.own).length,st=1;C.STAGES.forEach(function(x){if(n>=x.need)st=x.n});return st}
function hud(){
  $('#day').textContent=S.levelDone?(S.nextDay||S.day):S.day;$('#coins').textContent=S.coins;
  var h='';for(var i=0;i<MAXL;i++)h+='<span class="'+(i<S.lives?'':'lost')+'">&#9829;&#xFE0E;</span>';
  $('#lives').innerHTML=h;
  $('#qn').textContent=(S.ended&&S.levelDone)?'Question 0 / '+S.N:'Question '+Math.min(S.placed+1,S.N)+' / '+S.N;
  var st=C.STAGES[Math.max(1,S.stg)-1];$('#stg').textContent='Stage '+st.n+': '+st.name;
  letterHUD();
}
function toast(v,m,good,ms){
  var t=$('#toast');
  t.className='toast on'+(good?' good':'');
  t.innerHTML=(v?'<span class="v">'+esc(v)+'</span>':'')+(m?'<span class="m">'+esc(m)+'</span>':'');
  clearTimeout(toast.tm);toast.tm=setTimeout(function(){t.className='toast'},ms||2400);
}
function shake(){var s=$('#scene');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake')}

/* ---------- Santa's letters ---------- */
function letterOk(L){
  switch(L.k){
    case 'own':return own(L.n);
    case 'snow3':return ['c_sn1','c_sn2','c_sn3'].filter(own).length>=3;
    case 'stage':return S.stg>=L.n;
    case 'santaSleigh':return own('c_santa')&&own('c_sleigh');
    case 'rd3':return deerCount()>=3;
    case 'correct':return S.stats.correct>=L.n;
    default:return (S.stats[L.k]|0)>=L.n;
  }
}
function letterHUD(){
  var L=C.LETTERS[S.qi],e=$('#letter');
  if(!P.user){e.style.display='none';return}
  e.style.display='';
  e.innerHTML=L?'<i class="env"></i><span><b>Letter from Santa:</b> '+esc(L.t)+'</span><em>+'+L.r+'</em>':'<i class="env"></i><span><b>Santa says:</b> You answered every letter. Merry Christmas!</span>';
}
function checkLetter(){
  var L=C.LETTERS[S.qi],guard=0;
  while(L&&letterOk(L)&&guard++<10){
    S.coins+=L.r;S.qi++;toast('Letter from Santa','Goal reached! +'+L.r+' coins',true,3600);
    var d=SC.doorPos();SC.sparkle(d[0],d[1]-20,'#ffd45a',20);ding(true);
    L=C.LETTERS[S.qi];
  }
  hud();
}
function checkStage(){
  var st=stageNow();
  if(st>S.stg){var g=C.STAGES[st-1];S.stg=st;S.coins+=g.bonus;toast('Stage '+st+': '+g.name,g.words+' +'+g.bonus+' coins',true,6000);SC.celebrate();ding(true)}
  hud();
}

/* ---------- Grumbo ---------- */
function pickAttack(){
  var c=ATT.filter(function(a){return a.need()&&!S.dmg[a.k]});
  return c.length?c[rnd(c.length)]:SNOWBALL;
}
function repairOne(){
  if(!S.dmgOrder.length)return;
  var k=S.dmgOrder.shift(),a=ATT.filter(function(x){return x.k===k})[0];
  delete S.dmg[k];
  if(a){toast('Repaired!',a.fix,true,2200);SC.sparkle(a.tx,a.ty-14,'#7fe3a8',16)}
}
function repairAll(){S.dmg={};S.dmgOrder=[]}
async function runGrumbo(a,blocked){
  var gen=S.gen,A=1100,Bt=1300,Cx=900,side=rnd(2)?340:-24;
  S.gr={t0:performance.now(),sx:side,tx:a.tx,ty:a.ty,ex:side,a:A,b:Bt,c:Cx};
  await wait(A+350);if(gen!==S.gen)return;
  if(blocked){SC.sparkle(a.tx,a.ty-10,'#bfe6ff',22);toast('Snow shield!','Grumbo slipped on the ice.',true,2400)}
  else{
    if(a.k!=='snow'){S.dmg[a.k]=1;S.dmgOrder.push(a.k)}
    shake();toast(a.t,a.v[0]+', '+a.v[1]+', '+a.v[2],false,2800);
  }
  await wait(Bt+Cx-350);if(gen!==S.gen)return;
  S.gr=null;
}

/* ---------- gifts from the sky ---------- */
function removeGift(){S.gift=null}
function spawnGift(){
  if(S.gift||S.ended)return;
  var g={x:40+rnd(240),y:-30,x0:0,el:0,gen:S.gen,dur:hasPk('magnet')?16000:10500};g.x0=g.x;S.gift=g;
  var last=0;
  function step(now){
    if(S.gift!==g||g.gen!==S.gen)return;
    var dt=last?Math.min(now-last,50):0;last=now;
    if(S.paused||S.sheet){requestAnimationFrame(step);return}
    g.el+=dt;var u=g.el/g.dur;
    if(u>=1){S.gift=null;toast('','The gift landed in the snow.');return}
    g.x=g.x0+Math.sin(u*9)*18;g.y=-30+u*190;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function onGift(){
  if(S.ended||!S.gift||S.view==='gift'||S.sheet)return;
  removeGift();S.view='gift';S.gq=makeQ(drawFrom('deck',NORMAL));showPanel();
  toast('Gift caught','Answer correctly to win back a heart.',true);
}
function giftResult(q){
  S.stats.gifts++;if(q.ok)S.stats.giftsOk++;
  var add='';
  if(q.ok){
    S.coins+=15;add='<br><span class="ok">+15 coins!</span>';
    if(S.lives<MAXL){S.lives++;add+='<br><span class="ok">+1 heart!</span>'}
    else{S.score+=30;add+='<br><span class="ok">Your hearts are already full: +30 points instead.</span>'}
    ding(true);
  }else{add='<br><span class="ko">Gift lost.</span>';ding(false)}
  q.fb+=add;
  hud();checkLetter();scheduleSave();showPanel();
}
function maybeGift(){
  if(S.gift||S.ended)return;
  if(S.sinceGift>=S.nextGift){S.sinceGift=0;S.nextGift=4+rnd(3);spawnGift()}
}

/* ---------- MAIN FLOW ---------- */
async function mainResult(ok,fast){
  var gen=S.gen;
  S.busy=true;S.qCount++;if(ok)S.okCount++;
  if(ok){
    var gain=10+(hasPk('lucky')?2:0);
    S.score+=10;S.coins+=gain;S.streak++;S.stats.maxStreak=Math.max(S.stats.maxStreak,S.streak);S.placed++;
    var line='+'+gain+' coins';
    if(fast){S.coins+=3;line+=' +3 quick bonus'}
    toast(line,S.streak>=2?S.streak+' in a row':'',true,1500);ding(true);
    repairOne();
    var d=SC.doorPos();SC.sparkle(d[0]-10+rnd(20),d[1]-30,'#ffe27a',10);
    if(S.streak%3===0&&S.placed<S.N){
      var bonus=Math.min(30,6+S.streak*2);S.coins+=bonus;
      setTimeout(function(){toast('Streak x'+S.streak,'Bonus +'+bonus+' coins',true,2200)},900);SC.celebrate();
    }
    hud();checkLetter();scheduleSave();showPanel();
    await wait(450);
    if(gen!==S.gen)return;
    if(S.placed>=S.N){await dayComplete();return}
  }else if(S.att&&S.att.shield){
    S.inv.shield--;S.streak=0;hud();scheduleSave();showPanel();ding(false);
    await runGrumbo({tx:176,ty:162,k:'snow'},true);
    if(gen!==S.gen)return;
  }else{
    S.streak=0;S.lives--;hud();scheduleSave();showPanel();ding(false);
    await runGrumbo(S.att||SNOWBALL,false);
    if(gen!==S.gen)return;
    scheduleSave();
    if(S.lives<=0){gameOver();return}
  }
  S.busy=false;S.sinceGift++;maybeGift();showPanel();
}
async function dayComplete(){
  var gen=S.gen;
  S.ended=true;S.levelDone=true;S.nextDay=S.day+1;S.stats.levelsCleared++;removeGift();repairAll();
  var bonus=S.lives*20,cb=S.lives*8+20;S.score+=bonus;S.coins+=cb;saveBest();
  hud();checkLetter();scheduleSave();flush();
  idle('Day '+S.day+' complete! Enjoy the fireworks.');
  SC.celebrate();ding(true);
  await wait(3400);if(gen!==S.gen)return;
  dayDoneScreen(bonus,cb);
}
function dayDoneScreen(bonus,cb){
  var n=S.stats.levelsCleared,door=n<=24;
  screen('<h2>Day '+(S.nextDay-1)+' complete</h2>'+
    (door?'<p class="ok" style="color:var(--green)">Door '+n+' of the Advent calendar is open. Tap Advent to collect your gift.</p>':'')+
    (n===24?'<p class="big">All 24 doors are open. It is Christmas Eve: open the Menu and send Santa on his way.</p>':'')+
    '<p>Bonus for hearts left: <b class="big">+'+bonus+'</b> points and <b class="big">+'+cb+'</b> coins<br>Score: <b class="big">'+S.score+'</b> (best: '+S.best+')</p>'+recapHTML()+
    '<div class="row"><button class="btn solid" id="nx">Start day '+S.nextDay+'</button><button class="btn" id="shp">Shop ('+S.coins+' coins)</button><button class="btn" id="adv">Advent</button><button class="btn" id="mn">Menu</button></div>');
  $('#nx').addEventListener('click',function(){S.missed=[];startDay()});
  $('#shp').addEventListener('click',function(){hideScreen();idleStart();openSheet('shop')});
  $('#adv').addEventListener('click',function(){hideScreen();idleStart();openSheet('advent')});
  $('#mn').addEventListener('click',menuScreen);
}
function gameOver(){
  S.ended=true;S.levelDone=true;S.nextDay=S.day;S.busy=false;removeGift();saveBest();hud();scheduleSave();flush();
  screen('<h2>Grumbo froze the village</h2><p>Day '+S.day+': score <b class="big">'+S.score+'</b> (best: '+S.best+')<br>Your village and your coins are safe. Try the day again.</p>'+recapHTML()+
    '<div class="row"><button class="btn solid" id="rt">Replay day '+S.day+'</button><button class="btn" id="shp">Shop ('+S.coins+' coins)</button><button class="btn" id="mn">Menu</button></div>');
  $('#rt').addEventListener('click',function(){S.missed=[];startDay()});
  $('#shp').addEventListener('click',function(){hideScreen();idleStart();openSheet('shop')});
  $('#mn').addEventListener('click',menuScreen);
}
function saveBest(){if(S.score>S.best){S.best=S.score;try{localStorage.setItem('xmBest',String(S.best))}catch(e){}}}
function recapHTML(){
  if(!S.missed.length)return '<p>No mistakes this round. Well done.</p>';
  var h='<p class="big">To review ('+S.missed.length+')</p><div class="recap">';
  S.missed.forEach(function(it){h+='<div>'+fullSentence(it)+(it.t==='w'||it.t==='t'?'':'<br><em>'+esc(it.fr)+'</em>')+'</div>'});
  return h+'</div>';
}
function startDay(saved){
  if(!P.user){startScreen();return}
  var res=!!(saved&&saved.inLevel);
  closeSheet(true);removeGift();hideScreen();
  S.gen++;
  S.N=levelN(S.day);S.lives=res?Math.max(1,saved.lives|0):MAXL;S.placed=res?Math.min(S.N-1,saved.placed|0):0;
  S.q=null;S.gq=null;S.view='main';S.busy=false;S.ended=false;S.levelDone=false;S.nextDay=0;S.active=true;S.saveOK=true;S.paused=false;
  S.sinceGift=0;S.nextGift=3+rnd(3);S.streak=0;repairAll();S.gr=null;
  S.stats.maxLevel=Math.max(S.stats.maxLevel,S.day);
  toast('Day '+S.day,'Answer '+S.N+' questions to finish the day.',true,2800);
  hud();nextQuestion();scheduleSave();
}

/* ---------- SHOP / DECORATE / ADVENT (sheet under the scene) ---------- */
function openSheet(kind,arg){
  if(!P.user)return;
  if(S.busy&&!S.ended){toast('','Wait for Grumbo to leave first.');return}
  if(kind==='shop'&&arg)S.shopTab=arg;
  if(kind==='decor'&&arg)S.openG=arg;
  S.sheet=kind;S.paused=true;$('#panel').hidden=true;$('#sheet').hidden=false;renderSheet();
  $('#sheet').scrollTop=0;
  var r=$('#sheet').getBoundingClientRect();if(r.top<0||r.top>window.innerHeight*.8)$('#sheet').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function closeSheet(silent){
  if(!S.sheet&&!silent)return;
  S.sheet=null;S.paused=false;$('#sheet').hidden=true;$('#panel').hidden=false;
  if(!silent){hud();showPanel();scheduleSave()}
}
function renderSheet(){
  var k=S.sheet,el=$('#sheet'),top=el.scrollTop;
  if(k==='shop')shopHTML();else if(k==='decor')decorHTML();else if(k==='advent')adventHTML();
  el.scrollTop=top;
}
function sheetHead(title){return '<div class="shophead"><h2>'+title+'</h2><div style="display:flex;gap:8px;align-items:center"><span class="coinpill"><b>'+S.coins+'</b> coins</span><button class="btn" id="shClose">Close</button></div></div>'}
function wireSheet(){
  var cl=$('#shClose');if(cl)cl.addEventListener('click',function(){closeSheet()});
}
/* shop */
function itemState(it){
  if(own(it.id))return {s:'owned'};
  if(it.st>S.stg)return {s:'lock',why:'Stage '+it.st};
  if(it.chain&&!own(it.chain))return {s:'lock',why:'Buy '+ITEM[it.chain].name+' first'};
  return {s:'buy'};
}
function shopHTML(){
  var tabs='';C.TABS.forEach(function(t){
    var n='';if(ITEM&&['house','village','trees','gifts','folk','animals','decor','sky'].indexOf(t[0])>=0){var all=C.ITEMS.filter(function(i){return i.tab===t[0]});n='<i>'+all.filter(function(i){return own(i.id)}).length+'/'+all.length+'</i>'}
    tabs+='<button class="stab'+(S.shopTab===t[0]?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+n+'</button>'});
  var st=C.STAGES[S.stg-1],nx=C.STAGES[S.stg],cnt=Object.keys(S.own).length;
  var h=sheetHead('Shop')+'<p class="sintro"><b>Stage '+st.n+': '+st.name+'</b> | '+cnt+' items'+(nx?' | Next stage at '+nx.need+' items':' | Final stage reached')+'</p>'+
    '<div class="sbar"><b style="width:'+(nx?Math.min(100,Math.round(100*(cnt-st.need)/(nx.need-st.need))):100)+'%"></b></div>'+
    '<div class="stabs">'+tabs+'</div><div class="shopl">';
  var t=S.shopTab;
  if(t==='boost'){
    C.BOOSTS.forEach(function(b){h+='<div class="si"><div class="nm">'+b.name+' <span class="tl">(you have '+S.inv[b.id]+')</span><em>'+b.desc+'</em></div><button class="btn solid" data-boost="'+b.id+'"'+(S.coins<b.price?' disabled':'')+'>'+b.price+'</button></div>'});
  }else if(t==='perk'){
    C.PERKS.forEach(function(b){var o=hasPk(b.id);h+='<div class="si'+(o?' owned':'')+'"><div class="nm">'+b.name+'<em>'+b.desc+'</em></div>'+(o?'<span class="tg">OWNED</span>':'<button class="btn solid" data-perk="'+b.id+'"'+(S.coins<b.price?' disabled':'')+'>'+b.price+'</button>')+'</div>'});
  }else if(t==='grumbo'){
    h+='<p class="sintro">Dress Grumbo up. He still attacks, but he looks ridiculous.</p>';
    C.COSTUMES.forEach(function(b){var o=S.cs.indexOf(b.id)>=0;h+='<div class="si'+(o?' owned':'')+'"><div class="nm">'+b.name+'<em>'+b.desc+'</em></div>'+(o?'<span class="tg">OWNED</span>':'<button class="btn solid" data-cost="'+b.id+'"'+(S.coins<b.price?' disabled':'')+'>'+b.price+'</button>')+'</div>'});
  }else if(t==='chest'){
    h+='<div class="si"><div class="nm">Mystery chest<em>Coins, boosts or a rare decoration colour. You never know.</em></div><button class="btn solid" id="chestBuy"'+(S.coins<C.CHEST_PRICE?' disabled':'')+'>'+C.CHEST_PRICE+'</button></div>';
    if(S.chestMsg)h+='<div class="si owned"><div class="nm">'+S.chestMsg+'</div></div>';
  }else{
    C.ITEMS.filter(function(i){return i.tab===t}).forEach(function(it){
      var s=itemState(it);
      h+='<div class="si '+s.s+'"><div class="nm">'+it.name+'<em>'+it.desc+'</em></div>'+
        (s.s==='owned'?'<span class="tg">OWNED</span>':s.s==='lock'?'<span class="tl">'+esc(s.why)+'</span>':'<button class="btn solid" data-buy="'+it.id+'"'+(S.coins<it.price?' disabled':'')+'>'+it.price+'</button>')+'</div>'});
  }
  h+='</div>';
  $('#sheet').innerHTML=h;wireSheet();
  Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'),function(b){b.addEventListener('click',function(){S.shopTab=b.getAttribute('data-tab');S.chestMsg='';renderSheet()})});
  Array.prototype.forEach.call(document.querySelectorAll('[data-buy]'),function(b){b.addEventListener('click',function(){buyItem(b.getAttribute('data-buy'))})});
  Array.prototype.forEach.call(document.querySelectorAll('[data-boost]'),function(b){b.addEventListener('click',function(){var o=C.BOOSTS.filter(function(x){return x.id===b.getAttribute('data-boost')})[0];if(S.coins<o.price)return;S.coins-=o.price;S.inv[o.id]++;toast('Bought',o.name,true,1500);sold()})});
  Array.prototype.forEach.call(document.querySelectorAll('[data-perk]'),function(b){b.addEventListener('click',function(){var o=C.PERKS.filter(function(x){return x.id===b.getAttribute('data-perk')})[0];if(S.coins<o.price||hasPk(o.id))return;S.coins-=o.price;S.pk.push(o.id);toast('Perk unlocked',o.name,true,2000);sold()})});
  Array.prototype.forEach.call(document.querySelectorAll('[data-cost]'),function(b){b.addEventListener('click',function(){var o=C.COSTUMES.filter(function(x){return x.id===b.getAttribute('data-cost')})[0];if(S.coins<o.price||S.cs.indexOf(o.id)>=0)return;S.coins-=o.price;S.cs.push(o.id);toast('Grumbo wears it',o.name,true,2000);sold()})});
  var cb=$('#chestBuy');if(cb)cb.addEventListener('click',function(){if(S.coins<C.CHEST_PRICE)return;S.coins-=C.CHEST_PRICE;openChest();sold()});
}
function sold(){hud();checkLetter();checkStage();scheduleSave();renderSheet()}
function buyItem(id){
  var it=ITEM[id];if(!it)return;var s=itemState(it);
  if(s.s!=='buy'||S.coins<it.price)return;
  S.coins-=it.price;S.own[id]=1;
  toast('Bought',it.name,true,1800);ding(true);
  var d=SC.doorPos();SC.sparkle(d[0]-60+rnd(120),110+rnd(40),'#ffe27a',18);
  sold();
}
/* mystery chest */
function lockedUnlocks(){
  var out=[];[C.LIGHT_COLS,C.SMOKE_COLS,C.AUR,C.SLEIGH,C.FIRE].forEach(function(l){l.forEach(function(o){if(o.unl&&!S.unl[o.unl])out.push(o.unl)})});
  C.GROUPS.forEach(function(g){g.rows.forEach(function(r){r[2].forEach(function(o){if(o.unl&&!S.unl[o.unl]&&out.indexOf(o.unl)<0)out.push(o.unl)})})});
  return out;
}
function openChest(){
  var r=Math.random(),msg;
  S.stats.chests++;
  if(r<.5){var c=30+rnd(41);S.coins+=c;msg='You found <b>'+c+' coins</b>.'}
  else if(r<.72){var c2=90+rnd(61);S.coins+=c2;msg='Lucky! <b>'+c2+' coins</b>.'}
  else if(r<.9){var b=['shield','half','freeze'][rnd(3)],n=1+rnd(2);S.inv[b]+=n;msg='You found <b>'+n+' x '+(b==='shield'?'Snow shield':b==='half'?'50/50':'+10 seconds')+'</b>.'}
  else if(r<.97){var u=lockedUnlocks();if(u.length){var id=u[rnd(u.length)];S.unl[id]=1;msg='Rare find: <b>'+(C.UNL_NAMES[id]||id)+'</b> is now free in Decorate.'}else{S.coins+=100;msg='You found <b>100 coins</b>.'}}
  else{var c3=150+rnd(101);S.coins+=c3;msg='Jackpot! <b>'+c3+' coins</b>.'}
  S.chestMsg=msg;toast('Mystery chest','',true,1800);ding(true);SC.celebrate();
  return msg;
}
/* decorate */
function groupVisible(g){return g.need.length===0||g.need.some(own)}
function optLocked(o){return o.unl&&!S.unl[o.unl]}
function optNeed(o){return o.need&&!own(o.need)}
function cuVal(k,d){var v=S.cu[k];return v==null||v===''?d:v}
function decorHTML(){
  var h=sheetHead('Decorate')+'<p class="sintro">Everything here is free to change. Tap an object in the scene to jump to its settings. Locked colours and effects cost a few coins (or come from the Advent calendar).</p>';
  var gs=C.GROUPS.filter(groupVisible);
  gs.forEach(function(g){
    var open=S.openG===g.id;
    h+='<div class="grp'+(open?' open':'')+'"><h3 data-g="'+g.id+'" style="cursor:pointer">'+g.label+(open?'':' <span class="tl">tap to open</span>')+'</h3>';
    if(open){
      g.rows.forEach(function(r){
        var key=r[0],label=r[1],opts=r[2],def=r[3],cur=cuVal(key,def);
        h+='<div class="opr"><label>'+label+'</label><div class="oc">';
        opts.forEach(function(o){
          var lk=optLocked(o),nd=optNeed(o),on=(cur===o.v);
          var dot=o.c?'<i class="dot'+(o.multi?' multi':'')+'" style="background:'+(o.multi?'':o.c)+'"></i>':(o.multi?'<i class="dot multi"></i>':'');
          h+='<button class="'+(on?'on':'')+(lk||nd?' lk':'')+'" data-k="'+key+'" data-v="'+o.v+'">'+dot+o.l+(lk?' <span class="pr">'+o.cost+'c'+(o.adv?' or day '+o.adv:'')+'</span>':'')+(nd&&!lk?' <span class="pr">shop</span>':'')+'</button>';
        });
        h+='</div></div>';
      });
      if(g.kind==='lights')h+='<div class="row" style="margin-top:2px"><button class="btn" data-all="'+g.id+'">Apply this colour and effect to all lights</button></div>';
    }
    h+='</div>';
  });
  $('#sheet').innerHTML=h;wireSheet();
  Array.prototype.forEach.call(document.querySelectorAll('[data-g]'),function(b){b.addEventListener('click',function(){S.openG=(S.openG===b.getAttribute('data-g')?'':b.getAttribute('data-g'));renderSheet()})});
  Array.prototype.forEach.call(document.querySelectorAll('[data-k]'),function(b){b.addEventListener('click',function(){setCu(b.getAttribute('data-k'),b.getAttribute('data-v'))})});
  Array.prototype.forEach.call(document.querySelectorAll('[data-all]'),function(b){b.addEventListener('click',function(){applyAll(b.getAttribute('data-all'))})});
}
function findOpt(key,v){
  var f=null;C.GROUPS.forEach(function(g){g.rows.forEach(function(r){if(r[0]===key)r[2].forEach(function(o){if(o.v===v)f=o})})});return f;
}
function setCu(key,v){
  var o=findOpt(key,v);if(!o)return;
  if(optNeed(o)&&!optLocked(o)){toast('','Buy it in the Shop first.');return}
  if(optLocked(o)){
    if(S.coins<o.cost){toast('Locked','You need '+o.cost+' coins.');return}
    S.coins-=o.cost;S.unl[o.unl]=1;toast('Unlocked',o.l,true,1800);ding(true);
  }
  S.cu[key]=v;S.stats.cust++;sync();hud();checkLetter();scheduleSave();renderSheet();
}
function applyAll(gid){
  var g=C.GROUPS.filter(function(x){return x.id===gid})[0],colK=null,effK=null;
  g.rows.forEach(function(r){if(/_col$/.test(r[0])&&r[2]===C.LIGHT_COLS)colK=r[0];if(/_eff$/.test(r[0])&&r[2].length&&r[2][0].v==='steady'&&r[0].indexOf('w')!==0)effK=r[0]});
  var col=cuVal(colK,'gold'),eff=cuVal(effK,'steady');
  ['hl_col','sl_col','fl_col','tr_col'].forEach(function(k){S.cu[k]=col});
  ['hl_eff','sl_eff','fl_eff','tr_eff'].forEach(function(k){S.cu[k]=eff});
  S.stats.cust++;toast('All lights updated','',true,1600);scheduleSave();checkLetter();renderSheet();
}
/* advent calendar */
function adventHTML(){
  var done=S.stats.levelsCleared,h=sheetHead('Advent calendar')+'<p class="sintro">Finish a day to open the next door. '+done+' of 24 doors can be opened.'+(S.advMsg?' <b style="color:var(--green)">'+S.advMsg+'</b>':'')+'</p><div class="advgrid">';
  for(var n=1;n<=24;n++){
    var claimed=S.adv.indexOf(n)>=0,ready=!claimed&&done>=n,cls=claimed?'done':ready?'ready':'lock';
    h+='<button class="door '+cls+'" data-door="'+n+'"><b>'+n+'</b><span>'+(claimed?'opened':ready?'open me':'locked')+'</span></button>';
  }
  h+='</div>';
  $('#sheet').innerHTML=h;wireSheet();
  Array.prototype.forEach.call(document.querySelectorAll('[data-door]'),function(b){b.addEventListener('click',function(){claimDoor(parseInt(b.getAttribute('data-door'),10))})});
}
function claimDoor(n){
  if(S.adv.indexOf(n)>=0||S.stats.levelsCleared<n)return;
  var r=C.ADVENT[n-1],parts=[];
  if(r.c){S.coins+=r.c;parts.push(r.c+' coins')}
  if(r.b){var q=r.n||1;S.inv[r.b]+=q;parts.push(q+' x '+(r.b==='shield'?'Snow shield':r.b==='half'?'50/50':'+10 seconds'))}
  if(r.u){S.unl[r.u]=1;parts.push((C.UNL_NAMES[r.u]||r.u)+' (free in Decorate)')}
  if(r.chest){var m=openChest();parts.push('a mystery chest');S.advMsg='Door '+n+': '+parts.join(' and ')+'. '+m.replace(/<[^>]+>/g,'');S.adv.push(n);ding(true);hud();checkLetter();scheduleSave();renderSheet();return}
  S.adv.push(n);S.advMsg='Door '+n+': '+parts.join(' and ')+'.';ding(true);SC.celebrate();hud();checkLetter();scheduleSave();renderSheet();
}

/* ---------- taps on the scene ---------- */
var HITGROUP={house:'house',tree:'tree',sn1:'sn1',sn2:'sn2',sn3:'sn3',lamp:'lamp',fire:'fire',fence:'fence',string:'string',sleigh:'sleigh',pond:'sky',gifts:'tree'};
function sceneTap(ev){
  var cv=$('#cv'),r=cv.getBoundingClientRect(),lx=(ev.clientX-r.left)/r.width*SC.W,ly=(ev.clientY-r.top)/r.height*SC.H;
  var id=SC.hitTest(lx,ly);if(!id)return;
  if(id==='gift'){onGift();return}
  if(!P.user||S.sheet)return;
  if(S.busy&&!S.ended)return;
  var g=HITGROUP[id];
  if(g&&C.GROUPS.some(function(x){return x.id===g&&groupVisible(x)})){openSheet('decor',g);return}
  var it=ITEM[id]||ITEM['c_'+id]||null;
  toast(it?it.name:'','This one has no settings. Try the house, the trees, the lights or the sky.',false,2200);
}
$('#cv').addEventListener('pointerdown',function(ev){ev.preventDefault();sceneTap(ev)});

/* ---------- PERSISTENCE (same profiles and API as Arrow Escape; progress in the xm field) ---------- */
function normStats(s){
  var o=emptyStats();if(!s||typeof s!=='object')return o;
  ['answered','correct','levelsCleared','gifts','giftsOk','maxStreak','chests','takeoffs','cust'].forEach(function(k){o[k]=s[k]|0});
  o.maxLevel=Math.max(1,s.maxLevel|0);
  CATS.forEach(function(c){var x=s.byCat&&s.byCat[c[0]];if(x)o.byCat[c[0]]={n:x.n|0,ok:x.ok|0}});
  return o;
}
var P={user:null,token:null,progress:null,timer:null,dirty:false,flight:false,mode:'login',msg:'',confirmNew:false};
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k)}catch(e){}}
function progKey(){return 'xmProg:'+(P.user?P.user.key:'guest')}
function readLocal(){var j=lsGet(progKey());if(!j)return null;try{return JSON.parse(j)}catch(e){return null}}
function newer(a,b){if(!a)return b||null;if(!b)return a;return (a.savedAt||0)>=(b.savedAt||0)?a:b}
function saveSession(){if(P.user&&P.token)lsSet('letsplaySession',JSON.stringify({user:P.user,token:P.token}));else lsDel('letsplaySession')}
function setStatus(t){var e=$('#saveInfo');if(e)e.textContent=t}
function post(action,body){
  var h={'Content-Type':'application/json'};if(P.token)h.Authorization='Bearer '+P.token;
  return fetch('/api/player',{method:'POST',headers:h,keepalive:true,body:JSON.stringify(Object.assign({action:action,game:'xm'},body||{}))})
    .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,status:r.status,j:j}})})
    .catch(function(){return {ok:false,status:0,j:{error:'No connection to the server.'}}});
}
function snapshot(){
  var inLevel=!S.levelDone&&S.active;
  return {day:S.levelDone?(S.nextDay||S.day):S.day,score:S.score,best:S.best,lives:S.lives,placed:inLevel?S.placed:0,inLevel:inLevel,
    coins:S.coins,own:Object.keys(S.own),unl:Object.keys(S.unl),pk:S.pk.slice(),cs:S.cs.slice(),cu:Object.assign({},S.cu),inv:Object.assign({},S.inv),adv:S.adv.slice(),qi:S.qi,stg:S.stg,
    cats:S.cats,qCount:S.qCount,okCount:S.okCount,stats:S.stats,savedAt:Date.now()};
}
function scheduleSave(){
  if(!S.saveOK||!P.user)return;
  var s=snapshot();P.progress=s;lsSet(progKey(),JSON.stringify(s));
  P.dirty=true;setStatus('Progress will be saved online in a moment.');
  clearTimeout(P.timer);P.timer=setTimeout(flush,12000);
}
function flush(){
  clearTimeout(P.timer);
  if(!P.user||!P.token||!P.dirty)return;
  if(P.flight){P.timer=setTimeout(flush,3000);return}
  P.dirty=false;P.flight=true;setStatus('Saving...');
  post('save',{progress:P.progress}).then(function(r){
    P.flight=false;
    if(r.status===401){P.token=null;saveSession();setStatus('Session expired. Log in again to keep saving online.');return}
    if(!r.ok){P.dirty=true;setStatus('Could not save online. Kept on this device, retrying.');P.timer=setTimeout(flush,30000);return}
    setStatus('Progress saved online.');
  });
}
function adopt(pr){
  P.progress=pr||null;
  S.coins=Math.max(0,(pr&&pr.coins)|0);
  S.own={};if(pr&&Array.isArray(pr.own))pr.own.forEach(function(id){if(ITEM[id])S.own[id]=1});
  S.unl={};if(pr&&Array.isArray(pr.unl))pr.unl.forEach(function(id){S.unl[id]=1});
  S.pk=pr&&Array.isArray(pr.pk)?C.PERKS.map(function(x){return x.id}).filter(function(id){return pr.pk.indexOf(id)>=0}):[];
  S.cs=pr&&Array.isArray(pr.cs)?C.COSTUMES.map(function(x){return x.id}).filter(function(id){return pr.cs.indexOf(id)>=0}):[];
  S.cu={};if(pr&&pr.cu&&typeof pr.cu==='object')Object.keys(pr.cu).forEach(function(k){if(typeof pr.cu[k]==='string')S.cu[k]=pr.cu[k]});
  S.inv={shield:Math.min(99,Math.max(0,(pr&&pr.inv&&pr.inv.shield)|0)),half:Math.min(99,Math.max(0,(pr&&pr.inv&&pr.inv.half)|0)),freeze:Math.min(99,Math.max(0,(pr&&pr.inv&&pr.inv.freeze)|0))};
  S.adv=pr&&Array.isArray(pr.adv)?pr.adv.filter(function(n){return n>=1&&n<=24}):[];
  S.qi=Math.max(0,Math.min(C.LETTERS.length,(pr&&pr.qi)|0));
  S.stg=Math.max(1,Math.min(5,(pr&&pr.stg)|0||1));
  S.stats=normStats(pr&&pr.stats);
  S.qCount=(pr&&pr.qCount)|0;S.okCount=(pr&&pr.okCount)|0;
  if(pr&&pr.cats){var any=false;CATS.forEach(function(c){if(pr.cats[c[0]])any=true});
    if(any){S.cats={};CATS.forEach(function(c){S.cats[c[0]]=!!pr.cats[c[0]]})}}
  if(pr&&pr.best>S.best)S.best=pr.best;
  S.day=Math.max(1,(pr&&pr.day)|0||1);S.score=(pr&&pr.score)|0;
  S.levelDone=true;S.nextDay=S.day;S.ended=true;S.active=false;S.gen++;S.q=null;S.gq=null;S.dmg={};S.dmgOrder=[];S.gift=null;
  sync();
}
function onAuth(j){
  P.user=j.user;P.token=j.token;P.msg='';saveSession();S.active=false;S.saveOK=false;
  if(j.xmBest>S.best)S.best=j.xmBest;
  var local=readLocal(),pr=newer(j.xm,local);
  adopt(pr);
  if(pr&&pr===local&&pr!==j.xm){S.saveOK=true;P.dirty=true;flush()}
}
function logout(){
  flush();P.user=null;P.token=null;saveSession();S.active=false;S.saveOK=false;S.stats=emptyStats();adopt(null);
  P.mode='login';P.msg='';startScreen();
}
function boot(){
  var j=lsGet('letsplaySession');
  if(j){try{var o=JSON.parse(j);if(o&&o.token&&o.user){P.user=o.user;P.token=o.token}}catch(e){}}
  adopt(readLocal());
  if(P.user){
    post('load').then(function(r){
      if(r.status===401){P.user=null;P.token=null;saveSession();P.msg='Your session expired. Please log in again.';adopt(readLocal());if(!S.active)startScreen();return}
      if(r.ok){
        if(r.j.xmBest>S.best)S.best=r.j.xmBest;
        var pr=newer(r.j.xm,readLocal());
        if(!S.active){adopt(pr);startScreen()}
      }
    });
  }
}

/* ---------- SCREENS ---------- */
function screen(html){var s=$('#screen');s.innerHTML=html;s.classList.add('on');s.scrollTop=0}
function hideScreen(){$('#screen').classList.remove('on')}
function statsHTML(){
  var st=S.stats;if(!st.answered)return '';
  var pct=Math.round(100*st.correct/st.answered);
  var weak=CATS.map(function(c){var x=st.byCat[c[0]]||{n:0,ok:0};return {l:c[1],n:x.n,p:x.n?Math.round(100*x.ok/x.n):100}})
    .filter(function(x){return x.n>=5&&x.p<80}).sort(function(a,b){return a.p-b.p}).slice(0,3);
  var h='<div class="statsline">Answered <b>'+st.answered+'</b> | Correct <b>'+pct+'%</b> | Days finished <b>'+st.levelsCleared+'</b> | Items <b>'+Object.keys(S.own).length+'</b></div>';
  if(weak.length)h+='<div class="statsline">Work on: '+weak.map(function(x){return esc(x.l)+' ('+x.p+'%)'}).join(', ')+'</div>';
  return h;
}
function resumable(){var p=P.progress;return !!p&&(!!p.inLevel||p.day>1||p.score>0)}
function profileHTML(){
  if(P.user){
    return '<div class="profile"><div class="who"><b>'+esc(P.user.nom)+'</b>'+
      '<button class="btn" id="logout">Log out</button></div>'+statsHTML()+'</div>';
  }
  var su=P.mode==='signup';
  return '<div class="profile"><div class="tabs"><button class="tab'+(su?'':' on')+'" data-t="login">Log in</button><button class="tab'+(su?' on':'')+'" data-t="signup">Create my profile</button></div>'+
    '<input class="fld" id="fNom" placeholder="Your name (e.g. DUPONT Lea)" autocomplete="name" maxlength="40">'+
    '<input class="fld" id="fCode" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="4-digit secret code" autocomplete="off">'+
    '<p class="msg" id="pmsg">'+esc(P.msg)+'</p>'+
    '<div class="row"><button class="btn solid" id="pgo">'+(su?'Create profile':'Log in')+'</button></div>'+
    '<p class="muted small">You need a profile to play. It is the same profile as in Arrow Escape and Word Bridge. Your village is saved online, so you can continue on any device.</p></div>';
}
function wireProfile(){
  var lo=$('#logout');if(lo)lo.addEventListener('click',logout);
  Array.prototype.forEach.call(document.querySelectorAll('.tab'),function(t){
    t.addEventListener('click',function(){P.mode=t.getAttribute('data-t');P.msg='';startScreen()});
  });
  var go=$('#pgo');
  if(go)go.addEventListener('click',function(){
    var su=P.mode==='signup';
    var body={nom:$('#fNom').value.trim(),code:$('#fCode').value.trim()};
    var m=$('#pmsg');
    if(!body.nom){m.textContent='Please enter your name.';return}
    if(!/^\d{4}$/.test(body.code)){m.textContent='Your secret code must be exactly 4 digits.';return}
    go.disabled=true;m.textContent='Please wait...';
    post(su?'signup':'login',body).then(function(r){
      if(r.ok){onAuth(r.j);startScreen();return}
      go.disabled=false;P.msg=r.j.error||'Something went wrong.';m.textContent=P.msg;
    });
  });
}
function startScreen(){
  S.paused=false;closeSheet(true);
  if(!Object.keys(S.cats).length)CATS.forEach(function(c){S.cats[c[0]]=true});
  var chips='';
  CATS.forEach(function(c){chips+='<button class="chip'+(S.cats[c[0]]?' on':'')+'" data-c="'+c[0]+'">'+c[1]+'</button>'});
  var rs=resumable(),btns;
  if(P.confirmNew){
    btns='<p class="msg">Start over? This resets your day and score. Your village, coins and Advent doors are kept.</p><div class="row"><button class="btn solid" id="yes">Yes, start over</button><button class="btn" id="no">Cancel</button></div>';
  }else if(rs){
    btns='<div class="row"><button class="btn solid" id="cont">Continue (day '+Math.max(1,P.progress.day|0)+', score '+(P.progress.score|0)+')</button><button class="btn" id="newg">New game</button></div>';
  }else{
    btns='<div class="row"><button class="btn solid" id="go">Start</button><button class="btn" id="allc">Select all</button></div>';
  }
  if(!P.user){chips='';btns=''}
  screen('<h1>CHRISTMAS <span>VILLAGE</span></h1><p class="big">TOEIC EDITION</p><img class="banner" id="bnr" alt="Your village" '+(P.user?'':'style="display:none"')+'>'+profileHTML()+
    '<details class="rulebox"'+(P.user||rs?'':' open')+'><summary class="big">Directions</summary>'+
    '<ol class="rules"><li>Create a profile (your name and a 4-digit code) or log in to play. It is the same profile as in Arrow Escape and Word Bridge.</li>'+
    '<li>Build your own Christmas village. Every correct answer earns <b>10 coins</b>. Quick answers, streaks and gifts earn more.</li>'+
    '<li>Spend your coins in the Shop: houses, village shops, trees, snowmen, Santa, his sleigh and reindeer, animals, lights and sky effects. New items unlock as your village grows through five stages.</li>'+
    '<li>Press Decorate, or tap any object in the scene, to change colours, string lights (steady, twinkling, chasing), window lights and chimney smoke. Changes are free.</li>'+
    '<li>Beware of Grumbo, the grumpy goblin. Every wrong answer costs one heart and he spoils something in your village (lights, windows, a snowman...). Each time he shows you an irregular verb. Every correct answer repairs one thing. Lose all 5 hearts and you replay the day.</li>'+
    '<li>Be quick: you have 20 seconds per question (30 seconds to spot the wrong segment, 40 seconds for a scrambled word).</li>'+
    '<li>A gift parachutes down from time to time. Tap it before it lands, then answer its question to win back a heart.</li>'+
    '<li>Finish a day to open a door of the Advent calendar. Santa also sends you letters with goals and coins.</li>'+
    '<li>At the final stage, open the Menu and send Santa and his reindeer on their Christmas Eve flight.</li></ol></details>'+
    (P.user?'<p class="big">Choose your question types</p><div class="chips">'+chips+'</div>'+btns:'')+
    (P.user?'<div class="row"><button class="btn" id="visit">Visit my village (shop and decorate)</button></div>':'')+
    '<p>Best score: <b class="big">'+S.best+'</b></p><p class="credit">A game by Marc VASSEUR / Polytech Lille</p>');
  setTimeout(function(){var b=$('#bnr');if(b){try{b.src=$('#cv').toDataURL()}catch(e){}}},350);
  Array.prototype.forEach.call(document.querySelectorAll('.chip'),function(b){
    b.addEventListener('click',function(){
      var k=b.getAttribute('data-c'),on=Object.keys(S.cats).filter(function(x){return S.cats[x]});
      if(S.cats[k]&&on.length===1)return;
      S.cats[k]=!S.cats[k];b.classList.toggle('on',S.cats[k]);
      S.deck=[];S.hdeck=[];S.xdeck=[];
    });
  });
  var allc=$('#allc');if(allc)allc.addEventListener('click',function(){CATS.forEach(function(c){S.cats[c[0]]=true});
    Array.prototype.forEach.call(document.querySelectorAll('.chip'),function(b){b.classList.add('on')});S.deck=[];S.hdeck=[];S.xdeck=[]});
  var go=$('#go');if(go)go.addEventListener('click',newGame);
  var cont=$('#cont');if(cont)cont.addEventListener('click',resume);
  var ng=$('#newg');if(ng)ng.addEventListener('click',function(){P.confirmNew=true;startScreen()});
  var yes=$('#yes');if(yes)yes.addEventListener('click',function(){P.confirmNew=false;newGame()});
  var no=$('#no');if(no)no.addEventListener('click',function(){P.confirmNew=false;startScreen()});
  var vi=$('#visit');if(vi)vi.addEventListener('click',function(){S.saveOK=true;hideScreen();hud();idleStart()});
  wireProfile();hud();
}
function newGame(){
  if(!P.user){startScreen();return}
  S.day=1;S.score=0;S.deck=[];S.hdeck=[];S.xdeck=[];S.missed=[];S.qCount=0;S.okCount=0;
  startDay();
}
function resume(){
  var p=P.progress;if(!p){newGame();return}
  S.day=Math.max(1,p.day|0);S.score=p.score|0;S.qCount=p.qCount|0;S.okCount=p.okCount|0;
  S.deck=[];S.hdeck=[];S.xdeck=[];S.missed=[];
  startDay(p);
}
function canTakeoff(){return own('c_santa')&&own('c_sleigh')&&deerCount()>=1}
function takeoff(){
  if(!canTakeoff()||S.fly)return;
  hideScreen();
  S.fly={t0:performance.now()};S.stats.takeoffs++;S.fwOn=true;
  toast('Merry Christmas!','Santa and his reindeer take off into the night.',true,5000);SC.celebrate();setTimeout(SC.celebrate,3000);ding(true);
  setTimeout(function(){S.fly=null;hud();checkLetter();scheduleSave()},9200);
  idleStart();
}
function menuScreen(){
  if(!P.user){startScreen();return}
  S.paused=true;closeSheet(true);
  screen('<h2>Menu</h2>'+
    '<div class="row"><button class="btn solid" id="mCont">Back to the village</button></div>'+
    '<div class="row"><button class="btn" id="mPhoto">Save a photo of my village</button><button class="btn" id="mSound">Sound: '+(soundOn?'on':'off')+'</button></div>'+
    '<div class="row"><button class="btn solid" id="mFly"'+(canTakeoff()?'':' disabled')+'>Christmas Eve take-off</button></div>'+
    (canTakeoff()?'':'<p class="small muted">Needs Santa, his sleigh and at least one reindeer.</p>')+
    '<div class="row"><button class="btn" id="mTitle">Title screen</button></div>'+
    '<p class="credit">A game by Marc VASSEUR / Polytech Lille</p>');
  $('#mCont').addEventListener('click',function(){S.paused=false;hideScreen();hud();if(S.q&&!S.ended)showPanel();else idleStart()});
  $('#mTitle').addEventListener('click',function(){S.paused=false;scheduleSave();flush();startScreen()});
  $('#mSound').addEventListener('click',function(){soundOn=!soundOn;lsSet('xmSound',soundOn?'1':'0');if(soundOn)ding(true);menuScreen()});
  $('#mFly').addEventListener('click',function(){S.paused=false;takeoff()});
  $('#mPhoto').addEventListener('click',function(){
    var cvs=SC.photo(P.user.nom);cvs.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='christmas-village.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)},'image/png');
  });
}

/* ---------- toolbar and lifecycle ---------- */
$('#shopBtn').addEventListener('click',function(){S.sheet==='shop'?closeSheet():openSheet('shop')});
$('#decBtn').addEventListener('click',function(){S.sheet==='decor'?closeSheet():openSheet('decor')});
$('#advBtn').addEventListener('click',function(){S.sheet==='advent'?closeSheet():openSheet('advent')});
$('#menuBtn').addEventListener('click',function(){scheduleSave();flush();menuScreen()});
window.addEventListener('pagehide',function(){scheduleSave();flush()});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){scheduleSave();flush()}});
window.__xm={S:S,P:P,snapshot:snapshot,answerMC:answerMC,spawnGift:spawnGift,startDay:startDay,buyItem:buyItem,setCu:setCu,claimDoor:claimDoor,mainResult:mainResult,nextItem:nextItem,levelN:levelN,openChest:openChest,pickAttack:pickAttack,ATT:ATT};
SC.init($('#cv'));
boot();
hud();
startScreen();
})();

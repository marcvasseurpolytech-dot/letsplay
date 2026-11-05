/* Christmas Village: shop catalogue, customization options, stages, advent calendar and Santa's letters (data only). */
(function(){
'use strict';

/* Stages unlock as you own more items. Each stage gives a coin bonus. */
var STAGES=[
 {n:1,name:'Snowy Plain',need:0,bonus:0,words:'A quiet, snowy night. Answer questions to earn coins and bring Christmas to life.'},
 {n:2,name:'Quiet Village',need:5,bonus:60,words:'Smoke rises from the first chimneys. People are moving in.'},
 {n:3,name:"Santa's House",need:12,bonus:120,words:'Santa is coming to town. Prepare his house, his sleigh and his reindeer.'},
 {n:4,name:"Elves' Workshop",need:22,bonus:200,words:'The workshop hums day and night. The sky is full of lights.'},
 {n:5,name:'Christmas Eve',need:34,bonus:350,words:'Everything is ready. Time for the big take-off!'}
];

/* Shop items. tab: where it appears. st: stage needed. chain: must own the previous tier first. */
var ITEMS=[
 /* House (upgrade chain) */
 {id:'h1',tab:'house',name:'Wooden cabin',desc:'A small cabin with a warm window and a chimney.',price:40,st:1},
 {id:'h2',tab:'house',name:'Mountain chalet',desc:'Two windows, a bigger roof and a stone chimney.',price:120,st:1,chain:'h1'},
 {id:'h3',tab:'house',name:'Timber house',desc:'Half-timbered walls, a dormer window and a porch light.',price:250,st:2,chain:'h2'},
 {id:'h4',tab:'house',name:'Grand manor',desc:'Two floors, five windows, two chimneys and a balcony.',price:450,st:3,chain:'h3'},
 {id:'h5',tab:'house',name:'Christmas castle',desc:'Towers, flags, a golden gate and sparkling windows.',price:800,st:4,chain:'h4'},
 /* Village */
 {id:'v_cot',tab:'village',name:'Cosy cottage',desc:'A little house on the edge of the village.',price:60,st:1},
 {id:'v_toy',tab:'village',name:'Toy shop',desc:'Teddy bears in the window.',price:110,st:2},
 {id:'v_bak',tab:'village',name:'Gingerbread bakery',desc:'Smells of cinnamon. Its chimney smokes.',price:130,st:2},
 {id:'v_post',tab:'village',name:'Post office',desc:'Where children send their letters to Santa.',price:120,st:2},
 {id:'v_church',tab:'village',name:'Village church',desc:'A bell tower that glows at night.',price:200,st:3},
 {id:'v_clock',tab:'village',name:'Clock tower',desc:'Shows the real time on your computer.',price:180,st:3},
 {id:'v_work',tab:'village',name:"Elves' workshop",desc:'Turning gears, busy smoke and golden windows.',price:320,st:4},
 /* Trees */
 {id:'t_forest',tab:'trees',name:'Pine forest',desc:'A thick snowy forest behind the village.',price:45,st:1},
 {id:'t_s1',tab:'trees',name:'Little pine',desc:'A small snowy pine tree.',price:30,st:1},
 {id:'t_s2',tab:'trees',name:'Another pine',desc:'A second small pine tree.',price:30,st:1},
 {id:'t_big',tab:'trees',name:'Big Christmas tree',desc:'Decorate it: ornaments, star, lights and gifts.',price:110,st:1},
 /* Folk */
 {id:'c_sn1',tab:'folk',name:'Snowman Frosty',desc:'Choose his scarf and hat.',price:30,st:1},
 {id:'c_sn2',tab:'folk',name:'Snowman Bobby',desc:'A friend for Frosty.',price:45,st:1},
 {id:'c_sn3',tab:'folk',name:'Snowman Lily',desc:'The smallest snowman.',price:60,st:1},
 {id:'c_kids',tab:'folk',name:'Children with a sled',desc:'They slide down the snowy hill.',price:90,st:2},
 {id:'c_elf1',tab:'folk',name:'Elf Pip',desc:'Walks around carrying gifts.',price:70,st:2},
 {id:'c_elf2',tab:'folk',name:'Elf Tuck',desc:'Walks the other way.',price:70,st:3},
 {id:'c_choir',tab:'folk',name:'Carol singers',desc:'Three singers with music notes.',price:150,st:3},
 {id:'c_santa',tab:'folk',name:'Santa Claus',desc:'Waves at the village.',price:220,st:3},
 {id:'c_sleigh',tab:'folk',name:"Santa's sleigh",desc:'Pick its colour. Needed for take-off.',price:260,st:3},
 {id:'c_rd1',tab:'folk',name:'Reindeer Comet',desc:'First reindeer, with a glowing nose.',price:80,st:3},
 {id:'c_rd2',tab:'folk',name:'Reindeer Dasher',desc:'Second reindeer.',price:80,st:3},
 {id:'c_rd3',tab:'folk',name:'Reindeer Prancer',desc:'Third reindeer.',price:80,st:3},
 {id:'c_rd4',tab:'folk',name:'Reindeer Vixen',desc:'Fourth reindeer.',price:80,st:3},
 /* Animals */
 {id:'a_rab',tab:'animals',name:'Snow rabbit',desc:'Hops around, ears up.',price:40,st:1},
 {id:'a_fox',tab:'animals',name:'Arctic fox',desc:'Sniffs around the fence.',price:60,st:1},
 {id:'a_owl',tab:'animals',name:'Snowy owl',desc:'Sits in the big tree.',price:60,st:2},
 {id:'a_peng',tab:'animals',name:'Penguins',desc:'Two penguins sliding on the ice.',price:70,st:2},
 {id:'a_bear',tab:'animals',name:'Polar bear',desc:'A big friendly bear near the igloo.',price:130,st:3},
 /* Decor */
 {id:'d_sign',tab:'decor',name:'Welcome sign',desc:'"Merry Christmas" on a wooden post.',price:25,st:1},
 {id:'d_mail',tab:'decor',name:'Mailbox',desc:'For letters to Santa.',price:30,st:1},
 {id:'d_bench',tab:'decor',name:'Snowy bench',desc:'A place to sit and watch the snow.',price:30,st:1},
 {id:'d_fence',tab:'decor',name:'Wooden fence',desc:'With lights you can customize.',price:35,st:1},
 {id:'d_lamp',tab:'decor',name:'Street lamps',desc:'Three lamps along the path.',price:45,st:1},
 {id:'d_gifts',tab:'decor',name:'Pile of gifts',desc:'Wrapped presents with ribbons.',price:50,st:2},
 {id:'d_lights',tab:'decor',name:'String lights',desc:'Garlands across the village. Pick colour and effect.',price:80,st:1},
 {id:'d_candy',tab:'decor',name:'Candy cane border',desc:'Red and white canes along the path.',price:60,st:2},
 {id:'d_fire',tab:'decor',name:'Campfire',desc:'Crackling fire with sparks.',price:70,st:2},
 {id:'d_pond',tab:'decor',name:'Frozen pond',desc:'Shiny ice with a skater.',price:90,st:2},
 {id:'d_igloo',tab:'decor',name:'Igloo',desc:'A cosy igloo with a lit entrance.',price:110,st:3},
 /* Sky */
 {id:'s_moon',tab:'sky',name:'Full moon',desc:'A bright moon over the mountains.',price:50,st:1},
 {id:'s_snow2',tab:'sky',name:'Heavy snowfall',desc:'More snow in the sky.',price:60,st:1},
 {id:'s_snow3',tab:'sky',name:'Snowstorm',desc:'Thick snow blown by the wind.',price:100,st:2},
 {id:'s_mist',tab:'sky',name:'Ground mist',desc:'Soft mist over the snow.',price:70,st:2},
 {id:'s_fire',tab:'sky',name:'Golden fireflies',desc:'Little lights that dance in the dark.',price:90,st:2},
 {id:'s_shoot',tab:'sky',name:'Shooting stars',desc:'A star streaks across the sky from time to time.',price:120,st:2},
 {id:'s_star',tab:'sky',name:'Christmas star',desc:'A big bright star above the village.',price:180,st:3},
 {id:'s_aur',tab:'sky',name:'Northern lights',desc:'Colourful waves of light. Pick the colour.',price:250,st:3},
 {id:'s_fw',tab:'sky',name:'Fireworks',desc:'Bursts of colour above the roofs.',price:150,st:4},
 {id:'s_fly',tab:'sky',name:'Santa flies by',desc:'His sleigh crosses the sky now and then.',price:220,st:4}
];
var TABS=[['house','House'],['village','Village'],['trees','Trees'],['folk','Folk'],['animals','Animals'],['decor','Decor'],['sky','Sky'],['boost','Boosts'],['perk','Perks'],['grumbo','Grumbo'],['chest','Chests']];

/* Consumables, permanent perks, Grumbo costumes */
var BOOSTS=[
 {id:'shield',name:'Snow shield',desc:'Blocks Grumbo once, without losing a life.',price:40},
 {id:'half',name:'50/50',desc:'Removes two wrong answers.',price:25},
 {id:'freeze',name:'+10 seconds',desc:'Adds ten seconds to the current question.',price:20}
];
var PERKS=[
 {id:'time',name:'Extra time',desc:'+4 seconds on every question.',price:150},
 {id:'quick',name:'Quick fingers',desc:'The quick-answer bonus now works up to 8 seconds.',price:200},
 {id:'magnet',name:'Slow parachutes',desc:'Gifts fall more slowly.',price:120},
 {id:'lucky',name:'Lucky coins',desc:'+2 coins on every correct answer.',price:300}
];
var COSTUMES=[
 {id:'hat',name:'Santa hat',desc:'Grumbo wears a red hat.',price:40},
 {id:'scarf',name:'Striped scarf',desc:'Even a goblin gets cold.',price:50},
 {id:'bell',name:'Jingle bell',desc:'He rings when he walks.',price:50},
 {id:'antlers',name:'Reindeer antlers',desc:'He thinks he is a reindeer.',price:60}
];
var CHEST_PRICE=60;

/* Colours for lights, walls, roofs, etc. */
var LIGHT_COLS=[
 {v:'gold',l:'Gold',c:'#ffd45a'},{v:'warm',l:'Warm',c:'#ffb347'},{v:'white',l:'White',c:'#fff3d6'},{v:'red',l:'Red',c:'#ff4f4f'},
 {v:'green',l:'Green',c:'#5dff8a'},{v:'blue',l:'Blue',c:'#5aa9ff'},{v:'pink',l:'Pink',c:'#ff7ad9'},{v:'multi',l:'Multicolour',c:'#ff9a3c',multi:true},
 {v:'redgreen',l:'Red and green',c:'#ff4f4f',cost:40,unl:'lc_redgreen'},{v:'rainbow',l:'Rainbow',c:'#c79bff',cost:80,unl:'lc_rainbow',adv:12,multi:true}
];
var LIGHT_EFFS=[
 {v:'steady',l:'Steady'},{v:'twinkle',l:'Twinkling'},{v:'blink',l:'Blinking'},
 {v:'chase',l:'Chasing',cost:50,unl:'le_chase',adv:6},{v:'pulse',l:'Pulsing',cost:50,unl:'le_pulse'}
];
var WALLS=[{v:'wood',l:'Wood',c:'#8a5a34'},{v:'red',l:'Red',c:'#a8382e'},{v:'cream',l:'Cream',c:'#d8c49a'},{v:'blue',l:'Blue',c:'#4d6fa5'},{v:'green',l:'Green',c:'#4f8a5b'},{v:'gray',l:'Stone',c:'#7d8696'}];
var ROOFS=[{v:'red',l:'Red',c:'#b73a32'},{v:'green',l:'Green',c:'#3f7a4a'},{v:'blue',l:'Blue',c:'#3f5f9a'},{v:'brown',l:'Brown',c:'#6b4428'},{v:'slate',l:'Slate',c:'#4b5468'},{v:'plum',l:'Plum',c:'#7a3f72'}];
var WIN_COLS=[{v:'warm',l:'Warm orange',c:'#ffb84a'},{v:'yellow',l:'Yellow',c:'#ffe27a'},{v:'white',l:'White',c:'#fff6dc'},{v:'red',l:'Red',c:'#ff6a5e'},{v:'green',l:'Green',c:'#7dff9a'},{v:'blue',l:'Blue',c:'#7fc8ff'},{v:'pink',l:'Pink',c:'#ff8fd0'}];
var WIN_EFFS=[{v:'steady',l:'Steady'},{v:'candle',l:'Candle flicker'},{v:'tv',l:'TV glow'},{v:'blink',l:'Blinking'},{v:'off',l:'Off'}];
var SMOKE_COLS=[{v:'gray',l:'Grey',c:'#cfd6e6'},{v:'white',l:'White',c:'#ffffff'},{v:'pink',l:'Pink',c:'#ff9ed2',cost:40,unl:'sm_pink'},{v:'gold',l:'Gold',c:'#ffd45a',cost:60,unl:'sm_gold',adv:18}];
var SMOKE_SHAPES=[{v:'puff',l:'Puffs'},{v:'heart',l:'Hearts',cost:90,unl:'ss_heart'},{v:'star',l:'Stars',cost:90,unl:'ss_star'}];
var ON_OFF=[{v:'on',l:'On'},{v:'off',l:'Off'}];
var SCARFS=[{v:'red',l:'Red',c:'#d63a3a'},{v:'green',l:'Green',c:'#3f9a55'},{v:'blue',l:'Blue',c:'#4d7fd1'},{v:'yellow',l:'Yellow',c:'#ffd45a'},{v:'pink',l:'Pink',c:'#ff8fd0'},{v:'purple',l:'Purple',c:'#8e5bd6'}];
var HATS=[{v:'top',l:'Top hat'},{v:'santa',l:'Santa hat'},{v:'beanie',l:'Beanie'},{v:'none',l:'No hat'}];
var ORNS=[{v:'red',l:'Red',c:'#e04040'},{v:'gold',l:'Gold',c:'#ffd45a'},{v:'blue',l:'Blue',c:'#5aa0ff'},{v:'silver',l:'Silver',c:'#dfe8f5'},{v:'multi',l:'Multicolour',c:'#ff9a3c',multi:true}];
var TOPS=[{v:'star',l:'Star'},{v:'angel',l:'Angel'},{v:'bow',l:'Bow'}];
var AUR=[{v:'green',l:'Green',c:'#5dff9a'},{v:'blue',l:'Blue',c:'#5aa9ff'},{v:'pink',l:'Pink',c:'#ff7ad9',cost:60,unl:'au_pink'},{v:'purple',l:'Purple',c:'#a97bff',cost:60,unl:'au_purple',adv:20}];
var SLEIGH=[{v:'red',l:'Red',c:'#d63a3a'},{v:'green',l:'Green',c:'#3f9a55'},{v:'blue',l:'Blue',c:'#4d7fd1'},{v:'gold',l:'Gold',c:'#ffd45a',cost:100,unl:'sl_gold',adv:22}];
var NOSE=[{v:'red',l:'Red',c:'#ff4f4f'},{v:'gold',l:'Gold',c:'#ffd45a'},{v:'blue',l:'Blue',c:'#5aa9ff'},{v:'green',l:'Green',c:'#5dff8a'}];
var FIRE=[{v:'orange',l:'Orange',c:'#ff9a3c'},{v:'blue',l:'Blue',c:'#6aa8ff',cost:60,unl:'fc_blue',adv:9},{v:'green',l:'Green',c:'#6aff9a',cost:60,unl:'fc_green'}];
var LAMP=[{v:'warm',l:'Warm',c:'#ffd27a'},{v:'white',l:'White',c:'#fff6dc'},{v:'blue',l:'Blue',c:'#8fc8ff'},{v:'green',l:'Green',c:'#8dffa8'}];
var TIMES=[{v:'night',l:'Night'},{v:'dusk',l:'Dusk'},{v:'dawn',l:'Dawn'}];
var SPEEDS=[{v:'slow',l:'Slow'},{v:'normal',l:'Normal'},{v:'fast',l:'Fast'}];
var SNOWL=[{v:'0',l:'None'},{v:'1',l:'Light'},{v:'2',l:'Heavy',need:'s_snow2'},{v:'3',l:'Storm',need:'s_snow3'}];

/* Customization groups. need: item id that must be owned (any of the ids in the array when it is one). kind 'lights' groups get the "apply to all lights" button. */
var GROUPS=[
 {id:'house',label:'House',need:['h1'],rows:[
  ['wall','Walls',WALLS,'wood'],['roof','Roof',ROOFS,'red'],['wcol','Window light',WIN_COLS,'warm'],['weff','Window effect',WIN_EFFS,'candle'],
  ['smoke','Chimney smoke',ON_OFF,'on'],['scol','Smoke colour',SMOKE_COLS,'gray'],['sshape','Smoke shape',SMOKE_SHAPES,'puff'],
  ['rsnow','Snow on the roof',ON_OFF,'on'],['wreath','Door wreath',ON_OFF,'on']]},
 {id:'hlights',label:'Roof lights',kind:'lights',need:['h1'],rows:[
  ['hl_on','Roof lights',ON_OFF,'on'],['hl_col','Colour',LIGHT_COLS,'warm'],['hl_eff','Effect',LIGHT_EFFS,'twinkle']]},
 {id:'string',label:'String lights',kind:'lights',need:['d_lights'],rows:[
  ['sl_col','Colour',LIGHT_COLS,'multi'],['sl_eff','Effect',LIGHT_EFFS,'twinkle']]},
 {id:'fence',label:'Fence lights',kind:'lights',need:['d_fence'],rows:[
  ['fl_on','Fence lights',ON_OFF,'on'],['fl_col','Colour',LIGHT_COLS,'white'],['fl_eff','Effect',LIGHT_EFFS,'steady']]},
 {id:'tree',label:'Big Christmas tree',kind:'lights',need:['t_big'],rows:[
  ['tr_orn','Ornaments',ORNS,'red'],['tr_top','Tree top',TOPS,'star'],['tr_col','Tree lights',LIGHT_COLS,'multi'],['tr_eff','Light effect',LIGHT_EFFS,'twinkle'],['tr_gifts','Gifts under the tree',ON_OFF,'on']]},
 {id:'sn1',label:'Snowman Frosty',need:['c_sn1'],rows:[['sn1_sc','Scarf',SCARFS,'red'],['sn1_hat','Hat',HATS,'top']]},
 {id:'sn2',label:'Snowman Bobby',need:['c_sn2'],rows:[['sn2_sc','Scarf',SCARFS,'green'],['sn2_hat','Hat',HATS,'beanie']]},
 {id:'sn3',label:'Snowman Lily',need:['c_sn3'],rows:[['sn3_sc','Scarf',SCARFS,'pink'],['sn3_hat','Hat',HATS,'santa']]},
 {id:'lamp',label:'Street lamps',need:['d_lamp'],rows:[['lp_col','Light colour',LAMP,'warm']]},
 {id:'fire',label:'Campfire',need:['d_fire'],rows:[['fc_col','Flame colour',FIRE,'orange']]},
 {id:'sleigh',label:'Sleigh and reindeer',need:['c_sleigh','c_rd1','c_rd2','c_rd3','c_rd4'],rows:[['sl_color','Sleigh colour',SLEIGH,'red'],['rd_nose','Reindeer noses',NOSE,'red']]},
 {id:'sky',label:'Sky and weather',need:[],rows:[
  ['time','Time of day',TIMES,'night'],['snowl','Snowfall',SNOWL,'1'],['aur','Northern lights colour',AUR,'green'],['spd','Light speed',SPEEDS,'normal'],['twk','Twinkling stars',ON_OFF,'on']]}
];

/* Advent calendar rewards (door N opens once N days are completed). */
var ADVENT=[
 {c:30},{b:'shield'},{c:40},{c:50},{b:'half',n:2},{u:'le_chase'},{c:60},{b:'freeze',n:2},{u:'fc_blue'},{c:80},
 {chest:1},{u:'lc_rainbow'},{c:90},{b:'shield',n:2},{c:100},{chest:1},{c:110},{u:'sm_gold'},{b:'half',n:3},{u:'au_purple'},
 {c:150},{u:'sl_gold'},{c:200},{chest:1,c:300}
];
var UNL_NAMES={le_chase:'Chasing lights',fc_blue:'Blue campfire flames',lc_rainbow:'Rainbow lights',sm_gold:'Golden smoke',au_purple:'Purple northern lights',sl_gold:'Golden sleigh',
 lc_redgreen:'Red and green lights',le_pulse:'Pulsing lights',sm_pink:'Pink smoke',ss_heart:'Heart-shaped smoke',ss_star:'Star-shaped smoke',au_pink:'Pink northern lights',fc_green:'Green campfire flames'};

/* Santa's letters: one goal at a time. t: text, k: test name handled in game.js, n: threshold, r: coin reward. */
var LETTERS=[
 {t:'Answer 5 questions correctly.',k:'correct',n:5,r:30},
 {t:'Build the wooden cabin.',k:'own',n:'h1',r:30},
 {t:'Buy the Big Christmas tree.',k:'own',n:'t_big',r:40},
 {t:'Customize anything: tap an object or open Decorate.',k:'cust',n:1,r:30},
 {t:'Catch a gift that parachutes down.',k:'giftsOk',n:1,r:40},
 {t:'Get 5 correct answers in a row.',k:'maxStreak',n:5,r:50},
 {t:'Own 3 snowmen.',k:'snow3',n:3,r:50},
 {t:'Reach Stage 2: Quiet Village.',k:'stage',n:2,r:60},
 {t:'Buy the string lights.',k:'own',n:'d_lights',r:50},
 {t:'Finish 3 days.',k:'levelsCleared',n:3,r:80},
 {t:'Open a mystery chest.',k:'chests',n:1,r:60},
 {t:'Own Santa and his sleigh.',k:'santaSleigh',n:1,r:100},
 {t:'Own 3 reindeer.',k:'rd3',n:3,r:100},
 {t:'Reach Stage 4: the Elves’ Workshop.',k:'stage',n:4,r:150},
 {t:'Answer 100 questions correctly.',k:'correct',n:100,r:150},
 {t:'Own the Christmas castle.',k:'own',n:'h5',r:300},
 {t:'Reach Stage 5: Christmas Eve.',k:'stage',n:5,r:250},
 {t:'Take off on Christmas Eve! Open the Menu and press the take-off button.',k:'takeoffs',n:1,r:300}
];

window.XM_CAT={STAGES:STAGES,ITEMS:ITEMS,TABS:TABS,BOOSTS:BOOSTS,PERKS:PERKS,COSTUMES:COSTUMES,CHEST_PRICE:CHEST_PRICE,GROUPS:GROUPS,ADVENT:ADVENT,UNL_NAMES:UNL_NAMES,LETTERS:LETTERS,
 LIGHT_COLS:LIGHT_COLS,WALLS:WALLS,ROOFS:ROOFS,WIN_COLS:WIN_COLS,SMOKE_COLS:SMOKE_COLS,SCARFS:SCARFS,ORNS:ORNS,AUR:AUR,SLEIGH:SLEIGH,NOSE:NOSE,FIRE:FIRE,LAMP:LAMP};
})();

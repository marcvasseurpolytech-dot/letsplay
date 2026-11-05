/* Christmas-themed questions for Christmas Village. Same format as ../wordbridge/bank.js:
   o[0] is the correct answer (except 'e' items, which use segs/k), 'w' items are scrambled words. */
(function(){
'use strict';
var X=[];
function add(t,list){list.forEach(function(a){
  if(t==='w')X.push({t:'w',w:a[0],fr:a[1]});
  else if(t==='e')X.push({t:'e',s:a[0],segs:a[1],k:a[2],fix:a[3],why:a[4],fr:a[5],o:['A','B','C','D']});
  else X.push({t:t,s:a[0],o:a[1],fr:a[2]});
})}

add('c',[
 ["___ the snow, the Christmas market opened on time.",["Despite","Although","Because","However"],"Malgré la neige, le marché de Noël a ouvert à l'heure."],
 ["The office will be closed from December 24 to 26; ___, urgent requests can be sent to the duty manager.",["however","because","unless","whereas"],"Le bureau sera fermé du 24 au 26 décembre ; toutefois, les demandes urgentes peuvent être envoyées au responsable de permanence."],
 ["Returns will be accepted ___ the customer shows the receipt.",["provided that","despite","whereas","owing to"],"Les retours seront acceptés à condition que le client présente le reçu."],
 ["We ordered extra stock ___ demand always peaks in December.",["because","despite","in spite of","so that"],"Nous avons commandé du stock supplémentaire parce que la demande culmine toujours en décembre."],
 ["___ the parcels were delivered late, customers received a full refund.",["Because","Because of","Despite","Instead of"],"Comme les colis ont été livrés en retard, les clients ont été intégralement remboursés."],
 ["Employees may leave early on December 24 ___ they have finished their tasks.",["as long as","even though","whereas","in case"],"Les employés peuvent partir plus tôt le 24 décembre à condition d'avoir terminé leurs tâches."],
 ["Sales of winter coats rose by 20%, ___ sales of sandals fell sharply.",["whereas","because","unless","so that"],"Les ventes de manteaux d'hiver ont augmenté de 20 %, alors que celles de sandales ont fortement chuté."],
 ["Order before Friday ___ your gifts arrive before Christmas.",["so that","in spite of","whereas","unless"],"Commandez avant vendredi pour que vos cadeaux arrivent avant Noël."]
]);

add('p',[
 ["The Christmas party will take place ___ December 19.",["on","in","at","by"],"La fête de Noël aura lieu le 19 décembre."],
 ["Our offices will be closed ___ the holidays.",["over","at","by","since"],"Nos bureaux seront fermés pendant les fêtes."],
 ["All gifts must be wrapped ___ December 23 at the latest.",["by","until","since","during"],"Tous les cadeaux doivent être emballés au plus tard le 23 décembre."],
 ["The shop will stay open ___ midnight on Christmas Eve.",["until","by","since","at"],"Le magasin restera ouvert jusqu'à minuit la veille de Noël."],
 ["We have worked here ___ the beginning of November.",["since","for","from","during"],"Nous travaillons ici depuis le début du mois de novembre."],
 ["The driver is responsible ___ getting the parcels to customers on time.",["for","of","to","about"],"Le chauffeur est chargé de remettre les colis aux clients à temps."],
 ["Please send your holiday requests ___ the HR department.",["to","at","in","by"],"Veuillez envoyer vos demandes de congés au service des ressources humaines."],
 ["The company is famous ___ its handmade Christmas decorations.",["for","of","with","by"],"L'entreprise est célèbre pour ses décorations de Noël faites main."],
 ["We look forward ___ seeing you at the staff party.",["to","for","at","on"],"Nous sommes impatients de vous voir à la fête du personnel."]
]);

add('l',[
 ["Customers can ___ an order online until December 20.",["place","do","make","hold"],"Les clients peuvent passer commande en ligne jusqu'au 20 décembre."],
 ["The store will ___ a 30% discount on all decorations this weekend.",["offer","tell","hold","draw"],"Le magasin proposera une remise de 30 % sur toutes les décorations ce week-end."],
 ["We are going to ___ a table for twelve for the staff dinner.",["book","do","catch","pay"],"Nous allons réserver une table de douze pour le dîner du personnel."],
 ["December is our busiest month, the ___ season for online retailers.",["peak","summit","apex","tip"],"Décembre est notre mois le plus chargé, la haute saison pour les détaillants en ligne."],
 ["She decided to ___ a day off between Christmas and New Year.",["take","do","put","go"],"Elle a décidé de prendre un jour de congé entre Noël et le Nouvel An."],
 ["We would like to ___ our warmest season's greetings to all our clients.",["send","say","tell","speak"],"Nous souhaitons adresser nos vœux les plus chaleureux à tous nos clients."]
]);

add('f',[
 ["Thank you for your ___ during the festive season.",["generosity","generous","generously","generosities"],"Merci pour votre générosité pendant la période des fêtes."],
 ["The children were ___ excited about opening their presents.",["extremely","extreme","extremity","extremes"],"Les enfants étaient extrêmement excités à l'idée d'ouvrir leurs cadeaux."],
 ["Our ___ team works day and night to deliver every parcel.",["dedicated","dedicate","dedication","dedicating"],"Notre équipe dévouée travaille jour et nuit pour livrer chaque colis."],
 ["The ___ of the shop windows takes two full days.",["decoration","decorate","decorative","decoratively"],"La décoration des vitrines prend deux jours entiers."],
 ["Please wrap the glasses ___ so that they do not break.",["carefully","careful","care","carefulness"],"Veuillez emballer les verres avec soin pour qu'ils ne cassent pas."],
 ["Customer ___ is highest in December.",["satisfaction","satisfy","satisfied","satisfactory"],"La satisfaction des clients est à son maximum en décembre."]
]);

add('s',[
 ["We *anticipate* a record number of orders this December. Closest meaning:",["expect","fear","avoid","regret"],"Nous nous attendons à un nombre record de commandes en décembre."],
 ["The parcels were *dispatched* on Monday morning. Closest meaning:",["sent","opened","lost","repaired"],"Les colis ont été expédiés lundi matin."],
 ["Please *refrain from* using the lifts during the party. Closest meaning:",["avoid","continue","start","remember"],"Veuillez vous abstenir d'utiliser les ascenseurs pendant la fête."],
 ["The manager *commended* the team for their hard work in December. Closest meaning:",["praised","warned","replaced","ignored"],"Le directeur a félicité l'équipe pour son travail acharné en décembre."]
]);

add('x',[
 ["We need to ___ the decorations before the end of January.",["take down","take off","take up","take in"],"Nous devons retirer les décorations avant la fin du mois de janvier."],
 ["We have ___ wrapping paper, so please order some more.",["run out of","run into","run over","run down"],"Nous n'avons plus de papier cadeau, veuillez en commander davantage."],
 ["Can you ___ the lights? It is getting dark.",["switch on","switch off","switch over","switch up"],"Peux-tu allumer les lumières ? Il commence à faire nuit."],
 ["I will ___ you at the station at 6 p.m. and we will drive to the party.",["pick up","pick out","pick on","pick at"],"Je viendrai te chercher à la gare à 18 h et nous irons ensemble à la fête."],
 ["The staff meeting has been ___ until January.",["put off","put up","put out","put on"],"La réunion du personnel a été reportée à janvier."]
]);

add('v',[
 ["The reindeer ___ across the sky last night. (fly)",["flew","flied","flown","flyed"],"Les rennes ont traversé le ciel en volant la nuit dernière."],
 ["By midnight, Santa had already ___ hundreds of presents. (give)",["given","gave","gived","giving"],"À minuit, le Père Noël avait déjà distribué des centaines de cadeaux."],
 ["The snow had ___ all night, and the roads were white in the morning. (fall)",["fallen","fell","falled","felt"],"La neige était tombée toute la nuit et les routes étaient blanches le matin."],
 ["Last December, our team ___ over 10,000 parcels. (send)",["sent","sended","sendt","send"],"En décembre dernier, notre équipe a expédié plus de 10 000 colis."],
 ["She has ___ a beautiful card to each of our clients. (write)",["written","wrote","writed","wrotten"],"Elle a écrit une belle carte à chacun de nos clients."],
 ["The children ___ carols around the tree last night. (sing)",["sang","sung","singed","sing"],"Les enfants ont chanté des chants de Noël autour du sapin hier soir."],
 ["I have never ___ such a huge Christmas tree before. (see)",["seen","saw","seed","sawn"],"Je n'ai jamais vu un sapin de Noël aussi grand."],
 ["The thief ___ three parcels from the doorstep last night. (steal)",["stole","stolen","stealed","steal"],"Le voleur a dérobé trois colis sur le pas de la porte la nuit dernière."]
]);

add('t',[
 ["Nous sommes impatients de vous voir à la fête. => We look ___ to seeing you at the party.",["forward","ahead","up","over"],"Nous sommes impatients de vous voir à la fête."],
 ["Les ventes ont fortement augmenté en décembre. => Sales ___ sharply in December.",["rose","raised","arose","risen"],"Les ventes ont fortement augmenté en décembre."],
 ["Il reste très peu de cadeaux en stock. => There are very ___ gifts left in stock.",["few","little","less","a little"],"Il reste très peu de cadeaux en stock."],
 ["Notre équipe a travaillé tard hier soir. => Our team worked late ___ night.",["last","the last","yesterday","past"],"Notre équipe a travaillé tard hier soir."]
]);

add('w',[
 ["reindeer","renne"],["chimney","cheminée (conduit)"],["sleigh","traîneau"],["stocking","chaussette de Noël"],["snowflake","flocon de neige"],
 ["garland","guirlande"],["mistletoe","gui"],["gingerbread","pain d'épices"],["fireplace","cheminée (foyer)"],["wreath","couronne de Noël"]
]);

add('e',[
 ["Every employee have received a small gift for Christmas.",["Every employee","have received","a small gift","for Christmas."],1,"has received","'Every employee' is singular, so the verb must be 'has received'.","Chaque employé a reçu un petit cadeau pour Noël."],
 ["The shop was crowded because of the people who was buying presents.",["The shop was crowded","because of","the people who","was buying presents."],3,"were buying presents.","'People' is plural, so the verb must be 'were'.","Le magasin était bondé à cause des gens qui achetaient des cadeaux."],
 ["We have been decorating the office since three days.",["We have been","decorating the office","since","three days."],2,"for","'For' goes with a duration (three days); 'since' goes with a starting point.","Nous décorons le bureau depuis trois jours."],
 ["If the snow will continue, the delivery trucks will be late.",["If the snow","will continue,","the delivery trucks","will be late."],1,"continues,","After 'if' in a first conditional, use the present simple, not 'will'.","Si la neige continue, les camions de livraison seront en retard."],
 ["Despite of the strike, most parcels arrived before Christmas.",["Despite of","the strike,","most parcels arrived","before Christmas."],0,"Despite","'Despite' is never followed by 'of' (compare 'in spite of').","Malgré la grève, la plupart des colis sont arrivés avant Noël."],
 ["The manager suggested to close the shop earlier on Christmas Eve.",["The manager suggested","to close","the shop earlier","on Christmas Eve."],1,"closing","'Suggest' is followed by a gerund (or by 'that + subject + verb'), not by 'to + infinitive'.","Le directeur a suggéré de fermer le magasin plus tôt la veille de Noël."],
 ["There are much more customers in December than in any other month.",["There are","much more customers","in December","than in any other month."],1,"many more customers","'Customers' is countable, so use 'many', not 'much'.","Il y a beaucoup plus de clients en décembre qu'en n'importe quel autre mois."],
 ["The gift which you ordered it has finally arrived.",["The gift which","you ordered it","has finally","arrived."],1,"you ordered","'Which' already stands for the object, so 'it' must not be repeated.","Le cadeau que vous avez commandé est enfin arrivé."],
 ["The decorations were hang by the staff on Monday.",["The decorations","were hang","by the staff","on Monday."],1,"were hung","The past participle of 'hang' (an object) is 'hung', not 'hang'.","Les décorations ont été accrochées par le personnel lundi."]
]);

window.XM_BANK={ALL:X};
})();

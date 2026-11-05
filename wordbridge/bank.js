/* Question bank shared with Arrow Escape (same format: o[0] is the correct answer, 'e' items use segs/k). */
(function(){
'use strict';
var CONN = [
 {s:"___ the heavy rain, the outdoor event went ahead as planned.", o:["Despite","Although","Because","Therefore"], fr:"Malgré la forte pluie, l'événement en plein air a eu lieu comme prévu."},
 {s:"The shipment was delayed; ___, we had to reschedule the installation.", o:["Therefore","However","Whereas","Unless"], fr:"La livraison a été retardée ; nous avons donc dû reprogrammer l'installation."},
 {s:"___ the new software is expensive, it will save us time in the long run.", o:["Although","Despite","Because of","Moreover"], fr:"Bien que le nouveau logiciel soit cher, il nous fera gagner du temps à long terme."},
 {s:"We will not start the project ___ we receive written approval.", o:["unless","although","whereas","otherwise"], fr:"Nous ne commencerons pas le projet à moins de recevoir une approbation écrite."},
 {s:"Sales increased in Asia, ___ they fell in Europe.", o:["whereas","because","so that","provided"], fr:"Les ventes ont augmenté en Asie, alors qu'elles ont baissé en Europe."},
 {s:"Employees must wear helmets on site; ___, they may be refused access.", o:["otherwise","for instance","meanwhile","afterwards"], fr:"Les employés doivent porter un casque sur le chantier ; sinon, l'accès peut leur être refusé."},
 {s:"___ you submit the form before noon, your request will be processed today.", o:["Provided that","Despite","Owing to","Instead of"], fr:"À condition de remettre le formulaire avant midi, votre demande sera traitée aujourd'hui."},
 {s:"The new printer is not only faster ___ also cheaper to run.", o:["but","and","nor","so"], fr:"La nouvelle imprimante est non seulement plus rapide, mais aussi moins chère à l'usage."},
 {s:"Neither the director ___ his deputy was available for comment.", o:["nor","or","and","but"], fr:"Ni le directeur ni son adjoint n'étaient disponibles pour faire un commentaire."},
 {s:"Take a spare battery ___ the first one runs out during the trip.", o:["in case","unless","although","whereas"], fr:"Prenez une batterie de rechange au cas où la première se déchargerait pendant le voyage."},
 {s:"___ the manager was on leave, the assistant signed the contract.", o:["Since","During","Because of","Despite"], fr:"Comme le responsable était en congé, l'assistant a signé le contrat."},
 {s:"The meeting was long. ___, it was very productive.", o:["Nevertheless","Therefore","Because","Unless"], fr:"La réunion a été longue. Néanmoins, elle a été très productive."},
 {s:"I will call you ___ I arrive at the airport.", o:["as soon as","despite","however","so that"], fr:"Je vous appellerai dès que j'arriverai à l'aéroport."},
 {s:"The company reduced its prices ___ attract more customers.", o:["in order to","so that","because","as a result"], fr:"L'entreprise a baissé ses prix afin d'attirer davantage de clients."},
 {s:"The company reduced its prices ___ more customers would buy its products.", o:["so that","in order to","due to","in spite of"], fr:"L'entreprise a baissé ses prix pour que davantage de clients achètent ses produits."},
 {s:"___ his lack of experience, he got the job.", o:["In spite of","Because of","Owing to","As a result of"], fr:"Malgré son manque d'expérience, il a obtenu le poste."},
 {s:"The flight was cancelled ___ the strike.", o:["due to","although","even though","whereas"], fr:"Le vol a été annulé à cause de la grève."},
 {s:"Prices have risen sharply; ___, demand remains strong.", o:["nonetheless","consequently","for example","likewise"], fr:"Les prix ont fortement augmenté ; néanmoins, la demande reste forte."},
 {s:"We offer free delivery. ___, customers can return any item within 30 days.", o:["In addition","Otherwise","Unless","Whereas"], fr:"Nous offrons la livraison gratuite. De plus, les clients peuvent retourner tout article sous 30 jours."},
 {s:"The server crashed ___ we were saving the file.", o:["while","during","despite","therefore"], fr:"Le serveur a planté pendant que nous enregistrions le fichier."},
 {s:"The server crashed ___ the update.", o:["during","while","although","because"], fr:"Le serveur a planté pendant la mise à jour."},
 {s:"___ the budget is limited, we must choose our suppliers carefully.", o:["Given that","Despite","Instead of","In addition to"], fr:"Étant donné que le budget est limité, nous devons choisir nos fournisseurs avec soin."},
 {s:"He is highly qualified; ___, he has ten years of experience.", o:["moreover","otherwise","whereas","unless"], fr:"Il est très qualifié ; de plus, il a dix ans d'expérience."},
 {s:"The software is easy to use, ___ it is not cheap.", o:["yet","so","because","therefore"], fr:"Le logiciel est facile à utiliser, mais il n'est pas bon marché."},
 {s:"Employees may work from home ___ they attend the weekly meeting.", o:["as long as","whereas","in spite of","until"], fr:"Les employés peuvent télétravailler tant qu'ils assistent à la réunion hebdomadaire."},
 {s:"Both the sales team ___ the marketing team will attend the training.", o:["and","or","nor","but"], fr:"L'équipe commerciale et l'équipe marketing assisteront toutes deux à la formation."},
 {s:"She did not answer the email, ___ did she call us back.", o:["nor","or","and","yet"], fr:"Elle n'a pas répondu à l'e-mail et ne nous a pas rappelés non plus."},
 {s:"The room was so noisy ___ nobody could concentrate.", o:["that","which","than","as"], fr:"La salle était si bruyante que personne ne pouvait se concentrer."},
 {s:"She worked very hard; ___, she failed the exam.", o:["however","therefore","for instance","in case"], fr:"Elle a travaillé très dur ; pourtant, elle a échoué à l'examen."},
 {s:"We upgraded the system ___ it was outdated.", o:["because","because of","despite","in spite of"], fr:"Nous avons mis à niveau le système parce qu'il était obsolète."},
 {s:"We have not decided ___ to extend the contract or to end it.", o:["whether","while","unless","so"], fr:"Nous n'avons pas décidé s'il fallait prolonger le contrat ou y mettre fin."},
 {s:"He will be promoted ___ he reaches his sales target.", o:["provided that","unless","whereas","despite"], fr:"Il sera promu à condition d'atteindre son objectif de ventes."},
 {s:"The company is expanding abroad; ___, it is hiring more staff at home.", o:["at the same time","in case","unless","even if"], fr:"L'entreprise se développe à l'étranger ; en même temps, elle recrute davantage de personnel dans le pays."},
 {s:"___ the high interest rates, few companies are borrowing.", o:["Because of","Because","Although","Even though"], fr:"En raison des taux d'intérêt élevés, peu d'entreprises empruntent."},
 {s:"Check the figures twice ___ sending the report.", o:["before","although","unless","so that"], fr:"Vérifiez les chiffres deux fois avant d'envoyer le rapport."},
 {s:"Not only ___ the offer cheaper, but it also includes free support.", o:["is","does","has","do"], fr:"Non seulement l'offre est moins chère, mais elle inclut aussi un support gratuit."},
 {s:"___ you have any questions, please contact the helpdesk.", o:["Should","While","Despite","Whereas"], fr:"Si vous avez des questions, veuillez contacter l'assistance."},
 {s:"I will sign the contract ___ the legal team has reviewed it.", o:["once","although","whereas","despite"], fr:"Je signerai le contrat une fois que le service juridique l'aura examiné."},
 {s:"It was ___ a difficult task that nobody volunteered.", o:["such","so","very","too"], fr:"C'était une tâche si difficile que personne ne s'est porté volontaire."}
];
/* La bonne réponse est toujours o[0] ; l'ordre est mélangé à l'affichage. */

var VERBS = [
 {s:"Our company ___ a new factory in Lille in 2019. (build)", o:["built","builded","builten","building"], fr:"Notre entreprise a construit une nouvelle usine à Lille en 2019."},
 {s:"The manager has ___ all the safety instructions. (forget)", o:["forgotten","forgot","forgetted","forgoten"], fr:"Le responsable a oublié toutes les consignes de sécurité."},
 {s:"Yesterday she ___ the whole report in one hour. (write)", o:["wrote","written","writed","writen"], fr:"Hier, elle a rédigé tout le rapport en une heure."},
 {s:"The new policy has ___ into effect. (come)", o:["come","came","comed","coming"], fr:"La nouvelle politique est entrée en vigueur."},
 {s:"Prices ___ sharply last quarter. (fall)", o:["fell","fallen","falled","felt"], fr:"Les prix ont fortement baissé le trimestre dernier."},
 {s:"The client has already ___ the invoice. (pay)", o:["paid","payed","pay","pays"], fr:"Le client a déjà réglé la facture."},
 {s:"The CEO ___ the shareholders about the merger last Monday. (tell)", o:["told","telled","tolden","tell"], fr:"Le PDG a informé les actionnaires de la fusion lundi dernier."},
 {s:"The pipe has ___ because of the frost. (burst)", o:["burst","bursted","bursten","bursts"], fr:"Le tuyau a éclaté à cause du gel."},
 {s:"They ___ the faulty equipment back to the supplier yesterday. (send)", o:["sent","sended","senden","send"], fr:"Ils ont renvoyé l'équipement défectueux au fournisseur hier."},
 {s:"Several employees have ___ the company this year. (leave)", o:["left","leaved","leaven","leaving"], fr:"Plusieurs employés ont quitté l'entreprise cette année."},
 {s:"Confidential data was ___ from the server last night. (steal)", o:["stolen","stole","stoled","stealed"], fr:"Des données confidentielles ont été volées sur le serveur la nuit dernière."},
 {s:"The temperature has ___ by five degrees since noon. (rise)", o:["risen","rose","raised","rised"], fr:"La température a augmenté de cinq degrés depuis midi."},
 {s:"The CEO ___ a speech at the conference last year. (give)", o:["gave","given","gived","gaven"], fr:"Le PDG a prononcé un discours à la conférence l'année dernière."},
 {s:"We have ___ the same supplier since 2015. (keep)", o:["kept","keeped","keep","keeping"], fr:"Nous avons gardé le même fournisseur depuis 2015."},
 {s:"The pilot ___ the plane to Madrid yesterday. (fly)", o:["flew","flown","flied","flyed"], fr:"Le pilote a conduit l'avion à Madrid hier."},
 {s:"The firm ___ 2,000 units last month. (sell)", o:["sold","selled","soled","sell"], fr:"L'entreprise a vendu 2 000 unités le mois dernier."},
 {s:"We have ___ a lot of money on advertising this year. (spend)", o:["spent","spended","spenden","spend"], fr:"Nous avons dépensé beaucoup d'argent en publicité cette année."},
 {s:"Mr Dupont ___ his job after the merger. (lose)", o:["lost","losed","lossed","lose"], fr:"M. Dupont a perdu son emploi après la fusion."},
 {s:"The staff ___ the training session at nine o'clock. (begin)", o:["began","begun","beginned","begin"], fr:"Le personnel a commencé la séance de formation à neuf heures."},
 {s:"The meeting has already ___. (begin)", o:["begun","began","beginned","begin"], fr:"La réunion a déjà commencé."},
 {s:"The engineer ___ the problem immediately. (see)", o:["saw","seen","seed","sawn"], fr:"L'ingénieur a vu le problème immédiatement."},
 {s:"Raw material prices have ___ steadily since January. (grow)", o:["grown","grew","growed","growen"], fr:"Le prix des matières premières a augmenté régulièrement depuis janvier."},
 {s:"The team has ___ every match this season. (win)", o:["won","win","winned","wan"], fr:"L'équipe a gagné tous les matchs cette saison."},
 {s:"She has ___ her laptop at the airport. (lose)", o:["lost","lose","losed","loosed"], fr:"Elle a perdu son ordinateur portable à l'aéroport."},
 {s:"The trainer ___ us how to use the software last week. (teach)", o:["taught","teached","taughten","teach"], fr:"Le formateur nous a appris à utiliser le logiciel la semaine dernière."},
 {s:"The manager has ___ a new assistant. (choose)", o:["chosen","chose","choosed","choosen"], fr:"Le responsable a choisi un nouvel assistant."},
 {s:"The window was ___ during the storm. (break)", o:["broken","broke","breaked","braked"], fr:"La fenêtre a été brisée pendant la tempête."},
 {s:"He ___ the door and left the room. (shut)", o:["shut","shutted","shutten","shuts"], fr:"Il a fermé la porte et a quitté la pièce."},
 {s:"The driver ___ too fast and was fined. (drive)", o:["drove","driven","drived","drave"], fr:"Le conducteur roulait trop vite et a reçu une amende."},
 {s:"The company ___ its costs by half last year. (cut)", o:["cut","cutted","cutten","cuts"], fr:"L'entreprise a réduit ses coûts de moitié l'année dernière."},
 {s:"Our sales have ___ by 10% since June. (fall)", o:["fallen","fell","falled","felt"], fr:"Nos ventes ont baissé de 10 % depuis juin."},
 {s:"The conference ___ place in Lyon last year. (take)", o:["took","taken","taked","tooken"], fr:"La conférence a eu lieu à Lyon l'année dernière."},
 {s:"The access codes have been ___ to the technicians. (give)", o:["given","gave","gived","gaven"], fr:"Les codes d'accès ont été donnés aux techniciens."},
 {s:"The inspector ___ a defect in the cable. (find)", o:["found","finded","fund","founded"], fr:"L'inspecteur a trouvé un défaut dans le câble."},
 {s:"We have ___ all our documents in the cloud. (put)", o:["put","putted","putten","putting"], fr:"Nous avons mis tous nos documents dans le cloud."},
 {s:"The engineer ___ the plans on a large sheet of paper. (draw)", o:["drew","drawn","drawed","drawen"], fr:"L'ingénieur a dessiné les plans sur une grande feuille de papier."},
 {s:"She has ___ a letter of complaint. (write)", o:["written","wrote","writed","writen"], fr:"Elle a écrit une lettre de réclamation."},
 {s:"The new CEO ___ the company through a difficult period. (lead)", o:["led","leaded","lead","leaden"], fr:"Le nouveau PDG a dirigé l'entreprise durant une période difficile."},
 {s:"The two directors ___ at a trade fair in Lyon. (meet)", o:["met","meeted","meet","meten"], fr:"Les deux directeurs se sont rencontrés lors d'un salon professionnel à Lyon."},
 {s:"I have never ___ such a large crowd at a conference. (see)", o:["seen","saw","seed","sawn"], fr:"Je n'ai jamais vu une foule aussi nombreuse lors d'une conférence."},
 {s:"We ___ a long discussion before reaching an agreement. (hold)", o:["held","holded","holden","hold"], fr:"Nous avons tenu une longue discussion avant de parvenir à un accord."},
 {s:"The board has ___ a final decision. (make)", o:["made","maked","make","makes"], fr:"Le conseil d'administration a pris une décision finale."}
];
CONN.forEach(function(q){q.t='c'}); VERBS.forEach(function(q){q.t='v'});

var WORDS = [
 ["invoice","facture"],["deadline","date limite"],["supplier","fournisseur"],["warranty","garantie"],
 ["schedule","emploi du temps, planning"],["refund","remboursement"],["colleague","collègue"],
 ["shipment","expédition (de marchandises)"],["negotiate","négocier"],["headquarters","siège social"],
 ["recruit","recruter"],["overdue","en retard (paiement)"],["turnover","chiffre d'affaires"],
 ["premises","locaux"],["workforce","main-d'œuvre"],["shareholder","actionnaire"],["agenda","ordre du jour"],
 ["delegate","déléguer"],["contractor","entrepreneur, sous-traitant"],["maintenance","entretien, maintenance"],
 ["efficiency","efficacité"],["inventory","inventaire, stock"],["reliable","fiable"],["outcome","résultat, issue"],
 ["benefit","avantage"],["branch","succursale, agence"],["payroll","paie, masse salariale"],["quotation","devis"],
 ["compliance","conformité"],["landlord","propriétaire (bailleur)"],["applicant","candidat (à un poste)"],
 ["supervisor","responsable, superviseur"],["attachment","pièce jointe"],["handout","document distribué"],
 ["tenant","locataire"],["resignation","démission"]
].map(function(a){return {t:'w',w:a[0],fr:a[1]}});

/* Questions plus difficiles pour le bonus BOOM (même format ; o[0] = bonne réponse). */
var HARD = [
 {t:'c',s:"___ the fact that the project was over budget, the board approved the extension.", o:["Notwithstanding","Whereas","Provided","Unless"], fr:"Malgré le fait que le projet ait dépassé son budget, le conseil a approuvé la prolongation."},
 {t:'c',s:"The offer is attractive, ___ somewhat risky.", o:["albeit","whereas","unless","lest"], fr:"L'offre est attrayante, bien que quelque peu risquée."},
 {t:'c',s:"Employees must lock their computers ___ unauthorized staff gain access to the data.", o:["lest","unless","whereas","albeit"], fr:"Les employés doivent verrouiller leur ordinateur de peur que du personnel non autorisé n'accède aux données."},
 {t:'c',s:"___ the contract is signed by Friday, the supplier will cancel the order.", o:["Unless","Providing","Whereas","In case of"], fr:"À moins que le contrat ne soit signé d'ici vendredi, le fournisseur annulera la commande."},
 {t:'c',s:"The warranty is valid ___ the product is used in accordance with the instructions.", o:["only if","even though","as if","whereas"], fr:"La garantie n'est valable que si le produit est utilisé conformément aux instructions."},
 {t:'c',s:"No sooner had the CEO left the room ___ the board began to argue.", o:["than","when","then","while"], fr:"À peine le PDG avait-il quitté la pièce que le conseil s'est mis à se disputer."},
 {t:'c',s:"Hardly had the meeting started ___ the fire alarm went off.", o:["when","than","while","until"], fr:"La réunion avait à peine commencé que l'alarme incendie s'est déclenchée."},
 {t:'c',s:"___ of the outcome, the team will receive a bonus.", o:["Regardless","Despite","Whereas","Provided"], fr:"Quel que soit le résultat, l'équipe recevra une prime."},
 {t:'c',s:"The company opted for expansion ___ consolidation.", o:["rather than","owing to","whereas","provided"], fr:"L'entreprise a opté pour l'expansion plutôt que pour la consolidation."},
 {t:'c',s:"The software will be updated ___ the end of the month.", o:["prior to","owing to","in view of","as per"], fr:"Le logiciel sera mis à jour avant la fin du mois."},
 {t:'c',s:"The plan is acceptable ___ it stays within budget.", o:["insofar as","even though","let alone","owing to"], fr:"Le plan est acceptable dans la mesure où il reste dans les limites du budget."},
 {t:'c',s:"You may leave early ___ you have finished all your tasks.", o:["so long as","in case","whereas","lest"], fr:"Vous pouvez partir plus tôt tant que vous avez terminé toutes vos tâches."},
 {t:'c',s:"The merger, ___ was announced yesterday, will create 500 jobs.", o:["which","what","whose","who"], fr:"La fusion, qui a été annoncée hier, créera 500 emplois."},
 {t:'c',s:"Sales fell sharply; ___, the company remained profitable.", o:["even so","as a result","for example","accordingly"], fr:"Les ventes ont fortement chuté ; malgré tout, l'entreprise est restée rentable."},
 {t:'c',s:"___ he was offered a higher salary, he refused to leave.", o:["Even though","Provided that","Unless","In case"], fr:"Bien qu'on lui ait proposé un salaire plus élevé, il a refusé de partir."},
 {t:'c',s:"She is the only candidate ___ experience matches the job description.", o:["whose","who","which","whom"], fr:"C'est la seule candidate dont l'expérience correspond à la description du poste."},
 {t:'c',s:"Not until the results were published ___ the board realize the scale of the loss.", o:["did","had","was","has"], fr:"Ce n'est qu'après la publication des résultats que le conseil a pris conscience de l'ampleur de la perte."},
 {t:'v',s:"The company has ___ a major restructuring this year. (undergo)", o:["undergone","underwent","undergoed","undergo"], fr:"L'entreprise a subi une restructuration majeure cette année."},
 {t:'v',s:"The minister ___ the proposal and left the meeting. (withdraw)", o:["withdrew","withdrawn","withdrawed","withdraw"], fr:"Le ministre a retiré la proposition et a quitté la réunion."},
 {t:'v',s:"She has ___ the new employee for a client. (mistake)", o:["mistaken","mistook","mistaked","mistake"], fr:"Elle a pris le nouvel employé pour un client."},
 {t:'v',s:"The firm ___ to reduce its costs by 15%. (undertake)", o:["undertook","undertaken","undertaked","undertake"], fr:"L'entreprise s'est engagée à réduire ses coûts de 15 %."},
 {t:'v',s:"The manager has ___ the bonus until the audit is complete. (withhold)", o:["withheld","withhold","withholded","withhelt"], fr:"Le responsable a retenu la prime jusqu'à la fin de l'audit."},
 {t:'v',s:"Smoking is ___ on all company premises. (forbid)", o:["forbidden","forbade","forbidded","forbid"], fr:"Il est interdit de fumer dans tous les locaux de l'entreprise."},
 {t:'v',s:"The new law has ___ the old regulation. (override)", o:["overridden","overrode","overrided","overriden"], fr:"La nouvelle loi a annulé l'ancienne réglementation."},
 {t:'v',s:"Nobody had ___ the crisis. (foresee)", o:["foreseen","foresaw","foreseed","foreseeing"], fr:"Personne n'avait prévu la crise."},
 {t:'v',s:"The workers ___ the cables around the pole. (wind)", o:["wound","winded","wounded","wind"], fr:"Les ouvriers ont enroulé les câbles autour du poteau."},
 {t:'v',s:"The two companies are ___ by a ten-year contract. (bind)", o:["bound","binded","bind","bounded"], fr:"Les deux entreprises sont liées par un contrat de dix ans."},
 {t:'v',s:"The team ___ every obstacle and finished on time. (overcome)", o:["overcame","overcome","overcomed","overcoming"], fr:"L'équipe a surmonté tous les obstacles et a terminé dans les temps."},
 {t:'v',s:"The error was ___ before the report was published. (undo)", o:["undone","undid","undoed","undo"], fr:"L'erreur a été annulée avant la publication du rapport."},
 {t:'v',s:"The article has been ___ twice by the editor. (rewrite)", o:["rewritten","rewrote","rewrited","rewrit"], fr:"L'article a été réécrit deux fois par le rédacteur."},
 {t:'v',s:"The scandal has ___ investors' confidence. (shake)", o:["shaken","shook","shaked","shaking"], fr:"Le scandale a ébranlé la confiance des investisseurs."},
 {t:'v',s:"The machine ___ to a halt at noon. (grind)", o:["ground","grinded","grounded","grind"], fr:"La machine s'est arrêtée net à midi."}
].concat([
 ["subcontractor","sous-traitant"],["reimbursement","remboursement (de frais)"],["procurement","approvisionnement, achats"],
 ["liability","responsabilité (juridique)"],["stakeholder","partie prenante"],["feasibility","faisabilité"],
 ["manufacturer","fabricant"],["bankruptcy","faillite"],["redundancy","licenciement économique"]
].map(function(a){return {t:'w',w:a[0],fr:a[1]}}));

function mk(t,arr){return arr.map(function(a){return {t:t,s:a[0],o:a[1],fr:a[2]}})}

/* f : word families */
var FAM = mk('f',[
 ["The new manager spoke ___ about the merger.",["confidently","confident","confidence","confide"],"Le nouveau directeur a parlé avec assurance de la fusion."],
 ["Improving energy ___ is our main goal.",["efficiency","efficient","efficiently","effect"],"Améliorer l'efficacité énergétique est notre objectif principal."],
 ["Please submit your ___ before the deadline.",["application","apply","applicant","applying"],"Veuillez soumettre votre candidature avant la date limite."],
 ["The ___ of the new software will take two weeks.",["installation","install","installed","installer"],"L'installation du nouveau logiciel prendra deux semaines."],
 ["She is a very ___ employee who never misses a deadline.",["reliable","rely","reliably","reliability"],"C'est une employée très fiable qui ne manque jamais une échéance."],
 ["The report was ___ written and easy to follow.",["clearly","clear","clarity","clarify"],"Le rapport était clairement rédigé et facile à suivre."],
 ["The company is ___ for the safety of its workers.",["responsible","response","responsibly","responsibility"],"L'entreprise est responsable de la sécurité de ses employés."],
 ["His ___ to the team was recognised by the board.",["contribution","contribute","contributory","contributor"],"Sa contribution à l'équipe a été reconnue par le conseil d'administration."],
 ["The ___ of the product was delayed by two weeks.",["delivery","deliver","deliverer","delivered"],"La livraison du produit a été retardée de deux semaines."],
 ["We need a more ___ way to process invoices.",["efficient","efficiency","efficiently","effect"],"Nous avons besoin d'une façon plus efficace de traiter les factures."],
 ["The firm offers ___ priced products.",["competitively","competitive","competition","competitor"],"L'entreprise propose des produits à des prix compétitifs."],
 ["Safety is our top ___.",["priority","prioritize","prior","prioritized"],"La sécurité est notre priorité absolue."],
 ["The ___ was announced at the press conference.",["decision","decide","decisive","decisively"],"La décision a été annoncée lors de la conférence de presse."],
 ["Employees are ___ to wear a badge at all times.",["required","require","requirement","requiring"],"Les employés doivent porter un badge en permanence."],
 ["The ___ of the building took three years.",["construction","construct","constructive","constructed"],"La construction du bâtiment a pris trois ans."],
 ["He answered all the questions ___.",["accurately","accurate","accuracy","accuse"],"Il a répondu à toutes les questions avec précision."],
 ["The new law will have a ___ impact on small businesses.",["significant","significance","significantly","signify"],"La nouvelle loi aura un impact significatif sur les petites entreprises."],
 ["Sales have increased ___ over the past year.",["dramatically","dramatic","drama","dramatize"],"Les ventes ont augmenté de façon spectaculaire au cours de l'année écoulée."],
 ["Mr Lee was ___ to the position of director.",["promoted","promotion","promote","promotional"],"M. Lee a été promu au poste de directeur."],
 ["The hotel offers ___ service to all guests.",["excellent","excellence","excellently","excel"],"L'hôtel offre un excellent service à tous ses clients."],
 ["Please check the ___ of the information before publishing it.",["accuracy","accurate","accurately","accuse"],"Veuillez vérifier l'exactitude de l'information avant de la publier."],
 ["She was ___ surprised by the result.",["genuinely","genuine","genuineness","genus"],"Elle a été sincèrement surprise par le résultat."],
 ["Increased ___ is the key to our success.",["productivity","productive","productively","producer"],"L'augmentation de la productivité est la clé de notre réussite."],
 ["The board has ___ the proposal.",["approved","approval","approve","approving"],"Le conseil d'administration a approuvé la proposition."]
]);

/* p : prepositions et paires */
var PREP = mk('p',[
 ["The report must be submitted ___ Friday at the latest.",["by","until","during","since"],"Le rapport doit être remis au plus tard vendredi."],
 ["The shop stays open ___ 9 pm.",["until","by","during","since"],"Le magasin reste ouvert jusqu'à 21 h."],
 ["The system crashed ___ the update.",["during","for","while","since"],"Le système a planté pendant la mise à jour."],
 ["We have worked with this supplier ___ five years.",["for","since","during","ago"],"Nous travaillons avec ce fournisseur depuis cinq ans."],
 ["We have worked with this supplier ___ 2018.",["since","for","during","from"],"Nous travaillons avec ce fournisseur depuis 2018."],
 ["The decision depends ___ the budget.",["on","of","from","to"],"La décision dépend du budget."],
 ["He is responsible ___ the delay.",["for","of","about","with"],"Il est responsable du retard."],
 ["We are looking forward ___ meeting you next week.",["to","for","at","about"],"Nous avons hâte de vous rencontrer la semaine prochaine."],
 ["The manager is in charge ___ the new project.",["of","for","on","about"],"Le responsable est chargé du nouveau projet."],
 ["He apologised ___ the delay.",["for","of","with","at"],"Il s'est excusé du retard."],
 ["The company specialises ___ renewable energy.",["in","on","at","of"],"L'entreprise est spécialisée dans les énergies renouvelables."],
 ["Please reply ___ this email as soon as possible.",["to","at","for","on"],"Merci de répondre à cet e-mail dès que possible."],
 ["The conference takes place ___ 14 March.",["on","in","at","by"],"La conférence a lieu le 14 mars."],
 ["The meeting starts ___ 9 a.m.",["at","on","in","by"],"La réunion commence à 9 h."],
 ["Prices will rise ___ 5% next year.",["by","of","from","on"],"Les prix augmenteront de 5 % l'an prochain."],
 ["She has been ___ holiday since Monday.",["on","in","at","for"],"Elle est en vacances depuis lundi."],
 ["We are interested ___ your proposal.",["in","on","by","for"],"Votre proposition nous intéresse."],
 ["He is good ___ negotiating with clients.",["at","in","on","for"],"Il est doué pour négocier avec les clients."],
 ["The company is famous ___ its customer service.",["for","of","with","about"],"L'entreprise est célèbre pour son service client."],
 ["I would like to apply ___ the position of sales manager.",["for","to","at","on"],"Je souhaite postuler au poste de responsable des ventes."],
 ["The delivery will arrive ___ three days.",["in","at","during","since"],"La livraison arrivera dans trois jours."],
 ["We will finish the work ___ three days.",["within","since","during","by"],"Nous terminerons le travail en moins de trois jours."],
 ["The new policy is similar ___ the old one.",["to","with","as","than"],"La nouvelle politique est semblable à l'ancienne."],
 ["There was a shortage ___ skilled workers.",["of","in","for","on"],"Il y avait une pénurie de main-d'œuvre qualifiée."],
 ["Compared ___ last year, sales have doubled.",["to","than","as","from"],"Par rapport à l'année dernière, les ventes ont doublé."]
]);

/* l : collocations */
var COLL = mk('l',[
 ["We must ___ the deadline, whatever happens.",["meet","hold","do","take"],"Nous devons respecter la date limite, quoi qu'il arrive."],
 ["The CEO will ___ a meeting at 10 a.m.",["chair","do","make","put"],"Le PDG présidera une réunion à 10 h."],
 ["Could you ___ an order for 500 units?",["place","do","hold","have"],"Pourriez-vous passer une commande de 500 unités ?"],
 ["The company decided to ___ a new product next spring.",["launch","throw","pull","hold"],"L'entreprise a décidé de lancer un nouveau produit au printemps prochain."],
 ["Please ___ a decision by the end of the week.",["make","do","have","go"],"Merci de prendre une décision d'ici la fin de la semaine."],
 ["We need to ___ a profit this quarter.",["make","do","win","gain"],"Nous devons réaliser un bénéfice ce trimestre."],
 ["He was asked to ___ a presentation to the board.",["give","tell","say","put"],"On lui a demandé de faire une présentation devant le conseil."],
 ["The firm had to ___ bankruptcy last year.",["file for","make","do","run"],"L'entreprise a dû déposer le bilan l'an dernier."],
 ["We should ___ the risks before signing.",["weigh","count","cast","hold"],"Nous devrions peser les risques avant de signer."],
 ["The company has ___ a loan from the bank.",["taken out","taken up","taken in","taken off"],"L'entreprise a contracté un prêt auprès de la banque."],
 ["Can you ___ me a favour?",["do","make","give","take"],"Pouvez-vous me rendre un service ?"],
 ["The new manager wants to ___ changes to the schedule.",["make","do","put","hold"],"Le nouveau responsable veut apporter des modifications au planning."],
 ["Let me ___ you an example.",["give","tell","say","speak"],"Laissez-moi vous donner un exemple."],
 ["The two companies ___ a partnership last year.",["formed","did","took","held"],"Les deux entreprises ont formé un partenariat l'an dernier."],
 ["He ___ a complaint about the poor service.",["made","did","took","gave"],"Il a déposé une plainte à propos du mauvais service."],
 ["Please ___ attention to the safety instructions.",["pay","make","do","put"],"Veuillez prêter attention aux consignes de sécurité."],
 ["We ___ a lot of progress this month.",["made","did","took","got"],"Nous avons fait beaucoup de progrès ce mois-ci."],
 ["The team must ___ a budget for the project.",["draw up","draw out","draw off","draw down"],"L'équipe doit établir un budget pour le projet."],
 ["The airline had to ___ all flights because of the storm.",["cancel","miss","lose","break"],"La compagnie aérienne a dû annuler tous les vols à cause de la tempête."],
 ["I would like to ___ an appointment with Dr Lee.",["make","do","take","hold"],"Je voudrais prendre rendez-vous avec le docteur Lee."],
 ["The board will ___ a vote on Friday.",["hold","make","do","give"],"Le conseil organisera un vote vendredi."],
 ["We need to ___ an agreement before the end of the month.",["reach","do","hold","win"],"Nous devons parvenir à un accord avant la fin du mois."],
 ["The manager ___ the blame for the failure.",["took","made","did","gave"],"Le responsable a endossé la responsabilité de l'échec."],
 ["Could you ___ a look at this contract?",["take","do","make","give"],"Pourriez-vous jeter un coup d'œil à ce contrat ?"]
]);

/* s : synonymes en contexte (le mot en gras est entouré de * ) */
var SYN = mk('s',[
 ["The meeting was *postponed* until Friday. Closest meaning:",["delayed","cancelled","shortened","repeated"],"La réunion a été reportée à vendredi."],
 ["The company plans to *expand* into Asia. Closest meaning:",["grow","shrink","move","close"],"L'entreprise prévoit de se développer en Asie."],
 ["Please *forward* the email to the whole team. Closest meaning:",["send on","delete","reply to","print"],"Veuillez transférer l'e-mail à toute l'équipe."],
 ["The supplier *guaranteed* delivery within a week. Closest meaning:",["promised","doubted","refused","delayed"],"Le fournisseur a garanti la livraison sous une semaine."],
 ["The manager *rejected* the proposal. Closest meaning:",["turned down","accepted","postponed","amended"],"Le responsable a rejeté la proposition."],
 ["We need to *reduce* our expenses. Closest meaning:",["cut","raise","share","record"],"Nous devons réduire nos dépenses."],
 ["The two firms will *merge* next year. Closest meaning:",["combine","compete","separate","borrow"],"Les deux entreprises fusionneront l'an prochain."],
 ["She *resigned* last week. Closest meaning:",["quit","was fired","was hired","was promoted"],"Elle a démissionné la semaine dernière."],
 ["The report contains *numerous* errors. Closest meaning:",["many","few","serious","minor"],"Le rapport contient de nombreuses erreurs."],
 ["The CEO gave a *brief* speech. Closest meaning:",["short","boring","formal","long"],"Le PDG a fait un bref discours."],
 ["We were *obliged* to cancel the event. Closest meaning:",["forced","allowed","hoping","pleased"],"Nous avons été contraints d'annuler l'événement."],
 ["The software is *compatible* with all devices. Closest meaning:",["able to work with","similar to","cheaper than","newer than"],"Le logiciel est compatible avec tous les appareils."],
 ["He *attended* the conference in Paris. Closest meaning:",["went to","organised","cancelled","paid for"],"Il a assisté à la conférence à Paris."],
 ["The firm is *seeking* a new accountant. Closest meaning:",["looking for","paying","firing","thanking"],"L'entreprise recherche un nouveau comptable."],
 ["The results were *disappointing*. Closest meaning:",["unsatisfactory","impressive","unexpected","delayed"],"Les résultats étaient décevants."],
 ["Prices have *fluctuated* this year. Closest meaning:",["gone up and down","risen steadily","fallen sharply","stayed stable"],"Les prix ont fluctué cette année."],
 ["The project is *ahead of schedule*. Closest meaning:",["earlier than planned","over budget","behind plan","on hold"],"Le projet est en avance sur le calendrier."],
 ["The new policy will *benefit* all employees. Closest meaning:",["help","harm","replace","inform"],"La nouvelle politique profitera à tous les employés."],
 ["Please *submit* your expense report by Friday. Closest meaning:",["hand in","write","correct","copy"],"Veuillez remettre votre note de frais d'ici vendredi."],
 ["The contract was *terminated* last month. Closest meaning:",["ended","signed","renewed","extended"],"Le contrat a été résilié le mois dernier."],
 ["The company is *reluctant* to raise prices. Closest meaning:",["unwilling","eager","ready","forced"],"L'entreprise rechigne à augmenter ses prix."],
 ["The manager *praised* the team's effort. Closest meaning:",["complimented","criticised","ignored","replaced"],"Le responsable a félicité les efforts de l'équipe."],
 ["Sales *plummeted* in January. Closest meaning:",["fell sharply","rose slightly","stayed flat","recovered"],"Les ventes ont chuté en janvier."],
 ["We need an *accurate* estimate. Closest meaning:",["precise","quick","cheap","rough"],"Nous avons besoin d'une estimation précise."]
]);

/* x : phrasal verbs */
var PHR = mk('x',[
 ["The match was ___ because of the rain.",["called off","called in","called up","called on"],"Le match a été annulé à cause de la pluie."],
 ["The committee will ___ the complaint and report back.",["look into","look after","look up to","look out"],"Le comité examinera la plainte et fera un compte rendu."],
 ["Could you ___ the figures before the meeting?",["go over","go off","go out","go up"],"Pourriez-vous revoir les chiffres avant la réunion ?"],
 ["They ___ the offer because the salary was too low.",["turned down","turned up","turned on","turned in"],"Ils ont refusé l'offre parce que le salaire était trop bas."],
 ["The company plans to ___ a new branch in Lyon.",["set up","set off","set down","set out"],"L'entreprise prévoit d'ouvrir une nouvelle agence à Lyon."],
 ["We have to ___ the meeting until next week.",["put off","put on","put up","put out"],"Nous devons repousser la réunion à la semaine prochaine."],
 ["The engineers will ___ the tests tomorrow.",["carry out","carry in","carry down","carry round"],"Les ingénieurs effectueront les tests demain."],
 ["Please ___ this form and return it to HR.",["fill in","fill up","fill down","fill off"],"Veuillez remplir ce formulaire et le renvoyer aux RH."],
 ["Sales have ___ since we changed our strategy.",["picked up","picked out","picked on","picked off"],"Les ventes ont repris depuis que nous avons changé de stratégie."],
 ["I can't ___ with this noise any longer.",["put up","put off","put out","put in"],"Je ne supporte plus ce bruit."],
 ["The printer has ___ again.",["broken down","broken out","broken in","broken up"],"L'imprimante est encore tombée en panne."],
 ["He ___ the company in 2005 and sold it in 2015.",["set up","set off","set aside","set back"],"Il a créé l'entreprise en 2005 et l'a vendue en 2015."],
 ["We ran ___ of paper, so we could not print.",["out","off","up","down"],"Nous n'avions plus de papier, donc nous n'avons pas pu imprimer."],
 ["The CEO will ___ next year after 20 years.",["step down","step in","step over","step by"],"Le PDG quittera ses fonctions l'an prochain après 20 ans."],
 ["Prices are expected to ___ in the next quarter.",["go up","go on","go off","go in"],"On s'attend à ce que les prix augmentent le trimestre prochain."],
 ["We need to ___ the contract before signing it.",["read through","read in","read up","read off"],"Nous devons lire attentivement le contrat avant de le signer."],
 ["She ___ her boss's job when he retired.",["took over","took off","took in","took out"],"Elle a repris le poste de son patron quand il est parti à la retraite."],
 ["The plane ___ ten minutes late.",["took off","took over","took in","took up"],"L'avion a décollé avec dix minutes de retard."],
 ["I will ___ the client at the airport.",["pick up","pick at","pick on","pick off"],"J'irai chercher le client à l'aéroport."],
 ["The deal ___ because the two sides could not agree on the price.",["fell through","fell off","fell out","fell down"],"L'accord a capoté parce que les deux parties n'ont pas réussi à s'entendre sur le prix."],
 ["The company ___ 50 new employees last year.",["took on","took up","took off","took after"],"L'entreprise a embauché 50 nouveaux employés l'an dernier."],
 ["Let us ___ the main points before the presentation.",["go through","go out","go off","go by"],"Passons en revue les points principaux avant la présentation."],
 ["He ___ with his boss about the bonus.",["fell out","fell off","fell behind","fell over"],"Il s'est brouillé avec son patron à propos de la prime."],
 ["The workshop will ___ at 9 and finish at 5.",["kick off","kick out","kick in","kick up"],"L'atelier commencera à 9 h et finira à 17 h."]
]);

/* t : traduction FR vers EN (faux amis et pièges) */
var TRAD = mk('t',[
 ["Nous avons actuellement 50 employés. => We ___ have 50 employees.",["currently","actually","eventually","finally"],"Nous avons actuellement 50 employés."],
 ["En fait, la réunion est annulée. => ___, the meeting is cancelled.",["Actually","Currently","Eventually","Recently"],"En fait, la réunion est annulée."],
 ["Il a finalement accepté l'offre. => He ___ accepted the offer.",["eventually","actually","currently","lately"],"Il a finalement accepté l'offre."],
 ["C'est un choix raisonnable. => It is a ___ choice.",["sensible","sensitive","sensational","senseless"],"C'est un choix raisonnable."],
 ["Il assistera à la conférence. => He will ___ the conference.",["attend","assist","assist to","help"],"Il assistera à la conférence."],
 ["Il passe sa journée à la bibliothèque. => He spends his day at the ___.",["library","bookshop","librarian","bookstand"],"Il passe sa journée à la bibliothèque."],
 ["Nous attendons votre réponse. => We are ___ your reply.",["waiting for","waiting to","attending","hoping"],"Nous attendons votre réponse."],
 ["Je travaille ici depuis trois ans. => I ___ here for three years.",["have worked","work","am working","worked"],"Je travaille ici depuis trois ans."],
 ["Il m'a demandé de l'aide. => He ___ me for help.",["asked","demanded","claimed","wanted"],"Il m'a demandé de l'aide."],
 ["Il fait semblant d'être occupé. => He ___ to be busy.",["pretends","claims","expects","intends"],"Il fait semblant d'être occupé."],
 ["Nous sommes contre ce projet. => We are ___ this project.",["against","versus","opposite","contrary"],"Nous sommes contre ce projet."],
 ["Je suis d'accord avec vous. => I ___ with you.",["agree","am agree","agree to","am agreeing"],"Je suis d'accord avec vous."],
 ["Il a perdu son travail. => He ___ his job.",["lost","missed","left","failed"],"Il a perdu son travail."],
 ["Elle a de bonnes connaissances en informatique. => She has good ___ of computing.",["knowledge","knowledges","knowing","science"],"Elle a de bonnes connaissances en informatique."],
 ["Nous avons besoin de plus d'informations. => We need more ___.",["information","informations","informing","inform"],"Nous avons besoin de plus d'informations."],
 ["Quel est le prix de cet article ? => What is the ___ of this item?",["price","prize","praise","pride"],"Quel est le prix de cet article ?"],
 ["Je regrette de ne pas pouvoir venir. => I ___ that I cannot come.",["regret","regrettable","am regret","regretted"],"Je regrette de ne pas pouvoir venir."],
 ["Il est important de rester calme. => It is important ___ calm.",["to stay","staying","stay","that stay"],"Il est important de rester calme."],
 ["Ils ont mis fin à leur partenariat. => They ___ their partnership.",["ended","finished","stopped","left"],"Ils ont mis fin à leur partenariat."],
 ["Pouvez-vous me prêter votre stylo ? => Can you ___ me your pen?",["lend","borrow","rent","owe"],"Pouvez-vous me prêter votre stylo ?"],
 ["Elle a dû annuler son voyage. => She ___ cancel her trip.",["had to","must","ought","should"],"Elle a dû annuler son voyage."],
 ["Il vit à Paris depuis 2015. => He has lived in Paris ___ 2015.",["since","for","from","ago"],"Il vit à Paris depuis 2015."],
 ["Il y a deux ans, nous avons déménagé. => We moved two years ___.",["ago","before","since","last"],"Il y a deux ans, nous avons déménagé."],
 ["Elle est plus grande que moi. => She is taller ___ me.",["than","that","as","from"],"Elle est plus grande que moi."]
]);

/* BOOM : questions plus difficiles pour les nouvelles catégories */
HARD = HARD.concat(
 mk('f',[
  ["The ___ of the new regulations caused confusion among employees.",["implementation","implement","implementable","implementer"],"La mise en œuvre des nouvelles réglementations a semé la confusion chez les employés."],
  ["He is widely ___ as an expert in logistics.",["regarded","regard","regarding","regardless"],"Il est largement considéré comme un expert en logistique."],
  ["The proposal is ___ unrealistic given our current budget.",["wholly","whole","wholeness","hole"],"La proposition est tout à fait irréaliste compte tenu de notre budget actuel."]
 ]),
 mk('p',[
  ["The shipment is subject ___ customs approval.",["to","of","for","with"],"L'expédition est soumise à l'approbation des douanes."],
  ["The new software is compatible ___ all operating systems.",["with","to","for","of"],"Le nouveau logiciel est compatible avec tous les systèmes d'exploitation."],
  ["The agreement remains in force ___ further notice.",["until","by","during","for"],"L'accord reste en vigueur jusqu'à nouvel ordre."],
  ["She was accused ___ leaking confidential data.",["of","for","with","about"],"Elle a été accusée d'avoir divulgué des données confidentielles."]
 ]),
 mk('l',[
  ["The government will ___ a ban on the product.",["impose","hold","do","ask"],"Le gouvernement imposera une interdiction sur le produit."],
  ["We must ___ a balance between cost and quality.",["strike","throw","shoot","beat"],"Nous devons trouver un équilibre entre coût et qualité."],
  ["The investors ___ concerns about the merger.",["raised","rose","arose","lifted"],"Les investisseurs ont exprimé des inquiétudes au sujet de la fusion."]
 ]),
 mk('s',[
  ["The auditors found the figures *dubious*. Closest meaning:",["questionable","accurate","impressive","complete"],"Les auditeurs ont jugé les chiffres douteux."],
  ["The company's *prudent* approach protected it from the crisis. Closest meaning:",["cautious","careless","aggressive","hasty"],"L'approche prudente de l'entreprise l'a protégée de la crise."],
  ["The manager *mitigated* the risks. Closest meaning:",["reduced","ignored","created","increased"],"Le responsable a atténué les risques."],
  ["Demand for the product is *dwindling*. Closest meaning:",["decreasing","growing","fluctuating","stable"],"La demande pour le produit diminue peu à peu."]
 ]),
 mk('x',[
  ["The negotiations ___ without any agreement.",["broke down","broke in","broke out","broke into"],"Les négociations ont échoué sans aucun accord."],
  ["The company ___ a rival firm last year.",["took over","took off","took up","took after"],"L'entreprise a racheté une société concurrente l'an dernier."]
 ]),
 mk('t',[
  ["Bien qu'il soit jeune, il est très compétent. => ___ he is young, he is very competent.",["Although","Despite","However","Whereas"],"Bien qu'il soit jeune, il est très compétent."],
  ["Il aurait dû nous prévenir. => He ___ have warned us.",["should","must","can","would"],"Il aurait dû nous prévenir."],
  ["Je n'ai pas vu mon collègue depuis lundi. => I ___ my colleague since Monday.",["have not seen","did not see","do not see","am not seeing"],"Je n'ai pas vu mon collègue depuis lundi."],
  ["Ça fait deux heures qu'il attend. => He ___ for two hours.",["has been waiting","is waiting","waits","waited"],"Ça fait deux heures qu'il attend."]
 ])
);

var NORMAL = CONN.concat(VERBS, WORDS, FAM, PREP, COLL, SYN, PHR, TRAD);
var CATS = [
 ['c','Logical connectors'],['v','Irregular verbs'],['w','Vocabulary (unscramble)'],['f','Word families'],
 ['p','Prepositions'],['l','Collocations'],['s','Synonyms in context'],['x','Phrasal verbs'],['t','French to English'],['e','Spot the wrong segment']
];
var MODE_LABEL={c:'Logical connector',v:'Irregular verb',w:'Vocabulary: unscramble the word',f:'Word family',p:'Preposition',l:'Collocation',s:'Synonym in context',x:'Phrasal verb',t:'Translation (French to English)',e:'Spot the wrong segment (A, B, C or D)'};

/* ---------- Banque supplementaire (v4) : meme format, o[0] = bonne reponse ---------- */
(function(){
function add(t,arr){arr.forEach(function(a){NORMAL.push({t:t,s:a[0],o:a[1],fr:a[2]})})}

add('c',[
 ["The conference was cancelled ___ a lack of registrations.",["because of","because","although","so that"],"La conférence a été annulée à cause d'un manque d'inscriptions."],
 ["___ our best efforts, sales fell by ten percent.",["In spite of","Although","Even though","However"],"Malgré tous nos efforts, les ventes ont baissé de dix pour cent."],
 ["You may use the meeting room ___ you book it in advance.",["as long as","even if","unless","in spite of"],"Vous pouvez utiliser la salle de réunion à condition de la réserver à l'avance."],
 ["The software is easy to use; ___, it is quite affordable.",["moreover","however","otherwise","whereas"],"Le logiciel est facile à utiliser ; de plus, il est assez abordable."],
 ["Please arrive early ___ you have time to register.",["so that","as though","even though","in case of"],"Veuillez arriver tôt afin d'avoir le temps de vous inscrire."],
 ["___ the manager was away, the assistant handled the complaint.",["While","Despite","Due to","Besides"],"Pendant que le directeur était absent, l'assistant a traité la réclamation."],
 ["We keep spare cables in the office ___ the system fails.",["in case","unless","whereas","so"],"Nous gardons des câbles de rechange au bureau au cas où le système tomberait en panne."],
 ["He is not only a skilled engineer ___ an excellent manager.",["but also","nor","or else","than"],"Il n'est pas seulement un ingénieur compétent mais aussi un excellent manager."],
 ["___ the tickets were expensive, the event sold out.",["Even though","Because of","In spite","As a result"],"Bien que les billets aient été chers, l'événement a affiché complet."],
 ["Sales have risen steadily; ___, profits have remained flat.",["however","therefore","moreover","for example"],"Les ventes ont augmenté régulièrement ; cependant, les bénéfices sont restés stables."],
 ["The new printer is faster, ___ the old one is more reliable.",["whereas","because","so that","unless"],"La nouvelle imprimante est plus rapide, alors que l'ancienne est plus fiable."],
 ["___ you have any questions, please contact the help desk.",["Should","Unless","Although","Whereas"],"Si vous avez des questions, veuillez contacter l'assistance."],
 ["We will start the meeting ___ everyone has arrived.",["as soon as","in spite of","as though","whereas"],"Nous commencerons la réunion dès que tout le monde sera arrivé."],
 ["He worked late ___ he could finish the report.",["so that","because of","despite","unless"],"Il a travaillé tard afin de pouvoir terminer le rapport."],
 ["Neither the manager ___ the assistant knew about the change.",["nor","or","and","but"],"Ni le directeur ni l'assistant n'étaient au courant du changement."],
 ["Either you pay now ___ you pay a late fee later.",["or","nor","but","so"],"Soit vous payez maintenant, soit vous paierez des frais de retard plus tard."],
 ["The project was completed on time ___ the lack of staff.",["despite","although","whereas","even if"],"Le projet a été terminé à temps malgré le manque de personnel."],
 ["Prices are going up; ___, customers are buying less.",["as a result","for instance","in contrast to","provided that"],"Les prix augmentent ; par conséquent, les clients achètent moins."],
 ["You will not receive a refund ___ you have the receipt.",["unless","provided","whereas","because"],"Vous ne serez pas remboursé à moins d'avoir le reçu."],
 ["___ the high cost, the board rejected the proposal.",["Given","Although","Whereas","Unless"],"Étant donné le coût élevé, le conseil a rejeté la proposition."]
]);

add('v',[
 ["She has ___ the report to the director. (bring)",["brought","bringed","broughten","braught"],"Elle a apporté le rapport au directeur."],
 ["We ___ new equipment last month. (buy)",["bought","buyed","boughten","brought"],"Nous avons acheté du nouveau matériel le mois dernier."],
 ["The security team has ___ the intruder. (catch)",["caught","catched","cought","catch"],"L'équipe de sécurité a attrapé l'intrus."],
 ["He ___ the company for ten years before he retired. (run)",["ran","runned","run","runs"],"Il a dirigé l'entreprise pendant dix ans avant de prendre sa retraite."],
 ["Have you ___ the news about the merger? (hear)",["heard","heared","hearn","hard"],"Avez-vous entendu la nouvelle de la fusion ?"],
 ["I ___ to call you yesterday, but I was busy. (mean)",["meant","meaned","mean","meaning"],"Je voulais vous appeler hier, mais j'étais occupé."],
 ["She ___ her application last week. (withdraw)",["withdrew","withdrawed","withdrawn","withdraw"],"Elle a retiré sa candidature la semaine dernière."],
 ["The firm has ___ a major renovation. (undertake)",["undertaken","undertook","undertaked","undertaking"],"L'entreprise a entrepris une importante rénovation."],
 ["The director has ___ to the press this morning. (speak)",["spoken","spoke","speaked","speaken"],"Le directeur a parlé à la presse ce matin."],
 ["We have ___ a new target for next year. (set)",["set","setted","sat","seted"],"Nous avons fixé un nouvel objectif pour l'an prochain."],
 ["The alarm ___ at six o'clock. (ring)",["rang","rung","ringed","ringing"],"L'alarme a sonné à six heures."],
 ["Everyone ___ in the meeting room while the boss spoke. (sit)",["sat","sit","sitted","seat"],"Tout le monde était assis dans la salle de réunion pendant que le patron parlait."],
 ["I have never ___ why the system crashes. (understand)",["understood","understanded","understand","understooden"],"Je n'ai jamais compris pourquoi le système plante."],
 ["Our sales have ___ up since January. (go)",["gone","went","goed","going"],"Nos ventes ont augmenté depuis janvier."],
 ["Someone has ___ the files. (hide)",["hidden","hid","hided","hiden"],"Quelqu'un a caché les dossiers."],
 ["I have ___ him since 2015. (know)",["known","knew","knowed","knowen"],"Je le connais depuis 2015."],
 ["He has ___ the same suit all week. (wear)",["worn","wore","weared","wearn"],"Il porte le même costume toute la semaine."],
 ["The wind has ___ the sign off the building. (blow)",["blown","blew","blowed","blowing"],"Le vent a arraché l'enseigne de l'immeuble."],
 ["After the meeting, everyone ___ relieved. (feel)",["felt","feeled","feel","feeling"],"Après la réunion, tout le monde s'est senti soulagé."],
 ["I ___ the contract twice yesterday. (read)",["read","readed","red","reading"],"J'ai lu le contrat deux fois hier."]
]);

/* mots a reconstituer */
[
 ["revenue","chiffre d'affaires, revenu"],["expense","dépense, frais"],["purchase","achat, acheter"],["estimate","estimation, estimer"],
 ["feedback","retour, commentaires"],["mandatory","obligatoire"],["merger","fusion"],["venue","lieu (d'un événement)"],
 ["proposal","proposition"],["requirement","exigence, condition requise"],["subscription","abonnement"],["cancellation","annulation"],
 ["reimburse","rembourser"],["workshop","atelier"],["warehouse","entrepôt"],["itinerary","itinéraire, programme de voyage"],
 ["luggage","bagages"],["vacancy","poste à pourvoir, chambre libre"],["overtime","heures supplémentaires"],["stationery","papeterie, fournitures de bureau"],
 ["complaint","réclamation, plainte"],["device","appareil, dispositif"],["trainee","stagiaire"],["upgrade","mise à niveau, améliorer"]
].forEach(function(a){NORMAL.push({t:'w',w:a[0],fr:a[1]})});

add('f',[
 ["The ___ of the new office was delayed by bad weather.",["construction","construct","constructive","constructively"],"La construction du nouveau bureau a été retardée par le mauvais temps."],
 ["Our team is highly ___ and meets every target.",["productive","product","production","productively"],"Notre équipe est très productive et atteint tous ses objectifs."],
 ["He ___ refused to sign the agreement.",["firmly","firm","firmness","firmer"],"Il a fermement refusé de signer l'accord."],
 ["The ___ of the hotel is excellent, close to the station.",["location","locate","located","locally"],"L'emplacement de l'hôtel est excellent, près de la gare."],
 ["We were ___ by the speed of the delivery.",["impressed","impress","impressive","impression"],"Nous avons été impressionnés par la rapidité de la livraison."],
 ["The company offers ___ training for new employees.",["extensive","extend","extension","extensively"],"L'entreprise propose une formation approfondie aux nouveaux employés."],
 ["It is ___ to leave the building during a fire drill.",["necessary","necessity","necessarily","necessitate"],"Il est nécessaire de quitter le bâtiment pendant un exercice d'évacuation."],
 ["Her ___ in the negotiation impressed the board.",["performance","perform","performed","performing"],"Sa performance lors de la négociation a impressionné le conseil."],
 ["The new rules will be ___ applied from January.",["strictly","strict","strictness","stricter"],"Les nouvelles règles seront strictement appliquées à partir de janvier."],
 ["We need a more ___ way to store the data.",["secure","security","securely","secured"],"Nous avons besoin d'un moyen plus sûr de stocker les données."],
 ["The ___ between the two companies lasted three years.",["partnership","partner","partnered","partnering"],"Le partenariat entre les deux entreprises a duré trois ans."],
 ["He gave a ___ explanation of the procedure.",["detailed","detail","detailing","details"],"Il a donné une explication détaillée de la procédure."],
 ["Several ___ applied for the position.",["candidates","candidacy","candid","candidly"],"Plusieurs candidats ont postulé au poste."],
 ["The sales manager is very ___ about the new product.",["enthusiastic","enthusiasm","enthusiastically","enthuse"],"Le directeur commercial est très enthousiaste à propos du nouveau produit."],
 ["The ___ of the machine requires special training.",["operation","operate","operative","operationally"],"Le fonctionnement de la machine nécessite une formation spéciale."],
 ["The results were ___ better than we expected.",["considerably","considerable","consider","consideration"],"Les résultats étaient nettement meilleurs que prévu."]
]);

add('p',[
 ["The meeting is scheduled ___ Tuesday at 3 p.m.",["for","in","by","at"],"La réunion est prévue pour mardi à 15 h."],
 ["She is in charge ___ the new project.",["of","for","at","to"],"Elle est responsable du nouveau projet."],
 ["He is responsible ___ the marketing department.",["for","of","to","with"],"Il est responsable du service marketing."],
 ["The price depends ___ the quantity ordered.",["on","of","from","with"],"Le prix dépend de la quantité commandée."],
 ["She apologised ___ the delay.",["for","of","to","with"],"Elle s'est excusée pour le retard."],
 ["We succeeded ___ finding a new supplier.",["in","at","on","for"],"Nous avons réussi à trouver un nouveau fournisseur."],
 ["The agreement is subject ___ approval by the board.",["to","for","of","with"],"L'accord est soumis à l'approbation du conseil."],
 ["He is interested ___ joining the training programme.",["in","on","at","for"],"Il est intéressé par le programme de formation."],
 ["There was a sharp increase ___ prices last year.",["in","of","on","at"],"Il y a eu une forte hausse des prix l'année dernière."],
 ["Our offices are located ___ the third floor.",["on","in","at","by"],"Nos bureaux sont situés au troisième étage."],
 ["The conference will take place ___ June 12th.",["on","in","at","by"],"La conférence aura lieu le 12 juin."],
 ["The report was written ___ the sales team.",["by","from","with","of"],"Le rapport a été rédigé par l'équipe commerciale."],
 ["Please contact us ___ phone or by email.",["by","with","through","in"],"Veuillez nous contacter par téléphone ou par e-mail."],
 ["She was promoted ___ senior manager last year.",["to","as","into","for"],"Elle a été promue directrice senior l'année dernière."],
 ["We are very proud ___ our team's results.",["of","for","about","with"],"Nous sommes très fiers des résultats de notre équipe."],
 ["The invoice must be paid ___ thirty days.",["within","during","since","until"],"La facture doit être réglée sous trente jours."]
]);

add('l',[
 ["Everyone should ___ an effort to arrive on time.",["make","do","take","have"],"Chacun doit faire un effort pour arriver à l'heure."],
 ["The company decided to ___ out a loan from the bank.",["take","make","put","hold"],"L'entreprise a décidé de contracter un prêt auprès de la banque."],
 ["Could you ___ me a favour?",["do","make","take","give"],"Pourriez-vous me rendre un service ?"],
 ["The company will ___ a profit this year.",["make","do","have","take"],"L'entreprise réalisera un bénéfice cette année."],
 ["We have to ___ a risk if we want to grow.",["take","make","do","have"],"Nous devons prendre un risque si nous voulons croître."],
 ["He was asked to ___ the minutes of the meeting.",["take","do","make","hold"],"On lui a demandé de rédiger le procès-verbal de la réunion."],
 ["The firm will ___ a new branch in Lyon next year.",["open","do","make","hold"],"L'entreprise ouvrira une nouvelle agence à Lyon l'année prochaine."],
 ["He was asked to ___ a speech at the ceremony.",["give","say","tell","speak"],"On lui a demandé de prononcer un discours lors de la cérémonie."],
 ["Our competitors ___ a lot of pressure on prices.",["put","do","make","take"],"Nos concurrents exercent une forte pression sur les prix."],
 ["The company has ___ its goals for the year.",["achieved","done","made","won"],"L'entreprise a atteint ses objectifs pour l'année."],
 ["We should ___ the opportunity to expand abroad.",["seize","do","hit","hold"],"Nous devrions saisir l'occasion de nous développer à l'étranger."],
 ["Heavy traffic ___ a delay of thirty minutes.",["caused","did","made","took"],"Les embouteillages ont causé un retard de trente minutes."],
 ["The two companies ___ a deal after long talks.",["struck","did","took","held"],"Les deux entreprises ont conclu un accord après de longues discussions."],
 ["She is going to ___ a complaint about the service.",["lodge","do","give","say"],"Elle va déposer une plainte au sujet du service."],
 ["We ___ a lot of money on advertising last year.",["spent","did","made","took"],"Nous avons dépensé beaucoup d'argent en publicité l'an dernier."],
 ["I would like to ___ an appointment with Dr Smith.",["make","do","take","put"],"J'aimerais prendre rendez-vous avec le Dr Smith."]
]);

add('s',[
 ["The company aims to *reduce* its costs. Closest meaning:",["cut","raise","share","check"],"L'entreprise vise à réduire ses coûts."],
 ["The manager *approved* the request. Closest meaning:",["accepted","refused","delayed","ignored"],"Le directeur a approuvé la demande."],
 ["The training will *commence* on Monday. Closest meaning:",["start","end","pause","repeat"],"La formation commencera lundi."],
 ["We need to *purchase* more supplies. Closest meaning:",["buy","sell","store","return"],"Nous devons acheter davantage de fournitures."],
 ["The results were *significant*. Closest meaning:",["important","small","late","expected"],"Les résultats étaient significatifs."],
 ["The company *requires* all staff to wear a badge. Closest meaning:",["demands","permits","suggests","avoids"],"L'entreprise exige que tout le personnel porte un badge."],
 ["The hotel is *adjacent* to the station. Closest meaning:",["next to","far from","opposite","behind"],"L'hôtel est contigu à la gare."],
 ["Please *submit* your expense report by Monday. Closest meaning:",["hand in","fill in","throw away","check out"],"Veuillez remettre votre note de frais d'ici lundi."],
 ["The company will *relocate* to Lille. Closest meaning:",["move","expand","close","merge"],"L'entreprise va déménager à Lille."],
 ["The speaker gave a *brief* summary. Closest meaning:",["short","detailed","boring","formal"],"L'intervenant a donné un bref résumé."],
 ["Sales were *steady* throughout the year. Closest meaning:",["stable","low","rising","weak"],"Les ventes ont été stables tout au long de l'année."],
 ["The firm *halted* production because of the strike. Closest meaning:",["stopped","increased","started","moved"],"L'entreprise a interrompu la production à cause de la grève."],
 ["The contract is *void* if you do not sign it. Closest meaning:",["invalid","new","long","permanent"],"Le contrat est nul si vous ne le signez pas."],
 ["We were *thrilled* with the results. Closest meaning:",["delighted","worried","bored","confused"],"Nous étions ravis des résultats."],
 ["The *entire* team attended the training. Closest meaning:",["whole","small","new","best"],"Toute l'équipe a suivi la formation."],
 ["He *commended* the staff for their hard work. Closest meaning:",["praised","blamed","paid","trained"],"Il a félicité le personnel pour son travail acharné."]
]);

add('x',[
 ["The meeting was ___ until next week.",["put off","put on","put up","put down"],"La réunion a été reportée à la semaine prochaine."],
 ["We ran ___ paper, so I ordered more.",["out of","off","away","down"],"Nous n'avions plus de papier, alors j'en ai commandé."],
 ["The company is ___ a new product next month.",["bringing out","bringing up","bringing in","bringing about"],"L'entreprise sort un nouveau produit le mois prochain."],
 ["Can you ___ the new employees around the factory?",["show","go","look","see"],"Pouvez-vous faire visiter l'usine aux nouveaux employés ?"],
 ["The system broke ___ during the presentation.",["down","off","out of","up"],"Le système est tombé en panne pendant la présentation."],
 ["Please ___ this form and return it to reception.",["fill in","fill up","fill out of","fill with"],"Veuillez remplir ce formulaire et le remettre à l'accueil."],
 ["We need to ___ a solution before the deadline.",["come up with","come across","come off","come round"],"Nous devons trouver une solution avant la date limite."],
 ["She ___ for her colleague while he was on holiday.",["filled in","filled up","filled out","filled with"],"Elle a remplacé son collègue pendant ses vacances."],
 ["The company ___ two smaller firms last year.",["took over","took off","took up","took out"],"L'entreprise a racheté deux petites sociétés l'année dernière."],
 ["Prices have ___ since the beginning of the year.",["gone up","gone off","gone out","gone over"],"Les prix ont augmenté depuis le début de l'année."],
 ["I am ___ you to complete the survey by Friday.",["counting on","counting up","counting out","counting off"],"Je compte sur vous pour remplir l'enquête d'ici vendredi."],
 ["He ___ his job to look after his children.",["gave up","gave in","gave out","gave off"],"Il a quitté son travail pour s'occuper de ses enfants."],
 ["The printer has ___ of ink.",["run out","run over","run off","run up"],"L'imprimante n'a plus d'encre."],
 ["The team ___ the problem and found the cause.",["sorted out","sorted in","sorted up","sorted off"],"L'équipe a réglé le problème et trouvé la cause."],
 ["Could you ___ this word in the dictionary?",["look up","look after","look into","look out"],"Pourriez-vous chercher ce mot dans le dictionnaire ?"],
 ["He ___ the meeting at 5 p.m.",["wrapped up","wrapped in","wrapped round","wrapped on"],"Il a conclu la réunion à 17 h."]
]);

add('t',[
 ["Il a démissionné hier. => He ___ yesterday.",["resigned","retired","fired","resumed"],"Il a démissionné hier."],
 ["Ce film est vraiment ennuyeux. => This film is really ___.",["boring","bored","bore","boredom"],"Ce film est vraiment ennuyeux."],
 ["Il a perdu son emploi. => He ___ his job.",["lost","loosed","missed","left"],"Il a perdu son emploi."],
 ["Je vous conseille de partir tôt. => I ___ you to leave early.",["advise","advice","advices","adviced"],"Je vous conseille de partir tôt."],
 ["Il a fait des progrès. => He has made ___.",["progress","a progress","progresses","progressing"],"Il a fait des progrès."],
 ["Elle m'a donné de bons conseils. => She gave me some good ___.",["advice","advices","advises","advise"],"Elle m'a donné de bons conseils."],
 ["Les informations sont exactes. => The ___ is correct.",["information","informations","an information","informing"],"Les informations sont exactes."],
 ["Il travaille ici depuis 2015. => He has worked here ___ 2015.",["since","for","from","ago"],"Il travaille ici depuis 2015."],
 ["Elle est aussi grande que moi. => She is as tall ___ me.",["as","than","that","like"],"Elle est aussi grande que moi."],
 ["Il est rentré chez lui. => He went ___.",["home","to home","at home","in home"],"Il est rentré chez lui."],
 ["J'ai hâte de vous voir. => I look forward to ___ you.",["seeing","see","saw","seen"],"J'ai hâte de vous voir."],
 ["Cela m'a pris deux heures. => It ___ me two hours.",["took","lasted","needed","spent"],"Cela m'a pris deux heures."],
 ["Il m'a demandé de l'aider. => He asked me ___ him.",["to help","help","helping","for help"],"Il m'a demandé de l'aider."],
 ["Il a insisté pour payer. => He insisted ___ paying.",["on","in","to","for"],"Il a insisté pour payer."],
 ["Nous avons l'habitude de travailler tard. => We are used ___ late.",["to working","to work","for working","at work"],"Nous avons l'habitude de travailler tard."],
 ["Elle a refusé de signer. => She ___ to sign.",["refused","denied","rejected","avoided"],"Elle a refusé de signer."]
]);
})();
/* ---------- Spot the wrong segment (t:'e') : segs = 4 segments, k = index du segment fautif, fix = correction du segment ('' = supprimer) ---------- */
(function(){
[
 [["The manager","have approved","the budget","for next year."],1,"has approved","Subject-verb agreement: 'The manager' is singular.","Le directeur a approuvé le budget pour l'année prochaine."],
 [["We are looking forward","to meet","our new clients","next week."],1,"to meeting","'Look forward to' is followed by the -ing form.","Nous avons hâte de rencontrer nos nouveaux clients la semaine prochaine."],
 [["Despite of","the heavy traffic,","she arrived","on time."],0,"Despite","'Despite' is never followed by 'of' (compare 'in spite of').","Malgré la circulation dense, elle est arrivée à l'heure."],
 [["Each of","the employees","receive","a security badge."],2,"receives","'Each of' takes a singular verb.","Chacun des employés reçoit un badge de sécurité."],
 [["The company has","less employees","than it had","five years ago."],1,"fewer employees","'Fewer' is used with countable nouns.","L'entreprise a moins d'employés qu'il y a cinq ans."],
 [["If the shipment","will arrive","tomorrow,","we will start the installation."],1,"arrives","No 'will' in the if-clause: use the present simple.","Si la livraison arrive demain, nous commencerons l'installation."],
 [["The report","which he wrote","it was","very detailed."],2,"was","Redundant pronoun: 'which' already refers to the report.","Le rapport qu'il a rédigé était très détaillé."],
 [["She is","more efficient","that","the other managers."],2,"than","Comparative: 'more efficient than'.","Elle est plus efficace que les autres directeurs."],
 [["Please send","me informations","about the","new pricing policy."],1,"me information","'Information' is uncountable: it has no plural.","Veuillez m'envoyer des informations sur la nouvelle politique tarifaire."],
 [["Our office","is locate","near","the station."],1,"is located","Passive voice: be + past participle.","Notre bureau est situé près de la gare."],
 [["Neither the director","or the assistant","was aware","of the problem."],1,"nor the assistant","The correlative pair is 'neither ... nor'.","Ni le directeur ni l'assistant n'étaient au courant du problème."],
 [["The new software","is more easier","to use","than the old one."],1,"is easier","Short adjectives take -er: do not add 'more'.","Le nouveau logiciel est plus facile à utiliser que l'ancien."],
 [["He suggested","to postpone","the meeting","until Monday."],1,"postponing","'Suggest' is followed by the -ing form, not by 'to'.","Il a suggéré de reporter la réunion à lundi."],
 [["We have been working","on this project","since three","months."],2,"for three","'For' + a period of time; 'since' + a starting point.","Nous travaillons sur ce projet depuis trois mois."],
 [["The number of","customers have","increased","significantly this year."],1,"customers has","'The number of' takes a singular verb.","Le nombre de clients a nettement augmenté cette année."],
 [["Employees","is required","to wear","a badge at all times."],1,"are required","'Employees' is plural, so the verb must be plural.","Les employés doivent porter un badge en permanence."],
 [["The conference","will be held","in Tuesday morning","at the Grand Hotel."],2,"on Tuesday morning","Use 'on' with days (and parts of a specific day).","La conférence aura lieu mardi matin au Grand Hôtel."],
 [["She asked me","if I could","to help","her with the report."],2,"help","A modal verb ('could') is followed by the bare infinitive.","Elle m'a demandé si je pouvais l'aider avec le rapport."],
 [["The employees","who works","in this department","are very experienced."],1,"who work","The verb agrees with 'employees' (plural).","Les employés qui travaillent dans ce service sont très expérimentés."],
 [["Our flight","was delayed","during two hours","because of the storm."],2,"for two hours","'For' + a duration; 'during' + a noun naming a period.","Notre vol a été retardé de deux heures à cause de la tempête."],
 [["He gave us","some useful","advices","about the contract."],2,"advice","'Advice' is uncountable: it has no plural.","Il nous a donné quelques conseils utiles sur le contrat."],
 [["The company","plans","launching","a new product next month."],2,"to launch","'Plan' is followed by a to-infinitive.","L'entreprise prévoit de lancer un nouveau produit le mois prochain."],
 [["I wish","I have","more time","to finish the report."],1,"I had","'Wish' + past simple for an unreal present situation.","J'aimerais avoir plus de temps pour terminer le rapport."],
 [["If I","were you,","I will","accept the offer."],2,"I would","Second conditional: if + past, would + infinitive.","Si j'étais vous, j'accepterais l'offre."],
 [["The documents","must be signed","by","the both parties."],3,"both parties.","No article is placed before 'both' ('both parties' or 'both the parties').","Les documents doivent être signés par les deux parties."],
 [["The invoice","was sent","to customer","last week."],2,"to the customer","A singular countable noun needs a determiner.","La facture a été envoyée au client la semaine dernière."],
 [["Nobody","didn't tell","me about","the change of plans."],1,"told","Double negative: 'nobody' already makes the sentence negative.","Personne ne m'a parlé du changement de programme."],
 [["The CEO,","who is","very busy,","have no time today."],3,"has no time today.","The subject is 'The CEO' (singular), so the verb is 'has'.","Le PDG, qui est très occupé, n'a pas le temps aujourd'hui."],
 [["We are","interesting in","your proposal","for a joint venture."],1,"interested in","Use the -ed adjective to say how a person feels.","Nous sommes intéressés par votre proposition de coentreprise."],
 [["The meeting was","so boring","that everybody","felt asleep."],3,"fell asleep.","The verb is 'fall asleep' (fell), not 'feel'.","La réunion était si ennuyeuse que tout le monde s'est endormi."],
 [["She has","worked here","since she","has graduated."],3,"graduated.","'Since' + past simple for the starting point.","Elle travaille ici depuis qu'elle a obtenu son diplôme."],
 [["Please remember","to lock","the door","when you will leave."],3,"when you leave.","No 'will' after 'when' in a time clause: use the present simple.","N'oubliez pas de fermer la porte à clé quand vous partirez."],
 [["The staff","are very","grateful of","your support."],2,"grateful for","'Grateful' is followed by 'for' (grateful for something).","Le personnel vous est très reconnaissant de votre soutien."],
 [["Most of","the information","in the report","are correct."],3,"is correct.","'Information' is uncountable and takes a singular verb.","L'essentiel des informations du rapport est exact."],
 [["He is","the person","which","manages our accounts."],2,"who","Use 'who' (or 'that') for people, not 'which'.","C'est la personne qui gère nos comptes."],
 [["We need","to find","a alternative","solution as soon as possible."],2,"an alternative","Use 'an' before a vowel sound.","Nous devons trouver une autre solution dès que possible."],
 [["Although","the product is expensive,","but","it sells very well."],2,"","'Although' and 'but' cannot be used together: delete 'but'.","Bien que le produit soit cher, il se vend très bien."],
 [["The manager","asked us","finishing","the report by Friday."],2,"to finish","'Ask someone' is followed by a to-infinitive.","Le directeur nous a demandé de terminer le rapport pour vendredi."],
 [["I am used","to work","long hours","every week."],1,"to working","'Be used to' is followed by the -ing form.","J'ai l'habitude de travailler de longues heures chaque semaine."],
 [["The train","to Paris","leaves","at the 7:30."],3,"at 7:30.","No article before a clock time.","Le train pour Paris part à 7 h 30."],
 [["They told us","that the project","would be finish","by the end of May."],2,"would be finished","Passive voice: be + past participle.","Ils nous ont dit que le projet serait terminé d'ici fin mai."],
 [["The more","we wait,","the most","expensive it gets."],2,"the more","Double comparative: 'the more ..., the more ...'.","Plus nous attendons, plus cela devient cher."],
 [["Sheila,","along with her colleagues,","are","attending the conference."],2,"is","The subject is 'Sheila'; 'along with ...' does not make it plural.","Sheila, ainsi que ses collègues, participe à la conférence."],
 [["Would you mind","to open","the window,","please?"],1,"opening","'Would you mind' is followed by the -ing form.","Cela vous dérangerait-il d'ouvrir la fenêtre, s'il vous plaît ?"],
 [["He apologised","for to be","late for","the meeting."],1,"for being","A preposition is followed by the -ing form.","Il s'est excusé d'être en retard à la réunion."],
 [["The board","recommended","that he resigns","immediately."],2,"that he resign","After 'recommend that', the verb takes the base form (subjunctive; British English also accepts 'should resign').","Le conseil a recommandé qu'il démissionne immédiatement."],
 [["Hardly had","the meeting started","than the fire","alarm went off."],2,"when the fire","'Hardly' is followed by 'when'; 'than' belongs to 'no sooner'.","À peine la réunion avait-elle commencé que l'alarme incendie s'est déclenchée."],
 [["No sooner","had she sat down","when the phone","rang."],2,"than the phone","'No sooner' is followed by 'than'; 'when' belongs to 'hardly'.","À peine s'était-elle assise que le téléphone a sonné."],
 [["Not only","the company lost","money, but it also","lost its best clients."],1,"did the company lose","Inversion after a fronted 'Not only': auxiliary + subject + bare infinitive.","Non seulement l'entreprise a perdu de l'argent, mais elle a aussi perdu ses meilleurs clients."],
 [["The new policy","will not be applied","unless it will be","approved by the board."],2,"unless it is","No 'will' in an 'unless' clause: use the present simple.","La nouvelle politique ne sera pas appliquée à moins d'être approuvée par le conseil."],
 [["She is","in charge for","the training of","new employees."],1,"in charge of","'In charge of' (compare 'responsible for').","Elle est chargée de la formation des nouveaux employés."],
 [["The storm","resulted","of serious","damage to the roof."],2,"in serious","'Result in' introduces a consequence; 'result from' introduces a cause.","La tempête a causé de graves dégâts au toit."],
 [["The new tax","will effect","small businesses","the most."],1,"will affect","'To affect' means to have an influence on; 'effect' is mostly a noun.","La nouvelle taxe touchera surtout les petites entreprises."],
 [["Prices are","expected","to raise","next quarter."],2,"to rise","'Rise' is intransitive; 'raise' needs a direct object.","Les prix devraient augmenter le trimestre prochain."],
 [["Could you","remember me","to book","the meeting room?"],1,"remind me","'Remind someone to do something'; 'remember' does not take a person as object here.","Pouvez-vous me rappeler de réserver la salle de réunion ?"],
 [["The rules apply","regardless","the size","of the company."],1,"regardless of","'Regardless' must be followed by 'of'.","Les règles s'appliquent quelle que soit la taille de l'entreprise."],
 [["You may","use the car","as long","you drive carefully."],2,"as long as","'As long as' is a fixed conjunction (= provided that).","Vous pouvez utiliser la voiture à condition de conduire prudemment."],
 [["The room","is not","enough large","for the whole team."],2,"large enough","'Enough' follows the adjective it modifies.","La salle n'est pas assez grande pour toute l'équipe."],
 [["The offer","is too","good to","miss it."],3,"miss.","In 'too ... to + infinitive', the object is not repeated.","L'offre est trop belle pour être manquée."],
 [["She said me","that the shipment","had been","delayed."],0,"She told me","'Say' cannot be followed directly by a person; use 'tell'.","Elle m'a dit que l'expédition avait été retardée."],
 [["She asked","how much","did the repair","cost."],2,"the repair","Indirect question: no inversion and no auxiliary 'do'.","Elle a demandé combien la réparation avait coûté."],
 [["We had","our website","redesign","by a freelancer."],2,"redesigned","'Have something done': use the past participle.","Nous avons fait refaire notre site par un indépendant."],
 [["The job involves","answering calls,","to write reports","and scheduling meetings."],2,"writing reports","Parallel structure: keep the same -ing form throughout the list.","Le poste consiste à répondre au téléphone, rédiger des rapports et organiser des réunions."],
 [["The company","announced","it's new","strategy yesterday."],2,"its new","'Its' is the possessive; 'it's' means 'it is' or 'it has'.","L'entreprise a annoncé hier sa nouvelle stratégie."],
 [["In spite","the delay,","the client","was satisfied."],0,"In spite of","'In spite' must be followed by 'of'.","Malgré le retard, le client était satisfait."],
 [["The two","departments","work closely","with themselves."],3,"with each other.","Reciprocal relation: 'each other', not a reflexive pronoun.","Les deux services travaillent en étroite collaboration."],
 [["The company","is looking for","an economic","car for its sales team."],2,"an economical","'Economical' = cheap to run; 'economic' = relating to the economy.","L'entreprise cherche une voiture économique pour son équipe commerciale."],
 [["This year's sales","are twice","as high","than last year's."],3,"as last year's.","Equality comparison: 'as ... as', not 'than'.","Les ventes de cette année sont deux fois plus élevées que celles de l'an dernier."],
 [["It was","so a good","opportunity that","he accepted at once."],1,"such a good","'Such a + adjective + noun'; 'so' goes with an adjective alone.","C'était une si bonne occasion qu'il a accepté aussitôt."],
 [["The CEO","has joined","the firm","in 2019."],1,"joined","The present perfect cannot be used with a finished-time adverbial such as 'in 2019'.","Le PDG a rejoint l'entreprise en 2019."],
 [["By the time","we arrived,","the meeting","already started."],3,"had already started.","Past perfect for an action completed before another past action.","Quand nous sommes arrivés, la réunion avait déjà commencé."],
 [["By next June,","she will","work here","for ten years."],2,"have worked here","Future perfect: will + have + past participle.","D'ici juin prochain, elle travaillera ici depuis dix ans."],
 [["If we","had known","about the problem,","we would fix it earlier."],3,"we would have fixed it earlier.","Third conditional: if + past perfect, would have + past participle.","Si nous avions connu le problème, nous l'aurions réglé plus tôt."],
 [["He must","have forgot","about","the appointment."],1,"have forgotten","Modal perfect: modal + have + past participle ('forgotten').","Il a dû oublier le rendez-vous."],
 [["You should","of called","the client","before the meeting."],1,"have called","'Should have' (never 'should of'): 'of' is a spelling mistake for the weak form of 'have'.","Vous auriez dû appeler le client avant la réunion."],
 [["We offer","the free delivery","on all","orders over 50 euros."],1,"free delivery","No article before an uncountable noun used in a general sense.","Nous offrons la livraison gratuite pour toute commande de plus de 50 euros."],
 [["The meeting","has been","put off","until further notices."],3,"until further notice.","In this fixed phrase, 'notice' is uncountable.","La réunion a été reportée jusqu'à nouvel ordre."],
 [["All staff","are invited","to participate","at the workshop."],3,"in the workshop.","'Participate in'.","Tout le personnel est invité à participer à l'atelier."],
 [["Over 200 people","attended to","the conference","last year."],1,"attended","'Attend' is transitive: no preposition.","Plus de 200 personnes ont assisté à la conférence l'an dernier."],
 [["We will","discuss about","the schedule","tomorrow."],1,"discuss","'Discuss' is transitive: no preposition.","Nous discuterons du calendrier demain."],
 [["The committee","consists","by five","members."],2,"of five","'Consist of'.","Le comité se compose de cinq membres."],
 [["We need","new equipments","for the","laboratory."],1,"new equipment","'Equipment' is uncountable: it has no plural.","Nous avons besoin de nouveaux équipements pour le laboratoire."],
 [["There were","too much","people","at the event."],1,"too many","'People' is countable: use 'many', not 'much'.","Il y avait trop de monde à l'événement."],
 [["A number of","employees was","absent","yesterday."],1,"employees were","'A number of' takes a plural verb (compare 'the number of').","Plusieurs employés étaient absents hier."],
 [["The building","in that","we work","is very old."],1,"in which","A preposition cannot be followed directly by 'that' in a relative clause.","Le bâtiment dans lequel nous travaillons est très ancien."],
 [["The employee","who","laptop was stolen","reported the loss."],1,"whose","'Whose' expresses possession in a relative clause.","L'employé dont l'ordinateur a été volé a signalé la perte."],
 [["We need","to do a","decision","before Friday."],1,"to make a","The collocation is 'make a decision'.","Nous devons prendre une décision avant vendredi."],
 [["She made","a lot of","research","on the market."],0,"She did","The collocation is 'do research'.","Elle a fait beaucoup de recherches sur le marché."],
 [["Unless","you do not sign","the form,","you cannot enter."],1,"you sign","'Unless' already means 'if ... not': do not add a second negative.","À moins de signer le formulaire, vous ne pouvez pas entrer."],
 [["We will deliver","on time,","provided that","you will pay in advance."],3,"you pay in advance.","No 'will' after 'provided that': use the present simple.","Nous livrerons à temps, à condition que vous payiez d'avance."],
 [["The train","arrived","in time,","as scheduled."],2,"on time,","'On time' = at the scheduled time; 'in time' = early enough to do something.","Le train est arrivé à l'heure, comme prévu."],
 [["He called","during he","was waiting","at the airport."],1,"while he","'During' is a preposition (+ noun); 'while' is a conjunction (+ clause).","Il a appelé pendant qu'il attendait à l'aéroport."],
 [["The flight","was cancelled","because","the bad weather."],2,"because of","'Because' + clause; 'because of' + noun phrase.","Le vol a été annulé à cause du mauvais temps."],
 [["Could you","borrow me","your charger","for an hour?"],1,"lend me","'Lend' = give temporarily; 'borrow' = receive temporarily.","Pourriez-vous me prêter votre chargeur pour une heure ?"],
 [["More than one","candidate","have applied","for the position."],2,"has applied","'More than one' + singular noun takes a singular verb.","Plus d'un candidat a postulé au poste."],
 [["She is one","of the most","respected manager","in the company."],2,"respected managers","'One of the' is followed by a plural noun.","Elle est l'une des directrices les plus respectées de l'entreprise."],
 [["The delay","made us","to miss","the connection."],2,"miss","'Make' + object + bare infinitive (no 'to').","Le retard nous a fait rater la correspondance."],
 [["The company","stopped","to produce","these items in 2020."],2,"producing","'Stop doing' = cease; 'stop to do' = pause in order to do.","L'entreprise a cessé de produire ces articles en 2020."],
 [["A large","amount of","people attended","the seminar."],1,"number of","'Number' goes with countable nouns, 'amount' with uncountable ones.","Un grand nombre de personnes ont assisté au séminaire."],
 [["The report","must be finished","until Friday","at the latest."],2,"by Friday","'By' = no later than; 'until' = up to a point in time (continuous state).","Le rapport doit être terminé au plus tard vendredi."],
 [["All employees","accept","the managers","must attend the meeting."],1,"except","'Accept' = receive; 'except' = apart from.","Tous les employés, sauf les directeurs, doivent assister à la réunion."],
 [["It is high time","we update","our software","before it crashes."],1,"we updated","'It's (high) time' is followed by the past simple (unreal present).","Il est grand temps de mettre à jour notre logiciel avant qu'il ne plante."],
 [["I would rather","you to send","the contract","today."],1,"you sent","'Would rather' + subject + past simple for a wish about someone else.","Je préférerais que vous envoyiez le contrat aujourd'hui."],
 [["Every employees","must wear","a badge","at all times."],0,"Every employee","'Every' is followed by a singular noun.","Chaque employé doit porter un badge en permanence."],
 [["Much customers","have complained","about","the delay."],0,"Many customers","'Customers' is countable: use 'many', not 'much'.","De nombreux clients se sont plaints du retard."],
 [["Their are","several reasons","for the","delay."],0,"There are","'There are' states existence; 'their' is a possessive.","Il y a plusieurs raisons à ce retard."],
 [["Who's","car is","parked","in front of the gate?"],0,"Whose","'Whose' asks about possession; 'who's' = who is / who has.","À qui est la voiture garée devant le portail ?"],
 [["Almost of","the staff","attended","the training."],0,"Most of","'Almost' cannot be followed by 'of': use 'most of' or 'almost all of'.","Presque tout le personnel a suivi la formation."],
 [["Everyone are","invited","to the","reception tonight."],0,"Everyone is","'Everyone' takes a singular verb.","Tout le monde est invité à la réception de ce soir."],
 [["Yesterdays","meeting","was","cancelled."],0,"Yesterday's","A time noun in the possessive needs an apostrophe: 'yesterday's meeting'.","La réunion d'hier a été annulée."],
 [["Between you and I,","the offer","is not","very generous."],0,"Between you and me,","After a preposition, use the object pronoun 'me'.","Entre nous, l'offre n'est pas très généreuse."],
 [["An unique","opportunity","has arisen","this week."],0,"A unique","Use 'a' before the consonant sound /j/ of 'unique'.","Une occasion unique s'est présentée cette semaine."],
 [["Due the","bad weather,","the match","was postponed."],0,"Due to the","'Due to' is a fixed prepositional phrase.","En raison du mauvais temps, le match a été reporté."],
 [["According at","the report,","sales fell","by 5%."],0,"According to","'According to' (not 'at').","Selon le rapport, les ventes ont baissé de 5 %."],
 [["Beside","her salary,","she receives","a bonus."],0,"Besides","'Beside' = next to; 'besides' = in addition to.","En plus de son salaire, elle touche une prime."],
 [["Whom","is responsible","for the","budget?"],0,"Who","'Who' is the subject of the question; 'whom' is the object form.","Qui est responsable du budget ?"],
 [["The manager","asked","whether","did we need help."],3,"we needed help.","Indirect question: no inversion and no auxiliary 'do'.","Le directeur a demandé si nous avions besoin d'aide."],
 [["We look","forward to","your visit","and to meet you."],3,"and to meeting you.","'Look forward to' is always followed by a noun or the -ing form, even after 'and'.","Nous attendons votre visite avec impatience et serons ravis de vous rencontrer."],
 [["The seminar","starts","at nine","in Monday."],3,"on Monday.","Use 'on' with days of the week.","Le séminaire commence lundi à neuf heures."],
 [["Please send","us the","documents","as soon as possibly."],3,"as soon as possible.","After 'as soon as', the adjective 'possible' is required.","Veuillez nous envoyer les documents dès que possible."],
 [["Our sales","have increased","significantly","since the last year."],3,"since last year.","No article before 'last' in time expressions.","Nos ventes ont nettement augmenté depuis l'an dernier."],
 [["We","must","hurry","for not missing the train."],3,"so as not to miss the train.","Negative purpose: 'so as not to' or 'in order not to' + bare infinitive.","Nous devons nous dépêcher pour ne pas manquer le train."],
 [["It is","a pity","that you","didn't came."],3,"didn't come.","After 'did', use the bare infinitive.","C'est dommage que vous ne soyez pas venu."],
 [["She speaks","English","and French","very good."],3,"very well.","An adverb ('well') modifies a verb; 'good' is an adjective.","Elle parle très bien anglais et français."],
 [["We cannot","accept","your offer","neither."],3,"either.","'Either' is used in negative sentences; 'neither' is already negative.","Nous ne pouvons pas non plus accepter votre offre."],
 [["He did not","say","anything","to no one."],3,"to anyone.","Double negative: use 'anyone' after a negative verb.","Il n'a rien dit à personne."],
 [["Could you","tell me","where","is the station?"],3,"the station is?","Indirect question: the subject comes before the verb.","Pourriez-vous me dire où se trouve la gare ?"],
 [["Neither","she","nor her","colleagues was present."],3,"colleagues were present.","With 'neither ... nor', the verb agrees with the nearest subject ('colleagues').","Ni elle ni ses collègues n'étaient présents."]
].forEach(function(a){NORMAL.push({t:'e',s:a[0].join(' '),segs:a[0],k:a[1],fix:a[2],why:a[3],fr:a[4],o:['A','B','C','D']})});
})();

/* ---------- Banque supplementaire (v5) : niveau B2+ TOEIC / ecole d'ingenieurs, o[0] = bonne reponse ---------- */
(function(){
function add(t,arr,target){arr.forEach(function(a){(target||NORMAL).push({t:t,s:a[0],o:a[1],fr:a[2]})})}

add('c',[
 ["Sales have risen steadily; ___, profit margins have fallen.",["however","therefore","moreover","consequently"],"Les ventes ont augmenté régulièrement ; cependant, les marges bénéficiaires ont baissé."],
 ["___ you submit the form by Friday, your application will not be considered.",["Unless","Provided","Whereas","Although"],"À moins de remettre le formulaire d'ici vendredi, votre candidature ne sera pas examinée."],
 ["The new software is faster. ___, it is considerably easier to use.",["Moreover","However","Otherwise","Instead"],"Le nouveau logiciel est plus rapide. De plus, il est nettement plus facile à utiliser."],
 ["He accepted the position ___ the lower salary.",["despite","although","because","unless"],"Il a accepté le poste malgré le salaire plus bas."],
 ["We installed a backup generator ___ the power supply fails.",["in case","in spite of","whereas","even"],"Nous avons installé un groupe électrogène de secours au cas où l'alimentation électrique tomberait en panne."],
 ["___ the contract was signed in March, work did not begin until June.",["Although","Because","Therefore","Unless"],"Bien que le contrat ait été signé en mars, les travaux n'ont commencé qu'en juin."],
 ["The team worked overtime ___ the project would be finished on schedule.",["so that","in spite of","whereas","unless"],"L'équipe a fait des heures supplémentaires afin que le projet soit terminé dans les délais."],
 ["Prices rose sharply last year, ___ wages stayed almost unchanged.",["whereas","therefore","provided","so"],"Les prix ont fortement augmenté l'an dernier, alors que les salaires sont restés presque inchangés."],
 ["___ our competitors, we offer a two-year warranty on every product.",["Unlike","Despite","Owing to","Throughout"],"Contrairement à nos concurrents, nous offrons une garantie de deux ans sur chaque produit."],
 ["The flight was delayed; ___, passengers were offered a meal voucher.",["as a result","on the contrary","by contrast","in spite of"],"Le vol a été retardé ; par conséquent, les passagers ont reçu un bon repas."],
 ["You may use the conference room ___ you book it in advance.",["as long as","even though","in case of","owing to"],"Vous pouvez utiliser la salle de conférence à condition de la réserver à l'avance."],
 ["___ the cost of the repairs, the owner decided to sell the building.",["Given","Although","Whereas","Unless"],"Vu le coût des réparations, le propriétaire a décidé de vendre le bâtiment."]
]);

add('v',[
 ["The price of oil has ___ sharply this year. (rise)",["risen","rose","rised","raised"],"Le prix du pétrole a fortement augmenté cette année."],
 ["The CEO ___ the audience a clear message yesterday. (give)",["gave","given","gived","gives"],"Hier, le PDG a adressé un message clair au public."],
 ["We have ___ all our targets this quarter. (meet)",["met","meeted","meet","meets"],"Nous avons atteint tous nos objectifs ce trimestre."],
 ["Our main competitor ___ its prices last week. (cut)",["cut","cutted","cuts","cutten"],"Notre principal concurrent a baissé ses prix la semaine dernière."],
 ["He ___ his keys on the train yesterday. (lose)",["lost","losed","lose","loosed"],"Il a perdu ses clés dans le train hier."],
 ["They had ___ the contract before the deadline. (win)",["won","win","wined","winned"],"Ils avaient remporté le contrat avant la date limite."],
 ["The engineer ___ the machine apart to find the fault. (take)",["took","taken","taked","take"],"L'ingénieur a démonté la machine pour trouver la panne."],
 ["We have ___ a new supplier in Poland. (find)",["found","finded","find","fund"],"Nous avons trouvé un nouveau fournisseur en Pologne."],
 ["She ___ her team to victory last year. (lead)",["led","lead","leaded","leads"],"Elle a mené son équipe à la victoire l'an dernier."],
 ["Prices have ___ since the new tax was introduced. (fall)",["fallen","fell","falled","falling"],"Les prix ont baissé depuis l'introduction de la nouvelle taxe."],
 ["She has ___ a great deal of money on advertising. (spend)",["spent","spended","spend","spends"],"Elle a dépensé beaucoup d'argent en publicité."],
 ["The CEO has ___ the company since 2010. (run)",["run","ran","runned","runs"],"Le PDG dirige l'entreprise depuis 2010."]
]);

add('f',[
 ["The company has a strong reputation for ___ in customer service.",["excellence","excel","excellent","excellently"],"L'entreprise a une solide réputation d'excellence dans le service client."],
 ["Several ___ were interviewed for the engineering position.",["candidates","candidacy","candidate","candidature"],"Plusieurs candidats ont été reçus en entretien pour le poste d'ingénieur."],
 ["The ___ fee is non-refundable.",["registration","register","registering","registered"],"Les frais d'inscription ne sont pas remboursables."],
 ["She was ___ promoted after only two years.",["rapidly","rapid","rapidity","rapids"],"Elle a été rapidement promue après seulement deux ans."],
 ["The report offers a ___ analysis of market trends.",["comprehensive","comprehend","comprehension","comprehensively"],"Le rapport propose une analyse complète des tendances du marché."],
 ["We would like to ___ for the delay.",["apologise","apology","apologetic","apologetically"],"Nous tenons à nous excuser pour le retard."],
 ["Employees are expected to show greater ___ to meeting deadlines.",["commitment","commit","committed","committee"],"On attend des employés un plus grand engagement à respecter les délais."],
 ["The ___ of the factory was announced yesterday.",["closure","close","closed","closely"],"La fermeture de l'usine a été annoncée hier."],
 ["The consultant gave a ___ presentation on cost reduction.",["persuasive","persuade","persuasion","persuasively"],"Le consultant a fait une présentation convaincante sur la réduction des coûts."],
 ["Her ___ to the project was essential to its success.",["contribution","contribute","contributor","contributing"],"Sa contribution au projet a été essentielle à sa réussite."],
 ["It is ___ to leave valuables in the hotel room.",["inadvisable","advise","advisor","advice"],"Il est déconseillé de laisser des objets de valeur dans la chambre d'hôtel."],
 ["Management was ___ about the results of the audit.",["concerned","concern","concerning","concernedly"],"La direction était inquiète des résultats de l'audit."]
]);

add('p',[
 ["The new policy will come ___ effect on 1 January.",["into","in","on","at"],"La nouvelle politique entrera en vigueur le 1er janvier."],
 ["She is responsible ___ the maintenance of all machines.",["for","of","to","with"],"Elle est responsable de la maintenance de toutes les machines."],
 ["We are currently ___ negotiations with a Japanese supplier.",["in","at","on","by"],"Nous sommes actuellement en négociation avec un fournisseur japonais."],
 ["The company was fined ___ breaking safety regulations.",["for","by","with","about"],"L'entreprise a été condamnée à une amende pour avoir enfreint les règles de sécurité."],
 ["He has worked here ___ ten years.",["for","since","during","from"],"Il travaille ici depuis dix ans."],
 ["Applicants must be ___ least eighteen years old.",["at","in","on","by"],"Les candidats doivent avoir au moins dix-huit ans."],
 ["The price is ___ to change without notice.",["subject","depending","according","owing"],"Le prix peut être modifié sans préavis."],
 ["I would like to apply ___ the post of marketing assistant.",["for","to","at","in"],"Je souhaite postuler au poste d'assistant marketing."],
 ["The new model differs ___ the old one in several respects.",["from","than","by","of"],"Le nouveau modèle diffère de l'ancien à plusieurs égards."],
 ["The ambulance arrived just ___ time to save him.",["in","on","at","by"],"L'ambulance est arrivée juste à temps pour le sauver."],
 ["He insisted ___ paying for the lunch.",["on","for","to","about"],"Il a insisté pour payer le déjeuner."],
 ["Customers can pay ___ credit card or in cash.",["by","in","on","at"],"Les clients peuvent payer par carte bancaire ou en espèces."]
]);

add('l',[
 ["The company aims to ___ a profit in its first year.",["make","do","take","give"],"L'entreprise vise à réaliser un bénéfice dès sa première année."],
 ["The two firms finally ___ an agreement.",["reached","did","held","raised"],"Les deux entreprises sont finalement parvenues à un accord."],
 ["The minister was asked to ___ a statement on the incident.",["make","do","speak","tell"],"On a demandé au ministre de faire une déclaration sur l'incident."],
 ["Employees must ___ the safety rules at all times.",["comply with","obey to","respect with","follow to"],"Les employés doivent respecter les règles de sécurité en permanence."],
 ["The government plans to ___ taxes on fuel.",["raise","rise","grow","lean"],"Le gouvernement prévoit d'augmenter les taxes sur le carburant."],
 ["The firm has ___ a loss for the third year in a row.",["recorded","done","caught","held"],"L'entreprise a enregistré une perte pour la troisième année consécutive."],
 ["We must ___ a balance between cost and quality.",["strike","throw","meet","cast"],"Nous devons trouver un équilibre entre coût et qualité."],
 ["There was ___ traffic on the motorway this morning.",["heavy","strong","thick","large"],"Il y avait beaucoup de circulation sur l'autoroute ce matin."],
 ["Customers can ___ advantage of a ten per cent discount until Friday.",["take","make","do","get"],"Les clients peuvent profiter d'une remise de dix pour cent jusqu'à vendredi."]
]);

add('s',[
 ["The firm will *terminate* the contract at the end of the month. Closest meaning:",["end","extend","sign","renew"],"L'entreprise mettra fin au contrat à la fin du mois."],
 ["The manager asked us to *submit* our reports by noon. Closest meaning:",["hand in","write","print","correct"],"Le directeur nous a demandé de remettre nos rapports avant midi."],
 ["Sales have *declined* over the past six months. Closest meaning:",["decreased","stabilised","recovered","expanded"],"Les ventes ont diminué au cours des six derniers mois."],
 ["The new system is expected to *enhance* productivity. Closest meaning:",["improve","reduce","measure","replace"],"Le nouveau système devrait améliorer la productivité."],
 ["The supplier failed to *comply with* the safety standards. Closest meaning:",["meet","review","propose","define"],"Le fournisseur n'a pas respecté les normes de sécurité."],
 ["Several employees *objected to* the new schedule. Closest meaning:",["opposed","agreed with","were unaware of","benefited from"],"Plusieurs employés se sont opposés au nouveau planning."],
 ["The consultant gave a *brief* summary of the findings. Closest meaning:",["short","detailed","vague","formal"],"Le consultant a présenté un bref résumé des conclusions."],
 ["We need to *settle* the invoice before the end of the month. Closest meaning:",["pay","cancel","check","issue"],"Nous devons régler la facture avant la fin du mois."],
 ["The CEO *dismissed* the proposal as unrealistic. Closest meaning:",["rejected","accepted","postponed","amended"],"Le PDG a écarté la proposition en la jugeant irréaliste."],
 ["The warehouse is *adjacent to* the main office. Closest meaning:",["next to","far from","inside","owned by"],"L'entrepôt est contigu aux bureaux principaux."],
 ["The company *anticipates* a rise in demand. Closest meaning:",["expects","denies","regrets","requests"],"L'entreprise s'attend à une hausse de la demande."],
 ["The *current* manager will retire in June. Closest meaning:",["present","former","next","temporary"],"Le directeur actuel prendra sa retraite en juin."]
]);

add('x',[
 ["We had to ___ the meeting because the director was ill.",["put off","put up","put on","put out"],"Nous avons dû reporter la réunion parce que le directeur était malade."],
 ["The company plans to ___ a new product line next spring.",["bring out","bring about","bring down","bring along"],"L'entreprise prévoit de lancer une nouvelle gamme de produits au printemps prochain."],
 ["Could you ___ the figures again before the presentation?",["go over","go off","go out","go down"],"Pourriez-vous revérifier les chiffres avant la présentation ?"],
 ["She will ___ the project while the manager is on leave.",["take over","take off","take in","take up"],"Elle reprendra le projet pendant le congé du directeur."],
 ["The negotiations fell ___ after the two sides failed to agree on prices.",["through","behind","down","away"],"Les négociations ont échoué après que les deux parties ne se sont pas entendues sur les prix."],
 ["We have ___ of paper, so please order some more.",["run out","run off","run over","run into"],"Nous n'avons plus de papier, veuillez en commander."],
 ["The technician will ___ the problem tomorrow.",["sort out","sort in","sort on","sort up"],"Le technicien réglera le problème demain."],
 ["He decided to ___ his job and start his own business.",["give up","give out","give off","give over"],"Il a décidé de quitter son emploi et de créer sa propre entreprise."],
 ["We need to ___ a plan before the next meeting.",["draw up","draw out","draw in","draw off"],"Il nous faut élaborer un plan avant la prochaine réunion."],
 ["I will ___ you at the station at six.",["pick up","pick on","pick at","pick over"],"Je passerai vous prendre à la gare à six heures."],
 ["The company is ___ staff because of falling sales.",["laying off","laying out","laying down","laying on"],"L'entreprise licencie du personnel en raison de la baisse des ventes."]
]);

add('t',[
 ["Il a dû annuler son voyage. => He ___ cancel his trip.",["had to","must","should","ought"],"Il a dû annuler son voyage."],
 ["Cela fait deux ans que nous travaillons ensemble. => We ___ together for two years.",["have worked","work","are working","will have worked"],"Cela fait deux ans que nous travaillons ensemble."],
 ["Je regrette de ne pas avoir posé la question. => I regret ___ the question.",["not asking","not to ask","to not ask","no asking"],"Je regrette de ne pas avoir posé la question."],
 ["Il est trop tard pour changer d'avis. => It is ___ late to change your mind.",["too","very","so","enough"],"Il est trop tard pour changer d'avis."],
 ["Elle m'a demandé si je pouvais l'aider. => She asked me ___ I could help her.",["if","that","what","which"],"Elle m'a demandé si je pouvais l'aider."],
 ["Si j'avais su, je serais venu. => If I ___, I would have come.",["had known","would know","knew","have known"],"Si j'avais su, je serais venu."],
 ["Il est essentiel que vous signiez ce document. => It is essential that you ___ this document.",["sign","signs","will sign","signed"],"Il est essentiel que vous signiez ce document."],
 ["J'ai l'habitude de me lever tôt. => I am ___ to getting up early.",["used","use","using","accustom"],"J'ai l'habitude de me lever tôt."],
 ["Il y a moins de clients qu'avant. => There are ___ customers than before.",["fewer","less","lesser","least"],"Il y a moins de clients qu'avant."],
 ["Il a démissionné il y a trois mois. => He resigned three months ___.",["ago","before","since","for"],"Il a démissionné il y a trois mois."],
 ["Je préférerais que tu ne dises rien. => I would rather you ___ anything.",["didn't say","don't say","won't say","wouldn't say"],"Je préférerais que tu ne dises rien."],
 ["Il ne sert à rien de se plaindre. => There is no point ___.",["in complaining","to complain","for complaining","of complaining"],"Il ne sert à rien de se plaindre."],
 ["J'ai passé la matinée à répondre à des courriels. => I spent the morning ___ to emails.",["replying","reply","to reply","replied"],"J'ai passé la matinée à répondre à des courriels."]
]);

[
 ["tenant","locataire"],["lease","bail"],["merger","fusion"],["shortage","pénurie"],["headquarters","siège social"],
 ["turnover","chiffre d'affaires"],["retailer","détaillant"],["wholesale","vente en gros"],["shareholder","actionnaire"],
 ["inventory","inventaire, stock"],["negotiate","négocier"],["premises","locaux"],["brochure","brochure"],["delegate","délégué"],
 ["candidate","candidat"],["commute","trajet domicile-travail"],["payroll","paie, masse salariale"],["quotation","devis"],
 ["tariff","tarif, droit de douane"],["surplus","excédent"],["mortgage","prêt immobilier"],["freight","fret"],["customs","douane"],
 ["forecast","prévision"],["workforce","main-d'œuvre"],["outsource","externaliser"],["breakdown","panne"],["bankrupt","en faillite"]
].forEach(function(a){NORMAL.push({t:'w',w:a[0],fr:a[1]})});

add('c',[
 ["The project will go ahead ___ we secure additional funding.",["provided that","whereas","lest","albeit"],"Le projet ira de l'avant à condition que nous obtenions un financement supplémentaire."],
 ["He lowered his voice ___ he should disturb his colleagues.",["lest","unless","whereas","albeit"],"Il a baissé la voix de peur de déranger ses collègues."],
 ["___ as it may seem, the figures are accurate.",["Incredible","Although","Despite","Whereas"],"Aussi incroyable que cela puisse paraître, les chiffres sont exacts."]
],HARD);
add('f',[["There was a ___ increase in raw material costs.",["marked","mark","marking","markedly"],"Il y a eu une hausse marquée du coût des matières premières."]],HARD);
add('p',[
 ["The merger is ___ to approval by the regulator.",["subject","due","prone","related"],"La fusion est soumise à l'approbation de l'autorité de régulation."],
 ["He was dismissed ___ grounds of misconduct.",["on","by","under","at"],"Il a été licencié pour faute."]
],HARD);
add('s',[
 ["The *dwindling* supply of skilled workers worries employers. Closest meaning:",["decreasing","growing","unstable","expensive"],"La diminution de la main-d'œuvre qualifiée inquiète les employeurs."],
 ["The firm's *prudent* approach protected it from heavy losses. Closest meaning:",["cautious","reckless","modest","quick"],"L'approche prudente de l'entreprise l'a protégée de lourdes pertes."]
],HARD);
add('x',[["The board ___ the proposal despite strong opposition.",["pushed through","pushed over","pushed off","pushed up"],"Le conseil a fait adopter la proposition malgré une forte opposition."]],HARD);
add('t',[
 ["À peine avait-il fini de parler que le téléphone sonna. => Hardly ___ finished speaking when the phone rang.",["had he","he had","did he","has he"],"À peine avait-il fini de parler que le téléphone sonna."],
 ["Ce n'est que lundi que nous avons reçu la réponse. => Not until Monday ___ the reply.",["did we receive","we received","we did receive","had we received"],"Ce n'est que lundi que nous avons reçu la réponse."]
],HARD);
add('v',[
 ["The river had ___ its banks before the flood barrier was closed. (burst)",["burst","bursted","bursten","bursts"],"Le fleuve avait débordé avant la fermeture de la barrière anti-crue."],
 ["The bell has ___ three times already. (ring)",["rung","rang","ringed","rings"],"La cloche a déjà sonné trois fois."]
],HARD);
})();


/* ---------- Spot the wrong segment (v5) : B2+ TOEIC / engineering ---------- */
(function(){
[
 [["The committee has","announced that","the new regulations","will came into effect in May."],3,"will come into effect in May.","After a modal verb, use the base form: 'will come'.","Le comité a annoncé que la nouvelle réglementation entrerait en vigueur en mai."],
 [["Despite of","the heavy rain,","the outdoor event","went ahead as planned."],0,"Despite","'Despite' is never followed by 'of'; 'in spite of' is the alternative.","Malgré la forte pluie, l'événement en plein air a eu lieu comme prévu."],
 [["Each of","the engineers","have submitted","a detailed report."],2,"has submitted","'Each of' takes a singular verb.","Chacun des ingénieurs a remis un rapport détaillé."],
 [["The number of","applicants have","increased steadily","over the past decade."],1,"applicants has","'The number of' takes a singular verb.","Le nombre de candidats augmente régulièrement depuis dix ans."],
 [["If the supplier","would deliver","on time, we","would avoid these delays."],1,"delivered","In a second conditional, the if-clause takes the past simple, not 'would'.","Si le fournisseur livrait à temps, nous éviterions ces retards."],
 [["She suggested","to postpone","the launch until","the following quarter."],1,"postponing","'Suggest' is followed by an -ing form (or a that-clause), not an infinitive.","Elle a proposé de reporter le lancement au trimestre suivant."],
 [["We are looking","forward to hear","from you","as soon as possible."],1,"forward to hearing","In 'look forward to', 'to' is a preposition, so it takes an -ing form.","Nous attendons de vos nouvelles dès que possible."],
 [["Neither the manager","nor his assistants","was available","to answer questions."],2,"were available","With 'neither ... nor', the verb agrees with the nearest subject ('assistants').","Ni le directeur ni ses assistants n'étaient disponibles pour répondre aux questions."],
 [["I would rather","you not to","mention this","to the client."],1,"you didn't","'Would rather' + a different subject takes the past simple.","Je préférerais que vous n'en parliez pas au client."],
 [["The bridge was","built in 1998","and it is","still using today."],3,"still in use today.","'Still using' is not passive; use 'still in use' or 'still being used'.","Le pont a été construit en 1998 et il est toujours utilisé aujourd'hui."],
 [["Had we known","about the delay,","we would informed","our customers earlier."],2,"we would have informed","The third conditional needs 'would have' + past participle.","Si nous avions su pour le retard, nous aurions prévenu nos clients plus tôt."],
 [["Our company has","been operating","since twenty years","in the energy sector."],2,"for twenty years","Use 'for' with a duration and 'since' with a starting point.","Notre entreprise opère dans le secteur de l'énergie depuis vingt ans."],
 [["The new employees","are expected","to attending","the training session."],2,"to attend","'Expected to' is followed by the base form.","On attend des nouveaux employés qu'ils assistent à la session de formation."],
 [["There is","a lot of","informations about","the product online."],2,"information about","'Information' is uncountable and has no plural.","Il y a beaucoup d'informations sur le produit en ligne."],
 [["Fewer people","attended the seminar","than we had","expect."],3,"expected.","After 'had', use the past participle.","Moins de gens ont assisté au séminaire que nous l'avions prévu."],
 [["I am not used","to work","on weekends,","so I am tired."],1,"to working","'Be used to' is followed by an -ing form.","Je n'ai pas l'habitude de travailler le week-end, donc je suis fatigué."],
 [["The more","we invest in","research, the most","we will gain."],2,"research, the more","'The more ..., the more ...' uses the same comparative form twice.","Plus nous investissons dans la recherche, plus nous gagnerons."],
 [["Unless you will","sign the contract,","we cannot begin","the work."],0,"Unless you","After 'unless', use the present simple, not 'will'.","À moins que vous ne signiez le contrat, nous ne pouvons pas commencer les travaux."],
 [["As soon as","the results will be","available, we","will contact you."],1,"the results are","After 'as soon as', use the present simple for a future meaning.","Dès que les résultats seront disponibles, nous vous contacterons."],
 [["The CEO made","a speech in","which she","emphasised on the need for change."],3,"emphasised the need for change.","'Emphasise' is transitive and takes no preposition.","La PDG a fait un discours dans lequel elle a insisté sur la nécessité du changement."],
 [["We discussed","about the budget","during the","board meeting."],1,"the budget","'Discuss' is transitive and takes no preposition.","Nous avons discuté du budget lors de la réunion du conseil."],
 [["He is one of","the most experienced","engineer in","the department."],2,"engineers in","After 'one of the', use a plural noun.","C'est l'un des ingénieurs les plus expérimentés du service."],
 [["The goods were","delivered damaged","owing to the","carrier's negligent."],3,"carrier's negligence.","After a possessive, use the noun 'negligence', not the adjective.","Les marchandises ont été livrées endommagées en raison de la négligence du transporteur."],
 [["Not only","the system is","faster, but it is","also more reliable."],1,"is the system","After 'Not only' at the start of a clause, the subject and auxiliary are inverted.","Non seulement le système est plus rapide, mais il est aussi plus fiable."],
 [["I look forward","to meet you","at the conference","next week."],1,"to meeting you","'Look forward to' takes an -ing form.","J'ai hâte de vous rencontrer à la conférence la semaine prochaine."],
 [["The factory","employs more than","two hundreds","people."],2,"two hundred","'Hundred' stays singular after a number.","L'usine emploie plus de deux cents personnes."],
 [["By the time","we arrived,","the presentation","already started."],3,"had already started.","Use the past perfect for an action completed before another past action.","Quand nous sommes arrivés, la présentation avait déjà commencé."],
 [["She is","responsible of","the maintenance","of the equipment."],1,"responsible for","'Responsible' is followed by 'for'.","Elle est responsable de la maintenance de l'équipement."],
 [["The staff were","given a bonus","as a recognition","of their efforts."],2,"in recognition","The fixed phrase is 'in recognition of'.","Le personnel a reçu une prime en reconnaissance de ses efforts."],
 [["It is essential","that every employee","wears a helmet","on the site."],2,"wear a helmet","After 'It is essential that', use the base form (subjunctive).","Il est essentiel que chaque employé porte un casque sur le chantier."],
 [["Prices have","raised by","five percent","since January."],1,"risen by","'Rise' is intransitive; 'raise' needs an object.","Les prix ont augmenté de cinq pour cent depuis janvier."],
 [["Thanks to","the new software,","we can complete","the task more quick."],3,"the task more quickly.","Use an adverb to modify the verb 'complete'.","Grâce au nouveau logiciel, nous pouvons terminer la tâche plus rapidement."],
 [["Every employee","must to wear","an identity badge","at all times."],1,"must wear","After a modal verb, the base form is used without 'to'.","Chaque employé doit porter un badge d'identité en permanence."],
 [["The bank","refused to lend","us the money,","what surprised everyone."],3,"which surprised everyone.","'Which' refers to a whole clause; 'what' cannot be used here.","La banque a refusé de nous prêter l'argent, ce qui a surpris tout le monde."],
 [["I am interested","for joining","your engineering","team next year."],1,"in joining","'Interested' is followed by 'in'.","Je suis intéressé par l'idée de rejoindre votre équipe d'ingénieurs l'an prochain."],
 [["The system was","so complex that","nobody could not","understand it."],2,"nobody could","A double negative is incorrect: 'nobody could understand'.","Le système était si complexe que personne ne pouvait le comprendre."],
 [["The report","which was published","last week it","shows a decline."],2,"last week","The relative pronoun 'which' is already the subject, so 'it' is redundant.","Le rapport publié la semaine dernière montre un déclin."],
 [["We apologise","for the inconvenience","caused by","the delaying."],3,"the delay.","Use the noun 'delay', not the gerund.","Nous nous excusons pour la gêne occasionnée par le retard."],
 [["The warranty","covers the repair","of any defect","occurs within two years."],3,"that occurs within two years.","A relative pronoun is needed to link the clause to 'defect'.","La garantie couvre la réparation de tout défaut survenant dans les deux ans."],
 [["Employees who","works night shifts","receive an extra","allowance."],1,"work night shifts","The verb must agree with the plural subject 'Employees'.","Les employés qui travaillent de nuit reçoivent une prime supplémentaire."],
 [["She told me","that she has","finished the report","the day before."],1,"that she had","In reported speech, shift the present perfect to the past perfect.","Elle m'a dit qu'elle avait terminé le rapport la veille."],
 [["Both the design","and the price","is very","competitive."],2,"are very","A compound subject with 'both ... and' takes a plural verb.","Le design et le prix sont tous deux très compétitifs."],
 [["This model is","much more expensive","than the","others ones."],3,"other ones.","Do not use 'ones' after 'others'; use 'the others' or 'the other ones'.","Ce modèle est beaucoup plus cher que les autres."],
 [["We would like","to thank you","for your","cooperating."],3,"cooperation.","After 'your', use a noun.","Nous tenons à vous remercier pour votre coopération."],
 [["He denied","to have taken","the confidential","documents."],1,"having taken","'Deny' is followed by an -ing form.","Il a nié avoir pris les documents confidentiels."],
 [["The lecture was","so boring that","most students","felt asleep."],3,"fell asleep.","The past simple of 'fall' is 'fell'.","Le cours était si ennuyeux que la plupart des étudiants se sont endormis."],
 [["Please remind","me sending","the invoice","before Friday."],1,"me to send","'Remind' is followed by an object and a to-infinitive.","Veuillez me rappeler d'envoyer la facture avant vendredi."],
 [["The workers have","been on strike","since three","weeks."],2,"for three","Use 'for' with a duration.","Les ouvriers sont en grève depuis trois semaines."],
 [["A large amount","of customers","complained about","the delay."],0,"A large number","'Customers' is countable, so 'number' is needed, not 'amount'.","Un grand nombre de clients se sont plaints du retard."],
 [["The architect","explained us","how the structure","would be reinforced."],1,"explained to us","'Explain' needs 'to' before the person.","L'architecte nous a expliqué comment la structure serait renforcée."],
 [["Hardly","we had left","the building when","the alarm went off."],1,"had we left","After 'Hardly' at the start, the auxiliary comes before the subject.","À peine avions-nous quitté le bâtiment que l'alarme s'est déclenchée."],
 [["I wish","I would have","more time to","finish the project."],1,"I had","After 'wish', use the past simple for a present regret.","J'aimerais avoir plus de temps pour terminer le projet."],
 [["The cost of","living in big cities","are rising","faster than wages."],2,"is rising","The subject is 'cost', which is singular.","Le coût de la vie dans les grandes villes augmente plus vite que les salaires."],
 [["The technician","checked everything","carefully, so there","isn't no problem."],3,"isn't any problem.","Avoid the double negative: use 'any' after a negative verb.","Le technicien a tout vérifié avec soin, donc il n'y a aucun problème."],
 [["Applicants must","submit their CVs","until the end","of the month."],2,"by the end","'By' marks a deadline; 'until' marks the end of a continuing situation.","Les candidats doivent remettre leur CV d'ici la fin du mois."],
 [["I'd like to","make an appointment","with Dr Martin","at the next Tuesday."],3,"on Tuesday.","Use 'on' with days; do not add 'the next' with a preposition.","Je voudrais prendre rendez-vous avec le docteur Martin mardi prochain."]
].forEach(function(a){NORMAL.push({t:'e',s:a[0].join(' '),segs:a[0],k:a[1],fix:a[2],why:a[3],fr:a[4],o:['A','B','C','D']})});
})();

window.WB_BANK={NORMAL:NORMAL,HARD:HARD,CATS:CATS,MODE_LABEL:MODE_LABEL};
})();

/* ============================================================
   Enquête clinique — les cas
   Contenu à faire valider par les enseignantes de L'Envol.

   Patients et situations FICTIFS, à but pédagogique (PAB et SASI).
   Structure d'un cas :
     id, titre (ne dévoile pas la réponse), programme ("pab" | "sasi" | "les deux"),
     duree (estimation), patient { nom, age, milieu }, ouverture,
     hypotheses [4] { texte, bonne } — une seule bonne,
     etapes [4 à 6] { indice { type, texte }, question, choix [3-4] { texte, bonne }, suite, explication },
     denouement { titre, texte, aRetenir [3] }.
   Types d'indice : "signes" 🩺, "parole" 💬, "observation" 👀, "resultat" 🧪, "dossier" 📋.
   L'ordre des choix n'a pas d'importance : l'écran projeté les mélange à chaque partie.
   ============================================================ */

var ENQUETES = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: "delirium-iu",
    titre: "Mme Lavoie n'est pas comme d'habitude",
    programme: "les deux",
    duree: "15 min",
    patient: { nom: "Mme Huguette Lavoie", age: 84, milieu: "CHSLD, unité de soins de longue durée" },
    ouverture: "D'habitude, Mme Lavoie est souriante, orientée et ne manque jamais sa partie de cartes. Ce matin, elle est agitée, tire sur sa jaquette et cherche « ses enfants qui reviennent de l'école ». Hier soir, elle allait très bien.",
    hypotheses: [
      { texte: "Aggravation de sa maladie d'Alzheimer", bonne: false },
      { texte: "Accident vasculaire cérébral (AVC)", bonne: false },
      { texte: "Délirium causé par une infection urinaire", bonne: true },
      { texte: "Effet d'un nouveau médicament", bonne: false },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Elle n'arrive pas à suivre la conversation, perd le fil de ses phrases et s'endort par moments. Au téléphone, sa fille dit : « Ce n'est pas elle, ça. Elle a toute sa tête d'habitude. »" },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Mettre ça sur le compte de l'âge et poursuivre la routine du matin", bonne: false },
          { texte: "Noter le changement et en aviser l'infirmière sans attendre", bonne: true },
          { texte: "L'attacher au fauteuil avec une ceinture pour éviter qu'elle se blesse", bonne: false },
          { texte: "Attendre la fin de la sieste pour voir si elle va mieux", bonne: false },
        ],
        suite: "L'infirmière vient l'évaluer et vous demande de prendre ses signes vitaux.",
        explication: "Un changement soudain de l'état mental (en quelques heures ou quelques jours) n'est jamais « normal » chez une personne âgée : c'est un signal d'alarme. Votre rôle : observer, décrire précisément et rapporter vite. La contention est une mesure de dernier recours, décidée et encadrée par l'équipe, jamais improvisée.",
      },
      {
        indice: { type: "signes", texte: "Température buccale 37,9 °C (habituellement 36,5 °C) · pouls 98/min · pression 118/70 · respiration 20/min · saturation 95 %." },
        question: "Que faites-vous de ces valeurs ?",
        choix: [
          { texte: "Rien de spécial : elles restent presque toutes dans les normes pour son âge", bonne: false },
          { texte: "Les reprendre seulement demain matin", bonne: false },
          { texte: "Les transmettre à l'infirmière : la température et le pouls ont monté", bonne: true },
          { texte: "Lui donner de l'acétaminophène de votre propre initiative", bonne: false },
        ],
        suite: "L'infirmière note la hausse et poursuit son évaluation.",
        explication: "Chez la personne âgée, la fièvre est souvent discrète : on compare aux valeurs habituelles de la personne, pas seulement aux normes. La décision de donner un médicament revient à l'équipe infirmière, selon l'ordonnance.",
      },
      {
        indice: { type: "observation", texte: "Pendant les soins d'hygiène : urine foncée, odeur forte, petites fuites qu'elle n'avait pas avant. Elle grimace et dit que « ça chauffe » quand elle urine." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Limiter ses boissons pour diminuer les fuites", bonne: false },
          { texte: "Rapporter à l'infirmière la couleur, l'odeur, les fuites et la brûlure", bonne: true },
          { texte: "Lui mettre une culotte d'incontinence sans en parler : c'est fréquent à son âge", bonne: false },
        ],
        suite: "L'infirmière recueille un échantillon d'urine pour analyse et culture et appelle le médecin.",
        explication: "Brûlure, urine trouble ou malodorante et incontinence nouvelle orientent vers une infection urinaire. Réduire les liquides aggraverait la situation (déshydratation). Vos observations précises aident l'infirmière à faire le lien.",
      },
      {
        indice: { type: "resultat", texte: "L'analyse d'urine montre des bactéries et des globules blancs. Le médecin prescrit un antibiotique. La nuit suivante, Mme Lavoie est encore confuse et essaie de se lever seule." },
        question: "Comment assurer sa sécurité cette nuit ?",
        choix: [
          { texte: "Lever les quatre ridelles du lit pour l'empêcher de sortir", bonne: false },
          { texte: "Lui répéter fermement qu'elle se trompe chaque fois qu'elle parle de ses enfants", bonne: false },
          { texte: "Lit en position basse, cloche à portée, veilleuse, visites fréquentes", bonne: true },
          { texte: "Fermer sa porte pour qu'elle dorme sans être dérangée", bonne: false },
        ],
        suite: "Mme Lavoie se lève une fois, mais la préposée l'entend et l'accompagne à la toilette. Aucune chute.",
        explication: "En délirium, le risque de chute est élevé. Les ridelles relevées sont une forme de contention : la personne risque de les enjamber et de tomber de plus haut. On mise sur un environnement sécuritaire, des repères (horloge, lunettes, appareil auditif) et une approche calme, sans confrontation.",
      },
      {
        indice: { type: "parole", texte: "Deux jours plus tard, sa fille : « Elle m'a reconnue ce matin ! Mais le soir, elle dit encore des choses bizarres. Est-ce que c'est l'Alzheimer qui commence ? »" },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Lui confirmer que c'est sûrement le début d'une démence, fréquente à son âge avancé", bonne: false },
          { texte: "L'inviter à en parler avec l'infirmière et continuer d'observer son état le soir", bonne: true },
          { texte: "Cesser de rapporter : l'antibiotique fait effet", bonne: false },
          { texte: "Lui suggérer d'espacer ses visites pour ne pas fatiguer sa mère", bonne: false },
        ],
        suite: "L'infirmière rencontre la fille et lui explique ce qu'est un délirium. La fille revient chaque soir avec des photos de famille.",
        explication: "Le délirium peut prendre des jours, parfois des semaines, à se résorber, et il fluctue souvent en soirée. On ne pose pas de diagnostic : on oriente vers l'infirmière. La présence de la famille et les repères familiers aident la personne à se réorienter.",
      },
    ],
    denouement: {
      titre: "Délirium causé par une infection urinaire",
      texte: "Mme Lavoie faisait un délirium : une confusion soudaine et fluctuante, déclenchée ici par une infection urinaire. Grâce au signalement rapide, l'infection a été traitée et, en une semaine, elle a retrouvé ses parties de cartes.",
      aRetenir: [
        "Un changement soudain du comportement ou de l'état mental chez une personne âgée est un signal d'alarme : on le rapporte tout de suite.",
        "Chez la personne âgée, une infection se manifeste souvent par de la confusion plutôt que par une forte fièvre.",
        "En délirium : sécurité (risque de chute), repères familiers, approche calme — pas de confrontation ni de contention improvisée.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: "c-difficile",
    titre: "Une semaine difficile pour M. Bouchard",
    programme: "les deux",
    duree: "15 min",
    patient: { nom: "M. Gérard Bouchard", age: 77, milieu: "Centre hospitalier, unité de médecine" },
    ouverture: "M. Bouchard est hospitalisé depuis 10 jours pour une pneumonie, traitée par antibiotiques. Depuis hier soir, il a plusieurs selles liquides. Il est gêné et s'excuse sans arrêt d'« en faire autant ».",
    hypotheses: [
      { texte: "Gastro-entérite virale attrapée d'un visiteur", bonne: false },
      { texte: "Effet secondaire banal de l'antibiotique", bonne: false },
      { texte: "Intolérance à un aliment du menu", bonne: false },
      { texte: "Infection à C. difficile", bonne: true },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Depuis 6 h ce matin : 4 selles liquides, à l'odeur très forte et particulière. Il a des crampes au ventre." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Noter le nombre et l'aspect des selles et aviser l'infirmière rapidement", bonne: true },
          { texte: "Lui offrir le comprimé contre la diarrhée qu'il garde dans sa table de chevet", bonne: false },
          { texte: "Attendre la fin des antibiotiques : la diarrhée va passer d'elle-même", bonne: false },
          { texte: "Lui conseiller de boire moins pour réduire les selles", bonne: false },
        ],
        suite: "L'infirmière fait envoyer un échantillon de selles au laboratoire.",
        explication: "Trois selles liquides ou plus en 24 heures chez une personne sous antibiotiques ou hospitalisée font soupçonner le C. difficile. Un antidiarrhéique peut aggraver l'infection en gardant les toxines dans l'intestin : aucun médicament sans ordonnance.",
      },
      {
        indice: { type: "dossier", texte: "En attendant le résultat, l'infirmière fait installer à la porte une affiche de précautions additionnelles « contact renforcé »." },
        question: "Avant d'entrer pour l'aider à se laver, que mettez-vous ?",
        choix: [
          { texte: "Un masque N95", bonne: false },
          { texte: "Une blouse et des gants, après l'hygiène des mains", bonne: true },
          { texte: "Des gants seulement, la blouse ne sert qu'en cas d'éclaboussure", bonne: false },
        ],
        suite: "Vous utilisez aussi le thermomètre et le brassard laissés dans la chambre, réservés à M. Bouchard.",
        explication: "En précautions contact : blouse et gants dès l'entrée dans la chambre, matériel dédié au patient, et retrait de l'ÉPI avant de sortir. Le C. difficile ne se transmet pas par l'air : le N95 n'est pas indiqué.",
      },
      {
        indice: { type: "observation", texte: "Les soins sont terminés. Vous retirez blouse et gants. Il y a un distributeur de solution hydroalcoolique à la porte, et un lavabo dans la chambre." },
        question: "Comment faites-vous l'hygiène des mains ?",
        choix: [
          { texte: "Avec la solution hydroalcoolique : c'est plus rapide et tout aussi efficace", bonne: false },
          { texte: "Pas besoin : les gants protégeaient vos mains", bonne: false },
          { texte: "À l'eau et au savon, au lavabo", bonne: true },
          { texte: "En enfilant une deuxième paire de gants pour la suite de la tournée", bonne: false },
        ],
        suite: "Vous vous lavez les mains au moins 20 secondes, en frottant bien, puis vous les séchez.",
        explication: "Le C. difficile forme des spores qui résistent à l'alcool. C'est le frottement du lavage à l'eau et au savon qui les décroche et les élimine. Les gants ne remplacent jamais l'hygiène des mains.",
      },
      {
        indice: { type: "resultat", texte: "Résultat du laboratoire : toxine du C. difficile positive. Dans la chambre, la chaise d'aisance a été souillée." },
        question: "Comment s'occuper de la chaise d'aisance ?",
        choix: [
          { texte: "La rincer à l'eau chaude savonneuse et la ranger dans l'utilité commune", bonne: false },
          { texte: "La nettoyer, puis la désinfecter avec le produit sporicide prévu", bonne: true },
          { texte: "L'essuyer avec une lingette à l'alcool", bonne: false },
          { texte: "La prêter au voisin de chambre, qui n'a pas de diarrhée", bonne: false },
        ],
        suite: "La chaise d'aisance reste dans la chambre, réservée à M. Bouchard. L'équipe d'hygiène et salubrité désinfecte aussi la chambre chaque jour.",
        explication: "Les spores survivent des semaines sur les surfaces. Seul un produit sporicide (souvent à base de chlore) les détruit, et le matériel reste dédié au patient. L'alcool ne suffit pas.",
      },
      {
        indice: { type: "parole", texte: "Sa conjointe arrive en visite : « Je peux m'asseoir sur le lit et lui tenir la main ? C'est juste une diarrhée, voyons ! »" },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Lui interdire la visite tant que l'infection dure", bonne: false },
          { texte: "La laisser faire : les visiteurs ne sont pas concernés", bonne: false },
          { texte: "Lui expliquer les précautions à prendre et l'aider à les appliquer", bonne: true },
          { texte: "Lui dire que la maladie est très dangereuse et qu'elle va sûrement l'attraper", bonne: false },
        ],
        suite: "Elle met la blouse et les gants, tient la main de son mari, puis se lave les mains à l'eau et au savon en sortant.",
        explication: "Les visites restent possibles et sont importantes pour le patient. Le rôle de l'équipe : enseigner calmement les précautions, sans alarmer ni exclure.",
      },
    ],
    denouement: {
      titre: "Infection à C. difficile",
      texte: "Les antibiotiques avaient déséquilibré la flore de l'intestin de M. Bouchard, permettant au C. difficile de se multiplier et de produire des toxines. Il a reçu un traitement spécifique, et les précautions appliquées par l'équipe ont empêché l'infection de se propager dans l'unité.",
      aRetenir: [
        "Une diarrhée chez une personne sous antibiotiques ou hospitalisée se rapporte rapidement : c'est peut-être le C. difficile.",
        "Les spores résistent à l'alcool : hygiène des mains à l'eau et au savon, et désinfection au produit sporicide.",
        "Précautions contact : blouse et gants dès l'entrée, matériel dédié, enseignement aux visiteurs.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: "hypoglycemie",
    titre: "Mme Paquette s'impatiente avant le dîner",
    programme: "les deux",
    duree: "15 min",
    patient: { nom: "Mme Sylvie Paquette", age: 68, milieu: "CHSLD, unité de réadaptation" },
    ouverture: "Il est 11 h 20. Mme Paquette, diabétique traitée à l'insuline, attend le dîner au salon. Elle, d'habitude si patiente, devient irritable, tremble et a le front couvert de sueur.",
    hypotheses: [
      { texte: "Hyperglycémie (sucre trop haut)", bonne: false },
      { texte: "Hypoglycémie (sucre trop bas)", bonne: true },
      { texte: "Crise d'anxiété", bonne: false },
      { texte: "Début d'AVC", bonne: false },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Elle est pâle, en sueur, tremble des mains. Elle vous repousse : « Laissez-moi tranquille ! » Ses phrases sont un peu confuses." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "La laisser seule se calmer dans sa chambre", bonne: false },
          { texte: "Rester avec elle et faire venir l'infirmière immédiatement", bonne: true },
          { texte: "Lui proposer une douche tiède pour la rafraîchir et la calmer un peu", bonne: false },
          { texte: "Lui servir un café en attendant le dîner", bonne: false },
        ],
        suite: "L'infirmière auxiliaire arrive avec le glucomètre.",
        explication: "Tremblements, sueurs, pâleur, irritabilité et confusion chez une personne diabétique sous insuline : on pense d'abord à l'hypoglycémie. On ne la laisse jamais seule, car elle peut perdre connaissance.",
      },
      {
        indice: { type: "resultat", texte: "Glycémie capillaire : 3,1 mmol/L. Elle est consciente et avale bien." },
        question: "Selon le protocole d'hypoglycémie, que lui donne-t-on ?",
        choix: [
          { texte: "15 g de sucre rapide, par exemple 150 ml de jus", bonne: true },
          { texte: "Une collation de fromage et de noix, qui soutient plus longtemps", bonne: false },
          { texte: "Un grand verre d'eau", bonne: false },
          { texte: "Une dose supplémentaire d'insuline", bonne: false },
        ],
        suite: "Elle boit son jus. On note l'heure : on revérifiera dans 15 minutes.",
        explication: "Une glycémie sous 4 mmol/L se traite avec 15 g de glucides rapides (jus, comprimés de glucose, sucre dissous dans l'eau). Le fromage et les noix contiennent des gras et des protéines qui agissent trop lentement. L'insuline ferait encore baisser le sucre.",
      },
      {
        indice: { type: "resultat", texte: "15 minutes plus tard : glycémie à 3,6 mmol/L. Elle est encore moite." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Lui servir son dîner et ne plus vérifier", bonne: false },
          { texte: "Considérer que c'est réglé, puisque le sucre remonte", bonne: false },
          { texte: "Redonner 15 g de sucre rapide et revérifier 15 minutes après", bonne: true },
          { texte: "Lui donner trois verres de jus d'un coup pour être certain que ça remonte", bonne: false },
        ],
        suite: "Au contrôle suivant, sa glycémie est à 5,4 mmol/L. Elle sourit et s'excuse d'avoir été brusque.",
        explication: "C'est la « règle des 15 » : 15 g de sucre rapide, attendre 15 minutes, revérifier. Tant que la glycémie reste sous 4 mmol/L, on recommence. Trop de sucre d'un coup cause ensuite une hyperglycémie.",
      },
      {
        indice: { type: "dossier", texte: "Ce midi, le dîner est retardé : il ne sera servi que dans une heure et demie." },
        question: "Que faites-vous en attendant le dîner ?",
        choix: [
          { texte: "Ne rien lui donner, pour ne pas lui couper l'appétit", bonne: false },
          { texte: "Lui offrir une collation avec glucides et protéines, selon le plan", bonne: true },
          { texte: "Lui redonner du jus toutes les 15 minutes", bonne: false },
          { texte: "La coucher pour qu'elle récupère seule", bonne: false },
        ],
        suite: "Elle mange des craquelins et du fromage. Sa glycémie reste stable jusqu'au dîner.",
        explication: "Une fois la glycémie remontée, si le prochain repas est dans plus d'une heure, une collation (glucides et protéines) évite une nouvelle baisse.",
      },
      {
        indice: { type: "parole", texte: "Mme Paquette : « J'avais mal au cœur ce matin, j'ai juste pris deux bouchées de rôtie. Mais j'ai eu mon insuline comme d'habitude. »" },
        question: "Que transmettez-vous à l'infirmière ?",
        choix: [
          { texte: "Rien : l'épisode est terminé", bonne: false },
          { texte: "Qu'elle a presque sauté son déjeuner à cause de nausées, malgré l'insuline", bonne: true },
          { texte: "Qu'elle devrait sauter son insuline quand elle mange peu", bonne: false },
        ],
        suite: "L'infirmière documente l'épisode et avise le médecin, qui réévalue sa dose et cherche la cause des nausées.",
        explication: "Insuline + repas manqué = cause classique d'hypoglycémie. Les nausées sont aussi une information à rapporter. Ce n'est jamais à la personne ni à la préposée de modifier une dose d'insuline.",
      },
    ],
    denouement: {
      titre: "Hypoglycémie (sucre trop bas)",
      texte: "Mme Paquette avait reçu son insuline mais presque rien mangé à cause de nausées : sa glycémie a chuté avant le dîner. Reconnue rapidement et traitée selon la règle des 15, l'hypoglycémie s'est corrigée sans complication.",
      aRetenir: [
        "Signes d'hypoglycémie : tremblements, sueurs, pâleur, faim, irritabilité, confusion. On ne laisse jamais la personne seule.",
        "Règle des 15 : 15 g de sucre rapide, attendre 15 minutes, revérifier ; recommencer si c'est encore sous 4 mmol/L.",
        "Si la personne est inconsciente ou ne peut pas avaler : rien par la bouche, on appelle à l'aide immédiatement.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: "avc",
    titre: "La tasse de M. Côté",
    programme: "les deux",
    duree: "15 min",
    patient: { nom: "M. Réjean Côté", age: 72, milieu: "Domicile (soutien à domicile)" },
    ouverture: "9 h 40. Vous arrivez chez M. Côté pour l'aider à prendre sa douche. Sa conjointe vous dit qu'il allait bien au déjeuner, vers 8 h 30. Depuis quelques minutes, sa tasse de café lui a glissé de la main droite et il est assis, l'air perdu.",
    hypotheses: [
      { texte: "Hypoglycémie", bonne: false },
      { texte: "Fatigue après une très mauvaise nuit de sommeil", bonne: false },
      { texte: "Crise d'arthrite à la main", bonne: false },
      { texte: "Accident vasculaire cérébral (AVC)", bonne: true },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Quand il sourit, le coin droit de sa bouche tombe. Quand il lève les deux bras, le bras droit redescend." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Faire appeler le 911 immédiatement", bonne: true },
          { texte: "Faire sa douche comme prévu et en parler à votre retour au bureau", bonne: false },
          { texte: "Lui faire faire des exercices de la main pour la réchauffer", bonne: false },
          { texte: "Lui proposer de s'allonger pour faire une sieste et le revoir après", bonne: false },
        ],
        suite: "La conjointe compose le 911 pendant que vous restez avec M. Côté.",
        explication: "VITE : Visage affaissé, Incapacité de lever un bras, Trouble de la parole, Extrême urgence : on appelle le 911. Chaque minute compte : le cerveau perd des millions de neurones par minute sans circulation.",
      },
      {
        indice: { type: "parole", texte: "Il essaie de parler : « Ché… pas… ce qui… » Sa conjointe sort une aspirine et un verre d'eau : « Ça éclaircit le sang, ça va l'aider ! »" },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Le laisser prendre l'aspirine : c'est un bon réflexe", bonne: false },
          { texte: "Lui donner seulement un peu d'eau, il a la bouche sèche", bonne: false },
          { texte: "Ne rien lui donner par la bouche en attendant les ambulanciers", bonne: true },
          { texte: "Lui faire manger quelque chose de sucré, au cas où", bonne: false },
        ],
        suite: "La conjointe range l'aspirine. M. Côté reste assis, bien appuyé.",
        explication: "Un AVC peut paralyser la gorge : risque d'étouffement. De plus, certains AVC sont causés par un saignement : l'aspirine pourrait l'aggraver. Rien par la bouche tant que l'équipe médicale n'a pas évalué.",
      },
      {
        indice: { type: "dossier", texte: "La répartitrice du 911 pose des questions à la conjointe, qui vous tend le téléphone." },
        question: "Quelle information est la plus importante à donner ?",
        choix: [
          { texte: "Le nom de son médecin de famille", bonne: false },
          { texte: "Ce qu'il a mangé au déjeuner", bonne: false },
          { texte: "L'heure où il a été vu normal pour la dernière fois : 8 h 30", bonne: true },
          { texte: "Le numéro de sa carte d'assurance maladie et sa date de naissance", bonne: false },
        ],
        suite: "La répartitrice transmet l'heure aux ambulanciers, qui préviennent l'hôpital d'avance.",
        explication: "Les traitements qui débloquent l'artère (médicament ou intervention) ne sont possibles que dans un délai limité après le début des symptômes. L'heure du dernier moment « normal » est donc une information capitale.",
      },
      {
        indice: { type: "observation", texte: "En attendant l'ambulance, il devient somnolent et commence à baver du côté droit." },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Lui tapoter les joues et lui parler fort pour le garder bien réveillé", bonne: false },
          { texte: "L'installer couché sur le côté et surveiller sa respiration", bonne: true },
          { texte: "L'aider à marcher jusqu'à la porte pour gagner du temps", bonne: false },
          { texte: "Le laisser assis seul pendant que vous préparez son sac", bonne: false },
        ],
        suite: "Sur le côté, la salive s'écoule et il respire bien. Les ambulanciers arrivent à 9 h 52.",
        explication: "Couché sur le côté, une personne somnolente garde les voies respiratoires dégagées et risque moins d'avaler sa salive de travers. On ne la laisse jamais seule et on ne la fait pas marcher.",
      },
      {
        indice: { type: "parole", texte: "Les ambulanciers partent avec M. Côté. Sa conjointe, bouleversée : « Il va s'en remettre, hein ? »" },
        question: "Que faites-vous ensuite ?",
        choix: [
          { texte: "Lui promettre qu'il va se rétablir complètement", bonne: false },
          { texte: "Aviser votre responsable et noter ce que vous avez vu, avec les heures", bonne: true },
          { texte: "Partir à votre prochaine visite sans en parler : l'ambulance s'en occupe", bonne: false },
        ],
        suite: "Vous restez quelques minutes avec la conjointe, puis vous rédigez votre note avec les heures précises.",
        explication: "On ne fait pas de promesses qu'on ne peut pas tenir, mais on offre sa présence. Rapporter et documenter les faits observés (heures, signes, actions) fait partie du travail, même si la personne a été transportée.",
      },
    ],
    denouement: {
      titre: "Accident vasculaire cérébral (AVC)",
      texte: "Un caillot bloquait une artère du cerveau de M. Côté. Comme il est arrivé à l'hôpital à temps, avec une heure de début connue, il a reçu un traitement pour dissoudre le caillot. Après quelques semaines de réadaptation, il a retrouvé l'usage de sa main.",
      aRetenir: [
        "VITE : Visage, Incapacité (bras), Trouble de la parole, Extrême urgence : 911 sans attendre.",
        "Noter l'heure où la personne a été vue normale pour la dernière fois.",
        "Rien par la bouche, ne pas la laisser seule, la coucher sur le côté si elle devient somnolente.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 5 */
  {
    id: "deshydratation",
    titre: "Canicule au 3e étage",
    programme: "pab",
    duree: "12 min",
    patient: { nom: "Mme Thérèse Gauthier", age: 89, milieu: "CHSLD, chambre au 3e étage" },
    ouverture: "C'est la canicule : 31 °C dehors depuis trois jours, et il fait chaud sur l'unité. Mme Gauthier, qui mange seule d'habitude, laisse la moitié de ses repas et repousse souvent son verre d'eau : « J'ai pas soif. » Elle est plus somnolente que d'habitude.",
    hypotheses: [
      { texte: "Infection urinaire", bonne: false },
      { texte: "Dépression", bonne: false },
      { texte: "Déshydratation", bonne: true },
      { texte: "Effet d'un somnifère", bonne: false },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Ses lèvres et sa langue sont sèches, sa peau aussi. Elle met du temps à répondre à vos questions." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Attendre qu'elle demande à boire : elle sait quand elle a soif", bonne: false },
          { texte: "Lui appliquer de la crème hydratante : c'est un problème de peau", bonne: false },
          { texte: "Aviser l'infirmière et noter ce qu'elle boit et urine", bonne: true },
          { texte: "La laisser dormir : la chaleur fatigue tout le monde", bonne: false },
        ],
        suite: "L'infirmière demande un bilan des ingesta et des excreta (ce qui entre et ce qui sort) pour les prochaines 24 heures.",
        explication: "Avec l'âge, la sensation de soif diminue : une personne âgée peut se déshydrater sans jamais avoir soif. Bouche sèche et somnolence sont des signes à rapporter.",
      },
      {
        indice: { type: "observation", texte: "Au bilan de l'après-midi : seulement deux mictions depuis le matin, en petite quantité, d'urine foncée à l'odeur forte." },
        question: "Pour l'aider à boire davantage, quelle stratégie est la meilleure ?",
        choix: [
          { texte: "Lui offrir un litre d'eau d'un coup au dîner", bonne: false },
          { texte: "Offrir souvent de petites quantités de ce qu'elle aime", bonne: true },
          { texte: "La réveiller chaque heure la nuit pour la faire boire", bonne: false },
          { texte: "Lui servir surtout du café, puisque c'est ce qu'elle préfère boire", bonne: false },
        ],
        suite: "Mme Gauthier accepte un popsicle aux fraises et un demi-verre de jus de pomme. Vous notez chaque quantité au bilan.",
        explication: "De petites quantités souvent, avec des boissons et aliments qu'elle aime (les aliments riches en eau comptent aussi), fonctionnent mieux qu'un grand verre imposé. Le café n'est pas interdit, mais ne devrait pas être la seule source de liquide.",
      },
      {
        indice: { type: "signes", texte: "Pression 98/58 (habituellement 130/80) · pouls 104/min · température 37,6 °C. En se levant pour aller à la toilette, elle dit que « ça tourne »." },
        question: "Que faites-vous ?",
        choix: [
          { texte: "La rasseoir aussitôt, rester avec elle et faire venir l'infirmière", bonne: true },
          { texte: "La faire marcher un peu pour activer la circulation", bonne: false },
          { texte: "Reprendre sa pression demain matin", bonne: false },
          { texte: "Lui donner un jus et la laisser aller seule à la toilette, à son rythme", bonne: false },
        ],
        suite: "L'infirmière l'évalue et avise le médecin. Un soluté est installé pour quelques heures.",
        explication: "Pression basse, pouls rapide et étourdissements : la déshydratation devient importante et le risque de chute est élevé. On la sécurise d'abord, puis on fait évaluer.",
      },
      {
        indice: { type: "dossier", texte: "Plan de travail mis à jour par l'infirmière : « Offrir 150 ml de liquide chaque heure le jour, noter au bilan. Surveiller les signes liés à la chaleur. » Il fait 29 °C dans sa chambre." },
        question: "Que faites-vous pour la chaleur ?",
        choix: [
          { texte: "Vêtements légers, linges frais, salle climatisée", bonne: true },
          { texte: "La couvrir d'une couverture pour éviter les frissons", bonne: false },
          { texte: "Lui donner un bain d'eau glacée", bonne: false },
          { texte: "Ne rien changer : les personnes âgées ont toujours froid", bonne: false },
        ],
        suite: "Elle passe l'après-midi au salon climatisé, où elle boit mieux en compagnie des autres résidentes.",
        explication: "En canicule, on rafraîchit la personne doucement (vêtements légers, linges humides, endroit climatisé) et on lui offre à boire régulièrement. Un bain glacé causerait des frissons et un choc.",
      },
      {
        indice: { type: "parole", texte: "Sa fille, en visite : « Elle n'a jamais bu beaucoup, c'est son caractère. Ça ne sert à rien d'insister. »" },
        question: "Que lui répondez-vous ?",
        choix: [
          { texte: "Qu'elle a raison et qu'il n'y a rien à faire", bonne: false },
          { texte: "De lui apporter des boissons énergisantes, qu'elle boira peut-être plus volontiers", bonne: false },
          { texte: "Que la soif diminue avec l'âge ; l'inviter à lui offrir à boire", bonne: true },
        ],
        suite: "La fille apporte désormais la limonade maison que sa mère adore et la lui sert pendant ses visites.",
        explication: "La famille est une alliée précieuse. Expliquer simplement pourquoi on insiste (soif diminuée) aide à la mobiliser. Les boissons énergisantes, très caféinées, ne sont pas un bon choix.",
      },
    ],
    denouement: {
      titre: "Déshydratation",
      texte: "Avec la chaleur, un appétit diminué et une soif presque absente, Mme Gauthier s'est déshydratée. Le soluté et un plan d'hydratation suivi par toute l'équipe l'ont remise sur pied en deux jours. Son urine a retrouvé une couleur claire.",
      aRetenir: [
        "La personne âgée ressent peu la soif : on offre à boire souvent, en petites quantités, ce qu'elle aime.",
        "Signes à rapporter : bouche sèche, urine foncée et rare, somnolence ou confusion, étourdissements, pouls rapide.",
        "En canicule : rafraîchir, noter les liquides, surveiller davantage les personnes vulnérables.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: "chute-medication",
    titre: "Un bruit sourd à 3 h du matin",
    programme: "pab",
    duree: "15 min",
    patient: { nom: "M. Lucien Morin", age: 81, milieu: "CHSLD, quart de nuit" },
    ouverture: "3 h du matin. Vous entendez un bruit sourd dans la chambre 214. M. Morin est assis par terre à côté de son lit, en jaquette. Il voulait aller à la toilette.",
    hypotheses: [
      { texte: "Il a trébuché sur un obstacle dans la pénombre", bonne: false },
      { texte: "Effet de son nouveau médicament pour dormir", bonne: true },
      { texte: "Début d'une infection", bonne: false },
      { texte: "Un problème cardiaque", bonne: false },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Il est conscient et dit avoir mal à la hanche gauche. Il essaie de se relever en s'agrippant à la table de chevet, qui roule." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Le relever vite à deux pour le remettre au lit", bonne: false },
          { texte: "Lui dire de ne pas bouger, rester avec lui et appeler l'infirmière", bonne: true },
          { texte: "L'aider à se relever en bloquant la table de chevet", bonne: false },
          { texte: "Lui glisser un oreiller sous la tête et revenir après votre tournée", bonne: false },
        ],
        suite: "L'infirmière arrive et l'évalue au sol : pas de déformation de la jambe, il bouge ses membres, pas de coup à la tête.",
        explication: "Après une chute, on ne relève jamais la personne avant l'évaluation de l'infirmière (fracture, blessure à la tête). On reste avec elle, on la rassure et on la garde au chaud.",
      },
      {
        indice: { type: "signes", texte: "Pression couché : 128/76. Assis : 104/62. Il dit que la tête lui tourne quand on l'assoit." },
        question: "Comment le remettre au lit ?",
        choix: [
          { texte: "Le soulever à deux en le tenant sous les aisselles", bonne: false },
          { texte: "Le mettre debout d'un coup pour qu'il marche jusqu'au lit", bonne: false },
          { texte: "Avec le lève-personne, à deux, selon les principes PDSB", bonne: true },
          { texte: "Le laisser dormir au sol avec une couverture jusqu'au matin", bonne: false },
        ],
        suite: "Il est remis au lit en toute sécurité. L'infirmière demande une surveillance aux heures.",
        explication: "La pression qui chute quand on passe de couché à assis s'appelle l'hypotension orthostatique : elle cause des étourdissements et des chutes. La relève du sol se fait avec un équipement adapté, selon les principes PDSB, pour la sécurité du résident et la vôtre.",
      },
      {
        indice: { type: "dossier", texte: "Au dossier : depuis trois jours, un nouveau somnifère au coucher. Il prend aussi un médicament pour la pression." },
        question: "Il se réveille encore pour uriner la nuit. Comment prévenir une autre chute ?",
        choix: [
          { texte: "Lui apprendre à s'asseoir un moment avant de se lever", bonne: true },
          { texte: "Lui mettre une culotte d'incontinence pour qu'il ne se lève plus", bonne: false },
          { texte: "Lever les ridelles pour qu'il ne puisse plus sortir du lit", bonne: false },
          { texte: "Lui dire d'attendre le matin pour aller à la toilette", bonne: false },
        ],
        suite: "Vous laissez aussi la cloche d'appel et l'urinal à sa portée, une veilleuse allumée, et le lit en position basse.",
        explication: "Se lever en deux temps laisse à la pression le temps de s'ajuster. On aménage l'environnement (cloche, éclairage, urinal, lit bas, souliers antidérapants). Les ridelles et la culotte imposée sont des contentions ou des atteintes à la dignité, et n'empêchent pas les chutes.",
      },
      {
        indice: { type: "observation", texte: "Le lendemain matin, au déjeuner, M. Morin est très somnolent et s'endort au-dessus de son assiette." },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Le laisser dormir à table : il a mal dormi", bonne: false },
          { texte: "Le faire manger plus vite, avant qu'il se rendorme dans son assiette", bonne: false },
          { texte: "Le rapporter à l'infirmière et rester près de lui au repas", bonne: true },
          { texte: "Lui servir un double café", bonne: false },
        ],
        suite: "L'infirmière fait le lien avec le nouveau somnifère et en parle au médecin et au pharmacien.",
        explication: "La somnolence le jour après un nouveau somnifère est un effet à rapporter. Manger somnolent expose aussi à l'étouffement : on surveille le repas.",
      },
      {
        indice: { type: "parole", texte: "Son fils, au téléphone : « Mon père dormait mal, c'est vrai, mais il n'était jamais tombé avant ce nouveau médicament ! »" },
        question: "Que lui répondez-vous ?",
        choix: [
          { texte: "Lui confirmer que c'est bien ce nouveau médicament qui l'a fait tomber", bonne: false },
          { texte: "Lui dire que les chutes sont normales à cet âge", bonne: false },
          { texte: "Accueillir son inquiétude et lui dire que l'infirmière va le rappeler", bonne: true },
          { texte: "Lui conseiller de demander un somnifère plus fort", bonne: false },
        ],
        suite: "L'infirmière rappelle le fils et lui explique les changements prévus au plan de soins.",
        explication: "L'observation du fils est utile et se transmet. Mais expliquer les causes ou la médication relève de l'infirmière et du médecin : on n'avance pas de conclusion à la place de l'équipe.",
      },
    ],
    denouement: {
      titre: "Chute liée au nouveau somnifère et à une baisse de pression au lever",
      texte: "Le nouveau somnifère, combiné à son médicament pour la pression, rendait M. Morin somnolent et faisait chuter sa pression quand il se levait. Le médecin et le pharmacien ont cessé le somnifère. Il ne s'en est tiré qu'avec une contusion, et un plan de prévention des chutes a été mis en place.",
      aRetenir: [
        "Après une chute : ne pas relever la personne avant l'évaluation de l'infirmière ; relève avec équipement, selon les principes PDSB.",
        "Un nouveau médicament suivi de somnolence, d'étourdissements ou d'une chute : on le rapporte.",
        "Prévention : se lever en deux temps, cloche et urinal à portée, éclairage, lit bas — pas de contention improvisée.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: "lesion-pression",
    titre: "Mme Roy a mal quand on la tourne",
    programme: "pab",
    duree: "12 min",
    patient: { nom: "Mme Jeannine Roy", age: 91, milieu: "CHSLD" },
    ouverture: "Depuis une pneumonie il y a trois semaines, Mme Roy reste au lit la majeure partie de la journée. Elle mange peu et elle est incontinente. Pendant les soins d'hygiène du matin, vous remarquez une zone rouge au bas de son dos, sur le sacrum.",
    hypotheses: [
      { texte: "Irritation causée par l'incontinence", bonne: false },
      { texte: "Réaction allergique au savon", bonne: false },
      { texte: "Simple marque des draps, qui va disparaître", bonne: false },
      { texte: "Lésion de pression de stade 1", bonne: true },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "La zone rouge a la taille d'une pièce de 2 $. La peau est intacte, plus chaude que la peau autour, et Mme Roy grimace quand vous y touchez." },
        question: "Comment vérifier s'il s'agit d'une simple marque ?",
        choix: [
          { texte: "Masser vigoureusement pour réactiver la circulation", bonne: false },
          { texte: "Appuyer doucement du doigt : si la rougeur ne pâlit pas, c'est inquiétant", bonne: true },
          { texte: "Appliquer de la glace 20 minutes, puis regarder", bonne: false },
          { texte: "Attendre une semaine pour voir si elle disparaît", bonne: false },
        ],
        suite: "Vous appuyez doucement : la zone reste rouge sous votre doigt.",
        explication: "Une rougeur qui ne blanchit pas sous une légère pression est le signe d'une lésion de pression de stade 1. On ne masse jamais une rougeur : le massage abîme davantage les tissus fragilisés.",
      },
      {
        indice: { type: "observation", texte: "Après 30 minutes couchée sur le côté, la rougeur est toujours là et ne blanchit toujours pas." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Aviser l'infirmière et éviter tout appui sur cette zone", bonne: true },
          { texte: "Mettre un pansement dessus et ne pas en parler", bonne: false },
          { texte: "La frictionner avec une lotion à base d'alcool", bonne: false },
          { texte: "La remettre sur le dos, puisque c'est sa position préférée pour dormir", bonne: false },
        ],
        suite: "L'infirmière confirme une lésion de pression de stade 1. Elle ajoute au plan de travail un changement de position aux 2 heures et demande un matelas thérapeutique.",
        explication: "Le préposé est souvent le premier à voir la peau : son signalement déclenche le plan de soins. Soulager la pression sur la zone est la première mesure. L'alcool assèche et fragilise la peau.",
      },
      {
        indice: { type: "observation", texte: "Mme Roy a glissé vers le pied du lit. La tête du lit est relevée à 60°." },
        question: "Comment la remonter dans le lit ?",
        choix: [
          { texte: "En la tirant par les bras vers la tête du lit", bonne: false },
          { texte: "Seul(e), en tirant le drap d'un coup sec", bonne: false },
          { texte: "À deux, avec une toile de glissement", bonne: true },
          { texte: "En lui demandant de pousser avec ses talons sur le matelas", bonne: false },
        ],
        suite: "Une fois remontée, vous abaissez la tête du lit à 30° pour qu'elle ne glisse plus.",
        explication: "Le frottement de la peau sur le drap (friction) et le glissement des tissus (cisaillement) aggravent les lésions de pression. La toile de glissement et une tête de lit à 30° ou moins (sauf aux repas) les réduisent, selon les principes PDSB.",
      },
      {
        indice: { type: "observation", texte: "Elle est souvent mouillée par son incontinence entre deux changements, et ne mange que la moitié de ses repas." },
        question: "Qu'est-ce qui aide aussi à prévenir l'aggravation ?",
        choix: [
          { texte: "Lui mettre deux culottes d'incontinence l'une par-dessus l'autre", bonne: false },
          { texte: "Garder la peau propre et sèche, et rapporter qu'elle mange peu", bonne: true },
          { texte: "Diminuer ses liquides pour qu'elle urine moins", bonne: false },
          { texte: "Saupoudrer beaucoup de talc sur la zone", bonne: false },
        ],
        suite: "La nutritionniste ajoute des suppléments riches en protéines. Vous utilisez une crème barrière selon le plan.",
        explication: "L'humidité fragilise la peau. Deux culottes superposées gardent l'humidité et la chaleur. Une bonne alimentation (protéines) et une bonne hydratation aident la peau à se défendre et à guérir.",
      },
      {
        indice: { type: "parole", texte: "Mme Roy : « Laissez-moi sur le dos ! Sur le côté, ça me fait mal à l'épaule. »" },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Respecter son choix et la laisser sur le dos toute la journée, sans la tourner", bonne: false },
          { texte: "La tourner quand même complètement sur le côté, sans discuter", bonne: false },
          { texte: "L'incliner à 30° sur le côté avec des oreillers et vérifier son confort", bonne: true },
        ],
        suite: "Inclinée à 30° et bien soutenue par des oreillers, elle dit : « Comme ça, c'est correct. »",
        explication: "Une inclinaison latérale de 30° soulage le sacrum sans appuyer sur l'épaule ni la hanche. On cherche une solution avec la personne, et on rapporte sa douleur à l'infirmière.",
      },
    ],
    denouement: {
      titre: "Lésion de pression de stade 1 au sacrum",
      texte: "La pression prolongée au lit, l'humidité et une alimentation insuffisante ont abîmé la peau du sacrum de Mme Roy. Détectée au stade 1, la lésion a disparu en une dizaine de jours grâce aux changements de position, au matelas thérapeutique et aux soins de peau.",
      aRetenir: [
        "Une rougeur qui ne blanchit pas sous le doigt = lésion de pression de stade 1. On la rapporte et on ne la masse jamais.",
        "Changer de position régulièrement, inclinaison de 30°, toile de glissement : moins de pression, de friction et de cisaillement.",
        "Peau propre et sèche, bonne alimentation et hydratation : la prévention se fait à chaque soin.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 8 */
  {
    id: "dysphagie-aspiration",
    titre: "M. Leblanc tousse à table",
    programme: "les deux",
    duree: "15 min",
    patient: { nom: "M. Paul-Émile Leblanc", age: 79, milieu: "CHSLD, résident atteint de la maladie de Parkinson" },
    ouverture: "Depuis quelques semaines, M. Leblanc tousse pendant les repas, surtout quand il boit. Ses repas s'allongent et il laisse souvent son assiette à moitié pleine. Ce matin, il semble plus fatigué que d'habitude.",
    hypotheses: [
      { texte: "Un rhume attrapé d'un autre résident", bonne: false },
      { texte: "Troubles pour avaler et pneumonie d'aspiration", bonne: true },
      { texte: "Reflux gastrique", bonne: false },
      { texte: "Allergie alimentaire", bonne: false },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Au dîner, il tousse à chaque gorgée d'eau. Après avoir avalé, sa voix devient « mouillée », gargouillante." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Lui faire prendre de plus grosses gorgées pour que ça passe", bonne: false },
          { texte: "Arrêter le repas, le garder assis bien droit et aviser l'infirmière", bonne: true },
          { texte: "Lui taper fort dans le dos et continuer de le faire manger", bonne: false },
          { texte: "Le coucher à plat pour qu'il se repose", bonne: false },
        ],
        suite: "L'infirmière l'évalue et demande une évaluation de la déglutition.",
        explication: "Toux pendant le repas, voix mouillée, raclements de gorge : ce sont des signes que les aliments ou les liquides passent vers les voies respiratoires (dysphagie). On arrête, on garde la personne assise et on rapporte.",
      },
      {
        indice: { type: "signes", texte: "Le soir : température 38,4 °C · respiration 26/min · saturation 90 % (habituellement 95 %). Il est somnolent." },
        question: "Que faites-vous de ces valeurs ?",
        choix: [
          { texte: "Les transmettre immédiatement à l'infirmière", bonne: true },
          { texte: "Lui mettre une débarbouillette froide sur le front et attendre", bonne: false },
          { texte: "Les reprendre au prochain quart de travail", bonne: false },
          { texte: "Le faire boire beaucoup d'eau pour faire baisser la fièvre", bonne: false },
        ],
        suite: "Le médecin soupçonne une pneumonie d'aspiration. Une radiographie la confirme, et un antibiotique est prescrit.",
        explication: "Fièvre, respiration rapide et saturation en baisse chez une personne qui avale mal : on pense à une pneumonie d'aspiration (des aliments ou de la salive sont allés dans les poumons). Le faire boire de l'eau ordinaire serait dangereux.",
      },
      {
        indice: { type: "dossier", texte: "Recommandations après l'évaluation de la déglutition : liquides épaissis (consistance miel), texture purée, toujours assis à 90° pour manger." },
        question: "Au repas, sa fille veut lui donner un verre d'eau ordinaire : « Il déteste le liquide épaissi. » Que faites-vous ?",
        choix: [
          { texte: "La laisser faire : c'est sa fille, elle le connaît mieux que l'équipe", bonne: false },
          { texte: "Lui donner l'eau avec une paille pour qu'il boive plus vite", bonne: false },
          { texte: "Lui expliquer le risque et proposer le liquide épaissi prescrit", bonne: true },
        ],
        suite: "La fille comprend. Vous en parlez à l'infirmière : on essaiera d'autres saveurs de boissons épaissies qu'il aimera davantage.",
        explication: "Les liquides clairs coulent vite et passent facilement dans les voies respiratoires. Les textures prescrites protègent ses poumons. La paille augmente souvent le risque si elle n'est pas recommandée. On explique, on écoute ses préférences et on cherche des solutions avec l'équipe.",
      },
      {
        indice: { type: "observation", texte: "Vous l'aidez à manger son repas en purée." },
        question: "Quelle façon de faire est la plus sécuritaire ?",
        choix: [
          { texte: "Semi-assis à 30°, pour qu'il soit détendu", bonne: false },
          { texte: "La tête un peu renversée vers l'arrière pour faire glisser les bouchées", bonne: false },
          { texte: "Rapidement, pour qu'il ne se fatigue pas", bonne: false },
          { texte: "Assis droit, petites bouchées, en attendant qu'il ait avalé avant la suivante", bonne: true },
        ],
        suite: "Le repas prend 35 minutes, mais il ne tousse presque plus.",
        explication: "Assis droit (90°), de petites bouchées, un rythme lent et une attention entière au repas réduisent le risque d'aspiration. La tête renversée ouvre le chemin vers les voies respiratoires.",
      },
      {
        indice: { type: "observation", texte: "Le repas est terminé. Il reste des résidus de purée dans sa bouche." },
        question: "Que faites-vous après le repas ?",
        choix: [
          { texte: "Le coucher à plat tout de suite pour aider la digestion", bonne: false },
          { texte: "Soins de bouche, puis rester assis au moins 30 minutes", bonne: true },
          { texte: "Attendre le soir pour lui brosser les dents", bonne: false },
          { texte: "Le laisser seul avec une collation", bonne: false },
        ],
        suite: "Après dix jours d'antibiotiques et avec ces nouvelles habitudes, M. Leblanc reprend des forces.",
        explication: "Les résidus dans la bouche peuvent être aspirés plus tard ; une bouche propre réduit les bactéries qui causent la pneumonie. Rester assis après le repas limite les remontées.",
      },
    ],
    denouement: {
      titre: "Dysphagie et pneumonie d'aspiration",
      texte: "La maladie de Parkinson de M. Leblanc avait affaibli les muscles de sa déglutition. Des liquides passaient dans ses poumons et ont causé une pneumonie d'aspiration. L'antibiotique, les textures adaptées et une aide au repas sécuritaire ont permis d'éviter une récidive.",
      aRetenir: [
        "Signes de dysphagie : toux ou voix mouillée en mangeant, raclements, repas qui s'allongent, aliments qui restent dans la bouche.",
        "Assis à 90°, petites bouchées, textures prescrites, rester assis 30 minutes après le repas.",
        "Les soins de bouche préviennent la pneumonie ; fièvre et respiration rapide se rapportent tout de suite.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 9 */
  {
    id: "tvp",
    titre: "Une crampe qui ne passe pas",
    programme: "sasi",
    duree: "12 min",
    patient: { nom: "Mme Karine Dufour", age: 58, milieu: "Centre hospitalier, unité de chirurgie" },
    ouverture: "Mme Dufour en est à son 4e jour après une chirurgie abdominale. À cause de la douleur, elle a très peu marché. Ce matin, elle se plaint d'une douleur au mollet gauche, « comme une crampe qui ne passe pas ».",
    hypotheses: [
      { texte: "Une crampe musculaire causée par l'immobilité", bonne: false },
      { texte: "Une infection de la plaie", bonne: false },
      { texte: "Une thrombose veineuse profonde (caillot)", bonne: true },
      { texte: "Une entorse en sortant du lit", bonne: false },
    ],
    etapes: [
      {
        indice: { type: "observation", texte: "Le mollet gauche est rouge, chaud, plus gros que le droit, et douloureux au toucher." },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Masser le mollet pour défaire la crampe", bonne: false },
          { texte: "Ne pas masser, la garder au repos et aviser l'infirmière", bonne: true },
          { texte: "Appliquer un coussin chauffant et l'encourager à marcher un peu", bonne: false },
          { texte: "Lui montrer des étirements vigoureux du mollet", bonne: false },
        ],
        suite: "L'infirmière évalue la jambe et appelle le médecin, qui prescrit une échographie Doppler.",
        explication: "Un mollet rouge, chaud, enflé et douloureux d'un seul côté fait soupçonner un caillot. Masser ou étirer pourrait détacher le caillot, qui irait bloquer une artère des poumons.",
      },
      {
        indice: { type: "signes", texte: "Température 37,5 °C · pouls 92/min · pression 132/80 · respiration 18/min · saturation 97 %." },
        question: "En attendant l'examen, que surveillez-vous en priorité ?",
        choix: [
          { texte: "Son appétit au prochain repas", bonne: false },
          { texte: "La couleur de son urine", bonne: false },
          { texte: "Un essoufflement soudain ou une douleur à la poitrine", bonne: true },
        ],
        suite: "Vous lui expliquez de sonner immédiatement si elle se sent essoufflée. Elle respire bien.",
        explication: "La complication la plus grave d'une thrombose veineuse profonde est l'embolie pulmonaire : un morceau de caillot va bloquer une artère du poumon. Essoufflement soudain, douleur thoracique, pouls rapide : urgence.",
      },
      {
        indice: { type: "dossier", texte: "Au dossier : une injection d'anticoagulant préventif chaque jour et des bas antiemboliques étaient prescrits. Hier, elle a refusé les deux." },
        question: "Que faites-vous de cette information ?",
        choix: [
          { texte: "La transmettre à l'infirmière : c'est un risque important", bonne: true },
          { texte: "Ne rien dire : c'était son droit de refuser", bonne: false },
          { texte: "La réprimander pour ses refus", bonne: false },
          { texte: "Lui remettre tout de suite ses bas antiemboliques, bien serrés", bonne: false },
        ],
        suite: "L'infirmière prend note des refus. Elle explique ensuite à Mme Dufour à quoi servent ces mesures.",
        explication: "Refuser un soin est un droit, mais le refus doit être connu de l'équipe, documenté, et la personne doit être bien informée. On ne remet pas de bas de compression sur une jambe où l'on soupçonne un caillot sans consigne.",
      },
      {
        indice: { type: "resultat", texte: "L'échographie Doppler confirme un caillot dans une veine profonde du mollet gauche. Le médecin prescrit un anticoagulant à dose de traitement." },
        question: "Que faut-il surveiller chez une personne sous anticoagulant ?",
        choix: [
          { texte: "Une hausse de l'appétit", bonne: false },
          { texte: "Des saignements : gencives, bleus, sang dans l'urine ou les selles", bonne: true },
          { texte: "Une perte de cheveux", bonne: false },
          { texte: "De la constipation", bonne: false },
        ],
        suite: "Vous lui montrez à utiliser une brosse à dents à poils souples et à vous signaler tout saignement.",
        explication: "Les anticoagulants empêchent le caillot de grossir, mais ils augmentent le risque de saignement. Tout saignement inhabituel se rapporte.",
      },
      {
        indice: { type: "parole", texte: "Le lendemain, Mme Dufour : « Est-ce que j'ai le droit de me lever ? J'ai peur que le caillot parte ! »" },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Lui dire de rester couchée sans bouger pendant deux semaines", bonne: false },
          { texte: "Vérifier la consigne de mobilisation au plan et la suivre", bonne: true },
          { texte: "Lui masser la jambe pour la réchauffer avant de la lever", bonne: false },
          { texte: "Lui conseiller de croiser les jambes au lit pour aider la circulation", bonne: false },
        ],
        suite: "Le plan prévoit la marche avec aide. Vous l'accompagnez dans le corridor ; elle est rassurée.",
        explication: "Une fois l'anticoagulant commencé, la mobilisation est en général encouragée, mais c'est l'ordonnance qui décide. Croiser les jambes ralentit la circulation veineuse.",
      },
    ],
    denouement: {
      titre: "Thrombose veineuse profonde (TVP)",
      texte: "Immobilisée par la douleur après sa chirurgie, et sans ses mesures de prévention, Mme Dufour a formé un caillot dans une veine profonde du mollet. Détecté à temps, il a été traité par anticoagulant, sans embolie pulmonaire.",
      aRetenir: [
        "Mollet rouge, chaud, enflé et douloureux d'un seul côté : on avise l'infirmière et on ne masse jamais.",
        "Essoufflement soudain ou douleur à la poitrine chez une personne à risque : urgence (embolie pulmonaire).",
        "Prévention après une chirurgie : se lever tôt, bouger les chevilles, anticoagulant et bas selon l'ordonnance.",
      ],
    },
  },

  /* ---------------------------------------------------------------- 10 */
  {
    id: "insuffisance-cardiaque",
    titre: "Les souliers de M. Fortin ne font plus",
    programme: "sasi",
    duree: "15 min",
    patient: { nom: "M. Gilles Fortin", age: 76, milieu: "Domicile (suivi du soutien à domicile)" },
    ouverture: "M. Fortin vit seul et a une insuffisance cardiaque connue. Il doit se peser chaque matin. À votre visite du jeudi, il est assis dans son fauteuil, en pantoufles : « Mes souliers ne font plus, et je manque d'air pour un rien. »",
    hypotheses: [
      { texte: "Une pneumonie", bonne: false },
      { texte: "Une prise de poids due aux repas des fêtes", bonne: false },
      { texte: "Une réaction allergique", bonne: false },
      { texte: "Son insuffisance cardiaque s'aggrave", bonne: true },
    ],
    etapes: [
      {
        indice: { type: "parole", texte: "« Je suis essoufflé juste à m'habiller. Cette nuit, j'ai dû dormir assis dans mon fauteuil, couché je manquais d'air. »" },
        question: "Que faites-vous maintenant ?",
        choix: [
          { texte: "Lui faire faire sa marche quotidienne pour garder la forme", bonne: false },
          { texte: "L'installer assis, le dos bien droit, et aviser l'infirmière", bonne: true },
          { texte: "L'aider à se coucher à plat pour qu'il se repose", bonne: false },
          { texte: "Le rassurer : à son âge, c'est normal d'être essoufflé quand on s'habille", bonne: false },
        ],
        suite: "Vous joignez l'infirmière du soutien à domicile, qui vous demande d'autres observations.",
        explication: "Être essoufflé couché au point de devoir dormir assis est un signe typique d'accumulation de liquide dans les poumons. La position assise facilite la respiration.",
      },
      {
        indice: { type: "observation", texte: "Ses chevilles et ses jambes sont enflées. Quand on appuie du doigt, une marque creuse reste quelques secondes." },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Masser fortement les chevilles pour faire descendre l'enflure", bonne: false },
          { texte: "Lui donner plus d'eau pour « nettoyer » l'enflure", bonne: false },
          { texte: "Noter où et depuis quand, et surélever ses jambes au repos", bonne: true },
        ],
        suite: "Vous transmettez à l'infirmière : enflure aux deux jambes, jusqu'à mi-mollet, depuis environ trois jours selon lui.",
        explication: "Cet œdème « à godet » montre que le corps retient du liquide. Le décrire précisément (où, depuis quand, un ou deux côtés) aide l'infirmière. Boire davantage n'élimine pas l'enflure : chez lui, les liquides sont souvent limités par l'ordonnance.",
      },
      {
        indice: { type: "dossier", texte: "Son carnet de poids : 82,0 kg lundi, 83,1 kg mardi, 84,0 kg mercredi, 84,5 kg ce matin." },
        question: "Que faites-vous de cette information ?",
        choix: [
          { texte: "Le féliciter : il a repris de l'appétit", bonne: false },
          { texte: "La transmettre : 2,5 kg en 3 jours, c'est un signal d'alarme", bonne: true },
          { texte: "Lui conseiller de sauter des repas", bonne: false },
          { texte: "Ne rien faire : le poids varie toujours un peu d'un jour à l'autre", bonne: false },
        ],
        suite: "L'infirmière confirme : c'est du liquide, pas de la graisse. Elle contacte le médecin.",
        explication: "Une prise de poids rapide (environ 2 kg ou plus en quelques jours) chez une personne insuffisante cardiaque signifie que le corps accumule du liquide. C'est pourquoi la pesée quotidienne est si importante.",
      },
      {
        indice: { type: "observation", texte: "Dans sa cuisine : soupes en conserve, charcuteries, croustilles. Sa fille vous confie qu'il « oublie » souvent sa pilule pour uriner, parce qu'il doit sortir." },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Jeter ses aliments salés sans lui en parler", bonne: false },
          { texte: "Lui faire prendre deux pilules pour rattraper l'oubli", bonne: false },
          { texte: "Rapporter à l'infirmière l'alimentation salée et les oublis de médicament", bonne: true },
          { texte: "Lui conseiller de boire beaucoup d'eau pour éliminer le sel", bonne: false },
        ],
        suite: "L'infirmière prévoit un enseignement sur le sel et un horaire de prise du diurétique adapté à ses sorties.",
        explication: "Le sel fait retenir l'eau, et l'oubli du diurétique laisse le liquide s'accumuler : ce sont deux causes fréquentes d'aggravation. On ne double jamais une dose et on respecte l'autonomie de la personne : l'équipe planifie l'enseignement.",
      },
      {
        indice: { type: "signes", texte: "En attendant le rappel de l'infirmière, il devient essoufflé même au repos. Ses lèvres sont bleutées, il tousse des sécrétions mousseuses rosées." },
        question: "Que faites-vous ?",
        choix: [
          { texte: "Appeler le 911, le garder assis et rester avec lui", bonne: true },
          { texte: "Attendre le rappel de l'infirmière", bonne: false },
          { texte: "Le coucher à plat et lui faire boire de l'eau fraîche", bonne: false },
          { texte: "L'emmener prendre l'air dehors", bonne: false },
        ],
        suite: "Les ambulanciers arrivent en quelques minutes, lui donnent de l'oxygène et le transportent à l'urgence.",
        explication: "Essoufflement au repos, lèvres bleutées et crachats mousseux rosés : c'est un œdème aigu du poumon, une urgence vitale. On appelle le 911 et on garde la personne assise, sans la laisser seule.",
      },
    ],
    denouement: {
      titre: "Décompensation de l'insuffisance cardiaque",
      texte: "Le cœur affaibli de M. Fortin n'arrivait plus à évacuer le liquide : le sel et les oublis de diurétique l'ont fait accumuler dans ses jambes, puis dans ses poumons. Traité à l'urgence, il est rentré chez lui une semaine plus tard avec un plan clair : pesée quotidienne, moins de sel, diurétique à heure fixe.",
      aRetenir: [
        "Signes d'aggravation : essoufflement (surtout couché), enflure des jambes, prise de poids rapide.",
        "La pesée quotidienne est un outil d'alerte : environ 2 kg en quelques jours, on le signale.",
        "Essoufflement au repos, lèvres bleutées, crachats mousseux : urgence, 911.",
      ],
    },
  },
];

if (typeof module !== "undefined" && module.exports) module.exports = ENQUETES;

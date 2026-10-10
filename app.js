import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://gejmaxobebsamvfkkpoj.supabase.co";
const SUPABASE_KEY = "sb_publishable_jqf5eYy0Coka5d0-E86JJQ_bCiQDyvD";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const root = document.getElementById("root");

// Le totem est stocké sans emoji, en français OU en anglais ; on retrouve l'emoji
// à partir du nom de l'animal, dans l'une ou l'autre langue.
const TOTEM_EMOJI = {
  Renard:"🦊", Fox:"🦊", Loutre:"🦦", Otter:"🦦", Castor:"🦫", Beaver:"🦫",
  Hibou:"🦉", Owl:"🦉", Blaireau:"🦡", Badger:"🦡", Loup:"🐺", Wolf:"🐺",
  Aigle:"🦅", Eagle:"🦅", Écureuil:"🐿️", Squirrel:"🐿️", Sanglier:"🐗", Boar:"🐗",
  Hérisson:"🦔", Hedgehog:"🦔", Ours:"🐻", Bear:"🐻", Cerf:"🦌", Stag:"🦌",
  Canard:"🦆", Duck:"🦆", Lièvre:"🐇", Hare:"🐇", Tortue:"🐢", Turtle:"🐢",
  Grenouille:"🐸", Frog:"🐸", Abeille:"🐝", Bee:"🐝", Fourmi:"🐜", Ant:"🐜"
};
// On balaie chaque mot : FR « Ours Éveillé » → « Ours », EN « Bright Bear » → « Bear ».
function emojiFor(totem) {
  for (const w of (totem || "").split(" ")) if (TOTEM_EMOJI[w]) return TOTEM_EMOJI[w];
  return "🎯";
}

// Titres lisibles des modules, par programme. Si un id est inconnu, on affiche l'id brut.
// Les ids ne se chevauchent pas entre programmes, et un élève ne voit qu'un seul programme.
const MODULE_INFO = {
  // PAB — Assistance à la personne (DEP 5358)
  m1:{t:"Analyse des métiers & éthique",o:1}, m2:{t:"Prévention des infections",o:2},
  m3:{t:"Soins palliatifs & fin de vie",o:3}, m4:{t:"Premiers secours",o:4},
  m5:{t:"Approches relationnelles",o:5}, m6:{t:"AVQ & soins de longue durée",o:6},
  m7:{t:"Maladies & incapacités physiques",o:7}, m8:{t:"Médicaments & soins invasifs",o:8},
  m9:{t:"Soins à domicile",o:9}, m10:{t:"Intégration au milieu de travail",o:10},
  // SASI — Santé, assistance et soins infirmiers (DEP 5325)
  anatomie:{t:"Anatomie & physiologie",o:1}, signes_vitaux:{t:"Signes vitaux",o:2},
  medicaments:{t:"Médicaments",o:3}, soins_base:{t:"Soins de base",o:4},
  plaies:{t:"Plaies & prélèvements",o:5}, sante_mentale:{t:"Santé mentale",o:6},
  personnes_agees:{t:"Personnes âgées",o:7}, fin_vie:{t:"Soins palliatifs",o:8},
  // ChantierQuest — Conduite d'engins de chantier (DEP 5220)
  c01:{t:"Se situer au regard des organismes de l'industrie de la construction",o:1},
  c02:{t:"Appliquer des règles de santé et de sécurité sur les chantiers",o:2},
  c03:{t:"Se situer au regard du métier et de la démarche de formation",o:3},
  c04:{t:"Effectuer l'entretien préventif et le dépannage",o:4},
  c05:{t:"Appliquer la technologie de base",o:5},
  c06:{t:"Appliquer des notions de compactage et d'épandage des enrobés",o:6},
  c07:{t:"Communiquer en milieu de travail",o:7},
  c08:{t:"Travaux de manutention et chargement avec une chargeuse",o:8},
  c09:{t:"Travaux de préparation du terrain avec une pelle",o:9},
  c10:{t:"Travaux de préparation du terrain avec une niveleuse",o:10},
  c11:{t:"Désagrégation de matériaux avec une chargeuse-pelleteuse",o:11},
  c12:{t:"Travaux de préparation du terrain avec un bouteur",o:12},
  c13:{t:"Travaux d'excavation avec une pelle",o:13},
  c14:{t:"Travaux d'excavation avec une chargeuse-pelleteuse",o:14},
  c15:{t:"Construction d'infrastructures avec une pelle",o:15},
  c16:{t:"Construction d'infrastructures avec un bouteur",o:16},
  c17:{t:"Construction d'infrastructures avec une niveleuse",o:17},
  c18:{t:"Travaux avec un rouleau compacteur",o:18},
  c19:{t:"Travaux de finition avec une niveleuse",o:19},
  c20:{t:"Utiliser des moyens de recherche d'emploi",o:20},
  // CoiffureQuest — Coiffure (DEP 5245)
  coif01:{t:"Métier et formation",o:1}, coif02:{t:"Santé et sécurité",o:2},
  coif03:{t:"Examen des cheveux et du cuir chevelu",o:3}, coif04:{t:"Morphologie et physionomie",o:4},
  coif05:{t:"Shampooing",o:5}, coif06:{t:"Traitement des cheveux et du cuir chevelu",o:6},
  coif07:{t:"Mise en plis",o:7}, coif08:{t:"Mise en forme",o:8},
  coif09:{t:"Communication",o:9}, coif10:{t:"Coupe standard pour femme",o:10},
  coif11:{t:"Coupe graduelle pour homme et taille de la barbe",o:11}, coif12:{t:"Permanente standard",o:12},
  coif13:{t:"Coloration",o:13}, coif14:{t:"Teinte pastel",o:14},
  coif15:{t:"Correction de couleur",o:15}, coif16:{t:"Vente de produits et services",o:16},
  coif17:{t:"Coupe stylisée",o:17}, coif18:{t:"Permanente stylisée",o:18},
  coif19:{t:"Coloration créative",o:19}, coif20:{t:"Coiffure personnalisée",o:20},
  coif21:{t:"Stage",o:21},
  // MecaniqueAutoQuest — Mécanique automobile (DEP 5298)
  meca01:{t:"Métier et formation",o:1},
  meca02:{t:"Santé, sécurité et protection de l'environnement",o:2},
  meca03:{t:"Recherche d'information technique",o:3},
  meca04:{t:"Chauffe, soudage et coupage",o:4},
  meca05:{t:"Travail d'atelier",o:5},
  meca06:{t:"Communication en milieu de travail",o:6},
  meca07:{t:"Vérification de l'état général de moteurs à combustion interne",o:7},
  meca08:{t:"Réparation de moteurs à combustion interne",o:8},
  meca09:{t:"Vérification de systèmes liés à la tenue de route",o:9},
  meca10:{t:"Réparation de systèmes liés à la tenue de route",o:10},
  meca11:{t:"Vérification de systèmes électriques et électroniques",o:11},
  meca12:{t:"Réparation de systèmes d'éclairage",o:12},
  meca13:{t:"Vérification de systèmes de base commandés par ordinateur",o:13},
  meca14:{t:"Vérification de systèmes de transmission de pouvoir",o:14},
  meca15:{t:"Réparation de systèmes de transmission de pouvoir",o:15},
  meca16:{t:"Vérification de systèmes de démarrage, de charge et d'accessoires électromagnétiques",o:16},
  meca17:{t:"Réparation de systèmes de démarrage, de charge et d'accessoires électromagnétiques",o:17},
  meca18:{t:"Vérification de systèmes liés à la température du moteur et de l'habitacle",o:18},
  meca19:{t:"Entretien et réparation des systèmes liés à la température du moteur et de l'habitacle",o:19},
  meca20:{t:"Vérification de systèmes de sécurité actifs et passifs",o:20},
  meca21:{t:"Réparation de systèmes de sécurité actifs et passifs",o:21},
  meca22:{t:"Entretien général d'un véhicule automobile",o:22},
  meca23:{t:"Vérification de systèmes d'allumage électronique",o:23},
  meca24:{t:"Réparation de systèmes d'allumage électronique",o:24},
  meca25:{t:"Vérification de systèmes d'injection électronique et antipollution",o:25},
  meca26:{t:"Entretien et réparation de systèmes d'injection électronique et antipollution",o:26},
  meca27:{t:"Vérification du fonctionnement du groupe motopropulseur",o:27},
  meca28:{t:"Recherche d'emploi",o:28},
  meca29:{t:"Intégration au milieu de travail",o:29},
  // InfographieQuest — Infographie (DEP 5344)
  info01:{t:"Métier et formation",o:1},
  info02:{t:"Gestion d'un environnement informatique",o:2},
  info03:{t:"Images vectorielles",o:3},
  info04:{t:"Images matricielles",o:4},
  info05:{t:"Exigences et étapes de production en communication graphique",o:5},
  info06:{t:"Acquisition d'images",o:6},
  info07:{t:"Gestion de profils colorimétriques",o:7},
  info08:{t:"Images composites pour impressions normalisées",o:8},
  info09:{t:"Images composites pour interfaces visuelles",o:9},
  info10:{t:"Outils de révision de textes en français",o:10},
  info11:{t:"Éléments typographiques",o:11},
  info12:{t:"Mises en pages simples pour imprimés",o:12},
  info13:{t:"Mises en pages simples pour interfaces visuelles",o:13},
  info14:{t:"Gabarits de mise en pages simples pour interfaces visuelles",o:14},
  info15:{t:"Gabarits de mise en pages pour imprimés",o:15},
  info16:{t:"Imposition et finition",o:16},
  info17:{t:"Mises en pages complexes pour imprimés",o:17},
  info18:{t:"Rastérisation de documents",o:18},
  info19:{t:"Préparation de documents pour impressions numériques",o:19},
  info20:{t:"Préparation de documents pour impressions offset normalisées",o:20},
  info21:{t:"Gestion d'une micro-entreprise en communication graphique",o:21},
  info22:{t:"Intégration au milieu de travail",o:22},
  // PlomberieQuest — Plomberie et chauffage (DEP 5333)
  plomb01:{t:"Métier, formation et communication en milieu de travail",o:1},
  plomb02:{t:"Santé et sécurité sur les chantiers de construction",o:2},
  plomb03:{t:"Manutention d'équipements, de matériaux et de produits",o:3},
  plomb04:{t:"Systèmes de mécanique de tuyauterie",o:4},
  plomb05:{t:"Installation de composants électriques",o:5},
  plomb06:{t:"Interprétation de plans et devis",o:6},
  plomb07:{t:"Installation de réseaux d'évacuation",o:7},
  plomb08:{t:"Installation de réseaux de ventilation",o:8},
  plomb09:{t:"Dispositifs électriques et électroniques",o:9},
  plomb10:{t:"Soudage et brasage",o:10},
  plomb11:{t:"Installation de systèmes de distribution d'eau chaude et d'eau froide, d'équipements sanitaires et d'accessoires",o:11},
  plomb12:{t:"Entretien et réparation de la tuyauterie, des équipements sanitaires et des accessoires",o:12},
  plomb13:{t:"Information relative aux notions d'énergie et de chauffage",o:13},
  plomb14:{t:"Installation, entretien et réparation d'appareils alimentés au mazout",o:14},
  plomb15:{t:"Installation et réparation de systèmes de chauffage directs et renversés",o:15},
  plomb16:{t:"Installation et réparation de systèmes de chauffage périmétriques",o:16},
  plomb17:{t:"Installation de systèmes alimentés au gaz",o:17},
  plomb18:{t:"Installation et réparation de systèmes de chauffage par rayonnement",o:18},
  plomb19:{t:"Installation et réparation de systèmes à vapeur à basse pression",o:19},
  plomb20:{t:"Organismes de l'industrie de la construction",o:20},
  plomb21:{t:"Recherche d'emploi",o:21},
  // SoudageQuest — Soudage-assemblage (DEP 5382)
  soud01:{t:"Métier et formation",o:1},
  soud02:{t:"Santé et sécurité sur les chantiers de construction",o:2},
  soud03:{t:"Soudage d'acier et d'acier inoxydable (GMAW) – positions à plat et horizontale",o:3},
  soud04:{t:"Calculs liés au soudage et à l'assemblage",o:4},
  soud05:{t:"Coupage et préparation mécaniques",o:5},
  soud06:{t:"Plans d'assemblages simples et dessin de croquis",o:6},
  soud07:{t:"Accès, levage et manutention",o:7},
  soud08:{t:"Coupage thermique",o:8},
  soud09:{t:"Soudage d'acier (FCAW) – positions à plat et horizontale",o:9},
  soud10:{t:"Pliage et cintrage",o:10},
  soud11:{t:"Soudage d'acier et d'acier inoxydable (GMAW) – positions verticale et au plafond",o:11},
  soud12:{t:"Perçage et boulonnage",o:12},
  soud13:{t:"Assemblages simples",o:13},
  soud14:{t:"Soudage d'acier et d'acier inoxydable (SMAW) – positions à plat et horizontale",o:14},
  soud15:{t:"Plans d'assemblages complexes",o:15},
  soud16:{t:"Assemblages de structures",o:16},
  soud17:{t:"Procédures de soudage et de coupage",o:17},
  soud18:{t:"Soudage d'acier (FCAW) – positions verticale et au plafond",o:18},
  soud19:{t:"Soudage – systèmes automatisés et robotisés",o:19},
  soud20:{t:"Assemblages de complexité moyenne",o:20},
  soud21:{t:"Soudage d'acier et d'acier inoxydable (GTAW) – toutes positions",o:21},
  soud22:{t:"Soudage d'acier (SMAW) – positions verticale et au plafond",o:22},
  soud23:{t:"Soudage d'aluminium (GMAW) – toutes positions",o:23},
  soud24:{t:"Soudage d'aluminium (GTAW) – toutes positions",o:24},
  soud25:{t:"Assemblages complexes",o:25},
  soud26:{t:"Cheminement professionnel",o:26},
  soud27:{t:"Intégration au milieu de travail",o:27},
  // ComptaQuest — Comptabilité (DEP 5231)
  compta01:{t:"Métier et formation",o:1},
  compta02:{t:"Recherche d'information",o:2},
  compta03:{t:"Tableaux et graphiques",o:3},
  compta04:{t:"Calcul de pièces",o:4},
  compta05:{t:"Mise en page de correspondance",o:5},
  compta06:{t:"Rédaction en français",o:6},
  compta07:{t:"Traitement de pièces",o:7},
  compta08:{t:"Gestion de l'encaisse",o:8},
  compta09:{t:"Législation des affaires",o:9},
  compta10:{t:"Interactions professionnelles",o:10},
  compta11:{t:"Communication en anglais",o:11},
  compta12:{t:"Production de paies",o:12},
  compta13:{t:"Rédaction en anglais",o:13},
  compta14:{t:"Traitement de données",o:14},
  compta15:{t:"Tâches courantes",o:15},
  compta16:{t:"Efficience",o:16},
  compta17:{t:"Coût d'un bien et d'un service",o:17},
  compta18:{t:"Tâches de fin de période",o:18},
  compta19:{t:"Tâches de fin d'année",o:19},
  compta20:{t:"Déclaration de revenu",o:20},
  compta21:{t:"Système comptable",o:21},
  compta22:{t:"Cheminement professionnel",o:22},
  compta23:{t:"Intégration au travail",o:23},
  // SecretariatQuest — Secrétariat (DEP 5357)
  secr01:{t:"Métier et formation",o:1},
  secr02:{t:"Révision de textes en français",o:2},
  secr03:{t:"Traitement des textes",o:3},
  secr04:{t:"Qualité du français écrit",o:4},
  secr05:{t:"Service à la clientèle",o:5},
  secr06:{t:"Gestion documentaire",o:6},
  secr07:{t:"Production de feuilles de calcul",o:7},
  secr08:{t:"Conception de présentations",o:8},
  secr09:{t:"Rédaction de textes en français",o:9},
  secr10:{t:"Opérations comptables",o:10},
  secr11:{t:"Production de lettres",o:11},
  secr12:{t:"Création de bases de données",o:12},
  secr13:{t:"Gestion de l'encaisse",o:13},
  secr14:{t:"Traduction",o:14},
  secr15:{t:"Conception de tableaux et de graphiques",o:15},
  secr16:{t:"Conception visuelle de documents",o:16},
  secr17:{t:"Rédaction de textes en anglais",o:17},
  secr18:{t:"Médias numériques",o:18},
  secr19:{t:"Interaction en anglais",o:19},
  secr20:{t:"Suivi de la correspondance",o:20},
  secr21:{t:"Réunions et événements",o:21},
  secr22:{t:"Production de rapports",o:22},
  secr23:{t:"Soutien technique",o:23},
  secr24:{t:"Coordination de tâches multiples",o:24},
  secr25:{t:"Intégration au milieu de travail",o:25},
  // SecretariatMedicalQuest — Secrétariat médical (ASP 5374)
  secmed01:{t:"Profession et formation",o:1},
  secmed02:{t:"Interprétation de termes médicaux",o:2},
  secmed03:{t:"Liens entre termes médicaux et spécialités",o:3},
  secmed04:{t:"Révision de rapports transcrits par systèmes automatisés",o:4},
  secmed05:{t:"Transcription de rapports de consultation médicale",o:5},
  secmed06:{t:"Soutien administratif en lien avec les consultations médicales",o:6},
  secmed07:{t:"Transcription de rapports d'imagerie médicale",o:7},
  secmed08:{t:"Transcription de comptes rendus opératoires",o:8},
  secmed09:{t:"Intégration au milieu de travail",o:9},
  // PediatrieQuest — Soins infirmiers pédiatriques
  // ⚠️ "signes_vitaux_pedia" et non "signes_vitaux" : cet id-là appartient déjà à SASI.
  croissance:{t:"Croissance & développement",o:1},
  signes_vitaux_pedia:{t:"Signes vitaux pédiatriques",o:2},
  nouveau_ne:{t:"Nouveau-né & nourrisson",o:3},
  maladies:{t:"Maladies courantes & fièvre",o:4},
  vaccination:{t:"Vaccination & immunisation",o:5},
  medication:{t:"Médication & calcul de dose",o:6},
  nutrition:{t:"Nutrition infantile",o:7},
  securite:{t:"Sécurité & prévention",o:8},
  famille:{t:"Communication & famille",o:9},
  urgences:{t:"Urgences pédiatriques",o:10},
  // PérinatalitéQuest — Soins à la mère et au nouveau-né (SASI, compétences 27-28)
  approche_perinatale:{t:"Approche privilégiée mère et nouveau-né",o:1},
  soins_mere_nouveaune:{t:"Soins aux mères et aux nouveaux-nés",o:2},
  // SantéMentaleQuest — Approche en santé mentale (SASI, compétence 20)
  // ⚠️ "approche_sante_mentale" et non "sante_mentale" : cet id-là appartient déjà à SASI.
  approche_sante_mentale:{t:"Approche privilégiée en santé mentale",o:1}
};
const moduleTitle = id => (MODULE_INFO[id] && MODULE_INFO[id].t) || id;
const moduleOrder = id => (MODULE_INFO[id] ? MODULE_INFO[id].o : 999);

/* ------------------ StageQuest — carnet de stage (option de licence) ------------------
   NOM DE PRODUIT : une seule ligne à changer. Le module est vendu comme un
   produit distinct, en seconde rencontre, après l'app de révision. Le nom est
   neutre vis-à-vis du métier (il tiendra en plomberie ou en soudage), et la
   CLÉ TECHNIQUE de l'option de licence reste `carnet` côté SQL : renommer le
   produit ne doit jamais obliger à toucher à la base. */
const CARNET_NOM = "StageQuest";

/* ⚠️ Le carnet est la première donnée de ce tableau de bord qui soit du TEXTE
   LIBRE saisi par un élève (nom, employeur, note). Elle est injectée dans de
   l'innerHTML, dans une page où l'enseignant est AUTHENTIFIÉ : sans échappement,
   une note contenant du HTML s'exécuterait avec sa session, qui donne accès à
   tout son centre. Tout ce qui vient de carnet_realisations passe donc par esc().
   (La progression, elle, ne contient que des nombres et des totems d'une liste
   fermée — c'est pourquoi le reste du fichier n'en avait pas besoin.) */
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

/* Libellés des « gestes du métier » du carnet. Même principe que MODULE_INFO :
   repli sur l'id brut si un geste est inconnu, pour qu'un ajout côté app élève
   n'affiche jamais une case vide ici. La réalisation porte déjà son libellé
   (`geste_nom`), figé au moment de la saisie — ce dictionnaire ne sert que de
   repli et à l'ordre d'affichage.
   ⚠️ Ces 8 gestes sont ceux de la maquette, PAS le référentiel du DEP 5220.
   Voir le commentaire en tête de chantierquest-web/carnet.js. */
const GESTE_INFO = {
  inspection:{t:"Inspecter l'engin avant le travail",o:1},
  deplacement:{t:"Déplacer l'engin sur le chantier",o:2},
  tranchee:{t:"Creuser une tranchée",o:3},
  nivellement:{t:"Niveler un terrain",o:4},
  chargement:{t:"Charger un camion",o:5},
  remblai:{t:"Remblayer et compacter",o:6},
  signaleur:{t:"Travailler avec un signaleur",o:7},
  entretien:{t:"Faire l'entretien de base",o:8},
  /* `autre` = geste que l'élève a écrit lui-même dans son app, parce qu'aucune
     entrée de la liste ne décrivait son cas. Le libellé réel arrive dans
     `geste_nom` ; ce repli ne sert que si ce texte est vide (ligne tronquée,
     ou appel direct de la RPC). */
  autre:{t:"Geste écrit par l'élève",o:99}
};
/* ⚠️ `fourni` (= geste_nom) est du TEXTE ÉCRIT PAR L'ÉLÈVE. Il n'est PAS
   échappé ici : tous les appels doivent le passer par esc(), comme les autres
   champs libres (nom, employeur, note, commentaire). C'est le vecteur à ne
   jamais oublier — du texte d'élève qui s'exécuterait dans la session
   authentifiée de l'enseignante. Voir renderCarnetView(). */
const gesteTitle = (id, fourni) => fourni || (GESTE_INFO[id] && GESTE_INFO[id].t) || id;
/* Geste hors liste : on le signale à l'enseignante, sinon elle ne peut pas
   savoir que ce libellé est de la main de l'élève (et qu'il ne correspond à
   aucun badge dans l'app). */
const gesteEstLibre = (id) => id === "autre";
const CARNET_STATUT = {
  attente:{ t:"À traiter", c:"warn" },
  validee:{ t:"Validée",   c:"ok" },
  refaire:{ t:"À refaire", c:"crit" }
};
/* Les colonnes de la liste : TOUT sauf `photo`. Une liste de groupe tirerait
   sinon des mégaoctets de base64 sur le réseau du CFP à chaque ouverture ; la
   photo est demandée à la pièce, quand l'enseignant ouvre une réalisation. */
/* `classe_code` est demandé explicitement (6 caractères) : il sert à REVALIDER
   côté client que chaque ligne reçue appartient bien au groupe ouvert, sans
   faire confiance au serveur. Voir carnetFiltreGroupe(). */
const CARNET_COLONNES = "id,classe_code,appareil_id,eleve_nom,eleve_totem,employeur,geste_id,geste_nom,engin,note,statut,commentaire_prof,decide_le,decide_par,cree_le,recu_le";
const CARNET_COLONNES_HEURES = "classe_code,appareil_id,eleve_nom,eleve_totem,total_heures,objectif_heures,maj_le";

/* ⚠️ DEUXIÈME BARRIÈRE, CÔTÉ CLIENT.
   La RLS filtre déjà côté serveur (policy `carnet_lecture_enseignant`). On
   refiltre ici sur le code du groupe ouvert : même si le serveur poussait par
   erreur la réalisation d'un autre centre, elle ne s'afficherait jamais. */
function carnetFiltreGroupe(lignes, code) {
  const c = String(code || "").toUpperCase();
  if (!c) return [];
  return (lignes || []).filter(r => String(r && r.classe_code || "").toUpperCase() === c);
}

function joursDepuis(iso) {
  if (!iso) return Infinity;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}
function dateRelative(iso) {
  const j = joursDepuis(iso);
  if (j <= 0) return "aujourd'hui";
  if (j === 1) return "hier";
  return `il y a ${j} jours`;
}

/* `carnetDispo`   : la table existe et est lisible (le temps réel a un sens).
   `carnetActif`   : il y a de quoi afficher la section StageQuest.
   `carnetBrouillons` : le commentaire en cours de frappe, par réalisation. Il
      vit dans le cache et non dans le DOM, pour qu'une arrivée en temps réel
      (qui redessine la page) n'efface jamais ce que l'enseignant écrit.
   `carnetNouveaux` : les réalisations arrivées pendant cette session — mises en
      évidence, pour qu'on les voie apparaître sur un écran projeté.
   `rtEtat`        : "off" | "lien" (connexion) | "on" (temps réel) | "repli". */
function cacheVide() {
  return { org: null, classes: [], view: "classes", classe: null, eleves: [], prog: [],
    carnet: [], carnetHeures: [], carnetSel: null, carnetPhotos: {}, carnetActif: false,
    carnetMsg: "", carnetDispo: false, carnetBrouillons: {}, carnetNouveaux: [],
    carnetChannel: null, rtEtat: "off" };
}
let cache = cacheVide();

/* ------------------ Consentement Loi 25 (version légère) ------------------
   Le courriel de l'enseignant est un renseignement personnel. Plutôt qu'une case à
   cocher bloquante, on informe : consentement implicite par l'usage. Un avis discret
   près du bouton de connexion renvoie à la politique de confidentialité. La date du
   consentement est notée dans le localStorage au moment de l'envoi du lien (trivial).
   L'avis se localise selon la langue du navigateur (FR par défaut). */
const LANG = (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
const CONSENT_KEY = "quest_ens_consent_confidentialite";
const PRIVACY_URL = "https://productions-imedias.com/confidentialite.html";
const CONSENT_NOTICE = {
  fr: `En vous connectant, vous acceptez notre <a href="${PRIVACY_URL}" target="_blank" rel="noopener">politique de confidentialité</a>.`,
  en: `By signing in, you agree to our <a href="${PRIVACY_URL}" target="_blank" rel="noopener">privacy policy</a>.`
};

/* ------------------ Authentification ------------------ */

function renderLogin(message) {
  root.innerHTML = `
  <div class="login-wrap">
    <div class="login">
      <div class="mk">🛡️</div>
      <h1>Espace enseignant</h1>
      <p>Reçois un lien de connexion par courriel. Aucun mot de passe à retenir.</p>
      <form id="loginForm">
        <label for="email">Ton courriel</label>
        <input id="email" type="email" required placeholder="prenom.nom@exemple.ca" autocomplete="email" />
        <button type="submit" id="loginBtn">M'envoyer un lien</button>
        <p class="consent-notice">${CONSENT_NOTICE[LANG]}</p>
      </form>
      ${message ? `<div class="msg ${message.type}">${message.text}</div>` : ""}
      <div class="demo-cta">
        <button type="button" id="demoBtn" class="demo-link">👀 Voir une démo du tableau de bord</button>
        <small>Aperçu avec des données fictives, sans connexion.</small>
      </div>
    </div>
  </div>`;
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const btn = document.getElementById("loginBtn");
    // Consentement implicite par l'usage : on note la date d'acceptation au moment de
    // l'envoi du lien (preuve légère côté client).
    try { localStorage.setItem(CONSENT_KEY, new Date().toISOString()); } catch (_) {}
    btn.disabled = true; btn.textContent = "Envoi…";
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: window.location.href.split("#")[0] }
    });
    if (error) {
      renderLogin({ type: "err", text: "Échec : " + error.message });
    } else {
      renderLogin({ type: "ok", text: "Lien envoyé ! Ouvre ton courriel et clique le lien pour te connecter." });
    }
  });
  const demoBtn = document.getElementById("demoBtn");
  if (demoBtn) demoBtn.addEventListener("click", enterDemo);
}

/* ------------------ Mode démonstration public (sans connexion) ------------------
   Un prospect n'a pas de compte : il ne verrait que « Aucun groupe rattaché ».
   Ce mode charge les cohortes de démonstration via des RPC security-definer
   (demo_dashboard) qui ne renvoient QUE les organisations marquées is_demo = true —
   jamais de donnée réelle. Lecture seule, aucun login, clé publiable uniquement. */
async function enterDemo() {
  // Repart d'un cache propre : pas de StageQuest d'une session réelle qui
  // traînerait dans la démo, pas d'abonnement temps réel orphelin.
  carnetRealtimeStop();
  msgRealtimeStop();             // messagerie : pas de canal orphelin derrière la démo
  cache = cacheVide();
  cache.demo = true;
  root.innerHTML = `<div class="loading">Chargement de la démonstration…</div>`;
  // On appelle la RPC avec la clé anonyme en fetch brut, SANS passer par supabase-js :
  // ce dernier attache une éventuelle session enseignant stockée (jeton expiré) qui ferait
  // échouer l'appel par un 401. La démo est publique et anonyme — la clé publiable suffit.
  let data = null;
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/rpc/demo_dashboard", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: "{}"
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    data = await res.json();
  } catch (e) {
    // Vraie erreur réseau / RPC : problème temporaire, on invite à réessayer.
    cache.demo = false;
    renderLogin({ type: "err", text: "La démonstration est momentanément indisponible. Réessaie dans un instant." });
    return;
  }
  if (!data || !data.org) {
    // La RPC a répondu sans erreur, mais ne renvoie aucune organisation : la démo est
    // expirée (licence_fin dépassée) ou désactivée. Message distinct, verrou global.
    cache.demo = false;
    renderLogin({ type: "err", text: "La démonstration n'est plus disponible. Écrivez-nous à philippe.beaubien@gmail.com pour obtenir un accès." });
    return;
  }
  cache.org = data.org;
  cache.classes = data.classes || [];
  cache.demoEleves = data.eleves || [];
  cache.demoProg = data.progression || [];
  cache.userEmail = "";
  cache.classe = null;
  cache.view = "classes";
  render();
}

function exitDemo() {
  carnetRealtimeStop();          // pas d'abonnement orphelin derrière la démo
  msgRealtimeStop();
  cache = cacheVide();
  renderLogin();
}

/* ------------------ Lien profond vers un groupe ------------------
   https://prof.questedu.ca/?groupe=<CODE_CLASSE>&vue=carnet

   Sert la présentation : un lien cliquable dans le PowerPoint ouvre
   directement la vue StageQuest du groupe, sans deux clics devant la salle.
   `?vue=carnet` ouvre StageQuest ; toute autre valeur (ou son absence) ouvre
   simplement le groupe.

   ⚠️ CE PARAMÈTRE SÉLECTIONNE, IL N'AUTORISE PAS.
   On ne cherche le code QUE dans `cache.classes`, qui vient d'un SELECT déjà
   cadré par la RLS (`mon_organisation()`). Le groupe d'un autre centre n'y est
   donc jamais, et le paramètre ne peut pas l'y faire entrer. Et quand le code
   est introuvable, ON NE DIT RIEN : un message « ce groupe n'existe pas »
   confirmerait, par différence, l'existence du code d'un autre centre. On
   ignore le paramètre et on reste à l'accueil, exactement comme sans lien.

   `?demo=1` reste prioritaire (voir le démarrage, en bas de fichier).

   Survie à l'aller-retour du lien magique : `emailRedirectTo` conserve déjà la
   query (`window.location.href.split("#")[0]`), mais la liste d'URL autorisées
   de Supabase peut la réécrire, et le courriel ouvre souvent un NOUVEL onglet
   (donc pas de sessionStorage). On met donc le lien de côté dans
   `localStorage`, avec une durée de vie de 30 minutes et consommation unique :
   un lien oublié ne détourne pas une visite normale du lendemain. Rien de
   sensible là-dedans — un code de classe, que l'enseignant a déjà. */
const LIEN_KEY = "qe_lien_profond";
const LIEN_TTL_MS = 30 * 60 * 1000;

function lienProfondDeLUrl() {
  const p = new URLSearchParams(location.search);
  const groupe = String(p.get("groupe") || "").trim().toUpperCase().slice(0, 12);
  if (!groupe) return null;
  return { groupe, vue: String(p.get("vue") || "").trim().toLowerCase() === "carnet" ? "carnet" : "cohort" };
}
function lienProfondMemoriser(l) {
  try { localStorage.setItem(LIEN_KEY, JSON.stringify({ g: l.groupe, v: l.vue, t: Date.now() })); } catch (_) {}
}
function lienProfondReprendre() {
  try {
    const brut = localStorage.getItem(LIEN_KEY);
    localStorage.removeItem(LIEN_KEY);              // consommation unique
    if (!brut) return null;
    const o = JSON.parse(brut);
    if (!o || !o.g || !(Date.now() - Number(o.t) < LIEN_TTL_MS)) return null;
    return { groupe: String(o.g).toUpperCase().slice(0, 12), vue: o.v === "carnet" ? "carnet" : "cohort" };
  } catch (_) { return null; }
}
function lienProfondNettoyerUrl() {
  try {
    const u = new URL(location.href);
    u.searchParams.delete("groupe");
    u.searchParams.delete("vue");
    history.replaceState(null, "", u.pathname + u.search + u.hash);
  } catch (_) {}
}

/* Appliqué une seule fois, après le chargement des groupes. Renvoie true si le
   groupe a été ouvert, false dans TOUS les autres cas — sans message. */
async function appliquerLienProfond() {
  const l = lienProfondEnAttente;
  lienProfondEnAttente = null;            // consommé, quoi qu'il arrive
  if (!l || cache.demo) return false;
  const classe = (cache.classes || []).find(
    (c) => String(c.code_classe || "").toUpperCase() === l.groupe
  );
  if (!classe) return false;              // inconnu ou hors organisation : silence
  await openClass(classe);
  if (l.vue === "carnet" && cache.carnetActif) {
    cache.view = "carnet";
    cache.carnetMsg = "";
    render();
  }
  return true;
}

/* ------------------ Chargement des données ------------------ */

async function loadDashboard() {
  root.innerHTML = `<div class="loading">Chargement de tes groupes…</div>`;
  const { data: org } = await supabase.from("organisations").select("*").limit(1).maybeSingle();
  const { data: classes } = await supabase.from("classes").select("*").order("nom");
  if (!org) {
    root.innerHTML = `<div class="login-wrap"><div class="login">
      <div class="mk">🛡️</div><h1>Aucun groupe rattaché</h1>
      <p>Ce compte n'est associé à aucun centre de formation. Contacte l'administrateur pour être ajouté comme enseignant.</p>
      <button onclick="location.reload()">Réessayer</button></div></div>`;
    return;
  }
  cache.org = org;
  cache.classes = classes || [];
  cache.view = "classes";
  render();
  // Lien profond du PowerPoint : on ouvre le groupe demandé, s'il appartient
  // bien à cette organisation. Sinon on ne bouge pas et on ne dit rien.
  if (lienProfondEnAttente && await appliquerLienProfond()) lienProfondNettoyerUrl();
}

async function openClass(classe) {
  // En mode démo, tout est déjà en mémoire (RPC demo_dashboard) : aucun accès
  // direct aux tables (la RLS le bloquerait pour un visiteur non connecté).
  if (cache.demo) {
    const eleves = (cache.demoEleves || []).filter(e => e.classe_id === classe.id);
    const ids = eleves.map(e => e.id);
    const prog = (cache.demoProg || []).filter(p => ids.includes(p.eleve_id));
    cache.classe = classe; cache.eleves = eleves; cache.prog = prog; cache.view = "cohort";
    render();
    return;
  }
  root.innerHTML = `<div class="loading">Chargement de ${classe.nom}…</div>`;
  const { data: eleves } = await supabase.from("eleves").select("*").eq("classe_id", classe.id);
  const ids = (eleves || []).map(e => e.id);
  let prog = [];
  if (ids.length) {
    const { data } = await supabase.from("progression").select("*").in("eleve_id", ids);
    prog = data || [];
  }
  cache.classe = classe; cache.eleves = eleves || []; cache.prog = prog; cache.view = "cohort";
  await loadCarnet(classe);
  await loadMessages(classe);    // messagerie (tableau de bord de base, indépendante du carnet)
  render();
  // Le temps réel est rattaché au GROUPE ouvert, pas à la vue : le compteur
  // « à traiter » de la pastille et du tableau doit rester juste même quand
  // l'enseignant n'est pas dans la vue StageQuest. Il est remplacé à chaque
  // changement de groupe et coupé à la déconnexion.
  carnetRealtimeStart(classe);
  msgRealtimeStart(classe);      // canal SÉPARÉ de celui du carnet
}

/* ------------------ Carnet de stage : lecture ------------------
   Lecture DIRECTE des tables, protégée par de vraies policies RLS liées à
   l'enseignant authentifié (voir chantierquest-web/supabase_carnet.sql §6) :
   `carnet_est_ma_classe()` s'appuie sur la RLS déjà en place sur `classes`, donc
   un enseignant ne reçoit que les réalisations des groupes de son organisation.
   Aucune fonction ouverte à `anon` n'est utilisée ici — contrairement au côté
   élève, qui est anonyme et passe par `security definer`.

   Si les tables n'existent pas encore (SQL non exécuté), on se tait et le
   carnet reste simplement absent du tableau de bord. */
async function loadCarnet(classe) {
  cache.carnet = []; cache.carnetHeures = []; cache.carnetSel = null;
  cache.carnetPhotos = {}; cache.carnetActif = false; cache.carnetMsg = "";
  cache.carnetDispo = false; cache.carnetBrouillons = {}; cache.carnetNouveaux = [];
  if (cache.demo) return;                       // la démo n'a pas de carnet semé
  const code = classe && classe.code_classe;
  if (!code) return;
  const { data, error } = await supabase
    .from("carnet_realisations")
    .select(CARNET_COLONNES)
    .eq("classe_code", code.toUpperCase())
    .order("cree_le", { ascending: false });
  if (error) return;                            // table absente ou RLS : carnet masqué
  cache.carnetDispo = true;                     // table lisible : l'abonnement temps réel a un sens
  cache.carnet = carnetFiltreGroupe(data, code);
  // On n'affiche la section que s'il y a quelque chose dedans. Un centre sans
  // l'option ne peut avoir AUCUNE ligne (carnet_soumettre la refuse côté
  // serveur) : il ne découvre donc pas une fonction qu'il n'a pas achetée.
  cache.carnetActif = cache.carnet.length > 0;
  if (!cache.carnetActif) return;
  const { data: h } = await supabase
    .from("carnet_heures")
    .select(CARNET_COLONNES_HEURES)
    .eq("classe_code", code.toUpperCase());
  cache.carnetHeures = carnetFiltreGroupe(h, code);
}

/* La photo n'est tirée qu'à la demande, une à la fois, et mise en cache pour la
   durée de la session. C'est ce qui garde l'ouverture d'un groupe légère. */
async function loadCarnetPhoto(id) {
  if (cache.carnetPhotos[id] !== undefined) return;
  cache.carnetPhotos[id] = null;                // marque « en cours »
  const { data } = await supabase
    .from("carnet_realisations").select("photo").eq("id", id).maybeSingle();
  cache.carnetPhotos[id] = (data && data.photo) || "";
  render();
}

/* ==================================================================
   TEMPS RÉEL — les réalisations arrivent toutes seules
   ==================================================================
   Pourquoi le temps réel marche ICI et pas côté élève :
   Supabase Realtime ne livre un changement à un abonné que si la policy
   `select` de la table l'autorise pour le rôle de son jeton. L'enseignant est
   authentifié et possède `carnet_lecture_enseignant` : il reçoit, cadré à son
   organisation. L'élève est `anon`, qui n'a AUCUN privilège sur la table et
   aucune policy : un abonnement anonyme ne lui livrerait rien — et il ne faut
   surtout pas lui en accorder un, la clé publiable étant dans le code source
   de la PWA. L'élève est servi autrement (voir chantierquest-web/carnet.js).

   TROIS PRINCIPES
   1. Un événement n'est qu'une SONNETTE. On ne lit aucune donnée du message :
      on relance un SELECT, qui repasse par la RLS. C'est ce qui garantit qu'une
      réalisation d'un autre centre ne peut pas apparaître, et ça évite au
      passage de faire voyager la photo base64 contenue dans le message.
   2. La relecture est DOUCE : elle ne touche que les données. La réalisation
      ouverte, la photo déjà chargée, le commentaire en cours de frappe et la
      position de lecture survivent.
   3. REPLI SYSTÉMATIQUE. Si l'abonnement ne se confirme pas (SQL de publication
      non exécuté, websocket bloqué par le pare-feu d'un CFP, session expirée),
      on passe à une relecture périodique. Le tableau de bord se met à jour tout
      seul dans tous les cas : c'est ce qui compte un jour de démonstration.
   ------------------------------------------------------------------ */

/* Les événements arrivent en grappe (un envoi d'élève = 1 INSERT, une décision
   = 1 UPDATE) : on regroupe les relectures. */
const CARNET_DEBOUNCE_MS = 400;
/* Si l'abonnement n'est pas confirmé dans ce délai, on allume le repli. */
const CARNET_RT_DELAI_MS = 8000;
/* Repli par relecture périodique : assez vif pour une démonstration projetée,
   assez lent pour rester invisible sur le réseau d'un centre. */
const CARNET_REPLI_MS = 25000;
/* On ne garde pas une liste de « nouveautés » infinie. */
const CARNET_NOUVEAUX_MAX = 40;

let carnetTimerDebounce = null;
let carnetTimerRepli = null;
let carnetTimerAttenteRt = null;
let carnetRelectureEnCours = false;
let carnetRelectureRedemandee = false;

function carnetRelireBientot(delai) {
  if (carnetTimerDebounce) clearTimeout(carnetTimerDebounce);
  carnetTimerDebounce = setTimeout(() => {
    carnetTimerDebounce = null;
    relireCarnet();
  }, typeof delai === "number" ? delai : CARNET_DEBOUNCE_MS);
}

/* Signature d'état : sert uniquement à savoir s'il faut redessiner. */
function carnetSignature(rows, heures) {
  return (rows || []).map(r => r.id + "|" + r.statut + "|" + (r.commentaire_prof || "") + "|" + (r.decide_le || "")).join(";")
    + "#" + (heures || []).map(h => h.appareil_id + "|" + h.total_heures + "|" + h.objectif_heures).join(";");
}

/* RELECTURE DOUCE — même requête que loadCarnet() (même SELECT filtré par la
   RLS, toujours SANS la colonne `photo`), mais elle ne remplace que les
   données. */
async function relireCarnet() {
  if (cache.demo || !cache.classe || !cache.carnetDispo) return;
  if (carnetRelectureEnCours) { carnetRelectureRedemandee = true; return; }
  carnetRelectureEnCours = true;
  const code = String(cache.classe.code_classe || "").toUpperCase();
  try {
    if (!code) return;
    const { data, error } = await supabase
      .from("carnet_realisations")
      .select(CARNET_COLONNES)
      .eq("classe_code", code)
      .order("cree_le", { ascending: false });
    if (error) return;                       // réseau ou RLS : on garde l'affichage actuel
    // Le groupe a changé pendant l'aller-retour : on jette la réponse.
    if (!cache.classe || String(cache.classe.code_classe || "").toUpperCase() !== code) return;

    const lignes = carnetFiltreGroupe(data, code);
    const avant = new Set(cache.carnet.map(r => r.id));
    const nouveaux = lignes.filter(r => !avant.has(r.id)).map(r => r.id);

    const { data: h } = await supabase
      .from("carnet_heures")
      .select(CARNET_COLONNES_HEURES)
      .eq("classe_code", code);
    if (!cache.classe || String(cache.classe.code_classe || "").toUpperCase() !== code) return;
    const heures = Array.isArray(h) ? carnetFiltreGroupe(h, code) : cache.carnetHeures;

    const avantSig = carnetSignature(cache.carnet, cache.carnetHeures);
    cache.carnet = lignes;
    cache.carnetHeures = heures;
    // La section apparaît d'elle-même à la première réalisation : un groupe
    // encore vide au début d'une démonstration n'oblige pas à recharger.
    if (lignes.length > 0) cache.carnetActif = true;
    if (nouveaux.length) {
      cache.carnetNouveaux = nouveaux.concat(cache.carnetNouveaux).slice(0, CARNET_NOUVEAUX_MAX);
    }
    if (carnetSignature(lignes, heures) !== avantSig) render(true);
  } catch (e) {
    /* hors ligne : on réessaiera au retour du réseau */
  } finally {
    carnetRelectureEnCours = false;
    if (carnetRelectureRedemandee) { carnetRelectureRedemandee = false; carnetRelireBientot(200); }
  }
}

/* UN ÉVÉNEMENT N'EST QU'UNE SONNETTE : aucune donnée du message n'est lue. */
function carnetEvenement(codeAbonne, payload) {
  if (!cache.classe) return;
  const codeOuvert = String(cache.classe.code_classe || "").toUpperCase();
  if (!codeOuvert || codeOuvert !== String(codeAbonne).toUpperCase()) return;  // canal d'un groupe refermé

  const ligne = (payload && (payload.new || payload.old)) || null;
  const codeEvt = ligne && ligne.classe_code ? String(ligne.classe_code).toUpperCase() : "";
  // Le message porte un code de classe qui n'est PAS celui du groupe ouvert :
  // on le jette sans même relire. (Ne devrait jamais arriver : filtre serveur
  // + RLS. C'est la bretelle.)
  if (codeEvt && codeEvt !== codeOuvert) return;
  // Code absent (DELETE, ou message tronqué par Realtime si la ligne dépasse sa
  // taille maximale) : on relit quand même, sans risque — la relecture est
  // bornée au groupe ouvert et refiltrée par la RLS.
  carnetRelireBientot();
}

function carnetRepliStart() {
  if (carnetTimerRepli) return;
  if (cache.rtEtat !== "on") cache.rtEtat = "repli";
  carnetTimerRepli = setInterval(() => {
    if (cache.demo || !cache.classe || !cache.carnetDispo) { carnetRepliStop(); return; }
    if (document.visibilityState !== "visible") return;   // onglet caché : on se tait
    relireCarnet();
  }, CARNET_REPLI_MS);
}
function carnetRepliStop() {
  if (carnetTimerRepli) { clearInterval(carnetTimerRepli); carnetTimerRepli = null; }
}

/* DÉSABONNEMENT — appelé au changement de groupe, à la déconnexion, à la sortie
   de la démo et quand la page est mise de côté. Coupe aussi les minuteries :
   pas de relecture fantôme derrière un enseignant déconnecté. */
function carnetRealtimeStop() {
  if (carnetTimerAttenteRt) { clearTimeout(carnetTimerAttenteRt); carnetTimerAttenteRt = null; }
  if (carnetTimerDebounce) { clearTimeout(carnetTimerDebounce); carnetTimerDebounce = null; }
  carnetRepliStop();
  const ch = cache.carnetChannel;
  cache.carnetChannel = null;
  cache.rtEtat = "off";
  if (ch) { try { supabase.removeChannel(ch); } catch (e) {} }
}

async function carnetRealtimeStart(classe) {
  carnetRealtimeStop();
  if (cache.demo) return;                                   // la démo n'a pas de carnet
  if (!classe || !classe.code_classe || !cache.carnetDispo) return;
  const code = String(classe.code_classe).toUpperCase();

  // Realtime diffuse SELON LES POLICIES DE LECTURE : il lui faut le jeton de la
  // session. Sans jeton il retomberait sur le rôle `anon`, qui n'a aucun
  // privilège sur la table — donc zéro événement. C'est exactement la barrière
  // qui protège l'app élève, et on ne la contourne pas : on s'authentifie.
  let jeton = "";
  try {
    const { data: sess } = await supabase.auth.getSession();
    jeton = (sess && sess.session && sess.session.access_token) || "";
  } catch (e) { jeton = ""; }
  if (!jeton) { carnetRepliStart(); if (cache.classe) render(true); return; }
  try {
    const r = supabase.realtime.setAuth(jeton);
    if (r && typeof r.then === "function") await r;
  } catch (e) { /* versions anciennes du client : setAuth synchrone ou absent */ }

  // Le groupe a pu changer pendant l'await.
  if (!cache.classe || String(cache.classe.code_classe || "").toUpperCase() !== code) return;

  cache.rtEtat = "lien";
  let ch = null;
  try {
    ch = supabase
      .channel("stagequest-" + code + "-" + Date.now())
      .on("postgres_changes",
          { event: "*", schema: "public", table: "carnet_realisations", filter: "classe_code=eq." + code },
          (payload) => carnetEvenement(code, payload))
      .subscribe((statut) => {
        if (statut === "SUBSCRIBED") {
          cache.rtEtat = "on";
          carnetRepliStop();
          if (carnetTimerAttenteRt) { clearTimeout(carnetTimerAttenteRt); carnetTimerAttenteRt = null; }
          // RATTRAPAGE. À la première connexion comme après une coupure réseau,
          // les changements survenus pendant le trou ne sont jamais rejoués par
          // Realtime : on relit une fois, tout de suite, pour repartir juste.
          carnetRelireBientot(0);
          if (cache.classe) render(true);
        } else if (statut === "CHANNEL_ERROR" || statut === "TIMED_OUT" || statut === "CLOSED") {
          // Coupure ou refus. Le client Supabase retente la connexion de son
          // côté ; en attendant, la relecture périodique prend le relais.
          if (cache.rtEtat !== "off") { cache.rtEtat = "repli"; carnetRepliStart(); }
          if (cache.classe) render(true);
        }
      });
  } catch (e) {
    carnetRepliStart();
    return;
  }
  cache.carnetChannel = ch;

  // Ceinture et bretelles : abonnement non confirmé au bout de 8 s → repli.
  carnetTimerAttenteRt = setTimeout(() => {
    carnetTimerAttenteRt = null;
    if (cache.rtEtat !== "on") { carnetRepliStart(); if (cache.classe) render(true); }
  }, CARNET_RT_DELAI_MS);
}

/* RECONNEXION — au retour au premier plan et au retour du réseau. Un canal peut
   être mort sans que personne ne l'ait annoncé (veille de l'écran, bascule de
   Wi-Fi) : on le refait à neuf, sinon on relit simplement par sécurité. */
function carnetRealtimeCheck() {
  if (cache.demo || !cache.classe || !cache.carnetDispo) return;
  if (document.visibilityState !== "visible") return;
  const ch = cache.carnetChannel;
  const etat = ch && typeof ch.state === "string" ? ch.state : "";
  if (etat !== "joined" && etat !== "joining") { carnetRealtimeStart(cache.classe); return; }
  carnetRelireBientot(150);
}


/* LA DÉCISION DE L'ENSEIGNANT.
   Un simple UPDATE : la RLS vérifie que la réalisation appartient bien à une de
   ses classes, et les privilèges de COLONNE font que seules `statut` et
   `commentaire_prof` sont modifiables — la photo, la note et le geste de l'élève
   sont hors d'atteinte, Postgres refuserait. `decide_par` et `decide_le` sont
   posés par le trigger côté serveur, jamais par ce code. */
async function decideCarnet(id, statut) {
  // Le brouillon du cache fait foi si le champ n'est plus dans le DOM (une
  // relecture temps réel a pu redessiner la page entre-temps).
  const champ = document.getElementById("carnetComm-" + id);
  const brut = champ ? champ.value : (cache.carnetBrouillons[id] || "");
  const commentaire = String(brut || "").trim().slice(0, 500);
  if (statut === "refaire" && !commentaire) {
    cache.carnetMsg = "Écris un commentaire avant de renvoyer le geste : c'est ce que l'élève verra dans son app.";
    render();
    return;
  }
  cache.carnetMsg = "";
  const { error } = await supabase
    .from("carnet_realisations")
    .update({ statut, commentaire_prof: commentaire || null })
    .eq("id", id);
  if (error) {
    cache.carnetMsg = "La décision n'a pas pu être enregistrée : " + error.message;
    render();
    return;
  }
  const r = cache.carnet.find(x => x.id === id);
  if (r) { r.statut = statut; r.commentaire_prof = commentaire || null; r.decide_le = new Date().toISOString(); r.decide_par = cache.userEmail || ""; }
  delete cache.carnetBrouillons[id];
  cache.carnetNouveaux = cache.carnetNouveaux.filter(x => x !== id);
  cache.carnetSel = null;
  render();
}

function carnetAttente() { return cache.carnet.filter(r => r.statut === "attente"); }
function carnetNomEleve(r) { return r.eleve_nom || r.eleve_totem || "Élève"; }
function carnetHeuresDe(appareilId) {
  return cache.carnetHeures.find(h => h.appareil_id === appareilId) || null;
}

/* Statistiques par élève, à partir de la progression réelle. */
function statsEleve(eleveId) {
  const rows = cache.prog.filter(p => p.eleve_id === eleveId);
  const reussis = rows.filter(r => r.meilleur_score >= 70);
  const maitrises = new Set(reussis.filter(r => r.niveau === 3).map(r => r.module_id));
  return { niveauxReussis: reussis.length, modulesMaitrises: maitrises.size, rows };
}

/* ==================================================================
   MESSAGERIE ENSEIGNANT → ÉLÈVE (sens unique) — tableau de bord de BASE
   ==================================================================
   Fait partie du tableau de bord pour TOUTES les licences. Totalement
   indépendante du carnet de stage : autres tables, autres fonctions, aucune
   option de licence, aucune variable partagée avec le code StageQuest.
   SQL : supabase_messagerie.sql (à la racine de ce dépôt).

   · L'enseignant écrit à UN élève (son totem) ou à TOUTE la classe : message
     rapide ou texte libre de 280 caractères au plus (borne aussi en base).
   · L'élève ne répond pas par écrit : il accuse (👍 Compris / ✋ J'en parle
     en classe). On affiche l'état : non lu / lu / accusé, avec la date.
   · Tous les enseignants de la même organisation voient tous les messages,
     avec l'auteur. Voulu : aucun canal privé caché entre un adulte et un
     mineur. Le courriel de l'auteur n'est JAMAIS montré à l'élève.

   LECTURE / ÉCRITURE : directement sur les tables, sous RLS (policies
   `to authenticated` cadrées sur les classes de mon_organisation()), avec
   un INSERT limité à 5 colonnes. L'auteur et la date sont posés par un
   trigger côté serveur.

   TEMPS RÉEL : même patron que le carnet, mais code et canal SÉPARÉS. Un
   événement n'est qu'une sonnette : on relit par un SELECT refiltré par la
   RLS. Repli automatique en relecture toutes les 30 s.

   ⚠️ ÉCHAPPEMENT : le texte libre, le nom affiché, le courriel de l'auteur ET
   le totem / l'identifiant de l'élève (envoyés par l'app élève, donc par
   n'importe qui) passent TOUS par esc() avant d'entrer dans le HTML. */

const MSG_MAX = 280;
const MSG_RAPIDES = [
  { id: "bravo",       t: "Bravo, continue!" },
  { id: "revoir",      t: "Reviens sur ce module" },
  { id: "voir_classe", t: "Viens me voir en classe" },
  { id: "progres",     t: "Beau progrès cette semaine" }
];
const MSG_ACCUSE = {
  compris:   { t: "👍 Compris",              c: "ok" },
  en_classe: { t: "✋ J'en parle en classe", c: "warn" }
};
const MSG_SIGNATURE_KEY = "qe_msg_signature";
const MSG_COLONNES = "id,classe_id,eleve_id,modele,texte,auteur_nom,auteur_courriel,cree_le";
const MSG_COLONNES_LECT = "message_id,eleve_id,classe_id,lu_le,accuse,accuse_le";
const MSG_LIMITE = 200;
const MSG_DEBOUNCE_MS = 400;
const MSG_RT_DELAI_MS = 8000;
const MSG_REPLI_MS = 30000;

function msgVide() {
  return { dispo: false, liste: [], lectures: [], dest: "", brouillon: "", info: "", erreur: "",
    envoi: false, rt: "off", ouvert: null };
}
/* L'état de la messagerie vit dans `cache.msg`, créé à la demande : il suit
   donc les remises à zéro de `cache` (déconnexion, démo) sans toucher à
   cacheVide(). */
function M() { if (!cache.msg) cache.msg = msgVide(); return cache.msg; }
function msgDispo() { return !cache.demo && !!cache.classe && !!cache.msg && cache.msg.dispo; }

function msgLireSignature() {
  try { return String(localStorage.getItem(MSG_SIGNATURE_KEY) || "").slice(0, 60); } catch (_) { return ""; }
}
function msgEcrireSignature(v) {
  try { localStorage.setItem(MSG_SIGNATURE_KEY, String(v || "").trim().slice(0, 60)); } catch (_) {}
}

function msgQuand(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("fr-CA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
function msgEleve(id) { return (cache.eleves || []).find((e) => e.id === id) || null; }
function msgTotem(id) {
  const e = msgEleve(id);
  return e ? e.totem || "Élève" : "Élève retiré du groupe";
}
function msgAuteur(m) {
  if (cache.userEmail && m.auteur_courriel === cache.userEmail) return m.auteur_nom ? `${m.auteur_nom} (toi)` : "Toi";
  if (m.auteur_nom) return `${m.auteur_nom} · ${m.auteur_courriel || ""}`;
  return m.auteur_courriel || "Enseignant(e)";
}
function msgLecture(messageId, eleveId) {
  return M().lectures.find((l) => l.message_id === messageId && l.eleve_id === eleveId) || null;
}
/* État d'UN élève pour UN message : non lu / lu / accusé. */
function msgEtat(lect) {
  if (!lect) return { c: "mut", t: "Non lu" };
  if (lect.accuse && MSG_ACCUSE[lect.accuse]) {
    return { c: MSG_ACCUSE[lect.accuse].c, t: `${MSG_ACCUSE[lect.accuse].t} · ${msgQuand(lect.accuse_le)}` };
  }
  return { c: "lu", t: `Lu · ${msgQuand(lect.lu_le)}` };
}

/* ------------------ Lecture (sous RLS) ------------------ */

/* Les accusés sont tirés page par page : une classe de 30 élèves × 200
   messages de classe dépasserait la limite de 1000 lignes par requête. */
async function msgLireLectures(classeId, ids) {
  const out = [];
  if (!ids.length) return out;
  for (let de = 0; de < 20000; de += 1000) {
    const { data, error } = await supabase
      .from("messages_lectures").select(MSG_COLONNES_LECT)
      .eq("classe_id", classeId).in("message_id", ids)
      .order("message_id").order("eleve_id")
      .range(de, de + 999);
    if (error) return null;
    out.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

/* Renvoie true si les tables sont lisibles (SQL exécuté), false sinon. */
async function msgLire(classeId) {
  const { data, error } = await supabase
    .from("messages_enseignant").select(MSG_COLONNES)
    .eq("classe_id", classeId)
    .order("cree_le", { ascending: false })
    .limit(MSG_LIMITE);
  if (error) return false;
  // DEUXIÈME BARRIÈRE : on revalide côté client que chaque ligne est bien du
  // groupe ouvert, même si la RLS l'a déjà garanti.
  const liste = (data || []).filter((m) => m && m.classe_id === classeId);
  const lect = await msgLireLectures(classeId, liste.map((m) => m.id));
  if (!cache.classe || cache.classe.id !== classeId) return true;   // groupe changé : réponse jetée
  M().liste = liste;
  if (lect) M().lectures = lect.filter((l) => l && l.classe_id === classeId);
  return true;
}

async function loadMessages(classe) {
  const garde = cache.msg ? { dest: "", brouillon: cache.msg.brouillon } : null;
  cache.msg = msgVide();
  if (garde) cache.msg.brouillon = garde.brouillon;   // un brouillon survit au changement de groupe
  if (cache.demo || !classe || !classe.id) return;
  try { cache.msg.dispo = await msgLire(classe.id); }
  catch (_) { cache.msg.dispo = false; }              // hors ligne / SQL absent : messagerie masquée
}

/* ------------------ Envoi ------------------ */

async function msgEnvoyer() {
  const m = M();
  if (m.envoi || !msgDispo()) return;
  const champ = document.getElementById("msgTexte");
  const texte = String(champ ? champ.value : m.brouillon || "").trim();
  m.brouillon = texte;
  m.info = ""; m.erreur = "";
  if (!texte) { m.erreur = "Écris un message ou choisis un message rapide."; render(); return; }
  if (texte.length > MSG_MAX) { m.erreur = `Le message dépasse ${MSG_MAX} caractères.`; render(); return; }
  // Le destinataire doit être un élève du groupe OUVERT (la policy le revérifie).
  const eleve = m.dest ? msgEleve(m.dest) : null;
  if (m.dest && !eleve) { m.erreur = "Cet élève n'est plus dans le groupe."; m.dest = ""; render(); return; }
  const rapide = MSG_RAPIDES.find((r) => r.t === texte);
  const signature = msgLireSignature().trim();
  const classeId = cache.classe.id;
  m.envoi = true; render(true);
  let error = null;
  try {
    ({ error } = await supabase.from("messages_enseignant").insert({
      classe_id: classeId,
      eleve_id: eleve ? eleve.id : null,
      modele: rapide ? rapide.id : null,
      texte,
      auteur_nom: signature || null
    }));
  } catch (e) { error = { message: "réseau indisponible" }; }
  m.envoi = false;
  if (error) {
    m.erreur = "Le message n'a pas pu être envoyé : " + (error.message || "erreur inconnue");
    render();
    return;
  }
  m.brouillon = "";
  m.info = eleve ? `Message envoyé à ${eleve.totem || "l'élève"}.` : "Message envoyé à toute la classe.";
  if (cache.classe && cache.classe.id === classeId) await msgLire(classeId);
  render();
}

/* ------------------ Temps réel (sonnette) + repli ------------------ */

let msgChannel = null;
let msgTimerDebounce = null;
let msgTimerRepli = null;
let msgTimerAttente = null;
let msgRelectureEnCours = false;
let msgRelectureRedemandee = false;

function msgSignatureEtat() {
  const m = M();
  return m.liste.map((x) => x.id).join(",") + "#" +
    m.lectures.map((l) => `${l.message_id}|${l.eleve_id}|${l.lu_le}|${l.accuse || ""}|${l.accuse_le || ""}`).sort().join(";");
}

function msgRelireBientot(delai) {
  if (msgTimerDebounce) clearTimeout(msgTimerDebounce);
  msgTimerDebounce = setTimeout(() => { msgTimerDebounce = null; msgRelire(); },
    typeof delai === "number" ? delai : MSG_DEBOUNCE_MS);
}

async function msgRelire() {
  if (!msgDispo()) return;
  if (msgRelectureEnCours) { msgRelectureRedemandee = true; return; }
  msgRelectureEnCours = true;
  try {
    const avant = msgSignatureEtat();
    await msgLire(cache.classe.id);
    if (msgDispo() && msgSignatureEtat() !== avant) render(true);
  } catch (_) {
    /* hors ligne : on réessaiera */
  } finally {
    msgRelectureEnCours = false;
    if (msgRelectureRedemandee) { msgRelectureRedemandee = false; msgRelireBientot(200); }
  }
}

function msgRepliStart() {
  if (msgTimerRepli) return;
  if (cache.msg && cache.msg.rt !== "on") cache.msg.rt = "repli";
  msgTimerRepli = setInterval(() => {
    if (!msgDispo()) { msgRepliStop(); return; }
    if (document.visibilityState !== "visible") return;
    msgRelire();
  }, MSG_REPLI_MS);
}
function msgRepliStop() {
  if (msgTimerRepli) { clearInterval(msgTimerRepli); msgTimerRepli = null; }
}

function msgRealtimeStop() {
  if (msgTimerAttente) { clearTimeout(msgTimerAttente); msgTimerAttente = null; }
  if (msgTimerDebounce) { clearTimeout(msgTimerDebounce); msgTimerDebounce = null; }
  msgRepliStop();
  const ch = msgChannel;
  msgChannel = null;
  if (cache.msg) cache.msg.rt = "off";
  if (ch) { try { supabase.removeChannel(ch); } catch (_) {} }
}

async function msgRealtimeStart(classe) {
  msgRealtimeStop();
  if (!msgDispo() || !classe || !classe.id) return;
  const classeId = classe.id;
  let jeton = "";
  try {
    const { data: sess } = await supabase.auth.getSession();
    jeton = (sess && sess.session && sess.session.access_token) || "";
  } catch (_) { jeton = ""; }
  if (!jeton) { msgRepliStart(); return; }
  try {
    const r = supabase.realtime.setAuth(jeton);
    if (r && typeof r.then === "function") await r;
  } catch (_) {}
  if (!cache.classe || cache.classe.id !== classeId || !msgDispo()) return;

  M().rt = "lien";
  const sonnette = () => {
    if (!cache.classe || cache.classe.id !== classeId) return;   // canal d'un groupe refermé
    msgRelireBientot();                                         // aucune donnée du message n'est lue
  };
  try {
    msgChannel = supabase
      .channel("messagerie-" + classeId + "-" + Date.now())
      .on("postgres_changes",
          { event: "*", schema: "public", table: "messages_enseignant", filter: "classe_id=eq." + classeId },
          sonnette)
      .on("postgres_changes",
          { event: "*", schema: "public", table: "messages_lectures", filter: "classe_id=eq." + classeId },
          sonnette)
      .subscribe((statut) => {
        if (!cache.msg) return;
        if (statut === "SUBSCRIBED") {
          cache.msg.rt = "on";
          msgRepliStop();
          if (msgTimerAttente) { clearTimeout(msgTimerAttente); msgTimerAttente = null; }
          msgRelireBientot(0);                                   // rattrapage après coupure
          if (cache.view === "messages") render(true);
        } else if (statut === "CHANNEL_ERROR" || statut === "TIMED_OUT" || statut === "CLOSED") {
          if (cache.msg.rt !== "off") { cache.msg.rt = "repli"; msgRepliStart(); }
          if (cache.view === "messages") render(true);
        }
      });
  } catch (_) {
    msgRepliStart();
    return;
  }
  msgTimerAttente = setTimeout(() => {
    msgTimerAttente = null;
    if (cache.msg && cache.msg.rt !== "on") { msgRepliStart(); if (cache.view === "messages") render(true); }
  }, MSG_RT_DELAI_MS);
}

function msgRealtimeCheck() {
  if (!msgDispo() || document.visibilityState !== "visible") return;
  const etat = msgChannel && typeof msgChannel.state === "string" ? msgChannel.state : "";
  if (etat !== "joined" && etat !== "joining") { msgRealtimeStart(cache.classe); return; }
  msgRelireBientot(150);
}

/* ------------------ Rendu ------------------ */

/* Une carte de l'historique. */
function msgCarteHTML(m) {
  const pourEleve = !!m.eleve_id;
  const ouvert = M().ouvert === m.id;
  let etat;
  if (pourEleve) {
    const s = msgEtat(msgLecture(m.id, m.eleve_id));
    etat = `<span class="pill ${s.c}">${esc(s.t)}</span>`;
  } else {
    const eleves = cache.eleves || [];
    const lect = M().lectures.filter((l) => l.message_id === m.id);
    const lus = lect.length;
    const compris = lect.filter((l) => l.accuse === "compris").length;
    const enClasse = lect.filter((l) => l.accuse === "en_classe").length;
    etat = `<span class="msg-compte">Lu par <b>${lus}</b> / ${eleves.length} · 👍 <b>${compris}</b> · ✋ <b>${enClasse}</b></span>
      <button class="msg-detail" data-msg-ouvrir="${esc(m.id)}">${ouvert ? "Masquer" : "Détail"}</button>`;
  }
  const detail = !pourEleve && ouvert ? `
    <div class="msg-detail-liste">
      ${(cache.eleves || []).length ? (cache.eleves || []).map((e) => {
        const s = msgEtat(msgLecture(m.id, e.id));
        return `<div class="msg-detail-l"><span class="em">${emojiFor(e.totem)}</span><b>${esc(e.totem)}</b><span class="pill ${s.c}">${esc(s.t)}</span></div>`;
      }).join("") : `<div class="msg-detail-l">Aucun élève dans ce groupe.</div>`}
    </div>` : "";
  return `
    <article class="msg-carte">
      <div class="msg-tete">
        <span class="msg-dest">${pourEleve
          ? `<span class="em">${emojiFor(msgTotem(m.eleve_id))}</span> ${esc(msgTotem(m.eleve_id))}`
          : `👥 Toute la classe`}</span>
        <span class="msg-quand">${esc(msgQuand(m.cree_le))}</span>
      </div>
      <p class="msg-texte">${esc(m.texte)}</p>
      <div class="msg-pied">
        <span class="msg-auteur">de ${esc(msgAuteur(m))}</span>
        <span class="msg-etat">${etat}</span>
      </div>
      ${detail}
    </article>`;
}

function renderMessagesView() {
  const c = cache.classe;
  const m = M();
  const eleves = (cache.eleves || []).slice().sort((a, b) => String(a.totem || "").localeCompare(String(b.totem || ""), "fr"));
  if (m.dest && !msgEleve(m.dest)) m.dest = "";
  const options = [`<option value="">👥 Toute la classe (${eleves.length} élève${eleves.length > 1 ? "s" : ""})</option>`]
    .concat(eleves.map((e) => `<option value="${esc(e.id)}"${m.dest === e.id ? " selected" : ""}>${emojiFor(e.totem)} ${esc(e.totem)}</option>`))
    .join("");
  const restant = MSG_MAX - String(m.brouillon || "").length;
  const etatLive = m.rt === "on"
    ? { c: "on", t: "● En direct", aide: "Les accusés des élèves apparaissent d'eux-mêmes." }
    : m.rt === "repli"
      ? { c: "repli", t: "◍ Mise à jour automatique", aide: "Le direct n'est pas disponible sur ce réseau : la liste se relit toutes les 30 secondes." }
      : { c: "", t: "◌ Connexion…", aide: "Mise en place de la mise à jour automatique." };

  return shell(`${esc(cache.org.nom)} › ${esc(c.nom)} › <b>Messages</b>`, `
    <div class="view">
      <button class="back" data-nav="cohort">← Retour au groupe</button>
      <h1>📬 Messages</h1>
      <p class="subtitle">${esc(c.nom)} · tu écris, l'élève lit. Il ne peut pas répondre par écrit : il choisit « 👍 Compris » ou « ✋ J'en parle en classe ».</p>
      <div class="clive-bar">
        <span class="clive ${etatLive.c}" title="${etatLive.aide}">${etatLive.t}</span>
        <button class="crelire" data-msg-relire title="Relit la liste maintenant">↻ Actualiser</button>
      </div>

      <section class="msg-compose">
        <label for="msgDest">Destinataire</label>
        <select id="msgDest" data-msg-dest>${options}</select>
        ${eleves.length ? "" : `<p class="msg-aide">Aucun élève n'a encore activé le partage dans ce groupe : un message envoyé maintenant ne sera lu par personne tant qu'aucun élève n'aura rejoint le groupe.</p>`}

        <label>Messages rapides</label>
        <div class="msg-rapides">
          ${MSG_RAPIDES.map((r) => `<button type="button" class="msg-rapide${m.brouillon === r.t ? " on" : ""}" data-msg-rapide="${r.id}">${esc(r.t)}</button>`).join("")}
        </div>

        <label for="msgTexte">Ton message <span class="msg-cpt${restant < 20 ? " bas" : ""}" id="msgCpt">${restant} caractère${restant > 1 ? "s" : ""} restant${restant > 1 ? "s" : ""}</span></label>
        <textarea id="msgTexte" data-msg-texte maxlength="${MSG_MAX}" placeholder="Ex. : Beau travail sur la prévention des infections. Reviens sur le niveau 2 avant vendredi.">${esc(m.brouillon)}</textarea>

        <label for="msgSignature">Signer comme <span class="msg-facultatif">(facultatif)</span></label>
        <input id="msgSignature" data-msg-signature type="text" maxlength="60" placeholder="Ex. : Mme Ouellet" value="${esc(msgLireSignature())}" />
        <p class="msg-aide">L'élève voit ce nom, ou « Ton enseignant(e) » s'il est vide. Ton courriel ne lui est jamais montré. Tes collègues du centre voient tous les messages, avec leur auteur.</p>
        <p class="msg-aide">⚠️ N'écris aucun renseignement personnel (nom réel, santé, famille) : le message est conservé 12 mois.</p>

        ${m.erreur ? `<div class="cmsg">${esc(m.erreur)}</div>` : ""}
        ${m.info ? `<div class="msg-ok">${esc(m.info)}</div>` : ""}
        <button class="cbtn ok" data-msg-envoyer ${m.envoi ? "disabled" : ""}>${m.envoi ? "Envoi…" : "Envoyer"}</button>
      </section>

      <h2 class="csec">Messages envoyés à ce groupe</h2>
      <div class="clist">
        ${m.liste.length ? m.liste.map(msgCarteHTML).join("") : `<div class="empty">Aucun message envoyé à ce groupe pour l'instant.</div>`}
      </div>
      <p class="note">« Lu » = l'élève a ouvert ses messages dans son app. Seuls les élèves qui ont activé le partage reçoivent les messages. Les messages et accusés sont effacés après 12 mois.</p>
    </div>`);
}

/* Bloc de la fiche élève : ses messages (personnels et de classe) et leur état. */
function msgFicheHTML(eleve) {
  if (!msgDispo() || !eleve) return "";
  const siens = M().liste.filter((m) => !m.eleve_id || m.eleve_id === eleve.id).slice(0, 10);
  const lignes = siens.length ? siens.map((m) => {
    const s = msgEtat(msgLecture(m.id, eleve.id));
    return `<div class="msg-fiche-l">
      <div class="msg-fiche-t"><span>${m.eleve_id ? "À cet élève" : "👥 À la classe"} · ${esc(msgQuand(m.cree_le))}</span><span class="pill ${s.c}">${esc(s.t)}</span></div>
      <p class="msg-texte">${esc(m.texte)}</p>
    </div>`;
  }).join("") : `<p class="msg-aide">Aucun message pour l'instant.</p>`;
  return `
    <section class="msg-fiche">
      <div class="msg-fiche-h">
        <h2 class="csec">📬 Messages</h2>
        <button class="cbtn ghost" data-msg-ecrire="${esc(eleve.id)}">✉️ Écrire à ${esc(eleve.totem)}</button>
      </div>
      ${lignes}
    </section>`;
}

/* Branche les gestes de la messagerie après chaque render(). */
function msgBind() {
  root.querySelectorAll("[data-msg-ecrire]").forEach((el) => el.addEventListener("click", () => {
    const m = M();
    m.dest = msgEleve(el.dataset.msgEcrire) ? el.dataset.msgEcrire : "";
    m.info = ""; m.erreur = "";
    cache.view = "messages";
    render();
    const t = document.getElementById("msgTexte");
    if (t) t.focus();
  }));
  const dest = root.querySelector("[data-msg-dest]");
  if (dest) dest.addEventListener("change", () => { M().dest = dest.value; M().info = ""; });
  const texte = root.querySelector("[data-msg-texte]");
  if (texte) texte.addEventListener("input", () => {
    M().brouillon = texte.value;
    const r = MSG_MAX - texte.value.length;
    const cpt = document.getElementById("msgCpt");
    if (cpt) { cpt.textContent = `${r} caractère${r > 1 ? "s" : ""} restant${r > 1 ? "s" : ""}`; cpt.classList.toggle("bas", r < 20); }
    root.querySelectorAll("[data-msg-rapide]").forEach((b) => {
      const q = MSG_RAPIDES.find((x) => x.id === b.dataset.msgRapide);
      b.classList.toggle("on", !!q && q.t === texte.value.trim());
    });
  });
  const sig = root.querySelector("[data-msg-signature]");
  if (sig) sig.addEventListener("input", () => msgEcrireSignature(sig.value));
  root.querySelectorAll("[data-msg-rapide]").forEach((el) => el.addEventListener("click", () => {
    const q = MSG_RAPIDES.find((x) => x.id === el.dataset.msgRapide);
    if (!q) return;
    M().brouillon = q.t; M().info = ""; M().erreur = "";
    render();
    const t = document.getElementById("msgTexte");
    if (t) { t.focus(); try { t.setSelectionRange(t.value.length, t.value.length); } catch (_) {} }
  }));
  const env = root.querySelector("[data-msg-envoyer]");
  if (env) env.addEventListener("click", msgEnvoyer);
  const rel = root.querySelector("[data-msg-relire]");
  if (rel) rel.addEventListener("click", () => { M().info = ""; msgRelire(); });
  root.querySelectorAll("[data-msg-ouvrir]").forEach((el) => el.addEventListener("click", () => {
    const m = M();
    m.ouvert = m.ouvert === el.dataset.msgOuvrir ? null : el.dataset.msgOuvrir;
    render(true);
  }));
}

/* ------------------ Rendu ------------------ */

function shell(crumbs, body) {
  const licDate = cache.org.licence_fin
    ? new Date(cache.org.licence_fin + "T00:00:00").toLocaleDateString("fr-CA", { day:"numeric", month:"long", year:"numeric" })
    : "—";
  const who = cache.demo
    ? `<div class="who"><b>Mode démonstration</b>${cache.org.nom}<br><button data-exitdemo>Quitter la démo</button></div>`
    : `<div class="who"><b>${cache.userEmail || ""}</b>${cache.org.nom}<br><button data-signout>Se déconnecter</button></div>`;
  const demoBanner = cache.demo
    ? `<div class="demo-banner">🔍 <b>Mode démonstration</b> — données fictives. Aucune donnée réelle d'élève.</div>`
    : "";
  return `
  <div class="app">
    <aside class="side">
      <div class="brand"><span class="mk">🛡️</span><span><b>Quest</b><small>ESPACE ENSEIGNANT</small></span></div>
      <div class="navlbl">Mes groupes</div>
      <button class="nav ${cache.view==='classes'?'on':''}" data-nav="classes">▦ Vue d'ensemble</button>
      ${cache.classe ? `<button class="nav ${(cache.view==='cohort'||cache.view==='student')?'on':''}" data-nav="cohort">👥 ${cache.classe.nom}</button>` : ""}
      ${cache.classe && cache.carnetActif ? `<button class="nav ${cache.view==='carnet'?'on':''}" data-nav="carnet">🦺 ${CARNET_NOM}${carnetAttente().length ? ` <span class="navbadge">${carnetAttente().length}</span>` : ""}</button>` : ""}
      ${cache.classe && msgDispo() ? `<button class="nav ${cache.view==='messages'?'on':''}" data-nav="messages">📬 Messages</button>` : ""}
      ${who}
    </aside>
    <div class="main">
      ${demoBanner}
      <div class="top">
        <div class="crumbs">${crumbs}</div>
        <div class="lic"><span class="dot"></span><em>Licence jusqu'au</em> <b>${licDate}</b></div>
      </div>
      ${body}
    </div>
  </div>`;
}

function renderClasses() {
  const cards = cache.classes.length ? cache.classes.map(c => `
    <div class="ccard" data-open="${c.id}">
      <h3>${esc(c.nom || c.code_classe)}</h3>
      <div class="prog-name">${esc(c.programme || "")}</div>
      <div class="rowk"><span>Code de classe</span><b>${esc(c.code_classe)}</b></div>
    </div>`).join("") : `<div class="empty">Aucun groupe pour l'instant.</div>`;
  return shell(`${cache.org.nom}`, `
    <div class="view">
      <h1>Mes groupes</h1>
      <p class="subtitle">Chaque groupe rassemble les élèves qui ont saisi ton code et accepté de partager.</p>
      <div class="grid">${cards}</div>
      <p class="note">Un élève qui révise sans partager n'apparaît nulle part — c'est son choix.</p>
    </div>`);
}

function renderCohort() {
  const c = cache.classe;
  const eleves = cache.eleves.map(e => ({ ...e, ...statsEleve(e.id) }))
    .sort((a, b) => b.niveauxReussis - a.niveauxReussis);
  const max = Math.max(1, ...eleves.map(e => e.niveauxReussis));
  const totalReussis = eleves.reduce((s, e) => s + e.niveauxReussis, 0);
  const actifs = eleves.filter(e => joursDepuis(e.vu_le) <= 7).length;
  const aRelancer = eleves.filter(e => joursDepuis(e.vu_le) > 7).length;

  const rows = eleves.length ? eleves.map(e => {
    const pct = Math.round(e.niveauxReussis / max * 100);
    const cls = joursDepuis(e.vu_le) > 7 ? "lo" : (pct >= 80 ? "hi" : "");
    const etat = joursDepuis(e.vu_le) > 7
      ? `<span class="pill warn">À relancer</span>`
      : `<span class="pill ok">Actif</span>`;
    return `<tr class="clic" data-eleve="${esc(e.id)}">
      <td><div class="totem"><span class="em">${emojiFor(e.totem)}</span><b>${esc(e.totem)}</b></div></td>
      <td><span class="bar"><i class="${cls}" style="width:${pct}%"></i></span><span class="barnum">${e.niveauxReussis} niv.</span></td>
      <td class="num">${e.modulesMaitrises}</td>
      <td style="color:var(--ink-soft)">${dateRelative(e.vu_le)}</td>
      <td>${etat}</td>
    </tr>`;
  }).join("") : `<tr><td colspan="5" style="padding:30px;text-align:center;color:var(--ink-soft)">Aucun élève n'a encore rejoint ce groupe.</td></tr>`;

  return shell(`${cache.org.nom} › <b>${c.nom}</b>`, `
    <div class="view">
      <h1>${c.nom}</h1>
      <p class="subtitle">${c.programme || ""} · ${eleves.length} élève${eleves.length>1?"s":""} rattaché${eleves.length>1?"s":""}</p>
      <div class="kpis">
        <div class="kpi"><u>Élèves</u><strong>${eleves.length}</strong></div>
        <div class="kpi"><u>Niveaux réussis</u><strong>${totalReussis}</strong></div>
        <div class="kpi"><u>Actifs (7 j)</u><strong>${actifs}</strong></div>
        <div class="kpi ${aRelancer?'alert':''}"><u>À relancer</u><strong>${aRelancer}</strong></div>
        ${msgDispo() ? `<div class="kpi clic" data-nav="messages"><u>📬 Messages envoyés</u><strong>${M().liste.length}</strong></div>` : ""}
        ${cache.carnetActif ? `<div class="kpi clic ${carnetAttente().length?'alert':''}" data-nav="carnet"><u>${CARNET_NOM} · à traiter</u><strong>${carnetAttente().length}</strong></div>` : ""}
      </div>
      <div class="tablewrap"><table>
        <thead><tr><th>Totem</th><th>Progression</th><th>Modules maîtrisés</th><th>Dernière activité</th><th>État</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="note">« Modules maîtrisés » = niveau 3 réussi. « À relancer » = aucune activité depuis plus de 7 jours. Les totems remplacent les noms réels.</p>
    </div>`);
}

/* ------------------ Vue « carnet de stage » ------------------
   Les réalisations entrantes avec leur photo, et les deux actions de
   l'enseignant : Validé, ou À refaire avec un commentaire. */
function renderCarnetView() {
  const c = cache.classe;
  const attente = carnetAttente();
  const traitees = cache.carnet.filter(r => r.statut !== "attente");
  const validees = cache.carnet.filter(r => r.statut === "validee").length;
  const aRefaire = cache.carnet.filter(r => r.statut === "refaire").length;
  const enStage = new Set(cache.carnet.map(r => r.appareil_id)).size;

  const carte = (r) => {
    const st = CARNET_STATUT[r.statut] || CARNET_STATUT.attente;
    const ouvert = cache.carnetSel === r.id;
    // Arrivée pendant cette session : mise en évidence, pour qu'on la voie
    // apparaître sur un écran projeté sans avoir à la chercher.
    const neuf = cache.carnetNouveaux.indexOf(r.id) !== -1;
    const photo = cache.carnetPhotos[r.id];
    const h = carnetHeuresDe(r.appareil_id);
    const bloc = photo === undefined
      ? `<button class="cbtn ghost" data-carnet-photo="${r.id}">📷 Voir la photo</button>`
      : photo === null
        ? `<div class="cphoto-load">Chargement de la photo…</div>`
        : photo
          ? `<img class="cphoto" src="${esc(photo)}" alt="Photo du travail de ${esc(carnetNomEleve(r))}" />`
          : `<div class="cphoto-load">Aucune photo n'a été joint à cette réalisation.</div>`;
    return `
      <article class="ccase ${ouvert ? "open" : ""}${neuf ? " cneuf" : ""}">
        <div class="ccase-head" data-carnet-open="${r.id}">
          <span class="em">${emojiFor(r.eleve_totem)}</span>
          <div class="ccase-id">
            <b>${esc(gesteTitle(r.geste_id, r.geste_nom))}${gesteEstLibre(r.geste_id) ? ` <span class="clibre-tag" title="Geste que l'élève a écrit lui-même : il ne figure pas dans la liste et ne débloque pas de badge dans son app.">écrit par l'élève</span>` : ""}${neuf ? ` <span class="cneuf-tag">nouveau</span>` : ""}</b>
            <span>${esc(carnetNomEleve(r))}${r.employeur ? " · " + esc(r.employeur) : ""}${r.engin ? " · " + esc(r.engin) : ""}</span>
          </div>
          <span class="pill ${st.c}">${st.t}</span>
          <span class="ccase-date">${dateRelative(r.cree_le)}</span>
        </div>
        ${ouvert ? `
        <div class="ccase-body">
          ${bloc}
          ${r.note ? `<p class="cnote">« ${esc(r.note)} »</p>` : `<p class="cnote vide">L'élève n'a pas laissé de note.</p>`}
          <div class="cmeta">
            Reçue ${r.recu_le ? dateRelative(r.recu_le) : "—"}${h ? ` · ${h.total_heures} h de stage déclarées${h.objectif_heures ? " sur " + h.objectif_heures + " h" : ""}` : ""}
          </div>
          ${r.statut === "attente" ? `
            <label for="carnetComm-${r.id}">Commentaire pour l'élève</label>
            <textarea id="carnetComm-${r.id}" data-carnet-comm="${r.id}" maxlength="500" placeholder="Ex. : belle tranchée, surveille ta pente la prochaine fois.">${esc(cache.carnetBrouillons[r.id] || "")}</textarea>
            <div class="cactions">
              <button class="cbtn ok" data-carnet-ok="${r.id}">✓ Validé</button>
              <button class="cbtn redo" data-carnet-redo="${r.id}">↩ À refaire</button>
            </div>
            <p class="cnote vide">Le commentaire est obligatoire pour « À refaire » : c'est ce que l'élève lira dans son app.</p>
          ` : `
            <div class="cdecision">
              <b>${r.statut === "validee" ? "Validée" : "Renvoyée à refaire"}</b>
              ${r.decide_le ? ` ${dateRelative(r.decide_le)}` : ""}${r.decide_par ? ` par ${esc(r.decide_par)}` : ""}
              ${r.commentaire_prof ? `<p class="cnote">« ${esc(r.commentaire_prof)} »</p>` : ""}
            </div>
          `}
        </div>` : ""}
      </article>`;
  };

  const liste = (arr, vide) => arr.length ? arr.map(carte).join("") : `<div class="empty">${vide}</div>`;

  // Témoin d'état : l'enseignant doit pouvoir dire d'un coup d'œil si la page
  // se met à jour toute seule — surtout quand elle est projetée.
  const etatLive = cache.rtEtat === "on"
    ? { c:"on",    t:"● En direct",
        aide:"Les nouvelles réalisations apparaissent d'elles-mêmes, sans recharger la page." }
    : cache.rtEtat === "repli"
      ? { c:"repli", t:"◍ Mise à jour automatique",
          aide:"Le direct n'est pas disponible sur ce réseau : la liste se relit toute seule toutes les 25 secondes." }
      : { c:"",      t:"◌ Connexion…",
          aide:"Mise en place de la mise à jour automatique." };

  return shell(`${cache.org.nom} › ${c.nom} › <b>${CARNET_NOM}</b>`, `
    <div class="view">
      <button class="back" data-nav="cohort">← Retour au groupe</button>
      <h1>${CARNET_NOM}</h1>
      <p class="subtitle">${c.nom} · les gestes du métier que tes élèves photographient en stage.</p>
      <div class="clive-bar">
        <span class="clive ${etatLive.c}" title="${etatLive.aide}">${etatLive.t}</span>
        <button class="crelire" data-carnet-relire title="Relit la liste maintenant, sans recharger la page">↻ Actualiser</button>
      </div>
      ${cache.carnetMsg ? `<div class="cmsg">${esc(cache.carnetMsg)}</div>` : ""}
      <div class="kpis">
        <div class="kpi ${attente.length?'alert':''}"><u>À traiter</u><strong>${attente.length}</strong></div>
        <div class="kpi"><u>Validées</u><strong>${validees}</strong></div>
        <div class="kpi"><u>À refaire</u><strong>${aRefaire}</strong></div>
        <div class="kpi"><u>Élèves en stage</u><strong>${enStage}</strong></div>
      </div>
      <h2 class="csec">À traiter</h2>
      <div class="clist">${liste(attente, "Rien à traiter pour l'instant. Les réalisations arrivent ici dès qu'un élève en envoie une.")}</div>
      <h2 class="csec">Déjà traitées</h2>
      <div class="clist">${liste(traitees, "Aucune réalisation traitée pour l'instant.")}</div>
      <p class="note">Touche une réalisation pour voir la photo et décider. Tu ne peux pas modifier la photo, la note ni le geste de l'élève — seulement le statut et ton commentaire. L'élève voit ta décision dans son app dès qu'il y revient, ou en quelques secondes s'il a son carnet ouvert.</p>
    </div>`);
}

function renderStudent(eleve) {
  const s = statsEleve(eleve.id);
  // Regroupe la progression par module → 3 niveaux
  const parModule = {};
  s.rows.forEach(r => { (parModule[r.module_id] = parModule[r.module_id] || {})[r.niveau] = r.meilleur_score; });
  const modules = Object.keys(parModule).sort((a,b) => moduleOrder(a) - moduleOrder(b) || a.localeCompare(b));
  const modRows = modules.length ? modules.map(m => {
    const pips = [1,2,3].map(n => {
      const sc = parModule[m][n];
      if (sc == null) return `<span class="pip none">–</span>`;
      return `<span class="pip ${sc>=70?"pass":"try"}">${sc}</span>`;
    }).join("");
    return `<div class="mod"><span class="mt"><span class="mn">${esc(moduleTitle(m))}</span></span><span class="pips">${pips}</span></div>`;
  }).join("") : `<div class="mod"><span class="mt" style="color:var(--ink-soft)">Aucune progression enregistrée.</span><span></span></div>`;

  return shell(`${esc(cache.classe.nom)} › <b>${esc(eleve.totem)}</b>`, `
    <div class="view">
      <button class="back" data-nav="cohort">← Retour au groupe</button>
      <div class="fhead">
        <span class="big">${emojiFor(eleve.totem)}</span>
        <div><h2>${esc(eleve.totem)}</h2><div class="meta">Rattaché le ${new Date(eleve.cree_le).toLocaleDateString("fr-CA")} · vu ${dateRelative(eleve.vu_le)}</div></div>
        <div class="stat"><u>Niveaux réussis</u><b class="num">${s.niveauxReussis}</b></div>
        <div class="stat"><u>Modules maîtrisés</u><b class="num">${s.modulesMaitrises}</b></div>
      </div>
      <div class="mods">${modRows}</div>
      ${msgFicheHTML(eleve)}
      <p class="note">Chaque pastille est un niveau. Vert = réussi (≥ 70 %), rouge = tenté sans réussir, gris = non tenté. Le chiffre est le meilleur score.</p>
    </div>`);
}

/* `doux` = ce redessin vient d'une mise à jour automatique, pas d'un clic de
   l'enseignant. On lui rend alors sa position de lecture et son curseur : une
   réalisation qui arrive ne doit jamais faire sauter la page ni sortir du champ
   de commentaire en cours de frappe. Un render() normal se comporte comme
   avant — aucun changement pour la navigation existante. */
function render(doux) {
  const actif = doux ? document.activeElement : null;
  const focus = actif && typeof actif.id === "string"
    && (actif.id.indexOf("carnetComm-") === 0 || actif.id === "msgTexte" || actif.id === "msgSignature")
    ? { id: actif.id, d: actif.selectionStart, f: actif.selectionEnd }
    : null;
  const defil = doux ? window.scrollY : null;

  let html;
  if (cache.view === "classes") html = renderClasses();
  else if (cache.view === "student") html = renderStudent(cache.currentEleve);
  else if (cache.view === "carnet" && cache.carnetActif) html = renderCarnetView();
  else if (cache.view === "messages" && msgDispo()) html = renderMessagesView();
  else html = renderCohort();
  root.innerHTML = html;

  root.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click", () => {
    openClass(cache.classes.find(c => c.id === el.dataset.open));
  }));
  root.querySelectorAll("[data-nav]").forEach(el => el.addEventListener("click", () => {
    if (el.dataset.nav === "classes") { cache.view = "classes"; render(); }
    else if (el.dataset.nav === "carnet") { cache.view = "carnet"; cache.carnetMsg = ""; render(); }
    else if (el.dataset.nav === "messages") { cache.view = "messages"; M().info = ""; M().erreur = ""; render(); }
    else { cache.view = "cohort"; render(); }
  }));
  root.querySelectorAll("[data-carnet-open]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.carnetOpen;
    cache.carnetSel = cache.carnetSel === id ? null : id;
    cache.carnetMsg = "";
    render();
  }));
  root.querySelectorAll("[data-carnet-photo]").forEach(el => el.addEventListener("click", (ev) => {
    ev.stopPropagation();
    loadCarnetPhoto(el.dataset.carnetPhoto);
  }));
  root.querySelectorAll("[data-carnet-ok]").forEach(el => el.addEventListener("click", (ev) => {
    ev.stopPropagation();
    decideCarnet(el.dataset.carnetOk, "validee");
  }));
  root.querySelectorAll("[data-carnet-redo]").forEach(el => el.addEventListener("click", (ev) => {
    ev.stopPropagation();
    decideCarnet(el.dataset.carnetRedo, "refaire");
  }));
  root.querySelectorAll("[data-eleve]").forEach(el => el.addEventListener("click", () => {
    cache.currentEleve = cache.eleves.find(e => e.id === el.dataset.eleve);
    cache.view = "student"; render();
  }));
  msgBind();   // messagerie
  const so = root.querySelector("[data-signout]");
  if (so) so.addEventListener("click", async () => { carnetRealtimeStop(); msgRealtimeStop(); await supabase.auth.signOut(); location.reload(); });
  const ex = root.querySelector("[data-exitdemo]");
  if (ex) ex.addEventListener("click", exitDemo);

  // Le commentaire en cours de frappe est tenu dans le cache, pas dans le DOM :
  // c'est ce qui le fait survivre à un redessin déclenché par le temps réel.
  root.querySelectorAll("[data-carnet-comm]").forEach(el => {
    el.addEventListener("input", () => { cache.carnetBrouillons[el.dataset.carnetComm] = el.value; });
  });
  // Échappatoire manuelle : relit la liste sans recharger la page (donc sans
  // perdre la photo déjà chargée ni le commentaire en cours).
  const rel = root.querySelector("[data-carnet-relire]");
  if (rel) rel.addEventListener("click", () => { cache.carnetMsg = ""; relireCarnet(); });

  if (typeof defil === "number") window.scrollTo(0, defil);
  if (focus) {
    const el = document.getElementById(focus.id);
    if (el) {
      try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
      try { el.setSelectionRange(focus.d, focus.f); } catch (e) {}
    }
  }
}

/* ------------------ Démarrage ------------------ */

// Un lien ?demo=1 FORCE le mode démonstration, même si un enseignant est déjà connecté :
// c'est un outil de présentation, il doit toujours montrer la démo (jamais les vraies données).
const demoForced = new URLSearchParams(location.search).get("demo") === "1";

/* Résolu TOUT DE SUITE, avant d'enregistrer onAuthStateChange : la session peut
   apparaître (événement SIGNED_IN du retour de lien magique) avant que le
   getSession() du démarrage n'ait répondu, et loadDashboard() doit déjà savoir
   où aller. `?demo=1` prime : aucun lien profond en mode démonstration. */
var lienProfondEnAttente = demoForced ? null : (lienProfondDeLUrl() || lienProfondReprendre());

supabase.auth.onAuthStateChange((_event, session) => {
  if (demoForced) return;                // démo forcée : ne jamais charger le vrai tableau de bord
  if (session) { cache.demo = false; cache.userEmail = session.user.email; loadDashboard(); }
  else if (!cache.demo) { carnetRealtimeStop(); msgRealtimeStop(); renderLogin(); }   // en mode démo, ne pas revenir à l'écran de connexion
});

/* ------------------ Reprise après veille / coupure réseau ------------------
   Realtime se reconnecte de lui-même, mais il ne rejoue PAS les changements
   survenus pendant le trou. On vérifie donc l'abonnement et on relit une fois
   au retour au premier plan, au retour du réseau et au retour du focus. */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") carnetRealtimeCheck();
});
window.addEventListener("focus", carnetRealtimeCheck);
window.addEventListener("online", carnetRealtimeCheck);
// Page mise de côté (onglet fermé, retour à l'écran d'accueil) : on coupe tout.
window.addEventListener("pagehide", carnetRealtimeStop);
// Messagerie : mêmes reprises, sur son propre canal.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") msgRealtimeCheck();
});
window.addEventListener("focus", msgRealtimeCheck);
window.addEventListener("online", msgRealtimeCheck);
window.addEventListener("pagehide", msgRealtimeStop);

(async () => {
  // Accès démo direct par lien : prof.questedu.ca/?demo=1 (aucune connexion requise, priorité sur la session).
  if (demoForced) { enterDemo(); return; }
  const { data } = await supabase.auth.getSession();
  if (data.session) { cache.userEmail = data.session.user.email; loadDashboard(); }
  else {
    // Pas encore connecté : le lien profond est mis de côté pour qu'il survive
    // à l'aller-retour du lien magique (souvent dans un autre onglet).
    if (lienProfondEnAttente) { lienProfondMemoriser(lienProfondEnAttente); lienProfondEnAttente = null; }
    renderLogin();
  }
})();

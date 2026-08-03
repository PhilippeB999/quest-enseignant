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
  soud27:{t:"Intégration au milieu de travail",o:27}
};
const moduleTitle = id => (MODULE_INFO[id] && MODULE_INFO[id].t) || id;
const moduleOrder = id => (MODULE_INFO[id] ? MODULE_INFO[id].o : 999);

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

let cache = { org: null, classes: [], view: "classes", classe: null, eleves: [], prog: [] };

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
  cache = { org: null, classes: [], view: "classes", classe: null, eleves: [], prog: [] };
  renderLogin();
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
  render();
}

/* Statistiques par élève, à partir de la progression réelle. */
function statsEleve(eleveId) {
  const rows = cache.prog.filter(p => p.eleve_id === eleveId);
  const reussis = rows.filter(r => r.meilleur_score >= 70);
  const maitrises = new Set(reussis.filter(r => r.niveau === 3).map(r => r.module_id));
  return { niveauxReussis: reussis.length, modulesMaitrises: maitrises.size, rows };
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
      ${cache.classe ? `<button class="nav ${cache.view!=='classes'?'on':''}" data-nav="cohort">👥 ${cache.classe.nom}</button>` : ""}
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
      <h3>${c.nom || c.code_classe}</h3>
      <div class="prog-name">${c.programme || ""}</div>
      <div class="rowk"><span>Code de classe</span><b>${c.code_classe}</b></div>
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
    return `<tr class="clic" data-eleve="${e.id}">
      <td><div class="totem"><span class="em">${emojiFor(e.totem)}</span><b>${e.totem}</b></div></td>
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
      </div>
      <div class="tablewrap"><table>
        <thead><tr><th>Totem</th><th>Progression</th><th>Modules maîtrisés</th><th>Dernière activité</th><th>État</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="note">« Modules maîtrisés » = niveau 3 réussi. « À relancer » = aucune activité depuis plus de 7 jours. Les totems remplacent les noms réels.</p>
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
    return `<div class="mod"><span class="mt"><span class="mn">${moduleTitle(m)}</span></span><span class="pips">${pips}</span></div>`;
  }).join("") : `<div class="mod"><span class="mt" style="color:var(--ink-soft)">Aucune progression enregistrée.</span><span></span></div>`;

  return shell(`${cache.classe.nom} › <b>${eleve.totem}</b>`, `
    <div class="view">
      <button class="back" data-nav="cohort">← Retour au groupe</button>
      <div class="fhead">
        <span class="big">${emojiFor(eleve.totem)}</span>
        <div><h2>${eleve.totem}</h2><div class="meta">Rattaché le ${new Date(eleve.cree_le).toLocaleDateString("fr-CA")} · vu ${dateRelative(eleve.vu_le)}</div></div>
        <div class="stat"><u>Niveaux réussis</u><b class="num">${s.niveauxReussis}</b></div>
        <div class="stat"><u>Modules maîtrisés</u><b class="num">${s.modulesMaitrises}</b></div>
      </div>
      <div class="mods">${modRows}</div>
      <p class="note">Chaque pastille est un niveau. Vert = réussi (≥ 70 %), rouge = tenté sans réussir, gris = non tenté. Le chiffre est le meilleur score.</p>
    </div>`);
}

function render() {
  let html;
  if (cache.view === "classes") html = renderClasses();
  else if (cache.view === "student") html = renderStudent(cache.currentEleve);
  else html = renderCohort();
  root.innerHTML = html;

  root.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click", () => {
    openClass(cache.classes.find(c => c.id === el.dataset.open));
  }));
  root.querySelectorAll("[data-nav]").forEach(el => el.addEventListener("click", () => {
    if (el.dataset.nav === "classes") { cache.view = "classes"; render(); }
    else { cache.view = "cohort"; render(); }
  }));
  root.querySelectorAll("[data-eleve]").forEach(el => el.addEventListener("click", () => {
    cache.currentEleve = cache.eleves.find(e => e.id === el.dataset.eleve);
    cache.view = "student"; render();
  }));
  const so = root.querySelector("[data-signout]");
  if (so) so.addEventListener("click", async () => { await supabase.auth.signOut(); location.reload(); });
  const ex = root.querySelector("[data-exitdemo]");
  if (ex) ex.addEventListener("click", exitDemo);
}

/* ------------------ Démarrage ------------------ */

// Un lien ?demo=1 FORCE le mode démonstration, même si un enseignant est déjà connecté :
// c'est un outil de présentation, il doit toujours montrer la démo (jamais les vraies données).
const demoForced = new URLSearchParams(location.search).get("demo") === "1";

supabase.auth.onAuthStateChange((_event, session) => {
  if (demoForced) return;                // démo forcée : ne jamais charger le vrai tableau de bord
  if (session) { cache.demo = false; cache.userEmail = session.user.email; loadDashboard(); }
  else if (!cache.demo) renderLogin();   // en mode démo, ne pas revenir à l'écran de connexion
});

(async () => {
  // Accès démo direct par lien : prof.questedu.ca/?demo=1 (aucune connexion requise, priorité sur la session).
  if (demoForced) { enterDemo(); return; }
  const { data } = await supabase.auth.getSession();
  if (data.session) { cache.userEmail = data.session.user.email; loadDashboard(); }
  else renderLogin();
})();

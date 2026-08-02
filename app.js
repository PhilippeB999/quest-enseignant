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
  c20:{t:"Utiliser des moyens de recherche d'emploi",o:20}
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
  const { data, error } = await supabase.rpc("demo_dashboard");
  if (error) {
    // Vraie erreur réseau / RPC : problème temporaire, on invite à réessayer.
    cache.demo = false;
    renderLogin({ type: "err", text: "La démonstration est momentanément indisponible. Réessaie dans un instant." });
    return;
  }
  if (!data || !data.org) {
    // La RPC a répondu sans erreur, mais ne renvoie aucune organisation : la démo est
    // expirée (licence_fin dépassée) ou désactivée. Message distinct, verrou global.
    cache.demo = false;
    renderLogin({ type: "err", text: "La démonstration n'est plus disponible. Écrivez-nous pour obtenir un accès." });
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

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) { cache.demo = false; cache.userEmail = session.user.email; loadDashboard(); }
  else if (!cache.demo) renderLogin();   // en mode démo, ne pas revenir à l'écran de connexion
});

(async () => {
  // Accès démo direct par lien : prof.questedu.ca/?demo=1 (aucune connexion requise).
  if (new URLSearchParams(location.search).get("demo") === "1") { enterDemo(); return; }
  const { data } = await supabase.auth.getSession();
  if (data.session) { cache.userEmail = data.session.user.email; loadDashboard(); }
  else renderLogin();
})();

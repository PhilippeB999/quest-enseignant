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
  return `
  <div class="app">
    <aside class="side">
      <div class="brand"><span class="mk">🛡️</span><span><b>Quest</b><small>ESPACE ENSEIGNANT</small></span></div>
      <div class="navlbl">Mes groupes</div>
      <button class="nav ${cache.view==='classes'?'on':''}" data-nav="classes">▦ Vue d'ensemble</button>
      ${cache.classe ? `<button class="nav ${cache.view!=='classes'?'on':''}" data-nav="cohort">👥 ${cache.classe.nom}</button>` : ""}
      <div class="who"><b>${cache.userEmail || ""}</b>${cache.org.nom}<br><button data-signout>Se déconnecter</button></div>
    </aside>
    <div class="main">
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
  const modules = Object.keys(parModule).sort();
  const modRows = modules.length ? modules.map(m => {
    const pips = [1,2,3].map(n => {
      const sc = parModule[m][n];
      if (sc == null) return `<span class="pip none">–</span>`;
      return `<span class="pip ${sc>=70?"pass":"try"}">${sc}</span>`;
    }).join("");
    return `<div class="mod"><span class="mt"><span class="mn">${m}</span></span><span class="pips">${pips}</span></div>`;
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
}

/* ------------------ Démarrage ------------------ */

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) { cache.userEmail = session.user.email; loadDashboard(); }
  else renderLogin();
});

(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) { cache.userEmail = data.session.user.email; loadDashboard(); }
  else renderLogin();
})();

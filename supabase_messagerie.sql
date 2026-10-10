-- ============================================================================
-- Quest — MESSAGERIE ENSEIGNANT → ÉLÈVE (sens unique)
-- Côté enseignant : quest-enseignant · Côté élève : pab-web (pilote), puis les
-- autres apps Quest.
--
-- À exécuter dans : Dashboard Supabase → SQL Editor → New query → coller TOUT
-- ce fichier → Run. Le script est IDEMPOTENT : on peut le relancer autant de
-- fois qu'on veut sans rien perdre ni rien casser.
--
-- ----------------------------------------------------------------------------
-- PUREMENT ADDITIF
-- ----------------------------------------------------------------------------
-- Ce fichier CRÉE deux tables et des fonctions nouvelles, toutes préfixées
-- `messag…`. Il ne MODIFIE RIEN d'existant :
--   · aucune modification de `verifier_licence`, `info_classe`,
--     `soumettre_progression`, `mon_organisation` ;
--   · aucune modification des tables `organisations`, `classes`, `eleves`,
--     `progression`, `licences` (elles sont seulement LUES) ;
--   · aucune dépendance au carnet de stage (StageQuest) : pas de table
--     `carnet_*`, pas de `option_licence`, pas de `licences.options`. La
--     messagerie fait partie du tableau de bord de base, pour toutes les
--     licences.
--
-- ----------------------------------------------------------------------------
-- LE PARCOURS (décisions de Philippe)
-- ----------------------------------------------------------------------------
--   1. L'enseignant écrit, depuis le tableau de bord, une note à UN élève
--      (son totem) ou à TOUTE la classe : message rapide prédéfini ou texte
--      libre de 280 caractères au plus.
--   2. L'élève la lit dans son app. Il ne peut PAS répondre par écrit : il a
--      deux accusés, « Compris » et « J'en parle en classe ». L'ouverture
--      marque le message « lu ».
--   3. L'enseignant voit l'état : non lu / lu / compris / en classe, avec la
--      date ; pour un message de classe, le compte des accusés.
--   4. Tous les enseignants de la MÊME organisation voient tous les messages,
--      avec l'auteur. Voulu : aucun canal privé caché entre un adulte et un
--      mineur.
--
-- ----------------------------------------------------------------------------
-- QUI PEUT RECEVOIR UN MESSAGE
-- ----------------------------------------------------------------------------
-- Un élève n'existe côté serveur (table `eleves`) que s'il a saisi un code de
-- classe ET activé le partage : c'est `soumettre_progression` qui crée sa
-- ligne. La messagerie s'appuie sur cette ligne pour vérifier que l'appareil
-- appartient bien à la classe. Conséquence assumée : un élève qui n'a pas
-- activé le partage ne reçoit pas les messages (l'app le lui explique dans
-- « Ma classe »). C'est cohérent avec la règle « sans partage, rien ne part » :
-- sans partage, l'app n'envoie même pas son identifiant pour relever le
-- courrier, et l'enseignant ne voit aucun accusé de sa part.
--
-- ----------------------------------------------------------------------------
-- DEUX PATRONS DE SÉCURITÉ, UN PAR CÔTÉ
-- ----------------------------------------------------------------------------
-- · ÉLÈVE (`anon`, clé publiable) : AUCUN privilège sur les deux tables
--   (REVOKE ALL), aucune policy. Deux fonctions `security definer` au
--   périmètre étroit, exactement comme `soumettre_progression` :
--     messagerie_eleve_lire(code, eleve)       → SES messages + ceux de SA classe
--     messagerie_eleve_accuser(code, eleve, …) → lu / compris / en classe
--   Chacune vérifie que l'identifiant d'appareil appartient à la classe du
--   code. Aucune ne renvoie le courriel de l'enseignant.
--
-- · ENSEIGNANT (`authenticated`, lien magique) : vraies policies RLS cadrées
--   sur les classes de SON organisation (via la RLS déjà en place sur
--   `classes`, donc `mon_organisation()`), et privilèges AU NIVEAU COLONNE :
--   il ne peut insérer que (classe_id, eleve_id, modele, texte, auteur_nom).
--   L'auteur (courriel + uid), la date et l'échéance de purge sont posés par
--   un trigger, jamais par le navigateur. Aucun UPDATE ni DELETE : un message
--   envoyé ne peut pas être réécrit ni effacé en douce.
--
-- ----------------------------------------------------------------------------
-- LOI 25
-- ----------------------------------------------------------------------------
-- Données nouvelles côté serveur :
--   · le texte écrit par l'enseignant (≤ 280 caractères) et son nom affiché
--     facultatif (« Mme Ouellet ») ;
--   · le courriel de l'enseignant auteur (visible des seuls collègues de son
--     organisation, JAMAIS de l'élève) ;
--   · pour chaque élève : la date de lecture et l'accusé choisi, rattachés à
--     son identifiant d'appareil anonyme (pas de nom, pas de courriel).
-- Rétention proposée : 12 mois après l'envoi (message + accusés), par
-- `messagerie_purge()`. Effacement d'un élève : `messagerie_effacer_eleve()`.
-- ⚠️ La politique de confidentialité doit mentionner cette messagerie, et le
-- consentement (parental pour les moins de 14 ans) reste à régler AVANT de
-- vrais élèves — comme pour le reste de la plateforme.
-- ⚠️ Texte libre : un enseignant pourrait y écrire un renseignement personnel
-- (« Julie, ta mère a appelé »). Le tableau de bord le rappelle sous le champ.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Tables
-- ----------------------------------------------------------------------------

-- 1a. Un message envoyé par un enseignant.
--     eleve_id NULL  → message à toute la classe
--     eleve_id = 'cq-…' → message à un élève (= eleves.id, l'identifiant
--                         d'appareil anonyme que l'app envoie déjà)
-- Pas de clé étrangère vers `eleves` : on ne présume pas de la contrainte
-- d'unicité de `eleves.id` (table créée à la main), et une FK ratée ferait
-- échouer tout le script. L'appartenance de l'élève à la classe est vérifiée
-- par la policy d'insertion (section 4).
create table if not exists messages_enseignant (
  id              uuid primary key default gen_random_uuid(),
  classe_id       uuid not null references classes(id) on delete cascade,
  eleve_id        text,                          -- NULL = toute la classe
  modele          text,                          -- id du message rapide, NULL = texte libre
  texte           text not null,                 -- texte FIGÉ au moment de l'envoi
  auteur_nom      text,                          -- nom affiché à l'élève (facultatif)
  auteur_courriel text not null,                 -- posé par trigger ; JAMAIS renvoyé à l'élève
  auteur_uid      uuid,                          -- posé par trigger (auth.uid())
  cree_le         timestamptz not null default now(),
  supprimer_le    timestamptz not null default now() + interval '12 months'
);

-- 1b. L'état de lecture d'un message, PAR élève.
--     Une ligne apparaît quand l'élève ouvre le message (lu_le) ; `accuse`
--     devient 'compris' ou 'en_classe' quand il touche un des deux boutons.
--     `classe_id` est recopié du message (par la fonction élève) : il sert à
--     la policy et au filtre du temps réel côté enseignant.
create table if not exists messages_lectures (
  message_id  uuid not null references messages_enseignant(id) on delete cascade,
  eleve_id    text not null,
  classe_id   uuid not null,
  lu_le       timestamptz not null default now(),
  accuse      text,
  accuse_le   timestamptz,
  primary key (message_id, eleve_id)
);

-- Contraintes (Postgres n'a pas « add constraint if not exists »).
do $ctr$
begin
  if not exists (select 1 from pg_constraint where conname = 'messages_texte_borne') then
    -- Borne DURE côté base : l'interface plafonne aussi à 280, mais un appel
    -- direct à l'API ne doit pas pouvoir dépasser.
    alter table messages_enseignant
      add constraint messages_texte_borne
      check (char_length(btrim(texte)) between 1 and 280);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'messages_champs_courts') then
    alter table messages_enseignant
      add constraint messages_champs_courts check (
        char_length(coalesce(auteur_nom, '')) <= 60
        and char_length(coalesce(eleve_id, '')) <= 80
        and char_length(coalesce(auteur_courriel, '')) <= 320
      );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'messages_modele_valide') then
    alter table messages_enseignant
      add constraint messages_modele_valide
      check (modele is null or modele in ('bravo', 'revoir', 'voir_classe', 'progres'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'messages_accuse_valide') then
    alter table messages_lectures
      add constraint messages_accuse_valide
      check (accuse is null or accuse in ('compris', 'en_classe'));
  end if;
end
$ctr$;

create index if not exists messages_ens_classe_idx  on messages_enseignant (classe_id, cree_le desc);
create index if not exists messages_ens_eleve_idx   on messages_enseignant (eleve_id);
create index if not exists messages_ens_purge_idx   on messages_enseignant (supprimer_le);
create index if not exists messages_lect_classe_idx on messages_lectures (classe_id);
create index if not exists messages_lect_eleve_idx  on messages_lectures (eleve_id);

alter table messages_enseignant enable row level security;
alter table messages_lectures   enable row level security;


-- ----------------------------------------------------------------------------
-- 2. PRIVILÈGES — le cœur du verrou
-- ----------------------------------------------------------------------------
-- Supabase accorde par défaut tous les privilèges d'une table neuve du schéma
-- public à `anon` et `authenticated`. On retire tout, puis on rend le strict
-- nécessaire. Deux barrières : privilèges ET policies.

revoke all on messages_enseignant from anon, authenticated;
revoke all on messages_lectures   from anon, authenticated;

-- `anon` (l'app élève) : RIEN. Seulement les deux fonctions de la section 5.

-- `authenticated` (l'enseignant) :
--   · lecture des messages et des accusés de SES classes (policies section 4) ;
--   · insertion limitée à CINQ colonnes. Il ne peut pas choisir l'auteur, la
--     date, ni l'échéance de purge : Postgres refuse la colonne.
--   · aucun UPDATE, aucun DELETE : ni réécriture ni effacement discret.
--   · aucun privilège d'écriture sur `messages_lectures` : seul l'élève
--     (via sa fonction) accuse réception. L'enseignant ne peut pas « faire
--     comme si » l'élève avait lu.
grant select on messages_enseignant to authenticated;
grant insert (classe_id, eleve_id, modele, texte, auteur_nom) on messages_enseignant to authenticated;
grant select on messages_lectures to authenticated;


-- ----------------------------------------------------------------------------
-- 3. Fonctions d'aide côté enseignant — SECURITY INVOKER, exprès
-- ----------------------------------------------------------------------------
-- « Est-ce une de mes classes ? » s'appuie sur la RLS DÉJÀ EN PLACE sur
-- `classes` (cadrage `mon_organisation()`) : comme la fonction s'exécute avec
-- les droits de l'appelant, la sous-requête ne voit que les classes de son
-- organisation. La règle d'organisation n'est donc écrite qu'à un endroit.
-- (Fonction distincte de celle du carnet : la messagerie n'en dépend pas.)

create or replace function messagerie_est_ma_classe(p_classe uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from classes c where c.id = p_classe);
$$;

-- Même principe pour l'élève destinataire : la RLS de `eleves` s'applique.
create or replace function messagerie_eleve_de_ma_classe(p_eleve text, p_classe uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from eleves e where e.id = p_eleve and e.classe_id = p_classe);
$$;

-- Postgres accorde EXECUTE à PUBLIC par défaut sur toute fonction neuve :
-- on le retire explicitement avant de rendre le droit au seul rôle utile.
revoke all on function messagerie_est_ma_classe(uuid)            from public, anon, authenticated;
revoke all on function messagerie_eleve_de_ma_classe(text, uuid) from public, anon, authenticated;
grant execute on function messagerie_est_ma_classe(uuid)            to authenticated;
grant execute on function messagerie_eleve_de_ma_classe(text, uuid) to authenticated;


-- ----------------------------------------------------------------------------
-- 4. POLICIES RLS — enseignant authentifié uniquement
-- ----------------------------------------------------------------------------
drop policy if exists messages_lecture_enseignant on messages_enseignant;
drop policy if exists messages_envoi_enseignant   on messages_enseignant;
drop policy if exists messages_lectures_enseignant on messages_lectures;

-- Lecture : tous les messages des classes de l'organisation, quel qu'en soit
-- l'auteur (transparence entre collègues, voulue).
create policy messages_lecture_enseignant on messages_enseignant
  for select to authenticated
  using (messagerie_est_ma_classe(classe_id));

-- Envoi : vers une de SES classes seulement, et si un élève est visé, il doit
-- appartenir à CETTE classe (pas de message « parachuté » à l'appareil d'un
-- autre centre en devinant son identifiant).
create policy messages_envoi_enseignant on messages_enseignant
  for insert to authenticated
  with check (
    messagerie_est_ma_classe(classe_id)
    and (eleve_id is null or messagerie_eleve_de_ma_classe(eleve_id, classe_id))
  );

create policy messages_lectures_enseignant on messages_lectures
  for select to authenticated
  using (messagerie_est_ma_classe(classe_id));


-- Trigger : l'auteur, la date et l'échéance ne viennent JAMAIS du client.
create or replace function messagerie_tg_envoi()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.auteur_uid      := auth.uid();
  new.auteur_courriel := coalesce(
    nullif(auth.jwt() ->> 'email', ''),
    nullif(current_setting('request.jwt.claim.email', true), ''),
    'administrateur'                       -- insertion depuis le SQL Editor
  );
  new.texte        := btrim(new.texte);
  new.auteur_nom   := nullif(btrim(coalesce(new.auteur_nom, '')), '');
  new.eleve_id     := nullif(btrim(coalesce(new.eleve_id, '')), '');
  new.cree_le      := now();
  new.supprimer_le := now() + interval '12 months';
  return new;
end;
$$;

drop trigger if exists messagerie_envoi on messages_enseignant;
create trigger messagerie_envoi
  before insert on messages_enseignant
  for each row execute function messagerie_tg_envoi();


-- ----------------------------------------------------------------------------
-- 5. Fonctions de l'APP ÉLÈVE (anonyme — security definer, aucune policy)
-- ----------------------------------------------------------------------------
-- Même modèle que `soumettre_progression` : l'élève prouve son rattachement
-- par la paire (code de classe, identifiant d'appareil). L'identifiant est un
-- UUID aléatoire généré sur l'appareil, déjà la clé de sa progression.

-- 5a. Lire ses messages : ceux qui lui sont adressés + ceux de sa classe.
-- Renvoie zéro ligne si l'appareil n'appartient pas à la classe du code.
-- Ne renvoie NI le courriel de l'enseignant, NI l'identifiant d'un autre
-- élève : `pour_moi` dit seulement si le message était personnel.
create or replace function messagerie_eleve_lire(p_code text, p_eleve text)
returns table (
  id         uuid,
  texte      text,
  modele     text,
  auteur     text,          -- nom affiché, ou NULL → l'app écrit « Ton enseignant(e) »
  pour_moi   boolean,
  cree_le    timestamptz,
  lu_le      timestamptz,
  accuse     text,
  accuse_le  timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  with moi as (
    select e.id as eleve_id, e.classe_id
    from eleves e
    join classes c on c.id = e.classe_id
    where e.id = btrim(p_eleve)
      and coalesce(btrim(p_eleve), '') <> ''
      and upper(c.code_classe) = upper(btrim(p_code))
    limit 1
  )
  select m.id, m.texte, m.modele, m.auteur_nom,
         (m.eleve_id is not null),
         m.cree_le, l.lu_le, l.accuse, l.accuse_le
  from moi
  join messages_enseignant m
    on m.classe_id = moi.classe_id
   and (m.eleve_id is null or m.eleve_id = moi.eleve_id)
  left join messages_lectures l
    on l.message_id = m.id and l.eleve_id = moi.eleve_id
  where m.supprimer_le > now()
  order by m.cree_le desc
  limit 50;
$$;

-- 5b. Accuser réception.
--   p_accuse = 'lu'        → marque lus les messages donnés (jusqu'à 50 d'un coup)
--   p_accuse = 'compris'   → un seul message
--   p_accuse = 'en_classe' → un seul message
-- L'élève peut changer d'avis (le dernier accusé fait foi, avec sa date).
-- Renvoie le nombre de lignes écrites (0 = refusé ou rien à faire).
create or replace function messagerie_eleve_accuser(
  p_code     text,
  p_eleve    text,
  p_messages uuid[],
  p_accuse   text
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_eleve  text;
  v_classe uuid;
  v_accuse text := lower(btrim(coalesce(p_accuse, '')));
  n int := 0;
begin
  if v_accuse not in ('lu', 'compris', 'en_classe') then return 0; end if;
  if p_messages is null or cardinality(p_messages) = 0 or cardinality(p_messages) > 50 then return 0; end if;
  if v_accuse <> 'lu' and cardinality(p_messages) <> 1 then return 0; end if;

  select e.id, e.classe_id into v_eleve, v_classe
  from eleves e
  join classes c on c.id = e.classe_id
  where e.id = btrim(p_eleve)
    and coalesce(btrim(p_eleve), '') <> ''
    and upper(c.code_classe) = upper(btrim(p_code))
  limit 1;
  if v_eleve is null then return 0; end if;

  insert into messages_lectures (message_id, eleve_id, classe_id, lu_le, accuse, accuse_le)
  select m.id, v_eleve, v_classe, now(),
         case when v_accuse = 'lu' then null else v_accuse end,
         case when v_accuse = 'lu' then null else now() end
  from messages_enseignant m
  where m.id = any(p_messages)
    and m.classe_id = v_classe
    and (m.eleve_id is null or m.eleve_id = v_eleve)
    and m.supprimer_le > now()
  on conflict (message_id, eleve_id) do update
    set accuse    = excluded.accuse,
        accuse_le = excluded.accuse_le
    -- Un simple « lu » rejoué n'écrase jamais un accusé déjà donné, et
    -- n'écrit rien du tout (pas de bruit temps réel inutile).
    where excluded.accuse is not null;
  -- lu_le n'est jamais modifié après coup : c'est la PREMIÈRE lecture.

  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function messagerie_eleve_lire(text, text)                    from public, anon, authenticated;
revoke all on function messagerie_eleve_accuser(text, text, uuid[], text)   from public, anon, authenticated;
grant execute on function messagerie_eleve_lire(text, text)                  to anon;
grant execute on function messagerie_eleve_accuser(text, text, uuid[], text) to anon;


-- ----------------------------------------------------------------------------
-- 6. Rétention (Loi 25) et droit à l'effacement
-- ----------------------------------------------------------------------------
-- Durée PROPOSÉE : 12 mois après l'envoi (à confirmer avec le CFP). Les
-- accusés partent avec leur message (ON DELETE CASCADE).
--
-- ⚠️ NON PLANIFIÉE par ce script. Étape à faire par Philippe, au choix :
--   · à la main de temps en temps : select * from messagerie_purge();
--   · ou avec pg_cron (Database → Extensions → pg_cron), une fois :
--       select cron.schedule('messagerie-purge', '15 4 * * *',
--                            $$select messagerie_purge()$$);
-- Sans l'un ou l'autre, la rétention de 12 mois est une promesse sans
-- mécanisme.

create or replace function messagerie_purge()
returns table (messages_supprimes int)
language plpgsql
security definer
set search_path = public
as $$
declare a int;
begin
  delete from messages_enseignant where supprimer_le <= now();
  get diagnostics a = row_count;
  return query select a;
end;
$$;

-- Droit à l'effacement d'un élève (identifiant d'appareil `cq-…`, visible
-- dans la table `eleves`). Supprime ses accusés ET les messages qui lui
-- étaient adressés personnellement. Les messages de classe restent (ils
-- concernent les autres élèves), seuls ses accusés disparaissent.
-- À exécuter à la main depuis le SQL Editor.
create or replace function messagerie_effacer_eleve(p_eleve text)
returns table (accuses_supprimes int, messages_supprimes int)
language plpgsql
security definer
set search_path = public
as $$
declare a int; b int;
begin
  delete from messages_lectures where eleve_id = btrim(p_eleve);
  get diagnostics a = row_count;
  delete from messages_enseignant where eleve_id = btrim(p_eleve);
  get diagnostics b = row_count;
  return query select a, b;
end;
$$;

-- Volontairement NON exposées : ni l'app, ni un enseignant ne purgent ou
-- n'effacent. ⚠️ Le REVOKE inclut PUBLIC : sans lui, Postgres laisserait
-- n'importe quel rôle (y compris `anon`) exécuter la fonction.
revoke all on function messagerie_purge()              from public, anon, authenticated;
revoke all on function messagerie_effacer_eleve(text)  from public, anon, authenticated;


-- ----------------------------------------------------------------------------
-- 7. Temps réel côté enseignant (sonnette)
-- ----------------------------------------------------------------------------
-- Le tableau de bord écoute les deux tables pour le groupe ouvert et RELIT par
-- un SELECT refiltré par la RLS : le contenu de l'événement n'est jamais
-- affiché. Realtime n'envoie un événement qu'aux abonnés que la policy
-- `select` autorise : l'enseignant reçoit ses classes, `anon` ne reçoit rien
-- (aucun privilège). ⛔ Ne JAMAIS accorder `select` à `anon` pour un temps
-- réel côté élève : l'élève relit par sa fonction.
-- Si ce bloc échoue ou n'est pas exécuté, le tableau de bord se rabat sur une
-- relecture toutes les 30 s : rien ne casse.
do $rt$
declare
  v_existe boolean;
  v_toutes boolean;
  t text;
begin
  select true, puballtables into v_existe, v_toutes
  from pg_publication where pubname = 'supabase_realtime';

  if v_existe is not true then
    raise notice 'Publication supabase_realtime absente : temps réel non activé (le repli 30 s fonctionne).';
    return;
  end if;
  if v_toutes then
    raise notice 'supabase_realtime couvre déjà toutes les tables.';
    return;
  end if;

  foreach t in array array['messages_enseignant', 'messages_lectures'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
      raise notice '% ajoutée à supabase_realtime.', t;
    end if;
  end loop;
end
$rt$;


-- ----------------------------------------------------------------------------
-- 8. CONTRÔLES — à lire dans l'onglet Results après le Run
-- ----------------------------------------------------------------------------

-- (a) Non-régression : les fonctions existantes n'ont pas bougé.
--     Attendu : true, false (comme avant ce script).
select verifier_licence('PAB-2026-PBEL', 'pab')  as licence_pab_ok,
       verifier_licence('PAB-2026-PBEL', 'sasi') as licence_pab_sur_sasi;

-- (b) Privilèges : AUCUNE ligne pour `anon`. Pour `authenticated` :
--     messages_enseignant SELECT (toutes) + INSERT sur 5 colonnes
--     (auteur_nom, classe_id, eleve_id, modele, texte), messages_lectures
--     SELECT (toutes). Rien d'autre (pas d'UPDATE, pas de DELETE).
select table_name, grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema = 'public'
  and table_name in ('messages_enseignant', 'messages_lectures')
  and grantee in ('anon', 'authenticated')
  and privilege_type <> 'SELECT'
union all
select table_name, grantee, privilege_type, '(toutes)'
from information_schema.table_privileges
where table_schema = 'public'
  and table_name in ('messages_enseignant', 'messages_lectures')
  and grantee in ('anon', 'authenticated')
order by 1, 2, 3, 4;

-- (c) RLS activée, policies uniquement pour {authenticated}.
select tablename, policyname, roles, cmd
from pg_policies
where tablename in ('messages_enseignant', 'messages_lectures')
order by tablename, policyname;
select relname, relrowsecurity as rls_activee
from pg_class where relname in ('messages_enseignant', 'messages_lectures');

-- (d) Qui peut exécuter quoi. Attendu :
--     messagerie_eleve_lire / _accuser       → anon = true,  authenticated = false
--     messagerie_est_ma_classe / _eleve_de…  → anon = false, authenticated = true
--     messagerie_purge / _effacer_eleve      → anon = false, authenticated = false
select p.proname,
       has_function_privilege('anon',          p.oid, 'execute') as anon,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace and n.nspname = 'public'
where p.proname like 'messagerie\_%'
order by p.proname;

-- (e) Temps réel : doit renvoyer 2 lignes (sauf publication FOR ALL TABLES).
select tablename from pg_publication_tables
where pubname = 'supabase_realtime' and tablename in ('messages_enseignant', 'messages_lectures');

-- (f) Test de bout en bout côté élève, SANS tableau de bord — à décommenter.
--     Remplacer DEMO-5358 par un code de classe où un élève de test existe, et
--     'cq-…' par son identifiant (colonne `id` de `eleves`). Le SQL Editor
--     tourne en propriétaire : le trigger signe 'administrateur'.
-- select e.id, e.totem, c.code_classe from eleves e join classes c on c.id = e.classe_id
--  where c.code_classe = 'DEMO-5358' limit 3;
-- insert into messages_enseignant (classe_id, eleve_id, modele, texte)
-- select c.id, null, 'bravo', 'Bravo, continue!' from classes c where c.code_classe = 'DEMO-5358';
-- select * from messagerie_eleve_lire('DEMO-5358', 'cq-REMPLACER');      -- 1 ligne, lu_le NULL
-- select * from messagerie_eleve_lire('DEMO-5220', 'cq-REMPLACER');      -- 0 ligne (mauvaise classe)
-- select * from messagerie_eleve_lire('DEMO-5358', 'cq-inexistant');     -- 0 ligne
-- select messagerie_eleve_accuser('DEMO-5358', 'cq-REMPLACER',
--          array[(select id from messages_enseignant order by cree_le desc limit 1)], 'compris');  -- 1
-- select * from messagerie_eleve_lire('DEMO-5358', 'cq-REMPLACER');      -- accuse = compris
-- select messagerie_eleve_accuser('DEMO-5358', 'cq-REMPLACER',
--          array[gen_random_uuid()], 'compris');                         -- 0 (message inconnu)
-- delete from messages_enseignant where auteur_courriel = 'administrateur';   -- nettoyage

-- (g) À FAIRE UNE FOIS CONNECTÉ COMME ENSEIGNANT (dans le tableau de bord) :
--     envoyer un message, puis vérifier avec un compte d'une AUTRE
--     organisation qu'il ne le voit pas (« Aucun message »).

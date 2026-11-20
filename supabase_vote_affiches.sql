-- Vote des affiches Quest : votes ENREGISTRÉS (20 nov. 2026)
-- Avant : Broadcast seulement, l'écran des résultats devait rester ouvert.
-- Maintenant : chaque vote est gardé, l'écran lit les totaux quand il veut.
-- Anonyme : on ne garde qu'un identifiant aléatoire du téléphone (pas de nom, pas de courriel).

create table if not exists votes_affiches (
  tour    text not null,
  votant  text not null check (length(votant) between 4 and 20),
  s       smallint check (s between 0 and 3),
  p       smallint check (p between 0 and 3),
  maj     timestamptz not null default now(),
  primary key (tour, votant),
  check (s is not null or p is not null)
);
alter table votes_affiches enable row level security;   -- aucun accès direct : seulement les fonctions ci-dessous

create table if not exists votes_affiches_etat (
  tour    text primary key,
  ouvert  boolean not null default true
);
alter table votes_affiches_etat enable row level security;
insert into votes_affiches_etat (tour, ouvert) values ('final-2026-11', true) on conflict (tour) do nothing;

-- Voter (ou changer son vote) : un vote par téléphone, le dernier remplace.
create or replace function voter_affiche(p_tour text, p_votant text, p_s int, p_p int)
returns text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from votes_affiches_etat where tour = p_tour and ouvert) then return 'ferme'; end if;
  if p_s is null and p_p is null then return 'vide'; end if;
  if (select count(*) from votes_affiches where tour = p_tour) >= 300
     and not exists (select 1 from votes_affiches where tour = p_tour and votant = p_votant) then return 'plein'; end if;
  insert into votes_affiches (tour, votant, s, p) values (p_tour, p_votant, p_s, p_p)
  on conflict (tour, votant) do update set s = excluded.s, p = excluded.p, maj = now();
  return 'ok';
end $$;

-- Résultats : les choix seulement (aucune donnée personnelle).
create or replace function resultats_affiches(p_tour text)
returns table (s smallint, p smallint, ouvert boolean) language sql security definer set search_path = public as $$
  select v.s, v.p, e.ouvert from votes_affiches_etat e left join votes_affiches v on v.tour = e.tour where e.tour = p_tour;
$$;

-- Clore / rouvrir : réservé à un enseignant connecté.
create or replace function basculer_vote_affiches(p_tour text, p_ouvert boolean)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.email() is null or not exists (select 1 from enseignants where courriel = auth.email()) then
    raise exception 'réservé aux enseignants';
  end if;
  update votes_affiches_etat set ouvert = p_ouvert where tour = p_tour;
  return p_ouvert;
end $$;

revoke all on function voter_affiche(text, text, int, int) from public;
revoke all on function resultats_affiches(text) from public;
revoke all on function basculer_vote_affiches(text, boolean) from public;
grant execute on function voter_affiche(text, text, int, int) to anon, authenticated;
grant execute on function resultats_affiches(text) to anon, authenticated;
grant execute on function basculer_vote_affiches(text, boolean) to authenticated;

select 'ok' as resultat, (select ouvert from votes_affiches_etat where tour = 'final-2026-11') as vote_ouvert;

-- 20 nov. 2026 : fermeture automatique à la fin du 27 novembre (heure du Québec).
alter table votes_affiches_etat add column if not exists ferme_le timestamptz;
update votes_affiches_etat set ferme_le = '2026-11-28 00:00:00 America/Toronto' where tour = 'final-2026-11';
-- voter_affiche et resultats_affiches tiennent compte de ferme_le (voir la version exécutée dans Supabase).

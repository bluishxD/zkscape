-- ZKSCAPE v3 server setup (timed scoring) (idempotent). Run in the Supabase SQL editor, then paste Project URL + anon key into index.html.
-- NEVER put the service_role key in the HTML file.
create table if not exists public.players(
 id uuid primary key,
 display_name text not null check (display_name ~ '^[A-Za-z0-9_ .-]{3,16}$'),
 score int not null check (score between 0 and 1020),
 accuracy numeric(5,1) not null check (accuracy between 0 and 100),
 questions_answered int not null, correct_answers int not null, incorrect_answers int not null check (incorrect_answers between 0 and 200),
 worlds_completed int not null check (worlds_completed=10),
 artifacts_collected int not null check (artifacts_collected between 10 and 12),
 bonus_worlds_completed int not null check (bonus_worlds_completed between 0 and 2),
 hints_used int not null default 0 check (hints_used between 0 and 50),
 explorer_rank text not null, explorer_type text not null, strongest_category text not null,
 completion_percentage int not null check (completion_percentage between 0 and 100),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now());
-- v1 -> v2 migration: 10 questions per run instead of 5
alter table public.players drop constraint if exists players_questions_answered_check, drop constraint if exists players_correct_answers_check;
alter table public.players add constraint players_questions_answered_check check (questions_answered between 10 and 210), add constraint players_correct_answers_check check (correct_answers between 0 and 10);
-- correct + incorrect must always equal questions answered (NOT VALID = only enforced for new/updated rows, so legacy rows can never block this migration)
alter table public.players drop constraint if exists players_answers_consistent_check;
alter table public.players add constraint players_answers_consistent_check check (questions_answered=correct_answers+incorrect_answers) not valid;
alter table public.players enable row level security;
drop policy if exists "public read" on public.players;
create policy "public read" on public.players for select to anon using (true);
revoke insert,update,delete on public.players from anon;
-- legitimate question ids (category + difficulty); no policy = not readable by anon
create table if not exists public.zk_questions(id text primary key, category text not null, difficulty int not null check (difficulty between 1 and 3));
alter table public.zk_questions enable row level security;
insert into public.zk_questions(id,category,difficulty) values
  ('q1','Origins',1),
  ('q2','Origins',1),
  ('q3','Origins',1),
  ('q4','Origins',1),
  ('q5','Origins',1),
  ('q6','Privacy',1),
  ('q7','Origins',1),
  ('q8','Upgrades',1),
  ('q9','Privacy',1),
  ('q10','Privacy',1),
  ('q11','Privacy',1),
  ('q12','Privacy',2),
  ('q13','Privacy',2),
  ('q14','Privacy',3),
  ('q15','Privacy',2),
  ('q16','Privacy',3),
  ('q17','Proofs',1),
  ('q18','Proofs',2),
  ('q19','Proofs',2),
  ('q20','Proofs',2),
  ('q21','Proofs',2),
  ('q22','Proofs',3),
  ('q23','Proofs',3),
  ('q24','Proofs',2),
  ('q25','Proofs',2),
  ('q26','Proofs',3),
  ('q27','Keys',1),
  ('q28','Keys',1),
  ('q29','Keys',1),
  ('q30','Keys',2),
  ('q31','Keys',2),
  ('q32','Keys',2),
  ('q33','Keys',2),
  ('q34','Keys',3),
  ('q35','Keys',3),
  ('q36','Protocol',2),
  ('q37','Protocol',2),
  ('q38','Protocol',2),
  ('q39','Protocol',2),
  ('q40','Protocol',2),
  ('q41','Protocol',3),
  ('q42','Protocol',3),
  ('q43','Protocol',3),
  ('q44','Protocol',3),
  ('q45','Upgrades',1),
  ('q46','Upgrades',2),
  ('q47','Upgrades',2),
  ('q48','Upgrades',2),
  ('q49','Upgrades',2),
  ('q50','Upgrades',3),
  ('q51','Upgrades',3),
  ('q52','Upgrades',2),
  ('q53','Upgrades',2),
  ('q54','Upgrades',3),
  ('q55','Upgrades',3),
  ('q56','Upgrades',3),
  ('q57','Upgrades',3),
  ('q58','Chain',1),
  ('q59','Chain',2),
  ('q60','Chain',2),
  ('q61','Chain',2),
  ('q62','Chain',3),
  ('q63','Chain',1),
  ('q64','Ecosystem',1),
  ('q65','Ecosystem',2),
  ('q66','Ecosystem',2),
  ('q67','Ecosystem',2),
  ('q68','Ecosystem',1),
  ('q69','Ecosystem',1),
  ('q70','Ecosystem',1),
  ('q71','Ecosystem',2)
on conflict (id) do update set category=excluded.category, difficulty=excluded.difficulty;
-- v2 -> v3 migration: timed scoring. `score` is now the TOTAL SCORE (0..16000) and is the primary leaderboard value; elapsed_seconds is the tiebreaker (lower wins).
alter table public.players drop constraint if exists players_score_check, add constraint players_score_check check (score between 0 and 16000);
alter table public.players
  add column if not exists elapsed_seconds int not null default 0 check (elapsed_seconds between 0 and 604800),
  add column if not exists time_bonus int not null default 0 check (time_bonus between 0 and 3000),
  add column if not exists world_points int not null default 0 check (world_points between 0 and 5000),
  add column if not exists artifact_points int not null default 0 check (artifact_points between 0 and 3000),
  add column if not exists archive_points int not null default 0 check (archive_points between 0 and 1000),
  add column if not exists bonus_world_points int not null default 0 check (bonus_world_points between 0 and 1000),
  add column if not exists canvas_points int not null default 0 check (canvas_points in (0,500)),
  add column if not exists streak_bonus int not null default 0 check (streak_bonus between 0 and 450),
  add column if not exists no_hint_bonus int not null default 0 check (no_hint_bonus in (0,500)),
  add column if not exists accuracy_bonus int not null default 0 check (accuracy_bonus in (0,500,1000));
create index if not exists players_rank_idx on public.players(score desc, elapsed_seconds asc, created_at asc);
create or replace function public.submit_run(p jsonb) returns void language plpgsql security definer set search_path=public as $$
declare n text:=btrim(p->>'display_name'); ans jsonb:=p->'answers'; f int; i int; b int; w int; h int; s int; a numeric; c int; rk text; ty text; st text;
  cnt int; dist int; known int; sumatt int; bad int; d1 int; d2 int; d3 int; v numeric; el int; cv boolean; sk int:=0; pv boolean:=false; r record; ca int;
  wp int; ap int; arp int; bp int; cp int; nh int; ab int; tb int;
begin
  if n is null or n !~ '^[A-Za-z0-9_ .-]{3,16}$' then raise exception 'invalid name'; end if;
  if ans is null or jsonb_typeof(ans)<>'array' or jsonb_array_length(ans)<>10 then raise exception 'invalid answers'; end if;
  b:=(p->>'bonus_worlds_completed')::int; w:=(p->>'worlds_completed')::int; h:=(p->>'hints_used')::int;
  if w<>10 or b not between 0 and 2 or h not between 0 and 50 then raise exception 'invalid progress'; end if;
  -- elapsed time: must be a real JSON number; < 30s is impossible for a full run; > 1 week is clamped (time bonus is 0 after 300s anyway)
  if jsonb_typeof(p->'elapsed_seconds')<>'number' then raise exception 'invalid time'; end if;
  v:=(p->>'elapsed_seconds')::numeric; if v<30 then raise exception 'invalid time'; end if;
  el:=floor(least(v,604800))::int;
  cv:=coalesce((p->>'canvas_completed')::boolean,false);
  select count(*),count(distinct e->>'id'),coalesce(sum((e->>'att')::int),0),
         count(*) filter (where (e->>'ok')::boolean), count(*) filter (where (e->>'att')::int not between 1 and 40 or ((e->>'ok')::boolean and (e->>'att')::int<>1) or (not (e->>'ok')::boolean and (e->>'att')::int<2))
    into cnt,dist,sumatt,f,bad from jsonb_array_elements(ans) e;
  if cnt<>10 or dist<>10 or bad>0 then raise exception 'invalid answers'; end if;
  select count(*),count(*) filter (where q.difficulty=1),count(*) filter (where q.difficulty=2),count(*) filter (where q.difficulty=3)
    into known,d1,d2,d3 from jsonb_array_elements(ans) e join public.zk_questions q on q.id=e->>'id';
  if known<>10 or d1<>3 or d2<>4 or d3<>3 then raise exception 'invalid question set'; end if;
  i:=sumatt-10; ca:=cnt; -- every answer entry is a question that was finally answered correctly (validated above: ok => att=1, not ok => att>=2)
  if i not between 0 and 200 or (p->>'incorrect_answers')::int<>i or (p->>'first_try')::int<>f
     or (p->>'correct_answers')::int<>ca or (p->>'questions_answered')::int<>ca+i then raise exception 'inconsistent run'; end if;
  -- streak: +50 for every first-try answer that directly follows another first-try answer (answers are ordered)
  for r in select (e->>'ok')::boolean as ok from jsonb_array_elements(ans) with ordinality t(e,o) order by o loop
    if r.ok then if pv then sk:=sk+50; end if; pv:=true; else pv:=false; end if;
  end loop;
  a:=round(1000.0/(10+i),1); c:=round((w+b)*100.0/12);
  wp:=w*500; arp:=(w+b)*250; ap:=f*100; bp:=b*500; cp:=case when cv then 500 else 0 end; nh:=case when h=0 then 500 else 0 end;
  ab:=case when a>=100 then 1000 when a>=90 then 500 else 0 end; tb:=greatest(0,3000-el*10);
  s:=wp+arp+ap+bp+cp+sk+nh+ab+tb;
  if (p->>'score')::int is distinct from s then raise exception 'inconsistent score'; end if;
  rk:=case when s>=13500 then 'ARCHITECT' when s>=12000 then 'GUARDIAN' when s>=10500 then 'PATHFINDER' when s>=8500 then 'EXPLORER' else 'ROOKIE' end;
  select q.category into st from jsonb_array_elements(ans) e join public.zk_questions q on q.id=e->>'id'
    group by q.category order by avg(case when (e->>'ok')::boolean then 1 else 0 end) desc, count(*) desc, q.category asc limit 1;
  ty:=case when a>=90 and h=0 and st='Proofs' then 'PROVER' when a>=90 and st='Privacy' then 'PRIVACY GUARDIAN'
    when a>=90 and st in ('Protocol','Upgrades') then 'PROTOCOL ARCHITECT' when a>=85 then 'SCHOLAR'
    when c=100 then 'COMPLETIONIST' when b=1 then 'CONNECTOR' when a>=60 then 'CARTOGRAPHER' else 'EXPLORER' end;
  insert into public.players(id,display_name,score,accuracy,questions_answered,correct_answers,incorrect_answers,worlds_completed,artifacts_collected,bonus_worlds_completed,hints_used,explorer_rank,explorer_type,strongest_category,completion_percentage,
      elapsed_seconds,time_bonus,world_points,artifact_points,archive_points,bonus_world_points,canvas_points,streak_bonus,no_hint_bonus,accuracy_bonus)
  values((p->>'id')::uuid,n,s,a,ca+i,ca,i,w,w+b,b,h,rk,ty,st,c,el,tb,wp,arp,ap,bp,cp,sk,nh,ab)
  on conflict (id) do update set display_name=excluded.display_name,score=excluded.score,accuracy=excluded.accuracy,questions_answered=excluded.questions_answered,
    incorrect_answers=excluded.incorrect_answers,artifacts_collected=excluded.artifacts_collected,bonus_worlds_completed=excluded.bonus_worlds_completed,hints_used=excluded.hints_used,
    explorer_rank=excluded.explorer_rank,explorer_type=excluded.explorer_type,strongest_category=excluded.strongest_category,completion_percentage=excluded.completion_percentage,
    elapsed_seconds=excluded.elapsed_seconds,time_bonus=excluded.time_bonus,world_points=excluded.world_points,artifact_points=excluded.artifact_points,archive_points=excluded.archive_points,
    bonus_world_points=excluded.bonus_world_points,canvas_points=excluded.canvas_points,streak_bonus=excluded.streak_bonus,no_hint_bonus=excluded.no_hint_bonus,accuracy_bonus=excluded.accuracy_bonus,updated_at=now()
  -- keep a player's best run: higher score wins, equal score -> lower time wins
  where excluded.score>public.players.score or (excluded.score=public.players.score and excluded.elapsed_seconds<=public.players.elapsed_seconds);
end $$;
revoke all on function public.submit_run(jsonb) from public;
grant execute on function public.submit_run(jsonb) to anon;

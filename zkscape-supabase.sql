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
-- v3 -> v4 migration: the final trial is 15 questions (2 easy / 5 medium / 8 hard), not 10
alter table public.players add constraint players_questions_answered_check check (questions_answered between 15 and 215), add constraint players_correct_answers_check check (correct_answers between 0 and 15);
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
-- v4: question bank now mirrors worlds/10-archive.js - 138 questions, ids a001..a138.
-- Generated directly from that file; if the bank's ids or difficulties change, regenerate these rows.
-- Clear the legacy v1 bank (ids q1..q71) first: the game only ever submits a0xx ids, so those rows are
-- dead weight, but leaving them makes the table look like it holds duplicate questions.
delete from public.zk_questions where id ~ '^q[0-9]+$';
insert into public.zk_questions(id,category,difficulty) values
  ('a001', 'Origins', 1),
  ('a002', 'Origins', 1),
  ('a003', 'Origins', 1),
  ('a004', 'Origins', 1),
  ('a005', 'Origins', 1),
  ('a006', 'Origins', 1),
  ('a007', 'Origins', 2),
  ('a008', 'Origins', 1),
  ('a009', 'Origins', 1),
  ('a010', 'Origins', 2),
  ('a011', 'Origins', 2),
  ('a012', 'Origins', 2),
  ('a013', 'Origins', 2),
  ('a014', 'Origins', 2),
  ('a015', 'Origins', 2),
  ('a016', 'Origins', 1),
  ('a017', 'Origins', 2),
  ('a018', 'Origins', 2),
  ('a019', 'Origins', 2),
  ('a020', 'Origins', 2),
  ('a021', 'Origins', 2),
  ('a022', 'Origins', 2),
  ('a023', 'Privacy', 1),
  ('a024', 'Privacy', 1),
  ('a025', 'Privacy', 2),
  ('a026', 'Privacy', 2),
  ('a027', 'Privacy', 2),
  ('a028', 'Privacy', 2),
  ('a029', 'Privacy', 2),
  ('a030', 'Privacy', 3),
  ('a031', 'Privacy', 3),
  ('a032', 'Privacy', 2),
  ('a033', 'Proofs', 1),
  ('a034', 'Proofs', 2),
  ('a035', 'Proofs', 2),
  ('a036', 'Proofs', 2),
  ('a037', 'Proofs', 2),
  ('a038', 'Proofs', 2),
  ('a039', 'Proofs', 1),
  ('a040', 'Proofs', 2),
  ('a041', 'Proofs', 2),
  ('a042', 'Proofs', 2),
  ('a043', 'Proofs', 2),
  ('a044', 'Proofs', 3),
  ('a045', 'Proofs', 2),
  ('a046', 'Proofs', 3),
  ('a047', 'Proofs', 3),
  ('a048', 'Proofs', 3),
  ('a049', 'Keys', 1),
  ('a050', 'Keys', 1),
  ('a051', 'Keys', 1),
  ('a052', 'Keys', 2),
  ('a053', 'Keys', 2),
  ('a054', 'Keys', 2),
  ('a055', 'Keys', 2),
  ('a056', 'Keys', 2),
  ('a057', 'Keys', 2),
  ('a058', 'Keys', 3),
  ('a059', 'Keys', 3),
  ('a060', 'Keys', 3),
  ('a061', 'Keys', 2),
  ('a062', 'Keys', 2),
  ('a063', 'Keys', 2),
  ('a064', 'Keys', 3),
  ('a065', 'Notes', 1),
  ('a066', 'Notes', 2),
  ('a067', 'Notes', 2),
  ('a068', 'Notes', 2),
  ('a069', 'Notes', 3),
  ('a070', 'Notes', 3),
  ('a071', 'Notes', 3),
  ('a072', 'Notes', 1),
  ('a073', 'Notes', 2),
  ('a074', 'Notes', 3),
  ('a075', 'Notes', 3),
  ('a076', 'Notes', 3),
  ('a077', 'Notes', 3),
  ('a078', 'Upgrades', 2),
  ('a079', 'Upgrades', 2),
  ('a080', 'Upgrades', 2),
  ('a081', 'Upgrades', 2),
  ('a082', 'Upgrades', 3),
  ('a083', 'Upgrades', 3),
  ('a084', 'Upgrades', 3),
  ('a085', 'Upgrades', 2),
  ('a086', 'Upgrades', 2),
  ('a087', 'Upgrades', 3),
  ('a088', 'Upgrades', 2),
  ('a089', 'Upgrades', 2),
  ('a090', 'Protocol', 1),
  ('a091', 'Protocol', 2),
  ('a092', 'Protocol', 2),
  ('a093', 'Protocol', 1),
  ('a094', 'Protocol', 2),
  ('a095', 'Protocol', 2),
  ('a096', 'Protocol', 2),
  ('a097', 'Protocol', 3),
  ('a098', 'Protocol', 2),
  ('a099', 'Protocol', 3),
  ('a100', 'Protocol', 3),
  ('a101', 'Protocol', 2),
  ('a102', 'Protocol', 3),
  ('a103', 'Protocol', 2),
  ('a104', 'Protocol', 2),
  ('a105', 'Protocol', 2),
  ('a106', 'Protocol', 2),
  ('a107', 'Protocol', 2),
  ('a108', 'Upgrades', 3),
  ('a109', 'Protocol', 3),
  ('a110', 'Protocol', 3),
  ('a111', 'Protocol', 3),
  ('a112', 'Protocol', 3),
  ('a113', 'Protocol', 2),
  ('a114', 'Protocol', 3),
  ('a115', 'Ecosystem', 1),
  ('a116', 'Ecosystem', 2),
  ('a117', 'Ecosystem', 2),
  ('a118', 'Keys', 2),
  ('a119', 'Keys', 2),
  ('a120', 'Keys', 2),
  ('a121', 'Keys', 2),
  ('a122', 'Keys', 2),
  ('a123', 'Keys', 3),
  ('a124', 'Keys', 2),
  ('a125', 'Keys', 1),
  ('a126', 'Ecosystem', 1),
  ('a127', 'Ecosystem', 2),
  ('a128', 'Ecosystem', 2),
  ('a129', 'Ecosystem', 1),
  ('a130', 'Privacy', 3),
  ('a131', 'Privacy', 3),
  ('a132', 'Proofs', 3),
  ('a133', 'Keys', 3),
  ('a134', 'Protocol', 3),
  ('a135', 'Privacy', 3),
  ('a136', 'Upgrades', 3),
  ('a137', 'Notes', 3),
  ('a138', 'Proofs', 3)
on conflict (id) do update set category=excluded.category, difficulty=excluded.difficulty;

-- v2 -> v3 migration: timed scoring. `score` is now the TOTAL SCORE (0..16000) and is the primary leaderboard value; elapsed_seconds is the tiebreaker (lower wins).
alter table public.players drop constraint if exists players_score_check, add constraint players_score_check check (score between 0 and 16000);
alter table public.players
  add column if not exists elapsed_seconds int not null default 0,
  add column if not exists time_bonus int not null default 0,
  add column if not exists world_points int not null default 0,
  add column if not exists artifact_points int not null default 0,
  add column if not exists archive_points int not null default 0,
  add column if not exists bonus_world_points int not null default 0,
  add column if not exists canvas_points int not null default 0,
  add column if not exists streak_bonus int not null default 0,
  add column if not exists no_hint_bonus int not null default 0,
  add column if not exists accuracy_bonus int not null default 0;
-- The columns already existed on an older install, so `add column if not exists` skipped their CHECKs
-- and the original narrow limits stayed in force (archive_points <= 1000, streak_bonus <= 450).
-- A 15-question run legitimately earns 1500 and 700, which is what raised error 23514. Re-state every
-- check explicitly so re-running this file always syncs them, whatever the column history.
-- BOTH name forms are dropped: an inline `check (...)` auto-names as <column>_check, but this
-- database's original install used explicit names of the form players_<column>_check (e.g.
-- players_archive_points_check). Dropping only one form leaves the other in force.
alter table public.players
  drop constraint if exists players_elapsed_seconds_check,   drop constraint if exists elapsed_seconds_check,   add constraint elapsed_seconds_check   check (elapsed_seconds between 0 and 604800),
  drop constraint if exists players_time_bonus_check,       drop constraint if exists time_bonus_check,       add constraint time_bonus_check       check (time_bonus between 0 and 3000),
  drop constraint if exists players_world_points_check,     drop constraint if exists world_points_check,     add constraint world_points_check     check (world_points between 0 and 5000),
  drop constraint if exists players_artifact_points_check,  drop constraint if exists artifact_points_check,  add constraint artifact_points_check  check (artifact_points between 0 and 3000),
  drop constraint if exists players_archive_points_check,   drop constraint if exists archive_points_check,   add constraint archive_points_check   check (archive_points between 0 and 1500),
  drop constraint if exists players_bonus_world_points_check, drop constraint if exists bonus_world_points_check, add constraint bonus_world_points_check check (bonus_world_points between 0 and 1000),
  drop constraint if exists players_canvas_points_check,    drop constraint if exists canvas_points_check,    add constraint canvas_points_check    check (canvas_points in (0,500)),
  drop constraint if exists players_streak_bonus_check,     drop constraint if exists streak_bonus_check,     add constraint streak_bonus_check     check (streak_bonus between 0 and 700),
  drop constraint if exists players_no_hint_bonus_check,    drop constraint if exists no_hint_bonus_check,    add constraint no_hint_bonus_check    check (no_hint_bonus in (0,500)),
  drop constraint if exists players_accuracy_bonus_check,   drop constraint if exists accuracy_bonus_check,   add constraint accuracy_bonus_check   check (accuracy_bonus in (0,500,1000));
create index if not exists players_rank_idx on public.players(score desc, elapsed_seconds asc, created_at asc);
create or replace function public.submit_run(p jsonb) returns void language plpgsql security definer set search_path=public as $$
declare n text:=btrim(p->>'display_name'); ans jsonb:=p->'answers'; f int; i int; b int; w int; h int; s int; a numeric; c int; rk text; ty text; st text;
  cnt int; dist int; known int; sumatt int; bad int; d1 int; d2 int; d3 int; v numeric; el int; cv boolean; sk int:=0; pv boolean:=false; r record; ca int;
  wp int; ap int; arp int; bp int; cp int; nh int; ab int; tb int; qn int:=0;
begin
  if n is null or n !~ '^[A-Za-z0-9_ .-]{3,16}$' then raise exception 'invalid name'; end if;
  if ans is null or jsonb_typeof(ans)<>'array' then raise exception 'invalid answers'; end if;
  -- the final trial is 15 questions (2 easy / 5 medium / 8 hard). Read the real length from the payload
  -- and use it everywhere, so changing the question count in 10-archive.js only needs the constants below.
  qn:=jsonb_array_length(ans);
  if qn<>15 then raise exception 'invalid answers'; end if;
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
  if cnt<>qn or dist<>qn or bad>0 then raise exception 'invalid answers'; end if;
  select count(*),count(*) filter (where q.difficulty=1),count(*) filter (where q.difficulty=2),count(*) filter (where q.difficulty=3)
    into known,d1,d2,d3 from jsonb_array_elements(ans) e join public.zk_questions q on q.id=e->>'id';
  if known<>qn or d1<>2 or d2<>5 or d3<>8 then raise exception 'invalid question set'; end if;
  -- count wrong answers directly. Do NOT derive it as sumatt-qn: that only holds when every wrong answer
  -- took exactly 2 attempts, and the order/match questions re-enable their buttons, so att can exceed 2.
  i:=cnt-f; ca:=cnt; -- ca is the question count; validated above: ok => att=1, not ok => att>=2
  if i not between 0 and 200 or (p->>'incorrect_answers')::int<>i or (p->>'first_try')::int<>f
     or (p->>'correct_answers')::int<>ca or (p->>'questions_answered')::int<>ca+i then raise exception 'inconsistent run'; end if;
  -- streak: +50 for every first-try answer that directly follows another first-try answer (answers are ordered)
  for r in select (e->>'ok')::boolean as ok from jsonb_array_elements(ans) with ordinality t(e,o) order by o loop
    if r.ok then if pv then sk:=sk+50; end if; pv:=true; else pv:=false; end if;
  end loop;
  -- accuracy: correct / answered, x100. qn is the real question count, so this matches the client for any size.
  a:=case when qn+i>0 then round(100.0*qn/(qn+i),1) else 0 end; c:=round((w+b)*100.0/12);
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
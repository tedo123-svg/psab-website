-- ── News ──────────────────────────────────────────────────────────────────────
create table if not exists news (
  id         bigint generated always as identity primary key,
  title_en   text not null,
  title_am   text not null default '',
  excerpt_en text not null default '',
  excerpt_am text not null default '',
  body_en    text not null default '',
  body_am    text not null default '',
  date       text not null,
  category_en text not null default 'Announcement',
  category_am text not null default 'ማስታወቂያ',
  image      text not null default 'announcement',
  image_url  text,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Projects ──────────────────────────────────────────────────────────────────
create table if not exists projects (
  id             bigint generated always as identity primary key,
  title_en       text not null,
  title_am       text not null default '',
  description_en text not null default '',
  description_am text not null default '',
  status         text not null default 'ongoing' check (status in ('ongoing','completed')),
  progress       integer not null default 0 check (progress between 0 and 100),
  color          text not null default 'green' check (color in ('green','blue','yellow')),
  created_at     timestamptz not null default now()
);

-- ── Resources ─────────────────────────────────────────────────────────────────
create table if not exists resources (
  id         bigint generated always as identity primary key,
  title_en   text not null,
  title_am   text not null default '',
  type_en    text not null default 'Document',
  type_am    text not null default 'ሰነድ',
  category   text not null default 'policy',
  size       text not null default '1.0 MB',
  file_url   text,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Messages ──────────────────────────────────────────────────────────────────
create table if not exists messages (
  id         bigint generated always as identity primary key,
  source     text not null check (source in ('contact','community')),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Row Level Security (public read for published content) ────────────────────
alter table news      enable row level security;
alter table projects  enable row level security;
alter table resources enable row level security;
alter table messages  enable row level security;

-- Anyone can read published news
create policy "Public read published news"
  on news for select using (published = true);

-- Anyone can read projects
create policy "Public read projects"
  on projects for select using (true);

-- Anyone can read published resources
create policy "Public read published resources"
  on resources for select using (published = true);

-- Anyone can insert messages (contact/community forms)
create policy "Public insert messages"
  on messages for insert with check (true);

-- Service role (admin) has full access — handled via service key on backend
-- For this client-side admin we use anon key + RLS bypass via service role
-- Add these policies so the anon key can do admin CRUD (tighten in production):
create policy "Anon full access news"      on news      for all using (true) with check (true);
create policy "Anon full access projects"  on projects  for all using (true) with check (true);
create policy "Anon full access resources" on resources for all using (true) with check (true);
create policy "Anon read messages"         on messages  for select using (true);
create policy "Anon update messages"       on messages  for update using (true) with check (true);
create policy "Anon delete messages"       on messages  for delete using (true);

-- ── Seed data ─────────────────────────────────────────────────────────────────
insert into news (title_en, title_am, excerpt_en, excerpt_am, date, category_en, category_am, image, published) values
('Community Peace Building Workshop Successfully Completed','የማህበረሰብ ሰላም ግንባታ አውደ ጥናት በተሳካ ሁኔታ ተጠናቀቀ','Over 200 community leaders participated in a comprehensive peace-building workshop.','ከ200 በላይ የማህበረሰብ መሪዎች ተሳትፈዋል።','March 28, 2026','Training','ስልጠና','training',true),
('New Religious Institution Registration Guidelines Released','አዳዲስ የሃይማኖት ተቋም ምዝገባ መመሪያዎች ተለቀቁ','Updated guidelines streamline the registration process.','የተሻሻሉ መመሪያዎች ሂደቱን ያመቻቻሉ።','March 25, 2026','Announcement','ማስታወቂያ','announcement',true),
('Peace Council Meeting Addresses Community Concerns','የሰላም ምክር ቤት ስብሰባ ጉዳዮችን ተመለከተ','Quarterly peace council meeting brought together stakeholders.','ሩብ ዓመታዊ ስብሰባ ባለድርሻዎችን አሰባስቧል።','March 20, 2026','Event','ክስተት','event',true),
('Peace Army Recruitment Drive Begins','የሰላም ሰራዊት ምልመላ ዘመቻ ጀመረ','New recruitment campaign for peace army volunteers.','ለሰላም ሰራዊት አዲስ ዘመቻ ተጀመረ።','March 15, 2026','Campaign','ዘመቻ','campaign',true),
('Inter-Faith Dialogue Promotes Unity','የሃይማኖቶች ውይይት አንድነትን ያበረታታል','Leaders from various religious communities came together.','ከተለያዩ ሃይማኖቶች መሪዎች ተሰብስበዋል።','March 10, 2026','Event','ክስተት','dialogue',true),
('Community Security Assessment Report Published','የደህንነት ግምገማ ሪፖርት ታትሟል','Annual security assessment highlights achievements.','ዓመታዊ ግምገማ ስኬቶችን አጉልቷል።','March 5, 2026','Announcement','ማስታወቂያ','report',true);

insert into projects (title_en, title_am, description_en, description_am, status, progress, color) values
('Community Peace Ambassador Program','የማህበረሰብ ሰላም አምባሳደር ፕሮግራም','Training and deploying peace ambassadors across all sub-cities.','በሁሉም ክፍለ ከተሞች አምባሳደሮችን ማሰልጠን።','ongoing',75,'green'),
('Religious Harmony Initiative','የሃይማኖት ስምምነት ተነሳሽነት','Fostering interfaith dialogue and cooperation.','የሃይማኖቶች ትብብር ማበረታታት።','ongoing',60,'blue'),
('Early Warning System Enhancement','ቀድመው ማስጠንቀቂያ ስርዓት','Developing advanced early warning systems.','ቀድሞ ማስጠንቀቂያ ስርዓቶችን ማዘጋጀት።','ongoing',45,'yellow'),
('Peace Value Education Campaign','የሰላም እሴት ትምህርት ዘመቻ','Comprehensive education campaign promoting peace values.','የሰላም እሴቶችን የሚያስፋፋ ዘመቻ።','ongoing',85,'green'),
('Community Security Network','የማህበረሰብ ደህንነት አውታረ','Establishing neighborhood watch programs.','የጎረቤት ክትትል ፕሮግራሞች ማቋቋም።','ongoing',55,'blue'),
('Youth Peace Leadership Program','የወጣቶች ሰላም አመራር ፕሮግራም','Empowering youth as peace leaders.','ወጣቶችን እንደ ሰላም መሪዎች ማብቃት።','completed',100,'yellow');

insert into resources (title_en, title_am, type_en, type_am, category, size, published) values
('Proclamation No. 64/2011 - Establishment of PSAB','አዋጅ ቁጥር 64/2011','Legal Document','ህጋዊ ሰነድ','policy','2.4 MB',true),
('Proclamation No. 84/2016 - Amendment','አዋጅ ቁጥር 84/2016','Legal Document','ህጋዊ ሰነድ','policy','1.8 MB',true),
('Religious Institution Registration Guidelines','የምዝገባ መመሪያዎች','Guidelines','መመሪያዎች','guidelines','3.2 MB',true),
('Peace Council Implementation Manual','የሰላም ምክር ቤት መመሪያ','Manual','መመሪያ','guidelines','4.1 MB',true),
('Community Peace Building Best Practices','ምርጥ ተሞክሮዎች','Research','ምርምር','research','5.6 MB',true),
('Annual Security Assessment Report 2025','ዓመታዊ ሪፖርት 2025','Report','ሪፖርት','reports','6.8 MB',true),
('Peace Value Training Curriculum','ስርዓተ ትምህርት','Curriculum','ስርዓተ ትምህርት','training','3.5 MB',false),
('Early Warning System Guidelines','ቀድሞ ማስጠንቀቂያ መመሪያ','Guidelines','መመሪያዎች','guidelines','2.9 MB',true),
('Conflict Resolution Framework','የግጭት አፈታት ማዕቀፍ','Framework','ማዕቀፍ','policy','2.1 MB',true);

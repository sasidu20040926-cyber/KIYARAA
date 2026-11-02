-- KIYARAA schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table categories(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,description text default '',image_url text,sort int default 0);
create table products(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,description text default '',price numeric(10,2) not null,category_id uuid references categories(id) on delete set null,flower_types text default '',variations jsonb default '[]',images text[] default '{}',stock int default 0,low_stock_threshold int default 5,featured boolean default false,best_seller boolean default false,active boolean default true,sold_count int default 0,created_at timestamptz default now());
create table customers(id uuid primary key default gen_random_uuid(),name text not null,phone text unique not null,address text,created_at timestamptz default now());
create table orders(id uuid primary key default gen_random_uuid(),order_no text unique not null,customer_id uuid references customers(id),status text default 'Pending' check(status in('Pending','Confirmed','Preparing','Ready for Delivery','Delivered','Cancelled')),delivery_date date,delivery_time text,address text,card_message text,notes text,admin_notes text default '',subtotal numeric(10,2),delivery_fee numeric(10,2),total numeric(10,2),created_at timestamptz default now());
create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders(id) on delete cascade,product_id uuid references products(id) on delete set null,name text,variation text,qty int,price numeric(10,2));
create table inventory_log(id uuid primary key default gen_random_uuid(),product_id uuid references products(id) on delete cascade,change int,reason text,created_at timestamptz default now());
create table admin_users(user_id uuid primary key references auth.users(id) on delete cascade,email text);
create table settings(key text primary key,value text);

create or replace function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from admin_users where user_id=auth.uid()) $$;

alter table categories enable row level security; alter table products enable row level security; alter table customers enable row level security; alter table orders enable row level security; alter table order_items enable row level security; alter table inventory_log enable row level security; alter table admin_users enable row level security; alter table settings enable row level security;

create policy "public read cats" on categories for select using(true);
create policy "admin cats" on categories for all using(is_admin()) with check(is_admin());
create policy "public read products" on products for select using(active or is_admin());
create policy "admin products" on products for all using(is_admin()) with check(is_admin());
create policy "public read settings" on settings for select using(true);
create policy "admin settings" on settings for all using(is_admin()) with check(is_admin());
create policy "admin customers" on customers for all using(is_admin()) with check(is_admin());
create policy "admin orders" on orders for all using(is_admin()) with check(is_admin());
create policy "admin items" on order_items for all using(is_admin()) with check(is_admin());
create policy "admin inv" on inventory_log for all using(is_admin()) with check(is_admin());
create policy "self read admin" on admin_users for select using(user_id=auth.uid());

-- Public checkout: prices are re-read from the database, never trusted from the browser.
create or replace function place_order(p_customer jsonb,p_items jsonb,p_details jsonb) returns text
language plpgsql security definer as $$
declare cid uuid; oid uuid; ono text; sub numeric:=0; fee numeric; it jsonb; prod products%rowtype; pr numeric; q int;
begin
 select coalesce((select value::numeric from settings where key='delivery_fee'),0) into fee;
 insert into customers(name,phone,address) values(p_customer->>'name',p_customer->>'phone',p_details->>'address')
  on conflict(phone) do update set name=excluded.name,address=excluded.address returning id into cid;
 ono:='KY-'||to_char(now(),'YYMMDD')||'-'||lpad((floor(random()*9000)+1000)::text,4,'0');
 insert into orders(order_no,customer_id,delivery_date,delivery_time,address,card_message,notes,delivery_fee)
  values(ono,cid,nullif(p_details->>'date','')::date,p_details->>'time',p_details->>'address',p_details->>'card',p_details->>'notes',fee) returning id into oid;
 for it in select * from jsonb_array_elements(p_items) loop
  select * into prod from products where id=(it->>'id')::uuid and active;
  if not found then raise exception 'A product in your cart is no longer available'; end if;
  q:=greatest((it->>'qty')::int,1);
  if prod.stock<q then raise exception '% is out of stock',prod.name; end if;
  pr:=prod.price;
  if coalesce(it->>'variation','')<>'' then
   select coalesce((v->>'price')::numeric,prod.price) into pr from jsonb_array_elements(prod.variations) v where v->>'name'=it->>'variation' limit 1;
   pr:=coalesce(pr,prod.price);
  end if;
  insert into order_items(order_id,product_id,name,variation,qty,price) values(oid,prod.id,prod.name,it->>'variation',q,pr);
  update products set stock=stock-q,sold_count=sold_count+q where id=prod.id;
  insert into inventory_log(product_id,change,reason) values(prod.id,-q,'Order '||ono);
  sub:=sub+pr*q;
 end loop;
 update orders set subtotal=sub,total=sub+fee where id=oid;
 return ono;
end $$;
grant execute on function place_order(jsonb,jsonb,jsonb) to anon,authenticated;

-- Storage bucket for images
insert into storage.buckets(id,name,public) values('images','images',true) on conflict do nothing;
create policy "public read images" on storage.objects for select using(bucket_id='images');
create policy "admin write images" on storage.objects for all using(bucket_id='images' and is_admin()) with check(bucket_id='images' and is_admin());

-- Demo data (all editable in /admin)
insert into settings values('whatsapp','94771234567'),('delivery_fee','500'),('tagline','Flowers That Speak From The Heart.'),('phone','+94 77 123 4567'),('email','hello@kiyaraa.lk'),('address','Main Street, Anuradhapura, Sri Lanka'),('hours','Mon–Sat 8:30am–6:30pm, Sun 9am–2pm'),('instagram','https://instagram.com/kiyaraa'),('facebook','https://facebook.com/kiyaraa'),('delivery_info','Same-day delivery within Anuradhapura city for orders placed before 2pm. Outstation delivery by arrangement.'),('about','Kiyaraa is a boutique florist in Anuradhapura, hand-tying every bouquet with seasonal blooms.'),('hero_image','');
insert into categories(name,slug,description,sort) values
('Rose Bouquets','rose-bouquets','Classic and modern rose bouquets',1),('Mixed Flower Bouquets','mixed-bouquets','Seasonal blooms, hand-tied',2),('Flower Boxes','flower-boxes','Blooms in elegant keepsake boxes',3),('Premium Flower Arrangements','premium-arrangements','Statement pieces for special spaces',4),('Birthday Flowers','birthday','Celebrate their day',5),('Anniversary Flowers','anniversary','Mark the years together',6),('Love & Romance','love-romance','Say it without words',7),('Congratulations','congratulations','For wins, big and small',8),('Wedding Flowers','wedding','Bridal bouquets and venue florals',9),('Graduation Flowers','graduation','Honour the achievement',10),('Flowers for Him','for-him','Bold, understated bouquets',11),('Preserved Flowers','preserved','Blooms that last for years',12),('Mini Bouquets','mini','Small gestures, big feeling',13),('Custom Arrangements','custom','Designed around your brief',14);
insert into products(name,slug,description,price,category_id,flower_types,variations,stock,featured,best_seller) values
('Blush Rose Bouquet','blush-rose-bouquet','Soft pink roses wrapped in cream paper with a satin ribbon.',6500,(select id from categories where slug='rose-bouquets'),'Roses, Eucalyptus','[{"name":"12 stems","price":6500},{"name":"24 stems","price":11500}]',20,true,true),
('Garden Mix Bouquet','garden-mix-bouquet','A loose, seasonal bouquet of gerbera, lisianthus and greenery.',5200,(select id from categories where slug='mixed-bouquets'),'Gerbera, Lisianthus, Foliage','[]',15,true,false),
('Cream Peony Box','cream-peony-box','Peonies and roses in a round signature box.',9800,(select id from categories where slug='flower-boxes'),'Peony, Roses','[{"name":"Small","price":9800},{"name":"Large","price":14500}]',8,true,true),
('Birthday Brights','birthday-brights','Cheerful mixed blooms with a handwritten card.',4800,(select id from categories where slug='birthday'),'Sunflower, Gerbera, Carnation','[]',12,false,true),
('Anniversary Red Roses','anniversary-red-roses','Long-stem red roses, tied with velvet ribbon.',12500,(select id from categories where slug='anniversary'),'Red Roses','[{"name":"24 stems","price":12500},{"name":"50 stems","price":24000}]',10,true,true),
('Forever Preserved Rose Dome','preserved-rose-dome','A preserved rose under glass that lasts up to 3 years.',8900,(select id from categories where slug='preserved'),'Preserved Rose','[]',4,false,false),
('Mini Posy','mini-posy','A petite hand-tied posy for a thoughtful hello.',2200,(select id from categories where slug='mini'),'Mixed','[]',30,false,false),
('Gentleman''s Greens','gentlemans-greens','Structured blooms in deep green and white.',5900,(select id from categories where slug='for-him'),'Eucalyptus, White Roses','[]',9,false,false);

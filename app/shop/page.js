'use client'
import {useEffect,useState,Suspense} from 'react'
import {useSearchParams} from 'next/navigation'
import {supabase} from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
function Shop(){
 const sp=useSearchParams();const[P,setP]=useState([]);const[cats,setCats]=useState([]);const[q,setQ]=useState('');const[cat,setCat]=useState(sp.get('cat')||'');const[max,setMax]=useState('');const[sort,setSort]=useState('pop');const[err,setErr]=useState('')
 useEffect(()=>{supabase.from('categories').select('*').order('sort').then(r=>setCats(r.data||[]));supabase.from('products').select('*, categories(slug)').eq('active',true).then(r=>r.error?setErr('We could not load flowers right now. Please refresh.'):setP(r.data||[]))},[])
 let L=P.filter(p=>(!cat||p.categories?.slug===cat)&&(!q||p.name.toLowerCase().includes(q.toLowerCase()))&&(!max||p.price<=+max))
 L=[...L].sort((a,b)=>sort==='lo'?a.price-b.price:sort==='hi'?b.price-a.price:b.sold_count-a.sold_count)
 return <div className="max-w-6xl mx-auto px-5 py-10"><h1 className="text-5xl mb-6">Shop</h1>
  <div className="grid md:grid-cols-4 gap-3 mb-8"><input className="inp" placeholder="Search flowers" value={q} onChange={e=>setQ(e.target.value)}/>
   <select className="inp" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{cats.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select>
   <select className="inp" value={max} onChange={e=>setMax(e.target.value)}><option value="">Any price</option><option value="5000">Up to LKR 5,000</option><option value="10000">Up to LKR 10,000</option><option value="20000">Up to LKR 20,000</option></select>
   <select className="inp" value={sort} onChange={e=>setSort(e.target.value)}><option value="pop">Most popular</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></div>
  {err&&<p className="text-rose">{err}</p>}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{L.map(p=><ProductCard key={p.id} p={p}/>)}</div>
  {!L.length&&!err&&<p className="opacity-60">No flowers match those filters. Try clearing the price or category.</p>}</div>}
export default function Page(){return <Suspense><Shop/></Suspense>}

'use client'
import {useEffect,useState} from 'react'
import {useParams,useRouter} from 'next/navigation'
import {supabase,lkr} from '@/lib/supabase'
import {useStore} from '@/lib/store'
import ProductCard,{Img} from '@/components/ProductCard'
export default function Product(){
 const{slug}=useParams();const r=useRouter();const{add}=useStore();const[p,setP]=useState(null);const[rel,setRel]=useState([]);const[v,setV]=useState(0);const[q,setQ]=useState(1);const[img,setImg]=useState(0);const[nf,setNf]=useState(false)
 useEffect(()=>{supabase.from('products').select('*').eq('slug',slug).eq('active',true).maybeSingle().then(async({data})=>{if(!data)return setNf(true);setP(data);document.title=data.name+' | KIYARAA';const x=await supabase.from('products').select('*').eq('category_id',data.category_id).neq('id',data.id).eq('active',true).limit(4);setRel(x.data||[])})},[slug])
 if(nf)return <p className="p-20 text-center">This product is no longer available.</p>
 if(!p)return <p className="p-20 text-center opacity-60">Loading…</p>
 const vars=p.variations||[];const cur=vars[v];const price=cur?.price??p.price;const out=p.stock<1
 const item=()=>({id:p.id,name:p.name,price,image:p.images?.[0],variation:cur?.name||''})
 return <div className="max-w-6xl mx-auto px-5 py-10"><div className="grid md:grid-cols-2 gap-10">
  <div><Img src={p.images?.[img]} className="w-full aspect-[4/5] rounded-3xl"/><div className="flex gap-2 mt-3">{(p.images||[]).map((s,i)=><button key={i} onClick={()=>setImg(i)} className="w-16 h-16 rounded-xl overflow-hidden border border-cocoa/20"><Img src={s} className="w-full h-full"/></button>)}</div></div>
  <div><h1 className="text-5xl">{p.name}</h1><p className="text-2xl text-sagedark mt-2">{lkr(price)}</p><p className="mt-4 opacity-80">{p.description}</p>
   {p.flower_types&&<p className="mt-4 text-sm"><b>Flowers:</b> {p.flower_types}</p>}
   <p className={'mt-2 text-sm '+(out?'text-rose':'text-sagedark')}>{out?'Out of stock':p.stock<=p.low_stock_threshold?'Only a few left':'In stock'}</p>
   {vars.length>0&&<div className="mt-5 flex flex-wrap gap-2">{vars.map((x,i)=><button key={i} onClick={()=>setV(i)} className={'btn !py-2 border '+(i===v?'bg-cocoa text-cream':'border-cocoa/30')}>{x.name}</button>)}</div>}
   <div className="mt-6 flex items-center gap-3"><div className="flex items-center border border-cocoa/20 rounded-full"><button className="px-4 py-2" aria-label="Less" onClick={()=>setQ(Math.max(1,q-1))}>−</button><span>{q}</span><button className="px-4 py-2" aria-label="More" onClick={()=>setQ(Math.min(p.stock||1,q+1))}>+</button></div></div>
   <div className="mt-6 flex gap-3"><button disabled={out} className="btn-line flex-1" onClick={()=>{add(item(),q);r.push('/cart')}}>Add to cart</button><button disabled={out} className="btn-dark flex-1" onClick={()=>{add(item(),q);r.push('/checkout')}}>Buy now</button></div></div></div>
  {rel.length>0&&<><h2 className="text-4xl mt-20 mb-6">You may also like</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">{rel.map(x=><ProductCard key={x.id} p={x}/>)}</div></>}</div>}

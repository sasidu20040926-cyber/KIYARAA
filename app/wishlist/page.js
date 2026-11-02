'use client'
import {useEffect,useState} from 'react'
import {supabase} from '@/lib/supabase'
import {useStore} from '@/lib/store'
import ProductCard from '@/components/ProductCard'
export default function W(){const{wish}=useStore();const[P,setP]=useState([])
 useEffect(()=>{supabase.from('products').select('*').eq('active',true).then(r=>setP(r.data||[]))},[])
 const L=P.filter(p=>wish.includes(p.id))
 return <div className="max-w-6xl mx-auto px-5 py-10"><h1 className="text-5xl mb-6">Wishlist</h1>{L.length?<div className="grid grid-cols-2 md:grid-cols-4 gap-6">{L.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<p className="opacity-60">Tap the heart on any bouquet to save it here.</p>}</div>}

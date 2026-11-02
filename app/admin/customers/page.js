'use client'
import {useEffect,useState} from 'react'
import {supabase,lkr} from '@/lib/supabase'
export default function Cust(){
 const[L,setL]=useState([]);const[q,setQ]=useState('');const[sel,setSel]=useState(null)
 useEffect(()=>{supabase.from('customers').select('*, orders(order_no,status,total,created_at)').order('created_at',{ascending:false}).then(r=>setL(r.data||[]))},[])
 const F=L.filter(c=>!q||(c.name+c.phone).toLowerCase().includes(q.toLowerCase()))
 if(sel)return <div className="card p-6 max-w-xl"><button className="underline text-sm" onClick={()=>setSel(null)}>Back</button><h1 className="text-3xl mt-2">{sel.name}</h1><p className="text-sm">{sel.phone}<br/>{sel.address}</p><h3 className="text-xl mt-4">Purchase history</h3>{sel.orders.map(o=><p key={o.order_no} className="text-sm">{o.order_no} · {new Date(o.created_at).toLocaleDateString()} · {o.status} · {lkr(o.total)}</p>)}</div>
 return <div><h1 className="text-4xl mb-4">Customers</h1><input className="inp mb-4" placeholder="Search name or phone" value={q} onChange={e=>setQ(e.target.value)}/><div className="card divide-y divide-cocoa/10">{F.map(c=><button key={c.id} onClick={()=>setSel(c)} className="w-full text-left p-3 text-sm flex justify-between"><span>{c.name} · {c.phone}</span><span>{c.orders.length} orders · {lkr(c.orders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+Number(o.total),0))}</span></button>)}</div></div>}

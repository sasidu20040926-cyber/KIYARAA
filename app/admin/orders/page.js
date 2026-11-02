'use client'
import {useEffect,useState} from 'react'
import {supabase,lkr} from '@/lib/supabase'
import {csv} from '../page'
const S=['Pending','Confirmed','Preparing','Ready for Delivery','Delivered','Cancelled']
export default function Orders(){
 const[L,setL]=useState([]);const[q,setQ]=useState('');const[st,setSt]=useState('');const[sel,setSel]=useState(null);const[items,setItems]=useState([])
 const load=()=>supabase.from('orders').select('*, customers(name,phone)').order('created_at',{ascending:false}).then(r=>setL(r.data||[]));useEffect(()=>{load()},[])
 async function open(o){setSel(o);const r=await supabase.from('order_items').select('*').eq('order_id',o.id);setItems(r.data||[])}
 async function upd(o,patch){await supabase.from('orders').update(patch).eq('id',o.id);setSel({...o,...patch});load()}
 const F=L.filter(o=>(!st||o.status===st)&&(!q||(o.order_no+o.customers?.name+o.customers?.phone).toLowerCase().includes(q.toLowerCase())))
 if(sel)return <div className="card p-6 max-w-2xl"><button className="underline text-sm noprint" onClick={()=>setSel(null)}>Back to orders</button><h1 className="text-3xl mt-2">Order {sel.order_no}</h1><p className="text-sm opacity-70">{new Date(sel.created_at).toLocaleString()}</p>
  <p className="mt-3 text-sm"><b>{sel.customers?.name}</b> · {sel.customers?.phone}<br/>{sel.address}<br/>Deliver {sel.delivery_date}, {sel.delivery_time}</p>
  <table className="w-full text-sm mt-4">{items.map(i=><tr key={i.id}><td>{i.name}{i.variation?` (${i.variation})`:''} x{i.qty}</td><td className="text-right">{lkr(i.price*i.qty)}</td></tr>)}<tr><td>Delivery</td><td className="text-right">{lkr(sel.delivery_fee)}</td></tr><tr className="font-medium"><td>Total</td><td className="text-right">{lkr(sel.total)}</td></tr></table>
  <p className="text-sm mt-3"><b>Card message:</b> {sel.card_message||'-'}<br/><b>Customer notes:</b> {sel.notes||'-'}</p>
  <div className="noprint mt-4 space-y-3"><select className="inp" value={sel.status} onChange={e=>upd(sel,{status:e.target.value})}>{S.map(s=><option key={s}>{s}</option>)}</select><textarea className="inp" placeholder="Internal notes" defaultValue={sel.admin_notes} onBlur={e=>upd(sel,{admin_notes:e.target.value})}/><button className="btn-dark" onClick={()=>window.print()}>Print invoice</button></div></div>
 return <div><div className="flex justify-between mb-4 flex-wrap gap-2"><h1 className="text-4xl">Orders</h1><button className="btn-line" onClick={()=>csv('orders',F.map(o=>({order:o.order_no,date:o.created_at.slice(0,10),customer:o.customers?.name,phone:o.customers?.phone,status:o.status,total:o.total})))}>Export CSV</button></div>
  <div className="flex gap-3 mb-4"><input className="inp" placeholder="Search order no., name or phone" value={q} onChange={e=>setQ(e.target.value)}/><select className="inp !w-48" value={st} onChange={e=>setSt(e.target.value)}><option value="">All statuses</option>{S.map(s=><option key={s}>{s}</option>)}</select></div>
  <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-cream text-left"><tr><th className="p-3">Order</th><th>Customer</th><th>Delivery</th><th>Total</th><th>Status</th></tr></thead><tbody>{F.map(o=><tr key={o.id} className="border-t border-cocoa/10 cursor-pointer hover:bg-cream/50" onClick={()=>open(o)}><td className="p-3">{o.order_no}</td><td>{o.customers?.name}</td><td>{o.delivery_date}</td><td>{lkr(o.total)}</td><td>{o.status}</td></tr>)}</tbody></table>{!F.length&&<p className="p-4 text-sm opacity-60">No orders yet.</p>}</div></div>}

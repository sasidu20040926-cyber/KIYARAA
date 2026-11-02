'use client'
import {useEffect,useState} from 'react'
import {supabase,lkr} from '@/lib/supabase'
export const csv=(name,rows)=>{if(!rows.length)return;const k=Object.keys(rows[0]);const t=[k.join(','),...rows.map(r=>k.map(c=>'"'+String(r[c]??'').replace(/"/g,'""')+'"').join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download=name+'.csv';a.click()}
const Bars=({title,data})=>{const m=Math.max(1,...data.map(d=>d[1]));return <div className="card p-5"><h3 className="text-2xl mb-3">{title}</h3>{data.length?data.map(([l,v])=><div key={l} className="flex items-center gap-2 text-xs mb-1"><span className="w-24 truncate">{l}</span><div className="flex-1 bg-cream rounded-full h-3"><div className="bg-sage h-3 rounded-full" style={{width:v/m*100+'%'}}/></div><span>{Math.round(v).toLocaleString()}</span></div>):<p className="text-sm opacity-50">No data yet.</p>}</div>}
export default function Dash(){
 const[o,setO]=useState([]);const[items,setItems]=useState([]);const[P,setP]=useState([]);const[range,setRange]=useState('daily')
 useEffect(()=>{supabase.from('orders').select('*').order('created_at').then(r=>setO(r.data||[]));supabase.from('order_items').select('*').then(r=>setItems(r.data||[]));supabase.from('products').select('*').then(r=>setP(r.data||[]))},[])
 const live=o.filter(x=>x.status!=='Cancelled');const cnt=s=>o.filter(x=>x.status===s).length;const sum=a=>a.reduce((s,x)=>s+Number(x.total||0),0)
 const ym=new Date().toISOString().slice(0,7);const group=f=>Object.entries(live.reduce((a,x)=>{const k=f(x.created_at);a[k]=(a[k]||0)+Number(x.total);return a},{})).slice(-12)
 const wk=d=>{const x=new Date(d);x.setDate(x.getDate()-x.getDay());return x.toISOString().slice(0,10)}
 const sales=range==='daily'?group(d=>d.slice(0,10)):range==='weekly'?group(wk):group(d=>d.slice(0,7))
 const best=Object.entries(items.reduce((a,i)=>{a[i.name]=(a[i.name]||0)+i.qty;return a},{})).sort((a,b)=>b[1]-a[1]).slice(0,6)
 const stat=['Pending','Confirmed','Preparing','Ready for Delivery','Delivered','Cancelled'].map(s=>[s,cnt(s)])
 const low=P.filter(p=>p.stock<=p.low_stock_threshold)
 const K=[['Total orders',o.length],['Pending',cnt('Pending')],['Confirmed',cnt('Confirmed')],['Completed',cnt('Delivered')],['Cancelled',cnt('Cancelled')],['Total sales',lkr(sum(live))],['This month',lkr(sum(live.filter(x=>x.created_at.startsWith(ym))))],['Products',P.length],['Low stock',low.length]]
 return <div><h1 className="text-4xl mb-6">Dashboard</h1><div className="grid grid-cols-2 md:grid-cols-5 gap-3">{K.map(([l,v])=><div key={l} className="card p-4"><div className="text-xs opacity-60">{l}</div><div className="font-serif text-2xl">{v}</div></div>)}</div>
 <div className="grid md:grid-cols-2 gap-4 mt-6"><div><div className="flex gap-2 mb-2 text-sm">{['daily','weekly','monthly'].map(r=><button key={r} onClick={()=>setRange(r)} className={'btn !py-1 '+(range===r?'bg-cocoa text-cream':'border border-cocoa/30')}>{r}</button>)}<button className="btn-line !py-1 ml-auto" onClick={()=>csv('sales-'+range,sales.map(([period,total])=>({period,total})))}>Export CSV</button></div><Bars title={`Sales (${range}, LKR)`} data={sales}/></div>
  <Bars title="Best-selling products (units)" data={best}/><Bars title="Order status" data={stat}/>
  <div className="card p-5"><h3 className="text-2xl mb-3">Low stock</h3>{low.length?low.map(p=><p key={p.id} className="text-sm">{p.name}: <b>{p.stock}</b> left</p>):<p className="text-sm opacity-50">All stocked.</p>}</div></div></div>}

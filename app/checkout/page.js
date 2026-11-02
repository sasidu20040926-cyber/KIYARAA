'use client'
import {useEffect,useState} from 'react'
import {supabase,getSettings,lkr} from '@/lib/supabase'
import {useStore} from '@/lib/store'
export default function Checkout(){
 const{cart,subtotal,clear}=useStore();const[s,setS]=useState({});const[f,setF]=useState({name:'',phone:'',address:'',date:'',time:'Morning (9am–12pm)',card:'',notes:''});const[busy,setBusy]=useState(false);const[err,setErr]=useState('')
 useEffect(()=>{getSettings().then(setS)},[])
 const set=k=>e=>setF({...f,[k]:e.target.value});const fee=Number(s.delivery_fee||0)
 async function submit(e){e.preventDefault();setErr('');setBusy(true)
  const{data,error}=await supabase.rpc('place_order',{p_customer:{name:f.name,phone:f.phone},p_items:cart.map(i=>({id:i.id,qty:i.qty,variation:i.variation})),p_details:f})
  setBusy(false);if(error)return setErr(error.message||'We could not place your order. Please try again.')
  const lines=cart.map(i=>`• ${i.name}${i.variation?` (${i.variation})`:''} x${i.qty} – ${lkr(i.price*i.qty)}`).join('\n')
  const msg=`*New Order ${data} – KIYARAA*\n\n${lines}\n\nSubtotal: ${lkr(subtotal)}\nDelivery: ${lkr(fee)}\n*Total: ${lkr(subtotal+fee)}*\n\n*Name:* ${f.name}\n*Phone:* ${f.phone}\n*Address:* ${f.address}\n*Delivery:* ${f.date}, ${f.time}\n*Card message:* ${f.card||'-'}\n*Notes:* ${f.notes||'-'}\n\nPayment will be arranged on confirmation.`
  clear();window.location.href=`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}`}
 if(!cart.length)return <p className="p-20 text-center">Your cart is empty.</p>
 return <form onSubmit={submit} className="max-w-5xl mx-auto px-5 py-10 grid md:grid-cols-5 gap-10"><div className="md:col-span-3 space-y-3"><h1 className="text-5xl mb-4">Checkout</h1>
  <input required className="inp" placeholder="Your name" value={f.name} onChange={set('name')}/><input required className="inp" placeholder="Contact number (e.g. 0771234567)" value={f.phone} onChange={set('phone')}/>
  <textarea required className="inp" placeholder="Delivery address" value={f.address} onChange={set('address')}/>
  <div className="grid grid-cols-2 gap-3"><input required type="date" min={new Date().toISOString().slice(0,10)} className="inp" value={f.date} onChange={set('date')}/><select className="inp" value={f.time} onChange={set('time')}><option>Morning (9am–12pm)</option><option>Afternoon (12pm–4pm)</option><option>Evening (4pm–7pm)</option></select></div>
  <textarea className="inp" placeholder="Greeting card message (optional)" value={f.card} onChange={set('card')}/><textarea className="inp" placeholder="Order notes (optional)" value={f.notes} onChange={set('notes')}/></div>
  <div className="md:col-span-2 card p-6 h-fit"><h2 className="text-3xl mb-3">Summary</h2>{cart.map(i=><div key={i.id+i.variation} className="flex justify-between text-sm py-1"><span>{i.name} x{i.qty}</span><span>{lkr(i.price*i.qty)}</span></div>)}
   <hr className="my-3"/><div className="flex justify-between text-sm"><span>Subtotal</span><span>{lkr(subtotal)}</span></div><div className="flex justify-between text-sm"><span>Delivery</span><span>{lkr(fee)}</span></div><div className="flex justify-between text-xl mt-2"><span>Total</span><span>{lkr(subtotal+fee)}</span></div>
   {err&&<p className="text-rose text-sm mt-3">{err}</p>}<button disabled={busy} className="btn-dark w-full mt-5">{busy?'Placing order…':'Order via WhatsApp'}</button><p className="text-xs opacity-60 mt-3">Your order is saved, then WhatsApp opens so we can confirm it and arrange payment. No online payment is taken.</p></div></form>}

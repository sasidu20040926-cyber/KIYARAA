'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'
import {supabase} from '@/lib/supabase'
export const AdminCtx=null
export default function AdminLayout({children}){
 const[state,setState]=useState('loading');const[e,setE]=useState('');const[p,setP]=useState('');const[err,setErr]=useState('')
 async function check(){const{data:{session}}=await supabase.auth.getSession();if(!session)return setState('login')
  const{data}=await supabase.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle();setState(data?'ok':'denied')}
 useEffect(()=>{check()},[])
 async function login(ev){ev.preventDefault();setErr('');const{error}=await supabase.auth.signInWithPassword({email:e,password:p});if(error)return setErr('Incorrect email or password.');check()}
 if(state==='loading')return <p className="p-20 text-center opacity-60">Loading…</p>
 if(state!=='ok')return <div className="min-h-screen bg-cream flex items-center justify-center p-5"><form onSubmit={login} className="card p-8 w-full max-w-sm space-y-3"><div className="font-serif text-3xl tracking-[.25em] text-center">KIYARAA</div><p className="text-center text-sm opacity-60">Admin sign in</p>
  {state==='denied'&&<p className="text-rose text-sm">This account is not an administrator. Add it to admin_users (see README).</p>}
  <input className="inp" type="email" placeholder="Email" value={e} onChange={x=>setE(x.target.value)} required/><input className="inp" type="password" placeholder="Password" value={p} onChange={x=>setP(x.target.value)} required/>{err&&<p className="text-rose text-sm">{err}</p>}<button className="btn-dark w-full">Sign in</button>
  {state==='denied'&&<button type="button" className="underline text-sm" onClick={()=>supabase.auth.signOut().then(()=>setState('login'))}>Sign out</button>}</form></div>
 const N=[['Dashboard','/admin'],['Products','/admin/products'],['Categories','/admin/categories'],['Orders','/admin/orders'],['Customers','/admin/customers'],['Settings','/admin/settings']]
 return <div className="min-h-screen bg-cream/60 md:flex"><aside className="md:w-56 bg-cocoa text-cream p-5 noprint"><div className="font-serif text-2xl tracking-[.25em] mb-6">KIYARAA</div><nav className="flex md:flex-col gap-3 flex-wrap text-sm">{N.map(([t,h])=><Link key={h} href={h}>{t}</Link>)}<Link href="/" className="opacity-60">View site</Link><button className="text-left opacity-60" onClick={()=>supabase.auth.signOut().then(()=>setState('login'))}>Log out</button></nav></aside><div className="flex-1 p-5 md:p-8 min-w-0">{children}</div></div>}

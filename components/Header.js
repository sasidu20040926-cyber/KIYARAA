'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'
import {getSettings} from '@/lib/supabase'
import {useStore} from '@/lib/store'
export default function Header(){
 const{count,wish}=useStore();const[open,setOpen]=useState(false);const[s,setS]=useState({})
 useEffect(()=>{getSettings().then(setS)},[])
 const L=[['Shop','/shop'],['Wishlist','/wishlist']]
 return <><header className="sticky top-0 z-30 bg-soft/90 backdrop-blur border-b border-cocoa/10 noprint">
  <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
   <Link href="/" className="font-serif text-3xl tracking-[.25em]">KIYARAA</Link>
   <nav className="hidden md:flex gap-8 text-sm">{L.map(([t,h])=><Link key={h} href={h}>{t}{t==='Wishlist'&&wish.length?` (${wish.length})`:''}</Link>)}</nav>
   <div className="flex items-center gap-4 text-sm"><Link href="/cart" className="btn-dark !py-2 !px-4">Cart ({count})</Link>
    <button className="md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>☰</button></div></div>
  {open&&<nav className="md:hidden px-5 pb-4 flex flex-col gap-3">{L.map(([t,h])=><Link key={h} href={h} onClick={()=>setOpen(false)}>{t}</Link>)}</nav>}
 </header>
 {s.whatsapp&&<a href={`https://wa.me/${s.whatsapp}`} target="_blank" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg noprint">WA</a>}</>}

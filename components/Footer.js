'use client'
import {useEffect,useState} from 'react'
import {getSettings} from '@/lib/supabase'
export default function Footer(){
 const[s,setS]=useState({});useEffect(()=>{getSettings().then(setS)},[])
 return <footer className="bg-cocoa text-cream mt-24 noprint"><div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-10 text-sm">
  <div><div className="font-serif text-3xl tracking-[.25em]">KIYARAA</div><p className="mt-3 opacity-80 max-w-xs">{s.about}</p></div>
  <div className="space-y-1 opacity-90"><p>{s.address}</p><p>{s.phone}</p><p>{s.email}</p><p>{s.hours}</p></div>
  <div className="space-y-1"><p className="opacity-80">{s.delivery_info}</p><p className="pt-3 flex gap-5"><a href={s.instagram}>Instagram</a><a href={s.facebook}>Facebook</a></p></div>
 </div></footer>}

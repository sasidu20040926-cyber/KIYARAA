'use client'
import {useEffect,useState} from 'react'
import {supabase,getSettings} from '@/lib/supabase'
const FIELDS=[['whatsapp','WhatsApp number (country code, digits only, e.g. 94771234567)'],['delivery_fee','Delivery charge (LKR)'],['tagline','Website tagline'],['phone','Phone'],['email','Email'],['address','Address'],['hours','Opening hours'],['instagram','Instagram URL'],['facebook','Facebook URL'],['delivery_info','Delivery information'],['about','About us'],['hero_image','Hero banner image URL (or upload below)']]
export default function Settings(){
 const[s,setS]=useState({});const[msg,setMsg]=useState('');useEffect(()=>{getSettings().then(setS)},[])
 async function hero(e){const file=e.target.files[0];if(!file)return;const path=`hero/${Date.now()}-${file.name.replace(/\s/g,'_')}`;const{error}=await supabase.storage.from('images').upload(path,file);if(error)return setMsg(error.message);setS({...s,hero_image:supabase.storage.from('images').getPublicUrl(path).data.publicUrl})}
 async function save(e){e.preventDefault();const{error}=await supabase.from('settings').upsert(FIELDS.map(([k])=>({key:k,value:s[k]||''})));setMsg(error?error.message:'Saved.')}
 return <form onSubmit={save} className="card p-6 max-w-2xl space-y-3"><h1 className="text-3xl">Website settings</h1>{FIELDS.map(([k,l])=><label key={k} className="block text-sm">{l}<input className="inp mt-1" value={s[k]||''} onChange={e=>setS({...s,[k]:e.target.value})}/></label>)}<input type="file" accept="image/*" onChange={hero}/><button className="btn-dark">Save settings</button>{msg&&<p className="text-sm">{msg}</p>}</form>}

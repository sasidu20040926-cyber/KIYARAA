'use client'
import {useEffect,useState} from 'react'
import {supabase,lkr} from '@/lib/supabase'
const empty={name:'',price:'',description:'',flower_types:'',category_id:'',stock:0,low_stock_threshold:5,featured:false,best_seller:false,active:true,images:[],vars:''}
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export default function Products(){
 const[L,setL]=useState([]);const[C,setC]=useState([]);const[f,setF]=useState(null);const[msg,setMsg]=useState('')
 const load=()=>{supabase.from('products').select('*').order('created_at',{ascending:false}).then(r=>setL(r.data||[]));supabase.from('categories').select('*').order('sort').then(r=>setC(r.data||[]))}
 useEffect(load,[])
 const edit=p=>setF({...p,vars:(p.variations||[]).map(v=>`${v.name}:${v.price}`).join(', ')})
 async function upload(e){const urls=[];for(const file of e.target.files){const path=`products/${Date.now()}-${file.name.replace(/\s/g,'_')}`;const{error}=await supabase.storage.from('images').upload(path,file);if(error)return setMsg('Image upload failed: '+error.message);urls.push(supabase.storage.from('images').getPublicUrl(path).data.publicUrl)}setF({...f,images:[...(f.images||[]),...urls]})}
 async function save(e){e.preventDefault();setMsg('')
  const variations=f.vars.split(',').map(s=>s.trim()).filter(Boolean).map(s=>{const[n,p]=s.split(':');return{name:n.trim(),price:Number(p)}})
  const row={name:f.name,slug:f.slug||slugify(f.name),description:f.description,price:Number(f.price),category_id:f.category_id||null,flower_types:f.flower_types,variations,images:f.images,stock:Number(f.stock),low_stock_threshold:Number(f.low_stock_threshold),featured:f.featured,best_seller:f.best_seller,active:f.active}
  const{error}=f.id?await supabase.from('products').update(row).eq('id',f.id):await supabase.from('products').insert(row)
  if(error)return setMsg(error.message);if(f.id)await supabase.from('inventory_log').insert({product_id:f.id,change:0,reason:'Edited by admin'});setF(null);load()}
 async function del(p){if(confirm(`Delete ${p.name}? This cannot be undone.`)){await supabase.from('products').delete().eq('id',p.id);load()}}
 const T=k=>e=>setF({...f,[k]:e.target.type==='checkbox'?e.target.checked:e.target.value})
 if(f)return <form onSubmit={save} className="card p-6 max-w-2xl space-y-3"><h1 className="text-3xl">{f.id?'Edit':'Add'} product</h1>
  <input className="inp" required placeholder="Name" value={f.name} onChange={T('name')}/><div className="grid grid-cols-3 gap-3"><input className="inp" required type="number" placeholder="Price (LKR)" value={f.price} onChange={T('price')}/><input className="inp" type="number" placeholder="Stock" value={f.stock} onChange={T('stock')}/><input className="inp" type="number" placeholder="Low-stock alert at" value={f.low_stock_threshold} onChange={T('low_stock_threshold')}/></div>
  <select className="inp" value={f.category_id||''} onChange={T('category_id')}><option value="">No category</option>{C.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
  <textarea className="inp" placeholder="Description" value={f.description} onChange={T('description')}/><input className="inp" placeholder="Flower types (comma separated)" value={f.flower_types} onChange={T('flower_types')}/>
  <input className="inp" placeholder="Variations, e.g. Small:4500, Large:7500" value={f.vars} onChange={T('vars')}/>
  <div><input type="file" accept="image/*" multiple onChange={upload}/><div className="flex gap-2 mt-2 flex-wrap">{f.images.map((u,i)=><div key={u} className="relative"><img src={u} className="w-16 h-16 rounded-lg object-cover"/><button type="button" className="absolute -top-1 -right-1 bg-cocoa text-cream rounded-full w-5 h-5 text-xs" onClick={()=>setF({...f,images:f.images.filter((_,j)=>j!==i)})}>×</button></div>)}</div></div>
  <div className="flex gap-5 text-sm">{[['featured','Featured'],['best_seller','Best seller'],['active','Active (visible)']].map(([k,l])=><label key={k}><input type="checkbox" checked={f[k]} onChange={T(k)}/> {l}</label>)}</div>
  {msg&&<p className="text-rose text-sm">{msg}</p>}<div className="flex gap-3"><button className="btn-dark">Save product</button><button type="button" className="btn-line" onClick={()=>setF(null)}>Cancel</button></div></form>
 return <div><div className="flex justify-between mb-4"><h1 className="text-4xl">Products</h1><button className="btn-dark" onClick={()=>setF({...empty})}>Add product</button></div>
  <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-cream text-left"><tr><th className="p-3">Name</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>{L.map(p=><tr key={p.id} className="border-t border-cocoa/10"><td className="p-3">{p.name}</td><td>{lkr(p.price)}</td><td className={p.stock<1?'text-rose':''}>{p.stock<1?'Out of stock':p.stock}</td><td>{p.active?'Active':'Hidden'}{p.featured?' · Featured':''}{p.best_seller?' · Best seller':''}</td><td className="space-x-3 pr-3 text-right"><button className="underline" onClick={()=>edit(p)}>Edit</button><button className="underline text-rose" onClick={()=>del(p)}>Delete</button></td></tr>)}</tbody></table></div></div>}

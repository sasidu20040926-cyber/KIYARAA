'use client'
import Link from 'next/link'
import {lkr} from '@/lib/supabase'
import {useStore} from '@/lib/store'
export const Img=({src,className=''})=>src?<img src={src} alt="" loading="lazy" className={'object-cover '+className}/>:<div className={'bg-gradient-to-br from-blush to-cream flex items-center justify-center text-4xl '+className}>🌸</div>
export default function ProductCard({p}){
 const{wish,toggleWish,add}=useStore();const out=p.stock<1;const liked=wish.includes(p.id)
 return <div className="card group">
  <Link href={`/product/${p.slug}`} className="block relative"><Img src={p.images?.[0]} className="w-full aspect-[4/5] group-hover:scale-[1.02] transition duration-500"/>
   {out&&<span className="absolute top-3 left-3 bg-cocoa text-cream text-xs px-3 py-1 rounded-full">Out of stock</span>}</Link>
  <button aria-label="Save to wishlist" onClick={()=>toggleWish(p.id)} className="absolute -mt-[calc(100%)] hidden"/>
  <div className="p-4">
   <div className="flex justify-between gap-2"><Link href={`/product/${p.slug}`} className="font-serif text-xl leading-tight">{p.name}</Link>
    <button aria-label="Save to wishlist" onClick={()=>toggleWish(p.id)} className={liked?'text-rose':'text-cocoa/40'}>{liked?'♥':'♡'}</button></div>
   <p className="text-sagedark mt-1">{lkr(p.price)}</p>
   <button disabled={out} onClick={()=>add({id:p.id,name:p.name,price:p.price,image:p.images?.[0],variation:''})} className="btn-line w-full mt-3 !py-2">Add to cart</button>
  </div></div>}

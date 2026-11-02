'use client'
import Link from 'next/link'
import {useStore} from '@/lib/store'
import {lkr} from '@/lib/supabase'
import {Img} from '@/components/ProductCard'
export default function Cart(){const{cart,setQty,remove,subtotal}=useStore()
 return <div className="max-w-3xl mx-auto px-5 py-10"><h1 className="text-5xl mb-8">Your cart</h1>
 {!cart.length?<><p className="opacity-70">Your cart is empty.</p><Link href="/shop" className="btn-dark mt-4">Browse flowers</Link></>:<>
  {cart.map(i=><div key={i.id+i.variation} className="flex gap-4 py-4 border-b border-cocoa/10"><Img src={i.image} className="w-20 h-20 rounded-2xl"/><div className="flex-1"><div className="font-serif text-xl">{i.name}</div><div className="text-sm opacity-60">{i.variation}</div><div className="text-sagedark">{lkr(i.price)}</div>
   <div className="flex gap-3 items-center mt-2 text-sm"><button aria-label="Less" onClick={()=>setQty(i,i.qty-1)}>−</button>{i.qty}<button aria-label="More" onClick={()=>setQty(i,i.qty+1)}>+</button><button className="underline ml-4" onClick={()=>remove(i)}>Remove</button></div></div><div>{lkr(i.price*i.qty)}</div></div>)}
  <p className="text-right text-2xl mt-6">Subtotal {lkr(subtotal)}</p><p className="text-right text-sm opacity-60">Delivery fee is added at checkout.</p>
  <div className="flex justify-between mt-6"><Link href="/shop" className="btn-line">Continue shopping</Link><Link href="/checkout" className="btn-dark">Proceed to checkout</Link></div></>}</div>}

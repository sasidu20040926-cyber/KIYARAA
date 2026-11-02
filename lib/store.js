'use client'
import {createContext,useContext,useEffect,useState} from 'react'
const Ctx=createContext(null)
export const useStore=()=>useContext(Ctx)
const load=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}}
export function StoreProvider({children}){
 const[cart,setCart]=useState([]);const[wish,setWish]=useState([]);const[ready,setReady]=useState(false)
 useEffect(()=>{setCart(load('ky_cart'));setWish(load('ky_wish'));setReady(true)},[])
 useEffect(()=>{if(ready){localStorage.setItem('ky_cart',JSON.stringify(cart));localStorage.setItem('ky_wish',JSON.stringify(wish))}},[cart,wish,ready])
 const key=i=>i.id+'|'+(i.variation||'')
 const add=(item,qty=1)=>setCart(c=>{const f=c.find(x=>key(x)===key(item));return f?c.map(x=>key(x)===key(item)?{...x,qty:x.qty+qty}:x):[...c,{...item,qty}]})
 const setQty=(item,qty)=>setCart(c=>qty<1?c.filter(x=>key(x)!==key(item)):c.map(x=>key(x)===key(item)?{...x,qty}:x))
 const remove=item=>setCart(c=>c.filter(x=>key(x)!==key(item)))
 const toggleWish=id=>setWish(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id])
 const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0)
 return <Ctx.Provider value={{cart,add,setQty,remove,clear:()=>setCart([]),subtotal,count:cart.reduce((s,i)=>s+i.qty,0),wish,toggleWish}}>{children}</Ctx.Provider>}

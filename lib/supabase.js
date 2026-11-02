import {createClient} from '@supabase/supabase-js'
export const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'http://localhost',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'x')
export const lkr=n=>'LKR '+Number(n||0).toLocaleString('en-LK')
export async function getSettings(){const{data}=await supabase.from('settings').select('*');return Object.fromEntries((data||[]).map(r=>[r.key,r.value]))}

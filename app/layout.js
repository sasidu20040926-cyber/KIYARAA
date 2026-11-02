import './globals.css'
import {StoreProvider} from '@/lib/store'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export const metadata={title:'KIYARAA | Luxury Flower Boutique, Anuradhapura',description:'Premium bouquets, flower boxes and arrangements delivered in Anuradhapura, Sri Lanka. Order via WhatsApp.'}
export default function Root({children}){return <html lang="en"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap"/></head>
<body><StoreProvider><Header/><main>{children}</main><Footer/></StoreProvider></body></html>}

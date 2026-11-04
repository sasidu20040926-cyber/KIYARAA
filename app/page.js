
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase, getSettings } from '@/lib/supabase'
import ProductCard, { Img } from '@/components/ProductCard'

const Row = ({ title, subtitle, items }) => items.length ? (
  <section className="max-w-6xl mx-auto px-5 mt-20 md:mt-28">
    <div className="flex justify-between items-end mb-7">
      <div>
        <p className="text-xs tracking-[.25em] uppercase text-[#A85D37] mb-2">
          Curated by Kiyaraa
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#49372F]">{title}</h2>
        {subtitle && <p className="text-sm text-[#49372F]/60 mt-2">{subtitle}</p>}
      </div>
      <Link href="/shop" className="text-xs tracking-wider border-b border-[#A85D37]/50 pb-1">
        VIEW ALL
      </Link>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {items.map(p => <ProductCard key={p.id} p={p} />)}
    </div>
  </section>
) : null

const categoryIcon = name => {
  const n = name.toLowerCase()
  if (n.includes('teddy')) return '🧸'
  if (n.includes('box')) return '🎁'
  if (n.includes('preserved')) return '🌹'
  if (n.includes('rose')) return '🌹'
  if (n.includes('accessor')) return '🎀'
  if (n.includes('chocolate')) return '🍫'
  if (n.includes('bouquet')) return '💐'
  if (n.includes('flower')) return '🌷'
  return '✨'
}

export default function Home() {
  const [s, setS] = useState({})
  const [cats, setCats] = useState([])
  const [P, setP] = useState([])

  useEffect(() => {
    getSettings().then(data => {
  console.log('KIYARAA SETTINGS:', data)
  setS(data)
})
    supabase.from('categories').select('*').order('sort')
      .then(r => setCats(r.data || []))
    supabase.from('products').select('*').eq('active', true)
      .order('created_at', { ascending: false })
      .then(r => setP(r.data || []))
  }, [])

  return <>
    {/* HERO */}
    <section className="bg-[#F8F1E9] overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative z-10">
          <p className="text-[#B45D36] text-xs tracking-[.3em] uppercase mb-6">
            THE ART OF FLOWERS & GIFTING
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#49372F]">
            Flowers that<br />
            <span className="italic text-[#C46A3E]">speak</span> beautifully.
          </h1>
          <p className="mt-7 max-w-md text-sm md:text-base leading-7 text-[#49372F]/70">
            Discover thoughtfully arranged flowers, elegant gift boxes
            and beautiful little treasures, made to turn moments into memories.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="inline-flex bg-[#49372F] text-white rounded-full px-7 py-3.5 text-sm hover:bg-[#B45D36] transition">
              Explore Collection
            </Link>
            <Link href="/custom-bouquet" className="inline-flex border border-[#49372F]/40 text-[#49372F] rounded-full px-7 py-3.5 text-sm hover:bg-[#EAD8C9] transition">
              Design Your Bouquet
            </Link>
          </div>
          <p className="mt-10 text-[10px] tracking-[.25em] text-[#49372F]/50">
            FLOWERS · GIFTS · LITTLE MOMENTS OF JOY
          </p>
        </div>

        <div className="relative">
  <div className="absolute -inset-3 border border-[#C46A3E]/30 rounded-3xl" />

  <Img
    src={s.hero_image}
    className="relative w-full h-auto rounded-3xl"
  />

  <div className="absolute bottom-5 left-5 bg-[#F8F1E9]/90 backdrop-blur-sm px-5 py-3 rounded-full">
    <p className="text-[10px] tracking-[.2em] text-[#A85D37]">
      A TOUCH OF NATURE
    </p>
  </div>
</div>
      </div>
      <div className="absolute top-8 right-8 text-[#C46A3E]/20 text-7xl hidden md:block">✿</div>
    </section>

    {/* BRAND MESSAGE */}
    <section className="py-14 md:py-20 text-center px-5 bg-[#FFFCF8]">
      <p className="text-xs tracking-[.3em] uppercase text-[#A85D37]">
        A LITTLE SOMETHING SPECIAL
      </p>
      <h2 className="font-serif text-3xl md:text-5xl mt-4 text-[#49372F]">
        Nature's beauty, thoughtfully arranged.
      </h2>
      <p className="max-w-xl mx-auto text-sm text-[#49372F]/60 leading-7 mt-5">
        Every flower tells a story. Every gift carries a feeling.
        Find something beautiful, made with care and a little extra love.
      </p>
      <div className="w-16 h-px bg-[#C46A3E] mx-auto mt-8" />
    </section>

    {/* CATEGORIES */}
    <section className="max-w-6xl mx-auto px-5 mt-12 md:mt-16">
      <div className="flex justify-between items-end mb-7">
        <div>
          <p className="text-xs tracking-[.25em] uppercase text-[#A85D37] mb-2">
            Find something lovely
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#49372F]">
            Explore Collections
          </h2>
        </div>
        <Link href="/shop" className="text-xs border-b border-[#A85D37]/50 pb-1 text-[#49372F]">
          SHOP ALL
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map(c => (
          <Link
            key={c.id}
            href={`/shop?cat=${c.slug}`}
            className="group bg-[#F8F1E9] rounded-2xl overflow-hidden"
          >
            <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#F2DCCF] via-[#F8F1E9] to-[#DCE4D6] overflow-hidden">
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <span className="text-5xl group-hover:scale-110 transition duration-500">
                  {categoryIcon(c.name)}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg md:text-xl text-[#49372F]">{c.name}</h3>
              <p className="text-[10px] tracking-widest text-[#A85D37] mt-2">
                EXPLORE COLLECTION →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* CUSTOM BOUQUET STUDIO */}
    <section className="max-w-6xl mx-auto px-5 mt-20 md:mt-28">
      <div className="relative bg-[#49372F] text-[#F8F1E9] rounded-[2rem] overflow-hidden">
        <div className="absolute top-0 right-0 text-[180px] leading-none text-white/[0.04] pointer-events-none">
          ✿
        </div>
        <div className="relative z-10 p-8 md:p-14">
          <p className="text-xs tracking-[.3em] uppercase text-[#E9A17C]">
            YOUR FLOWERS, YOUR CREATION
          </p>
          <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight max-w-2xl">
            A bouquet as unique as your feelings.
          </h2>
          <p className="text-sm leading-7 text-white/65 mt-5 max-w-xl">
            Choose a beautiful design and make it your own, or start from scratch
            and create something completely personal. Your imagination, our flowers.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-10">
            <Link href="/custom-bouquet" className="group bg-[#F8F1E9] text-[#49372F] rounded-2xl p-6 hover:bg-[#F0DFD2] transition">
              <span className="text-4xl">💐</span>
              <h3 className="font-serif text-2xl mt-4">Customise a Design</h3>
              <p className="text-sm text-[#49372F]/65 mt-2 leading-6">
                Pick one of our ready-made bouquet styles and personalise its flowers,
                wrapping and ribbons.
              </p>
              <p className="text-xs tracking-widest text-[#A85D37] mt-6">
                EXPLORE DESIGNS →
              </p>
            </Link>

            <Link href="/custom-bouquet?mode=build" className="group bg-[#E9A17C] text-[#49372F] rounded-2xl p-6 hover:bg-[#F0B99A] transition">
              <span className="text-4xl">🌷</span>
              <h3 className="font-serif text-2xl mt-4">Build Your Own</h3>
              <p className="text-sm text-[#49372F]/75 mt-2 leading-6">
                Start with your favourite flowers, choose quantities and create
                a bouquet from your own imagination.
              </p>
              <p className="text-xs tracking-widest text-[#49372F] mt-6">
                START CREATING →
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* BEST SELLERS */}
    <Row
      title="Our Best Sellers"
      subtitle="The pieces everyone loves."
      items={P.filter(p => p.best_seller).slice(0, 4)}
    />

    {/* GIFT FEATURE */}
    <section className="max-w-6xl mx-auto px-5 mt-20 md:mt-28">
      <div className="bg-[#E5E9DE] rounded-3xl overflow-hidden grid md:grid-cols-2 items-center">
        <div className="p-8 md:p-14">
          <p className="text-xs tracking-[.25em] uppercase text-[#64765A]">
            MAKE IT PERSONAL
          </p>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight text-[#49372F]">
            Gifts made with a little extra love.
          </h2>
          <p className="text-sm leading-7 text-[#49372F]/70 mt-5 max-w-md">
            Beautiful bouquets, adorable teddy bears, sweet treats and
            thoughtful little accessories. Find the perfect combination
            to make someone smile.
          </p>
          <Link href="/shop" className="inline-flex bg-[#49372F] text-white rounded-full px-7 py-3.5 text-sm mt-7 hover:bg-[#A85D37] transition">
            Explore All Gifts
          </Link>
        </div>
        <div className="min-h-[280px] md:min-h-[440px] bg-gradient-to-br from-[#F2DCCF] to-[#F8F1E9] flex items-center justify-center">
          <span className="text-8xl md:text-9xl">🎁</span>
        </div>
      </div>
    </section>

    {/* NEW ARRIVALS */}
    <Row
      title="Just Arrived"
      subtitle="Fresh finds and lovely new additions."
      items={P.slice(0, 4)}
    />

    {/* FEATURED PRODUCTS */}
    <Row
      title="Beautifully Curated"
      subtitle="Special pieces, selected with love."
      items={P.filter(p => p.featured).slice(0, 4)}
    />

    {/* FINAL CTA */}
    <section className="max-w-6xl mx-auto px-5 mt-24 mb-12">
      <div className="bg-[#F2DCCF] text-[#49372F] rounded-3xl text-center px-6 py-16 md:py-20">
        <p className="text-xs tracking-[.3em] uppercase text-[#A85D37]">
          YOUR NEXT BEAUTIFUL GIFT
        </p>
        <h2 className="font-serif text-4xl md:text-6xl mt-5">
          Make someone&apos;s day.
        </h2>
        <p className="text-sm text-[#49372F]/70 mt-4">
          Discover something beautiful at Kiyaraa.
        </p>
        <Link href="/shop" className="inline-flex mt-8 bg-[#49372F] text-white rounded-full px-8 py-3.5 text-sm hover:bg-[#A85D37] transition">
          Shop the Collection
        </Link>
      </div>
    </section>
  </>
}

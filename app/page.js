
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase, getSettings } from '@/lib/supabase'
import ProductCard, { Img } from '@/components/ProductCard'

const Row = ({ title, subtitle, items }) => items.length ? (
  <section className="max-w-6xl mx-auto px-5 mt-20 md:mt-28">
    <div className="flex justify-between items-end mb-7">
      <div>
        <p className="text-xs tracking-[.25em] uppercase text-sagedark mb-2">
          Curated for you
        </p>
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        {subtitle && <p className="text-sm opacity-60 mt-2">{subtitle}</p>}
      </div>
      <Link href="/shop" className="text-xs tracking-wider border-b border-cocoa/40 pb-1">
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
    getSettings().then(setS)
    supabase.from('categories').select('*').order('sort')
      .then(r => setCats(r.data || []))
    supabase.from('products').select('*').eq('active', true)
      .order('created_at', { ascending: false })
      .then(r => setP(r.data || []))
  }, [])

  return <>
    {/* HERO */}
    <section className="bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="bloom">
          <p className="text-sagedark text-xs tracking-[.3em] uppercase mb-6">
            THE ART OF GIFTING · ANURADHAPURA
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05]">
            Little Things.<br />
            <span className="italic text-sagedark">Beautiful</span> Feelings.
          </h1>
          <p className="mt-7 max-w-md text-sm md:text-base leading-7 opacity-70">
            Thoughtfully curated flowers, elegant gift boxes and little treasures
            made to bring happiness to someone special.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-dark">Explore Collection</Link>
            <Link href="/shop" className="btn-line">Discover Gifts</Link>
          </div>
          <p className="mt-10 text-xs tracking-widest text-cocoa/50">
            FLOWERS · GIFTS · BEAUTIFUL MOMENTS
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 border border-sagedark/20 rounded-t-full rounded-b-3xl" />
          <Img
            src={s.hero_image}
            className="relative w-full aspect-[4/5] rounded-t-full rounded-b-3xl"
          />
        </div>
      </div>
    </section>

    {/* BRAND MESSAGE */}
    <section className="py-12 md:py-16 text-center px-5">
      <p className="text-xs tracking-[.3em] uppercase text-sagedark">
        A little something special
      </p>
      <h2 className="font-serif text-3xl md:text-4xl mt-4">
        More than flowers. A feeling to remember.
      </h2>
      <p className="max-w-xl mx-auto text-sm opacity-60 leading-7 mt-4">
        From beautiful bouquets to thoughtfully packed gift boxes,
        find something lovely for every kind of heart.
      </p>
    </section>

    {/* CATEGORIES */}
    <section className="max-w-6xl mx-auto px-5 mt-8 md:mt-12">
      <div className="flex justify-between items-end mb-7">
        <div>
          <p className="text-xs tracking-[.25em] uppercase text-sagedark mb-2">
            Find your favourite
          </p>
          <h2 className="text-3xl md:text-4xl">Explore Collections</h2>
        </div>
        <Link href="/shop" className="text-xs border-b border-cocoa/40 pb-1">
          SHOP ALL
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map((c, i) => (
          <Link
            key={c.id}
            href={`/shop?cat=${c.slug}`}
            className="group bg-cream rounded-2xl overflow-hidden"
          >
            <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-blush/70 via-cream to-sage/20">
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
              <h3 className="font-serif text-lg md:text-xl">{c.name}</h3>
              <p className="text-[10px] tracking-widest text-sagedark mt-2">
                EXPLORE COLLECTION →
              </p>
            </div>
          </Link>
        ))}
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
      <div className="bg-sage/20 rounded-3xl overflow-hidden grid md:grid-cols-2 items-center">
        <div className="p-8 md:p-14">
          <p className="text-xs tracking-[.25em] uppercase text-sagedark">
            Make it personal
          </p>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">
            Gifts made with a little extra love.
          </h2>
          <p className="text-sm leading-7 opacity-70 mt-5 max-w-md">
            Beautiful bouquets, adorable teddy bears, sweet treats and
            thoughtful little accessories. Find the perfect combination
            to make someone smile.
          </p>
          <Link href="/shop" className="btn-dark mt-7">
            Explore All Gifts
          </Link>
        </div>
        <div className="min-h-[280px] md:min-h-[440px] bg-gradient-to-br from-blush/60 to-cream flex items-center justify-center">
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
    <section className="max-w-6xl mx-auto px-5 mt-24 mb-10">
      <div className="bg-cocoa text-cream rounded-3xl text-center px-6 py-16 md:py-20">
        <p className="text-xs tracking-[.3em] uppercase opacity-60">
          YOUR NEXT BEAUTIFUL GIFT
        </p>
        <h2 className="font-serif text-4xl md:text-5xl mt-5">
          Make someone&apos;s day.
        </h2>
        <p className="text-sm opacity-70 mt-4">
          Discover something beautiful at Kiyaraa.
        </p>
        <Link href="/shop" className="inline-flex mt-8 bg-cream text-cocoa rounded-full px-8 py-3 text-sm hover:bg-blush transition">
          Shop the Collection
        </Link>
      </div>
    </section>
  </>
}

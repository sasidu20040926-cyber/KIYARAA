
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Bouquet3DPreview from '@/components/Bouquet3DPreview'

const wrappings = [
  { name: 'Cream', color: '#F1E2D0' },
  { name: 'Blush Pink', color: '#EBC5C5' },
  { name: 'Sage Green', color: '#C9D5C1' },
  { name: 'Brown', color: '#B99A7D' }
]

const ribbons = ['White', 'Pink', 'Gold', 'Brown']

export default function CustomBouquet() {
  const [flowers, setFlowers] = useState([])
  const [loading, setLoading] = useState(true)

  const [items, setItems] = useState([])

  const [wrapping, setWrapping] = useState('Cream')
  const [ribbon, setRibbon] = useState('White')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadFlowers() {
      const { data, error } = await supabase
        .from('bouquet_flowers')
        .select('*')
        .eq('available', true)
        .order('sort_order')
        .order('created_at')

      if (error) {
        console.error('Flower loading error:', error.message)
      } else {
        setFlowers(data || [])
      }

      setLoading(false)
    }

    loadFlowers()
  }, [])

  // Find the available 3D flower model
  const redRose = flowers.find(
    flower => flower.name?.toLowerCase().trim() === 'red rose'
  )

  // Price calculation
  const totalFlowers = items.length

  const flowerTotal = items.reduce(
    (sum, item) => sum + Number(item.flower.price || 0),
    0
  )

  const wrappingPrice = 500

  const total = flowerTotal + wrappingPrice

  // WhatsApp ordering
  const order = () => {
    if (items.length === 0) {
      alert('Please add flowers to your bouquet first!')
      return
    }

    const details = items
      .map(item =>
        `${item.flower.name}: LKR ${Number(item.flower.price).toLocaleString()}`
      )
      .join('\n')

    const orderMessage = `Hello KIYARAA! I want to order my custom bouquet.

${details}

Wrapping: ${wrapping}
Ribbon: ${ribbon}
Message: ${message || 'No message'}

Total flowers: ${totalFlowers}
Wrapping & ribbon: LKR ${wrappingPrice.toLocaleString()}

Total: LKR ${total.toLocaleString()}`

    window.open(
      `https://wa.me/?text=${encodeURIComponent(orderMessage)}`,
      '_blank'
    )
  }

  return (
    <main className="min-h-screen bg-[#F8F1E9] py-12 px-5">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-12">

          <p className="text-xs tracking-[.3em] text-[#B45D36]">
            KIYARAA CUSTOM STUDIO
          </p>

          <h1 className="font-serif text-5xl text-[#49372F] mt-3">
            Design Your Bouquet
          </h1>

          <p className="text-[#49372F]/70 mt-3">
            Create a bouquet that is uniquely yours.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* LEFT PANEL */}

          <section className="bg-white rounded-3xl p-6 md:p-7 shadow-sm">

            {/* FLOWER SELECTION */}

            <h2 className="font-serif text-2xl text-[#49372F] mb-2">
              01. Choose Your Flowers
            </h2>

            <p className="text-sm text-[#49372F]/60 mb-6">
              Explore our flower collection and create your arrangement.
            </p>

            {loading ? (

              <p className="text-[#49372F]/60">
                Loading flowers...
              </p>

            ) : flowers.length === 0 ? (

              <p className="text-[#49372F]/60">
                No flowers are currently available.
              </p>

            ) : (

              <div className="grid grid-cols-2 gap-4">

                {flowers.map(flower => {

                  const is3DAvailable =
                    flower.name?.toLowerCase().trim() === 'red rose'

                  return (

                    <div
                      key={flower.id}
                      className="border border-[#EAD8C9] rounded-2xl p-3"
                    >

                      {flower.image_url ? (

                        <img
                          src={flower.image_url}
                          alt={flower.name}
                          className="w-full h-32 object-cover rounded-xl mb-3"
                        />

                      ) : (

                        <div className="w-full h-32 rounded-xl mb-3 bg-[#F8F1E9] flex items-center justify-center text-4xl">
                          🌷
                        </div>

                      )}

                      <p className="font-medium text-[#49372F]">
                        {flower.name}
                      </p>

                      <p className="text-sm text-[#B45D36] mt-1">
                        LKR {Number(flower.price).toLocaleString()}
                      </p>

                      {is3DAvailable ? (

                        <div className="mt-3 text-center bg-[#EAF0E6] text-[#526449] rounded-full py-2 text-xs">
                          3D Model Available
                        </div>

                      ) : (

                        <div className="mt-3 text-center bg-[#F8F1E9] text-[#49372F]/60 rounded-full py-2 text-xs">
                          3D Model Coming Soon
                        </div>

                      )}

                    </div>

                  )

                })}

              </div>

            )}

            {/* WRAPPING */}

            <h2 className="font-serif text-2xl text-[#49372F] mt-10 mb-4">
              02. Choose Wrapping
            </h2>

            <div className="grid grid-cols-2 gap-3">

              {wrappings.map(w => (

                <button
                  key={w.name}
                  onClick={() => setWrapping(w.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    wrapping === w.name
                      ? 'border-[#B45D36] bg-[#F8F1E9]'
                      : 'border-[#EAD8C9] bg-white'
                  }`}
                >

                  <span
                    className="w-8 h-8 rounded-full border border-black/10"
                    style={{ background: w.color }}
                  />

                  <span className="text-sm text-[#49372F]">
                    {w.name}
                  </span>

                </button>

              ))}

            </div>

            {/* RIBBON */}

            <h2 className="font-serif text-2xl text-[#49372F] mt-8 mb-4">
              03. Choose Ribbon
            </h2>

            <div className="flex flex-wrap gap-2">

              {ribbons.map(r => (

                <button
                  key={r}
                  onClick={() => setRibbon(r)}
                  className={`px-5 py-2 rounded-full border text-sm transition ${
                    ribbon === r
                      ? 'bg-[#49372F] text-white border-[#49372F]'
                      : 'border-[#C46A3E] text-[#49372F]'
                  }`}
                >
                  {r}
                </button>

              ))}

            </div>

            {/* MESSAGE CARD */}

            <h2 className="font-serif text-2xl text-[#49372F] mt-8 mb-4">
              04. Message Card
            </h2>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your special message..."
              maxLength={250}
              className="w-full border border-[#EAD8C9] rounded-xl p-4 outline-none bg-[#FFFCF8] focus:border-[#B45D36]"
              rows={4}
            />

            <p className="text-xs text-right text-[#49372F]/50 mt-1">
              {message.length}/250
            </p>

          </section>

          {/* RIGHT PANEL - 3D STUDIO */}

          <section className="bg-[#FFFCF8] rounded-3xl p-6 md:p-7 shadow-sm lg:sticky lg:top-8">

            <h2 className="font-serif text-3xl text-[#49372F]">
              Your Creation
            </h2>

            <p className="text-sm text-[#B45D36] mt-2 mb-5">
              Interactive 3D Bouquet Studio
            </p>

            {!loading && !redRose && (

              <div className="mb-4 p-4 rounded-xl bg-[#FFF0E9] text-sm text-[#8C4935]">
                Red Rose is not currently available in your flower collection.
                Please check the flower name in your admin dashboard.
              </div>

            )}

            <Bouquet3DPreview
              items={items}
              setItems={setItems}
              redRose={redRose}
            />

            {/* PRICE SUMMARY */}

            <div className="mt-7 border-t border-[#EAD8C9] pt-5">

              <h3 className="font-serif text-xl text-[#49372F] mb-5">
                Your Bouquet Summary
              </h3>

              <div className="flex justify-between text-[#49372F]">

                <span>Flowers ({totalFlowers})</span>

                <span>
                  LKR {flowerTotal.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between mt-3 text-[#49372F]">

                <span>Wrapping & Ribbon</span>

                <span>
                  LKR {wrappingPrice.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between mt-5 pt-4 border-t border-[#EAD8C9] font-serif text-2xl text-[#B45D36]">

                <span>Total</span>

                <span>
                  LKR {total.toLocaleString()}
                </span>

              </div>

            </div>

            {/* ORDER BUTTON */}

            <button
              onClick={order}
              disabled={loading || items.length === 0}
              className="w-full mt-7 bg-[#49372F] text-white py-4 rounded-full hover:bg-[#B45D36] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Order via WhatsApp
            </button>

            <p className="text-xs text-center text-[#49372F]/50 mt-3">
              Your custom bouquet will be sent to KIYARAA via WhatsApp.
            </p>

          </section>

        </div>

      </div>

    </main>
  )
}

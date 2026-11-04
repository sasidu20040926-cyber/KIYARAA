
'use client'

import { useEffect, useState } from 'react'
import { supabase, lkr } from '@/lib/supabase'

export default function BouquetFlowers() {
  const [flowers, setFlowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')

  async function loadFlowers() {
    const { data, error } = await supabase
      .from('bouquet_flowers')
      .select('*')
      .order('sort_order')
      .order('created_at')

    if (error) alert(error.message)
    else setFlowers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadFlowers()
  }, [])

  function resetForm() {
    setEditing(null)
    setName('')
    setPrice('')
    setDescription('')
    setImage(null)
    setPreview('')
  }

  function editFlower(f) {
    setEditing(f.id)
    setName(f.name)
    setPrice(String(f.price))
    setDescription(f.description || '')
    setPreview(f.image_url || '')
    setImage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveFlower(e) {
    e.preventDefault()
    if (!name.trim() || Number(price) < 0) return

    setSaving(true)
    let imageUrl = preview

    try {
      if (image) {
        const ext = image.name.split('.').pop()
        const path = `bouquet-flowers/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(path, image, { upsert: false })

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('site-assets')
          .getPublicUrl(path)

        imageUrl = data.publicUrl
      }

      const values = {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        image_url: imageUrl || null
      }

      const result = editing
        ? await supabase.from('bouquet_flowers').update(values).eq('id', editing)
        : await supabase.from('bouquet_flowers').insert(values)

      if (result.error) throw result.error

      alert(editing ? 'Flower updated!' : 'Flower added!')
      resetForm()
      await loadFlowers()
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleAvailability(f) {
    const { error } = await supabase
      .from('bouquet_flowers')
      .update({ available: !f.available })
      .eq('id', f.id)

    if (error) alert(error.message)
    else loadFlowers()
  }

  async function deleteFlower(f) {
    if (!confirm(`Delete ${f.name}?`)) return

    const { error } = await supabase
      .from('bouquet_flowers')
      .delete()
      .eq('id', f.id)

    if (error) alert(error.message)
    else loadFlowers()
  }

  if (loading) return <p>Loading flowers...</p>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-serif mb-2">Bouquet Flowers</h1>
      <p className="text-sm opacity-60 mb-8">
        Manage individual flowers for Custom Bouquet Studio.
      </p>

      <form onSubmit={saveFlower} className="card p-6 mb-8 space-y-4">
        <h2 className="text-2xl font-serif">
          {editing ? 'Edit Flower' : 'Add New Flower'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm block mb-2">Flower Name</label>
            <input
              className="inp w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Red Roses"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Price (LKR)</label>
            <input
              className="inp w-full"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="350"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm block mb-2">Flower Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                setImage(file)
                setPreview(URL.createObjectURL(file))
              }
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="Flower preview"
              className="w-28 h-28 object-cover rounded-xl mt-3"
            />
          )}
        </div>

        <div>
          <label className="text-sm block mb-2">Description</label>
          <textarea
            className="inp w-full min-h-24"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Flower description..."
          />
        </div>

        <div className="flex gap-3">
          <button disabled={saving} className="btn-dark">
            {saving ? 'Saving...' : editing ? 'Update Flower' : 'Add Flower'}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="btn-line">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-serif mb-4">
        Flower Collection ({flowers.length})
      </h2>

      {flowers.length === 0 ? (
        <div className="card p-8 text-center opacity-60">
          No flowers added yet. Add your first flower above.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flowers.map(f => (
            <div key={f.id} className="card overflow-hidden">
              {f.image_url ? (
                <img
                  src={f.image_url}
                  alt={f.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="h-48 bg-sage/40 flex items-center justify-center text-5xl">
                  🌷
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between gap-2">
                  <h3 className="font-serif text-xl">{f.name}</h3>
                  <span className="text-sm font-semibold">{lkr(f.price)}</span>
                </div>

                <p className="text-sm opacity-60 mt-2">
                  {f.description || 'No description'}
                </p>

                <p className={`text-xs mt-3 ${f.available ? 'text-green-700' : 'text-red-600'}`}>
                  {f.available ? 'Available' : 'Unavailable'}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => editFlower(f)} className="btn-line !py-2">
                    Edit
                  </button>
                  <button onClick={() => toggleAvailability(f)} className="btn-line !py-2">
                    {f.available ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deleteFlower(f)} className="btn-line !py-2">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

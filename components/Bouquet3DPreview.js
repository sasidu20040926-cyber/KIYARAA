
'use client'

import { Suspense, useMemo, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { MTLLoader, OBJLoader } from 'three-stdlib'
import * as THREE from 'three'

function RoseScene({ items, selectedId, setSelectedId }) {
  const materials = useLoader(MTLLoader, '/models/Red_rose_SF.mtl')

  const object = useLoader(
    OBJLoader,
    '/models/Red_rose_SF.obj',
    loader => loader.setMaterials(materials)
  )

  const asset = useMemo(() => {
    const base = object.clone(true)

    const box = new THREE.Box3().setFromObject(base)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // Center the model horizontally.
    // Keep the bottom of the stem at Y = 0.
    base.position.x -= center.x
    base.position.z -= center.z
    base.position.y -= box.min.y

    base.traverse(child => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })

    return {
      object: base,
      scale: 3.5 / Math.max(size.x, size.y, size.z)
    }
  }, [object])

  return (
    <>
      {items.map(item => (
        <RoseInstance
          key={item.id}
          item={item}
          asset={asset}
          selected={item.id === selectedId}
          onSelect={() => setSelectedId(item.id)}
        />
      ))}

      <ContactShadows
        position={[0, -1.72, 0]}
        opacity={0.2}
        scale={5}
        blur={2}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={12}
      />
    </>
  )
}

function RoseInstance({ item, asset, selected, onSelect }) {
  const model = useMemo(
    () => asset.object.clone(true),
    [asset]
  )

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      scale={item.size * asset.scale}
      onClick={e => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <primitive object={model} />
    </group>
  )
}

export default function Bouquet3DPreview({
  items,
  setItems,
  redRose
}) {
  const [selectedId, setSelectedId] = useState(null)

  const selected = items.find(item => item.id === selectedId)

  const updateSelected = changes => {
    if (!selected || selected.locked) return

    setItems(prev =>
      prev.map(item =>
        item.id === selectedId
          ? { ...item, ...changes }
          : item
      )
    )
  }

  // Automatically arrange new roses around the bouquet.
  const addRose = () => {
    if (!redRose || items.length >= 15) return

    const index = items.length
    const angle = index * 2.399

    const radius = index === 0
      ? 0
      : Math.min(0.08 + index * 0.045, 0.42)

    const tilt = Math.min(radius * 0.9, 0.42)

    const id = `${Date.now()}-${Math.random()}`

    const newRose = {
      id,
      flower: redRose,

      // Stems gather around the bottom centre.
      position: [
        Math.cos(angle) * radius,
        -1.65,
        Math.sin(angle) * radius
      ],

      // Outer roses naturally lean outward.
      rotation: [
        tilt * Math.cos(angle),
        angle,
        -tilt * Math.sin(angle)
      ],

      size: index === 0 ? 0.9 : 0.8,
      locked: false
    }

    setItems(prev => [...prev, newRose])
    setSelectedId(id)
  }

  const move = (x, z) => {
    if (!selected) return

    updateSelected({
      position: [
        selected.position[0] + x,
        selected.position[1],
        selected.position[2] + z
      ]
    })
  }

  const rotate = direction => {
    if (!selected) return

    updateSelected({
      rotation: [
        selected.rotation[0],
        selected.rotation[1] + direction * Math.PI / 12,
        selected.rotation[2]
      ]
    })
  }

  const resize = amount => {
    if (!selected) return

    updateSelected({
      size: Math.max(
        0.4,
        Math.min(1.8, selected.size + amount)
      )
    })
  }

  const toggleLock = () => {
    if (!selected) return

    setItems(prev =>
      prev.map(item =>
        item.id === selectedId
          ? { ...item, locked: !item.locked }
          : item
      )
    )
  }

  const removeRose = () => {
    setItems(prev =>
      prev.filter(item => item.id !== selectedId)
    )

    setSelectedId(null)
  }

  return (
    <div className="w-full">

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

        <div>
          <p className="font-medium text-[#49372F]">
            Rose Bouquet Studio
          </p>

          <p className="text-xs text-[#49372F]/60">
            {items.length} / 15 flowers added
          </p>
        </div>

        <button
          onClick={addRose}
          disabled={!redRose || items.length >= 15}
          className="px-5 py-2.5 rounded-full bg-[#49372F] text-white text-sm hover:bg-[#B45D36] disabled:opacity-40"
        >
          + Add Red Rose
        </button>

      </div>

      <div className="w-full h-[430px] rounded-3xl overflow-hidden bg-[#F8F1E9] border border-[#EAD8C9]">

        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [3, 1.8, 6], fov: 38 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance'
          }}
          onPointerMissed={() => setSelectedId(null)}
        >

          <color attach="background" args={['#F8F1E9']} />

          <ambientLight intensity={1.2} />

          <directionalLight
            position={[4, 6, 5]}
            intensity={2}
          />

          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.8}
          />

          <Suspense fallback={null}>
            <RoseScene
              items={items}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </Suspense>

        </Canvas>

      </div>

      {selected ? (

        <div className="mt-4 p-4 rounded-2xl bg-[#F8F1E9] border border-[#EAD8C9]">

          <div className="flex justify-between items-center gap-2 mb-4">

            <div>
              <p className="text-xs tracking-wider text-[#B45D36]">
                SELECTED FLOWER
              </p>

              <p className="font-medium text-[#49372F]">
                {selected.flower.name}
              </p>
            </div>

            <button
              onClick={toggleLock}
              className={`px-4 py-2 rounded-full text-sm ${
                selected.locked
                  ? 'bg-[#49372F] text-white'
                  : 'bg-white text-[#49372F]'
              }`}
            >
              {selected.locked ? '🔒 Locked' : '🔓 Lock'}
            </button>

          </div>

          <div className="grid grid-cols-4 gap-2">

            <button disabled={selected.locked} onClick={() => move(-0.2, 0)} className="bg-white rounded-xl py-3 disabled:opacity-40">←</button>

            <button disabled={selected.locked} onClick={() => move(0, -0.2)} className="bg-white rounded-xl py-3 disabled:opacity-40">↑</button>

            <button disabled={selected.locked} onClick={() => move(0, 0.2)} className="bg-white rounded-xl py-3 disabled:opacity-40">↓</button>

            <button disabled={selected.locked} onClick={() => move(0.2, 0)} className="bg-white rounded-xl py-3 disabled:opacity-40">→</button>

            <button disabled={selected.locked} onClick={() => rotate(-1)} className="bg-white rounded-xl py-3 text-sm disabled:opacity-40">↶ Rotate</button>

            <button disabled={selected.locked} onClick={() => rotate(1)} className="bg-white rounded-xl py-3 text-sm disabled:opacity-40">↷ Rotate</button>

            <button disabled={selected.locked} onClick={() => resize(-0.1)} className="bg-white rounded-xl py-3 text-sm disabled:opacity-40">− Size</button>

            <button disabled={selected.locked} onClick={() => resize(0.1)} className="bg-white rounded-xl py-3 text-sm disabled:opacity-40">+ Size</button>

          </div>

          <button
            onClick={removeRose}
            className="w-full mt-3 py-3 rounded-xl bg-red-50 text-red-700 text-sm"
          >
            Remove Selected Flower
          </button>

        </div>

      ) : (

        <p className="text-sm text-center text-[#49372F]/60 mt-4">
          Select a rose in the 3D preview to edit it.
        </p>

      )}

      <p className="text-xs text-[#49372F]/60 mt-3">
        Drag to rotate the camera and scroll to zoom. Select a flower to edit its position, rotation and size.
      </p>

    </div>
  )
}

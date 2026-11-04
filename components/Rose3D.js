
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

function createPetal(width, length, curl, wave, twist = 0) {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const indices = []
  const rows = 24
  const segments = 24

  for (let j = 0; j <= rows; j++) {
    const v = j / rows

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * 2 - 1

      const edge = Math.sin(Math.PI * v) ** 0.38
      const x = u * width * edge
      const z = v * length

      const edgeWave = Math.sin(u * Math.PI * 3 + v * 5) * wave * Math.abs(u) ** 3

      const y =
        curl * v * v +
        0.18 * u * u +
        edgeWave +
        0.12 * Math.sin(v * Math.PI) * (1 - u * u)

      const rotatedX = x * Math.cos(twist * v) - z * Math.sin(twist * v)
      const rotatedZ = x * Math.sin(twist * v) + z * Math.cos(twist * v)

      positions.push(rotatedX, y, rotatedZ)
    }
  }

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i
      const b = a + segments + 1

      indices.push(a, b, a + 1)
      indices.push(b, b + 1, a + 1)
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

function Petal({ geometry, angle, scale, color }) {
  return (
    <mesh
      geometry={geometry}
      rotation={[0, angle, 0]}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        roughness={0.42}
        metalness={0}
        side={THREE.DoubleSide}
        clearcoat={0.22}
        clearcoatRoughness={0.5}
      />
    </mesh>
  )
}

function Leaf({ position, rotation, scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color="#315D35" roughness={0.72} />
      </mesh>

      <mesh position={[0, 0.025, 0]} scale={[0.9, 0.025, 0.035]}>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#86A66A" roughness={0.7} />
      </mesh>
    </group>
  )
}

export default function Rose3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#B5223E'
}) {
  const petals = useMemo(() => ({
    outer: createPetal(0.42, 0.9, 0.3, 0.055, 0.08),
    middle: createPetal(0.34, 0.7, 0.24, 0.045, 0.12),
    inner: createPetal(0.25, 0.52, 0.18, 0.025, 0.2),
    core: createPetal(0.17, 0.35, 0.13, 0.018, 0.35)
  }), [])

  return (
    <group position={position} rotation={rotation} scale={scale}>

      {/* STEM */}
      <mesh position={[0, -0.78, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, 1.9, 16]} />
        <meshStandardMaterial color="#285C32" roughness={0.8} />
      </mesh>

      {/* LEAVES */}
      <Leaf
        position={[-0.18, -0.55, 0]}
        rotation={[0.3, 0.2, -0.8]}
        scale={[0.2, 0.045, 0.48]}
      />

      <Leaf
        position={[0.17, -0.95, 0]}
        rotation={[-0.2, 0.4, 0.85]}
        scale={[0.19, 0.04, 0.42]}
      />

      {/* SEPALS */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`sepal-${i}`}
          position={[0, -0.03, 0]}
          rotation={[0, (i / 5) * Math.PI * 2, 0]}
          scale={[0.13, 0.09, 0.42]}
          castShadow
        >
          <coneGeometry args={[0.35, 1, 12]} />
          <meshStandardMaterial color="#356C3A" roughness={0.75} />
        </mesh>
      ))}

      {/* OUTER PETALS */}
      {Array.from({ length: 9 }).map((_, i) => (
        <Petal
          key={`outer-${i}`}
          geometry={petals.outer}
          angle={(i / 9) * Math.PI * 2}
          scale={1}
          color={i % 2 ? color : '#A91E39'}
        />
      ))}

      {/* MIDDLE PETALS */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Petal
          key={`middle-${i}`}
          geometry={petals.middle}
          angle={(i / 8) * Math.PI * 2 + 0.35}
          scale={0.76}
          color={i % 2 ? '#C8324D' : color}
        />
      ))}

      {/* INNER SPIRAL */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Petal
          key={`inner-${i}`}
          geometry={petals.inner}
          angle={(i / 6) * Math.PI * 2 + 0.55}
          scale={0.53}
          color="#9D1935"
        />
      ))}

      {/* CENTER BUD */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Petal
          key={`core-${i}`}
          geometry={petals.core}
          angle={(i / 4) * Math.PI * 2 + 0.7}
          scale={0.34}
          color="#7D142B"
        />
      ))}

    </group>
  )
}

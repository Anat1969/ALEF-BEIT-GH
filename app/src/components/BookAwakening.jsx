import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useLetters } from '../hooks/useLetters'

/* ─── האותיות שעולות מהספר ─── */
const LETTERS_TO_SHOW = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת']

/* ─── חומר זהב מתכתי ─── */
function goldMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#A27B12'),
    metalness: 0.9,
    roughness: 0.15,
    emissive: new THREE.Color('#3D2800'),
    emissiveIntensity: 0.3,
  })
}

/* ─── בונה mesh של אות מ-canvas texture ─── */
function makeLetterMesh(char, size = 1.2) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  // טקסטורת הזהב: גרדיאנט ממנו נגזר החומר
  const grad = ctx.createLinearGradient(0, 0, 0, 128)
  grad.addColorStop(0, '#F0D060')
  grad.addColorStop(0.4, '#C89A18')
  grad.addColorStop(0.7, '#7C5E0E')
  grad.addColorStop(1, '#F0D060')
  ctx.fillStyle = grad
  ctx.font = 'bold 90px "IBM Plex Sans Hebrew", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(char, 64, 68)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  // הצורה: מלבן שטוח עם texture האות
  const geo = new THREE.BoxGeometry(size, size, size * 0.18)
  const mat = [
    goldMaterial(), goldMaterial(),
    goldMaterial(), goldMaterial(),
    new THREE.MeshStandardMaterial({ map: texture, metalness: 0.6, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ map: texture, metalness: 0.6, roughness: 0.2, side: THREE.BackSide }),
  ]
  return new THREE.Mesh(geo, mat)
}

export default function BookAwakening({ onSelectLetter }) {
  const { letters } = useLetters()
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const [active, setActive] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(-1)

  /* ─── Three.js scene ─── */
  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth
    const H = el.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    el.appendChild(renderer.domElement)

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 1, 14)

    // Scene
    const scene = new THREE.Scene()

    // תאורה
    const ambient = new THREE.AmbientLight(0xfff4e0, 0.6)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfff8e7, 2.5)
    keyLight.position.set(4, 8, 6)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xd4a017, 1.2, 20)
    fillLight.position.set(-5, 2, 4)
    scene.add(fillLight)

    const rimLight = new THREE.SpotLight(0xffffff, 1.8, 30, Math.PI / 6, 0.3)
    rimLight.position.set(0, 10, -4)
    scene.add(rimLight)

    // ─── ספר ───
    const bookGroup = new THREE.Group()
    scene.add(bookGroup)

    // גב הספר
    const spineGeo = new THREE.BoxGeometry(0.3, 4, 2.4)
    const spineMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E2DACB'),
      roughness: 0.6, metalness: 0.05
    })
    const spine = new THREE.Mesh(spineGeo, spineMat)
    spine.castShadow = true
    bookGroup.add(spine)

    // דף שמאל
    const pageL = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 4, 0.08),
      new THREE.MeshStandardMaterial({ color: '#FFFDF8', roughness: 0.9 })
    )
    pageL.position.set(-1.35, 0, 0)
    pageL.rotation.y = 0.08
    bookGroup.add(pageL)

    // קווי שורות — דף שמאל
    for (let i = 0; i < 7; i++) {
      const lineGeo = new THREE.BoxGeometry(1.8, 0.03, 0.09)
      const lineMat = new THREE.MeshStandardMaterial({ color: '#C8BEA8', roughness: 1 })
      const line = new THREE.Mesh(lineGeo, lineMat)
      line.position.set(-1.35, 1.4 - i * 0.47, 0.05)
      bookGroup.add(line)
    }

    // דף ימין
    const pageR = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 4, 0.08),
      new THREE.MeshStandardMaterial({ color: '#FFFDF8', roughness: 0.9 })
    )
    pageR.position.set(1.35, 0, 0)
    pageR.rotation.y = -0.08
    bookGroup.add(pageR)

    // קווי שורות — דף ימין
    for (let i = 0; i < 7; i++) {
      const lineGeo = new THREE.BoxGeometry(1.8, 0.03, 0.09)
      const lineMat = new THREE.MeshStandardMaterial({ color: '#C8BEA8', roughness: 1 })
      const line = new THREE.Mesh(lineGeo, lineMat)
      line.position.set(1.35, 1.4 - i * 0.47, 0.05)
      bookGroup.add(line)
    }

    bookGroup.position.set(2.5, -0.5, 0)
    bookGroup.rotation.x = 0.15
    bookGroup.rotation.y = -0.25

    // ─── אותיות ───
    const letterMeshes = []
    const cols = 5
    const startX = 3.5
    const startY = 2.0

    LETTERS_TO_SHOW.forEach((char, i) => {
      const mesh = makeLetterMesh(char, 0.95)
      const col = i % cols
      const row = Math.floor(i / cols)

      // מיקום סופי מעל הספר
      mesh.userData.targetX = startX - col * 1.35
      mesh.userData.targetY = startY - row * 1.5
      mesh.userData.targetZ = 2 + (i % 3) * 0.4
      mesh.userData.delay = i * 0.08
      mesh.userData.char = char
      mesh.userData.index = i
      mesh.userData.t = 0 // 0 = לפני, 1 = במקום

      // מיקום התחלתי — בתוך הספר
      mesh.position.set(mesh.userData.targetX, mesh.userData.targetY - 6, 0)
      mesh.rotation.x = Math.PI / 2
      mesh.scale.setScalar(0.01)

      scene.add(mesh)
      letterMeshes.push(mesh)
    })

    sceneRef.current = { letterMeshes, scene, camera, renderer, bookGroup }

    // ─── Raycaster לריחוף ───
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(letterMeshes)
      setHoveredIdx(hits.length > 0 ? hits[0].object.userData.index : -1)
    }

    const onClick = (e) => {
      const rect = el.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(letterMeshes)
      if (hits.length > 0) {
        const char = hits[0].object.userData.char
        const letter = letters.find((l) => l.character === char)
        if (letter) onSelectLetter(letter.id)
      }
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('click', onClick)

    // ─── Loop אנימציה ───
    let startTime = null
    let animActive = false
    let raf

    const easeOutBack = (t) => {
      const c1 = 1.70158, c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }

    const animate = (now) => {
      raf = requestAnimationFrame(animate)

      if (animActive && startTime) {
        const elapsed = (now - startTime) / 1000

        letterMeshes.forEach((mesh) => {
          const t = Math.min(1, Math.max(0, (elapsed - mesh.userData.delay) / 0.9))
          mesh.userData.t = t

          if (t > 0) {
            const e = easeOutBack(t)
            mesh.position.y = THREE.MathUtils.lerp(mesh.userData.targetY - 6, mesh.userData.targetY, e)
            mesh.position.x = mesh.userData.targetX
            mesh.position.z = mesh.userData.targetZ
            mesh.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0, t)
            mesh.scale.setScalar(THREE.MathUtils.lerp(0.01, 1, Math.min(1, t * 1.4)))
          }
        })
      }

      // ריחוף — aura זהובה
      letterMeshes.forEach((mesh) => {
        const isHovered = mesh.userData.index === hoveredIdx
        const targetEmissive = isHovered ? 0.8 : 0.3
        if (mesh.material && Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if (m.emissiveIntensity !== undefined) {
              m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, targetEmissive, 0.12)
            }
          })
        }
        if (isHovered) {
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0.25, 0.1)
        } else {
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0, 0.08)
        }
      })

      // נשימה עדינה של הספר
      bookGroup.rotation.y = -0.25 + Math.sin(now * 0.0004) * 0.06
      bookGroup.position.y = -0.5 + Math.sin(now * 0.0007) * 0.08

      renderer.render(scene, camera)
    }

    animate(0)

    // ─── IntersectionObserver ───
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animActive) {
        animActive = true
        startTime = performance.now()
        setActive(true)
      }
    }, { threshold: 0.25 })
    obs.observe(el)

    // Resize
    const onResize = () => {
      const W2 = el.clientWidth, H2 = el.clientHeight
      camera.aspect = W2 / H2
      camera.updateProjectionMatrix()
      renderer.setSize(W2, H2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [letters, onSelectLetter])

  // עדכון hoveredIdx לloop
  useEffect(() => {
    if (!sceneRef.current) return
    // הloop קורא את hoveredIdx דרך closure — הוא מתעדכן דרך state
  }, [hoveredIdx])

  return (
    <section className="book-awakening" aria-label="ספר שמתעורר — 22 האותיות">
      <div
        ref={mountRef}
        className="book-three-canvas"
        style={{ cursor: hoveredIdx >= 0 ? 'pointer' : 'default' }}
      />
      <div className="book-caption">
        <p className="eyebrow">22 אותיות · ספר יצירה</p>
        <h2 className="book-title">הספר שמתעורר</h2>
        <p className="book-lead">
          כל אות עולה מהדף כחדר בפני עצמו.
          <br />
          לחיצה על אות פותחת את כרטיס הכוח שלה.
        </p>
      </div>
    </section>
  )
}

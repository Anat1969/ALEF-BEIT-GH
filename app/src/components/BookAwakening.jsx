import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import POWER from '../data/letterPower'

const LETTERS = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת']
const CYCLE_MS = 5000
const DNA = {
  paper:    '#F4F0E8',
  ink:      '#1C1A17',
  gold:     '#7C5E0E',
  goldDawn: '#A27B12',
  lime:     '#E2DACB',
  goldBright:'#F0D060',
}

/* ─── canvas texture לאות עברית ─── */
function makeLetterTexture(char, size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, size, size)
  const gr = ctx.createLinearGradient(0, 0, 0, size)
  gr.addColorStop(0,   '#F4D840')
  gr.addColorStop(0.35,'#C89A18')
  gr.addColorStop(0.7, '#7C5E0E')
  gr.addColorStop(1,   '#3A2800')
  ctx.fillStyle = gr
  ctx.font = `bold ${size * 0.75}px 'IBM Plex Sans Hebrew', serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(char, size / 2, size / 2 + size * 0.04)
  return new THREE.CanvasTexture(c)
}

/* ─── mesh אות: BoxGeometry + CanvasTexture ─── */
function buildLetterMesh(char) {
  const tex = makeLetterTexture(char, 256)
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    metalness: 0.88,
    roughness: 0.12,
    emissive: new THREE.Color(DNA.goldDawn),
    emissiveIntensity: 0.0,
    transparent: true,
    opacity: 0,
  })
  const geo = new THREE.BoxGeometry(2.0, 2.0, 0.22)
  return new THREE.Mesh(geo, mat)
}

/* ─── particle system ─── */
function buildParticles(count = 320) {
  const positions = new Float32Array(count * 3)
  const alphas    = new Float32Array(count)
  const speeds    = new Float32Array(count)
  const offsets   = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 3.2
    positions[i * 3 + 1] = Math.random() * 0.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.4
    alphas[i]  = 0
    speeds[i]  = 0.5 + Math.random() * 1.5
    offsets[i] = Math.random() * Math.PI * 2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.08,
    color: new THREE.Color(DNA.goldBright),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const pts = new THREE.Points(geo, mat)
  return { pts, speeds, offsets, initialPositions: positions.slice() }
}

/* ─── book geometry ─── */
function buildBook() {
  const group = new THREE.Group()

  // עמוד שמאל
  const pageL = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 4.4, 0.06),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFDF8'),
      roughness: 0.85,
      metalness: 0.0,
      emissive: new THREE.Color('#D4C8AA'),
      emissiveIntensity: 0.04,
    })
  )
  pageL.position.set(-1.65, 0, 0.03)
  pageL.rotation.y = 0.08

  // עמוד ימין
  const pageR = pageL.clone()
  pageR.position.set(1.65, 0, 0.03)
  pageR.rotation.y = -0.08

  // כריכה (עמוד האמצע)
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 4.4, 0.18),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2A1800'),
      roughness: 0.6,
      metalness: 0.3,
    })
  )
  spine.position.set(0, 0, -0.02)

  // קווים על הדף (מדמים שורות)
  for (let i = 0; i < 8; i++) {
    const lineGeo = new THREE.BoxGeometry(2.4, 0.015, 0.001)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xC8B890, transparent: true, opacity: 0.5 })
    const lineL = new THREE.Mesh(lineGeo, lineMat)
    lineL.position.set(-1.65, 1.6 - i * 0.42, 0.065)
    group.add(lineL)
    const lineR = lineL.clone()
    lineR.position.set(1.65, 1.6 - i * 0.42, 0.065)
    group.add(lineR)
  }

  group.add(spine, pageL, pageR)

  // הטיית הספר קדימה (נשכב על שולחן)
  group.rotation.x = -0.32
  group.position.y = -0.4

  return group
}

/* ═══════════════════════════════════
   קומפוננטה ראשית
══════════════════════════════════= */
export default function BookAwakening({ onSelectLetter }) {
  const mountRef  = useRef(null)
  const stateRef  = useRef(null)
  const rafRef    = useRef(null)
  const timerRef  = useRef(null)
  const [current, setCurrent] = useState(0)        // מדד האות הנוכחית
  const [phase,   setPhase]   = useState('idle')   // idle | rising | showing | falling

  /* ─── advance letter ─── */
  const advanceLetter = useCallback(() => {
    setCurrent(c => (c + 1) % LETTERS.length)
    setPhase('rising')
  }, [])

  /* ─── Three.js init ─── */
  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.toneMapping    = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    /* scene */
    const scene = new THREE.Scene()
    scene.fog   = new THREE.FogExp2(0x0A0804, 0.08)

    /* camera */
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 2.0, 11)
    camera.lookAt(0, 0, 0)

    /* lights */
    const ambient = new THREE.AmbientLight(0xF4E8C0, 0.6)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight(0xFFF5E0, 1.4)
    keyLight.position.set(3, 6, 5)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xC0A060, 0.5)
    fillLight.position.set(-4, 2, 3)
    scene.add(fillLight)
    const glowLight = new THREE.PointLight(0xFFCC44, 0, 6)
    glowLight.position.set(0, 0.5, 2)
    scene.add(glowLight)
    const bookLight = new THREE.PointLight(0xFFF0CC, 0.8, 10)
    bookLight.position.set(0, 4, 4)
    scene.add(bookLight)

    /* book */
    const book = buildBook()
    scene.add(book)

    /* particles */
    const { pts, speeds, offsets, initialPositions } = buildParticles(360)
    pts.position.set(0, 0.5, 1.5)
    scene.add(pts)

    /* letter mesh (single, reused) */
    const letterMesh = buildLetterMesh('א')
    letterMesh.position.set(0, -4, 1.6)   // מתחיל מתחת לנראות
    scene.add(letterMesh)

    /* raycaster */
    const raycaster = new THREE.Raycaster()
    const pointer   = new THREE.Vector2()

    /* store everything */
    stateRef.current = {
      renderer, scene, camera,
      glowLight, letterMesh, pts,
      speeds, offsets, initialPositions,
      clock: new THREE.Clock(),
      animT: 0,       // 0→1 animation progress
      phase: 'idle',
      currentIdx: 0,
      letterMat: letterMesh.material,
    }

    /* resize */
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* mouse → hover glow */
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(letterMesh)
      const s = stateRef.current
      if (s) s.hovered = hits.length > 0
    }
    el.addEventListener('mousemove', onMove)

    /* click → select */
    const onClick = (e) => {
      const rect = el.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(letterMesh)
      if (hits.length > 0 && onSelectLetter) {
        const id = stateRef.current?.currentIdx
        const letter = LETTERS[id]
        // id גימטרי
        const gematriaMap = {א:1,ב:2,ג:3,ד:4,ה:5,ו:6,ז:7,ח:8,ט:9,י:10,כ:20,ל:30,מ:40,נ:50,ס:60,ע:70,פ:80,צ:90,ק:100,ר:200,ש:300,ת:400}
        onSelectLetter(gematriaMap[letter] ?? 1)
      }
    }
    el.addEventListener('click', onClick)

    /* animation loop */
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const s = stateRef.current
      if (!s) return
      const dt = s.clock.getDelta()
      const t  = s.clock.getElapsedTime()

      const { letterMesh: lm, letterMat: lmat, pts: p, glowLight: gl } = s

      /* ---- phase machine ---- */
      if (s.phase === 'rising') {
        s.animT = Math.min(s.animT + dt * 0.5, 1)   // ~2s to reach 1
        const eob = easeOutBack(s.animT)
        // מהמרכז הספר כלפי מעלה
        lm.position.y = THREE.MathUtils.lerp(-2.0, 1.4, eob)
        lm.position.z = THREE.MathUtils.lerp(1.0, 2.2, eob)
        lm.rotation.y = THREE.MathUtils.lerp(0.6, 0, eob)   // סיבוב קל בכניסה
        lmat.opacity  = THREE.MathUtils.lerp(0, 1, s.animT * 2)
        lmat.emissiveIntensity = THREE.MathUtils.lerp(0, 0.6, eob)
        gl.intensity  = THREE.MathUtils.lerp(0, 2.5, eob)
        p.material.opacity = Math.min(s.animT * 2.5, 0.9)
        if (s.animT >= 1) {
          s.phase = 'showing'
          s.showT = 0
          setPhase('showing')
        }
      }
      else if (s.phase === 'showing') {
        s.showT = (s.showT ?? 0) + dt
        // נשאר ב-"showing" עד advanceLetter מהטיימר
        // אנימציית hover
        if (s.hovered) {
          lmat.emissiveIntensity = THREE.MathUtils.lerp(lmat.emissiveIntensity, 1.2, 0.08)
        } else {
          lmat.emissiveIntensity = THREE.MathUtils.lerp(lmat.emissiveIntensity, 0.55, 0.05)
        }
        // ריחוף עדין
        lm.position.y = 1.4 + Math.sin(t * 1.1) * 0.08
        lm.rotation.y = Math.sin(t * 0.7) * 0.06
        gl.intensity  = 2.2 + Math.sin(t * 2.3) * 0.4
      }
      else if (s.phase === 'falling') {
        s.animT = Math.min(s.animT + dt * 0.9, 1)
        lm.position.y = THREE.MathUtils.lerp(1.4, -3.0, easeInBack(s.animT))
        lm.position.z = THREE.MathUtils.lerp(2.2, 1.0, s.animT)
        lmat.opacity  = 1 - s.animT * 1.6
        lmat.emissiveIntensity = THREE.MathUtils.lerp(0.55, 0, s.animT)
        gl.intensity  = THREE.MathUtils.lerp(2.2, 0, s.animT)
        p.material.opacity = THREE.MathUtils.lerp(0.9, 0, s.animT * 1.5)
        if (s.animT >= 1) {
          // החלפה לאות הבאה
          const nextIdx = s.pendingIdx
          s.currentIdx = nextIdx
          setCurrent(nextIdx)
          rebuildLetter(s, LETTERS[nextIdx])
          s.phase  = 'rising'
          s.animT  = 0
          setPhase('rising')
        }
      }

      /* ---- particles ---- */
      const positions = p.geometry.attributes.position
      for (let i = 0; i < 360; i++) {
        const y0 = s.initialPositions[i * 3 + 1]
        positions.array[i * 3 + 1] = y0 + ((t * s.speeds[i] + s.offsets[i]) % 3.5) * 0.6
        // גאות מחדש כשיוצא מטווח
        if (positions.array[i * 3 + 1] > y0 + 2.2) {
          positions.array[i * 3 + 1] = y0
        }
      }
      positions.needsUpdate = true

      /* ---- camera sway ---- */
      camera.position.x = Math.sin(t * 0.15) * 0.18
      camera.position.y = 2.0 + Math.sin(t * 0.22) * 0.08
      camera.lookAt(0, 0.3, 0)

      renderer.render(scene, camera)
    }
    animate()

    /* ─── start first letter ─── */
    const startFirst = () => {
      const s = stateRef.current
      if (!s) return
      s.phase  = 'rising'
      s.animT  = 0
      s.currentIdx = 0
      rebuildLetter(s, LETTERS[0])
      setCurrent(0)
      setPhase('rising')
    }
    setTimeout(startFirst, 400)

    return () => {
      clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('click', onClick)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [onSelectLetter])

  /* ─── cycle timer — triggered when phase changes to showing ─── */
  useEffect(() => {
    if (phase !== 'showing') return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const s = stateRef.current
      if (!s || s.phase !== 'showing') return
      const nextIdx = (s.currentIdx + 1) % LETTERS.length
      s.pendingIdx = nextIdx
      s.phase  = 'falling'
      s.animT  = 0
      setPhase('falling')
    }, CYCLE_MS)
    return () => clearTimeout(timerRef.current)
  }, [phase, current])

  /* ─── קבלת נתוני הכוח ─── */
  const letter = LETTERS[current]
  const power  = POWER[letter]

  return (
    <div className="book-awakening" dir="rtl">
      {/* Three.js canvas */}
      <div ref={mountRef} className="book-three-canvas" />

      {/* overlay טקסט כוח */}
      <div className={`book-power-overlay ${phase === 'showing' ? 'visible' : ''}`}>
        <div className="book-letter-char">{letter}</div>
        {power && (
          <>
            <div className="book-power-name">{power.power}</div>
            <div className="book-power-line">{power.powerLine}</div>
            <div className="book-directions">
              <div className="book-dir book-dir--plus">
                <span className="book-dir-label">לחיוב</span>
                <strong>{power.plus?.word}</strong>
                <span className="book-dir-more">{power.plus?.more}</span>
              </div>
              <div className="book-dir book-dir--minus">
                <span className="book-dir-label">לשלילה</span>
                <strong>{power.minus?.word}</strong>
                <span className="book-dir-more">{power.minus?.more}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* navigation dots */}
      <div className="book-nav-dots">
        {LETTERS.map((l, i) => (
          <button
            key={l}
            className={`book-dot ${i === current ? 'active' : ''}`}
            onClick={() => jumpToLetter(i)}
            aria-label={l}
          />
        ))}
      </div>
    </div>
  )

  function jumpToLetter(idx) {
    const s = stateRef.current
    if (!s || s.phase === 'falling') return
    clearTimeout(timerRef.current)
    if (s.phase === 'showing' || s.phase === 'rising') {
      s.pendingIdx = idx
      s.phase  = 'falling'
      s.animT  = 0
      setPhase('falling')
    }
  }
}

/* ─── rebuild letter texture on mesh ─── */
function rebuildLetter(s, char) {
  const tex = makeLetterTexture(char, 256)
  s.letterMat.map?.dispose()
  s.letterMat.map = tex
  s.letterMat.needsUpdate = true
  s.letterMesh.position.set(0, -2.0, 1.0)
  s.letterMesh.rotation.set(0, 0.6, 0)
  s.letterMat.opacity = 0
  s.letterMat.emissiveIntensity = 0
  s.glowLight.intensity = 0
  // reset particles
  const positions = s.pts.geometry.attributes.position
  for (let i = 0; i < 360; i++) {
    positions.array[i * 3]     = s.initialPositions[i * 3]
    positions.array[i * 3 + 1] = s.initialPositions[i * 3 + 1]
    positions.array[i * 3 + 2] = s.initialPositions[i * 3 + 2]
  }
  positions.needsUpdate = true
  s.pts.material.opacity = 0
}

/* ─── easing ─── */
function easeOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
function easeInBack(t) {
  const c1 = 1.70158, c3 = c1 + 1
  return c3 * t * t * t - c1 * t * t
}

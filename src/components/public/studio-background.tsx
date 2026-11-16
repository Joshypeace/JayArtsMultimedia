"use client"

import { useEffect, useRef } from "react"

/**
 * Gold wireframe photography studio, drawn on a canvas behind the home page.
 * The studio layout morphs between four setups as the visitor scrolls, while the
 * view slowly orbits. Pure canvas 2D (no 3D library) so it stays light.
 */

type V3 = [number, number, number]
type Seg = [V3, V3]

// ---------- geometry helpers (local space: +z forward, y up) ----------
const rotY = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)]
const rotX = ([x, y, z]: V3, a: number): V3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const place = (segs: Seg[], pos: V3, yaw: number, tilt = 0): Seg[] =>
  segs.map(([a, b]) => [add(rotY(rotX(a, tilt), yaw), pos), add(rotY(rotX(b, tilt), yaw), pos)])

function circle(r: number, n: number, y = 0, z = 0, plane: "xy" | "xz" = "xy"): Seg[] {
  const out: Seg[] = []
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2
    const p = (a: number): V3 => (plane === "xy" ? [Math.cos(a) * r, y + Math.sin(a) * r, z] : [Math.cos(a) * r, y, z + Math.sin(a) * r])
    out.push([p(a0), p(a1)])
  }
  return out
}

function tripod(h: number, spread = 0.45): Seg[] {
  const hub: V3 = [0, h * 0.3, 0]
  const out: Seg[] = [[[0, 0.02, 0], [0, h, 0]]]
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6
    out.push([hub, [Math.cos(a) * spread, 0, Math.sin(a) * spread]])
  }
  return out
}

function box(w: number, h: number, d: number, cy = 0, cz = 0): Seg[] {
  const x = w / 2, y = h / 2, z = d / 2
  const c: V3[] = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]].map(
    ([a, b, e]) => [a, b + cy, e + cz] as V3
  )
  const e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
  return e.map(([i, j]) => [c[i], c[j]])
}

// ---------- studio objects ----------
type ObjType = "cyc" | "softbox" | "strip" | "umbrella" | "camera" | "ring" | "boom" | "stool" | "reflector" | "grid"
interface Obj { key: string; type: ObjType; x: number; z: number; yaw: number; h?: number }

function build(o: Obj): Seg[] {
  const pos: V3 = [o.x, 0, o.z]
  const h = o.h ?? 2
  switch (o.type) {
    case "grid": {
      const s: Seg[] = []
      for (let i = -6; i <= 6; i++) {
        s.push([[i, 0, -4], [i, 0, 5]])
        if (i >= -4) s.push([[-6, 0, i], [6, 0, i]])
      }
      return s
    }
    case "cyc": {
      // infinity cove: floor sweep curving up into a back wall
      const s: Seg[] = []
      const prof: [number, number][] = []
      const R = 1.1
      for (let i = 0; i <= 8; i++) {
        const a = (i / 8) * (Math.PI / 2)
        prof.push([R - Math.cos(a) * R, -Math.sin(a) * R]) // [y, zOffset]
      }
      prof.push([3.3, -R])
      const W = 3.3, z0 = -2.6
      for (let k = 0; k < prof.length - 1; k++) {
        const [y0, dz0] = prof[k], [y1, dz1] = prof[k + 1]
        for (const x of [-W, -W / 2, 0, W / 2, W]) s.push([[x, y0, z0 + dz0], [x, y1, z0 + dz1]])
      }
      for (const [y, dz] of prof) s.push([[-W, y, z0 + dz], [W, y, z0 + dz]])
      s.push([[-W, 0, z0], [-W, 0, z0 + 2.2]], [[W, 0, z0], [W, 0, z0 + 2.2]])
      return place(s, [o.x, 0, o.z], o.yaw)
    }
    case "softbox": {
      // stand + rectangular softbox aimed forward (+z), apex behind
      const top = h
      const sb: Seg[] = []
      const w = 0.55, hh = 0.42, apex: V3 = [0, top, -0.55]
      const f: V3[] = [[-w, top - hh, 0.05], [w, top - hh, 0.05], [w, top + hh, 0.05], [-w, top + hh, 0.05]]
      for (let i = 0; i < 4; i++) sb.push([f[i], f[(i + 1) % 4]], [f[i], apex])
      sb.push([f[0], f[2]].map((p) => [p[0] * 0.6, p[1], p[2]] as V3) as Seg)
      return place([...tripod(top - 0.1), ...sb], pos, o.yaw, -0.18)
    }
    case "strip": {
      const top = h, s: Seg[] = []
      const w = 0.18, hh = 0.85, apex: V3 = [0, top, -0.4]
      const f: V3[] = [[-w, top - hh, 0.05], [w, top - hh, 0.05], [w, top + hh, 0.05], [-w, top + hh, 0.05]]
      for (let i = 0; i < 4; i++) s.push([f[i], f[(i + 1) % 4]], [f[i], apex])
      return place([...tripod(top - 0.9), ...s], pos, o.yaw)
    }
    case "umbrella": {
      const top = h, s: Seg[] = [], r = 0.75, n = 10
      const tip: V3 = [0, top, 0.35], rim: V3[] = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        rim.push([Math.cos(a) * r, top + Math.sin(a) * r, -0.15])
      }
      for (let i = 0; i < n; i++) s.push([tip, rim[i]], [rim[i], rim[(i + 1) % n]])
      s.push([[0, top, -0.15], [0, top, 0.7]]) // shaft
      return place([...tripod(top - 0.05), ...s], pos, o.yaw, -0.2)
    }
    case "camera": {
      const top = h
      const body = box(0.32, 0.22, 0.16, top + 0.13, 0)
      const lens = [...circle(0.08, 10, top + 0.13, 0.08), ...circle(0.08, 10, top + 0.13, 0.32)]
      const lensLines: Seg[] = [0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return [[Math.cos(a) * 0.08, top + 0.13 + Math.sin(a) * 0.08, 0.08], [Math.cos(a) * 0.08, top + 0.13 + Math.sin(a) * 0.08, 0.32]]
      })
      const finder = box(0.1, 0.07, 0.1, top + 0.28, -0.02)
      return place([...tripod(top), ...body, ...lens, ...lensLines, ...finder], pos, o.yaw)
    }
    case "ring": {
      const top = h
      const s = [...circle(0.45, 28, top, 0), ...circle(0.36, 28, top, 0)]
      s.push([[0, top - 0.45, 0], [0, top - 0.2, 0]], [[0, top - 0.2, 0], [0, top, 0.05]])
      const phone = box(0.09, 0.17, 0.02, top, 0.04)
      return place([...tripod(top - 0.45), ...s, ...phone], pos, o.yaw)
    }
    case "boom": {
      const top = h, s: Seg[] = []
      const end: V3 = [0, top + 0.5, 1.7]
      s.push([[0, top, 0], end], [[0, top, 0], [0, top - 0.25, -0.7]]) // arm + counterweight
      s.push(...box(0.3, 0.12, 0.3, top - 0.25, -0.7)) // counterweight
      s.push(...circle(0.22, 14, 0, 0, "xz").map(([a, b]) => [add(a, add(end, [0, -0.15, 0])), add(b, add(end, [0, -0.15, 0]))] as Seg))
      s.push([end, add(end, [0, -0.15, 0])])
      return place([...tripod(top), ...s], pos, o.yaw)
    }
    case "stool": {
      const s = [...circle(0.22, 16, 0.62, 0, "xz")]
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4
        s.push([[Math.cos(a) * 0.15, 0.62, Math.sin(a) * 0.15], [Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25]])
      }
      s.push(...circle(0.2, 12, 0.25, 0, "xz"))
      return place(s, pos, o.yaw)
    }
    case "reflector": {
      const top = h
      const s = [...circle(0.5, 20, top, 0)]
      s.push([[-0.5, top, 0], [0.5, top, 0]], [[0, top - 0.5, 0], [0, top + 0.5, 0]])
      return place([...tripod(top - 0.5, 0.35), ...s], pos, o.yaw, 0.25)
    }
  }
}

// ---------- the four studio setups ----------
const D = Math.PI / 180
const SCENES: { name: string; objs: Obj[] }[] = [
  {
    name: "Portrait studio",
    objs: [
      { key: "grid", type: "grid", x: 0, z: 0, yaw: 0 },
      { key: "cyc", type: "cyc", x: 0, z: 0, yaw: 0 },
      { key: "stool", type: "stool", x: 0, z: -1.2, yaw: 0 },
      { key: "key", type: "softbox", x: -1.9, z: 0.4, yaw: 140 * D, h: 2.1 },
      { key: "fill", type: "softbox", x: 1.9, z: 0.6, yaw: -135 * D, h: 1.8 },
    ],
  },
  {
    name: "Three-point lighting",
    objs: [
      { key: "grid", type: "grid", x: 0, z: 0, yaw: 0 },
      { key: "cyc", type: "cyc", x: 0, z: 0, yaw: 0 },
      { key: "stool", type: "stool", x: 0.3, z: -1.0, yaw: 0 },
      { key: "key", type: "softbox", x: -1.6, z: 0.9, yaw: 150 * D, h: 2.2 },
      { key: "rim", type: "strip", x: 1.8, z: -1.9, yaw: -60 * D, h: 2.1 },
      { key: "boom", type: "boom", x: -1.2, z: -2.2, yaw: 40 * D, h: 2.2 },
      { key: "cam", type: "camera", x: 0.2, z: 2.6, yaw: Math.PI, h: 1.35 },
    ],
  },
  {
    name: "Fashion set",
    objs: [
      { key: "grid", type: "grid", x: 0, z: 0, yaw: 0 },
      { key: "cyc", type: "cyc", x: 0, z: 0, yaw: 0 },
      { key: "stool", type: "stool", x: -0.4, z: -1.4, yaw: 0 },
      { key: "umbL", type: "umbrella", x: -2.1, z: 0.2, yaw: 125 * D, h: 2.3 },
      { key: "umbR", type: "umbrella", x: 2.1, z: 0.3, yaw: -125 * D, h: 2.3 },
      { key: "refl", type: "reflector", x: 0.9, z: 0.4, yaw: -160 * D, h: 0.9 },
      { key: "cam", type: "camera", x: -0.3, z: 2.9, yaw: Math.PI, h: 1.55 },
    ],
  },
  {
    name: "Video & livestream set",
    objs: [
      { key: "grid", type: "grid", x: 0, z: 0, yaw: 0 },
      { key: "cyc", type: "cyc", x: 0, z: 0, yaw: 0 },
      { key: "stool", type: "stool", x: 0, z: -1.1, yaw: 0 },
      { key: "ring", type: "ring", x: 0, z: 1.1, yaw: Math.PI, h: 1.6 },
      { key: "key", type: "softbox", x: -2.0, z: 0.2, yaw: 135 * D, h: 2.0 },
      { key: "fill", type: "softbox", x: 2.0, z: 0.2, yaw: -135 * D, h: 2.0 },
      { key: "boom", type: "boom", x: 1.3, z: -2.3, yaw: -35 * D, h: 2.3 },
      { key: "cam", type: "camera", x: -1.0, z: 3.0, yaw: Math.PI - 0.3, h: 1.4 },
      { key: "cam2", type: "camera", x: 1.3, z: 2.7, yaw: Math.PI + 0.35, h: 1.3 },
    ],
  },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => t * t * (3 - 2 * t)
const lerpAngle = (a: number, b: number, t: number) => {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

/** Objects for a fractional scene index, with per-object alpha and draw-in progress. */
function blend(s: number) {
  const i = Math.min(Math.floor(s), SCENES.length - 2)
  const t = ease(Math.min(1, Math.max(0, s - i)))
  const A = SCENES[i].objs, B = SCENES[i + 1].objs
  const out: { segs: Seg[]; alpha: number; draw: number; dim: boolean }[] = []
  for (const a of A) {
    const b = B.find((o) => o.key === a.key && o.type === a.type)
    if (b) {
      const o: Obj = { ...a, x: lerp(a.x, b.x, t), z: lerp(a.z, b.z, t), yaw: lerpAngle(a.yaw, b.yaw, t), h: lerp(a.h ?? 2, b.h ?? 2, t) }
      out.push({ segs: build(o), alpha: 1, draw: 1, dim: a.type === "grid" })
    } else out.push({ segs: build(a), alpha: 1 - t, draw: 1, dim: false })
  }
  for (const b of B) if (!A.find((o) => o.key === b.key && o.type === b.type)) out.push({ segs: build(b), alpha: Math.min(1, t * 1.4), draw: t, dim: false })
  return out
}

export default function StudioBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0, h = 0, dpr = 1, raf = 0, running = true
    let scrollTarget = 0, scroll = 0
    const t0 = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
    }
    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollTarget = Math.min(1, Math.max(0, window.scrollY / max))
    }

    const frame = (now: number) => {
      if (!running) return
      scroll += (scrollTarget - scroll) * (reduce ? 1 : 0.08)
      const time = reduce ? 0 : (now - t0) / 1000
      const s = scroll * (SCENES.length - 1)

      // orbiting view: slow drift + scroll-driven swing
      const yaw = -0.6 + scroll * 1.7 + Math.sin(time * 0.12) * 0.2
      const pitch = 0.42 - scroll * 0.1
      const camDist = 13
      // fit the whole set on screen: scale by the smaller side (portrait phones too)
      const focal = Math.min(w * 1.25, h) * (w < 640 ? 1.15 : 1.4)
      const cx = w * 0.5, cy = h * 0.56

      const project = (p: V3): [number, number, number] | null => {
        let q = rotY([p[0], p[1] - 1.1, p[2]], yaw)
        q = rotX(q, pitch)
        const z = q[2] + camDist
        if (z < 0.5) return null
        return [cx + (q[0] / z) * focal, cy - (q[1] / z) * focal, z]
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"
      ctx.globalCompositeOperation = "lighter"

      for (const o of blend(s)) {
        if (o.alpha <= 0.01) continue
        const n = o.segs.length
        const visible = Math.ceil(n * o.draw)
        ctx.lineWidth = o.dim ? 0.7 : 1.3
        for (let k = 0; k < visible; k++) {
          const [a, b] = o.segs[k]
          const pa = project(a), pb = project(b)
          if (!pa || !pb) continue
          // fade with depth so the far side recedes
          const depth = Math.min(1, Math.max(0.25, 1.6 - ((pa[2] + pb[2]) / 2) / camDist))
          ctx.strokeStyle = `rgba(212,175,55,${(o.dim ? 0.14 : 0.6) * o.alpha * depth})`
          ctx.beginPath()
          ctx.moveTo(pa[0], pa[1])
          ctx.lineTo(pb[0], pb[1])
          ctx.stroke()
        }
      }

      // a soft key-light glow on the subject position
      const glow = project([0, 1.0, -1.1])
      if (glow) {
        const g = ctx.createRadialGradient(glow[0], glow[1], 0, glow[0], glow[1], focal * 0.35)
        g.addColorStop(0, "rgba(212,175,55,0.10)")
        g.addColorStop(1, "rgba(212,175,55,0)")
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      if (!reduce) raf = requestAnimationFrame(frame)
    }

    const onVis = () => {
      running = !document.hidden
      cancelAnimationFrame(raf)
      if (running) raf = requestAnimationFrame(frame)
    }
    const onScroll = () => {
      readScroll()
      if (reduce) raf = requestAnimationFrame(frame)
    }

    resize()
    readScroll()
    scroll = scrollTarget
    raf = requestAnimationFrame(frame)
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVis)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]"
    />
  )
}

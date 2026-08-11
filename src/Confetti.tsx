import { useEffect, useRef } from "react"

type Particle = {
  color: string
  rotation: number
  rotationSpeed: number
  size: number
  vx: number
  vy: number
  x: number
  y: number
}

const COLORS = ["#16724f", "#2563eb", "#d97706", "#dc2626", "#7c3aed", "#0891b2"]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createParticle(canvasWidth: number): Particle {
  return {
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.08, 0.08),
    size: randomBetween(6, 12),
    vx: randomBetween(-3, 3),
    vy: randomBetween(-14, -6),
    x: randomBetween(0, canvasWidth),
    y: -10,
  }
}

type ConfettiProps = {
  active: boolean
}

/**
 * Renders a canvas confetti burst when `active` is true.
 * Cleans itself up automatically after the animation ends.
 */
export function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const PARTICLE_COUNT = 120
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width),
    )

    let animId: number
    let frame = 0
    const MAX_FRAMES = 180

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.vy += 0.35 // gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - frame / MAX_FRAMES)
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }

      frame++
      if (frame < MAX_FRAMES) {
        animId = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [active])

  if (!active) return null

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      style={{
        inset: 0,
        pointerEvents: "none",
        position: "fixed",
        zIndex: 9999,
      }}
    />
  )
}

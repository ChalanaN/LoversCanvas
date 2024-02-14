import { Particle, ParticleEmitter } from "./utils.js";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

export function resizeCanvas({ width, height }: { width: number, height: number }) {
    canvas.height = Math.min(height, window.innerHeight);
    canvas.width = Math.min(width, window.innerWidth);
}

export const particleEmitters: ParticleEmitter[] = []

const particles: Particle[] = []

const heart = new Path2D("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((p, i) => {
        ctx.save()
        ctx.translate(p.position.x - (p.size / 2), p.position.y - (p.size / 2))
        ctx.scale(p.size, p.size)
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity})`
        ctx.fill(heart)
        ctx.restore()

        if (p.decreaseOpacityBy) p.opacity = Math.max(0, p.opacity - p.decreaseOpacityBy)
        if (p.decreaseSizeBy) p.size = Math.max(0, p.size - p.decreaseSizeBy)
        p.position.x += p.velocity.x
        p.position.y += p.velocity.y

        if (p?.colorFrom && p?.colorTo) p.color.forEach((v, i) => {
            // @ts-ignore
            p.color[i] += Math.abs((p.colorFrom[i] - p.colorTo[i])/30) * Math.sign(p.colorTo[i] - p.colorFrom[i])
        })

        if (p.opacity <= 0 || p.size <= 0 || p.position.y < 0 || p.position.x < 0 || p.position.x > canvas.width || p.position.y > canvas.height) {
            particles.splice(i, 1)
        }
    })

    particleEmitters.forEach((emitter) => {
        if (!emitter.emitting) return

        for (var i = 0; i < 20; i++) {
            particles.push({
                position: {
                    x: emitter.x + (Math.random() * emitter.maxWidth - emitter.maxWidth/2),
                    y: emitter.y + (Math.random() * emitter.maxWidth - emitter.maxWidth/2)
                },
                velocity: {
                    x: Math.random() * emitter.maxParticleSpeedX - emitter.maxParticleSpeedX / 2,
                    y: Math.random() * emitter.maxParticleSpeedY - emitter.maxParticleSpeedY / 2
                },
                color: [...emitter.color.from],
                colorFrom: emitter.color.from,
                colorTo: emitter.color.to,
                opacity: 0.3+Math.random()*0.7,
                size: Math.random() * emitter.maxParticleSize,
                decreaseOpacityBy: Math.random() / 10,
                decreaseSizeBy: Math.random() * emitter.maxParticleSize / 25
            })
        }
    })
}

window.addEventListener("load", () => setInterval(draw, 33))
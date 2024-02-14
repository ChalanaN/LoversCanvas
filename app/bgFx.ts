import { COLORS, Particle } from "./utils.js";

const canvas = document.querySelector("canvas#bgFx") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

const particles: Particle[] = []

const heart = new Path2D("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")

function newParticle(): Particle {
    return {
        position: {
            x: Math.random() * innerWidth,
            y: innerHeight
        },
        velocity: {
            x: 0,
            y: -Math.random() * 5 - 5
        },
        color: [...COLORS.pink.from],
        colorFrom: COLORS.pink.from,
        colorTo: COLORS.pink.to,
        opacity: 0.3 + Math.random() * 0.7,
        size: Math.random() * 10,
        decreaseOpacityBy: 0.01 + Math.random() / 20,
        decreaseSizeBy: Math.random() / 10
    }
}

let continueEffect = true

export function startEffect(maxTime: number = 1000) {
    continueEffect = true
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            particles.push(newParticle())
        }, Math.random() * maxTime)
    }
}

export function stopEffect() {
    continueEffect = false
}
startEffect()

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((p, i) => {
        ctx.save()
        ctx.translate(p.position.x + (p.size * 2), p.position.y + (p.size * 2))
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

        if (p.opacity <= 0 || p.size <= 0 || p.position.y < -p.size || p.position.x < 0 || p.position.x > canvas.width) {
            if (continueEffect) {
                particles[i] = newParticle()
            } else {
                particles.splice(i, 1)
            }
        }
    })
}

window.addEventListener("load", () => setInterval(draw, 33))
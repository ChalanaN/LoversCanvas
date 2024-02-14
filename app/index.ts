import User from "./User.js";
import { canvasOffsets, particleEmitters } from "./canvas.js";
import { COLORS, ParticleEmitter } from "./utils.js";
import * as socket from "./connection.js";

const mouse: ParticleEmitter = {
    x: 0,
    y: 0,
    emitting: false,
    color: COLORS.pink,
    maxParticleSize: 1,
    particlesForATick: 20,
    maxParticleSpeedX: 5,
    maxParticleSpeedY: 5,
    maxWidth: 20
}

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x - canvasOffsets.left
    mouse.y = e.y - canvasOffsets.top
});
window.addEventListener("touchmove", (e) => {
    mouse.x = e.touches[0].clientX - canvasOffsets.left
    mouse.y = e.touches[0].clientY - canvasOffsets.top
});
window.addEventListener("mousedown", () => (mouse.emitting = true))
window.addEventListener("touchstart", (e) => {
    mouse.x = e.touches[0].clientX - canvasOffsets.left
    mouse.y = e.touches[0].clientY - canvasOffsets.top
    mouse.emitting = true
})
window.addEventListener("mouseup", () => (mouse.emitting = false))
window.addEventListener("touchend", () => (mouse.emitting = false))

particleEmitters.push(mouse)

export const Me = {
    id: "",
    connected: false,
    gender: "",
    interestedIn: ""
};

export const Users: User[] = []

if (localStorage.getItem("gender") && localStorage.getItem("interestedIn")) {
    Me.gender = localStorage.getItem("gender") as string
    Me.interestedIn = localStorage.getItem("interestedIn") as string
    socket.connect()
}

document.querySelector("#connect")?.addEventListener("click", () => {
    Me.gender = (document.querySelector("#gender") as HTMLInputElement).value.toLowerCase()
    Me.interestedIn = (document.querySelector("#interestedIn") as HTMLInputElement).value.toLowerCase()
    localStorage.setItem("gender", Me.gender)
    localStorage.setItem("interestedIn", Me.interestedIn)
    socket.connect()
})

function updateMousePosition() {
    Users[0]?.signaling.send("mouse", {
        ...mouse,
        x: mouse.x / Users[0].resizeFactor,
        y: mouse.y / Users[0].resizeFactor
    })
    requestAnimationFrame(updateMousePosition)
}
requestAnimationFrame(updateMousePosition)
import User from "./User.js";
import { particleEmitters } from "./canvas.js";
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
    mouse.x = e.x
    mouse.y = e.y
});
window.addEventListener("touchmove", (e) => {
    mouse.x = e.touches[0].clientX
    mouse.y = e.touches[0].clientY
});
window.addEventListener("mousedown", () => (mouse.emitting = true))
window.addEventListener("touchstart", (e) => {
    mouse.x = e.touches[0].clientX
    mouse.y = e.touches[0].clientY
    mouse.emitting = true
})
window.addEventListener("mouseup", () => (mouse.emitting = false))
window.addEventListener("touchend", () => (mouse.emitting = false))

particleEmitters.push(mouse)

export const Me = {
    id: "",
    connected: false,
    gender: "male",
    interestedIn: "female"
};

export const Users: User[] = []

socket.connect();

function updateMousePosition() {
    Users[0]?.signaling.send("mouse", {
        ...mouse,
        x: mouse.x / Users[0].resizeFactor,
        y: mouse.y / Users[0].resizeFactor
    })
    requestAnimationFrame(updateMousePosition)
}
requestAnimationFrame(updateMousePosition)
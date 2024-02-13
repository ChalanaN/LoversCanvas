import User from "./User.js";
import { particleEmitters } from "./canvas.js";
import { COLORS, ParticleEmitter } from "./utils.js";

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
window.addEventListener("mousedown", () => (mouse.emitting = true))
window.addEventListener("mouseup", () => (mouse.emitting = false))

particleEmitters.push(mouse)

export const Me = {
    id: "",
    connected: false,
    gender: "male",
    interestedIn: "female"
};

export const Users: { [id: string]: User } = {}
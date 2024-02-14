import type WebSocket from "ws"
import { gender } from "./types"

export default class User {
    id: any
    socket: WebSocket
    available: boolean
    gender: gender
    interestedIn: gender
    screenSize: { width: number, height: number }

    /**
     * Creates a new user for a room 🤠
     * @param {number} id UID of the user
     * @param {string} name Name of the user
     * @param {"host" | "co-host" | "participant"} role Role of the user
     * @param {WebSocket} [socket] WebSocket connection of the user
     * @param {Room} room Room of the user
     */
    constructor(id: string, details: { gender: gender, interestedIn: gender, screenSize: { width: number, height: number } }, socket: WebSocket) {
        this.id = id
        this.gender = details.gender
        this.interestedIn = details.interestedIn
        this.screenSize = details.screenSize
        this.socket = socket
        this.available = true
    }

    /**
     * Sends a message to the user ⚡
     * @param {"system" | "system-reply" | "signaling"} type Type of the message
     * @param {string} content Content of the message
     * @param {any} value Value of the message
     * @param {number} [by] UID of the user who send the message
     */
    send(type: "system" | "system-reply" | "signaling", content: string, value: any, by?: string) {
        this.socket.send(JSON.stringify({ type, content, value, by }))
    }
}
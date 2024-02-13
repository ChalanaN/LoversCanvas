import { Me, Users } from "./index.js"
import User from "./User.js"
import { apiDomain, error, ERRORS } from "./utils.js"
import type { WSMessage } from "../types"

/**
 * WebSocket connection of the user 🔌⚡
 * @type {WebSocket}
 */
export let connection: WebSocket;

/**
 * Sends a massege ⚡
 * @param {"system" | "signaling" | "to-all"} type Type of the massege
 * @param {"name" | "offer" | "answer" | "massege" | String} content Content of the massege
 * @param {*} value Value to send
 * @param {String} to User to send
 */
// @ts-ignore
export const send = (type: "system" | "signaling" | "to-all", content: "name" | "offer" | "answer" | "message" | string, value: any, to?: string) => connection instanceof WebSocket && connection.send ? connection.send(JSON.stringify({ type, content, value, to })) : connect() || send(type, content, value, to);

export function connect() {
    connection = new WebSocket(`ws://${apiDomain}/`);

    connection.addEventListener("open", () => {
        console.log("🔌👍");
        send("system", "register", { gender: Me.gender, interestedIn: Me.interestedIn });
        send("system", "ping", "ping");
    });
    connection.addEventListener("close", () => {
        console.log("🔌👎");
        error(ERRORS.ERROR_DISCONNECTED)
    });
    connection.addEventListener("message", e => {
        let data: WSMessage = JSON.parse(e.data);

        switch (data.type) {
            case "system":
                switch (data.content) {
                    case "id":
                        Me.id = data.value;
                        break;
                    case "partner":
                        console.log("Found a partner!", data)
                        Users[0] = new User(data.value.id, data.value.sendOffer);
                        break;
                    case "pong": setTimeout(() => send("system", "ping", "ping"), 3000);break;
                }
                break;
            case "signaling":
                switch (data.content) {
                    case "offer":
                        console.log(data);
                        if (Users[0].id != data.by) return
                        Users[0] && (async () => {
                            Users[0].connection.setRemoteDescription(new RTCSessionDescription(data.value));
                            let answer = await Users[0].connection.createAnswer();
                            await Users[0].connection.setLocalDescription(answer);
                            send("signaling", "answer", answer, data.by);
                        })();
                        break;
                    case "answer":
                        console.log(data);
                        Users[0] && (async () => await Users[0].connection.setRemoteDescription(new RTCSessionDescription(data.value)))();
                        break;
                    case "icecandidate":
                        Users[0] && Users[0].connection.addIceCandidate(data.value);
                        break;
                }
                break;
        }
    });
}
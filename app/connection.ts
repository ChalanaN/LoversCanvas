import { Me, Users } from "./index.js"
import User from "./User.js"
import { apiDomain, error, ERRORS } from "./utils.js"

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
    connection = new WebSocket(`wss://${apiDomain}/`);

    connection.addEventListener("open", () => {
        console.log("🔌👍");
        send("system", "basic", { gender: Me.gender, interestedIn: Me.interestedIn });
        send("system", "ping", "ping");
    });
    connection.addEventListener("close", () => {
        console.log("🔌👎");
        error(ERRORS.ERROR_DISCONNECTED)
    });
    connection.addEventListener("message", e => {
        let data = JSON.parse(e.data);

        switch (data.type) {
            case "system":
                switch (data.content) {
                    case "basic":
                        Me.id = data.value.uid;
                        break;
                    case "user-enter":
                        Users[data.by] = new User(data.value.id, data.value.name, true);
                        break;
                    case "user-leave":
                        Users[data.by].remove();
                        break;
                    case "pong": setTimeout(() => send("system", "ping", "ping"), 3000);break;
                }
                break;
            case "signaling":
                switch (data.content) {
                    case "offer":
                        console.log(data);
                        Users[data.by] && (async () => {
                            Users[data.by].connection.setRemoteDescription(new RTCSessionDescription(data.value));
                            let answer = await Users[data.by].connection.createAnswer();
                            await Users[data.by].connection.setLocalDescription(answer);
                            send("signaling", "answer", answer, data.by);
                        })();
                        break;
                    case "answer":
                        console.log(data);
                        Users[data.by] && (async () => await Users[data.by].connection.setRemoteDescription(new RTCSessionDescription(data.value)))();
                        break;
                    case "icecandidate":
                        Users[data.by] && Users[data.by].connection.addIceCandidate(data.value);
                        break;
                }
                break;
        }
    });
}
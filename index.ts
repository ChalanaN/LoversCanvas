import fs from "fs/promises"
import http from "http"
import { WebSocket, WebSocketServer } from "ws"
import { v4 as uuid } from "uuid"
import User from "./User.js"
import { getContentType } from "./utils.js"
import { WSMessage } from "./types.js"

const port = process.env.port || 80;

const WaitingRoom: User[] = []

// Server 💻
const server = http.createServer((req, res) => {
    if (req.headers["fly-forwarded-proto"] == "http") {
        res.writeHead(302, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
        return false;
    }

    const requestURL = new URL(req.url!, `https://${req.headers.host}`);

    /**
     * Sends a file as response
     * @param {import("fs").PathLike} path Path to the file
     * @param {object} [options] Additional options
     * @param {number} [options.statusCode]
     */
    const sendFile = async (path: import("fs").PathLike, options?: { statusCode?: number; }) => {
        res.statusCode = options?.statusCode || 200;
        res.setHeader("Content-Type", getContentType(path)!);
        try {
            res.end(await fs.readFile(path));
        } catch (e) {
            res.statusCode = 404;
            res.end();
        }
    }

    // CORS 🔒
    res.setHeader("Access-Control-Allow-Origin", "https://lovers-canvas.glitch.me");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method == "GET") return sendFile(requestURL.pathname == "/" ? "./app/index.html" : (("./app" + req.url)));
});

// @ts-ignore
server.listen(port, "0.0.0.0", () => {
    console.log("👍");
});

// WebSocket 🔌
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
    console.log("🤗");

    let user: User
    
    socket.on("message", d => {
        let data: WSMessage = JSON.parse(d.toString());

        if (data.type == "system" && data.content == "register") {
            user = new User(uuid(), data.value, socket)
            WaitingRoom.push(user)
            user.send("system", "id", user.id)
            console.log(`${user.id} joined waiting room`);

            let partner = WaitingRoom.find(u => u.id != user.id && u.gender == user.interestedIn && u.interestedIn == user.gender)
            if (!partner) return
            let optimalScreenSize = Math.sign((user.screenSize.width + user.screenSize.height) - (partner.screenSize.width + partner.screenSize.height)) == 1 ? partner.screenSize : user.screenSize
            partner.send("system", "partner", { id: user.id, screenSize: optimalScreenSize, sendOffer: true })
            user.send("system", "partner", { id: partner?.id, screenSize: optimalScreenSize, sendOffer: false })
        } else if (user) {
            data.content != "ping" && console.log(data);
            switch (data.type) {
                case "system":
                    switch (data.content) {
                        case "ping": user.send("system", "pong", "pong");break;
                    }
                    break;
                case "signaling":
                    // @ts-ignore
                    WaitingRoom.find(u => u.id == data.to)?.send("signaling", data.content, data.value, user.id);
                    break;
            }
        }
    })

    socket.on("close", () => {
        if (user) {
            WaitingRoom.splice(WaitingRoom.indexOf(user), 1);
            console.log("🙋‍♂️");
        }
    });
});
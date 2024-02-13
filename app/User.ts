import { COLORS, ParticleEmitter, peerConnectionOptions } from "./utils.js"
import * as socket from "./connection.js"
import { Users } from "./index.js";
import { particleEmitters } from "./canvas.js";

/**
 * User in a room 🙍‍♀️🙍‍♂️
 */
export default class User {
    id: string;
    connection: RTCPeerConnection;
    signalingChannel: RTCDataChannel;
    negotiating: boolean;
    connected: boolean;
    signaling: { send: (type: "mouse", value: ParticleEmitter, additional?: object) => void }
    particleEmitter: ParticleEmitter

    /**
     * Creates a new User and updates the UI ✨
     * @param {string} id UID of the user
     * @param {string} name Name of the user
     * @param {boolean} sendOffer Specify whether to send an offer to the user
     */
    constructor(id: string, sendOffer: boolean) {
        this.id = id;
        this.connection = new RTCPeerConnection(peerConnectionOptions);
        // @ts-ignore
        this.signalingChannel = sendOffer ? this.connection.createDataChannel("SignalingChannel") : undefined;
        this.negotiating = false;
        this.connected = false;
        this.signaling = {
            /**
             * Sends a massage through the signaling data channel
             * @param {"mediastatuschange"} type Type of the massage
             * @param {*} value Massage
             * @param {object} additional Additional parameters
             */
            send: (type: "mouse", value: ParticleEmitter, additional?: object) => this.signalingChannel && this.signalingChannel.send(JSON.stringify({ type, value, ...additional }))
        }
        this.particleEmitter = {
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
        particleEmitters.push(this.particleEmitter)

        this.connection.addEventListener("icecandidate", e => e.candidate && socket.send("signaling", "icecandidate", e.candidate, this.id));
        this.connection.addEventListener("connectionstatechange", e => {
            // @ts-ignore
            !this.connected && e.target.iceConnectionState == "connected" && (this.connected = true) && console.log(`Connected with ${this.id} 🤝`) && this.connection.addEventListener("negotiationneeded", createAndSendOffer);
            // @ts-ignore
            console.log(`⚡ ${this.id}'s connection changed to ${e.target.iceConnectionState} ⚡`);
            // @ts-ignore
            if (e.target.iceConnectionState == "disconnected") this.remove();
        });
        this.connection.addEventListener("signalingstatechange", () => this.negotiating = this.connection.signalingState != "stable");

        let createAndSendOffer = async () => {
            if (this.negotiating) return;
            console.log("Creating and sending offer")
            this.negotiating = true;
            let offer = await this.connection.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false
            });
            await this.connection.setLocalDescription(offer);
            socket.send("signaling", "offer", offer, this.id);
        };
        sendOffer ? this.connection.addEventListener("negotiationneeded", createAndSendOffer) : setTimeout(() => this.connection.addEventListener("negotiationneeded", createAndSendOffer), 5000);

        // Signaling Channel 📩
        let signalingChannelOpened = () => {
            this.signalingChannel.addEventListener("open", () => console.log(`Data channel opened for ${this.id}`));
            this.signalingChannel.addEventListener("close", () => console.log(`Data channel closed from ${this.id}`));
            this.signalingChannel.addEventListener("message", e => {
                let data = JSON.parse(e.data);
                switch (data.type) {
                    case "mouse":
                        // console.log(data.value.emitting && data.value)
                        this.particleEmitter.color = data.value.color;
                        this.particleEmitter.emitting = data.value.emitting;
                        this.particleEmitter.maxParticleSize = data.value.maxParticleSize;
                        this.particleEmitter.maxParticleSpeedX = data.value.maxParticleSpeedX;
                        this.particleEmitter.maxParticleSpeedY = data.value.maxParticleSpeedY;
                        this.particleEmitter.maxWidth = data.value.maxWidth;
                        this.particleEmitter.particlesForATick = data.value.particlesForATick;
                        this.particleEmitter.x = data.value.x;
                        this.particleEmitter.y = data.value.y;
                        break;
                    default:
                        console.log(data)
                }
            })
        }
        this.connection.addEventListener("datachannel", e => {
            console.log(e)
            e.channel.label == "SignalingChannel" && (this.signalingChannel = e.channel);
            signalingChannelOpened();
        });
        sendOffer && signalingChannelOpened();
    }

    /**
     * Removes the user
     */
    remove() {
        console.log(`🙋‍♂️ ${this.id} left 🙋‍♂️`);
        this.connection.close();
        particleEmitters.splice(particleEmitters.indexOf(this.particleEmitter), 1)
        Users.shift();
    }
}
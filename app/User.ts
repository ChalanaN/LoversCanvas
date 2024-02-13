import { peerConnectionOptions } from "./utils.js"
import * as socket from "./connection.js"
import { Users } from "./index.js";

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
                    case "mediastatuschange":
                        // !data.value.video && this.stream.getVideoTracks().forEach(t => this.stream.removeTrack(t));
                        break;
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
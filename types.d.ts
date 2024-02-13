export type gender = ["male", "female", "other"]

export type WSMessage = {
    type: "signaling",
    content: "offer" | "answer" | "icecandidate",
    to: string,
    by: string,
    value: any
} | {
    type: "system",
    content: "register",
    value: {
        gender: gender,
        interestedIn: gender
    }
} | {
    type: "system",
    content: "id",
    value: string
} | {
    type: "system",
    content: "partner",
    value: {
        id: string,
        sendOffer: boolean
    }
} | {
    type: "system",
    content: "ping" | "pong"
}
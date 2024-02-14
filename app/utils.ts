export type RGBColor = [number, number, number]

export interface Particle {
    position: {
        x: number,
        y: number
    },
    velocity: {
        x: number,
        y: number
    },
    color: RGBColor,
    colorFrom?: RGBColor,
    colorTo?: RGBColor,
    opacity: number,
    size: number,
    decreaseOpacityBy?: number,
    decreaseSizeBy?: number
}

export interface ParticleEmitter {
    x: number,
    y: number,
    color: {
        from: RGBColor, to: RGBColor
    },
    maxParticleSize: number,
    particlesForATick: number,
    maxWidth: number,
    maxParticleSpeedX: number,
    maxParticleSpeedY: number,
    emitting: boolean
}

export const COLORS = {
    pink: {
        from: rgb(255, 120, 196),
        to: rgb(255, 189, 247)
    },
    purple: {
        from: rgb(225, 174, 255),
        to: rgb(255, 189, 247)
    },
    blue: {
        from: rgb(120, 196, 255),
        to: rgb(189, 247, 255)
    }, 
    green: {
        from: rgb(120, 255, 196),
        to: rgb(189, 255, 247)
    },
    yellow: {
        from: rgb(255, 255, 120),
        to: rgb(255, 255, 189)
    },
    orange: {
        from: rgb(255, 196, 120),
        to: rgb(255, 247, 189)
    }
}

function rgb(r: number, g: number, b: number): RGBColor {
    return [r, g, b]
}

/**
 * Error descriptions 🙊
 */
export const ERRORS = {
    ERROR_GETTING_USER_MEDIA: "Error getting camera and microphone access 😭",
    ERROR_DISCONNECTED: "You are disconnected 😕"
}

/**
 * @type {RTCConfiguration}
 */
export const peerConnectionOptions = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:turn2.l.google.com" },
        {
            urls: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }
    ],
    certificates: [] as RTCCertificate[]
};
// @ts-ignore
(async () => peerConnectionOptions.certificates.push(await RTCPeerConnection.generateCertificate({ name: "ECDSA", namedCurve: "P-256" })))();

export const apiDomain = "localhost:3000"

export function error(err: string, time = 10000) {
    console.error(err);
    // @ts-ignore
    document.querySelector("#error").textContent = err;
    document.querySelector(".error")?.classList.add("show");
    setTimeout(() => {
        document.querySelector(".error")?.classList.remove("show");
    }, time);
}

export function calculateScreenSize(screenSize: { width: number, height: number }) {
    const { width, height } = screenSize;
    const ratio = width / height;
    if (ratio <= 1) {
        return {
            height: window.innerHeight,
            width: window.innerHeight * ratio,
            resizeFactor: window.innerHeight / height
        }
    } else {
        return {
            width: window.innerWidth,
            height: window.innerWidth / ratio,
            resizeFactor: window.innerWidth / width
        }
    }
}
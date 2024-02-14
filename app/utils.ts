const WINDOW_MARGIN = 32

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

/**
 * 
 * @param {string} err Message to be displayed
 * @param {number} [t] Timeout. Error will hide after the timeout
 * @param {string[]} [classes] Classes to add to the `.error` element
 * @returns {{timeout:number,element:HTMLDivElement}}
 */
export const error = (err: string, t?: number, classes: string[] = []): { timeout?: number; element: HTMLDivElement } => {
    let errorElem = document.createElement("div")
    errorElem.classList.add("error")
    classes.forEach(c => errorElem.classList.add(c))
    errorElem.innerHTML = `<span>${err}</span><span class="close-icon" onclick="this.parentElement.remove()"></span>`
    document.querySelector(".errors")?.appendChild(errorElem)
    !classes && console.error(err)
    return {
        timeout: t ? (setTimeout(() => errorElem.remove(), t) as unknown) as number : undefined,
        element: errorElem
    }
}

export function calculateScreenSize(screenSize: { width: number, height: number }) {
    const { width, height } = screenSize;
    const ratio = width / height;
    const canvasMaxWidth = width == window.innerWidth ? window.innerWidth : (window.innerWidth - WINDOW_MARGIN*2);
    const canvasMaxHeight = height == window.innerHeight ? window.innerHeight : (window.innerHeight - WINDOW_MARGIN*2);

    if (ratio <= 1) {
        return {
            height: canvasMaxHeight,
            width: canvasMaxHeight * ratio,
            resizeFactor: canvasMaxHeight / height
        }
    } else {
        return {
            width: canvasMaxWidth,
            height: canvasMaxWidth / ratio,
            resizeFactor: canvasMaxWidth / width
        }
    }
}
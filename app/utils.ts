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
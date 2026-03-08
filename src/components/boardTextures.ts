import * as THREE from "three";
import type { TileState } from "../game/types";

type GrainDirection = "horizontal" | "vertical" | "diagonal";
type WoodVariant = "outer" | "wall" | "floor" | "trim" | "tile-up" | "tile-selected" | "tile-down";

interface WoodPalette {
    light: string;
    base: string;
    mid: string;
    dark: string;
    lineLight: string;
    lineDark: string;
}

interface CreateWoodTextureOptions {
    variant: WoodVariant;
    width?: number;
    height?: number;
    seed?: number;
    grainDirection?: GrainDirection;
}

const PALETTES: Record<WoodVariant, WoodPalette> = {
    outer: {
        light: "#c99356",
        base: "#ad6a33",
        mid: "#8d4f23",
        dark: "#643113",
        lineLight: "rgba(255,255,255,0.08)",
        lineDark: "rgba(45,20,8,0.12)",
    },
    wall: {
        light: "#bf8346",
        base: "#9d5d2a",
        mid: "#7a411b",
        dark: "#55270f",
        lineLight: "rgba(255,255,255,0.07)",
        lineDark: "rgba(38,16,6,0.13)",
    },
    floor: {
        light: "#bf7d43",
        base: "#9d5927",
        mid: "#7b3f18",
        dark: "#54260f",
        lineLight: "rgba(255,255,255,0.06)",
        lineDark: "rgba(38,16,6,0.12)",
    },
    trim: {
        light: "#e1af6f",
        base: "#c98b4b",
        mid: "#9f6030",
        dark: "#713915",
        lineLight: "rgba(255,255,255,0.1)",
        lineDark: "rgba(55,26,10,0.14)",
    },
    "tile-up": {
        light: "#efc889",
        base: "#d4a562",
        mid: "#b47c42",
        dark: "#875224",
        lineLight: "rgba(255,255,255,0.14)",
        lineDark: "rgba(75,38,13,0.16)",
    },
    "tile-selected": {
        light: "#d8a36a",
        base: "#bd834a",
        mid: "#9b5f31",
        dark: "#74401b",
        lineLight: "rgba(255,255,255,0.1)",
        lineDark: "rgba(56,25,10,0.16)",
    },
    "tile-down": {
        light: "#bd8552",
        base: "#a26b3e",
        mid: "#824f2a",
        dark: "#603418",
        lineLight: "rgba(255,255,255,0.08)",
        lineDark: "rgba(43,20,8,0.14)",
    },
};

const createRandom = (seed: number) => {
    let value = seed >>> 0;

    return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
    };
};

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

const addBroadBands = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    direction: GrainDirection,
    lightColor: string,
    darkColor: string,
) => {
    for (let index = 0; index < 7; index += 1) {
        const bandSize = 36 + random() * 90;
        const offset =
            direction === "horizontal"
                ? random() * height
                : direction === "vertical"
                  ? random() * width
                  : random() * (width + height);

        context.fillStyle = index % 2 === 0 ? lightColor : darkColor;

        if (direction === "horizontal") {
            context.fillRect(0, offset, width, bandSize);
        } else if (direction === "vertical") {
            context.fillRect(offset, 0, bandSize, height);
        } else {
            context.save();
            context.translate(width / 2, height / 2);
            context.rotate(-0.34);
            context.fillRect(-width, offset - height, width * 2, bandSize);
            context.restore();
        }
    }
};

const addFineGrain = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    direction: GrainDirection,
    lightColor: string,
    darkColor: string,
) => {
    const stripeCount =
        direction === "horizontal"
            ? Math.floor(height / 18)
            : direction === "vertical"
              ? Math.floor(width / 18)
              : Math.floor((width + height) / 26);

    for (let index = 0; index < stripeCount; index += 1) {
        const size = 6 + random() * 10;
        const offset =
            direction === "horizontal"
                ? index * 18 + (random() - 0.5) * 7
                : direction === "vertical"
                  ? index * 18 + (random() - 0.5) * 7
                  : index * 20 + (random() - 0.5) * 8;

        context.fillStyle = index % 2 === 0 ? lightColor : darkColor;

        if (direction === "horizontal") {
            context.fillRect(0, offset, width, size);
        } else if (direction === "vertical") {
            context.fillRect(offset, 0, size, height);
        } else {
            context.save();
            context.translate(width / 2, height / 2);
            context.rotate(-0.34);
            context.fillRect(-width, offset - height, width * 2, size);
            context.restore();
        }
    }
};

const addFlowLines = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    direction: GrainDirection,
) => {
    for (let index = 0; index < 12; index += 1) {
        context.strokeStyle = `rgba(255,255,255,${0.025 + random() * 0.025})`;
        context.lineWidth = 1 + random();

        context.beginPath();

        if (direction === "horizontal") {
            const y = random() * height;
            context.moveTo(0, y);
            context.bezierCurveTo(
                width * 0.28,
                y + (random() - 0.5) * 18,
                width * 0.72,
                y + (random() - 0.5) * 18,
                width,
                y,
            );
        } else if (direction === "vertical") {
            const x = random() * width;
            context.moveTo(x, 0);
            context.bezierCurveTo(
                x + (random() - 0.5) * 18,
                height * 0.28,
                x + (random() - 0.5) * 18,
                height * 0.72,
                x,
                height,
            );
        } else {
            const startX = -width * 0.2;
            const startY = random() * height;
            context.moveTo(startX, startY);
            context.bezierCurveTo(
                width * 0.25,
                startY + (random() - 0.5) * 18,
                width * 0.7,
                startY + (random() - 0.5) * 18,
                width * 1.1,
                startY - 40,
            );
        }

        context.stroke();
    }
};

const drawWood = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    palette: WoodPalette,
    seed: number,
    grainDirection: GrainDirection,
) => {
    const random = createRandom(seed);

    const baseGradient =
        grainDirection === "horizontal"
            ? context.createLinearGradient(0, 0, 0, height)
            : grainDirection === "vertical"
              ? context.createLinearGradient(0, 0, width, 0)
              : context.createLinearGradient(0, 0, width, height);

    baseGradient.addColorStop(0, palette.light);
    baseGradient.addColorStop(0.45, palette.base);
    baseGradient.addColorStop(0.72, palette.mid);
    baseGradient.addColorStop(1, palette.dark);

    context.fillStyle = baseGradient;
    context.fillRect(0, 0, width, height);

    addBroadBands(context, width, height, random, grainDirection, palette.lineLight, palette.lineDark);
    addFineGrain(context, width, height, random, grainDirection, palette.lineLight, palette.lineDark);
    addFlowLines(context, width, height, random, grainDirection);

    const edgeShade = context.createLinearGradient(0, 0, width, height);
    edgeShade.addColorStop(0, "rgba(0,0,0,0.08)");
    edgeShade.addColorStop(0.35, "rgba(0,0,0,0)");
    edgeShade.addColorStop(1, "rgba(0,0,0,0.1)");

    context.fillStyle = edgeShade;
    context.fillRect(0, 0, width, height);

    const topGloss = context.createLinearGradient(0, 0, 0, height * 0.25);
    topGloss.addColorStop(0, "rgba(255,255,255,0.06)");
    topGloss.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = topGloss;
    context.fillRect(0, 0, width, height * 0.25);
};

export const createWoodTexture = ({
    variant,
    width = 1024,
    height = 1024,
    seed = 1,
    grainDirection = "horizontal",
}: CreateWoodTextureOptions): THREE.CanvasTexture => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Could not create 2D context for wood texture.");
    }

    drawWood(context, width, height, PALETTES[variant], seed, grainDirection);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
};

export const getTileTextColor = (_tileState: TileState): string => {
    return "#4b1f0a";
};

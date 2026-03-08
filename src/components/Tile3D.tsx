import { Text } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Tile } from "../game/types";
import { createWoodTexture, getTileTextColor } from "./boardTextures";

interface Tile3DProps {
    tile: Tile;
    width: number;
    height: number;
    depth: number;
    position: [number, number, number];
    onClick: (tileNumber: number) => void;
}

const UP_ROTATION = -0.22;
const SELECTED_ROTATION = 0.52;
const DOWN_ROTATION = 0.56;

const getTextOffsetX = (tileNumber: number): number => {
    if (tileNumber === 1) return 0.012;
    if (tileNumber === 12) return -0.008;
    return 0;
};

const Tile3D = ({ tile, width, height, depth, position, onClick }: Tile3DProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const rejectAnimStartedAtRef = useRef<number | null>(null);

    const textureVariant =
        tile.state === "selected"
            ? "tile-selected"
            : tile.state === "down"
              ? "tile-down"
              : "tile-up";

    const sideTexture = useMemo(
        () =>
            createWoodTexture({
                variant: textureVariant,
                width: 900,
                height: 900,
                seed: tile.number * 17 + 3,
                grainDirection: "vertical",
            }),
        [textureVariant, tile.number],
    );

    useEffect(() => {
        return () => {
            sideTexture.dispose();
        };
    }, [sideTexture]);

    const targetRotation =
        tile.state === "up" || tile.state === "disabled"
            ? UP_ROTATION
            : tile.state === "selected"
              ? SELECTED_ROTATION
              : DOWN_ROTATION;

    const targetY =
        tile.state === "selected" || tile.state === "down"
            ? position[1] + 0.11
            : position[1];

    const targetZ =
        tile.state === "selected" || tile.state === "down"
            ? position[2] + 0.14
            : position[2];

    const currentRotationRef = useRef<number>(targetRotation);
    const currentYRef = useRef<number>(targetY);
    const currentZRef = useRef<number>(targetZ);

    useFrame((_, delta) => {
        const now = window.performance.now() / 1000;

        let rejectRotationOffset = 0;
        let rejectLiftOffset = 0;

        if (rejectAnimStartedAtRef.current !== null) {
            const elapsed = now - rejectAnimStartedAtRef.current;

            if (elapsed < 0.28) {
                const damper = Math.exp(-12 * elapsed);
                rejectRotationOffset = Math.sin(elapsed * 34) * 0.09 * damper;
                rejectLiftOffset = Math.abs(Math.sin(elapsed * 24)) * 0.02 * damper;
            } else {
                rejectAnimStartedAtRef.current = null;
            }
        }

        currentRotationRef.current = THREE.MathUtils.damp(
            currentRotationRef.current,
            targetRotation + rejectRotationOffset,
            14,
            delta,
        );

        currentYRef.current = THREE.MathUtils.damp(currentYRef.current, targetY + rejectLiftOffset, 14, delta);
        currentZRef.current = THREE.MathUtils.damp(currentZRef.current, targetZ, 14, delta);

        if (groupRef.current) {
            groupRef.current.rotation.x = currentRotationRef.current;
            groupRef.current.position.set(position[0], currentYRef.current, currentZRef.current);
        }
    });

    const triggerTileInteraction = () => {
        if (tile.state === "disabled") {
            rejectAnimStartedAtRef.current = window.performance.now() / 1000;
            return;
        }

        if (tile.state === "down") return;

        onClick(tile.number);
    };

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        pointerStartRef.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();

        const start = pointerStartRef.current;
        pointerStartRef.current = null;

        if (!start) {
            triggerTileInteraction();
            return;
        }

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        const distance = Math.hypot(deltaX, deltaY);

        const isTap = distance < 10;
        const isMostlyVerticalSwipe = Math.abs(deltaY) > 14 && Math.abs(deltaY) > Math.abs(deltaX);

        if (isTap || isMostlyVerticalSwipe) {
            triggerTileInteraction();
        }
    };

    const handlePointerCancel = () => {
        pointerStartRef.current = null;
    };

    const handlePointerOver = () => {
        document.body.style.cursor = tile.state === "down" ? "default" : "pointer";
    };

    const handlePointerOut = () => {
        document.body.style.cursor = "default";
    };

    const textOffsetX = getTextOffsetX(tile.number);

    return (
        <group ref={groupRef} position={position}>
            <mesh
                position={[0, height / 2, depth / 2]}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <boxGeometry args={[width, height, depth]} />

                <meshStandardMaterial attach="material-0" map={sideTexture} roughness={0.78} metalness={0.02} />
                <meshStandardMaterial attach="material-1" map={sideTexture} roughness={0.78} metalness={0.02} />
                <meshStandardMaterial attach="material-2" map={sideTexture} roughness={0.8} metalness={0.02} />
                <meshStandardMaterial attach="material-3" map={sideTexture} roughness={0.84} metalness={0.02} />
                <meshStandardMaterial attach="material-4" map={sideTexture} roughness={0.76} metalness={0.02} />
                <meshStandardMaterial attach="material-5" map={sideTexture} roughness={0.8} metalness={0.02} />

                {(tile.state === "up" || tile.state === "disabled") && (
                    <>
                        <Text
                            position={[textOffsetX, height / 2 - 0.075, depth + 0.003]}
                            fontSize={0.205}
                            textAlign="center"
                            anchorX="center"
                            anchorY="top"
                            color="rgba(255,255,255,0.16)"
                            raycast={() => null}
                        >
                            {String(tile.number)}
                        </Text>

                        <Text
                            position={[textOffsetX, height / 2 - 0.062, depth + 0.007]}
                            fontSize={0.205}
                            textAlign="center"
                            anchorX="center"
                            anchorY="top"
                            color={getTileTextColor(tile.state)}
                            raycast={() => null}
                        >
                            {String(tile.number)}
                        </Text>
                    </>
                )}
            </mesh>
        </group>
    );
};

export default Tile3D;
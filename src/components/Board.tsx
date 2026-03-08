import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { BoardProps } from "../game/types";
import Tile3D from "./Tile3D";
import { createWoodTexture } from "./boardTextures";

interface BoardMetrics {
    tileWidth: number;
    tileHeight: number;
    tileDepth: number;
    gap: number;
    tileRun: number;
    innerWidth: number;
    innerDepth: number;
    outerWidth: number;
    outerDepth: number;
    wallThickness: number;
    floorThickness: number;
    wallHeight: number;
    separatorHeight: number;
    separatorDepth: number;
    separatorZ: number;
    tilePivotY: number;
    tilePivotZ: number;
}

const getBoardMetrics = (tileCount: number): BoardMetrics => {
    const tileWidth = tileCount >= 11 ? 0.5 : tileCount >= 9 ? 0.58 : 0.66;
    const tileHeight = tileCount >= 11 ? 0.92 : 1.0;
    const tileDepth = 0.26;
    const gap = tileCount >= 11 ? 0.028 : tileCount >= 9 ? 0.038 : 0.05;

    const tileRun = tileCount * tileWidth + (tileCount - 1) * gap;

    const wallThickness = 0.3;
    const floorThickness = 0.34;

    const innerWidth = tileRun + 0.18;
    const innerDepth = 3.05;

    const wallHeight = 0.72;

    return {
        tileWidth,
        tileHeight,
        tileDepth,
        gap,
        tileRun,
        innerWidth,
        innerDepth,
        outerWidth: innerWidth + wallThickness * 2,
        outerDepth: innerDepth + wallThickness * 2,
        wallThickness,
        floorThickness,
        wallHeight,
        separatorHeight: 0.28,
        separatorDepth: 0.12,
        separatorZ: -0.96,
        tilePivotY: 0.018,
        tilePivotZ: -(innerDepth / 2) + 0.18,
    };
};

const ResponsiveCamera = () => {
    const { camera, size } = useThree();

    useEffect(() => {
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        const aspect = size.width / Math.max(size.height, 1);
        const isLandscapePhone = aspect > 1.5 && size.height < 700;

        if (isLandscapePhone) {
            perspectiveCamera.fov = 25;
            perspectiveCamera.position.set(0, 2.7, 6.0);
            perspectiveCamera.lookAt(0, 0.18, 0.42);
        } else {
            perspectiveCamera.fov = 24;
            perspectiveCamera.position.set(0, 2.9, 6.35);
            perspectiveCamera.lookAt(0, 0.2, 0.42);
        }

        perspectiveCamera.updateProjectionMatrix();
    }, [camera, size.height, size.width]);

    return null;
};

const BoardScene = ({ tiles, onTileClick }: BoardProps) => {
    const metrics = useMemo(() => getBoardMetrics(tiles.length), [tiles.length]);

    const outerWood = useMemo(
        () =>
            createWoodTexture({
                variant: "outer",
                width: 1400,
                height: 700,
                seed: 7,
                grainDirection: "horizontal",
            }),
        [],
    );

    const wallWood = useMemo(
        () =>
            createWoodTexture({
                variant: "wall",
                width: 1200,
                height: 900,
                seed: 11,
                grainDirection: "vertical",
            }),
        [],
    );

    const floorWood = useMemo(
        () =>
            createWoodTexture({
                variant: "floor",
                width: 1600,
                height: 900,
                seed: 19,
                grainDirection: "diagonal",
            }),
        [],
    );

    const trimWood = useMemo(
        () =>
            createWoodTexture({
                variant: "trim",
                width: 1000,
                height: 400,
                seed: 29,
                grainDirection: "horizontal",
            }),
        [],
    );

    useEffect(() => {
        return () => {
            outerWood.dispose();
            wallWood.dispose();
            floorWood.dispose();
            trimWood.dispose();
        };
    }, [outerWood, wallWood, floorWood, trimWood]);

    const tileStartX = -metrics.tileRun / 2 + metrics.tileWidth / 2;

    return (
        <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 2.9, 6.35], fov: 24, near: 0.1, far: 50 }}
        >
            <ResponsiveCamera />

            <ambientLight intensity={1.04} />
            <directionalLight intensity={1.02} position={[4.8, 6.2, 4.6]} />

            <group position={[0, -0.34, 0]}>
                <mesh position={[0, -metrics.floorThickness / 2, 0]}>
                    <boxGeometry args={[metrics.outerWidth, metrics.floorThickness, metrics.outerDepth]} />
                    <meshStandardMaterial map={outerWood} roughness={0.84} metalness={0.02} />
                </mesh>

                <mesh position={[0, metrics.wallHeight / 2, metrics.innerDepth / 2 + metrics.wallThickness / 2]}>
                    <boxGeometry args={[metrics.outerWidth, metrics.wallHeight, metrics.wallThickness]} />
                    <meshStandardMaterial map={outerWood} roughness={0.8} metalness={0.02} />
                </mesh>

                <mesh position={[0, metrics.wallHeight / 2, -(metrics.innerDepth / 2 + metrics.wallThickness / 2)]}>
                    <boxGeometry args={[metrics.outerWidth, metrics.wallHeight, metrics.wallThickness]} />
                    <meshStandardMaterial map={outerWood} roughness={0.8} metalness={0.02} />
                </mesh>

                <mesh
                    position={[
                        -(metrics.innerWidth / 2 + metrics.wallThickness / 2),
                        metrics.wallHeight / 2,
                        0,
                    ]}
                    rotation={[0, 0, 0.035]}
                >
                    <boxGeometry args={[metrics.wallThickness, metrics.wallHeight, metrics.outerDepth]} />
                    <meshStandardMaterial map={wallWood} roughness={0.82} metalness={0.02} />
                </mesh>

                <mesh
                    position={[
                        metrics.innerWidth / 2 + metrics.wallThickness / 2,
                        metrics.wallHeight / 2,
                        0,
                    ]}
                    rotation={[0, 0, -0.035]}
                >
                    <boxGeometry args={[metrics.wallThickness, metrics.wallHeight, metrics.outerDepth]} />
                    <meshStandardMaterial map={wallWood} roughness={0.82} metalness={0.02} />
                </mesh>

                <mesh position={[0, metrics.separatorHeight / 2, metrics.separatorZ]}>
                    <boxGeometry args={[metrics.innerWidth - 0.08, metrics.separatorHeight, metrics.separatorDepth]} />
                    <meshStandardMaterial map={trimWood} roughness={0.76} metalness={0.02} />
                </mesh>

                <mesh position={[0, 0.01, 0]}>
                    <boxGeometry args={[metrics.innerWidth - 0.08, 0.02, metrics.innerDepth - 0.12]} />
                    <meshStandardMaterial map={floorWood} roughness={0.86} metalness={0.02} />
                </mesh>

                {tiles.map((tile, index) => {
                    const x = tileStartX + index * (metrics.tileWidth + metrics.gap);

                    return (
                        <Tile3D
                            key={tile.number}
                            tile={tile}
                            width={metrics.tileWidth}
                            height={metrics.tileHeight}
                            depth={metrics.tileDepth}
                            position={[x, metrics.tilePivotY, metrics.tilePivotZ]}
                            onClick={onTileClick}
                        />
                    );
                })}
            </group>
        </Canvas>
    );
};

const Board = ({ tiles, onTileClick }: BoardProps) => {
    return (
        <div className="board-wrap">
            <BoardScene tiles={tiles} onTileClick={onTileClick} />
        </div>
    );
};

export default Board;

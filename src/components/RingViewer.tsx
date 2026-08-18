import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import CaratsLoader from './CaratsLoader';
import { Rotate360Icon } from './icons';
import {
    OrbitControls,
    Environment,
    useGLTF,
    useEnvironment,
    MeshRefractionMaterial,
    ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { DEFAULT_MODEL_URL, DEFAULT_RING_MATERIAL, type RingMaterialPreset } from '../utils/modelVariants';

// ─── Asset Paths ───────────────────────────────────────────────────────────────
const HDR_PATH = '/hdr/brown_photostudio_02_2k.exr';

// ─── Types ──────────────────────────────────────────────────────────────────────
type GLTFResult = GLTF & {
    nodes: Record<string, THREE.Mesh>;
};

type VectorTuple = [number, number, number];

type ViewerPreset = {
    cameraPosition: VectorTuple;
    target: VectorTuple;
    modelScale: number;
    modelRotation: VectorTuple;
    autoRotateSpeed: number;
    transitionSpeed: number;
};

const STEP_VIEW_PRESETS: Record<number, ViewerPreset> = {
    1: {
        cameraPosition: [0.42, 0.08, 0.92],
        target: [0, 0.02, 0],
        modelScale: 1.92,
        modelRotation: [0.08, -0.34, 0],
        autoRotateSpeed: 0.32,
        transitionSpeed: 1.45,
    },
    2: {
        cameraPosition: [0, 0.6, 0.42],
        target: [0, 0.1, 0],
        modelScale: 1.78,
        modelRotation: [0.26, 0.04, 0],
        autoRotateSpeed: 0,
        transitionSpeed: 1.12,
    },
    3: {
        cameraPosition: [0.08, 0.12, 0.92],
        target: [0, 0.08, 0],
        modelScale: 1.92,
        modelRotation: [0.02, 0.06, 0],
        autoRotateSpeed: 0.24,
        transitionSpeed: 1.55,
    },
    4: {
        cameraPosition: [0, 0.58, 0.42],
        target: [0, 0.09, 0],
        modelScale: 1.78,
        modelRotation: [0.22, 0.08, 0],
        autoRotateSpeed: 0,
        transitionSpeed: 1.1,
    },
    5: {
        cameraPosition: [-0.22, 0.03, 0.94],
        target: [0, 0.0, 0],
        modelScale: 2.38,
        modelRotation: [0.12, 0.58, 0.01],
        autoRotateSpeed: 0.14,
        transitionSpeed: 0.95,
    },
};

const ORDER_VIEW_PRESET: ViewerPreset = {
    cameraPosition: [0.18, 0.1, 1.18],
    target: [0, 0.06, 0],
    modelScale: 1.46,
    modelRotation: [0.02, 0.12, 0],
    autoRotateSpeed: 0.28,
    transitionSpeed: 1.35,
};

const CHECKOUT_CARD_PRESET: ViewerPreset = {
    cameraPosition: [0.34, 0.27, 1],
    target: [0, 0.02, 0],
    modelScale: 3,
    modelRotation: [0.45, -0.58, -0.2],
    autoRotateSpeed: 0,
    transitionSpeed: 1.8,
};

const CAMERA_CONTROL_UNLOCK_EPSILON = 0.014;
const MODEL_TRANSFORM_EPSILON = 0.003;
const INITIAL_CAMERA_TARGET: VectorTuple = [0, 0.07, 0];
const MIN_POLAR_ANGLE = Math.PI / 6; // 30° — запрещает вид строго сверху

type RingViewerMode = "configurator" | "checkoutCard";

function getViewerPreset(viewerStep: number, isOrderView: boolean, viewerMode: RingViewerMode) {
    if (viewerMode === "checkoutCard") {
        return CHECKOUT_CARD_PRESET;
    }

    if (isOrderView) {
        return ORDER_VIEW_PRESET;
    }

    return STEP_VIEW_PRESETS[viewerStep] ?? STEP_VIEW_PRESETS[1];
}

function vectorDistanceToTupleSq(vector: THREE.Vector3, tuple: VectorTuple) {
    const dx = vector.x - tuple[0];
    const dy = vector.y - tuple[1];
    const dz = vector.z - tuple[2];

    return dx * dx + dy * dy + dz * dz;
}

function rotationDistanceToTupleSq(rotation: THREE.Euler, tuple: VectorTuple) {
    const dx = rotation.x - tuple[0];
    const dy = rotation.y - tuple[1];
    const dz = rotation.z - tuple[2];

    return dx * dx + dy * dy + dz * dz;
}

// ─── Ring (Gold) ──────────────────────────────────────────────────────────────
// Uses a fresh <mesh> with cloned geometry to avoid potential matrix/shader issues.
// Added debug sphere for comparison.
function Ring({
    node,
    envMap,
    materialPreset,
}: {
    node: THREE.Mesh;
    envMap: THREE.Texture;
    materialPreset: RingMaterialPreset;
}) {
    const meshRef = useRef<THREE.Mesh>(null!);

    const geometry = useMemo(() => {
        const geo = node.geometry.clone();
        if (!geo.attributes.normal) {
            geo.computeVertexNormals();
        }
        return geo;
    }, [node.geometry]);

    useEffect(() => {
        if (meshRef.current) {
            node.updateWorldMatrix(true, false);
            meshRef.current.matrix.copy(node.matrixWorld);
            meshRef.current.matrixAutoUpdate = false;
        }
    }, [node]);

    return (
        <group>
            {/* Real GLB Ring - using DoubleSide to ensure visibility */}
            <mesh
                ref={meshRef}
                geometry={geometry}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={materialPreset.color}
                    metalness={materialPreset.metalness}
                    roughness={materialPreset.roughness}
                    envMap={envMap}
                    envMapIntensity={materialPreset.envMapIntensity}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}

// ─── Diamond ──────────────────────────────────────────────────────────────────
export function Diamond({ node, envMap }: { node: THREE.Mesh; envMap: THREE.Texture }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    envMap = useEnvironment({ files: '/hdr/studio_03_1k.exr' });
    // ─── ПОЗИЦИОНИРОВАНИЕ ─────────────────────────────────────────────────
    useLayoutEffect(() => {

        if (!node.geometry.attributes.normal) {
            node.geometry.computeVertexNormals();
        }

        if (meshRef.current) {
            // Копируем трансформации из исходного узла
            meshRef.current.position.copy(node.position);
            meshRef.current.rotation.copy(node.rotation);
            meshRef.current.scale.copy(node.scale);
        }
    }, [node]);

    return (
        <group>
            {/* Реальный алмаз из GLB с оригинальной геометрией */}
            <mesh
                ref={meshRef}
                geometry={node.geometry}
                castShadow
            >
                <MeshRefractionMaterial
                    envMap={envMap}
                    bounces={3}
                    ior={2.42}
                    fresnel={1}
                    aberrationStrength={0.015}
                    color="white"
                    fastChroma={false}
                    toneMapped={false} // Prevents double tone mapping contrast issues
                />
            </mesh>
        </group>
    );
}

// ─── Model ──────────────────────────────────────────────────────────────────────
function Model({
    envMap,
    modelUrl,
    materialPreset,
    preset,
    presetKey,
}: {
    envMap: THREE.Texture;
    modelUrl: string;
    materialPreset: RingMaterialPreset;
    preset: ViewerPreset;
    presetKey: string;
}) {
    const { nodes } = useGLTF(modelUrl) as unknown as GLTFResult;
    const groupRef = useRef<THREE.Group>(null!);

    const isSettledRef = useRef(true);

    useLayoutEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        group.scale.setScalar(preset.modelScale);
        group.position.set(0, 0, 0);
        group.rotation.set(
            preset.modelRotation[0],
            preset.modelRotation[1],
            preset.modelRotation[2],
        );
        isSettledRef.current = true;
    }, []);

    useLayoutEffect(() => {
        isSettledRef.current = false;
    }, [presetKey]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // 2. Прибавляем к таймеру время, прошедшее с прошлого кадра
        // Preset transitions should continue from the current transform.

        // 3. ПАУЗА: Если прошло меньше 2 секунд, просто выходим из функции и ничего не анимируем
        const g = groupRef.current;
        if (isSettledRef.current) {
            return;
        }

        // 1. Zoom out — damp scale back to 1 (factor 1.2 for smooth, elegant pull-back)
        g.scale.x = THREE.MathUtils.damp(g.scale.x, preset.modelScale, preset.transitionSpeed, delta);
        g.scale.y = THREE.MathUtils.damp(g.scale.y, preset.modelScale, preset.transitionSpeed, delta);
        g.scale.z = THREE.MathUtils.damp(g.scale.z, preset.modelScale, preset.transitionSpeed, delta);

        // 2. Re-center — damp position back to origin (factor 1.2)
        g.position.x = THREE.MathUtils.damp(g.position.x, 0, preset.transitionSpeed, delta);
        g.position.y = THREE.MathUtils.damp(g.position.y, 0, preset.transitionSpeed, delta);
        g.position.z = THREE.MathUtils.damp(g.position.z, 0, preset.transitionSpeed, delta);

        // 3. Settle rotation — slower factor (0.8) for a lingering, luxurious spin
        g.rotation.x = THREE.MathUtils.damp(g.rotation.x, preset.modelRotation[0], preset.transitionSpeed, delta);
        g.rotation.y = THREE.MathUtils.damp(g.rotation.y, preset.modelRotation[1], preset.transitionSpeed, delta);
        g.rotation.z = THREE.MathUtils.damp(g.rotation.z, preset.modelRotation[2], preset.transitionSpeed, delta);

        const scaleDistance = Math.max(
            Math.abs(g.scale.x - preset.modelScale),
            Math.abs(g.scale.y - preset.modelScale),
            Math.abs(g.scale.z - preset.modelScale),
        );
        const isPositionSettled = g.position.lengthSq() < MODEL_TRANSFORM_EPSILON * MODEL_TRANSFORM_EPSILON;
        const isRotationSettled = rotationDistanceToTupleSq(g.rotation, preset.modelRotation) < MODEL_TRANSFORM_EPSILON * MODEL_TRANSFORM_EPSILON;

        if (scaleDistance < MODEL_TRANSFORM_EPSILON && isPositionSettled && isRotationSettled) {
            g.scale.setScalar(preset.modelScale);
            g.position.set(0, 0, 0);
            g.rotation.set(
                preset.modelRotation[0],
                preset.modelRotation[1],
                preset.modelRotation[2],
            );
            isSettledRef.current = true;
        }
    });

    return (
        <group
            ref={groupRef}
            dispose={null}
            // Initial "first frame" state — extreme macro diamond close-up
        >
            {Object.entries(nodes).map(([name, node]) => {
                if (!node.isMesh) return null;

                const key = name.toLowerCase();
                const isRing = key.includes('ring');
                const isDiamond = key.includes('diamond') || key.includes('gem');

                if (isRing) {
                    return <Ring key={name} node={node} envMap={envMap} materialPreset={materialPreset} />;
                }

                if (isDiamond) {
                    return <Diamond key={name} node={node} envMap={envMap} />;
                }

                return <primitive key={name} object={node} />;
            })}
        </group>
    );
}

// ─── Scene Content ──────────────────────────────────────────────────────────────
// Exact same pattern as DebugScene: useEnvironment → directly into envMap prop.
// No PMREMGenerator, no Bvh wrapper — those caused the CUBEUV macro conflict.
function CameraRig({
    preset,
    presetKey,
    controlsRef,
    isUserInteracting,
    isPresetTransitioning,
    allowInteraction,
    onPresetSettled,
}: {
    preset: ViewerPreset;
    presetKey: string;
    controlsRef: RefObject<OrbitControlsImpl | null>;
    isUserInteracting: boolean;
    isPresetTransitioning: boolean;
    allowInteraction: boolean;
    onPresetSettled: () => void;
}) {
    const isSettledRef = useRef(false);
    const animatedTargetRef = useRef(new THREE.Vector3(...INITIAL_CAMERA_TARGET));

    useLayoutEffect(() => {
        isSettledRef.current = false;
        const controls = controlsRef.current;

        if (controls) {
            controls.enabled = false;
            controls.autoRotate = false;
            animatedTargetRef.current.copy(controls.target);
        }
    }, [presetKey]);

    useFrame(({ camera }, delta) => {
        const controls = controlsRef.current;

        if (controls) {
            controls.enabled = allowInteraction && !isPresetTransitioning;
            controls.autoRotate = allowInteraction && !isPresetTransitioning && !isUserInteracting;
            controls.autoRotateSpeed = THREE.MathUtils.damp(
                controls.autoRotateSpeed,
                isPresetTransitioning || isUserInteracting || !allowInteraction ? 0 : preset.autoRotateSpeed,
                preset.transitionSpeed,
                delta,
            );
        }

        if (isUserInteracting || !isPresetTransitioning) {
            return;
        }

        if (isSettledRef.current) {
            return;
        }

        camera.position.x = THREE.MathUtils.damp(camera.position.x, preset.cameraPosition[0], preset.transitionSpeed, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, preset.cameraPosition[1], preset.transitionSpeed, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, preset.cameraPosition[2], preset.transitionSpeed, delta);

        animatedTargetRef.current.x = THREE.MathUtils.damp(animatedTargetRef.current.x, preset.target[0], preset.transitionSpeed, delta);
        animatedTargetRef.current.y = THREE.MathUtils.damp(animatedTargetRef.current.y, preset.target[1], preset.transitionSpeed, delta);
        animatedTargetRef.current.z = THREE.MathUtils.damp(animatedTargetRef.current.z, preset.target[2], preset.transitionSpeed, delta);
        camera.lookAt(animatedTargetRef.current);

        if (controls) {
            controls.target.copy(animatedTargetRef.current);
        }

        const unlockDistanceSq = CAMERA_CONTROL_UNLOCK_EPSILON * CAMERA_CONTROL_UNLOCK_EPSILON;
        const isCameraReadyForControl = vectorDistanceToTupleSq(camera.position, preset.cameraPosition) < unlockDistanceSq;
        const isTargetReadyForControl = vectorDistanceToTupleSq(animatedTargetRef.current, preset.target) < unlockDistanceSq;

        if (isCameraReadyForControl && isTargetReadyForControl) {
            camera.lookAt(animatedTargetRef.current);

            if (controls) {
                controls.target.copy(animatedTargetRef.current);
                controls.update();
                controls.enabled = allowInteraction;
                controls.autoRotate = allowInteraction && !isUserInteracting;
            }

            isSettledRef.current = true;
            onPresetSettled();
        }
    });

    return null;
}

function SceneContent({
    modelUrl,
    materialPreset,
    preset,
    presetKey,
    viewerStep,
    isUserInteracting,
    isPresetTransitioning,
    allowInteraction,
    onPresetSettled,
}: {
    modelUrl: string;
    materialPreset: RingMaterialPreset;
    preset: ViewerPreset;
    presetKey: string;
    viewerStep: number;
    isUserInteracting: boolean;
    isPresetTransitioning: boolean;
    allowInteraction: boolean;
    onPresetSettled: () => void;
}) {
    const envMap = useEnvironment({ files: HDR_PATH });
    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    return (
        <>
            <Environment map={envMap} />
            <CameraRig
                preset={preset}
                presetKey={presetKey}
                controlsRef={controlsRef}
                isUserInteracting={isUserInteracting}
                isPresetTransitioning={isPresetTransitioning}
                allowInteraction={allowInteraction}
                onPresetSettled={onPresetSettled}
            />
            <Model
                key={modelUrl}
                envMap={envMap}
                modelUrl={modelUrl}
                materialPreset={materialPreset}
                preset={preset}
                presetKey={presetKey}
            />
            <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                blur={2.5}
                far={4}
            />
            <OrbitControls
                ref={controlsRef}
                target={INITIAL_CAMERA_TARGET}
                enabled={allowInteraction && !isPresetTransitioning}
                enableZoom={false}
                enablePan={false}
                enableRotate={allowInteraction}
                minPolarAngle={MIN_POLAR_ANGLE}
                maxPolarAngle={viewerStep === 2 || viewerStep === 4 ? Math.PI * 75 / 180 : Math.PI}
                autoRotate={allowInteraction && !isPresetTransitioning && !isUserInteracting}
                autoRotateSpeed={preset.autoRotateSpeed}
                makeDefault
            />
        </>
    );
}



// ─── Public Component ───────────────────────────────────────────────────────────
type RingViewerProps = {
    modelUrl?: string;
    materialPreset?: RingMaterialPreset;
    viewerStep?: number;
    isOrderView?: boolean;
    viewerMode?: RingViewerMode;
};

export default function RingViewer({
    modelUrl = DEFAULT_MODEL_URL,
    materialPreset = DEFAULT_RING_MATERIAL,
    viewerStep = 1,
    isOrderView = false,
    viewerMode = "configurator",
}: RingViewerProps) {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [isPresetTransitioning, setIsPresetTransitioning] = useState(true);
    const resolvedModelUrl = modelUrl || DEFAULT_MODEL_URL;
    const isCheckoutCard = viewerMode === "checkoutCard";
    const allowInteraction = !isCheckoutCard;
    const preset = getViewerPreset(viewerStep, isOrderView, viewerMode);
    const presetKey = isCheckoutCard ? "checkout-card" : isOrderView ? "order" : `step-${viewerStep}`;
    const lastPresetKeyRef = useRef(presetKey);
    const isPresetKeyChanging = lastPresetKeyRef.current !== presetKey;
    const effectiveIsPresetTransitioning = isPresetTransitioning || isPresetKeyChanging;

    useLayoutEffect(() => {
        lastPresetKeyRef.current = presetKey;
        setIsPresetTransitioning(true);
        setIsUserInteracting(false);
    }, [presetKey]);

    const handleInteractionStart = () => {
        if (!allowInteraction) {
            return;
        }

        setHasInteracted(true);

        if (effectiveIsPresetTransitioning) {
            return;
        }

        setIsUserInteracting(true);
    };

    const handleInteractionEnd = () => {
        if (!allowInteraction) {
            return;
        }

        setIsUserInteracting(false);
    };

    const ignoreWheelInteraction = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div
            onPointerDownCapture={handleInteractionStart}
            onPointerUpCapture={handleInteractionEnd}
            onPointerLeave={handleInteractionEnd}
            onPointerCancelCapture={handleInteractionEnd}
            onWheelCapture={ignoreWheelInteraction}
            style={{ position: 'relative', width: '100%', height: '100%' }}
        >
            {/* CaratsLoader overlay — rendered outside Canvas so HTML elements work */}
            {!isCheckoutCard && (
                <>
                    <CaratsLoader />
                    {/* Icon and caption are separate elements (they used to be one flat
                        360.svg) so the icon sits centred over the two-line caption exactly
                        like the Figma component. */}
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute left-1/2 bottom-[6%] z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[#141414] transition-opacity duration-500 ease-out ${hasInteracted ? 'opacity-0' : 'opacity-100'
                            }`}
                    >
                        <Rotate360Icon className="w-6 h-6 [stroke-width:2] md:w-8 md:h-8 md:[stroke-width:1.5]" />
                        <span className="font-nata text-[14px] leading-[17.5px] text-center md:text-[16px] md:leading-[24px]">
                            Discover
                            <br />
                            in 360°
                        </span>
                    </div>
                </>
            )}
            <Canvas
                dpr={[1, 1.5]}
                shadows
                camera={{ position: [0.3, 0.16, 1.08], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.LinearToneMapping, powerPreference: "high-performance" }}
                style={{ width: '100%', height: '100%' }}
            >
                <Suspense fallback={null}>
                    <color attach="background" args={['white']} />
                    <SceneContent
                        modelUrl={resolvedModelUrl}
                        materialPreset={materialPreset}
                        preset={preset}
                        presetKey={presetKey}
                        viewerStep={viewerStep}
                        isUserInteracting={isUserInteracting}
                        isPresetTransitioning={effectiveIsPresetTransitioning}
                        allowInteraction={allowInteraction}
                        onPresetSettled={() => setIsPresetTransitioning(false)}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload(DEFAULT_MODEL_URL);

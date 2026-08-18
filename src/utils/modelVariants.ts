export const DEFAULT_MODEL_URL = "/3d_models/Ring_53_Claw.glb";
export const DEFAULT_PRICE = 5000;

// Hardcoded material price offsets (EUR). Change values here to adjust.
export const MATERIAL_PRICE_OFFSET: Record<string, number> = {
    '18KT White Gold': 0,
    '18KT Yellow Gold': 200,
    '18KT Rose Gold': 400,
};

export type ModelVariant = {
    cut?: string | null;
    weight?: string | null;
    setting?: string | null;
    mounting?: string | null;
    price?: number | null;
    modelUrl?: string | null;
    isDefault?: boolean | null;
};

export type ModelSelection = {
    cut: string;
    weight: string;
    setting: string;
    mounting: string;
};

export type ResolvedModelVariant = {
    modelUrl: string;
    price: number;
    variant?: ModelVariant;
};

export type RingMaterialPreset = {
    color: string;
    metalness: number;
    roughness: number;
    envMapIntensity: number;
};

const MATERIAL_PRESETS: Record<string, RingMaterialPreset> = {
    "18kt white gold": {
        color: "#C0C0C0",
        metalness: 1,
        roughness: 0.1,
        envMapIntensity: 2.5,
    },
    "18kt yellow gold": {
        color: "#CDAC68",
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 2.35,
    },
    "18kt rose gold": {
        color: "#DEB696",
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 2.35,
    },
};

export const DEFAULT_RING_MATERIAL = MATERIAL_PRESETS["18kt white gold"];

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const hasModelUrl = (variant: ModelVariant) => Boolean(variant.modelUrl);
const hasPrice = (price?: number | null): price is number => typeof price === "number" && Number.isFinite(price);

export function getMaterialPreset(material: string): RingMaterialPreset {
    return MATERIAL_PRESETS[normalize(material)] ?? DEFAULT_RING_MATERIAL;
}

export function formatPriceEUR(price = DEFAULT_PRICE) {
    return `${price} \u20AC`;
}

export function resolveModelVariant(
    variants: ModelVariant[],
    selection: ModelSelection,
    fallbackUrl = DEFAULT_MODEL_URL,
): ResolvedModelVariant {
    const selectedCut = normalize(selection.cut);
    const selectedWeight = normalize(selection.weight);
    const selectedSetting = normalize(selection.setting);
    const selectedMounting = normalize(selection.mounting);

    const usableVariants = variants.filter(hasModelUrl);

    const exactMatch = usableVariants.find((variant) =>
        normalize(variant.cut) === selectedCut
        && normalize(variant.weight) === selectedWeight
        && normalize(variant.setting) === selectedSetting
        && normalize(variant.mounting) === selectedMounting
    );

    const cutSettingMountingMatch = usableVariants.find((variant) =>
        normalize(variant.cut) === selectedCut
        && normalize(variant.setting) === selectedSetting
        && normalize(variant.mounting) === selectedMounting
    );

    const cutMountingMatch = usableVariants.find((variant) =>
        normalize(variant.cut) === selectedCut
        && normalize(variant.mounting) === selectedMounting
    );

    const cutAndSettingMatch = usableVariants.find((variant) =>
        normalize(variant.cut) === selectedCut
        && normalize(variant.setting) === selectedSetting
    );

    const cutMatch = usableVariants.find((variant) => normalize(variant.cut) === selectedCut);
    const defaultVariant = usableVariants.find((variant) => variant.isDefault);
    const resolvedVariant = exactMatch
        ?? cutSettingMountingMatch
        ?? cutMountingMatch
        ?? cutAndSettingMatch
        ?? cutMatch
        ?? defaultVariant
        ?? usableVariants[0];

    return {
        modelUrl: resolvedVariant?.modelUrl ?? fallbackUrl,
        price: hasPrice(resolvedVariant?.price) ? resolvedVariant.price : DEFAULT_PRICE,
        variant: resolvedVariant,
    };
}

export function resolveModelVariantUrl(
    variants: ModelVariant[],
    selection: ModelSelection,
    fallbackUrl = DEFAULT_MODEL_URL,
) {
    return resolveModelVariant(variants, selection, fallbackUrl).modelUrl;
}

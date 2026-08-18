import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomSummaryBar from "./RingConfigure/components/BottomSummaryBar";
import ConfiguratorStage from "./RingConfigure/components/ConfiguratorStage";
import MaterialDrawer from "./RingConfigure/components/MaterialDrawer";
import { diamondCutsData, materialsData, STEPS } from "./RingConfigure/data";
import { sanityClient } from "../sanityClient";
import { formatDiamondSummary } from "../utils/formatDiamondSummary";
import { formatPriceEUR, getMaterialPreset, MATERIAL_PRICE_OFFSET, resolveModelVariant, type ModelVariant } from "../utils/modelVariants";

export default function RingConfigure() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAppearing, setIsAppearing] = useState(false);
    const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

    const slugToIndex = Object.fromEntries(STEPS.map((s, i) => [s.slug, i + 1]));
    const indexToSlug = Object.fromEntries(STEPS.map((s, i) => [i + 1, s.slug]));

    const rawStep = searchParams.get('step');
    const isOrderView = rawStep === 'order';
    const currentStep = isOrderView ? STEPS.length : (slugToIndex[rawStep ?? ''] ?? 1);

    const [selectedMaterial, setSelectedMaterial] = useState("18KT White Gold");
    const [selectedCut, setSelectedCut] = useState("Brilliant Cut");
    const [selectedWeight, setSelectedWeight] = useState("1.00ct");
    const [selectedSetting, setSelectedSetting] = useState("Classic Band");
    const [selectedMounting, setSelectedMounting] = useState("Classic");
    const [modelVariants, setModelVariants] = useState<ModelVariant[]>([]);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState<"material" | "cut">("material");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);
        const handleGlobalExit = () => setExitDirection("right");

        document.addEventListener("trigger-page-exit", handleGlobalExit);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("trigger-page-exit", handleGlobalExit);
        };
    }, []);

    useEffect(() => {
        let isCancelled = false;

        sanityClient
            .fetch<{ modelVariants?: ModelVariant[] }>(`
                *[_type == "product"][0]{
                    "modelVariants": modelVariants[]{
                        cut,
                        weight,
                        setting,
                        mounting,
                        price,
                        isDefault,
                        "modelUrl": modelFile.asset->url
                    }
                }
            `)
            .then((data) => {
                if (!isCancelled) {
                    setModelVariants(data?.modelVariants ?? []);
                }
            })
            .catch((error) => {
                console.error("Error fetching 3D model variants:", error);
                if (!isCancelled) {
                    setModelVariants([]);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    const handleNavigateCheckout = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setExitDirection("left");
        setTimeout(() => {
            navigate("/checkout", {
                state: {
                    material: selectedMaterial,
                    cut: selectedCut,
                    weight: selectedWeight,
                    setting: selectedSetting,
                    mounting: selectedMounting,
                    modelUrl,
                    price,
                },
            });
        }, 200);
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setSearchParams({ step: indexToSlug[currentStep + 1] });
        } else {
            setSearchParams({ step: 'order' });
        }
    };

    const handleBack = () => {
        if (isOrderView) {
            handleBackToConfigure();
        } else if (currentStep > 1) {
            setSearchParams({ step: indexToSlug[currentStep - 1] });
        }
    };

    const handleBackToConfigure = () => {
        setSearchParams({ step: indexToSlug[STEPS.length] });
        setIsExpanded(false);
    };

    const getSelection = (stepId: number): string => {
        switch (stepId) {
            case 1:
                return selectedMaterial;
            case 2:
                return selectedCut;
            case 3:
                return selectedWeight;
            case 4:
                return selectedSetting;
            case 5:
                return selectedMounting;
            default:
                return "";
        }
    };

    const setSelection = (stepId: number, value: string) => {
        switch (stepId) {
            case 1:
                setSelectedMaterial(value);
                break;
            case 2:
                setSelectedCut(value);
                break;
            case 3:
                setSelectedWeight(value);
                break;
            case 4:
                setSelectedSetting(value);
                break;
            case 5:
                setSelectedMounting(value);
                break;
        }
    };

    const drawerItems = drawerType === "cut" ? diamondCutsData : materialsData;

    const openDrawer = () => {
        const nextDrawerType = currentStep === 2 ? "cut" : "material";
        const items = nextDrawerType === "cut" ? diamondCutsData : materialsData;
        const selectedValue = nextDrawerType === "cut" ? selectedCut : selectedMaterial;
        const selectedIndex = items.findIndex((item) => item.name === selectedValue);
        setDrawerType(nextDrawerType);
        setCurrentSlide(selectedIndex >= 0 ? selectedIndex : 0);
        setIsTextExpanded(false);
        setIsDrawerOpen(true);
    };

    const handleApplyDrawer = () => {
        const selectedItem = drawerItems[currentSlide];
        if (drawerType === "cut") {
            setSelectedCut(selectedItem.name);
        } else {
            setSelectedMaterial(selectedItem.name);
        }
        setIsDrawerOpen(false);
    };

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0].clientX;
        touchEndX.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
        touchEndX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (isTextExpanded) return;

        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) <= 50) return;

        if (diff > 0 && currentSlide < drawerItems.length - 1) {
            setCurrentSlide((slide) => slide + 1);
            setIsTextExpanded(false);
        }

        if (diff < 0 && currentSlide > 0) {
            setCurrentSlide((slide) => slide - 1);
            setIsTextExpanded(false);
        }
    };

    const step = STEPS[currentStep - 1];
    const diamondSummary = formatDiamondSummary(selectedWeight, selectedCut);
    const shortDiamondSummary = `${selectedCut} - ${selectedWeight} G/VS`;
    const inlineSummary = `${selectedMaterial} - ${shortDiamondSummary} - ${selectedMounting} Setting - ${selectedSetting}`;
    const resolvedModel = resolveModelVariant(modelVariants, {
        cut: selectedCut,
        weight: selectedWeight,
        setting: selectedSetting,
        mounting: selectedMounting,
    });
    const modelUrl = resolvedModel.modelUrl;
    const price = resolvedModel.price + (MATERIAL_PRICE_OFFSET[selectedMaterial] ?? 0);
    const priceLabel = formatPriceEUR(price);
    const materialPreset = getMaterialPreset(selectedMaterial);

    return (
        <>
            <div
                className={`w-full h-[calc(100dvh-107px)] md:h-[calc(100dvh-147px)] desktop:h-[calc(100dvh-113px)] overflow-hidden flex flex-col transition-transform duration-500 ease-out ${exitDirection === "left"
                    ? "-translate-x-[100vw]"
                    : exitDirection === "right"
                        ? "translate-x-[100vw]"
                        : isAppearing
                            ? "translate-x-0"
                            : "translate-x-[100vw]"
                    }`}
            >
                {/* MAIN PAGE LAYOUT */}
                <ConfiguratorStage
                    currentStep={currentStep}
                    step={step}
                    activeOption={getSelection(step.id)}
                    isOrderView={isOrderView}
                    selectedMaterial={selectedMaterial}
                    diamondSummary={diamondSummary}
                    selectedSetting={selectedSetting}
                    selectedMounting={selectedMounting}
                    priceLabel={priceLabel}
                    modelUrl={modelUrl}
                    materialPreset={materialPreset}
                    onSelectOption={(option) => setSelection(step.id, option)}
                    onOpenDrawer={openDrawer}
                    onNext={handleNext}
                    onBack={handleBack}
                    onBackToConfigure={handleBackToConfigure}
                    onCheckout={handleNavigateCheckout}
                />

                <BottomSummaryBar
                    isExpanded={isExpanded}
                    isOrderView={isOrderView}
                    selectedMaterial={selectedMaterial}
                    shortDiamondSummary={shortDiamondSummary}
                    selectedSetting={selectedSetting}
                    selectedMounting={selectedMounting}
                    inlineSummary={inlineSummary}
                    priceLabel={priceLabel}
                    onToggleExpanded={() => setIsExpanded((expanded) => !expanded)}
                    onDiscover={() => setSearchParams({ step: 'order' })}
                    onBackToConfigure={handleBackToConfigure}
                    onCheckout={handleNavigateCheckout}
                />
            </div>

            <MaterialDrawer
                isOpen={isDrawerOpen}
                items={drawerItems}
                currentSlide={currentSlide}
                isTextExpanded={isTextExpanded}
                onClose={() => setIsDrawerOpen(false)}
                onApply={handleApplyDrawer}
                onSlideChange={setCurrentSlide}
                onPreviousSlide={() => setCurrentSlide((slide) => Math.max(0, slide - 1))}
                onNextSlide={() => setCurrentSlide((slide) => Math.min(drawerItems.length - 1, slide + 1))}
                onToggleTextExpanded={() => setIsTextExpanded((expanded) => !expanded)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />
        </>
    );
}

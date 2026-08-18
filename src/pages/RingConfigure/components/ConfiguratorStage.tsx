import type { MouseEvent } from "react";
import RingViewer from "../../../components/RingViewer";
import type { RingMaterialPreset } from "../../../utils/modelVariants";
import type { Step } from "../data";
import { AnimatedStepBackButton } from "./BackButton";
import OrderActionRow from "./OrderActionRow";
import StepContent from "./StepContent";

type ConfiguratorStageProps = {
    currentStep: number;
    step: Step;
    activeOption: string;
    isOrderView: boolean;
    selectedMaterial: string;
    diamondSummary: string;
    selectedSetting: string;
    selectedMounting: string;
    priceLabel: string;
    modelUrl: string;
    materialPreset: RingMaterialPreset;
    onSelectOption: (option: string) => void;
    onOpenDrawer: () => void;
    onNext: () => void;
    onBack: () => void;
    onBackToConfigure: () => void;
    onCheckout: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function ConfiguratorStage({
    currentStep,
    step,
    activeOption,
    isOrderView,
    selectedMaterial,
    diamondSummary,
    selectedSetting,
    selectedMounting,
    priceLabel,
    modelUrl,
    materialPreset,
    onSelectOption,
    onOpenDrawer,
    onNext,
    onBack,
    onBackToConfigure,
    onCheckout,
}: ConfiguratorStageProps) {
    return (
        <div className="flex-1 min-h-0 w-full px-6 md:px-[52px] flex flex-col overflow-y-auto desktop:overflow-hidden desktop:px-0">
            <div className="desktop:flex-1 desktop:min-h-0 desktop:grid desktop:grid-cols-2 desktop:max-w-[1440px] desktop:w-full desktop:mx-auto">
                <div className="md:h-full min-h-0 flex flex-col justify-between desktop:justify-center desktop:flex desktop:flex-col desktop:h-full desktop:min-h-0 desktop:border-[#e5e5e5] desktop:overflow-hidden">
                    <div className="flex w-full shrink-0 justify-center pt-2 md:pt-4 desktop:hidden">
                        <div
                            className="max-w-[750px]"
                            style={{ width: "min(100%, 50dvh, var(--viewer-cap))", aspectRatio: "1 / 1" }}
                        >
                            <RingViewer
                                modelUrl={modelUrl}
                                materialPreset={materialPreset}
                                viewerStep={currentStep}
                                isOrderView={isOrderView}
                            />
                        </div>
                    </div>

                    <div className="mt-3 md:mt-6 desktop:mt-0 desktop:flex-1 desktop:flex desktop:flex-col desktop:justify-center desktop:px-[80px] desktop:relative desktop:overflow-visible desktop:max-h-[560px]">
                        <div className={`desktop:absolute desktop:inset-0 desktop:flex desktop:flex-col desktop:justify-center desktop:px-[80px] desktop:transition-all desktop:duration-500 desktop:ease-in-out ${isOrderView ? "desktop:opacity-0 desktop:translate-y-4 desktop:pointer-events-none" : "desktop:opacity-100 desktop:translate-y-0 desktop:pointer-events-auto"}`}>
                            <div
                                className={`grid ease-in-out ${isOrderView ? "grid-rows-[0fr] duration-300 delay-200" : "grid-rows-[1fr] duration-300 delay-0"} md:mt-auto desktop:mt-0 desktop:mb-0 desktop:overflow-visible desktop:grid-rows-[1fr]`}
                                style={{ transition: "grid-template-rows 300ms ease-in-out" }}
                            >
                                <div className="overflow-hidden desktop:overflow-visible">
                                    <div className={`${isOrderView ? "opacity-0 translate-y-4 pointer-events-none duration-200 delay-0" : "opacity-100 translate-y-0 pointer-events-auto duration-300 delay-250"} transition-[opacity,transform] ease-in-out desktop:opacity-100 desktop:translate-y-0 desktop:pointer-events-auto desktop:flex desktop:flex-col desktop:gap-[clamp(80px,16vh,240px)]`}>
                                        <p className="hidden desktop:block font-orbitron text-[#141414] text-[32px] leading-tight">Your Creation</p>

                                        <StepContent
                                            step={step}
                                            activeOption={activeOption}
                                            onSelect={onSelectOption}
                                            onOpenDrawer={onOpenDrawer}
                                        />

                                        <div className="mt-5 mb-1 grid grid-cols-[1fr_auto_1fr] items-center gap-0 desktop:hidden justify-center">
                                            <AnimatedStepBackButton
                                                isVisible={currentStep > 1}
                                                onClick={onBack}
                                                className="ms-auto me-4"
                                            />
                                            <button
                                                onClick={onNext}
                                                className="w-fit font-semibold bg-[#141414] text-[#ffffff] font-nata text-[16px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-[#ffffff] hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300 flex items-center gap-2 group"
                                            >
                                                Next
                                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M0.707031 12.707C3.90703 9.50703 6.70703 6.70703 6.70703 6.70703C3.50703 3.50703 0.707031 0.707031 0.707031 0.707031" strokeWidth="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`desktop:absolute desktop:inset-0 desktop:flex desktop:flex-col desktop:justify-center desktop:px-[80px] desktop:gap-5 desktop:transition-all desktop:duration-500 desktop:ease-in-out ${isOrderView ? "desktop:opacity-100 desktop:translate-y-0 desktop:pointer-events-auto" : "desktop:opacity-0 desktop:translate-y-4 desktop:pointer-events-none"}`}>
                            <p className="hidden desktop:block font-orbitron text-[#141414] text-[32px] leading-tight">Diamond Solitaire Ring</p>
                            <div className="hidden desktop:flex desktop:flex-col desktop:gap-1">
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{selectedMaterial}</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{diamondSummary}</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{selectedMounting} Setting</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{selectedSetting}</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">Ref: 123123</span>
                            </div>
                            <p className="hidden desktop:block font-nata font-bold text-[#141414] text-[16px]">{priceLabel}</p>
                        </div>
                    </div>
                </div>

                <div className="hidden desktop:flex desktop:items-center desktop:justify-center desktop:h-full desktop:min-h-0 desktop:p-[clamp(24px,4vh,72px)]">
                    <div
                        className="aspect-square"
                        style={{ width: "min(100%, calc(100dvh - 280px), 720px)" }}
                    >
                        <RingViewer
                            modelUrl={modelUrl}
                            materialPreset={materialPreset}
                            viewerStep={currentStep}
                            isOrderView={isOrderView}
                        />
                    </div>
                </div>
            </div>

            <div className="hidden desktop:max-w-[1440px] desktop:mx-auto desktop:block desktop:relative desktop:overflow-hidden desktop:border-[#e5e5e5] desktop:shrink-0 desktop:mb-[50px]">
                <div className={`desktop:grid desktop:grid-cols-[1fr_auto_1fr] desktop:items-center desktop:gap-0 desktop:px-[80px] desktop:py-6 desktop:transition-all desktop:duration-500 desktop:ease-in-out ${isOrderView ? "desktop:opacity-0 desktop:-translate-x-full desktop:pointer-events-none desktop:absolute desktop:inset-0" : "desktop:opacity-100 desktop:translate-x-0 desktop:pointer-events-auto desktop:relative"}`}>
                    <AnimatedStepBackButton isVisible={currentStep > 1} onClick={onBack} />
                    <button
                        onClick={onNext}
                        className="w-fit font-semibold bg-[#141414] text-[#ffffff] font-nata text-[16px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-[#ffffff] hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300 ml-3 flex items-center gap-2 group"
                    >
                        Next
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M0.707031 12.707C3.90703 9.50703 6.70703 6.70703 6.70703 6.70703C3.50703 3.50703 0.707031 0.707031 0.707031 0.707031" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <div className={`desktop:flex desktop:flex-col desktop:gap-3 desktop:px-[80px] desktop:py-6 desktop:transition-all desktop:duration-500 desktop:ease-in-out ${isOrderView ? "desktop:opacity-100 desktop:translate-x-0 desktop:pointer-events-auto desktop:relative" : "desktop:opacity-0 desktop:translate-x-full desktop:pointer-events-none desktop:absolute desktop:inset-0"}`}>
                    <OrderActionRow onBack={onBackToConfigure} onCheckout={onCheckout} />
                </div>
            </div>

            <div className={`hidden desktop:px-[80px] desktop:mb-6 desktop:max-w-[1440px] desktop:w-full desktop:transition-all desktop:duration-500 desktop:ease-in-out desktop:mx-auto desktop:shrink-0 ${!isOrderView ? "desktop:hidden" : "desktop:flex desktop:flex-col desktop:opacity-100 desktop:pointer-events-auto desktop:translate-y-0"}`}>
                <span className="font-nata text-[#141414] text-[16px]">Didn't find what you were looking for?</span>
                <span className="font-nata text-[#141414] text-[16px]">Contact us: <span className="underline">info@e-mail</span></span>
            </div>
        </div>
    );
}

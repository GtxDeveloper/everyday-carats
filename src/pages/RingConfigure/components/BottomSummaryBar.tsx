import type { MouseEvent } from "react";
import AnimatedLink from "../../../components/AnimatedLink";
import OrderActionRow from "./OrderActionRow";

type BottomSummaryBarProps = {
    isExpanded: boolean;
    isOrderView: boolean;
    selectedMaterial: string;
    shortDiamondSummary: string;
    selectedSetting: string;
    selectedMounting: string;
    inlineSummary: string;
    priceLabel: string;
    onToggleExpanded: () => void;
    onDiscover: () => void;
    onBackToConfigure: () => void;
    onCheckout: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function BottomSummaryBar({
    isExpanded,
    isOrderView,
    selectedMaterial,
    shortDiamondSummary,
    selectedSetting,
    selectedMounting,
    inlineSummary,
    priceLabel,
    onToggleExpanded,
    onDiscover,
    onBackToConfigure,
    onCheckout,
}: BottomSummaryBarProps) {
    return (
        <div
            className={`shrink-0 w-full z-30 bg-[#FAFAFA] pt-0 md:pt-2 pb-6 md:py-6 transition-all duration-500 ease-in-out ${isOrderView
                ? "desktop:opacity-0 desktop:pointer-events-none desktop:translate-y-0 desktop:p-0 desktop:m-0"
                : "desktop:opacity-100 desktop:pointer-events-auto desktop:translate-y-0"
                }`}
        >
            <div className="w-full desktop:max-w-[1440px] desktop:mx-auto px-6 md:px-[52px] flex flex-col">
                <div className={`flex justify-center w-full mb-0 md:mb-4 ${!isOrderView ? "md:hidden" : "desktop:hidden"}`}>
                    <button onClick={onToggleExpanded} className="relative w-10 h-6 flex items-center justify-center cursor-pointer group">
                        <div className={`absolute flex gap-[4px] transition-all duration-500 ease-in-out ${isExpanded ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0 group-hover:opacity-70"}`}>
                            <div className="w-[3px] h-[3px] bg-[#141414]" />
                            <div className="w-[3px] h-[3px] bg-[#141414]" />
                            <div className="w-[3px] h-[3px] bg-[#141414]" />
                        </div>
                        <div className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out ${!isExpanded ? "opacity-0 scale-50 -rotate-90" : "opacity-100 scale-100 rotate-0 group-hover:opacity-70"}`}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 1L1 13M1 1L13 13" className="stroke-[#141414]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>
                </div>

                <div className={`flex items-center justify-between w-full transition-all duration-700 ease-in-out ${isOrderView ? "flex-col items-center" : "flex-row"}`}>
                    <div className={`flex flex-col transition-all duration-500 ease-in-out ${isOrderView ? "items-start w-full" : "w-full"}`}>
                        <span className={`w-full text-[#141414] transition-all duration-500 ease-in-out ${isOrderView ? "text-[22px] font-orbitron md:text-[32px] desktop:text-[16px] desktop:font-nata" : "text-[16px] font-nata"}`}>
                            Diamond Solitaire Ring
                        </span>
                        {!isOrderView && (
                            <span className="hidden md:block font-nata text-[#737373] text-[14px] leading-relaxed mt-0.5">
                                {inlineSummary}
                            </span>
                        )}
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden flex flex-col gap-0 py-0">
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{selectedMaterial}</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{shortDiamondSummary}</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{selectedMounting} Setting</span>
                                <span className="font-nata text-[#737373] text-[14px] leading-relaxed">{selectedSetting}</span>
                                <span className={`font-nata text-[#737373] text-[14px] leading-relaxed ${isOrderView ? "block" : "hidden"}`}>Ref: 123123</span>
                            </div>
                        </div>
                        <span className={`font-nata w-full text-[#141414] text-[16px] mt-0 transition-all duration-500 ease-in-out ${isOrderView ? "text-start font-semibold md:font-bold" : ""}`}>{priceLabel}</span>
                        <div className={`grid transition-[grid-template-rows] mt-4 duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} ${isOrderView ? "block" : "hidden"}`}>
                            <div className="overflow-hidden flex flex-col gap-0 py-0">
                                <span className="font-nata text-[#141414] text-[14px] leading-relaxed">Didn't find what you were looking for?</span>
                                <span className="font-nata text-[#141414] text-[14px] leading-relaxed">Contact us: <span className="underline">info@e-mail</span></span>
                            </div>
                        </div>
                    </div>
                    {!isOrderView && (
                        <AnimatedLink style={{ whiteSpace: "nowrap", display: "flex" }} as="button" onClick={onDiscover} className="group relative flex flex-row flex-nowrap items-center gap-1 font-nata font-semibold text-[#141414] text-[16px] tracking-[0.04em] uppercase border-transparent hover:border-[#141414] transition-all duration-300 whitespace-nowrap ml-4 pb-1">
                            DISCOVER
                            <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="stroke-[#141414] transition-colors duration-300" d="M10 4V16" strokeWidth="2" />
                                <path className="stroke-[#141414] transition-colors duration-300" d="M4 10H16" strokeWidth="2" />
                            </svg>
                        </AnimatedLink>
                    )}
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${isOrderView ? "grid-rows-[1fr] opacity-100 pt-6 desktop:p-0 desktop:grid-rows-[0fr] desktop:opacity-0" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden flex flex-col gap-4">
                        <OrderActionRow onBack={onBackToConfigure} onCheckout={onCheckout} />
                    </div>
                </div>
            </div>
        </div>
    );
}

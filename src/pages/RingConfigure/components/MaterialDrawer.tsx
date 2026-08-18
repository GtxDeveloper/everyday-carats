import type { TouchEvent } from "react";
import AnimatedLink from "../../../components/AnimatedLink";
import type { DrawerInfo } from "../data";

type MaterialDrawerProps = {
    isOpen: boolean;
    items: readonly DrawerInfo[];
    currentSlide: number;
    isTextExpanded: boolean;
    onClose: () => void;
    onApply: () => void;
    applyLabel?: string;
    onSlideChange: (slide: number) => void;
    onPreviousSlide: () => void;
    onNextSlide: () => void;
    onToggleTextExpanded: () => void;
    onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
    onTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
    onTouchEnd: () => void;
};

export default function MaterialDrawer({
    isOpen,
    items,
    currentSlide,
    isTextExpanded,
    onClose,
    onApply,
    applyLabel = "APPLY",
    onSlideChange,
    onPreviousSlide,
    onNextSlide,
    onToggleTextExpanded,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: MaterialDrawerProps) {
    return (
        <div
            className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
                }`}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-2 md:right-6 md:top-6 group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center z-110 cursor-pointer"
            >
                <svg
                    className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M3.75 3.75L20.25 20.25M20.25 3.75L3.75 20.25" stroke="#737373" strokeWidth="2" />
                </svg>
            </button>

            <div
                className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="grid grid-cols-1 grid-rows-1 w-full min-h-full">
                    {items.map((item, index) => {
                        const isActive = index === currentSlide;
                        const offset = (index - currentSlide) * 100;
                        const image = "image" in item ? item.image : undefined;
                        const placeholder = "placeholder" in item ? item.placeholder : item.name;

                        return (
                            <div
                                key={item.name}
                                className="col-start-1 row-start-1 flex flex-col desktop:flex-row-reverse desktop:justify-center w-full px-6 md:px-[52px] pt-6 md:pt-[55px]"
                                style={{
                                    pointerEvents: isActive ? "auto" : "none",
                                    zIndex: isActive ? 10 : 0,
                                }}
                            >
                                <div className="desktop:max-w-[1440px] desktop:w-full desktop:flex desktop:flex-row-reverse desktop:justify-between desktop:px-[100px] desktop:mx-auto">
                                    <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out shrink-0 ${isTextExpanded ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                                        }`}>
                                        <div className="overflow-hidden desktop:overflow-visible flex flex-col desktop:justify-center w-full">
                                            <div
                                                className="w-[85%] md:w-[65%] desktop:w-full aspect-square overflow-hidden shrink-0 md:max-w-[750px] max-h-[524px] transition-transform duration-500 ease-in-out"
                                                style={{ transform: `translateX(${offset}vw)` }}
                                            >
                                                    {image ? (
                                                        <img loading="lazy" src={image} alt={item.name} className="h-full aspect-square object-cover" />
                                                    ) : (
                                                        <div className="flex h-full aspect-square items-center justify-center bg-[#F5F5F5] px-6 text-center font-orbitron text-[22px] leading-snug text-[#141414]">
                                                            {placeholder}
                                                        </div>
                                                    )}
                                            </div>
                                            <h3
                                                className="desktop:hidden font-nata text-[#141414] text-[16px] mt-3 md:mt-8 mb-1 shrink-0 transition-opacity duration-500 ease-in-out"
                                                style={{ opacity: isActive ? 1 : 0 }}
                                            >
                                                {item.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div
                                        className="desktop:max-w-[613px] desktop:flex desktop:flex-col desktop:justify-center transition-opacity duration-500 ease-in-out"
                                        style={{ opacity: isActive ? 1 : 0 }}
                                    >
                                        <h3 className="desktop:block hidden font-nata text-[#141414] text-[16px] mt-3 md:mt-8 mb-1 shrink-0">{item.name}</h3>
                                        <p className="font-orbitron text-[22px] text-[#141414] leading-snug mt-1 mb-2 shrink-0">{item.slogan}</p>

                                        {item.text?.[0] && (
                                            <p className={`font-nata text-[#737373] text-[16px] leading-relaxed mb-2 shrink-0 ${isTextExpanded ? "" : "line-clamp-1"
                                                } md:line-clamp-none`}>
                                                {item.text[0]}
                                            </p>
                                        )}

                                        {item.text?.[1] && (
                                            <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out mb-2 shrink-0 ${isTextExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                                } md:grid-rows-[1fr]`}>
                                                <div className="overflow-hidden">
                                                    <p className="font-nata text-[#737373] text-[16px] leading-relaxed pt-2">
                                                        {item.text[1]}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="md:hidden w-full flex justify-center mt-1 shrink-0 transition-opacity duration-500 ease-in-out"
                                    style={{ opacity: isActive ? 1 : 0 }}
                                >
                                    <AnimatedLink
                                        as="button"
                                        onClick={onToggleTextExpanded}
                                        className="w-fit font-nata font-semibold text-[#141414] text-[14px] tracking-[0.12em] uppercase border-b border-[#141414] pb-px hover:opacity-60 transition-opacity duration-300"
                                    >
                                        {isTextExpanded ? "MINIMIZE TEXT" : "READ MORE"}
                                    </AnimatedLink>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="shrink-0 px-6 pb-6 md:pb-20 flex flex-col gap-4">
                <button
                    onClick={onApply}
                    className="w-fit mx-auto font-semibold bg-[#141414] text-[#ffffff] font-nata text-[16px] tracking-[0.16em] uppercase py-4 px-[40px] hover:bg-[#ffffff] hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300 flex items-center justify-center"
                >
                    {applyLabel}
                </button>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={onPreviousSlide}
                        disabled={currentSlide === 0}
                        className="w-9 h-9 flex items-center justify-center transition-opacity duration-300 disabled:opacity-0 desktop:absolute desktop:left-20 desktop:top-1/2 z-10 cursor-pointer"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.25 22.5C11.65 16.9 6.75 12 6.75 12C12.35 6.4 17.25 1.5 17.25 1.5" stroke="#737373" strokeWidth="2" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2 desktop:gap-4 desktop:mt-10 z-10">
                        {items.map((item, index) => (
                            <button
                                key={item.name}
                                onClick={() => onSlideChange(index)}
                                className="p-2 -m-2 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div
                                    className="transition-all duration-300 ease-in-out rounded-full"
                                    style={{
                                        width: index === currentSlide ? "96px" : "32px",
                                        height: index === currentSlide ? "2px" : "1px",
                                        backgroundColor: index === currentSlide ? "#737373" : "#D9D9D9",
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onNextSlide}
                        disabled={currentSlide === items.length - 1}
                        className="w-9 h-9 flex items-center justify-center transition-opacity duration-300 disabled:opacity-0 desktop:absolute desktop:right-20 desktop:top-1/2 z-10 cursor-pointer"
                    >
                        <svg width="13" height="23" viewBox="0 0 13 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.707031 21.707C6.30703 16.107 11.207 11.207 11.207 11.207C5.60703 5.60703 0.707031 0.707031 0.707031 0.707031" stroke="#737373" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

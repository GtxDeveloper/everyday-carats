import { useCallback, useEffect, useState } from "react";
import type { Step } from "../data";
import AnimatedWidthContent from "./AnimatedWidthContent";
import AnimatedWidthLink from "./AnimatedWidthLink";

type StepContentProps = {
    step: Step;
    activeOption: string;
    onSelect: (option: string) => void;
    onOpenDrawer: () => void;
};

export default function StepContent({
    step,
    activeOption,
    onSelect,
    onOpenDrawer,
}: StepContentProps) {
    const [visible, setVisible] = useState(false);
    const [optionWidths, setOptionWidths] = useState<number[]>([]);
    const [titleWidth, setTitleWidth] = useState<number>();

    const handleTitleMeasure = useCallback((width: number) => {
        setTitleWidth((currentWidth) => currentWidth === width ? currentWidth : width);
    }, []);

    const handleOptionMeasure = useCallback((index: number, width: number) => {
        setOptionWidths((currentWidths) => {
            if (currentWidths[index] === width) return currentWidths;

            const nextWidths = [...currentWidths];
            nextWidths[index] = width;
            return nextWidths;
        });
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div>
            <div
                className={`flex items-center justify-start gap-2 transition-[opacity,transform] duration-400 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                    }`}
            >
                <AnimatedWidthContent
                    key={step.title}
                    initialWidth={titleWidth}
                    onMeasure={handleTitleMeasure}
                >
                    <h2 className="text-[16px] font-semibold font-nata uppercase shrink-0">{step.title}</h2>
                </AnimatedWidthContent>
                {step.hasInfo && (
                    <button onClick={onOpenDrawer} className="cursor-pointer group rounded-full border border-transparent hover:border-[#141414] transition-colors duration-300">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="stroke-[#141414] group-hover:stroke-white transition-colors duration-300" d="M10 5.75C12.3472 5.75 14.25 7.65279 14.25 10C14.25 12.3472 12.3472 14.25 10 14.25C7.65279 14.25 5.75 12.3472 5.75 10C5.75 7.65279 7.65279 5.75 10 5.75Z" strokeWidth="9.5" strokeMiterlimit="10" />
                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M9.99987 13.9749V8.4082H8.4082" strokeWidth="1.5" strokeMiterlimit="10" />
                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M8.4082 13.9751H11.5915" strokeWidth="2" strokeMiterlimit="10" />
                            <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M9.2085 5.52002H10.7918" strokeWidth="2" strokeMiterlimit="10" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="mt-4">
                {/* The bordered options can outgrow a 375px screen, so the row scrolls
                    horizontally on mobile (scrollbar hidden) — on wider screens it fits
                    and never scrolls. */}
                <div
                    className={`flex gap-4 md:gap-6 origin-left overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-[opacity,transform] duration-500 ease-out ${visible ? "opacity-100 scale-x-100 scale-y-100" : "opacity-0 scale-x-75 scale-y-75"
                        }`}
                >
                    {step.options.map((option, index) => (
                        <AnimatedWidthLink
                            key={option}
                            option={option}
                            activeOption={activeOption}
                            onSelect={onSelect}
                            initialWidth={optionWidths[index]}
                            onMeasure={(width) => handleOptionMeasure(index, width)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

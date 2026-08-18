import { useEffect, useRef, useState } from "react";

type AnimatedWidthLinkProps = {
    option: string;
    activeOption: string;
    onSelect: (option: string) => void;
    className?: string;
    initialWidth?: number;
    onMeasure?: (width: number) => void;
};

export default function AnimatedWidthLink({
    option,
    activeOption,
    onSelect,
    className = "",
    initialWidth,
    onMeasure,
}: AnimatedWidthLinkProps) {
    const [width, setWidth] = useState<number | undefined>(initialWidth);
    const [opacity, setOpacity] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const nextWidth = Math.ceil(entries[0].contentRect.width);

            requestAnimationFrame(() => {
                setWidth(nextWidth);
                setOpacity(1);
            });

            onMeasure?.(nextWidth);
        });

        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, [option, onMeasure]);

    const isActive = activeOption === option;

    return (
        <div
            className={`shrink-0 overflow-hidden transition-[width,opacity] duration-700 ease-out ${className}`}
            style={{ width: width !== undefined ? width : 0, opacity }}
        >
            <div ref={contentRef} className="w-max">
                {/* Bordered box instead of the old underlined text link: the active
                    option keeps a #141414 outline, the rest sit on #D9D9D9 and darken
                    on hover. Text colour stays #141414 in both states. */}
                <button
                    type="button"
                    onClick={() => onSelect(option)}
                    className={`block w-max cursor-pointer whitespace-nowrap border font-nata text-[16px] leading-[24px] text-[#141414] px-2 py-1 md:px-4 md:py-2 transition-colors duration-300 ${isActive ? "border-[#141414]" : "border-[#D9D9D9] hover:border-[#141414]"
                        }`}
                >
                    {option.startsWith("18KT ") ? (
                        <>
                            <span className="md:hidden">{option.slice(5)}</span>
                            <span className="hidden md:inline">{option}</span>
                        </>
                    ) : (
                        option
                    )}
                </button>
            </div>
        </div>
    );
}

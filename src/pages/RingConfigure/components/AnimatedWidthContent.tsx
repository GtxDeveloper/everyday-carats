import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimatedWidthContentProps = {
    children: ReactNode;
    className?: string;
    initialWidth?: number;
    onMeasure?: (width: number) => void;
};

export default function AnimatedWidthContent({
    children,
    className = "",
    initialWidth,
    onMeasure,
}: AnimatedWidthContentProps) {
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
    }, [onMeasure]);

    return (
        <div
            className={`overflow-hidden transition-[width,opacity] duration-700 ease-out ${className}`}
            style={{ width: width !== undefined ? width : 0, opacity }}
        >
            <div ref={contentRef} className="w-max">
                {children}
            </div>
        </div>
    );
}

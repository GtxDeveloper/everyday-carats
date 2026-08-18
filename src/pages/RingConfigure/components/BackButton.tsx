type BackButtonProps = {
    onClick: () => void;
    className?: string;
};

export function BackButton({ onClick, className = "" }: BackButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`w-fit font-semibold bg-[#141414] text-[#ffffff] font-nata text-[16px] tracking-[0.16em] uppercase px-[21.5px] py-[19px] hover:bg-[#ffffff] hover:text-[#141414] hover:ring-1 hover:ring-inset hover:ring-[#141414] transition-all duration-300 flex items-center justify-center gap-2 group ${className}`}
        >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke-[#F5F5F5] group-hover:stroke-[#141414] transition-colors duration-300" d="M7.41406 12.707C4.21406 9.50703 1.41406 6.70703 1.41406 6.70703C4.61406 3.50703 7.41406 0.707031 7.41406 0.707031" strokeWidth="2" />
            </svg>
        </button>
    );
}

type AnimatedStepBackButtonProps = {
    isVisible: boolean;
    onClick: () => void;
    className?: string;
};

export function AnimatedStepBackButton({
    isVisible,
    onClick,
    className = "",
}: AnimatedStepBackButtonProps) {
    return (
        <div
            className={`overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out shrink-0 ${isVisible ? "opacity-100" : "opacity-0"
                } ${className}`}
        >
            <BackButton onClick={onClick} />
        </div>
    );
}

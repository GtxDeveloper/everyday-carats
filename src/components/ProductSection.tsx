import { useNavigate } from "react-router-dom";

interface ProductSectionProps {
    title: string;
    badge?: string;
    subtitle?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    priceNote?: string;
    priceValue?: string;
    contactLabel?: string;
    contactHref?: string;
    imageContent: React.ReactNode;
}

export default function ProductSection({
    title,
    badge,
    subtitle,
    description,
    ctaLabel,
    ctaHref = '#',
    priceNote,
    priceValue,
    contactLabel,
    contactHref = '#',
    imageContent,
}: ProductSectionProps) {
    const navigate = useNavigate();

    const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.dispatchEvent(new Event('trigger-page-exit'));
        setTimeout(() => {
            navigate(ctaHref);
        }, 200);
    };

    return (
        // Outer: media + text stacked in a single centered column (Figma "Embellishments").
        <div className="h-full w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-6 pb-6 md:px-8 md:pb-[124px] desktop:px-[104px] desktop:pb-16">
            {imageContent}

            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    {badge && (
                        <span className="font-nata font-bold text-[16px] tracking-[0.04em] uppercase text-[#737373]">
                            {badge}
                        </span>
                    )}

                    <h1 className="font-orbitron text-[22px] md:text-[32px] text-[#141414] leading-tight tracking-[0.05em]">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="font-nata font-light text-[18px] md:text-[28px] leading-[1.25] text-[#737373] tracking-[-0.02em] whitespace-pre-line">
                            {subtitle}
                        </p>
                    )}

                    {description && (
                        <p className="font-nata font-normal text-[16px] leading-[1.5] text-[#737373] max-w-[480px]">
                            {description}
                        </p>
                    )}
                </div>

                {(ctaLabel || priceValue) && (
                    // 3-column grid on tablet/desktop keeps the button dead-center regardless
                    // of the price block's width — col 1 is an empty balancing spacer.
                    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-0">
                        <div aria-hidden="true" />

                        {ctaLabel && (
                            <a
                                href={ctaHref}
                                onClick={handleCTA}
                                className="
                                    inline-block w-fit justify-self-center
                                    bg-[#141414] text-[#FAFAFA]
                                    font-nata font-bold text-[16px] tracking-[0.04em] uppercase
                                    px-10 py-4
                                    hover:bg-[#ffffff] hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414]
                                    transition-all duration-300
                                "
                            >
                                {ctaLabel}
                            </a>
                        )}

                        {priceValue && (
                            <div className="flex flex-col items-center md:items-start md:justify-self-start md:ml-8">
                                {priceNote && (
                                    <span className="font-nata text-[14px] leading-[1.25] text-[#737373]">
                                        {priceNote}
                                    </span>
                                )}
                                <span className="font-nata font-bold text-[16px] tracking-[0.04em] uppercase text-[#141414]">
                                    {priceValue}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {contactLabel && (
                    <div className="flex items-center gap-2 bg-[#FAFAFA] px-3.5 py-[7px]">
                        <span className="font-nata font-bold text-[16px] tracking-[0.04em] uppercase text-[#141414]">
                            to order it now:
                        </span>
                        <a
                            href={contactHref}
                            className="font-nata text-[16px] text-[#141414] hover:text-[#737373] transition-colors"
                        >
                            {contactLabel}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

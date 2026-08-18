

export interface AboutSectionProps {
    title: string;
    paragraphs: string[];
    imageSrc: string;
    imageAlt: string;
    isReversed?: boolean;
}

export default function AboutSection({
    title,
    paragraphs,
    imageSrc,
    imageAlt,
    isReversed = false
}: AboutSectionProps) {
    return (
        // Mobile: flex-col vs flex-col-reverse
        // Desktop: flex-row vs flex-row-reverse
        <section
            className={`flex items-center w-full md:px-10 desktop:px-0 gap-8 md:gap-2 desktop:gap-20 ${isReversed ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'
                }`}
        >
            {/* Text Container */}
            <div className="w-full desktop:w-1/2 flex flex-col justify-center px-6 md:px-0 desktop:px-20">
                <h2 className="font-nata font-light text-[#141414] text-[18px] md:text-[28px] mb-4 md:mb-6">
                    {title}
                </h2>
                {paragraphs.map((p, idx) => (
                    <p
                        key={idx}
                        className="font-nata font-normal text-[#737373] text-[16px] leading-relaxed mb-4 last:mb-0"
                    >
                        {p}
                    </p>
                ))}
            </div>

            {/* Image Container */}
            <div className="w-full desktop:w-1/2 px-6 md:px-0 desktop:px-20">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-auto object-cover mix-blend-multiply"
                />
            </div>
        </section>
    );
}

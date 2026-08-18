import React from 'react';

// ─── Primitive typography components ─────────────────────────────────────────
// Import and use these directly in your page, or pass content via the
// `sections` prop on <TextPageTemplate> for a data-driven approach.

export function TP_H1({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="font-orbitron font-normal text-[#141414] text-[22px] md:text-[32px] mb-4">
            {children}
        </h1>
    );
}

export function TP_H2({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="font-nata font-light text-[#141414] text-[18px] md:text-[28px] mb-4 mt-[32px] md:mt-[64px]">
            {children}
        </h2>
    );
}

export function TP_P({ children }: { children: React.ReactNode }) {
    return (
        <p className="font-nata font-normal text-[#737373] text-[16px] leading-relaxed mb-4">
            {children}
        </p>
    );
}

// ─── Section data shape (for the data-driven prop API) ───────────────────────
export interface TextSection {
    heading: string;
    paragraphs: string[];
}

// ─── Main template ────────────────────────────────────────────────────────────
interface TextPageTemplateProps {
    /** Page H1 title */
    title: string;
    /** Structured sections — each with an H2 heading and body paragraphs */
    sections?: TextSection[];
    /** Alternatively, pass arbitrary JSX children */
    children?: React.ReactNode;
}

export default function TextPageTemplate({ title, sections, children }: TextPageTemplateProps) {
    return (
        // Outer: full width, white background, responsive vertical padding
        <div className="min-h-[calc(100vh-74px)] w-full bg-[#ffffff] py-[32px] md:py-[64px] desktop:py-[160px]">
            {/* Inner: responsive width, centered */}
            <div className="
                w-[327px]
                md:w-[658px]
                desktop:w-[610px]
                mx-auto

            ">
                <TP_H1>{title}</TP_H1>

                {/* Data-driven render path */}
                {sections?.map((section, i) => (
                    <React.Fragment key={i}>
                        {section.heading !== "" && <TP_H2>{section.heading}</TP_H2>}
                        {section.paragraphs.map((para, j) => (
                            <TP_P key={j}>{para}</TP_P>
                        ))}
                    </React.Fragment>
                ))}

                {/* JSX children render path */}
                {children}
            </div>
        </div>
    );
}

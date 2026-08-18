import { useState } from 'react';
import type { DiamondForm } from '../../utils/homeContent';
import DiamondCutDrawer from './DiamondCutDrawer';

interface DiamondFormsSlideProps {
    title: string;
    forms: DiamondForm[];
}

function FormCard({ form, onLearnMore }: { form: DiamondForm; onLearnMore: () => void }) {
    return (
        <div className="bg-[#FAFAFA] p-6 desktop:p-8 flex flex-row md:flex-col items-center gap-6 md:gap-4 w-full md:w-[213px] desktop:w-[389px]">
            <img
                src={form.image}
                alt={form.name}
                className="w-20 h-20 md:w-[165px] md:h-[165px] desktop:w-[325px] desktop:h-[325px] object-contain shrink-0"
            />
            <div className="flex flex-col gap-2 items-start md:items-center">
                <span className="font-nata font-light text-[28px] leading-[1.25] tracking-[-0.02em] text-[#141414]">
                    {form.name}
                </span>
                <button
                    onClick={onLearnMore}
                    className="font-nata font-medium text-[16px] tracking-[0.04em] uppercase text-[#737373] hover:text-[#141414] hover:underline transition-colors"
                >
                    {form.linkLabel}
                </button>
            </div>
        </div>
    );
}

export default function DiamondFormsSlide({ title, forms }: DiamondFormsSlideProps) {
    const [drawerSlide, setDrawerSlide] = useState<number | null>(null);

    return (
        <div className="h-full w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center gap-8 px-6 pb-6 md:px-8 md:pb-[124px] desktop:px-[104px] desktop:pb-16">
            <div className="w-full flex flex-col gap-8 items-center">
                <h2 className="font-orbitron text-[22px] md:text-[32px] text-[#141414] leading-tight tracking-[0.05em] text-center">
                    {title}
                </h2>

                <div className="w-full flex flex-col md:flex-row gap-2 justify-center">
                    {forms.map((form, index) => (
                        <FormCard key={form.name} form={form} onLearnMore={() => setDrawerSlide(index)} />
                    ))}
                </div>
            </div>

            <DiamondCutDrawer
                isOpen={drawerSlide !== null}
                initialSlide={drawerSlide ?? 0}
                onClose={() => setDrawerSlide(null)}
            />
        </div>
    );
}

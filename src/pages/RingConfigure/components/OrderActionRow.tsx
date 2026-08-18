import type { MouseEvent } from "react";
import { BackButton } from "./BackButton";

type OrderActionRowProps = {
    onBack: () => void;
    onCheckout: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function OrderActionRow({ onBack, onCheckout }: OrderActionRowProps) {
    return (
        <div className="flex flex-col items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-4 md:gap-0 w-full">
            <div className="justify-center md:justify-self-end hidden md:flex">
                <BackButton onClick={onBack} />
            </div>
            <div className="flex justify-between w-full md:justify-self-center md:px-6">
                <BackButton onClick={onBack} className="md:hidden" />
                <button
                    onClick={onCheckout}
                    className="whitespace-nowrap w-fit font-semibold bg-[#141414] text-[#ffffff] font-nata text-[16px] tracking-[0.04em] uppercase px-[40px] py-[14px] hover:bg-[#ffffff] hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300 flex items-center justify-center"
                >
                    PLACE YOUR ORDER
                </button>
            </div>
            <div className="flex flex-col items-center md:justify-self-end md:items-start md:me-auto">
                <span className="font-nata text-[#737373] text-[14px] text-center md:text-right">Will be Shipped for FREE by</span>
                <span className="font-nata font-bold text-[#141414] text-[16px] uppercase text-center md:text-right">TUESDAY, FEBRUARY 24</span>
            </div>
        </div>
    );
}

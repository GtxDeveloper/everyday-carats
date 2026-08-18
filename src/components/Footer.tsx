import AnimatedLink from './AnimatedLink';

const LINK_CLS =
    'font-nata text-[#F5F5F5] text-[16px] tracking-normal uppercase ' +
    'hover:text-[#ffffff] transition-colors duration-300';

export default function Footer() {
    return (
        <footer className="bg-[#141414] w-full">
            <div className="h-full max-w-[1440px] mx-auto px-6 md:px-10
        flex flex-col desktop:flex-row
        items-center justify-center desktop:justify-between
        gap-7 md:gap-5 desktop:gap-0">

                {/* ── MOBILE / TABLET ──────────────────────────────────────────────
          IMPORTANT: no md: classes on this wrapper — only desktop:hidden.
          This avoids the @config(md:) vs @theme(desktop:) cascade conflict
          that caused the desktop section to stay visible.                    */}
                <div className="desktop:hidden w-full flex flex-col items-center gap-7 md:gap-5">
                    <span className="font-orbitron text-[#ffffff] text-[22px] md:text-[32px] tracking-normal uppercase mt-[33px]">
                        Everyday Carats
                    </span>
                    {/* md:flex lives here on an inner div — safely away from desktop:hidden */}
                    <div className="mb-[114px] md:mb-[33px] grid grid-cols-2 md:flex md:flex-row gap-x-10 gap-y-5 md:gap-x-10">
                        <AnimatedLink to="/terms-of-service" className={LINK_CLS}>Terms of Service</AnimatedLink>
                        <AnimatedLink to="/privacy-policy" className={LINK_CLS}>Privacy Policy</AnimatedLink>
                        <AnimatedLink to="/refund-policy" className={LINK_CLS}>Refund Policy</AnimatedLink>
                        <AnimatedLink to="/shipping-policy" className={LINK_CLS}>Shipping Policy</AnimatedLink>
                    </div>
                </div>

                {/* ── DESKTOP ONLY ─────────────────────────────────────────────────
          hidden (no prefix) vs desktop:flex — hidden has no media query so
          desktop:flex reliably overrides it. No pipeline conflict here.      */}
                <div className="hidden desktop:flex items-center gap-10">
                    <AnimatedLink to="/terms-of-service" className={LINK_CLS}>Terms of Service</AnimatedLink>
                    <AnimatedLink to="/privacy-policy" className={LINK_CLS}>Privacy Policy</AnimatedLink>
                </div>

                <span className="hidden desktop:block font-orbitron text-[#ffffff] text-[32px]  py-[33px] tracking-normal uppercase">
                    Everyday Carats
                </span>

                <div className="hidden desktop:flex items-center gap-10">
                    <AnimatedLink to="/refund-policy" className={LINK_CLS}>Refund Policy</AnimatedLink>
                    <AnimatedLink to="/shipping-policy" className={LINK_CLS}>Shipping Policy</AnimatedLink>
                </div>

            </div>
        </footer>
    );
}

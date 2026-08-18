import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedLink from './AnimatedLink';
import HeaderMessage from './HeaderMessage';

export default function StaticHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Hide navigation links on the checkout page
    const hideNav = location.pathname === '/checkout';

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsMenuOpen(false);
        document.dispatchEvent(new Event('trigger-page-exit'));
        setTimeout(() => {
            navigate('/');
        }, 200);
    };

    return (
        <>
            {/* ── Fixed header bar ─────────────────────────────────────────── */}
            <header className="relative top-0 left-0 w-full z-50 h-[107px] md:h-[147px] desktop:h-[113px] bg-[#FAFAFA]">
                <div className="h-full w-full max-w-[1440px] mx-auto relative flex flex-col items-center justify-center gap-3 md:gap-4 px-1.5 py-3 md:px-8 md:py-5 desktop:flex-row desktop:justify-center desktop:px-[102px] desktop:py-5">

                    {/* Message — top-center on mobile/tablet, absolutely left on desktop */}
                    <div className="desktop:absolute desktop:left-[102px] desktop:top-1/2 desktop:-translate-y-1/2">
                        <HeaderMessage />
                    </div>

                    {/* Brand — normal flow on mobile/tablet, absolutely centered on desktop */}
                    <div className="desktop:absolute desktop:left-1/2 desktop:-translate-x-1/2 flex flex-col items-center">
                        <a href="/" className="no-underline group flex flex-col items-center" onClick={handleLogoClick}>
                            <span className="whitespace-nowrap font-orbitron text-[22px] md:text-[32px] uppercase tracking-normal text-[#141414] leading-tight">
                                Everyday Carats
                            </span>
                            <span className="whitespace-nowrap font-nata font-light text-[18px] md:text-[28px] tracking-normal text-[#737373] mt-0.5 normal-case">
                                made in Italy
                            </span>
                        </a>
                    </div>

                    {/* Desktop nav — hidden below 1440px and on checkout */}
                    {!hideNav && (
                        <nav className="hidden desktop:flex desktop:absolute desktop:right-[102px] desktop:top-1/2 desktop:-translate-y-1/2 items-center gap-10">
                            <AnimatedLink
                                to="/about-us"
                                className="font-nata text-[16px] tracking-[0.15em] uppercase text-[#737373] hover:text-[#141414] transition-colors duration-300"
                            >
                                About Us
                            </AnimatedLink>
                            <AnimatedLink
                                to="/contact-us"
                                className="font-nata text-[16px] tracking-[0.15em] uppercase text-[#737373] hover:text-[#141414] transition-colors duration-300"
                            >
                                Contact Us
                            </AnimatedLink>
                        </nav>
                    )}

                    {/* Hamburger button — visible below 1440px, hidden on checkout, pinned top-right of the header */}
                    {!hideNav && (
                        <button
                            className="desktop:hidden absolute right-2.5 top-11.5 md:right-8 md:top-14 flex flex-col justify-center items-center gap-[5px] w-[14px] md:w-[18px] group"
                            onClick={() => setIsMenuOpen((v) => !v)}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                        >
                            {/* Three bars — middle one fades out when open */}
                            <span className={`block w-full h-px bg-[#141414] transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                            <span className={`block w-full h-px bg-[#141414] transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                            <span className={`block w-full h-px bg-[#141414] transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                        </button>
                    )}

                </div>

                {/* ── Mobile / Tablet popup panel ──────────────────────────────
                   absolute inside the header so it scrolls away with it.
                   StaticLayout uses overflow-x:clip to stop horizontal scroll. */}
                {!hideNav && (
                    <div
                        className={`
                          absolute right-0 z-40
                          top-[107px] md:top-[147px]
                          w-[151px] h-[112px] md:w-[213px] md:h-[182px]
                          bg-[#FAFAFA]
                          flex flex-col items-start justify-center gap-4 md:gap-6 px-6 md:px-8
                          desktop:hidden
                          transition-transform duration-300 ease-in-out
                          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                        `}
                        aria-hidden={!isMenuOpen}
                    >
                        <AnimatedLink
                            to="/about-us"
                            className="font-nata text-[16px] tracking-normal uppercase text-[#141414] hover:text-[#141414] transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </AnimatedLink>
                        <AnimatedLink
                            to="/contact-us"
                            className="font-nata text-[16px] tracking-normal uppercase text-[#141414] hover:text-[#141414] transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact Us
                        </AnimatedLink>
                    </div>
                )}
            </header>

            {/* ── Backdrop — closes menu on outside click ───────────────────── */}
            {isMenuOpen && !hideNav && (
                <div
                    className="fixed inset-0 z-30 desktop:hidden"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}

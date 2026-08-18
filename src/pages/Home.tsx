import { useState, useCallback, useEffect, useRef } from 'react';
import ProductSection from '../components/ProductSection';
import SlideMedia from '../components/SlideMedia';
import Footer from '../components/Footer';
import ReviewsSlide from '../components/slides/ReviewsSlide';
import DiamondFormsSlide from '../components/slides/DiamondFormsSlide';
import { sanityClient } from '../sanityClient';
import {
    HOME_SLIDES_FALLBACK,
    HOME_SLIDES_QUERY,
    mergeHomeSlides,
    type HomeSlide,
    type HomeSlideDocument,
} from '../utils/homeContent';

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
    // Fallback content renders on the first paint, Sanity replaces it once loaded.
    const [slides, setSlides] = useState<HomeSlide[]>(HOME_SLIDES_FALLBACK);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [direction, setDirection] = useState<'down' | 'up'>('down');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAppearing, setIsAppearing] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    // Sub-slide for the last slide: 0 = product section, 1 = footer
    const [subSlide, setSubSlide] = useState(0);
    const footerRef = useRef<HTMLDivElement>(null);
    const [footerH, setFooterH] = useState(0);

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const isScrolling = useRef(false);

    const lastIndex = slides.length - 1;
    // Clamped on read — Sanity may return fewer slides than the fallback.
    const current = Math.min(currentIndex, lastIndex);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);

        const handleGlobalExit = () => setIsExiting(true);
        document.addEventListener('trigger-page-exit', handleGlobalExit);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('trigger-page-exit', handleGlobalExit);
        };
    }, []);

    useEffect(() => {
        let isCancelled = false;

        sanityClient
            .fetch<{ slides?: HomeSlideDocument[] } | null>(HOME_SLIDES_QUERY)
            .then((data) => {
                if (!isCancelled) {
                    setSlides(mergeHomeSlides(data?.slides));
                }
            })
            .catch((error) => {
                console.error('Error fetching home page content:', error);
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!footerRef.current) return;
        const ro = new ResizeObserver(() => {
            setFooterH(footerRef.current?.offsetHeight ?? 0);
        });
        ro.observe(footerRef.current);
        return () => ro.disconnect();
        // Re-observe when the footer moves to a different last slide.
    }, [lastIndex]);

    const goTo = useCallback(
        (next: number) => {
            if (next === current || isAnimating || next < 0 || next >= slides.length) return;
            setSubSlide(0);
            setDirection(next > current ? 'down' : 'up');
            setPrev(current);
            setCurrentIndex(next);
            setIsAnimating(true);
        },
        [current, isAnimating, slides.length],
    );

    const onTransitionEnd = () => {
        setPrev(null);
        setIsAnimating(false);
    };

    // ── Slide position logic ──────────────────────────────────────────────────
    const slideStyle = (idx: number): React.CSSProperties => {
        if (idx === current) {
            return {
                transform: 'translateY(0%)',
                transition: isAnimating ? 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
                zIndex: 2,
            };
        }
        if (idx === prev && prev !== null) {
            return {
                transform: `translateY(${direction === 'down' ? '-100%' : '100%'})`,
                transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                zIndex: 1,
            };
        }
        return {
            transform: `translateY(${idx < current ? '-100%' : '100%'})`,
            transition: 'none',
            zIndex: 0,
        };
    };

    // ── Touch and Wheel Handlers ──
    // Ignore gestures that originate inside the reviews carousel — its own
    // horizontal swipe/drag would otherwise also page-flip the vertical slide.
    const isInsideCarousel = (target: EventTarget | null) =>
        target instanceof Element && target.closest('.swiper') !== null;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isInsideCarousel(e.target)) return;
        touchStartY.current = e.touches[0].clientY;
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isInsideCarousel(e.target)) return;
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isInsideCarousel(e.target)) return;
        const diff = touchStartY.current - touchEndY.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                if (current < lastIndex) {
                    goTo(current + 1);
                } else if (subSlide === 0) {
                    setSubSlide(1);
                }
            } else {
                if (subSlide === 1) {
                    setSubSlide(0);
                } else if (current > 0) {
                    goTo(current - 1);
                }
            }
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (isScrolling.current || isInsideCarousel(e.target)) return;

        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY > 20) {
                if (current < lastIndex) {
                    isScrolling.current = true;
                    goTo(current + 1);
                    setTimeout(() => { isScrolling.current = false; }, 800);
                } else if (subSlide === 0) {
                    isScrolling.current = true;
                    setSubSlide(1);
                    setTimeout(() => { isScrolling.current = false; }, 800);
                }
            } else if (e.deltaY < -20) {
                if (subSlide === 1) {
                    isScrolling.current = true;
                    setSubSlide(0);
                    setTimeout(() => { isScrolling.current = false; }, 800);
                } else if (current > 0) {
                    isScrolling.current = true;
                    goTo(current - 1);
                    setTimeout(() => { isScrolling.current = false; }, 800);
                }
            }
        }
    };

    return (
        <div
            className="w-full overflow-x-hidden"
            style={{ height: 'calc(100vh - var(--header-h))', marginTop: 'var(--header-h)' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
        >
            <div
                className={`w-full h-full relative overflow-hidden bg-[#ffffff] transition-transform duration-500 ease-out ${isExiting ? '-translate-x-[100vw]' : isAppearing ? 'translate-x-0' : '-translate-x-[100vw]'}`}
            >
                {/* ── Slides ──────────────────────────────────────────────────────────── */}
                {slides.map((slide, idx) => {
                    const isLastSlide = idx === lastIndex;
                    let section: React.ReactNode;
                    if (slide.kind === 'reviews') {
                        section = <ReviewsSlide title={slide.title} reviews={slide.reviews} />;
                    } else if (slide.kind === 'forms') {
                        section = <DiamondFormsSlide title={slide.title} forms={slide.forms} />;
                    } else {
                        section = (
                            <ProductSection
                                title={slide.title}
                                badge={slide.badge}
                                subtitle={slide.subtitle}
                                description={slide.description}
                                ctaLabel={slide.ctaLabel}
                                ctaHref={slide.ctaHref}
                                priceNote={slide.priceNote}
                                priceValue={slide.priceValue}
                                contactLabel={slide.contactLabel}
                                contactHref={slide.contactEmail ? `mailto:${slide.contactEmail}` : undefined}
                                imageContent={<SlideMedia media={slide.media} edgeFade={slide.edgeFade} />}
                            />
                        );
                    }

                    return (
                        <div
                            key={idx}
                            className={`absolute inset-0 bg-[#ffffff] overflow-hidden ${isLastSlide ? '' : 'flex flex-col'}`}
                            style={slideStyle(idx)}
                            onTransitionEnd={idx === current ? onTransitionEnd : undefined}
                        >
                            {isLastSlide ? (
                                // Single wrapper shifts up by footer height — the slide stays visible above the footer
                                <div
                                    style={{
                                        transform: subSlide === 1 ? `translateY(-${footerH}px)` : 'translateY(0)',
                                        transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
                                    }}
                                >
                                    <div style={{ height: 'calc(100vh - var(--header-h))' }}>
                                        {section}
                                    </div>
                                    <div ref={footerRef}>
                                        <Footer />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 min-h-0 h-full">
                                    {section}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* ── Side Pagination ──────────────────────────────────────────────────── */}
                <div className="absolute left-0 md:left-8 desktop:left-[104px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goTo(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className="flex items-center justify-center w-8"
                        >
                            <span
                                className="block w-px transition-all duration-500"
                                style={{
                                    height: idx === current ? '96px' : '32px',
                                    backgroundColor: idx === current ? '#737373' : '#D9D9D9',
                                }}
                            />
                        </button>
                    ))}
                    {/* Extra dot — footer sub-slide, visible only on the last slide */}
                    <button
                        onClick={() => setSubSlide(subSlide === 0 ? 1 : 0)}
                        aria-label="Go to footer"
                        className="flex items-center justify-center w-8 transition-opacity duration-500"
                        style={{ opacity: current === lastIndex ? 1 : 0, pointerEvents: current === lastIndex ? 'auto' : 'none' }}
                    >
                        <span
                            className="block w-px transition-all duration-500"
                            style={{
                                height: subSlide === 1 ? '64px' : '20px',
                                backgroundColor: subSlide === 1 ? '#737373' : '#D9D9D9',
                            }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

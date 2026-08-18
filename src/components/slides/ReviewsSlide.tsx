import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import { StarIcon, CarouselArrowIcon } from '../icons';
import type { ReviewItem } from '../../utils/homeContent';

interface ReviewsSlideProps {
    title: string;
    reviews: ReviewItem[];
}

function ReviewCard({ review }: { review: ReviewItem }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.text.length > 90;

    return (
        // h-full stretches every card to the tallest one in the row (Swiper's
        // wrapper is a flex row with the default align-items: stretch).
        <div className="h-full w-[272px] md:w-[406px] p-6 desktop:p-8 bg-[#FAFAFA] flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 md:w-6 md:h-6 text-[#141414]" />
                        ))}
                    </div>
                    <span className="font-nata font-light text-[17px] md:text-[28px] leading-[1.25] tracking-[-0.02em] text-[#141414]">
                        {review.author}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-nata text-[16px] text-[#141414]">{review.reviewTitle}</p>
                    {/* min-height + max-height together give every card the same collapsed
                        text-block size regardless of how long its review actually is — a
                        short review just leaves blank space instead of a shorter box. */}
                    <p
                        className="font-nata text-[16px] leading-[1.5] text-[#737373] min-h-[48px] overflow-hidden transition-[max-height] duration-300 ease-in-out"
                        style={{ maxHeight: expanded ? '480px' : '48px' }}
                    >
                        {review.text}
                    </p>
                    {/* Always rendered (not just for long reviews) so the button's row
                        keeps taking up the same space on every card — just invisible
                        when there's nothing to expand. */}
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className={`font-nata text-[16px] text-[#141414] text-left hover:text-[#737373] transition-colors ${isLong ? '' : 'invisible pointer-events-none'}`}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                </div>
            </div>
            {/* justify-between above reserves all the slack space right here — the only
                gap that grows/shrinks with content is between the text and the date. */}
            <span className="font-nata text-[16px] text-[#737373]">{review.date}</span>
        </div>
    );
}

export default function ReviewsSlide({ title, reviews }: ReviewsSlideProps) {
    const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const arrows = (
        <div className="flex items-center gap-8">
            <button
                onClick={() => swiperInstance?.slidePrev()}
                disabled={isBeginning}
                aria-label="Previous reviews"
                className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8"
            >
                <CarouselArrowIcon direction="left" className={`w-full h-full ${isBeginning ? 'text-[#D9D9D9]' : 'text-[#737373]'}`} />
            </button>
            <button
                onClick={() => swiperInstance?.slideNext()}
                disabled={isEnd}
                aria-label="Next reviews"
                className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8"
            >
                <CarouselArrowIcon direction="right" className={`w-full h-full ${isEnd ? 'text-[#D9D9D9]' : 'text-[#737373]'}`} />
            </button>
        </div>
    );

    return (
        <div className="h-full w-full max-w-[1600px] mx-auto flex flex-col items-center justify-center gap-8 px-6 pb-6 md:px-8 md:pb-[124px] desktop:px-[104px] desktop:pb-16">
            <div className="w-full flex flex-col gap-6 md:gap-8">
                {/* Mobile: title alone, centered. Tablet/desktop: 3-column grid keeps the
                    title dead-center, with an empty col-1 spacer balancing the arrows'
                    width in col 3 — the arrows move here from below the carousel. */}
                <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8">
                    <div aria-hidden="true" className="hidden md:block" />

                    <h2 className="font-orbitron text-[22px] md:text-[32px] text-[#141414] leading-tight tracking-[0.05em] text-center">
                        {title}
                    </h2>

                    <div className="hidden md:flex justify-end">{arrows}</div>
                </div>

                <Swiper
                    onSwiper={(swiper) => {
                        setSwiperInstance(swiper);
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={(s) => {
                        setIsBeginning(s.isBeginning);
                        setIsEnd(s.isEnd);
                    }}
                    onReachBeginning={() => setIsBeginning(true)}
                    onReachEnd={() => setIsEnd(true)}
                    onFromEdge={(s) => {
                        setIsBeginning(s.isBeginning);
                        setIsEnd(s.isEnd);
                    }}
                    slidesPerView="auto"
                    spaceBetween={8}
                    className="w-full md:pl-12"
                >
                    {reviews.map((review, i) => (
                        <SwiperSlide key={i} style={{ width: 'auto' }}>
                            <ReviewCard review={review} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Mobile only — arrows move below the carousel, bottom-right. */}
                <div className="flex md:hidden justify-end">{arrows}</div>
            </div>
        </div>
    );
}

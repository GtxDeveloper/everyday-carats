import { useState, useEffect } from 'react';
import AboutSection from '../components/AboutSection';

const aboutData = [
    {
        title: 'You design it. We make it exceptional.',
        paragraphs: [
            'EVERYDAY CARATS is about outstanding quality without complication. Design your creation online with complete freedom, while we handle all the details and turn it into reality. We go one step further than anyone else — because "best" is our starting point.'
        ],
        imageSrc: '/img/Flower.jpg',
        imageAlt: 'Silver branch brooch with diamonds'
    },
    {
        title: 'Every piece is hand-crafted in Valenza, Italy.',
        paragraphs: [
            'For over two centuries, Valenza — the heart of fine jewellery — has been a symbol of masterful craftsmanship and unparalleled quality. Our goldsmiths forge each piece by hand using 18kt gold to achieve flawless results.'
        ],
        imageSrc: '/img/Ring-2.jpg',
        imageAlt: 'Diamond ring'
    },
    {
        title: 'Our diamonds are sourced through the Antwerp Diamond Bourse.',
        paragraphs: [
            'One of the world\'s most respected diamond trading hubs, Antwerp handles over 70% of the world\'s rough and polished diamond trade and is known for its strict standards and transparency. We select only top-tier G/VS natural diamonds directly from the Bourse for exceptional brilliance of your jewellery. Each ring is delivered with GIA certificate.'
        ],
        imageSrc: '/img/Studs.jpg',
        imageAlt: 'Diamond earrings'
    }
];

export default function AboutUs() {
    const [isAppearing, setIsAppearing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`transition-opacity duration-500 ease-out ${isAppearing ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-full mx-auto max-w-[1440px] py-[32px] md:py-[64px] desktop:py-[160px] flex flex-col gap-8 md:gap-2">

                {/* Main Title Container */}
                <div className="px-6 md:px-10 desktop:px-20">
                    <h1 className="font-orbitron font-normal tracking-normal text-[#141414] text-start text-[22px] md:text-[32px] desktop:text-[32px]">
                        About us
                    </h1>
                </div>

                {/* Render Loop */}
                <div className="flex flex-col gap-8 md:gap-2 w-full">
                    {aboutData.map((item, index) => (
                        <AboutSection
                            key={index}
                            title={item.title}
                            paragraphs={item.paragraphs}
                            imageSrc={item.imageSrc}
                            imageAlt={item.imageAlt}
                            // Auto-alternating logic: 0=normal, 1=reversed, 2=normal, etc.
                            isReversed={index % 2 !== 0}
                        />
                    ))}
                </div>

                <div className="mx-auto">
                    <img loading='lazy' className='h-[67px] desktop:h-[100px]' src="/img/logo-italic.jpg"></img>
                    <a
                        href="/"
                        className="
                                    mt-8 block w-fit  font-semibold
                                    bg-[#141414] text-[#ffffff]
                                    font-nata text-[16px] tracking-[0.16em] uppercase
                                    px-8 py-3.5
                                    hover:bg-[#ffffff] hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414]
                                    transition-all duration-300 mx-auto
                                "
                    >
                        Create
                    </a>
                </div>
            </div>
        </div>
    );
}

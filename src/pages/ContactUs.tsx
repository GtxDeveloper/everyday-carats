import { useState, useEffect } from 'react';

export default function ContactUs() {
    const [isAppearing, setIsAppearing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`transition-opacity duration-500 ease-out ${isAppearing ? 'opacity-100' : 'opacity-0'}`}>
            <div className="min-h-[calc(100vh-74px)] w-full mx-auto max-w-[1440px] pt-[32px] md:pt-[64px] desktop:pt-[160px] pb-[64px] md:pb-[160px] px-6 md:px-10 desktop:px-20">

                {/* Сетка 2x2 на Desktop | 1 колонка на Mobile/Tablet */}
                <div className="grid grid-cols-1 gap-[48px] items-start desktop:grid-cols-2 desktop:grid-rows-2 desktop:gap-x-2 desktop:gap-y-0">

                    {/* Ячейка 1 (Слева-сверху): Заголовок и текст */}
                    <div className="flex flex-col justify-start desktop:col-start-1 desktop:row-start-1">
                        <h1 className="font-orbitron font-normal tracking-normal text-[#141414] text-[22px] md:text-[32px] mb-4 md:mb-6">
                            Contact us
                        </h1>
                        <p className="font-nata font-normal text-[#737373] text-[16px] leading-relaxed">
                            We are delighted to assist you with your order, help with the choice and offer options that are not yet available on the website.
                        </p>
                    </div>

                    {/* Ячейка 4 (Справа-снизу): Серая карточка контактов */}
                    <div className="w-full bg-[#f6f6f6] p-[24px] desktop:p-[32px] flex flex-col desktop:col-start-2 desktop:row-start-2">
                        <h2 className="font-nata font-semibold text-[#141414] text-[16px] uppercase tracking-widest mb-[24px] md:mb-[48px]">
                            GET IN TOUCH:
                        </h2>

                        {/* Внутренняя структура контактов 
                            Mobile & Tablet: Stacked with border-b 
                            Desktop: Side-by-side with border-l on the right item 
                        */}
                        <div className="flex flex-col gap-[24px] desktop:flex-row desktop:gap-12 desktop:items-start">

                            {/* Блок Email */}
                            <div className="flex-1 flex flex-col justify-start border-b border-[#141414] pb-[24px] desktop:border-b-0 desktop:pb-0">
                                <span className="block font-nata font-normal text-[#141414] text-[16px] mb-[8px]">
                                    E-mail
                                </span>

                                <a
                                    href="mailto:INFO@E-MAIL.COM"
                                    className="group flex items-center gap-[8px] font-nata font-semibold text-[#141414] text-[14px] md:text-[15px] tracking-wide hover:text-[#737373] transition-colors duration-200"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#737373] transition-colors duration-200">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    INFO@E-MAIL.COM
                                </a>

                                <span className="block font-nata font-normal text-[#737373] text-[14px] mt-[8px]">
                                    We will respond within 24 hours
                                </span>
                            </div>

                            {/* Блок Telephone */}
                            <div className="flex-1 flex flex-col justify-start desktop:border-l desktop:border-[#D9D9D9] desktop:pl-12">
                                <span className="block font-nata font-normal text-[#141414] text-[16px] mb-[8px]">
                                    Telephone
                                </span>

                                <a
                                    href="tel:0800111222333"
                                    className="group flex items-center gap-[8px] font-nata font-semibold text-[#141414] text-[16px] md:text-[15px] tracking-wide hover:text-[#737373] transition-colors duration-200"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#737373] transition-colors duration-200">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    0 800 111 222 333
                                </a>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
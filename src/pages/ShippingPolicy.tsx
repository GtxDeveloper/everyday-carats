import { useState, useEffect } from 'react';
import TextPageTemplate from '../components/TextPageTemplate';

export default function ShippingPolicy() {
    const [isAppearing, setIsAppearing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`transition-opacity duration-500 ease-out w-full ${isAppearing ? 'opacity-100' : 'opacity-0'}`}>
            <TextPageTemplate
                title="Shipping Policy"
                sections={[
                    {
                        heading: "",
                        paragraphs: [
                            "As soon as we receive customer's funds, we will start processing the shipment of the purchased item. The shipment cost is free and all our orders are insured against loss, theft or damage.",
                            "All orders are processed within 4 weeks. You will receive an e-mail notification, when your order has been shipped, which will include a tracking number.",
                            "If an item arrived incorrect, defective, damaged or didn't arrive at all - email us at info@... . We will take responsibility and resolve it promptly.",
                            "Please include your order number and a brief description.",
                        ]
                    },
                    {
                        heading: 'Import Taxes',
                        paragraphs: [
                            'In case your country is located outside of European Union - your order may be subject to import duties and taxes. We are not responsible for these charges, if they are applied.',
                            'How to check the status of you order?',
                            'When your order has been shipped, you will receive an email notification from us, which will include a tracking number you can use to check its status.',
                            'If you haven’t received your order within 4 days of receiving your shipping confirmation email, please contact us at info@... with your name and order number, and we will look into it for you.',
                            'If you have any further questions, please don\'t hesitate to contact us at info@...',
                        ],
                    },
                ]}
            />
        </div>
    );
}

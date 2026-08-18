import { useState, useEffect } from 'react';
import TextPageTemplate from '../components/TextPageTemplate';

export default function RefundPolicy() {
    const [isAppearing, setIsAppearing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`transition-opacity duration-500 ease-out w-full ${isAppearing ? 'opacity-100' : 'opacity-0'}`}>
            <TextPageTemplate
                title="Refund Policy"
                sections={[
                    {
                        heading: 'All sales are final',
                        paragraphs: [
                            'Under EU law, personalized or customized goods cannot be returned for a "change of mind," but they remain covered by the legal guarantee, if faulty, damaged, or not as described. Please review your order carefully before completing your purchase.',
                        ],
                    },
                    {
                        heading: 'Order Issues',
                        paragraphs: [
                            'If an item is incorrect or defective, email us at info@everydaycarats.com and we will take responsibility and resolve it promptly.',
                            'Please include your order number and a brief description.',
                            "If you have any further questions, please don't hesitate to contact us at info@everydaycarats.com.",
                        ],
                    },
                ]}
            />
        </div>
    );
}

import { useState, useEffect } from 'react';
import TextPageTemplate from '../components/TextPageTemplate';

export default function PrivacyPolicy() {
    const [isAppearing, setIsAppearing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppearing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`transition-opacity duration-500 ease-out w-full ${isAppearing ? 'opacity-100' : 'opacity-0'}`}>
            <TextPageTemplate
                title="Privacy Policy"
                sections={[
                    {
                        heading: "",
                        paragraphs: [
                            "This Privacy Policy describes how ... (the “Site” or “we”) collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.",
                        ]
                    },
                    {
                        heading: 'Collecting Personal Information',
                        paragraphs: [
                            'When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual (including the information below) as “Personal Information”. See the list below for more information about what Personal Information we collect and why.',
                        ],
                    },
                    {
                        heading: 'Device information',
                        paragraphs: [
                            'Examples of Personal Information collected: version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.',
                            'Purpose of collection: to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.',
                            'Source of collection: Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.',
                        ],
                    },
                    {
                        heading: 'Order information',
                        paragraphs: [
                            'Examples of Personal Information collected: name, billing address, shipping address, payment information (not including credit card numbers), email address, and phone number.',
                            'Purpose of collection: to provide products or services to you to fulfill our contract, to process your payment information, arrange for shipping, and provide you with invoices and/or order confirmations, communicate with you, screen our orders for potential risk or fraud, and when in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.',
                            'Source of collection: collected from you.',
                            'Customer support information',
                            'Examples of Personal Information collected: as listed above',
                            'Purpose of collection: to provide customer support.',
                            'Source of collection: collected from you.',
                        ],
                    },
                    {
                        heading: 'Minors',
                        paragraphs: [
                            'We do not intentionally collect Personal Information from children. If you are the parent or guardian and believe your child has provided us with Personal Information, please contact us at the address below to request deletion.',
                            'Sharing Personal Information',
                            'We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:',
                            'We use Revolut for payments of our online store. You can read more about how Revolut uses your Personal Information on their website.',
                            'We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.',
                        ],
                    },
                ]}
            />
        </div>
    );
}

import { Link } from 'react-router-dom';

export default function HeaderMessage() {
    return (
        <Link
            to="/shipping-policy"
            className="font-nata text-[14px] leading-[17.5px] text-[#141414] whitespace-nowrap no-underline"
        >
            <span className="font-bold">Free </span>
            insured worldwide{' '}
            <span className="font-bold underline">shipping</span>
        </Link>
    );
}

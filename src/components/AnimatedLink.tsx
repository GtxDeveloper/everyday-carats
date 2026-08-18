import { Link, type LinkProps } from 'react-router-dom';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';

// Base classes every usage shares
const BASE =
    'relative inline-block no-underline ' +
    'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current ' +
    'after:scale-x-0 after:origin-left ' +
    'after:transition-transform after:duration-300 after:ease-out ' +
    'hover:after:scale-x-100';

// ── React Router Link variant (Default) ───────────────────────────────────────
type RouterLinkProps = { as?: 'link' } & LinkProps;

// ── External Anchor variant ───────────────────────────────────────────────────
type AnchorProps = { as: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>;

// ── Button variant ────────────────────────────────────────────────────────────
type ButtonProps = { as: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>;

type Props = RouterLinkProps | AnchorProps | ButtonProps;

export default function AnimatedLink({ as = 'link', className = '', ...rest }: Props) {
    const combined = `${BASE} ${className}`;

    if (as === 'button') {
        return <button className={combined} {...(rest as ButtonProps)} />;
    }

    if (as === 'a') {
        return <a className={combined} {...(rest as AnchorProps)} />;
    }

    // По умолчанию возвращаем компонент Link из react-router-dom
    return <Link className={combined} {...(rest as RouterLinkProps)} />;
}
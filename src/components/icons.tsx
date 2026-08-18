// SVG paths sourced from Figma (Rs476eL9d5olYA1HMrrrOs) — Star 1, Line (Arrow up/down), Close, Arrow.
// stroke/fill use currentColor so callers can recolor via text color classes.

export function StarIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 23 22" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.5 0L14.2148 8.3553H23.0001L15.8926 13.5192L18.6074 21.8745L11.5 16.7106L4.39256 21.8745L7.10736 13.5192L-8.07221e-05 8.3553H8.7852L11.5 0Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function ChevronIcon({ className, direction = 'up' }: { className?: string; direction?: 'up' | 'down' }) {
    return (
        <svg
            viewBox="0 0 13 8"
            fill="none"
            className={className}
            style={{ transform: direction === 'down' ? 'rotate(180deg)' : undefined }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.361666 6.86167C3.63544 3.58789 6.5 0.723332 6.5 0.723332C9.77378 3.99711 12.6383 6.86167 12.6383 6.86167"
                stroke="currentColor"
                strokeWidth="1.02306"
            />
        </svg>
    );
}

export function CloseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.724725 0.724725L23.2753 23.2753M23.2753 0.724725L0.724725 23.2753"
                stroke="currentColor"
                strokeWidth="2.05005"
            />
        </svg>
    );
}

export function CarouselArrowIcon({ className, direction = 'left' }: { className?: string; direction?: 'left' | 'right' }) {
    // Base path (unflipped) renders pointing right — flip it for "left".
    return (
        <svg
            viewBox="0 0 17 30"
            fill="none"
            className={className}
            style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.721116 29.2789C8.33652 21.6635 15 15 15 15C7.38459 7.38459 0.721116 0.721116 0.721116 0.721116"
                stroke="currentColor"
                strokeWidth="2.03984"
            />
        </svg>
    );
}

// Rotate-360 hint icon over the 3D viewer. viewBox is the Figma 32x32 artboard;
// stroke-width is set from the outside so the 24px mobile size keeps the same
// 1.5px visual stroke as the 32px desktop one.
export function Rotate360Icon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.3598 23.8399C19.3598 23.8399 18.1065 30.0532 15.7732 30.0532C12.9465 30.0532 10.6665 23.7732 10.6665 15.9999C10.6665 8.22653 12.9465 1.94653 15.7732 1.94653C18.1065 1.94653 19.3598 5.4932 19.3598 5.4932" stroke="currentColor" strokeMiterlimit="10" />
            <path d="M21.7733 3.11179L20.0135 6.15957L16.4399 5.202" stroke="currentColor" strokeMiterlimit="10" />
            <path d="M14.5068 20.6934C26.6669 20.6934 30.0534 18.1067 30.0534 15.7734C30.0534 12.9467 23.7734 10.6667 16.0001 10.6667C8.22678 10.6667 1.94678 12.9467 1.94678 15.7734C1.94678 18.1067 6.82678 19.36 6.82678 19.36" stroke="currentColor" strokeMiterlimit="10" />
            <path d="M4.29346 21L7.49346 19.3467L5.85346 16.16" stroke="currentColor" strokeMiterlimit="10" />
        </svg>
    );
}

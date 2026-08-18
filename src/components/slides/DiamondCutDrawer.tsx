import { useRef, useState, type TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialDrawer from '../../pages/RingConfigure/components/MaterialDrawer';
import { diamondCutsData } from '../../pages/RingConfigure/data';

interface DiamondCutDrawerProps {
    isOpen: boolean;
    initialSlide: number;
    onClose: () => void;
}

// Reuses the configurator's "choose your diamond cut" drawer for a browse-only
// preview on the home page — there is no selection to apply here, so the
// bottom button just sends the visitor into the real configurator instead.
export default function DiamondCutDrawer({ isOpen, initialSlide, onClose }: DiamondCutDrawerProps) {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(initialSlide);
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    // Re-sync to whichever card was just clicked — done during render (React's
    // documented pattern for resetting state from a prop) rather than in an
    // effect, so it doesn't cost an extra paint that would skip the drawer's
    // closed→open CSS transition.
    const [prevInitialSlide, setPrevInitialSlide] = useState(initialSlide);
    if (initialSlide !== prevInitialSlide) {
        setPrevInitialSlide(initialSlide);
        setCurrentSlide(initialSlide);
        setIsTextExpanded(false);
    }

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0].clientX;
        touchEndX.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
        touchEndX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (isTextExpanded) return;

        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) <= 50) return;

        if (diff > 0 && currentSlide < diamondCutsData.length - 1) {
            setCurrentSlide((slide) => slide + 1);
            setIsTextExpanded(false);
        }

        if (diff < 0 && currentSlide > 0) {
            setCurrentSlide((slide) => slide - 1);
            setIsTextExpanded(false);
        }
    };

    const handleCreateRing = () => {
        onClose();
        navigate('/ring-configure');
    };

    return (
        <MaterialDrawer
            isOpen={isOpen}
            items={diamondCutsData}
            currentSlide={currentSlide}
            isTextExpanded={isTextExpanded}
            onClose={onClose}
            onApply={handleCreateRing}
            applyLabel="Create your ring"
            onSlideChange={setCurrentSlide}
            onPreviousSlide={() => setCurrentSlide((slide) => Math.max(0, slide - 1))}
            onNextSlide={() => setCurrentSlide((slide) => Math.min(diamondCutsData.length - 1, slide + 1))}
            onToggleTextExpanded={() => setIsTextExpanded((v) => !v)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        />
    );
}

import { Outlet } from 'react-router-dom';
import StaticHeader from './StaticHeader';

// Footer lives inside Home (slide 3 only) — not in the global layout
export default function StaticLayout() {
    return (
        // overflow-x:clip clips the popup's off-screen translated position
        // without creating a scroll container (unlike overflow-x:hidden).
        <div className="min-h-screen flex flex-col bg-[#ffffff]" style={{ overflowX: 'clip' }}>
            <StaticHeader />
            {/* Content area — full width, no max-width constraint here so slides can be edge-to-edge */}
            <main className="h-full">
                <Outlet />
            </main>
        </div>
    );
}

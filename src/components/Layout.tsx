import { Outlet } from 'react-router-dom';
import Header from './Header';

// Footer lives inside Home (slide 3 only) — not in the global layout
export default function Layout() {
    return (
        // Full-screen lock — no global scroll
        <div className="h-screen overflow-hidden bg-[#ffffff]">
            <Header />
            {/* Content area — full width, no max-width constraint here so slides can be edge-to-edge */}
            <main className="h-full">
                <Outlet />
            </main>
        </div>
    );
}

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import './CaratsLoader.css';

export default function CaratsLoader() {
    const { progress, active } = useProgress();
    const [show, setShow] = useState(true);

    // Wait a bit before fully hiding the loader for a smoother transition
    useEffect(() => {
        if (active) {
            setShow(true);
            return;
        }

        if (!active && progress === 100) {
            const timeout = setTimeout(() => setShow(false), 800);
            return () => clearTimeout(timeout);
        }
    }, [active, progress]);

    if (!show) return null;

    return (
        <div className={`carats-loader-container ${!active && progress === 100 ? 'fade-out' : ''}`}>
            <div className="carats-logo-container">
                <h1 className="carats-logo-text font-orbitron">EVERYDAY CARATS</h1>
                <div className="carats-progress-bar-bg">
                    <div
                        className="carats-progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="carats-progress-text">{Math.round(progress)}%</p>
            </div>
        </div>
    );
}

import { sanityImageUrl, type HomeMedia } from '../utils/homeContent';

interface SlideMediaProps {
    media?: HomeMedia;
    edgeFade?: boolean;
}

function EdgeFade() {
    return (
        <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, white 0%, transparent 25%)' }}
        />
    );
}

export default function SlideMedia({ media, edgeFade = false }: SlideMediaProps) {
    if (!media) return null;

    if (media.type === 'video') {
        return (
            <div className="w-[260px] h-[260px] md:w-[545px] md:h-[545px] desktop:w-[516px] desktop:h-[516px] relative bg-transparent rounded-sm flex items-center justify-center overflow-hidden shrink-0">
                {edgeFade && <EdgeFade />}
                <video
                    // Remount on source change — swapping <source src> alone does not reload a playing video.
                    key={media.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={sanityImageUrl(media.posterUrl)}
                    className="w-full h-full object-contain"
                >
                    <source src={media.videoUrl} type={media.videoMimeType ?? 'video/webm'} />
                </video>
            </div>
        );
    }

    return (
        <div className="w-[260px] h-[260px] md:w-[545px] md:h-[545px] desktop:w-[516px] desktop:h-[516px] relative bg-[#f5f5f5] rounded-sm flex items-center justify-center overflow-hidden shrink-0">
            {edgeFade && <EdgeFade />}
            <img loading="lazy" src={sanityImageUrl(media.imageUrl)} alt={media.imageAlt ?? ''} className="w-full h-full object-contain" />
        </div>
    );
}

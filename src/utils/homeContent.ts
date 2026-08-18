export type HomeMedia = {
    type: "image" | "video";
    imageUrl?: string;
    imageAlt?: string;
    videoUrl?: string;
    videoMimeType?: string;
    posterUrl?: string;
};

export type ReviewItem = {
    author: string;
    rating: number;
    reviewTitle: string;
    text: string;
    date: string;
    verifiedBy: string;
};

export type DiamondForm = {
    name: string;
    image: string;
    linkLabel: string;
    linkHref: string;
};

export type ProductSlide = {
    kind: "product";
    title: string;
    badge?: string;
    subtitle?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    priceNote?: string;
    priceValue?: string;
    contactLabel?: string;
    contactEmail?: string;
    edgeFade: boolean;
    media?: HomeMedia;
};

export type ReviewsSlide = {
    kind: "reviews";
    title: string;
    reviews: ReviewItem[];
};

export type DiamondFormsSlide = {
    kind: "forms";
    title: string;
    forms: DiamondForm[];
};

export type HomeSlide = ProductSlide | ReviewsSlide | DiamondFormsSlide;

// Raw shape coming back from Sanity — every field can be missing or null.
export type HomeSlideDocument = {
    _type?: "productSlide" | "reviewsSlide" | "diamondFormsSlide" | null;
    title?: string | null;
    badge?: string | null;
    subtitle?: string | null;
    description?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    priceNote?: string | null;
    priceValue?: string | null;
    contactLabel?: string | null;
    contactEmail?: string | null;
    edgeFade?: boolean | null;
    media?: {
        type?: string | null;
        imageUrl?: string | null;
        imageAlt?: string | null;
        videoUrl?: string | null;
        videoMimeType?: string | null;
        posterUrl?: string | null;
    } | null;
    reviews?: Array<{
        author?: string | null;
        rating?: number | null;
        reviewTitle?: string | null;
        text?: string | null;
        date?: string | null;
        verifiedBy?: string | null;
    }> | null;
    forms?: Array<{
        name?: string | null;
        image?: string | null;
        linkLabel?: string | null;
        linkHref?: string | null;
    }> | null;
};

// Rendered whenever Sanity has no home page document yet — keeps the site
// looking exactly as it did before the content was moved into the CMS.
export const HOME_SLIDES_FALLBACK: HomeSlide[] = [
    {
        kind: "product",
        title: "Diamond Solitaire Ring",
        subtitle: "Designed by you.\nBrought to life by us.",
        ctaLabel: "Create your ring",
        ctaHref: "/ring-configure",
        priceNote: "Laboratory-grown diamonds",
        priceValue: "Starting from $600",
        edgeFade: true,
        media: {
            type: "video",
            videoUrl: "/vid/Hero.webm",
            videoMimeType: "video/webm",
            posterUrl: "/img/Ring_poster.webp",
        },
    },
    {
        kind: "reviews",
        title: "What People Are Saying",
        reviews: [
            {
                author: "Phillipa Tucker",
                rating: 5,
                reviewTitle: "The jewelry is stunning!!!",
                text: "The jewelry is stunning!!! So classy and different. I'm hooked.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "S Janjua",
                rating: 5,
                reviewTitle: "I have seen the influencers use over.",
                text: "I have seen the influencers use over the years and I trusted them. So I tried. Received great quality for the price.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "Hemi Rajput",
                rating: 5,
                reviewTitle: "This company is unmatched in it's...",
                text: "This company is unmatched in it's quality, diamond sparkle and amazing customer service! Fast shipping too.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "Lynne R.",
                rating: 5,
                reviewTitle: "First time purchasing this brand",
                text: "First time purchasing this brand. The solid hoop earrings with the single small pear dangle are gorgeous.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "Phillipa Tucker",
                rating: 5,
                reviewTitle: "The jewelry is stunning!!!",
                text: "The jewelry is stunning!!! So classy and different. I'm hooked.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "S Janjua",
                rating: 5,
                reviewTitle: "I have seen the influencers use over.",
                text: "I have seen the influencers use over the years and I trusted them. So I tried. Received great quality for the price.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "Hemi Rajput",
                rating: 5,
                reviewTitle: "This company is unmatched in it's...",
                text: "This company is unmatched in it's quality, diamond sparkle and amazing customer service! Fast shipping too.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
            {
                author: "Lynne R.",
                rating: 5,
                reviewTitle: "First time purchasing this brand",
                text: "First time purchasing this brand. The solid hoop earrings with the single small pear dangle are gorgeous.",
                date: "June 8, 2026",
                verifiedBy: "Trustpilot",
            },
        ],
    },
    {
        kind: "forms",
        title: "The Right Form For You",
        forms: [
            { name: "Brilliant Cut", image: "/img/cut-brilliant.png", linkLabel: "Learn more", linkHref: "/ring-configure" },
            { name: "Oval Cut", image: "/img/cut-oval.png", linkLabel: "Learn more", linkHref: "/ring-configure" },
            { name: "Pear Shaped Cut", image: "/img/cut-pear.png", linkLabel: "Learn more", linkHref: "/ring-configure" },
        ],
    },
    {
        kind: "product",
        title: "Diamond Tennis Bracelet",
        subtitle: "Coming soon...",
        contactLabel: "info@e-mail",
        contactEmail: "info@example.com",
        edgeFade: false,
        media: {
            type: "image",
            imageUrl: "/img/Bracelet.jpg",
        },
    },
    {
        kind: "product",
        title: "Diamond Ear Studs",
        subtitle: "Coming soon...",
        contactLabel: "info@e-mail",
        contactEmail: "info@example.com",
        edgeFade: false,
        media: {
            type: "image",
            imageUrl: "/img/Studs.jpg",
        },
    },
];

export const HOME_SLIDES_QUERY = `
    *[_type == "homePage"][0]{
        "slides": slides[]{
            _type,
            title,
            badge,
            subtitle,
            description,
            ctaLabel,
            ctaHref,
            priceNote,
            priceValue,
            contactLabel,
            contactEmail,
            edgeFade,
            media{
                type,
                "imageUrl": image.asset->url,
                "imageAlt": image.alt,
                "videoUrl": video.asset->url,
                "videoMimeType": video.asset->mimeType,
                "posterUrl": poster.asset->url
            },
            reviews[]{
                author,
                rating,
                reviewTitle,
                text,
                date,
                verifiedBy
            },
            forms[]{
                name,
                "image": image.asset->url,
                linkLabel,
                linkHref
            }
        }
    }
`;

const trimmed = (value?: string | null) => {
    const text = value?.trim();
    return text ? text : undefined;
};

// A media block is only usable once its asset actually resolved to a URL.
function toMedia(media?: HomeSlideDocument["media"]): HomeMedia | undefined {
    if (!media) return undefined;

    if (media.type === "video") {
        const videoUrl = trimmed(media.videoUrl);
        if (!videoUrl) return undefined;

        return {
            type: "video",
            videoUrl,
            videoMimeType: trimmed(media.videoMimeType),
            posterUrl: trimmed(media.posterUrl),
        };
    }

    const imageUrl = trimmed(media.imageUrl);
    if (!imageUrl) return undefined;

    return {
        type: "image",
        imageUrl,
        imageAlt: trimmed(media.imageAlt),
    };
}

function toReviews(reviews?: HomeSlideDocument["reviews"]): ReviewItem[] | undefined {
    const list = (reviews ?? [])
        .map((r) => {
            const author = trimmed(r?.author);
            const text = trimmed(r?.text);
            if (!author || !text) return undefined;
            return {
                author,
                rating: r?.rating ?? 5,
                reviewTitle: trimmed(r?.reviewTitle) ?? "",
                text,
                date: trimmed(r?.date) ?? "",
                verifiedBy: trimmed(r?.verifiedBy) ?? "Trustpilot",
            };
        })
        .filter((r): r is ReviewItem => Boolean(r));
    return list.length ? list : undefined;
}

function toForms(forms?: HomeSlideDocument["forms"]): DiamondForm[] | undefined {
    const list = (forms ?? [])
        .map((f) => {
            const name = trimmed(f?.name);
            const image = trimmed(f?.image);
            if (!name || !image) return undefined;
            return {
                name,
                image,
                linkLabel: trimmed(f?.linkLabel) ?? "Learn more",
                linkHref: trimmed(f?.linkHref) ?? "/ring-configure",
            };
        })
        .filter((f): f is DiamondForm => Boolean(f));
    return list.length ? list : undefined;
}

export function mergeHomeSlides(cmsSlides?: HomeSlideDocument[] | null): HomeSlide[] {
    if (!cmsSlides?.length) return HOME_SLIDES_FALLBACK;

    return cmsSlides.map((slide, index) => {
        // Slides beyond the fallback list (added by an editor) simply have no
        // fallback to fill from — whatever is missing stays hidden. A fallback
        // at this index only applies if it's the same slide kind, otherwise a
        // reordered/replaced slide would incorrectly inherit unrelated content.
        const candidateFallback = HOME_SLIDES_FALLBACK[index];
        const kindFromType: HomeSlide["kind"] =
            slide?._type === "reviewsSlide" ? "reviews" : slide?._type === "diamondFormsSlide" ? "forms" : "product";
        const fallback = candidateFallback?.kind === kindFromType ? candidateFallback : undefined;

        if (kindFromType === "reviews") {
            const reviewsFallback = fallback?.kind === "reviews" ? fallback : undefined;
            return {
                kind: "reviews",
                title: trimmed(slide?.title) ?? reviewsFallback?.title ?? "",
                reviews: toReviews(slide?.reviews) ?? reviewsFallback?.reviews ?? [],
            };
        }

        if (kindFromType === "forms") {
            const formsFallback = fallback?.kind === "forms" ? fallback : undefined;
            return {
                kind: "forms",
                title: trimmed(slide?.title) ?? formsFallback?.title ?? "",
                forms: toForms(slide?.forms) ?? formsFallback?.forms ?? [],
            };
        }

        const productFallback = fallback?.kind === "product" ? fallback : undefined;
        return {
            kind: "product",
            title: trimmed(slide?.title) ?? productFallback?.title ?? "",
            badge: trimmed(slide?.badge) ?? productFallback?.badge,
            subtitle: trimmed(slide?.subtitle) ?? productFallback?.subtitle,
            description: trimmed(slide?.description) ?? productFallback?.description,
            ctaLabel: trimmed(slide?.ctaLabel) ?? productFallback?.ctaLabel,
            ctaHref: trimmed(slide?.ctaHref) ?? productFallback?.ctaHref,
            priceNote: trimmed(slide?.priceNote) ?? productFallback?.priceNote,
            priceValue: trimmed(slide?.priceValue) ?? productFallback?.priceValue,
            contactLabel: trimmed(slide?.contactLabel) ?? productFallback?.contactLabel,
            contactEmail: trimmed(slide?.contactEmail) ?? productFallback?.contactEmail,
            edgeFade: slide?.edgeFade ?? productFallback?.edgeFade ?? false,
            media: toMedia(slide?.media) ?? productFallback?.media,
        };
    });
}

// Sanity's CDN resizes on the fly via query params; local fallback paths are
// left untouched.
export function sanityImageUrl(url?: string, width = 1228) {
    if (!url || !url.includes("cdn.sanity.io")) return url;

    return `${url}?w=${width}&q=80&auto=format`;
}

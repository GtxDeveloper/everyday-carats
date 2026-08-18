/**
 * One-off seed for the `homePage` document.
 *
 * Uploads the media that currently lives in /public and writes the five home
 * page slides into Sanity, so the content the site already shows becomes
 * editable in the Studio.
 *
 * Usage (from the repo root):
 *   1. Create an Editor token at https://sanity.io/manage → project 6y79s0vd → API → Tokens
 *   2. Put it in .env.local as SANITY_WRITE_TOKEN=... (.env.local is gitignored)
 *   3. node --env-file=.env.local scripts/seed-home.mjs
 *
 * Re-running overwrites the document, but uploads the media files again —
 * delete the stale assets in the Studio's media library if that happens.
 */

import { createReadStream } from 'node:fs';
import { basename } from 'node:path';
import { createClient } from '@sanity/client';

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
    console.error('SANITY_WRITE_TOKEN is not set. See the usage note at the top of this file.');
    process.exit(1);
}

const client = createClient({
    projectId: '6y79s0vd',
    dataset: 'production',
    apiVersion: '2024-03-01',
    token,
    useCdn: false,
});

async function upload(kind, publicPath) {
    const fileUrl = new URL(`../${publicPath}`, import.meta.url);
    const asset = await client.assets.upload(kind, createReadStream(fileUrl), {
        filename: basename(publicPath),
    });

    console.log(`uploaded ${publicPath} → ${asset._id}`);
    return asset._id;
}

const imageRef = (assetId, alt) => ({
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    ...(alt ? { alt } : {}),
});

const fileRef = (assetId) => ({
    _type: 'file',
    asset: { _type: 'reference', _ref: assetId },
});

async function seed() {
    const [heroVideo, heroPoster, bracelet, earStuds, cutBrilliant, cutOval, cutPear] = await Promise.all([
        upload('file', 'public/vid/Hero.webm'),
        upload('image', 'public/img/Ring_poster.webp'),
        upload('image', 'public/img/Bracelet.jpg'),
        upload('image', 'public/img/Studs.jpg'),
        upload('image', 'public/img/cut-brilliant.png'),
        upload('image', 'public/img/cut-oval.png'),
        upload('image', 'public/img/cut-pear.png'),
    ]);

    const document = {
        _id: 'homePage',
        _type: 'homePage',
        slides: [
            {
                _type: 'productSlide',
                _key: 'solitaireRing',
                title: 'Diamond Solitaire Ring',
                subtitle: 'Designed by you.\nBrought to life by us.',
                ctaLabel: 'Create your ring',
                ctaHref: '/ring-configure',
                priceNote: 'Laboratory-grown diamonds',
                priceValue: 'Starting from $600',
                edgeFade: true,
                media: {
                    type: 'video',
                    video: fileRef(heroVideo),
                    poster: imageRef(heroPoster),
                },
            },
            {
                _type: 'reviewsSlide',
                _key: 'reviews',
                title: 'What People Are Saying',
                reviews: [
                    {
                        _key: 'review1',
                        author: 'Phillipa Tucker',
                        rating: 5,
                        reviewTitle: 'The jewelry is stunning!!!',
                        text: "The jewelry is stunning!!! So classy and different. I'm hooked.",
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review2',
                        author: 'S Janjua',
                        rating: 5,
                        reviewTitle: 'I have seen the influencers use over.',
                        text: 'I have seen the influencers use over the years and I trusted them. So I tried. Received great quality for the price.',
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review3',
                        author: 'Hemi Rajput',
                        rating: 5,
                        reviewTitle: "This company is unmatched in it's...",
                        text: "This company is unmatched in it's quality, diamond sparkle and amazing customer service! Fast shipping too.",
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review4',
                        author: 'Lynne R.',
                        rating: 5,
                        reviewTitle: 'First time purchasing this brand',
                        text: 'First time purchasing this brand. The solid hoop earrings with the single small pear dangle are gorgeous.',
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review5',
                        author: 'Phillipa Tucker',
                        rating: 5,
                        reviewTitle: 'The jewelry is stunning!!!',
                        text: "The jewelry is stunning!!! So classy and different. I'm hooked.",
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review6',
                        author: 'S Janjua',
                        rating: 5,
                        reviewTitle: 'I have seen the influencers use over.',
                        text: 'I have seen the influencers use over the years and I trusted them. So I tried. Received great quality for the price.',
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review7',
                        author: 'Hemi Rajput',
                        rating: 5,
                        reviewTitle: "This company is unmatched in it's...",
                        text: "This company is unmatched in it's quality, diamond sparkle and amazing customer service! Fast shipping too.",
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                    {
                        _key: 'review8',
                        author: 'Lynne R.',
                        rating: 5,
                        reviewTitle: 'First time purchasing this brand',
                        text: 'First time purchasing this brand. The solid hoop earrings with the single small pear dangle are gorgeous.',
                        date: 'June 8, 2026',
                        verifiedBy: 'Trustpilot',
                    },
                ],
            },
            {
                _type: 'diamondFormsSlide',
                _key: 'diamondForms',
                title: 'The Right Form For You',
                forms: [
                    {
                        _key: 'brilliant',
                        name: 'Brilliant Cut',
                        image: imageRef(cutBrilliant, 'Brilliant Cut'),
                        linkLabel: 'Learn more',
                        linkHref: '/ring-configure',
                    },
                    {
                        _key: 'oval',
                        name: 'Oval Cut',
                        image: imageRef(cutOval, 'Oval Cut'),
                        linkLabel: 'Learn more',
                        linkHref: '/ring-configure',
                    },
                    {
                        _key: 'pear',
                        name: 'Pear Shaped Cut',
                        image: imageRef(cutPear, 'Pear Shaped Cut'),
                        linkLabel: 'Learn more',
                        linkHref: '/ring-configure',
                    },
                ],
            },
            {
                _type: 'productSlide',
                _key: 'tennisBracelet',
                title: 'Diamond Tennis Bracelet',
                subtitle: 'Coming soon...',
                contactLabel: 'info@e-mail',
                contactEmail: 'info@example.com',
                edgeFade: false,
                media: {
                    type: 'image',
                    image: imageRef(bracelet, 'Diamond Tennis Bracelet'),
                },
            },
            {
                _type: 'productSlide',
                _key: 'earStuds',
                title: 'Diamond Ear Studs',
                subtitle: 'Coming soon...',
                contactLabel: 'info@e-mail',
                contactEmail: 'info@example.com',
                edgeFade: false,
                media: {
                    type: 'image',
                    image: imageRef(earStuds, 'Diamond Ear Studs'),
                },
            },
        ],
    };

    await client.createOrReplace(document);
    console.log(`published homePage with ${document.slides.length} slides`);
}

seed().catch((error) => {
    console.error('Seeding failed:', error.message ?? error);
    process.exit(1);
});

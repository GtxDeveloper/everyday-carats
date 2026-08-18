import { defineField, defineType } from 'sanity'

const productSlide = defineField({
    name: 'productSlide',
    title: 'Product Slide',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'badge',
            title: 'Badge',
            description: 'Small label above the title, e.g. "Coming Soon...". Leave empty to hide.',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            description: 'Line under the title, e.g. "Coming soon..." or a two-line tagline.',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'Body paragraph, e.g. for "coming soon" products.',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'ctaLabel',
            title: 'Button Label',
            description: 'Leave empty to hide the button.',
            type: 'string',
        }),
        defineField({
            name: 'ctaHref',
            title: 'Button Link',
            description: 'Path inside the site, e.g. /ring-configure',
            type: 'string',
            hidden: ({ parent }) => !parent?.ctaLabel,
        }),
        defineField({
            name: 'priceNote',
            title: 'Price Note',
            description: 'Small line above the price, e.g. "Laboratory-grown diamonds".',
            type: 'string',
        }),
        defineField({
            name: 'priceValue',
            title: 'Price Value',
            description: 'e.g. "Starting from $600". Leave empty to hide the price block.',
            type: 'string',
        }),
        defineField({
            name: 'contactLabel',
            title: 'Contact Label',
            description: 'Text shown after "to order it now:". Leave empty to hide the line.',
            type: 'string',
        }),
        defineField({
            name: 'contactEmail',
            title: 'Contact Email',
            description: 'Address the contact label links to.',
            type: 'string',
            hidden: ({ parent }) => !parent?.contactLabel,
        }),
        defineField({
            name: 'edgeFade',
            title: 'White fade on the left edge',
            description: 'Blends media that has a white background into the page.',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'media',
            title: 'Media',
            type: 'object',
            options: { collapsible: true, collapsed: false },
            fields: [
                defineField({
                    name: 'type',
                    title: 'Media Type',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Image', value: 'image' },
                            { title: 'Video', value: 'video' },
                        ],
                        layout: 'radio',
                    },
                    initialValue: 'image',
                }),
                defineField({
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                        }),
                    ],
                    hidden: ({ parent }) => parent?.type === 'video',
                }),
                defineField({
                    name: 'video',
                    title: 'Video File',
                    description: 'Plays muted on loop. WebM keeps the file small.',
                    type: 'file',
                    options: {
                        accept: 'video/webm,video/mp4',
                    },
                    hidden: ({ parent }) => parent?.type !== 'video',
                }),
                defineField({
                    name: 'poster',
                    title: 'Video Poster',
                    description: 'Shown while the video loads.',
                    type: 'image',
                    hidden: ({ parent }) => parent?.type !== 'video',
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            mediaType: 'media.type',
            image: 'media.image',
            poster: 'media.poster',
        },
        prepare({ title, subtitle, mediaType, image, poster }) {
            return {
                title: title || 'Untitled product slide',
                subtitle: subtitle || (mediaType === 'video' ? 'Video' : 'Image'),
                media: mediaType === 'video' ? poster : image,
            }
        },
    },
})

const reviewsSlide = defineField({
    name: 'reviewsSlide',
    title: 'Reviews Slide',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            initialValue: 'What People Are Saying',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'reviews',
            title: 'Reviews',
            type: 'array',
            of: [
                defineField({
                    name: 'review',
                    title: 'Review',
                    type: 'object',
                    fields: [
                        defineField({ name: 'author', title: 'Author', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'rating', title: 'Rating (1-5 stars)', type: 'number', initialValue: 5, validation: (Rule) => Rule.min(1).max(5) }),
                        defineField({ name: 'reviewTitle', title: 'Review Title', type: 'string' }),
                        defineField({ name: 'text', title: 'Review Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
                        defineField({ name: 'date', title: 'Date', description: 'Shown as free text, e.g. "June 8, 2026".', type: 'string' }),
                        defineField({ name: 'verifiedBy', title: 'Verified By', type: 'string', initialValue: 'Trustpilot' }),
                    ],
                    preview: {
                        select: { title: 'author', subtitle: 'reviewTitle' },
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: { title: 'title', reviews: 'reviews' },
        prepare({ title, reviews }) {
            const count = Array.isArray(reviews) ? reviews.length : 0
            return { title: title || 'Reviews slide', subtitle: `${count} review${count === 1 ? '' : 's'}` }
        },
    },
})

const diamondFormsSlide = defineField({
    name: 'diamondFormsSlide',
    title: 'Diamond Forms Slide',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            initialValue: 'The Right Form For You',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'forms',
            title: 'Diamond Cuts',
            type: 'array',
            of: [
                defineField({
                    name: 'form',
                    title: 'Diamond Cut',
                    type: 'object',
                    fields: [
                        defineField({ name: 'name', title: 'Name', description: 'e.g. "Brilliant Cut".', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
                        defineField({ name: 'linkLabel', title: 'Link Label', type: 'string', initialValue: 'Learn more' }),
                        defineField({ name: 'linkHref', title: 'Link', description: 'Path inside the site, e.g. /ring-configure', type: 'string', initialValue: '/ring-configure' }),
                    ],
                    preview: {
                        select: { title: 'name', media: 'image' },
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: { title: 'title', forms: 'forms' },
        prepare({ title, forms }) {
            const count = Array.isArray(forms) ? forms.length : 0
            return { title: title || 'Diamond forms slide', subtitle: `${count} cut${count === 1 ? '' : 's'}` }
        },
    },
})

export const homePageType = defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'slides',
            title: 'Slides',
            description: 'Full-screen cards of the home page, in scroll order. The footer is attached to the last one.',
            type: 'array',
            of: [productSlide, reviewsSlide, diamondFormsSlide],
        }),
    ],
    preview: {
        select: {
            slides: 'slides',
        },
        prepare({ slides }) {
            const count = Array.isArray(slides) ? slides.length : 0
            return {
                title: 'Home Page',
                subtitle: `${count} slide${count === 1 ? '' : 's'}`,
            }
        },
    },
})

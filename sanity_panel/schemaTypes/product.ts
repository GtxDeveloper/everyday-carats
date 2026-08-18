import { defineField, defineType } from 'sanity'

export const productType = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'modelVariants',
            title: '3D Model Variants',
            type: 'array',
            of: [
                defineField({
                    name: 'modelVariant',
                    title: 'Model Variant',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'cut',
                            title: 'Diamond Cut',
                            type: 'string',
                            options: {
                                list: ['Brilliant Cut', 'Oval Cut', 'Pear-Shaped Cut'],
                                layout: 'radio',
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'weight',
                            title: 'Diamond Weight',
                            type: 'string',
                            options: {
                                list: ['0.50ct', '1.00ct', '1.50ct'],
                                layout: 'radio',
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'setting',
                            title: 'Diamond Setting',
                            type: 'string',
                            options: {
                                list: ['Classic Band', 'Pav\u00E9 Finish'],
                                layout: 'radio',
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'mounting',
                            title: 'Stone Mounting',
                            type: 'string',
                            options: {
                                list: ['Classic', 'Fang'],
                                layout: 'radio',
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'price',
                            title: 'Price EUR',
                            type: 'number',
                            validation: (Rule) => Rule.required().min(0),
                        }),
                        defineField({
                            name: 'modelFile',
                            title: 'GLB Model File',
                            type: 'file',
                            options: {
                                accept: '.glb,model/gltf-binary',
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'isDefault',
                            title: 'Use as fallback model',
                            type: 'boolean',
                            initialValue: false,
                        }),
                    ],
                    preview: {
                        select: {
                            cut: 'cut',
                            weight: 'weight',
                            setting: 'setting',
                            mounting: 'mounting',
                            price: 'price',
                            isDefault: 'isDefault',
                        },
                        prepare({ cut, weight, setting, mounting, price, isDefault }) {
                            return {
                                title: [cut, weight, setting, mounting].filter(Boolean).join(' / '),
                                subtitle: `${isDefault ? 'Fallback model' : 'Configured model'}${typeof price === 'number' ? ` - ${price} EUR` : ''}`,
                            }
                        },
                    },
                }),
            ],
        }),
    ],
    preview: {
        select: {
            modelVariants: 'modelVariants',
        },
        prepare({ modelVariants }) {
            const count = Array.isArray(modelVariants) ? modelVariants.length : 0
            return {
                title: 'Diamond Solitaire Ring',
                subtitle: `${count} model variant${count === 1 ? '' : 's'}`,
            }
        },
    },
})

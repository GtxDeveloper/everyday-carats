export const STEPS = [
    {
        id: 1,
        slug: "material",
        title: "Choose your material",
        hasInfo: true,
        options: ["18KT White Gold", "18KT Yellow Gold", "18KT Rose Gold"],
    },
    {
        id: 2,
        slug: "diamond-cut",
        title: "Choose your diamond cut",
        hasInfo: true,
        options: ["Brilliant Cut", "Oval Cut", "Pear-Shaped Cut"],
    },
    {
        id: 3,
        slug: "diamond-weight",
        title: "Choose your diamond weight",
        hasInfo: false,
        options: ["0.50ct", "1.00ct", "1.50ct"],
    },
    {
        id: 5,
        slug: "stone-mounting",
        title: "Choose your stone mounting",
        hasInfo: false,
        options: ["Classic", "Fang"],
    },
    {
        id: 4,
        slug: "diamond-setting",
        title: "Choose your diamond setting",
        hasInfo: false,
        options: ["Classic Band", "Pav\u00E9 Finish"],
    },
] as const;

export const materialsData = [
    {
        name: "18KT White Gold",
        image: "/img/white.jpg",
        slogan: "Luminous, pure and refined",
        text: [
            "18KT White Gold is created by melting pure 24KT Gold and blending it with white metals such as palladium, silver, or nickel. For this process we use temperatures above 1,000\u00B0C for the metals to fuse into a uniform alloy. The final piece is finished with rhodium - a member of the platinum family - to enhance its bright white surface and increase scratch resistance.",
            "18KT Gold is 75% pure, which has been considered for decades to be the perfect proportion of value and durability. Pure gold is simply too soft and gentle for everyday use.",
        ],
    },
    {
        name: "18KT Yellow Gold",
        image: "/img/yellow.jpg",
        slogan: "Radiant glow, enduring appeal",
        text: [
            "Celebrated for its classic, radiant glow and enduring appeal. Composed of 75% pure gold, it delivers a rich color and luxurious finish that has defined fine jewelry for centuries, making it a timeless choice for both traditional and modern designs.",
            "18KT Gold is 75% pure, which has been considered for decades to be the perfect proportion of value and durability. Pure gold is simply too soft and gentle for everyday use.",
        ],
    },
    {
        name: "18KT Rose Gold",
        image: "/img/rose.jpg",
        slogan: "A warm, romantic tone",
        text: [
            "Created by blending pure gold with copper alloys. Its soft blush hue adds a contemporary yet timeless character to any design, complementing a wide range of skin tones while maintaining the durability and richness of fine gold.",
            "18KT Gold is 75% pure, which has been considered for decades to be the perfect proportion of value and durability. Pure gold is simply too soft and gentle for everyday use.",
        ],
    },
] as const;

export const diamondCutsData = [
    {
        name: "Brilliant Cut",
        placeholder: "Brilliant Cut",
        slogan: "Iconic, symmetrical and sparkling",
        text: [
            "The Brilliant Cut is masterfully crafted to maximize light performance and exceptional brilliance. After careful planning, the diamond is precisely cut with 57 facets. The result is a timeless cut renowned for its extraordinary radiance, balanced symmetry, and captivating luminosity.",
        ],
    },
    {
        name: "Oval Cut",
        placeholder: "Oval Cut",
        slogan: "Elegant, striking and modern",
        text: [
            "The Oval Cut Diamond is designed to combine brilliance with an elongated oval look. Carefully calculated length-to-width ratio enhances visual size while maintaining balanced symmetry, making it a refined choice for maximizing both radiance and size.",
        ],
    },
    {
        name: "Pear-Shaped Cut",
        placeholder: "Pear-Shaped Cut",
        slogan: "Graceful, sophisticated and stunning",
        text: [
            "The pear shape, also known as the teardrop cut for its resemblance to a droplet of water, combines the best features of the brilliant and marquise cuts. Its carefully calculated length-to-width ratio ensures a balanced, graceful appearance-neither too narrow nor too wide-making it one of the most unique and sophisticated diamond shapes.",
        ],
    },
] as const;

export type Step = (typeof STEPS)[number];
export type MaterialInfo = (typeof materialsData)[number];
export type DrawerInfo = (typeof materialsData)[number] | (typeof diamondCutsData)[number];

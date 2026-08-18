import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: "6y79s0vd",
    dataset: "production",
    apiVersion: "2024-03-01",
    useCdn: true,
});

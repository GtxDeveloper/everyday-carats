import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Everyday Carats',

  projectId: '6y79s0vd',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Home Page is a singleton — always the same document, never a list.
            S.listItem()
              .id('homePage')
              .title('Home Page')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            S.documentTypeListItem('product').title('Products'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Prevents creating a second Home Page from the global "create" menu.
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'homePage'),
  },
})

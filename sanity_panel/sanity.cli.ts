import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '6y79s0vd',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'kz7w26reabjuyjsva71gm45f',
  }
})

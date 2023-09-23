import path from 'node:path'
import type { AstroIntegration } from 'astro'
import { getMarkdownFiles, getSlugFromFilePath, writeJson } from './utils.js'
import { getRedirects } from './getRedirects.js'

export type GetSlug = (filePath: string) => string

export type PluginOptions = {
  contentDir?: string
  getSlug?: GetSlug
}

export type Redirects = { [old: string]: string }

export default function astroRedirectFrom({
  contentDir = 'src/pages/',
  getSlug = getSlugFromFilePath
}: PluginOptions): AstroIntegration {
  const contentDirPath = path.join(process.cwd(), contentDir)

  return {
    name: 'redirect-from',
    hooks: {
      'astro:config:setup': async ({
        config,
        command,
        updateConfig,
        logger
      }) => {
        try {
          const markdownFiles = await getMarkdownFiles(contentDirPath)
          if (!markdownFiles?.length) {
            logger.warn('No markdown files found')
            return
          }

          const redirects = await getRedirects(
            markdownFiles,
            contentDirPath,
            getSlug,
            command
          )
          if (!redirects || !Object.keys(redirects).length) {
            logger.info('No redirects found in markdown files')
            return
          }

          updateConfig({ redirects })

          const redirectFilePath = path.join(
            config.cacheDir.pathname, // Default is ./node_modules/.astro/
            'redirect_from.json'
          )
          await writeJson(redirectFilePath, redirects)

          logger.info(
            `Added ${Object.keys(redirects).length} redirects to Astro config`
          )
        } catch (error: any) {
          logger.error((error as Error).message)
        }
      }
    }
  }
}

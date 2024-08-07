import path from 'node:path'
import fs from 'node:fs'
import type { AstroIntegration } from 'astro'
import { getRedirects } from './getRedirects.js'
import { getMarkdownFiles, getSlugFromFilePath, writeJson } from './utils.js'

export type GetSlug = (filePath: string) => string

export type PluginOptions = {
  contentDir?: string
  getSlug?: GetSlug
}

export type HookOptions = Parameters<
  AstroIntegration['hooks']['astro:config:setup'] & { 0: number }
>[0]

export type Redirects = { [old: string]: string }

export async function initPlugin(
  hookOptions: HookOptions,
  options?: PluginOptions
) {
  const _contentDir = options?.contentDir || 'src/pages/'
  const _getSlug = options?.getSlug || getSlugFromFilePath
  const _contentDirPath = path.join(process.cwd(), _contentDir)
  const { logger, config, command, updateConfig } = hookOptions

  try {
    const markdownFiles = await getMarkdownFiles(_contentDirPath)
    if (!markdownFiles?.length) {
      logger.warn('No markdown files found')
      return
    }

    const redirects = await getRedirects(
      markdownFiles,
      _contentDirPath,
      _getSlug,
      command,
      logger
    )
    if (!redirects || !Object.keys(redirects).length) {
      logger.warn('No redirects found in markdown files')
      return
    }

    updateConfig({ redirects })

    if (!fs.existsSync(config.cacheDir.pathname)) {
      fs.mkdirSync(config.cacheDir.pathname, { recursive: true })
    }
    const redirectFilePath = path.join(
      config.cacheDir.pathname, // Default is ./node_modules/.astro/
      'redirect_from.json'
    )
    await writeJson(redirectFilePath, redirects)

    logger.info(
      `Added ${Object.keys(redirects).length} redirects to Astro config`
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)
  }
}

export default function astroRedirectFrom(
  options?: PluginOptions
): AstroIntegration {
  return {
    name: 'redirect-from',
    hooks: {
      'astro:config:setup': async (hookOptions) =>
        await initPlugin(hookOptions, options)
    }
  }
}

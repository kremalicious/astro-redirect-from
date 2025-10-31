import path from 'node:path'
import type { Redirects } from '.'
import { createRedirect } from './createRedirect.js'
import { getMarkdownFrontmatter } from './utils.js'

function isValidDomainRelativePath(path: string): boolean {
  return !path.includes('://') && !path.includes(' ') && !path.includes('\n')
}

export async function getRedirects(
  files: string[],
  srcDir: string,
  getSlug: (filePath: string) => string,
  command: 'dev' | 'build' | 'preview' | 'sync',
  logger: { warn: (msg: string) => void },
  basePath?: string
) {
  let redirects: Redirects = {}

  for (const file of files) {
    const frontmatter = await getMarkdownFrontmatter(path.join(srcDir, file))
    let redirectFrom: string[] = []

    if (frontmatter?.redirect_from) {
      if (typeof frontmatter?.redirect_from === 'string') {
        redirectFrom = [frontmatter.redirect_from]
      } else if (Array.isArray(frontmatter?.redirect_from)) {
        redirectFrom = frontmatter.redirect_from
      } else {
        logger.warn(
          `Unexpected type ${typeof frontmatter?.redirect_from} for redirect_from in file: ${file}`
        )
      }
    }

    redirectFrom = redirectFrom.filter((redirect) => {
      if (isValidDomainRelativePath(redirect)) {
        return true
      }
      logger.warn(`Invalid redirect path: ${redirect} in file: ${file}`)
      return false
    })

    const isExcluded = command === 'build' && frontmatter?.draft === true
    if (!frontmatter || !redirectFrom.length || isExcluded) continue

    const postSlug = frontmatter.slug || getSlug(file)
    if (!postSlug) continue

    redirects = createRedirect(redirects, redirectFrom, postSlug, basePath)
  }

  return redirects
}

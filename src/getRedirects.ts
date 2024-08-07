import path from 'node:path'
import type { Redirects } from '.'
import { createRedirect } from './createRedirect.js'
import { getMarkdownFrontmatter } from './utils.js'

function isValidDomainRelativePath(path: string): boolean {
  return path.startsWith('/') && !path.includes('://')
}

export async function getRedirects(
  files: string[],
  srcDir: string,
  getSlug: (filePath: string) => string,
  command: 'dev' | 'build' | 'preview',
  logger: any }
) {
  let redirects: Redirects = {}

  for (const file of files) {
    const frontmatter = await getMarkdownFrontmatter(path.join(srcDir, file))
    let redirectFrom: string[] = []

    if (typeof frontmatter?.redirect_from === 'string') {
      redirectFrom = [frontmatter.redirect_from]
    } else if (Array.isArray(frontmatter?.redirect_from)) {
      redirectFrom = frontmatter.redirect_from
    } else if (frontmatter?.redirect_from) {
      logger.warn(`Unexpected type for redirect_from in file: ${file}`)
    }

    redirectFrom = redirectFrom.filter(redirect => {
      if (isValidDomainRelativePath(redirect)) {
        return true
      } else {
        logger.warn(`Invalid redirect path: ${redirect} in file: ${file}`)
        return false
      }
    })

    const isExcluded = command === 'build' && frontmatter?.draft === true
    if (!frontmatter || !redirectFrom.length || isExcluded) continue

    const postSlug = frontmatter.slug || getSlug(file)
    if (!postSlug) continue

    redirects = createRedirect(redirects, redirectFrom, postSlug)
  }

  return redirects
}

import path from 'node:path'
import type { Redirects } from '.'
import { createRedirect } from './createRedirect.js'
import { getMarkdownFrontmatter } from './utils.js'

export async function getRedirects(
  files: string[],
  srcDir: string,
  getSlug: (filePath: string) => string,
  command: 'dev' | 'build' | 'preview'
) {
  let redirects: Redirects = {}

  for (const file of files) {
    const frontmatter = await getMarkdownFrontmatter(path.join(srcDir, file))
    const redirectFrom: string[] = frontmatter?.redirect_from
    const isExcluded = command === 'build' && frontmatter?.draft === true
    if (!frontmatter || !redirectFrom || isExcluded) continue

    const postSlug = frontmatter.slug || getSlug(file)
    if (!postSlug) continue

    redirects = createRedirect(redirects, redirectFrom, postSlug)
  }

  return redirects
}

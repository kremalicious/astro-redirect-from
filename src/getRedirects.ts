import path from 'node:path'
import type { Redirects } from '.'
import { getMarkdownFrontmatter } from './utils.js'

export async function getRedirects(
  files: string[],
  srcDir: string,
  getSlug: (filePath: string) => string
) {
  const redirects: Redirects = {}

  for (const file of files) {
    const frontmatter = await getMarkdownFrontmatter(path.join(srcDir, file))
    const redirectFrom: string[] = frontmatter?.redirect_from
    if (
      !frontmatter ||
      !redirectFrom ||
      (import.meta.env.PROD && frontmatter.draft === true)
    )
      continue

    let postSlug = frontmatter.slug
    if (!postSlug) postSlug = getSlug(file)
    if (!postSlug) continue

    for (const slug of redirectFrom) {
      redirects[slug] = postSlug
    }
  }

  return redirects
}

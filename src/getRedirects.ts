import path from 'node:path'
import type { Redirects } from '.'
import { getMarkdownFrontmatter } from './utils.js'

export async function getRedirects(
  files: string[],
  srcDir: string,
  getSlug: (filePath: string) => string,
  command: 'dev' | 'build' | 'preview'
) {
  const redirects: Redirects = {}

  for (const file of files) {
    const frontmatter = await getMarkdownFrontmatter(path.join(srcDir, file))
    const redirectFrom: string[] = frontmatter?.redirect_from
    if (
      !frontmatter ||
      !redirectFrom ||
      (command === 'build' && frontmatter.draft === true)
    )
      continue

    let postSlug = frontmatter.slug || getSlug(file)
    if (!postSlug) continue

    // Prepend all slugs with a slash if not present
    if (!postSlug.startsWith('/')) postSlug = `/${postSlug}`

    for (let slug of redirectFrom) {
      if (!slug.startsWith('/')) slug = `/${slug}`
      redirects[slug] = postSlug
    }
  }

  return redirects
}

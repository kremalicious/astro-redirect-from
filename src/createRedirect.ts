import type { Redirects } from './index.js'
import { joinWithBase, prependForwardSlash } from './utils.js'

export function createRedirect(
  redirects: Redirects,
  redirectFrom: string[],
  postSlug: string,
  basePath?: string
) {
  // Only apply base config to destination paths, as Astro handles the source paths automatically
  const newPostSlug = joinWithBase(basePath, postSlug)

  for (const slug of redirectFrom) {
    // Normalize source paths with leading slash for consistency
    const normalizedSlug = prependForwardSlash(slug)
    redirects[normalizedSlug] = newPostSlug
  }

  return redirects
}

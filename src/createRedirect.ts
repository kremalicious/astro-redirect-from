import type { Redirects } from './index.js'
import { prependForwardSlash } from './utils.js'

export function createRedirect(
  redirects: Redirects,
  redirectFrom: string[],
  postSlug: string
) {
  const newPostSlug = prependForwardSlash(postSlug)

  for (let slug of redirectFrom) {
    slug = prependForwardSlash(slug)
    redirects[slug] = newPostSlug
  }

  return redirects
}

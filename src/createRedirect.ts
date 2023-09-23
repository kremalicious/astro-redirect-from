import type { Redirects } from './index.js'

export function createRedirect(
  redirects: Redirects,
  redirectFrom: string[],
  postSlug: string
) {
  // Prepend all slugs with a slash if not present
  if (!postSlug.startsWith('/')) postSlug = `/${postSlug}`

  for (let slug of redirectFrom) {
    if (!slug.startsWith('/')) slug = `/${slug}`
    redirects[slug] = postSlug
  }

  return redirects
}

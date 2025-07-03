import type { Redirects } from './index.js'
import { joinWithBase } from './utils.js'

export function createRedirect(
  redirects: Redirects,
  redirectFrom: string[],
  postSlug: string,
  basePath?: string
) {
  const newPostSlug = joinWithBase(basePath, postSlug)

  for (const slug of redirectFrom) {
    const fromPath = joinWithBase(basePath, slug)
    redirects[fromPath] = newPostSlug
  }

  return redirects
}

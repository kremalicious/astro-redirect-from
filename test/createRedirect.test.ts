import { describe, expect, it } from 'vitest'
import { createRedirect } from '@/src/createRedirect'

describe('createRedirect', () => {
  it('should merge initialRedirects with newly found ones', () => {
    const initialRedirects: Record<string, string> = {
      '/existing-old-url': '/existing-new-url'
    }
    const redirectFrom = ['old-url-1', '/old-url-2']
    const postSlug = 'new-url'

    const result = createRedirect(initialRedirects, redirectFrom, postSlug)

    expect(result).toStrictEqual({
      '/existing-old-url': '/existing-new-url',
      '/old-url-1': '/new-url',
      '/old-url-2': '/new-url'
    })
  })

  it('should prepend slash everywhere', () => {
    const initialRedirects: Record<string, string> = {}
    const redirectFrom = ['old-url-1']
    let postSlug = '/new-url'

    let result = createRedirect(initialRedirects, redirectFrom, postSlug)

    expect(result).toStrictEqual({
      '/old-url-1': '/new-url'
    })

    postSlug = 'new-url'
    result = createRedirect(initialRedirects, redirectFrom, postSlug)
    expect(result).toStrictEqual({
      '/old-url-1': '/new-url'
    })
  })
})

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

  it('should apply base path to both source and destination', () => {
    const initialRedirects: Record<string, string> = {}
    const redirectFrom = ['old-url', '/old-url-2']
    const postSlug = 'new-url'
    const basePath = '/my-site'

    const result = createRedirect(
      initialRedirects,
      redirectFrom,
      postSlug,
      basePath
    )

    expect(result).toStrictEqual({
      '/my-site/old-url': '/my-site/new-url',
      '/my-site/old-url-2': '/my-site/new-url'
    })
  })

  it('should handle empty or root base path', () => {
    const initialRedirects: Record<string, string> = {}
    const redirectFrom = ['old-url']
    const postSlug = 'new-url'

    // Test with undefined base
    let result = createRedirect(
      initialRedirects,
      redirectFrom,
      postSlug,
      undefined
    )
    expect(result).toStrictEqual({
      '/old-url': '/new-url'
    })

    // Test with root base
    result = createRedirect(initialRedirects, redirectFrom, postSlug, '/')
    expect(result).toStrictEqual({
      '/old-url': '/new-url'
    })
  })

  it('should normalize base path with trailing slashes', () => {
    const initialRedirects: Record<string, string> = {}
    const redirectFrom = ['old-url']
    const postSlug = 'new-url'
    const basePath = '/my-site/'

    const result = createRedirect(
      initialRedirects,
      redirectFrom,
      postSlug,
      basePath
    )

    expect(result).toStrictEqual({
      '/my-site/old-url': '/my-site/new-url'
    })
  })
})

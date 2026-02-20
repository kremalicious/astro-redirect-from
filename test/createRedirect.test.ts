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

  it('should prepend slash to destination paths only', () => {
    const initialRedirects: Record<string, string> = {}
    const redirectFrom = ['old-url-1']
    const postSlug = 'new-url'

    const result = createRedirect(initialRedirects, redirectFrom, postSlug)

    expect(result).toStrictEqual({
      '/old-url-1': '/new-url'
    })
  })

  it('should apply base path to destination paths only', () => {
    const initialRedirects: Record<string, string> = {}
    const redirectFrom = ['/old-path', 'another-old-path']
    const postSlug = '/new-path'
    const basePath = '/my-site'

    const result = createRedirect(
      initialRedirects,
      redirectFrom,
      postSlug,
      basePath
    )

    expect(result).toStrictEqual({
      // Source paths normalized with leading slash (but no base applied)
      '/old-path': '/my-site/new-path',
      '/another-old-path': '/my-site/new-path'
    })
  })

  it('should handle base path edge cases', () => {
    const redirects: Record<string, string> = {}

    // Test with no base path
    const result1 = createRedirect(redirects, ['/old'], '/new')
    expect(result1['/old']).toBe('/new')

    // Test with base path as '/'
    const result2 = createRedirect({}, ['/old'], '/new', '/')
    expect(result2['/old']).toBe('/new')

    // Test with base path without leading slash
    const result3 = createRedirect({}, ['/old'], '/new', 'my-site')
    expect(result3['/old']).toBe('/my-site/new')
  })
})

import { expect, it, describe } from 'vitest'
import { getRedirects } from '../src/getRedirects'
import { getMarkdownFiles, getSlugFromFilePath } from '../src/utils'
import { createRedirect } from '../src/createRedirect'

describe('getRedirects', async () => {
  // handling this more as an integration test
  const srcDir = './test/__fixtures__/markdown'
  const files = await getMarkdownFiles(srcDir)

  it('should return correct redirects', async () => {
    const result = await getRedirects(
      files,
      srcDir,
      getSlugFromFilePath,
      'build'
    )
    expect(result).toBeInstanceOf(Object)
    expect(result).toStrictEqual({
      '/hello-astro-old': '/hello-astroooooo',
      '/hello-astro-old-234837': '/hello-astroooooo',
      '/hello-world-old': '/posts/hello-world',
      '/hello-world-old-234837': '/posts/hello-world',
      '/hello-markdown-old': '/hello-markdown',
      '/hello-markdown-old-234837': '/hello-markdown'
    })
  })
})

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

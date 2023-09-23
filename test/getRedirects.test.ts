import { expect, it, describe } from 'vitest'
import { getRedirects } from '../src/getRedirects'
import { getMarkdownFiles, getSlugFromFilePath } from '../src/utils'

describe('getRedirects', async () => {
  // handling this more as an integration test
  const srcDir = './test/__fixtures__/markdown'
  const files = await getMarkdownFiles(srcDir)

  it('should return redirects', async () => {
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
      '/hello-world-old': '/hello-world',
      '/hello-world-old-234837': '/hello-world',
      '/hello-markdown-old': '/hello-markdown',
      '/hello-markdown-old-234837': '/hello-markdown'
    })
  })
})

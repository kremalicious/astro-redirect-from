import { getRedirects } from '@/src/getRedirects'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Partial mock - only mock what we need to control for specific tests
vi.mock('../src/utils', async () => {
  const actual = await vi.importActual('@/src/utils')
  return { ...actual, getMarkdownFrontmatter: vi.fn() }
})

// Import the mocked module
import * as utils from '@/src/utils'

describe('getRedirects', () => {
  const srcDir = './test/__fixtures__/markdown'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it('should return correct redirects', async () => {
    // Restore the original getMarkdownFrontmatter just for this test
    const actual =
      await vi.importActual<typeof import('@/src/utils')>('@/src/utils')
    vi.mocked(utils.getMarkdownFrontmatter).mockImplementation(
      actual.getMarkdownFrontmatter
    )

    const files = [
      'posts/hello-world.md',
      'posts/hello-astro.md',
      'posts/hello-once.md',
      'hello-markdown/index.md'
    ]

    const getSlug = (file: string) => {
      if (file.includes('hello-world')) return '/posts/hello-world'
      if (file.includes('hello-astro')) return '/hello-astroooooo'
      if (file.includes('hello-once')) return '/posts/hello-once'
      if (file.includes('hello-markdown')) return '/hello-markdown'
      return '/unknown'
    }

    const result = await getRedirects(files, srcDir, getSlug, 'build', console)

    expect(result).toBeInstanceOf(Object)
    expect(result).toStrictEqual({
      '/hello-astro-old': '/hello-astroooooo',
      '/hello-astro-old-234837': '/hello-astroooooo',
      '/hello-world-old': '/posts/hello-world',
      '/hello-once': '/posts/hello-once',
      '/hello-world-old-234837': '/posts/hello-world',
      '/hello-markdown-old': '/hello-markdown',
      '/hello-markdown-old-234837': '/hello-markdown'
    })
  })

  it('should return correct redirects with base path', async () => {
    // Restore the original getMarkdownFrontmatter just for this test
    const actual =
      await vi.importActual<typeof import('@/src/utils')>('@/src/utils')
    vi.mocked(utils.getMarkdownFrontmatter).mockImplementation(
      actual.getMarkdownFrontmatter
    )

    const files = ['posts/hello-world.md']
    const getSlug = () => '/posts/hello-world'
    const basePath = '/my-site'

    const result = await getRedirects(
      files,
      srcDir,
      getSlug,
      'build',
      console,
      basePath
    )

    expect(result).toStrictEqual({
      '/my-site/hello-world-old': '/my-site/posts/hello-world',
      '/my-site/hello-world-old-234837': '/my-site/posts/hello-world'
    })
  })

  it('should warn when redirect_from has unexpected type', async () => {
    const mockLogger = { warn: vi.fn() }

    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({
      // biome-ignore lint/style/useNamingConvention:
      redirect_from: { foo: 'bar' }, // Object instead of string/array
      slug: '/test'
    })

    await getRedirects(['test.md'], './', () => '/test', 'build', mockLogger)

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Unexpected type object for redirect_from in file: test.md'
      )
    )
  })

  it('should filter out invalid redirect paths and warn about them', async () => {
    const mockLogger = { warn: vi.fn() }

    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({
      // biome-ignore lint/style/useNamingConvention:
      redirect_from: [
        '/valid-path',
        'http://invalid-with-protocol.com',
        'path with spaces'
      ],
      slug: '/test'
    })

    const result = await getRedirects(
      ['test.md'],
      './',
      () => '/test',
      'build',
      mockLogger
    )

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Invalid redirect path: http://invalid-with-protocol.com in file: test.md'
    )
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Invalid redirect path: path with spaces in file: test.md'
    )

    expect(result).toEqual({ '/valid-path': '/test' })
  })

  it('should skip files when postSlug is falsy', async () => {
    const mockLogger = { warn: vi.fn() }

    // Mock a frontmatter with redirect_from but getSlug will return falsy
    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({
      // biome-ignore lint/style/useNamingConvention:
      redirect_from: ['/some-redirect-path']
      // No slug property
    })

    // The getSlug function returns a falsy value
    const getSlugMock = vi.fn().mockReturnValue('')

    const result = await getRedirects(
      ['test.md'],
      './',
      getSlugMock,
      'build',
      mockLogger
    )

    expect(getSlugMock).toHaveBeenCalledWith('test.md')
    expect(result).toEqual({})
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRedirects } from '@/src/getRedirects'

// Partial mock - only mock what we need to control for specific tests
vi.mock('../src/utils', async () => {
  const actual = await vi.importActual('@/src/utils')
  return { ...actual, getMarkdownFrontmatter: vi.fn() }
})

// Import the mocked module
import * as utils from '@/src/utils'

const mockLogger = { warn: vi.fn() }

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

    const redirects = await getRedirects(
      files,
      srcDir,
      getSlug,
      'build',
      mockLogger
    )

    expect(redirects).toStrictEqual({
      '/hello-world-old': '/posts/hello-world',
      '/hello-world-old-234837': '/posts/hello-world',
      '/hello-astro-old': '/hello-astroooooo',
      '/hello-astro-old-234837': '/hello-astroooooo',
      '/hello-once': '/posts/hello-once',
      '/hello-markdown-old': '/hello-markdown',
      '/hello-markdown-old-234837': '/hello-markdown'
    })
  })

  it('should apply base path to destination paths only', async () => {
    // Mock frontmatter with redirect_from
    vi.mocked(utils.getMarkdownFrontmatter).mockImplementation(
      async (file: string) => {
        if (file.includes('test-file.md')) {
          return { redirect_from: ['/old-path', 'another-old'] }
        }
        return {}
      }
    )

    const files = ['test-file.md']
    const getSlug = () => '/new-path'
    const basePath = '/my-site'

    const redirects = await getRedirects(
      files,
      srcDir,
      getSlug,
      'build',
      mockLogger,
      basePath
    )

    expect(redirects).toStrictEqual({
      // Source paths normalized with leading slash (but no base applied)
      '/old-path': '/my-site/new-path',
      '/another-old': '/my-site/new-path'
    })
  })

  it('should log a warning when redirect_from is an unexpected type', async () => {
    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({
      redirect_from: 123
    })

    const files = ['test-file.md']
    const getSlug = () => '/new-url'

    await getRedirects(files, srcDir, getSlug, 'build', mockLogger)

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Unexpected type number for redirect_from in file: test-file.md'
    )
  })

  it('should handle files without redirect_from', async () => {
    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({})

    const files = ['test-file.md']
    const getSlug = () => '/new-url'

    const redirects = await getRedirects(
      files,
      srcDir,
      getSlug,
      'build',
      mockLogger
    )

    expect(redirects).toStrictEqual({})
  })

  it('should handle single string redirect_from', async () => {
    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({
      redirect_from: '/single-redirect'
    })

    const files = ['test-file.md']
    const getSlug = () => '/new-url'

    const redirects = await getRedirects(
      files,
      srcDir,
      getSlug,
      'build',
      mockLogger
    )

    expect(redirects).toStrictEqual({
      '/single-redirect': '/new-url'
    })
  })

  it('should handle array of redirect_from', async () => {
    vi.mocked(utils.getMarkdownFrontmatter).mockResolvedValue({
      redirect_from: ['/redirect-1', '/redirect-2']
    })

    const files = ['test-file.md']
    const getSlug = () => '/new-url'

    const redirects = await getRedirects(
      files,
      srcDir,
      getSlug,
      'build',
      mockLogger
    )

    expect(redirects).toStrictEqual({
      '/redirect-1': '/new-url',
      '/redirect-2': '/new-url'
    })
  })
})

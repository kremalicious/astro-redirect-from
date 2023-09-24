import { describe, it, expect, vi } from 'vitest'
import astroRedirectFrom, { initPlugin } from '../src/index'
import * as utils from '../src/utils'
import * as redirects from '../src/getRedirects'

describe('initPlugin', () => {
  const mockLogger = {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }

  const hookOptionsMock = {
    logger: mockLogger,
    config: {
      cacheDir: { pathname: './node_modules/.astro/' }
    },
    command: 'dev',
    updateConfig: vi.fn()
  }

  it('should handle no markdown files scenario', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue([])

    await initPlugin(hookOptionsMock as any)

    expect(mockLogger.warn).toBeCalledWith('No markdown files found')
    expect(hookOptionsMock.updateConfig).not.toBeCalled()
  })

  it('should handle no redirects found scenario', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md', 'test2.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({})

    await initPlugin(hookOptionsMock as any)

    expect(mockLogger.warn).toBeCalledWith(
      'No redirects found in markdown files'
    )
    expect(hookOptionsMock.updateConfig).not.toBeCalled()
  })

  it('should handle redirects found scenario', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md', 'test2.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({ '/old': '/new' })

    const writeJsonSpy = vi.spyOn(utils, 'writeJson')
    writeJsonSpy.mockImplementation(() => Promise.resolve())

    await initPlugin(hookOptionsMock as any)

    expect(hookOptionsMock.updateConfig).toBeCalledWith({
      redirects: { '/old': '/new' }
    })
    expect(mockLogger.info).toBeCalledWith('Added 1 redirects to Astro config')
    expect(writeJsonSpy).toBeCalled()
  })
})

describe('astroRedirectFrom', () => {
  it('should return an AstroIntegration object', () => {
    const result = astroRedirectFrom()

    expect(result).toHaveProperty('name', 'redirect-from')
    expect(result).toHaveProperty('hooks')
    expect(result.hooks).toHaveProperty('astro:config:setup')
  })
})

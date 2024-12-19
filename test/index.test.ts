import fs from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import * as redirects from '../src/getRedirects'
import astroRedirectFrom, { type HookOptions, initPlugin } from '../src/index'
import * as utils from '../src/utils'

const mockLogger = {
  warn: vi.fn(),
  info: vi.fn(),
  error: vi.fn()
}

const hookOptionsMock = {
  logger: mockLogger,
  config: {
    cacheDir: new URL('file://node_modules/.astro/')
  },
  command: 'dev',
  updateConfig: vi.fn()
} as unknown as HookOptions

describe('initPlugin', () => {
  it('should handle no markdown files scenario', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue([])

    await initPlugin(hookOptionsMock)

    expect(mockLogger.warn).toBeCalledWith('No markdown files found')
    expect(hookOptionsMock.updateConfig).not.toBeCalled()
  })

  it('should handle no redirects found scenario', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md', 'test2.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({})

    await initPlugin(hookOptionsMock)

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

    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined)

    await initPlugin(hookOptionsMock)

    expect(hookOptionsMock.updateConfig).toBeCalledWith({
      redirects: { '/old': '/new' }
    })
    expect(mockLogger.info).toBeCalledWith('Added 1 redirects to Astro config')
    expect(writeJsonSpy).toBeCalled()
  })

  it('should handle errors and log them', async () => {
    // Make getMarkdownFiles throw an error
    vi.spyOn(utils, 'getMarkdownFiles')
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockImplementation(async () => {
      throw new Error('Mocked error')
    })

    await initPlugin({
      ...hookOptionsMock,
      logger: mockLogger as unknown as HookOptions['logger']
    })

    expect(mockLogger.error).toHaveBeenCalledWith('Mocked error')
  })
})

describe('astroRedirectFrom', () => {
  it('should return an AstroIntegration object', () => {
    const result = astroRedirectFrom()

    expect(result).toHaveProperty('name', 'redirect-from')
    expect(result).toHaveProperty('hooks')
    expect(result.hooks).toHaveProperty('astro:config:setup')
  })

  it('should call initPlugin when astro:config:setup hook is invoked', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md', 'test2.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({ '/old': '/new' })

    const writeJsonSpy = vi.spyOn(utils, 'writeJson')
    writeJsonSpy.mockImplementation(() => Promise.resolve())

    const integration = astroRedirectFrom()

    expect(integration.hooks).toHaveProperty('astro:config:setup')

    // Invoke the hook
    if (integration.hooks['astro:config:setup']) {
      await integration.hooks['astro:config:setup'](hookOptionsMock)
    }
  })
})

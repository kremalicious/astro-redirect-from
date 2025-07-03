import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import * as redirects from '../src/getRedirects'
import astroRedirectFrom, { type HookOptions, initPlugin } from '../src/index'
import * as utils from '../src/utils'

const mockLogger = {
  warn: vi.fn(),
  info: vi.fn(),
  error: vi.fn()
}

const cacheDirPath = url.pathToFileURL(
  path.resolve('node_modules/.astro/')
).href

const hookOptionsMock = {
  logger: mockLogger,
  config: {
    cacheDir: new URL(cacheDirPath),
    base: undefined
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

  it('should create the cache directory if it does not exist', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md', 'test2.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({ '/old': '/new' })

    const writeJsonSpy = vi.spyOn(utils, 'writeJson')
    writeJsonSpy.mockImplementation(() => Promise.resolve())

    vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined)

    await initPlugin(hookOptionsMock)

    expect(fs.existsSync).toHaveBeenCalled()
    expect(fs.mkdirSync).toHaveBeenCalled()
  })

  it('should handle custom options', async () => {
    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({ '/old': '/new' })

    vi.spyOn(utils, 'writeJson').mockResolvedValue()
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    const customGetSlug = (filePath: string) => `custom-${filePath}`

    await initPlugin(hookOptionsMock, {
      contentDir: 'custom/content/',
      getSlug: customGetSlug
    })

    const expectedPathPart = path.join('custom', 'content')
    expect(getMarkdownFilesSpy).toHaveBeenCalledWith(
      expect.stringContaining(expectedPathPart)
    )
  })

  it('should pass base path from config to getRedirects', async () => {
    const hookOptionsWithBase = {
      ...hookOptionsMock,
      config: {
        ...hookOptionsMock.config,
        base: '/my-site'
      }
    } as unknown as HookOptions

    const getMarkdownFilesSpy = vi.spyOn(utils, 'getMarkdownFiles')
    getMarkdownFilesSpy.mockResolvedValue(['test.md'])

    const getRedirectsSpy = vi.spyOn(redirects, 'getRedirects')
    getRedirectsSpy.mockResolvedValue({ '/my-site/old': '/my-site/new' })

    vi.spyOn(utils, 'writeJson').mockResolvedValue()
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    await initPlugin(hookOptionsWithBase)

    expect(getRedirectsSpy).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Function),
      'dev',
      mockLogger,
      '/my-site'
    )
  })

  it('should handle errors and log them', async () => {
    const errorMessage = 'Test error message'
    vi.spyOn(utils, 'getMarkdownFiles').mockRejectedValue(
      new Error(errorMessage)
    )

    await initPlugin(hookOptionsMock)

    expect(mockLogger.error).toHaveBeenCalledWith(errorMessage)
  })
})

describe('astroRedirectFrom', () => {
  it('should return an AstroIntegration object', () => {
    const result = astroRedirectFrom()

    expect(result).toHaveProperty('name', 'redirect-from')
    expect(result).toHaveProperty('hooks')
    expect(result.hooks).toHaveProperty('astro:config:setup')
  })

  it('should call initPlugin when hook is called', async () => {
    const initPluginSpy = vi.spyOn(initPlugin.constructor, 'apply')
    initPluginSpy.mockResolvedValue(undefined)

    const integration = astroRedirectFrom()

    if (integration.hooks['astro:config:setup']) {
      await integration.hooks['astro:config:setup'](hookOptionsMock)
    }

    expect(integration.hooks['astro:config:setup']).toBeDefined()
  })
})

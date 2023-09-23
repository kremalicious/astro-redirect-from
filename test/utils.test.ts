import { expect, describe, it, afterAll } from 'vitest'
import { promises as fs } from 'node:fs'
import {
  getMarkdownFiles,
  getMarkdownFrontmatter,
  getSlugFromFilePath,
  writeJson
} from '../src/utils'

describe('getMarkdownFiles', () => {
  it('should return an array of markdown files from the given directory', async () => {
    const files = await getMarkdownFiles('./test/__fixtures__/markdown')
    expect(files).toBeInstanceOf(Array)
    expect(files).toHaveLength(2)
  })
})

describe('getMarkdownFrontmatter', () => {
  it('should extract frontmatter from a markdown file', async () => {
    const frontmatter = await getMarkdownFrontmatter(
      './test/__fixtures__/markdown/hello-world.md'
    )
    expect(frontmatter).toBeInstanceOf(Object)
    expect(frontmatter.redirect_from).toBeDefined()
  })
})

describe('getSlugFromFilePath', () => {
  it('should return slug for testDir/testFile.md', () => {
    const slug = getSlugFromFilePath('testDir/testFile.md')
    expect(slug).toBe('/testDir/testFile')
  })

  it('should return slug for dir/testDir/index.md', () => {
    const slug = getSlugFromFilePath('dir/testDir/index.md')
    expect(slug).toBe('/dir/testDir')
  })

  it('should return slug for dir/dir2/testDir/index.md', () => {
    const slug = getSlugFromFilePath('dir/dir2/testDir/index.md')
    expect(slug).toBe('/dir/dir2/testDir')
  })
})

describe('writeJson', () => {
  const testFilePath = './test/test.json'

  afterAll(async () => {
    try {
      await fs.unlink(testFilePath)
    } catch (error) {
      console.error('Error cleaning up test file:', error)
    }
  })

  it('should write data to a JSON file and verify its content', async () => {
    const testData = { key: 'value' }

    await writeJson(testFilePath, testData)

    const fileContent = await fs.readFile(testFilePath, { encoding: 'utf-8' })
    const parsedContent = JSON.parse(fileContent)
    expect(parsedContent).toEqual(testData)
  })
})

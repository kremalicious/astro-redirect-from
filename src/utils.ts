import { promises as fs, type PathLike } from 'node:fs'
import path from 'node:path'
import { globby } from 'globby'
import matter from 'gray-matter'

export async function getMarkdownFiles(sourceDir: string) {
  const markdownFiles = await globby('./**/*.{md,mdx}', {
    cwd: sourceDir,
    gitignore: true
  })
  return markdownFiles
}

export async function getMarkdownFrontmatter(filePath: string) {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
  const { data: frontmatter } = matter(fileContent)
  return frontmatter
}

export function getSlugFromFilePath(filePath: string) {
  const parsedPath = path.parse(filePath)
  let slug: string

  // construct slug as full path from either:
  // - folder name if file name is index.md, or
  // - file name
  if (parsedPath.base === 'index.md' || parsedPath.base === 'index.mdx') {
    slug = `${parsedPath.dir}`
  } else {
    slug = `${parsedPath.dir}/${parsedPath.name}`
  }

  return slug
}

export async function writeJson<T>(path: PathLike, data: T) {
  await fs.writeFile(path, JSON.stringify(data, null, '\t'), {
    encoding: 'utf-8'
  })
}

export function prependForwardSlash(str: string) {
  return str.startsWith('/') ? str : `/${str}`
}

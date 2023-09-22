import path from 'node:path'
import { promises as fs, type PathLike } from 'node:fs'

export function getSlugFromFilePath(filePath: string) {
  const parsedPath = path.parse(filePath)
  let slug

  // construct slug as full path from either:
  // - folder name if file name is index.md, or
  // - file name
  if (parsedPath.base === 'index.md' || parsedPath.base === 'index.mdx') {
    slug = `/${parsedPath.dir}`
  } else {
    slug = `/${parsedPath.dir}/${parsedPath.name}`
  }

  return slug
}

export async function writeJson<T>(path: PathLike, data: T) {
  await fs.writeFile(path, JSON.stringify(data, null, '\t'), {
    encoding: 'utf-8'
  })
}

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

const projectRoot = path.resolve(__dirname, '..')
const distPath = path.join(projectRoot, 'dist')

describe('Build Output', () => {
  beforeAll(() => {
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' })
  })

  it('should generate the expected files', () => {
    expect(fs.existsSync(distPath)).toBe(true)
    expect(fs.existsSync(path.join(distPath, 'index.js'))).toBe(true)
    expect(fs.existsSync(path.join(distPath, 'createRedirect.js'))).toBe(true)
    expect(fs.existsSync(path.join(distPath, 'getRedirects.js'))).toBe(true)
    expect(fs.existsSync(path.join(distPath, 'utils.js'))).toBe(true)

    const typesDir = path.join(distPath, '@types')
    expect(fs.existsSync(typesDir)).toBe(true)
    expect(fs.existsSync(path.join(typesDir, 'index.d.ts'))).toBe(true)
    expect(fs.existsSync(path.join(typesDir, 'createRedirect.d.ts'))).toBe(true)
    expect(fs.existsSync(path.join(typesDir, 'getRedirects.d.ts'))).toBe(true)
    expect(fs.existsSync(path.join(typesDir, 'utils.d.ts'))).toBe(true)
  })

  it('should generate valid JavaScript modules', () => {
    const indexJs = fs.readFileSync(path.join(distPath, 'index.js'), 'utf8')
    expect(indexJs.length).toBeGreaterThan(0)
    expect(indexJs).toContain('export')

    const createRedirectJs = fs.readFileSync(
      path.join(distPath, 'createRedirect.js'),
      'utf8'
    )
    expect(createRedirectJs.length).toBeGreaterThan(0)

    const getRedirectsJs = fs.readFileSync(
      path.join(distPath, 'getRedirects.js'),
      'utf8'
    )
    expect(getRedirectsJs.length).toBeGreaterThan(0)

    const utilsJs = fs.readFileSync(path.join(distPath, 'utils.js'), 'utf8')
    expect(utilsJs.length).toBeGreaterThan(0)
  })
})

[![astro-redirect-from](https://raw.githubusercontent.com/kremalicious/astro-redirect-from/main/src/astro-redirect-from-teaser.png)](https://kremalicious.com/astro-redirect-from/)

# astro-redirect-from

[![npm package](https://img.shields.io/npm/v/astro-redirect-from.svg)](https://www.npmjs.com/package/astro-redirect-from)
[![CI](https://github.com/kremalicious/astro-redirect-from/actions/workflows/ci.yml/badge.svg)](https://github.com/kremalicious/astro-redirect-from/actions/workflows/ci.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/a20dc7ebee797c2d1e43/maintainability)](https://codeclimate.com/github/kremalicious/astro-redirect-from/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a20dc7ebee797c2d1e43/test_coverage)](https://codeclimate.com/github/kremalicious/astro-redirect-from/test_coverage)

> 🎯 Set redirect urls in your frontmatter within your [Astro](https://astro.build) site's Markdown files. Mimics the behavior of [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) and [gatsby-redirect-from](https://kremalicious.com/gatsby-redirect-from/).
>
> https://kremalicious.com/astro-redirect-from/

---

**Table of Contents**

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Options](#options)
    - [`contentDir: string`](#contentdir-string)
    - [`getSlug: (filePath: string) => string`](#getslug-filepath-string--string)
- [Usage](#usage)
- [More Documentation](#more-documentation)
- [Plugin Development](#plugin-development)
  - [Testing](#testing)
- [Changelog](#changelog)
- [License](#license)

---

## Prerequisites

The plugin is designed to work without configuration, especially if your project aligns with Astro's default settings.

- Astro v3 (v2 probably works too, but is not tested)
- Markdown files should be in a directory (default is `src/pages/`)
- Slugs are extracted either from the frontmatter or the file/folder path

## Installation

```bash
cd yourproject/

# Using NPM
npx astro add astro-redirect-from
# Using Yarn
yarn astro add astro-redirect-from
# Using PNPM
pnpm astro add astro-redirect-from
```

If installing manually:

```bash
npm i astro-redirect-from
```

Then load the plugin in your Astro config file, making sure this plugin comes before any other integrations which make use of the `redirects` config:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config'
import redirectFrom from 'astro-redirect-from'

export default defineConfig({
  // ...
  integrations: [
    // make sure this is listed before any hosting integration
    redirectFrom()
  ]
  // ...
)}
```

That's it. Your redirects will be automatically added the next time you run `astro dev` or `astro build`. If any of them have a `redirect_from` field, that is.

For easy debugging, a `redirect_from.json` is written out into Astro's `cacheDir` setting, which by default is under `node_modules/.astro`.

[See Usage](#usage)

### Options

All options are optional and can be passed in Astro's config file:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config'
import redirectFrom from 'astro-redirect-from'
import { getMySlug } from './your-slug-function'

export default defineConfig({
  // ...
  integrations: [
    redirectFrom({
      contentDir: './content',
      getSlug: getMySlug
    })
  ]
  // ...
)}
```

#### `contentDir: string`

_Default: `src/pages/`_

Specify a different directory for your Markdown files, relative to the project root.

#### `getSlug: (filePath: string) => string`

_Default: `getSlugFromFilePath()`, see below_

If you need a custom slug structure, pass a function to construct your slug from the file path. The file path should be relative to the content directory.

If you use a `slug` field in your frontmatter, this will be preferred by the plugin and passing any `getSlug` function will have no effect in that case.

The default function is a great starting point:

```typescript
function getSlugFromFilePath(filePath: string) {
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
```

## Usage

In your Markdown file's frontmatter, use the key `redirect_from` followed by a list.

```yaml
---
redirect_from:
  - /old-url-1
  - /old-url-2
  - /old-url-3.html
---
```

## [More Documentation](https://kremalicious.com/astro-redirect-from/)

Find more explanations, all about server-side redirects, and learn about additional integrations which can be used in combination with astro-redirect-from.

- **[Documentation →](https://kremalicious.com/astro-redirect-from/)**

## Plugin Development

```bash
npm i
npm start

# production build
npm run build

# publishing to npm & GitHub releases
# uses https://github.com/webpro/release-it
npm run release
```

### Testing

```bash
npm run lint
npm run typecheck
# runs unit tests through vitest
npm run test:unit

# all of the above commands together
npm test
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

The MIT License

Copyright (c) 2023 Matthias Kretschmann

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Made with ♥ by [Matthias Kretschmann](https://matthiaskretschmann.com) ([@kremalicious](https://github.com/kremalicious))

Say thanks with BTC:
`35UUssHexVK48jbiSgTxa4QihEoCqrwCTG`

Say thanks with ETH:
`krema.eth`

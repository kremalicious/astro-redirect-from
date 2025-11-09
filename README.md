[![astro-redirect-from](https://raw.githubusercontent.com/kremalicious/astro-redirect-from/main/src/astro-redirect-from-teaser.png)](https://kremalicious.com/astro-redirect-from/)

# astro-redirect-from

[![npm package](https://img.shields.io/npm/v/astro-redirect-from.svg)](https://www.npmjs.com/package/astro-redirect-from)
[![CI](https://github.com/kremalicious/astro-redirect-from/actions/workflows/ci.yml/badge.svg)](https://github.com/kremalicious/astro-redirect-from/actions/workflows/ci.yml)
[![Maintainability](https://qlty.sh/gh/kremalicious/projects/astro-redirect-from/maintainability.svg)](https://qlty.sh/gh/kremalicious/projects/astro-redirect-from)
[![Code Coverage](https://qlty.sh/gh/kremalicious/projects/astro-redirect-from/coverage.svg)](https://qlty.sh/gh/kremalicious/projects/astro-redirect-from)

> 🎯 Set redirect urls in your frontmatter within your [Astro](https://astro.build) site's Markdown files. Mimics the behavior of [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) and [gatsby-redirect-from](https://kremalicious.com/gatsby-redirect-from/).
>
> https://kremalicious.com/astro-redirect-from/

---

**Table of Contents**

- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Plugin Development](#plugin-development)
  - [Testing](#testing)
- [Changelog](#changelog)
- [Sponsorship](#sponsorship)
- [License](#license)

---

## Quick Start

```bash
cd yourproject/
npx astro add astro-redirect-from

# or install manually
npm i astro-redirect-from
```

Then load the plugin in your Astro config file:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config'
import redirectFrom from 'astro-redirect-from'

export default defineConfig({
  // ...
  integrations: [
    // make sure this is listed BEFORE any hosting integration
    redirectFrom()
  ]
  // ...
)}
```

## [Documentation](https://kremalicious.com/astro-redirect-from/)

Find more explanations, all about server-side redirects, and learn about additional integrations which can be used in combination with astro-redirect-from.

- **[Documentation →](https://kremalicious.com/astro-redirect-from/)**

## Plugin Development

```bash
npm i
npm run dev

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
npm test
```

If linting errors are encountered, try to fix it automatically with:

```bash
npm run format
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Sponsorship

[![](https://img.shields.io/static/v1?label=Say%20Thanks%20With%20Web3&labelColor=%2343a699&message=%E2%9D%A4&logo=Ethereum&color=%23fe8e86&style=for-the-badge)](https://kremalicious.com/thanks)

[![](https://img.shields.io/static/v1?label=Say%20Thanks%20With%20GitHub&labelColor=%2343a699&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86&style=for-the-badge)](https://github.com/sponsors/kremalicious)

## License

The MIT License

Copyright (c) 2024 Matthias Kretschmann

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Made with ♥ by [Matthias Kretschmann](https://matthiaskretschmann.com) ([@kremalicious](https://github.com/kremalicious))

export type GetSlug = (filePath: string) => string

export type PluginOptions = {
  contentDir?: string
  getSlug?: GetSlug
}

export type Redirects = { [old: string]: string }

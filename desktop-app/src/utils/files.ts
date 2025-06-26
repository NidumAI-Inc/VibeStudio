export const getColorByExtension = (filename: string): string => {
  const parts = filename.split('.')
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : null

  if (!ext || parts.length === 1) {
    return 'text-yellow-600'
  }

  switch (ext) {
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return 'text-yellow-500'
    case 'json':
      return 'text-amber-600'
    case 'md':
    case 'mdx':
      return 'text-purple-500'
    case 'html':
    case 'htm':
      return 'text-orange-600'
    case 'css':
    case 'scss':
      return 'text-pink-500'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'text-rose-500'
    case 'pdf':
      return 'text-red-500'
    case 'zip':
    case 'rar':
      return 'text-pink-200'
    default:
      return 'text-gray-100'
  }
}

export function canOpenFile(filename: string) {
  const textExtensions = new Set([
    'txt',
    'log',
    'md',
    'csv',
    'json',
    'xml',
    'yaml',
    'yml',
    'env',
    'ini',
    'gitignore',

    'js',
    'ts',
    'jsx',
    'tsx',
    'py',
    'java',
    'c',
    'cpp',
    'h',
    'hpp',
    'cs',
    'go',
    'rb',
    'rs',
    'php',
    'sh',
    'pl',
    'swift',
    'kt',
    'json',

    'html',
    'css',
    'scss',
    'less',
    'ini',
    'toml',
    'cfg',

    'conf',
    'htaccess',
    'lock',
    'd',
    'types',
  ])

  const extension = filename.split('.').pop()?.toLowerCase()
  return extension && textExtensions.has(extension)
}

import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { readdirSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const rootDirectory = import.meta.dirname
const viewsDirectory = resolve(rootDirectory, 'src', 'views')
const webRoot = resolve(rootDirectory, '..', 'wwwroot')

function getViewEntries() {
  const entries: Record<string, string> = {}
  const viewExtensions = new Set(['.js', '.jsx', '.ts', '.tsx'])

  for (const file of readdirSync(viewsDirectory, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!file.isFile() || !viewExtensions.has(extname(file.name))) {
      continue
    }

    const filePath = resolve(file.parentPath, file.name)
    const relativePath = relative(viewsDirectory, filePath)
    const entryName = relativePath.replace(/\.[^.]+$/, '').replaceAll('\\', '/')

    entries[entryName] = filePath
  }

  return entries
}

export default defineConfig({
  plugins: [
    react(), 
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()],
  build: {
    outDir: webRoot,
    emptyOutDir: false,
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        ...getViewEntries(),
      },
      output: {
        entryFileNames: 'views/[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo: any) => {
          const assetName = assetInfo.names?.[0] || '';
          const assetExt = assetName.split('.').at(-1) || '';

          if(assetName != '' && assetExt == "css"){
            return 'assets/css/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
})

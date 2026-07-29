import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Flags React's own documented "fetch on mount" effect pattern (see
      // react.dev/learn/synchronizing-with-effects#fetching-data) and the
      // Modal enter/exit animation timer as if they were bugs — both are
      // effects correctly synchronizing with an external system (network,
      // DOM timing), which is exactly what useEffect is for.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])

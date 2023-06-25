import { defineConfig, loadEnv } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

const port = 8888;
const resolve = (dir) => path.resolve(__dirname, dir);
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@v': resolve('src/views/'),
        '@c': resolve('src/components/'),
        '@u': resolve('src/utils/'),
        '@st': resolve('src/static/'),
      },
      extensions: ['.vue', '.js', '.jsx', '.json'],
    },

    plugins: [
      createVuePlugin({ jsx: true }),
      createSvgPlugin(),
      createHtmlPlugin({
        minify: true,
        inject: { data: { title: '募随' } },
      }),
    ],
    server: {
      watch: {
        ignored: ['!**/node_modules/your-package-name/**'],
      },
      host: '0.0.0.0',
      port,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: 'terser',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 静态资源打包做处理
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString();
            }
          },
        },
      },
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
    },
    optimizeDeps: {
      exclude: ['your-package-name'],
    },
  };
});

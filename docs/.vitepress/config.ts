import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'es-ES',
  title: 'Foro Español',
  description: 'Generador de sitios estáticos impulsado por Vite y Vue.',

  themeConfig: {
    nav: [
      { text: 'Ejemplo', link: '/example' },

      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     { text: 'Item A', link: '/item-1' },
      //     { text: 'Item B', link: '/item-2' },
      //     { text: 'Item C', link: '/item-3' },
      //   ],
      // },

      // ...
    ],

    sidebar: [
      {
        // text: 'Guide',
        items: [
          { text: 'Ejemplo', link: '/example' },
          // ...
        ],
      },
    ],
  },
});

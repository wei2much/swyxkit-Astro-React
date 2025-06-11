import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-bullets': theme('colors.black'),
            blockquote: {
              borderLeft: '3px solid red',
              fontSize: 'inherit',
              fontStyle: 'inherit',
              fontWeight: 'medium'
            },
            'blockquote p:first-of-type::before': {
              content: ''
            },
            'blockquote p:last-of-type::after': {
              content: ''
            },
            'code::before': false,
            'code::after': false,
            code: {
              'border-radius': '0.25rem',
              padding: '0.15rem 0.3rem',
              borderWidth: '2px',
              borderColor: 'rgba(0,0,0,0.1)'
            },
            pre: {
              'border-radius': '0rem',
            },
            'a:hover': {
              color: '#31cdce !important',
              textDecoration: 'underline !important'
            },
            a: {
              color: '#2071ad',
              textDecoration: 'none'
            },
            'a code': {
              color: 'unset'
            },
            table: {
              overflow: 'hidden'
            },
            'li, ul, ol': {
              margin: 0
            },
            'li > img': {
              margin: 0,
              display: 'inline'
            },
            'ol > li::marker': {
              color: 'var(--tw-prose-body)'
            },
            'ul > li::marker': {
              color: 'var(--tw-prose-body)'
            },
            'ul > li > p': {
              marginTop: 0,
              marginBottom: 0,
            },
          }
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-lead': theme('colors.gray.400'),
            '--tw-prose-links': theme('colors.yellow.400'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.gray.400'),
            '--tw-prose-bullets': theme('colors.gray.600'),
            '--tw-prose-hr': theme('colors.gray.700'),
            '--tw-prose-quotes': theme('colors.gray.100'),
            '--tw-prose-quote-borders': theme('colors.gray.700'),
            '--tw-prose-captions': theme('colors.gray.400'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-pre-code': theme('colors.gray.300'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.600'),
            '--tw-prose-td-borders': theme('colors.gray.700'),
          }
        }
      })
    }
  },
  plugins: [typography]
};
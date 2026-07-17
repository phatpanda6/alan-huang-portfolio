# Alan Huang — Portfolio

A single-page developer portfolio centred on ContractLens, an in-progress tool
for detecting breaking API response-shape changes.

The site is designed to make the project easy to understand before introducing
visual effects. Its signature interaction compares a baseline JSON response
with a changed response through a keyboard-accessible drift lens.

## Featured work

- [ContractLens](https://github.com/phatpanda6/contractlens)
- [Airtable Clone](https://github.com/phatpanda6/airtable-clone)
- [NBA Player Hub](https://github.com/phatpanda6/NBA-Player-Hub)

## Design and implementation

- React 19 and TypeScript
- Next.js 16 App Router
- Tailwind CSS 4 plus custom responsive CSS
- Semantic HTML with visible focus states and reduced-motion support
- Pointer and keyboard control for the ContractLens comparison
- Deployment-aware Open Graph metadata for Vercel

No smooth-scrolling or animation library is required. The depth effect is built
with CSS perspective and a small React interaction so core content remains
fast and readable without motion.

The app is structured as a native Next.js deployment with no platform-specific
runtime adapter.

## Local development

Requires Node.js 24.

~~~bash
npm install
npm run dev
~~~

## Verification

~~~bash
npm run build
npm run lint
npm run typecheck
npm test
~~~

## Contact

- [GitHub](https://github.com/phatpanda6)
- [LinkedIn](https://www.linkedin.com/in/alan-huang-943257244/)
- [Email](mailto:ahuang24365@gmail.com)

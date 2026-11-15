# Alan Huang — Portfolio

A developer portfolio centred on selected work, with ContractLens as the
featured case study and a playable 3D diner as an optional way to explore.

The project menu exposes the work, engineering decisions, code and demos
without requiring WebGL. The ContractLens example demonstrates how a field type
change affects an API contract check.

## Live site

[alan-huang-portfolio.vercel.app](https://alan-huang-portfolio.vercel.app/)

## Featured work

- [ContractLens](https://github.com/phatpanda6/contractlens)
- [Relational Workspace live demo](https://airtable-clone-chi-nine.vercel.app/)
- [PHP Announcements API](https://github.com/phatpanda6/php-announcements-api)
- [NBA Player Hub](https://github.com/phatpanda6/NBA-Player-Hub)

## Design and implementation

- React 19 and TypeScript
- Next.js 16 App Router
- Tailwind CSS 4 plus custom responsive CSS
- Semantic HTML with visible focus states and reduced-motion support
- On-demand React Three Fiber scene with keyboard and touch controls
- Shared colour tokens for the site and the diner
- Deployment-aware Open Graph metadata for Vercel

The 3D scene loads when requested. The regular project menu is always available.

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
- [Email](mailto:alan.huang5@gmail.com)

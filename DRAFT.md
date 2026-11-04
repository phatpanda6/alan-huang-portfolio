# Stack House — first draft

A playable restaurant portfolio for Alan Huang. Developed on `feature/stack-house-draft`.

## Preview

Run `npm install` then `npm run dev`. Open the printed local address.

Select **Load the 3D diner**, then **Enter the restaurant**. Use WASD or arrow keys to walk the panda around the diner. Drag to orbit the third-person camera. The booths and counter block movement so the panda stays in the dining area. Click a project menu board to open its details. Touch direction buttons are available on mobile. Escape pauses walking or closes an open project dialog. **Reset view** returns the panda and camera to the entrance.

The project menu is usable without WebGL. **Close 3D scene** unloads it. Drag-to-orbit continues briefly on release and stops immediately on the next grab. Reduced motion disables this glide and the walk animation. The renderer pauses when idle or offscreen. The scene and page share colour tokens in `app/theme.ts`.

## Changing the menu

Edit `app/projects.ts` for project descriptions, links, technologies, and caveats. Change `featuredProjectId` to feature another project; both the restaurant counter and featured card use it. Each project is also available in the ordinary HTML menu. The first draft's wall layout is designed for four projects.

PHP Announcements API is described as a learning exercise with SQLite persistence, validation, tests, and a temporary EC2 lab. It has no public live-demo link. ContractLens's small interactive example is illustrative; its live app is linked separately.

## Verification and release follow-up

Run `npm run lint`, `npm run typecheck`, and `npm test` (production build plus rendered-page checks). Browser checks cover desktop/mobile rendering, movement, reset, board selection, dialogs, and source links.

This is a local design draft, not a production deployment. The inherited Next.js 16.2.6 dependency has security advisories reported by npm audit; update the framework and affected dependencies before public deployment. Social preview artwork still uses the prior portfolio image. Real iOS Safari testing and broader keyboard/screen-reader review remain release follow-up work.

// Next.js only declares `*.module.css` (see next/types/global.d.ts), so plain
// side-effect CSS imports have no type declarations. Newer TypeScript versions
// flag those, hence these ambient declarations.
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

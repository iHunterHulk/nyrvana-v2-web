This PR sets up the initial skeleton for the Nyrvana V2 web application with Next.js 16.

## Acceptance Checklist:
- [x] `npm install` succeeds on a fresh clone
- [x] `npm run build` produces a .next/ dir without errors
- [x] `npm run typecheck` exits 0
- [ ] `npm run dev` starts a server on port 3000 and `/` returns a page with the text "Nyrvana V2" (requires manual verification)
- [x] CI workflow runs on PR

## Design System
The implementation integrates the design tokens as specified in `/opt/data/workspace/nyrvana-v2-ui/docs/03-ui-design.md` including:
- Color palette for both light and dark themes
- Spacing scale
- Typography settings
- Radius and shadow scales
- Motion durations and easings

The signature electric blue color is set to `oklch(60% 0.21 252)` as required.
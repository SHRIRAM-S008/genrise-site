# GenRise Tech — genrisetech.in

Landing page for GenRise Tech. Copy lives in `LANDING_CONTENT.md` and `lib/content.ts`.

**Stack:** Next.js (static export) · Tailwind CSS · Motion (Framer Motion) · Remotion Player · Lenis

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

- Edit text: `lib/content.ts`
- Sections: `components/sections/*`
- Product film (Remotion): `components/remotion/ToolsFilm.tsx`
- `public/CNAME` and `public/ads.txt` are copied into the build for GitHub Pages and AdSense.

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`
(Settings → Pages → Source must be set to **GitHub Actions**).

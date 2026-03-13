# DnD Soul Test — Pending Tasks

## Current State (as of reboot)
Dev server: `cd ~/Documents/GitHub/dnd-soul-test && npm run dev` → localhost:3000
Repo: `~/Documents/GitHub/dnd-soul-test/`

---

## ✅ Done
- All 4 corners on each choice button (dark side: `#c8a96e`, light side: `#6b4a10`)
- Responsive corner sizing: `clamp(80px, 15vw, 180px)` — scales with viewport
- 20px inset padding on all corners
- WingDivider (header ornament): 80% smaller (`width=32`), 100% opacity, gold `#c8a96e`
- UnifrakturCook font imported + `font-unifraktur` utility class created
- H1 "The Oracle's Mirror" uses `font-unifraktur`

---

## ❌ Still TODO

### 1. Corner SVG — replace with new file
Use: `/Users/thonbo/Downloads/Corner-Ornament-3-By-RebeccaRead.svg`
- viewBox: `0 0 1841.389 1732.463`
- It is a **top-left** corner (arm goes up-left, arm goes right along top)
- Replace the path in `CornerFlourish` in `components/Ornaments.tsx`
- **Do NOT use scaleX / scaleY (mirroring)** — use rotation only:
  - `tl` → `rotate(0deg)` (original orientation)
  - `tr` → `rotate(90deg)`
  - `br` → `rotate(180deg)`
  - `bl` → `rotate(-90deg)` / `rotate(270deg)`
- Transform-origin should be at the pinned corner for each position

### 2. Corner rotation fix
- Current code uses `scaleX(-1)` / `scaleY(-1)` which MIRRORS the organic curves → looks wrong
- Switch to rotation-only as described above

### 3. Vertical center divider (VerticalBar)
- Currently: `color="#8b6914"`, `height="calc(100vh - 180px)"`, `opacity={0.45}`
- Change to: gold color `#c8a96e`, opacity `1.0`, scale down to **25% of current height**
  - New height: `calc((100vh - 180px) * 0.25)`
  - In `DndTest.tsx` line ~134

### 4. Font — verify UnifrakturCook is loading
- Import is in `globals.css`: `family=UnifrakturCook:wght@700`
- CSS utility: `font-family: "UnifrakturCook", cursive; font-weight: 700;`
- Applied to H1 in `DndTest.tsx`
- Hard refresh (Cmd+Shift+R) if not showing. Should look like blackletter/Fraktur.

---

## Key Files
| File | Purpose |
|------|---------|
| `components/Ornaments.tsx` | All SVG ornament components (CornerFlourish, WingDivider, VerticalBar, OrnamentDivider) |
| `components/DndTest.tsx` | Main quiz UI — QuizView + ResultView |
| `app/globals.css` | Font imports + Tailwind utility classes |
| `/Users/thonbo/Downloads/Corner-Ornament-3-By-RebeccaRead.svg` | New corner SVG to use |

## Color Reference
| Name | Hex |
|------|-----|
| Gold light | `#c8a96e` |
| Gold dark | `#8b6914` |
| Gold darker (for light bg) | `#6b4a10` |
| Dark bg | `#0d0906` |
| Parchment | `#f0ddb0` |

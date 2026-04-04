# 🌸 Bloom Pantry — Brand Assets

A food inventory app for women's shelters. Scan items, track expiry, generate recipes.

---

## Folder structure

```
bloom-pantry/
├── tokens/
│   └── brand.css          — CSS custom properties (colours, fonts, spacing, shadows)
│
├── logo/
│   ├── logo-a-flower-shelf.svg  — Flower + pantry shelf (illustrative)
│   ├── logo-b-monogram.svg      — B monogram with leaf curl (dark bg)
│   ├── logo-c-app-icon.svg      — Round badge / mobile app icon
│   ├── wordmark-light.svg       — Full lockup on light background
│   └── wordmark-dark.svg        — Full lockup on dark background
│
├── icons/
│   ├── icon-scan.svg      — Camera / scan item
│   ├── icon-expiry.svg    — Expiry clock
│   ├── icon-recipe.svg    — Fork + leaf (recipe generation)
│   ├── icon-pantry.svg    — Checklist (pantry inventory)
│   ├── icon-alert.svg     — Warning triangle (expiring soon)
│   └── icon-bloom.svg     — Bloom brand mark (standalone)
│
└── components/
    ├── BloomLogo.jsx      — React SVG logo component (size, dark, badge props)
    ├── StatusPill.jsx     — Inventory status badge (fresh / use-soon / expiring / etc.)
    └── InventoryCard.jsx  — Pantry item card with image, name, expiry, quantity
```

---

## Colour palette

| Token              | Hex       | Name        | Use                        |
|--------------------|-----------|-------------|----------------------------|
| `--bp-mist`        | `#d5dcd1` | Mist        | Backgrounds, light fills   |
| `--bp-sage`        | `#9fbca5` | Sage        | Secondary, muted text      |
| `--bp-teal-fern`   | `#6d9c90` | Teal fern   | Primary actions, stems     |
| `--bp-dusk-blue`   | `#496bbf` | Dusk blue   | Accent, highlights, links  |
| `--bp-deep-forest` | `#2f3e46` | Deep forest | Text, dark backgrounds     |

---

## Typography

- **Display / headings:** DM Serif Display — `https://fonts.google.com/specimen/DM+Serif+Display`
- **Body / UI:** DM Sans — `https://fonts.google.com/specimen/DM+Sans`

---

## Status pills

| Status       | Background  | Label          |
|--------------|-------------|----------------|
| `fresh`      | `#9fbca5`   | Fresh          |
| `use-soon`   | `#496bbf`   | Use soon       |
| `expiring`   | `#2f3e46`   | Expiring today |
| `in-stock`   | `#6d9c90`   | In stock       |
| `low-stock`  | `#d5dcd1`   | Low stock      |

---

## Quick start (React)

```jsx
import { BloomLogo }     from "./components/BloomLogo";
import { StatusPill }    from "./components/StatusPill";
import { InventoryCard } from "./components/InventoryCard";
import "./tokens/brand.css";

function App() {
  return (
    <>
      <BloomLogo size={48} badge />
      <StatusPill status="use-soon" />
      <InventoryCard
        name="Canned Tomatoes"
        expiry="2025-04-10"
        quantity={3}
        unit="cans"
        status="use-soon"
      />
    </>
  );
}
```

---

*Built with care for the Bloom Pantry hackathon project.*

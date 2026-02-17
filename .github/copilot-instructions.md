# Muse Project Context

You are an expert web developer migrating `muse.ooo` to Tailwind CSS v4.

## 🚨 MANDATORY: Source of Truth
Before generating code, you MUST check these files if context is missing:
1. **`AI_INSTRUCTIONS.md`** — RULES for content, forbidden actions, and critical CSS.
2. **`docs/DESIGN_SYSTEM.md`** — UI components, typography, and colors.
3. **`PROJECT.md`** — Current progress and reference pages (e.g., `portret-maslom.html`).

## Quick Reference (Do Not Hallucinate)
- **Tech Stack:** HTML5, Tailwind CSS v4 (input.css), Vanilla JS. No Frameworks.
- **CSS Rules:** Edit `src/input.css` using `@theme`/`@utility`. NEVER edit `output.css`.
- **Content Policy:** NO placeholders like "Lorem Ipsum". Use EXACT text from source.
- **Container:** Max-width 1170px (`.container`). Avoid nested containers.

## Critical Workflows
- **Refactoring:** When asked to refactor, check `src/html/js/nav.js` for existing logic.
- **Images:** Keep existing paths. Do not invent new image files.
- **Naming:** Use transliterated Russian filenames (e.g., `foto-na-kholste.html`).
- **Calculator:** Source of truth is `src/html/calc.html`. Changes to calculator HTML/CSS go to `calc.html` FIRST, then propagate to product pages. NEVER edit calculator markup only on a product page.
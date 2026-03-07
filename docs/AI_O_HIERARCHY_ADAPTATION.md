# AI Reference: O Typography And Color Hierarchy -> Muse

## Purpose

This file explains how to borrow the visual hierarchy principles from `draft/O` and adapt them to Muse without directly copying O's fonts, colors, or component styling.

Use this file when an AI agent needs to:

- analyze why O feels visually structured;
- recreate a similar hierarchy inside Muse;
- decide which Muse classes and colors should replace O tokens;
- keep changes aligned with Muse design system instead of introducing a second design language.

## Source Files

Primary references:

- `draft/O/tailwind.css`
- `draft/O/README.md`
- `src/input.css`
- `docs/DESIGN_SYSTEM.md`

Secondary visual references inside Muse:

- `src/html/index.html`
- `src/html/portret-na-zakaz/style/portret-maslom-v7.html`

## Core Conclusion

O should not be imported into Muse as a direct visual system.

The correct transfer method is:

1. Extract O's hierarchy principles.
2. Map each principle to existing Muse semantic classes.
3. Keep Muse fonts, palette, contrast rules, and CTA patterns.
4. Apply the result section by section, not as a global copy-paste.

The biggest value in O is not the olive palette.

The biggest value in O is the discipline of roles:

- display headline;
- section headline;
- lead paragraph;
- body text;
- meta and label text;
- inverted text on dark surfaces.

## How O Builds Hierarchy

### 1. Display vs Body Fonts

O creates hierarchy through a two-family contrast:

- display serif for large headings;
- sans-serif for body, controls, and metadata.

Muse already follows the same structural idea:

- display font for `.heading-hero`, `.heading-section`, `.heading-subsection`, `.heading-card`;
- sans font for body copy and UI.

This means the structural logic is already compatible.

### 2. Heading Scale

O uses a clear descending scale:

- hero headline = very large display heading;
- section title = still prominent, but clearly smaller;
- subsection/card title = smaller display heading;
- body never competes with the headings.

Muse equivalent:

- `.heading-hero`
- `.heading-section`
- `.heading-subsection`
- `.heading-card`

These classes already exist and should remain the main semantic system.

### 3. Color Roles Instead Of Many Accent Colors

O does not rely on many colorful text accents.

Instead, it uses a controlled tonal ladder:

- darkest text for headlines;
- slightly softer dark tone for description text;
- muted tone for labels, meta, secondary text;
- white and muted-white on dark backgrounds.

Muse already has a direct equivalent through the ink system.

### 4. Hierarchy Beyond Font Size

O strengthens hierarchy using:

- slightly negative letter spacing on display headings;
- tighter line-height on headings;
- `text-wrap: balance` or `pretty`;
- max-width limits for readable paragraphs;
- uppercase plus tracking for utility text and navigation;
- opacity-based contrast on dark surfaces instead of new colors.

This part is highly transferable into Muse.

## Direct Mapping: O -> Muse

### Typography Roles

| O role | Meaning | Muse replacement |
| --- | --- | --- |
| Hero display heading | Main page statement | `.heading-hero` |
| Section heading | Main section title | `.heading-section` |
| Subheading | Internal subsection title | `.heading-subsection` |
| Card heading | Card/block heading | `.heading-card` |
| Lead text | Intro paragraph after heading | `.text-lead` or `.text-lead-xl` |
| Large body | Comfortable reading text | `.text-body-lg` |
| Normal body | Default paragraph color in context | `.text-body` plus size utility if needed |
| Small/meta | Notes, captions, helper text | `.text-small` or `text-sm` + ink utility |
| Tiny utility text | Legal, helper UI, dense meta | `.text-tiny` or `text-xs` + ink utility |

### Color Roles

| O role | Meaning | Muse replacement |
| --- | --- | --- |
| Darkest headline tone | Main headline and strong text | `.text-ink` |
| Soft dark tone | Description and supporting copy | `.text-ink-soft` |
| Muted tone | Secondary info, helper text | `.text-ink-muted` |
| Label tone | UI labels, short descriptors | `.text-ink-label` |
| Text on dark | Main text on dark surfaces | `.text-ink-on-dark` |
| Muted text on dark | Secondary text on dark surfaces | `.text-ink-muted-on-dark` |

### Background Pairing

| Surface type | Muse rule |
| --- | --- |
| `bg-white`, `bg-ah-25` | use `.text-ink` for headings and primary text |
| `bg-ah-50`, `bg-ah-100` | use `.text-ink` or `.text-ink-soft` depending on emphasis |
| `bg-ah-950`, `bg-ah-975`, `bg-dark` | use `.text-ink-on-dark` and `.text-ink-muted-on-dark` |

## What To Transfer From O

Transfer these principles:

1. Strong separation between hero heading, section heading, lead, body, and meta.
2. Use of display font only for headings, not for all decorative text.
3. Tight tracking on display headings.
4. Balanced or pretty wrapping for large headlines and intros.
5. Muted text created by tonal shift, not by reducing readability too aggressively.
6. Dark sections using white plus muted-white hierarchy, not amber links everywhere.
7. Paragraph width constraints so body text never feels as visually heavy as headings.

## What Not To Transfer From O

Do not transfer these elements directly:

1. O olive palette.
2. Instrument Serif and Inter as mandatory fonts.
3. O dark-mode logic as a global project pattern.
4. Rounded-full SaaS button style.
5. Tailwind Plus component markup or dependency assumptions.
6. Any visual language that makes Muse look like a startup template instead of Muse.

## Practical Adaptation Rules For Muse

### Rule 1: Headings Stay In Muse Semantics

Never replace Muse heading semantics with ad hoc utility stacks copied from O.

Use:

- `.heading-hero`
- `.heading-section`
- `.heading-subsection`
- `.heading-card`

If a section needs refinement, adjust the semantic class definition in `src/input.css`, not each page individually.

### Rule 2: Lead Text Must Be A Separate Layer

If a paragraph is the main supporting statement under a heading, it should use `.text-lead` or `.text-lead-xl`, not default body text.

This is one of the most important hierarchy lessons from O.

### Rule 3: Body Copy Should Not Use Headline Color By Default Everywhere

Use:

- `.text-ink` for strong paragraphs or key statements;
- `.text-ink-soft` for descriptive copy;
- `.text-ink-muted` for notes, captions, side information.

This creates depth without adding new colors.

### Rule 4: On Dark Backgrounds, Use Inversion, Not Accent Overuse

Inside dark sections:

- headings -> `.text-ink-on-dark`
- main supporting text -> `.text-ink-on-dark` or inherited white
- secondary text -> `.text-ink-muted-on-dark`

Avoid using blue or accent text as the main reading color on dark backgrounds.

### Rule 5: Labels And Meta Should Use Weight + Tracking, Not Size Alone

For small utility text, use combinations like:

- `text-xs font-bold uppercase tracking-wider`
- `text-sm font-medium`
- `text-small text-ink-muted`

This mirrors O's hierarchy logic while staying inside Muse language.

### Rule 6: Limit Width Of Long Paragraphs

If a section contains long supporting text, avoid letting it span the full container width.

Use a readable max width so lead/body contrast remains visible.

### Rule 7: Use Accent Color Sparingly

In Muse, amber should remain an accent and CTA color, not the default solution for hierarchy.

Hierarchy should come first from:

- role;
- size;
- font family;
- line-height;
- tonal contrast.

Accent color should come second.

## Recommended Workflow For Future AI Tasks

When an AI agent is asked to adapt O-like hierarchy into Muse, it should follow this sequence:

1. Identify the content role of each text block.
2. Assign a Muse semantic class first.
3. Assign an ink color role second.
4. Check whether the section is on light or dark background.
5. Only then add local utility classes for spacing, max-width, wrapping, or alignment.

## Safe Decision Table

| If O does this | In Muse prefer this |
| --- | --- |
| extra large serif hero | `.heading-hero` |
| serif section title | `.heading-section` |
| medium serif card title | `.heading-card` |
| muted olive paragraph | `.text-ink-soft` or `.text-ink-muted` |
| white text on dark | `.text-ink-on-dark` |
| muted white on dark | `.text-ink-muted-on-dark` |
| eyebrow label | `text-xs font-bold uppercase tracking-wider` or label-level ink tone |
| soft hierarchy through neutral tones | use ink ladder, not new palette tokens |
| dark CTA section | keep Muse dark CTA rules and button styles |

## Recommended Muse Implementation Scope

Best first targets for applying this adaptation:

1. Hero sections.
2. Section headers with intro text.
3. Feature or benefit cards.
4. Dark CTA blocks.
5. Meta and helper text inside forms or cards.

Avoid starting with a global redesign.

Start with one page or one section, compare visually, then scale.

## One-Sentence Summary For AI

Borrow O's hierarchy logic, not its surface styling: keep Muse semantic typography and ink colors, and adapt O only as a role-based system of display heading, lead, body, meta, and dark-surface inversion.
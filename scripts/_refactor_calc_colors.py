"""
Refactor input.css: globalize calculator color hierarchy from .style-portraits → #calc.
Material Design O-hierarchy: PRIMARY 100%, SECONDARY 60%, DISABLED 38%.

Run: python scripts/_refactor_calc_colors.py
"""
from pathlib import Path

CSS_FILE = Path('src/input.css')

# ── New global #calc block ──────────────────────────────────────────────
GLOBAL_CALC = """\
/* ══════════════════════════════════════════════════════════════
   Calculator: Material Design color hierarchy (O-hierarchy)
   Global — applies to ALL pages with #calc
   PRIMARY 100% → active elements, headings, selected states
   SECONDARY 60% → inactive elements, labels, muted text
   DISABLED 38%  → placeholder text
   UNLAYERED — must beat @layer utilities from Tailwind classes
   ══════════════════════════════════════════════════════════════ */

  /* ── PRIMARY (100 %) ── */
  #calc :is(.text-ink, .heading-section, .heading-card) { color: var(--color-ah-975); }
  #calc .section-title { color: var(--color-ah-975); }
  #calc section:has(.calc-checkbox:checked) label,
  #calc #selected-frame-text { color: var(--color-ah-975); }
  #calc .size-btn.is-active  { color: var(--color-ah-975); }
  #calc .calc-badge.is-active { color: var(--color-ah-975); }
  #calc #desktop-price-bar .text-ink-muted { color: var(--color-ah-975); }
  #calc .form-input { color: var(--color-ah-975); }

  /* ── SECONDARY (60 %) ── */
  #calc :is(.text-small, figcaption, .text-ink-muted) { color: var(--color-ink-secondary); }
  #calc label                      { color: var(--color-ink-secondary); }
  #calc .wrap-btn[aria-checked="false"] { color: var(--color-ink-secondary); }
  #calc .text-xs.text-left          { color: var(--color-ink-secondary); }
  #calc .size-btn:not(.is-active)   { color: var(--color-ink-secondary); }
  #calc .calc-badge:not(.is-active) { color: var(--color-ink-secondary); }

  /* ── DISABLED (38 %) ── */
  #calc .form-input::placeholder { color: var(--color-ink-disabled); }

  /* ── Backgrounds & borders ── */
  #calc .size-btn { background: var(--color-ah-25); }
  #calc .size-btn.is-active { background: var(--color-ah-50); }
  #calc [role="radiogroup"] { background-color: transparent; padding: 0; gap: 0.5rem; }
  #calc .wrap-btn { background: var(--color-ah-25); border: 1px solid var(--color-ah-200); border-radius: 0.5rem; }
  #calc .wrap-btn[aria-checked="true"],
  #calc .wrap-btn.is-active { background-color: var(--color-ah-50); border-color: var(--color-ah-700); }
  #calc #processing-select { background-color: var(--color-ah-25); border-color: var(--color-ah-200); }
  #calc #frame-section { background-color: var(--color-ah-25); }
  #calc .form-input { background-color: var(--color-ah-25); }
  #calc .form-input:focus { background-color: var(--color-ah-50); }
  #calc #frame-section .text-ink-muted { color: var(--color-ah-600); }
  #calc #frame-section .w-10.rounded { border-color: var(--color-ah-200); }
  #calc #inp-w,
  #calc #inp-h {
    background-color: var(--color-ah-25);
    border-color: var(--color-ah-200);
    color: var(--color-ah-975);
  }
  #calc #inp-w:focus,
  #calc #inp-h:focus { background-color: var(--color-ah-50); }
  #calc #calc-preview-column > div { border-color: var(--color-ah-200); }
  #calc #calc-preview-column { background-color: var(--color-ah-25); }

  /* ── Progressive CTA (ghost → active) ── */
  #calc #btn-upload-empty,
  #calc #btn-submit-order {
    transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease,
                transform 0.25s cubic-bezier(.4,0,.2,1),
                box-shadow 0.25s cubic-bezier(.4,0,.2,1);
  }
  #calc #btn-submit-order {
    background: transparent;
    color: rgba(20, 11, 1, 0.35);
    border: 1px solid rgba(20, 11, 1, 0.12);
    pointer-events: none;
    box-shadow: none;
  }
  #calc:has(#uploader-thumbnails:not(:empty)) #btn-upload-empty {
    background: var(--color-ah-25);
    color: var(--color-ink-secondary);
    border: 1px solid var(--color-ah-200);
    transform: translateY(0);
    box-shadow: none;
  }
  #calc:has(#uploader-thumbnails:not(:empty)) #btn-upload-empty:hover {
    background: var(--color-ah-50);
    color: var(--color-ah-975);
    border-color: var(--color-ah-600);
    transform: translateY(0);
    box-shadow: none;
  }
  #calc:has(#uploader-thumbnails:not(:empty)) #btn-submit-order {
    background: var(--color-primary);
    color: #fff;
    border-color: transparent;
    pointer-events: auto;
    box-shadow: none;
  }
  #calc:has(#uploader-thumbnails:not(:empty)) #btn-submit-order:hover {
    background: var(--color-ah-975);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 11, 1, .18);
  }

  /* ── Frame modal: ghost → active ── */
  #apply-frame-selection {
    background: transparent;
    color: var(--color-ink-disabled);
    border: 1px solid rgba(20, 11, 1, 0.12);
    box-shadow: none;
  }
  #frame-modal:has(.calc-frame-upload-cta.has-photo) #apply-frame-selection {
    background: var(--color-primary);
    color: white;
    border: none;
  }

"""

# ── Slimmed .style-portraits block (without #calc rules) ───────────────
SLIM_SP = """\
/* ══════════════════════════════════════════════════════════════
   Style-portraits: O-hierarchy + section refinements
   Shared across ALL 18 style pages (scoped by body.style-portraits)
   UNLAYERED — must beat @layer utilities from Tailwind classes in HTML
   ══════════════════════════════════════════════════════════════ */

  /* ── Hero ── */
  .style-portraits #hero { padding-top: 4rem; padding-bottom: 5.5rem; }
  .style-portraits #hero .heading-hero {
    margin-bottom: 1rem;
  }

  /* ── Heading refinements ── */
  .style-portraits .heading-section { letter-spacing: -0.025em; text-wrap: balance; }
  .style-portraits .heading-card   { letter-spacing: -0.015em; line-height: 1.2; }

  /* ── PRIMARY (100 %) — non-calc sections ── */
  .style-portraits :is(#kak-zakazat, #harakteristiki, #preimushchestva, #otzyvy, #opisanie) :is(.text-ink, .heading-section, .heading-card) {
    color: var(--color-ah-975);
  }

  /* ── SECONDARY (60 %) — non-calc sections ── */
  .style-portraits :is(#kak-zakazat, #harakteristiki, #preimushchestva, #otzyvy, #opisanie) :is(.text-small, figcaption, .text-ink-muted) {
    color: var(--color-ink-secondary);
  }

  /* ── Как заказать — перенесено в @layer components как универсальный компонент ── */

  /* ── Характеристики ── */
  .style-portraits #harakteristiki .check-list-item { line-height: 1.75; }
  .style-portraits #harakteristiki .container + .container .grid { align-items: start; }
  .style-portraits #harakteristiki [data-tab-list] { max-width: 30rem; gap: 0.65rem; }
  .style-portraits #harakteristiki [data-tab-list] > button { box-shadow: 0 10px 22px rgba(20, 11, 1, .06); }
  .style-portraits #harakteristiki [data-tab-panels] { max-width: 442px; margin-inline: auto; }
  .style-portraits #harakteristiki [data-tab-panels] > div > img {
    border-radius: 1.25rem;
    box-shadow: 0 18px 38px rgba(20, 11, 1, .12);
  }

  /* ── Преимущества — перенесено в @layer components как универсальный компонент ── */

  /* ── Описание ── */
  .style-portraits #opisanie .text-ink { line-height: 1.75; }

  /* ── Отзывы: OAuth modal ── */
  .style-portraits #otzyvy .text-ah-800.text-sm { color: var(--color-ah-975); }
  .style-portraits #otzyvy .text-ah-975.text-sm.font-medium { color: var(--color-ah-975); }
  .style-portraits #otzyvy a.bg-white { background-color: var(--color-ah-25); }

  /* ── Примеры (dark section) ── */
  .style-portraits #primery .heading-section { letter-spacing: -0.03em; }

  /* ── CTA (dark section) ── */
  .style-portraits .cta-section .heading-section { letter-spacing: -0.03em; text-wrap: balance; }

  /* ── Sale banner → dark amber ── */
  .style-portraits .sale-banner { background-color: var(--color-ah-975); }
"""


def main():
    raw = CSS_FILE.read_bytes()
    eol = b'\r\n' if b'\r\n' in raw else b'\n'
    text = raw.decode('utf-8')
    if eol == b'\r\n':
        text = text.replace('\r\n', '\n')

    # Find boundaries
    START_MARKER = 'Style-portraits: O-hierarchy + section refinements'
    END_MARKER = '.style-portraits .sale-banner { background-color: var(--color-ah-975); }'

    lines = text.split('\n')

    sp_start = None
    sale_end = None
    for i, line in enumerate(lines):
        if START_MARKER in line and sp_start is None:
            sp_start = i - 1  # include the ═══ decoration line above
        if END_MARKER in line:
            sale_end = i

    if sp_start is None or sale_end is None:
        print('ERROR: Could not find style-portraits block boundaries')
        print(f'  START_MARKER found: {sp_start is not None}')
        print(f'  END_MARKER found: {sale_end is not None}')
        return

    old_line_count = sale_end - sp_start + 1
    print(f'Found .style-portraits block: lines {sp_start + 1}–{sale_end + 1} ({old_line_count} lines)')

    # Build replacement
    new_block = GLOBAL_CALC + SLIM_SP

    # Reconstruct file
    before = '\n'.join(lines[:sp_start])
    after = '\n'.join(lines[sale_end + 1:])
    result = before + '\n' + new_block + '\n' + after

    # Restore original line endings
    if eol == b'\r\n':
        result = result.replace('\n', '\r\n')

    CSS_FILE.write_bytes(result.encode('utf-8'))

    new_line_count = new_block.count('\n') + 1
    print(f'✅ Replaced {old_line_count} lines with {new_line_count} lines')
    print(f'   Global #calc block: {GLOBAL_CALC.count(chr(10))} lines')
    print(f'   Slimmed .style-portraits: {SLIM_SP.count(chr(10))} lines')
    print(f'   Removed: {old_line_count - new_line_count} lines (all #calc rules from .style-portraits)')


if __name__ == '__main__':
    main()

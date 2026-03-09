#!/usr/bin/env python3
"""Replace YouTube video embeds with server-hosted video-card + video-modal.

Pattern source: portret-maslom.html #opisanie
"""
import re, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLE = os.path.join(BASE, 'src', 'html', 'portret-na-zakaz', 'style')

# ── New video-card HTML (float layout, 24-space indent) ──────────────────────
CARD_FLOAT = """\
                        <div class="video-card cursor-pointer relative {aspect} overflow-hidden rounded-xl" data-video="{video_url}" data-index="0">
                            <img
                                src="{poster_src}"
                                alt="{poster_alt}"
                                class="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                width="{poster_w}"
                                height="{poster_h}"
                            >
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                <p class="text-sm text-white/90 mb-1">{title}</p>
                                <div class="flex items-center gap-2 text-white/80 text-sm">
                                    <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    <span>{duration}</span>
                                </div>
                            </div>
                        </div>
                        <figcaption class="mt-2 text-small text-ink">{title} — {duration_text}</figcaption>"""

# ── New video-card HTML (fotomozaika grid layout, 20-space indent) ───────────
CARD_GRID = """\
                <figure>
                    <div class="video-card cursor-pointer relative {aspect} overflow-hidden rounded-xl" data-video="{video_url}" data-index="0">
                        <img
                            src="{poster_src}"
                            alt="{poster_alt}"
                            class="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width="{poster_w}"
                            height="{poster_h}"
                        >
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                            <p class="text-sm text-white/90 mb-1">{title}</p>
                            <div class="flex items-center gap-2 text-white/80 text-sm">
                                <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                    <figcaption class="mt-2 text-small text-ink text-center">{title} — {duration_text}</figcaption>
                </figure>"""

# ── Video modal (same for all pages) ────────────────────────────────────────
VIDEO_MODAL = """\

    <!-- Video Modal -->
    <div class="video-modal" id="video-modal">
        <div class="video-modal-content">
            <button class="ui-control ui-control--md ui-control--close" aria-label="Закрыть">
                <svg fill="none" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
            <button class="ui-control ui-control--md ui-control--mute" aria-label="Включить звук">
                <svg aria-hidden="true" class="mute-icon" viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63m2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71M4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9zM12 4 9.91 6.09 12 8.18z"/></svg>
                <svg aria-hidden="true" class="unmute-icon hidden" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77"/></svg>
            </button>
            <button class="ui-control ui-control--md ui-control--prev" aria-label="Предыдущее видео">
                <svg fill="none" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 19-7-7 7-7"/></svg>
            </button>
            <video id="modal-video" preload="none" controls playsinline></video>
            <button class="ui-control ui-control--md ui-control--next" aria-label="Следующее видео">
                <svg fill="none" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>
            </button>
        </div>
    </div>
"""

# ── Page configurations ──────────────────────────────────────────────────────
FLOAT_PAGES = [
    dict(
        file='granzh-portret.html',
        video_url='https://muse.ooo/video/video-s-primerom-portreta-v-stile-granzh.mp4',
        poster_src='https://muse.ooo/upload/img/o-grange-on-canvas.webp',
        poster_alt='Гранж портрет на холсте — видео',
        poster_w='360', poster_h='640',
        aspect='aspect-[9/16]',
        title='Гранж портрет на холсте',
        duration='0:14', duration_text='14 сек.',
    ),
    dict(
        file='wpap-portret.html',
        video_url='https://muse.ooo/video/video-s-primerom-portreta-v-stile-wpap.mp4',
        poster_src='https://muse.ooo/upload/img/wpap-cover-360-2205.webp',
        poster_alt='WPAP портрет на холсте — видео',
        poster_w='360', poster_h='202',
        aspect='aspect-video',
        title='WPAP портрет на холсте',
        duration='0:19', duration_text='19 сек.',
    ),
    dict(
        file='low-poly-portret.html',
        video_url='https://muse.ooo/video/video-s-primerom-portreta-v-stile-low-poly.mp4',
        poster_src='https://muse.ooo/upload/img/low-poly-cover-360-2205.webp',
        poster_alt='Портрет в стиле Лоу Поли — видео',
        poster_w='360', poster_h='640',
        aspect='aspect-[9/16]',
        title='Портрет в стиле Лоу Поли',
        duration='0:17', duration_text='17 сек.',
    ),
    dict(
        file='sharzh-po-foto.html',
        video_url='https://muse.ooo/video/korotkoe-video-o-sharzhe-dlya-anatoliya-vassermana.mp4',
        poster_src='https://muse.ooo/upload/img/sharzh-po-foto-382-687.webp',
        poster_alt='Шарж по фото — видео',
        poster_w='382', poster_h='687',
        aspect='aspect-[9/16]',
        title='Шарж по фото',
        duration='0:16', duration_text='16 сек.',
    ),
]

GRID_PAGE = dict(
    file='fotomozaika.html',
    video_url='https://muse.ooo/video/fotomozaika-dlya-sergeya-lazareva.mp4',
    poster_src='https://img.youtube.com/vi/_VGKE0Q9hWI/maxresdefault.jpg',
    poster_alt='Фотомозаика для Сергея Лазарева — видео',
    poster_w='1280', poster_h='720',
    aspect='aspect-video',
    title='Фотомозаика для Сергея Лазарева',
    duration='0:43', duration_text='43 сек.',
)


def process_float(cfg):
    """Replace video in pages with float layout (desc-media--left)."""
    path = os.path.join(STYLE, cfg['file'])
    print(f"\n=== {cfg['file']} ===")

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1) Replace video card:
    #    Match <figure class="desc-media desc-media--left"> ... <div data-video-cover/src ...>...</div> ... </figure>
    pat = (
        r'(<figure\s+class="desc-media desc-media--left">)'  # group 1: opening figure
        r'\s*'
        r'<div[^>]*data-video-(?:cover|src)[^>]*>'  # opening video div (with any attrs)
        r'.*?'                                        # content (non-greedy, DOTALL)
        r'</div>'                                     # closing video div
        r'\s*'
        r'(</figure>)'                                # group 2: closing figure
    )
    m = re.search(pat, content, flags=re.DOTALL)
    if not m:
        print("  ERROR: video card pattern not found")
        return False

    card = CARD_FLOAT.format(**cfg)
    replacement = m.group(1) + '\n' + card + '\n                    ' + m.group(2)
    content = content[:m.start()] + replacement + content[m.end():]
    print("  OK: video card replaced")

    # 2) Add video-modal before </main>
    if '</main>' not in content:
        print("  ERROR: </main> not found")
        return False
    content = content.replace('</main>', VIDEO_MODAL + '    </main>', 1)
    print("  OK: video-modal added")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def process_grid(cfg):
    """Replace video in fotomozaika (grid layout)."""
    path = os.path.join(STYLE, cfg['file'])
    print(f"\n=== {cfg['file']} ===")

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1) Match the wrapper: <!-- Видео --> <div> <div data-video-cover>...</div> <h3>...</h3> </div>
    pat = (
        r'<!-- Видео -->\s*'
        r'<div>\s*'
        r'<div[^>]*data-video-cover[^>]*>'
        r'.*?'
        r'</div>\s*'
        r'<h3[^>]*>.*?</h3>\s*'
        r'</div>'
    )
    m = re.search(pat, content, flags=re.DOTALL)
    if not m:
        print("  ERROR: video block pattern not found")
        return False

    card = CARD_GRID.format(**cfg)
    replacement = '<!-- Видео -->\n' + card
    content = content[:m.start()] + replacement + content[m.end():]
    print("  OK: video card replaced")

    # 2) Add video-modal before </main>
    if '</main>' not in content:
        print("  ERROR: </main> not found")
        return False
    content = content.replace('</main>', VIDEO_MODAL + '    </main>', 1)
    print("  OK: video-modal added")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def main():
    ok = True
    for cfg in FLOAT_PAGES:
        if not process_float(cfg):
            ok = False
    if not process_grid(GRID_PAGE):
        ok = False

    if ok:
        print("\n✅ All 5 pages processed successfully.")
    else:
        print("\n❌ Some pages had errors — check output above.")
        sys.exit(1)


if __name__ == '__main__':
    main()

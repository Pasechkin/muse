$navComment = @'
/* Page Navigator moved to src/input.css */

/* Carousel moved to ../../css/output.css */

/* Grid layout для Описания БЕЗ видео */
'@

$handleSvg = @'
<div class="slider-handle">
    <svg class="w-full h-auto drop-shadow-md" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="28" fill="white" fill-opacity="0.15" stroke="white" stroke-width="1.5" style="backdrop-filter: blur(8px);"/>
        <path d="M42 22L34 30L42 38" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M58 22L66 30L58 38" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</div>
'@

$files = Get-ChildItem -Path 'src\html\portret-na-zakaz\style\*.html' -File
foreach ($f in $files) {
    $text = Get-Content $f -Raw -Encoding UTF8
    $orig = $text

    # remove combined ba-card + canvas-3d block if present
    $text = [regex]::Replace($text, '(?s)/\*\s*Before/After Slider.*?\.canvas-3d\s*\{.*?\}(?:\s*\.canvas-3d:hover\s*\{.*?\})?', $navComment)

    # remove ba-card-only block if present (shorter variant)
    $text = [regex]::Replace($text, '(?s)/\*\s*Before/After Slider\s*\(ba-card\)\s*.*?\.ba-card\s*\{.*?\}.*?\.ba-card\s*\.[^{]*\{.*?\}.*?','')

    # normalize divider
    $text = [regex]::Replace($text, 'class="ba-divider[^"]*"', 'class="divider"')

    # replace handle block
    $text = [regex]::Replace($text, '(?s)<div[^>]*class="ba-handle[^"]*"[^>]*>.*?<\/div>', $handleSvg)

    # rename wrapper and add --pos (if ba-card exists)
    $text = [regex]::Replace($text, '(?s)<div\s+class="ba-card([^"]*)"', '<div class="before-after-slider$1" style="--pos: 50%;"')

    # add --depth to canvas-3d wrappers
    $text = [regex]::Replace($text, '(?s)<div\s+class="canvas-3d([^"]*)"', '<div class="canvas-3d$1" style="--depth: 30px;"')

    if ($text -ne $orig) {
        Set-Content -Path $f.FullName -Value $text -Encoding UTF8
        Write-Output "Updated: $($f.Name)"
    } else {
        Write-Output "No change: $($f.Name)"
    }
}

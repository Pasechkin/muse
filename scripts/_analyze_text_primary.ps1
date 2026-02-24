$root = "c:\Users\Анна\Documents\Muse-tailwind\tailwind-project\src\html"
$files = Get-ChildItem -Recurse -Filter "*.html" -Path $root | Where-Object { $_.Name -ne "calc.html" -and $_.Name -ne "colors.html" }

$results = @()

foreach ($file in $files) {
    $rel = $file.FullName.Replace("$root\","")
    $lines = Get-Content $file.FullName
    
    $large_xl_bold = 0      # text-xl font-bold text-primary (step numbers)
    $large_lead_bold = 0    # text-lead font-bold text-primary
    $large_2xl_bold = 0     # text-2xl font-bold text-primary (prices)
    $large_lg_bold = 0      # text-lg font-bold text-primary (sticky prices)
    $large_svg_icon = 0     # w-10 h-10 text-primary (SVG icons)
    $large_group_hover = 0  # group-hover:text-primary (blog card titles text-xl)
    $large_flex_gap = 0     # flex.*gap.*text-primary (rating stars)
    $large_btn_bg = 0       # bg-white text-primary (button on dark bg - NOT small link)
    $large_btn_mode = 0     # btn mode buttons (modular-painting)
    $large_press = 0        # uppercase tracking-wide text-primary (press release labels)
    $large_city_reset = 0   # data-city-reset text-primary font-bold (city reset button)
    
    $small_link_underline = 0     # text-primary underline / text-primary hover:no-underline underline (inline links)
    $small_link_hover_underline = 0 # text-primary hover:underline (TOC links)
    $small_breadcrumb_hover = 0   # hover:text-primary on breadcrumbs (text-xs/text-sm)
    $small_city_hover = 0         # hover:text-primary on city dialog links
    $small_oferta_hover = 0       # hover:text-primary on oferta/politika
    $small_catalog_link = 0       # text-primary font-medium text-xs (catalog)
    $small_blog_readmore = 0      # text-primary text-sm font-medium (blog read more)
    $small_nav_link = 0           # flex items-center gap-2 text-primary hover:underline (back nav)
    $small_blog_cta = 0           # bg-white text-primary hover:bg-gray-100 (blog CTA button)
    $small_cookie = 0             # hover:text-primary-hover on cookie (already done)
    $small_other = 0              # other small text-primary
    
    $already_done = 0             # text-primary-hover or text-primary-text (already migrated)
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        $lineNum = $i + 1
        
        # Skip lines that only have text-primary-hover or text-primary-text or text-primary-light
        # Count actual text-primary (not text-primary-*)
        $matches_tp = [regex]::Matches($line, 'text-primary(?!-)')
        
        foreach ($m in $matches_tp) {
            $ctx = $line
            
            # LARGE patterns
            if ($ctx -match 'text-xl.*font-bold.*text-primary|text-primary.*font-bold.*text-xl') {
                $large_xl_bold++
            }
            elseif ($ctx -match 'text-lead.*font-bold.*text-primary|text-primary.*font-bold.*text-lead') {
                $large_lead_bold++
            }
            elseif ($ctx -match 'text-2xl.*font-bold.*text-primary') {
                $large_2xl_bold++
            }
            elseif ($ctx -match 'text-lg.*font-bold.*text-primary') {
                $large_lg_bold++
            }
            elseif ($ctx -match 'w-10.*h-10.*text-primary') {
                $large_svg_icon++
            }
            elseif ($ctx -match 'group-hover:text-primary') {
                $large_group_hover++
            }
            elseif ($ctx -match 'flex.*gap.*text-primary.*justify') {
                $large_flex_gap++
            }
            elseif ($ctx -match 'uppercase.*tracking-wide.*text-primary') {
                $large_press++
            }
            elseif ($ctx -match 'data-city-reset.*text-primary.*font-bold') {
                $large_city_reset++
            }
            elseif ($ctx -match 'bg-white.*text-primary.*hover:bg-gray') {
                $small_blog_cta++
            }
            elseif ($ctx -match 'px-3.*py-2.*text-primary.*shadow|text-primary.*shadow.*ring') {
                $large_btn_mode++
            }
            # SMALL patterns
            elseif ($ctx -match 'hover:text-primary.*transition-colors' -and ($ctx -match 'breadcrumb|class="hover:text-primary transition')) {
                $small_breadcrumb_hover++
            }
            elseif ($ctx -match 'data-city-option.*hover:text-primary|hover:text-primary.*data-city-option') {
                $small_city_hover++
            }
            elseif ($ctx -match 'hover:text-primary' -and $ctx -match 'gray-500') {
                $small_city_hover++
            }
            elseif ($ctx -match 'hover:text-primary' -and ($ctx -match 'oferta|politika')) {
                $small_oferta_hover++
            }
            elseif ($ctx -match 'text-primary.*underline.*hover:no-underline|text-primary.*hover:no-underline.*underline') {
                $small_link_underline++
            }
            elseif ($ctx -match 'text-primary.*underline|text-primary.*hover:underline') {
                $small_link_hover_underline++
            }
            elseif ($ctx -match 'text-primary.*text-sm.*font-medium|text-sm.*text-primary.*font-medium') {
                $small_blog_readmore++
            }
            elseif ($ctx -match 'flex.*items-center.*gap.*text-primary.*hover:underline') {
                $small_nav_link++
            }
            elseif ($ctx -match 'hover:text-primary') {
                $small_other++
            }
            else {
                $small_other++
            }
        }
    }
    
    $total_large = $large_xl_bold + $large_lead_bold + $large_2xl_bold + $large_lg_bold + $large_svg_icon + $large_group_hover + $large_flex_gap + $large_press + $large_city_reset + $large_btn_mode
    $total_small = $small_link_underline + $small_link_hover_underline + $small_breadcrumb_hover + $small_city_hover + $small_oferta_hover + $small_catalog_link + $small_blog_readmore + $small_nav_link + $small_blog_cta + $small_cookie + $small_other
    
    if (($total_large + $total_small) -gt 0) {
        $results += [PSCustomObject]@{
            File = $rel
            TotalSmall = $total_small
            TotalLarge = $total_large
            LinkUnderline = $small_link_underline
            LinkHoverUnderline = $small_link_hover_underline
            BreadcrumbHover = $small_breadcrumb_hover
            CityHover = $small_city_hover
            OfertaHover = $small_oferta_hover
            BlogReadmore = $small_blog_readmore
            NavLink = $small_nav_link
            BlogCTA = $small_blog_cta
            Other = $small_other
            L_XlBold = $large_xl_bold
            L_2xlBold = $large_2xl_bold
            L_LgBold = $large_lg_bold
            L_SvgIcon = $large_svg_icon
            L_GroupHover = $large_group_hover
            L_FlexGap = $large_flex_gap
            L_Press = $large_press
            L_CityReset = $large_city_reset
            L_BtnMode = $large_btn_mode
            L_LeadBold = $large_lead_bold
        }
    }
}

Write-Host "=============================================="
Write-Host "  TEXT-PRIMARY ANALYSIS (excluding calc.html, colors.html)"
Write-Host "=============================================="
Write-Host ""

foreach ($r in ($results | Sort-Object File)) {
    Write-Host "FILE: $($r.File)"
    Write-Host "  SMALL (should change): $($r.TotalSmall)"
    if ($r.LinkUnderline -gt 0) { Write-Host "    - text-primary underline/hover:no-underline (inline links): $($r.LinkUnderline)" }
    if ($r.LinkHoverUnderline -gt 0) { Write-Host "    - text-primary hover:underline (TOC/paragraph links): $($r.LinkHoverUnderline)" }
    if ($r.BreadcrumbHover -gt 0) { Write-Host "    - hover:text-primary (breadcrumbs): $($r.BreadcrumbHover)" }
    if ($r.CityHover -gt 0) { Write-Host "    - hover:text-primary (city dialog): $($r.CityHover)" }
    if ($r.OfertaHover -gt 0) { Write-Host "    - hover:text-primary (oferta/politika): $($r.OfertaHover)" }
    if ($r.BlogReadmore -gt 0) { Write-Host "    - text-primary text-sm (blog read more): $($r.BlogReadmore)" }
    if ($r.NavLink -gt 0) { Write-Host "    - flex gap text-primary hover:underline (back nav): $($r.NavLink)" }
    if ($r.BlogCTA -gt 0) { Write-Host "    - bg-white text-primary (blog CTA button): $($r.BlogCTA)" }
    if ($r.Other -gt 0) { Write-Host "    - other small: $($r.Other)" }
    Write-Host "  LARGE (do NOT change): $($r.TotalLarge)"
    if ($r.L_XlBold -gt 0) { Write-Host "    - text-xl font-bold text-primary (step numbers): $($r.L_XlBold)" }
    if ($r.L_LeadBold -gt 0) { Write-Host "    - text-lead font-bold text-primary (step numbers): $($r.L_LeadBold)" }
    if ($r.L_2xlBold -gt 0) { Write-Host "    - text-2xl font-bold text-primary (prices): $($r.L_2xlBold)" }
    if ($r.L_LgBold -gt 0) { Write-Host "    - text-lg font-bold text-primary (sticky prices): $($r.L_LgBold)" }
    if ($r.L_SvgIcon -gt 0) { Write-Host "    - w-10 h-10 text-primary (SVG icons): $($r.L_SvgIcon)" }
    if ($r.L_GroupHover -gt 0) { Write-Host "    - group-hover:text-primary (blog card titles): $($r.L_GroupHover)" }
    if ($r.L_FlexGap -gt 0) { Write-Host "    - flex gap text-primary (rating stars): $($r.L_FlexGap)" }
    if ($r.L_Press -gt 0) { Write-Host "    - uppercase tracking-wide text-primary (press label): $($r.L_Press)" }
    if ($r.L_CityReset -gt 0) { Write-Host "    - data-city-reset text-primary (city reset btn): $($r.L_CityReset)" }
    if ($r.L_BtnMode -gt 0) { Write-Host "    - px-3 py-2 text-primary shadow (mode button): $($r.L_BtnMode)" }
    Write-Host ""
}

$totalSmallAll = ($results | Measure-Object -Property TotalSmall -Sum).Sum
$totalLargeAll = ($results | Measure-Object -Property TotalLarge -Sum).Sum
Write-Host "=============================================="
Write-Host "GRAND TOTAL: Small=$totalSmallAll  Large=$totalLargeAll  All=$($totalSmallAll+$totalLargeAll)"
Write-Host "=============================================="

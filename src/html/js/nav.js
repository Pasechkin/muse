/**
 * Muse Navigation & UI Scripts
 * - Page Navigator (боковая навигация)
 * - Back to Top (кнопка "Наверх")
 * - Carousel (Карусель: драг, колесико, кнопки)
 */
// Global helper: BxPopup (kept global for compatibility with inline onclicks)
if (!window.BxPopup) {
  window.BxPopup = function(url, width, height) {
    if (!url) return;
    var left = Math.round((screen.width - width) / 2);
    var top = Math.round((screen.height - height) / 2);
    window.open(url, '', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
  };
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ nav.js loaded and DOMContentLoaded fired');

    // --- 0. INPUT MASKS (RU phone) ---
    function formatRuPhone(rawDigits) {
        var digits = (rawDigits || '').replace(/\D/g, '');
        if (!digits) return '';

        // Normalize: 8XXXXXXXXXX -> 7XXXXXXXXXX
        if (digits.charAt(0) === '8') digits = '7' + digits.slice(1);
        // Strip country if present
        if (digits.charAt(0) === '7') digits = digits.slice(1);

        digits = digits.slice(0, 10);
        var a = digits.slice(0, 3);
        var b = digits.slice(3, 6);
        var c = digits.slice(6, 8);
        var d = digits.slice(8, 10);

        var out = '+7';
        if (a) out += ' (' + a;
        if (a && a.length === 3) out += ')';
        if (b) out += ' ' + b;
        if (c) out += '-' + c;
        if (d) out += '-' + d;
        return out;
    }

    function attachRuPhoneMask(input) {
        if (!input || input.dataset.maskSkip === 'true') return;
        // Ensure helpful attributes
        if (!input.getAttribute('autocomplete')) input.setAttribute('autocomplete', 'tel');
        if (!input.getAttribute('inputmode')) input.setAttribute('inputmode', 'tel');

        var onChange = function() {
            var digits = (input.value || '').replace(/\D/g, '');
            var formatted = formatRuPhone(digits);
            input.value = formatted;
        };

        input.addEventListener('input', onChange);
        input.addEventListener('blur', onChange);
        onChange();
    }

    document.querySelectorAll('input[type="tel"]').forEach(attachRuPhoneMask);

    // --- 1. PAGE NAVIGATOR (старый) ---
    const pageNavigator = document.querySelector('.page-navigator');
    const navLinks = document.querySelectorAll('.page-navigator .inner-link');
    const backToTop = document.getElementById('back-to-top');

    // Плавный скролл при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Показать/скрыть навигатор (только на десктопе)
    function togglePageNavigator() {
        if (pageNavigator) {
            pageNavigator.style.display = window.innerWidth >= 1024 ? 'block' : 'none';
        }
    }

    // Кэш позиций секций для избежания forced reflow
    let sectionCache = [];
    let cacheValid = false;

    function cacheSectionPositions() {
        const sections = document.querySelectorAll('section[id]');
        sectionCache = [];
        sections.forEach(section => {
            sectionCache.push({
                id: section.getAttribute('id'),
                top: section.offsetTop,
                height: section.offsetHeight
            });
        });
        cacheValid = true;
    }

    // Подсветка активной секции при скролле (без forced reflow)
    function updateActiveLink() {
        if (!cacheValid) cacheSectionPositions();
        
        const scrollPos = window.scrollY + 200;

        for (let i = 0; i < sectionCache.length; i++) {
            const section = sectionCache[i];
            const navLink = document.querySelector(`.page-navigator a[href="#${section.id}"]`);

            if (navLink) {
                if (scrollPos >= section.top && scrollPos < section.top + section.height) {
                    navLinks.forEach(l => l.classList.remove('inner-link--active'));
                    navLink.classList.add('inner-link--active');
                    break; // Нашли активную секцию — выходим
                }
            }
        }
    }

    // Back to Top (читаем scrollY один раз)
    let lastBackToTopState = null;
    function toggleBackToTop() {
        if (backToTop) {
            const show = window.scrollY > 300 && window.innerWidth >= 768;
            // Меняем классы только если состояние изменилось
            if (show !== lastBackToTopState) {
                lastBackToTopState = show;
                backToTop.classList.toggle('opacity-0', !show);
                backToTop.classList.toggle('pointer-events-none', !show);
                backToTop.classList.toggle('opacity-100', show);
            }
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function toggleUI() {
        toggleBackToTop();
        togglePageNavigator();
        updateActiveLink();
    }

    // Throttle для scroll (16ms ≈ 60fps)
    let scrollTicking = false;
    function onScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                toggleUI();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    // Debounce для resize (сброс кэша + обновление UI)
    let resizeTimeout;
    function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            cacheValid = false; // Сброс кэша позиций
            cacheSectionPositions();
            toggleUI();
        }, 150);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    
    // Инициализация: кэшируем позиции после полной загрузки
    cacheSectionPositions();
    toggleUI();

    // Video Cover (create iframe only on click)
    document.querySelectorAll('[data-video-cover]').forEach(function(cover) {
        const playBtn = cover.querySelector('[data-play-btn]');
        if (!playBtn) return;
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (cover.classList.contains('video-playing')) return;

            // Option 1: data-video-src → create iframe (YouTube/external)
            const src = cover.dataset.videoSrc;
            if (src) {
                if (cover.querySelector('iframe')) return;
                const title = cover.dataset.videoTitle || 'Видео';
                const iframe = document.createElement('iframe');
                iframe.className = 'absolute inset-0 w-full h-full';
                iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.loading = 'lazy';
                iframe.title = title;
                const sep = src.indexOf('?') === -1 ? '?' : '&';
                iframe.src = src + sep + 'autoplay=1';
                cover.appendChild(iframe);
                cover.classList.add('video-playing');
                return;
            }

            // Option 2: local <video> element inside container
            const video = cover.querySelector('video');
            if (video) {
                video.classList.remove('hidden');
                video.controls = true;
                video.play().catch(function(){});
                cover.classList.add('video-playing');
            }
        });
    });

    // Accessibility: dialogs focus management, keyboard, and accessible play controls
    (function(){
        const origShow = HTMLDialogElement.prototype.showModal;
        const origClose = HTMLDialogElement.prototype.close;

        HTMLDialogElement.prototype.showModal = function(){
            // Save opener (activeElement)
            const opener = document.activeElement;
            this.__muse_opener = opener;

            // Ensure ARIA attributes
            if (!this.hasAttribute('role')) this.setAttribute('role','dialog');
            this.setAttribute('aria-modal','true');
            if (!this.hasAttribute('aria-labelledby')){
                const heading = this.querySelector('h1,h2,h3,h4,h5,h6');
                if (heading){
                    if (!heading.id) heading.id = 'dialog-title-' + Math.random().toString(36).slice(2,9);
                    this.setAttribute('aria-labelledby', heading.id);
                }
            }

            // Focusable elements inside dialog
            const focusableSelector = 'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
            this.__focusables = Array.from(this.querySelectorAll(focusableSelector));
            this.__firstFocusable = this.__focusables[0] || this;
            this.__lastFocusable = this.__focusables[this.__focusables.length-1] || this;
            this.__previouslyFocused = document.activeElement;

            // Call native and then set focus (in try/catch for safety)
            origShow.call(this);
            try{ this.__firstFocusable.focus(); }catch(e){}

            // Keydown handler: Escape + focus trap
            this.__keydownHandler = function(e){
                if (e.key === 'Escape'){
                    e.preventDefault();
                    try{ this.close(); }catch(e){}
                }
                if (e.key === 'Tab'){
                    const active = document.activeElement;
                    if (e.shiftKey){
                        if (active === this.__firstFocusable || active === this){ e.preventDefault(); this.__lastFocusable.focus(); }
                    } else {
                        if (active === this.__lastFocusable || active === this){ e.preventDefault(); this.__firstFocusable.focus(); }
                    }
                }
            }.bind(this);
            document.addEventListener('keydown', this.__keydownHandler);

            // Set aria-expanded / aria-controls on opener if applicable
            try{
                if (opener && opener.setAttribute){
                    if (this.id) opener.setAttribute('aria-controls', this.id);
                    opener.setAttribute('aria-expanded','true');
                }
            }catch(e){}
        };

        HTMLDialogElement.prototype.close = function(){
            try{ if (this.__keydownHandler) document.removeEventListener('keydown', this.__keydownHandler); }catch(e){}
            try{ if (this.__previouslyFocused) this.__previouslyFocused.focus(); }catch(e){}
            try{ if (this.__muse_opener && this.__muse_opener.setAttribute) this.__muse_opener.setAttribute('aria-expanded','false'); }catch(e){}
            origClose.call(this);
        };

        // Ensure existing dialogs have ARIA attributes and labelledby
        document.querySelectorAll('dialog').forEach(function(d){
            if (!d.hasAttribute('role')) d.setAttribute('role','dialog');
            d.setAttribute('aria-modal','true');
            if (!d.hasAttribute('aria-labelledby')){
                const heading = d.querySelector('h1,h2,h3,h4,h5,h6');
                if (heading){ if (!heading.id) heading.id = 'dialog-title-' + Math.random().toString(36).slice(2,9); d.setAttribute('aria-labelledby', heading.id); }
            }
            // Make close buttons accessible
            d.querySelectorAll('[onclick*=".close("] , button[onclick*=".close("]').forEach(function(btn){ if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label','Закрыть окно'); });
        });

        // Make video play controls keyboard-accessible and add ARIA
        document.querySelectorAll('.ui-control--play, .video-play-icon, [data-play-btn]').forEach(function(el){
            if (el.tagName !== 'BUTTON'){
                el.setAttribute('role','button');
                el.setAttribute('tabindex','0');
            }
            if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label','Воспроизвести видео');
            el.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });

            const cover = el.closest('[data-video-cover], .video-cover');
            if (cover){
                const video = cover.querySelector('video');
                const iframe = cover.querySelector('iframe');
                if (video && video.id) el.setAttribute('aria-controls', video.id);
                if (iframe){ if (!iframe.id) iframe.id = 'iframe-' + Math.random().toString(36).slice(2,9); el.setAttribute('aria-controls', iframe.id); if (!iframe.hasAttribute('title')) iframe.setAttribute('title','Видео'); }
            }
        });

        // Observe video-cover class changes to update aria-expanded
        const mc = new MutationObserver(function(records){
            records.forEach(function(r){ if (r.type === 'attributes' && r.attributeName === 'class'){ const el = r.target; const btn = el.querySelector('.ui-control--play, .video-play-icon, [data-play-btn]'); if (btn){ if (el.classList.contains('video-playing')) btn.setAttribute('aria-expanded','true'); else btn.setAttribute('aria-expanded','false'); } } });
        });
        document.querySelectorAll('[data-video-cover], .video-cover').forEach(function(c){ mc.observe(c, { attributes: true }); });

    })();

    // Carousel Scroll (drag + wheel + защита от случайного клика)
    document.querySelectorAll('.carousel-scroll').forEach(function(carousel) {
        // Прокрутка колесиком мыши
        carousel.addEventListener('wheel', function(e) {
            if (window.innerWidth < 1024) return;
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                e.preventDefault();
                carousel.scrollBy({ left: e.deltaY * 0.6, behavior: 'auto' });
            }
        }, { passive: false });
        
        // Drag-to-scroll с защитой от случайного клика
        var isDown = false, startX, startScrollLeft, hasMoved = false, clickBlocked = false;
        var DRAG_THRESHOLD = 5;
        carousel.style.cursor = 'grab';
        
        carousel.addEventListener('mousedown', function(e) {
            if (window.innerWidth < 1024) return;
            isDown = true;
            hasMoved = false;
            clickBlocked = false;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX;
            startScrollLeft = carousel.scrollLeft;
            e.preventDefault();
        });
        
        carousel.addEventListener('mousemove', function(e) {
            if (!isDown || window.innerWidth < 1024) return;
            e.preventDefault();
            var moveDistance = Math.abs(e.pageX - startX);
            if (moveDistance > DRAG_THRESHOLD) {
                hasMoved = true;
                clickBlocked = true;
            }
            carousel.scrollLeft = startScrollLeft - (e.pageX - startX) * 1.2;
        });
        
        // Блокировка клика после перетаскивания
        carousel.addEventListener('click', function(e) {
            if (clickBlocked && window.innerWidth >= 1024) {
                e.preventDefault();
                e.stopPropagation();
                clickBlocked = false;
            }
        }, true);
        
        carousel.addEventListener('mouseup', function() {
            isDown = false;
            carousel.style.cursor = 'grab';
            if (hasMoved) {
                clickBlocked = true;
                setTimeout(function() { clickBlocked = false; }, 100);
            }
        });
        
        carousel.addEventListener('mouseleave', function() {
            if (isDown) {
                isDown = false;
                hasMoved = false;
                carousel.style.cursor = 'grab';
            }
        });
    });

    // Кнопки навигации карусели (Prev / Next)
    document.addEventListener('click', function(e) {
        const prevBtn = e.target.closest('.js-carousel-prev');
        const nextBtn = e.target.closest('.js-carousel-next');
        if (!prevBtn && !nextBtn) return;
        const btn = prevBtn || nextBtn;
        // Найти ближайший контейнер с .carousel-scroll
        let wrapper = btn.closest('.relative');
        if (!wrapper) wrapper = btn.parentElement;
        const carousel = wrapper ? wrapper.querySelector('.carousel-scroll') : document.querySelector('.carousel-scroll');
        if (!carousel) return;
        const amount = Math.max(Math.round(carousel.clientWidth * 0.6), 300);
        const delta = prevBtn ? -amount : amount;
        carousel.scrollBy({ left: delta, behavior: 'smooth' });
    });

    // ARIA: role=list / role=listitem и скрытая подсказка для скринридеров
    document.querySelectorAll('.carousel-scroll').forEach(function(carousel) {
        // Пометить внутренний флекс-контейнер как список
        const flex = carousel.querySelector('.flex');
        if (flex) {
            flex.setAttribute('role', 'list');
            flex.setAttribute('aria-label', 'Слайды');
            // Пометить прямых детей как элементы списка
            Array.prototype.slice.call(flex.children).forEach(function(child) {
                if (!child.hasAttribute('role')) child.setAttribute('role', 'listitem');
            });
        }

        // Добавить скрытую подсказку для управления каруселью (если ещё нет)
        if (!carousel.querySelector('.carousel-sr-instructions')) {
            const p = document.createElement('p');
            p.className = 'sr-only carousel-sr-instructions';
            p.textContent = 'Карусель. Используйте кнопки «Назад» и «Вперед» для навигации.';
            carousel.insertBefore(p, carousel.firstChild);
        }

        // Добавить Prev/Next кнопки в родительский wrapper (если ещё нет) — удобно для страниц, где HTML не содержит кнопок
        (function() {
            let wrapper = carousel.closest('[role="region"]') || carousel.parentElement;
            if (!wrapper) return;
            // Make sure wrapper is positioned so absolute buttons can be placed
            if (!wrapper.classList.contains('relative')) wrapper.classList.add('relative');
            // Если уже есть кнопки — выйти
            if (wrapper.querySelector('.js-carousel-prev') || wrapper.querySelector('.js-carousel-next')) return;
            // Установить id у wrapper, если нет
            if (!wrapper.id) {
                wrapper.id = 'carousel-' + Math.random().toString(36).slice(2,9);
            }

            const prev = document.createElement('button');
            prev.className = 'ui-control ui-control--lg js-carousel-prev hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20';
            prev.setAttribute('aria-label', 'Назад');
            prev.setAttribute('aria-controls', wrapper.id);
            prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; 

            const next = document.createElement('button');
            next.className = 'ui-control ui-control--lg js-carousel-next hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20';
            next.setAttribute('aria-label', 'Вперед');
            next.setAttribute('aria-controls', wrapper.id);
            next.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; 

            wrapper.appendChild(prev);
            wrapper.appendChild(next);
        })();
    });

    // --- 2. Before/After slider: bind range inputs and sync handle/divider ---
    document.querySelectorAll('.before-after-slider, .ba-card').forEach(function(container){
        try{
            const input = container.querySelector('input[type="range"]');
            const handle = container.querySelector('.ba-handle, .slider-handle');
            const divider = container.querySelector('.divider, .ba-divider');
            function setPos(val){
                const pct = String(val).trim().replace('%','') + '%';
                container.style.setProperty('--pos', pct);
                if (handle) handle.style.left = pct;
                if (divider) divider.style.left = pct;
            }
            if (input){
                input.addEventListener('input', function(){ setPos(this.value); });
                setPos(input.value);
            }
        }catch(e){ console.warn('BA slider init failed', e); }
    });

    // --- 3. VIDEO MODAL (for info page short stories) ---
    (function() {
        const modal = document.querySelector('.video-modal');
        if (!modal) return;
        
        const video = modal.querySelector('video');
        const closeBtn = modal.querySelector('.ui-control--close, .video-modal-close');
        const muteBtn = modal.querySelector('.ui-control--mute, .video-modal-mute');
        const prevBtn = modal.querySelector('.ui-control--prev, .video-modal-prev');
        const nextBtn = modal.querySelector('.ui-control--next, .video-modal-next');
        
        // Карточки с data-video (секция "Короткие истории")
        const videoCards = Array.from(document.querySelectorAll('.video-card[data-video]'));
        let currentIndex = 0;
        
        function openModal(index) {
            currentIndex = index;
            const trigger = videoCards[index];
            if (trigger && video) {
                video.src = trigger.dataset.video;
                video.muted = false;
                modal.classList.add('active');
                document.body.classList.add('video-modal-open');
                video.play();
            }
        }
        
        function closeModal() {
            modal.classList.remove('active');
            document.body.classList.remove('video-modal-open');
            if (video) { video.pause(); video.src = ''; }
        }
        
        videoCards.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(index);
            });
        });
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (muteBtn) muteBtn.addEventListener('click', () => { 
            if (video) {
                video.muted = !video.muted;
                muteBtn.querySelector('.mute-icon')?.classList.toggle('hidden', !video.muted);
                muteBtn.querySelector('.unmute-icon')?.classList.toggle('hidden', video.muted);
            }
        });
        if (prevBtn) prevBtn.addEventListener('click', () => { if (currentIndex > 0) openModal(currentIndex - 1); });
        if (nextBtn) nextBtn.addEventListener('click', () => { if (currentIndex < videoCards.length - 1) openModal(currentIndex + 1); });
        
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
    })();

    // --- 4. Mobile menu swipe-to-close ---
    (function() {
        const dialog = document.getElementById('mobile-menu');
        if (!(dialog instanceof HTMLDialogElement)) return;

        const panel = dialog.querySelector('[data-swipe-panel]');
        if (!panel) return;

        let startX = 0;
        let startY = 0;
        let isTracking = false;

        panel.addEventListener('touchstart', function (e) {
            const touch = e.touches && e.touches[0];
            if (!touch) return;
            startX = touch.clientX;
            startY = touch.clientY;
            isTracking = true;
        }, { passive: true });

        panel.addEventListener('touchmove', function (e) {
            if (!isTracking) return;
            const touch = e.touches && e.touches[0];
            if (!touch) return;

            const dx = touch.clientX - startX;
            const dy = Math.abs(touch.clientY - startY);

            if (dx > 60 && dy < 40) {
                isTracking = false;
                try {
                    dialog.close();
                } catch (err) {
                    // ignore
                }
            }
        }, { passive: true });

        panel.addEventListener('touchend', function () {
            isTracking = false;
        }, { passive: true });
    })();

    // --- 5. City dialog ---
    (function () {
        const dialog = document.getElementById('city-dialog');
        if (!(dialog instanceof HTMLDialogElement)) return;

        const searchInput = document.getElementById('city-search');
        const gridRoot = document.getElementById('city-grid');
        // Options exist in multiple columns; listen on the whole dialog (or the grid if present).
        const optionsRoot = gridRoot || dialog;
        const noResults = document.getElementById('city-no-results');
        const resetBtn = dialog.querySelector('[data-city-reset]');

        const triggers = Array.from(document.querySelectorAll('[data-city-trigger]'));
        const currentLabels = Array.from(document.querySelectorAll('[data-city-current]'));
        const phoneLinks = Array.from(document.querySelectorAll('[data-city-phone]'));
        const phoneTextNodes = Array.from(document.querySelectorAll('[data-city-phone-text]'));

        const phoneMap = {
            moscow: {
                display: '+7 495 409-18-69',
                tel: '+74954091869'
            },
            spb: {
                display: '+7 812 408-18-69',
                tel: '+78124081869'
            },
            default: {
                display: '8 800 707-69-21',
                tel: '88007076921'
            }
        };

        function normalizeCityName(value) {
            const safe = (value || '').toLowerCase().replace(/ё/g, 'е');
            return safe.replace(/[^a-zа-я0-9]+/gi, ' ').trim();
        }

        function resolvePhoneForCity(name) {
            const normalized = normalizeCityName(name);
            if (normalized.startsWith('москва')) return phoneMap.moscow;
            if (normalized.startsWith('санкт петербург') || normalized === 'спб') return phoneMap.spb;
            return phoneMap.default;
        }

        function setCityPhones(name) {
            const phone = resolvePhoneForCity(name);
            phoneLinks.forEach((link) => {
                if (!(link instanceof HTMLElement)) return;
                if (link.tagName === 'A') link.setAttribute('href', `tel:${phone.tel}`);
                link.textContent = link.querySelector('[data-city-phone-text]') ? link.textContent : phone.display;
            });

            phoneTextNodes.forEach((node) => {
                node.textContent = phone.display;
            });
        }

        function closeDialogSafely() {
            try {
                dialog.close();
                return;
            } catch (e) {
                // ignore
            }

            // Fallback for environments where <dialog> behaves like a normal element.
            try {
                dialog.removeAttribute('open');
            } catch (e2) {
                // ignore
            }
            try {
                dialog.open = false;
            } catch (e3) {
                // ignore
            }
        }

        function ensureModalOverlay() {
            // Tailwind Plus Elements uses commandfor/command, but some environments can end up with a non-modal open dialog.
            // We enforce true modal so it doesn't render in-flow (e.g., "below footer").
            try {
                if (!dialog.open) {
                    dialog.showModal();
                    return;
                }
                if (typeof dialog.matches === 'function' && !dialog.matches(':modal')) {
                    closeDialogSafely();
                    dialog.showModal();
                }
            } catch (e) {
                // ignore
            }
        }

        function getAllOptions() {
            return optionsRoot ? Array.from(optionsRoot.querySelectorAll('[data-city-option]')) : [];
        }

        function hideItem(el, isHidden) {
            const li = el.closest('li');
            if (li) {
                li.classList.toggle('hidden', isHidden);
                return;
            }

            el.classList.toggle('hidden', isHidden);
        }

        function setCurrentCity(name) {
            const safeName = (name || '').trim();
            if (!safeName) return;

            currentLabels.forEach((el) => {
                el.textContent = safeName;
            });

            setCityPhones(safeName);

            try {
                localStorage.setItem('muse_city', safeName);
            } catch (e) {
                // ignore
            }
        }

        function getStoredCity() {
            try {
                return (localStorage.getItem('muse_city') || '').trim();
            } catch (e) {
                return '';
            }
        }

        function resetSearch() {
            if (searchInput) searchInput.value = '';

            const items = getAllOptions();
            items.forEach((el) => {
                hideItem(el, false);
            });

            dialog.querySelectorAll('[data-city-group]').forEach((group) => {
                group.classList.remove('hidden');
            });

            if (gridRoot) gridRoot.classList.remove('hidden');

            if (noResults) noResults.classList.add('hidden');
        }

        function applyFilter(query) {
            const q = (query || '').toLowerCase().trim();
            const items = getAllOptions();

            let visibleCount = 0;

            items.forEach((el) => {
                const name = (el.getAttribute('data-city-option') || el.textContent || '').toLowerCase();
                const match = !q || name.includes(q);
                hideItem(el, !match);
                if (match) visibleCount += 1;
            });

            dialog.querySelectorAll('[data-city-group]').forEach((group) => {
                const groupItems = Array.from(group.querySelectorAll('[data-city-option]'));
                const groupVisible = groupItems.some((el) => {
                    const li = el.closest('li');
                    if (li) return !li.classList.contains('hidden');
                    return !el.classList.contains('hidden');
                });
                group.classList.toggle('hidden', !groupVisible);
            });

            if (noResults) {
                noResults.classList.toggle('hidden', visibleCount !== 0);
            }

            if (gridRoot) {
                gridRoot.classList.toggle('hidden', visibleCount === 0);
            }
        }

        // Init current city
        const stored = getStoredCity();
        const initial = stored || (currentLabels[0] ? currentLabels[0].textContent.trim() : '');
        if (initial) setCurrentCity(initial);

        // Click: choose city
        if (optionsRoot) {
            optionsRoot.addEventListener('click', function (e) {
                const target = e.target instanceof Element ? e.target.closest('[data-city-option]') : null;
                if (!target) return;

                e.preventDefault();
                e.stopPropagation();
                const name = (target.getAttribute('data-city-option') || target.textContent || '').trim();
                if (!name) return;

                setCurrentCity(name);

                // Close on next tick to avoid click-through reopening.
                window.setTimeout(function () {
                    closeDialogSafely();
                }, 0);
            });
        }

        // Search
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                applyFilter(searchInput.value);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function (e) {
                e.preventDefault();
                resetSearch();
                if (searchInput) {
                    try {
                        searchInput.focus();
                    } catch (e2) {
                        // ignore
                    }
                }
            });
        }

        // Focus search after opening
        triggers.forEach((btn) => {
            btn.addEventListener('click', function () {
                window.setTimeout(function () {
                    ensureModalOverlay();
                    if (!dialog.open) return;
                    if (searchInput) {
                        try {
                            searchInput.focus();
                        } catch (e) {
                            // ignore
                        }
                    }
                }, 0);
            });
        });

        // Reset on close
        dialog.addEventListener('close', function () {
            resetSearch();
        });

        dialog.addEventListener('cancel', function () {
            resetSearch();
        });
    })();

});


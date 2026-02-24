/**
 * Muse Navigation & UI Scripts
 * - Page Navigator (боковая навигация)
 * - Back to Top (кнопка "Наверх")
 * - Carousel (Карусель: драг, колесико, кнопки)
 * - Native Dialog Controls (замена tailwindplus-elements.js)
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

// Helper: добавить keyboard accessibility для button-like элементов
function makeKeyboardAccessible(el, label) {
    if (el.tagName !== 'BUTTON') {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
    }
    if (label && !el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', label);
    }
    el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
}

// Helper: настройка ARIA-атрибутов для диалога
function setupDialogAria(dialog) {
    if (!dialog.hasAttribute('role')) dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('aria-labelledby')) {
        var heading = dialog.querySelector('h1,h2,h3,h4,h5,h6');
        if (heading) {
            if (!heading.id) heading.id = 'dialog-title-' + Math.random().toString(36).slice(2, 9);
            dialog.setAttribute('aria-labelledby', heading.id);
        }
    }
}

// Кэш для breakpoint (обновляется при resize)
var isDesktop = false;

document.addEventListener('DOMContentLoaded', function() {
    isDesktop = window.innerWidth >= 1024;
    // --- Native Dialog Controls (replaces tailwindplus-elements.js) ---
    document.querySelectorAll('[data-open-dialog]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var dialog = document.getElementById(btn.dataset.openDialog);
            if (dialog && typeof dialog.showModal === 'function') {
                dialog.showModal();
            }
        });
    });
    document.querySelectorAll('[data-close-dialog]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var dialog = btn.closest('dialog');
            if (dialog && typeof dialog.close === 'function') {
                dialog.close();
            }
        });
    });

    // --- Native Tabs (replaces el-tab-group from tailwindplus) ---
    document.querySelectorAll('[data-tabs]').forEach(function(tabGroup, groupIndex) {
        var tabList = tabGroup.querySelector('[data-tab-list]');
        var tabPanels = tabGroup.querySelector('[data-tab-panels]');
        if (!tabList || !tabPanels) return;

        var buttons = Array.from(tabList.querySelectorAll('button'));
        var panels = Array.from(tabPanels.children);
        if (buttons.length === 0 || panels.length === 0) return;

        var groupId = tabGroup.dataset.tabsId || tabGroup.id || ('tabs-' + groupIndex);

        if (!tabList.getAttribute('role')) {
            tabList.setAttribute('role', 'tablist');
        }

        buttons.forEach(function(btn, index) {
            var panel = panels[index];
            if (!panel) return;

            if (!btn.getAttribute('role')) {
                btn.setAttribute('role', 'tab');
            }

            var tabId = btn.id || (groupId + '-tab-' + index);
            if (!btn.id) {
                btn.id = tabId;
            }

            var panelId = panel.id || (groupId + '-panel-' + index);
            if (!panel.id) {
                panel.id = panelId;
            }

            if (!btn.getAttribute('aria-controls')) {
                btn.setAttribute('aria-controls', panelId);
            }

            if (!panel.getAttribute('role')) {
                panel.setAttribute('role', 'tabpanel');
            }

            if (!panel.hasAttribute('tabindex')) {
                panel.setAttribute('tabindex', '0');
            }

            panel.setAttribute('aria-labelledby', tabId);
        });

        var selectedIndex = buttons.findIndex(function(btn) {
            return btn.getAttribute('aria-selected') === 'true';
        });
        if (selectedIndex === -1) selectedIndex = 0;

        function syncTabs(activeIndex) {
            buttons.forEach(function(btn, index) {
                var isActive = index === activeIndex;
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                btn.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            panels.forEach(function(panel, index) {
                panel.hidden = index !== activeIndex;
            });
        }

        syncTabs(selectedIndex);

        buttons.forEach(function(btn, index) {
            btn.addEventListener('click', function() {
                syncTabs(index);
            });
        });
    });
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
    let navLinkById = {};
    let cacheValid = false;

    function cacheNavLinks() {
        navLinkById = {};
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.charAt(0) === '#') {
                navLinkById[href.slice(1)] = link;
            }
        });
    }

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
        cacheNavLinks();
        cacheValid = true;
    }

    // Подсветка активной секции при скролле (без forced reflow)
    function updateActiveLink() {
        if (!cacheValid) cacheSectionPositions();
        
        const scrollPos = window.scrollY + 200;

        for (let i = 0; i < sectionCache.length; i++) {
            const section = sectionCache[i];
            const navLink = navLinkById[section.id];

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

    // Закрытие виджета мессенджеров при скролле (мост к IIFE секции 6)
    function closeMessengerList() {
        if (typeof window._messengerCloseList === 'function') {
            window._messengerCloseList();
        }
    }

    function toggleUI() {
        toggleBackToTop();
        togglePageNavigator();
        updateActiveLink();
        closeMessengerList();
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

    // Debounce для resize (сброс кэша + обновление UI + breakpoint)
    var resizeTimeout;
    function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            isDesktop = window.innerWidth >= 1024; // Обновляем кэш breakpoint
            cacheValid = false; // Сброс кэша позиций
            cacheSectionPositions();
            toggleUI();
        }, 150);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    
    // Пересчёт кэша после полной загрузки (изображения, шрифты)
    window.addEventListener('load', function() {
        cacheValid = false;
        cacheSectionPositions();
        toggleUI();
    });
    
    // ResizeObserver для секций (раскрывающиеся блоки, ленивая загрузка)
    if (typeof ResizeObserver !== 'undefined') {
        var sectionResizeObserver = new ResizeObserver(function() {
            cacheValid = false;
        });
        document.querySelectorAll('section[id]').forEach(function(section) {
            sectionResizeObserver.observe(section);
        });
    }
    
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
        // Проверка поддержки HTMLDialogElement
        if (typeof HTMLDialogElement === 'undefined') return;
        
        var origShow = HTMLDialogElement.prototype.showModal;
        var origClose = HTMLDialogElement.prototype.close;

        HTMLDialogElement.prototype.showModal = function(){
            var dialog = this;
            var opener = document.activeElement;
            dialog.__muse_opener = opener;

            // Используем общий helper для ARIA
            setupDialogAria(dialog);

            // Focusable elements inside dialog
            var focusableSelector = 'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
            dialog.__focusables = Array.from(dialog.querySelectorAll(focusableSelector));
            dialog.__firstFocusable = dialog.__focusables[0] || dialog;
            dialog.__lastFocusable = dialog.__focusables[dialog.__focusables.length - 1] || dialog;
            dialog.__previouslyFocused = document.activeElement;

            origShow.call(dialog);
            try { dialog.__firstFocusable.focus(); } catch (e) {}

            // Keydown handler: Escape + focus trap
            dialog.__keydownHandler = function(e) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    try { dialog.close(); } catch (err) {}
                }
                if (e.key === 'Tab') {
                    var active = document.activeElement;
                    if (e.shiftKey) {
                        if (active === dialog.__firstFocusable || active === dialog) {
                            e.preventDefault();
                            dialog.__lastFocusable.focus();
                        }
                    } else {
                        if (active === dialog.__lastFocusable || active === dialog) {
                            e.preventDefault();
                            dialog.__firstFocusable.focus();
                        }
                    }
                }
            };
            document.addEventListener('keydown', dialog.__keydownHandler);

            // Set aria-expanded on opener
            try {
                if (opener && opener.setAttribute) {
                    if (dialog.id) opener.setAttribute('aria-controls', dialog.id);
                    opener.setAttribute('aria-expanded', 'true');
                }
            } catch (e) {}
        };

        HTMLDialogElement.prototype.close = function(){
            try { if (this.__keydownHandler) document.removeEventListener('keydown', this.__keydownHandler); } catch (e) {}
            try { if (this.__previouslyFocused) this.__previouslyFocused.focus(); } catch (e) {}
            try { if (this.__muse_opener && this.__muse_opener.setAttribute) this.__muse_opener.setAttribute('aria-expanded', 'false'); } catch (e) {}
            origClose.call(this);
        };

        // Инициализация существующих диалогов (используем общий helper)
        document.querySelectorAll('dialog').forEach(function(d) {
            setupDialogAria(d);
            // Accessible close buttons
            d.querySelectorAll('[onclick*=".close("], button[onclick*=".close("]').forEach(function(btn) {
                if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Закрыть окно');
            });
        });

        // Video play controls — используем helper
        document.querySelectorAll('.ui-control--play, .video-play-icon, [data-play-btn]').forEach(function(el) {
            makeKeyboardAccessible(el, 'Воспроизвести видео');

            var cover = el.closest('[data-video-cover], .video-cover');
            if (cover) {
                var video = cover.querySelector('video');
                var iframe = cover.querySelector('iframe');
                if (video && video.id) el.setAttribute('aria-controls', video.id);
                if (iframe) {
                    if (!iframe.id) iframe.id = 'iframe-' + Math.random().toString(36).slice(2, 9);
                    el.setAttribute('aria-controls', iframe.id);
                    if (!iframe.hasAttribute('title')) iframe.setAttribute('title', 'Видео');
                }
            }
        });

        // MutationObserver для video-cover
        var mc = new MutationObserver(function(records) {
            records.forEach(function(r) {
                if (r.type === 'attributes' && r.attributeName === 'class') {
                    var el = r.target;
                    var btn = el.querySelector('.ui-control--play, .video-play-icon, [data-play-btn]');
                    if (btn) {
                        btn.setAttribute('aria-expanded', el.classList.contains('video-playing') ? 'true' : 'false');
                    }
                }
            });
        });
        document.querySelectorAll('[data-video-cover], .video-cover').forEach(function(c) {
            mc.observe(c, { attributes: true });
        });
    })();

    // Carousel Scroll (drag + wheel + защита от случайного клика)
    document.querySelectorAll('.carousel-scroll').forEach(function(carousel) {
        // Прокрутка колесиком мыши (используем кэшированный breakpoint)
        carousel.addEventListener('wheel', function(e) {
            if (!isDesktop) return;
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                e.preventDefault();
                carousel.scrollBy({ left: e.deltaY * 0.6, behavior: 'auto' });
            }
        }, { passive: false });
        
        // Drag-to-scroll с защитой от случайного клика
        var isDown = false, startX, startScrollLeft, clickBlocked = false;
        var DRAG_THRESHOLD = 5;
        carousel.style.cursor = 'grab';
        
        carousel.addEventListener('mousedown', function(e) {
            if (!isDesktop) return;
            isDown = true;
            clickBlocked = false;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX;
            startScrollLeft = carousel.scrollLeft;
            e.preventDefault();
        });
        
        carousel.addEventListener('mousemove', function(e) {
            if (!isDown || !isDesktop) return;
            e.preventDefault();
            var moveDistance = Math.abs(e.pageX - startX);
            if (moveDistance > DRAG_THRESHOLD) {
                clickBlocked = true;
            }
            carousel.scrollLeft = startScrollLeft - (e.pageX - startX) * 1.2;
        });
        
        // Блокировка клика после перетаскивания
        carousel.addEventListener('click', function(e) {
            if (clickBlocked && isDesktop) {
                e.preventDefault();
                e.stopPropagation();
                clickBlocked = false;
            }
        }, true);
        
        carousel.addEventListener('mouseup', function() {
            isDown = false;
            carousel.style.cursor = 'grab';
            if (clickBlocked) {
                setTimeout(function() { clickBlocked = false; }, 100);
            }
        });
        
        carousel.addEventListener('mouseleave', function() {
            if (isDown) {
                isDown = false;
                clickBlocked = false;
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
                video.play().catch(function() {});
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
        if (!dialog || dialog.tagName !== 'DIALOG') return;

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
        if (!dialog || dialog.tagName !== 'DIALOG') return;

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

    // --- 6. MESSENGER WIDGET ---
    (function () {
        var widget = document.getElementById('messengerWidget');
        if (!widget) return;

        var toggle = document.getElementById('messengerToggle');
        var list   = document.getElementById('messengerList');
        var icon   = document.getElementById('toggleIcon');
        if (!toggle || !list || !icon) return;

        // Отложенное появление (10 секунд после загрузки)
        setTimeout(function () {
            widget.classList.remove('hidden');
        }, 10000);

        function openList() {
            list.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            icon.classList.add('rotate-45');
        }

        function closeList() {
            list.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            icon.classList.remove('rotate-45');
        }

        // Экспорт для toggleUI() (автозакрытие при скролле)
        window._messengerCloseList = closeList;

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = toggle.getAttribute('aria-expanded') === 'true';
            isOpen ? closeList() : openList();
        });

        // Закрытие при клике вне виджета
        document.addEventListener('click', function (e) {
            if (!widget.contains(e.target)) closeList();
        });
    })();

    // --- 7. COOKIE BANNER ---
    (function () {
        var banner = document.getElementById('cookieBanner');
        var acceptBtn = document.getElementById('cookieAccept');
        if (!banner || !acceptBtn) return;

        // Не показывать, если уже принято
        try {
            if (localStorage.getItem('muse_cookie_accepted')) return;
        } catch (e) { /* ignore */ }

        // Показать через 1 секунду
        setTimeout(function () {
            banner.classList.add('is-visible');
        }, 1000);

        acceptBtn.addEventListener('click', function () {
            banner.classList.remove('is-visible');
            try {
                localStorage.setItem('muse_cookie_accepted', '1');
            } catch (e) { /* ignore */ }
        });
    })();

    // --- 8. CITY CONFIRMATION BANNER ---
    (function () {
        var banner = document.getElementById('cityBanner');
        var confirmBtn = document.getElementById('cityConfirm');
        var changeBtn = document.getElementById('cityChange');
        var cityDialog = document.getElementById('city-dialog');
        if (!banner) return;

        // Не показывать, если город уже подтверждён
        try {
            if (localStorage.getItem('muse_city_confirmed')) return;
        } catch (e) { /* ignore */ }

        function hideBanner(persist) {
            banner.classList.remove('is-visible');
            if (persist) {
                try {
                    localStorage.setItem('muse_city_confirmed', '1');
                } catch (e) { /* ignore */ }
            }
        }

        // Показать через 2 секунды (после cookie-баннера)
        setTimeout(function () {
            banner.classList.add('is-visible');
        }, 2000);

        // Автоскрытие через 20 секунд после появления (без записи в localStorage)
        var hideTimer = setTimeout(function () {
            hideBanner(false);
        }, 22000);

        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                clearTimeout(hideTimer);
                hideBanner(true);
            });
        }

        if (changeBtn && cityDialog) {
            changeBtn.addEventListener('click', function () {
                clearTimeout(hideTimer);
                hideBanner(true);
                try {
                    cityDialog.showModal();
                } catch (e) { /* ignore */ }
            });
        }
    })();

    // --- 9. CALLBACK FORM + SWIPE-TO-CLOSE ---
    (function () {
        var dialog = document.getElementById('callback-dialog');
        var form = document.getElementById('callback-form');
        var success = document.getElementById('callback-success');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var phone = form.querySelector('[name="user_tele"]');
            if (phone && phone.value.replace(/\D/g, '').length < 11) {
                phone.classList.add('error');
                phone.focus();
                return;
            }
            if (phone) phone.classList.remove('error');

            // Заглушка: показать успех (заменить на fetch при интеграции)
            form.classList.add('hidden');
            if (success) success.classList.remove('hidden');

            // Автозакрытие через 3 секунды
            setTimeout(function () {
                if (dialog && typeof dialog.close === 'function') dialog.close();
                // Сброс формы для повторного открытия
                form.reset();
                form.classList.remove('hidden');
                if (success) success.classList.add('hidden');
            }, 3000);
        });

        // --- Swipe-down-to-close (mobile bottom sheet) ---
        var panel = dialog ? dialog.querySelector('[data-swipe-panel]') : null;
        if (panel && 'ontouchstart' in window) {
            var startY = 0, currentY = 0, dragging = false;

            panel.addEventListener('touchstart', function (e) {
                var tag = e.target.tagName;
                if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'TEXTAREA') return;
                startY = e.touches[0].clientY;
                currentY = startY;
                dragging = true;
                panel.style.transition = 'none';
            }, { passive: true });

            panel.addEventListener('touchmove', function (e) {
                if (!dragging) return;
                currentY = e.touches[0].clientY;
                var dy = currentY - startY;
                if (dy > 0) {
                    panel.style.transform = 'translateY(' + dy + 'px)';
                }
            }, { passive: true });

            panel.addEventListener('touchend', function () {
                if (!dragging) return;
                dragging = false;
                var dy = currentY - startY;
                panel.style.transition = '';
                if (dy > 100) {
                    panel.style.transform = 'translateY(100%)';
                    setTimeout(function () {
                        dialog.close();
                        panel.style.transform = '';
                    }, 300);
                } else {
                    panel.style.transform = '';
                }
            });
        }
    })();

});


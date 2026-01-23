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
    
    // --- 1. АРХИТЕКТУРНАЯ НАВИГАЦИЯ (ARCH-NAV) ---
    const navItems = document.querySelectorAll('.arch-nav__item');
    const backToTop = document.getElementById('back-to-top');
    
    // Плавный скролл при клике
    document.querySelectorAll('.arch-nav__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const top = targetSection.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: top - 20, // Небольшой отступ сверху
                    behavior: 'smooth'
                });
            }
        });
    });

    // Наблюдатель (Scroll Spy)
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Снимаем активный класс со всех пунктов
                navItems.forEach(nav => nav.setAttribute('data-active', 'false'));
                
                // Ищем пункт меню, который связан с этой секцией
                const targetId = entry.target.id;
                const activeNav = document.querySelector(`.arch-nav__item[data-target="${targetId}"]`);
                
                if (activeNav) {
                    activeNav.setAttribute('data-active', 'true');
                }
            }
        });
    }, observerOptions);

    // Запускаем слежение за секциями
    navItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        const section = document.getElementById(targetId);
        if (section) {
            observer.observe(section);
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function toggleUI() {
        if (backToTop) {
            const show = window.scrollY > 300 && window.innerWidth >= 768;
            backToTop.classList.toggle('opacity-0', !show);
            backToTop.classList.toggle('pointer-events-none', !show);
            backToTop.classList.toggle('opacity-100', show);
        }
    }
    
    window.addEventListener('scroll', toggleUI);
    window.addEventListener('resize', toggleUI);
    toggleUI();

    // Video Cover (supports <video> and iframe embeds)
    document.querySelectorAll('[data-video-cover], .video-cover').forEach(function(cover) {
        const playBtn = cover.querySelector('[data-play-btn], .video-play-icon');
        const closeBtn = cover.querySelector('[data-video-close], .video-close, .video-cover__close, .js-video-close');
        function startMedia() {
            cover.classList.add('video-playing');
            const video = cover.querySelector('video');
            if (video) {
                video.classList.remove('hidden');
                try { video.setAttribute('playsinline', ''); } catch(e){}
                video.play().catch(()=>{});
            }
            const iframe = cover.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
                const sep = iframe.dataset.src.indexOf('?') === -1 ? '?' : '&';
                iframe.src = iframe.dataset.src + sep + 'autoplay=1&mute=1&playsinline=1';
                iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
            }
        }
        function stopMedia() {
            cover.classList.remove('video-playing');
            const video = cover.querySelector('video');
            if (video) {
                try { video.pause(); video.currentTime = 0; } catch(e){}
                video.classList.add('hidden');
            }
            const iframe = cover.querySelector('iframe');
            if (iframe) {
                iframe.removeAttribute('src');
                iframe.removeAttribute('allow');
            }
        }
        if (playBtn) playBtn.addEventListener('click', startMedia);
        if (closeBtn) closeBtn.addEventListener('click', stopMedia);
        // If cover itself is used as an overlay, clicking the backdrop stops playback
        cover.addEventListener('click', function(e){ if (e.target === cover) stopMedia(); });
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
        document.querySelectorAll('.video-play-icon, [data-play-btn]').forEach(function(el){
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
            records.forEach(function(r){ if (r.type === 'attributes' && r.attributeName === 'class'){ const el = r.target; const btn = el.querySelector('.video-play-icon, [data-play-btn]'); if (btn){ if (el.classList.contains('video-playing')) btn.setAttribute('aria-expanded','true'); else btn.setAttribute('aria-expanded','false'); } } });
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
            prev.className = 'js-carousel-prev hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-gray-400/50 hover:bg-dark text-white items-center justify-center transition-colors duration-200 rounded-r shadow-sm cursor-pointer';
            prev.setAttribute('aria-label', 'Назад');
            prev.setAttribute('aria-controls', wrapper.id);
            prev.innerHTML = '<svg class="w-6 h-6 fill-current carousel-arrow transform" viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z"></path></svg>'; 

            const next = document.createElement('button');
            next.className = 'js-carousel-next hidden lg:flex absolute right-0 left-auto top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-gray-400/50 hover:bg-dark text-white items-center justify-center transition-colors duration-200 rounded-l shadow-sm cursor-pointer';
            next.setAttribute('aria-label', 'Вперед');
            next.setAttribute('aria-controls', wrapper.id);
            next.innerHTML = '<svg class="w-6 h-6 fill-current carousel-arrow transform rotate-180" viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z"></path></svg>'; 

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

});


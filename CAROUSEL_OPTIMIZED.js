// ОПТИМИЗИРОВАННАЯ ВЕРСИЯ КАРУСЕЛИ - минимизация forced reflows
// Использует нативные методы браузера (scrollBy) вместо прямого изменения scrollLeft

(function() {
    const carousels = document.querySelectorAll('.carousel-scroll');
    
    carousels.forEach(carousel => {
        let isWheeling = false;
        let wheelTimeout = null;
        
        // Используем IntersectionObserver для определения, когда карусель в viewport
        // Это позволяет не обрабатывать события, когда карусель не видна
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                carousel.dataset.visible = entry.isIntersecting ? 'true' : 'false';
            });
        }, { threshold: 0.1 });
        
        if (carousel) {
            observer.observe(carousel);
        }

        // Wheel обработчик - используем scrollBy (нативный метод браузера)
        // scrollBy оптимизирован браузером и вызывает меньше reflows чем scrollLeft
        carousel.addEventListener('wheel', (e) => {
            // Только на десктопе и только если карусель видна
            if (window.innerWidth < 1024 || carousel.dataset.visible !== 'true') return;
            
            // Проверяем, что мышь над каруселью (один вызов getBoundingClientRect на событие)
            const rect = carousel.getBoundingClientRect();
            const isOverCarousel = e.clientX >= rect.left && e.clientX <= rect.right &&
                                 e.clientY >= rect.top && e.clientY <= rect.bottom;
            
            if (isOverCarousel && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                e.preventDefault();
                isWheeling = true;
                
                // scrollBy - нативный метод, браузер оптимизирует reflows
                carousel.scrollBy({
                    left: e.deltaY * 0.6,
                    behavior: 'auto' // 'auto' для мгновенного скролла, плавность через CSS scroll-behavior
                });
                
                // Сбрасываем таймаут
                if (wheelTimeout) clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(() => {
                    isWheeling = false;
                }, 150);
            }
        }, { passive: false });

        // Упрощенный drag-to-scroll - минимум геометрических чтений
        let isDown = false;
        let startX = 0;
        let startScrollLeft = 0;
        
        carousel.addEventListener('mousedown', (e) => {
            if (window.innerWidth < 1024) return;
            
            isDown = true;
            carousel.style.cursor = 'grabbing';
            
            // Кэшируем значения один раз при mousedown
            // pageX - абсолютная координата, не требует геометрических чтений
            startX = e.pageX;
            startScrollLeft = carousel.scrollLeft; // Одно чтение scrollLeft при начале drag
            
            e.preventDefault();
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown || window.innerWidth < 1024) return;
            
            e.preventDefault();
            
            // Используем только pageX (абсолютная координата) - нет геометрических чтений
            const walk = (e.pageX - startX) * 1.2;
            const newScroll = startScrollLeft - walk;
            
            // Записываем напрямую - mousemove уже user-triggered событие
            carousel.scrollLeft = newScroll;
        });

        carousel.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                carousel.style.cursor = '';
                carousel.style.cursor = 'grab';
            }
        });

        carousel.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                carousel.style.cursor = '';
                carousel.style.cursor = 'grab';
            }
        });
        
        // Устанавливаем cursor: grab по умолчанию
        carousel.style.cursor = 'grab';
    });
})();





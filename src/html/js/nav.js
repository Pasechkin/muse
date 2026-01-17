/**
 * Muse Navigation Scripts
 * - Page Navigator (боковая навигация с подсветкой активной секции)
 * - Back to Top (кнопка "Наверх")
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // PAGE NAVIGATOR
    // ============================================
    
    const pageNavigator = document.getElementById('page-navigator');
    const navLinks = document.querySelectorAll('.page-navigator .inner-link');
    
    // Плавная прокрутка при клике на ссылку
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
    
    // Подсветка активной секции при скролле
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.page-navigator a[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    navLinks.forEach(l => l.classList.remove('inner-link--active'));
                    navLink.classList.add('inner-link--active');
                }
            }
        });
    }
    
    // ============================================
    // BACK TO TOP
    // ============================================
    
    const backToTop = document.getElementById('back-to-top');
    
    // Показать/скрыть кнопку "Наверх"
    function toggleBackToTop() {
        if (backToTop) {
            const show = window.scrollY > 300 && window.innerWidth >= 768;
            backToTop.classList.toggle('opacity-0', !show);
            backToTop.classList.toggle('pointer-events-none', !show);
            backToTop.classList.toggle('opacity-100', show);
        }
    }
    
    // Прокрутка наверх при клике
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    window.addEventListener('scroll', function() {
        toggleBackToTop();
        updateActiveLink();
    });
    
    window.addEventListener('resize', function() {
        togglePageNavigator();
        toggleBackToTop();
    });
    
    // Инициализация
    toggleBackToTop();
    togglePageNavigator();
    updateActiveLink();
});

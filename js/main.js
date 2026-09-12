// 主要JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态管理
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        if ((currentPath === '/' && linkPath === 'index.html') ||
            currentPath.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });

    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 页面滚动时的导航栏效果
    let lastScrollTop = 0;
    const navigation = document.querySelector('.navigation');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (navigation) {
            if (scrollTop > 10) {
                navigation.style.boxShadow = 'var(--shadow-md)';
            } else {
                navigation.style.boxShadow = 'var(--shadow-sm)';
            }
        }

        lastScrollTop = scrollTop;
    });

    // 表单提交处理
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的消息！我们会尽快回复您。');
            form.reset();
        });
    });

    // 延迟加载图片
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }

    // 添加页面加载动画
    const animatedElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            animationObserver.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
});


/* ============================================================
   ↓↓↓ 以下是新增：移动端汉堡菜单（自动注入） ↓↓↓
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    const nav = document.querySelector('.navigation');
    if (!nav) return;

    const navMenu = nav.querySelector('.nav-menu');
    if (!navMenu) return;

    // ---------- 1. 动态插入汉堡按钮 ----------
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.setAttribute('aria-label', '打开菜单');
    toggleBtn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggleBtn);

    // ---------- 2. 动态插入遮罩层 ----------
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // ---------- 3. 开关逻辑 ----------
    function openMenu() {
        navMenu.classList.add('active');
        toggleBtn.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 点击汉堡按钮
    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // 点击遮罩关闭
    backdrop.addEventListener('click', closeMenu);

    // 点击菜单里任意链接后自动关闭
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // 从手机切到桌面时自动关闭
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1023) {
            closeMenu();
        }
    });

    // 按 ESC 关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});
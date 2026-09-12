// ============================================================
// 画廊筛选功能（支持任意年份 + 分类筛选）
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    let activeFilter = 'all';

    // 判断是否为一个“年份”筛选（4 位数字，如 2022、2025）
    function isYearFilter(value) {
        return /^\d{4}$/.test(value);
    }

    function initGallery() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                setActiveFilter(filter);
                filterGallery(filter);
            });
        });
        filterGallery('all');
    }

    function setActiveFilter(filter) {
        activeFilter = filter;
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });
    }

    function filterGallery(filter) {
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const year = item.getAttribute('data-year');

            let showItem = false;

            if (filter === 'all') {
                showItem = true;
            } else if (isYearFilter(filter)) {
                // 按年份筛选：匹配 data-year
                showItem = year === filter;
            } else {
                // 按分类筛选：匹配 data-category
                showItem = category === filter;
            }

            if (showItem) {
                item.style.display = '';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (item.style.opacity === '0') {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });

        rearrangeGallery();
    }

    function rearrangeGallery() {
        const visibleItems = Array.from(galleryItems).filter(item => {
            return item.style.display !== 'none';
        });
        visibleItems.forEach((item, index) => {
            item.style.order = index;
        });
    }

    initGallery();
});
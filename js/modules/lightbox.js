// ============================================================
// 灯箱功能（匹配 .lightbox / .lightbox-content / .lightbox-image 结构）
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-caption h3');
    const lightboxDesc = lightbox.querySelector('.lightbox-caption p');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // 收集当前页所有画廊图片
    const images = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIndex = 0;

    // 打开灯箱
    function openLightbox(index) {
        currentIndex = index;
        const img = images[currentIndex];
        if (!img) return;

        // 设置大图
        if (lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
        }

        // 设置标题和描述
        const item = img.closest('.gallery-item');
        const titleEl = item ? item.querySelector('.gallery-item-info h3') : null;
        const descEl = item ? item.querySelector('.gallery-item-info p') : null;

        if (lightboxTitle) lightboxTitle.textContent = titleEl ? titleEl.textContent : '';
        if (lightboxDesc) lightboxDesc.textContent = descEl ? descEl.textContent : '';

        // 显示灯箱
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 上一张
    function showPrev() {
        if (!images.length) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox(currentIndex);
    }

    // 下一张
    function showNext() {
        if (!images.length) return;
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox(currentIndex);
    }

    // 给每张图片绑定点击事件
    images.forEach(function (img, idx) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
            openLightbox(idx);
        });
    });

    // 按钮事件
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // 点击遮罩层关闭（点击 .lightbox 背景但不在 .lightbox-content 内）
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 键盘支持：ESC 关闭，← → 切换
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
});

// ============================================================
// 双击视频全屏播放
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('video');

    videos.forEach(function (video) {
        // 鼠标悬停时提示可双击
        video.style.cursor = 'pointer';
        video.title = '双击全屏播放';

        video.addEventListener('dblclick', function (e) {
            e.preventDefault();

            // 如果当前没有全屏元素 → 进入全屏
            if (!document.fullscreenElement) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();     // Safari
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();         // 老版 Edge/IE
                }
            } else {
                // 已经在全屏 → 退出
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });
    });
});
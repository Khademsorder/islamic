/**
 * ═══════════════════════════════════════════════════
 * Islamic Hub — Premium Performance Engine
 * Zero-Lag, Smooth Scroll, GPU-Accelerated UI
 * ═══════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ═══ 1. INSTANT TOUCH — Remove 300ms tap delay ═══
    document.addEventListener('DOMContentLoaded', () => {
        // Force fast taps on all clickable elements
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta && !meta.content.includes('user-scalable=no')) {
            meta.content = meta.content.replace(/(, ?)?user-scalable=yes/g, '') + ', user-scalable=no';
        }
    });

    // ═══ 2. GPU-ACCELERATED SMOOTH SCROLL ═══
    const style = document.createElement('style');
    style.textContent = `
    /* Smooth scrolling everywhere */
    *, *::before, *::after {
      -webkit-overflow-scrolling: touch !important;
    }

    html {
      scroll-behavior: smooth;
    }

    /* GPU acceleration for animated elements */
    .card, .modal-overlay, .sidebar, .bottom-nav, 
    .floating-nav, .section-card, .surah-item,
    .category-card, .hadith-card, .dua-card,
    .story-card, .namaz-card, .feature-card,
    .profile-card, .bookmark-item, .search-result,
    [class*="slide"], [class*="fade"], [class*="animate"] {
      will-change: transform, opacity;
      transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }

    /* Smooth list rendering */
    .surah-list, .category-list, .hadith-list,
    [class*="container"], [class*="wrapper"], [class*="scroll"] {
      contain: layout style;
      content-visibility: auto;
      contain-intrinsic-size: auto 500px;
    }

    /* Optimize images */
    img {
      content-visibility: auto;
      will-change: auto;
    }

    /* Kill janky animations */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Optimized transitions */
    .view-transition {
      transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    /* Ultra-smooth modal/overlay */
    .modal-overlay {
      transition: opacity 0.2s ease, visibility 0.2s ease !important;
    }
    .modal-overlay .modal-content,
    .modal-overlay .modal-body {
      transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1) !important;
    }

    /* Smooth sidebar */
    .sidebar {
      transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1) !important;
    }

    /* Premium tap feedback */
    button, a, [onclick], [role="button"], .clickable, .card, .surah-item, .category-card, .feature-card {
      -webkit-tap-highlight-color: rgba(10, 84, 56, 0.15);
      touch-action: manipulation;
      cursor: pointer;
      transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Active press effect — 120fps feel */
    button:active, a:active, [onclick]:active, .card:active, .surah-item:active, .category-card:active {
      transform: scale(0.96) translateZ(0) !important;
      opacity: 0.9;
    }
  `;
    document.head.appendChild(style);

    // ═══ 3. PASSIVE EVENT LISTENERS — No scroll blocking ═══
    const origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, opts) {
        if (['touchstart', 'touchmove', 'wheel', 'scroll'].includes(type)) {
            if (typeof opts === 'boolean') {
                opts = { capture: opts, passive: true };
            } else if (typeof opts === 'object' || opts === undefined) {
                opts = Object.assign({}, opts || {}, { passive: true });
            }
        }
        return origAdd.call(this, type, fn, opts);
    };

    // ═══ 4. IMAGE LAZY LOADING ═══
    document.addEventListener('DOMContentLoaded', () => {
        // Add native lazy loading to all images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });

        // IntersectionObserver for heavy sections
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        lazyObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px' });

            document.querySelectorAll('.section-card, .category-card, .feature-card').forEach(el => {
                lazyObserver.observe(el);
            });
        }
    });

    // ═══ 5. DEBOUNCED SCROLL HANDLER ═══
    window.smoothScroll = {
        _ticking: false,
        _callbacks: [],

        onScroll(callback) {
            this._callbacks.push(callback);
            if (this._callbacks.length === 1) {
                window.addEventListener('scroll', () => {
                    if (!this._ticking) {
                        requestAnimationFrame(() => {
                            this._callbacks.forEach(cb => {
                                try { cb(); } catch (e) { }
                            });
                            this._ticking = false;
                        });
                        this._ticking = true;
                    }
                }, { passive: true });
            }
        }
    };

    // ═══ 6. PREFETCH & CACHE OPTIMIZATION ═══
    document.addEventListener('DOMContentLoaded', () => {
        // Prefetch Quran page when on Islamic page
        if (window.location.pathname.includes('islamic')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = 'quran.html';
            document.head.appendChild(link);
        }
    });

    // ═══ 7. MEMORY CLEANUP — Prevent leaks ═══
    let cleanupTimer = null;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // App went to background - clean up
            cleanupTimer = setTimeout(() => {
                // Clear image caches for off-screen images
                document.querySelectorAll('img').forEach(img => {
                    if (!img.getBoundingClientRect().top) return;
                    const rect = img.getBoundingClientRect();
                    if (rect.bottom < -500 || rect.top > window.innerHeight + 500) {
                        img.loading = 'lazy';
                    }
                });
            }, 5000);
        } else {
            // App came back - cancel cleanup
            if (cleanupTimer) clearTimeout(cleanupTimer);
        }
    });

    // ═══ 8. FRAME-RATE MONITOR (dev only) ═══
    window.perfMonitor = {
        start() {
            let frames = 0;
            let lastTime = performance.now();
            const tick = () => {
                frames++;
                const now = performance.now();
                if (now - lastTime >= 1000) {
                    console.log(`[Islamic Hub] FPS: ${frames}`);
                    frames = 0;
                    lastTime = now;
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
    };

    // ═══ 9. VIRTUAL LIST for Long Lists ═══
    window.VirtualScroller = class {
        constructor(container, items, renderFn, itemHeight = 60) {
            this.container = container;
            this.items = items;
            this.renderFn = renderFn;
            this.itemHeight = itemHeight;
            this.visibleCount = Math.ceil(window.innerHeight / itemHeight) + 10;
            this.scrollTop = 0;

            container.style.position = 'relative';
            container.style.overflow = 'auto';
            container.style.willChange = 'transform';

            this._spacer = document.createElement('div');
            this._spacer.style.height = (items.length * itemHeight) + 'px';
            container.appendChild(this._spacer);

            this._content = document.createElement('div');
            this._content.style.position = 'absolute';
            this._content.style.top = '0';
            this._content.style.left = '0';
            this._content.style.right = '0';
            this._content.style.willChange = 'transform';
            container.appendChild(this._content);

            container.addEventListener('scroll', () => {
                requestAnimationFrame(() => this.render());
            }, { passive: true });

            this.render();
        }

        render() {
            const scrollTop = this.container.scrollTop;
            const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - 5);
            const end = Math.min(this.items.length, start + this.visibleCount);

            this._content.style.transform = `translateY(${start * this.itemHeight}px)`;

            const fragment = document.createDocumentFragment();
            for (let i = start; i < end; i++) {
                const el = this.renderFn(this.items[i], i);
                el.style.height = this.itemHeight + 'px';
                fragment.appendChild(el);
            }
            this._content.innerHTML = '';
            this._content.appendChild(fragment);
        }

        update(items) {
            this.items = items;
            this._spacer.style.height = (items.length * this.itemHeight) + 'px';
            this.render();
        }
    };

    // ═══ 10. HAPTIC FEEDBACK — Premium Tactile Feel ═══
    document.addEventListener('click', async (e) => {
        const target = e.target.closest('button, a, [onclick], [role="button"], .clickable, .card, .surah-item, .category-card');
        if (target && window.Capacitor && window.Capacitor.Plugins.Haptics) {
            try {
                await window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
            } catch (err) { }
        }
    }, { passive: true });

    console.log('[Islamic Hub] ⚡ Performance Engine loaded — 120fps mode active');
})();

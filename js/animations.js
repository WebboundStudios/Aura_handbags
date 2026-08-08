/* ==========================================================================
   AURA HANDBAGS - GSAP, ScrollTrigger & Lenis Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------------
     1. Smooth Scrolling Setup (Lenis)
     ------------------------------------------------------------------------ */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential easing
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ------------------------------------------------------------------------
     2. Page Loader Animation
     ------------------------------------------------------------------------ */
  const loader = document.querySelector('.page-loader');
  const loaderBar = document.querySelector('.loader-progress-bar');
  const loaderText = document.querySelector('.loader-brand span');

  if (loader) {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            initHeroAnimations();
          }
        });
      }
    });

    tl.to(loaderText, {
      y: '0%',
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2
    })
    .to(loaderBar, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut'
    });
  } else {
    initHeroAnimations();
  }

  /* ------------------------------------------------------------------------
     3. Hero Animations & Parallax
     ------------------------------------------------------------------------ */
  function initHeroAnimations() {
    // Split text reveals
    if (typeof SplitType !== 'undefined') {
      const heroHeadlines = document.querySelectorAll('.split-text');
      heroHeadlines.forEach((heading) => {
        const text = new SplitType(heading, { types: 'lines, words' });
        gsap.from(text.words, {
          y: '100%',
          opacity: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'power3.out'
        });
      });
    }

    // Hero visual reveal
    gsap.to('.hero-image-wrapper img', {
      scale: 1,
      duration: 1.4,
      ease: 'power3.out'
    });

    // Hero subtle mouse floating parallax
    const heroVisual = document.querySelector('.hero-visual');
    const heroImage = document.querySelector('.hero-image-wrapper');

    if (heroVisual && heroImage && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 25;
        const yPos = (clientY / window.innerHeight - 0.5) * 25;

        gsap.to(heroImage, {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: 'power1.out'
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     4. Featured Collection Reveals
     ------------------------------------------------------------------------ */
  const collectionItems = document.querySelectorAll('.collection-item');
  collectionItems.forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  /* ------------------------------------------------------------------------
     5. Pinned Horizontal Scroll Section
     ------------------------------------------------------------------------ */
  const horizontalSection = document.querySelector('.horizontal-scroll-section');
  const horizontalTrack = document.querySelector('.horizontal-track');

  if (horizontalSection && horizontalTrack) {
    const getScrollAmount = () => {
      let trackWidth = horizontalTrack.scrollWidth;
      return -(trackWidth - window.innerWidth + 200);
    };

    const tween = gsap.to(horizontalTrack, {
      x: getScrollAmount,
      ease: 'none',
    });

    ScrollTrigger.create({
      trigger: horizontalSection,
      start: 'top top',
      end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth + 500}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
    });
  }

  /* ------------------------------------------------------------------------
     6. About Section Counter Animations
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.counter-val');

  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target'), 10);

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        let count = { val: 0 };
        gsap.to(count, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            stat.textContent = Math.floor(count.val);
          }
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
     7. Why Choose Aura Scroll Reveals
     ------------------------------------------------------------------------ */
  const whyCards = document.querySelectorAll('.why-card');
  whyCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: 'power3.out'
    });
  });

  /* ------------------------------------------------------------------------
     8. Editorial Banner Parallax
     ------------------------------------------------------------------------ */
  const bannerBg = document.querySelector('.editorial-banner-bg');
  if (bannerBg) {
    gsap.to(bannerBg, {
      scrollTrigger: {
        trigger: '.editorial-banner-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '15%',
      ease: 'none'
    });
  }

  /* ------------------------------------------------------------------------
     9. Magnetic Buttons Micro-interaction
     ------------------------------------------------------------------------ */
  const magneticBtns = document.querySelectorAll('.btn-magnetic');

  if (window.matchMedia('(pointer: fine)').matches) {
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }
});

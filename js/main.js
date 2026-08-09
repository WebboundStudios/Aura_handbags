/* ==========================================================================
   AURA HANDBAGS - Core Application Logic & Event Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Navbar Scroll Transition (Blends with Hero BG)
     ------------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');
  const scrollThreshold = 40;

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar);
  window.addEventListener('resize', updateNavbar);
  updateNavbar();

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
     ------------------------------------------------------------------------ */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. WhatsApp Order / Inquiry Integration
     ------------------------------------------------------------------------ */
  const whatsappNumber = '917217063915'; // Brand business WhatsApp line
  const whatsappButtons = document.querySelectorAll('.whatsapp-trigger');

  whatsappButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = encodeURIComponent("Hello Aura Handbags! I would like to inquire about your luxury handbag collection.");
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  });

  /* ------------------------------------------------------------------------
     4. Smooth Scroll for Anchor Links (Integrating Lenis)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (window.lenis) {
          window.lenis.scrollTo(targetElement, { offset: -50, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  /* ------------------------------------------------------------------------
     5. Automatic Online Stock Image Watermarking (Disabled)
     ------------------------------------------------------------------------ */
  function applyOnlineWatermarks() {
    // Disabled as requested
  }

  window.applyOnlineWatermarks = applyOnlineWatermarks;
});

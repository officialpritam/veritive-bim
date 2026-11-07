/* =========================================================
   VERTIVE BIM Engineering Services — Main Script
   Libraries: Swiper, AOS, CountUp.js, Typed.js, GLightbox
   ========================================================= */

// Set to false once php/contact.php is deployed on a PHP server.
// While true, forms simulate a successful response so the static site can be demoed.
const DEMO_MODE = true;

document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Preloader ---------- */
  const hidePreloader = () => $('#preloader')?.classList.add('hide');
  window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 3000); // fallback if an external asset is slow

  /* ---------- Year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Header: sticky + active link ---------- */
  const header = $('#header');
  const backTop = $('#backTop');
  // Scroll-spy only applies to same-page hash links (homepage); other pages set .active in markup
  const navLinks = $$('.nav ul a[href^="#"]');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    backTop.classList.toggle('show', y > 600);

    if (!sections.length) return;
    let current = sections[0];
    sections.forEach(sec => { if (sec.offsetTop - 140 <= y) current = sec; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const closeNav = () => {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeNav));

  /* ---------- Services dropdown ---------- */
  $$('.has-dropdown').forEach(item => {
    const btn = $('.dropdown-toggle', item);
    const subs = $$('.has-submenu', item);
    const setSubOpen = (sub, open) => {
      sub.classList.toggle('open', open);
      $('.submenu-toggle', sub).setAttribute('aria-expanded', open);
    };
    const setOpen = (open) => {
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      if (!open) subs.forEach(sub => setSubOpen(sub, false));
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      item.classList.remove('dismissed');
      setOpen(!item.classList.contains('open'));
    });
    subs.forEach(sub => $('.submenu-toggle', sub).addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !sub.classList.contains('open');
      subs.forEach(other => setSubOpen(other, false));
      setSubOpen(sub, open);
    }));
    document.addEventListener('click', (e) => { if (!item.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && item.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    item.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !item.contains(e.relatedTarget)) setOpen(false);
    });
    // Hide the menu after picking a link, even though the pointer is still over it
    $$('.dropdown a', item).forEach(a => a.addEventListener('click', () => {
      setOpen(false);
      item.classList.add('dismissed');
    }));
    item.addEventListener('mouseleave', () => item.classList.remove('dismissed'));
  });

  /* ---------- Reach Us menu (call / email) ---------- */
  $$('.reach').forEach(reach => {
    const btn = $('.reach-toggle', reach);
    const setOpen = (open) => {
      reach.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      reach.classList.remove('dismissed');
      setOpen(!reach.classList.contains('open'));
    });
    document.addEventListener('click', (e) => { if (!reach.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reach.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    reach.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !reach.contains(e.relatedTarget)) setOpen(false);
    });
    $$('.reach-menu a', reach).forEach(a => a.addEventListener('click', () => {
      setOpen(false);
      reach.classList.add('dismissed');
    }));
    reach.addEventListener('mouseleave', () => reach.classList.remove('dismissed'));
  });

  /* ---------- Typed.js (hero) ---------- */
  if ($('#typed')) new Typed('#typed', {
    strings: ['smarter, sustainable built environment.', 'clash-free coordination.', 'faster project delivery.'],
    typeSpeed: 45,
    backSpeed: 25,
    backDelay: 2200,
    startDelay: 900,
    loop: true,
  });

  /* ---------- Sliders & lightbox (homepage only) ---------- */
  if (window.Swiper) initSliders();
  if (window.GLightbox) GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });

  /* ---------- AOS ----------
     Initialised after the sliders so trigger offsets reflect the final layout */
  AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  window.addEventListener('load', () => AOS.refresh());

  function initSliders() {
  /* ---------- Swiper: services ---------- */
  new Swiper('.services-swiper', {
    slidesPerView: 1.1,
    spaceBetween: 18,
    grabCursor: true,
    speed: 700,
    autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: { nextEl: '.services-next', prevEl: '.services-prev' },
    pagination: { el: '.services-pagination', clickable: true },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 22 },
      1200: { slidesPerView: 4, spaceBetween: 24 },
    },
  });

  /* ---------- Swiper: projects + filter ---------- */
  const projectsSwiper = new Swiper('.projects-swiper', {
    slidesPerView: 1.1,
    spaceBetween: 18,
    grabCursor: true,
    speed: 700,
    navigation: { nextEl: '.projects-next', prevEl: '.projects-prev' },
    pagination: { el: '.projects-pagination', clickable: true },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 22 },
      1200: { slidesPerView: 4, spaceBetween: 24 },
    },
  });

  $$('#projectFilter button').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#projectFilter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.project-card').forEach(card => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.cat !== filter);
      });
      projectsSwiper.update();
      projectsSwiper.slideTo(0);
    });
  });
  }

  /* ---------- CountUp.js (stats) ---------- */
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const counter = new countUp.CountUp(el, +el.dataset.target, { duration: 2.4, useEasing: true });
      if (!counter.error) counter.start();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.counter').forEach(el => counterObserver.observe(el));

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  };

  /* ---------- Modal ---------- */
  const openModal = (id) => {
    const modal = document.getElementById(id);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('input', modal)?.focus(), 300);
  };
  const closeModal = (modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };
  $$('[data-open-modal]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.openModal);
  }));
  // "View Current Openings" style CTAs that point at #contact also open the form
  $$('a.btn[href="#contact"]').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    closeNav();
    openModal('contactModal');
  }));
  // Service-card "View Details" links open the form with that service preselected
  $$('.svc-link[data-service]').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    $('#cf-service').value = a.dataset.service;
    openModal('contactModal');
  }));
  $$('.modal').forEach(modal => {
    $$('[data-close-modal]', modal).forEach(el => el.addEventListener('click', () => closeModal(modal)));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $$('.modal.open').forEach(closeModal);
  });

  /* ---------- AJAX helper (PHP-ready) ----------
     Expected PHP JSON response: { "success": true|false, "message": "..." } */
  const postForm = async (url, formData) => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 1200));
      return { success: true, message: 'Thank you! Your message has been sent. We will get back to you shortly.' };
    }
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!res.ok) throw new Error('Server error ' + res.status);
    return res.json();
  };

  /* ---------- AJAX forms (contact modal, contact page, job application) ---------- */
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const bindAjaxForm = (form, successToast) => {
    if (!form) return;
    const status = $('.form-status', form);
    const btn = $('button[type="submit"]', form);
    const btnText = $('.btn-text', btn);
    const btnIcon = $('i', btn);
    const idleText = btnText.textContent;
    const idleIcon = btnIcon.className;

    const validate = () => {
      let valid = true;
      $$('[required]', form).forEach(field => {
        const ok = field.type === 'email' ? emailOk(field.value.trim()) : field.value.trim() !== '';
        field.closest('.field').classList.toggle('error', !ok);
        if (!ok) valid = false;
      });
      return valid;
    };
    $$('input, select, textarea', form).forEach(el => ['input', 'change'].forEach(evt =>
      el.addEventListener(evt, () => el.closest('.field')?.classList.remove('error'))));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';
      if (!validate()) {
        status.classList.add('fail');
        status.textContent = 'Please fill in all required fields correctly.';
        return;
      }

      btn.classList.add('loading');
      btnText.textContent = 'Sending...';
      btnIcon.className = 'ri-loader-4-line';

      try {
        const data = await postForm(form.action, new FormData(form));
        status.classList.add(data.success ? 'success' : 'fail');
        status.textContent = data.message;
        if (data.success) {
          form.reset();
          form.dispatchEvent(new Event('reset-ui'));
          const modal = form.closest('.modal');
          setTimeout(() => { if (modal) closeModal(modal); status.textContent = ''; }, 2500);
          showToast(successToast);
        }
      } catch (err) {
        status.classList.add('fail');
        status.textContent = 'Something went wrong. Please try again later.';
      } finally {
        btn.classList.remove('loading');
        btnText.textContent = idleText;
        btnIcon.className = idleIcon;
      }
    });
  };

  bindAjaxForm($('#contactForm'), 'Message sent successfully!');
  bindAjaxForm($('#pageContactForm'), 'Message sent successfully!');
  bindAjaxForm($('#applyForm'), 'Application submitted successfully!');

  /* ---------- Careers: apply modal ---------- */
  const applyForm = $('#applyForm');
  if (applyForm) {
    $$('[data-apply]').forEach(btn => btn.addEventListener('click', () => {
      $('#applyRole').textContent = btn.dataset.apply;
      $('#ap-position').value = btn.dataset.apply;
      openModal('applyModal');
    }));

    const resume = $('#ap-resume');
    const fileLabel = $('[data-file-label]', applyForm);
    const fileHint = fileLabel.textContent;
    resume.addEventListener('change', () => {
      const file = resume.files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        resume.value = '';
        showToast('Resume must be 5 MB or smaller.');
      }
      fileLabel.textContent = resume.files[0]?.name || fileHint;
      resume.closest('.field').classList.toggle('has-file', !!resume.files[0]);
    });
    applyForm.addEventListener('reset-ui', () => {
      fileLabel.textContent = fileHint;
      resume.closest('.field').classList.remove('has-file');
    });
  }

  /* ---------- Careers: job filter + search ---------- */
  const jobSearch = $('#jobSearch');
  if (jobSearch) {
    let jobCat = 'all';
    const filterJobs = () => {
      const q = jobSearch.value.trim().toLowerCase();
      let shown = 0;
      $$('.job-card').forEach(card => {
        const catOk = jobCat === 'all' || card.dataset.cat.split(' ').includes(jobCat);
        const textOk = !q || card.textContent.toLowerCase().includes(q);
        card.classList.toggle('is-hidden', !(catOk && textOk));
        if (catOk && textOk) shown++;
      });
      $('#jobsEmpty').hidden = shown > 0;
    };
    $$('#jobFilter button').forEach(btn => btn.addEventListener('click', () => {
      $$('#jobFilter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      jobCat = btn.dataset.filter;
      filterJobs();
    }));
    jobSearch.addEventListener('input', filterJobs);
  }

  /* ---------- Contact: FAQ accordion ---------- */
  $$('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const open = !item.classList.contains('open');
    $$('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      $('.faq-q', i).setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', open);
    q.setAttribute('aria-expanded', String(open));
  }));

  /* ---------- Legal pages: highlight current section in the contents list ---------- */
  const tocLinks = $$('.legal-toc a');
  if (tocLinks.length) {
    const tocSections = tocLinks.map(a => $(a.getAttribute('href')));
    const onTocScroll = () => {
      // Current = last section whose top has passed 30% of the viewport (first one by default)
      let current = 0;
      tocSections.forEach((sec, i) => { if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.3) current = i; });
      // At the very bottom, short final sections can't reach that line, so mark the last one
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = tocSections.length - 1;
      tocLinks.forEach((a, i) => a.classList.toggle('active', i === current));
    };
    window.addEventListener('scroll', onTocScroll, { passive: true });
    onTocScroll();
  }

  /* ---------- Newsletter ---------- */
  const newsletter = $('#newsletterForm');
  newsletter?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('input', newsletter);
    if (!emailOk(input.value.trim())) {
      showToast('Please enter a valid email address.');
      return;
    }
    try {
      const data = await postForm('php/subscribe.php', new FormData(newsletter));
      showToast(data.success ? 'Subscribed! Thank you for joining us.' : data.message);
      if (data.success) newsletter.reset();
    } catch {
      showToast('Subscription failed. Please try again.');
    }
  });
});

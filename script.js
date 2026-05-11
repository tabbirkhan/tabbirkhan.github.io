document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const body = document.body;
  const typingText = document.querySelector('.typing-text');
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.cursor-dot');
  const settingsToggle = document.querySelector('.settings-toggle');
  const themePanel = document.querySelector('.theme-panel');
  const colorOptions = document.querySelectorAll('.color-option');
  const themeModeToggle = document.getElementById('themeMode');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const accentThemes = {
    purple: '#6c63ff',
    pink: '#ff6b9d',
    blue: '#4dabf7',
    green: '#51cf66',
    orange: '#ff922b'
  };

  initAos();
  initTheme();
  initTyping();
  initCursor();
  initThemePanel();
  initNavigation();
  initScrollAnimations();
  initForms();

  body.classList.add('loaded');

  function initAos() {
    if (!window.AOS) return;

    AOS.init({
      duration: 800,
      offset: 100,
      once: true,
      easing: 'ease-in-out'
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColor = localStorage.getItem('themeColor') || 'purple';

    applyTheme(savedTheme);
    applyAccent(savedColor);

    themeToggle?.addEventListener('click', () => {
      const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('theme', nextTheme);
    });

    themeModeToggle?.addEventListener('change', () => {
      const nextTheme = themeModeToggle.checked ? 'dark' : 'light';
      applyTheme(nextTheme);
      localStorage.setItem('theme', nextTheme);
    });

    colorOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const color = option.dataset.color;
        applyAccent(color);
        localStorage.setItem('themeColor', color);
      });
    });
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
    }

    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    if (themeModeToggle) {
      themeModeToggle.checked = theme === 'dark';
    }
  }

  function applyAccent(colorName) {
    const color = accentThemes[colorName] || accentThemes.purple;

    html.style.setProperty('--accent', color);
    html.style.setProperty('--accent-hover', color);

    colorOptions.forEach((option) => {
      option.classList.toggle('active', option.dataset.color === colorName);
    });
  }

  function initTyping() {
    if (!typingText) return;

    const words = ['Python Backend Developer', 'Django Developer', 'Freelancer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex -= 1;
      } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex += 1;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 500);
      } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
      }
    };

    typeEffect();
  }

  function initCursor() {
    if (!cursor || !dot || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    }, { passive: true });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    document.querySelectorAll('a, button, input, textarea, .color-option').forEach((item) => {
      item.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      item.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  function initThemePanel() {
    settingsToggle?.addEventListener('click', (event) => {
      event.stopPropagation();
      themePanel?.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.theme-settings')) {
        themePanel?.classList.remove('active');
      }
    });
  }

  function initNavigation() {
    hamburger?.addEventListener('click', () => {
      navMenu?.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const offsetTop = target.offsetTop - 76;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      });
    });

    document.querySelector('.about-btn')?.addEventListener('click', () => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
    });

    const sections = document.querySelectorAll('section[id]');
    const updateActiveLink = () => {
      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
          });
        }
      });
    };

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
  }

  function initScrollAnimations() {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const fill = entry.target.querySelector('.progress-fill');
        if (fill) {
          fill.style.width = `${fill.dataset.progress}%`;
        }
      });
    }, {
      threshold: 0.45,
      rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.skill-card').forEach((card) => {
      progressObserver.observe(card);
    });

    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.2
    });

    document.querySelectorAll('.project-card, .timeline-item').forEach((item) => {
      slideObserver.observe(item);
    });
  }

  function initForms() {
    document.getElementById('contactForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      event.currentTarget.reset();
    });

    document.getElementById('newsletterForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Thanks for subscribing to my newsletter!');
      event.currentTarget.reset();
    });
  }
});

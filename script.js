document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded smoothly!");

  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- HERO PARALLAX ---
  const heroDots = document.querySelector('.hero-bg-dots');
  if (heroDots) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.2) {
            heroDots.style.transform = `scale(2) translate(${scrollY * 0.012}px, ${scrollY * 0.02}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- MOBILE MENU TOGGLE ---
  const hamburger = document.querySelector(".nav-hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.innerHTML = isOpen ? "✕" : "☰";
    document.body.style.overflow = isOpen ? "hidden" : ""; // prevent background scroll
  }

  hamburger.addEventListener("click", toggleMenu);

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.innerHTML = "☰";
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking directly on the overlay background
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("open");
      hamburger.innerHTML = "☰";
      document.body.style.overflow = "";
    }
  });

  // --- ACTIVE LINK TRACKING (IntersectionObserver) ---
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link"); // desktop links

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5 // Trigger when section is 50% in viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove("active"));
        
        // Add active class to corresponding link
        const targetId = entry.target.getAttribute("id");
        const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // --- SECTION CROSSFADE ---
  const allSections = document.querySelectorAll('section');
  const crossfadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allSections.forEach(s => s.classList.add('section-dim'));
        entry.target.classList.remove('section-dim');
      }
    });
  }, { threshold: 0.3 });
  if (!prefersReducedMotion) {
    allSections.forEach(s => crossfadeObs.observe(s));
  }

  // --- HERO TYPEWRITER EFFECT ---
// --- HERO TYPEWRITER EFFECT ---
const phrases = [
  "Systems builder",
  "Mechanical Engineering Undergrad",
  "Edge ML · CFD · Deployed tools"
];

const typewriterText = document.getElementById("typewriter-text");
const typewriterCursor = document.querySelector(".typewriter-cursor");

if (typewriterText) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function setCursorBlink(blinking) {
    if (typewriterCursor) {
      typewriterCursor.classList.toggle("blinking", blinking);
    }
  }

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typewriterText.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setCursorBlink(true);
        setTimeout(typeEffect, 400);
        return;
      }
      setCursorBlink(false);
      setTimeout(typeEffect, 35);
    } else {
      charIndex++;
      typewriterText.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === currentPhrase.length) {
        setCursorBlink(true);
        setTimeout(() => {
          isDeleting = true;
          setCursorBlink(false);
          setTimeout(typeEffect, 35);
        }, 1800);
        return;
      }
      setCursorBlink(false);
      setTimeout(typeEffect, 70);
    }
  }

  setCursorBlink(true);
  setTimeout(typeEffect, 1000);
}


  // --- PROJECTS FILTERING ---
  const filterTabs = document.querySelectorAll(".filter-tab");
  const projectCards = document.querySelectorAll(".project-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      projectCards.forEach(card => {
        const matches = filter === "all" || card.getAttribute("data-tag") === filter;
        if (matches) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // --- CARD SCROLL ANIMATION ---
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, prefersReducedMotion ? 0 : i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  projectCards.forEach(card => cardObserver.observe(card));

  // --- MAGNETIC CARD HOVER ---
  const projectCardEls = document.querySelectorAll('.project-card');
  projectCardEls.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 6;
      const tiltY = -(x / rect.width) * 6;
      card.style.transform = `translateY(-3px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // --- CONTACT CARD GLOW ---
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(245,166,35,0.08) 0%, #111827 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // --- TEXT SPLIT STAGGER ---
  function splitAndAnimate(selector) {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      const words = el.textContent.trim().split(' ');
      el.innerHTML = words.map((word, i) =>
        `<span class="word-wrap"><span class="word" style="transition-delay:${i * 0.04}s">${word}</span></span>`
      ).join(' ');
    });
  }
  splitAndAnimate('.hero-name');
  splitAndAnimate('.section-header h2');

  setTimeout(() => {
    document.querySelectorAll('.hero-name .word').forEach(w => {
      w.classList.add('word-visible');
    });
  }, 100);

  // --- SCROLL REVEAL ---
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Trigger word animations inside section headers
        entry.target.querySelectorAll('.word').forEach(w => {
          w.classList.add('word-visible');
        });
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // --- CUSTOM CURSOR ---
  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");

  // Only run cursor logic if fine pointer (mouse) is present
  if (window.matchMedia("(pointer: fine)").matches) {
    
   window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;
  cursorOutline.style.left = `${posX}px`;
  cursorOutline.style.top = `${posY}px`;
  cursorOutline.style.opacity = '1'; 
});

    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll("a, button, .filter-tab, .contact-card");
    
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover-state");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover-state");
      });
      
      // Safety reset
      el.addEventListener("click", () => {
         document.body.classList.remove("cursor-hover-state");
      })
    });
  } else {
    // Ensure body cursor isn't hidden on touch devices
    document.body.style.cursor = 'auto';
  }
});

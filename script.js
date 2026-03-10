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

  // --- HERO TYPEWRITER EFFECT ---
  const phrases = [
    "Engineering Systems Builder",
    "Mechanical Engineer",
    "Edge AI & IoT Developer",
    "Simulation & CFD Automation"
  ];
  
  const typewriterText = document.getElementById("typewriter-text");
  
  if (typewriterText) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        // Remove char
        typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Delete faster
      } else {
        // Add char
        typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Type slower
      }

      // If finished typing phrase, pause and then delete
      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at end of phrase
        isDeleting = true;
      } 
      // If finished deleting, move to next phrase
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing next phrase
      }

      setTimeout(typeEffect, typingSpeed);
    }

    // Start typewriter
    setTimeout(typeEffect, 1000); // 1s initial delay to let entrance animations finish
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
  const cardObserverOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        cardObserver.unobserve(entry.target);
      }
    });
  }, cardObserverOptions);

  projectCards.forEach(card => cardObserver.observe(card));

  // --- SCROLL REVEAL FOR SECTIONS ---
  const revealElements = document.querySelectorAll(
    '.about-grid, .skills-wrapper, .skill-group, .roles-list, .achievement-card, .contact-card, #footer p'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

  // --- CUSTOM CURSOR ---
  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");

  // Only run cursor logic if fine pointer (mouse) is present
  if (window.matchMedia("(pointer: fine)").matches) {
    
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Update dot immediately
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Outline follows via CSS transition 
      // (The translate is handled in CSS, so we just set top/left)
      cursorOutline.style.left = `${posX}px`;
      cursorOutline.style.top = `${posY}px`;
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

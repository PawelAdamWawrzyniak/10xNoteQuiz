/**
 * Note page interactions
 * Handles scroll-to-top button and table of contents navigation
 */

(() => {
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  // Show/hide scroll-to-top button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn?.classList.add("visible");
    } else {
      scrollToTopBtn?.classList.remove("visible");
    }
  });

  // Scroll to top on button click
  scrollToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Smooth scroll for table of contents links
  document.addEventListener("DOMContentLoaded", () => {
    const tocLinks = document.querySelectorAll('aside[aria-label="Table of contents"] a[href^="#"]');

    tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href")?.substring(1);

        if (targetId) {
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            window.history.pushState(null, "", `#${targetId}`);
          }
        }
      });
    });
  });
})();

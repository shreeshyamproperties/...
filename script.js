document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     SHREE SHYAM PROPERTIES
     Main website interactions
     ========================================================= */

  const WHATSAPP_NUMBER = "918302366978";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* ---------------------------------------------------------
     WhatsApp helper
     --------------------------------------------------------- */
  function openWhatsApp(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  const menuBtn = $("#menuBtn");
  const mainNav = $("#mainNav");

  function closeMenu() {
    if (!mainNav) return;

    mainNav.classList.remove("open");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }
  }

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
      menuBtn.textContent = isOpen ? "×" : "☰";
    });

    // Close menu after clicking a navigation link.
    $$("a", mainNav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close mobile menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------
     Property requirement tabs
     --------------------------------------------------------- */
  const propertyTitle = $("#propertyTitle");
  const propertyCopy = $("#propertyCopy");
  const propertyBtn = $("#propertyBtn");
  const enquiryType = $("#type");
  const enquiryMessage = $("#message");

  const propertyData = {
    Buy: {
      title: "Looking to buy in Gurgaon?",
      copy:
        "Tell us your preferred sector, property type and budget. We'll use your enquiry to start the conversation on WhatsApp.",
      type: "Purchase",
      message:
        "I want to purchase a property in Gurgaon. Please share suitable options."
    },

    Sell: {
      title: "Planning to sell a property?",
      copy:
        "Share the location, property type and your preferred selling timeline. We'll start with your requirement.",
      type: "Sale",
      message:
        "I want to sell my property in Gurgaon. Please contact me for further discussion."
    },

    Rent: {
      title: "Looking for a rental?",
      copy:
        "Tell us whether you need residential or commercial space, preferred location, budget and move-in timing.",
      type: "Rent",
      message:
        "I am looking to rent/lease a property in Gurgaon. Please share suitable options."
    }
  };

  function updatePropertyTab(type) {
    const data = propertyData[type];

    if (!data) return;

    if (propertyTitle) propertyTitle.textContent = data.title;
    if (propertyCopy) propertyCopy.textContent = data.copy;

    if (enquiryType) {
      enquiryType.value = data.type;
    }

    if (enquiryMessage) {
      enquiryMessage.value = data.message;
    }

    // Keep the selected type available to the enquiry button.
    if (propertyBtn) {
      propertyBtn.dataset.propertyType = data.type;
    }
  }

  $$(".property-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".property-tab").forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");
      updatePropertyTab(tab.dataset.type);
    });
  });

  /* ---------------------------------------------------------
     Service buttons
     --------------------------------------------------------- */
  $$("[data-enquiry]").forEach((button) => {
    button.addEventListener("click", () => {
      const presetMessage = button.dataset.enquiry;

      if (enquiryMessage && presetMessage) {
        enquiryMessage.value = presetMessage;
      }

      // If the link points to #enquiry, browser handles scrolling.
      // Focus the name field after the scroll.
      window.setTimeout(() => {
        $("#name")?.focus();
      }, 500);
    });
  });

  /* ---------------------------------------------------------
     Property requirement button
     --------------------------------------------------------- */
  if (propertyBtn) {
    propertyBtn.addEventListener("click", () => {
      const selectedType =
        propertyBtn.dataset.propertyType ||
        $(".property-tab.active")?.dataset.type ||
        "Buy";

      const data = propertyData[selectedType];

      if (data) {
        if (enquiryType) enquiryType.value = data.type;
        if (enquiryMessage && !enquiryMessage.value.trim()) {
          enquiryMessage.value = data.message;
        }
      }
    });
  }

  /* ---------------------------------------------------------
     Enquiry form -> WhatsApp
     --------------------------------------------------------- */
  const enquiryForm = $("#enquiryForm");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("#name")?.value.trim() || "";
      const mobile = $("#mobile")?.value.trim() || "";
      const type = $("#type")?.value || "General Enquiry";
      const message = $("#message")?.value.trim() || "";

      if (!name || !mobile || !message) {
        alert(
          "Please enter your name, mobile number and property requirement."
        );
        return;
      }

      // Accept Indian mobile numbers with optional spaces,
      // hyphens or +91 prefix.
      const cleanMobile = mobile.replace(/[\s()-]/g, "");

      const validIndianMobile =
        /^(?:\+91|91)?[6-9]\d{9}$/.test(cleanMobile);

      if (!validIndianMobile) {
        alert("Please enter a valid Indian mobile number.");
        $("#mobile")?.focus();
        return;
      }

      const whatsappMessage = [
        "Hello Shree Shyam Properties,",
        "",
        "I have a property enquiry.",
        "",
        `Name: ${name}`,
        `Mobile: ${mobile}`,
        `Enquiry Type: ${type}`,
        `Requirement: ${message}`,
        "",
        "Sent from the Shree Shyam Properties website."
      ].join("\n");

      openWhatsApp(whatsappMessage);
    });
  }

  /* ---------------------------------------------------------
     Direct WhatsApp links
     --------------------------------------------------------- */
  $$("[data-whatsapp-message]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();

      const message =
        element.dataset.whatsappMessage ||
        "Hello Shree Shyam Properties, I have a property enquiry.";

      openWhatsApp(message);
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal animation
     --------------------------------------------------------- */
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    // Fallback for older browsers.
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ---------------------------------------------------------
     Smooth same-page links
     --------------------------------------------------------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      closeMenu();
    });
  });

  /* ---------------------------------------------------------
     Current year
     --------------------------------------------------------- */
  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     Header shadow while scrolling
     --------------------------------------------------------- */
  const header = $(".site-header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* ---------------------------------------------------------
     Keyboard accessibility
     --------------------------------------------------------- */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* ---------------------------------------------------------
     Prevent accidental duplicate form submissions
     --------------------------------------------------------- */
  if (enquiryForm) {
    let submitting = false;

    enquiryForm.addEventListener("submit", () => {
      if (submitting) return;
      submitting = true;

      const submitButton = $(".submit-btn", enquiryForm);

      if (submitButton) {
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = "Opening WhatsApp…";
        submitButton.disabled = true;

        window.setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
          submitting = false;
        }, 2500);
      }
    });
  }

  /* ---------------------------------------------------------
     Initial property state
     --------------------------------------------------------- */
  updatePropertyTab("Buy");
});

/* =========================
   Load Components
========================= */

async function loadComponent(id, file) {

  const element =
    document.getElementById(id);

  if (!element) return;

  const response =
    await fetch(file);

  const html =
    await response.text();

  element.innerHTML = html;

}

/* =========================
   Init Site
========================= */

async function initSite() {

  /* Load nav + footer first */

  await loadComponent(
    "nav-placeholder",
    "components/nav.html"
  );

  await loadComponent(
    "footer-placeholder",
    "components/footer.html"
  );

  /* =========================
     Active Nav Link
  ========================= */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop();

  const navLinks =
    document.querySelectorAll(
      ".topnav a"
    );

  navLinks.forEach(link => {

    const href =
      link.getAttribute("href");

    if (href === currentPage) {

      link.classList.add("active");

    }

  });

  /* =========================
     Mobile Navigation Toggle
  ========================= */

  const menuIcon =
    document.querySelector(
      ".topnav .icon"
    );

  const topnav =
    document.querySelector(
      ".topnav"
    );

  if (menuIcon && topnav) {

    menuIcon.addEventListener(
      "click",
      e => {

        e.preventDefault();

        topnav.classList.toggle(
          "responsive"
        );

      }
    );

  }

  /* =========================
     Mobile Dropdown Toggle
  ========================= */

  const dropdownButtons =
    document.querySelectorAll(
      ".dropdown .dropbtn"
    );

  dropdownButtons.forEach(button => {

    button.addEventListener(
      "click",
      e => {

        if (
          window.innerWidth <= 768
        ) {

          e.preventDefault();

          const dropdown =
            button.parentElement;

          dropdown.classList.toggle(
            "open"
          );

        }

      }
    );

  });

}

/* =========================
   About Section Animation
========================= */

const sections =
  document.querySelectorAll(
    ".about-section"
  );

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

        }

      });

    },
    {
      threshold: 0.15
    }
  );

sections.forEach(section => {

  observer.observe(section);

});

/* =========================
   Init
========================= */

initSite();
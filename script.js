async function loadComponent(id, file) {

  const element = document.getElementById(id);

  if (!element) return;

  const response = await fetch(file);

  const html = await response.text();

  element.innerHTML = html;

}

loadComponent(
  "nav-placeholder",
  "components/nav.html"
);

loadComponent(
  "footer-placeholder",
  "components/footer.html"
);

window.addEventListener("DOMContentLoaded", () => {

  const currentPage =
    window.location.pathname.split("/").pop();

  const navLinks =
    document.querySelectorAll(".topnav a");

  navLinks.forEach(link => {

    const href = link.getAttribute("href");

    if (href === currentPage) {

      link.classList.add("active");

    }

  });

});

const sections =
  document.querySelectorAll(".about-section");

const observer =
  new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

      }

    });

  }, {
    threshold: 0.15
  });

sections.forEach(section => {
  observer.observe(section);
});
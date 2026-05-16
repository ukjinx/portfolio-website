/* =========================
   Gallery Loader
========================= */

const gallery = document.getElementById("gallery");

const galleryName =
    gallery.dataset.gallery;

let images = [];

let currentIndex = 0;

/* =========================
   Load JSON
========================= */

async function loadGallery() {

    try {

        const response = await fetch(
            `data/${galleryName}.json`
        );

        images = await response.json();

        buildGallery();

    } catch (error) {

        console.error(
            "Failed to load gallery:",
            error
        );

    }

}

/* =========================
   Build Gallery
========================= */

function buildGallery() {

    images.forEach((image, index) => {

        const item = document.createElement("div");

        item.className = "gallery-item";

        item.innerHTML = `
            <img
                src="${image.src}"
                alt="${image.alt}"
                loading="lazy"
                data-index="${index}"
            >
        `;

        gallery.appendChild(item);

    });

    attachGalleryEvents();

}

/* =========================
   Lightbox
========================= */

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightbox-img");

const closeBtn =
    document.getElementById("closeLightbox");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

/* =========================
   Open
========================= */

function openLightbox(index) {

    currentIndex = index;

    lightboxImg.src =
        images[index].src;

    lightbox.classList.add("active");

    document.body.style.overflow =
        "hidden";

}

/* =========================
   Close
========================= */

function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}

/* =========================
   Next / Prev
========================= */

function showNext() {

    currentIndex =
        (currentIndex + 1)
        % images.length;

    lightboxImg.src =
        images[currentIndex].src;

}

function showPrev() {

    currentIndex =
        (currentIndex - 1 + images.length)
        % images.length;

    lightboxImg.src =
        images[currentIndex].src;

}

/* =========================
   Events
========================= */

gallery.addEventListener("click", e => {

    const image = e.target.closest("img");

    if (!image) return;

    openLightbox(
        parseInt(image.dataset.index)
    );

});

closeBtn.addEventListener(
    "click",
    closeLightbox
);

nextBtn.addEventListener(
    "click",
    showNext
);

prevBtn.addEventListener(
    "click",
    showPrev
);

/* =========================
   Keyboard
========================= */

document.addEventListener(
    "keydown",
    e => {

        if (
            !lightbox.classList.contains(
                "active"
            )
        ) return;

        if (e.key === "Escape") {
            closeLightbox();
        }

        if (e.key === "ArrowRight") {
            showNext();
        }

        if (e.key === "ArrowLeft") {
            showPrev();
        }

    }
);

/* =========================
   Init
========================= */

loadGallery();
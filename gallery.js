/* =========================
   Gallery Loader
========================= */

const gallery =
    document.getElementById("gallery");

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

        const item =
            document.createElement("div");

        item.className =
            "gallery-item";

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

}

/* =========================
   Lightbox Elements
========================= */

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightbox-img");

const lightboxTitle =
    document.getElementById("lightbox-title");

const lightboxLocation =
    document.getElementById("lightbox-location");

const lightboxDescription =
    document.getElementById("lightbox-description");

const closeBtn =
    document.getElementById("closeLightbox");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

/* =========================
   Print Modal Elements
========================= */

const printModal =
    document.getElementById("printModal");

const openPrintModalBtn =
    document.getElementById("openPrintModal");

const closePrintModalBtn =
    document.getElementById("closePrintModal");

const printPreview =
    document.getElementById("printPreview");

const printSize =
    document.getElementById("printSize");

/* =========================
   Open Lightbox
========================= */

function openLightbox(index) {

    currentIndex = index;

    const image =
        images[index];

    lightboxImg.src =
        image.src;

    lightboxTitle.textContent =
        image.title;

    lightboxLocation.textContent =
        image.location;

    lightboxDescription.textContent =
        image.description;

    lightbox.classList.add("active");

    document.body.style.overflow =
        "hidden";

}

/* =========================
   Close Lightbox
========================= */

function closeLightbox() {

    lightbox.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}

/* =========================
   Next / Prev
========================= */

function showNext() {

    currentIndex =
        (currentIndex + 1)
        % images.length;

    openLightbox(currentIndex);

}

function showPrev() {

    currentIndex =
        (currentIndex - 1 + images.length)
        % images.length;

    openLightbox(currentIndex);

}

/* =========================
   Open Print Modal
========================= */

function openPrintModal() {

    const image =
        images[currentIndex];

    printPreview.src =
        image.src;

    printSize.innerHTML =
        `
        <option value="">
            Select Size
        </option>
        `;

    image.sizes.forEach(size => {

        const option =
            document.createElement(
                "option"
            );

        option.value = size;

        option.textContent = size;

        printSize.appendChild(option);

    });

    printModal.classList.add(
        "active"
    );

}

/* =========================
   Close Print Modal
========================= */

function closePrintModal() {

    printModal.classList.remove(
        "active"
    );

}

/* =========================
   Gallery Events
========================= */

gallery.addEventListener(
    "click",
    e => {

        const image =
            e.target.closest("img");

        if (!image) return;

        openLightbox(
            parseInt(
                image.dataset.index
            )
        );

    }
);

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

openPrintModalBtn.addEventListener(
    "click",
    openPrintModal
);

closePrintModalBtn.addEventListener(
    "click",
    closePrintModal
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

            closePrintModal();

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
   Print Form Submit
========================= */

const printForm =
    document.getElementById(
        "printForm"
    );

printForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const image =
            images[currentIndex];

        const templateParams = {

            image_title:
                image.title,

            print_size:
                document.getElementById(
                    "printSize"
                ).value,

            print_finish:
                document.getElementById(
                    "printFinish"
                ).value,

            print_frame:
                document.getElementById(
                    "printFrame"
                ).value,

            customer_name:
                document.getElementById(
                    "customerName"
                ).value,

            customer_email:
                document.getElementById(
                    "customerEmail"
                ).value,

            notes:
                document.getElementById(
                    "customerNotes"
                ).value

        };

        emailjs.send(
            "1LDb305ms-mGXgYpY",
            "template_iovxs07",
            templateParams
        )
        .then(() => {

            alert(
                "Print enquiry sent successfully."
            );

            printForm.reset();

            closePrintModal();

        })
        .catch(error => {

            console.error(
                "EmailJS Error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        });

    }
);

/* =========================
   Init
========================= */

loadGallery();
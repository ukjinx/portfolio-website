/* =========================
   Gallery Loader
========================= */

const gallery =
    document.getElementById("gallery");

const galleryName =
    gallery.dataset.gallery;

let images = [];

let currentIndex = 0;

let selectedPrints = [];

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

const selectionTray =
    document.getElementById("selectionTray");

const selectionCount =
    document.getElementById("selectionCount");

const selectedPrintsContainer =
    document.getElementById("selectedPrints");

const addToSelectionBtn =
    document.getElementById(
        "addToSelectionBtn"
    );

const closePrintModalBtn =
    document.getElementById(
        "closePrintModal"
    );

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
   Add Print Selection
========================= */

function addCurrentPrint() {

    const image =
        images[currentIndex];

    const selection = {

        title:
            image.title,

        src:
            image.src,

        size:
            image.sizes[0],

        finish:
            "Fine Art Matte",

        frame:
            "Unframed"

    };

    selectedPrints.push(
        selection
    );

    updateSelectionTray();

}

/* =========================
   Update Selection Tray
========================= */

function updateSelectionTray() {

    selectionCount.textContent =
        selectedPrints.length;

}

/* =========================
   Render Selected Prints
========================= */

function renderSelectedPrints() {

    selectedPrintsContainer.innerHTML =
        "";

    selectedPrints.forEach(
        (print, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "selected-print";

            item.innerHTML = `
                <img src="${print.src}">

                <div class="selected-print-info">

                    <h3>
                        ${print.title}
                    </h3>

                    <p>
                        Size:
                        ${print.size}
                    </p>

                    <p>
                        Finish:
                        ${print.finish}
                    </p>

                    <p>
                        Frame:
                        ${print.frame}
                    </p>

                    <button
                        class="remove-print"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </div>
            `;

            selectedPrintsContainer.appendChild(
                item
            );

        }
    );

}

/* =========================
   Open Print Modal
========================= */

function openPrintModal() {

    renderSelectedPrints();

    printModal.classList.add(
        "active"
    );

}

/* =========================
   Remove Print
========================= */

selectedPrintsContainer.addEventListener(
    "click",
    e => {

        if (
            e.target.classList.contains(
                "remove-print"
            )
        ) {

            const index =
                parseInt(
                    e.target.dataset.index
                );

            selectedPrints.splice(
                index,
                1
            );

            renderSelectedPrints();

            updateSelectionTray();

        }

    }
);


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

addToSelectionBtn.addEventListener(
    "click",
    addCurrentPrint
);

selectionTray.addEventListener(
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

        const selections =
    selectedPrints.map(print => {

        return `
Image: ${print.title}
Size: ${print.size}
Finish: ${print.finish}
Frame: ${print.frame}
`;

    }).join("\n----------------\n");

const templateParams = {

    selections:
        selections,

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
            "service_dvg53gr",
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
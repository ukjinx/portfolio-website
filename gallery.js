/* =========================
   Gallery Loader
========================= */

const gallery =
    document.getElementById("gallery");

const galleryName =
    gallery.dataset.gallery;

let images = [];

let currentIndex = 0;

let selectedPrints =
    JSON.parse(
        localStorage.getItem(
            "selectedPrints"
        )
    ) || [];

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

const openPrintModalBtn =
    document.getElementById(
        "openPrintModal"
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
   Save Selections
========================= */

function saveSelections() {

    localStorage.setItem(
        "selectedPrints",
        JSON.stringify(
            selectedPrints
        )
    );

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

        // finish:
        //     "Fine Art Matte",

        frame:
            "Unframed"

    };

    selectedPrints.push(
        selection
    );

    saveSelections();

    updateSelectionTray();

    calculatePricing();

    calculateShipping();

    renderSelectedPrints();

    /* =========================
       Tray Animation
    ========================== */

    selectionTray.classList.add(
        "pulse"
    );

    addToSelectionBtn.classList.add(
        "added"
    );

    addToSelectionBtn.textContent =
        "Added ✓";

    setTimeout(() => {

        selectionTray.classList.remove(
            "pulse"
        );

    }, 600);

    setTimeout(() => {

        addToSelectionBtn.classList.remove(
            "added"
        );

        addToSelectionBtn.textContent =
            "Add To Print Selection";

    }, 1400);

}

/* =========================
   Pricing Logic
========================= */

const pricing = {

    unframed: {
        A4: 35,
        A3: 50
    },

    framed: {
        A4: 175,
        A3: 225
    }

};

function calculatePricing() {

    let total = 0;

    let hasCustomQuote = false;

    selectedPrints.forEach(print => {

        const isFramed =
            print.frame !== "Unframed";

        const priceGroup =
            isFramed
                ? pricing.framed
                : pricing.unframed;

        const size =
            print.size;

            
        /* =========================
           Custom Quote Sizes
        ========================== */

        if (
            size === "Square"
            || size === "Pano"
        ) {

            hasCustomQuote = true;

            return;

        }

        const itemPrice =
            priceGroup[size];

        if (itemPrice) {

            total += itemPrice;

        }

    });

    const pricingTotal =
        document.getElementById(
            "pricingTotal"
        );

    const pricingDisclaimer =
        document.getElementById(
            "pricingDisclaimer"
        );

    pricingTotal.textContent =
        `£${total}`;

    if (hasCustomQuote) {

        pricingDisclaimer.style.display =
            "block";

    } else {

        pricingDisclaimer.style.display =
            "none";

    }

}

/* =========================
   Shipping Pricing
========================= */

const shippingPricing = {

    uk: {
        unframed: 6.45,
        framed: 15
    },

    europe: {
        unframed: 15,
        framed: 30
    },

    world: {
        unframed: 20,
        framed: 40
    }

};

/* =========================
   Shipping Logic
========================= */

function calculateShipping() {

    const shippingSelect =
        document.getElementById(
            "shippingRegion"
        );

    if (!shippingSelect) return;

    const region =
        shippingSelect.value;

    const rates =
        shippingPricing[region];

    if (!rates) return;

    let shippingTotal = 0;

    let framedCount = 0;

    let hasUnframed = false;

    selectedPrints.forEach(print => {

        const isFramed =
            print.frame !== "Unframed";

        if (isFramed) {

            framedCount++;

        } else {

            hasUnframed = true;

        }

    });

    /* =========================
       Unframed Shipping
    ========================== */

    if (hasUnframed) {

        shippingTotal +=
            rates.unframed;

    }

    /* =========================
       Framed Shipping
    ========================== */

    shippingTotal +=
        framedCount * rates.framed;

    /* =========================
       Print Total
    ========================== */

    let printTotal = 0;

    selectedPrints.forEach(print => {

        const isFramed =
            print.frame !== "Unframed";

        const priceGroup =
            isFramed
                ? pricing.framed
                : pricing.unframed;

        if (
            print.size === "Square"
            || print.size === "Pano"
        ) return;

        printTotal +=
            priceGroup[print.size] || 0;

    });

    /* =========================
       Update UI
    ========================== */

    const shippingTotalEl =
        document.getElementById(
            "shippingTotal"
        );

    const grandTotalEl =
        document.getElementById(
            "grandTotal"
        );

    if (shippingTotalEl) {

        shippingTotalEl.textContent =
            `£${shippingTotal.toFixed(2)}`;

    }

    if (grandTotalEl) {

        grandTotalEl.textContent =
            `£${(
                printTotal + shippingTotal
            ).toFixed(2)}`;

    }

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

                const matchingImage =
                images.find(
                    img =>
                        img.title === print.title
                );
            
            const availableSizes =
                matchingImage?.sizes || [
                    print.size
                ];
            
            const sizeOptions =
                availableSizes.map(size => {

                    return `
                        <option
                            value="${size}"
                            ${
                                print.size === size
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${size}
                        </option>
                    `;

                }).join("");

                let itemPrice = "Custom Quote";

const isFramed =
    print.frame !== "Unframed";

if (
    print.size !== "Square"
    && print.size !== "Pano"
) {

    itemPrice =
        isFramed
            ? `£${pricing.framed[print.size]}`
            : `£${pricing.unframed[print.size]}`;

}

                item.innerHTML = `
                <img src="${print.src}">

                <div class="selected-print-info">

                    <h3>
                        ${print.title}
                    </h3>

                    <p class="selected-print-price">
                        ${itemPrice}
                    </p>

                    <label>
                        Size
                    </label>

                    <select
                        class="edit-size"
                        data-index="${index}"
                    >
                        ${sizeOptions}
                    </select>

                    <label>
                        Frame
                    </label>

                    <select
                        class="edit-frame"
                        data-index="${index}"
                    >
                        <option ${
                            print.frame ===
                            "Unframed"
                                ? "selected"
                                : ""
                        }>
                            Unframed
                        </option>

                        <option ${
                            print.frame ===
                            "Black Frame"
                                ? "selected"
                                : ""
                        }>
                            Black Frame
                        </option>

                        <option ${
                            print.frame ===
                            "White Frame"
                                ? "selected"
                                : ""
                        }>
                            White Frame
                        </option>

                        <option ${
                            print.frame ===
                            "Oak Frame"
                                ? "selected"
                                : ""
                        }>
                            Oak Frame
                        </option>

                    </select>

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

    calculatePricing();

    calculateShipping();

    renderSelectedPrints();

    printModal.classList.add(
        "active"
    );

}

openPrintModalBtn.addEventListener(
    "click",
    openPrintModal
);

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

            saveSelections();

            renderSelectedPrints();

            updateSelectionTray();

            calculatePricing();

            calculateShipping();

            renderSelectedPrints();

        }

    }
);

/* =========================
   Update Print Options
========================= */

selectedPrintsContainer.addEventListener(
    "change",
    e => {

        const index =
            parseInt(
                e.target.dataset.index
            );

        if (
            e.target.classList.contains(
                "edit-size"
            )
        ) {

            selectedPrints[index].size =
                e.target.value;

                saveSelections();

                calculatePricing();

                calculateShipping();

                renderSelectedPrints();

        }

        // if (
        //     e.target.classList.contains(
        //         "edit-finish"
        //     )
        // ) {

        //     selectedPrints[index].finish =
        //         e.target.value;

        //         saveSelections();

        // }

        if (
            e.target.classList.contains(
                "edit-frame"
            )
        ) {
        
            selectedPrints[index].frame =
                e.target.value;
        
            saveSelections();
        
            calculatePricing();

            calculateShipping();
        
            renderSelectedPrints();
        
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

document.addEventListener(
    "change",
    e => {

        if (
            e.target.id ===
            "shippingRegion"
        ) {

            calculateShipping();

        }

    }
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
            selectedPrints.map(
                print => {

                    return `
                    Image: ${print.title}
                    Size: ${print.size}
                    Frame: ${print.frame}
                    `;

                }
            ).join(
                "\n----------------\n"
            );

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

            selectedPrints = [];

            saveSelections();

            renderSelectedPrints();

            updateSelectionTray();

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

updateSelectionTray();

loadGallery();
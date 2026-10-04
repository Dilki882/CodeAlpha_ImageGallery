/* =====================================================
   PIXELVAULT - PROFESSIONAL IMAGE GALLERY
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
       ================================================= */

    const galleryItems = Array.from(
        document.querySelectorAll(".gallery-item")
    );

    const filterButtons = document.querySelectorAll(".filter-btn");

    const searchInput = document.getElementById("searchInput");

    const noResults = document.getElementById("noResults");

    const lightbox = document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxTitle =
        document.getElementById("lightboxTitle");

    const lightboxCategory =
        document.getElementById("lightboxCategory");

    const lightboxClose =
        document.getElementById("lightboxClose");

    const lightboxPrev =
        document.getElementById("lightboxPrev");

    const lightboxNext =
        document.getElementById("lightboxNext");

    const favoriteBtn =
        document.getElementById("favoriteBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const themeToggle =
        document.getElementById("themeToggle");

    const menuBtn =
        document.getElementById("menuBtn");

    const navLinks =
        document.querySelector(".nav-links");


    /* =================================================
       VARIABLES
       ================================================= */

    let currentImageIndex = 0;

    let currentVisibleItems = [...galleryItems];

    let currentCategory = "all";

    let currentSearch = "";

    let favorites =
        JSON.parse(localStorage.getItem("pixelVaultFavorites")) || [];


    /* =================================================
       NAVIGATION MENU
       ================================================= */

    if (menuBtn) {

        menuBtn.addEventListener("click", () => {

            navLinks.classList.toggle("open");

            if (navLinks.classList.contains("open")) {

                menuBtn.textContent = "×";

            } else {

                menuBtn.textContent = "☰";

            }

        });

    }


    /* Close mobile menu when link clicked */

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuBtn.textContent = "☰";

        });

    });


    /* =================================================
       DARK / LIGHT MODE
       ================================================= */

    const savedTheme =
        localStorage.getItem("pixelVaultTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";

    }


    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        if (isLight) {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "pixelVaultTheme",
                "light"
            );

        } else {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "pixelVaultTheme",
                "dark"
            );

        }

    });


    /* =================================================
       FILTER GALLERY
       ================================================= */

    function filterGallery() {

        const searchTerm =
            currentSearch.toLowerCase().trim();

        currentVisibleItems = galleryItems.filter(item => {

            const category =
                item.dataset.category.toLowerCase();

            const title =
                item.dataset.title.toLowerCase();

            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;

            const searchMatch =
                title.includes(searchTerm) ||
                category.includes(searchTerm);

            return categoryMatch && searchMatch;

        });


        /* Show / hide items */

        galleryItems.forEach(item => {

            if (currentVisibleItems.includes(item)) {

                item.style.display = "";

                setTimeout(() => {

                    item.style.animation =
                        "galleryReveal 0.5s ease both";

                }, 10);

            } else {

                item.style.display = "none";

            }

        });


        /* No results message */

        if (currentVisibleItems.length === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }


    /* =================================================
       CATEGORY FILTER BUTTONS
       ================================================= */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            currentCategory =
                button.dataset.filter;

            filterGallery();

        });

    });


    /* =================================================
       SEARCH
       ================================================= */

    searchInput.addEventListener("input", () => {

        currentSearch =
            searchInput.value;

        filterGallery();

    });


    /* =================================================
       OPEN LIGHTBOX
       ================================================= */

    function openLightbox(item) {

        currentImageIndex =
            currentVisibleItems.indexOf(item);

        if (currentImageIndex === -1) {

            currentVisibleItems =
                galleryItems.filter(
                    galleryItem =>
                        galleryItem.style.display !== "none"
                );

            currentImageIndex =
                currentVisibleItems.indexOf(item);

        }

        updateLightbox();

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    /* =================================================
       UPDATE LIGHTBOX
       ================================================= */

    function updateLightbox() {

        if (
            !currentVisibleItems.length ||
            currentImageIndex < 0
        ) {

            return;

        }


        const item =
            currentVisibleItems[currentImageIndex];

        const image =
            item.querySelector("img");


        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt;


        lightboxTitle.textContent =
            item.dataset.title;


        lightboxCategory.textContent =
            item.dataset.category;


        updateFavoriteButton();

    }


    /* =================================================
       GALLERY IMAGE CLICK
       ================================================= */

    galleryItems.forEach(item => {

        const viewButton =
            item.querySelector(".view-btn");

        item.addEventListener("click", event => {

            /*
             Prevent duplicate click when
             clicking the view button.
            */

            event.stopPropagation();

            openLightbox(item);

        });


        if (viewButton) {

            viewButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openLightbox(item);

                }
            );

        }

    });


    /* =================================================
       CLOSE LIGHTBOX
       ================================================= */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

    }


    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    /* Click outside image */

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    /* =================================================
       NEXT IMAGE
       ================================================= */

    function nextImage() {

        if (!currentVisibleItems.length) {
            return;
        }

        currentImageIndex++;

        if (
            currentImageIndex >=
            currentVisibleItems.length
        ) {

            currentImageIndex = 0;

        }

        updateLightbox();

    }


    /* =================================================
       PREVIOUS IMAGE
       ================================================= */

    function previousImage() {

        if (!currentVisibleItems.length) {
            return;
        }

        currentImageIndex--;

        if (currentImageIndex < 0) {

            currentImageIndex =
                currentVisibleItems.length - 1;

        }

        updateLightbox();

    }


    lightboxNext.addEventListener(
        "click",
        nextImage
    );


    lightboxPrev.addEventListener(
        "click",
        previousImage
    );


    /* =================================================
       KEYBOARD NAVIGATION
       ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (!lightbox.classList.contains("active")) {

                return;

            }


            switch (event.key) {

                case "ArrowRight":

                    nextImage();

                    break;


                case "ArrowLeft":

                    previousImage();

                    break;


                case "Escape":

                    closeLightbox();

                    break;

            }

        }
    );


    /* =================================================
       FAVORITE SYSTEM
       ================================================= */

    function getImageId(item) {

        return (
            item.dataset.category +
            "-" +
            item.dataset.title
        );

    }


    function updateFavoriteButton() {

        if (!currentVisibleItems.length) {
            return;
        }


        const item =
            currentVisibleItems[currentImageIndex];

        const imageId =
            getImageId(item);


        if (favorites.includes(imageId)) {

            favoriteBtn.textContent = "♥";

            favoriteBtn.classList.add("liked");

        } else {

            favoriteBtn.textContent = "♡";

            favoriteBtn.classList.remove("liked");

        }

    }


    favoriteBtn.addEventListener("click", () => {

        if (!currentVisibleItems.length) {
            return;
        }


        const item =
            currentVisibleItems[currentImageIndex];

        const imageId =
            getImageId(item);


        if (favorites.includes(imageId)) {

            favorites =
                favorites.filter(
                    id => id !== imageId
                );

        } else {

            favorites.push(imageId);

        }


        localStorage.setItem(
            "pixelVaultFavorites",
            JSON.stringify(favorites)
        );


        updateFavoriteButton();

    });


    /* =================================================
       DOWNLOAD IMAGE
       ================================================= */

    downloadBtn.addEventListener("click", () => {

        if (!currentVisibleItems.length) {
            return;
        }


        const item =
            currentVisibleItems[currentImageIndex];

        const image =
            item.querySelector("img");


        const link =
            document.createElement("a");


        link.href =
            image.src;


        link.download =
            item.dataset.title
                .toLowerCase()
                .replace(/\s+/g, "-") +
            ".jpg";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    });


    /* =================================================
       CATEGORY CARDS
       ================================================= */

    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category;


                    currentCategory =
                        category;


                    currentSearch = "";

                    searchInput.value = "";


                    filterButtons.forEach(
                        button => {

                            button.classList.remove(
                                "active"
                            );


                            if (
                                button.dataset.filter ===
                                category
                            ) {

                                button.classList.add(
                                    "active"
                                );

                            }

                        }
                    );


                    filterGallery();


                    document
                        .getElementById("gallery")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });


    /* =================================================
       SMOOTH ACTIVE NAVIGATION
       ================================================= */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    window.addEventListener(
        "scroll",
        () => {

            let currentSection = "";


            sections.forEach(section => {

                const sectionTop =
                    section.offsetTop - 150;


                if (
                    window.scrollY >= sectionTop
                ) {

                    currentSection =
                        section.getAttribute("id");

                }

            });


            document
                .querySelectorAll(".nav-links a")
                .forEach(link => {

                    link.classList.remove(
                        "active"
                    );


                    if (
                        link.getAttribute("href") ===
                        "#" + currentSection
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

        }
    );


    /* =================================================
       IMAGE ERROR HANDLING
       ================================================= */

    galleryItems.forEach(item => {

        const image =
            item.querySelector("img");


        image.addEventListener(
            "error",
            () => {

                item.classList.add(
                    "image-error"
                );

                image.alt =
                    "Image unavailable";

            }
        );

    });


    /* =================================================
       PREVENT LIGHTBOX IMAGE DRAG
       ================================================= */

    lightboxImage.addEventListener(
        "dragstart",
        event => {

            event.preventDefault();

        }
    );


    /* =================================================
       INITIALIZE
       ================================================= */

    filterGallery();

});
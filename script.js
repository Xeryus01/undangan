/* ================== FIRESTORE INITIALIZATION ================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB_FrZNb1q2fPl8RI9mSIb8zKZzchOWOR8",
    authDomain: "undangan-zila.firebaseapp.com",
    projectId: "undangan-zila",
    storageBucket: "undangan-zila.firebasestorage.app",
    messagingSenderId: "663200651385",
    appId: "1:663200651385:web:26b9c700b32de7c27f1ca8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GANTI URL BERIKUT DENGAN WEB APP URL HASIL DEPLOY APPS SCRIPT (jika tidak digunakan, abaikan)
const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZa2BeDatvUkt2PXDTzkAbX8QH3ItbjLdR99BIIBhgER-KU2-cYyla03mybuDCbFYj/exec";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => { window.scrollTo(0, 0); });

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || "";
}
(function fillGuestName() {
    const name = getQueryParam("to");
    const el = document.getElementById("guestNameCover");
    if (el) el.textContent = name ? name : "Bapak/Ibu/Saudara/i";
})();

const cover = document.getElementById("cover");
const btnOpenCover = document.getElementById("btnOpenCover");
const bgm = document.getElementById("bgm");
const fabMusicLabel = document.getElementById("fabMusicLabel");
let bgmStarted = false;

if (btnOpenCover) {
    btnOpenCover.addEventListener("click", () => {
        // Hide cover
        if (cover) {
            cover.style.display = "none";
        }
        
        // Unlock body
        document.body.classList.remove("locked");
        document.body.classList.add("unlocked");
        
        // Scroll to hero section
        const hero = document.getElementById("hero");
        if (hero) {
            hero.scrollIntoView({ behavior: "smooth" });
        }

        // Try to play background music (with user interaction)
        if (bgm && !bgmStarted) {
            bgm.volume = 0.8;
            bgm.play().then(() => {
                bgmStarted = true;
                if (fabMusicLabel) {
                    fabMusicLabel.textContent = "Musik Menyala";
                }
            }).catch((error) => {
                console.log("Audio play failed:", error);
                // Music will be handled by the music toggle button instead
            });
        }
    });
}

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

document.querySelectorAll(".nav-links button[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-scroll");
        const el = document.querySelector(target);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
        if (navLinks && window.innerWidth <= 768) {
            navLinks.classList.remove("open");
        }
    });
});

const fabRSVP = document.getElementById("fabRSVP");
if (fabRSVP) {
    fabRSVP.addEventListener("click", () => {
        const rsvp = document.getElementById("rsvp");
        if (rsvp) {
            rsvp.scrollIntoView({ behavior: "smooth" });
        }
    });
}
const fabMusic = document.getElementById("fabMusic");
if (fabMusic) {
    fabMusic.addEventListener("click", () => {
        if (!bgm) return;
        if (bgm.paused) {
            bgm.play().then(() => {
                bgmStarted = true;
                if (fabMusicLabel) {
                    fabMusicLabel.textContent = "Musik Menyala";
                }
            }).catch((error) => {
                console.log("Audio play failed:", error);
            });
        } else {
            bgm.pause();
            bgmStarted = false;
            if (fabMusicLabel) {
                fabMusicLabel.textContent = "Musik Dimatikan";
            }
        }
    });
}

const backToTop = document.getElementById("backToTop");
if (backToTop) {
    backToTop.addEventListener("click", () => {
        const hero = document.getElementById("hero");
        if (hero) {
            hero.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// Reveal on scroll
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
        });
    },
    { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("show"));
}

// Countdown
(function initCountdown() {
    const targetDate = new Date("2026-03-29T08:00:00+07:00");
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");
    const finishMsg = document.getElementById("countdown-finish");
    const countdownBox = document.getElementById("countdown");
    let timer;

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();
        if (diff <= 0) {
            if (countdownBox) countdownBox.style.display = "none";
            if (finishMsg) finishMsg.style.display = "block";
            if (timer) clearInterval(timer);
            return;
        }
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    }
    
    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
})();

// Salin teks (rekening / alamat)
document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-copy-target");
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const text = targetEl.innerText || targetEl.textContent || "";
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const temp = document.createElement("textarea");
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }

    const original = btn.innerHTML;
    btn.innerHTML = "✅ Tersalin";
    setTimeout(() => { btn.innerHTML = original; }, 1500);
    });
});

/* ================== LOVE STORY CAROUSEL ================== */
/* ==================== LOVE STORY CAROUSEL + PROGRESS ==================== */
(function () {
    const slides  = Array.from(document.querySelectorAll('.story-slide'));
    const dots    = Array.from(document.querySelectorAll('.story-dot'));
    const btnPrev = document.getElementById('storyPrev');
    const btnNext = document.getElementById('storyNext');

    // PROGRESS: line + teks step
    const progressFill  = document.getElementById('storyProgressFill');
    const stepLabels    = Array.from(document.querySelectorAll('.story-progress-step'));

    if (!slides.length) return;

    const totalSlides = slides.length;        // harus sama jumlahnya dengan step dan dot
    let currentIndex  = 0;
    let isAnimating   = false;

    // Helper: bersihkan class animasi pada satu slide
    function resetSlideClasses(slide) {
    slide.classList.remove(
        'active',
        'enter-from-right',
        'enter-from-left',
        'exit-to-left',
        'exit-to-right'
    );
    }

    // UPDATE SEMUA STATE (slide, dot, step, progress bar)
    function updateStoryState() {
    // pastikan index selalu loop
    currentIndex = (currentIndex + totalSlides) % totalSlides;

    // slide aktif
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });

    // dot indikator (kalau ada)
    if (dots.length) {
        dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        });
    }

    // label step (Awal, Pertemuan, dst)
    if (stepLabels.length) {
        stepLabels.forEach((step, i) => {
        step.classList.toggle('active', i === currentIndex);
        });
    }

    // progress bar (0% di langkah pertama, 100% di langkah terakhir)
    if (progressFill && totalSlides > 1) {
        const percent = (currentIndex / (totalSlides - 1)) * 100;  // 0, 25, 50, 75, 100
        progressFill.style.width = percent + '%';
        progressFill.setAttribute('aria-valuenow', String(currentIndex + 1));
        progressFill.setAttribute('aria-valuemax', String(totalSlides));
    }
    }

    // ANIMASI PINDAH SLIDE
    function goToStory(targetIndex, direction) {
    if (isAnimating || !slides.length) return;
    isAnimating = true;

    const oldIndex = currentIndex;
    const newIndex = (targetIndex + totalSlides) % totalSlides; // loop

    if (oldIndex === newIndex) {
        isAnimating = false;
        return;
    }

    const oldSlide = slides[oldIndex];
    const newSlide = slides[newIndex];

    resetSlideClasses(oldSlide);
    resetSlideClasses(newSlide);

    // posisi awal slide baru + arah animasi
    if (direction === 'next') {
        oldSlide.classList.add('active', 'exit-to-left');
        newSlide.classList.add('enter-from-right');
    } else {
        oldSlide.classList.add('active', 'exit-to-right');
        newSlide.classList.add('enter-from-left');
    }

    // paksa reflow supaya animasi kebaca
    void newSlide.offsetWidth;

    newSlide.classList.add('active');

    setTimeout(() => {
        resetSlideClasses(oldSlide);
        newSlide.classList.remove(
        'enter-from-right',
        'enter-from-left',
        'exit-to-left',
        'exit-to-right'
        );
        newSlide.classList.add('active');

        currentIndex = newIndex;
        updateStoryState();
        isAnimating = false;
    }, 450); // sama dengan durasi transition di CSS
    }

    // TOMBOL NEXT / PREV
    if (btnNext) {
    btnNext.addEventListener('click', () => {
        goToStory(currentIndex + 1, 'next');
    });
    }
    if (btnPrev) {
    btnPrev.addEventListener('click', () => {
        goToStory(currentIndex - 1, 'prev');
    });
    }

    // KLIK DOT (bawah slide bulat-bulat)
    if (dots.length) {
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
        if (i === currentIndex) return;
        const direction = i > currentIndex ? 'next' : 'prev';
        goToStory(i, direction);
        });
    });
    }

    // KLIK STEP TEKS ("Awal", "Pertemuan", dst)
    if (stepLabels.length) {
    stepLabels.forEach((step, i) => {
        step.addEventListener('click', () => {
        if (i === currentIndex) return;
        const direction = i > currentIndex ? 'next' : 'prev';
        goToStory(i, direction);
        });
    });
    }

    // SWIPE (HP)
    let startX = 0;
    let isTouching = false;

    function handleTouchStart(e) {
    isTouching = true;
    startX = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
    if (!isTouching) return;
    // bisa ditambah efek drag kalau mau
    }

    function handleTouchEnd(e) {
    if (!isTouching) return;
    isTouching = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > 40) {
        if (diffX < 0) {
        goToStory(currentIndex + 1, 'next'); // swipe kiri → next
        } else {
        goToStory(currentIndex - 1, 'prev'); // swipe kanan → prev
        }
    }
    }

    const storyTrack = document.querySelector('.story-track');
    if (storyTrack) {
    storyTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
    storyTrack.addEventListener('touchmove', handleTouchMove, { passive: true });
    storyTrack.addEventListener('touchend', handleTouchEnd);
    }

    // INIT PERTAMA
    updateStoryState();
})();


/* ================== RSVP & REKAP ================== */
const rsvpSummary = { hadir: 0, belum: 0, tidak: 0 };

function renderRsvpSummary() {
    const hadirEl = document.getElementById("rsvpSumHadir");
    const belumEl = document.getElementById("rsvpSumBelum");
    const tidakEl = document.getElementById("rsvpSumTidak");
    const totalEl = document.getElementById("rsvpSumTotal");

    if (!hadirEl) return;

    hadirEl.textContent = rsvpSummary.hadir;
    belumEl.textContent = rsvpSummary.belum;
    tidakEl.textContent = rsvpSummary.tidak;

    const total = rsvpSummary.hadir + rsvpSummary.belum + rsvpSummary.tidak;
    totalEl.textContent = total;
}

async function loadRsvpSummaryFromServer() {
    try {
        const q = query(collection(db, "entries"), where("type", "==", "rsvp"));
        const snapshot = await getDocs(q);
        
        rsvpSummary.hadir = 0;
        rsvpSummary.belum = 0;
        rsvpSummary.tidak = 0;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const jumlah = parseInt(data.jumlah || 1, 10);
            
            if (data.status === "Insya Allah Hadir") rsvpSummary.hadir += jumlah;
            else if (data.status === "Belum Pasti") rsvpSummary.belum += jumlah;
            else if (data.status === "Maaf Tidak Bisa Hadir") rsvpSummary.tidak += jumlah;
        });
        
        renderRsvpSummary();
    } catch (err) {
        renderRsvpSummary();
    }
}

document.getElementById("rsvpForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value.trim();
    const phone = document.getElementById("rsvpPhone").value.trim();
    const status = document.getElementById("rsvpStatus").value;
    const guests = document.getElementById("rsvpGuests").value || "1";
    const msg = document.getElementById("rsvpMessage").value.trim();
    const statusMsg = document.getElementById("rsvpStatusMsg");
    if (!name) return;

    statusMsg.textContent = "Mengirim data RSVP.";

    try {
        // Save to Firestore (PRIMARY source)
        await addDoc(collection(db, "entries"), {
            type: "rsvp",
            nama: name,
            whatsapp: phone,
            status: status,
            jumlah: parseInt(guests, 10),
            ucapan: msg,
            createdAt: new Date().toISOString()
        });

        statusMsg.textContent = "RSVP berhasil dikirim. Terima kasih 🙏";

        // Update ringkas lokal - tambahkan berdasarkan jumlah tamu
        const guestCount = parseInt(guests, 10);
        if (status === "Insya Allah Hadir") rsvpSummary.hadir += guestCount;
        else if (status === "Belum Pasti") rsvpSummary.belum += guestCount;
        else if (status === "Maaf Tidak Bisa Hadir") rsvpSummary.tidak += guestCount;
        renderRsvpSummary();

        this.reset();
    } catch (err) {
        statusMsg.textContent = "Gagal mengirim RSVP. Mohon coba lagi beberapa saat.";
    }
});

/* ================== GUESTBOOK ================== */
const guestListEl = document.getElementById("guestList");

function formatDate(isoString) {
    if (!isoString) return "";
    
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const date = new Date(isoString);
    const dayName = days[date.getUTCDay()];
    const dayNum = date.getUTCDate();
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

function renderGuestEmpty() {
    guestListEl.innerHTML = '<div class="guest-empty">Belum ada ucapan yang masuk. Jadilah yang pertama mengirimkan doa terbaik untuk kedua mempelai. 🤍</div>';
}

function addGuestCard(item, prepend = false) {
    const div = document.createElement("div");
    div.className = "guest-card";
    const initial = (item.nama || "?").trim().charAt(0).toUpperCase();
    const waktu = item.waktu ? formatDate(item.waktu) : "";
    div.innerHTML = `
    <div class="guest-card-header">
        <div class="guest-avatar">${initial || "🤍"}</div>
        <div class="guest-card-meta-wrap">
        <div class="guest-card-name">${item.nama || "Tamu"}</div>
        <div class="guest-card-meta">
            ${(item.hubungan || "Tamu Undangan")}${waktu ? " • " + waktu : ""}
        </div>
        </div>
    </div>
    <div class="guest-quote">${item.ucapan || ""}</div>
    `;
    if (prepend && guestListEl.firstChild) {
    guestListEl.insertBefore(div, guestListEl.firstChild);
    } else {
    guestListEl.appendChild(div);
    }
}

async function loadGuestbook() {
    try {
        // Query ALL entries ordered by createdAt (terbaru dulu)
        const qAllEntries = query(
            collection(db, "entries"),
            orderBy("createdAt", "desc")
        );
        
        const snapshot = await getDocs(qAllEntries);
        
        // Filter entries yang punya ucapan
        let allEntries = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            // Ambil semua yang punya field ucapan dan tidak kosong
            if (data.ucapan && data.ucapan.trim()) {
                allEntries.push({
                    nama: data.nama || "Tamu",
                    hubungan: data.hubungan || "Tamu Undangan",
                    ucapan: data.ucapan,
                    waktu: data.createdAt || "",
                    createdAt: new Date(data.createdAt || 0).getTime()
                });
            }
        });
        
        guestListEl.innerHTML = "";
        
        if (!allEntries.length) {
            renderGuestEmpty();
            return;
        }
        
        allEntries.forEach(entry => {
            addGuestCard({
                nama: entry.nama,
                hubungan: entry.hubungan,
                ucapan: entry.ucapan,
                waktu: entry.waktu
            });
        });
        
    } catch (err) {
        renderGuestEmpty();
    }
}

const guestFormEl = document.getElementById("guestForm");
if (guestFormEl) {
    guestFormEl.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nama = document.getElementById("guestName").value.trim();
        const hubungan = document.getElementById("guestRelation").value.trim();
        const ucapan = document.getElementById("guestMessage").value.trim();

        if (!nama || !ucapan) return;

        const hint = this.querySelector(".small-hint");
        if (hint) {
            hint.style.opacity = "1";
            hint.textContent = "Mengirim ucapan...";
        }

        try {
            // Save to Firestore (PRIMARY - only source)
            await addDoc(collection(db, "entries"), {
                type: "guestbook",
                nama,
                hubungan,
                ucapan,
                createdAt: new Date().toISOString()
            });

            if (hint) {
                hint.textContent = "Ucapan berhasil dikirim. Terima kasih 🤍";
                setTimeout(() => (hint.style.opacity = "0"), 1800);
            }

            addGuestCard(
                {
                    nama,
                    hubungan,
                    ucapan,
                    waktu: "Baru saja"
                },
                true
            );

            this.reset();

        } catch (err) {
            if (hint) {
                hint.textContent = "Gagal mengirim ucapan. Mohon coba lagi.";
                hint.style.opacity = "1";
            }
        }
    });
}

/* ================== GALLERY LIGHTBOX ================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxZoom = document.getElementById("lightboxZoom");
const lightboxCurrent = document.getElementById("lightboxCurrent");
const lightboxTotal = document.getElementById("lightboxTotal");
const lightboxLoading = document.querySelector(".lightbox-loading");
const lightboxSwipeHint = document.getElementById("lightboxSwipeHint");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item img"));
let currentGalleryIndex = 0;
let isZoomed = false;

function updateCounter() {
    if (lightboxCurrent && lightboxTotal) {
        lightboxCurrent.textContent = currentGalleryIndex + 1;
        lightboxTotal.textContent = galleryItems.length;
    }
}

function showLoading() {
    if (lightboxLoading) {
        lightboxLoading.classList.add("active");
    }
}

function hideLoading() {
    if (lightboxLoading) {
        lightboxLoading.classList.remove("active");
    }
}

function openLightbox(index) {
    if (!galleryItems.length) return;
    if (index < 0 || index >= galleryItems.length) index = 0;
    currentGalleryIndex = index;
    isZoomed = false;

    // Show loading state
    showLoading();

    // Update counter
    updateCounter();

    // Preload image
    const img = new Image();
    img.onload = function() {
        lightboxImg.src = galleryItems[index].src;
        lightboxImg.classList.remove("zoomed");
        hideLoading();
    };
    img.src = galleryItems[index].src;

    // Show lightbox with animation
    lightbox.classList.add("open");
    document.body.classList.add("locked");

    // Show swipe hint for mobile/touch devices
    if (lightboxSwipeHint && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        lightboxSwipeHint.classList.add("show");
        setTimeout(() => {
            if (lightboxSwipeHint) {
                lightboxSwipeHint.classList.remove("show");
            }
        }, 3000); // Hide hint after 3 seconds
    }

    // Focus management
    if (lightboxClose) {
        lightboxClose.focus();
    }
}

function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("locked");
    isZoomed = false;
    lightboxImg.classList.remove("zoomed");
}

function nextGallery(delta) {
    if (!galleryItems.length) return;
    currentGalleryIndex = (currentGalleryIndex + delta + galleryItems.length) % galleryItems.length;

    // Show loading for next image
    showLoading();

    // Update counter
    updateCounter();

    // Preload and set new image
    const img = new Image();
    img.onload = function() {
        lightboxImg.src = galleryItems[currentGalleryIndex].src;
        lightboxImg.classList.remove("zoomed");
        isZoomed = false;
        hideLoading();
    };
    img.src = galleryItems[currentGalleryIndex].src;
}

function toggleZoom() {
    if (!lightboxImg.src) return;

    isZoomed = !isZoomed;
    lightboxImg.classList.toggle("zoomed");

    // Update zoom button icon (could be enhanced with different icons)
    if (lightboxZoom) {
        const icon = lightboxZoom.querySelector("svg");
        if (icon) {
            if (isZoomed) {
                // Change to zoom out icon
                icon.innerHTML = '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path><line x1="9" y1="9" x2="13" y2="13"></line>';
            } else {
                // Change to zoom in icon
                icon.innerHTML = '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path><line x1="13" y1="9" x2="9" y2="13"></line>';
            }
        }
    }
}

// Initialize gallery
galleryItems.forEach((img, idx) => {
    img.parentElement.addEventListener("click", () => openLightbox(idx));
});

// Event listeners
if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}
if (lightboxZoom) {
    lightboxZoom.addEventListener("click", toggleZoom);
}

// Click outside to close
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-backdrop")) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    switch (e.key) {
        case "Escape":
            closeLightbox();
            break;
        case "z":
        case "Z":
            toggleZoom();
            break;
    }
});

// Touch/swipe and mouse drag support
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
let dragThreshold = 50;

lightbox.addEventListener("touchstart", (e) => {
    if (isZoomed) return; // Don't allow swipe when zoomed
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isDragging = true;
});

lightbox.addEventListener("touchmove", (e) => {
    if (!isDragging || isZoomed) return;
    e.preventDefault(); // Prevent scrolling
});

lightbox.addEventListener("touchend", (e) => {
    if (!isDragging || isZoomed) return;
    
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > dragThreshold && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
            nextGallery(1); // Swipe left - next image
        } else {
            nextGallery(-1); // Swipe right - previous image
        }
    }
    
    isDragging = false;
});

// Mouse drag support for desktop
lightbox.addEventListener("mousedown", (e) => {
    if (isZoomed) return;
    touchStartX = e.screenX;
    touchStartY = e.screenY;
    isDragging = true;
    lightbox.style.cursor = 'grabbing';
});

lightbox.addEventListener("mousemove", (e) => {
    if (!isDragging || isZoomed) return;
    e.preventDefault();
});

lightbox.addEventListener("mouseup", (e) => {
    if (!isDragging || isZoomed) return;
    
    const mouseEndX = e.screenX;
    const mouseEndY = e.screenY;
    const diffX = touchStartX - mouseEndX;
    const diffY = Math.abs(touchStartY - mouseEndY);
    
    // Only trigger drag if horizontal movement is greater than vertical
    if (Math.abs(diffX) > dragThreshold && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
            nextGallery(1); // Drag left - next image
        } else {
            nextGallery(-1); // Drag right - previous image
        }
    }
    
    isDragging = false;
    lightbox.style.cursor = '';
});

// Prevent context menu on right click in lightbox
lightbox.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});


// Inisialisasi data dari server setelah DOM siap dan page fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Defer Firebase data loading to idle time
    if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => {
            loadRsvpSummaryFromServer();
            loadGuestbook();
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            loadRsvpSummaryFromServer();
            loadGuestbook();
        }, 1000);
    }
});
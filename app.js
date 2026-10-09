// 1. Tempelkan URL Apps Script kamu di dalam tanda kutip di bawah ini
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZWaipmMEUDncyBLGATlLF5BzmtTepe5HSw4WkfP0Qm0pI2UPKvcATWe2cR8BJfAnX/exec";

document.addEventListener("DOMContentLoaded", () => {
    // Read Guest Name from URL (?to=NamaTamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        const guestElement = document.getElementById('guest-name');
        if (guestElement) {
            guestElement.innerText = guestName;
        }
    }

    // Render Wishes from Google Sheets
    renderWishes();

    // Start Countdown Timer
    initCountdown();
});

// Fitur Open Cover & Play Music
function openInvitation() {
    const cover = document.getElementById('cover');
    if (cover) {
        cover.style.display = 'none';
    }
    const music = document.getElementById('bg-music');
    if (music) {
        music.play();
    }
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    if (music) {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    }
}

// Fitur Countdown Ke 11 Okt 2026 10:00:00
function initCountdown() {
    const targetDate = new Date('2026-10-11T10:00:00+07:00').getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff > 0) {
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (hoursEl) hoursEl.innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (minutesEl) minutesEl.innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (secondsEl) secondsEl.innerText = Math.floor((diff % (1000 * 60)) / 1000);
        }
    }, 1000);
}

// Copy Nomor Rekening ke Clipboard
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.innerText;
        element.innerText = "Tersalin";
        setTimeout(() => { element.innerText = originalText; }, 2000);
    });
}

// Simpan RSVP ke LocalStorage
function submitRSVP(e) {
    e.preventDefault();
    const nama = document.getElementById('rsvp-nama').value;
    const jumlah = document.getElementById('rsvp-jumlah').value;
    const hadir = document.querySelector('input[name="hadir"]:checked').value;

    const rsvpList = JSON.parse(localStorage.getItem('rsvp_list') || '[]');
    rsvpList.push({ nama, jumlah, hadir, date: new Date().toISOString() });
    localStorage.setItem('rsvp_list', JSON.stringify(rsvpList));

    alert("Terima kasih, konfirmasi kehadiran berhasil tersimpan!");
    document.getElementById('rsvpForm').reset();
}

// Send Best Wish to Google Sheets Database
function submitWish(e) {
    e.preventDefault();
    const namaInput = document.getElementById('wish-nama');
    const ucapanInput = document.getElementById('wish-ucapan');
    const btnKirim = document.querySelector('#wishesForm button');

    if (!namaInput || !ucapanInput) return;

    const nama = namaInput.value;
    const ucapan = ucapanInput.value;

    if (btnKirim) {
        btnKirim.innerText = "Mengirim...";
        btnKirim.disabled = true;
    }

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ nama: nama, ucapan: ucapan })
    })
    .then(res => res.json())
    .then(data => {
        alert("Terima kasih atas doa dan ucapannya!");
        document.getElementById('wishesForm').reset();
        if (btnKirim) {
            btnKirim.innerText = "KIRIM";
            btnKirim.disabled = false;
        }
        renderWishes();
    })
    .catch(err => {
        alert("Gagal mengirim ucapan, coba lagi nanti.");
        if (btnKirim) {
            btnKirim.innerText = "KIRIM";
            btnKirim.disabled = false;
        }
    });
}

// Fetch & Render Best Wishes from Google Sheets
function renderWishes() {
    const wishesContainer = document.getElementById('wishes-container');
    if (!wishesContainer) return;

    wishesContainer.innerHTML = "<p style='text-align:center;'>Memuat ucapan...</p>";

    fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(wishesList => {
        const countEl = document.getElementById('wishes-count');
        if (countEl) {
            countEl.innerText = `${wishesList.length} Wishes`;
        }
        
        if (!wishesList || wishesList.length === 0) {
            wishesContainer.innerHTML = "<p style='text-align:center;'>Belum ada ucapan.</p>";
            return;
        }

        wishesContainer.innerHTML = wishesList.map(w => `
            <div style="background:#fff; margin:10px 0; padding:12px; border-radius:8px; text-align:left; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <b style="color:#A98755; font-size:1.1rem;">${w.nama}</b>
                <p style="margin:6px 0; color:#333;">${w.ucapan}</p>
                <small style="color:#888;">${w.waktu}</small>
            </div>
        `).join('');
    })
    .catch(err => {
        wishesContainer.innerHTML = "<p style='text-align:center;'>Gagal memuat ucapan.</p>";
    });
}

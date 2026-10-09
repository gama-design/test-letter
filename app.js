document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil Nama Tamu dari URL (?to=NamaTamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guest-name').innerText = guestName;
    }

    // 2. Render Ucapan dari LocalStorage
    renderWishes();

    // 3. Jalankan Countdown Ke 11 Okt 2026
    initCountdown();
});

// Buka Cover & Putar Musik
function openInvitation() {
    document.getElementById('cover').style.display = 'none';
    const music = document.getElementById('bg-music');
    music.play();
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

// Hitung Mundur
function initCountdown() {
    const targetDate = new Date('2026-10-11T10:00:00+07:00').getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff > 0) {
            document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
            document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000);
        }
    }, 1000);
}

// Copy Nomor Rekening
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.innerText;
        element.innerText = "Tersalin";
        setTimeout(() => { element.innerText = originalText; }, 2000);
    });
}

// Form RSVP
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

// Form Best Wishes
function submitWish(e) {
    e.preventDefault();
    const nama = document.getElementById('wish-nama').value;
    const ucapan = document.getElementById('wish-ucapan').value;

    const wishesList = JSON.parse(localStorage.getItem('wishes_list') || '[]');
    wishesList.unshift({ nama, ucapan, date: "Baru saja" });
    localStorage.setItem('wishes_list', JSON.stringify(wishesList));

    document.getElementById('wishesForm').reset();
    renderWishes();
}

function renderWishes() {
    const wishesContainer = document.getElementById('wishes-container');
    const wishesList = JSON.parse(localStorage.getItem('wishes_list') || '[]');

    document.getElementById('wishes-count').innerText = `${wishesList.length} Wishes`;
    
    wishesContainer.innerHTML = wishesList.map(w => `
        <div style="background:#fff; margin:10px 0; padding:10px; border-radius:8px; text-align:left;">
            <b style="color:#A98755;">${w.nama}</b>
            <p style="margin:5px 0;">${w.ucapan}</p>
        </div>
    `).join('');
}

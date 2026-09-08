// =========================================
// APP
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================



// =========================================
// NAVIGASI HALAMAN
// =========================================

function bukaHalaman(namaHalaman) {

    // Sembunyikan semua halaman
    document.querySelectorAll(".halaman").forEach(function(halaman) {

        halaman.classList.remove("aktif");

    });


    // Tampilkan dashboard
    if (namaHalaman === "dashboard") {

    document.querySelector(".content").style.display = "block";

    initDashboard();

    return;

}


    // Sembunyikan dashboard
    document.querySelector(".content").style.display = "none";


    // Cari halaman
    const halaman = document.getElementById(
        "halaman-" + namaHalaman
    );


    // Tampilkan halaman
    if (halaman) {

        halaman.classList.add("aktif");

    }

// =====================================
// HALAMAN KAS
// =====================================

if (namaHalaman === "kas") {

    loadDanTampilKas();

}

// =====================================
// HALAMAN BANK
// =====================================

if (namaHalaman === "bank") {

    loadDanTampilBank();

}

// =====================================
// HALAMAN DANA
// =====================================

if (namaHalaman === "dana") {

    loadDanTampilDana();

}

// =====================================
// HALAMAN PIUTANG
// =====================================

if (namaHalaman === "piutang") {

    loadDanTampilPiutang();

}

// =====================================
// HALAMAN UTANG
// =====================================

if (namaHalaman === "utang") {

    loadDanTampilUtang();
}

// =====================================
// HALAMAN ASET
// =====================================

if (namaHalaman === "aset") {

    loadDanTampilAset();

}

// =====================================
// HALAMAN MODAL
// =====================================

if (namaHalaman === "modal") {

    loadDanTampilModal();

}

// =====================================
// HALAMAN LAPORAN
// =====================================

if (namaHalaman === "laporan") {

    siapkanHalamanLaporan();

}

// =====================================
// HALAMAN TUTUP BUKU
// =====================================

if (namaHalaman === "tutup-buku") {

    siapkanHalamanTutupBuku();

}

// =====================================
// HALAMAN MASTER DATA
// =====================================

if (namaHalaman === "master-data") {

    siapkanHalamanMasterData();

}

}


// =========================================
// FORM TRANSAKSI
// =========================================

function tampilFormTransaksi(jenis) {

    // Sembunyikan semua form
    document
        .querySelectorAll(".form-transaksi")
        .forEach(function(form) {

            form.classList.remove("aktif");

        });


    // Cari form yang dipilih
    const form = document.getElementById(
        "form-" + jenis
    );


    if (form) {

        form.classList.add("aktif");

    }


    // Jika pemasukan
    if (jenis === "pemasukan") {

        setTanggalPemasukan();
		
		loadDanTampilPemasukan();

    }
	
	if (jenis === "pengeluaran") {

    siapkanFormPengeluaran();
	
	loadDanTampilPengeluaran();

}

if (jenis === "transfer") {

    siapkanFormTransfer();
	loadDanTampilTransfer();
}

}


// =========================================
// APLIKASI SIAP
// =========================================

console.log("Aplikasi Keuangan BUMDes siap.");

console.log("Unit usaha:", UNIT_USAHA);

console.log("Media uang:", MEDIA_UANG);

console.log(
    "Format:",
    formatRupiah(1500000)
);

console.log(
    "Tanggal:",
    tanggalHariIni()
);

console.log(
    "Konfigurasi:",
    APP_CONFIG
);

// =========================================
// INIT DASHBOARD
// =========================================

window.addEventListener(
    "load",
    function() {

        if (
            typeof initDashboard ===
            "function"
        ) {

            initDashboard();

        }

    }
);

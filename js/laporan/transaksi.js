// =========================================
// TRANSAKSI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// TUGAS FILE:
// - Mengatur proses laporan transaksi
// - Mengambil periode laporan
// - Memanggil Firebase
// - Menyerahkan data ke laporan.ui.js
//
// TIDAK MEMBUAT HTML LAPORAN
//
// =========================================


// =========================================
// TAMPIL LAPORAN TRANSAKSI
// =========================================

async function tampilTransaksi() {

    try {

        // =====================================
        // AMBIL PERIODE
        // =====================================

        const periode =
            ambilPeriodeLaporan();


        if (!periode) {

            console.warn(
                "Periode laporan transaksi tidak tersedia."
            );

            return;

        }


        console.log(
            "Menampilkan Laporan Transaksi:",
            periode.dari,
            periode.sampai
        );


        // =====================================
        // AMBIL DATA FIREBASE
        // =====================================

        const data =
            await ambilLaporanTransaksiFirebase(
                periode.dari,
                periode.sampai
            );


        // =====================================
        // VALIDASI HASIL
        // =====================================

        if (!data) {

            throw new Error(
                "Data laporan transaksi tidak tersedia."
            );

        }


        console.log(
            "Data Laporan Transaksi:",
            data
        );


        // =====================================
        // TAMPILKAN MELALUI UI LAPORAN
        // =====================================

        if (
            typeof tampilkanTransaksiUI ===
            "function"
        ) {

            tampilkanTransaksiUI(
                data
            );

        }

        else if (
            typeof tampilTransaksiLaporan ===
            "function"
        ) {

            tampilTransaksiLaporan();

        }

        else {

            console.warn(
                "Fungsi tampilan transaksi tidak ditemukan."
            );

        }


    } catch (error) {

        console.error(
            "Tampilkan Laporan Transaksi gagal:",
            error
        );


        // =====================================
        // TAMPIL ERROR
        // =====================================

        if (
            typeof tampilErrorLaporan ===
            "function"
        ) {

            tampilErrorLaporan(
                "TRANSAKSI",
                error
            );

        }

    }

}


// =========================================
// ALIAS
// =========================================
//
// Digunakan bila laporan.ui.js memanggil
// tampilTransaksiLaporan()
//
// =========================================

async function tampilTransaksiLaporanData() {

    return await tampilTransaksi();

}


// =========================================
// SELESAI
// =========================================


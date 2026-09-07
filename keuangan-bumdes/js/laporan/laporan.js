// =========================================
// LAPORAN.JS
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// DATA GLOBAL LAPORAN
// =========================================

let PERIODE_LAPORAN = {

    dari: "",

    sampai: ""

};


// =========================================
// LAPORAN AKTIF
// =========================================

let JENIS_LAPORAN_AKTIF =
    "laba-rugi";


// =========================================
// SIAPKAN HALAMAN LAPORAN
// =========================================

function siapkanHalamanLaporan() {

    console.log(
        "Halaman Laporan siap."
    );


    const inputDari =
        document.getElementById(
            "laporanDari"
        );


    const inputSampai =
        document.getElementById(
            "laporanSampai"
        );


    // =====================================
    // TANGGAL HARI INI
    // =====================================

    const hariIni =
        tanggalHariIni();


    if (!hariIni) {

        console.error(
            "Tanggal hari ini tidak tersedia."
        );

        return;

    }


    // =====================================
    // TANGGAL AWAL BULAN
    // =====================================

    const awalBulan =
        hariIni.substring(0, 8) +
        "01";


    // =====================================
    // DEFAULT PERIODE
    // =====================================

    if (inputDari) {

        inputDari.value =
            awalBulan;

    }


    if (inputSampai) {

        inputSampai.value =
            hariIni;

    }


    // =====================================
    // SIMPAN PERIODE
    // =====================================

    ambilPeriodeLaporan();

}

// =========================================
// AMBIL PERIODE LAPORAN
// =========================================

function ambilPeriodeLaporan() {

    const inputDari =
        document.getElementById(
            "laporanDari"
        );


    const inputSampai =
        document.getElementById(
            "laporanSampai"
        );


    const dari =
        inputDari
            ? inputDari.value
            : "";


    const sampai =
        inputSampai
            ? inputSampai.value
            : "";


    // =====================================
    // VALIDASI
    // =====================================

    if (
        !dari ||
        !sampai
    ) {

        alert(
            "Tanggal periode laporan harus diisi."
        );

        return false;

    }


    if (
        dari > sampai
    ) {

        alert(
            "Tanggal awal tidak boleh lebih besar dari tanggal akhir."
        );

        return false;

    }


    // =====================================
    // SIMPAN PERIODE
    // =====================================

    PERIODE_LAPORAN = {

        dari:
            dari,

        sampai:
            sampai

    };


    // =====================================
    // KEMBALIKAN DATA PERIODE
    // =====================================

    return {

        dari:
            dari,

        sampai:
            sampai

    };

}

// =========================================
// GANTI JENIS LAPORAN
// =========================================

function tampilkanJenisLaporan(
    jenis
) {

    if (!jenis) {

        return;

    }


    JENIS_LAPORAN_AKTIF =
        jenis;


    tampilkanLaporan();

}


// =========================================
// TAMPILKAN LAPORAN
// =========================================

async function tampilkanLaporan() {

    // =====================================
    // VALIDASI PERIODE
    // =====================================

    if (
        !ambilPeriodeLaporan()
    ) {

        return;

    }


    // =====================================
    // AREA LAPORAN
    // =====================================

    const area =
        document.getElementById(
            "area-laporan"
        );


    if (!area) {

        console.error(
            "Element #area-laporan tidak ditemukan."
        );

        return;

    }


    try {

        // =================================
        // PILIH LAPORAN
        // =================================

        switch (
            JENIS_LAPORAN_AKTIF
        ) {


            // =============================
            // NERACA
            // =============================

            case "neraca":

                if (
                    typeof tampilNeraca !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilNeraca() tidak ditemukan."
                    );

                }


                await tampilNeraca();

                break;


            // =============================
            // LABA RUGI
            // =============================

            case "laba-rugi":

                if (
                    typeof tampilLabaRugi !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilLabaRugi() tidak ditemukan."
                    );

                }


                await tampilLabaRugi();

                break;


            // =============================
            // ARUS KAS
            // =============================

            case "arus-kas":

                if (
                    typeof tampilArusKas !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilArusKas() tidak ditemukan."
                    );

                }


                await tampilArusKas();

                break;


            // =============================
            // TRANSAKSI
            // =============================

            case "transaksi":

                if (
                    typeof tampilTransaksiLaporan !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilTransaksiLaporan() tidak ditemukan."
                    );

                }


                await tampilTransaksiLaporan();

                break;


            // =============================
            // PIUTANG
            // =============================

            case "piutang":

                if (
                    typeof tampilPiutangLaporan !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilPiutangLaporan() tidak ditemukan."
                    );

                }


                await tampilPiutangLaporan();

                break;


            // =============================
            // UTANG
            // =============================

            case "utang":

                if (
                    typeof tampilUtangLaporan !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilUtangLaporan() tidak ditemukan."
                    );

                }


                await tampilUtangLaporan();

                break;


            // =============================
            // ASET
            // =============================

            case "aset":

                if (
                    typeof tampilAsetLaporan !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilAsetLaporan() tidak ditemukan."
                    );

                }


                await tampilAsetLaporan();

                break;


            // =============================
            // MODAL
            // =============================

            case "modal":

                if (
                    typeof tampilModalLaporan !==
                    "function"
                ) {

                    throw new Error(
                        "Fungsi tampilModalLaporan() tidak ditemukan."
                    );

                }


                await tampilModalLaporan();

                break;


            // =============================
            // TIDAK DIKENAL
            // =============================

            default:

                throw new Error(
                    "Jenis laporan tidak dikenal: " +
                    JENIS_LAPORAN_AKTIF
                );

        }


    } catch (error) {

        console.error(
            "Tampilkan laporan gagal:",
            error
        );


        area.innerHTML = `

            <div class="kartu-laporan">

                <h3>
                    Laporan
                </h3>

                <p class="data-kosong">

                    Laporan gagal dimuat.

                </p>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// =========================================
// REFRESH LAPORAN
// =========================================

async function refreshLaporan() {

    await tampilkanLaporan();

}


// =========================================
// AMBIL PERIODE SAAT INI
// =========================================

function getPeriodeLaporan() {

    return {

        dari:
            PERIODE_LAPORAN.dari,

        sampai:
            PERIODE_LAPORAN.sampai

    };

}


// =========================================
// AMBIL JENIS LAPORAN AKTIF
// =========================================

function getJenisLaporanAktif() {

    return JENIS_LAPORAN_AKTIF;

}


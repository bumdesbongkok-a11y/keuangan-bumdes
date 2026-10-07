// =========================================
// DASHBOARD
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FORMAT RUPIAH
// =========================================

function formatRupiahDashboard(nilai) {

    const angka =
        Number(nilai) || 0;

    return "Rp " +
        angka.toLocaleString("id-ID");

}


// =========================================
// NAMA BULAN
// =========================================

const NAMA_BULAN_DASHBOARD = [

    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"

];


// =========================================
// PERIODE DEFAULT
// =========================================

function periodeDefaultDashboard() {

    const sekarang =
        new Date();

    return (
        sekarang.getFullYear() +
        "-" +
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0")
    );

}


// =========================================
// FORMAT TANGGAL
// =========================================

function formatTanggalDashboard(
    tanggal
) {

    const tahun =
        tanggal.getFullYear();

    const bulan =
        String(
            tanggal.getMonth() + 1
        ).padStart(2, "0");

    const hari =
        String(
            tanggal.getDate()
        ).padStart(2, "0");

    return (
        tahun +
        "-" +
        bulan +
        "-" +
        hari
    );

}


// =========================================
// AMBIL PERIODE DASHBOARD
// =========================================

function ambilPeriodeDashboard() {

    const select =
        document.getElementById(
            "dashboardPeriode"
        );


    let nilaiPeriode =
        select
            ? select.value
            : "";


    // Jika belum ada pilihan
    // gunakan bulan berjalan

    if (!nilaiPeriode) {

        nilaiPeriode =
            periodeDefaultDashboard();

    }


    const bagian =
        nilaiPeriode.split("-");


    const tahun =
        Number(bagian[0]);


    const bulan =
        Number(bagian[1]) - 1;


    const awal =
        new Date(
            tahun,
            bulan,
            1
        );


    const akhir =
        new Date(
            tahun,
            bulan + 1,
            0
        );


    return {

        dari:
            formatTanggalDashboard(
                awal
            ),

        sampai:
            formatTanggalDashboard(
                akhir
            ),

        tahun:
            tahun,

        bulan:
            bulan

    };

}


// =========================================
// NAMA PERIODE
// =========================================

function namaPeriodeDashboard() {

    const periode =
        ambilPeriodeDashboard();


    return (
        NAMA_BULAN_DASHBOARD[
            periode.bulan
        ] +
        " " +
        periode.tahun
    );

}


// =========================================
// TAMPIL PERIODE
// =========================================

function tampilPeriodeDashboard() {

    const element =
        document.getElementById(
            "dashboardPeriode"
        );


    if (!element) {

        return;

    }


    // Untuk SELECT
    // tidak perlu mengubah textContent

    if (
        element.tagName ===
        "SELECT"
    ) {

        return;

    }


    element.textContent =
        "Periode " +
        namaPeriodeDashboard();

}


// =========================================
// SET NILAI DASHBOARD
// =========================================

function setDashboardNilai(
    id,
    nilai
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.textContent =
        formatRupiahDashboard(
            nilai
        );

}


// =========================================
// TAMPIL DATA UNIT USAHA
// =========================================

function tampilUnitDashboard(
    unit,
    idPemasukan,
    idPengeluaran,
    idLabaRugi
) {

    if (!unit) {

        setDashboardNilai(
            idPemasukan,
            0
        );


        setDashboardNilai(
            idPengeluaran,
            0
        );


        setDashboardNilai(
            idLabaRugi,
            0
        );


        return;

    }


    // =====================================
    // PEMASUKAN
    // =====================================

    setDashboardNilai(
        idPemasukan,
        unit.totalPendapatan || 0
    );


    // =====================================
    // PENGELUARAN
    // =====================================

    setDashboardNilai(
        idPengeluaran,
        unit.totalBebanTransaksi || 0
    );


    // =====================================
    // LABA / RUGI
    // =====================================

    setDashboardNilai(
        idLabaRugi,
        unit.labaRugi || 0
    );

}


// =========================================
// BUAT DAFTAR PERIODE
// =========================================

function buatDaftarPeriodeDashboard() {

    const select =
        document.getElementById(
            "dashboardPeriode"
        );


    if (!select) {

        return;

    }


    // Pastikan elemen memang SELECT

    if (
        select.tagName !==
        "SELECT"
    ) {

        return;

    }


    // =====================================
    // SIMPAN PERIODE YANG SEDANG DIPILIH
    // =====================================

    const periodeSebelumnya =
        select.value;


    // =====================================
    // TANGGAL SEKARANG
    // =====================================

    const sekarang =
        new Date();


    const tahunSekarang =
        sekarang.getFullYear();


    const bulanSekarang =
        sekarang.getMonth();


    // =====================================
    // TAHUN AWAL PEMBUKUAN
    // =====================================

    const tahunAwal =
        typeof TAHUN_AWAL_PEMBUKUAN_NERACA !==
        "undefined"

            ? Number(
                TAHUN_AWAL_PEMBUKUAN_NERACA
            )

            : tahunSekarang;


    // =====================================
    // BUAT DAFTAR BARU
    // =====================================

    select.innerHTML = "";


    // =====================================
    // PERIODE
    // =====================================

    for (
        let tahun = tahunSekarang;
        tahun >= tahunAwal;
        tahun--
    ) {

        let bulanTerakhir =
            11;


        // Tahun berjalan hanya sampai
        // bulan berjalan

        if (
            tahun ===
            tahunSekarang
        ) {

            bulanTerakhir =
                bulanSekarang;

        }


        for (
            let bulan = bulanTerakhir;
            bulan >= 0;
            bulan--
        ) {

            const value =
                tahun +
                "-" +
                String(
                    bulan + 1
                ).padStart(
                    2,
                    "0"
                );


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                value;


            option.textContent =
                NAMA_BULAN_DASHBOARD[
                    bulan
                ] +
                " " +
                tahun;


            select.appendChild(
                option
            );

        }

    }


    // =====================================
    // TENTUKAN PERIODE YANG DIPAKAI
    // =====================================

    if (
        periodeSebelumnya &&
        select.querySelector(
            'option[value="' +
            periodeSebelumnya +
            '"]'
        )
    ) {

        // Pertahankan pilihan sebelumnya

        select.value =
            periodeSebelumnya;

    } else {

        // Jika belum ada pilihan,
        // gunakan bulan berjalan

        select.value =
            periodeDefaultDashboard();

    }


    // =====================================
    // EVENT CHANGE
    // =====================================

    if (
        !select.dataset
            .dashboardEvent
    ) {

        select.addEventListener(
            "change",
            function () {

                tampilDashboard();

            }
        );


        select.dataset
            .dashboardEvent =
            "true";

    }

}




// =========================================
// TAMPIL DASHBOARD
// =========================================

async function tampilDashboard() {

    try {

        console.log(
            "Memuat Dashboard..."
        );


        // =====================================
        // PASTIKAN DAFTAR PERIODE ADA
        // =====================================

        buatDaftarPeriodeDashboard();


        // =====================================
        // PERIODE TERPILIH
        // =====================================

        const periode =
            ambilPeriodeDashboard();


        console.log(
            "Periode Dashboard:",
            periode.dari,
            "sampai",
            periode.sampai
        );


        tampilPeriodeDashboard();


        // =====================================
        // SALDO MEDIA
        // =====================================

        const saldoMedia =
            await hitungSaldoMediaNeracaFirebase(
                periode.sampai
            );


        setDashboardNilai(
            "dashboardKas",
            saldoMedia.kas
        );


        setDashboardNilai(
            "dashboardBank",
            saldoMedia.bank
        );


        setDashboardNilai(
            "dashboardDana",
            saldoMedia.dana
        );


        setDashboardNilai(
            "dashboardAffiliate",
            saldoMedia.saldoAffiliate
        );


        // =====================================
        // PIUTANG
        // =====================================

        const piutang =
            await hitungPiutangNeracaFirebase(
                periode.sampai
            );


        setDashboardNilai(
            "dashboardPiutang",
            piutang
        );


        // =====================================
        // UTANG
        // =====================================

        const utang =
            await hitungUtangNeracaFirebase(
                periode.sampai
            );


        setDashboardNilai(
            "dashboardUtang",
            utang
        );


        // =====================================
        // LABA RUGI
        // =====================================

        const labaRugi =
            await ambilLaporanLabaRugiFirebase(
                periode.dari,
                periode.sampai
            );


        if (
            labaRugi
        ) {

            // =================================
            // LABA / RUGI BUMDes
            // =================================

            setDashboardNilai(
                "dashboardLabaRugi",
                labaRugi.labaRugi
            );


            // =================================
            // UNIT USAHA
            // =================================

            if (
                labaRugi.unit
            ) {

                // ---------------------------------
                // PENGELOLAAN SAMPAH
                // ---------------------------------

                tampilUnitDashboard(

                    labaRugi.unit[
                        UNIT_USAHA.PENGELOLAAN_SAMPAH
                    ],

                    "dashboardSampahPemasukan",

                    "dashboardSampahPengeluaran",

                    "dashboardSampah"

                );


                // ---------------------------------
                // AYAM PETELUR
                // ---------------------------------

                tampilUnitDashboard(

                    labaRugi.unit[
                        UNIT_USAHA.AYAM_PETELUR
                    ],

                    "dashboardAyamPemasukan",

                    "dashboardAyamPengeluaran",

                    "dashboardAyam"

                );


                // ---------------------------------
                // BANK SAMPAH
                // ---------------------------------

                tampilUnitDashboard(

                    labaRugi.unit[
                        UNIT_USAHA.BANK_SAMPAH
                    ],

                    "dashboardBankSampahPemasukan",

                    "dashboardBankSampahPengeluaran",

                    "dashboardBankSampah"

                );


                // ---------------------------------
                // AFFILIATE
                // ---------------------------------

                tampilUnitDashboard(

                    labaRugi.unit[
                        UNIT_USAHA.AFFILIATE
                    ],

                    "dashboardAffiliatePemasukan",

                    "dashboardAffiliatePengeluaran",

                    "dashboardAffiliateUnit"

                );

            }

        } else {

            // =================================
            // JIKA TIDAK ADA DATA
            // =================================

            setDashboardNilai(
                "dashboardLabaRugi",
                0
            );


            tampilUnitDashboard(
                null,
                "dashboardSampahPemasukan",
                "dashboardSampahPengeluaran",
                "dashboardSampah"
            );


            tampilUnitDashboard(
                null,
                "dashboardAyamPemasukan",
                "dashboardAyamPengeluaran",
                "dashboardAyam"
            );


            tampilUnitDashboard(
                null,
                "dashboardBankSampahPemasukan",
                "dashboardBankSampahPengeluaran",
                "dashboardBankSampah"
            );


            tampilUnitDashboard(
                null,
                "dashboardAffiliatePemasukan",
                "dashboardAffiliatePengeluaran",
                "dashboardAffiliateUnit"
            );

        }


        console.log(
            "Dashboard berhasil dimuat."
        );


    } catch (error) {

        console.error(
            "Gagal memuat Dashboard:",
            error
        );

    }

}


// =========================================
// INIT DASHBOARD
// =========================================

function initDashboard() {

    tampilDashboard();

}


// =========================================
// GLOBAL
// =========================================

window.tampilDashboard =
    tampilDashboard;


window.initDashboard =
    initDashboard;


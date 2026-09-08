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
        angka.toLocaleString(
            "id-ID"
        );

}


// =========================================
// AMBIL PERIODE DASHBOARD
// =========================================

function ambilPeriodeDashboard() {

    const sekarang =
        new Date();


    const tahun =
        sekarang.getFullYear();


    const bulan =
        sekarang.getMonth();


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


    function formatTanggal(
        tanggal
    ) {

        const tahun =
            tanggal.getFullYear();


        const bulan =
            String(
                tanggal.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const hari =
            String(
                tanggal.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            tahun +
            "-" +
            bulan +
            "-" +
            hari
        );

    }


    return {

        dari:
            formatTanggal(awal),

        sampai:
            formatTanggal(akhir)

    };

}


// =========================================
// NAMA PERIODE
// =========================================

function namaPeriodeDashboard() {

    const sekarang =
        new Date();


    const namaBulan = [

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


    return (
        namaBulan[
            sekarang.getMonth()
        ] +
        " " +
        sekarang.getFullYear()
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
// TAMPIL DASHBOARD
// =========================================

async function tampilDashboard() {

    try {

        console.log(
            "Memuat Dashboard..."
        );


        // =====================================
        // PERIODE
        // =====================================

        const periode =
            ambilPeriodeDashboard();


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

                setDashboardNilai(
                    "dashboardSampah",
                    labaRugi.unit[
                        UNIT_USAHA.PENGELOLAAN_SAMPAH
                    ]?.labaRugi || 0
                );


                setDashboardNilai(
                    "dashboardAyam",
                    labaRugi.unit[
                        UNIT_USAHA.AYAM_PETELUR
                    ]?.labaRugi || 0
                );


                setDashboardNilai(
                    "dashboardBankSampah",
                    labaRugi.unit[
                        UNIT_USAHA.BANK_SAMPAH
                    ]?.labaRugi || 0
                );


                setDashboardNilai(
                    "dashboardAffiliateUnit",
                    labaRugi.unit[
                        UNIT_USAHA.AFFILIATE
                    ]?.labaRugi || 0
                );

            }

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
// =========================================
// TRANSAKSI UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// TUGAS FILE:
// - Helper tampilan transaksi
// - Format tanggal
// - Format Rupiah
// - Menampilkan laporan melalui
//   struktur laporan.ui.js
//
// CATATAN:
// Tampilan utama LAPORAN TRANSAKSI
// tetap berada di laporan.ui.js.
//
// =========================================


// =========================================
// FORMAT RUPIAH TRANSAKSI
// =========================================

function rupiahTransaksi(nilai) {

    if (
        typeof formatRupiah ===
        "function"
    ) {

        return formatRupiah(
            Number(nilai) || 0
        );

    }


    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(
        Number(nilai) || 0
    );

}


// =========================================
// FORMAT TANGGAL TRANSAKSI
// =========================================

function formatTanggalTransaksi(
    tanggal
) {

    if (!tanggal) {

        return "-";

    }


    const bagian =
        String(tanggal)
            .substring(0, 10)
            .split("-");


    if (
        bagian.length !== 3
    ) {

        return String(tanggal);

    }


    return (
        bagian[2] +
        "/" +
        bagian[1] +
        "/" +
        bagian[0]
    );

}


// =========================================
// NAMA JENIS TRANSAKSI
// =========================================

function namaJenisTransaksi(
    jenis
) {

    const nilai =
        String(
            jenis || ""
        ).toUpperCase();


    if (
        nilai ===
        "PEMASUKAN"
    ) {

        return "PEMASUKAN";

    }


    if (
        nilai ===
        "PENGELUARAN"
    ) {

        return "PENGELUARAN";

    }


    if (
        nilai ===
        "TRANSFER"
    ) {

        return "TRANSFER";

    }


    return nilai || "-";

}


// =========================================
// NAMA UNIT USAHA
// =========================================

function namaUnitTransaksi(
    kode
) {

    if (
        typeof NAMA_UNIT_USAHA !==
        "undefined"
    ) {

        return (
            NAMA_UNIT_USAHA[kode] ||
            kode ||
            "-"
        );

    }


    return kode || "-";

}


// =========================================
// MEDIA TRANSAKSI
// =========================================

function mediaTransaksi(item) {

    if (!item) {

        return "-";

    }


    const jenis =
        String(
            item.jenisTransaksi ||
            item.jenis ||
            ""
        ).toUpperCase();


    // =====================================
    // TRANSFER
    // =====================================

    if (
        jenis ===
        "TRANSFER"
    ) {

        return (

            item.mediaAsal ||
            "-"

        ) +

        " → " +

        (

            item.mediaTujuan ||
            "-"

        );

    }


    // =====================================
    // PEMASUKAN / PENGELUARAN
    // =====================================

    return (
        item.media ||
        item.mediaTujuan ||
        item.mediaAsal ||
        "-"
    );

}


// =========================================
// NORMALISASI DATA TRANSAKSI
// =========================================
//
// Fungsi ini memastikan data yang masuk
// mempunyai struktur seragam.
//
// =========================================

function normalisasiTransaksiUI(
    item
) {

    if (!item) {

        return null;

    }


    const jenis =
        namaJenisTransaksi(
            item.jenisTransaksi ||
            item.jenis
        );


    return {

        id:
            item.id || "",

        tanggal:
            item.tanggal || "",

        jenisTransaksi:
            jenis,

        jenis:
            jenis,

        unitUsaha:
            item.unitUsaha || "-",

        akunKode:
            item.akunKode || "-",

        media:
            mediaTransaksi(item),

        mediaAsal:
            item.mediaAsal || "",

        mediaTujuan:
            item.mediaTujuan || "",

        nominal:
            Number(
                item.nominal
            ) || 0,

        keterangan:
            item.keterangan || "-",

        nomorBukti:
            item.nomorBukti || "-"

    };

}


// =========================================
// NORMALISASI HASIL LAPORAN
// =========================================
//
// Memastikan laporan.ui.js selalu menerima:
//
// {
//     periode,
//     transaksi,
//     totalTransaksi,
//     totalPemasukan,
//     totalPengeluaran,
//     totalTransfer
// }
//
// =========================================

function normalisasiLaporanTransaksiUI(
    data
) {

    if (!data) {

        return {

            periode: {

                dari: "-",

                sampai: "-"

            },

            transaksi: [],

            totalTransaksi: 0,

            totalPemasukan: 0,

            totalPengeluaran: 0,

            totalTransfer: 0

        };

    }


    const daftar =
        Array.isArray(
            data.transaksi
        )
            ? data.transaksi
                .map(
                    normalisasiTransaksiUI
                )
                .filter(
                    function(item) {

                        return item !== null;

                    }
                )
            : [];


    return {

        periode:
            data.periode || {

                dari: "-",

                sampai: "-"

            },

        transaksi:
            daftar,

        totalTransaksi:
            Number(
                data.totalTransaksi
            ) || daftar.length,

        totalPemasukan:
            Number(
                data.totalPemasukan
            ) || 0,

        totalPengeluaran:
            Number(
                data.totalPengeluaran
            ) || 0,

        totalTransfer:
            Number(
                data.totalTransfer
            ) || 0

    };

}


// =========================================
// TAMPILKAN TRANSAKSI UI
// =========================================
//
// Fungsi ini menjadi jembatan:
//
// transaksi.js
//       ↓
// transaksi.ui.js
//       ↓
// laporan.ui.js
//
// =========================================

function tampilkanTransaksiUI(
    data
) {

    const hasil =
        normalisasiLaporanTransaksiUI(
            data
        );


    console.log(
        "UI transaksi menerima:",
        hasil
    );


    // =====================================
    // Gunakan renderer laporan utama
    // =====================================

    //
    // Kita tidak membuat HTML baru di sini.
    //
    // Renderer utama berada di
    // laporan.ui.js.
    //
    // =====================================

    if (
        typeof tampilTransaksiLaporan ===
        "function"
    ) {

        //
        // tampilTransaksiLaporan()
        // mengambil ulang data Firebase.
        //
        // Karena data sudah tersedia,
        // kita tidak memanggilnya.
        //
        // Fungsi ini hanya disediakan
        // sebagai kompatibilitas.
        //

    }


    return hasil;

}


// =========================================
// SELESAI
// =========================================

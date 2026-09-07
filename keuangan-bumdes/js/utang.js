// =========================================
// UTANG
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// DATA GLOBAL UTANG
// =========================================

let DATA_UTANG = [];

let utangSedangDiedit = null;


// =========================================
// PERSIAPAN HALAMAN UTANG
// =========================================

function siapkanHalamanUtang() {

    console.log(
        "Halaman Utang siap."
    );

}


// =========================================
// EDIT UTANG
// =========================================

function editUtang(id) {

    const item =
        DATA_UTANG.find(function(data) {

            return data.id === id;

        });


    if (!item) {

        alert(
            "Data utang tidak ditemukan."
        );

        return;

    }


    // =====================================
    // CEK SUDAH ADA PEMBAYARAN
    // =====================================

    const sudahDibayar =
        Number(item.dibayar) || 0;


    if (sudahDibayar > 0) {

        alert(
            "Utang ini sudah memiliki pembayaran.\n\n" +
            "Data tidak dapat diedit langsung."
        );

        return;

    }


    // =====================================
    // AMBIL FORM
    // =====================================

    const tanggal =
        document.getElementById(
            "utangTanggal"
        );

    const nama =
        document.getElementById(
            "utangNama"
        );

    const keterangan =
        document.getElementById(
            "utangKeterangan"
        );

    const nominal =
        document.getElementById(
            "utangNominal"
        );

    const jatuhTempo =
        document.getElementById(
            "utangJatuhTempo"
        );


    // =====================================
    // ISI FORM
    // =====================================

    if (tanggal) {

        tanggal.value =
            item.tanggal || "";

    }


    if (nama) {

        nama.value =
            item.nama || "";

    }


    if (keterangan) {

        keterangan.value =
            item.keterangan || "";

    }


    if (nominal) {

        nominal.value =
            item.nominal || "";

    }


    if (jatuhTempo) {

        jatuhTempo.value =
            item.jatuhTempo || "";

    }


    // =====================================
    // AKTIFKAN MODE EDIT
    // =====================================

    utangSedangDiedit =
        id;


    // =====================================
    // UBAH TOMBOL SIMPAN
    // =====================================

    ubahTombolSimpanUtang(
        "Simpan Perubahan"
    );


    // =====================================
    // SCROLL KE FORM
    // =====================================

    const halaman =
        document.getElementById(
            "halaman-utang"
        );


    if (halaman) {

        halaman.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}
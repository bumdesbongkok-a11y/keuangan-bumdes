// =========================================
// PENGELUARAN
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// AMBIL DATA PENGELUARAN
// =========================================

function ambilDataPengeluaran() {

    const jenisElement =
        document.getElementById(
            "pengeluaranJenis"
        );

    const asetElement =
        document.getElementById(
            "pengeluaranAset"
        );

    const akunElement =
        document.getElementById(
            "pengeluaranAkun"
        );


    const jenisPengeluaran =
        jenisElement
            ? jenisElement.value
            : "";


    const asetId =
        asetElement
            ? asetElement.value
            : "";


    const akun =
        akunElement
            ? akunElement.value
            : "";


    const data = {

        // =====================================
        // TANGGAL
        // =====================================

        tanggal:
            document.getElementById(
                "pengeluaranTanggal"
            ).value,


        // =====================================
        // UNIT USAHA
        // =====================================

        unitUsaha:
            document.getElementById(
                "pengeluaranUnit"
            ).value,


        // =====================================
        // JENIS PENGELUARAN
        // =====================================

        jenisPengeluaran:
            jenisPengeluaran,


        // =====================================
        // SUPPLIER
        // =====================================

        supplierId:
            document.getElementById(
                "pengeluaranSupplier"
            ).value,


        // =====================================
        // ASET
        // =====================================

        asetId:
            asetId,


        // =====================================
        // AKUN
        // =====================================

        akun:
            akun,


        // =====================================
        // MEDIA PEMBAYARAN
        // =====================================

        mediaAsal:
            document.getElementById(
                "pengeluaranMedia"
            ).value,


        // =====================================
        // NOMINAL
        // =====================================

        nominal:
            Number(
                document.getElementById(
                    "pengeluaranNominal"
                ).value
            ),


        // =====================================
        // KETERANGAN
        // =====================================

        keterangan:
            document.getElementById(
                "pengeluaranKeterangan"
            ).value.trim(),


        // =====================================
        // NOMOR BUKTI
        // =====================================

        nomorBukti:
            document.getElementById(
                "pengeluaranBukti"
            ).value.trim()

    };


    return data;

}


// =========================================
// VALIDASI PENGELUARAN
// =========================================

function validasiPengeluaran(data) {

    // =====================================
    // TANGGAL
    // =====================================

    if (!data.tanggal) {

        return "Tanggal belum diisi.";

    }


    // =====================================
    // UNIT USAHA
    // =====================================

    if (!data.unitUsaha) {

        return "Unit usaha belum dipilih.";

    }


    // =====================================
    // JENIS PENGELUARAN
    // =====================================

    if (!data.jenisPengeluaran) {

        return "Jenis pengeluaran belum dipilih.";

    }


    // =====================================
    // PEMBELIAN ASET
    // =====================================

    if (
        data.jenisPengeluaran === "ASET"
    ) {

        // ---------------------------------
        // ASET WAJIB DIPILIH
        // ---------------------------------

        if (!data.asetId) {

            return "Aset belum dipilih.";

        }


        // ---------------------------------
        // AKUN ASET HARUS 1400
        // ---------------------------------

        if (
            String(data.akun) !== "1400"
        ) {

            return (
                "Pembelian aset harus menggunakan akun 1400 - Aset Tetap."
            );

        }

    }


    // =====================================
    // BEBAN OPERASIONAL
    // =====================================

    if (
        data.jenisPengeluaran === "BEBAN"
    ) {

        if (!data.akun) {

            return "Akun beban belum dipilih.";

        }


        // ---------------------------------
        // BEBAN TIDAK BOLEH AKUN ASET
        // ---------------------------------

        if (
            String(data.akun) === "1400"
        ) {

            return (
                "Akun 1400 hanya digunakan untuk Pembelian Aset."
            );

        }


        // ---------------------------------
        // ASET DIKOSONGKAN
        // ---------------------------------

        data.asetId = "";

    }


    // =====================================
    // MEDIA PEMBAYARAN
    // =====================================

    if (!data.mediaAsal) {

        return "Sumber pembayaran belum dipilih.";

    }


    // =====================================
    // NOMINAL
    // =====================================

    if (!validasiNominal(data.nominal)) {

        return "Nominal tidak valid.";

    }


    return null;

}


// =========================================
// PROSES PENGELUARAN
// =========================================

async function prosesPengeluaran() {

    const data =
        ambilDataPengeluaran();


    // =====================================
    // VALIDASI
    // =====================================

    const error =
        validasiPengeluaran(data);


    if (error) {

        tampilPesanPengeluaran(
            error,
            "error"
        );

        return;

    }


    // =====================================
    // LOG DATA
    // =====================================

    console.log(
        "Data pengeluaran:",
        data
    );


    // =====================================
    // MODE UPDATE
    // =====================================

    if (window.pengeluaranSedangDiedit) {

        tampilPesanPengeluaran(
            "Memperbarui data...",
            "success"
        );


        const berhasil =
            await updatePengeluaranFirebase(
                window.pengeluaranSedangDiedit,
                data
            );


        if (!berhasil) {

            tampilPesanPengeluaran(
                "Pengeluaran gagal diperbarui.",
                "error"
            );

            return;

        }


        tampilPesanPengeluaran(
            "Pengeluaran berhasil diperbarui.",
            "success"
        );


        // ---------------------------------
        // HAPUS MODE EDIT
        // ---------------------------------

        window.pengeluaranSedangDiedit =
            null;


        // ---------------------------------
        // RESET FORM
        // ---------------------------------

        resetFormPengeluaran();


        // ---------------------------------
        // MUAT ULANG DATA
        // ---------------------------------

        await loadDanTampilPengeluaran();


        return;

    }


    // =====================================
    // MODE SIMPAN BARU
    // =====================================

    tampilPesanPengeluaran(
        "Menyimpan data...",
        "success"
    );


    const berhasil =
        await simpanPengeluaranFirebase(
            data
        );


    if (!berhasil) {

        tampilPesanPengeluaran(
            "Pengeluaran gagal disimpan.",
            "error"
        );

        return;

    }


    tampilPesanPengeluaran(
        "Pengeluaran berhasil disimpan.",
        "success"
    );


    // =====================================
    // RESET FORM
    // =====================================

    resetFormPengeluaran();


    // =====================================
    // MUAT ULANG DATA
    // =====================================

    await loadDanTampilPengeluaran();

}


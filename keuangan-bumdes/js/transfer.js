// =========================================
// TRANSFER
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// AMBIL DATA TRANSFER
// =========================================

function ambilDataTransfer() {

    const data = {

        tanggal:
            document.getElementById(
                "transferTanggal"
            ).value,

        mediaAsal:
            document.getElementById(
                "transferMediaAsal"
            ).value,

        mediaTujuan:
            document.getElementById(
                "transferMediaTujuan"
            ).value,

        nominal:
            Number(
                document.getElementById(
                    "transferNominal"
                ).value
            ),

        keterangan:
            document.getElementById(
                "transferKeterangan"
            ).value.trim(),

        nomorBukti:
            document.getElementById(
                "transferBukti"
            ).value.trim()

    };


    return data;

}


// =========================================
// VALIDASI TRANSFER
// =========================================

function validasiTransfer(data) {

    if (!data.tanggal) {

        return "Tanggal belum diisi.";

    }


    if (!data.mediaAsal) {

        return "Media asal belum dipilih.";

    }


    if (!data.mediaTujuan) {

        return "Media tujuan belum dipilih.";

    }


    if (
        data.mediaAsal ===
        data.mediaTujuan
    ) {

        return (
            "Media asal dan tujuan " +
            "tidak boleh sama."
        );

    }


    if (!validasiNominal(data.nominal)) {

        return "Nominal tidak valid.";

    }


    return null;

}


// =========================================
// PROSES TRANSFER
// =========================================

async function prosesTransfer() {

    const data =
        ambilDataTransfer();


    const error =
        validasiTransfer(data);


    if (error) {

        tampilPesanTransfer(
            error,
            "error"
        );

        return;

    }


    // =====================================
    // MODE UPDATE
    // =====================================

    if (window.transferSedangDiedit) {

        tampilPesanTransfer(
            "Memperbarui transfer...",
            "success"
        );


        const berhasil =
            await updateTransferFirebase(
                window.transferSedangDiedit,
                data
            );


        if (!berhasil) {

            tampilPesanTransfer(
                "Transfer gagal diperbarui.",
                "error"
            );

            return;

        }


        // Hapus mode edit

        window.transferSedangDiedit =
            null;


        // Kosongkan form

        resetFormTransfer();


        tampilPesanTransfer(
            "Transfer berhasil diperbarui.",
            "success"
        );


        // Refresh tabel

        await loadDanTampilTransfer();


        return;

    }


    // =====================================
    // MODE SIMPAN BARU
    // =====================================

    tampilPesanTransfer(
        "Menyimpan transfer...",
        "success"
    );


    const berhasil =
        await simpanTransferFirebase(
            data
        );


    if (!berhasil) {

        tampilPesanTransfer(
            "Transfer gagal disimpan.",
            "error"
        );

        return;

    }


    resetFormTransfer();


    tampilPesanTransfer(
        "Transfer berhasil disimpan.",
        "success"
    );


    await loadDanTampilTransfer();

}
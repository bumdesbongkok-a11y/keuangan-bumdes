// =========================================
// PEMASUKAN
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// AMBIL DATA PEMASUKAN
// =========================================

function ambilDataPemasukan() {

    const unitUsaha =
        document.getElementById("pemasukanUnit").value;

    const pelangganElement =
    document.getElementById("pemasukanPelanggan");

const pelangganTerpilih =
    pelangganElement.options[pelangganElement.selectedIndex];

const cakupanPelanggan =
    pelangganTerpilih
        ? pelangganTerpilih.dataset.cakupan || "wilayah"
        : "wilayah";


const data = {

    tanggal:
        document.getElementById("pemasukanTanggal").value,

    unitUsaha:
        unitUsaha,

    pelangganId:
        pelangganElement.value,

    cakupanPelanggan:
        cakupanPelanggan,

    akun:
        document.getElementById("pemasukanAkun").value,

    mediaTujuan:
        document.getElementById("pemasukanMedia").value,

    nominal:
        Number(
            document.getElementById("pemasukanNominal").value
        ),

    keterangan:
        document
            .getElementById("pemasukanKeterangan")
            .value
            .trim(),

    nomorBukti:
        document
            .getElementById("pemasukanBukti")
            .value
            .trim()
};


    // =====================================
    // DETAIL PENGELOLAAN SAMPAH
    // =====================================

    if (unitUsaha === "PENGELOLAAN_SAMPAH") {

        data.jenisPendapatan =
            document.getElementById("pemasukanJenisSampah").value;

        data.rt =
            document.getElementById("pemasukanRT").value;

        data.rw =
            document.getElementById("pemasukanRW").value;

        data.namaPenyetor =
            document.getElementById("pemasukanPenyetor").value.trim();

    }


    return data;

}


// =========================================
// VALIDASI PEMASUKAN
// =========================================

function validasiPemasukan(data) {

    if (!data.tanggal) {
        return "Tanggal belum diisi.";
    }

    if (!data.unitUsaha) {
        return "Unit usaha belum dipilih.";
    }

    if (!data.akun) {
        return "Akun pendapatan belum dipilih.";
    }

    if (!data.mediaTujuan) {
        return "Tempat uang masuk belum dipilih.";
    }

    if (!validasiNominal(data.nominal)) {
        return "Nominal tidak valid.";
    }


    // =========================================
    // VALIDASI KHUSUS PENGELOLAAN SAMPAH
    // =========================================

    if (data.unitUsaha === "PENGELOLAAN_SAMPAH") {

        if (!data.jenisPendapatan) {
            return "Jenis pendapatan belum dipilih.";
        }

        if (!data.namaPenyetor) {
            return "Nama penyetor belum diisi.";
        }


        // =====================================
        // RT / RW HANYA WAJIB UNTUK
        // PELANGGAN YANG TERIKAT WILAYAH
        // =====================================

        if (data.cakupanPelanggan !== "khusus") {

            if (!data.rt) {
                return "RT belum dipilih.";
            }

            if (!data.rw) {
                return "RW belum dipilih.";
            }

        }

    }

    return null;
}


// =========================================
// PROSES PEMASUKAN
// =========================================

async function prosesPemasukan() {

    const data =
        ambilDataPemasukan();


    const error =
        validasiPemasukan(data);


    if (error) {

        tampilPesanPemasukan(
            error,
            "error"
        );

        return;

    }


    tampilPesanPemasukan(
        "Menyimpan data...",
        "success"
    );


    let berhasil = false;


    // =====================================
    // MODE EDIT
    // =====================================

    if (window.idPemasukanSedangDiedit) {

        berhasil =
            await updatePemasukanFirebase(
                window.idPemasukanSedangDiedit,
                data
            );

    }


    // =====================================
    // MODE DATA BARU
    // =====================================

    else {

        berhasil =
            await simpanPemasukanFirebase(
                data
            );

    }


    if (!berhasil) {

        tampilPesanPemasukan(
            "Pemasukan gagal disimpan.",
            "error"
        );

        return;

    }


    // =====================================
    // BERHASIL
    // =====================================

    tampilPesanPemasukan(
        "Pemasukan berhasil disimpan.",
        "success"
    );


    console.log(
        "PEMASUKAN BERHASIL:",
        data
    );


    // Reset mode edit

    window.idPemasukanSedangDiedit =
    null;


// Kosongkan form

resetFormPemasukan();


// Muat ulang daftar

await loadDanTampilPemasukan();

}
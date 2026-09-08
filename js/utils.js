// =========================================
// UTILS
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FORMAT RUPIAH
// =========================================

function formatRupiah(nominal) {

    const angka =
        Number(nominal) || 0;

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(angka);

}


// =========================================
// TANGGAL HARI INI
// =========================================

function tanggalHariIni() {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(2, "0");

    return `${tahun}-${bulan}-${tanggal}`;

}


// =========================================
// VALIDASI NOMINAL
// =========================================

function validasiNominal(nominal) {

    return (
        typeof nominal === "number" &&
        Number.isFinite(nominal) &&
        nominal > 0
    );

}
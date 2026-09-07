// =========================================
// PIUTANG
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// DATA GLOBAL PIUTANG
// =========================================

let DATA_PIUTANG = [];

let piutangSedangDiedit = null;

let PIUTANG_SEDANG_DIBAYAR = null;


// =========================================
// PERSIAPAN HALAMAN PIUTANG
// =========================================

function siapkanHalamanPiutang() {

    console.log(
        "Menyiapkan halaman Piutang..."
    );


    // =====================================
    // TANGGAL PIUTANG
    // =====================================

    setTanggalPiutang();


    // =====================================
    // TANGGAL PEMBAYARAN
    // =====================================

    setTanggalBayarPiutang();


    // =====================================
    // TUTUP FORM PEMBAYARAN
    // =====================================

    tutupFormBayarPiutang();


    console.log(
        "Halaman Piutang siap."
    );

}


// =========================================
// LOAD DATA PIUTANG
// =========================================

async function loadDanTampilPiutang() {

    try {

        console.log(
            "Memuat data piutang..."
        );


        const data =
            await loadPiutangFirebase();


        DATA_PIUTANG =
            Array.isArray(data)
                ? data
                : [];


        tampilPiutang(
            DATA_PIUTANG
        );


        console.log(
            "Data piutang berhasil dimuat:",
            DATA_PIUTANG
        );


        return DATA_PIUTANG;


    } catch (error) {

        console.error(
            "Load piutang gagal:",
            error
        );


        DATA_PIUTANG = [];


        tampilPiutang([]);


        return [];

    }

}


// =========================================
// SIMPAN PIUTANG
// =========================================

async function simpanPiutang() {

    try {

        // =====================================
        // AMBIL INPUT
        // =====================================

        const tanggalInput =
            document.getElementById(
                "piutangTanggal"
            );


        const namaInput =
            document.getElementById(
                "piutangNama"
            );


        const keteranganInput =
            document.getElementById(
                "piutangKeterangan"
            );


        const nominalInput =
            document.getElementById(
                "piutangNominal"
            );


        const jatuhTempoInput =
            document.getElementById(
                "piutangJatuhTempo"
            );


        if (
            !tanggalInput ||
            !namaInput ||
            !keteranganInput ||
            !nominalInput ||
            !jatuhTempoInput
        ) {

            throw new Error(
                "Form Piutang tidak lengkap."
            );

        }


        const tanggal =
            tanggalInput.value;


        const nama =
            namaInput.value.trim();


        const keterangan =
            keteranganInput.value.trim();


        const nominal =
            Number(
                nominalInput.value
            );


        const jatuhTempo =
            jatuhTempoInput.value;


        // =====================================
        // VALIDASI
        // =====================================

        if (!tanggal) {

            alert(
                "Tanggal piutang wajib diisi."
            );

            return;

        }


        if (!nama) {

            alert(
                "Nama / pihak yang berutang wajib diisi."
            );

            return;

        }


        if (
            !Number.isFinite(nominal) ||
            nominal <= 0
        ) {

            alert(
                "Nominal piutang harus lebih dari 0."
            );

            return;

        }


        // =====================================
        // MODE EDIT
        // =====================================

        if (piutangSedangDiedit) {

            console.log(
                "Mengubah piutang:",
                piutangSedangDiedit
            );


            const berhasil =
                await updatePiutangFirebase(

                    piutangSedangDiedit,

                    {

                        tanggal:
                            tanggal,

                        nama:
                            nama,

                        keterangan:
                            keterangan,

                        nominal:
                            nominal,

                        jatuhTempo:
                            jatuhTempo

                    }

                );


            if (!berhasil) {

                throw new Error(
                    "Gagal memperbarui piutang."
                );

            }


            alert(
                "Piutang berhasil diperbarui."
            );


            piutangSedangDiedit =
                null;


            resetFormPiutang();


            ubahTombolSimpanPiutang();


            await loadDanTampilPiutang();


            return;

        }


        // =====================================
        // MODE TAMBAH
        // =====================================

        console.log(
            "Menyimpan piutang baru..."
        );


        const berhasil =
            await simpanPiutangFirebase(

                {

                    tanggal:
                        tanggal,

                    nama:
                        nama,

                    keterangan:
                        keterangan,

                    nominal:
                        nominal,

                    jatuhTempo:
                        jatuhTempo

                }

            );


        if (
            !berhasil ||
            berhasil.success === false
        ) {

            throw new Error(
                "Gagal menyimpan piutang."
            );

        }


        alert(
            "Piutang berhasil disimpan."
        );


        piutangSedangDiedit =
            null;


        resetFormPiutang();


        ubahTombolSimpanPiutang();


        await loadDanTampilPiutang();


    } catch (error) {

        console.error(
            "Simpan piutang gagal:",
            error
        );


        alert(
            error.message ||
            "Gagal menyimpan piutang."
        );

    }

}


// =========================================
// EDIT PIUTANG
// =========================================

async function editPiutang(id) {

    try {

        // =====================================
        // CARI DATA DARI DATA GLOBAL
        // =====================================

        let item =
            DATA_PIUTANG.find(
                function(row) {

                    return row.id === id;

                }
            );


        // =====================================
        // JIKA TIDAK ADA
        // AMBIL ULANG DARI FIREBASE
        // =====================================

        if (!item) {

            const data =
                await loadPiutangFirebase();


            DATA_PIUTANG =
                Array.isArray(data)
                    ? data
                    : [];


            item =
                DATA_PIUTANG.find(
                    function(row) {

                        return row.id === id;

                    }
                );

        }


        if (!item) {

            alert(
                "Data piutang tidak ditemukan."
            );

            return;

        }


        // =====================================
        // CEK PEMBAYARAN
        // =====================================

        const dibayar =
            Number(item.dibayar) || 0;


        if (dibayar > 0) {

            alert(
                "Piutang yang sudah memiliki pembayaran tidak dapat diedit."
            );

            return;

        }


        // =====================================
        // ISI FORM
        // =====================================

        const tanggal =
            document.getElementById(
                "piutangTanggal"
            );


        const nama =
            document.getElementById(
                "piutangNama"
            );


        const keterangan =
            document.getElementById(
                "piutangKeterangan"
            );


        const nominal =
            document.getElementById(
                "piutangNominal"
            );


        const jatuhTempo =
            document.getElementById(
                "piutangJatuhTempo"
            );


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
                Number(item.nominal) || 0;

        }


        if (jatuhTempo) {

            jatuhTempo.value =
                item.jatuhTempo || "";

        }


        // =====================================
        // AKTIFKAN MODE EDIT
        // =====================================

        piutangSedangDiedit =
            id;


        ubahTombolSimpanPiutang(
            "Update Piutang"
        );


        // =====================================
        // SCROLL KE FORM
        // =====================================

        const form =
            document.querySelector(
                ".form-piutang"
            );


        if (form) {

            form.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }


        console.log(
            "Edit piutang:",
            item
        );


    } catch (error) {

        console.error(
            "Edit piutang gagal:",
            error
        );


        alert(
            "Gagal membuka data piutang."
        );

    }

}


// =========================================
// RESET FORM PIUTANG
// =========================================

function resetFormPiutang() {

    const tanggal =
        document.getElementById(
            "piutangTanggal"
        );


    const nama =
        document.getElementById(
            "piutangNama"
        );


    const keterangan =
        document.getElementById(
            "piutangKeterangan"
        );


    const nominal =
        document.getElementById(
            "piutangNominal"
        );


    const jatuhTempo =
        document.getElementById(
            "piutangJatuhTempo"
        );


    if (tanggal) {

        tanggal.value =
            tanggalHariIni();

    }


    if (nama) {

        nama.value = "";

    }


    if (keterangan) {

        keterangan.value = "";

    }


    if (nominal) {

        nominal.value = "";

    }


    if (jatuhTempo) {

        jatuhTempo.value = "";

    }


    piutangSedangDiedit =
        null;


    ubahTombolSimpanPiutang();


    console.log(
        "Form Piutang direset."
    );

}


// =========================================
// BAYAR PIUTANG
// =========================================

async function bayarPiutang(id) {

    try {

        // =====================================
        // CARI DATA
        // =====================================

        let item =
            DATA_PIUTANG.find(
                function(row) {

                    return row.id === id;

                }
            );


        // =====================================
        // JIKA DATA BELUM ADA
        // LOAD ULANG
        // =====================================

        if (!item) {

            const data =
                await loadPiutangFirebase();


            DATA_PIUTANG =
                Array.isArray(data)
                    ? data
                    : [];


            item =
                DATA_PIUTANG.find(
                    function(row) {

                        return row.id === id;

                    }
                );

        }


        if (!item) {

            alert(
                "Data piutang tidak ditemukan."
            );

            return;

        }


        // =====================================
        // HITUNG DATA
        // =====================================

        const nominal =
            Number(item.nominal) || 0;


        const dibayar =
            Number(item.dibayar) || 0;


        let sisa =
            Number(item.sisa);


        if (!Number.isFinite(sisa)) {

            sisa =
                Math.max(
                    nominal - dibayar,
                    0
                );

        }


        if (sisa <= 0) {

            alert(
                "Piutang ini sudah lunas."
            );

            return;

        }


        // =====================================
        // SIMPAN PIUTANG YANG DIPILIH
        // =====================================

        PIUTANG_SEDANG_DIBAYAR =
            {

                ...item,

                nominal:
                    nominal,

                dibayar:
                    dibayar,

                sisa:
                    sisa

            };


        // =====================================
        // ISI FORM PEMBAYARAN
        // =====================================

        const nama =
            document.getElementById(
                "bayarPiutangNama"
            );


        const sisaInput =
            document.getElementById(
                "bayarPiutangSisa"
            );


        const tanggal =
            document.getElementById(
                "bayarPiutangTanggal"
            );


        const nominalInput =
            document.getElementById(
                "bayarPiutangNominal"
            );


        const media =
            document.getElementById(
                "bayarPiutangMedia"
            );


        const keterangan =
            document.getElementById(
                "bayarPiutangKeterangan"
            );


        if (nama) {

            nama.value =
                item.nama || "";

        }


        if (sisaInput) {

            sisaInput.value =
                formatRupiah(sisa);

        }


        if (tanggal) {

            tanggal.value =
                tanggalHariIni();

        }


        if (nominalInput) {

            nominalInput.value =
                "";

            nominalInput.max =
                sisa;

        }


        if (media) {

            media.value =
                "";

        }


        if (keterangan) {

            keterangan.value =
                "";

        }


        // =====================================
        // TAMPILKAN FORM
        // =====================================

        const form =
            document.getElementById(
                "form-bayar-piutang"
            );


        if (form) {

            form.style.display =
                "block";


            form.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }


        console.log(
            "Piutang siap dibayar:",
            PIUTANG_SEDANG_DIBAYAR
        );


    } catch (error) {

        console.error(
            "Buka pembayaran piutang gagal:",
            error
        );


        alert(
            "Gagal membuka pembayaran piutang."
        );

    }

}


// =========================================
// PROSES PEMBAYARAN PIUTANG
// =========================================

async function prosesBayarPiutang() {

    try {

        // =====================================
        // CEK PIUTANG
        // =====================================

        if (!PIUTANG_SEDANG_DIBAYAR) {

            alert(
                "Tidak ada piutang yang sedang dibayar."
            );

            return;

        }


        const piutangId =
            PIUTANG_SEDANG_DIBAYAR.id;


        if (!piutangId) {

            alert(
                "ID piutang tidak ditemukan."
            );

            return;

        }


        // =====================================
        // AMBIL INPUT
        // =====================================

        const tanggalInput =
            document.getElementById(
                "bayarPiutangTanggal"
            );


        const nominalInput =
            document.getElementById(
                "bayarPiutangNominal"
            );


        const mediaInput =
            document.getElementById(
                "bayarPiutangMedia"
            );


        const keteranganInput =
            document.getElementById(
                "bayarPiutangKeterangan"
            );


        if (
            !tanggalInput ||
            !nominalInput ||
            !mediaInput ||
            !keteranganInput
        ) {

            throw new Error(
                "Form pembayaran piutang tidak lengkap."
            );

        }


        const tanggal =
            tanggalInput.value;


        const nominal =
            Number(
                nominalInput.value
            );


        const media =
            mediaInput.value;


        const keterangan =
            keteranganInput.value.trim();


        // =====================================
        // DATA LAMA
        // =====================================

        const sisaLama =
            Number(
                PIUTANG_SEDANG_DIBAYAR.sisa
            ) || 0;


        const dibayarLama =
            Number(
                PIUTANG_SEDANG_DIBAYAR.dibayar
            ) || 0;


        // =====================================
        // VALIDASI
        // =====================================

        if (!tanggal) {

            alert(
                "Tanggal pembayaran wajib diisi."
            );

            return;

        }


        if (
            !Number.isFinite(nominal) ||
            nominal <= 0
        ) {

            alert(
                "Nominal pembayaran harus lebih dari 0."
            );

            return;

        }


        if (sisaLama <= 0) {

            alert(
                "Piutang ini sudah lunas."
            );

            return;

        }


        if (nominal > sisaLama) {

            alert(
                "Nominal pembayaran tidak boleh lebih besar dari sisa piutang."
            );

            return;

        }


        if (!media) {

            alert(
                "Media penerimaan wajib dipilih."
            );

            return;

        }


        // =====================================
        // HITUNG
        // =====================================

        const dibayarBaru =
            dibayarLama + nominal;


        const sisaBaru =
            Math.max(
                sisaLama - nominal,
                0
            );


        const statusBaru =
            sisaBaru <= 0
                ? "LUNAS"
                : "SEBAGIAN";


        // =====================================
        // KONFIRMASI
        // =====================================

        const konfirmasi =
            confirm(

                "Simpan pembayaran piutang sebesar " +

                formatRupiah(nominal) +

                "?"

            );


        if (!konfirmasi) {

            return;

        }


        // =====================================
        // SIMPAN KE FIREBASE
        // =====================================

        const berhasil =
            await simpanPembayaranPiutangKeTransaksi(

                {

                    piutangId:
                        piutangId,

                    tanggal:
                        tanggal,

                    nominal:
                        nominal,

                    media:
                        media,

                    nama:
                        PIUTANG_SEDANG_DIBAYAR.nama,

                    keterangan:
                        keterangan

                }

            );


        if (!berhasil) {

            throw new Error(
                "Gagal menyimpan pembayaran piutang."
            );

        }


        console.log(
            "Pembayaran berhasil:",
            {

                piutangId,
                tanggal,
                nominal,
                media,
                dibayarBaru,
                sisaBaru,
                statusBaru

            }
        );


        alert(
            "Pembayaran piutang berhasil disimpan."
        );


        // =====================================
        // TUTUP FORM
        // =====================================

        tutupFormBayarPiutang();


        // =====================================
        // LOAD ULANG
        // =====================================

        await loadDanTampilPiutang();


    } catch (error) {

        console.error(
            "Pembayaran piutang gagal:",
            error
        );


        alert(
            error.message ||
            "Pembayaran piutang gagal."
        );

    }

}


// =========================================
// TUTUP FORM PEMBAYARAN
// =========================================

function tutupFormBayarPiutang() {

    const form =
        document.getElementById(
            "form-bayar-piutang"
        );


    if (form) {

        form.style.display =
            "none";

    }


    const nama =
        document.getElementById(
            "bayarPiutangNama"
        );


    const sisa =
        document.getElementById(
            "bayarPiutangSisa"
        );


    const tanggal =
        document.getElementById(
            "bayarPiutangTanggal"
        );


    const nominal =
        document.getElementById(
            "bayarPiutangNominal"
        );


    const media =
        document.getElementById(
            "bayarPiutangMedia"
        );


    const keterangan =
        document.getElementById(
            "bayarPiutangKeterangan"
        );


    if (nama) {

        nama.value = "";

    }


    if (sisa) {

        sisa.value = "";

    }


    if (tanggal) {

        tanggal.value =
            tanggalHariIni();

    }


    if (nominal) {

        nominal.value = "";

        nominal.removeAttribute(
            "max"
        );

    }


    if (media) {

        media.value = "";

    }


    if (keterangan) {

        keterangan.value = "";

    }


    PIUTANG_SEDANG_DIBAYAR =
        null;

}


// =========================================
// HAPUS PIUTANG
// =========================================

async function hapusPiutang(id) {

    try {

        // =====================================
        // CARI DATA
        // =====================================

        let item =
            DATA_PIUTANG.find(
                function(row) {

                    return row.id === id;

                }
            );


        if (!item) {

            const data =
                await loadPiutangFirebase();


            DATA_PIUTANG =
                Array.isArray(data)
                    ? data
                    : [];


            item =
                DATA_PIUTANG.find(
                    function(row) {

                        return row.id === id;

                    }
                );

        }


        if (!item) {

            alert(
                "Data piutang tidak ditemukan."
            );

            return;

        }


        // =====================================
        // CEK PEMBAYARAN
        // =====================================

        const dibayar =
            Number(item.dibayar) || 0;


        if (dibayar > 0) {

            alert(
                "Piutang yang sudah memiliki pembayaran tidak dapat dihapus."
            );

            return;

        }


        // =====================================
        // KONFIRMASI
        // =====================================

        const konfirmasi =
            confirm(

                "Yakin ingin menghapus piutang " +

                (item.nama || "") +

                " sebesar " +

                formatRupiah(
                    Number(item.nominal) || 0
                ) +

                "?"

            );


        if (!konfirmasi) {

            return;

        }


        // =====================================
        // HAPUS
        // =====================================

        const berhasil =
            await hapusPiutangFirebase(
                id
            );


        if (!berhasil) {

            throw new Error(
                "Gagal menghapus piutang."
            );

        }


        alert(
            "Piutang berhasil dihapus."
        );


        await loadDanTampilPiutang();


    } catch (error) {

        console.error(
            "Hapus piutang gagal:",
            error
        );


        alert(
            error.message ||
            "Gagal menghapus piutang."
        );

    }

}


// =========================================
// SET TANGGAL PIUTANG
// =========================================

function setTanggalPiutang() {

    const input =
        document.getElementById(
            "piutangTanggal"
        );


    if (!input) {

        return;

    }


    if (!input.value) {

        input.value =
            tanggalHariIni();

    }

}


// =========================================
// SET TANGGAL BAYAR
// =========================================

function setTanggalBayarPiutang() {

    const input =
        document.getElementById(
            "bayarPiutangTanggal"
        );


    if (!input) {

        return;

    }


    if (!input.value) {

        input.value =
            tanggalHariIni();

    }

}


// =========================================
// SELESAI PIUTANG.JS
// =========================================

console.log(
    "piutang.js berhasil dimuat."
);
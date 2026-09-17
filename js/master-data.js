// =========================================
// MASTER DATA
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// SIAPKAN HALAMAN MASTER DATA
// =========================================

async function siapkanHalamanMasterData() {

    tampilMenuMasterData();

    console.log(
        "Halaman Master Data siap."
    );

}


// =========================================
// BUKA MASTER UNIT USAHA
// =========================================

async function bukaMasterUnitUsaha() {

    tampilMasterUnitUsaha();

    await muatUnitUsaha();

}


// =========================================
// MUAT UNIT USAHA
// =========================================

async function muatUnitUsaha() {

    const data =
        await ambilUnitUsahaFirebase();

    tampilDataUnitUsaha(data);

}


// =========================================
// SIMPAN UNIT USAHA
// =========================================

async function simpanUnitUsaha() {

    const nama =
        document
            .getElementById("unitUsahaNama")
            .value
            .trim();

    const kode =
        document
            .getElementById("unitUsahaKode")
            .value
            .trim()
            .toUpperCase();

    const keterangan =
        document
            .getElementById("unitUsahaKeterangan")
            .value
            .trim();

    const status =
        document
            .getElementById("unitUsahaStatus")
            .value;


    // =====================================
    // VALIDASI
    // =====================================

    if (!nama) {

        alert(
            "Nama unit usaha wajib diisi."
        );

        return;

    }


    if (!kode) {

        alert(
            "Kode unit usaha wajib diisi."
        );

        return;

    }


    const kodeSudahAda =
        await cekKodeUnitUsahaFirebase(
            kode
        );


    if (kodeSudahAda) {

        alert(
            "Kode unit usaha sudah digunakan."
        );

        return;

    }


    const data = {

        nama:
            nama,

        kode:
            kode,

        keterangan:
            keterangan,

        status:
            status

    };


    const berhasil =
        await simpanUnitUsahaFirebase(
            data
        );


    if (!berhasil) {

        alert(
            "Unit usaha gagal disimpan."
        );

        return;

    }


    alert(
        "Unit usaha berhasil disimpan."
    );


    tutupFormUnitUsaha();

    await muatUnitUsaha();

}


// =========================================
// UPDATE UNIT USAHA
// =========================================

async function updateUnitUsaha() {

    const id =
        document
            .getElementById("unitUsahaId")
            .value;


    const nama =
        document
            .getElementById("unitUsahaNama")
            .value
            .trim();


    const kode =
        document
            .getElementById("unitUsahaKode")
            .value
            .trim()
            .toUpperCase();


    const keterangan =
        document
            .getElementById("unitUsahaKeterangan")
            .value
            .trim();


    const status =
        document
            .getElementById("unitUsahaStatus")
            .value;


    if (!nama) {

        alert(
            "Nama unit usaha wajib diisi."
        );

        return;

    }


    if (!kode) {

        alert(
            "Kode unit usaha wajib diisi."
        );

        return;

    }


    const kodeSudahAda =
        await cekKodeUnitUsahaFirebase(
            kode,
            id
        );


    if (kodeSudahAda) {

        alert(
            "Kode unit usaha sudah digunakan oleh unit usaha lain."
        );

        return;

    }


    const data = {

        nama:
            nama,

        kode:
            kode,

        keterangan:
            keterangan,

        status:
            status

    };


    const berhasil =
        await updateUnitUsahaFirebase(
            id,
            data
        );


    if (!berhasil) {

        alert(
            "Unit usaha gagal diperbarui."
        );

        return;

    }


    alert(
        "Unit usaha berhasil diperbarui."
    );


    tutupFormUnitUsaha();

    await muatUnitUsaha();

}


// =========================================
// HAPUS UNIT USAHA
// =========================================

async function hapusUnitUsaha(id) {

    const yakin =
        confirm(
            "Apakah unit usaha ini benar-benar ingin dihapus?"
        );


    if (!yakin) {

        return;

    }


    const berhasil =
        await hapusUnitUsahaFirebase(
            id
        );


    if (!berhasil) {

        alert(
            "Unit usaha gagal dihapus."
        );

        return;

    }


    alert(
        "Unit usaha berhasil dihapus."
    );


    await muatUnitUsaha();

}


// =========================================
// PASANG MASTER UNIT USAHA RESMI
// =========================================

async function pasangMasterUnitUsahaResmi() {

    const yakin =
        confirm(
            "Pasang Master Unit Usaha resmi sekarang?\n\n" +
            "Unit usaha yang sudah ada tidak akan ditimpa " +
            "dan tidak akan dibuat duplikat."
        );


    if (!yakin) {

        return;

    }


    const daftarUnit = [

        {
            nama:
                "Pengelolaan Sampah",

            kode:
                "PENGELOLAAN_SAMPAH",

            keterangan:
                "Unit usaha pengelolaan sampah",

            status:
                "aktif"
        },

        {
            nama:
                "Ayam Petelur",

            kode:
                "AYAM_PETELUR",

            keterangan:
                "Unit usaha peternakan ayam petelur",

            status:
                "aktif"
        },

        {
            nama:
                "Bank Sampah",

            kode:
                "BANK_SAMPAH",

            keterangan:
                "Unit usaha bank sampah",

            status:
                "aktif"
        },

        {
            nama:
                "Affiliate",

            kode:
                "AFFILIATE",

            keterangan:
                "Unit usaha pendapatan affiliate",

            status:
                "aktif"
        }

    ];


    let jumlah =
        0;


    for (
        const unit of daftarUnit
    ) {

        try {

            const sudahAda =
                await cekKodeUnitUsahaFirebase(
                    unit.kode
                );


            if (sudahAda) {

                console.log(
                    "Unit usaha sudah ada:",
                    unit.kode
                );

                continue;

            }


            const berhasil =
                await simpanUnitUsahaFirebase(
                    unit
                );


            if (berhasil) {

                jumlah++;

            }

        } catch (error) {

            console.error(
                "Gagal memasang unit usaha:",
                unit.kode,
                error
            );

        }

    }


    alert(
        "Master Unit Usaha resmi berhasil diproses.\n\n" +
        "Unit usaha baru ditambahkan: " +
        jumlah
    );


    await muatUnitUsaha();

}


// =========================================
// BUKA MASTER AKUN
// =========================================

async function bukaMasterAkun() {

    tampilMasterAkun();

    await muatAkun();

}


// =========================================
// MUAT AKUN
// =========================================

async function muatAkun() {

    const data =
        await ambilAkunFirebase();

    tampilDataAkun(data);

}


// =========================================
// PASANG MASTER AKUN RESMI
// =========================================

async function pasangMasterAkunResmi() {

    const yakin =
        confirm(
            "Pasang Master Akun resmi sekarang?\n\n" +
            "Akun yang sudah ada tidak akan ditimpa " +
            "dan tidak akan dibuat duplikat."
        );


    if (!yakin) {

        return;

    }


    const hasil =
        await inisialisasiMasterAkunResmi();


    if (
        !hasil ||
        !hasil.berhasil
    ) {

        alert(
            "Master Akun gagal dipasang."
        );

        return;

    }


    alert(
        "Master Akun resmi berhasil diproses.\n\n" +
        "Akun baru ditambahkan: " +
        hasil.jumlah
    );


    await muatAkun();

}


// =========================================
// LENGKAPI UNIT USAHA AKUN PENDAPATAN
// =========================================

async function prosesLengkapiUnitUsahaAkunPendapatan() {

    const yakin =
        confirm(
            "Lengkapi hubungan akun pendapatan dengan unit usaha?\n\n" +
            "Hanya akun 4100 sampai 4410 yang sesuai " +
            "akan diperbarui."
        );


    if (!yakin) {

        return;

    }


    const hasil =
        await lengkapiUnitUsahaAkunPendapatan();


    if (
        !hasil ||
        !hasil.berhasil
    ) {

        alert(
            "Proses gagal. Silakan cek Console."
        );

        return;

    }


    alert(
        "Proses berhasil.\n\n" +
        "Akun yang diperbarui: " +
        hasil.jumlah
    );


    await muatAkun();

}


// =========================================
// LENGKAPI UNIT USAHA AKUN BEBAN
// =========================================

async function prosesLengkapiUnitUsahaAkunBeban() {

    const yakin =
        confirm(
            "Lengkapi hubungan akun beban dengan unit usaha?\n\n" +
            "Akun 5100–5410 yang sesuai akan diperbarui.\n\n" +
            "Data transaksi lama tidak akan dihapus."
        );


    if (!yakin) {

        return;

    }


    const hasil =
        await lengkapiUnitUsahaAkunBeban();


    if (
        !hasil ||
        !hasil.berhasil
    ) {

        alert(
            "Proses gagal. Silakan cek Console."
        );

        return;

    }


    alert(
        "Proses berhasil.\n\n" +
        "Akun beban yang diperbarui: " +
        hasil.jumlah
    );


    await muatAkun();

}


// =========================================
// SIMPAN AKUN
// =========================================

async function simpanAkun() {

    const kode =
        document
            .getElementById("akunKode")
            .value
            .trim()
            .toUpperCase();


    const nama =
        document
            .getElementById("akunNama")
            .value
            .trim();


    const jenis =
        document
            .getElementById("akunJenis")
            .value;


    const unitUsahaElement =
        document.getElementById(
            "akunUnitUsaha"
        );


    const unitUsaha =
        (
            jenis === "pendapatan" ||
            jenis === "beban"
        ) &&
        unitUsahaElement
            ? unitUsahaElement.value
            : "";


    const keterangan =
        document
            .getElementById("akunKeterangan")
            .value
            .trim();


    const status =
        document
            .getElementById("akunStatus")
            .value;


    // =====================================
    // VALIDASI
    // =====================================

    if (!kode) {

        alert(
            "Kode akun wajib diisi."
        );

        return;

    }


    if (!nama) {

        alert(
            "Nama akun wajib diisi."
        );

        return;

    }


    if (!jenis) {

        alert(
            "Jenis akun wajib dipilih."
        );

        return;

    }


    // =====================================
    // VALIDASI UNIT USAHA
    // =====================================

    if (
        (
            jenis === "pendapatan" ||
            jenis === "beban"
        ) &&
        !unitUsaha
    ) {

        alert(
            "Unit usaha wajib dipilih untuk akun pendapatan dan beban."
        );

        return;

    }


    // =====================================
    // CEK KODE DUPLIKAT
    // =====================================

    const kodeSudahAda =
        await cekKodeAkunFirebase(
            kode
        );


    if (kodeSudahAda) {

        alert(
            "Kode akun sudah digunakan."
        );

        return;

    }


    // =====================================
    // DATA
    // =====================================

    const data = {

        kode:
            kode,

        nama:
            nama,

        jenis:
            jenis,

        unitUsaha:
            unitUsaha,

        keterangan:
            keterangan,

        status:
            status

    };


    // =====================================
    // SIMPAN FIREBASE
    // =====================================

    const berhasil =
        await simpanAkunFirebase(
            data
        );


    if (!berhasil) {

        alert(
            "Akun gagal disimpan."
        );

        return;

    }


    alert(
        "Akun berhasil disimpan."
    );


    tutupFormAkun();

    await muatAkun();

}


// =========================================
// UPDATE AKUN
// =========================================

async function updateAkun() {

    const id =
        document
            .getElementById("akunId")
            .value;


    const kode =
        document
            .getElementById("akunKode")
            .value
            .trim()
            .toUpperCase();


    const nama =
        document
            .getElementById("akunNama")
            .value
            .trim();


    const jenis =
        document
            .getElementById("akunJenis")
            .value;


    const unitUsahaElement =
        document.getElementById(
            "akunUnitUsaha"
        );


    const unitUsaha =
        (
            jenis === "pendapatan" ||
            jenis === "beban"
        ) &&
        unitUsahaElement
            ? unitUsahaElement.value
            : "";


    const keterangan =
        document
            .getElementById("akunKeterangan")
            .value
            .trim();


    const status =
        document
            .getElementById("akunStatus")
            .value;


    // =====================================
    // VALIDASI
    // =====================================

    if (!kode) {

        alert(
            "Kode akun wajib diisi."
        );

        return;

    }


    if (!nama) {

        alert(
            "Nama akun wajib diisi."
        );

        return;

    }


    if (!jenis) {

        alert(
            "Jenis akun wajib dipilih."
        );

        return;

    }


    // =====================================
    // VALIDASI UNIT USAHA
    // =====================================

    if (
        (
            jenis === "pendapatan" ||
            jenis === "beban"
        ) &&
        !unitUsaha
    ) {

        alert(
            "Unit usaha wajib dipilih untuk akun pendapatan dan beban."
        );

        return;

    }


    // =====================================
    // CEK KODE DUPLIKAT
    // =====================================

    const kodeSudahAda =
        await cekKodeAkunFirebase(
            kode,
            id
        );


    if (kodeSudahAda) {

        alert(
            "Kode akun sudah digunakan oleh akun lain."
        );

        return;

    }


    // =====================================
    // DATA
    // =====================================

    const data = {

        kode:
            kode,

        nama:
            nama,

        jenis:
            jenis,

        unitUsaha:
            unitUsaha,

        keterangan:
            keterangan,

        status:
            status

    };


    // =====================================
    // UPDATE FIREBASE
    // =====================================

    const berhasil =
        await updateAkunFirebase(
            id,
            data
        );


    if (!berhasil) {

        alert(
            "Akun gagal diperbarui."
        );

        return;

    }


    alert(
        "Akun berhasil diperbarui."
    );


    tutupFormAkun();

    await muatAkun();

}


// =========================================
// HAPUS AKUN
// =========================================

async function hapusAkun(id) {

    const yakin =
        confirm(
            "Apakah akun ini benar-benar ingin dihapus?"
        );


    if (!yakin) {

        return;

    }


    const digunakan =
        await cekAkunDigunakanFirebase(
            id
        );


    if (digunakan) {

        alert(
            "Akun tidak dapat dihapus karena sudah digunakan dalam transaksi.\n\n" +
            "Silakan ubah status akun menjadi Nonaktif."
        );

        return;

    }


    const berhasil =
        await hapusAkunFirebase(
            id
        );


    if (!berhasil) {

        alert(
            "Akun gagal dihapus."
        );

        return;

    }


    alert(
        "Akun berhasil dihapus."
    );


    await muatAkun();

}

// =========================================
// PELANGGAN
// =========================================

async function bukaMasterPihak() {

    try {

        await tampilMasterPihak();

        await muatPelanggan();

    } catch (error) {

        console.error(
            "Buka master pelanggan gagal:",
            error
        );

    }

}


// =========================================
// MUAT PELANGGAN
// =========================================

async function muatPelanggan() {

    try {

        const data =
            await ambilPelangganFirebase();

        if (
            typeof tampilDataPelanggan ===
            "function"
        ) {

            tampilDataPelanggan(data);

        }

        return data;

    } catch (error) {

        console.error(
            "Muat pelanggan gagal:",
            error
        );

        return [];

    }

}


// =========================================
// BUAT KODE PELANGGAN
// =========================================

async function buatKodePelanggan() {

    try {

        const data =
            await ambilPelangganFirebase();


        let nomorTerbesar =
            0;


        data.forEach(function(item) {

            const kode =
                String(item.kode || "");


            if (
                kode.startsWith("PLG")
            ) {

                const nomor =
                    parseInt(
                        kode.substring(3),
                        10
                    );


                if (
                    !isNaN(nomor) &&
                    nomor > nomorTerbesar
                ) {

                    nomorTerbesar =
                        nomor;

                }

            }

        });


        const nomorBaru =
            nomorTerbesar + 1;


        return (
            "PLG" +
            String(nomorBaru)
                .padStart(4, "0")
        );


    } catch (error) {

        console.error(
            "Buat kode pelanggan gagal:",
            error
        );


        return "PLG0001";

    }

}


// =========================================
// SIMPAN PELANGGAN
// =========================================

async function simpanPelanggan() {

    try {

        const namaElement =
            document.getElementById(
                "pelangganNama"
            );


        const noHpElement =
            document.getElementById(
                "pelangganNoHp"
            );


        const alamatElement =
            document.getElementById(
                "pelangganAlamat"
            );


        const jenisElement =
            document.getElementById(
                "pelangganJenis"
            );


        const cakupanElement =
            document.getElementById(
                "pelangganCakupan"
            );


        const unitElement =
            document.getElementById(
                "pelangganUnitUsaha"
            );


        const keteranganElement =
            document.getElementById(
                "pelangganKeterangan"
            );


        const nama =
            namaElement
                ? namaElement.value.trim()
                : "";


        if (!nama) {

            alert(
                "Nama pelanggan wajib diisi."
            );

            return;

        }


        const kode =
            await buatKodePelanggan();


        const data = {

            kode:
                kode,

            nama:
                nama,

            noHp:
                noHpElement
                    ? noHpElement.value.trim()
                    : "",

            alamat:
                alamatElement
                    ? alamatElement.value.trim()
                    : "",

            jenis:
                jenisElement
                    ? jenisElement.value
                    : "perorangan",

            // =================================
            // KETERIKATAN WILAYAH
            // =================================
            // Default pelanggan lama / normal
            // adalah terikat RT / RW

            cakupan:
                cakupanElement
                    ? cakupanElement.value
                    : "wilayah",

            unitUsaha:
                unitElement
                    ? unitElement.value
                    : "",

            keterangan:
                keteranganElement
                    ? keteranganElement.value.trim()
                    : "",

            status:
                "aktif"

        };


        const berhasil =
            await simpanPelangganFirebase(
                data
            );


        if (!berhasil) {

            alert(
                "Pelanggan gagal disimpan."
            );

            return;

        }


        alert(
            "Pelanggan berhasil disimpan."
        );


        if (
            typeof tampilMasterPihak ===
            "function"
        ) {

            await tampilMasterPihak();

        }


        await muatPelanggan();


    } catch (error) {

        console.error(
            "Simpan pelanggan gagal:",
            error
        );

        alert(
            "Terjadi kesalahan saat menyimpan pelanggan."
        );

    }

}


// =========================================
// UPDATE PELANGGAN
// =========================================

async function updatePelanggan(id) {

    try {

        const namaElement =
            document.getElementById(
                "pelangganNama"
            );


        const noHpElement =
            document.getElementById(
                "pelangganNoHp"
            );


        const alamatElement =
            document.getElementById(
                "pelangganAlamat"
            );


        const jenisElement =
            document.getElementById(
                "pelangganJenis"
            );


        const cakupanElement =
            document.getElementById(
                "pelangganCakupan"
            );


        const unitElement =
            document.getElementById(
                "pelangganUnitUsaha"
            );


        const keteranganElement =
            document.getElementById(
                "pelangganKeterangan"
            );


        const nama =
            namaElement
                ? namaElement.value.trim()
                : "";


        if (!nama) {

            alert(
                "Nama pelanggan wajib diisi."
            );

            return;

        }


        const data = {

            kode:
                document.getElementById(
                    "pelangganKode"
                )?.value.trim() || "",

            nama:
                nama,

            noHp:
                noHpElement
                    ? noHpElement.value.trim()
                    : "",

            alamat:
                alamatElement
                    ? alamatElement.value.trim()
                    : "",

            jenis:
                jenisElement
                    ? jenisElement.value
                    : "perorangan",

            // =================================
            // KETERIKATAN WILAYAH
            // =================================
            // Jika data lama belum mempunyai
            // cakupan, tetap dianggap wilayah.

            cakupan:
                cakupanElement
                    ? cakupanElement.value
                    : "wilayah",

            unitUsaha:
                unitElement
                    ? unitElement.value
                    : "",

            keterangan:
                keteranganElement
                    ? keteranganElement.value.trim()
                    : "",

            status:
                document.getElementById(
                    "pelangganStatus"
                )?.value || "aktif"

        };


        const berhasil =
            await updatePelangganFirebase(
                id,
                data
            );


        if (!berhasil) {

            alert(
                "Pelanggan gagal diperbarui."
            );

            return;

        }


        alert(
            "Pelanggan berhasil diperbarui."
        );


        await tampilMasterPihak();

        await muatPelanggan();


    } catch (error) {

        console.error(
            "Update pelanggan gagal:",
            error
        );

        alert(
            "Terjadi kesalahan saat memperbarui pelanggan."
        );

    }

}


// =========================================
// HAPUS PELANGGAN
// =========================================

async function hapusPelanggan(id) {

    try {

        const yakin =
            confirm(
                "Yakin ingin menghapus pelanggan ini?"
            );


        if (!yakin) {

            return;

        }


        const berhasil =
            await hapusPelangganFirebase(
                id
            );


        if (!berhasil) {

            alert(
                "Pelanggan gagal dihapus."
            );

            return;

        }


        alert(
            "Pelanggan berhasil dihapus."
        );


        await tampilMasterPihak();

        await muatPelanggan();


    } catch (error) {

        console.error(
            "Hapus pelanggan gagal:",
            error
        );

        alert(
            "Terjadi kesalahan saat menghapus pelanggan."
        );

    }

}



 // =========================================
 // SUPPLIER
 // =========================================

async function bukaMasterSupplier() {

    try {

        await tampilMasterSupplier();

        await muatSupplier();

    } catch (error) {

        console.error(
            "Buka master supplier gagal:",
            error
        );

    }

}


// =========================================
// MUAT SUPPLIER
// =========================================

async function muatSupplier() {

    try {

        const data =
            await ambilSupplierFirebase();

        if (
            typeof tampilDataSupplier ===
            "function"
        ) {

            tampilDataSupplier(data);

        }

        return data;

    } catch (error) {

        console.error(
            "Muat supplier gagal:",
            error
        );

        return [];

    }

}


// =========================================
// BUAT KODE SUPPLIER
// =========================================

async function buatKodeSupplier() {

    try {

        const data =
            await ambilSupplierFirebase();


        let nomorTerbesar =
            0;


        data.forEach(function(item) {

            const kode =
                String(item.kode || "");


            if (
                kode.startsWith("SUP")
            ) {

                const nomor =
                    parseInt(
                        kode.substring(3),
                        10
                    );


                if (
                    !isNaN(nomor) &&
                    nomor > nomorTerbesar
                ) {

                    nomorTerbesar =
                        nomor;

                }

            }

        });


        const nomorBaru =
            nomorTerbesar + 1;


        return (
            "SUP" +
            String(nomorBaru)
                .padStart(4, "0")
        );


    } catch (error) {

        console.error(
            "Buat kode supplier gagal:",
            error
        );


        return "SUP0001";

    }

}


// =========================================
// SIMPAN SUPPLIER
// =========================================

async function simpanSupplier() {

    try {

        const namaElement =
            document.getElementById(
                "supplierNama"
            );


        const noHpElement =
            document.getElementById(
                "supplierNoHp"
            );


        const alamatElement =
            document.getElementById(
                "supplierAlamat"
            );


        const jenisElement =
            document.getElementById(
                "supplierJenis"
            );


        const unitElement =
            document.getElementById(
                "supplierUnitUsaha"
            );


        const keteranganElement =
            document.getElementById(
                "supplierKeterangan"
            );


        const nama =
            namaElement
                ? namaElement.value.trim()
                : "";


        if (!nama) {

            alert(
                "Nama supplier wajib diisi."
            );

            return;

        }


        const kode =
            await buatKodeSupplier();


        const data = {

            kode:
                kode,

            nama:
                nama,

            noHp:
                noHpElement
                    ? noHpElement.value.trim()
                    : "",

            alamat:
                alamatElement
                    ? alamatElement.value.trim()
                    : "",

            jenis:
                jenisElement
                    ? jenisElement.value
                    : "perorangan",

            unitUsaha:
                unitElement
                    ? unitElement.value
                    : "",

            keterangan:
                keteranganElement
                    ? keteranganElement.value.trim()
                    : "",

            status:
                "aktif"

        };


        const berhasil =
            await simpanSupplierFirebase(
                data
            );


        if (!berhasil) {

            alert(
                "Supplier gagal disimpan."
            );

            return;

        }


        alert(
            "Supplier berhasil disimpan."
        );


        await tampilMasterSupplier();

        await muatSupplier();


    } catch (error) {

        console.error(
            "Simpan supplier gagal:",
            error
        );

        alert(
            "Terjadi kesalahan saat menyimpan supplier."
        );

    }

}


// =========================================
// UPDATE SUPPLIER
// =========================================

async function updateSupplier(id) {

    try {

        const namaElement =
            document.getElementById(
                "supplierNama"
            );


        const noHpElement =
            document.getElementById(
                "supplierNoHp"
            );


        const alamatElement =
            document.getElementById(
                "supplierAlamat"
            );


        const jenisElement =
            document.getElementById(
                "supplierJenis"
            );


        const unitElement =
            document.getElementById(
                "supplierUnitUsaha"
            );


        const keteranganElement =
            document.getElementById(
                "supplierKeterangan"
            );


        const statusElement =
            document.getElementById(
                "supplierStatus"
            );


        const nama =
            namaElement
                ? namaElement.value.trim()
                : "";


        if (!nama) {

            alert(
                "Nama supplier wajib diisi."
            );

            return;

        }


        const data = {

            kode:
                document.getElementById(
                    "supplierKode"
                )?.value.trim() || "",

            nama:
                nama,

            noHp:
                noHpElement
                    ? noHpElement.value.trim()
                    : "",

            alamat:
                alamatElement
                    ? alamatElement.value.trim()
                    : "",

            jenis:
                jenisElement
                    ? jenisElement.value
                    : "perorangan",

            unitUsaha:
                unitElement
                    ? unitElement.value
                    : "",

            keterangan:
                keteranganElement
                    ? keteranganElement.value.trim()
                    : "",

            status:
                statusElement
                    ? statusElement.value
                    : "aktif"

        };


        const berhasil =
            await updateSupplierFirebase(
                id,
                data
            );


        if (!berhasil) {

            alert(
                "Supplier gagal diperbarui."
            );

            return;

        }


        alert(
            "Supplier berhasil diperbarui."
        );


        await tampilMasterSupplier();

        await muatSupplier();


    } catch (error) {

        console.error(
            "Update supplier gagal:",
            error
        );

        alert(
            "Terjadi kesalahan saat memperbarui supplier."
        );

    }

}


// =========================================
// HAPUS SUPPLIER
// =========================================

async function hapusSupplier(id) {

    try {

        const yakin =
            confirm(
                "Yakin ingin menghapus supplier ini?"
            );


        if (!yakin) {

            return;

        }


        const berhasil =
            await hapusSupplierFirebase(
                id
            );


        if (!berhasil) {

            alert(
                "Supplier gagal dihapus."
            );

            return;

        }


        alert(
            "Supplier berhasil dihapus."
        );


        await tampilMasterSupplier();

        await muatSupplier();


    } catch (error) {

        console.error(
            "Hapus supplier gagal:",
            error
        );

        alert(
            "Terjadi kesalahan saat menghapus supplier."
        );

    }

}

// =========================================
// MASTER DATA ASET
// =========================================


// =========================================
// BUKA MASTER ASET
// =========================================

async function bukaMasterAset() {

    try {

        await tampilMasterAset();

        await muatAset();

    } catch (error) {

        console.error(
            "Buka master aset gagal:",
            error
        );

    }

}


// =========================================
// MUAT DATA ASET
// =========================================

async function muatAset() {

    try {

        const data =
            await ambilMasterAsetFirebase();


        tampilDataAset(data);


    } catch (error) {

        console.error(
            "Muat aset gagal:",
            error
        );

    }

}

// =========================================
// BUAT KODE ASET
// =========================================

async function buatKodeAset() {

    try {

        const data =
            await ambilMasterAsetFirebase();


        let nomorTerbesar =
            0;


        data.forEach(function(item) {

            const kode =
                String(
                    item.kode || ""
                ).toUpperCase();


            if (
                kode.startsWith("AST")
            ) {

                const nomor =
                    parseInt(
                        kode.substring(3),
                        10
                    );


                if (
                    !isNaN(nomor) &&
                    nomor > nomorTerbesar
                ) {

                    nomorTerbesar =
                        nomor;

                }

            }

        });


        const nomorBaru =
            nomorTerbesar + 1;


        return (
            "AST" +
            String(nomorBaru)
                .padStart(4, "0")
        );


    } catch (error) {

        console.error(
            "Buat kode aset gagal:",
            error
        );


        return "AST0001";

    }

}


// =========================================
// SIMPAN ASET
// =========================================

async function simpanAset() {

    try {

        const inputNama =
            document.querySelector(
                "#form-aset #asetNama"
            );


        const nama =
            inputNama
                ? inputNama.value.trim()
                : "";


        console.log(
            "Nama aset:",
            nama
        );


        if (!nama) {

            alert(
                "Nama aset wajib diisi."
            );

            return;

        }


        const inputTahun =
            document.querySelector(
                "#form-aset #asetTahunPerolehan"
            );


        const tahunPerolehan =
            inputTahun
                ? Number(inputTahun.value)
                : 0;


        if (
            !tahunPerolehan ||
            tahunPerolehan < 1900 ||
            tahunPerolehan > 2100
        ) {

            alert(
                "Tahun perolehan wajib diisi dengan benar."
            );

            return;

        }


        const kode =
            await buatKodeAset();


        const data = {

            kode:
                kode,

            nama:
                nama,

            jenis:
                document.querySelector(
                    "#form-aset #asetJenis"
                )?.value ||
                "tetap",

            unitUsaha:
                document.querySelector(
                    "#form-aset #asetUnitUsaha"
                )?.value ||
                "",

            tahunPerolehan:
                tahunPerolehan,

            hargaPerolehan:
                Number(
                    document.querySelector(
                        "#form-aset #asetHargaPerolehan"
                    )?.value
                ) || 0,

            umurManfaat:
                Number(
                    document.querySelector(
                        "#form-aset #asetUmurManfaat"
                    )?.value
                ) || 0,

            nilaiSisa:
                Number(
                    document.querySelector(
                        "#form-aset #asetNilaiSisa"
                    )?.value
                ) || 0,

            keterangan:
                document.querySelector(
                    "#form-aset #asetKeterangan"
                )?.value.trim() ||
                "",

            status:
                "aktif"

        };


        console.log(
            "Data aset yang akan disimpan:",
            data
        );


        const berhasil =
            await simpanMasterAsetFirebase(
                data
            );


        if (!berhasil) {

            alert(
                "Aset gagal disimpan."
            );

            return;

        }


        alert(
            "Aset berhasil disimpan."
        );


        await muatAset();

        tutupFormAset();


    } catch (error) {

        console.error(
            "Simpan aset gagal:",
            error
        );


        alert(
            "Terjadi kesalahan saat menyimpan aset."
        );

    }

}


// =========================================
// UPDATE ASET
// =========================================

async function updateAset(id) {

    try {

        const form =
            document.querySelector(
                "#form-aset"
            );


        if (!form) {

            alert(
                "Form aset tidak ditemukan."
            );

            return;

        }


        const inputNama =
            form.querySelector(
                "#asetNama"
            );


        const nama =
            inputNama
                ? inputNama.value.trim()
                : "";


        console.log(
            "Nama aset saat update:",
            nama
        );


        if (!nama) {

            alert(
                "Nama aset wajib diisi."
            );

            return;

        }


        const inputTahun =
            form.querySelector(
                "#asetTahunPerolehan"
            );


        const tahunPerolehan =
            inputTahun
                ? Number(inputTahun.value)
                : 0;


        if (
            !tahunPerolehan ||
            tahunPerolehan < 1900 ||
            tahunPerolehan > 2100
        ) {

            alert(
                "Tahun perolehan wajib diisi dengan benar."
            );

            return;

        }


        const data = {

            kode:
                form.querySelector(
                    "#asetKode"
                )?.value.trim() ||
                "",

            nama:
                nama,

            jenis:
                form.querySelector(
                    "#asetJenis"
                )?.value ||
                "tetap",

            unitUsaha:
                form.querySelector(
                    "#asetUnitUsaha"
                )?.value ||
                "",

            tahunPerolehan:
                tahunPerolehan,

            hargaPerolehan:
                Number(
                    form.querySelector(
                        "#asetHargaPerolehan"
                    )?.value
                ) || 0,

            umurManfaat:
                Number(
                    form.querySelector(
                        "#asetUmurManfaat"
                    )?.value
                ) || 0,

            nilaiSisa:
                Number(
                    form.querySelector(
                        "#asetNilaiSisa"
                    )?.value
                ) || 0,

            keterangan:
                form.querySelector(
                    "#asetKeterangan"
                )?.value.trim() ||
                "",

            status:
                form.querySelector(
                    "#asetStatus"
                )?.value ||
                "aktif"

        };


        console.log(
            "Data aset yang akan diperbarui:",
            data
        );


        const berhasil =
            await updateMasterAsetFirebase(
                id,
                data
            );


        if (!berhasil) {

            alert(
                "Aset gagal diperbarui."
            );

            return;

        }


        alert(
            "Aset berhasil diperbarui."
        );


        await muatAset();

        tutupFormAset();


    } catch (error) {

        console.error(
            "Update aset gagal:",
            error
        );


        alert(
            "Terjadi kesalahan saat memperbarui aset."
        );

    }

}
// =========================================
// HAPUS ASET
// =========================================

async function hapusAset(id) {

    try {

        if (!id) {

            return;

        }


        const yakin =
            confirm(
                "Apakah Anda yakin ingin menghapus aset ini?"
            );


        if (!yakin) {

            return;

        }


        const berhasil =
    await hapusMasterAsetFirebase(
        id
    );


        if (!berhasil) {

            alert(
                "Aset gagal dihapus."
            );

            return;

        }


        alert(
            "Aset berhasil dihapus."
        );


        await muatAset();


    } catch (error) {

        console.error(
            "Hapus aset gagal:",
            error
        );


        alert(
            "Terjadi kesalahan saat menghapus aset."
        );

    }

}


 



// =========================================
// GLOBAL
// =========================================

window.siapkanHalamanMasterData =
    siapkanHalamanMasterData;

window.bukaMasterUnitUsaha =
    bukaMasterUnitUsaha;

window.bukaMasterAkun =
    bukaMasterAkun;

window.bukaMasterPihak =
    bukaMasterPihak;

window.bukaMasterSupplier =
    bukaMasterSupplier;

window.bukaMasterAset =
    bukaMasterAset;

window.simpanUnitUsaha =
    simpanUnitUsaha;

window.updateUnitUsaha =
    updateUnitUsaha;

window.hapusUnitUsaha =
    hapusUnitUsaha;

window.muatAkun =
    muatAkun;

window.simpanAkun =
    simpanAkun;

window.updateAkun =
    updateAkun;

window.hapusAkun =
    hapusAkun;

window.pasangMasterUnitUsahaResmi =
    pasangMasterUnitUsahaResmi;

window.pasangMasterAkunResmi =
    pasangMasterAkunResmi;

window.prosesLengkapiUnitUsahaAkunPendapatan =
    prosesLengkapiUnitUsahaAkunPendapatan;

window.prosesLengkapiUnitUsahaAkunBeban =
    prosesLengkapiUnitUsahaAkunBeban;
	
window.bukaMasterPihak =
    bukaMasterPihak;

window.muatPelanggan =
    muatPelanggan;

window.buatKodePelanggan =
    buatKodePelanggan;

window.simpanPelanggan =
    simpanPelanggan;

window.updatePelanggan =
    updatePelanggan;

window.hapusPelanggan =
    hapusPelanggan;
	
window.bukaMasterSupplier =
    bukaMasterSupplier;

window.muatSupplier =
    muatSupplier;

window.buatKodeSupplier =
    buatKodeSupplier;

window.simpanSupplier =
    simpanSupplier;

window.updateSupplier =
    updateSupplier;

window.hapusSupplier =
    hapusSupplier;
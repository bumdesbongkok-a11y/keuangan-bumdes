// =========================================
// LABA RUGI FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// ATURAN AKUNTANSI
//
// 1. Modal bukan pendapatan.
// 2. Transfer bukan pendapatan/beban.
// 3. Pembelian aset bukan beban.
// 4. Penerimaan piutang bukan pendapatan.
// 5. Pembayaran utang bukan beban.
// 6. Penyusutan adalah beban nonkas.
// 7. Penyusutan DIAMBIL dari:
//      window.hitungDepresiasiPeriodeNeracaFirebase()
//    sehingga rumus penyusutan sama dengan Neraca.
// 8. Total Beban = Beban Transaksi + Beban Penyusutan.
// 9. Laba/Rugi = Pendapatan - Total Beban.
//
// =========================================


// =========================================
// KONFIGURASI
// =========================================

const LABA_RUGI_UNIT_USAHA = {

    PENGELOLAAN_SAMPAH: {
        nama: "Pengelolaan Sampah"
    },

    AYAM_PETELUR: {
        nama: "Ayam Petelur"
    },

    BANK_SAMPAH: {
        nama: "Bank Sampah"
    },

    AFFILIATE: {
        nama: "Affiliate"
    }

};


// =========================================
// NOMINAL
// =========================================

function nominalLabaRugiFirebase(item) {

    return Number(
        item?.nominal ??
        item?.jumlah ??
        item?.nilai ??
        item?.nilaiPerolehan ??
        item?.harga ??
        item?.total ??
        0
    ) || 0;

}


// =========================================
// TANGGAL
// =========================================

function tanggalLabaRugiFirebase(item) {

    if (!item) {
        return null;
    }


    const nilai =
        item.tanggal;


    if (!nilai) {
        return null;
    }


    // Firebase Timestamp

    if (
        typeof nilai.toDate === "function"
    ) {

        const tanggal =
            nilai.toDate();


        if (
            !isNaN(
                tanggal.getTime()
            )
        ) {

            return tanggal;

        }

    }


    // Date

    if (
        nilai instanceof Date
    ) {

        if (
            !isNaN(
                nilai.getTime()
            )
        ) {

            return nilai;

        }

    }


    // String

    if (
        typeof nilai === "string"
    ) {

        const tanggal =
            new Date(
                nilai.length <= 10
                    ? nilai + "T00:00:00"
                    : nilai
            );


        if (
            !isNaN(
                tanggal.getTime()
            )
        ) {

            return tanggal;

        }

    }


    return null;

}


// =========================================
// CEK TANGGAL DALAM PERIODE
// =========================================

function transaksiDalamPeriodeLabaRugiFirebase(
    tanggal,
    dari,
    sampai
) {

    const item =
        tanggalLabaRugiFirebase({
            tanggal: tanggal
        });


    if (!item) {
        return false;
    }


    const awal =
        new Date(
            dari + "T00:00:00"
        );


    const akhir =
        new Date(
            sampai + "T23:59:59"
        );


    return (
        item >= awal &&
        item <= akhir
    );

}


// =========================================
// CEK TRANSAKSI ASET
// =========================================

function transaksiAdalahAsetLabaRugiFirebase(
    item
) {

    const jenis =
        String(
            item?.jenisTransaksi || ""
        ).toUpperCase();


    if (
        jenis !== "PENGELUARAN"
    ) {

        return false;

    }


    const jenisPengeluaran =
        String(
            item?.jenisPengeluaran || ""
        ).toUpperCase();


    const akunKode =
        String(
            item?.akunKode || ""
        ).toUpperCase();


    return (
        jenisPengeluaran === "ASET" ||
        akunKode === "1400"
    );

}


// =========================================
// CEK UNIT
// =========================================

function buatStrukturUnitLabaRugiFirebase() {

    const hasil = {};


    Object.keys(
        LABA_RUGI_UNIT_USAHA
    ).forEach(
        function(kode) {

            hasil[kode] = {

                kode:
                    kode,

                nama:
                    LABA_RUGI_UNIT_USAHA[
                        kode
                    ].nama,

                pendapatan: [],

                beban: [],

                totalPendapatan:
                    0,

                totalBebanTransaksi:
                    0,

                depresiasi:
                    0,

                totalBeban:
                    0,

                labaRugi:
                    0

            };

        }
    );


    return hasil;

}


// =========================================
// AMBIL NAMA AKUN
// =========================================

function namaAkunLabaRugiFirebase(item) {

    return (

        item?.akunNama ||

        item?.namaAkun ||

        item?.nama ||

        item?.keterangan ||

        "Tanpa Nama Akun"

    );

}


// =========================================
// AMBIL UNIT
// =========================================

function unitLabaRugiFirebase(item) {

    return String(
        item?.unitUsaha || ""
    ).toUpperCase();

}


// =========================================
// PROSES PEMASUKAN
// =========================================

function prosesPemasukanLabaRugiFirebase(
    pemasukan,
    unitUsaha,
    dari,
    sampai
) {

    pemasukan.forEach(
        function(item) {

            // -------------------------------------
            // TANGGAL
            // -------------------------------------

            if (
                !transaksiDalamPeriodeLabaRugiFirebase(
                    item.tanggal,
                    dari,
                    sampai
                )
            ) {

                return;

            }


            // -------------------------------------
            // NOMINAL
            // -------------------------------------

            const nominal =
                nominalLabaRugiFirebase(
                    item
                );


            if (
                nominal <= 0
            ) {

                return;

            }


            // -------------------------------------
            // JENIS
            // -------------------------------------

            const jenisPendapatan =
                String(
                    item?.jenisPendapatan || ""
                ).toUpperCase();


            const akunKode =
                String(
                    item?.akunKode || ""
                ).toUpperCase();


            const sumber =
                String(
                    item?.sumber || ""
                ).toUpperCase();


            // -------------------------------------
            // MODAL
            // -------------------------------------

            if (
                akunKode === "MODAL" ||
                jenisPendapatan === "MODAL"
            ) {

                console.log(
                    "Transaksi modal tidak masuk Laba Rugi:",
                    item
                );

                return;

            }


            // -------------------------------------
            // BUKAN PENDAPATAN
            // -------------------------------------

            if (
                jenisPendapatan ===
                "BUKAN_PENDAPATAN"
            ) {

                console.log(
                    "Transaksi bukan pendapatan:",
                    item
                );

                return;

            }


            // -------------------------------------
            // UTANG
            // -------------------------------------

            if (
                sumber === "UTANG"
            ) {

                console.log(
                    "Penerimaan utang tidak masuk pendapatan:",
                    item
                );

                return;

            }


            // -------------------------------------
            // PIUTANG
            // -------------------------------------

            if (
                sumber === "PIUTANG"
            ) {

                console.log(
                    "Penerimaan piutang tidak masuk pendapatan:",
                    item
                );

                return;

            }


            // -------------------------------------
            // UNIT
            // -------------------------------------

            const unit =
                unitLabaRugiFirebase(
                    item
                );


            if (
                !unitUsaha[unit]
            ) {

                console.warn(
                    "Unit pemasukan tidak dikenal:",
                    unit,
                    item
                );

                return;

            }


            // -------------------------------------
            // SIMPAN
            // -------------------------------------

            const tanggal =
                String(
                    item?.tanggal || ""
                ).substring(0, 10);


            unitUsaha[unit]
                .pendapatan
                .push({

                    akun:
                        item?.akunKode || "",

                    nama:
                        namaAkunLabaRugiFirebase(
                            item
                        ),

                    nominal:
                        nominal,

                    tanggal:
                        tanggal

                });

        }
    );

}


// =========================================
// PROSES PENGELUARAN
// =========================================

function prosesPengeluaranLabaRugiFirebase(
    pengeluaran,
    unitUsaha,
    dari,
    sampai
) {

    pengeluaran.forEach(
        function(item) {

            // -------------------------------------
            // TANGGAL
            // -------------------------------------

            if (
                !transaksiDalamPeriodeLabaRugiFirebase(
                    item.tanggal,
                    dari,
                    sampai
                )
            ) {

                return;

            }


            // -------------------------------------
            // NOMINAL
            // -------------------------------------

            const nominal =
                nominalLabaRugiFirebase(
                    item
                );


            if (
                nominal <= 0
            ) {

                return;

            }


            const akunKode =
                String(
                    item?.akunKode || ""
                ).toUpperCase();


            const jenisPengeluaran =
                String(
                    item?.jenisPengeluaran || ""
                ).toUpperCase();


            const jenisBeban =
                String(
                    item?.jenisBeban || ""
                ).toUpperCase();


            const sumber =
                String(
                    item?.sumber || ""
                ).toUpperCase();


            // -------------------------------------
            // MODAL
            // -------------------------------------

            if (
                akunKode === "MODAL" ||
                jenisPengeluaran === "MODAL"
            ) {

                console.log(
                    "Transaksi modal tidak masuk Laba Rugi:",
                    item
                );

                return;

            }


            // -------------------------------------
            // ASET
            // -------------------------------------

            if (
                jenisPengeluaran === "ASET" ||
                akunKode === "1400"
            ) {

                console.log(
                    "Pembelian aset tidak masuk Laba Rugi:",
                    item
                );

                return;

            }


            // -------------------------------------
            // BUKAN BEBAN
            // -------------------------------------

            if (
                jenisPengeluaran ===
                "BUKAN_BEBAN" ||

                jenisBeban ===
                "BUKAN_BEBAN"
            ) {

                console.log(
                    "Transaksi bukan beban:",
                    item
                );

                return;

            }


            // -------------------------------------
            // UTANG
            // -------------------------------------

            if (
                sumber === "UTANG" ||
                akunKode === "UTANG"
            ) {

                console.log(
                    "Pembayaran utang tidak masuk beban:",
                    item
                );

                return;

            }


            // -------------------------------------
            // UNIT
            // -------------------------------------

            const unit =
                unitLabaRugiFirebase(
                    item
                );


            if (
                !unitUsaha[unit]
            ) {

                console.warn(
                    "Unit pengeluaran tidak dikenal:",
                    unit,
                    item
                );

                return;

            }


            // -------------------------------------
            // SIMPAN
            // -------------------------------------

            const tanggal =
                String(
                    item?.tanggal || ""
                ).substring(0, 10);


            unitUsaha[unit]
                .beban
                .push({

                    akun:
                        item?.akunKode || "",

                    nama:
                        namaAkunLabaRugiFirebase(
                            item
                        ),

                    nominal:
                        nominal,

                    tanggal:
                        tanggal

                });

        }
    );

}


// =========================================
// HITUNG TOTAL UNIT
// =========================================

function hitungTotalUnitLabaRugiFirebase(
    unitUsaha
) {

    Object.keys(
        unitUsaha
    ).forEach(
        function(kode) {

            const unit =
                unitUsaha[kode];


            // -------------------------------------
            // PENDAPATAN
            // -------------------------------------

            unit.totalPendapatan =
                unit.pendapatan.reduce(
                    function(total, item) {

                        return (
                            total +
                            (
                                Number(
                                    item.nominal
                                ) || 0
                            )
                        );

                    },
                    0
                );


            // -------------------------------------
            // BEBAN TRANSAKSI
            // -------------------------------------

            unit.totalBebanTransaksi =
                unit.beban.reduce(
                    function(total, item) {

                        return (
                            total +
                            (
                                Number(
                                    item.nominal
                                ) || 0
                            )
                        );

                    },
                    0
                );

        }
    );

}


// =========================================
// HITUNG PENYUSUTAN
// =========================================
//
// PENTING:
//
// Tidak menghitung rumus penyusutan lagi.
//
// Menggunakan fungsi yang sama dengan Neraca:
//
// window.hitungDepresiasiPeriodeNeracaFirebase
//
// =========================================

async function ambilDepresiasiLabaRugiFirebase(
    dari,
    sampai
) {

    if (
        typeof window.hitungDepresiasiPeriodeNeracaFirebase !==
        "function"
    ) {

        throw new Error(
            "Fungsi hitungDepresiasiPeriodeNeracaFirebase tidak ditemukan. Pastikan neraca.firebase.js dimuat sebelum laba-rugi.firebase.js."
        );

    }


    const depresiasi =
        await window.hitungDepresiasiPeriodeNeracaFirebase(
            dari,
            sampai
        );


    return Number(
        depresiasi
    ) || 0;

}


// =========================================
// HITUNG LABA RUGI
// =========================================

async function ambilLaporanLabaRugiFirebase(
    dari,
    sampai
) {

    try {

        // =====================================
        // CEK FIREBASE
        // =====================================

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        console.log(
            "================================="
        );


        console.log(
            "MENGAMBIL LAPORAN LABA RUGI"
        );


        console.log(
            "Periode:",
            dari,
            "s/d",
            sampai
        );


        // =====================================
        // AMBIL DATA
        // =====================================

        const pemasukan =
            await loadPemasukanFirebase();


        const pengeluaran =
            await loadPengeluaranFirebase();


        console.log(
            "Data pemasukan:",
            pemasukan
        );


        console.log(
            "Data pengeluaran:",
            pengeluaran
        );


        // =====================================
        // UNIT
        // =====================================

        const unitUsaha =
            buatStrukturUnitLabaRugiFirebase();


        // =====================================
        // PROSES PEMASUKAN
        // =====================================

        prosesPemasukanLabaRugiFirebase(
            pemasukan,
            unitUsaha,
            dari,
            sampai
        );


        // =====================================
        // PROSES PENGELUARAN
        // =====================================

        prosesPengeluaranLabaRugiFirebase(
            pengeluaran,
            unitUsaha,
            dari,
            sampai
        );


        // =====================================
        // HITUNG TOTAL TRANSAKSI PER UNIT
        // =====================================

        hitungTotalUnitLabaRugiFirebase(
            unitUsaha
        );


        // =====================================
        // PENYUSUTAN
        // =====================================

        const depresiasi =
            await ambilDepresiasiLabaRugiFirebase(
                dari,
                sampai
            );


        // =====================================
        // TOTAL BUMDES
        // =====================================

        let totalPendapatan =
            0;


        let totalBebanTransaksi =
            0;


        Object.keys(
            unitUsaha
        ).forEach(
            function(kode) {

                const unit =
                    unitUsaha[kode];


                totalPendapatan +=
                    unit.totalPendapatan;


                totalBebanTransaksi +=
                    unit.totalBebanTransaksi;

            }
        );


        // =====================================
        // PENYUSUTAN
        // =====================================
        //
        // Saat ini fungsi dari Neraca
        // memberikan total penyusutan BUMDes.
        //
        // Karena belum memberikan unit,
        // penyusutan ditempatkan sebagai
        // beban nonkas tingkat BUMDes.
        //
        // =====================================

        const totalBeban =
            totalBebanTransaksi +
            depresiasi;


        // =====================================
        // LABA / RUGI
        // =====================================

        const labaRugi =
            totalPendapatan -
            totalBeban;


        // =====================================
        // TENTUKAN UNIT UNTUK PENYUSUTAN
        // =====================================
        //
        // TIDAK dialokasikan ke unit.
        //
        // Nilai tetap 0 pada setiap unit
        // agar tidak terjadi pembagian/asumsi.
        //
        // =====================================

        Object.keys(
            unitUsaha
        ).forEach(
            function(kode) {

                const unit =
                    unitUsaha[kode];


                unit.depresiasi =
                    0;


                unit.totalBeban =
                    unit.totalBebanTransaksi;


                unit.labaRugi =
                    unit.totalPendapatan -
                    unit.totalBeban;

            }
        );


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "================================="
        );


        console.log(
            "HASIL LAPORAN LABA RUGI"
        );


        console.log(
            "Total Pendapatan:",
            totalPendapatan
        );


        console.log(
            "Beban Transaksi:",
            totalBebanTransaksi
        );


        console.log(
            "Beban Penyusutan:",
            depresiasi
        );


        console.log(
            "Total Beban:",
            totalBeban
        );


        console.log(
            "Laba/Rugi:",
            labaRugi
        );


        console.log(
            "Unit:",
            unitUsaha
        );


        console.log(
            "================================="
        );


        // =====================================
        // RETURN
        // =====================================

        return {

            periode: {

                dari:
                    dari,

                sampai:
                    sampai

            },


            unit:
                unitUsaha,


            // =================================
            // TOTAL PENDAPATAN
            // =================================

            totalPendapatan:
                totalPendapatan,


            // =================================
            // BEBAN TRANSAKSI
            // =================================

            totalBebanTransaksi:
                totalBebanTransaksi,


            // =================================
            // BEBAN PENYUSUTAN
            // =================================

            depresiasi:
                depresiasi,


            bebanPenyusutan:
                depresiasi,


            // =================================
            // TOTAL BEBAN
            // =================================

            totalBeban:
                totalBeban,


            beban:
                totalBeban,


            // =================================
            // LABA / RUGI
            // =================================

            labaRugi:
                labaRugi

        };


    } catch (error) {

        console.error(
            "Ambil Laba Rugi Firebase gagal:",
            error
        );


        throw error;

    }

}


// =========================================
// ALIAS KOMPATIBILITAS
// =========================================
//
// Beberapa bagian APK mungkin masih
// memanggil nama fungsi lama.
//
// =========================================

window.ambilLaporanLabaRugiFirebase =
    ambilLaporanLabaRugiFirebase;


// =========================================
// EXPORT DEPRESIASI
// =========================================

window.ambilDepresiasiLabaRugiFirebase =
    ambilDepresiasiLabaRugiFirebase;


// =========================================
// STATUS
// =========================================

console.log(
    "LABA RUGI FIREBASE SIAP"
);


console.log(
    "LABA RUGI: PENYUSUTAN TERINTEGRASI DENGAN NERACA"
);


console.log(
    "LABA RUGI: BEBAN PENYUSUTAN = NONKAS"
);


console.log(
    "LABA RUGI: TOTAL BEBAN = BEBAN TRANSAKSI + PENYUSUTAN"
);


console.log(
    "LABA RUGI: PEMBELIAN ASET BUKAN BEBAN"
);


console.log(
    "LABA RUGI: MODAL BUKAN PENDAPATAN"
);


console.log(
    "LABA RUGI: TRANSFER BUKAN PENDAPATAN/BIAYA"
);


// =========================================
// SELESAI
// =========================================


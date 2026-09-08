// =========================================
// TRANSAKSI FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// TUGAS FILE:
// - Mengambil transaksi dari Firestore
// - Filter berdasarkan periode
// - Mengelompokkan Pemasukan
// - Mengelompokkan Pengeluaran
// - Mengelompokkan Transfer
// - Menghitung total
//
// =========================================


// =========================================
// AMBIL LAPORAN TRANSAKSI
// =========================================

async function ambilLaporanTransaksiFirebase(
    dari,
    sampai
) {

    try {

        console.log(
            "Mengambil Laporan Transaksi:",
            dari,
            sampai
        );


        // =====================================
        // CEK FIREBASE
        // =====================================

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        // =====================================
        // IMPORT FIRESTORE
        // =====================================

        const {
            collection,
            getDocs,
            query,
            orderBy
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // COLLECTION
        // =====================================

        const ref =
            collection(
                window.db,
                COLLECTION.TRANSAKSI
            );


        // =====================================
        // QUERY
        // =====================================

        const q =
            query(
                ref,
                orderBy(
                    "tanggal",
                    "asc"
                )
            );


        const snapshot =
            await getDocs(q);


        // =====================================
        // ARRAY
        // =====================================

        const transaksi = [];


        // =====================================
        // TOTAL
        // =====================================

        let totalPemasukan = 0;

        let totalPengeluaran = 0;

        let totalTransfer = 0;


        // =====================================
        // PROSES DOKUMEN
        // =====================================

        snapshot.forEach(
            function(docSnapshot) {

                const item =
                    docSnapshot.data();


                // =================================
                // TANGGAL
                // =================================

                const tanggal =
                    String(
                        item.tanggal || ""
                    )
                    .substring(0, 10);


                // =================================
                // TANGGAL TIDAK VALID
                // =================================

                if (!tanggal) {

                    return;

                }


                // =================================
                // FILTER PERIODE
                // =================================

                if (
                    tanggal < dari ||
                    tanggal > sampai
                ) {

                    return;

                }


                // =================================
                // NOMINAL
                // =================================

                const nominal =
                    Number(
                        item.nominal
                    ) || 0;


                // =================================
                // JENIS
                // =================================

                const jenis =
                    String(
                        item.jenisTransaksi ||
                        ""
                    ).toUpperCase();


                // =================================
                // PEMASUKAN
                // =================================

                if (
                    jenis ===
                    String(
                        JENIS_TRANSAKSI.PEMASUKAN
                    ).toUpperCase()
                ) {

                    totalPemasukan +=
                        nominal;


                    transaksi.push({

                        id:
                            docSnapshot.id,

                        tanggal:
                            item.tanggal || tanggal,

                        jenisTransaksi:
                            "PEMASUKAN",

                        jenis:
                            "PEMASUKAN",

                        unitUsaha:
                            item.unitUsaha || "-",

                        akunKode:
                            item.akunKode || "-",

                        media:
                            item.mediaTujuan || "-",

                        mediaTujuan:
                            item.mediaTujuan || "-",

                        mediaAsal:
                            null,

                        nominal:
                            nominal,

                        keterangan:
                            item.keterangan ||
                            item.jenisPendapatan ||
                            "Pemasukan",

                        nomorBukti:
                            item.nomorBukti || "-",

                        jenisPendapatan:
                            item.jenisPendapatan || "",

                        rt:
                            item.rt || "",

                        rw:
                            item.rw || "",

                        namaPenyetor:
                            item.namaPenyetor || ""

                    });


                    return;

                }


                // =================================
                // PENGELUARAN
                // =================================

                if (
                    jenis ===
                    String(
                        JENIS_TRANSAKSI.PENGELUARAN
                    ).toUpperCase()
                ) {

                    totalPengeluaran +=
                        nominal;


                    transaksi.push({

                        id:
                            docSnapshot.id,

                        tanggal:
                            item.tanggal || tanggal,

                        jenisTransaksi:
                            "PENGELUARAN",

                        jenis:
                            "PENGELUARAN",

                        unitUsaha:
                            item.unitUsaha || "-",

                        akunKode:
                            item.akunKode || "-",

                        media:
                            item.mediaAsal || "-",

                        mediaAsal:
                            item.mediaAsal || "-",

                        mediaTujuan:
                            null,

                        nominal:
                            nominal,

                        keterangan:
                            item.keterangan ||
                            "Pengeluaran",

                        nomorBukti:
                            item.nomorBukti || "-"

                    });


                    return;

                }


                // =================================
                // TRANSFER
                // =================================

                if (
                    jenis ===
                    String(
                        JENIS_TRANSAKSI.TRANSFER
                    ).toUpperCase()
                ) {

                    totalTransfer +=
                        nominal;


                    transaksi.push({

                        id:
                            docSnapshot.id,

                        tanggal:
                            item.tanggal || tanggal,

                        jenisTransaksi:
                            "TRANSFER",

                        jenis:
                            "TRANSFER",

                        unitUsaha:
                            item.unitUsaha || "-",

                        akunKode:
                            item.akunKode || "-",

                        media:
                            (
                                item.mediaAsal ||
                                "-"
                            ) +
                            " → " +
                            (
                                item.mediaTujuan ||
                                "-"
                            ),

                        mediaAsal:
                            item.mediaAsal || "-",

                        mediaTujuan:
                            item.mediaTujuan || "-",

                        nominal:
                            nominal,

                        keterangan:
                            item.keterangan ||
                            "Transfer",

                        nomorBukti:
                            item.nomorBukti || "-"

                    });

                }

            }
        );


        // =====================================
        // URUTKAN
        // =====================================

        transaksi.sort(
            function(a, b) {

                const tanggalA =
                    String(
                        a.tanggal || ""
                    );

                const tanggalB =
                    String(
                        b.tanggal || ""
                    );


                return tanggalA.localeCompare(
                    tanggalB
                );

            }
        );


        // =====================================
        // HASIL FINAL
        // =====================================

        const hasil = {

            periode: {

                dari:
                    dari,

                sampai:
                    sampai

            },

            transaksi:
                transaksi,

            totalTransaksi:
                transaksi.length,

            totalPemasukan:
                totalPemasukan,

            totalPengeluaran:
                totalPengeluaran,

            totalTransfer:
                totalTransfer

        };


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "Laporan transaksi berhasil:",
            hasil
        );


        console.log(
            "Jumlah transaksi:",
            hasil.transaksi.length
        );


        console.log(
            "Total pemasukan:",
            hasil.totalPemasukan
        );


        console.log(
            "Total pengeluaran:",
            hasil.totalPengeluaran
        );


        console.log(
            "Total transfer:",
            hasil.totalTransfer
        );


        return hasil;


    } catch (error) {

        console.error(
            "Ambil Laporan Transaksi gagal:",
            error
        );


        throw error;

    }

}


// =========================================
// AMBIL SEMUA TRANSAKSI
// =========================================
//
// Fungsi tambahan untuk kebutuhan lain
// apabila suatu saat diperlukan.
//
// =========================================

async function ambilSemuaTransaksiFirebase() {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            collection,
            getDocs
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const ref =
            collection(
                window.db,
                COLLECTION.TRANSAKSI
            );


        const snapshot =
            await getDocs(ref);


        const data = [];


        snapshot.forEach(
            function(docSnapshot) {

                data.push({

                    id:
                        docSnapshot.id,

                    ...docSnapshot.data()

                });

            }
        );


        return data;


    } catch (error) {

        console.error(
            "Ambil semua transaksi gagal:",
            error
        );


        return [];

    }

}


// =========================================
// SELESAI
// =========================================


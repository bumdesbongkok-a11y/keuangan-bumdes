// =========================================
// BANK FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// LOAD TRANSAKSI BANK
// =========================================

async function loadBankFirebase() {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            collection,
            getDocs,
            query,
            orderBy
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // AMBIL COLLECTION TRANSAKSI
        // =====================================

        const ref =
            collection(
                window.db,
                COLLECTION.TRANSAKSI
            );


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


        const data = [];


        // =====================================
        // PROSES SETIAP TRANSAKSI
        // =====================================

        snapshot.forEach(function(doc) {

            const item =
                doc.data();


            // =================================
            // PEMASUKAN KE BANK
            // =================================

            if (

                item.jenisTransaksi ===
                    JENIS_TRANSAKSI.PEMASUKAN

                &&

                item.mediaTujuan ===
                    MEDIA_UANG.BANK

            ) {

                data.push({

                    id:
                        doc.id,

                    tanggal:
                        item.tanggal,

                    jenis:
                        "PEMASUKAN",

                    keterangan:
                        item.keterangan ||
                        item.jenisPendapatan ||
                        "Pemasukan",

                    dari:
                        item.unitUsaha ||
                        "Sumber Pendapatan",

                    ke:
                        MEDIA_UANG.BANK,

                    masuk:
                        Number(
                            item.nominal
                        ) || 0,

                    keluar:
                        0

                });

            }


            // =================================
            // PENGELUARAN DARI BANK
            // =================================

            if (

                item.jenisTransaksi ===
                    JENIS_TRANSAKSI.PENGELUARAN

                &&

                item.mediaAsal ===
                    MEDIA_UANG.BANK

            ) {

                data.push({

                    id:
                        doc.id,

                    tanggal:
                        item.tanggal,

                    jenis:
                        "PENGELUARAN",

                    keterangan:
                        item.keterangan ||
                        "Pengeluaran",

                    dari:
                        MEDIA_UANG.BANK,

                    ke:
                        item.akunKode ||
                        "Beban",

                    masuk:
                        0,

                    keluar:
                        Number(
                            item.nominal
                        ) || 0

                });

            }


            // =================================
            // TRANSFER
            // =================================

            if (

                item.jenisTransaksi ===
                    JENIS_TRANSAKSI.TRANSFER

            ) {


                // -----------------------------
                // TRANSFER MASUK KE BANK
                // -----------------------------

                if (

                    item.mediaTujuan ===
                        MEDIA_UANG.BANK

                ) {

                    data.push({

                        id:
                            doc.id,

                        tanggal:
                            item.tanggal,

                        jenis:
                            "TRANSFER MASUK",

                        keterangan:
                            item.keterangan ||
                            "Transfer masuk",

                        dari:
                            item.mediaAsal ||
                            "-",

                        ke:
                            MEDIA_UANG.BANK,

                        masuk:
                            Number(
                                item.nominal
                            ) || 0,

                        keluar:
                            0

                    });

                }


                // -----------------------------
                // TRANSFER KELUAR DARI BANK
                // -----------------------------

                if (

                    item.mediaAsal ===
                        MEDIA_UANG.BANK

                ) {

                    data.push({

                        id:
                            doc.id,

                        tanggal:
                            item.tanggal,

                        jenis:
                            "TRANSFER KELUAR",

                        keterangan:
                            item.keterangan ||
                            "Transfer keluar",

                        dari:
                            MEDIA_UANG.BANK,

                        ke:
                            item.mediaTujuan ||
                            "-",

                        masuk:
                            0,

                        keluar:
                            Number(
                                item.nominal
                            ) || 0

                    });

                }

            }

        });


        // =====================================
        // HASIL
        // =====================================

        console.log(
            "Data Bank:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Load Bank gagal:",
            error
        );


        return [];

    }

}
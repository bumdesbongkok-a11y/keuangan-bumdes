// =========================================
// ARUS KAS FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// KAS + BANK + DANA
// =========================================


// =========================================
// AMBIL LAPORAN ARUS KAS
// =========================================

async function ambilLaporanArusKasFirebase(
    dari,
    sampai
) {

    try {

        console.log(
            "Mengambil Laporan Arus Kas:",
            dari,
            sampai
        );


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
        // COLLECTION
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


        // =====================================
        // MEDIA UANG
        // =====================================

        const mediaKas = [

            MEDIA_UANG.KAS,
            MEDIA_UANG.BANK,
            MEDIA_UANG.DANA

        ];


        // =====================================
        // SALDO
        // =====================================

        const saldoMediaAwal = {

            KAS: 0,
            BANK: 0,
            DANA: 0

        };


        const saldoMediaAkhir = {

            KAS: 0,
            BANK: 0,
            DANA: 0

        };


        // =====================================
        // DATA TRANSAKSI
        // =====================================

        const pemasukan = [];

        const pengeluaran = [];

        const modalMasuk = [];

        const modalKeluar = [];

        const transfer = [];


        // =====================================
        // HELPER
        // =====================================

        function tambahSaldo(
            objek,
            media,
            nominal
        ) {

            if (
                media === MEDIA_UANG.KAS
            ) {

                objek.KAS += nominal;

            }

            else if (
                media === MEDIA_UANG.BANK
            ) {

                objek.BANK += nominal;

            }

            else if (
                media === MEDIA_UANG.DANA
            ) {

                objek.DANA += nominal;

            }

        }


        function kurangiSaldo(
            objek,
            media,
            nominal
        ) {

            if (
                media === MEDIA_UANG.KAS
            ) {

                objek.KAS -= nominal;

            }

            else if (
                media === MEDIA_UANG.BANK
            ) {

                objek.BANK -= nominal;

            }

            else if (
                media === MEDIA_UANG.DANA
            ) {

                objek.DANA -= nominal;

            }

        }


        // =====================================
        // PROSES TRANSAKSI
        // =====================================

        snapshot.forEach(
            function(doc) {

                const item =
                    doc.data();


                const tanggal =
                    String(
                        item.tanggal || ""
                    ).substring(0, 10);


                if (!tanggal) {

                    return;

                }


                const nominal =
                    Number(
                        item.nominal
                    ) || 0;


                const jenis =
                    item.jenisTransaksi;


                const mediaAsal =
                    item.mediaAsal;


                const mediaTujuan =
                    item.mediaTujuan;


                // =================================
                // SEBELUM PERIODE
                // =================================

                if (
                    tanggal < dari
                ) {


                    // PEMASUKAN

                    if (

                        jenis ===
                            JENIS_TRANSAKSI.PEMASUKAN

                        &&

                        mediaKas.includes(
                            mediaTujuan
                        )

                    ) {

                        tambahSaldo(
                            saldoMediaAwal,
                            mediaTujuan,
                            nominal
                        );

                    }


                    // PENGELUARAN

                    if (

                        jenis ===
                            JENIS_TRANSAKSI.PENGELUARAN

                        &&

                        mediaKas.includes(
                            mediaAsal
                        )

                    ) {

                        kurangiSaldo(
                            saldoMediaAwal,
                            mediaAsal,
                            nominal
                        );

                    }


                    // TRANSFER

                    if (

                        jenis ===
                            JENIS_TRANSAKSI.TRANSFER

                    ) {

                        if (
                            mediaKas.includes(
                                mediaAsal
                            )
                        ) {

                            kurangiSaldo(
                                saldoMediaAwal,
                                mediaAsal,
                                nominal
                            );

                        }


                        if (
                            mediaKas.includes(
                                mediaTujuan
                            )
                        ) {

                            tambahSaldo(
                                saldoMediaAwal,
                                mediaTujuan,
                                nominal
                            );

                        }

                    }


                    return;

                }


                // =================================
                // DI LUAR PERIODE
                // =================================

                if (
                    tanggal > sampai
                ) {

                    return;

                }


                // =================================
                // PEMASUKAN
                // =================================

                if (

                    jenis ===
                        JENIS_TRANSAKSI.PEMASUKAN

                    &&

                    mediaKas.includes(
                        mediaTujuan
                    )

                ) {


                    const adalahModal =

                        item.akunKode === "MODAL"

                        ||

                        item.jenisPendapatan ===
                            "MODAL";


                    const data = {

                        id:
                            doc.id,

                        tanggal:
                            item.tanggal,

                        jenis:
                            adalahModal
                                ? "MODAL"
                                : "PEMASUKAN",

                        keterangan:
                            item.keterangan ||
                            item.jenisPendapatan ||
                            "Pemasukan",

                        dari:
                            item.unitUsaha ||
                            "Sumber Pendapatan",

                        ke:
                            mediaTujuan,

                        media:
                            mediaTujuan,

                        nominal:
                            nominal

                    };


                    if (adalahModal) {

                        modalMasuk.push(
                            data
                        );

                    } else {

                        pemasukan.push(
                            data
                        );

                    }


                    return;

                }


                // =================================
                // PENGELUARAN
                // =================================

                if (

                    jenis ===
                        JENIS_TRANSAKSI.PENGELUARAN

                    &&

                    mediaKas.includes(
                        mediaAsal
                    )

                ) {


                    const adalahModal =

                        item.akunKode === "MODAL"

                        ||

                        item.jenisPengeluaran ===
                            "MODAL";


                    const data = {

                        id:
                            doc.id,

                        tanggal:
                            item.tanggal,

                        jenis:
                            adalahModal
                                ? "MODAL"
                                : "PENGELUARAN",

                        keterangan:
                            item.keterangan ||
                            "Pengeluaran",

                        dari:
                            mediaAsal,

                        ke:
                            item.akunKode ||
                            "Beban",

                        media:
                            mediaAsal,

                        nominal:
                            nominal

                    };


                    if (adalahModal) {

                        modalKeluar.push(
                            data
                        );

                    } else {

                        pengeluaran.push(
                            data
                        );

                    }


                    return;

                }


                // =================================
                // TRANSFER
                // =================================

                if (

                    jenis ===
                        JENIS_TRANSAKSI.TRANSFER

                ) {


                    if (

                        mediaKas.includes(
                            mediaAsal
                        )

                        ||

                        mediaKas.includes(
                            mediaTujuan
                        )

                    ) {

                        transfer.push({

                            id:
                                doc.id,

                            tanggal:
                                item.tanggal,

                            jenis:
                                "TRANSFER INTERNAL",

                            keterangan:
                                item.keterangan ||
                                "Transfer antar media",

                            dari:
                                mediaAsal ||
                                "-",

                            ke:
                                mediaTujuan ||
                                "-",

                            nominal:
                                nominal

                        });

                    }


                    return;

                }

            }
        );


        // =====================================
        // SALDO AKHIR = SALDO AWAL
        // =====================================

        saldoMediaAkhir.KAS =
            saldoMediaAwal.KAS;


        saldoMediaAkhir.BANK =
            saldoMediaAwal.BANK;


        saldoMediaAkhir.DANA =
            saldoMediaAwal.DANA;


        // =====================================
        // PEMASUKAN
        // =====================================

        pemasukan.forEach(
            function(item) {

                tambahSaldo(
                    saldoMediaAkhir,
                    item.media,
                    item.nominal
                );

            }
        );


        // =====================================
        // PENGELUARAN
        // =====================================

        pengeluaran.forEach(
            function(item) {

                kurangiSaldo(
                    saldoMediaAkhir,
                    item.media,
                    item.nominal
                );

            }
        );


        // =====================================
        // MODAL MASUK
        // =====================================

        modalMasuk.forEach(
            function(item) {

                tambahSaldo(
                    saldoMediaAkhir,
                    item.media,
                    item.nominal
                );

            }
        );


        // =====================================
        // MODAL KELUAR
        // =====================================

        modalKeluar.forEach(
            function(item) {

                kurangiSaldo(
                    saldoMediaAkhir,
                    item.media,
                    item.nominal
                );

            }
        );


        // =====================================
        // TRANSFER
        // =====================================

        transfer.forEach(
            function(item) {


                if (
                    mediaKas.includes(
                        item.dari
                    )
                ) {

                    kurangiSaldo(
                        saldoMediaAkhir,
                        item.dari,
                        item.nominal
                    );

                }


                if (
                    mediaKas.includes(
                        item.ke
                    )
                ) {

                    tambahSaldo(
                        saldoMediaAkhir,
                        item.ke,
                        item.nominal
                    );

                }

            }
        );


        // =====================================
        // TOTAL PEMASUKAN
        // =====================================

        const totalPemasukan =
            pemasukan.reduce(
                function(total, item) {

                    return (
                        total +
                        item.nominal
                    );

                },
                0
            );


        // =====================================
        // TOTAL PENGELUARAN
        // =====================================

        const totalPengeluaran =
            pengeluaran.reduce(
                function(total, item) {

                    return (
                        total +
                        item.nominal
                    );

                },
                0
            );


        // =====================================
        // TOTAL MODAL MASUK
        // =====================================

        const totalModalMasuk =
            modalMasuk.reduce(
                function(total, item) {

                    return (
                        total +
                        item.nominal
                    );

                },
                0
            );


        // =====================================
        // TOTAL MODAL KELUAR
        // =====================================

        const totalModalKeluar =
            modalKeluar.reduce(
                function(total, item) {

                    return (
                        total +
                        item.nominal
                    );

                },
                0
            );


        // =====================================
        // PERUBAHAN
        // =====================================

        const perubahanOperasional =
            totalPemasukan -
            totalPengeluaran;


        const perubahanPendanaan =
            totalModalMasuk -
            totalModalKeluar;


        const perubahanKas =
            perubahanOperasional +
            perubahanPendanaan;


        // =====================================
        // TOTAL SALDO
        // =====================================

        const totalSaldoAwal =

            saldoMediaAwal.KAS +
            saldoMediaAwal.BANK +
            saldoMediaAwal.DANA;


        const totalSaldoAkhir =

            saldoMediaAkhir.KAS +
            saldoMediaAkhir.BANK +
            saldoMediaAkhir.DANA;


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "Saldo Awal:",
            saldoMediaAwal
        );


        console.log(
            "Total Pemasukan:",
            totalPemasukan
        );


        console.log(
            "Total Pengeluaran:",
            totalPengeluaran
        );


        console.log(
            "Total Modal Masuk:",
            totalModalMasuk
        );


        console.log(
            "Total Modal Keluar:",
            totalModalKeluar
        );


        console.log(
            "Perubahan Kas:",
            perubahanKas
        );


        console.log(
            "Saldo Akhir:",
            saldoMediaAkhir
        );


        console.log(
            "Total Saldo Akhir:",
            totalSaldoAkhir
        );


        console.log(
            "Semua Transaksi:",
            snapshot.size
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


            saldoMediaAwal:
                saldoMediaAwal,


            saldoMediaAkhir:
                saldoMediaAkhir,


            totalSaldoAwal:
                totalSaldoAwal,


            pemasukan:
                pemasukan,


            pengeluaran:
                pengeluaran,


            modalMasuk:
                modalMasuk,


            modalKeluar:
                modalKeluar,


            transfer:
                transfer,


            totalPemasukan:
                totalPemasukan,


            totalPengeluaran:
                totalPengeluaran,


            totalModalMasuk:
                totalModalMasuk,


            totalModalKeluar:
                totalModalKeluar,


            perubahanOperasional:
                perubahanOperasional,


            perubahanPendanaan:
                perubahanPendanaan,


            perubahanKas:
                perubahanKas,


            totalSaldoAkhir:
                totalSaldoAkhir,


            saldoKasAkhir:
                saldoMediaAkhir.KAS,


            saldoBankAkhir:
                saldoMediaAkhir.BANK,


            saldoDanaAkhir:
                saldoMediaAkhir.DANA

        };


    } catch (error) {

        console.error(
            "Ambil Laporan Arus Kas gagal:",
            error
        );

        throw error;

    }

}
// =========================================
// NERACA FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// FINAL
// =========================================


// =========================================
// IMPORT FIREBASE FIRESTORE
// =========================================

async function getFirestoreNeraca() {

    return await import(
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
    );

}


// =========================================
// LOAD COLLECTION
// =========================================

async function loadCollectionNeraca(
    namaCollection
) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            collection,
            getDocs
        } =
            await getFirestoreNeraca();


        const ref =
            collection(
                window.db,
                namaCollection
            );


        const snapshot =
            await getDocs(ref);


        const data = [];


        snapshot.forEach(function(doc) {

            data.push({

                id:
                    doc.id,

                ...doc.data()

            });

        });


        return data;


    } catch (error) {

        console.error(
            "Gagal mengambil collection:",
            namaCollection,
            error
        );


        return [];

    }

}


// =========================================
// LOAD TRANSAKSI
// =========================================

async function loadTransaksiNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.TRANSAKSI
    );

}


// =========================================
// LOAD PIUTANG
// =========================================

async function loadPiutangNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.PIUTANG
    );

}


// =========================================
// LOAD UTANG
// =========================================

async function loadUtangNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.UTANG
    );

}


// =========================================
// LOAD ASET
// =========================================

async function loadAsetNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.ASET
    );

}


// =========================================
// LOAD MODAL
// =========================================

async function loadModalNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.MODAL
    );

}


// =========================================
// CEK TANGGAL SAMPAI
// =========================================

function transaksiSampaiTanggalNeraca(
    tanggal,
    sampai
) {

    if (!tanggal) {

        return false;

    }


    if (!sampai) {

        return true;

    }


    const t =
        String(tanggal).substring(0, 10);


    const s =
        String(sampai).substring(0, 10);


    return t <= s;

}


// =========================================
// CEK TANGGAL PERIODE
// =========================================

function transaksiDalamPeriodeNeraca(
    tanggal,
    dari,
    sampai
) {

    if (!tanggal) {

        return false;

    }


    const t =
        String(tanggal).substring(0, 10);


    if (
        dari &&
        t < dari
    ) {

        return false;

    }


    if (
        sampai &&
        t > sampai
    ) {

        return false;

    }


    return true;

}


// =========================================
// NOMINAL
// =========================================

function nominalNeraca(item) {

    if (!item) {

        return 0;

    }


    return Number(
        item.nominal ??
        item.jumlah ??
        item.nilai ??
        item.nilaiPerolehan ??
        item.harga ??
        item.total ??
        0
    ) || 0;

}


// =========================================
// SALDO MEDIA UANG
// KUMULATIF SAMPAI TANGGAL
// =========================================

async function hitungSaldoMediaNeracaFirebase(
    sampai
) {

    const transaksi =
        await loadTransaksiNeracaFirebase();


    let kas = 0;

    let bank = 0;

    let dana = 0;

    let saldoAffiliate = 0;


    transaksi.forEach(function(item) {

        // -----------------------------
        // FILTER TANGGAL
        // -----------------------------

        if (
            !transaksiSampaiTanggalNeraca(
                item.tanggal,
                sampai
            )
        ) {

            return;

        }


        const nominal =
            nominalNeraca(item);


        if (
            nominal <= 0
        ) {

            return;

        }


        // =================================
        // PEMASUKAN
        // =================================

        if (
            item.jenisTransaksi ===
            JENIS_TRANSAKSI.PEMASUKAN
        ) {

            if (
                item.mediaTujuan ===
                MEDIA_UANG.KAS
            ) {

                kas += nominal;

            }


            else if (
                item.mediaTujuan ===
                MEDIA_UANG.BANK
            ) {

                bank += nominal;

            }


            else if (
                item.mediaTujuan ===
                MEDIA_UANG.DANA
            ) {

                dana += nominal;

            }


            else if (
                item.mediaTujuan ===
                MEDIA_UANG.SALDO_AFFILIATE
            ) {

                saldoAffiliate +=
                    nominal;

            }

        }


        // =================================
        // PENGELUARAN
        // =================================

        else if (
            item.jenisTransaksi ===
            JENIS_TRANSAKSI.PENGELUARAN
        ) {

            if (
                item.mediaAsal ===
                MEDIA_UANG.KAS
            ) {

                kas -= nominal;

            }


            else if (
                item.mediaAsal ===
                MEDIA_UANG.BANK
            ) {

                bank -= nominal;

            }


            else if (
                item.mediaAsal ===
                MEDIA_UANG.DANA
            ) {

                dana -= nominal;

            }


            else if (
                item.mediaAsal ===
                MEDIA_UANG.SALDO_AFFILIATE
            ) {

                saldoAffiliate -=
                    nominal;

            }

        }


        // =================================
        // TRANSFER
        // =================================

        else if (
            item.jenisTransaksi ===
            JENIS_TRANSAKSI.TRANSFER
        ) {

            // -----------------------------
            // UANG KELUAR
            // -----------------------------

            if (
                item.mediaAsal ===
                MEDIA_UANG.KAS
            ) {

                kas -= nominal;

            }


            else if (
                item.mediaAsal ===
                MEDIA_UANG.BANK
            ) {

                bank -= nominal;

            }


            else if (
                item.mediaAsal ===
                MEDIA_UANG.DANA
            ) {

                dana -= nominal;

            }


            else if (
                item.mediaAsal ===
                MEDIA_UANG.SALDO_AFFILIATE
            ) {

                saldoAffiliate -=
                    nominal;

            }


            // -----------------------------
            // UANG MASUK
            // -----------------------------

            if (
                item.mediaTujuan ===
                MEDIA_UANG.KAS
            ) {

                kas += nominal;

            }


            else if (
                item.mediaTujuan ===
                MEDIA_UANG.BANK
            ) {

                bank += nominal;

            }


            else if (
                item.mediaTujuan ===
                MEDIA_UANG.DANA
            ) {

                dana += nominal;

            }


            else if (
                item.mediaTujuan ===
                MEDIA_UANG.SALDO_AFFILIATE
            ) {

                saldoAffiliate +=
                    nominal;

            }

        }

    });


    // =================================
    // HINDARI -0
    // =================================

    if (
        Math.abs(kas) < 0.01
    ) {

        kas = 0;

    }


    if (
        Math.abs(bank) < 0.01
    ) {

        bank = 0;

    }


    if (
        Math.abs(dana) < 0.01
    ) {

        dana = 0;

    }


    if (
        Math.abs(saldoAffiliate) < 0.01
    ) {

        saldoAffiliate = 0;

    }


    const totalKasBankDana =
        kas +
        bank +
        dana;


    const totalMediaUang =
        kas +
        bank +
        dana +
        saldoAffiliate;


    return {

        kas:
            kas,

        bank:
            bank,

        dana:
            dana,

        saldoAffiliate:
            saldoAffiliate,

        totalKasBankDana:
            totalKasBankDana,

        totalMediaUang:
            totalMediaUang

    };

}


// =========================================
// PIUTANG
// KUMULATIF SAMPAI TANGGAL
// =========================================

async function hitungPiutangNeracaFirebase(
    sampai
) {

    const data =
        await loadPiutangNeracaFirebase();


    let total = 0;


    data.forEach(function(item) {

        // Jika memiliki tanggal,
        // hanya ambil sampai tanggal laporan.

        if (
            item.tanggal &&
            !transaksiSampaiTanggalNeraca(
                item.tanggal,
                sampai
            )
        ) {

            return;

        }


        const sisa =
            Number(
                item.sisa ??
                item.saldo ??
                item.nominalSisa ??
                0
            ) || 0;


        total += sisa;

    });


    return total;

}


// =========================================
// UTANG
// KUMULATIF SAMPAI TANGGAL
// =========================================

async function hitungUtangNeracaFirebase(
    sampai
) {

    const data =
        await loadUtangNeracaFirebase();


    let total = 0;


    data.forEach(function(item) {

        if (
            item.tanggal &&
            !transaksiSampaiTanggalNeraca(
                item.tanggal,
                sampai
            )
        ) {

            return;

        }


        const sisa =
            Number(
                item.sisa ??
                item.saldo ??
                item.nominalSisa ??
                0
            ) || 0;


        total += sisa;

    });


    return total;

}


// =========================================
// ASET TETAP
// KUMULATIF SAMPAI TANGGAL
// =========================================

async function hitungAsetNeracaFirebase(
    sampai
) {

    const data =
        await loadAsetNeracaFirebase();


    let total = 0;


    data.forEach(function(item) {

        if (
            item.tanggal &&
            !transaksiSampaiTanggalNeraca(
                item.tanggal,
                sampai
            )
        ) {

            return;

        }


        // Prioritas nilai buku

        if (
            item.nilaiBuku !==
            undefined
        ) {

            total +=
                Number(
                    item.nilaiBuku
                ) || 0;

            return;

        }


        // Nilai perolehan

        if (
            item.nilaiPerolehan !==
            undefined
        ) {

            total +=
                Number(
                    item.nilaiPerolehan
                ) || 0;

            return;

        }


        // Nilai / harga / nominal

        total +=
            Number(
                item.nilai ??
                item.harga ??
                item.nominal ??
                0
            ) || 0;

    });


    return total;

}


// =========================================
// MODAL
// KUMULATIF SAMPAI TANGGAL
// =========================================

async function hitungModalNeracaFirebase(
    sampai
) {

    const data =
        await loadModalNeracaFirebase();


    let total = 0;


    data.forEach(function(item) {

        if (
            item.tanggal &&
            !transaksiSampaiTanggalNeraca(
                item.tanggal,
                sampai
            )
        ) {

            return;

        }


        total +=
            Number(
                item.nominal
            ) || 0;

    });


    return total;

}


// =========================================
// LABA / RUGI PERIODE
// =========================================
//
// Pendapatan:
// PEMASUKAN
//
// Beban:
// PENGELUARAN
//
// Modal:
// bukan pendapatan
//
// Pembayaran piutang:
// bukan pendapatan baru
//
// Transfer:
// bukan laba/rugi
// =========================================

async function hitungLabaRugiNeracaFirebase(
    dari,
    sampai
) {

    const transaksi =
        await loadTransaksiNeracaFirebase();


    let pendapatan = 0;

    let beban = 0;


    transaksi.forEach(function(item) {

        if (
            !transaksiDalamPeriodeNeraca(
                item.tanggal,
                dari,
                sampai
            )
        ) {

            return;

        }


        const nominal =
            nominalNeraca(item);


        if (
            nominal <= 0
        ) {

            return;

        }


        // =================================
        // PENDAPATAN
        // =================================

        if (
            item.jenisTransaksi ===
            JENIS_TRANSAKSI.PEMASUKAN
        ) {

            // Modal bukan pendapatan

            if (
                item.akunKode ===
                "MODAL"
            ) {

                return;

            }


            // Pembayaran piutang
            // bukan pendapatan baru

            if (
                item.jenisPendapatan ===
                "BUKAN_PENDAPATAN"
            ) {

                return;

            }


            pendapatan +=
                nominal;

        }


        // =================================
        // BEBAN
        // =================================

        else if (
            item.jenisTransaksi ===
            JENIS_TRANSAKSI.PENGELUARAN
        ) {

            beban +=
                nominal;

        }

    });


    const labaRugi =
        pendapatan -
        beban;


    return {

        pendapatan:
            pendapatan,

        beban:
            beban,

        labaRugi:
            labaRugi

    };

}


// =========================================
// AMBIL DATA NERACA FINAL
// =========================================
//
// SALDO ASET:
// kumulatif sampai tanggal akhir
//
// LABA/RUGI:
// hanya periode laporan
//
// MODAL:
// kumulatif sampai tanggal akhir
//
// UTANG:
// saldo sampai tanggal akhir
//
// PIUTANG:
// saldo sampai tanggal akhir
//
// ASET TETAP:
// saldo sampai tanggal akhir
// =========================================

async function ambilDataNeracaFirebase(
    dari,
    sampai
) {

    const tanggalAkhir =
        sampai || "";


    // =====================================
    // AMBIL SEMUA DATA
    // =====================================

    const hasil =
        await Promise.all([

            hitungSaldoMediaNeracaFirebase(
                tanggalAkhir
            ),

            hitungPiutangNeracaFirebase(
                tanggalAkhir
            ),

            hitungUtangNeracaFirebase(
                tanggalAkhir
            ),

            hitungAsetNeracaFirebase(
                tanggalAkhir
            ),

            hitungModalNeracaFirebase(
                tanggalAkhir
            ),

            hitungLabaRugiNeracaFirebase(
                dari,
                sampai
            )

        ]);


    const saldoMedia =
        hasil[0];


    const piutang =
        hasil[1];


    const utang =
        hasil[2];


    const asetTetap =
        hasil[3];


    const modal =
        hasil[4];


    const labaRugi =
        hasil[5];


    // =====================================
    // TOTAL ASET
    // =====================================

    const totalAset =
        saldoMedia.totalKasBankDana +
        piutang +
        asetTetap;


    // =====================================
    // TOTAL EKUITAS
    // =====================================

    const totalEkuitas =
        modal +
        labaRugi.labaRugi;


    // =====================================
    // KEWAJIBAN + EKUITAS
    // =====================================

    const totalKewajibanEkuitas =
        utang +
        totalEkuitas;


    // =====================================
    // SELISIH
    // =====================================

    const selisih =
        totalAset -
        totalKewajibanEkuitas;


    // =====================================
    // HASIL FINAL
    // =====================================

    const hasilNeraca = {

        periode: {

            dari:
                dari || "",

            sampai:
                sampai || ""

        },


        // -----------------------------
        // ASET
        // -----------------------------

        kas:
            saldoMedia.kas,

        bank:
            saldoMedia.bank,

        dana:
            saldoMedia.dana,

        piutang:
            piutang,

        asetTetap:
            asetTetap,

        totalAset:
            totalAset,


        // -----------------------------
        // KEWAJIBAN
        // -----------------------------

        utang:
            utang,


        // -----------------------------
        // EKUITAS
        // -----------------------------

        modal:
            modal,

        pendapatan:
            labaRugi.pendapatan,

        beban:
            labaRugi.beban,

        labaRugi:
            labaRugi.labaRugi,

        totalEkuitas:
            totalEkuitas,


        // -----------------------------
        // TOTAL
        // -----------------------------

        totalKewajibanEkuitas:
            totalKewajibanEkuitas,

        selisih:
            selisih,


        // -----------------------------
        // INFORMASI TAMBAHAN
        // -----------------------------

        saldoAffiliate:
            saldoMedia.saldoAffiliate,

        totalMediaUang:
            saldoMedia.totalMediaUang

    };


    console.log(
        "DATA NERACA FINAL:",
        hasilNeraca
    );


    return hasilNeraca;

}
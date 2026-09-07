// =========================================
// PIUTANG FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// ATURAN PIUTANG:
//
// PIUTANG HANYA UNTUK PINJAMAN
//
// Saat pinjaman diberikan:
// KAS/BANK/DANA  berkurang
// PIUTANG         bertambah
//
// Pinjaman:
// - BUKAN PENDAPATAN
// - BUKAN BEBAN
// - Tidak mempengaruhi Laba/Rugi
//
// Saat pinjaman dibayar:
// KAS/BANK/DANA  bertambah
// PIUTANG         berkurang
//
// Pembayaran pokok:
// - BUKAN PENDAPATAN
//
// =========================================


// =========================================
// IMPORT FIRESTORE
// =========================================

async function getFirestorePiutang() {

    return await import(
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
    );

}


// =========================================
// SIMPAN PIUTANG
// + SIMPAN TRANSAKSI PINJAMAN
// =========================================

async function simpanPiutangFirebase(data) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {

            collection,
            doc,
            writeBatch,
            serverTimestamp

        } = await getFirestorePiutang();


        const nominal =
            Number(data.nominal) || 0;


        if (nominal <= 0) {

            throw new Error(
                "Nominal piutang harus lebih dari 0."
            );

        }


        // =====================================
        // MEDIA SUMBER PINJAMAN
        // =====================================

        const mediaAsal =
            String(
                data.mediaAsal ||
                "KAS"
            ).toUpperCase();


        // =====================================
        // BUAT BATCH
        // =====================================

        const batch =
            writeBatch(window.db);


        // =====================================
        // ID PIUTANG
        // =====================================

        const piutangRef =
            doc(
                collection(
                    window.db,
                    COLLECTION.PIUTANG
                )
            );


        // =====================================
        // ID TRANSAKSI
        // =====================================

        const transaksiRef =
            doc(
                collection(
                    window.db,
                    COLLECTION.TRANSAKSI
                )
            );


        // =====================================
        // DATA PIUTANG
        // =====================================

        const dataPiutang = {

            tanggal:
                data.tanggal,

            nama:
                data.nama,

            keterangan:
                data.keterangan || "",

            nominal:
                nominal,

            dibayar:
                0,

            sisa:
                nominal,

            jatuhTempo:
                data.jatuhTempo || "",

            status:
                "BELUM LUNAS",

            transaksiId:
                transaksiRef.id,

            mediaAsal:
                mediaAsal,

            createdAt:
                serverTimestamp()

        };


        // =====================================
        // TRANSAKSI PINJAMAN
        // =====================================

        const dataTransaksi = {

            jenisTransaksi:
                JENIS_TRANSAKSI.PENGELUARAN,

            tanggal:
                data.tanggal,

            unitUsaha:
                data.unitUsaha || "BUMDES",

            akunKode:
                "PIUTANG",

            mediaAsal:
                mediaAsal,

            mediaTujuan:
                null,

            nominal:
                nominal,

            keterangan:
                data.keterangan ||
                "Pemberian pinjaman",

            nomorBukti:
                data.nomorBukti || "",

            jenisPengeluaran:
                "BUKAN_BEBAN",

            sumber:
                "PIUTANG",

            piutangId:
                piutangRef.id,

            dibuatPada:
                serverTimestamp()

        };


        // =====================================
        // BATCH PIUTANG
        // =====================================

        batch.set(
            piutangRef,
            dataPiutang
        );


        // =====================================
        // BATCH TRANSAKSI
        // =====================================

        batch.set(
            transaksiRef,
            dataTransaksi
        );


        // =====================================
        // COMMIT
        // =====================================

        await batch.commit();


        console.log(
            "Piutang berhasil disimpan."
        );

        console.log(
            "ID Piutang:",
            piutangRef.id
        );

        console.log(
            "ID Transaksi Pinjaman:",
            transaksiRef.id
        );


        return {

            success:
                true,

            piutangId:
                piutangRef.id,

            transaksiId:
                transaksiRef.id

        };


    } catch (error) {

        console.error(
            "Simpan piutang gagal:",
            error
        );


        return {

            success:
                false,

            error:
                error

        };

    }

}


// =========================================
// BACA DATA PIUTANG
// =========================================

async function loadPiutangFirebase() {

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

        } = await getFirestorePiutang();


        const ref =
            collection(
                window.db,
                COLLECTION.PIUTANG
            );


        const q =
            query(
                ref,
                orderBy(
                    "tanggal",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(q);


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


        console.log(
            "Data piutang dari Firebase:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Load piutang gagal:",
            error
        );


        return [];

    }

}


// =========================================
// UPDATE PIUTANG
// =========================================
//
// Fungsi ini menangani 2 kondisi:
//
// 1. EDIT PIUTANG
//    data.nominal tersedia
//
// 2. PEMBAYARAN PIUTANG
//    data.nominal tidak tersedia
//
// =========================================

async function updatePiutangFirebase(
    id,
    data
) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {

            doc,
            getDoc,
            updateDoc,
            writeBatch

        } = await getFirestorePiutang();


        // =====================================
        // AMBIL PIUTANG
        // =====================================

        const piutangRef =
            doc(
                window.db,
                COLLECTION.PIUTANG,
                id
            );


        const piutangSnapshot =
            await getDoc(
                piutangRef
            );


        if (!piutangSnapshot.exists()) {

            throw new Error(
                "Data piutang tidak ditemukan."
            );

        }


        const piutangLama =
            piutangSnapshot.data();


        const dibayarLama =
            Number(
                piutangLama.dibayar
            ) || 0;


        // =====================================
        // DETEKSI MODE
        // =====================================

        const modeEdit =
            Object.prototype.hasOwnProperty.call(
                data,
                "nominal"
            );


        // =====================================
        // MODE PEMBAYARAN
        // =====================================

        if (!modeEdit) {

            const dibayarBaru =
                Number(data.dibayar) || 0;


            const sisaBaru =
                Number(data.sisa) || 0;


            if (dibayarBaru < dibayarLama) {

                throw new Error(
                    "Jumlah pembayaran tidak boleh berkurang."
                );

            }


            if (sisaBaru < 0) {

                throw new Error(
                    "Sisa piutang tidak boleh negatif."
                );

            }


            // =================================
            // UPDATE PEMBAYARAN SAJA
            // =================================

            await updateDoc(

                piutangRef,

                {

                    dibayar:
                        dibayarBaru,

                    sisa:
                        sisaBaru,

                    status:
                        data.status ||
                        (
                            sisaBaru <= 0
                                ? "LUNAS"
                                : "SEBAGIAN"
                        ),

                    diperbaruiPada:
                        new Date()

                }

            );


            console.log(
                "Pembayaran piutang diperbarui:",
                id
            );


            return true;

        }


        // =====================================
        // MODE EDIT PIUTANG
        // =====================================

        if (dibayarLama > 0) {

            throw new Error(
                "Piutang yang sudah memiliki pembayaran tidak boleh diedit."
            );

        }


        const nominal =
            Number(data.nominal) || 0;


        if (nominal <= 0) {

            throw new Error(
                "Nominal piutang harus lebih dari 0."
            );

        }


        const mediaAsal =
            String(
                data.mediaAsal ||
                piutangLama.mediaAsal ||
                "KAS"
            ).toUpperCase();


        const dataUpdate = {

            tanggal:
                data.tanggal,

            nama:
                data.nama,

            keterangan:
                data.keterangan || "",

            nominal:
                nominal,

            dibayar:
                0,

            sisa:
                nominal,

            jatuhTempo:
                data.jatuhTempo || "",

            status:
                "BELUM LUNAS",

            mediaAsal:
                mediaAsal,

            diperbaruiPada:
                new Date()

        };


        // =====================================
        // TRANSAKSI PINJAMAN
        // =====================================

        const transaksiId =
            piutangLama.transaksiId;


        if (transaksiId) {

            const transaksiRef =
                doc(
                    window.db,
                    COLLECTION.TRANSAKSI,
                    transaksiId
                );


            const transaksiSnapshot =
                await getDoc(
                    transaksiRef
                );


            if (transaksiSnapshot.exists()) {

                const batch =
                    writeBatch(window.db);


                batch.update(
                    piutangRef,
                    dataUpdate
                );


                batch.update(
                    transaksiRef,
                    {

                        tanggal:
                            data.tanggal,

                        unitUsaha:
                            data.unitUsaha ||
                            "BUMDES",

                        akunKode:
                            "PIUTANG",

                        mediaAsal:
                            mediaAsal,

                        mediaTujuan:
                            null,

                        nominal:
                            nominal,

                        keterangan:
                            data.keterangan ||
                            "Pemberian pinjaman",

                        jenisPengeluaran:
                            "BUKAN_BEBAN",

                        sumber:
                            "PIUTANG",

                        piutangId:
                            id,

                        diperbaruiPada:
                            new Date()

                    }

                );


                await batch.commit();


            } else {

                throw new Error(
                    "Transaksi pinjaman terkait tidak ditemukan."
                );

            }


        } else {

            throw new Error(
                "Piutang tidak memiliki transaksiId."
            );

        }


        console.log(
            "Piutang berhasil diperbarui:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Update piutang gagal:",
            error
        );


        return false;

    }

}


// =========================================
// SIMPAN PEMBAYARAN PIUTANG
// + UPDATE PIUTANG
// =========================================
//
// Pembayaran pokok:
//
// KAS/BANK/DANA +
// PIUTANG -
//
// BUKAN PENDAPATAN
//
// =========================================

async function simpanPembayaranPiutangKeTransaksi(
    data
) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {

            collection,
            doc,
            getDoc,
            writeBatch,
            serverTimestamp

        } = await getFirestorePiutang();


        const nominal =
            Number(data.nominal) || 0;


        if (nominal <= 0) {

            throw new Error(
                "Nominal pembayaran harus lebih dari 0."
            );

        }


        const media =
            String(
                data.media ||
                "KAS"
            ).toUpperCase();


        // =====================================
        // PIUTANG ID
        // =====================================

        const piutangId =
            data.piutangId || "";


        if (!piutangId) {

            throw new Error(
                "ID piutang tidak tersedia."
            );

        }


        // =====================================
        // AMBIL DATA PIUTANG
        // =====================================

        const piutangRef =
            doc(
                window.db,
                COLLECTION.PIUTANG,
                piutangId
            );


        const piutangSnapshot =
            await getDoc(
                piutangRef
            );


        if (!piutangSnapshot.exists()) {

            throw new Error(
                "Data piutang tidak ditemukan."
            );

        }


        const piutang =
            piutangSnapshot.data();


        const sisaLama =
            Number(piutang.sisa) || 0;


        const dibayarLama =
            Number(piutang.dibayar) || 0;


        if (nominal > sisaLama) {

            throw new Error(
                "Pembayaran melebihi sisa piutang."
            );

        }


        const dibayarBaru =
            dibayarLama + nominal;


        const sisaBaru =
            sisaLama - nominal;


        const statusBaru =
            sisaBaru <= 0
                ? "LUNAS"
                : "SEBAGIAN";


        // =====================================
        // BUAT TRANSAKSI PEMBAYARAN
        // =====================================

        const transaksiRef =
            doc(
                collection(
                    window.db,
                    COLLECTION.TRANSAKSI
                )
            );


        const dataTransaksi = {

            jenisTransaksi:
                JENIS_TRANSAKSI.PEMASUKAN,

            tanggal:
                data.tanggal,

            unitUsaha:
                "BUMDES",

            akunKode:
                "PIUTANG",

            sumber:
                "PIUTANG",

            jenisPendapatan:
                "BUKAN_PENDAPATAN",

            mediaTujuan:
                media,

            mediaAsal:
                null,

            nominal:
                nominal,

            keterangan:
                data.keterangan ||
                "Pembayaran piutang" +
                (
                    data.nama
                        ? " - " + data.nama
                        : ""
                ),

            piutangId:
                piutangId,

            dibuatPada:
                serverTimestamp()

        };


        // =====================================
        // BATCH
        // =====================================

        const batch =
            writeBatch(window.db);


        // =====================================
        // UPDATE PIUTANG
        // =====================================

        batch.update(

            piutangRef,

            {

                dibayar:
                    dibayarBaru,

                sisa:
                    sisaBaru,

                status:
                    statusBaru,

                diperbaruiPada:
                    new Date()

            }

        );


        // =====================================
        // SIMPAN TRANSAKSI PEMBAYARAN
        // =====================================

        batch.set(

            transaksiRef,

            dataTransaksi

        );


        // =====================================
        // COMMIT BERSAMA
        // =====================================

        await batch.commit();


        console.log(
            "Pembayaran piutang berhasil disimpan."
        );

        console.log(
            "ID Piutang:",
            piutangId
        );

        console.log(
            "ID Transaksi Pembayaran:",
            transaksiRef.id
        );

        console.log(
            "Nominal:",
            nominal
        );

        console.log(
            "Media:",
            media
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan pembayaran piutang gagal:",
            error
        );


        return false;

    }

}


// =========================================
// HAPUS PIUTANG
// =========================================
//
// Hanya boleh menghapus piutang yang
// belum memiliki pembayaran.
//
// Transaksi pinjaman awal juga dihapus.
//
// =========================================

async function hapusPiutangFirebase(id) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {

            doc,
            getDoc,
            deleteDoc,
            writeBatch

        } = await getFirestorePiutang();


        const piutangRef =
            doc(
                window.db,
                COLLECTION.PIUTANG,
                id
            );


        const snapshot =
            await getDoc(
                piutangRef
            );


        if (!snapshot.exists()) {

            throw new Error(
                "Data piutang tidak ditemukan."
            );

        }


        const data =
            snapshot.data();


        const dibayar =
            Number(data.dibayar) || 0;


        if (dibayar > 0) {

            throw new Error(
                "Piutang yang sudah memiliki pembayaran tidak boleh dihapus."
            );

        }


        const transaksiId =
            data.transaksiId;


        if (transaksiId) {

            const transaksiRef =
                doc(
                    window.db,
                    COLLECTION.TRANSAKSI,
                    transaksiId
                );


            const batch =
                writeBatch(window.db);


            batch.delete(
                piutangRef
            );


            batch.delete(
                transaksiRef
            );


            await batch.commit();


        } else {

            await deleteDoc(
                piutangRef
            );


            console.warn(
                "Piutang tidak memiliki transaksiId:",
                id
            );

        }


        console.log(
            "Piutang berhasil dihapus:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus piutang gagal:",
            error
        );


        return false;

    }

}


// =========================================
// AMBIL LAPORAN PIUTANG
// =========================================

async function ambilLaporanPiutangFirebase(
    sampai
) {

    try {

        const data =
            await loadPiutangFirebase();


        const dataPeriode =
            data.filter(
                function(item) {

                    const tanggal =
                        String(
                            item.tanggal || ""
                        )
                        .substring(0, 10);


                    if (!tanggal) {

                        return false;

                    }


                    if (
                        sampai &&
                        tanggal > sampai
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        let totalNominal = 0;

        let totalDibayar = 0;

        let totalSisa = 0;


        dataPeriode.forEach(
            function(item) {

                totalNominal +=
                    Number(
                        item.nominal
                    ) || 0;


                totalDibayar +=
                    Number(
                        item.dibayar
                    ) || 0;


                totalSisa +=
                    Number(
                        item.sisa
                    ) || 0;

            }
        );


        const hasil = {

            data:
                dataPeriode,

            jumlah:
                dataPeriode.length,

            totalNominal:
                totalNominal,

            totalDibayar:
                totalDibayar,

            totalSisa:
                totalSisa

        };


        console.log(
            "Laporan piutang:",
            hasil
        );


        return hasil;


    } catch (error) {

        console.error(
            "Ambil laporan piutang gagal:",
            error
        );


        return {

            data: [],

            jumlah: 0,

            totalNominal: 0,

            totalDibayar: 0,

            totalSisa: 0

        };

    }

}


// =========================================
// SELESAI
// =========================================


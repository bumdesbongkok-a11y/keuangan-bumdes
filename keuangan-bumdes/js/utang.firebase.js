// =========================================
// UTANG FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// ATURAN UTANG:
//
// UTANG = PINJAMAN UANG NYATA DARI PIHAK LAIN
//
// SAAT PINJAMAN DITERIMA:
//
// KAS   +
// UTANG +
//
// BUKAN PENDAPATAN
// BUKAN BEBAN
//
// SAAT UTANG DIBAYAR:
//
// KAS   -
// UTANG -
//
// BUKAN BEBAN
// =========================================


// =========================================
// SIMPAN UTANG
// + CATAT KAS MASUK KE TRANSAKSI
// =========================================

async function simpanUtangFirebase(data) {

    try {

        // =====================================
        // CEK FIREBASE
        // =====================================

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        // =====================================
        // IMPORT FIREBASE
        // =====================================

        const {

            collection,
            doc,
            writeBatch,
            serverTimestamp

        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // NOMINAL
        // =====================================

        const nominal =
            Number(data.nominal) || 0;


        if (nominal <= 0) {

            throw new Error(
                "Nominal utang harus lebih dari 0."
            );

        }


        // =====================================
        // MEDIA UANG
        // =====================================
        // UTANG SELALU MASUK KAS

        const media =
            "KAS";


        // =====================================
        // REFERENSI UTANG
        // =====================================

        const utangRef =
            doc(
                collection(
                    window.db,
                    COLLECTION.UTANG
                )
            );


        // =====================================
        // REFERENSI TRANSAKSI
        // =====================================

        const transaksiRef =
            doc(
                collection(
                    window.db,
                    COLLECTION.TRANSAKSI
                )
            );


        // =====================================
        // DATA UTANG
        // =====================================

        const dataUtang = {

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
                media,

            createdAt:
                serverTimestamp()

        };


        // =====================================
        // DATA TRANSAKSI
        // =====================================
        //
        // PINJAMAN MASUK KE KAS
        //
        // BUKAN PENDAPATAN
        // =====================================

        const dataTransaksi = {

            jenisTransaksi:
                JENIS_TRANSAKSI.PEMASUKAN,

            tanggal:
                data.tanggal,

            unitUsaha:
                "BUMDES",

            akunKode:
                "UTANG",

            mediaAsal:
                null,

            mediaTujuan:
                media,

            nominal:
                nominal,

            keterangan:
                data.keterangan ||
                "Penerimaan pinjaman utang" +
                (
                    data.nama
                        ? " - " + data.nama
                        : ""
                ),

            nomorBukti:
                data.nomorBukti || "",

            jenisPendapatan:
                "BUKAN_PENDAPATAN",

            sumber:
                "UTANG",

            utangId:
                utangRef.id,

            dibuatPada:
                serverTimestamp()

        };


        // =====================================
        // BATCH
        // =====================================

        const batch =
            writeBatch(
                window.db
            );


        // =====================================
        // SIMPAN UTANG
        // =====================================

        batch.set(
            utangRef,
            dataUtang
        );


        // =====================================
        // SIMPAN TRANSAKSI KAS
        // =====================================

        batch.set(
            transaksiRef,
            dataTransaksi
        );


        // =====================================
        // COMMIT
        // =====================================

        await batch.commit();


        // =====================================
        // LOG
        // =====================================

        console.log(
            "Utang berhasil disimpan:",
            utangRef.id
        );

        console.log(
            "Transaksi kas masuk berhasil disimpan:",
            transaksiRef.id
        );


        return {

            success:
                true,

            utangId:
                utangRef.id,

            transaksiId:
                transaksiRef.id

        };


    } catch (error) {

        console.error(
            "Simpan utang gagal:",
            error
        );


        return {

            success:
                false,

            error:
                error.message ||
                "Gagal menyimpan utang."

        };

    }

}


// =========================================
// LOAD UTANG
// =========================================

async function loadUtangFirebase() {

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


        const ref =
            collection(
                window.db,
                COLLECTION.UTANG
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


        snapshot.forEach(
            function(doc) {

                data.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        console.log(
            "Data utang dari Firebase:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Load utang gagal:",
            error
        );


        return [];

    }

}


// =========================================
// UPDATE UTANG
// =========================================

async function updateUtangFirebase(
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
            collection

        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const ref =
            doc(
                window.db,
                COLLECTION.UTANG,
                id
            );


        const snapshot =
            await getDoc(
                ref
            );


        if (!snapshot.exists()) {

            throw new Error(
                "Data utang tidak ditemukan."
            );

        }


        const dataLama =
            snapshot.data();


        // =====================================
        // JIKA SUDAH DIBAYAR
        // =====================================
        //
        // Jangan mengubah nominal utang
        // setelah ada pembayaran.
        // =====================================

        const dibayar =
            Number(
                dataLama.dibayar
            ) || 0;


        if (
            dibayar > 0 &&
            data.nominal !== undefined
        ) {

            throw new Error(
                "Utang yang sudah memiliki pembayaran tidak dapat mengubah nominal."
            );

        }


        // =====================================
        // UPDATE
        // =====================================

        await updateDoc(
            ref,
            data
        );


        // =====================================
        // JIKA NOMINAL DIUBAH
        // UPDATE TRANSAKSI AWAL
        // =====================================

        if (
            data.nominal !== undefined &&
            dataLama.transaksiId
        ) {

            const transaksiRef =
                doc(
                    window.db,
                    COLLECTION.TRANSAKSI,
                    dataLama.transaksiId
                );


            await updateDoc(
                transaksiRef,
                {

                    tanggal:
                        data.tanggal !== undefined
                            ? data.tanggal
                            : dataLama.tanggal,

                    nominal:
                        Number(
                            data.nominal
                        ) || 0,

                    keterangan:
                        data.keterangan !== undefined
                            ? data.keterangan
                            : dataLama.keterangan || "",

                    mediaTujuan:
                        "KAS",

                    jenisTransaksi:
                        JENIS_TRANSAKSI.PEMASUKAN,

                    jenisPendapatan:
                        "BUKAN_PENDAPATAN",

                    sumber:
                        "UTANG",

                    utangId:
                        id

                }
            );

        }


        console.log(
            "Utang berhasil diperbarui:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Update utang gagal:",
            error
        );


        return false;

    }

}


// =========================================
// SIMPAN PEMBAYARAN UTANG
// KE TRANSAKSI
// =========================================
//
// PEMBAYARAN UTANG:
//
// KAS   -
// UTANG -
//
// BUKAN BEBAN
// =========================================

async function simpanPembayaranUtangKeTransaksi(
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
            addDoc,
            doc,
            getDoc,
            updateDoc,
            serverTimestamp

        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // ID UTANG
        // =====================================

        const utangId =
            data.utangId ||
            (
                typeof UTANG_SEDANG_DIBAYAR !==
                "undefined" &&
                UTANG_SEDANG_DIBAYAR
                    ? UTANG_SEDANG_DIBAYAR.id
                    : null
            );


        if (!utangId) {

            throw new Error(
                "ID utang tidak ditemukan."
            );

        }


        // =====================================
        // NOMINAL
        // =====================================

        const nominal =
            Number(data.nominal) || 0;


        if (nominal <= 0) {

            throw new Error(
                "Nominal pembayaran harus lebih dari 0."
            );

        }


        // =====================================
        // AMBIL DATA UTANG
        // =====================================

        const utangRef =
            doc(
                window.db,
                COLLECTION.UTANG,
                utangId
            );


        const utangSnapshot =
            await getDoc(
                utangRef
            );


        if (!utangSnapshot.exists()) {

            throw new Error(
                "Data utang tidak ditemukan."
            );

        }


        const utang =
            utangSnapshot.data();


        const sisaLama =
            Number(
                utang.sisa
            ) || 0;


        const dibayarLama =
            Number(
                utang.dibayar
            ) || 0;


        // =====================================
        // VALIDASI
        // =====================================

        if (sisaLama <= 0) {

            throw new Error(
                "Utang sudah lunas."
            );

        }


        if (nominal > sisaLama) {

            throw new Error(
                "Pembayaran lebih besar dari sisa utang."
            );

        }


        // =====================================
        // PERHITUNGAN
        // =====================================

        const dibayarBaru =
            dibayarLama +
            nominal;


        const sisaBaru =
            Math.max(
                sisaLama -
                nominal,
                0
            );


        const statusBaru =
            sisaBaru <= 0
                ? "LUNAS"
                : "SEBAGIAN";


        // =====================================
        // DATA TRANSAKSI
        // =====================================
        //
        // KAS KELUAR
        // =====================================

        const dataSimpan = {

            jenisTransaksi:
                JENIS_TRANSAKSI.PENGELUARAN,

            tanggal:
                data.tanggal,

            unitUsaha:
                "BUMDES",

            akunKode:
                "UTANG",

            mediaAsal:
                "KAS",

            mediaTujuan:
                null,

            nominal:
                nominal,

            keterangan:
                data.keterangan ||
                "Pembayaran utang" +
                (
                    data.nama
                        ? " - " + data.nama
                        : ""
                ),

            sumber:
                "UTANG",

            jenisBeban:
                "BUKAN_BEBAN",

            utangId:
                utangId,

            dibuatPada:
                serverTimestamp()

        };


        // =====================================
        // SIMPAN TRANSAKSI
        // =====================================

        const transaksiRef =
            collection(
                window.db,
                COLLECTION.TRANSAKSI
            );


        const transaksiDoc =
            await addDoc(
                transaksiRef,
                dataSimpan
            );


        // =====================================
        // UPDATE UTANG
        // =====================================

        await updateDoc(

            utangRef,

            {

                dibayar:
                    dibayarBaru,

                sisa:
                    sisaBaru,

                status:
                    statusBaru

            }

        );


        console.log(
            "Pembayaran utang berhasil:",
            transaksiDoc.id
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan pembayaran utang gagal:",
            error
        );


        return false;

    }

}


// =========================================
// HAPUS UTANG
// =========================================
//
// HANYA BOLEH DIHAPUS JIKA BELUM DIBAYAR
//
//
// JIKA DIHAPUS:
// - DATA UTANG DIHAPUS
// - TRANSAKSI KAS MASUK AWAL JUGA DIHAPUS
// =========================================

async function hapusUtangFirebase(id) {

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

        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const utangRef =
            doc(
                window.db,
                COLLECTION.UTANG,
                id
            );


        const snapshot =
            await getDoc(
                utangRef
            );


        if (!snapshot.exists()) {

            throw new Error(
                "Data utang tidak ditemukan."
            );

        }


        const data =
            snapshot.data();


        const dibayar =
            Number(
                data.dibayar
            ) || 0;


        if (dibayar > 0) {

            throw new Error(
                "Utang yang sudah memiliki pembayaran tidak dapat dihapus."
            );

        }


        // =====================================
        // BATCH HAPUS
        // =====================================

        const batch =
            writeBatch(
                window.db
            );


        // Hapus utang
        batch.delete(
            utangRef
        );


        // Hapus transaksi awal
        if (data.transaksiId) {

            const transaksiRef =
                doc(
                    window.db,
                    COLLECTION.TRANSAKSI,
                    data.transaksiId
                );


            batch.delete(
                transaksiRef
            );

        }


        await batch.commit();


        console.log(
            "Utang dan transaksi awal berhasil dihapus:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus utang gagal:",
            error
        );


        return false;

    }

}


// =========================================
// LAPORAN UTANG FIREBASE
// =========================================

async function ambilLaporanUtangFirebase(
    sampai
) {

    try {

        console.log(
            "Mengambil Laporan Utang sampai:",
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
        // IMPORT FIREBASE
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
                COLLECTION.UTANG
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
        // HASIL
        // =====================================

        const data = [];


        let totalUtang = 0;

        let totalDibayar = 0;

        let totalSisa = 0;


        // =====================================
        // PROSES
        // =====================================

        snapshot.forEach(
            function(doc) {

                const item =
                    doc.data();


                const tanggal =
                    String(
                        item.tanggal || ""
                    ).substring(
                        0,
                        10
                    );


                // =============================
                // BATAS TANGGAL
                // =============================

                if (
                    sampai &&
                    tanggal &&
                    tanggal > sampai
                ) {

                    return;

                }


                // =============================
                // NOMINAL
                // =============================

                const nominal =
                    Number(
                        item.nominal
                    ) || 0;


                // =============================
                // DIBAYAR
                // =============================

                const dibayar =
                    Number(
                        item.dibayar
                    ) || 0;


                // =============================
                // SISA
                // =============================

                let sisa =
                    Number(
                        item.sisa
                    );


                if (
                    !Number.isFinite(sisa)
                ) {

                    sisa =
                        nominal -
                        dibayar;

                }


                if (sisa < 0) {

                    sisa = 0;

                }


                // =============================
                // STATUS
                // =============================

                let status =
                    item.status ||
                    "";


                if (!status) {

                    if (sisa <= 0) {

                        status =
                            "LUNAS";

                    } else if (
                        dibayar > 0
                    ) {

                        status =
                            "SEBAGIAN";

                    } else {

                        status =
                            "BELUM LUNAS";

                    }

                }


                // =============================
                // TOTAL
                // =============================

                totalUtang +=
                    nominal;


                totalDibayar +=
                    dibayar;


                totalSisa +=
                    sisa;


                // =============================
                // DATA
                // =============================

                data.push({

                    id:
                        doc.id,

                    tanggal:
                        tanggal,

                    nama:
                        item.nama ||
                        "-",

                    keterangan:
                        item.keterangan ||
                        "",

                    nominal:
                        nominal,

                    dibayar:
                        dibayar,

                    sisa:
                        sisa,

                    jatuhTempo:
                        item.jatuhTempo ||
                        "",

                    status:
                        status

                });

            }
        );


        // =====================================
        // URUTKAN
        // =====================================

        data.sort(
            function(a, b) {

                return String(
                    a.tanggal
                ).localeCompare(
                    String(b.tanggal)
                );

            }
        );


        // =====================================
        // HASIL
        // =====================================

        const hasil = {

            sampai:
                sampai || null,

            data:
                data,

            total:
                totalSisa,

            totalUtang:
                totalUtang,

            totalDibayar:
                totalDibayar,

            totalSisa:
                totalSisa,

            jumlahUtang:
                data.length

        };


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "Laporan Utang berhasil:",
            hasil
        );


        console.log(
            "Jumlah Utang:",
            hasil.jumlahUtang
        );


        console.log(
            "Total Utang:",
            hasil.totalUtang
        );


        console.log(
            "Total Dibayar:",
            hasil.totalDibayar
        );


        console.log(
            "Total Sisa Utang:",
            hasil.totalSisa
        );


        return hasil;


    } catch (error) {

        console.error(
            "Ambil Laporan Utang gagal:",
            error
        );


        throw error;

    }

}


// =========================================
// SELESAI UTANG FIREBASE
// =========================================

console.log(
    "utang.firebase.js berhasil dimuat."
);
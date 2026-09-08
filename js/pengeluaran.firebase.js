// =========================================
// PENGELUARAN FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// SIMPAN DATA PENGELUARAN
// =========================================

async function simpanPengeluaranFirebase(data) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            collection,
            addDoc,
            serverTimestamp
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const dataSimpan = {

            // =====================================
            // JENIS TRANSAKSI UTAMA
            // =====================================

            jenisTransaksi:
                JENIS_TRANSAKSI.PENGELUARAN,


            // =====================================
            // JENIS PENGELUARAN
            // BEBAN / ASET
            // =====================================

            jenisPengeluaran:
                data.jenisPengeluaran || "BEBAN",


            // =====================================
            // DATA UTAMA
            // =====================================

            tanggal:
                data.tanggal,

            unitUsaha:
                data.unitUsaha,


            // =====================================
            // SUPPLIER
            // =====================================

            supplierId:
                data.supplierId || "",


            // =====================================
            // AKUN
            // =====================================

            akunKode:
                data.akun,


            // =====================================
            // ASET
            // HANYA TERISI JIKA PEMBELIAN ASET
            // =====================================

            asetId:
                data.asetId || "",


            // =====================================
            // PEMBAYARAN
            // =====================================

            mediaAsal:
                data.mediaAsal,


            nominal:
                data.nominal,


            // =====================================
            // KETERANGAN
            // =====================================

            keterangan:
                data.keterangan,


            nomorBukti:
                data.nomorBukti,


            // =====================================
            // WAKTU
            // =====================================

            dibuatPada:
                serverTimestamp()

        };


        await addDoc(

            collection(
                window.db,
                COLLECTION.TRANSAKSI
            ),

            dataSimpan

        );


        console.log(
            "Pengeluaran berhasil disimpan:",
            dataSimpan
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan pengeluaran gagal:",
            error
        );


        return false;

    }

}


// =========================================
// BACA DATA PENGELUARAN DARI FIREBASE
// =========================================

async function loadPengeluaranFirebase() {

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


        // =====================================
        // URUTKAN BERDASARKAN TANGGAL
        // =====================================

        const q =
            query(
                ref,
                orderBy("tanggal", "desc")
            );


        const snapshot =
            await getDocs(q);


        const data = [];


        snapshot.forEach(function(doc) {

            const item =
                doc.data();


            // =================================
            // HANYA PENGELUARAN
            // =================================

            if (
                item.jenisTransaksi ===
                JENIS_TRANSAKSI.PENGELUARAN
            ) {

                data.push({

                    id: doc.id,

                    ...item

                });

            }

        });


        return data;


    } catch (error) {

        console.error(
            "Load pengeluaran gagal:",
            error
        );


        return [];

    }

}


// =========================================
// AMBIL SATU DATA PENGELUARAN
// =========================================

async function ambilPengeluaranFirebase(id) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            doc,
            getDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const ref =
            doc(
                window.db,
                COLLECTION.TRANSAKSI,
                id
            );


        const snapshot =
            await getDoc(ref);


        if (!snapshot.exists()) {

            return null;

        }


        return {

            id: snapshot.id,

            ...snapshot.data()

        };


    } catch (error) {

        console.error(
            "Ambil pengeluaran gagal:",
            error
        );


        return null;

    }

}


// =========================================
// UPDATE DATA PENGELUARAN
// =========================================

async function updatePengeluaranFirebase(
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
            updateDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const ref =
            doc(
                window.db,
                COLLECTION.TRANSAKSI,
                id
            );


        await updateDoc(
            ref,
            {

                // =================================
                // JENIS PENGELUARAN
                // =================================

                jenisPengeluaran:
                    data.jenisPengeluaran || "BEBAN",


                // =================================
                // DATA UTAMA
                // =================================

                tanggal:
                    data.tanggal,

                unitUsaha:
                    data.unitUsaha,


                // =================================
                // SUPPLIER
                // =================================

                supplierId:
                    data.supplierId || "",


                // =================================
                // AKUN
                // =================================

                akunKode:
                    data.akun,


                // =================================
                // ASET
                // =================================

                asetId:
                    data.asetId || "",


                // =================================
                // PEMBAYARAN
                // =================================

                mediaAsal:
                    data.mediaAsal,


                nominal:
                    data.nominal,


                // =================================
                // KETERANGAN
                // =================================

                keterangan:
                    data.keterangan,


                nomorBukti:
                    data.nomorBukti,


                // =================================
                // WAKTU UPDATE
                // =================================

                diperbaruiPada:
                    new Date()

            }
        );


        console.log(
            "Pengeluaran berhasil diperbarui:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Update pengeluaran gagal:",
            error
        );


        return false;

    }

}


// =========================================
// HAPUS DATA PENGELUARAN
// =========================================

async function hapusPengeluaranFirebase(id) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            doc,
            deleteDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const ref =
            doc(
                window.db,
                COLLECTION.TRANSAKSI,
                id
            );


        await deleteDoc(ref);


        console.log(
            "Pengeluaran berhasil dihapus:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus pengeluaran gagal:",
            error
        );


        return false;

    }

}
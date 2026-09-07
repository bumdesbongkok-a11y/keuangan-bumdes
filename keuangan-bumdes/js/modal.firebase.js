// =========================================
// MODAL FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// IMPORT FIREBASE
// =========================================

async function getFirestoreModal() {

    return await import(
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
    );

}


// =========================================
// SIMPAN MODAL
// + CATAT KE colTransaksi
// =========================================

async function simpanModalFirebase(data) {

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
        } = await getFirestoreModal();


        // =====================================
        // VALIDASI MEDIA
        // =====================================

        if (
            !data.media ||
            ![
                MEDIA_UANG.KAS,
                MEDIA_UANG.BANK,
                MEDIA_UANG.DANA
            ].includes(data.media)
        ) {

            throw new Error(
                "Media modal tidak valid."
            );

        }


        // =====================================
        // 1. SIMPAN KE colModal
        // =====================================

        const dataModal = {

            tanggal:
                data.tanggal,

            sumber:
                data.sumber || "",

            jenis:
                data.jenis || "",

            nominal:
                Number(data.nominal) || 0,

            media:
                data.media,

            keterangan:
                data.keterangan || "",

            createdAt:
                serverTimestamp()

        };


        const refModal =
            collection(
                window.db,
                COLLECTION.MODAL
            );


        const modalRef =
            await addDoc(
                refModal,
                dataModal
            );


        // =====================================
        // 2. CATAT KE colTransaksi
        // =====================================

        const dataTransaksi = {

            jenisTransaksi:
                JENIS_TRANSAKSI.PEMASUKAN,

            tanggal:
                data.tanggal,

            unitUsaha:
                "BUMDES",

            akunKode:
                "MODAL",

            mediaTujuan:
                data.media,

            nominal:
                Number(data.nominal) || 0,

            keterangan:
                data.keterangan ||
                (
                    "Penerimaan modal - " +
                    (data.sumber || "")
                ),

            nomorBukti:
                data.nomorBukti || "",

            sumberModal:
                data.sumber || "",

            jenisModal:
                data.jenis || "",

            modalId:
                modalRef.id,

            dibuatPada:
                serverTimestamp()

        };


        const refTransaksi =
            collection(
                window.db,
                COLLECTION.TRANSAKSI
            );


        const transaksiRef =
            await addDoc(
                refTransaksi,
                dataTransaksi
            );


        // =====================================
        // 3. SIMPAN ID TRANSAKSI KE MODAL
        // =====================================

        const {
            doc,
            updateDoc
        } = await getFirestoreModal();


        await updateDoc(

            doc(
                window.db,
                COLLECTION.MODAL,
                modalRef.id
            ),

            {

                transaksiId:
                    transaksiRef.id

            }

        );


        console.log(
            "Modal berhasil disimpan."
        );


        console.log(
            "ID Modal:",
            modalRef.id
        );


        console.log(
            "ID Transaksi:",
            transaksiRef.id
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan modal gagal:",
            error
        );


        return false;

    }

}


// =========================================
// LOAD MODAL
// =========================================

async function loadModalFirebase() {

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
        } = await getFirestoreModal();


        const ref =
            collection(
                window.db,
                COLLECTION.MODAL
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


        snapshot.forEach(function(doc) {

            data.push({

                id:
                    doc.id,

                ...doc.data()

            });

        });


        console.log(
            "Data modal dari Firebase:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Load modal gagal:",
            error
        );


        return [];

    }

}


// =========================================
// AMBIL SATU MODAL
// =========================================

async function ambilModalFirebase(id) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            doc,
            getDoc
        } = await getFirestoreModal();


        const ref =
            doc(
                window.db,
                COLLECTION.MODAL,
                id
            );


        const snapshot =
            await getDoc(ref);


        if (!snapshot.exists()) {

            return null;

        }


        return {

            id:
                snapshot.id,

            ...snapshot.data()

        };


    } catch (error) {

        console.error(
            "Ambil modal gagal:",
            error
        );


        return null;

    }

}


// =========================================
// UPDATE MODAL
// + UPDATE colTransaksi
// =========================================

async function updateModalFirebase(
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
            updateDoc
        } = await getFirestoreModal();


        // =====================================
        // AMBIL DATA MODAL LAMA
        // =====================================

        const modalRef =
            doc(
                window.db,
                COLLECTION.MODAL,
                id
            );


        const modalSnapshot =
            await getDoc(modalRef);


        if (!modalSnapshot.exists()) {

            throw new Error(
                "Data modal tidak ditemukan."
            );

        }


        const modalLama =
            modalSnapshot.data();


        // =====================================
        // UPDATE colModal
        // =====================================

        const dataUpdate = {

            tanggal:
                data.tanggal,

            sumber:
                data.sumber || "",

            jenis:
                data.jenis || "",

            nominal:
                Number(data.nominal) || 0,

            media:
                data.media,

            keterangan:
                data.keterangan || "",

            diperbaruiPada:
                new Date()

        };


        await updateDoc(
            modalRef,
            dataUpdate
        );


        // =====================================
        // UPDATE TRANSAKSI TERKAIT
        // =====================================

        const transaksiId =
            modalLama.transaksiId;


        if (transaksiId) {

            const transaksiRef =
                doc(
                    window.db,
                    COLLECTION.TRANSAKSI,
                    transaksiId
                );


            await updateDoc(

                transaksiRef,

                {

                    jenisTransaksi:
                        JENIS_TRANSAKSI.PEMASUKAN,

                    tanggal:
                        data.tanggal,

                    unitUsaha:
                        "BUMDES",

                    akunKode:
                        "MODAL",

                    mediaTujuan:
                        data.media,

                    nominal:
                        Number(data.nominal) || 0,

                    keterangan:
                        data.keterangan ||
                        (
                            "Penerimaan modal - " +
                            (data.sumber || "")
                        ),

                    sumberModal:
                        data.sumber || "",

                    jenisModal:
                        data.jenis || "",

                    modalId:
                        id,

                    diperbaruiPada:
                        new Date()

                }

            );


            console.log(
                "Transaksi modal berhasil diperbarui:",
                transaksiId
            );

        }


        // =====================================
        // JIKA DATA LAMA BELUM PUNYA
        // transaksiId
        // =====================================

        else {

            console.warn(
                "Modal lama belum memiliki transaksiId. " +
                "Tidak membuat transaksi otomatis saat edit."
            );

        }


        console.log(
            "Modal berhasil diperbarui:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Update modal gagal:",
            error
        );


        return false;

    }

}


// =========================================
// HAPUS MODAL
// + HAPUS TRANSAKSI TERKAIT
// =========================================

async function hapusModalFirebase(id) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            doc,
            getDoc,
            deleteDoc
        } = await getFirestoreModal();


        // =====================================
        // AMBIL DATA MODAL
        // =====================================

        const modalRef =
            doc(
                window.db,
                COLLECTION.MODAL,
                id
            );


        const modalSnapshot =
            await getDoc(modalRef);


        if (!modalSnapshot.exists()) {

            throw new Error(
                "Data modal tidak ditemukan."
            );

        }


        const modalData =
            modalSnapshot.data();


        // =====================================
        // HAPUS TRANSAKSI TERKAIT
        // =====================================

        if (modalData.transaksiId) {

            const transaksiRef =
                doc(
                    window.db,
                    COLLECTION.TRANSAKSI,
                    modalData.transaksiId
                );


            await deleteDoc(
                transaksiRef
            );


            console.log(
                "Transaksi modal dihapus:",
                modalData.transaksiId
            );

        }


        // =====================================
        // HAPUS DATA MODAL
        // =====================================

        await deleteDoc(
            modalRef
        );


        console.log(
            "Modal berhasil dihapus:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus modal gagal:",
            error
        );


        return false;

    }

}

// =========================================
// LAPORAN MODAL
// =========================================

async function ambilLaporanModalFirebase(sampai) {

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
        } = await getFirestoreModal();


        // =====================================
        // AMBIL DATA MODAL
        // =====================================

        const ref =
            collection(
                window.db,
                COLLECTION.MODAL
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


        let totalModal = 0;


        snapshot.forEach(function(doc) {

            const item =
                doc.data();


            // =================================
            // FILTER SAMPAI TANGGAL
            // =================================

            if (
                item.tanggal &&
                item.tanggal > sampai
            ) {

                return;

            }


            const nominal =
                Number(item.nominal) || 0;


            totalModal += nominal;


            data.push({

                id:
                    doc.id,

                tanggal:
                    item.tanggal || "",

                sumber:
                    item.sumber || "",

                jenis:
                    item.jenis || "",

                nominal:
                    nominal,

                media:
                    item.media || "",

                keterangan:
                    item.keterangan || ""

            });

        });


        console.log(
            "Laporan modal:",
            data
        );


        console.log(
            "Total modal:",
            totalModal
        );


        return {

            sampai:
                sampai,

            data:
                data,

            jumlahModal:
                data.length,

            totalModal:
                totalModal,

            total:
                totalModal

        };


    } catch (error) {

        console.error(
            "Ambil laporan modal gagal:",
            error
        );


        throw error;

    }

}
// =========================================
// TRANSFER FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================

async function simpanTransferFirebase(data) {

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

            jenisTransaksi:
                JENIS_TRANSAKSI.TRANSFER,

            tanggal:
                data.tanggal,

            mediaAsal:
                data.mediaAsal,

            mediaTujuan:
                data.mediaTujuan,

            nominal:
                data.nominal,

            keterangan:
                data.keterangan,

            nomorBukti:
                data.nomorBukti,

            dibuatPada:
                serverTimestamp()

        };


        const docRef =
            await addDoc(
                collection(
                    window.db,
                    COLLECTION.TRANSAKSI
                ),
                dataSimpan
            );


        return true;


    } catch (error) {

        console.error(
            "Simpan transfer gagal:",
            error
        );

        return false;

    }

}

// =========================================
// BACA DATA TRANSFER DARI FIREBASE
// =========================================

async function loadTransferFirebase() {

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
                COLLECTION.TRANSAKSI
            );


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


            if (
                item.jenisTransaksi ===
                JENIS_TRANSAKSI.TRANSFER
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
            "Load transfer gagal:",
            error
        );


        return [];

    }

}

// =========================================
// AMBIL SATU DATA TRANSFER
// =========================================

async function ambilTransferFirebase(id) {

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
            "Ambil transfer gagal:",
            error
        );

        return null;

    }

}

// =========================================
// UPDATE DATA TRANSFER
// =========================================

async function updateTransferFirebase(id, data) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            doc,
            updateDoc,
            serverTimestamp
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

                tanggal:
                    data.tanggal,

                mediaAsal:
                    data.mediaAsal,

                mediaTujuan:
                    data.mediaTujuan,

                nominal:
                    data.nominal,

                keterangan:
                    data.keterangan,

                nomorBukti:
                    data.nomorBukti,

                diperbaruiPada:
                    serverTimestamp()

            }
        );


        return true;


    } catch (error) {

        console.error(
            "Update transfer gagal:",
            error
        );

        return false;

    }

}

// =========================================
// HAPUS DATA TRANSFER
// =========================================

async function hapusTransferFirebase(id) {

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


        return true;


    } catch (error) {

        console.error(
            "Hapus transfer gagal:",
            error
        );

        return false;

    }

}
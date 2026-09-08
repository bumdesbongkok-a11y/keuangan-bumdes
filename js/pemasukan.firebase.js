// =========================================
// PEMASUKAN FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// SIMPAN DATA PEMASUKAN
// =========================================

async function simpanPemasukanFirebase(data) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        // =====================================
        // CEK PERIODE TUTUP BUKU
        // =====================================

        if (
            typeof cekTanggalTerkunciFirebase ===
            "function"
        ) {

            const terkunci =
                await cekTanggalTerkunciFirebase(
                    data.tanggal
                );


            if (terkunci) {

                throw new Error(
                    "Pemasukan tidak dapat disimpan. " +
                    "Tanggal tersebut berada dalam periode yang sudah Tutup Buku."
                );

            }

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
                JENIS_TRANSAKSI.PEMASUKAN,

            tanggal:
                data.tanggal,

            unitUsaha:
                data.unitUsaha,

            pelangganId:
                data.pelangganId || "",

            akunKode:
                data.akun,

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


        // =====================================
        // DETAIL KHUSUS PENGELOLAAN SAMPAH
        // =====================================

        if (
            data.unitUsaha ===
            UNIT_USAHA.PENGELOLAAN_SAMPAH
        ) {

            dataSimpan.jenisPendapatan =
                data.jenisPendapatan;

            dataSimpan.rt =
                data.rt;

            dataSimpan.rw =
                data.rw;

            dataSimpan.namaPenyetor =
                data.namaPenyetor;

        }


        const docRef =
            await addDoc(
                collection(
                    window.db,
                    COLLECTION.TRANSAKSI
                ),
                dataSimpan
            );


        console.log(
            "Pemasukan berhasil disimpan."
        );


        console.log(
            "ID transaksi:",
            docRef.id
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan pemasukan gagal:",
            error
        );


        // Lempar kembali error supaya UI
        // dapat menampilkan alasan penolakan.

        throw error;

    }

}


// =========================================
// BACA DATA PEMASUKAN DARI FIREBASE
// =========================================

async function loadPemasukanFirebase() {

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
                JENIS_TRANSAKSI.PEMASUKAN
            ) {

                data.push({

                    id:
                        doc.id,

                    ...item

                });

            }

        });


        console.log(
            "Data pemasukan dari Firebase:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Load pemasukan gagal:",
            error
        );


        return [];

    }

}


// =========================================
// AMBIL SATU DATA PEMASUKAN
// =========================================

async function ambilPemasukanFirebase(id) {

    try {

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

            console.error(
                "Data pemasukan tidak ditemukan:",
                id
            );


            return null;

        }


        return {

            id:
                snapshot.id,

            ...snapshot.data()

        };


    } catch (error) {

        console.error(
            "Ambil pemasukan gagal:",
            error
        );


        return null;

    }

}


// =========================================
// UPDATE DATA PEMASUKAN
// =========================================

async function updatePemasukanFirebase(
    id,
    data
) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        // =====================================
        // CEK TANGGAL BARU
        // =====================================

        if (
            typeof cekTanggalTerkunciFirebase ===
            "function"
        ) {

            const tanggalTerkunci =
                await cekTanggalTerkunciFirebase(
                    data.tanggal
                );


            if (tanggalTerkunci) {

                throw new Error(
                    "Pemasukan tidak dapat diedit. " +
                    "Tanggal tersebut berada dalam periode yang sudah Tutup Buku."
                );

            }

        }


        // =====================================
        // AMBIL DATA LAMA
        // =====================================

        const dataLama =
            await ambilPemasukanFirebase(
                id
            );


        if (!dataLama) {

            throw new Error(
                "Data pemasukan tidak ditemukan."
            );

        }


        // =====================================
        // CEK TANGGAL LAMA
        // =====================================

        if (
            typeof cekTanggalTerkunciFirebase ===
            "function"
        ) {

            const tanggalLamaTerkunci =
                await cekTanggalTerkunciFirebase(
                    dataLama.tanggal
                );


            if (tanggalLamaTerkunci) {

                throw new Error(
                    "Pemasukan tidak dapat diedit. " +
                    "Transaksi ini berada dalam periode yang sudah Tutup Buku."
                );

            }

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


        const dataUpdate = {

            tanggal:
                data.tanggal,

            unitUsaha:
                data.unitUsaha,

            pelangganId:
                data.pelangganId || "",

            akunKode:
                data.akun,

            mediaTujuan:
                data.mediaTujuan,

            nominal:
                data.nominal,

            keterangan:
                data.keterangan,

            nomorBukti:
                data.nomorBukti,

            diperbaruiPada:
                new Date()

        };


        // =====================================
        // DETAIL PENGELOLAAN SAMPAH
        // =====================================

        if (
            data.unitUsaha ===
            UNIT_USAHA.PENGELOLAAN_SAMPAH
        ) {

            dataUpdate.jenisPendapatan =
                data.jenisPendapatan || "";

            dataUpdate.rt =
                data.rt || "";

            dataUpdate.rw =
                data.rw || "";

            dataUpdate.namaPenyetor =
                data.namaPenyetor || "";

        }


        await updateDoc(
            ref,
            dataUpdate
        );


        console.log(
            "Pemasukan berhasil diperbarui:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Update pemasukan gagal:",
            error
        );


        throw error;

    }

}


// =========================================
// HAPUS DATA PEMASUKAN
// =========================================

async function hapusPemasukanFirebase(id) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        // =====================================
        // AMBIL DATA SEBELUM DIHAPUS
        // =====================================

        const data =
            await ambilPemasukanFirebase(
                id
            );


        if (!data) {

            throw new Error(
                "Data pemasukan tidak ditemukan."
            );

        }


        // =====================================
        // CEK PERIODE TUTUP BUKU
        // =====================================

        if (
            typeof cekTanggalTerkunciFirebase ===
            "function"
        ) {

            const terkunci =
                await cekTanggalTerkunciFirebase(
                    data.tanggal
                );


            if (terkunci) {

                throw new Error(
                    "Pemasukan tidak dapat dihapus. " +
                    "Transaksi ini berada dalam periode yang sudah Tutup Buku."
                );

            }

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


        await deleteDoc(
            ref
        );


        console.log(
            "Pemasukan berhasil dihapus:",
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus pemasukan gagal:",
            error
        );


        throw error;

    }

}
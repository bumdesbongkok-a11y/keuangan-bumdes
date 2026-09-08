// =========================================
// TUTUP BUKU FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FIRESTORE
// =========================================

async function getFirestoreTutupBuku() {

    return await import(
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
    );

}


// =========================================
// CEK TUTUP BUKU PERIODE
// =========================================

async function cekTutupBukuFirebase(
    dari,
    sampai
) {

    if (!window.db) {

        throw new Error(
            "Firebase Firestore belum tersedia."
        );

    }


    const {
        collection,
        getDocs,
        query,
        where
    } =
        await getFirestoreTutupBuku();


    const ref =
        collection(
            window.db,
            COLLECTION.TUTUP_BUKU
        );


    const q =
        query(
            ref,
            where(
                "dari",
                "==",
                dari
            ),
            where(
                "sampai",
                "==",
                sampai
            )
        );


    const snapshot =
        await getDocs(q);


    return !snapshot.empty;

}


// =========================================
// CEK TANGGAL TRANSAKSI TERKUNCI
// =========================================
//
// Mengembalikan TRUE jika tanggal transaksi
// berada di dalam salah satu periode yang
// sudah Tutup Buku.
//
// Contoh:
//
// Tutup Buku:
// 01/09/2026 - 04/09/2026
//
// Transaksi:
// 02/09/2026
//
// Hasil:
// TRUE = TERKUNCI
//
// Transaksi:
// 05/09/2026
//
// Hasil:
// FALSE = MASIH BOLEH
// =========================================

async function cekTanggalTerkunciFirebase(
    tanggal
) {

    if (!window.db) {

        throw new Error(
            "Firebase Firestore belum tersedia."
        );

    }


    if (!tanggal) {

        return false;

    }


    const {
        collection,
        getDocs
    } =
        await getFirestoreTutupBuku();


    const ref =
        collection(
            window.db,
            COLLECTION.TUTUP_BUKU
        );


    const snapshot =
        await getDocs(ref);


    let terkunci = false;


    snapshot.forEach(
        function(doc) {

            const item =
                doc.data();


            const dari =
                item.dari || "";


            const sampai =
                item.sampai || "";


            if (
                dari &&
                sampai &&
                tanggal >= dari &&
                tanggal <= sampai
            ) {

                terkunci = true;

            }

        }
    );


    return terkunci;

}


// =========================================
// AMBIL DATA TUTUP BUKU YANG MENGUNCI
// =========================================
//
// Digunakan untuk menampilkan pesan:
//
// "Transaksi termasuk periode Tutup Buku
//  September 2026."
//
// Jika tidak terkunci -> null
// =========================================

async function ambilTutupBukuUntukTanggalFirebase(
    tanggal
) {

    if (!window.db) {

        throw new Error(
            "Firebase Firestore belum tersedia."
        );

    }


    if (!tanggal) {

        return null;

    }


    const {
        collection,
        getDocs
    } =
        await getFirestoreTutupBuku();


    const ref =
        collection(
            window.db,
            COLLECTION.TUTUP_BUKU
        );


    const snapshot =
        await getDocs(ref);


    let hasil = null;


    snapshot.forEach(
        function(doc) {

            if (hasil) {

                return;

            }


            const item =
                doc.data();


            const dari =
                item.dari || "";


            const sampai =
                item.sampai || "";


            if (
                dari &&
                sampai &&
                tanggal >= dari &&
                tanggal <= sampai
            ) {

                hasil = {

                    id:
                        doc.id,

                    dari:
                        dari,

                    sampai:
                        sampai,

                    status:
                        item.status || "",

                    ditutupPada:
                        item.ditutupPada || null

                };

            }

        }
    );


    return hasil;

}


// =========================================
// CEK APAKAH TRANSAKSI BOLEH DIUBAH
// =========================================

async function validasiEditTransaksiFirebase(
    tanggal
) {

    const tutupBuku =
        await ambilTutupBukuUntukTanggalFirebase(
            tanggal
        );


    if (tutupBuku) {

        throw new Error(
            "Transaksi termasuk periode Tutup Buku " +
            tutupBuku.dari +
            " s.d. " +
            tutupBuku.sampai +
            " dan tidak dapat diedit."
        );

    }


    return true;

}


// =========================================
// CEK APAKAH TRANSAKSI BOLEH DIHAPUS
// =========================================

async function validasiHapusTransaksiFirebase(
    tanggal
) {

    const tutupBuku =
        await ambilTutupBukuUntukTanggalFirebase(
            tanggal
        );


    if (tutupBuku) {

        throw new Error(
            "Transaksi termasuk periode Tutup Buku " +
            tutupBuku.dari +
            " s.d. " +
            tutupBuku.sampai +
            " dan tidak dapat dihapus."
        );

    }


    return true;

}


// =========================================
// SIMPAN TUTUP BUKU
// =========================================

async function simpanTutupBukuFirebase(
    data
) {

    if (!window.db) {

        throw new Error(
            "Firebase Firestore belum tersedia."
        );

    }


    if (!data) {

        throw new Error(
            "Data tutup buku tidak tersedia."
        );

    }


    if (
        !data.dari ||
        !data.sampai
    ) {

        throw new Error(
            "Periode tutup buku belum lengkap."
        );

    }


    // =====================================
    // CEK ULANG PERIODE PERSIS
    // =====================================

    const sudahDitutup =
        await cekTutupBukuFirebase(
            data.dari,
            data.sampai
        );


    if (sudahDitutup) {

        throw new Error(
            "Periode tersebut sudah pernah ditutup."
        );

    }


    // =====================================
    // CEK PERIODE BERTABRAKAN
    // =====================================
    //
    // Mencegah membuat Tutup Buku yang
    // tumpang tindih dengan periode lama.
    //
    // Contoh:
    //
    // Sudah tutup:
    // 01/09 - 30/09
    //
    // Tidak boleh membuat:
    // 15/09 - 15/10
    //
    // =====================================

    const {
        collection,
        getDocs,
        addDoc,
        serverTimestamp
    } =
        await getFirestoreTutupBuku();


    const ref =
        collection(
            window.db,
            COLLECTION.TUTUP_BUKU
        );


    const snapshot =
        await getDocs(ref);


    let periodeBertabrakan = false;


    snapshot.forEach(
        function(doc) {

            const item =
                doc.data();


            const dariLama =
                item.dari || "";


            const sampaiLama =
                item.sampai || "";


            if (
                dariLama &&
                sampaiLama &&
                data.dari <= sampaiLama &&
                data.sampai >= dariLama
            ) {

                periodeBertabrakan = true;

            }

        }
    );


    if (periodeBertabrakan) {

        throw new Error(
            "Periode Tutup Buku bertabrakan " +
            "dengan periode yang sudah ditutup."
        );

    }


    // =====================================
    // SNAPSHOT LAPORAN
    // =====================================

    const dataSimpan = {

        dari:
            data.dari,

        sampai:
            data.sampai,

        status:
            "DITUTUP",


        // =================================
        // LAPORAN
        // =================================

        labaRugi:
            data.labaRugi || null,

        arusKas:
            data.arusKas || null,

        piutang:
            data.piutang || null,

        utang:
            data.utang || null,

        aset:
            data.aset || null,

        modal:
            data.modal || null,


        // =================================
        // IDENTITAS
        // =================================

        namaBUMDes:
            typeof APP_CONFIG !== "undefined"
                ? APP_CONFIG.namaBUMDes || ""
                : "",

        desa:
            typeof APP_CONFIG !== "undefined"
                ? APP_CONFIG.desa || ""
                : "",


        // =================================
        // WAKTU
        // =================================

        ditutupPada:
            serverTimestamp()

    };


    const docRef =
        await addDoc(
            ref,
            dataSimpan
        );


    console.log(
        "Tutup buku berhasil disimpan:",
        docRef.id
    );


    return {

        berhasil:
            true,

        id:
            docRef.id

    };

}


// =========================================
// LOAD TUTUP BUKU
// =========================================

async function loadTutupBukuFirebase() {

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
    } =
        await getFirestoreTutupBuku();


    const ref =
        collection(
            window.db,
            COLLECTION.TUTUP_BUKU
        );


    const q =
        query(
            ref,
            orderBy(
                "sampai",
                "desc"
            )
        );


    const snapshot =
        await getDocs(q);


    const data = [];


    snapshot.forEach(
        function(doc) {

            const item =
                doc.data();


            data.push({

                id:
                    doc.id,

                dari:
                    item.dari || "",

                sampai:
                    item.sampai || "",

                status:
                    item.status || "",

                namaBUMDes:
                    item.namaBUMDes || "",

                desa:
                    item.desa || "",

                labaRugi:
                    item.labaRugi || null,

                arusKas:
                    item.arusKas || null,

                piutang:
                    item.piutang || null,

                utang:
                    item.utang || null,

                aset:
                    item.aset || null,

                modal:
                    item.modal || null,

                ditutupPada:
                    item.ditutupPada || null

            });

        }
    );


    return data;

}


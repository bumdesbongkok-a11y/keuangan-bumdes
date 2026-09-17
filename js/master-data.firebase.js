// =========================================
// MASTER DATA FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// AMBIL UNIT USAHA
// =========================================

async function ambilUnitUsahaFirebase() {

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


        const q =
            query(
                collection(
                    window.db,
                    "masterUnitUsaha"
                ),
                orderBy(
                    "nama",
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
            "Data unit usaha:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Ambil unit usaha gagal:",
            error
        );

        return [];

    }

}


// =========================================
// SIMPAN UNIT USAHA
// =========================================

async function simpanUnitUsahaFirebase(data) {

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

            kode:
                data.kode,

            nama:
                data.nama,

            keterangan:
                data.keterangan,

            status:
                data.status,

            dibuatPada:
                serverTimestamp()

        };


        const docRef =
            await addDoc(
                collection(
                    window.db,
                    "masterUnitUsaha"
                ),
                dataSimpan
            );


        console.log(
            "Unit usaha berhasil disimpan."
        );

        console.log(
            "ID unit usaha:",
            docRef.id
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan unit usaha gagal:",
            error
        );

        return false;

    }

}


// =========================================
// UPDATE UNIT USAHA
// =========================================

async function updateUnitUsahaFirebase(
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


        await updateDoc(

            doc(
                window.db,
                "masterUnitUsaha",
                id
            ),

            {

                kode:
                    data.kode,

                nama:
                    data.nama,

                keterangan:
                    data.keterangan,

                status:
                    data.status,

                diubahPada:
                    new Date()

            }

        );


        console.log(
            "Unit usaha berhasil diperbarui."
        );


        return true;


    } catch (error) {

        console.error(
            "Update unit usaha gagal:",
            error
        );

        return false;

    }

}


// =========================================
// HAPUS UNIT USAHA
// =========================================

async function hapusUnitUsahaFirebase(id) {

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


        await deleteDoc(

            doc(
                window.db,
                "masterUnitUsaha",
                id
            )

        );


        console.log(
            "Unit usaha berhasil dihapus."
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus unit usaha gagal:",
            error
        );

        return false;

    }

}


// =========================================
// CEK KODE UNIT USAHA
// =========================================

async function cekKodeUnitUsahaFirebase(
    kode,
    kecualiId = null
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
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const snapshot =
            await getDocs(
                collection(
                    window.db,
                    "masterUnitUsaha"
                )
            );


        let ditemukan = false;


        snapshot.forEach(function(doc) {

            if (
                kecualiId &&
                doc.id === kecualiId
            ) {

                return;

            }


            const data =
                doc.data();


            if (
                String(data.kode || "")
                    .toUpperCase() ===
                String(kode || "")
                    .toUpperCase()
            ) {

                ditemukan = true;

            }

        });


        return ditemukan;


    } catch (error) {

        console.error(
            "Cek kode unit usaha gagal:",
            error
        );

        return true;

    }

}


// =========================================
// AMBIL AKUN
// =========================================

async function ambilAkunFirebase() {

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


        const q =
            query(
                collection(
                    window.db,
                    "masterAkun"
                ),
                orderBy(
                    "kode",
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
            "Data akun:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Ambil akun gagal:",
            error
        );

        return [];

    }

}


// =========================================
// SIMPAN AKUN
// =========================================

async function simpanAkunFirebase(data) {

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

            kode:
                data.kode,

            nama:
                data.nama,

            jenis:
                data.jenis,

            unitUsaha:
                data.unitUsaha || "",

            keterangan:
                data.keterangan,

            status:
                data.status,

            dibuatPada:
                serverTimestamp()

        };


        const docRef =
            await addDoc(
                collection(
                    window.db,
                    "masterAkun"
                ),
                dataSimpan
            );


        console.log(
            "Akun berhasil disimpan."
        );

        console.log(
            "ID akun:",
            docRef.id
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan akun gagal:",
            error
        );

        return false;

    }

}


// =========================================
// UPDATE AKUN
// =========================================

async function updateAkunFirebase(
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


        const dataUpdate = {

            kode:
                data.kode,

            nama:
                data.nama,

            jenis:
                data.jenis,

            unitUsaha:
                data.unitUsaha || "",

            keterangan:
                data.keterangan,

            status:
                data.status

        };


        await updateDoc(
            doc(
                window.db,
                "masterAkun",
                id
            ),
            dataUpdate
        );


        console.log(
            "Akun berhasil diperbarui."
        );


        return true;


    } catch (error) {

        console.error(
            "Update akun gagal:",
            error
        );

        return false;

    }

}


// =========================================
// HAPUS AKUN
// =========================================

async function hapusAkunFirebase(id) {

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


        await deleteDoc(

            doc(
                window.db,
                "masterAkun",
                id
            )

        );


        console.log(
            "Akun berhasil dihapus."
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus akun gagal:",
            error
        );

        return false;

    }

}


// =========================================
// CEK KODE AKUN
// =========================================

async function cekKodeAkunFirebase(
    kode,
    kecualiId = null
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
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const snapshot =
            await getDocs(
                collection(
                    window.db,
                    "masterAkun"
                )
            );


        let ditemukan = false;


        snapshot.forEach(function(doc) {

            if (
                kecualiId &&
                doc.id === kecualiId
            ) {

                return;

            }


            const data =
                doc.data();


            if (
                String(data.kode || "")
                    .toUpperCase() ===
                String(kode || "")
                    .toUpperCase()
            ) {

                ditemukan = true;

            }

        });


        return ditemukan;


    } catch (error) {

        console.error(
            "Cek kode akun gagal:",
            error
        );

        return true;

    }

}


// =========================================
// INISIALISASI MASTER AKUN RESMI
// =========================================

async function inisialisasiMasterAkunResmi() {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }

        const {
            collection,
            getDocs,
            addDoc,
            serverTimestamp
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // MASTER AKUN RESMI
        // =====================================

        const daftarAkun = [

            // =================================
            // ASET
            // =================================

            {
                kode: "1100",
                nama: "Kas",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1110",
                nama: "Bank",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1120",
                nama: "DANA",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1130",
                nama: "Saldo Affiliate",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1200",
                nama: "Piutang Usaha",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1300",
                nama: "Persediaan",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1400",
                nama: "Aset Tetap",
                jenis: "aset",
                unitUsaha: ""
            },

            {
                kode: "1410",
                nama: "Akumulasi Penyusutan",
                jenis: "aset",
                unitUsaha: ""
            },


            // =================================
            // KEWAJIBAN
            // =================================

            {
                kode: "2100",
                nama: "Utang Usaha",
                jenis: "kewajiban",
                unitUsaha: ""
            },

            {
                kode: "2110",
                nama: "Utang Lainnya",
                jenis: "kewajiban",
                unitUsaha: ""
            },


            // =================================
            // MODAL
            // =================================

            {
                kode: "3100",
                nama: "Modal BUMDes",
                jenis: "modal",
                unitUsaha: ""
            },

            {
                kode: "3110",
                nama: "Modal Unit Usaha",
                jenis: "modal",
                unitUsaha: ""
            },

            {
                kode: "3120",
                nama: "Laba Ditahan",
                jenis: "modal",
                unitUsaha: ""
            },

            {
                kode: "3130",
                nama: "Laba Tahun Berjalan",
                jenis: "modal",
                unitUsaha: ""
            },


            // =================================
            // PENDAPATAN
            // =================================

            {
                kode: "4100",
                nama: "Pendapatan Retribusi Sampah",
                jenis: "pendapatan",
                unitUsaha: "PENGELOLAAN_SAMPAH"
            },

            {
                kode: "4200",
                nama: "Penjualan Telur",
                jenis: "pendapatan",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "4210",
                nama: "Penjualan Ayam",
                jenis: "pendapatan",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "4220",
                nama: "Penjualan Kotoran",
                jenis: "pendapatan",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "4230",
                nama: "Pendapatan Lainnya Ayam Petelur",
                jenis: "pendapatan",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "4300",
                nama: "Penjualan Sampah",
                jenis: "pendapatan",
                unitUsaha: "BANK_SAMPAH"
            },

            {
                kode: "4310",
                nama: "Pendapatan Lainnya Bank Sampah",
                jenis: "pendapatan",
                unitUsaha: "BANK_SAMPAH"
            },

            {
                kode: "4400",
                nama: "Pendapatan Affiliate",
                jenis: "pendapatan",
                unitUsaha: "AFFILIATE"
            },

            {
                kode: "4410",
                nama: "Pendapatan Affiliate Lainnya",
                jenis: "pendapatan",
                unitUsaha: "AFFILIATE"
            },


            // =================================
            // BEBAN PENGELOLAAN SAMPAH
            // =================================

            {
                kode: "5100",
                nama: "Beban Gaji",
                jenis: "beban",
                unitUsaha: "PENGELOLAAN_SAMPAH"
            },

            {
                kode: "5110",
                nama: "Beban BBM",
                jenis: "beban",
                unitUsaha: "PENGELOLAAN_SAMPAH"
            },

            {
                kode: "5120",
                nama: "Beban Perawatan",
                jenis: "beban",
                unitUsaha: "PENGELOLAAN_SAMPAH"
            },

            {
                kode: "5130",
                nama: "Beban Operasional",
                jenis: "beban",
                unitUsaha: "PENGELOLAAN_SAMPAH"
            },


            // =================================
            // BEBAN AYAM PETELUR
            // =================================

            {
                kode: "5200",
                nama: "Beban Pakan",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5210",
                nama: "Beban Vitamin & Obat",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5220",
                nama: "Beban Gaji",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5230",
                nama: "Beban Listrik",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5240",
                nama: "Beban Air",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5250",
                nama: "Beban Perawatan",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5260",
                nama: "Beban Operasional",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },

            {
                kode: "5270",
                nama: "Beban Penyusutan",
                jenis: "beban",
                unitUsaha: "AYAM_PETELUR"
            },


            // =================================
            // BEBAN BANK SAMPAH
            // =================================

            {
                kode: "5300",
                nama: "Beban Pembelian Sampah",
                jenis: "beban",
                unitUsaha: "BANK_SAMPAH"
            },

            {
                kode: "5310",
                nama: "Beban Gaji",
                jenis: "beban",
                unitUsaha: "BANK_SAMPAH"
            },

            {
                kode: "5320",
                nama: "Beban Operasional",
                jenis: "beban",
                unitUsaha: "BANK_SAMPAH"
            },

            {
                kode: "5330",
                nama: "Beban Peralatan",
                jenis: "beban",
                unitUsaha: "BANK_SAMPAH"
            },


            // =================================
            // BEBAN AFFILIATE
            // =================================

            {
                kode: "5400",
                nama: "Beban Affiliate",
                jenis: "beban",
                unitUsaha: "AFFILIATE"
            },

            {
                kode: "5410",
                nama: "Beban Operasional Affiliate",
                jenis: "beban",
                unitUsaha: "AFFILIATE"
            }

        ];


        // =====================================
        // AMBIL DATA MASTER AKUN
        // =====================================

        const snapshot =
            await getDocs(
                collection(
                    window.db,
                    "masterAkun"
                )
            );


        const kodeYangSudahAda =
            new Set();


        snapshot.forEach(function(docSnap) {

            const data =
                docSnap.data();

            if (data.kode) {

                kodeYangSudahAda.add(
                    String(data.kode)
                        .trim()
                        .toUpperCase()
                );

            }

        });


        // =====================================
        // TAMBAHKAN YANG BELUM ADA
        // =====================================

        let jumlahDitambahkan = 0;


        for (
            const akun
            of daftarAkun
        ) {

            if (
                kodeYangSudahAda.has(
                    akun.kode
                )
            ) {

                continue;

            }


            await addDoc(
                collection(
                    window.db,
                    "masterAkun"
                ),
                {

                    kode:
                        akun.kode,

                    nama:
                        akun.nama,

                    jenis:
                        akun.jenis,

                    unitUsaha:
                        akun.unitUsaha || "",

                    keterangan:
                        "Master Akun Resmi",

                    status:
                        "aktif",

                    dibuatPada:
                        serverTimestamp()

                }
            );


            jumlahDitambahkan++;

        }


        console.log(
            "Inisialisasi Master Akun selesai.",
            jumlahDitambahkan,
            "akun ditambahkan."
        );


        return {

            berhasil: true,

            jumlah:
                jumlahDitambahkan

        };


    } catch (error) {

        console.error(
            "Inisialisasi Master Akun gagal:",
            error
        );


        return {

            berhasil: false,

            jumlah: 0

        };

    }

}


// =========================================
// LENGKAPI UNIT USAHA AKUN PENDAPATAN
// =========================================

async function lengkapiUnitUsahaAkunPendapatan() {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            collection,
            getDocs,
            doc,
            updateDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // HUBUNGAN KODE AKUN → UNIT USAHA
        // =====================================

        const hubunganAkun = {

            "4100":
                "PENGELOLAAN_SAMPAH",

            "4200":
                "AYAM_PETELUR",

            "4210":
                "AYAM_PETELUR",

            "4220":
                "AYAM_PETELUR",

            "4230":
                "AYAM_PETELUR",

            "4300":
                "BANK_SAMPAH",

            "4310":
                "BANK_SAMPAH",

            "4400":
                "AFFILIATE",

            "4410":
                "AFFILIATE"

        };


        // =====================================
        // AMBIL MASTER AKUN
        // =====================================

        const snapshot =
            await getDocs(
                collection(
                    window.db,
                    "masterAkun"
                )
            );


        let jumlahDiubah = 0;


        // =====================================
        // PROSES SATU PER SATU
        // =====================================

        for (
            const docSnap
            of snapshot.docs
        ) {

            const data =
                docSnap.data();


            const kode =
                String(
                    data.kode || ""
                )
                .trim()
                .toUpperCase();


            const unitUsaha =
                hubunganAkun[kode];


            // Bukan akun pendapatan
            if (!unitUsaha) {
                continue;
            }


            // Jika sudah benar, tidak perlu update
            if (
                data.unitUsaha ===
                unitUsaha
            ) {

                continue;

            }


            await updateDoc(
                doc(
                    window.db,
                    "masterAkun",
                    docSnap.id
                ),
                {
                    unitUsaha:
                        unitUsaha
                }
            );


            jumlahDiubah++;

        }


        console.log(
            "Unit usaha akun pendapatan berhasil dilengkapi:",
            jumlahDiubah
        );


        return {

            berhasil: true,

            jumlah:
                jumlahDiubah

        };


    } catch (error) {

        console.error(
            "Melengkapi unit usaha akun pendapatan gagal:",
            error
        );


        return {

            berhasil: false,

            jumlah: 0

        };

    }

}


// =========================================
// LENGKAPI UNIT USAHA AKUN BEBAN
// =========================================

async function lengkapiUnitUsahaAkunBeban() {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        const {
            collection,
            getDocs,
            doc,
            updateDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        // =====================================
        // HUBUNGAN KODE AKUN → UNIT USAHA
        // =====================================

        const hubunganAkun = {

            // PENGELOLAAN SAMPAH
            "5100":
                "PENGELOLAAN_SAMPAH",

            "5110":
                "PENGELOLAAN_SAMPAH",

            "5120":
                "PENGELOLAAN_SAMPAH",

            "5130":
                "PENGELOLAAN_SAMPAH",


            // AYAM PETELUR
            "5200":
                "AYAM_PETELUR",

            "5210":
                "AYAM_PETELUR",

            "5220":
                "AYAM_PETELUR",

            "5230":
                "AYAM_PETELUR",

            "5240":
                "AYAM_PETELUR",

            "5250":
                "AYAM_PETELUR",

            "5260":
                "AYAM_PETELUR",

            "5270":
                "AYAM_PETELUR",


            // BANK SAMPAH
            "5300":
                "BANK_SAMPAH",

            "5310":
                "BANK_SAMPAH",

            "5320":
                "BANK_SAMPAH",

            "5330":
                "BANK_SAMPAH",


            // AFFILIATE
            "5400":
                "AFFILIATE",

            "5410":
                "AFFILIATE"

        };


        // =====================================
        // AMBIL MASTER AKUN
        // =====================================

        const snapshot =
            await getDocs(
                collection(
                    window.db,
                    "masterAkun"
                )
            );


        let jumlahDiubah = 0;


        // =====================================
        // PROSES SATU PER SATU
        // =====================================

        for (
            const docSnap
            of snapshot.docs
        ) {

            const data =
                docSnap.data();


            const kode =
                String(
                    data.kode || ""
                )
                .trim()
                .toUpperCase();


            const unitUsaha =
                hubunganAkun[kode];


            // Bukan akun beban resmi
            if (!unitUsaha) {

                continue;

            }


            // Pastikan hanya akun beban
            if (
                data.jenis !==
                "beban"
            ) {

                continue;

            }


            // Jika sudah benar
            if (
                data.unitUsaha ===
                unitUsaha
            ) {

                continue;

            }


            // =================================
            // UPDATE UNIT USAHA
            // =================================

            await updateDoc(

                doc(
                    window.db,
                    "masterAkun",
                    docSnap.id
                ),

                {

                    unitUsaha:
                        unitUsaha

                }

            );


            jumlahDiubah++;

        }


        console.log(
            "Unit usaha akun beban berhasil dilengkapi:",
            jumlahDiubah
        );


        return {

            berhasil:
                true,

            jumlah:
                jumlahDiubah

        };


    } catch (error) {

        console.error(
            "Melengkapi unit usaha akun beban gagal:",
            error
        );


        return {

            berhasil:
                false,

            jumlah:
                0

        };

    }

}

// =========================================
// AMBIL PELANGGAN
// =========================================

async function ambilPelangganFirebase() {

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


        const q =
            query(
                collection(
                    window.db,
                    "masterPelanggan"
                ),
                orderBy(
                    "nama",
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
            "Data pelanggan:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Ambil pelanggan gagal:",
            error
        );

        return [];

    }

}


// =========================================
// SIMPAN PELANGGAN
// =========================================

async function simpanPelangganFirebase(data) {

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

            kode: data.kode,

            nama: data.nama,

            noHp: data.noHp || "",

            alamat: data.alamat || "",

            jenis: data.jenis || "perorangan",

            // cakupan pelanggan
            // wilayah = terikat RT/RW
            // khusus = tidak terikat RT/RW
            cakupan: data.cakupan || "wilayah",

            unitUsaha: data.unitUsaha || "",

            keterangan: data.keterangan || "",

            status: data.status || "aktif",

            dibuatPada: serverTimestamp()

        };

        const docRef = await addDoc(
            collection(window.db, "masterPelanggan"),
            dataSimpan
        );

        console.log(
            "Pelanggan berhasil disimpan:",
            docRef.id
        );

        return {
            sukses: true,
            id: docRef.id
        };

    } catch (error) {

        console.error(
            "Gagal menyimpan pelanggan:",
            error
        );

        return {
            sukses: false,
            error: error.message
        };

    }

}


// =========================================
// UPDATE PELANGGAN
// =========================================

async function updatePelangganFirebase(id, data) {

    try {

        const dataUpdate = {

            kode: data.kode,

            nama: data.nama,

            noHp: data.noHp || "",

            alamat: data.alamat || "",

            jenis: data.jenis || "perorangan",

            // cakupan pelanggan
            // wilayah = terikat RT/RW
            // khusus = tidak terikat RT/RW
            cakupan: data.cakupan || "wilayah",

            unitUsaha: data.unitUsaha || "",

            keterangan: data.keterangan || "",

            status: data.status || "aktif",

            diubahPada: new Date()

        };

        await updateDoc(
            doc(window.db, "masterPelanggan", id),
            dataUpdate
        );

        console.log(
            "Pelanggan berhasil diperbarui:",
            id
        );

        return {
            sukses: true
        };

    } catch (error) {

        console.error(
            "Gagal memperbarui pelanggan:",
            error
        );

        return {
            sukses: false,
            error: error.message
        };

    }

}


// =========================================
// HAPUS PELANGGAN
// =========================================

async function hapusPelangganFirebase(id) {

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


        await deleteDoc(

            doc(
                window.db,
                "masterPelanggan",
                id
            )

        );


        console.log(
            "Pelanggan berhasil dihapus."
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus pelanggan gagal:",
            error
        );

        return false;

    }

}


// =========================================
// CEK KODE PELANGGAN
// =========================================

async function cekKodePelangganFirebase(
    kode,
    kecualiId = null
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
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const snapshot =
            await getDocs(

                collection(
                    window.db,
                    "masterPelanggan"
                )

            );


        let ditemukan =
            false;


        snapshot.forEach(function(doc) {

            if (
                kecualiId &&
                doc.id === kecualiId
            ) {

                return;

            }


            const data =
                doc.data();


            if (
                String(data.kode || "")
                    .toUpperCase() ===
                String(kode || "")
                    .toUpperCase()
            ) {

                ditemukan =
                    true;

            }

        });


        return ditemukan;


    } catch (error) {

        console.error(
            "Cek kode pelanggan gagal:",
            error
        );

        return true;

    }

}

// =========================================
// AMBIL SUPPLIER
// =========================================

async function ambilSupplierFirebase() {

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


        const q =
            query(
                collection(
                    window.db,
                    "masterSupplier"
                ),
                orderBy(
                    "nama",
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
            "Data supplier:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Ambil supplier gagal:",
            error
        );

        return [];

    }

}


// =========================================
// SIMPAN SUPPLIER
// =========================================

async function simpanSupplierFirebase(data) {

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

            kode:
                data.kode,

            nama:
                data.nama,

            noHp:
                data.noHp || "",

            alamat:
                data.alamat || "",

            jenis:
                data.jenis || "perorangan",

            unitUsaha:
                data.unitUsaha || "",

            keterangan:
                data.keterangan || "",

            status:
                data.status || "aktif",

            dibuatPada:
                serverTimestamp()

        };


        const docRef =
            await addDoc(

                collection(
                    window.db,
                    "masterSupplier"
                ),

                dataSimpan

            );


        console.log(
            "Supplier berhasil disimpan."
        );

        console.log(
            "ID supplier:",
            docRef.id
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan supplier gagal:",
            error
        );

        return false;

    }

}


// =========================================
// UPDATE SUPPLIER
// =========================================

async function updateSupplierFirebase(
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


        const dataUpdate = {

            kode:
                data.kode,

            nama:
                data.nama,

            noHp:
                data.noHp || "",

            alamat:
                data.alamat || "",

            jenis:
                data.jenis || "perorangan",

            unitUsaha:
                data.unitUsaha || "",

            keterangan:
                data.keterangan || "",

            status:
                data.status || "aktif",

            diubahPada:
                new Date()

        };


        await updateDoc(

            doc(
                window.db,
                "masterSupplier",
                id
            ),

            dataUpdate

        );


        console.log(
            "Supplier berhasil diperbarui."
        );


        return true;


    } catch (error) {

        console.error(
            "Update supplier gagal:",
            error
        );

        return false;

    }

}


// =========================================
// HAPUS SUPPLIER
// =========================================

async function hapusSupplierFirebase(id) {

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


        await deleteDoc(

            doc(
                window.db,
                "masterSupplier",
                id
            )

        );


        console.log(
            "Supplier berhasil dihapus."
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus supplier gagal:",
            error
        );

        return false;

    }

}


// =========================================
// CEK KODE SUPPLIER
// =========================================

async function cekKodeSupplierFirebase(
    kode,
    kecualiId = null
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
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const snapshot =
            await getDocs(

                collection(
                    window.db,
                    "masterSupplier"
                )

            );


        let ditemukan =
            false;


        snapshot.forEach(function(doc) {

            if (
                kecualiId &&
                doc.id === kecualiId
            ) {

                return;

            }


            const data =
                doc.data();


            if (
                String(data.kode || "")
                    .toUpperCase() ===
                String(kode || "")
                    .toUpperCase()
            ) {

                ditemukan =
                    true;

            }

        });


        return ditemukan;


    } catch (error) {

        console.error(
            "Cek kode supplier gagal:",
            error
        );

        return true;

    }

}

// =========================================
// ASET
// =========================================

// =========================================
// AMBIL ASET
// =========================================

async function ambilMasterAsetFirebase() {

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


        const q =
            query(
                collection(
                    window.db,
                    "masterAset"
                ),
                orderBy(
                    "nama",
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
            "Data aset:",
            data
        );


        return data;


    } catch (error) {

        console.error(
            "Ambil aset gagal:",
            error
        );

        return [];

    }

}


// =========================================
// SIMPAN MASTER ASET
// =========================================

async function simpanMasterAsetFirebase(data) {

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

            kode:
                data.kode || "",

            nama:
                data.nama || "",

            jenis:
                data.jenis || "tetap",

            unitUsaha:
                data.unitUsaha || "",

            tahunPerolehan:
                Number(
                    data.tahunPerolehan
                ) || 0,

            hargaPerolehan:
                Number(
                    data.hargaPerolehan
                ) || 0,

            umurManfaat:
                Number(
                    data.umurManfaat
                ) || 0,

            nilaiSisa:
                Number(
                    data.nilaiSisa
                ) || 0,

            keterangan:
                data.keterangan || "",

            status:
                data.status || "aktif",

            dibuatPada:
                serverTimestamp()

        };


        const docRef =
            await addDoc(

                collection(
                    window.db,
                    "masterAset"
                ),

                dataSimpan

            );


        console.log(
            "Aset berhasil disimpan."
        );

        console.log(
            "ID aset:",
            docRef.id
        );

        console.log(
            "Data master aset:",
            dataSimpan
        );


        return true;


    } catch (error) {

        console.error(
            "Simpan aset gagal:",
            error
        );

        return false;

    }

}


// =========================================
// UPDATE MASTER ASET
// =========================================

async function updateMasterAsetFirebase(
    id,
    data
) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }


        if (!id) {

            throw new Error(
                "ID aset tidak ditemukan."
            );

        }


        const {
            doc,
            updateDoc
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const dataUpdate = {

            kode:
                data.kode || "",

            nama:
                data.nama || "",

            jenis:
                data.jenis || "tetap",

            unitUsaha:
                data.unitUsaha || "",

            tahunPerolehan:
                Number(
                    data.tahunPerolehan
                ) || 0,

            hargaPerolehan:
                Number(
                    data.hargaPerolehan
                ) || 0,

            umurManfaat:
                Number(
                    data.umurManfaat
                ) || 0,

            nilaiSisa:
                Number(
                    data.nilaiSisa
                ) || 0,

            keterangan:
                data.keterangan || "",

            status:
                data.status || "aktif",

            diubahPada:
                new Date()

        };


        await updateDoc(

            doc(
                window.db,
                "masterAset",
                id
            ),

            dataUpdate

        );


        console.log(
            "Aset berhasil diperbarui."
        );

        console.log(
            "Data master aset:",
            dataUpdate
        );


        return true;


    } catch (error) {

        console.error(
            "Update aset gagal:",
            error
        );

        return false;

    }

}


// =========================================
// HAPUS ASET
// =========================================

async function hapusMasterAsetFirebase(id) {

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


        await deleteDoc(

            doc(
                window.db,
                "masterAset",
                id
            )

        );


        console.log(
            "Aset berhasil dihapus."
        );


        return true;


    } catch (error) {

        console.error(
            "Hapus aset gagal:",
            error
        );

        return false;

    }

}


// =========================================
// CEK KODE ASET
// =========================================

async function cekKodeMasterAsetFirebase(kode, kecualiId) {

    try {

        if (!window.db) {

            throw new Error(
                "Firebase Firestore belum tersedia."
            );

        }

        const {
            collection,
            getDocs
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );


        const snapshot =
            await getDocs(

                collection(
                    window.db,
                    "masterAset"
                )

            );


        let ditemukan =
            false;


        snapshot.forEach(function(doc) {

            if (
                kecualiId &&
                doc.id === kecualiId
            ) {

                return;

            }


            const data =
                doc.data();


            if (
                String(data.kode || "")
                    .toUpperCase() ===
                String(kode || "")
                    .toUpperCase()
            ) {

                ditemukan =
                    true;

            }

        });


        return ditemukan;


    } catch (error) {

        console.error(
            "Cek kode aset gagal:",
            error
        );

        return true;

    }

}

 // =========================================
// LAPORAN ASET
// SUMBER DATA: masterAset
// =========================================

async function ambilLaporanAsetFirebase(sampai) {

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
        // SUMBER DATA MASTER ASET
        // =====================================

        const ref =
            collection(
                window.db,
                "masterAset"
            );


        // =====================================
        // URUTKAN BERDASARKAN NAMA
        // =====================================

        const q =
            query(
                ref,
                orderBy(
                    "nama",
                    "asc"
                )
            );


        const snapshot =
            await getDocs(q);


        const data = [];


        let totalNilaiPerolehan = 0;

        let totalNilaiBuku = 0;


        // =====================================
        // PROSES DATA
        // =====================================

        snapshot.forEach(function(doc) {

            const item =
                doc.data();


            const tanggal =
                String(
                    item.tanggalPerolehan || ""
                ).substring(0, 10);


            // =================================
            // BATAS TANGGAL LAPORAN
            // =================================

            if (
                sampai &&
                tanggal &&
                tanggal > sampai
            ) {

                return;

            }


            // =================================
            // HARGA PEROLEHAN
            // =================================

            const hargaPerolehan =
                Number(
                    item.hargaPerolehan
                ) || 0;


            // =================================
            // NILAI BUKU
            // =================================
            //
            // Untuk saat ini belum menghitung
            // penyusutan.
            //
            // Jadi nilai buku = harga perolehan.
            //
            // =================================

            const nilaiBuku =
                hargaPerolehan;


            // =================================
            // NILAI SISA
            // =================================

            const nilaiSisa =
                Number(
                    item.nilaiSisa
                ) || 0;


            // =================================
            // TOTAL
            // =================================

            totalNilaiPerolehan +=
                hargaPerolehan;


            totalNilaiBuku +=
                nilaiBuku;


            // =================================
            // DATA LAPORAN
            // =================================

            data.push({

                id:
                    doc.id,

                kode:
                    item.kode ||
                    "-",

                tanggal:
                    tanggal,

                nama:
                    item.nama ||
                    "-",

                jenis:
                    item.jenis ||
                    "-",

                unitUsaha:
                    item.unitUsaha ||
                    "-",

                hargaPerolehan:
                    hargaPerolehan,

                umurManfaat:
                    Number(
                        item.umurManfaat
                    ) || 0,

                nilaiSisa:
                    nilaiSisa,

                kondisi:
                    item.kondisi ||
                    "BAIK",

                status:
                    item.status ||
                    "aktif",

                keterangan:
                    item.keterangan ||
                    "",

                nilaiBuku:
                    nilaiBuku

            });

        });


        // =====================================
        // URUTKAN TANGGAL
        // =====================================

        data.sort(function(a, b) {

            return String(
                a.tanggal
            ).localeCompare(
                String(b.tanggal)
            );

        });


        // =====================================
        // HASIL
        // =====================================

        const hasil = {

            sampai:
                sampai || null,

            data:
                data,

            jumlahAset:
                data.length,

            totalNilaiPerolehan:
                totalNilaiPerolehan,

            totalNilaiBuku:
                totalNilaiBuku,

            total:
                totalNilaiBuku

        };


        console.log(
            "Laporan Aset berhasil:",
            hasil
        );


        return hasil;


    } catch (error) {

        console.error(
            "Ambil Laporan Aset gagal:",
            error
        );


        throw error;

    }

}


// =========================================
// EXPORT LAPORAN ASET
// =========================================

window.ambilLaporanAsetFirebase =
    ambilLaporanAsetFirebase;


// =========================================
// GLOBAL
// =========================================

window.ambilUnitUsahaFirebase =
    ambilUnitUsahaFirebase;

window.simpanUnitUsahaFirebase =
    simpanUnitUsahaFirebase;

window.updateUnitUsahaFirebase =
    updateUnitUsahaFirebase;

window.hapusUnitUsahaFirebase =
    hapusUnitUsahaFirebase;

window.cekKodeUnitUsahaFirebase =
    cekKodeUnitUsahaFirebase;


window.ambilAkunFirebase =
    ambilAkunFirebase;

window.simpanAkunFirebase =
    simpanAkunFirebase;

window.cekKodeAkunFirebase =
    cekKodeAkunFirebase;

window.updateAkunFirebase =
    updateAkunFirebase;

window.hapusAkunFirebase =
    hapusAkunFirebase;


window.inisialisasiMasterAkunResmi =
    inisialisasiMasterAkunResmi;


window.lengkapiUnitUsahaAkunPendapatan =
    lengkapiUnitUsahaAkunPendapatan;


window.lengkapiUnitUsahaAkunBeban =
    lengkapiUnitUsahaAkunBeban;
	
window.ambilPelangganFirebase =
    ambilPelangganFirebase;

window.simpanPelangganFirebase =
    simpanPelangganFirebase;

window.updatePelangganFirebase =
    updatePelangganFirebase;

window.hapusPelangganFirebase =
    hapusPelangganFirebase;

window.cekKodePelangganFirebase =
    cekKodePelangganFirebase;
	
window.ambilSupplierFirebase =
    ambilSupplierFirebase;

window.simpanSupplierFirebase =
    simpanSupplierFirebase;

window.updateSupplierFirebase =
    updateSupplierFirebase;

window.hapusSupplierFirebase =
    hapusSupplierFirebase;

window.cekKodeSupplierFirebase =
    cekKodeSupplierFirebase;
	
window.ambilMasterAsetFirebase =
    ambilMasterAsetFirebase;

window.simpanMasterAsetFirebase =
    simpanMasterAsetFirebase;

window.updateMasterAsetFirebase =
    updateMasterAsetFirebase;

window.hapusMasterAsetFirebase =
    hapusMasterAsetFirebase;

window.cekKodeMasterAsetFirebase =
    cekKodeMasterAsetFirebase;
	



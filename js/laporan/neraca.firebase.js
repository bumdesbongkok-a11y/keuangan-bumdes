// =========================================================
// NERACA FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================================
//
// ATURAN AKUNTANSI FINAL
//
// 1. TAHUN AWAL PEMBUKUAN
//    - Pembukuan dimulai tahun 2020
//
// 2. MASTER ASET
//    - Hanya sebagai master/reference
//    - Menyediakan umur manfaat dan nilai sisa
//    - BUKAN sumber saldo Neraca
//
// 3. ASET TETAP
//    - Berasal dari transaksi PENGELUARAN
//    - jenisPengeluaran = ASET
//      atau akunKode = 1400
//
// 4. PEMBELIAN ASET
//    Debit  Aset Tetap
//    Kredit Kas/Bank/Dana
//
// 5. PENYUSUTAN
//    - Metode garis lurus
//    - Penyusutan dihitung PER BULAN
//    - Bulan perolehan TIDAK disusutkan
//    - Penyusutan dimulai bulan berikutnya
//    - Penyusutan historis dihitung otomatis
//    - Akumulasi penyusutan masuk ke nilai buku aset
//    - Beban penyusutan masuk ke Laba/Rugi
//    - Penyusutan historis masuk ke Saldo Laba sebelumnya
//
// 6. AFFILIATE
//    - Saldo Affiliate BUKAN media uang Neraca
//    - Saldo Affiliate tidak menambah Kas
//    - Saldo Affiliate tidak menambah Bank
//    - Saldo Affiliate tidak menambah Dana
//    - Saldo Affiliate hanya berubah pada transaksi Affiliate
//    - Affiliate -> Kas hanya melalui TRANSFER
//    - Saat Affiliate ditarik ke Kas:
//        Affiliate berkurang
//        Kas bertambah
//
// 7. SALDO LABA SEBELUMNYA
//    - Dimulai dari tahun 2020
//    - Mengakumulasi laba/rugi setiap tahun sebelum tahun laporan
//    - Termasuk penyusutan historis
//
// 8. EKUITAS
//
//    Modal Disetor
//    + Saldo Laba Tahun Sebelumnya
//    + Laba/Rugi Tahun Berjalan
//    = Total Ekuitas
//
// 9. NERACA TIDAK DIPAKSA BALANCE
//
// =========================================================


// =========================================================
// KONFIGURASI PEMBUKUAN
// =========================================================

const TAHUN_AWAL_PEMBUKUAN_NERACA = 2020;


// =========================================================
// FIRESTORE
// =========================================================

async function getFirestoreNeraca() {

    return await import(
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
    );

}


// =========================================================
// LOAD COLLECTION
// =========================================================

async function loadCollectionNeraca(
    namaCollection
) {

    const {
        getFirestore,
        collection,
        getDocs
    } = await getFirestoreNeraca();


    const db =
        getFirestore();


    const snapshot =
        await getDocs(
            collection(
                db,
                namaCollection
            )
        );


    return snapshot.docs.map(
        function(doc) {

            return {
                id: doc.id,
                ...doc.data()
            };

        }
    );

}


// =========================================================
// LOAD TRANSAKSI
// =========================================================

async function loadTransaksiNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.TRANSAKSI
    );

}


// =========================================================
// LOAD PIUTANG
// =========================================================

async function loadPiutangNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.PIUTANG
    );

}


// =========================================================
// LOAD UTANG
// =========================================================

async function loadUtangNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.UTANG
    );

}


// =========================================================
// LOAD MODAL
// =========================================================

async function loadModalNeracaFirebase() {

    return await loadCollectionNeraca(
        COLLECTION.MODAL
    );

}


// =========================================================
// LOAD MASTER ASET
// =========================================================

async function loadMasterAsetParameterNeracaFirebase() {

    return await loadCollectionNeraca(
        "masterAset"
    );

}


// =========================================================
// NOMINAL
// =========================================================

function nominalNeraca(item) {

    return Number(
        item?.nominal ??
        item?.jumlah ??
        item?.nilai ??
        item?.nilaiPerolehan ??
        item?.harga ??
        item?.total ??
        0
    ) || 0;

}


// =========================================================
// TANGGAL
// =========================================================

function tanggalNeraca(item) {

    if (!item) {
        return null;
    }


    const nilai =
        item.tanggal;


    if (!nilai) {
        return null;
    }


    if (
        typeof nilai.toDate === "function"
    ) {

        return nilai.toDate();

    }


    if (
        nilai instanceof Date
    ) {

        return nilai;

    }


    if (
        typeof nilai === "string"
    ) {

        const tanggal =
            new Date(
                nilai.length <= 10
                    ? nilai + "T00:00:00"
                    : nilai
            );


        if (
            !isNaN(
                tanggal.getTime()
            )
        ) {

            return tanggal;

        }

    }


    return null;

}


// =========================================================
// TRANSAKSI SAMPAI TANGGAL
// =========================================================

function transaksiSampaiTanggalNeraca(
    tanggal,
    sampai
) {

    const item =
        tanggalNeraca({
            tanggal: tanggal
        });


    if (!item) {
        return false;
    }


    const batas =
        new Date(
            sampai + "T23:59:59"
        );


    return item <= batas;

}


// =========================================================
// TRANSAKSI DALAM PERIODE
// =========================================================

function transaksiDalamPeriodeNeraca(
    tanggal,
    dari,
    sampai
) {

    const item =
        tanggalNeraca({
            tanggal: tanggal
        });


    if (!item) {
        return false;
    }


    const awal =
        new Date(
            dari + "T00:00:00"
        );


    const akhir =
        new Date(
            sampai + "T23:59:59"
        );


    return (
        item >= awal &&
        item <= akhir
    );

}


// =========================================================
// CEK TRANSAKSI ASET
// =========================================================

function transaksiAdalahAsetNeraca(
    item
) {

    const jenis =
        String(
            item?.jenisTransaksi || ""
        ).toUpperCase();


    if (
        jenis !== "PENGELUARAN"
    ) {

        return false;

    }


    const jenisPengeluaran =
        String(
            item?.jenisPengeluaran || ""
        ).toUpperCase();


    const akunKode =
        String(
            item?.akunKode || ""
        ).toUpperCase();


    return (
        jenisPengeluaran === "ASET" ||
        akunKode === "1400"
    );

}


// =========================================================
// AMBIL TAHUN PEROLEHAN ASET
// =========================================================

function tahunPerolehanAsetNeraca(
    transaksi,
    master
) {

    let tahun =
        Number(
            master?.tahunPerolehan
        ) || 0;


    if (
        tahun <= 0 &&
        master?.tanggalPerolehan
    ) {

        tahun =
            Number(
                String(
                    master.tanggalPerolehan
                ).substring(0, 4)
            ) || 0;

    }


    if (
        tahun <= 0
    ) {

        const tanggal =
            tanggalNeraca(
                transaksi
            );


        if (tanggal) {

            tahun =
                tanggal.getFullYear();

        }

    }


    return tahun;

}


// =========================================================
// AMBIL TANGGAL PEROLEHAN ASET
// =========================================================
//
// PRIORITAS:
//
// 1. tanggal transaksi aset
// 2. tanggalPerolehan master aset
// 3. tahunPerolehan master aset
//
// Bulan perolehan TIDAK disusutkan.
// Penyusutan dimulai bulan berikutnya.
//
// =========================================================

function tanggalPerolehanAsetNeraca(
    transaksi,
    master
) {

    const tanggalTransaksi =
        tanggalNeraca(
            transaksi
        );


    if (tanggalTransaksi) {

        return new Date(
            tanggalTransaksi.getFullYear(),
            tanggalTransaksi.getMonth(),
            tanggalTransaksi.getDate()
        );

    }


    if (
        master?.tanggalPerolehan
    ) {

        const tanggalMaster =
            tanggalNeraca({
                tanggal:
                    master.tanggalPerolehan
            });


        if (tanggalMaster) {

            return new Date(
                tanggalMaster.getFullYear(),
                tanggalMaster.getMonth(),
                tanggalMaster.getDate()
            );

        }

    }


    const tahun =
        Number(
            master?.tahunPerolehan
        ) || 0;


    if (
        tahun > 0
    ) {

        return new Date(
            tahun,
            0,
            1
        );

    }


    return null;

}



// =========================================================
// HITUNG PARAMETER ASET
// =========================================================

function parameterAsetNeraca(
    transaksi,
    master
) {

    const harga =
        nominalNeraca(
            transaksi
        );


    let nilaiSisa =
        Number(
            master?.nilaiSisa
        ) || 0;


    // =========================================
    // NILAI SISA MINIMUM Rp1
    // =========================================
    //
    // Jika nilai sisa di master:
    // - kosong
    // - 0
    //
    // maka sistem menggunakan Rp1.
    //
    // Aset yang sudah habis disusutkan
    // akan berhenti pada nilai buku Rp1.
    //
    // =========================================

    if (
        nilaiSisa <= 0
    ) {

        nilaiSisa = 1;

    }


    // =========================================
    // NILAI SISA TIDAK BOLEH
    // LEBIH BESAR DARI HARGA ASET
    // =========================================

    if (
        nilaiSisa > harga
    ) {

        nilaiSisa = harga;

    }


    const umurManfaat =
        Number(
            master?.umurManfaat
        ) || 0;


    const tahunPerolehan =
        tahunPerolehanAsetNeraca(
            transaksi,
            master
        );


    return {

        harga,

        nilaiSisa,

        umurManfaat,

        tahunPerolehan

    };

}


// =========================================================
// HITUNG KAS / BANK / DANA / AFFILIATE
// =========================================================
//
// CATATAN PENTING:
//
// Affiliate TIDAK dianggap sebagai Kas.
//
// Contoh:
//
// PEMASUKAN
// mediaTujuan = AFFILIATE
//
// hasil:
// saldoAffiliate bertambah
// Kas TIDAK bertambah
//
// TRANSFER
// mediaAsal = AFFILIATE
// mediaTujuan = KAS
//
// hasil:
// saldoAffiliate berkurang
// Kas bertambah
//
// =========================================================

async function hitungSaldoMediaNeracaFirebase(
    sampai
) {

 
    const transaksi =
        await loadTransaksiNeracaFirebase();


    let kas = 0;

    let bank = 0;

    let dana = 0;

    let saldoAffiliate = 0;


    transaksi
        .filter(
    function(item) {

        const tanggal =
            tanggalNeraca(item);

        const tanggalAwal =
            new Date(
                TAHUN_AWAL_PEMBUKUAN_NERACA,
                0,
                1
            );

        const tanggalAkhir =
            new Date(
                sampai + "T23:59:59"
            );

        return (
            tanggal &&
            tanggal >= tanggalAwal &&
            tanggal <= tanggalAkhir
        );

    }
)
        .sort(
            function(a, b) {

                const tanggalA =
                    tanggalNeraca(a);


                const tanggalB =
                    tanggalNeraca(b);


                return (
                    (tanggalA?.getTime() || 0) -
                    (tanggalB?.getTime() || 0)
                );

            }
        )
        .forEach(
            function(item) {
				
				

                const jenis =
                    String(
                        item.jenisTransaksi || ""
                    ).toUpperCase();


                const nominal =
                    nominalNeraca(item);


                if (
                    nominal <= 0
                ) {

                    return;

                }


                // =====================================
                // PEMASUKAN
                // =====================================

                if (
                    jenis === "PEMASUKAN"
                ) {

                    const media =
                        String(
                            item.mediaTujuan || "KAS"
                        ).toUpperCase();


                    if (
                        media === "KAS"
                    ) {

                        kas += nominal;

                    }
                    else if (
                        media === "BANK"
                    ) {

                        bank += nominal;

                    }
                    else if (
                        media === "DANA"
                    ) {

                        dana += nominal;

                    }
                    else if (
                        media === "AFFILIATE"
                    ) {

                        // =================================
                        // AFFILIATE BUKAN KAS
                        // =================================

                        saldoAffiliate +=
                            nominal;

                    }

                }


                // =====================================
                // PENGELUARAN
                // =====================================

                else if (
                    jenis === "PENGELUARAN"
                ) {

                    const media =
                        String(
                            item.mediaAsal || "KAS"
                        ).toUpperCase();


                    if (
                        media === "KAS"
                    ) {

                        kas -= nominal;

                    }
                    else if (
                        media === "BANK"
                    ) {

                        bank -= nominal;

                    }
                    else if (
                        media === "DANA"
                    ) {

                        dana -= nominal;

                    }
                    else if (
                        media === "AFFILIATE"
                    ) {

                        // =================================
                        // PENGELUARAN DARI SALDO AFFILIATE
                        // TIDAK MENGURANGI KAS
                        // =================================

                        saldoAffiliate -=
                            nominal;

                    }

                }


                // =====================================
                // TRANSFER
                // =====================================

                else if (
                    jenis === "TRANSFER"
                ) {

                    const asal =
                        String(
                            item.mediaAsal || ""
                        ).toUpperCase();


                    const tujuan =
                        String(
                            item.mediaTujuan || ""
                        ).toUpperCase();


                    // =================================
                    // MEDIA ASAL
                    // =================================

                    if (
                        asal === "KAS"
                    ) {

                        kas -= nominal;

                    }
                    else if (
                        asal === "BANK"
                    ) {

                        bank -= nominal;

                    }
                    else if (
                        asal === "DANA"
                    ) {

                        dana -= nominal;

                    }
                    else if (
                        asal === "AFFILIATE"
                    ) {

                        saldoAffiliate -=
                            nominal;

                    }


                    // =================================
                    // MEDIA TUJUAN
                    // =================================

                    if (
                        tujuan === "KAS"
                    ) {

                        kas += nominal;

                    }
                    else if (
                        tujuan === "BANK"
                    ) {

                        bank += nominal;

                    }
                    else if (
                        tujuan === "DANA"
                    ) {

                        dana += nominal;

                    }
                    else if (
                        tujuan === "AFFILIATE"
                    ) {

                        saldoAffiliate +=
                            nominal;

                    }

                }

            }
        );


    // =============================================
    // MEDIA UANG NERACA
    // =============================================
    //
    // Affiliate SENGAJA tidak dimasukkan.
    //
    // =============================================

    const totalKasBankDana =
        kas +
        bank +
        dana;


    return {

        kas,

        bank,

        dana,

        // Informasi saldo affiliate tetap tersedia,
        // tetapi bukan bagian dari media uang Neraca.
        saldoAffiliate,

        totalKasBankDana,

        totalMediaUang:
            totalKasBankDana

    };

}


// =========================================================
// HITUNG PIUTANG
// =========================================================

async function hitungPiutangNeracaFirebase(
    sampai
) {

    const data =
        await loadPiutangNeracaFirebase();


    let total = 0;


    const batas =
        new Date(
            sampai + "T23:59:59"
        );


    data.forEach(
        function(item) {

            const tanggal =
                tanggalNeraca(item);


            if (!tanggal) {
                return;
            }


            if (
                tanggal > batas
            ) {

                return;

            }


            total +=
                Number(
                    item.sisa ??
                    item.saldo ??
                    item.nominalSisa ??
                    0
                ) || 0;

        }
    );


    return total;

}


// =========================================================
// HITUNG UTANG
// =========================================================

async function hitungUtangNeracaFirebase(
    sampai
) {

    const data =
        await loadUtangNeracaFirebase();


    let total = 0;


    const batas =
        new Date(
            sampai + "T23:59:59"
        );


    data.forEach(
        function(item) {

            const tanggal =
                tanggalNeraca(item);


            if (!tanggal) {
                return;
            }


            if (
                tanggal > batas
            ) {

                return;

            }


            total +=
                Number(
                    item.sisa ??
                    item.saldo ??
                    item.nominalSisa ??
                    0
                ) || 0;

        }
    );


    return total;

}


// =========================================================
// HITUNG PENYUSUTAN PERIODE — BULANAN
// =========================================================
//
// RUMUS:
//
// Penyusutan Bulanan =
// (Harga Perolehan - Nilai Sisa)
// / (Umur Manfaat x 12)
//
// ATURAN:
//
// - Bulan perolehan = Rp0
// - Mulai bulan berikutnya
// - Garis lurus
// - Maksimal umur manfaat
// - Penyusutan historis tetap dihitung
//
// =========================================================

async function hitungDepresiasiPeriodeNeracaFirebase(
    dari,
    sampai
) {

    const transaksi =
        await loadTransaksiNeracaFirebase();


    const masterAset =
        await loadMasterAsetParameterNeracaFirebase();


    const masterById = {};


    masterAset.forEach(
        function(item) {

            if (
                item.id
            ) {

                masterById[item.id] =
                    item;

            }

        }
    );


    const tanggalDari =
        new Date(
            dari + "T00:00:00"
        );


    const tanggalSampai =
        new Date(
            sampai + "T23:59:59"
        );


    const bulanDari =
        new Date(
            tanggalDari.getFullYear(),
            tanggalDari.getMonth(),
            1
        );


    const bulanSampai =
        new Date(
            tanggalSampai.getFullYear(),
            tanggalSampai.getMonth(),
            1
        );


    let total = 0;


    transaksi.forEach(
        function(item) {

            if (
                !transaksiAdalahAsetNeraca(item)
            ) {

                return;

            }


            if (
                !transaksiSampaiTanggalNeraca(
                    item.tanggal,
                    sampai
                )
            ) {

                return;

            }


            const master =
                masterById[
                    item.asetId || ""
                ] || null;


            const parameter =
                parameterAsetNeraca(
                    item,
                    master
                );


            const harga =
                parameter.harga;


            const nilaiSisa =
                parameter.nilaiSisa;


            const umurManfaat =
                parameter.umurManfaat;


            if (
                harga <= 0 ||
                umurManfaat <= 0 ||
                harga <= nilaiSisa
            ) {

                return;

            }


            const tanggalPerolehan =
                tanggalPerolehanAsetNeraca(
                    item,
                    master
                );


            if (
                !tanggalPerolehan
            ) {

                return;

            }


            // =====================================
            // UMUR MANFAAT DALAM BULAN
            // =====================================

            const umurManfaatBulan =
                umurManfaat * 12;


            // =====================================
            // PENYUSUTAN PER BULAN
            // =====================================

            const depresiasiBulanan =
                (
                    harga -
                    nilaiSisa
                ) /
                umurManfaatBulan;


            // =====================================
            // MULAI BULAN BERIKUTNYA
            // =====================================

            const bulanMulaiDepresiasi =
                new Date(
                    tanggalPerolehan.getFullYear(),
                    tanggalPerolehan.getMonth() + 1,
                    1
                );


            // =====================================
            // JIKA BELUM MULAI
            // =====================================

            if (
                bulanSampai <
                bulanMulaiDepresiasi
            ) {

                return;

            }


            // =====================================
            // AWAL BULAN YANG DIHITUNG
            // =====================================

            const bulanAwalPeriode =
                bulanDari >
                bulanMulaiDepresiasi
                    ? bulanDari
                    : bulanMulaiDepresiasi;


            if (
                bulanAwalPeriode >
                bulanSampai
            ) {

                return;

            }


            // =====================================
            // JUMLAH BULAN DALAM PERIODE
            // =====================================

            let bulanBerjalanPeriode =
                (
                    (
                        bulanSampai.getFullYear() -
                        bulanAwalPeriode.getFullYear()
                    ) * 12
                ) +
                (
                    bulanSampai.getMonth() -
                    bulanAwalPeriode.getMonth()
                ) +
                1;


            // =====================================
            // BULAN YANG SUDAH DISUSUTKAN
            // SEBELUM PERIODE
            // =====================================

            let bulanSebelumPeriode = 0;


            if (
                bulanDari >
                bulanMulaiDepresiasi
            ) {

                bulanSebelumPeriode =
                    (
                        (
                            bulanDari.getFullYear() -
                            bulanMulaiDepresiasi.getFullYear()
                        ) * 12
                    ) +
                    (
                        bulanDari.getMonth() -
                        bulanMulaiDepresiasi.getMonth()
                    );

            }


            // =====================================
            // BATAS UMUR MANFAAT
            // =====================================

            const sisaBulan =
                Math.max(
                    0,
                    umurManfaatBulan -
                    bulanSebelumPeriode
                );


            bulanBerjalanPeriode =
                Math.min(
                    bulanBerjalanPeriode,
                    sisaBulan
                );


            if (
                bulanBerjalanPeriode <= 0
            ) {

                return;

            }


            // =====================================
            // TOTAL PENYUSUTAN PERIODE
            // =====================================

            let depresiasiPeriode =
                depresiasiBulanan *
                bulanBerjalanPeriode;


            // =====================================
            // BATAS MAKSIMAL
            // =====================================

            const maksimumDepresiasi =
                harga -
                nilaiSisa;


            depresiasiPeriode =
                Math.min(
                    depresiasiPeriode,
                    maksimumDepresiasi
                );


            total +=
                depresiasiPeriode;


            // =====================================
            // DEBUG
            // =====================================

            console.log(
                "📉 Penyusutan Periode",
                {
                    transaksiId:
                        item.id,

                    tanggalPerolehan,

                    bulanMulai:
                        bulanMulaiDepresiasi,

                    bulanDari:
                        bulanDari,

                    bulanSampai:
                        bulanSampai,

                    harga,

                    nilaiSisa,

                    umurManfaat,

                    umurManfaatBulan,

                    depresiasiBulanan,

                    bulanSebelumPeriode,

                    bulanBerjalanPeriode,

                    depresiasiPeriode
                }
            );

        }
    );


    console.log(
        "📉 TOTAL PENYUSUTAN PERIODE:",
        total
    );


    return total;

}


// =========================================================
// HITUNG ASET TETAP
// =========================================================
//
// Harga perolehan berasal dari transaksi.
//
// Master Aset hanya menyediakan:
// - umur manfaat
// - nilai sisa
// - identitas aset
//
// Penyusutan dihitung per bulan.
//
// =========================================================

async function hitungAsetNeracaFirebase(
    sampai
) {

    const semuaTransaksi =
        await loadTransaksiNeracaFirebase();


    const semuaMasterAset =
        await loadMasterAsetParameterNeracaFirebase();


    const tanggalLaporan =
        new Date(
            sampai + "T23:59:59"
        );


    const masterById = {};


    semuaMasterAset.forEach(
        function(item) {

            if (
                item.id
            ) {

                masterById[item.id] =
                    item;

            }

        }
    );


    const transaksiAset =
        semuaTransaksi.filter(
            function(item) {

                return (
                    transaksiAdalahAsetNeraca(
                        item
                    ) &&
                    transaksiSampaiTanggalNeraca(
                        item.tanggal,
                        sampai
                    )
                );

            }
        );


    let totalHargaPerolehan = 0;

    let totalAkumulasiDepresiasi = 0;

    let totalNilaiBuku = 0;


    const daftarAset = [];


    console.group(
        "🔎 RINCIAN ASET NERACA s/d " +
        sampai
    );


    console.log(
        "Jumlah transaksi aset:",
        transaksiAset.length
    );


    transaksiAset.forEach(
        function(transaksi, index) {

            const asetId =
                transaksi.asetId ||
                null;


            const master =
                masterById[
                    asetId
                ] || null;


            const parameter =
                parameterAsetNeraca(
                    transaksi,
                    master
                );


            const harga =
                parameter.harga;


            const nilaiSisa =
                parameter.nilaiSisa;


            const umurManfaat =
                parameter.umurManfaat;


            const tahunPerolehan =
                parameter.tahunPerolehan;


            const namaAset =
                transaksi.namaAset ||
                transaksi.nama ||
                master?.namaAset ||
                master?.nama ||
                transaksi.keterangan ||
                "(tanpa nama)";


            const kodeAset =
                transaksi.kodeAset ||
                master?.kodeAset ||
                master?.kode ||
                "-";


            const unitUsaha =
                transaksi.unitUsaha ||
                master?.unitUsaha ||
                "-";


            // =========================================
            // VALIDASI
            // =========================================

            if (
                harga <= 0 ||
                umurManfaat <= 0 ||
                tahunPerolehan <= 0
            ) {

                daftarAset.push({

                    transaksiId:
                        transaksi.id,

                    asetId,

                    namaAset,

                    kodeAset,

                    unitUsaha,

                    tahunPerolehan,

                    hargaPerolehan:
                        harga,

                    umurManfaat,

                    nilaiSisa,

                    depresiasiBulanan:
                        0,

                    jumlahBulan:
                        0,

                    akumulasiDepresiasi:
                        0,

                    nilaiBuku:
                        harga,

                    statusPenyusutan:
                        "PARAMETER ASET TIDAK LENGKAP"

                });


                totalHargaPerolehan +=
                    harga;


                totalNilaiBuku +=
                    harga;


                return;

            }


            const tanggalPerolehan =
                tanggalPerolehanAsetNeraca(
                    transaksi,
                    master
                );


            if (
                !tanggalPerolehan
            ) {

                daftarAset.push({

                    transaksiId:
                        transaksi.id,

                    asetId,

                    namaAset,

                    kodeAset,

                    unitUsaha,

                    tahunPerolehan,

                    hargaPerolehan:
                        harga,

                    umurManfaat,

                    nilaiSisa,

                    depresiasiBulanan:
                        0,

                    jumlahBulan:
                        0,

                    akumulasiDepresiasi:
                        0,

                    nilaiBuku:
                        harga,

                    statusPenyusutan:
                        "TANGGAL PEROLEHAN TIDAK ADA"

                });


                totalHargaPerolehan +=
                    harga;


                totalNilaiBuku +=
                    harga;


                return;

            }


            // =========================================
            // UMUR MANFAAT BULAN
            // =========================================

            const umurManfaatBulan =
                umurManfaat *
                12;


            // =========================================
            // PENYUSUTAN BULANAN
            // =========================================

            const depresiasiBulanan =
                (
                    harga -
                    nilaiSisa
                ) /
                umurManfaatBulan;


            // =========================================
            // BULAN MULAI PENYUSUTAN
            // =========================================

            const bulanMulaiDepresiasi =
                new Date(
                    tanggalPerolehan.getFullYear(),
                    tanggalPerolehan.getMonth() + 1,
                    1
                );


            // =========================================
            // BULAN LAPORAN
            // =========================================

            const bulanLaporan =
                new Date(
                    tanggalLaporan.getFullYear(),
                    tanggalLaporan.getMonth(),
                    1
                );


            // =========================================
            // JUMLAH BULAN PENYUSUTAN
            // =========================================

            let jumlahBulan = 0;


            if (
                bulanLaporan >=
                bulanMulaiDepresiasi
            ) {

                jumlahBulan =
                    (
                        (
                            bulanLaporan.getFullYear() -
                            bulanMulaiDepresiasi.getFullYear()
                        ) * 12
                    ) +
                    (
                        bulanLaporan.getMonth() -
                        bulanMulaiDepresiasi.getMonth()
                    ) +
                    1;

            }


            jumlahBulan =
                Math.min(
                    Math.max(
                        0,
                        jumlahBulan
                    ),
                    umurManfaatBulan
                );


            // =========================================
            // BATAS MAKSIMAL PENYUSUTAN
            // =========================================

            const maksimumDepresiasi =
                harga -
                nilaiSisa;


            const akumulasi =
                Math.min(
                    depresiasiBulanan *
                    jumlahBulan,
                    maksimumDepresiasi
                );


            // =========================================
            // NILAI BUKU
            // =========================================

            const nilaiBukuAset =
                Math.max(
                    nilaiSisa,
                    harga -
                    akumulasi
                );


            // =========================================
            // TOTAL
            // =========================================

            totalHargaPerolehan +=
                harga;


            totalAkumulasiDepresiasi +=
                akumulasi;


            totalNilaiBuku +=
                nilaiBukuAset;


            // =========================================
            // STATUS
            // =========================================

            let statusPenyusutan;


            if (
                bulanLaporan <
                bulanMulaiDepresiasi
            ) {

                statusPenyusutan =
                    "BELUM MULAI DISUSUTKAN";

            }
            else if (
                jumlahBulan >=
                umurManfaatBulan
            ) {

                statusPenyusutan =
                    "MASA MANFAAT HABIS";

            }
            else {

                statusPenyusutan =
                    "MASIH DISUSUTKAN";

            }


            daftarAset.push({

                transaksiId:
                    transaksi.id,

                asetId,

                namaAset,

                kodeAset,

                unitUsaha,

                tahunPerolehan,

                tanggalPerolehan,

                hargaPerolehan:
                    harga,

                umurManfaat,

                umurManfaatBulan,

                nilaiSisa,

                depresiasiBulanan,

                jumlahBulan,

                akumulasiDepresiasi:
                    akumulasi,

                nilaiBuku:
                    nilaiBukuAset,

                statusPenyusutan

            });


            // =========================================
            // DEBUG
            // =========================================

            console.log(
                "📌 ASET",
                index + 1,
                namaAset,
                {
                    tanggalPerolehan,
                    bulanMulaiDepresiasi,
                    harga,
                    nilaiSisa,
                    umurManfaat,
                    umurManfaatBulan,
                    depresiasiBulanan,
                    jumlahBulan,
                    akumulasi,
                    nilaiBuku:
                        nilaiBukuAset,
                    statusPenyusutan
                }
            );

        }
    );


    console.log(
        "💰 TOTAL HARGA PEROLEHAN:",
        totalHargaPerolehan
    );


    console.log(
        "📉 TOTAL AKUMULASI PENYUSUTAN:",
        totalAkumulasiDepresiasi
    );


    console.log(
        "📊 TOTAL NILAI BUKU:",
        totalNilaiBuku
    );


    console.log(
        "📦 JUMLAH ASET:",
        daftarAset.length
    );


    console.groupEnd();


    return {

        hargaPerolehan:
            totalHargaPerolehan,

        akumulasiDepresiasi:
            totalAkumulasiDepresiasi,

        nilaiBuku:
            totalNilaiBuku,

        jumlahAset:
            daftarAset.length,

        daftarAset

    };

}


// =========================================================
// HITUNG MODAL DISETOR
// =========================================================

async function hitungModalNeracaFirebase(
    sampai
) {

    const data =
        await loadModalNeracaFirebase();


    let total = 0;


    const batas =
        new Date(
            sampai + "T23:59:59"
        );


    data.forEach(
        function(item) {

            const tanggal =
                tanggalNeraca(item);


            if (!tanggal) {
                return;
            }


            if (
                tanggal > batas
            ) {

                return;

            }


            total +=
                nominalNeraca(
                    item
                );

        }
    );


    return total;

}


// =========================================================
// HITUNG LABA RUGI PERIODE
// =========================================================
//
// Pembelian aset bukan beban.
// Modal bukan pendapatan.
// Transfer bukan pendapatan/beban.
// Piutang diterima kembali bukan pendapatan.
// Utang diterima bukan pendapatan.
// Pembayaran utang bukan beban.
// Penyusutan masuk sebagai beban.
//
// =========================================================

async function hitungLabaRugiNeracaFirebase(
    dari,
    sampai
) {

    const transaksi =
        await loadTransaksiNeracaFirebase();


    let pendapatan = 0;

    let bebanTransaksi = 0;


    transaksi
        .filter(
            function(item) {

                return transaksiDalamPeriodeNeraca(
                    item.tanggal,
                    dari,
                    sampai
                );

            }
        )
        .forEach(
            function(item) {

                const jenis =
                    String(
                        item.jenisTransaksi || ""
                    ).toUpperCase();


                const nominal =
                    nominalNeraca(item);


                if (
                    nominal <= 0
                ) {

                    return;

                }


                // =====================================
                // PEMASUKAN
                // =====================================

                if (
                    jenis === "PEMASUKAN"
                ) {

                    const akunKode =
                        String(
                            item.akunKode || ""
                        ).toUpperCase();


                    const jenisPendapatan =
                        String(
                            item.jenisPendapatan || ""
                        ).toUpperCase();


                    const sumber =
                        String(
                            item.sumber || ""
                        ).toUpperCase();


                    if (
                        akunKode === "MODAL"
                    ) {

                        return;

                    }


                    if (
                        jenisPendapatan === "MODAL"
                    ) {

                        return;

                    }


                    if (
                        jenisPendapatan === "BUKAN_PENDAPATAN"
                    ) {

                        return;

                    }


                    if (
                        sumber === "UTANG"
                    ) {

                        return;

                    }


                    if (
                        sumber === "PIUTANG"
                    ) {

                        return;

                    }


                    pendapatan +=
                        nominal;

                }


                // =====================================
                // PENGELUARAN
                // =====================================

                else if (
                    jenis === "PENGELUARAN"
                ) {

                    const akunKode =
                        String(
                            item.akunKode || ""
                        ).toUpperCase();


                    const jenisPengeluaran =
                        String(
                            item.jenisPengeluaran || ""
                        ).toUpperCase();


                    const jenisBeban =
                        String(
                            item.jenisBeban || ""
                        ).toUpperCase();


                    const sumber =
                        String(
                            item.sumber || ""
                        ).toUpperCase();


                    if (
                        akunKode === "MODAL"
                    ) {

                        return;

                    }


                    if (
                        jenisPengeluaran === "MODAL"
                    ) {

                        return;

                    }


                    if (
                        jenisPengeluaran === "ASET"
                    ) {

                        return;

                    }


                    if (
                        akunKode === "1400"
                    ) {

                        return;

                    }


                    if (
                        jenisPengeluaran === "BUKAN_BEBAN"
                    ) {

                        return;

                    }


                    if (
                        jenisBeban === "BUKAN_BEBAN"
                    ) {

                        return;

                    }


                    if (
                        sumber === "UTANG"
                    ) {

                        return;

                    }


                    if (
                        akunKode === "UTANG"
                    ) {

                        return;

                    }


                    bebanTransaksi +=
                        nominal;

                }

            }
        );


    // =============================================
    // PENYUSUTAN PERIODE
    // =============================================

    const depresiasi =
        await hitungDepresiasiPeriodeNeracaFirebase(
            dari,
            sampai
        );


    const beban =
        bebanTransaksi +
        depresiasi;


    const labaRugi =
        pendapatan -
        beban;


    return {

        pendapatan,

        beban,

        bebanTransaksi,

        depresiasi,

        labaRugi

    };

}


// =========================================================
// HITUNG SALDO LABA / RUGI SEBELUMNYA
// =========================================================
//
// Penyusutan historis dihitung per bulan melalui
// hitungLabaRugiNeracaFirebase().
//
// =========================================================

async function hitungSaldoLabaSebelumnyaNeracaFirebase(
    dari
) {

    const tahunLaporan =
        new Date(
            dari + "T00:00:00"
        ).getFullYear();


    if (
        tahunLaporan <=
        TAHUN_AWAL_PEMBUKUAN_NERACA
    ) {

        console.log(
            "Saldo Laba Sebelumnya:",
            0
        );


        return 0;

    }


    let saldoLaba =
        0;


    for (
        let tahun =
            TAHUN_AWAL_PEMBUKUAN_NERACA;

        tahun <
            tahunLaporan;

        tahun++
    ) {

        const awal =
            tahun +
            "-01-01";


        const akhir =
            tahun +
            "-12-31";


        const hasil =
            await hitungLabaRugiNeracaFirebase(
                awal,
                akhir
            );


        const labaRugiTahun =
            Number(
                hasil.labaRugi
            ) || 0;


        saldoLaba +=
            labaRugiTahun;


        console.log(
            "Laba/Rugi Historis",
            tahun + ":",
            labaRugiTahun
        );


        console.log(
            "  Pendapatan:",
            hasil.pendapatan
        );


        console.log(
            "  Beban Transaksi:",
            hasil.bebanTransaksi
        );


        console.log(
            "  Penyusutan:",
            hasil.depresiasi
        );


        console.log(
            "  Laba/Rugi:",
            hasil.labaRugi
        );

    }


    console.log(
        "Saldo Laba Sebelumnya:",
        saldoLaba
    );


    return saldoLaba;

}


// =========================================================
// AMBIL DATA NERACA
// =========================================================

async function ambilDataNeracaFirebase(
    dari,
    sampai
) {

    const hasil =
        await Promise.all([

            hitungSaldoMediaNeracaFirebase(
                sampai
            ),

            hitungPiutangNeracaFirebase(
                sampai
            ),

            hitungUtangNeracaFirebase(
                sampai
            ),

            hitungAsetNeracaFirebase(
                sampai
            ),

            hitungModalNeracaFirebase(
                sampai
            ),

            hitungLabaRugiNeracaFirebase(
    `${new Date(sampai + "T00:00:00").getFullYear()}-01-01`,
    sampai
),

            hitungSaldoLabaSebelumnyaNeracaFirebase(
                dari
            )

        ]);


    const saldoMedia =
        hasil[0];


    const piutang =
        hasil[1];


    const utang =
        hasil[2];


    const aset =
        hasil[3];


    const modal =
        hasil[4];


    const laba =
        hasil[5];


    const saldoLabaSebelumnya =
        hasil[6];


    // =====================================================
    // AKTIVA LANCAR
    // =====================================================

    const kas =
        Number(
            saldoMedia.kas
        ) || 0;


    const bank =
        Number(
            saldoMedia.bank
        ) || 0;


    const dana =
        Number(
            saldoMedia.dana
        ) || 0;


    const totalPiutang =
        Number(
            piutang
        ) || 0;


    const totalAktivaLancar =
        kas +
        bank +
        dana +
        totalPiutang;


    // =====================================================
    // AKTIVA TETAP
    // =====================================================

    const hargaPerolehanAsetTetap =
        Number(
            aset.hargaPerolehan
        ) || 0;


    const akumulasiDepresiasi =
        Number(
            aset.akumulasiDepresiasi
        ) || 0;


    const nilaiBukuAsetTetap =
        Number(
            aset.nilaiBuku
        ) || 0;


    const totalAktivaTetap =
        nilaiBukuAsetTetap;


    // =====================================================
    // TOTAL AKTIVA
    // =====================================================

    const totalAktiva =
        totalAktivaLancar +
        totalAktivaTetap;


    // =====================================================
    // KEWAJIBAN
    // =====================================================

    const totalUtang =
        Number(
            utang
        ) || 0;


    const totalKewajiban =
        totalUtang;


    // =====================================================
    // EKUITAS
    // =====================================================

    const totalModal =
        Number(
            modal
        ) || 0;


    const totalSaldoLabaSebelumnya =
        Number(
            saldoLabaSebelumnya
        ) || 0;


    const labaRugiTahunBerjalan =
        Number(
            laba.labaRugi
        ) || 0;


    const totalEkuitas =
        totalModal +
        totalSaldoLabaSebelumnya +
        labaRugiTahunBerjalan;


    // =====================================================
    // TOTAL PASIVA
    // =====================================================

    const totalPasiva =
        totalKewajiban +
        totalEkuitas;


    // =====================================================
    // SELISIH
    // =====================================================

    const selisih =
        totalAktiva -
        totalPasiva;


    const toleransi =
        0.01;


    const seimbang =
        Math.abs(
            selisih
        ) <= toleransi;


    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
        "======================================"
    );


    console.log(
        "===== NERACA BUMDES ====="
    );


    console.log(
        "Tahun Awal Pembukuan:",
        TAHUN_AWAL_PEMBUKUAN_NERACA
    );


    console.log(
        "Periode:",
        dari,
        "s/d",
        sampai
    );


    console.log(
        "Kas:",
        kas
    );


    console.log(
        "Bank:",
        bank
    );


    console.log(
        "Dana:",
        dana
    );


    console.log(
        "Saldo Affiliate:",
        saldoMedia.saldoAffiliate
    );


    console.log(
        "Media Uang Neraca:",
        saldoMedia.totalMediaUang
    );


    console.log(
        "Piutang:",
        totalPiutang
    );


    console.log(
        "Harga Perolehan Aset:",
        hargaPerolehanAsetTetap
    );


    console.log(
        "Akumulasi Penyusutan:",
        akumulasiDepresiasi
    );


    console.log(
        "Nilai Buku Aset:",
        nilaiBukuAsetTetap
    );


    console.log(
        "Total Aktiva:",
        totalAktiva
    );


    console.log(
        "Utang:",
        totalUtang
    );


    console.log(
        "Modal Disetor:",
        totalModal
    );


    console.log(
        "Saldo Laba Sebelumnya:",
        totalSaldoLabaSebelumnya
    );


    console.log(
        "Pendapatan Tahun Berjalan:",
        laba.pendapatan
    );


    console.log(
        "Beban Transaksi Tahun Berjalan:",
        laba.bebanTransaksi
    );


    console.log(
        "Penyusutan Tahun Berjalan:",
        laba.depresiasi
    );


    console.log(
        "Total Beban Tahun Berjalan:",
        laba.beban
    );


    console.log(
        "Laba/Rugi Tahun Berjalan:",
        labaRugiTahunBerjalan
    );


    console.log(
        "Total Ekuitas:",
        totalEkuitas
    );


    console.log(
        "Total Pasiva:",
        totalPasiva
    );


    console.log(
        "SELISIH:",
        selisih
    );


    console.log(
        "SEIMBANG:",
        seimbang
    );


    console.log(
        "======================================"
    );


    // =====================================================
    // RETURN
    // =====================================================

    return {

        periode: {

            dari,

            sampai

        },


        // =============================================
        // AKTIVA LANCAR
        // =============================================

        aktivaLancar: {

            kas,

            bank,

            dana,

            piutang:
                totalPiutang,

            total:
                totalAktivaLancar

        },


        // =============================================
        // AKTIVA TETAP
        // =============================================

        aktivaTetap: {

            hargaPerolehan:
                hargaPerolehanAsetTetap,

            akumulasiPenyusutan:
                akumulasiDepresiasi,

            nilaiBuku:
                nilaiBukuAsetTetap,

            total:
                totalAktivaTetap

        },


        totalAktiva,


        // =============================================
        // KEWAJIBAN
        // =============================================

        kewajiban: {

            utang:
                totalUtang,

            total:
                totalKewajiban

        },


        // =============================================
        // EKUITAS
        // =============================================

        modal: {

            modalAwal:
                totalModal,

            saldoLabaSebelumnya:
                totalSaldoLabaSebelumnya,

            labaRugiOperasional:
                labaRugiTahunBerjalan,

            total:
                totalEkuitas

        },


        totalPasiva,


        // =============================================
        // REKONSILIASI
        // =============================================

        selisih,

        seimbang,


        // =============================================
        // LABA RUGI TAHUN BERJALAN
        // =============================================

        labaRugi: {

            pendapatan:
                Number(
                    laba.pendapatan
                ) || 0,

            beban:
                Number(
                    laba.beban
                ) || 0,

            bebanTransaksi:
                Number(
                    laba.bebanTransaksi
                ) || 0,

            depresiasi:
                Number(
                    laba.depresiasi
                ) || 0,

            labaRugi:
                labaRugiTahunBerjalan

        },


        // =============================================
        // SALDO LABA
        // =============================================

        saldoLaba:
            totalSaldoLabaSebelumnya,


        // =============================================
        // INFORMASI AFFILIATE
        // =============================================
        //
        // Tetap dikembalikan untuk informasi,
        // tetapi TIDAK termasuk totalMediaUang.
        //
        // =============================================

        saldoAffiliate:
            Number(
                saldoMedia.saldoAffiliate
            ) || 0,


        totalMediaUang:
            Number(
                saldoMedia.totalMediaUang
            ) || 0,


        // =============================================
        // INFORMASI ASET
        // =============================================

        jumlahAsetTetap:
            Number(
                aset.jumlahAset
            ) || 0,


        daftarAsetTetap:
            aset.daftarAset || []

    };

}


// =========================================================
// EXPORT
// =========================================================

window.ambilDataNeracaFirebase =
    ambilDataNeracaFirebase;


window.hitungAsetNeracaFirebase =
    hitungAsetNeracaFirebase;


window.hitungSaldoMediaNeracaFirebase =
    hitungSaldoMediaNeracaFirebase;


window.hitungPiutangNeracaFirebase =
    hitungPiutangNeracaFirebase;


window.hitungUtangNeracaFirebase =
    hitungUtangNeracaFirebase;


window.hitungModalNeracaFirebase =
    hitungModalNeracaFirebase;


window.hitungLabaRugiNeracaFirebase =
    hitungLabaRugiNeracaFirebase;


window.hitungDepresiasiPeriodeNeracaFirebase =
    hitungDepresiasiPeriodeNeracaFirebase;


window.hitungSaldoLabaSebelumnyaNeracaFirebase =
    hitungSaldoLabaSebelumnyaNeracaFirebase;


// =========================================================
// STATUS
// =========================================================

console.log(
    "NERACA FIREBASE SIAP"
);


console.log(
    "NERACA: TAHUN AWAL PEMBUKUAN = 2020"
);


console.log(
    "NERACA: PENYUSUTAN BULANAN AKTIF"
);


console.log(
    "NERACA: BULAN PEROLEHAN TIDAK DIHITUNG"
);


console.log(
    "NERACA: PENYUSUTAN DIMULAI BULAN BERIKUTNYA"
);


console.log(
    "NERACA: SALDO AFFILIATE BUKAN MEDIA UANG"
);


console.log(
    "NERACA: AFFILIATE -> KAS HANYA MELALUI TRANSFER"
);


console.log(
    "NERACA: SALDO LABA DIHITUNG MULAI 2020"
);


console.log(
    "NERACA: PENYUSUTAN HISTORIS MASUK SALDO LABA"
);


console.log(
    "NERACA: TANPA FORCE BALANCE"
);
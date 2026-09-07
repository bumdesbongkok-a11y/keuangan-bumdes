// =========================================================
// NERACA FIREBASE
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================================
//
// ATURAN AKUNTANSI FINAL
//
// 1. TAHUN AWAL PEMBUKUAN
//    - Pembukuan dimulai tahun 2020
//    - Tahun 2020 menjadi dasar histori laporan
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
//    - Tahun perolehan tidak disusutkan
//    - Penyusutan dimulai tahun berikutnya
//    - Penyusutan historis dihitung otomatis
//    - Akumulasi penyusutan masuk ke nilai buku aset
//    - Beban penyusutan masuk ke Laba/Rugi
//    - Penyusutan historis masuk ke Saldo Laba sebelumnya
//
// 6. SALDO LABA SEBELUMNYA
//    - Dimulai dari tahun 2020
//    - Mengakumulasi laba/rugi setiap tahun sebelum tahun laporan
//    - Termasuk penyusutan historis
//
// 7. EKUITAS
//
//    Modal Disetor
//    + Saldo Laba Tahun Sebelumnya
//    + Laba/Rugi Tahun Berjalan
//    = Total Ekuitas
//
// 8. NERACA TIDAK DIPAKSA BALANCE
//
// =========================================================


// =========================================================
// KONFIGURASI PEMBUKUAN
// =========================================================

// Tahun awal histori pembukuan BUMDes
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


    // Kompatibilitas data lama
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


    // Jika master tidak memiliki tahun
    // gunakan tanggal transaksi aset
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


    if (
        nilaiSisa < 0
    ) {

        nilaiSisa = 0;

    }


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
// HITUNG KAS / BANK / DANA
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

                return transaksiSampaiTanggalNeraca(
                    item.tanggal,
                    sampai
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

                        saldoAffiliate += nominal;

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

                        saldoAffiliate -= nominal;

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

                        saldoAffiliate -= nominal;

                    }


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

                        saldoAffiliate += nominal;

                    }

                }

            }
        );


    return {

        kas,

        bank,

        dana,

        saldoAffiliate,

        totalKasBankDana:
            kas +
            bank +
            dana,

        totalMediaUang:
            kas +
            bank +
            dana +
            saldoAffiliate

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
// HITUNG PENYUSUTAN PERIODE
// =========================================================
//
// ATURAN:
//
// Tahun perolehan = tidak disusutkan
//
// Tahun berikutnya = mulai disusutkan
//
// Contoh:
//
// Aset 2021
// Harga Rp728.000
// Umur 4 tahun
// Nilai sisa Rp0
//
// 2021 = Rp0
// 2022 = Rp182.000
// 2023 = Rp182.000
// 2024 = Rp182.000
// 2025 = Rp182.000
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

                masterById[
                    item.id
                ] = item;

            }

        }
    );


    const tahunDari =
        new Date(
            dari + "T00:00:00"
        ).getFullYear();


    const tahunSampai =
        new Date(
            sampai + "T23:59:59"
        ).getFullYear();


    let total = 0;


    transaksi.forEach(
        function(item) {

            // -----------------------------------------
            // HARUS TRANSAKSI ASET
            // -----------------------------------------

            if (
                !transaksiAdalahAsetNeraca(
                    item
                )
            ) {

                return;

            }


            // -----------------------------------------
            // ASET HARUS SUDAH DIPEROLEH
            // -----------------------------------------

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


            const tahunPerolehan =
                parameter.tahunPerolehan;


            if (
                harga <= 0 ||
                umurManfaat <= 0 ||
                tahunPerolehan <= 0 ||
                harga <= nilaiSisa
            ) {

                return;

            }


            // -----------------------------------------
            // DEPRESIASI TAHUNAN
            // -----------------------------------------

            const depresiasiTahunan =
                (
                    harga -
                    nilaiSisa
                ) /
                umurManfaat;


            // -----------------------------------------
            // PENYUSUTAN MULAI TAHUN BERIKUTNYA
            // -----------------------------------------

            const tahunMulaiDepresiasi =
                tahunPerolehan + 1;


            if (
                tahunSampai <
                tahunMulaiDepresiasi
            ) {

                return;

            }


            // -----------------------------------------
            // TAHUN TERAKHIR
            // -----------------------------------------

            const tahunAkhirDepresiasi =
                tahunPerolehan +
                umurManfaat;


            // -----------------------------------------
            // CARI IRISAN PERIODE
            // -----------------------------------------

            const awal =
                Math.max(
                    tahunDari,
                    tahunMulaiDepresiasi
                );


            const akhir =
                Math.min(
                    tahunSampai,
                    tahunAkhirDepresiasi
                );


            if (
                akhir < awal
            ) {

                return;

            }


            // -----------------------------------------
            // JUMLAH TAHUN
            // -----------------------------------------

            const jumlahTahun =
                akhir -
                awal +
                1;


            // -----------------------------------------
            // TOTAL DEPRESIASI
            // -----------------------------------------

            let depresiasiPeriode =
                depresiasiTahunan *
                jumlahTahun;


            // -----------------------------------------
            // BATAS MAKSIMAL
            // -----------------------------------------

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

        }
    );


    return total;

}


// =========================================================
// HITUNG ASET TETAP
// =========================================================
//
// Master Aset hanya memberikan parameter:
//
// - nama
// - kode
// - tahun perolehan
// - umur manfaat
// - nilai sisa
//
// Saldo harga perolehan tetap berasal dari transaksi.
//
// =========================================================

// =========================================================
// HITUNG ASET TETAP
// =========================================================
//
// Master Aset hanya memberikan parameter:
//
// - nama
// - kode
// - tahun perolehan
// - umur manfaat
// - nilai sisa
//
// Saldo harga perolehan tetap berasal dari transaksi.
//
// =========================================================

async function hitungAsetNeracaFirebase(sampai) {

    const semuaTransaksi =
        await loadTransaksiNeracaFirebase();


    const semuaMasterAset =
        await loadMasterAsetParameterNeracaFirebase();


    const tanggalLaporan =
        new Date(
            sampai + "T23:59:59"
        );


    const tahunLaporan =
        tanggalLaporan.getFullYear();


    // =====================================================
    // MASTER ASET DIINDEX BERDASARKAN ID
    // =====================================================

    const masterById = {};


    semuaMasterAset.forEach(
        function(item) {

            if (item.id) {

                masterById[
                    item.id
                ] = item;

            }

        }
    );


    // =====================================================
    // AMBIL SEMUA TRANSAKSI ASET
    // SAMPAI TANGGAL LAPORAN
    // =====================================================

    const transaksiAset =
        semuaTransaksi.filter(
            function(item) {

                return (
                    transaksiAdalahAsetNeraca(item) &&
                    transaksiSampaiTanggalNeraca(
                        item.tanggal,
                        sampai
                    )
                );

            }
        );


    // =====================================================
    // TOTAL
    // =====================================================

    let totalHargaPerolehan = 0;

    let totalAkumulasiDepresiasi = 0;

    let totalNilaiBuku = 0;


    const daftarAset = [];


    // =====================================================
    // HEADER DEBUG
    // =====================================================

    console.group(
        "🔎 RINCIAN ASET NERACA s/d " + sampai
    );


    console.log(
        "Jumlah transaksi aset:",
        transaksiAset.length
    );


    console.log(
        "Tahun laporan:",
        tahunLaporan
    );


    console.log(
        "--------------------------------------"
    );


    // =====================================================
    // HITUNG SATU PER SATU ASET
    // =====================================================

    transaksiAset.forEach(
        function(transaksi, index) {

            const asetId =
                transaksi.asetId ||
                null;


            const master =
                masterById[
                    asetId
                ] || null;


            // =================================================
            // PARAMETER
            // =================================================

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


            // =================================================
            // IDENTITAS ASET
            // =================================================

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


            // =================================================
            // VALIDASI
            // =================================================

            if (
                harga <= 0 ||
                umurManfaat <= 0 ||
                tahunPerolehan <= 0
            ) {

                console.warn(
                    "⚠️ ASET TIDAK LENGKAP",
                    {
                        nomor: index + 1,
                        namaAset,
                        kodeAset,
                        asetId,
                        transaksiId: transaksi.id,
                        harga,
                        nilaiSisa,
                        umurManfaat,
                        tahunPerolehan,
                        master
                    }
                );


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

                    depresiasiTahunan:
                        0,

                    jumlahTahun:
                        0,

                    akumulasiDepresiasi:
                        0,

                    nilaiBuku:
                        harga

                });


                // Harga tetap masuk
                // jika transaksi aset memiliki nilai

                totalHargaPerolehan +=
                    harga;


                totalNilaiBuku +=
                    harga;


                return;

            }


            // =================================================
            // DEPRESIASI TAHUNAN
            // =================================================

            const depresiasiTahunan =
                (
                    harga -
                    nilaiSisa
                ) /
                umurManfaat;


            // =================================================
            // JUMLAH TAHUN PENYUSUTAN
            // =================================================
            //
            // Tahun perolehan tidak dihitung.
            //
            // 2021 -> 2022 = 1
            // 2021 -> 2023 = 2
            // 2021 -> 2024 = 3
            // 2021 -> 2025 = 4
            //
            // Maksimal = umur manfaat
            //
            // =================================================

            const jumlahTahun =
                Math.min(
                    Math.max(
                        0,
                        tahunLaporan -
                        tahunPerolehan
                    ),
                    umurManfaat
                );


            // =================================================
            // AKUMULASI PENYUSUTAN
            // =================================================

            const maksimumDepresiasi =
                harga -
                nilaiSisa;


            const akumulasi =
                Math.min(
                    depresiasiTahunan *
                    jumlahTahun,
                    maksimumDepresiasi
                );


            // =================================================
            // NILAI BUKU ASET
            // =================================================

            const nilaiBukuAset =
                Math.max(
                    nilaiSisa,
                    harga -
                    akumulasi
                );


            // =================================================
            // TOTAL
            // =================================================

            totalHargaPerolehan +=
                harga;


            totalAkumulasiDepresiasi +=
                akumulasi;


            totalNilaiBuku +=
                nilaiBukuAset;


            // =================================================
            // STATUS PENYUSUTAN
            // =================================================

            let statusPenyusutan;


            if (
                tahunLaporan <=
                tahunPerolehan
            ) {

                statusPenyusutan =
                    "BELUM MULAI DISUSUTKAN";

            }
            else if (
                jumlahTahun >=
                umurManfaat
            ) {

                statusPenyusutan =
                    "MASA MANFAAT HABIS";

            }
            else {

                statusPenyusutan =
                    "MASIH DISUSUTKAN";

            }


            // =================================================
            // DATA ASET
            // =================================================

            const dataAset = {

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

                depresiasiTahunan,

                jumlahTahun,

                akumulasiDepresiasi:
                    akumulasi,

                nilaiBuku:
                    nilaiBukuAset,

                statusPenyusutan

            };


            daftarAset.push(
                dataAset
            );


            // =================================================
            // DEBUG DETAIL ASET
            // =================================================

            console.group(
                "📌 ASET " +
                (index + 1) +
                " - " +
                namaAset
            );


            console.log(
                "Kode Aset:",
                kodeAset
            );


            console.log(
                "Aset ID:",
                asetId
            );


            console.log(
                "Transaksi ID:",
                transaksi.id
            );


            console.log(
                "Unit Usaha:",
                unitUsaha
            );


            console.log(
                "Tahun Perolehan:",
                tahunPerolehan
            );


            console.log(
                "Tahun Laporan:",
                tahunLaporan
            );


            console.log(
                "Harga Perolehan:",
                harga
            );


            console.log(
                "Nilai Sisa:",
                nilaiSisa
            );


            console.log(
                "Umur Manfaat:",
                umurManfaat,
                "tahun"
            );


            console.log(
                "Depresiasi per Tahun:",
                depresiasiTahunan
            );


            console.log(
                "Jumlah Tahun Disusutkan:",
                jumlahTahun
            );


            console.log(
                "Akumulasi Penyusutan:",
                akumulasi
            );


            console.log(
                "Nilai Buku:",
                nilaiBukuAset
            );


            console.log(
                "Status:",
                statusPenyusutan
            );


            console.groupEnd();

        }
    );


    // =====================================================
    // TOTAL DEBUG
    // =====================================================

    console.log(
        "======================================"
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


    console.log(
        "======================================"
    );


    console.groupEnd();


    // =====================================================
    // RETURN
    // =====================================================

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
//
// Modal bukan pendapatan.
//
// Transfer bukan pendapatan/beban.
//
// Piutang diterima kembali bukan pendapatan.
//
// Utang diterima bukan pendapatan.
//
// Pembayaran utang bukan beban.
//
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


                    // Modal bukan pendapatan

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


                    // Bukan pendapatan

                    if (
                        jenisPendapatan === "BUKAN_PENDAPATAN"
                    ) {

                        return;

                    }


                    // Utang bukan pendapatan

                    if (
                        sumber === "UTANG"
                    ) {

                        return;

                    }


                    // Penerimaan piutang
                    // bukan pendapatan lagi

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


                    // Modal bukan beban

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


                    // Aset bukan beban

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


                    // Bukan beban

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


                    // Utang bukan beban

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
// ATURAN FINAL:
//
// Neraca 2020
//    Saldo laba sebelumnya = Rp0
//
// Neraca 2021
//    Saldo laba sebelumnya = laba/rugi 2020
//
// Neraca 2022
//    Saldo laba sebelumnya = laba/rugi 2020 + 2021
//
// Neraca 2023
//    Saldo laba sebelumnya = laba/rugi 2020 + 2021 + 2022
//
// Neraca 2024
//    Saldo laba sebelumnya = 2020 + 2021 + 2022 + 2023
//
// Neraca 2025
//    Saldo laba sebelumnya = 2020 + 2021 + 2022 + 2023 + 2024
//
// Neraca 2026
//    Saldo laba sebelumnya = 2020 + 2021 + 2022 + 2023 + 2024 + 2025
//
// Penyusutan historis SUDAH termasuk karena setiap
// tahun dihitung menggunakan hitungLabaRugiNeracaFirebase().
//
// =========================================================

async function hitungSaldoLabaSebelumnyaNeracaFirebase(
    dari
) {

    const tahunLaporan =
        new Date(
            dari + "T00:00:00"
        ).getFullYear();


    // ---------------------------------------------------------
    // JIKA TAHUN LAPORAN ADALAH TAHUN AWAL
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // HITUNG AKUMULASI DARI 2020
    // SAMPAI TAHUN SEBELUM TAHUN LAPORAN
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // DEBUG
    // ---------------------------------------------------------

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

            // 0
            hitungSaldoMediaNeracaFirebase(
                sampai
            ),

            // 1
            hitungPiutangNeracaFirebase(
                sampai
            ),

            // 2
            hitungUtangNeracaFirebase(
                sampai
            ),

            // 3
            hitungAsetNeracaFirebase(
                sampai
            ),

            // 4
            hitungModalNeracaFirebase(
                sampai
            ),

            // 5
            hitungLabaRugiNeracaFirebase(
                dari,
                sampai
            ),

            // 6
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
        // INFORMASI MEDIA
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
    "NERACA: PENYUSUTAN HISTORIS AKTIF"
);


console.log(
    "NERACA: TAHUN PEROLEHAN TIDAK DIHITUNG"
);


console.log(
    "NERACA: PENYUSUTAN DIMULAI TAHUN BERIKUTNYA"
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


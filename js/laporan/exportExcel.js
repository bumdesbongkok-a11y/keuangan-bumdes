/* =========================================================
   EXPORT EXCEL
   KEUANGAN BUMDes SUMBER REJEKI
========================================================= */

async function exportLaporanExcel() {

    try {

        // =====================================================
        // 1. CEK LIBRARY EXCEL
        // =====================================================

        if (typeof XLSX === "undefined") {
            alert("Library Excel belum berhasil dimuat.");
            return;
        }


        // =====================================================
        // 2. AMBIL PERIODE
        // =====================================================

        const dari = document.getElementById("laporanDari")?.value;
        const sampai = document.getElementById("laporanSampai")?.value;

        if (!dari || !sampai) {
            alert("Silakan pilih tanggal periode laporan terlebih dahulu.");
            return;
        }

        if (dari > sampai) {
            alert("Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");
            return;
        }


        // =====================================================
        // 3. AMBIL DATA TRANSAKSI
        // =====================================================

        if (typeof ambilLaporanTransaksiFirebase !== "function") {
            alert("Fungsi laporan transaksi belum tersedia.");
            return;
        }

        const laporan = await ambilLaporanTransaksiFirebase(
            dari,
            sampai
        );

        const transaksi = laporan?.transaksi || [];
		
		// =====================================================
// AMBIL TRANSAKSI MENTAH
// Untuk mendapatkan field lengkap Pengeluaran
// =====================================================

let transaksiMentah = [];

if (typeof ambilSemuaTransaksiFirebase === "function") {

    transaksiMentah =
        await ambilSemuaTransaksiFirebase();

}
		
		// =====================================================
// AMBIL MASTER AKUN
// =====================================================

const {
    collection,
    getDocs
} = await import(
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
);

const snapshotAkun = await getDocs(
    collection(window.db, "masterAkun")
);

const masterAkun = {};

snapshotAkun.forEach(doc => {

    const item = doc.data();

    if (item.kode) {

        masterAkun[String(item.kode)] = {
            kode: item.kode,
            nama: item.nama || ""
        };

    }

});


        // =====================================================
        // 4. BUAT WORKBOOK
        // =====================================================

        const workbook = XLSX.utils.book_new();


        // =====================================================
        // 5. FILTER PEMASUKAN
        // =====================================================

        const dataPemasukan = transaksi.filter(item =>
            (item.jenisTransaksi || item.jenis || "")
                .toUpperCase() === "PEMASUKAN"
        );


        // =====================================================
        // 6. HEADER EXCEL
        // =====================================================

        const rows = [

            [
                "ID Transaksi",
                "Tanggal",
                "Unit Usaha",
                "Kode Akun",
                "Nama Akun",
                "Media",
                "Nominal",
                "Keterangan",
                "Bukti"
            ]

        ];


        // =====================================================
        // 7. ISI DATA
        // =====================================================

        dataPemasukan.forEach(item => {

            rows.push([

                item.id || "",

                item.tanggal || "",

                window.NAMA_UNIT_USAHA?.[item.unitUsaha]
                    || item.unitUsaha
                    || "",

                item.akunKode || "",

                masterAkun[String(item.akunKode)]?.nama
    || item.akunNama
    || item.namaAkun
    || "",

                item.mediaTujuan
                    || item.media
                    || "",

                Number(item.nominal) || 0,

                item.keterangan || "",

                item.nomorBukti || ""

            ]);

        });


        // =====================================================
        // 8. BUAT SHEET
        // =====================================================

        const worksheet = XLSX.utils.aoa_to_sheet(rows);


        // =====================================================
        // 9. FORMAT KOLOM NOMINAL
        // =====================================================

        for (let baris = 2; baris <= rows.length; baris++) {

            const cell = worksheet[`G${baris}`];

            if (cell) {
                cell.z = '#,##0';
            }

        }


        // =====================================================
        // 10. LEBAR KOLOM
        // =====================================================

        worksheet["!cols"] = [

            { wch: 24 }, // ID
            { wch: 14 }, // Tanggal
            { wch: 24 }, // Unit
            { wch: 14 }, // Kode akun
            { wch: 30 }, // Nama akun
            { wch: 18 }, // Media
            { wch: 18 }, // Nominal
            { wch: 40 }, // Keterangan
            { wch: 20 }  // Bukti

        ];


        // =====================================================
        // 11. TAMBAHKAN SHEET
        // =====================================================

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Pemasukan"
        );
		
		// =====================================================
// SHEET PENGELUARAN
// =====================================================

const dataPengeluaran = transaksiMentah.filter(item => {

    const jenis =
        (item.jenisTransaksi || item.jenis || "")
            .toUpperCase();

    if (jenis !== "PENGELUARAN") {
        return false;
    }

    const tanggal =
        String(item.tanggal || "").substring(0, 10);

    return tanggal >= dari && tanggal <= sampai;

});

const rowsPengeluaran = [

    [
        "ID Transaksi",
        "Tanggal",
        "Unit Usaha",
        "Jenis Pengeluaran",
        "Kode Akun",
        "Nama Akun",
        "Kode Aset",
        "Nama Aset",
        "Supplier",
        "Media",
        "Nominal",
        "Keterangan",
        "Bukti"
    ]

];


// =====================================================
// MASTER SUPPLIER
// =====================================================

const snapshotSupplier = await getDocs(
    collection(window.db, "masterSupplier")
);

const masterSupplier = {};

snapshotSupplier.forEach(doc => {

    const item = doc.data();

    if (item.id || item.kode) {

        masterSupplier[doc.id] = item;

        if (item.kode) {
            masterSupplier[String(item.kode)] = item;
        }

    }

});


// =====================================================
// MASTER ASET
// =====================================================

const snapshotAset = await getDocs(
    collection(window.db, "masterAset")
);

const masterAset = {};

snapshotAset.forEach(doc => {

    const item = doc.data();

    masterAset[doc.id] = item;

    if (item.kode) {
        masterAset[String(item.kode)] = item;
    }

});


// =====================================================
// MASUKKAN DATA PENGELUARAN
// =====================================================

dataPengeluaran.forEach(item => {

    const supplier =
        masterSupplier[item.supplierId]
        || {};

    const aset =
        masterAset[item.asetId]
        || {};

    const namaAset =
        item.namaAset
        || aset.nama
        || "";

    const kodeAset =
        item.kodeAset
        || aset.kode
        || "";

    rowsPengeluaran.push([

        item.id || "",

        item.tanggal || "",

        window.NAMA_UNIT_USAHA?.[item.unitUsaha]
        || item.unitUsaha
        || "",

        item.jenisPengeluaran
        || "",

        item.akunKode
        || "",

        masterAkun[String(item.akunKode)]?.nama
        || item.akunNama
        || item.namaAkun
        || "",

        kodeAset,

        namaAset,

        supplier.nama
        || "",

        item.mediaAsal
        || item.media
        || "",

        Number(item.nominal) || 0,

        item.keterangan || "",

        item.nomorBukti || ""

    ]);

});


// =====================================================
// BUAT WORKSHEET PENGELUARAN
// =====================================================

const worksheetPengeluaran =
    XLSX.utils.aoa_to_sheet(rowsPengeluaran);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsPengeluaran.length;
    baris++
) {

    const cell =
        worksheetPengeluaran[`K${baris}`];

    if (cell) {
        cell.z = '#,##0';
    }

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetPengeluaran["!cols"] = [

    { wch: 24 }, // ID
    { wch: 14 }, // Tanggal
    { wch: 24 }, // Unit
    { wch: 22 }, // Jenis pengeluaran
    { wch: 14 }, // Kode akun
    { wch: 30 }, // Nama akun
    { wch: 15 }, // Kode aset
    { wch: 30 }, // Nama aset
    { wch: 25 }, // Supplier
    { wch: 18 }, // Media
    { wch: 18 }, // Nominal
    { wch: 40 }, // Keterangan
    { wch: 20 }  // Bukti

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetPengeluaran,
    "Pengeluaran"
);

// =====================================================
// SHEET TRANSFER
// =====================================================

const dataTransfer = transaksiMentah.filter(item => {

    const jenis =
        (item.jenisTransaksi || item.jenis || "")
            .toUpperCase();

    if (jenis !== "TRANSFER") {
        return false;
    }

    const tanggal =
        String(item.tanggal || "").substring(0, 10);

    return tanggal >= dari && tanggal <= sampai;

});


const rowsTransfer = [

    [
        "ID Transaksi",
        "Tanggal",
        "Media Asal",
        "Media Tujuan",
        "Nominal",
        "Keterangan",
        "Bukti"
    ]

];


dataTransfer.forEach(item => {

    rowsTransfer.push([

        item.id || "",

        item.tanggal || "",

        item.mediaAsal || "",

        item.mediaTujuan || "",

        Number(item.nominal) || 0,

        item.keterangan || "",

        item.nomorBukti || ""

    ]);

});


// =====================================================
// BUAT WORKSHEET TRANSFER
// =====================================================

const worksheetTransfer =
    XLSX.utils.aoa_to_sheet(rowsTransfer);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsTransfer.length;
    baris++
) {

    const cell =
        worksheetTransfer[`E${baris}`];

    if (cell) {
        cell.z = '#,##0';
    }

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetTransfer["!cols"] = [

    { wch: 24 }, // ID
    { wch: 14 }, // Tanggal
    { wch: 18 }, // Media asal
    { wch: 18 }, // Media tujuan
    { wch: 18 }, // Nominal
    { wch: 40 }, // Keterangan
    { wch: 20 }  // Bukti

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetTransfer,
    "Transfer"
);

// =====================================================
// SHEET PIUTANG
// Posisi piutang sampai tanggal akhir laporan
// =====================================================

if (typeof ambilLaporanPiutangFirebase !== "function") {
    throw new Error("Fungsi laporan piutang belum tersedia.");
}

const laporanPiutang =
    await ambilLaporanPiutangFirebase(sampai);

const dataPiutang =
    laporanPiutang?.data || [];


const rowsPiutang = [

    [
        "ID Piutang",
        "Tanggal",
        "Nama",
        "Nominal",
        "Dibayar",
        "Sisa",
        "Jatuh Tempo",
        "Status",
        "Keterangan"
    ]

];


dataPiutang.forEach(item => {

    rowsPiutang.push([

        item.id || "",

        item.tanggal || "",

        item.nama || "",

        Number(item.nominal) || 0,

        Number(item.dibayar) || 0,

        Number(item.sisa) || 0,

        item.jatuhTempo || "",

        item.status || "",

        item.keterangan || ""

    ]);

});


// =====================================================
// BUAT WORKSHEET PIUTANG
// =====================================================

const worksheetPiutang =
    XLSX.utils.aoa_to_sheet(rowsPiutang);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsPiutang.length;
    baris++
) {

    ["D", "E", "F"].forEach(kolom => {

        const cell =
            worksheetPiutang[`${kolom}${baris}`];

        if (cell) {
            cell.z = '#,##0';
        }

    });

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetPiutang["!cols"] = [

    { wch: 24 }, // ID
    { wch: 14 }, // Tanggal
    { wch: 30 }, // Nama
    { wch: 18 }, // Nominal
    { wch: 18 }, // Dibayar
    { wch: 18 }, // Sisa
    { wch: 16 }, // Jatuh tempo
    { wch: 18 }, // Status
    { wch: 40 }  // Keterangan

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetPiutang,
    "Piutang"
);

// =====================================================
// SHEET UTANG
// Posisi utang sampai tanggal akhir laporan
// =====================================================

if (typeof ambilLaporanUtangFirebase !== "function") {
    throw new Error("Fungsi laporan utang belum tersedia.");
}

const laporanUtang =
    await ambilLaporanUtangFirebase(sampai);

const dataUtang =
    laporanUtang?.data || [];


const rowsUtang = [

    [
        "ID Utang",
        "Tanggal",
        "Nama",
        "Nominal",
        "Dibayar",
        "Sisa",
        "Jatuh Tempo",
        "Status",
        "Keterangan"
    ]

];


dataUtang.forEach(item => {

    rowsUtang.push([

        item.id || "",

        item.tanggal || "",

        item.nama || "",

        Number(item.nominal) || 0,

        Number(item.dibayar) || 0,

        Number(item.sisa) || 0,

        item.jatuhTempo || "",

        item.status || "",

        item.keterangan || ""

    ]);

});


// =====================================================
// BUAT WORKSHEET UTANG
// =====================================================

const worksheetUtang =
    XLSX.utils.aoa_to_sheet(rowsUtang);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsUtang.length;
    baris++
) {

    ["D", "E", "F"].forEach(kolom => {

        const cell =
            worksheetUtang[`${kolom}${baris}`];

        if (cell) {
            cell.z = '#,##0';
        }

    });

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetUtang["!cols"] = [

    { wch: 24 }, // ID
    { wch: 14 }, // Tanggal
    { wch: 30 }, // Nama
    { wch: 18 }, // Nominal
    { wch: 18 }, // Dibayar
    { wch: 18 }, // Sisa
    { wch: 16 }, // Jatuh tempo
    { wch: 18 }, // Status
    { wch: 40 }  // Keterangan

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetUtang,
    "Utang"
);

// =====================================================
// SHEET MODAL
// Posisi modal sampai tanggal akhir laporan
// =====================================================

if (typeof ambilLaporanModalFirebase !== "function") {
    throw new Error("Fungsi laporan modal belum tersedia.");
}

const laporanModal =
    await ambilLaporanModalFirebase(sampai);

const dataModal =
    laporanModal?.data || [];


const rowsModal = [

    [
        "ID Modal",
        "Tanggal",
        "Sumber",
        "Jenis Modal",
        "Nominal",
        "Media",
        "Keterangan"
    ]

];


dataModal.forEach(item => {

    rowsModal.push([

        item.id || "",

        item.tanggal || "",

        item.sumber || "",

        item.jenis || "",

        Number(item.nominal) || 0,

        item.media || "",

        item.keterangan || ""

    ]);

});


// =====================================================
// BUAT WORKSHEET MODAL
// =====================================================

const worksheetModal =
    XLSX.utils.aoa_to_sheet(rowsModal);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsModal.length;
    baris++
) {

    const cell =
        worksheetModal[`E${baris}`];

    if (cell) {
        cell.z = '#,##0';
    }

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetModal["!cols"] = [

    { wch: 24 }, // ID
    { wch: 14 }, // Tanggal
    { wch: 30 }, // Sumber
    { wch: 22 }, // Jenis
    { wch: 18 }, // Nominal
    { wch: 18 }, // Media
    { wch: 40 }  // Keterangan

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetModal,
    "Modal"
);

// =====================================================
// SHEET ASET
// Mengikuti perhitungan laporan aset aplikasi
// =====================================================

if (typeof ambilLaporanAsetFirebase !== "function") {
    throw new Error("Fungsi laporan aset belum tersedia.");
}

const laporanAset =
    await ambilLaporanAsetFirebase(sampai);

const dataAset =
    laporanAset?.data || [];


const rowsAset = [

    [
        "ID Aset",
        "Kode Aset",
        "Nama Aset",
        "Jenis",
        "Unit Usaha",
        "Tanggal Perolehan",
        "Tahun Perolehan",
        "Harga Perolehan",
        "Umur Manfaat (Tahun)",
        "Umur Manfaat (Bulan)",
        "Nilai Sisa",
        "Penyusutan / Bulan",
        "Jumlah Bulan Disusutkan",
        "Akumulasi Penyusutan",
        "Nilai Buku",
        "Status Penyusutan",
        "Kondisi",
        "Status",
        "Keterangan"
    ]

];


dataAset.forEach(item => {

    rowsAset.push([

        item.id || "",

        item.kodeAset
        || item.kode
        || "",

        item.nama
        || item.namaAset
        || "",

        item.jenis || "",

        window.NAMA_UNIT_USAHA?.[item.unitUsaha]
        || item.unitUsaha
        || "",

        item.tanggal
        || item.tanggalPerolehan
        || "",

        item.tahunPerolehan || "",

        Number(
            item.hargaPerolehan
            ?? item.nilaiPerolehan
            ?? 0
        ),

        Number(item.umurManfaat) || 0,

        Number(item.umurManfaatBulan) || 0,

        Number(item.nilaiSisa) || 0,

        Number(item.depresiasiBulanan) || 0,

        Number(item.jumlahBulan) || 0,

        Number(item.akumulasiDepresiasi) || 0,

        Number(item.nilaiBuku) || 0,

        item.statusPenyusutan || "",

        item.kondisi || "",

        item.status || "",

        item.keterangan || ""

    ]);

});


// =====================================================
// BUAT WORKSHEET ASET
// =====================================================

const worksheetAset =
    XLSX.utils.aoa_to_sheet(rowsAset);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsAset.length;
    baris++
) {

    [
        "H",
        "K",
        "L",
        "N",
        "O"
    ].forEach(kolom => {

        const cell =
            worksheetAset[`${kolom}${baris}`];

        if (cell) {
            cell.z = '#,##0';
        }

    });

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetAset["!cols"] = [

    { wch: 24 }, // ID
    { wch: 15 }, // Kode
    { wch: 30 }, // Nama
    { wch: 20 }, // Jenis
    { wch: 24 }, // Unit
    { wch: 18 }, // Tanggal
    { wch: 16 }, // Tahun
    { wch: 20 }, // Harga
    { wch: 20 }, // Umur tahun
    { wch: 20 }, // Umur bulan
    { wch: 18 }, // Nilai sisa
    { wch: 20 }, // Penyusutan
    { wch: 25 }, // Jumlah bulan
    { wch: 24 }, // Akumulasi
    { wch: 18 }, // Nilai buku
    { wch: 28 }, // Status penyusutan
    { wch: 15 }, // Kondisi
    { wch: 15 }, // Status
    { wch: 40 }  // Keterangan

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetAset,
    "Aset"
);

// =====================================================
// SHEET LABA RUGI
// Mengikuti perhitungan laporan Laba Rugi aplikasi
// =====================================================

if (typeof ambilLaporanLabaRugiFirebase !== "function") {
    throw new Error("Fungsi laporan laba rugi belum tersedia.");
}

const laporanLabaRugi =
    await ambilLaporanLabaRugiFirebase(
        dari,
        sampai
    );


// =====================================================
// DATA SHEET
// =====================================================

const rowsLabaRugi = [

    [
        "Keterangan",
        "Kode Akun",
        "Nama Akun",
        "Tanggal",
        "Nominal"
    ]

];


// =====================================================
// PENDAPATAN PER UNIT
// =====================================================

Object.values(
    laporanLabaRugi.unit || {}
).forEach(unit => {

    if (unit.pendapatan?.length) {

        rowsLabaRugi.push([
            `PENDAPATAN - ${unit.nama}`,
            "",
            "",
            "",
            ""
        ]);

        unit.pendapatan.forEach(item => {

            rowsLabaRugi.push([

                "Pendapatan",

                item.akun || "",

                item.nama || "",

                item.tanggal || "",

                Number(item.nominal) || 0

            ]);

        });

    }

});


// =====================================================
// TOTAL PENDAPATAN
// =====================================================

rowsLabaRugi.push([

    "TOTAL PENDAPATAN",

    "",

    "",

    "",

    Number(
        laporanLabaRugi.totalPendapatan
    ) || 0

]);


// =====================================================
// BEBAN PER UNIT
// =====================================================

Object.values(
    laporanLabaRugi.unit || {}
).forEach(unit => {

    if (unit.beban?.length) {

        rowsLabaRugi.push([
            `BEBAN - ${unit.nama}`,
            "",
            "",
            "",
            ""
        ]);

        unit.beban.forEach(item => {

            rowsLabaRugi.push([

                "Beban",

                item.akun || "",

                item.nama || "",

                item.tanggal || "",

                Number(item.nominal) || 0

            ]);

        });

    }

});


// =====================================================
// TOTAL BEBAN TRANSAKSI
// =====================================================

rowsLabaRugi.push([

    "TOTAL BEBAN TRANSAKSI",

    "",

    "",

    "",

    Number(
        laporanLabaRugi.totalBebanTransaksi
    ) || 0

]);


// =====================================================
// PENYUSUTAN
// =====================================================

rowsLabaRugi.push([

    "BEBAN PENYUSUTAN",

    "",

    "Penyusutan Aset Tetap",

    "",

    Number(
        laporanLabaRugi.depresiasi
    ) || 0

]);


// =====================================================
// TOTAL BEBAN
// =====================================================

rowsLabaRugi.push([

    "TOTAL BEBAN",

    "",

    "",

    "",

    Number(
        laporanLabaRugi.totalBeban
    ) || 0

]);


// =====================================================
// LABA / RUGI
// =====================================================

rowsLabaRugi.push([

    "LABA / RUGI",

    "",

    "",

    "",

    Number(
        laporanLabaRugi.labaRugi
    ) || 0

]);


// =====================================================
// BUAT WORKSHEET
// =====================================================

const worksheetLabaRugi =
    XLSX.utils.aoa_to_sheet(rowsLabaRugi);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 2;
    baris <= rowsLabaRugi.length;
    baris++
) {

    const cell =
        worksheetLabaRugi[`E${baris}`];

    if (cell) {
        cell.z = '#,##0';
    }

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetLabaRugi["!cols"] = [

    { wch: 30 }, // Keterangan
    { wch: 15 }, // Kode akun
    { wch: 35 }, // Nama akun
    { wch: 15 }, // Tanggal
    { wch: 20 }  // Nominal

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetLabaRugi,
    "Laba Rugi"
);

// =====================================================
// SHEET NERACA
// Mengikuti perhitungan Neraca aplikasi
// =====================================================

if (typeof ambilDataNeracaFirebase !== "function") {
    throw new Error("Fungsi laporan Neraca belum tersedia.");
}

const laporanNeraca =
    await ambilDataNeracaFirebase(
        dari,
        sampai
    );


// =====================================================
// DATA NERACA
// =====================================================

const rowsNeraca = [

    ["NERACA BUMDes SUMBER REJEKI"],
    ["Desa Bongkok"],
    [`Periode ${dari} s/d ${sampai}`],
    [],

    ["AKTIVA"],
    [],

    ["Aktiva Lancar"],
    ["Kas", laporanNeraca.aktivaLancar?.kas || 0],
    ["Bank", laporanNeraca.aktivaLancar?.bank || 0],
    ["DANA", laporanNeraca.aktivaLancar?.dana || 0],
    ["Piutang", laporanNeraca.aktivaLancar?.piutang || 0],
    [
        "Jumlah Aktiva Lancar",
        laporanNeraca.aktivaLancar?.total || 0
    ],

    [],

    ["Aktiva Tetap"],
    [
        "Harga Perolehan Aset Tetap",
        laporanNeraca.aktivaTetap?.hargaPerolehan || 0
    ],
    [
        "Akumulasi Penyusutan",
        laporanNeraca.aktivaTetap?.akumulasiPenyusutan || 0
    ],
    [
        "Nilai Buku Aset Tetap",
        laporanNeraca.aktivaTetap?.nilaiBuku || 0
    ],

    [],

    [
        "TOTAL AKTIVA",
        laporanNeraca.totalAktiva || 0
    ],

    [],

    ["PASIVA"],
    [],

    ["Kewajiban"],
    [
        "Utang",
        laporanNeraca.kewajiban?.utang || 0
    ],
    [
        "Jumlah Kewajiban",
        laporanNeraca.kewajiban?.total || 0
    ],

    [],

    ["Modal"],
    [
        "Modal Awal",
        laporanNeraca.modal?.modalAwal || 0
    ],
    [
        "Saldo Laba Sebelumnya",
        laporanNeraca.modal?.saldoLabaSebelumnya || 0
    ],
    [
        "Laba / Rugi Tahun Berjalan",
        laporanNeraca.modal?.labaRugiOperasional || 0
    ],
    [
        "Jumlah Modal",
        laporanNeraca.modal?.total || 0
    ],

    [],

    [
        "TOTAL PASIVA",
        laporanNeraca.totalPasiva || 0
    ],

    [],

    [
        "SELISIH NERACA",
        laporanNeraca.selisih || 0
    ],

    [
        "STATUS",
        laporanNeraca.seimbang
            ? "SEIMBANG"
            : "TIDAK SEIMBANG"
    ]

];


// =====================================================
// BUAT WORKSHEET
// =====================================================

const worksheetNeraca =
    XLSX.utils.aoa_to_sheet(rowsNeraca);


// =====================================================
// FORMAT NOMINAL
// =====================================================

for (
    let baris = 1;
    baris <= rowsNeraca.length;
    baris++
) {

    const cell =
        worksheetNeraca[`B${baris}`];

    if (
        cell &&
        typeof cell.v === "number"
    ) {
        cell.z = '#,##0';
    }

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetNeraca["!cols"] = [

    { wch: 35 },
    { wch: 25 }

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetNeraca,
    "Neraca"
);

// =====================================================
// SHEET ARUS KAS
// Mengikuti perhitungan Arus Kas aplikasi
// =====================================================

if (typeof ambilLaporanArusKasFirebase !== "function") {
    throw new Error("Fungsi laporan Arus Kas belum tersedia.");
}

const laporanArusKas =
    await ambilLaporanArusKasFirebase(
        dari,
        sampai
    );


// =====================================================
// DATA ARUS KAS
// =====================================================

const rowsArusKas = [

    ["ARUS KAS BUMDes SUMBER REJEKI"],
    ["Desa Bongkok"],
    [`Periode ${dari} s/d ${sampai}`],
    [],

    ["SALDO AWAL"],
    [
        "Kas",
        laporanArusKas.saldoMediaAwal?.KAS || 0
    ],
    [
        "Bank",
        laporanArusKas.saldoMediaAwal?.BANK || 0
    ],
    [
        "DANA",
        laporanArusKas.saldoMediaAwal?.DANA || 0
    ],
    [
        "Total Saldo Awal",
        laporanArusKas.totalSaldoAwal || 0
    ],

    [],

    ["PEMASUKAN OPERASIONAL"],

];


// =====================================================
// PEMASUKAN
// =====================================================

(laporanArusKas.pemasukan || []).forEach(item => {

    rowsArusKas.push([

        item.tanggal || "",

        item.keterangan || "",

        item.dari || "",

        item.ke || "",

        Number(item.nominal) || 0

    ]);

});


rowsArusKas.push([

    "TOTAL PEMASUKAN",

    "",

    "",

    "",

    Number(
        laporanArusKas.totalPemasukan
    ) || 0

]);


// =====================================================
// PENGELUARAN
// =====================================================

rowsArusKas.push([]);

rowsArusKas.push([
    "PENGELUARAN OPERASIONAL"
]);


(laporanArusKas.pengeluaran || []).forEach(item => {

    rowsArusKas.push([

        item.tanggal || "",

        item.keterangan || "",

        item.dari || "",

        item.ke || "",

        Number(item.nominal) || 0

    ]);

});


rowsArusKas.push([

    "TOTAL PENGELUARAN",

    "",

    "",

    "",

    Number(
        laporanArusKas.totalPengeluaran
    ) || 0

]);


// =====================================================
// MODAL MASUK
// =====================================================

rowsArusKas.push([]);

rowsArusKas.push([
    "MODAL MASUK"
]);


(laporanArusKas.modalMasuk || []).forEach(item => {

    rowsArusKas.push([

        item.tanggal || "",

        item.keterangan || "",

        item.dari || "",

        item.ke || "",

        Number(item.nominal) || 0

    ]);

});


rowsArusKas.push([

    "TOTAL MODAL MASUK",

    "",

    "",

    "",

    Number(
        laporanArusKas.totalModalMasuk
    ) || 0

]);


// =====================================================
// MODAL KELUAR
// =====================================================

rowsArusKas.push([]);

rowsArusKas.push([
    "MODAL KELUAR"
]);


(laporanArusKas.modalKeluar || []).forEach(item => {

    rowsArusKas.push([

        item.tanggal || "",

        item.keterangan || "",

        item.dari || "",

        item.ke || "",

        Number(item.nominal) || 0

    ]);

});


rowsArusKas.push([

    "TOTAL MODAL KELUAR",

    "",

    "",

    "",

    Number(
        laporanArusKas.totalModalKeluar
    ) || 0

]);


// =====================================================
// TRANSFER INTERNAL
// =====================================================

rowsArusKas.push([]);

rowsArusKas.push([
    "TRANSFER INTERNAL"
]);


(laporanArusKas.transfer || []).forEach(item => {

    rowsArusKas.push([

        item.tanggal || "",

        item.keterangan || "",

        item.dari || "",

        item.ke || "",

        Number(item.nominal) || 0

    ]);

});


// =====================================================
// RINGKASAN PERUBAHAN KAS
// =====================================================

rowsArusKas.push([]);

rowsArusKas.push([
    "RINGKASAN PERUBAHAN KAS"
]);

rowsArusKas.push([

    "Perubahan Operasional",

    "",
    "",
    "",
    Number(
        laporanArusKas.perubahanOperasional
    ) || 0

]);

rowsArusKas.push([

    "Perubahan Pendanaan",

    "",
    "",
    "",
    Number(
        laporanArusKas.perubahanPendanaan
    ) || 0

]);

rowsArusKas.push([

    "Perubahan Kas",

    "",
    "",
    "",
    Number(
        laporanArusKas.perubahanKas
    ) || 0

]);


// =====================================================
// SALDO AKHIR
// =====================================================

rowsArusKas.push([]);

rowsArusKas.push([
    "SALDO AKHIR"
]);

rowsArusKas.push([

    "Kas",

    "",
    "",
    "",

    laporanArusKas.saldoKasAkhir || 0

]);

rowsArusKas.push([

    "Bank",

    "",
    "",
    "",

    laporanArusKas.saldoBankAkhir || 0

]);

rowsArusKas.push([

    "DANA",

    "",
    "",
    "",

    laporanArusKas.saldoDanaAkhir || 0

]);

rowsArusKas.push([

    "Total Saldo Akhir",

    "",
    "",
    "",

    laporanArusKas.totalSaldoAkhir || 0

]);


// =====================================================
// BUAT WORKSHEET
// =====================================================

const worksheetArusKas =
    XLSX.utils.aoa_to_sheet(rowsArusKas);


// =====================================================
// FORMAT NOMINAL
// Kolom E digunakan untuk transaksi
// =====================================================

for (
    let baris = 1;
    baris <= rowsArusKas.length;
    baris++
) {

    const cell =
        worksheetArusKas[`E${baris}`];

    if (
        cell &&
        typeof cell.v === "number"
    ) {

        cell.z = '#,##0';

    }

}


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetArusKas["!cols"] = [

    { wch: 20 },
    { wch: 45 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 }

];


// =====================================================
// TAMBAHKAN SHEET
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetArusKas,
    "Arus Kas"
);

// =====================================================
// SHEET RINGKASAN
// =====================================================

const rowsRingkasan = [

    ["BUMDes SUMBER REJEKI"],
    ["DESA BONGKOK"],
    ["RINGKASAN LAPORAN KEUANGAN"],
    [`Periode ${dari} s/d ${sampai}`],
    [],

    ["POSISI KEUANGAN"],
    ["Kas", laporanNeraca.aktivaLancar?.kas || 0],
    ["Bank", laporanNeraca.aktivaLancar?.bank || 0],
    ["DANA", laporanNeraca.aktivaLancar?.dana || 0],
    ["Piutang", laporanNeraca.aktivaLancar?.piutang || 0],
    [
        "Aset Tetap",
        laporanNeraca.aktivaTetap?.hargaPerolehan || 0
    ],
    [
        "Akumulasi Penyusutan",
        laporanNeraca.aktivaTetap?.akumulasiPenyusutan || 0
    ],
    [
        "Nilai Buku Aset Tetap",
        laporanNeraca.aktivaTetap?.nilaiBuku || 0
    ],
    [
        "TOTAL AKTIVA",
        laporanNeraca.totalAktiva || 0
    ],

    [],

    ["KEWAJIBAN DAN MODAL"],
    [
        "Utang",
        laporanNeraca.kewajiban?.utang || 0
    ],
    [
        "Modal",
        laporanNeraca.modal?.modalAwal || 0
    ],
    [
        "Saldo Laba Sebelumnya",
        laporanNeraca.modal?.saldoLabaSebelumnya || 0
    ],
    [
        "Laba / Rugi Tahun Berjalan",
        laporanNeraca.modal?.labaRugiOperasional || 0
    ],
    [
        "TOTAL PASIVA",
        laporanNeraca.totalPasiva || 0
    ],

    [],

    ["KINERJA"],
    [
        "Total Pendapatan",
        laporanLabaRugi.totalPendapatan || 0
    ],
    [
        "Total Beban Transaksi",
        laporanLabaRugi.totalBebanTransaksi || 0
    ],
    [
        "Beban Penyusutan",
        laporanLabaRugi.depresiasi || 0
    ],
    [
        "TOTAL BEBAN",
        laporanLabaRugi.totalBeban || 0
    ],
    [
        "LABA / RUGI",
        laporanLabaRugi.labaRugi || 0
    ],

    [],

    ["ARUS KAS"],
    [
        "Saldo Awal",
        laporanArusKas.totalSaldoAwal || 0
    ],
    [
        "Pemasukan",
        laporanArusKas.totalPemasukan || 0
    ],
    [
        "Pengeluaran",
        laporanArusKas.totalPengeluaran || 0
    ],
    [
        "Modal Masuk",
        laporanArusKas.totalModalMasuk || 0
    ],
    [
        "Modal Keluar",
        laporanArusKas.totalModalKeluar || 0
    ],
    [
        "Perubahan Kas",
        laporanArusKas.perubahanKas || 0
    ],
    [
        "Saldo Akhir",
        laporanArusKas.totalSaldoAkhir || 0
    ],

    [],

    ["STATUS NERACA"],
    [
        "Selisih",
        laporanNeraca.selisih || 0
    ],
    [
        "Status",
        laporanNeraca.seimbang
            ? "SEIMBANG"
            : "TIDAK SEIMBANG"
    ]

];


// =====================================================
// RINGKASAN PER UNIT USAHA
// =====================================================

rowsRingkasan.push([]);

rowsRingkasan.push([
    "RINGKASAN PER UNIT USAHA"
]);

rowsRingkasan.push([
    "Unit Usaha",
    "Pendapatan",
    "Beban Transaksi",
    "Laba / Rugi"
]);


Object.values(
    laporanLabaRugi.unit || {}
).forEach(unit => {

    rowsRingkasan.push([

        unit.nama || unit.kode || "",

        Number(unit.totalPendapatan) || 0,

        Number(unit.totalBebanTransaksi) || 0,

        Number(unit.labaRugi) || 0

    ]);

});


// =====================================================
// BUAT WORKSHEET
// =====================================================

const worksheetRingkasan =
    XLSX.utils.aoa_to_sheet(rowsRingkasan);

// =====================================================
// FORMAT RINGKASAN
// =====================================================

worksheetRingkasan["A1"].s = {
    font: {
        bold: true,
        sz: 16
    }
};

worksheetRingkasan["A2"].s = {
    font: {
        bold: true,
        sz: 12
    }
};

worksheetRingkasan["A3"].s = {
    font: {
        bold: true,
        sz: 14
    }
};

// =====================================================
// FORMAT ANGKA
// =====================================================

for (
    let baris = 1;
    baris <= rowsRingkasan.length;
    baris++
) {

    const cellB =
        worksheetRingkasan[`B${baris}`];

    if (
        cellB &&
        typeof cellB.v === "number"
    ) {
        cellB.z = '#,##0';
    }

    const cellC =
        worksheetRingkasan[`C${baris}`];

    if (
        cellC &&
        typeof cellC.v === "number"
    ) {
        cellC.z = '#,##0';
    }

    const cellD =
        worksheetRingkasan[`D${baris}`];

    if (
        cellD &&
        typeof cellD.v === "number"
    ) {
        cellD.z = '#,##0';
    }

};


// =====================================================
// LEBAR KOLOM
// =====================================================

worksheetRingkasan["!cols"] = [

    { wch: 35 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 }

];


// =====================================================
// TAMBAHKAN RINGKASAN
// =====================================================

XLSX.utils.book_append_sheet(
    workbook,
    worksheetRingkasan,
    "Ringkasan"
);


// =====================================================
// PINDAHKAN RINGKASAN KE DEPAN
// =====================================================

workbook.SheetNames = [
    "Ringkasan",
    ...workbook.SheetNames.filter(
        nama => nama !== "Ringkasan"
    )
];

        // =====================================================
        // 12. NAMA FILE
        // =====================================================

        const namaFile =
            `Laporan_Keuangan_BUMDes_Sumber_Rejeki_${sampai}.xlsx`;


        // =====================================================
        // 13. DOWNLOAD
        // =====================================================

        XLSX.writeFile(
            workbook,
            namaFile
        );


        console.log(
            "Export Excel Pemasukan berhasil:",
            namaFile
        );

    }

    catch (error) {

        console.error(
            "Gagal Export Excel:",
            error
        );

        alert(
            "Gagal membuat file Excel.\n\n" +
            (error.message || error)
        );

    }

}
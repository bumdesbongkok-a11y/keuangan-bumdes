// =========================================================
// KAS BUMDES
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================================


// =========================================================
// NAMA TAMPIL KAS
// =========================================================

function namaTampilKas(nilai) {
    if (!nilai) return "-";

    const nama = {
        KAS: "Kas",
        BANK: "Bank",
        DANA: "DANA",

        AYAM_PETELUR: "Ayam Petelur",
        PENGELOLAAN_SAMPAH: "Pengelolaan Sampah",
        BANK_SAMPAH: "Bank Sampah",

        4100: "Pendapatan Retribusi Sampah",

        4200: "Penjualan Telur",
        4210: "Penjualan Ayam",
        4220: "Penjualan Kotoran",
        4230: "Pendapatan Lainnya Ayam Petelur",

        5100: "Beban Gaji",
        5110: "Beban BBM",
        5120: "Beban Perawatan",
        5130: "Beban Operasional",

        5200: "Beban Pakan",
        5210: "Beban Vitamin & Obat",
        5220: "Beban Gaji",
        5230: "Beban Listrik",
        5240: "Beban Air",
        5250: "Beban Perawatan",
        5260: "Beban Operasional",
        5270: "Beban Penyusutan",

        5300: "Beban Pembelian Sampah",
        5310: "Beban Gaji",
        5320: "Beban Operasional",
        5330: "Beban Peralatan",

        5400: "Beban Affiliate",
        5410: "Beban Operasional Affiliate"
    };

    return nama[nilai] || nilai;
}


// =========================================================
// TAMPIL DATA KAS
// =========================================================
//
// data         = transaksi sesuai filter
// saldoAwal    = saldo Kas sebelum tanggal mulai filter
// saldoAktual  = saldo Kas keseluruhan / saldo sebenarnya
//
// =========================================================

function tampilKas(
    data,
    saldoAwal = 0,
    saldoAktual = 0
) {
    const area = document.getElementById("daftar-kas");
    const saldoElement = document.getElementById("saldoKas");

    if (!area) return;


    // =====================================================
    // SALDO KAS DI CARD
    // =====================================================
    //
    // Tetap menampilkan saldo Kas sebenarnya,
    // bukan saldo berdasarkan filter.
    //

    if (saldoElement) {
        saldoElement.textContent = formatRupiah(saldoAktual);
    }


    // =====================================================
    // JIKA TIDAK ADA DATA
    // =====================================================

    if (!data || data.length === 0) {
        area.innerHTML = `
            <p class="data-kosong">
                Tidak ada transaksi Kas
                pada periode yang dipilih.
            </p>
        `;

        return;
    }


    // =====================================================
    // SALDO AWAL
    // =====================================================

    let saldo = Number(saldoAwal) || 0;

    let totalMasuk = 0;
    let totalKeluar = 0;


    // =====================================================
    // TABEL
    // =====================================================

    let html = `
        <div class="tabel-scroll">

            <table class="tabel-kas">

                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Keterangan</th>
                        <th>Dari</th>
                        <th>Ke</th>
                        <th>Masuk</th>
                        <th>Keluar</th>
                        <th>Saldo</th>
                    </tr>
                </thead>

                <tbody>
    `;


    // =====================================================
    // DATA TRANSAKSI
    // =====================================================

    data.forEach(function(item) {

        const masuk = Number(item.masuk) || 0;
        const keluar = Number(item.keluar) || 0;


        // Hitung saldo berjalan
        saldo += masuk - keluar;


        // Total periode
        totalMasuk += masuk;
        totalKeluar += keluar;


        html += `
            <tr>

                <td>
                    ${item.tanggal || "-"}
                </td>

                <td>
                    ${item.keterangan || "-"}
                </td>

                <td>
                    ${namaTampilKas(item.dari)}
                </td>

                <td>
                    ${namaTampilKas(item.ke)}
                </td>

                <td class="nominal">
                    ${masuk > 0
                        ? formatRupiah(masuk)
                        : "-"
                    }
                </td>

                <td class="nominal">
                    ${keluar > 0
                        ? formatRupiah(keluar)
                        : "-"
                    }
                </td>

                <td class="nominal">
                    ${formatRupiah(saldo)}
                </td>

            </tr>
        `;
    });


    // =====================================================
    // TOTAL
    // =====================================================

    html += `
                </tbody>

                <tfoot>

                    <tr>

                        <th colspan="4">
                            Total Periode
                        </th>

                        <th class="nominal">
                            ${formatRupiah(totalMasuk)}
                        </th>

                        <th class="nominal">
                            ${formatRupiah(totalKeluar)}
                        </th>

                        <th class="nominal">
                            ${formatRupiah(saldo)}
                        </th>

                    </tr>

                </tfoot>

            </table>

        </div>
    `;


    area.innerHTML = html;
}


// =========================================================
// LOAD DAN TAMPIL KAS
// =========================================================

async function loadDanTampilKas() {

    // =====================================================
    // AMBIL SEMUA DATA KAS
    // =====================================================

    const data = await loadKasFirebase();

    const semuaData = data || [];


    // =====================================================
    // HITUNG SALDO KAS AKTUAL
    // =====================================================
    //
    // Saldo ini tidak terpengaruh filter tanggal.
    //

    const saldoAktual = hitungSaldoKas(semuaData);


    // =====================================================
    // AMBIL INPUT FILTER
    // =====================================================

    const mulaiInput =
        document.getElementById("filterKasMulai");

    const akhirInput =
        document.getElementById("filterKasAkhir");


    // =====================================================
    // DEFAULT FILTER = BULAN BERJALAN
    // =====================================================

    if (
        mulaiInput &&
        akhirInput &&
        (!mulaiInput.value || !akhirInput.value)
    ) {

        const sekarang = new Date();

        const tahun = sekarang.getFullYear();
        const bulan = sekarang.getMonth();


        // Tanggal pertama bulan
        const tanggalMulai =
            new Date(tahun, bulan, 1);


        // Tanggal terakhir bulan
        const tanggalAkhir =
            new Date(tahun, bulan + 1, 0);


        function formatTanggalFilter(tanggal) {

            const yyyy =
                tanggal.getFullYear();

            const mm =
                String(
                    tanggal.getMonth() + 1
                ).padStart(2, "0");

            const dd =
                String(
                    tanggal.getDate()
                ).padStart(2, "0");

            return yyyy + "-" + mm + "-" + dd;
        }


        mulaiInput.value =
            formatTanggalFilter(tanggalMulai);

        akhirInput.value =
            formatTanggalFilter(tanggalAkhir);
    }


    // =====================================================
    // NILAI FILTER
    // =====================================================

    const mulai =
        mulaiInput
            ? mulaiInput.value
            : "";

    const akhir =
        akhirInput
            ? akhirInput.value
            : "";


    // =====================================================
    // FILTER DATA
    // =====================================================

    let hasil = semuaData;


    if (mulai && akhir) {

        hasil = semuaData.filter(function(item) {

            return (
                item.tanggal >= mulai &&
                item.tanggal <= akhir
            );

        });
    }


    // =====================================================
    // URUTKAN TANGGAL
    // TERTUA → TERBARU
    // =====================================================

    hasil.sort(function(a, b) {

        return String(
            a.tanggal || ""
        ).localeCompare(
            String(
                b.tanggal || ""
            )
        );

    });


    // =====================================================
    // HITUNG SALDO AWAL SEBELUM PERIODE
    // =====================================================

    let saldoAwal = 0;


    if (mulai) {

        semuaData.forEach(function(item) {

            if (item.tanggal < mulai) {

                const masuk =
                    Number(item.masuk) || 0;

                const keluar =
                    Number(item.keluar) || 0;


                saldoAwal +=
                    masuk - keluar;
            }

        });
    }


    // =====================================================
    // TAMPILKAN
    // =====================================================

    tampilKas(
        hasil,
        saldoAwal,
        saldoAktual
    );
}


// =========================================================
// FILTER KAS BERDASARKAN TANGGAL
// =========================================================

async function filterKasTanggal() {

    const mulaiInput =
        document.getElementById(
            "filterKasMulai"
        );

    const akhirInput =
        document.getElementById(
            "filterKasAkhir"
        );


    if (!mulaiInput || !akhirInput) {
        return;
    }


    const mulai =
        mulaiInput.value;

    const akhir =
        akhirInput.value;


    // =====================================================
    // VALIDASI
    // =====================================================

    if (!mulai || !akhir) {

        alert(
            "Silakan pilih tanggal mulai dan tanggal akhir."
        );

        return;
    }


    if (mulai > akhir) {

        alert(
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir."
        );

        return;
    }


    // =====================================================
    // TAMPILKAN DATA
    // =====================================================

    await loadDanTampilKas();
}


// =========================================================
// RESET FILTER KAS
// =========================================================

async function resetFilterKas() {

    const mulaiInput =
        document.getElementById(
            "filterKasMulai"
        );

    const akhirInput =
        document.getElementById(
            "filterKasAkhir"
        );


    if (!mulaiInput || !akhirInput) {
        return;
    }


    // =====================================================
    // BULAN BERJALAN
    // =====================================================

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        sekarang.getMonth();


    const tanggalMulai =
        new Date(
            tahun,
            bulan,
            1
        );


    const tanggalAkhir =
        new Date(
            tahun,
            bulan + 1,
            0
        );


    function formatTanggalFilter(tanggal) {

        const yyyy =
            tanggal.getFullYear();

        const mm =
            String(
                tanggal.getMonth() + 1
            ).padStart(2, "0");

        const dd =
            String(
                tanggal.getDate()
            ).padStart(2, "0");

        return yyyy + "-" + mm + "-" + dd;
    }


    // =====================================================
    // SET FILTER KEMBALI KE BULAN INI
    // =====================================================

    mulaiInput.value =
        formatTanggalFilter(
            tanggalMulai
        );

    akhirInput.value =
        formatTanggalFilter(
            tanggalAkhir
        );


    // =====================================================
    // TAMPILKAN KEMBALI
    // =====================================================

    await loadDanTampilKas();
}
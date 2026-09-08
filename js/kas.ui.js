// =========================================
// KAS UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FORMAT NAMA UNTUK TAMPILAN KAS
// =========================================

function namaTampilKas(nilai) {

    if (!nilai) {

        return "-";

    }


    const nama = {

    KAS:
        "Kas",

    BANK:
        "Bank",

    DANA:
        "DANA",

    AYAM_PETELUR:
        "Ayam Petelur",

    PENGELOLAAN_SAMPAH:
        "Pengelolaan Sampah",

    BANK_SAMPAH:
        "Bank Sampah",

    4100:
        "Pendapatan Retribusi Sampah",

    4200:
        "Penjualan Telur",

    4210:
        "Penjualan Ayam",

    4220:
        "Penjualan Kotoran",

    4230:
        "Pendapatan Lainnya Ayam Petelur",

    5100:
        "Beban Gaji",

    5110:
        "Beban BBM",

    5120:
        "Beban Perawatan",

    5130:
        "Beban Operasional",

    5200:
        "Beban Pakan",

    5210:
        "Beban Vitamin & Obat",

    5220:
        "Beban Gaji",

    5230:
        "Beban Listrik",

    5240:
        "Beban Air",

    5250:
        "Beban Perawatan",

    5260:
        "Beban Operasional",

    5270:
        "Beban Penyusutan",

    5300:
        "Beban Pembelian Sampah",

    5310:
        "Beban Gaji",

    5320:
        "Beban Operasional",

    5330:
        "Beban Peralatan",

    5400:
        "Beban Affiliate",

    5410:
        "Beban Operasional Affiliate"

};


    return nama[nilai] || nilai;

}

// =========================================
// TAMPIL DATA KAS
// =========================================

function tampilKas(data) {

    const area =
        document.getElementById(
            "daftar-kas"
        );

    const saldoElement =
        document.getElementById(
            "saldoKas"
        );


    if (!area) {

        return;

    }


    // =====================================
    // DATA KOSONG
    // =====================================

    if (!data || data.length === 0) {

        if (saldoElement) {

            saldoElement.textContent =
                formatRupiah(0);

        }


        area.innerHTML = `

            <p class="data-kosong">
                Belum ada transaksi Kas.
            </p>

        `;

        return;

    }


    // =====================================
    // HITUNG SALDO
    // =====================================

    let saldo = 0;

    let totalMasuk = 0;

    let totalKeluar = 0;


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


    // =====================================
    // DATA SUDAH DIURUTKAN
    // TERLAMA → TERBARU
    // =====================================

    data.forEach(function(item) {

        const masuk =
            Number(item.masuk) || 0;


        const keluar =
            Number(item.keluar) || 0;


        saldo +=
            masuk - keluar;


        totalMasuk +=
            masuk;


        totalKeluar +=
            keluar;


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
                    ${
                        masuk > 0
                            ? formatRupiah(masuk)
                            : "-"
                    }
                </td>

                <td class="nominal">
                    ${
                        keluar > 0
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


    html += `

                </tbody>

                <tfoot>

                    <tr>

                        <th colspan="4">
                            Total
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


    area.innerHTML =
        html;


    // =====================================
    // SALDO UTAMA
    // =====================================

    if (saldoElement) {

        saldoElement.textContent =
            formatRupiah(saldo);

    }

}


// =========================================
// LOAD DAN TAMPILKAN KAS
// =========================================

async function loadDanTampilKas() {

    const data =
        await loadKasFirebase();


    tampilKas(data);

}
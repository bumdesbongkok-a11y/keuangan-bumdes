// =========================================
// BANK UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TAMPIL DATA BANK
// =========================================

function tampilBank(data) {

    const area =
        document.getElementById(
            "daftar-bank"
        );

    const saldoElement =
        document.getElementById(
            "saldoBank"
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
                Belum ada transaksi Bank.
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

            <table class="tabel-bank">

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
    // DATA TERLAMA → TERBARU
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
// LOAD DAN TAMPILKAN BANK
// =========================================

async function loadDanTampilBank() {

    const data =
        await loadBankFirebase();


    tampilBank(data);

}
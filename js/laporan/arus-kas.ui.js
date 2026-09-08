// =========================================
// ARUS KAS UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FORMAT RUPIAH
// =========================================

function rupiahArusKas(nilai) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(
        Number(nilai) || 0
    );

}


// =========================================
// FORMAT TANGGAL
// =========================================

function formatTanggalArusKas(tanggal) {

    if (!tanggal) {

        return "-";

    }


    const bagian =
        String(tanggal)
            .substring(0, 10)
            .split("-");


    if (
        bagian.length !== 3
    ) {

        return tanggal;

    }


    return (

        bagian[2] +
        "/" +
        bagian[1] +
        "/" +
        bagian[0]

    );

}


// =========================================
// TAMPILKAN UI
// =========================================

function tampilkanArusKasUI(data) {

    const area =
        document.getElementById(
            "area-laporan"
        );


    if (!area) {

        console.error(
            "area-laporan tidak ditemukan."
        );

        return;

    }


    if (!data) {

        area.innerHTML = `

            <div class="kartu-laporan">

                <p>
                    Data Arus Kas tidak tersedia.
                </p>

            </div>

        `;

        return;

    }


    // =====================================
    // DATA
    // =====================================

    const periode =
        data.periode || {};


    const saldoAwal =
        data.saldoMediaAwal || {};


    const saldoAkhir =
        data.saldoMediaAkhir || {};


    const pemasukan =
        Array.isArray(
            data.pemasukan
        )
            ? data.pemasukan
            : [];


    const pengeluaran =
        Array.isArray(
            data.pengeluaran
        )
            ? data.pengeluaran
            : [];


    const modalMasuk =
        Array.isArray(
            data.modalMasuk
        )
            ? data.modalMasuk
            : [];


    const modalKeluar =
        Array.isArray(
            data.modalKeluar
        )
            ? data.modalKeluar
            : [];


    const transfer =
        Array.isArray(
            data.transfer
        )
            ? data.transfer
            : [];


    const totalSaldoAwal =
        Number(
            data.totalSaldoAwal
        ) || 0;


    const totalPemasukan =
        Number(
            data.totalPemasukan
        ) || 0;


    const totalPengeluaran =
        Number(
            data.totalPengeluaran
        ) || 0;


    const totalModalMasuk =
        Number(
            data.totalModalMasuk
        ) || 0;


    const totalModalKeluar =
        Number(
            data.totalModalKeluar
        ) || 0;


    const perubahanOperasional =
        Number(
            data.perubahanOperasional
        ) || 0;


    const perubahanPendanaan =
        Number(
            data.perubahanPendanaan
        ) || 0;


    const perubahanKas =
        Number(
            data.perubahanKas
        ) || 0;


    const totalSaldoAkhir =
        Number(
            data.totalSaldoAkhir
        ) || 0;


    // =====================================
    // HTML
    // =====================================

    let html = `

        <div class="kartu-laporan arus-kas-container">

            <div class="header-arus-kas">

                <h3>
                    LAPORAN ARUS KAS
                </h3>

                <div class="nama-bumdes-arus-kas">

                    BUMDes Sumber Rejeki

                </div>

                <div class="periode-arus-kas">

                    Periode:

                    ${formatTanggalArusKas(
                        periode.dari
                    )}

                    s/d

                    ${formatTanggalArusKas(
                        periode.sampai
                    )}

                </div>

            </div>


            <!-- SALDO AWAL -->

            <div class="bagian-arus-kas">

                <div class="judul-bagian-arus-kas">

                    SALDO AWAL

                </div>


                ${barisArusKas(
                    "Kas",
                    saldoAwal.KAS
                )}


                ${barisArusKas(
                    "Bank",
                    saldoAwal.BANK
                )}


                ${barisArusKas(
                    "DANA",
                    saldoAwal.DANA
                )}


                ${barisTotalArusKas(
                    "TOTAL SALDO AWAL",
                    totalSaldoAwal
                )}

            </div>


            <!-- PEMASUKAN -->

            <div class="bagian-arus-kas">

                <div class="judul-bagian-arus-kas">

                    ARUS KAS MASUK

                </div>


                ${barisTotalArusKas(
                    "Total Pemasukan",
                    totalPemasukan,
                    "masuk"
                )}


                <details
                    class="detail-arus-kas"
                >

                    <summary>

                        Rincian transaksi
                        (${pemasukan.length})

                    </summary>

                    <div class="rincian-arus-kas">

    `;


    if (
        pemasukan.length === 0
    ) {

        html += `
            <div class="rincian-kosong-arus-kas">
                Tidak ada transaksi pemasukan.
            </div>
        `;

    } else {

        pemasukan.forEach(
            function(item) {

                html +=
                    itemArusKas(
                        item,
                        "masuk"
                    );

            }
        );

    }


    html += `

                    </div>

                </details>

            </div>


            <!-- PENGELUARAN -->

            <div class="bagian-arus-kas">

                <div class="judul-bagian-arus-kas">

                    ARUS KAS KELUAR

                </div>


                ${barisTotalArusKas(
                    "Total Pengeluaran",
                    totalPengeluaran,
                    "keluar"
                )}


                <details
                    class="detail-arus-kas"
                >

                    <summary>

                        Rincian transaksi
                        (${pengeluaran.length})

                    </summary>

                    <div class="rincian-arus-kas">

    `;


    if (
        pengeluaran.length === 0
    ) {

        html += `
            <div class="rincian-kosong-arus-kas">
                Tidak ada transaksi pengeluaran.
            </div>
        `;

    } else {

        pengeluaran.forEach(
            function(item) {

                html +=
                    itemArusKas(
                        item,
                        "keluar"
                    );

            }
        );

    }


    html += `

                    </div>

                </details>

            </div>


            <!-- PENDANAAN -->

            <div class="bagian-arus-kas">

                <div class="judul-bagian-arus-kas">

                    AKTIVITAS PENDANAAN

                </div>


                ${barisArusKas(
                    "Modal Masuk",
                    totalModalMasuk
                )}


                ${barisArusKas(
                    "Modal Keluar",
                    totalModalKeluar
                )}


                <details
                    class="detail-arus-kas"
                >

                    <summary>
                        Rincian modal
                    </summary>

                    <div class="rincian-arus-kas">

    `;


    modalMasuk.forEach(
        function(item) {

            html +=
                itemArusKas(
                    item,
                    "modal"
                );

        }
    );


    modalKeluar.forEach(
        function(item) {

            html +=
                itemArusKas(
                    item,
                    "modal"
                );

        }
    );


    if (
        modalMasuk.length === 0 &&
        modalKeluar.length === 0
    ) {

        html += `
            <div class="rincian-kosong-arus-kas">
                Tidak ada transaksi modal.
            </div>
        `;

    }


    html += `

                    </div>

                </details>

            </div>


            <!-- TRANSFER -->

            <div class="bagian-arus-kas">

                <div class="judul-bagian-arus-kas">

                    TRANSFER INTERNAL

                </div>


                <div class="catatan-transfer-arus-kas">

                    Transfer antar Kas, Bank,
                    dan DANA tidak dihitung
                    sebagai pemasukan atau
                    pengeluaran.

                </div>


                <details
                    class="detail-arus-kas"
                >

                    <summary>

                        Rincian transfer
                        (${transfer.length})

                    </summary>

                    <div class="rincian-arus-kas">

    `;


    if (
        transfer.length === 0
    ) {

        html += `
            <div class="rincian-kosong-arus-kas">
                Tidak ada transfer internal.
            </div>
        `;

    } else {

        transfer.forEach(
            function(item) {

                html +=
                    itemArusKas(
                        item,
                        "transfer"
                    );

            }
        );

    }


    html += `

                    </div>

                </details>

            </div>


            <!-- PERUBAHAN -->

            <div class="bagian-arus-kas">

                <div class="judul-bagian-arus-kas">

                    PERUBAHAN KAS

                </div>


                ${barisArusKas(
                    "Aktivitas Operasional",
                    perubahanOperasional
                )}


                ${barisArusKas(
                    "Aktivitas Pendanaan",
                    perubahanPendanaan
                )}


                ${barisTotalArusKas(
                    "PERUBAHAN KAS BERSIH",
                    perubahanKas,
                    "hasil"
                )}

            </div>


            <!-- SALDO AKHIR -->

            <div class="total-arus-kas">

                <div class="judul-total-arus-kas">

                    SALDO AKHIR

                </div>


                ${barisArusKas(
                    "Kas",
                    saldoAkhir.KAS
                )}


                ${barisArusKas(
                    "Bank",
                    saldoAkhir.BANK
                )}


                ${barisArusKas(
                    "DANA",
                    saldoAkhir.DANA
                )}


                <div class="hasil-total-arus-kas">

                    <span>
                        TOTAL SALDO AKHIR
                    </span>

                    <strong>
                        ${rupiahArusKas(
                            totalSaldoAkhir
                        )}
                    </strong>

                </div>

            </div>


            <div class="catatan-arus-kas">

                <strong>Catatan:</strong>

                Transfer antar Kas, Bank,
                dan DANA hanya memindahkan
                saldo dan tidak dianggap sebagai
                pendapatan atau beban.

            </div>

        </div>

    `;


    area.innerHTML =
        html;


    pasangStyleArusKasUI();

}


// =========================================
// BARIS
// =========================================

function barisArusKas(
    label,
    nilai
) {

    return `

        <div class="baris-arus-kas">

            <span>
                ${label}
            </span>

            <strong>
                ${rupiahArusKas(nilai)}
            </strong>

        </div>

    `;

}


function barisTotalArusKas(
    label,
    nilai,
    kelas = ""
) {

    return `

        <div class="
            baris-total-arus-kas
            ${kelas}
        ">

            <span>
                ${label}
            </span>

            <strong>
                ${rupiahArusKas(nilai)}
            </strong>

        </div>

    `;

}


// =========================================
// ITEM TRANSAKSI
// =========================================

function itemArusKas(
    item,
    tipe
) {

    let kelas =
        "nilai-normal-arus-kas";


    if (
        tipe === "masuk"
    ) {

        kelas =
            "nilai-masuk-arus-kas";

    }


    if (
        tipe === "keluar"
    ) {

        kelas =
            "nilai-keluar-arus-kas";

    }


    return `

        <div class="transaksi-arus-kas">

            <div>

                <div class="tanggal-arus-kas">

                    ${formatTanggalArusKas(
                        item.tanggal
                    )}

                </div>


                <div class="keterangan-arus-kas">

                    ${item.keterangan || "-"}

                </div>


                <div class="asal-tujuan-arus-kas">

                    ${item.dari || "-"}
                    →
                    ${item.ke || "-"}

                </div>

            </div>


            <strong class="${kelas}">

                ${rupiahArusKas(
                    item.nominal
                )}

            </strong>

        </div>

    `;

}


// =========================================
// CSS
// =========================================

function pasangStyleArusKasUI() {

    if (
        document.getElementById(
            "style-arus-kas-ui"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "style-arus-kas-ui";


    style.textContent = `

        .arus-kas-container {
            width: 100%;
            box-sizing: border-box;
        }


        .header-arus-kas {
            text-align: center;
            margin-bottom: 20px;
        }


        .header-arus-kas h3 {
            margin: 0 0 6px;
            font-size: 20px;
        }


        .nama-bumdes-arus-kas {
            font-weight: 600;
            margin-bottom: 4px;
        }


        .periode-arus-kas {
            font-size: 13px;
            opacity: .7;
        }


        .bagian-arus-kas {
            margin-top: 16px;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
        }


        .judul-bagian-arus-kas {
            padding: 12px 13px;
            font-weight: 700;
            background: #f3f3f3;
            border-bottom: 1px solid #ddd;
        }


        .baris-arus-kas,
        .baris-total-arus-kas {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 10px 13px;
            border-bottom: 1px solid #eee;
        }


        .baris-arus-kas span,
        .baris-total-arus-kas span {
            flex: 1;
        }


        .baris-arus-kas strong,
        .baris-total-arus-kas strong {
            white-space: nowrap;
            text-align: right;
        }


        .baris-total-arus-kas {
            font-weight: 700;
            background: #fafafa;
        }


        .baris-total-arus-kas.masuk {
            background: #e8f5e9;
        }


        .baris-total-arus-kas.keluar {
            background: #ffebee;
        }


        .baris-total-arus-kas.hasil {
            font-size: 15px;
        }


        .nilai-masuk-arus-kas {
            color: #166534;
        }


        .nilai-keluar-arus-kas {
            color: #dc2626;
        }


        .detail-arus-kas {
            padding: 10px 13px;
            border-top: 1px solid #eee;
        }


        .detail-arus-kas summary {
            cursor: pointer;
            font-weight: 600;
        }


        .rincian-arus-kas {
            margin-top: 10px;
        }


        .transaksi-arus-kas {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 9px 0;
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }


        .transaksi-arus-kas > div {
            flex: 1;
        }


        .tanggal-arus-kas {
            font-size: 11px;
            opacity: .6;
        }


        .keterangan-arus-kas {
            font-weight: 600;
            margin-top: 2px;
        }


        .asal-tujuan-arus-kas {
            font-size: 11px;
            opacity: .65;
            margin-top: 2px;
        }


        .transaksi-arus-kas strong {
            white-space: nowrap;
        }


        .rincian-kosong-arus-kas {
            padding: 8px 0;
            font-size: 12px;
            opacity: .6;
        }


        .catatan-transfer-arus-kas,
        .catatan-arus-kas {
            padding: 11px 13px;
            font-size: 12px;
            line-height: 1.5;
        }


        .total-arus-kas {
            margin-top: 20px;
            border: 2px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
        }


        .judul-total-arus-kas {
            padding: 13px;
            font-weight: 700;
            background: #f3f3f3;
        }


        .hasil-total-arus-kas {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 13px;
            font-weight: 700;
            border-top: 2px solid #ddd;
        }


        .hasil-total-arus-kas strong {
            font-size: 18px;
        }


        .catatan-arus-kas {
            margin-top: 14px;
            border-radius: 8px;
            background: #f7f7f7;
        }


        @media (max-width: 430px) {

            .baris-arus-kas,
            .baris-total-arus-kas {
                padding: 9px 10px;
                font-size: 12px;
            }


            .transaksi-arus-kas {
                font-size: 11px;
            }


            .hasil-total-arus-kas {
                padding: 12px 10px;
            }


            .hasil-total-arus-kas strong {
                font-size: 15px;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}
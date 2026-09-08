// =========================================
// LAPORAN UI FINAL
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// TUGAS FILE INI:
// - Menampilkan seluruh laporan
// - Tidak mengambil data Firebase secara langsung
// - Tidak melakukan perhitungan Firebase
// - Semua data diambil melalui file firebase masing-masing
//
// LAPORAN:
// 1. Neraca
// 2. Laba Rugi
// 3. Arus Kas
// 4. Transaksi
// 5. Piutang
// 6. Utang
// 7. Aset
// 8. Modal
//
// =========================================


// =========================================
// FORMAT NOMINAL
// =========================================

function nominalLaporan(nilai) {

    return formatRupiah(
        Number(nilai) || 0
    );

}


// =========================================
// FORMAT PERIODE
// =========================================

function periodeLaporanText() {

    const dari =
        PERIODE_LAPORAN?.dari || "-";

    const sampai =
        PERIODE_LAPORAN?.sampai || "-";

    return (
        dari +
        " s/d " +
        sampai
    );

}


// =========================================
// HEADER LAPORAN
// =========================================

function buatHeaderLaporan(judul) {

    return `

        <div class="judul-laporan">

            <h2>
                BUMDes Sumber Rejeki
            </h2>

            <p>
                Desa Bongkok
            </p>

            <p>
                ${judul}
            </p>

            <p>
                Periode:
                ${periodeLaporanText()}
            </p>

        </div>

    `;

}


// =========================================
// BUKA KARTU LAPORAN
// =========================================

function bukaKartuLaporan(judul) {

    return `

        <div class="kartu-laporan">

            ${buatHeaderLaporan(judul)}

    `;

}


// =========================================
// TUTUP KARTU LAPORAN
// =========================================

function tutupKartuLaporan() {

    return `

        </div>

    `;

}


// =========================================
// BARIS LAPORAN
// =========================================

function buatBarisLaporan(
    label,
    nominal,
    className = ""
) {

    return `

        <tr class="${className}">

            <td>
                ${label}
            </td>

            <td class="nominal">
                ${nominalLaporan(nominal)}
            </td>

        </tr>

    `;

}


// =========================================
// AREA LAPORAN
// =========================================

function ambilAreaLaporan() {

    return document.getElementById(
        "area-laporan"
    );

}


// =========================================
// LOADING
// =========================================

function tampilLoadingLaporan(judul) {

    const area =
        ambilAreaLaporan();

    if (!area) {
        return;
    }

    area.innerHTML = `

        <div class="kartu-laporan">

            ${buatHeaderLaporan(judul)}

            <p class="data-kosong">
                Memuat laporan...
            </p>

        </div>

    `;

}


// =========================================
// ERROR
// =========================================

function tampilErrorLaporan(
    judul,
    error
) {

    const area =
        ambilAreaLaporan();

    if (!area) {
        return;
    }

    console.error(
        "Laporan " + judul + " gagal:",
        error
    );

    area.innerHTML = `

        <div class="kartu-laporan">

            ${buatHeaderLaporan(judul)}

            <p class="data-kosong">
                Gagal memuat laporan.
            </p>

            <p>
                ${
                    error?.message ||
                    "Terjadi kesalahan."
                }
            </p>

        </div>

    `;

}


// =========================================
// NERACA
// =========================================

async function tampilNeraca() {

    const area =
        ambilAreaLaporan();

    if (!area) {
        return;
    }

    tampilLoadingLaporan(
        "NERACA"
    );

    try {

        const data =
            await ambilDataNeracaFirebase(
                PERIODE_LAPORAN.dari,
                PERIODE_LAPORAN.sampai
            );


        let html =
            bukaKartuLaporan(
                "NERACA"
            );


        // =================================
        // ASET
        // =================================

        html += `

            <div class="bagian-laporan">

                <h4>
                    ASET
                </h4>

                <table class="tabel-laporan">

                    <tbody>

                        ${buatBarisLaporan(
                            "Kas",
                            data.kas
                        )}

                        ${buatBarisLaporan(
                            "Bank",
                            data.bank
                        )}

                        ${buatBarisLaporan(
                            "DANA",
                            data.dana
                        )}

                        ${buatBarisLaporan(
                            "Piutang",
                            data.piutang
                        )}

                        ${buatBarisLaporan(
                            "Aset Tetap",
                            data.asetTetap
                        )}

                        ${buatBarisLaporan(
                            "TOTAL ASET",
                            data.totalAset,
                            "baris-total"
                        )}

                    </tbody>

                </table>

            </div>

        `;


        // =================================
        // KEWAJIBAN
        // =================================

        html += `

            <div class="bagian-laporan">

                <h4>
                    KEWAJIBAN
                </h4>

                <table class="tabel-laporan">

                    <tbody>

                        ${buatBarisLaporan(
                            "Utang",
                            data.utang
                        )}

                        ${buatBarisLaporan(
                            "TOTAL KEWAJIBAN",
                            data.utang,
                            "baris-total"
                        )}

                    </tbody>

                </table>

            </div>

        `;


        // =================================
        // EKUITAS
        // =================================

        html += `

            <div class="bagian-laporan">

                <h4>
                    EKUITAS
                </h4>

                <table class="tabel-laporan">

                    <tbody>

                        ${buatBarisLaporan(
                            "Modal",
                            data.modal
                        )}

                        ${buatBarisLaporan(
                            "Laba / Rugi",
                            data.labaRugi
                        )}

                        ${buatBarisLaporan(
                            "TOTAL EKUITAS",
                            data.totalEkuitas,
                            "baris-total"
                        )}

                        ${buatBarisLaporan(
                            "TOTAL KEWAJIBAN + EKUITAS",
                            data.totalKewajibanEkuitas,
                            "baris-total"
                        )}

                    </tbody>

                </table>

            </div>

        `;


        // =================================
        // SELISIH NERACA
        // =================================

        const kelasSelisih =
            Math.abs(
                Number(data.selisih) || 0
            ) < 0.01
                ? "laba-positif"
                : "laba-negatif";


        html += `

            <div class="saldo-laporan ${kelasSelisih}">

                <span>
                    SELISIH NERACA
                </span>

                <strong>
                    ${nominalLaporan(
                        data.selisih
                    )}
                </strong>

            </div>

        `;


        html +=
            tutupKartuLaporan();


        area.innerHTML =
            html;


        console.log(
            "Neraca:",
            data
        );


    } catch (error) {

        tampilErrorLaporan(
            "NERACA",
            error
        );

    }

}


// =========================================
// LABA RUGI
// =========================================

async function tampilLabaRugi() {

    const area =
        ambilAreaLaporan();

    if (!area) {
        return;
    }

    tampilLoadingLaporan(
        "LAPORAN LABA RUGI"
    );

    try {

        const data =
            await ambilLaporanLabaRugiFirebase(
                PERIODE_LAPORAN.dari,
                PERIODE_LAPORAN.sampai
            );


        let html =
            bukaKartuLaporan(
                "LAPORAN LABA RUGI"
            );


        // =================================
        // UNIT USAHA
        // =================================

        Object.keys(
            data.unit || {}
        ).forEach(
            function(kode) {

                const unit =
                    data.unit[kode];


                html += `

                    <div class="bagian-unit-laba-rugi">

                        <h4>
                            ${unit.nama}
                        </h4>

                        <div class="subjudul-laporan">
                            Pendapatan
                        </div>

                        <table class="tabel-laporan">

                            <tbody>

                `;


                const pendapatan =
                    Object.keys(
                        unit.pendapatan || {}
                    );


                if (
                    pendapatan.length === 0
                ) {

                    html += `

                        <tr>

                            <td>
                                Tidak ada pendapatan
                            </td>

                            <td class="nominal">
                                ${nominalLaporan(0)}
                            </td>

                        </tr>

                    `;

                }


                pendapatan.forEach(
                    function(kodeAkun) {

                        html += `

                            <tr>

                                <td>
                                    <strong>
                                        ${kodeAkun}
                                    </strong>
                                    -
                                    ${
                                        unit
                                            .pendapatanNama?.[
                                                kodeAkun
                                            ] ||
                                        kodeAkun
                                    }
                                </td>

                                <td class="nominal">
                                    ${
                                        nominalLaporan(
                                            unit
                                                .pendapatan[
                                                    kodeAkun
                                                ]
                                        )
                                    }
                                </td>

                            </tr>

                        `;

                    }
                );


                html += `

                                <tr class="baris-total">

                                    <td>
                                        Total Pendapatan
                                    </td>

                                    <td class="nominal">
                                        ${
                                            nominalLaporan(
                                                unit.totalPendapatan
                                            )
                                        }
                                    </td>

                                </tr>

                            </tbody>

                        </table>


                        <div class="subjudul-laporan">
                            Beban
                        </div>

                        <table class="tabel-laporan">

                            <tbody>

                `;


                const beban =
                    Object.keys(
                        unit.beban || {}
                    );


                if (
                    beban.length === 0
                ) {

                    html += `

                        <tr>

                            <td>
                                Tidak ada beban
                            </td>

                            <td class="nominal">
                                ${nominalLaporan(0)}
                            </td>

                        </tr>

                    `;

                }


                beban.forEach(
                    function(kodeAkun) {

                        html += `

                            <tr>

                                <td>
                                    <strong>
                                        ${kodeAkun}
                                    </strong>
                                    -
                                    ${
                                        unit
                                            .bebanNama?.[
                                                kodeAkun
                                            ] ||
                                        kodeAkun
                                    }
                                </td>

                                <td class="nominal">
                                    ${
                                        nominalLaporan(
                                            unit
                                                .beban[
                                                    kodeAkun
                                                ]
                                        )
                                    }
                                </td>

                            </tr>

                        `;

                    }
                );


                html += `

                                <tr class="baris-total">

                                    <td>
                                        Total Beban
                                    </td>

                                    <td class="nominal">
                                        ${
                                            nominalLaporan(
                                                unit.totalBeban
                                            )
                                        }
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                `;


                const kelas =
                    Number(unit.laba) >= 0
                        ? "laba-positif"
                        : "laba-negatif";


                html += `

                        <div class="hasil-laba-unit ${kelas}">

                            <span>
                                Laba / Rugi
                                ${unit.nama}
                            </span>

                            <strong>
                                ${nominalLaporan(
                                    unit.laba
                                )}
                            </strong>

                        </div>

                    </div>

                `;

            }
        );


        // =================================
        // RINGKASAN
        // =================================

        const kelasTotal =
            Number(data.labaRugi) >= 0
                ? "laba-positif"
                : "laba-negatif";


        html += `

            <div class="ringkasan-laba-rugi">

                <h4>
                    RINGKASAN BUMDes
                </h4>

                <table class="tabel-laporan">

                    <tbody>

                        ${buatBarisLaporan(
                            "Total Pendapatan",
                            data.totalPendapatan
                        )}

                        ${buatBarisLaporan(
                            "Total Beban",
                            data.totalBeban
                        )}

                        ${buatBarisLaporan(
                            "TOTAL LABA / RUGI BUMDes",
                            data.labaRugi,
                            `baris-laba-total ${kelasTotal}`
                        )}

                    </tbody>

                </table>

            </div>

        `;


        html +=
            tutupKartuLaporan();


        area.innerHTML =
            html;


        console.log(
            "Laba Rugi:",
            data
        );


    } catch (error) {

        tampilErrorLaporan(
            "LABA RUGI",
            error
        );

    }

}


// =========================================
// ARUS KAS
// =========================================

async function tampilArusKas() {

    const area =
        ambilAreaLaporan();

    if (!area) {
        return;
    }

    tampilLoadingLaporan(
        "LAPORAN ARUS KAS"
    );

    try {

        const data =
            await ambilLaporanArusKasFirebase(
                PERIODE_LAPORAN.dari,
                PERIODE_LAPORAN.sampai
            );


        let html =
            bukaKartuLaporan(
                "LAPORAN ARUS KAS"
            );


        html += `

            <table class="tabel-laporan">

                <tbody>

                    ${buatBarisLaporan(
                        "Saldo Awal",
                        data.saldoAwal
                    )}

                    ${buatBarisLaporan(
                        "Uang Masuk",
                        data.uangMasuk
                    )}

                    ${buatBarisLaporan(
                        "Uang Keluar",
                        data.uangKeluar
                    )}

                    ${buatBarisLaporan(
                        "Transfer Antar Media",
                        data.transfer
                    )}

                    ${buatBarisLaporan(
                        "Saldo Akhir",
                        data.saldoAkhir,
                        "baris-total"
                    )}

                </tbody>

            </table>


            <div class="bagian-laporan">

                <h4>
                    RINCIAN SALDO AKHIR
                </h4>

                <table class="tabel-laporan">

                    <tbody>

                        ${buatBarisLaporan(
                            "Kas",
                            data.kas
                        )}

                        ${buatBarisLaporan(
                            "Bank",
                            data.bank
                        )}

                        ${buatBarisLaporan(
                            "DANA",
                            data.dana
                        )}

                        ${buatBarisLaporan(
                            "Saldo Affiliate",
                            data.saldoAffiliate
                        )}

                    </tbody>

                </table>

            </div>

        `;


        html +=
            tutupKartuLaporan();


        area.innerHTML =
            html;


        console.log(
            "Arus Kas:",
            data
        );


    } catch (error) {

        tampilErrorLaporan(
            "ARUS KAS",
            error
        );

    }

}


// =========================================
// LAPORAN TRANSAKSI
// =========================================
//
// STRUKTUR DATA DARI
// ambilLaporanTransaksiFirebase():
//
// {
//     periode: {
//         dari,
//         sampai
//     },
//
//     transaksi: [],
//
//     totalTransaksi: 0,
//
//     totalPemasukan: 0,
//
//     totalPengeluaran: 0,
//
//     totalTransfer: 0
// }
//
// =========================================

async function tampilTransaksiLaporan() {

    const area =
        ambilAreaLaporan();

    if (!area) {
        return;
    }


    tampilLoadingLaporan(
        "LAPORAN TRANSAKSI"
    );


    try {

        const data =
            await ambilLaporanTransaksiFirebase(
                PERIODE_LAPORAN.dari,
                PERIODE_LAPORAN.sampai
            );


        // =================================
        // VALIDASI OBJECT
        // =================================

        if (!data) {

            throw new Error(
                "Data laporan transaksi tidak tersedia."
            );

        }


        // =================================
        // AMBIL ARRAY TRANSAKSI
        // =================================

        const transaksi =
            Array.isArray(
                data.transaksi
            )
                ? data.transaksi
                : [];


        console.log(
            "Laporan transaksi diterima:",
            data
        );


        console.log(
            "Jumlah transaksi:",
            transaksi.length
        );


        // =================================
        // RINGKASAN
        // =================================

        const totalTransaksi =
            Number(
                data.totalTransaksi
            ) || transaksi.length;


        const totalPemasukan =
            Number(
                data.totalPemasukan
            ) || 0;


        const totalPengeluaran =
            Number(
                data.totalPengeluaran
            ) || 0;


        const totalTransfer =
            Number(
                data.totalTransfer
            ) || 0;


        // =================================
        // BUKA LAPORAN
        // =================================

        let html =
            bukaKartuLaporan(
                "LAPORAN TRANSAKSI"
            );


        // =================================
        // RINGKASAN TRANSAKSI
        // =================================

        html += `

            <div class="ringkasan-laporan-transaksi">

                <div class="kartu-ringkasan-laporan">

                    <span>
                        Total Transaksi
                    </span>

                    <strong>
                        ${totalTransaksi}
                    </strong>

                </div>


                <div class="kartu-ringkasan-laporan">

                    <span>
                        Total Pemasukan
                    </span>

                    <strong class="laba-positif">

                        ${nominalLaporan(
                            totalPemasukan
                        )}

                    </strong>

                </div>


                <div class="kartu-ringkasan-laporan">

                    <span>
                        Total Pengeluaran
                    </span>

                    <strong class="laba-negatif">

                        ${nominalLaporan(
                            totalPengeluaran
                        )}

                    </strong>

                </div>


                <div class="kartu-ringkasan-laporan">

                    <span>
                        Total Transfer
                    </span>

                    <strong>

                        ${nominalLaporan(
                            totalTransfer
                        )}

                    </strong>

                </div>

            </div>

        `;


        // =================================
        // TIDAK ADA TRANSAKSI
        // =================================

        if (
            transaksi.length === 0
        ) {

            html += `

                <p class="data-kosong">

                    Tidak ada transaksi
                    pada periode ini.

                </p>

            `;

        }


        // =================================
        // ADA TRANSAKSI
        // =================================

        else {

            html += `

                <div class="tabel-scroll">

                    <table class="tabel-laporan">

                        <thead>

                            <tr>

                                <th>
                                    No
                                </th>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Jenis
                                </th>

                                <th>
                                    Unit Usaha
                                </th>

                                <th>
                                    Akun
                                </th>

                                <th>
                                    Media
                                </th>

                                <th>
                                    Nominal
                                </th>

                                <th>
                                    Keterangan
                                </th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            transaksi.forEach(
                function(item, index) {

                    const jenis =
                        String(
                            item.jenisTransaksi ||
                            item.jenis ||
                            ""
                        ).toUpperCase();


                    // =================================
                    // UNIT USAHA
                    // =================================

                    const namaUnit =
                        (
                            typeof NAMA_UNIT_USAHA !==
                            "undefined" &&
                            NAMA_UNIT_USAHA
                        )
                            ? (
                                NAMA_UNIT_USAHA[
                                    item.unitUsaha
                                ] ||
                                item.unitUsaha ||
                                "-"
                            )
                            : (
                                item.unitUsaha ||
                                "-"
                            );


                    // =================================
                    // MEDIA
                    // =================================

                    let media = "-";


                    if (
                        jenis ===
                        "TRANSFER"
                    ) {

                        media =
                            (
                                item.mediaAsal ||
                                "-"
                            ) +
                            " → " +
                            (
                                item.mediaTujuan ||
                                "-"
                            );

                    }

                    else {

                        media =
                            item.media ||
                            item.mediaTujuan ||
                            item.mediaAsal ||
                            "-";

                    }


                    // =================================
                    // KELAS JENIS
                    // =================================

                    let kelasJenis =
                        "";


                    if (
                        jenis ===
                        "PEMASUKAN"
                    ) {

                        kelasJenis =
                            "laba-positif";

                    }


                    if (
                        jenis ===
                        "PENGELUARAN"
                    ) {

                        kelasJenis =
                            "laba-negatif";

                    }


                    html += `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${item.tanggal || "-"}
                            </td>

                            <td class="${kelasJenis}">
                                ${jenis || "-"}
                            </td>

                            <td>
                                ${namaUnit}
                            </td>

                            <td>
                                ${item.akunKode || "-"}
                            </td>

                            <td>
                                ${media}
                            </td>

                            <td class="nominal">
                                ${nominalLaporan(
                                    item.nominal
                                )}
                            </td>

                            <td>
                                ${item.keterangan || "-"}
                            </td>

                        </tr>

                    `;

                }
            );


            html += `

                        </tbody>

                    </table>

                </div>

            `;

        }


        // =================================
        // TOTAL
        // =================================

        html += `

            <div class="bagian-laporan">

                <h4>
                    RINGKASAN AKHIR
                </h4>

                <table class="tabel-laporan">

                    <tbody>

                        ${buatBarisLaporan(
                            "Total Pemasukan",
                            totalPemasukan
                        )}

                        ${buatBarisLaporan(
                            "Total Pengeluaran",
                            totalPengeluaran
                        )}

                        ${buatBarisLaporan(
                            "Total Transfer",
                            totalTransfer
                        )}

                        ${buatBarisLaporan(
                            "Selisih Pemasukan - Pengeluaran",
                            totalPemasukan -
                            totalPengeluaran,
                            (
                                totalPemasukan -
                                totalPengeluaran
                            ) >= 0
                                ? "laba-positif"
                                : "laba-negatif"
                        )}

                    </tbody>

                </table>

            </div>

        `;


        html +=
            tutupKartuLaporan();


        // =================================
        // TAMPILKAN
        // =================================

        area.innerHTML =
            html;


        pasangStyleLaporanTransaksi();


    } catch (error) {

        tampilErrorLaporan(
            "TRANSAKSI",
            error
        );

    }

}


// =========================================
// STYLE KHUSUS TRANSAKSI
// =========================================

function pasangStyleLaporanTransaksi() {

    if (
        document.getElementById(
            "style-laporan-transaksi"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "style-laporan-transaksi";


    style.textContent = `

        .ringkasan-laporan-transaksi {

            display: grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap: 10px;

            margin-bottom: 18px;

        }


        .kartu-ringkasan-laporan {

            border: 1px solid #ddd;

            border-radius: 10px;

            padding: 12px;

            background: #fff;

        }


        .kartu-ringkasan-laporan span {

            display: block;

            font-size: 12px;

            opacity: .7;

            margin-bottom: 5px;

        }


        .kartu-ringkasan-laporan strong {

            display: block;

            font-size: 14px;

        }


        .tabel-scroll {

            width: 100%;

            overflow-x: auto;

            -webkit-overflow-scrolling: touch;

        }


        .tabel-scroll .tabel-laporan {

            min-width: 850px;

        }


        @media (max-width: 430px) {

            .ringkasan-laporan-transaksi {

                gap: 7px;

            }


            .kartu-ringkasan-laporan {

                padding: 10px;

            }


            .kartu-ringkasan-laporan strong {

                font-size: 12px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// =========================================
// PIUTANG
// LAPORAN PIUTANG
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================

async function tampilPiutangLaporan() {

    const area =
        ambilAreaLaporan();


    if (!area) {

        return;

    }


    // =====================================
    // LOADING
    // =====================================

    tampilLoadingLaporan(
        "LAPORAN PIUTANG"
    );


    try {

        // =================================
        // AMBIL DATA
        // =================================

        const data =
            await ambilLaporanPiutangFirebase(
                PERIODE_LAPORAN.sampai
            );


        // =================================
        // NILAI
        // =================================

        const totalPiutang =
            Number(
                data?.totalPiutang
            ) || 0;


        const totalDibayar =
            Number(
                data?.totalDibayar
            ) || 0;


        const totalSisa =
            Number(
                data?.totalSisa
            ) || 0;


        const jumlahPiutang =
            Number(
                data?.jumlahPiutang
            ) || 0;


        // =================================
        // HEADER
        // =================================

        let html =
            bukaKartuLaporan(
                "LAPORAN PIUTANG"
            );


        // =================================
        // RINGKASAN
        // =================================

        html += `

            <div class="ringkasan-piutang-laporan">


                <div class="kartu-piutang-laporan">

                    <span>
                        Jumlah Piutang
                    </span>

                    <strong>
                        ${jumlahPiutang}
                    </strong>

                </div>


                <div class="kartu-piutang-laporan">

                    <span>
                        Total Piutang
                    </span>

                    <strong>
                        ${nominalLaporan(
                            totalPiutang
                        )}
                    </strong>

                </div>


                <div class="kartu-piutang-laporan">

                    <span>
                        Sudah Dibayar
                    </span>

                    <strong class="piutang-dibayar">

                        ${nominalLaporan(
                            totalDibayar
                        )}

                    </strong>

                </div>


                <div class="kartu-piutang-laporan kartu-sisa-piutang">

                    <span>
                        Sisa Piutang
                    </span>

                    <strong class="${
                        totalSisa > 0
                            ? "piutang-masih-ada"
                            : "piutang-lunas"
                    }">

                        ${nominalLaporan(
                            totalSisa
                        )}

                    </strong>

                </div>


            </div>

        `;


        // =================================
        // DAFTAR PIUTANG
        // =================================

        const daftar =
            Array.isArray(
                data?.data
            )
                ? data.data
                : [];


        html += `

            <div class="bagian-laporan">

                <h4>
                    DAFTAR PIUTANG
                </h4>

        `;


        // =================================
        // TIDAK ADA DATA
        // =================================

        if (
            daftar.length === 0
        ) {

            html += `

                <div class="data-kosong">

                    Tidak ada data piutang
                    pada periode ini.

                </div>

            `;

        }


        // =================================
        // ADA DATA
        // =================================

        else {

            html += `

                <div class="tabel-scroll">

                    <table class="tabel-laporan">

                        <thead>

                            <tr>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Nama
                                </th>

                                <th>
                                    Keterangan
                                </th>

                                <th>
                                    Nominal
                                </th>

                                <th>
                                    Dibayar
                                </th>

                                <th>
                                    Sisa
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            daftar.forEach(
                function(item) {

                    const sisa =
                        Number(
                            item.sisa
                        ) || 0;


                    const status =
                        item.status ||
                        (
                            sisa <= 0
                                ? "LUNAS"
                                : "BELUM LUNAS"
                        );


                    const kelasStatus =
                        sisa <= 0
                            ? "status-piutang-lunas"
                            : "status-piutang-belum-lunas";


                    html += `

                        <tr>

                            <td>

                                ${
                                    item.tanggal ||
                                    "-"
                                }

                            </td>


                            <td>

                                <strong>

                                    ${
                                        item.nama ||
                                        "-"
                                    }

                                </strong>

                            </td>


                            <td>

                                ${
                                    item.keterangan ||
                                    "-"
                                }

                            </td>


                            <td class="nominal">

                                ${
                                    nominalLaporan(
                                        item.nominal
                                    )
                                }

                            </td>


                            <td class="nominal">

                                ${
                                    nominalLaporan(
                                        item.dibayar
                                    )
                                }

                            </td>


                            <td class="nominal">

                                ${
                                    nominalLaporan(
                                        item.sisa
                                    )
                                }

                            </td>


                            <td>

                                <span class="${kelasStatus}">

                                    ${status}

                                </span>

                            </td>

                        </tr>

                    `;

                }
            );


            html += `

                        </tbody>

                    </table>

                </div>

            `;

        }


        html += `

            </div>


            <!-- ==========================
                 KESIMPULAN
            =========================== -->

            <div class="saldo-laporan ${
                totalSisa > 0
                    ? "laba-negatif"
                    : "laba-positif"
            }">

                <span>
                    SISA PIUTANG
                </span>

                <strong>
                    ${nominalLaporan(
                        totalSisa
                    )}
                </strong>

            </div>

        `;


        // =================================
        // TUTUP
        // =================================

        html +=
            tutupKartuLaporan();


        // =================================
        // TAMPILKAN
        // =================================

        area.innerHTML =
            html;


        console.log(
            "Laporan Piutang:",
            data
        );


    } catch (error) {

        tampilErrorLaporan(
            "PIUTANG",
            error
        );

    }

}

// =========================================
// TAMPIL LAPORAN UTANG
// =========================================

async function tampilUtangLaporan() {

    const area =
        ambilAreaLaporan();


    if (!area) {

        return;

    }


    tampilLoadingLaporan(
        "LAPORAN UTANG"
    );


    try {

        // =====================================
        // AMBIL DATA LAPORAN
        // =====================================

        const data =
            await ambilLaporanUtangFirebase(
                PERIODE_LAPORAN.sampai
            );


        // =====================================
        // DATA RINGKASAN
        // =====================================

        const totalUtang =
            Number(
                data?.totalUtang
            ) || 0;


        const totalDibayar =
            Number(
                data?.totalDibayar
            ) || 0;


        const totalSisa =
            Number(
                data?.totalSisa
            ) || 0;


        const jumlahUtang =
            Number(
                data?.jumlahUtang
            ) || 0;


        const daftarUtang =
            Array.isArray(data?.data)
                ? data.data
                : [];


        // =====================================
        // BUKA KARTU
        // =====================================

        let html =
            bukaKartuLaporan(
                "LAPORAN UTANG"
            );


        // =====================================
        // RINGKASAN
        // =====================================

        html += `

            <div class="ringkasan-laporan">

                <div class="kartu-ringkasan">

                    <span>
                        JUMLAH UTANG
                    </span>

                    <strong>
                        ${jumlahUtang}
                    </strong>

                </div>


                <div class="kartu-ringkasan">

                    <span>
                        TOTAL UTANG
                    </span>

                    <strong>
                        ${nominalLaporan(
                            totalUtang
                        )}
                    </strong>

                </div>


                <div class="kartu-ringkasan">

                    <span>
                        SUDAH DIBAYAR
                    </span>

                    <strong>
                        ${nominalLaporan(
                            totalDibayar
                        )}
                    </strong>

                </div>


                <div class="kartu-ringkasan">

                    <span>
                        SISA UTANG
                    </span>

                    <strong>
                        ${nominalLaporan(
                            totalSisa
                        )}
                    </strong>

                </div>

            </div>

        `;


        // =====================================
        // DAFTAR UTANG
        // =====================================

        html += `

            <div class="bagian-laporan">

                <h4>
                    DAFTAR UTANG
                </h4>

        `;


        if (
            daftarUtang.length === 0
        ) {

            html += `

                <p class="data-kosong">

                    Tidak ada data utang
                    pada periode ini.

                </p>

            `;

        } else {

            html += `

                <div class="tabel-scroll">

                    <table class="tabel-laporan">

                        <thead>

                            <tr>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Nama
                                </th>

                                <th>
                                    Keterangan
                                </th>

                                <th>
                                    Nominal
                                </th>

                                <th>
                                    Dibayar
                                </th>

                                <th>
                                    Sisa
                                </th>

                                <th>
                                    Jatuh Tempo
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

            `;


            daftarUtang.forEach(
                function(item) {

                    const sisa =
                        Number(
                            item.sisa
                        ) || 0;


                    const kelasStatus =
                        sisa <= 0
                            ? "status-piutang-lunas"
                            : "status-piutang-belum-lunas";


                    html += `

                        <tr>

                            <td>
                                ${item.tanggal || "-"}
                            </td>

                            <td>
                                ${item.nama || "-"}
                            </td>

                            <td>
                                ${item.keterangan || "-"}
                            </td>

                            <td>
                                ${nominalLaporan(
                                    item.nominal
                                )}
                            </td>

                            <td>
                                ${nominalLaporan(
                                    item.dibayar
                                )}
                            </td>

                            <td>
                                ${nominalLaporan(
                                    item.sisa
                                )}
                            </td>

                            <td>
                                ${item.jatuhTempo || "-"}
                            </td>

                            <td>

                                <span class="${kelasStatus}">

                                    ${item.status || "-"}

                                </span>

                            </td>

                        </tr>

                    `;

                }
            );


            html += `

                        </tbody>

                    </table>

                </div>

            `;

        }


        html += `

            </div>

        `;


        // =====================================
        // SALDO AKHIR
        // =====================================

        html += `

            <div class="saldo-laporan ${
                totalSisa > 0
                    ? "laba-negatif"
                    : "laba-positif"
            }">

                <span>
                    SISA UTANG
                </span>

                <strong>
                    ${nominalLaporan(
                        totalSisa
                    )}
                </strong>

            </div>

        `;


        // =====================================
        // TUTUP KARTU
        // =====================================

        html +=
            tutupKartuLaporan();


        area.innerHTML =
            html;


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "Laporan Utang:",
            data
        );


    } catch (error) {

        console.error(
            "Tampilkan Laporan Utang gagal:",
            error
        );


        tampilErrorLaporan(
            "UTANG",
            error
        );

    }

}


// =========================================
// TAMPIL LAPORAN ASET
// =========================================

async function tampilAsetLaporan() {

    const area =
        ambilAreaLaporan();


    if (!area) {

        return;

    }


    tampilLoadingLaporan(
        "LAPORAN ASET"
    );


    try {

        // =====================================
        // AMBIL DATA LAPORAN
        // =====================================

        const data =
            await ambilLaporanAsetFirebase(
                PERIODE_LAPORAN.sampai
            );


        // =====================================
        // DATA RINGKASAN
        // =====================================

        const jumlahAset =
            Number(
                data?.jumlahAset
            ) || 0;


        const totalNilaiPerolehan =
            Number(
                data?.totalNilaiPerolehan
            ) || 0;


        const totalNilaiBuku =
            Number(
                data?.totalNilaiBuku
            ) || 0;


        const daftarAset =
            Array.isArray(data?.data)
                ? data.data
                : [];


        // =====================================
        // BUKA KARTU
        // =====================================

        let html =
            bukaKartuLaporan(
                "LAPORAN ASET"
            );


        // =====================================
        // RINGKASAN
        // =====================================

        html += `

            <div class="ringkasan-laporan">

                <div class="kartu-ringkasan">

                    <span>
                        JUMLAH ASET
                    </span>

                    <strong>
                        ${jumlahAset}
                    </strong>

                </div>


                <div class="kartu-ringkasan">

                    <span>
                        TOTAL NILAI PEROLEHAN
                    </span>

                    <strong>
                        ${nominalLaporan(
                            totalNilaiPerolehan
                        )}
                    </strong>

                </div>


                <div class="kartu-ringkasan">

                    <span>
                        TOTAL NILAI BUKU
                    </span>

                    <strong>
                        ${nominalLaporan(
                            totalNilaiBuku
                        )}
                    </strong>

                </div>

            </div>

        `;


        // =====================================
        // DAFTAR ASET
        // =====================================

        html += `

            <div class="bagian-laporan">

                <h4>
                    DAFTAR ASET
                </h4>

        `;


        if (
            daftarAset.length === 0
        ) {

            html += `

                <p class="data-kosong">

                    Tidak ada data aset
                    pada periode ini.

                </p>

            `;

        } else {

            html += `

                <div class="tabel-scroll">

                    <table class="tabel-laporan">

                        <thead>

                            <tr>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Nama Aset
                                </th>

                                <th>
                                    Kategori
                                </th>

                                <th>
                                    Keterangan
                                </th>

                                <th>
                                    Nilai Perolehan
                                </th>

                                <th>
                                    Umur Manfaat
                                </th>

                                <th>
                                    Kondisi
                                </th>

                                <th>
                                    Nilai Buku
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

            `;


            daftarAset.forEach(
                function(item) {

                    html += `

                        <tr>

                            <td>
                                ${item.tanggal || "-"}
                            </td>

                            <td>
                                ${item.nama || "-"}
                            </td>

                            <td>
                                ${item.kategori || "-"}
                            </td>

                            <td>
                                ${item.keterangan || "-"}
                            </td>

                            <td>
                                ${nominalLaporan(
                                    item.nilaiPerolehan
                                )}
                            </td>

                            <td>
                                ${
                                    Number(
                                        item.umurManfaat
                                    ) || 0
                                } tahun
                            </td>

                            <td>
                                ${item.kondisi || "-"}
                            </td>

                            <td>
                                ${nominalLaporan(
                                    item.nilaiBuku
                                )}
                            </td>

                            <td>
                                ${item.status || "-"}
                            </td>

                        </tr>

                    `;

                }
            );


            html += `

                        </tbody>

                    </table>

                </div>

            `;

        }


        html += `

            </div>

        `;


        // =====================================
        // TOTAL ASET
        // =====================================

        html += `

            <div class="saldo-laporan laba-positif">

                <span>
                    TOTAL ASET
                </span>

                <strong>
                    ${nominalLaporan(
                        totalNilaiBuku
                    )}
                </strong>

            </div>

        `;


        // =====================================
        // TUTUP KARTU
        // =====================================

        html +=
            tutupKartuLaporan();


        area.innerHTML =
            html;


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "Laporan Aset:",
            data
        );


    } catch (error) {

        console.error(
            "Tampilkan Laporan Aset gagal:",
            error
        );


        tampilErrorLaporan(
            "ASET",
            error
        );

    }

}



// =========================================
// MODAL
// =========================================

async function tampilModalLaporan() {

    const area =
        ambilAreaLaporan();


    if (!area) {

        return;

    }


    tampilLoadingLaporan(
        "LAPORAN MODAL"
    );


    try {

        // =====================================
        // AMBIL DATA
        // =====================================

        const data =
            await ambilLaporanModalFirebase(
                PERIODE_LAPORAN.sampai
            );


        const jumlahModal =
            Number(data.jumlahModal) || 0;


        const totalModal =
            Number(data.totalModal) || 0;


        const daftar =
            Array.isArray(data.data)
                ? data.data
                : [];


        // =====================================
        // HEADER
        // =====================================

        bukaKartuLaporan(
            "LAPORAN MODAL"
        );


        area.innerHTML +=
            buatHeaderLaporan(
                "LAPORAN MODAL"
            );


        // =====================================
        // RINGKASAN
        // =====================================

        area.innerHTML += `

            <div class="laporan-ringkasan">

                <div class="laporan-summary-card">

                    <div class="laporan-summary-label">
                        JUMLAH MODAL
                    </div>

                    <div class="laporan-summary-value">
                        ${jumlahModal}
                    </div>

                </div>


                <div class="laporan-summary-card">

                    <div class="laporan-summary-label">
                        TOTAL MODAL
                    </div>

                    <div class="laporan-summary-value">
                        ${nominalLaporan(totalModal)}
                    </div>

                </div>

            </div>

        `;


        // =====================================
        // DAFTAR MODAL
        // =====================================

        area.innerHTML += `

            <div class="laporan-section">

                <div class="laporan-section-title">
                    DAFTAR MODAL
                </div>


                <div class="laporan-table-wrapper">

                    <table class="laporan-table">

                        <thead>

                            <tr>

                                <th>
                                    Tanggal
                                </th>

                                <th>
                                    Sumber
                                </th>

                                <th>
                                    Jenis
                                </th>

                                <th>
                                    Nominal
                                </th>

                                <th>
                                    Media
                                </th>

                                <th>
                                    Keterangan
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                daftar.length
                                ?
                                daftar.map(function(item) {

                                    return `

                                        <tr>

                                            <td>
                                                ${item.tanggal || "-"}
                                            </td>

                                            <td>
                                                ${item.sumber || "-"}
                                            </td>

                                            <td>
                                                ${item.jenis || "-"}
                                            </td>

                                            <td class="nominal">
                                                ${nominalLaporan(
                                                    item.nominal
                                                )}
                                            </td>

                                            <td>
                                                ${item.media || "-"}
                                            </td>

                                            <td>
                                                ${item.keterangan || "-"}
                                            </td>

                                        </tr>

                                    `;

                                }).join("")

                                :

                                `

                                    <tr>

                                        <td
                                            colspan="6"
                                            style="text-align:center;"
                                        >
                                            Tidak ada data modal
                                        </td>

                                    </tr>

                                `

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        `;


        // =====================================
        // TOTAL
        // =====================================

        area.innerHTML += `

            <div class="saldo-laporan">

                <div class="saldo-laporan-label">
                    TOTAL MODAL
                </div>

                <div class="saldo-laporan-value">
                    ${nominalLaporan(totalModal)}
                </div>

            </div>

        `;


        tutupKartuLaporan();


    } catch (error) {

        console.error(
            "Tampil laporan modal gagal:",
            error
        );


        tampilErrorLaporan(
            "LAPORAN MODAL",
            error
        );

    }

}


// =========================================
// SELESAI
// =========================================


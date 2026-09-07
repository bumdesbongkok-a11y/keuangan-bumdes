// =========================================
// LABA RUGI UI
// KEUANGAN BUMDES SUMBER REJEKI
// PER UNIT USAHA
// =========================================


// =========================================
// FORMAT RUPIAH
// =========================================

function rupiahLabaRugi(nilai) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(Number(nilai) || 0);

}


// =========================================
// FORMAT TANGGAL
// =========================================

function formatTanggalLabaRugi(tanggal) {

    if (!tanggal) {

        return "-";

    }


    const bagian =
        String(tanggal)
            .substring(0, 10)
            .split("-");


    if (bagian.length !== 3) {

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
// TAMPILKAN LABA RUGI
// =========================================

function tampilkanLabaRugiUI(data) {

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

                <p class="data-kosong">
                    Data Laba Rugi tidak tersedia.
                </p>

            </div>

        `;

        return;

    }


    const periode =
        data.periode || {};


    const unit =
        data.unit || {};


    const totalPendapatan =
        Number(
            data.totalPendapatan
        ) || 0;


    const totalBebanTransaksi =
        Number(
            data.totalBebanTransaksi
        ) || 0;


    const totalBebanPenyusutan =
        Number(
            data.depresiasi ??
            data.bebanPenyusutan
        ) || 0;


    const totalBeban =
        Number(
            data.totalBeban
        ) ||
        (
            totalBebanTransaksi +
            totalBebanPenyusutan
        );


    const labaRugi =
        Number(
            data.labaRugi
        ) ||
        (
            totalPendapatan -
            totalBeban
        );


    let html = `

        <div class="kartu-laporan laba-rugi-container">


            <!-- =================================
                 HEADER
            ================================== -->

            <div class="header-laba-rugi">

                <h3>
                    LAPORAN LABA RUGI
                </h3>


                <div class="nama-bumdes-laba-rugi">

                    BUMDes Sumber Rejeki

                </div>


                <div class="periode-laba-rugi">

                    Periode:

                    ${formatTanggalLabaRugi(
                        periode.dari
                    )}

                    s/d

                    ${formatTanggalLabaRugi(
                        periode.sampai
                    )}

                </div>

            </div>

    `;


    // =========================================
    // UNIT USAHA
    // =========================================

    Object.keys(unit || {}).forEach(
        function(kode) {

            const item =
                unit[kode] || {};


            // =================================
            // DATA DASAR UNIT
            // =================================

            const namaUnit =
                item.nama ||
                kode ||
                "-";


            const totalPendapatanUnit =
                Number(
                    item.totalPendapatan
                ) || 0;


            const totalBebanTransaksiUnit =
                Number(
                    item.totalBebanTransaksi
                ) || 0;


            const depresiasiUnit =
                Number(
                    item.depresiasi ??
                    item.bebanPenyusutan
                ) || 0;


            const totalBebanUnit =
                Number(
                    item.totalBeban
                ) ||
                (
                    totalBebanTransaksiUnit +
                    depresiasiUnit
                );


            const hasil =
                Number(
                    item.labaRugi
                ) ||
                (
                    totalPendapatanUnit -
                    totalBebanUnit
                );


            // =================================
            // NORMALISASI PENDAPATAN
            // =================================

            let daftarPendapatan = [];


            if (
                Array.isArray(
                    item.pendapatan
                )
            ) {

                daftarPendapatan =
                    item.pendapatan;

            }


            // =================================
            // NORMALISASI BEBAN
            // =================================

            let daftarBeban = [];


            if (
                Array.isArray(
                    item.beban
                )
            ) {

                daftarBeban =
                    item.beban;

            }


            // =================================
            // STATUS LABA / RUGI
            // =================================

            const kelas =
                hasil >= 0
                    ? "laba-positif"
                    : "laba-negatif";


            const teks =
                hasil >= 0
                    ? "LABA"
                    : "RUGI";


            // =================================
            // HTML UNIT
            // =================================

            html += `

                <div class="bagian-unit-laba-rugi">


                    <!-- =========================
                         NAMA UNIT
                    ========================== -->

                    <div class="judul-unit-laba-rugi">

                        ${namaUnit}

                    </div>


                    <!-- =========================
                         PENDAPATAN
                    ========================== -->

                    <div class="baris-laba-rugi">

                        <span>
                            Pendapatan
                        </span>

                        <strong>
                            ${rupiahLabaRugi(
                                totalPendapatanUnit
                            )}
                        </strong>

                    </div>


                    <!-- =========================
                         BEBAN TRANSAKSI
                    ========================== -->

                    <div class="baris-laba-rugi">

                        <span>
                            Beban Operasional
                        </span>

                        <strong>
                            ${rupiahLabaRugi(
                                totalBebanTransaksiUnit
                            )}
                        </strong>

                    </div>


                    <!-- =========================
                         BEBAN PENYUSUTAN
                    ========================== -->

                    <div class="baris-laba-rugi">

                        <span>
                            Beban Penyusutan
                        </span>

                        <strong>
                            ${rupiahLabaRugi(
                                depresiasiUnit
                            )}
                        </strong>

                    </div>


                    <!-- =========================
                         TOTAL BEBAN
                    ========================== -->

                    <div class="
                        baris-laba-rugi
                        total-beban-unit-laba-rugi
                    ">

                        <span>
                            Total Beban
                        </span>

                        <strong>
                            ${rupiahLabaRugi(
                                totalBebanUnit
                            )}
                        </strong>

                    </div>


                    <!-- =========================
                         LABA / RUGI
                    ========================== -->

                    <div class="
                        baris-laba-rugi
                        hasil-unit-laba-rugi
                        ${kelas}
                    ">

                        <span>
                            ${teks}
                        </span>

                        <strong>
                            ${rupiahLabaRugi(
                                hasil
                            )}
                        </strong>

                    </div>


                    <!-- =========================
                         DETAIL
                    ========================== -->

                    <details
                        class="detail-unit-laba-rugi"
                    >

                        <summary>
                            Rincian transaksi
                        </summary>


                        <div class="rincian-laba-rugi">


                            <!-- =========================
                                 PENDAPATAN
                            ========================== -->

                            <div class="subjudul-rincian">

                                Pendapatan

                            </div>

            `;


            // =================================
            // TAMPIL PENDAPATAN
            // =================================

            if (
                daftarPendapatan.length === 0
            ) {

                html += `

                    <div class="rincian-kosong">

                        Tidak ada pendapatan.

                    </div>

                `;

            } else {

                daftarPendapatan.forEach(
                    function(pendapatan) {

                        const akun =
                            pendapatan?.akun ||
                            pendapatan?.akunKode ||
                            "";


                        const nama =
                            pendapatan?.nama ||
                            pendapatan?.keterangan ||
                            "Pendapatan";


                        const nominal =
                            Number(
                                pendapatan?.nominal
                            ) || 0;


                        html += `

                            <div class="baris-rincian">

                                <span>

                                    ${akun}

                                    ${
                                        akun
                                            ? " - "
                                            : ""
                                    }

                                    ${nama}

                                </span>


                                <strong>

                                    ${rupiahLabaRugi(
                                        nominal
                                    )}

                                </strong>

                            </div>

                        `;

                    }
                );

            }


            // =================================
            // BEBAN TRANSAKSI
            // =================================

            html += `

                            <div class="subjudul-rincian">

                                Beban Operasional

                            </div>

            `;


            // =================================
            // TAMPIL BEBAN TRANSAKSI
            // =================================

            if (
                daftarBeban.length === 0
            ) {

                html += `

                    <div class="rincian-kosong">

                        Tidak ada beban operasional.

                    </div>

                `;

            } else {

                daftarBeban.forEach(
                    function(beban) {

                        const akun =
                            beban?.akun ||
                            beban?.akunKode ||
                            "";


                        const nama =
                            beban?.nama ||
                            beban?.keterangan ||
                            "Beban";


                        const nominal =
                            Number(
                                beban?.nominal
                            ) || 0;


                        html += `

                            <div class="baris-rincian">

                                <span>

                                    ${akun}

                                    ${
                                        akun
                                            ? " - "
                                            : ""
                                    }

                                    ${nama}

                                </span>


                                <strong>

                                    ${rupiahLabaRugi(
                                        nominal
                                    )}

                                </strong>

                            </div>

                        `;

                    }
                );

            }


            // =================================
            // RINCIAN PENYUSUTAN
            // =================================

            html += `

                            <div class="subjudul-rincian">

                                Beban Penyusutan

                            </div>


            `;


            if (
                depresiasiUnit <= 0
            ) {

                html += `

                    <div class="rincian-kosong">

                        Tidak ada beban penyusutan.

                    </div>

                `;

            } else {

                html += `

                    <div class="baris-rincian">

                        <span>

                            Penyusutan aset tetap

                        </span>


                        <strong>

                            ${rupiahLabaRugi(
                                depresiasiUnit
                            )}

                        </strong>

                    </div>

                `;

            }


            // =================================
            // TOTAL BEBAN RINCIAN
            // =================================

            html += `

                            <div class="
                                baris-rincian
                                total-rincian-laba-rugi
                            ">

                                <span>

                                    Total Beban

                                </span>


                                <strong>

                                    ${rupiahLabaRugi(
                                        totalBebanUnit
                                    )}

                                </strong>

                            </div>


                        </div>

                    </details>


                </div>

            `;

        }
    );


    // =========================================
    // TOTAL BUMDES
    // =========================================

    const kelasTotal =
        labaRugi >= 0
            ? "laba-positif"
            : "laba-negatif";


    const teksTotal =
        labaRugi >= 0
            ? "LABA BUMDes"
            : "RUGI BUMDes";


    html += `

        <div class="total-bumdes-laba-rugi">


            <div class="judul-total-laba-rugi">

                TOTAL BUMDes

            </div>


            <!-- =========================
                 TOTAL PENDAPATAN
            ========================== -->

            <div class="baris-laba-rugi">

                <span>

                    Total Pendapatan

                </span>


                <strong>

                    ${rupiahLabaRugi(
                        totalPendapatan
                    )}

                </strong>

            </div>


            <!-- =========================
                 BEBAN TRANSAKSI
            ========================== -->

            <div class="baris-laba-rugi">

                <span>

                    Beban Operasional

                </span>


                <strong>

                    ${rupiahLabaRugi(
                        totalBebanTransaksi
                    )}

                </strong>

            </div>


            <!-- =========================
                 BEBAN PENYUSUTAN
            ========================== -->

            <div class="baris-laba-rugi">

                <span>

                    Beban Penyusutan

                </span>


                <strong>

                    ${rupiahLabaRugi(
                        totalBebanPenyusutan
                    )}

                </strong>

            </div>


            <!-- =========================
                 TOTAL BEBAN
            ========================== -->

            <div class="
                baris-laba-rugi
                total-beban-bumdes-laba-rugi
            ">

                <span>

                    Total Beban

                </span>


                <strong>

                    ${rupiahLabaRugi(
                        totalBeban
                    )}

                </strong>

            </div>


            <!-- =========================
                 LABA / RUGI
            ========================== -->

            <div class="
                hasil-total-laba-rugi
                ${kelasTotal}
            ">

                <span>

                    ${teksTotal}

                </span>


                <strong>

                    ${rupiahLabaRugi(
                        labaRugi
                    )}

                </strong>

            </div>


        </div>


        <!-- =================================
             CATATAN
        ================================== -->

        <div class="catatan-laba-rugi">

            <strong>
                Catatan:
            </strong>

            Modal dan transaksi transfer
            tidak dihitung sebagai pendapatan
            atau beban dalam laporan laba rugi.

            <br><br>

            Beban penyusutan merupakan
            beban non-kas. Penyusutan tidak
            mengurangi saldo Kas, Bank, atau Dana.

        </div>


        </div>

    `;


    area.innerHTML =
        html;


    pasangStyleLabaRugiUI();

}


// =========================================
// CSS
// =========================================

function pasangStyleLabaRugiUI() {

    if (
        document.getElementById(
            "style-laba-rugi-ui"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "style-laba-rugi-ui";


    style.textContent = `

        .laba-rugi-container {
            width: 100%;
            box-sizing: border-box;
        }


        /* =====================================
           HEADER
        ====================================== */

        .header-laba-rugi {
            text-align: center;
            margin-bottom: 20px;
        }


        .header-laba-rugi h3 {
            margin: 0 0 6px;
            font-size: 20px;
        }


        .nama-bumdes-laba-rugi {
            font-weight: 600;
            margin-bottom: 4px;
        }


        .periode-laba-rugi {
            font-size: 13px;
            opacity: .75;
        }


        /* =====================================
           UNIT
        ====================================== */

        .bagian-unit-laba-rugi {

            margin-top: 16px;

            border: 1px solid #ddd;

            border-radius: 10px;

            overflow: hidden;

            background: #fff;

        }


        .judul-unit-laba-rugi {

            padding: 12px 13px;

            font-weight: 700;

            background: #f3f3f3;

            border-bottom: 1px solid #ddd;

        }


        /* =====================================
           BARIS
        ====================================== */

        .baris-laba-rugi {

            display: flex;

            justify-content: space-between;

            align-items: center;

            gap: 12px;

            padding: 10px 13px;

            border-bottom: 1px solid #eee;

        }


        .baris-laba-rugi span {

            flex: 1;

        }


        .baris-laba-rugi strong {

            text-align: right;

            white-space: nowrap;

        }


        /* =====================================
           TOTAL BEBAN
        ====================================== */

        .total-beban-unit-laba-rugi {

            font-weight: 700;

            background: #fafafa;

        }


        .total-beban-bumdes-laba-rugi {

            font-weight: 700;

            background: #fafafa;

        }


        /* =====================================
           HASIL
        ====================================== */

        .hasil-unit-laba-rugi {

            font-weight: 700;

        }


        .laba-positif {

            background: #e8f5e9;

            color: #166534;

        }


        .laba-negatif {

            background: #ffebee;

            color: #dc2626;

        }


        /* =====================================
           DETAIL
        ====================================== */

        .detail-unit-laba-rugi {

            padding: 10px 13px;

            border-top: 1px solid #eee;

        }


        .detail-unit-laba-rugi summary {

            cursor: pointer;

            font-weight: 600;

        }


        .rincian-laba-rugi {

            margin-top: 10px;

        }


        .subjudul-rincian {

            margin-top: 10px;

            margin-bottom: 4px;

            font-weight: 700;

            font-size: 13px;

        }


        .baris-rincian {

            display: flex;

            justify-content: space-between;

            gap: 10px;

            padding: 7px 0;

            border-bottom: 1px solid #eee;

            font-size: 12px;

        }


        .baris-rincian span {

            flex: 1;

        }


        .baris-rincian strong {

            white-space: nowrap;

        }


        .total-rincian-laba-rugi {

            margin-top: 5px;

            padding-top: 9px;

            font-weight: 700;

            border-top: 2px solid #ddd;

        }


        .rincian-kosong {

            font-size: 12px;

            opacity: .65;

            padding: 5px 0;

        }


        /* =====================================
           TOTAL BUMDES
        ====================================== */

        .total-bumdes-laba-rugi {

            margin-top: 20px;

            border: 2px solid #ddd;

            border-radius: 10px;

            overflow: hidden;

        }


        .judul-total-laba-rugi {

            padding: 13px;

            font-weight: 700;

            background: #f3f3f3;

        }


        .hasil-total-laba-rugi {

            display: flex;

            justify-content: space-between;

            align-items: center;

            padding: 15px 13px;

            font-weight: 700;

        }


        .hasil-total-laba-rugi strong {

            font-size: 18px;

        }


        /* =====================================
           CATATAN
        ====================================== */

        .catatan-laba-rugi {

            margin-top: 14px;

            padding: 11px 13px;

            border-radius: 8px;

            background: #f7f7f7;

            font-size: 12px;

            line-height: 1.5;

        }


        /* =====================================
           MOBILE
        ====================================== */

        @media (max-width: 430px) {

            .baris-laba-rugi {

                padding: 9px 10px;

                font-size: 12px;

            }


            .hasil-total-laba-rugi {

                padding: 12px 10px;

            }


            .hasil-total-laba-rugi strong {

                font-size: 15px;

            }


            .baris-rincian {

                font-size: 11px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


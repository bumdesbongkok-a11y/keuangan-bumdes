// =========================================
// NERACA UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================
//
// TUGAS FILE INI:
// - Hanya menampilkan data.
// - Tidak menghitung saldo.
// - Tidak menghitung laba.
// - Tidak memperbaiki selisih.
// - Tidak memaksa Neraca balance.
//
// Sumber data:
// window.ambilDataNeracaFirebase()
// =========================================


// =========================================
// FORMAT RUPIAH
// =========================================

function rupiahNeracaUI(
    nilai
) {

    const angka =
        Number(nilai) || 0;


    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(
        angka
    );

}


// =========================================
// FORMAT TANGGAL
// =========================================

function formatTanggalNeracaUI(
    tanggal
) {

    if (!tanggal) {

        return "-";

    }


    // Firestore Timestamp
    if (
        tanggal &&
        typeof tanggal.toDate === "function"
    ) {

        tanggal =
            tanggal.toDate();

    }


    // Date object
    if (
        tanggal instanceof Date
    ) {

        if (
            isNaN(
                tanggal.getTime()
            )
        ) {

            return "-";

        }


        const tahun =
            tanggal.getFullYear();


        const bulan =
            String(
                tanggal.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const hari =
            String(
                tanggal.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            hari +
            "/" +
            bulan +
            "/" +
            tahun
        );

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
// BARIS NERACA
// =========================================

function barisNeracaUI(
    label,
    nilai,
    classTambahan = ""
) {

    return `

        <div class="
            baris-neraca
            ${classTambahan}
        ">

            <span>
                ${label}
            </span>

            <strong>
                ${rupiahNeracaUI(nilai)}
            </strong>

        </div>

    `;

}


// =========================================
// JUDUL KELOMPOK
// =========================================

function judulKelompokNeracaUI(
    label
) {

    return `

        <div class="subjudul-neraca">

            ${label}

        </div>

    `;

}


// =========================================
// TAMPILKAN NERACA
// =========================================

function tampilkanNeracaUI(
    data
) {

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

                    Data Neraca tidak tersedia.

                </p>

            </div>

        `;

        return;

    }


    // =====================================
    // PERIODE
    // =====================================

    const periode =
        data.periode || {};


    // =====================================
    // AKTIVA LANCAR
    // =====================================

    const aktivaLancar =
        data.aktivaLancar || {};


    const kas =
        Number(
            aktivaLancar.kas
        ) || 0;


    const bank =
        Number(
            aktivaLancar.bank
        ) || 0;


    const dana =
        Number(
            aktivaLancar.dana
        ) || 0;


    const piutang =
        Number(
            aktivaLancar.piutang
        ) || 0;


    const totalAktivaLancar =
        Number(
            aktivaLancar.total
        ) || 0;


    // =====================================
    // AKTIVA TETAP
    // =====================================

    const aktivaTetap =
        data.aktivaTetap || {};


    const hargaPerolehan =
        Number(
            aktivaTetap.hargaPerolehan
        ) || 0;


    const akumulasiPenyusutan =
        Number(
            aktivaTetap.akumulasiPenyusutan
        ) || 0;


    const nilaiBuku =
        Number(
            aktivaTetap.nilaiBuku
        ) || 0;


    const totalAktivaTetap =
        Number(
            aktivaTetap.total
        ) || 0;


    // =====================================
    // TOTAL AKTIVA
    // =====================================

    const totalAktiva =
        Number(
            data.totalAktiva
        ) || 0;


    // =====================================
    // KEWAJIBAN
    // =====================================

    const kewajiban =
        data.kewajiban || {};


    const utang =
        Number(
            kewajiban.utang
        ) || 0;


    const totalKewajiban =
        Number(
            kewajiban.total
        ) || 0;


    // =====================================
    // EKUITAS / MODAL
    // =====================================

    const modalData =
        data.modal || {};


    // Modal disetor / modal awal
    const modalAwal =
        Number(
            modalData.modalAwal
        ) || 0;


    // Saldo laba/rugi tahun sebelumnya
    const saldoLabaSebelumnya =
        Number(
            modalData.saldoLabaSebelumnya
        ) || 0;


    // Laba/rugi tahun berjalan
    const labaRugiOperasional =
        Number(
            modalData.labaRugiOperasional
        ) || 0;


    // Total ekuitas dari Firebase
    const totalModal =
        Number(
            modalData.total
        ) || 0;


    // =====================================
    // TOTAL PASIVA
    // =====================================

    const totalPasiva =
        Number(
            data.totalPasiva
        ) || 0;


    // =====================================
    // SELISIH
    // =====================================

    const selisih =
        Number(
            data.selisih
        ) || 0;


    // =====================================
    // STATUS
    // =====================================

    const seimbang =
        data.seimbang === true;


    const statusClass =
        seimbang
            ? "neraca-seimbang"
            : "neraca-tidak-seimbang";


    const statusText =
        seimbang
            ? "NERACA SEIMBANG"
            : "NERACA BELUM SEIMBANG";


    // =====================================
    // RENDER
    // =====================================

    area.innerHTML = `

        <div class="
            kartu-laporan
            neraca-container
        ">


            <!-- ================================= -->
            <!-- HEADER -->
            <!-- ================================= -->

            <div class="header-neraca">

                <h3>
                    NERACA
                </h3>


                <div class="nama-bumdes-neraca">

                    BUMDes Sumber Rejeki

                </div>


                <div class="periode-neraca">

                    Periode:

                    ${formatTanggalNeracaUI(
                        periode.dari
                    )}

                    s/d

                    ${formatTanggalNeracaUI(
                        periode.sampai
                    )}

                </div>

            </div>



            <!-- ================================= -->
            <!-- DUA KOLOM -->
            <!-- ================================= -->

            <div class="neraca-grid">


                <!-- ================================= -->
                <!-- AKTIVA -->
                <!-- ================================= -->

                <div class="
                    kolom-neraca
                    kolom-aktiva
                ">


                    <div class="
                        kepala-kolom-neraca
                    ">

                        AKTIVA

                    </div>


                    <!-- ========================= -->
                    <!-- AKTIVA LANCAR -->
                    <!-- ========================= -->

                    <div class="
                        kelompok-neraca
                    ">

                        ${judulKelompokNeracaUI(
                            "Aktiva Lancar"
                        )}


                        ${barisNeracaUI(
                            "Kas",
                            kas
                        )}


                        ${barisNeracaUI(
                            "Bank",
                            bank
                        )}


                        ${barisNeracaUI(
                            "Dana",
                            dana
                        )}


                        ${barisNeracaUI(
                            "Piutang",
                            piutang
                        )}


                        ${barisNeracaUI(
                            "Jumlah Aktiva Lancar",
                            totalAktivaLancar,
                            "total-neraca"
                        )}

                    </div>



                    <!-- ========================= -->
                    <!-- AKTIVA TETAP -->
                    <!-- ========================= -->

                    <div class="
                        kelompok-neraca
                    ">

                        ${judulKelompokNeracaUI(
                            "Aktiva Tetap"
                        )}


                        ${barisNeracaUI(
                            "Aset Tetap",
                            hargaPerolehan
                        )}


                        ${barisNeracaUI(
                            "Akumulasi Penyusutan",
                            -akumulasiPenyusutan,
                            "nilai-negatif"
                        )}


                        ${barisNeracaUI(
                            "Jumlah Aktiva Tetap",
                            totalAktivaTetap,
                            "total-neraca"
                        )}

                    </div>



                    <!-- ========================= -->
                    <!-- TOTAL AKTIVA -->
                    <!-- ========================= -->

                    <div class="
                        total-besar-neraca
                    ">

                        ${barisNeracaUI(
                            "JUMLAH AKTIVA",
                            totalAktiva
                        )}

                    </div>

                </div>



                <!-- ================================= -->
                <!-- PASIVA -->
                <!-- ================================= -->

                <div class="
                    kolom-neraca
                    kolom-pasiva
                ">


                    <div class="
                        kepala-kolom-neraca
                    ">

                        PASIVA

                    </div>


                    <!-- ========================= -->
                    <!-- KEWAJIBAN -->
                    <!-- ========================= -->

                    <div class="
                        kelompok-neraca
                    ">

                        ${judulKelompokNeracaUI(
                            "Kewajiban"
                        )}


                        ${barisNeracaUI(
                            "Hutang",
                            utang
                        )}


                        ${barisNeracaUI(
                            "Jumlah Kewajiban",
                            totalKewajiban,
                            "total-neraca"
                        )}

                    </div>



                    <!-- ========================= -->
                    <!-- EKUITAS -->
                    <!-- ========================= -->

                    <div class="
                        kelompok-neraca
                    ">

                        ${judulKelompokNeracaUI(
                            "Ekuitas"
                        )}


                        ${barisNeracaUI(
                            "Modal Disetor",
                            modalAwal
                        )}


                        ${barisNeracaUI(
                            "Saldo Laba / Rugi Tahun Sebelumnya",
                            saldoLabaSebelumnya,
                            saldoLabaSebelumnya < 0
                                ? "nilai-negatif"
                                : ""
                        )}


                        ${barisNeracaUI(
                            "Laba / Rugi Tahun Berjalan",
                            labaRugiOperasional,
                            labaRugiOperasional < 0
                                ? "nilai-negatif"
                                : ""
                        )}


                        ${barisNeracaUI(
                            "Jumlah Ekuitas",
                            totalModal,
                            "total-neraca"
                        )}

                    </div>



                    <!-- ========================= -->
                    <!-- TOTAL PASIVA -->
                    <!-- ========================= -->

                    <div class="
                        total-besar-neraca
                    ">

                        ${barisNeracaUI(
                            "JUMLAH PASIVA",
                            totalPasiva
                        )}

                    </div>

                </div>

            </div>



            <!-- ================================= -->
            <!-- REKONSILIASI -->
            <!-- ================================= -->

            <div class="
                rekonsiliasi-neraca
            ">


                ${barisNeracaUI(
                    "Selisih Neraca",
                    selisih,
                    "selisih-neraca"
                )}


                <div class="
                    status-neraca
                    ${statusClass}
                ">

                    ${statusText}

                </div>

            </div>



            <!-- ================================= -->
            <!-- INFORMASI TAMBAHAN -->
            <!-- ================================= -->

            <details class="
                detail-neraca
            ">

                <summary>
                    Informasi Tambahan
                </summary>


                ${barisNeracaUI(
                    "Pendapatan Periode",
                    data.labaRugi?.pendapatan
                )}


                ${barisNeracaUI(
                    "Beban Periode",
                    data.labaRugi?.beban
                )}


                ${barisNeracaUI(
                    "Depresiasi Periode",
                    data.labaRugi?.depresiasi
                )}


                ${barisNeracaUI(
                    "Saldo Affiliate",
                    data.saldoAffiliate
                )}


                ${barisNeracaUI(
                    "Total Media Uang",
                    data.totalMediaUang
                )}


                ${barisNeracaUI(
                    "Jumlah Aset Tetap",
                    data.jumlahAsetTetap
                )}


                ${barisNeracaUI(
                    "Nilai Buku Aset Tetap",
                    nilaiBuku
                )}

            </details>


        </div>

    `;


    // =====================================
    // PASANG CSS
    // =====================================

    pasangStyleNeracaUI();

}


// =========================================
// CSS NERACA
// =========================================

function pasangStyleNeracaUI() {

    if (
        document.getElementById(
            "style-neraca-ui"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "style-neraca-ui";


    style.textContent = `

        /* =====================================
           CONTAINER
        ===================================== */

        .neraca-container {

            width: 100%;

            box-sizing: border-box;

            font-size: 13px;

        }



        /* =====================================
           HEADER
        ===================================== */

        .header-neraca {

            text-align: center;

            margin-bottom: 16px;

        }


        .header-neraca h3 {

            margin:
                0 0 5px;

            font-size:
                18px;

        }


        .nama-bumdes-neraca {

            font-weight:
                600;

            font-size:
                14px;

            margin-bottom:
                4px;

        }


        .periode-neraca {

            font-size:
                12px;

            opacity:
                0.75;

        }



        /* =====================================
           GRID
        ===================================== */

        .neraca-grid {

            display:
                grid;

            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr);

            gap:
                10px;

            align-items:
                stretch;

        }



        /* =====================================
           KOLOM
        ===================================== */

        .kolom-neraca {

            min-width:
                0;

            border:
                1px solid #ddd;

            border-radius:
                8px;

            overflow:
                hidden;

            background:
                #fff;

        }



        /* =====================================
           KEPALA KOLOM
        ===================================== */

        .kepala-kolom-neraca {

            padding:
                9px 10px;

            text-align:
                center;

            font-weight:
                800;

            font-size:
                14px;

            background:
                #f3f3f3;

            border-bottom:
                1px solid #ddd;

        }



        /* =====================================
           KELOMPOK
        ===================================== */

        .kelompok-neraca {

            margin:
                10px;

            border:
                1px solid #e2e2e2;

            border-radius:
                7px;

            overflow:
                hidden;

            min-width:
                0;

        }



        /* =====================================
           SUBJUDUL
        ===================================== */

        .subjudul-neraca {

            padding:
                8px 9px;

            font-weight:
                700;

            font-size:
                12px;

            background:
                #f7f7f7;

            border-bottom:
                1px solid #e5e5e5;

        }



        /* =====================================
           BARIS
        ===================================== */

        .baris-neraca {

            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            gap:
                8px;

            padding:
                7px 9px;

            border-bottom:
                1px solid #eee;

            min-width:
                0;

        }


        /* LABEL */

        .baris-neraca span {

            flex:
                1 1 auto;

            min-width:
                0;

            font-size:
                12px;

            line-height:
                1.35;

            overflow-wrap:
                break-word;

        }


        /* NOMINAL */

        .baris-neraca strong {

            flex:
                0 0 auto;

            text-align:
                right;

            white-space:
                nowrap;

            font-size:
                12px;

            line-height:
                1.35;

        }


        .baris-neraca:last-child {

            border-bottom:
                none;

        }



        /* =====================================
           TOTAL
        ===================================== */

        .total-neraca {

            font-weight:
                700;

            background:
                #fafafa;

        }


        .total-neraca span {

            font-weight:
                700;

        }


        .total-neraca strong {

            font-weight:
                700;

        }



        /* =====================================
           TOTAL BESAR
        ===================================== */

        .total-besar-neraca {

            margin:
                10px;

            border-top:
                2px solid #333;

            border-bottom:
                2px solid #333;

            font-weight:
                800;

            min-width:
                0;

        }


        .total-besar-neraca
        .baris-neraca {

            border-bottom:
                none;

            padding:
                9px;

            gap:
                6px;

        }


        .total-besar-neraca
        .baris-neraca span {

            font-size:
                12px;

            font-weight:
                800;

        }


        .total-besar-neraca
        .baris-neraca strong {

            font-size:
                12px;

            font-weight:
                800;

        }



        /* =====================================
           NILAI NEGATIF
        ===================================== */

        .nilai-negatif strong {

            font-weight:
                700;

        }



        /* =====================================
           REKONSILIASI
        ===================================== */

        .rekonsiliasi-neraca {

            margin-top:
                14px;

        }


        .selisih-neraca {

            font-weight:
                800;

            border:
                1px solid #ddd;

            border-radius:
                7px;

            background:
                #fafafa;

        }



        /* =====================================
           STATUS
        ===================================== */

        .status-neraca {

            margin-top:
                10px;

            padding:
                10px;

            text-align:
                center;

            border-radius:
                8px;

            font-size:
                12px;

            font-weight:
                800;

        }


        .neraca-seimbang {

            background:
                #e8f5e9;

            border:
                1px solid #a5d6a7;

        }


        .neraca-tidak-seimbang {

            background:
                #ffebee;

            border:
                1px solid #ef9a9a;

        }



        /* =====================================
           DETAIL
        ===================================== */

        .detail-neraca {

            margin-top:
                12px;

            border:
                1px solid #ddd;

            border-radius:
                8px;

            padding:
                8px 10px;

            font-size:
                12px;

        }


        .detail-neraca summary {

            cursor:
                pointer;

            font-weight:
                600;

        }



        /* =====================================
           TABLET / DESKTOP
        ===================================== */

        @media (
            min-width: 701px
        ) {

            .baris-neraca span {

                font-size:
                    13px;

            }


            .baris-neraca strong {

                font-size:
                    13px;

            }

        }



        /* =====================================
           MOBILE
        ===================================== */

        @media (
            max-width: 700px
        ) {

            .neraca-grid {

                grid-template-columns:
                    1fr;

            }

        }



        /* =====================================
           HP KECIL
        ===================================== */

        @media (
            max-width: 430px
        ) {

            .neraca-container {

                font-size:
                    12px;

            }


            .neraca-grid {

                gap:
                    8px;

            }


            .kepala-kolom-neraca {

                padding:
                    8px;

                font-size:
                    13px;

            }


            .kelompok-neraca {

                margin:
                    8px;

            }


            .total-besar-neraca {

                margin:
                    8px;

            }


            .baris-neraca {

                padding:
                    7px 8px;

                gap:
                    6px;

            }


            .baris-neraca span {

                font-size:
                    11px;

            }


            .baris-neraca strong {

                font-size:
                    11px;

            }


            .total-besar-neraca
            .baris-neraca span {

                font-size:
                    11px;

            }


            .total-besar-neraca
            .baris-neraca strong {

                font-size:
                    11px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// =========================================
// EXPORT / GLOBAL
// =========================================

window.tampilkanNeracaUI =
    tampilkanNeracaUI;


console.log(
    "NERACA UI SIAP"
);
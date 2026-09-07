// =========================================
// NERACA JS
// KEUANGAN BUMDES SUMBER REJEKI
// FINAL
// =========================================


// =========================================
// DATA GLOBAL NERACA
// =========================================

let DATA_NERACA = null;


// =========================================
// FORMAT RUPIAH
// =========================================

function formatRupiahNeraca(nilai) {

    const angka =
        Number(nilai) || 0;

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(angka);

}


// =========================================
// AMBIL PERIODE DARI LAPORAN
// =========================================

function ambilPeriodeNeraca() {

    const dari =
        document.getElementById(
            "laporanDari"
        )?.value || "";

    const sampai =
        document.getElementById(
            "laporanSampai"
        )?.value || "";


    return {

        dari:
            dari,

        sampai:
            sampai

    };

}


// =========================================
// TAMPIL NERACA
// =========================================

async function tampilNeraca() {

    console.log(
        "Memuat Neraca..."
    );


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


    // =====================================
    // AMBIL PERIODE
    // =====================================

    const periode =
        ambilPeriodeNeraca();


    if (
        !periode.dari ||
        !periode.sampai
    ) {

        area.innerHTML = `

            <div class="kartu-laporan">

                <p class="data-kosong">

                    Periode laporan belum lengkap.

                </p>

            </div>

        `;

        return;

    }


    // =====================================
    // LOADING
    // =====================================

    area.innerHTML = `

        <div class="kartu-laporan">

            <p class="data-kosong">

                Memuat Neraca...

            </p>

        </div>

    `;


    try {

        // =================================
        // AMBIL DATA FIREBASE
        // =================================

        const data =
            await ambilDataNeracaFirebase(
                periode.dari,
                periode.sampai
            );


        if (!data) {

            throw new Error(
                "Data Neraca tidak tersedia."
            );

        }


        // =================================
        // SIMPAN DATA GLOBAL
        // =================================

        DATA_NERACA =
            data;


        console.log(
            "DATA NERACA:",
            DATA_NERACA
        );


        // =================================
        // TAMPILKAN UI
        // =================================

        if (
            typeof tampilkanNeracaUI ===
            "function"
        ) {

            tampilkanNeracaUI(
                DATA_NERACA
            );

            return;

        }


        throw new Error(
            "Fungsi tampilkanNeracaUI() belum tersedia."
        );


    } catch (error) {

        console.error(
            "Gagal memuat Neraca:",
            error
        );


        area.innerHTML = `

            <div class="kartu-laporan">

                <h3>
                    Neraca
                </h3>

                <p class="data-kosong">

                    Neraca gagal dimuat.

                </p>

                <p>

                    ${error.message}

                </p>

            </div>

        `;

    }

}


// =========================================
// REFRESH NERACA
// =========================================

async function refreshNeraca() {

    await tampilNeraca();

}


// =========================================
// EXPORT DATA NERACA
// =========================================

function getDataNeraca() {

    return DATA_NERACA;

}


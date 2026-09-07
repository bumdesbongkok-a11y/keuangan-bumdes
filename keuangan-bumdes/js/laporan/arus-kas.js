// =========================================
// ARUS KAS
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TAMPIL LAPORAN ARUS KAS
// =========================================

async function tampilArusKas() {

    try {

        const periode =
            ambilPeriodeLaporan();


        if (!periode) {

            return;

        }


        console.log(
            "Menampilkan Arus Kas:",
            periode.dari,
            periode.sampai
        );


        const data =
            await ambilLaporanArusKasFirebase(
                periode.dari,
                periode.sampai
            );


        tampilkanArusKasUI(
            data
        );


    } catch (error) {

        console.error(
            "Tampilkan Arus Kas gagal:",
            error
        );


        const area =
            document.getElementById(
                "area-laporan"
            );


        if (area) {

            area.innerHTML = `

                <div class="kartu-laporan">

                    <h3>
                        LAPORAN ARUS KAS
                    </h3>

                    <p class="data-kosong">
                        Laporan Arus Kas gagal dimuat.
                    </p>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }

    }

}


// =========================================
// SIAPKAN HALAMAN
// =========================================

function siapkanHalamanArusKas() {

    console.log(
        "Halaman Arus Kas siap."
    );

}
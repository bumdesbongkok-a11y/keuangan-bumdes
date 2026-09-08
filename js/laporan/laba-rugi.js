// =========================================
// LABA RUGI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TAMPIL LABA RUGI
// =========================================

async function tampilLabaRugi() {

    try {

        // =====================================
        // AMBIL PERIODE
        // =====================================

        const periode =
            ambilPeriodeLaporan();


        if (!periode) {

            return;

        }


        const dari =
            periode.dari;


        const sampai =
            periode.sampai;


        // =====================================
        // AMBIL DATA FIREBASE
        // =====================================

        const data =
            await ambilLaporanLabaRugiFirebase(
                dari,
                sampai
            );


        // =====================================
        // TAMPILKAN UI
        // =====================================

        tampilkanLabaRugiUI(
            data
        );


    } catch (error) {

        console.error(
            "Tampilkan Laba Rugi gagal:",
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
                        Laporan Laba Rugi
                    </h3>

                    <p class="data-kosong">

                        Laporan Laba Rugi gagal
                        dimuat.

                    </p>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }

    }

}
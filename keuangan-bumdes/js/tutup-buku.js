// =========================================
// TUTUP BUKU
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


let PERIODE_TUTUP_BUKU = {

    dari: "",
    sampai: ""

};


let DATA_TUTUP_BUKU = null;


// =========================================
// SIAPKAN HALAMAN
// =========================================

async function siapkanHalamanTutupBuku() {

    const inputDari =
        document.getElementById(
            "tutupBukuDari"
        );


    const inputSampai =
        document.getElementById(
            "tutupBukuSampai"
        );


    if (!inputDari || !inputSampai) {

        return;

    }


    // =====================================
    // DEFAULT PERIODE
    // BULAN BERJALAN
    // =====================================

    const sekarang =
        new Date();


    const tahun =
        sekarang.getFullYear();


    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const hari =
        String(
            sekarang.getDate()
        ).padStart(
            2,
            "0"
        );


    const tanggalHariIni =
        tahun +
        "-" +
        bulan +
        "-" +
        hari;


    const tanggalAwal =
        tahun +
        "-" +
        bulan +
        "-01";


    if (!inputDari.value) {

        inputDari.value =
            tanggalAwal;

    }


    if (!inputSampai.value) {

        inputSampai.value =
            tanggalHariIni;

    }


    resetTampilanTutupBuku();


    // =====================================
    // LOAD RIWAYAT
    // =====================================

    await tampilRiwayatTutupBuku();

}


// =========================================
// RESET TAMPILAN
// =========================================

function resetTampilanTutupBuku() {

    const status =
        document.getElementById(
            "status-tutup-buku"
        );


    const ringkasan =
        document.getElementById(
            "ringkasan-tutup-buku"
        );


    const hasil =
        document.getElementById(
            "hasil-tutup-buku"
        );


    const tombol =
        document.getElementById(
            "btn-tutup-buku"
        );


    if (status) {

        status.innerHTML = `
            <p class="data-kosong">
                Pilih periode terlebih dahulu.
            </p>
        `;

    }


    if (ringkasan) {

        ringkasan.innerHTML = `
            <p class="data-kosong">
                Belum ada data yang diperiksa.
            </p>
        `;

    }


    if (hasil) {

        hasil.innerHTML = "";

    }


    if (tombol) {

        tombol.disabled = true;

    }


    DATA_TUTUP_BUKU = null;

}


// =========================================
// PERIKSA TUTUP BUKU
// =========================================

async function periksaTutupBuku() {

    const inputDari =
        document.getElementById(
            "tutupBukuDari"
        );


    const inputSampai =
        document.getElementById(
            "tutupBukuSampai"
        );


    if (!inputDari || !inputSampai) {

        return;

    }


    const dari =
        inputDari.value;


    const sampai =
        inputSampai.value;


    // =====================================
    // VALIDASI
    // =====================================

    if (!dari || !sampai) {

        tampilPesanTutupBuku(
            "Tanggal periode belum lengkap.",
            "error"
        );

        return;

    }


    if (dari > sampai) {

        tampilPesanTutupBuku(
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.",
            "error"
        );

        return;

    }


    PERIODE_TUTUP_BUKU = {

        dari:
            dari,

        sampai:
            sampai

    };


    DATA_TUTUP_BUKU = null;


    const tombol =
        document.getElementById(
            "btn-tutup-buku"
        );


    if (tombol) {

        tombol.disabled = true;

    }


    tampilStatusTutupBuku(
        "MEMERIKSA PERIODE",
        "Mengambil data laporan untuk periode yang dipilih..."
    );


    try {

        // =================================
        // CEK SUDAH DITUTUP
        // =================================

        const sudahDitutup =
            await cekTutupBukuFirebase(
                dari,
                sampai
            );


        if (sudahDitutup) {

            tampilStatusTutupBuku(
                "SUDAH DITUTUP",
                "Periode ini sudah pernah ditutup buku."
            );


            tampilPesanTutupBuku(
                "Periode tersebut sudah pernah ditutup buku.",
                "warning"
            );


            return;

        }


        // =================================
        // CEK PERIODE BERTABRAKAN
        // =================================

        const tanggalTerkunciAwal =
            await cekTanggalTerkunciFirebase(
                dari
            );


        const tanggalTerkunciAkhir =
            await cekTanggalTerkunciFirebase(
                sampai
            );


        if (
            tanggalTerkunciAwal ||
            tanggalTerkunciAkhir
        ) {

            tampilStatusTutupBuku(
                "PERIODE TERKUNCI",
                "Sebagian periode yang dipilih sudah termasuk Tutup Buku."
            );


            tampilPesanTutupBuku(
                "Periode yang dipilih bertabrakan dengan periode Tutup Buku yang sudah ada.",
                "warning"
            );


            return;

        }


        // =================================
        // AMBIL SEMUA LAPORAN
        // =================================

        const [

            hasilLabaRugi,

            hasilArusKas,

            hasilPiutang,

            hasilUtang,

            hasilAset,

            hasilModal

        ] = await Promise.all([

            ambilLaporanLabaRugiFirebase(
                dari,
                sampai
            ),

            ambilLaporanArusKasFirebase(
                dari,
                sampai
            ),

            ambilLaporanPiutangFirebase(
                sampai
            ),

            ambilLaporanUtangFirebase(
                sampai
            ),

            ambilLaporanAsetFirebase(
                sampai
            ),

            ambilLaporanModalFirebase(
                sampai
            )

        ]);


        // =================================
        // SIMPAN HASIL LAPORAN DI MEMORY
        // =================================

        DATA_TUTUP_BUKU = {

            dari:
                dari,

            sampai:
                sampai,

            status:
                "SIAP DITUTUP",

            labaRugi:
                hasilLabaRugi,

            arusKas:
                hasilArusKas,

            piutang:
                hasilPiutang,

            utang:
                hasilUtang,

            aset:
                hasilAset,

            modal:
                hasilModal

        };


        // =================================
        // TAMPILKAN
        // =================================

        tampilStatusTutupBuku(
            "SIAP DITUTUP",
            "Seluruh data laporan periode berhasil diperiksa."
        );


        tampilRingkasanTutupBuku(
            DATA_TUTUP_BUKU
        );


        tampilHasilTutupBuku(
            DATA_TUTUP_BUKU
        );


        if (tombol) {

            tombol.disabled = false;

        }


        tampilPesanTutupBuku(
            "Data laporan berhasil diperiksa. Periode siap ditutup buku.",
            "success"
        );


    } catch (error) {

        console.error(
            "Periksa tutup buku gagal:",
            error
        );


        tampilStatusTutupBuku(
            "GAGAL",
            "Data laporan tidak berhasil diambil."
        );


        tampilPesanTutupBuku(
            error.message ||
            "Gagal mengambil data laporan.",
            "error"
        );

    }

}


// =========================================
// STATUS
// =========================================

function tampilStatusTutupBuku(
    judul,
    keterangan
) {

    const area =
        document.getElementById(
            "status-tutup-buku"
        );


    if (!area) {

        return;

    }


    area.innerHTML = `

        <div>

            <strong>
                ${judul}
            </strong>

            <p>
                ${keterangan}
            </p>

        </div>

    `;

}


// =========================================
// RINGKASAN TUTUP BUKU
// =========================================

function tampilRingkasanTutupBuku(
    data
) {

    const area =
        document.getElementById(
            "ringkasan-tutup-buku"
        );


    if (!area || !data) {

        return;

    }


    const labaRugi =
        data.labaRugi || {};


    const arusKas =
        data.arusKas || {};


    const piutang =
        data.piutang || {};


    const utang =
        data.utang || {};


    const aset =
        data.aset || {};


    const modal =
        data.modal || {};


    const laba =
        Number(
            labaRugi.labaRugi
        ) || 0;


    const kelasLaba =
        laba >= 0
            ? "laba-positif"
            : "laba-negatif";


    area.innerHTML = `

        <div class="kartu-laporan">

            <h3>
                Ringkasan Tutup Buku
            </h3>

            <p>
                Periode:
                <strong>
                    ${data.dari}
                    s/d
                    ${data.sampai}
                </strong>
            </p>


            <table class="tabel-laporan">

                <tbody>

                    <tr>

                        <td>
                            Total Pendapatan
                        </td>

                        <td>
                            ${formatRupiah(
                                labaRugi.totalPendapatan
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Total Beban
                        </td>

                        <td>
                            ${formatRupiah(
                                labaRugi.totalBeban
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Laba / Rugi
                        </td>

                        <td class="${kelasLaba}">

                            ${formatRupiah(
                                laba
                            )}

                        </td>

                    </tr>


                    <tr>

                        <td>
                            Saldo Kas
                        </td>

                        <td>
                            ${formatRupiah(
                                arusKas.saldoKasAkhir
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Saldo Bank
                        </td>

                        <td>
                            ${formatRupiah(
                                arusKas.saldoBankAkhir
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Saldo Dana
                        </td>

                        <td>
                            ${formatRupiah(
                                arusKas.saldoDanaAkhir
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Total Saldo Kas & Media
                        </td>

                        <td>
                            ${formatRupiah(
                                arusKas.totalSaldoAkhir
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Piutang
                        </td>

                        <td>
                            ${formatRupiah(
                                piutang.totalSisa
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Utang
                        </td>

                        <td>
                            ${formatRupiah(
                                utang.totalSisa
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Nilai Buku Aset
                        </td>

                        <td>
                            ${formatRupiah(
                                aset.totalNilaiBuku
                            )}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Total Modal
                        </td>

                        <td>
                            ${formatRupiah(
                                modal.totalModal
                            )}
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


// =========================================
// HASIL TUTUP BUKU
// =========================================

function tampilHasilTutupBuku(
    data
) {

    const area =
        document.getElementById(
            "hasil-tutup-buku"
        );


    if (!area || !data) {

        return;

    }


    area.innerHTML = `

        <div class="kartu-laporan">

            <h3>
                Data Laporan yang Akan Ditutup
            </h3>

            <p>
                Laba Rugi:
                <strong>
                    Siap
                </strong>
            </p>

            <p>
                Arus Kas:
                <strong>
                    Siap
                </strong>
            </p>

            <p>
                Piutang:
                <strong>
                    Siap
                </strong>
            </p>

            <p>
                Utang:
                <strong>
                    Siap
                </strong>
            </p>

            <p>
                Aset:
                <strong>
                    Siap
                </strong>
            </p>

            <p>
                Modal:
                <strong>
                    Siap
                </strong>
            </p>

            <p>
                Seluruh data tersebut akan disimpan
                sebagai snapshot Tutup Buku.
            </p>

        </div>

    `;

}


// =========================================
// SIMPAN TUTUP BUKU
// =========================================

async function simpanTutupBuku() {

    if (!DATA_TUTUP_BUKU) {

        tampilPesanTutupBuku(
            "Belum ada data yang diperiksa.",
            "error"
        );

        return;

    }


    if (
        DATA_TUTUP_BUKU.status ===
        "DITUTUP"
    ) {

        tampilPesanTutupBuku(
            "Periode ini sudah ditutup.",
            "warning"
        );

        return;

    }


    const konfirmasi =
        confirm(
            "Apakah Anda yakin ingin menutup buku periode " +
            DATA_TUTUP_BUKU.dari +
            " s/d " +
            DATA_TUTUP_BUKU.sampai +
            "?\n\n" +
            "Setelah ditutup, transaksi dalam periode ini " +
            "tidak boleh diedit atau dihapus."
        );


    if (!konfirmasi) {

        return;

    }


    const tombol =
        document.getElementById(
            "btn-tutup-buku"
        );


    if (tombol) {

        tombol.disabled = true;

    }


    tampilStatusTutupBuku(
        "MENYIMPAN",
        "Menyimpan snapshot laporan Tutup Buku..."
    );


    try {

        const hasil =
            await simpanTutupBukuFirebase(
                DATA_TUTUP_BUKU
            );


        if (
            !hasil ||
            !hasil.berhasil
        ) {

            throw new Error(
                "Tutup buku gagal disimpan."
            );

        }


        DATA_TUTUP_BUKU.status =
            "DITUTUP";


        // =================================
        // TAMPILKAN STATUS TERKUNCI
        // =================================

        tampilStatusTutupBuku(
            "🔒 DITUTUP",
            "Periode telah ditutup. Seluruh transaksi dalam periode ini terkunci."
        );


        tampilPesanTutupBuku(
            "Tutup buku berhasil disimpan. Periode sekarang terkunci.",
            "success"
        );


        // =================================
        // LOAD ULANG RIWAYAT
        // =================================

        await tampilRiwayatTutupBuku();


    } catch (error) {

        console.error(
            "Simpan tutup buku gagal:",
            error
        );


        if (tombol) {

            tombol.disabled = false;

        }


        tampilPesanTutupBuku(
            error.message ||
            "Gagal menyimpan tutup buku.",
            "error"
        );

    }

}


// =========================================
// RIWAYAT TUTUP BUKU
// =========================================

async function tampilRiwayatTutupBuku() {

    const area =
        document.getElementById(
            "riwayat-tutup-buku"
        );


    if (!area) {

        return;

    }


    try {

        area.innerHTML = `
            <p class="data-kosong">
                Memuat riwayat Tutup Buku...
            </p>
        `;


        const data =
            await loadTutupBukuFirebase();


        if (
            !data ||
            data.length === 0
        ) {

            area.innerHTML = `
                <p class="data-kosong">
                    Belum ada riwayat Tutup Buku.
                </p>
            `;

            return;

        }


        let html = `

            <div class="kartu-laporan">

                <h3>
                    Riwayat Tutup Buku
                </h3>

                <div class="tabel-scroll">

                    <table class="tabel-laporan">

                        <thead>

                            <tr>

                                <th>
                                    Periode
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Laba / Rugi
                                </th>

                                <th>
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody>
        `;


        data.forEach(
            function(item) {

                const labaRugi =
                    item.labaRugi || {};


                const laba =
                    Number(
                        labaRugi.labaRugi
                    ) || 0;


                const kelasLaba =
                    laba >= 0
                        ? "laba-positif"
                        : "laba-negatif";


                html += `

                    <tr>

                        <td>

                            <strong>
                                ${item.dari}
                                s/d
                                ${item.sampai}
                            </strong>

                        </td>


                        <td>

                            <span class="status-ditutup">
                                🔒 ${item.status || "DITUTUP"}
                            </span>

                        </td>


                        <td class="${kelasLaba}">

                            ${formatRupiah(
                                laba
                            )}

                        </td>


                        <td>

                            <button
                                type="button"
                                class="btnSekunder"
                                onclick="
                                    lihatDetailTutupBuku(
                                        '${item.id}'
                                    )
                                "
                            >
                                Lihat
                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                        </tbody>

                    </table>

                </div>

            </div>

        `;


        area.innerHTML =
            html;


    } catch (error) {

        console.error(
            "Load riwayat Tutup Buku gagal:",
            error
        );


        area.innerHTML = `

            <p class="pesan-error">

                Gagal memuat riwayat Tutup Buku.

            </p>

        `;

    }

}


// =========================================
// DETAIL TUTUP BUKU
// =========================================

async function lihatDetailTutupBuku(
    id
) {

    try {

        const data =
            await loadTutupBukuFirebase();


        const item =
            data.find(
                function(row) {

                    return row.id === id;

                }
            );


        if (!item) {

            tampilPesanTutupBuku(
                "Data Tutup Buku tidak ditemukan.",
                "error"
            );

            return;

        }


        const labaRugi =
            item.labaRugi || {};


        const arusKas =
            item.arusKas || {};


        const piutang =
            item.piutang || {};


        const utang =
            item.utang || {};


        const aset =
            item.aset || {};


        const modal =
            item.modal || {};


        const laba =
            Number(
                labaRugi.labaRugi
            ) || 0;


        alert(

            "TUTUP BUKU\n\n" +

            "Periode: " +
            item.dari +
            " s/d " +
            item.sampai +

            "\n\n" +

            "Pendapatan: " +
            formatRupiah(
                labaRugi.totalPendapatan
            ) +

            "\n" +

            "Beban: " +
            formatRupiah(
                labaRugi.totalBeban
            ) +

            "\n" +

            "Laba / Rugi: " +
            formatRupiah(
                laba
            ) +

            "\n\n" +

            "Kas: " +
            formatRupiah(
                arusKas.saldoKasAkhir
            ) +

            "\n" +

            "Bank: " +
            formatRupiah(
                arusKas.saldoBankAkhir
            ) +

            "\n" +

            "Dana: " +
            formatRupiah(
                arusKas.saldoDanaAkhir
            ) +

            "\n\n" +

            "Piutang: " +
            formatRupiah(
                piutang.totalSisa
            ) +

            "\n" +

            "Utang: " +
            formatRupiah(
                utang.totalSisa
            ) +

            "\n\n" +

            "Aset: " +
            formatRupiah(
                aset.totalNilaiBuku
            ) +

            "\n" +

            "Modal: " +
            formatRupiah(
                modal.totalModal
            )

        );


    } catch (error) {

        console.error(
            "Detail Tutup Buku gagal:",
            error
        );


        tampilPesanTutupBuku(
            error.message ||
            "Gagal mengambil detail Tutup Buku.",
            "error"
        );

    }

}


// =========================================
// PESAN
// =========================================

function tampilPesanTutupBuku(
    pesan,
    tipe
) {

    const area =
        document.getElementById(
            "pesan-tutup-buku"
        );


    if (!area) {

        return;

    }


    area.innerHTML = `

        <div class="pesan-${tipe}">

            ${pesan}

        </div>

    `;

}


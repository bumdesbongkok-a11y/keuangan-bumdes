// =========================================
// PIUTANG UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FORMAT TANGGAL PIUTANG
// =========================================

function formatTanggalPiutang(tanggal) {

    if (!tanggal) {
        return "-";
    }

    const teks =
        String(tanggal);

    // Format YYYY-MM-DD
    const bagian =
        teks.split("-");

    if (bagian.length === 3) {

        return (
            bagian[2] +
            "-" +
            bagian[1] +
            "-" +
            bagian[0]
        );

    }

    return teks;

}


// =========================================
// FORMAT RUPIAH PIUTANG
// =========================================

function formatRupiahPiutang(nominal) {

    const angka =
        Number(nominal) || 0;

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
// ESCAPE HTML
// =========================================

function escapeHtmlPiutang(teks) {

    return String(teks ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================
// TAMPIL PIUTANG
// =========================================

function tampilPiutang(data) {

    try {

        data =
            Array.isArray(data)
                ? data
                : [];


        // =====================================
        // TOTAL PIUTANG
        // =====================================

        const totalPiutang =
            data.reduce(

                function(total, item) {

                    return total +
                        (
                            Number(item.sisa) ||
                            0
                        );

                },

                0

            );


        const elTotal =
            document.getElementById(
                "totalPiutang"
            );


        if (elTotal) {

            elTotal.textContent =
                formatRupiahPiutang(
                    totalPiutang
                );

        }


        // =====================================
        // CONTAINER
        // =====================================

        const container =
            document.getElementById(
                "daftar-piutang"
            );


        if (!container) {

            console.warn(
                "Element daftar-piutang tidak ditemukan."
            );

            return;

        }


        // =====================================
        // DATA KOSONG
        // =====================================

        if (data.length === 0) {

            container.innerHTML = `

                <p class="data-kosong">
                    Belum ada data piutang.
                </p>

            `;

            return;

        }


        // =====================================
        // URUTKAN TERBARU
        // =====================================

        const dataUrut =
            [...data].sort(

                function(a, b) {

                    const tanggalA =
                        String(
                            a.tanggal || ""
                        );

                    const tanggalB =
                        String(
                            b.tanggal || ""
                        );

                    return tanggalB.localeCompare(
                        tanggalA
                    );

                }

            );


        // =====================================
        // HEADER TABEL
        // =====================================

        let html = `

            <div class="table-responsive">

                <table class="tabel-data">

                    <thead>

                        <tr>

                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Nama</th>
                            <th>Keterangan</th>
                            <th>Nominal</th>
                            <th>Dibayar</th>
                            <th>Sisa</th>
                            <th>Jatuh Tempo</th>
                            <th>Status</th>
                            <th>Aksi</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        // =====================================
        // DATA PIUTANG
        // =====================================

        dataUrut.forEach(

            function(item, index) {

                const nominal =
                    Number(item.nominal) || 0;


                const dibayar =
                    Number(item.dibayar) || 0;


                let sisa =
                    Number(item.sisa);


                if (!Number.isFinite(sisa)) {

                    sisa =
                        Math.max(
                            nominal - dibayar,
                            0
                        );

                }


                // =================================
                // STATUS
                // =================================

                let status =
                    item.status || "";


                // Normalisasi status lama
                status =
                    String(status)
                        .trim()
                        .toUpperCase();


                if (
                    !status ||
                    status === "BELUM_LUNAS" ||
                    status === "BELUM LUNAS"
                ) {

                    if (sisa <= 0) {

                        status =
                            "LUNAS";

                    } else if (dibayar > 0) {

                        status =
                            "SEBAGIAN";

                    } else {

                        status =
                            "BELUM LUNAS";

                    }

                }


                let statusLabel =
                    "Belum Dibayar";


                let statusClass =
                    "belum-lunas";


                if (
                    status === "SEBAGIAN"
                ) {

                    statusLabel =
                        "Sebagian";

                    statusClass =
                        "sebagian";

                }


                if (
                    status === "LUNAS"
                ) {

                    statusLabel =
                        "Lunas";

                    statusClass =
                        "lunas";

                }


                // =================================
                // JATUH TEMPO
                // =================================

                const jatuhTempo =
                    item.jatuhTempo
                        ? formatTanggalPiutang(
                            item.jatuhTempo
                        )
                        : "-";


                // =================================
                // TOMBOL BAYAR
                // =================================

                let tombolBayar =
                    "";


                if (sisa > 0) {

                    tombolBayar = `

                        <button
                            type="button"
                            class="btn-simpan"
                            onclick="bayarPiutang('${item.id}')"
                        >
                            Bayar
                        </button>

                    `;

                }


                // =================================
                // BARIS
                // =================================

                html += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${formatTanggalPiutang(
                                item.tanggal
                            )}
                        </td>

                        <td>
                            ${escapeHtmlPiutang(
                                item.nama || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtmlPiutang(
                                item.keterangan || "-"
                            )}
                        </td>

                        <td>
                            ${formatRupiahPiutang(
                                nominal
                            )}
                        </td>

                        <td>
                            ${formatRupiahPiutang(
                                dibayar
                            )}
                        </td>

                        <td>
                            ${formatRupiahPiutang(
                                sisa
                            )}
                        </td>

                        <td>
                            ${jatuhTempo}
                        </td>

                        <td>

                            <span
                                class="status-piutang status-${statusClass}"
                            >
                                ${statusLabel}
                            </span>

                        </td>

                        <td>

                            ${tombolBayar}

                            <button
                                type="button"
                                class="btn-edit"
                                onclick="editPiutang('${item.id}')"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="btn-hapus"
                                onclick="hapusPiutang('${item.id}')"
                            >
                                Hapus
                            </button>

                        </td>

                    </tr>

                `;

            }

        );


        // =====================================
        // SELESAI TABEL
        // =====================================

        html += `

                    </tbody>

                </table>

            </div>

        `;


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            "Tampil piutang gagal:",
            error
        );

    }

}


// =========================================
// UBAH TOMBOL SIMPAN PIUTANG
// =========================================

function ubahTombolSimpanPiutang(
    teks
) {

    const tombol =
        document.getElementById(
            "btn-simpan-piutang"
        );


    if (!tombol) {

        return;

    }


    if (piutangSedangDiedit) {

        tombol.textContent =
            teks ||
            "Update Piutang";

    } else {

        tombol.textContent =
            "Simpan Piutang";

    }

}


// =========================================
// INIT UI PIUTANG
// =========================================

function initPiutangUI() {

    try {

        console.log(
            "Init Piutang UI..."
        );


        setTanggalPiutang();

        setTanggalBayarPiutang();

        ubahTombolSimpanPiutang();


        console.log(
            "PIUTANG UI BERHASIL"
        );


    } catch (error) {

        console.error(
            "Init Piutang UI gagal:",
            error
        );

    }

}


// =========================================
// SELESAI PIUTANG.UI.JS
// =========================================

console.log(
    "piutang.ui.js berhasil dimuat."
);
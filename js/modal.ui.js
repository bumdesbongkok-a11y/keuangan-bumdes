// =========================================
// MODAL UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// FORMAT MEDIA MODAL
// =========================================

function formatMediaModal(media) {

    switch (media) {

        case MEDIA_UANG.KAS:

            return "Kas";

        case MEDIA_UANG.BANK:

            return "Bank";

        case MEDIA_UANG.DANA:

            return "DANA";

        default:

            return media || "-";

    }

}


// =========================================
// FORMAT JENIS MODAL
// =========================================

function formatJenisModal(jenis) {

    switch (jenis) {

        case "MODAL_AWAL":

            return "Modal Awal";

        case "PENYERTAAN_MODAL":

            return "Penyertaan Modal Desa";

        case "TAMBAHAN_MODAL":

            return "Tambahan Modal";

        case "PENGURANGAN_MODAL":

            return "Pengurangan Modal";

        default:

            return jenis || "-";

    }

}


// =========================================
// TAMPIL DATA MODAL
// =========================================

function tampilModal(data) {

    const area =
        document.getElementById(
            "daftar-modal"
        );


    const totalElement =
        document.getElementById(
            "totalModal"
        );


    if (!area) {

        return;

    }


    // =====================================
    // DATA KOSONG
    // =====================================

    if (!data || data.length === 0) {

        if (totalElement) {

            totalElement.textContent =
                formatRupiah(0);

        }


        area.innerHTML = `

            <p class="data-kosong">

                Belum ada data modal.

            </p>

        `;


        return;

    }


    // =====================================
    // HITUNG TOTAL MODAL
    // =====================================

    let totalModal = 0;


    data.forEach(function(item) {

        const nominal =
            Number(item.nominal) || 0;


        /*
         * Pengurangan modal mengurangi
         * total modal.
         */

        if (
            item.jenis ===
            "PENGURANGAN_MODAL"
        ) {

            totalModal -= nominal;

        } else {

            totalModal += nominal;

        }

    });


    // =====================================
    // TAMPIL TOTAL MODAL
    // =====================================

    if (totalElement) {

        totalElement.textContent =
            formatRupiah(totalModal);

    }


    // =====================================
    // TABEL
    // =====================================

    let html = `

        <div class="tabel-scroll">

            <table class="tabel-modal">

                <thead>

                    <tr>

                        <th>
                            Tanggal
                        </th>

                        <th>
                            Sumber Modal
                        </th>

                        <th>
                            Jenis
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

                        <th>
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>

    `;


    // =====================================
    // DATA MODAL
    // =====================================

    data.forEach(function(item) {

        const nominal =
            Number(item.nominal) || 0;


        const jenis =
            formatJenisModal(
                item.jenis
            );


        const media =
            formatMediaModal(
                item.media
            );


        const kelasNominal =
            item.jenis ===
            "PENGURANGAN_MODAL"
                ? "nominal nominal-minus"
                : "nominal";


        html += `

            <tr>

                <td>
                    ${item.tanggal || "-"}
                </td>


                <td>
                    ${item.sumber || "-"}
                </td>


                <td>
                    ${jenis}
                </td>


                <td>
                    ${media}
                </td>


                <td class="${kelasNominal}">

                    ${
                        item.jenis ===
                        "PENGURANGAN_MODAL"
                            ? "- "
                            : ""
                    }

                    ${formatRupiah(nominal)}

                </td>


                <td>
                    ${item.keterangan || "-"}
                </td>


                <td class="aksi-modal">

                    <button
                        type="button"
                        class="btn-edit-modal"
                        onclick="editModal('${item.id}')"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="btn-hapus-modal"
                        onclick="hapusModal('${item.id}')"
                    >
                        Hapus
                    </button>

                </td>

            </tr>

        `;

    });


    html += `

                </tbody>

            </table>

        </div>

    `;


    // =====================================
    // TAMPILKAN
    // =====================================

    area.innerHTML =
        html;

}


// =========================================
// FORM MODAL
// =========================================

function bukaFormModal() {

    const form =
        document.getElementById(
            "form-modal"
        );


    if (form) {

        form.style.display =
            "block";

    }

}


// =========================================
// TUTUP FORM MODAL
// =========================================

function tutupFormModal() {

    const form =
        document.getElementById(
            "form-modal"
        );


    if (form) {

        form.style.display =
            "none";

    }


    resetFormModal();

}
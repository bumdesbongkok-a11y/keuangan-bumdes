// =========================================
// TRANSFER UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TANGGAL TRANSFER
// =========================================

function setTanggalTransfer() {

    const input =
        document.getElementById(
            "transferTanggal"
        );

    if (!input) {
        return;
    }

    input.value =
        tanggalHariIni();

}


// =========================================
// PESAN TRANSFER
// =========================================

function tampilPesanTransfer(
    pesan,
    jenis
) {

    const area =
        document.getElementById(
            "pesan-transfer"
        );

    if (!area) {
        return;
    }

    area.textContent =
        pesan;

    area.className =
        "pesan " + jenis;

}


// =========================================
// SIAPKAN FORM TRANSFER
// =========================================

function siapkanFormTransfer() {

    setTanggalTransfer();

}

// =========================================
// TAMPIL DATA TRANSFER
// =========================================

function tampilTransfer(data) {

    const area =
        document.getElementById(
            "daftar-transfer"
        );


    if (!area) {

        return;

    }


    if (
        !data ||
        data.length === 0
    ) {

        area.innerHTML = `

            <p class="data-kosong">
                Belum ada data transfer.
            </p>

        `;

        return;

    }


    let total = 0;


    let html = `

        <div class="total-transfer">

            <span>
                Total Transfer
            </span>

            <strong>
                Rp0
            </strong>

        </div>


        <div class="tabel-scroll">

            <table class="tabel-transfer">

                <thead>

                    <tr>

                        <th>Tanggal</th>

                        <th>Dari</th>

                        <th>Ke</th>

                        <th>Nominal</th>

                        <th>Keterangan</th>

                        <th>Bukti</th>
						
						<th>Aksi</th>

                    </tr>

                </thead>


                <tbody>

    `;


    data.forEach(function(item) {

        const nominal =
            Number(item.nominal) || 0;


        total += nominal;


        const namaMedia =
            function(media) {

                if (
                    media ===
                    "KAS"
                ) {

                    return "Kas";

                }


                if (
                    media ===
                    "BANK"
                ) {

                    return "Bank";

                }


                if (
                    media ===
                    "DANA"
                ) {

                    return "DANA";

                }


                if (
                    media ===
                    "SALDO_AFFILIATE"
                ) {

                    return "Saldo Affiliate";

                }


                return media || "-";

            };


        html += `

            <tr>

                <td>
                    ${item.tanggal || "-"}
                </td>

                <td>
                    ${namaMedia(item.mediaAsal)}
                </td>

                <td>
                    ${namaMedia(item.mediaTujuan)}
                </td>

                <td class="nominal">
                    ${formatRupiah(nominal)}
                </td>

                <td>
                    ${item.keterangan || "-"}
                </td>

                <td>
                    ${item.nomorBukti || "-"}
                </td>
<td class="aksi">

    <button
        type="button"
        class="btn-edit"
        onclick="editTransfer('${item.id}')"
    >
        Edit
    </button>

    <button
        type="button"
        class="btn-hapus"
        onclick="hapusTransfer('${item.id}')"
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


    area.innerHTML =
        html;


    const totalElement =
        area.querySelector(
            ".total-transfer strong"
        );


    if (totalElement) {

        totalElement.textContent =
            formatRupiah(total);

    }

}


// =========================================
// LOAD DAN TAMPILKAN TRANSFER
// =========================================

async function loadDanTampilTransfer() {

    const data =
        await loadTransferFirebase();


    tampilTransfer(data);

}

// =========================================
// EDIT TRANSFER
// =========================================

async function editTransfer(id) {

    const data =
        await ambilTransferFirebase(id);


    if (!data) {

        tampilPesanTransfer(
            "Data transfer tidak ditemukan.",
            "error"
        );

        return;

    }


    // Isi tanggal

    document.getElementById(
        "transferTanggal"
    ).value =
        data.tanggal || "";


    // Isi media asal

    document.getElementById(
        "transferMediaAsal"
    ).value =
        data.mediaAsal || "";


    // Update daftar media tujuan

    updateMediaTujuanTransfer();


    // Isi media tujuan

    document.getElementById(
        "transferMediaTujuan"
    ).value =
        data.mediaTujuan || "";


    // Isi nominal

    document.getElementById(
        "transferNominal"
    ).value =
        data.nominal || "";


    // Isi keterangan

    document.getElementById(
        "transferKeterangan"
    ).value =
        data.keterangan || "";


    // Isi nomor bukti

    document.getElementById(
        "transferBukti"
    ).value =
        data.nomorBukti || "";


    // Simpan ID yang sedang diedit

    window.transferSedangDiedit =
        id;


    // Ubah tombol

    const tombol =
        document.getElementById(
            "btn-simpan-transfer"
        );


    if (tombol) {

        tombol.textContent =
            "Update Transfer";

    }


    tampilPesanTransfer(
        "Mode edit transfer.",
        "success"
    );

}
// =========================================
// UPDATE MEDIA TUJUAN TRANSFER
// =========================================

function updateMediaTujuanTransfer() {

    const asal =
        document.getElementById(
            "transferMediaAsal"
        );

    const tujuan =
        document.getElementById(
            "transferMediaTujuan"
        );


    if (!asal || !tujuan) {

        return;

    }


    const mediaAsal =
        asal.value;


    tujuan.innerHTML = `
        <option value="">
            -- Pilih Media Tujuan --
        </option>
    `;


    if (!mediaAsal) {

        return;

    }


    Object.values(MEDIA_UANG)
        .forEach(function(media) {

            // Jangan tampilkan media yang sama
            if (media === mediaAsal) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                media;


            // Nama tampilan

            if (media === "KAS") {

                option.textContent =
                    "Kas";

            }

            else if (media === "BANK") {

                option.textContent =
                    "Bank";

            }

            else if (media === "DANA") {

                option.textContent =
                    "DANA";

            }

            else if (
                media ===
                "SALDO_AFFILIATE"
            ) {

                option.textContent =
                    "Saldo Affiliate";

            }

            else {

                option.textContent =
                    media;

            }


            tujuan.appendChild(
                option
            );

        });

}

// =========================================
// RESET FORM TRANSFER
// =========================================

function resetFormTransfer() {

    const tanggal =
        document.getElementById(
            "transferTanggal"
        );

    const mediaAsal =
        document.getElementById(
            "transferMediaAsal"
        );

    const mediaTujuan =
        document.getElementById(
            "transferMediaTujuan"
        );

    const nominal =
        document.getElementById(
            "transferNominal"
        );

    const keterangan =
        document.getElementById(
            "transferKeterangan"
        );

    const bukti =
        document.getElementById(
            "transferBukti"
        );


    // =====================================
    // KOSONGKAN FORM
    // =====================================

    if (tanggal) {

        tanggal.value =
            tanggalHariIni();

    }


    if (mediaAsal) {

        mediaAsal.value = "";

    }


    // =====================================
    // KEMBALIKAN DROPDOWN MEDIA TUJUAN
    // =====================================

    if (mediaTujuan) {

        mediaTujuan.innerHTML = `

            <option value="">
                -- Pilih Media Tujuan --
            </option>

            <option value="KAS">
                Kas
            </option>

            <option value="BANK">
                Bank
            </option>

            <option value="DANA">
                DANA
            </option>

            <option value="SALDO_AFFILIATE">
                Saldo Affiliate
            </option>

        `;

    }


    if (nominal) {

        nominal.value = "";

    }


    if (keterangan) {

        keterangan.value = "";

    }


    if (bukti) {

        bukti.value = "";

    }


    // =====================================
    // HAPUS MODE EDIT
    // =====================================

    window.transferSedangDiedit =
        null;


    // =====================================
    // KEMBALIKAN TOMBOL
    // =====================================

    const tombol =
        document.getElementById(
            "btn-simpan-transfer"
        );


    if (tombol) {

        tombol.textContent =
            "Simpan Transfer";

    }

}

// =========================================
// HAPUS TRANSFER
// =========================================

async function hapusTransfer(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus transfer ini?"
        );


    if (!yakin) {

        return;

    }


    tampilPesanTransfer(
        "Menghapus transfer...",
        "success"
    );


    const berhasil =
        await hapusTransferFirebase(id);


    if (!berhasil) {

        tampilPesanTransfer(
            "Transfer gagal dihapus.",
            "error"
        );

        return;

    }


    tampilPesanTransfer(
        "Transfer berhasil dihapus.",
        "success"
    );


    await loadDanTampilTransfer();

}
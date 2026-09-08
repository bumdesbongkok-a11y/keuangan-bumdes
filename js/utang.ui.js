// =========================================
// UTANG UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// DATA UTANG YANG SEDANG DIBAYAR
// =========================================

let UTANG_SEDANG_DIBAYAR = null;


// =========================================
// TAMPIL DATA UTANG
// =========================================

function tampilUtang(data) {

    const area =
        document.getElementById(
            "daftar-utang"
        );

    const totalElement =
        document.getElementById(
            "totalUtang"
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
                Belum ada data utang.
            </p>

        `;

        return;

    }


    // =====================================
    // HITUNG TOTAL SISA UTANG
    // =====================================

    let totalSisa = 0;


    data.forEach(function(item) {

        totalSisa +=
            Number(item.sisa) || 0;

    });


    // =====================================
    // TAMPIL TOTAL
    // =====================================

    if (totalElement) {

        totalElement.textContent =
            formatRupiah(totalSisa);

    }


    // =====================================
    // TABEL
    // =====================================

    let html = `

        <div class="tabel-scroll">

            <table class="tabel-utang">

                <thead>

                    <tr>

                        <th>Tanggal</th>

                        <th>Nama</th>

                        <th>Keterangan</th>

                        <th>Utang</th>

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
    // DATA
    // =====================================

    data.forEach(function(item) {

        const nominal =
            Number(item.nominal) || 0;


        const dibayar =
            Number(item.dibayar) || 0;


        const sisa =
            Number(item.sisa) || 0;


        // =================================
        // STATUS OTOMATIS
        // =================================

        let status =
            "BELUM LUNAS";


        if (sisa <= 0) {

            status =
                "LUNAS";

        } else if (dibayar > 0) {

            status =
                "SEBAGIAN";

        }


        // =================================
        // TOMBOL BAYAR
        // =================================

        let tombolBayar = "";


        if (sisa > 0) {

            tombolBayar = `

                <button
                    type="button"
                    class="btn-bayar-utang"
                    onclick="bayarUtang('${item.id}')"
                >
                    Bayar
                </button>

            `;

        } else {

            tombolBayar = `

                <span class="utang-selesai">
                    Selesai
                </span>

            `;

        }


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

                <td class="nominal">
                    ${formatRupiah(nominal)}
                </td>

                <td class="nominal">
                    ${
                        dibayar > 0
                            ? formatRupiah(dibayar)
                            : "-"
                    }
                </td>

                <td class="nominal">
                    ${formatRupiah(sisa)}
                </td>

                <td>
                    ${item.jatuhTempo || "-"}
                </td>

                <td>

                    <span class="status-utang status-${status
                        .toLowerCase()
                        .replace(" ", "-")}">

                        ${status}

                    </span>

                </td>

                <td class="aksi-utang">

                    ${tombolBayar}

                    <button
                        type="button"
                        class="btn-edit-utang"
                        onclick="editUtang('${item.id}')"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-hapus-utang"
                        onclick="hapusUtang('${item.id}')"
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

}


// =========================================
// LOAD DAN TAMPILKAN UTANG
// =========================================

async function loadDanTampilUtang() {

    try {

        const data =
            await loadUtangFirebase();


        DATA_UTANG =
            data || [];


        tampilUtang(
            DATA_UTANG
        );


    } catch (error) {

        console.error(
            "Load utang gagal:",
            error
        );

    }

}


// =========================================
// SIMPAN / EDIT UTANG
// =========================================

async function simpanUtang() {

    const tanggal =
        document.getElementById(
            "utangTanggal"
        )?.value;


    const nama =
        document.getElementById(
            "utangNama"
        )?.value.trim();


    const keterangan =
        document.getElementById(
            "utangKeterangan"
        )?.value.trim();


    const nominal =
        Number(
            document.getElementById(
                "utangNominal"
            )?.value
        );


    const jatuhTempo =
        document.getElementById(
            "utangJatuhTempo"
        )?.value;


    // =====================================
    // VALIDASI
    // =====================================

    if (!tanggal) {

        alert(
            "Tanggal harus diisi."
        );

        return;

    }


    if (!nama) {

        alert(
            "Nama pihak yang memberikan utang harus diisi."
        );

        return;

    }


    if (!nominal || nominal <= 0) {

        alert(
            "Nominal utang harus lebih dari 0."
        );

        return;

    }


    // =====================================
    // MODE EDIT
    // =====================================

    if (utangSedangDiedit) {

        try {

            const berhasil =
                await updateUtangFirebase(

                    utangSedangDiedit,

                    {

                        tanggal:
                            tanggal,

                        nama:
                            nama,

                        keterangan:
                            keterangan,

                        nominal:
                            nominal,

                        jatuhTempo:
                            jatuhTempo

                    }

                );


            if (!berhasil) {

                throw new Error(
                    "Update utang gagal."
                );

            }


            alert(
                "Utang berhasil diperbarui."
            );


            utangSedangDiedit =
                null;


            ubahTombolSimpanUtang(
                "Simpan Utang"
            );


            resetFormUtang();


            await loadDanTampilUtang();


            return;


        } catch (error) {

            console.error(
                "Update utang gagal:",
                error
            );


            alert(
                "Utang gagal diperbarui."
            );


            return;

        }

    }


    // =====================================
    // MODE TAMBAH
    // =====================================

    try {

        const hasil =
            await simpanUtangFirebase({

                tanggal:
                    tanggal,

                nama:
                    nama,

                keterangan:
                    keterangan,

                nominal:
                    nominal,

                jatuhTempo:
                    jatuhTempo

            });


        if (!hasil) {

            throw new Error(
                "Firebase gagal menyimpan utang."
            );

        }


        alert(
            "Utang berhasil disimpan."
        );


        resetFormUtang();


        await loadDanTampilUtang();


    } catch (error) {

        console.error(
            "Simpan utang gagal:",
            error
        );


        alert(
            "Utang gagal disimpan."
        );

    }

}


// =========================================
// RESET FORM UTANG
// =========================================

function resetFormUtang() {

    const tanggal =
        document.getElementById(
            "utangTanggal"
        );

    const nama =
        document.getElementById(
            "utangNama"
        );

    const keterangan =
        document.getElementById(
            "utangKeterangan"
        );

    const nominal =
        document.getElementById(
            "utangNominal"
        );

    const jatuhTempo =
        document.getElementById(
            "utangJatuhTempo"
        );


    if (tanggal) {

        tanggal.value = "";

    }


    if (nama) {

        nama.value = "";

    }


    if (keterangan) {

        keterangan.value = "";

    }


    if (nominal) {

        nominal.value = "";

    }


    if (jatuhTempo) {

        jatuhTempo.value = "";

    }

}


// =========================================
// UBAH TOMBOL SIMPAN
// =========================================

function ubahTombolSimpanUtang(teks) {

    const tombol =
        document.querySelector(
            "#halaman-utang .btn-simpan"
        );


    if (tombol) {

        tombol.textContent =
            teks;

    }

}


// =========================================
// BUKA FORM PEMBAYARAN UTANG
// =========================================

function bayarUtang(id) {

    const item =
        DATA_UTANG.find(
            function(data) {

                return data.id === id;

            }
        );


    if (!item) {

        alert(
            "Data utang tidak ditemukan."
        );

        return;

    }


    const sisa =
        Number(item.sisa) || 0;


    if (sisa <= 0) {

        alert(
            "Utang ini sudah lunas."
        );

        return;

    }


    UTANG_SEDANG_DIBAYAR =
        item;


    const nama =
        document.getElementById(
            "bayarUtangNama"
        );

    const sisaElement =
        document.getElementById(
            "bayarUtangSisa"
        );

    const tanggal =
        document.getElementById(
            "bayarUtangTanggal"
        );

    const nominal =
        document.getElementById(
            "bayarUtangNominal"
        );

    const media =
        document.getElementById(
            "bayarUtangMedia"
        );

    const keterangan =
        document.getElementById(
            "bayarUtangKeterangan"
        );


    if (nama) {

        nama.value =
            item.nama || "";

    }


    if (sisaElement) {

        sisaElement.value =
            formatRupiah(sisa);

    }


    if (tanggal) {

        tanggal.value =
            tanggalHariIni();

    }


    if (nominal) {

        nominal.value =
            "";

    }


    if (media) {

        media.value =
            "";

    }


    if (keterangan) {

        keterangan.value =
            "";

    }


    const form =
        document.getElementById(
            "form-bayar-utang"
        );


    if (form) {

        form.style.display =
            "block";


        form.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


// =========================================
// TUTUP FORM BAYAR
// =========================================

function tutupFormBayarUtang() {

    const form =
        document.getElementById(
            "form-bayar-utang"
        );


    if (form) {

        form.style.display =
            "none";

    }


    UTANG_SEDANG_DIBAYAR =
        null;

}

// =========================================
// PROSES PEMBAYARAN UTANG
// =========================================

async function prosesBayarUtang() {

    // =====================================
    // CEK UTANG YANG DIPILIH
    // =====================================

    if (!UTANG_SEDANG_DIBAYAR) {

        alert(
            "Data utang belum dipilih."
        );

        return;

    }


    // =====================================
    // AMBIL DATA FORM
    // =====================================

    const tanggal =
        document.getElementById(
            "bayarUtangTanggal"
        )?.value;


    const nominal =
        Number(
            document.getElementById(
                "bayarUtangNominal"
            )?.value
        );


    const media =
        document.getElementById(
            "bayarUtangMedia"
        )?.value;


    const keterangan =
        document.getElementById(
            "bayarUtangKeterangan"
        )?.value.trim();


    const utang =
        UTANG_SEDANG_DIBAYAR;


    const sisaLama =
        Number(utang.sisa) || 0;


    const dibayarLama =
        Number(utang.dibayar) || 0;


    // =====================================
    // VALIDASI
    // =====================================

    if (!tanggal) {

        alert(
            "Tanggal pembayaran harus diisi."
        );

        return;

    }


    if (!nominal || nominal <= 0) {

        alert(
            "Nominal pembayaran harus lebih dari 0."
        );

        return;

    }


    if (nominal > sisaLama) {

        alert(
            "Nominal pembayaran tidak boleh melebihi sisa utang."
        );

        return;

    }


    if (!media) {

        alert(
            "Pilih media pembayaran."
        );

        return;

    }


    // =====================================
    // HITUNG DATA BARU
    // =====================================

    const dibayarBaru =
        dibayarLama + nominal;


    const sisaBaru =
        sisaLama - nominal;


    const statusBaru =
        sisaBaru <= 0
            ? "LUNAS"
            : "SEBAGIAN";


    // =====================================
    // SIMPAN TRANSAKSI PEMBAYARAN
    // =====================================

    try {

        const berhasilTransaksi =
            await simpanPembayaranUtangKeTransaksi({

                tanggal:
                    tanggal,

                nominal:
                    nominal,

                media:
                    media,

                nama:
                    utang.nama,

                keterangan:
                    keterangan,

                utangId:
                    utang.id

            });


        if (!berhasilTransaksi) {

            throw new Error(
                "Gagal mencatat pembayaran utang ke transaksi."
            );

        }


        // =================================
        // UPDATE DATA UTANG
        // =================================

        const berhasilUpdate =
            await updateUtangFirebase(

                utang.id,

                {

                    dibayar:
                        dibayarBaru,

                    sisa:
                        sisaBaru,

                    status:
                        statusBaru,

                    diperbaruiPada:
                        new Date()

                }

            );


        if (!berhasilUpdate) {

            throw new Error(
                "Pembayaran tercatat tetapi data utang gagal diperbarui."
            );

        }


        // =================================
        // BERHASIL
        // =================================

        alert(
            "Pembayaran utang berhasil disimpan."
        );


        // =================================
        // TUTUP FORM
        // =================================

        tutupFormBayarUtang();


        // =================================
        // LOAD ULANG DATA
        // =================================

        await loadDanTampilUtang();


    } catch (error) {

        console.error(
            "Pembayaran utang gagal:",
            error
        );


        alert(
            "Pembayaran utang gagal disimpan.\n\n" +
            error.message
        );

    }

}




// =========================================
// HAPUS UTANG
// =========================================

async function hapusUtang(id) {

    const item =
        DATA_UTANG.find(
            function(data) {

                return data.id === id;

            }
        );


    if (!item) {

        alert(
            "Data utang tidak ditemukan."
        );

        return;

    }


    // =====================================
    // CEK PEMBAYARAN
    // =====================================

    const sudahDibayar =
        Number(item.dibayar) || 0;


    if (sudahDibayar > 0) {

        alert(
            "Utang ini sudah memiliki pembayaran " +
            formatRupiah(sudahDibayar) +
            ".\n\n" +
            "Utang tidak boleh dihapus langsung."
        );

        return;

    }


    // =====================================
    // KONFIRMASI
    // =====================================

    const yakin =
        confirm(

            "Hapus utang kepada " +
            item.nama +
            " sebesar " +
            formatRupiah(
                Number(item.nominal) || 0
            ) +
            "?"

        );


    if (!yakin) {

        return;

    }


    // =====================================
    // HAPUS FIREBASE
    // =====================================

    try {

        const berhasil =
            await hapusUtangFirebase(
                id
            );


        if (!berhasil) {

            throw new Error(
                "Gagal menghapus utang."
            );

        }


        alert(
            "Utang berhasil dihapus."
        );


        await loadDanTampilUtang();


    } catch (error) {

        console.error(
            "Hapus utang gagal:",
            error
        );


        alert(
            "Utang gagal dihapus."
        );

    }

}
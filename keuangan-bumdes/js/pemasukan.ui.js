// =========================================
// PEMASUKAN UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TANGGAL PEMASUKAN
// =========================================

function setTanggalPemasukan() {

    const input =
        document.getElementById("pemasukanTanggal");

    if (!input) {
        return;
    }

    input.value = tanggalHariIni();

}


// =========================================
// AKUN PENDAPATAN PER UNIT
// =========================================




// =========================================
// UPDATE AKUN PEMASUKAN
// =========================================

async function updateAkunPemasukan() {

    const unit =
        document.getElementById(
            "pemasukanUnit"
        );

    const akun =
        document.getElementById(
            "pemasukanAkun"
        );


    if (!unit || !akun) {
        return;
    }


    // =====================================
    // KOSONGKAN DROPDOWN
    // =====================================

    akun.innerHTML = `
        <option value="">
            -- Pilih Akun Pendapatan --
        </option>
    `;


    // =====================================
    // BELUM MEMILIH UNIT
    // =====================================

    if (!unit.value) {
        return;
    }


    try {

        // =================================
        // AMBIL MASTER AKUN
        // =================================

        const data =
            await ambilAkunFirebase();


        // =================================
        // FILTER AKUN PENDAPATAN
        // SESUAI UNIT USAHA
        // =================================

        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.jenis === "pendapatan" &&
                    item.unitUsaha === unit.value &&
                    item.status !== "nonaktif"
                );

            });


        // =================================
        // TAMPILKAN KE DROPDOWN
        // =================================

        daftar.forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.kode;


            option.textContent =
                item.kode +
                " - " +
                item.nama;


            akun.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Gagal memuat akun pendapatan:",
            error
        );

        akun.innerHTML = `
            <option value="">
                Gagal memuat akun pendapatan
            </option>
        `;

    }

}

// =========================================
// DROPDOWN PELANGGAN / PIHAK
// =========================================

async function updatePelangganPemasukan(nilaiTerpilih = "") {

    const select =
        document.getElementById(
            "pemasukanPelanggan"
        );

    if (!select) {
		
        return;
    }

    // =====================================
    // RESET DROPDOWN
    // =====================================

    select.innerHTML = `
        <option value="">
            -- Pilih Pelanggan / Pihak --
        </option>
    `;

    try {

        // =================================
        // AMBIL MASTER PELANGGAN
        // =================================

        const data =
            await ambilPelangganFirebase();

        // =================================
        // HANYA PELANGGAN AKTIF
        // =================================

        const daftar =
            (data || []).filter(function(item) {

                return item.status !== "nonaktif";

            });

        // =================================
        // TAMPILKAN
        // =================================

        daftar.forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.id;

            option.textContent =
                item.kode +
                " - " +
                item.nama;

            if (
                nilaiTerpilih &&
                item.id === nilaiTerpilih
            ) {
                option.selected = true;
            }

            select.appendChild(
                option
            );

        });

    } catch (error) {

        console.error(
            "Gagal memuat pelanggan/pihak:",
            error
        );

        select.innerHTML = `
            <option value="">
                Gagal memuat pelanggan / pihak
            </option>
        `;

    }

}

// =========================================
// UPDATE FORM PEMASUKAN
// =========================================

function updateFormPemasukan() {

    const unit =
        document.getElementById("pemasukanUnit");

    const detailSampah =
        document.getElementById(
            "detail-pengelolaan-sampah"
        );


    if (!unit || !detailSampah) {
        return;
    }


    // Sembunyikan detail terlebih dahulu
    detailSampah.style.display = "none";


    // Jika Pengelolaan Sampah
    if (
        unit.value === "PENGELOLAAN_SAMPAH"
    ) {

        detailSampah.style.display = "block";

    }


    // Update akun
    updateAkunPemasukan();
	
	 updatePelangganPemasukan();

}

// =========================================
// PESAN PEMASUKAN
// =========================================

function tampilPesanPemasukan(pesan, jenis) {

    const area =
        document.getElementById(
            "pesan-pemasukan"
        );


    if (!area) {
        return;
    }


    area.textContent = pesan;

    area.className =
        "pesan " + jenis;

}
// =========================================
// SIAPKAN FORM PEMASUKAN
// =========================================

function siapkanFormPemasukan() {

    setTanggalPemasukan();

    updateAkunPemasukan();

    updatePelangganPemasukan();

    updateFormPemasukan();
    
    loadDanTampilPemasukan();
}

async function ambilNamaPelangganPemasukan(pelangganId) {

    if (!pelangganId) {
        return "-";
    }

    try {

        const data =
            await ambilPelangganFirebase();

        const pelanggan =
            (data || []).find(function(item) {

                return item.id === pelangganId;

            });

        if (!pelanggan) {
            return "-";
        }

        return (
            pelanggan.kode +
            " - " +
            pelanggan.nama
        );

    } catch (error) {

        console.error(
            "Gagal mengambil nama pelanggan:",
            error
        );

        return "-";
    }
}

// =========================================
// TAMPIL DATA PEMASUKAN
// =========================================

async function tampilPemasukan(data) {

    const area =
        document.getElementById("daftar-pemasukan");

    if (!area) {
        return;
    }


    if (!data || data.length === 0) {

        area.innerHTML = `
            <p class="data-kosong">
                Belum ada data pemasukan.
            </p>
        `;

        return;
    }


    let total = 0;


    let html = `

        <div class="total-pemasukan">

            <span>Total Pemasukan</span>

            <strong>
                Rp0
            </strong>

        </div>


        <div class="tabel-scroll">

            <table class="tabel-pemasukan">

                <thead>

                    <tr>

                        <th>Tanggal</th>

                        <th>Unit Usaha</th>

                        <th>Pelanggan / Pihak</th>

                        <th>Akun</th>

                        <th>Detail</th>

                        <th>Media</th>

                        <th>Nominal</th>

                        <th>Aksi</th>

                    </tr>

                </thead>

                <tbody>
    `;


    // =====================================
    // TAMPILKAN DATA
    // =====================================

    for (const item of data) {

        const nominal =
            Number(item.nominal) || 0;


        total += nominal;


        // =====================================
        // UNIT USAHA
        // =====================================

        let unit = "-";


        if (
            item.unitUsaha ===
            "PENGELOLAAN_SAMPAH"
        ) {

            unit = "Pengelolaan Sampah";

        }

        else if (
            item.unitUsaha ===
            "AYAM_PETELUR"
        ) {

            unit = "Ayam Petelur";

        }

        else if (
            item.unitUsaha ===
            "BANK_SAMPAH"
        ) {

            unit = "Bank Sampah";

        }

        else if (
            item.unitUsaha ===
            "AFFILIATE"
        ) {

            unit = "Affiliate";

        }


        // =====================================
        // PELANGGAN / PIHAK
        // =====================================

        const pelanggan =
            await ambilNamaPelangganPemasukan(
                item.pelangganId
            );


        // =====================================
        // MEDIA
        // =====================================

        let media = "-";


        if (
            item.mediaTujuan === "KAS"
        ) {

            media = "Kas";

        }

        else if (
            item.mediaTujuan === "BANK"
        ) {

            media = "Bank";

        }

        else if (
            item.mediaTujuan === "DANA"
        ) {

            media = "DANA";

        }

        else if (
            item.mediaTujuan ===
            "SALDO_AFFILIATE"
        ) {

            media = "Saldo Affiliate";

        }


        // =====================================
        // DETAIL
        // =====================================

        let detail = "-";


        if (
            item.unitUsaha ===
            "PENGELOLAAN_SAMPAH"
        ) {

            detail = `

                ${item.jenisPendapatan || "-"}

                <br>

                ${item.rt || "-"} /
                ${item.rw || "-"}

                <br>

                ${item.namaPenyetor || "-"}

            `;

        }

        else {

            detail =
                item.keterangan || "-";

        }


        // =====================================
        // BARIS TABEL
        // =====================================

        html += `

            <tr>

                <td>
                    ${item.tanggal || "-"}
                </td>

                <td>
                    ${unit}
                </td>

                <td>
                    ${pelanggan}
                </td>

                <td>
                    ${item.akunKode || "-"}
                </td>

                <td>
                    ${detail}
                </td>

                <td>
                    ${media}
                </td>

                <td class="nominal">
                    ${formatRupiah(nominal)}
                </td>

                <td class="aksi">

                    <button
                        type="button"
                        class="btn-edit-pemasukan"
                        onclick="editPemasukan('${item.id}')"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-hapus-pemasukan"
                        onclick="hapusPemasukan('${item.id}')"
                    >
                        Hapus
                    </button>

                </td>

            </tr>

        `;

    }


    html += `

                </tbody>

            </table>

        </div>

    `;


    area.innerHTML = html;


    // =====================================
    // TOTAL PEMASUKAN
    // =====================================

    const totalElement =
        area.querySelector(
            ".total-pemasukan strong"
        );


    if (totalElement) {

        totalElement.textContent =
            formatRupiah(total);

    }

}

// =========================================
// LOAD DAN TAMPILKAN PEMASUKAN
// =========================================

async function loadDanTampilPemasukan() {

    const data =
        await loadPemasukanFirebase();

    tampilPemasukan(data);

}

// =========================================
// FILTER PEMASUKAN
// =========================================

window.filterPemasukan = async function() {

    const mulai =
        document.getElementById(
            "filterPemasukanMulai"
        ).value;

    const akhir =
        document.getElementById(
            "filterPemasukanAkhir"
        ).value;


    if (!mulai || !akhir) {

        tampilPesanPemasukan(
            "Tanggal mulai dan tanggal akhir harus diisi.",
            "error"
        );

        return;
    }


    if (mulai > akhir) {

        tampilPesanPemasukan(
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.",
            "error"
        );

        return;
    }


    const data =
        await loadPemasukanFirebase();


    const hasil =
        data.filter(function(item) {

            return (
                item.tanggal >= mulai &&
                item.tanggal <= akhir
            );

        });


    console.log(
        "Filter pemasukan:",
        mulai,
        "sampai",
        akhir
    );

    console.log(
        "Hasil filter:",
        hasil
    );


    tampilPemasukan(hasil);

};

// =========================================
// EDIT PEMASUKAN
// =========================================

window.editPemasukan = async function(id) {

    console.log(
        "Edit pemasukan:",
        id
    );


    const data =
        await ambilPemasukanFirebase(id);


    if (!data) {

        alert(
            "Data pemasukan tidak ditemukan."
        );

        return;

    }


    // Pastikan form pemasukan tampil

    tampilFormTransaksi("pemasukan");


    // Isi form

    document.getElementById(
        "pemasukanTanggal"
    ).value = data.tanggal || "";


    document.getElementById(
        "pemasukanUnit"
    ).value = data.unitUsaha || "";


   // Update akun berdasarkan unit

await updateAkunPemasukan();

await updatePelangganPemasukan(
    data.pelangganId || ""
);

document.getElementById(
    "pemasukanAkun"
).value =
    data.akunKode || "";


    document.getElementById(
        "pemasukanMedia"
    ).value = data.mediaTujuan || "";


    document.getElementById(
        "pemasukanNominal"
    ).value = data.nominal || "";


    document.getElementById(
        "pemasukanKeterangan"
    ).value = data.keterangan || "";


    document.getElementById(
        "pemasukanBukti"
    ).value = data.nomorBukti || "";


    // Detail Pengelolaan Sampah

    if (
        data.unitUsaha ===
        "PENGELOLAAN_SAMPAH"
    ) {

        document.getElementById(
            "pemasukanJenisSampah"
        ).value =
            data.jenisPendapatan || "";


        document.getElementById(
            "pemasukanRT"
        ).value =
            data.rt || "";


        document.getElementById(
            "pemasukanRW"
        ).value =
            data.rw || "";


        document.getElementById(
            "pemasukanPenyetor"
        ).value =
            data.namaPenyetor || "";

    }


    // Simpan ID yang sedang diedit

    window.idPemasukanSedangDiedit =
        id;

// =========================================
// UBAH TOMBOL MENJADI UPDATE
// =========================================

const tombolSimpan =
    document.getElementById(
        "btn-simpan-pemasukan"
    );

if (tombolSimpan) {

    tombolSimpan.textContent =
        "Update Pemasukan";

}

    console.log(
        "Data pemasukan siap diedit:",
        data
    );

};

// =========================================
// HAPUS PEMASUKAN
// =========================================

window.hapusPemasukan = async function(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus transaksi pemasukan ini?"
        );


    if (!yakin) {

        return;

    }


    const berhasil =
        await hapusPemasukanFirebase(id);


    if (!berhasil) {

        tampilPesanPemasukan(
            "Pemasukan gagal dihapus.",
            "error"
        );

        return;

    }


    tampilPesanPemasukan(
        "Pemasukan berhasil dihapus.",
        "success"
    );


    // Muat ulang daftar

    await loadDanTampilPemasukan();

};

// =========================================
// RESET FORM PEMASUKAN
// =========================================

function resetFormPemasukan() {

    // Tanggal
    const tanggal =
        document.getElementById("pemasukanTanggal");

    if (tanggal) {
        tanggal.value = tanggalHariIni();
    }


    // Unit usaha
    const unit =
        document.getElementById("pemasukanUnit");

    if (unit) {
        unit.value = "";
    }


    // Akun
    const akun =
        document.getElementById("pemasukanAkun");

    if (akun) {

        akun.innerHTML = `
            <option value="">
                -- Pilih Akun Pendapatan --
            </option>
        `;

        akun.value = "";

    }


    // Media tujuan
    const media =
        document.getElementById("pemasukanMedia");

    if (media) {
        media.value = "";
    }


    // Nominal
    const nominal =
        document.getElementById("pemasukanNominal");

    if (nominal) {
        nominal.value = "";
    }


    // Keterangan
    const keterangan =
        document.getElementById(
            "pemasukanKeterangan"
        );

    if (keterangan) {
        keterangan.value = "";
    }


    // Nomor bukti
    const bukti =
        document.getElementById(
            "pemasukanBukti"
        );

    if (bukti) {
        bukti.value = "";
    }


    // Jenis pendapatan
    const jenis =
        document.getElementById(
            "pemasukanJenisSampah"
        );

    if (jenis) {
        jenis.value = "";
    }


    // RT
    const rt =
        document.getElementById(
            "pemasukanRT"
        );

    if (rt) {
        rt.value = "";
    }


    // RW
    const rw =
        document.getElementById(
            "pemasukanRW"
        );

    if (rw) {
        rw.value = "";
    }


    // Nama penyetor
    const penyetor =
        document.getElementById(
            "pemasukanPenyetor"
        );

    if (penyetor) {
        penyetor.value = "";
    }


    // Sembunyikan detail pengelolaan sampah
    const detailSampah =
        document.getElementById(
            "detail-pengelolaan-sampah"
        );

    if (detailSampah) {
        detailSampah.style.display = "none";
    }


    // Keluar dari mode edit
    window.idPemasukanSedangDiedit = null;

// =========================================
// KEMBALIKAN TOMBOL SIMPAN
// =========================================

const tombolSimpan =
    document.getElementById(
        "btn-simpan-pemasukan"
    );

if (tombolSimpan) {

    tombolSimpan.textContent =
        "Simpan Pemasukan";

}

}
// =========================================
// PENGELUARAN UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TANGGAL PENGELUARAN
// =========================================

function setTanggalPengeluaran() {

    const input =
        document.getElementById(
            "pengeluaranTanggal"
        );

    if (!input) {
        return;
    }

    input.value =
        tanggalHariIni();

}


// =========================================
// UPDATE AKUN PENGELUARAN
// =========================================
//
// BEBAN
// → ambil akun jenis beban sesuai unit
//
// ASET
// → akun otomatis 1400 - Aset Tetap
//
// =========================================

async function updateAkunPengeluaran() {

    const unit =
        document.getElementById(
            "pengeluaranUnit"
        );

    const jenis =
        document.getElementById(
            "pengeluaranJenis"
        );

    const akun =
        document.getElementById(
            "pengeluaranAkun"
        );

    const groupAset =
        document.getElementById(
            "group-pengeluaran-aset"
        );


    if (
        !unit ||
        !jenis ||
        !akun
    ) {

        return;

    }


    // =====================================
    // RESET AKUN
    // =====================================

    akun.innerHTML = `
        <option value="">
            -- Pilih Akun --
        </option>
    `;


    // =====================================
    // RESET TAMPILAN ASET
    // =====================================

    if (groupAset) {

        groupAset.style.display =
            "none";

    }


    // =====================================
    // BELUM PILIH JENIS
    // =====================================

    if (!jenis.value) {

        return;

    }


    // =====================================
    // PEMBELIAN ASET
    // =====================================

    if (
        jenis.value === "ASET"
    ) {

        // ---------------------------------
        // AKUN 1400 OTOMATIS
        // ---------------------------------

        const option =
            document.createElement(
                "option"
            );


        option.value =
            "1400";


        option.textContent =
            "1400 - Aset Tetap";


        option.selected =
            true;


        akun.appendChild(
            option
        );


        // ---------------------------------
        // TAMPILKAN ASET
        // ---------------------------------

        if (groupAset) {

            groupAset.style.display =
                "block";

        }


        return;

    }


    // =====================================
    // BEBAN OPERASIONAL
    // =====================================

    if (
        jenis.value !== "BEBAN"
    ) {

        return;

    }


    if (!unit.value) {

        return;

    }


    try {

        const data =
            await ambilAkunFirebase();


        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.jenis === "beban" &&
                    item.unitUsaha === unit.value &&
                    item.status !== "nonaktif"
                );

            });


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
            "Gagal memuat akun pengeluaran:",
            error
        );


        akun.innerHTML = `
            <option value="">
                Gagal memuat akun
            </option>
        `;

    }

}


// =========================================
// UPDATE ASET
// =========================================

async function updateAsetPengeluaran(
    nilaiTerpilih = ""
) {

    const select =
        document.getElementById(
            "pengeluaranAset"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            -- Pilih Aset --
        </option>
    `;


    try {

        const data =
            await ambilMasterAsetFirebase();


        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.status !== "nonaktif"
                );

            });


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

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Gagal memuat master aset:",
            error
        );


        select.innerHTML = `
            <option value="">
                Gagal memuat aset
            </option>
        `;

    }

}


// =========================================
// UPDATE SUPPLIER / PEMASOK
// =========================================

async function updateSupplierPengeluaran(
    nilaiTerpilih = ""
) {

    const select =
        document.getElementById(
            "pengeluaranSupplier"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            -- Pilih Supplier / Pemasok --
        </option>
    `;


    try {

        const data =
            await ambilSupplierFirebase();


        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.status !== "nonaktif"
                );

            });


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

                option.selected =
                    true;

            }


            select.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Gagal memuat supplier/pemasok:",
            error
        );


        select.innerHTML = `
            <option value="">
                Gagal memuat supplier / pemasok
            </option>
        `;

    }

}


// =========================================
// UPDATE FORM PENGELUARAN
// =========================================

function updateFormPengeluaran() {

    updateAkunPengeluaran();

    updateAsetPengeluaran();

    updateSupplierPengeluaran();

}


// =========================================
// PESAN PENGELUARAN
// =========================================

function tampilPesanPengeluaran(
    pesan,
    jenis
) {

    const area =
        document.getElementById(
            "pesan-pengeluaran"
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
// SIAPKAN FORM PENGELUARAN
// =========================================

function siapkanFormPengeluaran() {

    setTanggalPengeluaran();

    updateAkunPengeluaran();

    updateAsetPengeluaran();

    updateSupplierPengeluaran();

}


// =========================================
// BUKA FORM PENGELUARAN
// =========================================

function bukaFormPengeluaran() {

    tampilFormTransaksi(
        "pengeluaran"
    );

    siapkanFormPengeluaran();

}


// =========================================
// AMBIL NAMA SUPPLIER
// =========================================

async function ambilNamaSupplierPengeluaran(
    supplierId
) {

    if (!supplierId) {
        return "-";
    }


    try {

        const data =
            await ambilSupplierFirebase();


        const supplier =
            (data || []).find(function(item) {

                return (
                    item.id === supplierId
                );

            });


        if (!supplier) {
            return "-";
        }


        return (
            supplier.kode +
            " - " +
            supplier.nama
        );


    } catch (error) {

        console.error(
            "Gagal mengambil nama supplier:",
            error
        );


        return "-";

    }

}


// =========================================
// TAMPIL DATA PENGELUARAN
// =========================================

async function tampilPengeluaran(data) {

    const area =
        document.getElementById(
            "daftar-pengeluaran"
        );


    if (!area) {
        return;
    }


    if (!data || data.length === 0) {

        area.innerHTML = `
            <p class="data-kosong">
                Belum ada data pengeluaran.
            </p>
        `;

        return;

    }


    let total = 0;


    let html = `

        <div class="total-pengeluaran">

            <span>Total Pengeluaran</span>

            <strong>
                Rp0
            </strong>

        </div>


        <div class="tabel-scroll">

            <table class="tabel-pengeluaran">

                <thead>

                    <tr>

                        <th>Tanggal</th>

                        <th>Unit Usaha</th>

                        <th>Jenis</th>

                        <th>Supplier / Pemasok</th>

                        <th>Akun</th>

                        <th>Aset</th>

                        <th>Media</th>

                        <th>Nominal</th>

                        <th>Keterangan</th>

                        <th>Aksi</th>

                    </tr>

                </thead>


                <tbody>

    `;


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

            unit =
                "Pengelolaan Sampah";

        }

        else if (
            item.unitUsaha ===
            "AYAM_PETELUR"
        ) {

            unit =
                "Ayam Petelur";

        }

        else if (
            item.unitUsaha ===
            "BANK_SAMPAH"
        ) {

            unit =
                "Bank Sampah";

        }

        else if (
            item.unitUsaha ===
            "AFFILIATE"
        ) {

            unit =
                "Affiliate";

        }


        // =====================================
        // JENIS
        // =====================================

        const jenis =
            item.jenisPengeluaran === "ASET"
                ? "Pembelian Aset"
                : "Beban Operasional";


        // =====================================
        // MEDIA
        // =====================================

        let media = "-";


        if (
            item.mediaAsal ===
            "KAS"
        ) {

            media =
                "Kas";

        }

        else if (
            item.mediaAsal ===
            "BANK"
        ) {

            media =
                "Bank";

        }

        else if (
            item.mediaAsal ===
            "DANA"
        ) {

            media =
                "DANA";

        }

        else if (
            item.mediaAsal ===
            "SALDO_AFFILIATE"
        ) {

            media =
                "Saldo Affiliate";

        }


        // =====================================
        // SUPPLIER
        // =====================================

        const supplier =
            await ambilNamaSupplierPengeluaran(
                item.supplierId
            );


        // =====================================
        // ASET
        // =====================================

        let namaAset = "-";


        if (
            item.asetId
        ) {

            try {

                const daftarAset =
                    await ambilMasterAsetFirebase();


                const aset =
                    (daftarAset || []).find(
                        function(itemAset) {

                            return (
                                itemAset.id ===
                                item.asetId
                            );

                        }
                    );


                if (aset) {

                    namaAset =
                        aset.kode +
                        " - " +
                        aset.nama;

                }

            } catch (error) {

                console.error(
                    "Gagal mengambil nama aset:",
                    error
                );

            }

        }


        // =====================================
        // BARIS
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
                    ${jenis}
                </td>

                <td>
                    ${supplier}
                </td>

                <td>
                    ${item.akunKode || "-"}
                </td>

                <td>
                    ${namaAset}
                </td>

                <td>
                    ${media}
                </td>

                <td class="nominal">
                    ${formatRupiah(nominal)}
                </td>

                <td>
                    ${item.keterangan || "-"}
                </td>

                <td class="aksi">

                    <button
                        type="button"
                        class="btn-edit"
                        onclick="editPengeluaran('${item.id}')"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-hapus"
                        onclick="hapusPengeluaran('${item.id}')"
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


    area.innerHTML =
        html;


    const totalElement =
        area.querySelector(
            ".total-pengeluaran strong"
        );


    if (totalElement) {

        totalElement.textContent =
            formatRupiah(total);

    }

}


// =========================================
// LOAD DAN TAMPILKAN PENGELUARAN
// =========================================

async function loadDanTampilPengeluaran() {

    const mulaiInput =
        document.getElementById("filterPengeluaranMulai");

    const akhirInput =
        document.getElementById("filterPengeluaranAkhir");


    // =====================================
    // SET BULAN AKTIF
    // =====================================

    if (mulaiInput && akhirInput) {

        const sekarang = new Date();

        const tahun =
            sekarang.getFullYear();

        const bulan =
            sekarang.getMonth();


        // Tanggal pertama bulan aktif
        const tanggalMulai =
            new Date(
                tahun,
                bulan,
                1
            );


        // Tanggal terakhir bulan aktif
        const tanggalAkhir =
            new Date(
                tahun,
                bulan + 1,
                0
            );


        function formatTanggalFilter(tanggal) {

            const yyyy =
                tanggal.getFullYear();

            const mm =
                String(
                    tanggal.getMonth() + 1
                ).padStart(2, "0");

            const dd =
                String(
                    tanggal.getDate()
                ).padStart(2, "0");

            return `${yyyy}-${mm}-${dd}`;

        }


        mulaiInput.value =
            formatTanggalFilter(
                tanggalMulai
            );


        akhirInput.value =
            formatTanggalFilter(
                tanggalAkhir
            );

    }


    // =====================================
    // AMBIL DATA
    // =====================================

    const data =
        await loadPengeluaranFirebase();


    // =====================================
    // FILTER BULAN AKTIF
    // =====================================

    const mulai =
        mulaiInput
            ? mulaiInput.value
            : "";


    const akhir =
        akhirInput
            ? akhirInput.value
            : "";


    let hasil = data;


    if (mulai && akhir) {

        hasil =
            data.filter(function(item) {

                return (
                    item.tanggal >= mulai &&
                    item.tanggal <= akhir
                );

            });

    }


    // =====================================
    // TAMPILKAN
    // =====================================

    await tampilPengeluaran(hasil);

}

// =========================================
// FILTER TANGGAL PENGELUARAN
// =========================================

async function filterPengeluaranTanggal() {

    const mulaiInput =
        document.getElementById(
            "filterPengeluaranMulai"
        );

    const akhirInput =
        document.getElementById(
            "filterPengeluaranAkhir"
        );


    if (!mulaiInput || !akhirInput) {
        return;
    }


    const mulai =
        mulaiInput.value;

    const akhir =
        akhirInput.value;


    // =====================================
    // VALIDASI
    // =====================================

    if (!mulai || !akhir) {

        alert(
            "Silakan pilih tanggal mulai dan tanggal akhir."
        );

        return;

    }


    if (mulai > akhir) {

        alert(
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir."
        );

        return;

    }


    // =====================================
    // AMBIL DATA
    // =====================================

    const data =
        await loadPengeluaranFirebase();


    // =====================================
    // FILTER
    // =====================================

    const hasil =
        (data || []).filter(function(item) {

            return (
                item.tanggal >= mulai &&
                item.tanggal <= akhir
            );

        });


    // =====================================
    // TAMPILKAN HASIL
    // =====================================

    await tampilPengeluaran(hasil);

}


// =========================================
// RESET FILTER PENGELUARAN
// =========================================

async function resetFilterPengeluaran() {

    const mulaiInput =
        document.getElementById(
            "filterPengeluaranMulai"
        );

    const akhirInput =
        document.getElementById(
            "filterPengeluaranAkhir"
        );


    if (!mulaiInput || !akhirInput) {
        return;
    }


    // =====================================
    // KEMBALI KE BULAN AKTIF
    // =====================================

    const sekarang =
        new Date();


    const tahun =
        sekarang.getFullYear();


    const bulan =
        sekarang.getMonth();


    const tanggalMulai =
        new Date(
            tahun,
            bulan,
            1
        );


    const tanggalAkhir =
        new Date(
            tahun,
            bulan + 1,
            0
        );


    function formatTanggalFilter(tanggal) {

        const yyyy =
            tanggal.getFullYear();

        const mm =
            String(
                tanggal.getMonth() + 1
            ).padStart(2, "0");

        const dd =
            String(
                tanggal.getDate()
            ).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;

    }


    mulaiInput.value =
        formatTanggalFilter(
            tanggalMulai
        );


    akhirInput.value =
        formatTanggalFilter(
            tanggalAkhir
        );


    // =====================================
    // TAMPILKAN DATA BULAN AKTIF
    // =====================================

    await loadDanTampilPengeluaran();

}

// =========================================
// EDIT PENGELUARAN
// =========================================

async function editPengeluaran(id) {

    const data =
        await ambilPengeluaranFirebase(id);


    if (!data) {

        tampilPesanPengeluaran(
            "Data pengeluaran tidak ditemukan.",
            "error"
        );

        return;

    }


    tampilFormTransaksi(
        "pengeluaran"
    );


    // =====================================
    // TANGGAL
    // =====================================

    document.getElementById(
        "pengeluaranTanggal"
    ).value =
        data.tanggal || "";


    // =====================================
    // UNIT USAHA
    // =====================================

    document.getElementById(
        "pengeluaranUnit"
    ).value =
        data.unitUsaha || "";


    // =====================================
    // JENIS
    // =====================================

    const jenis =
        document.getElementById(
            "pengeluaranJenis"
        );


    if (jenis) {

        jenis.value =
            data.jenisPengeluaran ||
            "BEBAN";

    }


    // =====================================
    // UPDATE AKUN + ASET
    // =====================================

    await updateAkunPengeluaran();

    await updateAsetPengeluaran(
        data.asetId || ""
    );


    // =====================================
    // AKUN
    // =====================================

    document.getElementById(
        "pengeluaranAkun"
    ).value =
        data.akunKode || "";


    // =====================================
    // ASET
    // =====================================

    const aset =
        document.getElementById(
            "pengeluaranAset"
        );


    if (aset) {

        aset.value =
            data.asetId || "";

    }


    // =====================================
    // UPDATE SUPPLIER
    // =====================================

    await updateSupplierPengeluaran(
        data.supplierId || ""
    );


    // =====================================
    // MEDIA
    // =====================================

    document.getElementById(
        "pengeluaranMedia"
    ).value =
        data.mediaAsal || "";


    // =====================================
    // NOMINAL
    // =====================================

    document.getElementById(
        "pengeluaranNominal"
    ).value =
        data.nominal || "";


    // =====================================
    // KETERANGAN
    // =====================================

    document.getElementById(
        "pengeluaranKeterangan"
    ).value =
        data.keterangan || "";


    // =====================================
    // NOMOR BUKTI
    // =====================================

    document.getElementById(
        "pengeluaranBukti"
    ).value =
        data.nomorBukti || "";


    // =====================================
    // SIMPAN ID EDIT
    // =====================================

    window.pengeluaranSedangDiedit =
        id;


    // =====================================
    // UBAH TOMBOL
    // =====================================

    const tombol =
        document.getElementById(
            "btn-simpan-pengeluaran"
        );


    if (tombol) {

        tombol.textContent =
            "Update Pengeluaran";

    }


    tampilPesanPengeluaran(
        "Mode edit pengeluaran.",
        "success"
    );

}


// =========================================
// HAPUS PENGELUARAN
// =========================================

async function hapusPengeluaran(id) {

    const yakin =
        confirm(
            "Yakin ingin menghapus data pengeluaran ini?"
        );


    if (!yakin) {
        return;
    }


    tampilPesanPengeluaran(
        "Menghapus data...",
        "success"
    );


    const berhasil =
        await hapusPengeluaranFirebase(id);


    if (!berhasil) {

        tampilPesanPengeluaran(
            "Pengeluaran gagal dihapus.",
            "error"
        );

        return;

    }


    if (
        window.pengeluaranSedangDiedit === id
    ) {

        window.pengeluaranSedangDiedit =
            null;


        resetFormPengeluaran();

    }


    tampilPesanPengeluaran(
        "Pengeluaran berhasil dihapus.",
        "success"
    );


    await loadDanTampilPengeluaran();

}


// =========================================
// RESET FORM PENGELUARAN
// =========================================

function resetFormPengeluaran() {

    const tanggal =
        document.getElementById(
            "pengeluaranTanggal"
        );

    const unit =
        document.getElementById(
            "pengeluaranUnit"
        );

    const jenis =
        document.getElementById(
            "pengeluaranJenis"
        );

    const aset =
        document.getElementById(
            "pengeluaranAset"
        );

    const supplier =
        document.getElementById(
            "pengeluaranSupplier"
        );

    const akun =
        document.getElementById(
            "pengeluaranAkun"
        );

    const media =
        document.getElementById(
            "pengeluaranMedia"
        );

    const nominal =
        document.getElementById(
            "pengeluaranNominal"
        );

    const keterangan =
        document.getElementById(
            "pengeluaranKeterangan"
        );

    const bukti =
        document.getElementById(
            "pengeluaranBukti"
        );


    if (tanggal) {

        tanggal.value =
            tanggalHariIni();

    }


    if (unit) {

        unit.value =
            "";

    }


    if (jenis) {

        jenis.value =
            "";

    }


    if (aset) {

        aset.innerHTML = `
            <option value="">
                -- Pilih Aset --
            </option>
        `;

        aset.value =
            "";

    }


    const groupAset =
        document.getElementById(
            "group-pengeluaran-aset"
        );


    if (groupAset) {

        groupAset.style.display =
            "none";

    }


    if (supplier) {

        supplier.innerHTML = `
            <option value="">
                -- Pilih Supplier / Pemasok --
            </option>
        `;

    }


    if (akun) {

        akun.innerHTML = `
            <option value="">
                -- Pilih Akun --
            </option>
        `;

    }


    if (media) {

        media.value =
            "";

    }


    if (nominal) {

        nominal.value =
            "";

    }


    if (keterangan) {

        keterangan.value =
            "";

    }


    if (bukti) {

        bukti.value =
            "";

    }


    // =====================================
    // KEMBALIKAN TOMBOL SIMPAN
    // =====================================

    const tombolSimpan =
        document.getElementById(
            "btn-simpan-pengeluaran"
        );


    if (tombolSimpan) {

        tombolSimpan.textContent =
            "Simpan Pengeluaran";

    }

}



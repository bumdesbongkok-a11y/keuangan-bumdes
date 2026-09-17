// =========================================
// MASTER DATA UI
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// TAMPIL KONTEN
// =========================================

function tampilMasterDataContent(html) {

    const container =
        document.getElementById(
            "master-data-content"
        );

    if (!container) {

        console.error(
            "Container master-data-content tidak ditemukan."
        );

        return;

    }

    container.innerHTML = html;

}


// =========================================
// SEMBUNYIKAN MENU MASTER DATA
// =========================================

function sembunyikanMenuMasterData() {

    const menu =
        document.querySelector(
            ".menu-master-data"
        );

    const info =
        document.querySelector(
            ".info-master-data"
        );

    if (menu) {

        menu.style.display = "none";

    }

    if (info) {

        info.style.display = "none";

    }

}


// =========================================
// TAMPILKAN MENU MASTER DATA
// =========================================

function tampilkanMenuMasterData() {

    const menu =
        document.querySelector(
            ".menu-master-data"
        );

    const info =
        document.querySelector(
            ".info-master-data"
        );

    if (menu) {

        menu.style.display = "";

    }

    if (info) {

        info.style.display = "";

    }

}


// =========================================
// UNIT USAHA
// =========================================

function tampilMasterUnitUsaha() {

    sembunyikanMenuMasterData();

    tampilMasterDataContent(`

        <div class="form-master-data">

            <button
                type="button"
                class="btn-kembali"
                onclick="tampilMenuMasterData()"
            >
                ← Kembali
            </button>

            <h3>
                Unit Usaha
            </h3>

            <p>
                Kelola unit usaha yang dimiliki
                BUMDes Sumber Rejeki.
            </p>

            <button
                type="button"
                class="btn-simpan"
                onclick="formTambahUnitUsaha()"
            >
                + Tambah Unit Usaha
            </button>

            <button
                type="button"
                class="btn-simpan"
                onclick="pasangMasterUnitUsahaResmi()"
            >
                🔒 Pasang Master Unit Usaha Resmi
            </button>

            <div
                id="form-unit-usaha"
            ></div>

            <div
                id="data-unit-usaha"
            >

                <p class="data-kosong">
                    Data unit usaha belum dimuat.
                </p>

            </div>

        </div>

    `);

}


// =========================================
// FORM TAMBAH UNIT USAHA
// =========================================

function formTambahUnitUsaha() {

    const container =
        document.getElementById(
            "form-unit-usaha"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Tambah Unit Usaha
            </h4>

            <div class="form-group">

                <label>
                    Nama Unit Usaha
                </label>

                <input
                    type="text"
                    id="unitUsahaNama"
                    placeholder="Contoh: Ayam Petelur"
                >

            </div>

            <div class="form-group">

                <label>
                    Kode Unit Usaha
                </label>

                <input
                    type="text"
                    id="unitUsahaKode"
                    placeholder="Contoh: AYAM_PETELUR"
                >

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <input
                    type="text"
                    id="unitUsahaKeterangan"
                    placeholder="Keterangan unit usaha"
                >

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="unitUsahaStatus"
                >

                    <option value="aktif">
                        Aktif
                    </option>

                    <option value="nonaktif">
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="simpanUnitUsaha()"
            >
                Simpan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormUnitUsaha()"
            >
                Batal
            </button>

        </div>

    `;

}


// =========================================
// TUTUP FORM UNIT USAHA
// =========================================

function tutupFormUnitUsaha() {

    const container =
        document.getElementById(
            "form-unit-usaha"
        );

    if (container) {

        container.innerHTML = "";

    }

}


// =========================================
// TAMPIL DATA UNIT USAHA
// =========================================

function tampilDataUnitUsaha(data) {

    const container =
        document.getElementById(
            "data-unit-usaha"
        );

    if (!container) {

        return;

    }

    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `

            <p class="data-kosong">
                Belum ada data unit usaha.
            </p>

        `;

        return;

    }

    let html = `

        <div class="tabel-master-data">

            <h4>
                Daftar Unit Usaha
            </h4>

    `;

    data.forEach(function(item) {

        const status =
            item.status === "aktif"
                ? "Aktif"
                : "Nonaktif";

        html += `

            <div class="item-data-master">

                <div>

                    <strong>
                        ${item.nama || "-"}
                    </strong>

                    <small>
                        Kode:
                        ${item.kode || "-"}
                    </small>

                    <small>
                        Status:
                        ${status}
                    </small>

                    ${
                        item.keterangan
                            ? `
                                <small>
                                    ${item.keterangan}
                                </small>
                              `
                            : ""
                    }

                </div>

                <div>

                    <button
                        type="button"
                        onclick='formEditUnitUsaha(
                            ${JSON.stringify(item)}
                        )'
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="hapusUnitUsaha(
                            '${item.id}'
                        )"
                    >
                        Hapus
                    </button>

                </div>

            </div>

        `;

    });

    html += `

        </div>

    `;

    container.innerHTML =
        html;

}


// =========================================
// FORM EDIT UNIT USAHA
// =========================================

function formEditUnitUsaha(item) {

    const container =
        document.getElementById(
            "form-unit-usaha"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Edit Unit Usaha
            </h4>

            <input
                type="hidden"
                id="unitUsahaId"
                value="${item.id}"
            >

            <div class="form-group">

                <label>
                    Nama Unit Usaha
                </label>

                <input
                    type="text"
                    id="unitUsahaNama"
                    value="${item.nama || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Kode Unit Usaha
                </label>

                <input
                    type="text"
                    id="unitUsahaKode"
                    value="${item.kode || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <input
                    type="text"
                    id="unitUsahaKeterangan"
                    value="${item.keterangan || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="unitUsahaStatus"
                >

                    <option
                        value="aktif"
                        ${
                            item.status === "aktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Aktif
                    </option>

                    <option
                        value="nonaktif"
                        ${
                            item.status === "nonaktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="updateUnitUsaha()"
            >
                Simpan Perubahan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormUnitUsaha()"
            >
                Batal
            </button>

        </div>

    `;

}


// =========================================
// AKUN
// =========================================

function tampilMasterAkun() {

    sembunyikanMenuMasterData();

    tampilMasterDataContent(`

        <div class="form-master-data">

            <button
                type="button"
                class="btn-kembali"
                onclick="tampilMenuMasterData()"
            >
                ← Kembali
            </button>

            <h3>
                Akun / Rekening
            </h3>

            <p>
                Kelola akun dan rekening
                yang digunakan dalam transaksi.
            </p>

            <button
                type="button"
                class="btn-simpan"
                onclick="formTambahAkun()"
            >
                + Tambah Akun
            </button>

            <button
                type="button"
                class="btn-simpan"
                onclick="pasangMasterAkunResmi()"
            >
                🔒 Pasang Master Akun Resmi
            </button>

            <button
                type="button"
                class="btn-simpan"
                onclick="prosesLengkapiUnitUsahaAkunPendapatan()"
            >
                🔗 Lengkapi Unit Usaha Akun Pendapatan
            </button>

            <button
                type="button"
                class="btn-simpan"
                onclick="prosesLengkapiUnitUsahaAkunBeban()"
            >
                🔗 Lengkapi Unit Usaha Akun Beban
            </button>

            <div
                id="form-akun"
            ></div>

            <div
                id="data-akun"
            >

                <p class="data-kosong">
                    Data akun sedang dimuat...
                </p>

            </div>

        </div>

    `);

}


// =========================================
// BANTUAN DROPDOWN UNIT USAHA
// =========================================

async function muatDropdownUnitUsahaAkun(
    nilaiTerpilih = ""
) {

    const container =
        document.getElementById(
            "akunUnitUsaha"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

        <option value="">
            Memuat unit usaha...
        </option>

    `;

    try {

        const data =
            await ambilUnitUsahaFirebase();

        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.status !== "nonaktif"
                );

            });

        container.innerHTML = `

            <option value="">
                -- Pilih Unit Usaha --
            </option>

        `;

        daftar.forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.kode || "";

            option.textContent =
                (item.nama || "-") +
                " (" +
                (item.kode || "-") +
                ")";

            if (
                item.kode === nilaiTerpilih
            ) {

                option.selected = true;

            }

            container.appendChild(
                option
            );

        });

    } catch (error) {

        console.error(
            "Gagal memuat unit usaha akun:",
            error
        );

        container.innerHTML = `

            <option value="">
                Gagal memuat unit usaha
            </option>

        `;

    }

}


// =========================================
// TAMPIL / SEMBUNYIKAN UNIT USAHA AKUN
// =========================================

function aturUnitUsahaAkun() {

    const jenis =
        document.getElementById(
            "akunJenis"
        );

    const group =
        document.getElementById(
            "akunUnitUsahaGroup"
        );

    const select =
        document.getElementById(
            "akunUnitUsaha"
        );

    if (
        !jenis ||
        !group ||
        !select
    ) {

        return;

    }

    if (
        jenis.value === "pendapatan" ||
        jenis.value === "beban"
    ) {

        group.style.display = "";

        select.required = true;

    } else {

        group.style.display = "none";

        select.required = false;

        select.value = "";

    }

}


// =========================================
// FORM TAMBAH AKUN
// =========================================

async function formTambahAkun() {

    const container =
        document.getElementById(
            "form-akun"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Tambah Akun
            </h4>

            <div class="form-group">

                <label>
                    Kode Akun
                </label>

                <input
                    type="text"
                    id="akunKode"
                    placeholder="Contoh: 1100"
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Akun
                </label>

                <input
                    type="text"
                    id="akunNama"
                    placeholder="Contoh: Kas"
                >

            </div>

            <div class="form-group">

                <label>
                    Jenis Akun
                </label>

                <select
                    id="akunJenis"
                    onchange="aturUnitUsahaAkun()"
                >

                    <option value="">
                        Pilih Jenis Akun
                    </option>

                    <option value="aset">
                        Aset
                    </option>

                    <option value="kewajiban">
                        Kewajiban
                    </option>

                    <option value="modal">
                        Modal
                    </option>

                    <option value="pendapatan">
                        Pendapatan
                    </option>

                    <option value="beban">
                        Beban
                    </option>

                </select>

            </div>

            <div
                class="form-group"
                id="akunUnitUsahaGroup"
                style="display:none;"
            >

                <label>
                    Unit Usaha
                </label>

                <select
                    id="akunUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <input
                    type="text"
                    id="akunKeterangan"
                    placeholder="Keterangan akun"
                >

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="akunStatus"
                >

                    <option value="aktif">
                        Aktif
                    </option>

                    <option value="nonaktif">
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="simpanAkun()"
            >
                Simpan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormAkun()"
            >
                Batal
            </button>

        </div>

    `;

    await muatDropdownUnitUsahaAkun();

    aturUnitUsahaAkun();

}


// =========================================
// TUTUP FORM AKUN
// =========================================

function tutupFormAkun() {

    const container =
        document.getElementById(
            "form-akun"
        );

    if (container) {

        container.innerHTML = "";

    }

}


// =========================================
// TAMPIL DATA AKUN
// =========================================

function tampilDataAkun(data) {

    const container =
        document.getElementById(
            "data-akun"
        );

    if (!container) {

        return;

    }

    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `

            <p class="data-kosong">
                Belum ada data akun.
            </p>

        `;

        return;

    }

    let html = `

        <div class="tabel-master-data">

            <h4>
                Daftar Akun / Rekening
            </h4>

    `;

    data.forEach(function(item) {

        const status =
            item.status === "aktif"
                ? "Aktif"
                : "Nonaktif";

        const jenis =
            item.jenis
                ? item.jenis.charAt(0).toUpperCase()
                    + item.jenis.slice(1)
                : "-";

        html += `

            <div class="item-data-master">

                <div>

                    <strong>
                        ${item.nama || "-"}
                    </strong>

                    <small>
                        Kode:
                        ${item.kode || "-"}
                    </small>

                    <small>
                        Jenis:
                        ${jenis}
                    </small>

                    ${
                        (
                            item.jenis === "pendapatan" ||
                            item.jenis === "beban"
                        ) &&
                        item.unitUsaha
                            ? `
                                <small>
                                    Unit Usaha:
                                    ${item.unitUsaha}
                                </small>
                              `
                            : ""
                    }

                    <small>
                        Status:
                        ${status}
                    </small>

                    ${
                        item.keterangan
                            ? `
                                <small>
                                    ${item.keterangan}
                                </small>
                              `
                            : ""
                    }

                </div>

                <div>

                    <button
                        type="button"
                        onclick='formEditAkun(
                            ${JSON.stringify(item)}
                        )'
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="hapusAkun('${item.id}')"
                    >
                        Hapus
                    </button>

                </div>

            </div>

        `;

    });

    html += `

        </div>

    `;

    container.innerHTML =
        html;

}


// =========================================
// FORM EDIT AKUN
// =========================================

async function formEditAkun(item) {

    const container =
        document.getElementById(
            "form-akun"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Edit Akun
            </h4>

            <input
                type="hidden"
                id="akunId"
                value="${item.id}"
            >

            <div class="form-group">

                <label>
                    Kode Akun
                </label>

                <input
                    type="text"
                    id="akunKode"
                    value="${item.kode || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Akun
                </label>

                <input
                    type="text"
                    id="akunNama"
                    value="${item.nama || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Jenis Akun
                </label>

                <select
                    id="akunJenis"
                    onchange="aturUnitUsahaAkun()"
                >

                    <option
                        value="aset"
                        ${
                            item.jenis === "aset"
                                ? "selected"
                                : ""
                        }
                    >
                        Aset
                    </option>

                    <option
                        value="kewajiban"
                        ${
                            item.jenis === "kewajiban"
                                ? "selected"
                                : ""
                        }
                    >
                        Kewajiban
                    </option>

                    <option
                        value="modal"
                        ${
                            item.jenis === "modal"
                                ? "selected"
                                : ""
                        }
                    >
                        Modal
                    </option>

                    <option
                        value="pendapatan"
                        ${
                            item.jenis === "pendapatan"
                                ? "selected"
                                : ""
                        }
                    >
                        Pendapatan
                    </option>

                    <option
                        value="beban"
                        ${
                            item.jenis === "beban"
                                ? "selected"
                                : ""
                        }
                    >
                        Beban
                    </option>

                </select>

            </div>

            <div
                class="form-group"
                id="akunUnitUsahaGroup"
                style="display:none;"
            >

                <label>
                    Unit Usaha
                </label>

                <select
                    id="akunUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <input
                    type="text"
                    id="akunKeterangan"
                    value="${item.keterangan || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="akunStatus"
                >

                    <option
                        value="aktif"
                        ${
                            item.status === "aktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Aktif
                    </option>

                    <option
                        value="nonaktif"
                        ${
                            item.status === "nonaktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="updateAkun()"
            >
                Simpan Perubahan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormAkun()"
            >
                Batal
            </button>

        </div>

    `;

    await muatDropdownUnitUsahaAkun(
        item.unitUsaha || ""
    );

    aturUnitUsahaAkun();

}


// =========================================
// PELANGGAN / PIHAK
// =========================================

async function tampilMasterPihak() {

    sembunyikanMenuMasterData();

    tampilMasterDataContent(`

        <div class="form-master-data">

            <button
                type="button"
                class="btn-kembali"
                onclick="tampilMenuMasterData()"
            >
                ← Kembali
            </button>

            <h3>
                Pelanggan / Pihak
            </h3>

            <p>
                Kelola data pelanggan atau pihak
                yang berkaitan dengan transaksi BUMDes.
            </p>

            <button
                type="button"
                class="btn-simpan"
                onclick="formTambahPelanggan()"
            >
                + Tambah Pelanggan
            </button>

            <div
                id="form-pelanggan"
            ></div>

            <div
                id="data-pelanggan"
            >

                <p class="data-kosong">
                    Data pelanggan sedang dimuat...
                </p>

            </div>

        </div>

    `);

}


// =========================================
// FORM TAMBAH PELANGGAN
// =========================================

function formTambahPelanggan() {

    const container =
        document.getElementById(
            "form-pelanggan"
        );

    if (!container) {

        return;

    }

    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Tambah Pelanggan
            </h4>

            <div class="form-group">

                <label>
                    Kode Pelanggan
                </label>

                <input
                    type="text"
                    id="pelangganKode"
                    value="Otomatis"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Pelanggan / Pihak
                </label>

                <input
                    type="text"
                    id="pelangganNama"
                    placeholder="Nama pelanggan / pihak"
                >

            </div>

            <div class="form-group">

                <label>
                    No. HP
                </label>

                <input
                    type="text"
                    id="pelangganNoHp"
                    placeholder="Contoh: 08123456789"
                >

            </div>

            <div class="form-group">

                <label>
                    Alamat
                </label>

                <textarea
                    id="pelangganAlamat"
                    placeholder="Alamat pelanggan / pihak"
                    rows="3"
                ></textarea>

            </div>

            <div class="form-group">

                <label>
                    Jenis Pelanggan
                </label>

                <select
                    id="pelangganJenis"
                >

                    <option value="perorangan">
                        Perorangan
                    </option>

                    <option value="umkm">
                        UMKM
                    </option>

                    <option value="perusahaan">
                        Perusahaan
                    </option>

                    <option value="lainnya">
                        Lainnya
                    </option>

                </select>

            </div>
			
			<div class="form-group">

    <label>
        Cakupan Pelanggan
    </label>

    <select
        id="pelangganCakupan"
    >

        <option value="wilayah">
            Terikat RT / RW
        </option>

        <option value="khusus">
            Pelanggan Khusus / Tidak Terikat RT / RW
        </option>

    </select>

</div>

            <div class="form-group">

                <label>
                    Unit Usaha
                </label>

                <select
                    id="pelangganUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <textarea
                    id="pelangganKeterangan"
                    placeholder="Keterangan tambahan"
                    rows="2"
                ></textarea>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="simpanPelanggan()"
            >
                Simpan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormPelanggan()"
            >
                Batal
            </button>

        </div>

    `;

    muatDropdownUnitUsahaPelanggan();

}


// =========================================
// DROPDOWN UNIT USAHA PELANGGAN
// =========================================

async function muatDropdownUnitUsahaPelanggan(
    nilaiTerpilih = ""
) {

    const select =
        document.getElementById(
            "pelangganUnitUsaha"
        );

    if (!select) {

        return;

    }

    try {

        const data =
            await ambilUnitUsahaFirebase();


        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.status !== "nonaktif"
                );

            });


        select.innerHTML = `

            <option value="">
                -- Pilih Unit Usaha --
            </option>

        `;


        daftar.forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.kode || "";


            option.textContent =
                (item.nama || "-") +
                " (" +
                (item.kode || "-") +
                ")";


            if (
                item.kode === nilaiTerpilih
            ) {

                option.selected = true;

            }


            select.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Gagal memuat unit usaha pelanggan:",
            error
        );


        select.innerHTML = `

            <option value="">
                Gagal memuat unit usaha
            </option>

        `;

    }

}


// =========================================
// TUTUP FORM PELANGGAN
// =========================================

function tutupFormPelanggan() {

    const container =
        document.getElementById(
            "form-pelanggan"
        );

    if (container) {

        container.innerHTML = "";

    }

}


// =========================================
// TAMPIL DATA PELANGGAN
// =========================================

function tampilDataPelanggan(data) {

    const container =
        document.getElementById(
            "data-pelanggan"
        );

    if (!container) {

        return;

    }


    // =========================================
    // JIKA DATA KOSONG
    // =========================================

    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `

            <p class="data-kosong">
                Belum ada data pelanggan.
            </p>

        `;

        return;

    }


    // =========================================
    // JUDUL
    // =========================================

    let html = `

        <div class="tabel-master-data">

            <h4>
                Daftar Pelanggan
            </h4>

    `;


    // =========================================
    // TAMPILKAN SETIAP PELANGGAN
    // =========================================

    data.forEach(function(item) {

        // -----------------------------------------
        // STATUS
        // -----------------------------------------

        const status =
            item.status === "aktif"
                ? "Aktif"
                : "Nonaktif";


        // -----------------------------------------
        // JENIS
        // -----------------------------------------

        const jenis =
            item.jenis
                ? item.jenis.charAt(0).toUpperCase() +
                  item.jenis.slice(1)
                : "-";


        // -----------------------------------------
        // CAKUPAN PELANGGAN
        // -----------------------------------------

        const cakupan =
            item.cakupan === "khusus"
                ? "Pelanggan Khusus / Tidak Terikat RT / RW"
                : "Terikat RT / RW";


        // -----------------------------------------
        // DATA PELANGGAN
        // -----------------------------------------

        html += `

            <div class="item-data-master">

                <div>

                    <strong>
                        ${item.nama || "-"}
                    </strong>


                    <small>
                        Kode:
                        ${item.kode || "-"}
                    </small>


                    <small>
                        Jenis:
                        ${jenis}
                    </small>


                    <small>
                        Cakupan:
                        ${cakupan}
                    </small>


                    ${
                        item.noHp
                            ? `
                                <small>
                                    No. HP:
                                    ${item.noHp}
                                </small>
                              `
                            : ""
                    }


                    ${
                        item.alamat
                            ? `
                                <small>
                                    Alamat:
                                    ${item.alamat}
                                </small>
                              `
                            : ""
                    }


                    ${
                        item.unitUsaha
                            ? `
                                <small>
                                    Unit Usaha:
                                    ${item.unitUsaha}
                                </small>
                              `
                            : ""
                    }


                    <small>
                        Status:
                        ${status}
                    </small>


                    ${
                        item.keterangan
                            ? `
                                <small>
                                    Keterangan:
                                    ${item.keterangan}
                                </small>
                              `
                            : ""
                    }

                </div>


                <div>

                    <button
                        type="button"
                        onclick='formEditPelanggan(
                            ${JSON.stringify(item)}
                        )'
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onclick="hapusPelanggan(
                            '${item.id}'
                        )"
                    >
                        Hapus
                    </button>

                </div>

            </div>

        `;

    });


    // =========================================
    // TUTUP CONTAINER
    // =========================================

    html += `

        </div>

    `;


    // =========================================
    // TAMPILKAN KE HALAMAN
    // =========================================

    container.innerHTML =
        html;

}


// =========================================
// FORM EDIT PELANGGAN
// =========================================

async function formEditPelanggan(item) {

    const container =
        document.getElementById(
            "form-pelanggan"
        );

    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Edit Pelanggan
            </h4>

            <input
                type="hidden"
                id="pelangganId"
                value="${item.id}"
            >

            <div class="form-group">

                <label>
                    Kode Pelanggan
                </label>

                <input
                    type="text"
                    id="pelangganKode"
                    value="${item.kode || ""}"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Pelanggan / Pihak
                </label>

                <input
                    type="text"
                    id="pelangganNama"
                    value="${item.nama || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    No. HP
                </label>

                <input
                    type="text"
                    id="pelangganNoHp"
                    value="${item.noHp || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Alamat
                </label>

                <textarea
                    id="pelangganAlamat"
                    rows="3"
                >${item.alamat || ""}</textarea>

            </div>

            <div class="form-group">

                <label>
                    Jenis Pelanggan
                </label>

                <select
                    id="pelangganJenis"
                >

                    <option
                        value="perorangan"
                        ${
                            item.jenis === "perorangan"
                                ? "selected"
                                : ""
                        }
                    >
                        Perorangan
                    </option>

                    <option
                        value="umkm"
                        ${
                            item.jenis === "umkm"
                                ? "selected"
                                : ""
                        }
                    >
                        UMKM
                    </option>

                    <option
                        value="perusahaan"
                        ${
                            item.jenis === "perusahaan"
                                ? "selected"
                                : ""
                        }
                    >
                        Perusahaan
                    </option>

                    <option
                        value="lainnya"
                        ${
                            item.jenis === "lainnya"
                                ? "selected"
                                : ""
                        }
                    >
                        Lainnya
                    </option>

                </select>

            </div>
			
			<div class="form-group">

    <label>
        Cakupan Pelanggan
    </label>

    <select
        id="pelangganCakupan"
    >

        <option value="wilayah">
            Terikat RT / RW
        </option>

        <option value="khusus">
            Pelanggan Khusus / Tidak Terikat RT / RW
        </option>

    </select>

</div>

            <div class="form-group">

                <label>
                    Unit Usaha
                </label>

                <select
                    id="pelangganUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <textarea
                    id="pelangganKeterangan"
                    rows="2"
                >${item.keterangan || ""}</textarea>

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="pelangganStatus"
                >

                    <option
                        value="aktif"
                        ${
                            item.status === "aktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Aktif
                    </option>

                    <option
                        value="nonaktif"
                        ${
                            item.status === "nonaktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="updatePelanggan(
                    '${item.id}'
                )"
            >
                Simpan Perubahan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormPelanggan()"
            >
                Batal
            </button>

        </div>

    `;


    await muatDropdownUnitUsahaPelanggan(
        item.unitUsaha || ""
    );

}


// =========================================
// GLOBAL PELANGGAN
// =========================================

window.tampilMasterPihak =
    tampilMasterPihak;

window.formTambahPelanggan =
    formTambahPelanggan;

window.tutupFormPelanggan =
    tutupFormPelanggan;

window.tampilDataPelanggan =
    tampilDataPelanggan;

window.formEditPelanggan =
    formEditPelanggan;

window.muatDropdownUnitUsahaPelanggan =
    muatDropdownUnitUsahaPelanggan;


// =========================================
// SUPPLIER / PEMASOK
// =========================================

async function tampilMasterSupplier() {

    sembunyikanMenuMasterData();

    tampilMasterDataContent(`

        <div class="form-master-data">

            <button
                type="button"
                class="btn-kembali"
                onclick="tampilMenuMasterData()"
            >
                ← Kembali
            </button>

            <h3>
                Supplier / Pemasok
            </h3>

            <p>
                Kelola data supplier atau pemasok
                BUMDes Sumber Rejeki.
            </p>

            <button
                type="button"
                class="btn-simpan"
                onclick="formTambahSupplier()"
            >
                + Tambah Supplier
            </button>

            <div
                id="form-supplier"
            ></div>

            <div
                id="data-supplier"
            >

                <p class="data-kosong">
                    Data supplier sedang dimuat...
                </p>

            </div>

        </div>

    `);

}


// =========================================
// FORM TAMBAH SUPPLIER
// =========================================

function formTambahSupplier() {

    const container =
        document.getElementById(
            "form-supplier"
        );

    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Tambah Supplier
            </h4>

            <div class="form-group">

                <label>
                    Kode Supplier
                </label>

                <input
                    type="text"
                    id="supplierKode"
                    value="Otomatis"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Supplier / Pemasok
                </label>

                <input
                    type="text"
                    id="supplierNama"
                    placeholder="Nama supplier / pemasok"
                >

            </div>

            <div class="form-group">

                <label>
                    No. HP
                </label>

                <input
                    type="text"
                    id="supplierNoHp"
                    placeholder="Contoh: 08123456789"
                >

            </div>

            <div class="form-group">

                <label>
                    Alamat
                </label>

                <textarea
                    id="supplierAlamat"
                    rows="3"
                    placeholder="Alamat supplier"
                ></textarea>

            </div>

            <div class="form-group">

                <label>
                    Jenis Supplier
                </label>

                <select
                    id="supplierJenis"
                >

                    <option value="perorangan">
                        Perorangan
                    </option>

                    <option value="umkm">
                        UMKM
                    </option>

                    <option value="perusahaan">
                        Perusahaan
                    </option>

                    <option value="lainnya">
                        Lainnya
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Unit Usaha
                </label>

                <select
                    id="supplierUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <textarea
                    id="supplierKeterangan"
                    rows="2"
                    placeholder="Keterangan tambahan"
                ></textarea>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="simpanSupplier()"
            >
                Simpan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormSupplier()"
            >
                Batal
            </button>

        </div>

    `;


    muatDropdownUnitUsahaSupplier();

}


// =========================================
// DROPDOWN UNIT USAHA SUPPLIER
// =========================================

async function muatDropdownUnitUsahaSupplier(
    nilaiTerpilih = ""
) {

    const select =
        document.getElementById(
            "supplierUnitUsaha"
        );

    if (!select) {

        return;

    }


    try {

        const data =
            await ambilUnitUsahaFirebase();


        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.status !== "nonaktif"
                );

            });


        select.innerHTML = `

            <option value="">
                -- Pilih Unit Usaha --
            </option>

        `;


        daftar.forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.kode || "";


            option.textContent =
                (item.nama || "-") +
                " (" +
                (item.kode || "-") +
                ")";


            if (
                item.kode === nilaiTerpilih
            ) {

                option.selected = true;

            }


            select.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Gagal memuat unit usaha supplier:",
            error
        );


        select.innerHTML = `

            <option value="">
                Gagal memuat unit usaha
            </option>

        `;

    }

}


// =========================================
// TUTUP FORM SUPPLIER
// =========================================

function tutupFormSupplier() {

    const container =
        document.getElementById(
            "form-supplier"
        );

    if (container) {

        container.innerHTML = "";

    }

}


// =========================================
// TAMPIL DATA SUPPLIER
// =========================================

function tampilDataSupplier(data) {

    const container =
        document.getElementById(
            "data-supplier"
        );

    if (!container) {

        return;

    }


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `

            <p class="data-kosong">
                Belum ada data supplier.
            </p>

        `;

        return;

    }


    let html = `

        <div class="tabel-master-data">

            <h4>
                Daftar Supplier
            </h4>

    `;


    data.forEach(function(item) {

        const status =
            item.status === "aktif"
                ? "Aktif"
                : "Nonaktif";


        const jenis =
            item.jenis
                ? item.jenis.charAt(0).toUpperCase() +
                  item.jenis.slice(1)
                : "-";


        html += `

            <div class="item-data-master">

                <div>

                    <strong>
                        ${item.nama || "-"}
                    </strong>

                    <small>
                        Kode:
                        ${item.kode || "-"}
                    </small>

                    <small>
                        Jenis:
                        ${jenis}
                    </small>

                    ${
                        item.noHp
                            ? `
                                <small>
                                    No. HP:
                                    ${item.noHp}
                                </small>
                              `
                            : ""
                    }

                    ${
                        item.alamat
                            ? `
                                <small>
                                    Alamat:
                                    ${item.alamat}
                                </small>
                              `
                            : ""
                    }

                    ${
                        item.unitUsaha
                            ? `
                                <small>
                                    Unit Usaha:
                                    ${item.unitUsaha}
                                </small>
                              `
                            : ""
                    }

                    <small>
                        Status:
                        ${status}
                    </small>

                    ${
                        item.keterangan
                            ? `
                                <small>
                                    ${item.keterangan}
                                </small>
                              `
                            : ""
                    }

                </div>

                <div>

                    <button
                        type="button"
                        onclick='formEditSupplier(
                            ${JSON.stringify(item)}
                        )'
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="hapusSupplier(
                            '${item.id}'
                        )"
                    >
                        Hapus
                    </button>

                </div>

            </div>

        `;

    });


    html += `

        </div>

    `;


    container.innerHTML =
        html;

}


// =========================================
// FORM EDIT SUPPLIER
// =========================================

async function formEditSupplier(item) {

    const container =
        document.getElementById(
            "form-supplier"
        );

    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Edit Supplier
            </h4>

            <input
                type="hidden"
                id="supplierId"
                value="${item.id}"
            >

            <div class="form-group">

                <label>
                    Kode Supplier
                </label>

                <input
                    type="text"
                    id="supplierKode"
                    value="${item.kode || ""}"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Supplier / Pemasok
                </label>

                <input
                    type="text"
                    id="supplierNama"
                    value="${item.nama || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    No. HP
                </label>

                <input
                    type="text"
                    id="supplierNoHp"
                    value="${item.noHp || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Alamat
                </label>

                <textarea
                    id="supplierAlamat"
                    rows="3"
                >${item.alamat || ""}</textarea>

            </div>

            <div class="form-group">

                <label>
                    Jenis Supplier
                </label>

                <select
                    id="supplierJenis"
                >

                    <option
                        value="perorangan"
                        ${
                            item.jenis === "perorangan"
                                ? "selected"
                                : ""
                        }
                    >
                        Perorangan
                    </option>

                    <option
                        value="umkm"
                        ${
                            item.jenis === "umkm"
                                ? "selected"
                                : ""
                        }
                    >
                        UMKM
                    </option>

                    <option
                        value="perusahaan"
                        ${
                            item.jenis === "perusahaan"
                                ? "selected"
                                : ""
                        }
                    >
                        Perusahaan
                    </option>

                    <option
                        value="lainnya"
                        ${
                            item.jenis === "lainnya"
                                ? "selected"
                                : ""
                        }
                    >
                        Lainnya
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Unit Usaha
                </label>

                <select
                    id="supplierUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <textarea
                    id="supplierKeterangan"
                    rows="2"
                >${item.keterangan || ""}</textarea>

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="supplierStatus"
                >

                    <option
                        value="aktif"
                        ${
                            item.status === "aktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Aktif
                    </option>

                    <option
                        value="nonaktif"
                        ${
                            item.status === "nonaktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="updateSupplier(
                    '${item.id}'
                )"
            >
                Simpan Perubahan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormSupplier()"
            >
                Batal
            </button>

        </div>

    `;


    await muatDropdownUnitUsahaSupplier(
        item.unitUsaha || ""
    );

}


// =========================================
// GLOBAL SUPPLIER
// =========================================

window.tampilMasterSupplier =
    tampilMasterSupplier;

window.formTambahSupplier =
    formTambahSupplier;

window.tutupFormSupplier =
    tutupFormSupplier;

window.tampilDataSupplier =
    tampilDataSupplier;

window.formEditSupplier =
    formEditSupplier;

window.muatDropdownUnitUsahaSupplier =
    muatDropdownUnitUsahaSupplier;


// =========================================
// ASET
// =========================================

async function tampilMasterAset() {

    sembunyikanMenuMasterData();

    tampilMasterDataContent(`

        <div class="form-master-data">

            <button
                type="button"
                class="btn-kembali"
                onclick="tampilMenuMasterData()"
            >
                ← Kembali
            </button>

            <h3>
                Aset
            </h3>

            <p>
                Kelola data aset milik BUMDes
                dan unit usaha.
            </p>

            <button
                type="button"
                class="btn-simpan"
                onclick="formTambahAset()"
            >
                + Tambah Aset
            </button>

            <div
                id="form-aset"
            ></div>

            <div
                id="data-aset"
            >

                <p class="data-kosong">
                    Data aset sedang dimuat...
                </p>

            </div>

        </div>

    `);

}


// =========================================
// FORM TAMBAH ASET
// =========================================

async function formTambahAset() {

    const container =
        document.getElementById(
            "form-aset"
        );

    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Tambah Aset
            </h4>

            <div class="form-group">

                <label>
                    Kode Aset
                </label>

                <input
                    type="text"
                    id="asetKode"
                    value="Otomatis"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Aset
                </label>

                <input
                    type="text"
                    id="asetNama"
                    placeholder="Contoh: Laptop"
                >

            </div>

            <div class="form-group">

                <label>
                    Jenis Aset
                </label>

                <select
                    id="asetJenis"
                >

                    <option value="tetap">
                        Aset Tetap
                    </option>

                    <option value="lainnya">
                        Aset Lainnya
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Unit Usaha
                </label>

                <select
                    id="asetUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

    <label>
        Tahun Perolehan
    </label>

    <input
        type="number"
        id="asetTahunPerolehan"
        min="1900"
        max="2100"
        placeholder="Contoh: 2024"
    >

    <small>
        Penyusutan dimulai pada tahun berikutnya.
    </small>

</div>

            <div class="form-group">

                <label>
                    Harga Perolehan
                </label>

                <input
                    type="number"
                    id="asetHargaPerolehan"
                    min="0"
                    placeholder="0"
                >

            </div>

            <div class="form-group">

                <label>
                    Umur Manfaat
                </label>

                <input
                    type="number"
                    id="asetUmurManfaat"
                    min="0"
                    placeholder="Contoh: 5"
                >

                <small>
                    Dalam tahun
                </small>

            </div>

            <div class="form-group">

                <label>
                    Nilai Sisa
                </label>

                <input
                    type="number"
                    id="asetNilaiSisa"
                    min="0"
                    placeholder="0"
                >

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <textarea
                    id="asetKeterangan"
                    placeholder="Keterangan aset"
                    rows="2"
                ></textarea>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="simpanAset()"
            >
                Simpan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormAset()"
            >
                Batal
            </button>

        </div>

    `;


    await muatDropdownUnitUsahaAset();

}


// =========================================
// DROPDOWN UNIT USAHA ASET
// =========================================

async function muatDropdownUnitUsahaAset(
    nilaiTerpilih = ""
) {

    const select =
        document.getElementById(
            "asetUnitUsaha"
        );

    if (!select) {

        return;

    }


    try {

        const data =
            await ambilUnitUsahaFirebase();


        const daftar =
            (data || []).filter(function(item) {

                return (
                    item.status !==
                    "nonaktif"
                );

            });


        select.innerHTML = `

            <option value="">
                -- Pilih Unit Usaha --
            </option>

        `;


        daftar.forEach(function(item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.kode || "";


            option.textContent =
                (item.nama || "-") +
                " (" +
                (item.kode || "-") +
                ")";


            if (
                item.kode ===
                nilaiTerpilih
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
            "Gagal memuat unit usaha aset:",
            error
        );


        select.innerHTML = `

            <option value="">
                Gagal memuat unit usaha
            </option>

        `;

    }

}


// =========================================
// TUTUP FORM ASET
// =========================================

function tutupFormAset() {

    const container =
        document.getElementById(
            "form-aset"
        );

    if (container) {

        container.innerHTML = "";

    }

}


// =========================================
// TAMPIL DATA ASET
// =========================================

function tampilDataAset(data) {

    const container =
        document.getElementById(
            "data-aset"
        );

    if (!container) {
        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `

            <div class="tabel-master-data">

                <h4>
                    Daftar Aset
                </h4>

                <p class="data-kosong">
                    Belum ada data aset.
                </p>

            </div>

        `;

        return;

    }


    let html = `

        <div class="tabel-master-data">

            <h4>
                Daftar Aset
            </h4>

            <div
                style="
                    width:100%;
                    overflow-x:auto;
                "
            >

                <table
                    style="
                        width:100%;
                        min-width:1100px;
                        border-collapse:collapse;
                    "
                >

                    <thead>

                        <tr>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Kode
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Nama Aset
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Jenis
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Unit Usaha
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Tahun
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Harga Perolehan
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Umur
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Nilai Sisa
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Status
                            </th>

                            <th
                                style="
                                    border:1px solid #ddd;
                                    padding:8px;
                                "
                            >
                                Aksi
                            </th>

                        </tr>

                    </thead>

                    <tbody>
    `;


    data.forEach(function(item) {

        const harga =
            Number(
                item.hargaPerolehan
            ) || 0;


        const nilaiSisa =
            Number(
                item.nilaiSisa
            ) || 0;


        const umur =
            Number(
                item.umurManfaat
            ) || 0;


        const status =
            item.status === "aktif"
                ? "Aktif"
                : "Nonaktif";


        const jenis =
            item.jenis === "tetap"
                ? "Aset Tetap"
                : "Aset Lainnya";


        html += `

            <tr>

                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                    "
                >
                    ${item.kode || "-"}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                    "
                >
                    <strong>
                        ${item.nama || "-"}
                    </strong>
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                    "
                >
                    ${jenis}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                    "
                >
                    ${item.unitUsaha || "-"}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:center;
                    "
                >
                    ${item.tahunPerolehan || "-"}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:right;
                        white-space:nowrap;
                    "
                >
                    Rp ${harga.toLocaleString(
                        "id-ID"
                    )}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:center;
                        white-space:nowrap;
                    "
                >
                    ${umur} tahun
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:right;
                        white-space:nowrap;
                    "
                >
                    Rp ${nilaiSisa.toLocaleString(
                        "id-ID"
                    )}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:center;
                    "
                >
                    ${status}
                </td>


                <td
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:center;
                        white-space:nowrap;
                    "
                >

                    <button
                        type="button"
                        onclick='formEditAset(
                            ${JSON.stringify(item)}
                        )'
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onclick="hapusAset(
                            '${item.id}'
                        )"
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

        </div>

    `;


    container.innerHTML =
        html;

}

// =========================================
// FORM EDIT ASET
// =========================================

async function formEditAset(item) {

    const container =
        document.getElementById(
            "form-aset"
        );

    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="form-master-data">

            <h4>
                Edit Aset
            </h4>

            <input
                type="hidden"
                id="asetId"
                value="${item.id || ""}"
            >

            <div class="form-group">

                <label>
                    Kode Aset
                </label>

                <input
                    type="text"
                    id="asetKode"
                    value="${item.kode || ""}"
                    readonly
                >

            </div>

            <div class="form-group">

                <label>
                    Nama Aset
                </label>

                <input
                    type="text"
                    id="asetNama"
                    value="${item.nama || ""}"
                >

            </div>

            <div class="form-group">

                <label>
                    Jenis Aset
                </label>

                <select
                    id="asetJenis"
                >

                    <option
                        value="tetap"
                        ${
                            item.jenis === "tetap"
                                ? "selected"
                                : ""
                        }
                    >
                        Aset Tetap
                    </option>

                    <option
                        value="lainnya"
                        ${
                            item.jenis === "lainnya"
                                ? "selected"
                                : ""
                        }
                    >
                        Aset Lainnya
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Unit Usaha
                </label>

                <select
                    id="asetUnitUsaha"
                >

                    <option value="">
                        Memuat unit usaha...
                    </option>

                </select>

            </div>

            <div class="form-group">

    <label>
        Tahun Perolehan
    </label>

    <input
        type="number"
        id="asetTahunPerolehan"
        min="1900"
        max="2100"
        value="${
            Number(
                item.tahunPerolehan
            ) || ""
        }"
    >

    <small>
        Penyusutan dimulai pada tahun berikutnya.
    </small>

</div>

            <div class="form-group">

                <label>
                    Harga Perolehan
                </label>

                <input
                    type="number"
                    id="asetHargaPerolehan"
                    min="0"
                    value="${
                        Number(
                            item.hargaPerolehan
                        ) || 0
                    }"
                >

            </div>

            <div class="form-group">

                <label>
                    Umur Manfaat
                </label>

                <input
                    type="number"
                    id="asetUmurManfaat"
                    min="0"
                    value="${
                        Number(
                            item.umurManfaat
                        ) || 0
                    }"
                >

                <small>
                    Dalam tahun
                </small>

            </div>

            <div class="form-group">

                <label>
                    Nilai Sisa
                </label>

                <input
                    type="number"
                    id="asetNilaiSisa"
                    min="0"
                    value="${
                        Number(
                            item.nilaiSisa
                        ) || 0
                    }"
                >

            </div>

            <div class="form-group">

                <label>
                    Keterangan
                </label>

                <textarea
                    id="asetKeterangan"
                    rows="2"
                >${item.keterangan || ""}</textarea>

            </div>

            <div class="form-group">

                <label>
                    Status
                </label>

                <select
                    id="asetStatus"
                >

                    <option
                        value="aktif"
                        ${
                            item.status !== "nonaktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Aktif
                    </option>

                    <option
                        value="nonaktif"
                        ${
                            item.status === "nonaktif"
                                ? "selected"
                                : ""
                        }
                    >
                        Nonaktif
                    </option>

                </select>

            </div>

            <button
                type="button"
                class="btn-simpan"
                onclick="updateAset(
                    '${item.id}'
                )"
            >
                Simpan Perubahan
            </button>

            <button
                type="button"
                class="btn-kembali"
                onclick="tutupFormAset()"
            >
                Batal
            </button>

        </div>

    `;


    await muatDropdownUnitUsahaAset(
        item.unitUsaha || ""
    );

}


// =========================================
// GLOBAL ASET
// =========================================

window.tampilMasterAset =
    tampilMasterAset;

window.formTambahAset =
    formTambahAset;

window.tutupFormAset =
    tutupFormAset;

window.tampilDataAset =
    tampilDataAset;

window.formEditAset =
    formEditAset;

window.muatDropdownUnitUsahaAset =
    muatDropdownUnitUsahaAset;


// =========================================
// KEMBALI KE MENU MASTER DATA
// =========================================

function tampilMenuMasterData() {

    tampilkanMenuMasterData();

    const container =
        document.getElementById(
            "master-data-content"
        );

    if (container) {

        container.innerHTML = "";

    }

}

 
// =========================================
// GLOBAL
// =========================================

window.tampilMasterDataContent =
    tampilMasterDataContent;

window.tampilMasterUnitUsaha =
    tampilMasterUnitUsaha;

window.tampilMasterAkun =
    tampilMasterAkun;

window.tampilMasterPihak =
    tampilMasterPihak;

window.tampilMasterSupplier =
    tampilMasterSupplier;

window.tampilMasterAset =
    tampilMasterAset;

window.tampilMenuMasterData =
    tampilMenuMasterData;

window.formTambahUnitUsaha =
    formTambahUnitUsaha;

window.tutupFormUnitUsaha =
    tutupFormUnitUsaha;

window.tampilDataUnitUsaha =
    tampilDataUnitUsaha;

window.formEditUnitUsaha =
    formEditUnitUsaha;

window.formTambahAkun =
    formTambahAkun;

window.tutupFormAkun =
    tutupFormAkun;

window.tampilDataAkun =
    tampilDataAkun;

window.formEditAkun =
    formEditAkun;

window.muatDropdownUnitUsahaAkun =
    muatDropdownUnitUsahaAkun;

window.aturUnitUsahaAkun =
    aturUnitUsahaAkun;




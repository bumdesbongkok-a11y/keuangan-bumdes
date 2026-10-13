
/* =========================================
   TARGET RETRIBUSI SAMPAH
   KEUANGAN BUMDES SUMBER REJEKI
   ========================================= */

// =========================================
// DAFTAR RT DESA BONGKOK
// =========================================


const TARGET_RETRIBUSI_CONFIG = {
    RT_PER_RW: {
        1: 5,
        2: 2,
        3: 7,
        4: 5,
        5: 3
    },
    JUMLAH_RW: 5,
    JUMLAH_RT: 22,
    TARIF_PELANGGAN: 20000,
    BAGIAN_BUMDES: 0.90
};

function daftarRTDesaBongkok() {
    const daftar = [];

    Object.entries(TARGET_RETRIBUSI_CONFIG.RT_PER_RW)
        .forEach(function([rw, jumlahRT]) {
            for (let nomorRT = 1; nomorRT <= jumlahRT; nomorRT++) {
                daftar.push({
                    rw: Number(rw),
                    rt: nomorRT
                });
            }
        });

    return daftar;
}




// =========================================
// FORMAT RUPIAH
// =========================================

function formatRupiahTarget(nominal) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(nominal) || 0);

}


// =========================================
// AMBIL PERIODE BULAN INI
// Format: YYYY-MM
// =========================================

function periodeTargetBulanIni() {

    const sekarang = new Date();

    const tahun = sekarang.getFullYear();

    const bulan = String(
        sekarang.getMonth() + 1
    ).padStart(2, "0");

    return `${tahun}-${bulan}`;

}


// =========================================
// FILTER TRANSAKSI RETRIBUSI SAMPAH
// =========================================

function filterTransaksiTargetRetribusi(
    transaksi,
    periode
) {

    if (!Array.isArray(transaksi)) {
        return [];
    }

    return transaksi.filter(function(item) {

        // Harus merupakan pemasukan.
        if (
            item.jenisTransaksi !==
            JENIS_TRANSAKSI.PEMASUKAN
        ) {
            return false;
        }

        // Harus berasal dari unit pengelolaan sampah.
        if (
            item.unitUsaha !==
            UNIT_USAHA.PENGELOLAAN_SAMPAH
        ) {
            return false;
        }

        // Harus berada pada bulan yang dipilih.
        if (
            typeof item.tanggal !== "string" ||
            !item.tanggal.startsWith(periode)
        ) {
            return false;
        }

        return true;

    });

}


// =========================================
// INISIALISASI HALAMAN TARGET RETRIBUSI
// UI SAJA
// =========================================

function siapkanHalamanTargetRetribusi() {

    const inputPeriode =
        document.getElementById("target-periode");

    const ringkasan =
        document.getElementById("target-ringkasan");

    const tabelBody =
        document.getElementById("target-tabel-body");


    // Pastikan elemen halaman tersedia.
    if (!inputPeriode || !ringkasan || !tabelBody) {

        console.error(
            "Elemen halaman Target Retribusi belum lengkap."
        );

        return;

    }


    // Isi periode bulan berjalan saat pertama dibuka.
    if (!inputPeriode.value) {

        inputPeriode.value =
            periodeTargetBulanIni();

    }


    // Tampilan awal sebelum data Firebase dimuat.
    ringkasan.innerHTML = `
        <p>
            Pilih bulan dan muat data target
            untuk melihat pencapaian retribusi.
        </p>
    `;


    tabelBody.innerHTML = `
        <tr>
            <td colspan="6">
                Halaman siap. Data target belum dimuat.
            </td>
        </tr>
    `;


    console.log(
        "UI Target Retribusi siap."
    );
	
	
    // Muat target ketika halaman dibuka.
    muatHalamanTargetRetribusi();

    // Muat ulang ketika bulan diganti.
    inputPeriode.onchange = function() {
        muatHalamanTargetRetribusi();
    };


}

// =========================================
// MUAT DATA TARGET RETRIBUSI
// UI
// =========================================

async function muatHalamanTargetRetribusi() {
    const inputPeriode =
        document.getElementById("target-periode");

    const ringkasan =
        document.getElementById("target-ringkasan");

    const tabelBody =
        document.getElementById("target-tabel-body");

    if (!inputPeriode || !ringkasan || !tabelBody) {
        console.error("Elemen Target Retribusi tidak ditemukan.");
        return;
    }

    const periode = inputPeriode.value;

    if (!periode) {
        alert("Silakan pilih bulan target.");
        return;
    }

    tabelBody.innerHTML = `
        <tr><td colspan="8">Memuat data...</td></tr>
    `;

    try {
        // Ambil target dan transaksi pemasukan
        const [dataTarget, dataPemasukan] = await Promise.all([
            ambilTargetRetribusiFirebase(periode),
            loadPemasukanFirebase()
        ]);

        // Normalisasi nomor RW/RT.
        // Contoh: "RW 01", "RT 01", dan 1 menjadi angka 1.
        function nomorWilayah(nilai) {
            const cocok = String(nilai ?? "").match(/\d+/);
            return cocok ? Number(cocok[0]) : 0;
        }

        // =====================================
        // KELOMPOKKAN TARGET BERDASARKAN RW/RT
        // =====================================

        const targetPerRT = {};

        dataTarget.forEach(function(item) {
            const rw = nomorWilayah(item.rw);
            const rt = nomorWilayah(item.rt);
            const kunci = `${rw}-${rt}`;

            targetPerRT[kunci] = item;
        });

        // =====================================
        // KELOMPOKKAN PEMASUKAN RETRIBUSI
        // BERDASARKAN PERIODE, RW, DAN RT
        // =====================================

        const realisasiKotorPerRT = {};

        (Array.isArray(dataPemasukan) ? dataPemasukan : [])
            .forEach(function(item) {

                // Hanya pemasukan unit Pengelolaan Sampah
                if (
                    item.unitUsaha !== "PENGELOLAAN_SAMPAH"
                ) {
                    return;
                }

                // Hanya jenis pendapatan RETRIBUSI
                if (item.jenisPendapatan !== "RETRIBUSI") {
                    return;
                }

                // Hanya transaksi pada bulan yang dipilih
                if (
                    !String(item.tanggal || "").startsWith(periode)
                ) {
                    return;
                }

                const rw = nomorWilayah(item.rw);
                const rt = nomorWilayah(item.rt);

                // Lewati transaksi yang tidak memiliki RW/RT valid
                if (!rw || !rt) {
                    return;
                }

                const kunci = `${rw}-${rt}`;
                const nominal = Number(item.nominal) || 0;

                realisasiKotorPerRT[kunci] =
                    (realisasiKotorPerRT[kunci] || 0) + nominal;
            });

        // =====================================
        // BANGUN TABEL TARGET 22 RT
        // =====================================

        let html = "";

        let totalPelanggan = 0;
        let totalTarget = 0;
        let totalRealisasiBumdes = 0;

        daftarRTDesaBongkok().forEach(function(wilayah) {
            const kunci = `${wilayah.rw}-${wilayah.rt}`;

            const data = targetPerRT[kunci];

            const pelanggan = data
                ? Number(data.jumlahPelanggan) || 0
                : 0;

            // Target nominal penuh
            const target =
                pelanggan *
                TARGET_RETRIBUSI_CONFIG.TARIF_PELANGGAN;

            // Total pemasukan retribusi sebelum pembagian
            const realisasiKotor =
                realisasiKotorPerRT[kunci] || 0;

            // Bagian BUMDes = 90% dari pemasukan retribusi
            const realisasiBumdes =
                realisasiKotor *
                TARGET_RETRIBUSI_CONFIG.BAGIAN_BUMDES;

            // Pencapaian dibandingkan dengan target nominal
            const pencapaian = target > 0
                ? (realisasiBumdes / target) * 100
                : 0;

            let status = "Belum ada target";

            if (target > 0) {
                status = pencapaian >= 100
                    ? "Tercapai"
                    : "Belum tercapai";
            }

            totalPelanggan += pelanggan;
            totalTarget += target;
            totalRealisasiBumdes += realisasiBumdes;

            html += `
                <tr>
                    <td>RW ${wilayah.rw}</td>
                    <td>RT ${wilayah.rt}</td>

                    <td>
                        <input
                            type="number"
                            id="pelanggan-${wilayah.rw}-${wilayah.rt}"
                            value="${pelanggan}"
                            min="0"
                            step="1"
                            style="width: 90px;"
                        >
                    </td>

                    <td id="target-${wilayah.rw}-${wilayah.rt}">
                        ${formatRupiahTarget(target)}
                    </td>

                    <td>
                        ${formatRupiahTarget(realisasiBumdes)}
                    </td>

                    <td>
                        ${pencapaian.toFixed(1)}%
                    </td>

                    <td>
                        ${status}
                    </td>

                    <td>
                        <button
                            type="button"
                            onclick="simpanJumlahPelangganTarget(${wilayah.rw}, ${wilayah.rt})"
                        >
                            Simpan
                        </button>
                    </td>
                </tr>
            `;
        });

        tabelBody.innerHTML = html;

        // =====================================
        // RINGKASAN SELURUH DESA
        // =====================================

        const pencapaianTotal = totalTarget > 0
            ? (totalRealisasiBumdes / totalTarget) * 100
            : 0;

        ringkasan.innerHTML = `
            <p><strong>Periode:</strong> ${periode}</p>

            <p>
                <strong>Total pelanggan:</strong>
                ${totalPelanggan}
            </p>

            <p>
                <strong>Total target:</strong>
                ${formatRupiahTarget(totalTarget)}
            </p>

            <p>
                <strong>Realisasi bagian BUMDes (90%):</strong>
                ${formatRupiahTarget(totalRealisasiBumdes)}
            </p>

            <p>
                <strong>Pencapaian keseluruhan:</strong>
                ${pencapaianTotal.toFixed(1)}%
            </p>

            <p>
                Target dihitung dari jumlah pelanggan × Rp20.000.
                Realisasi hanya menghitung pemasukan berjenis RETRIBUSI.
            </p>
        `;

    } catch (error) {
        console.error(
            "Gagal memuat halaman Target Retribusi:",
            error
        );

        tabelBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Gagal memuat data target atau pemasukan.
                    Periksa koneksi Firebase dan aturan akses.
                </td>
            </tr>
        `;
    }
}



async function simpanJumlahPelangganTarget(rw, rt) {
    const inputPeriode = document.getElementById("target-periode");
    const inputPelanggan = document.getElementById(
        `pelanggan-${rw}-${rt}`
    );

    if (!inputPeriode || !inputPelanggan) {
        alert("Kolom periode atau jumlah pelanggan tidak ditemukan.");
        return;
    }

    const periode = inputPeriode.value;
    const jumlahPelanggan = Number(inputPelanggan.value);

    if (!periode) {
        alert("Silakan pilih bulan target.");
        return;
    }

    if (
        inputPelanggan.value.trim() === "" ||
        !Number.isInteger(jumlahPelanggan) ||
        jumlahPelanggan < 0
    ) {
        alert("Jumlah pelanggan harus bilangan bulat minimal 0.");
        inputPelanggan.focus();
        return;
    }

    try {
        await simpanTargetRetribusiFirebase(
            periode,
            rw,
            rt,
            jumlahPelanggan
        );

        alert(
            `Target RW ${rw} RT ${rt} berhasil disimpan.`
        );

        await muatHalamanTargetRetribusi();

    } catch (error) {
        console.error("Gagal menyimpan jumlah pelanggan:", error);

        alert(
            "Target gagal disimpan: " +
            (error.message || "Periksa koneksi Firebase.")
        );
    }
}



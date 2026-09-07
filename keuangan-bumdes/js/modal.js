// =========================================
// MODAL
// KEUANGAN BUMDES SUMBER REJEKI
// =========================================


// =========================================
// DATA GLOBAL MODAL
// =========================================

let DATA_MODAL = [];

let modalSedangDiedit = null;


// =========================================
// PERSIAPAN HALAMAN MODAL
// =========================================

function siapkanHalamanModal() {

    console.log(
        "Halaman Modal siap."
    );

}


// =========================================
// LOAD DAN TAMPILKAN MODAL
// =========================================

async function loadDanTampilModal() {

    try {

        const data =
            await loadModalFirebase();


        DATA_MODAL =
            data || [];


        tampilModal(
            DATA_MODAL
        );


    } catch (error) {

        console.error(
            "Load modal gagal:",
            error
        );

    }

}


// =========================================
// SIMPAN / EDIT MODAL
// =========================================

async function simpanModal() {

    // =====================================
    // AMBIL FORM
    // =====================================

    const tanggal =
        document.getElementById(
            "modalTanggal"
        )?.value;


    const sumber =
        document.getElementById(
            "modalSumber"
        )?.value.trim();


    const jenis =
        document.getElementById(
            "modalJenis"
        )?.value;


    const media =
        document.getElementById(
            "modalMedia"
        )?.value;


    const nominal =
        Number(
            document.getElementById(
                "modalNominal"
            )?.value
        );


    const keterangan =
        document.getElementById(
            "modalKeterangan"
        )?.value.trim();


    // =====================================
    // VALIDASI TANGGAL
    // =====================================

    if (!tanggal) {

        alert(
            "Tanggal modal harus diisi."
        );

        return;

    }


    // =====================================
    // VALIDASI SUMBER
    // =====================================

    if (!sumber) {

        alert(
            "Sumber modal harus diisi."
        );

        return;

    }


    // =====================================
    // VALIDASI JENIS
    // =====================================

    if (!jenis) {

        alert(
            "Jenis modal harus dipilih."
        );

        return;

    }


    // =====================================
    // VALIDASI MEDIA
    // =====================================

    if (!media) {

        alert(
            "Modal masuk ke media mana? Silakan pilih Kas, Bank, atau DANA."
        );

        return;

    }


    // =====================================
    // VALIDASI NOMINAL
    // =====================================

    if (!nominal || nominal <= 0) {

        alert(
            "Nominal modal harus lebih dari 0."
        );

        return;

    }


    // =====================================
    // MODE EDIT
    // =====================================

    if (modalSedangDiedit) {

        try {

            const berhasil =
                await updateModalFirebase(

                    modalSedangDiedit,

                    {

                        tanggal:
                            tanggal,

                        sumber:
                            sumber,

                        jenis:
                            jenis,

                        media:
                            media,

                        nominal:
                            nominal,

                        keterangan:
                            keterangan

                    }

                );


            if (!berhasil) {

                throw new Error(
                    "Update modal gagal."
                );

            }


            alert(
                "Modal berhasil diperbarui."
            );


            resetFormModal();


            await loadDanTampilModal();


            return;


        } catch (error) {

            console.error(
                "Update modal gagal:",
                error
            );


            alert(
                "Modal gagal diperbarui."
            );


            return;

        }

    }


    // =====================================
    // MODE TAMBAH
    // =====================================

    try {

        const hasil =
            await simpanModalFirebase({

                tanggal:
                    tanggal,

                sumber:
                    sumber,

                jenis:
                    jenis,

                media:
                    media,

                nominal:
                    nominal,

                keterangan:
                    keterangan

            });


        if (!hasil) {

            throw new Error(
                "Firebase gagal menyimpan modal."
            );

        }


        alert(
            "Modal berhasil disimpan."
        );


        resetFormModal();


        await loadDanTampilModal();


    } catch (error) {

        console.error(
            "Simpan modal gagal:",
            error
        );


        alert(
            "Modal gagal disimpan."
        );

    }

}


// =========================================
// RESET FORM MODAL
// =========================================

function resetFormModal() {

    const tanggal =
        document.getElementById(
            "modalTanggal"
        );


    const sumber =
        document.getElementById(
            "modalSumber"
        );


    const jenis =
        document.getElementById(
            "modalJenis"
        );


    const media =
        document.getElementById(
            "modalMedia"
        );


    const nominal =
        document.getElementById(
            "modalNominal"
        );


    const keterangan =
        document.getElementById(
            "modalKeterangan"
        );


    // =====================================
    // RESET TANGGAL
    // =====================================

    if (tanggal) {

        tanggal.value = "";

    }


    // =====================================
    // RESET SUMBER
    // =====================================

    if (sumber) {

        sumber.value = "";

    }


    // =====================================
    // RESET JENIS
    // =====================================

    if (jenis) {

        jenis.value = "";

    }


    // =====================================
    // RESET MEDIA
    // =====================================

    if (media) {

        media.value = "";

    }


    // =====================================
    // RESET NOMINAL
    // =====================================

    if (nominal) {

        nominal.value = "";

    }


    // =====================================
    // RESET KETERANGAN
    // =====================================

    if (keterangan) {

        keterangan.value = "";

    }


    // =====================================
    // RESET MODE EDIT
    // =====================================

    modalSedangDiedit =
        null;


    ubahTombolSimpanModal(
        "Simpan Modal"
    );

}


// =========================================
// UBAH TOMBOL SIMPAN
// =========================================

function ubahTombolSimpanModal(teks) {

    const tombol =
        document.querySelector(
            "#halaman-modal .btn-simpan"
        );


    if (tombol) {

        tombol.textContent =
            teks;

    }

}


// =========================================
// EDIT MODAL
// =========================================

function editModal(id) {

    const item =
        DATA_MODAL.find(
            function(data) {

                return data.id === id;

            }
        );


    if (!item) {

        alert(
            "Data modal tidak ditemukan."
        );

        return;

    }


    // =====================================
    // AMBIL ELEMENT FORM
    // =====================================

    const tanggal =
        document.getElementById(
            "modalTanggal"
        );


    const sumber =
        document.getElementById(
            "modalSumber"
        );


    const jenis =
        document.getElementById(
            "modalJenis"
        );


    const media =
        document.getElementById(
            "modalMedia"
        );


    const nominal =
        document.getElementById(
            "modalNominal"
        );


    const keterangan =
        document.getElementById(
            "modalKeterangan"
        );


    // =====================================
    // ISI TANGGAL
    // =====================================

    if (tanggal) {

        tanggal.value =
            item.tanggal || "";

    }


    // =====================================
    // ISI SUMBER
    // =====================================

    if (sumber) {

        sumber.value =
            item.sumber || "";

    }


    // =====================================
    // ISI JENIS
    // =====================================

    if (jenis) {

        jenis.value =
            item.jenis || "";

    }


    // =====================================
    // ISI MEDIA
    // =====================================

    if (media) {

        media.value =
            item.media || "";

    }


    // =====================================
    // ISI NOMINAL
    // =====================================

    if (nominal) {

        nominal.value =
            item.nominal || "";

    }


    // =====================================
    // ISI KETERANGAN
    // =====================================

    if (keterangan) {

        keterangan.value =
            item.keterangan || "";

    }


    // =====================================
    // SET MODE EDIT
    // =====================================

    modalSedangDiedit =
        id;


    ubahTombolSimpanModal(
        "Simpan Perubahan"
    );


    // =====================================
    // SCROLL KE HALAMAN MODAL
    // =====================================

    const halaman =
        document.getElementById(
            "halaman-modal"
        );


    if (halaman) {

        halaman.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

}


// =========================================
// HAPUS MODAL
// =========================================

async function hapusModal(id) {

    const item =
        DATA_MODAL.find(
            function(data) {

                return data.id === id;

            }
        );


    if (!item) {

        alert(
            "Data modal tidak ditemukan."
        );

        return;

    }


    // =====================================
    // KONFIRMASI
    // =====================================

    const yakin =
        confirm(

            "Hapus modal " +

            formatRupiah(
                Number(item.nominal) || 0
            ) +

            " dari " +

            item.sumber +

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
            await hapusModalFirebase(
                id
            );


        if (!berhasil) {

            throw new Error(
                "Gagal menghapus modal."
            );

        }


        alert(
            "Modal berhasil dihapus."
        );


        // =================================
        // REFRESH DATA
        // =================================

        await loadDanTampilModal();


    } catch (error) {

        console.error(
            "Hapus modal gagal:",
            error
        );


        alert(
            "Modal gagal dihapus."
        );

    }

}
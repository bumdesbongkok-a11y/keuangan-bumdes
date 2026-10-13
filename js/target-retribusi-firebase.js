
/* =========================================
   TARGET RETRIBUSI FIREBASE
   KEUANGAN BUMDES SUMBER REJEKI
   ========================================= */

// Collection baru khusus konfigurasi target.
// Tidak mengubah collection colTransaksi.

const COLLECTION_TARGET_RETRIBUSI =
    "colTargetRetribusi";


// =========================================
// AMBIL TARGET BERDASARKAN BULAN
// =========================================

async function ambilTargetRetribusiFirebase(
    periode
) {

    try {

        if (!window.db) {
            throw new Error(
                "Firebase Firestore belum tersedia."
            );
        }

        const {
            collection,
            getDocs,
            query,
            where
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );

        const ref = collection(
            window.db,
            COLLECTION_TARGET_RETRIBUSI
        );

        const q = query(
            ref,
            where("periode", "==", periode)
        );

        const snapshot = await getDocs(q);

        const data = [];

        snapshot.forEach(function(doc) {

            data.push({
                id: doc.id,
                ...doc.data()
            });

        });

        return data;

    } catch (error) {

        console.error(
            "Gagal mengambil target retribusi:",
            error
        );

        throw error;

    }

}



async function simpanTargetRetribusiFirebase(
    periode,
    rw,
    rt,
    jumlahPelanggan
) {
    try {
        if (!window.db) {
            throw new Error("Firebase Firestore belum tersedia.");
        }

        if (!/^\d{4}-\d{2}$/.test(periode)) {
            throw new Error("Format periode harus YYYY-MM.");
        }

        const nomorRW = Number(rw);
        const nomorRT = Number(rt);
        const pelanggan = Number(jumlahPelanggan);

        const jumlahRTPerRW = {
            1: 5,
            2: 2,
            3: 7,
            4: 5,
            5: 3
        };

        if (!jumlahRTPerRW[nomorRW]) {
            throw new Error("Nomor RW tidak valid.");
        }

        if (
            !Number.isInteger(nomorRT) ||
            nomorRT < 1 ||
            nomorRT > jumlahRTPerRW[nomorRW]
        ) {
            throw new Error("Nomor RT tidak valid untuk RW tersebut.");
        }

        if (!Number.isInteger(pelanggan) || pelanggan < 0) {
            throw new Error(
                "Jumlah pelanggan harus bilangan bulat minimal 0."
            );
        }

        const {
            collection,
            doc,
            setDoc,
            serverTimestamp
        } = await import(
            "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"
        );

        // ID unik berdasarkan bulan, RW, dan RT.
        const idDokumen =
            `${periode.replace("-", "")}_RW${nomorRW}_RT${nomorRT}`;

        const ref = doc(
            collection(window.db, COLLECTION_TARGET_RETRIBUSI),
            idDokumen
        );

        // Periksa apakah periode sudah Tutup Buku.
        if (typeof cekTanggalTerkunciFirebase === "function") {
            const tanggalAkhirBulan = new Date(
                Number(periode.slice(0, 4)),
                Number(periode.slice(5, 7)),
                0
            );

            const tahun = tanggalAkhirBulan.getFullYear();
            const bulan = String(
                tanggalAkhirBulan.getMonth() + 1
            ).padStart(2, "0");
            const hari = String(
                tanggalAkhirBulan.getDate()
            ).padStart(2, "0");

            const terkunci = await cekTanggalTerkunciFirebase(
                `${tahun}-${bulan}-${hari}`
            );

            if (terkunci) {
                throw new Error(
                    "Target tidak dapat diubah karena periode sudah Tutup Buku."
                );
            }
        }

        const tarif = 20000;

        const dataSimpan = {
            periode: periode,
            rw: nomorRW,
            rt: nomorRT,
            jumlahPelanggan: pelanggan,
            tarifPerPelanggan: tarif,
            targetNominal: pelanggan * tarif,
            diperbaruiPada: serverTimestamp()
        };

        await setDoc(ref, dataSimpan, { merge: true });

        return true;

    } catch (error) {
        console.error("Gagal menyimpan target retribusi:", error);
        throw error;
    }
}

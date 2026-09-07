 // =========================================
 // KAS BUMDES
 // LOGIKA DAN PERHITUNGAN
 // =========================================

 
 // =========================================
 // HITUNG SALDO KAS
 // =========================================

 function hitungSaldoKas(data) {

     let saldo = 0;


     if (!data || data.length === 0) {

         return 0;

     }


     data.forEach(function(item) {

         const masuk =
             Number(item.masuk) || 0;

         const keluar =
             Number(item.keluar) || 0;


         saldo +=
             masuk - keluar;

     });


     return saldo;

 }
 
 // =========================================
// HITUNG TOTAL KAS MASUK
// =========================================

function hitungTotalKasMasuk(data) {

    let total = 0;


    if (!data) {

        return 0;

    }


    data.forEach(function(item) {

        total +=
            Number(item.masuk) || 0;

    });


    return total;

}


// =========================================
// HITUNG TOTAL KAS KELUAR
// =========================================

function hitungTotalKasKeluar(data) {

    let total = 0;


    if (!data) {

        return 0;

    }


    data.forEach(function(item) {

        total +=
            Number(item.keluar) || 0;

    });


    return total;

}
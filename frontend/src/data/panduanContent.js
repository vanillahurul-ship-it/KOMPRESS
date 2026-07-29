// Konten tutorial "Cara Penggunaan Website" untuk admin Bank Sampah Macodes.
// Dipisah dari komponen tampilan (PanduanPenggunaan.jsx) supaya mudah diperbarui
// tanpa menyentuh markup/style.
export const PANDUAN_STEPS = [
  {
    judul: "1. Login Admin",
    deskripsi: "Masuk ke sistem menggunakan akun admin yang sudah terdaftar.",
    langkah: [
      "Buka halaman utama website Bank Sampah Macodes.",
      "Klik tombol \"Admin\" atau \"Login\" di bagian kanan atas.",
      "Masukkan email dan password admin pada form yang muncul.",
      "Klik tombol \"Masuk\" untuk melanjutkan ke halaman Beranda.",
    ],
    catatan: "Jika lupa password, hubungi admin lain yang terdaftar untuk mereset password melalui menu Manajemen Admin di halaman Profil.",
  },
  {
    judul: "2. Dashboard / Beranda",
    deskripsi: "Halaman pertama setelah login, menampilkan ringkasan kondisi Bank Sampah secara keseluruhan.",
    langkah: [
      "Lihat kartu statistik di bagian atas untuk info pendapatan bulan ini, berat sampah, dan jumlah nasabah/transaksi.",
      "Gulir ke bawah untuk melihat grafik tren pendapatan dan tren berat sampah bulanan.",
      "Klik ikon info (ⓘ) di judul grafik untuk membaca penjelasan singkat mengenai grafik tersebut.",
    ],
  },
  {
    judul: "3. Menambah Nasabah",
    deskripsi: "Mendaftarkan nasabah baru agar dapat melakukan setoran sampah.",
    langkah: [
      "Buka menu \"Data Nasabah\" di sidebar kiri.",
      "Klik tombol \"Tambah Nasabah\".",
      "Isi Nama, No Rekening, Alamat, dan Status pada form yang muncul.",
      "Klik \"Tambah\" untuk menyimpan data nasabah baru.",
    ],
  },
  {
    judul: "4. Mengubah Data Nasabah",
    deskripsi: "Memperbarui data nasabah yang sudah terdaftar, misalnya alamat atau status keanggotaan.",
    langkah: [
      "Buka menu \"Data Nasabah\".",
      "Cari nasabah menggunakan kolom pencarian atau filter status, jika diperlukan.",
      "Klik ikon edit (pensil) pada baris nasabah yang ingin diubah.",
      "Perbarui data pada form, lalu klik \"Simpan\".",
    ],
  },
  {
    judul: "5. Menghapus Data Nasabah",
    deskripsi: "Menghapus data nasabah yang sudah tidak aktif atau salah input.",
    langkah: [
      "Buka menu \"Data Nasabah\".",
      "Klik ikon hapus (tempat sampah) pada baris nasabah yang ingin dihapus.",
      "Konfirmasi penghapusan pada kotak dialog yang muncul.",
    ],
    catatan: "Data yang sudah dihapus tidak dapat dikembalikan. Pastikan nasabah tersebut benar-benar tidak diperlukan lagi.",
  },
  {
    judul: "6. Menambah Jenis Sampah",
    deskripsi: "Mendaftarkan jenis sampah baru beserta harganya agar dapat dipilih saat transaksi.",
    langkah: [
      "Buka menu \"Jenis Sampah\" di sidebar.",
      "Isi Nama Jenis Sampah dan Harga ke DLH per Kg pada form di sebelah kiri.",
      "Harga ke Nasabah per Kg akan otomatis terisi (75% dari Harga DLH).",
      "Klik \"Tambah\" untuk menyimpan jenis sampah baru.",
    ],
  },
  {
    judul: "7. Mengubah Harga Sampah",
    deskripsi: "Memperbarui harga jenis sampah yang sudah ada mengikuti harga terbaru dari DLH.",
    langkah: [
      "Buka menu \"Jenis Sampah\".",
      "Klik ikon edit pada jenis sampah yang ingin diperbarui.",
      "Ubah nilai Harga ke DLH per Kg — Harga ke Nasabah akan otomatis menyesuaikan.",
      "Klik \"Simpan\" untuk menyimpan perubahan.",
    ],
  },
  {
    judul: "8. Menambah Transaksi",
    deskripsi: "Mencatat setoran sampah yang dilakukan oleh nasabah.",
    langkah: [
      "Buka menu \"Transaksi\" di sidebar.",
      "Klik tombol \"Tambah Setoran\".",
      "Pilih nasabah, jenis sampah, berat, dan tanggal setoran.",
      "Klik \"Tambah\" untuk menyimpan transaksi.",
    ],
  },
  {
    judul: "9. Melihat Riwayat Transaksi",
    deskripsi: "Meninjau seluruh transaksi setoran yang pernah tercatat.",
    langkah: [
      "Buka menu \"Transaksi\".",
      "Gunakan kolom pencarian nama nasabah atau filter tahun untuk mempersempit hasil.",
      "Perhatikan kolom status untuk mengetahui apakah transaksi sudah diproses atau selesai.",
    ],
  },
  {
    judul: "10. Melihat Laporan",
    deskripsi: "Melihat ringkasan pendapatan dan berat sampah per bulan dalam satu tahun.",
    langkah: [
      "Buka menu \"Laporan\" di sidebar.",
      "Pilih tahun yang ingin ditinjau menggunakan filter tahun di kanan atas tabel.",
      "Lihat rincian jumlah transaksi, total berat, dan pendapatan per bulan pada tabel.",
    ],
  },
  {
    judul: "11. Export PDF",
    deskripsi: "Mengunduh laporan dalam bentuk dokumen PDF untuk keperluan pengarsipan atau presentasi.",
    langkah: [
      "Buka menu \"Laporan\" dan pilih tahun yang diinginkan.",
      "Klik tombol \"Export PDF\".",
      "File PDF laporan akan otomatis terunduh ke perangkat.",
    ],
  },
  {
    judul: "12. Export Excel",
    deskripsi: "Mengunduh laporan dalam bentuk file Excel untuk diolah lebih lanjut.",
    langkah: [
      "Buka menu \"Laporan\" dan pilih tahun yang diinginkan.",
      "Klik tombol \"Export Excel\".",
      "File Excel laporan akan otomatis terunduh ke perangkat.",
    ],
  },
  {
    judul: "13. Prediksi Pendapatan",
    deskripsi: "Menjalankan prediksi pendapatan Bank Sampah untuk beberapa bulan ke depan menggunakan algoritma Random Forest Regression.",
    langkah: [
      "Buka menu \"Prediksi\" di sidebar.",
      "Pilih rentang waktu prediksi, 6 Bulan atau 12 Bulan.",
      "Klik tombol \"Jalankan Prediksi\" dan tunggu hasilnya diproses.",
    ],
    catatan: "Prediksi membutuhkan minimal 3 bulan data transaksi historis agar dapat dijalankan.",
  },
  {
    judul: "14. Membaca Hasil Prediksi",
    deskripsi: "Memahami arti grafik dan metrik evaluasi yang muncul setelah prediksi dijalankan.",
    langkah: [
      "Lihat kartu ringkasan untuk total dan rata-rata prediksi pendapatan.",
      "Perhatikan grafik prediksi — garis menunjukkan proyeksi pendapatan tiap bulan ke depan.",
      "Baca kartu penjelasan MAE, MSE, RMSE, dan R² untuk memahami seberapa akurat model prediksi.",
      "Lihat tabel prediksi di bagian bawah untuk rincian angka per bulan.",
    ],
  },
  {
    judul: "15. Logout",
    deskripsi: "Keluar dari sistem admin dengan aman setelah selesai menggunakan website.",
    langkah: [
      "Klik tombol \"Keluar\" di bagian bawah sidebar.",
      "Konfirmasi pada kotak dialog yang muncul dengan klik \"Ya\".",
    ],
    catatan: "Selalu logout setelah selesai menggunakan komputer bersama, terutama di komputer publik.",
  },
];

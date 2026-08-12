/**
 * Ekspor Laporan ke PDF dan Excel
 *
 * Menyusun berkas laporan pendapatan langsung di sisi peramban, tanpa
 * melibatkan backend. Data yang diolah adalah data yang sedang ditampilkan di
 * halaman Laporan, sehingga isi berkas selalu sama dengan yang dilihat
 * pengguna.
 *
 * Pustaka yang dipakai:
 *   jsPDF + jspdf-autotable - menyusun berkas PDF beserta tabelnya
 *   ExcelJS                 - menyusun berkas Excel beserta pewarnaannya
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { formatCurrency, formatNumber } from "./formatCurrency";
import { formatDate } from "./formatDate";
import { COLORS } from "../constants/colors";
import logoUrl from "../assets/icons/logobanksampah.png";

/**
 * Mengubah kode warna heksadesimal menjadi komponen merah, hijau, dan biru.
 *
 * Diperlukan karena jsPDF hanya menerima warna dalam bentuk tiga angka RGB,
 * sedangkan palet aplikasi disimpan dalam bentuk heksadesimal.
 *
 * @param {string} hex - Kode warna, misalnya "#546B41".
 * @returns {number[]} Nilai [merah, hijau, biru] dalam rentang 0-255.
 */
const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  const bigint = parseInt(value, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

// Warna yang dipakai berulang pada berkas PDF, dihitung sekali di awal
const PRIMARY_RGB = hexToRgb(COLORS.primary);
const SIDEBAR_RGB = hexToRgb(COLORS.sidebar);
const TEXT_RGB = hexToRgb(COLORS.text);

// Tinggi kepala halaman PDF dalam satuan milimeter
const HEADER_HEIGHT = 32;

/**
 * Menyusun baris-baris tabel laporan.
 *
 * @param {object} laporan - Data laporan dari backend.
 * @returns {Array<Array<string|number>>} Baris tabel yang siap dicetak.
 */
const buildRows = (laporan) =>
  laporan.rows.map((row) => [
    row.bulan,
    row.jumlah_transaksi,
    `${formatNumber(row.total_berat)} Kg`,
    formatCurrency(row.pendapatan),
  ]);

/**
 * Memuat berkas logo dan mengubahnya menjadi data URL.
 *
 * jsPDF tidak dapat mengambil gambar dari alamat tertentu dengan sendirinya;
 * isi gambar harus sudah tersedia saat addImage dipanggil. Karena itu logo
 * diambil lebih dahulu lalu diubah bentuknya.
 *
 * Bila pemuatan gagal, fungsi mengembalikan null dan laporan tetap dibuat
 * tanpa logo. Kegagalan memuat gambar tidak boleh menggagalkan ekspor.
 *
 * @returns {Promise<string|null>} Data URL gambar, atau null bila gagal.
 */
const loadLogoAsDataUrl = async () => {
  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

/**
 * Menggambar kepala halaman PDF berisi logo, judul, dan tanggal ekspor.
 *
 * @param {jsPDF} doc - Dokumen PDF yang sedang disusun.
 * @param {number} pageWidth - Lebar halaman.
 * @param {string|null} logoDataUrl - Data URL logo, boleh null.
 * @param {number} tahun - Tahun laporan.
 */
const drawHeader = (doc, pageWidth, logoDataUrl, tahun) => {
  doc.setFillColor(...PRIMARY_RGB);
  doc.rect(0, 0, pageWidth, HEADER_HEIGHT, "F");

  // Teks digeser ke kanan bila ada logo, agar keduanya tidak bertumpuk
  const textX = logoDataUrl ? 40 : 14;
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 14, 6, 20, 20);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, "bold");
  doc.setFontSize(16);
  doc.text("BANK SAMPAH MACODES", textX, 14);

  doc.setFont(undefined, "normal");
  doc.setFontSize(11);
  doc.text(`Laporan Pendapatan Tahun ${tahun}`, textX, 22);

  doc.setFontSize(9);
  doc.text(`Tanggal Export: ${formatDate(new Date())}`, pageWidth - 14, 14, { align: "right" });
};

/**
 * Menggambar kaki halaman PDF berisi nama instansi dan nomor halaman.
 *
 * @param {jsPDF} doc - Dokumen PDF yang sedang disusun.
 * @param {number} pageWidth - Lebar halaman.
 * @param {number} pageHeight - Tinggi halaman.
 * @param {number} pageNumber - Nomor halaman saat ini.
 * @param {number} totalPages - Jumlah seluruh halaman.
 */
const drawFooter = (doc, pageWidth, pageHeight, pageNumber, totalPages) => {
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text("Bank Sampah Macodes", 14, pageHeight - 10);
  doc.text(`Halaman ${pageNumber} dari ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
};

/**
 * Membuat dan mengunduh laporan dalam bentuk berkas PDF.
 *
 * Kaki halaman digambar pada perulangan tersendiri setelah tabel selesai
 * dibuat, sebab jumlah total halaman baru diketahui setelah seluruh isi
 * tabel tertata.
 *
 * @param {object} laporan - Data laporan dari backend.
 * @returns {Promise<void>} Berkas langsung terunduh setelah selesai.
 */
export const exportLaporanToPdf = async (laporan) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logoDataUrl = await loadLogoAsDataUrl();

  autoTable(doc, {
    startY: HEADER_HEIGHT + 10,
    margin: { top: HEADER_HEIGHT + 6 },
    head: [["Bulan", "Jumlah Transaksi", "Total Berat", "Pendapatan"]],
    body: buildRows(laporan),
    foot: [["Total", laporan.total_transaksi, `${formatNumber(laporan.total_berat)} Kg`, formatCurrency(laporan.total_pendapatan)]],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 5, lineColor: [209, 213, 219], lineWidth: 0.15 },
    headStyles: { fillColor: PRIMARY_RGB, textColor: 255, fontStyle: "bold" },
    footStyles: { fillColor: SIDEBAR_RGB, textColor: TEXT_RGB, fontStyle: "bold" },
    // Dipanggil setiap kali halaman baru dibuat, sehingga kepala halaman
    // tetap muncul walau tabelnya panjang dan terbagi beberapa halaman
    didDrawPage: () => drawHeader(doc, pageWidth, logoDataUrl, laporan.tahun),
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawFooter(doc, pageWidth, pageHeight, page, totalPages);
  }

  doc.save(`laporan-macodes-${laporan.tahun}.pdf`);
};

/**
 * Membuat dan mengunduh laporan dalam bentuk berkas Excel.
 *
 * Berbeda dengan PDF yang isinya berupa teks siap cetak, berkas Excel diisi
 * angka mentah agar tetap dapat dihitung ulang oleh pengguna. Tampilan angka
 * diatur lewat format sel, bukan dengan mengubah isinya menjadi teks.
 *
 * @param {object} laporan - Data laporan dari backend.
 * @returns {Promise<void>} Berkas langsung terunduh setelah selesai.
 */
export const exportLaporanToExcel = async (laporan) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Laporan ${laporan.tahun}`);

  const columns = [
    { header: "Bulan", key: "bulan" },
    { header: "Jumlah Transaksi", key: "jumlah_transaksi" },
    { header: "Total Berat (Kg)", key: "total_berat" },
    { header: "Pendapatan (Rp)", key: "pendapatan" },
  ];
  sheet.columns = columns;

  // Sisipkan judul laporan, tanggal ekspor, dan satu baris kosong di atas tabel
  sheet.spliceRows(1, 0, [`Laporan Pendapatan Bank Sampah Macodes - ${laporan.tahun}`], [`Tanggal Export: ${formatDate(new Date())}`], []);
  sheet.mergeCells(1, 1, 1, columns.length);
  sheet.mergeCells(2, 1, 2, columns.length);
  sheet.getCell("A1").font = { bold: true, size: 14 };
  sheet.getCell("A2").font = { italic: true, color: { argb: "FF6B7280" } };

  // Baris 1-3 sudah terpakai judul, sehingga kepala tabel berada di baris ke-4
  const headerRowNumber = 4;
  const headerRow = sheet.getRow(headerRowNumber);
  headerRow.values = columns.map((col) => col.header);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF546B41" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Isi tabel dengan data tiap bulan
  laporan.rows.forEach((row) => {
    sheet.addRow({
      bulan: row.bulan,
      jumlah_transaksi: row.jumlah_transaksi,
      total_berat: row.total_berat,
      pendapatan: row.pendapatan,
    });
  });

  // Baris total di bagian bawah, dibedakan dengan huruf tebal dan warna latar
  const totalRow = sheet.addRow({
    bulan: "TOTAL",
    jumlah_transaksi: laporan.total_transaksi,
    total_berat: laporan.total_berat,
    pendapatan: laporan.total_pendapatan,
  });
  totalRow.font = { bold: true };
  totalRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE1EAD3" } };
  });

  // Tampilkan pemisah ribuan pada kolom berat dan pendapatan
  sheet.getColumn("total_berat").numFmt = "#,##0.00";
  sheet.getColumn("pendapatan").numFmt = "#,##0";

  // Sesuaikan lebar kolom dengan isi terpanjangnya. Baris judul di atas tabel
  // sengaja dilewati karena selnya digabung melintasi seluruh kolom, sehingga
  // bila ikut dihitung semua kolom akan melebar berlebihan.
  sheet.columns.forEach((column) => {
    let maxLength = column.header.length;
    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber < headerRowNumber) return;
      const length = cell.value ? String(cell.value).length : 0;
      if (length > maxLength) maxLength = length;
    });
    // Tambahan 4 karakter sebagai jarak agar teks tidak menempel di tepi sel
    column.width = maxLength + 4;
  });
  sheet.getColumn(1).alignment = { vertical: "middle" };

  // Bekukan baris kepala tabel supaya tetap terlihat saat digulir ke bawah
  sheet.views = [{ state: "frozen", ySplit: headerRowNumber }];

  // Beri garis tepi tipis pada seluruh sel tabel, dari kepala sampai baris total
  const thinBorder = { style: "thin", color: { argb: "FFCFC7B0" } };
  for (let rowNumber = headerRowNumber; rowNumber <= sheet.rowCount; rowNumber += 1) {
    sheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell) => {
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    });
  }

  // Ubah workbook menjadi berkas, lalu picu unduhan lewat tautan sementara
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `laporan-macodes-${laporan.tahun}.xlsx`;
  link.click();

  // Lepaskan alamat sementara agar memori peramban tidak terus terpakai
  URL.revokeObjectURL(url);
};

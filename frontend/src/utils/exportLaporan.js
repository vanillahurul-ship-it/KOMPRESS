import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { formatCurrency, formatNumber } from "./formatCurrency";
import { formatDate } from "./formatDate";
import { COLORS } from "../constants/colors";
import logoUrl from "../assets/icons/logobanksampah.png";

const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  const bigint = parseInt(value, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const PRIMARY_RGB = hexToRgb(COLORS.primary);
const SIDEBAR_RGB = hexToRgb(COLORS.sidebar);
const TEXT_RGB = hexToRgb(COLORS.text);

const HEADER_HEIGHT = 32;

const buildRows = (laporan) =>
  laporan.rows.map((row) => [
    row.bulan,
    row.jumlah_transaksi,
    `${formatNumber(row.total_berat)} Kg`,
    formatCurrency(row.pendapatan),
  ]);

// jsPDF can't fetch a remote/bundled image itself — addImage needs the raw data
// already in hand, so the logo is fetched once and converted to a data URL first.
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

const drawHeader = (doc, pageWidth, logoDataUrl, tahun) => {
  doc.setFillColor(...PRIMARY_RGB);
  doc.rect(0, 0, pageWidth, HEADER_HEIGHT, "F");

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

const drawFooter = (doc, pageWidth, pageHeight, pageNumber, totalPages) => {
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text("Bank Sampah Macodes", 14, pageHeight - 10);
  doc.text(`Halaman ${pageNumber} dari ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
};

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
    didDrawPage: () => drawHeader(doc, pageWidth, logoDataUrl, laporan.tahun),
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawFooter(doc, pageWidth, pageHeight, page, totalPages);
  }

  doc.save(`laporan-macodes-${laporan.tahun}.pdf`);
};

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

  // Judul laporan + tanggal export sebagai 2 baris pertama, di atas header tabel.
  sheet.spliceRows(1, 0, [`Laporan Pendapatan Bank Sampah Macodes - ${laporan.tahun}`], [`Tanggal Export: ${formatDate(new Date())}`], []);
  sheet.mergeCells(1, 1, 1, columns.length);
  sheet.mergeCells(2, 1, 2, columns.length);
  sheet.getCell("A1").font = { bold: true, size: 14 };
  sheet.getCell("A2").font = { italic: true, color: { argb: "FF6B7280" } };

  const headerRowNumber = 4;
  const headerRow = sheet.getRow(headerRowNumber);
  headerRow.values = columns.map((col) => col.header);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF546B41" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  laporan.rows.forEach((row) => {
    sheet.addRow({
      bulan: row.bulan,
      jumlah_transaksi: row.jumlah_transaksi,
      total_berat: row.total_berat,
      pendapatan: row.pendapatan,
    });
  });

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

  // Format angka dengan pemisah ribuan pada kolom berat & pendapatan.
  sheet.getColumn("total_berat").numFmt = "#,##0.00";
  sheet.getColumn("pendapatan").numFmt = "#,##0";

  // Lebar kolom otomatis mengikuti konten terpanjang di tiap kolom (dihitung dari baris
  // header tabel ke bawah saja — baris judul/tanggal di atas ter-merge lintas kolom jadi
  // diabaikan supaya tidak membuat semua kolom melebar berlebihan).
  sheet.columns.forEach((column) => {
    let maxLength = column.header.length;
    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber < headerRowNumber) return;
      const length = cell.value ? String(cell.value).length : 0;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 4;
  });
  sheet.getColumn(1).alignment = { vertical: "middle" };

  // Freeze header row supaya tetap terlihat saat scroll ke bawah.
  sheet.views = [{ state: "frozen", ySplit: headerRowNumber }];

  // Border tipis di seluruh sel tabel (header + data + total).
  const thinBorder = { style: "thin", color: { argb: "FFCFC7B0" } };
  for (let rowNumber = headerRowNumber; rowNumber <= sheet.rowCount; rowNumber += 1) {
    sheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell) => {
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `laporan-macodes-${laporan.tahun}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

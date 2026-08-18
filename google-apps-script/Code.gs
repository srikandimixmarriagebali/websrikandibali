/**
 * =========================================================================
 * GOOGLE APPS SCRIPT — PUSAT PENGELOLAAN DATA SRIKANDI BALI
 * =========================================================================
 * Spreadsheet: Srikandi Bali Official Database
 * Versi: 2.2 (Support Web App Deployment + Modal Dialog + Sidebar)
 *
 * CARA DEPLOY MENJADI WEB APP MANDIRI (FULL SCREEN):
 * 1. Buka editor Google Apps Script.
 * 2. Klik tombol biru "Terapkan" (Deploy) di kanan atas -> Pilih "Penerapan Baru" (New Deployment).
 * 3. Klik ikon Gerigi (⚙️) di samping "Pilih jenis" -> Pilih "Aplikasi Web" (Web App).
 * 4. Isi:
 *    - Deskripsi: Admin Portal Srikandi Bali
 *    - Jalankan sebagai (Execute as): Saya (email Anda)
 *    - Yang memiliki akses (Who has access): Siapa saja (Anyone) atau Hanya saya
 * 5. Klik "Terapkan" (Deploy) -> Salin URL Aplikasi Web Anda.
 * 6. Buka link tersebut di browser, Anda akan mendapatkan Portal Admin Full Screen yang megah!
 * =========================================================================
 */

/**
 * Endpoint untuk Web App Deployment (Membuka di Tab Browser Penuh / URL Mandiri)
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Srikandi Bali — Admin Portal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Membuat Menu Kustom di Toolbar Google Sheet saat file dibuka
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🌸 Srikandi Bali Admin')
    .addItem('🖥️ 1. Buka Panel Admin Layar Penuh (Dialog Besar)', 'showFullDialog')
    .addItem('📱 2. Buka Panel Admin Sisi Kanan (Sidebar)', 'showSidebar')
    .addSeparator()
    .addItem('📊 3. Hitung Ulang Total Donasi & Donatur', 'recalculateAllCampaignTotals')
    .addItem('👥 4. Hitung Ulang Total Peserta Event', 'recalculateAllEventParticipants')
    .addSeparator()
    .addItem('✅ 5. Verifikasi Donatur (Baris Terpilih -> konfirm)', 'confirmSelectedDonorRow')
    .addSeparator()
    .addItem('🎨 6. Rapikan & Format Warna Semua Sheet', 'formatAllSheets')
    .addToUi();
}

/**
 * Menampilkan Dialog Panel Admin Layar Penuh (Lebar 1000px) di dalam Google Sheets
 */
function showFullDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setWidth(1000)
    .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, '🌸 Srikandi Bali — Panel Kontrol Admin Portal');
}

/**
 * Menampilkan Sidebar di Sisi Kanan Google Sheets
 */
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Srikandi Bali — Admin Panel')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Trigger Otomatis saat Anda mengedit sel di Google Sheet
 */
function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();

  // Jika mengedit di tab 'Donatur'
  if (sheetName === 'Donatur' && row > 1) {
    var campaignId = sheet.getRange(row, 1).getValue();
    if (campaignId) {
      updateCampaignTotalForId(campaignId);
    }
  }

  // Jika mengedit/menambah di tab 'Peserta'
  if (sheetName === 'Peserta' && row > 1) {
    var eventId = sheet.getRange(row, 1).getValue();
    if (eventId) {
      updateEventParticipantCount(eventId);
    }
  }
}

/**
 * =========================================================================
 * FUNGSI BACKEND YANG DIPANGGIL DARI SIDEBAR HTML / WEB APP
 * =========================================================================
 */

// 1. Tambah Event Baru
function addNewEventFromSidebar(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Events');
  if (!sheet) throw new Error('Tab Events tidak ditemukan.');

  var newId = 'evt-' + new Date().getTime();
  sheet.appendRow([
    newId,
    data.title || '',
    data.category || 'Workshop/Legal',
    data.date || '',
    data.time || '10:00 - 13:00 WITA',
    data.location || '',
    data.location || '',
    'upcoming',
    0,
    Number(data.maxCapacity) || 50,
    data.speaker || 'Pengurus Srikandi Bali',
    data.image || '',
    data.summary || '',
    data.summary || '',
    data.highlights || '',
    data.phone || '081234567890',
    'Dukungan advokasi dan pemberdayaan wanita Indonesia.',
    'FALSE'
  ]);

  return { success: true, id: newId };
}

// 2. Tambah Program Donasi
function addNewCampaignFromSidebar(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Campaigns');
  if (!sheet) throw new Error('Tab Campaigns tidak ditemukan.');

  var newId = 'camp-' + new Date().getTime();
  sheet.appendRow([
    newId,
    data.title || '',
    'Charity',
    Number(data.targetAmount) || 25000000,
    0,
    0,
    'active',
    data.beneficiaries || '',
    data.location || 'Bali',
    data.image || '',
    data.description || ''
  ]);

  return { success: true, id: newId };
}

// 3. Tambah Rekening
function addNewRekeningFromSidebar(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Rekening');
  if (!sheet) throw new Error('Tab Rekening tidak ditemukan.');

  sheet.appendRow([
    data.bank_name || '',
    data.account_number || '',
    data.account_holder || 'Yayasan Srikandi Mix Marriage Bali',
    data.branch || 'Bali',
    'TRUE'
  ]);

  return { success: true };
}

// 4. Ambil Daftar Donatur Pending ('not')
function getPendingDonors() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Donatur');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var pending = [];

  for (var i = 1; i < data.length; i++) {
    var status = String(data[i][3] || '').trim().toLowerCase();
    if (status === 'not' || status === 'pending' || status === '') {
      pending.push({
        rowIndex: i + 1,
        campaignId: data[i][0],
        nama: data[i][1],
        jumlah_donasi: data[i][2],
        tanggal: data[i][4]
      });
    }
  }

  return pending;
}

// 5. Verifikasi Donatur Berdasarkan Nomor Baris
function verifyDonorByRow(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Donatur');
  if (!sheet || rowIndex <= 1) throw new Error('Invalid row index');

  sheet.getRange(rowIndex, 4).setValue('konfirm');
  var campaignId = sheet.getRange(rowIndex, 1).getValue();
  if (campaignId) {
    updateCampaignTotalForId(campaignId);
  }

  return { success: true };
}

/**
 * =========================================================================
 * HITUNG ULANG TOTAL DONASI & DONATUR DI TAB 'Campaigns'
 * =========================================================================
 */
function recalculateAllCampaignTotals() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var campaignSheet = ss.getSheetByName('Campaigns');
  var donorSheet = ss.getSheetByName('Donatur');

  if (!campaignSheet || !donorSheet) {
    return 'Tab Campaigns atau Donatur tidak ditemukan.';
  }

  var donorData = donorSheet.getDataRange().getValues();
  var campaignTotals = {};

  for (var i = 1; i < donorData.length; i++) {
    var campId = String(donorData[i][0] || '').trim();
    var amount = Number(donorData[i][2]) || 0;
    var status = String(donorData[i][3] || '').trim().toLowerCase();

    if (!campId) continue;

    if (!campaignTotals[campId]) {
      campaignTotals[campId] = { totalAmount: 0, donorCount: 0 };
    }

    if (status === 'konfirm' || status === 'confirm') {
      campaignTotals[campId].totalAmount += amount;
      campaignTotals[campId].donorCount += 1;
    }
  }

  var campaignData = campaignSheet.getDataRange().getValues();
  var updatedCount = 0;

  for (var r = 1; r < campaignData.length; r++) {
    var cId = String(campaignData[r][0] || '').trim();
    if (!cId) continue;

    var totals = campaignTotals[cId] || { totalAmount: 0, donorCount: 0 };
    campaignSheet.getRange(r + 1, 5).setValue(totals.totalAmount);
    campaignSheet.getRange(r + 1, 6).setValue(totals.donorCount);
    updatedCount++;
  }

  return '✅ ' + updatedCount + ' program donasi di tab Campaigns berhasil disinkronkan!';
}

function updateCampaignTotalForId(targetCampaignId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var campaignSheet = ss.getSheetByName('Campaigns');
  var donorSheet = ss.getSheetByName('Donatur');
  if (!campaignSheet || !donorSheet || !targetCampaignId) return;

  var donorData = donorSheet.getDataRange().getValues();
  var totalAmount = 0;
  var donorCount = 0;

  for (var i = 1; i < donorData.length; i++) {
    var campId = String(donorData[i][0] || '').trim();
    var amount = Number(donorData[i][2]) || 0;
    var status = String(donorData[i][3] || '').trim().toLowerCase();

    if (campId === targetCampaignId && (status === 'konfirm' || status === 'confirm')) {
      totalAmount += amount;
      donorCount += 1;
    }
  }

  var campaignData = campaignSheet.getDataRange().getValues();
  for (var r = 1; r < campaignData.length; r++) {
    var cId = String(campaignData[r][0] || '').trim();
    if (cId === targetCampaignId) {
      campaignSheet.getRange(r + 1, 5).setValue(totalAmount);
      campaignSheet.getRange(r + 1, 6).setValue(donorCount);
      break;
    }
  }
}

/**
 * =========================================================================
 * HITUNG ULANG TOTAL PESERTA DI TAB 'Events'
 * =========================================================================
 */
function recalculateAllEventParticipants() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var eventSheet = ss.getSheetByName('Events');
  var pesertaSheet = ss.getSheetByName('Peserta');

  if (!eventSheet || !pesertaSheet) {
    return 'Tab Events atau Peserta tidak ditemukan.';
  }

  var pesertaData = pesertaSheet.getDataRange().getValues();
  var eventCounts = {};

  for (var i = 1; i < pesertaData.length; i++) {
    var evtId = String(pesertaData[i][0] || '').trim();
    if (!evtId) continue;
    eventCounts[evtId] = (eventCounts[evtId] || 0) + 1;
  }

  var eventData = eventSheet.getDataRange().getValues();
  for (var r = 1; r < eventData.length; r++) {
    var eId = String(eventData[r][0] || '').trim();
    if (!eId) continue;
    var count = eventCounts[eId] || 0;
    eventSheet.getRange(r + 1, 9).setValue(count);
  }

  return '✅ Jumlah peserta di tab Events telah disinkronkan!';
}

function updateEventParticipantCount(targetEventId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var eventSheet = ss.getSheetByName('Events');
  var pesertaSheet = ss.getSheetByName('Peserta');
  if (!eventSheet || !pesertaSheet || !targetEventId) return;

  var pesertaData = pesertaSheet.getDataRange().getValues();
  var count = 0;
  for (var i = 1; i < pesertaData.length; i++) {
    if (String(pesertaData[i][0] || '').trim() === targetEventId) {
      count++;
    }
  }

  var eventData = eventSheet.getDataRange().getValues();
  for (var r = 1; r < eventData.length; r++) {
    if (String(eventData[r][0] || '').trim() === targetEventId) {
      eventSheet.getRange(r + 1, 9).setValue(count);
      break;
    }
  }
}

/**
 * =========================================================================
 * VERIFIKASI BARIS AKTIF DI TAB 'Donatur'
 * =========================================================================
 */
function confirmSelectedDonorRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== 'Donatur') {
    SpreadsheetApp.getUi().alert('Silakan buka tab "Donatur" terlebih dahulu, lalu pilih/klik baris donatur yang ingin diverifikasi.');
    return;
  }

  var range = sheet.getActiveRange();
  var row = range.getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert('Silakan pilih baris data donatur (bukan baris judul kolom).');
    return;
  }

  sheet.getRange(row, 4).setValue('konfirm');
  var campaignId = sheet.getRange(row, 1).getValue();
  var donorName = sheet.getRange(row, 2).getValue();
  var amount = sheet.getRange(row, 3).getValue();

  if (campaignId) {
    updateCampaignTotalForId(campaignId);
  }

  SpreadsheetApp.getUi().alert(
    '✅ Donatur Terverifikasi!\n\nNama: ' + donorName + '\nNominal: Rp ' + Number(amount).toLocaleString('id-ID') + '\nStatus: konfirm\n\nTotal dana terkumpul di tab Campaigns sudah otomatis di-update!'
  );
}

function formatAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

  sheets.forEach(function(sheet) {
    sheet.setFrozenRows(1);
    var lastCol = sheet.getLastColumn() || 1;
    var headerRange = sheet.getRange(1, 1, 1, lastCol);
    headerRange.setBackground('#881337'); // Maroon Resmi Srikandi
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
  });

  return '✨ Semua tab Google Sheets Anda telah diformat rapi!';
}

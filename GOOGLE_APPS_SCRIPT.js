/**
 * GOOGLE APPS SCRIPT FOR NEXAOPS
 * 
 * Instructions:
 * 1. Open Google Sheets.
 * 2. Go to Extensions > App Script.
 * 3. Paste this code.
 * 4. Create a sheet named "Users" with columns: id, name, email, role, department, password, created_at.
 * 5. Create a sheet named "Messages" with columns: id, channel, sender_name, sender_role, message, data_type, data_payload, created_at.
 * 6. Click Deploy > New Deployment.
 * 7. Select "Web App".
 * 8. Execute as "Me", Access "Anyone".
 * 9. Copy the Web App URL to your .env file as VITE_GS_URL.
 */

const SPREADSHEET_MAP = {
  'tera_harian': '1OiwcBmACpll4Du7_3OWS5CsFXaPtDHXd31UG4a8MhuU',
  'genset': '1OFH_L_n303L9K2yJpeD1Sg1ofk4j1q0eKTDFVWxia6w',
  'kph_tangki': '1iQAGW-1xTIQfwYFHDInlX0cEDddj6h-EIwFmc1OcUrE',
  'kph_pompa': '1fhPzIE-XQ8KOzBKqxcd0kg7KP7s0Wvxafq7U8ifIIcU',
  'riwayat_pompa': '1PPsJSPNSXccGfEuQ9WrPTHm9khuLdwVTlhu7OcKAB50',
  'hk_toilet': '1Evk3bZYXBLUP3FHkYRGIRBQX-8IO6UVbXJ8kU9-vRBE',
  'hk_taman': '1FeQdsokkdciQKoAzpapMzUboq8Wkdr65fU5LKoLMtbI',
  'hk_wudhu': '1ouXnusFduhFAl1MOaLbYlGG_Wkbvjkq4kYORMjVsWg0',
  'hk_musholla': '18qVTN6hsm1uxv2GnzSgKVz4HtdqPS6CZSAciRlp7T9s',
  'hk_kantor': '1T1sNyKIfW4TfBacsEsM_UQ5FI0iMJJuh1UOKOS_WJ_8',
  'hk_driveway': '1HUCbdJyanllgjLM5EbOv6tFw16meBSyUlpQeK3ld10Q',
  'sumur_pantau': '1DeyyM555kfbCfpBCt3wLz4bzj3oL3y8fFFc6yImABRc',
  'breakdown': '1_nEku-rh_BT9sqivdM6lShbVngivaKF2dazLzm2R-5A',
  'main': '1HUCbdJyanllgjLM5EbOv6tFw16meBSyUlpQeK3ld10Q' // Default
};

function getSS(category) {
  const ID = SPREADSHEET_MAP[category] || SPREADSHEET_MAP['main'];
  return SpreadsheetApp.openById(ID);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const category = data.category || 'main';
    const ss = getSS(category);
    
    if (action === 'register') {
      return handleRegister(ss, data.payload);
    } else if (action === 'login') {
      return handleLogin(ss, data.payload);
    } else if (action === 'getMessages') {
      return handleGetMessages(ss, data.channel);
    } else if (action === 'sendMessage') {
      return handleSendMessage(ss, data.payload);
    } else if (action === 'submitAplusan') {
      return handleAplusan(ss, data.payload);
    } else if (action === 'submitPenjualan') {
      return handlePenjualan(ss, data.payload);
    } else if (action === 'submitQQ') {
      return handleQQ(ss, data.payload);
    } else if (action === 'submitHousekeeping') {
      return handleHousekeeping(ss, data.category, data.payload);
    } else if (action === 'submitMaintenance') {
      return handleMaintenance(ss, data.category, data.payload);
    } else if (action === 'submitIncident') {
      return handleIncident(ss, data.payload);
    } else if (action === 'submitSumur') {
      return handleSumur(ss, data.payload);
    } else if (action === 'getData') {
      return handleGetData(ss, data.payload);
    }
    
    return createResponse({ success: false, error: 'Invalid action' });
  } catch (err) {
    return createResponse({ success: false, error: err.toString() });
  }
}

function handleGetData(ss, payload) {
  const sheet = ss.getSheetByName(payload.sheetName) || ss.getSheets()[0];
  if (!sheet) return createResponse({ success: false, error: 'Sheet not found' });
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return createResponse({ success: true, data: [] });

  const headers = data[0];
  const rows = data.slice(1).reverse().slice(0, 50);
  
  const formatted = rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  
  return createResponse({ success: true, data: formatted });
}

function handleSumur(ss, payload) {
  const sheet = ss.getSheets()[0];
  sheet.appendRow([
    new Date(), payload.no, payload.tanggal, payload.sumur1, payload.sumur2, payload.sumur3, payload.sumur4, payload.sumur5, payload.hasil, payload.keterangan, payload.user
  ]);
  return createResponse({ success: true });
}

function handleIncident(ss, payload) {
  const sheet = ss.getSheets()[0];
  sheet.appendRow([
    new Date(), payload.no, payload.namaUnit, payload.deskripsi, payload.tindakan, payload.penanggungJawab, payload.tglKerusakan, payload.tglPemberitahuan, payload.tglPerbaikan, payload.tglSelesai, payload.user
  ]);
  return createResponse({ success: true });
}

function handleMaintenance(ss, category, payload) {
  const sheet = ss.getSheets()[0];
  if (category === 'genset') {
    sheet.appendRow([
      new Date(), payload.spbu, payload.bulan, payload.tanggal, payload.bahanBakar, payload.airBaterai, payload.radiator, payload.oliMesin, payload.filterMinyak, payload.filterUdara, payload.panaskan, payload.catatan, payload.user
    ]);
  } else if (category === 'kph_tangki' || category === 'kph_pompa') {
    sheet.appendRow([
      new Date(), payload.spbu, payload.bulan, payload.merek, payload.type, payload.kapasitas, payload.noSeri, payload.tanggal, payload.piping, payload.ventValve, payload.motorStp, payload.mlld, payload.nozzle, payload.swivel, payload.handClutch, payload.hose, payload.filter, payload.user
    ]);
  } else if (category === 'riwayat_pompa') {
    sheet.appendRow([
       new Date(), payload.no, payload.tanggal, payload.uraian, payload.totalisator, payload.part, payload.keterangan, payload.user
    ]);
  }
  return createResponse({ success: true });
}

function handleHousekeeping(ss, category, payload) {
  const sheet = ss.getSheets()[0];
  sheet.appendRow([
    new Date(), payload.spbu, payload.bulan, payload.shift, payload.tanggal,
    JSON.stringify(payload.activities),
    payload.supervisor, payload.catatan, payload.user
  ]);
  return createResponse({ success: true });
}

function handlePenjualan(ss, payload) {
  const sheet = ss.getSheetByName('Data Penjualan') || ss.getSheets()[0];
  sheet.appendRow([
    payload.produk, new Date(), payload.tanggal, payload.shift, payload.stockAwal, 
    payload.noMobilTangki, payload.noPnbp, payload.volSebelum, payload.volPnbp, 
    payload.volAktual, payload.selisihVol, payload.pengeluaranDispenser, 
    payload.stockTeoritis, payload.stockAkhirAktual, payload.selisih, 
    payload.total, payload.parafSpv, payload.catatan, payload.user
  ]);
  return createResponse({ success: true });
}

function handleQQ(ss, payload) {
  const sheet = ss.getSheets()[0];
  sheet.appendRow([
    payload.produk, new Date(), payload.tanggal, payload.jam, payload.densityObs, 
    payload.suhuObs, payload.densityStd15, payload.tinggiAir, payload.jamPenerimaan, 
    payload.noMobilTangki, payload.noPnbp, payload.densityPnbpStd15, 
    payload.densityObsIn, payload.suhuObsIn, payload.densityStd15In, 
    payload.selisihDensity, payload.jamAfter, payload.densityObsAfter, 
    payload.suhuObsAfter, payload.densityStd15After, payload.user
  ]);
  return createResponse({ success: true });
}

function handleAplusan(ss, payload) {
  const sheet = ss.getSheetByName('Form APLUSAN') || ss.getSheets()[0];
  sheet.appendRow([
    new Date(), payload.nozzle, payload.bukaManual, payload.imgBukaManual, payload.tutupManual, payload.imgTutupManual, payload.hasilManual, payload.bukaDigital, payload.imgBukaDigital, payload.tutupDigital, payload.imgTutupDigital, payload.hasilDigital, payload.selisih, payload.pengguna
  ]);
  return createResponse({ success: true });
}

function handleRegister(ss, payload) {
  const sheet = ss.getSheetByName('Users');
  const email = payload.email.toString().trim().toLowerCase();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2].toString().trim().toLowerCase() === email) {
      return createResponse({ success: false, error: 'Email sudah terdaftar' });
    }
  }
  sheet.appendRow([Utilities.getUuid(), payload.name, email, payload.role, payload.department, payload.password.toString().trim(), new Date()]);
  return createResponse({ success: true });
}

function handleLogin(ss, payload) {
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  const inputEmail = payload.email.toString().trim().toLowerCase();
  const inputPw = payload.password.toString().trim();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2].toString().trim().toLowerCase() === inputEmail && data[i][5].toString().trim() === inputPw) {
      return createResponse({ success: true, user: { id: data[i][0], name: data[i][1], email: data[i][2], role: data[i][3], department: data[i][4] } });
    }
  }
  return createResponse({ success: false, error: 'Email atau password salah' });
}

function handleGetMessages(ss, channel) {
  const sheet = ss.getSheetByName('Messages');
  const data = sheet.getDataRange().getValues();
  const messages = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === channel) {
      messages.push({ id: data[i][0], channel: data[i][1], sender_name: data[i][2], sender_role: data[i][3], message: data[i][4], data_type: data[i][5], data_payload: data[i][6] ? JSON.parse(data[i][6]) : null, created_at: data[i][7] });
    }
  }
  return createResponse({ success: true, messages });
}

function handleSendMessage(ss, payload) {
  const sheet = ss.getSheetByName('Messages');
  sheet.appendRow([Utilities.getUuid(), payload.channel, payload.sender_name, payload.sender_role, payload.message, payload.data_type || 'text', payload.data_payload ? JSON.stringify(payload.data_payload) : '', new Date()]);
  return createResponse({ success: true });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Choose the sheet based on type
    var sheetId = data.type === 'parking'
      ? 'XXXXXXX'
      : 'XXXXXXXX';

    var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];

    if (data.type === 'visitor') {
      sheet.appendRow([
        new Date(),
        data.type || '',
        data.name || '',
        data.residentName || '',
        data.unitNo || '',
        data.phone || '',
        data.visitDate || '',
        data.visitTime || ''
      ]);
    } else if (data.type === 'parking') {
      sheet.appendRow([
        new Date(),
        data.type || '',
        data.visitorName || '',
        data.residentName || '',
        data.unitNo || '',
        data.carMake || '',
        data.carModel || '',
        data.carColor || '',
        data.licensePlate || '',
        data.visitDate || '',
        data.visitTime || ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

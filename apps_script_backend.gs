const SHEET_NAME = 'Hair Reviews';
const DRIVE_FOLDER_NAME = 'Hair Review Photos';

function setup() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('SHEET_ID')) {
    const spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    spreadsheet.getSheets()[0].appendRow([
      'id', 'timestamp', 'country', 'company', 'instagram', 'permission', 'photoCount', 'photoUrls'
    ]);
    properties.setProperty('SHEET_ID', spreadsheet.getId());
  }
  if (!properties.getProperty('ADMIN_TOKEN')) {
    properties.setProperty('ADMIN_TOKEN', Utilities.getUuid());
  }
  getPhotoFolder_();
  Logger.log('SHEET_ID: ' + properties.getProperty('SHEET_ID'));
  Logger.log('ADMIN_TOKEN: ' + properties.getProperty('ADMIN_TOKEN'));
}

function doPost(event) {
  try {
    const review = JSON.parse(event.postData.contents);
    const photoUrls = (review.photos || []).map(savePhoto_);
    const sheet = getSheet_();
    sheet.appendRow([
      review.id || Utilities.getUuid(),
      review.timestamp || new Date().toISOString(),
      review.country || '',
      review.company || '',
      review.instagram || '',
      review.permission === true ? 'Y' : 'N',
      photoUrls.length,
      photoUrls.join('\n')
    ]);
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet(event) {
  const params = event.parameter || {};
  if (params.token !== getAdminToken_()) return json_({ ok: false, error: 'Unauthorized' });

  if (params.action === 'list') return json_({ ok: true, data: readReviews_() });
  if (params.action === 'delete') {
    deleteReview_(params.id);
    return json_({ ok: true });
  }
  if (params.action === 'clear') {
    clearReviews_();
    return json_({ ok: true });
  }
  return json_({ ok: false, error: 'Unknown action' });
}

function readReviews_() {
  const values = getSheet_().getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1).map(row => ({
    id: String(row[0]),
    timestamp: row[1] instanceof Date ? row[1].toISOString() : String(row[1]),
    country: String(row[2] || ''),
    company: String(row[3] || ''),
    instagram: String(row[4] || ''),
    permission: String(row[5]).toUpperCase() === 'Y',
    photoCount: Number(row[6] || 0),
    photoUrls: String(row[7] || '').split('\n').filter(Boolean)
  }));
}

function deleteReview_(id) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  for (let row = values.length - 1; row > 0; row--) {
    if (String(values[row][0]) === String(id)) sheet.deleteRow(row + 1);
  }
}

function clearReviews_() {
  const sheet = getSheet_();
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
}

function savePhoto_(photo) {
  const match = String(photo.data || '').match(/^data:(.*?);base64,(.*)$/);
  if (!match) return '';
  const blob = Utilities.newBlob(Utilities.base64Decode(match[2]), match[1], photo.name || 'review-photo');
  return getPhotoFolder_().createFile(blob).getUrl();
}

function getSheet_() {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheets()[0];
}

function getPhotoFolder_() {
  const properties = PropertiesService.getScriptProperties();
  const folderId = properties.getProperty('FOLDER_ID');
  if (folderId) return DriveApp.getFolderById(folderId);
  const folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
  properties.setProperty('FOLDER_ID', folder.getId());
  return folder;
}

function getAdminToken_() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN');
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

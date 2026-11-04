/**
 * ====================================================================
 * SAKETH PORTFOLIO - SECURE GOOGLE SHEETS CRM & LEAD SYNC SCRIPT
 * ====================================================================
 * Automatically syncs incoming call bookings, project briefs, and
 * payment updates in real time with shared token authentication
 * and CSV/Formula injection protection.
 *
 * HOW TO SET UP (Takes 60 seconds):
 * 1. Open your Google Sheet -> Click Extensions > Apps Script
 * 2. Delete everything and paste this entire code
 * 3. Click "Save" (Ctrl+S / Cmd+S)
 * 4. Click "Deploy" > "Manage deployments" -> Edit -> "New version"
 * 5. Ensure "Who has access" is set to "Anyone"
 * 6. Click "Deploy"
 * ====================================================================
 */

// Reads secret key from Script Properties (Project Settings > Script Properties: SCRIPT_SECRET)
// Matching GOOGLE_SHEETS_SECRET in .env.local
var SCRIPT_SECRET = PropertiesService.getScriptProperties().getProperty("SCRIPT_SECRET");

function escapeFormula(val) {
  if (typeof val === "string") {
    var trimmed = val.trim();
    if (/^[=+\-@\t\r]/.test(trimmed)) {
      return "'" + val;
    }
  }
  return val;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);

    // SECURITY CHECK: Verify shared secret token to prevent unauthorized tampering
    if (SCRIPT_SECRET && payload.authSecret !== SCRIPT_SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", error: "Unauthorized: Invalid authentication secret token." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var HEADERS = [
      "ID",
      "Date & Time",
      "Type",
      "Status",
      "Name",
      "Contact (Email/WhatsApp)",
      "Service Requested",
      "Booked Schedule",
      "Budget / Model",
      "Deal Value ($)",
      "Amount Paid ($)",
      "Pending Balance ($)",
      "Payment Status",
      "Client Notes",
      "Internal Notes"
    ];

    // Auto-create stylish header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#121218");
      headerRange.setFontColor("#D2FF3F");
      sheet.setFrozenRows(1);
    }

    // BULK SYNC ALL LEADS
    if (payload.action === "sync_all") {
      sheet.clearContents();
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#121218");
      headerRange.setFontColor("#D2FF3F");
      sheet.setFrozenRows(1);

      payload.leads.forEach(function (l) {
        sheet.appendRow([
          escapeFormula(l.id),
          escapeFormula(l.createdAt),
          escapeFormula(l.type),
          escapeFormula(l.status),
          escapeFormula(l.name),
          escapeFormula(l.contact),
          escapeFormula(l.service),
          escapeFormula(l.schedule),
          escapeFormula(l.budgetOrPreference),
          l.dealValue,
          l.amountPaid,
          l.pendingBalance,
          escapeFormula(l.paymentStatus),
          escapeFormula(l.notes),
          escapeFormula(l.internalNotes)
        ]);
      });

      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", count: payload.leads.length })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // SINGLE LEAD SYNC (Updates existing row or appends new row)
    var l = payload.lead;
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === l.id) {
        rowIndex = i + 1; // 1-indexed row number
        break;
      }
    }

    var rowValues = [
      escapeFormula(l.id),
      escapeFormula(l.createdAt),
      escapeFormula(l.type),
      escapeFormula(l.status),
      escapeFormula(l.name),
      escapeFormula(l.contact),
      escapeFormula(l.service),
      escapeFormula(l.schedule),
      escapeFormula(l.budgetOrPreference),
      l.dealValue,
      l.amountPaid,
      l.pendingBalance,
      escapeFormula(l.paymentStatus),
      escapeFormula(l.notes),
      escapeFormula(l.internalNotes)
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", id: l.id })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

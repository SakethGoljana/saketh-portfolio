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
 * 3. Go to Project Settings (gear icon) > Script Properties > Add script property:
 *    Property: SCRIPT_SECRET | Value: (same value as GOOGLE_SHEETS_SECRET in .env.local)
 * 4. Click "Save" (Ctrl+S / Cmd+S)
 * 5. Click "Deploy" > "New deployment" (or "Manage deployments" -> Edit -> "New version")
 * 6. Set type: "Web app", "Execute as": "Me", "Who has access": "Anyone"
 * 7. Click "Deploy" and copy the Web App URL into .env.local as GOOGLE_SHEET_WEBHOOK_URL
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

    // SECURITY CHECK: Strictly require authentication secret match
    if (!SCRIPT_SECRET || payload.authSecret !== SCRIPT_SECRET) {
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

    // BULK SYNC ALL LEADS (Atomic Batch Operation)
    if (payload.action === "sync_all") {
      var isEmpty = !Array.isArray(payload.leads) || payload.leads.length === 0;
      if (isEmpty && !payload.allowEmpty) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: "Empty or invalid leads array. Sync aborted to protect existing sheet data. Pass allowEmpty: true to confirm clearing." })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.clearContents();
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#121218");
      headerRange.setFontColor("#D2FF3F");
      sheet.setFrozenRows(1);

      if (Array.isArray(payload.leads) && payload.leads.length > 0) {
        var rows = payload.leads.map(function (l) {
          return [
            escapeFormula(l.id),
            escapeFormula(l.createdAt),
            escapeFormula(l.type),
            escapeFormula(l.status),
            escapeFormula(l.name),
            escapeFormula(l.contact),
            escapeFormula(l.service),
            escapeFormula(l.schedule),
            escapeFormula(l.budgetOrPreference),
            Number(l.dealValue) || 0,
            Number(l.amountPaid) || 0,
            Number(l.pendingBalance) || 0,
            escapeFormula(l.paymentStatus),
            escapeFormula(l.notes),
            escapeFormula(l.internalNotes)
          ];
        });
        sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
      }

      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", count: payload.leads ? payload.leads.length : 0 })
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

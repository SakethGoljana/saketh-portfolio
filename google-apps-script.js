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
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
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
      "Currency",
      "Deal Value",
      "Amount Paid",
      "Pending Balance",
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

    // DELETE SINGLE LEAD (Selective row removal)
    if (payload.action === "delete_lead") {
      if (!payload.id || typeof payload.id !== "string") {
        return ContentService.createTextOutput(
          JSON.stringify({ status: "error", error: "Missing lead id for delete_lead action" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
      var allData = sheet.getDataRange().getValues();
      var deleted = false;
      for (var d = allData.length - 1; d >= 1; d--) {
        if (allData[d][0] === payload.id) {
          sheet.deleteRow(d + 1);
          deleted = true;
        }
      }
      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", deleted: deleted, id: payload.id })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // BULK SYNC ALL LEADS (Safe Upsert by ID - Never wipes existing rows)
    if (payload.action === "sync_all") {
      if (!Array.isArray(payload.leads) || payload.leads.length === 0) {
        return ContentService.createTextOutput(
          JSON.stringify({ status: "success", count: 0, message: "No leads to sync. Existing sheet data preserved." })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      var data = sheet.getDataRange().getValues();
      var idToRowMap = {};
      for (var r = 1; r < data.length; r++) {
        var existingId = String(data[r][0] || "").trim();
        if (existingId) {
          idToRowMap[existingId] = r + 1; // 1-indexed row number
        }
      }

      var rowsToAppend = [];
      var updatedCount = 0;
      var appendedCount = 0;

      for (var k = 0; k < payload.leads.length; k++) {
        var l = payload.leads[k];
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
          escapeFormula(l.currency || "USD"),
          Number(l.dealValue) || 0,
          Number(l.amountPaid) || 0,
          Number(l.pendingBalance) || 0,
          escapeFormula(l.paymentStatus),
          escapeFormula(l.notes),
          escapeFormula(l.internalNotes)
        ];

        var leadIdStr = String(l.id || "").trim();
        if (idToRowMap[leadIdStr]) {
          sheet.getRange(idToRowMap[leadIdStr], 1, 1, HEADERS.length).setValues([rowValues]);
          updatedCount++;
        } else {
          rowsToAppend.push(rowValues);
          appendedCount++;
        }
      }

      if (rowsToAppend.length > 0) {
        var startRow = sheet.getLastRow() + 1;
        sheet.getRange(startRow, 1, rowsToAppend.length, HEADERS.length).setValues(rowsToAppend);
      }

      return ContentService.createTextOutput(
        JSON.stringify({ status: "success", count: payload.leads.length, updated: updatedCount, appended: appendedCount })
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
      escapeFormula(l.currency || "USD"),
      Number(l.dealValue) || 0,
      Number(l.amountPaid) || 0,
      Number(l.pendingBalance) || 0,
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
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

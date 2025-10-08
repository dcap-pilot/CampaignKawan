# 📊 How to View Google Apps Script Execution Logs

## Method 1: Using the Executions Page (Recommended)

### Step-by-Step:

1. **Go to Google Apps Script**
   - Visit: https://script.google.com/
   - Click on your project: `Campaign Kawan - Form Handler`

2. **Open Executions Page**
   - Look at the left sidebar
   - Click on the **"Executions"** icon (📋 icon)
   - Or click **"View" > "Executions"** from the top menu

3. **View Recent Executions**
   - You'll see a list of all recent script runs
   - Each row shows:
     - ✅ **Status**: Success (green checkmark) or Failed (red X)
     - 📅 **Date/Time**: When the script ran
     - ⏱️ **Duration**: How long it took
     - 👤 **Executed as**: Your email
     - 🔧 **Function**: Which function ran (doPost, doGet, etc.)

4. **View Detailed Logs**
   - Click on any execution row
   - You'll see detailed logs including:
     - All `Logger.log()` messages
     - Error messages (if any)
     - Execution timeline
     - Function calls

### What to Look For:

**✅ Successful Submission:**
```
=== POST REQUEST RECEIVED ===
Content Type: application/json
Parsed data successfully
Data keys: referralCode, motorcycleModel, fullName, ...
=== PROCESSING FORM DATA ===
Generated Application ID: APP-1234567890-ABCDEF
Saving to Google Sheets...
Opening spreadsheet: 1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4
Sheet name: Sheet1
Current row count: 5
Headers already exist
Appending row with 19 columns
Application ID: APP-1234567890-ABCDEF
Full Name: John Doe
NRIC: 123456-78-9012
✓ Row added at position: 6
✓ Successfully saved to sheets
Processing 3 file(s)...
Opening Drive folder: 1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN
Parent folder name: Campaign Kawan - Applications
Creating subfolder: APP-1234567890-ABCDEF
✓ Subfolder created
Processing file 1: nric_front.jpg
File type: image/jpeg
File size: 123456 bytes
✓ File blob created
✓ File uploaded to Drive
✓ File upload completed. Total uploaded: 3
=== FORM PROCESSING COMPLETED ===
```

**❌ Failed Submission (Example):**
```
=== POST REQUEST RECEIVED ===
ERROR in doPost: Cannot read property 'contents' of undefined
Error stack: ...
```

---

## Method 2: Using Logger (For Testing)

### When Running Test Functions:

1. Click on the function dropdown (shows "Select function")
2. Select `testSubmission` or `testFileUpload`
3. Click **Run** (▶️)
4. Click **"View" > "Logs"** or press `Ctrl+Enter`
5. You'll see all `Logger.log()` messages in a popup

---

## Method 3: Real-Time Logging (Advanced)

### Using Cloud Logging (if enabled):

1. In Google Apps Script, click **"View" > "Cloud logs"**
2. You'll be redirected to Google Cloud Console
3. Filter logs by:
   - **Time range**
   - **Severity**: Info, Warning, Error
   - **Text search**

**Note:** Cloud logging might need to be enabled first. If you see "Cloud logs disabled", stick with Method 1 (Executions page).

---

## Common Log Messages Explained

### Form Submission:
- `=== POST REQUEST RECEIVED ===` - Form data received successfully
- `Parsed data successfully` - JSON data was valid
- `Data keys: ...` - Shows which form fields were received

### Google Sheets:
- `Opening spreadsheet: ...` - Connecting to your Google Sheet
- `Sheet name: Sheet1` - Which sheet is being used
- `Creating headers...` - First-time setup (creates column headers)
- `Headers already exist` - Sheet was already set up
- `Appending row with X columns` - Adding new data row
- `✓ Row added at position: X` - Success! Row number X was added

### Google Drive:
- `Opening Drive folder: ...` - Connecting to your Drive folder
- `Parent folder name: ...` - Confirms correct folder
- `Creating subfolder: APP-...` - Creating folder for this application
- `Processing file X: filename.jpg` - Uploading file X
- `✓ File uploaded to Drive` - File successfully uploaded
- `Drive file ID: ...` - Unique ID for the uploaded file

### Errors:
- `ERROR in doPost: ...` - Problem receiving form data
- `ERROR in saveToSheets: ...` - Problem saving to Google Sheet
- `ERROR creating folder: ...` - Problem creating Drive folder
- `ERROR uploading file: ...` - Problem uploading a specific file

---

## Troubleshooting Using Logs

### Issue: "No data parameter provided"
**Log Message:** `No data parameter found`
**Solution:** The form is not sending data correctly. Check `script.js` line 700 for correct URL.

### Issue: "Cannot read property 'contents' of undefined"
**Log Message:** `ERROR in doPost: Cannot read property 'contents' of undefined`
**Solution:** The request format is wrong. Make sure you're using POST method with JSON body.

### Issue: "Exception: Invalid argument: id"
**Log Message:** `ERROR in saveToSheets: Exception: Invalid argument: id`
**Solution:** Check SHEET_ID in the Google Apps Script. Make sure it matches your Google Sheet ID.

### Issue: "Exception: File not found"
**Log Message:** `ERROR creating folder: Exception: File not found`
**Solution:** Check DRIVE_FOLDER_ID. Make sure the folder exists and is in "My Drive" (not Shared Drives).

### Issue: "Illegal characters in base64"
**Log Message:** `ERROR uploading file: Illegal characters in base64`
**Solution:** File encoding issue. The file might be corrupted or too large.

---

## How to Download Logs

### For Record Keeping:

1. Go to **Executions** page
2. Click on an execution
3. Click the **"Download"** button (if available)
4. Or copy the log text manually

### Export Multiple Executions:

1. Use Google Cloud Logging (Method 3)
2. Click **"Download logs"**
3. Choose format: JSON, CSV, etc.

---

## Setting Up Email Notifications (Optional)

Want to get emailed when something fails?

Add this to your `google-apps-script.js`:

```javascript
function sendErrorEmail(error) {
  const email = 'your-email@example.com';
  const subject = 'Campaign Kawan - Form Submission Error';
  const body = `
    An error occurred while processing a form submission:
    
    Error: ${error.toString()}
    
    Time: ${new Date().toLocaleString()}
    
    Please check the execution logs for more details.
  `;
  
  MailApp.sendEmail(email, subject, body);
}

// Then in your catch blocks:
catch (error) {
  Logger.log('ERROR: ' + error.toString());
  sendErrorEmail(error);
  throw error;
}
```

---

## Best Practices

1. **Check logs after each deployment** - Make sure everything works
2. **Monitor logs regularly** - Catch issues early
3. **Keep logs for records** - Helps with troubleshooting
4. **Set up error notifications** - Get alerted immediately
5. **Clear old executions** - Keep the list manageable (Google keeps them for 30 days)

---

## Quick Reference: Where Everything Is

- **Google Apps Script Dashboard**: https://script.google.com/
- **Your Project**: Click "Campaign Kawan - Form Handler"
- **Executions Page**: Left sidebar > 📋 Executions icon
- **Google Sheet**: https://docs.google.com/spreadsheets/d/1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4/
- **Google Drive Folder**: https://drive.google.com/drive/folders/1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN

---

**Last Updated:** October 8, 2025
**Version:** 1.0


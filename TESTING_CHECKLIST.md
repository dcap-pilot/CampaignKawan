# ✅ Testing Checklist - Campaign Kawan Form

Use this checklist to test your form before going live.

---

## 📝 Pre-Deployment Testing

### Google Apps Script Setup
- [ ] Script copied to Google Apps Script editor
- [ ] SHEET_ID and DRIVE_FOLDER_ID are correct
- [ ] Script saved successfully
- [ ] Permissions authorized (clicked "Allow")
- [ ] `testSubmission()` function runs successfully
- [ ] Test data appears in Google Sheet
- [ ] Script deployed as Web App
- [ ] Deployment set to "Who has access: Anyone"
- [ ] Web App URL copied
- [ ] Web App URL pasted in `script.js` line 700

---

## 🖥️ Browser Testing

### Desktop Testing (Chrome/Edge/Firefox)
- [ ] Form loads without errors (check F12 Console)
- [ ] All images and icons display correctly
- [ ] Step 0: Landing page displays correctly
- [ ] Step 1: Motorcycle info form works
- [ ] Step 2: Applicant info form works
- [ ] Step 3: NRIC upload works
- [ ] Step 4: Employment selection shows document requirements
- [ ] Step 5: Confirmation page shows all data correctly
- [ ] Step 6: CCRIS consent checkbox works
- [ ] Navigation buttons work (Seterusnya, Sebelumnya)
- [ ] Progress bar updates correctly (e.g., 1/7, 2/7, etc.)
- [ ] Form scrolls to top when navigating between steps

### Mobile Testing (Phone/Tablet)
- [ ] Form is responsive on mobile
- [ ] All text is readable
- [ ] Buttons are easy to tap
- [ ] File upload works on mobile
- [ ] Navigation works smoothly
- [ ] No horizontal scrolling
- [ ] Form fits screen width

---

## 📋 Form Validation Testing

### Required Fields
- [ ] Kod Rujukan - required, converts to uppercase
- [ ] Model Motosikal - required
- [ ] Nama Penuh - required
- [ ] NRIC - required, auto-formats
- [ ] Telefon - required, auto-formats with +6
- [ ] Email - required, validates email format
- [ ] Alamat - required (both lines)
- [ ] Poskod - required
- [ ] Bandar - required
- [ ] Negeri - required (dropdown)
- [ ] Pendapatan Bulanan - required
- [ ] Jenis Pekerjaan - required (card selection)
- [ ] NRIC Depan - required file upload
- [ ] NRIC Belakang - required file upload
- [ ] Dokumen Pendapatan - required (at least 1 file)
- [ ] CCRIS Consent - required checkbox

### Error Messages
- [ ] Shows error when required field is empty
- [ ] Error message displays at top center
- [ ] Error message auto-dismisses after 3 seconds
- [ ] Cannot proceed to next step without filling required fields
- [ ] Cannot submit without checking CCRIS consent

---

## 📂 File Upload Testing

### NRIC Files
- [ ] Can upload JPG image for NRIC front
- [ ] Can upload PNG image for NRIC front
- [ ] Can upload JPG image for NRIC back
- [ ] Can upload PNG image for NRIC back
- [ ] File name displays after upload
- [ ] Can change uploaded file

### Income Documents
- [ ] Can upload multiple PDF files
- [ ] Can upload multiple image files
- [ ] Can upload at least 3 files
- [ ] File names display after upload
- [ ] Can remove uploaded files
- [ ] File count shows correctly on confirmation page

---

## 🎨 UI/UX Testing

### Referral Code Input
- [ ] Has special styling (glassmorphism effect)
- [ ] Automatically converts to uppercase
- [ ] Description text displays below
- [ ] Has icon indicator

### Employment Type Selection
- [ ] Three cards display: Pekerja Bergaji, Bekerja Sendiri, Pekerja GIG
- [ ] Cards are clickable
- [ ] Selected card shows visual feedback
- [ ] Document requirements appear after selection
- [ ] Document requirements match selected employment type

### Document Requirements Display
- [ ] Pekerja Bergaji shows: "Slip gaji terkini 1 bulan"
- [ ] Bekerja Sendiri shows: "Salinan Pendaftaran Perniagaan (SSM)" and "Penyata Bank Perniagaan Terkini 3 bulan"
- [ ] Pekerja GIG shows examples in subtitle
- [ ] All checkmarks align vertically with text
- [ ] No animations on cards (clean, static display)

### Confirmation Page
- [ ] All entered data displays correctly
- [ ] Phone number shows +6 prefix (not +6+6)
- [ ] Address includes city and state
- [ ] File count is accurate
- [ ] Employment type displays correctly
- [ ] All sections have proper headings with icons

### Success Page
- [ ] Green success icon displays
- [ ] Application ID displays (not "undefined")
- [ ] Full name displays correctly
- [ ] NRIC displays correctly
- [ ] Motorcycle model displays correctly
- [ ] Referral code displays correctly
- [ ] Employment type displays correctly
- [ ] Submission date displays correctly
- [ ] "Cetak Halaman" button works (prints page)
- [ ] No "Tutup" button (removed as requested)

---

## 🔗 Data Integration Testing

### Google Sheets Integration
- [ ] Open Google Sheet after submission
- [ ] New row appears with submitted data
- [ ] Application ID is unique and formatted correctly
- [ ] Submission date is correct
- [ ] All form fields are populated correctly:
  - [ ] Referral Code
  - [ ] Motorcycle Model
  - [ ] Full Name
  - [ ] NRIC
  - [ ] Phone (with +6 prefix)
  - [ ] Email
  - [ ] Address Line 1
  - [ ] Address Line 2
  - [ ] Postcode
  - [ ] City
  - [ ] State
  - [ ] Monthly Income
  - [ ] Employment Type
  - [ ] NRIC Front Uploaded (Yes/No)
  - [ ] NRIC Back Uploaded (Yes/No)
  - [ ] Income Documents Count (number)
  - [ ] Total Files Uploaded (number)

### Google Drive Integration
- [ ] Open Google Drive folder after submission
- [ ] New subfolder created with Application ID as name
- [ ] NRIC front file is in the subfolder
- [ ] NRIC back file is in the subfolder
- [ ] All income document files are in the subfolder
- [ ] Files can be opened and viewed correctly
- [ ] File names are preserved

---

## 🐛 Error Handling Testing

### Network Issues
- [ ] Test with slow internet connection
- [ ] Loading overlay appears during submission
- [ ] Error message shows if submission fails
- [ ] Can retry submission after error

### Browser Console
- [ ] No errors in console during normal use
- [ ] Submission logs show in console:
  - [ ] "=== SUBMITTING TO GOOGLE SHEETS ==="
  - [ ] "Attempting POST request..."
  - [ ] "Response status: 200"
  - [ ] "✓ Successfully submitted to Google Sheets!"
  - [ ] "Application ID: APP-..."

### Google Apps Script Logs
- [ ] Open Executions page in Google Apps Script
- [ ] Recent execution shows as ✅ Success
- [ ] Click on execution to view logs
- [ ] Logs show:
  - [ ] "=== POST REQUEST RECEIVED ==="
  - [ ] "Parsed data successfully"
  - [ ] "✓ Successfully saved to sheets"
  - [ ] "✓ File upload completed"
  - [ ] "=== FORM PROCESSING COMPLETED ==="

---

## 🎯 User Flow Testing

### Complete Form Submission (End-to-End)
1. [ ] Open form in browser
2. [ ] Enter referral code (e.g., KAWAN123)
3. [ ] Click "Mulakan Permohonan Anda"
4. [ ] Fill motorcycle model
5. [ ] Click "Seterusnya"
6. [ ] Fill all personal information
7. [ ] Select state from dropdown
8. [ ] Enter monthly income
9. [ ] Click "Seterusnya"
10. [ ] Upload NRIC front image
11. [ ] Upload NRIC back image
12. [ ] Click "Seterusnya"
13. [ ] Select employment type card
14. [ ] See document requirements appear
15. [ ] Upload income documents (3 files)
16. [ ] Click "Seterusnya"
17. [ ] Review all information on confirmation page
18. [ ] Click "Seterusnya"
19. [ ] Check CCRIS consent checkbox
20. [ ] Click "Hantar Permohonan"
21. [ ] See loading overlay
22. [ ] Redirect to success page
23. [ ] See application details on success page
24. [ ] Print page or take screenshot
25. [ ] Check Google Sheet for new row
26. [ ] Check Google Drive for new folder with files

---

## ⚠️ Known Issues to Check

### Common Problems
- [ ] CORS error in console - redeploy script with "Anyone" access
- [ ] "undefined" on success page - check Application ID in response
- [ ] Files not uploading - check file size (< 5MB recommended)
- [ ] Data not in sheet - check SHEET_ID in script
- [ ] Loading screen stuck - check browser console for errors

---

## 📱 Cross-Browser Testing

### Desktop Browsers
- [ ] Google Chrome (latest version)
- [ ] Microsoft Edge (latest version)
- [ ] Mozilla Firefox (latest version)
- [ ] Safari (if on Mac)

### Mobile Browsers
- [ ] Chrome on Android
- [ ] Safari on iOS
- [ ] Samsung Internet (if available)

---

## 🚀 Final Pre-Launch Checklist

- [ ] All tests above passed
- [ ] Form works on multiple browsers
- [ ] Form works on mobile devices
- [ ] Data saves to Google Sheet correctly
- [ ] Files upload to Google Drive correctly
- [ ] Success page displays correctly
- [ ] No console errors
- [ ] Google Apps Script logs show success
- [ ] Tested with at least 3 complete submissions
- [ ] All stakeholders have tested and approved
- [ ] Backup of Google Sheet created
- [ ] Documentation reviewed (DEPLOYMENT_INSTRUCTIONS.md)

---

## 📊 After Launch Monitoring

### First Week
- [ ] Check Google Sheet daily for new submissions
- [ ] Monitor Google Apps Script executions for errors
- [ ] Check Google Drive for uploaded files
- [ ] Collect user feedback
- [ ] Monitor for any bug reports

### Ongoing
- [ ] Weekly review of submissions
- [ ] Monthly backup of Google Sheet
- [ ] Regular cleanup of old test data
- [ ] Update form fields if needed
- [ ] Monitor Google Apps Script quota usage

---

## 🎉 Congratulations!

If all checkboxes are ticked, your form is ready to go live! 🚀

**Need help?** Check:
- DEPLOYMENT_INSTRUCTIONS.md for setup guide
- HOW_TO_VIEW_LOGS.md for troubleshooting
- Browser console (F12) for real-time errors
- Google Apps Script Executions page for backend logs

---

**Last Updated:** October 8, 2025
**Version:** 1.0


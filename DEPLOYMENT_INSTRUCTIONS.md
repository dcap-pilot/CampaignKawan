# 🚀 Complete Deployment Guide for Campaign Kawan

## ⚠️ IMPORTANT: Follow Every Step Carefully

This guide will help you deploy your motorcycle loan application form and connect it to Google Sheets and Google Drive.

---

## 📋 Part 1: Deploy Google Apps Script

### Step 1: Open Google Apps Script

1. Go to https://script.google.com/
2. Click **"New Project"**
3. Name your project: `Campaign Kawan - Form Handler`

### Step 2: Copy the Script Code

1. **Delete** all existing code in the editor
2. Open the file `google-apps-script.js` from your project folder
3. **Copy ALL the code** from that file
4. **Paste** it into the Google Apps Script editor
5. Click the **Save** icon (💾) or press `Ctrl+S` (Windows) or `Cmd+S` (Mac)

### Step 3: Verify Your Configuration

At the top of the script, you should see:

```javascript
const SHEET_ID = '1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4';
const DRIVE_FOLDER_ID = '1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN';
```

✅ These IDs are already configured for your Google Sheet and Drive folder.

### Step 4: Test the Script (Optional but Recommended)

1. In the Google Apps Script editor, find the function dropdown (usually shows "Select function")
2. Select `testSubmission` from the dropdown
3. Click the **Run** button (▶️)
4. **First time only**: You'll see an authorization dialog:
   - Click **"Review Permissions"**
   - Select your Google account
   - Click **"Advanced"** (if you see a warning)
   - Click **"Go to Campaign Kawan - Form Handler (unsafe)"**
   - Click **"Allow"**
5. Wait for the script to run
6. Check your Google Sheet - you should see a new row with test data
7. Check your Drive folder - you should see a new folder created

### Step 5: Deploy as Web App

1. Click **"Deploy"** button in the top right corner
2. Select **"New deployment"**
3. Click the ⚙️ gear icon next to "Select type"
4. Select **"Web app"**
5. Fill in the deployment settings:
   - **Description**: `Production - Campaign Kawan Form`
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** ⚠️ **VERY IMPORTANT!**
6. Click **"Deploy"**
7. You might need to authorize again - follow the same steps as Step 4
8. Copy the **Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec
   ```
9. **SAVE THIS URL!** You'll need it in the next step

---

## 📝 Part 2: Update Your Website Code

### Step 6: Update script.js

1. Open the file `script.js` in your project folder
2. Find **line 700** (or search for `scriptUrl`)
3. **Replace** the existing URL with your new Web App URL from Step 5
4. It should look like this:

```javascript
const scriptUrl = 'https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec';
```

5. **Save** the file

---

## 🧪 Part 3: Test the Complete Flow

### Step 7: Test on Your Local Computer

1. Open `index.html` in your web browser
2. Fill out the entire form:
   - **Referral Code**: TEST123
   - **Motorcycle Model**: Honda Wave 125i
   - **Full Name**: Your Name
   - **NRIC**: 123456-78-9012
   - **Phone**: 0123456789
   - **Email**: test@example.com
   - **Address**: Fill in all fields
   - **City**: Kuala Lumpur
   - **State**: Selangor
   - **Monthly Income**: 5000
   - **Employment Type**: Select any option
   - **Upload Files**: Upload test images for NRIC and income documents
3. Complete all steps and click **"Hantar Permohonan"**
4. You should see a loading screen, then be redirected to the success page

### Step 8: Check Console for Errors

1. While on the form page, press `F12` to open Developer Tools
2. Click the **"Console"** tab
3. Look for any **red error messages**
4. When you submit the form, you should see:
   ```
   === SUBMITTING TO GOOGLE SHEETS ===
   Attempting POST request...
   Response status: 200
   Response ok: true
   ✓ Successfully submitted to Google Sheets!
   Application ID: APP-1234567890-ABCDEF
   ```

### Step 9: Verify Data in Google Sheets

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4/
2. Check if there's a new row with your test data
3. Verify all fields are filled correctly:
   - Application ID
   - Submission Date
   - Referral Code
   - Motorcycle Model
   - Full Name
   - NRIC
   - Phone
   - Email
   - Address
   - City
   - State
   - Monthly Income
   - Employment Type
   - File upload status

### Step 10: Verify Files in Google Drive

1. Open your Google Drive folder: https://drive.google.com/drive/folders/1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN
2. Look for a new folder named with the Application ID (e.g., `APP-1234567890-ABCDEF`)
3. Open that folder
4. Verify all uploaded files are there:
   - NRIC Front
   - NRIC Back
   - Income Documents (all files you uploaded)

### Step 11: Check Google Apps Script Logs

If something isn't working:

1. Go back to https://script.google.com/
2. Open your project
3. Click **"Executions"** in the left sidebar (📋 icon)
4. Look at the recent executions
5. Click on any execution to see detailed logs
6. Look for error messages marked in red

---

## 🔧 Troubleshooting

### Problem: CORS Error in Console

**Solution:**
1. Make sure you deployed the script with **"Who has access: Anyone"**
2. Redeploy the script:
   - Go to Google Apps Script
   - Click "Deploy" > "Manage deployments"
   - Click ✏️ Edit
   - Change version to "New version"
   - Make sure "Who has access" is **"Anyone"**
   - Click "Deploy"
   - Update the URL in `script.js` line 700

### Problem: Data Not Appearing in Google Sheets

**Solution:**
1. Check if the script has permission to edit the sheet
2. Run the `testSubmission` function again
3. Check the Execution logs for errors
4. Verify the SHEET_ID in the script matches your Google Sheet ID

### Problem: Files Not Uploading to Google Drive

**Solution:**
1. Check if the script has permission to access Google Drive
2. Verify the DRIVE_FOLDER_ID in the script
3. Make sure the folder is not in Shared Drives (must be in "My Drive")
4. Check the file size - very large files might fail

### Problem: "undefined" on Success Page

**Solution:**
1. Open browser console (F12) on the success page
2. Check if URL parameters are being passed correctly
3. Verify `script.js` line 974-988 (redirectToSuccessPage function)
4. Make sure the Google Apps Script is returning `applicationId` correctly

### Problem: Loading Screen Stuck Forever

**Solution:**
1. Check browser console for errors
2. Verify the Google Apps Script URL is correct
3. Check if the script is deployed as Web App
4. Make sure your internet connection is stable

---

## 📱 Part 4: Deploy Your Website

### Option A: Using GitHub Pages (Free)

1. Create a GitHub account (if you don't have one)
2. Create a new repository
3. Upload all your files:
   - index.html
   - success.html
   - script.js
   - styles.css
   - images
4. Go to repository Settings > Pages
5. Select "Deploy from branch"
6. Select "main" branch
7. Click "Save"
8. Your site will be live at: `https://yourusername.github.io/repositoryname/`

### Option B: Using Netlify (Free)

1. Go to https://www.netlify.com/
2. Sign up for a free account
3. Drag and drop your project folder
4. Your site will be live instantly!

### Option C: Using Your Own Hosting

1. Upload all files via FTP to your web hosting
2. Make sure all file paths are correct
3. Test the form on your live site

---

## ✅ Final Checklist

Before going live:

- [ ] Google Apps Script is deployed as Web App with "Anyone" access
- [ ] Script URL in `script.js` line 700 is updated with your deployment URL
- [ ] Test submission works and data appears in Google Sheets
- [ ] Test file uploads work and files appear in Google Drive
- [ ] Success page displays correct information
- [ ] Form validation works correctly
- [ ] All required fields are marked with asterisk
- [ ] Mobile responsiveness looks good
- [ ] Desktop responsiveness looks good
- [ ] Referral code input converts to uppercase
- [ ] Phone number formatting works (adds +6 prefix)
- [ ] NRIC formatting works
- [ ] Employment type selection shows document requirements
- [ ] All icons display correctly
- [ ] Print functionality works on success page

---

## 🎉 You're Done!

Your motorcycle loan application form is now live and connected to Google Sheets and Google Drive!

---

## 📞 Need Help?

If you encounter any issues:

1. Check the browser console for errors (F12)
2. Check Google Apps Script Execution logs
3. Verify all IDs and URLs are correct
4. Make sure all permissions are granted
5. Test with a simple form submission first

---

## 🔒 Security Notes

- The form is public and anyone can submit
- Data is stored in your Google Sheet (private to you)
- Files are stored in your Google Drive (private to you)
- Make sure to regularly backup your Google Sheet
- Consider setting up email notifications for new submissions (can be added to the script)

---

**Last Updated:** October 8, 2025
**Version:** 1.0


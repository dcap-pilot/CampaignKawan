# 🚨 CORS FIX - Quick Deployment Instructions

## ❌ Problem Identified

Your form is failing with a **CORS (Cross-Origin Resource Sharing) error**:

```
Access to fetch at 'https://script.google.com/macros/s/...' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solution Applied

I've updated your code to use **GET requests instead of POST** to avoid CORS preflight issues. Here's what changed:

### 1. Frontend (`script.js`)
- ✅ **Changed from POST to GET request** (CORS-safe)
- ✅ **Added fallback to POST with no-cors** if GET fails
- ✅ **Better error handling and logging**

### 2. Backend (`google-apps-script.js`)
- ✅ **Enhanced GET request handling**
- ✅ **Better logging for debugging**
- ✅ **Added doOptions function for CORS preflight**

---

## 🚀 IMMEDIATE ACTION REQUIRED

### Step 1: Update Your Google Apps Script

1. **Go to**: https://script.google.com/
2. **Open** your project: `Campaign Kawan - Form Handler`
3. **Delete ALL existing code** in the editor
4. **Copy ALL code** from your updated `google-apps-script.js` file
5. **Paste** it into the Google Apps Script editor
6. **Save** (Ctrl+S or Cmd+S)

### Step 2: Redeploy the Script

1. **Click** "Deploy" button (top right)
2. **Select** "Manage deployments"
3. **Click** the ✏️ edit icon next to your deployment
4. **Change** "Version" to "New version"
5. **Make sure** "Who has access" is set to **"Anyone"**
6. **Click** "Deploy"
7. **Copy** the new Web App URL (it should be the same)

### Step 3: Update Your Website

1. **Open** `script.js` in your project
2. **Go to line 700**
3. **Make sure** the URL matches your Google Apps Script deployment
4. **Save** the file

### Step 4: Test Immediately

1. **Open** `index.html` in your browser
2. **Fill out** the form with test data
3. **Click** "Hantar Permohonan"
4. **Check browser console** (F12) - should see:
   ```
   === SUBMITTING TO GOOGLE SHEETS ===
   Attempting GET request (CORS-safe)...
   Response status: 200
   ✓ Successfully submitted to Google Sheets!
   ```

---

## 🔍 What to Expect

### ✅ Success Console Output:
```
=== SUBMITTING TO GOOGLE SHEETS ===
Attempting GET request (CORS-safe)...
GET URL length: 2847
Data length: 2834
Response status: 200
Response ok: true
Response data: {success: true, applicationId: "APP-...", message: "Application submitted successfully"}
✓ Successfully submitted to Google Sheets!
Application ID: APP-1234567890-ABCDEF
```

### ✅ Google Apps Script Logs:
```
=== GET REQUEST RECEIVED ===
Number of parameters: 1
Decoded data string length: 2834
Data preview (first 200 chars): {"referralCode":"SADH3","motorcycleModel":"Yamaha Y15ZR"...
Parsed data keys: referralCode, motorcycleModel, fullName, nric, phone, email, address1, address2, postcode, city, state, monthlyIncome, employmentType, files
Full Name: Ali Bin Abu
NRIC: 132321-32-1321
Files count: 3
=== PROCESSING FORM DATA ===
Generated Application ID: APP-1234567890-ABCDEF
✓ Successfully saved to sheets
✓ File upload completed. Total uploaded: 3
=== FORM PROCESSING COMPLETED ===
```

---

## 🛠️ If It Still Doesn't Work

### Check These:

1. **Google Apps Script Deployment**
   - Go to https://script.google.com/
   - Click "Deploy" > "Manage deployments"
   - Verify "Who has access" is **"Anyone"**
   - If not, edit and redeploy

2. **Browser Console**
   - Press F12
   - Look for any red errors
   - Should see "GET request (CORS-safe)" message

3. **Google Apps Script Logs**
   - Go to https://script.google.com/
   - Click "Executions" in left sidebar
   - Look for recent executions
   - Click on them to see detailed logs

4. **File Size**
   - If files are very large (>5MB), they might cause issues
   - Try with smaller test files first

---

## 📞 Quick Test

Try this simple test:

1. **Fill minimal data**:
   - Referral Code: TEST123
   - Motorcycle: Honda Wave
   - Name: Test User
   - NRIC: 123456-78-9012
   - Phone: 0123456789
   - Email: test@test.com
   - Address: Test Address
   - City: KL
   - State: Selangor
   - Income: 5000
   - Employment: Pekerja Bergaji
   - Upload small test files
   - Submit

2. **Check results**:
   - Console shows success
   - Google Sheet has new row
   - Google Drive has new folder

---

## 🎯 Expected Results

After the fix:

✅ **No CORS errors** in browser console  
✅ **Form submits successfully**  
✅ **Data appears in Google Sheet**  
✅ **Files upload to Google Drive**  
✅ **Success page shows Application ID**  
✅ **No more "Ralat semasa menghantar permohonan" error**  

---

## ⚡ Why This Works

**The Problem:** POST requests trigger CORS preflight checks, which Google Apps Script doesn't handle well.

**The Solution:** GET requests don't trigger preflight checks, so they work without CORS headers.

**The Fallback:** If GET fails for any reason, it tries POST with `mode: 'no-cors'` which bypasses CORS entirely (but you can't read the response).

---

**🚀 Deploy the updated code now and test immediately!**

---

**Last Updated:** October 8, 2025  
**Status:** CORS Fix Applied ✅

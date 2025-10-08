# Google Sheets & Drive Integration Setup Guide

## Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Update the configuration constants at the top:

```javascript
const SHEET_ID = '1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4';
const DRIVE_FOLDER_ID = '1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN';
```

## Step 2: Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Choose type: "Web app"
3. Set the following:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 3: Update Your Website

1. Open `script.js`
2. Find line 689: `const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';`
3. Replace `YOUR_SCRIPT_ID` with your actual script ID from the Web App URL

## Step 4: Set Up Google Sheets

Your Google Sheet will automatically get these columns:
- Application ID
- Submission Date
- Referral Code
- Motorcycle Model
- Full Name
- NRIC
- Phone
- Email
- Address Line 1
- Address Line 2
- Postcode
- City
- State
- Monthly Income
- Employment Type
- NRIC Front Uploaded
- NRIC Back Uploaded
- Income Documents Count
- File Upload Status

## Step 5: Set Up Google Drive

1. Make sure you have access to the folder: https://drive.google.com/drive/folders/1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN
2. The script will create a new folder for each application using the Application ID as the folder name
3. All uploaded files will be stored in their respective application folders

## Step 6: Test the Integration

1. Fill out the form completely
2. Upload some test files
3. Submit the form
4. Check your Google Sheet for new data
5. Check your Google Drive folder for uploaded files

## Troubleshooting

### Common Issues:

1. **Permission Errors**: Make sure the Google Apps Script has access to both Sheets and Drive
2. **CORS Errors**: Ensure the Web App is deployed with "Anyone" access
3. **File Upload Issues**: Check that files are not too large (Google Apps Script has limits)

### File Size Limits:
- Individual file: 50MB max
- Total request size: 100MB max
- Google Apps Script execution time: 6 minutes max

### Testing:
Use the `testSubmission()` function in Google Apps Script to test the integration without using the web form.

## Security Notes

- The Web App URL will be public, so make sure your script only accepts POST requests
- Consider adding authentication if needed
- The script automatically creates folders, so ensure proper permissions

## Support

If you encounter issues:
1. Check the Google Apps Script execution logs
2. Verify all IDs are correct
3. Ensure proper permissions are set
4. Test with smaller files first
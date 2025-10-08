// Google Apps Script Code for Sheets and Drive Integration
// Deploy this as a Web App with execute permissions for "Anyone"

// Configuration
const SHEET_ID = '1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4';
const DRIVE_FOLDER_ID = '1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN';

// Main function to handle form submission (POST)
function doPost(e) {
  try {
    Logger.log('=== POST REQUEST RECEIVED ===');
    Logger.log('Content Type: ' + e.postData.type);
    Logger.log('Content Length: ' + e.postData.length);
    
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data successfully');
    Logger.log('Data keys: ' + Object.keys(data).join(', '));
    
    const result = processFormData(data);
    Logger.log('Processing completed successfully');
    
    return result;
    
  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    return createJsonResponse({
      success: false,
      error: error.toString(),
      message: 'Failed to process POST request'
    });
  }
}

// Handle GET requests (for CORS workaround)
function doGet(e) {
  try {
    Logger.log('=== GET REQUEST RECEIVED ===');
    Logger.log('Number of parameters: ' + Object.keys(e.parameter || {}).length);
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    // Check if this is a lookup request
    if (e.parameter && e.parameter.check) {
      Logger.log('=== LOOKUP REQUEST ===');
      const nric = e.parameter.check;
      Logger.log('Looking up Application ID for NRIC: ' + nric);
      
      const applicationId = findApplicationIdByNric(nric);
      if (applicationId) {
        Logger.log('Found Application ID: ' + applicationId);
        return createJsonResponse({
          success: true,
          applicationId: applicationId,
          message: 'Application ID found'
        });
      } else {
        Logger.log('No Application ID found for NRIC: ' + nric);
        return createJsonResponse({
          success: false,
          error: 'Application not found',
          message: 'No application found with this NRIC'
        });
      }
    }
    
    // Regular data submission
    if (!e.parameter || !e.parameter.data) {
      Logger.log('No data parameter found');
      return createJsonResponse({
        success: false,
        error: 'No data parameter provided',
        message: 'Please provide data parameter'
      });
    }
    
    const dataString = decodeURIComponent(e.parameter.data);
    Logger.log('Decoded data string length: ' + dataString.length);
    Logger.log('Data preview (first 200 chars): ' + dataString.substring(0, 200));
    
    const data = JSON.parse(dataString);
    Logger.log('Parsed data keys: ' + Object.keys(data).join(', '));
    
    // Log key data for debugging
    if (data.fullName) Logger.log('Full Name: ' + data.fullName);
    if (data.nric) Logger.log('NRIC: ' + data.nric);
    if (data.files) Logger.log('Files count: ' + data.files.length);
    
    const result = processFormData(data);
    Logger.log('Processing completed successfully');
    
    return result;
    
  } catch (error) {
    Logger.log('ERROR in doGet: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    return createJsonResponse({
      success: false,
      error: error.toString(),
      message: 'Failed to process GET request'
    });
  }
}

// Create JSON response with CORS headers
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle CORS preflight requests (OPTIONS)
function doOptions(e) {
  Logger.log('=== OPTIONS REQUEST RECEIVED (CORS Preflight) ===');
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Find Application ID by NRIC
function findApplicationIdByNric(nric) {
  try {
    Logger.log('Searching for Application ID with NRIC: ' + nric);
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      Logger.log('No data in sheet');
      return null;
    }
    
    // Get all data
    const data = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
    const headers = data[0];
    
    // Find NRIC column index
    const nricIndex = headers.indexOf('NRIC');
    const appIdIndex = headers.indexOf('Application ID');
    
    if (nricIndex === -1 || appIdIndex === -1) {
      Logger.log('NRIC or Application ID column not found');
      return null;
    }
    
    // Search for the NRIC
    for (let i = 1; i < data.length; i++) {
      if (data[i][nricIndex] === nric) {
        const applicationId = data[i][appIdIndex];
        Logger.log('Found matching NRIC, Application ID: ' + applicationId);
        return applicationId;
      }
    }
    
    Logger.log('NRIC not found in sheet');
    return null;
    
  } catch (error) {
    Logger.log('ERROR in findApplicationIdByNric: ' + error.toString());
    return null;
  }
}

// Process form data (shared function)
function processFormData(data) {
  try {
    Logger.log('=== PROCESSING FORM DATA ===');
    
    // Validate data
    if (!data) {
      throw new Error('No data provided');
    }
    
    // Generate unique application ID
    const applicationId = generateApplicationId();
    Logger.log('Generated Application ID: ' + applicationId);
    
    // Save form data to Google Sheets
    Logger.log('Saving to Google Sheets...');
    saveToSheets(data, applicationId);
    Logger.log('✓ Successfully saved to sheets');
    
    // Handle file uploads if any
    let uploadedFiles = [];
    if (data.files && Array.isArray(data.files) && data.files.length > 0) {
      Logger.log('Processing ' + data.files.length + ' file(s)...');
      uploadedFiles = handleFileUploads(data.files, applicationId);
      Logger.log('✓ Successfully uploaded ' + uploadedFiles.length + ' file(s)');
    } else {
      Logger.log('No files to upload');
    }
    
    Logger.log('=== FORM PROCESSING COMPLETED ===');
    
    // Return success response
    return createJsonResponse({
      success: true,
      applicationId: applicationId,
      message: 'Application submitted successfully',
      uploadedFiles: uploadedFiles,
      timestamp: new Date().toISOString()
    });
      
    } catch (error) {
    Logger.log('=== ERROR PROCESSING FORM ===');
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    return createJsonResponse({
      success: false,
      error: error.toString(),
      stack: error.stack,
      message: 'Failed to process form data'
    });
  }
}

// Generate unique application ID
function generateApplicationId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APP-${timestamp}-${random}`;
}

// Save form data to Google Sheets
function saveToSheets(data, applicationId) {
  try {
    Logger.log('Opening spreadsheet: ' + SHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getActiveSheet();
    
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Current row count: ' + sheet.getLastRow());
    
    // Get headers (first row)
    const lastColumn = sheet.getLastColumn();
    Logger.log('Last column: ' + lastColumn);
    
    let headers = [];
    if (lastColumn > 0) {
      headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    }
    
    // If headers don't exist, create them
    if (headers.length === 0 || headers[0] === '' || headers[0] === null) {
      Logger.log('Creating headers...');
      const headerRow = [
        'Application ID',
        'Submission Date',
        'Referral Code',
        'Motorcycle Model',
        'Full Name',
        'NRIC',
        'Phone',
        'Email',
        'Address Line 1',
        'Address Line 2',
        'Postcode',
        'City',
        'State',
        'Monthly Income',
        'Employment Type',
        'NRIC Front Uploaded',
        'NRIC Back Uploaded',
        'Income Documents Count',
        'Total Files Uploaded'
      ];
      sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
      Logger.log('✓ Headers created');
    } else {
      Logger.log('Headers already exist');
    }
    
    // Prepare data row
    const rowData = [
      applicationId,
      new Date(),
      data.referralCode || '',
      data.motorcycleModel || '',
      data.fullName || '',
      data.nric || '',
      data.phone || '',
      data.email || '',
      data.address1 || '',
      data.address2 || '',
      data.postcode || '',
      data.city || '',
      data.state || '',
      data.monthlyIncome || '',
      data.employmentType || '',
      data.nricFrontUploaded ? 'Yes' : 'No',
      data.nricBackUploaded ? 'Yes' : 'No',
      data.incomeDocumentsCount || 0,
      (data.files && data.files.length) || 0
    ];
    
    Logger.log('Appending row with ' + rowData.length + ' columns');
    Logger.log('Application ID: ' + applicationId);
    Logger.log('Full Name: ' + data.fullName);
    Logger.log('NRIC: ' + data.nric);
    
    // Add data to sheet
    sheet.appendRow(rowData);
    
    Logger.log('✓ Row added at position: ' + sheet.getLastRow());
    
  } catch (error) {
    Logger.log('ERROR in saveToSheets: ' + error.toString());
    throw error;
  }
}

// Handle file uploads to Google Drive
function handleFileUploads(files, applicationId) {
  const uploadedFiles = [];
  
  try {
    Logger.log('Opening Drive folder: ' + DRIVE_FOLDER_ID);
    const parentFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    Logger.log('Parent folder name: ' + parentFolder.getName());
    
    Logger.log('Creating subfolder: ' + applicationId);
    const appFolder = parentFolder.createFolder(applicationId);
    Logger.log('✓ Subfolder created');
    
    Logger.log('Processing ' + files.length + ' file(s)...');
    
    files.forEach(function(file, index) {
      try {
        Logger.log('Processing file ' + (index + 1) + ': ' + file.name);
        Logger.log('File type: ' + file.mimeType);
        Logger.log('File size: ' + file.size + ' bytes');
        Logger.log('Field name: ' + file.fieldName);
        
        // Convert base64 to blob
        const fileBlob = Utilities.newBlob(
          Utilities.base64Decode(file.data),
          file.mimeType,
          file.name
        );
        
        Logger.log('✓ File blob created');
        
        // Upload to Drive
        const driveFile = appFolder.createFile(fileBlob);
        Logger.log('✓ File uploaded to Drive');
        Logger.log('Drive file ID: ' + driveFile.getId());
        
        uploadedFiles.push({
          name: file.name,
          driveId: driveFile.getId(),
          driveUrl: driveFile.getUrl(),
          size: file.size,
          fieldName: file.fieldName
        });
        
      } catch (fileError) {
        Logger.log('ERROR uploading file ' + file.name + ': ' + fileError.toString());
        // Continue with other files even if one fails
      }
    });
    
    Logger.log('✓ File upload completed. Total uploaded: ' + uploadedFiles.length);
    
  } catch (folderError) {
    Logger.log('ERROR creating folder: ' + folderError.toString());
    throw folderError;
  }
  
  return uploadedFiles;
}

// Test function for development
function testSubmission() {
  const testData = {
    referralCode: 'TEST123',
    motorcycleModel: 'Yamaha Y15ZR',
    fullName: 'John Doe',
    nric: '123456-78-9012',
    phone: '+60123456789',
    email: 'john@example.com',
    address1: '123 Main Street',
    address2: 'Apartment 1',
    postcode: '12345',
    city: 'Kuala Lumpur',
    state: 'Selangor',
    monthlyIncome: '5000',
    employmentType: 'Pekerja Bergaji',
    files: []
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log(result.getContent());
}

// Test function to simulate GET request (for debugging)
function testGetRequest() {
  const testData = {
    referralCode: 'GET123',
    motorcycleModel: 'Yamaha Y15ZR',
    fullName: 'Test User',
    nric: '123456-78-9012',
    phone: '+60123456789',
    email: 'test@example.com',
    address1: '123 Test Street',
    address2: 'Unit 1',
    postcode: '12345',
    city: 'Kuala Lumpur',
    state: 'Selangor',
    monthlyIncome: '5000',
    employmentType: 'Pekerja Bergaji',
    files: []
  };
  
  const mockEvent = {
    parameter: {
      data: encodeURIComponent(JSON.stringify(testData))
    }
  };
  
  try {
    const result = doGet(mockEvent);
    console.log('GET request test result:', result.getContent());
    return result.getContent();
  } catch (error) {
    console.error('GET request test failed:', error);
    return 'Error: ' + error.toString();
  }
}

// Simple test to check if basic functions work
function testBasicFunctions() {
  try {
    console.log('Testing basic functions...');
    
    // Test application ID generation
    const appId = generateApplicationId();
    console.log('Generated App ID:', appId);
    
    // Test saving to sheets (without files)
    const testData = {
      referralCode: 'BASIC123',
      motorcycleModel: 'Honda RS150R',
      fullName: 'Basic Test',
      nric: '111111-11-1111',
      phone: '+60111111111',
      email: 'basic@test.com',
      address1: '111 Basic Street',
      address2: 'Basic Unit',
      postcode: '11111',
      city: 'Basic City',
      state: 'Selangor',
      monthlyIncome: '3000',
      employmentType: 'Pekerja Bergaji',
      files: []
    };
    
    saveToSheets(testData, appId);
    console.log('Basic test completed successfully');
    
    return 'Basic test passed - App ID: ' + appId;
    
  } catch (error) {
    console.error('Basic test failed:', error);
    return 'Basic test failed: ' + error.toString();
  }
}
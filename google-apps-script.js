// Google Apps Script Code for Sheets and Drive Integration
// Deploy this as a Web App with execute permissions for "Anyone"

// Configuration
const SHEET_ID = '1Rbrx4vacA10_rkCGplYhtFd4GpXRnSwTFHxT5qvRZJ4';
const DRIVE_FOLDER_ID = '1a89zTsFsUXNA2EfI-2oUV9y0vELSJ5zN';

// Main function to handle form submission (POST)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return processFormData(data);
  } catch (error) {
    console.error('Error processing POST request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for CORS workaround)
function doGet(e) {
  try {
    console.log('GET request received');
    console.log('Parameters:', e.parameter);
    
    if (!e.parameter || !e.parameter.data) {
      console.log('No data parameter found');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'No data parameter provided'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataString = decodeURIComponent(e.parameter.data);
    console.log('Decoded data string length:', dataString.length);
    
    const data = JSON.parse(dataString);
    console.log('Parsed data keys:', Object.keys(data));
    
    return processFormData(data);
    
  } catch (error) {
    console.error('Error processing GET request:', error);
    console.error('Error details:', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        details: 'Failed to process GET request'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Process form data (shared function)
function processFormData(data) {
  try {
    console.log('Processing form data...');
    console.log('Data received:', typeof data, Object.keys(data || {}));
    
    // Generate unique application ID
    const applicationId = generateApplicationId();
    console.log('Generated application ID:', applicationId);
    
    // Save form data to Google Sheets
    console.log('Saving to sheets...');
    saveToSheets(data, applicationId);
    console.log('Successfully saved to sheets');
    
    // Handle file uploads if any
    let uploadedFiles = [];
    if (data.files && data.files.length > 0) {
      console.log('Processing file uploads:', data.files.length, 'files');
      uploadedFiles = handleFileUploads(data.files, applicationId);
      console.log('File uploads completed:', uploadedFiles.length, 'files uploaded');
    } else {
      console.log('No files to upload');
    }
    
    console.log('Form processing completed successfully');
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        applicationId: applicationId,
        message: 'Application submitted successfully',
        uploadedFiles: uploadedFiles
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form data:', error);
    console.error('Error stack:', error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Generate unique application ID
function generateApplicationId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APP-${timestamp}-${random}`;
}

// Save form data to Google Sheets
function saveToSheets(data, applicationId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  // Get headers (first row)
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // If headers don't exist, create them
  if (headers.length === 0 || headers[0] === '') {
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
      'File Upload Status'
    ];
    sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
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
    data.nricFrontUploaded || false,
    data.nricBackUploaded || false,
    data.incomeDocumentsCount || 0,
    data.files ? data.files.length > 0 : false
  ];
  
  // Add data to sheet
  sheet.appendRow(rowData);
}

// Handle file uploads to Google Drive
function handleFileUploads(files, applicationId) {
  const uploadedFiles = [];
  
  try {
    // Create folder for this application
    const parentFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const appFolder = parentFolder.createFolder(applicationId);
    
    files.forEach(file => {
      try {
        // Convert base64 to blob
        const fileBlob = Utilities.newBlob(
          Utilities.base64Decode(file.data), 
          file.mimeType, 
          file.name
        );
        
        // Upload to Drive
        const driveFile = appFolder.createFile(fileBlob);
        
        uploadedFiles.push({
          name: file.name,
          driveId: driveFile.getId(),
          driveUrl: driveFile.getUrl(),
          size: file.size
        });
        
      } catch (fileError) {
        console.error(`Error uploading file ${file.name}:`, fileError);
      }
    });
    
  } catch (folderError) {
    console.error('Error creating application folder:', folderError);
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
// Motorcycle Loan Application Form JavaScript
class LoanApplicationForm {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 7;
        this.formData = {};
        this.uploadedFiles = {};
        
        this.init();
    }

    init() {
        this.setupReferralCode();
        this.setupEventListeners();
        this.updateProgress();
        this.updateNavigationButtons();
        this.setupFileUploads();
        this.setupAccordion();
        this.setupNRICFormatting();
        this.setupPhoneFormatting();
    }

    // Handle referral code from URL parameters
    setupReferralCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        
        if (referralCode) {
            document.getElementById('referralCode').value = referralCode;
            console.log('Referral code detected:', referralCode);
        }
    }

    // Setup accordion functionality for document types
    setupAccordion() {
        const incomeDocumentToggle = document.getElementById('incomeDocumentToggle');
        const subDocumentsContainer = document.getElementById('subDocumentsContainer');
        const accordionIcon = document.querySelector('#incomeDocumentToggle .accordion-icon');

        if (incomeDocumentToggle && subDocumentsContainer && accordionIcon) {
            incomeDocumentToggle.addEventListener('click', () => {
                subDocumentsContainer.classList.toggle('expanded');
                accordionIcon.classList.toggle('rotated');
            });
        }
    }

    // Setup NRIC auto-formatting
    setupNRICFormatting() {
        const nricInput = document.getElementById('nric');
        
        if (nricInput) {
            nricInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
                
                // Format as 000000-00-0000
                if (value.length >= 6) {
                    value = value.substring(0, 6) + '-' + value.substring(6);
                }
                if (value.length >= 9) {
                    value = value.substring(0, 9) + '-' + value.substring(9);
                }
                
                // Limit to 12 digits (6-2-4 format)
                if (value.replace(/\D/g, '').length > 12) {
                    value = value.substring(0, 14); // 14 characters including dashes
                }
                
                e.target.value = value;
            });

            // Prevent pasting non-numeric content
            nricInput.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const numericOnly = paste.replace(/\D/g, '');
                if (numericOnly.length <= 12) {
                    nricInput.value = numericOnly;
                    nricInput.dispatchEvent(new Event('input'));
                }
            });
        }
    }

    // Setup phone number auto-formatting with +6 prefix
    setupPhoneFormatting() {
        const phoneInputs = [
            'phone', 'employerPhone1', 'employerPhone2', 'ref1Phone', 'ref2Phone'
        ];

        phoneInputs.forEach(inputId => {
            const phoneInput = document.getElementById(inputId);
            if (phoneInput) {
                // Clear any existing value to avoid double +6
                phoneInput.value = '';

                phoneInput.addEventListener('input', (e) => {
                    let value = e.target.value;
                    
                    // Remove any +6 that user might type (since it's already in prefix)
                    value = value.replace(/^\+6/, '');
                    
                    // Remove any non-numeric characters
                    value = value.replace(/\D/g, '');
                    
                    // Limit to 9-11 digits (Malaysian phone numbers)
                    if (value.length > 11) {
                        value = value.substring(0, 11);
                    }
                    
                    e.target.value = value;
                });

                phoneInput.addEventListener('focus', (e) => {
                    // Place cursor at the beginning
                    e.target.setSelectionRange(0, 0);
                });
            }
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('submitBtn').addEventListener('click', (e) => this.submitForm(e));

        // Employment type card selection handler
        const employmentCards = document.querySelectorAll('.employment-card');
        employmentCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                employmentCards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                card.classList.add('selected');
                // Update hidden input value
                const employmentTypeInput = document.getElementById('employmentType');
                employmentTypeInput.value = card.dataset.value;
                // Handle the change
                this.handleEmploymentTypeChange(card.dataset.value);
            });
        });

        // Form validation on input
        const form = document.getElementById('loanForm');
        form.addEventListener('input', (e) => this.validateField(e.target));
        form.addEventListener('change', (e) => this.validateField(e.target));

        // Referral code uppercase conversion
        const referralCodeInput = document.getElementById('referralCode');
        if (referralCodeInput) {
            referralCodeInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }
    }

    handleEmploymentTypeChange(type) {
        const documentRequirements = document.getElementById('documentRequirements');
        const documentRequirementsContent = document.getElementById('documentRequirementsContent');

        if (type) {
            documentRequirements.style.display = 'block';
            
            let requirementsHTML = '';
            
            switch (type) {
                case 'Pekerja Bergaji':
                    const currentMonth = this.getCurrentMonthName();
                    const previousMonth = this.getPreviousMonthName();
                    requirementsHTML = `
                        <div class="requirement-item">
                            <i class="fas fa-file-alt"></i>
                            <span>Slip Gaji Terkini 1 Bulan <span class="badge-wajib">Wajib</span></span>
                        </div>
                        <div class="requirement-example">
                            <i class="fas fa-exclamation-circle example-icon"></i>
                            <p class="example-text">Contoh: 'Slip Gaji ${previousMonth}' atau 'Slip Gaji ${currentMonth}'</p>
                        </div>
                        <p class="requirement-note">Anda boleh memuat naik sehingga 10 dokumen pendapatan</p>
                    `;
                    break;
                    
                case 'Bekerja Sendiri':
                    const currentMonthSE = this.getCurrentMonthName();
                    const previousMonthSE = this.getPreviousMonthName();
                    const twoMonthsAgoSE = this.getTwoMonthsAgoName();
                    requirementsHTML = `
                        <div class="requirement-item">
                            <i class="fas fa-file-alt"></i>
                            <span>Salinan Pendaftaran Perniagaan (SSM) <span class="badge-wajib">Wajib</span></span>
                        </div>
                        <div class="requirement-item">
                            <i class="fas fa-file-alt"></i>
                            <span>Penyata Bank Perniagaan Terkini 3 Bulan <span class="badge-wajib">Wajib</span></span>
                        </div>
                        <div class="requirement-example">
                            <i class="fas fa-exclamation-circle example-icon"></i>
                            <p class="example-text">Contoh: 'Penyata Bank ${twoMonthsAgoSE}' hingga 'Penyata Bank ${currentMonthSE}'</p>
                        </div>
                        <p class="requirement-note">Anda boleh memuat naik sehingga 10 dokumen pendapatan</p>
                    `;
                    break;
                    
                case 'Pekerja GIG':
                    const currentMonthGIG = this.getCurrentMonthName();
                    const previousMonthGIG = this.getPreviousMonthName();
                    const twoMonthsAgoGIG = this.getTwoMonthsAgoName();
                    requirementsHTML = `
                        <div class="requirement-item">
                            <i class="fas fa-file-alt"></i>
                            <span>Penyata Pendapatan Terkini 3 Bulan <span class="badge-wajib">Wajib</span></span>
                        </div>
                        <div class="requirement-item">
                            <i class="fas fa-file-alt"></i>
                            <span>Penyata Bank Terkini 3 Bulan <span class="badge-wajib">Wajib</span></span>
                        </div>
                        <div class="requirement-example">
                            <i class="fas fa-exclamation-circle example-icon"></i>
                            <p class="example-text">Contoh: 'Penyata ${twoMonthsAgoGIG}' hingga 'Penyata ${currentMonthGIG}'</p>
                        </div>
                        <p class="requirement-note">Anda boleh memuat naik sehingga 10 dokumen pendapatan</p>
                    `;
                    break;
            }
            
            documentRequirementsContent.innerHTML = requirementsHTML;
            
            // Also show the income documents section when employment type is selected
            this.showIncomeDocumentsSection();
        } else {
            documentRequirements.style.display = 'none';
        }
    }

    setupFileUploads() {
        // Setup file upload handlers for all file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleFileUpload(e));
        });

        // Setup clear button for income documents
        const clearIncomeBtn = document.getElementById('clearIncomeDocuments');
        if (clearIncomeBtn) {
            clearIncomeBtn.addEventListener('click', () => this.clearIncomeDocuments());
        }
    }

    handleFileUpload(event) {
        const files = event.target.files;
        const inputName = event.target.name;
        const fileInfo = document.getElementById(inputName + 'Info');

        if (files && files.length > 0) {
            // Handle multiple files for income documents
            if (inputName === 'incomeDocuments') {
                // Validate file types first
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
                const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));
                
                if (invalidFiles.length > 0) {
                    fileInfo.textContent = 'Hanya gambar dan PDF dibenarkan';
                    fileInfo.style.color = '#e74c3c';
                    return;
                }

                // Initialize array if it doesn't exist
                if (!this.uploadedFiles[inputName]) {
                    this.uploadedFiles[inputName] = [];
                }

                // Add new files to existing ones
                const newFiles = Array.from(files);
                this.uploadedFiles[inputName] = [...this.uploadedFiles[inputName], ...newFiles];

                // Validate total file count (max 10)
                if (this.uploadedFiles[inputName].length > 10) {
                    fileInfo.textContent = 'Maksimum 10 fail sahaja dibenarkan';
                    fileInfo.style.color = '#e74c3c';
                    // Remove excess files
                    this.uploadedFiles[inputName] = this.uploadedFiles[inputName].slice(0, 10);
                    return;
                }

                fileInfo.textContent = `Dipilih: ${this.uploadedFiles[inputName].length} fail`;
                fileInfo.style.color = '#2D9394';
                
                // Show clear button if files are selected
                const actionsDiv = document.getElementById('incomeDocumentsActions');
                if (actionsDiv) {
                    actionsDiv.style.display = 'block';
                }
            } else {
                // Handle single file for other inputs
                const file = files[0];
                this.uploadedFiles[inputName] = file;
                fileInfo.textContent = `Dipilih: ${file.name} (${this.formatFileSize(file.size)})`;
                fileInfo.style.color = '#2D9394';
            }
        } else {
            // Only clear if it's not incomeDocuments (to preserve accumulated files)
            if (inputName !== 'incomeDocuments') {
                delete this.uploadedFiles[inputName];
                fileInfo.textContent = '';
            }
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    clearIncomeDocuments() {
        // Clear the uploaded files array
        this.uploadedFiles['incomeDocuments'] = [];
        
        // Clear the file input
        const fileInput = document.getElementById('incomeDocuments');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clear the file info display
        const fileInfo = document.getElementById('incomeDocumentsInfo');
        if (fileInfo) {
            fileInfo.textContent = '';
        }
        
        // Hide the actions div
        const actionsDiv = document.getElementById('incomeDocumentsActions');
        if (actionsDiv) {
            actionsDiv.style.display = 'none';
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        
        // For phone fields, look for error in form-group
        const phoneContainer = field.closest('.phone-input-container');
        let existingError;
        if (phoneContainer) {
            const formGroup = phoneContainer.closest('.form-group');
            existingError = formGroup.querySelector('.error-message');
        } else {
            existingError = field.parentNode.querySelector('.error-message');
        }
        
        if (existingError) {
            existingError.remove();
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Bahagian ini perlu diisi';
        }

        // Specific field validations
        if (value && isValid) {
            switch (fieldName) {
                case 'nric':
                case 'ref1Nric':
                    if (!/^[0-9]{6}-[0-9]{2}-[0-9]{4}$/.test(value)) {
                        isValid = false;
                        errorMessage = 'NRIC mestilah dalam format 000000-00-0000';
                    }
                    break;
                case 'phone':
                case 'employerPhone1':
                case 'employerPhone2':
                case 'ref1Phone':
                case 'ref2Phone':
                    // For phone fields, we need to check the full value including the +6 prefix
                    const phoneField = document.getElementById(fieldName);
                    const phoneContainer = phoneField.closest('.phone-input-container');
                    if (phoneContainer) {
                        const fullPhoneValue = '+6' + phoneField.value;
                        if (!/^\+6[0-9]{9,11}$/.test(fullPhoneValue)) {
                            isValid = false;
                            errorMessage = 'Nombor telefon mestilah dalam format 01XXXXXXXX';
                        }
                    }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Format emel tidak sah';
                    }
                    break;
                case 'postcode':
                case 'employerPostcode':
                    if (!/^[0-9]{5}$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Poskod mestilah 5 digit';
                    }
                    break;
                case 'bankAccount':
                    if (!/^[0-9]{12,15}$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Nombor akaun mestilah 12-15 digit';
                    }
                    break;
                case 'grossIncome':
                case 'netIncome':
                    if (parseFloat(value) < 0) {
                        isValid = false;
                        errorMessage = 'Pendapatan tidak boleh negatif';
                    }
                    break;
            }
        }

        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '5px';
            
            // For phone fields, add error to the form-group instead of phone container
            const phoneContainer = field.closest('.phone-input-container');
            if (phoneContainer) {
                const formGroup = phoneContainer.closest('.form-group');
                formGroup.appendChild(errorDiv);
            } else {
                field.parentNode.appendChild(errorDiv);
            }
        }

        return isValid;
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        // Special validation for employment type selection
        if (this.currentStep === 4) {
            const employmentType = document.getElementById('employmentType').value;
            if (!employmentType) {
                        allValid = false;
                const employmentTypeField = document.getElementById('employmentType');
                employmentTypeField.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Sila pilih jenis pekerjaan';
                errorDiv.style.color = '#e74c3c';
                errorDiv.style.fontSize = '12px';
                errorDiv.style.marginTop = '5px';
                employmentTypeField.parentNode.appendChild(errorDiv);
            }
        }

        return allValid;
    }

    nextStep() {
        if (this.currentStep === 0) {
            // Landing page - no validation needed, just proceed
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigationButtons();
            this.scrollToTop();
        } else if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps - 1) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.updateNavigationButtons();
                this.scrollToTop();
                
                // If moving to confirmation step, populate summary
                if (this.currentStep === 5) {
                    this.populateApplicationSummary();
                }
            }
        } else {
            this.showNotification('Sila lengkapkan semua bahagian yang diperlukan', 'error');
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigationButtons();
            // Delay scroll to ensure progress is updated first
            setTimeout(() => {
                this.scrollToTop();
            }, 100);
        }
    }

    showStep(stepNumber) {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));

        // Show current step
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Show/hide progress bar based on step
        const progressContainer = document.getElementById('progressContainer');
        if (stepNumber === 0) {
            // Landing page - hide progress bar
            progressContainer.style.display = 'none';
        } else {
            // Form steps - show progress bar
            progressContainer.style.display = 'flex';
        }

        // Show document requirements and income documents section on employment step
        if (stepNumber === 4) {
            const employmentType = document.getElementById('employmentType').value;
            if (employmentType) {
                // Update card selection visual state
                const employmentCards = document.querySelectorAll('.employment-card');
                employmentCards.forEach(card => {
                    if (card.dataset.value === employmentType) {
                        card.classList.add('selected');
                    } else {
                        card.classList.remove('selected');
                    }
                });
                this.handleEmploymentTypeChange(employmentType);
                this.showIncomeDocumentsSection();
            }
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const currentStepSpan = document.getElementById('currentStep');
        const totalStepsSpan = document.getElementById('totalSteps');

        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        currentStepSpan.textContent = this.currentStep + 1; // Show 1-based step numbers
        totalStepsSpan.textContent = this.totalSteps;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        // Show/hide previous button
        prevBtn.style.display = this.currentStep > 0 ? 'flex' : 'none';

        // Update next button text based on current step
        if (this.currentStep === 0) {
            // Landing page - show "Mulakan Permohonan Anda"
            nextBtn.innerHTML = 'Mulakan Permohonan Anda <i class="fas fa-arrow-right"></i>';
        } else {
            // All other steps - show "Seterusnya"
            nextBtn.innerHTML = 'Seterusnya <i class="fas fa-arrow-right"></i>';
        }

        // Show/hide next/submit buttons
        if (this.currentStep === this.totalSteps - 1) {
            // Final step (Step 6 - CCRIS consent) - show submit button
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            // All other steps - show next button
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }

    collectFormData() {
        const form = document.getElementById('loanForm');
        console.log('Form element found:', form);
        
        if (!form) {
            console.error('Form element not found!');
            return {};
        }
        
        const formData = new FormData(form);
        
        // Convert FormData to object
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log('=== COLLECTING FORM DATA ===');
        console.log('Raw form data entries:', Array.from(formData.entries()));
        console.log('Converted data object:', data);
        
        // Manual field collection as fallback
        const fieldIds = ['referralCode', 'motorcycleModel', 'fullName', 'nric', 'phone', 'email', 'employmentType', 'address1', 'address2', 'postcode', 'city', 'state', 'monthlyIncome'];
        const manualData = {};
        
        fieldIds.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            console.log(`Field ${fieldId}:`, element, element?.value);
            manualData[fieldId] = element?.value || '';
        });
        
        console.log('Manual field collection:', manualData);
        
        // Use manual data if form data is missing values
        Object.keys(manualData).forEach(key => {
            if (!data[key] && manualData[key]) {
                data[key] = manualData[key];
                console.log(`Fixed ${key}: ${data[key]}`);
            }
        });
        
        console.log('Final data object:', data);

        // Handle phone numbers - add +6 prefix for phone fields
        const phoneFields = ['phone', 'employerPhone1', 'employerPhone2', 'ref1Phone', 'ref2Phone'];
        phoneFields.forEach(fieldName => {
            if (data[fieldName]) {
                data[fieldName] = '+6' + data[fieldName];
            }
        });

        // Add file information
        data.uploadedFiles = Object.keys(this.uploadedFiles).map(key => {
            const files = this.uploadedFiles[key];
            if (Array.isArray(files)) {
                // Multiple files (income documents)
                return {
                    field: key,
                    fileCount: files.length,
                    files: files.map(file => ({
                        fileName: file.name,
                        fileSize: file.size
                    }))
                };
            } else {
                // Single file
                return {
                    field: key,
                    fileName: files.name,
                    fileSize: files.size
                };
            }
        });

        // Add timestamp
        data.submissionDate = new Date().toISOString();
        data.submissionId = 'APP-' + Date.now();

        return data;
    }

    async submitForm(event) {
        event.preventDefault();
        
        console.log('=== FORM SUBMISSION STARTED ===');
        console.log('Current step:', this.currentStep);
        console.log('Employment type value:', document.getElementById('employmentType').value);
        console.log('Full name value:', document.getElementById('fullName').value);
        console.log('NRIC value:', document.getElementById('nric').value);
        console.log('Motorcycle model value:', document.getElementById('motorcycleModel').value);
        console.log('Address1 value:', document.getElementById('address1').value);
        console.log('Address2 value:', document.getElementById('address2').value);
        console.log('Postcode value:', document.getElementById('postcode').value);
        console.log('City value:', document.getElementById('city').value);
        console.log('State value:', document.getElementById('state').value);
        console.log('Monthly income value:', document.getElementById('monthlyIncome').value);

        if (!this.validateCurrentStep()) {
            this.showNotification('Sila lengkapkan semua medan yang diperlukan', 'error');
            return;
        }

        // Check CCRIS consent
        const ccrisConsent = document.getElementById('ccrisConsent');
        if (!ccrisConsent.checked) {
            this.showNotification('Anda mesti bersetuju dengan kebenaran CCRIS untuk meneruskan', 'error');
            return;
        }

        // Show loading
        this.showLoading(true);

        try {
            const formData = this.collectFormData();
            
            // Prepare files for upload
            const files = await this.uploadFilesToDrive();
            
            // Add files to form data
            formData.files = files;
            formData.incomeDocumentsCount = files.filter(f => f.fieldName === 'incomeDocuments').length;
            formData.nricFrontUploaded = files.some(f => f.fieldName === 'nricFront');
            formData.nricBackUploaded = files.some(f => f.fieldName === 'nricBack');

            // Submit to Google Sheets
            const result = await this.submitToGoogleSheets(formData);

            // Add application ID from result to form data
            if (result && result.applicationId) {
                formData.submissionId = result.applicationId;
            } else {
                // Fallback: generate a local application ID
                formData.submissionId = 'APP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            }

            // Redirect to success page with application data
            this.redirectToSuccessPage(formData);

        } catch (error) {
            console.error('Submission error:', error);
            this.showNotification('Ralat semasa menghantar permohonan. Sila cuba lagi.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async uploadFilesToDrive() {
        const files = [];
        
        // Convert uploaded files to base64 for Google Apps Script
        for (const [fieldName, fileList] of Object.entries(this.uploadedFiles)) {
            try {
                if (Array.isArray(fileList)) {
                    for (const file of fileList) {
                        const base64Data = await this.fileToBase64(file);
                        files.push({
                            name: file.name,
                            data: base64Data,
                            mimeType: file.type,
                            size: file.size,
                            fieldName: fieldName
                        });
                    }
                } else if (fileList) {
                    const base64Data = await this.fileToBase64(fileList);
                    files.push({
                        name: fileList.name,
                        data: base64Data,
                        mimeType: fileList.type,
                        size: fileList.size,
                        fieldName: fieldName
                    });
                }
            } catch (error) {
                console.error(`Error processing ${fieldName}:`, error);
            }
        }
        
        return files;
    }
    
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove data:image/jpeg;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    async submitToGoogleSheets(data) {
            // Replace with your Google Apps Script Web App URL
            const scriptUrl = 'https://script.google.com/macros/s/AKfycby8nwdknK9tnMpqlKhvpTw9IJif1UIsQo73Zq1CEvB1J8I9rJUikGEyCrNrWTSXnUhV/exec';
            
            console.log('=== SUBMITTING TO GOOGLE SHEETS ===');
            console.log('Script URL:', scriptUrl);
            console.log('Data to submit:', {
                referralCode: data.referralCode,
                motorcycleModel: data.motorcycleModel,
                fullName: data.fullName,
                nric: data.nric,
                phone: data.phone,
                email: data.email,
                address1: data.address1,
                address2: data.address2,
                postcode: data.postcode,
                city: data.city,
                state: data.state,
                monthlyIncome: data.monthlyIncome,
                employmentType: data.employmentType,
                filesCount: data.files ? data.files.length : 0
            });
            
            try {
                // Try POST request with proper CORS handling
                console.log('Attempting POST request...');
                
                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const result = await response.json();
                console.log('Response data:', result);
                
                if (!result.success) {
                    console.error('Server returned error:', result.error);
                    throw new Error(result.error || 'Failed to submit to Google Sheets');
                }
                
                console.log('✓ Successfully submitted to Google Sheets!');
                console.log('Application ID:', result.applicationId);
                
                return result;
                
            } catch (error) {
                console.error('=== SUBMISSION ERROR ===');
                console.error('Error type:', error.name);
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
                
                // Fallback: Try POST with no-cors mode
                try {
                    console.log('Attempting POST with no-cors fallback...');
                    
                    const response = await fetch(scriptUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    console.log('POST fallback completed');
                    
                    // Since we can't read the response in no-cors mode,
                    // we need to check if the data was actually saved
                    // Wait a moment for the backend to process
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Try to get the application ID from the backend
                    try {
                        const checkUrl = scriptUrl + '?check=' + encodeURIComponent(data.nric);
                        const checkResponse = await fetch(checkUrl, {
                            method: 'GET',
                            mode: 'cors'
                        });
                        
                        if (checkResponse.ok) {
                            const checkResult = await checkResponse.json();
                            if (checkResult.success && checkResult.applicationId) {
                                console.log('Retrieved Application ID from backend:', checkResult.applicationId);
                                return {
                                    success: true,
                                    applicationId: checkResult.applicationId,
                                    message: 'Application submitted successfully',
                                    fallback: true
                                };
                            }
                        }
                    } catch (checkError) {
                        console.log('Could not retrieve Application ID from backend:', checkError);
                    }
                    
                    // If we can't get the backend ID, generate a local one
                    const localApplicationId = 'APP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                    console.log('Using local Application ID:', localApplicationId);
                    
                    return {
                        success: true,
                        applicationId: localApplicationId,
                        message: 'Application submitted (fallback mode - check Google Sheet for actual ID)',
                        fallback: true
                    };
                    
                } catch (fallbackError) {
                    console.error('Both GET and POST failed:', fallbackError);
                    throw new Error('Failed to submit application. Please check your internet connection and try again.');
                }
            }
        }

    showDocumentRequirementsReminder() {
        const documentRequirementsReminder = document.getElementById('documentRequirementsReminder');
        const documentRequirementsReminderContent = document.getElementById('documentRequirementsReminderContent');
        const employmentType = document.getElementById('employmentType').value;
        
        if (employmentType) {
            documentRequirementsReminder.style.display = 'block';
            
            let requirementsHTML = '';
            
            switch (employmentType) {
                case 'Pekerja Bergaji':
                    requirementsHTML = `
                        <div class="reminder-section">
                            <h4>💼 Pekerja Bergaji</h4>
                            <div class="requirement-list">
                                <div class="requirement-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Slip Gaji Terkini 1 Bulan (Wajib)</span>
                                </div>
                            </div>
                            <p class="reminder-note">Anda boleh memuat naik sehingga 10 dokumen pendapatan</p>
                        </div>
                    `;
                    break;
                    
                case 'Bekerja Sendiri':
                    requirementsHTML = `
                        <div class="reminder-section">
                            <h4>🏪 Bekerja Sendiri</h4>
                            <div class="requirement-list">
                                <div class="requirement-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Salinan Pendaftaran Perniagaan (SSM) - Wajib</span>
                                </div>
                                <div class="requirement-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Penyata Bank Perniagaan Terkini 3 Bulan - Wajib</span>
                                </div>
                            </div>
                            <p class="reminder-note">Anda boleh memuat naik sehingga 10 dokumen pendapatan</p>
                        </div>
                    `;
                    break;
                    
                case 'Pekerja GIG':
                    requirementsHTML = `
                        <div class="reminder-section">
                            <h4>🚗 Pekerja GIG</h4>
                            <div class="requirement-list">
                                <div class="requirement-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Penyata Pendapatan Terkini 3 Bulan - Wajib</span>
                                </div>
                                <div class="requirement-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Penyata Bank Terkini 3 Bulan - Wajib</span>
                                </div>
                            </div>
                            <p class="reminder-note">Anda boleh memuat naik sehingga 10 dokumen pendapatan</p>
                        </div>
                    `;
                    break;
            }
            
            documentRequirementsReminderContent.innerHTML = requirementsHTML;
        } else {
            documentRequirementsReminder.style.display = 'none';
        }
    }

    showIncomeDocumentsSection() {
        const incomeDocumentsSection = document.getElementById('incomeDocumentsSection');
        const incomeDocumentsTitle = document.getElementById('incomeDocumentsTitle');
        const incomeDocumentsHelp = document.getElementById('incomeDocumentsHelp');
        const employmentType = document.getElementById('employmentType').value;
        
        if (employmentType) {
            incomeDocumentsSection.style.display = 'block';
            
            let title = '';
            let helpText = '';
            
            switch (employmentType) {
                case 'Pekerja Bergaji':
                    title = 'Dokumen Pendapatan (Maksimum 10 fail)';
                    helpText = 'Anda boleh memilih sehingga 10 fail (Gambar dan PDF sahaja)';
                    break;
                    
                case 'Bekerja Sendiri':
                    title = 'Dokumen Pendapatan (Maksimum 10 fail)';
                    helpText = 'Anda boleh memilih sehingga 10 fail (Gambar dan PDF sahaja)';
                    break;
                    
                case 'Pekerja GIG':
                    title = 'Dokumen Pendapatan (Maksimum 10 fail)';
                    helpText = 'Anda boleh memilih sehingga 10 fail (Gambar dan PDF sahaja)';
                    break;
            }
            
            // Only set textContent if elements exist
            if (incomeDocumentsTitle) {
                incomeDocumentsTitle.textContent = title;
            }
            if (incomeDocumentsHelp) {
                incomeDocumentsHelp.textContent = helpText;
            }
        } else {
            if (incomeDocumentsSection) {
                incomeDocumentsSection.style.display = 'none';
            }
        }
    }

    // Helper methods for date formatting
    getCurrentMonthName() {
        const months = [
            'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun',
            'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'
        ];
        const now = new Date();
        const currentMonth = months[now.getMonth()];
        const currentYear = now.getFullYear();
        return `${currentMonth} ${currentYear}`;
    }

    getPreviousMonthName() {
        const months = [
            'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun',
            'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'
        ];
        const now = new Date();
        let prevMonth = now.getMonth() - 1;
        let year = now.getFullYear();
        
        if (prevMonth < 0) {
            prevMonth = 11;
            year--;
        }
        
        const previousMonth = months[prevMonth];
        return `${previousMonth} ${year}`;
    }

    getTwoMonthsAgoName() {
        const months = [
            'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun',
            'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'
        ];
        const now = new Date();
        let twoMonthsAgo = now.getMonth() - 2;
        let year = now.getFullYear();
        
        if (twoMonthsAgo < 0) {
            twoMonthsAgo += 12;
            year--;
        }
        
        const twoMonthsAgoMonth = months[twoMonthsAgo];
        return `${twoMonthsAgoMonth} ${year}`;
    }

    populateApplicationSummary() {
        const applicationSummary = document.getElementById('applicationSummary');
        const formData = this.collectFormData();
        
        const summaryHTML = `
            <div class="summary-section">
                <h4><i class="fas fa-motorcycle"></i> Maklumat Motosikal</h4>
                <p><strong>Kod Rujukan:</strong> ${formData.referralCode || 'Tiada'}</p>
                <p><strong>Model Motosikal:</strong> ${formData.motorcycleModel}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-user"></i> Maklumat Pemohon</h4>
            <p><strong>Nama:</strong> ${formData.fullName}</p>
            <p><strong>NRIC:</strong> ${formData.nric}</p>
                <p><strong>Telefon:</strong> ${formData.phone}</p>
                <p><strong>Emel:</strong> ${formData.email}</p>
                <p><strong>Alamat:</strong> ${formData.address1}, ${formData.address2}, ${formData.postcode} ${formData.city}, ${formData.state}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-briefcase"></i> Maklumat Pekerjaan</h4>
                <p><strong>Jenis Pekerjaan:</strong> ${formData.employmentType}</p>
            </div>
            
            <div class="summary-section">
                <h4><i class="fas fa-file-alt"></i> Dokumen</h4>
                <p><strong>NRIC:</strong> Hadapan & Belakang</p>
                <p><strong>Dokumen Pendapatan:</strong> ${this.uploadedFiles['incomeDocuments'] ? this.uploadedFiles['incomeDocuments'].length : 0} fail dipilih</p>
            </div>
        `;
        
        applicationSummary.innerHTML = summaryHTML;
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const body = document.body;
        
        if (show) {
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            
            // Disable scrolling and prevent interaction
            body.classList.add('loading-active');
            
            // Store current scroll position
            this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // Prevent any form submissions or button clicks
            this.disableAllInteractions();
            
        } else {
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            // Re-enable scrolling and interaction
            body.classList.remove('loading-active');
            
            // Restore scroll position
            if (this.scrollPosition !== undefined) {
                window.scrollTo(0, this.scrollPosition);
            }
            
            // Re-enable all interactions
            this.enableAllInteractions();
        }
    }

    disableAllInteractions() {
        // Disable all buttons and form elements
        const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
        const inputs = document.querySelectorAll('input, select, textarea');
        
        // Store original states
        this.disabledElements = [];
        
        buttons.forEach(btn => {
            if (!btn.disabled) {
                this.disabledElements.push(btn);
                btn.disabled = true;
                btn.style.pointerEvents = 'none';
            }
        });
        
        inputs.forEach(input => {
            if (!input.disabled) {
                this.disabledElements.push(input);
                input.disabled = true;
                input.style.pointerEvents = 'none';
            }
        });
        
        // Prevent form submission
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.preventSubmission);
        });
    }
    
    enableAllInteractions() {
        // Re-enable all previously disabled elements
        if (this.disabledElements) {
            this.disabledElements.forEach(element => {
                element.disabled = false;
                element.style.pointerEvents = '';
            });
            this.disabledElements = [];
        }
        
        // Remove form submission prevention
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.removeEventListener('submit', this.preventSubmission);
        });
    }
    
    preventSubmission(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    scrollToTop() {
        // Use setTimeout to ensure DOM updates are complete
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 50);
    }

    redirectToSuccessPage(formData) {
        console.log('=== REDIRECTING TO SUCCESS PAGE ===');
        console.log('Form data being passed:', formData);
        
        // Create URL parameters for the success page
        const params = new URLSearchParams({
            id: formData.submissionId || 'N/A',
            name: formData.fullName || 'N/A',
            nric: formData.nric || 'N/A',
            model: formData.motorcycleModel || 'N/A',
            ref: formData.referralCode || 'N/A',
            employment: formData.employmentType || 'N/A',
            address1: formData.address1 || 'N/A',
            address2: formData.address2 || 'N/A',
            postcode: formData.postcode || 'N/A',
            city: formData.city || 'N/A',
            state: formData.state || 'N/A',
            income: formData.monthlyIncome || 'N/A',
            date: new Date().toLocaleDateString('ms-MY')
        });
        
        console.log('URL parameters:', params.toString());
        
        // Redirect to success page
        window.location.href = `success.html?${params.toString()}`;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#e74c3c' : '#6BC9CA'};
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-weight: 500;
            text-align: center;
            min-width: 300px;
            max-width: 95%;
            animation: slideInTop 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutTop 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInTop {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideOutTop {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoanApplicationForm();
});

// Handle form submission
document.getElementById('loanForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Form submission is handled by the class methods
});

// Print functionality
function printApplication() {
    window.print();
}

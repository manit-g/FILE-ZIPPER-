// Main application JavaScript
class FileZipperApp {
    constructor() {
        this.huffman = new HuffmanCoding();
        this.currentFile = null;
        this.compressedData = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File input and drag-drop functionality
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const browseLink = document.getElementById('browseLink');
        const uploadContainer = document.getElementById('uploadContainer');

        // Debug: Check if elements exist
        console.log('fileInput:', fileInput);
        console.log('uploadArea:', uploadArea);
        console.log('browseLink:', browseLink);

        if (!fileInput) {
            console.error('fileInput element not found!');
            return;
        }
        if (!uploadArea) {
            console.error('uploadArea element not found!');
            return;
        }
        if (!browseLink) {
            console.error('browseLink element not found!');
            return;
        }

        // File input now covers the entire upload area, so no need for click handlers
        console.log('File input is now covering the upload area - direct clicks should work');

        // File input change
        fileInput.addEventListener('change', (e) => {
            console.log('File input changed:', e.target.files);
            if (e.target.files && e.target.files[0]) {
                console.log('File selected:', e.target.files[0].name);
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // File input is now positioned over the upload area
        console.log('File input positioned over upload area - ready for direct clicks');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileSelect(file);
            }
        });

        // Button event listeners
        document.getElementById('compressBtn').addEventListener('click', () => this.compressFile());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCompressedFile());
        document.getElementById('decompressBtn').addEventListener('click', () => this.testDecompression());
        document.getElementById('newFileBtn').addEventListener('click', () => this.resetApp());
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            'text/plain', 'text/html', 'text/css', 'text/javascript',
            'application/json', 'text/csv', 'text/xml', 'text/markdown'
        ];
        
        const allowedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.md', '.csv', '.xml'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            this.showError('Please select a supported text file (TXT, PY, JS, HTML, CSS, JSON, MD, CSV, XML)');
            return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size too large. Please select a file smaller than 10MB.');
            return;
        }

        this.currentFile = file;
        this.displayFileInfo(file);
    }

    displayFileInfo(file) {
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileInfoSection = document.getElementById('fileInfoSection');

        fileName.textContent = file.name;
        fileSize.textContent = HuffmanCoding.formatFileSize(file.size);

        // Hide other sections
        this.hideAllSections();
        
        // Show file info section
        fileInfoSection.style.display = 'block';
        fileInfoSection.scrollIntoView({ behavior: 'smooth' });
    }

    async compressFile() {
        if (!this.currentFile) return;

        try {
            // Show progress section
            this.hideAllSections();
            const progressSection = document.getElementById('progressSection');
            progressSection.style.display = 'block';
            progressSection.scrollIntoView({ behavior: 'smooth' });

            // Read file content
            const text = await this.readFileAsText(this.currentFile);
            
            // Compress with progress updates
            this.compressedData = await this.huffman.compress(text, (progress, message) => {
                this.updateProgress(progress, message);
            });

            // Show results
            this.displayResults();
        } catch (error) {
            this.showError('Compression failed: ' + error.message);
            console.error('Compression error:', error);
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    updateProgress(progress, message) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';

        // Update step indicators
        if (progress >= 25) this.showStepComplete('step1');
        if (progress >= 50) this.showStepComplete('step2');
        if (progress >= 75) this.showStepComplete('step3');
        if (progress >= 100) this.showStepComplete('step4');
    }

    showStepComplete(stepId) {
        const step = document.getElementById(stepId);
        if (step) {
            step.style.display = 'inline-block';
            step.parentElement.querySelector('span').style.color = '#4caf50';
        }
    }

    displayResults() {
        this.hideAllSections();
        const resultsSection = document.getElementById('resultsSection');
        
        // Update statistics
        document.getElementById('originalSize').textContent = HuffmanCoding.formatFileSize(this.compressedData.originalSize);
        document.getElementById('compressedSize').textContent = HuffmanCoding.formatFileSize(this.compressedData.compressedSize);
        document.getElementById('compressionRatio').textContent = this.compressedData.compressionRatio + '%';

        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    downloadCompressedFile() {
        if (!this.compressedData) return;

        const filename = this.currentFile.name.replace(/\.[^/.]+$/, '') + '.huff';
        const uint8Array = new Uint8Array(this.compressedData.bytes);
        
        HuffmanCoding.downloadFile(uint8Array, filename, 'application/octet-stream');
    }

    async testDecompression() {
        if (!this.compressedData) return;

        try {
            const decompressedText = await this.huffman.decompress(
                this.compressedData.bytes,
                this.compressedData.reverseMapping
            );

            // Create and download decompressed file
            const filename = this.currentFile.name.replace(/\.[^/.]+$/, '') + '_decompressed.txt';
            const blob = new Blob([decompressedText], { type: 'text/plain' });
            
            HuffmanCoding.downloadFile(blob, filename, 'text/plain');
            
            this.showSuccess('Decompression test successful! File downloaded.');
        } catch (error) {
            this.showError('Decompression failed: ' + error.message);
            console.error('Decompression error:', error);
        }
    }

    resetApp() {
        this.currentFile = null;
        this.compressedData = null;
        this.huffman = new HuffmanCoding();
        
        // Reset file input
        document.getElementById('fileInput').value = '';
        
        // Hide all sections except upload
        this.hideAllSections();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    hideAllSections() {
        const sections = [
            'fileInfoSection',
            'progressSection', 
            'resultsSection'
        ];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
    }

    showError(message) {
        // Create a simple error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            ">
                <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    showSuccess(message) {
        // Create a simple success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            ">
                <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FileZipperApp();
});

// Add some additional utility functions
window.FileZipperUtils = {
    // Function to validate file before processing
    validateFile: (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'text/plain', 'text/html', 'text/css', 'text/javascript',
            'application/json', 'text/csv', 'text/xml', 'text/markdown'
        ];
        
        if (file.size > maxSize) {
            return { valid: false, error: 'File size too large. Maximum 10MB allowed.' };
        }
        
        if (!allowedTypes.includes(file.type)) {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            const allowedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.md', '.csv', '.xml'];
            if (!allowedExtensions.includes(extension)) {
                return { valid: false, error: 'Unsupported file type. Please use text files only.' };
            }
        }
        
        return { valid: true };
    },

    // Function to get file icon based on extension
    getFileIcon: (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'txt': 'fas fa-file-alt',
            'py': 'fab fa-python',
            'js': 'fab fa-js-square',
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'json': 'fas fa-code',
            'md': 'fab fa-markdown',
            'csv': 'fas fa-file-csv',
            'xml': 'fas fa-file-code'
        };
        return iconMap[extension] || 'fas fa-file-alt';
    }
};

// Main application JavaScript
class FileZipperApp {
    constructor() {
        this.huffman = new HuffmanCoding();
        this.currentFile = null;
        this.compressedData = null;
        this.currentMode = 'compress'; // 'compress' or 'decompress'
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

        // Mode toggle event listeners
        document.getElementById('compressModeBtn').addEventListener('click', () => this.setMode('compress'));
        document.getElementById('decompressModeBtn').addEventListener('click', () => this.setMode('decompress'));

        // Button event listeners
        document.getElementById('actionBtn').addEventListener('click', () => this.performAction());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadFile());
        document.getElementById('testBtn').addEventListener('click', () => this.testDecompression());
        document.getElementById('newFileBtn').addEventListener('click', () => this.resetApp());
        document.getElementById('cancelBtn').addEventListener('click', () => this.cancelOperation());
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Update mode buttons
        document.getElementById('compressModeBtn').classList.toggle('active', mode === 'compress');
        document.getElementById('decompressModeBtn').classList.toggle('active', mode === 'decompress');
        
        // Update UI elements
        this.updateUIForMode();
        
        // Reset file input
        document.getElementById('fileInput').value = '';
        this.currentFile = null;
        this.compressedData = null;
        this.hideAllSections();
    }

    updateUIForMode() {
        const uploadIcon = document.getElementById('uploadIcon');
        const uploadTitle = document.getElementById('uploadTitle');
        const supportedFormats = document.getElementById('supportedFormats');
        const fileInput = document.getElementById('fileInput');
        const actionIcon = document.getElementById('actionIcon');
        const actionText = document.getElementById('actionText');
        const newFileText = document.getElementById('newFileText');
        const decompressHelp = document.getElementById('decompressHelp');

        if (this.currentMode === 'compress') {
            uploadIcon.className = 'fas fa-cloud-upload-alt';
            uploadTitle.textContent = 'Drop your file here';
            supportedFormats.textContent = 'Supported: TXT, PY, JS, HTML, CSS, JSON, MD, CSV, XML';
            fileInput.accept = '.txt,.py,.js,.html,.css,.json,.md,.csv,.xml';
            actionIcon.className = 'fas fa-compress-alt';
            actionText.textContent = 'Compress File';
            newFileText.textContent = 'Compress Another File';
            decompressHelp.style.display = 'none';
        } else {
            uploadIcon.className = 'fas fa-file-archive';
            uploadTitle.textContent = 'Drop your .huff file here';
            supportedFormats.textContent = 'Supported: HUFF (Huffman compressed files)';
            fileInput.accept = '.huff';
            actionIcon.className = 'fas fa-expand-alt';
            actionText.textContent = 'Decompress File';
            newFileText.textContent = 'Decompress Another File';
            decompressHelp.style.display = 'block';
        }
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file type based on mode
        if (this.currentMode === 'compress') {
            const allowedTypes = [
                'text/plain', 'text/html', 'text/css', 'text/javascript',
                'application/json', 'text/csv', 'text/xml', 'text/markdown'
            ];
            
            const allowedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.md', '.csv', '.xml'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                this.showError('Please select a supported text file (TXT, PY, JS, HTML, CSS, JSON, MD, CSV, XML)');
                // Clear the file input but don't set currentFile
                document.getElementById('fileInput').value = '';
                return;
            }
        } else {
            // Decompress mode - only accept .huff files
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (fileExtension !== '.huff') {
                this.showError('Please select a .huff file (Huffman compressed file)');
                // Clear the file input but don't set currentFile
                document.getElementById('fileInput').value = '';
                return;
            }
            
            // Additional validation for .huff files
            if (file.size < 10) {
                this.showError('File too small to be a valid .huff file');
                // Clear the file input but don't set currentFile
                document.getElementById('fileInput').value = '';
                return;
            }
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size too large. Please select a file smaller than 10MB.');
            // Clear the file input but don't set currentFile
            document.getElementById('fileInput').value = '';
            return;
        }

        this.currentFile = file;
        this.displayFileInfo(file);
    }

    displayFileInfo(file) {
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileIcon = document.getElementById('fileIcon');
        const fileInfoSection = document.getElementById('fileInfoSection');

        fileName.textContent = file.name;
        fileSize.textContent = HuffmanCoding.formatFileSize(file.size);

        // Set appropriate file icon
        if (this.currentMode === 'compress') {
            fileIcon.className = 'fas fa-file-alt';
        } else {
            fileIcon.className = 'fas fa-file-archive';
        }

        // Hide other sections
        this.hideAllSections();
        
        // Show file info section
        fileInfoSection.style.display = 'block';
        fileInfoSection.scrollIntoView({ behavior: 'smooth' });
    }

    async performAction() {
        if (!this.currentFile) return;

        if (this.currentMode === 'compress') {
            await this.compressFile();
        } else {
            await this.decompressFile();
        }
    }

    async compressFile() {
        if (!this.currentFile) return;

        try {
            // Show progress section
            this.hideAllSections();
            const progressSection = document.getElementById('progressSection');
            progressSection.style.display = 'block';
            progressSection.scrollIntoView({ behavior: 'smooth' });

            // Update progress UI for compression
            this.updateProgressUI('compress');

            // Read file content
            const text = await this.readFileAsText(this.currentFile);
            
            // Compress with progress updates
            this.compressedData = await this.huffman.compress(text, (progress, message) => {
                this.updateProgress(progress, message);
            }, this.currentFile.name);

            // Show results
            this.displayResults('compress');
        } catch (error) {
            this.showError('Compression failed: ' + error.message);
            console.error('Compression error:', error);
        }
    }

    async decompressFile() {
        if (!this.currentFile) return;

        try {
            // Show progress section
            this.hideAllSections();
            const progressSection = document.getElementById('progressSection');
            progressSection.style.display = 'block';
            progressSection.scrollIntoView({ behavior: 'smooth' });

            // Update progress UI for decompression
            this.updateProgressUI('decompress');

            // Show cancel button
            document.getElementById('cancelBtn').style.display = 'inline-block';

            // Read the .huff file as ArrayBuffer
            this.updateProgress(10, "Reading compressed file...");
            const arrayBuffer = await this.readFileAsArrayBuffer(this.currentFile);
            const bytes = new Uint8Array(arrayBuffer);

            // Parse the compressed file to extract data and reverse mapping
            this.updateProgress(30, "Parsing metadata...");
            const { compressedBytes, reverseMapping, originalFilename } = this.parseCompressedFile(bytes);

            // Decompress with progress updates
            this.updateProgress(60, "Decoding data...");
            const decompressedText = await this.huffman.decompress(compressedBytes, reverseMapping);

            this.updateProgress(90, "Generating decompressed file...");

            // Store decompressed data
            this.compressedData = {
                decompressedText: decompressedText,
                originalSize: bytes.length,
                decompressedSize: decompressedText.length,
                compressionRatio: ((decompressedText.length - bytes.length) / decompressedText.length * 100).toFixed(2),
                originalFilename: originalFilename
            };

            this.updateProgress(100, "Decompression complete!");

            // Hide cancel button
            document.getElementById('cancelBtn').style.display = 'none';

            // Show results
            this.displayResults('decompress');
        } catch (error) {
            // Hide cancel button
            document.getElementById('cancelBtn').style.display = 'none';
            
            // Show error and allow user to try again
            this.showError('Decompression failed: ' + error.message);
            console.error('Decompression error:', error);
            
            // Reset to file selection but keep the current file
            this.hideAllSections();
            
            // If we still have a file, show the file info section again
            if (this.currentFile) {
                this.displayFileInfo(this.currentFile);
            }
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

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    parseCompressedFile(bytes) {
        try {
            // First, try to find the separator for new format files
            let separatorIndex = -1;
            for (let i = 0; i < bytes.length - 4; i++) {
                if (bytes[i] === 0xFF && bytes[i+1] === 0xFF && bytes[i+2] === 0xFF && bytes[i+3] === 0xFF) {
                    separatorIndex = i;
                    break;
                }
            }

            if (separatorIndex !== -1) {
                // New format with metadata
                const metadataBytes = bytes.slice(0, separatorIndex);
                const metadataString = new TextDecoder().decode(metadataBytes);
                
                let metadata;
                try {
                    metadata = JSON.parse(metadataString);
                } catch (jsonError) {
                    throw new Error('Invalid .huff file format - corrupted metadata');
                }

                // Handle both old and new metadata formats
                let reverseMapping, originalFilename;
                if (metadata.reverseMapping) {
                    // New format with full metadata
                    reverseMapping = metadata.reverseMapping;
                    originalFilename = metadata.originalFilename || 'unknown.txt';
                } else {
                    // Old format with just reverse mapping
                    reverseMapping = metadata;
                    originalFilename = 'unknown.txt';
                }

                const compressedBytes = bytes.slice(separatorIndex + 4);
                
                if (compressedBytes.length === 0) {
                    throw new Error('Invalid .huff file format - no compressed data found');
                }

                return { compressedBytes, reverseMapping, originalFilename };
            } else {
                // Old format - try to decompress without metadata
                // This is a fallback for files created before the metadata update
                throw new Error('This .huff file was created with an older version and cannot be decompressed. Please re-compress the original file with the current version.');
            }
        } catch (error) {
            console.error('Parse error:', error);
            throw new Error('Invalid .huff file format: ' + error.message);
        }
    }

    updateProgressUI(mode) {
        const progressTitle = document.getElementById('progressTitle');
        const step1Text = document.getElementById('step1Text');
        const step2Text = document.getElementById('step2Text');
        const step3Text = document.getElementById('step3Text');
        const step4Text = document.getElementById('step4Text');

        if (mode === 'compress') {
            progressTitle.textContent = 'Compressing...';
            step1Text.textContent = 'Analyzing frequency...';
            step2Text.textContent = 'Building Huffman tree...';
            step3Text.textContent = 'Encoding data...';
            step4Text.textContent = 'Generating compressed file...';
        } else {
            progressTitle.textContent = 'Decompressing...';
            step1Text.textContent = 'Reading compressed file...';
            step2Text.textContent = 'Parsing metadata...';
            step3Text.textContent = 'Decoding data...';
            step4Text.textContent = 'Generating decompressed file...';
        }
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

    displayResults(mode) {
        this.hideAllSections();
        const resultsSection = document.getElementById('resultsSection');
        
        // Update UI elements based on mode
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const stat1Label = document.getElementById('stat1Label');
        const stat2Label = document.getElementById('stat2Label');
        const stat3Label = document.getElementById('stat3Label');
        const stat1Value = document.getElementById('stat1Value');
        const stat2Value = document.getElementById('stat2Value');
        const stat3Value = document.getElementById('stat3Value');
        const downloadIcon = document.getElementById('downloadIcon');
        const downloadText = document.getElementById('downloadText');
        const testBtn = document.getElementById('testBtn');

        if (mode === 'compress') {
            resultIcon.className = 'fas fa-check-circle';
            resultTitle.textContent = 'Compression Complete!';
            stat1Label.textContent = 'Original Size';
            stat2Label.textContent = 'Compressed Size';
            stat3Label.textContent = 'Compression Ratio';
            stat1Value.textContent = HuffmanCoding.formatFileSize(this.compressedData.originalSize);
            stat2Value.textContent = HuffmanCoding.formatFileSize(this.compressedData.compressedSize);
            stat3Value.textContent = this.compressedData.compressionRatio + '%';
            downloadIcon.className = 'fas fa-download';
            downloadText.textContent = 'Download Compressed File';
            testBtn.style.display = 'inline-block';
        } else {
            resultIcon.className = 'fas fa-expand-alt';
            resultTitle.textContent = 'Decompression Complete!';
            stat1Label.textContent = 'Compressed Size';
            stat2Label.textContent = 'Decompressed Size';
            stat3Label.textContent = 'Space Saved';
            stat1Value.textContent = HuffmanCoding.formatFileSize(this.compressedData.originalSize);
            stat2Value.textContent = HuffmanCoding.formatFileSize(this.compressedData.decompressedSize);
            stat3Value.textContent = this.compressedData.compressionRatio + '%';
            downloadIcon.className = 'fas fa-file-alt';
            downloadText.textContent = 'Download Decompressed File';
            testBtn.style.display = 'none';
        }

        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    downloadFile() {
        if (!this.compressedData) return;

        if (this.currentMode === 'compress') {
            // Download compressed file
            const filename = this.currentFile.name.replace(/\.[^/.]+$/, '') + '.huff';
            const uint8Array = new Uint8Array(this.compressedData.bytes);
            HuffmanCoding.downloadFile(uint8Array, filename, 'application/octet-stream');
        } else {
            // Download decompressed file with original filename and MIME type
            const originalFilename = this.compressedData.originalFilename || 'decompressed.txt';
            const mimeType = this.getMimeTypeFromExtension(originalFilename);
            const blob = new Blob([this.compressedData.decompressedText], { type: mimeType });
            HuffmanCoding.downloadFile(blob, originalFilename, mimeType);
        }
    }

    getMimeTypeFromExtension(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'txt': 'text/plain',
            'py': 'text/x-python',
            'js': 'text/javascript',
            'html': 'text/html',
            'css': 'text/css',
            'json': 'application/json',
            'md': 'text/markdown',
            'csv': 'text/csv',
            'xml': 'text/xml'
        };
        return mimeTypes[extension] || 'text/plain';
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

    cancelOperation() {
        // Reset everything
        this.currentFile = null;
        this.compressedData = null;
        this.huffman = new HuffmanCoding();
        
        // Reset file input
        document.getElementById('fileInput').value = '';
        
        // Hide cancel button
        document.getElementById('cancelBtn').style.display = 'none';
        
        // Hide all sections except upload
        this.hideAllSections();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.showSuccess('Operation cancelled. You can now upload a new file.');
    }

    resetApp() {
        this.currentFile = null;
        this.compressedData = null;
        this.huffman = new HuffmanCoding();
        
        // Reset file input
        document.getElementById('fileInput').value = '';
        
        // Hide cancel button
        document.getElementById('cancelBtn').style.display = 'none';
        
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

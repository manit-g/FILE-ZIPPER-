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

        // Click to browse files
        browseLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.addMysticalEffect(browseLink);
            setTimeout(() => fileInput.click(), 300);
        });
        
        uploadArea.addEventListener('click', (e) => {
            e.preventDefault();
            this.addMysticalEffect(uploadArea);
            setTimeout(() => fileInput.click(), 300);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // Enhanced drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('dragover');
            this.addMysticalEffect(uploadArea);
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                this.addMysticalEffect(uploadArea);
                setTimeout(() => this.handleFileSelect(file), 500);
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

        // Add mystical loading effect
        this.showMysticalLoading('Channeling file energy...');

        // Validate file type
        const allowedTypes = [
            'text/plain', 'text/html', 'text/css', 'text/javascript',
            'application/json', 'text/csv', 'text/xml', 'text/markdown'
        ];
        
        const allowedExtensions = ['.txt', '.py', '.js', '.html', '.css', '.json', '.md', '.csv', '.xml'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            this.hideMysticalLoading();
            this.showError('The ancient texts do not recognize this file format. Please use sacred formats: TXT, PY, JS, HTML, CSS, JSON, MD, CSV, XML');
            return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.hideMysticalLoading();
            this.showError('The file\'s energy is too powerful! Please select a file smaller than 10MB.');
            return;
        }

        // Simulate mystical processing
        setTimeout(() => {
            this.hideMysticalLoading();
            this.currentFile = file;
            this.displayFileInfo(file);
            this.showSuccess('File successfully channeled into the mystical realm!');
        }, 1000);
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
        // Create a mystical success notification
        const notification = document.createElement('div');
        notification.className = 'mystical-success-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.9));
                color: white;
                padding: 20px 25px;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
                z-index: 1000;
                max-width: 400px;
                animation: mysticalSlideIn 0.5s ease;
                border: 2px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
            ">
                <i class="fas fa-magic" style="margin-right: 10px; color: #ffd700;"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'mysticalSlideOut 0.5s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, 4000);
    }

    addMysticalEffect(element) {
        // Add mystical particle effect
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #8a2be2, transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                animation: mysticalParticleBurst 1s ease-out forwards;
            `;
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    showMysticalLoading(message) {
        const loading = document.createElement('div');
        loading.id = 'mysticalLoading';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(26, 10, 46, 0.95);
                color: #ffd700;
                padding: 30px 40px;
                border-radius: 20px;
                box-shadow: 0 0 50px rgba(138, 43, 226, 0.5);
                z-index: 2000;
                text-align: center;
                border: 2px solid rgba(138, 43, 226, 0.3);
                backdrop-filter: blur(20px);
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(138, 43, 226, 0.3);
                    border-top: 3px solid #8a2be2;
                    border-radius: 50%;
                    animation: mysticalSpin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <div style="font-family: 'Cinzel', serif; font-size: 1.1rem;">${message}</div>
            </div>
        `;
        
        document.body.appendChild(loading);
    }

    hideMysticalLoading() {
        const loading = document.getElementById('mysticalLoading');
        if (loading) {
            loading.style.animation = 'mysticalFadeOut 0.5s ease';
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }, 500);
        }
    }
}

// Add CSS animations for mystical effects
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
    
    @keyframes mysticalSlideIn {
        from {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
        }
        to {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes mysticalSlideOut {
        from {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        to {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes mysticalParticleBurst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(var(--end-x) - var(--start-x)), calc(var(--end-y) - var(--start-y))) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes mysticalSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes mysticalFadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
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

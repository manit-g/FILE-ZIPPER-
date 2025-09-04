// Huffman Coding Implementation in JavaScript
class HuffmanCoding {
    constructor() {
        this.heap = [];
        this.codes = {};
        this.reverseMapping = {};
    }

    // Heap Node class for Huffman tree
    class HeapNode {
        constructor(char, freq) {
            this.char = char;
            this.freq = freq;
            this.left = null;
            this.right = null;
        }

        // Comparator for heap operations
        lessThan(other) {
            return this.freq < other.freq;
        }

        equals(other) {
            if (other === null) return false;
            if (!(other instanceof this.constructor)) return false;
            return this.freq === other.freq;
        }
    }

    // Create frequency dictionary from text
    makeFrequencyDict(text) {
        const frequency = {};
        for (let i = 0; i < text.length; i++) {
            const character = text[i];
            if (!frequency[character]) {
                frequency[character] = 0;
            }
            frequency[character]++;
        }
        return frequency;
    }

    // Create min heap from frequency dictionary
    makeHeap(frequency) {
        this.heap = [];
        for (const key in frequency) {
            const node = new this.HeapNode(key, frequency[key]);
            this.heap.push(node);
        }
        this.heap.sort((a, b) => a.freq - b.freq);
    }

    // Merge nodes to build Huffman tree
    mergeNodes() {
        while (this.heap.length > 1) {
            const node1 = this.heap.shift();
            const node2 = this.heap.shift();

            const merged = new this.HeapNode(null, node1.freq + node2.freq);
            merged.left = node1;
            merged.right = node2;

            this.heap.push(merged);
            this.heap.sort((a, b) => a.freq - b.freq);
        }
    }

    // Helper function to generate codes recursively
    makeCodesHelper(root, currentCode) {
        if (root === null) return;

        if (root.char !== null) {
            this.codes[root.char] = currentCode;
            this.reverseMapping[currentCode] = root.char;
            return;
        }

        this.makeCodesHelper(root.left, currentCode + "0");
        this.makeCodesHelper(root.right, currentCode + "1");
    }

    // Generate Huffman codes
    makeCodes() {
        const root = this.heap[0];
        const currentCode = "";
        this.makeCodesHelper(root, currentCode);
    }

    // Encode text using generated codes
    getEncodedText(text) {
        let encodedText = "";
        for (let i = 0; i < text.length; i++) {
            encodedText += this.codes[text[i]];
        }
        return encodedText;
    }

    // Pad encoded text to make it divisible by 8
    padEncodedText(encodedText) {
        const extraPadding = 8 - (encodedText.length % 8);
        for (let i = 0; i < extraPadding; i++) {
            encodedText += "0";
        }

        const paddedInfo = extraPadding.toString(2).padStart(8, '0');
        encodedText = paddedInfo + encodedText;
        return encodedText;
    }

    // Convert binary string to byte array
    getByteArray(paddedEncodedText) {
        if (paddedEncodedText.length % 8 !== 0) {
            throw new Error("Encoded text not padded properly");
        }

        const bytes = [];
        for (let i = 0; i < paddedEncodedText.length; i += 8) {
            const byte = paddedEncodedText.substr(i, 8);
            bytes.push(parseInt(byte, 2));
        }
        return bytes;
    }

    // Main compression function
    compress(text, progressCallback = null) {
        return new Promise((resolve, reject) => {
            try {
                // Step 1: Frequency analysis
                if (progressCallback) progressCallback(10, "Analyzing frequency...");
                const frequency = this.makeFrequencyDict(text);
                
                // Step 2: Build heap
                if (progressCallback) progressCallback(25, "Building Huffman tree...");
                this.makeHeap(frequency);
                
                // Step 3: Merge nodes
                this.mergeNodes();
                
                // Step 4: Generate codes
                if (progressCallback) progressCallback(50, "Generating codes...");
                this.makeCodes();
                
                // Step 5: Encode text
                if (progressCallback) progressCallback(75, "Encoding data...");
                const encodedText = this.getEncodedText(text);
                const paddedEncodedText = this.padEncodedText(encodedText);
                
                // Step 6: Create byte array
                if (progressCallback) progressCallback(90, "Creating compressed file...");
                const bytes = this.getByteArray(paddedEncodedText);
                
                if (progressCallback) progressCallback(100, "Compression complete!");
                
                // Create compressed data object
                const compressedData = {
                    bytes: bytes,
                    originalSize: text.length,
                    compressedSize: bytes.length,
                    compressionRatio: ((text.length - bytes.length) / text.length * 100).toFixed(2),
                    codes: this.codes,
                    reverseMapping: this.reverseMapping
                };
                
                resolve(compressedData);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Remove padding from encoded text
    removePadding(paddedEncodedText) {
        const paddedInfo = paddedEncodedText.substr(0, 8);
        const extraPadding = parseInt(paddedInfo, 2);
        
        const encodedText = paddedEncodedText.substr(8);
        return encodedText.substr(0, encodedText.length - extraPadding);
    }

    // Decode text using reverse mapping
    decodeText(encodedText) {
        let currentCode = "";
        let decodedText = "";

        for (let i = 0; i < encodedText.length; i++) {
            currentCode += encodedText[i];
            if (this.reverseMapping[currentCode]) {
                decodedText += this.reverseMapping[currentCode];
                currentCode = "";
            }
        }

        return decodedText;
    }

    // Decompress function
    decompress(bytes, reverseMapping) {
        return new Promise((resolve, reject) => {
            try {
                // Convert bytes to bit string
                let bitString = "";
                for (let i = 0; i < bytes.length; i++) {
                    const bits = bytes[i].toString(2).padStart(8, '0');
                    bitString += bits;
                }

                // Remove padding
                const encodedText = this.removePadding(bitString);

                // Set reverse mapping
                this.reverseMapping = reverseMapping;

                // Decode text
                const decompressedText = this.decodeText(encodedText);

                resolve(decompressedText);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Utility function to format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Utility function to create download link
    static downloadFile(data, filename, mimeType = 'application/octet-stream') {
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HuffmanCoding;
}

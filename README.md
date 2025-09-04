# 🗜️ File Zipper - Huffman Compression Web App

A beautiful, modern web application for file compression using the Huffman coding algorithm. Upload your text files and compress them with significant size reduction while maintaining perfect data integrity.

## ✨ Features

- **🎨 Modern UI/UX**: Beautiful, responsive design with smooth animations
- **📁 Drag & Drop**: Easy file upload with drag-and-drop functionality
- **⚡ Client-Side Processing**: All compression happens in your browser - no server uploads
- **📊 Real-Time Progress**: Visual progress indicators during compression
- **📈 Compression Stats**: Detailed statistics showing compression ratio and file sizes
- **🔒 Privacy-First**: Your files never leave your device
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🧪 Decompression Test**: Verify compression integrity with built-in decompression

## 🚀 Live Demo

**🌐 [https://filezipperbymg.netlify.app/](https://filezipperbymg.netlify.app/)**

Experience the power of Huffman compression with our live web application!

## 🛠️ How It Works

### Huffman Compression Algorithm
1. **Frequency Analysis**: Analyzes character frequency in your file
2. **Tree Construction**: Builds optimal binary tree based on frequencies
3. **Code Generation**: Creates shortest codes for most frequent characters
4. **Encoding**: Replaces characters with optimal binary codes
5. **Compression**: Generates compressed binary file

### Supported File Types
- `.txt` - Text files
- `.py` - Python scripts
- `.js` - JavaScript files
- `.html` - HTML documents
- `.css` - Stylesheets
- `.json` - JSON data
- `.md` - Markdown files
- `.csv` - CSV data
- `.xml` - XML documents


## 🎯 Usage

1. **Open the web application**
2. **Upload a file** by:
   - Clicking "browse to choose a file"
   - Dragging and dropping a file onto the upload area
3. **Click "Compress File"** to start compression
4. **View compression statistics** and download the compressed file
5. **Test decompression** to verify data integrity

## 📊 Performance

- **Compression Ratio**: Typically 30-60% size reduction for text files
- **Processing Speed**: Real-time compression for files up to 10MB
- **Browser Support**: Works in all modern browsers
- **File Size Limit**: 10MB maximum file size

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and file API
- **CSS3**: Modern styling with Flexbox/Grid and animations
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **Huffman Algorithm**: Custom implementation for optimal compression

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### File Structure
```
file-zipper/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # Main application logic
├── huffman.js          # Huffman algorithm implementation
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #4caf50;
  --error-color: #f44336;
}
```

### Adding File Types
Modify the `allowedTypes` array in `script.js`:
```javascript
const allowedTypes = [
    'text/plain', 'text/html', 'text/css', 'text/javascript',
    'application/json', 'text/csv', 'text/xml', 'text/markdown',
    'your/new/type'  // Add new types here
];
```


- Ensure your file is under 10MB and in a supported format

---

**Made with ❤️ for efficient file compression**
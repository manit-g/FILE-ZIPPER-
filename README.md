# 🗜️ File Zipper - Huffman Compression Tool

A comprehensive file compression solution featuring both web and command-line interfaces using the Huffman coding algorithm. Choose between a beautiful browser-based application or powerful terminal commands for file compression with 40-60% size reduction while maintaining perfect data integrity.

## ✨ Features

### 🌐 Web Interface
- **🎨 Modern UI/UX**: Beautiful, responsive design with smooth animations
- **📁 Drag & Drop**: Easy file upload with drag-and-drop functionality
- **⚡ Client-Side Processing**: All compression happens in your browser - no server uploads
- **📊 Real-Time Progress**: Visual progress indicators during compression
- **📈 Compression Stats**: Detailed statistics showing compression ratio and file sizes
- **🔒 Privacy-First**: Your files never leave your device
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🧪 Decompression Test**: Verify compression integrity with built-in decompression

### 💻 Command-Line Interface (CLI)
- **🖥️ Terminal-Based**: Compress/decompress files directly from command line
- **⚙️ Argparse Integration**: Professional CLI with `--help`, custom output paths, and more
- **📊 Compression Statistics**: Real-time stats showing original/compressed sizes and ratio
- **🚀 Batch Processing**: Automate compression workflows for multiple files
- **🪟 Windows Batch Files**: Drag-and-drop `.bat` files for zero-command compression
- **🛠️ Error Handling**: Comprehensive validation and user-friendly error messages

**📖 [CLI Documentation](README_CLI.md)** - Complete guide for terminal usage

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

### 🌐 Web Interface (Browser-Based)
1. **Visit** [https://filezipperbymg.netlify.app/](https://filezipperbymg.netlify.app/)
2. **Upload a file** by:
   - Clicking "browse to choose a file"
   - Dragging and dropping a file onto the upload area
3. **Click "Compress File"** to start compression
4. **View compression statistics** and download the compressed file
5. **Test decompression** to verify data integrity

### 💻 Command-Line Interface (Terminal)

**Quick Start:**
```bash
# Compress a file
python useHuffman.py compress yourfile.txt

# Decompress a file
python useHuffman.py decompress yourfile.bin

# Get help
python useHuffman.py --help
```

**Windows Drag & Drop:**
- Drag any `.txt` file onto `compress.bat` to compress
- Drag any `.bin` file onto `decompress.bat` to decompress

**📖 See [CLI Documentation](README_CLI.md) for complete terminal usage guide**

## 📊 Performance

- **Compression Ratio**: Typically 30-60% size reduction for text files
- **Processing Speed**: Real-time compression for files up to 10MB
- **Browser Support**: Works in all modern browsers
- **File Size Limit**: 10MB maximum file size

## 🔧 Technical Details

### Technologies Used

**Web Interface:**
- **HTML5**: Semantic markup and file API
- **CSS3**: Modern styling with Flexbox/Grid and animations
- **Vanilla JavaScript**: No frameworks, pure JavaScript
- **Netlify**: Static site hosting with CDN and continuous deployment

**CLI Interface:**
- **Python 3.x**: Core language for CLI implementation
- **argparse**: Command-line argument parsing
- **heapq**: Priority queue for Huffman tree construction
- **Windows Batch Scripts**: `.bat` files for drag-and-drop automation

**Algorithm:**
- **Huffman Coding**: Custom implementation for optimal lossless compression

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### File Structure
```
FILE-ZIPPER/
├── 🌐 Web Interface (Netlify Deployment)
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styling and animations
│   ├── script.js           # Main application logic
│   ├── huffman.js          # Huffman algorithm (JavaScript)
│   └── netlify.toml        # Netlify configuration
│
├── 💻 CLI Interface (Local/Terminal)
│   ├── huffman.py          # Huffman algorithm (Python)
│   ├── useHuffman.py       # CLI with argparse
│   ├── compress.bat        # Windows batch file (compress)
│   └── decompress.bat      # Windows batch file (decompress)
│
├── 📄 Documentation
│   ├── README.md           # Main documentation (this file)
│   └── README_CLI.md       # CLI usage guide
│
└── ⚙️ Configuration
    └── .gitignore          # Git ignore rules
```



## 🚀 Deployment

### 🌐 Web Interface Deployment (Netlify)
The web interface is automatically deployed to Netlify via GitHub integration:

1. **Live URL**: https://filezipperbymg.netlify.app/
2. **Continuous Deployment**: Auto-deploys on every push to `main` branch
3. **CDN Distribution**: Global content delivery for fast access worldwide
4. **HTTPS**: Secure SSL certificate included

### 💻 CLI Local Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/manit-g/FILE-ZIPPER-.git
   cd FILE-ZIPPER-
   ```

2. Use the CLI:
   ```bash
   python useHuffman.py compress yourfile.txt
   ```

3. Or use batch files (Windows):
   - Drag files onto `compress.bat` or `decompress.bat`

**No external dependencies required** - uses Python standard library only!

## 🛠️ Development

### Adding File Types (Web Interface)
Modify the `allowedTypes` array in `script.js`:
```javascript
const allowedTypes = [
    'text/plain', 'text/html', 'text/css', 'text/javascript',
    'application/json', 'text/csv', 'text/xml', 'text/markdown',
    'your/new/type'  // Add new types here
];
```

### CLI Development
The CLI is built with Python 3 and uses only standard library modules:
- `argparse` - Command-line parsing
- `heapq` - Priority queue for Huffman tree
- `os` - File operations
- `sys` - System operations

## 📝 License

Open source project - feel free to use and modify!

---

**Created by MG** | [Live Demo](https://filezipperbymg.netlify.app/) | [CLI Guide](README_CLI.md)


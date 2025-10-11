# File Zipper - CLI Usage Guide

**🌐 Web Version:** https://filezipperbymg.netlify.app/

---

## 🚀 Quick Start (3 Ways to Use)

### Method 1: Drag & Drop (Easiest!)
**How it works:** Open File Explorer, go to the project folder, then drag your file onto the batch file.

1. **To Compress**: 
   - Open `C:\Users\HP\Downloads\FILE-ZIPPER--main\FILE-ZIPPER--main` in File Explorer
   - Drag any `.txt` file onto `compress.bat`
   - A window opens showing the result - file is compressed!

2. **To Decompress**: 
   - Drag any `.bin` file onto `decompress.bat`
   - Window opens - file is decompressed!

**Note:** This is NOT the website. You use these in your computer's File Explorer (Windows folders).

### Method 2: Command Line (Quick)
```bash
# Navigate to project folder (do this once)
cd "C:\Users\HP\Downloads\FILE-ZIPPER--main\FILE-ZIPPER--main"

# Compress a file
python useHuffman.py compress yourfile.txt

# Decompress a file
python useHuffman.py decompress yourfile.bin
```

### Method 3: With Custom Output
```bash
# Compress with custom output name
python useHuffman.py compress input.txt -o output.bin

# Decompress with custom output name
python useHuffman.py decompress input.bin -o restored.txt
```

## 📖 Commands Reference

### Compress
```bash
python useHuffman.py compress <input_file> [-o <output_file>]
```
- `<input_file>`: File to compress (required)
- `-o <output_file>`: Custom output path (optional)

### Decompress
```bash
python useHuffman.py decompress <input_file> [-o <output_file>]
```
- `<input_file>`: File to decompress (required)
- `-o <output_file>`: Custom output path (optional)

### Help
```bash
python useHuffman.py --help
python useHuffman.py compress --help
python useHuffman.py decompress --help
```

## 📊 What You Get

When you compress a file, you'll see:
```
[SUCCESS] Compression successful!
  Input file:      sample.txt
  Output file:     sample.bin
  Original size:   715332 bytes
  Compressed size: 394017 bytes
  Compression:     44.92%
```

## 🎯 Examples

**Example 1: Compress a document**
```bash
python useHuffman.py compress document.txt
# Creates: document.bin
```

**Example 2: Compress with custom name**
```bash
python useHuffman.py compress log.txt -o backup.bin
# Creates: backup.bin
```

**Example 3: Decompress a file**
```bash
python useHuffman.py decompress document.bin
# Creates: document_decompressed.txt
```

**Example 4: Decompress to specific location**
```bash
python useHuffman.py decompress backup.bin -o restored_log.txt
# Creates: restored_log.txt
```

## ❓ FAQ

**Q: Do I need to navigate to the folder every time?**
A: Only once per terminal session. After that, just run the commands.

**Q: Can I compress any file type?**
A: Currently optimized for text files (.txt). Binary files work but may not compress well.

**Q: Where is the output saved?**
A: By default, in the same directory as the input file. Use `-o` to specify a different location.

**Q: What if I get an error?**
A: Make sure:
  - Python is installed
  - You're in the correct directory
  - The input file exists
  - You have write permissions

## 🌐 Web Interface

Don't want to use the command line? Use the web interface instead:
- **Visit:** https://filezipperbymg.netlify.app/
- Drag and drop files in the browser
- No installation needed!
- Works on any device (Windows, Mac, Linux, Mobile)

## 🛠️ Technical Details

- **Algorithm**: Huffman Coding
- **Language**: Python 3.x
- **Dependencies**: None (uses Python standard library)
- **Compression**: Typically 30-50% reduction for text files


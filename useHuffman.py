#!/usr/bin/env python3
"""
File Zipper - Huffman Encoding CLI
Compress and decompress files using Huffman coding algorithm
"""

from huffman import HuffmanCoding
import argparse
import sys
import os


def compress_file(input_path, output_path=None):
    """Compress a file using Huffman coding"""
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' does not exist.")
        sys.exit(1)
    
    try:
        h = HuffmanCoding(input_path)
        compressed_path = h.compress()
        
        # If custom output path is specified, rename the file
        if output_path:
            os.rename(compressed_path, output_path)
            compressed_path = output_path
        
        # Calculate compression ratio
        original_size = os.path.getsize(input_path)
        compressed_size = os.path.getsize(compressed_path)
        ratio = (1 - compressed_size / original_size) * 100
        
        print(f"[SUCCESS] Compression successful!")
        print(f"  Input file:      {input_path}")
        print(f"  Output file:     {compressed_path}")
        print(f"  Original size:   {original_size} bytes")
        print(f"  Compressed size: {compressed_size} bytes")
        print(f"  Compression:     {ratio:.2f}%")
        
    except Exception as e:
        print(f"Error during compression: {e}")
        sys.exit(1)


def decompress_file(input_path, output_path=None):
    """Decompress a file using Huffman coding"""
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' does not exist.")
        sys.exit(1)
    
    try:
        # For decompression, we need the original file path (without .bin extension)
        # to create the HuffmanCoding object, but we'll use input_path for decompression
        base_name = input_path.replace('.bin', '')
        h = HuffmanCoding(base_name)
        decompressed_path = h.decompress(input_path)
        
        # If custom output path is specified, rename the file
        if output_path:
            os.rename(decompressed_path, output_path)
            decompressed_path = output_path
        
        decompressed_size = os.path.getsize(decompressed_path)
        compressed_size = os.path.getsize(input_path)
        
        print(f"[SUCCESS] Decompression successful!")
        print(f"  Input file:        {input_path}")
        print(f"  Output file:       {decompressed_path}")
        print(f"  Compressed size:   {compressed_size} bytes")
        print(f"  Decompressed size: {decompressed_size} bytes")
        
    except Exception as e:
        print(f"Error during decompression: {e}")
        sys.exit(1)


def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description='File Zipper - Compress and decompress files using Huffman coding',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  Compress a file:
    python useHuffman.py compress input.txt
    python useHuffman.py compress input.txt -o output.bin
  
  Decompress a file:
    python useHuffman.py decompress input.bin
    python useHuffman.py decompress input.bin -o output.txt
        '''
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    subparsers.required = True
    
    # Compress command
    compress_parser = subparsers.add_parser('compress', help='Compress a file')
    compress_parser.add_argument('input', help='Input file to compress')
    compress_parser.add_argument('-o', '--output', help='Output file path (optional)', default=None)
    
    # Decompress command
    decompress_parser = subparsers.add_parser('decompress', help='Decompress a file')
    decompress_parser.add_argument('input', help='Input file to decompress')
    decompress_parser.add_argument('-o', '--output', help='Output file path (optional)', default=None)
    
    args = parser.parse_args()
    
    # Execute the appropriate command
    if args.command == 'compress':
        compress_file(args.input, args.output)
    elif args.command == 'decompress':
        decompress_file(args.input, args.output)


if __name__ == '__main__':
    main()
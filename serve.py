#!/usr/bin/env python3
"""
============================================================================
AEGIS ENDLESS - LOCAL WEB SERVER & GAME LAUNCHER
============================================================================
Launches a local HTTP server and automatically opens the game and art studio
in your default browser. No third-party dependencies required.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import threading
import time

DEFAULT_PORT = 8000

def find_available_port(start_port=DEFAULT_PORT, max_attempts=50):
    """Finds an available TCP port starting from start_port."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', port)) != 0:
                return port
    return start_port

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching during local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Clean request logger
        sys.stdout.write(f"[{time.strftime('%H:%M:%S')}] {args[0]} {args[1]}\n")

def open_browser(url):
    """Opens browser after brief delay to ensure server is listening."""
    time.sleep(0.5)
    print(f"\n🚀 Opening Aegis Endless in your default browser: {url}\n")
    webbrowser.open(url)

def main():
    # Ensure current working directory is the project directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    port = find_available_port(DEFAULT_PORT)
    url = f"http://localhost:{port}/index.html"
    editor_url = f"http://localhost:{port}/sprite-editor.html"

    print("=" * 65)
    print("   ⚔️  AEGIS ENDLESS - LOCAL HTTP SERVER & ART STUDIO  ⚔️")
    print("=" * 65)
    print(f" • Project Directory: {script_dir}")
    print(f" • Game URL:          {url}")
    print(f" • Art Studio URL:    {editor_url}")
    print("=" * 65)
    print(" Press Ctrl+C at any time in this window to stop the server.")
    print("=" * 65)

    # Launch browser in a background thread
    threading.Thread(target=open_browser, args=(url,), daemon=True).start()

    # Start Server
    handler = CustomHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user. Goodbye!")
            try:
                httpd.server_close()
            except Exception:
                pass
            sys.exit(0)

if __name__ == '__main__':
    main()

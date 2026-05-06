import http.server
import socketserver

PORT = 8002

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Додаємо заголовки кешування для зображень (1 рік)
        if self.path.endswith(('.jpg', '.jpeg', '.png', '.webp', '.mp4', '.vtt')):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        
        # Для HTML вимикаємо кешування, щоб бачити зміни миттєво
        if self.path.endswith(('.html')):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            
        super().end_headers()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Сервер для Lighthouse запущено на порту {PORT}")
    print(f"Відкрийте: http://localhost:{PORT}/")
    httpd.serve_forever()

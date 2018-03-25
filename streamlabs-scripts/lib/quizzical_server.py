
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from json import dumps


def default_add_points_handler(data, request_handler):
    print(data)


def default_ping_handler():
    pass


add_points_handler = default_add_points_handler
ping_handler = default_ping_handler


class S(BaseHTTPRequestHandler):
    def _set_headers(self, response_code=200, content_type='application/json'):
        self.send_response(response_code)
        self.send_header('Content-type', content_type)
        self.end_headers()

    def _404(self):
        self.reply({'success': False, 'message': 'Invalid endpoint'}, response_code=404)

    def _write(self, data):
        self.wfile.write(dumps(data))

    def reply(self, data, response_code=200):
        self._set_headers(response_code=response_code)
        self._write(data)

    def do_GET(self):
        if self.path.lower() != '/ping':
            self._404()
            ping_handler()
            return

        self.reply({'success': True, 'message': 'Hi there'})

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        if self.path.lower() != '/add_points':
            self._404()

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        add_points_handler(post_data, self)


def start_http_server(on_add_points=default_add_points_handler, on_ping=default_ping_handler, server_class=HTTPServer,
                      handler_class=S, port=23120):
    global add_points_handler
    add_points_handler = on_add_points

    global ping_handler
    ping_handler = on_ping

    server_address = ('127.0.0.1', port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == '__main__':
    start_http_server()

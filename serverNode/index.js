const http = require('http');

// Định nghĩa cổng
const port = 5000;

// Tạo server
const server = http.createServer((req, res) => {
  // Đặt tiêu đề HTTP
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  // Tạo một đối tượng JSON
  const responseObject = {
    message: 'Hello, World!',
    success: true,
  };

  // Trả về chuỗi JSON
  res.end(JSON.stringify(responseObject));
});

// Khởi động server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


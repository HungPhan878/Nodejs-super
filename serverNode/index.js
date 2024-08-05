const express = require('express');
const app = express();
const port = 4000; // Bạn có thể chọn bất kỳ cổng nào khác nếu muốn

// Định nghĩa một route cơ bản
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/user', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  // Tạo một đối tượng JSON
  const responseObject = {
    hi: 'HELLO, World!',
    name: 'Hung',
  };

  // Trả về chuỗi JSON
  res.end(JSON.stringify(responseObject));
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

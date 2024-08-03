## Local và Global install:
+ Nên cài đặt package local sẽ tiện hơn  vì chỉ cần sử dụng trong dự án của chúng ta thì cài thôi và có trong dev hoặc devdepen thì khi đưa file package-lock.json lên github khi người khác tải về sẽ có các thư viện của chúng ta để họ sử dụng luôn.
## Nodemon:
+ Định nghĩa: là thư viện giúp vscode refresh file mỗi  lần chúng ta thay đổi code.
## semantic version:
+ Major(thư viện có sự thay đổi lớn và có cấu trúc khác với phiên bản trước).Minor(chỉ update thêm các tính năng mới).Patch(chỉ sử lỗi các tính năng đã có)
 ex: 7.1.0 phiên bản 7, đã cập nhật thêm tính năng mới lần đầu, chưa sửa lỗi
## NPM update:
+ Cài npm install nodemon@2.0.2
+ Cài npm-check-updates vào global
+ Vào folder có các package cần update nhấn ncu để xem
+ Lên thư viện hay framework cần update đọc hiểu để cài phiên bản cho đúng với code chung ta đã dùng từ trước để đỡ bị lỗi
+ Nhấn ncu -u cập nhật trong package.json để npm thấy và cài
+ Nhấn npm install để applay thư viện mới nhất vào folder chúng ta và cập nhật lên package-lock.js
## Giải thích package:
+ Package-lock là hiển thị chi tiết version và sự phụ thuộc của sự phụ thuộc của các gói packages
+ Package.json hiển thị các version của các gói sử dụng trong dự án của chúng ta thôi để khi npm i thì sẽ nhin vào đó để cài thư viện.
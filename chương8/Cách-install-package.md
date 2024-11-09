## Khi nào nên cài ở devdependency hay dependency:

### Cài ở devdependency:

- Khi chỉ dùng trong env developer ở production không cần.
- Công cụ hỗ trợ phát triển thôi

### Cài ở dependency:

- Ở production cần và các chức năng trong dự án cần thư viện đó, hay framework.

## Cài ở global và local:

### Global:

- Khi công cụ cần dùng ở tất cả dự án : -g

### local:

- Thư viện hay framework chỉ dùng trong dự án đấy thôi -> nên cài hơn vì khai code khác tải code mình về thì vẫn có thư viện ấy sử dụng khỏi tốn công cài lại.

## Cách update thư viện coi ở bài 44 nodejs:

- Dùng plugin : npm i -g npm-check-updates
- Gõ ncu: kiểm tra các thử viện trong dự án của mình dùng phiên bản nào đã cữ thì nó sẽ nhấn mạnh và hiển thị các phiên bản mới cần update
- Gõ ncu tên-thư-viên-cần-update -u :update trong package.json
- Gõ npm i để cập nhật trong package-lock.json

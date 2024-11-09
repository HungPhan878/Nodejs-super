- Có 5 quy tắc chính đã nói trên blog và 2 quy tắc mình thêm vào.
- Các quy tắc bổ sung:

1. quan hệ các bảng:

- 1-1, 1-ít(<=100) thì ưu tiên dùng nhúng
- trên 100 < dùng array objectid <=1000
- > 1000 ở phía nhiều ta đặt khóa ngoại ở nhiều đến khóa chính ở bảng có 1 dữ liệu.

2. nhiều nhiều và ít nhiều thì tham chiếu lẫn nhau và theo dạng array objectid

Lưu ý : khi học xong nodejs thì cân nhắc về mua khóa deploy đó nha. chưa cần thiết lắm nếu cần thiết hay gần cần thiết sẽ mua sau.
Còn khóa nestjs thì công ty thực sự cần thì mới mua học thôi nha.

3. Khi phân tích xong db thì nên môhinh hóa nó lại bằng figma:
   ví dụ: mô hình hóa figma url : https://www.figma.com/board/Nw20b51Zw44KLOjEUcoYXT/Untitled?node-id=0-1&node-type=canvas&t=9gkA7uWERo4vsO1R-0

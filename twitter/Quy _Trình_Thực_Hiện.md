## Logic đã có ở trên figma

## Description thêm các bước thêm một chức năng hay collection:

1. thêm schema(interface, class) cho collector đó.
2. Vào db.ts kết nối với collection đó.
3. sử dụng collection vừa kết nối cho đúng như thêm vào bên user.services hay bên controller

## Cấu trúc checkSchema:

1. Gồm hai đối số truyền vào:

```javascript

checkSchema({Các rule}, ['body','headers',...]),


```

- tham số thứ nhất là các rules quy định nên check fields nào.
- Tham số thứ hai là nên check các request nào như check ở body hay headers nếu không truyền sẽ check tất cả

## TypeScript:

1. Đây là đn type cho mỗi trường khác nhau:

- Trong file type.d.ts là đn type cho req luôn thêm thuộc tính mới và type cho thuộc tính đó.
- Trong đoạn này

```TypeScript
 req: Request<ParamsDictionary, any, RegisterBodyReq>
```

Chỉ định nghĩa cho type các thuộc tính trong req.body thôi nha

## Jwt Authentication:

1. Không nên dùng chung sêcret key cho ACCESS_TOKEN and REFRESH_TOKEN:

- Lí do bảo mật
- Hacker có thể dùng refresh token thay cho access token để truy cập

## Update time thực:

Khi ta update lên trên mongo và tạo time cho trường update_at
thì có hai trường hợp:

1. Tạo time khi vừa update_at:
   Dùng new Date()

2. Để mongo tự update time:
   Dùng $$NOW hay $current_time

## Note:

1. Không cần phải kiểm tra các token gửi lên và lưu trong db có giống nhau hay không vì

- Đã có hàm verifyToken xác thực chính xác
- Dùng id trong access-token hay ... tìm user ấy rồi

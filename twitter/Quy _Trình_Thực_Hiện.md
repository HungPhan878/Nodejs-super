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

## Lưu ý:

1. Đối với forgot password khi bấm vào link xác thực verify forgot password thì không nên xóa forgot password token liền: để user đổi mk rồi hãy xóa vì như vậy sẽ tăng trải nghiêm người dùng tốt hơn khi người dùng click vào link nhưng chưa đổi lần sau click lại đổi vẫn được ok nha.

## MongoDB schema validation:

Là giúp ta validate tại tầng mongodb khi chúng ta đưa dữ liệu vào mongodb vì middleware là validate tại tầng app mà thôi điều này sẽ tránh việc dư thừa dữ liệu và không thiếu những trường bắt buộc. Nếu lỗi sẽ trả về 500 và message lỗi (hãy tập đọc lỗi điềm tĩnh hơn nha)

### Lưu ý:

1. additionalProperties: false -> giúp ta thêm đúng dư liệu trong properties và không bị thừa data (nhưng bắt buộc phải khai báo trường \_id).
2. required: giúp ta thêm các properties bắt buộc phải có.
3. kiểu enum thì khai báo số là được và thêm key 'enum': [1,2,3, ...] chỉ các số quy đinh trong trường enum là có thôi.

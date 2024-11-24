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

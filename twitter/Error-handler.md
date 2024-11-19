## Vì sao phải trả về như thế này:

```javascript
import { Request, Response, NextFunction, RequestHandler } from 'express'
export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
```

### Giải thích:

- Vì bên trong router.post() phải là các request handler nên chúng ta muốn dùng hàm bao bọc nó để dùng trong một chức năng gì đó thì phải trả về hàm như vậy
- mà chúng ra không thể return về await được phải return về async nhưng try catch chỉ dùng được khi bên trong hàm promise và có sử dụng await mà thôi
- Chỉ nên try catch ở function ngoài cùng promise vì như thế là bắt lỗi đúng
- Đúng cú pháp async/await: Hàm async trong try-catch đảm bảo rằng mọi lỗi bất đồng bộ được bắt (catch).
- Đúng với cơ chế middleware của Express: Middleware của Express cần nhận các tham số (req, res, next) khi được gọi. Cách ban đầu đảm bảo hàm gốc (func) nhận đủ tham số này.

## Đối với các res phản hổi về người dùng thì nếu không có logic gì phía sau thì không cần return nha.

## Middleware:

### Lưu ý:

1. có bao nhiêu middleware trong router.user(m1, m2) đều được
2. Trong function handler of middleware phải có next() để có thể sang hàm m2 và xuống các router khác

```javascript
import { Router } from 'express'

const userRouter = Router()

userRouter.use((req, res, next) => {
  console.log('Middlware 1')
  next()
})

userRouter.get('/tweet', (req, res) => {
  res.send('Hello World, Twitter!')
})

export default userRouter
```

3. có next rồi sẽ qua hàm khác nhưng dòng lệnh bên dưới nó vẫn chạy, chỉ khi return thi mới hết chạy thôi cho dù đã res.json thì lệnh bên dưới trong cùng một hàm vẫn run nha:

```javascript
userRouter.use((req, res, next) => {
  console.log('Middlware 1')
  next()
  console.log('vẫn chạy khi có next')
})
```

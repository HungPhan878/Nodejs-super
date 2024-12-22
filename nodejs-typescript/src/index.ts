import express from 'express'
import { sum } from './utils'

const app = express()
const port = 4000 // Bạn có thể chọn bất kỳ cổng nào khác nếu muốn

// Định nghĩa một route cơ bản
app.get('/', (req, res) => {
  const data: any = null
  const value = sum(data)
  res.send('Hello World!')
})

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

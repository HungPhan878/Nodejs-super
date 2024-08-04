## Cách sử lý khi bị trùng port:

### C1: Tắt cổng đang mở bị trùng 4000 để mở cổng ta cần dùng.

### C2: nếu c1 không hiểu thì ta dùng git bash

         + Gõ netstat -ano | findstr :<port> kiểm tra port ta cần dùng
         + Gõ  taskkill //PID <PID> //F : pid của port không cần tắt đi là ok bật port ta cần dùng lên thôi

# Logic đã có ở trên figma

## Logic khi làm forgot password token:

1. Đối với forgot password khi bấm vào link xác thực verify forgot password thì không nên xóa forgot password token liền: để user đổi mk rồi hãy xóa vì như vậy sẽ tăng trải nghiêm người dùng tốt hơn khi người dùng click vào link nhưng chưa đổi lần sau click lại đổi vẫn được ok nha.
2. Đối với dùng các thư viện dư lodash ta có thể test ở ngoài index.ts cũng được cho nhanh đỡ phải test trong middleware và dùng postman gọi
3. Khi update lên db phải lọc qua các tham số truyền lên để tránh thay đổi các tham số không cần thiết như forgot_password_token ...thì phải lọc qua và chỉ để client truyền lên những tham số cần thiết mà thôi (tránh hacker tấn công).
4. Khi get một public profile thì không cần access vì không đăng nhập hay dùng cửa sổ ẩn danh vẫn coi được nha.(chỉ trả về những infor cần thiết thôi).

## Note:

1. khi làm chức năng refresh token thì exp mới khi tạo lại refresh token phải = exp refresh token cũ nha

2. Trong token: iat, exp theo dang epochTime

# Description thêm các bước thêm một chức năng hay collection:

1. thêm schema(interface, class) cho collector đó.
2. Vào db.ts kết nối với collection đó.
3. sử dụng collection vừa kết nối cho đúng như thêm vào bên user.services hay bên controller

# Cấu trúc checkSchema:

1. Gồm hai đối số truyền vào:

```javascript

checkSchema({Các rule}, ['body','headers',...]),


```

- tham số thứ nhất là các rules quy định nên check fields nào.
- Tham số thứ hai là nên check các request nào như check ở body hay headers nếu không truyền sẽ check tất cả

# TypeScript:

1. Đây là đn type cho mỗi trường khác nhau:

- Trong file type.d.ts là đn type cho req luôn thêm thuộc tính mới và type cho thuộc tính đó.
- Trong đoạn này

```TypeScript
 req: Request<ParamsDictionary, any, RegisterBodyReq>
```

Chỉ định nghĩa cho type các thuộc tính trong req.body thôi nha

2. Khi một thuộc tính ta chắc chắn nó sẽ có thuộc tình đó khi hover vào và không undefined hay null thì ta cho nó as thuộc tính đó luôn khỏi ? cũng được.

# Jwt Authentication:

1. Không nên dùng chung sêcret key cho ACCESS_TOKEN and REFRESH_TOKEN:

- Lí do bảo mật
- Hacker có thể dùng refresh token thay cho access token để truy cập

# MongoDB:

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

2. Khi làm dự án hãy phân tích rõ ràng cụ thể theo một khoảng time nào đó rồi bắt đầu thực hiện hay làm dự án liền nha.

## MongoDB schema validation:

Là giúp ta validate tại tầng mongodb khi chúng ta đưa dữ liệu vào mongodb vì middleware là validate tại tầng app mà thôi điều này sẽ tránh việc dư thừa dữ liệu và không thiếu những trường bắt buộc. Nếu lỗi sẽ trả về 500 và message lỗi (hãy tập đọc lỗi điềm tĩnh hơn nha)

### Lưu ý:

1. additionalProperties: false -> giúp ta thêm đúng dư liệu trong properties và không bị thừa data (nhưng bắt buộc phải khai báo trường \_id).
2. required: giúp ta thêm các properties bắt buộc phải có.
3. kiểu enum thì khai báo số là được và thêm key 'enum': [1,2,3, ...] chỉ các số quy đinh trong trường enum là có thôi.

## Vấn đề phát sinh:

1. Đối với verifyValidator(lấy từ decoded):

- Khi register khi user nhấn vào link verify và xác thực rồi thì khi đó user vẫn ở trạng thái chưa verify vì verify lấy ở decode token nên chỉ khi refresh token trả về access token mới hay login lại thì mới được.

- Cách giải quyết :
  c1: mỗi lần verify thì đi vào db tìm verify rồi xác thực nhưng như vậy sẽ ghi chậm vì tốn thời gian vào db tìm data
  c2: dùng websocket thông báo cho user hay client lấy access token lại là ok => tối ưu nhất nhưng dùng khéo léo thì được

## Các hàm trong mongodb:

1. updateMany:

- Không trả về kết quả khi gọi nên để tránh query nhiều lần ta dùng js thay đổi tweets mà thôi
- không auto update_at nên ta phải dùng Date và Date được chạy khi hàm js đó chạy, còn current time in mongodb được khởi chạy khi hàm updateMany thực thi

# Chương media:

## Formidable:

1. Upload a image file:

- Dung maxFiles : 1. Để chỉ upload một file ảnh
- Ở node phiên bản trước dùng commonJs thì formdable v3 dùng esmodule sẽ bị lỗi nên chỉ cần await import().default được
- Nhớ rằng khi dùng form.parse return về json thì không nên return ở ngoài nữa sẽ bị lỗi vì trong khi khi form parse chạy thì đoạn return cuối cùng đã res về rồi nên app sẽ báo lỗi nếu form.parse chạy xong và trả về res lần nữa.

2. Dùng sharp:

- Chuyển đuôi jpeg giảm dung lương file cho server.
- lấy các metadata không cần thiết ra máy tính.
- khi gặp lỗi operation not permitte thì thêm câu lệnh sharp.cache(false) là được

3. Dùng upload video:

- Một vấn đề là khi dùng keepExtension với một file video có nhiều kí tự khác nhau thì sẽ bị lỗi file vì tự thay đổi đuôi file->vì vậy ta không dùng keep cho video nữa mà tự custom đuôi luôn

- Những lưu ý khi lam stream video:
  - Format của header Content-Range: bytes <start>-<end>/<videoSize>
  - Ví dụ: Content-Range: bytes 1048576-3145727/3145728
  - Yêu cầu là `end` phải luôn luôn nhỏ hơn `videoSize`
  - ❌ 'Content-Range': 'bytes 0-100/100'
  - ✅ 'Content-Range': 'bytes 0-99/100'
  -
  - Còn Content-Length sẽ là end - start + 1. Đại diện cho khoản cách.
  - Để dễ hình dung, mọi người tưởng tượng từ số 0 đến số 10 thì ta có 11 số.
  - byte cũng tương tự, nếu start = 0, end = 10 thì ta có 11 byte.
  - Công thức là end - start + 1
  -
  - ChunkSize = 50
  - videoSize = 100
  - |0----------------50|51----------------99|100 (end)
  - stream 1: start = 0, end = 50, contentLength = 51
  - stream 2: start = 51, end = 99, contentLength = 49

### Note:

1. folder `uploads` nên bỏ vào `.gitignore` vì đẩy lên git sẽ khá nặng.
2. Để folder `uploads` trong máy tính local sẽ không thể share file với mọi người trong team được. => Giải pháp là upload lên 1 nền tảng như S3, hoặc upload lên server của chúng ta
3. học hỏi cách tra cứu và tìm kiếm: how to...(video, doc)right, name library name + nodejs là ra các thư viện có thể dùng vs nodejs.

## Cách hay:

1. Dùng promise với một mảng promise: Khi ta lặp một mảng bằng map và hàm xử lý lên từng phân tử của mảng có dùng await vì trong có promise thì ta nên dùng promise.all sẽ nhanh hơn

- ex:

```js
const generatePromise = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('ok')
    }, delay)
  })
}
async function main() {
  // console.time dùng để tính time cho lần thực hiện các promise này
  console.time('await từng cái')
  await generatePromise(3000)
  await generatePromise(3000)
  await generatePromise(3000)
  console.timeEnd('await từng cái')
}
main()
console.time('Promise.all')
Promise.all(
  [1, 2, 3].map(async (_) => {
    const result = await generatePromise(3000)
    return result
  })
).then((res) => {
  console.timeEnd('Promise.all')
})
```

## Stream video:

### FFMPEG:

1. Cài đặt và kiểm tra version ffmpeg -v
2. Hiểu các câu lệnh ffmpeg by terminal (ở mức độ qt và tt thôi)
3. Dùng những câu lệnh chính và có gì lấy các syntax đã build sẵn đưa lên chatGPT dịch và tự thêm tính năng cần thiết cho minh thôi.

### Note:

1. Trong thực tế việc upload video và encode hls được chia làm hai giai đoạn:

- Upload video: Upload video thành công thì resolve về cho người dùng
- Encode video: Khai báo thêm 1 url endpoint để check xem cái video đó đã encode xong chưa

2. Có hai cách để giải quyết vấn đề encode hls video lần hai tạo ra các folder ghi đè video lần 1 là:

- Cách 1: Tạo unique id cho video ngay từ đầu (nhanh hơn vì tạo ra folder ngay từ đầu, dùng package: nanoId(nhẹ hơn các package khác),...) thì sẽ tối ưu hiệu suất hơn
- Cách 2: Đợi video upload xong rồi tạo folder, move video vào (lâu hơn vì tốn thời gian)

3. Khi upload video trên pexels với hls thì lúc encode thì bị lỗi version.(tìm hiểu vấn đề này sao).

# Chương hiệu suất mongodb:

## Index:

1. Định nghĩa: giúp cho mgdb tìm tới tài nguyên nhanh hơn tối ưu hiệu suất hơn nhưng bù lại tốn bộ nhớ

2. Note:

- mongodb có hỗ trợ ta xóa các db không cần thiết hay không cần dùng đến nữa và đây gọi là ttl (Time to live)
  - 2 cách dùng chính:
    c1: expire = 0 thì sẽ dựa vào exp đã hết hay chưa hay cũ hay so với hiện tại nếu doc nào có exp cũ sẽ bị xóa
    ```javascript
    this.refreshToken.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    ```
    c2: dựa vào thời gian bắt đầu create_At sau bao nhiêu giây expire( = 10s) kết thúc thì sẽ xóa db
    ```javascript
    this.refreshToken.createIndex({ created_At: 1 }, { expireAfterSeconds: 10 })
    ```

## Index Compound:

1. Định nghĩa và công dụng: hợp nhất các chỉ số hay các field trong doc giúp cho mgdb lọc ra các doc phù hợp nhất và nhanh hơn.
2. Cách dùng: vào indexes -> nhấn vào create index -> thêm 1 field + asc -> nhấn + thêm field khác cần lọc -> nhấn ok .
3. Note:

- khi đã dùng index compound trên nhiù field thì khi chỉ search một field thì nên đánh index cho field đó luôn nha

## Index sort of Asc and desc:

1. Định nghĩa và công dụng: Nếu bạn index field age và cho asc trả về kết quả age tăng dần rồi muốn ngược lại thêm sort thì như vậy sẽ tốn thời gian so với dùng câu lệnh đúng ngay từ đầu, tùy yêu câu việc ở client muốn trả về giảm dần thì ở indexes ta cho field đó là desc là được khỏi phải sort desc

## Text search:

1. ĐN và Công dụng: khi để user tự mình search hay làm search bar thì dùng và hoa thường vẫn hiển thị .
2. Cách dùng: câu lệnh $text: $search:{'text'} và đánh chỉ mục các trường hay có chủ đề đó hay từ đó thì chỉ cần một từ chính xác nó sẽ trả về kết quả.
3. Note:

- Mỗi collection chỉ có dùng được 64 indexes thôi và chỉ có one index text (nên muốn dùng cho nhìu field thì dùng Compoud Index).

# Validator:

## Note:

- Với câu lệnh dk thì return về gì thì ta làm đk hợp lệ với return đó:
  ex: return err thì đk hợp lệ để return về lỗi

## Sự khác nhau của req.headers và req.header

1. req.headers: là của expressjs hay js nó có phân biệt hoa thường req.headers.authorization = ta gửi Authorization từ client to server (nếu req.headers.Authorization sẽ ra undefined)
2. req.header: là be nói chúng là một function nhận đối số hoa thường gì cũng được, ta gửi Authorization = thì nhận req.header('Authorization') hay req.header('authorization') đều được.

# Chương tweet:

## Bookmark:

1. Ta có thêm làm thêm endpoint api bookmarks/:bookmark_id
   để ở phía client thêm tính năng get tweet detail có bookmark_id trong đó trả về để làm icon bookmark sáng lên thông báo đã bm rồi thì client sẽ lấy đó gửi lên là ok

2. Đối với method delete thì không truyền body được nha chỉ truyền qua url và phải rõ nghĩa ví dụ tweet/123123 là tweet_id còn bookmarks/:tweet_id thì không thân thiện api phải bookmarks/tweet/123123 ổn

## Aggregation Pipelines:

### Định nghĩa :

là đường ống tổng hợp hay liên kết các collection lại với nhau.

### Cách dùng:

#### Cách 1: Dùng ui trực tiếp

1. Vào collection gốc hay local mà muốn liên kết đến các collection khác
2. nhấn qua Aggregations
3. Create stage và trạng thái $match trước tiên
   4, sau đó lookup và điền vào form để thay đổi các field cụ thể
   ex:

- from: The target collection.
- localField: The local join field.
- foreignField: The target join field.
- as: The name for the results.
- pipeline: Optional pipeline to run on the foreign collection.
- let: Optional variables to use in the pipeline field stages.

  {
  from: "hashtags",
  localField: "hashtags",
  foreignField: "\_id",
  as: "hashtags"
  }

### Retweet, comment or quote of Tweet:

- Để đếm các có bao nhiêu user khác retweet(chia sẻ lại), comment tweett của ta thì ta dùng $filter và $eq(giá trị này phải = ...)

- Và để tạo lại tweet mang nghĩa retweet thì khi dùng mongo chỉ cần
  lockup lại colletion tweet thôi

### Phân trang và kĩ thuật ìninite scrolling:

- Ta dùng đến aggregation có 2 stage chính là $skip và $limit
- $skip phải dùng trước $limit
- và từ client gửi limit,page and tweet_type thì ở dạng query params thì gửi lên sẽ có dạng string{}

### $UNWIND:

- là một stage trong aggregation giúp ta chuyển một field dạng object[] to object vì [] chỉ cần một item mà thôi.

### Get new feeds:

- đã có trên mongodb cứ xem theo logic mà thôi.

### Notes:

-Khi thao tác với aggregation = ui mongodb thì mỗi lần code xong stage đảm bảo mình đã nhấn save nha.

## Notes:

- Tránh gọi query hai lần nếu có thể thì sẽ tốt hơn tối ưu hiệu suất và tốc độ truy cập.

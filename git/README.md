# Các Câu lệnh trong git

## Các câu lệnh branch :

- git branch tên-nhánh, git switch tên-nhánh: dùng để chuyển nhánh.
- git switch -c name branch : dùng để tạp nhánh mới và chuyển qua nhánh mới luôn.
- git branch -m tên-mới-của-nhánh: dùng để đổi tên của nhánh đang ở hiện tại.
- git branch -m tên-nhánh-cần-đổi tên-mới-của-nhánh: dùng để đổi tên của một nhánh khác cùng local.
- git branch -a: xem tất cả các tên nhánh ở local và remote
- git fetch: dùng để cập nhật các nhánh ở remote về local.
- git branch -D tên-nhánh: xóa một nhánh ở local
- git push origin --delete tên-nhánh: xóa một nhánh ở remote
- git fetch -p : cập nhật các nhánh đã xóa.
- git push -u origin tên-nhánh: đưa một nhánh ở local lên trên remote và cũng như giúp kết nối remote branch và local branch sau đó chỉ cần git push mà thôi
- cat .git/config: giúp ta xem được các branch local nào đã kết nối với branch remote.
  ==> Ỏ local hay remote repo đều có những nhánh riêng của nhau (trùng tên nhưng ở hai repo khác nhau) nhưng vẫn trùng tên vì ta hay mentor push code lên.

## Các câu lệnh merge nhánh:

- git pull : kết hợp giữ git fetch and git merge và pull tại nhanh đó trên remote về .
- git pull origin handleB: pull nhánh b từ remote về và hợp vào nhánh a.
- pull request: là khi ở nhánh B ta thay đổi code và đưa lên remote repo và tạo một pull request(để mn cùng team vào đánh giá và phản hồi) nếu đồng ý hết thì ta nhấn merge pull request a vào b thôi (nhớ tiêu đề pull request phải quy định b hợp vào a trước nha) xong ta ở local nhánh b nhấn git pull để tải code từ nhánh b remote hợp vào b local là xong.

## Để quay lại commit cũ:

- git reset -hard mã commit muôn quay lại
- git push -f để ép remote phải nhận commit từ local và reset về commit cũ nhưng cần hạn chế nha(vì sẽ vô tình làm xóa đi commit của đồng nghiệp ).

## Câu lệnh khác dùng để gộp nhánh:

- git rebash tên-nhánh : dùng lịch sử commit của feature gộp vào feature/login và lấy các commit mới nhất của login tạo lại thành những commit mới.

## Các câu lệnh hoàn tác:

- git restore tên-file: từ khu vực làm việc(cụ thể ở trạng thái changed) trở về status unchanges
- git reset ten-file or git restore -S tên-file: từ khu vực staging về khu vực làm việc.
- git restore --source=mã hash (của commit trước đó) tên-file: giúp khôi phục hay đưa file đó quay trở về commit cũ của file đó.
- git reset (--mixed : mặc định) mã hash commit muốn trở về: đưa file về commit quy đinh và commit trước đó một bậc thì ở trạng thái changes
- git reset --sort: đưa vê commit trước ở status staging
- git reset --hard: commit trước đó bị mất luôn
- git reset --merge: commit trước một bậc bị mất nhung vẫn giữ lại những thay đổi hiện tại ở file khác.
- git revert mã hash của commit muôn quay trở về: sẽ tạo ra một commit mới với các file đối nghịch được xóa với commit trước đó.
- git rebash -i HEAD~7: dùng để gộp nhiều file về thành một gile và sau đó nhấn tại các commit muốn gộp dùng squase trước nó.
- git rebash -i mã hash : dùng để đổi tên commit dù đã push lênh origin.

## Cách gộp và chèn commit mới nhất vào commit cuối cùng hay commit vừa push:

b1: git add .
b2: git commit --amend (mã hash commit cuối cùng)
b3: git push -f
b4: hỏi có đổi tên commit hay không nếu không thì bỏ qua.
ok nha

## Git stash:

### Định nghĩa

Dùng để lưu một số thay đổi của nhánh khi chưa commit mà muôn đổi sang nhánh khác để làm việc thì dùng git stash để lưu hay cất giấu.

### Các câu lệnh:

- git stash : nén và lưu data của nhánh vào commit cuối cùng và cất ở kho
- git stash list: dùng để xem trong kho có gì
- git stash show stash@{index} -p: xem rõ file có thay đổi gì
- git stash apply stash@{index}: đưa file đấy vào lại nhánh đó
- git stash clear: xóa kho

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

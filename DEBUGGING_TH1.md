# BÁO CÁO THỰC HÀNH DEBUGGING - TH1

## 1. Danh sách các loại lỗi đã thử nghiệm

### Loại 1: Lỗi Cú pháp (Syntax Error)
* **Mô tả hành động:** Xóa dấu đóng ngoặc nhọn `}` ở cuối hàm `App()` hoặc xóa một dấu phẩy `,` ngăn cách các thuộc tính trong đối tượng `backgroundStyle`.
* **Cách nhận biết:**
    * **Metro Bundler:** Ngay lập tức hiển thị màn hình lỗi màu đỏ (Red Screen) với thông báo `SyntaxError: Unexpected token`. Quá trình bundle bị dừng lại và ứng dụng không thể hiển thị giao diện.
    * **Trình soạn thảo (VS Code):** Xuất hiện gạch chân đỏ tại vị trí thiếu dấu. Tab **Problems** sẽ báo lỗi cụ thể như "Declaration or statement expected" hoặc "',' expected".
* **Cách xử lý:** Rà soát lại cấu trúc code, đảm bảo tất cả các cặp ngoặc `{}` `()` `[]` được đóng đầy đủ. Sử dụng tính năng Format Document (`Shift + Alt + F`) để dễ dàng phát hiện các đoạn code bị lệch cấu trúc.

---

### Loại 2: Lỗi Kiểu dữ liệu (Type Error)
* **Mô tả hành động:** Truyền một chuỗi văn bản vào hàm yêu cầu kiểu số. Ví dụ: gọi `formatPrice("1000000")` thay vì `formatPrice(1000000)`.
* **Cách nhận biết:**
    * **TypeScript (TS):** VS Code sẽ báo lỗi trực tiếp bằng gạch chân đỏ dưới giá trị truyền vào: *Argument of type 'string' is not assignable to parameter of type 'number'*.
    * **Metro:** Nếu cấu hình TypeScript nghiêm ngặt, Metro sẽ báo lỗi compile và ngăn không cho ứng dụng chạy tiếp cho đến khi kiểu dữ liệu được khớp đúng.
* **Cách xử lý:** Kiểm tra định nghĩa hàm (`type` hoặc `interface`). Thực hiện ép kiểu hoặc chuyển đổi dữ liệu về đúng định dạng mong muốn trước khi truyền vào hàm.

---

### Loại 3: Lỗi Thực thi (Runtime Error)
* **Mô tả hành động:** Truy cập vào một thuộc tính của đối tượng bị `undefined`. Ví dụ: Cố gắng hiển thị `{user.profile.address}` trong khi đối tượng `user` chỉ có `id` và `name`.
* **Cách nhận biết:**
    * **Runtime:** Ứng dụng sẽ bị văng (crash) ngay khi thực hiện đến dòng code đó.
    * **Metro/Console:** Log báo lỗi: `TypeError: Cannot read property 'address' of undefined`.
* **Cách xử lý:** Sử dụng kỹ thuật **Optional Chaining** (`user?.profile?.address`) để đảm bảo nếu dữ liệu chưa có, ứng dụng sẽ trả về `undefined` thay vì bị crash. Hoặc khởi tạo giá trị mặc định cho đối tượng.

---

## 2. Minh chứng Debug bằng Console Log

Đoạn mã đã thêm vào file `App.tsx`:
```javascript
console.log('[DEBUG] App component rendered. Theme:', isDarkMode ? 'Dark' : 'Light');
const formatted = formatPrice(1000000);
console.log(`[DEBUG] Price formatting check: 1000000 -> ${formatted}`);


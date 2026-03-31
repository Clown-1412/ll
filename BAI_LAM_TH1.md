**BAI LAM TH1**

**II. PHẦN LÝ THUYẾT: LUỒNG TƯƠNG TÁC TRONG REACT NATIVE**
Khi người dùng thực hiện thao tác chạm (touch event) trên ứng dụng React Native, một quy trình trao đổi dữ liệu phức tạp diễn ra giữa thế giới Native và JavaScript thông qua mô hình ba thành phần:

**1. UI Thread (Main Thread/Native Thread)**
Đây là luồng chịu trách nhiệm điều hành các thành phần giao diện gốc (Native Views) của hệ điều hành. Khi người dùng chạm vào một nút bấm, UI Thread là nơi tiếp nhận tín hiệu phần cứng đầu tiên. Nó xác định tọa độ và đối tượng bị tác động, sau đó đóng gói thông tin sự kiện này để gửi đi xử lý. Vì UI Thread không chứa logic nghiệp vụ, nó cần chuyển thông tin này qua "cầu" Bridge.
-  Chạy code JavaScript/TypeScript 
-  Xử lý logic, state management 
-  Chạy trong JavaScript engine (V8, Hermes) 
---
**2. JavaScript Thread**
Đây là "bộ não" thực thi code của bạn. Sau khi nhận được dữ liệu sự kiện từ Bridge, JS Thread sẽ tìm đến hàm callback tương ứng (ví dụ: onPress). Tại đây, các logic như tính toán, cập nhật state hoặc gọi API được thực hiện. Sau khi tính toán xong các thay đổi về giao diện, JS Thread sẽ gửi lệnh cập nhật ngược lại cho phía Native để hiển thị cho người dùng.
-  Chạy code native 
-  Render UI lên màn hình 
-  Chạy trên main thread của OS 
---
**3. Vai trò của Bridge**
Bridge đóng vai trò là "công sứ" trung gian kết nối hai môi trường hoàn toàn khác biệt. Nó đảm nhận việc chuyển đổi dữ liệu (serialize) sang định dạng JSON để truyền tải giữa Native và JavaScript một cách bất đồng bộ. Việc xử lý bất đồng bộ này giúp giao diện không bị "đóng băng" (lag) ngay cả khi logic JavaScript đang xử lý các tác vụ nặng.
-  Kết nối JS Thread và UI Thread
-  Chuyển messages qua lại
-  Asynchronous (bất đồng bộ)
---
Dataflow

[ Người dùng ]  --->  [ UI Thread ]  ---(Event Data)--- [  Bridge  ]
      |                    |                                |
      v                    v                                v
[ Giao diện  ]  <---  [ UI Thread ]  <---(UI Update)--- [ JS Thread ]
  (Cập nhật)          (Render Gốc)                      (Xử lý Logic)

---
**III. SO SÁNH FLATLIST VÀ SCROLLVIEW + MAP**
Đối với danh sách dài (như ví dụ 100 dòng ở trên), việc ưu tiên sử dụng FlatList thay vì ScrollView + map là cực kỳ quan trọng vì các lý do sau:

**Cơ chế Virtualization (Cuộn ảo):** ScrollView sẽ render toàn bộ 100 items ngay khi ứng dụng khởi chạy, gây tốn bộ nhớ và làm chậm quá trình mount component. Ngược lại, FlatList chỉ render những item đang hiển thị trên màn hình và giải phóng bộ nhớ của các item đã trôi qua.

**Hiệu suất (Performance):** FlatList giúp duy trì tốc độ khung hình (FPS) ổn định hơn khi cuộn danh sách dài vì nó giảm tải cho JS Thread và UI Thread.

**Tiết kiệm tài nguyên:** Đối với các danh sách cực lớn (hàng nghìn phần tử), ScrollView có thể gây crash ứng dụng do tràn bộ nhớ, trong khi FlatList vẫn hoạt động mượt mà nhờ việc tái sử dụng các view (View Recycling).
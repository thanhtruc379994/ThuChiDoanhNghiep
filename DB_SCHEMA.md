# Thiết kế cơ sở dữ liệu IndexedDB

Database: `thu-chi-doanh-nghiep` — schema version `3`.

## Bảng chính

| Store | Mục đích | Khóa chính |
| --- | --- | --- |
| `users` | Tài khoản đăng nhập, vai trò | `username` |
| `sessions` | Phiên đăng nhập hiện tại | `id` |
| `transactions` | Thu, chi, chuyển khoản | `id` |
| `accounts` | Tài khoản ngân hàng, tiền mặt, hạn mức vay | `id` |
| `account-transactions` | Lịch sử biến động theo tài khoản | `id` |
| `projects` | Dự án và ngân sách | `id` |
| `contracts` | Hợp đồng thuộc dự án | `id` |
| `categories` | Danh mục thu/chi | `id` |
| `customers` | Khách hàng | `id` |
| `suppliers` | Nhà cung cấp | `id` |
| `supplier-debts` | Công nợ và lịch thanh toán nhà cung cấp | `id` |
| `employees` | Nhân sự và phân quyền | `id` |
| `attachments` | Tệp đính kèm giao dịch/dự án | `id` |
| `invoices` | Hóa đơn đầu vào/đầu ra | `id` |
| `payments` | Các lần thanh toán thu/chi | `id` |
| `disbursements` | Phiếu giải ngân và phân bổ | `id` |
| `notifications` | Thông báo theo người dùng | `id` |
| `saved-filters` | Bộ lọc đã lưu theo module | `id` |
| `number-sequences` | Sinh số phiếu, hóa đơn, hợp đồng | `key` |
| `settings` | Cấu hình ứng dụng | `key` |
| `audit-logs` | Nhật ký thêm, sửa, xóa, đăng nhập | `id` |

`app-data` là store tương thích dùng trong giai đoạn chuyển đổi dữ liệu hiện tại. Dữ liệu mới nên ghi vào các store nghiệp vụ tương ứng.

## Quan hệ

- `transactions.accountId` → `accounts.id`
- `transactions.projectId` → `projects.id`
- `transactions.categoryId` → `categories.id`
- `contracts.projectId` → `projects.id`
- `contracts.supplierId` → `suppliers.id`
- `supplier-debts.supplierId` → `suppliers.id`
- `account-transactions.accountId` → `accounts.id`
- `attachments.transactionId` → `transactions.id`
- `attachments.projectId` → `projects.id`
- `invoices.transactionId` → `transactions.id`
- `payments.accountId` → `accounts.id`
- `payments.supplierId` → `suppliers.id`
- `payments.customerId` → `customers.id`
- `disbursements.accountId` → `accounts.id`
- `disbursements.projectId` → `projects.id`
- `notifications.userId` → `users.username`
- `saved-filters.userId` → `users.username`
- `audit-logs.userId` → `users.username`

IndexedDB không có foreign key tự động, nên các quan hệ này cần được kiểm tra ở tầng service trước khi xóa bản ghi cha.

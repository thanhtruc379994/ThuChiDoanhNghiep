import { useState } from 'react'
import './NotificationPanel.css'

const initialNotifications = [
  { id: 1, title: 'Có giao dịch cần kiểm tra', text: 'Phiếu chi #PC-2026-0515 đang chờ quyết toán.', time: '5 phút trước', tone: 'gold', unread: true },
  { id: 2, title: 'Công nợ sắp đến hạn', text: 'Nhà cung cấp 007 có khoản thanh toán đến hạn trong 3 ngày.', time: '1 giờ trước', tone: 'red', unread: true },
  { id: 3, title: 'Báo cáo đã sẵn sàng', text: 'Bảng kê đối soát tháng này đã được cập nhật.', time: 'Hôm qua', tone: 'green', unread: false },
]

function NotificationPanel({ onClose }) {
  const [items, setItems] = useState(initialNotifications)
  const unreadCount = items.filter((item) => item.unread).length

  return (
    <div className="notification-panel-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="notification-panel" role="dialog" aria-modal="true" aria-label="Trung tâm thông báo">
        <div className="notification-panel__toolbar">
          <span>{unreadCount} thông báo chưa đọc</span>
          <button type="button" onClick={onClose} aria-label="Đóng">×</button>
          <button type="button" onClick={() => setItems(items.map((item) => ({ ...item, unread: false })))}>Đánh dấu đã đọc</button>
        </div>
        <div className="notification-list">
          {items.map((item) => (
            <article className={`notification-item ${item.unread ? 'is-unread' : ''}`} key={item.id} onClick={() => setItems(items.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry))}>
              <i className={`notification-item__dot ${item.tone}`} />
              <div><strong>{item.title}</strong><p>{item.text}</p><small>{item.time}</small></div>
              {item.unread && <b className="notification-item__new">Mới</b>}
            </article>
          ))}
        </div>
        <footer><button type="button" onClick={onClose}>Đóng</button></footer>
      </section>
    </div>
  )
}

export default NotificationPanel

import './ConfirmDialog.css'

export default function ConfirmDialog({ title = 'Xác nhận xóa', message, onCancel, onConfirm }) {
  return (
    <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="confirm-dialog__close" type="button" onClick={onCancel} aria-label="Đóng">×</button>
        <div className="confirm-dialog__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></svg>
        </div>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <footer><button type="button" onClick={onCancel}>Hủy</button><button type="button" onClick={onConfirm}>Xóa</button></footer>
      </section>
    </div>
  )
}

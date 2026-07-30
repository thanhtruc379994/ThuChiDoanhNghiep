import './LogoutDialog.css'

function LogoutDialog({ onCancel, onConfirm }) {
  return (
    <div className="logout-dialog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-dialog-title">
        <button className="logout-dialog__close" type="button" onClick={onCancel} aria-label="Đóng">×</button>
        {/*<div className="logout-dialog__icon" aria-hidden="true">↪</div>*/}
        <h2 id="logout-dialog-title">Xác nhận đăng xuất</h2>
        <p>Bạn có chắc muốn đăng xuất khỏi hệ thống?</p>
        <footer>
          <button type="button" onClick={onCancel}>Hủy</button>
          <button type="button" onClick={onConfirm}>Đăng xuất</button>
        </footer>
      </section>
    </div>
  )
}

export default LogoutDialog

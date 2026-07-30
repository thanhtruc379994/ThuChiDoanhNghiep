import { useState } from 'react'
import LogoutDialog from '../LogoutDialog/LogoutDialog'
import './Sidebar.css'
import overviewIcon from '../../assets/overview.png'
import transactionIcon from '../../assets/transaction.png'
import projectIcon from '../../assets/project.png'
import accountsIcon from '../../assets/accounts.png'
import categoriesIcon from '../../assets/categories.png'
import customerIcon from '../../assets/customer.png'
import supplierIcon from '../../assets/suplier.png'
import employeeIcon from '../../assets/employee.png'

const sidebarItems = [
  { icon: overviewIcon, label: 'Tổng quan' },
  { icon: transactionIcon, label: 'Giao dịch' },
  { icon: projectIcon, label: 'Dự án' },
  { icon: accountsIcon, label: 'Tài khoản' },
  { icon: categoriesIcon, label: 'Danh mục' },
  { icon: customerIcon, label: 'Khách hàng' },
  { icon: supplierIcon, label: 'Nhà cung cấp' },
  { icon: employeeIcon, label: 'Nhân sự' },
]

function Sidebar({ active = 'Giao dịch', collapsed, user, onLogout, onToggle, onNavigate }) {
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <aside className="sidebar">
      <button className="sidebar__toggle" onClick={onToggle} aria-label="Thu gọn thanh điều hướng">
        ‹
      </button>

      <div className="sidebar__brand">
        <div className="sidebar__bulb" aria-hidden="true">S</div>
        <h1>THU CHI DOANH NGHIỆP</h1>
      </div>

      <nav className="sidebar__nav" aria-label="Điều hướng chính">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            className={active === item.label ? 'is-active' : ''}
            onClick={() => onNavigate?.(item.label)}
            title={collapsed ? item.label : undefined}
          >
            <b aria-hidden="true"><img src={item.icon} alt="" /></b>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__profile">
        <div className="sidebar__avatar">{user?.initials || 'QT'}</div>
        <div className="sidebar__profile-info">
          <strong>{user?.name || 'Quản trị viên'}</strong>
          <span>Tài khoản nội bộ</span>
        </div>
        <button className="sidebar__logout" onClick={() => setLogoutOpen(true)} title="Đăng xuất" aria-label="Đăng xuất">↪</button>
      </div>
      <footer>Ứng dụng quản trị nội bộ</footer>
      {logoutOpen && (
        <LogoutDialog
          onCancel={() => setLogoutOpen(false)}
          onConfirm={() => { setLogoutOpen(false); onLogout?.() }}
        />
      )}
    </aside>
  )
}

export default Sidebar

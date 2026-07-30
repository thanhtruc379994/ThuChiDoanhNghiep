import { useState } from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Employees.css'

const modules = ['Tổng quan', 'Giao dịch', 'Dự án', 'Tài khoản', 'Danh mục', 'Khách hàng', 'Nhà cung cấp']
const actions = ['view', 'add', 'edit', 'delete']

const fullPermissions = () => Object.fromEntries(modules.map((module) => [module, { view: true, add: module !== 'Tổng quan', edit: module !== 'Tổng quan', delete: module !== 'Tổng quan' }]))

const seedEmployees = [
  { id: 1, displayName: 'Kiên Fox | P.TGĐ', username: 'vb', email: 'vb@company.vn', password: '', role: 'Admin', permissions: fullPermissions() },
  { id: 2, displayName: 'Mr Quân | TGĐ', username: 'quan.nn', email: 'quan.nn@company.vn', password: '', role: 'User', permissions: fullPermissions() },
  { id: 3, displayName: 'Ms Tuyết | KTT', username: 'tuyetnt', email: 'tuyetnt@company.vn', password: '', role: 'User', permissions: fullPermissions() },
  { id: 4, displayName: 'Ms Trang | CVKT', username: 'trangnt', email: 'trangnt@company.vn', password: '', role: 'User', permissions: fullPermissions() },
]

function permissionsText(employee) {
  if (employee.role === 'Admin') return 'Toàn quyền'
  return modules.filter((module) => employee.permissions[module]?.view).map((module) => {
    const perms = employee.permissions[module]
    const letters = [perms.add && 'T', perms.edit && 'S', perms.delete && 'X'].filter(Boolean).join(',')
    return `${module}${letters ? ` (${letters})` : ''}`
  }).join(', ')
}

function EmployeeForm({ employee, onClose, onSave }) {
  const [permissions, setPermissions] = useState(employee?.permissions || fullPermissions())
  const [role, setRole] = useState(employee?.role || 'User')

  const toggle = (module, action) => {
    setPermissions({ ...permissions, [module]: { ...permissions[module], [action]: !permissions[module][action] } })
  }

  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      ...employee,
      displayName: form.get('displayName'),
      username: form.get('username'),
      email: form.get('email'),
      password: form.get('password'),
      role,
      permissions: role === 'Admin' ? fullPermissions() : permissions,
    })
  }

  return (
    <div className="employee-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="employee-modal" role="dialog" aria-modal="true">
        <header><h2>{employee ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự'}</h2><button type="button" onClick={onClose}>×</button></header>
        <form onSubmit={submit}>
          <div className="employee-fields">
            <label><span>Tên hiển thị: <b>*</b></span><input required name="displayName" defaultValue={employee?.displayName} placeholder="Nhập tên hiển thị" /></label>
            <label><span>Tên đăng nhập: <b>*</b></span><input required name="username" defaultValue={employee?.username} placeholder="Nhập tên đăng nhập" /></label>
            <label><span>Email đăng nhập: <b>*</b></span><input required type="email" name="email" defaultValue={employee?.email} placeholder="user@gmail.com" /></label>
            <label><span>Mật khẩu: {!employee && <b>*</b>}</span><input required={!employee} type="password" name="password" defaultValue={employee?.password} placeholder={employee ? 'Để trống nếu không thay đổi' : 'Nhập mật khẩu'} /></label>
            <label><span>Quyền: <b>*</b></span><select value={role} onChange={(event) => setRole(event.target.value)}><option>Admin</option><option>User</option></select></label>
          </div>

          <section className={`permission-section ${role === 'Admin' ? 'disabled' : ''}`}>
            <div className="permission-title"><strong>Phân quyền chi tiết:</strong>{role === 'Admin' && <span>Admin được cấp toàn quyền</span>}</div>
            <div className="permission-table">
              <div className="permission-head"><span>Chức năng</span><span>Xem</span><span>Thêm</span><span>Sửa</span><span>Xóa</span></div>
              {modules.map((module) => (
                <div className="permission-row" key={module}>
                  <strong>{module}</strong>
                  {actions.map((action) => module === 'Tổng quan' && action !== 'view'
                    ? <span key={action}>–</span>
                    : <label key={action}><input type="checkbox" disabled={role === 'Admin'} checked={role === 'Admin' || permissions[module][action]} onChange={() => toggle(module, action)} /></label>)}
                </div>
              ))}
            </div>
          </section>
          <footer><button type="button" onClick={onClose}>Hủy</button><button type="submit">Lưu</button></footer>
        </form>
      </section>
    </div>
  )
}

export default function Employees() {
  const [employees, setEmployees] = useIndexedDbState('employees', seedEmployees)
  const [editing, setEditing] = useState(undefined)
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(undefined)
  const [toast, setToast] = useState('')

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2000) }
  const save = (employee) => {
    setEmployees(editing ? employees.map((item) => item.id === editing.id ? employee : item) : [...employees, { ...employee, id: Date.now() }])
    setFormOpen(false)
    notify(editing ? 'Đã cập nhật nhân sự' : 'Đã thêm nhân sự')
  }

  return (
    <main className="employees-page">
      <header className="employees-header"><h2>Quản lý nhân sự</h2><div><button className="add-employee" onClick={() => { setEditing(undefined); setFormOpen(true) }}>＋ Thêm nhân sự</button><NotificationBell className="employees-bell" count={15} /></div></header>
      <section className="employees-table-card">
        <div className="employees-table-scroll"><table className="employees-table"><thead><tr><th>Tên hiển thị</th><th>Tên đăng nhập</th><th>Quyền</th><th>Phân quyền chi tiết</th><th>Thao tác</th></tr></thead>
          <tbody>{employees.map((employee) => <tr key={employee.id}><td>{employee.displayName}</td><td>{employee.username}</td><td><span className={`employee-role employee-role--${employee.role.toLowerCase()}`}>{employee.role}</span></td><td>{employee.role === 'Admin' ? <span className="full-access">Toàn quyền</span> : permissionsText(employee)}</td><td className="employee-actions"><ActionIcon icon="edit" label="Chỉnh sửa nhân sự" onClick={() => { setEditing(employee); setFormOpen(true) }} /><ActionIcon icon="trash" tone="red" label="Xóa nhân sự" onClick={() => setPendingDelete(employee)} /></td></tr>)}</tbody>
        </table></div>
      </section>
      {formOpen && <EmployeeForm employee={editing} onClose={() => setFormOpen(false)} onSave={save} />}
      {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa nhân sự “${pendingDelete.displayName}”? Tài khoản này sẽ không thể đăng nhập.`} onCancel={() => setPendingDelete(undefined)} onConfirm={() => { setEmployees(employees.filter((item) => item.id !== pendingDelete.id)); setPendingDelete(undefined); notify('Đã xóa nhân sự') }} />}
      {toast && <div className="employee-toast">{toast}</div>}
    </main>
  )
}

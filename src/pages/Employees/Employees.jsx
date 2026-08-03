import { useState } from 'react'
import { Button, Footer, Header, Input, Label, Main, Section, Select, Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../components/MaterialPrimitives/MaterialPrimitives'
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
      <Section className="employee-modal" role="dialog" aria-modal="true">
        <Header><h2>{employee ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự'}</h2><Button type="button" onClick={onClose}>×</Button></Header>
        <form onSubmit={submit}>
          <div className="employee-fields">
            <Label><span>Tên hiển thị: <b>*</b></span><Input required name="displayName" defaultValue={employee?.displayName} placeholder="Nhập tên hiển thị" /></Label>
            <Label><span>Tên đăng nhập: <b>*</b></span><Input required name="username" defaultValue={employee?.username} placeholder="Nhập tên đăng nhập" /></Label>
            <Label><span>Email đăng nhập: <b>*</b></span><Input required type="email" name="email" defaultValue={employee?.email} placeholder="user@gmail.com" /></Label>
            <Label><span>Mật khẩu: {!employee && <b>*</b>}</span><Input required={!employee} type="password" name="password" defaultValue={employee?.password} placeholder={employee ? 'Để trống nếu không thay đổi' : 'Nhập mật khẩu'} /></Label>
            <Label><span>Quyền: <b>*</b></span><Select value={role} onChange={(event) => setRole(event.target.value)}><option>Admin</option><option>User</option></Select></Label>
          </div>

          <Section className={`permission-section ${role === 'Admin' ? 'disabled' : ''}`}>
            <div className="permission-title"><strong>Phân quyền chi tiết:</strong>{role === 'Admin' && <span>Admin được cấp toàn quyền</span>}</div>
            <div className="permission-table">
              <div className="permission-head"><span>Chức năng</span><span>Xem</span><span>Thêm</span><span>Sửa</span><span>Xóa</span></div>
              {modules.map((module) => (
                <div className="permission-row" key={module}>
                  <strong>{module}</strong>
                  {actions.map((action) => module === 'Tổng quan' && action !== 'view'
                    ? <span key={action}>–</span>
                    : <Label key={action}><Input type="checkbox" disabled={role === 'Admin'} checked={role === 'Admin' || permissions[module][action]} onChange={() => toggle(module, action)} /></Label>)}
                </div>
              ))}
            </div>
          </Section>
          <Footer><Button type="button" onClick={onClose}>Hủy</Button><Button type="submit">Lưu</Button></Footer>
        </form>
      </Section>
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
    <Main className="employees-page">
      <Header className="employees-header"><h2>Quản lý nhân sự</h2><div><Button className="add-employee" onClick={() => { setEditing(undefined); setFormOpen(true) }}>＋ Thêm nhân sự</Button><NotificationBell className="employees-bell" count={15} /></div></Header>
      <Section className="employees-table-card">
        <div className="employees-table-scroll"><Table className="employees-table"><TableHead><TableRow><TableHeaderCell>Tên hiển thị</TableHeaderCell><TableHeaderCell>Tên đăng nhập</TableHeaderCell><TableHeaderCell>Quyền</TableHeaderCell><TableHeaderCell>Phân quyền chi tiết</TableHeaderCell><TableHeaderCell>Thao tác</TableHeaderCell></TableRow></TableHead>
          <TableBody>{employees.map((employee) => <TableRow key={employee.id}><TableDataCell>{employee.displayName}</TableDataCell><TableDataCell>{employee.username}</TableDataCell><TableDataCell><span className={`employee-role employee-role--${employee.role.toLowerCase()}`}>{employee.role}</span></TableDataCell><TableDataCell>{employee.role === 'Admin' ? <span className="full-access">Toàn quyền</span> : permissionsText(employee)}</TableDataCell><TableDataCell className="employee-actions"><ActionIcon icon="edit" label="Chỉnh sửa nhân sự" onClick={() => { setEditing(employee); setFormOpen(true) }} /><ActionIcon icon="trash" tone="red" label="Xóa nhân sự" onClick={() => setPendingDelete(employee)} /></TableDataCell></TableRow>)}</TableBody>
        </Table></div>
      </Section>
      {formOpen && <EmployeeForm employee={editing} onClose={() => setFormOpen(false)} onSave={save} />}
      {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa nhân sự “${pendingDelete.displayName}”? Tài khoản này sẽ không thể đăng nhập.`} onCancel={() => setPendingDelete(undefined)} onConfirm={() => { setEmployees(employees.filter((item) => item.id !== pendingDelete.id)); setPendingDelete(undefined); notify('Đã xóa nhân sự') }} />}
      {toast && <div className="employee-toast">{toast}</div>}
    </Main>
  )
}



import { useMemo, useState } from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Customers.css'

const seedCustomers = [
  { id: 1, name: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN TRẠM SẠC TOÀN CẦU', phone: '0989756699', email: 'contact@tramsac.vn', address: 'Tòa Văn phòng Symphony, Đường Chu Huy Mân, Phường Phúc Lợi, TP Hà Nội, Việt Nam', tax: '110660175', contact: 'Nguyễn Văn Anh', note: '22/03/2024. Người đại diện: Nguyễn Văn Anh', debt: 2285000000 },
  { id: 2, name: 'CÔNG TY TNHH KINH DOANH THƯƠNG MẠI VÀ DỊCH VỤ VINFAST', phone: '024 3974 9999', email: 'info@vinfast.vn', address: 'Số 7, Đường Bằng Lăng 1, Khu đô thị sinh thái Vinhomes Riverside, Quận Long Biên, Hà Nội', tax: '108926276', contact: 'Trần Minh Đức', note: 'Khách hàng chiến lược', debt: 15703050000 },
  { id: 3, name: 'CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ PHÁT TRIỂN THƯƠNG HIỆU VIỆT', phone: '02835367777', email: 'hello@thuonghieuviet.vn', address: '128/29 Tân Hương, Phường Phú Thọ Hòa, TP Hồ Chí Minh, Việt Nam', tax: '309138437', contact: 'Lê Võ', note: '08/07/2009. Người đại diện: Lê Võ', debt: 365000000 },
  { id: 4, name: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI - QUẢNG CÁO - XÂY DỰNG - ĐỊA ỐC VIỆT HÀN', phone: '0984699864', email: 'viet-han@gmail.com', address: 'Tầng 3 khối nhà 104 khu K01, Số 136 Hồ Tùng Mậu, Phường Phú Diễn, TP Hà Nội', tax: '304683887', contact: 'Đào Thị Hoa', note: '15/11/2006. Người đại diện: Đào Thị Hoa', debt: 850000000 },
  { id: 5, name: 'CÔNG TY CỔ PHẦN PHÁT TRIỂN THÀNH PHỐ XANH', phone: '0862657999', email: 'info@green-city.vn', address: '72 Lê Thánh Tôn, Phường Sài Gòn, TP Hồ Chí Minh, Việt Nam', tax: '305320043', contact: 'Nguyễn Hải', note: '23/11/2007. Người đại diện: Nguyễn Hải', debt: 420000000 },
  { id: 6, name: 'CÔNG TY CỔ PHẦN VINHOMES', phone: '024 3974 9350', email: 'contact@vinhomes.vn', address: 'Tòa nhà văn phòng Symphony, Phường Phúc Lợi, Thành phố Hà Nội, Việt Nam', tax: '102671977', contact: 'Mai Thu Thủy', note: '12/03/2008. Người đại diện (TGĐ): Mai Thu Thủy', debt: 3860000000 },
  { id: 7, name: 'CÔNG TY CỔ PHẦN VINPEARL', phone: '058 3590611', email: 'info@vinpearl.com', address: 'Đảo Hòn Tre, Phường Nha Trang, Tỉnh Khánh Hòa, Việt Nam', tax: '4200456848', contact: 'Võ Thị Phương Thảo', note: '31/08/2001. Tổng GĐ: Nguyễn Đình', debt: 1240000000 },
  { id: 8, name: 'TẬP ĐOÀN VINGROUP - CÔNG TY CP', phone: '84 4 3974 9999', email: 'info@vingroup.net', address: 'Số 7, Đường Bằng Lăng 1, khu đô thị Vinhomes Riverside, Hà Nội', tax: '101245486', contact: 'Nguyễn Việt Quang', note: '29/05/2002. Người đại diện', debt: 5375035390 },
]

const money = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`

function CustomerForm({ customer, onClose, onSave }) {
  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({ ...customer, name: form.get('name'), phone: form.get('phone'), email: form.get('email'), tax: form.get('tax'), address: form.get('address'), contact: form.get('contact'), note: form.get('note'), debt: customer?.debt || 0 })
  }
  return (
    <div className="customer-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="customer-modal" role="dialog" aria-modal="true">
        <header><h2>{customer ? 'Sửa khách hàng' : 'Thêm khách hàng'}</h2><button type="button" onClick={onClose}>×</button></header>
        <form onSubmit={submit}>
          <label className="customer-field customer-field--full">Tên khách hàng: <b>*</b><input required name="name" defaultValue={customer?.name} placeholder="Nhập tên khách hàng" /></label>
          <label className="customer-field">Số điện thoại:<input name="phone" defaultValue={customer?.phone} /></label>
          <label className="customer-field">Email:<input type="email" name="email" defaultValue={customer?.email} /></label>
          <label className="customer-field">Mã số thuế:<input name="tax" defaultValue={customer?.tax} /></label>
          <label className="customer-field">Người liên hệ:<input name="contact" defaultValue={customer?.contact} /></label>
          <label className="customer-field customer-field--full">Địa chỉ:<textarea name="address" rows="3" defaultValue={customer?.address} /></label>
          <label className="customer-field customer-field--full">Ghi chú:<textarea name="note" rows="3" defaultValue={customer?.note} /></label>
          <footer><button type="button" onClick={onClose}>Hủy</button><button type="submit">Lưu khách hàng</button></footer>
        </form>
      </section>
    </div>
  )
}

function DebtForm({ customer, onClose, onSave }) {
  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave(Number(form.get('amount')) || 0)
  }
  return (
    <div className="customer-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="debt-modal" role="dialog" aria-modal="true">
        <header><h2>Thêm công nợ phải thu</h2><button onClick={onClose}>×</button></header>
        <form onSubmit={submit}><p>{customer.name}</p><label>Số tiền: <b>*</b><input name="amount" type="number" required min="1" placeholder="Nhập số tiền" /></label><label>Nội dung:<textarea rows="3" placeholder="Nhập nội dung công nợ" /></label><footer><button type="button" onClick={onClose}>Hủy</button><button type="submit">Lưu công nợ</button></footer></form>
      </section>
    </div>
  )
}

export default function Customers() {
  const [customers, setCustomers] = useIndexedDbState('customers', seedCustomers)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(undefined)
  const [formOpen, setFormOpen] = useState(false)
  const [debtCustomer, setDebtCustomer] = useState(undefined)
  const [pendingDelete, setPendingDelete] = useState(undefined)
  const [toast, setToast] = useState('')
  const perPage = 5

  const filtered = useMemo(() => customers.filter((customer) => Object.values(customer).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))), [customers, query])
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage))
  const visible = filtered.slice((page - 1) * perPage, page * perPage)
  const totalDebt = customers.reduce((sum, customer) => sum + customer.debt, 0)

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2100) }
  const saveCustomer = (data) => {
    setCustomers(editing ? customers.map((item) => item.id === editing.id ? data : item) : [{ ...data, id: Date.now() }, ...customers])
    setFormOpen(false)
    notify(editing ? 'Đã cập nhật khách hàng' : 'Đã thêm khách hàng')
  }
  const exportExcel = () => {
    const rows = [['Tên khách hàng', 'Số điện thoại', 'Email', 'Địa chỉ', 'Mã số thuế', 'Người liên hệ', 'Công nợ'], ...filtered.map((c) => [c.name, c.phone, c.email, c.address, c.tax, c.contact, c.debt])]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })); link.download = 'khach-hang.csv'; link.click(); URL.revokeObjectURL(link.href)
    notify('Đã xuất danh sách khách hàng')
  }

  return (
    <main className="customers-page">
      <header className="customers-header"><h2>Quản lý khách hàng</h2><div><button className="export-customers" onClick={exportExcel}>Xuất Excel</button><button className="add-customer" onClick={() => { setEditing(undefined); setFormOpen(true) }}>＋ Thêm khách hàng</button><NotificationBell className="customers-bell" count={23} /></div></header>
      <section className="customer-summary"><label><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Tìm kiếm khách hàng..." /></label><div><span>Tổng công nợ phải thu:</span><strong>{money(totalDebt)}</strong></div></section>
      <section className="customer-table-card">
        <div className="customer-table-scroll"><table className="customer-table"><thead><tr><th>Tên khách hàng</th><th>Số điện thoại</th><th>Email</th><th>Địa chỉ</th><th>Mã số thuế</th><th>Người liên hệ</th><th>Ghi chú</th><th>Thao tác</th></tr></thead>
          <tbody>{visible.map((customer) => <tr key={customer.id}><td><button className="customer-name" onClick={() => { setEditing(customer); setFormOpen(true) }}>{customer.name}</button></td><td>{customer.phone}</td><td>{customer.email}</td><td className="customer-address">{customer.address}</td><td>{customer.tax}</td><td>{customer.contact}</td><td className="customer-note">{customer.note}</td><td className="customer-actions"><ActionIcon icon="add" tone="green" label="Thêm công nợ" onClick={() => setDebtCustomer(customer)} /><ActionIcon icon="edit" label="Sửa khách hàng" onClick={() => { setEditing(customer); setFormOpen(true) }} /><ActionIcon icon="trash" tone="red" label="Xóa khách hàng" onClick={() => setPendingDelete(customer)} /></td></tr>)}</tbody>
        </table>{!visible.length && <div className="customers-empty">Không tìm thấy khách hàng phù hợp.</div>}</div>
        <div className="customer-toolbar"><span>Hiển thị {visible.length ? (page - 1) * perPage + 1 : 0}-{Math.min(page * perPage, filtered.length)} của {filtered.length} khách hàng</span><div className="customer-pages"><button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button className={page === item ? 'active' : ''} key={item} onClick={() => setPage(item)}>{item}</button>)}<button disabled={page === pageCount} onClick={() => setPage(page + 1)}>›</button></div></div>
      </section>
      {formOpen && <CustomerForm customer={editing} onClose={() => setFormOpen(false)} onSave={saveCustomer} />}
      {debtCustomer && <DebtForm customer={debtCustomer} onClose={() => setDebtCustomer(undefined)} onSave={(amount) => { setCustomers(customers.map((item) => item.id === debtCustomer.id ? { ...item, debt: item.debt + amount } : item)); setDebtCustomer(undefined); notify('Đã thêm công nợ') }} />}
      {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa khách hàng “${pendingDelete.name}”? Thao tác này không thể hoàn tác.`} onCancel={() => setPendingDelete(undefined)} onConfirm={() => { setCustomers(customers.filter((item) => item.id !== pendingDelete.id)); setPendingDelete(undefined); notify('Đã xóa khách hàng') }} />}
      {toast && <div className="customer-toast">{toast}</div>}
    </main>
  )
}

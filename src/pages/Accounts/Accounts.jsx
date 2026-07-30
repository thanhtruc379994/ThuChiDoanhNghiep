import { useMemo, useState } from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Accounts.css'

const seedAccounts = [
  { name: 'TECHCOMBANK', type: 'Ngân hàng', number: '1903 6688 9999', opening: 0, balance: 327638611, icon: '▦', tone: 'bank' },
  { name: 'TPBANK', type: 'Ngân hàng', number: '0071 8833 2211', opening: 1678754, balance: 2416203, icon: '▦', tone: 'bank' },
  { name: 'MB BANK', type: 'Ngân hàng', number: '6868 0202 5555', opening: 859416, balance: 859416, icon: '▦', tone: 'bank' },
  { name: 'SEABANK', type: 'Ngân hàng', number: '9900 4422 1100', opening: 0, balance: 1376785, icon: '▦', tone: 'bank' },
  { name: 'EXIMBANK', type: 'Ngân hàng', number: '2200 8188 6633', opening: 1901026, balance: 1842298, icon: '▦', tone: 'bank' },
  { name: 'SQTM', type: 'Tiền mặt', number: 'Quỹ tiền mặt', opening: 2776999, balance: 4661921, icon: '▣', tone: 'cash' },
  { name: 'Tổng Giám Đốc', type: 'Tiền mặt', number: 'Quỹ tạm ứng', opening: 0, balance: 391123905, icon: '◆', tone: 'wallet' },
  { name: 'VAY TECHCOMBANK', type: 'Hạn mức vay', number: 'HĐTD 2026', opening: 0, balance: 5122095835, icon: '$', tone: 'loan' },
]

const history = [
  { date: '15/05/2026', type: 'Thu', amount: 125000000, balance: 327638611, category: 'Hợp đồng', content: 'Thanh toán dự án Vinfast' },
  { date: '14/05/2026', type: 'Chi', amount: 45279091, balance: 202638611, category: 'Nhà cung cấp', content: 'Thanh toán hợp đồng vật tư' },
  { date: '12/05/2026', type: 'Chi', amount: 16670000, balance: 247917702, category: 'Chi phí', content: 'Chi phí thi công dự án' },
  { date: '10/05/2026', type: 'Thu', amount: 85000000, balance: 264587702, category: 'Doanh thu', content: 'Khách hàng chuyển khoản' },
]

const money = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`

const numberToVietnamese = (value) => {
  if (!value) return 'Không đồng'
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ']
  const readGroup = (number, full) => {
    const hundred = Math.floor(number / 100)
    const ten = Math.floor((number % 100) / 10)
    const one = number % 10
    const words = []
    if (hundred || full) words.push(`${digits[hundred]} trăm`)
    if (ten > 1) {
      words.push(`${digits[ten]} mươi`)
      if (one === 1) words.push('mốt')
      else if (one === 5) words.push('lăm')
      else if (one) words.push(digits[one])
    } else if (ten === 1) {
      words.push('mười')
      if (one === 5) words.push('lăm')
      else if (one) words.push(digits[one])
    } else if (one) {
      if (hundred || full) words.push('lẻ')
      words.push(digits[one])
    }
    return words.join(' ')
  }
  const groups = []
  let number = Math.round(Math.abs(value))
  while (number > 0) {
    groups.push(number % 1000)
    number = Math.floor(number / 1000)
  }
  const result = []
  for (let index = groups.length - 1; index >= 0; index -= 1) {
    if (groups[index]) result.push(readGroup(groups[index], index < groups.length - 1 && groups[index] < 100), units[index])
  }
  const text = result.join(' ').replace(/\s+/g, ' ').trim()
  return `${text.charAt(0).toUpperCase()}${text.slice(1)} đồng chẵn`
}

function AccountForm({ account, onClose, onSave }) {
  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      ...account,
      name: form.get('name'),
      type: form.get('type'),
      number: form.get('number'),
      opening: Number(form.get('opening')) || 0,
      balance: account?.balance ?? (Number(form.get('opening')) || 0),
      icon: form.get('type') === 'Ngân hàng' ? '▦' : '▣',
      tone: form.get('type') === 'Ngân hàng' ? 'bank' : 'cash',
    })
  }

  return (
    <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="account-form-modal" role="dialog" aria-modal="true">
        <header><h2>{account ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h2><button onClick={onClose}>×</button></header>
        <form onSubmit={submit}>
          <label>Tên tài khoản: <b>*</b><input required name="name" defaultValue={account?.name} placeholder="Nhập tên tài khoản" /></label>
          <label>Loại tài khoản: <b>*</b><select name="type" defaultValue={account?.type || 'Ngân hàng'}><option>Ngân hàng</option><option>Tiền mặt</option><option>Hạn mức vay</option></select></label>
          <label>Số tài khoản / Mô tả:<input name="number" defaultValue={account?.number} placeholder="Nhập số tài khoản" /></label>
          <label>Số dư đầu kỳ:<input name="opening" type="number" defaultValue={account?.opening || 0} /></label>
          <footer><button type="button" onClick={onClose}>Hủy</button><button type="submit">Lưu tài khoản</button></footer>
        </form>
      </section>
    </div>
  )
}

function AccountDetails({ account, onClose, notify }) {
  const [query, setQuery] = useState('')
  const [transactions, setTransactions] = useIndexedDbState(`account-transactions:${account.name}`, history.map((item, index) => ({
    ...item,
    id: index + 1,
    paid: index === 1 ? Math.round(item.amount * .7) : item.amount,
    counterparty: index % 2 ? '(NCC000020) ĐINH VĂN VÕ - TP ĐIỆN NƯỚC' : '(NCC000111) CÔNG TY CỔ PHẦN HÀNG KHÔNG VIETJET',
  })))
  const [type, setType] = useState('Tất cả')
  const [pendingDelete, setPendingDelete] = useState(undefined)
  const [editingRow, setEditingRow] = useState(undefined)
  const rows = useMemo(() => transactions.filter((item) =>
    (type === 'Tất cả' || item.type === type) &&
    `${item.content} ${item.category} ${item.counterparty}`.toLowerCase().includes(query.toLowerCase())
  ), [transactions, query, type])
  const printRow = (row) => {
    const printWindow = window.open('', '_blank', 'width=860,height=720')
    if (!printWindow) {
      notify('Trình duyệt đang chặn cửa sổ in')
      return
    }
    const isReceipt = row.type === 'Thu'
    const voucherName = isReceipt ? 'PHIẾU THU' : 'PHIẾU CHI'
    const personLabel = row.type === 'Thu' ? 'Họ tên người nộp tiền' : 'Họ tên người nhận tiền'
    const words = numberToVietnamese(row.amount)
    const voucher = (copy) => `<section class="voucher"><div class="copy">${copy}</div><div class="top"><div><b>ĐƠN VỊ: CÔNG TY CỔ PHẦN ĐẦU TƯ PHÁT TRIỂN</b><span>Địa chỉ: Tầng 1, đơn nguyên A, tòa nhà Bx</span><span>Khu đô thị mới, phường Định Công, thành phố Hà Nội</span></div><div><b>Mẫu số ${isReceipt ? '01' : '02'} - TT</b><span>(Ban hành theo Thông tư số 99/2025/TT-BTC)</span><span>Ngày 27/10/2025 của Bộ trưởng BTC)</span><p>Quyển số: <i></i></p><p>Số: <i></i></p><p>Nợ: <i></i></p><p>Có: <i></i></p></div></div><h1>${voucherName}</h1><div class="date">Ngày ${row.date.slice(0, 2)} tháng ${row.date.slice(3, 5)} năm ${row.date.slice(6)}</div><div class="lines"><p><b>${personLabel}:</b><span><strong>${row.counterparty}</strong></span></p><p><b>Địa chỉ:</b><span>Thành phố Hà Nội, Việt Nam</span></p><p><b>Lý do ${isReceipt ? 'thu' : 'chi'}:</b><span><strong>${row.content}</strong></span></p><p><b>Số tiền:</b><span><strong>${money(row.amount)}</strong> &nbsp; (Viết bằng chữ):</span></p><div class="words">${words}./.</div><p><b>Kèm theo:</b><span>.......................................................... Chứng từ gốc.</span></p></div><div class="signed-date">Ngày ${row.date.slice(0, 2)} tháng ${row.date.slice(3, 5)} năm ${row.date.slice(6)}</div><div class="signatures"><div><b>Giám đốc</b><i>(Ký, họ tên, đóng dấu)</i></div><div><b>Kế toán trưởng</b><i>(Ký, họ tên)</i></div><div><b>Thủ quỹ</b><i>(Ký, họ tên)</i></div><div><b>Người lập phiếu</b><i>(Ký, họ tên)</i></div><div><b>${isReceipt ? 'Người nộp tiền' : 'Người nhận tiền'}</b><i>(Ký, họ tên)</i></div></div><div class="received">Đã nhận đủ số tiền (viết bằng chữ):<strong>${words}./.</strong></div></section>`
    printWindow.document.write(`<!doctype html><html><head><title>${voucherName}</title><style>@page{size:A4 portrait;margin:8mm}*{box-sizing:border-box}body{margin:0;color:#000;font-family:Arial,sans-serif}.voucher{position:relative;min-height:281mm;padding:12mm 8mm;page-break-after:always;page-break-inside:avoid}.voucher:last-child{page-break-after:auto}.copy{position:absolute;top:5mm;right:8mm;font-size:11px;font-style:italic}.top{display:grid;grid-template-columns:1fr 1fr;font-size:10px;line-height:1.5}.top>div:last-child{text-align:center}.top b,.top span{display:block}.top p{display:flex;justify-content:flex-end;gap:5px;margin:2px 0}.top p i{width:125px;border-bottom:1px dotted #222}.voucher h1{margin:-8px 0 0;text-align:center;font-size:24px}.date{text-align:center;margin-top:4px;font-size:12px;font-style:italic}.lines{margin-top:28px;font-size:12px}.lines p{display:grid;grid-template-columns:175px 1fr;margin:10px 0}.lines span{min-height:18px;border-bottom:1px dotted #555}.words{margin:10px 30px 12px;font-size:13px;font-style:italic;font-weight:700}.signed-date{margin:15px 45px 0;text-align:right;font-size:11px;font-style:italic}.signatures{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:9px;text-align:center;font-size:10px}.signatures b,.signatures i{display:block}.signatures i{margin-top:4px;font-weight:400}.received{position:absolute;left:8mm;right:8mm;bottom:22mm;padding-top:8px;border-top:1px dashed #555;font-size:11px}.received strong{display:block;margin:12px 28px;font-size:12px;font-style:italic}@media screen{body{width:210mm;margin:auto;background:#ddd}.voucher{margin-bottom:12px;background:#fff}}</style></head><body>${voucher('Liên 1: Lưu tại công ty')}${voucher('Liên 2: Giao khách hàng')}</body></html>`)
    printWindow.document.close()
    window.setTimeout(() => printWindow.print(), 250)
  }
  const saveRow = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const updated = { ...editingRow, category: form.get('category'), amount: Number(form.get('amount')) || 0, paid: Number(form.get('paid')) || 0, counterparty: form.get('counterparty'), content: form.get('content') }
    setTransactions(transactions.map((item) => item.id === updated.id ? updated : item))
    setEditingRow(undefined)
    notify('Đã cập nhật giao dịch')
  }
  return (
    <div className="account-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="account-details" role="dialog" aria-modal="true">
        <header><h2>Chi tiết giao dịch - {account.name}</h2><button onClick={onClose}>×</button></header>
        <div className="account-detail-body">
          <section className="detail-filter-panel">
            <div className="detail-filters">
              <label><span>Số dư lũy kế đến ngày:</span><input type="date" defaultValue="2026-05-15" /></label>
              <label><span>Loại giao dịch:</span><select value={type} onChange={(event) => setType(event.target.value)}><option>Tất cả</option><option>Thu</option><option>Chi</option></select></label>
              <label className="detail-search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm..." /></label>
            </div>
            <div className="cumulative-balance">Số dư lũy kế: <strong>{money(account.balance)}</strong></div>
          </section>
          <div className="detail-table-scroll"><table><thead><tr><th>Ngày</th><th>Loại</th><th>Danh mục</th><th>Số tiền</th><th>Đã thanh toán</th><th>Chưa thanh toán</th><th>Đối ứng</th><th>Thao tác</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id}><td>{row.date}</td><td>{row.type}</td><td>{row.category}</td><td className={row.type === 'Thu' ? 'account-in' : 'account-out'}>{row.type === 'Thu' ? '+' : '-'} {money(row.amount)}</td><td>{money(row.paid)}</td><td>{money(Math.max(0, row.amount - row.paid))}</td><td>{row.counterparty}</td><td><div className="account-detail-actions"><ActionIcon icon="print" tone="green" label="In giao dịch" onClick={() => printRow(row)} /><ActionIcon icon="edit" label="Sửa giao dịch" onClick={() => setEditingRow(row)} /><ActionIcon icon="trash" tone="red" label="Xóa giao dịch" onClick={() => setPendingDelete(row)} /></div></td></tr>)}</tbody>
          </table></div>
        </div>
        <footer><button onClick={onClose}>Đóng</button></footer>
        {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa giao dịch ngày ${pendingDelete.date}?`} onCancel={() => setPendingDelete(undefined)} onConfirm={() => { setTransactions(transactions.filter((item) => item.id !== pendingDelete.id)); setPendingDelete(undefined); notify('Đã xóa giao dịch') }} />}
        {editingRow && <div className="account-transaction-edit-overlay" onMouseDown={(event) => event.target === event.currentTarget && setEditingRow(undefined)}><section className="account-transaction-edit"><header><h2>Sửa giao dịch</h2><button onClick={() => setEditingRow(undefined)}>×</button></header><form onSubmit={saveRow}>
          <label>Danh mục:<input name="category" defaultValue={editingRow.category} /></label>
          <label>Số tiền:<input name="amount" type="number" min="0" defaultValue={editingRow.amount} /></label>
          <label>Đã thanh toán:<input name="paid" type="number" min="0" defaultValue={editingRow.paid} /></label>
          <label>Đối ứng:<input name="counterparty" defaultValue={editingRow.counterparty} /></label>
          <label className="edit-row-full">Nội dung:<textarea name="content" rows="3" defaultValue={editingRow.content} /></label>
          <footer><button type="button" onClick={() => setEditingRow(undefined)}>Hủy</button><button type="submit">Lưu thay đổi</button></footer>
        </form></section></div>}
      </section>
    </div>
  )
}

export default function Accounts() {
  const [accounts, setAccounts] = useIndexedDbState('accounts', seedAccounts)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(undefined)
  const [details, setDetails] = useState(undefined)
  const [toast, setToast] = useState('')
  const [pendingDelete, setPendingDelete] = useState(undefined)
  const openingTotal = accounts.reduce((sum, item) => sum + item.opening, 0)
  const balanceTotal = accounts.reduce((sum, item) => sum + item.balance, 0)

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2000)
  }

  const save = (data) => {
    setAccounts(editing ? accounts.map((item) => item === editing ? data : item) : [data, ...accounts])
    setFormOpen(false)
    notify(editing ? 'Đã cập nhật tài khoản' : 'Đã thêm tài khoản')
  }

  return (
    <main className="accounts-page">
      <header className="accounts-header"><h2>Quản lý tài khoản</h2><div><button className="add-account" onClick={() => { setEditing(undefined); setFormOpen(true) }}>＋ Thêm tài khoản</button><NotificationBell className="accounts-bell" count={15} /></div></header>
      <section className="balance-summary">
        <div><span>Tổng số dư đầu kỳ</span><strong>{money(openingTotal)}</strong></div>
        <div><span>Tổng số dư hiện tại</span><strong>{money(balanceTotal)}</strong></div>
      </section>
      <section className="account-grid">
        {accounts.map((account) => (
          <article className="account-card" key={account.name}>
            <header><span className={`account-icon ${account.tone}`}>{account.icon}</span><div><h3>{account.name}</h3><p>{account.type} · {account.number}</p></div></header>
            <div className="account-balances"><span>Số dư đầu kỳ <b>{money(account.opening)}</b></span><span>Số dư hiện tại <strong>{money(account.balance)}</strong></span></div>
            <footer>
              <ActionIcon icon="add" tone="green" label="Thêm giao dịch" onClick={() => notify(`Thêm giao dịch cho ${account.name}`)} />
              <ActionIcon icon="list" label="Xem chi tiết" onClick={() => setDetails(account)} />
              <ActionIcon icon="edit" label="Chỉnh sửa" onClick={() => { setEditing(account); setFormOpen(true) }} />
              <ActionIcon icon="trash" tone="red" label="Xóa" onClick={() => setPendingDelete(account)} />
            </footer>
          </article>
        ))}
      </section>
      {formOpen && <AccountForm account={editing} onClose={() => setFormOpen(false)} onSave={save} />}
      {details && <AccountDetails account={details} onClose={() => setDetails(undefined)} notify={notify} />}
      {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa tài khoản “${pendingDelete.name}”? Thao tác này không thể hoàn tác.`} onCancel={() => setPendingDelete(undefined)} onConfirm={() => { setAccounts(accounts.filter((item) => item !== pendingDelete)); setPendingDelete(undefined); notify('Đã xóa tài khoản') }} />}
      {toast && <div className="account-toast">{toast}</div>}
    </main>
  )
}

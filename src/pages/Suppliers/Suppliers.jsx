import {useMemo, useState} from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Suppliers.css'

const supplierProfiles = [
    {email: 'linhnt@example.com', address: 'Thanh Hóa', tax: ''},
    {email: 'ainguyen@example.com', address: 'Hà Nội', tax: ''},
    {email: 'votathach@example.com', address: 'Hà Tĩnh', tax: '0201000658041'},
    {email: 'ngoainguyen@example.com', address: 'Thanh Hóa', tax: ''},
    {email: 'kienpham@example.com', address: 'Hà Nội', tax: ''},
    {email: 'tindung@tpbank.com.vn', address: '57 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', tax: '0102744865'},
    {
        email: 'contact@ngoisaodo.vn',
        address: '1/20B Đường số 49, Khu phố 6, Phường Hiệp Bình, TP Hồ Chí Minh, Việt Nam',
        tax: '318410294'
    },
    {
        email: 'contact@neotech.vn',
        address: 'Thôn Dương, Xã Đông Việt, Tỉnh Bắc Ninh, Việt Nam',
        tax: '2400959098'
    }
]

const seedSuppliers = [
    {
        id: 1,
        name: 'NGUYỄN THÙY LINH',
        phone: '0987 665 332',
        contact: 'Nguyễn Thùy Linh',
        note: 'Vay cá nhân',
        type: 'Vay/Tín dụng',
        total: 8957600000,
        paid: 3299500000
    },
    {
        id: 2,
        name: 'NGUYỄN THỊ ÁI',
        phone: '0902 585 117',
        contact: 'Nguyễn Thị Ái',
        note: 'Vay cá nhân',
        type: 'Vay/Tín dụng',
        total: 3000000000,
        paid: 0
    },
    {
        id: 3,
        name: 'VÕ TẤ THẠCH - TP QUẢNG CÁO',
        phone: '0913 552 210',
        contact: 'Võ Tất Thạch',
        note: 'Ngày sinh: 26/02/1991. Số CCCD: 042091003092. STK Vietcombank',
        type: 'Nhà cung cấp',
        total: 1807149788,
        paid: 300000000
    },
    {
        id: 4,
        name: 'BÀ NGOẠI',
        phone: '0912 000 238',
        contact: 'Nguyễn Thị Hồng',
        note: 'Vay cá nhân',
        type: 'Vay/Tín dụng',
        total: 1500000000,
        paid: 0
    },
    {
        id: 5,
        name: 'PHẠM TRUNG KIÊN',
        phone: '0984 886 692',
        contact: 'Phạm Trung Kiên',
        note: 'KHOẢN VAY NGOÀI (MB)',
        type: 'Vay/Tín dụng',
        total: 1041540117,
        paid: 72241870
    },
    {
        id: 6,
        name: 'NGÂN HÀNG TMCP TIÊN PHONG - TP BANK',
        phone: '1900 585 885',
        contact: 'Phòng tín dụng',
        note: 'Khoản vay doanh nghiệp',
        type: 'Vay/Tín dụng',
        total: 1094699059,
        paid: 226865721
    },
    {
        id: 7,
        name: 'CÔNG TY TNHH ĐẦU TƯ THƯƠNG MẠI NGÔI SAO ĐỎ',
        phone: '024 3768 9911',
        contact: 'Võ Thùy Linh',
        note: '15/04/2024. Đại diện: Võ Thùy Linh',
        type: 'Nhà cung cấp',
        total: 2728394053,
        paid: 2070776815
    },
    {
        id: 8,
        name: 'CÔNG TY TNHH XÂY DỰNG & TRIỂN KHAI CÔNG NGHỆ MỚI NEOTECH',
        phone: '024 3555 8828',
        contact: 'Nguyễn Văn Thao',
        note: 'Đại diện: Ông Nguyễn Văn Thao. Chức vụ: Giám đốc',
        type: 'Nhà cung cấp',
        total: 798600000,
        paid: 217800000
    },
].map((supplier, index) => ({...supplier, ...supplierProfiles[index]}))

const money = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`

function SupplierForm({supplier, onClose, onSave}) {
    const submit = (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        onSave({
            ...supplier,
            name: form.get('name'),
            phone: form.get('phone'),
            email: form.get('email'),
            address: form.get('address'),
            tax: form.get('tax'),
            contact: form.get('contact'),
            note: form.get('note'),
            type: form.get('type'),
            total: supplier?.total || 0,
            paid: supplier?.paid || 0
        })
    }
    return <div className="supplier-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="supplier-modal">
            <header><h2>{supplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h2>
                <button onClick={onClose}>×</button>
            </header>
            <form onSubmit={submit}>
                <label className="supplier-field supplier-field--full">Tên nhà cung cấp: <b>*</b><input required
                                                                                                        name="name"
                                                                                                        defaultValue={supplier?.name}/></label>
                <label className="supplier-field">Số điện thoại:<input name="phone"
                                                                       defaultValue={supplier?.phone}/></label>
                <label className="supplier-field">Email:<input name="email" type="email"
                                                               defaultValue={supplier?.email}/></label>
                <label className="supplier-field supplier-field--full">Địa chỉ:<input name="address"
                                                                                       defaultValue={supplier?.address}/></label>
                <label className="supplier-field">Mã số thuế:<input name="tax"
                                                                    defaultValue={supplier?.tax}/></label>
                <label className="supplier-field">Người liên hệ:<input name="contact" defaultValue={supplier?.contact}/></label>
                <label className="supplier-field">Phân loại:<select name="type"
                                                                    defaultValue={supplier?.type || 'Nhà cung cấp'}>
                    <option>Nhà cung cấp</option>
                    <option>Vay/Tín dụng</option>
                </select></label>
                <label className="supplier-field supplier-field--full">Ghi chú:<textarea rows="4" name="note"
                                                                                         defaultValue={supplier?.note}/></label>
                <footer>
                    <button type="button" onClick={onClose}>Hủy</button>
                    <button type="submit">Lưu nhà cung cấp</button>
                </footer>
            </form>
        </section>
    </div>
}

function PaymentForm({supplier, onClose, onSave}) {
    const debt = supplier.total - supplier.paid
    const submit = (event) => {
        event.preventDefault();
        onSave(Number(new FormData(event.currentTarget).get('amount')) || 0)
    }
    return <div className="supplier-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="supplier-payment">
            <header><h2>Ghi nhận thanh toán</h2>
                <button onClick={onClose}>×</button>
            </header>
            <form onSubmit={submit}><strong>{supplier.name}</strong><p>Công nợ hiện tại: <b>{money(debt)}</b></p><label>Số
                tiền thanh toán:<input required name="amount" type="number" min="1" max={debt}/></label><label>Nội dung:<textarea
                rows="3" defaultValue="Thanh toán công nợ nhà cung cấp"/></label>
                <footer>
                    <button type="button" onClick={onClose}>Hủy</button>
                    <button type="submit">Xác nhận</button>
                </footer>
            </form>
        </section>
    </div>
}

function DebtDetails({supplier, onClose, notify}) {
    const [query, setQuery] = useState('')
    const [pendingRow, setPendingRow] = useState(undefined)
    const [rows, setRows] = useIndexedDbState(`supplier-debts:${supplier.name}`, [
        {
            id: 1,
            date: '15/05/2026',
            category: 'Hợp đồng',
            amount: Math.round(supplier.total * .38),
            paid: Math.round(supplier.paid * .55),
            invoice: 'HĐ-001',
            status: 'Thanh toán một phần',
            note: 'Thanh toán theo tiến độ hợp đồng'
        },
        {
            id: 2,
            date: '28/04/2026',
            category: 'Vật tư',
            amount: Math.round(supplier.total * .27),
            paid: Math.round(supplier.paid * .25),
            invoice: 'HĐ-002',
            status: 'Thanh toán một phần',
            note: 'Mua vật tư dự án'
        },
        {
            id: 3,
            date: '10/04/2026',
            category: 'Dịch vụ',
            amount: Math.round(supplier.total * .2),
            paid: Math.round(supplier.paid * .2),
            invoice: 'HĐ-003',
            status: 'Đã thanh toán',
            note: 'Chi phí dịch vụ triển khai'
        },
        {
            id: 4,
            date: '22/03/2026',
            category: 'Nhân công',
            amount: Math.round(supplier.total * .15),
            paid: 0,
            invoice: 'HĐ-004',
            status: 'Chưa thanh toán',
            note: 'Chi phí nhân công'
        },
    ])
    const visible = rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase())))
    const totalDebt = rows.reduce((sum, row) => sum + Math.max(0, row.amount - row.paid), 0)
    const exportDebt = () => {
        const data = [['Ngày', 'Danh mục', 'Số tiền', 'Đã thanh toán', 'Chưa thanh toán', 'Số hóa đơn', 'Trạng thái', 'Ghi chú'], ...visible.map((r) => [r.date, r.category, r.amount, r.paid, r.amount - r.paid, r.invoice, r.status, r.note])]
        const csv = data.map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
        const link = document.createElement('a')
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8'}))
        link.download = `cong-no-${supplier.name}.csv`
        link.click()
        URL.revokeObjectURL(link.href)
        notify('Đã xuất chi tiết công nợ')
    }
    return <div className="supplier-overlay supplier-debt-overlay"
                onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <section className="supplier-debt-modal">
            <header>
                <div><h2>Công nợ phải trả - {supplier.name}</h2><p>Tổng công nợ: <strong>{money(totalDebt)}</strong></p>
                </div>
                <button onClick={onClose}>×</button>
            </header>
            <div className="supplier-debt-tools">
                <button onClick={exportDebt}>Xuất Excel</button>
                <label>⌕<input value={query} onChange={(event) => setQuery(event.target.value)}
                               placeholder="Tìm kiếm công nợ..."/></label><select>
                <option>Tất cả trạng thái</option>
                <option>Chưa thanh toán</option>
                <option>Thanh toán một phần</option>
                <option>Đã thanh toán</option>
            </select></div>
            <div className="supplier-debt-scroll">
                <table>
                    <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Danh mục</th>
                        <th>Số tiền</th>
                        <th>Đã thanh toán</th>
                        <th>Chưa thanh toán</th>
                        <th>Số hóa đơn</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {visible.map((row) => <tr key={row.id}>
                        <td>{row.date}</td>
                        <td>{row.category}</td>
                        <td className="debt-purple">{money(row.amount)}</td>
                        <td className="debt-green">{money(row.paid)}</td>
                        <td className="debt-red">{money(Math.max(0, row.amount - row.paid))}</td>
                        <td>{row.invoice}</td>
                        <td><span
                            className={`debt-status debt-status--${row.status.replaceAll(' ', '-').toLowerCase()}`}>{row.status}</span>
                        </td>
                        <td>{row.note}</td>
                        <td className="debt-row-actions"><ActionIcon icon="edit" label="Sửa công nợ"
                                                                     onClick={() => notify('Đã chọn sửa khoản công nợ')}/><ActionIcon
                            icon="trash" tone="red" label="Xóa công nợ" onClick={() => setPendingRow(row)}/></td>
                    </tr>)}
                    </tbody>
                </table>
            </div>
            <footer><span>Hiển thị 1-{visible.length} của {rows.length} giao dịch</span>
                <button onClick={onClose}>Đóng</button>
            </footer>
            {pendingRow &&
                <ConfirmDialog message={`Bạn có chắc muốn xóa khoản công nợ hóa đơn “${pendingRow.invoice}”?`}
                               onCancel={() => setPendingRow(undefined)} onConfirm={() => {
                    setRows(rows.filter((row) => row.id !== pendingRow.id));
                    setPendingRow(undefined);
                    notify('Đã xóa khoản công nợ')
                }}/>}
        </section>
    </div>
}

export default function Suppliers() {
    const [suppliers, setSuppliers] = useIndexedDbState('suppliers', seedSuppliers)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [editing, setEditing] = useState(undefined)
    const [formOpen, setFormOpen] = useState(false)
    const [paying, setPaying] = useState(undefined)
    const [pendingDelete, setPendingDelete] = useState(undefined)
    const [toast, setToast] = useState('')
    const [debtDetails, setDebtDetails] = useState(undefined)
    const perPage = 5
    const filtered = useMemo(() => suppliers.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))), [suppliers, query])
    const pages = Math.max(1, Math.ceil(filtered.length / perPage))
    const visible = filtered.slice((page - 1) * perPage, page * perPage)
    const debtNcc = suppliers.filter((item) => item.type === 'Nhà cung cấp').reduce((sum, item) => sum + item.total - item.paid, 0)
    const debtLoan = suppliers.filter((item) => item.type === 'Vay/Tín dụng').reduce((sum, item) => sum + item.total - item.paid, 0)
    const notify = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(''), 2000)
    }
    const save = (data) => {
        setSuppliers(editing ? suppliers.map((item) => item.id === editing.id ? data : item) : [{
            ...data,
            id: Date.now()
        }, ...suppliers])
        setFormOpen(false);
        notify(editing ? 'Đã cập nhật nhà cung cấp' : 'Đã thêm nhà cung cấp')
    }
    const exportExcel = () => {
        const rows = [['Nhà cung cấp', 'Số điện thoại', 'Email', 'Địa chỉ', 'Mã số thuế', 'Người liên hệ', 'Ghi chú', 'Tổng số tiền', 'Đã thanh toán', 'Công nợ'], ...filtered.map((s) => [s.name, s.phone, s.email, s.address, s.tax, s.contact, s.note, s.total, s.paid, s.total - s.paid])]
        const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8'}));
        link.download = 'nha-cung-cap.csv';
        link.click();
        URL.revokeObjectURL(link.href);
        notify('Đã xuất danh sách nhà cung cấp')
    }

    return <main className="suppliers-page">
        <header className="suppliers-header"><h2>Quản lý nhà cung cấp</h2>
            <div>
                <button className="export-suppliers" onClick={exportExcel}>Xuất Excel</button>
                <button className="add-supplier" onClick={() => {
                    setEditing(undefined);
                    setFormOpen(true)
                }}>＋ Thêm nhà cung cấp
                </button>
                <NotificationBell className="suppliers-bell" count={23} />
            </div>
        </header>
        <section className="supplier-summary"><label><span>⌕</span><input value={query} onChange={(event) => {
            setQuery(event.target.value);
            setPage(1)
        }} placeholder="Tìm kiếm nhà cung cấp..."/></label>
            <div><span>Tổng công nợ phải trả:</span><strong>{money(debtNcc + debtLoan)}</strong>
                <p>NCC: <b>{money(debtNcc)}</b></p><p>Vay/Tín dụng: <b>{money(debtLoan)}</b></p></div>
        </section>
        <section className="supplier-table-card">
            <div className="supplier-table-scroll">
                <table className="supplier-table">
                    <thead>
                    <tr>
                        <th>Tên nhà cung cấp</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Địa chỉ</th>
                        <th>Mã số thuế</th>
                        <th>Người liên hệ</th>
                        <th>Ghi chú</th>
                        <th>Tổng số tiền</th>
                        <th>Đã thanh toán</th>
                        <th>Công nợ</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>{visible.map((supplier) => <tr key={supplier.id}>
                        <td>
                            <button className="supplier-name" onClick={() => {
                                setEditing(supplier);
                                setFormOpen(true)
                            }}>{supplier.name}</button>
                        </td>
                        <td>{supplier.phone}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.address}</td>
                        <td>{supplier.tax}</td>
                        <td>{supplier.contact}</td>
                        <td>{supplier.note}</td>
                        <td className="supplier-total">{money(supplier.total)}</td>
                        <td className="supplier-paid">{money(supplier.paid)}</td>
                        <td className="supplier-debt">
                            <button
                                onClick={() => setDebtDetails(supplier)}>{money(supplier.total - supplier.paid)}</button>
                        </td>
                        <td className="supplier-actions"><ActionIcon icon="add" tone="green" label="Ghi nhận thanh toán"
                                                                     onClick={() => setPaying(supplier)}/><ActionIcon
                            icon="edit" label="Sửa nhà cung cấp" onClick={() => {
                            setEditing(supplier);
                            setFormOpen(true)
                        }}/><ActionIcon icon="trash" tone="red" label="Xóa nhà cung cấp"
                                        onClick={() => setPendingDelete(supplier)}/></td>
                    </tr>)}</tbody>
                </table>
            </div>
            <div className="supplier-toolbar">
                <span>Hiển thị {visible.length ? (page - 1) * perPage + 1 : 0}-{Math.min(page * perPage, filtered.length)} của {filtered.length} nhà cung cấp</span>
                <div className="supplier-pages">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                    {Array.from({length: pages}, (_, i) => i + 1).map((item) => <button
                        className={page === item ? 'active' : ''} key={item}
                        onClick={() => setPage(item)}>{item}</button>)}
                    <button disabled={page === pages} onClick={() => setPage(page + 1)}>›</button>
                </div>
            </div>
        </section>
        {formOpen && <SupplierForm supplier={editing} onClose={() => setFormOpen(false)} onSave={save}/>}
        {paying && <PaymentForm supplier={paying} onClose={() => setPaying(undefined)} onSave={(amount) => {
            setSuppliers(suppliers.map((item) => item.id === paying.id ? {...item, paid: item.paid + amount} : item));
            setPaying(undefined);
            notify('Đã ghi nhận thanh toán')
        }}/>}
        {debtDetails && <DebtDetails supplier={debtDetails} onClose={() => setDebtDetails(undefined)} notify={notify}/>}
        {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa nhà cung cấp “${pendingDelete.name}”?`}
                                         onCancel={() => setPendingDelete(undefined)} onConfirm={() => {
            setSuppliers(suppliers.filter((item) => item.id !== pendingDelete.id));
            setPendingDelete(undefined);
            notify('Đã xóa nhà cung cấp')
        }}/>}
        {toast && <div className="supplier-toast">{toast}</div>}
    </main>
}

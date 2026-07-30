import {useState} from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Transactions.css'

const transactions = [
    {
        date: '15/05/2026',
        type: 'Chi phí',
        category: '✈ Chi Công Tác',
        option: '—',
        project: 'Vinfast | Nhận diện tủ đổi pin XMĐ Đợt 1',
        before: '- 5.266.000',
        vat: '395.200',
        after: '- 5.661.200',
        account: 'TECHCOMBANK',
        object: 'CÔNG TY CỔ PHẦN HÀNG KHÔNG VIETJET',
        hasCashFlow: true
    },
    {
        date: '15/05/2026',
        type: 'Chi phí',
        category: '$ Hợp Đồng',
        option: '10%',
        project: 'Vincons | BB 148 Giảng Võ',
        before: '- 45.279.091',
        vat: '10%',
        after: '- 49.807.000',
        account: 'TECHCOMBANK',
        object: 'ĐINH VĂN VÕ - TP ĐIỆN NƯỚC',
        hasCashFlow: false
    },
    {
        date: '14/05/2026',
        type: 'Chi phí',
        category: '$ Hợp Đồng',
        option: '8%',
        project: 'Vinfast | Nhận diện tủ đổi pin XMĐ Đợt 1',
        before: '- 16.670.000',
        vat: '8%',
        after: '- 18.003.600',
        account: 'TECHCOMBANK',
        object: 'CÔNG TY TNHH PHỐI HỢP XANH',
        hasCashFlow: false
    },
    {
        date: '14/05/2026',
        type: 'Chi phí',
        category: '$ Hợp Đồng',
        option: '8%',
        project: 'Vinfast | Nhận diện biển bảng',
        before: '- 666.368.000',
        vat: '8%',
        after: '- 719.677.440',
        account: 'TECHCOMBANK',
        object: 'CÔNG TY CỔ PHẦN VINCONS',
        hasCashFlow: true
    },
    {
        date: '13/05/2026',
        type: 'Chi phí',
        category: '⚙ Vận hành',
        option: '8%',
        project: 'Chi phí văn phòng tháng 5',
        before: '- 3.850.000',
        vat: '8%',
        after: '- 4.158.000',
        account: 'ACB',
        object: 'KHẤU TRỪ THEO HỒ SƠ',
        hasCashFlow: false
    },
    {
        date: '12/05/2026',
        type: 'Doanh thu',
        category: '$ Hợp Đồng',
        option: '10%',
        project: 'Vinfast | Thi công showroom Hải Phòng',
        before: '125.000.000',
        vat: '10%',
        after: '137.500.000',
        account: 'TECHCOMBANK',
        object: 'TẬP ĐOÀN VINGROUP',
        hasCashFlow: true
    },
    {
        date: '11/05/2026',
        type: 'Chi phí',
        category: '▣ Vật tư',
        option: '8%',
        project: 'Vincons | BB 148 Giảng Võ',
        before: '- 28.350.000',
        vat: '8%',
        after: '- 30.618.000',
        account: 'MB BANK',
        object: 'NHÀ CUNG CẤP VẬT TƯ',
        hasCashFlow: false
    },
]

const periods = ['Tháng này', 'Quý này', 'Năm nay', 'Tùy chỉnh']

function SummaryCard({tone, icon, title, value, children}) {
    return (
        <article className={`summary-card ${tone}`}>
            <span className="summary-card__icon">{icon}</span>
            <div><h3>{title}</h3><strong>{value}</strong>{children}</div>
        </article>
    )
}

const readThreeDigits = (number, full) => {
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
    const hundred = Math.floor(number / 100)
    const ten = Math.floor((number % 100) / 10)
    const unit = number % 10
    const words = []
    if (hundred || full) words.push(`${digits[hundred]} trăm`)
    if (ten > 1) {
        words.push(`${digits[ten]} mươi`)
        if (unit === 1) words.push('mốt')
        else if (unit === 5) words.push('lăm')
        else if (unit) words.push(digits[unit])
    } else if (ten === 1) {
        words.push('mười')
        if (unit === 5) words.push('lăm')
        else if (unit) words.push(digits[unit])
    } else if (unit) {
        if (hundred || full) words.push('lẻ')
        words.push(digits[unit])
    }
    return words.join(' ')
}

const amountInWords = (value) => {
    if (!value) return 'Không đồng chẵn'
    const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ']
    const groups = []
    let remaining = Math.floor(Math.abs(value))
    while (remaining > 0) {
        groups.push(remaining % 1000)
        remaining = Math.floor(remaining / 1000)
    }
    const words = []
    for (let index = groups.length - 1; index >= 0; index -= 1) {
        if (!groups[index]) continue
        words.push(readThreeDigits(groups[index], index < groups.length - 1 && groups[index] < 100))
        if (units[index]) words.push(units[index])
    }
    const result = `${words.join(' ')} đồng chẵn`
    return result.charAt(0).toUpperCase() + result.slice(1)
}

function PaymentVoucher({transaction, copy, config}) {
    const amount = transaction.after.replace('-', '').trim()
    const amountValue = Number(transaction.after.replace(/\D/g, '')) || 0
    const [day = '15', month = '05', year = '2026'] = transaction.date.split('/')
    const isReceipt = transaction.type === 'Doanh thu'
    return (
        <section className="voucher">
            <div className="voucher__heading">
                <div><b>ĐƠN VỊ: {config.unit}</b><span>Địa chỉ: {config.address}</span></div>
                <div><b>Mẫu số 02 - TT</b><span>(Ban hành theo Thông tư số 200/2014/TT-BTC)</span><span>Ngày 22/12/2014 của Bộ Tài chính</span>
                </div>
            </div>
            <h1>{isReceipt ? 'PHIẾU THU' : 'PHIẾU CHI'}</h1>
            <p className="voucher__copy">({copy})</p>
            <p className="voucher__date">Ngày {day} tháng {month} năm {year}</p>
            <div className="voucher__details">
                <p><span>{isReceipt ? 'Họ tên người nộp tiền:' : 'Họ tên người nhận tiền:'}</span><i>{transaction.object}</i></p>
                <p><span>Địa chỉ:</span><i/></p>
                <p><span>{isReceipt ? 'Lý do thu:' : 'Lý do chi:'}</span><i>Thanh toán</i></p>
                <p><span>Số tiền:</span><i><b>{amount} VND</b> &nbsp; (Bằng chữ:
                    &nbsp;{amountInWords(amountValue)} ./.)</i></p>
                <p><span>Kèm theo:</span><i>............................................................ Chứng từ
                    gốc.</i></p>
            </div>
            <div className="voucher__signatures">
                {['Giám đốc', 'Kế toán trưởng', isReceipt ? 'Người nộp tiền' : 'Người nhận tiền', 'Người lập phiếu', 'Thủ quỹ'].map((title) => (
                    <div key={title}><b>{title}</b><span>(Ký, họ tên)</span></div>
                ))}
            </div>
        </section>
    )
}

function VoucherConfigModal({config, onClose, onSave}) {
    const submit = (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        onSave({unit: form.get('unit').trim(), address: form.get('address').trim()})
    }
    return (
        <div className="modal-backdrop voucher-config-backdrop"
             onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="voucher-config-modal" role="dialog" aria-modal="true"
                     aria-labelledby="voucher-config-title">
                <header>
                    <h2 id="voucher-config-title">☷ Thay đổi thông tin in</h2>
                    <button type="button" onClick={onClose} aria-label="Đóng">×</button>
                </header>
                <form onSubmit={submit}>
                    <label>Đơn vị:
                        <input name="unit" required defaultValue={config.unit}/>
                    </label>
                    <label>Địa chỉ:
                        <input name="address" required defaultValue={config.address}/>
                    </label>
                    <footer>
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">Lưu cấu hình</button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

function DisbursementModal({onClose, onSubmit}) {
    const [project, setProject] = useState('')
    const [supplier, setSupplier] = useState('')
    const [contract, setContract] = useState('')
    const [amount, setAmount] = useState('')
    const [allocations, setAllocations] = useState([])
    const [error, setError] = useState('')
    const total = allocations.reduce((sum, item) => sum + item.amount, 0)

    const addAllocation = () => {
        if (!project || !supplier || !contract || !Number(amount)) {
            setError('Vui lòng chọn đầy đủ dự án, nhà cung cấp, hợp đồng và nhập số tiền.')
            return
        }
        setAllocations([...allocations, {id: Date.now(), project, supplier, contract, amount: Number(amount)}])
        setProject('');
        setSupplier('');
        setContract('');
        setAmount('');
        setError('')
    }

    const finish = (event) => {
        event.preventDefault()
        if (!allocations.length) {
            setError('Vui lòng thêm ít nhất một hợp đồng cần giải ngân.')
            return
        }
        onSubmit(total)
    }

    return (
        <div className="disbursement-overlay"
             onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="disbursement-modal" role="dialog" aria-modal="true"
                     aria-labelledby="disbursement-title">
                <header><h2 id="disbursement-title">Giải ngân thanh toán trả thẳng NCC (Nhiều gói)</h2>
                    <button type="button" onClick={onClose}>×</button>
                </header>
                <form onSubmit={finish}>
                    <section className="loan-information">
                        <h3>1. Thông tin Khế ước giải ngân</h3>
                        <div className="loan-grid">
                            <label><span>Tài khoản vay (Hạn mức): <b>*</b></span><select required
                                                                                         defaultValue="VAY TECHCOMBANK">
                                <option>VAY TECHCOMBANK</option>
                                <option>VAY TPBANK</option>
                            </select></label>
                            <label><span>Mã Khế ước nhận nợ (Số LĐ): <b>*</b></span><input required
                                                                                           placeholder="VD: LĐ2525319170"/></label>
                            <div className="loan-limit-summary">
                                <span>Tổng hạn mức: <b>11.500.000.000 VND</b></span><span>Đã vay: <b>6.269.457.921 VND</b></span><span>Khả dụng: <strong>5.230.542.079 VND</strong></span>
                            </div>
                            <label><span>Ngày giải ngân: <b>*</b></span><input required type="date"
                                                                               defaultValue="2026-05-15"/></label>
                            <label><span>Thời hạn trả nợ gốc: <b>*</b></span><input required type="date"
                                                                                    defaultValue="2026-05-15"/></label>
                            <label
                                className="disbursement-total"><span>Tổng Số Tiền Giải Ngân (Chỉ đọc):</span><strong>{new Intl.NumberFormat('vi-VN').format(total)} VND</strong></label>
                        </div>
                    </section>

                    <section className="allocation-section">
                        <h3>2. Phân bổ thanh toán cho các Hợp đồng</h3>
                        <div className="allocation-entry">
                            <label>Dự án:<select value={project} onChange={(event) => setProject(event.target.value)}>
                                <option value="">Chọn dự án...</option>
                                <option>Vinfast | Tủ đổi pin XMĐ</option>
                                <option>Vincons | 148 Giảng Võ</option>
                                <option>Techcombank | Nhận diện</option>
                            </select></label>
                            <label>Nhà cung cấp:<select value={supplier}
                                                        onChange={(event) => setSupplier(event.target.value)}>
                                <option value="">Chọn NCC...</option>
                                <option>Nhà cung cấp 007</option>
                                <option>NEOTECH</option>
                                <option>Ngôi Sao Đỏ</option>
                            </select></label>
                            <label>Chọn hợp đồng còn nợ:<select value={contract}
                                                                onChange={(event) => setContract(event.target.value)}>
                                <option value="">-- Chọn hợp đồng --</option>
                                <option>HĐ-001/2026 - Vật tư</option>
                                <option>HĐ-002/2026 - Nhân công</option>
                            </select></label>
                            <label>Số tiền:<input type="number" min="1" value={amount}
                                                  onChange={(event) => setAmount(event.target.value)}
                                                  placeholder="Nhập số tiền..."/></label>
                            <button type="button" onClick={addAllocation}>＋ Thêm</button>
                        </div>
                        {error && <p className="disbursement-error">{error}</p>}
                        <div className="allocation-table-scroll">
                            <table className="allocation-table">
                                <thead>
                                <tr>
                                    <th>Dự án</th>
                                    <th>Nhà cung cấp</th>
                                    <th>Hợp đồng/Hạng mục</th>
                                    <th>Số tiền</th>
                                    <th>Xóa</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allocations.map((item) => <tr key={item.id}>
                                    <td>{item.project}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.contract}</td>
                                    <td>{new Intl.NumberFormat('vi-VN').format(item.amount)} VND</td>
                                    <td><ActionIcon icon="trash" tone="red" label="Xóa phân bổ"
                                                    onClick={() => setAllocations(allocations.filter((row) => row.id !== item.id))}/>
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                            {!allocations.length &&
                                <div className="allocation-empty">Chưa có hợp đồng nào được thêm vào Khế ước</div>}
                        </div>
                    </section>
                    <footer>
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">Thực hiện giải ngân LĐ</button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

function AttachmentModal({initialFiles, onClose, onComplete}) {
    const [files, setFiles] = useState(initialFiles)
    const [error, setError] = useState('')
    const acceptFiles = (fileList) => {
        const incoming = Array.from(fileList)
        const invalid = incoming.find((file) => !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) || file.size > 5 * 1024 * 1024)
        if (invalid) {
            setError('Chỉ hỗ trợ JPG, PNG, PDF và dung lượng tối đa 5MB/file.')
            return
        }
        setFiles([...files, ...incoming.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            size: file.size,
            type: file.type,
            file
        }))])
        setError('')
    }
    const sizeLabel = (size) => size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`
    return (
        <div className="attachment-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="attachment-modal" role="dialog" aria-modal="true" aria-labelledby="attachment-title">
                <header><h2 id="attachment-title">⌕ Đính kèm chứng từ</h2>
                    <button type="button" onClick={onClose}>×</button>
                </header>
                <div className="attachment-body">
                    <label className="attachment-dropzone" onDragOver={(event) => event.preventDefault()}
                           onDrop={(event) => {
                               event.preventDefault();
                               acceptFiles(event.dataTransfer.files)
                           }}>
                        <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf"
                               onChange={(event) => acceptFiles(event.target.files)}/>
                        <span className="attachment-cloud">☁</span>
                        <strong>Bấm vào đây để chọn Ảnh / File Scan</strong>
                        <small>Hỗ trợ: JPG, PNG, PDF (Tối đa 5MB/file)</small>
                    </label>
                    {error && <p className="attachment-error">{error}</p>}
                    <div className="attachment-list">
                        {!files.length ? <div className="attachment-empty">Chưa có tài liệu đính kèm
                            nào</div> : files.map((item) => (
                            <div className="attachment-item" key={item.id}>
                                <span
                                    className="attachment-file-icon">{item.type === 'application/pdf' ? 'PDF' : 'IMG'}</span>
                                <div><strong>{item.name}</strong><small>{sizeLabel(item.size)}</small></div>
                                {item.file && <button type="button"
                                                      onClick={() => window.open(URL.createObjectURL(item.file), '_blank')}>Xem</button>}
                                <ActionIcon icon="trash" tone="red" label="Xóa tài liệu"
                                            onClick={() => setFiles(files.filter((file) => file.id !== item.id))}/>
                      1      </div>
                        ))}
                    </div>
                </div>
                <footer>
                    <button type="button" onClick={() => onComplete(files)}>✓ Hoàn tất</button>
                </footer>
            </section>
        </div>
    )
}

function Transactions() {
    const [period, setPeriod] = useState('Tháng này')
    const [query, setQuery] = useState('')
    const [type, setType] = useState('Tất cả')
    const [toast, setToast] = useState('')
    const [page, setPage] = useState(1)
    const [rows, setRows] = useIndexedDbState('transactions', transactions)
    const [editing, setEditing] = useState(null)
    const [showInvoice, setShowInvoice] = useState(false)
    const [printing, setPrinting] = useState(null)
    const [pendingDelete, setPendingDelete] = useState(null)
    const [showDisbursement, setShowDisbursement] = useState(false)
    const [transactionKind, setTransactionKind] = useState('Chi phí')
    const [invoiceRemoved, setInvoiceRemoved] = useState(false)
    const [pendingInvoiceDelete, setPendingInvoiceDelete] = useState(false)
    const [attachmentOpen, setAttachmentOpen] = useState(false)
    const [attachments, setAttachments] = useState([])
    const [voucherConfigOpen, setVoucherConfigOpen] = useState(false)
    const [voucherConfig, setVoucherConfig] = useState({
        unit: 'CÔNG TY CỔ PHẦN ĐẦU TƯ PHÁT TRIỂN',
        address: 'A108 - B15'
    })

    const notify = (message) => {
        setToast(message)
        window.clearTimeout(notify.timer)
        notify.timer = window.setTimeout(() => setToast(''), 2300)
    }

    const openEditor = (row) => {
        setEditing(row)
        setTransactionKind(row.type || 'Chi phí')
        setInvoiceRemoved(false)
        setPendingInvoiceDelete(false)
        setShowInvoice(false)
    }

    const closeEditor = () => {
        setEditing(null)
        setShowInvoice(false)
    }

    const saveTransaction = (event) => {
        event.preventDefault()
        setRows(editing._new ? [{
            ...editing,
            type: transactionKind,
            _new: undefined
        }, ...rows] : rows.map((row) => row === editing ? {...row, type: transactionKind} : row))
        closeEditor()
        notify(editing._new ? 'Đã thêm giao dịch' : 'Đã lưu giao dịch')
    }

    const deleteTransaction = (row) => {
        setRows(rows.filter((item) => item !== row))
        notify('Đã xóa giao dịch')
    }

    const exportExcel = () => {
        const header = ['Ngày', 'Loại', 'Danh mục', 'Dự án', 'Trước thuế', 'VAT', 'Sau thuế', 'Tài khoản']
        const csv = [header, ...filtered.map((row) => [row.date, row.type, row.category, row.project, row.before, row.vat, row.after, row.account])]
            .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
        const link = document.createElement('a')
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8'}))
        link.download = 'giao-dich.csv'
        link.click()
        URL.revokeObjectURL(link.href)
        notify('Đã xuất danh sách giao dịch')
    }

    const printVoucher = (row) => {
        if (!row.hasCashFlow) {
            notify('Giao dịch chưa có dòng tiền thu chi nên chưa thể in phiếu')
            return
        }
        setPrinting(row)
        const finishPrinting = () => setPrinting(null)
        window.addEventListener('afterprint', finishPrinting, {once: true})
        window.setTimeout(() => window.print(), 80)
    }

    const filtered = rows.filter((item) =>
        (type === 'Tất cả' || item.type === type) &&
        Object.values(item).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))
    )

    return (
        <>
            <main className="content">
                <header className="page-header">
                    <h2>Quản lý giao dịch</h2>
                    <div className="page-actions">
                        <button className="action action--purple" onClick={() => setVoucherConfigOpen(true)}>
                            ▣ Phiếu Thu-Chi
                        </button>
                        <button className="action action--orange" onClick={() => setShowDisbursement(true)}>♨ Giải
                            ngân
                        </button>
                        <button className="action action--green" onClick={exportExcel}>Xuất Excel</button>
                        <button className="action action--blue" onClick={() => openEditor({
                            ...transactions[0],
                            _new: true,
                            date: '28/07/2026',
                            project: '',
                            before: '0',
                            after: '0'
                        })}>＋ Thêm giao dịch
                        </button>
                        <NotificationBell className="notification" count={23} />
                    </div>
                </header>

                <section className="filters">
                    <div className="periods">
                        {periods.map((item) => (
                            <button key={item} className={period === item ? 'is-selected' : ''}
                                    onClick={() => setPeriod(item)}>{item}</button>
                        ))}
                    </div>
                    <select value={type} onChange={(event) => setType(event.target.value)}
                            aria-label="Lọc loại giao dịch">
                        <option>Tất cả</option>
                        <option>Doanh thu</option>
                        <option>Chi phí</option>
                    </select>
                    <label className="search"><span>⌕</span><input value={query}
                                                                   onChange={(e) => setQuery(e.target.value)}
                                                                   placeholder="Tìm kiếm giao dịch..."/></label>
                    {period === 'Tùy chỉnh' && (
                        <div className="custom-dates">
                            <input type="date" defaultValue="2026-05-01" aria-label="Từ ngày"/>
                            <span>đến</span>
                            <input type="date" defaultValue="2026-05-15" aria-label="Đến ngày"/>
                        </div>
                    )}
                </section>

                <section className="summary-grid">
                    <SummaryCard tone="income" icon="↑" title="Doanh thu trong kỳ" value="484.269.907 VND">
                        <p>Chờ quyết toán (WIP): <b>8.204.922.210 VND</b></p>
                        <p>Dự án Dự kiến: <em>2.585.047.000 VND</em></p>
                        <small>*Kỳ này có phát sinh quyết toán WIP nằm cũ mang sang.</small>
                    </SummaryCard>
                    <SummaryCard tone="expense" icon="↓" title="Chi phí trong kỳ" value="5.177.147.184 VND">
                        <p>Chờ quyết toán (WIP): <b>3.065.801.962 VND</b></p>
                    </SummaryCard>
                    <SummaryCard tone="asset" icon="⌁" title="Tổng Nguồn tiền có" value="32.125.290.377 VND">
                        <p>Tiền mặt/NH: <b>1.945.254.987 VND</b></p>
                        <p>Phải thu KH: <b>30.180.035.390 VND</b></p>
                    </SummaryCard>
                    <SummaryCard tone="debt" icon="▣" title="Tổng Nghĩa vụ nợ" value="24.644.552.605 VND">
                        <p>Phải trả NCC: <b>18.375.094.684 VND</b></p>
                        <p>Dư nợ vay: <b>6.269.457.921 VND</b></p>
                    </SummaryCard>
                </section>

                <section className="table-card">
                    <div className="table-scroll">
                        <table>
                            <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Loại</th>
                                <th>Danh mục</th>
                                <th>Option</th>
                                <th>Dự án</th>
                                <th>Trước thuế</th>
                                <th>VAT</th>
                                <th>Sau thuế</th>
                                <th>Tài khoản</th>
                                <th>Đối tượng</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((row, index) => (
                                <tr key={`${row.date}-${index}`}>
                                    <td>{row.date}</td>
                                    <td className={row.type === 'Chi phí' ? 'cost' : 'revenue-cell'}>{row.type === 'Chi phí' ? '↓' : '↑'} {row.type}</td>
                                    <td>{row.category}</td>
                                    <td>{row.option}</td>
                                    <td className="project">{row.project}</td>
                                    <td className="money">{row.before} VND</td>
                                    <td><span className="vat">{row.vat}</span></td>
                                    <td className="money">{row.after} VND</td>
                                    <td>{row.account}</td>
                                    <td className="transaction-object">
                                        <span>{row.object || '—'}</span>
                                        <button type="button"
                                                className={row.hasCashFlow ? 'has-cash-flow' : ''}
                                                disabled={!row.hasCashFlow}
                                                title={row.hasCashFlow
                                                    ? 'In phiếu thu chi'
                                                    : 'Chưa có dòng tiền thu chi'}
                                                aria-label={row.hasCashFlow
                                                    ? 'In phiếu thu chi'
                                                    : 'Chưa có dòng tiền thu chi, không thể in'}
                                                onClick={() => printVoucher(row)}>▣</button>
                                    </td>
                                    <td className="row-actions">
                                        <ActionIcon icon="edit" label="Chỉnh sửa giao dịch"
                                                    onClick={() => openEditor(row)}/>
                                        <ActionIcon icon="trash" tone="red" label="Xóa giao dịch"
                                                    onClick={() => setPendingDelete(row)}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {!filtered.length && <div className="empty">Không tìm thấy giao dịch phù hợp.</div>}
                    </div>
                    <div className="table-toolbar">
                        <span>Hiển thị 1-{filtered.length} của 63 giao dịch</span>
                        <div className="pagination">
                            <button disabled>‹</button>
                            {[1, 2, 3, 4, 5].map((n) => <button key={n} className={page === n ? 'is-current' : ''}
                                                                onClick={() => setPage(n)}>{n}</button>)}
                            <span>...</span>
                            <button onClick={() => setPage(7)}>7</button>
                            <button onClick={() => setPage(Math.min(7, page + 1))}>›</button>
                        </div>
                    </div>
                </section>
            </main>
            {editing && (
                <div className="modal-backdrop"
                     onMouseDown={(event) => event.target === event.currentTarget && closeEditor()}>
                    <section className="transaction-modal" role="dialog" aria-modal="true"
                             aria-labelledby="edit-transaction-title">
                        <header className="transaction-modal__header">
                            <h2 id="edit-transaction-title">{editing._new ? 'Thêm giao dịch' : 'Sửa giao dịch'}</h2>
                            <button type="button" onClick={closeEditor} aria-label="Đóng">×</button>
                        </header>

                        <form onSubmit={saveTransaction}>
                            <div className="transaction-modal__body">
                                <label className="edit-field edit-field--wide">
                                    <span>Loại giao dịch: <b>*</b></span>
                                    <div className="transaction-kind-options">
                                        <button type="button"
                                                className={transactionKind === 'Chi phí' ? 'selected expense-kind' : ''}
                                                onClick={() => setTransactionKind('Chi phí')}>↓&nbsp; Chi phí
                                        </button>
                                        <button type="button"
                                                className={transactionKind === 'Doanh thu' ? 'selected revenue-kind' : ''}
                                                onClick={() => setTransactionKind('Doanh thu')}>↑&nbsp; Doanh thu
                                        </button>
                                        <button type="button"
                                                className={transactionKind === 'Chuyển khoản' ? 'selected transfer-kind' : ''}
                                                onClick={() => setTransactionKind('Chuyển khoản')}>⇄&nbsp; Chuyển khoản
                                        </button>
                                    </div>
                                </label>

                                <label className="edit-field">
                                    <span>{transactionKind === 'Doanh thu' ? 'Tài khoản thu' : transactionKind === 'Chuyển khoản' ? 'Tài khoản chuyển' : 'Tài khoản chi'}: <b>*</b></span>
                                    <select defaultValue={editing.account}>
                                        <option>{editing.account}</option>
                                        <option>SQTM (950.514 VND)</option>
                                        <option>ACB</option>
                                    </select>
                                </label>
                                <label className="edit-field">
                                    <span>Danh mục: <b>*</b></span>
                                    <select defaultValue={editing.category}>
                                        <option>{editing.category}</option>
                                        <option>▣ Chi Khác</option>
                                        <option>$ Hợp Đồng</option>
                                    </select>
                                </label>

                                <label className="edit-field">
                                    <span>Số tiền trước thuế: <b>*</b></span>
                                    <input defaultValue={editing.before.replace(/[-\s]/g, '')}/>
                                </label>
                                <label className="edit-field">
                                    <span>Thuế VAT:</span>
                                    <div className="vat-inputs"><select defaultValue={editing._new ? '8%' : 'Nhập tay'}>
                                        <option>Nhập tay</option>
                                        <option>8%</option>
                                        <option>10%</option>
                                    </select><input placeholder="Nhập số tiền VAT"/></div>
                                </label>

                                <label className="edit-field">
                                    <span>Số tiền sau thuế: <b>*</b></span>
                                    <input className="readonly" defaultValue={editing.after.replace(/[-\s]/g, '')}
                                           readOnly/>
                                </label>
                                <label className="edit-field">
                                    <span>Ngày giao dịch: <b>*</b></span>
                                    <input type="date" defaultValue="2026-05-15"/>
                                </label>

                                <label className="edit-field edit-field--wide">
                                    <span>Nhà cung cấp:</span>
                                    <input placeholder="Nhập để tìm kiếm..."/>
                                </label>
                                <label className="edit-field edit-field--wide">
                                    <span>Dự án:</span>
                                    <input defaultValue={editing.project} placeholder="Nhập để tìm kiếm dự án..."/>
                                </label>

                                <section className="invoice-section">
                                    <div className="invoice-section__title">
                                        <strong>▣ Khai báo Hóa Đơn</strong>
                                        <button type="button" onClick={() => setShowInvoice(true)}>＋ Thêm Hóa đơn
                                        </button>
                                    </div>
                                    {editing._new || invoiceRemoved ?
                                        <div className="invoice-empty">Chưa có hóa đơn nào</div> : (
                                            <div className="declared-invoice-scroll">
                                                <table className="declared-invoice-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Số HĐ</th>
                                                        <th>Ngày HĐ</th>
                                                        <th>Trước thuế</th>
                                                        <th>VAT</th>
                                                        <th>Sau thuế</th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>02190279</td>
                                                        <td>15/05/2026</td>
                                                        <td>{editing.before.replace('-', '').trim()} VND</td>
                                                        <td>{editing.vat}</td>
                                                        <td>{editing.after.replace('-', '').trim()} VND</td>
                                                        <td><ActionIcon icon="attach" tone="green"
                                                                        label="Đính kèm chứng từ"
                                                                        onClick={() => setAttachmentOpen(true)}/><ActionIcon
                                                            icon="edit" label="Sửa hóa đơn"
                                                            onClick={() => setShowInvoice(true)}/><ActionIcon
                                                            icon="trash" tone="red" label="Xóa hóa đơn"
                                                            onClick={() => setPendingInvoiceDelete(true)}/></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                </section>

                                <label className="edit-field">
                                    <span>Nhân viên/Bộ phận thực hiện:</span>
                                    <input defaultValue="Kiên Fox | P.TGĐ" readOnly/>
                                </label>
                                <label className="edit-field">
                                    <span>Ghi chú:</span>
                                    <input defaultValue={editing._new ? '' : editing.project}/>
                                </label>

                                <section className="payment-section">
                                    <strong>▰ Thông tin thanh toán:</strong>
                                    <div className="payment-card">
                                        {editing._new ? <>
                                            <div className="payment-summary"><b>Đã thanh toán: <em>0 VND</em></b><b>Còn
                                                lại: <i>0 VND</i></b></div>
                                            <div>Trạng thái: <strong className="unpaid-status">Chưa thanh toán</strong>
                                            </div>
                                            <div className="payment-empty">Chưa có thanh toán nào</div>
                                        </> : <>
                                            <div className="payment-summary"><b>Đã thanh
                                                toán: <em>{editing.after.replace('-', '').trim()} VND</em></b><b>Còn
                                                lại: <i>0 VND</i></b></div>
                                            <div>Trạng thái: <span>Đã thanh toán</span></div>
                                            <div className="payment-row">
                                                <span>15/05/2026</span><span>{editing.account}</span><span>{editing.after.replace('-', '').trim()} VND</span><span>Thanh toán</span>
                                                <button type="button">✎</button>
                                                <button type="button">▥</button>
                                            </div>
                                        </>}
                                    </div>
                                </section>
                            </div>
                            <footer className="transaction-modal__footer">
                                <button type="button" onClick={closeEditor}>Hủy</button>
                                <button type="submit">Lưu</button>
                            </footer>
                        </form>
                    </section>

                    {showInvoice && (
                        <section className="invoice-modal" role="dialog" aria-modal="true"
                                 aria-labelledby="invoice-title">
                            <header><strong id="invoice-title">▣ Khai báo Hóa đơn</strong>
                                <button type="button" onClick={() => setShowInvoice(false)}>×</button>
                            </header>
                            <div className="invoice-total"><span>Tổng Giao dịch: <b>432.000 VND</b><small>Đã lên Hóa đơn: 0 VND</small></span><span>Hạn mức còn lại:<b>432.000 VND</b></span>
                            </div>
                            <div className="invoice-form">
                                <label>Số Hóa đơn: <input placeholder="VD: 12345"/></label>
                                <label>Ngày Hóa đơn: <input type="date" defaultValue="2026-05-17"/></label>
                                <label>Trước thuế <input defaultValue="432.000 VND"/></label>
                                <label>Thuế VAT <div><select>
                                    <option>Nhập tay</option>
                                </select><input defaultValue="0 VND"/></div></label>
                                <label className="invoice-after">Sau Thuế (Tổng hóa đơn): <strong>432.000
                                    VND</strong></label>
                            </div>
                            <footer>
                                <button type="button" onClick={() => setShowInvoice(false)}>Hủy</button>
                                <button type="button" onClick={() => {
                                    setShowInvoice(false);
                                    notify('Đã lưu hóa đơn')
                                }}>✓ Lưu Hóa đơn
                                </button>
                            </footer>
                        </section>
                    )}
                </div>
            )}
            {toast && <div className="toast">{toast}</div>}
            {printing && (
                <div className="print-sheet" aria-hidden="true">
                    <PaymentVoucher transaction={printing} config={voucherConfig} copy="Liên 1: Lưu tại công ty"/>
                    <PaymentVoucher transaction={printing} config={voucherConfig} copy="Liên 2: Giao khách hàng"/>
                </div>
            )}
            {voucherConfigOpen && <VoucherConfigModal config={voucherConfig}
                                                       onClose={() => setVoucherConfigOpen(false)}
                                                       onSave={(nextConfig) => {
                                                           setVoucherConfig(nextConfig)
                                                           setVoucherConfigOpen(false)
                                                           notify('Đã lưu cấu hình in!')
                                                       }}/>}
            {pendingDelete && <ConfirmDialog
                message={`Bạn có chắc muốn xóa giao dịch ngày ${pendingDelete.date}? Thao tác này không thể hoàn tác.`}
                onCancel={() => setPendingDelete(null)} onConfirm={() => {
                deleteTransaction(pendingDelete);
                setPendingDelete(null)
            }}/>}
            {showDisbursement && <DisbursementModal onClose={() => setShowDisbursement(false)} onSubmit={(total) => {
                setShowDisbursement(false);
                notify(`Đã giải ngân ${new Intl.NumberFormat('vi-VN').format(total)} VND`)
            }}/>}
            {pendingInvoiceDelete && <ConfirmDialog message="Bạn có chắc muốn xóa hóa đơn 02190279 khỏi giao dịch này?"
                                                    onCancel={() => setPendingInvoiceDelete(false)} onConfirm={() => {
                setInvoiceRemoved(true);
                setPendingInvoiceDelete(false);
                notify('Đã xóa hóa đơn')
            }}/>}
            {attachmentOpen && <AttachmentModal initialFiles={attachments} onClose={() => setAttachmentOpen(false)}
                                                onComplete={(files) => {
                                                    setAttachments(files);
                                                    setAttachmentOpen(false);
                                                    notify(`Đã đính kèm ${files.length} tài liệu`)
                                                }}/>}
        </>
    )
}

export default Transactions

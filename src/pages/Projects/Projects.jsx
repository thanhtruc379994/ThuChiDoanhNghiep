import { useMemo, useState } from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Projects.css'

const initialProjects = [
  { name: 'BITNR GoldMark City_Biển trong và ngoài nhà', description: 'Nhà cho dự án Khu nhà ở Văn Phòng - Dịch vụ', status: 'Đang triển khai', revenue: 2795861370, expense: 2050802398 },
  { name: 'SIPhu Quốc_Tromento', description: 'Shophouse tại Thị Trấn Hoàng Hôn, đặc khu Phú Quốc', status: 'Đã hoàn thành', revenue: 873145500, expense: 470635655 },
  { name: 'SIPhú Quốc-Ledocua', description: 'Sun Signature Gallery Phú Quốc', status: 'Đã hoàn thành', revenue: 352100000, expense: 190750000 },
  { name: 'Trang trí Led Cầu Hàm Rồng', description: 'Trang trí, điện chiếu sáng cầu Hàm Rồng', status: 'Đang triển khai', revenue: 1211239000, expense: 26029844 },
  { name: 'TECHCOMBANK', description: 'Thi công hệ thống nhận diện Techcombank', status: 'Đang triển khai', revenue: 309877436, expense: 135023000 },
  { name: 'VIBLMCIBB vòng xuyến', description: 'Biển bảng quảng cáo vòng xuyến', status: 'Tạm dừng', revenue: 1476145600, expense: 440827000 },
  { name: 'VIVYHPIB2.3_BB cải tạo 41 căn', description: 'Cải tạo biển bảng 41 căn liền kề', status: 'Đã hoàn thành', revenue: 26740000, expense: 11040000 },
  { name: 'TPXHCM|Mâm non IV.4', description: 'Thi công mầm non tại TP Hồ Chí Minh', status: 'Đang triển khai', revenue: 172755000, expense: 120928500 },
  { name: 'Vingroup|StarCity Thanh Hóa', description: 'Nhận diện Vinhomes StarCity', status: 'Đã hoàn thành', revenue: 1331402900, expense: 1000000 },
  { name: 'Vingroup|Đô Nông|Long Vân', description: 'Khu đô thị Long Vân, Bình Định', status: 'Đang triển khai', revenue: 1410532340, expense: 9170000 },
]

const formatMoney = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`

function ProjectModal({ project, onClose, onSave }) {
  const [contracts, setContracts] = useState(project?.contracts || [
    { supplier: '(NCC0000007) Nhà cung cấp 007', code: '22/04/2026/HĐTC/APP-MSD', category: 'Vật tư, Thiết bị' },
    { supplier: '(NCC0000007) Nhà cung cấp 007', code: 'PL02 - HĐ 2504.21/HĐTC/APP-MSD', category: 'Nhân công' },
  ])
  const [pendingContract, setPendingContract] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSave({
      ...project,
      name: data.get('name'),
      description: data.get('description'),
      status: data.get('status'),
      settlementYear: data.get('settlementYear'),
      startDate: data.get('startDate'),
      endDate: data.get('endDate'),
      customer: data.get('customer'),
      customerContract: data.get('customerContract'),
      address: data.get('address'),
      revenue: project?.revenue || 0,
      expense: project?.expense || 0,
      contracts,
    })
  }

  return (
    <div className="project-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <header>
          <h2 id="project-modal-title">{project ? 'Sửa dự án' : 'Thêm dự án'}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">×</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="project-form">
            <label className="project-field">
              <span>Tên dự án: <b>*</b></span>
              <input name="name" required defaultValue={project?.name} placeholder="Nhập tên dự án" />
            </label>
            <label className="project-field">
              <span>Trạng thái: <b>*</b></span>
              <select name="status" defaultValue={project?.status || 'Đang triển khai'}>
                <option>Dự kiến</option><option>Đang triển khai</option><option>Đã hoàn thành</option><option>Tạm dừng</option>
              </select>
            </label>
            <section className="settlement-year">
              <h3>▣ Năm Quyết Toán (Ghi nhận KQKD):</h3>
              <p>Nếu để trống, Doanh thu/Chi phí sẽ ghi nhận theo ngày thực tế của từng giao dịch (phù hợp dự án nhỏ).</p>
              <p>Nếu chọn Năm, tất cả Doanh thu/Chi phí của dự án sẽ được “đóng băng” ở dạng dở dang và chỉ đổ vào Lợi nhuận của Năm được chọn.</p>
              <input name="settlementYear" type="number" min="2000" max="2100" defaultValue={project?.settlementYear} placeholder="Ví dụ: 2026" />
            </section>
            <label className="project-field">
              <span>Ngày bắt đầu:</span>
              <input name="startDate" type="date" defaultValue={project?.startDate || '2026-07-21'} />
            </label>
            <label className="project-field">
              <span>Ngày kết thúc:</span>
              <input name="endDate" type="date" defaultValue={project?.endDate || '2026-12-18'} />
            </label>
            <label className="project-field">
              <span>Khách hàng:</span>
              <input name="customer" defaultValue={project?.customer || 'TẬP ĐOÀN VINGROUP - CÔNG TY CP'} placeholder="Chọn khách hàng" />
            </label>
            <label className="project-field">
              <span>Hợp đồng (Khách hàng):</span>
              <input name="customerContract" defaultValue={project?.customerContract || '304/2026/HĐ/VGR-APP'} />
            </label>
            <label className="project-field project-field--full">
              <span>Địa chỉ / Địa điểm:</span>
              <input name="address" defaultValue={project?.address || 'Phường Đông Hương, Phường Đông Hải, TP Thanh Hóa'} />
            </label>
            <label className="project-field project-field--full">
              <span>Hạng mục thi công:</span>
              <textarea name="description" rows="3" defaultValue={project?.description} placeholder="Nhập thông tin bổ sung..." />
            </label>

            <section className="contracts">
              <h3>▣ Hợp đồng (Nhà cung cấp)</h3>
              <div className="contract-entry">
                <label>Nhà cung cấp<select><option>Chọn Nhà cung cấp</option><option>Nhà cung cấp 007</option></select></label>
                <label>Số hợp đồng<input placeholder="VD: HĐ-01/2026" /></label>
                <label>Hạng mục<select><option>Vật tư, Thiết bị</option><option>Nhân công</option></select></label>
                <button type="button" onClick={() => setContracts([...contracts, { supplier: 'Nhà cung cấp mới', code: 'HĐ-MỚI', category: 'Vật tư, Thiết bị' }])}>＋ Thêm HĐ</button>
              </div>
              <div className="contract-table">
                <div className="contract-table__head"><span>Nhà cung cấp</span><span>Số HĐ</span><span>Hạng mục</span><span>Thao tác</span></div>
                {contracts.map((contract, index) => (
                  <div key={`${contract.code}-${index}`}>
                    <span>{contract.supplier}</span><span>{contract.code}</span><span>{contract.category}</span>
                    <span><ActionIcon icon="edit" label="Sửa hợp đồng" /><ActionIcon icon="trash" tone="red" label="Xóa hợp đồng" onClick={() => setPendingContract(index)} /></span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <footer><button type="button" onClick={onClose}>Hủy</button><button type="submit">Lưu Dự Án</button></footer>
        </form>
      </section>
      {pendingContract !== null && <ConfirmDialog message={`Bạn có chắc muốn xóa hợp đồng “${contracts[pendingContract]?.code}”?`} onCancel={() => setPendingContract(null)} onConfirm={() => { setContracts(contracts.filter((_, index) => index !== pendingContract)); setPendingContract(null) }} />}
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useIndexedDbState('projects', initialProjects)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tất cả trạng thái')
  const [period, setPeriod] = useState('Lũy kế (Toàn thời gian)')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [pendingDelete, setPendingDelete] = useState(undefined)

  const visibleProjects = useMemo(() => projects.filter((project) =>
    (status === 'Tất cả trạng thái' || project.status === status) &&
    `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase())
  ), [projects, query, status])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const saveProject = (data) => {
    if (editing) setProjects(projects.map((item) => item === editing ? data : item))
    else setProjects([{ ...data, revenue: 0, expense: 0 }, ...projects])
    setModalOpen(false)
    notify(editing ? 'Đã cập nhật dự án' : 'Đã thêm dự án mới')
  }

  const removeProject = (project) => {
    setProjects(projects.filter((item) => item !== project))
    notify('Đã xóa dự án')
  }

  return (
    <main className="projects-page">
      <header className="projects-header">
        <h2>Quản lý dự án</h2>
        <div><button className="add-project" onClick={() => { setEditing(undefined); setModalOpen(true) }}>＋ Thêm dự án</button><NotificationBell className="projects-notification" count={15} /></div>
      </header>

      <section className="project-filters">
        <label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm dự án..." /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>Tất cả trạng thái</option><option>Dự kiến</option><option>Đang triển khai</option><option>Đã hoàn thành</option><option>Tạm dừng</option>
        </select>
        <select value={period} onChange={(event) => setPeriod(event.target.value)}>
          <option>Lũy kế (Toàn thời gian)</option><option>Tháng này</option><option>Quý này</option><option>Năm nay</option>
        </select>
      </section>

      <section className="projects-table-card">
        <div className="projects-table-scroll">
          <table className="projects-table">
            <thead><tr><th>Tên dự án</th><th>Trạng thái</th><th>Doanh thu</th><th>Chi phí</th><th>Lợi nhuận</th><th>Tỷ suất %</th><th>Thao tác</th></tr></thead>
            <tbody>
              {visibleProjects.map((project) => {
                const profit = project.revenue - project.expense
                const rate = project.revenue ? profit / project.revenue * 100 : 0
                return (
                  <tr key={project.name}>
                    <td><button className="project-name" onClick={() => { setEditing(project); setModalOpen(true) }}>{project.name}</button><small>{project.description}</small></td>
                    <td><span className={`project-status status-${project.status.replaceAll(' ', '-').toLowerCase()}`}>{project.status}</span></td>
                    <td className="project-revenue">{formatMoney(project.revenue)}</td>
                    <td className="project-expense">{formatMoney(project.expense)}</td>
                    <td className="project-profit">{formatMoney(profit)}</td>
                    <td>{rate.toFixed(1)}%</td>
                    <td className="project-actions"><ActionIcon icon="edit" label="Sửa dự án" onClick={() => { setEditing(project); setModalOpen(true) }} /><ActionIcon icon="trash" tone="red" label="Xóa dự án" onClick={() => setPendingDelete(project)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!visibleProjects.length && <div className="projects-empty">Không tìm thấy dự án phù hợp.</div>}
        </div>
        <div className="projects-toolbar">
          <span>Hiển thị 1-{visibleProjects.length} của {projects.length} dự án</span>
          <div className="project-pagination"><button disabled>‹</button>{[1, 2, 3, 4, 5].map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{item}</button>)}<button onClick={() => setPage(Math.min(5, page + 1))}>›</button></div>
        </div>
      </section>

      {modalOpen && <ProjectModal project={editing} onClose={() => setModalOpen(false)} onSave={saveProject} />}
      {pendingDelete && <ConfirmDialog message={`Bạn có chắc muốn xóa dự án “${pendingDelete.name}”? Thao tác này không thể hoàn tác.`} onCancel={() => setPendingDelete(undefined)} onConfirm={() => { removeProject(pendingDelete); setPendingDelete(undefined) }} />}
      {toast && <div className="project-toast">{toast}</div>}
    </main>
  )
}

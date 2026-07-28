import { useState } from 'react'
import './Dashboard.css'

const navItems = [
  ['⌂', 'Tổng quan'],
  ['⇄', 'Giao dịch'],
  ['◆', 'Dự án'],
  ['▣', 'Tài khoản'],
  ['◇', 'Danh mục'],
  ['♟', 'Khách hàng'],
  ['▰', 'Nhà cung cấp'],
  ['♙', 'Nhân sự'],
]

const periods = ['Tháng này', 'Quý này', 'Năm nay', 'Tùy chỉnh']

const periodData = {
  'Tháng này': { revenue: '2.184.320.500', expense: '1.920.165.200', profit: '264.155.300', balance: '1.945.254.987' },
  'Quý này': { revenue: '6.620.859.775', expense: '8.006.767.531', profit: '-1.385.907.756', balance: '1.945.254.987' },
  'Năm nay': { revenue: '24.861.240.000', expense: '21.405.630.200', profit: '3.455.609.800', balance: '4.812.967.300' },
  'Tùy chỉnh': { revenue: '8.420.600.000', expense: '7.122.250.000', profit: '1.298.350.000', balance: '2.365.140.000' },
}

// Helper to format an ISO date (yyyy-mm-dd) into dd/mm/yyyy for display
function formatVN(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

// Formats a number as VND with dot thousand-separators, e.g. 1234500 -> "1.234.500"
function formatMoney(n) {
  return Math.round(n).toLocaleString('vi-VN')
}

// Số liệu thật cho từng cột của biểu đồ "Doanh thu - Chi phí theo tháng"
const monthlyFinance = [
  { month: 'Tháng 1', revenue: 1260000000, expense: 2340000000 },
  { month: 'Tháng 2', revenue: 1080000000, expense: 2070000000 },
  { month: 'Tháng 3', revenue: 1410000000, expense: 2520000000 },
  { month: 'Tháng 4', revenue: 1830000000, expense: 2760000000 },
]

// Danh mục chi phí / doanh thu, dùng chung cho Donut (tỉ lệ % khớp với conic-gradient trong CSS)
const expenseCategories = [
  { label: 'Hợp đồng', percent: 82 },
  { label: 'Chi lương', percent: 9 },
  { label: 'Thuế, phí, lệ phí', percent: 5 },
  { label: 'Chi khác', percent: 4 },
]

const incomeCategories = [
  { label: 'Hợp đồng', percent: 94 },
  { label: 'Thu SQTMD', percent: 4 },
  { label: 'Hoạt động tài chính', percent: 2 },
]

const EXPENSE_TOTAL = 24644552605
const INCOME_TOTAL = 32125290377

// Toạ độ % (x,y) trên vòng tròn (tâm 50/50) ứng với 1 mốc % trên conic-gradient (0% = 12h, chiều kim đồng hồ)
function polarPoint(percent, radius = 50) {
  const angle = (percent / 100) * 2 * Math.PI
  return {
    x: 50 + radius * Math.sin(angle),
    y: 50 - radius * Math.cos(angle),
  }
}

// Dựng chuỗi điểm cho clip-path polygon của 1 lát bánh, từ startPercent -> endPercent
function wedgePoints(startPercent, endPercent) {
  const steps = Math.max(2, Math.ceil(((endPercent - startPercent) / 100) * 36))
  const points = ['50% 50%']
  for (let i = 0; i <= steps; i++) {
    const p = startPercent + ((endPercent - startPercent) * i) / steps
    const { x, y } = polarPoint(p)
    points.push(`${x}% ${y}%`)
  }
  return points.join(', ')
}

function Icon({ children }) {
  return <span className="icon">{children}</span>
}

function KpiCard({ type, icon, title, value, children }) {
  return (
    <article className={`kpi ${type}`}>
      <Icon>{icon}</Icon>
      <div>
        <span>{title}</span>
        <strong>{value} <small>VND</small></strong>
        <p>{children}</p>
      </div>
    </article>
  )
}

function BarsChart() {
  const max = Math.max(...monthlyFinance.flatMap((m) => [m.revenue, m.expense]))
  const heightOf = (value) => `${(value / max) * 92}%`

  return (
    <div className="bars-wrap">
      <div className="legend"><i className="blue" /> Doanh thu <i className="pink" /> Chi phí</div>
      <div className="bars">
        {monthlyFinance.map((m) => (
          <div className="bar-pair" key={m.month}>
            <i
              className="blue"
              style={{ height: heightOf(m.revenue) }}
              data-tooltip={`${m.month} • Doanh thu: ${formatMoney(m.revenue)} VND`}
            />
            <i
              className="pink"
              style={{ height: heightOf(m.expense) }}
              data-tooltip={`${m.month} • Chi phí: ${formatMoney(m.expense)} VND`}
            />
          </div>
        ))}
      </div>
      <div className="axis">
        {monthlyFinance.map((m) => <span key={m.month}>{m.month.replace('Tháng ', 'T.')}</span>)}
      </div>
    </div>
  )
}

function Donut({ income = false }) {
  const categories = income ? incomeCategories : expenseCategories
  const total = income ? INCOME_TOTAL : EXPENSE_TOTAL

  let cursor = 0
  const wedges = categories.map((cat) => {
    const start = cursor
    const end = cursor + cat.percent
    cursor = end
    const anchor = polarPoint((start + end) / 2, 33)
    const amount = (total * cat.percent) / 100
    return {
      ...cat,
      clip: wedgePoints(start, end),
      tx: `${anchor.x}%`,
      ty: `${anchor.y}%`,
      tooltip: `${cat.label}: ${cat.percent}% • ${formatMoney(amount)} VND`,
    }
  })

  return (
    <div className="donut-layout">
      <div className="donut-wrap">
        <div className={`donut ${income ? 'income' : ''}`}><span>{income ? '100%' : '82%'}</span></div>
        {wedges.map((w) => (
          <div
            key={w.label}
            className="donut-wedge"
            style={{ clipPath: `polygon(${w.clip})`, '--tx': w.tx, '--ty': w.ty }}
            data-tooltip={w.tooltip}
          />
        ))}
      </div>
      <div className="donut-legend">
        {categories.map((c, i) => (
          <span key={c.label}><i className={`dot d${i}`} />{c.label}</span>
        ))}
      </div>
    </div>
  )
}

// Custom date range picker shown when the "Tùy chỉnh" period is selected
function DateRangePicker({ from, to, onFromChange, onToChange }) {
  return (
    <div className="date-range">
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        aria-label="Từ ngày"
      />
      <span className="date-range-sep">đến</span>
      <input
        type="date"
        value={to}
        min={from || undefined}
        onChange={(e) => onToChange(e.target.value)}
        aria-label="Đến ngày"
      />
    </div>
  )
}

function Dashboard() {
  const [period, setPeriod] = useState('Quý này')
  const [collapsed, setCollapsed] = useState(false)
  const [toast, setToast] = useState('')
  const [dateFrom, setDateFrom] = useState('2026-04-30')
  const [dateTo, setDateTo] = useState('2026-05-15')
  const data = periodData[period]
  const isCustom = period === 'Tùy chỉnh'

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const handlePeriodClick = (item) => {
    setPeriod(item)
    if (item === 'Tùy chỉnh') {
      notify(`Đang xem: ${formatVN(dateFrom)} - ${formatVN(dateTo)}`)
    }
  }

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <button className="collapse" onClick={() => setCollapsed(!collapsed)} aria-label="Thu gọn menu">‹</button>
        <div className="brand">
          <div className="bulb">💡</div>
          <h1>QUẢN LÝ THU CHI<br />DOANH NGHIỆP</h1>
        </div>
        <nav>
          {navItems.map(([icon, label], index) => (
            <button key={label} className={index === 0 ? 'active' : ''} onClick={() => notify(`${label} đang được cập nhật`)}>
              <b>{icon}</b><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="profile">
          <div className="avatar">KF</div>
          <div><strong>Kiên Fox | P.TGĐ</strong><span>Đổi mật khẩu</span></div>
        </div>
        <footer>Version 4.1<br />Thực hiện bởi © applus.vn</footer>
      </aside>

      <main>
        <header>
          <div>
            <span className="eyebrow">BẢNG ĐIỀU KHIỂN</span>
            <h2>Tổng quan tài chính</h2>
          </div>
          <div className="header-actions">
            <div className="periods">
              {periods.map((item) => <button key={item} className={period === item ? 'selected' : ''} onClick={() => handlePeriodClick(item)}>{item}</button>)}
            </div>
            {isCustom && (
              <DateRangePicker
                from={dateFrom}
                to={dateTo}
                onFromChange={setDateFrom}
                onToChange={setDateTo}
              />
            )}
            <button className="download" onClick={() => notify('Đã tạo bảng kê đối soát')}>⇩ Tải bảng kê đối soát</button>
            <button className="bell" onClick={() => notify('Bạn có 23 thông báo mới')}>♟<sup>23</sup></button>
          </div>
        </header>

        <section className="kpi-grid">
          <KpiCard type="revenue" icon="▤" title="Doanh thu" value={data.revenue}>Tổng nguồn tiền có: <b>32.125.290.377 VND</b></KpiCard>
          <KpiCard type="expense" icon="🛒" title="Chi phí" value={data.expense}>Tổng nghĩa vụ nợ: <b>24.644.552.605 VND</b></KpiCard>
          <KpiCard type="profit" icon="⌁" title="Lợi nhuận" value={data.profit}>Dòng tiền thuần: <em>▲ -492.485.343 VND</em></KpiCard>
          <KpiCard type="balance" icon="♣" title="Tổng số dư tài khoản" value={data.balance}>(Tiền mặt &amp; Ngân hàng)</KpiCard>
        </section>

        <section className="metric-grid">
          <article className="metric red">
            <h3><Icon>◉</Icon> NET BURN RATE <span>(HAO HỤT RÒNG)</span></h3>
            <strong>342.016.475 VND</strong>
            <p>Công ty đang hao hụt tiền mặt mỗi tháng</p>
            <div>Gross Burn (Tổng chi): <b>1.240.110.923 VND/th</b></div>
          </article>
          <article className="metric yellow">
            <h3><Icon>✈</Icon> RUNWAY</h3>
            <strong>5.7 <small>tháng</small></strong>
            <p>Đường băng sinh tử</p>
            <div>Thời gian cạn tiền nếu duy trì tốc độ hiện tại</div>
          </article>
          <article className="metric green">
            <h3><Icon>◔</Icon> THU HỒI NỢ</h3>
            <strong>328.4%</strong>
            <p>Tỷ lệ Thực thu / Doanh thu xuất</p>
            <div>Khả năng chuyển hóa hóa đơn thành tiền mặt</div>
          </article>
        </section>

        <section className="charts">
          <article><h3>Doanh thu - Chi phí theo tháng</h3><BarsChart /></article>
          <article><h3>Chi phí theo danh mục</h3><Donut /></article>
          <article><h3>Doanh thu theo danh mục</h3><Donut income /></article>
        </section>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default Dashboard

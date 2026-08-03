import { useState } from 'react'
import { Article, Button, Footer, Header, Input, Main, Section, Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../components/MaterialPrimitives/MaterialPrimitives'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Dashboard.css'

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
    <Article className={`kpi ${type}`}>
      <Icon>{icon}</Icon>
      <div>
        <span>{title}</span>
        <strong>{value} <small>VND</small></strong>
        <p>{children}</p>
      </div>
    </Article>
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
              title={`${m.month} • Doanh thu: ${formatMoney(m.revenue)} VND`}
            />
            <i
              className="pink"
              style={{ height: heightOf(m.expense) }}
              data-tooltip={`${m.month} • Chi phí: ${formatMoney(m.expense)} VND`}
              title={`${m.month} • Chi phí: ${formatMoney(m.expense)} VND`}
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
  const [hovered, setHovered] = useState(null)

  const wedges = categories.map((cat, index) => {
    const start = categories.slice(0, index).reduce((sum, item) => sum + item.percent, 0)
    const end = start + cat.percent
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
            title={w.tooltip}
            onMouseEnter={() => setHovered(w)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
      <div className="donut-legend">
        {categories.map((c, i) => (
          <span
            key={c.label}
            title={`${c.label}: ${c.percent}% • ${formatMoney((total * c.percent) / 100)} VND`}
            onMouseEnter={() => setHovered({ ...c, tooltip: `${c.label}: ${c.percent}% • ${formatMoney((total * c.percent) / 100)} VND` })}
            onMouseLeave={() => setHovered(null)}
          ><i className={`dot d${i}`} />{c.label}</span>
        ))}
      </div>
      {hovered && <div className="donut-tooltip"><strong>{hovered.label}</strong><span>{hovered.percent}%</span><b>{formatMoney((total * hovered.percent) / 100)} VND</b></div>}
    </div>
  )
}

// Custom date range picker shown when the "Tùy chỉnh" period is selected
function DateRangePicker({ from, to, onFromChange, onToChange }) {
  return (
    <div className="date-range">
      <Input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        aria-label="Từ ngày"
      />
      <span className="date-range-sep">đến</span>
      <Input
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
  const [toast, setToast] = useState('')
  const [dateFrom, setDateFrom] = useState('2026-04-30')
  const [dateTo, setDateTo] = useState('2026-05-15')
  const [printing, setPrinting] = useState(false)
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

  const printReconciliation = () => {
    setPrinting(true)
    document.body.classList.add('printing-reconciliation')
    const finishPrinting = () => {
      document.body.classList.remove('printing-reconciliation')
      setPrinting(false)
    }
    window.addEventListener('afterprint', finishPrinting, { once: true })
    window.setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <>
      <Main className="dashboard-content">
        <Header>
          <div>
            <span className="eyebrow">BẢNG ĐIỀU KHIỂN</span>
            <h2>Tổng quan tài chính</h2>
          </div>
          <div className="header-actions">
            <div className="periods">
              {periods.map((item) => <Button key={item} className={period === item ? 'selected' : ''} onClick={() => handlePeriodClick(item)}>{item}</Button>)}
            </div>
            {isCustom && (
              <DateRangePicker
                from={dateFrom}
                to={dateTo}
                onFromChange={setDateFrom}
                onToChange={setDateTo}
              />
            )}
            <Button className="download" onClick={printReconciliation}>⇩ In bảng kê đối soát</Button>
            <NotificationBell className="bell" count={23} />
          </div>
        </Header>

        <Section className="kpi-grid">
          <KpiCard type="revenue" icon="▤" title="Doanh thu" value={data.revenue}>Tổng nguồn tiền có: <b>32.125.290.377 VND</b></KpiCard>
          <KpiCard type="expense" icon="🛒" title="Chi phí" value={data.expense}>Tổng nghĩa vụ nợ: <b>24.644.552.605 VND</b></KpiCard>
          <KpiCard type="profit" icon="⌁" title="Lợi nhuận" value={data.profit}>Dòng tiền thuần: <em>▲ -492.485.343 VND</em></KpiCard>
          <KpiCard type="balance" icon="♣" title="Tổng số dư tài khoản" value={data.balance}>(Tiền mặt &amp; Ngân hàng)</KpiCard>
        </Section>

        <Section className="metric-grid">
          <Article className="metric red">
            <h3><Icon>◉</Icon> NET BURN RATE <span>(HAO HỤT RÒNG)</span></h3>
            <strong>342.016.475 VND</strong>
            <p>Công ty đang hao hụt tiền mặt mỗi tháng</p>
            <div>Gross Burn (Tổng chi): <b>1.240.110.923 VND/th</b></div>
          </Article>
          <Article className="metric yellow">
            <h3><Icon>✈</Icon> RUNWAY</h3>
            <strong>5.7 <small>tháng</small></strong>
            <p>Đường băng sinh tử</p>
            <div>Thời gian cạn tiền nếu duy trì tốc độ hiện tại</div>
          </Article>
          <Article className="metric green">
            <h3><Icon>◔</Icon> THU HỒI NỢ</h3>
            <strong>328.4%</strong>
            <p>Tỷ lệ Thực thu / Doanh thu xuất</p>
            <div>Khả năng chuyển hóa hóa đơn thành tiền mặt</div>
          </Article>
        </Section>

        <Section className="charts">
          <Article><h3>Doanh thu - Chi phí theo tháng</h3><BarsChart /></Article>
          <Article><h3>Chi phí theo danh mục</h3><Donut /></Article>
          <Article><h3>Doanh thu theo danh mục</h3><Donut income /></Article>
        </Section>
      </Main>
      {printing && (
        <Section className="reconciliation-print" aria-hidden="true">
          <Header><div><strong>THU CHI DOANH NGHIỆP</strong><h1>BẢNG KÊ ĐỐI SOÁT TÀI CHÍNH</h1></div><span>Ngày in: {new Date().toLocaleDateString('vi-VN')}</span></Header>
          <p className="reconciliation-print__period">Kỳ báo cáo: <b>{period}</b>{isCustom && ` (${formatVN(dateFrom)} - ${formatVN(dateTo)})`}</p>
          <Table><TableHead><TableRow><TableHeaderCell>Chỉ tiêu</TableHeaderCell><TableHeaderCell>Số tiền (VND)</TableHeaderCell><TableHeaderCell>Ghi chú</TableHeaderCell></TableRow></TableHead><TableBody>
            <TableRow><TableDataCell>Doanh thu</TableDataCell><TableDataCell>{data.revenue}</TableDataCell><TableDataCell>Tổng nguồn tiền có</TableDataCell></TableRow>
            <TableRow><TableDataCell>Chi phí</TableDataCell><TableDataCell>{data.expense}</TableDataCell><TableDataCell>Tổng nghĩa vụ nợ</TableDataCell></TableRow>
            <TableRow><TableDataCell>Lợi nhuận</TableDataCell><TableDataCell>{data.profit}</TableDataCell><TableDataCell>Dòng tiền thuần</TableDataCell></TableRow>
            <TableRow><TableDataCell>Tổng số dư tài khoản</TableDataCell><TableDataCell>{data.balance}</TableDataCell><TableDataCell>Tiền mặt và ngân hàng</TableDataCell></TableRow>
          </TableBody></Table>
          <Footer><span>Người lập bảng</span><span>Người duyệt</span></Footer>
        </Section>
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

export default Dashboard



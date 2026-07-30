import { useEffect, useState } from 'react'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Transactions from './pages/Transactions/Transactions'
import Projects from './pages/Projects/Projects'
import Accounts from './pages/Accounts/Accounts'
import Categories from './pages/Categories/Categories'
import Customers from './pages/Customers/Customers'
import Suppliers from './pages/Suppliers/Suppliers'
import Employees from './pages/Employees/Employees'
import Login from './pages/Login/Login'
import { authenticate, clearSession, getCurrentUser } from './services/authDb'
import './theme.css'

const pages = {
  'Tổng quan': Dashboard,
  'Giao dịch': Transactions,
  'Dự án': Projects,
  'Tài khoản': Accounts,
  'Danh mục': Categories,
  'Khách hàng': Customers,
  'Nhà cung cấp': Suppliers,
  'Nhân sự': Employees,
}

function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [activeTab, setActiveTab] = useState('Giao dịch')
  const ActivePage = pages[activeTab]

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setAuthReady(true))
  }, [])

  const login = async (username, password) => {
    const account = await authenticate(username, password)
    if (!account) return false
    setUser(account)
    return true
  }

  const logout = async () => {
    await clearSession()
    setUser(null)
  }

  if (!authReady) return <div className="auth-loading">Đang tải dữ liệu...</div>
  if (!user) return <Login onLogin={login} />

  return (
    <AppLayout activeTab={activeTab} user={user} onLogout={logout} onNavigate={setActiveTab}>
      <ActivePage />
    </AppLayout>
  )
}

export default App

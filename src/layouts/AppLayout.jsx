import { useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'

function AppLayout({ activeTab, user, onLogout, onNavigate, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`app ${collapsed ? 'is-collapsed' : ''}`}>
      <Sidebar
        active={activeTab}
        collapsed={collapsed}
        user={user}
        onLogout={onLogout}
        onToggle={() => setCollapsed((value) => !value)}
        onNavigate={onNavigate}
      />
      {children}
    </div>
  )
}

export default AppLayout

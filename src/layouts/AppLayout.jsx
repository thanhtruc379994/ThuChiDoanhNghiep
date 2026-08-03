import { useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import { Box } from '@mui/material'

function AppLayout({ activeTab, user, onLogout, onNavigate, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Box className={`app ${collapsed ? 'is-collapsed' : ''}`} sx={{ display: 'grid', minHeight: '100vh' }}>
      <Sidebar
        active={activeTab}
        collapsed={collapsed}
        user={user}
        onLogout={onLogout}
        onToggle={() => setCollapsed((value) => !value)}
        onNavigate={onNavigate}
      />
      {children}
    </Box>
  )
}

export default AppLayout

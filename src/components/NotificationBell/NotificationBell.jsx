import { useState } from 'react'
import NotificationPanel from '../NotificationPanel/NotificationPanel'
import { Badge, IconButton, Tooltip } from '@mui/material'
import { NotificationsOutlined } from '@mui/icons-material'

function NotificationBell({ className = 'bell', count = 15 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Tooltip title="Thông báo"><IconButton className={className} onClick={() => setOpen(true)} aria-label="Mở thông báo"><Badge badgeContent={count} color="error"><NotificationsOutlined /></Badge></IconButton></Tooltip>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </>
  )
}

export default NotificationBell

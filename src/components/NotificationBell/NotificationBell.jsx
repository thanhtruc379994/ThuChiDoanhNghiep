import { useState } from 'react'
import bellIcon from '../../assets/bell.png'
import NotificationPanel from '../NotificationPanel/NotificationPanel'

function NotificationBell({ className = 'bell', count = 15 }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className={className} onClick={() => setOpen(true)} aria-label="Mở thông báo">
        <img src={bellIcon} alt="" /><sup>{count}</sup>
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </>
  )
}

export default NotificationBell

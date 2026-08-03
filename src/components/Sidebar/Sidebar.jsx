import { useState } from 'react'
import { Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { AccountBalanceWallet, Category, ChevronLeft, ChevronRight, Dashboard, FolderCopy, Groups, Logout, PeopleAlt, ReceiptLong, Store } from '@mui/icons-material'
import LogoutDialog from '../LogoutDialog/LogoutDialog'

const sidebarItems = [
  { icon: Dashboard, label: 'Tổng quan' }, { icon: ReceiptLong, label: 'Giao dịch' },
  { icon: FolderCopy, label: 'Dự án' }, { icon: AccountBalanceWallet, label: 'Tài khoản' },
  { icon: Category, label: 'Danh mục' }, { icon: PeopleAlt, label: 'Khách hàng' },
  { icon: Store, label: 'Nhà cung cấp' }, { icon: Groups, label: 'Nhân sự' },
]

function Sidebar({ active = 'Giao dịch', collapsed, user, onLogout, onToggle, onNavigate }) {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const width = collapsed ? 76 : 232
  return <>
    <Drawer variant="permanent" sx={{ width, flexShrink: 0, '& .MuiDrawer-paper': { width, boxSizing: 'border-box', position: 'sticky', height: '100vh', overflowX: 'hidden', transition: 'width 180ms ease', borderRightColor: 'divider' } }}>
      <Box sx={{ minHeight: 112, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 1.5, px: collapsed ? 1 : 2.25 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, fontWeight: 800 }}>S</Avatar>
        {!collapsed && <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>THU CHI<br />DOANH NGHIỆP</Typography>}
      </Box>
      <Divider />
      <IconButton onClick={onToggle} aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'} sx={{ position: 'absolute', right: -17, top: 24, zIndex: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', boxShadow: 1, '&:hover': { bgcolor: 'background.paper' } }}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</IconButton>
      <List sx={{ flex: 1, px: 1.25, py: 1.5 }}>
        {sidebarItems.map(({ icon: Icon, label }) => <Tooltip key={label} title={collapsed ? label : ''} placement="right">
          <ListItemButton selected={active === label} onClick={() => onNavigate?.(label)} sx={{ minHeight: 48, mb: .5, px: collapsed ? 1.6 : 2, justifyContent: collapsed ? 'center' : 'flex-start', '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, '& .MuiListItemIcon-root': { color: 'inherit' } } }}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: 'text.secondary' }}><Icon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />}
          </ListItemButton>
        </Tooltip>)}
      </List>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 12 }}>{user?.initials || 'QT'}</Avatar>
        {!collapsed && <Box sx={{ minWidth: 0, flex: 1 }}><Typography noWrap variant="body2" fontWeight={700}>{user?.name || 'Quản trị viên'}</Typography><Typography noWrap variant="caption" color="text.secondary">Tài khoản nội bộ</Typography></Box>}
        {!collapsed && <Tooltip title="Đăng xuất"><IconButton size="small" color="error" onClick={() => setLogoutOpen(true)}><Logout fontSize="small" /></IconButton></Tooltip>}
      </Box>
    </Drawer>
    {logoutOpen && <LogoutDialog onCancel={() => setLogoutOpen(false)} onConfirm={() => { setLogoutOpen(false); onLogout?.() }} />}
  </>
}

export default Sidebar

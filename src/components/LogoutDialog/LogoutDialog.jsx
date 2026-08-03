import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

function LogoutDialog({ onCancel, onConfirm }) {
  return <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>Xác nhận đăng xuất</DialogTitle>
    <DialogContent><DialogContentText>Bạn có chắc muốn đăng xuất khỏi hệ thống?</DialogContentText></DialogContent>
    <DialogActions><Button onClick={onCancel} color="inherit">Hủy</Button><Button onClick={onConfirm} color="error" variant="contained">Đăng xuất</Button></DialogActions>
  </Dialog>
}

export default LogoutDialog

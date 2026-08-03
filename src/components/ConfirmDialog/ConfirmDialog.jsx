import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export default function ConfirmDialog({ title = 'Xác nhận xóa', message, onCancel, onConfirm }) {
  return <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent><DialogContentText>{message}</DialogContentText></DialogContent>
    <DialogActions><Button onClick={onCancel} color="inherit">Hủy</Button><Button onClick={onConfirm} color="error" variant="contained">Xóa</Button></DialogActions>
  </Dialog>
}

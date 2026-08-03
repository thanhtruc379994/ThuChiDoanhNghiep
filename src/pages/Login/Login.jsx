import { useState } from 'react'
import { Alert, Avatar, Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Link, Paper, TextField, Typography } from '@mui/material'
import { AccountBalanceWallet, Visibility, VisibilityOff } from '@mui/icons-material'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('')
    try { if (!await onLogin(username, password)) setError('Tên đăng nhập hoặc mật khẩu không đúng.') }
    catch { setError('Không thể truy cập dữ liệu đăng nhập. Vui lòng thử lại.') }
    finally { setSubmitting(false) }
  }

  return <Box component="main" sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(380px,.95fr) minmax(480px,1.05fr)' } }}>
    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', p: { md: 6, lg: 9 }, color: '#fff', bgcolor: '#1a1e26', backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(211,173,95,.26), transparent 28%), linear-gradient(145deg,#171b24,#303845)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Avatar sx={{ bgcolor: 'primary.main' }}>S</Avatar><Typography variant="subtitle2" fontWeight={800} letterSpacing={1.5}>THU CHI DOANH NGHIỆP</Typography></Box>
      <Box><Typography variant="overline" color="primary.light" letterSpacing={3}>QUẢN TRỊ TÀI CHÍNH</Typography><Typography variant="h2" sx={{ mt: 1.5, fontSize: { md: 43, lg: 58 }, lineHeight: 1.12 }}>Kiểm soát dòng tiền.<br />Vững vàng tăng trưởng.</Typography><Typography sx={{ mt: 3, maxWidth: 540, color: '#c8ced8', lineHeight: 1.8 }}>Theo dõi thu chi, công nợ và hiệu quả tài chính doanh nghiệp trong một không gian làm việc thống nhất.</Typography></Box>
      <Typography variant="caption" sx={{ color: '#9199a7' }}>© 2026 Ứng dụng quản trị nội bộ</Typography>
    </Box>
    <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, sm: 5 } }}>
      <Paper component="form" onSubmit={submit} sx={{ width: '100%', maxWidth: 430, p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider', boxShadow: '0 12px 40px rgba(16,24,40,.08)' }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, mb: 3 }}><AccountBalanceWallet /></Avatar>
        <Typography variant="overline" color="primary.main" letterSpacing={2}>CHÀO MỪNG TRỞ LẠI</Typography>
        <Typography variant="h4" sx={{ mt: .5, fontWeight: 700 }}>Đăng nhập hệ thống</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1, mb: 3 }}>Nhập thông tin tài khoản để tiếp tục.</Typography>
        <TextField fullWidth autoFocus autoComplete="username" label="Tên đăng nhập" value={username} onChange={(e) => { setUsername(e.target.value); setError('') }} sx={{ mb: 2 }} />
        <TextField fullWidth type={showPassword ? 'text' : 'password'} autoComplete="current-password" label="Mật khẩu" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(v => !v)} edge="end" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1.5 }}><FormControlLabel control={<Checkbox defaultChecked size="small" />} label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>} /><Link component="button" type="button" variant="body2" underline="hover">Quên mật khẩu?</Link></Box>
        <Button fullWidth size="large" variant="contained" type="submit" disabled={submitting} startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
        <Typography align="center" color="text.secondary" variant="caption" sx={{ display: 'block', mt: 2 }}>Tài khoản demo: <b>admin</b> · Mật khẩu: <b>123456</b></Typography>
      </Paper>
    </Box>
  </Box>
}

export default Login


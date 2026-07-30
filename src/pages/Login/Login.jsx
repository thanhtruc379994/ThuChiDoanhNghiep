import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const authenticated = await onLogin(username, password)
      if (!authenticated) setError('Tên đăng nhập hoặc mật khẩu không đúng.')
    } catch {
      setError('Không thể truy cập dữ liệu đăng nhập. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="login-brand"><span>S</span> THU CHI DOANH NGHIỆP</div>
        <div className="login-intro__content">
          <p className="login-kicker">QUẢN TRỊ TÀI CHÍNH</p>
          <h1>Kiểm soát dòng tiền.<br />Vững vàng tăng trưởng.</h1>
          <p>Theo dõi thu chi, công nợ và hiệu quả tài chính doanh nghiệp trong một không gian làm việc thống nhất.</p>
        </div>
        <small>© 2026 Ứng dụng quản trị nội bộ</small>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="login-card__mark">S</div>
          <p className="login-card__eyebrow">CHÀO MỪNG TRỞ LẠI</p>
          <h2>Đăng nhập hệ thống</h2>
          <p className="login-card__hint">Nhập thông tin tài khoản để tiếp tục.</p>

          <label>
            <span>Tên đăng nhập</span>
            <div className="login-input">
              {/*<b aria-hidden="true"></b>*/}
              <input
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(event) => { setUsername(event.target.value); setError('') }}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </label>

          <label>
            <span>Mật khẩu</span>
            <div className="login-input">
              {/*<b aria-hidden="true"></b>*/}
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError('') }}
                placeholder="Nhập mật khẩu"
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.3A10.5 10.5 0 0112 4c5.5 0 9 5.2 9 5.2a15.7 15.7 0 01-3.1 3.7M6.2 6.2C4.2 7.5 3 9.2 3 9.2s3.5 5.2 9 5.2c1 0 1.9-.2 2.7-.4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 12s3.5-5.2 9-5.2 9 5.2 9 5.2-3.5 5.2-9 5.2S3 12 3 12z" />
                    <circle cx="12" cy="12" r="2.6" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="login-options">
            <label><input type="checkbox" defaultChecked /> Ghi nhớ đăng nhập</label>
            <button type="button">Quên mật khẩu?</button>
          </div>

          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? 'Đang đăng nhập...' : <>Đăng nhập</>}
          </button>
          <p className="login-demo">Tài khoản demo: <b>admin</b> · Mật khẩu: <b>123456</b></p>
        </form>
      </section>
    </main>
  )
}

export default Login

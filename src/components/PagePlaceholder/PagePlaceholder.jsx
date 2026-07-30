import './PagePlaceholder.css'

function PagePlaceholder({ title, description }) {
  return (
    <main className="placeholder-page">
      <div>
        <span>QUẢN LÝ THU CHI DOANH NGHIỆP</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </main>
  )
}

export default PagePlaceholder

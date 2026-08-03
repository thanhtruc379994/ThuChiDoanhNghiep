import './PagePlaceholder.css'
import { Main } from '../MaterialPrimitives/MaterialPrimitives'

function PagePlaceholder({ title, description }) {
  return (
    <Main className="placeholder-page">
      <div>
        <span>QUẢN LÝ THU CHI DOANH NGHIỆP</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Main>
  )
}

export default PagePlaceholder


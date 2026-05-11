import './PageHeader.css'

function PageHeader({ title, subtitle, right, kicker }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        {kicker && <span className="page-kicker">{kicker}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {right && (
        <div className="page-header-right">
          {right}
        </div>
      )}
    </div>
  )
}

export default PageHeader

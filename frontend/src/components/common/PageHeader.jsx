import './PageHeader.css'

function PageHeader({ title, subtitle, right }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
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
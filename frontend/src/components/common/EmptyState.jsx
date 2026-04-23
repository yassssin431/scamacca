import './EmptyState.css'

function EmptyState({ title = 'No data found', message = 'There is nothing to display here yet.' }) {
  return (
    <div className="ui-empty-state">
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  )
}

export default EmptyState
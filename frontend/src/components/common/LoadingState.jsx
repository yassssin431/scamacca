import './LoadingState.css'

function LoadingState({ message = 'Loading data...' }) {
  return (
    <div className="ui-loading-state">
      <div className="ui-spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export default LoadingState
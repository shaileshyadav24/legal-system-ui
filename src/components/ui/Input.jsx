import './Input.scss'

function Input({ label, ...props }) {
  return (
    <label className="ui-input-wrapper">
      {label && <span className="ui-input-label">{label}</span>}
      <input className="ui-input" {...props} />
    </label>
  )
}

export default Input
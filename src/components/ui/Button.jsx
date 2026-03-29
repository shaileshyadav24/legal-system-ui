import './Button.scss'

function Button({ children, onClick, variant = 'primary', size = 'md', className = '', ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
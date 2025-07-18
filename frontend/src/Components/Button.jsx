
const Button = ({text,className,onClick,type,disabled}) => {
  return (
    <button 
    className={`bg-primary text-white px-4 py-2 hover:bg-primary-dark rounded-lg cursor-pointer transition ${className}`}
    onClick={onClick}
    type={type}
    disabled={disabled}
    >
     {text} 
    </button>
  )
}

export default Button

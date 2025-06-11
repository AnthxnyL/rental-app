function CircleButton({ onClick, children, className = '', disabled = false, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      disabled={disabled} icon={icon}
    >
      {children}
    </button>
  );
}

export default CircleButton;